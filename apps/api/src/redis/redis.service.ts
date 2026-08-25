import { Injectable, OnModuleDestroy } from "@nestjs/common";
import Redis from "ioredis";

/**
 * Real Redis over ioredis when REDIS_URL is set; otherwise a per-instance
 * in-memory fallback keeps auth flows working on single-node free tiers.
 * Keyspace contract unchanged (rt:{userId}:{jti}).
 */
@Injectable()
export class RedisService implements OnModuleDestroy {
  readonly client: Pick<
    Redis,
    "set" | "get" | "del" | "scan"
  >;

  private readonly redis?: Redis;
  private readonly memory = new Map<string, string>();

  constructor() {
    const url = process.env.REDIS_URL;
    if (url && !url.startsWith("memory:")) {
      this.redis = new Redis(url, {
        maxRetriesPerRequest: 2,
        lazyConnect: false,
      });
      this.client = this.redis;
    } else {
      const self = this;
      this.client = {
        // denormalized subset — signatures match ioredis usage above
        set(key: string, value: string, ttlMode?: string, ttl?: number) {
          self.memory.set(key, value);
          if (ttlMode === "EX" && ttl) {
            setTimeout(() => self.memory.delete(key), ttl * 1000).unref?.();
          }
          return Promise.resolve("OK");
        },
        get(key: string) {
          return Promise.resolve(self.memory.get(key) ?? null);
        },
        del(...keys: string[]) {
          let n = 0;
          for (const k of keys) {
            if (self.memory.delete(k)) n++;
          }
          return Promise.resolve(n);
        },
        scan(cursor: string, _match: string, pattern: string, _count: string, count: number) {
          const all = [...self.memory.keys()].filter((k) =>
            new RegExp("^" + pattern.replace(/\*/g, ".*") + "$").test(k)
          );
          const slice = all.slice(0, count);
          return Promise.resolve([
            all.length > slice.length ? String(slice.length) : "0",
            slice,
          ] as [string, string[]]);
        },
      } as unknown as Pick<Redis, "set" | "get" | "del" | "scan">;
    }
  }

  async onModuleDestroy(): Promise<void> {
    await this.redis?.quit().catch(() => this.redis?.disconnect());
  }
}

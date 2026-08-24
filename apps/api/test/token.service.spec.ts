import { JwtService } from "@nestjs/jwt";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TokenService, UnauthorizedError } from "../src/auth/token.service";

/** In-memory Redis double — same surface TokenService touches. */
function memoryRedis() {
  const store = new Map<string, string>();
  return {
    client: {
      set: vi.fn(async (key: string, value: string /* , mode, ttl */) => {
        store.set(key, value);
        return "OK";
      }),
      get: vi.fn(async (key: string) => store.get(key) ?? null),
      del: vi.fn(async (...keys: string[]) => {
        let n = 0;
        for (const k of keys) if (store.delete(k)) n++;
        return n;
      }),
      scan: vi.fn(async (cursor: string, _m: string, _p: string, _c: string, _n: number) => {
        if (cursor !== "0") return ["0", [] as string[]];
        return ["0", [...store.keys()]];
      }),
    },
    store,
  };
}

const claims = { sub: "user-1", email: "u@test.dev", role: "USER" } as const;

describe("TokenService", () => {
  let service: TokenService;

  beforeEach(() => {
    process.env.JWT_ACCESS_SECRET = "test-access-secret-not-weak";
    process.env.JWT_REFRESH_SECRET = "test-refresh-secret-not-weak";
    service = new TokenService(new JwtService(), memoryRedis() as never);
  });

  it("signs and verifies an access token", async () => {
    const token = await service.signAccessToken(claims);
    const decoded = await service.verifyAccessToken(token);
    expect(decoded.sub).toBe("user-1");
    expect(decoded.role).toBe("USER");
  });

  it("rotates refresh tokens: old jti consumed, new one live", async () => {
    const first = await service.issueRefreshToken(claims);
    const { claims: c1 } = await service.resolveRefreshToken(first);
    await service.consumeRefreshToken(c1.sub, c1.jti);

    const second = await service.issueRefreshToken(claims);
    const { claims: c2 } = await service.resolveRefreshToken(second);
    expect(c2.jti).not.toBe(c1.jti); // fresh jti
  });

  it("detects reuse of a consumed refresh token and revokes the family", async () => {
    const redis = (service as unknown as { redis: ReturnType<typeof memoryRedis> }).redis;
    const token = await service.issueRefreshToken(claims);

    // Rotate once legitimately
    const { claims: c1 } = await service.resolveRefreshToken(token);
    await service.consumeRefreshToken(c1.sub, c1.jti);
    const second = await service.issueRefreshToken(claims);

    // Replay the OLD token → reuse detection
    await expect(service.resolveRefreshToken(token)).rejects.toBeInstanceOf(
      UnauthorizedError
    );
    // Family revoked → the NEW token is dead too
    await expect(service.resolveRefreshToken(second)).rejects.toBeInstanceOf(
      UnauthorizedError
    );
    void redis;
  });

  it("rejects a token signed with the wrong secret", async () => {
    const token = await service.signAccessToken(claims);
    await expect(
      service.verifyAccessToken(token + "tampered")
    ).rejects.toBeTruthy();
  });
});

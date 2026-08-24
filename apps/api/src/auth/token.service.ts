import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { randomUUID } from "crypto";
import { RedisService } from "../redis/redis.service";

export const ACCESS_COOKIE = "calc_access";
export const REFRESH_COOKIE = "calc_refresh";
const ACCESS_TTL_SEC = 15 * 60; // 15 min per SECURITY.md
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60; // 30 days

export interface AccessClaims {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
}

export interface RefreshClaims extends AccessClaims {
  jti: string;
}

/** Redis keyspace: rt:{userId}:{jti} — see DATABASE-SCHEMA.md */
const refreshKey = (userId: string, jti: string) => `rt:${userId}:${jti}`;

@Injectable()
export class TokenService {
  constructor(
    private readonly jwt: JwtService,
    private readonly redis: RedisService
  ) {}

  async signAccessToken(claims: AccessClaims): Promise<string> {
    return this.jwt.signAsync(claims, {
      secret: this.accessSecret(),
      expiresIn: ACCESS_TTL_SEC,
    });
  }

  async verifyAccessToken(token: string): Promise<AccessClaims> {
    return this.jwt.verifyAsync<AccessClaims>(token, {
      secret: this.accessSecret(),
    });
  }

  /** Issues a refresh token and registers its jti in Redis. */
  async issueRefreshToken(claims: AccessClaims): Promise<string> {
    const refresh: RefreshClaims = { ...claims, jti: randomUUID() };
    const token = await this.jwt.signAsync(refresh, {
      secret: this.refreshSecret(),
      expiresIn: REFRESH_TTL_SEC,
    });
    await this.redis.client.set(
      refreshKey(claims.sub, refresh.jti),
      "1",
      "EX",
      REFRESH_TTL_SEC
    );
    return token;
  }

  /**
   * Verifies a refresh token's signature AND its live jti. A valid-signature
   * token with a missing jti means reuse of an already-rotated token → the
   * whole family is revoked (SECURITY.md reuse detection).
   */
  async resolveRefreshToken(
    token: string
  ): Promise<{ claims: RefreshClaims; revokeFamily: () => Promise<void> }> {
    let claims: RefreshClaims;
    try {
      claims = await this.jwt.verifyAsync<RefreshClaims>(token, {
        secret: this.refreshSecret(),
      });
    } catch {
      throw new UnauthorizedError("Invalid refresh token");
    }

    const key = refreshKey(claims.sub, claims.jti);
    const live = await this.redis.client.get(key);
    if (!live) {
      // Reuse detected — kill every session for this user.
      await this.revokeAllForUser(claims.sub);
      throw new UnauthorizedError("Refresh token reuse detected");
    }
    return { claims, revokeFamily: async () => void (await this.revokeAllForUser(claims.sub)) };
  }

  /** Deletes the old jti (rotation) before a new one is issued. */
  async consumeRefreshToken(userId: string, jti: string): Promise<void> {
    await this.redis.client.del(refreshKey(userId, jti));
  }

  async revokeAllForUser(userId: string): Promise<number> {
    let deleted = 0;
    let cursor = "0";
    do {
      const [next, keys] = await this.redis.client.scan(
        cursor,
        "MATCH",
        `rt:${userId}:*`,
        "COUNT",
        100
      );
      cursor = next;
      if (keys.length > 0) deleted += await this.redis.client.del(...keys);
    } while (cursor !== "0");
    return deleted;
  }

  static cookieOptions(kind: "access" | "refresh") {
    return {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: kind === "refresh" ? "/api/v1/auth" : "/",
      maxAge:
        kind === "access" ? ACCESS_TTL_SEC * 1000 : REFRESH_TTL_SEC * 1000,
    };
  }

  private accessSecret(): string {
    return requireEnv("JWT_ACCESS_SECRET");
  }

  private refreshSecret(): string {
    return requireEnv("JWT_REFRESH_SECRET");
  }
}

export class UnauthorizedError extends Error {}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value.startsWith("change-me")) {
    throw new Error(`Missing/weak ${name} — set it in apps/api/.env`);
  }
  return value;
}

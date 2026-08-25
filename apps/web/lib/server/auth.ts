import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { NextResponse } from "next/server";
import { db } from "./db";

export interface SessionClaims {
  sub: string;
  email: string;
  role: "USER" | "ADMIN";
}

const ACCESS_TTL_SEC = 60 * 60 * 24 * 7;

export const ACCESS_COOKIE = "calc_access";

function secret(): Uint8Array {
  const value =
    process.env.JWT_ACCESS_SECRET ?? process.env.JWT_REFRESH_SECRET ?? "";
  if (!value || value.startsWith("change-me")) {
    throw new Error("JWT secret missing — set JWT_ACCESS_SECRET");
  }
  return new TextEncoder().encode(value);
}

export function hashPassword(password: string): string {
  const salt = randomBytes(16);
  const hash = scryptSync(password, salt, 64);
  return `scrypt$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, saltHex, hashHex] = stored.split("$");
  if (scheme !== "scrypt" || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, Buffer.from(saltHex, "hex"), 64);
  return timingSafeEqual(expected, actual);
}

export async function signSession(claims: SessionClaims): Promise<string> {
  return new SignJWT({ email: claims.email, role: claims.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(claims.sub)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .sign(secret());
}

export async function verifySession(
  token: string
): Promise<SessionClaims | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return {
      sub: payload.sub!,
      email: String(payload.email),
      role: payload.role === "ADMIN" ? "ADMIN" : "USER",
    };
  } catch {
    return null;
  }
}

export function sessionCookie(token: string) {
  return {
    name: ACCESS_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ACCESS_TTL_SEC,
  };
}

export function clearCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}

export async function getSession(
  req: Request
): Promise<SessionClaims | null> {
  const cookieHeader = req.headers.get("cookie") ?? "";
  const match = cookieHeader.match(/(?:^|;\s*)calc_access=([^;]+)/);
  if (!match) return null;
  return verifySession(decodeURIComponent(match[1]));
}

export function json(data: unknown, status = 200) {
  return NextResponse.json(data as Record<string, unknown>, { status });
}

export async function requireUser(
  req: Request
): Promise<{ claims: SessionClaims } | { response: NextResponse }> {
  const claims = await getSession(req);
  if (!claims) return { response: json({ message: "Unauthorized" }, 401) };
  return { claims };
}

export async function requireAdmin(
  req: Request
): Promise<{ claims: SessionClaims } | { response: NextResponse }> {
  const res = await requireUser(req);
  if ("response" in res) return res;
  if (res.claims.role !== "ADMIN")
    return { response: json({ message: "Forbidden" }, 403) };
  return res;
}

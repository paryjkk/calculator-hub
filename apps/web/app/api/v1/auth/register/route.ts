import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/server/db";
import {
  hashPassword,
  json,
  signSession,
  sessionCookie,
} from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    displayName?: string;
    email?: string;
    password?: string;
  } | null;

  const displayName = body?.displayName?.trim() ?? "";
  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (displayName.length < 2 || displayName.length > 40)
    return json({ message: "Display name must be 2-40 characters" }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ message: "Invalid email address" }, 400);
  if (password.length < 8)
    return json({ message: "Password must be at least 8 characters" }, 400);

  try {
    const user = await db.user.create({
      data: {
        email,
        displayName,
        passwordHash: hashPassword(password),
      },
    });
    const token = await signSession({
      sub: user.id,
      email: user.email,
      role: user.role,
    });
    const res = json(
      { user: { id: user.id, email: user.email, displayName: user.displayName, role: user.role } },
      201
    );
    res.cookies.set(sessionCookie(token));
    return res;
  } catch (e: unknown) {
    const code = (e as { code?: string }).code;
    if (code === "P2002") return json({ message: "Email already registered" }, 409);
    throw e;
  }
}

export function GET() {
  return json({ message: "Method not allowed" }, 405);
}

void scryptSync;
void timingSafeEqual;
void randomBytes;

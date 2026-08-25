import { db } from "@/lib/server/db";
import {
  json,
  signSession,
  sessionCookie,
  verifyPassword,
} from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    password?: string;
  } | null;

  const email = body?.email?.trim().toLowerCase() ?? "";
  const password = body?.password ?? "";

  if (!email || !password)
    return json({ message: "Email and password are required" }, 400);

  const user = await db.user.findUnique({ where: { email } });
  // Same generic error for unknown email and wrong password (no enumeration).
  if (!user || !verifyPassword(password, user.passwordHash))
    return json({ message: "Invalid credentials" }, 401);

  const token = await signSession({
    sub: user.id,
    email: user.email,
    role: user.role,
  });
  const res = json({
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
  });
  res.cookies.set(sessionCookie(token));
  return res;
}

import { db } from "@/lib/server/db";
import { json } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as {
    email?: string;
    body?: string;
  } | null;

  const email = body?.email?.trim() ?? "";
  const message = body?.body?.trim() ?? "";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    return json({ message: "Invalid email address" }, 400);
  if (message.length < 5)
    return json({ message: "Message is too short" }, 400);

  await db.contactMessage.create({
    data: { email, body: message.slice(0, 4000) },
  });
  return json({ ok: true });
}

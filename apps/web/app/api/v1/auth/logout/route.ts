import { json } from "@/lib/server/auth";
import { clearCookie } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function POST() {
  const res = json({ ok: true });
  res.cookies.set(clearCookie());
  return res;
}

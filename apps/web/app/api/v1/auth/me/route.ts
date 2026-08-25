import { db } from "@/lib/server/db";
import { json, requireUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const user = await db.user.findUnique({
    where: { id: auth.claims.sub },
    select: { id: true, email: true, displayName: true, role: true },
  });
  if (!user) return json({ message: "Unauthorized" }, 401);
  return json(user);
}

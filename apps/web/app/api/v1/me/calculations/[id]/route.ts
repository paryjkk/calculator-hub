import { db } from "@/lib/server/db";
import { json, requireUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  await db.savedCalculation.deleteMany({
    where: { id, userId: auth.claims.sub },
  });
  return json({ ok: true });
}

import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  if (id === auth.claims.sub)
    return json({ message: "You cannot delete yourself" }, 403);

  try {
    await db.user.delete({ where: { id } });
    return json({ ok: true });
  } catch {
    return json({ message: "Not found" }, 404);
  }
}

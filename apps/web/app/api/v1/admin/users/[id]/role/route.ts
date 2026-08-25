import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const { id } = await ctx.params;
  const body = (await req.json().catch(() => null)) as { role?: string } | null;

  if (body?.role !== "USER" && body?.role !== "ADMIN")
    return json({ message: "role must be USER or ADMIN" }, 400);
  if (id === auth.claims.sub && body.role !== "ADMIN")
    return json({ message: "You cannot demote yourself" }, 403);

  try {
    const user = await db.user.update({
      where: { id },
      data: { role: body.role },
      select: { id: true, email: true, displayName: true, role: true },
    });
    return json(user);
  } catch {
    return json({ message: "Not found" }, 404);
  }
}

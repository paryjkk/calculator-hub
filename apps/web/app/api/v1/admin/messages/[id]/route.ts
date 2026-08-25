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
  const body = (await req.json().catch(() => null)) as {
    handled?: boolean;
  } | null;

  if (typeof body?.handled !== "boolean")
    return json({ message: "handled must be boolean" }, 400);

  try {
    const row = await db.contactMessage.update({
      where: { id },
      data: { handled: body.handled },
    });
    return json(row);
  } catch {
    return json({ message: "Not found" }, 404);
  }
}

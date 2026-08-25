import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const url = new URL(req.url);
  const query = url.searchParams.get("query")?.toLowerCase();
  const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);

  const users = await db.user.findMany({
    where: query
      ? { email: { contains: query, mode: "insensitive" } }
      : undefined,
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      createdAt: true,
      _count: { select: { savedCalculations: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 25,
    skip: (page - 1) * 25,
  });
  return json(users);
}

import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const now = Date.now();
  const since7d = new Date(now - 7 * 864e5);
  const [totalCalculations, totalUsers, newUsers7d] = await Promise.all([
    db.usageEvent.count(),
    db.user.count(),
    db.user.count({ where: { createdAt: { gte: since7d } } }),
  ]);

  const events = await db.usageEvent.findMany({
    where: { createdAt: { gte: new Date(now - 30 * 864e5) } },
    select: { slug: true, createdAt: true },
  });

  const byDay = new Map<string, number>();
  for (let d = 6; d >= 0; d--) {
    byDay.set(new Date(now - d * 864e5).toISOString().slice(0, 10), 0);
  }
  const bySlug = new Map<string, number>();
  for (const e of events) {
    const day = e.createdAt.toISOString().slice(0, 10);
    if (byDay.has(day)) byDay.set(day, (byDay.get(day) ?? 0) + 1);
    bySlug.set(e.slug, (bySlug.get(e.slug) ?? 0) + 1);
  }

  return json({
    totalCalculations,
    totalUsers,
    newUsers7d,
    last7days: [...byDay.entries()].map(([day, count]) => ({ day, count })),
    topCalculators: [...bySlug.entries()]
      .map(([slug, count]) => ({ slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10),
  });
}

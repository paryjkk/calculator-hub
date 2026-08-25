import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

const STRING_FIELDS = [
  "titleEn",
  "titleAr",
  "shortEn",
  "shortAr",
  "descEn",
  "descAr",
] as const;

function sanitize(body: Record<string, unknown>) {
  const data: Record<string, string | boolean | number> = {};
  for (const k of STRING_FIELDS) {
    const v = body[k];
    if (typeof v === "string") data[k] = v.slice(0, 1000);
  }
  if (typeof body.hidden === "boolean") data.hidden = body.hidden;
  if (typeof body.sortOrder === "number" && Number.isInteger(body.sortOrder))
    data.sortOrder = body.sortOrder;
  return data;
}

export async function PUT(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const { slug } = await ctx.params;
  if (!CALCULATOR_SLUGS.has(slug))
    return json({ message: "Unknown calculator" }, 404);

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const data = sanitize(body);

  const row = await db.calculatorOverride.upsert({
    where: { slug },
    update: data,
    create: { slug, ...data },
  });
  return json(row);
}

export async function DELETE(
  req: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const { slug } = await ctx.params;
  await db.calculatorOverride.deleteMany({ where: { slug } });
  return json({ ok: true });
}

import { CALCULATOR_DEFS } from "@calc/shared";
const CALCULATOR_SLUGS = new Set(CALCULATOR_DEFS.map((d) => d.slug));

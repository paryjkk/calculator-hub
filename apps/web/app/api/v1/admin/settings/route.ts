import { db } from "@/lib/server/db";
import { json, requireAdmin } from "@/lib/server/auth";

export const runtime = "nodejs";

const ALLOWED_KEYS = new Set([
  "siteNameEn",
  "siteNameAr",
  "adsenseClient",
  "adsenseSlotTop",
  "adsenseSlotBottom",
  "contactEmail",
]);

export async function GET(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;
  return json(await db.siteSetting.findMany());
}

export async function PUT(req: Request) {
  const auth = await requireAdmin(req);
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => null)) as {
    key?: string;
    value?: string;
  } | null;

  if (!body?.key || !ALLOWED_KEYS.has(body.key) || typeof body.value !== "string")
    return json({ message: "Invalid setting key or value" }, 400);

  const row = await db.siteSetting.upsert({
    where: { key: body.key },
    update: { value: body.value.slice(0, 500) },
    create: { key: body.key, value: body.value.slice(0, 500) },
  });
  return json(row);
}

import { db } from "@/lib/server/db";
import { json, requireUser } from "@/lib/server/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const items = await db.savedCalculation.findMany({
    where: { userId: auth.claims.sub },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return json(items);
}

export async function POST(req: Request) {
  const auth = await requireUser(req);
  if ("response" in auth) return auth.response;

  const body = (await req.json().catch(() => null)) as {
    slug?: string;
    name?: string;
    inputs?: unknown;
    result?: unknown;
  } | null;

  if (!body?.slug || !body.name || typeof body.inputs !== "object" || typeof body.result !== "object")
    return json({ message: "slug, name, inputs and result are required" }, 400);

  const item = await db.savedCalculation.create({
    data: {
      userId: auth.claims.sub,
      slug: body.slug,
      name: String(body.name).slice(0, 80),
      inputs: body.inputs as object,
      result: body.result as object,
    },
  });
  return json(item, 201);
}

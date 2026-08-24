import { NextResponse } from "next/server";
import { randomInt, randomUUID } from "node:crypto";
import { CalcError, RUNNERS } from "@calc/engine";
import { getDef, validateInput } from "@calc/shared";

export const runtime = "nodejs";

const SEEDED_SLUGS = new Set(["random-number", "dice-roller", "random-picker"]);
const NATIVE_SLUGS = new Set(["password-generator", "uuid-generator"]);

type Values = Record<string, number | string>;

function charset(onOff: unknown, chars: string): string {
  return onOff === "on" ? chars : "";
}

function generatePassword(v: Values): string {
  const length = Number(v.length);
  const sets = [
    charset(v.uppercase, "ABCDEFGHJKLMNPQRSTUVWXYZ"),
    charset(v.lowercase, "abcdefghijkmnpqrstuvwxyz"),
    charset(v.digits, "23456789"),
    charset(v.symbols, "!@#$%^&*()-_=+[]{};:,.?"),
  ].filter((s) => s.length > 0);

  if (sets.length === 0) throw new CalcError("ERR_NO_CHARSETS");

  const picked = sets.map((s) => s[randomInt(0, s.length)]);
  while (picked.length < length) {
    const set = sets[randomInt(0, sets.length)];
    picked.push(set[randomInt(0, set.length)]);
  }
  for (let i = picked.length - 1; i > 0; i--) {
    const j = randomInt(0, i + 1);
    [picked[i], picked[j]] = [picked[j], picked[i]];
  }
  return picked.slice(0, length).join("");
}

function applyServerDefaults(slug: string, values: Values): Values {
  const out = { ...values };
  const def = getDef(slug)!;
  for (const field of def.fields) {
    if (field.serverDefault === "today" && out[field.name] === undefined) {
      out[field.name] = new Date().toISOString().slice(0, 10);
    }
  }
  if (SEEDED_SLUGS.has(slug)) {
    out.seed = randomInt(1, 2 ** 31);
  }
  return out;
}

export async function POST(
  request: Request,
  ctx: { params: Promise<{ slug: string }> }
) {
  const { slug } = await ctx.params;
  const def = getDef(slug);
  if (!def || (!RUNNERS[slug] && !NATIVE_SLUGS.has(slug))) {
    return NextResponse.json(
      { message: `Unknown calculator: ${slug}` },
      { status: 404 }
    );
  }

  const raw = await request.json().catch(() => ({}));
  const result = validateInput(def, (raw ?? {}) as Record<string, unknown>);
  if (!result.ok || !result.values) {
    return NextResponse.json(
      { fieldErrors: result.errors },
      { status: 400 }
    );
  }

  let values = result.values;

  if (slug === "uuid-generator") {
    const count = Math.min(Number(values.count ?? 1), 50);
    return NextResponse.json({
      valuesText: Array.from({ length: count }, () => randomUUID()).join("\n"),
      count,
    });
  }

  if (slug === "password-generator") {
    return NextResponse.json({ password: generatePassword(values) });
  }

  try {
    values = applyServerDefaults(slug, values);
    return NextResponse.json(RUNNERS[slug](values));
  } catch (err) {
    if (err instanceof CalcError) {
      return NextResponse.json({ message: err.code }, { status: 400 });
    }
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}

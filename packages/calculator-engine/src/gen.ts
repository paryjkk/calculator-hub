import { CalcError } from "./calc-error";

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function randomIntsInclusive(
  min: number,
  max: number,
  count: number,
  seed?: number
): number[] {
  if (min > max) throw new CalcError("ERR_RANGE_INVALID");
  const span = max - min + 1;
  const rand = mulberry32(seed ?? 0);
  const out: number[] = [];
  for (let k = 0; k < count; k++) {
    out.push(min + Math.floor(rand() * span));
  }
  return out;
}

export function randomNumber(i: {
  min: number;
  max: number;
  count?: number;
  seed?: number;
}) {
  const values = randomIntsInclusive(i.min, i.max, i.count ?? 1, i.seed);
  return { valuesText: values.join(", "), count: values.length };
}

export function diceRoller(i: {
  sides: number;
  count?: number;
  seed?: number;
}) {
  const rolls = randomIntsInclusive(1, i.sides, i.count ?? 1, i.seed);
  return { rollsText: rolls.join(", "), total: rolls.reduce((s, r) => s + r, 0) };
}

export function randomPicker(i: {
  itemsText: string;
  picks?: number;
  seed?: number;
}) {
  const items = i.itemsText
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t.length > 0);
  if (items.length === 0) throw new CalcError("ERR_EMPTY_LIST");
  const picks = Math.min(i.picks ?? 1, items.length);
  const rand = mulberry32(i.seed ?? 0);
  const pool = [...items];
  const picked: string[] = [];
  for (let k = 0; k < picks; k++) {
    const idx = Math.floor(rand() * pool.length);
    picked.push(pool.splice(idx, 1)[0]);
  }
  return { pickedText: picked.join(", ") };
}

const BASE64_RE = /^[A-Za-z0-9+/]*={0,2}$/;

export function base64Codec(i: { mode: "encode" | "decode"; input: string }) {
  if (i.mode === "encode") {
    return { output: Buffer.from(i.input, "utf8").toString("base64") };
  }
  const trimmed = i.input.trim();
  if (!BASE64_RE.test(trimmed) || trimmed.length % 4 === 1)
    throw new CalcError("ERR_INVALID_BASE64");
  try {
    return { output: Buffer.from(trimmed, "base64").toString("utf8") };
  } catch {
    throw new CalcError("ERR_INVALID_BASE64");
  }
}

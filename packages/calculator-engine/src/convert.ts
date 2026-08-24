import { CalcError } from "./calc-error";
import { round2 } from "./round";
import { UNIT_TABLES } from "@calc/shared";

export function makeUnitConverter(tableKey: string) {
  const table = UNIT_TABLES[tableKey];
  if (!table) throw new Error(`Unknown unit table: ${tableKey}`);

  return function convert(i: { value: number; from: string; to: string }) {
    const f = table.units[i.from];
    const t = table.units[i.to];
    if (!f || !t) throw new CalcError("ERR_INVALID_OPTION");
    return { result: round2((i.value * f.factor) / t.factor) };
  };
}

function toCelsius(v: number, unit: string): number {
  if (unit === "C") return v;
  if (unit === "F") return (v - 32) * (5 / 9);
  return v - 273.15;
}

function fromCelsius(c: number, unit: string): number {
  if (unit === "C") return c;
  if (unit === "F") return c * (9 / 5) + 32;
  return c + 273.15;
}

export function temperatureConvert(i: { value: number; from: string; to: string }) {
  const c = toCelsius(i.value, i.from);
  const out = fromCelsius(c, i.to);
  return { result: round2(out) };
}

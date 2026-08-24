import { CalcError } from "./calc-error";
import { round2 } from "./round";

export function percentageOf(i: { percent: number; ofValue: number }) {
  return { result: round2((i.percent / 100) * i.ofValue) };
}

export function percentChange(i: { fromValue: number; toValue: number }) {
  if (i.fromValue === 0) throw new CalcError("ERR_DIV_BY_ZERO");
  return {
    changePct: round2(((i.toValue - i.fromValue) / Math.abs(i.fromValue)) * 100),
    difference: round2(i.toValue - i.fromValue),
  };
}

function gcd(a: number, b: number): number {
  while (b !== 0) [a, b] = [b, a % b];
  return Math.abs(a);
}

export function fractionSimplify(i: { numerator: number; denominator?: number }) {
  const d = i.denominator ?? 1;
  if (d === 0) throw new CalcError("ERR_DIV_BY_ZERO");
  const g = gcd(i.numerator, d) || 1;
  const n = i.numerator / g;
  const den = d / g;
  return { simplified: den === 1 ? String(n) : `${n}/${den}`, decimal: round2(n / den) };
}

export function decimalToFraction(i: { value: number }) {
  const sign = i.value < 0 ? -1 : 1;
  let x = Math.abs(i.value);
  let num = 1;
  let den = 0;
  let prevNum = 0;
  let prevDen = 1;

  while (true) {
    const whole = Math.floor(x);
    [num, prevNum] = [whole * num + prevNum, num];
    [den, prevDen] = [whole * den + prevDen, den];
    if (den > 10000) break;
    const frac = x - whole;
    if (frac < 1e-9) break;
    x = 1 / frac;
    if (!Number.isFinite(x)) break;
  }

  if (den === 0 || den > 10000) {
    [num, den] = [prevNum, prevDen];
  }

  num *= sign;
  return {
    fraction: den === 1 ? String(num) : `${num}/${den}`,
    roundedDecimal: round2(num / den),
  };
}

export function gcdLcm(i: { a: number; b: number }) {
  const g = gcd(i.a, i.b);
  const lcm = g === 0 ? 0 : Math.abs((i.a / g) * i.b);
  return { gcd: g, lcm };
}

export function primeCheck(i: { n: number }) {
  const n = i.n;
  let smallestFactor: number | null = null;

  if (n >= 2) {
    if (n % 2 === 0) smallestFactor = n === 2 ? 2 : 2;
    else {
      for (let f = 3; f * f <= n; f += 2) {
        if (n % f === 0) {
          smallestFactor = f;
          break;
        }
      }
      if (smallestFactor === null) smallestFactor = n;
    }
  }

  return { isPrimeLabel: smallestFactor !== null && smallestFactor === n, smallestFactor };
}

export function factorial(i: { n: number }) {
  let acc = 1;
  for (let k = 2; k <= i.n; k++) acc *= k;
  return { result: String(acc) };
}

function fmtRoot(x: number): string {
  const s = x.toFixed(6).replace(/\.?0+$/, "");
  return s === "-0" ? "0" : s;
}

export function quadratic(i: { a: number; b: number; c: number }) {
  if (i.a === 0) throw new CalcError("ERR_NOT_QUADRATIC");
  const d = i.b * i.b - 4 * i.a * i.c;
  if (d > 0) {
    const sq = Math.sqrt(d);
    return {
      discriminant: round2(d),
      x1: fmtRoot((-i.b + sq) / (2 * i.a)),
      x2: fmtRoot((-i.b - sq) / (2 * i.a)),
    };
  }
  if (d === 0) {
    const r = fmtRoot(-i.b / (2 * i.a));
    return { discriminant: 0, x1: r, x2: r };
  }
  const re = -i.b / (2 * i.a);
  const im = Math.sqrt(-d) / (2 * Math.abs(i.a));
  const sign = re < 0 ? "-" : "";
  return {
    discriminant: round2(d),
    x1: `${fmtRoot(re)} + ${fmtRoot(im)}i`,
    x2: `${sign}${fmtRoot(Math.abs(re))} − ${fmtRoot(im)}i`,
  };
}

export interface StatsSummaryResult {
  count: number;
  mean: number;
  median: number;
  stdDev: number;
  min: number;
  max: number;
}

export function statsSummary(rawNumbersText: string): StatsSummaryResult {
  const nums = rawNumbersText
    .split(/[,\s]+/)
    .map((t) => t.trim())
    .filter((t) => t.length > 0)
    .map(Number);

  if (nums.length === 0 || nums.some((n) => !Number.isFinite(n)))
    throw new CalcError("ERR_INVALID_NUMBERS");

  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  const median =
    sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
  const sum = nums.reduce((s, n) => s + n, 0);
  const mean = sum / nums.length;
  const variance = nums.reduce((s, n) => s + (n - mean) ** 2, 0) / nums.length;

  return {
    count: nums.length,
    mean: round2(mean),
    median: round2(median),
    stdDev: round2(Math.sqrt(variance)),
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
}

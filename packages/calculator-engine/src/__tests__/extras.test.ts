import { describe, expect, it } from "vitest";
import {
  decimalToFraction,
  factorial,
  fractionSimplify,
  gcdLcm,
  percentageOf,
  percentChange,
  primeCheck,
  quadratic,
  statsSummary,
} from "../mathmore";
import { diceRoller, base64Codec, randomNumber, randomPicker } from "../gen";
import { makeUnitConverter, temperatureConvert } from "../convert";
import {
  addDaysToDate,
  dateDifference,
  daysUntil,
  isoWeekNumber,
  workHours,
} from "../datetime2";
import { CalcError } from "../calc-error";

describe("percentage math", () => {
  it("X% of Y", () => {
    expect(percentageOf({ percent: 15, ofValue: 200 }).result).toBe(30);
  });

  it("percent change", () => {
    expect(percentChange({ fromValue: 50, toValue: 75 }).changePct).toBe(50);
    expect(percentChange({ fromValue: 100, toValue: 75 }).changePct).toBe(-25);
    expect(() => percentChange({ fromValue: 0, toValue: 5 })).toThrow(CalcError);
  });
});

describe("fractions", () => {
  it("simplifies to lowest terms", () => {
    expect(fractionSimplify({ numerator: 10, denominator: 20 }).simplified).toBe("1/2");
    expect(fractionSimplify({ numerator: 8, denominator: 4 }).simplified).toBe("2");
  });

  it("rejects zero denominator", () => {
    expect(() => fractionSimplify({ numerator: 1, denominator: 0 })).toThrow(CalcError);
  });

  it("converts decimal to fraction", () => {
    expect(decimalToFraction({ value: 0.5 })).toEqual({
      fraction: "1/2",
      roundedDecimal: 0.5,
    });
    expect(decimalToFraction({ value: 0.125 }).fraction).toBe("1/8");
  });
});

describe("gcd / lcm / primes / factorial", () => {
  it("gcd & lcm via euclid", () => {
    expect(gcdLcm({ a: 12, b: 18 })).toEqual({ gcd: 6, lcm: 36 });
  });

  it("primality edge cases", () => {
    expect(primeCheck({ n: 2 }).isPrimeLabel).toBe(true);
    expect(primeCheck({ n: 97 }).isPrimeLabel).toBe(true);
    expect(primeCheck({ n: 91 }).isPrimeLabel).toBe(false);
    expect(primeCheck({ n: 91 }).smallestFactor).toBe(7);
    expect(primeCheck({ n: 1 }).isPrimeLabel).toBe(false);
  });

  it("factorial known values", () => {
    expect(factorial({ n: 0 }).result).toBe("1");
    expect(factorial({ n: 5 }).result).toBe("120");
  });
});

describe("quadratic", () => {
  it("two real roots", () => {
    const r = quadratic({ a: 1, b: -3, c: 2 });
    expect(r.x1).toBe("2");
    expect(r.x2).toBe("1");
    expect(r.discriminant).toBe(1);
  });

  it("complex roots", () => {
    const r = quadratic({ a: 1, b: 0, c: 1 });
    expect(r.discriminant).toBe(-4);
    expect(r.x1).toContain("i");
  });

  it("rejects a = 0", () => {
    expect(() => quadratic({ a: 0, b: 1, c: 1 })).toThrow(CalcError);
  });
});

describe("statsSummary", () => {
  it("parses comma separated list", () => {
    const r = statsSummary("2, 4, 6, 8");
    expect(r.count).toBe(4);
    expect(r.mean).toBe(5);
    expect(r.median).toBe(5);
    expect(r.min).toBe(2);
    expect(r.max).toBe(8);
  });

  it("even count median is average of middles", () => {
    expect(statsSummary("1 2 3 10").median).toBe(2.5);
  });

  it("rejects garbage input", () => {
    expect(() => statsSummary("a,b,c")).toThrow(CalcError);
  });
});

describe("seeded generators", () => {
  it("random number respects inclusive range and seed reproducibility", () => {
    const a = randomNumber({ min: 1, max: 6, count: 3, seed: 42 });
    const b = randomNumber({ min: 1, max: 6, count: 3, seed: 42 });
    expect(a.valuesText).toBe(b.valuesText);
    for (const v of a.valuesText.split(", ")) {
      expect(Number(v)).toBeGreaterThanOrEqual(1);
      expect(Number(v)).toBeLessThanOrEqual(6);
    }
  });

  it("dice total equals sum of rolls", () => {
    const r = diceRoller({ sides: 20, count: 4, seed: 7 });
    const rolls = r.rollsText.split(", ").map(Number);
    expect(r.total).toBe(rolls.reduce((s, x) => s + x, 0));
  });

  it("picker never repeats and rejects over-picking", () => {
    const r = randomPicker({ itemsText: "a, b, c, d", picks: 2 });
    const picked = r.pickedText.split(", ");
    expect(new Set(picked).size).toBe(2);
    expect(() => randomPicker({ itemsText: " , ,", picks: 1 })).toThrow(/ERR_EMPTY_LIST/);
  });

  it("base64 round trip", () => {
    const enc = base64Codec({ mode: "encode", input: "مرحبا world" });
    const dec = base64Codec({ mode: "decode", input: enc.output });
    expect(dec.output).toBe("مرحبا world");
    expect(() => base64Codec({ mode: "decode", input: "!!!" })).toThrow(CalcError);
  });
});

describe("unit converters", () => {
  it("length km → mi", () => {
    expect(makeUnitConverter("length")({ value: 10, from: "km", to: "mi" }).result).toBeCloseTo(6.21, 1);
  });

  it("weight lb ↔ kg", () => {
    const conv = makeUnitConverter("weight");
    expect(conv({ value: 1, from: "kg", to: "lb" }).result).toBeCloseTo(2.2, 1);
    expect(conv({ value: 2.20462, from: "lb", to: "kg" }).result).toBeCloseTo(1, 2);
  });

  it("temperature special formulas", () => {
    expect(temperatureConvert({ value: 0, from: "C", to: "F" }).result).toBe(32);
    expect(temperatureConvert({ value: 212, from: "F", to: "C" }).result).toBe(100);
    expect(temperatureConvert({ value: 273.15, from: "K", to: "C" }).result).toBe(0);
  });
});

describe("datetime extras", () => {
  it("date difference across month boundary", () => {
    const r = dateDifference({ startDate: "2026-01-31", endDate: "2026-03-01" });
    expect(r.totalDays).toBe(29);
    expect(r.months).toBe(1);
  });

  it("add negative days", () => {
    const r = addDaysToDate({ startDate: "2026-03-01", days: -1 });
    expect(r.resultDate).toBe("2026-02-28");
    expect(typeof r.weekdayLabel).toBe("string");
  });

  it("days until signed", () => {
    expect(daysUntil({ targetDate: "2026-01-01", fromDate: "2026-01-31" }).days).toBe(-30);
    expect(daysUntil({ targetDate: "2026-03-02", fromDate: "2026-01-31" }).days).toBe(30);
  });

  it("work hours supports overnight and break", () => {
    const r = workHours({ startTime: "22:00", endTime: "06:00", breakMinutes: 60 });
    expect(r.hoursDecimal).toBe(7);
    expect(r.hoursMinutesLabel).toEqual({ hours: 7, minutes: 0 });
    expect(() => workHours({ startTime: "9am", endTime: "5pm" })).toThrow(CalcError);
  });

  it("ISO week number", () => {
    expect(isoWeekNumber({ date: "2026-01-01" }).weekNumber).toBe(1);
    expect(isoWeekNumber({ date: "2024-12-30" })).toMatchObject({
      weekNumber: 1,
      weekYear: 2025,
    });
  });
});

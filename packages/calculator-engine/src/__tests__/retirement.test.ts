import { describe, expect, it } from "vitest";
import { retirement } from "../retirement";

describe("retirement", () => {
  it("applies growth then contribution each year (year-end contributions)", () => {
    const result = retirement({
      currentAge: 30,
      retirementAge: 32,
      currentSavings: 10000,
      annualContribution: 1000,
      expectedReturnPct: 10,
      inflationPct: 0,
    });
    // Year 1: 10000*1.1+1000=12000 ; Year 2: 12000*1.1+1000=14200
    expect(result.projectedNominal).toBe(14200);
    expect(result.yearly).toEqual([
      { year: 1, balance: 12000 },
      { year: 2, balance: 14200 },
    ]);
    expect(result.totalContributions).toBe(2000);
  });

  it("deflates nominal to real using inflation", () => {
    const result = retirement({
      currentAge: 64,
      retirementAge: 65,
      currentSavings: 100000,
      annualContribution: 0,
      expectedReturnPct: 0,
      inflationPct: 2,
    });
    expect(result.projectedNominal).toBe(100000);
    expect(result.projectedReal).toBeCloseTo(100000 / 1.02, 0);
  });

  it("one-year horizon equals savings grown plus one contribution", () => {
    const result = retirement({
      currentAge: 40,
      retirementAge: 41,
      currentSavings: 5000,
      annualContribution: 6000,
      expectedReturnPct: 7,
      inflationPct: 3,
    });
    expect(result.yearly[0]?.balance).toBeCloseTo(5000 * 1.07 + 6000, 2);
    expect(result.yearsToRetirement).toBe(1);
  });
});

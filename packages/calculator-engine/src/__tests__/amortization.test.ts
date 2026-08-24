import { describe, expect, it } from "vitest";
import { amortization } from "../amortization";

describe("amortization", () => {
  it("produces a schedule whose final balance is exactly 0", () => {
    const result = amortization({ principal: 200000, annualRatePct: 6.5, years: 30 });
    expect(result.schedule.length).toBe(360);
    expect(result.schedule[359]!.balance).toBe(0);
    expect(result.monthlyPayment).toBeCloseTo(1264.14, 2);
  });

  it("satisfies Σinterest + Σprincipal = totalPaid", () => {
    const result = amortization({ principal: 15000, annualRatePct: 5.9, years: 3 });
    const principalSum = result.schedule.reduce((acc, row) => acc + row.principal, 0);
    expect(principalSum).toBeCloseTo(15000, 2);
    expect(result.totalInterest).toBeCloseTo(result.totalPaid - 15000, 2);
  });

  it("zero interest produces linear payoff", () => {
    const result = amortization({ principal: 1200, annualRatePct: 0, years: 1 });
    expect(result.monthlyPayment).toBe(100);
    for (const row of result.schedule) {
      expect(row.interest).toBe(0);
      expect(row.principal).toBe(100);
    }
    expect(result.schedule[11]!.balance).toBe(0);
  });

  it("interest decreases and principal increases month over month (positive rate)", () => {
    const result = amortization({ principal: 10000, annualRatePct: 8, years: 2 });
    for (let m = 1; m < result.schedule.length; m++) {
      const prev = result.schedule[m - 1]!;
      const curr = result.schedule[m]!;
      expect(curr.interest).toBeLessThan(prev.interest);
      expect(curr.principal).toBeGreaterThan(prev.principal);
    }
  });
});

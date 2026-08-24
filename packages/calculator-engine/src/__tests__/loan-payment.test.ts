import { describe, expect, it } from "vitest";
import { loanPayment } from "../loan-payment";

describe("loanPayment", () => {
  it("computes a standard annuity payment", () => {
    // P=200000, r=6.5%/12, n=360 → hand-verified reference
    const result = loanPayment({ principal: 200000, annualRatePct: 6.5, years: 30 });
    expect(result.monthlyPayment).toBeCloseTo(1264.14, 2);
    expect(result.totalInterest).toBeCloseTo(result.totalPaid - 200000, 2);
    // totalPaid derives from the unrounded payment (spec §1)
    expect(result.totalPaid).toBeCloseTo(result.monthlyPayment * 360, -1);
  });

  it("handles zero interest with straight-line division", () => {
    const result = loanPayment({ principal: 12000, annualRatePct: 0, years: 1 });
    expect(result.monthlyPayment).toBe(1000);
    expect(result.totalPaid).toBe(12000);
    expect(result.totalInterest).toBe(0);
  });

  it("handles a one-year loan", () => {
    const result = loanPayment({ principal: 1200, annualRatePct: 12, years: 1 });
    // r=0.01, n=12 → payment = 1200*0.01*1.01^12/(1.01^12-1)
    expect(result.monthlyPayment).toBeCloseTo(106.62, 1);
  });

  it("never returns negative totals for valid input", () => {
    const result = loanPayment({ principal: 5000, annualRatePct: 3.25, years: 2 });
    expect(result.totalPaid).toBeGreaterThan(0);
    expect(result.totalInterest).toBeGreaterThanOrEqual(0);
  });
});

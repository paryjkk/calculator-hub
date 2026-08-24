import { describe, expect, it } from "vitest";
import {
  autoLoan,
  compoundInterest,
  creditCardPayoff,
  discount,
  inflation,
  mortgage,
  roi,
  salaryToHourly,
  simpleInterest,
  tip,
  vat,
} from "../finance";
import { CalcError } from "../calc-error";

describe("simpleInterest", () => {
  it("computes I = P·r·t", () => {
    expect(simpleInterest({ principal: 1000, annualRatePct: 5, years: 2 })).toEqual({
      interest: 100,
      total: 1100,
    });
  });
});

describe("compoundInterest", () => {
  it("annually matches (1+r)^n", () => {
    const r = compoundInterest({ principal: 1000, annualRatePct: 10, years: 1, compoundsPerYear: 1 });
    expect(r.finalAmount).toBe(1100);
    expect(r.interestEarned).toBe(100);
  });

  it("monthly outperforms annually", () => {
    const a = compoundInterest({ principal: 10000, annualRatePct: 12, years: 5, compoundsPerYear: 1 });
    const m = compoundInterest({ principal: 10000, annualRatePct: 12, years: 5, compoundsPerYear: 12 });
    expect(m.finalAmount).toBeGreaterThan(a.finalAmount);
  });
});

describe("mortgage / autoLoan", () => {
  it("down payment reduces the loan", () => {
    const r = mortgage({ homePrice: 500000, downPayment: 100000, annualRatePct: 0, years: 10 });
    expect(r.loanAmount).toBe(400000);
    expect(r.monthlyPayment).toBeCloseTo(400000 / 120, 2);
  });

  it("rejects down payment above price", () => {
    expect(() =>
      mortgage({ homePrice: 100, downPayment: 200, annualRatePct: 5, years: 10 })
    ).toThrow(CalcError);
  });

  it("auto loan mirrors financed math", () => {
    const r = autoLoan({ vehiclePrice: 30000, downPayment: 5000, annualRatePct: 6, years: 5 });
    expect(r.loanAmount).toBe(25000);
    expect(r.monthlyPayment).toBeGreaterThan(0);
  });
});

describe("vat", () => {
  it("adds VAT to net", () => {
    expect(vat({ amount: 100, vatPct: 15, mode: "add" })).toEqual({
      net: 100,
      vat: 15,
      gross: 115,
    });
  });

  it("extracts VAT from gross", () => {
    const r = vat({ amount: 115, vatPct: 15, mode: "extract" });
    expect(r.net).toBeCloseTo(100, 2);
    expect(r.vat).toBeCloseTo(15, 2);
  });
});

describe("discount", () => {
  it("applies percentage off", () => {
    expect(discount({ originalPrice: 200, discountPct: 25 })).toEqual({
      finalPrice: 150,
      youSave: 50,
    });
  });
});

describe("tip", () => {
  it("splits bill with tip", () => {
    const r = tip({ billAmount: 100, tipPct: 10, people: 4 });
    expect(r.tipAmount).toBe(10);
    expect(r.total).toBe(110);
    expect(r.perPerson).toBe(27.5);
  });
});

describe("roi", () => {
  it("computes ROI and CAGR", () => {
    const r = roi({ initialInvestment: 1000, finalValue: 1210, years: 2 });
    expect(r.roiPct).toBe(21);
    expect(r.cagrPct).toBeCloseTo(10, 0);
    expect(r.profit).toBe(210);
  });

  it("omits CAGR without years", () => {
    expect(roi({ initialInvestment: 100, finalValue: 150 }).cagrPct).toBeNull();
  });
});

describe("creditCardPayoff", () => {
  it("pays off and reports totals", () => {
    const r = creditCardPayoff({ balance: 1200, aprPct: 0, monthlyPayment: 100 });
    expect(r.monthsToPayoff).toBe(12);
    expect(r.totalInterest).toBe(0);
    expect(r.totalPaid).toBe(1200);
  });

  it("rejects payments below monthly interest", () => {
    expect(() =>
      creditCardPayoff({ balance: 10000, aprPct: 24, monthlyPayment: 50 })
    ).toThrow(/ERR_PAYMENT_TOO_LOW/);
  });
});

describe("inflation", () => {
  it("projects future cost and lost purchasing power", () => {
    const r = inflation({ amount: 100, inflationPct: 10, years: 1 });
    expect(r.futureCost).toBe(110);
    expect(r.purchasingPower).toBeCloseTo(90.91, 1);
  });
});

describe("salaryToHourly", () => {
  it("converts with default weeks", () => {
    const r = salaryToHourly({ annualSalary: 52000, hoursPerWeek: 40 });
    expect(r.hourlyRate).toBe(25);
    expect(r.weeklyPay).toBe(1000);
    expect(r.monthlyPay).toBeCloseTo(4333.33, 2);
  });
});

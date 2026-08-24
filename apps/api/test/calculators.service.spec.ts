import { describe, expect, it } from "vitest";
import { CalculatorsService } from "../src/modules/calculators/calculators.service";
import { loanPayment } from "@calc/engine";

describe("CalculatorsService", () => {
  const service = new CalculatorsService();

  it("loanPayment delegates to the engine", () => {
    expect(
      service.loanPayment({ principal: 200000, annualRatePct: 6.5, years: 30 })
    ).toEqual(loanPayment({ principal: 200000, annualRatePct: 6.5, years: 30 }));
  });

  it("age rejects birthDate after onDate", () => {
    expect(() =>
      service.age({ birthDate: "2030-01-01", onDate: "2020-01-01" })
    ).toThrow();
  });

  it("age defaults onDate to today when omitted", () => {
    const result = service.age({ birthDate: "2000-01-01" });
    expect(result.years).toBeGreaterThanOrEqual(20);
  });

  it("retirement rejects retirementAge <= currentAge", () => {
    expect(() =>
      service.retirement({
        currentAge: 65,
        retirementAge: 65,
        currentSavings: 0,
        annualContribution: 0,
        expectedReturnPct: 5,
        inflationPct: 2,
      })
    ).toThrow();
  });
});

describe("CalculatorsService.compute (generic registry path)", () => {
  const service = new CalculatorsService();

  it("computes via def validation + engine runner", () => {
    const out: any = service.compute("loan-payment", {
      principal: 12000,
      annualRatePct: 0,
      years: 1,
    });
    expect(out.monthlyPayment).toBeCloseTo(1000, 2);
  });

  it("maps CalcError to a code-carrying BadRequestException", () => {
    try {
      service.compute("credit-card-payoff", {
        balance: 100000,
        aprPct: 24,
        monthlyPayment: 10,
      });
      throw new Error("should not reach");
    } catch (e: any) {
      expect(e.getStatus).toBeDefined();
      expect(e.getResponse().message).toBe("ERR_PAYMENT_TOO_LOW");
    }
  });

  it("404 for unknown slug", () => {
    try {
      service.compute("nope", {});
    } catch (e: any) {
      expect(e.getStatus?.()).toBe(404);
    }
  });
});

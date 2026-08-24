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

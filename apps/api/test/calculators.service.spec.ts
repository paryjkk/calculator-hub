import { describe, expect, it } from "vitest";
import { CalculatorsService } from "../src/modules/calculators/calculators.module";
import { loanPayment } from "@calc/engine";

describe("CalculatorsService", () => {
  const service = new CalculatorsService({} as never);

  it("loanPayment delegates to the engine", () => {
    expect(
      service.loanPayment({ principal: 200000, annualRatePct: 6.5, years: 30 })
    ).toEqual(loanPayment({ principal: 200000, annualRatePct: 6.5, years: 30 }));
  });

  it("age rejects birthDate after onDate", () => {
    expect(() =>
      service.age({
        birthDate: "2030-01-01",
        onDate: "2020-01-01",
      })
    ).toThrow();
  });

  it("retirement rejects retirementAge <= currentAge", () => {
    expect(() =>
      service.retirement({
        currentAge: 60,
        retirementAge: 50,
        currentSavings: 0,
        annualContribution: 0,
        expectedReturnPct: 5,
        inflationPct: 2,
      })
    ).toThrow();
  });
});

describe("CalculatorsService.compute (generic registry path)", () => {
  const service = new CalculatorsService({
    usageEvent: { create: async () => ({}) },
  } as never);

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

  it("password generator native runner works", () => {
    const out: any = service.compute("password-generator", {
      length: 10,
      uppercase: "on",
      lowercase: "on",
      digits: "off",
      symbols: "off",
    });
    expect(out.password).toHaveLength(10);
    expect(out.password).toMatch(/^[A-Za-z0-9]+$/);
  });

  it("uuid generator returns v4 uuids", () => {
    const out: any = service.compute("uuid-generator", { count: 2 });
    expect(out.valuesText.split("\n")).toHaveLength(2);
  });
});

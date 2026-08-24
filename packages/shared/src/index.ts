export const CALCULATOR_TYPES = [
  "LOAN_PAYMENT",
  "LOAN_AMORTIZATION",
  "AGE",
  "RETIREMENT",
] as const;

export type CalculatorType = (typeof CALCULATOR_TYPES)[number];

/** Input limits enforced by DTOs — single source shared by web + api. */
export const LIMITS = {
  maxPrincipal: 100_000_000,
  maxYears: 50,
  maxRatePct: 100,
  maxAge: 150,
} as const;

export const API_VERSION = "1.0.0";

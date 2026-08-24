/**
 * Retirement projection per CALCULATOR-SPEC.md §4.
 * Yearly compounding, contributions applied at year-end.
 */
export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  annualContribution: number;
  expectedReturnPct: number;
  inflationPct: number;
}

export interface RetirementYearRow {
  year: number;
  balance: number;
}

export interface RetirementResult {
  yearsToRetirement: number;
  projectedNominal: number;
  projectedReal: number;
  totalContributions: number;
  yearly: RetirementYearRow[];
}

import { round2 } from "./round";

export function retirement(input: RetirementInput): RetirementResult {
  const { currentAge, retirementAge, currentSavings, annualContribution, expectedReturnPct, inflationPct } =
    input;

  const Y = retirementAge - currentAge;
  const R = expectedReturnPct / 100;
  const I = inflationPct / 100;

  const yearly: RetirementYearRow[] = [];
  let balance = currentSavings;

  for (let t = 1; t <= Y; t++) {
    balance = round2(balance * (1 + R) + annualContribution);
    yearly.push({ year: t, balance });
  }

  const nominal = balance;
  const real = nominal / Math.pow(1 + I, Y);

  return {
    yearsToRetirement: Y,
    projectedNominal: round2(nominal),
    projectedReal: round2(real),
    totalContributions: round2(annualContribution * Y),
    yearly,
  };
}

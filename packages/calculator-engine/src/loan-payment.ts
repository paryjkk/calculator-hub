/**
 * Loan monthly payment — standard annuity formula.
 * Pure math per CALCULATOR-SPEC.md §1. No rounding inside; round at the edge.
 */
export interface LoanPaymentInput {
  principal: number;
  annualRatePct: number;
  years: number;
}

export interface LoanPaymentResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export function loanPayment(input: LoanPaymentInput): LoanPaymentResult {
  const { principal, annualRatePct, years } = input;
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;

  const monthlyPayment =
    r === 0 ? principal / n : (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

  return roundLoan({
    monthlyPayment,
    totalPaid: monthlyPayment * n,
    totalInterest: monthlyPayment * n - principal,
  });
}

/** Round monetary outputs to cents once, at the boundary. */
function roundLoan(result: LoanPaymentResult): LoanPaymentResult {
  return {
    monthlyPayment: round2(result.monthlyPayment),
    totalPaid: round2(result.totalPaid),
    totalInterest: round2(result.totalInterest),
  };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

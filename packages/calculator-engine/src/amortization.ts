import { loanPayment, type LoanPaymentInput } from "./loan-payment";
import { round2 } from "./round";

export type AmortizationInput = LoanPaymentInput;

/**
 * Amortization schedule per CALCULATOR-SPEC.md §2.
 * Final month absorbs rounding drift so the ending balance is exactly 0.
 */
export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

export interface AmortizationResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
  schedule: AmortizationRow[];
}

export function amortization(input: LoanPaymentInput): AmortizationResult {
  const { principal, annualRatePct, years } = input;
  const n = Math.round(years * 12);
  const r = annualRatePct / 100 / 12;

  const { monthlyPayment } = loanPayment(input);
  const payment = monthlyPayment; // rounded edge value drives the schedule

  const schedule: AmortizationRow[] = [];
  let balance = principal;
  let interestSum = 0;

  for (let m = 1; m <= n; m++) {
    const interest = round2(balance * r);
    let principalPart: number;

    if (m === n) {
      principalPart = balance; // exact payoff
    } else {
      principalPart = round2(payment - interest);
      if (principalPart > balance) principalPart = balance;
    }

    balance = round2(balance - principalPart);
    interestSum += interest;

    schedule.push({ month: m, payment: round2(interest + principalPart), interest, principal: principalPart, balance });
  }

  return {
    monthlyPayment,
    totalPaid: round2(principal + interestSum),
    totalInterest: round2(interestSum),
    schedule,
  };
}

import { CalcError } from "./calc-error";
import { loanPayment } from "./loan-payment";
import { round2 } from "./round";

interface AmountRateYearsInput {
  principal: number;
  annualRatePct: number;
  years: number;
}

export function simpleInterest(i: AmountRateYearsInput) {
  const interest = round2(i.principal * (i.annualRatePct / 100) * i.years);
  return { interest, total: round2(i.principal + interest) };
}

export interface CompoundInterestInput extends AmountRateYearsInput {
  compoundsPerYear: number;
}

export function compoundInterest(i: CompoundInterestInput) {
  const n = i.compoundsPerYear;
  const finalAmount = i.principal * Math.pow(1 + i.annualRatePct / 100 / n, n * i.years);
  return {
    finalAmount: round2(finalAmount),
    interestEarned: round2(finalAmount - i.principal),
  };
}

function financedLoan(price: number, downPayment: number, annualRatePct: number, years: number) {
  if (downPayment > price) throw new CalcError("ERR_DOWN_TOO_LARGE");
  const loanAmount = price - downPayment;
  const { monthlyPayment, totalPaid, totalInterest } = loanPayment({
    principal: loanAmount,
    annualRatePct,
    years,
  });
  return { loanAmount, monthlyPayment, totalPaid, totalInterest };
}

export function mortgage(i: {
  homePrice: number;
  downPayment: number;
  annualRatePct: number;
  years: number;
}) {
  return financedLoan(i.homePrice, i.downPayment, i.annualRatePct, i.years);
}

export function autoLoan(i: {
  vehiclePrice: number;
  downPayment: number;
  annualRatePct: number;
  years: number;
}) {
  return financedLoan(i.vehiclePrice, i.downPayment, i.annualRatePct, i.years);
}

export function vat(i: { amount: number; vatPct: number; mode: "add" | "extract" }) {
  if (i.mode === "add") {
    const vat = round2(i.amount * (i.vatPct / 100));
    return { net: round2(i.amount), vat, gross: round2(i.amount + vat) };
  }
  const net = round2(i.amount / (1 + i.vatPct / 100));
  return { net, vat: round2(i.amount - net), gross: round2(i.amount) };
}

export function discount(i: { originalPrice: number; discountPct: number }) {
  const youSave = round2(i.originalPrice * (i.discountPct / 100));
  return { finalPrice: round2(i.originalPrice - youSave), youSave };
}

export function tip(i: { billAmount: number; tipPct: number; people: number }) {
  const tipAmount = round2(i.billAmount * (i.tipPct / 100));
  const total = round2(i.billAmount + tipAmount);
  return { tipAmount, total, perPerson: round2(total / i.people) };
}

export function roi(i: { initialInvestment: number; finalValue: number; years?: number }) {
  const profit = round2(i.finalValue - i.initialInvestment);
  const roiPct = round2(((i.finalValue - i.initialInvestment) / i.initialInvestment) * 100);
  const cagrPct =
    i.years && i.finalValue > 0 && i.initialInvestment > 0
      ? round2((Math.pow(i.finalValue / i.initialInvestment, 1 / i.years) - 1) * 100)
      : null;
  return { roiPct, cagrPct, profit };
}

export function creditCardPayoff(i: {
  balance: number;
  aprPct: number;
  monthlyPayment: number;
}) {
  const r = i.aprPct / 100 / 12;
  let balance = i.balance;
  let totalInterest = 0;
  const maxMonths = 1200;

  for (let m = 1; m <= maxMonths; m++) {
    const interest = round2(balance * r);
    if (i.monthlyPayment <= interest) throw new CalcError("ERR_PAYMENT_TOO_LOW");
    const principalPart = Math.min(round2(i.monthlyPayment - interest), balance);
    balance = round2(balance - principalPart);
    totalInterest = round2(totalInterest + interest);
    if (balance <= 0) {
      return {
        monthsToPayoff: m,
        totalInterest,
        totalPaid: round2(i.balance + totalInterest),
      };
    }
  }
  throw new CalcError("ERR_PAYMENT_TOO_LOW");
}

export function inflation(i: { amount: number; inflationPct: number; years: number }) {
  const factor = Math.pow(1 + i.inflationPct / 100, i.years);
  return {
    futureCost: round2(i.amount * factor),
    purchasingPower: round2(i.amount / factor),
  };
}

export function salaryToHourly(i: {
  annualSalary: number;
  hoursPerWeek: number;
  weeksPerYear?: number;
}) {
  const weeks = i.weeksPerYear ?? 52;
  const hourlyRate = round2(i.annualSalary / (weeks * i.hoursPerWeek));
  return {
    hourlyRate,
    weeklyPay: round2(hourlyRate * i.hoursPerWeek),
    monthlyPay: round2(i.annualSalary / 12),
  };
}

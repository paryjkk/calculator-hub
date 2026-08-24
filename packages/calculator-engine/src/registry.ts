import { age } from "./age";
import { amortization } from "./amortization";
import { loanPayment } from "./loan-payment";
import { retirement } from "./retirement";
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
} from "./finance";
import {
  bmi,
  bmr,
  bodyFatNavy,
  caloriesBurned,
  idealWeight,
  ovulation,
  pregnancyDueDate,
  runningPace,
  tdee,
  waterIntake,
} from "./health";
import {
  decimalToFraction,
  factorial,
  fractionSimplify,
  gcdLcm,
  percentageOf,
  percentChange,
  primeCheck,
  quadratic,
  statsSummary,
} from "./mathmore";
import {
  base64Codec,
  diceRoller,
  randomNumber,
  randomPicker,
} from "./gen";
import { makeUnitConverter, temperatureConvert } from "./convert";
import {
  addDaysToDate,
  dateDifference,
  daysUntil,
  isoWeekNumber,
  workHours,
} from "./datetime2";
import { CalcError } from "./calc-error";
import { round2 } from "./round";

export type Runner = (input: unknown) => unknown;

function runner(fn: (input: never) => unknown): Runner {
  return (input: unknown) => fn(input as never);
}

function heronTriangle(i: { sideA: number; sideB: number; sideC: number }) {
  const { sideA: a, sideB: b, sideC: c } = i;
  if (a + b <= c || a + c <= b || b + c <= a)
    throw new CalcError("ERR_INVALID_TRIANGLE");
  const s = (a + b + c) / 2;
  return {
    area: round2(Math.sqrt(s * (s - a) * (s - b) * (s - c))),
    perimeter: round2(a + b + c),
  };
}

function circleCalc(i: { radius: number }) {
  return {
    area: round2(Math.PI * i.radius ** 2),
    circumference: round2(2 * Math.PI * i.radius),
    diameter: round2(i.radius * 2),
  };
}

function ageWithComposite(i: { birthDate: string; onDate: string }) {
  const r = age({ birthDate: i.birthDate, onDate: i.onDate });
  return {
    ...r,
    yearsMonthsDays: { years: r.years, months: r.months, days: r.days },
  };
}

export const RUNNERS: Record<string, Runner> = {
  "loan-payment": runner(loanPayment),
  "loan-amortization": runner(amortization),
  age: runner(ageWithComposite),
  retirement: runner(retirement),

  "simple-interest": runner(simpleInterest),
  "compound-interest": runner(compoundInterest),
  mortgage: runner(mortgage),
  "auto-loan": runner(autoLoan),
  vat: runner(vat),
  discount: runner(discount),
  tip: runner(tip),
  roi: runner(roi),
  "credit-card-payoff": runner(creditCardPayoff),
  inflation: runner(inflation),
  "salary-to-hourly": runner(salaryToHourly),

  bmi: runner(bmi),
  bmr: runner(bmr),
  tdee: runner(tdee),
  "body-fat-navy": runner(bodyFatNavy),
  "ideal-weight": runner(idealWeight),
  "water-intake": runner(waterIntake),
  "pregnancy-due-date": runner(pregnancyDueDate),
  ovulation: runner(ovulation),
  "running-pace": runner(runningPace),
  "calories-burned": runner(caloriesBurned),

  "percentage-of": runner(percentageOf),
  "percent-change": runner(percentChange),
  "fraction-simplify": runner(fractionSimplify),
  "decimal-to-fraction": runner(decimalToFraction),
  "gcd-lcm": runner(gcdLcm),
  "prime-check": runner(primeCheck),
  factorial: runner(factorial),
  "quadratic-solver": runner(quadratic),
  "stats-summary": runner((i: { numbers: string }) => statsSummary(i.numbers)),
  "random-number": runner(randomNumber),
  "heron-triangle": runner(heronTriangle),
  circle: runner(circleCalc),

  "length-converter": runner(makeUnitConverter("length")),
  "weight-converter": runner(makeUnitConverter("weight")),
  "area-converter": runner(makeUnitConverter("area")),
  "volume-converter": runner(makeUnitConverter("volume")),
  "speed-converter": runner(makeUnitConverter("speed")),
  "data-storage-converter": runner(makeUnitConverter("data")),
  "time-converter": runner(makeUnitConverter("time")),
  "temperature-converter": runner(temperatureConvert),

  "date-difference": runner(dateDifference),
  "add-days": runner(addDaysToDate),
  "days-until": runner(daysUntil),
  "work-hours": runner(workHours),
  "iso-week-number": runner(isoWeekNumber),

  "dice-roller": runner(diceRoller),
  "random-picker": runner((i: { items: string; picks?: number }) =>
    randomPicker({ itemsText: i.items, picks: i.picks })
  ),
  base64: runner(base64Codec),
};

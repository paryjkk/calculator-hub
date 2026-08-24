export interface CalculatorInfo {
  slug: string;
  title: string;
  short: string;
  description: string;
  icon: string;
}

/** MVP calculators per PROJECT-BASELINE.md — order defines listing priority. */
export const CALCULATORS: CalculatorInfo[] = [
  {
    slug: "loan-payment",
    title: "Loan Monthly Payment",
    short: "Estimate your fixed monthly loan payment.",
    description:
      "Calculate the fixed monthly payment for an amortizing loan, plus total paid and total interest over the life of the loan.",
    icon: "🏦",
  },
  {
    slug: "loan-amortization",
    title: "Loan Amortization",
    short: "See how each payment splits interest vs principal.",
    description:
      "Generate a full month-by-month amortization schedule showing how much of every payment goes to interest and principal, and the remaining balance.",
    icon: "📊",
  },
  {
    slug: "age",
    title: "Age Calculator",
    short: "Exact age in years, months, and days.",
    description:
      "Compute an exact age in years, months, and days — including totals in months, weeks, and days — and the countdown to the next birthday.",
    icon: "🎂",
  },
  {
    slug: "retirement",
    title: "Retirement Projection",
    short: "Project your savings at retirement.",
    description:
      "Project your retirement balance with yearly compounding and annual contributions, in both nominal and inflation-adjusted (real) terms.",
    icon: "🌅",
  },
];

export function getCalculator(slug: string): CalculatorInfo | undefined {
  return CALCULATORS.find((c) => c.slug === slug);
}

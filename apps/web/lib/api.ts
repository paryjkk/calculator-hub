export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3001" : "");

export async function postCalculator<TBody, TResult>(
  type: string,
  body: TBody
): Promise<TResult> {
  const res = await fetch(`${API_BASE}/api/v1/calculators/${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const payload = (await res.json().catch(() => null)) as
      | { message?: string | string[] }
      | null;
    const message = Array.isArray(payload?.message)
      ? payload.message.join(", ")
      : payload?.message;
    throw new Error(message ?? `Request failed (${res.status})`);
  }
  return (await res.json()) as TResult;
}

const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

export const fmtUsd = (value: number): string => usd.format(value);

export interface LoanPaymentResult {
  monthlyPayment: number;
  totalPaid: number;
  totalInterest: number;
}

export interface AgeResultDTO {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayInDays: number;
}

export interface RetirementResultDTO {
  yearsToRetirement: number;
  projectedNominal: number;
  projectedReal: number;
  totalContributions: number;
}

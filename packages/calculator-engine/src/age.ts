/**
 * Age calculation per CALCULATOR-SPEC.md §3.
 * Calendar-aware; operates on ISO date strings, UTC-anchored.
 */
export interface AgeInput {
  birthDate: string; // YYYY-MM-DD
  onDate: string; // YYYY-MM-DD
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalMonths: number;
  totalWeeks: number;
  totalDays: number;
  nextBirthdayInDays: number;
}

const MS_PER_DAY = 86_400_000;

function parseIso(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1, d ?? 1));
}

function toIso(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function age({ birthDate, onDate }: AgeInput): AgeResult {
  const birth = parseIso(birthDate);
  const on = parseIso(onDate);

  let years = on.getUTCFullYear() - birth.getUTCFullYear();
  let months = on.getUTCMonth() - birth.getUTCMonth();
  let days = on.getUTCDate() - birth.getUTCDate();

  if (days < 0) {
    months -= 1;
    // Length of the month preceding `on`'s month (actual days — leap aware)
    const prevMonth = new Date(Date.UTC(on.getUTCFullYear(), on.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((on.getTime() - birth.getTime()) / MS_PER_DAY);

  // Days until next birthday. Feb 29 births celebrate Mar 1 in non-leap years.
  let next = nextBirthdayOccurrence(birth, on.getUTCFullYear());
  if (toIso(next) <= onDate) {
    next = nextBirthdayOccurrence(birth, on.getUTCFullYear() + 1);
  }
  const todayAnchor = parseIso(toIso(on));
  const nextBirthdayInDays = Math.round((next.getTime() - todayAnchor.getTime()) / MS_PER_DAY);

  return {
    years,
    months,
    days,
    totalMonths: years * 12 + months,
    totalWeeks: Math.floor(totalDays / 7),
    totalDays,
    nextBirthdayInDays,
  };
}

function nextBirthdayOccurrence(birth: Date, year: number): Date {
  const month = birth.getUTCMonth();
  const day = birth.getUTCDate();
  if (month === 1 && day === 29 && !isLeap(year)) {
    return new Date(Date.UTC(year, 2, 1)); // Mar 1
  }
  return new Date(Date.UTC(year, month, day));
}

function isLeap(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

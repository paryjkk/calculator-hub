import { CalcError } from "./calc-error";
import { round2 } from "./round";

const MS_PER_DAY = 86400000;

function parseIso(iso: string): Date {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) throw new CalcError("ERR_INVALID_DATE");
  return d;
}

interface YmdBreakdown {
  years: number;
  months: number;
  days: number;
}

export function calendarBreakdown(
  startIso: string,
  endIso: string
): YmdBreakdown & { totalDays: number; totalWeeks: number } {
  const start = parseIso(startIso);
  const end = parseIso(endIso);
  if (end < start) throw new CalcError("ERR_START_AFTER_END");

  let years = end.getUTCFullYear() - start.getUTCFullYear();
  let months = end.getUTCMonth() - start.getUTCMonth();
  let days = end.getUTCDate() - start.getUTCDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), 0));
    days += prevMonth.getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((end.getTime() - start.getTime()) / MS_PER_DAY);
  return { years, months, days, totalDays, totalWeeks: Math.floor(totalDays / 7) };
}

export function dateDifference(i: { startDate: string; endDate?: string }) {
  const b = calendarBreakdown(i.startDate, i.endDate ?? new Date().toISOString().slice(0, 10));
  return b;
}

const WEEKDAY_CODES = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

export function addDaysToDate(i: { startDate: string; days: number }) {
  const d = parseIso(i.startDate);
  const out = new Date(d.getTime() + i.days * MS_PER_DAY);
  return {
    resultDate: out.toISOString().slice(0, 10),
    weekdayLabel: WEEKDAY_CODES[out.getUTCDay()],
  };
}

export function daysUntil(i: { targetDate: string; fromDate?: string }) {
  const target = parseIso(i.targetDate);
  const from = parseIso(i.fromDate ?? new Date().toISOString().slice(0, 10));
  const days = Math.round((target.getTime() - from.getTime()) / MS_PER_DAY);
  const absDays = Math.abs(days);
  const weeks = Math.floor(absDays / 7);
  const remDays = absDays % 7;
  return { days, weeksLabel: { weeks, days: remDays } };
}

const HHMM_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function workHours(i: {
  startTime: string;
  endTime: string;
  breakMinutes?: number;
}) {
  const s = i.startTime.trim().match(HHMM_RE);
  const e = i.endTime.trim().match(HHMM_RE);
  if (!s || !e) throw new CalcError("ERR_BAD_TIME");

  let minutes =
    Number(e[1]) * 60 + Number(e[2]) - (Number(s[1]) * 60 + Number(s[2]));
  if (minutes <= 0) minutes += 24 * 60;

  minutes -= i.breakMinutes ?? 0;
  if (minutes <= 0) throw new CalcError("ERR_NO_TIME_LEFT");

  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return { hoursDecimal: round2(minutes / 60), hoursMinutesLabel: { hours, minutes: mins } };
}

export function isoWeekNumber(i: { date: string }) {
  const d = parseIso(i.date);
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = (t.getUTCDay() + 6) % 7;
  t.setUTCDate(t.getUTCDate() - dayNum + 3);
  const firstThursday = new Date(Date.UTC(t.getUTCFullYear(), 0, 4));
  const fDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - fDayNum + 3);
  const weekNumber =
    1 + Math.round((t.getTime() - firstThursday.getTime()) / (7 * MS_PER_DAY));
  return { weekNumber, weekYear: t.getUTCFullYear() };
}

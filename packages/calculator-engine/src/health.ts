import { CalcError } from "./calc-error";
import { round2 } from "./round";

export type Sex = "male" | "female";

export function bmi(i: { weightKg: number; heightCm: number }) {
  const h = i.heightCm / 100;
  const value = i.weightKg / (h * h);
  const categoryCode =
    value < 18.5
      ? "bmi_underweight"
      : value < 25
        ? "bmi_normal"
        : value < 30
          ? "bmi_overweight"
          : "bmi_obese";
  return { bmi: round2(value), categoryCode };
}

function mifflinStJeor(sex: Sex, age: number, heightCm: number, weightKg: number) {
  return 10 * weightKg + 6.25 * heightCm - 5 * age + (sex === "male" ? 5 : -161);
}

export function bmr(i: { sex: Sex; age: number; heightCm: number; weightKg: number }) {
  return { bmr: Math.round(mifflinStJeor(i.sex, i.age, i.heightCm, i.weightKg)) };
}

const ACTIVITY_FACTORS: Record<string, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function tdee(i: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: string;
}) {
  const base = mifflinStJeor(i.sex, i.age, i.heightCm, i.weightKg);
  const factor = ACTIVITY_FACTORS[i.activity];
  if (!factor) throw new CalcError("ERR_INVALID_OPTION");
  return { bmr: Math.round(base), tdee: Math.round(base * factor) };
}

export function bodyFatNavy(i: {
  sex: Sex;
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
}) {
  let pct: number;
  if (i.sex === "male") {
    if (i.waistCm - i.neckCm <= 0) throw new CalcError("ERR_INVALID_MEASUREMENT");
    pct =
      495 /
        (1.0324 -
          0.19077 * Math.log10(i.waistCm - i.neckCm) +
          0.15456 * Math.log10(i.heightCm)) -
      450;
  } else {
    if (!i.hipCm) throw new CalcError("ERR_HIP_REQUIRED");
    if (i.waistCm + i.hipCm - i.neckCm <= 0) throw new CalcError("ERR_INVALID_MEASUREMENT");
    pct =
      495 /
        (1.29579 -
          0.35004 * Math.log10(i.waistCm + i.hipCm - i.neckCm) +
          0.221 * Math.log10(i.heightCm)) -
      450;
  }

  const t = i.sex === "male" ? [6, 14, 18, 25] : [14, 21, 25, 32];
  const categoryCode =
    pct < t[0]
      ? "bf_essential"
      : pct < t[1]
        ? "bf_athletes"
        : pct < t[2]
          ? "bf_fitness"
          : pct < t[3]
            ? "bf_average"
            : "bf_obese";

  return { bodyFatPct: round2(pct), categoryCode };
}

export function idealWeight(i: { sex: Sex; heightCm: number }) {
  const inchesOver5ft = i.heightCm / 2.54 - 60;
  const devine =
    i.sex === "male" ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;
  const h = i.heightCm / 100;
  return {
    idealWeightKg: round2(devine),
    healthyMinKg: round2(18.5 * h * h),
    healthyMaxKg: round2(24.9 * h * h),
  };
}

export function waterIntake(i: { weightKg: number; activityMinutes?: number }) {
  const exerciseLiters = ((i.activityMinutes ?? 0) / 30) * 0.35;
  const liters = round2((i.weightKg * 0.033 + exerciseLiters) * 10) / 10;
  return { liters, cups8oz: round2(liters / 0.2365882365) };
}

function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function pregnancyDueDate(i: { lmpDate: string }) {
  return { dueDate: addDays(i.lmpDate, 280), gestationalDays: 280 };
}

export function ovulation(i: { cycleStartDate: string; cycleLengthDays?: number }) {
  const cycle = i.cycleLengthDays ?? 28;
  const ovulationDate = addDays(i.cycleStartDate, cycle - 14);
  return {
    ovulationDate,
    fertileStart: addDays(ovulationDate, -4),
    fertileEnd: addDays(ovulationDate, 1),
  };
}

export function runningPace(i: {
  distanceKm: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
}) {
  const totalSeconds = (i.hours ?? 0) * 3600 + (i.minutes ?? 0) * 60 + (i.seconds ?? 0);
  if (totalSeconds <= 0) throw new CalcError("ERR_TIME_REQUIRED");
  return {
    paceMinPerKm: round2(totalSeconds / 60 / i.distanceKm),
    speedKmh: round2(i.distanceKm / (totalSeconds / 3600)),
    totalSeconds,
  };
}

export function caloriesBurned(i: { met: number; weightKg: number; minutes: number }) {
  return { calories: round2(i.met * i.weightKg * (i.minutes / 60)) };
}

import { describe, expect, it } from "vitest";
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
} from "../health";
import { CalcError } from "../calc-error";

describe("bmi", () => {
  it("classifies WHO categories", () => {
    expect(bmi({ weightKg: 50, heightCm: 165 }).categoryCode).toBe("bmi_underweight");
    expect(bmi({ weightKg: 65, heightCm: 170 }).categoryCode).toBe("bmi_normal");
    expect(bmi({ weightKg: 80, heightCm: 170 }).categoryCode).toBe("bmi_overweight");
    expect(bmi({ weightKg: 110, heightCm: 170 }).categoryCode).toBe("bmi_obese");
  });

  it("matches the standard example", () => {
    expect(bmi({ weightKg: 70, heightCm: 170 }).bmi).toBeCloseTo(24.22, 1);
  });
});

describe("bmr / tdee", () => {
  it("Mifflin-St Jeor male example", () => {
    const r = bmr({ sex: "male", age: 30, heightCm: 180, weightKg: 80 });
    expect(r.bmr).toBe(1780);
  });

  it("female offset applied", () => {
    const m = bmr({ sex: "male", age: 30, heightCm: 160, weightKg: 60 });
    const f = bmr({ sex: "female", age: 30, heightCm: 160, weightKg: 60 });
    expect(f.bmr).toBe(m.bmr - 166);
  });

  it("TDEE multiplies by activity factor", () => {
    const r = tdee({ sex: "male", age: 30, heightCm: 180, weightKg: 80, activity: "sedentary" });
    expect(r.tdee).toBe(Math.round(1780 * 1.2));
  });
});

describe("bodyFatNavy", () => {
  it("computes male percentage", () => {
    const r = bodyFatNavy({ sex: "male", heightCm: 180, neckCm: 38, waistCm: 85 });
    expect(r.bodyFatPct).toBeGreaterThan(5);
    expect(r.bodyFatPct).toBeLessThan(40);
  });

  it("requires hip for females", () => {
    expect(() =>
      bodyFatNavy({ sex: "female", heightCm: 165, neckCm: 32, waistCm: 70 })
    ).toThrow(/ERR_HIP_REQUIRED/);
  });

  it("accepts female with hip", () => {
    const r = bodyFatNavy({ sex: "female", heightCm: 165, neckCm: 32, waistCm: 70, hipCm: 95 });
    expect(r.bodyFatPct).toBeGreaterThan(10);
  });
});

describe("idealWeight", () => {
  it("Devine formula for a 6 ft male", () => {
    const r = idealWeight({ sex: "male", heightCm: 182.88 });
    expect(r.idealWeightKg).toBeCloseTo(77.7, 0);
  });

  it("healthy range brackets BMI 18.5–24.9", () => {
    const r = idealWeight({ sex: "female", heightCm: 165 });
    expect(r.healthyMinKg).toBeLessThan(r.healthyMaxKg);
  });
});

describe("waterIntake", () => {
  it("adds exercise allowance", () => {
    const base = waterIntake({ weightKg: 60 }).liters;
    const active = waterIntake({ weightKg: 60, activityMinutes: 60 }).liters;
    expect(active).toBeCloseTo(base + 0.7, 1);
  });
});

describe("pregnancyDueDate", () => {
  it("adds 280 days to LMP", () => {
    const r = pregnancyDueDate({ lmpDate: "2026-01-01" });
    expect(r.dueDate).toBe("2026-10-08");
    expect(r.gestationalDays).toBe(280);
  });
});

describe("ovulation", () => {
  it("28-day cycle ovulates on day 14", () => {
    const r = ovulation({ cycleStartDate: "2026-03-01" });
    expect(r.ovulationDate).toBe("2026-03-15");
    expect(r.fertileStart).toBe("2026-03-11");
    expect(r.fertileEnd).toBe("2026-03-16");
  });

  it("30-day cycle shifts ovulation later", () => {
    const r = ovulation({ cycleStartDate: "2026-03-01", cycleLengthDays: 30 });
    expect(r.ovulationDate).toBe("2026-03-17");
  });
});

describe("runningPace", () => {
  it("5k in 25 minutes → 5 min/km", () => {
    const r = runningPace({ distanceKm: 5, minutes: 25 });
    expect(r.paceMinPerKm).toBe(5);
    expect(r.speedKmh).toBe(12);
    expect(r.totalSeconds).toBe(1500);
  });

  it("rejects zero time", () => {
    expect(() => runningPace({ distanceKm: 5 })).toThrow(/ERR_TIME_REQUIRED/);
  });
});

describe("caloriesBurned", () => {
  it("MET × kg × hours", () => {
    expect(caloriesBurned({ met: 8, weightKg: 75, minutes: 60 }).calories).toBe(600);
  });
});

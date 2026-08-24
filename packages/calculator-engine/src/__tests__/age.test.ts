import { describe, expect, it } from "vitest";
import { age } from "../age";

describe("age", () => {
  it("computes exact years/months/days", () => {
    const result = age({ birthDate: "1990-06-15", onDate: "2026-08-21" });
    expect(result.years).toBe(36);
    expect(result.months).toBe(2);
    expect(result.days).toBe(6);
  });

  it("borrows days from the actual previous month length", () => {
    // Mar 31 → Apr 30: full 0y 0m 30d (April has 30 days)
    const result = age({ birthDate: "2000-03-31", onDate: "2024-04-30" });
    expect(result.years).toBe(24);
    expect(result.months).toBe(0);
    expect(result.days).toBe(30);
  });

  it("handles leap-year birthdays (Feb 29 → Mar 1 in non-leap years)", () => {
    const result = age({ birthDate: "2000-02-29", onDate: "2023-02-28" });
    expect(result.years).toBe(22);
    expect(result.months).toBe(11);
    expect(result.nextBirthdayInDays).toBe(1); // Mar 1, 2023

    const onBirthday = age({ birthDate: "2000-02-29", onDate: "2024-02-29" });
    expect(onBirthday.years).toBe(24);
    expect(onBirthday.nextBirthdayInDays).toBe(366); // next is 2025 → Mar 1
  });

  it("computes totals consistently", () => {
    const result = age({ birthDate: "1990-01-01", onDate: "2020-01-01" });
    expect(result.years).toBe(30);
    expect(result.totalDays).toBe(10957); // 30y incl. 7 leap days (1992–2016)
    expect(result.totalWeeks).toBe(Math.floor(10958 / 7));
    expect(result.totalMonths).toBe(360);
  });

  it("same date yields zeros and birthday countdown of 365/366", () => {
    const result = age({ birthDate: "2001-05-05", onDate: "2001-05-05" });
    expect(result.years).toBe(0);
    expect(result.days).toBe(0);
    expect(result.nextBirthdayInDays).toBe(365);
  });
});

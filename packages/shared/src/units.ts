export interface UnitInfo {
  symbol: Localized;
  factor: number;
}

import type { Localized } from "./types";

export interface UnitTable {
  base: string;
  units: Record<string, UnitInfo>;
}

export const UNIT_TABLES: Record<string, UnitTable> = {
  length: {
    base: "m",
    units: {
      mm: { factor: 0.001, symbol: { en: "mm", ar: "مم" } },
      cm: { factor: 0.01, symbol: { en: "cm", ar: "سم" } },
      m: { factor: 1, symbol: { en: "m", ar: "م" } },
      km: { factor: 1000, symbol: { en: "km", ar: "كم" } },
      in: { factor: 0.0254, symbol: { en: "in", ar: "بوصة" } },
      ft: { factor: 0.3048, symbol: { en: "ft", ar: "قدم" } },
      yd: { factor: 0.9144, symbol: { en: "yd", ar: "ياردة" } },
      mi: { factor: 1609.344, symbol: { en: "mi", ar: "ميل" } },
    },
  },
  weight: {
    base: "kg",
    units: {
      mg: { factor: 0.000001, symbol: { en: "mg", ar: "ملجم" } },
      g: { factor: 0.001, symbol: { en: "g", ar: "جم" } },
      kg: { factor: 1, symbol: { en: "kg", ar: "كجم" } },
      t: { factor: 1000, symbol: { en: "t", ar: "طن" } },
      oz: { factor: 0.028349523125, symbol: { en: "oz", ar: "أونصة" } },
      lb: { factor: 0.45359237, symbol: { en: "lb", ar: "رطل" } },
    },
  },
  area: {
    base: "m2",
    units: {
      cm2: { factor: 0.0001, symbol: { en: "cm²", ar: "سم²" } },
      m2: { factor: 1, symbol: { en: "m²", ar: "م²" } },
      km2: { factor: 1000000, symbol: { en: "km²", ar: "كم²" } },
      ft2: { factor: 0.09290304, symbol: { en: "ft²", ar: "قدم²" } },
      acre: { factor: 4046.8564224, symbol: { en: "acre", ar: "فدان أمريكي" } },
      hectare: { factor: 10000, symbol: { en: "ha", ar: "هكتار" } },
    },
  },
  volume: {
    base: "l",
    units: {
      ml: { factor: 0.001, symbol: { en: "mL", ar: "مل" } },
      l: { factor: 1, symbol: { en: "L", ar: "لتر" } },
      m3: { factor: 1000, symbol: { en: "m³", ar: "م³" } },
      tsp: { factor: 0.00492892159375, symbol: { en: "tsp", ar: "ملعقة صغيرة" } },
      tbsp: { factor: 0.01478676478125, symbol: { en: "tbsp", ar: "ملعقة كبيرة" } },
      cup: { factor: 0.2365882365, symbol: { en: "cup", ar: "كوب" } },
      galUS: { factor: 3.785411784, symbol: { en: "gal (US)", ar: "جالون أمريكي" } },
    },
  },
  speed: {
    base: "mps",
    units: {
      ms: { factor: 1, symbol: { en: "m/s", ar: "م/ث" } },
      kmh: { factor: 1 / 3.6, symbol: { en: "km/h", ar: "كم/س" } },
      mph: { factor: 0.44704, symbol: { en: "mph", ar: "ميل/س" } },
      knot: { factor: 0.5144444444444445, symbol: { en: "kn", ar: "عقدة" } },
    },
  },
  data: {
    base: "B",
    units: {
      B: { factor: 1, symbol: { en: "B", ar: "بايت" } },
      KB: { factor: 1e3, symbol: { en: "KB", ar: "كيلوبايت" } },
      MB: { factor: 1e6, symbol: { en: "MB", ar: "ميجابايت" } },
      GB: { factor: 1e9, symbol: { en: "GB", ar: "جيجابايت" } },
      TB: { factor: 1e12, symbol: { en: "TB", ar: "تيرابايت" } },
      KiB: { factor: 1024, symbol: { en: "KiB", ar: "كيلوبايت ثنائي" } },
      MiB: { factor: 1048576, symbol: { en: "MiB", ar: "ميجابايت ثنائي" } },
      GiB: { factor: 1073741824, symbol: { en: "GiB", ar: "جيجابايت ثنائي" } },
    },
  },
  time: {
    base: "s",
    units: {
      s: { factor: 1, symbol: { en: "s", ar: "ثانية" } },
      min: { factor: 60, symbol: { en: "min", ar: "دقيقة" } },
      h: { factor: 3600, symbol: { en: "h", ar: "ساعة" } },
      day: { factor: 86400, symbol: { en: "day", ar: "يوم" } },
      week: { factor: 604800, symbol: { en: "week", ar: "أسبوع" } },
      month30: { factor: 2592000, symbol: { en: "month (30d)", ar: "شهر (30 يوم)" } },
      year365: { factor: 31536000, symbol: { en: "year (365d)", ar: "سنة (365 يوم)" } },
    },
  },
};

export const TEMPERATURE_UNITS = ["C", "F", "K"] as const;

export function unitOptions(tableKey: string) {
  return Object.entries(UNIT_TABLES[tableKey].units).map(([value, info]) => ({
    value,
    label: info.symbol,
  }));
}

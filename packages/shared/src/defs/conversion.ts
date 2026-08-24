import type { CalculatorDef } from "../types";
import { unitOptions } from "../units";

function converter(
  slug: string,
  icon: string,
  tableKey: string,
  titleEn: string,
  titleAr: string
): CalculatorDef {
  return {
    slug,
    category: "conversion",
    icon,
    title: { en: titleEn, ar: titleAr },
    short: {
      en: `Convert between ${tableKey} units.`,
      ar: "التحويل بين وحدات القياس.",
    },
    description: {
      en: "Instant conversion between units with exact standard factors.",
      ar: "تحويل فوري بين الوحدات بمعاملات قياسية دقيقة.",
    },
    fields: [
      { name: "value", type: "number", label: { en: "Value", ar: "القيمة" } },
      { name: "from", type: "select", label: { en: "From", ar: "من" }, options: unitOptions(tableKey) },
      { name: "to", type: "select", label: { en: "To", ar: "إلى" }, options: unitOptions(tableKey) },
    ],
    results: [{ key: "result", label: { en: "Result", ar: "النتيجة" }, format: "number", highlight: true }],
  };
}

export const CONVERSION_DEFS: CalculatorDef[] = [
  converter("length-converter", "📏", "length", "Length Converter", "محوّل الأطوال"),
  converter("weight-converter", "🏋️", "weight", "Weight Converter", "محوّل الأوزان"),
  converter("area-converter", "🗺️", "area", "Area Converter", "محوّل المساحات"),
  converter("volume-converter", "🥤", "volume", "Volume Converter", "محوّل الحجوم"),
  converter("speed-converter", "🏎️", "speed", "Speed Converter", "محوّل السرعات"),
  converter("data-storage-converter", "💾", "data", "Data Storage Converter", "محوّل تخزين البيانات"),
  converter("time-converter", "⏰", "time", "Time Converter", "محوّل الوقت"),
  {
    slug: "temperature-converter",
    category: "conversion",
    icon: "🌡️",
    title: { en: "Temperature Converter", ar: "محوّل درجات الحرارة" },
    short: { en: "Celsius, Fahrenheit, Kelvin.", ar: "مئوية، فهرنهايت، كلفن." },
    description: { en: "Convert between Celsius, Fahrenheit and Kelvin.", ar: "التحويل بين المئوية وفهرنهايت وكلفن." },
    fields: [
      { name: "value", type: "number", min: -1000, max: 100000, label: { en: "Temperature", ar: "درجة الحرارة" } },
      {
        name: "from",
        type: "select",
        label: { en: "From", ar: "من" },
        options: [
          { value: "C", label: { en: "°C Celsius", ar: "°C مئوية" } },
          { value: "F", label: { en: "°F Fahrenheit", ar: "°F فهرنهايت" } },
          { value: "K", label: { en: "K Kelvin", ar: "K كلفن" } },
        ],
      },
      {
        name: "to",
        type: "select",
        label: { en: "To", ar: "إلى" },
        options: [
          { value: "C", label: { en: "°C Celsius", ar: "°C مئوية" } },
          { value: "F", label: { en: "°F Fahrenheit", ar: "°F فهرنهايت" } },
          { value: "K", label: { en: "K Kelvin", ar: "K كلفن" } },
        ],
      },
    ],
    results: [{ key: "result", label: { en: "Result", ar: "النتيجة" }, format: "number", highlight: true }],
  },
];

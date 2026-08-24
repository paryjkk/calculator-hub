import type { CalculatorDef } from "../types";

const onOff = (en: string, ar: string) => [
  { value: "on", label: { en, ar } },
  { value: "off", label: { en: `No ${en.toLowerCase()}`, ar: `بدون ${ar}` } },
];

export const UTILITIES_DEFS: CalculatorDef[] = [
  {
    slug: "password-generator",
    category: "utilities",
    icon: "🔐",
    title: { en: "Password Generator", ar: "مولد كلمات المرور" },
    short: { en: "Strong random passwords.", ar: "كلمات مرور قوية وعشوائية." },
    description: {
      en: "Cryptographically random passwords — choose length and character sets.",
      ar: "كلمات مرور عشوائية بتشفير آمن — اختر الطول ومجموعات المحارف.",
    },
    fields: [
      { name: "length", type: "integer", min: 4, max: 128, label: { en: "Length", ar: "الطول" } },
      { name: "uppercase", type: "select", label: { en: "Uppercase (A-Z)", ar: "أحرف كبيرة (A-Z)" }, options: onOff("Yes", "نعم") },
      { name: "lowercase", type: "select", label: { en: "Lowercase (a-z)", ar: "أحرف صغيرة (a-z)" }, options: onOff("Yes", "نعم") },
      { name: "digits", type: "select", label: { en: "Digits (0-9)", ar: "أرقام (0-9)" }, options: onOff("Yes", "نعم") },
      { name: "symbols", type: "select", label: { en: "Symbols (!@#…)", ar: "رموز (!@#…)" }, options: onOff("Yes", "نعم") },
    ],
    results: [{ key: "password", label: { en: "Password", ar: "كلمة المرور" }, format: "raw", highlight: true }],
    note: {
      en: "Generated server-side with crypto.randomBytes; never stored.",
      ar: "تُولَّد على الخادم بمولد عشوائي آمن ولا تُخزَّن إطلاقاً.",
    },
  },
  {
    slug: "uuid-generator",
    category: "utilities",
    icon: "🆔",
    title: { en: "UUID Generator", ar: "مولد المعرفات UUID" },
    short: { en: "RFC 4122 v4 identifiers.", ar: "معرفات v4 وفق RFC 4122." },
    description: { en: "Generate one or more random UUIDs (version 4).", ar: "أنشئ معرفاً أو أكثر عشوائياً من الإصدار الرابع." },
    fields: [
      { name: "count", type: "integer", min: 1, max: 50, optional: true, label: { en: "How many (default 1)", ar: "الكمية (افتراضي 1)" } },
    ],
    results: [{ key: "valuesText", label: { en: "UUIDs", ar: "المعرفات" }, format: "raw", highlight: true }],
  },
  {
    slug: "dice-roller",
    category: "utilities",
    icon: "🎲",
    title: { en: "Dice Roller", ar: "رامي النرد" },
    short: { en: "Roll N dice with S sides.", ar: "ارمِ عدة نرود بأوجه مختلفة." },
    description: { en: "Roll any number of dice with any number of sides; optional seed for reproducibility.", ar: "ارمِ أي عدد من النرود بأي عدد من الأوجه؛ بذرة اختيارية للتكرارية." },
    fields: [
      { name: "sides", type: "integer", min: 2, max: 1000, label: { en: "Sides per die", ar: "عدد أوجه النرد" } },
      { name: "count", type: "integer", min: 1, max: 20, optional: true, label: { en: "Number of dice (default 1)", ar: "عدد النرود (افتراضي 1)" } },
    ],
    results: [
      { key: "rollsText", label: { en: "Rolls", ar: "النتائج" }, format: "raw", highlight: true },
      { key: "total", label: { en: "Total", ar: "المجموع" }, format: "number" },
    ],
  },
  {
    slug: "random-picker",
    category: "utilities",
    icon: "🎯",
    title: { en: "Random Picker", ar: "منتقي عشوائي" },
    short: { en: "Pick winners from a list.", ar: "اختر فائزين من قائمة." },
    description: { en: "Randomly pick one or more entries from your list without repeats.", ar: "اختر عناصر عشوائية من قائمتك بدون تكرار." },
    fields: [
      { name: "items", type: "text", label: { en: "Items (comma separated)", ar: "العناصر (مفصولة بفاصلة)" }, placeholder: "Ali, Sara, Omar" },
      { name: "picks", type: "integer", min: 1, max: 100, optional: true, label: { en: "Picks (default 1)", ar: "عدد الاختيارات (افتراضي 1)" } },
    ],
    results: [{ key: "pickedText", label: { en: "Picked", ar: "النتيجة" }, format: "raw", highlight: true }],
  },
  {
    slug: "base64",
    category: "utilities",
    icon: "🔁",
    title: { en: "Base64 Encode / Decode", ar: "ترميز وفك Base64" },
    short: { en: "Text ⇄ Base64.", ar: "نص إلى Base64 والعكس." },
    description: { en: "Encode text to Base64 or decode Base64 back to text (UTF-8).", ar: "رمّز النص إلى Base64 أو فُك الترميز إلى نص (UTF-8)." },
    fields: [
      {
        name: "mode",
        type: "select",
        label: { en: "Mode", ar: "الوضع" },
        options: [
          { value: "encode", label: { en: "Encode text → Base64", ar: "ترميز نص ← Base64" } },
          { value: "decode", label: { en: "Decode Base64 → text", ar: "فك ترميز Base64 ← نص" } },
        ],
      },
      { name: "input", type: "text", label: { en: "Input", ar: "الإدخال" } },
    ],
    results: [{ key: "output", label: { en: "Output", ar: "الناتج" }, format: "raw", highlight: true }],
  },
];

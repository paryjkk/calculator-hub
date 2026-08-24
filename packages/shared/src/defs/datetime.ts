import type { CalculatorDef } from "../types";

export const DATETIME_DEFS: CalculatorDef[] = [
  {
    slug: "age",
    category: "datetime",
    icon: "🎂",
    title: { en: "Age Calculator", ar: "حاسبة العمر" },
    short: { en: "Exact age in years, months, and days.", ar: "عمرك بدقة بالسنوات والأشهر والأيام." },
    description: {
      en: "Compute an exact age in years, months, and days — including totals in months, weeks, and days — and the countdown to the next birthday.",
      ar: "احسب العمر بدقة بالسنوات والأشهر والأيام مع الإجماليات والعد التنازلي لعيد الميلاد القادم.",
    },
    fields: [
      { name: "birthDate", type: "date", label: { en: "Date of birth", ar: "تاريخ الميلاد" } },
      { name: "onDate", type: "date", optional: true, serverDefault: "today", label: { en: "Age at date (optional)", ar: "العمر عند تاريخ (اختياري)" } },
    ],
    results: [
      { key: "yearsMonthsDays", label: { en: "Exact age", ar: "العمر بالضبط" }, format: "raw", highlight: true },
      { key: "totalMonths", label: { en: "Total months", ar: "إجمالي الأشهر" }, format: "number" },
      { key: "totalWeeks", label: { en: "Total weeks", ar: "إجمالي الأسابيع" }, format: "number" },
      { key: "totalDays", label: { en: "Total days", ar: "إجمالي الأيام" }, format: "number" },
      { key: "nextBirthdayInDays", label: { en: "Next birthday (days)", ar: "عيد الميلاد القادم (أيام)" }, format: "number" },
    ],
  },
  {
    slug: "date-difference",
    category: "datetime",
    icon: "📆",
    title: { en: "Date Difference", ar: "الفرق بين تاريخين" },
    short: { en: "Days, weeks, months between dates.", ar: "الأيام والأسابيع والأشهر بين تاريخين." },
    description: { en: "Calendar-aware difference between two dates.", ar: "الفرق بين تاريخين وفق التقويم الفعلي." },
    fields: [
      { name: "startDate", type: "date", label: { en: "Start date", ar: "تاريخ البداية" } },
      { name: "endDate", type: "date", optional: true, serverDefault: "today", label: { en: "End date (optional)", ar: "تاريخ النهاية (اختياري)" } },
    ],
    results: [
      { key: "yearsMonthsDays", label: { en: "Difference", ar: "الفرق" }, format: "raw", highlight: true },
      { key: "totalDays", label: { en: "Total days", ar: "إجمالي الأيام" }, format: "number" },
      { key: "totalWeeks", label: { en: "Total weeks", ar: "إجمالي الأسابيع" }, format: "number" },
    ],
  },
  {
    slug: "add-days",
    category: "datetime",
    icon: "➕",
    title: { en: "Add / Subtract Days", ar: "إضافة أو طرح أيام" },
    short: { en: "Date math from any start date.", ar: "عمليات على التواريخ من أي بداية." },
    description: { en: "Find the date that is N days after (or before) a start date.", ar: "اعثر على التاريخ الذي يبعد N يوماً عن تاريخ البداية." },
    fields: [
      { name: "startDate", type: "date", label: { en: "Start date", ar: "تاريخ البداية" } },
      { name: "days", type: "integer", min: -1000000, max: 1000000, label: { en: "Days (+/−)", ar: "الأيام (+/−)" } },
    ],
    results: [
      { key: "resultDate", label: { en: "Resulting date", ar: "التاريخ الناتج" }, format: "date", highlight: true },
      { key: "weekdayLabel", label: { en: "Weekday", ar: "يوم الأسبوع" }, format: "raw" },
    ],
  },
  {
    slug: "days-until",
    category: "datetime",
    icon: "⏳",
    title: { en: "Days Until / Since", ar: "أيام حتى / منذ" },
    short: { en: "Countdown or count-up to a date.", ar: "عد تنازلي أو تصاعدي لتاريخ." },
    description: { en: "Days from today (or a reference date) until a target date — negative means past.", ar: "الأيام من اليوم (أو تاريخ مرجعي) حتى تاريخ مستهدف — السالب يعني الماضي." },
    fields: [
      { name: "targetDate", type: "date", label: { en: "Target date", ar: "التاريخ المستهدف" } },
      { name: "fromDate", type: "date", optional: true, serverDefault: "today", label: { en: "From date (optional)", ar: "من تاريخ (اختياري)" } },
    ],
    results: [
      { key: "days", label: { en: "Days", ar: "الأيام" }, format: "number", highlight: true },
      { key: "weeksLabel", label: { en: "As weeks & days", ar: "بأسابيع وأيام" }, format: "raw" },
    ],
  },
  {
    slug: "work-hours",
    category: "datetime",
    icon: "🧰",
    title: { en: "Work Hours", ar: "ساعات العمل" },
    short: { en: "Hours worked minus break.", ar: "ساعات العمل مطروحاً منها الاستراحة." },
    description: { en: "Compute hours worked between a start and end time (supports overnight), minus unpaid break minutes.", ar: "احسب ساعات العمل بين وقتي البدء والانتهاء (يدعم ما بعد منتصف الليل) مطروحاً منها دقائق الاستراحة." },
    fields: [
      { name: "startTime", type: "text", label: { en: "Start time (HH:MM)", ar: "وقت البدء (سس:دد)" }, placeholder: "09:00" },
      { name: "endTime", type: "text", label: { en: "End time (HH:MM)", ar: "وقت الانتهاء (سس:دد)" }, placeholder: "17:30" },
      { name: "breakMinutes", type: "integer", min: 0, max: 720, optional: true, label: { en: "Unpaid break (optional)", ar: "استراحة بدون أجر (اختياري)" }, suffix: { en: "min", ar: "دقيقة" } },
    ],
    results: [
      { key: "hoursDecimal", label: { en: "Hours worked", ar: "ساعات العمل" }, format: "number", highlight: true },
      { key: "hoursMinutesLabel", label: { en: "As h:mm", ar: "بالساعات والدقائق" }, format: "raw" },
    ],
  },
  {
    slug: "iso-week-number",
    category: "datetime",
    icon: "🗓️",
    title: { en: "ISO Week Number", ar: "رقم الأسبوع الدولي" },
    short: { en: "Which week of the year?", ar: "أي أسبوع في السنة؟" },
    description: { en: "ISO-8601 week number and week-year for any date.", ar: "رقم الأسبوع حسب ISO-8601 وسنة الأسبوع لأي تاريخ." },
    fields: [{ name: "date", type: "date", label: { en: "Date", ar: "التاريخ" } }],
    results: [
      { key: "weekNumber", label: { en: "Week number", ar: "رقم الأسبوع" }, format: "number", highlight: true },
      { key: "weekYear", label: { en: "Week-year", ar: "سنة الأسبوع" }, format: "number" },
    ],
  },
];

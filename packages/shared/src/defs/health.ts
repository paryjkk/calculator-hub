import type { CalculatorDef } from "../types";

const SEX_OPTIONS = [
  { value: "male", label: { en: "Male", ar: "ذكر" } },
  { value: "female", label: { en: "Female", ar: "أنثى" } },
];

export const HEALTH_DEFS: CalculatorDef[] = [
  {
    slug: "bmi",
    category: "health",
    icon: "⚖️",
    title: { en: "BMI Calculator", ar: "حاسبة كتلة الجسم" },
    short: { en: "Body Mass Index and category.", ar: "مؤشر كتلة الجسم وتصنيفه." },
    description: {
      en: "Compute Body Mass Index from metric height and weight, with the WHO weight category.",
      ar: "احسب مؤشر كتلة الجسم من الطول والوزن بالنظام المتري مع تصنيف منظمة الصحة العالمية.",
    },
    fields: [
      { name: "weightKg", type: "number", min: 1, max: 500, label: { en: "Weight", ar: "الوزن" }, suffix: { en: "kg", ar: "كجم" } },
      { name: "heightCm", type: "number", min: 30, max: 280, label: { en: "Height", ar: "الطول" }, suffix: { en: "cm", ar: "سم" } },
    ],
    results: [
      { key: "bmi", label: { en: "BMI", ar: "مؤشر كتلة الجسم" }, format: "number", highlight: true },
      { key: "categoryCode", label: { en: "Category", ar: "التصنيف" }, format: "raw" },
    ],
    note: {
      en: "BMI is a rough screening tool; it does not measure body fat directly.",
      ar: "مؤشر كتلة الجسم أداة فرز تقريبية ولا يقيس دهون الجسم مباشرة.",
    },
  },
  {
    slug: "bmr",
    category: "health",
    icon: "🔥",
    title: { en: "BMR Calculator", ar: "حاسبة الأيض الأساسي" },
    short: { en: "Calories your body burns at rest.", ar: "سعرات يحرقها جسمك في الراحة." },
    description: {
      en: "Basal Metabolic Rate using the Mifflin-St Jeor equation.",
      ar: "معدل الأيض الأساسي باستخدام معادلة ميفلين-سانت جور.",
    },
    fields: [
      { name: "sex", type: "select", label: { en: "Sex", ar: "الجنس" }, options: SEX_OPTIONS },
      { name: "age", type: "integer", min: 2, max: 120, label: { en: "Age", ar: "العمر" }, suffix: { en: "years", ar: "سنة" } },
      { name: "heightCm", type: "number", min: 30, max: 280, label: { en: "Height", ar: "الطول" }, suffix: { en: "cm", ar: "سم" } },
      { name: "weightKg", type: "number", min: 1, max: 500, label: { en: "Weight", ar: "الوزن" }, suffix: { en: "kg", ar: "كجم" } },
    ],
    results: [{ key: "bmr", label: { en: "BMR", ar: "الأيض الأساسي" }, format: "number", highlight: true }],
    note: { en: "kcal/day", ar: "كيلو كالوري/يوم" },
  },
  {
    slug: "tdee",
    category: "health",
    icon: "🏃",
    title: { en: "Daily Calories (TDEE)", ar: "السعرات اليومية (TDEE)" },
    short: { en: "Total daily energy expenditure.", ar: "إجمالي الطاقة اليومية المصروفة." },
    description: {
      en: "Daily calorie needs based on BMR and activity level.",
      ar: "احتياجات السعرات اليومية بناءً على الأيض الأساسي ومستوى النشاط.",
    },
    fields: [
      { name: "sex", type: "select", label: { en: "Sex", ar: "الجنس" }, options: SEX_OPTIONS },
      { name: "age", type: "integer", min: 2, max: 120, label: { en: "Age", ar: "العمر" }, suffix: { en: "years", ar: "سنة" } },
      { name: "heightCm", type: "number", min: 30, max: 280, label: { en: "Height", ar: "الطول" }, suffix: { en: "cm", ar: "سم" } },
      { name: "weightKg", type: "number", min: 1, max: 500, label: { en: "Weight", ar: "الوزن" }, suffix: { en: "kg", ar: "كجم" } },
      {
        name: "activity",
        type: "select",
        label: { en: "Activity level", ar: "مستوى النشاط" },
        options: [
          { value: "sedentary", label: { en: "Sedentary (×1.2)", ar: "خفيف جدًا (×1.2)" } },
          { value: "light", label: { en: "Light (×1.375)", ar: "خفيف (×1.375)" } },
          { value: "moderate", label: { en: "Moderate (×1.55)", ar: "متوسط (×1.55)" } },
          { value: "active", label: { en: "Active (×1.725)", ar: "نشط (×1.725)" } },
          { value: "athlete", label: { en: "Athlete (×1.9)", ar: "رياضي (×1.9)" } },
        ],
      },
    ],
    results: [
      { key: "tdee", label: { en: "Daily calories", ar: "السعرات اليومية" }, format: "number", highlight: true },
      { key: "bmr", label: { en: "BMR", ar: "الأيض الأساسي" }, format: "number" },
    ],
    note: { en: "kcal/day", ar: "كيلو كالوري/يوم" },
  },
  {
    slug: "body-fat-navy",
    category: "health",
    icon: "📏",
    title: { en: "Body Fat (Navy Method)", ar: "دهون الجسم (طريقة البحرية)" },
    short: { en: "U.S. Navy circumference method.", ar: "طريقة محيطات الجسم للبحرية الأمريكية." },
    description: {
      en: "Estimate body fat percentage from neck, waist (and hip for women) circumferences and height.",
      ar: "قدّر نسبة دهون الجسم من محيط الرقبة والوسط (والورك للنساء) والطول.",
    },
    fields: [
      { name: "sex", type: "select", label: { en: "Sex", ar: "الجنس" }, options: SEX_OPTIONS },
      { name: "heightCm", type: "number", min: 100, max: 250, label: { en: "Height", ar: "الطول" }, suffix: { en: "cm", ar: "سم" } },
      { name: "neckCm", type: "number", min: 20, max: 80, label: { en: "Neck", ar: "الرقبة" }, suffix: { en: "cm", ar: "سم" } },
      { name: "waistCm", type: "number", min: 40, max: 200, label: { en: "Waist", ar: "الوسط" }, suffix: { en: "cm", ar: "سم" } },
      { name: "hipCm", type: "number", min: 50, max: 250, optional: true, label: { en: "Hip (women only)", ar: "الورك (للنساء فقط)" }, suffix: { en: "cm", ar: "سم" } },
    ],
    results: [
      { key: "bodyFatPct", label: { en: "Body fat", ar: "نسبة الدهون" }, format: "percent", highlight: true },
      { key: "categoryCode", label: { en: "Category", ar: "التصنيف" }, format: "raw" },
    ],
  },
  {
    slug: "ideal-weight",
    category: "health",
    icon: "🎯",
    title: { en: "Ideal Weight", ar: "الوزن المثالي" },
    short: { en: "Devine formula + healthy BMI range.", ar: "معادلة ديفاين ومدى الكتلة الصحية." },
    description: {
      en: "Ideal body weight via the Devine formula plus the healthy weight range implied by BMI 18.5–24.9.",
      ar: "الوزن المثالي بمعادلة ديفاين مع المدى الصحي حسب مؤشر كتلة الجسم 18.5–24.9.",
    },
    fields: [
      { name: "sex", type: "select", label: { en: "Sex", ar: "الجنس" }, options: SEX_OPTIONS },
      { name: "heightCm", type: "number", min: 100, max: 250, label: { en: "Height", ar: "الطول" }, suffix: { en: "cm", ar: "سم" } },
    ],
    results: [
      { key: "idealWeightKg", label: { en: "Ideal weight (Devine)", ar: "الوزن المثالي (ديفاين)" }, format: "number", highlight: true },
      { key: "healthyMinKg", label: { en: "Healthy range — min", ar: "المدى الصحي — أدنى" }, format: "number" },
      { key: "healthyMaxKg", label: { en: "Healthy range — max", ar: "المدى الصحي — أقصى" }, format: "number" },
    ],
    note: { en: "kilograms", ar: "بالكيلوجرام" },
  },
  {
    slug: "water-intake",
    category: "health",
    icon: "💧",
    title: { en: "Water Intake", ar: "احتياج الماء" },
    short: { en: "Recommended daily water.", ar: "الماء الموصى به يوميًا." },
    description: {
      en: "Estimated daily water needs based on body weight and exercise duration.",
      ar: "احتياج الماء اليومي التقديري حسب وزن الجسم ومدة التمرين.",
    },
    fields: [
      { name: "weightKg", type: "number", min: 5, max: 300, label: { en: "Weight", ar: "الوزن" }, suffix: { en: "kg", ar: "كجم" } },
      { name: "activityMinutes", type: "integer", min: 0, max: 600, optional: true, label: { en: "Exercise per day (optional)", ar: "تمرين يوميًا (اختياري)" }, suffix: { en: "min", ar: "دقيقة" } },
    ],
    results: [
      { key: "liters", label: { en: "Daily water", ar: "الماء اليومي" }, format: "number", highlight: true },
      { key: "cups8oz", label: { en: "8 oz cups", ar: "أكواب ٨ أونصة" }, format: "number" },
    ],
    note: { en: "liters/day — general guidance, adjust for climate and health.", ar: "لتر/يوم — إرشاد عام، عدّله حسب المناخ والحالة الصحية." },
  },
  {
    slug: "pregnancy-due-date",
    category: "health",
    icon: "🤰",
    title: { en: "Pregnancy Due Date", ar: "موعد الولادة المتوقع" },
    short: { en: "Estimated due date from LMP.", ar: "الموعد المتوقع من آخر دورة." },
    description: {
      en: "Estimated due date using Naegele's rule (LMP + 280 days).",
      ar: "الموعد المتوقع للولادة بقاعدة نيجيلي (آخر دورة + 280 يوماً).",
    },
    fields: [
      { name: "lmpDate", type: "date", label: { en: "First day of last period", ar: "أول يوم لآخر دورة" } },
    ],
    results: [
      { key: "dueDate", label: { en: "Due date", ar: "موعد الولادة" }, format: "date", highlight: true },
      { key: "gestationalDays", label: { en: "Full term length (days)", ar: "مدة الحمل الكاملة (أيام)" }, format: "number" },
    ],
    note: {
      en: "Medical estimate only — always follow your doctor's dating.",
      ar: "تقدير طبي فقط — اعتمد دائمًا على تقييم طبيبك.",
    },
  },
  {
    slug: "ovulation",
    category: "health",
    icon: "🌸",
    title: { en: "Ovulation Window", ar: "نافذة الإباضة" },
    short: { en: "Predict next ovulation and fertile days.", ar: "تنبؤ بالإباضة وأيام الخصوبة القادمة." },
    description: {
      en: "Estimate the next ovulation day and fertile window from cycle start and cycle length (ovulation ≈ 14 days before next period).",
      ar: "قدّر يوم الإباضة القادم ونافذة الخصوبة من بداية الدورة وطولها (الإباضة ≈ قبل الدورة القادمة بـ14 يوماً).",
    },
    fields: [
      { name: "cycleStartDate", type: "date", label: { en: "First day of last period", ar: "أول يوم لآخر دورة" } },
      { name: "cycleLengthDays", type: "integer", min: 20, max: 45, optional: true, label: { en: "Cycle length (default 28)", ar: "طول الدورة (افتراضي 28)" }, suffix: { en: "days", ar: "يوم" } },
    ],
    results: [
      { key: "ovulationDate", label: { en: "Ovulation (estimated)", ar: "الإباضة (تقديري)" }, format: "date", highlight: true },
      { key: "fertileStart", label: { en: "Fertile window start", ar: "بداية نافذة الخصوبة" }, format: "date" },
      { key: "fertileEnd", label: { en: "Fertile window end", ar: "نهاية نافذة الخصوبة" }, format: "date" },
    ],
  },
  {
    slug: "running-pace",
    category: "health",
    icon: "⏱️",
    title: { en: "Running Pace", ar: "سرعة الجري" },
    short: { en: "Pace and speed from a race time.", ar: "الإيقاع والسرعة من زمن السباق." },
    description: {
      en: "Average pace per kilometer and speed from a distance and finish time.",
      ar: "متوسط الزمن لكل كيلومتر والسرعة من المسافة وزمن الوصول.",
    },
    fields: [
      { name: "distanceKm", type: "number", min: 0.01, max: 1000, step: 0.1, label: { en: "Distance", ar: "المسافة" }, suffix: { en: "km", ar: "كم" } },
      { name: "hours", type: "integer", min: 0, max: 100, optional: true, label: { en: "Hours", ar: "ساعات" } },
      { name: "minutes", type: "integer", min: 0, max: 59, optional: true, label: { en: "Minutes", ar: "دقائق" } },
      { name: "seconds", type: "integer", min: 0, max: 59, optional: true, label: { en: "Seconds", ar: "ثوانٍ" } },
    ],
    results: [
      { key: "paceMinPerKm", label: { en: "Pace (min/km)", ar: "الإيقاع (دقيقة/كم)" }, format: "number", highlight: true },
      { key: "speedKmh", label: { en: "Speed", ar: "السرعة" }, format: "number" },
      { key: "totalSeconds", label: { en: "Total time (s)", ar: "الزمن الكلي (ث)" }, format: "number" },
    ],
  },
  {
    slug: "calories-burned",
    category: "health",
    icon: "🚴",
    title: { en: "Calories Burned", ar: "السعرات المحروقة" },
    short: { en: "MET-based burn estimate.", ar: "تقدير الحرق بطريقة MET." },
    description: {
      en: "Calories burned = MET × weight (kg) × time (hours), the standard compendium formula.",
      ar: "السعرات = معامل النشاط MET × الوزن (كجم) × الزمن (ساعات)، وهي الصيغة المعيارية.",
    },
    fields: [
      { name: "met", type: "number", min: 0.5, max: 25, step: 0.1, label: { en: "Activity MET (walking ≈3.5, running ≈8)", ar: "معامل النشاط MET (مشي ≈3.5، جري ≈8)" } },
      { name: "weightKg", type: "number", min: 10, max: 300, label: { en: "Weight", ar: "الوزن" }, suffix: { en: "kg", ar: "كجم" } },
      { name: "minutes", type: "integer", min: 1, max: 1440, label: { en: "Duration", ar: "المدة" }, suffix: { en: "min", ar: "دقيقة" } },
    ],
    results: [
      { key: "calories", label: { en: "Calories burned", ar: "السعرات المحروقة" }, format: "number", highlight: true },
    ],
    note: { en: "kcal — rough individual estimate.", ar: "كيلو كالوري — تقدير فردي تقريبي." },
  },
];

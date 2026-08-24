import type { Locale } from "@calc/shared";

export type StringMap = Record<string, string>;

export const dictionary: Record<
  Locale,
  {
    brand: string;
    navAll: string;
    navLangSwitch: string;
    footerDisclaimer: string;
    homeTitle: string;
    homeSubtitle: string;
    whyTitle: string;
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    allCalculatorsTitle: string;
    allCalculatorsSubtitle: string;
    calculate: string;
    calculating: string;
    optionalSuffix: string;
    errorGeneric: string;
    resultMissing: string;
    yes: string;
    no: string;
    ymd: string;
    weeksDays: string;
    hoursMinutes: string;
    fieldErrors: StringMap;
    errors: StringMap;
    weekdays: StringMap;
  }
> = {
  en: {
    brand: "Calculator Hub",
    navAll: "All Calculators",
    navLangSwitch: "العربية",
    footerDisclaimer:
      "Estimates are for informational purposes only and do not constitute professional advice.",
    homeTitle: "Free Online Calculators",
    homeSubtitle:
      "Fast, accurate calculators for finance, health, math, conversions and more — powered by a dedicated calculation API. No sign-up, no clutter.",
    whyTitle: "Why Calculator Hub?",
    why1: "Formulas documented, tested, and independently derived",
    why2: "Server-side calculation API — consistent results everywhere",
    why3: "Bilingual English / العربية with full RTL support",
    why4: "Free, responsive, accessible, no registration required",
    allCalculatorsTitle: "All Calculators",
    allCalculatorsSubtitle: "Every calculator, grouped by category.",
    calculate: "Calculate",
    calculating: "Calculating…",
    optionalSuffix: "optional",
    errorGeneric: "Something went wrong. Please check your inputs.",
    resultMissing: "—",
    yes: "Yes",
    no: "No",
    ymd: "{y}y {m}m {d}d",
    weeksDays: "{w}w {d}d",
    hoursMinutes: "{h}h {mm}min",
    fieldErrors: {
      required: "This field is required.",
      invalid_number: "Enter a valid number.",
      invalid_int: "Enter a whole number.",
      invalid_date: "Enter a valid date (YYYY-MM-DD).",
      out_of_min: "Value is below the allowed minimum.",
      out_of_max: "Value is above the allowed maximum.",
      invalid_option: "Choose a valid option.",
    },
    errors: {
      ERR_DOWN_TOO_LARGE: "Down payment cannot exceed the total price.",
      ERR_PAYMENT_TOO_LOW: "Monthly payment is too low to ever cover the interest.",
      ERR_DIV_BY_ZERO: "Division by zero — adjust your inputs.",
      ERR_NOT_QUADRATIC: "Coefficient 'a' must not be zero.",
      ERR_INVALID_TRIANGLE: "These sides cannot form a triangle.",
      ERR_HIP_REQUIRED: "Hip measurement is required for females.",
      ERR_INVALID_MEASUREMENT: "Measurements are inconsistent.",
      ERR_TIME_REQUIRED: "Provide a finish time greater than zero.",
      ERR_RANGE_INVALID: "Min must be less than or equal to max.",
      ERR_EMPTY_LIST: "Please provide at least one item.",
      ERR_INVALID_BASE64: "This is not valid Base64 text.",
      ERR_NO_CHARSETS: "Enable at least one character set.",
      ERR_BAD_TIME: "Use HH:MM 24-hour times.",
      ERR_NO_TIME_LEFT: "Break consumes the whole shift.",
      ERR_START_AFTER_END: "Start must be on or before end.",
      ERR_INVALID_NUMBERS: "Enter a valid list of numbers separated by commas or spaces.",
      ERR_INVALID_OPTION: "Choose a valid option.",
      bmi_underweight: "Underweight",
      bmi_normal: "Healthy weight",
      bmi_overweight: "Overweight",
      bmi_obese: "Obese",
      bf_essential: "Essential fat",
      bf_athletes: "Athletic",
      bf_fitness: "Fit",
      bf_average: "Average",
    },
    weekdays: {
      sunday: "Sunday",
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
    },
  },
  ar: {
    brand: "آلة الحاسبة",
    navAll: "كل الحاسبات",
    navLangSwitch: "English",
    footerDisclaimer: "النتائج للتقدير الإرشادي فقط ولا تُعد استشارة مهنية.",
    homeTitle: "حاسبات مجانية عبر الإنترنت",
    homeSubtitle:
      "حاسبات سريعة ودقيقة للمالية والصحة والرياضيات والتحويلات وأكثر — مدعومة بواجهة حسابات مخصصة، بدون تسجيل أو إزعاج.",
    whyTitle: "لماذا آلة الحاسبة؟",
    why1: "معادلات موثقة ومختبرة ومشتقة باستقلالية",
    why2: "واجهة حسابات على الخادم — نتائج متسقة في كل مكان",
    why3: "ثنائية اللغة: العربية / English مع دعم كامل للكتابة من اليمين",
    why4: "مجاني، متجاوب، ووصولي، بدون تسجيل",
    allCalculatorsTitle: "كل الحاسبات",
    allCalculatorsSubtitle: "جميع الحاسبات مصنّفة حسب التصنيف.",
    calculate: "احسب",
    calculating: "جارٍ الحساب…",
    optionalSuffix: "اختياري",
    errorGeneric: "حدث خطأ ما. تحقق من المدخلات وحاول مجددًا.",
    resultMissing: "—",
    yes: "نعم",
    no: "لا",
    ymd: "{y} سنة و{m} شهر و{d} يوم",
    weeksDays: "{w} أسبوع و{d} يوم",
    hoursMinutes: "{h} ساعة و{mm} دقيقة",
    fieldErrors: {
      required: "هذا الحقل مطلوب.",
      invalid_number: "أدخل رقمًا صحيحًا.",
      invalid_int: "أدخل عددًا صحيحًا.",
      invalid_date: "أدخل تاريخًا صحيحًا (YYYY-MM-DD).",
      out_of_min: "القيمة أقل من الحد المسموح.",
      out_of_max: "القيمة أعلى من الحد المسموح.",
      invalid_option: "اختر قيمة صحيحة.",
    },
    errors: {
      ERR_DOWN_TOO_LARGE: "لا يمكن أن تتجاوز الدفعة الأولى السعر الكلي.",
      ERR_PAYMENT_TOO_LOW: "الدفعة الشهرية أقل من الفائدة ولن يسدَّد الدين أبدًا.",
      ERR_DIV_BY_ZERO: "قسمة على صفر — عدّل المدخلات.",
      ERR_NOT_QUADRATIC: "يجب ألا يكون المعامل 'a' صفرًا.",
      ERR_INVALID_TRIANGLE: "هذه الأضلاع لا تُكوِّن مثلثًا.",
      ERR_HIP_REQUIRED: "قياس الورك مطلوب للإناث.",
      ERR_INVALID_MEASUREMENT: "القياسات غير متسقة.",
      ERR_TIME_REQUIRED: "أدخل زمنًا أكبر من صفر.",
      ERR_RANGE_INVALID: "يجب أن يكون الحد الأدنى ≤ الأقصى.",
      ERR_EMPTY_LIST: "أدخل عنصرًا واحدًا على الأقل.",
      ERR_INVALID_BASE64: "نص Base64 غير صالح.",
      ERR_NO_CHARSETS: "فعّل مجموعة محارف واحدة على الأقل.",
      ERR_BAD_TIME: "استخدم تنسيق HH:MM بنظام 24 ساعة.",
      ERR_NO_TIME_LEFT: "الاستراحة تلتهم كل فترة العمل.",
      ERR_START_AFTER_END: "يجب أن تكون البداية قبل النهاية أو مساوية لها.",
      ERR_INVALID_NUMBERS: "أدخل قائمة أرقام صحيحة مفصولة بفواصل أو مسافات.",
      ERR_INVALID_OPTION: "اختر قيمة صحيحة.",
      bmi_underweight: "نقص الوزن",
      bmi_normal: "وزن صحي",
      bmi_overweight: "زيادة الوزن",
      bmi_obese: "سمنة",
      bf_essential: "دهون أساسية",
      bf_athletes: "رياضي",
      bf_fitness: "لياقة عالية",
      bf_average: "متوسط",
    },
    weekdays: {
      sunday: "الأحد",
      monday: "الإثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
    },
  },
};

export function getDictionary(locale: Locale) {
  return dictionary[locale];
}

export function interpolate(
  template: string,
  vars: Record<string, string | number>
): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(vars[key] ?? ""));
}

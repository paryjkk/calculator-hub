import type { Locale } from "@calc/shared";

export type StringMap = Record<string, string>;

export const dictionary: Record<
  Locale,
  {
    brand: string;
    tagline: string;
    navAll: string;
    navAbout: string;
    navContact: string;
    navPrivacy: string;
    navTerms: string;
    navLangSwitch: string;
    account: string;
    login: string;
    register: string;
    logout: string;
    adminPanel: string;
    footerBlurb: string;
    footerExploreTitle: string;
    footerLegalTitle: string;
    footerDisclaimer: string;
    homeKicker: string;
    homeTitle: string;
    homeSubtitle: string;
    builtTitle: string;
    built1: string;
    built2: string;
    built3: string;
    built4: string;
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
    relatedTitle: string;
    fieldErrors: StringMap;
    errors: StringMap;
    weekdays: StringMap;
  }
> = {
  en: {
    brand: "Calculator Hub",
    tagline: "Every calculator you need. Nothing you don't.",
    navAll: "Calculators",
    navAbout: "About",
    navContact: "Contact",
    navPrivacy: "Privacy",
    navTerms: "Terms",
    navLangSwitch: "العربية",
    account: "Account",
    login: "Sign in",
    register: "Create account",
    logout: "Sign out",
    adminPanel: "Dashboard",
    footerBlurb:
      "Hand-built calculators for money, health, math and everyday conversions. Formulas in the open, results you can check.",
    footerExploreTitle: "Explore",
    footerLegalTitle: "Legal",
    footerDisclaimer:
      "Results are estimates for guidance only, not professional advice.",
    homeKicker: "54 calculators · free forever",
    homeTitle: "Every calculator you need.",
    homeSubtitle:
      "Money, health, math and unit conversions — fast pages, exact formulas, and an Arabic interface that was designed, not translated.",
    builtTitle: "Built properly",
    built1: "Formulas derived from published standards — 89 unit tests guard them",
    built2: "Computed on the server, so every device gets the same answer",
    built3: "Arabic is a first-class interface, mirrored right-to-left by design",
    built4: "No accounts needed, no pop-ups, no cookie circus",
    allCalculatorsTitle: "All calculators",
    allCalculatorsSubtitle: "Fifty-four of them, grouped the way you think.",
    calculate: "Calculate",
    calculating: "Working…",
    optionalSuffix: "optional",
    errorGeneric: "Something didn't add up. Check your inputs and try again.",
    resultMissing: "—",
    yes: "Yes",
    no: "No",
    ymd: "{y}y {m}m {d}d",
    weeksDays: "{w}w {d}d",
    hoursMinutes: "{h}h {mm}min",
    relatedTitle: "Related",
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
    tagline: "كل حاسبة تحتاجها. ولا شيء زائد.",
    navAll: "الحاسبات",
    navAbout: "من نحن",
    navContact: "اتصل بنا",
    navPrivacy: "الخصوصية",
    navTerms: "الشروط",
    navLangSwitch: "English",
    account: "حسابي",
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "خروج",
    adminPanel: "لوحة التحكم",
    footerBlurb:
      "حاسبات مصنوعة بعناية للمال والصحة والرياضيات وتحويل الوحدات — معادلات معلَنة ونتائج يمكنك التحقق منها بنفسك.",
    footerExploreTitle: "تصفّح",
    footerLegalTitle: "قانوني",
    footerDisclaimer: "النتائج تقديرات إرشادية وليست استشارة مهنية.",
    homeKicker: "٥٤ حاسبة · مجانية دائماً",
    homeTitle: "كل حاسبة تحتاجها.",
    homeSubtitle:
      "المال والصحة والرياضيات وتحويل الوحدات — صفحات سريعة، معادلات دقيقة، وواجهة عربية صُممت من الأساس لا تُرجمت.",
    builtTitle: "صُنعت كما يجب",
    built1: "معادلات مشتقة من مراجع منشورة — و٨٩ اختباراً آلياً تحرسها",
    built2: "الحساب يجري على الخادم، فتحصل كل الأجهزة على الجواب نفسه",
    built3: "العربية واجهة أصلية كاملة الاتجاه، ليست ترجمة لاحقة",
    built4: "بدون حسابات، بدون نوافذ مزعجة، بدون سيرك الكوكيز",
    allCalculatorsTitle: "كل الحاسبات",
    allCalculatorsSubtitle: "أربع وخمسون حاسبة، مصنّفة كما يفكر الناس.",
    calculate: "احسب",
    calculating: "يجري الحساب…",
    optionalSuffix: "اختياري",
    errorGeneric: "شيء لم يستقم. تحقق من المدخلات وحاول مجدداً.",
    resultMissing: "—",
    yes: "نعم",
    no: "لا",
    ymd: "{y} سنة و{m} شهر و{d} يوم",
    weeksDays: "{w} أسبوع و{d} يوم",
    hoursMinutes: "{h} ساعة و{mm} دقيقة",
    relatedTitle: "ذات صلة",
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

import type { CalculatorDef, FieldDef } from "../types";

const money = (name: string, en: string, ar: string, min = 0.01): FieldDef => ({
  name,
  type: "number",
  min,
  label: { en, ar },
});

const rate = (name: string, en: string, ar: string, optional = false): FieldDef => ({
  name,
  type: "number",
  min: 0,
  max: 100,
  optional,
  label: { en, ar },
  suffix: { en: "%", ar: "٪" },
});

export const FINANCIAL_DEFS: CalculatorDef[] = [
  {
    slug: "loan-payment",
    category: "financial",
    icon: "🏦",
    title: { en: "Loan Monthly Payment", ar: "قسط القرض الشهري" },
    short: {
      en: "Estimate your fixed monthly loan payment.",
      ar: "احسب قسطك الشهري الثابت للقرض.",
    },
    description: {
      en: "Calculate the fixed monthly payment for an amortizing loan, plus total paid and total interest over the life of the loan.",
      ar: "احسب القسط الشهري الثابت لقرض مُقسَّط، بالإضافة إلى إجمالي المدفوعات والفوائد على مدى عمر القرض.",
    },
    fields: [
      money("principal", "Loan amount", "مبلغ القرض"),
      rate("annualRatePct", "Annual interest rate", "الفائدة السنوية"),
      { name: "years", type: "integer", min: 1, max: 50, label: { en: "Term (years)", ar: "المدة (سنوات)" } },
    ],
    results: [
      { key: "monthlyPayment", label: { en: "Monthly payment", ar: "القسط الشهري" }, format: "currency", highlight: true },
      { key: "totalPaid", label: { en: "Total paid", ar: "إجمالي المدفوع" }, format: "currency" },
      { key: "totalInterest", label: { en: "Total interest", ar: "إجمالي الفوائد" }, format: "currency" },
    ],
  },
  {
    slug: "loan-amortization",
    category: "financial",
    icon: "📊",
    title: { en: "Loan Amortization", ar: "جدول سداد القرض" },
    short: {
      en: "See how each payment splits interest vs principal.",
      ar: "شاهد كيف يتوزع كل قسط بين الفائدة وأصل الدين.",
    },
    description: {
      en: "Generate a full month-by-month amortization schedule showing how much of every payment goes to interest and principal, and the remaining balance.",
      ar: "أنشئ جدولاً شهرياً كاملاً يوضح توزيع كل قسط على الفائدة وأصل الدين والرصيد المتبقي.",
    },
    fields: [
      money("principal", "Loan amount", "مبلغ القرض"),
      rate("annualRatePct", "Annual interest rate", "الفائدة السنوية"),
      { name: "years", type: "integer", min: 1, max: 30, label: { en: "Term (years)", ar: "المدة (سنوات)" } },
    ],
    results: [
      { key: "monthlyPayment", label: { en: "Monthly payment", ar: "القسط الشهري" }, format: "currency", highlight: true },
      { key: "totalPaid", label: { en: "Total paid", ar: "إجمالي المدفوع" }, format: "currency" },
      { key: "totalInterest", label: { en: "Total interest", ar: "إجمالي الفوائد" }, format: "currency" },
    ],
    table: {
      key: "schedule",
      columns: [
        { key: "month", label: { en: "#", ar: "#" } },
        { key: "payment", label: { en: "Payment", ar: "القسط" } },
        { key: "interest", label: { en: "Interest", ar: "الفائدة" } },
        { key: "principal", label: { en: "Principal", ar: "أصل الدين" } },
        { key: "balance", label: { en: "Balance", ar: "الرصيد" } },
      ],
    },
  },
  {
    slug: "simple-interest",
    category: "financial",
    icon: "💵",
    title: { en: "Simple Interest", ar: "الفائدة البسيطة" },
    short: { en: "Interest that never compounds.", ar: "فائدة لا تتراكم مركّبة." },
    description: {
      en: "Compute simple interest and the final amount using I = P·r·t.",
      ar: "احسب الفائدة البسيطة والمبلغ النهائي باستخدام المعادلة: الفائدة = الأصل × المعدل × الزمن.",
    },
    fields: [
      money("principal", "Principal", "المبلغ الأصلي"),
      rate("annualRatePct", "Annual rate", "المعدل السنوي"),
      { name: "years", type: "number", min: 0.01, max: 100, step: 0.25, label: { en: "Time (years)", ar: "المدة (سنوات)" } },
    ],
    results: [
      { key: "interest", label: { en: "Interest earned", ar: "الفائدة المكتسبة" }, format: "currency", highlight: true },
      { key: "total", label: { en: "Final amount", ar: "المبلغ النهائي" }, format: "currency" },
    ],
  },
  {
    slug: "compound-interest",
    category: "financial",
    icon: "📈",
    title: { en: "Compound Interest", ar: "الفائدة المركبة" },
    short: { en: "Growth with compounding over time.", ar: "نمو المال مع التراكم عبر الزمن." },
    description: {
      en: "Project growth of a principal with compound interest at a chosen compounding frequency.",
      ar: "توقّع نمو المبلغ الأصلي بفائدة مركبة مع تكرار تراوم مختار.",
    },
    fields: [
      money("principal", "Principal", "المبلغ الأصلي"),
      rate("annualRatePct", "Annual rate", "المعدل السنوي"),
      { name: "years", type: "integer", min: 1, max: 100, label: { en: "Years", ar: "السنوات" } },
      {
        name: "compoundsPerYear",
        type: "select",
        label: { en: "Compounding frequency", ar: "دورية التراكم" },
        options: [
          { value: "1", label: { en: "Annually", ar: "سنويًا" } },
          { value: "2", label: { en: "Semi-annually", ar: "كل نصف سنة" } },
          { value: "4", label: { en: "Quarterly", ar: "ربع سنوي" } },
          { value: "12", label: { en: "Monthly", ar: "شهريًا" } },
          { value: "365", label: { en: "Daily", ar: "يوميًا" } },
        ],
      },
    ],
    results: [
      { key: "finalAmount", label: { en: "Final amount", ar: "المبلغ النهائي" }, format: "currency", highlight: true },
      { key: "interestEarned", label: { en: "Interest earned", ar: "الفائدة المكتسبة" }, format: "currency" },
    ],
  },
  {
    slug: "mortgage",
    category: "financial",
    icon: "🏠",
    title: { en: "Mortgage Payment", ar: "قسط الرهن العقاري" },
    short: { en: "Monthly payment for a home loan.", ar: "القسط الشهري لقرض منزل." },
    description: {
      en: "Estimate the monthly mortgage payment from home price, down payment, rate, and term.",
      ar: "قدّر القسط الشهري للرهن العقاري من سعر المنزل والدفعة الأولى والفائدة والمدة.",
    },
    fields: [
      money("homePrice", "Home price", "سعر المنزل"),
      money("downPayment", "Down payment", "الدفعة الأولى"),
      rate("annualRatePct", "Annual interest rate", "الفائدة السنوية"),
      { name: "years", type: "integer", min: 1, max: 50, label: { en: "Term (years)", ar: "المدة (سنوات)" } },
    ],
    results: [
      { key: "monthlyPayment", label: { en: "Monthly payment", ar: "القسط الشهري" }, format: "currency", highlight: true },
      { key: "loanAmount", label: { en: "Loan amount", ar: "مبلغ القرض" }, format: "currency" },
      { key: "totalInterest", label: { en: "Total interest", ar: "إجمالي الفوائد" }, format: "currency" },
      { key: "totalPaid", label: { en: "Total paid", ar: "إجمالي المدفوع" }, format: "currency" },
    ],
  },
  {
    slug: "auto-loan",
    category: "financial",
    icon: "🚗",
    title: { en: "Auto Loan Payment", ar: "قسط قرض السيارة" },
    short: { en: "Monthly payment for a car loan.", ar: "القسط الشهري لقرض سيارة." },
    description: {
      en: "Estimate the monthly payment for a vehicle loan after down payment.",
      ar: "قدّر القسط الشهري لقرض سيارة بعد خصم الدفعة الأولى.",
    },
    fields: [
      money("vehiclePrice", "Vehicle price", "سعر السيارة"),
      money("downPayment", "Down payment", "الدفعة الأولى"),
      rate("annualRatePct", "Annual interest rate", "الفائدة السنوية"),
      { name: "years", type: "number", min: 0.5, max: 12, step: 0.5, label: { en: "Term (years)", ar: "المدة (سنوات)" } },
    ],
    results: [
      { key: "monthlyPayment", label: { en: "Monthly payment", ar: "القسط الشهري" }, format: "currency", highlight: true },
      { key: "loanAmount", label: { en: "Loan amount", ar: "مبلغ القرض" }, format: "currency" },
      { key: "totalInterest", label: { en: "Total interest", ar: "إجمالي الفوائد" }, format: "currency" },
    ],
  },
  {
    slug: "vat",
    category: "financial",
    icon: "🧾",
    title: { en: "VAT / Sales Tax", ar: "ضريبة القيمة المضافة" },
    short: { en: "Add or extract VAT from a price.", ar: "أضف أو استخرج الضريبة من السعر." },
    description: {
      en: "Add VAT to a net price or extract the VAT portion from a gross price.",
      ar: "أضف الضريبة إلى سعر صافٍ أو استخرج نسبتها من سعر إجمالي.",
    },
    fields: [
      money("amount", "Amount", "المبلغ"),
      rate("vatPct", "VAT rate", "نسبة الضريبة"),
      {
        name: "mode",
        type: "select",
        label: { en: "Mode", ar: "الوضع" },
        options: [
          { value: "add", label: { en: "Amount is net (add VAT)", ar: "المبلغ صافٍ (أضف الضريبة)" } },
          { value: "extract", label: { en: "Amount is gross (extract VAT)", ar: "المبلغ إجمالي (استخرج الضريبة)" } },
        ],
      },
    ],
    results: [
      { key: "net", label: { en: "Net", ar: "الصافي" }, format: "currency" },
      { key: "vat", label: { en: "VAT", ar: "الضريبة" }, format: "currency", highlight: true },
      { key: "gross", label: { en: "Gross", ar: "الإجمالي" }, format: "currency" },
    ],
  },
  {
    slug: "discount",
    category: "financial",
    icon: "🏷️",
    title: { en: "Discount Calculator", ar: "حاسبة الخصم" },
    short: { en: "Final price after a percentage off.", ar: "السعر النهائي بعد نسبة الخصم." },
    description: {
      en: "Compute the sale price and savings after applying a percentage discount.",
      ar: "احسب سعر البيع والمبلغ الموفر بعد تطبيق خصم بنسبة مئوية.",
    },
    fields: [
      money("originalPrice", "Original price", "السعر الأصلي"),
      rate("discountPct", "Discount", "نسبة الخصم"),
    ],
    results: [
      { key: "finalPrice", label: { en: "Final price", ar: "السعر النهائي" }, format: "currency", highlight: true },
      { key: "youSave", label: { en: "You save", ar: "توفّر" }, format: "currency" },
    ],
  },
  {
    slug: "tip",
    category: "financial",
    icon: "🍽️",
    title: { en: "Tip Calculator", ar: "حاسبة البقشيش" },
    short: { en: "Split the bill with tip.", ar: "قسّم الفاتورة مع البقشيش." },
    description: {
      en: "Compute the tip, grand total, and per-person share when splitting a bill.",
      ar: "احسب البقشيش والإجمالي وحصة كل شخص عند تقسيم الفاتورة.",
    },
    fields: [
      money("billAmount", "Bill amount", "قيمة الفاتورة"),
      { ...rate("tipPct", "Tip", "نسبة البقشيش"), optional: false },
      { name: "people", type: "integer", min: 1, max: 200, label: { en: "People", ar: "عدد الأشخاص" } },
    ],
    results: [
      { key: "perPerson", label: { en: "Per person", ar: "لكل شخص" }, format: "currency", highlight: true },
      { key: "tipAmount", label: { en: "Tip", ar: "البقشيش" }, format: "currency" },
      { key: "total", label: { en: "Total", ar: "الإجمالي" }, format: "currency" },
    ],
  },
  {
    slug: "roi",
    category: "financial",
    icon: "💹",
    title: { en: "ROI / CAGR", ar: "العائد على الاستثمار" },
    short: { en: "Return on investment and annualized growth.", ar: "العائد على الاستثمار ومعدل النمو السنوي." },
    description: {
      en: "Compute return on investment and, optionally, the compound annual growth rate.",
      ar: "احسب العائد على الاستثمار واختياريًا معدل النمو السنوي المركب.",
    },
    fields: [
      money("initialInvestment", "Initial investment", "الاستثمار الأولي"),
      money("finalValue", "Final value", "القيمة النهائية"),
      { name: "years", type: "number", min: 0.01, max: 100, step: 0.25, optional: true, label: { en: "Years held (optional)", ar: "مدة الاحتفاظ بالسنوات (اختياري)" } },
    ],
    results: [
      { key: "roiPct", label: { en: "ROI", ar: "العائد" }, format: "percent", highlight: true },
      { key: "cagrPct", label: { en: "CAGR (annualized)", ar: "النمو السنوي المركب" }, format: "percent" },
      { key: "profit", label: { en: "Profit / loss", ar: "الربح أو الخسارة" }, format: "currency" },
    ],
  },
  {
    slug: "credit-card-payoff",
    category: "financial",
    icon: "💳",
    title: { en: "Credit Card Payoff", ar: "سداد بطاقة الائتمان" },
    short: { en: "How long until your card is paid off?", ar: "متى تسدد بطاقتك؟" },
    description: {
      en: "Months and total interest needed to pay off a credit card balance with fixed monthly payments.",
      ar: "عدد الشهور وإجمالي الفوائد اللازمة لسداد رصيد بطاقة ائتمان بدفعات شهرية ثابتة.",
    },
    fields: [
      money("balance", "Card balance", "رصيد البطاقة"),
      { name: "aprPct", type: "number", min: 0, max: 100, label: { en: "APR", ar: "الفائدة السنوية" }, suffix: { en: "%", ar: "٪" } },
      money("monthlyPayment", "Monthly payment", "الدفعة الشهرية"),
    ],
    results: [
      { key: "monthsToPayoff", label: { en: "Months to payoff", ar: "شهور حتى السداد" }, format: "number", highlight: true },
      { key: "totalInterest", label: { en: "Total interest paid", ar: "إجمالي الفوائد المدفوعة" }, format: "currency" },
      { key: "totalPaid", label: { en: "Total paid", ar: "إجمالي المدفوع" }, format: "currency" },
    ],
  },
  {
    slug: "inflation",
    category: "financial",
    icon: "🎈",
    title: { en: "Inflation Impact", ar: "أثر التضخم" },
    short: { en: "What will today's money be worth?", ar: "كم ستسوى أموالك اليوم مستقبلاً؟" },
    description: {
      en: "See how inflation erodes purchasing power: the future cost of today's amount at an average annual rate.",
      ar: "شاهد كيف يقلّل التضخم القوة الشرائية: التكلفة المستقبلية لمبلغ اليوم بمعدل سنوي متوسط.",
    },
    fields: [
      money("amount", "Amount today", "المبلغ اليوم"),
      rate("inflationPct", "Average annual inflation", "متوسط التضخم السنوي"),
      { name: "years", type: "integer", min: 1, max: 100, label: { en: "Years", ar: "السنوات" } },
    ],
    results: [
      { key: "futureCost", label: { en: "Future cost", ar: "التكلفة المستقبلية" }, format: "currency", highlight: true },
      { key: "purchasingPower", label: { en: "Today's buying power then", ar: "قوة شراء المبلغ الحالية آنذاك" }, format: "currency" },
    ],
  },
  {
    slug: "salary-to-hourly",
    category: "financial",
    icon: "💼",
    title: { en: "Salary to Hourly", ar: "الراتب إلى أجر بالساعة" },
    short: { en: "Convert annual salary to hourly wage.", ar: "حوّل الراتب السنوي إلى أجر بالساعة." },
    description: {
      en: "Convert an annual salary into hourly, weekly, and monthly equivalents based on hours per week and weeks worked per year.",
      ar: "حوّل الراتب السنوي إلى ما يعادله بالساعة والأسبوع والشهرياً حسب ساعات العمل أسبوعياً وأسابيع العمل سنوياً.",
    },
    fields: [
      money("annualSalary", "Annual salary", "الراتب السنوي", 1),
      { name: "hoursPerWeek", type: "number", min: 1, max: 168, label: { en: "Hours per week", ar: "ساعات أسبوعياً" } },
      { name: "weeksPerYear", type: "number", min: 1, max: 52, optional: true, label: { en: "Weeks per year (default 52)", ar: "أسابيع السنة (افتراضي 52)" } },
    ],
    results: [
      { key: "hourlyRate", label: { en: "Hourly rate", ar: "الأجر بالساعة" }, format: "currency", highlight: true },
      { key: "weeklyPay", label: { en: "Weekly pay", ar: "الأجر الأسبوعي" }, format: "currency" },
      { key: "monthlyPay", label: { en: "Monthly pay", ar: "الأجر الشهري" }, format: "currency" },
    ],
  },
];

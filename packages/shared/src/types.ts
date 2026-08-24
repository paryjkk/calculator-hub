/** A string localized in the two supported UI languages. */
export interface Localized {
  en: string;
  ar: string;
}

export const LOCALES = ["en", "ar"] as const;
export type Locale = (typeof LOCALES)[number];

export type FieldType = "number" | "integer" | "date" | "select" | "text";

export interface SelectOption {
  value: string;
  label: Localized;
}

export interface FieldDef {
  name: string;
  type: FieldType;
  label: Localized;
  /** Skip validation when empty (dates may still carry serverDefault). */
  optional?: boolean;
  min?: number;
  max?: number;
  step?: number;
  /** Unit hint shown under the input. */
  suffix?: Localized;
  placeholder?: string;
  options?: SelectOption[];
  /** Filled by the API when omitted (e.g. "today"). */
  serverDefault?: "today";
}

export type ResultFormat = "number" | "currency" | "percent" | "raw" | "date";

export interface ResultFieldDef {
  /** Key inside the engine result object. */
  key: string;
  label: Localized;
  format?: ResultFormat;
  highlight?: boolean;
}

export interface TableColumnDef {
  key: string;
  label: Localized;
}

export interface TableDef {
  /** Key inside the engine result object holding an array of row objects. */
  key: string;
  columns: TableColumnDef[];
}

export type CategoryId =
  | "financial"
  | "health"
  | "math"
  | "conversion"
  | "datetime"
  | "utilities";

export interface CategoryDef {
  id: CategoryId;
  icon: string;
  name: Localized;
}

export const CATEGORIES: CategoryDef[] = [
  { id: "financial", icon: "💰", name: { en: "Financial", ar: "مالية" } },
  { id: "health", icon: "🏥", name: { en: "Health & Fitness", ar: "الصحة واللياقة" } },
  { id: "math", icon: "🔢", name: { en: "Math", ar: "رياضيات" } },
  { id: "conversion", icon: "📐", name: { en: "Unit Conversion", ar: "تحويل الوحدات" } },
  { id: "datetime", icon: "📅", name: { en: "Date & Time", ar: "التاريخ والوقت" } },
  { id: "utilities", icon: "🛠️", name: { en: "Everyday Utilities", ar: "أدوات يومية" } },
];

export interface CalculatorDef {
  slug: string;
  category: CategoryId;
  icon: string;
  title: Localized;
  short: Localized;
  description: Localized;
  fields: FieldDef[];
  results: ResultFieldDef[];
  /** Optional data table rendered under the stat grid. */
  table?: TableDef;
  /** Optional footnote rendered under the results. */
  note?: Localized;
}

/** Stable machine-readable validation error codes (translated client-side). */
export type FieldErrorCode =
  | "required"
  | "invalid_number"
  | "invalid_int"
  | "invalid_date"
  | "out_of_min"
  | "out_of_max"
  | "invalid_option";

export interface ValidationResult {
  ok: boolean;
  values?: Record<string, number | string>;
  errors?: Partial<Record<string, FieldErrorCode>>;
}

import type {
  CalculatorDef,
  FieldDef,
  ValidationResult,
  FieldErrorCode,
} from "./types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export type RawValues = Record<string, unknown>;

function isValidIsoDate(value: string): boolean {
  if (!ISO_DATE.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

function checkField(
  field: FieldDef,
  raw: unknown
): { value?: number | string; error?: FieldErrorCode } {
  const empty =
    raw === undefined || raw === null || raw === "" || raw === undefined;

  if (empty) {
    if (field.optional) return {};
    return { error: "required" };
  }

  switch (field.type) {
    case "number":
    case "integer": {
      const n = typeof raw === "number" ? raw : Number(raw);
      if (!Number.isFinite(n)) return { error: "invalid_number" };
      if (field.type === "integer" && !Number.isInteger(n))
        return { error: "invalid_int" };
      if (field.min !== undefined && n < field.min)
        return { error: "out_of_min" };
      if (field.max !== undefined && n > field.max)
        return { error: "out_of_max" };
      return { value: n };
    }
    case "date": {
      const s = String(raw);
      if (!isValidIsoDate(s)) return { error: "invalid_date" };
      return { value: s };
    }
    case "select": {
      const s = String(raw);
      if (!field.options?.some((o) => o.value === s))
        return { error: "invalid_option" };
      return { value: s };
    }
    case "text": {
      const s = String(raw).trim();
      if (s.length === 0) return { error: field.optional ? "required" : "required" };
      return { value: s };
    }
  }
}

/** Pure, isomorphic validation of raw form values against a calculator definition. */
export function validateInput(
  def: CalculatorDef,
  raw: RawValues
): ValidationResult {
  const errors: Partial<Record<string, FieldErrorCode>> = {};
  const values: Record<string, number | string> = {};

  for (const field of def.fields) {
    const res = checkField(field, raw[field.name]);
    if (res.error) errors[field.name] = res.error;
    else if (res.value !== undefined) values[field.name] = res.value;
  }

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return { ok: true, values };
}

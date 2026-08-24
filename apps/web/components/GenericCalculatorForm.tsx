"use client";

import { useState } from "react";
import type {
  CalculatorDef,
  FieldDef,
  FieldErrorCode,
  Locale,
  Localized,
} from "@calc/shared";
import { validateInput } from "@calc/shared";
import { API_BASE } from "@/lib/api";
import { getDictionary, interpolate } from "@/lib/i18n";

type Values = Record<string, string>;

export default function GenericCalculatorForm({
  def,
  locale,
}: {
  def: CalculatorDef;
  locale: Locale;
}) {
  const t = (s: Localized) => (locale === "ar" ? s.ar : s.en);
  const dict = getDictionary(locale);
  const [values, setValues] = useState<Values>(() => defaultsOf(def));
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<string, FieldErrorCode>>
  >({});
  const [pending, setPending] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [result, setResult] = useState<Record<string, unknown> | null>(null);

  function set(name: string, value: string) {
    setValues((prev) => ({ ...prev, [name]: value }));
    setResult(null);
    setErrorText(null);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validation = validateInput(def, values);
    if (!validation.ok || !validation.values) {
      setFieldErrors(validation.errors ?? {});
      setResult(null);
      return;
    }
    setFieldErrors({});
    setPending(true);
    setErrorText(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/v1/calculators/${def.slug}/compute`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(validation.values),
        }
      );
      const payload = (await res.json().catch(() => null)) as unknown;
      if (!res.ok) {
        setResult(null);
        setErrorText(extractError(payload, dict));
        return;
      }
      setResult((payload ?? {}) as Record<string, unknown>);
    } catch {
      setErrorText(dict.errorGeneric);
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        {def.fields.map((field) => (
          <FieldInput
            key={field.name}
            field={field}
            value={values[field.name] ?? ""}
            error={fieldErrors[field.name]}
            onChange={(v) => set(field.name, v)}
            dict={dict}
            t={t}
          />
        ))}
      </div>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-60 sm:w-auto"
      >
        {pending ? dict.calculating : dict.calculate}
      </button>

      {errorText && (
        <div
          role="alert"
          className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700"
        >
          {errorText}
        </div>
      )}

      {result && (
        <>
          <dl
            aria-live="polite"
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          >
            {def.results.map((r) => (
              <div
                key={r.key}
                className={`rounded-xl border p-4 ${
                  r.highlight
                    ? "border-teal-200 bg-teal-50 ring-1 ring-teal-100"
                    : "border-slate-200 bg-white"
                }`}
              >
                <dt className="text-xs text-slate-500">{t(r.label)}</dt>
                <dd
                  className={`mt-1 text-xl font-extrabold ${
                    r.highlight ? "text-teal-800" : "text-slate-800"
                  }`}
                >
                  {formatValue(result[r.key], r.format, dict)}
                </dd>
              </div>
            ))}
          </dl>

          {def.table && Array.isArray(result[def.table.key]) && (
            <TableBlock rows={result[def.table.key] as Record<string, unknown>[]} def={def} t={t} />
          )}

          {def.note && (
            <p className="rounded-lg bg-slate-100 px-4 py-2.5 text-sm text-slate-600">
              {t(def.note)}
            </p>
          )}
        </>
      )}
    </form>
  );
}

function TableBlock({
  rows,
  def,
  t,
}: {
  rows: Record<string, unknown>[];
  def: CalculatorDef;
  t: (s: Localized) => string;
}) {
  if (rows.length === 0 || !def.table) return null;
  const columns = def.table.columns;
  const capped = rows.length > 400 ? rows.slice(0, 400) : rows;

  return (
    <div className="max-h-96 overflow-auto rounded-xl border border-slate-200">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-slate-100 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            {columns.map((c) => (
              <th key={c.key} scope="col" className="px-3 py-2 text-start font-bold">
                {t(c.label)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {capped.map((row, i) => (
            <tr key={i} className={i % 2 ? "bg-slate-50" : "bg-white"}>
              {columns.map((c) => (
                <td key={c.key} className="px-3 py-1.5 tabular-nums text-slate-700">
                  {typeof row[c.key] === "number"
                    ? (row[c.key] as number).toLocaleString("en-US")
                    : String(row[c.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function FieldInput({
  field,
  value,
  error,
  onChange,
  dict,
  t,
}: {
  field: FieldDef;
  value: string;
  error?: FieldErrorCode;
  onChange: (v: string) => void;
  dict: ReturnType<typeof getDictionary>;
  t: (s: Localized) => string;
}) {
  const id = `f-${field.name}`;
  const inputClass =
    "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200";

  let control: React.ReactNode;
  if (field.type === "select") {
    control = (
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        {value === "" && <option value="">—</option>}
        {(field.options ?? []).map((o) => (
          <option key={o.value} value={o.value}>
            {t(o.label)}
          </option>
        ))}
      </select>
    );
  } else {
    const inputType =
      field.type === "date"
        ? "date"
        : field.type === "number" || field.type === "integer"
          ? "number"
          : "text";
    control = (
      <input
        id={id}
        type={inputType}
        step={
          field.type === "number"
            ? (field.step ?? "any")
            : field.type === "integer"
              ? "1"
              : undefined
        }
        min={field.min}
        max={field.max}
        placeholder={field.placeholder}
        dir={field.type === "text" ? "auto" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      />
    );
  }

  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold text-slate-700">
        {t(field.label)}
        {field.optional && (
          <span className="ms-1 text-xs font-normal text-slate-400">
            ({dict.optionalSuffix})
          </span>
        )}
      </label>
      {control}
      {field.suffix && (
        <span className="mt-0.5 block text-xs text-slate-400">{t(field.suffix)}</span>
      )}
      {error && (
        <p className="mt-1 text-xs font-medium text-red-600">
          {dict.fieldErrors[error] ?? error}
        </p>
      )}
    </div>
  );
}

function defaultsOf(def: CalculatorDef): Values {
  const v: Values = {};
  for (const f of def.fields) {
    if (f.type === "select") {
      v[f.name] = f.optional ? "" : (f.options?.[0]?.value ?? "");
    } else {
      v[f.name] = "";
    }
  }
  return v;
}

function extractError(payload: unknown, dict: ReturnType<typeof getDictionary>): string {
  const obj = payload as { message?: unknown } | null;
  if (typeof obj?.message === "string") {
    return dict.errors[obj.message] ?? obj.message;
  }
  if (Array.isArray(obj?.message)) {
    return (obj.message as unknown[]).map(String).join("، ");
  }
  return dict.errorGeneric;
}

export function formatValue(
  value: unknown,
  format: string | undefined,
  dict: ReturnType<typeof getDictionary>
): string {
  if (value === null || value === undefined) return dict.resultMissing;

  if (typeof value === "boolean") return value ? dict.yes : dict.no;

  if (typeof value === "object") {
    const o = value as Record<string, number>;
    if ("years" in o && "months" in o && "days" in o)
      return interpolate(dict.ymd, { y: o.years, m: o.months, d: o.days });
    if ("weeks" in o && "days" in o)
      return interpolate(dict.weeksDays, { w: o.weeks, d: o.days });
    if ("hours" in o && "minutes" in o)
      return interpolate(dict.hoursMinutes, {
        h: o.hours,
        mm: String(o.minutes).padStart(2, "0"),
      });
    return JSON.stringify(value);
  }

  if (typeof value === "string") return dict.errors[value] ?? value;

  switch (format) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(value as number);
    case "percent":
      return `${(value as number).toLocaleString("en-US")}٪`;
    case "date":
    case "raw":
      return String(value);
    default: {
      const n = value as number;
      return Number.isInteger(n)
        ? n.toLocaleString("en-US")
        : n.toLocaleString("en-US", { maximumFractionDigits: 6 });
    }
  }
}

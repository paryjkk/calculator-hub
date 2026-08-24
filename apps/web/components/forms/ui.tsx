"use client";

import type { ReactNode } from "react";
import type { FieldError } from "react-hook-form";

export function NumberInput({
  label,
  registration,
  error,
  step,
  suffix,
  placeholder,
}: {
  label: string;
  registration: Record<string, unknown>;
  error?: FieldError;
  step?: number;
  suffix?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={registration.name as string} className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={registration.name as string}
        type="number"
        step={step}
        placeholder={placeholder}
        aria-invalid={!!error}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-slate-100"
        {...registration}
      />
      {suffix && <span className="mt-0.5 block text-xs text-slate-400">{suffix}</span>}
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error.message}</p>}
    </div>
  );
}

export function TextInput({
  label,
  registration,
  error,
  type = "text",
}: {
  label: string;
  registration: Record<string, unknown>;
  error?: FieldError;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={registration.name as string} className="mb-1 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      <input
        id={registration.name as string}
        type={type}
        aria-invalid={!!error}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 disabled:bg-slate-100"
        {...registration}
      />
      {error && <p className="mt-1 text-xs font-medium text-red-600">{error.message}</p>}
    </div>
  );
}

export function SubmitButton({ pending, children }: { pending: boolean; children?: ReactNode }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600 disabled:opacity-60 sm:w-auto"
    >
      {pending ? "Calculating…" : (children ?? "Calculate")}
    </button>
  );
}

export function ErrorAlert({ message }: { message: string }) {
  return (
    <div role="alert" className="rounded-lg bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}

export function ResultGrid({ children }: { children: ReactNode }) {
  return (
    <dl
      aria-live="polite"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {children}
    </dl>
  );
}

export function Stat({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${
        highlight
          ? "border-teal-200 bg-teal-50 ring-1 ring-teal-100"
          : "border-slate-200 bg-white"
      }`}
    >
      <dt className="text-xs text-slate-500">{label}</dt>
      <dd className={`mt-1 text-xl font-extrabold ${highlight ? "text-teal-800" : "text-slate-800"}`}>
        {value}
      </dd>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export const metadata: Metadata = {
  title: "All Calculators",
  description:
    "Browse all free calculators: loan payment, loan amortization, age, and retirement projection.",
  alternates: { canonical: "/calculators" },
};

export default function CalculatorsIndexPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
        All Calculators
      </h1>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {CALCULATORS.map((calc) => (
          <li key={calc.slug}>
            <Link
              href={`/calculators/${calc.slug}`}
              className="flex h-full flex-col gap-1 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
            >
              <span aria-hidden>{calc.icon}</span>
              <span className="font-bold text-slate-800">{calc.title}</span>
              <span className="text-sm text-slate-500">{calc.short}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

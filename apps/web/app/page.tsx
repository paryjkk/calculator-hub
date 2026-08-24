import type { Metadata } from "next";
import Link from "next/link";
import { CALCULATORS } from "@/lib/calculators";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Free Online Calculators
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Fast, accurate calculators for loans, amortization, age, and
          retirement. Everything runs on a dedicated calculation API — no
          sign-up, no clutter.
        </p>
      </section>

      <section aria-label="Calculators" className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CALCULATORS.map((calc) => (
          <Link
            key={calc.slug}
            href={`/calculators/${calc.slug}`}
            className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
          >
            <span aria-hidden className="text-3xl">
              {calc.icon}
            </span>
            <h2 className="font-bold text-slate-800 group-hover:text-teal-700">{calc.title}</h2>
            <p className="text-xs leading-5 text-slate-500">{calc.short}</p>
          </Link>
        ))}
      </section>

      <section className="mt-12 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-bold text-slate-800">Why Calculator Hub?</h2>
        <ul className="mt-3 grid list-inside list-disc gap-1.5 text-sm leading-6 text-slate-500 sm:grid-cols-2">
          <li>Formulas documented, tested, and independently derived</li>
          <li>Server-side calculation API — consistent results everywhere</li>
          <li>Responsive and accessible (WCAG 2.2 AA target)</li>
          <li>Free, with no registration required</li>
        </ul>
      </section>
    </div>
  );
}

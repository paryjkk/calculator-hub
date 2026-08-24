import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, defsByCategory } from "@calc/shared";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: {
      canonical: `/${locale}`,
      languages: { en: "/en", ar: "/ar" },
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const dict = getDictionary(locale as Locale);
  const t = (l: { en: string; ar: string }) => (locale === "ar" ? l.ar : l.en);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
      <section className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {dict.homeTitle}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          {dict.homeSubtitle}
        </p>
      </section>

      {CATEGORIES.map((category) => {
        const calcs = defsByCategory(category.id);
        if (calcs.length === 0) return null;
        return (
          <section
            key={category.id}
            aria-labelledby={`cat-${category.id}`}
            className="mt-12"
          >
            <h2
              id={`cat-${category.id}`}
              className="flex items-center gap-2 text-xl font-extrabold text-slate-800"
            >
              <span aria-hidden>{category.icon}</span>
              {t(category.name)}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {calcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/${locale}/calculators/${calc.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-600"
                >
                  <span aria-hidden className="text-3xl">
                    {calc.icon}
                  </span>
                  <h3 className="font-bold text-slate-800 group-hover:text-teal-700">
                    {t(calc.title)}
                  </h3>
                  <p className="text-xs leading-5 text-slate-500">{t(calc.short)}</p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="mt-14 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-100">
        <h2 className="text-lg font-bold text-slate-800">{dict.whyTitle}</h2>
        <ul className="mt-3 grid list-inside list-disc gap-1.5 text-sm leading-6 text-slate-500 sm:grid-cols-2">
          <li>{dict.why1}</li>
          <li>{dict.why2}</li>
          <li>{dict.why3}</li>
          <li>{dict.why4}</li>
        </ul>
      </section>
    </div>
  );
}

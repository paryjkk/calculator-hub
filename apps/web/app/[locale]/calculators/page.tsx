import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES, defsByCategory } from "@calc/shared";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "كل الحاسبات" : "All Calculators",
    description: isAr
      ? "استعرض جميع الحاسبات المتوفرة مصنّفة حسب التصنيف."
      : "Browse every available calculator, grouped by category.",
    alternates: {
      canonical: `/${locale}/calculators`,
      languages: { en: "/en/calculators", ar: "/ar/calculators" },
    },
  };
}

export default async function CalculatorsPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const dict = getDictionary(locale as Locale);
  const t = (l: { en: string; ar: string }) => (locale === "ar" ? l.ar : l.en);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP}
        className="mb-6 h-[90px] w-full md:h-[100px]"
      />
      <h1 className="text-2xl font-extrabold text-slate-900 sm:text-3xl">
        {dict.allCalculatorsTitle}
      </h1>
      <p className="mt-1 text-slate-500">{dict.allCalculatorsSubtitle}</p>

      {CATEGORIES.map((category) => {
        const calcs = defsByCategory(category.id);
        if (calcs.length === 0) return null;
        return (
          <section key={category.id} className="mt-8">
            <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-800">
              <span aria-hidden>{category.icon}</span>
              {t(category.name)}
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((calc) => (
                <li key={calc.slug}>
                  <Link
                    href={`/${locale}/calculators/${calc.slug}`}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                  >
                    <span aria-hidden>{calc.icon}</span>
                    {t(calc.title)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

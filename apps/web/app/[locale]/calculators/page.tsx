import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import { CATEGORIES, defsByCategory } from "@calc/shared";
import type { Locale } from "@calc/shared";
import { CategoryIcon } from "@/components/icons";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    title: isAr ? "كل الحاسبات" : "All calculators",
    description: isAr
      ? "جميع الحاسبات مصنّفة حسب التصنيف."
      : "Every calculator, grouped by category.",
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
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {dict.allCalculatorsTitle}
      </h1>
      <p className="mt-2 text-base" style={{ color: "var(--ink-soft)" }}>
        {dict.allCalculatorsSubtitle}
      </p>

      {CATEGORIES.map((category) => {
        const calcs = defsByCategory(category.id);
        if (calcs.length === 0) return null;
        return (
          <section key={category.id} className="mt-10">
            <h2 className="flex items-center gap-2.5 text-base font-bold">
              <CategoryIcon category={category.id} className="h-[18px] w-[18px]" />
              {t(category.name)}
            </h2>
            <div
              className="mt-3 grid gap-px overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3"
              style={{ background: "var(--line)", boxShadow: "inset 0 0 0 1px var(--line)" }}
            >
              {calcs.map((calc) => (
                <Link
                  key={calc.slug}
                  href={`/${locale}/calculators/${calc.slug}`}
                  className="group flex items-center gap-2.5 px-4 py-3.5 text-sm font-medium transition hover:bg-black/[.03]"
                  style={{ background: "var(--surface)" }}
                >
                  <span
                    aria-hidden
                    className="h-1.5 w-1.5 rounded-full transition group-hover:accent-text"
                    style={{ background: "var(--line)" }}
                  />
                  {t(calc.title)}
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM}
        className="mt-10 hidden h-[250px] w-full lg:block"
      />
    </div>
  );
}

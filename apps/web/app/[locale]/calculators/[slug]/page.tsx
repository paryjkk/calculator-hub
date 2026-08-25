import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import GenericCalculatorForm from "@/components/GenericCalculatorForm";
import { CALCULATOR_DEFS, getDef } from "@calc/shared";
import type { Locale, Localized } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export function generateStaticParams() {
  return CALCULATOR_DEFS.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

function tOf(locale: string) {
  return (l: Localized) => (locale === "ar" ? l.ar : l.en);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const calc = getDef(slug);
  if (!calc) return {};
  const title = locale === "ar" ? calc.title.ar : calc.title.en;
  const description = locale === "ar" ? calc.description.ar : calc.description.en;
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/calculators/${calc.slug}`,
      languages: {
        en: `/en/calculators/${calc.slug}`,
        ar: `/ar/calculators/${calc.slug}`,
      },
    },
    openGraph: { title, description, type: "website" },
  };
}

export default async function CalculatorPage({ params }: PageProps) {
  const { locale, slug } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const def = getDef(slug);
  if (!def) notFound();

  const dict = getDictionary(locale as Locale);
  const t = tOf(locale);
  const related = CALCULATOR_DEFS.filter(
    (c) => c.category === def.category && c.slug !== def.slug
  ).slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP}
        className="mb-8 h-[90px] w-full md:h-[100px]"
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs" style={{ color: "var(--ink-faint)" }}>
            <Link href={`/${locale}`} className="hover:accent-text">
              {dict.brand}
            </Link>
            <span className="mx-1.5">/</span>
            <Link href={`/${locale}/calculators`} className="hover:accent-text">
              {dict.navAll}
            </Link>
          </nav>

          <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            {t(def.title)}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7" style={{ color: "var(--ink-soft)" }}>
            {t(def.description)}
          </p>

          <section
            aria-label={t(def.title)}
            className="mt-8 rounded-2xl p-5 sm:p-7"
            style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)" }}
          >
            <GenericCalculatorForm def={def} locale={locale as Locale} />
          </section>

          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM}
            className="mt-10 hidden h-[250px] w-full lg:block"
          />
        </div>

        <aside className="mt-12 lg:mt-0">
          <h2
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: "var(--ink-faint)" }}
          >
            {dict.relatedTitle}
          </h2>
          <ul className="mt-4 space-y-px overflow-hidden rounded-xl" style={{ boxShadow: "inset 0 0 0 1px var(--line)", background: "var(--line)" }}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${locale}/calculators/${r.slug}`}
                  className="block px-4 py-3 text-sm font-medium transition hover:bg-black/[.03]"
                  style={{ background: "var(--surface)" }}
                >
                  {t(r.title)}
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}

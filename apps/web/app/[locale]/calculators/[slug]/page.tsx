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
  ).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP}
        className="mb-6 h-[90px] w-full md:h-[100px]"
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
        <div>
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <Link href={`/${locale}`} className="hover:text-teal-600">
              {dict.brand}
            </Link>
            {" / "}
            <Link href={`/${locale}/calculators`} className="hover:text-teal-600">
              {dict.navAll}
            </Link>
          </nav>

          <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            <span aria-hidden>{def.icon}</span>
            {t(def.title)}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {t(def.description)}
          </p>

          <section
            aria-label={t(def.title)}
            className="mt-6 rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-100 sm:p-6"
          >
            <GenericCalculatorForm def={def} locale={locale as Locale} />
          </section>

          <AdSlot
            slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_BOTTOM}
            className="mt-8 hidden h-[250px] w-full lg:block"
          />
        </div>

        <aside className="mt-10 lg:mt-0">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-400">
            {locale === "ar" ? "حاسبات ذات صلة" : "Related calculators"}
          </h2>
          <ul className="mt-3 space-y-2">
            {related.map((r) => (
              <li key={r.slug}>
                <Link
                  href={`/${locale}/calculators/${r.slug}`}
                  className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-teal-300 hover:text-teal-700"
                >
                  <span aria-hidden>{r.icon}</span>
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

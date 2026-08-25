import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, defsByCategory } from "@calc/shared";
import type { Locale } from "@calc/shared";
import { ArrowIcon, CategoryIcon, CheckIcon } from "@/components/icons";
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
  const isAr = locale === "ar";
  const total = CATEGORIES.reduce((n, c) => n + defsByCategory(c.id).length, 0);

  return (
    <div className="mx-auto max-w-6xl px-4">
      <section className="pt-16 sm:pt-24">
        <p
          className="text-xs font-semibold uppercase tracking-[0.18em]"
          style={{ color: "var(--accent)" }}
        >
          {dict.homeKicker.replace("54", String(total)).replace("٥٤", String(total))}
        </p>
        <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-6xl">
          {dict.homeTitle}
        </h1>
        <p
          className="mt-5 max-w-xl text-base leading-7 sm:text-lg"
          style={{ color: "var(--ink-soft)" }}
        >
          {dict.homeSubtitle}
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href={`/${locale}/calculators`}
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ background: "var(--accent)" }}
          >
            {dict.navAll}
            <ArrowIcon className={`h-4 w-4 ${isAr ? "rotate-180" : ""}`} />
          </Link>
          <span
            className="text-sm"
            style={{ color: "var(--ink-faint)" }}
            aria-hidden
          >
            {dict.tagline.split(".")[1]?.trim() ? dict.tagline : ""}
          </span>
        </div>
      </section>

      <div className="mt-14 border-t" style={{ borderColor: "var(--line)" }} />

      {CATEGORIES.map((category, ci) => {
        const calcs = defsByCategory(category.id);
        if (calcs.length === 0) return null;
        return (
          <section key={category.id} aria-labelledby={`cat-${category.id}`} className="mt-12">
            <div className="flex items-baseline justify-between gap-4">
              <h2 id={`cat-${category.id}`} className="flex items-center gap-2.5 text-lg font-bold">
                <CategoryIcon category={category.id} className="h-5 w-5" />
                {t(category.name)}
              </h2>
              <span className="index-numeral text-xs" style={{ color: "var(--ink-faint)" }}>
                {String(ci + 1).padStart(2, "0")}
              </span>
            </div>
            <ul className="mt-4 grid gap-x-8 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
              {calcs.map((calc, i) => (
                <li key={calc.slug}>
                  <Link
                    href={`/${locale}/calculators/${calc.slug}`}
                    className="group flex items-baseline gap-3 rounded-lg px-2 py-2.5 transition hover:bg-black/[.035]"
                  >
                    <span
                      className="index-numeral text-[11px] font-medium"
                      style={{ color: "var(--ink-faint)" }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[15px] font-medium group-hover:accent-text">
                      {t(calc.title)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      <section
        className="mb-4 mt-16 rounded-2xl p-7 sm:p-9"
        style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)" }}
      >
        <h2 className="text-xl font-bold tracking-tight">{dict.builtTitle}</h2>
        <ul className="mt-5 grid gap-4 sm:grid-cols-2">
          {[dict.built1, dict.built2, dict.built3, dict.built4].map((line) => (
            <li key={line} className="flex items-start gap-3 text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
              <CheckIcon className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

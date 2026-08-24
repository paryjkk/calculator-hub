import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import "../globals.css";
import type { Locale } from "@calc/shared";
import { LOCALES } from "@calc/shared";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import LangSwitch from "@/components/LangSwitch";
import QueryProvider from "@/components/QueryProvider";
import { getDictionary } from "@/lib/i18n";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isAr = locale === "ar";
  return {
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
    ),
    title: {
      default: isAr
        ? "آلة الحاسبة — حاسبات مجانية عبر الإنترنت"
        : "Calculator Hub — Free Online Calculators",
      template: "%s | Calculator Hub",
    },
    description: isAr
      ? "حاسبات مجانية وسريعة للقروض والتأمينات والصحة والرياضيات وتحويل الوحدات — بدون تسجيل."
      : "Free, fast online calculators for loans, health, math, and unit conversions. No sign-up required.",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!LOCALES.includes(locale as Locale)) notFound();
  const dict = getDictionary(locale as Locale);
  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir} className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased">
        <QueryProvider>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link
                href={`/${locale}`}
                className="text-lg font-extrabold text-teal-700"
              >
                🧮 {dict.brand}
              </Link>
              <nav aria-label="Main" className="flex items-center gap-1">
                <Link
                  href={`/${locale}/calculators`}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                >
                  {dict.navAll}
                </Link>
                <LangSwitch locale={locale} label={dict.navLangSwitch} />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-12 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Calculator Hub. {dict.footerDisclaimer}
            </div>
          </footer>
        </QueryProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IBM_Plex_Sans_Arabic, Space_Grotesk } from "next/font/google";
import "../globals.css";
import type { Locale } from "@calc/shared";
import { LOCALES } from "@calc/shared";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import AccountMenu from "@/components/AccountMenu";
import LangSwitch from "@/components/LangSwitch";
import Logo from "@/components/Logo";
import QueryProvider from "@/components/QueryProvider";
import { getDictionary } from "@/lib/i18n";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-latin",
  display: "swap",
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-arabic",
  display: "swap",
});

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
    <html
      lang={locale}
      dir={dir}
      className={`h-full ${grotesk.variable} ${plexArabic.variable}`}
    >
      <body
        className="flex min-h-full flex-col antialiased"
        style={{
          background: "var(--paper)",
          color: "var(--ink)",
          fontFamily:
            locale === "ar"
              ? "var(--font-arabic), var(--font-latin), system-ui, sans-serif"
              : "var(--font-latin), var(--font-arabic), system-ui, sans-serif",
        }}
      >
        <QueryProvider>
          <header
            className="sticky top-0 z-50 border-b backdrop-blur"
            style={{ borderColor: "var(--line)", background: "rgba(252,252,250,.92)" }}
          >
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href={`/${locale}`} className="flex items-center gap-2.5">
                <Logo className="h-7 w-7" />
                <span className="text-[17px] font-bold tracking-tight">
                  {dict.brand}
                </span>
              </Link>
              <nav aria-label="Main" className="flex items-center gap-1 text-sm">
                <Link
                  href={`/${locale}/about`}
                  className="rounded-lg px-3 py-2 font-medium transition hover:bg-black/[.04]"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {dict.navAbout}
                </Link>
                <Link
                  href={`/${locale}/calculators`}
                  className="rounded-lg px-3 py-2 font-medium transition hover:bg-black/[.04]"
                  style={{ color: "var(--ink-soft)" }}
                >
                  {dict.navAll}
                </Link>
                <LangSwitch locale={locale} label={dict.navLangSwitch} />
                <AccountMenu
                  locale={locale}
                  labels={{
                    account: dict.account,
                    login: dict.login,
                    register: dict.register,
                    admin: dict.adminPanel,
                    myAccount: dict.account,
                  }}
                />
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer
            className="mt-16 border-t"
            style={{ borderColor: "var(--line)", background: "var(--surface)" }}
          >
            <div className="mx-auto max-w-6xl px-4 py-10">
              <div className="grid gap-8 sm:grid-cols-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Logo className="h-6 w-6" />
                    <span className="text-sm font-bold">{dict.brand}</span>
                  </div>
                  <p
                    className="mt-3 max-w-xs text-xs leading-5"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {dict.footerBlurb}
                  </p>
                </div>
                <div className="text-sm">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {dict.footerExploreTitle}
                  </h2>
                  <ul className="mt-3 space-y-2">
                    <li>
                      <Link href={`/${locale}/calculators`} className="transition hover:opacity-70" style={{ color: "var(--ink-soft)" }}>
                        {dict.navAll}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/about`} className="transition hover:opacity-70" style={{ color: "var(--ink-soft)" }}>
                        {dict.navAbout}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/contact`} className="transition hover:opacity-70" style={{ color: "var(--ink-soft)" }}>
                        {dict.navContact}
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="text-sm">
                  <h2
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--ink-faint)" }}
                  >
                    {dict.footerLegalTitle}
                  </h2>
                  <ul className="mt-3 space-y-2">
                    <li>
                      <Link href={`/${locale}/privacy`} className="transition hover:opacity-70" style={{ color: "var(--ink-soft)" }}>
                        {dict.navPrivacy}
                      </Link>
                    </li>
                    <li>
                      <Link href={`/${locale}/terms`} className="transition hover:opacity-70" style={{ color: "var(--ink-soft)" }}>
                        {dict.navTerms}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <p
                className="mt-10 border-t pt-5 text-center text-xs"
                style={{ borderColor: "var(--line)", color: "var(--ink-faint)" }}
              >
                © {new Date().getFullYear()} {dict.brand} · {dict.footerDisclaimer}
              </p>
            </div>
          </footer>
        </QueryProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}

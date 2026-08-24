import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AnalyticsScripts from "@/components/AnalyticsScripts";
import QueryProvider from "@/components/QueryProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Calculator Hub — Free Online Calculators",
    template: "%s | Calculator Hub",
  },
  description:
    "Free, fast online calculators for loans, amortization, age, and retirement planning. No sign-up required.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900 antialiased">
        <QueryProvider>
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
              <Link href="/" className="text-lg font-extrabold text-teal-700">
                🧮 Calculator Hub
              </Link>
              <nav aria-label="Main">
                <Link
                  href="/calculators"
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-teal-700"
                >
                  All Calculators
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="mt-12 border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-6xl px-4 py-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Calculator Hub. Estimates are for
              informational purposes only and do not constitute financial advice.
            </div>
          </footer>
        </QueryProvider>
        <AnalyticsScripts />
      </body>
    </html>
  );
}

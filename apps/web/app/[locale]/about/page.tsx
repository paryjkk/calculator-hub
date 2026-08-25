import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Logo from "@/components/Logo";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "من نحن" : "About",
    alternates: { canonical: `/${locale}/about`, languages: { en: "/en/about", ar: "/ar/about" } },
  };
}

const CONTENT = {
  en: {
    h1: "A calculator site with its receipts attached",
    p1: "Calculator Hub started with a simple annoyance: calculator sites that bury the answer under ads, ask you to install an app, and never show you the formula. We wanted the opposite — a quiet page, an exact answer, and the math in plain sight.",
    p2: "Every formula here is written from published standards and locked behind unit tests. The mortgage payment is the standard amortization formula. BMI follows the WHO definition. Age math is calendar-aware, including leap years and the February 29 corner cases.",
    p3: "The whole thing runs as one small codebase: a TypeScript calculation engine, a thin API, and pages that render fast on any connection. Arabic isn't a translated afterthought — it's mirrored, typeset, and worded natively.",
    h2: "How we make money",
    p4: "There are a few unobtrusive ad slots. That's it. No paywalls, no accounts required to calculate, no selling of anything you type — calculations happen per-request and aren't stored against you unless you save them to your own account.",
  },
  ar: {
    h1: "موقع حاسبات يعرض مراجعه",
    p1: "بدأت «آلة الحاسبة» من إزعاج بسيط: مواقع تدفن الجواب تحت الإعلانات، وتطلب منك تثبيت تطبيق، ولا تريك المعادلة أبداً. أردنا العكس — صفحة هادئة، وجواب دقيق، ورياضيات مكشوفة للجميع.",
    p2: "كل معادلة هنا مكتوبة من مراجع منشورة ومحروسة باختبارات آلية. قسط الرهن هو صيغة الإطفاء القياسية، وكتلة الجسم تتبع تعريف منظمة الصحة العالمية، وحساب العمر واعٍ بالتقويم الفعلي بما فيه سنة الكبيسة وحالات 29 فبراير.",
    p3: "المشروع كله قاعدة كود واحدة صغيرة: محرك حسابات TypeScript، وواجهة برمجية رشيقة، وصفحات تُحمَّل سريعة على أي اتصال. العربية ليست ترجمة لاحقة — إنها معكوسة الاتجاه ومنسّقة ومصوغة عربياً منذ البداية.",
    h2: "كيف نكسب؟",
    p4: "توجد مساحات إعلانية قليلة غير مزعجة. هذا كل شيء. لا جدران دخول، ولا حساب مطلوب للحساب، ولا بيع لأي شيء تكتبه — العمليات تجري لحظياً ولا تُخزَّن باسمك إلا إذا حفظتها بنفسك في حسابك.",
  },
} as const;

export default async function AboutPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const dict = getDictionary(locale as Locale);
  const c = CONTENT[locale === "ar" ? "ar" : "en"];

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <Logo className="h-10 w-10" />
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{c.h1}</h1>
      <div className="mt-8 space-y-5 text-[15px] leading-7" style={{ color: "var(--ink-soft)" }}>
        <p>{c.p1}</p>
        <p>{c.p2}</p>
        <p>{c.p3}</p>
        <h2 className="pt-4 text-lg font-bold" style={{ color: "var(--ink)" }}>{c.h2}</h2>
        <p>{c.p4}</p>
      </div>
      <Link
        href={`/${locale}/calculators`}
        className="mt-10 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--accent)" }}
      >
        {dict.navAll}
      </Link>
    </article>
  );
}

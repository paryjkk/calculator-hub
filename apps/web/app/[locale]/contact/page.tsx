import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MailIcon } from "@/components/icons";
import type { Locale } from "@calc/shared";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "اتصل بنا" : "Contact",
    alternates: { canonical: `/${locale}/contact`, languages: { en: "/en/contact", ar: "/ar/contact" } },
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const isAr = locale === "ar";
  const email = "hello@calculator-hub.app";

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {isAr ? "قل لنا ما يهمك" : "Tell us what matters"}
      </h1>
      <p className="mt-4 text-[15px] leading-7" style={{ color: "var(--ink-soft)" }}>
        {isAr
          ? "حاسبة خاطئة؟ صيغة تريد رؤيتها؟ خطأ لغوي؟ نقرأ كل رسالة ونصلح الأخطاء بسرعة — الحساب الخاطئ أولوية قصوى."
          : "A wrong result? A formula you want added? A wording that reads off? We read everything and fix calculation bugs first."}
      </p>
      <a
        href={`mailto:${email}`}
        className="mt-8 inline-flex items-center gap-3 rounded-2xl px-5 py-4 text-sm font-semibold transition hover:opacity-90"
        style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)", color: "var(--ink)" }}
        dir="ltr"
      >
        <MailIcon className="h-5 w-5 accent-text" />
        {email}
      </a>
      <p className="mt-6 text-xs" style={{ color: "var(--ink-faint)" }}>
        {isAr
          ? "نجيب عادة خلال يومي عمل. إن كانت رسالتك عن حاسبة بعينها، أرسل المدخلات التي استخدمتها."
          : "We usually reply within two business days. If it's about a specific calculator, include the inputs you used."}
      </p>
    </div>
  );
}

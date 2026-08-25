import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@calc/shared";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "شروط الاستخدام" : "Terms",
    alternates: { canonical: `/${locale}/terms`, languages: { en: "/en/terms", ar: "/ar/terms" } },
  };
}

const T = {
  en: [
    ["Use at your own judgment", "Everything here is provided free, as-is. Results are estimates produced by documented formulas — they are not financial, medical, legal, or tax advice, and shouldn't replace a professional who knows your situation."],
    ["Fair use", "You may use the site and its public API respectfully: no hammering endpoints, no reselling the service as your own, no attempts to break it or other visitors' experience."],
    ["Accounts", "If you create an account you're responsible for keeping your credentials safe, and for the content of what you choose to save."],
    ["Liability", "To the maximum extent permitted by law, we are not liable for decisions made based on calculator output. Double-check anything consequential — that's good practice everywhere, including here."],
    ["The content", "Site text and design belong to Calculator Hub. Formulas are math; math belongs to everyone."],
  ],
  ar: [
    ["استخدم حكمك الخاص", "كل ما هنا يُقدَّم مجاناً كما هو. النتائج تقديرات وفق معادلات موثقة — وليست نصيحة مالية أو طبية أو قانونية أو ضريبية، ولا تغني عن مختص يعرف وضعك."],
    ["الاستخدام العادل", "استخدم الموقع وواجهته البرمجية العامة باحترام: لا إغراق للخوادم، ولا إعادة بيع للخدمة باسمك، ولا محاولات كسرها أو إفساد تجربة الزوار."],
    ["الحسابات", "إن أنشأت حساباً فأنت مسؤول عن الحفاظ على بيانات دخولك وعن ما تختار حفظه."],
    ["المسؤولية", "إلى أقصى حد يسمح به القانون، لسنا مسؤولين عن قرارات اتُّخذت بناءً على نتائج الحاسبات. تحقق مرتين من أي أمر مصيري — عادة حسنة في كل مكان، وهنا أيضاً."],
    ["المحتوى", "نصوص وتصميم الموقع ملك لـ«آلة الحاسبة». المعادلات رياضيات، والرياضيات ملك للجميع."],
  ],
} as const;

export default async function TermsPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const sections = T[locale === "ar" ? "ar" : "en"];

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {locale === "ar" ? "شروط الاستخدام" : "Terms of use"}
      </h1>
      <div className="mt-10 space-y-8">
        {sections.map(([h, body]) => (
          <section key={h}>
            <h2 className="text-base font-bold">{h}</h2>
            <p className="mt-2 text-[15px] leading-7" style={{ color: "var(--ink-soft)" }}>
              {body}
            </p>
          </section>
        ))}
      </div>
    </article>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { Locale } from "@calc/shared";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === "ar" ? "الخصوصية" : "Privacy",
    alternates: { canonical: `/${locale}/privacy`, languages: { en: "/en/privacy", ar: "/ar/privacy" } },
  };
}

const T = {
  en: [
    ["The short version", "We don't want your data. Calculations run per-request and are not stored with any identifier. If you create an account, we store only your email, a hashed password, and the calculations you explicitly save."],
    ["What we collect", "Standard, anonymized analytics about page visits. Calculation inputs are processed in memory and discarded after the response unless you press Save."],
    ["Cookies", "Only what's strictly functional: a session cookie when you sign in, and consent-gated analytics/ad cookies where applicable. No third-party tracking pixels beyond the analytics and ad slots disclosed on this page."],
    ["Your account", "You can delete saved calculations anytime, and ask us to delete your whole account by writing to us — gone within days, including backups at the next rotation."],
    ["Changes", "If this policy materially changes, we'll note it on this page before it takes effect."],
  ],
  ar: [
    ["الخلاصة السريعة", "لا نريد بياناتك. الحسابات تجري لحظياً ولا تُخزَّن بأي معرّف. إذا أنشأت حساباً نخزن فقط بريدك وكلمة مرور مشفّرة والحسابات التي تحفظها أنت صراحةً."],
    ["ما نجمعه", "تحليلات مجهولة الهوية القياسية عن زيارات الصفحات. مدخلات الحساب تُعالج في الذاكرة وتُهمَل بعد الرد إلا إذا ضغطت «حفظ»."],
    ["الكوكيز", "الضرورية فقط: كوكي جلسة عند تسجيل الدخول، وكوكيز تحليلات/إعلانات بموافقة حيث ينطبق. لا بكسلات تتبع خارجية غير المذكورة هنا."],
    ["حسابك", "يمكنك حذف أي حساب محفوظ في أي وقت، ومطالبته بحذف حسابك بالكامل بمراسلتنا — يُمحى خلال أيام بما فيه النسخ الاحتياطية في دورتها التالية."],
    ["التغييرات", "إذا تغيّرت هذه السياسة جوهرياً سنُعلن ذلك هنا قبل سريانها."],
  ],
} as const;

export default async function PrivacyPage({ params }: PageProps) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  const sections = T[locale === "ar" ? "ar" : "en"];

  return (
    <article className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
        {locale === "ar" ? "سياسة الخصوصية" : "Privacy policy"}
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

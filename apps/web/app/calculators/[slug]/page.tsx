import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import AdSlot from "@/components/AdSlot";
import AmortizationForm from "@/components/forms/AmortizationForm";
import AgeForm from "@/components/forms/AgeForm";
import LoanPaymentForm from "@/components/forms/LoanPaymentForm";
import RetirementForm from "@/components/forms/RetirementForm";
import { CALCULATORS, getCalculator } from "@/lib/calculators";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) return {};
  return {
    title: calc.title,
    description: calc.description,
    alternates: { canonical: `/calculators/${calc.slug}` },
    openGraph: {
      title: `${calc.title} | Calculator Hub`,
      description: calc.description,
      type: "website",
    },
  };
}

const FORMS: Record<string, React.ComponentType> = {
  "loan-payment": LoanPaymentForm,
  "loan-amortization": AmortizationForm,
  age: AgeForm,
  retirement: RetirementForm,
};

export default async function CalculatorPage({ params }: PageProps) {
  const { slug } = await params;
  const calc = getCalculator(slug);
  if (!calc) notFound();

  const Form = FORMS[slug];
  const others = CALCULATORS.filter((c) => c.slug !== slug);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Ad slot 1 of 2 — top banner */}
      <AdSlot
        slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP}
        className="mb-6 h-[90px] w-full md:h-[100px]"
      />

      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-6">
        <article className="min-w-0">
          <nav aria-label="Breadcrumb" className="text-xs text-slate-400">
            <Link href="/" className="hover:text-teal-700">Home</Link>
            <span aria-hidden> / </span>
            <Link href="/calculators" className="hover:text-teal-700">Calculators</Link>
          </nav>

          <h1 className="mt-2 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {calc.icon} {calc.title}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            {calc.description}
          </p>

          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="sr-only">{calc.title} form</h2>
            <Form />
          </section>
        </article>

        <aside className="mt-8 space-y-4 lg:mt-0">
          {/* Ad slot 2 of 2 — sidebar */}
          <AdSlot slotId={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} className="h-[250px] w-full lg:h-[600px]" />

          <section className="rounded-xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-slate-700">More calculators</h2>
            <ul className="mt-2 space-y-1">
              {others.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/calculators/${other.slug}`}
                    className="block rounded-lg px-2 py-1.5 text-sm text-slate-600 transition hover:bg-teal-50 hover:text-teal-700"
                  >
                    {other.icon} {other.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";
import AdminGuard from "../AdminGuard";
import CalculatorsClient from "./CalculatorsClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Calculators · Dashboard" };

export default async function AdminCalculatorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return (
    <AdminGuard locale={locale as Locale}>
      <CalculatorsClient locale={locale as Locale} />
    </AdminGuard>
  );
}

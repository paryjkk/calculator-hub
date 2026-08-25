import { notFound } from "next/navigation";
import AdminGuard from "./AdminGuard";
import OverviewClient from "./OverviewClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Dashboard" };

export default async function AdminOverviewPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return (
    <AdminGuard locale={locale as Locale}>
      <OverviewClient locale={locale as Locale} />
    </AdminGuard>
  );
}

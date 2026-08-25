import { notFound } from "next/navigation";
import AdminGuard from "../AdminGuard";
import SettingsClient from "./SettingsClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Settings · Dashboard" };

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return (
    <AdminGuard locale={locale as Locale}>
      <SettingsClient locale={locale as Locale} />
    </AdminGuard>
  );
}

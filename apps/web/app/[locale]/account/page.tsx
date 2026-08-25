import { notFound } from "next/navigation";
import AccountClient from "./AccountClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Account" };

export default async function AccountPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <AccountClient locale={locale as Locale} />;
}

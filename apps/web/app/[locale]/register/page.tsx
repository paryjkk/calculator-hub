import { notFound } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import type { Locale } from "@calc/shared";

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <AuthForm mode="register" locale={locale as Locale} />;
}

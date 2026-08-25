import { notFound } from "next/navigation";
import { AuthForm } from "@/components/AuthForm";
import type { Locale } from "@calc/shared";

export default async function LoginPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return <AuthForm mode="login" locale={locale as Locale} />;
}

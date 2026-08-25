import { notFound } from "next/navigation";
import AdminGuard from "../AdminGuard";
import MessagesClient from "./MessagesClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Messages · Dashboard" };

export default async function AdminMessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return (
    <AdminGuard locale={locale as Locale}>
      <MessagesClient locale={locale as Locale} />
    </AdminGuard>
  );
}

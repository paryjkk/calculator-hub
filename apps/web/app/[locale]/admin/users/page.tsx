import { notFound } from "next/navigation";
import AdminGuard from "../AdminGuard";
import UsersClient from "./UsersClient";
import type { Locale } from "@calc/shared";

export const metadata = { title: "Users · Dashboard" };

export default async function AdminUsersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (locale !== "en" && locale !== "ar") notFound();
  return (
    <AdminGuard locale={locale as Locale}>
      <UsersClient locale={locale as Locale} />
    </AdminGuard>
  );
}

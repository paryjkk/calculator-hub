"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function LangSwitch({ locale, label }: { locale: string; label: string }) {
  const pathname = usePathname() ?? "/";
  const segments = pathname.split("/");
  segments[1] = locale === "ar" ? "en" : "ar";
  return (
    <Link
      href={segments.join("/") || "/"}
      className="rounded-lg px-3 py-2 text-sm font-bold transition hover:bg-black/[.04]"
      style={{ color: "var(--accent)" }}
      lang={locale === "ar" ? "en" : "ar"}
    >
      {label}
    </Link>
  );
}

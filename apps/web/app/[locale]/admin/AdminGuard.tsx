"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";
import { getMe, type PublicUser } from "@/lib/session";

export default function AdminGuard({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [me, setMe] = useState<PublicUser | null | "loading">("loading");

  useEffect(() => {
    let alive = true;
    getMe()
      .then((u) => {
        if (!alive) return;
        if (u.role !== "ADMIN") router.replace(`/${locale}`);
        else setMe(u);
      })
      .catch(() => alive && router.replace(`/${locale}/login`));
    return () => {
      alive = false;
    };
  }, [locale, router]);

  if (me === "loading" || !me || me.role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm" style={{ color: "var(--ink-faint)" }}>
        …
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold tracking-tight">{dict.adminPanel}</h1>
        <nav className="flex gap-1 text-sm font-semibold">
          {[
            ["overview", isArLabel(locale) ? "نظرة عامة" : "Overview"],
            ["calculators", isArLabel(locale) ? "الحاسبات" : "Calculators"],
            ["users", isArLabel(locale) ? "المستخدمون" : "Users"],
            ["settings", isArLabel(locale) ? "الإعدادات" : "Settings"],
            ["messages", isArLabel(locale) ? "الرسائل" : "Messages"],
          ].map(([slug, label]) => (
            <Link
              key={slug}
              href={`/${locale}/admin/${slug}`}
              className="rounded-full px-4 py-2 transition hover:bg-black/[.05]"
              style={{ color: "var(--ink-soft)" }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8">{children}</div>
    </div>
  );
}

function isArLabel(locale: string) {
  return locale === "ar";
}

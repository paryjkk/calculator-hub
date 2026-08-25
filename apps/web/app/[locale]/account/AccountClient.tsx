"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";
import {
  deleteSaved,
  getMe,
  listSaved,
  logout,
  type PublicUser,
  type SavedCalculation,
} from "@/lib/session";

export default function AccountClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const isAr = locale === "ar";
  const [me, setMe] = useState<PublicUser | null | "loading">("loading");
  const [saved, setSaved] = useState<SavedCalculation[]>([]);

  useEffect(() => {
    let alive = true;
    getMe()
      .then(async (u) => {
        if (!alive) return;
        setMe(u);
        setSaved(await listSaved().catch(() => []));
      })
      .catch(() => alive && router.replace(`/${locale}/login`));
    return () => {
      alive = false;
    };
  }, [locale, router]);

  if (me === "loading") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center text-sm" style={{ color: "var(--ink-faint)" }}>
        …
      </div>
    );
  }

  if (!me) return null;

  async function onLogout() {
    await logout().catch(() => undefined);
    router.push(`/${locale}`);
    router.refresh();
  }

  async function onDelete(id: string) {
    await deleteSaved(id).catch(() => undefined);
    setSaved((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14">
      <h1 className="text-2xl font-bold tracking-tight">{dict.account}</h1>

      <section
        className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-5"
        style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)" }}
      >
        <div>
          <p className="text-base font-bold">{me.displayName}</p>
          <p className="text-sm" style={{ color: "var(--ink-faint)" }} dir="ltr">
            {me.email}
          </p>
        </div>
        <button
          onClick={onLogout}
          className="rounded-full px-5 py-2.5 text-sm font-semibold transition hover:opacity-90"
          style={{ background: "var(--ink)", color: "#fff" }}
        >
          {dict.logout}
        </button>
      </section>

      <h2 className="mt-10 text-lg font-bold">{isAr ? "الحاسبات المحفوظة" : "Saved calculations"}</h2>

      {saved.length === 0 ? (
        <p className="mt-4 rounded-xl p-6 text-center text-sm" style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)", color: "var(--ink-faint)" }}>
          {isAr
            ? "لا شيء محفوظاً بعد — احسب شيئاً واضغط «حفظ» بجانب النتيجة."
            : "Nothing saved yet — run a calculation and press Save next to the result."}
        </p>
      ) : (
        <ul className="mt-4 space-y-px overflow-hidden rounded-xl" style={{ boxShadow: "inset 0 0 0 1px var(--line)", background: "var(--line)" }}>
          {saved.map((s) => (
            <li key={s.id} className="flex items-center justify-between gap-3 px-4 py-3" style={{ background: "var(--surface)" }}>
              <div className="min-w-0">
                <Link href={`/${locale}/calculators/${s.slug}`} className="block truncate text-sm font-semibold hover:accent-text">
                  {s.name}
                </Link>
                <p className="text-xs" style={{ color: "var(--ink-faint)" }}>
                  {new Date(s.createdAt).toLocaleDateString(isAr ? "ar" : "en")} · {s.slug}
                </p>
              </div>
              <button
                onClick={() => onDelete(s.id)}
                aria-label={isAr ? "حذف" : "Delete"}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition hover:bg-black/[.05]"
                style={{ color: "#b42318" }}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

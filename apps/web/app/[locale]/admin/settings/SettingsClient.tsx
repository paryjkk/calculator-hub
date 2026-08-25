"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

const FIELDS = [
  { key: "siteNameEn", en: "Site name (EN)", ar: "اسم الموقع (EN)" },
  { key: "siteNameAr", en: "Site name (AR)", ar: "اسم الموقع (AR)" },
  { key: "adsenseClient", en: "AdSense client ID", ar: "معرّف AdSense" },
  { key: "adsenseSlotTop", en: "Ad slot — top", ar: "مساحة إعلانية — أعلى" },
  { key: "adsenseSlotBottom", en: "Ad slot — bottom", ar: "مساحة إعلانية — أسفل" },
  { key: "contactEmail", en: "Contact email", ar: "بريد التواصل" },
];

export default function SettingsClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const [values, setValues] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/v1/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((list: { key: string; value: string }[]) => {
        const map: Record<string, string> = {};
        for (const s of list) map[s.key] = String(s.value ?? "");
        setValues(map);
      })
      .catch(() => undefined);
  }, []);

  async function save(key: string, value: string) {
    setStatus("saving");
    const res = await fetch("/api/v1/admin/settings", {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });
    setStatus(res.ok ? "saved" : "error");
  }

  return (
    <div className="max-w-xl space-y-5">
      {FIELDS.map((f) => (
        <div key={f.key}>
          <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>
            {isAr ? f.ar : f.en}
          </label>
          <div className="flex gap-2">
            <input
              value={values[f.key] ?? ""}
              onChange={(e) => setValues((v) => ({ ...v, [f.key]: e.target.value }))}
              className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              style={{ borderColor: "var(--line)", background: "var(--surface)" }}
            />
            <button
              onClick={() => save(f.key, values[f.key] ?? "")}
              disabled={status === "saving"}
              className="shrink-0 rounded-full px-4 text-xs font-bold text-white transition hover:opacity-90"
              style={{ background: "var(--accent)" }}
            >
              {isAr ? "حفظ" : "Save"}
            </button>
          </div>
        </div>
      ))}
      {status === "saved" && <p className="text-sm font-semibold accent-text">{isAr ? "حُفظ ✓" : "Saved ✓"}</p>}
      {status === "error" && (
        <p className="text-sm font-semibold" style={{ color: "#b42318" }}>{dict.errorGeneric}</p>
      )}
    </div>
  );
}

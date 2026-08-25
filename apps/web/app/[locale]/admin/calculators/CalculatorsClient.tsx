"use client";

import { useEffect, useState } from "react";
import { CALCULATOR_DEFS, type Locale, type Localized } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface Override {
  slug: string;
  titleEn?: string | null;
  titleAr?: string | null;
  shortEn?: string | null;
  shortAr?: string | null;
  descEn?: string | null;
  descAr?: string | null;
  hidden?: boolean;
}

const FIELDS: { key: keyof Override & string; labelEn: string; labelAr: string; area?: boolean }[] = [
  { key: "titleEn", labelEn: "Title (EN)", labelAr: "العنوان (EN)" },
  { key: "titleAr", labelEn: "Title (AR)", labelAr: "العنوان (AR)" },
  { key: "shortEn", labelEn: "Short (EN)", labelAr: "السطر القصير (EN)" },
  { key: "shortAr", labelEn: "Short (AR)", labelAr: "السطر القصير (AR)" },
  { key: "descEn", labelEn: "Description (EN)", labelAr: "الوصف (EN)", area: true },
  { key: "descAr", labelEn: "Description (AR)", labelAr: "الوصف (AR)", area: true },
];

export default function CalculatorsClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const [overrides, setOverrides] = useState<Record<string, Override>>({});
  const [selected, setSelected] = useState<string>(CALCULATOR_DEFS[0].slug);
  const [draft, setDraft] = useState<Partial<Override>>({});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/v1/admin/overrides", { credentials: "include" })
      .then((r) => r.json())
      .then((list: Override[]) => {
        const map: Record<string, Override> = {};
        for (const o of list) map[o.slug] = o;
        setOverrides(map);
      })
      .catch(() => undefined);
  }, []);

  const currentDef = CALCULATOR_DEFS.find((d) => d.slug === selected)!;
  const merged: Partial<Override> = { ...overrides[selected], ...draft };

  function field<K extends keyof Override>(k: K, v: string | boolean | undefined) {
    setDraft((d) => ({ ...d, [k]: v }));
    setStatus("idle");
  }

  async function save() {
    setStatus("saving");
    const res = await fetch(`/api/v1/admin/overrides/${selected}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    if (res.ok) {
      setOverrides((prev) => ({
        ...prev,
        [selected]: { ...(prev[selected] ?? { slug: selected }), ...draft } as Override,
      }));
      setDraft({});
      setStatus("saved");
    } else setStatus("error");
  }

  async function toggleHidden() {
    const nextHidden = !merged.hidden;
    const res = await fetch(`/api/v1/admin/overrides/${selected}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hidden: nextHidden }),
    });
    if (res.ok) {
      setOverrides((prev) => ({ ...prev, [selected]: { ...(prev[selected] ?? { slug: selected }), hidden: nextHidden } }));
      setDraft({});
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[260px_minmax(0,1fr)]">
      <aside className="max-h-[70vh] space-y-px overflow-auto rounded-xl" style={{ boxShadow: "inset 0 0 0 1px var(--line)", background: "var(--line)" }}>
        {CALCULATOR_DEFS.map((d) => (
          <button
            key={d.slug}
            onClick={() => {
              setSelected(d.slug);
              setDraft({});
              setStatus("idle");
            }}
            className="flex w-full items-center justify-between gap-2 px-3.5 py-2.5 text-start text-sm font-medium transition hover:bg-black/[.04]"
            style={{ background: d.slug === selected ? "var(--accent-wash)" : "var(--surface)", color: d.slug === selected ? "var(--accent-deep)" : "var(--ink)" }}
          >
            <span className="truncate">{isAr ? d.title.ar : d.title.en}</span>
            {overrides[d.slug]?.hidden && <span aria-hidden>🚫</span>}
          </button>
        ))}
      </aside>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">{currentDef.icon} {isAr ? currentDef.title.ar : currentDef.title.en}</h2>
          <button
            onClick={toggleHidden}
            className="rounded-full border px-4 py-2 text-xs font-bold transition hover:opacity-80"
            style={{ borderColor: merged.hidden ? "#b42318" : "var(--line)", color: merged.hidden ? "#b42318" : "var(--ink-faint)" }}
          >
            {merged.hidden
              ? isAr ? "مخفية — اضغط للإظهار" : "Hidden — click to show"
              : isAr ? "ظاهرة — اضغط للإخفاء" : "Visible — click to hide"}
          </button>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.area ? "sm:col-span-2" : ""}>
              <label className="mb-1.5 block text-xs font-bold uppercase tracking-wide" style={{ color: "var(--ink-faint)" }}>
                {isAr ? f.labelAr : f.labelEn}
              </label>
              {f.area ? (
                <textarea
                  rows={3}
                  value={String(merged[f.key] ?? "")}
                  onChange={(e) => field(f.key, e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--line)", background: "var(--surface)" }}
                  placeholder={tOf(currentDef, f.key as "titleEn")}
                />
              ) : (
                <input
                  value={String(merged[f.key] ?? "")}
                  onChange={(e) => field(f.key, e.target.value)}
                  className="w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--line)", background: "var(--surface)" }}
                  placeholder={tOf(currentDef, f.key as "titleEn")}
                />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={save}
            disabled={status === "saving" || Object.keys(draft).length === 0}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
            style={{ background: "var(--accent)" }}
          >
            {status === "saving" ? "…" : isAr ? "حفظ التعديلات" : "Save changes"}
          </button>
          {status === "saved" && (
            <span className="text-sm font-semibold accent-text">
              {isAr ? "حُفظت ✓ — تظهر بعد تحديث الصفحة العامة" : "Saved ✓ — live after public page refresh"}
            </span>
          )}
          {status === "error" && (
            <span className="text-sm font-semibold" style={{ color: "#b42318" }}>
              {dict.errorGeneric}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function tOf(def: { title: Localized; short: Localized; description: Localized }, key: "titleEn" | "titleAr" | "shortEn" | "shortAr" | "descEn" | "descAr"): string {
  switch (key) {
    case "titleEn": return def.title.en;
    case "titleAr": return def.title.ar;
    case "shortEn": return def.short.en;
    case "shortAr": return def.short.ar;
    case "descEn": return def.description.en;
    case "descAr": return def.description.ar;
  }
}

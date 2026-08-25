"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface Stats {
  totalCalculations: number;
  totalUsers: number;
  newUsers7d: number;
  last7days: { day: string; count: number }[];
  topCalculators: { slug: string; count: number }[];
}

export default function OverviewClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/v1/admin/stats", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((s) => alive && setStats(s))
      .catch(() => alive && setError(true));
    return () => {
      alive = false;
    };
  }, []);

  if (error)
    return (
      <p className="rounded-xl px-4 py-3 text-sm" style={{ background: "#fdf0ef", color: "#b42318" }}>
        {dict.errorGeneric}
      </p>
    );

  if (!stats) return <p className="py-16 text-center text-sm">…</p>;

  return (
    <div className="space-y-10">
      <div className="grid gap-px overflow-hidden rounded-2xl sm:grid-cols-3" style={{ background: "var(--line)", boxShadow: "inset 0 0 0 1px var(--line)" }}>
        <Stat label={isAr ? "إجمالي العمليات" : "Total calculations"} value={fmt(stats.totalCalculations)} />
        <Stat label={isAr ? "المستخدمون" : "Users"} value={fmt(stats.totalUsers)} />
        <Stat
          label={isAr ? "مستخدمون جدد (٧ أيام)" : "New users (7d)"}
          value={fmt(stats.newUsers7d)}
          accent
        />
      </div>

      <section>
        <h2 className="text-base font-bold">{isAr ? "آخر ٧ أيام" : "Last 7 days"}</h2>
        <Bars data={stats.last7days} isAr={isAr} />
      </section>

      <section>
        <h2 className="text-base font-bold">{isAr ? "الأكثر استخداماً" : "Most used"}</h2>
        {stats.topCalculators.length === 0 ? (
          <p className="mt-3 text-sm" style={{ color: "var(--ink-faint)" }}>
            {isAr ? "لا بيانات بعد." : "No data yet."}
          </p>
        ) : (
          <ul className="mt-4 space-y-2">
            {stats.topCalculators.map((t, i) => {
              const max = stats.topCalculators[0].count || 1;
              return (
                <li key={t.slug} className="flex items-center gap-3 text-sm">
                  <span className="index-numeral w-6 shrink-0 text-xs" style={{ color: "var(--ink-faint)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="w-44 shrink-0 truncate font-medium">{t.slug}</span>
                  <span className="h-4 rounded-full" style={{ width: `${Math.max(4, (t.count / max) * 100)}%`, background: "var(--accent)", opacity: 0.85 }} />
                  <span className="tabular-nums" style={{ color: "var(--ink-soft)" }}>{fmt(t.count)}</span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="p-5" style={{ background: accent ? "var(--accent-wash)" : "var(--surface)" }}>
      <p className="text-[11px] font-semibold uppercase tracking-wide" style={{ color: accent ? "var(--accent-deep)" : "var(--ink-faint)" }}>
        {label}
      </p>
      <p className="mt-1.5 text-3xl font-bold tabular-nums" style={{ color: accent ? "var(--accent-deep)" : "var(--ink)" }}>
        {value}
      </p>
    </div>
  );
}

function Bars({ data, isAr }: { data: { day: string; count: number }[]; isAr: boolean }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <svg viewBox={`0 0 ${data.length * 48} 140`} className="mt-4 h-36 w-full max-w-xl">
      {data.map((d, i) => {
        const h = Math.max(4, (d.count / max) * 110);
        return (
          <g key={d.day}>
            <rect x={i * 48 + 8} y={120 - h} width={32} height={h} rx={6} fill="var(--accent)" opacity={i === data.length - 1 ? 1 : 0.55} />
            <text x={i * 48 + 24} y={134} textAnchor="middle" fontSize={9} fill="var(--ink-faint)">
              {d.day.slice(5)}
            </text>
            <text x={i * 48 + 24} y={114 - h} textAnchor="middle" fontSize={10} fill="var(--ink-soft)">
              {d.count || ""}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

function fmt(n: number) {
  return n.toLocaleString("en-US");
}

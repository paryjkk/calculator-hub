"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface Msg {
  id: string;
  email: string;
  body: string;
  handled: boolean;
  createdAt: string;
}

export default function MessagesClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const [msgs, setMsgs] = useState<Msg[] | null>(null);

  useEffect(() => {
    fetch("/api/v1/admin/messages", { credentials: "include" })
      .then((r) => r.json())
      .then(setMsgs)
      .catch(() => setMsgs([]));
  }, []);

  async function mark(id: string, handled: boolean) {
    await fetch(`/api/v1/admin/messages/${id}`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ handled }),
    });
    setMsgs((prev) => prev?.map((m) => (m.id === id ? { ...m, handled } : m)) ?? null);
  }

  if (!msgs) return <p className="py-12 text-center text-sm">…</p>;
  if (msgs.length === 0)
    return (
      <p className="rounded-xl p-6 text-center text-sm" style={{ background: "var(--surface)", boxShadow: "inset 0 0 0 1px var(--line)", color: "var(--ink-faint)" }}>
        {isAr ? "لا رسائل بعد." : "No messages yet."}
      </p>
    );

  return (
    <ul className="space-y-3">
      {msgs.map((m) => (
        <li
          key={m.id}
          className="rounded-2xl p-5"
          style={{ background: "var(--surface)", boxShadow: `inset 0 0 0 1px ${m.handled ? "var(--line)" : "var(--accent)"}` }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <a href={`mailto:${m.email}`} className="text-sm font-bold hover:accent-text" dir="ltr">
              {m.email}
            </a>
            <div className="flex items-center gap-2">
              <span className="text-xs" style={{ color: "var(--ink-faint)" }}>
                {new Date(m.createdAt).toLocaleString(isAr ? "ar" : "en")}
              </span>
              <button
                onClick={() => mark(m.id, !m.handled)}
                className="rounded-full border px-3 py-1 text-xs font-bold transition hover:opacity-80"
                style={{
                  borderColor: m.handled ? "var(--line)" : "var(--accent)",
                  color: m.handled ? "var(--ink-faint)" : "var(--accent)",
                }}
              >
                {m.handled ? (isAr ? "معالجة ✓" : "Handled ✓") : isAr ? "علّم كمعالجة" : "Mark handled"}
              </button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-6" style={{ color: "var(--ink-soft)" }}>
            {m.body}
          </p>
        </li>
      ))}
    </ul>
  );
}

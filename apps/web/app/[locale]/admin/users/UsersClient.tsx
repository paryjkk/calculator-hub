"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary } from "@/lib/i18n";

interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "USER" | "ADMIN";
  createdAt: string;
  _count: { savedCalculations: number };
}

export default function UsersClient({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const isAr = locale === "ar";
  const [users, setUsers] = useState<AdminUser[] | null>(null);
  const [query, setQuery] = useState("");
  const [meId, setMeId] = useState<string>("");

  function load(q = "") {
    fetch(`/api/v1/admin/users${q ? `?query=${encodeURIComponent(q)}` : ""}`, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then(setUsers)
      .catch(() => setUsers([]));
  }

  useEffect(() => {
    load();
    fetch("/api/v1/auth/me", { credentials: "include" })
      .then((r) => r.json())
      .then((u) => setMeId(u.id))
      .catch(() => undefined);
  }, []);

  async function setRole(id: string, role: "USER" | "ADMIN") {
    const res = await fetch(`/api/v1/admin/users/${id}/role`, {
      method: "PATCH",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
    });
    if (res.ok) {
      setUsers((prev) => prev?.map((u) => (u.id === id ? { ...u, role } : u)) ?? null);
    }
  }

  async function remove(id: string) {
    if (!confirm(isAr ? "حذف هذا المستخدم نهائياً؟" : "Delete this user permanently?")) return;
    const res = await fetch(`/api/v1/admin/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) setUsers((prev) => prev?.filter((u) => u.id !== id) ?? null);
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          load(e.target.value);
        }}
        placeholder={isAr ? "بحث بالبريد…" : "Search by email…"}
        className="w-full max-w-xs rounded-xl border px-3 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
        style={{ borderColor: "var(--line)", background: "var(--surface)" }}
        dir="ltr"
      />

      {!users ? (
        <p className="py-12 text-center text-sm">…</p>
      ) : (
        <div className="mt-5 space-y-px overflow-hidden rounded-xl" style={{ boxShadow: "inset 0 0 0 1px var(--line)", background: "var(--line)" }}>
          {users.map((u) => (
            <div key={u.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3" style={{ background: "var(--surface)" }}>
              <div className="min-w-0">
                <p className="text-sm font-bold">{u.displayName}</p>
                <p className="text-xs" dir="ltr" style={{ color: "var(--ink-faint)" }}>
                  {u.email} · {new Date(u.createdAt).toLocaleDateString(isAr ? "ar" : "en")} ·{" "}
                  {u._count.savedCalculations} {isAr ? "محفوظة" : "saved"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={u.role}
                  onChange={(e) => setRole(u.id, e.target.value as "USER" | "ADMIN")}
                  disabled={u.id === meId}
                  className="rounded-lg border px-2.5 py-1.5 text-xs font-bold outline-none"
                  style={{ borderColor: u.role === "ADMIN" ? "var(--accent)" : "var(--line)", color: u.role === "ADMIN" ? "var(--accent-deep)" : "var(--ink-soft)", background: "var(--surface)" }}
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <button
                  onClick={() => remove(u.id)}
                  disabled={u.id === meId}
                  aria-label={isAr ? "حذف" : "Delete"}
                  className="rounded-full px-3 py-1.5 text-xs font-bold transition hover:bg-black/[.05] disabled:opacity-30"
                  style={{ color: "#b42318" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && (
            <p className="px-4 py-6 text-center text-sm" style={{ background: "var(--surface)", color: "var(--ink-faint)" }}>
              —
            </p>
          )}
        </div>
      )}
      <p className="mt-3 text-xs" style={{ color: "var(--ink-faint)" }}>{dict.footerDisclaimer}</p>
    </div>
  );
}

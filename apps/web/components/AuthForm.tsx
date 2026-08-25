"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Locale } from "@calc/shared";
import { getDictionary, interpolate } from "@/lib/i18n";

export function AuthForm({
  mode,
  locale,
}: {
  mode: "login" | "register";
  locale: Locale;
}) {
  const dict = getDictionary(locale);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAr = locale === "ar";
  const T = {
    login: {
      title: isAr ? "مرحباً بعودتك" : "Welcome back",
      submit: dict.login,
      name: undefined,
    },
    register: {
      title: isAr ? "أنشئ حسابك" : "Create your account",
      submit: dict.register,
      name: isAr ? "الاسم الظاهر" : "Display name",
    },
  }[mode];

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setPending(true);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch(`/api/v1/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(
          mode === "register"
            ? {
                displayName: String(fd.get("displayName") ?? ""),
                email: String(fd.get("email") ?? ""),
                password: String(fd.get("password") ?? ""),
              }
            : { email: String(fd.get("email")), password: String(fd.get("password")) }
        ),
      });
      const payload = (await res.json().catch(() => null)) as
        | { message?: unknown }
        | null;
      if (!res.ok) {
        setError(
          typeof payload?.message === "string"
            ? payload.message
            : Array.isArray(payload?.message)
              ? (payload.message as unknown[]).map(String).join("، ")
              : dict.errorGeneric
        );
        return;
      }
      router.push(`/${locale}/account`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  const field =
    "w-full rounded-xl border px-3 py-2.5 text-sm outline-none transition focus:border-[var(--accent)]";
  const labelCls = "mb-1.5 block text-sm font-semibold";

  return (
    <div className="mx-auto max-w-sm px-4 py-20">
      <h1 className="text-2xl font-bold tracking-tight">{T.title}</h1>
      <form onSubmit={onSubmit} className="mt-7 space-y-4" noValidate>
        {T.name && (
          <div>
            <label htmlFor="displayName" className={labelCls} style={{ color: "var(--ink-soft)" }}>
              {T.name}
            </label>
            <input id="displayName" name="displayName" required minLength={2} maxLength={40} className={field}
              style={{ background: "var(--surface)", borderColor: "var(--line)" }} />
          </div>
        )}
        <div>
          <label htmlFor="email" className={labelCls} style={{ color: "var(--ink-soft)" }}>Email</label>
          <input id="email" name="email" type="email" required className={field} dir="ltr"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }} />
        </div>
        <div>
          <label htmlFor="password" className={labelCls} style={{ color: "var(--ink-soft)" }}>
            {isAr ? "كلمة المرور" : "Password"}
          </label>
          <input id="password" name="password" type="password" required minLength={8} className={field} dir="ltr"
            style={{ background: "var(--surface)", borderColor: "var(--line)" }} />
          <p className="mt-1 text-xs" style={{ color: "var(--ink-faint)" }}>
            {isAr ? "٨ أحرف على الأقل" : "At least 8 characters"}
          </p>
        </div>

        {error && (
          <p role="alert" className="rounded-xl px-4 py-3 text-sm font-medium"
            style={{ background: "#fdf0ef", color: "#b42318" }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-full py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--accent)" }}
        >
          {pending ? "…" : T.submit}
        </button>
      </form>

      <p className="mt-6 text-center text-sm" style={{ color: "var(--ink-faint)" }}>
        {mode === "login" ? (
          <>
            {isAr ? "ليس لديك حساب؟ " : "No account yet? "}
            <Link href={`/${locale}/register`} className="font-semibold hover:accent-text">
              {dict.register}
            </Link>
          </>
        ) : (
          <>
            {isAr ? "لديك حساب بالفعل؟ " : "Already registered? "}
            <Link href={`/${locale}/login`} className="font-semibold hover:accent-text">
              {dict.login}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

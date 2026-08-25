"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { UserIcon } from "@/components/icons";
import { getMe, type PublicUser } from "@/lib/session";

export default function AccountMenu({
  locale,
  labels,
}: {
  locale: string;
  labels: { account: string; login: string; register: string; admin: string; myAccount: string };
}) {
  const [me, setMe] = useState<PublicUser | null | "loading">("loading");

  useEffect(() => {
    let alive = true;
    getMe()
      .then((u) => alive && setMe(u))
      .catch(() => alive && setMe(null));
    return () => {
      alive = false;
    };
  }, []);

  if (me === "loading") return <span className="inline-block h-8 w-8" aria-hidden />;

  if (!me) {
    return (
      <Link
        href={`/${locale}/login`}
        className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--ink)" }}
      >
        <UserIcon className="h-4 w-4" />
        {labels.login}
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/${locale}/account`}
        className="rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-black/[.04]"
        style={{ color: "var(--ink-soft)" }}
      >
        {me.displayName}
      </Link>
      {me.role === "ADMIN" && (
        <Link
          href={`/${locale}/admin`}
          className="rounded-full px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white transition hover:opacity-90"
          style={{ background: "var(--accent)" }}
        >
          {labels.admin}
        </Link>
      )}
    </div>
  );
}

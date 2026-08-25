import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-28 text-center">
      <p className="index-numeral text-7xl font-bold" style={{ color: "var(--line)" }} aria-hidden>
        404
      </p>
      <h1 className="mt-4 text-xl font-bold">
        Page not found · الصفحة غير موجودة
      </h1>
      <Link
        href="/en"
        className="mt-8 inline-block rounded-full px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ background: "var(--accent)" }}
      >
        Home / الرئيسية
      </Link>
    </div>
  );
}

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-24 text-center">
      <p className="text-6xl" aria-hidden>
        🧮
      </p>
      <h1 className="mt-4 text-2xl font-extrabold text-slate-900">
        404 — Page not found / الصفحة غير موجودة
      </h1>
      <Link
        href="/en"
        className="mt-6 inline-block rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-teal-700"
      >
        Home / الرئيسية
      </Link>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";

import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export default async function ReservationSuccessPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: param } = await params;
  if (!isLocale(param)) notFound();
  const locale = param as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="mx-auto max-w-lg rounded-3xl border border-rose-100 bg-white/95 px-6 py-10 text-center shadow-xl shadow-rose-200/30 backdrop-blur-sm sm:px-10">
      <h1 className="fa-text-gradient text-2xl font-bold sm:text-3xl">{dict.successTitle}</h1>
      <p className="mt-4 text-sm text-slate-600 sm:text-base">{dict.successSubtitle}</p>
      <Link
        href={`/${locale}`}
        className="fa-btn-primary mt-8 inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-sm font-bold text-white sm:text-base touch-manipulation"
      >
        {dict.backHome}
      </Link>
    </div>
  );
}

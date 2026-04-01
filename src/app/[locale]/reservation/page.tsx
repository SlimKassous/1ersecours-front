import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ReservationWizard } from "@/components/ReservationWizard";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: param } = await params;
  if (!isLocale(param)) return {};
  const locale = param as Locale;
  const dict = getDictionary(locale);
  return {
    title: dict.reservationTitle,
    description: dict.reservationSubtitle,
    alternates: {
      canonical: `/${locale}/reservation`,
      languages: {
        fr: "/fr/reservation",
        en: "/en/reservation",
      },
    },
  };
}

export default async function ReservationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: param } = await params;
  if (!isLocale(param)) notFound();
  const locale = param as Locale;
  const dict = getDictionary(locale);

  return (
    <div className="w-full min-w-0 max-w-none">
      <h1 className="fa-text-gradient mb-2 text-2xl font-bold tracking-tight sm:text-3xl md:text-4xl lg:text-[2.25rem]">
        {dict.reservationTitle}
      </h1>
      <p className="mb-6 max-w-4xl text-sm text-slate-600 sm:mb-8 sm:text-base lg:text-[1.05rem]">
        {dict.reservationSubtitle}
      </p>
      <ReservationWizard locale={locale} />
    </div>
  );
}

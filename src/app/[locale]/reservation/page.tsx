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


  return (
    <div className="w-full min-w-0 max-w-none">
      <ReservationWizard locale={locale} />
    </div>
  );
}

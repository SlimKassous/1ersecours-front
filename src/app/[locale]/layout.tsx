import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HtmlLang } from "@/components/HtmlLang";
import { LocaleHeader } from "@/components/LocaleHeader";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { SiteFooter } from "@/components/SiteFooter";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSiteBootstrap } from "@/lib/siteBootstrap";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
    title: {
      default: dict.browserTabTitle,
      template: `%s | ${dict.browserTabTitle}`,
    },
    description: dict.heroSubtitle,
    metadataBase: new URL(siteUrl),
    alternates: {
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CH" : "en_CH",
    },
    keywords:
      locale === "fr"
        ? [
            "premiers secours",
            "Geneve",
            "Samaritain",
            "OCV",
            "Success Driving",
            "cours premiers secours",
          ]
        : [
            "first aid",
            "Geneva",
            "Samaritan",
            "OCV",
            "Success Driving",
            "first aid course",
          ],
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: param } = await params;
  if (!isLocale(param)) notFound();
  const locale = param as Locale;

  const { addresses, siteInfo } = await loadSiteBootstrap();
  const mainUrl = siteInfo.mainSiteUrl ?? "https://success-ds.ch";
  const primary = addresses[0];

  return (
    <>
      <LocalBusinessJsonLd
        locale={locale}
        telephone={siteInfo.phone.phoneNumber}
        streetAddress={primary?.rue}
        locality={primary?.ville}
      />
      <HtmlLang locale={locale} />
      <div className="relative flex min-h-full min-h-dvh flex-1 flex-col text-neutral-900">
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-[#fef2f2] bg-[url('/images/first-aid-bg.webp')] bg-cover bg-center bg-no-repeat"
          aria-hidden
        />
        <div
          className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-rose-50/88 via-white/82 to-fuchsia-50/90"
          aria-hidden
        />
        <LocaleHeader locale={locale} phoneTel={siteInfo.phone.phoneNumber} />
        <div className="relative z-10 mx-auto flex w-full max-w-[min(100%,90rem)] flex-1 flex-col px-4 py-8 sm:px-5 sm:py-10 md:px-6 lg:px-8 md:py-12">
          {children}
          <SiteFooter
            locale={locale}
            addresses={addresses}
            phoneTel={siteInfo.phone.phoneNumber}
            phoneDisplay={siteInfo.phone.formattedPhoneNumber}
            landlineDisplay={siteInfo.phone.formattedLandlineNumber}
            mainSiteUrl={mainUrl}
          />
        </div>
      </div>
    </>
  );
}

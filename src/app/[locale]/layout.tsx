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
    openGraph: {
      type: "website",
      locale: locale === "fr" ? "fr_CH" : "en_CH",
      title: dict.browserTabTitle,
      description: dict.heroSubtitle,
      url: `/${locale}`,
      siteName: "Success Driving School",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.browserTabTitle,
      description: dict.heroSubtitle,
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        fr: "/fr",
        en: "/en",
      },
    },
    keywords:
      locale === "fr"
        ? [
            "premiers secours",
            "cours premiers secours geneve",
            "formation samaritains geneve",
            "attestation samaritains",
            "cours samaritains permis geneve",
            "Geneve",
            "Samaritain",
            "OCV",
            "Success Driving",
            "inscription en ligne premiers secours",
          ]
        : [
            "first aid",
            "first aid course geneva",
            "samaritan course geneva",
            "driving licence first aid switzerland",
            "first aid certificate geneva",
            "Geneva",
            "Samaritan",
            "OCV",
            "Success Driving",
            "online first aid booking",
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
        <LocaleHeader
          locale={locale}
          phoneTel={siteInfo.phone.phoneNumber}
          phoneDisplay={siteInfo.phone.formattedPhoneNumber}
          addressDisplay={primary?.rue ? `${primary.rue}${primary.ville ? `, ${primary.ville}` : ""}` : undefined}
        />
        <div className="relative z-10 mx-auto flex w-full max-w-[min(100%,100rem)] flex-1 flex-col px-4 pb-8 pt-[10.2rem] sm:px-5 sm:pb-10 sm:pt-[10.8rem] md:px-7 md:pb-12 md:pt-[11.2rem] lg:px-10 xl:px-12">
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

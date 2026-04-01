import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  telephone: string;
  /** Première ligne d’adresse (rue) depuis /api/addresses */
  streetAddress?: string;
  locality?: string;
};

export function LocalBusinessJsonLd({
  locale,
  telephone,
  streetAddress,
  locality,
}: Props) {
  const dict = getDictionary(locale);
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: dict.brand,
    description: dict.heroSubtitle,
    address: {
      "@type": "PostalAddress",
      streetAddress: streetAddress?.trim() || dict.locationAddress,
      addressLocality:
        locality?.trim() || (locale === "fr" ? "Genève" : "Geneva"),
      addressCountry: "CH",
    },
    telephone,
    url:
      process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
      "http://localhost:3000",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

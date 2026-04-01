import type { MetadataRoute } from "next";

const LOCALES = ["fr", "en"] as const;
const PATHS = ["", "/reservation", "/reservation/success"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const path of PATHS) {
      entries.push({
        url: `${base}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: path === "" ? 1 : 0.85,
      });
    }
  }

  return entries;
}

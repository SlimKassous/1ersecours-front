import type { Locale } from "@/lib/i18n";

const ORIGIN = "https://success-ds.ch";

/** Routes officieuses alignées sur successdriving `App.tsx` (Segment locale `fr` | `en`). */
export function successDsUrl(locale: Locale, path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${ORIGIN}/${locale}${p}`;
}

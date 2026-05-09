"use client";

import { usePathname, useRouter } from "next/navigation";
import { FlagIcon } from "react-flag-kit";
import React from "react";

import type { Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  className?: string;
  largeFlags?: boolean;
};

export function LanguageSwitcher({ locale, className, largeFlags }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  // Standard sizes from successdriving
  const flagSizeSm = largeFlags ? 40 : 22;
  const flagSizeThumb = largeFlags ? 38 : 20;

  const handleToggle = () => {
    const nextLocale: Locale = locale === "fr" ? "en" : "fr";
    const newPathname = pathname?.replace(`/${locale}`, `/${nextLocale}`) ?? `/${nextLocale}`;
    router.push(newPathname);
  };

  return (
    <div className={["lang-switcher-container", className].filter(Boolean).join(" ")}>
      <span 
        className="lang-label lang-label--fr" 
        onClick={() => locale !== "fr" && handleToggle()}
      >
        FR
      </span>

      <button
        type="button"
        className={`lang-toggle lang-toggle--sm ${locale === "fr" ? "is-fr" : "is-en"}`}
        aria-label={`Switch language to ${locale === "fr" ? "English" : "Français"}`}
        onClick={handleToggle}
      >
        <span className="lang-toggle__track" />

        <span className="lang-toggle__ghost lang-toggle__ghost--left" aria-hidden>
          <FlagIcon code="FR" size={flagSizeSm} />
        </span>
        <span className="lang-toggle__ghost lang-toggle__ghost--right" aria-hidden>
          <FlagIcon code="GB" size={flagSizeSm} />
        </span>

        <span className="lang-toggle__thumb" aria-hidden>
          <FlagIcon code={locale === "fr" ? "FR" : "GB"} size={flagSizeThumb} />
        </span>
      </button>

      <span 
        className="lang-label lang-label--en" 
        onClick={() => locale !== "en" && handleToggle()}
      >
        EN
      </span>
    </div>
  );
}

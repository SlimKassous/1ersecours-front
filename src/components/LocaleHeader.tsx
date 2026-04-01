"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { LocaleFlag } from "@/components/LocaleFlag";
import type { Locale } from "@/lib/i18n";
import { getDictionary, locales } from "@/lib/i18n";

/** Même fichier que successdriving `ToolbarComponent` : `logo-nobackground-200.webp`, sans fond. */
const TOOLBAR_LOGO = "/branding/logo-nobackground-200.webp";

type Props = {
  locale: Locale;
  phoneTel: string;
  phoneDisplay?: string;
  addressDisplay?: string;
};

export function LocaleHeader({ locale, phoneTel, phoneDisplay, addressDisplay }: Props) {
  const dict = getDictionary(locale);
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);

  const pathForLocale = (l: Locale) =>
    pathname?.replace(`/${locale}`, `/${l}`) ?? `/${l}`;

  const localeLabel = (l: Locale) => (l === "fr" ? dict.localeLabelFr : dict.localeLabelEn);

  useEffect(() => {
    setMenuOpen(false);
    setLangOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!langOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [langOpen]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  const navLinkClass =
    "block rounded-xl px-4 py-3 text-base font-extrabold text-slate-800 transition hover:bg-rose-50 md:inline-block md:px-4 md:py-2.5 md:text-[1.02rem]";
  const displayPhone = phoneDisplay ?? phoneTel;
  const displayAddress = addressDisplay ?? dict.locationAddress;

  return (
    <header className="fixed left-0 right-0 top-0 z-[120] border-b border-rose-200/60 bg-white/95 shadow-md shadow-rose-200/25 backdrop-blur-md">
      <div className="relative mx-auto w-full max-w-[min(100%,100rem)] px-3 sm:px-5 md:px-7 lg:px-10 xl:px-12">
        {/* Logo à gauche, nav centrée (desktop), langue + menu à droite — comme ToolbarComponent mobile */}
        <div className="flex min-h-[3.5rem] w-full min-w-0 items-center gap-2 py-1.5 md:min-h-[4rem] md:gap-3 md:py-2">
          <Link
            href={`/${locale}`}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-xl p-1 pl-0 touch-manipulation [-webkit-tap-highlight-color:transparent] sm:gap-2.5 sm:p-1.5 sm:pl-0 md:gap-3"
          >
            <Image
              src={TOOLBAR_LOGO}
              alt="Success Driving School"
              width={200}
              height={60}
              className="h-[34px] w-auto max-w-[min(138px,42vw)] shrink-0 object-contain object-left sm:h-[40px] sm:max-w-[min(158px,44vw)] md:h-[46px]"
              style={{ width: "auto", height: "auto" }}
              priority
            />
          </Link>

          <a
            href={`tel:${phoneTel.replace(/\s/g, "")}`}
            className="hidden min-h-[42px] shrink-0 items-center gap-2 whitespace-nowrap rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-extrabold text-[#be123c] shadow-sm hover:bg-rose-50 lg:inline-flex"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 012.1 4.2 2 2 0 014.1 2h3a2 2 0 012 1.7c.1.8.3 1.6.6 2.3a2 2 0 01-.4 2L8 9.4a16 16 0 006.6 6.6l1.4-1.3a2 2 0 012-.4c.7.3 1.5.5 2.3.6A2 2 0 0122 16.9z" />
            </svg>
            {displayPhone}
          </a>
          <div className="hidden min-h-[42px] min-w-0 shrink items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 shadow-sm xl:inline-flex">
            <svg className="h-4 w-4 shrink-0 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <span className="max-w-[18rem] truncate whitespace-nowrap text-sm font-bold text-slate-700">{displayAddress}</span>
          </div>

          <nav className="hidden min-w-0 flex-1 items-center justify-center gap-1 overflow-x-auto whitespace-nowrap px-1 [-ms-overflow-style:none] [scrollbar-width:none] lg:flex lg:gap-2 [&::-webkit-scrollbar]:hidden" aria-label="Main">
            <Link className={navLinkClass} href={`/${locale}`}>
              {dict.navHome}
            </Link>
            <Link
              className={navLinkClass}
              href={`/${locale}#programme`}
            >
              {dict.navProgramme}
            </Link>
            <Link
              className={navLinkClass}
              href={`/${locale}#audience`}
            >
              {dict.navAudience}
            </Link>
            <Link
              className={navLinkClass}
              href={`/${locale}#location`}
            >
              {dict.navLocation}
            </Link>
            <Link
              className={`${navLinkClass} font-black text-[#e11d48] hover:text-[#be123c]`}
              href={`/${locale}/reservation`}
            >
              {dict.navReserve}
            </Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <div ref={langRef} className="relative z-[110]">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex min-h-[46px] items-center gap-1.5 rounded-full border-2 border-rose-200/85 bg-gradient-to-r from-white to-rose-50/90 px-2.5 py-2 text-[11px] font-semibold text-slate-900 shadow-md shadow-rose-200/40 transition hover:border-rose-300 hover:shadow-lg sm:px-3.5 touch-manipulation [-webkit-tap-highlight-color:transparent]"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={dict.langMenuAria}
              >
                <LocaleFlag code={locale} />
                <span className="hidden max-w-[5.5rem] truncate sm:inline">{localeLabel(locale)}</span>
                <span className="text-[9px] tabular-nums text-rose-600 sm:text-[10px]" aria-hidden>
                  {langOpen ? "▲" : "▼"}
                </span>
              </button>
              {langOpen ? (
                <div
                  className="absolute right-0 z-[120] mt-1.5 w-44 rounded-2xl border border-rose-200/90 bg-white/98 p-1 text-[11px] shadow-xl shadow-rose-200/50 backdrop-blur-md"
                  role="listbox"
                >
                  {locales.map((l) => {
                    const active = l === locale;
                    return (
                      <div key={l} role="option" aria-selected={active}>
                        {active ? (
                          <span className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-rose-100 to-amber-100 px-2.5 py-2 font-semibold text-rose-900">
                            <LocaleFlag code={l} />
                            <span>{localeLabel(l)}</span>
                          </span>
                        ) : (
                          <Link
                            href={pathForLocale(l)}
                            hrefLang={l}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 transition hover:bg-rose-50 hover:text-rose-900"
                            onClick={() => setLangOpen(false)}
                          >
                            <LocaleFlag code={l} />
                            <span>{localeLabel(l)}</span>
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>

            <span className="inline-block h-5 w-px shrink-0 bg-rose-200/90 lg:hidden" aria-hidden />

            <button
              type="button"
              className="inline-flex min-h-[46px] min-w-[46px] items-center justify-center rounded-xl border border-rose-200/90 bg-white text-[#e11d48] shadow-sm lg:hidden touch-manipulation [-webkit-tap-highlight-color:transparent]"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? dict.menuClose : dict.menuOpen}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="text-xl leading-none" aria-hidden>
                {menuOpen ? "✕" : "☰"}
              </span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <nav
            className="absolute left-0 right-0 top-full z-[95] max-h-[min(70vh,520px)] overflow-y-auto overflow-x-hidden border-t border-rose-100 bg-white py-3 shadow-lg shadow-rose-100/50 lg:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-0.5 px-2">
              <Link className={navLinkClass} href={`/${locale}`} onClick={() => setMenuOpen(false)}>
                {dict.navHome}
              </Link>
              <Link
                className={navLinkClass}
                href={`/${locale}#programme`}
                onClick={() => setMenuOpen(false)}
              >
                {dict.navProgramme}
              </Link>
              <Link
                className={navLinkClass}
                href={`/${locale}#audience`}
                onClick={() => setMenuOpen(false)}
              >
                {dict.navAudience}
              </Link>
              <Link
                className={navLinkClass}
                href={`/${locale}#location`}
                onClick={() => setMenuOpen(false)}
              >
                {dict.navLocation}
              </Link>
              <Link
                className={`${navLinkClass} font-bold text-[#e11d48]`}
                href={`/${locale}/reservation`}
                onClick={() => setMenuOpen(false)}
              >
                {dict.navReserve}
              </Link>
              <a
                className={`${navLinkClass} text-slate-700`}
                href={`tel:${phoneTel.replace(/\s/g, "")}`}
                onClick={() => setMenuOpen(false)}
              >
                {displayPhone}
              </a>
              <div className="px-3 py-2.5 text-sm font-semibold text-slate-600">
                {displayAddress}
              </div>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

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
};

export function LocaleHeader({ locale, phoneTel }: Props) {
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
    "block rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 hover:bg-rose-50 sm:text-base md:inline-block md:py-2";

  return (
    <header className="sticky top-0 z-[100] border-b border-rose-200/60 bg-white/90 shadow-sm shadow-rose-200/20 backdrop-blur-md">
      <div className="relative mx-auto max-w-6xl px-3 sm:px-5 md:px-6">
        {/* Logo à gauche, nav centrée (desktop), langue + menu à droite — comme ToolbarComponent mobile */}
        <div className="flex min-h-[3.5rem] w-full min-w-0 items-center gap-2 py-1.5 md:min-h-[4rem] md:gap-3 md:py-2">
          <Link
            href={`/${locale}`}
            className="flex min-w-0 shrink-0 items-center gap-2 rounded-lg p-1 touch-manipulation [-webkit-tap-highlight-color:transparent] sm:gap-2.5 sm:p-1.5 md:gap-3"
          >
            <Image
              src={TOOLBAR_LOGO}
              alt="Success Driving School"
              width={200}
              height={60}
              className="h-[48px] w-auto max-w-[min(180px,52vw)] shrink-0 object-contain object-left sm:h-[54px] sm:max-w-[min(200px,50vw)] md:h-[60px]"
              priority
            />
            <span className="fa-display hidden min-w-0 text-sm font-extrabold leading-tight tracking-tight text-neutral-900 lg:block lg:text-base">
              <span className="line-clamp-2 xl:line-clamp-1">{dict.brand}</span>
            </span>
          </Link>

          <nav
            className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 overflow-x-auto whitespace-nowrap px-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex lg:gap-1 [&::-webkit-scrollbar]:hidden"
            aria-label="Main"
          >
            <Link className={`${navLinkClass} text-xs lg:text-sm`} href={`/${locale}`}>
              {dict.navHome}
            </Link>
            <Link
              className={`${navLinkClass} hidden text-xs lg:inline lg:text-sm`}
              href={`/${locale}#programme`}
            >
              {dict.navProgramme}
            </Link>
            <Link
              className={`${navLinkClass} hidden text-xs lg:inline lg:text-sm`}
              href={`/${locale}#audience`}
            >
              {dict.navAudience}
            </Link>
            <Link
              className={`${navLinkClass} hidden text-xs lg:inline lg:text-sm`}
              href={`/${locale}#location`}
            >
              {dict.navLocation}
            </Link>
            <Link
              className={`${navLinkClass} text-xs font-bold text-[#e11d48] hover:text-[#be123c] lg:text-sm`}
              href={`/${locale}/reservation`}
            >
              {dict.navReserve}
            </Link>
          </nav>

          <div className="ml-auto flex shrink-0 items-center gap-1.5 sm:gap-2">
            <div ref={langRef} className="relative z-[110]">
              <button
                type="button"
                onClick={() => setLangOpen((o) => !o)}
                className="flex min-h-[44px] items-center gap-1.5 rounded-full border-2 border-violet-200/80 bg-gradient-to-r from-white to-violet-50/90 px-2.5 py-2 text-[11px] font-semibold text-violet-950 shadow-md shadow-violet-200/40 transition hover:border-violet-300 hover:shadow-lg sm:px-3 touch-manipulation [-webkit-tap-highlight-color:transparent]"
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={dict.langMenuAria}
              >
                <LocaleFlag code={locale} />
                <span className="hidden max-w-[5.5rem] truncate sm:inline">{localeLabel(locale)}</span>
                <span className="text-[9px] tabular-nums text-violet-600 sm:text-[10px]" aria-hidden>
                  {langOpen ? "▲" : "▼"}
                </span>
              </button>
              {langOpen ? (
                <div
                  className="absolute right-0 z-[120] mt-1.5 w-44 rounded-2xl border border-violet-200/90 bg-white/98 p-1 text-[11px] shadow-xl shadow-violet-200/50 backdrop-blur-md"
                  role="listbox"
                >
                  {locales.map((l) => {
                    const active = l === locale;
                    return (
                      <div key={l} role="option" aria-selected={active}>
                        {active ? (
                          <span className="flex w-full items-center gap-2 rounded-xl bg-gradient-to-r from-violet-100 to-fuchsia-100 px-2.5 py-2 font-semibold text-violet-900">
                            <LocaleFlag code={l} />
                            <span>{localeLabel(l)}</span>
                          </span>
                        ) : (
                          <Link
                            href={pathForLocale(l)}
                            hrefLang={l}
                            className="flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-slate-700 transition hover:bg-violet-50 hover:text-violet-900"
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

            <span className="inline-block h-5 w-px shrink-0 bg-violet-200/90 md:hidden" aria-hidden />

            <button
              type="button"
              className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl border border-rose-200/90 bg-white text-[#e11d48] shadow-sm md:hidden touch-manipulation [-webkit-tap-highlight-color:transparent]"
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
            className="absolute left-0 right-0 top-full z-[95] max-h-[min(70vh,520px)] overflow-y-auto overflow-x-hidden border-t border-rose-100 bg-white py-3 shadow-lg shadow-rose-100/50 md:hidden"
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
                {dict.heroCallUs}
              </a>
            </div>
          </nav>
        ) : null}
      </div>
    </header>
  );
}

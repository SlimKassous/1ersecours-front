import Link from "next/link";

import type { BootstrapAddress } from "@/lib/siteBootstrap";
import { getDictionary, type Locale } from "@/lib/i18n";
import { successDsUrl } from "@/lib/successDsLinks";

type Props = {
  locale: Locale;
  addresses: BootstrapAddress[];
  phoneTel: string;
  phoneDisplay: string;
  landlineDisplay?: string | null;
  mainSiteUrl: string;
};

export function SiteFooter({
  locale,
  addresses,
  phoneTel,
  phoneDisplay,
  landlineDisplay,
  mainSiteUrl,
}: Props) {
  const dict = getDictionary(locale);
  const primary = addresses[0];
  const mapsQuery =
    primary?.rue?.trim() ||
    primary?.ville?.trim() ||
    dict.locationAddress;

  const mapsHref =
    "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent(mapsQuery);

  const sectionTitleClass =
    "fa-display border-l-[3px] border-[#f43f5e] pl-3 text-sm font-extrabold uppercase tracking-[0.12em] text-neutral-950";

  return (
    <footer className="mt-16 overflow-hidden rounded-3xl border border-rose-100/90 bg-gradient-to-b from-white via-rose-50/20 to-fuchsia-50/30 py-10 shadow-[0_20px_50px_rgba(244,63,94,0.08)] sm:mt-20 md:mt-24">
      <div className="grid grid-cols-1 gap-10 px-4 sm:grid-cols-2 sm:px-5 lg:grid-cols-12 lg:gap-8 md:px-6">
        <div className="lg:col-span-4">
          <p className="fa-display bg-gradient-to-r from-[#0b1229] via-[#f43f5e] to-[#8b5cf6] bg-clip-text text-base font-extrabold leading-tight text-transparent sm:text-lg">
            {dict.brand}
          </p>
          <p className="fa-display mt-3 max-w-md text-sm font-bold leading-relaxed text-neutral-800 sm:text-base">
            {dict.footerTagline}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            <span className="fa-display text-xs font-extrabold uppercase tracking-wider text-neutral-900">
              {dict.footerSocialsLabel}
            </span>
            <div className="flex flex-wrap gap-2">
              <a
                href="https://wa.me/41764414976"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200/80 bg-white text-emerald-600 shadow-sm transition hover:scale-105 hover:shadow-md"
                aria-label="WhatsApp"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/@success.drivingschool?_t=ZN-90NabfecqzG&_r=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-200/80 bg-white text-rose-600 shadow-sm transition hover:scale-105 hover:shadow-md"
                aria-label="TikTok"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.37 6.37 0 00-1-.1A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/success.drivingschool?igsh=NzR0MTZ2bjFnaWlh&utm_source=qr"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-pink-200/80 bg-white text-pink-600 shadow-sm transition hover:scale-105 hover:shadow-md"
                aria-label="Instagram"
              >
                <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="lg:col-span-3">
          <p className={sectionTitleClass}>{dict.navLocation}</p>
          {addresses.length > 0 ? (
            <ul className="mt-4 space-y-4 text-sm">
              {addresses.map((a) => (
                <li
                  key={a.id}
                  className="rounded-xl border border-rose-100/80 bg-white/90 p-3.5 shadow-md shadow-rose-100/50"
                >
                  <p className="fa-display font-extrabold text-neutral-950">{a.ville}</p>
                  <p className="mt-1 text-sm font-bold leading-snug text-neutral-800">{a.service}</p>
                  <p className="mt-2 font-bold leading-snug text-neutral-900">{a.rue}</p>
                </li>
              ))}
            </ul>
          ) : (
            <>
              <p className="mt-4 text-sm font-bold text-neutral-900">{dict.locationAddress}</p>
              <p className="text-sm font-bold text-neutral-800">{dict.locationCity}</p>
            </>
          )}
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="fa-btn-primary mt-5 inline-flex min-h-[48px] w-full max-w-sm items-center justify-center rounded-full px-4 py-3 text-sm font-bold touch-manipulation sm:w-auto"
          >
            {dict.mapLinkLabel}
          </a>
        </div>
        <div className="lg:col-span-2">
          <p className={sectionTitleClass}>{dict.navReserve}</p>
          <a
            href={`tel:${phoneTel.replace(/\s/g, "")}`}
            className="fa-display mt-4 inline-flex min-h-[44px] items-center text-lg font-extrabold tracking-tight text-neutral-950 touch-manipulation"
          >
            {phoneDisplay}
          </a>
          {landlineDisplay ? (
            <p className="mt-1 text-sm font-bold text-neutral-800">{landlineDisplay}</p>
          ) : null}
          <div className="mt-4 flex flex-col gap-2 text-sm">
            <Link
              href={`/${locale}/reservation`}
              className="inline-flex min-h-[44px] items-center text-base font-extrabold text-[#be123c] hover:text-[#9f1239]"
            >
              {dict.navReserve}
            </Link>
            <a
              href={mainSiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center text-base font-bold text-neutral-800 underline decoration-rose-200 decoration-2 underline-offset-[5px] hover:text-neutral-950"
            >
              {dict.footerMainSite}
            </a>
          </div>
        </div>
        <div className="lg:col-span-3">
          <p className={sectionTitleClass}>{dict.footerSeoTitle}</p>
          <p className="fa-display mt-4 text-sm font-bold leading-relaxed text-neutral-800 sm:text-base">
            {dict.footerSeoIntro}
          </p>
          <ul className="mt-5 flex flex-col gap-0.5 text-sm">
            {dict.footerSeoLinks.map((item) => (
              <li key={item.path + item.label}>
                <a
                  href={successDsUrl(locale, item.path)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="fa-display inline-flex min-h-[42px] items-center font-bold text-neutral-900 underline decoration-rose-300 decoration-2 underline-offset-[5px] transition hover:text-[#be123c]"
                >
                  {item.label} →
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className="fa-display mx-4 mt-10 border-t border-rose-200/90 pt-6 text-center text-sm font-bold text-neutral-700 sm:mx-5 sm:text-left md:mx-6">
        {dict.footerRights}
      </p>
    </footer>
  );
}

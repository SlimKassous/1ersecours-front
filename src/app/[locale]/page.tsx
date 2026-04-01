import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AddressLocationCards } from "@/components/AddressLocationCards";
import { getFirstAidHeroPricing } from "@/lib/firstAidPricing";
import { getDictionary, isLocale, type Locale } from "@/lib/i18n";
import { loadSiteBootstrap } from "@/lib/siteBootstrap";
import { successDsUrl } from "@/lib/successDsLinks";

/** Visuels officiels successdriving : `secours.webp`, `first-aid-bg.webp` (comme success-ds.ch). */
const IMG_SECOURS = "/images/secours.webp";
const IMG_FIRST_AID_BG = "/images/first-aid-bg.webp";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: param } = await params;
  if (!isLocale(param)) notFound();
  const locale = param as Locale;
  const dict = getDictionary(locale);
  const [{ addresses, siteInfo }, pricing] = await Promise.all([
    loadSiteBootstrap(),
    getFirstAidHeroPricing(locale),
  ]);
  const tel = siteInfo.phone.phoneNumber.replace(/\s/g, "");
  const mainDs = successDsUrl(locale, "/");

  const stats = [
    { v: dict.statHoursValue, l: dict.statHoursLabel },
    { v: dict.statRecognizedValue, l: dict.statRecognizedLabel },
    { v: dict.statSecureValue, l: dict.statSecureLabel },
    { v: dict.statOnlineValue, l: dict.statOnlineLabel },
  ];

  const audienceObjectPosition = ["object-center", "object-center", "object-center"] as const;

  return (
    <div className="flex flex-col gap-14 sm:gap-16 md:gap-20 lg:gap-24">
      <section className="relative grid grid-cols-1 overflow-hidden rounded-[28px] border border-rose-100 bg-white shadow-[0_24px_60px_rgba(244,63,94,0.12)] lg:grid-cols-2 lg:min-h-[min(520px,85vh)]">
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] opacity-75 blur-2xl lg:-inset-10"
          style={{
            background: "conic-gradient(from 0deg, #f43f5e, #ec4899, #8b5cf6, #f43f5e)",
          }}
          aria-hidden
        />
        <div className="relative z-10 flex flex-col justify-center gap-5 px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-rose-600/90 sm:text-xs">
            {dict.heroKicker}
          </p>
          <h1 className="fa-display text-4xl font-black leading-[1.05] tracking-tight text-neutral-950 sm:text-5xl md:text-[2.75rem]">
            {dict.heroTitleLead}
            <span className="mt-1 block bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] bg-clip-text text-[0.92em] font-bold text-transparent sm:mt-2">
              {dict.heroTitleAccent}
            </span>
          </h1>
          <p className="fa-display max-w-lg text-base font-semibold leading-relaxed text-neutral-800 sm:text-lg">
            {dict.heroSubtitleBefore}
            <a
              href={mainDs}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#e11d48] underline decoration-rose-300 decoration-2 underline-offset-4 hover:text-[#be123c]"
            >
              {dict.heroSubtitleLink}
            </a>
            {dict.heroSubtitleAfter}
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={`/${locale}/reservation`}
              className="fa-btn-primary inline-flex min-h-[48px] items-center justify-center rounded-2xl px-7 py-3.5 text-center text-sm font-bold sm:text-base touch-manipulation"
            >
              {dict.heroCta}
            </Link>
            <a
              href={`tel:${tel}`}
              className="inline-flex min-h-[48px] items-center justify-center rounded-2xl border-2 border-[#f43f5e]/45 bg-white px-6 py-3.5 text-center text-sm font-bold text-[#be123c] shadow-sm hover:bg-rose-50 sm:text-base touch-manipulation"
            >
              {dict.heroCallUs}
            </a>
            <Link
              href="#programme"
              className="inline-flex min-h-[48px] items-center justify-center text-center text-sm font-semibold text-neutral-700 underline decoration-rose-200 decoration-2 underline-offset-4 sm:text-base touch-manipulation"
            >
              {dict.heroSecondary}
            </Link>
          </div>
          <p className="fa-display text-xs font-bold text-neutral-700">{dict.heroBadge}</p>
        </div>
        <div className="relative min-h-[260px] w-full lg:min-h-0">
          <Image
            src={IMG_SECOURS}
            alt=""
            fill
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-rose-950/80 to-transparent p-4 sm:p-6">
            <div className="inline-block max-w-[min(100%,22rem)] rounded-xl bg-neutral-950 px-4 py-3 text-white shadow-lg">
              {pricing ? (
                <>
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                    {pricing.hasPromo ? (
                      <span
                        className="fa-display text-base font-bold tabular-nums line-through opacity-65 sm:text-lg"
                        aria-hidden
                      >
                        {locale === "fr"
                          ? `${pricing.listPrice} CHF`
                          : `CHF ${pricing.listPrice}`}
                      </span>
                    ) : null}
                    <p className="fa-display text-xl font-extrabold tracking-tight tabular-nums sm:text-2xl">
                      {locale === "fr"
                        ? `Dès ${pricing.payPrice} CHF`
                        : `From CHF ${pricing.payPrice}`}
                    </p>
                  </div>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-200 sm:text-xs">
                    {dict.heroPriceLine2}
                  </p>
                </>
              ) : (
                <>
                  <p className="fa-display text-xl font-extrabold tracking-tight sm:text-2xl">
                    {dict.heroPriceLine1}
                  </p>
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-wider text-rose-200 sm:text-xs">
                    {dict.heroPriceLine2}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-label={dict.sectionWhy}
        className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4"
      >
        {stats.map((s) => (
          <div
            key={s.v + s.l}
            className="rounded-2xl border border-rose-100 bg-white p-4 text-center shadow-md shadow-rose-100/30 sm:p-5"
          >
            <p className="fa-display bg-gradient-to-br from-[#f43f5e] to-[#8b5cf6] bg-clip-text text-xl font-extrabold tracking-tight text-transparent sm:text-2xl md:text-3xl">
              {s.v}
            </p>
            <p className="fa-display mt-1 text-xs font-semibold text-neutral-800 sm:text-sm">{s.l}</p>
          </div>
        ))}
      </section>

      <section id="why" className="scroll-mt-28">
        <h2 className="fa-display text-xl font-extrabold text-neutral-950 sm:text-2xl md:text-3xl">
          {dict.sectionWhy}
        </h2>
        <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {dict.whyItems.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-rose-100 bg-white p-5 text-sm leading-relaxed text-neutral-700 shadow-md shadow-rose-100/25 sm:p-6 sm:text-base"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="programme" className="scroll-mt-28">
        <h2 className="fa-display text-xl font-extrabold text-neutral-950 sm:text-2xl md:text-3xl">
          {dict.sectionProgramme}
        </h2>
        <p className="fa-display mt-3 max-w-2xl text-sm font-semibold text-neutral-800 sm:text-base">
          {dict.programmeIntro}
        </p>
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dict.programmeItems.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-md shadow-rose-100/20 sm:p-6"
            >
              <span className="fa-display flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f43f5e]/15 via-[#ec4899]/15 to-[#8b5cf6]/25 text-sm font-black text-[#be123c]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="font-bold text-neutral-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-600">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={dict.sectionVisual}>
        <h2 className="fa-display text-xl font-extrabold text-neutral-950 sm:text-2xl md:text-3xl">
          {dict.sectionVisual}
        </h2>
        <p className="fa-display mt-2 max-w-2xl text-sm font-semibold text-neutral-800">
          {locale === "fr"
            ? "Visuels officiels Success Driving — premiers secours (success-ds.ch)."
            : "Official Success Driving first aid visuals (success-ds.ch)."}
        </p>
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-xl shadow-rose-200/35 md:aspect-[4/3]">
            <Image
              src={IMG_SECOURS}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="relative aspect-[16/11] overflow-hidden rounded-2xl border border-fuchsia-100 bg-white shadow-xl shadow-fuchsia-200/30 md:aspect-[4/3]">
            <Image
              src={IMG_FIRST_AID_BG}
              alt=""
              fill
              className="object-cover object-center"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </section>

      <section id="audience" className="scroll-mt-28">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-rose-400">
          — {dict.audienceSectionEyebrow}
        </p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="fa-display text-xl font-extrabold text-neutral-950 sm:text-2xl md:text-3xl">
              {dict.sectionAudience}{" "}
              <span className="mt-1 block font-serif text-xl font-normal italic text-rose-800 sm:mt-0 sm:inline sm:text-2xl md:text-3xl">
                {dict.audienceSubtitle}
              </span>
            </h2>
          </div>
          <p className="fa-display max-w-md text-sm font-semibold leading-relaxed text-neutral-800 md:text-right">
            {dict.audienceIntro}
          </p>
        </div>
        <ul className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-6">
          {dict.audienceItems.map((item, idx) => (
            <li
              key={item.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-lg shadow-rose-100/40"
            >
              <div className="relative aspect-[16/10] w-full bg-rose-50">
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  className={`object-cover ${audienceObjectPosition[idx] ?? "object-center"}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#e11d48]">
                  {item.category}
                </p>
                <h3 className="fa-display mt-2 text-lg font-extrabold text-neutral-950">
                  {item.title}
                </h3>
                <p className="fa-display mt-2 flex-1 text-sm font-semibold leading-relaxed text-neutral-800">
                  {item.body}
                </p>
                <Link
                  href={`/${locale}/reservation`}
                  className="mt-4 inline-flex font-bold text-[#be123c] underline decoration-rose-300 decoration-2 underline-offset-4 hover:text-[#9f1239]"
                >
                  {dict.audienceCta} →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="location" className="scroll-mt-28">
        <h2 className="fa-display text-xl font-extrabold text-neutral-950 sm:text-2xl md:text-3xl">
          {dict.sectionLocation}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-neutral-600 sm:text-base">{dict.locationBody}</p>
        {addresses.length > 0 ? (
          <AddressLocationCards
            addresses={addresses}
            mapLinkLabel={dict.mapLinkLabel}
            transportLabel={dict.locationTransportLabel}
          />
        ) : (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-lg shadow-rose-100/30 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="font-semibold text-neutral-900">{dict.locationAddress}</p>
              <p className="fa-display mt-1 text-sm font-semibold text-neutral-800">{dict.locationCity}</p>
            </div>
            <a
              href={
                "https://www.google.com/maps/search/?api=1&query=" +
                encodeURIComponent(dict.locationAddress)
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center rounded-2xl border-2 border-[#f43f5e]/40 bg-rose-50 px-5 py-3 text-sm font-bold text-[#be123c] hover:bg-rose-100 touch-manipulation"
            >
              {dict.mapLinkLabel}
            </a>
          </div>
        )}
        <div className="mt-6 flex flex-wrap items-center gap-4 rounded-2xl border border-[#f43f5e]/20 bg-gradient-to-r from-rose-50 to-fuchsia-50/80 px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-neutral-800">
            {locale === "fr" ? "Besoin d'aide ?" : "Need help?"}
          </p>
          <a
            href={`tel:${tel}`}
            className="inline-flex min-h-[44px] items-center rounded-xl bg-white px-4 py-2 text-sm font-bold text-[#be123c] shadow-md shadow-rose-200/50 ring-1 ring-rose-100 touch-manipulation"
          >
            {siteInfo.phone.formattedPhoneNumber}
          </a>
        </div>
      </section>

      <section
        className="relative overflow-hidden rounded-3xl border-2 border-[#f43f5e]/25 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50 p-6 shadow-xl shadow-rose-200/40 sm:p-8 md:p-10"
        aria-label={dict.ctaBandTitle}
      >
        <div
          className="pointer-events-none absolute -right-20 -top-20 h-52 w-52 rounded-full bg-[#ec4899]/20 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#8b5cf6]/20 blur-3xl"
          aria-hidden
        />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="max-w-xl">
            <h2 className="fa-display text-xl font-extrabold text-neutral-900 sm:text-2xl">
              {dict.ctaBandTitle}
            </h2>
            <p className="fa-display mt-3 text-sm font-semibold leading-relaxed text-neutral-800 sm:text-base">
              {dict.ctaBandBody}
            </p>
          </div>
          <Link
            href={`/${locale}/reservation`}
            className="fa-btn-primary relative inline-flex min-h-[52px] w-full shrink-0 items-center justify-center rounded-2xl px-8 py-3.5 text-center text-sm font-bold sm:w-auto sm:min-w-[220px] touch-manipulation"
          >
            {dict.ctaBandButton}
          </Link>
        </div>
      </section>
    </div>
  );
}

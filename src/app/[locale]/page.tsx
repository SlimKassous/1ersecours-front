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
const IMG_OFFICIAL_SITE_CAPTURE = "/images/official-site-capture.png";

function IconPermit({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
      <rect x="3" y="4" width="18" height="14" rx="2.5" />
      <path d="M7 9h6M7 13h4" strokeLinecap="round" />
      <circle cx="17.5" cy="13.5" r="3.5" />
      <path d="M17.5 11.7v1.9l1.2 1.1" strokeLinecap="round" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.8v4.7l3 1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconHourglass({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} aria-hidden>
      <path d="M7 3h10M7 21h10" strokeLinecap="round" />
      <path d="M8 3c0 4 3 5 4 6-1 1-4 2-4 6M16 3c0 4-3 5-4 6 1 1 4 2 4 6" />
    </svg>
  );
}

function IconCpr({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="9" cy="7" r="2.6" />
      <path d="M11 10.3l2.2 2.2M6.8 12.8l2.2-2.2M4 18h16" strokeLinecap="round" />
      <path d="M8.1 16.8l.9-3 2.3 1.7.7 2.3M16.8 12.6a2.2 2.2 0 100 4.4 2.2 2.2 0 000-4.4z" />
    </svg>
  );
}

function IconLanguage({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
      <circle cx="12" cy="12" r="8.8" />
      <path d="M3.8 12h16.4M12 3.2c2.3 2.4 3.6 5.5 3.6 8.8S14.3 18.4 12 20.8M12 3.2C9.7 5.6 8.4 8.7 8.4 12s1.3 6.4 3.6 8.8" />
    </svg>
  );
}

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

  const highlights = [
    {
      id: "permit",
      title: locale === "fr" ? "Obligatoire pour le permis" : "Required for driving licence",
      body:
        locale === "fr"
          ? "Cours Samaritains reconnu pour s'inscrire au permis."
          : "Recognized Samaritan course required before licence registration.",
      Icon: IconPermit,
    },
    {
      id: "hours",
      title: locale === "fr" ? "10h de cours" : "10 hours training",
      body:
        locale === "fr"
          ? "Reparties sur week-end ou en soiree."
          : "Split across weekend or evening sessions.",
      Icon: IconClock,
    },
    {
      id: "validity",
      title: locale === "fr" ? "Valable 6 ans" : "Valid for 6 years",
      body:
        locale === "fr"
          ? "Certificat valable dans toute la Suisse."
          : "Certificate valid across Switzerland.",
      Icon: IconHourglass,
    },
    {
      id: "practice",
      title: locale === "fr" ? "Theorie et pratique" : "Theory and practice",
      body:
        locale === "fr"
          ? "Mises en situation concretes avec encadrement."
          : "Real scenarios with practical coaching.",
      Icon: IconCpr,
    },
    {
      id: "lang",
      title: locale === "fr" ? "Cours FR / EN" : "Courses in FR / EN",
      body:
        locale === "fr"
          ? "Formation accessible selon votre langue."
          : "Training delivered in your preferred language.",
      Icon: IconLanguage,
    },
  ] as const;

  const audienceObjectPosition = ["object-center", "object-center", "object-center"] as const;

  return (
    <div className="flex flex-col gap-16 sm:gap-20 md:gap-24 lg:gap-28">
      <section className="relative grid grid-cols-1 overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] sm:rounded-[28px] lg:grid-cols-2 lg:min-h-[620px]">
        <div
          className="pointer-events-none absolute -inset-6 -z-10 rounded-[36px] opacity-45 blur-2xl lg:-inset-10"
          style={{
            background: "conic-gradient(from 0deg, #f43f5e, #ffffff, #8b5cf6, #f43f5e)",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full border-[12px] border-rose-200/70 opacity-60" aria-hidden />
        <div className="pointer-events-none absolute bottom-6 right-6 hidden h-16 w-16 rounded-2xl border-2 border-violet-200/70 bg-white/40 lg:block" aria-hidden />
        <div className="relative z-10 flex flex-col justify-center gap-6 px-5 py-8 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-rose-600/90 sm:text-sm">
            {dict.heroKicker}
          </p>
          <h1 className="fa-display text-[2.45rem] font-black leading-[1.02] tracking-tight text-neutral-950 sm:text-5xl md:text-[3.25rem] lg:text-[4.25rem]">
            {dict.heroTitleLead}
            <span className="mt-1 block bg-gradient-to-r from-[#f43f5e] to-[#8b5cf6] bg-clip-text text-[0.9em] font-black text-transparent sm:mt-2">
              {dict.heroTitleAccent}
            </span>
          </h1>
          <p className="fa-display max-w-2xl text-lg font-semibold leading-relaxed text-neutral-800 sm:text-xl lg:text-[1.35rem]">
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
          <div className="flex flex-col gap-3.5 sm:flex-row sm:flex-wrap">
            <Link
              href={`/${locale}/reservation`}
              className="fa-btn-primary inline-flex min-h-[54px] items-center justify-center rounded-2xl px-8 py-4 text-center text-base font-extrabold sm:text-lg touch-manipulation"
            >
              {dict.heroCta}
            </Link>
            <a
              href={`tel:${tel}`}
              className="inline-flex min-h-[54px] items-center justify-center rounded-2xl border-2 border-[#f43f5e]/45 bg-white px-7 py-4 text-center text-base font-extrabold text-[#be123c] shadow-sm hover:bg-rose-50 sm:text-lg touch-manipulation"
            >
              {dict.heroCallUs}
            </a>
            <Link
              href="#programme"
              className="inline-flex min-h-[54px] items-center justify-center text-center text-base font-bold text-neutral-700 underline decoration-rose-200 decoration-2 underline-offset-4 sm:text-lg touch-manipulation"
            >
              {dict.heroSecondary}
            </Link>
          </div>
          <p className="fa-display text-sm font-bold text-neutral-700">{dict.heroBadge}</p>
        </div>
        <div className="relative min-h-[320px] w-full sm:min-h-[380px] lg:min-h-0">
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

      <section aria-label={dict.sectionWhy} className="relative overflow-hidden rounded-3xl border border-rose-200/70 bg-white p-5 shadow-[0_18px_45px_rgba(244,63,94,0.12)] sm:p-7 lg:p-9">
        <div className="pointer-events-none absolute -left-10 top-8 h-24 w-24 rounded-full border-8 border-rose-100" aria-hidden />
        <div className="pointer-events-none absolute -right-8 bottom-6 h-20 w-20 rounded-xl border-4 border-violet-100" aria-hidden />
        <p className="fa-display text-center text-lg font-extrabold tracking-tight text-neutral-900 lg:text-[1.35rem]">
          {locale === "fr"
            ? 'Le cours "Samaritains" pour le permis de conduire, version Success Driving.'
            : 'Samaritan first-aid course for driving licence, by Success Driving.'}
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {highlights.map((s) => (
          <div
            key={s.id}
            className="rounded-2xl border border-rose-100 bg-gradient-to-b from-white via-white to-rose-50/70 p-5 text-center shadow-[0_10px_30px_rgba(244,63,94,0.10)] sm:p-6 lg:p-7"
          >
            <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-slate-200 bg-white text-[#be123c] shadow-sm lg:h-20 lg:w-20">
              <s.Icon className="h-8 w-8 lg:h-10 lg:w-10" />
            </span>
            <p className="fa-display mt-3 text-xl font-black text-[#9f1239] lg:text-[1.45rem]">{s.title}</p>
            <p className="mt-2 text-[1.03rem] font-bold leading-relaxed text-neutral-800">{s.body}</p>
          </div>
        ))}
        </div>
      </section>

      <section id="why" className="scroll-mt-28">
        <h2 className="fa-display bg-gradient-to-r from-black via-[#be123c] to-[#8b5cf6] bg-clip-text text-3xl font-black text-transparent sm:text-4xl md:text-[2.9rem] lg:text-[3.2rem]">
          {dict.sectionWhy}
        </h2>
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {dict.whyItems.map((item) => (
            <li
              key={item}
              className="rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/60 p-6 text-[1.03rem] font-semibold leading-relaxed text-neutral-900 shadow-md shadow-rose-100/50 sm:p-7 sm:text-[1.12rem]"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      <section id="programme" className="scroll-mt-28">
        <h2 className="fa-display bg-gradient-to-r from-black via-[#be123c] to-[#8b5cf6] bg-clip-text text-3xl font-black text-transparent sm:text-4xl md:text-[2.9rem] lg:text-[3.2rem]">
          {dict.sectionProgramme}
        </h2>
        <p className="fa-display mt-4 max-w-3xl text-lg font-bold leading-relaxed text-neutral-900 sm:text-xl lg:text-[1.32rem]">
          {dict.programmeIntro}
        </p>
        <ul className="mt-9 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 xl:gap-6">
          {dict.programmeItems.map((item, i) => (
            <li
              key={item.title}
              className="flex gap-5 rounded-2xl border border-rose-100 bg-gradient-to-br from-white to-rose-50/60 p-6 shadow-md shadow-rose-100/40 sm:p-7"
            >
              <span className="fa-display flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#f43f5e]/15 via-[#ec4899]/15 to-[#8b5cf6]/25 text-base font-black text-[#be123c]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h3 className="text-xl font-extrabold text-neutral-950 lg:text-[1.35rem]">{item.title}</h3>
                <p className="mt-2.5 text-[1.03rem] font-semibold leading-relaxed text-neutral-800 lg:text-[1.12rem]">{item.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-label={dict.sectionVisual}>
        <h2 className="fa-display bg-gradient-to-r from-black via-[#be123c] to-[#8b5cf6] bg-clip-text text-3xl font-black text-transparent sm:text-4xl md:text-[2.9rem] lg:text-[3.2rem]">
          {dict.sectionVisual}
        </h2>
        <p className="fa-display mt-3 max-w-3xl text-lg font-bold leading-relaxed text-neutral-900 sm:text-xl">
          {dict.sectionVisualLead}
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="inline-flex min-h-[36px] items-center rounded-full border border-rose-200 bg-rose-50 px-4 py-1 text-sm font-bold text-rose-700 animate-[pulse_2.8s_ease-in-out_infinite]">
            {dict.sectionVisualBadgePrimary}
          </span>
          <span className="inline-flex min-h-[36px] items-center rounded-full border border-violet-200 bg-violet-50 px-4 py-1 text-sm font-bold text-violet-700">
            {dict.sectionVisualBadgeSecondary}
          </span>
          <a
            href={mainDs}
            target="_blank"
            rel="noopener noreferrer"
            className="fa-btn-primary inline-flex min-h-[44px] items-center justify-center rounded-full px-5 py-2 text-sm font-extrabold sm:text-base"
          >
            {dict.sectionVisualOfficialCta}
          </a>
        </div>
        <div className="mt-9 grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-7">
          <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 sm:rounded-2xl md:aspect-[16/10]">
            <Image
              src={IMG_SECOURS}
              alt=""
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
              <p className="text-sm font-bold text-white sm:text-base">
                Success Driving - First Aid
              </p>
            </div>
          </div>
          <div className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-md transition-transform duration-300 hover:-translate-y-1 sm:rounded-2xl md:aspect-[16/10]">
            <Image
              src={IMG_OFFICIAL_SITE_CAPTURE}
              alt=""
              fill
              className="object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/55 to-transparent p-4">
              <p className="text-sm font-bold text-white sm:text-base">
                {locale === "fr" ? "Plateforme officielle: success-ds.ch" : "Official platform: success-ds.ch"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="audience" className="scroll-mt-28">
        <p className="text-sm font-black uppercase tracking-[0.2em] text-rose-600">
          — {dict.audienceSectionEyebrow}
        </p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="fa-display text-3xl font-black text-neutral-950 sm:text-4xl md:text-[2.9rem] lg:text-[3.2rem]">
              {dict.sectionAudience}{" "}
              <span className="mt-1 block font-serif text-3xl font-semibold italic text-rose-700 sm:mt-0 sm:inline sm:text-4xl md:text-[2.9rem]">
                {dict.audienceSubtitle}
              </span>
            </h2>
          </div>
          <p className="fa-display max-w-2xl text-lg font-bold leading-relaxed text-neutral-900 md:text-right lg:text-xl">
            {dict.audienceIntro}
          </p>
        </div>
        <ul className="mt-9 grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-7">
          {dict.audienceItems.map((item, idx) => (
            <li
              key={item.title}
              className="flex flex-col overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-md shadow-rose-100/40"
            >
              <div className="relative aspect-[4/3] w-full bg-slate-100 sm:aspect-[16/10]">
                <Image
                  src={item.imageSrc}
                  alt=""
                  fill
                  className={`object-cover ${audienceObjectPosition[idx] ?? "object-center"}`}
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-6 sm:p-7">
                <p className="text-xs font-bold uppercase tracking-wider text-[#e11d48]">
                  {item.category}
                </p>
                <h3 className="fa-display mt-2 text-2xl font-black text-neutral-950 lg:text-[1.75rem]">
                  {item.title}
                </h3>
                <p className="fa-display mt-3 flex-1 text-[1.03rem] font-semibold leading-relaxed text-neutral-900 lg:text-[1.12rem]">
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
        <h2 className="fa-display bg-gradient-to-r from-black via-[#be123c] to-[#8b5cf6] bg-clip-text text-3xl font-black text-transparent sm:text-4xl md:text-[2.9rem] lg:text-[3.2rem]">
          {dict.sectionLocation}
        </h2>
        <p className="mt-4 max-w-3xl text-lg font-semibold leading-relaxed text-neutral-900 sm:text-xl">{dict.locationBody}</p>
        {addresses.length > 0 ? (
          <AddressLocationCards
            addresses={addresses}
            mapLinkLabel={dict.mapLinkLabel}
            transportLabel={dict.locationTransportLabel}
          />
        ) : (
          <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-rose-100 bg-white p-5 shadow-md shadow-rose-100/40 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <p className="text-lg font-bold text-neutral-950">{dict.locationAddress}</p>
              <p className="fa-display mt-1 text-base font-bold text-neutral-900">{dict.locationCity}</p>
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
        <div className="mt-7 flex flex-wrap items-center gap-4 rounded-2xl border border-[#f43f5e]/20 bg-gradient-to-r from-white to-rose-50/70 px-5 py-5 sm:px-7">
          <p className="text-base font-semibold text-neutral-800">
            {locale === "fr" ? "Besoin d'aide ?" : "Need help?"}
          </p>
          <a
            href={`tel:${tel}`}
            className="inline-flex min-h-[48px] items-center rounded-xl bg-white px-5 py-2.5 text-base font-bold text-[#be123c] shadow-md shadow-rose-200/50 ring-1 ring-rose-100 touch-manipulation"
          >
            {siteInfo.phone.formattedPhoneNumber}
          </a>
        </div>
      </section>

      <section
        className="relative overflow-hidden rounded-3xl border-2 border-[#f43f5e]/20 bg-gradient-to-br from-white via-white to-rose-50/60 p-7 shadow-lg shadow-slate-200/50 sm:p-9 md:p-11"
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
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between lg:gap-9">
          <div className="max-w-3xl">
            <h2 className="fa-display text-3xl font-black text-neutral-900 sm:text-4xl lg:text-[3.05rem]">
              {dict.ctaBandTitle}
            </h2>
            <p className="fa-display mt-3 text-lg font-bold leading-relaxed text-neutral-900 sm:text-xl">
              {dict.ctaBandBody}
            </p>
          </div>
          <Link
            href={`/${locale}/reservation`}
            className="fa-btn-primary relative inline-flex min-h-[56px] w-full shrink-0 items-center justify-center rounded-2xl px-9 py-4 text-center text-base font-extrabold sm:w-auto sm:min-w-[260px] sm:text-lg touch-manipulation"
          >
            {dict.ctaBandButton}
          </Link>
        </div>
      </section>

    </div>
  );
}

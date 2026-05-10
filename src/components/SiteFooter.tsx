import Link from "next/link";

import type { BootstrapAddress } from "@/lib/siteBootstrap";
import { getDictionary, type Locale } from "@/lib/i18n";

type Props = {
  locale: Locale;
  addresses: BootstrapAddress[];
  phoneTel: string;
  phoneDisplay: string;
  landlineDisplay?: string | null;
  mainSiteUrl: string;
};

function getMapsUrl(address: BootstrapAddress): string {
  const query = [address.rue, address.ville].filter(Boolean).join(", ");
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query + ", Suisse")}`;
}

export function SiteFooter({
  locale,
  addresses,
  phoneTel,
  phoneDisplay,
  landlineDisplay,
  mainSiteUrl,
}: Props) {
  const dict = getDictionary(locale);
  const year = new Date().getFullYear();
  const isFr = locale === "fr";

  const description = isFr
    ? "La plateforme d'inscription aux cours Samaritains à Genève, organisée par Success Driving — l'auto-école officielle suisse pour le permis auto, moto, théorie et premiers secours."
    : "The online booking platform for Samaritan first-aid courses in Geneva, powered by Success Driving — Switzerland's official driving school for car, motorbike, theory and first-aid licences.";

  return (
    <footer className="relative mt-12 w-full overflow-hidden sm:mt-16">
      {/* Top gradient line */}
      <div
        className="h-[3px] w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #f43f5e 25%, #ec4899 50%, #8b5cf6 75%, transparent 100%)",
        }}
      />

      {/* Main body */}
      <div
        style={{
          background:
            "linear-gradient(165deg, #0b1229 0%, #10172e 55%, #130d24 100%)",
        }}
      >
        {/* Decorative blobs */}
        <div
          className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full blur-3xl"
          style={{ background: "rgba(244,63,94,0.06)" }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-20 right-0 h-72 w-72 rounded-full blur-3xl"
          style={{ background: "rgba(139,92,246,0.07)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-12">

            {/* ── Col 1 : Brand + Description ── */}
            <div className="flex flex-col gap-5">
              <div>
                <p
                  className="text-lg font-black leading-tight tracking-tight text-white sm:text-xl"
                  style={{
                    background:
                      "linear-gradient(90deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  Success Driving
                  <br />
                  <span className="text-base font-bold text-white/90" style={{ WebkitTextFillColor: "rgba(255,255,255,0.9)" }}>
                    {isFr ? "Premiers Secours" : "First Aid"}
                  </span>
                </p>
              </div>

              <p className="max-w-sm text-sm font-medium leading-relaxed text-slate-400">
                {description}
              </p>

              {/* Socials */}
              <div className="flex items-center gap-2.5">
                {[
                  {
                    href: "https://wa.me/41764414976",
                    label: "WhatsApp",
                    color: "#25D366",
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.tiktok.com/@success.drivingschool?_t=ZN-90NabfecqzG&_r=1",
                    label: "TikTok",
                    color: "#FF0050",
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.37 6.37 0 00-1-.1A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.instagram.com/success.drivingschool?igsh=NzR0MTZ2bjFnaWlh&utm_source=qr",
                    label: "Instagram",
                    color: "#E1306C",
                    icon: (
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                      </svg>
                    ),
                  },
                ].map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-200 hover:scale-110 hover:border-white/25 hover:bg-white/10"
                    style={{ color: s.color }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2 : Locations ── */}
            <div className="flex flex-col gap-4">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-400">
                — {isFr ? "Nos lieux" : "Locations"}
              </p>

              {addresses.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {addresses.map((a) => (
                    <a
                      key={a.id}
                      href={getMapsUrl(a)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4 transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/5"
                    >
                      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15">
                        <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{a.ville}</p>
                        {a.service && (
                          <p className="text-xs font-medium text-slate-400">{a.service}</p>
                        )}
                        <p className="mt-0.5 text-xs font-semibold text-rose-300/80 underline-offset-2 group-hover:underline">
                          {a.rue}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              ) : (
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Chemin+du+23+Aout+4+Geneva+Suisse"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-start gap-3 rounded-xl border border-white/8 bg-white/4 p-4 transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/5"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15">
                    <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">Genève</p>
                    <p className="mt-0.5 text-xs font-semibold text-rose-300/80 group-hover:underline underline-offset-2">
                      Chemin du 23 Août 4, 1205 Genève
                    </p>
                  </div>
                </a>
              )}
            </div>

            {/* ── Col 3 : Contact + Reserve ── */}
            <div className="flex flex-col gap-5">
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-violet-400">
                — {isFr ? "Contact" : "Contact"}
              </p>

              <div className="flex flex-col gap-3">
                {/* Phone */}
                <a
                  href={`tel:${phoneTel}`}
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-violet-500/30 hover:bg-violet-500/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15">
                    <svg className="h-4 w-4 text-violet-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {isFr ? "Téléphone" : "Phone"}
                    </p>
                    <p className="text-sm font-bold text-white">{phoneDisplay}</p>
                    {landlineDisplay && (
                      <p className="text-xs text-slate-400">{landlineDisplay}</p>
                    )}
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:info@success-ds.ch"
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-pink-500/30 hover:bg-pink-500/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pink-500/15">
                    <svg className="h-4 w-4 text-pink-400" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Email</p>
                    <p className="text-sm font-bold text-white">info@success-ds.ch</p>
                  </div>
                </a>

                {/* Main site link */}
                <a
                  href={mainSiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3 transition-all duration-200 hover:border-rose-500/30 hover:bg-rose-500/5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500/15">
                    <svg className="h-4 w-4 text-rose-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                      <circle cx="12" cy="12" r="9" />
                      <path d="M3.6 9h16.8M3.6 15h16.8M12 3c2.7 2.8 4.2 6.3 4.2 9S14.7 18.2 12 21M12 3c-2.7 2.8-4.2 6.3-4.2 9S9.3 18.2 12 21" strokeLinecap="round" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {isFr ? "Site officiel" : "Official site"}
                    </p>
                    <p className="text-sm font-bold text-rose-300">success-ds.ch</p>
                  </div>
                </a>
              </div>

              {/* CTA Reserve */}
              <Link
                href={`/${locale}/reservation`}
                className="mt-1 inline-flex min-h-[46px] items-center justify-center rounded-xl px-6 py-3 text-sm font-extrabold text-white transition-all duration-200 hover:opacity-90 hover:shadow-lg"
                style={{
                  background:
                    "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
                  boxShadow: "0 8px 24px rgba(244,63,94,0.25)",
                }}
              >
                {isFr ? "S'inscrire maintenant →" : "Book now →"}
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/8 pt-6 sm:flex-row">
            <p className="text-xs font-medium text-slate-500">
              © {year} Success Driving School —{" "}
              {isFr ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <p className="text-xs font-medium text-slate-600">
              {isFr
                ? "Plateforme Premiers Secours • Genève, Suisse"
                : "First Aid Platform • Geneva, Switzerland"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

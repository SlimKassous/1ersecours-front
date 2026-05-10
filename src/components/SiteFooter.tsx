"use client";

import Link from "next/link";

import type { BootstrapAddress } from "@/lib/siteBootstrap";
import { type Locale } from "@/lib/i18n";

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
  const year = new Date().getFullYear();
  const isFr = locale === "fr";

  const description = isFr
    ? "École officielle à Genève pour auto, moto, théorie et premiers secours. Cours Samaritains reconnus OCV."
    : "Official driving school in Geneva for car, motorbike, theory and first aid. OCV-recognized Samaritan courses.";

  const cardStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "14px",
    padding: "14px 16px",
    transition: "all 0.2s ease",
    textDecoration: "none",
    color: "inherit",
  };

  return (
    <footer
      style={{
        width: "100%",
        position: "relative",
        overflow: "hidden",
        marginTop: "3rem",
      }}
    >
      {/* Gradient top border */}
      <div
        style={{
          height: "3px",
          width: "100%",
          background:
            "linear-gradient(90deg, transparent 0%, #f43f5e 20%, #ec4899 50%, #8b5cf6 80%, transparent 100%)",
        }}
      />

      {/* Dark body */}
      <div
        style={{
          background:
            "linear-gradient(160deg, #0b1229 0%, #0d1530 55%, #110b20 100%)",
          position: "relative",
        }}
      >
        {/* Decorative glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "-80px",
            left: "-80px",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            background: "rgba(244,63,94,0.07)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
          aria-hidden
        />
        <div
          style={{
            position: "absolute",
            bottom: "-60px",
            right: "-60px",
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "rgba(139,92,246,0.08)",
            filter: "blur(60px)",
            pointerEvents: "none",
          }}
          aria-hidden
        />

        <div
          style={{
            position: "relative",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "3rem 1.5rem 2rem",
          }}
        >
          {/* 3-column grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
              gap: "2.5rem",
            }}
          >
            {/* ── Col 1: Brand ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {/* Logo text */}
              <div>
                <p
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: 900,
                    lineHeight: 1.2,
                    background:
                      "linear-gradient(90deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    margin: 0,
                  }}
                >
                  Success Driving
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.7)",
                    margin: "2px 0 0",
                  }}
                >
                  {isFr ? "Premiers Secours — Genève" : "First Aid — Geneva"}
                </p>
              </div>

              {/* Description */}
              <p
                style={{
                  fontSize: "0.82rem",
                  color: "rgba(148,163,184,1)",
                  lineHeight: 1.65,
                  margin: 0,
                  maxWidth: "320px",
                }}
              >
                {description}
              </p>

              {/* Social icons */}
              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                {[
                  {
                    href: "https://wa.me/41764414976",
                    label: "WhatsApp",
                    color: "#25D366",
                    bg: "rgba(37,211,102,0.1)",
                    border: "rgba(37,211,102,0.25)",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.tiktok.com/@success.drivingschool?_t=ZN-90NabfecqzG&_r=1",
                    label: "TikTok",
                    color: "#ff2d55",
                    bg: "rgba(255,45,85,0.1)",
                    border: "rgba(255,45,85,0.25)",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64v-3.5a6.37 6.37 0 00-1-.1A6.34 6.34 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                      </svg>
                    ),
                  },
                  {
                    href: "https://www.instagram.com/success.drivingschool?igsh=NzR0MTZ2bjFnaWlh&utm_source=qr",
                    label: "Instagram",
                    color: "#E1306C",
                    bg: "rgba(225,48,108,0.1)",
                    border: "rgba(225,48,108,0.25)",
                    icon: (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
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
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "38px",
                      height: "38px",
                      borderRadius: "50%",
                      background: s.bg,
                      border: `1.5px solid ${s.border}`,
                      color: s.color,
                      textDecoration: "none",
                      transition: "transform 0.2s ease, box-shadow 0.2s ease",
                      flexShrink: 0,
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px) scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0) scale(1)";
                    }}
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* ── Col 2: Locations ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#f43f5e",
                  margin: 0,
                }}
              >
                — {isFr ? "Nos lieux" : "Locations"}
              </p>

              {(addresses.length > 0 ? addresses : [
                { id: 0, ville: "Genève", service: "Jonction", rue: "Chemin du 23 Août 4, 1205 Genève", transport: "", displayOrder: 0 }
              ]).map((a) => (
                <a
                  key={a.id}
                  href={getMapsUrl(a)}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    ...cardStyle,
                    flexDirection: "row",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(244,63,94,0.35)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.06)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                  }}
                >
                  {/* Map pin icon */}
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "34px",
                      height: "34px",
                      borderRadius: "10px",
                      background: "rgba(244,63,94,0.15)",
                      flexShrink: 0,
                      color: "#f43f5e",
                      marginTop: "2px",
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                    </svg>
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#fff" }}>
                      {a.ville}
                    </p>
                    {a.service && (
                      <p style={{ margin: "1px 0 0", fontSize: "0.75rem", color: "rgba(148,163,184,0.85)" }}>
                        {a.service}
                      </p>
                    )}
                    <p
                      style={{
                        margin: "3px 0 0",
                        fontSize: "0.78rem",
                        fontWeight: 600,
                        color: "#f87171",
                        textDecoration: "underline",
                        textUnderlineOffset: "3px",
                        wordBreak: "break-word",
                      }}
                    >
                      {a.rue}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            {/* ── Col 3: Contact ── */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <p
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: "#8b5cf6",
                  margin: 0,
                }}
              >
                — {isFr ? "Nous joindre" : "Get in touch"}
              </p>

              {/* Phone */}
              <a
                href={`tel:${phoneTel}`}
                style={{ ...cardStyle }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(139,92,246,0.35)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(139,92,246,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <span
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: "rgba(139,92,246,0.15)", flexShrink: 0, color: "#8b5cf6",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                  </svg>
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: "rgba(100,116,139,1)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {isFr ? "Téléphone" : "Phone"}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.9rem", fontWeight: 700, color: "#fff" }}>
                    {phoneDisplay}
                  </p>
                  {landlineDisplay && (
                    <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(148,163,184,0.8)" }}>
                      {landlineDisplay}
                    </p>
                  )}
                </div>
              </a>

              {/* Main site */}
              <a
                href={mainSiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...cardStyle }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(244,63,94,0.35)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(244,63,94,0.06)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.09)";
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)";
                }}
              >
                <span
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    width: "34px", height: "34px", borderRadius: "10px",
                    background: "rgba(244,63,94,0.15)", flexShrink: 0, color: "#f43f5e",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3.6 9h16.8M3.6 15h16.8" strokeLinecap="round" />
                    <path d="M12 3.2c2.5 2.7 4 6 4 8.8s-1.5 6.1-4 8.8M12 3.2c-2.5 2.7-4 6-4 8.8s1.5 6.1 4 8.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p style={{ margin: 0, fontSize: "0.7rem", fontWeight: 700, color: "rgba(100,116,139,1)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {isFr ? "École officielle" : "Official school"}
                  </p>
                  <p style={{ margin: "2px 0 0", fontSize: "0.9rem", fontWeight: 700, color: "#f87171" }}>
                    success-ds.ch →
                  </p>
                </div>
              </a>

              {/* Single CTA */}
              <Link
                href={`/${locale}/reservation`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: "48px",
                  borderRadius: "14px",
                  padding: "0 1.5rem",
                  fontSize: "0.9rem",
                  fontWeight: 800,
                  color: "#fff",
                  textDecoration: "none",
                  background: "linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #8b5cf6 100%)",
                  boxShadow: "0 8px 24px rgba(244,63,94,0.3)",
                  transition: "opacity 0.2s, transform 0.2s",
                  marginTop: "4px",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "0.9";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.opacity = "1";
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                }}
              >
                {isFr ? "S'inscrire maintenant →" : "Book now →"}
              </Link>
            </div>
          </div>

          {/* Bottom bar */}
          <div
            style={{
              marginTop: "2.5rem",
              paddingTop: "1.5rem",
              borderTop: "1px solid rgba(255,255,255,0.08)",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem",
            }}
          >
            <p style={{ margin: 0, fontSize: "0.78rem", color: "rgba(100,116,139,0.9)", fontWeight: 500 }}>
              ©{" "}
              <span style={{ color: "#f43f5e", fontWeight: 700 }}>{year}</span>{" "}
              Success Driving School —{" "}
              {isFr ? "Tous droits réservés." : "All rights reserved."}
            </p>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(71,85,105,0.9)" }}>
              {isFr ? "Premiers Secours • Genève, Suisse" : "First Aid • Geneva, Switzerland"}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

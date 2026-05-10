"use client";

import type { Session } from "@/lib/api";
import {
  formatSessionDetails,
  getMonthYearFromSessionDetails,
} from "@/lib/formatSessionDetails";
import type { Locale } from "@/lib/i18n";

type Props = {
  session: Session;
  locale: Locale;
  dict: Record<string, string>;
  selected: boolean;
  disabled: boolean;
  onPick: () => void;
};

function IconCalendar({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
    </svg>
  );
}

function IconClock({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
    </svg>
  );
}

function IconMap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
  );
}

/**
 * Carte session alignée sur ReservationCourse.tsx
 */
export function ReservationSessionCard({
  session,
  locale,
  dict,
  selected,
  disabled,
  onPick,
}: Props) {
  const formattedDetails = formatSessionDetails(session.sessionDetails, locale);
  const monthYear = getMonthYearFromSessionDetails(session.sessionDetails, locale);
  const minHeight = formattedDetails.length >= 3 ? "620px" : "auto";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onPick()}
      style={{ minHeight }}
      className={[
        "group relative w-full cursor-pointer overflow-hidden rounded-[24px] border-[3px] p-[24px] px-[20px] text-left backdrop-blur-[10px] transition-all duration-[400ms] ease-[cubic-bezier(0.175,0.885,0.32,1.275)] touch-manipulation",
        "flex h-full min-h-0 flex-col bg-[#ffffff]",
        selected ? "border-[#667eea]" : "border-[#5b21b6]",
        disabled
          ? "cursor-not-allowed border-[#ccc] bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] opacity-60 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
          : selected
            ? "shadow-[0_20px_40px_rgba(102,126,234,0.4),0_0_0_1px_rgba(255,255,255,0.1)] [transform:translateY(-8px)]"
            : "shadow-[0_4px_20px_rgba(91,33,182,0.15)] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(91,33,182,0.3)]",
      ].join(" ")}
    >
      <div
        className="pointer-events-none absolute -right-1/2 -top-1/2 z-0 h-full w-full rounded-full transition-all duration-400 ease-in-out"
        style={{
          background: selected
            ? "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
            : "linear-gradient(45deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)",
          transform: "rotate(45deg)",
        }}
        aria-hidden
      />

      <div className="relative z-[1] flex h-full min-h-0 flex-1 flex-col">
        <h3
          className="mb-4 text-center text-[18px] font-extrabold uppercase tracking-[1px]"
          style={{
            color: selected ? "#ffffff" : "#1e293b",
            fontFamily: 'Poppins, "Segoe UI", system-ui, sans-serif',
          }}
        >
          {monthYear || "SESSION"}
        </h3>

        {/* Badge Places disponibles */}
        <div className="mb-[15px] flex justify-center">
          {!disabled && session.remainingSpot > 0 ? (
            <div
              className="flex items-center gap-[6px]"
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: selected ? '#ffffff' : '#1565c0',
                letterSpacing: '0.4px',
                whiteSpace: 'nowrap',
                padding: '10px 18px',
                borderRadius: 25,
                background: selected
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)'
                  : 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
                border: selected
                  ? '2px solid rgba(255,255,255,0.4)'
                  : '2px solid #2196f3',
                boxShadow: selected
                  ? '0 4px 15px rgba(255,255,255,0.2)'
                  : '0 4px 15px rgba(33, 150, 243, 0.2)',
                backdropFilter: 'blur(10px)',
              }}
            >
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: selected ? '#ffffff' : '#2196f3',
                animation: 'pulse 2s infinite',
                flexShrink: 0,
              }} />
              <span style={{ fontWeight: 900, color: selected ? '#ffffff' : '#0d47a1' }}>
                {session.remainingSpot}
              </span>
              {' '}{session.remainingSpot === 1 ? dict.spotsAvailable : dict.spotsAvailable_plural}
            </div>
          ) : (
            <div
              className="flex items-center gap-[8px] rounded-[25px] border-2 px-[20px] py-[12px]"
              style={{
                background: 'linear-gradient(135deg, #ffebee 0%, #ffcdd2 100%)',
                borderColor: '#f44336',
                boxShadow: '0 4px 15px rgba(244, 67, 54, 0.2)',
              }}
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#f43f5e]" aria-hidden />
              <span className="text-[14px] font-bold tracking-[0.5px] text-[#d32f2f]">{dict.full}</span>
            </div>
          )}
        </div>

        {/* Goûter offert */}
        <div className="mb-[15px] flex justify-center">
          <div
            className="flex items-center gap-2 rounded-[25px] px-[22px] py-[10px]"
            style={{
              background: selected
                ? 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)'
                : 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
              border: selected
                ? '2px solid rgba(255,255,255,0.4)'
                : '2px solid #f97316',
              boxShadow: selected
                ? '0 4px 15px rgba(255,255,255,0.2)'
                : '0 4px 15px rgba(249, 115, 22, 0.2)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              backgroundColor: selected ? '#ffffff' : '#f97316',
            }} />
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: selected ? '#ffffff' : '#c2410c',
              letterSpacing: '0.5px'
            }}>
              {dict.sessionSnackOffered}
            </span>
          </div>
        </div>

        
        <div className="flex min-h-0 flex-1 flex-col gap-[4px]">
          {formattedDetails.map((sessionDetail, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-[10px]"
              style={{ marginBottom: idx < formattedDetails.length - 1 ? 20 : 0 }}
            >
              <div
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)",
                  marginBottom: 6,
                  textAlign: "center",
                  boxShadow: "0 4px 12px rgba(124, 58, 237, 0.25)",
                }}
              >
                <span
                  style={{
                    fontWeight: 900,
                    fontSize: 13,
                    color: "#fff",
                    textTransform: "uppercase",
                    letterSpacing: "1.5px",
                  }}
                >
                  {sessionDetail.title}
                </span>
              </div>

              {/* Date */}
              <div
                style={{
                  background: selected ? "rgba(255,255,255,0.2)" : "#eff6ff",
                  border: selected ? "1px solid rgba(255,255,255,0.3)" : "1px solid #dbeafe",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(59, 130, 246, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <IconCalendar className="h-[18px] w-[18px] text-white" />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#3b82f6",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {sessionDetail.date.title}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 950,
                      color: selected ? "#fff" : "#1e3a8a",
                      lineHeight: 1.1,
                    }}
                  >
                    {sessionDetail.date.value}
                  </div>
                </div>
              </div>

              {/* Heure */}
              <div
                style={{
                  background: selected ? "rgba(255,255,255,0.2)" : "#ecfdf5",
                  border: selected ? "1px solid rgba(255,255,255,0.3)" : "1px solid #d1fae5",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(16, 185, 129, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <IconClock className="h-[18px] w-[18px] text-white" />
                </div>
                <div style={{ textAlign: "left" }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#059669",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {sessionDetail.time.title}
                  </div>
                  <div
                    style={{
                      fontSize: 17,
                      fontWeight: 950,
                      color: selected ? "#fff" : "#064e3b",
                      lineHeight: 1.1,
                    }}
                  >
                    {sessionDetail.time.value}
                  </div>
                </div>
              </div>

              {/* Lieu */}
              <div
                style={{
                  background: selected ? "rgba(255,255,255,0.2)" : "#fff1f2",
                  border: selected ? "1px solid rgba(255,255,255,0.3)" : "1px solid #ffe4e6",
                  padding: "12px 16px",
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 38,
                    height: 38,
                    borderRadius: 10,
                    background: "#f43f5e",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 10px rgba(244, 63, 94, 0.3)",
                    flexShrink: 0,
                  }}
                >
                  <IconMap className="h-[18px] w-[18px] text-white" />
                </div>
                <div style={{ textAlign: "left", flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: 10,
                      fontWeight: 800,
                      color: "#e11d48",
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {sessionDetail.location.title}
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 950,
                      color: selected ? "#fff" : "#881337",
                      lineHeight: 1.2,
                      wordBreak: "break-word",
                    }}
                  >
                    {sessionDetail.location.url ? (
                      <a
                        href={sessionDetail.location.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "inherit", cursor: "pointer" }}
                        title={dict.sessionMapsLinkTitle}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {sessionDetail.location.value}
                      </a>
                    ) : (
                      sessionDetail.location.value
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {/* Spacer if only 2 details to maintain height */}
          {formattedDetails.length > 0 && formattedDetails.length < 3 && (
            <div
              style={{
                padding: 12,
                border: "1px solid transparent",
                borderRadius: 12,
                backgroundColor: "transparent",
                minHeight: formattedDetails.length === 2 ? 140 : 280,
                flex: "0 0 auto",
                marginBottom: 0,
              }}
              aria-hidden
            />
          )}

          {formattedDetails.length === 0 ? (
            <div className="whitespace-pre-wrap break-words text-sm text-slate-800">{session.sessionDetails}</div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

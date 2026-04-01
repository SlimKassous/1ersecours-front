"use client";

import type { Session } from "@/lib/api";
import {
  formatSessionDateWithSpace,
  formatSessionDetails,
  getMapsUrlForSessionLocation,
  getMonthYearFromSessionDetails,
} from "@/lib/formatSessionDetails";
import type { Locale } from "@/lib/i18n";

type Props = {
  session: Session;
  locale: Locale;
  selected: boolean;
  disabled: boolean;
  spotsLabel: string;
  noSpotsLabel: string;
  mapsLinkTitle: string;
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
 * Carte session alignée sur ReservationCourse.tsx (Grid xs=12 sm=6 md=4, minHeight ~700px, styles inline reproduits).
 */
export function ReservationSessionCard({
  session,
  locale,
  selected,
  disabled,
  spotsLabel,
  noSpotsLabel,
  mapsLinkTitle,
  onPick,
}: Props) {
  const formattedDetails = formatSessionDetails(session.sessionDetails, locale);
  const monthYear = getMonthYearFromSessionDetails(session.sessionDetails, locale);
  const minHeight = formattedDetails.length === 3 ? "auto" : "700px";

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && onPick()}
      style={{ minHeight }}
      className={[
        "group relative w-full cursor-pointer overflow-hidden rounded-[20px] border-2 p-[25px] text-left backdrop-blur-[10px] transition-all duration-[400ms] ease-[cubic-bezier(0.4,0,0.2,1)] touch-manipulation",
        "flex h-full min-h-0 flex-col bg-gradient-to-br from-white to-[#f8fafc]",
        "shadow-[0_10px_30px_rgba(0,0,0,0.1),0_1px_3px_rgba(0,0,0,0.1)]",
        disabled
          ? "cursor-not-allowed border-[#ccc] bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] opacity-60 shadow-[0_5px_15px_rgba(0,0,0,0.1)]"
          : selected
            ? "border-[3px] border-[#667eea] bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white shadow-[0_20px_40px_rgba(102,126,234,0.4),0_0_0_1px_rgba(255,255,255,0.1)] [transform:translateY(-8px)]"
            : "border-[rgba(102,126,234,0.3)] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(59,130,246,0.2)]",
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
          className="mb-5 text-center text-[20px] font-extrabold uppercase tracking-[2px]"
          style={{
            color: selected ? "#ffffff" : disabled ? "#999" : "#1e293b",
            fontFamily: 'Poppins, "Segoe UI", system-ui, sans-serif',
            textShadow: selected ? "0 2px 4px rgba(0,0,0,0.1)" : "none",
          }}
        >
          {monthYear || "SESSION"}
        </h3>

        <div className="mb-[15px] flex justify-center">
          {!disabled ? (
            <div
              className="flex items-center gap-2 rounded-[25px] px-5 py-3 backdrop-blur-[10px]"
              style={{
                background: selected
                  ? "linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.15) 100%)"
                  : "linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)",
                border: selected ? "2px solid rgba(255,255,255,0.4)" : "2px solid #2196f3",
                boxShadow: selected
                  ? "0 4px 15px rgba(255,255,255,0.2)"
                  : "0 4px 15px rgba(33, 150, 243, 0.2)",
              }}
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: selected ? "#ffffff" : "#2196f3",
                  animation: "pulse 2s infinite",
                }}
                aria-hidden
              />
              <span
                className="text-[14px] font-bold tracking-wide"
                style={{
                  color: selected ? "#ffffff" : "#1976d2",
                  textShadow: selected ? "0 1px 2px rgba(0,0,0,0.1)" : "none",
                }}
              >
                {spotsLabel}
              </span>
            </div>
          ) : (
            <div
              className="flex items-center gap-2 rounded-[25px] border-2 border-[#f44336] bg-gradient-to-br from-[#ffebee] to-[#ffcdd2] px-5 py-3 shadow-[0_4px_15px_rgba(244,67,54,0.2)]"
            >
              <span className="h-2 w-2 shrink-0 rounded-full bg-[#f44336]" aria-hidden />
              <span className="text-[14px] font-bold tracking-wide text-[#d32f2f]">{noSpotsLabel}</span>
            </div>
          )}
        </div>

        <div className="flex min-h-0 flex-1 flex-col gap-1">
          {formattedDetails.map((sessionDetail, idx) => (
            <div
              key={`${session.sessionDetails}-${idx}`}
              className="mb-1 flex-[0_0_auto] rounded-xl p-3 last:mb-0"
              style={{
                background: selected
                  ? "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.08) 100%)"
                  : "linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
                boxShadow: selected
                  ? "0 4px 16px rgba(255,255,255,0.1)"
                  : "0 8px 32px rgba(0,0,0,0.08), 0 2px 16px rgba(0,0,0,0.04)",
                border: selected ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(255,255,255,0.4)",
              }}
            >
              <div
                className="mb-2 rounded-lg px-2.5 py-1.5 text-center text-[11px] font-bold uppercase tracking-wide text-white"
                style={{
                  background: selected
                    ? "rgba(255,255,255,0.2)"
                    : "linear-gradient(135deg, rgb(138, 43, 226) 0%, rgb(106, 27, 154) 100%)",
                  fontFamily: 'Poppins, "Segoe UI", system-ui, sans-serif',
                }}
              >
                {sessionDetail.title}
              </div>

              <div
                className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1"
                style={{
                  backgroundColor: selected ? "rgba(59, 130, 246, 0.15)" : "rgba(59, 130, 246, 0.08)",
                }}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md shadow-[0_3px_10px_rgba(59,130,246,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  }}
                >
                  <IconCalendar className="h-2.5 w-2.5 text-white" />
                </div>
                <div
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: selected ? "#ffffff" : "#374151" }}
                >
                  <span
                    className="text-[9px]"
                    style={{ color: selected ? "rgba(255,255,255,0.8)" : "#6b7280" }}
                  >
                    {sessionDetail.date.title}:
                  </span>
                  <br />
                  <strong>{formatSessionDateWithSpace(sessionDetail.date.value)}</strong>
                </div>
              </div>

              <div
                className="mb-1 flex items-center gap-2 rounded-lg px-2 py-1"
                style={{
                  backgroundColor: selected ? "rgba(16, 185, 129, 0.15)" : "rgba(16, 185, 129, 0.08)",
                }}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md shadow-[0_3px_10px_rgba(16,185,129,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  }}
                >
                  <IconClock className="h-2.5 w-2.5 text-white" />
                </div>
                <div
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: selected ? "#ffffff" : "#374151" }}
                >
                  <span
                    className="text-[9px]"
                    style={{ color: selected ? "rgba(255,255,255,0.8)" : "#6b7280" }}
                  >
                    {sessionDetail.time.title}:
                  </span>
                  <br />
                  <strong>{sessionDetail.time.value}</strong>
                </div>
              </div>

              <div
                className="flex items-center gap-2 rounded-lg px-2 py-1"
                style={{
                  backgroundColor: selected ? "rgba(239, 68, 68, 0.15)" : "rgba(239, 68, 68, 0.08)",
                }}
              >
                <div
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md shadow-[0_3px_10px_rgba(239,68,68,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
                  }}
                >
                  <IconMap className="h-2.5 w-2.5 text-white" />
                </div>
                <div
                  className="text-[10px] font-semibold leading-tight"
                  style={{ color: selected ? "#ffffff" : "#374151" }}
                >
                  <span
                    className="text-[9px]"
                    style={{ color: selected ? "rgba(255,255,255,0.8)" : "#6b7280" }}
                  >
                    {sessionDetail.location.title}:
                  </span>
                  <br />
                  {(() => {
                    const maps = getMapsUrlForSessionLocation(sessionDetail.location.value);
                    return maps ? (
                      <a
                        href={maps}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                        style={{ color: "inherit" }}
                        title={mapsLinkTitle}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <strong>{sessionDetail.location.value}</strong>
                      </a>
                    ) : (
                      <strong>{sessionDetail.location.value}</strong>
                    );
                  })()}
                </div>
              </div>
            </div>
          ))}

          {formattedDetails.length < 3 ? (
            <div
              className="mb-0 flex-[0_0_auto] rounded-xl border border-transparent bg-transparent"
              style={{
                minHeight: formattedDetails.length === 2 ? 200 : 400,
              }}
              aria-hidden
            />
          ) : null}

          {formattedDetails.length === 0 ? (
            <div className="whitespace-pre-wrap break-words text-sm text-slate-800">{session.sessionDetails}</div>
          ) : null}
        </div>
      </div>
    </button>
  );
}

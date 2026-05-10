"use client";

import { Fragment } from "react";

function IconSession({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconUser({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" strokeLinecap="round" />
    </svg>
  );
}

function IconRecap({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function IconCard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <path d="M2 10h20" />
    </svg>
  );
}

const STEP_ICONS = [IconSession, IconUser, IconRecap, IconCard] as const;

type Step = 0 | 1 | 2 | 3;

type Props = {
  step: Step;
  labels: readonly [string, string, string, string];
};

export function ReservationStepper({ step, labels }: Props) {
  return (
    <nav
      aria-label="Progress"
      className="w-full rounded-[20px] border border-[rgba(255,255,255,0.8)] bg-[rgba(255,255,255,0.98)] px-[16px] py-[24px] shadow-[0_8px_32px_rgba(0,0,0,0.1),0_2px_8px_rgba(138,43,226,0.1)] backdrop-blur-[10px] sm:rounded-[12px] sm:px-[8px] sm:py-[16px]"
    >
      <div className="flex w-full min-w-0 items-center">
        {labels.map((label, i) => {
          const s = i as Step;
          const active = step === s;
          const done = step > s;
          const Icon = STEP_ICONS[i]!;
          return (
            <Fragment key={label}>
              {i > 0 ? (
                <div
                  className={[
                    "mx-0.5 h-1 min-h-px min-w-[6px] flex-1 rounded-full transition-colors duration-300 sm:mx-1 sm:min-w-[12px]",
                    done
                      ? "bg-[#10b981]"
                      : "bg-[#e2e8f0]",
                  ].join(" ")}
                  aria-hidden
                />
              ) : null}
              <div
                className="flex w-[4.25rem] shrink-0 flex-col items-center gap-1.5 sm:w-[5.25rem] sm:gap-2 md:w-24"
                aria-current={active ? "step" : undefined}
              >
                <div
                  className={[
                    "flex h-11 w-11 items-center justify-center rounded-[16px] border-[2px] border-[rgba(255,255,255,0.3)] transition-all duration-[400ms] sm:h-[48px] sm:w-[48px] md:h-[56px] md:w-[56px] [transform-style:preserve-3d]",
                    active
                      ? "animate-[pulse_2s_ease-in-out_infinite] border-[rgba(255,255,255,0.4)] text-white"
                      : done
                        ? "text-white shadow-[0_8px_24px_rgba(16,185,129,0.3),inset_0_2px_4px_rgba(255,255,255,0.3)] [transform:perspective(1000px)_rotateY(0deg)]"
                        : "bg-[#e2e8f0] text-[#64748b] shadow-[0_4px_12px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.5)] [transform:perspective(1000px)_rotateY(0deg)]",
                  ].join(" ")}
                  style={{
                    background: active
                      ? "linear-gradient(135deg, #b827ce 0%, #ff6b9d 100%)"
                      : done
                        ? "linear-gradient(135deg, #10b981 0%, #059669 100%)"
                        : "#e2e8f0",
                    boxShadow: active
                      ? "0 12px 32px rgba(184, 39, 206, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.3), 0 0 0 4px rgba(184, 39, 206, 0.1)"
                      : undefined,
                    transform: active
                      ? "perspective(1000px) rotateY(-5deg) rotateX(5deg) scale(1.05)"
                      : undefined,
                  }}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem] sm:h-[1.2rem] sm:w-[1.2rem] md:h-[1.5rem] md:w-[1.5rem]" />
                </div>
                <span
                  className={[
                    "max-w-full px-0.5 text-center text-[0.6rem] sm:text-[0.65rem] md:text-[1rem] leading-[1.25] text-wrap break-words",
                    active ? "font-[800] text-[#667eea]" : done ? "font-[700] text-[#10b981]" : "font-[700] text-[#1e293b]",
                  ].join(" ")}
                >
                  {label}
                </span>
              </div>
            </Fragment>
          );
        })}
      </div>
    </nav>
  );
}

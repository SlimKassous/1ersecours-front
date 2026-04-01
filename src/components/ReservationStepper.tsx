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
    <nav aria-label="Progress" className="mb-8 w-full sm:mb-10 lg:px-2">
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
                      ? "bg-gradient-to-r from-emerald-500 to-teal-500 shadow-sm shadow-emerald-500/30"
                      : active
                        ? "bg-gradient-to-r from-rose-200 via-fuchsia-200 to-violet-200"
                        : "bg-slate-200/90",
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
                    "flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-300 sm:h-[52px] sm:w-[52px] md:h-14 md:w-14 [transform:translateZ(0)]",
                    active
                      ? "border-white/40 bg-gradient-to-br from-[#b827ce] via-[#e11d48] to-[#ff6b9d] text-white shadow-[0_12px_28px_rgba(184,39,206,0.38)] ring-2 ring-[#b827ce]/15"
                      : done
                        ? "border-emerald-200/80 bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-[0_8px_22px_rgba(16,185,129,0.35)]"
                        : "border-slate-200/90 bg-slate-100 text-slate-500 shadow-inner shadow-white/50",
                  ].join(" ")}
                >
                  <Icon className="h-[1.15rem] w-[1.15rem] sm:h-5 sm:w-5 md:h-[1.35rem] md:w-[1.35rem]" />
                </div>
                <span
                  className={[
                    "max-w-full px-0.5 text-center text-[8px] font-bold uppercase leading-tight tracking-[0.06em] sm:text-[9px] sm:tracking-[0.1em] md:text-[10px]",
                    active ? "text-[#9f1239]" : done ? "text-emerald-800" : "text-slate-400",
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

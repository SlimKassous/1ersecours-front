"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { getDictionary, type Locale } from "@/lib/i18n";
import { successDsUrl } from "@/lib/successDsLinks";

type Props = {
  locale: Locale;
  compact?: boolean;
};

type Countdown = {
  days: number;
  hours: number;
  minutes: number;
};

function getNextSundayDeadline(now: Date): Date {
  const target = new Date(now);
  target.setHours(23, 59, 59, 0);
  const daysUntilSunday = (7 - now.getDay()) % 7 || 7;
  target.setDate(now.getDate() + daysUntilSunday);
  return target;
}

function getCountdown(target: Date): Countdown {
  const diffMs = Math.max(0, target.getTime() - Date.now());
  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;
  return { days, hours, minutes };
}

export function CrossSellPromo({ locale, compact = false }: Props) {
  const dict = getDictionary(locale);
  const initialDeadline = useMemo(() => getNextSundayDeadline(new Date()), []);
  const sectionRef = useRef<HTMLElement | null>(null);
  const deadlineRef = useRef<Date>(initialDeadline);
  const [isVisible, setIsVisible] = useState(false);
  const [countdown, setCountdown] = useState<Countdown>(() => getCountdown(initialDeadline));

  useEffect(() => {
    const id = window.setInterval(() => {
      setCountdown((current) => {
        const next = getCountdown(deadlineRef.current);
        if (next.days === 0 && next.hours === 0 && next.minutes === 0) {
          deadlineRef.current = getNextSundayDeadline(new Date());
          return getCountdown(deadlineRef.current);
        }
        if (
          next.days === current.days &&
          next.hours === current.hours &&
          next.minutes === current.minutes
        ) {
          return current;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!sectionRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.22 },
    );
    observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const links = useMemo(
    () => [
      {
        title: dict.crossSellAutoTitle,
        body: dict.crossSellAutoBody,
        href: successDsUrl(locale, "/CoursAuto"),
      },
      {
        title: dict.crossSellMotoTitle,
        body: dict.crossSellMotoBody,
        href: successDsUrl(locale, "/CoursMoto"),
      },
      {
        title: dict.crossSellAwarenessTitle,
        body: dict.crossSellAwarenessBody,
        href: successDsUrl(locale, "/ClassroomCourses"),
      },
      {
        title: dict.crossSellPacksTitle,
        body: dict.crossSellPacksBody,
        href: successDsUrl(locale, "/Packs"),
      },
    ],
    [dict, locale],
  );

  return (
    <section
      ref={sectionRef}
      aria-label={dict.crossSellSectionTitle}
      className={[
        "relative overflow-hidden rounded-3xl border border-fuchsia-200/70 bg-white p-5 shadow-[0_20px_60px_rgba(168,85,247,0.18)] sm:p-7",
        compact ? "mt-6" : "mt-3 sm:mt-5",
      ].join(" ")}
    >
      <div className="pointer-events-none absolute -left-12 -top-14 h-40 w-40 rounded-full bg-rose-300/40 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-16 -right-10 h-48 w-48 rounded-full bg-violet-300/45 blur-3xl" aria-hidden />

      <div
        className={[
          "relative rounded-2xl border border-rose-200/60 bg-gradient-to-r from-[#f43f5e] via-[#ec4899] to-[#8b5cf6] p-[1px] transition-all duration-700",
          isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        ].join(" ")}
      >
        <div className="rounded-2xl bg-[#0b1229] px-4 py-4 text-white sm:px-5">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-rose-200">
            {dict.crossSellCountdownEyebrow}
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-2.5 sm:gap-3">
            {[
              { value: countdown.days, label: dict.crossSellDays },
              { value: countdown.hours, label: dict.crossSellHours },
              { value: countdown.minutes, label: dict.crossSellMinutes },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-center backdrop-blur-sm"
              >
                <p className="fa-display text-xl font-black leading-none tabular-nums sm:text-2xl">
                  {String(item.value).padStart(2, "0")}
                </p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.12em] text-rose-100">
                  {item.label}
                </p>
              </div>
            ))}
            <p className="ml-auto max-w-[14rem] text-right text-xs font-semibold text-rose-100/95">
              {dict.crossSellCountdownBody}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mt-5 sm:mt-6">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-rose-500">
          {dict.crossSellSectionKicker}
        </p>
        <h2 className="fa-display mt-2 text-2xl font-black tracking-tight text-neutral-950 sm:text-3xl">
          {dict.crossSellSectionTitle}
        </h2>
        <p className="mt-2 max-w-3xl text-sm font-semibold leading-relaxed text-slate-700 sm:text-base">
          {dict.crossSellSectionBody}
        </p>

        <div
          className={[
            "mt-5 grid grid-cols-1 gap-3 sm:mt-6 sm:gap-4",
            compact ? "lg:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-4",
          ].join(" ")}
        >
          {links.map((item, idx) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={[
                "group rounded-2xl border border-slate-200 bg-gradient-to-b from-white to-rose-50/45 p-4 shadow-sm transition-all duration-500 hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-200/60",
                isVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0",
              ].join(" ")}
              style={{ transitionDelay: `${idx * 90}ms` }}
            >
              <p className="fa-display text-lg font-black text-neutral-900">{item.title}</p>
              <p className="mt-1.5 text-sm font-semibold text-slate-600">{item.body}</p>
              <span className="mt-3 inline-flex items-center text-sm font-bold text-[#be123c] underline decoration-rose-300 decoration-2 underline-offset-4 group-hover:text-[#9f1239]">
                {dict.crossSellVisit} →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DatePickerWithCalendar } from "@/components/DatePickerWithCalendar";
import { ReservationSessionCard } from "@/components/ReservationSessionCard";
import { ReservationStepper } from "@/components/ReservationStepper";
import { api, type BookingEleve, type Lesson, type Session } from "@/lib/api";
import { formatSessionDetails, sortSessionsByDate } from "@/lib/formatSessionDetails";
import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";

type Step = 0 | 1 | 2 | 3;

function parseErrMessage(err: unknown): string {
  if (!(err instanceof Error)) return String(err);
  const raw = err.message;
  try {
    const j = JSON.parse(raw) as { message?: string };
    if (j.message) return j.message;
  } catch {
    /* plain text */
  }
  return raw;
}

function isDuplicateBookingMessage(msg: string): boolean {
  const m = msg.toLowerCase();
  return (
    m.includes("duplicate") ||
    m.includes("déjà") ||
    m.includes("deja") ||
    m.includes("already") ||
    m.includes("existe") ||
    (m.includes("exist") && m.includes("reservation")) ||
    (m.includes("booking") && m.includes("today"))
  );
}

function formatBirthDateRecap(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${m[3]}/${m[2]}/${m[1]}`;
}

export function ReservationWizard({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [step, setStep] = useState<Step>(0);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [lessonId, setLessonId] = useState<number | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [loadingLessons, setLoadingLessons] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [user, setUser] = useState<BookingEleve>({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    dateNaissance: "",
    numeroregister: "",
    adresse: "",
  });

  const lesson = useMemo(
    () => lessons.find((l) => l.id === lessonId) ?? null,
    [lessons, lessonId],
  );

  const sortedSessions = useMemo(() => sortSessionsByDate(sessions), [sessions]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoadingLessons(true);
        const list = await api.getFirstAidLessons(locale);
        if (cancelled) return;
        setLessons(list);
        setLessonId(null);
        setSelectedSession(null);
        if (list.length === 1) setLessonId(list[0].id);
      } catch (e) {
        if (!cancelled) {
          toast.error(parseErrMessage(e) || dict.apiError, { id: "load-lessons" });
        }
      } finally {
        if (!cancelled) setLoadingLessons(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [locale, dict.apiError]);

  useEffect(() => {
    if (!lessonId) {
      setSessions([]);
      setSelectedSession(null);
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        setLoadingSessions(true);
        const data = await api.getSessions(lessonId);
        if (cancelled) return;
        setSessions(data ?? []);
        setSelectedSession(null);
      } catch (e) {
        if (!cancelled) {
          toast.error(parseErrMessage(e) || dict.apiError, { id: "load-sessions" });
        }
      } finally {
        if (!cancelled) setLoadingSessions(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [lessonId, dict.apiError]);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [step]);

  const canGoStep1 = Boolean(selectedSession);
  const canGoStep2 = Boolean(
    user.nom.trim() &&
      user.prenom.trim() &&
      user.email.trim() &&
      user.telephone.trim() &&
      user.dateNaissance.trim(),
  );

  const maxBirthYear = new Date().getFullYear();

  const fieldInputClass =
    "w-full min-h-[48px] rounded-xl border-2 border-[rgba(138,43,226,0.3)] bg-white px-4 py-3 text-base text-slate-900 shadow-sm outline-none transition focus:border-[rgba(138,43,226,0.7)] focus:ring-2 focus:ring-violet-200 touch-manipulation";

  const nextStep = () => {
    if (step === 0 && canGoStep1) setStep(1);
    else if (step === 1 && canGoStep2) setStep(2);
    else if (step === 2) setStep(3);
  };

  const prevStep = () => {
    if (step === 1) setStep(0);
    else if (step === 2) setStep(1);
    else if (step === 3) setStep(2);
  };

  const submit = async () => {
    if (!lesson || !selectedSession) return;
    setProcessing(true);
    const bookingDate = new Date().toISOString().split("T")[0];
    const eleve: BookingEleve = {
      nom: user.nom.trim(),
      prenom: user.prenom.trim(),
      email: user.email.trim(),
      telephone: user.telephone.trim(),
      dateNaissance: user.dateNaissance.trim(),
      numeroregister: user.numeroregister.trim(),
      adresse: user.adresse.trim(),
    };

    const onFail = (msg: string) => {
      if (isDuplicateBookingMessage(msg)) {
        toast.error(dict.toastDuplicateReservation, { id: "dup-booking" });
      } else {
        toast.error(msg, { id: "booking-fail" });
      }
    };

    try {
      const amount = lesson.promotionalPrice ?? lesson.price;
      const bookingData = {
        lessonId: lesson.id,
        bookingDate,
        typePayment: 1 as const,
        language: locale,
        courseType: "PREMIER_SECOURS" as const,
        eleve,
        sessionChoosed: {
          sessionDetails: selectedSession.sessionDetails,
        },
      };
      const res = await api.createCheckoutSession({
        amount: Math.round(amount * 100),
        packName: lesson.name,
        language: locale,
        bookingData,
      });
      if (res.url) {
        toast.info(dict.toastRedirectPayment, { id: "stripe-go" });
        window.location.assign(res.url);
      } else {
        toast.error(dict.toastPaymentError, { id: "stripe-missing" });
      }
    } catch (e) {
      onFail(parseErrMessage(e) || dict.apiError);
    } finally {
      setProcessing(false);
    }
  };

  const stepLabels = [
    dict.stepSession,
    dict.stepDetails,
    dict.stepRecap,
    dict.stepPay,
  ] as const;

  const priceDisplay = useMemo(() => {
    if (!lesson) return { pay: 0, list: 0, hasPromo: false, payStr: "", listStr: "" };
    const list = Number(lesson.price);
    const promoRaw = lesson.promotionalPrice;
    const promo =
      promoRaw != null && !Number.isNaN(Number(promoRaw)) ? Number(promoRaw) : null;
    const hasPromo = promo != null && promo < list;
    const pay = hasPromo ? promo : list;
    const payStr = `${pay} CHF`;
    const listStr = `${list} CHF`;
    return { pay, list, hasPromo, payStr, listStr };
  }, [lesson]);

  const recapSessionFormatted = useMemo(() => {
    if (!selectedSession) return [];
    return formatSessionDetails(selectedSession.sessionDetails, locale);
  }, [selectedSession, locale]);

  return (
    <div className="w-full max-w-none rounded-3xl border border-rose-100 bg-white/95 p-4 shadow-xl shadow-rose-200/35 backdrop-blur-sm sm:p-6 md:p-8 lg:p-10">
      <ReservationStepper step={step} labels={stepLabels} />

      {loadingLessons ? (
        <p className="text-slate-600">{dict.processing}</p>
      ) : lessons.length === 0 ? (
        <p className="text-slate-700">{dict.noFirstAid}</p>
      ) : (
        <>
          {step === 0 ? (
            <div className="space-y-8">
              {lessons.length > 1 ? (
                <div>
                  <span className="mb-3 block text-sm font-bold text-slate-800">
                    {dict.selectCourse}
                  </span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-2 xl:gap-4">
                    {lessons.map((l) => {
                      const sel = lessonId === l.id;
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => setLessonId(l.id)}
                          className={[
                            "rounded-2xl border px-4 py-4 text-left transition touch-manipulation",
                            sel
                              ? "border-[#f43f5e]/50 bg-gradient-to-br from-rose-50 to-fuchsia-50 shadow-md shadow-rose-100"
                              : "border-rose-100 bg-white hover:border-rose-200",
                          ].join(" ")}
                        >
                          <span className="font-bold text-slate-900">{l.name}</span>
                          <span className="mt-2 flex flex-wrap items-baseline gap-2">
                            {l.promotionalPrice != null &&
                            l.promotionalPrice < l.price ? (
                              <span className="text-sm font-semibold text-slate-400 line-through">
                                {l.price} CHF
                              </span>
                            ) : null}
                            <span className="text-sm font-bold text-[#be123c]">
                              {l.promotionalPrice != null && l.promotionalPrice < l.price
                                ? l.promotionalPrice
                                : l.price}{" "}
                              CHF
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {lessonId ? (
                loadingSessions ? (
                  <p className="text-slate-600">{dict.processing}</p>
                ) : sortedSessions.length === 0 ? (
                  <p className="text-slate-700">{dict.noSessions}</p>
                ) : (
                  <div>
                    <h3
                      className="fa-display mb-8 text-center text-[1.35rem] font-bold leading-tight sm:text-[1.65rem] md:text-[1.75rem]"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        color: "transparent",
                      }}
                    >
                      {dict.chooseSession}
                    </h3>
                    <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {sortedSessions.map((s) => {
                        const sel = selectedSession?.sessionDetails === s.sessionDetails;
                        const spots = s.remainingSpot ?? 0;
                        const disabled = spots <= 0;
                        return (
                          <li key={s.sessionDetails} className="flex min-h-0">
                            <ReservationSessionCard
                              session={s}
                              locale={locale}
                              selected={sel}
                              disabled={disabled}
                              spotsLabel={dict.spotsLeft.replace("{{count}}", String(spots))}
                              noSpotsLabel={dict.full}
                              mapsLinkTitle={dict.sessionMapsLinkTitle}
                              onPick={() => {
                                if (disabled) return;
                                setSelectedSession(s);
                                setStep(1);
                              }}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )
              ) : null}
            </div>
          ) : null}

          {step === 1 ? (
            <div className="space-y-6">
              {selectedSession ? (
                <div className="overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-white via-indigo-50/20 to-violet-50/35 shadow-md shadow-indigo-100/40">
                  <div className="flex items-center gap-3 border-b border-indigo-100/80 bg-white/70 px-4 py-3 sm:px-5">
                    <span
                      className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-md"
                      aria-hidden
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <p className="text-sm font-extrabold tracking-wide text-indigo-800">{dict.recapSession}</p>
                  </div>
                  <div className="space-y-3 p-4 sm:p-5">
                    {recapSessionFormatted.length > 0 ? (
                      recapSessionFormatted.map((p, idx) => (
                        <div key={`details-selected-${idx}`} className="rounded-xl border border-slate-200/80 bg-white p-3 sm:p-4">
                          <p className="text-sm font-bold text-slate-900">{p.title}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs sm:text-sm">
                            <span className="rounded-full bg-indigo-50 px-2.5 py-1 font-semibold text-indigo-700">{p.date.value}</span>
                            <span className="rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">{p.time.value}</span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-semibold text-slate-700">{p.location.value}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="whitespace-pre-wrap text-sm text-slate-700">{selectedSession.sessionDetails}</p>
                    )}
                  </div>
                </div>
              ) : null}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {dict.lastName}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <input
                  className={fieldInputClass}
                  value={user.nom}
                  onChange={(e) => setUser({ ...user, nom: e.target.value })}
                  autoComplete="family-name"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {dict.firstName}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <input
                  className={fieldInputClass}
                  value={user.prenom}
                  onChange={(e) => setUser({ ...user, prenom: e.target.value })}
                  autoComplete="given-name"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {dict.email}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <input
                  type="email"
                  className={fieldInputClass}
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  autoComplete="email"
                />
              </label>
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {dict.phone}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <input
                  type="tel"
                  className={fieldInputClass}
                  value={user.telephone}
                  onChange={(e) => setUser({ ...user, telephone: e.target.value })}
                  autoComplete="tel"
                />
              </label>
              <div>
                <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <span className="text-violet-600" aria-hidden>
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                    </svg>
                  </span>
                  {dict.birthDate}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <DatePickerWithCalendar
                  locale={locale}
                  value={user.dateNaissance}
                  onChange={(iso) => setUser({ ...user, dateNaissance: iso })}
                  disableFuture
                  minYear={1900}
                  maxYear={maxBirthYear}
                  defaultCalendarYearOffset={16}
                />
              </div>
              <label className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-slate-800">{dict.address}</span>
                <textarea
                  className={`${fieldInputClass} min-h-[100px] resize-y`}
                  value={user.adresse}
                  onChange={(e) => setUser({ ...user, adresse: e.target.value })}
                  autoComplete="street-address"
                />
              </label>
              </div>
            </div>
          ) : null}

          {step === 2 && lesson && selectedSession ? (
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-center text-2xl font-black text-[#b455cf] sm:text-3xl">{dict.stepRecap}</h3>
              <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 lg:gap-6">
                <div className="rounded-2xl border border-[#c9d7ef] bg-[#f8fbff] p-5 shadow-sm">
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-indigo-600">{dict.selectCourse}</p>
                  <p className="mt-2 text-center text-[1.75rem] leading-none" aria-hidden>🇨🇭</p>
                  <p className="mt-2 text-center text-2xl font-black text-slate-800">{lesson.name}</p>

                  <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-emerald-600">{dict.recapParticipant}</p>
                  <div className="mt-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center gap-2.5 rounded-lg bg-emerald-50/60 px-2.5 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500 text-white">•</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{dict.firstName} / {dict.lastName}</p>
                          <p className="font-extrabold text-slate-900">{user.prenom} {user.nom}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-lg bg-blue-50/60 px-2.5 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-500 text-white">@</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{dict.email}</p>
                          <p className="break-all font-bold text-slate-900">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-lg bg-pink-50/60 px-2.5 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-pink-500 text-white">☎</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{dict.phone}</p>
                          <p className="font-bold text-slate-900">{user.telephone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5 rounded-lg bg-green-50/60 px-2.5 py-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-green-500 text-white">📅</span>
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{dict.birthDate}</p>
                          <p className="font-bold text-slate-900">{user.dateNaissance ? formatBirthDateRecap(user.dateNaissance) : "-"}</p>
                        </div>
                      </div>
                      {user.adresse.trim() ? (
                        <div className="flex items-center gap-2.5 rounded-lg bg-cyan-50/60 px-2.5 py-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500 text-white">⌂</span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">{dict.address}</p>
                            <p className="whitespace-pre-line font-bold text-slate-900">{user.adresse}</p>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="my-5 h-px w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent" />
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-violet-600">{dict.recapPrice}</p>
                  <div className="mt-2 flex items-baseline justify-center gap-2">
                    {priceDisplay.hasPromo ? (
                      <span className="text-xl font-bold tabular-nums text-slate-400 line-through">{priceDisplay.listStr}</span>
                    ) : null}
                    <span className="fa-display text-5xl font-black tabular-nums text-[#b455cf]">{priceDisplay.payStr}</span>
                  </div>
                </div>

                <div className="rounded-2xl border border-[#c9d7ef] bg-[#f8fbff] p-5 shadow-sm">
                  <p className="text-center text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">{dict.recapSession}</p>
                  <div className="mt-3 space-y-3">
                    {recapSessionFormatted.length > 0 ? (
                      recapSessionFormatted.map((p, idx) => (
                        <div key={`recap-${idx}`} className="rounded-xl border border-[#c9d7ef] bg-white p-3.5 shadow-sm">
                          <p className="rounded-lg bg-blue-600 px-3 py-1.5 text-center text-xs font-extrabold uppercase tracking-wide text-white">
                            {p.title}
                          </p>
                          <div className="mt-2 space-y-2">
                            <div className="rounded-lg bg-blue-50 px-3 py-2 text-sm font-semibold text-slate-700">
                              <span className="font-bold text-slate-500">{p.date.title}: </span>
                              {p.date.value}
                            </div>
                            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-semibold text-slate-700">
                              <span className="font-bold text-slate-500">{p.time.title}: </span>
                              {p.time.value}
                            </div>
                            <div className="rounded-lg bg-rose-50 px-3 py-2 text-sm font-semibold text-slate-700">
                              <span className="font-bold text-slate-500">{p.location.title}: </span>
                              <span className="break-words">{p.location.value}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="whitespace-pre-wrap text-sm text-slate-700">{selectedSession.sessionDetails}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 && lesson ? (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">{dict.paymentMethod}</p>
              <div className="rounded-2xl border-2 border-[#f43f5e]/55 bg-gradient-to-br from-rose-50 to-fuchsia-50/80 p-4 shadow-lg shadow-rose-200/45 ring-1 ring-[#f43f5e]/15 sm:p-5">
                <div className="flex gap-4">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#635bff] via-[#0a2540] to-[#00d4aa] text-white shadow-md"
                    aria-hidden
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900">{dict.payByCard}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{dict.payCardHint}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="w-full rounded-xl border-2 border-rose-200 bg-white px-4 py-3.5 text-sm font-bold text-slate-700 hover:bg-rose-50 sm:w-auto min-h-[48px] touch-manipulation"
            >
              {dict.back}
            </button>
          ) : null}
          <Link
            href={`/${locale}`}
            className="inline-flex min-h-[44px] w-full items-center justify-center text-center text-sm font-semibold text-slate-600 underline decoration-rose-300 decoration-2 underline-offset-[3px] hover:text-[#be123c] sm:w-auto touch-manipulation"
          >
            {dict.reservationCancelHome}
          </Link>
        </div>
        {step < 3 ? (
          <button
            type="button"
            onClick={nextStep}
            disabled={
              (step === 0 && !canGoStep1) || (step === 1 && !canGoStep2)
            }
            className="fa-btn-primary w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:ml-auto sm:w-auto sm:min-w-[180px] min-h-[48px] touch-manipulation"
          >
            {step === 2 ? dict.continueToPayment : dict.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={processing}
            className="fa-btn-primary w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[200px] min-h-[48px] touch-manipulation"
          >
            {processing ? dict.processing : dict.confirmPayCard}
          </button>
        )}
      </div>
    </div>
  );
}

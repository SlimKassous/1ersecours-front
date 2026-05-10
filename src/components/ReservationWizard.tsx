"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { DatePickerWithCalendar } from "@/components/DatePickerWithCalendar";
import { ReservationSessionCard } from "@/components/ReservationSessionCard";
import { ReservationStepper } from "@/components/ReservationStepper";
import { api, type BookingEleve, type Lesson, type Session } from "@/lib/api";
import { formatSessionDateWithSpace, formatSessionDetails, getMapsUrlForSessionLocation, sortSessionsByDate } from "@/lib/formatSessionDetails";
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
      user.dateNaissance.trim() &&
      user.adresse.trim(),
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
    <div className="mx-auto w-full max-w-none space-y-6 sm:space-y-8">
      {/* Stepper Card */}
      <ReservationStepper step={step} labels={stepLabels} />

      {/* Main Content Card */}
      <div className="w-full max-w-none rounded-3xl border border-rose-100 bg-white/95 p-4 shadow-xl shadow-rose-200/35 backdrop-blur-sm sm:p-6 md:p-8 lg:p-10">

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
                                dict={dict}
                                selected={sel}
                                disabled={disabled}
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
              {/* Step Title */}
              <h2 className="fa-text-gradient text-center text-xl font-bold sm:text-2xl md:text-3xl">
                Informations personnelles
              </h2>

              {/* Info Box */}
              <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-blue-100 bg-blue-50/50 p-4 sm:flex-row sm:items-center sm:p-5">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-white shadow-sm">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p className="text-sm font-medium leading-relaxed text-slate-700">
                    Si vous trouvez un problème lors de la saisie de vos informations pour la réservation, contactez-nous en saisissant vos informations dans le contenu de message et nous traiterons votre réservation tout de suite au{" "}
                    <a href="tel:0788928684" className="font-bold text-blue-600 hover:underline">078 892 86 84</a>
                  </p>
                </div>
                <Link
                  href={`/${locale}/contact`}
                  className="inline-flex items-center gap-2 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-md transition hover:bg-indigo-600 sm:w-auto"
                >
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Contacter
                </Link>
              </div>

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
              <label>
                <span className="mb-2 block text-sm font-semibold text-slate-800">
                  {dict.address}{" "}
                  <span className="text-red-500" aria-hidden>
                    *
                  </span>
                </span>
                <input
                  className={fieldInputClass}
                  value={user.adresse}
                  onChange={(e) => setUser({ ...user, adresse: e.target.value })}
                  autoComplete="street-address"
                />
              </label>
              </div>
            </div>
          ) : null}

          {step === 2 && lesson && selectedSession ? (
            <div className="space-y-6 sm:space-y-8">
              <h2 className="fa-text-gradient text-center text-2xl font-black sm:text-3xl">
                {dict.recapTitle}
              </h2>

              <div className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-2">
                {/* ── Left Card: Course + Participant + Price ── */}
                <div className="flex flex-col gap-6 rounded-2xl border-2 border-violet-100 bg-white/95 p-6 shadow-xl shadow-violet-100/30 sm:p-7 md:p-8">
                  {/* Section Cours */}
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-500">
                      {dict.recapSession}
                    </p>
                    <p className="text-lg font-black leading-tight text-slate-800 sm:text-xl">
                      {lesson.name}
                    </p>
                  </div>

                  {/* Separator */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                  {/* Section Participant */}
                  <div className="flex-1">
                    <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.12em] text-emerald-600">
                      {dict.recapParticipant}
                    </p>
                    <div className="space-y-3.5 rounded-2xl border-2 border-emerald-500/10 bg-emerald-50/20 p-4 shadow-sm">
                      {/* Name */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dict.firstName} / {dict.lastName}</p>
                          <p className="truncate text-sm font-extrabold text-slate-800">{user.prenom} {user.nom}</p>
                        </div>
                      </div>

                      {/* Email */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dict.email}</p>
                          <p className="truncate text-sm font-extrabold text-slate-800">{user.email}</p>
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-pink-600 text-white shadow-md">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dict.phone}</p>
                          <p className="truncate text-sm font-extrabold text-slate-800">{user.telephone}</p>
                        </div>
                      </div>

                      {/* Date Birth */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-md">
                          <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zm-7-9H7v5h5v-5z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dict.birthDate}</p>
                          <p className="truncate text-sm font-extrabold text-slate-800">{user.dateNaissance ? formatBirthDateRecap(user.dateNaissance) : "-"}</p>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="flex items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-sky-600 text-white shadow-md">
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                          </svg>
                        </span>
                        <div className="min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{dict.address}</p>
                          <p className="truncate text-sm font-extrabold text-slate-800">{user.adresse}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Separator */}
                  <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-violet-200 to-transparent" />

                  {/* Section Price */}
                  <div>
                    <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.12em] text-violet-500">
                      {dict.recapPrice}
                    </p>
                    <p className="fa-text-gradient text-3xl font-black sm:text-4xl">
                      {lesson.promotionalPrice || lesson.price} CHF
                    </p>
                  </div>
                </div>

                {/* ── Right Card: Session Details ── */}
                <div className="flex flex-col gap-6 rounded-2xl border-2 border-blue-100 bg-white/95 p-6 shadow-xl shadow-blue-100/30 sm:p-7 md:p-8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-blue-500">
                    {dict.recapSession}
                  </p>
                  <div className="flex flex-col gap-4">
                    {recapSessionFormatted.length > 0 ? (
                      recapSessionFormatted.map((sessionDetail, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col gap-3 rounded-xl border border-blue-100/50 bg-white p-4 shadow-[0_2px_12px_rgba(59,130,246,0.10),0_1px_4px_rgba(0,0,0,0.05)] transition hover:shadow-lg sm:p-5"
                          style={{ border: "1.5px solid rgba(59, 130, 246, 0.18)" }}
                        >
                          {/* Part Title - Gradient Badge like in ReservationCourse */}
                          <div className="mb-1 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-700 px-3 py-1.5 text-center text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                            {sessionDetail.title}
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-3 rounded-lg bg-blue-50/50 px-2.5 py-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-[0_3px_10px_rgba(59,130,246,0.3)]">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
                              </svg>
                            </span>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{sessionDetail.date.title}</p>
                              <p className="text-sm font-black text-slate-800">{sessionDetail.date.value}</p>
                            </div>
                          </div>

                          {/* Time */}
                          <div className="flex items-center gap-3 rounded-lg bg-emerald-50/50 px-2.5 py-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-[0_3px_10px_rgba(16,185,129,0.3)]">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                              </svg>
                            </span>
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{sessionDetail.time.title}</p>
                              <p className="text-sm font-black text-slate-800">{sessionDetail.time.value}</p>
                            </div>
                          </div>

                          {/* Location */}
                          <div className="flex items-center gap-3 rounded-lg bg-rose-50/50 px-2.5 py-2">
                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-rose-500 to-rose-600 text-white shadow-[0_3px_10px_rgba(244,63,94,0.3)]">
                              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                              </svg>
                            </span>
                            <div className="min-w-0">
                              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{sessionDetail.location.title}</p>
                              <p className="truncate text-sm font-black text-slate-800">{sessionDetail.location.value}</p>
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
            <div className="space-y-6 sm:space-y-8">
              <h2 className="fa-text-gradient text-center text-2xl font-black sm:text-3xl">
                {locale === "fr" ? "Méthode de paiement" : "Payment method"}
              </h2>

              <div
                onClick={submit}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border-2 border-violet-100 bg-white p-6 shadow-xl transition-all hover:border-violet-300 hover:shadow-2xl sm:p-8 ${processing ? "opacity-70 pointer-events-none" : ""}`}
              >
                {/* Background Decor */}
                <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full bg-violet-50/50 blur-3xl transition-all group-hover:bg-violet-100/50" />

                <div className="relative flex flex-col items-center gap-6 text-center sm:flex-row sm:justify-center sm:text-left">
                  {/* Icon Wrapper from ReservationCourse */}
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] text-white shadow-[0_4px_16px_rgba(139,92,246,0.3)]">
                    <svg className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-black tracking-tight text-[#7c3aed] drop-shadow-sm sm:text-2xl">
                      {locale === "fr" ? "Paiement par carte" : "Card Payment"}
                    </h3>
                    <p className="mt-2 text-sm font-extrabold leading-relaxed text-[#1e293b] sm:text-base">
                      {locale === "fr" 
                        ? "Paiement sécurisé via Stripe — Facture envoyée par e-mail." 
                        : "Secure Stripe checkout — invoice by email."}
                    </p>

                    {/* Click Indicator Badge from ReservationCourse */}
                    <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[rgba(139,92,246,0.28)] bg-gradient-to-r from-[rgba(124,58,237,0.12)] to-[rgba(236,72,153,0.12)] px-4 py-1.5 text-[11px] font-black uppercase tracking-wider text-[#7c3aed] shadow-sm transition-all group-hover:from-[rgba(124,58,237,0.2)]">
                      <span>{locale === "fr" ? "Cliquez ici pour sélectionner" : "Click here to select"}</span>
                      <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Processing Overlay with Correct Accents */}
                {processing && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/95 backdrop-blur-md">
                    <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#a855f7] border-t-transparent shadow-lg" />
                    <p className="mt-5 text-center font-black tracking-tight text-[#6b21a8]">
                      {locale === "fr" 
                        ? "Ouverture de la page de paiement Stripe sécurisée..." 
                        : "Opening secure Stripe payment page..."}
                    </p>
                  </div>
                )}
              </div>

              {/* Secure Payment Branding Footer */}
              <div className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                <svg className="h-3 w-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" />
                </svg>
                <span>{locale === "fr" ? "Paiement 100% sécurisé" : "100% Secure Payment"}</span>
              </div>
            </div>
          ) : null}
        </>
      )}

      <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
        <div>
          {step > 0 ? (
            <button
              type="button"
              onClick={prevStep}
              className="rounded-xl bg-slate-700 px-8 py-3.5 text-sm font-bold text-white shadow-lg transition hover:bg-slate-800 sm:min-w-[140px] min-h-[48px] touch-manipulation"
            >
              {dict.back}
            </button>
          ) : null}
        </div>

        {step < 3 && (
          <button
            type="button"
            onClick={nextStep}
            disabled={
              (step === 0 && !canGoStep1) || (step === 1 && !canGoStep2)
            }
            className="fa-btn-primary rounded-xl px-8 py-3.5 text-sm font-bold text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-40 sm:min-w-[180px] min-h-[48px] touch-manipulation"
          >
            {step === 2 ? (locale === "fr" ? "Payer" : "Pay") : dict.next}
          </button>
        )}
      </div>
    </div>
    </div>
  );
}

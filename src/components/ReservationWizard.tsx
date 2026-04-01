"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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

export function ReservationWizard({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const router = useRouter();
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

  const [paymentMethod, setPaymentMethod] = useState<"card" | "code" | null>(null);
  const [reservationCode, setReservationCode] = useState("");
  const [validatedCode, setValidatedCode] = useState<string | null>(null);
  const [codeChecking, setCodeChecking] = useState(false);

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

  const handleValidateCode = useCallback(async () => {
    if (!lesson || !reservationCode.trim()) {
      toast.error(dict.toastCodeInvalid, { id: "code-missing" });
      return;
    }
    if (!user.email.trim()) {
      toast.error(dict.required, { id: "email-for-code" });
      return;
    }
    setCodeChecking(true);
    try {
      const r = await api.validateReservationCode(locale, {
        code: reservationCode.trim().toUpperCase(),
        courseType: "PREMIER_SECOURS",
        email: user.email.trim(),
        lessonId: lesson.id,
      });
      if (r.valid) {
        setValidatedCode(reservationCode.trim().toUpperCase());
        toast.success(dict.toastCodeValid, { id: "code-valid" });
      } else {
        setValidatedCode(null);
        toast.error(r.message ?? dict.toastCodeInvalid, { id: "code-invalid" });
      }
    } catch (e) {
      setValidatedCode(null);
      toast.error(parseErrMessage(e) || dict.toastCodeInvalid, { id: "code-err" });
    } finally {
      setCodeChecking(false);
    }
  }, [lesson, reservationCode, user.email, locale, dict]);

  const submit = async () => {
    if (!lesson || !selectedSession || !paymentMethod) return;
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
      if (paymentMethod === "code") {
        const code = validatedCode ?? reservationCode.trim().toUpperCase();
        if (!code) {
          onFail(dict.codeInvalid);
          setProcessing(false);
          return;
        }
        const validate = await api.validateReservationCode(locale, {
          code,
          courseType: "PREMIER_SECOURS",
          email: eleve.email,
          lessonId: lesson.id,
        });
        if (!validate.valid) {
          onFail(validate.message ?? dict.codeInvalid);
          setProcessing(false);
          return;
        }
        const bookingData = {
          lessonId: lesson.id,
          code,
          courseType: "PREMIER_SECOURS" as const,
          typePayment: 3 as const,
          bookingDate,
          eleve,
          sessionChoosed: {
            sessionDetails: selectedSession.sessionDetails,
            remainingSpot: selectedSession.remainingSpot ?? 0,
          },
          language: locale,
        };
        const res = await api.useReservationCode(locale, bookingData);
        if (res.success) {
          toast.success(dict.toastBookingConfirmed, { id: "booking-ok" });
          router.push(`/${locale}/reservation/success`);
        } else {
          onFail(res.message ?? dict.codeInvalid);
        }
      } else {
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
                <span className="mb-2 block text-sm font-semibold text-slate-800">{dict.registerNumber}</span>
                <input
                  className={fieldInputClass}
                  value={user.numeroregister}
                  onChange={(e) => setUser({ ...user, numeroregister: e.target.value })}
                  autoComplete="off"
                />
              </label>
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
          ) : null}

          {step === 2 && lesson && selectedSession ? (
            <div className="space-y-5 sm:space-y-6">
              <h3 className="text-lg font-bold text-slate-900 sm:text-xl">{dict.recapTitle}</h3>
              <div className="overflow-hidden rounded-2xl border border-rose-100 bg-gradient-to-br from-white via-rose-50/30 to-fuchsia-50/40 shadow-lg shadow-rose-100/40">
                <div className="flex items-center gap-3 border-b border-rose-100/80 bg-white/60 px-5 py-3.5 backdrop-blur-sm">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#b827ce] to-[#ff6b9d] text-white shadow-md shadow-rose-400/30 ring-2 ring-white/50"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#be123c]">
                    {dict.recapSession}
                  </p>
                </div>
                <div
                  className={
                    recapSessionFormatted.length > 1
                      ? "grid gap-4 p-5 sm:gap-5 lg:grid-cols-2"
                      : "space-y-4 p-5"
                  }
                >
                  {recapSessionFormatted.length > 0 ? (
                    recapSessionFormatted.map((p, idx) => (
                      <div
                        key={`recap-${idx}`}
                        className="rounded-xl border border-rose-100/60 bg-white/90 p-4 shadow-sm sm:p-5"
                      >
                        <p className="fa-display border-b border-indigo-100 pb-2 text-sm font-extrabold text-[#667eea] sm:text-base">
                          {p.title}
                        </p>
                        <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                          <div className="rounded-lg bg-slate-50/95 px-3 py-2 ring-1 ring-slate-100">
                            <p className="text-[10px] font-bold uppercase text-slate-500">{p.date.title}</p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-900">{p.date.value}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50/95 px-3 py-2 ring-1 ring-slate-100">
                            <p className="text-[10px] font-bold uppercase text-slate-500">{p.time.title}</p>
                            <p className="mt-0.5 text-sm font-semibold text-slate-900">{p.time.value}</p>
                          </div>
                          <div className="rounded-lg bg-slate-50/95 px-3 py-2 ring-1 ring-slate-100 sm:col-span-1">
                            <p className="text-[10px] font-bold uppercase text-slate-500">{p.location.title}</p>
                            <p className="mt-0.5 break-words text-sm font-semibold text-slate-900">
                              {p.location.value}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="whitespace-pre-wrap text-sm text-slate-700">
                      {selectedSession.sessionDetails}
                    </p>
                  )}
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-rose-100 bg-white shadow-md shadow-rose-100/30">
                <div className="flex items-center gap-3 border-b border-rose-100/80 bg-gradient-to-r from-slate-50/90 to-white px-5 py-3.5">
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 text-white shadow-md ring-2 ring-white/40"
                    aria-hidden
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-indigo-800/90">
                    {dict.recapParticipant}
                  </p>
                </div>
                <ul className="space-y-2 p-5 text-sm text-slate-700">
                  <li>
                    <span className="font-semibold text-slate-900">{user.prenom}</span>{" "}
                    <span className="font-semibold text-slate-900">{user.nom}</span>
                  </li>
                  <li>{user.email}</li>
                  <li>{user.telephone}</li>
                  {user.adresse.trim() ? <li className="whitespace-pre-line">{user.adresse}</li> : null}
                </ul>
              </div>
              <div className="flex flex-col gap-2 rounded-2xl border-2 border-[#f43f5e]/20 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50/70 p-5 shadow-inner shadow-rose-100/50 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/25"
                    aria-hidden
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <rect x="2" y="5" width="20" height="14" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </span>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      {dict.recapPrice}
                    </p>
                    <p className="mt-0.5 text-sm font-medium text-slate-700">{lesson.name}</p>
                  </div>
                </div>
                <div className="flex flex-wrap items-baseline gap-2 sm:text-right">
                  {priceDisplay.hasPromo ? (
                    <span className="text-base font-bold tabular-nums text-slate-400 line-through">
                      {priceDisplay.listStr}
                    </span>
                  ) : null}
                  <span className="fa-display text-2xl font-extrabold tabular-nums text-[#be123c] sm:text-3xl">
                    {priceDisplay.payStr}
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {step === 3 && lesson ? (
            <div className="space-y-6">
              <p className="text-sm text-slate-600">{dict.paymentMethod}</p>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("card");
                    setValidatedCode(null);
                  }}
                  className={[
                    "flex gap-4 rounded-2xl border-2 px-4 py-4 text-left transition touch-manipulation min-h-[72px] sm:min-h-[80px]",
                    paymentMethod === "card"
                      ? "border-[#f43f5e]/55 bg-gradient-to-br from-rose-50 to-fuchsia-50/80 text-slate-900 shadow-lg shadow-rose-200/50 ring-1 ring-[#f43f5e]/15"
                      : "border-rose-100/90 bg-white text-slate-800 hover:border-rose-200 hover:shadow-md",
                  ].join(" ")}
                >
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
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("code")}
                  className={[
                    "flex gap-4 rounded-2xl border-2 px-4 py-4 text-left transition touch-manipulation min-h-[72px] sm:min-h-[80px]",
                    paymentMethod === "code"
                      ? "border-violet-400/55 bg-gradient-to-br from-violet-50 to-fuchsia-50/70 text-slate-900 shadow-lg shadow-violet-200/45 ring-1 ring-violet-300/20"
                      : "border-rose-100/90 bg-white text-slate-800 hover:border-rose-200 hover:shadow-md",
                  ].join(" ")}
                >
                  <span
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-fuchsia-500 text-white shadow-md"
                    aria-hidden
                  >
                    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                      <path d="M4 7h16M4 12h8M4 17h5" strokeLinecap="round" />
                      <rect x="14" y="10" width="6" height="8" rx="1" />
                    </svg>
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-900">{dict.payByCode}</div>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-500">{dict.payCodeHint}</p>
                  </div>
                </button>
              </div>

              {paymentMethod === "code" ? (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                  <label className="min-w-0 flex-1">
                    <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                      {dict.reservationCode}
                    </span>
                    <input
                      className="w-full rounded-xl border border-rose-200 bg-white px-4 py-3 font-mono text-base uppercase text-slate-900 outline-none focus:border-[#f43f5e] focus:ring-2 focus:ring-[#f43f5e]/20 min-h-[48px] touch-manipulation"
                      value={reservationCode}
                      onChange={(e) => {
                        setReservationCode(e.target.value);
                        setValidatedCode(null);
                      }}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleValidateCode}
                    disabled={codeChecking || !user.email.trim()}
                    className="w-full shrink-0 rounded-xl border-2 border-[#f43f5e]/40 bg-white px-4 py-3 text-sm font-bold text-[#be123c] hover:bg-rose-50 disabled:opacity-50 sm:w-auto sm:min-w-[140px] min-h-[48px] touch-manipulation"
                  >
                    {codeChecking ? dict.processing : dict.validateCode}
                  </button>
                </div>
              ) : null}

              {paymentMethod === "code" && validatedCode ? (
                <p className="text-sm font-semibold text-emerald-700">{dict.codeValidated}</p>
              ) : null}
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
            disabled={
              processing ||
              !paymentMethod ||
              (paymentMethod === "code" && !validatedCode)
            }
            className="fa-btn-primary w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto sm:min-w-[200px] min-h-[48px] touch-manipulation"
          >
            {processing
              ? dict.processing
              : paymentMethod === "code"
                ? dict.confirmPayCode
                : dict.confirmPayCard}
          </button>
        )}
      </div>
    </div>
  );
}

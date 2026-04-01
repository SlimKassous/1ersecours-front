"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import Calendar from "react-calendar";

import "react-calendar/dist/Calendar.css";

import type { Locale } from "@/lib/i18n";

function usePreferNativeDatePicker(): boolean {
  const [preferNative, setPreferNative] = useState(false);
  useEffect(() => {
    if (typeof navigator === "undefined" || typeof window === "undefined") return;
    const ua = (navigator.userAgent || "").toLowerCase();
    const isMobileUa = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
      ua,
    );
    const hasTouch = navigator.maxTouchPoints > 0 || "ontouchstart" in window;
    const coarsePointer =
      typeof window.matchMedia === "function"
        ? window.matchMedia("(pointer: coarse)").matches
        : false;
    setPreferNative(isMobileUa || (hasTouch && coarsePointer));
  }, []);
  return preferNative;
}

type Props = {
  value: string;
  onChange: (iso: string) => void;
  onBlur?: () => void;
  locale: Locale;
  error?: boolean;
  helperText?: string;
  disabled?: boolean;
  disableFuture?: boolean;
  disablePast?: boolean;
  minYear?: number;
  maxYear?: number;
  defaultCalendarYearOffset?: number;
};

export function DatePickerWithCalendar({
  value,
  onChange,
  onBlur,
  locale,
  error,
  helperText,
  disabled = false,
  disableFuture = false,
  disablePast = false,
  minYear,
  maxYear,
  defaultCalendarYearOffset,
}: Props) {
  const isEnglish = locale === "en";
  const dateFormat = isEnglish ? "DD-MM-YYYY" : "JJ-MM-AAAA";
  const separator = "-";
  const preferNative = usePreferNativeDatePicker();
  const nativeInputRef = useRef<HTMLInputElement | null>(null);
  const anchorFieldRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverSession, setPopoverSession] = useState(0);
  const [popoverStyle, setPopoverStyle] = useState<React.CSSProperties>({});
  const [pendingDate, setPendingDate] = useState<Date | null>(null);
  const [viewMonth, setViewMonth] = useState<Date>(() => new Date());
  const [textValue, setTextValue] = useState("");
  const [invalidDateError, setInvalidDateError] = useState("");

  const getTodayIso = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  };

  const isoToDisplay = useCallback(
    (iso: string): string => {
      if (!iso) return "";
      const [yearStr, monthStr, dayStr] = iso.split("-");
      const year = parseInt(yearStr, 10);
      const month = parseInt(monthStr, 10);
      const day = parseInt(dayStr, 10);
      if (
        Number.isNaN(year) ||
        Number.isNaN(month) ||
        Number.isNaN(day) ||
        year < 1900 ||
        year > 2100 ||
        month < 1 ||
        month > 12 ||
        day < 1 ||
        day > 31
      ) {
        return "";
      }
      const dd = String(day).padStart(2, "0");
      const mm = String(month).padStart(2, "0");
      return `${dd}${separator}${mm}${separator}${year}`;
    },
    [separator],
  );

  useEffect(() => {
    setTextValue(isoToDisplay(value));
  }, [value, isoToDisplay]);

  const getDaysInMonth = (year: number, month: number): number => {
    if (month < 1 || month > 12) return 0;
    if (month === 2) {
      const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
      return isLeap ? 29 : 28;
    }
    const days31 = [1, 3, 5, 7, 8, 10, 12];
    return days31.includes(month) ? 31 : 30;
  };

  const isValidCalendarDate = (day: number, month: number, year: number): boolean => {
    if (month < 1 || month > 12 || year < 1900 || year > 2100 || day < 1) return false;
    return day <= getDaysInMonth(year, month);
  };

  const applyConstraintsAndEmit = useCallback(
    (year: number, month: number, day: number): boolean => {
      const candidate = new Date(year, month - 1, day);
      candidate.setHours(0, 0, 0, 0);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isFuture = candidate > today;
      const isPast = candidate < today;

      if ((disableFuture && isFuture) || (disablePast && isPast)) {
        setInvalidDateError(
          disableFuture
            ? isEnglish
              ? "Future date not allowed"
              : "Date future non autorisée"
            : isEnglish
              ? "Past date not allowed"
              : "Date passée non autorisée",
        );
        onChange("");
        return false;
      }
      if (minYear && year < minYear) {
        setInvalidDateError(
          isEnglish ? `Year must be ≥ ${minYear}` : `L'année doit être ≥ ${minYear}`,
        );
        onChange("");
        return false;
      }
      if (maxYear && year > maxYear) {
        setInvalidDateError(
          isEnglish ? `Year must be ≤ ${maxYear}` : `L'année doit être ≤ ${maxYear}`,
        );
        onChange("");
        return false;
      }
      const iso = `${String(year).padStart(4, "0")}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      setInvalidDateError("");
      onChange(iso);
      return true;
    },
    [disableFuture, disablePast, isEnglish, maxYear, minYear, onChange],
  );

  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value || "";
      let digits = raw.replace(/\D/g, "");
      if (digits.length > 8) digits = digits.slice(0, 8);
      if (digits.length === 0) {
        setTextValue("");
        setInvalidDateError("");
        onChange("");
        return;
      }
      let masked = "";
      if (digits.length <= 2) masked = digits;
      else if (digits.length <= 4)
        masked = `${digits.slice(0, 2)}${separator}${digits.slice(2)}`;
      else
        masked = `${digits.slice(0, 2)}${separator}${digits.slice(2, 4)}${separator}${digits.slice(4)}`;
      setTextValue(masked);
      if (digits.length !== 8) {
        setInvalidDateError("");
        return;
      }
      const day = parseInt(digits.slice(0, 2), 10);
      const month = parseInt(digits.slice(2, 4), 10);
      const year = parseInt(digits.slice(4), 10);
      if (
        Number.isNaN(day) ||
        Number.isNaN(month) ||
        Number.isNaN(year) ||
        !isValidCalendarDate(day, month, year)
      ) {
        setInvalidDateError(
          isEnglish
            ? "Invalid date (e.g. 31/04, 30/02, etc.)"
            : "Date invalide (ex. 31/04, 30/02, etc.)",
        );
        onChange("");
        return;
      }
      applyConstraintsAndEmit(year, month, day);
    },
    [separator, isEnglish, onChange, applyConstraintsAndEmit],
  );

  const computedMinDate = useMemo(() => {
    const candidates: Date[] = [];
    if (disablePast) {
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      candidates.push(t);
    }
    if (minYear) candidates.push(new Date(minYear, 0, 1));
    if (candidates.length === 0) return undefined;
    return new Date(Math.max(...candidates.map((d) => d.getTime())));
  }, [disablePast, minYear]);

  const computedMaxDate = useMemo(() => {
    const candidates: Date[] = [];
    if (disableFuture) {
      const t = new Date();
      t.setHours(0, 0, 0, 0);
      candidates.push(t);
    }
    if (maxYear) candidates.push(new Date(maxYear, 11, 31));
    if (candidates.length === 0) return undefined;
    return new Date(Math.min(...candidates.map((d) => d.getTime())));
  }, [disableFuture, maxYear]);

  const defaultActiveStartDate = useMemo(() => {
    if (defaultCalendarYearOffset != null) {
      const t = new Date();
      return new Date(t.getFullYear() - defaultCalendarYearOffset, t.getMonth(), 1);
    }
    if (value) {
      const [y, m] = value.split("-").map((x) => parseInt(x, 10));
      if (!Number.isNaN(y) && !Number.isNaN(m)) return new Date(y, m - 1, 1);
    }
    if (computedMinDate && computedMaxDate) {
      const mid = (computedMinDate.getTime() + computedMaxDate.getTime()) / 2;
      const d = new Date(mid);
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return computedMinDate || computedMaxDate || new Date();
  }, [defaultCalendarYearOffset, value, computedMinDate, computedMaxDate]);

  const yearOptions = useMemo(() => {
    const y0 = computedMinDate?.getFullYear() ?? 1900;
    const y1 = computedMaxDate?.getFullYear() ?? 2100;
    const lo = Math.min(y0, y1);
    const hi = Math.max(y0, y1);
    const arr: number[] = [];
    for (let y = lo; y <= hi; y++) arr.push(y);
    return arr.length ? arr : [new Date().getFullYear()];
  }, [computedMinDate, computedMaxDate]);

  const calendarLocale = isEnglish ? "en-GB" : "fr-FR";
  const monthLabels = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) =>
        new Date(2024, i, 1).toLocaleDateString(calendarLocale, { month: "long" }),
      ),
    [calendarLocale],
  );

  const minDateNative = useMemo(() => {
    if (disablePast) return getTodayIso();
    if (minYear) return `${String(minYear).padStart(4, "0")}-01-01`;
    return undefined;
  }, [disablePast, minYear]);

  const maxDateNative = useMemo(() => {
    if (disableFuture) return getTodayIso();
    if (maxYear) return `${String(maxYear).padStart(4, "0")}-12-31`;
    return undefined;
  }, [disableFuture, maxYear]);

  const initViewMonthFromDate = (d: Date) => {
    setViewMonth(new Date(d.getFullYear(), d.getMonth(), 1));
  };

  const openDesktopPicker = () => {
    if (disabled) return;
    setPopoverSession((s) => s + 1);
    let base: Date;
    if (value) {
      const [y, m, d] = value.split("-").map((x) => parseInt(x, 10));
      if (!Number.isNaN(y) && !Number.isNaN(m) && !Number.isNaN(d)) {
        base = new Date(y, m - 1, d);
        setPendingDate(base);
        initViewMonthFromDate(base);
        setPopoverOpen(true);
        return;
      }
    }
    setPendingDate(null);
    base = defaultActiveStartDate;
    initViewMonthFromDate(base);
    setPopoverOpen(true);
  };

  const closeDesktopPicker = () => setPopoverOpen(false);

  const handleDesktopReset = () => {
    setPendingDate(null);
    setInvalidDateError("");
    onChange("");
  };

  const handleDesktopOk = () => {
    if (!pendingDate) {
      closeDesktopPicker();
      return;
    }
    const ok = applyConstraintsAndEmit(
      pendingDate.getFullYear(),
      pendingDate.getMonth() + 1,
      pendingDate.getDate(),
    );
    if (ok) closeDesktopPicker();
  };

  const handleCalendarChange = (v: unknown) => {
    let d: Date | null = null;
    if (v instanceof Date) d = v;
    else if (Array.isArray(v) && v[0] instanceof Date) d = v[0];
    if (!d) return;
    setPendingDate(d);
    initViewMonthFromDate(d);
    const ok = applyConstraintsAndEmit(d.getFullYear(), d.getMonth() + 1, d.getDate());
    if (ok) closeDesktopPicker();
  };

  useLayoutEffect(() => {
    if (!popoverOpen || !anchorFieldRef.current) return;
    const r = anchorFieldRef.current.getBoundingClientRect();
    const w = Math.min(window.innerWidth - 16, 360);
    let left = r.left;
    if (left + w > window.innerWidth - 8) left = Math.max(8, window.innerWidth - w - 8);
    setPopoverStyle({
      position: "fixed",
      top: r.bottom + 8,
      left,
      width: w,
      zIndex: 9999,
    });
  }, [popoverOpen, popoverSession]);

  useEffect(() => {
    if (!popoverOpen) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (popoverRef.current?.contains(t)) return;
      if (anchorFieldRef.current?.contains(t)) return;
      setPopoverOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [popoverOpen]);

  const handleNativeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const iso = e.target.value || "";
    if (!iso) {
      setTextValue("");
      setInvalidDateError("");
      onChange("");
      return;
    }
    const [yearStr, monthStr, dayStr] = iso.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);
    const day = parseInt(dayStr, 10);
    if (
      Number.isNaN(year) ||
      Number.isNaN(month) ||
      Number.isNaN(day) ||
      !isValidCalendarDate(day, month, year)
    ) {
      return;
    }
    setTextValue(isoToDisplay(iso));
    applyConstraintsAndEmit(year, month, day);
  };

  const openNativePicker = () => {
    const input = nativeInputRef.current;
    if (!input) return;
    try {
      (input as HTMLInputElement & { showPicker?: () => void }).showPicker?.();
    } catch {
      /* ignore */
    }
    input.focus();
  };

  const openPickerFromButton = () => {
    if (disabled) return;
    if (preferNative) openNativePicker();
    else openDesktopPicker();
  };

  const manualHint = isEnglish
    ? "8 digits (DDMMYYYY) — dashes appear as you type."
    : "8 chiffres (JJMMAAAA) — tirets ajoutés automatiquement.";
  const mobileHint = isEnglish
    ? "Select a date from the native calendar."
    : "Selectionnez une date via le calendrier natif.";
  const resolvedHelper = invalidDateError || helperText || (preferNative ? mobileHint : manualHint);
  const hasErr = Boolean(error || invalidDateError);

  const calendarIcon = (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-violet-600 transition hover:bg-violet-50 disabled:opacity-40"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        openPickerFromButton();
      }}
      aria-label={isEnglish ? "Open calendar" : "Ouvrir le calendrier"}
    >
      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7v-5z" />
      </svg>
    </button>
  );

  if (preferNative) {
    return (
      <div className="relative w-full">
        <input
          ref={nativeInputRef}
          className="pointer-events-none absolute h-0 w-0 opacity-0"
          type="date"
          value={value || ""}
          onChange={handleNativeChange}
          min={minDateNative}
          max={maxDateNative}
          aria-hidden
          tabIndex={-1}
        />
        <div
          className={`flex w-full items-stretch gap-1 rounded-xl border-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-violet-200 ${
            hasErr
              ? "border-red-400 focus-within:border-red-500"
              : "border-[rgba(138,43,226,0.3)] focus-within:border-[rgba(138,43,226,0.7)]"
          }`}
        >
          <input
            type="text"
            readOnly
            disabled={disabled}
            value={textValue}
            onClick={() => !disabled && openNativePicker()}
            onBlur={onBlur}
            placeholder={dateFormat}
            className={`min-h-[48px] flex-1 rounded-l-[10px] border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none ${hasErr ? "text-red-700" : ""}`}
          />
          <div className="flex items-center pr-1">{calendarIcon}</div>
        </div>
        <p className={`mt-1.5 text-xs ${hasErr ? "text-red-600" : "text-slate-500"}`}>
          {resolvedHelper}
        </p>
      </div>
    );
  }

  const headerHint = isEnglish ? "Month & year" : "Mois et année";
  const resetLabel = isEnglish ? "Reset" : "Réinitialiser";

  return (
    <div className="relative w-full">
      <div ref={anchorFieldRef} className="relative w-full">
        <div
          className={`flex w-full items-stretch gap-1 rounded-xl border-2 bg-white shadow-sm focus-within:ring-2 focus-within:ring-violet-200 ${
            hasErr
              ? "border-red-400 focus-within:border-red-500"
              : "border-[rgba(138,43,226,0.3)] focus-within:border-[rgba(138,43,226,0.7)]"
          }`}
        >
          <input
            type="text"
            disabled={disabled}
            value={textValue}
            onChange={handleTextChange}
            onBlur={onBlur}
            placeholder={dateFormat}
            maxLength={10}
            inputMode="numeric"
            autoComplete="off"
            className="min-h-[48px] flex-1 rounded-l-[10px] border-0 bg-transparent px-3 py-2.5 text-sm text-slate-900 outline-none disabled:opacity-50"
          />
          <div className="flex items-center pr-1">{calendarIcon}</div>
        </div>
      </div>
      <p className={`mt-1.5 text-xs ${hasErr ? "text-red-600" : "text-slate-500"}`}>{resolvedHelper}</p>

      {popoverOpen &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={popoverRef}
            style={popoverStyle}
            className="overflow-hidden rounded-2xl border border-violet-200/40 bg-white shadow-[0_12px_40px_rgba(91,33,182,0.18),0_4px_12px_rgba(0,0,0,0.08)]"
          >
            <div className="bg-gradient-to-br from-[#7c3aed] via-[#a855f7] to-[#ec4899] px-4 py-3 text-white">
              <div className="mb-2 text-[0.7rem] font-bold uppercase tracking-[0.06em] opacity-90">
                {headerHint}
              </div>
              <div className="flex gap-2.5">
                <select
                  className="min-w-0 flex-[1.2] rounded-[10px] border border-white/50 bg-white/98 px-2 py-2 text-sm font-semibold text-violet-950 outline-none"
                  value={viewMonth.getMonth()}
                  onChange={(e) => {
                    const month = Number(e.target.value);
                    setViewMonth(new Date(viewMonth.getFullYear(), month, 1));
                  }}
                  aria-label={isEnglish ? "Month" : "Mois"}
                >
                  {monthLabels.map((label, i) => (
                    <option key={label} value={i}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  className="min-w-0 flex-1 rounded-[10px] border border-white/50 bg-white/98 px-2 py-2 text-sm font-semibold text-violet-950 outline-none"
                  value={
                    yearOptions.includes(viewMonth.getFullYear())
                      ? viewMonth.getFullYear()
                      : (yearOptions[yearOptions.length - 1] ?? viewMonth.getFullYear())
                  }
                  onChange={(e) => {
                    const y = Number(e.target.value);
                    setViewMonth(new Date(y, viewMonth.getMonth(), 1));
                  }}
                  aria-label={isEnglish ? "Year" : "Année"}
                >
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="bg-[#fafafa] px-3 pb-1 pt-3">
              <Calendar
                key={popoverSession}
                className="fa-react-calendar-desktop"
                value={pendingDate}
                onChange={handleCalendarChange}
                locale={calendarLocale}
                calendarType="iso8601"
                minDetail="month"
                maxDetail="month"
                showNavigation={false}
                activeStartDate={viewMonth}
                minDate={computedMinDate}
                maxDate={computedMaxDate}
              />
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 bg-white px-4 py-3">
              <button
                type="button"
                onClick={handleDesktopReset}
                className="rounded-[10px] px-3 py-2 text-sm font-semibold text-violet-700 hover:bg-violet-50"
              >
                {resetLabel}
              </button>
              <button
                type="button"
                onClick={handleDesktopOk}
                className="rounded-[10px] bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700"
              >
                OK
              </button>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

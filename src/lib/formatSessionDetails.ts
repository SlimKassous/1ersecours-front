import type { Locale } from "@/lib/i18n";
import type { Session } from "@/lib/api";

const LABELS = {
  fr: { date: "Date", time: "Heure", location: "Lieu" },
  en: { date: "Date", time: "Time", location: "Location" },
} as const;

export type SessionDetail = {
  title: string;
  date: { title: string; value: string };
  time: { title: string; value: string };
  location: { title: string; value: string };
};

/**
 * Parse sessionDetails strings from the backend (FR-shaped) and adapt labels
 * for the site locale — same idea as successdriving ReservationCourse.
 */
export function formatSessionDetails(
  details: string,
  locale: Locale,
): SessionDetail[] {
  const L = LABELS[locale];
  const regex =
    /(\d+(?:ère|ème|ere|eme)? PARTIE)\s+(\w+)\s+(\d{2}\/\d{2}\/\d{4})\s+(\d{2}H\d{2}) à (\d{2}H\d{2})\s+(.+?)(?=\d+(?:ère|ème|ere|eme)? PARTIE|$)/g;

  const dayMapping: Record<string, string> = {
    lundi: "Monday",
    mardi: "Tuesday",
    mercredi: "Wednesday",
    jeudi: "Thursday",
    vendredi: "Friday",
    samedi: "Saturday",
    dimanche: "Sunday",
  };

  const sessions: SessionDetail[] = [];
  let match;
  while ((match = regex.exec(details)) !== null) {
    const partTitle = match[1].trim();
    const dayOfWeek = match[2].trim();
    const date = match[3];
    const startTime = match[4];
    const endTime = match[5];
    const location = match[6].trim();

    const displayPartTitle =
      locale === "en"
        ? partTitle.replace(/^(\d+)(?:ère|ème|ere|eme)?\s*PARTIE$/i, (_, n) => `Part ${n}`)
        : partTitle;
    const translatedDayOfWeek =
      locale === "en"
        ? dayMapping[dayOfWeek.toLowerCase()] || dayOfWeek
        : dayOfWeek;
    const dateText = `${translatedDayOfWeek} ${date}`;
    const timeSeparator = locale === "en" ? " to " : " à ";
    const heureText = `${startTime}${timeSeparator}${endTime}`;

    sessions.push({
      title: displayPartTitle,
      date: { title: L.date, value: dateText },
      time: { title: L.time, value: heureText },
      location: { title: L.location, value: location },
    });
  }

  sessions.sort((a, b) => {
    const dateMatchA = a.date.value.match(/(\d{2}\/\d{2}\/\d{4})/);
    const dateMatchB = b.date.value.match(/(\d{2}\/\d{2}\/\d{4})/);
    if (!dateMatchA && !dateMatchB) return 0;
    if (!dateMatchA) return 1;
    if (!dateMatchB) return -1;
    const [dayA, monthA, yearA] = dateMatchA[1].split("/");
    const [dayB, monthB, yearB] = dateMatchB[1].split("/");
    const dA = new Date(parseInt(yearA, 10), parseInt(monthA, 10) - 1, parseInt(dayA, 10));
    const dB = new Date(parseInt(yearB, 10), parseInt(monthB, 10) - 1, parseInt(dayB, 10));
    return dA.getTime() - dB.getTime();
  });

  return sessions;
}

export function getFirstDateFromSession(sessionDetails: string): Date | null {
  const parts = sessionDetails.split(/\s+/);
  const dateString = parts.find((part) => /\d{2}\/\d{2}\/\d{4}/.test(part));
  if (!dateString) return null;
  const [day, month, year] = dateString.split("/");
  return new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
}

export function sortSessionsByDate(sessionsList: Session[]): Session[] {
  return [...sessionsList].sort((a, b) => {
    const dateA = getFirstDateFromSession(a.sessionDetails);
    const dateB = getFirstDateFromSession(b.sessionDetails);
    if (!dateA && !dateB) return 0;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateA.getTime() - dateB.getTime();
  });
}

/** Comme `getMonthYear` dans ReservationCourse.tsx — titre mois/année de la carte session. */
export function getMonthYearFromSessionDetails(
  sessionDetails: string,
  locale: Locale,
): string {
  const parts = sessionDetails.split(/\s+/);
  const dateString = parts.find((part) => /\d{2}\/\d{2}\/\d{4}/.test(part));
  if (!dateString) return "";
  const [day, month, year] = dateString.split("/");
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
  return new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
    month: "long",
    year: "numeric",
  })
    .format(date)
    .toUpperCase();
}

/** Espace entre jour et date si collés (même logique que ReservationCourse). */
export function formatSessionDateWithSpace(dateValue: string): string {
  const dayDatePattern = /^([A-Za-z]+)(\d{1,2}\/\d{1,2}\/\d{4})$/;
  const match = dateValue.match(dayDatePattern);
  if (match) {
    return `${match[1]} ${match[2]}`;
  }
  return dateValue;
}

/** Lien Maps depuis le libellé lieu (parenthèses adresse), comme ReservationCourse. */
export function getMapsUrlForSessionLocation(locationValue: string): string | null {
  if (!locationValue?.trim()) return null;
  const addressMatch = locationValue.match(/\(([^)]*,\s*\d{4}\s+[^)]+)\)\s*$/);
  const address = addressMatch ? addressMatch[1].trim() : locationValue.trim();
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
}

import type { Locale } from "@/lib/i18n";

/** Même backend Heroku que successdriving (`src/config/env.ts`). */
export const DEFAULT_API_BASE_URL =
  "https://tranquil-hamlet-87902-ddd1e444061e.herokuapp.com";

export function getApiBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_API_BASE_URL?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_API_BASE_URL;
}

function isFirstAidLessonName(name: string): boolean {
  const u = name.toUpperCase();
  return (
    u.includes("SECOURS") ||
    u.includes("FIRST AID") ||
    u.includes("FIRST_AID") ||
    u.includes("1ER SECOURS") ||
    u.includes("1ST AID") ||
    (u.includes("PREMIER") && u.includes("SECOURS"))
  );
}

function localeLessonScore(name: string, locale: Locale): number {
  const u = name.toUpperCase();
  let s = 0;
  if (locale === "fr") {
    if (/SECOURS|SAMARIT|PREMIERS|PREMIER|1ER|1ÈRE/i.test(name)) s += 4;
    if (/\bEN\b|ANGLAIS|ENGLISH/i.test(u)) s += 1;
    if (/FIRST AID|FIRST_AID/i.test(u) && !/SECOURS/.test(u)) s -= 3;
  } else {
    if (/FIRST AID|FIRST_AID|ENGLISH/i.test(u)) s += 4;
    if (/\bEN\b|\(EN\)/i.test(name)) s += 2;
    if (/SECOURS|SAMARIT/i.test(u) && !/FIRST AID|ENGLISH|ANGLAIS/.test(u)) s -= 3;
  }
  return s;
}

export type Lesson = {
  id: number;
  name: string;
  price: number;
  promotionalPrice?: number;
};

export type Session = {
  sessionDetails: string;
  remainingSpot: number;
};

export type BookingEleve = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  dateNaissance: string;
  numeroregister: string;
  adresse: string;
};

export type Address = {
  id: number;
  ville: string;
  service: string;
  rue: string;
  transport: string;
  displayOrder?: number;
};

export type SiteInfo = {
  logoUrl: string;
  mainSiteUrl?: string;
  phone: {
    phoneNumber: string;
    formattedPhoneNumber: string;
    landlineNumber?: string | null;
    formattedLandlineNumber?: string | null;
  };
};

export type BookingPayload = {
  lessonId: number;
  bookingDate: string;
  typePayment: 1 | 3;
  language: Locale;
  courseType: "PREMIER_SECOURS";
  eleve: BookingEleve;
  sessionChoosed: {
    sessionDetails: string;
    remainingSpot?: number;
  };
  code?: string;
};

async function apiFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number } },
): Promise<T> {
  const base = getApiBaseUrl();
  const { next, ...rest } = init ?? {};
  const response = await fetch(`${base}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(rest.headers ?? {}),
    },
    ...(next ? { next } : {}),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `API error (${response.status})`);
  }

  return (await response.json()) as T;
}

export const api = {
  getAddresses(): Promise<Address[]> {
    return apiFetch<Address[]>("/api/addresses");
  },

  getSiteInfo(): Promise<SiteInfo> {
    return apiFetch<SiteInfo>("/api/public/site-info");
  },

  /**
   * Liste les leçons « premiers secours » adaptées à la langue du site (FR vs EN).
   * Override possible : NEXT_PUBLIC_FIRST_AID_LESSON_ID_FR / _EN.
   */
  async getFirstAidLessons(locale: Locale): Promise<Lesson[]> {
    const lessons = await apiFetch<Lesson[]>("/api/lessons", {
      next: { revalidate: 120 },
    });

    const envId =
      locale === "fr"
        ? process.env.NEXT_PUBLIC_FIRST_AID_LESSON_ID_FR
        : process.env.NEXT_PUBLIC_FIRST_AID_LESSON_ID_EN;
    if (envId?.trim()) {
      const id = Number(envId);
      const one = lessons.find((l) => l.id === id);
      if (one && isFirstAidLessonName(one.name)) return [one];
    }

    const candidates = lessons.filter((l) => isFirstAidLessonName(l.name));
    if (candidates.length === 0) return [];
    if (candidates.length === 1) return candidates;

    const good = candidates.filter((l) => localeLessonScore(l.name, locale) >= 1);
    if (good.length > 0) return good;

    return [...candidates].sort(
      (a, b) => localeLessonScore(b.name, locale) - localeLessonScore(a.name, locale),
    );
  },

  getLesson(id: number): Promise<Lesson> {
    return apiFetch<Lesson>(`/api/lessons/${id}`);
  },

  getSessions(lessonId: number): Promise<Session[]> {
    return apiFetch<Session[]>(`/api/bookings/sessions/${lessonId}`);
  },

  validateReservationCode(
    locale: Locale,
    body: { code: string; courseType: "PREMIER_SECOURS"; email: string; lessonId: number },
  ): Promise<{ valid: boolean; message?: string }> {
    return apiFetch<{ valid: boolean; message?: string }>(
      `/api/bookings/${locale}/validate-reservation-code`,
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },

  useReservationCode(
    locale: Locale,
    bookingData: BookingPayload,
  ): Promise<{ success: boolean; message?: string }> {
    return apiFetch<{ success: boolean; message?: string }>(
      `/api/bookings/${locale}/use-reservation-code`,
      {
        method: "POST",
        body: JSON.stringify(bookingData),
      },
    );
  },

  createCheckoutSession(body: {
    amount: number;
    packName: string;
    language: Locale;
    bookingData: BookingPayload;
  }): Promise<{ url?: string; clientSecret?: string }> {
    return apiFetch<{ url?: string; clientSecret?: string }>(
      "/api/create-checkout-session",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
    );
  },
};

import { getApiBaseUrl } from "@/lib/api";

export type BootstrapAddress = {
  id: number;
  ville: string;
  service: string;
  rue: string;
  transport: string;
  displayOrder?: number;
};

export type BootstrapSiteInfo = {
  logoUrl: string;
  mainSiteUrl?: string;
  phone: {
    phoneNumber: string;
    formattedPhoneNumber: string;
    landlineNumber?: string | null;
    formattedLandlineNumber?: string | null;
  };
};

const FALLBACK: BootstrapSiteInfo = {
  logoUrl: "https://success-ds.ch/logo192.webp",
  mainSiteUrl: "https://success-ds.ch",
  phone: {
    phoneNumber: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "+41799380377",
    formattedPhoneNumber:
      process.env.NEXT_PUBLIC_CONTACT_PHONE_DISPLAY ?? "079 938 03 77",
    landlineNumber: null,
    formattedLandlineNumber: null,
  },
};

function cleanTel(raw: string): string {
  return raw.replace(/\s/g, "");
}

export async function loadSiteBootstrap(): Promise<{
  addresses: BootstrapAddress[];
  siteInfo: BootstrapSiteInfo;
}> {
  const base = getApiBaseUrl();

  const [addrRes, siteRes] = await Promise.all([
    fetch(`${base}/api/addresses`, { next: { revalidate: 120 } }),
    fetch(`${base}/api/public/site-info`, { next: { revalidate: 120 } }),
  ]);

  let addresses: BootstrapAddress[] = [];
  if (addrRes.ok) {
    try {
      const rows = (await addrRes.json()) as BootstrapAddress[];
      if (Array.isArray(rows)) addresses = rows;
    } catch {
      /* ignore */
    }
  }

  let siteInfo: BootstrapSiteInfo = { ...FALLBACK };
  if (siteRes.ok) {
    try {
      const raw = (await siteRes.json()) as Record<string, unknown>;
      const phone = raw.phone as BootstrapSiteInfo["phone"] | undefined;
      if (typeof raw.logoUrl === "string" && phone && typeof phone.phoneNumber === "string") {
        siteInfo = {
          logoUrl: raw.logoUrl,
          mainSiteUrl:
            typeof raw.mainSiteUrl === "string" ? raw.mainSiteUrl : FALLBACK.mainSiteUrl,
          phone: {
            phoneNumber: phone.phoneNumber || FALLBACK.phone.phoneNumber,
            formattedPhoneNumber:
              phone.formattedPhoneNumber ||
              phone.phoneNumber ||
              FALLBACK.phone.formattedPhoneNumber,
            landlineNumber: phone.landlineNumber ?? null,
            formattedLandlineNumber: phone.formattedLandlineNumber ?? null,
          },
        };
      }
    } catch {
      siteInfo = { ...FALLBACK };
    }
  }

  return {
    addresses,
    siteInfo: {
      ...siteInfo,
      phone: {
        ...siteInfo.phone,
        phoneNumber: cleanTel(siteInfo.phone.phoneNumber || FALLBACK.phone.phoneNumber),
      },
    },
  };
}

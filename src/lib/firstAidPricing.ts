import { api } from "@/lib/api";
import type { Locale } from "@/lib/i18n";

export type FirstAidHeroPricing = {
  payPrice: number;
  listPrice: number;
  hasPromo: boolean;
} | null;

/**
 * Tarif affiché sur l’accueil : promotionalPrice si définie et inférieure à price, sinon price.
 * La leçon choisie dépend de la locale (FR vs EN), comme pour la réservation.
 */
export async function getFirstAidHeroPricing(locale: Locale): Promise<FirstAidHeroPricing> {
  try {
    const list = await api.getFirstAidLessons(locale);
    if (list.length === 0) return null;
    const l = list[0];
    const listPrice = Number(l.price);
    if (Number.isNaN(listPrice)) return null;
    const promoRaw = l.promotionalPrice;
    const promo =
      promoRaw != null && !Number.isNaN(Number(promoRaw)) ? Number(promoRaw) : null;
    const hasPromo = promo != null && promo < listPrice;
    const payPrice = hasPromo ? promo : listPrice;
    return { payPrice, listPrice, hasPromo };
  } catch {
    return null;
  }
}

import es from "./es.json";
import ca from "./ca.json";
import en from "./en.json";

export const locales = ["es", "ca", "en"] as const;
export type Locale = (typeof locales)[number];
export type Messages = typeof es;

export function isLocale(value: string): value is Locale {
  return locales.some((locale) => locale === value);
}

export const messages: Record<Locale, Messages> = { es, ca, en };

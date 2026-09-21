import type { Metadata } from "next";
import { locales, messages, type Locale } from "@/i18n/messages";

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const ogLocales = { es: "es_ES", ca: "ca_ES", en: "en_US" };

export function pageMetadata(locale: Locale): Metadata {
  const m = messages[locale].metadata;
  const image = {
    url: "/og.png",
    width: 1200,
    height: 630,
    alt: m.imageAlt,
    type: "image/png",
  };
  return {
    metadataBase: new URL(siteUrl),
    title: m.title,
    description: m.description,
    applicationName: "Arrow Secret Santa",
    alternates: {
      canonical: `/${locale}`,
      languages: { es: "/es", ca: "/ca", en: "/en", "x-default": "/es" },
    },
    openGraph: {
      title: m.title,
      description: m.description,
      url: `/${locale}`,
      siteName: "Arrow Secret Santa",
      type: "website",
      locale: ogLocales[locale],
      alternateLocale: locales
        .filter((l) => l !== locale)
        .map((l) => ogLocales[l]),
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.description,
      images: [image],
    },
  };
}

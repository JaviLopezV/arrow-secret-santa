import type { MetadataRoute } from "next";
import { locales } from "@/i18n/messages";
import { siteUrl } from "@/lib/metadata";
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: new URL(`/${locale}`, siteUrl).href,
    alternates: {
      languages: Object.fromEntries(
        locales.map((l) => [l, new URL(`/${l}`, siteUrl).href]),
      ),
    },
  }));
}

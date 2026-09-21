import { notFound } from "next/navigation";
import type { Viewport } from "next";
import { MyUiInitColorSchemeScript } from "@jlopvil/mui-kit/theme";
import { isLocale, locales } from "@/i18n/messages";
import { pageMetadata } from "@/lib/metadata";
import { Providers } from "../providers";
import "@jlopvil/mui-kit/styles.css";
import "../globals.css";

type Props = { children: React.ReactNode; params: Promise<{ locale: string }> };
export const viewport: Viewport = { themeColor: "#253e39" };
export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}
export async function generateMetadata({ params }: Omit<Props, "children">) {
  const { locale } = await params;
  return isLocale(locale) ? pageMetadata(locale) : {};
}
export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <html lang={locale} data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <MyUiInitColorSchemeScript defaultMode="light" />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

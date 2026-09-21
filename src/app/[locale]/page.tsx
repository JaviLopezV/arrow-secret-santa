import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { SantaApp } from "@/components/SantaApp";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <SantaApp locale={locale} m={messages[locale]} />;
}

import { notFound } from "next/navigation";
import { isLocale, messages } from "@/i18n/messages";
import { SantaApp } from "@/components/SantaApp";
import { Faq } from "@/components/Faq";
import { structuredData } from "@/lib/metadata";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData(locale)).replace(
            /</g,
            "\\u003c",
          ),
        }}
      />
      <SantaApp locale={locale} m={messages[locale]}>
        <Faq m={messages[locale]} />
      </SantaApp>
    </>
  );
}

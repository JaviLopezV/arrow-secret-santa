import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isLocale, locales } from "@/i18n/messages";
import {
  documentSlugs,
  isDocument,
  legalDocuments,
  titles,
} from "@/legal/documents";
import { legalIdentity } from "@/legal/config";
import { LegalLinks } from "@/components/LegalLinks";

type Props = { params: Promise<{ locale: string; document: string }> };
export function generateStaticParams() {
  return locales.flatMap((locale) =>
    documentSlugs.map((document) => ({ locale, document })),
  );
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { document } = await params;
  if (!isDocument(document)) return {};
  const title = `${titles[document]} | Arrow Secret Santa`;
  const pending = Object.values(legalIdentity()).some((v) =>
    v.includes("[PENDIENTE:"),
  );
  return {
    title,
    description: titles[document],
    alternates: { canonical: `/es/legal/${document}`, languages: {} },
    openGraph: {
      title,
      description: titles[document],
      url: `/es/legal/${document}`,
      locale: "es_ES",
      alternateLocale: [],
    },
    twitter: { title, description: titles[document] },
    robots: pending
      ? { index: false, follow: true }
      : { index: true, follow: true },
  };
}
export default async function LegalPage({ params }: Props) {
  const { locale, document } = await params;
  if (!isLocale(locale) || !isDocument(document)) notFound();
  const pending = Object.values(legalIdentity()).some((v) =>
    v.includes("[PENDIENTE:"),
  );
  return (
    <main className="legal-page" lang="es" id="main">
      <Link href={`/${locale}`}>← Arrow Secret Santa</Link>
      <p className="eyebrow">
        Información legal · Versión 1.0 · 22 de septiembre de 2026
      </p>
      <h1>{titles[document]}</h1>
      {pending && (
        <aside className="legal-draft" role="note">
          <strong>Documento pendiente de completar.</strong> Faltan datos del
          titular o de la operación del servicio. Esta versión no debe
          considerarse definitiva para la apertura pública.
        </aside>
      )}
      {locale !== "es" && (
        <p>
          {locale === "ca"
            ? "Aquest document està disponible en castellà."
            : "This document is available in Spanish."}
        </p>
      )}
      <nav aria-label="Índice" className="legal-index">
        <ol>
          {legalDocuments()[document].map((section, i) => (
            <li key={section.title}>
              <a href={`#section-${i + 1}`}>
                {section.title.replace(/^\d+\. /, "")}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      {legalDocuments()[document].map((section, i) => (
        <section key={section.title} id={`section-${i + 1}`}>
          <h2>{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </section>
      ))}
      <p>
        Autoridad de control:{" "}
        <a href="https://www.aepd.es">
          Agencia Española de Protección de Datos
        </a>
        .
      </p>
      <LegalLinks locale={locale} />
    </main>
  );
}

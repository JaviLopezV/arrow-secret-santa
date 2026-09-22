import Link from "next/link";
import type { Locale } from "@/i18n/messages";

const copy = {
  es: {
    nav: "Información legal",
    summary: "Privacidad y condiciones",
    labels: ["Aviso legal", "Privacidad", "Cookies", "Condiciones de uso"],
    note: "Antes de añadir participantes, informa a cada persona y comparte la política de privacidad. Incluye solo adultos que esperen participar. Usamos los datos para gestionar el sorteo y enviar los resultados; puedes solicitar acceso, supresión u oposición al responsable indicado en la política. Al iniciar el envío aceptas las condiciones de uso.",
  },
  ca: {
    nav: "Informació legal (castellà)",
    summary: "Privacitat i condicions",
    labels: [
      "Avís legal (ES)",
      "Privacitat (ES)",
      "Galetes (ES)",
      "Condicions d’ús (ES)",
    ],
    note: "Abans d’afegir participants, informa cada persona i comparteix la política de privacitat. Inclou només adults que esperin participar. Fem servir les dades per gestionar el sorteig i enviar els resultats; pots demanar accés, supressió o oposar-te al tractament davant del responsable indicat a la política. En iniciar l’enviament acceptes les condicions d’ús. Documents legals en castellà.",
  },
  en: {
    nav: "Legal information (Spanish)",
    summary: "Privacy and terms",
    labels: [
      "Legal notice (ES)",
      "Privacy (ES)",
      "Cookies (ES)",
      "Terms of use (ES)",
    ],
    note: "Before adding participants, inform each person and share the privacy policy. Only include adults who expect to participate. We use the data to manage the draw and email the results; you may request access or erasure, or object to processing, by contacting the controller identified in the policy. Starting delivery means you accept the terms of use. Legal documents are in Spanish.",
  },
};
export function LegalLinks({
  locale,
  notice = false,
}: {
  locale: Locale;
  notice?: boolean;
}) {
  const t = copy[locale];
  const links = (
    <nav aria-label={t.nav}>
      {["aviso-legal", "privacidad", "cookies", "condiciones"].map(
        (slug, i) => (
          <Link key={slug} href={`/${locale}/legal/${slug}`} hrefLang="es">
            {t.labels[i]}
          </Link>
        ),
      )}
    </nav>
  );
  if (notice) {
    return (
      <details className="legal-notice">
        <summary>{t.summary}</summary>
        <div className="legal-notice-content">
          <p>{t.note}</p>
          {links}
        </div>
      </details>
    );
  }
  return <div className="legal-links">{links}</div>;
}

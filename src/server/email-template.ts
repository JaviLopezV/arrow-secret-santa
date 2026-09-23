import { legalIdentity } from "../legal/config.ts";
import type { Game, Participant } from "../game/types.ts";

type Copy = {
  subject: string;
  gifts: string;
  hello: string;
  gives: string;
  secret: string;
  budget: string;
  date: string;
  event: string;
};
export function escapeHtml(value: string) {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
}
export function emailTemplate(
  game: Game,
  giver: Participant,
  receiver: Participant,
  locale: string,
  m: Copy,
) {
  const identity = legalIdentity();
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "");
  const privacyLink = siteUrl
    ? new URL(
        `/${["es", "ca", "en"].includes(locale) ? locale : "es"}/legal/privacidad`,
        siteUrl,
      ).href
    : "";
  const giftsLink = siteUrl
    ? new URL(
        `/${["es", "ca", "en"].includes(locale) ? locale : "es"}#gifts`,
        siteUrl,
      ).href
    : "";
  const notices: Record<string, string> = {
    es: `Responsable: ${identity.name}. El organizador del sorteo ha facilitado tu nombre y correo para enviarte este resultado, por el interés legítimo en realizar el intercambio esperado. Se utilizan alojamiento, Upstash y Gmail; el nombre de la persona destinataria se comunica a quien le regala. Puedes solicitar acceso, rectificación, supresión, limitación u oponerte al tratamiento escribiendo a ${identity.email}, y reclamar ante la AEPD. Si no esperabas este correo, contacta con el responsable. Información completa sobre conservación, proveedores, transferencias y derechos (en español):`,
    ca: `Responsable: ${identity.name}. L’organitzador del sorteig ha facilitat el teu nom i correu per enviar-te aquest resultat, per l’interès legítim a fer l’intercanvi esperat. S’utilitzen allotjament, Upstash i Gmail; el nom del destinatari es comunica a qui li regala. Pots demanar accés, rectificació, supressió, limitació o oposar-te al tractament escrivint a ${identity.email}, i reclamar davant l’AEPD. Si no esperaves aquest correu, contacta amb el responsable. Informació completa sobre conservació, proveïdors, transferències i drets (en castellà):`,
    en: `Controller: ${identity.name}. The draw organizer provided your name and email to send this result, based on the legitimate interest in carrying out the expected gift exchange. Hosting, Upstash and Gmail are used; the recipient’s name is shared with their giver. To request access, rectification, erasure, restriction or object to processing, contact ${identity.email}. You may complain to the Spanish Data Protection Agency (AEPD). If this email was unexpected, contact the controller. Full information about retention, providers, transfers and rights (in Spanish):`,
  };
  const privacyNotice = notices[locale] || notices.es;
  const privacyText = `${privacyNotice} ${privacyLink || identity.email}`;
  const title = game.title || m.event;
  const details = [
    game.budget
      ? `${m.budget}: ${new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(Number(game.budget))}`
      : "",
    game.date
      ? `${m.date}: ${new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" }).format(new Date(`${game.date}T12:00:00Z`))}`
      : "",
  ].filter(Boolean);
  const text = [
    `${m.hello}, ${giver.name}!`,
    title,
    m.gives,
    receiver.name,
    ...details,
    m.secret,
    ...(giftsLink ? [`${m.gifts}: ${giftsLink}`] : []),
    "Arrow Secret Santa",
    privacyText,
  ].join("\n\n");
  const e = escapeHtml;
  const html = `<!doctype html><html lang="${e(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#fff8ea;font-family:Arial,sans-serif;color:#173c2d"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" style="max-width:560px;background:#fffdf7;border-radius:20px" cellpadding="0" cellspacing="0"><tr><td style="padding:36px"><p style="font-size:12px;letter-spacing:2px;color:#b4232f">ARROW SECRET SANTA</p><h1 style="font-size:28px">${e(title)}</h1><p>${e(m.hello)}, ${e(giver.name)}!</p><p>${e(m.gives)}</p><div style="background:#fbe5df;border-radius:12px;padding:24px;font-size:32px;font-weight:bold;overflow-wrap:anywhere;color:#b4232f">${e(receiver.name)}</div>${details.map((line) => `<p style="font-size:15px">${e(line)}</p>`).join("")}<p style="margin-top:28px;color:#65756a;line-height:1.6">${e(m.secret)}</p>${giftsLink ? `<p style="margin:24px 0"><a href="${e(giftsLink)}" style="display:inline-block;background:#173c2d;color:#fffdf7;padding:14px 22px;border-radius:8px;font-weight:bold;text-decoration:none">${e(m.gifts)}</a></p>` : ""}<hr style="border:0;border-top:1px solid #ddd"><p style="font-size:12px;line-height:1.6;color:#47594e">${e(privacyNotice)} ${privacyLink ? `<a href="${e(privacyLink)}">${e(privacyLink)}</a>` : e(identity.email)}</p></td></tr></table></td></tr></table></body></html>`;
  return {
    subject: `${m.subject} · ${title.replace(/[\r\n]/g, " ")}`,
    text,
    html,
  };
}

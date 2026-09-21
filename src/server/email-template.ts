import type { Game, Participant } from "../game/types.ts";

type Copy = {
  subject: string;
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
    "Arrow Secret Santa",
  ].join("\n\n");
  const e = escapeHtml;
  const html = `<!doctype html><html lang="${e(locale)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head><body style="margin:0;background:#fff8ea;font-family:Arial,sans-serif;color:#173c2d"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center" style="padding:32px 16px"><table role="presentation" width="100%" style="max-width:560px;background:#fffdf7;border-radius:20px" cellpadding="0" cellspacing="0"><tr><td style="padding:36px"><p style="font-size:12px;letter-spacing:2px;color:#b4232f">ARROW SECRET SANTA</p><h1 style="font-size:28px">${e(title)}</h1><p>${e(m.hello)}, ${e(giver.name)}!</p><p>${e(m.gives)}</p><div style="background:#fbe5df;border-radius:12px;padding:24px;font-size:32px;font-weight:bold;overflow-wrap:anywhere;color:#b4232f">${e(receiver.name)}</div>${details.map((line) => `<p style="font-size:15px">${e(line)}</p>`).join("")}<p style="margin-top:28px;color:#65756a;line-height:1.6">${e(m.secret)}</p></td></tr></table></td></tr></table></body></html>`;
  return {
    subject: `${m.subject} · ${title.replace(/[\r\n]/g, " ")}`,
    text,
    html,
  };
}

import nodemailer from "nodemailer";
import { validEmail } from "../game/email.ts";
import type { Email, DeliveryOutcome } from "./send-draw.ts";

export function gmailConfig(env: NodeJS.ProcessEnv = process.env) {
  const user = env.GMAIL_USER?.trim();
  const pass = env.GMAIL_APP_PASSWORD?.replace(/\s/g, "");
  if (!validEmail(user) || !pass || !/^[a-zA-Z]{16}$/.test(pass)) return null;
  return { user, pass };
}

export function createGmailSender(auth: { user: string; pass: string }) {
  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com", port: 465, secure: true, auth,
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true,
  });
  return {
    verify: () => transport.verify(),
    async send(email: Email, messageId: string): Promise<DeliveryOutcome> {
      try {
        const info = await transport.sendMail({ ...email, from: { name: "Arrow Secret Santa", address: auth.user }, messageId });
        return info.accepted.length === 1 ? "accepted" : "rejected";
      } catch (error) {
        const e = error as { code?: string; responseCode?: number };
        // Explicit SMTP refusal or failure before a connection is established is retryable.
        if ((e.responseCode && e.responseCode >= 400 && e.responseCode <= 599) ||
          ["EAUTH", "EDNS", "ECONNECTION"].includes(e.code || "")) return "rejected";
        // A lost connection after DATA may mean Gmail already accepted the message.
        return "unknown";
      }
    },
  };
}

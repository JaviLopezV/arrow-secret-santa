import { createHash } from "node:crypto";
import type { Redis } from "@upstash/redis";
import { draw } from "../game/draw.ts";
import { parseDrawRequest } from "./draw-request.ts";
import { emailTemplate } from "./email-template.ts";
export type Email = { from: string; to: string; subject: string; html: string; text: string };
export type DeliveryOutcome = "accepted" | "rejected" | "unknown";
type Job = { provider?: "gmail"; hash: string; created: number; status: "pending" | "sent"; emails?: Email[] };
const reply = (body: object, status = 200) => ({ body, status });
type Dependencies = {
  redis: Pick<Redis, "get" | "set" | "eval">;
  from: string;
  dailyLimit: number;
  copy: Parameters<typeof emailTemplate>[4];
  send: (email: Email, messageId: string) => Promise<DeliveryOutcome>;
};
export async function sendDraw(input: ReturnType<typeof parseDrawRequest>, { redis, from, dailyLimit, copy, send }: Dependencies) {
  const { game, id, locale } = input;
  const hash = createHash("sha256")
    .update(JSON.stringify({ game, locale }))
    .digest("hex");
  const key = `santa:draw:${id}`;
  try {
    let job = await redis.get<Job>(key);
    if (!job) {
      const assignments = draw(game.participants, game.exclusions);
      if (!assignments) return reply({ error: "impossible" }, 422);
      // Shared daily cap also applies across serverless instances. Fail closed.
      const day = new Date().toISOString().slice(0, 10);
      const limit = Number(dailyLimit);
      if (!Number.isInteger(limit) || limit < 1)
        return reply({ error: "unavailable" }, 503);
      const allowed = await redis.eval(
        "local n = tonumber(redis.call('GET', KEYS[1]) or '0'); if n + tonumber(ARGV[1]) > tonumber(ARGV[2]) then return 0 end; redis.call('INCRBY', KEYS[1], ARGV[1]); redis.call('EXPIRE', KEYS[1], 172800); return 1",
        [`santa:quota:${day}`],
        [game.participants.length, limit],
      );
      if (!allowed) return reply({ error: "sendError" }, 429);
      const emails = assignments.map(({ giver, receiver }) => {
        const person = game.participants.find((p) => p.id === giver)!;
        const recipient = game.participants.find((p) => p.id === receiver)!;
        return {
          from: from,
          to: person.email,
          ...emailTemplate(
            game,
            person,
            recipient,
            locale,
            copy,
          ),
        };
      });
      const candidate: Job = {
        provider: "gmail",
        hash,
        created: Date.now(),
        status: "pending",
        emails,
      };
      await redis.set(key, candidate, { nx: true });
      job = await redis.get<Job>(key);
    }
    if (!job) throw new Error("Missing persisted job");
    if (job.hash !== hash) return reply({ error: "invalid" }, 409);
    if (job.status === "sent") return reply({ status: "sent" });
    // Never replay legacy pending Resend operations through a different provider.
    if (job.provider !== "gmail") return reply({ error: "uncertain" }, 409);
    if (Date.now() - job.created > 7 * 24 * 60 * 60 * 1000)
      return reply({ error: "expired" }, 409);
    for (let index = 0; index < job.emails!.length; index++) {
      const deliveryKey = `${key}:email:${index}`;
      // No expiring lock: after a crash, SMTP delivery is ambiguous and must be reviewed.
      const claim = await redis.eval(
        "local s = redis.call('GET', KEYS[1]); if s == 'sent' then return 2 end; if s and s ~= 'failed' then return 0 end; redis.call('SET', KEYS[1], 'sending'); return 1",
        [deliveryKey], [],
      );
      if (claim === 2) continue;
      if (claim !== 1) return reply({ error: "uncertain" }, 409);
      let outcome: DeliveryOutcome;
      try { outcome = await send(job.emails![index], `<santa-${id}-${index}@gmail.com>`); }
      catch { outcome = "unknown"; }
      if (outcome === "unknown") return reply({ error: "uncertain" }, 409);
      // Store raw strings so the atomic Lua claim can compare them directly.
      await redis.set(deliveryKey, outcome === "accepted" ? "sent" : "failed");
      if (outcome === "rejected") return reply({ error: "sendError" }, 502);
    }
    // Keep only a receipt after success, never return assignments to the browser.
    await redis.set(key, {
      hash,
      created: job.created,
      status: "sent",
    } satisfies Job);
    return reply({ status: "sent" });
  } catch {
    return reply({ error: "sendError" }, 503);
  }
}

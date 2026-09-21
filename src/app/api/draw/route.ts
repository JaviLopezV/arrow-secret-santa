import { Redis } from "@upstash/redis";
import { createGmailSender, gmailConfig } from "@/server/gmail";
import { messages } from "@/i18n/messages";
import { parseDrawRequest } from "@/server/draw-request";
import { sendDraw } from "@/server/send-draw";

export const runtime = "nodejs";
export const maxDuration = 300;
const reply = (body: object, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (
    !origin ||
    origin !==
      (process.env.NEXT_PUBLIC_SITE_URL
        ? new URL(process.env.NEXT_PUBLIC_SITE_URL).origin
        : `${new URL(request.url).protocol}//${request.headers.get("host")}`)
  )
    return reply({ error: "invalid" }, 403);
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    return reply({ error: "invalid" }, 415);
  const {
    UPSTASH_REDIS_REST_URL,
    UPSTASH_REDIS_REST_TOKEN,
  } = process.env;
  const auth = gmailConfig();
  if (
    !auth ||
    !UPSTASH_REDIS_REST_URL ||
    !UPSTASH_REDIS_REST_TOKEN
  )
    return reply({ error: "unavailable" }, 503);
  let input;
  try {
    // Bound streamed bodies too, rather than trusting Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply({ error: "invalid" }, 400);
    const chunks: Uint8Array[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) {
        await reader.cancel();
        return reply({ error: "invalid" }, 413);
      }
      chunks.push(value);
    }
    input = parseDrawRequest(
      JSON.parse(Buffer.concat(chunks).toString("utf8")),
    );
  } catch {
    return reply({ error: "invalid" }, 400);
  }
  const redis = new Redis({
    url: UPSTASH_REDIS_REST_URL,
    token: UPSTASH_REDIS_REST_TOKEN,
  });
  const gmail = createGmailSender(auth);
  const result = await sendDraw(input, {
    redis,
    from: auth.user,
    dailyLimit: Number(process.env.EMAIL_DAILY_LIMIT || 100),
    copy: messages[input.locale].email,
    send: gmail.send,
  });
  return reply(result.body, result.status);
}

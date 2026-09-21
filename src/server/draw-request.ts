import { parseGame } from "../game/storage.ts";
import { validEmail } from "../game/email.ts";
export function parseDrawRequest(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("invalid");
  const { id, locale, game: input } = value as Record<string, unknown>;
  if (
    typeof id !== "string" ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(
      id,
    ) ||
    (locale !== "es" && locale !== "ca" && locale !== "en") ||
    !input ||
    typeof input !== "object"
  )
    throw new Error("invalid");
  const parsed = parseGame(
    JSON.stringify({
      ...input,
      assignments: [],
      opened: [],
      delivery: undefined,
    }),
  );
  if (
    parsed.participants.length < 3 ||
    !parsed.participants.every((p) => validEmail(p.email)) ||
    new Set(parsed.participants.map((p) => p.email!.toLowerCase())).size !==
      parsed.participants.length
  )
    throw new Error("invalid");
  // Whitelist persisted fields; never trust caller-provided results.
  const game = {
    title: parsed.title,
    budget: parsed.budget,
    date: parsed.date,
    participants: parsed.participants.map((p) => ({
      id: p.id,
      name: p.name,
      email: p.email!.toLowerCase(),
    })),
    exclusions: parsed.exclusions,
    assignments: [],
    opened: [],
  };
  return { id, locale: locale as "es" | "ca" | "en", game };
}

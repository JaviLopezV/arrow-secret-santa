import type { Assignment, Exclusion, Participant } from "./types.ts";

/** Fisher–Yates with rejection sampling to avoid modulo bias. */
function shuffled<T>(values: T[]): T[] {
  const result = [...values];
  for (let i = result.length - 1; i > 0; i--) {
    const range = i + 1;
    const limit = 2 ** 32 - (2 ** 32 % range);
    let value: number;
    do {
      value = crypto.getRandomValues(new Uint32Array(1))[0];
    } while (value >= limit);
    const index = value % range;
    [result[i], result[index]] = [result[index], result[i]];
  }
  return result;
}

/** Randomized bipartite matching. Returns null only if no valid draw exists. */
export function draw(
  participants: Participant[],
  exclusions: Exclusion[],
): Assignment[] | null {
  if (participants.length < 3 || participants.length > 30) return null;
  const ids = participants.map((person) => person.id);
  if (new Set(ids).size !== ids.length) return null;
  const candidates = new Map(
    ids.map((giver) => [
      giver,
      shuffled(
        ids.filter(
          (receiver) =>
            receiver !== giver &&
            !exclusions.some(
              ([a, b]) =>
                (a === giver && b === receiver) ||
                (b === giver && a === receiver),
            ),
        ),
      ),
    ]),
  );
  const owners = new Map<string, string>();
  function assign(giver: string, visited: Set<string>): boolean {
    for (const receiver of candidates.get(giver) ?? []) {
      if (visited.has(receiver)) continue;
      visited.add(receiver);
      const previous = owners.get(receiver);
      if (!previous || assign(previous, visited)) {
        owners.set(receiver, giver);
        return true;
      }
    }
    return false;
  }
  for (const giver of shuffled(ids)) {
    if (!assign(giver, new Set())) return null;
  }
  return Array.from(owners, ([receiver, giver]) => ({ giver, receiver }));
}

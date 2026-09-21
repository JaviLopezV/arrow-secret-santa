import { emptyGame, MAX_PARTICIPANTS, type Game } from "./types.ts";

export const storageKey = "arrow-secret-santa:session:v1";

function validDate(value: string): boolean {
  if (value === "") return true;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T12:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}

export function parseGame(raw: string | null): Game {
  if (!raw) return { ...emptyGame };
  const value: Game = JSON.parse(raw);
  if (
    !value ||
    typeof value.title !== "string" ||
    value.title.length > 80 ||
    typeof value.budget !== "string" ||
    !/^(|\d{1,4}(\.\d{0,2})?)$/.test(value.budget) ||
    typeof value.date !== "string" ||
    !validDate(value.date) ||
    !Array.isArray(value.participants) ||
    value.participants.length > MAX_PARTICIPANTS ||
    !value.participants.every(
      (p) =>
        p &&
        typeof p.id === "string" &&
        p.id.length > 0 &&
        typeof p.name === "string" &&
        p.name.trim().length > 0 &&
        p.name.length <= 40,
    ) ||
    !Array.isArray(value.exclusions) ||
    !Array.isArray(value.assignments) ||
    !Array.isArray(value.opened)
  ) {
    throw new Error("Invalid session");
  }
  const ids = new Set(value.participants.map((p) => p.id));
  const names = new Set(
    value.participants.map((p) => p.name.trim().toLocaleLowerCase()),
  );
  if (
    ids.size !== value.participants.length ||
    names.size !== ids.size ||
    !value.exclusions.every(
      (pair) =>
        Array.isArray(pair) &&
        pair.length === 2 &&
        pair[0] !== pair[1] &&
        pair.every((id) => ids.has(id)),
    ) ||
    !value.opened.every((id) => ids.has(id)) ||
    new Set(value.opened).size !== value.opened.length
  ) {
    throw new Error("Invalid participants");
  }
  const assignments = value.assignments;
  if (
    assignments.length &&
    (ids.size < 3 ||
      assignments.length !== ids.size ||
      new Set(assignments.map((a) => a?.giver)).size !== ids.size ||
      new Set(assignments.map((a) => a?.receiver)).size !== ids.size ||
      !assignments.every(
        (a) =>
          a &&
          ids.has(a.giver) &&
          ids.has(a.receiver) &&
          a.giver !== a.receiver &&
          !value.exclusions.some(
            ([x, y]) =>
              (x === a.giver && y === a.receiver) ||
              (y === a.giver && x === a.receiver),
          ),
      ))
  ) {
    throw new Error("Invalid assignments");
  }
  if (!assignments.length && value.opened.length)
    throw new Error("Invalid progress");
  return value;
}

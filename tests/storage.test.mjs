import test from "node:test";
import assert from "node:assert/strict";
import { parseGame } from "../src/game/storage.ts";
import { emptyGame } from "../src/game/types.ts";
const valid = {
  ...emptyGame,
  participants: [
    { id: "a", name: "Ana" },
    { id: "b", name: "Ben" },
    { id: "c", name: "Cam" },
  ],
  assignments: [
    { giver: "a", receiver: "b" },
    { giver: "b", receiver: "c" },
    { giver: "c", receiver: "a" },
  ],
  opened: ["a"],
};
test("empty and complete sessions round trip", () => {
  assert.deepEqual(parseGame(null), emptyGame);
  assert.deepEqual(parseGame(JSON.stringify(valid)), valid);
});
test("rejects corrupt JSON and invalid stored shape", () => {
  for (const raw of [
    "{",
    "null",
    "{}",
    "[]",
    JSON.stringify({ ...valid, participants: [null] }),
  ])
    assert.throws(() => parseGame(raw));
});
test("rejects duplicate identities, names, receivers and invalid exclusions", () => {
  for (const patch of [
    { participants: [...valid.participants, valid.participants[0]] },
    { participants: valid.participants.map((p) => ({ ...p, name: "Ana" })) },
    { assignments: valid.assignments.map((a) => ({ ...a, receiver: "a" })) },
    { exclusions: [["a", "b"]] },
    { exclusions: [["a", "missing"]] },
    { opened: ["missing"] },
    { opened: ["a", "a"] },
    { assignments: [] },
  ])
    assert.throws(() => parseGame(JSON.stringify({ ...valid, ...patch })));
});
test("rejects invalid dates and accepts decimal draft budgets", () => {
  for (const date of ["2026-99-99", "2026-02-31", "invalid", "123456-01-01"]) {
    assert.throws(() => parseGame(JSON.stringify({ ...valid, date })));
  }
  assert.equal(
    parseGame(JSON.stringify({ ...valid, date: "2028-02-29", budget: "25." }))
      .budget,
    "25.",
  );
});

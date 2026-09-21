import test from "node:test";
import assert from "node:assert/strict";
import { draw } from "../src/game/draw.ts";

const people = (n) =>
  Array.from({ length: n }, (_, i) => ({ id: String(i), name: `Person ${i}` }));
function verify(result, participants, exclusions = []) {
  assert.ok(result);
  assert.equal(result.length, participants.length);
  assert.equal(new Set(result.map((a) => a.giver)).size, participants.length);
  assert.equal(
    new Set(result.map((a) => a.receiver)).size,
    participants.length,
  );
  for (const a of result) {
    assert.notEqual(a.giver, a.receiver);
    assert.ok(
      !exclusions.some(
        ([x, y]) =>
          (x === a.giver && y === a.receiver) ||
          (y === a.giver && x === a.receiver),
      ),
    );
  }
}

test("every group size gives and receives once without self assignments", () => {
  for (let n = 3; n <= 30; n++)
    for (let run = 0; run < 30; run++) verify(draw(people(n), []), people(n));
});
test("exclusions apply in both directions", () => {
  const exclusions = [
    ["0", "1"],
    ["2", "3"],
  ];
  for (let run = 0; run < 100; run++)
    verify(draw(people(6), exclusions), people(6), exclusions);
});
test("impossible, too small, too large and duplicate groups fail", () => {
  assert.equal(
    draw(people(3), [
      ["0", "1"],
      ["0", "2"],
    ]),
    null,
  );
  assert.equal(draw(people(3), [["0", "1"]]), null);
  assert.equal(draw(people(2), []), null);
  assert.equal(draw(people(31), []), null);
  assert.equal(draw([people(3)[0], ...people(3).slice(0, 2)], []), null);
});
test("finds restricted valid solutions without mutating input", () => {
  const p = people(4);
  const exclusions = [
    ["0", "1"],
    ["2", "3"],
  ];
  const before = JSON.stringify({ p, exclusions });
  for (let run = 0; run < 100; run++)
    verify(draw(p, exclusions), p, exclusions);
  assert.equal(JSON.stringify({ p, exclusions }), before);
});
test("matching agrees with an exhaustive oracle for every exclusion graph of four people", () => {
  const pairs = [
    ["0", "1"],
    ["0", "2"],
    ["0", "3"],
    ["1", "2"],
    ["1", "3"],
    ["2", "3"],
  ];
  function possible(exclusions, giver = 0, used = []) {
    if (giver === 4) return true;
    return people(4).some(
      ({ id }) =>
        id !== String(giver) &&
        !used.includes(id) &&
        !exclusions.some(
          (pair) => pair.includes(String(giver)) && pair.includes(id),
        ) &&
        possible(exclusions, giver + 1, [...used, id]),
    );
  }
  for (let mask = 0; mask < 64; mask++) {
    const exclusions = pairs.filter((_, i) => mask & (1 << i));
    assert.equal(draw(people(4), exclusions) !== null, possible(exclusions));
  }
});

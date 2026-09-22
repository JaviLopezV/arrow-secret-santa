import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseDrawRequest } from "../src/server/draw-request.ts";
import { emailTemplate } from "../src/server/email-template.ts";
import { validEmail } from "../src/game/email.ts";
const game = {
  title: "<Fiesta>",
  budget: "25",
  date: "2026-12-25",
  participants: ["Ana", "Bob", "Carla"].map((name, i) => ({
    id: String(i),
    name,
    email: `${name.toLowerCase()}@example.com`,
  })),
  exclusions: [],
  assignments: [],
  opened: [],
};
const request = () => ({
  id: "31261230-e564-4a6b-a1e8-f2137c59dd88",
  locale: "es",
  game: structuredClone(game),
});
test("server validates locale, emails, duplicates, participants and exclusions", () => {
  assert.equal(parseDrawRequest(request()).game.participants.length, 3);
  for (const mutate of [
    (r) => (r.locale = "fr"),
    (r) => (r.game.participants[0].email = undefined),
    (r) => (r.game.participants[0].email = "x\r\n@example.com"),
    (r) => (r.game.participants[0].email = "BOB@example.com"),
    (r) => r.game.participants.pop(),
    (r) => r.game.exclusions.push(["0", "unknown"]),
  ]) {
    const r = request();
    mutate(r);
    assert.throws(() => parseDrawRequest(r));
  }
});
test("ignores supplied assignments and strips unknown data", () => {
  const r = request();
  r.game.assignments = [{ giver: "0", receiver: "0" }];
  r.game.secret = "untrusted";
  const parsed = parseDrawRequest(r);
  assert.deepEqual(parsed.game.assignments, []);
  assert.equal(parsed.game.secret, undefined);
});
test("email templates escape user input, contain one recipient result and localize dates/currency", async () => {
  for (const locale of ["es", "ca", "en"]) {
    const m = JSON.parse(
      await readFile(
        new URL(`../src/i18n/${locale}.json`, import.meta.url),
        "utf8",
      ),
    );
    const email = emailTemplate(
      game,
      game.participants[0],
      { ...game.participants[1], name: "<Bob & friends>" },
      locale,
      m.email,
    );
    assert.ok(email.html.includes("&lt;Bob &amp; friends&gt;"));
    assert.ok(!email.html.includes("<Fiesta>"));
    assert.ok(email.text.includes("<Bob & friends>"));
    assert.ok(!email.text.includes("Carla"));
    assert.ok(email.text.includes(m.email.gives));
    assert.ok(email.html.includes(`lang="${locale}"`));
    assert.ok(email.text.includes("25"));
    const minimal = emailTemplate(
      { ...game, date: "", budget: "" },
      game.participants[0],
      game.participants[1],
      locale,
      m.email,
    );
    assert.ok(!minimal.text.includes(m.email.budget + ":"));
  }
});
test("email validation rejects multiple addresses and header injection", () => {
  for (const value of [
    "a@example.com,b@example.com",
    "a@example.com\nBcc:x@y.com",
    "a@",
    "",
    null,
  ])
    assert.equal(validEmail(value), false);
  assert.equal(validEmail("ana+gift@example.com"), true);
});

import { sendDraw } from "../src/server/send-draw.ts";
import { gmailConfig } from "../src/server/gmail.ts";
const copy = JSON.parse(
  await readFile(new URL("../src/i18n/es.json", import.meta.url), "utf8"),
).email;
function harness() {
  const records = new Map();
  const calls = [];
  const redis = {
    async get(key) {
      return structuredClone(records.get(key) ?? null);
    },
    async set(key, value, options) {
      if (!options?.nx || !records.has(key))
        records.set(key, structuredClone(value));
    },
    async eval(script, keys) {
      if (script.includes("INCRBY")) return 1;
      const state = records.get(keys[0]);
      if (state === "sent") return 2;
      if (state && state !== "failed") return 0;
      records.set(keys[0], "sending");
      return 1;
    },
  };
  const deps = {
    redis,
    from: "test@gmail.com",
    copy,
    dailyLimit: 100,
    async send(email, messageId) {
      calls.push({ email, messageId });
      return "accepted";
    },
  };
  return { records, calls, deps };
}
test("successful Gmail draw sends privately, removes payload and never sends again", async () => {
  const { records, calls, deps } = harness();
  const input = parseDrawRequest(request());
  assert.deepEqual(await sendDraw(input, deps), {
    body: { status: "sent" },
    status: 200,
  });
  assert.equal(calls.length, 3);
  assert.equal(new Set(calls.map((e) => e.email.to)).size, 3);
  assert.equal(records.get(`santa:draw:${input.id}`).emails, undefined);
  await sendDraw(input, deps);
  assert.equal(calls.length, 3);
});
test("explicit failure retries only unconfirmed recipients with identical result", async () => {
  const { calls, deps } = harness();
  const input = parseDrawRequest(request());
  deps.send = async (email, messageId) => {
    calls.push({ email, messageId });
    return calls.length === 2 ? "rejected" : "accepted";
  };
  assert.equal((await sendDraw(input, deps)).status, 502);
  assert.equal((await sendDraw(input, deps)).status, 200);
  assert.equal(calls.length, 4);
  assert.deepEqual(calls[1], calls[2]);
  assert.notEqual(calls[0].email.to, calls[2].email.to);
});
test("unknown SMTP acceptance blocks automatic resending even after retries", async () => {
  const { calls, deps } = harness();
  deps.send = async (email) => {
    calls.push(email);
    throw new Error("lost after DATA");
  };
  const input = parseDrawRequest(request());
  assert.equal((await sendDraw(input, deps)).body.error, "uncertain");
  assert.equal((await sendDraw(input, deps)).body.error, "uncertain");
  assert.equal(calls.length, 1);
});
test("concurrent attempts never send the same recipient twice", async () => {
  const { calls, deps } = harness();
  const input = parseDrawRequest(request());
  await Promise.all([sendDraw(input, deps), sendDraw(input, deps)]);
  await sendDraw(input, deps);
  assert.equal(calls.length, 3);
  assert.equal(new Set(calls.map((c) => c.messageId)).size, 3);
});
test("Redis failure after SMTP acceptance does not cause a duplicate", async () => {
  const { calls, deps } = harness();
  const original = deps.redis.set;
  deps.redis.set = async (key, value, options) => {
    if (value === "sent") throw new Error("offline");
    return original(key, value, options);
  };
  const input = parseDrawRequest(request());
  assert.equal((await sendDraw(input, deps)).status, 503);
  deps.redis.set = original;
  assert.equal((await sendDraw(input, deps)).body.error, "uncertain");
  assert.equal(calls.length, 1);
});
test("legacy pending Resend operations and changed payloads cannot send", async () => {
  const { records, calls, deps } = harness();
  const input = parseDrawRequest(request());
  deps.send = async () => "rejected";
  await sendDraw(input, deps);
  delete records.get(`santa:draw:${input.id}`).provider;
  assert.equal((await sendDraw(input, deps)).body.error, "uncertain");
  assert.equal((await sendDraw({ ...input, locale: "en" }, deps)).status, 409);
  assert.equal(calls.length, 0);
});
test("quota and impossible exclusions stop sending", async () => {
  const { calls, deps } = harness();
  deps.redis.eval = async () => 0;
  const input = parseDrawRequest(request());
  assert.equal((await sendDraw(input, deps)).status, 429);
  input.game.exclusions = [
    ["0", "1"],
    ["0", "2"],
  ];
  assert.equal((await sendDraw(input, deps)).body.error, "impossible");
  assert.equal(calls.length, 0);
});
test("Gmail configuration requires an app password and strips Google display spaces", () => {
  assert.equal(gmailConfig({}), null);
  assert.equal(
    gmailConfig({ GMAIL_USER: "user@gmail.com", GMAIL_APP_PASSWORD: "short" }),
    null,
  );
  assert.deepEqual(
    gmailConfig({
      GMAIL_USER: " user@gmail.com ",
      GMAIL_APP_PASSWORD: "abcd efgh ijkl mnop",
    }),
    { user: "user@gmail.com", pass: "abcdefghijklmnop" },
  );
});

test("participant privacy information is present in HTML and text with a localized absolute link", async (t) => {
  const previous = process.env.NEXT_PUBLIC_SITE_URL;
  process.env.NEXT_PUBLIC_SITE_URL = "https://santa.example.com";
  t.after(() => {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_SITE_URL;
    else process.env.NEXT_PUBLIC_SITE_URL = previous;
  });
  for (const locale of ["es", "ca", "en"]) {
    const m = JSON.parse(
      await readFile(
        new URL(`../src/i18n/${locale}.json`, import.meta.url),
        "utf8",
      ),
    );
    const email = emailTemplate(
      game,
      game.participants[0],
      game.participants[1],
      locale,
      m.email,
    );
    const url = `https://santa.example.com/${locale}/legal/privacidad`;
    assert.ok(email.text.includes(url));
    assert.ok(email.html.includes(`href="${url}"`));
    assert.ok(email.text.includes("AEPD"));
    assert.ok(email.html.includes("AEPD"));
    assert.ok(!email.text.includes(game.participants[2].email));
  }
});

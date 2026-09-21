import { readFile } from "node:fs/promises";
import test from "node:test";
import assert from "node:assert/strict";
function keys(value, prefix = "") {
  return Object.entries(value)
    .flatMap(([key, child]) =>
      typeof child === "object"
        ? keys(child, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    )
    .sort();
}
test("all three languages provide the same complete translation keys", async () => {
  const messages = await Promise.all(
    ["es", "ca", "en"].map(async (locale) =>
      JSON.parse(
        await readFile(
          new URL(`../src/i18n/${locale}.json`, import.meta.url),
          "utf8",
        ),
      ),
    ),
  );
  for (const m of messages) {
    assert.deepEqual(keys(m), keys(messages[0]));
    assert.ok(m.metadata.title.length > 10);
    assert.ok(m.metadata.description.length > 40);
  }
});

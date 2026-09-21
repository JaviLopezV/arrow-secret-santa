import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const base =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
const locales = ["es", "ca", "en"];
function attribute(tag, name) {
  return tag.match(new RegExp(`${name}="([^"]*)"`))?.[1];
}
for (const locale of locales) {
  const html = await readFile(
    new URL(`../.next/server/app/${locale}.html`, import.meta.url),
    "utf8",
  );
  const tags = html.match(/<(?:meta|link)\b[^>]*>/g) ?? [];
  const meta = (name) =>
    tags.find(
      (tag) =>
        attribute(tag, "property") === name || attribute(tag, "name") === name,
    );
  assert.ok(html.includes(`<html lang="${locale}"`));
  assert.ok(html.includes("<title>Arrow Secret Santa"));
  assert.ok(attribute(meta("description"), "content").length > 40);
  assert.equal(
    attribute(
      tags.find((tag) => attribute(tag, "rel") === "canonical"),
      "href",
    ),
    new URL(`/${locale}`, base).href,
  );
  for (const lang of [...locales, "x-default"]) {
    const alternate = tags.find((tag) => attribute(tag, "hrefLang") === lang);
    assert.equal(
      attribute(alternate, "href"),
      new URL(`/${lang === "x-default" ? "es" : lang}`, base).href,
    );
  }
  assert.equal(
    attribute(meta("og:url"), "content"),
    new URL(`/${locale}`, base).href,
  );
  assert.equal(
    attribute(meta("og:image"), "content"),
    new URL("/og.png", base).href,
  );
  assert.equal(attribute(meta("og:image:width"), "content"), "1200");
  assert.equal(attribute(meta("og:image:height"), "content"), "630");
  assert.ok(attribute(meta("og:image:alt"), "content").length > 20);
  assert.equal(
    attribute(meta("twitter:card"), "content"),
    "summary_large_image",
  );
  assert.ok(attribute(meta("twitter:image:alt"), "content").length > 20);
  console.log(
    `${locale}: language, title, description, canonical, alternates, Open Graph and Twitter OK`,
  );
}
const png = await readFile(new URL("../public/og.png", import.meta.url));
assert.equal(png.subarray(1, 4).toString(), "PNG");
assert.equal(png.readUInt32BE(16), 1200);
assert.equal(png.readUInt32BE(20), 630);
console.log("og.png: 1200 × 630 OK");

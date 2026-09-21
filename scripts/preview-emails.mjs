import { mkdir, readFile, writeFile } from "node:fs/promises";
import { emailTemplate } from "../src/server/email-template.ts";
const output = new URL("../email-previews/", import.meta.url);
await mkdir(output, { recursive: true });
const game = { title: "", budget: "25", date: "2026-12-25" };
for (const locale of ["es", "ca", "en"]) {
  const m = JSON.parse(
    await readFile(
      new URL(`../src/i18n/${locale}.json`, import.meta.url),
      "utf8",
    ),
  );
  const email = emailTemplate(
    game,
    { name: "Alex" },
    { name: "Julia" },
    locale,
    m.email,
  );
  await writeFile(new URL(`${locale}.html`, output), email.html);
  await writeFile(new URL(`${locale}.txt`, output), email.text);
}
console.log(
  "Plantillas de prueba generadas en email-previews/ (no se ha enviado ningún email).",
);

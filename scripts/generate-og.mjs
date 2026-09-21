import sharp from "sharp";
import { readFile } from "node:fs/promises";

const gift = (
  await readFile(new URL("../public/gift.svg", import.meta.url))
).toString("base64");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#f8f5ee"/>
<rect x="0" y="0" width="1200" height="12" fill="#253e39"/>
<circle cx="1050" cy="310" r="430" fill="#eeede2"/>
<rect x="72" y="64" width="54" height="54" rx="14" fill="#253e39"/>
<path d="M88 102l22-22M90 80h20v20" fill="none" stroke="#fff3dd" stroke-width="5"/>
<text x="144" y="102" font-family="Arial,sans-serif" font-size="38" font-weight="700" fill="#253e39">arrow</text>
<text x="74" y="230" font-family="Arial,sans-serif" font-size="18" font-weight="700" letter-spacing="5" fill="#ad442e">A LITTLE SECRET. A LOVELY SURPRISE.</text>
<text x="67" y="341" font-family="Arial,sans-serif" font-size="94" font-weight="700" letter-spacing="-5" fill="#253e39">Secret</text>
<text x="67" y="438" font-family="Arial,sans-serif" font-size="94" font-weight="700" letter-spacing="-5" fill="#ad442e">Santa.</text>
<text x="74" y="542" font-family="Arial,sans-serif" font-size="21" fill="#53655a">ES / CA / EN</text>
<image href="data:image/svg+xml;base64,${gift}" x="610" y="100" width="560" height="402"/>
</svg>`;
await sharp(Buffer.from(svg))
  .png()
  .toFile(new URL("../public/og.png", import.meta.url).pathname);

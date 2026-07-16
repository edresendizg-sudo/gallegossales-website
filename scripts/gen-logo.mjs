// Generates self-contained logo.svg + favicon.svg for Gallegos Trailers.
// The wordmark uses Saira Condensed 800 (OFL), subset to the logo glyphs and
// embedded as a base64 data URI, so the SVGs render identically anywhere
// (header, footer, <img>, favicon, social preview) with no external font.
// Design: elongated hexagon badge, red gloss gradient, dark "Trailers" ribbon,
// bold italic sans wordmark — a faithful recreation of the brand logo.
// Run: `npm run logo`.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const b64 = readFileSync(resolve(ROOT, "assets/fonts/saira-condensed-subset.woff2")).toString("base64");

const fontFace = `@font-face{font-family:"Saira Condensed";font-style:normal;font-weight:800;src:url(data:font/woff2;base64,${b64}) format("woff2");}`;

// Elongated hexagon badge path (viewBox 300 x 152)
const HEX = "M52,8 Q150,1 248,8 Q272,12 294,76 Q272,140 248,144 Q150,151 52,144 Q28,140 6,76 Q28,12 52,8 Z";

const logo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 152" role="img" aria-label="Gallegos Trailers">
  <defs>
    <style>${fontFace} .wm{font-family:"Saira Condensed",sans-serif;font-weight:800;fill:#fff;}</style>
    <radialGradient id="gtsRed" cx="0.5" cy="0.28" r="0.78">
      <stop offset="0" stop-color="#f5333a"/><stop offset="0.6" stop-color="#d8151c"/><stop offset="1" stop-color="#a30d12"/>
    </radialGradient>
    <linearGradient id="gtsDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#4a4d53"/><stop offset="1" stop-color="#232529"/>
    </linearGradient>
    <path id="gtsHex" d="${HEX}"/>
    <clipPath id="gtsClip"><use href="#gtsHex"/></clipPath>
  </defs>
  <g clip-path="url(#gtsClip)">
    <rect x="0" y="0" width="300" height="152" fill="url(#gtsRed)"/>
    <ellipse cx="150" cy="24" rx="150" ry="34" fill="#ffffff" opacity="0.10"/>
    <path d="M6,104 Q150,96 294,104 L294,152 L6,152 Z" fill="url(#gtsDark)"/>
    <path d="M6,104 Q150,96 294,104" fill="none" stroke="#eceff3" stroke-width="2.4" opacity="0.9"/>
  </g>
  <use href="#gtsHex" fill="none" stroke="#7d0a0f" stroke-width="1.5" opacity="0.4"/>
  <g transform="skewX(-10)">
    <text class="wm" x="164" y="86" text-anchor="middle" font-size="78" stroke="#6f090d" stroke-width="1.6" paint-order="stroke" stroke-linejoin="round" letter-spacing="-1">Gallegos</text>
  </g>
  <g transform="skewX(-10)">
    <text class="wm" x="172" y="138" text-anchor="middle" font-size="30" letter-spacing="3">Trailers</text>
  </g>
  <text x="242" y="132" font-family="Arial, sans-serif" font-size="10" font-style="italic" fill="#ffffff" opacity="0.85">MR</text>
</svg>
`;
writeFileSync(resolve(ROOT, "assets/img/logo.svg"), logo);
console.log("wrote assets/img/logo.svg (", logo.length, "bytes )");

// Favicon: compact red badge with an italic "G" + TRAILERS bar
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Gallegos Trailers">
  <defs>
    <style>${fontFace}</style>
    <radialGradient id="fvRed" cx="0.5" cy="0.3" r="0.8"><stop offset="0" stop-color="#f5333a"/><stop offset="0.6" stop-color="#d8151c"/><stop offset="1" stop-color="#a30d12"/></radialGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#fvRed)"/>
  <rect y="45" width="64" height="19" fill="#26292e"/>
  <g transform="skewX(-10)"><text x="34" y="42" text-anchor="middle" font-family="'Saira Condensed',sans-serif" font-weight="800" font-size="42" fill="#ffffff" stroke="#6f090d" stroke-width="1" paint-order="stroke">G</text></g>
  <text x="32" y="59" text-anchor="middle" font-family="Arial, sans-serif" font-size="9" font-weight="800" font-style="italic" fill="#ffffff" letter-spacing="1">TRAILERS</text>
</svg>
`;
writeFileSync(resolve(ROOT, "assets/img/favicon.svg"), favicon);
console.log("wrote assets/img/favicon.svg");

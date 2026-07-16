// Generates a self-contained logo.svg with the Kaushan Script font embedded
// as a base64 data URI, so the wordmark renders identically anywhere the SVG
// is used (header, footer, as an <img>, favicon, social preview) without
// depending on an external font. Run: `npm run logo`.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const woff2 = readFileSync(resolve(ROOT, "assets/fonts/kaushan-subset.woff2"));
const b64 = woff2.toString("base64");

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 116" role="img" aria-label="Gallegos Trailers">
  <defs>
    <style>
      @font-face{
        font-family:"Kaushan Script";
        font-style:normal;font-weight:400;
        src:url(data:font/woff2;base64,${b64}) format("woff2");
      }
      .wm{font-family:"Kaushan Script",cursive;fill:#fff;}
    </style>
    <linearGradient id="gtsRed" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#ee2129"/><stop offset="0.5" stop-color="#d4121a"/><stop offset="1" stop-color="#9d0c11"/>
    </linearGradient>
    <linearGradient id="gtsDark" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#41444a"/><stop offset="1" stop-color="#212327"/>
    </linearGradient>
    <clipPath id="gtsBadge"><rect x="3" y="3" width="294" height="110" rx="20"/></clipPath>
  </defs>
  <g clip-path="url(#gtsBadge)">
    <rect x="3" y="3" width="294" height="110" fill="url(#gtsRed)"/>
    <ellipse cx="150" cy="20" rx="180" ry="30" fill="#ffffff" opacity="0.08"/>
    <path d="M3 84 Q150 72 297 84 L297 113 L3 113 Z" fill="url(#gtsDark)"/>
  </g>
  <rect x="3" y="3" width="294" height="110" rx="20" fill="none" stroke="#7d0a0f" stroke-width="1.5" opacity="0.35"/>
  <text class="wm" x="150" y="70" text-anchor="middle" font-size="62" stroke="#7a090e" stroke-width="1.3" paint-order="stroke" stroke-linejoin="round">Gallegos</text>
  <text class="wm" x="150" y="104" text-anchor="middle" font-size="27" letter-spacing="1">Trailers</text>
  <text x="248" y="94" font-family="Arial, sans-serif" font-size="9" fill="#ffffff" opacity="0.85">MR</text>
</svg>
`;

writeFileSync(resolve(ROOT, "assets/img/logo.svg"), svg);
console.log("wrote assets/img/logo.svg with embedded font (", svg.length, "bytes )");

// Favicon: compact badge with a script "G" (font embedded so it renders anywhere)
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Gallegos Trailers">
  <defs>
    <style>
      @font-face{font-family:"Kaushan Script";font-style:normal;font-weight:400;src:url(data:font/woff2;base64,${b64}) format("woff2");}
    </style>
    <linearGradient id="fvRed" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ee2129"/><stop offset="1" stop-color="#9d0c11"/></linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#fvRed)"/>
  <rect y="45" width="64" height="19" fill="#26292e" opacity="0.95"/>
  <text x="32" y="44" text-anchor="middle" font-family="'Kaushan Script',cursive" font-size="46" fill="#ffffff" stroke="#7a090e" stroke-width="1" paint-order="stroke">G</text>
  <text x="32" y="59" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" font-weight="800" font-style="italic" fill="#ffffff" letter-spacing="1">TRAILERS</text>
</svg>
`;
writeFileSync(resolve(ROOT, "assets/img/favicon.svg"), favicon);
console.log("wrote assets/img/favicon.svg");

// Generates branded SVG placeholder images.
// Replace these with real compressed product photos (.jpg/.webp) before launch.
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const images = [
  ["assets/img/steel-pneumatic-dry-bulk-trailer.svg", "Steel Pneumatic", "Dry Bulk Trailer"],
  ["assets/img/aluminum-pneumatic-dry-bulk-trailer.svg", "Aluminum Pneumatic", "Dry Bulk Trailer"],
  ["assets/img/vacuum-tank-trailer.svg", "Vacuum Tank", "Trailer"],
  ["assets/img/demolition-end-dump-trailer.svg", "Demolition", "End Dump Trailer"],
  ["assets/img/belly-dump-trailer.svg", "Belly / Bottom", "Dump Trailer"],
  ["assets/img/california-dirt-dauber-set.svg", "California", "Dirt Dauber Set"],
];

function svg(line1, line2) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" role="img" aria-label="${line1} ${line2}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#16304f"/>
      <stop offset="1" stop-color="#0b1a30"/>
    </linearGradient>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M40 0H0V40" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="800" height="500" fill="url(#g)"/>
  <rect width="800" height="500" fill="url(#grid)"/>
  <g transform="translate(400 195)" fill="none" stroke="#e2571f" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">
    <rect x="-150" y="-45" width="230" height="70" rx="6"/>
    <path d="M80 -30 h50 l30 35 v20 h-80 z"/>
    <circle cx="-95" cy="40" r="20"/>
    <circle cx="-40" cy="40" r="20"/>
    <circle cx="120" cy="40" r="20"/>
    <path d="M-150 25 h55 M-20 25 h120" stroke-opacity="0.5"/>
  </g>
  <text x="400" y="315" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800">${line1}</text>
  <text x="400" y="360" text-anchor="middle" fill="#ffffff" font-family="Segoe UI, Arial, sans-serif" font-size="40" font-weight="800">${line2}</text>
  <text x="400" y="410" text-anchor="middle" fill="#9fb0c6" font-family="Segoe UI, Arial, sans-serif" font-size="19" letter-spacing="2">GALLEGOS TRAILER SALES</text>
</svg>
`;
}

for (const [path, l1, l2] of images) {
  const full = resolve(root, path);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, svg(l1, l2));
  console.log("wrote", path);
}

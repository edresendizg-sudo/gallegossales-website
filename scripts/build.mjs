// =========================================================
// Static-site generator for gallegossales.com
// Zero runtime dependencies — emits plain HTML/CSS/JS that
// can be hosted on any static host. Run: `npm run build`.
// Edit page CONTENT and shared LAYOUT here; the served files
// are the generated *.html in the repo root and subfolders.
// =========================================================
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://gallegossales.com";
const PHONE_DISPLAY = "956-378-5818";
const PHONE_TEL = "+19563785818";
const WHATSAPP = "https://wa.me/19563785818";

// ---- Shared nav definition (single source of truth) ----
const NAV = [
  { href: "/bulk/", label: "Dry Bulk", key: "bulk" },
  { href: "/liquid/", label: "Vacuum Tank", key: "liquid" },
  { href: "/scrap-metal-demolition/", label: "Scrap &amp; Demolition", key: "scrap" },
  { href: "/construction-aggregates/", label: "Construction", key: "construction" },
  { href: "/single-hopper/", label: "Single Hopper", key: "hopper" },
  { href: "/about/", label: "About", key: "about" },
  { href: "/contact/", label: "Contact", key: "contact" },
];

const waIcon = `<svg width="22" height="22" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true"><path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4 6.6 0 12-5.4 12-12S22.6 3 16 3zm0 21.8c-1.8 0-3.5-.5-5-1.3l-.4-.2-4.9 1 1-4.8-.2-.4c-.9-1.6-1.4-3.3-1.4-5.1C5.1 9.6 9.9 4.8 16 4.8S26.9 9.6 26.9 15 22.1 24.8 16 24.8zm5.9-7.3c-.3-.2-1.9-1-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.3-.6-.4z"/></svg>`;

function header(active) {
  const links = NAV.map(
    (n) =>
      `          <li><a href="${n.href}"${n.key === active ? ' class="active"' : ""}>${n.label}</a></li>`
  ).join("\n");
  return `  <header class="site-header">
    <div class="container">
      <nav class="nav" aria-label="Main navigation">
        <a class="brand" href="/" aria-label="Gallegos Trailers — Home">
          <img class="brand-logo" src="/assets/img/gallegos-logo.png" width="1024" height="368" alt="Gallegos Trailers">
        </a>
        <button class="nav-toggle" aria-label="Toggle menu" aria-controls="nav-links" aria-expanded="false">
          <span></span>
        </button>
        <ul class="nav-links" id="nav-links">
${links}
          <li><a class="nav-cta" href="tel:${PHONE_TEL}">Call ${PHONE_DISPLAY}</a></li>
        </ul>
      </nav>
    </div>
  </header>`;
}

const footer = `  <footer class="site-footer">
    <div class="container">
      <div class="footer-grid">
        <div class="footer-brand">
          <a class="brand" href="/" style="margin-bottom:1rem;" aria-label="Gallegos Trailers — Home">
            <img class="brand-logo" src="/assets/img/gallegos-logo.png" width="1024" height="368" alt="Gallegos Trailers" style="height:60px;">
          </a>
          <p>New semi-trailers built direct from the manufacturer for scrap &amp; demolition, oilfield &amp; liquid, dry bulk and aggregate hauling.</p>
        </div>
        <div>
          <h4>Trailers</h4>
          <ul class="footer-links">
            <li><a href="/bulk/">Dry Bulk / Pneumatic</a></li>
            <li><a href="/liquid/">Vacuum Tank / Oilfield</a></li>
            <li><a href="/scrap-metal-demolition/">Scrap Metal &amp; Demolition</a></li>
            <li><a href="/construction-aggregates/">Construction &amp; Aggregates</a></li>
            <li><a href="/single-hopper/">Single Hopper / Barite</a></li>
          </ul>
        </div>
        <div>
          <h4>Company</h4>
          <ul class="footer-links">
            <li><a href="/about/">About Us</a></li>
            <li><a href="/faq/">FAQ</a></li>
            <li><a href="/contact/">Contact</a></li>
            <li><a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a></li>
            <li><a href="${WHATSAPP}" rel="noopener">WhatsApp</a></li>
            <li>Laredo, TX</li>
          </ul>
        </div>
      </div>
      <div class="footer-bottom">
        <span>&copy; <span id="year">2026</span> Gallegos Trailer Sales. All rights reserved.</span>
        <span>Laredo, Texas &middot; Serving the United States</span>
      </div>
    </div>
  </footer>

  <a class="wa-float" href="${WHATSAPP}" rel="noopener" aria-label="Message us on WhatsApp">
    ${waIcon}
    <span class="label">WhatsApp</span>
  </a>

  <script src="/assets/js/main.js" defer></script>`;

// ---- Page shell ----
function page({ path, active, title, description, canonical, jsonld, ogImage, body, noindex }) {
  const img = ogImage || "/assets/img/dry-bulk-pneumatic.webp";
  const ld = jsonld
    ? `\n  <script type="application/ld+json">\n${JSON.stringify(jsonld, null, 2)
        .split("\n")
        .map((l) => "  " + l)
        .join("\n")}\n  </script>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="${SITE}${canonical}">
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow"}">
  <meta name="theme-color" content="#26292e">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Gallegos Trailer Sales">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${SITE}${canonical}">
  <meta property="og:image" content="${SITE}${img}">
  <meta name="twitter:card" content="summary_large_image">

  <link rel="icon" href="/assets/img/favicon.svg" type="image/svg+xml">
  <link rel="preload" href="/assets/css/styles.css" as="style">
  <link rel="stylesheet" href="/assets/css/styles.css">${ld}
</head>
<body>
${header(active)}

  <main>
${body}
  </main>

${footer}
</body>
</html>
`;
}

// Interior page hero with breadcrumb
function pageHero({ eyebrow, h1, lead, crumb }) {
  return `    <section class="hero page-hero">
      <div class="container">
        <p class="breadcrumb"><a href="/">Home</a> <span>/</span> ${crumb}</p>
        <span class="eyebrow">${eyebrow}</span>
        <h1>${h1}</h1>
        <p class="hero-lead">${lead}</p>
      </div>
    </section>`;
}

// Structured data for a product category page: breadcrumb + one Product per
// item, each branded "Gallegos" and offered by the business. Improves rich
// results and helps answer engines associate the products with the site.
function catalogLD(pageName, pageUrl, products) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE + "/" },
          { "@type": "ListItem", position: 2, name: pageName, item: SITE + pageUrl },
        ],
      },
      ...products.map((p) => ({
        "@type": "Product",
        name: p.name,
        brand: { "@type": "Brand", name: "Gallegos" },
        category: pageName,
        description: p.description,
        image: SITE + p.image,
        url: SITE + pageUrl,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          priceCurrency: "USD",
          seller: { "@id": SITE + "/#business" },
          areaServed: "US",
        },
      })),
    ],
  };
}

// Bottom CTA band, reused on category/about pages
const ctaBand = `    <section class="section">
      <div class="container">
        <div class="cta-band">
          <div>
            <h2>Ready to spec your next trailer?</h2>
            <p>Tell us what you haul and we'll build the right unit for the job. Get factory-direct pricing today.</p>
          </div>
          <div class="actions">
            <a class="btn btn-primary btn-lg" href="/contact/">Request a Quote</a>
            <a class="btn btn-outline btn-lg" href="tel:${PHONE_TEL}">Call ${PHONE_DISPLAY}</a>
          </div>
        </div>
      </div>
    </section>`;

// =========================================================
// PAGE CONTENT
// =========================================================
const pages = [];

// ---------- HOME ----------
pages.push({
  file: "index.html",
  path: "/",
  active: "",
  title:
    "Gallegos Trailer Sales | Semi-Trailers Direct From the Manufacturer in Laredo, TX",
  description:
    "New semi-trailers built direct from the factory in Laredo, TX — scrap metal & demolition dump trailers, lightweight aluminum vacuum tanks for oilfield & water hauling, dry bulk pneumatic and aggregate trailers. Call 956-378-5818 for a factory-direct quote.",
  canonical: "/",
  jsonld: {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    "@id": SITE + "/#business",
    name: "Gallegos Trailer Sales",
    alternateName: "Gallegos Trailers Laredo",
    url: SITE + "/",
    logo: SITE + "/assets/img/gallegos-logo.png",
    image: SITE + "/assets/img/gallegos-logo.png",
    telephone: "+1-956-378-5818",
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Laredo",
      addressRegion: "TX",
      postalCode: "78045",
      addressCountry: "US",
    },
    geo: { "@type": "GeoCoordinates", latitude: 27.5306, longitude: -99.4803 },
    areaServed: [
      { "@type": "State", name: "Texas" },
      { "@type": "Place", name: "Permian Basin" },
      { "@type": "Country", name: "United States" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
    ],
    knowsAbout: [
      "scrap metal dump trailers",
      "demolition end dump trailers",
      "aluminum vacuum tank trailers",
      "oilfield produced water hauling trailers",
      "dry bulk pneumatic trailers",
      "belly dump aggregate trailers",
      "HARDOX 450 dump trailers",
    ],
    description:
      "New semi-trailers built direct from the manufacturer for scrap metal, demolition, oilfield & liquid, dry bulk and aggregate hauling. Based in Laredo, TX; serving Texas, the Permian Basin and the United States.",
    makesOffer: [
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Demolition & Scrap Metal Dump Trailers", url: SITE + "/scrap-metal-demolition/" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Aluminum Vacuum Tank Trailers", url: SITE + "/liquid/" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Dry Bulk Pneumatic Trailers", url: SITE + "/bulk/" } },
      { "@type": "Offer", itemOffered: { "@type": "Product", name: "Belly Dump & Transfer Dump Trailers", url: SITE + "/construction-aggregates/" } },
    ],
  },
  body: `    <section class="hero hero-home">
      <div class="container">
        <span class="eyebrow">Laredo, TX &middot; Built to order</span>
        <h1>Semi-Trailers Built Direct From the Manufacturer</h1>
        <p class="hero-lead">Gallegos Trailer Sales builds new scrap &amp; demolition dump trailers, lightweight aluminum vacuum tanks and dry bulk pneumatic semi-trailers for the toughest heavy-haul industries &mdash; engineered for durability, capacity and payload.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="/contact/">Request a Quote</a>
          <a class="btn btn-outline btn-lg" href="/bulk/">Browse Trailers</a>
        </div>
        <div class="hero-trust">
          <span>&#10003; <strong>Factory-direct</strong> pricing</span>
          <span>&#10003; HARDOX &amp; ASTM-grade builds</span>
          <span>&#10003; USDOT / ASME certified tanks</span>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">What we build</span>
          <h2>Five trailer categories for heavy-haul work</h2>
          <p class="lead">Every trailer we sell is spec'd for a specific industry &mdash; from demolition debris and scrap metal to oilfield fluids, fine dry powders and construction aggregates.</p>
        </div>

        <div class="cat-grid">
          <a class="cat-card" href="/scrap-metal-demolition/">
            <img class="thumb" src="/assets/img/scrap-steco-type.webp" width="1000" height="750" loading="lazy" alt="STECO type end dump trailer for scrap metal and demolition">
            <div class="body">
              <h3>Scrap Metal &amp; Demolition</h3>
              <p>80&ndash;96 yd&sup3; HARDOX 450 end dumps with a reinforced quarter frame &mdash; built to haul demolition debris and scrap metal.</p>
              <span class="more">View dump trailers &rarr;</span>
            </div>
          </a>

          <a class="cat-card" href="/liquid/">
            <img class="thumb" src="/assets/img/vacuum-tank-2.webp" width="1000" height="750" loading="lazy" alt="Aluminum vacuum tank trailer for oilfield and produced water hauling">
            <div class="body">
              <h3>Vacuum Tank / Oilfield</h3>
              <p>Lightweight aluminum &amp; stainless 130&ndash;150 Bbl vacuum tanks for produced water and oilfield fluids. USDOT 406 / ASME.</p>
              <span class="more">View vacuum tanks &rarr;</span>
            </div>
          </a>

          <a class="cat-card" href="/bulk/">
            <img class="thumb" src="/assets/img/dry-bulk-pneumatic.webp" width="1000" height="750" loading="lazy" alt="Steel pneumatic dry bulk trailer for cement and fine powders">
            <div class="body">
              <h3>Dry Bulk / Pneumatic</h3>
              <p>Steel and aluminum pneumatic trailers, 1,040&ndash;1,400 ft&sup3;, for cement, lime and fine powders.</p>
              <span class="more">View dry bulk trailers &rarr;</span>
            </div>
          </a>

          <a class="cat-card" href="/construction-aggregates/">
            <img class="thumb" src="/assets/img/construction-half-round.webp" width="1000" height="750" loading="lazy" alt="Half round end dump trailer for construction and aggregates">
            <div class="body">
              <h3>Construction &amp; Aggregates</h3>
              <p>Half round end dumps for construction, demolition, aggregates, agriculture and industrial applications.</p>
              <span class="more">View aggregate trailers &rarr;</span>
            </div>
          </a>

          <a class="cat-card" href="/single-hopper/">
            <img class="thumb" src="/assets/img/single-hopper-barite.webp" width="1000" height="750" loading="lazy" alt="Single hopper pneumatic trailer for barite and heavy powders">
            <div class="body">
              <h3>Single Hopper / Barite</h3>
              <p>Single-hopper pneumatic trailers for barite, bentonite and dense, high-density powders.</p>
              <span class="more">View single hopper trailers &rarr;</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-head center">
          <span class="eyebrow">Why Gallegos</span>
          <h2>Manufacturer-direct trailers, spec'd for the job</h2>
        </div>
        <div class="feature-grid">
          <div class="feature">
            <span class="ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 6v6c0 5 8 8 8 8s8-3 8-8V6z"/></svg></span>
            <h3>Built to last</h3>
            <p>HARDOX 450 steel, ASTM A36 and stainless construction engineered for high-abrasion, heavy-duty loads.</p>
          </div>
          <div class="feature">
            <span class="ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></span>
            <h3>Certified &amp; compliant</h3>
            <p>Vacuum tanks meet USDOT 406, ASME and R-Stamp requirements for oilfield and hazardous fluids.</p>
          </div>
          <div class="feature">
            <span class="ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 5-6"/></svg></span>
            <h3>Maximum payload</h3>
            <p>Lightweight aluminum options with the lowest tare weight on the market &mdash; carry more on every haul.</p>
          </div>
          <div class="feature">
            <span class="ico" aria-hidden="true"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
            <h3>Based in Laredo, TX</h3>
            <p>Serving Texas, the Permian Basin and heavy-haul operators across the United States.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Gallegos trailers for sale</span>
          <h2>New Gallegos trailers for sale in Laredo, Texas</h2>
          <p class="lead">Gallegos Trailer Sales connects buyers with new, manufacturer-direct Gallegos semi-trailers &mdash; from scrap metal and demolition dump trailers to aluminum vacuum tanks, dry bulk pneumatics and belly dumps. We ship across Texas, the Permian Basin and the United States, and we'll spec the right unit for the exact load you haul.</p>
        </div>
        <p><a class="btn btn-ghost" href="/faq/">Read our FAQ</a> <a class="btn btn-primary" href="/contact/">Get a factory-direct quote</a></p>
      </div>
    </section>

${ctaBand}`,
});

// Helper to render a product block
function product({ img, alt, name, tagline, pills, specs, reverse, gallery }) {
  const pillHtml = pills && pills.length
    ? `          <ul class="spec-pills">\n${pills.map((p) => `            <li>${p}</li>`).join("\n")}\n          </ul>\n`
    : "";
  const galleryHtml = gallery && gallery.length
    ? `\n          <div class="product-thumbs">\n${gallery.map((g) => `            <img src="${g.img}" width="1000" height="750" loading="lazy" alt="${g.alt}">`).join("\n")}\n          </div>`
    : "";
  const specHtml = specs && specs.length
    ? `          <ul class="specs">\n${specs.map((s) => `            <li>${s}</li>`).join("\n")}\n          </ul>\n`
    : "";
  return `      <article class="product${reverse ? " reverse" : ""}">
        <div class="product-media">
          <img src="${img}" width="1000" height="750" loading="lazy" alt="${alt}">${galleryHtml}
        </div>
        <div class="product-body">
          <h2>${name}</h2>
          <p class="tagline">${tagline}</p>
${pillHtml}${specHtml}          <a class="btn btn-primary" href="/contact/">Request a Quote</a>
        </div>
      </article>`;
}

// ---------- BULK ----------
pages.push({
  file: "bulk/index.html",
  path: "/bulk/",
  active: "bulk",
  title: "Dry Bulk Pneumatic Trailers for Sale in Texas | Gallegos Trailer Sales",
  description:
    "Steel and aluminum pneumatic dry bulk trailers, 1,040–1,400 ft³, for cement, lime and fine powders. Low tare weight, high capacity. Built direct from the manufacturer in Laredo, TX.",
  canonical: "/bulk/",
  ogImage: "/assets/img/dry-bulk-pneumatic.webp",
  jsonld: catalogLD("Dry Bulk Pneumatic Trailers", "/bulk/", [
    {
      name: "Steel Pneumatic Dry Bulk Trailer",
      image: "/assets/img/dry-bulk-pneumatic.webp",
      description: "Steel pneumatic dry bulk trailer, 1,040–1,400 ft³, for cement, lime and fine powders.",
    },
    {
      name: "Aluminum Pneumatic Dry Bulk Trailer",
      image: "/assets/img/dry-bulk-pneumatic-2.webp",
      description: "Lightweight aluminum pneumatic dry bulk trailer, 1,040–1,400 ft³, with the lowest tare weight on the market.",
    },
  ]),
  body: `${pageHero({
    eyebrow: "Dry Bulk / Pneumatic",
    h1: "Dry Bulk Pneumatic Trailers for Sale in Texas",
    lead: "Pneumatic dry bulk trailers engineered for cement, lime and fine powders — available in steel and lightweight aluminum, with 1,040 to 1,400 ft&sup3; of capacity and fast, clean load and unload.",
    crumb: "Dry Bulk",
  })}

    <section class="section">
      <div class="container">
${product({
    img: "/assets/img/dry-bulk-pneumatic.webp",
    alt: "Steel pneumatic dry bulk trailer with 1,400 cubic feet capacity",
    name: "Steel Pneumatic Dry Bulk Trailer",
    tagline: "Rugged steel construction for cement, lime and fine powders.",
    pills: ["Cement", "Lime", "Fine powders"],
    specs: [
      "<b>Capacity:</b> 1,040 &ndash; 1,400 ft&sup3;",
      "Ideal for cement, lime and fine dry powders",
    ],
  })}
${product({
    img: "/assets/img/dry-bulk-pneumatic-2.webp",
    alt: "Lightweight aluminum pneumatic dry bulk trailer with low tare weight",
    name: "Aluminum Pneumatic Dry Bulk Trailer",
    tagline: "The lowest-tare-weight aluminum pneumatic trailer on the market.",
    reverse: true,
    pills: ["Lowest tare weight", "High capacity", "Easy to clean"],
    specs: [
      "<b>Capacity:</b> 1,040 &ndash; 1,400 ft&sup3;",
      "Lowest tare weight on the market for maximum payload",
      "Recognized for high load capacity and efficient loading &amp; unloading",
      "Robust, easy to clean, reliable and durable",
    ],
  })}
      </div>
    </section>

${ctaBand}`,
});

// ---------- SINGLE HOPPER ----------
pages.push({
  file: "single-hopper/index.html",
  path: "/single-hopper/",
  active: "hopper",
  title: "Single Hopper Pneumatic Trailers for Barite | Gallegos Trailer Sales",
  description:
    "Single hopper pneumatic trailers for barite, bentonite and dense, high-density powders. Low-tare aluminum build, fast pneumatic load and unload through a single discharge cone. Built direct from the manufacturer in Laredo, TX.",
  canonical: "/single-hopper/",
  ogImage: "/assets/img/single-hopper-barite.webp",
  jsonld: catalogLD("Single Hopper Pneumatic Trailers", "/single-hopper/", [
    {
      name: "Single Hopper Pneumatic Trailer",
      image: "/assets/img/single-hopper-barite.webp",
      description: "Single-hopper pneumatic trailer for barite and dense, high-density powders. Low-tare aluminum build with fast pneumatic load and unload through a single discharge cone. For oilfield drilling-mud and mineral hauling.",
    },
  ]),
  body: `${pageHero({
    eyebrow: "Single Hopper / Barite",
    h1: "Single Hopper Pneumatic Trailers",
    lead: "A single-hopper design built for barite, bentonite and dense, high-density powders &mdash; low-tare aluminum construction with fast pneumatic load and unload for oilfield drilling-mud and mineral hauling.",
    crumb: "Single Hopper",
  })}

    <section class="section">
      <div class="container">
${product({
    img: "/assets/img/single-hopper-barite.webp",
    alt: "Single hopper pneumatic trailer for barite and heavy powders",
    gallery: [
      { img: "/assets/img/single-hopper-barite-2.webp", alt: "Single hopper pneumatic barite trailer at the Gallegos plant" },
    ],
    name: "Single Hopper Pneumatic Trailer",
    tagline: "A single-hopper design built for barite and dense, high-density powders.",
    pills: ["Barite", "Drilling mud", "Heavy powders"],
    specs: [
      "Single-hopper design optimized for dense products like barite and bentonite",
      "Low-tare aluminum build reaches legal payload without excess volume",
      "Fast pneumatic load and unload through a single discharge cone",
      "Built for oilfield drilling-mud and mineral hauling",
    ],
  })}
      </div>
    </section>

${ctaBand}`,
});

// ---------- LIQUID ----------
pages.push({
  file: "liquid/index.html",
  path: "/liquid/",
  active: "liquid",
  title: "Vacuum Tank Trailers for Oilfield & Liquid Hauling | Gallegos Trailer Sales",
  description:
    "Lightweight aluminum and stainless vacuum tank trailers, 130–150 Bbl, for oilfield fluid transport, produced water hauling and chemical waste. USDOT 406 / ASME / R-Stamp certified. Permian Basin ready.",
  canonical: "/liquid/",
  ogImage: "/assets/img/vacuum-tank.webp",
  jsonld: catalogLD("Vacuum Tank Trailers", "/liquid/", [
    {
      name: "Aluminum / Stainless Vacuum Tank Trailer",
      image: "/assets/img/vacuum-tank.webp",
      description: "Vacuum tank trailer, 130–150 Bbl, in lightweight aluminum or stainless steel (ASTM A36). Two-piece cylindrical design; USDOT 406 / R-Stamp / ASME certified. For oilfield mud, produced water and chemical waste.",
    },
  ]),
  body: `${pageHero({
    eyebrow: "Vacuum Tank / Oilfield",
    h1: "Vacuum Tank Trailers for Oilfield &amp; Liquid Hauling",
    lead: "Vacuum tank trailers &mdash; available in lightweight aluminum or stainless steel &mdash; built for oilfield fluid transport, produced water hauling and chemical waste across the Permian Basin and beyond. Certified to USDOT 406, ASME and R-Stamp standards.",
    crumb: "Vacuum Tank",
  })}

    <section class="section">
      <div class="container">
${product({
    img: "/assets/img/vacuum-tank.webp",
    alt: "Vacuum tank trailer, 130 to 150 Bbl, for oilfield and produced water hauling",
    gallery: [
      { img: "/assets/img/vacuum-tank-2.webp", alt: "Aluminum vacuum tank trailer with Challenger pump, side view" },
      { img: "/assets/img/vacuum-tank-3.webp", alt: "Row of aluminum vacuum tank trailers at the Gallegos plant" },
    ],
    name: "Vacuum Tank Trailer",
    tagline: "Lightweight aluminum or stainless build for oilfield mud, produced water and chemical waste.",
    pills: ["Aluminum water vac", "Permian Basin", "Produced water hauling", "Oilfield fluid transport"],
    specs: [
      "<b>Capacity:</b> 130 &ndash; 150 Bbl",
      "Built in lightweight aluminum or stainless steel (ASTM A36)",
      "Two-piece cylindrical design with a single circumferential seam",
      "Purpose-engineered for chemical waste, oilfield mud and water",
      "<b>Certifications:</b> USDOT 406 / R-Stamp / ASME",
    ],
  })}
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-head">
          <h2>Built for the oilfield</h2>
          <p class="lead">From produced water hauling to oilfield fluid transport, our vacuum tanks are spec'd for the demands of Permian Basin operators &mdash; corrosion-resistant, certified and ready for continuous duty.</p>
        </div>
      </div>
    </section>

${ctaBand}`,
});

// ---------- SCRAP / DEMOLITION ----------
pages.push({
  file: "scrap-metal-demolition/index.html",
  path: "/scrap-metal-demolition/",
  active: "scrap",
  title: "Demolition & Scrap Metal Dump Trailers | HARDOX 450 | Gallegos Trailer Sales",
  description:
    "Demolition end dump trailers, 80–96 yd³, built with HARDOX 450 steel and a reinforced quarter frame for demolition debris and scrap metal hauling. Spring ride or air ride — including the STECO-type end dump known across the U.S. Northeast. Made in Laredo, TX.",
  canonical: "/scrap-metal-demolition/",
  ogImage: "/assets/img/scrap-end-dump.webp",
  jsonld: catalogLD("Demolition & Scrap Metal Dump Trailers", "/scrap-metal-demolition/", [
    {
      name: "Demolition End Dump Trailer (HARDOX 450)",
      image: "/assets/img/scrap-end-dump.webp",
      description: "HARDOX 450 demolition and scrap metal end dump trailer with a reinforced quarter frame and a choice of spring ride or air ride.",
    },
    {
      name: "STECO Type End Dump",
      image: "/assets/img/scrap-steco-type.webp",
      description: "STECO type end dump, 80–96 yd³ capacity, configurable from 38 to 42 ft. Originally manufactured by Gallegos for the STECO brand and widely known as the ‘STECO type’ across the U.S. Northeast — New York, New Hampshire, Massachusetts and Rhode Island.",
    },
  ]),
  body: `${pageHero({
    eyebrow: "Scrap Metal &amp; Demolition",
    h1: "Demolition &amp; Scrap Metal Dump Trailers",
    lead: "Heavy-duty end dump trailers built with HARDOX 450 steel for demolition debris and scrap metal hauling &mdash; reinforced quarter frame, spring or air ride, and capacities from 80 to 96 yd&sup3; &mdash; including the STECO-type end dump the Northeast knows by name.",
    crumb: "Scrap Metal &amp; Demolition",
  })}

    <section class="section">
      <div class="container">
${product({
    img: "/assets/img/scrap-end-dump.webp",
    alt: "Demolition end dump trailer in HARDOX 450 steel for scrap metal and debris",
    gallery: [
      { img: "/assets/img/scrap-end-dump-2.webp", alt: "Two-axle demolition end dump trailer" },
      { img: "/assets/img/scrap-end-dump-3.webp", alt: "Three-axle demolition end dump trailer" },
    ],
    name: "Demolition End Dump",
    tagline: "A HARDOX 450 scrap metal hauling trailer built for demolition debris.",
    pills: ["Scrap metal hauling trailer", "Demolition debris trailer", "HARDOX 450 dump trailer"],
    specs: [
      "<b>Suspension:</b> spring ride or air ride",
      "Built with HARDOX 450 steel &mdash; strong and durable",
      "Designed to load demolition debris and scrap metal",
      "Reinforced quarter frame for added strength",
    ],
  })}
${product({
    img: "/assets/img/scrap-steco-type.webp",
    alt: "STECO type end dump trailer built by Gallegos for scrap metal and demolition",
    name: "STECO Type End Dump",
    tagline: "The end dump the Northeast knows by name — originally built by Gallegos for the STECO brand.",
    reverse: true,
    pills: ["STECO type", "Northeast favorite", "Scrap &amp; demolition"],
    specs: [
      "<b>Capacity:</b> 80 &ndash; 96 yd&sup3;",
      "<b>Length:</b> configurable from 38 to 42 ft",
      "Originally manufactured by Gallegos for the STECO brand — the name the trade adopted",
      "Widely known as the &ldquo;STECO type&rdquo; across the U.S. Northeast: New York, New Hampshire, Massachusetts, Rhode Island and the surrounding region",
      "Proven end dump design for scrap metal and demolition debris",
      "Heavy-duty build engineered for high-abrasion loads",
    ],
  })}
      </div>
    </section>

    <section class="section steel-section">
      <div class="container">
        <div class="section-head">
          <span class="eyebrow">Wear steel options</span>
          <h2>Choose your HARDOX&reg; wear plate</h2>
          <p class="lead">Every Gallegos dump body can be built in your choice of premium HARDOX&reg; wear steel &mdash; matched to how abrasive your loads really are.</p>
        </div>
        <div class="steel-grid">
          <div class="steel-card">
            <img src="/assets/img/hardox-450.webp" width="1000" height="750" loading="lazy" alt="HARDOX 450 abrasion-resistant wear steel plate">
            <div class="steel-body">
              <h3>HARDOX&reg; 450</h3>
              <p>The industry standard in abrasion-resistant wear steel &mdash; a proven balance of hardness and toughness for long-lasting demolition and scrap bodies.</p>
            </div>
          </div>
          <div class="steel-card">
            <img src="/assets/img/hardox-500tuf.webp" width="1000" height="750" loading="lazy" alt="HARDOX 500 Tuf next-generation wear steel">
            <div class="steel-body">
              <h3>HARDOX&reg; 500 Tuf</h3>
              <p>A harder, tougher next-generation wear steel &mdash; extends body life in the most abrasive loads and lets you build lighter without giving up impact strength.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

${ctaBand}`,
});

// ---------- CONSTRUCTION / AGGREGATES ----------
pages.push({
  file: "construction-aggregates/index.html",
  path: "/construction-aggregates/",
  active: "construction",
  title: "Half Round End Dump Trailers | Gallegos Trailer Sales",
  description:
    "Half round end dump trailers designed and manufactured for construction, demolition, aggregates, agriculture and industrial applications — simple, maintenance-free design, rugged reliability and single point suspension. Built in Laredo, TX.",
  canonical: "/construction-aggregates/",
  ogImage: "/assets/img/construction-half-round.webp",
  jsonld: catalogLD("Half Round End Dump Trailers", "/construction-aggregates/", [
    {
      name: "Half Round End Dump",
      image: "/assets/img/construction-half-round.webp",
      description: "Half round end dump designed and manufactured for construction, demolition, aggregates, agriculture and industrial applications — trusted for its simple, maintenance-free design and rugged reliability. Single point suspension.",
    },
  ]),
  body: `${pageHero({
    eyebrow: "Construction &amp; Aggregates",
    h1: "Half Round End Dump Trailers",
    lead: "Half round end dumps for construction, demolition, aggregates, agriculture and industrial applications &mdash; trusted for their simple, maintenance-free design and rugged reliability.",
    crumb: "Construction &amp; Aggregates",
  })}

    <section class="section">
      <div class="container">
${product({
    img: "/assets/img/construction-half-round.webp",
    alt: "Half round end dump trailer for construction, demolition, aggregates, agriculture and industrial applications",
    name: "Half Round End Dump",
    tagline: "Simple, maintenance-free design with rugged reliability.",
    pills: ["Construction", "Demolition", "Aggregates", "Agriculture &amp; industrial"],
    specs: [
      "Designed and manufactured for construction, demolition, aggregates, agriculture and industrial applications &mdash; trusted for their simple and maintenance-free design and rugged reliability",
      "<b>Suspension:</b> Single Point",
    ],
  })}
      </div>
    </section>

${ctaBand}`,
});

// ---------- ABOUT ----------
pages.push({
  file: "about/index.html",
  path: "/about/",
  active: "about",
  title: "About Gallegos Trailer Sales | Manufacturer-Direct Trailers in Laredo, TX",
  description:
    "Gallegos Trailer Sales specializes in trailers for bulk, liquid, scrap metal and demolition hauling — built direct from the manufacturer for durability and performance. Based in Laredo, TX.",
  canonical: "/about/",
  body: `${pageHero({
    eyebrow: "About Us",
    h1: "About Gallegos Trailer Sales",
    lead: "Manufacturer-direct semi-trailers, engineered for the industries that move the heaviest loads.",
    crumb: "About",
  })}

    <section class="section">
      <div class="container">
        <div class="prose">
          <p>We specialize in trailers for bulk, liquid, scrap metal, and demolition hauling &mdash; built direct from the manufacturer for durability and performance. Every unit is spec'd for the real demands of the industries we serve, from fine dry powders and oilfield fluids to demolition debris and construction aggregates.</p>
          <p>Quality and experience are at the core of everything we build. By working directly with the factory, we deliver trailers that meet exacting standards for materials, certification and payload &mdash; using HARDOX 450 steel, ASTM-grade and stainless construction, and certified vacuum tanks for the oilfield. The result is equipment that stands up to years of heavy, continuous use.</p>
          <p>Based in Laredo, Texas, we serve operators across Texas, the Permian Basin and the wider United States. Whatever you haul, we'll help you spec the right trailer for the job and back it with straightforward, factory-direct pricing.</p>
        </div>

        <div class="stat-row">
          <div class="stat"><b>Factory</b><span>Direct pricing</span></div>
          <div class="stat"><b>HARDOX 450</b><span>Heavy-duty steel</span></div>
          <div class="stat"><b>USDOT / ASME</b><span>Certified tanks</span></div>
        </div>
      </div>
    </section>

${ctaBand}`,
});

// ---------- CONTACT ----------
pages.push({
  file: "contact/index.html",
  path: "/contact/",
  active: "contact",
  title: "Contact Gallegos Trailer Sales | 956-378-5818 | Laredo, TX",
  description:
    "Contact Gallegos Trailer Sales for a trailer quote. Call 956-378-5818, message us on WhatsApp, or send us your equipment needs. Based in Laredo, TX.",
  canonical: "/contact/",
  jsonld: {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: "Gallegos Trailer Sales",
    url: SITE + "/contact/",
    telephone: "+1-956-378-5818",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Laredo",
      addressRegion: "TX",
      addressCountry: "US",
    },
    areaServed: "US",
  },
  body: `${pageHero({
    eyebrow: "Contact",
    h1: "Contact Gallegos Trailer Sales",
    lead: "Tell us about your next trailer and we'll get you a factory-direct quote. Call, message us on WhatsApp, or use the form below.",
    crumb: "Contact",
  })}

    <section class="section">
      <div class="container">
        <div class="contact-grid">
          <div class="form-card">
            <h2 class="mt-0">Request a quote</h2>
            <p class="lead" style="font-size:1rem;">Describe your new equipment and we'll be in touch shortly.</p>
            <form id="contact-form" action="https://api.web3forms.com/submit" method="POST">
              <input type="hidden" name="access_key" value="8d4ab1e4-da84-43b9-9388-45d005a95463">
              <input type="hidden" name="subject" value="New quote request — gallegossales.com">
              <input type="hidden" name="from_name" value="Gallegos Trailers Website">
              <input type="checkbox" name="botcheck" style="display:none" tabindex="-1" autocomplete="off" aria-hidden="true">
              <div class="field">
                <label for="name">Name</label>
                <input type="text" id="name" name="name" autocomplete="name" required>
              </div>
              <div class="field">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" autocomplete="email" required>
              </div>
              <div class="field">
                <label for="company">Company</label>
                <input type="text" id="company" name="company" autocomplete="organization">
              </div>
              <div class="field">
                <label for="trailer-type">Trailer type</label>
                <select id="trailer-type" name="trailer_type" required>
                  <option value="" disabled selected>Select the unit you need quoted&hellip;</option>
                  <option>Dry Bulk / Pneumatic (Steel)</option>
                  <option>Dry Bulk / Pneumatic (Aluminum)</option>
                  <option>Single Hopper / Barite</option>
                  <option>Vacuum Tank / Oilfield</option>
                  <option>Demolition End Dump</option>
                  <option>STECO Type End Dump</option>
                  <option>Half Round End Dump</option>
                  <option>Other</option>
                </select>
              </div>
              <div class="field">
                <label for="message">Describe your new equipment</label>
                <textarea id="message" name="message" placeholder="Trailer type, capacity, quantity, timeline&hellip;" required></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-lg">Send Message</button>
              <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
              <p class="form-note">Prefer to talk now? Call <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a> or message us on WhatsApp.</p>
            </form>
          </div>

          <div class="contact-info">
            <div class="info-card">
              <span class="ico" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.6a2 2 0 0 1-.5 2.1L8 9.6a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.7.6 2.6.7A2 2 0 0 1 22 16.9z"/></svg></span>
              <div>
                <h3>Phone</h3>
                <a href="tel:${PHONE_TEL}">${PHONE_DISPLAY}</a>
              </div>
            </div>

            <div class="info-card wa-card">
              <span class="ico" aria-hidden="true">${waIcon}</span>
              <div>
                <h3>WhatsApp</h3>
                <a href="${WHATSAPP}" rel="noopener">Message us on WhatsApp</a>
              </div>
            </div>

            <div class="info-card">
              <span class="ico" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg></span>
              <div>
                <h3>Email</h3>
                <a href="mailto:edson.resendiz@gallegos.com.mx">edson.resendiz@gallegos.com.mx</a>
              </div>
            </div>

            <div class="info-card">
              <span class="ico" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></span>
              <div>
                <h3>Location</h3>
                <p>Laredo, TX</p>
              </div>
            </div>

            <div class="info-card">
              <span class="ico" aria-hidden="true"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg></span>
              <div>
                <h3>Hours</h3>
                <p>Monday &ndash; Friday, business hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`,
});

// ---------- FAQ ----------
// Buyer-intent questions phrased the way people ask search engines and AI
// assistants. Answered in real HTML text + FAQPage schema for rich results
// and answer-engine visibility.
const faqs = [
  {
    q: "Where can I buy Gallegos trailers?",
    a: `You can buy Gallegos-built semi-trailers directly through Gallegos Trailer Sales in Laredo, Texas. Call or WhatsApp ${PHONE_DISPLAY} for a factory-direct quote, or use our <a href="/contact/">contact form</a>. We serve customers across Texas, the Permian Basin and the United States.`,
  },
  {
    q: "What types of trailers does Gallegos Trailer Sales offer?",
    a: `We offer five main categories: <a href="/scrap-metal-demolition/">scrap metal &amp; demolition dump trailers</a> (HARDOX 450 end dumps), <a href="/liquid/">vacuum tank trailers</a> for oilfield and liquid hauling (lightweight aluminum or stainless), <a href="/bulk/">dry bulk pneumatic trailers</a>, <a href="/single-hopper/">single hopper pneumatic trailers</a> for barite, and <a href="/construction-aggregates/">half round end dump &amp; aggregate trailers</a>.`,
  },
  {
    q: "Do you sell aluminum vacuum tank trailers for the oilfield?",
    a: `Yes. Our vacuum tank trailers are available in lightweight aluminum or stainless steel (ASTM A36), 130–150 Bbl, and are certified to USDOT 406, ASME and R-Stamp standards — built for produced water hauling, oilfield mud and chemical waste in the Permian Basin and beyond.`,
  },
  {
    q: "What is a HARDOX 450 dump trailer?",
    a: `HARDOX 450 is a high-strength, abrasion-resistant steel. Our demolition and scrap metal end dump trailers are built with HARDOX 450 and a reinforced quarter frame, with 80–96 yd³ capacity and a choice of spring ride or air ride — engineered to haul demolition debris and scrap metal.`,
  },
  {
    q: "How much does a Gallegos trailer cost?",
    a: `Pricing depends on the trailer type, capacity, material and options. Because we sell direct from the manufacturer, we can give you competitive factory-direct pricing — call ${PHONE_DISPLAY} or <a href="/contact/">request a quote</a> and we'll price your exact configuration.`,
  },
  {
    q: "Where is Gallegos Trailer Sales located?",
    a: `We are based in Laredo, Texas, and ship trailers to customers throughout Texas, the Permian Basin and the wider United States.`,
  },
  {
    q: "How do I get a quote for a new trailer?",
    a: `Call or WhatsApp ${PHONE_DISPLAY}, or fill out the form on our <a href="/contact/">contact page</a> describing the trailer you need (type, capacity, quantity and timeline). We'll get back to you with a factory-direct quote.`,
  },
];

pages.push({
  file: "faq/index.html",
  path: "/faq/",
  active: "faq",
  title: "Frequently Asked Questions | Gallegos Trailer Sales",
  description:
    "Answers about buying Gallegos semi-trailers in Texas: where to buy, trailer types, aluminum vacuum tanks, HARDOX 450 dump trailers, pricing and how to get a factory-direct quote. Call 956-378-5818.",
  canonical: "/faq/",
  jsonld: {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/<[^>]+>/g, "") },
    })),
  },
  body: `${pageHero({
    eyebrow: "FAQ",
    h1: "Frequently Asked Questions",
    lead: "Common questions about buying Gallegos semi-trailers — trailer types, materials, pricing and how to get a quote.",
    crumb: "FAQ",
  })}

    <section class="section">
      <div class="container">
        <div class="faq-list">
${faqs
  .map(
    (f) => `          <details class="faq-item">
            <summary>${f.q}</summary>
            <div class="faq-answer"><p>${f.a}</p></div>
          </details>`
  )
  .join("\n")}
        </div>
      </div>
    </section>

${ctaBand}`,
});

// ---------- 404 ----------
pages.push({
  file: "404.html",
  path: "/404.html",
  active: "",
  title: "Page Not Found | Gallegos Trailer Sales",
  description: "The page you were looking for could not be found. Browse our trailer categories or contact Gallegos Trailer Sales in Laredo, TX.",
  canonical: "/404.html",
  noindex: true,
  body: `    <section class="hero page-hero">
      <div class="container">
        <span class="eyebrow">404</span>
        <h1>Page not found</h1>
        <p class="hero-lead">The page you were looking for doesn't exist or has moved. Let's get you back on track.</p>
        <div class="hero-actions">
          <a class="btn btn-primary btn-lg" href="/">Back to Home</a>
          <a class="btn btn-outline btn-lg" href="/contact/">Contact Us</a>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head"><h2>Browse our trailers</h2></div>
        <div class="cat-grid">
          <a class="cat-card" href="/bulk/"><div class="body"><h3>Dry Bulk / Pneumatic</h3><span class="more">View trailers &rarr;</span></div></a>
          <a class="cat-card" href="/liquid/"><div class="body"><h3>Vacuum Tank / Oilfield</h3><span class="more">View trailers &rarr;</span></div></a>
          <a class="cat-card" href="/scrap-metal-demolition/"><div class="body"><h3>Scrap Metal &amp; Demolition</h3><span class="more">View trailers &rarr;</span></div></a>
          <a class="cat-card" href="/construction-aggregates/"><div class="body"><h3>Construction &amp; Aggregates</h3><span class="more">View trailers &rarr;</span></div></a>
        </div>
      </div>
    </section>`,
});

// =========================================================
// EMIT
// =========================================================
for (const p of pages) {
  const html = page({
    path: p.path,
    active: p.active,
    title: p.title,
    description: p.description,
    canonical: p.canonical,
    jsonld: p.jsonld,
    ogImage: p.ogImage,
    body: p.body,
    noindex: p.noindex,
  });
  const out = resolve(ROOT, p.file);
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, html);
  console.log("built", p.file);
}

// ---- sitemap.xml ----
const today = process.env.BUILD_DATE || "2026-07-15";
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages
  .filter((p) => !p.noindex)
  .map(
    (p) =>
      `  <url>\n    <loc>${SITE}${p.canonical}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.canonical === "/" ? "1.0" : "0.8"}</priority>\n  </url>`
  )
  .join("\n")}
</urlset>
`;
writeFileSync(resolve(ROOT, "sitemap.xml"), sitemap);
console.log("built sitemap.xml");

// ---- robots.txt ----
// Explicitly welcome search engines AND AI answer engines (ChatGPT, Claude,
// Perplexity, Gemini, etc.) so the site can be cited by them.
const aiBots = [
  "GPTBot",          // OpenAI (ChatGPT training/crawl)
  "OAI-SearchBot",   // OpenAI search
  "ChatGPT-User",    // ChatGPT live browsing
  "ClaudeBot",       // Anthropic (Claude) crawl
  "Claude-Web",      // Anthropic live browsing
  "anthropic-ai",    // Anthropic
  "PerplexityBot",   // Perplexity crawl
  "Perplexity-User", // Perplexity live browsing
  "Google-Extended", // Google Gemini / AI training
  "Applebot-Extended",
  "Bingbot",         // Bing — also powers ChatGPT search
  "CCBot",           // Common Crawl (feeds many LLMs)
  "Amazonbot",
  "DuckAssistBot",
  "cohere-ai",
  "YouBot",
];
const robots = `# Gallegos Trailer Sales — all crawlers welcome
User-agent: *
Allow: /

${aiBots.map((b) => `User-agent: ${b}\nAllow: /`).join("\n\n")}

Sitemap: ${SITE}/sitemap.xml
`;
writeFileSync(resolve(ROOT, "robots.txt"), robots);
console.log("built robots.txt");

// ---- llms.txt ----
// Emerging convention (llmstxt.org) — a plain-text brief that AI assistants can
// read to understand the site quickly. Mirrors the key facts and links.
const llms = `# Gallegos Trailer Sales

> New heavy-haul semi-trailers built direct from the manufacturer, sold from Laredo, Texas.
> We specialize in scrap metal & demolition dump trailers, lightweight aluminum vacuum
> tanks for oilfield and produced-water hauling, dry bulk pneumatic trailers, and belly
> dump / aggregate trailers. Serving Texas, the Permian Basin and the United States.

Contact: Phone/WhatsApp +1 956-378-5818 · Laredo, TX · https://gallegossales.com/contact/

## Products
- [Scrap Metal & Demolition Dump Trailers](${SITE}/scrap-metal-demolition/): HARDOX 450 end dumps, 80–96 yd³, reinforced quarter frame, spring or air ride.
- [Vacuum Tank Trailers](${SITE}/liquid/): 130–150 Bbl, lightweight aluminum or stainless (ASTM A36), USDOT 406 / ASME / R-Stamp. For oilfield fluids and produced water.
- [Dry Bulk Pneumatic Trailers](${SITE}/bulk/): steel and aluminum, 1,040–1,400 ft³, for cement, lime and fine powders.
- [Belly Dump & Aggregate Trailers](${SITE}/construction-aggregates/): HARDOX 450 belly dump and California Dirt Dauber sets for aggregates and asphalt.

## Company
- [About](${SITE}/about/)
- [Contact & Quote](${SITE}/contact/)
- [FAQ](${SITE}/faq/)
`;
writeFileSync(resolve(ROOT, "llms.txt"), llms);
console.log("built llms.txt");

console.log("\nDone. Generated", pages.length, "pages.");

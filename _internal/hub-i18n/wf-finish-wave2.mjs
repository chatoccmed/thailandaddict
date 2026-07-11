export const meta = {
  name: 'finish-wave2-he-ar',
  description: 'Finish Wave 2 booking-funnel i18n: translate ONLY the missing he+ar hotel reviews/roundups (resume-aware, pending list derived from disk), Sonnet 5, pipelined per city so reviews follow their roundup for hotel-name consistency',
  phases: [
    { title: 'Cities', detail: 'per city: translate missing roundup (if any), then missing reviews in batches of 3', model: 'sonnet' },
  ],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

// Pending work-list computed from disk (compute-pending.mjs) — only files that do NOT yet exist.
const PENDING = {"hi":{"cities":{},"totalReviews":0,"totalRoundups":0},"he":{"cities":{"koh-phangan":{"roundupMissing":false,"reviews":["review-rin-beach-resort-haad-rin-koh-phangan","review-sandy-bay-bungalows-haad-yao-koh-phangan","review-chaloklum-bay-resort-koh-phangan"]}},"totalReviews":3,"totalRoundups":0},"ar":{"cities":{"rayong":{"roundupMissing":false,"reviews":["review-star-convention-hotel-rayong","review-centara-q-resort-rayong","review-banphe-hostel-rayong","review-stay-samed-rayong"]},"trat":{"roundupMissing":false,"reviews":["review-seavana-beach-resort-koh-mak-trat","review-mira-montra-resort-koh-mak-trat","review-chang-buri-resort-spa-trat"]},"nan":{"roundupMissing":false,"reviews":["review-nan-nakara-boutique-hotel-nan","review-dhevaraj-hotel-nan","review-puadeview-boutique-resort-nan"]},"koh-chang":{"roundupMissing":true,"reviews":["review-aiyapura-koh-chang","review-emerald-cove-koh-chang","review-sylvan-koh-chang","review-kc-grande-koh-chang","review-nest-sense-koh-chang","review-klong-prao-resort-koh-chang","review-aana-resort-spa-koh-chang","review-warapura-koh-chang","review-indie-beach-bungalows-koh-chang","review-kaibae-beach-resort-koh-chang","review-independent-bos-koh-chang","review-bang-bao-cliff-view-koh-chang"]},"koh-lipe":{"roundupMissing":true,"reviews":["review-irene-resort-koh-lipe","review-serendipity-beach-resort-koh-lipe","review-ananya-lipe-resort-koh-lipe","review-idyllic-concept-resort-koh-lipe","review-bloom-cafe-hostel-koh-lipe","review-castaway-resort-koh-lipe","review-cabana-lipe-beach-resort-koh-lipe","review-bundhaya-resort-koh-lipe","review-salisa-resort-koh-lipe","review-z-touch-lipe-island-resort-koh-lipe"]}},"totalReviews":32,"totalRoundups":2}};

const LANG_META = {
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', notes: 'Natural modern Hebrew. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', notes: 'Modern Standard Arabic. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags.' },
};

function chunk(arr, n) { const out = []; for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n)); return out; }

const FIELD_RULES = `
FIELD RULES (roundup schema) — translate these, preserving all HTML tags/entities exactly:
  title, metaDesc, ogTitle, ogDesc, heroEyebrow, h1 (keep <br>/<span class="hi">/<span class="hi2"> tags),
  heroSub, heroStats[] (keep emoji + <strong> tags, translate the words), breadcrumb[].name (KEEP breadcrumb[].href unchanged),
  navReviewLabel, introH2, introHtml, mrtHtml, secLabel, toc[].name (this is the HOTEL NAME — keep as-is, same as entries[].name, do NOT translate proper nouns),
  entries[].type (short category descriptor, e.g. "5-Star Boutique Beach Resort" — translate),
  entries[].name (hotel proper name — KEEP AS-IS, do not translate or transliterate),
  entries[].revCount (MIXED: e.g. "Agoda 9.1 · Booking 9.0 · 379 reviews" — keep site names/numbers, translate only the word "reviews"),
  entries[].badge (short label like "🏆 Highest score" — translate the words, keep emoji), entries[].mrtTag (location + description — translate),
  entries[].priceSub (e.g. "from approx./night" — translate), entries[].rooms[].type (translate), entries[].rooms[].price (e.g. "from ฿7,500/night" — translate "from"/"night", keep the price number+currency),
  entries[].tags[] (keep emoji, translate words), entries[].storyHtml, entries[].tipHtml (keep <strong> tags), entries[].pros[], entries[].cons[], entries[].dividerText,
  compareTitle, compareCols[] (short table headers), compareRows[].name (KEEP hotel name as-is), compareRows[].type, compareRows[].access, compareRows[].badge (short label, no emoji here),
  adviceTitle, advice[].head, advice[].bodyHtml (keep <strong> tags AND the hotel names inside them unchanged),
  noteHtml (keep <strong> tags), faqTitle, faq[].q, faq[].a (keep <strong> tags),
  quickAnswerHtml (keep <strong> tags).

DO NOT TOUCH (copy byte-for-byte): slug, image, heroImg, entries[].id/.rank/.rankColor/.badgeColor/.img/.score/.stars/.priceBig/.agodaUrl/.bookingUrl/.tripUrl/.reviewUrl/.addr,
  breadcrumb[].href, breadcrumbSchema (all of it), navReviewHref, compareRows[].rank/.rankColor/.score/.price/.badgeStyle, advice[].icon, faq order.
  Numbers, prices (฿ figures), URLs, hex colors, image paths — never touch. Site/brand names (Agoda, Booking.com, Trip.com, ThailandAddict) stay Latin.`;

const REVIEW_FIELD_RULES = `
FIELD RULES (review schema) — translate these, preserving all HTML tags/entities exactly:
  title, metaDesc, keywords, ogTitle, ogDesc, twDesc, schemaDesc, parentName, parentShort, navReviewLabel,
  crumbCityName, countryLabel, countryGuideLabel, badgeMid, badgeLoc, hiLoc, hiTag,
  type (short category descriptor — translate; typeEn is a DIFFERENT field, a fixed English category, leave typeEn untouched),
  typeFull, qiType, qiPriceUnit (e.g. "/night" — translate), qiRooms, qiCol5Label, qiCol5Value (place/area name — keep recognizable, translate descriptive words only), qiCol5Small,
  h1 (keep <em> tags), intro (keep <strong> tags), galleryAlts[],
  body[].html (keep all HTML tags — <strong>/<em>/quote blocks — translate the prose),
  highlights[].title, highlights[].text,
  ratingBars[].label (short dimension names: Service/Cleanliness/Location/Atmosphere/Rooms/Value — translate),
  booking.pros[], booking.cons[], agoda.pros[], agoda.cons[],
  honestSummary (keep <strong> tags), honestChecks[] (keep <strong> tags),
  rooms[].name (room-type name — translate, e.g. "Hillside Cottage" can often stay recognizable/transliterated), rooms[].full (translate, keep the bullet structure),
  tips[].title, tips[].body,
  info[].k (short field labels like "Type"/"Check-in"/"Wi-Fi" — translate), info[].v (translate descriptive text; KEEP pure times like "15:00" and pure numbers as-is, translate words around them),
  nearby[].n (place name — keep recognizable), nearby[].d (distance phrase like "~5 min drive" — translate),
  faqTitle, faq[].q, faq[].a (if present — some reviews have no faq array, that's fine).

DO NOT TOUCH (copy byte-for-byte): slug, cluster, score, starRating, ratingCount, typeEn, image, heroImg, heroSub1, heroSub2, heroSub2Href,
  streetAddress, addressLocality, addressCountry, priceRange, parentHref, parentCrumbUrl, crumbCityHref, countryHref, qiPrice,
  gallery[], ratingBars[].value/.width, booking.score, agoda.score, rooms[].price, bookingAgoda, bookingBooking, bookingTrip, mapImg, mapAddr.
  Numbers, prices, URLs, image paths never touch. Brand/site names (Agoda, Booking.com, Trip.com, ThailandAddict) stay Latin.`;

function roundupPrompt(city, lang) {
  const L = LANG_META[lang];
  const src = `${ROOT}\\astro\\src\\content\\roundups-en\\top10-hotels-${city}.json`;
  const dst = `${ROOT}\\astro\\src\\content\\roundups-${lang}\\top10-hotels-${city}.json`;
  return `Translate a Thailand hotel "Top 10" roundup page into **${L.name} (${lang})** for thailandaddict.com.

Read the English source: ${src}
Write the translated file to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure: same keys, same nesting, same array lengths/order as the English source. Add/remove nothing.
2. HOTEL PROPER NAMES (entries[].name, toc[].name, compareRows[].name, and any hotel name mentioned inside advice[].bodyHtml) must be IDENTICAL across every occurrence in this file — do not translate or vary them (a traveler must recognize the same hotel name everywhere on the page).
3. ${L.notes}
4. Output MUST be valid JSON (JSON.parse-able) for the whole file — escape any quotes needed inside string values.
5. Tone: warm, honest, concrete — like a well-traveled friend comparing real options, not marketing copy.

After writing, read the file back and confirm: valid JSON, same array lengths as the English source (same number of entries/toc/compareRows/advice/faq items), and that entries[].name matches toc[].name matches compareRows[].name for the same hotel throughout. Report success and any hotel-name you were unsure how to render.`;
}

function reviewBatchPrompt(city, lang, slugs) {
  const L = LANG_META[lang];
  const files = slugs.map(s => `${ROOT}\\astro\\src\\content\\reviews-en\\${s}.json  ->  ${ROOT}\\astro\\src\\content\\reviews-${lang}\\${s}.json`).join('\n');
  const roundupRef = `${ROOT}\\astro\\src\\content\\roundups-${lang}\\top10-hotels-${city}.json`;
  return `Translate ${slugs.length} Thailand hotel review pages into **${L.name} (${lang})** for thailandaddict.com (city: ${city}).

For EACH file below, read the English source and write the translated file to the target path:
${files}

IMPORTANT — hotel-name consistency: before translating, read the already-translated roundup at ${roundupRef} (it exists — it was translated in the previous pipeline stage). For each hotel in your batch, find its entries[].name in that roundup file and use that EXACT SAME rendering for this review's "name" field (and everywhere the hotel name appears in this review, e.g. in the title/h1/intro) — the roundup and its linked review must show one consistent name, not two different translations of the same hotel.

You personally do this with Read + Write for every file. Do NOT delegate or spawn sub-agents. Do all ${slugs.length} files in this one session.
${REVIEW_FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure per file: same keys, same nesting, same array lengths/order as the English source.
2. ${L.notes}
3. Output MUST be valid JSON (JSON.parse-able) for every file.
4. Tone: warm, honest, concrete — like a friend who actually stayed there, not marketing copy.

After writing all files, read each back and confirm valid JSON with matching structure/array-lengths to the English source, and that the hotel name matches the roundup's rendering. Report which of the ${slugs.length} files succeeded and any hotel name you were unsure about.`;
}

const jobs = [];
for (const lang of Object.keys(PENDING)) {
  for (const [city, c] of Object.entries(PENDING[lang].cities)) {
    jobs.push({ lang, city, roundupMissing: c.roundupMissing, reviews: c.reviews });
  }
}
log(`Finish Wave 2 — ${jobs.length} city jobs (${jobs.filter(j => j.roundupMissing).length} missing roundups, ${jobs.reduce((n, j) => n + j.reviews.length, 0)} missing reviews)`);
phase('Cities');

const results = await pipeline(
  jobs,
  (job) => job.roundupMissing
    ? agent(roundupPrompt(job.city, job.lang), { label: `roundup:${job.lang}:${job.city}`, phase: 'Cities', model: 'sonnet' })
    : Promise.resolve({ skipped: 'roundup exists' }),
  (_r, job) => parallel(
    chunk(job.reviews, 3).map((batch) => () =>
      agent(reviewBatchPrompt(job.city, job.lang, batch), { label: `reviews:${job.lang}:${job.city}:${batch[0].replace('review-', '')}`, phase: 'Cities', model: 'sonnet' })
    )
  )
);

log(`Wave 2 finish complete: ${jobs.length} city pipelines run.`);
return { jobs: jobs.length, roundups: jobs.filter(j => j.roundupMissing).length, reviews: jobs.reduce((n, j) => n + j.reviews.length, 0) };

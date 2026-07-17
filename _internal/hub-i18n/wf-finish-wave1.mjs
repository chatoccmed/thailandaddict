export const meta = {
  name: 'finish-wave1-ru-ja',
  description: 'Finish Wave 1 booking-funnel i18n: translate ONLY the missing ru+ja hotel reviews/roundups (resume-aware, pending list derived from disk), Sonnet 5, pipelined per city so reviews follow their roundup for hotel-name consistency',
  phases: [
    { title: 'Cities', detail: 'per city: translate missing roundup (if any), then missing reviews in batches of 3', model: 'sonnet' },
  ],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

// Pending work-list computed from disk (compute-pending.mjs) — only files that do NOT yet exist.
const PENDING = {"ru":{"cities":{"nan":{"roundupMissing":false,"reviews":["review-paknap-hostel-nan","review-nan-boutique-hotel-nan","review-cuteinnan-hostel-nan"]},"sukhothai":{"roundupMissing":false,"reviews":["review-phiphu-art-and-gallery-boutique-sukhothai","review-tr-guesthouse-sukhothai","review-at-home-sukhothai-sukhothai","review-tharaburi-resort-sukhothai","review-baan-georges-hotel-sukhothai","review-le-charme-sukhothai-resort-sukhothai"]},"hat-yai":{"roundupMissing":true,"reviews":["review-lee-gardens-plaza-hotel-hat-yai","review-buri-sriphu-hotel-hat-yai","review-centara-hotel-hat-yai","review-crystal-design-hotel-hat-yai","review-hop-inn-airport-hat-yai","review-b2-rat-uthit-hat-yai","review-the-bedroom-railway-hat-yai","review-hatyai-backpackers-hostel-hat-yai","review-bp-grand-tower-hat-yai","review-asian-hotel-nipat-uthit-hat-yai","review-ido-boutique-suite-hat-yai","review-lee-gardens-hotel-downtown-hat-yai"]}}},"ja":{"cities":{"prachuap-khiri-khan":{"roundupMissing":false,"reviews":["review-putahracsa-hua-hin-resort-prachuap-khiri-khan","review-anantara-hua-hin-resort-prachuap-khiri-khan","review-sirarun-resort-ban-krut-prachuap-khiri-khan","review-kao-tao-villa-beach-resort-prachuap-khiri-khan","review-prachuap-grand-hotel-prachuap-khiri-khan","review-cape-nidhra-hotel-hua-hin-prachuap-khiri-khan","review-veranda-lodge-hua-hin-prachuap-khiri-khan","review-ban-krut-resort-prachuap-khiri-khan","review-sunshine-hostel-hua-hin-prachuap-khiri-khan"]},"kanchanaburi":{"roundupMissing":false,"reviews":["review-the-float-house-river-kwai-kanchanaburi","review-u-inchantree-kanchanaburi","review-river-kwai-jungle-rafts-kanchanaburi","review-river-kwai-resotel-kanchanaburi","review-hintok-river-camp-kanchanaburi","review-comsaed-river-kwai-resort-kanchanaburi","review-royal-river-kwai-resort-spa-kanchanaburi","review-sams-house-guesthouse-kanchanaburi","review-no9-hostel-kanchanaburi","review-river-kwai-hotel-kanchanaburi","review-the-jolly-frog-kanchanaburi","review-p-guesthouse-country-resort-kanchanaburi"]},"ayutthaya":{"roundupMissing":false,"reviews":["review-sala-ayutthaya-ayutthaya","review-plus-hostel-ayutthaya-ayutthaya","review-classic-kameo-hotel-serviced-apartments-ayutthaya","review-baan-tye-wang-guesthouse-ayutthaya","review-kantary-hotel-ayutthaya","review-tamarind-guesthouse-ayutthaya","review-iudia-hotel-ayutthaya","review-baan-mee-suk-ayutthaya-ayutthaya","review-busaba-ayutthaya-ayutthaya","review-krungsri-river-hotel-ayutthaya"]},"rayong":{"roundupMissing":false,"reviews":["review-paradee-rayong","review-le-vimarn-cottages-spa-rayong","review-rayong-marriott-resort-spa-rayong","review-sai-kaew-beach-resort-rayong","review-tubtim-resort-rayong","review-ao-prao-resort-rayong","review-kantary-bay-rayong","review-vimarn-samed-resort-rayong","review-star-convention-hotel-rayong","review-centara-q-resort-rayong","review-banphe-hostel-rayong","review-stay-samed-rayong"]},"trat":{"roundupMissing":false,"reviews":["review-dinso-resort-villas-ko-chang-trat","review-santhiya-tree-koh-chang-resort-trat","review-shantaa-resort-kohkood-trat","review-high-season-pool-villa-spa-koh-kood-trat","review-awa-koh-chang-trat","review-kc-grande-resort-spa-trat","review-seavana-beach-resort-koh-mak-trat","review-mira-montra-resort-koh-mak-trat","review-chang-buri-resort-spa-trat","review-trat-city-hotel-trat","review-koh-kood-resort-trat","review-pajamas-koh-chang-trat"]},"phang-nga":{"roundupMissing":false,"reviews":["review-the-sarojin-phang-nga","review-santhiya-koh-yao-yai-phang-nga","review-jw-marriott-khao-lak-phang-nga","review-casa-de-la-flora-phang-nga","review-la-flora-khao-lak-phang-nga","review-cape-kudu-phang-nga","review-elixir-koh-yao-yai-phang-nga","review-koyao-island-resort-phang-nga","review-khaolak-merlin-phang-nga","review-slumber-party-surf-khao-lak-phang-nga","review-thap-lamu-andaman-phang-nga","review-phang-nga-guesthouse-phang-nga"]},"nan":{"roundupMissing":false,"reviews":["review-nan-nakara-boutique-hotel-nan","review-dhevaraj-hotel-nan","review-puadeview-boutique-resort-nan","review-phukananan-resort-nan","review-hugpua-hotel-nan","review-nan-boutique-resort-nan","review-paknap-hostel-nan","review-nan-boutique-hotel-nan","review-cuteinnan-hostel-nan","review-the-impress-nan-hotel-nan"]},"mae-hong-son":{"roundupMissing":false,"reviews":["review-pai-village-boutique-resort-mae-hong-son","review-reverie-siam-resort-mae-hong-son","review-the-quarter-pai-mae-hong-son","review-sang-tong-huts-mae-hong-son","review-the-oia-pai-resort-mae-hong-son","review-pai-country-hut-mae-hong-son","review-common-grounds-pai-mae-hong-son","review-fern-resort-mae-hong-son","review-baan-pai-riverside-mae-hong-son","review-spicypai-backpackers-mae-hong-son"]},"sukhothai":{"roundupMissing":false,"reviews":["review-thai-thai-sukhothai-resort-sukhothai","review-sriwilai-sukhothai-resort-spa-sukhothai","review-legendha-sukhothai-resort-sukhothai","review-sukhothai-heritage-resort-sukhothai","review-phiphu-art-and-gallery-boutique-sukhothai","review-tr-guesthouse-sukhothai","review-at-home-sukhothai-sukhothai","review-tharaburi-resort-sukhothai","review-baan-georges-hotel-sukhothai","review-le-charme-sukhothai-resort-sukhothai"]},"nakhon-ratchasima":{"roundupMissing":false,"reviews":["review-intercontinental-khao-yai-resort-nakhon-ratchasima","review-the-series-resort-khaoyai-nakhon-ratchasima","review-thames-valley-khao-yai-nakhon-ratchasima","review-centara-korat-nakhon-ratchasima","review-kantary-hotel-korat-nakhon-ratchasima","review-u-khao-yai-nakhon-ratchasima","review-koranaree-courtyard-boutique-hotel-nakhon-ratchasima","review-mountain-creek-golf-resort-and-residences-nakhon-ratchasima","review-moon-river-resort-phimai-nakhon-ratchasima","review-b2-korat-night-market-boutique-and-budget-hotel-nakhon-ratchasima","review-phimai-paradise-boutique-hotel-nakhon-ratchasima","review-thap-kaeo-poshtel-city-center-korat-nakhon-ratchasima"]},"phetchabun":{"roundupMissing":false,"reviews":["review-the-bluesky-resort-khao-kho-phetchabun","review-pino-latte-khaokho-phetchabun","review-hop-inn-phetchabun","review-rom-karavek-khao-kho-resort-phetchabun","review-blossom-hotel-phetchabun","review-the-proud-resort-khao-kho-phetchabun","review-phuphamok-khao-kho-resort-phetchabun","review-long-khao-camp-phu-thap-boek-phetchabun","review-sr-residence-hotel-phetchabun","review-khaokhotalamok-resort-phetchabun","review-station-phu-thap-buek-resort-phetchabun","review-khao-kho-overview-resort-phetchabun"]},"koh-phangan":{"roundupMissing":false,"reviews":["review-santhiya-resort-spa-koh-phangan","review-anantara-rasananda-koh-phangan","review-panviman-resort-koh-phangan","review-orion-healing-wellness-srithanu-koh-phangan","review-tide-tribe-hostel-thong-sala-koh-phangan","review-loyfa-natural-resort-srithanu-koh-phangan","review-araya-boutique-thong-sala-koh-phangan","review-phangan-beach-resort-ban-tai-koh-phangan","review-the-1-boutique-thong-sala-koh-phangan","review-rin-beach-resort-haad-rin-koh-phangan","review-sandy-bay-bungalows-haad-yao-koh-phangan","review-chaloklum-bay-resort-koh-phangan"]},"hat-yai":{"roundupMissing":false,"reviews":["review-lee-gardens-plaza-hotel-hat-yai","review-buri-sriphu-hotel-hat-yai","review-centara-hotel-hat-yai","review-crystal-design-hotel-hat-yai","review-hop-inn-airport-hat-yai","review-b2-rat-uthit-hat-yai","review-the-bedroom-railway-hat-yai","review-hatyai-backpackers-hostel-hat-yai","review-bp-grand-tower-hat-yai","review-asian-hotel-nipat-uthit-hat-yai","review-ido-boutique-suite-hat-yai","review-lee-gardens-hotel-downtown-hat-yai"]},"samui":{"roundupMissing":false,"reviews":["review-banyan-tree-samui","review-garrya-tongsai-bay-samui","review-sala-samui-chaweng-beach-resort-samui","review-lub-d-koh-samui-chaweng-samui","review-la-vida-samui","review-ozo-chaweng-samui","review-greenlight-fishermans-village-resort-samui","review-chaweng-regent-beach-resort-samui","review-the-waterfront-boutique-hotel-samui","review-lamai-wanta-beach-resort-samui"]},"pai":{"roundupMissing":false,"reviews":["review-reverie-siam-resort-pai","review-the-quarter-pai","review-yoma-hotel-pai","review-pairadise-pai","review-pai-village-boutique-resort-pai","review-common-grounds-pai","review-pai-my-guest-resort-pai","review-puri-pai-villa-pai","review-phu-pai-art-resort-pai","review-baan-pai-riverside-pai","review-b2-pai-premier-resort-pai","review-baan-krating-pai-resort-pai"]},"pattaya":{"roundupMissing":false,"reviews":["review-centara-grand-mirage-pattaya","review-hilton-pattaya","review-somerset-pattaya","review-cross-pratamnak-pattaya","review-intercontinental-resort-pattaya","review-cape-dara-resort-pattaya","review-veranda-na-jomtien-pattaya","review-wave-hotel-pattaya","review-nonze-hostel-pattaya","review-hotel-vista-pattaya"]},"huahin":{"roundupMissing":false,"reviews":["review-centara-grand-beach-resort-villas-huahin","review-hyatt-regency-huahin","review-putahracsa-huahin","review-intercontinental-huahin","review-movenpick-asara-huahin","review-anantasila-beach-resort-huahin","review-asira-boutique-huahin","review-g-huahin-resort-mall","review-maven-stylish-hotel-huahin","review-litera-hostel-huahin","review-sanae-beach-huahin","review-takiab-beach-resort-huahin"]},"khao-yai":{"roundupMissing":false,"reviews":["review-atta-lakeside-resort-suite-khao-yai","review-u-khao-yai","review-lala-mukha-tented-resort-khao-yai","review-movenpick-resort-khao-yai","review-toscana-valley-castello-della-valle-khao-yai","review-palio-inn-khao-yai","review-botanica-khao-yai","review-the-greenery-resort-khao-yai","review-klang-dong-mountain-view-khao-yai","review-hello-hostel-pakchong-khao-yai"]},"koh-chang":{"roundupMissing":true,"reviews":["review-aiyapura-koh-chang","review-emerald-cove-koh-chang","review-sylvan-koh-chang","review-kc-grande-koh-chang","review-nest-sense-koh-chang","review-klong-prao-resort-koh-chang","review-aana-resort-spa-koh-chang","review-warapura-koh-chang","review-indie-beach-bungalows-koh-chang","review-kaibae-beach-resort-koh-chang","review-independent-bos-koh-chang","review-bang-bao-cliff-view-koh-chang"]},"koh-lipe":{"roundupMissing":false,"reviews":["review-irene-resort-koh-lipe","review-serendipity-beach-resort-koh-lipe","review-ananya-lipe-resort-koh-lipe","review-idyllic-concept-resort-koh-lipe","review-bloom-cafe-hostel-koh-lipe","review-castaway-resort-koh-lipe","review-cabana-lipe-beach-resort-koh-lipe","review-bundhaya-resort-koh-lipe","review-salisa-resort-koh-lipe","review-z-touch-lipe-island-resort-koh-lipe"]},"koh-kood":{"roundupMissing":false,"reviews":["review-shantaa-koh-kood","review-tinkerbell-privacy-resort-koh-kood","review-koh-kood-beach-resort-koh-kood","review-dusita-resort-koh-kood","review-peter-pan-resort-koh-kood","review-the-beach-natural-resort-koh-kood","review-captain-hook-resort-koh-kood","review-tolani-resort-koh-kood","review-little-white-bird-hostel-koh-kood","review-koh-kood-garden-koh-kood","review-rest-sea-resort-koh-kood","review-ko-kut-ao-phrao-beach-resort-koh-kood"]},"koh-mak":{"roundupMissing":false,"reviews":["review-seavana-koh-mak","review-lazy-day-koh-mak","review-ao-kao-white-sand-koh-mak","review-mira-montra-koh-mak","review-plubpla-koh-mak","review-makathanee-koh-mak","review-islanda-koh-mak","review-koh-mak-resort-koh-mak","review-baan-talay-hostel-koh-mak","review-monkey-island-koh-mak","review-cococape-koh-mak","review-cinnamon-art-koh-mak"]},"koh-larn":{"roundupMissing":false,"reviews":["review-sarorach-pool-villa-resort-koh-larn","review-xanadu-beach-resort-koh-larn","review-rhya-private-pool-villa-koh-larn","review-lareena-resort-koh-larn","review-kampu-resort-koh-larn","review-tiamo-koh-larn","review-rimtalay-resort-koh-larn","review-white-house-koh-larn","review-at-the-beach-resort-koh-larn","review-sea-beach-1-koh-larn","review-tarn-tawan-hotel-koh-larn","review-baan-sai-thong-koh-larn"]}}}};

const LANG_META = {
  ru: { name: 'Russian', script: 'Cyrillic', notes: 'Informal "ты" register, consistent with earlier site translations. Transliterate hotel-area names phonetically.' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', notes: 'Katakana for hotel/place names, natural warm tone, not overly formal keigo.' },
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
log(`Finish Wave 1 — ${jobs.length} city jobs (${jobs.filter(j => j.roundupMissing).length} missing roundups, ${jobs.reduce((n, j) => n + j.reviews.length, 0)} missing reviews)`);
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

log(`Wave 1 finish complete: ${jobs.length} city pipelines run.`);
return { jobs: jobs.length, roundups: jobs.filter(j => j.roundupMissing).length, reviews: jobs.reduce((n, j) => n + j.reviews.length, 0) };

export const meta = {
  name: 'translate-articles-plan-b',
  description: 'Translate deep tourism-city articles (attraction/food/eat-ranking/itinerary/prep/guide) from EN into a Tier-1 language, one agent per article',
  phases: [{ title: 'Translate' }],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const lang = "ru";
const slugs = ["trat-seafood","trat-snorkeling-islands","trat-town-food","vana-nava-water-jungle-hua-hin","wat-arun-guide","wat-ban-rai-korat","wat-buppharam-trat","wat-chaiwatthanaram-guide","wat-chalong-guide","wat-chong-kham-chong-klang","wat-hat-yai-nai","wat-huay-pla-kang-guide","wat-khao-chong-krachok","wat-khunaram-mummified-monk","wat-lokayasutharam-guide","wat-mahathat-guide","wat-mahathat-sukhothai","wat-pha-sorn-kaew","wat-pho-guide","wat-phra-si-sanphet-guide","wat-phrathat-chae-haeng","wat-phumin-guide","wat-phutthaisawan-guide","wat-rong-khun-guide","wat-rong-suea-ten-guide","wat-sa-si-guide","wat-si-chum-guide","wat-tham-suea-guide","wat-tham-suwan-kuha","wat-yai-chai-mongkhon-guide","yom-chinda-old-street"];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Hanzi', notes: 'Natural Mainland Chinese travel-content register, matching Ctrip/Mafengwo conventions. Simplified characters only.' },
  ru: { name: 'Russian', script: 'Cyrillic', notes: 'Informal "ты" register, consistent with earlier site translations. Transliterate place/dish names phonetically.' },
  ko: { name: 'Korean', script: 'Hangul', notes: 'Natural Korean travel-content register, matching Yanolja/Klook Korean conventions.' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', notes: 'Katakana for place/dish names, natural warm tone, not overly formal keigo.' },
  hi: { name: 'Hindi', script: 'Devanagari', notes: 'Natural Hindi Devanagari, matching MakeMyTrip/Goibibo conventions. Do NOT leave stray Thai-script place-name fragments untranslated.' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', notes: 'Natural modern Hebrew. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', notes: 'Modern Standard Arabic. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
};
const L = LANG_META[lang];

const FIELD_RULES = `
FIELD RULES (article schema) — translate these, preserving all HTML tags/entities exactly:
  title, metaDesc, keywords, ogTitle, ogDesc, crumbCity (city display name — translate/transliterate naturally,
    same spirit as a hotel review's crumbCityName), regionLabel, eyebrow, h1 (keep any HTML tags), heroCredit
    (photo-credit caption text, e.g. "Photo: official website X" — translate the words, NOT heroCreditHref),
  intro (keep HTML), chips[] (short filter chips — keep emoji, translate words), readTime (e.g. "5 min read"),
  quickAnswerHtml (keep HTML tags, 40-60 words), quickAnswerH2,
  faq[].q, faq[].a (keep HTML tags), related[].title (KEEP related[].href unchanged),
  rail[].title, rail[].note (KEEP rail[].href/.img unchanged).

  Per BLOCK KIND inside blocks[]:
  - h2: translate .text (KEEP .id unchanged — it is an anchor slug)
  - p: translate .html (keep all tags)
  - image: translate .alt, .caption, .credit (KEEP .src, .creditHref unchanged)
  - restaurant: translate .area, .cuisine, .signature, .descHtml (keep tags), .mustOrder[] (keep authentic
    dish names recognizable — transliterate, don't invent), .tags[] (short descriptive labels e.g. "Halal-friendly" —
    translate), .priceRange (this may be a DESCRIPTIVE phrase like "~400 THB per cocktail" or "50-80 THB" —
    translate the surrounding words naturally, but keep every number/currency exactly as in the source — never
    change a figure), .bestFor, .zone, .foodType (short descriptive labels for display — translate naturally),
    .stayLabel (short CTA label like "Book a stay" — UI text, translate it).
    KEEP UNCHANGED: .rank, .name (restaurant proper name — never translate/rename), .nameEn,
    .score, .img, .creditHref, .mapHref, .fbHref, .fbPage, .igPost, .libImg, .libCreditHref, .stayHref,
    .hours, .priceUsd, .lat, .lng (never touch coordinates), .rating, .ratingCount, .ratingSrc,
    .gallery[].alt (translate), .gallery[].credit (translate), .gallery[].src/.creditHref (unchanged).
  - staycta: translate .title, .text, .links[].label, .links[].note, .ctaLabel (KEEP .img, .links[].href, .ctaHref)
  - foodexp / experiences (same shape): translate .title, .text, .items[].label, .items[].note, .ctaLabel
    (KEEP .items[].href, .items[].provider — brand name like "Klook"/"GetYourGuide" stays Latin, .items[].emoji, .ctaHref)
  - localtips: translate .title, .items[].title, .items[].text (KEEP .items[].icon)
  - list: translate every string in .items[]
  - table: translate .caption, .headers[], and prose cells in .rows[][] — KEEP pure numbers/prices/symbols as-is
  - heatmap: translate .caption, .regions[] (region names), .rows[].m (month label), .legend[]
    (KEEP .rows[].cells[].e — weather emoji, and .rows[].cells[].s — an internal good/ok/bad CSS-class code, NOT display text, never translate .s)
  - tip: translate .title, .html (keep tags)
  - ranked: translate .items[].name (item/place name — descriptive, not a fixed brand — translate it),
    .items[].blurb, .items[].meta, .items[].tags[], .items[].price (this is often a DESCRIPTIVE price phrase
    like "Small bowl ~฿20" or "from ฿40" — translate the surrounding words naturally, but keep every number
    and currency symbol/abbreviation exactly as in the source — never change a figure) (KEEP .items[].rank, .items[].href unchanged)
  - cards: translate .items[].name (unless it is clearly a specific proper-noun business/place, then keep recognizable),
    .items[].blurb, .items[].tag (KEEP .items[].href)
  - day: translate .label (e.g. "Day 1" — translate "Day", keep the number), .title, .items[].activity, and
    .items[].note ONLY IF that item already has a .note field in the source — never add a .note/.time field
    that isn't present on the source item (KEEP .items[].time — a clock time like "09:00")
  - cta: translate .text, .label (KEEP .href)
  - embed: translate .title, .note (KEEP .gmapsQuery, .lat, .lng, .fbPage, .igPost, .mapsLink unchanged —
    these are lookup/link values; a translated map-search query can break the lookup)

DO NOT TOUCH ANYWHERE (copy byte-for-byte): slug, type, cluster, crumbCityHref, regionHref, heroImg, heroEmoji,
  heroCreditHref, image, publishedDate, modifiedDate, lat, lng, tags[] **at the TOP LEVEL of the article only**
  (this is the AI-trip-planner controlled-vocabulary array — copy every entry exactly; do NOT confuse it with the
  translatable restaurant.tags[]/ranked.items[].tags[] which are different, nested, free-text label arrays).
  Numbers, prices (฿ figures), URLs, image paths, hex colors — never touch. Brand/site names (Agoda, Booking.com,
  Trip.com, Klook, GetYourGuide, ThailandAddict) stay Latin.`;

function articlePrompt(slug) {
  const src = `${ROOT}\\astro\\src\\content\\articles-en\\${slug}.json`;
  const dst = `${ROOT}\\astro\\src\\content\\articles-${lang}\\${slug}.json`;
  return `Translate a Thailand travel article into **${L.name} (${lang})** for thailandaddict.com.

Read the English source: ${src}
Write the translated file to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure: same top-level keys, same block kinds/order/count, same array lengths, same nesting as the English source. Add/remove nothing — if a field is optional and absent in the source, leave it absent in your output too.
2. Natural, fluent ${L.name} (${L.script}) — a real travel writer's register, matching how ${L.name === 'Chinese (Simplified)' ? 'Ctrip/Mafengwo' : L.name === 'Russian' ? 'a Russian travel blog' : L.name === 'Korean' ? 'Yanolja/Klook Korean' : L.name === 'Japanese' ? 'a Japanese travel magazine' : L.name === 'Hindi' ? 'MakeMyTrip/Goibibo' : 'a modern travel site'} would write it. Not a stiff literal translation.
3. ${L.notes}
4. ZERO English words left untranslated in prose (except brand/proper names explicitly listed as DO NOT TOUCH above). ZERO raw Thai-script fragments anywhere EXCEPT where the English source itself already contains a raw Thai-script fragment (e.g. a venue's own Thai-script name) — copy that exact fragment unchanged, don't drop it. Never ADD a new Thai-script parenthetical/gloss for a romanized Thai word or dish name that appears ONLY in Latin script in the English source (e.g. if the source says "samrub" or "pu ob wun sen" with no Thai script, do NOT insert "(สำรับ)"/"(ปูอบวุ้นเส้น)" — keep it exactly as romanized).
5. Do not invent facts, prices, or claims not present in the English source. Do not add promotional urgency/scarcity language not in the source.
6. Valid JSON output — the file must parse.

Write the file now. Return one line: {"slug":"${slug}","ok":true}.`;
}

phase('Translate');
const results = await parallel(slugs.map(slug => () =>
  agent(articlePrompt(slug), { label: `${lang}:${slug.slice(0, 24)}`, phase: 'Translate', effort: 'high' })
    .then(() => ({ slug, ok: true }))
    .catch(e => ({ slug, ok: false, err: String(e).slice(0, 150) }))
));
const ok = results.filter(r => r && r.ok).length;
return { lang, requested: slugs.length, ok, failed: results.filter(r => !r || !r.ok).map(r => r?.slug) };

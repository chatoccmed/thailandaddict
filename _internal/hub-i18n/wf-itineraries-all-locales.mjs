export const meta = {
  name: 'translate-itineraries-9lang',
  description: 'Translate the 11 day-by-day itineraries the homepage planner reads into all 7 remaining Tier-1 languages',
  phases: [{ title: 'Translate', detail: '11 itineraries x 7 languages, one agent per file' }],
};

/* The planner-first homepage is "pick a destination and how many days, see the
   plan". gen-proto-home reads those plans from articles-<loc>/<dest>-<tier>-itinerary.json,
   and all seven non-th/en locales have 0 of the 11 — so the homepage's whole
   reason for existing is dead in those languages. This fills them.

   FIELD_RULES below is the spec proven on the Plan-B run (874 zh + 874 ru
   articles, validated clean). Only the `day` block kind really matters here,
   but the itineraries also carry cards/ranked/staycta/foodexp/tip/table blocks,
   so the full rule set applies. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

const SLUGS = [
  'krabi-1-day-itinerary', 'krabi-2d1n-itinerary', 'krabi-3d2n-itinerary',
  'chiang-mai-3d2n-itinerary', 'phuket-3d2n-itinerary',
  'bangkok-2d1n-itinerary', 'bangkok-3d2n-itinerary',
  'ayutthaya-2d1n-itinerary', 'ayutthaya-3d2n-itinerary',
  'pai-3d2n-itinerary', 'chiang-rai-3d2n-itinerary',
];
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Hanzi', register: 'Ctrip/Mafengwo', notes: 'Natural Mainland Chinese travel-content register. Simplified characters only.' },
  ru: { name: 'Russian', script: 'Cyrillic', register: 'a Russian travel blog', notes: 'Informal "ты" register, consistent with earlier site translations. Transliterate place/dish names phonetically.' },
  ko: { name: 'Korean', script: 'Hangul', register: 'Yanolja/Klook Korean', notes: 'Natural Korean travel-content register.' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', register: 'a Japanese travel magazine', notes: 'Katakana for place/dish names, natural warm tone, not overly formal keigo.' },
  hi: { name: 'Hindi', script: 'Devanagari', register: 'MakeMyTrip/Goibibo', notes: 'Natural Hindi Devanagari. Do NOT leave stray Thai-script place-name fragments untranslated.' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', register: 'a modern travel site', notes: 'Natural modern Hebrew. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', register: 'a modern travel site', notes: 'Modern Standard Arabic. Page renders dir="rtl" — do not add manual RTL/LRM marks or reorder HTML tags/arrows.' },
};

const FIELD_RULES = `
FIELD RULES (article schema) — translate these, preserving all HTML tags/entities exactly:
  title, metaDesc, keywords, ogTitle, ogDesc, crumbCity (city display name — translate/transliterate naturally),
  regionLabel, eyebrow, h1 (keep any HTML tags), heroCredit (photo-credit caption text — translate the words,
  NOT heroCreditHref), intro (keep HTML), chips[] (keep emoji, translate words), readTime (e.g. "5 min read"),
  quickAnswerHtml (keep HTML tags), quickAnswerH2, faq[].q, faq[].a (keep HTML tags),
  related[].title (KEEP related[].href unchanged), rail[].title, rail[].note (KEEP rail[].href/.img unchanged).

  Per BLOCK KIND inside blocks[]:
  - day: translate .label (e.g. "Day 1" — translate "Day", keep the number), .title, .items[].activity,
    .items[].note. KEEP .items[].time — a clock time like "09:00" — exactly.
  - h2: translate .text (KEEP .id — it is an anchor slug)
  - p: translate .html (keep all tags)
  - image: translate .alt, .caption, .credit (KEEP .src, .creditHref)
  - tip: translate .title, .html (keep tags)
  - list: translate every string in .items[]
  - table: translate .caption, .headers[], and prose cells in .rows[][] — KEEP pure numbers/prices/symbols as-is
  - localtips: translate .title, .items[].title, .items[].text (KEEP .items[].icon)
  - ranked: translate .items[].name, .items[].blurb, .items[].meta, .items[].tags[], .items[].price
    (a descriptive phrase like "from ฿40" — translate the words, keep every figure and currency symbol
    exactly) (KEEP .items[].rank, .items[].href)
  - cards: translate .items[].name (unless a proper-noun business, then keep recognizable), .items[].blurb,
    .items[].tag (KEEP .items[].href)
  - staycta: translate .title, .text, .links[].label, .links[].note, .ctaLabel (KEEP .img, .links[].href, .ctaHref)
  - foodexp / experiences: translate .title, .text, .items[].label, .items[].note, .ctaLabel
    (KEEP .items[].href, .items[].provider — a brand like "Klook" stays Latin — .items[].emoji, .ctaHref)
  - restaurant: translate .area, .cuisine, .signature, .descHtml, .mustOrder[], .tags[], .stayLabel.
    KEEP UNCHANGED: .rank, .name, .nameEn, .priceRange, .score, .img, .creditHref, .mapHref, .fbHref,
    .fbPage, .igPost, .libImg, .libCreditHref, .stayHref, .hours, .priceUsd, .lat, .lng, .rating,
    .ratingCount, .ratingSrc, .bestFor, .zone, .foodType.
  - cta: translate .text, .label (KEEP .href)
  - heatmap: translate .caption, .regions[], .rows[].m, .legend[] (KEEP .rows[].cells[].e and .cells[].s)`;

function prompt(lang, slug) {
  const L = LANG_META[lang];
  const src = `${ROOT}\\astro\\src\\content\\articles-en\\${slug}.json`;
  const dst = `${ROOT}\\astro\\src\\content\\articles-${lang}\\${slug}.json`;
  return `Translate a Thailand day-by-day itinerary into **${L.name} (${lang})** for thailandaddict.com.

Read the English source: ${src}
Write the translated file to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure: same top-level keys, same block kinds/order/count, same array lengths, same nesting as the English source. Add nothing, remove nothing — if a field is absent in the source, leave it absent.
2. Natural, fluent ${L.name} (${L.script}) — a real travel writer's register, the way ${L.register} would write it. Not a stiff literal translation.
3. ${L.notes}
4. ZERO English words left untranslated in prose, except brand/proper names listed as unchanged above. ZERO raw Thai-script fragments anywhere.
5. Every clock time, price figure, currency symbol, distance and duration must match the English source exactly. This is an itinerary — a changed time is a changed fact.
6. Do not invent facts, prices or claims not in the source. Do not add urgency or scarcity language.
7. Valid JSON — the file must parse.

Write the file now. Return one line: {"lang":"${lang}","slug":"${slug}","ok":true}.`;
}

const JOBS = [];
for (const lang of LANGS) for (const slug of SLUGS) JOBS.push({ lang, slug });

phase('Translate');
log(`${JOBS.length} files: ${SLUGS.length} itineraries x ${LANGS.length} languages`);

const results = await parallel(JOBS.map((j) => () =>
  agent(prompt(j.lang, j.slug), {
    label: `${j.lang}:${j.slug.replace('-itinerary', '')}`,
    phase: 'Translate',
    effort: 'high',
  }).then(() => ({ ...j, ok: true })).catch((e) => ({ ...j, ok: false, err: String(e).slice(0, 140) }))
));

const ok = results.filter((r) => r && r.ok);
const bad = results.filter((r) => !r || !r.ok);
const perLang = {};
for (const r of ok) perLang[r.lang] = (perLang[r.lang] || 0) + 1;
return { requested: JOBS.length, ok: ok.length, perLang, failed: bad.map((r) => r && (r.lang + '/' + r.slug)) };

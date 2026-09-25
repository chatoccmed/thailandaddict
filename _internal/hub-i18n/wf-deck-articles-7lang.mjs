export const meta = {
  name: 'translate-deck-articles-7lang',
  description: 'Translate the 14 eat/see articles the homepage deck reads into the 7 remaining Tier-1 languages',
  phases: [{ title: 'Translate', detail: '14 articles x 7 languages, one agent per file' }],
};

/* The homepage deck shows "stay / eat / see" for six destinations. The stay
   shelf reads roundups-<loc>, which all nine locales have. The other two read
   articles-<loc>, which the seven non-th/en locales have none of — so in those
   languages two of the deck's three shelves render empty and the page loses
   most of what it is for. These 14 articles are exactly what the six panels
   ask for, including the three Bangkok neighbourhood attraction lists its
   seePool draws from. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

const SLUGS = [
  'top10-attractions-krabi', 'top10-attractions-chiang-mai', 'top10-attractions-phuket',
  'top10-attractions-ayutthaya', 'top10-attractions-chiang-rai',
  'top10-attractions-riverside', 'top10-attractions-chinatown', 'top10-attractions-silom-sathorn',
  'top10-popular-restaurants-krabi', 'top10-popular-restaurants-chiang-mai',
  'top10-popular-restaurants-phuket', 'top10-popular-restaurants-bangkok',
  'top10-popular-restaurants-ayutthaya', 'top10-popular-restaurants-chiang-rai',
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
  title, metaDesc, keywords, ogTitle, ogDesc, crumbCity (city display name — translate/transliterate
  naturally), regionLabel, eyebrow, h1 (keep any HTML tags), heroCredit (caption words only — NOT
  heroCreditHref), intro (keep HTML), chips[] (keep emoji, translate words), readTime,
  quickAnswerHtml (keep HTML tags), quickAnswerH2, faq[].q, faq[].a (keep HTML tags),
  related[].title (KEEP related[].href), rail[].title, rail[].note (KEEP rail[].href/.img).

  Per BLOCK KIND inside blocks[]:
  - restaurant: translate .area, .cuisine, .signature, .descHtml (keep tags), .mustOrder[] (keep
    authentic dish names recognisable — transliterate, do not invent), .tags[], .stayLabel (a short
    CTA like "Book a stay" — this IS UI text, translate it).
    KEEP UNCHANGED: .rank, .name (the business's own name — never translate or rename), .nameEn,
    .priceRange, .score, .img, .creditHref, .mapHref, .fbHref, .fbPage, .igPost, .libImg,
    .libCreditHref, .stayHref, .hours, .priceUsd, .lat, .lng (never touch coordinates), .rating,
    .ratingCount, .ratingSrc, .bestFor, .zone, .foodType.
    .gallery[].alt and .gallery[].credit translate; .gallery[].src and .creditHref do not.
  - h2: translate .text (KEEP .id — it is an anchor slug other pages link to)
  - p: translate .html (keep all tags)
  - image: translate .alt, .caption, .credit (KEEP .src, .creditHref)
  - tip: translate .title, .html (keep tags)
  - list: translate every string in .items[]
  - table: translate .caption, .headers[] and prose cells in .rows[][] — KEEP numbers/prices/symbols
  - localtips: translate .title, .items[].title, .items[].text (KEEP .items[].icon)
  - ranked: translate .items[].name, .items[].blurb, .items[].meta, .items[].tags[], .items[].price
    (a descriptive phrase like "Small bowl ~฿20" — translate the words, keep every figure and
    currency symbol exactly) (KEEP .items[].rank, .items[].href)
  - cards: translate .items[].name (unless a proper-noun business, keep recognisable), .items[].blurb,
    .items[].tag (KEEP .items[].href)
  - staycta: translate .title, .text, .links[].label, .links[].note, .ctaLabel (KEEP .img, hrefs)
  - foodexp / experiences: translate .title, .text, .items[].label, .items[].note, .ctaLabel
    (KEEP .items[].href, .items[].provider — a brand like "Klook" stays Latin — .items[].emoji, .ctaHref)
  - day: translate .label, .title, .items[].activity, .items[].note (KEEP .items[].time)
  - cta: translate .text, .label (KEEP .href)
  - heatmap: translate .caption, .regions[], .rows[].m, .legend[] (KEEP .rows[].cells[].e and .cells[].s)`;

function prompt(lang, slug) {
  const L = LANG_META[lang];
  const src = `${ROOT}\\astro\\src\\content\\articles-en\\${slug}.json`;
  const dst = `${ROOT}\\astro\\src\\content\\articles-${lang}\\${slug}.json`;
  return `Translate a Thailand travel article into **${L.name} (${lang})** for thailandaddict.com.

Read the English source: ${src}
Write the translated file to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${FIELD_RULES}

GENERAL RULES:
1. Preserve exact JSON structure: same top-level keys, same block kinds in the same order and count, same array lengths, same nesting. Add nothing, remove nothing — a field absent in the source stays absent.
2. Natural, fluent ${L.name} (${L.script}) — a real travel writer's register, the way ${L.register} would write it. Not a stiff literal translation.
3. ${L.notes}
4. ZERO English words left untranslated in prose, except brand and business names listed as unchanged. ZERO raw Thai-script fragments anywhere.
5. Every price, rating, review count, opening hour and coordinate must match the English source exactly. These are facts about real businesses.
6. Do not invent facts, prices or claims not in the source. Do not add urgency or scarcity language, and do not add a disclaimer the source does not have.
7. Valid JSON — the file must parse.

Write the file now. Return one line: {"lang":"${lang}","slug":"${slug}","ok":true}.`;
}

const JOBS = [];
for (const lang of LANGS) for (const slug of SLUGS) JOBS.push({ lang, slug });

phase('Translate');
log(`${JOBS.length} files: ${SLUGS.length} articles x ${LANGS.length} languages`);

const results = await parallel(JOBS.map((j) => () =>
  agent(prompt(j.lang, j.slug), {
    label: `${j.lang}:${j.slug.replace('top10-', '').slice(0, 26)}`,
    phase: 'Translate',
    effort: 'high',
  }).then(() => ({ ...j, ok: true })).catch((e) => ({ ...j, ok: false, err: String(e).slice(0, 140) }))
));

const ok = results.filter((r) => r && r.ok);
const perLang = {};
for (const r of ok) perLang[r.lang] = (perLang[r.lang] || 0) + 1;
return {
  requested: JOBS.length, ok: ok.length, perLang,
  failed: results.filter((r) => !r || !r.ok).map((r) => r && (r.lang + '/' + r.slug)),
};

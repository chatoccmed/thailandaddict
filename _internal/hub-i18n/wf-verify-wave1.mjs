export const meta = {
  name: 'verify-wave1-sample',
  description: 'Adversarial native-reader QA of a sample of the new ru/ja review+roundup translations — find fluency errors, untranslated English, meaning drift, and hotel-name inconsistency vs the city roundup',
  phases: [{ title: 'Verify', detail: 'one native-reader-refuter per file' }],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGNAME = { ru: 'Russian', ja: 'Japanese' };

// Sample: weighted to ja (bulk of new work + katakana hotel-name risk) and the two brand-new roundup cities.
const SAMPLE = [
  // --- ja: brand-new roundup city (koh-chang) — name-consistency anchor ---
  { coll: 'roundups', lang: 'ja', slug: 'top10-hotels-koh-chang', city: 'koh-chang' },
  { coll: 'reviews', lang: 'ja', slug: 'review-aiyapura-koh-chang', city: 'koh-chang' },
  { coll: 'reviews', lang: 'ja', slug: 'review-kc-grande-koh-chang', city: 'koh-chang' },
  // --- ja: variety across cities ---
  { coll: 'roundups', lang: 'ja', slug: 'top10-hotels-samui', city: 'samui' },
  { coll: 'reviews', lang: 'ja', slug: 'review-banyan-tree-samui', city: 'samui' },
  { coll: 'reviews', lang: 'ja', slug: 'review-anantara-hua-hin-resort-prachuap-khiri-khan', city: 'prachuap-khiri-khan' },
  { coll: 'reviews', lang: 'ja', slug: 'review-the-float-house-river-kwai-kanchanaburi', city: 'kanchanaburi' },
  { coll: 'reviews', lang: 'ja', slug: 'review-sala-ayutthaya-ayutthaya', city: 'ayutthaya' },
  { coll: 'reviews', lang: 'ja', slug: 'review-hilton-pattaya', city: 'pattaya' },
  { coll: 'reviews', lang: 'ja', slug: 'review-baan-sai-thong-koh-larn', city: 'koh-larn' },
  { coll: 'reviews', lang: 'ja', slug: 'review-the-sarojin-phang-nga', city: 'phang-nga' },
  { coll: 'reviews', lang: 'ja', slug: 'review-intercontinental-khao-yai-resort-nakhon-ratchasima', city: 'nakhon-ratchasima' },
  { coll: 'reviews', lang: 'ja', slug: 'review-reverie-siam-resort-pai', city: 'pai' },
  { coll: 'reviews', lang: 'ja', slug: 'review-hyatt-regency-huahin', city: 'huahin' },
  // --- ru: brand-new roundup city (hat-yai) ---
  { coll: 'roundups', lang: 'ru', slug: 'top10-hotels-hat-yai', city: 'hat-yai' },
  { coll: 'reviews', lang: 'ru', slug: 'review-lee-gardens-plaza-hotel-hat-yai', city: 'hat-yai' },
  { coll: 'reviews', lang: 'ru', slug: 'review-centara-hotel-hat-yai', city: 'hat-yai' },
  // --- ru: the other pending cities ---
  { coll: 'reviews', lang: 'ru', slug: 'review-paknap-hostel-nan', city: 'nan' },
  { coll: 'reviews', lang: 'ru', slug: 'review-tharaburi-resort-sukhothai', city: 'sukhothai' },
  { coll: 'reviews', lang: 'ru', slug: 'review-le-charme-sukhothai-resort-sukhothai', city: 'sukhothai' },
];

const VERDICT = {
  type: 'object',
  additionalProperties: false,
  required: ['file', 'verdict', 'issues'],
  properties: {
    file: { type: 'string' },
    verdict: { type: 'string', enum: ['clean', 'minor', 'broken'] },
    issues: {
      type: 'array',
      items: {
        type: 'object', additionalProperties: false, required: ['field', 'problem', 'severity'],
        properties: {
          field: { type: 'string', description: 'JSON path of the offending field' },
          problem: { type: 'string', description: 'what is wrong (untranslated English / garbled / meaning drift / name-mismatch / broken tag)' },
          severity: { type: 'string', enum: ['minor', 'major'] },
        },
      },
    },
  },
};

function prompt(item) {
  const L = LANGNAME[item.lang];
  const src = `${ROOT}\\astro\\src\\content\\${item.coll}-en\\${item.slug}.json`;
  const tw = `${ROOT}\\astro\\src\\content\\${item.coll}-${item.lang}\\${item.slug}.json`;
  const roundupRef = `${ROOT}\\astro\\src\\content\\roundups-${item.lang}\\top10-hotels-${item.city}.json`;
  return `You are a strict NATIVE ${L} speaker doing QA on a machine-assisted translation for a Thailand travel site. Your job is to REFUTE the claim that this translation is publish-ready — actively hunt for problems. Do not be charitable.

English source:      ${src}
${L} translation:    ${tw}
City roundup (${item.lang}, for hotel-name cross-check): ${roundupRef}

Read all three. Check the ${L} translation for these problems, comparing against the English source:
1. UNTRANSLATED ENGLISH: user-facing prose/labels left in English (brand names Agoda/Booking.com/Trip.com/ThailandAddict and the untranslatable hotel proper-name are allowed to stay Latin; everything else should be ${L}).
2. GARBLED / NON-FLUENT ${L}: text that reads as broken machine output, wrong grammar, or nonsense to a native speaker.
3. MEANING DRIFT: the ${L} says something factually different from the English (wrong number, negated meaning, invented claim).
4. HOTEL-NAME INCONSISTENCY: the hotel's name in this file must match how the SAME hotel is written in the city roundup (${item.lang}). ${item.lang === 'ja' ? 'Japanese uses katakana for hotel names — verify the katakana rendering is the SAME in this file and in the roundup, not two different spellings.' : ''}
5. BROKEN HTML: <strong>/<em>/<br>/<span> tags dropped, mangled, or unbalanced vs the English.

Return a verdict: "clean" (publish-ready), "minor" (small polish issues, still shippable), or "broken" (real errors that must be fixed). List every concrete issue with its JSON field path. Report ONLY genuine problems — if the translation is good, return an empty issues array and verdict "clean". Do NOT invent issues to seem thorough.`;
}

phase('Verify');
const results = await parallel(SAMPLE.map((item) => () =>
  agent(prompt(item), { label: `verify:${item.lang}:${item.slug.replace('review-', '').slice(0, 24)}`, phase: 'Verify', schema: VERDICT })
    .then((v) => ({ ...v, _meta: item }))
));

const clean = results.filter((r) => r && r.verdict === 'clean');
const minor = results.filter((r) => r && r.verdict === 'minor');
const broken = results.filter((r) => r && r.verdict === 'broken');
log(`Verify: ${clean.length} clean · ${minor.length} minor · ${broken.length} broken (of ${SAMPLE.length})`);
return { total: SAMPLE.length, clean: clean.length, minor: minor.length, broken: broken.length, flagged: [...broken, ...minor] };

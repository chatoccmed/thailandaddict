export const meta = {
  name: 'verify-wave1-sample-3',
  description: 'Round-3 adversarial QA after the full fluency-fix pass: re-check the previously-BROKEN files (must now be clean) + a fresh spread across langs to confirm broken-rate dropped to ~0 before shipping',
  phases: [{ title: 'Verify3', detail: 'native-reader refuter per file' }],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGNAME = { ru: 'Russian', ko: 'Korean', ja: 'Japanese' };

const SAMPLE = [
  // --- previously BROKEN (rounds 1-2) — must now be clean ---
  { coll: 'reviews', lang: 'ja', slug: 'review-mandarin-oriental-bangkok', city: 'bangkok' },     // meaning drift (river)
  { coll: 'reviews', lang: 'ru', slug: 'review-garrya-tongsai-bay-samui', city: 'samui' },          // grammar (gender)
  { coll: 'reviews', lang: 'ja', slug: 'review-reverie-siam-resort-pai', city: 'pai' },             // 涼season
  { coll: 'reviews', lang: 'ja', slug: 'review-tamarind-guesthouse-ayutthaya', city: 'ayutthaya' }, // parent* + City Island
  { coll: 'roundups', lang: 'ja', slug: 'top10-hotels-hat-yai', city: 'hat-yai' },                  // garble + tax
  { coll: 'roundups', lang: 'ko', slug: 'top10-hotels-phuket', city: 'phuket' },                    // <더 비치>
  { coll: 'reviews', lang: 'ja', slug: 'review-the-float-house-river-kwai-kanchanaburi', city: 'kanchanaburi' },
  { coll: 'reviews', lang: 'ja', slug: 'review-hilton-pattaya', city: 'pattaya' },                  // ロビジタル (fixed earlier)
  // --- fresh spread, not sampled before ---
  { coll: 'reviews', lang: 'ja', slug: 'review-rayavadee-krabi', city: 'krabi' },
  { coll: 'reviews', lang: 'ja', slug: 'review-four-seasons-resort-chiang-mai-chiang-mai', city: 'chiang-mai' },
  { coll: 'reviews', lang: 'ru', slug: 'review-the-surin-phuket', city: 'phuket' },
  { coll: 'reviews', lang: 'ru', slug: 'review-mandarin-oriental-bangkok', city: 'bangkok' },
  { coll: 'reviews', lang: 'ko', slug: 'review-sri-panwa-phuket', city: 'phuket' },
  { coll: 'reviews', lang: 'ko', slug: 'review-mandarin-oriental-bangkok', city: 'bangkok' },
  { coll: 'reviews', lang: 'ja', slug: 'review-le-vimarn-cottages-spa-rayong', city: 'rayong' },    // had 海view + のOレ
  { coll: 'reviews', lang: 'ja', slug: 'review-u-inchantree-kanchanaburi', city: 'kanchanaburi' },  // U独 (legit?)
  { coll: 'roundups', lang: 'ru', slug: 'top10-hotels-chiang-mai', city: 'chiang-mai' },
  { coll: 'roundups', lang: 'ja', slug: 'top10-hotels-krabi', city: 'krabi' },
  { coll: 'reviews', lang: 'ko', slug: 'review-anantara-golden-triangle-elephant-camp-resort-chiang-rai', city: 'chiang-rai' },
  { coll: 'reviews', lang: 'ru', slug: 'review-santhiya-koh-yao-yai-phang-nga', city: 'phang-nga' },
];

const VERDICT = {
  type: 'object', additionalProperties: false, required: ['file', 'verdict', 'issues'],
  properties: {
    file: { type: 'string' }, verdict: { type: 'string', enum: ['clean', 'minor', 'broken'] },
    issues: { type: 'array', items: { type: 'object', additionalProperties: false, required: ['field', 'problem', 'severity'],
      properties: { field: { type: 'string' }, problem: { type: 'string' }, severity: { type: 'string', enum: ['minor', 'major'] } } } },
  },
};

function prompt(item) {
  const L = LANGNAME[item.lang];
  const src = `${ROOT}\\astro\\src\\content\\${item.coll}-en\\${item.slug}.json`;
  const tw = `${ROOT}\\astro\\src\\content\\${item.coll}-${item.lang}\\${item.slug}.json`;
  const roundupRef = `${ROOT}\\astro\\src\\content\\roundups-${item.lang}\\top10-hotels-${item.city}.json`;
  return `You are a strict NATIVE ${L} speaker doing final QA on a machine-translated Thailand travel page. REFUTE that it is publish-ready — hunt for problems, do not be charitable.

English source:   ${src}
${L} translation: ${tw}
City roundup (${item.lang}): ${roundupRef}

Check the ${L} file for: (1) UNTRANSLATED ENGLISH in user-facing prose (brand names + the hotel proper name may stay Latin); (2) GARBLED/hallucinated tokens or broken words; (3) MEANING DRIFT vs the English (overstatement, negation, invented facts/numbers/tax claims); (4) HOTEL-NAME INCONSISTENCY vs the roundup; (5) GRAMMAR errors; (6) BROKEN HTML.

Return verdict "clean" / "minor" (shippable) / "broken" (must-fix), with each concrete issue + JSON field path. Report ONLY genuine defects; if good, return empty issues and "clean". Do NOT invent issues, and do NOT flag legitimate room-type names (e.g. "Studio S", "Superior B"), villa-zone labels (e.g. "Villa Zone A"), or brand names (Ibis, eforea, U Hotels) as errors.`;
}

phase('Verify3');
const results = await parallel(SAMPLE.map((item) => () =>
  agent(prompt(item), { label: `v3:${item.lang}:${item.slug.replace('review-', '').replace('top10-hotels-', 'r-').slice(0, 20)}`, phase: 'Verify3', schema: VERDICT })
    .then((v) => ({ ...v, _meta: item }))));
const clean = results.filter(r => r && r.verdict === 'clean');
const minor = results.filter(r => r && r.verdict === 'minor');
const broken = results.filter(r => r && r.verdict === 'broken');
log(`Verify3: ${clean.length} clean · ${minor.length} minor · ${broken.length} broken (of ${SAMPLE.length})`);
return { total: SAMPLE.length, clean: clean.length, minor: minor.length, broken: broken.length,
  flagged: [...broken, ...minor].map(r => ({ file: r.file, verdict: r.verdict, issues: r.issues })) };

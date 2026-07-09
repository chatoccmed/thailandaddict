export const meta = {
  name: 'verify-wave1-sample-2',
  description: 'Second adversarial native-reader QA pass on a FRESH sample — weighted to the 268 re-translated schemaDesc fields + ko (never fluency-checked) + the 5 previously-fixed files, to confirm broken-rate ~0 before shipping',
  phases: [{ title: 'Verify2', detail: 'one native-reader-refuter per file' }],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGNAME = { ru: 'Russian', ko: 'Korean', ja: 'Japanese' };

const SAMPLE = [
  // --- re-check the 5 files we just fixed (must now be clean) ---
  { coll: 'reviews', lang: 'ja', slug: 'review-hilton-pattaya', city: 'pattaya' },
  { coll: 'reviews', lang: 'ja', slug: 'review-aiyapura-koh-chang', city: 'koh-chang' },
  { coll: 'reviews', lang: 'ja', slug: 'review-reverie-siam-resort-pai', city: 'pai' },
  { coll: 'reviews', lang: 'ja', slug: 'review-intercontinental-khao-yai-resort-nakhon-ratchasima', city: 'nakhon-ratchasima' },
  { coll: 'reviews', lang: 'ja', slug: 'review-the-float-house-river-kwai-kanchanaburi', city: 'kanchanaburi' },
  // --- ja: fresh files whose schemaDesc was just re-translated (quality of the mass fix) ---
  { coll: 'reviews', lang: 'ja', slug: 'review-mandarin-oriental-bangkok', city: 'bangkok' },
  { coll: 'reviews', lang: 'ja', slug: 'review-the-peninsula-bangkok', city: 'bangkok' },
  { coll: 'reviews', lang: 'ja', slug: 'review-jw-marriott-khao-lak-phang-nga', city: 'phang-nga' },
  { coll: 'reviews', lang: 'ja', slug: 'review-somerset-pattaya', city: 'pattaya' },
  { coll: 'reviews', lang: 'ja', slug: 'review-tamarind-guesthouse-ayutthaya', city: 'ayutthaya' },
  // --- ja: fresh files NOT touched by any fix (baseline fluency) ---
  { coll: 'reviews', lang: 'ja', slug: 'review-santhiya-tree-koh-chang-resort-trat', city: 'trat' },
  { coll: 'reviews', lang: 'ja', slug: 'review-panviman-resort-koh-phangan', city: 'koh-phangan' },
  { coll: 'roundups', lang: 'ja', slug: 'top10-hotels-hat-yai', city: 'hat-yai' },
  // --- ko: never fluency-checked before; schemaDesc just re-translated ---
  { coll: 'reviews', lang: 'ko', slug: 'review-mandarin-oriental-bangkok', city: 'bangkok' },
  { coll: 'reviews', lang: 'ko', slug: 'review-emerald-cove-koh-chang', city: 'koh-chang' },
  { coll: 'reviews', lang: 'ko', slug: 'review-movenpick-asara-huahin', city: 'huahin' },
  { coll: 'roundups', lang: 'ko', slug: 'top10-hotels-phuket', city: 'phuket' },
  // --- ru: schemaDesc just re-translated ---
  { coll: 'reviews', lang: 'ru', slug: 'review-garrya-tongsai-bay-samui', city: 'samui' },
  { coll: 'reviews', lang: 'ru', slug: 'review-casa-de-la-flora-phang-nga', city: 'phang-nga' },
  { coll: 'roundups', lang: 'ru', slug: 'top10-hotels-chiang-mai', city: 'chiang-mai' },
];

const VERDICT = {
  type: 'object', additionalProperties: false, required: ['file', 'verdict', 'issues'],
  properties: {
    file: { type: 'string' },
    verdict: { type: 'string', enum: ['clean', 'minor', 'broken'] },
    issues: { type: 'array', items: {
      type: 'object', additionalProperties: false, required: ['field', 'problem', 'severity'],
      properties: { field: { type: 'string' }, problem: { type: 'string' }, severity: { type: 'string', enum: ['minor', 'major'] } },
    } },
  },
};

function prompt(item) {
  const L = LANGNAME[item.lang];
  const src = `${ROOT}\\astro\\src\\content\\${item.coll}-en\\${item.slug}.json`;
  const tw = `${ROOT}\\astro\\src\\content\\${item.coll}-${item.lang}\\${item.slug}.json`;
  const roundupRef = `${ROOT}\\astro\\src\\content\\roundups-${item.lang}\\top10-hotels-${item.city}.json`;
  return `You are a strict NATIVE ${L} speaker doing QA on a machine-assisted translation for a Thailand travel site. REFUTE the claim that it is publish-ready — actively hunt for problems, do not be charitable.

English source:   ${src}
${L} translation: ${tw}
City roundup (${item.lang}, for hotel-name cross-check): ${roundupRef}

Read all three and check the ${L} file for: (1) UNTRANSLATED ENGLISH in user-facing prose/labels (brand names + the hotel proper name may stay Latin) — PAY SPECIAL ATTENTION to the "schemaDesc" field, which was recently machine-fixed; (2) GARBLED / non-fluent ${L} (hallucinated tokens, broken grammar); (3) MEANING DRIFT vs the English (wrong number, negation, invented claim); (4) HOTEL-NAME INCONSISTENCY vs the roundup${item.lang === 'ja' ? ' (verify katakana matches the roundup exactly)' : ''}; (5) BROKEN HTML tags.

Return verdict "clean" (publish-ready), "minor" (small polish, still shippable), or "broken" (real errors that must be fixed), with every concrete issue and its JSON field path. Report ONLY genuine problems; if good, return empty issues and "clean". Do NOT invent issues.`;
}

phase('Verify2');
const results = await parallel(SAMPLE.map((item) => () =>
  agent(prompt(item), { label: `v2:${item.lang}:${item.slug.replace('review-', '').slice(0, 22)}`, phase: 'Verify2', schema: VERDICT })
    .then((v) => ({ ...v, _meta: item }))
));
const clean = results.filter((r) => r && r.verdict === 'clean');
const minor = results.filter((r) => r && r.verdict === 'minor');
const broken = results.filter((r) => r && r.verdict === 'broken');
log(`Verify2: ${clean.length} clean · ${minor.length} minor · ${broken.length} broken (of ${SAMPLE.length})`);
return { total: SAMPLE.length, clean: clean.length, minor: minor.length, broken: broken.length, flagged: [...broken, ...minor].map(r => ({ file: r.file, verdict: r.verdict, issues: r.issues })) };

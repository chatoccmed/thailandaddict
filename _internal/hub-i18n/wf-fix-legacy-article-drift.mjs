export const meta = {
  name: 'fix-legacy-article-drift',
  description: 'Restore a dropped related link and lost <strong> pairs in the 12 pre-existing ja/hi/he/ar articles',
  phases: [{ title: 'Repair' }],
};

/* validate-article-twin found eight structural drifts, all in articles that
   were translated before this session:
     · first-time-thailand.json in ja, hi, he and ar all dropped the SAME first
       related link (where-to-go-thailand) — six entries where English has seven
     · four files lost a <strong> pair out of a sentence, so a phrase the
       English emphasises reads flat
   Small, real, and cheap to put right. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

const JOBS = {
  ja: ['first-time-thailand.json', 'thailand-3-week-itinerary.json'],
  hi: ['first-time-thailand.json'],
  he: ['first-time-thailand.json', 'thailand-2-week-itinerary.json', 'thailand-7-day-itinerary.json'],
  ar: ['first-time-thailand.json', 'thailand-7-day-itinerary.json'],
};

const LANG = {
  ja: 'Japanese', hi: 'Hindi', he: 'Hebrew', ar: 'Arabic',
};

function prompt(lang, files) {
  return `Repair ${files.length} translated article file(s) in **${LANG[lang]} (${lang})** for thailandaddict.com.

For EACH file below, read the English source and the translation, then fix ONLY the
structural drift named. Change nothing else — every other value keeps its current
wording exactly.

${files.map((f) => `  · source:      ${ROOT}\\astro\\src\\content\\articles-en\\${f}
    translation: ${ROOT}\\astro\\src\\content\\articles-${lang}\\${f}`).join('\n')}

WHAT TO FIX
1. If "related" has fewer entries than the English source, restore the missing
   one(s) at the SAME index as in English, with href copied exactly and the
   title translated into ${LANG[lang]} in the same style as the sibling titles
   already in the file (keep the leading emoji).
2. If any string value has fewer <strong> tags than its English counterpart,
   restore the emphasis: put <strong>…</strong> around the phrase in the
   translation that corresponds to the emphasised phrase in English. Do not add
   emphasis English does not have, and do not reword the sentence.

Compare the two files field by field to find them — do not guess which value is
wrong. You personally do this with Read + Edit. Do NOT spawn sub-agents.

The result must be valid JSON with the same key set as the English source.
Return one line: {"lang":"${lang}","files":${files.length}}.`;
}

phase('Repair');
const out = await parallel(Object.entries(JOBS).map(([lang, files]) => () =>
  agent(prompt(lang, files), { label: `repair:${lang}`, phase: 'Repair', effort: 'high' })
    .then(() => ({ lang, ok: true })).catch((e) => ({ lang, ok: false, err: String(e).slice(0, 120) }))
));
return { ok: out.filter((r) => r && r.ok).length, of: Object.keys(JOBS).length, failed: out.filter((r) => !r || !r.ok) };

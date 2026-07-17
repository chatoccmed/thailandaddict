export const meta = {
  name: 'zh-reviews-translate',
  description: 'Translate missing zh (Simplified Chinese) tourism-city hotel reviews per _internal/zh-twin-spec.md; each agent translates a batch of 3 from the TH source (EN twin = name-spelling reference) and self-validates against validate-zh-twin.mjs until 0-fail',
  phases: [
    { title: 'Translate', detail: 'batch of 3 reviews/agent: translate → validate → fix until gate-clean' },
  ],
};

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';

// EDIT THIS LIST to control the run (pilot = 9; full run = the remaining missing set).
const FILES = [
  "review-shantaa-koh-kood.json",
  "review-shantaa-resort-kohkood-trat.json",
  "review-sindys-hostel-pattaya-chonburi.json",
  "review-sirarun-resort-ban-krut-prachuap-khiri-khan.json",
  "review-slumber-party-surf-khao-lak-phang-nga.json",
];

const BATCH = 3;
function chunk(a, n) { const o = []; for (let i = 0; i < a.length; i += n) o.push(a.slice(i, i + n)); return o; }
const batches = chunk(FILES, BATCH);

const SCHEMA = {
  type: 'object', additionalProperties: false, required: ['files', 'pass', 'fail', 'notes'],
  properties: {
    files: { type: 'array', items: { type: 'string' } },
    pass: { type: 'number' }, fail: { type: 'number' },
    notes: { type: 'string' },
  },
};

function batchPrompt(files) {
  const list = files.map(f => `  ${f}`).join('\n');
  const vargs = files.join(' ');
  return `You translate Thai hotel reviews into Simplified Chinese (mainland-China consumer-travel register) for thailandaddict.com.

STEP 0 — READ THE SPEC FIRST and follow it EXACTLY (it is authoritative on names, byte-identical fields, voice, honesty, JSON validity):
  ${ROOT}\\_internal\\zh-twin-spec.md
Collection = **reviews** (note spec rule B2: in reviews, the \`type\` field is TRANSLATED display text, while \`typeEn\` stays English).

Your batch (${files.length} files):
${list}

For EACH file <f>:
  1. Read TH source:  astro/src/content/reviews/<f>   (the ONLY fact source)
  2. Read EN twin:     astro/src/content/reviews-en/<f>  (name-romanization reference ONLY — never copy its wording/facts; rule C2)
  3. Write ZH twin to: astro/src/content/reviews-zh/<f>  (same filename; 2-space indent + trailing newline; valid UTF-8 JSON, no BOM)
  Never modify the TH source or EN twin. Same keys, same array lengths, byte-identical facts/links/numbers/images/addressLocality (rule B). Zero raw Thai characters anywhere (proper nouns → Latin per rule C, never guessed transliterations; ฿ is allowed).

STEP FINAL — self-validate and fix until clean (bash; run \`export PATH="$HOME/nodejs:$PATH"\` first), from ${ROOT}:
  node _internal/validate-zh-twin.mjs reviews ${vargs}
It flags RAW THAI (with field path), structural drift (MISSING/EXTRA/array-length/must-stay-identical), and "SUSPICIOUSLY LITTLE CHINESE". You are DONE only when it reports 0 fail for your batch. Fix and re-run as needed.

Return the structured report: files, final pass count, final fail count (must be 0), and notes on anything you were genuinely unsure about (e.g. a name with no EN twin that you had to romanize).`;
}

phase('Translate');
const results = await parallel(batches.map(b => () =>
  agent(batchPrompt(b), { label: `zh:${b[0].replace(/^review-/, '').replace(/\.json$/, '').slice(0, 24)}`, phase: 'Translate', schema: SCHEMA, effort: 'high' })
));

const flat = results.filter(Boolean);
const totalPass = flat.reduce((s, r) => s + (r.pass || 0), 0);
const totalFail = flat.reduce((s, r) => s + (r.fail || 0), 0);
log(`zh reviews: ${totalPass} pass · ${totalFail} fail across ${batches.length} batches`);
return { batches: batches.length, totalPass, totalFail, results: flat };

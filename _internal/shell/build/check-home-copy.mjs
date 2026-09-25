/* Gate for _internal/shell/build/home-copy/<loc>.json.

   en.json is the contract. Every other locale must carry the same key set, the
   same shapes, and every {p} {n} {d} placeholder its English counterpart has —
   a dropped placeholder silently renders "Where to stay in " with nothing after
   it, on the site's most-visited page, in a language nobody on the team reads.

   Also refuses English or Thai left behind in a translated value, because a
   half-translated homepage is the exact outcome the seven locales were frozen
   to avoid.

   Read-only. Usage: node _internal/shell/build/check-home-copy.mjs
   Exit 13 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname, 'home-copy');
const EN = JSON.parse(fs.readFileSync(path.join(DIR, 'en.json'), 'utf8'));
const LOCALES = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));

/* Values that are the same in every language by design. */
const VERBATIM = new Set(['newsPh']);
/* Names that stay Latin in every language, and the few technical terms with no
   translation anywhere — "noindex" is a robots directive, BTS and MRT are
   Bangkok's transit lines, and the last three are the proper names of an award,
   a Michelin category and our own annual guide.

   Whole PHRASES, never their parts: allowing a bare "Best" or "Thailand" would
   let "Best beaches in Thailand" through as if it were translated. */
const BRANDS = /\b(Thailandaddict|ThailandAddict|Agoda|Booking\.com|Booking|Trip\.com|Trip|Google|IHG|Michelin|Wi-?Fi|PM2\.5|SHA|noindex|nofollow|AI|BTS|MRT|ARL|SRT|km|kg|USD|THB|Asia's 50 Best|Best of Thailand 2026|Bib Gourmand)\b/g;
/* Locales the Latin-leak check applies to. Thai is the SOURCE language and
   carries English brand words on purpose; English is the contract. */
const NON_LATIN = new Set(['zh', 'ko', 'ja', 'hi', 'he', 'ar']);

/* footTag is the brand line above the footer, and the footer immediately below
   it on the same page is rendered from ui.<loc>.json::footer.tagline. The rule
   is not "translate it" — it is "say the same thing the footer says", because
   two different taglines a few pixels apart is worse than an untranslated one.
   Three locales (ja, ko, hi) still have an English tagline in ui.*.json; that
   is a site-wide gap, not a defect in this file. */
function checkFootTag(loc, value) {
  let tagline = '';
  try {
    tagline = (JSON.parse(fs.readFileSync(
      path.resolve(import.meta.dirname, '../../../astro/src/i18n/ui.' + loc + '.json'), 'utf8')).footer || {}).tagline || '';
  } catch { return; }
  if (!tagline) return;
  const want = 'Thailandaddict — ' + tagline;
  if (value !== want) add(loc, `footTag does not match ui.${loc}.json footer.tagline\n      is:   ${value}\n      want: ${want}`);
  else if (/^[\x00-\x7F]+$/.test(tagline) && NON_LATIN.has(loc)) {
    warns.push(`${loc}: tagline is still English site-wide (ui.${loc}.json footer.tagline) — matches the footer, so consistent, but untranslated`);
  }
}

const fails = [];
const warns = [];
const add = (loc, msg) => fails.push(loc + ': ' + msg);

/* walk the contract and a candidate in lockstep */
function walk(loc, enV, v, keyPath) {
  const where = keyPath.join('.');
  if (Array.isArray(enV)) {
    if (!Array.isArray(v)) return add(loc, where + ' should be an array');
    if (v.length !== enV.length) return add(loc, `${where} has ${v.length} items, en has ${enV.length}`);
    enV.forEach((e, i) => walk(loc, e, v[i], [...keyPath, i]));
    return;
  }
  if (enV && typeof enV === 'object') {
    if (!v || typeof v !== 'object') return add(loc, where + ' should be an object');
    const ek = Object.keys(enV).sort().join(), vk = Object.keys(v).sort().join();
    if (ek !== vk) return add(loc, `${where} keys differ — en [${ek}] vs [${vk}]`);
    for (const k of Object.keys(enV)) walk(loc, enV[k], v[k], [...keyPath, k]);
    return;
  }
  if (typeof enV !== 'string') return;
  if (typeof v !== 'string') return add(loc, where + ' should be a string');

  /* placeholders are code. Two syntaxes: {p} in the server-rendered strings,
     %n in the runtime block the browser fills in. A dropped %n renders
     "stops · guide times –" with the numbers missing, on the one part of the
     page that does the actual work. */
  const ph = (s) => (String(s).match(/\{\w+\}|%[a-z]/g) || []).sort().join(',');
  if (ph(enV) !== ph(v)) add(loc, `${where} placeholders differ — en "${ph(enV) || 'none'}" vs "${ph(v) || 'none'}"  [${v.slice(0, 60)}]`);

  /* emoji and arrows are layout */
  const glyphs = (s) => (String(s).match(/[→←🔖＋⚠️✅🔆🌧️]/gu) || []).join('');
  if (glyphs(enV) !== glyphs(v)) warns.push(`${loc}: ${where} glyphs differ — en "${glyphs(enV)}" vs "${glyphs(v)}"`);

  if (loc === 'en' || VERBATIM.has(keyPath[0]) || keyPath[0] === 'footTag') return;

  /* digits are facts */
  const nums = (s) => (String(s).match(/\d+/g) || []).join(',');
  if (nums(enV) !== nums(v)) warns.push(`${loc}: ${where} numbers differ — en "${nums(enV)}" vs "${nums(v)}"`);

  if (!NON_LATIN.has(loc)) return;
  /* English left behind */
  const stripped = v.replace(BRANDS, '').replace(/\{\w+\}/g, '').replace(/https?:\/\/\S+/g, '');
  const latin = stripped.match(/[A-Za-z]{3,}/g);
  if (latin && latin.length) add(loc, `${where} still has Latin words [${[...new Set(latin)].slice(0, 6).join(', ')}]  "${v.slice(0, 70)}"`);
  /* Thai left behind in a non-Thai locale */
  if (loc !== 'th' && /[฀-๿]/.test(v)) add(loc, `${where} contains Thai script  "${v.slice(0, 60)}"`);
}

console.log('contract: en.json, ' + Object.keys(EN).length + ' keys');
for (const loc of LOCALES) {
  const v = JSON.parse(fs.readFileSync(path.join(DIR, loc + '.json'), 'utf8'));
  const missing = Object.keys(EN).filter((k) => !(k in v));
  const extra = Object.keys(v).filter((k) => !(k in EN));
  if (missing.length) add(loc, 'missing keys: ' + missing.join(', '));
  if (extra.length) add(loc, 'unexpected keys: ' + extra.join(', '));
  for (const k of Object.keys(EN)) if (k in v) walk(loc, EN[k], v[k], [k]);
  if (typeof v.footTag === 'string') checkFootTag(loc, v.footTag);
  const mine = fails.filter((f) => f.startsWith(loc + ':')).length;
  console.log('  ' + loc.padEnd(3) + Object.keys(v).length + ' keys · ' + (mine ? mine + ' FAILURES' : 'ok'));
}

if (warns.length) {
  console.log('\nwarnings (' + warns.length + ') — check these by eye:');
  for (const w of warns.slice(0, 25)) console.log('  ! ' + w);
  if (warns.length > 25) console.log('  … and ' + (warns.length - 25) + ' more');
}
if (fails.length) {
  console.error('\n' + fails.length + ' FAILURES');
  for (const f of fails.slice(0, 40)) console.error('  ✗ ' + f);
  if (fails.length > 40) console.error('  … and ' + (fails.length - 40) + ' more');
  process.exit(13);
}
console.log('\nall ' + LOCALES.length + ' copy tables pass');

/* Validate and merge the translated accepted-debt strings into the hub
   dictionaries.

   The 46 strings are chrome: tab labels, filter chips, card headings, buttons.
   What breaks them is not bad prose, it is lost markup — a dropped </em> turns
   the rest of the page italic, a dropped → leaves a button pointing nowhere, a
   dropped emoji shifts a row, and a changed ฿ figure is a changed fact. All of
   that is mechanical, so a script checks it rather than a reviewer.

   Refuses to merge anything until every file passes. Usage:
     node _internal/qa/merge-hub-debt.mjs [--apply]
   Read-only without --apply; exit 1 on any failure. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DICT = path.join(ROOT, '_internal/hub-i18n');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const APPLY = process.argv.includes('--apply');

const baseline = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/qa/i18n-untranslated-baseline.json'), 'utf8'));
/* Two batches, two staging prefixes, same checks. --templated validates the
   interpolated strings, whose keys are the ${...} TEMPLATE: gen-hubs evaluates
   the template, tx() rebuilds the token form from DYN to look it up, then puts
   the real value back. So a dropped token does not fall back to English — it
   renders "Where should I stay in ?" with the name simply gone. */
const TEMPLATED = process.argv.includes('--templated');
const STAGE = TEMPLATED ? '_tmpl-' : '_debt-';
/* The plain batch is defined by the baseline. For the templated batch the set
   is whatever the staging files carry, with every key checked back against the
   baseline's templated strings — so a key nobody asked for cannot sneak in,
   and this script needs no path into anyone's scratch directory. */
const BASE_TEMPLATED = baseline.keys.filter((k) => k.includes('${'));
let PLAIN = baseline.keys.filter((k) => !k.includes('${'));
if (TEMPLATED) {
  const first = LANGS.map((l) => path.join(DICT, STAGE + l + '.json')).find((p) => fs.existsSync(p));
  PLAIN = first ? Object.keys(JSON.parse(fs.readFileSync(first, 'utf8'))) : [];
  const unknown = PLAIN.filter((k) => !BASE_TEMPLATED.includes(k));
  if (unknown.length) {
    console.error(`${unknown.length} key(s) are not templated debt strings — refusing:`);
    unknown.slice(0, 5).forEach((k) => console.error('  ' + JSON.stringify(k.slice(0, 60))));
    process.exit(1);
  }
}
const tokens = (s) => (String(s).match(/\$\{[^}]+\}/g) || []).sort();

/* what must survive a translation, and why it matters on the page */
const tags = (s) => (String(s).match(/<\/?[a-z][a-z0-9]*/gi) || []).map((t) => t.toLowerCase()).sort().join(',');
const glyphset = (s) => (String(s).match(/[→←✅📅🎟️🏨฿]/gu) || []);
const figures = (s) => (String(s)
  .replace(/(\d)[    ](?=\d{3}(?!\d))/g, '$1')
  .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')
  .match(/\d+/g) || []).map(Number);
/* What is missing from `have` that `want` has. Only losses matter in both
   checks below — a translation ADDING a figure or a separator is normal and an
   earlier version of this file failed ten correct translations for it:
   "per person/day" is 1인당 in Korean and 1人1日あたり in Japanese, "half-day and
   full-day" is 半日・1日, and Korean separates with a · the English does not
   have. None of that is a defect; demanding it be absent is. */
const lost = (want, have) => {
  const pool = [...have];
  return want.filter((v) => { const i = pool.indexOf(v); if (i < 0) return true; pool.splice(i, 1); return false; });
};
const warns = [];
/* Latin left behind. Brands and the few technical terms are allowed; whole
   phrases only, never a bare word that would wave real English through. */
/* "Top 10" is a fixed label on this site and the agents were told to keep the
   figure, so it is not a leak. Whole phrases only — a bare "Top" would wave
   real English through. */
const BRANDS = /\b(ThailandAddict|Thailandaddict|Google Maps|Google|Klook|Agoda|Booking\.com|Booking|Trip\.com|Trip|Michelin|PM2\.5|RANKED|BTS|MRT)\b|TOP\s?10|Top\s?10/g;
const NON_LATIN = new Set(['zh', 'ko', 'ja', 'hi', 'he', 'ar']);

const fails = [];
const loaded = {};

for (const lang of LANGS) {
  const p = path.join(DICT, STAGE + lang + '.json');
  if (!fs.existsSync(p)) { fails.push(`${lang}: ${STAGE}${lang}.json is missing`); continue; }
  let j;
  try { j = JSON.parse(fs.readFileSync(p, 'utf8')); }
  catch (e) { fails.push(`${lang}: does not parse — ${String(e.message).slice(0, 70)}`); continue; }

  const missing = PLAIN.filter((k) => typeof j[k] !== 'string' || !j[k].trim());
  const extra = Object.keys(j).filter((k) => !PLAIN.includes(k));
  if (missing.length) fails.push(`${lang}: ${missing.length} string(s) missing or empty — e.g. ${JSON.stringify(missing[0].slice(0, 50))}`);
  if (extra.length) fails.push(`${lang}: ${extra.length} key(s) not in the list — e.g. ${JSON.stringify(extra[0].slice(0, 50))}`);

  for (const en of PLAIN) {
    const tr = j[en];
    if (typeof tr !== 'string' || !tr.trim()) continue;
    const at = `${lang} ${JSON.stringify(en.slice(0, 44))}`;
    if (tags(en) !== tags(tr)) fails.push(`${at} markup changed — "${tags(en)}" -> "${tags(tr)}"`);
    /* A lost token does NOT fall back to English — the value is simply gone,
       and the page reads "Where should I stay in ?" */
    if (tokens(en).join() !== tokens(tr).join()) fails.push(`${at} TOKENS changed — ${JSON.stringify(tokens(en))} -> ${JSON.stringify(tokens(tr))}`);
    const lostGlyphs = lost(glyphset(en), glyphset(tr));
    if (lostGlyphs.length) fails.push(`${at} dropped ${lostGlyphs.join('')} — "${tr.slice(0, 50)}"`);
    /* A price or a year must survive. A small count may become a word — zh
       writes 三家平台 for "3 sites" — so that is a warning, not a failure. */
    const lostFigs = lost(figures(en), figures(tr));
    const hard = lostFigs.filter((n) => n >= 32);
    if (hard.length) fails.push(`${at} lost figure(s) ${hard.join(', ')} — "${tr.slice(0, 50)}"`);
    else if (lostFigs.length) warns.push(`${at} figure ${lostFigs.join(', ')} is not in the translation — a word? "${tr.slice(0, 44)}"`);
    if (tr === en && /[A-Za-z]{4}/.test(en.replace(BRANDS, ''))) fails.push(`${at} was not translated at all`);
    if (NON_LATIN.has(lang)) {
      /* Strip the ${...} tokens FIRST. Their insides — cStay, dayRec, nm —
         are variable names and must stay Latin; an earlier version of this
         check failed 12 correct translations for "leaking" them. */
      const left = tr.replace(/\$\{[^}]+\}/g, ' ').replace(/<[^>]+>/g, ' ').replace(BRANDS, ' ').match(/[A-Za-z]{3,}/g);
      if (left) fails.push(`${at} still has Latin words [${[...new Set(left)].slice(0, 5).join(', ')}] — "${tr.slice(0, 54)}"`);
    }
    if (/[฀-฾เ-๿]/.test(tr)) fails.push(`${at} contains Thai script — "${tr.slice(0, 50)}"`);
  }
  loaded[lang] = j;
  const mine = fails.filter((f) => f.startsWith(lang + ':') || f.startsWith(lang + ' ')).length;
  console.log('  ' + lang.padEnd(3) + Object.keys(j).length + ' strings · ' + (mine ? mine + ' FAILURES' : 'ok'));
}

if (fails.length) {
  console.error('\n' + fails.length + ' FAILURE(S) — nothing merged:');
  for (const f of fails.slice(0, 30)) console.error('  ✗ ' + f);
  if (fails.length > 30) console.error('  … and ' + (fails.length - 30) + ' more');
  process.exit(1);
}

if (warns.length) {
  console.log('\n' + warns.length + ' warning(s) — a figure the translation says in words, or a drift nobody caught:');
  for (const w of warns.slice(0, 15)) console.log('  ! ' + w);
  if (warns.length > 15) console.log('  … and ' + (warns.length - 15) + ' more');
}
console.log('\nall ' + LANGS.length + ' files pass · ' + PLAIN.length + ' strings each');
if (!APPLY) { console.log('(dry run — pass --apply to merge into the dictionaries)'); process.exit(0); }

for (const lang of LANGS) {
  const p = path.join(DICT, lang + '.json');
  const dict = JSON.parse(fs.readFileSync(p, 'utf8'));
  let added = 0;
  for (const [en, tr] of Object.entries(loaded[lang])) { if (dict[en] === undefined) added++; dict[en] = tr; }
  const out = JSON.stringify(dict, null, 2) + '\n';
  fs.writeFileSync(p + '.tmp', out, 'utf8');
  if (fs.readFileSync(p + '.tmp', 'utf8') !== out) { console.error('readback mismatch: ' + p); process.exit(1); }
  fs.renameSync(p + '.tmp', p);
  fs.unlinkSync(path.join(DICT, STAGE + lang + '.json'));
  console.log('  ' + lang.padEnd(3) + Object.keys(dict).length + ' keys (+' + added + ')');
}
console.log('\nmerged · the staging files are removed, the dictionaries are the record');

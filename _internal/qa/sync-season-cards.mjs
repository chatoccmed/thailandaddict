/* The hub layer has two engines and they drift apart silently, in both
   directions.

   gen-hubs.mjs builds the main tourist-city hubs in all nine languages from
   _internal/hub-i18n/<lang>.json. Every other hub is a snapshot localize.mjs
   wrote once by walking the English DOM and substituting from
   _internal/i18n/tm.<lang>.json. Two maps, same job, neither aware of the
   other — so the season block ended up English on both sides for different
   reasons:

     · the snapshots are frozen. When this morning's honesty fix reworded the
       Gulf season cards and added the monsoon closure warning — the notice
       telling a reader their island stay may be shut for the season and the
       boats may not run — the translations went into the hub dictionary, and
       the eight Gulf-province snapshots kept the English they were frozen
       with. Nothing failed; the build does not regenerate those pages.
     · the generated pages were never translated at all. The DEFAULT season
       card ("Cool & dry", "Best season — cool and clear") is in the
       translation memory and has been for months, but not in the hub
       dictionary, so gen-hubs printed English onto 34 city hubs per locale
       and the gate recorded it as accepted debt.

   Each map holds what the other is missing. This unions them over the season
   block only — a blanket pass over 22,000 keys would eat brand names and
   urls — and then rewrites the season cells of the pages already on disk, so
   the snapshots are right now and the generated pages are right after the
   next build.

   Usage: node _internal/qa/sync-season-cards.mjs [--apply]
   Read-only without --apply; exit 1 while any season cell is still English. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const APPLY = process.argv.includes('--apply');

/* The season block, exactly as gen-hubs prints it. In seas-mo the months come
   after an emoji, so the emoji is captured apart and put back untouched. */
const CARD = /(<div class="seas-mo">(?:[^<\s]*\s)?)([^<]*)(<\/div><div class="seas-nm">)([^<]*)(<\/div><p>)([^<]*)(<\/p>)/g;
const WARN = /(<div class="seas-warn">⚠️ )([^<]*)(<\/div>)/g;
const cellsOf = (t) => [...t.matchAll(CARD)].flatMap((m) => [m[2], m[4], m[6]])
  .concat([...t.matchAll(WARN)].map((m) => m[2]));

/* The English vocabulary of the block, taken from the English pages — the one
   place every literal gen-hubs can print actually appears. */
const EN_DIR = path.join(ROOT, 'astro/public/en');
const VOCAB = new Set();
for (const f of fs.readdirSync(EN_DIR).filter((x) => x.endsWith('.html'))) {
  for (const v of cellsOf(fs.readFileSync(path.join(EN_DIR, f), 'utf8'))) if (v.trim()) VOCAB.add(v);
}
console.log(`season vocabulary: ${VOCAB.size} English strings on the English hubs\n`);

const save = (p, text) => {
  fs.writeFileSync(p + '.tmp', text, 'utf8');
  if (fs.readFileSync(p + '.tmp', 'utf8') !== text) { console.error('readback mismatch: ' + p); process.exit(1); }
  fs.renameSync(p + '.tmp', p);
};

let totalLeft = 0, totalCells = 0, totalFiles = 0;
const untranslated = new Map();

for (const lang of LANGS) {
  const dictPath = path.join(ROOT, '_internal/hub-i18n', lang + '.json');
  const tmPath = path.join(ROOT, '_internal/i18n', 'tm.' + lang + '.json');
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  const tm = JSON.parse(fs.readFileSync(tmPath, 'utf8'));

  /* union, season strings only — whichever map has it teaches the other */
  let toDict = 0, toTm = 0;
  for (const en of VOCAB) {
    const tr = dict[en] !== undefined ? dict[en] : tm[en];
    if (tr === undefined) { (untranslated.get(en) || untranslated.set(en, []).get(en)).push(lang); continue; }
    if (dict[en] === undefined) { dict[en] = tr; toDict++; }
    if (tm[en] === undefined) { tm[en] = tr; toTm++; }
  }
  if (APPLY) {
    if (toDict) save(dictPath, JSON.stringify(dict, null, 2) + '\n');
    if (toTm) save(tmPath, JSON.stringify(tm, null, 2) + '\n');
  }

  /* and rewrite what is already on disk */
  const dir = path.join(ROOT, 'astro/public', lang);
  let files = 0, cells = 0, left = 0;
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.html'))) {
    const p = path.join(dir, f);
    const src = fs.readFileSync(p, 'utf8');
    if (!src.includes('seas-mo') && !src.includes('seas-warn')) continue;
    let fixed = 0;
    const sub = (v) => {
      if (!VOCAB.has(v)) return v;                 /* already translated, or not ours */
      if (dict[v] === undefined) { left++; return v; }
      fixed++; return dict[v];
    };
    const out = src
      .replace(CARD, (_m, a, mo, b, nm, c, blurb, d) => a + sub(mo) + b + sub(nm) + c + sub(blurb) + d)
      .replace(WARN, (_m, a, text, b) => a + sub(text) + b);
    if (!fixed) continue;
    files++; cells += fixed;
    if (APPLY) save(p, out);
  }
  totalFiles += files; totalCells += cells; totalLeft += left;
  console.log(`  ${lang}  dictionary +${toDict} · memory +${toTm} · ${cells} English cell(s) on ${files} page(s)`
    + (left ? ` · ${left} with no translation anywhere` : ''));
}

console.log(`\n${totalCells} cell(s) across ${totalFiles} file(s) `
  + (APPLY ? 'rewritten' : 'would be rewritten (dry run — pass --apply)'));
if (untranslated.size) {
  console.log(`\n${untranslated.size} season string(s) have no translation in either map — add them to _internal/hub-i18n/<lang>.json:`);
  for (const [en, langs] of [...untranslated].slice(0, 20)) console.log(`  ${JSON.stringify(en.slice(0, 72))}  missing in ${[...new Set(langs)].join(',')}`);
  if (untranslated.size > 20) console.log(`  … and ${untranslated.size - 20} more`);
}
process.exit(!APPLY && totalCells ? 1 : 0);

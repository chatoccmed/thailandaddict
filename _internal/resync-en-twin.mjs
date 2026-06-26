// Deterministic structural re-sync for EN twins. For each EN twin, force every
// NON-TEXT leaf (numbers, booleans, URLs/hrefs/images, dates, and known identical
// keys) to exactly equal the Thai source, add any missing such leaf, and drop any
// EN-only key. Translated TEXT leaves are left untouched. This guarantees fact +
// link integrity regardless of translator drift. Array-length mismatches and broken
// JSON are NOT auto-fixable — they are reported for re-translation.
// Usage: node _internal/resync-en-twin.mjs <file.json> [...]   |   --all
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const THDIR = path.join(ROOT, 'astro/src/content/articles');
const ENDIR = path.join(ROOT, 'astro/src/content/articles-en');

const IDENTICAL_KEYS = new Set([
  'slug', 'type', 'cluster', 'heroImg', 'heroEmoji', 'image', 'publishedDate', 'modifiedDate',
  'crumbCityHref', 'regionHref', 'img', 'igPost', 'fbPage', 'creditHref', 'libCreditHref',
  'heroCreditHref', 'mapHref', 'stayHref', 'src', 'rank', 'lat', 'lng', 'rating', 'ratingCount',
  'englishMenu', 'veg', 'halal', 'href', 'icon', 'id', 'embedUrl', 'videoId', 'libImg',
]);
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/[\w-]/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v));
const isStructuralLeaf = (key, v) => typeof v === 'number' || typeof v === 'boolean' || IDENTICAL_KEYS.has(key) || isUrlish(v);

// returns the re-synced EN node, or throws {arrayMismatch} on an unfixable array-length diff
function sync(th, en, key, report) {
  const tt = Array.isArray(th) ? 'array' : (th === null ? 'null' : typeof th);
  if (tt === 'array') {
    if (!Array.isArray(en) || en.length !== th.length) { report.arr.push(`${key}[] ${Array.isArray(en) ? en.length : 'n/a'}→${th.length}`); return en; }
    return th.map((t, i) => sync(t, en[i], key, report));
  }
  if (tt === 'object') {
    const out = {};
    const enObj = (en && typeof en === 'object' && !Array.isArray(en)) ? en : {};
    for (const k of Object.keys(th)) {
      if (!(k in enObj)) {
        if (isStructuralLeaf(k, th[k]) || typeof th[k] === 'object') { out[k] = th[k]; report.added.push(k); }
        else { out[k] = th[k]; report.addedText.push(k); } // missing TEXT → copy TH (Thai); validator will flag → re-run
      } else {
        out[k] = sync(th[k], enObj[k], k, report);
      }
    }
    for (const k of Object.keys(enObj)) if (!(k in th)) report.dropped.push(k); // EN-only key omitted from out
    return out;
  }
  // leaf
  if (isStructuralLeaf(key, th)) { if (th !== en) report.forced++; return th; }
  return en === undefined ? th : en; // text leaf: keep EN
}

let files = process.argv.slice(2);
if (files[0] === '--all') files = fs.readdirSync(ENDIR).filter(f => f.endsWith('.json') && fs.existsSync(path.join(THDIR, f)));
let changed = 0, needRerun = [];
for (const f of files) {
  const thp = path.join(THDIR, f), enp = path.join(ENDIR, f);
  if (!fs.existsSync(enp)) { needRerun.push(f + ' (no EN file)'); continue; }
  let th, en;
  try { th = JSON.parse(fs.readFileSync(thp, 'utf8')); } catch (e) { console.log('TH parse FAIL ' + f); continue; }
  try { en = JSON.parse(fs.readFileSync(enp, 'utf8')); } catch (e) { needRerun.push(f + ' (EN broken JSON)'); continue; }
  const report = { forced: 0, added: [], addedText: [], dropped: [], arr: [] };
  const out = sync(th, en, '$', report);
  if (report.arr.length) { needRerun.push(`${f} (array mismatch: ${report.arr.join(', ')})`); continue; }
  const before = JSON.stringify(en), after = JSON.stringify(out);
  if (before !== after) { fs.writeFileSync(enp, after); changed++; const bits = []; if (report.forced) bits.push(`${report.forced} forced`); if (report.added.length) bits.push(`+${report.added.length} struct`); if (report.dropped.length) bits.push(`-${report.dropped.length} extra`); if (report.addedText.length) bits.push(`+${report.addedText.length} TEXT(check!)`); console.log(`SYNCED ${f} (${bits.join(', ')})`); }
}
console.log(`\nresynced ${changed} file(s); ${needRerun.length} need re-translation`);
for (const r of needRerun) console.log('   RERUN ' + r);

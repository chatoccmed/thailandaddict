// Deterministic structural re-sync for ZH twins (mirrors resync-en-twin.mjs). For each ZH twin, force
// every NON-TEXT leaf (numbers, booleans, URLs/hrefs/images, dates, and known identical keys — see
// validate-zh-twin.mjs for the collection-aware IDENTICAL_KEYS rationale) to exactly equal the Thai
// source, add any missing such leaf, and drop any ZH-only key. Translated TEXT leaves are left untouched.
// This mechanically fixes the single most common defect class found in the pilot (addressLocality etc.
// drifting from the TH/EN precedent) with zero extra LLM cost. Array-length mismatches and broken JSON
// are NOT auto-fixable — they are reported for re-translation.
// Usage: node _internal/resync-zh-twin.mjs <collection: articles|reviews|roundups> <file.json> [...]   |   --all
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const coll = process.argv[2];
if (!['articles', 'reviews', 'roundups'].includes(coll)) {
  console.error('first arg must be articles|reviews|roundups');
  process.exit(2);
}
const THDIR = path.join(ROOT, `astro/src/content/${coll}`);
const ZHDIR = path.join(ROOT, `astro/src/content/${coll}-zh`);

const IDENTICAL_KEYS = new Set([
  'slug', 'cluster', 'heroImg', 'heroEmoji', 'image', 'publishedDate', 'modifiedDate',
  'crumbCityHref', 'regionHref', 'img', 'igPost', 'fbPage', 'creditHref', 'libCreditHref',
  'heroCreditHref', 'mapHref', 'stayHref', 'src', 'rank', 'lat', 'lng', 'rating', 'ratingCount',
  'englishMenu', 'veg', 'halal', 'href', 'icon', 'id', 'embedUrl', 'videoId', 'libImg',
  'score', 'starRating', 'width', 'addressCountry', 'addressLocality',
  'heroSub1', 'heroSub2', 'heroSub2Href', 'mapImg', 'gallery',
  'agodaUrl', 'bookingUrl', 'tripUrl', 'reviewUrl', 'bookingAgoda', 'bookingBooking', 'bookingTrip',
]);
if (coll === 'articles') IDENTICAL_KEYS.add('type');
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/[\w-]/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v));
const isStructuralLeaf = (key, v) => typeof v === 'number' || typeof v === 'boolean' || IDENTICAL_KEYS.has(key) || isUrlish(v);

function sync(th, zh, key, report) {
  const tt = Array.isArray(th) ? 'array' : (th === null ? 'null' : typeof th);
  if (tt === 'array') {
    if (!Array.isArray(zh) || zh.length !== th.length) { report.arr.push(`${key}[] ${Array.isArray(zh) ? zh.length : 'n/a'}→${th.length}`); return zh; }
    return th.map((t, i) => sync(t, zh[i], key, report));
  }
  if (tt === 'object') {
    const out = {};
    const zhObj = (zh && typeof zh === 'object' && !Array.isArray(zh)) ? zh : {};
    for (const k of Object.keys(th)) {
      if (!(k in zhObj)) {
        if (isStructuralLeaf(k, th[k]) || typeof th[k] === 'object') { out[k] = th[k]; report.added.push(k); }
        else { out[k] = th[k]; report.addedText.push(k); } // missing TEXT → copy TH (Thai); validator will flag → re-run
      } else {
        out[k] = sync(th[k], zhObj[k], k, report);
      }
    }
    for (const k of Object.keys(zhObj)) if (!(k in th)) report.dropped.push(k);
    return out;
  }
  if (isStructuralLeaf(key, th)) { if (th !== zh) report.forced++; return th; }
  return zh === undefined ? th : zh; // text leaf: keep ZH
}

let files = process.argv.slice(3);
if (files[0] === '--all') files = fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json') && fs.existsSync(path.join(THDIR, f)));
let changed = 0, needRerun = [];
for (const f of files) {
  const thp = path.join(THDIR, f), zhp = path.join(ZHDIR, f);
  if (!fs.existsSync(zhp)) { needRerun.push(f + ' (no ZH file)'); continue; }
  let th, zh;
  try { th = JSON.parse(fs.readFileSync(thp, 'utf8')); } catch (e) { console.log('TH parse FAIL ' + f); continue; }
  try { zh = JSON.parse(fs.readFileSync(zhp, 'utf8')); } catch (e) { needRerun.push(f + ' (ZH broken JSON)'); continue; }
  const report = { forced: 0, added: [], addedText: [], dropped: [], arr: [] };
  const out = sync(th, zh, '', report);
  if (report.arr.length) { needRerun.push(`${f} (array mismatch: ${report.arr.join(', ')})`); continue; }
  const before = JSON.stringify(zh), after = JSON.stringify(out);
  if (before !== after) { fs.writeFileSync(zhp, after); changed++; const bits = []; if (report.forced) bits.push(`${report.forced} forced`); if (report.added.length) bits.push(`+${report.added.length} struct`); if (report.dropped.length) bits.push(`-${report.dropped.length} extra`); if (report.addedText.length) bits.push(`+${report.addedText.length} TEXT(check!)`); console.log(`SYNCED ${f} (${bits.join(', ')})`); }
}
console.log(`\nresynced ${changed} file(s); ${needRerun.length} need re-translation`);
for (const r of needRerun) console.log('   RERUN ' + r);

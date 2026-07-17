// Validate a ZH twin against its TH source: structural-field parity + zero raw Thai + real Chinese present.
// Usage: node _internal/validate-zh-twin.mjs <collection: articles|reviews|roundups> <file.json> [file2.json ...]
//    or: node _internal/validate-zh-twin.mjs <collection> --all   (every zh twin that has a TH source)
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
const THAI = /[฀-๿]/;
const HAN = /[一-鿿]/;

// keys whose VALUE must be byte-identical between TH and ZH (facts / structure / links / names — see rule C).
// NOTE: 'type' means different things per collection — in `articles` it's the page-type discriminator
// (food/prep/eat-ranking/...) and MUST stay identical; in `reviews`/`roundups` it's a human-readable
// localized short descriptor (reviewSchema comment: "Thai short type, e.g. โฮสเทล"; roundup entries/rooms
// use it for descriptive text like "Luxury Boutique 5 ดาว") that the EN twin correctly TRANSLATES
// (verified: TH "โฮสเทล"/EN "Hostel"; TH "...70 ตร.ม."/EN "...70 sqm") — so it must NOT be forced identical
// for those two collections, or every correctly-translated file gets flagged as broken.
const IDENTICAL_KEYS = new Set([
  'slug', 'cluster', 'heroImg', 'heroEmoji', 'image', 'publishedDate', 'modifiedDate',
  'crumbCityHref', 'regionHref', 'img', 'igPost', 'fbPage', 'creditHref', 'libCreditHref',
  'heroCreditHref', 'mapHref', 'stayHref', 'src', 'rank', 'lat', 'lng', 'rating', 'ratingCount',
  'englishMenu', 'veg', 'halal', 'href', 'icon', 'id', 'embedUrl', 'videoId', 'libImg',
  'score', 'starRating', 'width', 'addressCountry', 'addressLocality',
  'heroSub1', 'heroSub2', 'heroSub2Href', 'mapImg', 'gallery',
  'agodaUrl', 'bookingUrl', 'tripUrl', 'reviewUrl', 'bookingAgoda', 'bookingBooking', 'bookingTrip',
]);
if (coll === 'articles') IDENTICAL_KEYS.add('type'); // articleSchema.type = page-type discriminator, not display text
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/[\w-]/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v));
const sameUrl = (a, b) => { if (a === b) return true; try { return decodeURIComponent(a) === decodeURIComponent(b); } catch { return false; } };

// deep structural parity: same keys + array lengths; numbers/booleans/links/dates/names byte-identical
function walkKeyed(th, zh, p, key, errs) {
  if (th === null || th === undefined) return;
  const tt = Array.isArray(th) ? 'array' : typeof th;
  const zt = Array.isArray(zh) ? 'array' : typeof zh;
  if (tt !== zt) { errs.push(`${p}: type ${tt}→${zt}`); return; }
  if (tt === 'array') {
    if (th.length !== zh.length) errs.push(`${p}: array length ${th.length}→${zh.length}`);
    for (let i = 0; i < Math.min(th.length, zh.length); i++) walkKeyed(th[i], zh[i], `${p}[${i}]`, key, errs);
    return;
  }
  if (tt === 'object') {
    const tk = Object.keys(th), zk = new Set(Object.keys(zh));
    for (const k of tk) {
      if (!zk.has(k)) { errs.push(`${p}.${k}: MISSING in ZH`); continue; }
      walkKeyed(th[k], zh[k], `${p}.${k}`, k, errs);
    }
    for (const k of Object.keys(zh)) if (!tk.includes(k)) errs.push(`${p}.${k}: EXTRA in ZH`);
    return;
  }
  if (tt === 'number' || tt === 'boolean') { if (th !== zh) errs.push(`${p}: ${tt} ${JSON.stringify(th)}→${JSON.stringify(zh)}`); return; }
  if (tt === 'string') {
    if (IDENTICAL_KEYS.has(key) || isUrlish(th)) { if (!sameUrl(th, zh)) errs.push(`${p}: must stay identical ("${String(th).slice(0, 40)}" → "${String(zh).slice(0, 40)}")`); }
  }
}

function validate(file) {
  const errs = [];
  const thp = path.join(THDIR, file), zhp = path.join(ZHDIR, file);
  if (!fs.existsSync(thp)) return { file, ok: false, errs: ['no TH source'] };
  if (!fs.existsSync(zhp)) return { file, ok: false, errs: ['ZH twin not written'] };
  const zhText = fs.readFileSync(zhp, 'utf8');
  let th, zh;
  try { th = JSON.parse(fs.readFileSync(thp, 'utf8')); } catch (e) { return { file, ok: false, errs: ['TH parse: ' + e.message] }; }
  try { zh = JSON.parse(zhText); } catch (e) { return { file, ok: false, errs: ['ZH parse: ' + e.message] }; }
  // 1) zero raw Thai anywhere in ZH text fields (baht symbol allowed per spec rule F)
  const ALLOWED_TH = /฿/g;
  const thaiHits = [];
  let hanCount = 0;
  (function scan(o, p) {
    if (typeof o === 'string') {
      const stripped = o.replace(ALLOWED_TH, '');
      if (THAI.test(stripped) && !IDENTICAL_KEYS.has(p.split('.').pop())) thaiHits.push(`${p}: "${o.slice(0, 50)}"`);
      if (HAN.test(o)) hanCount++;
    }
    else if (Array.isArray(o)) o.forEach((v, i) => scan(v, `${p}[${i}]`));
    else if (o && typeof o === 'object') for (const k of Object.keys(o)) scan(o[k], `${p}.${k}`);
  })(zh, '$');
  for (const h of thaiHits) errs.push('RAW THAI ' + h);
  // 2) sanity: file should contain a meaningful amount of actual Chinese script (catches "translated" files that are just a TH/EN copy)
  if (hanCount < 5) errs.push(`SUSPICIOUSLY LITTLE CHINESE: only ${hanCount} strings contain Han characters`);
  // 3) structural parity
  walkKeyed(th, zh, '$', '', errs);
  return { file, ok: errs.length === 0, errs };
}

let files = process.argv.slice(3);
if (files[0] === '--all') files = fs.readdirSync(ZHDIR).filter(f => f.endsWith('.json') && fs.existsSync(path.join(THDIR, f)));
let pass = 0, fail = 0;
for (const f of files) {
  const r = validate(f);
  if (r.ok) { pass++; console.log('PASS ' + f); }
  else { fail++; console.log('FAIL ' + f); for (const e of r.errs.slice(0, 12)) console.log('   - ' + e); if (r.errs.length > 12) console.log(`   … +${r.errs.length - 12} more`); }
}
console.log(`\n${pass} pass · ${fail} fail · ${files.length} total`);
process.exit(fail ? 1 : 0);

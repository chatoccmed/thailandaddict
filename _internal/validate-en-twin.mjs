// Validate an EN twin against its TH source: structural-field parity + zero raw Thai.
// Usage: node _internal/validate-en-twin.mjs <file.json> [file2.json ...]
//    or: node _internal/validate-en-twin.mjs --all   (every articles-en twin that has a TH source)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const THDIR = path.join(ROOT, 'astro/src/content/articles');
const ENDIR = path.join(ROOT, 'astro/src/content/articles-en');
const THAI = /[฀-๿]/;

// keys whose VALUE must be byte-identical between TH and EN (facts / structure / links)
const IDENTICAL_KEYS = new Set([
  'slug', 'type', 'cluster', 'heroImg', 'heroEmoji', 'image', 'publishedDate', 'modifiedDate',
  'crumbCityHref', 'regionHref', 'img', 'igPost', 'creditHref', 'heroCreditHref', 'mapHref',
  'stayHref', 'src', 'rank', 'lat', 'lng', 'rating', 'ratingCount', 'englishMenu',
  'href', 'icon', 'id', 'embedUrl', 'videoId',
]);
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/[\w-]/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v));
// URLs sometimes carry a literal Thai filename on the TH side (e.g. Wikimedia Commons File: links from the
// image-splice pipeline) that the EN twin must percent-encode to satisfy the zero-raw-Thai rule — same
// destination, different string. Treat those as identical too.
const sameUrl = (a, b) => { if (a === b) return true; try { return decodeURIComponent(a) === decodeURIComponent(b); } catch { return false; } };

// deep structural parity: same keys + array lengths; numbers/booleans/links/dates byte-identical
function walkKeyed(th, en, p, key, errs) {
  if (th === null || th === undefined) return;
  const tt = Array.isArray(th) ? 'array' : typeof th;
  const et = Array.isArray(en) ? 'array' : typeof en;
  if (tt !== et) { errs.push(`${p}: type ${tt}→${et}`); return; }
  if (tt === 'array') {
    if (th.length !== en.length) errs.push(`${p}: array length ${th.length}→${en.length}`);
    for (let i = 0; i < Math.min(th.length, en.length); i++) walkKeyed(th[i], en[i], `${p}[${i}]`, key, errs);
    return;
  }
  if (tt === 'object') {
    const tk = Object.keys(th), ek = new Set(Object.keys(en));
    for (const k of tk) {
      if (!ek.has(k)) { errs.push(`${p}.${k}: MISSING in EN`); continue; }
      walkKeyed(th[k], en[k], `${p}.${k}`, k, errs);
    }
    for (const k of Object.keys(en)) if (!tk.includes(k)) errs.push(`${p}.${k}: EXTRA in EN`);
    return;
  }
  if (tt === 'number' || tt === 'boolean') { if (th !== en) errs.push(`${p}: ${tt} ${JSON.stringify(th)}→${JSON.stringify(en)}`); return; }
  if (tt === 'string') {
    if (IDENTICAL_KEYS.has(key) || isUrlish(th)) { if (!sameUrl(th, en)) errs.push(`${p}: must stay identical ("${String(th).slice(0,40)}" → "${String(en).slice(0,40)}")`); }
  }
}

function validate(file) {
  const errs = [];
  const thp = path.join(THDIR, file), enp = path.join(ENDIR, file);
  if (!fs.existsSync(thp)) return { file, ok: false, errs: ['no TH source'] };
  if (!fs.existsSync(enp)) return { file, ok: false, errs: ['EN twin not written'] };
  const enText = fs.readFileSync(enp, 'utf8');
  let th, en;
  try { th = JSON.parse(fs.readFileSync(thp, 'utf8')); } catch (e) { return { file, ok: false, errs: ['TH parse: ' + e.message] }; }
  try { en = JSON.parse(enText); } catch (e) { return { file, ok: false, errs: ['EN parse: ' + e.message] }; }
  // 1) zero raw Thai anywhere in EN (proper nouns must be romanized; URL-encoded Thai in hrefs is ASCII so fine)
  //    EXCEPTION (owner policy 2026-07-02): the ฿ (baht) symbol and the word "ฟรี" (free) are accepted in EN text
  //    — ฿ is an internationally-read currency mark — so they are stripped before this scan. Without this, ~1.5k
  //    pre-existing ฿-price strings failed and drowned out genuine untranslated-Thai misses. (New twins should
  //    still prefer "THB"/"free" per _internal/en-twin-spec.md rule E; this only relaxes the validator's alarm.)
  const ALLOWED_TH = /฿|ฟรี/g;
  const thaiHits = [];
  (function scan(o, p) {
    if (typeof o === 'string') { if (THAI.test(o.replace(ALLOWED_TH, '')) && !IDENTICAL_KEYS.has(p.split('.').pop())) thaiHits.push(`${p}: "${o.slice(0, 50)}"`); }
    else if (Array.isArray(o)) o.forEach((v, i) => scan(v, `${p}[${i}]`));
    else if (o && typeof o === 'object') for (const k of Object.keys(o)) scan(o[k], `${p}.${k}`);
  })(en, '$');
  // hrefs are allowed to keep URL-encoded Thai; raw Thai only flagged in non-identical string fields
  for (const h of thaiHits) errs.push('RAW THAI ' + h);
  // 2) structural parity
  walkKeyed(th, en, '$', '', errs);
  return { file, ok: errs.length === 0, errs };
}

let files = process.argv.slice(2);
if (files[0] === '--all') files = fs.readdirSync(ENDIR).filter(f => f.endsWith('.json') && fs.existsSync(path.join(THDIR, f)));
let pass = 0, fail = 0;
for (const f of files) {
  const r = validate(f);
  if (r.ok) { pass++; console.log('PASS ' + f); }
  else { fail++; console.log('FAIL ' + f); for (const e of r.errs.slice(0, 12)) console.log('   - ' + e); if (r.errs.length > 12) console.log(`   … +${r.errs.length - 12} more`); }
}
console.log(`\n${pass} pass · ${fail} fail · ${files.length} total`);
process.exit(fail ? 1 : 0);

// Validate an EN-sourced hub translation twin (ru/ko/ja/hi/he/ar) against its EN source.
// Checks: valid JSON · structural parity (same keys + array lengths) · facts/links/numbers byte-identical
//         · target script present (not just an English copy) · no raw Thai leak (฿ allowed).
// Usage: node _internal/validate-hub-twin.mjs <collection: reviews|roundups> <lang> <file.json> [file2 ...]
//    or: node _internal/validate-hub-twin.mjs <collection> <lang> --all   (every twin that has an EN source)
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const coll = process.argv[2];
const lang = process.argv[3];
if (!['reviews', 'roundups'].includes(coll)) { console.error('first arg must be reviews|roundups'); process.exit(2); }

const TARGET_SCRIPT = {
  ru: /[Ѐ-ӿ]/, ko: /[가-힣]/, ja: /[぀-ヿ一-鿿]/,
  hi: /[ऀ-ॿ]/, he: /[֐-׿]/, ar: /[؀-ۿ]/, zh: /[一-鿿]/,
};
if (!TARGET_SCRIPT[lang]) { console.error('second arg must be a supported lang: ' + Object.keys(TARGET_SCRIPT).join(',')); process.exit(2); }

const ENDIR = path.join(ROOT, `astro/src/content/${coll}-en`);
const TGTDIR = path.join(ROOT, `astro/src/content/${coll}-${lang}`);
const THAI = /[฀-๿]/;         // Thai block
const BAHT = /฿/g;                  // ฿ lives in the Thai block; allowed per spec
const SCRIPT = TARGET_SCRIPT[lang];

// String values that must stay byte-identical (facts / schema / addresses / links / brand names).
const IDENTICAL_KEYS = new Set([
  'slug', 'cluster', 'image', 'heroImg', 'heroSub1', 'heroSub2', 'heroSub2Href',
  'typeEn', 'streetAddress', 'addressLocality', 'addressCountry', 'priceRange',
  'parentHref', 'parentCrumbUrl', 'crumbCityHref', 'countryHref', 'qiPrice',
  'mapImg', 'addr', 'navReviewHref', // mapAddr intentionally NOT here: it's a display caption a translator may gloss (streetAddress is the schema fact and stays identical)
  'agodaUrl', 'bookingUrl', 'tripUrl', 'reviewUrl', 'bookingAgoda', 'bookingBooking', 'bookingTrip',
  'img', 'icon', 'id', 'rank', 'rankColor', 'badgeColor', 'badgeStyle', 'priceBig', 'stars',
  'src', 'href', 'heroCreditHref', 'libCreditHref', 'creditHref',
]);
// NOTE: intentionally NOT matching bare "/word" — that catches translatable units like qiPriceUnit "/night".
// Relative internal links all live under named *Href/href/*Url keys, which are in IDENTICAL_KEYS already.
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/\S+\/\S/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v) || /^#[0-9a-fA-F]{3,8}$/.test(v));
const sameUrl = (a, b) => { if (a === b) return true; try { return decodeURIComponent(a) === decodeURIComponent(b); } catch { return false; } };

function walkKeyed(en, tw, p, key, errs) {
  if (en === null || en === undefined) return;
  const et = Array.isArray(en) ? 'array' : typeof en;
  const tt = Array.isArray(tw) ? 'array' : typeof tw;
  if (et !== tt) { errs.push(`${p}: type ${et}→${tt}`); return; }
  if (et === 'array') {
    if (en.length !== tw.length) errs.push(`${p}: array length ${en.length}→${tw.length}`);
    for (let i = 0; i < Math.min(en.length, tw.length); i++) walkKeyed(en[i], tw[i], `${p}[${i}]`, key, errs);
    return;
  }
  if (et === 'object') {
    const ek = Object.keys(en), tk = new Set(Object.keys(tw));
    for (const k of ek) { if (!tk.has(k)) { errs.push(`${p}.${k}: MISSING in ${lang}`); continue; } walkKeyed(en[k], tw[k], `${p}.${k}`, k, errs); }
    for (const k of Object.keys(tw)) if (!ek.includes(k)) errs.push(`${p}.${k}: EXTRA in ${lang}`);
    return;
  }
  if (et === 'number' || et === 'boolean') { if (en !== tw) errs.push(`${p}: ${et} ${JSON.stringify(en)}→${JSON.stringify(tw)}`); return; }
  if (et === 'string') { if (IDENTICAL_KEYS.has(key) || isUrlish(en)) { if (!sameUrl(en, tw)) errs.push(`${p}: must stay identical ("${String(en).slice(0, 40)}" → "${String(tw).slice(0, 40)}")`); } }
}

function validate(file) {
  const errs = [];
  const enp = path.join(ENDIR, file), twp = path.join(TGTDIR, file);
  if (!fs.existsSync(enp)) return { file, ok: false, errs: ['no EN source'] };
  if (!fs.existsSync(twp)) return { file, ok: false, errs: [`${lang} twin not written`] };
  let en, tw;
  try { en = JSON.parse(fs.readFileSync(enp, 'utf8')); } catch (e) { return { file, ok: false, errs: ['EN parse: ' + e.message] }; }
  try { tw = JSON.parse(fs.readFileSync(twp, 'utf8')); } catch (e) { return { file, ok: false, errs: [`${lang} parse: ` + e.message] }; }
  // 1) no raw Thai leak (฿ allowed) in translatable fields
  let scriptCount = 0;
  const thaiHits = [];
  (function scan(o, p) {
    if (typeof o === 'string') {
      const stripped = o.replace(BAHT, '');
      const lastKey = p.split('.').pop().replace(/\[\d+\]$/, '');
      if (THAI.test(stripped) && !IDENTICAL_KEYS.has(lastKey)) thaiHits.push(`${p}: "${o.slice(0, 50)}"`);
      if (SCRIPT.test(o)) scriptCount++;
    } else if (Array.isArray(o)) o.forEach((v, i) => scan(v, `${p}[${i}]`));
    else if (o && typeof o === 'object') for (const k of Object.keys(o)) scan(o[k], `${p}.${k}`);
  })(tw, '$');
  for (const h of thaiHits) errs.push('RAW THAI ' + h);
  // 2) target script must be meaningfully present (catches an untranslated English copy)
  if (scriptCount < 5) errs.push(`SUSPICIOUSLY LITTLE ${lang.toUpperCase()}: only ${scriptCount} strings contain target script`);
  // 3) structural parity vs EN source
  walkKeyed(en, tw, '$', '', errs);
  return { file, ok: errs.length === 0, errs };
}

let files = process.argv.slice(4);
if (files[0] === '--all') files = fs.readdirSync(TGTDIR).filter(f => f.endsWith('.json') && fs.existsSync(path.join(ENDIR, f)));
let pass = 0, fail = 0;
const failed = [];
for (const f of files) {
  const r = validate(f);
  if (r.ok) { pass++; } else { fail++; failed.push(f); console.log('FAIL ' + f); for (const e of r.errs.slice(0, 10)) console.log('   - ' + e); if (r.errs.length > 10) console.log(`   … +${r.errs.length - 10} more`); }
}
console.log(`\n${pass} pass · ${fail} fail · ${files.length} total (${coll}-${lang})`);
process.exit(fail ? 1 : 0);

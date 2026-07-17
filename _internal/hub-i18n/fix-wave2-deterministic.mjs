// Deterministic Wave-2 (hi/he/ar) QA fixes — no LLM, exact & reversible via git.
//  1) Currency leak: EN "฿300" was rendered "300 บาท" in he/ar. Restore "฿<num>" (matches
//     the existing clean convention, e.g. HE "החל מ-฿1,900"). ฿ is allowed by the gate.
//  2) Structural: restore every IDENTICAL_KEYS / urlish / number / boolean value from the EN
//     source (fixes the 10 roundups-hi entries[].addr that were translated), and prune keys
//     that don't exist in EN (fixes reviews-ar body[1].kindNote EXTRA).
// Only touches reviews-{hi,he,ar} + roundups-{hi,he,ar}. Prints a summary.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const IDENTICAL_KEYS = new Set([
  'slug', 'cluster', 'image', 'heroImg', 'heroSub1', 'heroSub2', 'heroSub2Href',
  'typeEn', 'streetAddress', 'addressLocality', 'addressCountry', 'priceRange',
  'parentHref', 'parentCrumbUrl', 'crumbCityHref', 'countryHref', 'qiPrice',
  'mapImg', 'addr', 'navReviewHref',
  'agodaUrl', 'bookingUrl', 'tripUrl', 'reviewUrl', 'bookingAgoda', 'bookingBooking', 'bookingTrip',
  'img', 'icon', 'id', 'rank', 'rankColor', 'badgeColor', 'badgeStyle', 'priceBig', 'stars',
  'src', 'href', 'heroCreditHref', 'libCreditHref', 'creditHref',
]);
const isUrlish = v => typeof v === 'string' && (/^https?:\/\//.test(v) || /^\/\S+\/\S/.test(v) || /\.html(\?|#|$)/.test(v) || /\.(jpe?g|png|webp|avif|gif|svg)$/i.test(v) || /^\d{4}-\d{2}-\d{2}$/.test(v) || /^#[0-9a-fA-F]{3,8}$/.test(v));

// Absorb an optional leading ฿, keep the number (+optional trailing +), drop the Thai word.
const BAHT_NUM = /฿?\s*([\d][\d,]*)(\+?)\s*บาท/g;

let curFixedFiles = 0, curFixedHits = 0, structFiles = 0, structOps = 0;

function restoreFromEN(en, tw, key, log) {
  if (en === null || en === undefined) return tw;
  const et = Array.isArray(en) ? 'array' : typeof en;
  const tt = Array.isArray(tw) ? 'array' : typeof tw;
  if (et !== tt) return tw; // type drift — leave for LLM/manual (none expected)
  if (et === 'array') {
    for (let i = 0; i < Math.min(en.length, tw.length); i++) tw[i] = restoreFromEN(en[i], tw[i], key, log);
    return tw;
  }
  if (et === 'object') {
    for (const k of Object.keys(en)) {
      if (!(k in tw)) { tw[k] = en[k]; log.push('add-missing ' + k); continue; }
      tw[k] = restoreFromEN(en[k], tw[k], k, log);
    }
    for (const k of Object.keys(tw)) if (!(k in en)) { delete tw[k]; log.push('drop-extra ' + k); }
    return tw;
  }
  if (et === 'number' || et === 'boolean') { if (en !== tw) { log.push(`num/bool ${key}`); return en; } return tw; }
  if (et === 'string') { if ((IDENTICAL_KEYS.has(key) || isUrlish(en)) && en !== tw) { log.push('ident ' + key); return en; } return tw; }
  return tw;
}

for (const lang of ['hi', 'he', 'ar']) {
  for (const coll of ['reviews', 'roundups']) {
    const tgtDir = path.join(ROOT, `astro/src/content/${coll}-${lang}`);
    const enDir = path.join(ROOT, `astro/src/content/${coll}-en`);
    if (!fs.existsSync(tgtDir)) continue;
    for (const f of fs.readdirSync(tgtDir).filter(f => f.endsWith('.json'))) {
      const twp = path.join(tgtDir, f), enp = path.join(enDir, f);
      let raw = fs.readFileSync(twp, 'utf8');

      // 1) currency (he/ar only carry บาท)
      let curHits = 0;
      const rawCur = raw.replace(BAHT_NUM, (_m, n, plus) => { curHits++; return `฿${n}${plus}`; });
      if (curHits) { raw = rawCur; curFixedFiles++; curFixedHits += curHits; }

      // 2) structural restore from EN (parse the possibly-currency-fixed text)
      let obj, changed = curHits > 0;
      try { obj = JSON.parse(raw); } catch (e) { console.log('PARSE FAIL', coll + '-' + lang + '/' + f, e.message); continue; }
      if (fs.existsSync(enp)) {
        const en = JSON.parse(fs.readFileSync(enp, 'utf8'));
        const log = [];
        restoreFromEN(en, obj, '', log);
        if (log.length) { structFiles++; structOps += log.length; changed = true; }
      }
      if (changed) fs.writeFileSync(twp, JSON.stringify(obj, null, 2) + '\n');
    }
  }
}
console.log(`Currency: ${curFixedHits} hits across ${curFixedFiles} files`);
console.log(`Structural: ${structOps} ops across ${structFiles} files`);

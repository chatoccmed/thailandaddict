// One-shot freshness fixes surfaced by audit-freshness.mjs (idempotent — safe to re-run):
//   1. reviews (TH+EN): vestigial wherebest region link `continent-asia.html` (regionLabel "Asia"/"เอเชีย")
//      → `country-thailand.html` / "🇹🇭 Thailand"  (471 broken links, IS rendered in nav + breadcrumb)
//   2. khaoyai-nature-trip: regionHref `region-northeast.html` (no such hub) → `region-isan.html`
//      (khao-yai is region 'ne' in gen-hubs; region-isan is the NE hub)
//   3. sukhothai-tak-plan: stale SEO year "2025" → "2026" in title (the only genuine stale-year case)
//   4. roundups-en/top10-hotels-sakon-nakhon: EN entries drifted from TH → 5 reviewUrls point at
//      reviews that never existed. Repoint the one slug variant that DOES exist; point the 4 phantom
//      entries at the city hub (reviewUrl is a required schema field, so it can't be dropped; the
//      hub is a valid, relevant fallback for hotels with no dedicated review). The deeper TH↔EN
//      entry-set drift is flagged separately for a proper EN-mirror rebuild.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const C = path.join(ROOT, 'astro', 'src', 'content');
const DATE = '2026-06-21';
const load = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const save = (p, d) => fs.writeFileSync(p, JSON.stringify(d, null, 2) + '\n');

// 1. reviews region link
let nRev = 0;
for (const dir of ['reviews', 'reviews-en']) {
  const p = path.join(C, dir);
  for (const f of fs.readdirSync(p)) {
    if (!f.endsWith('.json')) continue;
    const fp = path.join(p, f), d = load(fp);
    if (d.regionHref === 'continent-asia.html') {
      d.regionHref = 'country-thailand.html';
      d.regionLabel = '🇹🇭 Thailand';
      save(fp, d); nRev++;
    }
  }
}
console.log('1. reviews region link fixed:', nRev);

// 2. khaoyai-nature-trip region
for (const dir of ['articles', 'articles-en']) {
  const fp = path.join(C, dir, 'khaoyai-nature-trip.json');
  if (!fs.existsSync(fp)) continue;
  const d = load(fp);
  if (d.regionHref === 'region-northeast.html') { d.regionHref = 'region-isan.html'; d.modifiedDate = DATE; save(fp, d); console.log('2. khaoyai region fixed:', dir); }
}

// 3. sukhothai-tak-plan year
for (const dir of ['articles', 'articles-en']) {
  const fp = path.join(C, dir, 'sukhothai-tak-plan.json');
  if (!fs.existsSync(fp)) continue;
  const d = load(fp); let ch = false;
  for (const k of ['title', 'ogTitle', 'h1', 'metaDesc', 'ogDesc'])
    if (typeof d[k] === 'string' && d[k].includes('2025')) { d[k] = d[k].replace(/\b2025\b/g, '2026'); ch = true; }
  if (ch) { d.modifiedDate = DATE; save(fp, d); console.log('3. sukhothai-tak year fixed:', dir); }
}

// 4. sakon EN roundup reviewUrls
{
  const fp = path.join(C, 'roundups-en', 'top10-hotels-sakon-nakhon.json');
  const d = load(fp);
  const repoint = { 'review-hug-sakhonnakhon-hotel-sakon-nakhon.html': 'review-hug-sakonnakhon-sakon-nakhon.html' };
  const toHub = new Set(['review-thong-prachok-hotel-sakon-nakhon.html', 'review-one-sakon-nakhon-hotel-sakon-nakhon.html', 'review-nk-residence-sakon-nakhon.html', 'review-mali-house-sakon-nakhon.html']);
  let ch = 0;
  for (const e of d.entries || []) {
    if (e.reviewUrl && repoint[e.reviewUrl]) { e.reviewUrl = repoint[e.reviewUrl]; ch++; }
    else if (e.reviewUrl && toHub.has(e.reviewUrl)) { e.reviewUrl = 'city-sakon-nakhon.html'; ch++; }
  }
  if (ch) { save(fp, d); console.log('4. sakon EN roundup reviewUrls fixed:', ch); }
}

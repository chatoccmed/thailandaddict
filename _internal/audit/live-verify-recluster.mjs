/* After deploy: the 13 Thai reviews re-clustered on 2026-09-16 (their cluster
   disagreed with their own slug, breadcrumb, parent roundup and address) must
   be listed on their real city hub and no longer on the old one — Thai root,
   English, and for the one review with all nine locales, Japanese too — on
   production (or astro/dist with --local). Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const LOCAL = process.argv.includes('--local');
const SITE = 'https://thailandaddict.com';
const bust = `v=${Date.now()}`;
const MOVES = [
  ['review-armonia-village-resort-and-spa-chumphon', 'chumphon', 'surat-thani'],
  ['review-debua-white-house-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  /* review-friday-hotel-uttaradit was re-clustered here too, but the page was
     taken down on 2026-09-16 (OSM names the node at its pin "Friday Hotel
     (closed 2020)"; owner decided to remove it — _internal/duplicate-reviews.json).
     It now 301s to /top10-hotels-uttaradit, so there is no hub listing to check. */
  ['review-hop-inn-mahasarakham-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-kanya-place-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-phakawan-hotel-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-ploy-palace-hotel-mukdahan', 'mukdahan', 'nakhon-phanom'],
  ['review-rattanas-resort-ranong', 'ranong', 'chumphon'],
  ['review-siri-resort-kaeng-loeng-chan-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-suksatan-at-lamphun-lamphun', 'lamphun', 'lampang'],
  ['review-taksila-hotel-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-the-orchid-resort-relax-maha-sarakham', 'maha-sarakham', 'khon-kaen'],
  ['review-the-proud-resort-khao-kho-phetchabun', 'phetchabun', 'phitsanulok'],
];
const cache = new Map();
async function page(loc, cluster) {
  const p = `${loc ? `/${loc}` : ''}/city-${cluster}`;
  if (cache.has(p)) return cache.get(p);
  let body = null;
  if (LOCAL) {
    const f = `astro/dist${p}.html`;
    body = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  } else {
    try {
      const r = await fetch(`${SITE}${p}?${bust}`, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000) });
      body = r.ok ? await r.text() : null;
    } catch { body = null; }
  }
  cache.set(p, body);
  return body;
}
/* a hub lists a review as a link to it; anything else (a slug inside JSON of
   another feature) is not a listing */
const lists = (html, slug) => new RegExp(`href="[^"]*${slug}(?:\\.html)?"`).test(html);
let fails = 0, passes = 0;
for (const [slug, to, from] of MOVES) {
  const locs = ['', 'en', ...(slug.includes('proud-resort') ? ['ja'] : [])];
  for (const loc of locs) {
    const onTo = await page(loc, to), onFrom = await page(loc, from);
    const ok = onTo !== null && onFrom !== null && lists(onTo, slug) && !lists(onFrom, slug);
    if (ok) passes++; else { fails++; console.log(`✗ ${loc || 'th'} ${slug}: listed on city-${to} ${onTo ? lists(onTo, slug) : 'page missing'} · still on city-${from} ${onFrom ? lists(onFrom, slug) : 'page missing'}`); }
  }
}
console.log(fails ? `${fails} recluster check(s) failed · ${passes} passed` : `all ${passes} recluster checks passed (${LOCAL ? 'astro/dist' : SITE})`);
process.exit(fails ? 1 : 0);

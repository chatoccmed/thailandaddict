/* After deploy: the 8 hotels whose language twins were re-clustered on
   2026-09-15 must be listed on their real hub and no longer on the old one,
   in English and Japanese, on production (or astro/dist with --local).
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const LOCAL = process.argv.includes('--local');
const SITE = 'https://thailandaddict.com';
const bust = `v=${Date.now()}`;
const MOVES = [
  ['review-high-season-pool-villa-spa-koh-kood-trat', 'koh-kood', 'trat'],
  ['review-koh-kood-resort-trat', 'koh-kood', 'trat'],
  ['review-pajamas-koh-chang-trat', 'koh-chang', 'trat'],
  ['review-sindys-hostel-pattaya-chonburi', 'pattaya', 'chonburi'],
  ['review-the-bedrooms-hostel-pattaya-chonburi', 'pattaya', 'chonburi'],
  ['review-thames-valley-khao-yai-nakhon-ratchasima', 'khao-yai', 'nakhon-ratchasima'],
  ['review-the-bluesky-resort-khao-kho-phetchabun', 'phetchabun', 'phitsanulok'],
  ['review-huern-na-na-boutique-phrae', 'phrae', 'nan'],
];
const cache = new Map();
async function page(loc, cluster) {
  const p = `/${loc}/city-${cluster}`;
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
let fails = 0, passes = 0;
for (const [slug, to, from] of MOVES) {
  for (const loc of ['en', 'ja']) {
    const onTo = await page(loc, to), onFrom = await page(loc, from);
    const ok = onTo !== null && onFrom !== null && onTo.includes(slug) && !onFrom.includes(slug);
    if (ok) passes++; else { fails++; console.log(`✗ ${loc} ${slug}: on city-${to} ${onTo ? onTo.includes(slug) : 'page missing'} · still on city-${from} ${onFrom ? onFrom.includes(slug) : 'page missing'}`); }
  }
}
console.log(fails ? `${fails} twin check(s) failed · ${passes} passed` : `all ${passes} twin checks passed (${LOCAL ? 'astro/dist' : SITE})`);
process.exit(fails ? 1 : 0);

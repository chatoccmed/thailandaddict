/* After deploy: every hotel pin moved or dropped by the 2026-09-16 accuracy
   batches must be live where maps read hotel pins —
     · /feeds/hotels.json and /feeds/hotels-en.json: a moved review carries the
       new point (within the feed's rounding) and not the old one; a dropped
       review carries no point
     · the TH and EN city hub map of the review's cluster, when that hub has a
       map: a moved review's point is the new one; a dropped review is absent
   Usage: node live-verify-moves.mjs [--local]      (--local = astro/dist)
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const LOCAL = process.argv.includes('--local');
const SITE = 'https://thailandaddict.com';
/* --batch <id> (repeatable) adds a batch to the four accuracy batches, so a
   later batch is only checked once it is meant to be live. */
const extra = process.argv.flatMap((a, i) => (process.argv[i - 1] === '--batch' ? [a] : []));
const BATCHES = new Set(['2026-09-16-hotel-pin-accuracy', '2026-09-16-hotel-pin-accuracy-2', '2026-09-16-hotel-pin-accuracy-3', '2026-09-16-hotel-pin-accuracy-4', ...extra]);
/* A review merged into another page (or taken down) since these batches ran has
   no page, no feed entry and no map point any more — by decision, recorded in
   _internal/duplicate-reviews.json — so its pin is not something to verify. */
const merged = new Set();
try {
  const dup = JSON.parse(fs.readFileSync('_internal/duplicate-reviews.json', 'utf8'));
  for (const g of dup.groups || []) for (const s of g.redirect) merged.add(s);
  for (const r of dup.removed || []) merged.add(r.slug);
} catch { /* no decision file yet */ }
const fixes = JSON.parse(fs.readFileSync('_internal/pin-fixes.json', 'utf8'))
  .filter((e) => BATCHES.has(e.batch) && e.kind === 'reviews' && !merged.has(e.slug));
const bust = `v=${Date.now()}`;
const cache = new Map();
async function get(p) {
  if (cache.has(p)) return cache.get(p);
  let body = null;
  if (LOCAL) {
    const f = `astro/dist${p}${p.endsWith('.json') ? '' : '.html'}`;
    body = fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null;
  } else {
    try {
      const r = await fetch(`${SITE}${p}?${bust}`, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(45000) });
      body = r.ok ? await r.text() : null;
    } catch { body = null; }
  }
  cache.set(p, body);
  return body;
}
const pair = (s) => String(s).split(',').map(Number);
const near = (a, b, tol) => Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol;
const slugOfUrl = (u) => String(u || '').replace(/\?.*$/, '').replace(/\.html$/, '').split('/').pop();
const cmap = (html) => {
  if (!html) return null;
  const i = html.indexOf('window.__CMAP__='); if (i < 0) return null;
  try { return JSON.parse(html.slice(i + 16, html.indexOf(';</script>', i))); } catch { return null; }
};

let pass = 0, fail = 0, skipped = 0;
const bad = (msg) => { fail++; console.log('✗ ' + msg); };
for (const [label, path] of [['TH feed', '/feeds/hotels.json'], ['EN feed', '/feeds/hotels-en.json']]) {
  const body = await get(path);
  if (!body) { bad(`${label}: ${path} not available`); continue; }
  const items = JSON.parse(body).items || [];
  const bySlug = new Map(items.map((it) => [slugOfUrl(it.url), it]));
  for (const e of fixes) {
    const it = bySlug.get(e.slug);
    if (!it) { bad(`${label}: ${e.slug} not in the feed`); continue; }
    const has = Number.isFinite(it.lat) && Number.isFinite(it.lng);
    if (e.action === 'drop') { if (has) bad(`${label}: ${e.slug} still has a point ${it.lat},${it.lng}`); else pass++; continue; }
    if (!has) { bad(`${label}: ${e.slug} has no point`); continue; }
    if (near([it.lat, it.lng], pair(e.to), 2e-4) && !near([it.lat, it.lng], pair(e.pos), 2e-4)) pass++;
    else bad(`${label}: ${e.slug} is at ${it.lat},${it.lng}, expected ${e.to} (was ${e.pos})`);
  }
}
for (const e of fixes) {
  const j = JSON.parse(fs.readFileSync(`astro/src/content/reviews/${e.slug}.json`, 'utf8'));
  for (const loc of ['', '/en']) {
    const map = cmap(await get(`${loc}/city-${j.cluster}`));
    if (!map) { skipped++; continue; }
    const pts = map.filter((p) => slugOfUrl(p.u) === e.slug);
    if (e.action === 'drop') { if (pts.length) bad(`${loc || 'th'} city-${j.cluster}: dropped ${e.slug} still on the map`); else pass++; continue; }
    if (!pts.length) { skipped++; continue; }
    if (pts.some((p) => near([p.la, p.ln], pair(e.to), 2e-4))) pass++;
    else bad(`${loc || 'th'} city-${j.cluster}: ${e.slug} at ${pts[0].la},${pts[0].ln}, expected ${e.to}`);
  }
}
console.log(fail ? `${fail} moved-pin check(s) failed · ${pass} passed · ${skipped} hub checks not applicable` : `all ${pass} moved-pin checks passed (${LOCAL ? 'astro/dist' : SITE}) · ${skipped} hub checks not applicable (no map or no stays layer)`);
process.exit(fail ? 1 : 0);

/* Every hotel pin added since <base> must be live. A review page that shows a
   map image renders the address as text and no coordinate, so a review page
   proves nothing; hotel pins are checked where maps read them:
     · /feeds/hotels.json and /feeds/hotels-en.json carry the stored latitude
     · the TH near-me index lists the review (link + position within its
       3-decimal rounding) — where the local index, which dist is built from,
       lists it
     · each hub map (TH, EN) that holds the point in the local build
   Also reports hubs that gained a map against a snapshot.
     node live-verify-hotels.mjs [--base <commit>]    check production
     node live-verify-hotels.mjs --local              check astro/dist
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
process.chdir(ROOT);
const SITE = 'https://thailandaddict.com';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'b0523be5a');
const LOCAL = process.argv.includes('--local');

const changed = execFileSync('git', ['diff', '--name-only', BASE, '--', 'astro/src/content/reviews'], { encoding: 'utf8' })
  .split('\n').filter((f) => /^astro\/src\/content\/reviews\/[^/]+\.json$/.test(f));
const added = [];
for (const f of changed) {
  let before = {};
  try { before = JSON.parse(execFileSync('git', ['show', `${BASE}:${f}`], { encoding: 'utf8', maxBuffer: 64 << 20 })); } catch { /* new file */ }
  /* merged into another page since <base> (duplicate-reviews.json) — the file
     is gone on purpose and its URL now 301s, so there is no pin to check */
  if (!fs.existsSync(f)) continue;
  const after = JSON.parse(fs.readFileSync(f, 'utf8'));
  if (Number.isFinite(after.lat) && !Number.isFinite(before.lat)) added.push({ slug: after.slug || f.split('/').pop().replace(/\.json$/, ''), cluster: after.cluster, lat: after.lat, lng: after.lng });
}
console.log(`${added.length} hotel pin(s) added since ${BASE} · checking ${LOCAL ? 'astro/dist' : SITE}\n`);

const bust = `v=${Date.now()}`;
const seen = new Map();
async function get(p) {
  if (seen.has(p)) return seen.get(p);
  let res;
  if (LOCAL) {
    const f = `astro/dist${p.endsWith('.json') ? p : `${p}.html`}`;
    res = fs.existsSync(f) ? { status: 200, body: fs.readFileSync(f, 'utf8') } : { status: 404, body: '' };
  } else {
    try {
      const r = await fetch(`${SITE}${p}?${bust}`, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, redirect: 'follow', signal: AbortSignal.timeout(30000) });
      res = { status: r.status, body: await r.text() };
    } catch (e) { res = { status: 0, body: '', error: e.message }; }
  }
  seen.set(p, res);
  return res;
}
const cmap = (s) => { const i = s.indexOf('window.__CMAP__='); if (i < 0) return null; try { return JSON.parse(s.slice(i + 16, s.indexOf(';</script>', i))); } catch { return null; } };
const localCmap = (p) => { const f = `astro/dist${p}.html`; return fs.existsSync(f) ? cmap(fs.readFileSync(f, 'utf8')) : null; };
const onMap = (m, v) => !!m && m.some((q) => q.t === 's' && Math.abs(q.la - v.lat) < 6e-6 && Math.abs(q.ln - v.lng) < 6e-6);

let fails = 0, passes = 0;
const check = (ok, label) => { if (ok) passes++; else { fails++; console.log(`   ✗ ${label}`); } };
const feeds = {};
for (const p of ['/feeds/hotels.json', '/feeds/hotels-en.json', '/near-me-index.json']) {
  feeds[p] = await get(p);
  check(feeds[p].status === 200, `${p} answered HTTP ${feeds[p].status}${feeds[p].error ? ` (${feeds[p].error})` : ''}`);
}
let near = [];
try { near = JSON.parse(feeds['/near-me-index.json'].body); } catch { check(false, '/near-me-index.json did not parse'); }
const localNear = JSON.parse(fs.readFileSync('astro/public/near-me-index.json', 'utf8'));
const inIndex = (arr, v) => arr.some((p) => p.t === 's' && String(p.u || '').replace(/^\//, '') === v.slug && Math.abs(p.la - v.lat) < 6e-4 && Math.abs(p.ln - v.lng) < 6e-4);

let nearChecks = 0, hubChecks = 0;
for (const v of added) {
  const marks = [];
  const s6 = String(v.lat);
  for (const p of ['/feeds/hotels.json', '/feeds/hotels-en.json']) {
    const ok = feeds[p].body.includes(s6);
    check(ok, `${v.slug}: ${p} lacks ${s6}`);
    marks.push(`${p.includes('-en') ? 'feed-en' : 'feed'} ${ok ? '✓' : '✗'}`);
  }
  if (inIndex(localNear, v)) {
    nearChecks++;
    const ok = inIndex(near, v);
    check(ok, `${v.slug}: not in the near-me index near ${v.lat},${v.lng}`);
    marks.push(`near ${ok ? '✓' : '✗'}`);
  } else marks.push('near —');
  for (const hub of [`/city-${v.cluster}`, `/en/city-${v.cluster}`]) {
    if (!onMap(localCmap(hub), v)) { marks.push(`${hub.startsWith('/en') ? 'en' : 'th'}-hub —`); continue; }
    hubChecks++;
    const ok = onMap(cmap((await get(hub)).body), v);
    check(ok, `${v.slug}: ${hub} map lacks ${v.lat},${v.lng}`);
    marks.push(`${hub.startsWith('/en') ? 'en' : 'th'}-hub ${ok ? '✓' : '✗'}`);
  }
  if (marks.some((mk) => mk.endsWith('✗'))) console.log(`${v.slug} [${v.cluster}] · ${marks.join(' · ')}`);
}
console.log(`feed checks: ${added.length * 2} · near-me checks: ${nearChecks} · hub-map checks: ${hubChecks}`);

const snapFile = arg('--snap', `${SP}hub-maps-before-hotels.json`);
const snap = fs.existsSync(snapFile) ? JSON.parse(fs.readFileSync(snapFile, 'utf8')) : {};
const gained = [];
for (const [key, n] of Object.entries(snap)) {
  if (n > 0) continue;
  const [loc, page] = key.split(':');
  const p = `${loc === 'th' ? '' : `/${loc}`}/${page}`;
  if (!localCmap(p)) continue;
  const live = cmap((await get(p)).body);
  check(!!live, `${p}: map in the local build but not ${LOCAL ? 'readable' : 'live'}`);
  gained.push(`${p} (${live ? live.length : 0} points)`);
}
console.log(`hub maps switched on: ${gained.length ? gained.join(' · ') : 'none'}`);
console.log(fails ? `\n${fails} check(s) failed · ${passes} passed` : `\nall ${passes} checks passed`);
process.exit(fails ? 1 : 0);

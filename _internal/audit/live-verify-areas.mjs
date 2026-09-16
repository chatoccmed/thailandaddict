/* Every attraction pin added since <base> must be live: in the attractions
   feeds (TH, EN), in both near-me indexes, and on each hub map (TH, EN, zh)
   that holds it in the local build. Also reports which hubs gained a map.
   Read-only.
     node live-verify-areas.mjs [--base <commit>]    check production
     node live-verify-areas.mjs --local              check astro/dist (before deploy)
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
process.chdir(ROOT);
const SITE = 'https://thailandaddict.com';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', 'b4ef8721e');
const LOCAL = process.argv.includes('--local');

const before = JSON.parse(execFileSync('git', ['show', `${BASE}:_internal/place-coords.json`], { encoding: 'utf8', maxBuffer: 256 << 20 }));
const now = JSON.parse(fs.readFileSync('_internal/place-coords.json', 'utf8'));
const added = Object.entries(now).filter(([k, v]) => v && Number.isFinite(v.lat) && !(before[k] && Number.isFinite(before[k].lat)));
console.log(`${added.length} pin(s) added since ${BASE} · checking ${LOCAL ? 'astro/dist' : SITE}\n`);

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
const cmap = (s) => {
  const i = s.indexOf('window.__CMAP__=');
  if (i < 0) return null;
  try { return JSON.parse(s.slice(i + 16, s.indexOf(';</script>', i))); } catch { return null; }
};
const localCmap = (p) => { const f = `astro/dist${p}.html`; return fs.existsSync(f) ? cmap(fs.readFileSync(f, 'utf8')) : null; };
const near = (m, v) => !!m && m.some((q) => Math.abs(q.la - v.lat) < 6e-6 && Math.abs(q.ln - v.lng) < 6e-6);

let fails = 0, passes = 0;
const check = (ok, label) => { if (ok) passes++; else { fails++; console.log(`   ✗ ${label}`); } };
for (const p of ['/feeds/attractions.json', '/feeds/attractions-en.json', '/near-me-index.json', '/en/near-me-index.json']) {
  const r = await get(p);
  check(r.status === 200, `${p} answered HTTP ${r.status}${r.error ? ` (${r.error})` : ''}`);
}

for (const [url, v] of added) {
  const slug = url.split('/').pop();
  let cluster = '?';
  try { cluster = JSON.parse(fs.readFileSync(`astro/src/content/articles/${slug}.json`, 'utf8')).cluster; } catch { /* keep ? */ }
  const s6 = String(v.lat);
  const lines = [];
  for (const p of ['/feeds/attractions.json', '/feeds/attractions-en.json']) {
    const ok = (await get(p)).body.includes(s6);
    check(ok, `${slug}: ${p} lacks ${s6}`);
    lines.push(`${p.includes('-en') ? 'feed-en' : 'feed'} ${ok ? '✓' : '✗'}`);
  }
  for (const p of ['/near-me-index.json', '/en/near-me-index.json']) {
    const ok = (await get(p)).body.includes(`"la":${s6}`);
    check(ok, `${slug}: ${p} lacks "la":${s6}`);
    lines.push(`${p.startsWith('/en') ? 'near-en' : 'near'} ${ok ? '✓' : '✗'}`);
  }
  for (const hub of [`/city-${cluster}`, `/en/city-${cluster}`, `/zh/city-${cluster}`]) {
    const expect = near(localCmap(hub), v);
    if (!expect) { lines.push(`${hub.split('/')[1] === 'city-' + cluster ? 'th' : hub.split('/')[1]}-hub —`); continue; }
    const ok = near(cmap((await get(hub)).body), v);
    check(ok, `${slug}: ${hub} map lacks ${v.lat},${v.lng}`);
    lines.push(`${hub.startsWith('/city') ? 'th' : hub.split('/')[1]}-hub ${ok ? '✓' : '✗'}`);
  }
  console.log(`${slug.padEnd(38)} [${cluster}] ${v.lat},${v.lng} · ${lines.join(' · ')}`);
}

/* hubs that gained a map, against the snapshot taken before this change */
const snap = fs.existsSync(`${SP}hub-maps-before.json`) ? JSON.parse(fs.readFileSync(`${SP}hub-maps-before.json`, 'utf8')) : {};
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
console.log(`\nhub maps switched on: ${gained.length ? gained.join(' · ') : 'none'}`);
console.log(fails ? `\n${fails} check(s) failed · ${passes} passed` : `\nall ${passes} checks passed`);
process.exit(fails ? 1 : 0);

/* Every ranked-item block pin added since <base> must be live: in the TH
   near-me index (matched by the block's own link and a position within the
   index's 3-decimal rounding), and on each hub map (TH, EN) that holds it in
   the local build. Reports hubs that gained a map against a snapshot.
     node live-verify-eat.mjs [--base <commit>]    check production
     node live-verify-eat.mjs --local              check astro/dist
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
const SP = path.resolve(import.meta.dirname, 'cache') + '/';   // gitignored working data
process.chdir(ROOT);
const SITE = 'https://thailandaddict.com';
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('--base', '461a0c5fd');
const LOCAL = process.argv.includes('--local');

const changed = execFileSync('git', ['diff', '--name-only', BASE, '--', 'astro/src/content/articles'], { encoding: 'utf8' })
  .split('\n').filter((f) => /^astro\/src\/content\/articles\/[^/]+\.json$/.test(f));
const added = [];
for (const f of changed) {
  const before = JSON.parse(execFileSync('git', ['show', `${BASE}:${f}`], { encoding: 'utf8', maxBuffer: 64 << 20 }));
  const after = JSON.parse(fs.readFileSync(f, 'utf8'));
  (after.blocks || []).forEach((b, i) => {
    const o = (before.blocks || [])[i] || {};
    if (b && Number.isFinite(b.lat) && !Number.isFinite(o.lat)) added.push({ slug: after.slug || f.split('/').pop().replace(/\.json$/, ''), cluster: after.cluster, rank: b.rank, name: b.name, lat: b.lat, lng: b.lng });
  });
}
console.log(`${added.length} block pin(s) added since ${BASE} · checking ${LOCAL ? 'astro/dist' : SITE}\n`);

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
const onMap = (m, v) => !!m && m.some((q) => Math.abs(q.la - v.lat) < 6e-6 && Math.abs(q.ln - v.lng) < 6e-6);

let fails = 0, passes = 0;
const check = (ok, label) => { if (ok) passes++; else { fails++; console.log(`   ✗ ${label}`); } };
const nearRes = await get('/near-me-index.json');
check(nearRes.status === 200, `/near-me-index.json answered HTTP ${nearRes.status}`);
let near = [];
try { near = JSON.parse(nearRes.body); } catch { check(false, '/near-me-index.json did not parse'); }
/* The near-me index lists real restaurants only — sightseeing blocks in
   activity articles never enter it (2026-09-15: 111 block pins, +1 eat entry).
   So a block is expected there only when the local index, which dist is built
   from, already holds it. */
const localNear = JSON.parse(fs.readFileSync('astro/public/near-me-index.json', 'utf8'));
const inIndex = (arr, v) => arr.some((p) => p.t === 'e' && String(p.u || '').startsWith(`/${v.slug}#`) && Math.abs(p.la - v.lat) < 6e-4 && Math.abs(p.ln - v.lng) < 6e-4);
let nearChecks = 0;

let hubChecks = 0;
for (const v of added) {
  const marks = [];
  let inNear = true;
  if (inIndex(localNear, v)) {
    nearChecks++;
    inNear = inIndex(near, v);
    check(inNear, `${v.slug} r${v.rank}: not in the near-me index near ${v.lat},${v.lng}`);
    marks.push(`near ${inNear ? '✓' : '✗'}`);
  } else marks.push('near —');
  for (const hub of [`/city-${v.cluster}`, `/en/city-${v.cluster}`]) {
    if (!onMap(localCmap(hub), v)) { marks.push(`${hub.startsWith('/en') ? 'en' : 'th'}-hub —`); continue; }
    hubChecks++;
    const ok = onMap(cmap((await get(hub)).body), v);
    check(ok, `${v.slug} r${v.rank}: ${hub} map lacks ${v.lat},${v.lng}`);
    marks.push(`${hub.startsWith('/en') ? 'en' : 'th'}-hub ${ok ? '✓' : '✗'}`);
  }
  if (!inNear || marks.some((m) => m.endsWith('✗'))) console.log(`${v.slug} r${v.rank} [${v.cluster}] · ${marks.join(' · ')}`);
}
console.log(`near-me checks: ${nearChecks} · hub-map checks: ${hubChecks}`);

const snapFile = `${SP}hub-maps-before-eat.json`;
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

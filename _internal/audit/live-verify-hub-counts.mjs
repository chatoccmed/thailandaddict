/* After deploy: every city hub map must carry live exactly the points the local
   build put on it. The merge deleted 130 review pages, so a hub could quietly
   lose points (or a whole map, at the 60%-geocoded gate) without any single
   review check noticing — this compares the two sides for all 89 hubs at once.

   A hub with no map locally must have none live, and vice versa.
   Usage: node live-verify-hub-counts.mjs [--loc en]
   Exit 1 = a count differs. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const SITE = 'https://thailandaddict.com';
const li = process.argv.indexOf('--loc');
const LOC = li > 0 ? process.argv[li + 1] : '';
const bust = `v=${Date.now()}`;
/* the four hubs the merge and the re-cluster were expected to change */
const WATCH = { 'city-pai': 11, 'city-koh-chang': 27, 'city-mae-hong-son': 35, 'city-bangkok': 449 };

const cmap = (s) => {
  if (!s) return null;
  const i = s.indexOf('window.__CMAP__='); if (i < 0) return null;
  try { return JSON.parse(s.slice(i + 16, s.indexOf(';</script>', i))); } catch { return null; }
};
const dir = `astro/dist${LOC ? `/${LOC}` : ''}`;
const hubs = fs.readdirSync(dir).filter((f) => /^city-.+\.html$/.test(f)).map((f) => f.replace(/\.html$/, '')).sort();
console.log(`${hubs.length} city hub(s) in ${dir} · comparing point counts with ${SITE}\n`);

let fails = 0, passes = 0, maps = 0, points = 0;
for (const hub of hubs) {
  const local = cmap(fs.readFileSync(`${dir}/${hub}.html`, 'utf8'));
  const p = `${LOC ? `/${LOC}` : ''}/${hub}`;
  let body = null;
  for (let i = 0; i < 3 && body === null; i++) {
    try {
      const r = await fetch(`${SITE}${p}?${bust}`, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(30000) });
      if (r.ok) body = await r.text(); else if (r.status >= 500) await new Promise((r2) => setTimeout(r2, 1500)); else break;
    } catch { await new Promise((r2) => setTimeout(r2, 1500)); }
  }
  if (body === null) { fails++; console.log(`✗ ${p}: not fetched`); continue; }
  const live = cmap(body);
  const a = local ? local.length : -1, b = live ? live.length : -1;
  if (a !== b) { fails++; console.log(`✗ ${p}: local ${a < 0 ? 'no map' : `${a} points`} · live ${b < 0 ? 'no map' : `${b} points`}`); continue; }
  passes++;
  if (a >= 0) { maps++; points += a; }
  const want = WATCH[hub];
  if (want !== undefined) console.log(`   ${p}: ${a} points live${a === want ? ' ✓ (as expected)' : ` — expected ${want}`}`);
}
console.log(`\nhubs with a map: ${maps}/${hubs.length} · points on them: ${points}`);
console.log(fails ? `${fails} hub count(s) differ · ${passes} matched` : `all ${passes} hub point counts match the local build`);
process.exit(fails ? 1 : 0);

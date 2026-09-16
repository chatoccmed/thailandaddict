/* After deploy: the 8 localize-owned city hubs re-localized on 2026-09-16
   (they still showed the one-marker iframe in all 7 languages while TH/EN had
   a pin map) must carry that map live in every language:
     · window.__CMAP__ present, with exactly the points of the committed
       astro/public/<loc>/ copy
     · no <iframe class="cmap"> left
     · the same points as the TH/EN-generated EN page (astro/public/en/)
   Usage: node live-verify-lang-hubs.mjs [--local]      (--local = astro/dist)
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const LOCAL = process.argv.includes('--local');
const SITE = 'https://thailandaddict.com';
const LOCS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const CITIES = ['bueng-kan', 'chachoengsao', 'pattani', 'phichit', 'ratchaburi', 'satun', 'uthai-thani', 'samut-songkhram'];
const bust = `v=${Date.now()}`;
const cmap = (s) => {
  if (!s) return null;
  const i = s.indexOf('window.__CMAP__='); if (i < 0) return null;
  try { return JSON.parse(s.slice(i + 16, s.indexOf(';</script>', i))); } catch { return null; }
};
const sig = (m) => (m || []).map((p) => `${p.t}|${p.la}|${p.ln}`).sort().join(';');
async function get(p) {
  if (LOCAL) { const f = `astro/dist${p}.html`; return fs.existsSync(f) ? fs.readFileSync(f, 'utf8') : null; }
  try {
    const r = await fetch(`${SITE}${p}?${bust}`, { headers: { 'User-Agent': 'thailandaddict-live-verify/1.0', 'Cache-Control': 'no-cache' }, signal: AbortSignal.timeout(45000) });
    return r.ok ? await r.text() : null;
  } catch { return null; }
}

let pass = 0, fail = 0;
const bad = (m) => { fail++; console.log('✗ ' + m); };
for (const city of CITIES) {
  const en = cmap(fs.readFileSync(`astro/public/en/city-${city}.html`, 'utf8'));
  for (const loc of LOCS) {
    const path = `/${loc}/city-${city}`;
    const committed = cmap(fs.readFileSync(`astro/public${path}.html`, 'utf8'));
    const html = await get(path);
    if (!html) { bad(`${path}: not available`); continue; }
    const live = cmap(html);
    const problems = [];
    if (!live) problems.push('no pin map');
    if (html.includes('<iframe class="cmap"')) problems.push('old iframe still there');
    if (live && sig(live) !== sig(committed)) problems.push(`${live.length} points, committed copy has ${committed ? committed.length : 0}`);
    if (committed && sig(committed) !== sig(en)) problems.push(`committed copy differs from EN (${committed.length} vs ${en ? en.length : 0})`);
    if (problems.length) bad(`${path}: ${problems.join(' · ')}`); else pass++;
  }
}
console.log(fail ? `${fail} language hub check(s) failed · ${pass} passed` : `all ${pass} language hub checks passed (${LOCAL ? 'astro/dist' : SITE}) · ${CITIES.length} cities × ${LOCS.length} languages`);
process.exit(fail ? 1 : 0);

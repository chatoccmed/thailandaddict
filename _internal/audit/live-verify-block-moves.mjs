/* After deploy: every article-block pin MOVED by the listed pin-fixes batches
   must be live everywhere the block's point is rendered —
     · the article page, TH and EN (when the EN page exists in the local
       build): the new "lat":…,"lng":… pair is present and the old one gone
       (the page carries the pair in its pins script and its JSON-LD geo)
     · every hub map (window.__CMAP__, 5-decimal rounding) that holds the block
       in the local build: the point for that block's own anchor
       /<slug>#r<rank> (or /en/<slug>#r<rank>) is the new one, not the old
     · the near-me index, TH and EN, when the local index lists the block
       (3-decimal rounding): same test on the block's own anchor
   Matching the whole article (/<slug>#) was wrong: a neighbouring block of the
   same article can sit within the rounding tolerance of the old position.
   Usage: node live-verify-block-moves.mjs [--local] [--batch <id> …]
   Exit 1 = a check failed. */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');   // _internal/audit -> repo root
process.chdir(ROOT);
const LOCAL = process.argv.includes('--local');
const SITE = 'https://thailandaddict.com';
const given = process.argv.flatMap((a, i) => (process.argv[i - 1] === '--batch' ? [a] : []));
const BATCHES = new Set(given.length ? given : ['2026-09-16-block-pin-accuracy']);
const fixes = JSON.parse(fs.readFileSync('_internal/pin-fixes.json', 'utf8')).filter((e) => BATCHES.has(e.batch) && e.kind === 'articles' && e.action === 'move');
const pair = (s) => String(s).split(',').map(Number);
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
const cmap = (html) => {
  if (!html) return null;
  const i = html.indexOf('window.__CMAP__='); if (i < 0) return null;
  try { return JSON.parse(html.slice(i + 16, html.indexOf(';</script>', i))); } catch { return null; }
};
const near = (a, b, tol) => Math.abs(a[0] - b[0]) <= tol && Math.abs(a[1] - b[1]) <= tol;

/* which local hub pages and indexes hold each block */
const hubFiles = [];
for (const dir of ['astro/dist', 'astro/dist/en']) {
  for (const f of fs.readdirSync(dir)) if (/^(city|area-bangkok|region)-.*\.html$/.test(f)) hubFiles.push(`${dir.replace('astro/dist', '')}/${f.replace(/\.html$/, '')}`);
}
const localHubs = new Map(hubFiles.map((p) => [p, cmap(fs.readFileSync(`astro/dist${p}.html`, 'utf8'))]).filter(([, m]) => m));
const localIndex = new Map(['/near-me-index.json', '/en/near-me-index.json'].filter((p) => fs.existsSync(`astro/dist${p}`)).map((p) => [p, JSON.parse(fs.readFileSync(`astro/dist${p}`, 'utf8'))]));

let pass = 0, fail = 0, pageChecks = 0, hubChecks = 0, indexChecks = 0;
const bad = (msg) => { fail++; console.log('✗ ' + msg); };
const num = (v) => String(Number(v));
for (const e of fixes) {
  const [plat, plng] = pair(e.pos), [tlat, tlng] = pair(e.to);
  const label = `${e.slug} ${e.at}`;
  const rank = JSON.parse(fs.readFileSync(`astro/src/content/articles/${e.slug}.json`, 'utf8')).blocks[Number(e.at.split('.')[1])].rank;
  const anchor = (path) => `${path.startsWith('/en/') ? '/en' : ''}/${e.slug}#r${rank}`;
  for (const loc of ['', '/en']) {
    const path = `${loc}/${e.slug}`;
    if (loc && !fs.existsSync(`astro/dist${path}.html`)) continue;
    pageChecks++;
    const html = await get(path);
    if (!html) { bad(`${label}: ${path} not available`); continue; }
    const hasNew = html.includes(`"lat":${num(tlat)},"lng":${num(tlng)}`) || html.includes(`"latitude":${num(tlat)},"longitude":${num(tlng)}`);
    const hasOld = html.includes(`"lat":${num(plat)},"lng":${num(plng)}`) || html.includes(`"latitude":${num(plat)},"longitude":${num(plng)}`);
    if (hasNew && !hasOld) pass++; else bad(`${label}: ${path} new point ${hasNew ? 'present' : 'MISSING'}, old point ${hasOld ? 'STILL THERE' : 'gone'}`);
  }
  for (const [hub, pts] of localHubs) {
    const a = anchor(hub);
    if (!pts.some((p) => p.u === a && near([p.la, p.ln], [tlat, tlng], 6e-5))) continue;
    hubChecks++;
    const live = cmap(await get(hub));
    if (!live) { bad(`${label}: ${hub} map not ${LOCAL ? 'readable' : 'live'}`); continue; }
    const mine = live.filter((p) => p.u === a);
    if (mine.some((p) => near([p.la, p.ln], [tlat, tlng], 6e-5)) && !mine.some((p) => near([p.la, p.ln], [plat, plng], 6e-5))) pass++;
    else bad(`${label}: ${hub} map has ${mine.map((p) => `${p.la},${p.ln}`).join(' ') || 'no point'} at ${a}, expected ${e.to}`);
  }
  for (const [idx, items] of localIndex) {
    const a = anchor(idx);
    if (!items.some((p) => p.u === a && near([p.la, p.ln], [tlat, tlng], 6e-4))) continue;
    indexChecks++;
    const body = await get(idx);
    let live = null; try { live = JSON.parse(body); } catch { live = null; }
    if (!live) { bad(`${label}: ${idx} not ${LOCAL ? 'readable' : 'live'}`); continue; }
    const mine = live.filter((p) => p.u === a);
    if (mine.some((p) => near([p.la, p.ln], [tlat, tlng], 6e-4)) && !mine.some((p) => near([p.la, p.ln], [plat, plng], 6e-4))) pass++;
    else bad(`${label}: ${idx} has ${mine.map((p) => `${p.la},${p.ln}`).join(' ') || 'no point'} at ${a}, expected ${e.to}`);
  }
}
console.log(`pages ${pageChecks} · hub maps ${hubChecks} · near-me index ${indexChecks}`);
console.log(fail ? `${fail} block-move check(s) failed · ${pass} passed` : `all ${pass} block-move checks passed (${LOCAL ? 'astro/dist' : SITE}) · ${fixes.length} moved block(s)`);
process.exit(fail ? 1 : 0);

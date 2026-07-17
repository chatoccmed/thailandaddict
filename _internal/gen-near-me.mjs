// Build the compact geo-index that powers /near-me (and /en/near-me).
// Source = the existing public feeds (they already carry lat/lng + the fields we
// need). We emit a slim index (short keys, only geo-tagged places) so the tool
// page downloads ~1/3 of the raw feeds. Runs from prebuild AND standalone:
//   node _internal/gen-near-me.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const num = (v) => { const n = typeof v === 'number' ? v : parseFloat(v); return Number.isFinite(n) ? n : null; };
const rd = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return []; } };
const arr = (f) => (Array.isArray(f) ? f : (f.items || Object.values(f)[0] || []));
// feed urls are absolute (https://thailandaddict.com/... or .../en/...) — store the relative path so the
// page can link with a plain leading-slash href (keeps /en/ for the EN twin).
const rel = (u) => String(u || '').replace(/^https?:\/\/[^/]+/, '') || '';
// Thailand bbox sanity guard — drop entries with obviously-bad coords.
const inTH = (la, ln) => la != null && ln != null && la > 5 && la < 21 && ln > 96 && ln < 106;

function build(suffix) {
  // EN feeds live alongside the TH ones as feeds/<name>-en.json (not en/feeds/).
  const feed = (name) => arr(rd(path.join(PUB, 'feeds', name + suffix + '.json')));
  const out = [];
  let dropped = 0;
  for (const h of feed('hotels')) {
    const la = num(h.lat), ln = num(h.lng);
    if (!inTH(la, ln)) { dropped++; continue; }
    out.push({ t: 's', n: h.name, la, ln, u: rel(h.url), i: h.img || '', c: h.city || '', p: h.price || '', sc: h.score || null, bk: h.agoda || '' });
  }
  for (const a of feed('attractions')) {
    const la = num(a.lat), ln = num(a.lng);
    if (!inTH(la, ln)) { dropped++; continue; }
    out.push({ t: 'a', n: a.name, la, ln, u: rel(a.url), i: a.img || '', c: a.city || '' });
  }
  for (const e of feed('restaurants')) {
    const la = num(e.lat), ln = num(e.lng);
    if (!inTH(la, ln)) { dropped++; continue; }
    out.push({ t: 'e', n: e.name, la, ln, u: rel(e.url || e.listUrl), i: '', c: e.province || '', p: e.price || '', sc: e.rating || null, ft: e.foodType || '' });
  }
  return { out, dropped };
}

let total = 0;
for (const [suffix, outDir, label] of [['', PUB, 'th'], ['-en', path.join(PUB, 'en'), 'en']]) {
  const { out, dropped } = build(suffix);
  const dst = path.join(outDir, 'near-me-index.json');
  fs.writeFileSync(dst, JSON.stringify(out));
  const by = out.reduce((m, x) => ((m[x.t] = (m[x.t] || 0) + 1), m), {});
  console.log(`[${label}] ${out.length} places → ${path.relative(ROOT, dst)} (stay ${by.s || 0} · eat ${by.e || 0} · see ${by.a || 0} · dropped ${dropped}) ${(fs.statSync(dst).size / 1024).toFixed(0)}KB`);
  total = out.length;
}
export default total;

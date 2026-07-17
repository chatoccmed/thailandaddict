#!/usr/bin/env node
// Deep data-validity audit across ALL collections (beyond structural audit-all.mjs).
// Checks: coordinate sanity (in Thailand) · rating ranges · affiliate IDs on reviews · duplicate slugs
//         · broken internal links (crumb/related/rail/reviewUrl) · future/invalid dates.
import fs from 'node:fs';
const ROOT = 'astro/src/content', PUB = 'astro/public';
const cols = { reviews: `${ROOT}/reviews`, roundups: `${ROOT}/roundups`, articles: `${ROOT}/articles` };
// Thailand bounds (generous): lat 5.5–20.6, lng 97.3–105.7
const inTH = (la, ln) => typeof la === 'number' && typeof ln === 'number' && la >= 5.5 && la <= 20.7 && ln >= 97.0 && ln <= 106.0;
const slugOf = h => String(h || '').replace(/^.*\//, '').replace(/\.html.*$/, '').replace(/[?#].*$/, '').replace(/^\//, '');
// resolvable set
const exists = new Set();
for (const [k, d] of Object.entries(cols)) for (const f of fs.readdirSync(d)) if (f.endsWith('.json')) exists.add(f.replace(/\.json$/, ''));
for (const f of fs.readdirSync(PUB)) if (f.endsWith('.html')) exists.add(f.replace(/\.html$/, ''));
const resolves = href => { const s = slugOf(href); if (!s) return true; if (/^https?:/.test(href) && !/thailandaddict/.test(href)) return true; return exists.has(s); };
const NOW = 20260705; const dnum = s => { const p = String(s || '').split('-'); return p.length === 3 ? parseInt(p[0] + p[1].padStart(2, '0') + p[2].padStart(2, '0')) : 0; };

const issues = [];
const seenSlug = {};
// walk every doc, collect lat/lng + slug + links
for (const [col, d] of Object.entries(cols)) {
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    let a; try { a = JSON.parse(fs.readFileSync(`${d}/${f}`, 'utf8')); } catch { issues.push(`${col}/${f} :: BROKEN JSON`); continue; }
    // duplicate slug across collections
    if (a.slug) { (seenSlug[a.slug] = seenSlug[a.slug] || []).push(col + '/' + f); }
    const txt = JSON.stringify(a);
    // coordinate sanity — top-level + nested blocks/entries
    const checkGeo = (la, ln, where) => { if ((la != null || ln != null) && !inTH(la, ln)) issues.push(`${col}/${f} :: COORD out-of-TH ${where} (${la},${ln})`); };
    if (a.lat != null || a.lng != null) checkGeo(a.lat, a.lng, 'top');
    for (const b of (a.blocks || [])) if (b.lat != null || b.lng != null) checkGeo(b.lat, b.lng, `block ${b.name || b.rank || ''}`.slice(0, 40));
    // rating ranges (reviews score 0–10; venue rating 0–5)
    if (col === 'reviews' && a.score != null && (a.score < 0 || a.score > 10)) issues.push(`${col}/${f} :: SCORE out-of-range ${a.score}`);
    for (const b of (a.blocks || [])) if (b.kind === 'restaurant' && b.rating != null && (b.rating < 0 || b.rating > 5)) issues.push(`${col}/${f} :: venue rating out-of-range ${b.name}=${b.rating}`);
    // affiliate on reviews — only flag when the provider link EXISTS but is missing its ID (a hotel not on
    // Agoda/Trip legitimately has no such link → not a defect).
    if (col === 'reviews') {
      if (/agoda\.com\/[^"]*\.html/.test(txt) && !/agoda\.com[^"]*cid=1965862/.test(txt)) issues.push(`${col}/${f} :: Agoda link missing cid`);
      if (/trip\.com\/[^"]*hotel/.test(txt) && !/trip\.com[^"]*Allianceid=6861268/.test(txt)) issues.push(`${col}/${f} :: Trip link missing Allianceid`);
    }
    // future/invalid publishedDate
    const pd = dnum(a.publishedDate); if (pd && pd > NOW) issues.push(`${col}/${f} :: future publishedDate ${a.publishedDate}`);
    // broken internal links: crumbCityHref, related[], rail[]
    if (a.crumbCityHref && !resolves(a.crumbCityHref)) issues.push(`${col}/${f} :: crumb BROKEN ${slugOf(a.crumbCityHref)}`);
    for (const r of (a.related || [])) { const h = r.href || r.url || r; if (!resolves(h)) issues.push(`${col}/${f} :: related BROKEN ${slugOf(h)}`); }
    for (const r of (a.rail || [])) { const h = r.href || r.url || r; if (!resolves(h)) issues.push(`${col}/${f} :: rail BROKEN ${slugOf(h)}`); }
  }
}
// duplicate slugs
for (const [s, files] of Object.entries(seenSlug)) if (files.length > 1) issues.push(`DUP SLUG "${s}" :: ${files.join(', ')}`);

const groups = {};
for (const i of issues) { const k = i.includes('::') ? i.split('::')[1].trim().split(/[ (]/)[0] : i.split(' ')[0]; groups[k] = (groups[k] || 0) + 1; }
console.log(`data-validity: issues ${issues.length}`);
console.log('by type:', JSON.stringify(groups));
fs.writeFileSync('_internal/qa/DATA-VALIDITY-AUDIT.txt', issues.join('\n') + '\n');
if (issues.length) { console.log('\nfirst 40:'); issues.slice(0, 40).forEach(i => console.log('  ' + i)); }
console.log('\nwrote _internal/qa/DATA-VALIDITY-AUDIT.txt');

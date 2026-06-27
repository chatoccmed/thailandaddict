#!/usr/bin/env node
// Per-ย่าน template + data-integrity audit for hotel/value roundups (run before deploy).
// Checks: schema-complete entries (all required keys non-empty), reviewUrl targets exist
// (TH→reviews/, EN→reviews-en/), bookingUrl/agodaUrl/tripUrl present + affiliate IDs,
// img on disk, storyHtml substantial, top-level toc/compare/advice/faq present.
// Usage: node _internal/wf/audit-roundup.mjs <area>   (e.g. on-nut)  [hotelSlug valueSlug]
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '../..');
const C = p => path.join(ROOT, 'astro/src/content', p);
const PUB = path.join(ROOT, 'astro/public');
const AREA = process.argv[2];
if (!AREA) { console.error('need <area>'); process.exit(1); }
const HOTEL = process.argv[3] || `top10-hotels-${AREA}-bangkok`;
const VALUE = process.argv[4] || `top5-love-hotels-${AREA}-bangkok`;

const exImg = s => { if (!s) return false; if (/^https?:\/\//.test(s)) return true; return fs.existsSync(path.join(PUB, String(s).replace(/^\//, ''))); };
const revExists = (href, isEn) => { const s = String(href || '').replace(/\.html$/, '').replace(/^\/en\//, '').replace(/^\//, ''); return fs.existsSync(C((isEn ? 'reviews-en/' : 'reviews/') + s + '.json')); };
const ENTRY = ['id','rank','rankColor','type','name','score','stars','revCount','img','priceBig','rooms','agodaUrl','bookingUrl','tripUrl','reviewUrl','tags','addr','storyHtml','pros','cons'];
const TOP = ['toc','compareTitle','compareCols','compareRows','adviceTitle','advice','faqTitle','faq'];
const issues = [];
function audit(slug) {
  for (const [d, isEn] of [['roundups', false], ['roundups-en', true]]) {
    const p = C(`${d}/${slug}.json`); const T = `${isEn ? 'EN' : 'TH'}/${slug}`;
    if (!fs.existsSync(p)) { issues.push(`${T}: FILE MISSING`); continue; }
    let a; try { a = JSON.parse(fs.readFileSync(p, 'utf8')); } catch (e) { issues.push(`${T}: JSON-ERR ${e.message.slice(0, 50)}`); continue; }
    for (const k of TOP) if (a[k] == null) issues.push(`${T}: missing top-level "${k}"`);
    if (Array.isArray(a.faq) && a.faq.length < 5) issues.push(`${T}: faq only ${a.faq.length}`);
    (a.entries || []).forEach((e, i) => {
      const N = `${T} #${i + 1}(${(e.name || '').slice(0, 16)})`;
      for (const k of ENTRY) if (e[k] == null || (typeof e[k] === 'string' && !e[k].trim()) || (Array.isArray(e[k]) && !e[k].length)) issues.push(`${N}: empty "${k}"`);
      if (e.score != null && typeof e.score !== 'number' && isNaN(parseFloat(e.score))) issues.push(`${N}: score not numeric`);
      if (e.storyHtml && e.storyHtml.replace(/<[^>]+>/g, '').length < 150) issues.push(`${N}: storyHtml too short`);
      if (e.reviewUrl && !revExists(e.reviewUrl, isEn)) issues.push(`${N}: reviewUrl 404 (${e.reviewUrl})`);
      if (e.agodaUrl && !/cid=1965862/.test(e.agodaUrl)) issues.push(`${N}: agodaUrl no affiliate cid`);
      if (e.tripUrl && !/Allianceid=6861268/.test(e.tripUrl)) issues.push(`${N}: tripUrl no Allianceid`);
      if (e.bookingUrl && !/booking\.com/.test(e.bookingUrl)) issues.push(`${N}: bookingUrl not booking.com`);
      if (e.img && exImg(e.img) === false) issues.push(`${N}: img not on disk (${e.img})`);
    });
  }
}
audit(HOTEL); audit(VALUE);
if (!issues.length) console.log(`✅ AUDIT PASS ${AREA}: ${HOTEL} + ${VALUE} (TH+EN) — schema-complete, reviewUrls resolve, affiliate IDs present, images on disk, storyHtml substantial`);
else { console.log(`⚠ AUDIT ${AREA}: ${issues.length} issue(s):`); issues.forEach(x => console.log('  - ' + x)); process.exitCode = 1; }

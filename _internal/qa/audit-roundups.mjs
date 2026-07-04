#!/usr/bin/env node
// Roundup integrity audit (script-based, no web) — cross-check every roundup entry against its linked review.
// Checks: entry.reviewUrl resolves · name matches review · score matches (±0.3) · img matches review hero
//         · no duplicate hotels · entries==compareRows==toc · affiliate IDs · ban-words · EN twin (parity + zero raw Thai).
// Usage: node _internal/qa/audit-roundups.mjs [--fix]  (--fix auto-corrects score/img mismatches to the review's value)
import fs from 'node:fs';
const FIX = process.argv.includes('--fix');
const ROOT = 'astro/src/content';
const rdDir = `${ROOT}/roundups`, rdEnDir = `${ROOT}/roundups-en`, revDir = `${ROOT}/reviews`;
const BAN = ['ตอบโจทย์', 'โดดเด่น', 'ครบครัน', 'ระดับโลก', 'สุดยอด', 'อันซีน'];
const RAWTHAI = /[ก-ฺเ-๛]/;
const slugOf = h => String(h || '').replace(/^.*\//, '').replace(/\.html.*$/, '').replace(/[?#].*$/, '');
const rev = slug => { try { return JSON.parse(fs.readFileSync(`${revDir}/${slug}.json`, 'utf8')); } catch { return null; } };
const num = s => { const m = String(s).match(/[0-9]+(\.[0-9]+)?/); return m ? parseFloat(m[0]) : null; };
const hasRawThai = o => { let n = 0; (function s(x){ if (typeof x === 'string') { if (RAWTHAI.test(x.replace(/฿/g,''))) n++; } else if (Array.isArray(x)) x.forEach(s); else if (x && typeof x === 'object') Object.values(x).forEach(s); })(o); return n; };

let files = 0, entriesN = 0, fixed = 0;
const issues = [];
for (const f of fs.readdirSync(rdDir)) {
  if (!f.endsWith('.json')) continue;
  files++;
  let a; try { a = JSON.parse(fs.readFileSync(`${rdDir}/${f}`, 'utf8')); } catch { issues.push(`${f} :: BROKEN JSON`); continue; }
  const txt = JSON.stringify(a);
  for (const w of BAN) if (txt.includes(w)) issues.push(`${f} :: BAN:${w}`);
  const entries = a.entries || [];
  // structural parity
  if (a.compareRows && a.compareRows.length !== entries.length) issues.push(`${f} :: entries(${entries.length})!=compareRows(${a.compareRows.length})`);
  if (a.toc && a.toc.length !== entries.length) issues.push(`${f} :: entries(${entries.length})!=toc(${a.toc.length})`);
  // per-entry cross-check
  const seen = new Set();
  let changed = false;
  for (const e of entries) {
    entriesN++;
    const slug = slugOf(e.reviewUrl || e.reviewHref || e.href);
    if (!slug || !/^review-/.test(slug)) { if (e.reviewUrl) issues.push(`${f} :: [${e.name}] reviewUrl not a review slug: ${e.reviewUrl}`); continue; }
    if (seen.has(slug)) issues.push(`${f} :: DUPLICATE hotel ${slug}`);
    seen.add(slug);
    const r = rev(slug);
    if (!r) { issues.push(`${f} :: [${e.name}] reviewUrl → MISSING review ${slug}`); continue; }
    // name match (loose: entry name should appear in review name or vice versa)
    const en = (e.name || '').toLowerCase().trim(), rn = (r.name || '').toLowerCase().trim();
    if (en && rn && !en.includes(rn) && !rn.includes(en) && rn.slice(0, 12) !== en.slice(0, 12)) issues.push(`${f} :: NAME mismatch entry="${e.name}" review="${r.name}" (${slug})`);
    // score match ±0.3
    const es = num(e.score), rs = num(r.score);
    if (es != null && rs != null && Math.abs(es - rs) > 0.3) {
      issues.push(`${f} :: SCORE entry=${es} review=${rs} (${slug})${FIX ? ' → fixed' : ''}`);
      if (FIX) { e.score = String(r.score); changed = true; fixed++; }
    }
    // img match to review hero
    const eh = String(e.img || '').replace(/^https?:\/\/[^/]+\//, ''), rh = String(r.heroImg || '').replace(/^https?:\/\/[^/]+\//, '');
    if (eh && rh && eh !== rh) {
      issues.push(`${f} :: IMG entry=${eh} reviewHero=${rh} (${slug})${FIX ? ' → fixed' : ''}`);
      if (FIX) { e.img = r.heroImg; changed = true; fixed++; }
    }
    // affiliate IDs (domain-aware: only flag real agoda.com / trip.com|traveloka links missing the ID;
    // entries whose slot holds an alternate provider — e.g. booking.com — are a labeling quirk, not a defect)
    if (/agoda\.com/.test(e.agodaUrl || '') && !/cid=1965862/.test(e.agodaUrl)) issues.push(`${f} :: [${e.name}] Agoda no cid`);
    if (/(trip\.com|traveloka)/.test(e.tripUrl || '') && !/Allianceid=6861268/.test(e.tripUrl)) issues.push(`${f} :: [${e.name}] Trip no Allianceid`);
  }
  if (FIX && changed) { fs.writeFileSync(`${rdDir}/${f}`, JSON.stringify(a, null, 2) + '\n'); JSON.parse(fs.readFileSync(`${rdDir}/${f}`, 'utf8')); }
  // EN twin
  const ep = `${rdEnDir}/${f}`;
  if (!fs.existsSync(ep)) issues.push(`${f} :: EN twin MISSING`);
  else { try { const en = JSON.parse(fs.readFileSync(ep, 'utf8')); const t = hasRawThai(en); if (t > 0) issues.push(`${f} :: EN raw-Thai leaks: ${t}`); if ((en.entries || []).length !== entries.length) issues.push(`${f} :: EN entries(${(en.entries||[]).length})!=TH(${entries.length})`); } catch { issues.push(`${f} :: EN BROKEN JSON`); } }
}

console.log(`roundups: ${files} files · ${entriesN} entries · issues: ${issues.length}${FIX ? ` · auto-fixed: ${fixed}` : ''}`);
const groups = {};
for (const i of issues) { const k = i.split('::')[1].trim().split(/[ :]/)[0]; groups[k] = (groups[k] || 0) + 1; }
console.log('by type:', JSON.stringify(groups));
fs.writeFileSync('_internal/qa/ROUNDUP-AUDIT.txt', issues.join('\n') + '\n');
if (issues.length) { console.log('\nfirst 40:'); issues.slice(0, 40).forEach(i => console.log('  ' + i)); }
console.log('\nwrote _internal/qa/ROUNDUP-AUDIT.txt');

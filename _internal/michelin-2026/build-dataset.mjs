// Assemble the final MICHELIN Guide Thailand 2026 dataset from:
//   raw.json        — merged multi-source scrape (canonical roster = records whose sources include the official
//                     guide.michelin.com listing pages: "list-pN"/"listing"; 485 cards = 43 stars + 137 Bib + 305 Selected)
//   enrichment.json — per-province Thai-name pairing + NEW flags + spelling corrections (agent-verified)
// Usage: node _internal/michelin-2026/build-dataset.mjs <enrichment.json>
// Writes: michelin-2026.json (dataset) + REPORT.md (readable, Thai) in this folder.
import fs from 'node:fs';
import path from 'node:path';

const DIR = path.resolve(import.meta.dirname);
const raw = JSON.parse(fs.readFileSync(path.join(DIR, 'raw.json'), 'utf8'));
const enrichPath = process.argv[2];
const enrich = enrichPath ? JSON.parse(fs.readFileSync(enrichPath, 'utf8')) : { provinces: [], selectedFixes: null };

const norm = (s) => String(s || '').toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').replace(/\s+/g, ' ').trim();
const fromListing = (r) => (r.sources || []).some((s) => /^list-p|^listing$/.test(s));
const isThai = (s) => /[฀-๿]/.test(s || '');
const d = raw.data;

// ---- canonical rosters = official-listing cards only ----
const strip = (r) => ({ name: r.name, nameThai: r.nameThai || '', tier: r.tier, city: r.city || '', province: (r.province || r.city || '').trim(), cuisine: r.cuisine || '', status: r.status || '', greenStar: !!r.greenStar, url: r.url || '' });
let s3 = d.threeStar.filter(fromListing).map(strip);
let s2 = d.twoStar.filter(fromListing).map(strip);
let s1 = d.oneStar.filter(fromListing).map(strip);
let bib = d.bib.filter(fromListing).map(strip);
let sel = d.selected.filter(fromListing).map(strip);

// ---- 1-star: replace Thai-script display names with their official EN twins (merged records carry official data) ----
const enTwins = d.oneStar.filter((r) => !fromListing(r));
s1 = s1.map((r) => {
  if (!isThai(r.name)) return r;
  // find EN twin among non-listing one-star records via known pairs or nameThai equality
  const twin = enTwins.find((t) => norm(t.nameThai || '') === norm(r.name)) ||
    (norm(r.name) === norm('ฮาโอมา') ? enTwins.find((t) => t.name === 'Haoma') : null) ||
    (norm(r.name) === norm('อิกนีฟ') ? enTwins.find((t) => t.name === 'Igniv') : null);
  if (twin) return { ...strip(twin), tier: '1-star', nameThai: r.name, url: r.url || twin.url || '' };
  return r; // leave as-is, flagged below
});
// carry official status/nameThai onto star rosters from official-article records
for (const [roster, src] of [[s3, d.threeStar], [s2, d.twoStar], [s1, d.oneStar]]) {
  for (const r of roster) {
    const off = src.find((t) => !fromListing(t) && norm(t.name) === norm(r.name)) || src.find((t) => norm(t.name) === norm(r.name) && t.status);
    if (off) { r.status = r.status || off.status || ''; r.nameThai = r.nameThai || off.nameThai || ''; r.cuisine = r.cuisine || off.cuisine || ''; }
  }
}

// ---- apply Bib enrichment (per province) ----
const unmatchedEnrich = [];
let newFlags = 0, thaiPaired = 0;
for (const p of enrich.provinces || []) {
  for (const row of p.roster || []) {
    const hit = bib.find((r) => r.province === p.province && norm(r.name) === norm(row.name));
    if (!hit) { unmatchedEnrich.push(`${p.province}: ${row.name}`); continue; }
    if (row.nameThai && !isThai(hit.name)) { hit.nameThai = hit.nameThai || row.nameThai; }
    if (row.nameThai && isThai(hit.name) && row.nameCorrected) { hit.nameThai = hit.nameThai || row.nameThai || hit.name; }
    if (row.nameCorrected && row.nameCorrected.trim() && norm(row.nameCorrected) !== norm(hit.name)) {
      hit.nameOnListing = hit.name; hit.name = row.nameCorrected.trim();
    } else if (row.nameCorrected && isThai(hit.name)) { hit.nameThai = hit.nameThai || hit.name; hit.name = row.nameCorrected.trim(); }
    if (row.status === 'NEW') { hit.status = 'NEW'; newFlags++; }
    if (row.cuisine && !hit.cuisine) hit.cuisine = row.cuisine;
    if (hit.nameThai) thaiPaired++;
  }
}
// ---- selected: 3 Thai-display-name fixes ----
for (const row of (enrich.selectedFixes && enrich.selectedFixes.roster) || []) {
  const hit = sel.find((r) => norm(r.name) === norm(row.name));
  if (hit && row.nameCorrected && row.nameCorrected.trim()) { hit.nameThai = row.nameThai || hit.name; hit.nameOnListing = hit.name; hit.name = row.nameCorrected.trim(); }
}

// ---- Green Star overlay (verified list of 5) ----
const greens = (d.green || []).map((g) => g.name);
const greenApplied = [];
for (const g of d.green || []) {
  let found = null, where = '';
  for (const [roster, label] of [[s3, '3-star'], [s2, '2-star'], [s1, '1-star'], [bib, 'bib'], [sel, 'selected']]) {
    const hit = roster.find((r) => norm(r.name) === norm(g.name));
    if (hit) { hit.greenStar = true; found = hit; where = label; break; }
  }
  greenApplied.push({ name: g.name, tier: where || 'NOT FOUND IN ROSTER', city: g.city || g.province || '', cuisine: g.cuisine || '' });
}

// ---- validation ----
const problems = [];
if (s3.length !== 2) problems.push(`3-star ${s3.length}≠2`);
if (s2.length !== 8) problems.push(`2-star ${s2.length}≠8`);
if (s1.length !== 33) problems.push(`1-star ${s1.length}≠33`);
if (bib.length !== 137) problems.push(`bib ${bib.length}≠137`);
if (sel.length !== 305) problems.push(`selected ${sel.length}≠305 (live-guide count)`);
if (greenApplied.some((g) => g.tier === 'NOT FOUND IN ROSTER')) problems.push('green star name(s) not found in roster: ' + greenApplied.filter((g) => g.tier === 'NOT FOUND IN ROSTER').map((g) => g.name).join(', '));
for (const r of [...s1, ...bib, ...sel]) if (isThai(r.name)) problems.push(`still Thai-script primary name: ${r.name} (${r.tier})`);
const dupCheck = new Map();
for (const r of [...s3, ...s2, ...s1, ...bib, ...sel]) { const k = norm(r.name) + '|' + r.province; if (dupCheck.has(k)) problems.push(`duplicate: ${r.name} (${r.province})`); dupCheck.set(k, 1); }

const dataset = {
  edition: 'MICHELIN Guide Thailand 2026',
  announced: '2025-11-27 (Bib Gourmand pre-announced 2025-11-20)',
  asOf: 'live guide.michelin.com scrape 2026-07 — 485 venues (= 468 announced + monthly additions, all in Selected tier)',
  announcedCounts: { threeStar: 2, twoStar: 8, oneStar: 33, bib: 137, selected: 288, green: 5, total: 468 },
  liveCounts: { threeStar: s3.length, twoStar: s2.length, oneStar: s1.length, bib: bib.length, selected: sel.length, green: greenApplied.length, total: s3.length + s2.length + s1.length + bib.length + sel.length },
  sources: [
    'https://guide.michelin.com/en/th/restaurants (official listing, 11 pages, all 485 cards)',
    'https://guide.michelin.com/th/en/article/michelin-guide-ceremony/full-list-michelin-stars-michelin-guide-thailand-2026',
    'https://www.michelin.com/en/publications/products-and-services/thailand-shines-brighter-with-10-new-michelin-star-restaurants',
    'official Bib Gourmand announcement 2025-11-20 + Thai/EN media full lists (Thai names)',
  ],
  problems,
  enrichmentGaps: { unmatchedEnrichRows: unmatchedEnrich, bibNewFlags: newFlags, bibWithThaiName: bib.filter((r) => r.nameThai).length },
  threeStar: s3, twoStar: s2, oneStar: s1, bibGourmand: bib, greenStar: greenApplied, selected: sel,
};
fs.writeFileSync(path.join(DIR, 'michelin-2026.json'), JSON.stringify(dataset, null, 1));

// ---- readable report (Thai) ----
const flag = (r) => (r.status === 'NEW' ? ' 🆕' : /PROMOTED/i.test(r.status || '') ? ' ⬆️' : '') + (r.greenStar ? ' 🌿' : '');
const line = (r) => `- **${r.name}**${r.nameThai && norm(r.nameThai) !== norm(r.name) ? ' (' + r.nameThai + ')' : ''}${flag(r)} — ${r.cuisine || '?'}${r.status && r.status !== 'NEW' ? ' · ' + r.status : ''}`;
const byProv = (arr) => { const m = {}; for (const r of arr) (m[r.province || '?'] = m[r.province || '?'] || []).push(r); return Object.entries(m).sort((a, b) => b[1].length - a[1].length); };
let md = `# MICHELIN Guide Thailand 2026 — dataset ฉบับเต็ม\n\n> ประกาศ 27 พ.ย. 2025 (Bib 20 พ.ย.) · ข้อมูล ณ ก.ค. 2026 จาก listing ทางการ (485 ร้าน = 468 ตอนประกาศ + ร้าน Selected ที่เพิ่มรายเดือน)\n> counts: ⭐⭐⭐ ${s3.length} · ⭐⭐ ${s2.length} · ⭐ ${s1.length} · Bib ${bib.length} · 🌿 ${greenApplied.length} · Selected ${sel.length}\n${problems.length ? '\n> ⚠️ PROBLEMS: ' + problems.join(' | ') + '\n' : ''}\n`;
md += `\n## ⭐⭐⭐ สามดาว (${s3.length})\n` + s3.map(line).join('\n') + '\n';
md += `\n## ⭐⭐ สองดาว (${s2.length})\n` + s2.map(line).join('\n') + '\n';
md += `\n## ⭐ หนึ่งดาว (${s1.length})\n`;
for (const [p, rs] of byProv(s1)) md += `\n**${p}** (${rs.length})\n` + rs.map(line).join('\n') + '\n';
md += `\n## 🌿 MICHELIN Green Star (${greenApplied.length})\n` + greenApplied.map((g) => `- **${g.name}** — ${g.tier} · ${g.city}`).join('\n') + '\n';
md += `\n## 🍽️ Bib Gourmand (${bib.length} · 🆕 ${bib.filter((r) => r.status === 'NEW').length} ร้านใหม่ · มีชื่อไทย ${bib.filter((r) => r.nameThai).length})\n`;
for (const [p, rs] of byProv(bib)) md += `\n### ${p} (${rs.length})\n` + rs.map(line).join('\n') + '\n';
md += `\n## ▫️ MICHELIN Selected (${sel.length} — live guide; ตอนประกาศ 288)\n`;
for (const [p, rs] of byProv(sel)) md += `\n### ${p} (${rs.length})\n` + rs.map((r) => `- ${r.name}${r.nameThai ? ' (' + r.nameThai + ')' : ''} — ${r.cuisine || '?'}`).join('\n') + '\n';
fs.writeFileSync(path.join(DIR, 'REPORT.md'), md);

console.log('counts:', JSON.stringify(dataset.liveCounts));
console.log('bib NEW flags:', newFlags, '· bib w/ Thai name:', dataset.enrichmentGaps.bibWithThaiName, '/137');
console.log('unmatched enrichment rows:', unmatchedEnrich.length, unmatchedEnrich.slice(0, 8).join(' ; '));
console.log('problems:', problems.length ? problems.join(' | ') : 'NONE');
console.log('wrote michelin-2026.json + REPORT.md');

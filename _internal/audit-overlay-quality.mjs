// Content-quality audit for _internal/overlay-data/*.json (run after validate, before/after generate).
// Surfaces issues validate-overlay-data.mjs doesn't: repetitive bestFor, copy-paste/short why, price
// inversions, TH↔EN distance-mode mismatch (walk vs drive), star/price sanity, cross-page duplicate hotels,
// extra AI-ish phrasing. Read-only, advisory. Usage: node _internal/audit-overlay-quality.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const DATA = path.join(ROOT, '_internal/overlay-data');
const files = fs.readdirSync(DATA).filter(f => f.endsWith('.json') && !f.startsWith('_')).sort();
const recs = files.map(f => JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8')));

// soft AI/cliché phrases to flag (beyond the hard-banned set) — review, not auto-fail
const SOFT = ['ลงตัว', 'คุ้มค่า', 'สะดวกสบาย', 'ครบครัน', 'หลากหลาย', 'มากมาย', 'นานาชนิด', 'ที่ดีที่สุด', 'สุดยอด', 'น่าประทับใจ', 'ประทับใจ', 'ดีเยี่ยม', 'เลิศ'];
const priceNum = p => +String(p).replace(/[^\d]/g, '');
let issues = 0; const out = [];
const flag = (slug, msg) => { out.push(`  ⚠ ${slug}: ${msg}`); issues++; };

const hotelIndex = {};   // name → [{slug, dist}]
for (const r of recs) {
  const s = r.slug.replace('hotels-near-', '');
  const hs = r.hotels;
  // duplicate hotel names within page
  const names = hs.map(h => h.name.toLowerCase());
  const dupe = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupe.length) flag(s, `duplicate hotel name(s): ${[...new Set(dupe)].join(', ')}`);
  // bestFor diversity
  const bf = hs.map(h => h.bestForTh);
  const bfDistinct = new Set(bf).size;
  if (bfDistinct <= Math.ceil(hs.length / 2)) flag(s, `repetitive bestForTh (${bfDistinct} distinct / ${hs.length})`);
  // why duplicate / short
  const whyT = hs.map(h => h.whyTh);
  const whyDupe = whyT.filter((w, i) => whyT.indexOf(w) !== i);
  if (whyDupe.length) flag(s, `duplicate whyTh (copy-paste) on ${whyDupe.length} hotel(s)`);
  hs.forEach(h => { if ((h.whyTh || '').length < 70) flag(s, `whyTh too short on "${h.name}" (${(h.whyTh || '').length} chars)`); });
  hs.forEach(h => { if ((h.whyEn || '').length < 70) flag(s, `whyEn too short on "${h.name}"`); });
  // price ordering (allow small noise; flag a drop > 40%)
  for (let i = 1; i < hs.length; i++) {
    const a = priceNum(hs[i - 1].priceFromTHB), b = priceNum(hs[i].priceFromTHB);
    if (b < a * 0.6) flag(s, `price inversion: ${hs[i - 1].name} ฿${hs[i - 1].priceFromTHB} → ${hs[i].name} ฿${hs[i].priceFromTHB}`);
  }
  // star / price sanity
  hs.forEach(h => {
    const p = priceNum(h.priceFromTHB);
    if (h.star >= 5 && p < 1500) flag(s, `5-star "${h.name}" at ฿${h.priceFromTHB} — verify`);
    if (h.star <= 3 && p > 4000) flag(s, `3-star "${h.name}" at ฿${h.priceFromTHB} — verify`);
  });
  // TH↔EN distance-mode mismatch (walk vs not)
  hs.forEach(h => {
    const thWalk = /เดิน/.test(h.distTh), enWalk = /walk/i.test(h.distEn);
    if (thWalk !== enWalk) flag(s, `dist mode mismatch on "${h.name}": TH="${h.distTh}" EN="${h.distEn}"`);
    if (!/\d/.test(h.distTh) && !/ใน|ติด/.test(h.distTh)) flag(s, `distTh has no number on "${h.name}": "${h.distTh}"`);
  });
  // soft AI phrasing anywhere in the record
  const blob = JSON.stringify({ q: r.quickTh, i: r.introTh, h: hs.map(x => x.whyTh + x.bestForTh), f: r.faq.map(x => x.aTh) });
  const hits = SOFT.filter(w => blob.includes(w));
  if (hits.length) flag(s, `soft AI/cliché word(s): ${hits.join(', ')}`);
  // collect for cross-page
  hs.forEach(h => { (hotelIndex[h.name] ||= []).push({ slug: s, distTh: h.distTh }); });
}

// cross-page duplicate hotels (same property near multiple anchors — expected, but eyeball distances)
const cross = Object.entries(hotelIndex).filter(([, v]) => v.length > 1);
console.log(`\nOVERLAY QUALITY AUDIT — ${recs.length} pages, ${recs.reduce((n, r) => n + r.hotels.length, 0)} hotel entries\n`);
console.log(`=== FLAGS: ${issues} ===`);
console.log(out.join('\n') || '  (none)');
console.log(`\n=== CROSS-PAGE DUPLICATE HOTELS (review distances make sense per anchor): ${cross.length} ===`);
for (const [name, v] of cross) console.log(`  ${name}: ${v.map(x => `${x.slug} [${x.distTh}]`).join('  ·  ')}`);
console.log('');

// Assemble the cafe gap-fill workflow output into the article JSONs (TH + EN twins).
//   node _internal/assemble-cafe-fill.mjs <result.json> [--apply]
// - top-ups: append verified cafes to the thematically-right ranked block, renumber
//   ranks globally, and fix count claims ("N ร้าน" / "N cafes") in title/h1/metaDesc/
//   ogTitle/ogDesc/quickAnswerHtml to the real new total.
// - new pages (samut-sakhon, koh-larn): build full TH+EN articles from the frame +
//   verified cafes, using the province cafe-guide template conventions.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const TH_DIR = path.join(ROOT, 'astro/src/content/articles');
const EN_DIR = path.join(ROOT, 'astro/src/content/articles-en');
const APPLY = process.argv.includes('--apply');
const resultPath = process.argv[2];
if (!resultPath) { console.error('usage: node assemble-cafe-fill.mjs <result.json> [--apply]'); process.exit(1); }
const results = JSON.parse(fs.readFileSync(resultPath, 'utf8'));

const BAN = /ตอบโจทย์|โดดเด่น|ครบครัน|ระดับโลก|สุดยอด|อันซีน/;
const WATER = /ริมน้ำ|ริมแม่น้ำ|ริมโขง|ริมหาด|ริมทะเล|วิวน้ำ|วิวทะเล|ริมบึง|ริมเขื่อน|ทะเลสาบ|กว๊าน|ริมคลอง|แพ|ล่องน้ำ/;
const TOWN = /ในเมือง|ตัวเมือง|ตึกเก่า|เมืองเก่า|ห้องแถว|เดินถึง|กลางเมือง|specialty|ย่านเก่า/i;
const FIELD = /ทุ่งนา|กลางนา|วิวนา|นาข้าว|สวนยาง|ในสวน|ฟาร์ม/;
const MOUNTAIN = /วิวเขา|บนเขา|เชิงเขา|ดอย|ภู(?!เก็ต)/;

const zoneOf = (txt) => WATER.test(txt) ? 'water' : FIELD.test(txt) ? 'field' : MOUNTAIN.test(txt) ? 'mountain' : TOWN.test(txt) ? 'town' : 'any';
const renumber = (article) => { let n = 0; for (const b of article.blocks) if (b.kind === 'ranked' && b.items) for (const it of b.items) it.rank = ++n; return n; };
const fixCounts = (article, total, isEn) => {
  const re = isEn ? /(\d+)\s*(cafes?|cafés?|coffee shops?|spots)/gi : /(\d+)\s*ร้าน/g;
  for (const k of ['title', 'metaDesc', 'ogTitle', 'ogDesc', 'h1', 'quickAnswerHtml']) {
    if (typeof article[k] === 'string') article[k] = article[k].replace(re, (m, d, w) => m.replace(d, String(total)));
  }
};
const pickBlock = (article, cafe) => {
  const ranked = [];
  let h2 = '';
  article.blocks.forEach((b, i) => {
    if (b.kind === 'h2') h2 = String(b.html || b.text || '').replace(/<[^>]+>/g, '');
    if (b.kind === 'ranked' && b.items) ranked.push({ i, h2, block: b });
  });
  if (!ranked.length) return null;
  if (ranked.length === 1) return ranked[0].block;
  const cz = zoneOf([cafe.metaTh, cafe.blurbTh, (cafe.tags || []).join(' ')].join(' '));
  for (const r of ranked) { if (cz !== 'any' && zoneOf(r.h2) === cz) return r.block; }
  // fallback: the block whose zone is 'any'/'town', else the largest
  return ranked.reduce((a, b) => (b.block.items.length > a.block.items.length ? b : a)).block;
};

let touched = 0, skipped = 0, report = [];
for (const r of results) {
  if (!r.verified || !r.verified.length) { report.push(`• ${r.slug}: no verified cafes (${r.note || 'no note'}) — SKIPPED`); skipped++; continue; }
  const banned = r.verified.filter((c) => BAN.test(c.blurbTh + c.metaTh));
  if (banned.length) { report.push(`• ${r.slug}: BAN WORD in ${banned.map((b) => b.name).join(', ')} — needs rewrite, SKIPPED`); skipped++; continue; }

  if (r.isNew) { report.push(`• ${r.slug}: NEW PAGE with ${r.verified.length} cafes — assembled separately`); continue; }

  const thPath = path.join(TH_DIR, r.slug + '.json'), enPath = path.join(EN_DIR, r.slug + '.json');
  const th = JSON.parse(fs.readFileSync(thPath, 'utf8')), en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  // EN twin must have the same ranked geometry for index-parallel insertion
  const thRanked = th.blocks.map((b, i) => (b.kind === 'ranked' ? i : -1)).filter((i) => i >= 0);
  const enRanked = en.blocks.map((b, i) => (b.kind === 'ranked' ? i : -1)).filter((i) => i >= 0);
  if (thRanked.length !== enRanked.length) { report.push(`• ${r.slug}: TH/EN ranked-block count mismatch — SKIPPED`); skipped++; continue; }

  for (const cafe of r.verified) {
    const blk = pickBlock(th, cafe);
    const blkIdx = th.blocks.indexOf(blk);
    const enBlk = en.blocks[enRanked[thRanked.indexOf(blkIdx)]];
    blk.items.push({ rank: 0, name: cafe.name, blurb: cafe.blurbTh, meta: cafe.metaTh, ...(cafe.price ? { price: cafe.price } : {}), tags: cafe.tags });
    enBlk.items.push({ rank: 0, name: cafe.name, blurb: cafe.blurbEn, meta: cafe.metaEn, ...(cafe.price ? { price: cafe.price } : {}), tags: cafe.tags.map((t) => t) });
    report.push(`  + ${r.slug} ← "${cafe.name}" → block[${blkIdx}] "${(th.blocks[blkIdx - 1]?.html || '').replace(/<[^>]+>/g, '').slice(0, 30)}"`);
  }
  const total = renumber(th); renumber(en);
  fixCounts(th, total, false); fixCounts(en, total, true);
  th.modifiedDate = en.modifiedDate = '2026-07-06';
  if (APPLY) {
    fs.writeFileSync(thPath, JSON.stringify(th, null, 2) + '\n');
    fs.writeFileSync(enPath, JSON.stringify(en, null, 2) + '\n');
  }
  touched++;
  report.push(`• ${r.slug}: +${r.verified.length} → total ${total} ร้าน (counts fixed)`);
}
console.log(report.join('\n'));
console.log(`\n${APPLY ? 'APPLIED' : 'DRY-RUN'}: ${touched} pages updated · ${skipped} skipped`);

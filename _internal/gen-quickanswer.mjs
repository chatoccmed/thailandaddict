// AEO: populate quickAnswerHtml on reviews + roundups from the human-written metaDesc
// (already an answer-first 40-60w summary → zero hallucination, honest). Idempotent: skips if set.
import fs from 'node:fs';
import path from 'node:path';
const base = 'astro/src/content';
const dirs = ['reviews', 'reviews-en', 'roundups', 'roundups-en'];
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
let total = 0;
for (const d of dirs) {
  const dir = path.join(base, d);
  if (!fs.existsSync(dir)) continue;
  let n = 0, skip = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    const p = path.join(dir, f);
    let j; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (j.quickAnswerHtml && j.quickAnswerHtml.trim()) { skip++; continue; }
    const md = (j.metaDesc || '').trim();
    if (md.length < 40) { skip++; continue; }   // too thin to be a useful answer
    j.quickAnswerHtml = esc(md);
    fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n');
    n++;
  }
  console.log(`  ${d}: populated ${n}, skipped ${skip}`);
  total += n;
}
console.log(`TOTAL quickAnswerHtml populated: ${total}`);

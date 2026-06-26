// AEO: extend quick-answer to the articles collection (attraction/itinerary/food/eat-ranking/prep/guide)
// from each page's human-written metaDesc. Idempotent. Skips pages that already have a quick-answer
// OR a promoted lead-answer paragraph (ArticleLayout._leadQA: first <p> starting "<strong>คำตอบสั้น/Short answer").
import fs from 'node:fs';
import path from 'node:path';
const base = 'astro/src/content';
const dirs = ['articles', 'articles-en'];
const QA_RE = /^\s*<strong>\s*(?:คำตอบสั้น|Short answer)/i;
const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
let total = 0, byType = {};
for (const d of dirs) {
  const dir = path.join(base, d);
  if (!fs.existsSync(dir)) continue;
  let n = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    const p = path.join(dir, f);
    let a; try { a = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (a.quickAnswerHtml && a.quickAnswerHtml.trim()) continue;          // already has one
    const b0 = a.blocks && a.blocks[0];
    if (b0 && b0.kind === 'p' && QA_RE.test(b0.html || '')) continue;      // has a promoted lead-answer
    const md = (a.metaDesc || '').trim();
    if (md.length < 40) continue;
    a.quickAnswerHtml = esc(md);
    fs.writeFileSync(p, JSON.stringify(a, null, 2) + '\n');
    n++; byType[a.type] = (byType[a.type] || 0) + 1;
  }
  console.log(`  ${d}: +${n}`);
  total += n;
}
console.log('by type:', JSON.stringify(byType));
console.log(`TOTAL articles quick-answer populated: ${total}`);

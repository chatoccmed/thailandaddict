/* The Thai side already says "ลิงก์เทียบราคา 3 เว็บ" (links to compare prices on
   3 sites). The English side still says the comparison is done and past-tense —
   "Prices Compared", "compared across 3 booking sites" — which claims work the
   site does not do. It links out; the reader compares. Same for one metaDesc
   claiming we stayed at the places ourselves. Ordered longest-match-first so a
   short rule never eats the tail of a long one. */
import fs from 'node:fs';
import path from 'node:path';
const ROOT = process.cwd();
const APPLY = process.argv.includes('--apply');

const RULES = [
  ['hotels reviewed and price-compared across 3 booking sites', 'hotels reviewed, with links to compare prices on 3 booking sites'],
  ['Hotels Reviewed and Compared Across 3 Booking Sites',        'Hotels Reviewed · Compare Prices on 3 Booking Sites'],
  ['hotels reviewed and compared across 3 booking sites',        'hotels reviewed, with links to compare prices on 3 booking sites'],
  ['Hotels Compared Across 3 Booking Sites',                     'Hotels · Compare Prices on 3 Booking Sites'],
  ['prices compared across 3 booking sites',                     'links to compare prices on 3 booking sites'],
  ['hotels compared across 3 booking sites',                     'hotels, with links to compare prices on 3 booking sites'],
  [', compared across 3 booking sites',                          ', with links to compare prices on 3 booking sites'],
  ['compared across 3 booking sites',                            'with links to compare prices on 3 booking sites'],
  ['with Prices Compared',                                       'with Links to 3 Sites'],
  ['& Prices Compared',                                          '· Compare 3 Sites'],
  ['Prices Compared',                                            'Compare 3 Sites'],
  ["we've reviewed ourselves",                                   "we've written up"],
];

const DIRS = ['roundups-en','reviews-en','articles-en','roundups','reviews','articles'];
const perDir = {}, perRule = {};
let filesChanged = 0;

for (const dir of DIRS) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(d, f);
    const before = fs.readFileSync(p, 'utf8');
    let after = before;
    for (const [from, to] of RULES) {
      if (!after.includes(from)) continue;
      const n = after.split(from).length - 1;
      perRule[from] = (perRule[from] || 0) + n;
      after = after.split(from).join(to);
    }
    if (after === before) continue;
    filesChanged++; perDir[dir] = (perDir[dir] || 0) + 1;
    if (APPLY) fs.writeFileSync(p, after);
  }
}

console.log(APPLY ? 'APPLIED' : 'DRY RUN');
console.log('files changed:', filesChanged);
for (const [k, v] of Object.entries(perDir)) console.log('  ' + k + ': ' + v);
console.log('replacements:');
for (const [k, v] of Object.entries(perRule).sort((a, b) => b[1] - a[1]))
  console.log('  ' + String(v).padStart(4) + '  ' + k);

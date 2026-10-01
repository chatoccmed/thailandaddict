/* Undo what the first canonicalise-place-names.mjs broke, and nothing else.

   That version replaced English province names as plain substrings, so short
   names were replaced INSIDE other words — Saphan Taksin became "Saphan
   来兴sin", Ao Nang became "Ao 楠府g" — and inside brand names: "Hotel Bangkok"
   became "Hotel 曼谷". It wrote those into the committed snapshot pages, which
   no build regenerates, so fixing the tool alone does not fix the site.

   Ground truth is git. For every page as it stood BEFORE the canonicaliser's
   first commit (a03fe03fd^), take each reader-visible node, compute what the
   broken version made of it and what the fixed version makes of it, and where
   the two differ, swap the broken node for the fixed one in the current file.
   A node is only ever touched if it is byte-for-byte the broken output, so
   every later edit to that page survives.

   Usage: node _internal/qa/repair-canonicalise-damage.mjs <dir-with-old-astro/public> [--dry] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const OLD = process.argv[2];
const APPLY = !process.argv.includes('--dry');
if (!OLD || !fs.existsSync(path.join(OLD, 'astro/public'))) {
  console.error('usage: node _internal/qa/repair-canonicalise-damage.mjs <dir containing astro/public from a03fe03fd^> [--dry]');
  console.error('  make it with: git archive a03fe03fd^ astro/public/zh … astro/public/ar | tar -x -C <dir>');
  process.exit(2);
}
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const titleCase = (s) => s.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, (m) => '\\' + m);

/* the reader-visible scope both versions worked on */
const SKIP = /<(script|style)\b[\s\S]*?<\/\1>/gi;
const nodesOf = (html) => {
  const masked = html.replace(SKIP, ' ');
  return [...masked.matchAll(/>([^<]+)</g)].map((m) => m[1])
    .concat([...masked.matchAll(/\b(?:alt|title|aria-label)="([^"]*)"/g)].map((m) => m[1]))
    .concat([...masked.matchAll(/<meta[^>]*\b(?:name|property)="(?:description|og:title|og:description|twitter:title|twitter:description)"[^>]*\bcontent="([^"]*)"/gi)].map((m) => m[1]));
};

let totalFixed = 0, totalMissing = 0, pagesFixed = 0;
for (const lang of LANGS) {
  const prov = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8')).prov || {};
  const pairs = Object.entries(prov)
    .filter(([, v]) => v && v.n && !/^[\x00-\x7F]+$/.test(v.n))
    .map(([slug, v]) => {
      const en = titleCase(slug);
      return { en, tr: v.n, rx: new RegExp('(?<![A-Za-z0-9][\\s\\u00A0]*)' + esc(en) + '(?![\\s\\u00A0]*[A-Za-z0-9])', 'g') };
    })
    .sort((a, b) => b.en.length - a.en.length);
  const broken = (t) => { let s = t; for (const { en, tr } of pairs) if (s.includes(en)) s = s.split(en).join(tr); return s; };
  const fixed = (t) => { let s = t; for (const { rx, tr } of pairs) s = s.replace(rx, tr); return s; };

  const oldDir = path.join(OLD, 'astro/public', lang);
  const curDir = path.join(ROOT, 'astro/public', lang);
  let fixedN = 0, missing = 0, pages = 0;
  const samples = [];
  for (const f of fs.readdirSync(oldDir).filter((x) => x.endsWith('.html'))) {
    const curPath = path.join(curDir, f);
    if (!fs.existsSync(curPath)) continue;
    const swaps = new Map();
    for (const node of nodesOf(fs.readFileSync(path.join(oldDir, f), 'utf8'))) {
      const b = broken(node), g = fixed(node);
      if (b !== g) swaps.set(b, g);
    }
    if (!swaps.size) continue;
    let cur = fs.readFileSync(curPath, 'utf8');
    let hits = 0;
    for (const [b, g] of swaps) {
      /* only as a whole node or a whole attribute value — never a substring */
      const before = cur;
      cur = cur.split('>' + b + '<').join('>' + g + '<')
               .split('="' + b + '"').join('="' + g + '"');
      if (cur !== before) { hits++; if (samples.length < 4) samples.push(`${b.trim().slice(0, 40)}  →  ${g.trim().slice(0, 40)}`); }
      else missing++;
    }
    if (!hits) continue;
    fixedN += hits; pages++;
    if (APPLY) {
      fs.writeFileSync(curPath + '.tmp', cur, 'utf8');
      if (fs.readFileSync(curPath + '.tmp', 'utf8') !== cur) { console.error('readback mismatch: ' + curPath); process.exit(1); }
      fs.renameSync(curPath + '.tmp', curPath);
    }
  }
  totalFixed += fixedN; totalMissing += missing; pagesFixed += pages;
  console.log(`  ${lang}  ${fixedN} node(s) repaired on ${pages} page(s)` + (missing ? ` · ${missing} broken node(s) no longer found as-is` : ''));
  for (const s of samples) console.log(`        ${s}`);
}
console.log(`\n${totalFixed} node(s) on ${pagesFixed} page(s) ` + (APPLY ? 'repaired' : 'would be repaired (--dry)')
  + (totalMissing ? ` · ${totalMissing} not found as-is (the page changed since, or it is generated and rebuilt every build)` : ''));

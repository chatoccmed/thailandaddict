// Surgical fix: related[].href values ending in ".json" are wrong (point to /slug.json → 404).
// Convert ".json" → ".html" to match sibling related hrefs. Reports per-dir counts.
import fs from 'node:fs';
import path from 'node:path';
const base = 'astro/src/content';
const dirs = fs.readdirSync(base).filter(d => fs.statSync(path.join(base, d)).isDirectory());
let totalFiles = 0, totalFixed = 0;
for (const d of dirs) {
  const dir = path.join(base, d);
  let dirFixed = 0, dirFiles = 0;
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) {
    const p = path.join(dir, f);
    let j; try { j = JSON.parse(fs.readFileSync(p, 'utf8')); } catch { continue; }
    if (!Array.isArray(j.related)) continue;
    let changed = false;
    for (const rel of j.related) {
      if (rel && typeof rel.href === 'string' && /\.json$/.test(rel.href)) {
        rel.href = rel.href.replace(/\.json$/, '.html');
        changed = true; dirFixed++;
      }
    }
    if (changed) { fs.writeFileSync(p, JSON.stringify(j, null, 2) + '\n'); dirFiles++; }
  }
  if (dirFixed) { console.log(`  ${d}: fixed ${dirFixed} hrefs in ${dirFiles} files`); totalFixed += dirFixed; totalFiles += dirFiles; }
}
console.log(`TOTAL: ${totalFixed} dead .json hrefs fixed across ${totalFiles} files`);

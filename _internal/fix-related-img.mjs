// Fix broken related[].img references: point them at the target review's REAL heroImg
// (the image exists; the related card just used a wrong/stale filename). TH + EN.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const ex = s => s && fs.existsSync(path.join(PUB, String(s).replace(/^\//, '')));
// heroImg is locale-independent — build the map from TH reviews
const TH = path.join(ROOT, 'astro/src/content/reviews');
const heroOf = {};
for (const f of fs.readdirSync(TH).filter(x => x.endsWith('.json'))) {
  const j = JSON.parse(fs.readFileSync(path.join(TH, f), 'utf8'));
  heroOf[f.slice(0, -5)] = j.heroImg || j.image;
}
let fixed = 0, files = 0, orphan = 0;
for (const dir of ['astro/src/content/reviews', 'astro/src/content/reviews-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f);
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let changed = false;
    for (const rel of (j.related || [])) {
      if (rel.img && !ex(rel.img)) {
        const target = (rel.href || '').replace(/\.html$/, '');
        const real = heroOf[target];
        if (real && ex(real) && real !== rel.img) { rel.img = real; fixed++; changed = true; }
        else if (!(target in heroOf)) orphan++;
      }
    }
    if (changed) { fs.writeFileSync(fp, JSON.stringify(j, null, 2)); files++; }
  }
}
console.log('remapped related[].img:', fixed, '· files changed:', files, '· orphan (target missing, left as-is):', orphan);

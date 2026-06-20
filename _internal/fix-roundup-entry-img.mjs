// Roundup entries[].img pointing to a missing file → point at the linked review's
// real heroImg (via reviewUrl). Same wrong-filename root cause as related[].img. TH+EN.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const ex = s => s && fs.existsSync(path.join(PUB, String(s).replace(/^\//, '')));
const RD = path.join(ROOT, 'astro/src/content/reviews');
const heroOf = {};
for (const f of fs.readdirSync(RD).filter(x => x.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); heroOf[f.slice(0, -5)] = j.heroImg || j.image; }
let fixed = 0, files = 0, unresolved = [];
for (const dir of ['astro/src/content/roundups', 'astro/src/content/roundups-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f);
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    let changed = false;
    for (const e of (j.entries || [])) {
      if (e.img && !ex(e.img)) {
        const target = (e.reviewUrl || '').replace(/\.html$/, '');
        const real = heroOf[target];
        if (real && ex(real)) { e.img = real; fixed++; changed = true; }
        else unresolved.push(f.slice(0, -5) + ':' + e.img.replace('images/hotels/', ''));
      }
    }
    if (changed) { fs.writeFileSync(fp, JSON.stringify(j, null, 2)); files++; }
  }
}
console.log('roundup entry img remapped:', fixed, '· files:', files);
if (unresolved.length) console.log('UNRESOLVED:', [...new Set(unresolved)].join(', '));

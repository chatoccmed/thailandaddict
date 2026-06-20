// Make every related[].img (reviews) and entries[].img (roundups) equal the LINKED
// hotel's real heroImg → each "nearby hotel"/ranking card shows the correct hotel's
// canonical photo. Eliminates wrong-hotel thumbnails + filename-variant drift. TH+EN.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const ex = s => s && fs.existsSync(path.join(PUB, String(s).replace(/^\//, '')));
const RD = path.join(ROOT, 'astro/src/content/reviews');
const heroOf = {};
for (const f of fs.readdirSync(RD).filter(x => x.endsWith('.json'))) { const j = JSON.parse(fs.readFileSync(path.join(RD, f), 'utf8')); heroOf[f.slice(0, -5)] = j.heroImg || j.image; }
let rel = 0, ent = 0, files = 0;
for (const dir of ['astro/src/content/reviews', 'astro/src/content/reviews-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f); const j = JSON.parse(fs.readFileSync(fp, 'utf8')); let ch = false;
    for (const r of (j.related || [])) { const t = (r.href || '').replace(/\.html$/, ''); const h = heroOf[t]; if (h && ex(h) && r.img !== h) { r.img = h; rel++; ch = true; } }
    if (ch) { fs.writeFileSync(fp, JSON.stringify(j, null, 2)); files++; }
  }
}
for (const dir of ['astro/src/content/roundups', 'astro/src/content/roundups-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f); const j = JSON.parse(fs.readFileSync(fp, 'utf8')); let ch = false;
    for (const e of (j.entries || [])) { const t = (e.reviewUrl || '').replace(/\.html$/, ''); const h = heroOf[t]; if (h && ex(h) && e.img !== h) { e.img = h; ent++; ch = true; } }
    if (ch) { fs.writeFileSync(fp, JSON.stringify(j, null, 2)); files++; }
  }
}
console.log('canonicalized · related:', rel, '· entries:', ent, '· files:', files);

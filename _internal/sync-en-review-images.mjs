// EN review image paths must mirror TH exactly (images are locale-independent).
// Some EN translation agents altered them → broken images on EN pages. Sync from TH.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const TH = path.join(ROOT, 'astro/src/content/reviews');
const EN = path.join(ROOT, 'astro/src/content/reviews-en');
const IMG = ['heroImg', 'image', 'mapImg', 'heroSub1', 'heroSub2'];
let files = 0, fields = 0;
for (const f of fs.readdirSync(EN).filter(x => x.endsWith('.json'))) {
  if (!fs.existsSync(path.join(TH, f))) continue;
  const t = JSON.parse(fs.readFileSync(path.join(TH, f), 'utf8'));
  const e = JSON.parse(fs.readFileSync(path.join(EN, f), 'utf8'));
  let changed = false;
  for (const k of IMG) { if (t[k] !== undefined && e[k] !== t[k]) { e[k] = t[k]; fields++; changed = true; } }
  if (JSON.stringify(e.gallery || []) !== JSON.stringify(t.gallery || [])) { e.gallery = t.gallery; fields++; changed = true; }
  // related: sync img + href per index (name/loc/price stay translated)
  if (Array.isArray(e.related) && Array.isArray(t.related) && e.related.length === t.related.length) {
    e.related.forEach((rel, i) => { if (rel.img !== t.related[i].img) { rel.img = t.related[i].img; fields++; changed = true; } if (rel.href !== t.related[i].href) { rel.href = t.related[i].href; changed = true; } });
  }
  if (changed) { fs.writeFileSync(path.join(EN, f), JSON.stringify(e, null, 2)); files++; }
}
console.log('synced EN image fields from TH · files:', files, '· field changes:', fields);

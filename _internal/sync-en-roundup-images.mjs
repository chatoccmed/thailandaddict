// EN roundup image paths (image, heroImg, entries[].img) must mirror TH exactly —
// translation agents scrambled some. Sync from TH (images are locale-independent).
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const T = path.join(ROOT, 'astro/src/content/roundups');
const E = path.join(ROOT, 'astro/src/content/roundups-en');
let files = 0, fields = 0;
for (const f of fs.readdirSync(E).filter(x => x.endsWith('.json'))) {
  if (!fs.existsSync(path.join(T, f))) continue;
  const t = JSON.parse(fs.readFileSync(path.join(T, f), 'utf8'));
  const e = JSON.parse(fs.readFileSync(path.join(E, f), 'utf8'));
  let changed = false;
  for (const k of ['image', 'heroImg']) { if (t[k] !== undefined && e[k] !== t[k]) { e[k] = t[k]; fields++; changed = true; } }
  if (Array.isArray(e.entries) && Array.isArray(t.entries) && e.entries.length === t.entries.length) {
    e.entries.forEach((en, i) => { if (en.img !== t.entries[i].img) { en.img = t.entries[i].img; fields++; changed = true; } });
  }
  if (changed) { fs.writeFileSync(path.join(E, f), JSON.stringify(e, null, 2)); files++; }
}
console.log('synced EN roundup images from TH · files:', files, '· field changes:', fields);

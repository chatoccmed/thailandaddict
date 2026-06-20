// Articles whose `image` (og/schema field) points to a missing file but whose
// heroImg exists → point `image` at heroImg (the real photo). Fixes broken og:image.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const ex = s => s && fs.existsSync(path.join(PUB, String(s).replace(/^\//, '')));
let files = 0;
for (const dir of ['astro/src/content/articles', 'astro/src/content/articles-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f);
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (j.image && !ex(j.image) && j.heroImg && ex(j.heroImg) && j.image !== j.heroImg) {
      j.image = j.heroImg;
      fs.writeFileSync(fp, JSON.stringify(j, null, 2));
      files++;
    }
  }
}
console.log('articles fixed (image -> heroImg):', files);

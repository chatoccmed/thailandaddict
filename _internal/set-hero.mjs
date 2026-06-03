// Set heroImg on article JSONs to /images/cm/<slug>.jpg when that image file exists.
// Run after the image workflow. Safe to re-run.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = 'C:/Users/Imac/Thailandaddict';
const ARTDIR = path.join(ROOT, 'astro/src/content/articles');
const IMGDIR = path.join(ROOT, 'astro/public/images/cm');
let set = 0, miss = [];
for (const f of fs.readdirSync(ARTDIR).filter(x => x.endsWith('.json'))) {
  const slug = f.replace(/\.json$/, '');
  const img = `/images/cm/${slug}.jpg`;
  const has = fs.existsSync(path.join(IMGDIR, slug + '.jpg'));
  const fp = path.join(ARTDIR, f);
  const a = JSON.parse(fs.readFileSync(fp, 'utf8'));
  if (has) {
    if (a.heroImg !== img) { a.heroImg = img; fs.writeFileSync(fp, JSON.stringify(a, null, 2)); }
    set++;
  } else {
    miss.push(slug);
    if (a.heroImg) { delete a.heroImg; fs.writeFileSync(fp, JSON.stringify(a, null, 2)); }
  }
}
console.log(`heroImg set on ${set} articles · no image for ${miss.length}${miss.length ? ': ' + miss.join(',') : ''}`);

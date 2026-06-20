// Remove related[] entries whose href points to a non-existent review (orphan
// "nearby hotel" cards = dead link + missing image). TH + EN.
import fs from 'node:fs';
import path from 'node:path';
const ROOT = path.resolve(import.meta.dirname, '..');
const TH = path.join(ROOT, 'astro/src/content/reviews');
const slugs = new Set(fs.readdirSync(TH).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
let removed = 0, files = 0;
for (const dir of ['astro/src/content/reviews', 'astro/src/content/reviews-en']) {
  const d = path.join(ROOT, dir);
  for (const f of fs.readdirSync(d).filter(x => x.endsWith('.json'))) {
    const fp = path.join(d, f);
    const j = JSON.parse(fs.readFileSync(fp, 'utf8'));
    if (!Array.isArray(j.related)) continue;
    const before = j.related.length;
    j.related = j.related.filter(rel => {
      const target = (rel.href || '').replace(/\.html$/, '');
      return !rel.href || slugs.has(target); // keep if no href, or target exists
    });
    if (j.related.length !== before) { removed += before - j.related.length; files++; fs.writeFileSync(fp, JSON.stringify(j, null, 2)); }
  }
}
console.log('removed orphan related entries:', removed, '· files changed:', files);

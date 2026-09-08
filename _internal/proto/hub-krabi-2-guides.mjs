import fs from 'node:fs';
import path from 'node:path';
const ROOT = 'C:/Users/Imac/Thailandaddict/thailandaddict';
const SP = process.argv[2];

const clean = s => String(s || '').replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

function idx(dir) {
  const out = {};
  const d = path.join(ROOT, dir);
  if (!fs.existsSync(d)) return out;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    let a; try { a = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8')); } catch { continue; }
    out[a.slug] = a;
  }
  return out;
}

const th = idx('astro/src/content/articles');
const en = idx('astro/src/content/articles-en');
const rth = idx('astro/src/content/roundups');
const ren = idx('astro/src/content/roundups-en');

const arts = [];
for (const [slug, a] of Object.entries(th)) {
  if (a.cluster !== 'krabi') continue;
  const e = en[slug];
  const hero = a.heroImg || '';
  const heroFile = hero ? path.join(ROOT, 'astro/public', hero.replace(/^\//, '')) : '';
  arts.push({
    slug, type: a.type || '',
    titleTh: clean(a.h1 || a.title), titleEn: e ? clean(e.h1 || e.title) : '',
    eyebrowTh: clean(a.eyebrow || ''), eyebrowEn: e ? clean(e.eyebrow || '') : '',
    heroImg: hero, heroExists: hero ? fs.existsSync(heroFile) : false,
    readTime: a.readTime || '',
    hasEn: !!e,
  });
}

const ru = [];
for (const [slug, r] of Object.entries(rth)) {
  if (!/krabi|lanta|railay|phi-phi|ao-nang|aonang|klong-muang/.test(slug)) continue;
  const e = ren[slug];
  ru.push({
    slug, n: (r.entries || []).length,
    titleTh: clean(r.h1 || r.title), titleEn: e ? clean(e.h1 || e.title) : '',
    heroImg: r.heroImg || r.image || '', hasEn: !!e,
  });
}

fs.writeFileSync(path.join(SP, 'krabi-arts.json'), JSON.stringify({ arts, ru }, null, 1));
console.log('arts', arts.length, 'roundups', ru.length);
console.log('missing EN article twin:', arts.filter(a => !a.hasEn).map(a => a.slug));
console.log('missing hero file:', arts.filter(a => a.heroImg && !a.heroExists).map(a => a.slug + ' ' + a.heroImg));
console.log('no heroImg:', arts.filter(a => !a.heroImg).map(a => a.slug));
console.log('missing EN roundup twin:', ru.filter(a => !a.hasEn).map(a => a.slug));
for (const a of arts) console.log([a.type.padEnd(16), a.slug.padEnd(34), (a.heroExists ? 'IMG' : '---'), a.titleTh.slice(0, 46)].join(' | '));
console.log('--- roundups ---');
for (const a of ru) console.log([String(a.n).padStart(3), a.slug.padEnd(36), a.titleTh.slice(0, 50), '||', a.titleEn.slice(0, 50)].join(' | '));

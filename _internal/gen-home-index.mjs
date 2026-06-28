// Build astro/public/data/home-index.json — per-province Top-N for the homepage rails.
// see  = articles/top10-attractions-<city>.json  (ranked cards: img, rating, bestFor, tags)
// stay = roundups/*.json  (themed hotel Top-N; province from slug suffix)
// eat  = search-index.json eat rows grouped by province (title + href)
// Run: node _internal/gen-home-index.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const ART = path.join(ROOT, 'astro/src/content/articles');
const RND = path.join(ROOT, 'astro/src/content/roundups');
const SIDX = path.join(ROOT, 'astro/public/search-index.json');
const OUT = path.join(ROOT, 'astro/public/data/home-index.json');
const realLib = s => (s && s.indexOf('/_lib/') === -1) ? s : '';
const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'));

const prov = {};                 // slug -> { slug, name, see, stay, eat }
const thaiToSlug = {};
const ensure = (slug, name) => (prov[slug] = prov[slug] || { slug, name: name || slug, see: null, stay: [], eat: [] });

// ---- SEE: attractions ----
let seeN = 0;
for (const f of fs.readdirSync(ART).filter(x => x.startsWith('top10-attractions-') && x.endsWith('.json'))) {
  try {
    const a = rd(path.join(ART, f));
    const slug = f.replace('top10-attractions-', '').replace('.json', '');
    const name = a.crumbCity || slug;
    thaiToSlug[name] = slug;
    const p = ensure(slug, name);
    const cards = (a.blocks || []).filter(b => b.kind === 'restaurant')
      .sort((x, y) => (x.rank || 99) - (y.rank || 99))
      .slice(0, 10)
      .map(c => ({
        rank: c.rank, name: c.name, area: c.area || '',
        img: realLib(c.libImg) || '', rating: c.rating ?? null, ratingCount: c.ratingCount ?? null,
        bestFor: c.bestFor || '', tags: c.tags || [],
        href: '/' + a.slug
      }));
    p.see = { href: '/' + a.slug, items: cards };
    seeN++;
  } catch (e) { console.error('see fail', f, e.message); }
}

// ---- STAY: hotel roundups (province from slug suffix = a known province slug) ----
const slugSet = new Set(Object.keys(prov));
let stayN = 0;
if (fs.existsSync(RND)) for (const f of fs.readdirSync(RND).filter(x => x.endsWith('.json'))) {
  try {
    const a = rd(path.join(RND, f));
    const base = f.replace('.json', '');
    const hit = [...slugSet].filter(s => base.endsWith('-' + s)).sort((x, y) => y.length - x.length)[0];
    if (!hit) continue;
    prov[hit].stay.push({
      title: a.h1 || a.title || base,
      href: '/' + (a.slug || base),
      img: realLib(a.heroImg) || realLib(a.image) || '',
      sub: a.heroSub || ''
    });
    stayN++;
  } catch (e) { /* skip */ }
}
// keep top 10 stay roundups per province
for (const s of Object.keys(prov)) prov[s].stay = prov[s].stay.slice(0, 10);

// ---- EAT: from search-index (eat rows) grouped by province ----
let eatN = 0;
try {
  const idx = rd(SIDX);
  for (const row of idx) {
    const [title, href, dim, pthai] = row;
    if (dim !== 'eat') continue;
    const slug = thaiToSlug[pthai];
    if (!slug || !prov[slug]) continue;
    if (prov[slug].eat.length >= 12) continue;
    prov[slug].eat.push({ title, href: '/' + href.replace(/\.html$/, '') });
    eatN++;
  }
} catch (e) { console.error('eat fail', e.message); }

const out = {
  generatedFor: 'homepage rails',
  imgBase: 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev',
  provinceCount: Object.keys(prov).length,
  provinces: prov
};
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, JSON.stringify(out), 'utf8');
const kb = Math.round(fs.statSync(OUT).size / 1024);
console.log(`home-index: ${out.provinceCount} provinces · see ${seeN} · stay rows ${stayN} · eat rows ${eatN} · ${kb}KB`);

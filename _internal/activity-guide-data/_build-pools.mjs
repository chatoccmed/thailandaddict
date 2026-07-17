import fs from 'node:fs';
import path from 'node:path';
import { provSlug } from '../../worker-provinces.js';

const ROOT = path.resolve(import.meta.dirname, '..', '..');
const arr = (() => { const d = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/public/feeds/attractions.json'), 'utf8')); return Array.isArray(d) ? d : d.items; })();
const slugSet = new Set(fs.readdirSync(path.join(ROOT, 'astro/src/content/articles')).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)));
const hubSet = new Set(fs.readdirSync(path.join(ROOT, 'astro/public')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)));

const clean = (a) => {
  const slug = String(a.url || '').replace(/^https?:\/\/[^/]+\//, '').replace(/\.html$/, '');
  const cs = provSlug(a.city);
  const stay = cs && hubSet.has('city-' + cs) ? 'city-' + cs + '.html' : '';
  return { name: a.name, slug, city: a.city, clusterSlug: cs || '', stayHref: stay, tags: a.tags || [], img: a.img };
};
const ACT = {
  'best-beaches-thailand': ['beach'],
  'best-temples-thailand': ['temple', 'shrine'],
  'best-waterfalls-thailand': ['waterfall'],
  'best-national-parks-hiking-thailand': ['park', 'nature'],
  'best-markets-shopping-thailand': ['market', 'oldtown'],
  'best-viewpoints-mountains-thailand': ['viewpoint', 'mountain'],
  'best-elephant-sanctuaries-thailand': ['elephant', 'animal'],
  'best-caves-thailand': ['cave'],
};
const DIR = path.join(ROOT, '_internal/activity-guide-data');
for (const [slug, tags] of Object.entries(ACT)) {
  const pool = arr.map(clean).filter(a => slugSet.has(a.slug) && a.stayHref && a.tags.some(t => tags.includes(t)));
  fs.writeFileSync(path.join(DIR, '_pool-' + slug + '.json'), JSON.stringify(pool, null, 1));
  console.log(`${slug.padEnd(42)} ${String(pool.length).padStart(4)} candidates · ${new Set(pool.map(a => a.clusterSlug)).size} provinces (all with real article + city hub)`);
}

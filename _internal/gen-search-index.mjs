// Build a client-side search index for the static site (no server).
// Writes astro/public/search-index.json (TH) + astro/public/en/search-index.json (EN).
// Each entry is a compact array [title, url, cat, place] to keep the file small.
// cat: stay | rank | see | eat | plan | guide | city. Run on import (prebuild) or: node _internal/gen-search-index.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const CONTENT = path.join(ROOT, 'astro/src/content');
const strip = (s) => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const detitle = (s) => strip(s).split(' | ')[0];               // drop " | ThailandAddict" suffix
const readJson = (p) => { try { return JSON.parse(fs.readFileSync(p, 'utf8')); } catch { return null; } };
const slugsIn = (dir) => fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith('.json')) : [];

const CAT = { attraction: 'see', food: 'eat', 'eat-ranking': 'eat', itinerary: 'plan', prep: 'guide', guide: 'guide' };
const REGION_NAME = {
  north: { th: 'ภาคเหนือ', en: 'Northern Thailand' }, isan: { th: 'ภาคอีสาน', en: 'Isan (Northeast)' },
  central: { th: 'ภาคกลาง', en: 'Central Thailand' }, east: { th: 'ภาคตะวันออก', en: 'Eastern Thailand' },
  west: { th: 'ภาคตะวันตก', en: 'Western Thailand' }, south: { th: 'ภาคใต้', en: 'Southern Thailand' },
};
const FIXED_HUB = {
  'country-thailand': { th: 'เที่ยวไทย 77 จังหวัด', en: 'Explore Thailand — all provinces' },
  destinations: { th: 'เมืองท่องเที่ยวยอดนิยม', en: 'Top tourist cities' },
  'plan-your-trip': { th: 'เตรียมตัวเที่ยวไทย', en: 'Plan Your Trip' },
};
const EXCLUDE = new Set(['404', 'font-compare', 'search', 'index']);

function buildForLocale(loc) {
  const suf = loc === 'en' ? '-en' : '';
  const entries = [];
  const clusterName = {};                                       // cluster -> display name (for hub labels)

  // articles
  for (const f of slugsIn(path.join(CONTENT, 'articles' + suf))) {
    const d = readJson(path.join(CONTENT, 'articles' + suf, f)); if (!d) continue;
    const place = strip(d.crumbCity);
    if (d.cluster && place && !clusterName[d.cluster]) clusterName[d.cluster] = place;
    entries.push([detitle(d.title || d.h1), `${d.slug}.html`, CAT[d.type] || 'guide', place]);
  }
  // reviews (hotels)
  for (const f of slugsIn(path.join(CONTENT, 'reviews' + suf))) {
    const d = readJson(path.join(CONTENT, 'reviews' + suf, f)); if (!d) continue;
    const place = strip(d.addressLocality) || clusterName[d.cluster] || strip(d.cluster);
    entries.push([strip(d.name), `${d.slug}.html`, 'stay', place]);
  }
  // roundups (Top-N hotel rankings)
  for (const f of slugsIn(path.join(CONTENT, 'roundups' + suf))) {
    const d = readJson(path.join(CONTENT, 'roundups' + suf, f)); if (!d) continue;
    const bc = Array.isArray(d.breadcrumb) ? d.breadcrumb : [];
    const place = strip((bc[bc.length - 2] || {}).name) || '';
    entries.push([detitle(d.title), `${d.slug}.html`, 'rank', place]);
  }
  // hub pages (city / region / fixed) — from the public html that actually exists
  const htmlDir = loc === 'en' ? path.join(PUB, 'en') : PUB;
  for (const f of (fs.existsSync(htmlDir) ? fs.readdirSync(htmlDir) : [])) {
    if (!f.endsWith('.html')) continue;
    const name = f.slice(0, -5);
    if (EXCLUDE.has(name)) continue;
    if (name.startsWith('city-')) {
      const slug = name.slice(5);
      const disp = clusterName[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      entries.push([disp, f, 'city', loc === 'en' ? 'Province / city' : 'จังหวัด/เมือง']);
    } else if (name.startsWith('region-')) {
      const r = name.slice(7); const rn = REGION_NAME[r]; if (rn) entries.push([rn[loc], f, 'city', loc === 'en' ? 'Region' : 'ภาค']);
    } else if (name.startsWith('area-')) {                        // per-ย่าน hub (area-<city>-<hood>)
      const html = fs.readFileSync(path.join(htmlDir, f), 'utf8');
      const t = detitle((html.match(/<title>([^<]+)<\/title>/) || [])[1] || name.replace(/-/g, ' '));
      entries.push([t, f, 'stay', loc === 'en' ? 'Bangkok neighbourhood' : 'ย่านกรุงเทพ']);
    } else if (FIXED_HUB[name]) {
      entries.push([FIXED_HUB[name][loc], f, 'city', loc === 'en' ? 'Guide' : 'คู่มือ']);
    }
  }

  const out = loc === 'en' ? path.join(PUB, 'en', 'search-index.json') : path.join(PUB, 'search-index.json');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(entries));
  return { n: entries.length, kb: (fs.statSync(out).size / 1024).toFixed(0) };
}

const th = buildForLocale('th');
const en = buildForLocale('en');
console.log(`search-index.json · TH ${th.n} entries (${th.kb} KB) · EN ${en.n} entries (${en.kb} KB)`);

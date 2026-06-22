// Generate astro/public/sitemap.xml covering all TH + EN pages with hreflang alternates + <lastmod>.
// lastmod comes from each content entry's modifiedDate (fallback publishedDate, then site date);
// hubs/static pages use the site-wide freshness date. Clean URLs (no .html). Run: node _internal/gen-sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const BASE = 'https://thailandaddict.com';
const SITE_UPDATED = '2026-06-22';   // hubs + static pages (regenerated each build) — site-wide freshness date
const C = p => fs.existsSync(p) ? fs.readdirSync(p).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : [];
// Read a content entry's last-modified date (modifiedDate → publishedDate → site date).
const readDate = (coll, slug) => {
  try { const o = JSON.parse(fs.readFileSync(path.join(ROOT, 'astro/src/content', coll, slug + '.json'), 'utf8')); return o.modifiedDate || o.publishedDate || SITE_UPDATED; }
  catch { return SITE_UPDATED; }
};

// 1) content slugs (TH set + which have EN) + per-entry lastmod
const sets = [
  ['articles', 'articles-en'],
  ['reviews', 'reviews-en'],
  ['roundups', 'roundups-en'],
];
const pairs = [];                       // {slug, en:boolean, lastmod}
for (const [th, en] of sets) {
  const enSet = new Set(C(path.join(ROOT, 'astro/src/content', en)));
  for (const slug of C(path.join(ROOT, 'astro/src/content', th))) pairs.push({ slug, en: enSet.has(slug), lastmod: readDate(th, slug) });
}

// 2) hub + static page basenames (root public *.html), excluding non-indexable
const EXCLUDE = new Set(['404', 'font-compare']);
const rootHtml = fs.readdirSync(PUB).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)).filter(n => !EXCLUDE.has(n));
const enHtml = new Set(fs.existsSync(path.join(PUB, 'en')) ? fs.readdirSync(path.join(PUB, 'en')).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)) : []);
for (const name of rootHtml) pairs.push({ slug: name, en: enHtml.has(name), lastmod: SITE_UPDATED });

// 3) homepage (index → '')
pairs.unshift({ slug: '', en: enHtml.has('index'), home: true, lastmod: SITE_UPDATED });

const esc = s => s.replace(/&/g, '&amp;');
function urlEntry(loc, hasEn, thPath, enPath, lastmod) {
  const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  const alts = hasEn
    ? `\n    <xhtml:link rel="alternate" hreflang="th" href="${esc(BASE + thPath)}"/>` +
      `\n    <xhtml:link rel="alternate" hreflang="en" href="${esc(BASE + enPath)}"/>` +
      `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(BASE + thPath)}"/>`
    : '';
  return `  <url>\n    <loc>${esc(BASE + loc)}</loc>${lm}${alts}\n  </url>`;
}

const entries = [];
for (const p of pairs) {
  const thPath = p.home ? '/' : '/' + p.slug;
  const enPath = p.home ? '/en/' : '/en/' + p.slug;
  entries.push(urlEntry(thPath, p.en, thPath, enPath, p.lastmod));     // TH url
  if (p.en) entries.push(urlEntry(enPath, true, thPath, enPath, p.lastmod)); // EN url
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  entries.join('\n') + `\n</urlset>\n`;

fs.writeFileSync(path.join(PUB, 'sitemap.xml'), xml);
const thCount = pairs.length, enCount = pairs.filter(p => p.en).length;
console.log(`sitemap.xml written · ${entries.length} <url> entries (TH ${thCount} + EN ${enCount}) · <lastmod> on every url · ${(xml.length/1024/1024).toFixed(2)} MB`);

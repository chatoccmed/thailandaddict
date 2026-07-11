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

// Hub/static pages get the full 9-language treatment (they're the only pages with all locales built);
// content collections (articles/reviews/roundups) are TH+EN only until article-level translation (Phase 2).
const HTML_LANG = { zh: 'zh-Hans', ru: 'ru', ko: 'ko', ja: 'ja', he: 'he', ar: 'ar', hi: 'hi' };
const HUB_LOCALES = ['en', ...Object.keys(HTML_LANG)];

// 1) content slugs (TH set + which have EN) + per-entry lastmod
const sets = [
  ['articles', 'articles-en'],
  ['reviews', 'reviews-en'],
  ['roundups', 'roundups-en'],
];
const pairs = [];                       // {slug, locales:Set<string>, lastmod}
for (const [th, en] of sets) {
  const enSet = new Set(C(path.join(ROOT, 'astro/src/content', en)));
  for (const slug of C(path.join(ROOT, 'astro/src/content', th))) pairs.push({ slug, locales: new Set(enSet.has(slug) ? ['en'] : []), lastmod: readDate(th, slug) });
}

// 2) hub + static page basenames (root public *.html), excluding non-indexable
const EXCLUDE = new Set(['404', 'font-compare']);
const rootHtml = fs.readdirSync(PUB).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)).filter(n => !EXCLUDE.has(n));
const localeHtml = {};
for (const loc of HUB_LOCALES) {
  const dir = path.join(PUB, loc);
  localeHtml[loc] = new Set(fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.html')).map(f => f.slice(0, -5)) : []);
}
for (const name of rootHtml) {
  const locales = new Set(HUB_LOCALES.filter(loc => localeHtml[loc].has(name)));
  pairs.push({ slug: name, locales, lastmod: SITE_UPDATED });
}

// 3) homepage (index → '')
pairs.unshift({ slug: '', locales: new Set(HUB_LOCALES.filter(loc => localeHtml[loc].has('index'))), home: true, lastmod: SITE_UPDATED });

const esc = s => s.replace(/&/g, '&amp;');
const localePath = (loc, slug) => loc === 'th' ? '/' + slug : `/${loc}/${slug}`;
function urlEntry(loc, path_, locales, lastmod) {
  const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  let alts = '';
  if (locales.size) {
    alts += `\n    <xhtml:link rel="alternate" hreflang="th" href="${esc(BASE + path_.th)}"/>`;
    for (const l of locales) alts += `\n    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l] || l}" href="${esc(BASE + path_[l])}"/>`;
    alts += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(BASE + (path_.en || path_.th))}"/>`;
  }
  return `  <url>\n    <loc>${esc(BASE + loc)}</loc>${lm}${alts}\n  </url>`;
}

const entries = [];
for (const p of pairs) {
  const thPath = p.home ? '/' : '/' + p.slug;
  const path_ = { th: thPath };
  for (const l of p.locales) path_[l] = p.home ? `/${l}/` : `/${l}/${p.slug}`;
  entries.push(urlEntry(thPath, path_, p.locales, p.lastmod));            // TH url
  for (const l of p.locales) entries.push(urlEntry(path_[l], path_, p.locales, p.lastmod)); // each locale url
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  entries.join('\n') + `\n</urlset>\n`;

fs.writeFileSync(path.join(PUB, 'sitemap.xml'), xml);
const thCount = pairs.length, enCount = pairs.filter(p => p.locales.has('en')).length;
const perLocale = HUB_LOCALES.map(l => `${l} ${pairs.filter(p => p.locales.has(l)).length}`).join(', ');
console.log(`sitemap.xml written · ${entries.length} <url> entries (TH ${thCount}, ${perLocale}) · <lastmod> on every url · ${(xml.length/1024/1024).toFixed(2)} MB`);

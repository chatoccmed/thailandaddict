// Generate astro/public/sitemap.xml covering all TH + EN pages with hreflang alternates + <lastmod>.
// Every URL's lastmod is the date the file it is built from last changed: the content JSON for
// articles/reviews/roundups, the generated .html for hubs, static pages and the homepage. That date is
// its newest commit, or today when the file differs from HEAD (it ships with this build). A content
// entry's editorial modifiedDate wins when it is later. Clean URLs (no .html). Run: node _internal/gen-sitemap.mjs
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUB = path.join(ROOT, 'astro/public');
const BASE = 'https://thailandaddict.com';
const TODAY = new Date().toISOString().slice(0, 10);
const C = p => fs.existsSync(p) ? fs.readdirSync(p).filter(f => f.endsWith('.json')).map(f => f.slice(0, -5)) : [];

/* This used to stamp one hard-coded date (2026-06-22) on every hub, static page and the homepage,
   and fall back to it for the ~97% of reviews with no modifiedDate — so production said nothing had
   changed since June while it changed weekly, and Google learns to ignore a lastmod that lies.
   Without git (a tarball build) we leave lastmod out rather than guess one. */
const git = args => execFileSync('git', ['-c', 'core.quotePath=false', ...args], { cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 28 });
const SRC = ['astro/src/content', 'astro/public/*.html', 'astro/public/*/*.html'];
let headBlob = null, lastCommit = null;
try {
  headBlob = new Map(git(['ls-tree', '-r', 'HEAD', '--', 'astro/src/content', 'astro/public']).split('\n').filter(Boolean)
    .map(l => { const [meta, f] = l.split('\t'); return [f, meta.split(' ')[2]]; }));
  lastCommit = new Map(); let d;
  for (const l of git(['log', '--format=@%cs', '--name-only', '--no-renames', '--', ...SRC]).split('\n')) {
    if (l[0] === '@') d = l.slice(1); else if (l && !lastCommit.has(l)) lastCommit.set(l, d);
  }
} catch (e) { headBlob = lastCommit = null; console.warn(`gen-sitemap: git unavailable, lastmod only where content has a date (${e.message.split('\n')[0]})`); }
const blobId = buf => crypto.createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');
// Date the repo-relative file `rel` (contents `buf`, if already read) last changed, or null when unknown.
const changedOn = (rel, buf) => {
  if (!headBlob || !(buf || fs.existsSync(path.join(ROOT, rel)))) return null;
  const want = headBlob.get(rel);
  if (!want) return TODAY;                                    // new, not committed yet
  buf ??= fs.readFileSync(path.join(ROOT, rel));
  const same = blobId(buf) === want || blobId(Buffer.from(buf.toString('utf8').replace(/\r\n/g, '\n'))) === want;
  return same ? (lastCommit.get(rel) || null) : TODAY;
};
const latest = (...ds) => ds.filter(Boolean).map(d => String(d).slice(0, 10)).sort().pop() || null;
// A content entry's lastmod: the later of its editorial modifiedDate and when its file changed.
const readDate = (coll, slug) => {
  const rel = `astro/src/content/${coll}/${slug}.json`;
  let o = {}, buf = null;
  try { buf = fs.readFileSync(path.join(ROOT, rel)); o = JSON.parse(buf.toString('utf8')); } catch {}
  return latest(o.modifiedDate, changedOn(rel, buf)) || (o.publishedDate ? String(o.publishedDate).slice(0, 10) : null);
};
const pageDate = (loc, name) => changedOn(`astro/public/${loc === 'th' ? '' : loc + '/'}${name}.html`);

// Hub/static pages get the full 9-language treatment (they're the only pages with all locales built);
// content collections (articles/reviews/roundups) are TH+EN only until article-level translation (Phase 2).
/* The hreflang code per locale. It is the bare code for all nine, including zh
   — NOT "zh-Hans". Every page on the site emits its own <link rel=alternate>
   set, and all four generators that write them (gen-hubs.mjs, localize.mjs and
   the three Astro layouts via Shell) use the bare code. A sitemap that said
   zh-Hans for the same URL cluster was the one voice out of five disagreeing,
   and Google resolves a contradictory cluster by dropping it, not by picking a
   winner. Kept as a map so a locale that really does need a script or region
   subtag has somewhere to say so. */
const HTML_LANG = { zh: 'zh', ru: 'ru', ko: 'ko', ja: 'ja', he: 'he', ar: 'ar', hi: 'hi' };
const HUB_LOCALES = ['en', ...Object.keys(HTML_LANG)];

// 1) content slugs (TH set + which have EN) + per-entry lastmod
const sets = [
  ['articles', 'articles-en'],
  ['reviews', 'reviews-en'],
  ['roundups', 'roundups-en'],
];
const pairs = [];                       // {slug, locales:Set<string>, lastmod:{th, en, …}}
for (const [th, en] of sets) {
  const enSet = new Set(C(path.join(ROOT, 'astro/src/content', en)));
  for (const slug of C(path.join(ROOT, 'astro/src/content', th))) pairs.push({ slug, locales: new Set(enSet.has(slug) ? ['en'] : []), lastmod: { th: readDate(th, slug), en: enSet.has(slug) ? readDate(en, slug) : null } });
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
  pairs.push({ slug: name, locales, lastmod: Object.fromEntries(['th', ...locales].map(l => [l, pageDate(l, name)])) });
}

// 3) homepage (index → '')
const homeLocales = new Set(HUB_LOCALES.filter(loc => localeHtml[loc].has('index')));
pairs.unshift({ slug: '', locales: homeLocales, home: true, lastmod: Object.fromEntries(['th', ...homeLocales].map(l => [l, pageDate(l, 'index')])) });

const esc = s => s.replace(/&/g, '&amp;');
const localePath = (loc, slug) => loc === 'th' ? '/' + slug : `/${loc}/${slug}`;
function urlEntry(loc, path_, locales, lastmod) {
  const lm = lastmod ? `\n    <lastmod>${lastmod}</lastmod>` : '';
  let alts = '';
  if (locales.size) {
    alts += `\n    <xhtml:link rel="alternate" hreflang="th" href="${esc(BASE + path_.th)}"/>`;
    for (const l of locales) alts += `\n    <xhtml:link rel="alternate" hreflang="${HTML_LANG[l] || l}" href="${esc(BASE + path_[l])}"/>`;
    /* x-default is the TH root, matching gen-hubs.mjs::page() and all three
       layouts — and meta.json's defaultLocale. This used to prefer /en/, which
       made every hub cluster carry two different x-defaults depending on
       whether Google read the page or the sitemap. */
    alts += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(BASE + path_.th)}"/>`;
  }
  return `  <url>\n    <loc>${esc(BASE + loc)}</loc>${lm}${alts}\n  </url>`;
}

const entries = [];
for (const p of pairs) {
  const thPath = p.home ? '/' : '/' + p.slug;
  const path_ = { th: thPath };
  for (const l of p.locales) path_[l] = p.home ? `/${l}/` : `/${l}/${p.slug}`;
  entries.push(urlEntry(thPath, path_, p.locales, p.lastmod.th));         // TH url
  for (const l of p.locales) entries.push(urlEntry(path_[l], path_, p.locales, p.lastmod[l])); // each locale url
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n` +
  entries.join('\n') + `\n</urlset>\n`;

fs.writeFileSync(path.join(PUB, 'sitemap.xml'), xml);
const thCount = pairs.length, enCount = pairs.filter(p => p.locales.has('en')).length;
const perLocale = HUB_LOCALES.map(l => `${l} ${pairs.filter(p => p.locales.has(l)).length}`).join(', ');
console.log(`sitemap.xml written · ${entries.length} <url> entries (TH ${thCount}, ${perLocale}) · <lastmod> on ${(xml.match(/<lastmod>/g) || []).length} · ${(xml.length/1024/1024).toFixed(2)} MB`);

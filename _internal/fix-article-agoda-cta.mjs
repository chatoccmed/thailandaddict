/* Point the "find a hotel on Agoda" button at something.

   203 accommodation articles - 174 "where to stay in X", 28 "hotels near Y",
   and best-of-thailand-2026 - carried a CTA labelled "ค้นหาโรงแรมบน Agoda"
   whose href was https://www.agoda.com/?cid=1965862, the bare homepage. These
   are the pages a reader reaches when they have already decided to book and
   only want to know where, so it is the worst place on the site to hand them
   nothing. Nothing was broken, which is why it survived: the link works, it
   carries the affiliate tag, it just answers a different question.

   Targets, in order of preference:
     city    agoda.com/th-th/city/<slug>-th.html - the pattern 94 other
             articles already use, so the slugs are known-good rather than
             guessed. Used when the article is about a place Agoda has a city
             page for.
     search  agoda.com/search?cid=..&q=<place> - for a Bangkok district, or a
             landmark ("hotels near Bumrungrad"), where no city page can mean
             "near that". The query comes from the article's own title, so it
             says what the page says.

   A city page is preferred where one exists because its URL is stable, while
   a search URL renders whatever the engine returns that day.

   Usage: node _internal/fix-article-agoda-cta.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';
import { serializeLike } from './lib/json-format.mjs';

const ROOT = path.resolve(import.meta.dirname, '..');
const APPLY = process.argv.includes('--apply');
const BARE = /^https:\/\/www\.agoda\.com\/?\?cid=\d+$/;
const CID = '1965862';

/* city slugs proven good by already being live in other articles */
const KNOWN = new Set();
for (const dir of ['articles', 'articles-en']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const raw = fs.readFileSync(path.join(d, f), 'utf8');
    for (const m of raw.matchAll(/agoda\.com\/th-th\/city\/([a-z-]+)-th\.html/g)) KNOWN.add(m[1]);
  }
}

const cityUrl = (slug) => `https://www.agoda.com/th-th/city/${slug}-th.html?cid=${CID}`;
const searchUrl = (q) => `https://www.agoda.com/search?cid=${CID}&q=${encodeURIComponent(q)}`;

/* the place this article is about, as the reader would name it */
function placeOf(j, slug) {
  /* h1 carries markup - "<br><span>..." - and a query built straight from it
     searches Agoda for the literal string "<br>". Strip tags and entities
     first, then take the place the title names. */
  const clean = (s) => String(s || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;|&#\d+;/gi, ' ')
    .replace(/\s+/g, ' ').trim();
  /* Agoda searches the string it is handed, so the query must be the PLACE and
     nothing else. "Where to stay in Ao Nang" returns far less than "Ao Nang",
     and "พักย่านไหนดี ในอ่าวนาง" less still. Peel the question off both
     languages, front and back, and keep the name. */
  let t = clean(j.h1 || j.title).replace(/\s*[|:·].*$/, '');
  t = t.replace(/^(?:ที่พัก|พักย่านไหนดี|พักย่าน|พักที่|โรงแรมใกล้|โรงแรมแถว|ใกล้|นอนไหนดี)\s*/, '')
       .replace(/^(?:where\s+to\s+stay|hotels?\s+near|best\s+hotels?|where\s+to\s+sleep)\s*/i, '')
       .replace(/^(?:ใน|แถว|ย่าน)\s*/, '')
       .replace(/^(?:at|in|around)\s+/i, '')
       .replace(/\s*(?:ย่านไหนดี|ที่ไหนดี|ดีที่สุด|พักไหนดี)\s*.*$/, '')
       .replace(/\s*\b(19|20)\d{2}\b.*$/, '')
       .trim();
  return t || slug.replace(/^(where-to-stay|hotels-near)-/, '').replace(/-/g, ' ');
}

function targetFor(slug, j) {
  if (/^where-to-stay-/.test(slug)) {
    const rest = slug.replace(/^where-to-stay-/, '');
    if (KNOWN.has(rest)) return { kind: 'city', url: cityUrl(rest) };
    /* bangkok-thonglor etc: Agoda has no per-district city page */
    const head = rest.split('-')[0];
    if (KNOWN.has(head)) return { kind: 'search', url: searchUrl(placeOf(j, slug)) };
    return { kind: 'search', url: searchUrl(placeOf(j, slug)) };
  }
  if (/^hotels-near-/.test(slug)) return { kind: 'search', url: searchUrl(placeOf(j, slug)) };
  return { kind: 'search', url: searchUrl(placeOf(j, slug)) };
}

let changed = 0, files = 0;
const sample = [], byKind = {};
for (const dir of ['articles', 'articles-en']) {
  const d = path.join(ROOT, 'astro/src/content', dir);
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d)) {
    if (!f.endsWith('.json')) continue;
    const p = path.join(d, f);
    const raw = fs.readFileSync(p, 'utf8');
    if (!BARE.test('https://www.agoda.com/?cid=' + CID) && !raw.includes('agoda.com/?cid=')) continue;
    if (!raw.includes('agoda.com/?cid=')) continue;
    const j = JSON.parse(raw);
    const slug = f.replace(/\.json$/, '');
    const t = targetFor(slug, j);
    let hits = 0;
    (function walk(o) {
      if (!o || typeof o !== 'object') return;
      for (const k of Object.keys(o)) {
        if (typeof o[k] === 'string' && BARE.test(o[k])) { o[k] = t.url; hits++; }
        else walk(o[k]);
      }
    })(j);
    if (!hits) continue;
    files++; changed += hits;
    byKind[t.kind] = (byKind[t.kind] || 0) + 1;
    if (sample.length < 10 && dir === 'articles') sample.push([slug, t.kind, t.url]);
    if (APPLY) fs.writeFileSync(p, serializeLike(raw, j).text);
  }
}
console.log(`files ${files} · CTA links rewritten ${changed} · ` + Object.entries(byKind).map(([k, v]) => `${k} ${v}`).join(' · '));
console.log(`known-good agoda city slugs available: ${KNOWN.size}`);
for (const [s, k, u] of sample) console.log(`   ${k.padEnd(7)} ${s.slice(0, 38).padEnd(38)} ${u.slice(0, 84)}`);
console.log(APPLY ? '\napplied' : '\ndry run — nothing written. Re-run with --apply');

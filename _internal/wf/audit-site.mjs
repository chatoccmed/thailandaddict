// Site-wide audit — scans EVERY html file in astro/dist (no sampling).
// 1) dead internal links  2) link graph → orphan pages  3) affiliate params
// 4) images: local-missing, per-page duplicates, cross-city duplicate photos
// Output: _internal/wf/site-audit-report.json (+ console summary)
// External URL liveness (images/affiliates) is a separate wave: audit-site-live.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const DIST = path.join(ROOT, 'astro/dist');

// ---------- collect valid internal targets ----------
const allFiles = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const fp = path.join(d, e.name);
    if (e.isDirectory()) walk(fp);
    else allFiles.push(path.relative(DIST, fp).replace(/\\/g, '/'));
  }
})(DIST);
const fileSet = new Set(allFiles);
const htmlFiles = allFiles.filter(f => f.endsWith('.html'));

// _redirects sources are valid targets
const redirectSrc = new Set();
try {
  for (const line of fs.readFileSync(path.join(DIST, '_redirects'), 'utf8').split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const src = t.split(/\s+/)[0];
    if (src) redirectSrc.add(src.replace(/\/$/, '') || '/');
  }
} catch {}

// An href built at runtime by inline JS (`'<a href="' + it.href + '">'`, template literals,
// `${...}` interpolation) is not a link to a file — the browser never sees this string. The
// scanner reads raw HTML, so it picks these up out of <script> blocks. Skip them, otherwise
// every run reports thousands of phantom dead links that have to be filtered by hand.
const RUNTIME_HREF = /[${}`\[\]]|['"]\s*\+|\+\s*['"]/;

function isValidInternal(href) {
  if (RUNTIME_HREF.test(href)) return true;
  let p = href.split('#')[0].split('?')[0];
  if (p === '' || p === '/') return true;
  // worker.js routes (not static files): /go/b = Booking→CJ redirect, /api/* = plan/write endpoints.
  // These are served by the Worker, so there is no dist file — don't count them as dead links.
  if (p === '/go/b' || p.startsWith('/go/') || p.startsWith('/api/')) return true;
  p = p.replace(/^\//, '').replace(/\/$/, '');
  if (p === '') return true;
  if (p === 'go/b' || p.startsWith('go/') || p.startsWith('api/')) return true;
  if (fileSet.has(p)) return true;                    // exact file (asset or .html)
  if (fileSet.has(p + '.html')) return true;          // clean URL
  if (fileSet.has(p + '/index.html')) return true;    // dir index (en/, zh/)
  // redirects match on /path (with or without .html) and splats
  const withSlash = '/' + p;
  if (redirectSrc.has(withSlash) || redirectSrc.has(withSlash + '.html')) return true;
  for (const r of redirectSrc) if (r.endsWith('/*') && withSlash.startsWith(r.slice(0, -1))) return true;
  return false;
}

// ---------- per-page scan ----------
const deadLinks = {};            // page -> [bad hrefs]
const inbound = new Map();       // slug -> inbound count
const affiliate = { agoda: { ok: 0, bad: [] }, booking: { ok: 0, noaid: 0 }, trip: { ok: 0, bad: [] }, klook: { ok: 0, bad: [] } };
const imgLocalMissing = {};      // page -> [missing local imgs]
const imgUse = new Map();        // imgURL -> Map(page -> count)  (content imgs only)
const pageDupes = {};            // page -> [img used >1x in page]

const HREF_RE = /href="([^"]+)"/g;
const IMG_RE = /(?:src|data-src)="([^"]+\.(?:jpg|jpeg|png|webp|avif|gif)[^"]*)"|url\((['"]?)([^)'"]+\.(?:jpg|jpeg|png|webp|avif))\2\)/gi;
const SRCSET_RE = /srcset="([^"]+)"/g;

const SELF = /^https?:\/\/(www\.)?thailandaddict\.com/;
const SKIP_HREF = /^(mailto:|tel:|javascript:|data:|#)/;
// shared-by-design images: heroes/<city>, logo, favicon, og defaults, maps
const SHARED_OK = /(\/images\/heroes\/|logo|favicon|placeholder|\/maps?\/|staticmap|tile|\.svg)/i;

for (const f of htmlFiles) {
  const html = fs.readFileSync(path.join(DIST, f), 'utf8');
  const pageLang = f.startsWith('en/') ? 'en' : f.startsWith('zh/') ? 'zh' : 'th';

  // ----- links -----
  for (const m of html.matchAll(HREF_RE)) {
    let href = m[1].trim();
    if (SKIP_HREF.test(href) || href === '') continue;
    if (SELF.test(href)) href = href.replace(SELF, '') || '/';
    if (/^https?:\/\//.test(href)) {
      // external → affiliate check
      const h = href.toLowerCase();
      if (h.includes('agoda.com')) { h.includes('cid=1965862') ? affiliate.agoda.ok++ : affiliate.agoda.bad.push(f + ' → ' + href.slice(0, 120)); }
      else if (h.includes('booking.com')) { /aid=\d+/.test(h) ? affiliate.booking.ok++ : affiliate.booking.noaid++; }
      else if (h.includes('trip.com')) { (h.includes('allianceid=6861268') && h.includes('sid=312919111')) ? affiliate.trip.ok++ : affiliate.trip.bad.push(f + ' → ' + href.slice(0, 120)); }
      else if (h.includes('klook.com')) { h.includes('aid=121442') ? affiliate.klook.ok++ : affiliate.klook.bad.push(f + ' → ' + href.slice(0, 140)); }
      continue;
    }
    // internal — resolve relative to page dir
    let target = href;
    if (!target.startsWith('/')) {
      const dir = path.posix.dirname(f);
      target = '/' + path.posix.normalize(path.posix.join(dir === '.' ? '' : dir, target));
    }
    if (!isValidInternal(target)) (deadLinks[f] = deadLinks[f] || []).push(href);
    else {
      const slug = target.split('#')[0].split('?')[0].replace(/^\//, '').replace(/\.html$/, '') || 'index';
      inbound.set(slug, (inbound.get(slug) || 0) + 1);
    }
  }

  // ----- images -----
  const seenInPage = new Map();
  const record = (u) => {
    if (!u) return;
    u = u.trim();
    if (u.startsWith('data:')) return;
    if (RUNTIME_HREF.test(u)) return;                 // src built by inline JS — not a file to check
    // local existence
    if (!/^https?:\/\//.test(u)) {
      const p = u.split('?')[0].replace(/^\//, '');
      if (!fileSet.has(p)) (imgLocalMissing[f] = imgLocalMissing[f] || []).push(u);
    }
    if (SHARED_OK.test(u)) return;                    // by-design shared assets
    seenInPage.set(u, (seenInPage.get(u) || 0) + 1);
    if (pageLang !== 'th') return;                    // dupe analysis on TH canon only
    if (!imgUse.has(u)) imgUse.set(u, new Map());
    const m2 = imgUse.get(u);
    m2.set(f, (m2.get(f) || 0) + 1);
  };
  for (const m of html.matchAll(IMG_RE)) record(m[1] || m[3]);
  for (const m of html.matchAll(SRCSET_RE)) for (const part of m[1].split(',')) record(part.trim().split(/\s+/)[0]);
  const og = html.match(/property="og:image" content="([^"]+)"/); if (og) record(og[1]);

  for (const [u, n] of seenInPage) if (n > 2) (pageDupes[f] = pageDupes[f] || []).push(`${u} ×${n}`);
}

// ---------- orphans (TH canon pages only, skip assets/utility) ----------
const orphans = [];
for (const f of htmlFiles) {
  if (f.includes('/')) continue;                      // en/, zh/ mirror TH
  const slug = f.replace(/\.html$/, '');
  if (/^(404|search|_)/.test(slug)) continue;
  if (!inbound.has(slug)) orphans.push(slug);
}

// ---------- cross-page duplicate photos (same photo, different subjects) ----------
// city inference from filename slug
const CITY_RE = /(bangkok|chiang-mai|chiang-rai|phuket|krabi|pattaya|chonburi|samui|surat-thani|hua-?hin|prachuap|kanchanaburi|ayutthaya|rayong|trat|koh-[a-z]+|phang-nga|pai|mae-hong-son|sukhothai|nakhon-[a-z-]+|khao-yai|[a-z-]+?)(?:\.html)?$/;
const crossDupes = [];
for (const [u, pages] of imgUse) {
  if (pages.size < 2) continue;
  const pageList = [...pages.keys()];
  // group hint: strip common prefixes to compare subjects
  const subjects = new Set(pageList.map(p => p.replace(/\.html$/, '')));
  crossDupes.push({ img: u, pages: pageList.slice(0, 12), count: pages.size, subjects: subjects.size });
}
crossDupes.sort((a, b) => b.count - a.count);

// ---------- external image inventory (for live check wave) ----------
const externalImgs = [...imgUse.keys()].filter(u => /^https?:\/\//.test(u));

const report = {
  generatedAt: new Date().toISOString().slice(0, 10),
  pagesScanned: htmlFiles.length,
  deadLinks: { pages: Object.keys(deadLinks).length, total: Object.values(deadLinks).flat().length, detail: deadLinks },
  orphans: { count: orphans.length, list: orphans },
  affiliate: {
    agoda: { ok: affiliate.agoda.ok, bad: affiliate.agoda.bad.length, sample: affiliate.agoda.bad.slice(0, 20) },
    booking: { withAid: affiliate.booking.ok, plain: affiliate.booking.noaid },
    trip: { ok: affiliate.trip.ok, bad: affiliate.trip.bad.length, sample: affiliate.trip.bad.slice(0, 20) },
    klook: { ok: affiliate.klook.ok, bad: affiliate.klook.bad.length, sample: affiliate.klook.bad.slice(0, 20) },
  },
  images: {
    localMissing: { pages: Object.keys(imgLocalMissing).length, detail: imgLocalMissing },
    pageDupes: { pages: Object.keys(pageDupes).length, detail: pageDupes },
    crossDupes: { count: crossDupes.length, top: crossDupes.slice(0, 60) },
    externalUnique: externalImgs.length,
  },
};
fs.writeFileSync(path.join(ROOT, '_internal/wf/site-audit-report.json'), JSON.stringify(report, null, 1));
fs.writeFileSync(path.join(ROOT, '_internal/wf/external-imgs.json'), JSON.stringify(externalImgs, null, 0));

console.log(`pages scanned        : ${htmlFiles.length}`);
console.log(`dead internal links  : ${report.deadLinks.total} on ${report.deadLinks.pages} pages`);
console.log(`orphan pages (TH)    : ${orphans.length}`);
console.log(`affiliate agoda      : ok ${affiliate.agoda.ok} · missing-cid ${affiliate.agoda.bad.length}`);
console.log(`affiliate booking    : with-aid ${affiliate.booking.ok} · plain ${affiliate.booking.noaid}`);
console.log(`affiliate trip       : ok ${affiliate.trip.ok} · bad ${affiliate.trip.bad.length}`);
console.log(`affiliate klook      : ok ${affiliate.klook.ok} · bad ${affiliate.klook.bad.length}`);
console.log(`img local-missing    : ${Object.keys(imgLocalMissing).length} pages`);
console.log(`img page-dupes (>2×) : ${Object.keys(pageDupes).length} pages`);
console.log(`img cross-page dupes : ${crossDupes.length} URLs (top saved)`);
console.log(`external unique imgs : ${externalImgs.length}`);

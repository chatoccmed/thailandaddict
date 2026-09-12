/* gen-proto-home.mjs — builds the planner-first homepage from the REAL repo
   content, for the site root and for the /_proto/ design reference.

   Every hotel, restaurant, attraction, score, price, photo path, itinerary row
   and affiliate URL on the page is read from astro/src/content/** at build
   time. Nothing is typed by hand, so nothing can be invented.

   TARGETS
     site   astro/public/index.html · astro/public/en/index.html
            indexable, canonical https://thailandaddict.com/, root-absolute hrefs
     proto  astro/public/_proto/home.html · astro/public/_proto/en/home.html
            noindex, the design reference the blueprint points at

   The two differ ONLY in robots/canonical/hreflang and the note in the footer.
   Same markup, same data, one code path — the prototype cannot drift away from
   the thing it is supposed to be a reference for.

   THE CHROME COMES FROM _internal/lib/chrome.mjs
   Until 2026-09-12 this file hand-wrote its own skip link, sprite, topbar,
   footer, rail, tab bar, More popover and language menu — a sixth copy of the
   markup the whole redesign exists to collapse into one, with its own copy
   table for nav/search/rail strings in two languages. It is now the fourth
   legitimate consumer of chrome.mjs, alongside Shell.astro, gen-hubs.mjs and
   localize.mjs, which is also how it gets chrome in all nine languages.

   Run:  node _internal/shell/build/gen-proto-home.mjs
*/
import fs from 'node:fs';
import path from 'node:path';
import { shellHead, shellTop, shellBottom, dirOf } from '../../lib/chrome.mjs';

/* Resolved from this file, NOT from process.cwd(): prebuild.mjs imports this
   generator with the working directory at astro/, and a cwd-relative ROOT would
   have it reading astro/astro/src/content and writing astro/astro/public. */
const ROOT = path.resolve(import.meta.dirname, '../../..');
const C = (p) => path.join(ROOT, 'astro/src/content', p);
const rd = (p) => JSON.parse(fs.readFileSync(p, 'utf8'));
const ex = (p) => fs.existsSync(p);
const R2 = 'https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev';
const SHELL = rd(path.join(ROOT, 'astro/src/data/shell-manifest.json'));
const EDITOR = rd(path.join(ROOT, 'astro/src/data/editorial.json')).editor;

const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const nfmt = (n) => Number(n).toLocaleString('en-US');
/* Idempotent: an already-absolute URL passes through untouched, so a caller can
   r2() a value of unknown provenance without ever producing "r2.dev/https://".
   Every image key on this page must leave the generator absolute, because the
   directories they live in (images/hotels|cm|food|gallery) are NOT in the deploy
   bundle - they exist only on R2. */
const r2 = (p) => {
  const v = String(p == null ? '' : p);
  if (!v) return '';
  if (v.slice(0, 4) === 'http' || v.slice(0, 2) === '//') return v;
  return R2 + '/' + (v[0] === '/' ? v.slice(1) : v);
};
const J = (o) => JSON.stringify(o).replace(/</g, '\\u003c');

/* Booking.com pays only through CJ, and the CJ id lives in worker.js and
   nowhere else — every booking.com href on the site is the /go/b route, which
   302s to the tracking link. Same shape as gen-hubs.mjs:213 and
   RoundupLayout.astro:89, deliberately: three call sites, one URL format. */
const goB = (u, sid) => (u && String(u).includes('booking.com'))
  ? '/go/b?u=' + encodeURIComponent(u) + '&sid=' + String(sid || 'home').replace(/[^\w-]/g, '').slice(0, 60)
  : '';

/* Locale prefix for every internal content URL. Every page this homepage links
   to has a real EN twin on disk, so an English reader must never be dropped
   onto a Thai page. /api/* and /go/* are worker routes and stay unprefixed,
   and an href that is already localised is left alone. */
const P = (lang, u) => (lang === 'en' && typeof u === 'string' && u.charAt(0) === '/'
  && !/^\/(en\/|api\/|go\/)/.test(u)) ? '/en' + u : u;

/* ── head blocks the two targets do NOT share ──────────────────────────────
   Everything else in <head> comes from chrome.mjs::shellHead(). These are the
   handful of tags that are about WHICH URL this document is, which is the only
   real difference between the site homepage and its /_proto/ mirror. */

/* Same snippet, same id, same guard as gen-hubs.mjs:22. The prototype carried
   NO analytics, so shipping it at / would have gone dark on the site's single
   most important page — measured 2026-09-12: index.html has G-JDXCTEMMFB,
   _proto/home.html does not. */
const GA_ID = 'G-JDXCTEMMFB';
const GA_HEAD = (/^G-[A-Z0-9]{8,}$/.test(GA_ID) && !GA_ID.includes('XXXX'))
  ? `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script><script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});</script>`
  : '';

const SITE_URL = 'https://thailandaddict.com';
const OG_LOCALE = { th:'th_TH', en:'en_US', zh:'zh_CN', ru:'ru_RU', ko:'ko_KR', ja:'ja_JP', hi:'hi_IN', he:'he_IL', ar:'ar_AR' };
const FAVICON = `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%2306B6D4'/%3E%3Ctext x='50' y='70' font-family='Georgia,serif' font-size='60' font-weight='bold' fill='white' text-anchor='middle'%3ET%3C/text%3E%3C/svg%3E">`;

/* hreflang: bare locale code, x-default at the Thai root. Identical to
   gen-hubs.mjs::page(), localize.mjs::hreflangSet() and gen-sitemap.mjs — a
   cluster only works if every member agrees, and the homepage is the member
   Google looks at first. All nine are listed because all nine exist on disk. */
function SITE_HEAD(t, lang) {
  const canon = SITE_URL + (lang === 'th' ? '/' : '/' + lang + '/');
  const alts = HOME_LOCALES
    .map((l) => `<link rel="alternate" hreflang="${l}" href="${SITE_URL}${homeHref(l)}">`)
    .join('')
    + `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/">`;
  return `<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${canon}">
${alts}
${FAVICON}
<meta property="og:site_name" content="ThailandAddict"><meta property="og:type" content="website">
<meta property="og:title" content="${esc(t.title)}"><meta property="og:description" content="${esc(t.desc)}">
<meta property="og:url" content="${canon}"><meta property="og:locale" content="${OG_LOCALE[lang] || 'th_TH'}">
<meta property="og:image" content="${SITE_URL}/images/heroes/krabi.jpg">
<meta name="twitter:card" content="summary_large_image">`;
}

/* The design reference. noindex twice over — this meta plus the /_proto/*
   X-Robots-Tag block in astro/public/_headers, because a meta tag only reaches
   HTML and the folder also holds a webmanifest and a service worker. */
function PROTO_HEAD(t, up) {
  return `<meta name="robots" content="noindex, nofollow">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.desc)}">
<link rel="canonical" href="${esc(t.canonical)}">
<link rel="manifest" href="${up}manifest.${t.lang}.webmanifest">`;
}

/* ───────────────────────── region + destination tables ───────────────────── */
const HUBS = (() => {
  const src = fs.readFileSync(path.join(ROOT, '_internal/gen-hubs.mjs'), 'utf8');
  const grab = (name) => {
    const i = src.indexOf('const ' + name + ' = [');
    const j = src.indexOf('\n];', i);
    return [...src.slice(i, j).matchAll(/\['([^']+)','([^']+)','([a-z]+)'\]/g)].map(m => [m[1], m[2], m[3]]);
  };
  const EN = {};
  {
    const i = src.indexOf('const EN_NAME = {'), j = src.indexOf('\n};', i);
    for (const m of src.slice(i, j).matchAll(/'([a-z-]+)':'([^']+)'/g)) EN[m[1]] = m[2];
  }
  const REG = {};
  for (const m of src.matchAll(/(n|ne|c|e|w|s):\s+\{ slug:'([a-z]+)',\s+th:'([^']+)',\s+en:'([^']+)',\s+emoji:'([^']+)',\s+intro:'([^']+)',\s+intro_en:'([^']+)' \}/g))
    REG[m[1]] = { key: m[1], slug: m[2], th: m[3], en: m[4], emoji: m[5], intro: m[6], intro_en: m[7] };
  const prov = grab('PROVINCES').map(([s, th, r]) => ({ slug: s, th, en: EN[s] || s, region: r, prov: true }));
  const dest = grab('DESTINATIONS').map(([s, th, r]) => ({ slug: s, th, en: EN[s] || s, region: r, prov: false }));
  return { REG, all: [...prov, ...dest], byslug: Object.fromEntries([...prov, ...dest].map(h => [h.slug, h])) };
})();
const REGION_ORDER = ['n', 'ne', 'c', 'e', 'w', 's'];

const ALIAS = {
  korat: 'nakhon-ratchasima', ubon: 'ubon-ratchathani', udon: 'udon-thani',
  nakhon: 'nakhon-si-thammarat', prachuap: 'prachuap-khiri-khan',
  khaoyai: 'khao-yai', 'yala-betong': 'yala'
};
const TIERS = (() => {
  const t = {};
  for (const f of fs.readdirSync(C('articles'))) {
    const m = f.match(/^(.+?)-(1-day|2d1n|3d2n)-itinerary\.json$/);
    if (m) (t[m[1]] = t[m[1]] || {})[m[2]] = '/' + m[1] + '-' + m[2] + '-itinerary';
  }
  return t;
})();
/* Every destination with a 3d2n plan = the <select> options, so the default
   duration works for every single option. */
const SELECTABLE = Object.keys(TIERS)
  .filter(s => TIERS[s]['3d2n'])
  .map(s => ({ it: s, hub: HUBS.byslug[ALIAS[s] || s], tiers: TIERS[s] }))
  .filter(d => d.hub)
  .sort((a, b) => a.hub.slug.localeCompare(b.hub.slug));

/* ───────────────────────────── content readers ───────────────────────────── */
const L = { th: { art: 'articles', rou: 'roundups' }, en: { art: 'articles-en', rou: 'roundups-en' } };
const blockImg = (b) => {
  const g = b.gallery && b.gallery[0];
  const s = (g && (g.src || g.url || g)) || b.libImg || '';
  return typeof s === 'string' ? s : '';
};
const isReal = (s) => !!s && !/_lib\//.test(s);

/* Photos and photo credits are language-independent and only the Thai source
   carries them reliably (the EN twins drop `gallery`/`libImg` on some files),
   so the image always comes from the TH file, matched by rank. Text always
   comes from the requested locale. */
function stays(prov, lang, n) {
  const p = C(L[lang].rou + '/top10-hotels-' + prov + '.json');
  if (!ex(p)) return [];
  const th = ex(C('roundups/top10-hotels-' + prov + '.json'))
    ? rd(C('roundups/top10-hotels-' + prov + '.json')).entries : [];
  return rd(p).entries.slice(0, n).map((e, i) => ({
    name: e.name, score: e.score, rev: e.revCount, price: e.priceBig,
    img: e.img || (th[i] && th[i].img) || '',
    url: P(lang, '/' + String(e.reviewUrl || '').replace(/\.html$/, '')),
    /* The zone string is a whole sentence in the source
       ("คาบสมุทรพระนาง · หาดไร่เลย์ · ไปได้ทางเรือเท่านั้น"). A card eyebrow is a
       location, and that one wrapped to three lines and made one rail card
       55px taller than its neighbours. Keep the first segment, which is the
       zone; the rest is in the review, where it belongs. */
    zone: String(e.mrtTag || '').replace(/^📍\s*/, '').split(' · ')[0],
    /* All three OTAs, not just Agoda. Every roundup entry carries agodaUrl,
       bookingUrl and tripUrl; this generator read only the first, so the
       homepage — the page with the most traffic — offered one of the site's
       three booking partners. Booking.com goes through the /go/b worker route,
       never a CJ link in the HTML (CLAUDE.md: the CJ id lives in worker.js and
       nowhere else, so changing it is a 30-second deploy instead of an 18,000-
       page rebuild). */
    type: e.type, agoda: e.agodaUrl, booking: goB(e.bookingUrl, 'home'), trip: e.tripUrl
  }));
}
function artBlocks(slug, lang, n, needPhoto) {
  const p = C(L[lang].art + '/' + slug + '.json');
  if (!ex(p)) return [];
  const thPath = C('articles/' + slug + '.json');
  const thBy = {};
  if (ex(thPath)) for (const b of (rd(thPath).blocks || [])) if (b.kind === 'restaurant') thBy[b.rank] = b;
  const pick = (b) => {
    const own = blockImg(b);
    if (isReal(own)) return { img: own, cr: b.gallery && b.gallery[0] };
    const th = thBy[b.rank];
    const thi = th ? blockImg(th) : '';
    if (isReal(thi)) return { img: thi, cr: th.gallery && th.gallery[0] };
    return { img: own || thi || '', cr: null };
  };
  let bs = (rd(p).blocks || []).filter(b => b.kind === 'restaurant');
  if (needPhoto) bs = bs.filter(b => isReal(pick(b).img));
  return bs.slice(0, n).map(b => {
    const got = pick(b);
    return {
      rank: b.rank, name: b.name, zone: b.zone || b.area, area: b.area,
      rating: b.rating, count: b.ratingCount, src: b.ratingSrc,
      hours: b.hours, price: b.priceRange, lat: b.lat, lng: b.lng,
      img: got.img,
      credit: got.cr && got.cr.credit ? got.cr.credit : '',
      creditHref: got.cr && got.cr.creditHref ? got.cr.creditHref : '',
      alt: (got.cr && got.cr.alt) || '',
      kindLabel: b.foodType || b.cuisine, href: P(lang, '/' + slug + '#r' + b.rank)
    };
  });
}
/* The only dates on this page come from the source file's own modifiedDate.
   A roundup with no date gets no date — never an invented "checked" stamp. */
const MON_TH = ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'];
const MON_EN = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
function artDate(slug, lang) {
  const p = C('articles/' + slug + '.json');
  if (!ex(p)) return '';
  const d = rd(p).modifiedDate || rd(p).publishedDate;
  if (!d) return '';
  const m = /^(\d{4})-(\d{2})/.exec(d);
  if (!m) return '';
  const mm = parseInt(m[2], 10) - 1;
  return lang === 'th' ? (MON_TH[mm] + ' ' + m[1]) : (MON_EN[mm] + ' ' + m[1]);
}

function countHotelReviews(prov) {
  const dir = C('reviews');
  let n = 0;
  for (const f of fs.readdirSync(dir)) if (f.endsWith('-' + prov + '.json')) n++;
  return n;
}

/* ───────────────────────────── panel definitions ─────────────────────────── */
/* Chosen by what is verifiably on disk (a hotel roundup + a restaurant article
   + 4 photographed attractions), not by fame. Pattaya and Koh Samui are
   deliberately absent: neither has top10-attractions-* or
   top10-popular-restaurants-*, and a faked shelf is worse than no tab. */
const PANELS = [
  { slug: 'krabi', seeArt: 'top10-attractions-krabi', eatArt: 'top10-popular-restaurants-krabi' },
  { slug: 'chiang-mai', seeArt: 'top10-attractions-chiang-mai', eatArt: 'top10-popular-restaurants-chiang-mai' },
  { slug: 'phuket', seeArt: 'top10-attractions-phuket', eatArt: 'top10-popular-restaurants-phuket' },
  /* Bangkok has no province-level attractions article — it pools from its ย่าน
     articles and each card carries the ย่าน as its eyebrow. */
  {
    slug: 'bangkok', eatArt: 'top10-popular-restaurants-bangkok',
    seePool: [['riverside', 1], ['riverside', 2], ['chinatown', 2], ['silom-sathorn', 2]]
  },
  { slug: 'ayutthaya', seeArt: 'top10-attractions-ayutthaya', eatArt: 'top10-popular-restaurants-ayutthaya' },
  { slug: 'chiang-rai', seeArt: 'top10-attractions-chiang-rai', eatArt: 'top10-popular-restaurants-chiang-rai' }
];

function panelData(p, lang) {
  const stay = stays(p.slug, lang, 4);
  const eat = artBlocks(p.eatArt, lang, 4, false);
  let see = [];
  if (p.seeArt) see = artBlocks(p.seeArt, lang, 4, true);
  else {
    for (const [hood, rank] of p.seePool) {
      const all = artBlocks('top10-attractions-' + hood, lang, 30, false);
      const hit = all.find(b => b.rank === rank);
      if (hit && isReal(hit.img)) see.push(Object.assign({}, hit, { hood, href: P(lang, '/top10-attractions-' + hood + '#r' + rank) }));
    }
  }
  return {
    stay, eat, see,
    stayHref: P(lang, '/top10-hotels-' + p.slug),
    eatHref: P(lang, '/' + p.eatArt),
    seeHref: P(lang, p.seeArt ? '/' + p.seeArt : '/city-bangkok'),
    eatDate: artDate(p.eatArt, lang),
    seeDate: p.seeArt ? artDate(p.seeArt, lang) : artDate('top10-attractions-riverside', lang),
    hotelCount: countHotelReviews(p.slug)
  };
}

/* ─────────────────────────────── plan data ───────────────────────────────── */
const PLAN_KEYS = [
  ['krabi', '1-day'], ['krabi', '2d1n'], ['krabi', '3d2n'],
  ['chiang-mai', '3d2n'], ['phuket', '3d2n'],
  ['bangkok', '2d1n'], ['bangkok', '3d2n'],
  ['ayutthaya', '2d1n'], ['ayutthaya', '3d2n'],
  ['pai', '3d2n'], ['chiang-rai', '3d2n']
];
function planData(lang) {
  const out = {};
  for (const [d, t] of PLAN_KEYS) {
    const p = C(L[lang].art + '/' + d + '-' + t + '-itinerary.json');
    if (!ex(p)) continue;
    const j = rd(p);
    const hub = HUBS.byslug[ALIAS[d] || d];
    const st = stays(hub ? hub.slug : d, lang, 1)[0] || null;
    out[d + '|' + t] = {
      href: P(lang, '/' + d + '-' + t + '-itinerary'),
      dest: hub ? (lang === 'th' ? hub.th : hub.en) : d,
      slug: hub ? hub.slug : d,
      title: String(j.h1 || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim(),
      src: String(j.title || '').split('|')[0].replace(/\s+—.*$/, '').trim(),
      /* Absolute, never the bare content key. This object is handed to
         TA.poi.putAll() when a plan is adopted, and /trip renders a stored
         img verbatim: a bare images/hotels/... key resolves to a path that
         ships only on R2, so the saved thumbnail 404s there in production. */
      stay: st && { name: st.name, url: st.url, img: r2(st.img), price: st.price, rev: st.rev,
        agoda: st.agoda, booking: st.booking, trip: st.trip },
      days: (j.blocks || []).filter(b => b.kind === 'day').map(b => ({
        label: b.label, title: b.title,
        items: (b.items || []).map(i => ({ t: i.time, a: i.activity }))
      }))
    };
  }
  return out;
}

/* ─────────────── the eight ready-made plans that have card art ───────────── */
const GUIDES = [
  ['krabi', '3d2n'], ['chiang-mai', '3d2n'], ['bangkok', '3d2n'], ['phuket', '3d2n'],
  ['pai', '3d2n'], ['ayutthaya', '2d1n'], ['samui', '3d2n'], ['kanchanaburi', '3d2n']
];
/* the six one-tap plan chips */
const CHIPS = [
  ['krabi', '3d2n'], ['chiang-mai', '3d2n'], ['bangkok', '2d1n'],
  ['phuket', '3d2n'], ['pai', '3d2n'], ['ayutthaya', '2d1n']
];
const POPULAR = ['krabi', 'chiang-mai', 'bangkok', 'phuket', 'samui', 'pai', 'khaoyai', 'huahin'];

const PILLS = [
  ['best-beaches-thailand', 'หาดสวย', 'Best beaches'],
  ['best-quiet-islands-thailand', 'เกาะเงียบ', 'Quiet islands'],
  ['best-cafe-hopping-thailand', 'คาเฟ่', 'Cafés'],
  ['best-viewpoints-mountains-thailand', 'จุดชมวิว', 'Viewpoints'],
  ['best-historic-old-towns-thailand', 'เมืองเก่า', 'Old towns'],
  ['best-temples-thailand', 'วัด', 'Temples'],
  ['best-waterfalls-thailand', 'น้ำตก', 'Waterfalls'],
  ['thailand-diving', 'ดำน้ำ', 'Diving'],
  ['best-islands-snorkeling-thailand', 'ดำน้ำตื้น', 'Snorkelling'],
  ['michelin-guide-thailand-2026', 'ร้านมิชลิน', 'Michelin restaurants'],
  ['bars-50-best-bangkok', 'บาร์ 50 Best', "Asia's 50 Best bars"],
  ['family-travel-thailand', 'เที่ยวกับเด็ก', 'With kids'],
  ['best-family-beaches-thailand', 'หาดสำหรับครอบครัว', 'Family beaches'],
  ['best-of-thailand-2026', 'ที่สุดของไทย 2026', 'Best of Thailand 2026']
];

const STATS = {
  reviews: fs.readdirSync(C('reviews')).filter(f => f.endsWith('.json')).length,
  roundups: fs.readdirSync(C('roundups')).filter(f => f.endsWith('.json')).length,
  articles: fs.readdirSync(C('articles')).filter(f => f.endsWith('.json')).length,
  plans: fs.readdirSync(C('articles')).filter(f => /itinerary\.json$/.test(f)).length,
  provinces: HUBS.all.filter(h => h.prov).length
};

/* ───────────────────────────────── copy ──────────────────────────────────── */
const T = {
  th: {
    lang: 'th', dir: 'ltr', selfLabel: 'ไทย', otherHref: 'en/home', otherLabel: 'English',
    up: '', canonical: 'https://thailandaddict.com/_proto/home.html',
    title: 'วางแผนเที่ยวไทย 2026 — ที่พัก ที่กิน ที่เที่ยว จากรีวิวที่เราเขียนเอง | ThailandAddict',
    desc: 'เลือกจุดหมายกับจำนวนวัน แล้วดูแผนเที่ยวได้ทันที พร้อมที่พัก ที่กิน ที่เที่ยวจริงจากรีวิวที่เราเขียนเอง ครบ 77 จังหวัด',
    skip: 'ข้ามไปเนื้อหาหลัก',
    navExplore: 'สำรวจ', navPlaces: 'จุดหมาย', navTrip: 'ทริป', navSearch: 'ค้นหา', navMore: 'เมนู',
    searchLabel: 'ค้นหา', searchPh: 'ที่พัก ร้านอาหาร จุดหมาย',
    h1: 'วางแผนเที่ยวไทย จากที่พัก ที่กิน ที่เที่ยว ที่เรารีวิวเอง',
    lead: 'เลือกจุดหมายกับจำนวนวัน แล้วกดดูแผน — หรือเลื่อนลงไปกด 🔖 เก็บที่ที่ชอบไว้ก่อนก็ได้',
    slotEyebrow: 'จัดทริปเอง ใน 2 แตะ',
    lWhere: 'ไปไหน', phWhere: 'เลือกจุดหมาย', lNights: 'กี่วัน',
    tier: { '1-day': '1 วัน', '2d1n': '2 วัน 1 คืน', '3d2n': '3 วัน 2 คืน', '4plus': '4 วัน+' },
    /* One row of four chips only fits if the visible word is the day count.
       The nights ride along as screen-reader text, so the accessible name is
       still the full tier and nothing is hidden from anybody. */
    tierShort: { '1-day': '1 วัน', '2d1n': '2 วัน', '3d2n': '3 วัน', '4plus': '4 วัน+' },
    tierSr: { '1-day': '', '2d1n': ' 1 คืน', '3d2n': ' 2 คืน', '4plus': '' },
    submit: 'ดูแผนเลย',
    fine: 'แผนมาจากคู่มือที่เราเขียนเอง ไม่ใช่ AI แต่งขึ้น',
    showH2: 'ที่พัก ที่กิน ที่เที่ยว ที่เรารีวิวเอง',
    showLabel: (p) => 'ที่พัก ที่กิน ที่เที่ยว ใน' + p,
    showMore: 'ดูทั้งหมด →',
    kStay: 'ที่พัก', kEat: 'ที่กิน', kSee: 'ที่เที่ยว',
    noJsEscape: 'หรือดูจุดหมายทั้งหมด →',
    sheetTitle: 'เลือกจุดหมาย', sheetPh: 'พิมพ์ชื่อจังหวัดหรือเกาะ',
    sheetPop: 'ยอดนิยม', sheetByRegion: 'ตามภาค', close: 'ปิด', noMatch: 'ไม่พบจุดหมายที่ค้นหา',
    chipsEyebrow: 'แผนยอดนิยม แตะเดียวได้เลย',
    conflictTitle: 'มีทริปอยู่แล้ว', conflictAdd: 'เพิ่มเข้าทริปเดิม',
    conflictNew: 'สร้างทริปใหม่ (เก็บทริปเดิมไว้ในที่บันทึก)', cancel: 'ยกเลิก',
    deckH2: 'เลือกจุดหมาย แล้วดูที่พัก ที่กิน ที่เที่ยว',
    deckAll: 'ดูทั้ง 77 จังหวัด →',
    addingTo: 'กำลังเพิ่มเข้า:', savedList: 'ที่บันทึกไว้',
    shStay: (p) => 'พักที่ไหนดีใน' + p, shEat: (p) => 'กินอะไรดีใน' + p, shSee: (p) => 'เที่ยวไหนดีใน' + p,
    tlStay: (p) => 'ดูที่พัก' + p + 'ทั้งหมด →', tlEat: (p) => 'ดูร้านอาหาร' + p + 'ทั้งหมด →', tlSee: (p) => 'ดูที่เที่ยว' + p + 'ทั้งหมด →',
    readReview: 'อ่านรีวิวเต็ม →', readMore: 'อ่านต่อ →',
    saveOff: 'เก็บไว้ก่อน', saveOn: 'บันทึกแล้ว',
    priceFrom: 'จาก', perNight: '/ คืน', approx: 'ราคาเริ่มประมาณ', updated: (d) => 'อัปเดต ' + d,
    unknownHours: 'ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป',
    reviewsWord: 'รีวิว', free: 'ฟรี',
    inventory: (p, n) => p + ': ที่พักที่เรารีวิวเอง ' + n + ' แห่ง',
    dockH2: 'ในทริปของคุณ', dockOpen: 'เปิดแผน',
    pillsH2: 'เลือกตามสิ่งที่อยากทำ',
    answerH2: 'เที่ยวไทยครั้งแรก เริ่มยังไงดี',
    answerP: 'เริ่มจากเลือกทะเลหรือภูเขาก่อน แล้วค่อยเลือกเมือง — ถ้ามีเวลา 3 วัน 2 คืน จุดหมายที่เดินทางง่ายที่สุดคือ กระบี่ (ทะเลอันดามัน บินตรงจากกรุงเทพ 1 ชั่วโมง 20 นาที) เชียงใหม่ (เมืองเก่า ดอย คาเฟ่) และกรุงเทพเอง (วัด ตลาด รถไฟฟ้าถึงเกือบทุกที่) ทั้งสามมีแผนรายวันพร้อมใช้บนเว็บนี้ พร้อมที่พักที่เรารีวิวเองรายแห่ง เดือนที่อากาศดีที่สุดของฝั่งอันดามันคือ พฤศจิกายน–เมษายน ส่วนอ่าวไทยฝนมาช้ากว่า จึงเที่ยวได้ถึงกันยายน',
    answerMore: 'อ่านคู่มือเที่ยวไทยครั้งแรก →',
    guidesH2: 'แผนพร้อมใช้ — ก๊อปไปแก้ต่อได้', guideRead: 'อ่านแผนเต็ม', guideUse: 'ใช้แผนนี้',
    regionsH2: 'เลือกตามภาค — 77 จังหวัด', regionOpen: 'ดูรายชื่อจุดหมาย', regionsAll: 'ดูจุดหมายทั้งหมด →',
    regionCount: (n, d) => n + ' จังหวัด' + (d ? ' + ' + d + ' เมืองท่องเที่ยว' : ''),
    statsH2: 'เว็บนี้มีอะไรบ้าง',
    stReview: 'รีวิวที่พักรายแห่ง', stRound: 'ไกด์จัดอันดับ', stArt: 'บทความและคู่มือ',
    stPlan: 'แผนรายวัน', stProv: 'จังหวัด · 9 ภาษา',
    statsNote: 'นับจากไฟล์เนื้อหาไทยในระบบ ตรวจนับ 8 กันยายน 2026',
    editorH2: 'ใครเขียนเว็บนี้', editorEyebrow: 'บรรณาธิการ', editorMore: 'อ่านเกี่ยวกับเรา →',
    newsH2: 'รับไกด์ใหม่ทางอีเมล',
    newsLead: 'เดือนละไม่กี่ฉบับ — คู่มือจังหวัดใหม่ ที่พักที่เพิ่งรีวิว และแผนเที่ยวที่อัปเดต ยกเลิกได้ทุกเมื่อ',
    newsLabel: 'อีเมลของคุณ', newsBtn: 'สมัครรับข่าว', newsPh: 'you@example.com',
    footDesc: 'ชีวิตติดเที่ยว — ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย',
    footTag: 'Thailandaddict — Explore Thailand Like a Local',
    footAbout: 'เกี่ยวกับเรา', footDest: 'จุดหมายทั้งหมด', footTrip: 'ทริปของฉัน', footNear: 'ใกล้ฉัน', footSearch: 'ค้นหา',
    protoNote: 'หน้านี้เป็นต้นแบบ (prototype) ตั้ง noindex ไว้ และไม่ได้ลิงก์จากเว็บจริง',
    myTrip: 'ทริปของคุณ', resumeOpen: 'เปิดแผน', resumeNew: 'เริ่มทริปใหม่', resumeHide: 'ซ่อนไว้ก่อน',
    resumePlanNew: '＋ วางแผนที่ใหม่',
    makeDays: 'จัดเป็นวัน ๆ ให้เลย',
    localOnly: 'เก็บไว้ในเบราว์เซอร์นี้เท่านั้น — ไม่มีใครเห็น และเราไม่ได้เก็บไว้ที่เซิร์ฟเวอร์',
    railTitle: 'ทริปของคุณ', railEmpty: 'ยังไม่มีรายการ — กด 🔖 ที่การ์ดไหนก็ได้เพื่อเริ่ม', railOpen: 'เปิดหน้าทริป',
    moreDisplay: 'การแสดงผล', moreTheme: 'ธีม', moreThemeSys: 'ตามระบบ', moreLang: 'ภาษา',
    moreTrip: 'ทริปของฉัน', moreNear: 'ใกล้ฉัน', moreInstall: 'ติดตั้งเป็นแอป',
    faq: [
      ['เที่ยวไทย 3 วัน 2 คืน ไปไหนดี',
       'ถ้าเดินทางจากกรุงเทพและมีเวลา 3 วัน 2 คืน จุดหมายที่คุ้มเวลาที่สุดคือ กระบี่ (บินตรงราว 1 ชั่วโมง 20 นาที ได้ทั้งหาด ทัวร์สี่เกาะ และธรรมชาติบนบก) เชียงใหม่ (เมืองเก่า ดอยสุเทพ คาเฟ่ ครบใน 3 วัน) และอยุธยาแบบ 2 วัน 1 คืน ถ้าไม่อยากบิน เว็บนี้มีแผนรายวันของทั้งสามที่ให้อ่านฉบับเต็ม'],
      ['เที่ยวไทยเดือนไหนดีที่สุด',
       'ฝั่งอันดามัน (ภูเก็ต กระบี่ พังงา) อากาศดีที่สุดช่วงพฤศจิกายนถึงเมษายน ส่วนฝั่งอ่าวไทย (สมุย พะงัน) ฝนมาช้ากว่า จึงเที่ยวได้ยาวถึงกันยายน ภาคเหนืออากาศเย็นและฟ้าใสที่สุดช่วงพฤศจิกายนถึงกุมภาพันธ์ แต่ช่วงมีนาคมถึงเมษายนมักมีหมอกควันจากการเผา'],
      ['จองที่พักเว็บไหนถูกกว่ากัน',
       'ไม่มีเว็บไหนถูกที่สุดตลอด เราเทียบ Agoda / Booking.com / Trip.com ไว้บนทุกรีวิว ราคาต่างกันบ่อยและเปลี่ยนตามช่วงเวลา แนะนำให้เช็กทั้งสามเว็บก่อนกดจอง']
    ]
  },
  en: {
    lang: 'en', dir: 'ltr', selfLabel: 'English', otherHref: '../home', otherLabel: 'ไทย',
    up: '../', canonical: 'https://thailandaddict.com/_proto/en/home.html',
    title: 'Plan a Thailand trip 2026 — stays, food and places we reviewed ourselves | ThailandAddict',
    desc: 'Pick a destination and how many days, and see a real day-by-day plan built from stays, restaurants and sights we reviewed ourselves, across all 77 provinces.',
    skip: 'Skip to main content',
    navExplore: 'Explore', navPlaces: 'Destinations', navTrip: 'Trip', navSearch: 'Search', navMore: 'More',
    searchLabel: 'Search', searchPh: 'Stays, restaurants, destinations',
    h1: 'Plan a Thailand trip from the stays, food and places we reviewed ourselves',
    lead: 'Pick a destination and how many days, then see the plan — or scroll on and tap 🔖 to keep places for later.',
    slotEyebrow: 'Build your own trip in two taps',
    lWhere: 'Where to', phWhere: 'Choose a destination', lNights: 'How long',
    tier: { '1-day': '1 day', '2d1n': '2 days, 1 night', '3d2n': '3 days, 2 nights', '4plus': '4 days+' },
    tierShort: { '1-day': '1 day', '2d1n': '2 days', '3d2n': '3 days', '4plus': '4 days+' },
    tierSr: { '1-day': '', '2d1n': ', 1 night', '3d2n': ', 2 nights', '4plus': '' },
    submit: 'Show me the plan',
    fine: 'Plans come from guides we wrote, not from an AI',
    showH2: 'Stays, food and places we reviewed ourselves',
    showLabel: (p) => 'Stay, eat and explore in ' + p,
    showMore: 'See all →',
    kStay: 'Stay', kEat: 'Eat', kSee: 'See',
    noJsEscape: 'Or browse every destination →',
    sheetTitle: 'Choose a destination', sheetPh: 'Type a province or island',
    sheetPop: 'Popular', sheetByRegion: 'By region', close: 'Close', noMatch: 'No destination matches that',
    chipsEyebrow: 'Popular plans — one tap',
    conflictTitle: 'You already have a trip', conflictAdd: 'Add to the existing trip',
    conflictNew: 'Start a new trip (the old one moves to saved)', cancel: 'Cancel',
    deckH2: 'Pick a destination, then see where to stay, eat and go',
    deckAll: 'See all 77 provinces →',
    addingTo: 'Adding to:', savedList: 'Saved',
    shStay: (p) => 'Where to stay in ' + p, shEat: (p) => 'Where to eat in ' + p, shSee: (p) => 'What to see in ' + p,
    tlStay: (p) => 'All ' + p + ' stays →', tlEat: (p) => 'All ' + p + ' restaurants →', tlSee: (p) => 'All ' + p + ' sights →',
    readReview: 'Read the full review →', readMore: 'Read more →',
    saveOff: 'Keep this', saveOn: 'Saved',
    priceFrom: 'From', perNight: '/ night', approx: 'approximate starting price', updated: (d) => 'updated ' + d,
    unknownHours: 'Opening hours not confirmed — check before you go',
    reviewsWord: 'reviews', free: 'Free',
    inventory: (p, n) => p + ': ' + n + ' stays we reviewed ourselves',
    dockH2: 'In your trip', dockOpen: 'Open the plan',
    pillsH2: 'Browse by what you want to do',
    answerH2: 'First time in Thailand — where do you start?',
    answerP: 'Start by choosing coast or mountains, then pick the town. With three days and two nights the easiest bases are Krabi (Andaman beaches, a 1 hour 20 minute flight from Bangkok, four-island boat trips and inland nature), Chiang Mai (old town, Doi Suthep, cafés) and Bangkok itself (temples, markets, and a train to almost everything). All three have a day-by-day plan on this site and individual hotel reviews behind every stay. The Andaman coast is driest from November to April; the Gulf coast keeps its rain later, so it still works through September.',
    answerMore: 'Read the first-time Thailand guide →',
    guidesH2: 'Ready-made plans — copy one and edit it', guideRead: 'Read the full plan', guideUse: 'Use this plan',
    regionsH2: 'By region — all 77 provinces', regionOpen: 'See the destinations', regionsAll: 'See every destination →',
    regionCount: (n, d) => n + ' provinces' + (d ? ' + ' + d + ' tourism towns' : ''),
    statsH2: "What's on this site",
    stReview: 'Individual hotel reviews', stRound: 'Ranked guides', stArt: 'Articles and guides',
    stPlan: 'Day-by-day plans', stProv: 'provinces · 9 languages',
    statsNote: 'Counted from the Thai content files in the repo, 8 September 2026',
    editorH2: 'Who writes this site', editorEyebrow: 'Editor', editorMore: 'About us →',
    newsH2: 'New guides by email',
    newsLead: 'A few emails a month — new province guides, stays we have just reviewed, and updated plans. Unsubscribe any time.',
    newsLabel: 'Your email', newsBtn: 'Subscribe', newsPh: 'you@example.com',
    footDesc: 'The best places to stay, eat and explore across Thailand',
    footTag: 'Thailandaddict — Explore Thailand Like a Local',
    footAbout: 'About us', footDest: 'All destinations', footTrip: 'My trip', footNear: 'Near me', footSearch: 'Search',
    protoNote: 'This is a prototype page. It is noindex and is not linked from the live site.',
    myTrip: 'Your trip', resumeOpen: 'Open the plan', resumeNew: 'Start a new trip', resumeHide: 'Hide for now',
    resumePlanNew: '＋ Plan somewhere new',
    makeDays: 'Sort them into days for me',
    localOnly: 'Kept in this browser only — nobody else can see it and we do not store it on a server',
    railTitle: 'Your trip', railEmpty: 'Nothing yet — tap 🔖 on any card to start', railOpen: 'Open the trip page',
    moreDisplay: 'Display', moreTheme: 'Theme', moreThemeSys: 'System', moreLang: 'Language',
    moreTrip: 'My trip', moreNear: 'Near me', moreInstall: 'Install as an app',
    faq: [
      ['Where should I go in Thailand for 3 days and 2 nights?',
       'Leaving from Bangkok with three days and two nights, the destinations that waste the least time are Krabi (a 1 hour 20 minute flight, with beaches, the four-island boat trip and inland nature), Chiang Mai (old town, Doi Suthep and cafés all fit in three days), and Ayutthaya as a 2 day, 1 night trip if you would rather not fly. This site has a full day-by-day plan for all three.'],
      ['What is the best month to visit Thailand?',
       'The Andaman side (Phuket, Krabi, Phang Nga) is at its best from November to April. The Gulf side (Koh Samui, Koh Phangan) gets its rain later, so it still works into September. The north is coolest and clearest from November to February, but March and April often bring burning-season haze.'],
      ['Which booking site is cheaper?',
       'No single site is always cheapest. We show Agoda, Booking.com and Trip.com side by side on every review because the prices genuinely differ and move around. Check all three before you book.']
    ]
  }
};

/* ─────────────────────────── rendering helpers ───────────────────────────── */
const SRC_RE = /(Agoda|Booking\.com|Booking|Trip\.com|Wongnai|Google|TripAdvisor|Klook)/g;

/* Never composite two sources into one number. A revCount string that names
   exactly one source AND leads with it gets a big score; anything else is
   rendered verbatim as a source line with no headline number. */
/* The headline number, but ONLY when the revCount string names exactly one
   source and leads with it. Returns '' when the number cannot be attributed —
   e.g. top10-hotels-phuket entry 1 carries score "9.4" while its own revCount
   reads "Agoda 9.1 · Booking 9.0 · 379 รีวิว": 9.4 belongs to no named source,
   so it is neither printed nor handed to the save record. */
function attributableScore(revCount) {
  const s = String(revCount || '').trim();
  if (!s) return null;
  const hits = s.match(SRC_RE) || [];
  const lead = /^(Agoda|Booking\.com|Booking|Trip\.com|Wongnai|Google|Klook)\s+([0-9]+(?:\.[0-9]+)?)\s*(?:·\s*)?(.*)$/.exec(s);
  if (hits.length === 1 && lead) return { num: lead[2], src: lead[1], tail: lead[3].trim() };
  return null;
}
function scoreMarkup(revCount, t) {
  const s = String(revCount || '').trim();
  if (!s) return '';
  const a = attributableScore(s);
  if (a) {
    return '<span class="ta-score"><b>' + esc(a.num) + '</b> <span class="ta-score-src">'
      + esc(a.src + (a.tail ? ' · ' + a.tail : '')) + '</span></span>';
  }
  return '<span class="ta-score-src">' + esc(s) + '</span>';
}
function ratingMarkup(b, t) {
  if (!b.rating || !b.src) return '';
  const tail = b.count ? b.src + ' · ' + nfmt(b.count) + ' ' + t.reviewsWord : b.src;
  return '<span class="ta-score"><b>' + esc(Number(b.rating).toFixed(1)) + '</b> <span class="ta-score-src">' + esc(tail) + '</span></span>';
}
/* A closed-day note that the source data itself states. Never inferred. */
function closedFlag(hours, lang) {
  const s = String(hours || '');
  const th = /ปิด(วัน)?(จันทร์|อังคาร|พุธ|พฤหัส|ศุกร์|เสาร์|อาทิตย์)/.exec(s);
  if (th) return th[0];
  const en = /closed\s+[A-Za-z]+(?:days)?/i.exec(s);
  if (en) return en[0];
  return '';
}
function poiId(kind, prov, slugOrRank) {
  return kind + ':' + prov + '-' + slugOrRank;
}
/* Krabi ids are pinned to the ones /_proto/trip.html already seeds, so a place
   saved here is the same object there — not a duplicate. */
const KRABI_ATTR_ID = {
  1: 'a:krabi-lan-poo-dam', 2: 'a:krabi-khao-khanab-nam',
  3: 'a:krabi-wat-tham-suea', 4: 'a:krabi-railay-beach'
};

function saveBtn(o, t, extra) {
  return '<button class="ta-save" type="button" aria-pressed="false" data-save'
    + ' data-id="' + esc(o.id) + '" data-poi-id="' + esc(o.id) + '"'
    + ' data-kind="' + esc(o.kind) + '" data-name="' + esc(o.name) + '"'
    + ' data-url="' + esc(o.url) + '"'
    + (o.img ? ' data-img="' + esc(o.img) + '"' : '')
    + ' data-province="' + esc(o.province) + '"'
    + (o.lat ? ' data-lat="' + o.lat + '" data-lng="' + o.lng + '"' : '')
    + (o.score ? ' data-score="' + esc(o.score) + '"' : '')
    + (o.price ? ' data-price-from="' + esc(o.price) + '"' : '')
    + ' data-dur="' + (o.dur || 90) + '" data-source="home-deck" data-trip-href="' + t.tripHref + '"'
    + (extra || '')
    + '><span aria-hidden="true">🔖</span>'
    + '<span class="ta-save-off">' + esc(t.saveOff) + '</span>'
    + '<span class="ta-save-on">' + esc(t.saveOn) + '</span></button>';
}

/* Card art. The originals are full-size photographs served from R2 (they are
   excluded from the deploy bundle by .assetsignore); painting them into a
   264 CSS px card cost 526 KB on first view alone and put the page at 651 KB
   against a 500 KB budget — measured 2026-09-09 over the wire, because the
   Resource Timing API reports cross-origin R2 responses as 0 bytes and hides
   this entirely. _internal/shell/build/gen-proto-cards.mjs pre-crops each one
   to 3:2 under images/_cards (which IS bundled), so the width/height below are
   the real intrinsic dimensions rather than a decorative guess.
   sizes is measured, not assumed: the card renders at 264 px inside a 375 px
   viewport (70vw), so a phone at DPR 2 needs 528 px and picks the 560.
   If a derivative is missing the card falls back to the R2 original, which is
   heavy but never broken. */
const CARD_W = 560, CARD_H = 373;
const cardBase = (rel) =>
  'images/_cards/' + String(rel).replace(/^\//, '').replace(/^images\//, '').replace(/\.[a-z0-9]+$/i, '');

function cardArt(img, alt, t) {
  const base = cardBase(img);
  const disk = path.join(ROOT, 'astro/public', base);
  if (!img || !ex(disk + '-560.webp') || !ex(disk + '-560.jpg')) {
    return '<img src="' + esc(r2(img)) + '" alt="' + esc(alt) + '" loading="lazy" decoding="async">';
  }
  const u = t.asset + base;   /* site root, not /_proto/ — see build() */
  return '<picture>'
    + '<source type="image/webp" srcset="' + esc(u) + '-560.webp 560w'
    + (ex(disk + '-880.webp') ? ', ' + esc(u) + '-880.webp 880w' : '')
    + '" sizes="(max-width: 1023px) 70vw, 360px">'
    + '<img src="' + esc(u) + '-560.jpg" alt="' + esc(alt) + '"'
    + ' width="' + CARD_W + '" height="' + CARD_H + '" loading="lazy" decoding="async">'
    + '</picture>';
}

function photoCard(o, t) {
  return '<article class="ta-card">'
    + '<a class="ta-media ta-r-3-2" href="' + esc(o.url) + '" data-vt-hero>'
    + cardArt(o.img, o.alt, t)
    + '</a>'
    + '<div class="ta-card-body">'
    + '<span class="eyebrow">' + esc(o.eyebrow) + '</span>'
    + '<h4 class="ta-card-title"><a class="ta-clamp-2" href="' + esc(o.url) + '">' + esc(o.name) + '</a></h4>'
    + '<p class="ta-card-meta">' + o.meta + '</p>'
    + (o.flag ? '<p class="ta-flag ' + o.flagClass + '">' + esc(o.flag) + '</p>' : '')
    /* CC-BY-SA photos keep their attribution, as a real link, at 44px. */
    + (o.credit ? '<p class="ta-card-credit">' + (o.creditHref
        ? '<a href="' + esc(o.creditHref) + '" rel="noopener nofollow" target="_blank">' + esc(o.credit) + '</a>'
        : esc(o.credit)) + '</p>' : '')
    + '<div class="ta-card-foot">'
    + '<a class="ta-btn ta-btn-quiet" href="' + esc(o.url) + '">' + esc(o.cta) + '</a>'
    + saveBtn(o.save, t)
    + '</div></div></article>';
}

/* The eat tile is deliberately typographic. Only 22 of 1,100 restaurant blocks
   on this site carry a real photograph and 299 sit on stock library images; a
   stock noodle picture above a named restaurant is a small lie, and not telling
   them is the whole point of the site. The dense line below is what the data
   really supports: 99.8% have hours, 99.2% have coordinates, 89% a rating. */
function eatTile(o, t) {
  return '<article class="ta-card ta-eat-tile">'
    + '<div class="ta-card-body">'
    + '<span class="eyebrow">' + esc(o.eyebrow) + '</span>'
    + '<h4 class="ta-card-title"><a class="ta-clamp-2" href="' + esc(o.url) + '">' + esc(o.name) + '</a></h4>'
    + '<p class="ta-card-meta">' + o.meta + '</p>'
    + (o.hours ? '<p class="ta-eat-hours"><svg class="ta-ic ta-ic-16" aria-hidden="true"><use href="#i-clock"></use></svg> ' + esc(o.hours) + '</p>'
      : '<p class="ta-flag ta-flag-unknown">' + esc(t.unknownHours) + '</p>')
    + (o.flag ? '<p class="ta-flag ta-flag-warn">' + esc(o.flag) + '</p>' : '')
    + '<div class="ta-card-foot">'
    + '<a class="ta-btn ta-btn-quiet" href="' + esc(o.url) + '">' + esc(t.readMore) + '</a>'
    + saveBtn(o.save, t)
    + '</div></div></article>';
}

/* ────────────────────────── the fold showcase ────────────────────────────
   ONE full-width photograph of a real reviewed place, carrying its name, its
   score, the SOURCE of that score and its price — plus a rail of five more
   across all three of ที่พัก / ที่กิน / ที่เที่ยว. Read from the same panel data
   the deck below uses, so there is no second set of facts to keep true.

   Measured 2026-09-09, before this existed: the first photograph of a real
   place sat at y=1134 on a 375x812 phone whose fold is at 755. The visitor's
   entire first screen was a heading and a form. */
function foldArt(img, alt, root, lead) {
  const base = cardBase(img);
  const disk = path.join(ROOT, 'astro/public', base);
  if (!img || !ex(disk + '-560.webp') || !ex(disk + '-560.jpg')) {
    /* An R2 original is heavy but never broken; it is also never reached for
       any row this page actually ships — gen-proto-cards has a derivative for
       every one of them. */
    return '<img src="' + esc(r2(img)) + '" alt="' + esc(alt) + '"'
      + (lead ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">';
  }
  const u = root + base;
  const big = ex(disk + '-880.webp');
  /* sizes is measured, not assumed. Lead: full wrap width, which is
     100vw - 2rem below 1024px and a 400px-min grid column above it. Rail card:
     min(46%, 168px) of the wrap. */
  const sizes = lead
    ? '(max-width: 1023px) calc(100vw - 2rem), 560px'
    : '(max-width: 1023px) 46vw, 200px';
  return '<picture>'
    + '<source type="image/webp" srcset="' + esc(u) + '-560.webp 560w'
    + (big ? ', ' + esc(u) + '-880.webp 880w' : '')
    + '" sizes="' + sizes + '">'
    + '<img src="' + esc(u) + '-560.jpg" alt="' + esc(alt) + '"'
    + ' width="' + CARD_W + '" height="' + CARD_H + '"'
    /* The lead photograph is the first thing on the page that is worth
       looking at; it is never lazy and never low priority. */
    + (lead ? ' fetchpriority="high"' : ' loading="lazy"') + ' decoding="async">'
    + '</picture>';
}

/* Normalised showcase rows. Order is deliberate: the lead is the #1-ranked
   stay (the only row type that carries BOTH an attributed score and a price),
   then see · eat · stay · see · eat so all three categories are in the rail
   and the two visible rail slots on a phone are a sight and a restaurant. */
function foldRows(p, lang, t) {
  const d = p.data, pn = lang === 'th' ? p.hub.th : p.hub.en, prov = p.hub.slug;
  const stayRow = (s) => {
    const a = attributableScore(s.rev);
    return {
      kind: 'stay', kindLabel: t.kStay, zone: s.zone || s.type || pn,
      name: s.name, url: s.url, img: s.img, alt: s.name + ' — ' + pn,
      meta: (a ? '<b>' + esc(a.num) + '</b> ' + esc(a.src + (a.tail ? ' · ' + a.tail : '')) : esc(String(s.rev || '')))
        + (s.price ? ' · ' + esc(t.priceFrom) + ' ' + esc(s.price) + ' ' + esc(t.perNight) : '')
    };
  };
  const seeRow = (s) => ({
    kind: 'see', kindLabel: t.kSee, zone: s.zone || s.area || pn,
    name: s.name, url: s.href, img: s.img, alt: s.alt || (s.name + ' — ' + pn),
    meta: (s.rating && s.src)
      ? '<b>' + esc(Number(s.rating).toFixed(1)) + '</b> ' + esc(s.src + (s.count ? ' · ' + nfmt(s.count) + ' ' + t.reviewsWord : ''))
      : esc(s.price || '')
  });
  const eatRow = (e) => ({
    kind: 'eat', kindLabel: t.kEat, zone: e.zone || e.area || pn,
    name: e.name, url: e.href, img: '', alt: '',
    meta: (e.rating && e.src)
      ? '<b>' + esc(Number(e.rating).toFixed(1)) + '</b> ' + esc(e.src + (e.count ? ' · ' + nfmt(e.count) + ' ' + t.reviewsWord : ''))
      : '',
    /* 99.8% of restaurant blocks carry real hours; the ones that do not say so
       out loud rather than showing a confident blank. */
    sub: [e.price, e.hours].filter(Boolean).join(' · ') || t.unknownHours
  });
  const rail = [];
  if (d.see[0]) rail.push(seeRow(d.see[0]));
  if (d.eat[0]) rail.push(eatRow(d.eat[0]));
  if (d.stay[1]) rail.push(stayRow(d.stay[1]));
  if (d.see[1]) rail.push(seeRow(d.see[1]));
  if (d.eat[1]) rail.push(eatRow(d.eat[1]));
  return { prov, name: pn, lead: d.stay[0] ? stayRow(d.stay[0]) : (d.see[0] ? seeRow(d.see[0]) : null), rail };
}

/* WHY THE FACTS ARE NOT ON THE PHOTOGRAPH.
   The first build put name + score + source + price inside .ta-scrim-body.
   Measured on the rendered page: the scrim band is 55% of a 192px image =
   106px, and its easing puts .72 ink only at the very bottom — .28 at 42% up
   and .08 at 68% up. A three-line block is 124px, so its top two lines sat on
   0–28% ink. On the Krabi photograph that happens to be dark foliage and it
   reads; on a bright sky (Phuket, Samui) the same block is white-on-white.
   The 55% cap is a design-system rule, not a suggestion, and a text-shadow
   would be papering over it. So the shell's scrim keeps doing the one job it
   is built for — a short caption over an image — and every figure the visitor
   is asked to trust sits on the page's own surface at full contrast. The photo
   is also not darkened at all, which is the better-looking outcome anyway. */
function foldLeadHtml(o, root) {
  if (!o) return '';
  /* ONE anchor for the whole card, not an anchor on the photo plus a second
     one on the title. A 24px title link is the most common way a page fails
     the 44px floor; wrapping the card makes the target the card. */
  return '<a class="ta-fshow-lead" href="' + esc(o.url) + '" data-vt-hero>'
    + '<span class="ta-media ta-r-16-9">'
    + foldArt(o.img, o.alt, root, true)
    /* A solid ink pill, not scrim text: legible over any photograph by
       construction rather than by luck. */
    + '<span class="ta-fshow-badge">' + esc(o.kindLabel) + ' · ' + esc(o.zone) + '</span>'
    + '</span>'
    + '<h3 class="ta-fshow-name">' + esc(o.name) + '</h3>'
    + '<span class="ta-fshow-meta">' + o.meta + '</span>'
    + '</a>';
}

function foldCardHtml(o, root) {
  if (o.kind === 'eat') {
    return '<a class="ta-fcard ta-fcard-eat" href="' + esc(o.url) + '">'
      + '<span class="eyebrow">' + esc(o.kindLabel) + ' · ' + esc(o.zone) + '</span>'
      + '<span class="ta-fcard-name ta-clamp-2">' + esc(o.name) + '</span>'
      + (o.meta ? '<span class="ta-fcard-meta">' + o.meta + '</span>' : '')
      + '<span class="ta-fcard-sub ta-clamp-2">' + esc(o.sub || '') + '</span>'
      + '</a>';
  }
  return '<a class="ta-fcard" href="' + esc(o.url) + '" data-vt-hero>'
    + '<span class="ta-media ta-r-3-2">' + foldArt(o.img, o.alt, root, false) + '</span>'
    + '<span class="eyebrow">' + esc(o.kindLabel) + ' · ' + esc(o.zone) + '</span>'
    + '<span class="ta-fcard-name ta-clamp-1">' + esc(o.name) + '</span>'
    + (o.meta ? '<span class="ta-fcard-meta ta-clamp-2">' + o.meta + '</span>' : '')
    + '</a>';
}

/* ───────────────────────────── the page itself ───────────────────────────── */

/* The nine locales this homepage exists in. It is the homepage: it exists in
   every locale that has one, which is all nine, so this is the one place on the
   site where a hard-coded nine is the correct availability answer rather than a
   lazy one. Everything else must ask whether the page really exists. */
const HOME_LOCALES = ['th', 'en', 'zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const homeHref = (l) => (l === 'th' ? '/' : '/' + l + '/');
/* Locale-prefix a site-root path, for all nine. `P()` above is the th/en-only
   version this file already had; it stays because it is applied to hrefs that
   may ALREADY carry a prefix. */
const LP = (l, p) => (l === 'th' ? p : '/' + l + p);

/* Footer copy for chrome.mjs::footer(), read from astro/src/i18n/ui.<lang>.json
   — which carries a complete, human-checked footer block in all nine languages
   and has been sitting unused. Every label here therefore exists in every
   locale, which is why none of the links is a city name: those live in
   _internal/province-data-<loc>/ for 30 cities only, and a footer that silently
   fell back to Thai for the other six locales is the defect this avoids. */
const UI_HOME = {};
function uiOf(lang) {
  if (!(lang in UI_HOME)) {
    try { UI_HOME[lang] = rd(path.join(ROOT, 'astro/src/i18n', 'ui.' + lang + '.json')); }
    catch { UI_HOME[lang] = null; }
  }
  return UI_HOME[lang];
}
function homeFooter(lang) {
  const s = (sec, key) => {
    const mine = (uiOf(lang) || {})[sec];
    if (mine && mine[key]) return mine[key];
    const en = (uiOf('en') || {})[sec];
    return (en && en[key]) || '';
  };
  const at = (p) => LP(lang, p);
  return {
    /* Bare — chrome.mjs::footer() already prefixes ctx.brand and an em dash. */
    tagline: s('footer', 'tagline'),
    blurb: s('footer', 'description'),
    columns: [
      { title: s('footer', 'colDestinations'), links: [
        { href: at('/country-thailand'), label: s('footer', 'linkAllThailand') },
        { href: at('/destinations'), label: s('nav', 'tourismCities') },
        { href: at('/region-north'), label: s('nav', 'regionNorth') },
        { href: at('/region-south'), label: s('nav', 'regionSouth') },
      ] },
      { title: s('footer', 'colContent'), links: [
        { href: at('/plan-your-trip'), label: s('footer', 'linkPrepTrip') },
        { href: '/trip', label: s('nav', 'planTrip') },
        { href: at('/search'), label: s('nav', 'searchCta') },
      ] },
      { title: s('footer', 'colAbout'), links: [
        { href: at('/about'), label: s('footer', 'linkAboutUs') },
        { href: at('/editorial-policy'), label: s('footer', 'linkEditorialPolicy') },
        { href: at('/contact'), label: s('footer', 'linkContact') },
        { href: at('/privacy'), label: s('footer', 'linkPrivacy') },
      ] },
    ],
    legal: s('footer', 'affiliateDisclosure'),
    note: s('footer', 'copyright'),
  };
}

/* ctx for _internal/lib/chrome.mjs, documented in chrome.mjs §3.
   `tab:'explore'` because the homepage IS the Explore destination — it is the
   one page on the site that gets aria-current on that tab. */
function shellCtx(lang) {
  const pfx = homeHref(lang);
  const at = (p) => LP(lang, p);
  return {
    locale: lang,
    dir: dirOf(lang),
    kind: 'home',
    tab: 'explore',
    path: pfx,
    brand: 'Thailandaddict',
    locales: HOME_LOCALES.map((l) => ({ code: l, href: homeHref(l) })),
    href: {
      home: pfx,
      /* /country-thailand, not /destinations — the same target gen-hubs gives
         the Destinations tab on every other page. A tab bar that lands
         somewhere different depending on which page you tapped it from is not
         a tab bar. */
      places: at('/country-thailand'),
      search: at('/search'),
      trip: '/trip',
      /* /saved does not exist yet (blueprint §5.7); /my-list is the list page
         that ships today, and it is root-only like /trip. */
      saved: '/my-list',
      nearMe: at('/near-me'),
    },
    footer: homeFooter(lang),
    railHref: '/trip',
  };
}

function build(lang, target) {
  const isSite = target === 'site';
  const base = T[lang];
  /* The two targets differ in exactly one mechanical way: where the document
     sits. At the site root, / and /en/index.html can both name assets
     absolutely. The /_proto/ mirror is two and three directories down, so it
     keeps the relative climb it already had:
       `up`    reaches /_proto/  ('' from _proto/home.html, '../' from _proto/en/)
       `asset` reaches the SITE ROOT — one level above that, which is why the
               prototype writes ../ and ../../.
     Anything under /images must use `asset`, never `up`: measured 2026-09-09,
     every _cards path on both prototype pages resolved to
     /_proto/images/_cards/… and 404'd. They are lazy and far below the fold, so
     nothing in the console or the network panel showed it. */
  const asset = isSite ? '/' : base.up + '../';
  const tripHref = isSite ? '/trip' : base.up + 'trip';
  /* canonical is the ONE string that differs between the two targets everywhere
     it is used — <link rel=canonical>, og:url and the WebPage JSON-LD all read
     it, and a real homepage that told Google its canonical was
     /_proto/home.html would be worse than not shipping at all. */
  const canonical = isSite ? SITE_URL + homeHref(lang) : base.canonical;
  const t = Object.assign({}, base, { asset, tripHref, canonical, site: isSite });
  const up = base.up;
  const root = asset;
  const NAME = (h) => lang === 'th' ? h.th : h.en;
  const RN = (k) => lang === 'th' ? HUBS.REG[k].th : HUBS.REG[k].en;
  const RI = (k) => lang === 'th' ? HUBS.REG[k].intro : HUBS.REG[k].intro_en;
  const plans = planData(lang);
  const panels = PANELS.map(p => ({ def: p, hub: HUBS.byslug[p.slug], data: panelData(p, lang) }));

  /* ---- destination <select>, six optgroups, 77 real options --------------
     The default deck panel is preselected, so the select, the submit label,
     the showcase and the deck all name the same real destination on first
     paint and the visitor is never looking at an unprimed machine. */
  const DEFAULT_DEST = panels[0].hub.slug;
  const optgroups = REGION_ORDER.map(r => {
    const opts = SELECTABLE.filter(d => d.hub.region === r)
      .sort((a, b) => NAME(a.hub).localeCompare(NAME(b.hub), lang))
      .map(d => '<option value="' + esc(d.it) + '" data-hub="' + esc(d.hub.slug) + '"'
        + (d.hub.slug === DEFAULT_DEST ? ' selected' : '')
        + (d.tiers['1-day'] ? ' data-p1="' + esc(d.tiers['1-day']) + '"' : '')
        + (d.tiers['2d1n'] ? ' data-p2="' + esc(d.tiers['2d1n']) + '"' : '')
        + ' data-p3="' + esc(d.tiers['3d2n']) + '">' + esc(NAME(d.hub)) + '</option>').join('');
    return '<optgroup label="' + esc(RN(r)) + '">' + opts + '</optgroup>';
  }).join('');

  /* ---- duration chips: one row of four ----------------------------------- */
  const nightChips = [['1-day', '1'], ['2d1n', '2'], ['3d2n', '3'], ['4plus', '4']]
    .map(([k, v]) => '<li><label class="ta-fac ta-fac-radio">'
      + '<input type="radio" name="n" value="' + v + '" data-tier="' + k + '"' + (k === '3d2n' ? ' checked' : '') + '>'
      + '<span>' + esc(t.tierShort[k])
      + (t.tierSr[k] ? '<span class="ta-sr">' + esc(t.tierSr[k]) + '</span>' : '')
      + '</span></label></li>').join('');

  /* ---- one-tap plan chips ------------------------------------------------ */
  const chips = CHIPS.map(([d, tier]) => {
    const p = plans[d + '|' + tier];
    const hub = HUBS.byslug[ALIAS[d] || d];
    const label = NAME(hub) + ' · ' + t.tier[tier];
    return '<li><a class="ta-btn ta-btn-ghost" href="' + esc(p ? p.href : P(lang, '/' + d + '-' + tier + '-itinerary')) + '"'
      + ' data-plan-chip="' + esc(d) + '" data-plan-tier="' + esc(tier) + '">' + esc(label) + '</a></li>';
  }).join('');

  /* ---- the deck ---------------------------------------------------------- */
  const tabs = panels.map((p, i) =>
    '<a role="tab" href="#deck-' + p.hub.slug + '" id="dt-' + p.hub.slug + '" aria-controls="deck-' + p.hub.slug + '"'
    + ' aria-selected="' + (i === 0 ? 'true' : 'false') + '" data-deck-tab="' + p.hub.slug + '">' + esc(NAME(p.hub)) + '</a>').join('');

  const dayStrip = '<div class="ta-deck-strip">'
    + '<span class="ta-deck-strip-label">' + esc(t.addingTo) + '</span>'
    + '<span class="ta-tablist ta-deck-days" role="tablist" aria-label="' + esc(t.addingTo) + '" data-day-strip>'
    + '<button role="tab" type="button" aria-selected="true" data-add-target="saves">' + esc(t.savedList) + '</button>'
    + '</span></div>';

  const panelsHtml = panels.map((p, i) => {
    const pn = NAME(p.hub), d = p.data, prov = p.hub.slug;

    const stayCards = d.stay.map(s => photoCard({
      url: s.url, img: s.img, alt: s.name + ' — ' + pn, eyebrow: s.zone || s.type,
      name: s.name, cta: t.readReview,
      meta: scoreMarkup(s.rev, t)
        + '<span class="ta-chip">' + esc(t.priceFrom) + ' <span class="ta-num">' + esc(s.price) + '</span> ' + esc(t.perNight)
        + '<span class="ta-checked">' + esc(t.approx) + '</span></span>',
      save: {
        /* The POI id must be locale-independent: ta.trip.v1 is ONE document per
           browser shared by every locale (see trip.html), so deriving the id
           from the localised URL made the same hotel "s:rayavadee-krabi" in Thai
           and "s:/en/review-rayavadee-krabi" in English — the save button read
           unsaved after a language switch and the stay could enter one trip
           twice. Strip the locale segment before building the id. */
        id: 's:' + s.url.replace(/^\/(?:[a-z]{2}\/)?review-/, ''), kind: 'stay', name: s.name, url: s.url,
        /* data-img is stored verbatim in ta.saves.v3 and re-rendered on /trip and
           in the resume card, so it must be a URL that resolves in production.
           images/hotels/** is excluded from the deploy bundle by .assetsignore
           and lives only on R2 — a bare path would 404 for every reader. */
        img: r2(s.img), province: prov,
        /* only a score the page is willing to print with its source named */
        score: (attributableScore(s.rev) || {}).num || '',
        price: String(s.price).replace(/[^0-9]/g, ''), dur: 0
      }
    }, t)).join('');

    const eatTiles = d.eat.map(e => eatTile({
      url: e.href, eyebrow: [e.zone, e.kindLabel].filter(Boolean).join(' · '),
      name: e.name, hours: e.hours, flag: closedFlag(e.hours, lang),
      meta: (ratingMarkup(e, t) || '')
        + (e.price ? '<span class="ta-chip"><span class="ta-num">' + esc(e.price) + '</span></span>' : ''),
      save: {
        id: 'e:' + prov + '-resto--' + e.rank, kind: 'eat', name: e.name, url: e.href,
        img: isReal(e.img) ? r2(e.img) : '', province: prov,
        score: (e.rating && e.src) ? e.rating : '', lat: e.lat, lng: e.lng, dur: 75
      }
    }, t)).join('');

    const seeCards = d.see.map(s => photoCard({
      url: s.href, img: s.img, alt: s.alt || (s.name + ' — ' + pn),
      credit: s.credit, creditHref: s.creditHref,
      eyebrow: s.zone || s.area,
      name: s.name, cta: t.readMore,
      meta: (ratingMarkup(s, t) || '')
        + (s.price ? '<span class="ta-chip">' + esc(s.price) + '</span>' : ''),
      flag: s.hours ? s.hours : t.unknownHours,
      flagClass: s.hours ? 'ta-flag-ok' : 'ta-flag-unknown',
      save: {
        id: prov === 'krabi' && KRABI_ATTR_ID[s.rank] && !s.hood ? KRABI_ATTR_ID[s.rank] : 'a:' + prov + '-attr--' + s.rank,
        kind: 'see', name: s.name, url: s.href, img: r2(s.img), province: prov,
        score: (s.rating && s.src) ? s.rating : '', lat: s.lat, lng: s.lng, dur: 90
      }
    }, t)).join('');

    return '<section class="ta-deck-panel" role="tabpanel" id="deck-' + prov + '" aria-labelledby="dt-' + prov + '" tabindex="0"'
      + (i === 0 ? '' : ' hidden') + '>'
      + '<p class="ta-deck-intro">' + esc(t.inventory(pn, d.hotelCount)) + '</p>'

      + '<div class="ta-shelf"><div class="ta-sec-head"><h3>' + esc(t.shStay(pn)) + '</h3>'
      + '<a class="ta-sec-more" href="' + esc(d.stayHref) + '">' + esc(t.tlStay(pn)) + '</a></div>'
      + '<div class="ta-scroll-cards ta-chip-scroll">' + stayCards + '</div></div>'

      + '<div class="ta-shelf"><div class="ta-sec-head"><h3>' + esc(t.shEat(pn)) + '</h3>'
      + (d.eatDate ? '<span class="ta-fine ta-shelf-date">' + esc(t.updated(d.eatDate)) + '</span>' : '')
      + '<a class="ta-sec-more" href="' + esc(d.eatHref) + '">' + esc(t.tlEat(pn)) + '</a></div>'
      + '<div class="ta-scroll-cards ta-chip-scroll">' + eatTiles + '</div></div>'

      + '<div class="ta-shelf"><div class="ta-sec-head"><h3>' + esc(t.shSee(pn)) + '</h3>'
      + (d.seeDate ? '<span class="ta-fine ta-shelf-date">' + esc(t.updated(d.seeDate)) + '</span>' : '')
      + '<a class="ta-sec-more" href="' + esc(d.seeHref) + '">' + esc(t.tlSee(pn)) + '</a></div>'
      + '<div class="ta-scroll-cards ta-chip-scroll">' + seeCards + '</div></div>'
      + '</section>';
  }).join('\n');

  /* ---- ready-made plan cards -------------------------------------------- */
  const guideCards = GUIDES.map(([d, tier]) => {
    const p = C(L[lang].art + '/' + d + '-' + tier + '-itinerary.json');
    if (!ex(p)) return '';
    const j = rd(p);
    const hub = HUBS.byslug[ALIAS[d] || d];
    const href = P(lang, '/' + d + '-' + tier + '-itinerary');
    const card = root + 'images/_cards/cm/' + d + '-' + tier + '-itinerary-560';
    const nDays = (j.blocks || []).filter(b => b.kind === 'day').length;
    return '<article class="ta-card">'
      + '<a class="ta-media ta-r-3-2" href="' + href + '" data-vt-hero>'
      + '<picture><source type="image/webp" srcset="' + card + '.webp">'
      + '<img src="' + card + '.jpg" alt="' + esc(String(j.h1 || '').replace(/<br\s*\/?>/gi, ' ')) + '" width="560" height="373" loading="lazy" decoding="async"></picture></a>'
      + '<div class="ta-card-body"><span class="eyebrow">' + esc(NAME(hub)) + ' · ' + esc(t.tier[tier]) + '</span>'
      + '<h3 class="ta-card-title"><a class="ta-clamp-2" href="' + href + '">'
      + esc(String(j.h1 || '').replace(/<br\s*\/?>/gi, ' ').replace(/\s+/g, ' ').trim()) + '</a></h3>'
      + '<p class="ta-fine ta-clamp-3">' + esc(String(j.intro || '').replace(/<[^>]+>/g, '').slice(0, 150)) + '</p>'
      + '<div class="ta-card-foot"><a class="ta-btn ta-btn-quiet" href="' + href + '">' + esc(t.guideRead) + '</a>'
      + '<button class="ta-btn ta-btn-primary" type="button" data-plan-adopt="' + d + '" data-plan-tier="' + tier + '"'
      + ' data-plan-days="' + nDays + '">' + esc(t.guideUse) + '</button></div></div></article>';
  }).join('\n');

  /* ---- regions: 89 crawlable destination links --------------------------- */
  const regionCards = REGION_ORDER.map(r => {
    const provs = HUBS.all.filter(h => h.region === r && h.prov);
    const dests = HUBS.all.filter(h => h.region === r && !h.prov);
    const links = [...provs, ...dests]
      .map(h => '<li><a href="' + P(lang, '/city-' + h.slug) + '">' + esc(NAME(h)) + '</a></li>').join('');
    return '<article class="ta-card">'
      + '<div class="ta-card-body">'
      + '<h3 class="ta-card-title"><a href="' + P(lang, '/region-' + HUBS.REG[r].slug) + '">' + esc(RN(r)) + '</a></h3>'
      + '<p class="ta-fine">' + esc(t.regionCount(provs.length, dests.length)) + '</p>'
      /* clamp-2, not clamp-3: six region intros at three lines each is 168px of
         a page that was three times its own budget, and the clamp is CSS —
         the full sentence stays in the DOM for a crawler either way. */
      + '<p class="ta-fine ta-clamp-2">' + esc(RI(r)) + '</p>'
      /* All six closed. One open card among five closed ones read as a
         rendering fault, and the open northern list alone was 336px of
         wrapped pills on a phone. The 89 destination anchors are in the DOM
         either way — <details> hides them from the reader, never from a
         crawler or from TA.segmentQuery in the destination sheet. */
      + '<details class="ta-region-list">'
      + '<summary><svg class="ta-ic ta-ic-16 i-chevron" aria-hidden="true"><use href="#i-chevron"></use></svg> ' + esc(t.regionOpen) + '</summary>'
      + '<ul class="ta-region-links">' + links + '</ul></details>'
      + '</div></article>';
  }).join('\n');

  /* ---- destination sheet: popular chips (the region list is cloned) ------ */
  const popChips = POPULAR.map(s => {
    const d = SELECTABLE.find(x => x.it === s);
    if (!d) return '';
    return '<li><button class="ta-fac" type="button" data-pick-dest="' + esc(d.it) + '">' + esc(NAME(d.hub)) + '</button></li>';
  }).join('');

  const pills = PILLS.map(([slug, th, en]) =>
    '<li><a class="ta-btn ta-btn-ghost" href="' + P(lang, '/' + slug) + '">' + esc(lang === 'th' ? th : en) + '</a></li>').join('');

  /* ---- JSON-LD ----------------------------------------------------------- */
  const site = 'https://thailandaddict.com/';
  const krabi = panels[0];
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'WebSite', name: 'ThailandAddict', url: site,
      inLanguage: lang,
      potentialAction: { '@type': 'SearchAction', target: { '@type': 'EntryPoint', urlTemplate: site + 'search?q={search_term_string}' }, 'query-input': 'required name=search_term_string' }
    },
    {
      '@context': 'https://schema.org', '@type': 'Organization', name: 'ThailandAddict', url: site,
      description: t.footDesc
    },
    {
      '@context': 'https://schema.org', '@type': 'ItemList',
      name: t.shStay(NAME(krabi.hub)) + ' · ' + t.shEat(NAME(krabi.hub)) + ' · ' + t.shSee(NAME(krabi.hub)),
      itemListOrder: 'https://schema.org/ItemListOrderAscending',
      numberOfItems: krabi.data.stay.length + krabi.data.eat.length + krabi.data.see.length,
      itemListElement: [
        ...krabi.data.stay.map((s, i) => ({
          '@type': 'ListItem', position: i + 1, url: site + s.url.replace(/^\//, ''),
          item: { '@type': 'Hotel', name: s.name, url: site + s.url.replace(/^\//, ''), image: r2(s.img), address: { '@type': 'PostalAddress', addressLocality: NAME(krabi.hub), addressCountry: 'TH' } }
        })),
        ...krabi.data.eat.map((e, i) => ({
          '@type': 'ListItem', position: krabi.data.stay.length + i + 1, url: site + e.href.replace(/^\//, ''),
          item: Object.assign({ '@type': 'Restaurant', name: e.name, url: site + e.href.replace(/^\//, '') },
            e.lat ? { geo: { '@type': 'GeoCoordinates', latitude: e.lat, longitude: e.lng } } : {},
            e.hours ? { openingHours: e.hours } : {},
            e.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: e.rating, ratingCount: e.count || undefined, bestRating: 5 } } : {})
        })),
        ...krabi.data.see.map((s, i) => ({
          '@type': 'ListItem', position: krabi.data.stay.length + krabi.data.eat.length + i + 1, url: site + s.href.replace(/^\//, ''),
          item: Object.assign({ '@type': 'TouristAttraction', name: s.name, url: site + s.href.replace(/^\//, ''), image: r2(s.img) },
            s.lat ? { geo: { '@type': 'GeoCoordinates', latitude: s.lat, longitude: s.lng } } : {},
            s.rating ? { aggregateRating: { '@type': 'AggregateRating', ratingValue: s.rating, ratingCount: s.count || undefined, bestRating: 5 } } : {})
        }))
      ]
    },
    {
      '@context': 'https://schema.org', '@type': 'ItemList', name: t.guidesH2,
      numberOfItems: GUIDES.length,
      itemListElement: GUIDES.map(([d, tier], i) => ({
        '@type': 'ListItem', position: i + 1,
        name: (HUBS.byslug[ALIAS[d] || d] ? NAME(HUBS.byslug[ALIAS[d] || d]) : d) + ' · ' + t.tier[tier],
        url: site + P(lang, '/' + d + '-' + tier + '-itinerary').slice(1)
      }))
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } }))
    },
    {
      '@context': 'https://schema.org', '@type': 'WebPage', url: t.canonical, name: t.title,
      speakable: { '@type': 'SpeakableSpecification', cssSelector: ['.ta-answer-body', 'h1'] }
    }
  ];
  if (EDITOR && EDITOR.name) {
    ld.push({
      '@context': 'https://schema.org', '@type': 'Person', name: EDITOR.name,
      jobTitle: lang === 'th' ? EDITOR.role : EDITOR.roleEn,
      description: lang === 'th' ? EDITOR.bio : EDITOR.bioEn,
      image: r2(EDITOR.image), worksFor: { '@type': 'Organization', name: 'ThailandAddict', url: site }
    });
  } else {
    ld.push({ '@context': 'https://schema.org', '@type': 'Organization', name: 'ThailandAddict', url: site });
  }

  /* ---- fold showcase ------------------------------------------------------
     Rendered statically for the default panel so it is complete with scripting
     off; the same rows for all six panels ride along in TA_HOME.fold so a tab
     tap re-renders it without a fetch and without a second copy of the facts. */
  const showAll = panels.map(p => foldRows(p, lang, t));
  /* The rail ends in a real link into the deck — the "see all" that used to
     cost a 44px row of its own in the section head. */
  /* No data-deck-tab here on purpose: the delegated handler would preventDefault
     and re-select the panel that is already selected, so the tap would do
     nothing visible. A bare hash anchor scrolls to the panel — and the deck and
     the showcase are always on the same destination, so the target is always
     the visible panel. Works identically with scripting off. */
  const moreTile = (slug) => '<a class="ta-fcard ta-fcard-more" href="#deck-' + esc(slug) + '">'
    + '<svg class="ta-ic i-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg>'
    + '<span>' + esc(t.showMore.replace(/\s*→$/, '')) + '</span></a>';
  const railHtml = (s) => s.rail.map(o => foldCardHtml(o, root)).join('') + moreTile(s.prov);
  const show0 = showAll[0];
  const foldLead = foldLeadHtml(show0.lead, root);
  const foldRail = railHtml(show0);
  const foldData = {};
  for (const s of showAll) {
    foldData[s.prov] = { name: s.name, lead: foldLeadHtml(s.lead, root), rail: railHtml(s) };
  }

  /* ---- page --------------------------------------------------------------- */
  return PAGE({ t, lang, isSite, ctx: shellCtx(lang), up, root, optgroups, nightChips, chips, tabs, dayStrip, panelsHtml,
    guideCards, regionCards, popChips, pills, ld, plans, panels, NAME,
    foldLead, foldRail, foldData });
}

/* ────────────────────────────── page template ───────────────────────────── */
function PAGE(x) {
  const { t, lang, isSite, ctx, up, root, optgroups, nightChips, chips, tabs, dayStrip, panelsHtml,
    guideCards, regionCards, popChips, pills, ld, plans, panels, NAME,
    foldLead, foldRail, foldData } = x;

  const SPRITE = fs.readFileSync(path.join(ROOT, '_internal/shell/build/sprite.svg'), 'utf8').trim();
  const CSS = fs.readFileSync(path.join(ROOT, '_internal/shell/build/home.page.css'), 'utf8').trim();
  const JS = fs.readFileSync(path.join(ROOT, '_internal/shell/build/home.page.js'), 'utf8').trim();

  return `<!doctype html>
<html lang="${ctx.locale}" dir="${ctx.dir}">
<head>
<meta charset="utf-8">
${isSite ? GA_HEAD : ''}
${isSite ? SITE_HEAD(t, lang) : PROTO_HEAD(t, up)}

<!-- viewport, both theme-colors, the hashed shell stylesheet, the pagereveal
     handler, the speculation rules and shell.js — all of it from
     _internal/lib/chrome.mjs, the same string Shell.astro and gen-hubs emit.
     It used to be hand-copied here, including the hashed filenames, which
     drifted: gen-shell re-hashes on every shell edit and a stale name is a 404
     that renders as an unstyled page with nothing in the console to say why. -->
${shellHead(ctx)}

<script>
document.documentElement.setAttribute('data-js', '');
/* ~200 bytes, parser-blocking on purpose: decides which of the three planner
   states paints FIRST, inside a height-reserved box, so there is no flash and
   no layout shift. It reads lengths only — it never parses the trip. */
try {
  var _t = localStorage.getItem('ta.trip.v1') || '';
  var _s = localStorage.getItem('ta.saves.v3') || '';
  var _has = _t.indexOf('"items":[{') > -1 || /"days":\\[\\s*\\{/.test(_t);
  document.documentElement.setAttribute('data-trip',
    _has ? 'has' : (_s.indexOf('{') > -1 && _s.length > 8 ? 'saves' : 'none'));
} catch (e) { document.documentElement.setAttribute('data-trip', 'none'); }
</script>

<style>
${CSS}
</style>
</head>
<body>
${shellTop(ctx)}

<main class="ta-main" id="main">
  <div class="ta-wrap">

    <!-- ══════════════════════════ FOLD: question + answer ═══════════════════
         Two columns from 1024px. Identical DOM, grid only: the deck is hoisted
         beside the planner so the answer lands with no scroll and no jump. -->
    <div class="ta-fold">
      <div class="ta-fold-ask">

        <!-- 2. LCP is text. The photograph below is a real reviewed place, not
             a decorative header, so it never competes with the heading. -->
        <h1 class="ta-h1">${esc(t.h1)}</h1>

        <!-- 3. THE PLANNER SLOT — one height-reserved box, three states.
             Which one paints is decided by :root[data-trip] before first paint,
             so CLS is 0 and there is never an empty app screen.
             Compressed from 418px to ~220px on 2026-09-09: the two stacked
             field labels, the eyebrow that repeated the h2, the second row of
             duration chips and the two-line fine print between them cost 200px
             of the first screen and said nothing the controls do not. -->
        <section class="ta-planslot" id="taPlanSlot" aria-labelledby="h-plan">
          <h2 class="ta-sr" id="h-plan">${esc(t.slotEyebrow)}</h2>

          <!-- ── STATE C · first-timer ─────────────────────────────────── -->
          <form class="ta-plan-form" data-plan-form method="get" action="/destinations">

            <div class="ta-plan-select">
              <svg class="ta-ic ta-ic-20 ta-plan-pin" aria-hidden="true"><use href="#i-map-pin"></use></svg>
              <label class="ta-plan-label" for="planDest">${esc(t.lWhere)}</label>
              <!-- Preselected, not a placeholder. The default deck panel, the
                   showcase rail and the submit button all name the same real
                   destination from first paint, so the button reads
                   "${esc(t.tier['3d2n'])}" for a real place instead of a generic
                   verb — and the visitor can see the machine works before
                   touching anything. The choice is one tap away and the button
                   always says out loud which destination it will use. -->
              <select id="planDest" name="d" data-plan-dest required>
                <option value="" disabled>${esc(t.phWhere)}</option>
                ${optgroups}
              </select>
              <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-chevron"></use></svg>
            </div>

            <span class="ta-sr" id="lblNights">${esc(t.lNights)}</span>
            <ul class="ta-chip-row ta-plan-nights" aria-labelledby="lblNights" data-plan-nights>
              ${nightChips}
            </ul>

            <p class="ta-flag ta-flag-unknown ta-plan-miss" data-plan-miss hidden></p>

            <button class="ta-btn ta-btn-primary ta-plan-go" type="submit" data-plan-submit>${esc(t.submit)}</button>
            <p class="ta-fine">${esc(t.fine)}</p>
            <a class="ta-plan-escape" href="${P(lang,'/destinations')}">${esc(t.noJsEscape)}</a>
          </form>

          <!-- ── STATE B · saves but no days ───────────────────────────── -->
          <div class="ta-plan-resume" data-plan-saves>
            <p class="eyebrow">${esc(t.myTrip)}</p>
            <p class="ta-plan-resume-lead" data-saves-lead></p>
            <ul class="ta-plan-thumbs" data-saves-thumbs></ul>
            <div class="ta-plan-actions">
              <button class="ta-btn ta-btn-primary" type="button" data-make-days>${esc(t.makeDays)}</button>
              <a class="ta-btn ta-btn-quiet" href="${t.tripHref}">${esc(t.resumeOpen)}</a>
            </div>
            <p class="ta-fine">${esc(t.localOnly)}</p>
          </div>

          <!-- ── STATE A · a real trip exists ──────────────────────────── -->
          <div class="ta-plan-resume" data-plan-trip>
            <p class="eyebrow">${esc(t.myTrip)}</p>
            <h3 class="ta-plan-trip-title" data-trip-title></h3>
            <p class="ta-fine" data-trip-meta></p>
            <ul class="ta-plan-thumbs" data-trip-thumbs></ul>
            <div class="ta-plan-actions">
              <a class="ta-btn ta-btn-primary" href="${t.tripHref}">${esc(t.resumeOpen)}</a>
              <button class="ta-btn ta-btn-quiet" type="button" data-trip-reset>${esc(t.resumeNew)}</button>
              <button class="ta-btn ta-btn-ghost" type="button" data-trip-hide>${esc(t.resumeHide)}</button>
            </div>
            <p class="ta-fine">${esc(t.localOnly)}</p>
            <details class="ta-plan-again">
              <summary>${esc(t.resumePlanNew)}</summary>
              <p class="ta-fine" data-plan-again-slot></p>
            </details>
          </div>
        </section>

      </div>

      <!-- One column on desktop, plain flow on a phone. Before this the right
           column held only the plan deck, which is hidden until submit — so
           half of the desktop fold was blank at rest. -->
      <div class="ta-fold-right">

        <!-- The in-place answer. Rendered by JS from a real published
             itinerary. On a phone it lands directly under the planner; on
             desktop it takes the second column, beside the question. -->
        <div class="ta-fold-answer" id="taPlanDeck" data-plan-deck hidden></div>

        <!-- 3b. THE SHOWCASE — the reason this page was redone.
             One full-width photograph of a real reviewed place with its name,
             score, score source and price, then a rail of five more across
             ที่พัก · ที่กิน · ที่เที่ยว. Everything here is read from
             astro/src/content at build time. It follows whichever destination
             the planner and the deck are on, and it is fully rendered with
             scripting off. -->
        <section class="ta-foldshow" aria-labelledby="h-show" data-foldshow>
          <h2 class="ta-sr" id="h-show">${esc(t.showH2)}</h2>
          <!-- No 44px "see all" control in this head: on a 22px eyebrow row it
               costs the fold 22px for a jump the rail's own last tile already
               offers. -->
          <p class="eyebrow ta-foldshow-head" data-show-label>${esc(t.showLabel(NAME(panels[0].hub)))}</p>
          ${foldLead}
          <div class="ta-fshow-rail ta-chip-scroll" data-show-rail>
            ${foldRail}
          </div>
        </section>
      </div>

      <!-- 4. Six real published plans, one tap each. Present in every state,
           so a first-timer is never looking at an empty app. -->
      <nav class="ta-planchips" aria-label="${esc(t.chipsEyebrow)}">
        <ul class="ta-chip-scroll">
          ${chips}
        </ul>
        <p class="ta-fine">${esc(t.localOnly)}</p>
      </nav>
    </div>

    <!-- ══════════════════════════ 5. THE DECK ═══════════════════════════════
         All six panels are in the DOM (five hidden) and never fetched:
         content that is not in the initial HTML is invisible to answer engines,
         and these panels carry a third of this page's links. -->
    <section class="ta-sec ta-deck" id="deck" aria-labelledby="h-deck">
      <div class="ta-sec-head">
        <h2 id="h-deck">${esc(t.deckH2)}</h2>
        <a class="ta-sec-more" href="${P(lang,'/destinations')}">${esc(t.deckAll)}</a>
      </div>

      <div class="ta-tablist" role="tablist" aria-label="${esc(t.deckH2)}">
        ${tabs}
      </div>

      ${dayStrip}

      ${panelsHtml}
    </section>

    <!-- 6. Plan dock — 0px until the first save, then inline (never floating). -->
    <section class="ta-sec ta-plandock" data-plandock hidden aria-labelledby="h-dock">
      <div class="ta-sec-head">
        <h2 id="h-dock">${esc(t.dockH2)} <span class="ta-badge" data-count="0">0</span></h2>
        <a class="ta-sec-more" href="${t.tripHref}">${esc(t.dockOpen)}</a>
      </div>
      <ul class="ta-day-list" data-dock-list></ul>
    </section>

    <!-- ══════════════════════════ 7. ACTIVITY PILLS ═════════════════════════ -->
    <section class="ta-sec" aria-labelledby="h-pills">
      <div class="ta-sec-head"><h2 id="h-pills">${esc(t.pillsH2)}</h2></div>
      <nav class="ta-pills" aria-label="${esc(t.pillsH2)}">
        <ul class="ta-chip-scroll">
          ${pills}
        </ul>
      </nav>
    </section>

    <!-- ══════════════════════════ 8. THE ANSWER ═════════════════════════════ -->
    <section class="ta-sec ta-answer" aria-labelledby="h-answer">
      <div class="ta-sec-head"><h2 id="h-answer">${esc(t.answerH2)}</h2></div>
      <p class="ta-answer-body">${esc(t.answerP)}</p>
      <a class="ta-sec-more" href="${P(lang,'/first-time-thailand')}">${esc(t.answerMore)}</a>
    </section>

    <!-- ══════════════════════════ 9. READY-MADE PLANS ═══════════════════════ -->
    <section class="ta-sec" aria-labelledby="h-guides">
      <div class="ta-sec-head">
        <h2 id="h-guides">${esc(t.guidesH2)}</h2>
        <a class="ta-sec-more" href="${P(lang,'/plan-your-trip')}">${esc(t.readMore)}</a>
      </div>
      <!-- A rail on a phone, a 4-up grid from 1024px — .ta-scroll-cards does
           both, and it is what the deck's shelves use. As a one-column .ta-grid
           these eight cards were 4,657px, 39% of a 12,010px page. -->
      <div class="ta-scroll-cards ta-chip-scroll ta-guides">
        ${guideCards}
      </div>
    </section>

    <!-- ══════════════════════════ 10. REGIONS ═══════════════════════════════
         89 destination links as real anchors inside six <details>: DOM-present,
         therefore crawlable and AI-readable whether or not the element is open. -->
    <section class="ta-sec" aria-labelledby="h-regions">
      <div class="ta-sec-head">
        <h2 id="h-regions">${esc(t.regionsH2)}</h2>
        <a class="ta-sec-more" href="${P(lang,'/destinations')}">${esc(t.regionsAll)}</a>
      </div>
      <div class="ta-grid ta-regions" id="taRegions">
        ${regionCards}
      </div>
    </section>

    <!-- ══════════════════════════ 11–12. NUMBERS + EDITOR ═══════════════════ -->
    <section class="ta-sec" aria-labelledby="h-stats">
      <div class="ta-sec-head"><h2 id="h-stats">${esc(t.statsH2)}</h2></div>
      <dl class="ta-stats">
        <div><dt>${esc(t.stReview)}</dt><dd>${nfmt(STATS.reviews)}</dd></div>
        <div><dt>${esc(t.stRound)}</dt><dd>${nfmt(STATS.roundups)}</dd></div>
        <div><dt>${esc(t.stArt)}</dt><dd>${nfmt(STATS.articles)}</dd></div>
        <div><dt>${esc(t.stPlan)}</dt><dd>${nfmt(STATS.plans)}</dd></div>
        <div><dt>${esc(t.stProv)}</dt><dd>${STATS.provinces}</dd></div>
      </dl>
      <p class="ta-fine">${esc(t.statsNote)}</p>
    </section>

    <section class="ta-sec" aria-labelledby="h-editor">
      <div class="ta-sec-head"><h2 id="h-editor">${esc(t.editorH2)}</h2></div>
      <article class="ta-card ta-card-editorial ta-editor">
        <span class="ta-media ta-r-1-1">
          <picture><source type="image/webp" srcset="${root}images/_cards/team/doctor-chat-avatar-560.webp"><img src="${root}images/_cards/team/doctor-chat-avatar-560.jpg" alt="${esc(EDITOR.name)} ${esc(lang === 'th' ? EDITOR.role : EDITOR.roleEn)}" width="400" height="400" loading="lazy" decoding="async"></picture>
        </span>
        <div class="ta-editor-body">
          <span class="eyebrow">${esc(t.editorEyebrow)}</span>
          <h3 class="ta-editor-name">${esc(EDITOR.name)}</h3>
          <p class="ta-fine">${esc(lang === 'th' ? EDITOR.bio : EDITOR.bioEn)}</p>
          <a class="ta-sec-more" href="${P(lang,'/about')}">${esc(t.editorMore)}</a>
        </div>
      </article>
    </section>

    <!-- ══════════════════════════ 13. NEWSLETTER ════════════════════════════
         Inline, never a modal: a full-viewport app modal on an organic-
         acquisition site is a Google intrusive-interstitial penalty. -->
    <section class="ta-sec ta-news" aria-labelledby="h-news">
      <div class="ta-sec-head"><h2 id="h-news">${esc(t.newsH2)}</h2></div>
      <p class="ta-fine">${esc(t.newsLead)}</p>
      <form class="ta-news-form" action="/api/email" method="post">
        <label class="ta-sr" for="news-email">${esc(t.newsLabel)}</label>
        <input id="news-email" type="email" name="email" required autocomplete="email" placeholder="${esc(t.newsPh)}">
        <button class="ta-btn ta-btn-primary" type="submit">${esc(t.newsBtn)}</button>
      </form>
    </section>

  </div>
</main>

<!-- ═══ 14. FOOTER · TRIP RAIL · TAB BAR · More · language · toast ═══════════
     One call, from _internal/lib/chrome.mjs. All five used to be hand-written
     here, in two languages, from a copy table this file owned — a sixth copy of
     the markup the redesign exists to collapse into one. The footer that comes
     back is the site's real three-column one, sourced from ui.<lang>.json, so
     it carries 11 crawlable links in nine languages instead of 6 in two. -->
${shellBottom(ctx)}
${isSite ? '' : `
<p class="ta-fine ta-wrap">${esc(t.protoNote)}</p>`}

<!-- Destination sheet. The region list inside it is CLONED from the crawlable
     region block above — one link set, two surfaces, authored once. -->
<dialog class="ta-sheet" id="taDest" aria-labelledby="taDestTitle">
  <div class="ta-sheet-grip" aria-hidden="true"></div>
  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title" id="taDestTitle">${esc(t.sheetTitle)}</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="${esc(t.close)}">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>
  <div class="ta-sheet-body">
    <label class="ta-sr" for="destQ">${esc(t.sheetPh)}</label>
    <input class="ta-dest-search" id="destQ" type="search" placeholder="${esc(t.sheetPh)}" data-dest-search>
    <p class="eyebrow" data-dest-pop-head>${esc(t.sheetPop)}</p>
    <ul class="ta-chip-row ta-dest-pop" data-dest-pop>${popChips}</ul>
    <p class="eyebrow" data-dest-region-head>${esc(t.sheetByRegion)}</p>
    <div data-dest-regions></div>
    <p class="ta-fine" data-dest-empty hidden>${esc(t.noMatch)}</p>
  </div>
</dialog>

<!-- Never a silent overwrite of somebody's real trip. -->
<dialog class="ta-sheet" id="taTripConflict" aria-labelledby="taConflictTitle" data-no-light-dismiss>
  <div class="ta-sheet-grip" aria-hidden="true"></div>
  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title" id="taConflictTitle">${esc(t.conflictTitle)}</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="${esc(t.close)}">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>
  <div class="ta-sheet-body">
    <p data-conflict-name></p>
  </div>
  <div class="ta-sheet-foot">
    <button class="ta-btn ta-btn-ghost" type="button" data-sheet-close>${esc(t.cancel)}</button>
    <button class="ta-btn ta-btn-quiet" type="button" data-conflict="merge">${esc(t.conflictAdd)}</button>
    <button class="ta-btn ta-btn-primary" type="button" data-conflict="new">${esc(t.conflictNew)}</button>
  </div>
</dialog>

<div class="ta-toast" data-shell-toast role="status" aria-live="polite" aria-atomic="true"></div>

${ld.map(o => '<script type="application/ld+json">' + J(o) + '</script>').join('\n')}

<script>
window.TA_HOME = {
  lang: ${J(lang)},
  plans: ${J(plans)},
  panels: ${J(panels.map(p => ({ slug: p.hub.slug, name: NAME(p.hub) })))},
  /* Every panel's showcase rows, rendered at build time from the same content
     files the deck reads. Switching destination re-renders from this — no
     fetch, no second copy of the facts, and the default panel is already in
     the HTML so the block is complete with scripting off. */
  fold: ${J(foldData)},
  copy: ${J({
    loading: lang === 'th' ? 'กำลังจัดแผน…' : 'Building the plan…',
    restart: lang === 'th' ? 'เริ่มใหม่' : 'Start over',
    openTrip: lang === 'th' ? 'เปิดในหน้าทริป' : 'Open in the trip planner',
    readFull: lang === 'th' ? 'อ่านคู่มือฉบับเต็ม' : 'Read the full guide',
    prov: lang === 'th' ? 'เรียบเรียงจากคู่มือ “%s” — อ่านฉบับเต็ม →' : 'Adapted from our guide “%s” — read it in full →',
    roll: lang === 'th' ? '%n จุด · เวลาในคู่มือ %a–%b' : '%n stops · guide times %a–%b',
    legMethod: lang === 'th' ? 'เวลาจากคู่มือ ไม่ใช่ระยะทาง' : 'clock gap from the guide, not a distance',
    legGap: lang === 'th' ? '%a → %b · เว้นไว้ %g' : '%a → %b · %g in between',
    hr: lang === 'th' ? ' ชม.' : ' hr', min: lang === 'th' ? ' นาที' : ' min',
    stayRow: lang === 'th' ? 'ค้างคืน' : 'Overnight',
    savedList: lang === 'th' ? 'ที่บันทึกไว้' : 'Saved',
    showLabel: lang === 'th' ? 'ที่พัก ที่กิน ที่เที่ยว ใน%p' : 'Stay, eat and explore in %p',
    dayN: lang === 'th' ? 'วันที่ %n' : 'Day %n',
    addDay: lang === 'th' ? 'เพิ่มเข้าวันที่ %n' : 'Add to day %n',
    saveOff: lang === 'th' ? 'เก็บไว้ก่อน' : 'Keep this',
    saveOn: lang === 'th' ? 'บันทึกแล้ว' : 'Saved',
    tripMeta: lang === 'th' ? '%p จุด · %d วัน · แก้ล่าสุด %e' : '%p stops · %d days · last edited %e',
    ago0: lang === 'th' ? 'วันนี้' : 'today',
    ago1: lang === 'th' ? 'เมื่อวาน' : 'yesterday',
    agoN: lang === 'th' ? '%n วันก่อน' : '%n days ago',
    savedNoDays: lang === 'th' ? 'บันทึกไว้ %n ที่%p · ยังไม่ได้จัดเป็นวัน' : '%n places saved%p · not sorted into days yet',
    inProv: lang === 'th' ? ' ใน %p' : ' in %p',
    railCount: lang === 'th' ? 'ในทริปของคุณ %n รายการ' : '%n in your trip',
    missTier: lang === 'th' ? 'จุดหมายนี้เรามีแผน %h — ยังไม่มีแบบที่เลือก' : 'For this destination we have %h — not the length you picked',
    missBtn: lang === 'th' ? 'ดูแผน 3 วัน 2 คืน แล้วเพิ่มวันเอง' : 'Show the 3-day plan, then add days',
    submit: lang === 'th' ? 'ดูแผนเลย' : 'Show me the plan',
    submitFor: lang === 'th' ? 'ดูแผน%d %t' : 'Show the %d %t plan',
    conflictName: lang === 'th' ? 'ทริปที่มีอยู่: %t' : 'Your existing trip: %t',
    noTitle: lang === 'th' ? 'ทริปของคุณ' : 'Your trip',
    tier: t.tier
  })}
};
${JS}
</script>
</body>
</html>
`;
}

/* ─────────────────────────────────── run ────────────────────────────────── */
/* --proto-only exists for the case where the real homepage must not move — a
   design review, or a bisect. There is no --site-only: the prototype is cheap
   and letting it go stale is how a reference stops being one. */
const PROTO_ONLY = process.argv.includes('--proto-only');

const TARGETS = [
  ...(PROTO_ONLY ? [] : [
    { target: 'site', lang: 'th', out: 'astro/public/index.html' },
    { target: 'site', lang: 'en', out: 'astro/public/en/index.html' },
  ]),
  { target: 'proto', lang: 'th', out: 'astro/public/_proto/home.html' },
  { target: 'proto', lang: 'en', out: 'astro/public/_proto/en/home.html' },
];

for (const { target, lang, out } of TARGETS) {
  const file = path.join(ROOT, out);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, build(lang, target));
  console.log(`${target.padEnd(5)} ${lang}  ${(fs.statSync(file).size / 1024).toFixed(1).padStart(7)} KB  → ${out}`);
}

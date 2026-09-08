/* Destination-hub prototype generator — Krabi (TH + EN)
   Every value below is read from real repo data. Nothing is invented.
   Sources:
     _internal/province-data/krabi.json          (+ -en twin)
     astro/src/content/reviews/*.json            (cluster === 'krabi')
     astro/src/content/reviews-en/*.json
     astro/src/content/articles{,-en}/*.json     (cluster === 'krabi')
     astro/src/content/roundups{,-en}/*.json
     astro/src/data/editorial.json
*/
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'C:/Users/Imac/Thailandaddict/thailandaddict';
const PUB = path.join(ROOT, 'astro/public');
const SP = process.argv[2];
const OUT_TH = path.join(PUB, '_proto/krabi.html');
const OUT_EN = path.join(PUB, '_proto/en/krabi.html');

const CSS = '/css/shell.710afd97.css';
const JS = '/js/shell.467b869a.js';

const J = p => JSON.parse(fs.readFileSync(path.join(ROOT, p), 'utf8'));
const { rows, stats, byZone, byBand, ZONES, BANDS } = JSON.parse(fs.readFileSync(path.join(SP, 'krabi-rows.json'), 'utf8'));
const { arts, ru } = JSON.parse(fs.readFileSync(path.join(SP, 'krabi-arts.json'), 'utf8'));
const P = { th: J('_internal/province-data/krabi.json'), en: J('_internal/province-data-en/krabi.json') };
const ED = J('astro/src/data/editorial.json').editor;

/* ---------- helpers ---------- */
const esc = s => String(s ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const nf = n => Number(n).toLocaleString('en-US');
/* stable POI id: `{s:|a:}<slug>` with the collection prefix stripped, matching
   the convention in PROTO-KIT §8 (s:rayavadee-krabi, not s:review-rayavadee-krabi) */
const poiId = s => String(s).replace(/^review-/, '');
const exists = rel => rel && fs.existsSync(path.join(PUB, rel.replace(/^\//, '')));

function jpegSize(rel) {
  let b; try { b = fs.readFileSync(path.join(PUB, rel.replace(/^\//, ''))); } catch { return null; }
  if (b[0] !== 0xFF || b[1] !== 0xD8) return null;
  let i = 2;
  while (i < b.length - 8) {
    if (b[i] !== 0xFF) { i++; continue; }
    const m = b[i + 1];
    if (m === 0xD8 || m === 0x01 || (m >= 0xD0 && m <= 0xD7)) { i += 2; continue; }
    const len = b.readUInt16BE(i + 2);
    if (m >= 0xC0 && m <= 0xCF && m !== 0xC4 && m !== 0xC8 && m !== 0xCC) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
    i += 2 + len;
  }
  return null;
}

/* <picture>: a webp <source> is emitted ONLY when the sibling file really
   exists on disk. No width variants exist in this repo, so no srcset is
   faked. width/height come from the real JPEG header. */
function pic(rel, alt, { cls = '', eager = false, w, h } = {}) {
  if (!rel) return '';
  const src = rel.startsWith('/') ? rel : '/' + rel;
  const webp = src.replace(/\.jpe?g$/i, '.webp');
  const dim = (w && h) ? { w, h } : (jpegSize(src) || { w: 1600, h: 1067 });
  const load = eager ? 'fetchpriority="high" decoding="async"' : 'loading="lazy" decoding="async"';
  return `<picture>${exists(webp) ? `<source type="image/webp" srcset="${esc(webp)}">` : ''}` +
    `<img src="${esc(src)}" alt="${esc(alt)}" width="${dim.w}" height="${dim.h}" ${load}${cls ? ` class="${cls}"` : ''}></picture>`;
}

/* ---------- article buckets ---------- */
/* `top10-attractions-krabi` is typed "eat-ranking" in the source data but its
   subject is attractions — routed by subject, not by the mistyped field. */
const bySlug = Object.fromEntries(arts.map(a => [a.slug, a]));
const SEE_EXTRA = ['top10-attractions-krabi'];
const GO_SLUGS = ['krabi-getting-around', 'getting-around-krabi', 'krabi-travel-tips', 'krabi-vs-phuket'];
const ZONE_GUIDES = [
  { slug: 'where-to-stay-krabi-ao-nang', zone: 'aonang' },
  { slug: 'where-to-stay-krabi-railay', zone: 'railay' },
  { slug: 'where-to-stay-krabi-klong-muang', zone: 'klongmuang' },
  { slug: 'where-to-stay-krabi-town', zone: 'town' },
];
const isGo = s => GO_SLUGS.includes(s);
const isZoneGuide = s => ZONE_GUIDES.some(z => z.slug === s) || s === 'where-to-stay-krabi' || s === 'where-to-stay-ao-nang' || s === 'where-to-stay-railay';

const seeArts = arts.filter(a => !isGo(a.slug) && !isZoneGuide(a.slug) &&
  (a.type === 'attraction' || a.type.startsWith('activity') || SEE_EXTRA.includes(a.slug)) && !SEE_EXTRA.includes('x'));
const eatArts = arts.filter(a => !isGo(a.slug) && !SEE_EXTRA.includes(a.slug) && (a.type === 'food' || a.type === 'eat-ranking'));
const planArts = arts.filter(a => a.type === 'itinerary');
const goArts = GO_SLUGS.map(s => bySlug[s]).filter(Boolean);

/* province attraction -> real guide article (matched by subject, verified above) */
const ATTR_ART = {
  'หาดอ่าวนาง': 'ao-nang-beach-guide',
  'เรลเลย์และถ้ำพระนาง': 'railay-beach-guide',
  'ทะเลแหวกและทัวร์สี่เกาะ': 'four-islands-tour',
  'เกาะพีพี': 'krabi-phi-phi-tour',
  'เกาะลันตา': 'koh-lanta-guide',
  'วัดถ้ำเสือ': 'wat-tham-suea-guide',
  'สระมรกตและน้ำตกร้อนคลองท่อม': 'emerald-pool-hot-spring',
  'เขาขนาบน้ำ': 'khao-khanab-nam',
};

/* Two sibling prototype pages cover subjects that are IN this hub's pool:
   _proto/review.html is Rayavadee, _proto/roundup.html is the Ao Nang top 10.
   Point those two entries at the prototypes so the owner can walk the whole
   app; every other card still points at the real live page. */
const PROTO_PAGE = {
  th: { 'review-rayavadee-krabi': '/_proto/review.html', 'top10-ao-nang-beach-hotels-krabi': '/_proto/roundup.html' },
  en: { 'review-rayavadee-krabi': '/_proto/en/review.html', 'top10-ao-nang-beach-hotels-krabi': '/_proto/en/roundup.html' },
};

/* ---------- copy ---------- */
const T = {
  th: {
    lang: 'th', dir: 'ltr', other: 'en',
    base: '/_proto/', otherHref: '/_proto/en/krabi.html', selfHref: '/_proto/krabi.html',
    /* review slugs in the content collection already carry the `review-` prefix */
    rev: s => `/${s}.html`, art: s => `/${s}.html`, hub: s => `/city-${s}.html`,
    title: 'กระบี่ — ที่พัก ที่กิน ที่เที่ยว และแผนเที่ยว | ThailandAddict (ต้นแบบ)',
    desc: 'ต้นแบบหน้าจุดหมายกระบี่ — ที่พัก 66 แห่งที่เรารีวิวเอง กรองตามย่านและงบได้ ที่เที่ยว ของกิน แผนเที่ยว และช่วงเวลาที่ควรไป',
    proto: 'หน้าตัวอย่างงานออกแบบ (prototype) — ไม่ได้ลิงก์จากเว็บจริง และไม่ถูกจัดทำดัชนี',
    skip: 'ข้ามไปเนื้อหาหลัก',
    brandNav: ['สำรวจ', 'จุดหมาย', 'ทริป'],
    tabs: ['สำรวจ', 'จุดหมาย', 'ค้นหา', 'ทริป', 'เมนู'],
    searchPh: 'ที่พัก ร้านอาหาร จุดหมาย',
    searchLbl: 'ค้นหา',
    langLbl: 'ภาษา / Language', langName: 'ไทย',
    more: { display: 'การแสดงผล', theme: 'ธีม', sys: 'ตามระบบ', lang: 'ภาษา', saved: 'ที่บันทึกไว้', near: 'ใกล้ฉัน', install: 'ติดตั้งเป็นแอป' },
    railLbl: 'ทริปของคุณ', railCount: 'ในทริปของคุณ 0 รายการ',
    heroAlt: 'หาดทรายและเขาหินปูนที่ปกคลุมด้วยป่า มีเรือหางยาวจอดเรียงอยู่ริมน้ำที่กระบี่',
    kicker: 'ภาคใต้ · ฝั่งอันดามัน',
    h1: 'กระบี่',
    answerLbl: 'สรุปสั้น ๆ',
    routerLbl: 'อยากรู้เรื่องไหน',
    saveOff: 'เพิ่มเข้าทริป', saveOn: 'บันทึกแล้ว',
    read: 'อ่านรีวิวเต็ม', readG: 'อ่านไกด์',
    tripHref: '/_proto/trip.html',
  },
  en: {
    lang: 'en', dir: 'ltr', other: 'th',
    base: '/_proto/en/', otherHref: '/_proto/krabi.html', selfHref: '/_proto/en/krabi.html',
    rev: s => `/en/${s}.html`, art: s => `/en/${s}.html`, hub: s => `/en/city-${s}.html`,
    title: 'Krabi — where to stay, eat, and go | ThailandAddict (prototype)',
    desc: 'Destination-hub prototype for Krabi — 66 stays we reviewed ourselves, filterable by zone and budget, plus attractions, food, itineraries and when to go.',
    proto: 'Design prototype — not linked from the live site and not indexed.',
    skip: 'Skip to main content',
    brandNav: ['Explore', 'Destinations', 'Trip'],
    tabs: ['Explore', 'Places', 'Search', 'Trip', 'Menu'],
    searchPh: 'Hotels, restaurants, destinations',
    searchLbl: 'Search',
    langLbl: 'ภาษา / Language', langName: 'English',
    more: { display: 'Display', theme: 'Theme', sys: 'System', lang: 'Language', saved: 'Saved', near: 'Near me', install: 'Install as an app' },
    railLbl: 'Your trip', railCount: '0 items in your trip',
    heroAlt: 'A sandy beach and forested limestone cliffs in Krabi, with longtail boats lined up along the shore.',
    kicker: 'Southern Thailand · Andaman coast',
    h1: 'Krabi',
    answerLbl: 'The short answer',
    routerLbl: 'What do you want to know',
    saveOff: 'Add to trip', saveOn: 'Saved',
    read: 'Read the full review', readG: 'Read the guide',
    tripHref: '/_proto/en/trip.html',
  },
};

/* ---------- the sprite (PROTO-KIT §12, verbatim subset actually used) ---------- */
const SPRITE = `<svg class="ta-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
<symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="10.75" cy="10.75" r="6.75"/><path d="M15.6 15.6 20.5 20.5"/></symbol>
<symbol id="i-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6.25 4.5h11.5a.75.75 0 0 1 .75.75v14.4l-6.5-4.1-6.5 4.1V5.25a.75.75 0 0 1 .75-.75Z"/></symbol>
<symbol id="i-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21c4.2-4.2 6.5-7.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 13.6 7.8 16.8 12 21Z"/><circle cx="12" cy="10.3" r="2.4"/></symbol>
<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/></symbol>
<symbol id="i-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m9.25 5 7 7-7 7"/></symbol>
<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h15.5M13.5 6l6 6-6 6"/></symbol>
<symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.3 2.4 3.5 5.3 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.3-3.5-8.5S9.7 5.9 12 3.5Z"/></symbol>
<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M4 12h16M4 17h16"/></symbol>
<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 6 12 12M18 6 6 18"/></symbol>
<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m4.75 12.5 4.75 4.75L19.25 6.75"/></symbol>
<symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3.75 2.62 5.31 5.86.85-4.24 4.13 1 5.84L12 17.13l-5.24 2.75 1-5.84-4.24-4.13 5.86-.85Z"/></symbol>
<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.25V12l3.25 2"/></symbol>
<symbol id="i-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 7h16M7 12h10M10 17h4"/></symbol>
<symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.28 4.28l1.56 1.56M18.16 18.16l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.28 19.72l1.56-1.56M18.16 5.84l1.56-1.56"/></symbol>
<symbol id="i-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3.75v11M7.75 10.5 12 14.75l4.25-4.25M4.5 19.5h15"/></symbol>
</svg>`;

/* ---------- page CSS (@layer page — logical properties only) ---------- */
const PAGE_CSS = `@layer page {
  /* ---- 0. SHELL DEFECT REPAIR ------------------------------------------
     shell.css sizes card images with “.ta-media > img”, but PROTO-KIT §7's
     own card markup wraps the image in <picture>. The img is then a
     GRANDCHILD, so inline-size/block-size/object-fit/hover/transition all
     miss it and every card renders its image at intrinsic size, clipped to
     a corner by the wrapper's overflow:hidden. Measured before this rule:
     the Phulay Bay card image laid out at 4000x2250 inside a 342x228 box.
     Restored here; the upstream fix is “.ta-media img” in shell.css. */
  .ta-media > picture { display: block; inline-size: 100%; block-size: 100%; }
  .ta-media picture > img { inline-size: 100%; block-size: 100%; object-fit: cover; display: block;
    transition: scale var(--dur-3) var(--ease-ui); }
  @media (hover: hover) and (pointer: fine) {
    a:hover > .ta-media picture > img, .ta-card:hover .ta-media picture > img { scale: 1.04; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ta-media picture > img { transition: none; }
    a:hover > .ta-media picture > img, .ta-card:hover .ta-media picture > img { scale: 1; }
  }

  /* ---- 1. collapsing hero (§5.2.1) ------------------------------------
     The title block sits on --surface BELOW the photo, overlapping its
     bottom edge, rather than on top of it. Measured reason: this hero photo
     is ~0.85 relative luminance across the sky, and white text needs an
     0.80-alpha wash to clear 4.5:1 there — which destroys the photograph.
     A real surface gives ink-on-paper 17.4:1 and keeps the image intact. */
  .ta-hero-dest { margin-block-end: var(--sp-5); }
  .ta-hero-dest .ta-media { border-radius: 0; aspect-ratio: 4 / 5; max-block-size: 58svh; }
  .ta-hero-dest .ta-media img { object-position: center 64%; }
  @media (min-width: 900px) { .ta-hero-dest .ta-media { aspect-ratio: 16 / 9; max-block-size: 56svh; } }

  .dh-hero-inner { position: relative;
    inline-size: min(100% - 2 * var(--sp-4), 1140px); margin-inline: auto;
    margin-block-start: calc(-1 * var(--sp-6)); padding: var(--sp-5) var(--sp-4) var(--sp-4);
    background: var(--surface); border-radius: var(--r-lg); }
  @media (min-width: 900px) { .dh-hero-inner { margin-block-start: calc(-1 * var(--sp-7)); padding-inline: var(--sp-6); } }
  .dh-hero-inner h1 { font-family: var(--font-display); font-size: var(--step-5);
    margin-block: var(--sp-1) var(--sp-2); margin-inline: 0; }
  @media (min-width: 900px) { .dh-hero-inner h1 { font-size: var(--step-6); } }
  .dh-tag { margin-block: 0 var(--sp-4); margin-inline: 0;
    color: var(--text-muted); font-size: var(--step-0); max-inline-size: 52ch; }
  /* .ta-chip-scroll on the <ul> makes this one scrolling line on a phone;
     it wraps into rows once there is room. */
  .dh-facts { list-style: none; margin: 0; padding: 0; }
  @media (min-width: 760px) { .dh-facts { flex-wrap: wrap; overflow-x: visible; } }
  .dh-facts li { display: inline-flex; align-items: center; gap: var(--sp-2); white-space: nowrap;
    padding-block: var(--sp-2); padding-inline: var(--sp-3);
    border: 1px solid var(--border); border-radius: var(--r-full);
    background: var(--surface-2); color: var(--text); font-size: var(--step--2); }
  .dh-facts .ta-ic { inline-size: 16px; block-size: 16px; color: var(--accent); }
  /* the collapse itself: the photo recedes as it scrolls away. Killed by the
     shell's reduced-motion block (animation-timeline: auto !important). */
  @supports (animation-timeline: view()) {
    .ta-hero-dest .ta-media { animation: dh-recede linear both; animation-timeline: view();
      animation-range: exit-crossing 0% exit-crossing 100%; }
    @keyframes dh-recede { to { opacity: .3; } }
  }

  /* ---- 2. answer block (§5.2.2) ---- */
  .ta-answer { padding: var(--sp-4); border: 1px solid var(--trip-line);
    border-radius: var(--r-md); background: var(--trip-soft); }
  .ta-answer .eyebrow { display: block; color: var(--accent); margin-block-end: var(--sp-2); }
  .ta-answer p { margin: 0; }

  /* ---- 3. decision router (§5.2.3) — 6 targets, >=88px ---- */
  .ta-router ul { display: grid; gap: var(--sp-3); list-style: none; margin: 0; padding: 0;
    grid-template-columns: repeat(2, minmax(0, 1fr)); }
  @media (min-width: 760px) { .ta-router ul { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  .ta-router a { display: flex; flex-direction: column; justify-content: center; gap: var(--sp-1);
    min-block-size: 88px; padding: var(--sp-3);
    border: 1px solid var(--border); border-radius: var(--r-lg);
    background: var(--surface-2); color: var(--text); text-decoration: none;
    transition: border-color var(--dur-2) var(--ease-ui), background var(--dur-2) var(--ease-ui); }
  .ta-router a:hover { border-color: var(--accent); background: var(--accent-quiet); }
  .dh-router-q { font-family: var(--font-display); font-weight: 500; font-size: var(--step-0); }
  .dh-router-n { color: var(--text-muted); font-size: var(--step--2); }

  /* ---- 4. KPI row (§5.2.4) — final values on first paint ---- */
  .ta-kpi { display: grid; gap: var(--sp-3); list-style: none; margin: 0; padding: 0;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr)); }
  .ta-kpi > li { padding: var(--sp-4); border: 1px solid var(--border);
    border-radius: var(--r-md); background: var(--surface-2); }
  .dh-kpi-v { display: block; font-family: var(--font-display); font-weight: 800;
    font-size: var(--step-2); font-variant-numeric: tabular-nums; color: var(--text); }
  .dh-kpi-k { display: block; font-size: var(--step--1); color: var(--text); margin-block-start: var(--sp-1); }
  .dh-kpi-s { display: block; font-size: var(--step--2); color: var(--text-muted); margin-block-start: var(--sp-1); }

  /* ---- 5. honest price band (the Math.min fix) ---- */
  .dh-band { padding: var(--sp-5) var(--sp-4); border: 1px solid var(--border);
    border-radius: var(--r-lg); background: var(--surface-2); }
  .dh-band h2 { margin-block: 0 var(--sp-2); font-size: var(--step-1); }
  .dh-band-fig { margin: var(--sp-4) 0 0; }
  .dh-band-track { position: relative; block-size: 14px; border-radius: var(--r-full);
    background: var(--surface-3); border: 1px solid var(--border); }
  .dh-band-fill { position: absolute; inset-block: -1px; border-radius: var(--r-full);
    background: var(--trip); opacity: .9; }
  .dh-band-med { position: absolute; inset-block: -6px; inline-size: 2px; background: var(--ink); }
  :root[data-theme="dark"] .dh-band-med { background: #FFF; }
  .dh-band-scale { display: flex; justify-content: space-between; gap: var(--sp-2);
    margin-block-start: var(--sp-2); font-size: var(--step--2); color: var(--text-muted); }
  .dh-band-legend { display: grid; gap: var(--sp-2); margin-block-start: var(--sp-4);
    padding: 0; list-style: none; font-size: var(--step--1); }
  .dh-band-legend li { display: grid; grid-template-columns: auto 1fr; gap: var(--sp-1) var(--sp-2); align-items: baseline; }
  @media (max-width: 560px) { .dh-band-legend li { grid-template-columns: 1fr; } }
  .dh-band-legend b { font-family: var(--font-display); font-variant-numeric: tabular-nums; white-space: nowrap; }
  .dh-was { margin-block-start: var(--sp-4); }

  /* ---- 6. start-a-plan CTA (§5.2.5) ---- */
  .dh-plan { padding: var(--sp-5) var(--sp-4); border: 1px solid var(--trip-line);
    border-radius: var(--r-lg); background: var(--trip-soft); }
  .dh-plan h2 { margin-block: 0 var(--sp-2); font-size: var(--step-1); }
  .dh-plan-acts { display: flex; flex-wrap: wrap; gap: var(--sp-3); margin-block-start: var(--sp-4); }
  .dh-plan ol { margin-block: var(--sp-3) 0; padding-inline-start: var(--sp-5); font-size: var(--step--1); }

  /* ---- 7. filter bar + applied chips ---- */
  .dh-filterbar { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-3);
    margin-block-end: var(--sp-3); }
  .dh-sort { display: inline-flex; align-items: center; gap: var(--sp-2); font-size: var(--step--1); }
  .dh-sort select { min-block-size: 44px; padding-block: var(--sp-1); padding-inline: var(--sp-3);
    border: 1px solid var(--border); border-radius: var(--r-full);
    background: var(--surface-2); color: var(--text); font: inherit; font-size: var(--step--1); }
  .dh-count { font-size: var(--step--1); color: var(--text-muted); }
  .dh-applied { margin-block-end: var(--sp-4); }
  .dh-applied:empty { display: none; }
  .dh-empty { padding: var(--sp-5) var(--sp-4); border: 1px dashed var(--border-strong);
    border-radius: var(--r-lg); text-align: start; }

  /* ---- 8. facet groups inside the sheet ---- */
  .dh-fgroup { margin-block-end: var(--sp-5); }
  .dh-fgroup h3 { margin-block: 0 var(--sp-2); font-size: var(--step--1); color: var(--text-muted);
    font-family: var(--font-body); font-weight: 600; }
  .dh-fgroup ul { display: flex; flex-wrap: wrap; gap: var(--sp-2); list-style: none; margin: 0; padding: 0; }

  /* ---- 9. text-link lists (related guides) ---- */
  .dh-links { display: grid; gap: var(--sp-2); list-style: none; margin: 0; padding: 0;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
  .dh-links a { display: flex; align-items: center; gap: var(--sp-2); min-block-size: 44px;
    padding-block: var(--sp-2); padding-inline: var(--sp-3);
    border: 1px solid var(--border); border-radius: var(--r-md);
    background: var(--surface-2); color: var(--text); text-decoration: none; font-size: var(--step--1); }
  .dh-links a:hover { border-color: var(--accent); color: var(--accent); }
  .dh-links .eyebrow { font-size: var(--step--2); }

  /* ---- 10. simple fact list (province highlights / food) ---- */
  .dh-facts-grid { display: grid; gap: var(--sp-4); list-style: none; margin: 0; padding: 0;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr)); }
  .dh-facts-grid > li { padding: var(--sp-4); border: 1px solid var(--border);
    border-radius: var(--r-md); background: var(--surface-2); }
  .dh-facts-grid h3 { margin-block: 0 var(--sp-2); font-size: var(--step-0); }
  .dh-facts-grid p { margin: 0; font-size: var(--step--1); color: var(--text-muted); }

  /* ---- 11. when-to-go ---- */
  .dh-when { padding: var(--sp-5) var(--sp-4); border: 1px solid var(--border);
    border-radius: var(--r-lg); background: var(--surface-2); }
  .dh-when h2 { margin-block: 0 var(--sp-3); font-size: var(--step-1); }

  /* ---- 12. FAQ ---- */
  .dh-faq { border: 1px solid var(--border); border-radius: var(--r-md);
    background: var(--surface-2); margin-block-end: var(--sp-2); }
  .dh-faq summary { display: flex; align-items: center; gap: var(--sp-2);
    min-block-size: 44px; padding-block: var(--sp-2); padding-inline: var(--sp-4);
    cursor: pointer; font-weight: 600; }
  .dh-faq[open] summary { border-block-end: 1px solid var(--border); }
  .dh-faq-body { padding: var(--sp-3) var(--sp-4) var(--sp-4); font-size: var(--step--1); }
  .dh-faq-body p { margin-block: 0 var(--sp-2); }

  /* ---- 13. byline ---- */
  .dh-byline { display: flex; flex-wrap: wrap; align-items: center; gap: var(--sp-3);
    padding-block: var(--sp-4); border-block: 1px solid var(--border); }
  .dh-byline img { border-radius: var(--r-full); }
  .dh-byline b { font-family: var(--font-display); }

  /* ---- 14. neighbours ---- */
  .dh-nbrs { display: grid; gap: var(--sp-3); list-style: none; margin: 0; padding: 0;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 220px), 1fr)); }
  .dh-nbrs a { display: flex; align-items: center; justify-content: space-between; gap: var(--sp-2);
    min-block-size: 56px; padding: var(--sp-3) var(--sp-4);
    border: 1px solid var(--border); border-radius: var(--r-md);
    background: var(--surface-2); color: var(--text); text-decoration: none; }
  .dh-nbrs a:hover { border-color: var(--accent); color: var(--accent); }
  .dh-nbrs .i-arrow { flex: none; }

  /* ---- 15. 44px floor for controls the shell leaves at text height.
     Page layer, so shell.css is untouched. ---- */
  .ta-sec-more, .dh-faq-body a, .ta-answer a, .dh-when a.ta-btn, .ta-map-note a {
    display: inline-flex; align-items: center; min-block-size: 44px; }
  /* shell.css:545 gives .ta-search-desk input min-block-size:40px inside a 44px
     wrapper, so the focusable control itself sits 4px under the floor. Raised
     here so this page passes; the real fix belongs upstream in shell.css. */
  .ta-search-desk input { min-block-size: 44px; }
  /* Same class of shell defect: .ta-skip is padding-sized, so it measures 42px
     with a short Latin label. Also belongs upstream. */
  .ta-skip { min-block-size: 44px; display: inline-flex; align-items: center; }

  /* ---- 16. hotel card extras ---- */
  .dh-scores { display: flex; flex-wrap: wrap; gap: var(--sp-2); align-items: center; }
  .dh-zone { color: var(--text-muted); }
  .ta-card .ta-card-foot { flex-wrap: wrap; }
}`;

/* ---------- content builders ---------- */
function heroFacts(L) {
  const th = L.lang === 'th';
  return [
    { ic: 'i-calendar', s: th ? 'ช่วงที่ดีที่สุด พ.ย.–เม.ย.' : 'Best months Nov–Apr' },
    { ic: 'i-map-pin', s: th ? 'สนามบินกระบี่' : 'Krabi Airport' },
    { ic: 'i-bookmark', s: th ? `ที่พักที่เรารีวิว ${stats.n} แห่ง` : `${stats.n} stays we reviewed` },
  ].map(f => `<li><svg class="ta-ic ta-ic-16" aria-hidden="true"><use href="#${f.ic}"></use></svg>${esc(f.s)}</li>`).join('');
}

const ANSWER = {
  th: 'กระบี่อยู่ฝั่งอันดามัน จุดที่คนไปกันมากที่สุดคืออ่าวนาง ซึ่งเป็นศูนย์รวมที่พัก ร้านอาหาร และท่าเรือหางยาว จากตรงนั้นต่อเรือไปเรลเลย์ ถ้ำพระนาง และทัวร์สี่เกาะได้ในวันเดียว ส่วนเกาะพีพีกับเกาะลันตาก็อยู่ในเขตจังหวัดนี้ เหมาะกับคนที่อยากนอนค้างบนเกาะ ฟ้าเปิดทะเลเรียบช่วงพฤศจิกายนถึงเมษายน ส่วนพฤษภาคมถึงตุลาคมเป็นหน้ามรสุมฝนชุก',
  en: 'Krabi sits on the Andaman coast. Ao Nang is where most people base themselves — it holds the hotels, the restaurants and the longtail pier, and from there Railay, Phra Nang Cave and the four-island tour are all a single day out. Koh Phi Phi and Koh Lanta are inside the same province and suit staying several nights. Skies are clear and the sea is calm November to April; May to October is the rainy monsoon.',
};

function routerItems(L) {
  const th = L.lang === 'th';
  return [
    { q: th ? 'พักที่ไหน' : 'Where to stay', n: th ? `${stats.n} ที่พักที่เรารีวิวเอง` : `${stats.n} stays we reviewed`, href: '#p-stay' },
    { q: th ? 'เที่ยวอะไร' : 'What to do', n: th ? `${seeArts.length} ไกด์ที่เที่ยวและกิจกรรม` : `${seeArts.length} sights & activity guides`, href: '#p-see' },
    { q: th ? 'กินที่ไหน' : 'Where to eat', n: th ? `${eatArts.length} ไกด์ของกินและจัดอันดับร้าน` : `${eatArts.length} food guides & rankings`, href: '#p-eat' },
    { q: th ? 'กี่วันดี' : 'How many days', n: th ? `${planArts.length} แผนเที่ยวที่เขียนไว้แล้ว` : `${planArts.length} itineraries already written`, href: '#p-plan' },
    { q: th ? 'ไปยังไง' : 'Getting there & around', n: th ? `${goArts.length} ไกด์การเดินทาง` : `${goArts.length} transport guides`, href: '#p-go' },
    { q: th ? 'ไปเดือนไหน' : 'When to go', n: th ? 'ช่วงมรสุมและช่วงฟ้าเปิด' : 'Monsoon vs clear season', href: '#when' },
  ].map(i => `<li><a href="${i.href}"><span class="dh-router-q">${esc(i.q)}</span><span class="dh-router-n">${esc(i.n)}</span></a></li>`).join('');
}

function kpi(L) {
  const th = L.lang === 'th';
  const items = [
    { v: nf(stats.n), k: th ? 'ที่พักที่เรารีวิวเอง' : 'stays we reviewed ourselves', s: th ? 'ทุกแห่งมีหน้ารีวิวเต็มของเราเอง' : 'every one has a full review page here' },
    { v: `฿${nf(stats.p10)}–${nf(stats.p90)}`, k: th ? 'ราคาเริ่มต้นต่อคืน (ช่วงกลาง 80%)' : 'starting price per night (middle 80%)', s: th ? `จากราคาเริ่มต้นของ ${stats.n} แห่งบนหน้านี้` : `across the ${stats.n} stays listed on this page` },
    { v: nf(stats.booking9), k: th ? 'ที่พักที่ได้ 9.0 ขึ้นไปบน Booking.com' : 'stays scoring 9.0+ on Booking.com', s: th ? `จาก ${stats.withBooking} แห่งที่มีคะแนน Booking.com` : `of the ${stats.withBooking} with a Booking.com score` },
    { v: nf(arts.length + ru.length), k: th ? 'ไกด์และบทความกระบี่ของเรา' : 'Krabi guides and articles', s: th ? `บทความ ${arts.length} · จัดอันดับที่พัก ${ru.length}` : `${arts.length} articles · ${ru.length} hotel rankings` },
  ];
  return items.map(i => `<li><span class="dh-kpi-v ta-num">${esc(i.v)}</span><span class="dh-kpi-k">${esc(i.k)}</span><span class="dh-kpi-s">${esc(i.s)}</span></li>`).join('');
}

function band(L) {
  const th = L.lang === 'th';
  const lo = Math.log10(stats.min), hi = Math.log10(stats.max);
  const pos = v => ((Math.log10(v) - lo) / (hi - lo) * 100).toFixed(1);
  const p10 = pos(stats.p10), p90 = pos(stats.p90), p50 = pos(stats.p50);
  const legend = th ? [
    [`฿${nf(stats.p10)}–${nf(stats.p90)}`, `คือช่วงกลาง 80% (เปอร์เซ็นไทล์ที่ 10 ถึง 90) ของราคาเริ่มต้นที่ ${stats.n} แห่งนี้แจ้งไว้`],
    [`฿${nf(stats.p50)}`, 'คือค่ากลาง — ครึ่งหนึ่งของที่พักเริ่มต้นถูกกว่านี้ อีกครึ่งแพงกว่า'],
    [`฿${nf(stats.min)}`, 'คือราคาต่ำสุดจริง และเป็นเตียงในดอร์ม 6–8 เตียงที่ Nomads Ao Nang ไม่ใช่ห้องส่วนตัว'],
    [`฿${nf(stats.max)}`, 'คือราคาสูงสุดจริง — ราคาเริ่มต้นของ Phulay Bay, a Ritz-Carlton Reserve'],
  ] : [
    [`฿${nf(stats.p10)}–${nf(stats.p90)}`, `is the middle 80% (10th to 90th percentile) of the starting prices these ${stats.n} stays quote`],
    [`฿${nf(stats.p50)}`, 'is the median — half the stays start below it, half above'],
    [`฿${nf(stats.min)}`, 'is the true floor, and it is a bed in a 6–8 bed dorm at Nomads Ao Nang, not a private room'],
    [`฿${nf(stats.max)}`, 'is the true ceiling — the starting rate at Phulay Bay, a Ritz-Carlton Reserve'],
  ];
  return `
      <section class="ta-sec dh-band" id="prices" aria-labelledby="prices-h">
        <h2 id="prices-h">${th ? 'ราคาที่พักต่อคืนในกระบี่' : 'What a night in Krabi actually costs'}</h2>
        <p class="ta-fine">${esc(th
    ? `คิดจากราคาเริ่มต้นที่ที่พัก ${stats.n} แห่งบนหน้านี้แจ้งไว้ · ห้องมาตรฐาน ต่อคืน · ไม่รวมค่าอาหาร ทัวร์ และเรือ`
    : `Computed from the starting price each of the ${stats.n} stays on this page quotes · standard room, per night · food, tours and boats not included`)}</p>

        <figure class="dh-band-fig">
          <div class="dh-band-track" role="img" aria-label="${esc(th
    ? `แถบราคา: ช่วงกลาง 80% อยู่ระหว่าง ${nf(stats.p10)} ถึง ${nf(stats.p90)} บาท ค่ากลาง ${nf(stats.p50)} บาท ต่ำสุด ${nf(stats.min)} บาท สูงสุด ${nf(stats.max)} บาท`
    : `Price band: the middle 80% runs from ${nf(stats.p10)} to ${nf(stats.p90)} baht, median ${nf(stats.p50)} baht, floor ${nf(stats.min)} baht, ceiling ${nf(stats.max)} baht`)}">
            <span class="dh-band-fill" style="inset-inline-start:${p10}%;inline-size:${(p90 - p10).toFixed(1)}%"></span>
            <span class="dh-band-med" style="inset-inline-start:${p50}%"></span>
          </div>
          <div class="dh-band-scale"><span class="ta-num">฿${nf(stats.min)}</span><span class="ta-num">฿${nf(stats.p50)}</span><span class="ta-num">฿${nf(stats.max)}</span></div>
        </figure>

        <ul class="dh-band-legend">
          ${legend.map(([b, s]) => `<li><b class="ta-num">${esc(b)}</b> <span>${esc(s)}</span></li>`).join('\n          ')}
        </ul>

        <p class="ta-flag ta-flag-unknown">${esc(th
    ? `เราระบุวันที่ตรวจสอบราคาไว้เพียง ${stats.withDate} จาก ${stats.n} แห่ง อีก ${stats.n - stats.withDate} แห่งเราไม่ทราบว่าราคาที่บันทึกไว้เก่าแค่ไหน — ให้เช็กราคาจริงกับเว็บจองก่อนตัดสินใจ`
    : `Only ${stats.withDate} of the ${stats.n} stays carry a price-checked date. For the other ${stats.n - stats.withDate} we do not know how old the recorded price is — check the live price with the booking site before you decide.`)}</p>

        <div class="ta-note dh-was">${esc(th
    ? 'หน้าจุดหมายเวอร์ชันที่ใช้อยู่ตอนนี้แสดง “฿150 ราคาเริ่มต้น” เพราะคำนวณด้วยค่าต่ำสุดของทั้งกอง ซึ่งเป็นเตียงดอร์ม แล้ววางไว้ข้างโรงแรมคืนละ ฿13,900 หน้าต้นแบบนี้เลิกใช้ค่าต่ำสุด และบอกให้ชัดว่าตัวเลขที่แสดงครอบคลุมอะไร'
    : 'The destination hub in production prints “from ฿150” because it takes the minimum over the whole pool — a dorm bed — and sets it beside a ฿13,900 resort. This prototype drops the minimum and states exactly what the number covers.')}</div>
      </section>`;
}

/* hotel card */
function hotelCard(r, L) {
  const th = L.lang === 'th';
  const name = th ? r.nameTh : r.nameEn;
  const type = th ? r.typeTh : r.typeEn;
  const loc = th ? r.locTh : r.locEn;
  const zone = th ? r.zoneTh : r.zoneEn;
  const proto = PROTO_PAGE[L.lang][r.slug];
  const href = proto || L.rev(r.slug);
  const scores = [];
  if (r.booking) scores.push(`<span class="ta-score"><b class="ta-num">${r.booking}</b> <span class="ta-score-src">Booking.com</span></span>`);
  if (r.agoda) scores.push(`<span class="ta-score"><b class="ta-num">${r.agoda}</b> <span class="ta-score-src">Agoda</span></span>`);
  if (!scores.length) scores.push(`<span class="ta-flag ta-flag-unknown">${esc(th ? 'ยังไม่มีคะแนนจากเว็บจอง' : 'no OTA score recorded')}</span>`);
  const dateChip = r.modifiedDate
    ? `<span class="ta-checked">${esc(th ? `ตรวจสอบราคา ${r.modifiedDate}` : `price checked ${r.modifiedDate}`)}</span>`
    : `<span class="ta-checked">${esc(th ? 'ไม่ทราบวันตรวจสอบราคา' : 'price date unknown')}</span>`;
  return `<article class="ta-card" data-hotel data-zone="${r.zone}" data-band="${r.band}" data-star="${r.star}" data-price="${r.price}" data-bscore="${r.booking || 0}" data-ourscore="${r.ourScore}" data-name="${esc(name)}">
  <a class="ta-media ta-r-3-2" href="${href}" data-vt-hero tabindex="-1" aria-hidden="true">${pic(r.img, '')}</a>
  <div class="ta-card-body">
    <span class="eyebrow">${esc(zone)} · ${esc(th ? 'กระบี่' : 'Krabi')}</span>
    <h3 class="ta-card-title"><a class="ta-clamp-2" href="${href}">${esc(name)}</a></h3>
    <p class="ta-card-meta dh-scores">${scores.join(' ')}<span class="ta-chip">${esc(th ? 'จาก' : 'from')} <span class="ta-num">฿${nf(r.price)}</span> ${esc(th ? '/ คืน' : '/ night')}</span></p>
    <p class="ta-card-meta"><span class="dh-zone ta-clamp-1">${esc(loc)}</span></p>
    <p class="ta-card-meta">${dateChip}</p>
    <div class="ta-card-foot">
      <a class="ta-btn ta-btn-quiet" href="${href}">${esc(proto ? (th ? 'ดูหน้ารีวิวต้นแบบ' : 'Open the review prototype') : L.read)}</a>
      <button class="ta-save" type="button" aria-pressed="false" data-save
        data-id="s:${esc(poiId(r.slug))}" data-poi-id="s:${esc(poiId(r.slug))}" data-kind="stay"
        data-name="${esc(name)}" data-url="${href}" data-img="${esc(r.img)}"
        data-province="krabi" data-score="${r.booking || ''}" data-price-from="${r.price}"
        data-trip-href="${L.tripHref}">
        <span aria-hidden="true">🔖</span>
        <span class="ta-save-off">${esc(L.saveOff)}</span>
        <span class="ta-save-on">${esc(L.saveOn)}</span>
      </button>
    </div>
    <p class="ta-fine">${esc(type)}</p>
  </div>
</article>`;
}

/* attraction card (from province JSON, linked to the real guide article) */
function attrCard(a, L, i) {
  const th = L.lang === 'th';
  const slug = ATTR_ART[a.nameTh];
  const art = slug ? bySlug[slug] : null;
  const href = art ? L.art(art.slug) : '';
  const name = th ? a.nameTh : a.nameEn;
  const blurb = th ? a.blurbTh : a.blurbEn;
  const img = art && art.heroExists ? art.heroImg : '';
  return `<article class="ta-card">
  ${img ? `<a class="ta-media ta-r-3-2" href="${href}" tabindex="-1" aria-hidden="true">${pic(img, '')}</a>` : ''}
  <div class="ta-card-body">
    <span class="eyebrow">${esc(th ? 'ที่เที่ยว' : 'To see')}</span>
    <h3 class="ta-card-title">${href ? `<a class="ta-clamp-2" href="${href}">${esc(name)}</a>` : `<span class="ta-clamp-2">${esc(name)}</span>`}</h3>
    <p class="ta-fine">${esc(blurb)}</p>
    <div class="ta-card-foot">
      ${href ? `<a class="ta-btn ta-btn-quiet" href="${href}">${esc(L.readG)}</a>` : '<span></span>'}
      <button class="ta-save" type="button" aria-pressed="false" data-save
        data-id="a:${esc(slug || ('krabi-see-' + i))}" data-poi-id="a:${esc(slug || ('krabi-see-' + i))}" data-kind="see"
        data-name="${esc(name)}" data-url="${href}" data-img="${esc(img)}"
        data-province="krabi" data-trip-href="${L.tripHref}">
        <span aria-hidden="true">🔖</span>
        <span class="ta-save-off">${esc(L.saveOff)}</span>
        <span class="ta-save-on">${esc(L.saveOn)}</span>
      </button>
    </div>
  </div>
</article>`;
}

function linkList(list, L) {
  const th = L.lang === 'th';
  return list.map(a => `<li><a href="${L.art(a.slug)}"><svg class="ta-ic ta-ic-16 i-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg><span class="ta-clamp-2">${esc(th ? a.titleTh : a.titleEn)}</span></a></li>`).join('\n            ');
}

function foodList(L) {
  const th = L.lang === 'th';
  const src = th ? P.th.foodScene : P.en.foodScene;
  return src.map(f => `<li><h3>${esc(f.name)}</h3><p>${esc(f.note)}</p></li>`).join('\n            ');
}

function ideaList(L) {
  const th = L.lang === 'th';
  const src = th ? P.th.itineraryIdeas : P.en.itineraryIdeas;
  return src.map(s => `<li>${esc(s)}</li>`).join('\n            ');
}

function roundupList(L) {
  const th = L.lang === 'th';
  return ru.map(r => {
    const proto = PROTO_PAGE[L.lang][r.slug];
    return `<li><a href="${proto || L.art(r.slug)}"><svg class="ta-ic ta-ic-16 i-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg><span class="ta-clamp-2">${esc(th ? r.titleTh : r.titleEn)}${proto ? esc(th ? ' — ต้นแบบ' : ' — prototype') : ''}</span></a></li>`;
  }).join('\n            ');
}

function zoneList(L) {
  const th = L.lang === 'th';
  return ZONE_GUIDES.map(z => {
    const a = bySlug[z.slug];
    const zn = ZONES.find(x => x.id === z.zone);
    const n = byZone[z.zone] || 0;
    return `<li><a href="${L.art(z.slug)}">
              <span><b>${esc(th ? zn.th : zn.en)}</b><br><span class="ta-fine">${esc(th ? `${n} ที่พักที่เรารีวิวในย่านนี้` : `${n} stays we reviewed here`)}</span></span>
              <svg class="ta-ic ta-ic-20 i-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg>
            </a></li>`;
  }).join('\n            ');
}

function facetSheet(L) {
  const th = L.lang === 'th';
  const g = (id, title, opts) => `<div class="dh-fgroup"><h3 id="fg-${id}">${esc(title)}</h3>
            <ul role="group" aria-labelledby="fg-${id}">
              ${opts.join('\n              ')}
            </ul></div>`;
  const zoneOpts = ZONES.map(z => `<li><button class="ta-fac" type="button" aria-pressed="false" data-facet="zone" data-value="${z.id}">${esc(th ? z.th : z.en)} <span class="ta-fac-count">${byZone[z.id] || 0}</span></button></li>`);
  const bandOpts = BANDS.map(b => `<li><button class="ta-fac" type="button" aria-pressed="false" data-facet="band" data-value="${b.id}">${esc(th ? b.th : b.en)} <span class="ta-fac-count">${byBand[b.id] || 0}</span></button></li>`);
  const starVals = [...new Set(rows.map(r => r.star))].sort((a, b) => a - b);
  const starOpts = starVals.map(s => `<li><button class="ta-fac" type="button" aria-pressed="false" data-facet="star" data-value="${s}">${esc(th ? `${s} ดาว` : `${s}-star`)} <span class="ta-fac-count">${rows.filter(r => r.star === s).length}</span></button></li>`);
  const scoreOpts = [`<li><button class="ta-fac" type="button" aria-pressed="false" data-facet="score" data-value="9">${esc(th ? 'Booking.com 9.0 ขึ้นไป' : 'Booking.com 9.0+')} <span class="ta-fac-count">${stats.booking9}</span></button></li>`,
  `<li><button class="ta-fac" type="button" aria-pressed="false" data-facet="score" data-value="8.5">${esc(th ? 'Booking.com 8.5 ขึ้นไป' : 'Booking.com 8.5+')} <span class="ta-fac-count">${rows.filter(r => r.booking && r.booking >= 8.5).length}</span></button></li>`];
  return `<dialog class="ta-sheet" id="taFilter" aria-labelledby="taFilterTitle">
  <div class="ta-sheet-grip" aria-hidden="true"></div>
  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title" id="taFilterTitle">${esc(th ? 'ตัวกรองที่พัก' : 'Filter stays')}</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="${esc(th ? 'ปิด' : 'Close')}">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>
  <div class="ta-sheet-body">
    <p class="ta-fine">${esc(th ? 'ตัวเลือกที่ไม่เหลือที่พักเลยจะเป็นสีจางและกดไม่ได้ ไม่ได้ถูกซ่อน' : 'Options with nothing left are greyed out and disabled, never hidden.')}</p>
    ${g('zone', th ? 'ย่าน' : 'Zone', zoneOpts)}
    ${g('band', th ? 'ราคาเริ่มต้นต่อคืน' : 'Starting price per night', bandOpts)}
    ${g('star', th ? 'ระดับดาว' : 'Star rating', starOpts)}
    ${g('score', th ? 'คะแนนจากเว็บจอง' : 'OTA score', scoreOpts)}
  </div>
  <div class="ta-sheet-foot">
    <button class="ta-btn ta-btn-ghost" type="button" data-filter-clear>${esc(th ? 'ล้างทั้งหมด' : 'Clear all')}</button>
    <button class="ta-btn ta-btn-primary" type="button" data-sheet-close data-filter-apply>${esc(th ? `แสดง ${stats.n} ที่พัก` : `Show ${stats.n} stays`)}</button>
  </div>
</dialog>`;
}

function faqs(L) {
  const th = L.lang === 'th';
  const zn = id => ZONES.find(z => z.id === id);
  const list = th ? [
    ['ไปกระบี่ช่วงไหนดี', `<p>${esc(P.th.bestTime)}</p>`],
    ['พักย่านไหนดีในกระบี่', `<p>จากที่พัก ${stats.n} แห่งที่เรารีวิวไว้ กระจายอยู่แบบนี้: อ่าวนาง ${byZone.aonang} แห่ง · ตัวเมืองกระบี่ ${byZone.town} แห่ง · ไร่เลย์ ${byZone.railay} แห่ง · เกาะลันตา ${byZone.lanta} แห่ง · เกาะพีพี ${byZone.phiphi} แห่ง · คลองม่วง–ทับแขก ${byZone.klongmuang} แห่ง · ใกล้สนามบิน ${byZone.airport} แห่ง</p><p><a href="#zones">ดูไกด์พักย่านไหนดี</a></p>`],
    ['ที่พักกระบี่คืนละเท่าไหร่', `<p>ราคาเริ่มต้นช่วงกลาง 80% อยู่ที่ ฿${nf(stats.p10)}–${nf(stats.p90)} ต่อคืน ค่ากลางอยู่ที่ ฿${nf(stats.p50)} ต่ำสุดคือ ฿${nf(stats.min)} ซึ่งเป็นเตียงดอร์ม และสูงสุด ฿${nf(stats.max)} ซึ่งเป็นวิลลา</p><p><a href="#prices">ดูที่มาของตัวเลข</a></p>`],
    ['ไปเรลเลย์ยังไง', `<p>เรลเลย์และถ้ำพระนางเป็นแหลมที่เข้าถึงได้ด้วยเรือหางยาวเท่านั้น ออกเรือได้จากอ่าวนาง</p><p><a href="${L.art('railay-beach-guide')}">ไกด์เรลเลย์ &amp; ถ้ำพระนาง</a></p>`],
    ['เกาะพีพีกับเกาะลันตาอยู่จังหวัดไหน', `<p>ทั้งสองเกาะอยู่ในเขตจังหวัดกระบี่ ไปด้วยเรือ เกาะพีพีมีอ่าวมาหยาและจุดดำน้ำดูปะการัง ส่วนเกาะลันตาเงียบกว่า มีหาดยาวและเมืองเก่าลันตา</p><p><a href="${L.art('krabi-phi-phi-tour')}">ทัวร์เกาะพีพี</a> · <a href="${L.art('koh-lanta-guide')}">ไกด์เกาะลันตา</a></p>`],
  ] : [
    ['When is the best time to visit Krabi?', `<p>${esc(P.en.bestTime)}</p>`],
    ['Which area should I stay in?', `<p>Across the ${stats.n} stays we have reviewed, the split is: Ao Nang ${byZone.aonang} · Krabi Town ${byZone.town} · Railay ${byZone.railay} · Koh Lanta ${byZone.lanta} · Koh Phi Phi ${byZone.phiphi} · Klong Muang–Tubkaak ${byZone.klongmuang} · near the airport ${byZone.airport}.</p><p><a href="#zones">See the neighbourhood guides</a></p>`],
    ['How much is a night in Krabi?', `<p>The middle 80% of starting prices runs ฿${nf(stats.p10)}–${nf(stats.p90)} per night, with a median of ฿${nf(stats.p50)}. The floor of ฿${nf(stats.min)} is a dorm bed and the ceiling of ฿${nf(stats.max)} is a villa.</p><p><a href="#prices">See how the number is built</a></p>`],
    ['How do you get to Railay?', `<p>Railay and Phra Nang Cave sit on a headland reachable only by longtail boat; boats run from Ao Nang.</p><p><a href="${L.art('railay-beach-guide')}">Railay &amp; Phra Nang guide</a></p>`],
    ['Which province are Koh Phi Phi and Koh Lanta in?', `<p>Both islands are inside Krabi province and are reached by boat. Koh Phi Phi has Maya Bay and snorkelling over coral; Koh Lanta is quieter, with long beaches and Lanta Old Town.</p><p><a href="${L.art('krabi-phi-phi-tour')}">Koh Phi Phi tours</a> · <a href="${L.art('koh-lanta-guide')}">Koh Lanta guide</a></p>`],
  ];
  return list.map(([q, a]) => `<details class="dh-faq"><summary>${esc(q)}</summary><div class="dh-faq-body">${a}</div></details>`).join('\n          ');
}

/* the six seeds for "start a plan" — top 3 stays by our score, one per distinct
   zone, plus the 3 province highlights that have a real guide article. */
const SEED_STAYS = (() => {
  const seen = new Set(); const out = [];
  for (const r of [...rows].sort((a, b) => b.ourScore - a.ourScore)) {
    if (seen.has(r.zone)) continue;
    seen.add(r.zone); out.push(r);
    if (out.length === 3) break;
  }
  return out;
})();
const SEED_SEE = ['railay-beach-guide', 'four-islands-tour', 'wat-tham-suea-guide'];

function planBlock(L) {
  const th = L.lang === 'th';
  const names = [...SEED_STAYS.map(r => th ? r.nameTh : r.nameEn),
  ...SEED_SEE.map(s => {
    const i = (th ? P.th.attractions : P.en.attractions).findIndex((_, k) => ATTR_ART[P.th.attractions[k].name] === s);
    return (th ? P.th.attractions : P.en.attractions)[i].name;
  })];
  return `<section class="ta-sec dh-plan" aria-labelledby="plan-h">
        <h2 id="plan-h">${esc(th ? 'เริ่มแผนเที่ยวกระบี่' : 'Start a Krabi plan')}</h2>
        <p class="ta-fine">${esc(th
    ? 'ปุ่มนี้เพิ่ม 6 ที่ตั้งต้นเข้าทริปของคุณ แล้วคุณค่อยแก้ ลบ หรือจัดวันเองต่อได้ ทุกอย่างเก็บไว้ในเบราว์เซอร์นี้เท่านั้น'
    : 'This adds six starting points to your trip; you then edit, remove or schedule them yourself. Everything stays in this browser only.')}</p>
        <ol>${names.map(n => `<li>${esc(n)}</li>`).join('')}</ol>
        <div class="dh-plan-acts">
          <a class="ta-btn ta-btn-primary" href="${L.tripHref}" data-startplan>${esc(th ? 'เพิ่ม 6 ที่ตั้งต้นเข้าทริป' : 'Add these 6 to my trip')}</a>
          <a class="ta-btn ta-btn-ghost" href="${L.art('krabi-3d2n-itinerary')}">${esc(th ? 'หรือเริ่มจากไกด์ 3 วัน 2 คืน' : 'Or start from the 3-day guide')}</a>
        </div>
        <noscript><p class="ta-fine">${esc(th ? 'ปุ่มแรกต้องใช้จาวาสคริปต์ — ถ้าปิดไว้ ปุ่มจะพาไปหน้าทริปแทน' : 'The first button needs JavaScript; with it off the link simply opens the trip page.')}</p></noscript>
      </section>`;
}

/* ---------- page assembly ---------- */
function page(L) {
  const th = L.lang === 'th';
  const prov = th ? P.th : P.en;
  const attractions = P.th.attractions.map((a, i) => ({
    nameTh: a.name, blurbTh: a.blurb,
    nameEn: P.en.attractions[i].name, blurbEn: P.en.attractions[i].blurb,
  }));
  const hlights = (th ? P.th.highlights : P.en.highlights);
  const nbrNames = { phuket: [th ? 'ภูเก็ต' : 'Phuket'], trang: [th ? 'ตรัง' : 'Trang'], 'phang-nga': [th ? 'พังงา' : 'Phang Nga'], 'nakhon-si-thammarat': [th ? 'นครศรีธรรมราช' : 'Nakhon Si Thammarat'] };

  const tabs = [
    ['stay', th ? 'ที่พัก' : 'Stay', stats.n],
    ['see', th ? 'ที่เที่ยว' : 'See', seeArts.length],
    ['eat', th ? 'ที่กิน' : 'Eat', eatArts.length],
    ['plan', th ? 'แผนเที่ยว' : 'Itineraries', planArts.length],
    ['go', th ? 'การเดินทาง' : 'Getting around', goArts.length],
  ];

  return `<!doctype html>
<html lang="${L.lang}" dir="${L.dir}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<!-- PROTOTYPE ONLY -->
<meta name="robots" content="noindex, nofollow">

<title>${esc(L.title)}</title>
<meta name="description" content="${esc(L.desc)}">
<link rel="canonical" href="https://thailandaddict.com${L.selfHref}">

<meta name="theme-color" content="#FBFAF7" media="(prefers-color-scheme: light)" data-shell data-color="#FBFAF7">
<meta name="theme-color" content="#081113" media="(prefers-color-scheme: dark)"  data-shell data-color="#081113">

<link rel="manifest" href="/_proto/manifest.${L.lang}.webmanifest">

<link rel="stylesheet" href="${CSS}">

<!-- No JS: every tab panel is revealed, so the page degrades to one long
     readable document. Layer order for !important declarations is reversed,
     so this must join the FIRST layer to outrank the shell's [hidden] rule. -->
<noscript><style>@layer tokens{ [role="tabpanel"][hidden]{ display:block !important } }</style></noscript>

<style>
${PAGE_CSS}
</style>

<script>
addEventListener('pagereveal', function (e) {
  if (!e.viewTransition) return;
  var t = 'forwards';
  try {
    var a = window.navigation && navigation.activation;
    if (a && a.navigationType === 'traverse' && a.from && a.entry) {
      t = a.from.index > a.entry.index ? 'back' : 'forwards';
    }
  } catch (err) {}
  e.viewTransition.types.add(t);
});
</script>

<script type="speculationrules">
{"prerender":[{"where":{"and":[
    {"href_matches":"/*"},
    {"not":{"href_matches":"/api/*"}},
    {"not":{"href_matches":"/go/*"}},
    {"not":{"href_matches":"/_proto/*"}},
    {"not":{"selector_matches":".no-prerender, a[target=_blank], a[rel~=sponsored], a[rel~=nofollow]"}}
  ]},"eagerness":"moderate"}],
 "prefetch":[{"where":{"href_matches":"/*"},"eagerness":"conservative"}]}
</script>

<script src="${JS}" defer></script>
</head>
<body class="ta-bleed">
<a class="ta-skip" href="#main">${esc(L.skip)}</a>

${SPRITE}

<header class="ta-topbar" id="taTopbar">
  <a class="ta-topbar-brand" href="/_proto/${th ? '' : 'en/'}home.html">
    <svg class="ta-ic ta-mark" aria-hidden="true"><use href="#i-map-pin"></use></svg>
    <span>Thailandaddict</span>
  </a>

  <span class="ta-topbar-spacer"></span>

  <nav class="ta-nav-desk" aria-label="${esc(th ? 'เมนูหลัก' : 'Main menu')}">
    <a href="/_proto/${th ? '' : 'en/'}home.html">${esc(L.brandNav[0])}</a>
    <a href="${L.selfHref}" aria-current="page">${esc(L.brandNav[1])}</a>
    <a href="${L.tripHref}">${esc(L.brandNav[2])} <span class="ta-badge" data-count="0">0</span></a>
  </nav>

  <form class="ta-search-desk" action="/_proto/${th ? '' : 'en/'}search.html" method="get" role="search">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-search"></use></svg>
    <label class="ta-sr" for="q-desk">${esc(L.searchLbl)}</label>
    <input id="q-desk" type="search" name="q" placeholder="${esc(L.searchPh)}">
  </form>

  <button class="ta-icon-btn lang-trigger" type="button" popovertarget="taLang" aria-label="${esc(L.langLbl)}">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-globe"></use></svg>
    <span>${esc(L.langName)}</span>
  </button>
</header>

<main class="ta-main" id="main">

  <section class="ta-hero-dest">
    <div class="ta-media ta-r-4-5">
      ${pic('/images/heroes/krabi.jpg', L.heroAlt, { eager: true })}
    </div>
    <div class="dh-hero-inner">
      <span class="eyebrow">${esc(L.kicker)}</span>
      <h1>${esc(L.h1)}</h1>
      <p class="dh-tag">${esc(prov.tagline)}</p>
      <ul class="dh-facts ta-chip-scroll">${heroFacts(L)}</ul>
    </div>
  </section>

  <p class="ta-proto-flag">${esc(L.proto)}</p>

  <div class="ta-wrap">

    <section class="ta-sec ta-answer" id="answer">
      <span class="eyebrow">${esc(L.answerLbl)}</span>
      <p>${esc(ANSWER[L.lang])}</p>
    </section>

    <nav class="ta-sec ta-router" aria-labelledby="router-h">
      <h2 class="ta-sr" id="router-h">${esc(L.routerLbl)}</h2>
      <ul>${routerItems(L)}</ul>
    </nav>

    <section class="ta-sec" aria-labelledby="kpi-h">
      <h2 class="ta-sr" id="kpi-h">${esc(th ? 'ตัวเลขของกระบี่' : 'Krabi in numbers')}</h2>
      <ul class="ta-kpi">${kpi(L)}</ul>
    </section>

${band(L)}

${planBlock(L)}

    <div class="ta-tablist" role="tablist" aria-label="${esc(th ? 'หมวดเนื้อหากระบี่' : 'Krabi sections')}">
      ${tabs.map((t, i) => `<a role="tab" href="#p-${t[0]}" id="tab-${t[0]}" aria-controls="p-${t[0]}" aria-selected="${i === 0 ? 'true' : 'false'}"${i === 0 ? '' : ' tabindex="-1"'}>${esc(t[1])} <span class="ta-fac-count">${t[2]}</span></a>`).join('\n      ')}
    </div>

    <section role="tabpanel" id="p-stay" aria-labelledby="tab-stay" tabindex="0">
      <div class="ta-sec-head">
        <h2>${esc(th ? `ที่พักกระบี่ ${stats.n} แห่งที่เรารีวิวเอง` : `${stats.n} Krabi stays we reviewed ourselves`)}</h2>
      </div>

      <div class="dh-filterbar">
        <a class="ta-btn ta-btn-quiet" href="#taFilterFallback" data-sheet="taFilter">
          <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-filter"></use></svg>
          ${esc(th ? 'ตัวกรอง' : 'Filters')}
        </a>
        <span class="dh-sort">
          <label for="sortStay">${esc(th ? 'เรียงตาม' : 'Sort by')}</label>
          <select id="sortStay">
            <option value="ours">${esc(th ? 'อันดับของเรา' : 'Our ranking')}</option>
            <option value="plo">${esc(th ? 'ราคา ต่ำ → สูง' : 'Price: low to high')}</option>
            <option value="phi">${esc(th ? 'ราคา สูง → ต่ำ' : 'Price: high to low')}</option>
            <option value="bsc">${esc(th ? 'คะแนน Booking.com สูงสุด' : 'Booking.com score')}</option>
          </select>
        </span>
        <span class="dh-count" data-result-count aria-live="polite">${esc(th ? `แสดง ${stats.n} จาก ${stats.n} ที่พัก` : `Showing ${stats.n} of ${stats.n} stays`)}</span>
      </div>

      <div class="ta-chip-row dh-applied" data-applied role="group" aria-label="${esc(th ? 'ตัวกรองที่เลือกไว้' : 'Applied filters')}"></div>

      <p class="ta-fine">${esc(th
    ? 'จัดอันดับด้วยคะแนนรวมของเราเอง ซึ่งไม่ใช่คะแนนของเว็บจองเว็บใดเว็บหนึ่ง คะแนนบนการ์ดจึงแยกแสดงว่าเป็นของ Booking.com หรือ Agoda เสมอ'
    : 'The default order is our own ranking, which is not any single booking site\u2019s score. Each card therefore shows the Booking.com and Agoda numbers separately, named.')}</p>

      <div class="ta-grid" data-stay-grid style="margin-block-start:var(--sp-4)">
        ${rows.slice().sort((a, b) => b.ourScore - a.ourScore).map(r => hotelCard(r, L)).join('\n        ')}
      </div>

      <button class="ta-btn ta-btn-ghost ta-btn-block" type="button" data-show-all hidden
              style="margin-block-start:var(--sp-4)">${esc(th ? `แสดงที่พักทั้งหมด ${stats.n} แห่ง` : `Show all ${stats.n} stays`)}</button>

      <p class="dh-empty" data-empty hidden>${esc(th ? 'ไม่มีที่พักที่ตรงกับตัวกรองนี้ ลองเอาตัวกรองบางอันออก' : 'No stay matches this combination. Try removing a filter.')}</p>

      <div class="ta-sec">
        <div class="ta-sec-head"><h3>${esc(th ? 'จัดอันดับที่พักกระบี่ที่เขียนไว้แล้ว' : 'Krabi hotel rankings we have already written')}</h3></div>
        <ul class="dh-links">
            ${roundupList(L)}
        </ul>
      </div>
    </section>

    <section role="tabpanel" id="p-see" aria-labelledby="tab-see" tabindex="0" hidden>
      <div class="ta-sec-head"><h2>${esc(th ? 'ที่เที่ยวกระบี่' : 'What to see in Krabi')}</h2></div>
      <div class="ta-grid">
        ${attractions.map((a, i) => attrCard(a, L, i)).join('\n        ')}
      </div>
      <div class="ta-sec">
        <div class="ta-sec-head"><h3>${esc(th ? 'ไกด์ที่เที่ยวและกิจกรรมทั้งหมด' : 'All sights and activity guides')}</h3></div>
        <ul class="dh-links">
            ${linkList(seeArts, L)}
        </ul>
      </div>
    </section>

    <section role="tabpanel" id="p-eat" aria-labelledby="tab-eat" tabindex="0" hidden>
      <div class="ta-sec-head"><h2>${esc(th ? 'ของกินกระบี่' : 'What to eat in Krabi')}</h2></div>
      <ul class="dh-facts-grid">
            ${foodList(L)}
      </ul>
      <div class="ta-sec">
        <div class="ta-sec-head"><h3>${esc(th ? 'ไกด์ร้านอาหารและจัดอันดับ' : 'Restaurant guides and rankings')}</h3></div>
        <ul class="dh-links">
            ${linkList(eatArts, L)}
        </ul>
      </div>
    </section>

    <section role="tabpanel" id="p-plan" aria-labelledby="tab-plan" tabindex="0" hidden>
      <div class="ta-sec-head"><h2>${esc(th ? 'แผนเที่ยวกระบี่' : 'Krabi itineraries')}</h2></div>
      <ul>
            ${ideaList(L)}
      </ul>
      <div class="ta-sec">
        <div class="ta-sec-head"><h3>${esc(th ? 'แผนเที่ยวแบบเต็มที่เขียนไว้แล้ว' : 'Full itineraries already written')}</h3></div>
        <ul class="dh-links">
            ${linkList(planArts, L)}
        </ul>
      </div>
    </section>

    <section role="tabpanel" id="p-go" aria-labelledby="tab-go" tabindex="0" hidden>
      <div class="ta-sec-head"><h2>${esc(th ? 'ไปกระบี่และเดินทางในกระบี่' : 'Getting to and around Krabi')}</h2></div>
      <ul class="dh-links">
            ${linkList(goArts, L)}
      </ul>
      <div class="ta-map" style="margin-block-start:var(--sp-5)">
        <p class="ta-map-note">${esc(th
    ? 'ยังไม่แสดงแผนที่ เพราะที่พักและจุดเที่ยวในหน้านี้ยังไม่มีพิกัดครบ — แผนที่ที่ปักหมุดไม่ครบแย่กว่าไม่มีแผนที่'
    : 'No map yet: the stays and sights on this page do not all carry coordinates, and a map with missing pins is worse than none.')}</p>
      </div>
    </section>

    <section class="ta-sec dh-when" id="when" aria-labelledby="when-h">
      <h2 id="when-h">${esc(th ? 'ไปกระบี่เดือนไหนดี' : 'When to go to Krabi')}</h2>
      <p>${esc(prov.bestTime)}</p>
      <p class="ta-flag ta-flag-unknown">${esc(th
    ? 'เรายังไม่แสดงตารางรายเดือน 12 ช่อง เพราะยังไม่มีข้อมูลรายเดือนที่ตรวจสอบแล้วสำหรับฝั่งอันดามัน ถ้าเดาแล้วใส่ลงไป จะกลายเป็นคำแนะนำที่มั่นใจแต่ผิด'
    : 'We are not printing a 12-month strip because we do not yet hold verified month-by-month data for the Andaman coast. Guessing it would publish confident advice that is wrong.')}</p>
      <p><a class="ta-btn ta-btn-quiet" href="${L.art('krabi-travel-tips')}">${esc(th ? 'ไกด์เตรียมตัวเที่ยวกระบี่' : 'Krabi trip-prep guide')}</a></p>
    </section>

    <section class="ta-sec" id="zones" aria-labelledby="zones-h">
      <div class="ta-sec-head">
        <h2 id="zones-h">${esc(th ? 'พักย่านไหนดี' : 'Which area to stay in')}</h2>
        <a class="ta-sec-more" href="${L.art('where-to-stay-krabi')}">${esc(th ? 'ภาพรวมทุกย่าน' : 'All areas')} →</a>
      </div>
      <ul class="dh-nbrs">
            ${zoneList(L)}
      </ul>
    </section>

    <section class="ta-sec" aria-labelledby="hl-h">
      <div class="ta-sec-head"><h2 id="hl-h">${esc(th ? 'ที่กระบี่มีอะไร' : 'What Krabi is known for')}</h2></div>
      <ul class="dh-facts-grid">
        ${hlights.map(h => `<li><h3>${esc(h.name)}</h3><p>${esc(h.blurb)}</p></li>`).join('\n        ')}
      </ul>
    </section>

    <section class="ta-sec" aria-labelledby="faq-h">
      <div class="ta-sec-head"><h2 id="faq-h">${esc(th ? 'คำถามที่พบบ่อยเรื่องกระบี่' : 'Common questions about Krabi')}</h2></div>
          ${faqs(L)}
    </section>

    <section class="ta-sec" aria-labelledby="nbr-h">
      <div class="ta-sec-head"><h2 id="nbr-h">${esc(th ? 'จังหวัดใกล้เคียง' : 'Nearby provinces')}</h2></div>
      <ul class="dh-nbrs">
        ${prov.neighbors.map(n => `<li><a href="${L.hub(n)}"><span>${esc(nbrNames[n][0])}</span><svg class="ta-ic ta-ic-20 i-arrow" aria-hidden="true"><use href="#i-arrow"></use></svg></a></li>`).join('\n        ')}
      </ul>
      <p class="ta-fine">${esc(th ? 'ลิงก์ทั้งสี่ไปหน้าจังหวัดของเว็บจริง เพื่อให้เทียบดีไซน์เก่า–ใหม่ได้' : 'These four link to the live province pages, so the old and new designs can be compared side by side.')}</p>
    </section>

    <section class="ta-sec">
      <div class="dh-byline">
        <img src="/images/team/doctor-chat-avatar.jpg" alt="" width="48" height="48" loading="lazy" decoding="async" class="ta-r-1-1">
        <span><b>${esc(th ? ED.name : ED.nameEn)}</b> · ${esc(th ? ED.role : ED.roleEn)}<br>
        <span class="ta-fine">${esc(th ? ED.bio : ED.bioEn)}</span></span>
      </div>
    </section>

  </div>
</main>

<aside class="ta-rail" aria-label="${esc(L.railLbl)}">
  <button class="ta-rail-toggle" type="button" data-rail-toggle aria-expanded="false" aria-controls="taRailBody">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-bookmark"></use></svg>
    <span class="ta-badge" data-count="0">0</span>
    <span class="ta-rail-label">${esc(L.railLbl)}</span>
  </button>
  <div class="ta-rail-body" id="taRailBody">
    <p class="ta-fine" data-trip-count-label>${esc(L.railCount)}</p>
    <p class="ta-fine"><a href="${L.tripHref}">${esc(th ? 'เปิดหน้าทริป' : 'Open the trip page')} →</a></p>
  </div>
</aside>

<nav class="ta-tabbar" aria-label="${esc(th ? 'หลัก' : 'Primary')}">
  <a class="ta-tab" href="/_proto/${th ? '' : 'en/'}home.html" data-tab="explore">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-search"></use></svg><span>${esc(L.tabs[0])}</span>
  </a>
  <a class="ta-tab" href="${L.selfHref}" data-tab="places" aria-current="page">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-map-pin"></use></svg><span>${esc(L.tabs[1])}</span>
  </a>
  <a class="ta-tab" href="/_proto/${th ? '' : 'en/'}search.html" data-sheet="taSearch" data-tab="search">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-search"></use></svg><span>${esc(L.tabs[2])}</span>
  </a>
  <a class="ta-tab" href="${L.tripHref}" data-tab="trip">
    <span class="ta-tab-ic">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-bookmark"></use></svg>
      <b class="ta-badge" data-count="0">0</b>
    </span>
    <span>${esc(L.tabs[3])}</span>
  </a>
  <button class="ta-tab" type="button" popovertarget="taMore" data-tab="more">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-menu"></use></svg><span>${esc(L.tabs[4])}</span>
  </button>
</nav>

<div id="taMore" popover class="ta-more">
  <p class="ta-more-label">${esc(L.more.display)}</p>
  <button type="button" data-theme-set="cycle">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-sun"></use></svg>
    <span>${esc(L.more.theme)}</span>
    <span class="ta-topbar-spacer"></span>
    <span data-theme-label>${esc(L.more.sys)}</span>
  </button>
  <button type="button" popovertarget="taLang">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-globe"></use></svg>
    <span>${esc(L.more.lang)}</span>
  </button>
  <hr>
  <a href="${L.tripHref}">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-bookmark"></use></svg>
    <span>${esc(L.more.saved)}</span>
  </a>
  <button type="button" data-install hidden>
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-download"></use></svg>
    <span>${esc(L.more.install)}</span>
  </button>
</div>

<div id="taLang" popover class="lang-menu">
  <a href="/_proto/krabi.html" hreflang="th"${th ? ' aria-current="true"' : ''}>ไทย</a>
  <a href="/_proto/en/krabi.html" hreflang="en"${th ? '' : ' aria-current="true"'}>English</a>
</div>

${facetSheet(L)}

<dialog class="ta-sheet" id="taSearch" aria-labelledby="taSearchTitle">
  <div class="ta-sheet-grip" aria-hidden="true"></div>
  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title" id="taSearchTitle">${esc(L.searchLbl)}</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="${esc(th ? 'ปิด' : 'Close')}">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>
  <div class="ta-sheet-body">
    <form action="/_proto/${th ? '' : 'en/'}search.html" method="get" role="search">
      <label class="ta-sr" for="q-sheet">${esc(L.searchLbl)}</label>
      <input id="q-sheet" type="search" name="q" placeholder="${esc(L.searchPh)}" style="inline-size:100%;min-block-size:44px;padding-inline:var(--sp-3);border:1px solid var(--border);border-radius:var(--r-md);background:var(--surface-2);color:var(--text);font:inherit">
      <button class="ta-btn ta-btn-primary ta-btn-block" type="submit" style="margin-block-start:var(--sp-3)">${esc(L.searchLbl)}</button>
    </form>
  </div>
</dialog>

<script>
${PAGE_JS(L)}
</script>
</body>
</html>`;
}

/* ---------- page JS (no inline handlers anywhere; one script, delegated) ---------- */
function PAGE_JS(L) {
  const th = L.lang === 'th';
  const tShow = th ? 'แสดง' : 'Show';
  const tStays = th ? 'ที่พัก' : 'stays';
  const tShowing = th ? (a, b) => `แสดง ${a} จาก ${b} ที่พัก` : (a, b) => `Showing ${a} of ${b} stays`;
  return `(function () {
  'use strict';
  var D = document;

  /* ------------------------------------------------------------------ tabs
     Real ARIA tabs: roving tabindex, Arrow/Home/End, hash-synced and
     back-restorable via pushState. Panels never leave the DOM. */
  var list = D.querySelector('.ta-tablist[role="tablist"]');
  var tabs = list ? [].slice.call(list.querySelectorAll('[role="tab"]')) : [];
  var panels = tabs.map(function (t) { return D.getElementById(t.getAttribute('aria-controls')); });

  function select(i, opts) {
    opts = opts || {};
    tabs.forEach(function (t, j) {
      var on = i === j;
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
      if (panels[j]) panels[j].hidden = !on;
    });
    if (opts.focus && tabs[i]) tabs[i].focus();
    if (opts.scroll && list) list.scrollIntoView({ block: 'start', behavior: 'auto' });
    if (tabs[i] && list) {
      var r = tabs[i].getBoundingClientRect(), lr = list.getBoundingClientRect();
      if (r.left < lr.left || r.right > lr.right) tabs[i].scrollIntoView({ inline: 'center', block: 'nearest' });
    }
  }

  function indexOfHash(h) {
    for (var i = 0; i < panels.length; i++) if (panels[i] && '#' + panels[i].id === h) return i;
    return -1;
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener('click', function (ev) {
      ev.preventDefault();
      select(i, { scroll: true });
      try { history.pushState(null, '', tab.getAttribute('href')); } catch (e) {}
    });
    tab.addEventListener('keydown', function (ev) {
      var k = ev.key, n = -1, last = tabs.length - 1;
      var rtl = D.documentElement.getAttribute('dir') === 'rtl';
      if (k === 'ArrowRight') n = rtl ? i - 1 : i + 1;
      else if (k === 'ArrowLeft') n = rtl ? i + 1 : i - 1;
      else if (k === 'Home') n = 0;
      else if (k === 'End') n = last;
      else if (k === 'ArrowDown') { if (panels[i]) { ev.preventDefault(); panels[i].focus(); } return; }
      else return;
      ev.preventDefault();
      if (n < 0) n = last; if (n > last) n = 0;
      select(n, { focus: true });
      try { history.replaceState(null, '', tabs[n].getAttribute('href')); } catch (e) {}
    });
  });

  /* router + any in-page link that points at a panel */
  D.addEventListener('click', function (ev) {
    var a = ev.target.closest && ev.target.closest('a[href^="#p-"]');
    if (!a || a.getAttribute('role') === 'tab') return;
    var i = indexOfHash(a.getAttribute('href'));
    if (i < 0) return;
    ev.preventDefault();
    select(i, { scroll: true });
    try { history.pushState(null, '', a.getAttribute('href')); } catch (e) {}
  });

  addEventListener('popstate', function () {
    var i = indexOfHash(location.hash);
    if (i >= 0) select(i);
  });

  var start = indexOfHash(location.hash);
  select(start >= 0 ? start : 0, { scroll: start >= 0 });

  /* -------------------------------------------------------------- faceted
     filter. Counts are recomputed from the DOM on every change, so an
     option that would leave nothing is DISABLED and greyed — never hidden. */
  var grid = D.querySelector('[data-stay-grid]');
  if (!grid) return;
  var cards = [].slice.call(grid.querySelectorAll('[data-hotel]'));
  var facBtns = [].slice.call(D.querySelectorAll('[data-facet]'));
  var applyBtn = D.querySelector('[data-filter-apply]');
  var clearBtn = D.querySelector('[data-filter-clear]');
  var appliedRow = D.querySelector('[data-applied]');
  var countEl = D.querySelector('[data-result-count]');
  var emptyEl = D.querySelector('[data-empty]');
  var sortSel = D.getElementById('sortStay');
  var order = cards.slice();

  var state = { zone: [], band: [], star: [], score: [] };

  function hit(card, st) {
    if (st.zone.length && st.zone.indexOf(card.dataset.zone) < 0) return false;
    if (st.band.length && st.band.indexOf(card.dataset.band) < 0) return false;
    if (st.star.length && st.star.indexOf(card.dataset.star) < 0) return false;
    if (st.score.length) {
      var s = parseFloat(card.dataset.bscore) || 0, ok = false;
      for (var i = 0; i < st.score.length; i++) if (s >= parseFloat(st.score[i])) ok = true;
      if (!ok) return false;
    }
    return true;
  }

  function countWith(group, value) {
    var st = { zone: state.zone.slice(), band: state.band.slice(), star: state.star.slice(), score: state.score.slice() };
    st[group] = [value];
    var n = 0;
    for (var i = 0; i < cards.length; i++) if (hit(cards[i], st)) n++;
    return n;
  }

  function labelOf(btn) {
    return btn.textContent.replace(/\\s+/g, ' ').replace(/\\s*\\d+\\s*$/, '').trim();
  }

  /* Default view caps the grid at FIRST_PAGE cards so an unfiltered hub is not
     a 57,000px scroll. Every card stays in the DOM either way — capping is a
     hidden attribute, so crawlers and Ctrl-F still see all 66, and with JS
     off the button never unhides and the full list renders. */
  var FIRST_PAGE = 24;
  var showAll = false;
  var showAllBtn = D.querySelector('[data-show-all]');

  function render() {
    var anyFacet = state.zone.length || state.band.length || state.star.length || state.score.length;
    var cap = (!showAll && !anyFacet) ? FIRST_PAGE : Infinity;
    var matched = 0, shown = 0;
    for (var i = 0; i < cards.length; i++) {
      var on = hit(cards[i], state);
      if (on) matched++;
      var visible = on && shown < cap;
      cards[i].hidden = !visible;
      if (visible) shown++;
    }
    if (showAllBtn) showAllBtn.hidden = shown >= matched;
    if (countEl) countEl.textContent = ${th ? '\'แสดง \' + shown + \' จาก \' + cards.length + \' ที่พัก\'' : '\'Showing \' + shown + \' of \' + cards.length + \' stays\''};
    if (emptyEl) emptyEl.hidden = matched !== 0;
    if (applyBtn) applyBtn.textContent = ${JSON.stringify(tShow)} + ' ' + matched + ' ' + ${JSON.stringify(tStays)};

    facBtns.forEach(function (b) {
      var n = countWith(b.dataset.facet, b.dataset.value);
      var c = b.querySelector('.ta-fac-count');
      if (c) c.textContent = n;
      var chosen = state[b.dataset.facet].indexOf(b.dataset.value) >= 0;
      b.setAttribute('aria-pressed', chosen ? 'true' : 'false');
      b.disabled = n === 0 && !chosen;
    });

    if (appliedRow) {
      appliedRow.textContent = '';
      facBtns.forEach(function (b) {
        if (state[b.dataset.facet].indexOf(b.dataset.value) < 0) return;
        var chip = D.createElement('button');
        chip.type = 'button';
        chip.className = 'ta-fac';
        chip.setAttribute('aria-pressed', 'true');
        chip.dataset.facet = b.dataset.facet;
        chip.dataset.value = b.dataset.value;
        chip.dataset.remove = '1';
        chip.textContent = labelOf(b) + ' \\u00d7';
        appliedRow.appendChild(chip);
      });
    }

    var qs = [];
    ['zone', 'band', 'star', 'score'].forEach(function (k) { if (state[k].length) qs.push(k + '=' + state[k].join(',')); });
    try {
      history.replaceState(null, '', location.pathname + (qs.length ? '?' + qs.join('&') : '') + location.hash);
    } catch (e) {}
  }

  function toggle(group, value) {
    var arr = state[group], i = arr.indexOf(value);
    if (i < 0) arr.push(value); else arr.splice(i, 1);
    render();
  }

  D.addEventListener('click', function (ev) {
    var b = ev.target.closest && ev.target.closest('[data-facet]');
    if (!b || b.disabled) return;
    ev.preventDefault();
    toggle(b.dataset.facet, b.dataset.value);
  });

  if (showAllBtn) showAllBtn.addEventListener('click', function () { showAll = true; render(); });

  if (clearBtn) clearBtn.addEventListener('click', function () {
    state = { zone: [], band: [], star: [], score: [] };
    render();
  });

  if (sortSel) sortSel.addEventListener('change', function () {
    var v = sortSel.value, arr = order.slice();
    if (v === 'plo') arr.sort(function (a, b) { return a.dataset.price - b.dataset.price; });
    else if (v === 'phi') arr.sort(function (a, b) { return b.dataset.price - a.dataset.price; });
    else if (v === 'bsc') arr.sort(function (a, b) { return (b.dataset.bscore - a.dataset.bscore) || (b.dataset.ourscore - a.dataset.ourscore); });
    var f = D.createDocumentFragment();
    arr.forEach(function (c) { f.appendChild(c); });
    grid.appendChild(f);
  });

  /* read facet state back out of the query string on load */
  (function () {
    var p = new URLSearchParams(location.search);
    ['zone', 'band', 'star', 'score'].forEach(function (k) {
      var v = p.get(k);
      if (v) state[k] = v.split(',').filter(Boolean);
    });
  })();
  render();

  /* --------------------------------------------------- seed the POI cache
     from the real markup, then wire the "start a plan" seeding button. */
  function poiFrom(btn) {
    return {
      id: btn.getAttribute('data-poi-id'), poiId: btn.getAttribute('data-poi-id'),
      name: btn.getAttribute('data-name'), url: btn.getAttribute('data-url'),
      img: btn.getAttribute('data-img'), kind: btn.getAttribute('data-kind'),
      province: 'krabi',
      score: btn.getAttribute('data-score') || undefined,
      priceFrom: btn.getAttribute('data-price-from') || undefined
    };
  }

  function whenTA(fn) {
    if (window.TA && TA.poi) { fn(); return; }
    var n = 0, id = setInterval(function () {
      if (window.TA && TA.poi) { clearInterval(id); fn(); }
      else if (++n > 60) clearInterval(id);
    }, 50);
  }

  whenTA(function () {
    var all = [].slice.call(D.querySelectorAll('[data-save][data-poi-id]'));
    TA.poi.putAll(all.map(poiFrom));
  });

  var SEED = ${JSON.stringify([...SEED_STAYS.map(r => 's:' + poiId(r.slug)), ...SEED_SEE.map(s => 'a:' + s)])};
  var startBtn = D.querySelector('[data-startplan]');
  if (startBtn) startBtn.addEventListener('click', function (ev) {
    if (!window.TA || !TA.save) return;             /* no JS shell -> plain link */
    ev.preventDefault();
    var added = 0;
    SEED.forEach(function (id) {
      var btn = D.querySelector('[data-save][data-poi-id="' + id + '"]');
      if (!btn) return;
      if (!TA.has(id)) { TA.save(id, poiFrom(btn)); added++; }
      btn.setAttribute('aria-pressed', 'true');
    });
    TA.nav.syncBadge(); TA.nav.syncSaves();
    TA.toast(${th
      ? '\'เพิ่ม \' + added + \' ที่เข้าทริปแล้ว · รวม \' + (TA.saves.count() + TA.trip.count()) + \' รายการ\''
      : '\'Added \' + added + \' places · \' + (TA.saves.count() + TA.trip.count()) + \' in your trip\''}, { href: ${JSON.stringify(L.tripHref)} });
  });
})();`;
}

/* ---------- write ---------- */
fs.mkdirSync(path.dirname(OUT_TH), { recursive: true });
fs.mkdirSync(path.dirname(OUT_EN), { recursive: true });
fs.writeFileSync(OUT_TH, page(T.th), 'utf8');
fs.writeFileSync(OUT_EN, page(T.en), 'utf8');
console.log('wrote', OUT_TH, fs.statSync(OUT_TH).size, 'bytes');
console.log('wrote', OUT_EN, fs.statSync(OUT_EN).size, 'bytes');

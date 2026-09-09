/* =============================================================================
   chrome.mjs — the ONE app-shell partial
   Blueprint §4.0 · §4.1 · §4.2 · §4.8 · markup contract: _internal/shell/PROTO-KIT.md

   One header, one tab bar, one rail, one footer, one icon sprite — as plain
   functions returning HTML strings, with no dependency beyond node:fs.

   FOUR CONSUMERS, ONE SOURCE:
     _internal/gen-hubs.mjs            (~476 hub snapshots, 9 locales)
     astro/src/components/Shell.astro  (ReviewLayout / RoundupLayout / ArticleLayout)
     the ~24 hand-written astro/public/*.html pages
     astro/public/_proto/*             (reference implementation)

   Shell.astro imports THIS FILE and emits its return values verbatim, so the
   two renderers cannot drift. That is the entire point: the audit found five
   different navs and four different save writers, all of which began as one
   component that someone copied.

   RULES BAKED IN HERE — do not "simplify" them away:
   1. Every tab destination is a real <a href>. div[tabindex] removes them from
      the crawl graph, breaks middle-click and screen readers, and defeats
      Speculation Rules, which match anchors.
   2. Search is an anchor that JS upgrades into a sheet. No JS -> it navigates.
   3. More is <button popovertarget> — top layer, light dismiss, Esc, zero JS.
   4. The Trip badge is always present, showing 0. The affordance to save has
      to exist BEFORE the first save, not after it.
   5. aria-current="page" is set HERE, at build time, never by script, so it is
      right on the prerendered paint.
   6. Language NAMES, never flags. The flag bar was the direct cause of the
      mobile overflow: nine 30px targets that degrade to bare letters where
      regional-indicator glyphs are unsupported.
   7. No emoji in interface chrome. Emoji live in exactly three places on this
      site: the bookmark save label, the medal badge, and inside prose.
   8. No inline on* handlers, ever. shell.js is one delegated listener.

   i18n RULE FOR PHASE 2, NON-NEGOTIABLE: this file introduces no change to any
   existing translated string. Every label is overridable through ctx.labels, so
   a renderer that already owns translations (gen-hubs keys 2,716 of them on the
   literal English string) passes its own and nothing is re-keyed. The built-in
   table is a fallback for labels that did not exist before the shell did.
   ========================================================================== */

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const HERE = path.dirname(fileURLToPath(import.meta.url));

/* ---------------------------------------------------------------------------
   ROOT — the directory that holds astro/ and _internal/.

   It is deliberately NOT `path.resolve(HERE, '..', '..')`.

   The moment a layout imports Shell.astro, Vite bundles THIS module into an
   Astro SSR chunk, and inside that chunk `import.meta.url` points at the
   chunk, not at this file. ROOT then lands somewhere under astro/dist and
   every readFileSync below fails with ENOENT — but only at "generating static
   routes", minutes into a 17-minute build, with a stack trace that names
   node:fs and not this file. It cost one build to find; it does not get to
   cost another.

   So probe instead of assume: the file-relative guess first (correct, and
   free, whenever this module is loaded as a real file — gen-hubs.mjs, the QA
   scripts), then walk up from the working directory (npm run build runs from
   astro/). Keep the first candidate that actually contains the marker file.
   ------------------------------------------------------------------------ */
const ROOT_MARKER = path.join('astro', 'src', 'i18n', 'meta.json');

function findRoot() {
  const tried = [];
  for (const seed of [path.resolve(HERE, '..', '..'), process.cwd()]) {
    let dir = seed;
    for (let up = 0; up < 8; up++) {
      tried.push(dir);
      if (existsSync(path.join(dir, ROOT_MARKER))) return dir;
      const parent = path.dirname(dir);
      if (parent === dir) break;
      dir = parent;
    }
  }
  throw new Error(
    'chrome.mjs: no repo root found — nothing under ' + JSON.stringify(tried) +
    ' contains ' + ROOT_MARKER
  );
}

const ROOT = findRoot();

/* ===========================================================================
   0. LOCALE FACTS — one source, astro/src/i18n/meta.json (§4.9)

   Four renderers each privately redeclare `new Set(['he','ar'])` today. This
   is the file that ends that: dir, label and hreflang come from meta.json and
   nowhere else.
   ======================================================================== */

const META = JSON.parse(
  readFileSync(path.join(ROOT, 'astro', 'src', 'i18n', 'meta.json'), 'utf8')
);

/** @type {Map<string, {code:string,label:string,dir:string,hreflang:string}>} */
const LOCALES = new Map(META.locales.map((l) => [l.code, l]));

export const DEFAULT_LOCALE = META.defaultLocale || 'th';
export const localeMeta = (code) => LOCALES.get(code) || LOCALES.get(DEFAULT_LOCALE);
export const dirOf = (code) => (localeMeta(code).dir === 'rtl' ? 'rtl' : 'ltr');

/* --- Translated chrome that ALREADY exists in the repo --------------------
   astro/src/i18n/ui.<lang>.json carries real, human-checked nav/footer strings
   for all nine locales. It has been dead since it was written; this is its
   first consumer. Loaded lazily so a renderer that never asks for a footer
   never pays for the read. */
const UI_CACHE = new Map();
function ui(locale) {
  if (UI_CACHE.has(locale)) return UI_CACHE.get(locale);
  let dict = {};
  try {
    dict = JSON.parse(
      readFileSync(path.join(ROOT, 'astro', 'src', 'i18n', `ui.${locale}.json`), 'utf8')
    );
  } catch { /* locale has no dictionary yet — fall through to the built-ins */ }
  UI_CACHE.set(locale, dict);
  return dict;
}

/* ===========================================================================
   1. LABELS

   Only strings that did NOT exist before the shell did. Everything the site
   already translates (nav.*, footer.*) is read from ui.<lang>.json above.

   th and en are complete. The other seven locales fall back to en, per
   meta.json fallbackOrder ["en","th"]. They are NOT machine-translated here:
   raw MT is what produced the wave-2 Thai-leak defect, and blueprint 7d is the
   gate where copy is allowed to change. `missingLabelLocales()` below
   enumerates exactly what a 7d pass has to supply.
   ======================================================================== */

const LABELS = {
  th: {
    skip: 'ข้ามไปเนื้อหาหลัก',
    navAria: 'เมนูหลัก',
    tabbarAria: 'หลัก',
    explore: 'สำรวจ',
    places: 'จุดหมาย',
    search: 'ค้นหา',
    searchPlaceholder: 'ที่พัก ร้านอาหาร จุดหมาย',
    trip: 'ทริป',
    more: 'เมนู',
    language: 'ภาษา',
    display: 'การแสดงผล',
    theme: 'ธีม',
    themeSystem: 'ตามระบบ',
    saved: 'ที่บันทึกไว้',
    nearMe: 'ใกล้ฉัน',
    install: 'ติดตั้งเป็นแอป',
    railAria: 'ทริปของคุณ',
    railLabel: 'ทริปของคุณ',
    railEmpty: 'ยังไม่มีรายการ — กด 🔖 ที่การ์ดไหนก็ได้เพื่อเริ่ม',
    railOpen: 'เปิดหน้าทริป',
    close: 'ปิด',
  },
  en: {
    skip: 'Skip to main content',
    navAria: 'Main menu',
    tabbarAria: 'Main',
    explore: 'Explore',
    places: 'Destinations',
    search: 'Search',
    searchPlaceholder: 'Hotels, restaurants, destinations',
    trip: 'Trip',
    more: 'Menu',
    language: 'Language',
    display: 'Display',
    theme: 'Theme',
    themeSystem: 'System',
    saved: 'Saved',
    nearMe: 'Near me',
    install: 'Install as app',
    railAria: 'Your trip',
    railLabel: 'Your trip',
    railEmpty: 'Nothing saved yet — tap 🔖 on any card to start',
    railOpen: 'Open your trip',
    close: 'Close',
  },
};

/** Locales that have their own shell label set. Everything else falls back. */
export const LABEL_LOCALES = Object.keys(LABELS);

/** The keys a Phase-7d i18n pass still has to supply for `locale`. */
export function missingLabelLocales() {
  return META.locales
    .map((l) => l.code)
    .filter((c) => !LABELS[c]);
}

function labelsFor(ctx) {
  const base = LABELS[ctx.locale] || LABELS.en;
  return Object.assign({}, LABELS.en, base, ctx.labels || {});
}

/* ===========================================================================
   2. ESCAPING

   Every interpolated value is escaped. A hub title, a hotel name and a
   translated string are all data, and one unescaped quote in an aria-label is
   the same defect class as the stored XSS the 2026-07 audit found on /t/:id.
   ======================================================================== */

const AMP = /&/g, LT = /</g, GT = />/g, QUOT = /"/g, APOS = /'/g;

export function esc(s) {
  return String(s == null ? '' : s)
    .replace(AMP, '&amp;').replace(LT, '&lt;').replace(GT, '&gt;');
}
export function escAttr(s) {
  return esc(s).replace(QUOT, '&quot;').replace(APOS, '&#39;');
}

/* ===========================================================================
   3. CONTEXT

   ctx, with every field optional except `locale`:

     locale   'th' | 'en' | 'zh' | 'ru' | 'ko' | 'ja' | 'he' | 'ar' | 'hi'
     dir      'ltr' | 'rtl'                    (default: from meta.json)
     tab      'explore'|'places'|'search'|'trip'|'more'|null
                                               which tab is the current page
     kind     'review'|'roundup'|'article'|'hub'|'home'|'page'
                                               the page kind; review suppresses
                                               the tab bar via html.rl-page
     path     '/review-rayavadee-krabi'        canonical path of THIS page
     locales  [{ code, href }]                 the locales THIS page exists in,
                                               availability-driven — never the
                                               full nine unless all nine exist
     labels   { … }                            per-string overrides; a renderer
                                               that owns translations passes
                                               them here and nothing is re-keyed
     href     { home, places, search, trip, saved, nearMe }
                                               destination overrides
     footer   { tagline, blurb, columns, legal, note }
     railHref                                  where the rail's button points
     brand    'Thailandaddict'
   ======================================================================== */

const DEFAULT_HREF = {
  home: '/',
  places: '/country-thailand.html',
  search: '/search',
  trip: '/trip',
  saved: '/saved',
  nearMe: '/near-me.html',
};

/** Prefix a site-root path with the locale segment. th is the root locale. */
export function localePath(locale, p) {
  if (!p || /^(https?:)?\/\//.test(p)) return p;
  if (!locale || locale === DEFAULT_LOCALE) return p;
  return '/' + locale + (p.startsWith('/') ? p : '/' + p);
}

function hrefsFor(ctx) {
  const out = {};
  for (const k of Object.keys(DEFAULT_HREF)) out[k] = localePath(ctx.locale, DEFAULT_HREF[k]);
  return Object.assign(out, ctx.href || {});
}

/** aria-current="page" is a build-time decision (§4.1 rule 6). */
const current = (on) => (on ? ' aria-current="page"' : '');

/* ===========================================================================
   4. ICON SPRITE (§3.6, PROTO-KIT §12)

   One owned monoline set: 1.5px stroke at 24px, round caps and joins,
   stroke:currentColor, fill:none, sizes 16/20/24 only. Paste ONCE per page as
   the first element in <body>, before anything that <use>s it.

   Only #i-chevron and #i-arrow mirror under dir="rtl" — that is done in
   shell.css by class, not here.

   PROTO-KIT §12 also shows a <defs><g id="ta-i"> block. Nothing references it;
   the 17 shipped prototype pages all dropped it. Omitted deliberately rather
   than shipping 120 dead bytes to ~18,000 pages.
   ======================================================================== */

const S_OPEN = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"';

const ICONS = {
  'i-search': '<circle cx="10.75" cy="10.75" r="6.75"/><path d="M15.6 15.6 20.5 20.5"/>',
  'i-bookmark': '<path d="M6.25 4.5h11.5a.75.75 0 0 1 .75.75v14.4l-6.5-4.1-6.5 4.1V5.25a.75.75 0 0 1 .75-.75Z"/>',
  'i-map-pin': '<path d="M12 21c4.2-4.2 6.5-7.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 13.6 7.8 16.8 12 21Z"/><circle cx="12" cy="10.3" r="2.4"/>',
  'i-calendar': '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M8 3v4M16 3v4M3.5 10h17"/>',
  'i-chevron': '<path d="m9.25 5 7 7-7 7"/>',
  'i-arrow': '<path d="M4 12h15.5M13.5 6l6 6-6 6"/>',
  'i-globe': '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/><path d="M12 3.5c2.3 2.4 3.5 5.3 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.3-3.5-8.5S9.7 5.9 12 3.5Z"/>',
  'i-menu': '<path d="M4 7h16M4 12h16M4 17h16"/>',
  'i-close': '<path d="m6 6 12 12M18 6 6 18"/>',
  'i-plus': '<path d="M12 4.75v14.5M4.75 12h14.5"/>',
  'i-check': '<path d="m4.75 12.5 4.75 4.75L19.25 6.75"/>',
  'i-star': '<path d="m12 3.75 2.62 5.31 5.86.85-4.24 4.13 1 5.84L12 17.13l-5.24 2.75 1-5.84-4.24-4.13 5.86-.85Z"/>',
  'i-clock': '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.25V12l3.25 2"/>',
  'i-filter': '<path d="M4 7h16M7 12h10M10 17h4"/>',
  'i-share': '<circle cx="17.5" cy="6" r="2.75"/><circle cx="6.5" cy="12" r="2.75"/><circle cx="17.5" cy="18" r="2.75"/><path d="m9 10.7 6-3.4M9 13.3l6 3.4"/>',
  'i-download': '<path d="M12 3.75v11M7.75 10.5 12 14.75l4.25-4.25M4.5 19.5h15"/>',
  'i-sun': '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.2M12 19.3v2.2M4.28 4.28l1.56 1.56M18.16 18.16l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.28 19.72l1.56-1.56M18.16 5.84l1.56-1.56"/>',
  'i-moon': '<path d="M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4Z"/>',
};

export const ICON_NAMES = Object.keys(ICONS);

/** `<svg class="ta-ic"><use href="#i-search"></use></svg>` — the only way to
 *  place an icon. `size` is 24 (default), 20 or 16. Nothing else exists. */
export function icon(name, size, extraClass) {
  const cls = ['ta-ic'];
  if (size === 20 || size === 16) cls.push('ta-ic-' + size);
  if (extraClass) cls.push(extraClass);
  return `<svg class="${cls.join(' ')}" aria-hidden="true"><use href="#${name}"></use></svg>`;
}

export function sprite() {
  const symbols = ICON_NAMES
    .map((n) => `<symbol id="${n}" ${S_OPEN}>${ICONS[n]}</symbol>`)
    .join('\n');
  return `<svg class="ta-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
${symbols}
</svg>`;
}

/* ===========================================================================
   4b. THE <head> BLOCK (§3, §4.3, §4.4, PROTO-KIT §1)

   Shell.astro and gen-hubs.mjs both emit THIS string, so the hashed filenames,
   the speculation rules and the safe-area meta cannot diverge between the
   layouts and the hubs — which is exactly how the site ended up with five navs.
   ======================================================================== */

/** Paper and night-950. The two values a browser paints the OS chrome with,
 *  which is why they are literal here and not var(): a <meta> cannot read CSS.
 *  Keep in step with tokens.css --paper / --night-950. */
export const THEME_COLOR = { light: '#FBFAF7', dark: '#081113' };

let MANIFEST = null;
export function shellManifest() {
  if (!MANIFEST) {
    MANIFEST = JSON.parse(
      readFileSync(path.join(ROOT, 'astro', 'src', 'data', 'shell-manifest.json'), 'utf8')
    );
  }
  return MANIFEST;
}

/* Incoming view-transition direction. MUST be a parser-blocking inline script
   in <head>: pagereveal fires before any deferred script runs, so a module
   would arrive too late and the transition would play backwards. */
const PAGEREVEAL = `<script>
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
<\/script>`;

/* Speculation Rules (§4.4). eagerness "moderate" = 200ms hover / pointerdown,
   NEVER "immediate": on an 18k-page site immediate burns a Thai traveller's
   mobile data, and Chrome caps non-immediate speculation at 2 prerenders FIFO.

   The exclusions are revenue-critical, not cosmetic. /go/* is the affiliate
   redirector and every outbound booking link carries rel="sponsored" — a
   prerender of either would fire a click the reader never made, corrupting
   attribution on Agoda cid=1965862, Trip.com, Klook and the CJ Booking feed. */
const SPECULATION = `<script type="speculationrules">
{"prerender":[{"where":{"and":[
    {"href_matches":"/*"},
    {"not":{"href_matches":"/api/*"}},
    {"not":{"href_matches":"/go/*"}},
    {"not":{"href_matches":"/_proto/*"}},
    {"not":{"selector_matches":".no-prerender, a[target=_blank], a[rel~=sponsored], a[rel~=nofollow]"}}
  ]},"eagerness":"moderate"}],
 "prefetch":[{"where":{"href_matches":"/*"},"eagerness":"conservative"}]}
<\/script>`;

export function shellHead(ctx) {
  const m = (ctx && ctx.manifest) || shellManifest();
  return `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<meta name="theme-color" content="${THEME_COLOR.light}" media="(prefers-color-scheme: light)" data-shell data-color="${THEME_COLOR.light}">
<meta name="theme-color" content="${THEME_COLOR.dark}" media="(prefers-color-scheme: dark)" data-shell data-color="${THEME_COLOR.dark}">

<link rel="stylesheet" href="${escAttr(m.css)}">

${PAGEREVEAL}

${SPECULATION}

<script src="${escAttr(m.js)}" defer><\/script>`;
}

/* ===========================================================================
   5. SKIP LINK
   ======================================================================== */

export function skipLink(ctx) {
  const L = labelsFor(ctx);
  return `<a class="ta-skip" href="#main">${esc(L.skip)}</a>`;
}

/* ===========================================================================
   6. HEADER (§4.2, PROTO-KIT §3)

   Condenses on scroll: Chromium via a scroll-driven animation in shell.css,
   Firefox via the IntersectionObserver fallback shell.js installs by itself.
   Nothing to add per page.
   ======================================================================== */

export function header(ctx) {
  const L = labelsFor(ctx);
  const H = hrefsFor(ctx);
  const brand = ctx.brand || 'Thailandaddict';
  const locales = availableLocales(ctx);
  const me = localeMeta(ctx.locale);

  /* One locale available -> no switcher. A menu with a single entry is noise,
     and pageLocales()/lib/locales.ts already computes availability correctly.
     Do not regress that into "always emit nine". */
  const langBtn = locales.length > 1
    ? `

  <button class="ta-icon-btn lang-trigger" type="button"
          popovertarget="taLang" aria-label="${escAttr(L.language)} / Language">
    ${icon('i-globe')}
    <span>${esc(me.label)}</span>
  </button>`
    : '';

  return `<header class="ta-topbar" id="taTopbar">
  <a class="ta-topbar-brand" href="${escAttr(H.home)}">
    ${icon('i-map-pin', 24, 'ta-mark')}
    <span>${esc(brand)}</span>
  </a>

  <span class="ta-topbar-spacer"></span>

  <nav class="ta-nav-desk" aria-label="${escAttr(L.navAria)}">
    <a href="${escAttr(H.home)}"${current(ctx.tab === 'explore')}>${esc(L.explore)}</a>
    <a href="${escAttr(H.places)}"${current(ctx.tab === 'places')}>${esc(L.places)}</a>
    <a href="${escAttr(H.trip)}"${current(ctx.tab === 'trip')}>${esc(L.trip)} <span class="ta-badge" data-count="0">0</span></a>
  </nav>

  <form class="ta-search-desk" action="${escAttr(H.search)}" method="get" role="search">
    ${icon('i-search', 20)}
    <label class="ta-sr" for="q-desk">${esc(L.search)}</label>
    <input id="q-desk" type="search" name="q" placeholder="${escAttr(L.searchPlaceholder)}">
  </form>${langBtn}
</header>`;
}

/* ===========================================================================
   7. BOTTOM TAB BAR (§4.1, PROTO-KIT §4)

   Suppressed on review pages by `html.rl-page` in shell.css, where .ta-cta
   owns the bottom edge instead. It still SHIPS in the markup there, so the
   same partial serves every page kind and desktop keeps the same active-state
   contract.
   ======================================================================== */

export function tabbar(ctx) {
  const L = labelsFor(ctx);
  const H = hrefsFor(ctx);

  return `<nav class="ta-tabbar" aria-label="${escAttr(L.tabbarAria)}">
  <a class="ta-tab" href="${escAttr(H.home)}" data-tab="explore"${current(ctx.tab === 'explore')}>
    ${icon('i-search')}
    <span>${esc(L.explore)}</span>
  </a>
  <a class="ta-tab" href="${escAttr(H.places)}" data-tab="places"${current(ctx.tab === 'places')}>
    ${icon('i-map-pin')}
    <span>${esc(L.places)}</span>
  </a>
  <a class="ta-tab" href="${escAttr(H.search)}" data-sheet="taSearch" data-tab="search"${current(ctx.tab === 'search')}>
    ${icon('i-search')}
    <span>${esc(L.search)}</span>
  </a>
  <a class="ta-tab" href="${escAttr(H.trip)}" data-tab="trip"${current(ctx.tab === 'trip')}>
    <span class="ta-tab-ic">
      ${icon('i-bookmark')}
      <b class="ta-badge" data-count="0">0</b>
    </span>
    <span>${esc(L.trip)}</span>
  </a>
  <button class="ta-tab ta-more-trigger" type="button" popovertarget="taMore" data-tab="more">
    ${icon('i-menu')}
    <span>${esc(L.more)}</span>
  </button>
</nav>`;
}

/* ===========================================================================
   8. TRIP RAIL (§4.2, desktop only)

   Layout-participating, not an overlay: body gets padding-inline-end, which is
   what structurally eliminates the collision class the old FAB was in.

   PROTO-KIT §6 also shows day tabs and a drop target. Those need the trip data
   model that Phase 4 delivers, so this emits the shipped Phase-2 shape — the
   one on /_proto/review.html and /_proto/home.html: toggle, live count, list,
   and an honest empty state. Adding the day board here before ta-store.js
   exists would render tabs that control nothing.
   ======================================================================== */

export function rail(ctx) {
  const L = labelsFor(ctx);
  const H = hrefsFor(ctx);
  const tripHref = ctx.railHref || H.trip;

  return `<aside class="ta-rail" aria-label="${escAttr(L.railAria)}">
  <button class="ta-rail-toggle" type="button" data-rail-toggle
          aria-expanded="false" aria-controls="taRailBody">
    ${icon('i-bookmark')}
    <span class="ta-badge" data-count="0">0</span>
    <span class="ta-rail-label">${esc(L.railLabel)}</span>
  </button>

  <div class="ta-rail-body" id="taRailBody">
    <p class="ta-fine" data-trip-count-label></p>
    <ul class="ta-day-list" data-rail-list></ul>
    <p class="ta-fine" data-rail-empty>${esc(L.railEmpty)}</p>
    <a class="ta-btn ta-btn-quiet" href="${escAttr(tripHref)}">${esc(L.railOpen)}</a>
  </div>
</aside>`;
}

/* ===========================================================================
   9. FOOTER

   Data-driven. A renderer that already owns translated footer copy passes
   ctx.footer and NOTHING here invents a string; otherwise the defaults come
   from ui.<lang>.json, which the repo already carries for all nine locales.

   The affiliate disclosure stays where it is. Moving it above the first CTA is
   blueprint 7d, and this stage does not touch copy.

   KNOWN, DELIBERATE: some ui.<lang>.json footer labels carry a flag emoji
   ("🇹🇭 เที่ยวไทย"), which PROTO-KIT rule 8 bans from interface chrome. Those are
   existing translated strings in nine languages; stripping the glyph here would
   be a copy edit, and copy is frozen until blueprint 7d. Logged, not "fixed".
   ======================================================================== */

function defaultFooter(ctx) {
  const u = ui(ctx.locale);
  const f = u.footer || ui('en').footer || {};
  const H = hrefsFor(ctx);
  const lp = (p) => localePath(ctx.locale, p);

  const cols = [];
  if (f.colDestinations) {
    cols.push({
      title: f.colDestinations,
      links: [
        { href: H.places, label: f.linkAllThailand },
        { href: lp('/destinations.html'), label: f.linkTravelGuide },
      ].filter((l) => l.label),
    });
  }
  if (f.colAbout) {
    cols.push({
      title: f.colAbout,
      links: [
        { href: lp('/about.html'), label: f.linkAboutUs },
        { href: lp('/editorial-policy.html'), label: f.linkEditorialPolicy },
        { href: lp('/privacy.html'), label: f.linkPrivacy },
        { href: lp('/contact.html'), label: f.linkContact },
      ].filter((l) => l.label),
    });
  }

  return {
    tagline: f.tagline,
    blurb: f.description,
    columns: cols,
    legal: f.affiliateDisclosure,
    note: f.copyright,
  };
}

export function footer(ctx) {
  const f = Object.assign(defaultFooter(ctx), ctx.footer || {});

  /* `title` is optional: a column without one renders as a bare link list,
     which is the shape /_proto/home.html uses. Emitting an empty <h2> to keep
     the markup "regular" would put a nameless heading in the outline. */
  const cols = (f.columns || [])
    .filter((c) => c && c.links && c.links.length)
    .map((c) => `    <div class="ta-foot-col">
${c.title ? `      <h2>${esc(c.title)}</h2>\n` : ''}      <ul>
${c.links.map((l) => `        <li><a href="${escAttr(l.href)}"${l.hreflang ? ` hreflang="${escAttr(l.hreflang)}"` : ''}${l.rel ? ` rel="${escAttr(l.rel)}"` : ''}>${esc(l.label)}</a></li>`).join('\n')}
      </ul>
    </div>`).join('\n');

  const parts = [];
  parts.push(`<footer class="ta-foot">`);
  parts.push(`  <div class="ta-foot-top">`);
  parts.push(`    <div class="ta-foot-brand">`);
  parts.push(`      <p class="ta-foot-tag">${esc(ctx.brand || 'Thailandaddict')}${f.tagline ? ' — ' + esc(f.tagline) : ''}</p>`);
  if (f.blurb) parts.push(`      <p class="ta-fine">${esc(f.blurb)}</p>`);
  parts.push(`    </div>`);
  if (cols) parts.push(cols);
  parts.push(`  </div>`);
  if (f.legal) parts.push(`  <p class="ta-fine ta-foot-legal">${esc(f.legal)}</p>`);
  if (f.note) parts.push(`  <p class="ta-fine">${esc(f.note)}</p>`);
  parts.push(`</footer>`);
  return parts.join('\n');
}

/* ===========================================================================
   10. SHEET HOST — More popover, language popover, search sheet, toast target
   (§4.5, §4.6, §4.8, PROTO-KIT §5)

   The popovers and dialogs go LAST in <body>: <dialog> and [popover] are
   promoted to the browser's top layer, so their DOM position is irrelevant to
   painting but very relevant to the tab order if they sit mid-document.
   ======================================================================== */

/** The locales THIS page actually exists in — never a hard-coded nine. */
function availableLocales(ctx) {
  const list = Array.isArray(ctx.locales) ? ctx.locales : [];
  return list.filter((l) => l && l.code && LOCALES.has(l.code));
}

export function langMenu(ctx) {
  const locales = availableLocales(ctx);
  if (locales.length < 2) return '';
  const rows = locales.map((l) => {
    const m = localeMeta(l.code);
    const on = l.code === ctx.locale ? ' aria-current="true"' : '';
    return `  <a href="${escAttr(l.href)}" hreflang="${escAttr(m.hreflang || m.code)}"${on}>${esc(l.label || m.label)}</a>`;
  }).join('\n');
  return `<div id="taLang" popover class="lang-menu">
${rows}
</div>`;
}

export function morePopover(ctx) {
  const L = labelsFor(ctx);
  const H = hrefsFor(ctx);
  const hasLang = availableLocales(ctx).length > 1;

  const langRow = hasLang
    ? `
  <button type="button" popovertarget="taLang">
    ${icon('i-globe', 20)}
    <span>${esc(L.language)}</span>
  </button>`
    : '';

  return `<div id="taMore" popover class="ta-more">
  <p class="ta-more-label">${esc(L.display)}</p>

  <button type="button" data-theme-set="cycle">
    ${icon('i-sun', 20)}
    <span>${esc(L.theme)}</span>
    <span class="ta-topbar-spacer"></span>
    <span data-theme-label>${esc(L.themeSystem)}</span>
  </button>${langRow}

  <hr>

  <a href="${escAttr(H.saved)}">
    ${icon('i-bookmark', 20)}
    <span>${esc(L.saved)}</span>
  </a>
  <a href="${escAttr(H.nearMe)}">
    ${icon('i-map-pin', 20)}
    <span>${esc(L.nearMe)}</span>
  </a>

  <button type="button" data-install hidden>
    ${icon('i-download', 20)}
    <span>${esc(L.install)}</span>
  </button>
</div>`;
}

export function searchSheet(ctx) {
  const L = labelsFor(ctx);
  const H = hrefsFor(ctx);
  return `<dialog class="ta-sheet" id="taSearch" aria-label="${escAttr(L.search)}">
  <div class="ta-sheet-grip" aria-hidden="true"></div>
  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title">${esc(L.search)}</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="${escAttr(L.close)}">
      ${icon('i-close')}
    </button>
  </div>
  <div class="ta-sheet-body">
    <form action="${escAttr(H.search)}" method="get" role="search">
      <label class="ta-sr" for="q-sheet">${esc(L.search)}</label>
      <input id="q-sheet" type="search" name="q" placeholder="${escAttr(L.searchPlaceholder)}">
    </form>
  </div>
</dialog>`;
}

export function sheetHost(ctx) {
  const c = ctx || { locale: DEFAULT_LOCALE };
  return [
    morePopover(c),
    langMenu(c),
    searchSheet(c),
    '<div class="ta-toast" data-shell-toast role="status" aria-live="polite" aria-atomic="true"></div>',
  ].filter(Boolean).join('\n\n');
}

/* ===========================================================================
   11. WHOLE-PARTIAL HELPERS

   The shell splits around the page's own <main>. Shell.astro emits `top`
   before its <slot/> and `bottom` after it, and gen-hubs will do the same.
   ======================================================================== */

/** Everything that belongs before the page's <main>. */
export function shellTop(ctx) {
  return [skipLink(ctx), sprite(), header(ctx)].join('\n\n');
}

/** Everything that belongs after the page's <main>.
 *
 *  The site footer sits AFTER </main>, not inside it: a <footer> inside <main>
 *  is scoped to the main content, which is not what a site footer is.
 *  /_proto/home.html puts it inside; that is the prototype being loose, and it
 *  is corrected here rather than propagated to ~18,000 pages.
 *
 *  Pass `footer:false` while a renderer still ships its own footer, so the
 *  migration can land the header and tab bar first without doubling it up. */
export function shellBottom(ctx) {
  const foot = ctx.footer === false ? '' : footer(ctx);
  return [foot, rail(ctx), tabbar(ctx), sheetHost(ctx)].filter(Boolean).join('\n\n');
}

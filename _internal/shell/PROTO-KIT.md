# PROTO-KIT — the prototype shell contract

> **Page agents MUST copy this markup verbatim. Do not invent alternative class names.**
>
> Everything below is already styled by `shell.css` and already wired by `shell.js`.
> If a component you need is not in this file, ask before inventing one — a new
> class name that only one page uses is exactly how the current five-nav /
> four-save-writer divergence happened.

Design direction: **Option A — Andaman Deck**, with Option C "Night Market" values as its dark theme.

---

## 0. The rules that override everything else

1. **Real content only.** Read the actual JSON in `astro/src/content/**` and the actual hub
   data in `_internal/province-data*/`. Use those exact names, scores, prices, image paths
   and affiliate URLs. Never invent a hotel, a price, a score, a review count or a photo.
2. **Honesty guardrail, locked.** No manufactured urgency, no scarcity ("only 1 left"),
   no countdown timers, no fake discounts, no live-viewer or booking counts, no fake
   freshness stamps. Not even as prototype filler. `_internal/lint-dark-patterns.mjs`
   runs in `build-test.sh` and will catch you.
3. **Never average scores across sources into a composite.** Show `Booking 8.9 · Agoda 8.7`
   and name the source. Checkability is the entire advantage over an OTA.
4. **Unknown is a state you render, not a state you hide.** `ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป`
   with `.ta-flag-unknown` beats a confident number you cannot stand behind.
5. **Thai typography** (blueprint §3.5): never letter-space Thai; Thai body line-height ≥ 1.75;
   every line-clamp carries `padding-block` so tone marks are not sheared. `shell.css` does all
   three for you — do not override them.
6. **Logical CSS only.** `margin-inline`, `inset-inline`, `border-inline-start`, `text-align:start`.
   `gen-shell.mjs` fails the build on any physical direction property.
7. **Every interactive control is ≥ 44 px and has a visible focus ring.** Use the shell classes
   and you get both for free.
8. **No emoji in interface chrome.** Emoji are allowed in exactly three places: the 🔖 save
   label, the 🏅 medal badge, and inside prose.
9. **Every prototype page carries `<meta name="robots" content="noindex, nofollow">`**, is not
   linked from the live site, and is excluded from `gen-sitemap.mjs` and from the speculation rules.

---

## 1. The exact `<head>` block

Copy this whole block. Swap only the `<title>`, `<meta name="description">`, `lang`/`dir`,
and the `<link rel="canonical">`.

Current hashed artifacts (regenerate with `node _internal/gen-shell.mjs`; the truth is always
`astro/src/data/shell-manifest.json`):

| artifact | path |
|---|---|
| CSS | `/css/shell.710afd97.css` |
| JS  | `/js/shell.467b869a.js` |
| `v` | `4a421174` |

A working reference page that exercises every component below lives at
`_internal/shell/smoke-test.html`. It is **not** a prototype page and must not be
copied into `_proto/` — use it to check behaviour, use this document for markup.

```html
<!doctype html>
<html lang="th" dir="ltr">
<head>
<meta charset="utf-8">

<!-- viewport-fit=cover is a HARD REQUIREMENT: without it every
     env(safe-area-inset-*) resolves to 0 and the tab bar sits under the
     home indicator. Never add maximum-scale or user-scalable=no. -->
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">

<!-- PROTOTYPE ONLY -->
<meta name="robots" content="noindex, nofollow">

<title>…</title>
<meta name="description" content="…">
<link rel="canonical" href="https://thailandaddict.com/_proto/…">

<!-- theme-color, light + dark. data-shell/data-color let TA.theme override
     them when the reader makes an explicit choice. -->
<meta name="theme-color" content="#FBFAF7" media="(prefers-color-scheme: light)" data-shell data-color="#FBFAF7">
<meta name="theme-color" content="#081113" media="(prefers-color-scheme: dark)"  data-shell data-color="#081113">

<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<link rel="manifest" href="/_proto/manifest.th.webmanifest">

<!-- THE shell. One file, one cache entry, one place to change the whole site. -->
<link rel="stylesheet" href="/css/shell.710afd97.css">

<!-- Incoming view-transition direction. MUST be a parser-blocking inline
     script in <head>: pagereveal fires before any deferred script runs, so a
     module would arrive too late and the transition would play backwards. -->
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

<!-- Speculation Rules: the highest ROI-per-line item available, and absent
     from Klook, Agoda, Booking and Traveloka.
     eagerness:"moderate" (200 ms hover / pointerdown), NEVER "immediate" —
     on an 18k-page site immediate burns a Thai traveller's mobile data.
     Chrome caps non-immediate speculation at 2 prerenders FIFO. -->
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

<script src="/js/shell.467b869a.js" defer></script>
</head>
<body>
```

**Review pages only** — set the CTA height and the review exception on `<html>`:

```html
<html lang="th" dir="ltr" class="rl-page" style="--cta-h:64px">
```

That single class suppresses the tab bar, deletes the FAB, hands the bottom edge to `.ta-cta`,
and re-bases `--floor` to the safe area. It is what restores Trip.com — currently untappable
for any reader who has saved anything.

**RTL pages** — nothing else changes, the whole shell mirrors from logical properties:

```html
<html lang="he" dir="rtl">
```

Inside RTL prose, wrap every `฿` figure and Latin brand name in `<bdi>` or `.ta-iso`
or the currency symbol and digits visibly reorder.

---

## 2. Page skeleton

```html
<a class="ta-skip" href="#main">ข้ามไปเนื้อหาหลัก</a>

<!-- icon sprite: paste ONCE per page, first thing in <body> (section 12) -->
<svg class="ta-sprite" aria-hidden="true" focusable="false"><defs> … </defs></svg>

<header class="ta-topbar" id="taTopbar"> … section 3 … </header>

<main class="ta-main" id="main">
  <div class="ta-wrap">
    …page content…
  </div>
</main>

<aside class="ta-rail" aria-label="ทริปของคุณ"> … section 6 … </aside>
<nav class="ta-tabbar" aria-label="หลัก"> … section 4 … </nav>

<div id="taMore" popover class="ta-more"> … section 5 … </div>
<div id="taLang" popover class="lang-menu"> … section 5 … </div>

<dialog class="ta-sheet" id="taFilter"> … section 9 … </dialog>
```

Order matters: the sprite before anything that `<use>`s it, the popovers and dialogs last.

---

## 3. Topbar + desktop nav

```html
<header class="ta-topbar" id="taTopbar">
  <a class="ta-topbar-brand" href="/">
    <svg class="ta-ic ta-mark" aria-hidden="true"><use href="#i-map-pin"></use></svg>
    <span>Thailandaddict</span>
  </a>

  <span class="ta-topbar-spacer"></span>

  <!-- Desktop only. Same five destinations as the tab bar, one active-state contract. -->
  <nav class="ta-nav-desk" aria-label="เมนูหลัก">
    <a href="/" aria-current="page">สำรวจ</a>
    <a href="/country-thailand.html">จุดหมาย</a>
    <a href="/trip">ทริป <span class="ta-badge" data-count="0">0</span></a>
  </nav>

  <!-- Always a real GET form: Enter works, and it works with JS off. -->
  <form class="ta-search-desk" action="/search" method="get" role="search">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-search"></use></svg>
    <label class="ta-sr" for="q-desk">ค้นหา</label>
    <input id="q-desk" type="search" name="q" placeholder="ที่พัก ร้านอาหาร จุดหมาย">
  </form>

  <button class="ta-icon-btn lang-trigger" type="button"
          popovertarget="taLang" aria-label="ภาษา / Language">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-globe"></use></svg>
    <span>ไทย</span>
  </button>
</header>
```

The bar condenses on scroll. Chromium uses a scroll-driven animation; Firefox gets the
`IntersectionObserver` fallback that `shell.js` installs automatically — you do not need to
add anything. If your page has a full-bleed hero that the bar should float over,
put `class="ta-bleed"` on `<body>`.

---

## 4. Bottom tab bar (mobile, < 1024 px)

**Copy exactly.** Six decisions are baked in here and none of them are cosmetic.

```html
<nav class="ta-tabbar" aria-label="หลัก">
  <a class="ta-tab" href="/" data-tab="explore" aria-current="page">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-search"></use></svg>
    <span>สำรวจ</span>
  </a>
  <a class="ta-tab" href="/country-thailand.html" data-tab="places">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-map-pin"></use></svg>
    <span>จุดหมาย</span>
  </a>
  <a class="ta-tab" href="/search" data-sheet="taSearch" data-tab="search">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-search"></use></svg>
    <span>ค้นหา</span>
  </a>
  <a class="ta-tab" href="/trip" data-tab="trip">
    <span class="ta-tab-ic">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-bookmark"></use></svg>
      <b class="ta-badge" data-count="0">0</b>
    </span>
    <span>ทริป</span>
  </a>
  <button class="ta-tab" type="button" popovertarget="taMore" data-tab="more">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-menu"></use></svg>
    <span>เมนู</span>
  </button>
</nav>
```

- **Every destination is a real `<a href>`.** `div[tabindex="0"]` removes them from the crawl
  graph, breaks middle-click and screen readers, and defeats Speculation Rules entirely.
- **Search is an anchor that JS upgrades into a sheet.** No JS → it navigates to real `/search`.
- **More is `<button popovertarget>`** — top layer, light dismiss and Esc for free, zero JS.
  It is an action, not a destination.
- **The Trip badge is always present, showing `0`.** The affordance must exist before the
  first save, not after it.
- **No language switcher in the bar.** It lives in More, so one component serves all 9 locales.
- **`aria-current="page"` is set at build time**, by you, in the markup. `shell.js` only fills
  it in when a page shipped without one; it never overrides what you wrote.

---

## 5. More popover + language popover

```html
<div id="taMore" popover class="ta-more">
  <p class="ta-more-label">การแสดงผล</p>

  <button type="button" data-theme-set="cycle">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-sun"></use></svg>
    <span>ธีม</span>
    <span class="ta-topbar-spacer"></span>
    <span data-theme-label>ตามระบบ</span>
  </button>

  <button type="button" popovertarget="taLang">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-globe"></use></svg>
    <span>ภาษา</span>
  </button>

  <hr>

  <a href="/saved">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-bookmark"></use></svg>
    <span>ที่บันทึกไว้</span>
  </a>
  <a href="/near-me.html">
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-map-pin"></use></svg>
    <span>ใกล้ฉัน</span>
  </a>

  <!-- ONE quiet row. Never an interstitial: a full-viewport app modal is a
       Google intrusive-interstitial penalty for an organic-acquisition site.
       shell.js unhides this only when beforeinstallprompt actually fires. -->
  <button type="button" data-install hidden>
    <svg class="ta-ic ta-ic-20" aria-hidden="true"><use href="#i-download"></use></svg>
    <span>ติดตั้งเป็นแอป</span>
  </button>
</div>
```

Language: **names, never flags.** The flag bar was the direct cause of the mobile overflow —
nine 30 px links under the 44 px floor, degrading to bare letters where regional-indicator
glyphs are unsupported. Emit only the locales that actually exist for this page.

```html
<div id="taLang" popover class="lang-menu">
  <a href="/city-krabi.html"    hreflang="th" aria-current="true">ไทย</a>
  <a href="/en/city-krabi.html" hreflang="en">English</a>
  <a href="/zh/city-krabi.html" hreflang="zh">中文</a>
  <a href="/ru/city-krabi.html" hreflang="ru">Русский</a>
  <a href="/ko/city-krabi.html" hreflang="ko">한국어</a>
  <a href="/ja/city-krabi.html" hreflang="ja">日本語</a>
  <a href="/he/city-krabi.html" hreflang="he">עברית</a>
  <a href="/ar/city-krabi.html" hreflang="ar">العربية</a>
  <a href="/hi/city-krabi.html" hreflang="hi">हिन्दी</a>
</div>
```

Anchor positioning is used where supported (`position-area: block-end span-inline-start`,
which mirrors for he/ar for free) and falls back to a fixed position under the topbar
everywhere else. Both paths are already in `shell.css`.

---

## 6. Trip Rail (desktop ≥ 1024 px)

Layout-participating, not an overlay — that is what structurally eliminates the collision
class the old FAB was in.

```html
<aside class="ta-rail" aria-label="ทริปของคุณ">
  <button class="ta-rail-toggle" type="button" data-rail-toggle
          aria-expanded="false" aria-controls="taRailBody">
    <svg class="ta-ic" aria-hidden="true"><use href="#i-bookmark"></use></svg>
    <span class="ta-badge" data-count="0">0</span>
    <span class="ta-rail-label">ทริปของคุณ</span>
  </button>

  <div class="ta-rail-body" id="taRailBody">
    <p class="ta-fine" data-trip-count-label>ในทริปของคุณ 0 รายการ</p>

    <div class="ta-tablist" role="tablist" aria-label="วัน">
      <a role="tab" href="#day-1" id="rt-1" aria-controls="day-1" aria-selected="true">วันที่ 1</a>
      <a role="tab" href="#day-2" id="rt-2" aria-controls="day-2" aria-selected="false">วันที่ 2</a>
      <a role="tab" href="#saved" id="rt-s" aria-controls="saved" aria-selected="false">บันทึกไว้</a>
    </div>

    <ul class="ta-day-list"> …POI rows, section 15… </ul>

    <div class="ta-rail-drop">ลากการ์ดมาวางที่นี่ เพื่อเพิ่มเข้าวันที่เลือก</div>
  </div>
</aside>
```

Forced open on `/trip` and `/saved`; otherwise the open/closed preference lives in
`localStorage['ta.rail']` and `shell.js` restores it.

---

## 7. Content card

```html
<article class="ta-card">
  <a class="ta-media ta-r-3-2" href="/review-rayavadee-krabi" data-vt-hero>
    <picture>
      <source type="image/avif" srcset="…-400.avif 400w, …-800.avif 800w, …-1200.avif 1200w"
              sizes="(max-width:700px) 50vw, 360px">
      <img src="…-800.webp" srcset="…-400.webp 400w, …-800.webp 800w, …-1200.webp 1200w"
           sizes="(max-width:700px) 50vw, 360px"
           alt="Rayavadee ไร่เลย์ กระบี่" width="800" height="533"
           loading="lazy" decoding="async">
    </picture>
  </a>

  <div class="ta-card-body">
    <span class="eyebrow">ไร่เลย์ · กระบี่</span>
    <h3 class="ta-card-title"><a class="ta-clamp-2" href="/review-rayavadee-krabi">Rayavadee</a></h3>

    <p class="ta-card-meta">
      <span class="ta-score"><b>9.4</b> <span class="ta-score-src">Booking · 1,204 รีวิว</span></span>
      <span class="ta-chip">จาก <span class="ta-num">฿13,900</span> / คืน</span>
    </p>

    <div class="ta-card-foot">
      <a class="ta-btn ta-btn-quiet" href="/review-rayavadee-krabi">อ่านรีวิวเต็ม</a>
      <!-- save button: section 8 -->
    </div>
  </div>
</article>
```

Grid wrapper: `<div class="ta-grid"> … </div>`.

- Four image ratios only: `.ta-r-3-2` cards · `.ta-r-16-9` wide hero · `.ta-r-4-5` mobile hero ·
  `.ta-r-1-1` avatars. Always `aspect-ratio` + `width`/`height` + `object-fit:cover`.
- **Never** add `onerror="this.style.opacity=0"`. `shell.js` has a delegated error listener that
  renders a named `--sand-200` placeholder instead of an invisible hole.
- Hover scales the `<img>` inside the `overflow:hidden` wrapper, never the card. 1.04 ceiling.
- The title anchor's `::after` makes the whole card clickable; anything else interactive inside
  the card must stay in `.ta-card-foot` (already `position:relative; z-index:1`).
- Scrim over an image: add `.ta-scrim` to `.ta-media` and put the text in `.ta-scrim-body`.

---

## 8. Save button — 🔖 with a WORD, never a bare icon

```html
<button class="ta-save" type="button" aria-pressed="false"
        data-save
        data-id="s:rayavadee-krabi"
        data-poi-id="s:rayavadee-krabi"
        data-kind="stay"
        data-name="Rayavadee"
        data-url="/review-rayavadee-krabi"
        data-img="images/hotels/krabi-rayavadee-1.jpg"
        data-province="krabi"
        data-lat="8.0104" data-lng="98.8375"
        data-score="9.4"
        data-price-from="13900"
        data-trip-href="/trip">
  <span aria-hidden="true">🔖</span>
  <span class="ta-save-off">เพิ่มเข้าทริป</span>
  <span class="ta-save-on">บันทึกแล้ว</span>
</button>
```

`aria-pressed` flips optimistically, the badge increments, and a toast naming the item + the
running count + a link to `/trip` appears with `aria-live="polite"`. All of that is `shell.js`;
you write only the markup. Put a save button on **every** review, roundup entry, restaurant
block **and hub card**.

**Split add-to-day control** (review pages, §5.3 item 5) — primary tap is the zero-decision
path, the chevron opens the day picker:

```html
<div class="ta-split">
  <button class="ta-btn ta-btn-primary" type="button"
          data-add-day="inbox" data-poi-id="s:rayavadee-krabi" data-name="Rayavadee">
    🔖 เพิ่มเข้าทริป
  </button>
  <button class="ta-btn ta-btn-primary" type="button"
          data-sheet="taDayPicker" aria-label="เลือกวันที่">
    <svg class="ta-ic ta-ic-20 i-chevron" aria-hidden="true"><use href="#i-chevron"></use></svg>
  </button>
</div>
```

---

## 9. Filter chip, ARIA tab set, bottom sheet

**Filter chip.** Zero-count options are **disabled and greyed, never hidden**.

```html
<ul class="ta-chip-row">
  <li><button class="ta-fac" type="button" aria-pressed="true">ไร่เลย์ <span class="ta-fac-count">12</span></button></li>
  <li><button class="ta-fac" type="button" aria-pressed="false">อ่าวนาง <span class="ta-fac-count">28</span></button></li>
  <li><button class="ta-fac" type="button" aria-pressed="false" disabled>เกาะปอดะ <span class="ta-fac-count">0</span></button></li>
</ul>
```

**ARIA tab set.** All panels stay in the DOM (`hidden`, never JS-fetched): content not in the
initial HTML is invisible to AI crawlers and effectively does not exist.

```html
<div class="ta-tablist" role="tablist" aria-label="หมวด">
  <a role="tab" href="#p-stay" id="tab-stay" aria-controls="p-stay" aria-selected="true">ที่พัก</a>
  <a role="tab" href="#p-eat"  id="tab-eat"  aria-controls="p-eat"  aria-selected="false">ที่กิน</a>
  <a role="tab" href="#p-see"  id="tab-see"  aria-controls="p-see"  aria-selected="false">ที่เที่ยว</a>
</div>

<section role="tabpanel" id="p-stay" aria-labelledby="tab-stay" tabindex="0"> … </section>
<section role="tabpanel" id="p-eat"  aria-labelledby="tab-eat"  tabindex="0" hidden> … </section>
<section role="tabpanel" id="p-see"  aria-labelledby="tab-see"  tabindex="0" hidden> … </section>
```

Real `<a href="#panel">` anchors, hash-synced, so a tab is deep-linkable and back-restorable.

**Bottom sheet.** `<dialog>` gives top layer, `::backdrop`, focus trap and Esc for free.
`sheet.js` adds the close-request chain so the Android back gesture closes the sheet instead
of navigating away.

```html
<dialog class="ta-sheet" id="taFilter" aria-labelledby="taFilterTitle">
  <div class="ta-sheet-grip" aria-hidden="true"></div>

  <div class="ta-sheet-head">
    <h2 class="ta-sheet-title" id="taFilterTitle">ตัวกรอง</h2>
    <button class="ta-icon-btn" type="button" data-sheet-close aria-label="ปิด">
      <svg class="ta-ic" aria-hidden="true"><use href="#i-close"></use></svg>
    </button>
  </div>

  <div class="ta-sheet-body"> …filter chips… </div>

  <div class="ta-sheet-foot">
    <button class="ta-btn ta-btn-ghost" type="button" data-sheet-close>ล้างทั้งหมด</button>
    <!-- The apply button ALWAYS carries the live count. -->
    <button class="ta-btn ta-btn-primary" type="button" data-sheet-close>แสดง 41 ที่พัก</button>
  </div>
</dialog>
```

Open it from anything: `data-sheet="taFilter"`. On an `<a>`, JS upgrades it and `preventDefault`s;
with JS off, the anchor still navigates to the real page. Add `data-no-light-dismiss` to a dialog
that must not close on a backdrop click.

---

## 10. Sticky CTA bar, toast target

The CTA owns the bottom edge on review pages. Name the real OTA — `เช็กราคาบน Agoda →`,
never "Book now". Gate the whole bar on the stay actually having a bookable OTA link, so a
Facebook-only rural stay never shows a fake booking bar.

```html
<div class="ta-cta" data-autohide>
  <div class="ta-cta-text">
    <div class="ta-cta-name ta-clamp-1">Rayavadee</div>
    <div class="ta-cta-price">จาก <span class="ta-num">฿13,900</span> / คืน · ตรวจสอบ ก.ค. 2026</div>
  </div>

  <button class="ta-save ta-icon-btn" type="button" aria-pressed="false"
          data-save data-id="s:rayavadee-krabi" data-name="Rayavadee">
    <span aria-hidden="true">🔖</span>
    <span class="ta-save-off">บันทึก</span>
    <span class="ta-save-on">บันทึกแล้ว</span>
  </button>

  <a class="ta-btn ta-btn-primary ota no-prerender"
     href="https://www.agoda.com/…?cid=1965862"
     rel="sponsored noopener nofollow" target="_blank">เช็กราคาบน Agoda</a>
</div>
```

Booking.com links go through the worker: `href="/go/b?u=<encoded booking url>&sid=<slug>"`.
Affiliate IDs live in `astro/src/lib/affiliate.ts` and `worker.js` — never hard-code a new one.

**Toast target:** you do not need one. `TA.toast()` creates
`<div class="ta-toast" role="status" aria-live="polite">` on first use and reuses it. If you want
it in the source for a static screenshot, use exactly:

```html
<div class="ta-toast" data-shell-toast role="status" aria-live="polite" aria-atomic="true"></div>
```

---

## 11. At-a-glance `<dl>`, comparison table, day board, POI row, map

**At-a-glance.** Fields with no verified value are **omitted, never rendered as "–"**.
Give it `id="at-a-glance"` — it is the cleanest retrieval chunk on the page.

```html
<dl class="ta-glance" id="at-a-glance">
  <dt>ประเภท</dt>       <dd>รีสอร์ตริมหาด</dd>
  <dt>เช็คอิน</dt>      <dd>14:00 · เช็คเอาต์ 12:00</dd>
  <dt>ห้องพัก</dt>      <dd>103 ห้อง</dd>
  <dt>อาหารเช้า</dt>    <dd>รวมในราคา</dd>
  <dt>สระว่ายน้ำ</dt>   <dd>2 สระ</dd>
</dl>
```

**Comparison table.** Real `<table>` with `<caption>` and `<th scope>` — the block most likely
to be lifted whole into an AI answer. Every price cell carries its check date.

```html
<div class="ta-compare-wrap">
  <table class="ta-compare">
    <caption>เปรียบเทียบ 10 ที่พักอ่าวนาง · ราคาตรวจสอบ ก.ค. 2026</caption>
    <thead>
      <tr>
        <th scope="col">อันดับ</th>
        <th scope="col">ที่พัก</th>
        <th scope="col">เหมาะกับ</th>
        <th scope="col">จาก ฿</th>
        <th scope="col">คะแนน</th>
        <th scope="col">โซน</th>
        <th scope="col">จอง</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><span class="ta-rank ta-rank-1">1</span></td>
        <th scope="row"><a href="/review-rayavadee-krabi">Rayavadee</a></th>
        <td><span class="ta-chip ta-chip-award">หรูที่สุด</span></td>
        <td><span class="ta-num">฿13,900</span><span class="ta-checked">ตรวจสอบ ก.ค. 2026</span></td>
        <td><span class="ta-num">9.4</span> <span class="ta-score-src">Booking</span></td>
        <td>ไร่เลย์</td>
        <td><a class="ta-btn ta-btn-primary no-prerender" rel="sponsored noopener nofollow"
               href="https://www.agoda.com/…?cid=1965862">เช็กราคา</a></td>
      </tr>
    </tbody>
  </table>
</div>
```

**Day-board column.** Legs between items are **derived at render and never stored** —
call `TA.trip.legs(dayId)`. Always label the method.

```html
<section class="ta-day" id="day-1">
  <header class="ta-day-head">
    <h3 class="ta-day-title">วันที่ 1</h3>
    <span class="ta-chip">ไร่เลย์</span>
    <p class="ta-day-roll">5 จุด · 41 กม. · เดินทางรวม ~2 ชม. · ประมาณ ฿4,200</p>
    <p class="ta-flag ta-flag-unknown">ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป</p>
  </header>

  <ul class="ta-day-list">
    <li> …POI row… </li>
    <li class="ta-leg">
      <span>~12 นาที · 1.4 กม. · เดิน</span>
      <span class="ta-leg-method">ประมาณ (เส้นตรง)</span>
    </li>
    <li> …POI row… </li>
  </ul>

  <button class="ta-day-add" type="button" data-sheet="taAddPoi">＋ เพิ่มที่นี่</button>
</section>
```

**POI row.**

```html
<div class="ta-poi" data-in-trip>
  <span class="ta-poi-thumb"><img src="…" alt="" width="56" height="56" loading="lazy"></span>
  <span class="ta-poi-main">
    <span class="ta-poi-name ta-clamp-1">หาดพระนาง</span>
    <span class="ta-poi-sub ta-clamp-1">ชายหาด · 90 นาที</span>
  </span>
  <button class="ta-poi-menu" type="button" data-sheet="taItemMenu"
          data-item="i1" aria-label="ตัวเลือกสำหรับ หาดพระนาง">⋮</button>
</div>
```

The `⋮` sheet ships **Move-to before drag** (WCAG 2.5.7): drag-only reordering excludes
speech-control, switch and low-dexterity users outright, and on a narrow phone a menu is
genuinely faster than dragging across a 7-day board.

```html
<button class="ta-btn ta-btn-ghost" type="button" data-move="up"     data-item="i1">เลื่อนขึ้น</button>
<button class="ta-btn ta-btn-ghost" type="button" data-move="down"   data-item="i1">เลื่อนลง</button>
<button class="ta-btn ta-btn-ghost" type="button" data-move="day"    data-item="i1" data-to-day="d2">ย้ายไปวันที่ 2</button>
<button class="ta-btn ta-btn-ghost" type="button" data-move="remove" data-item="i1">เอาออก</button>
```

**Map placeholder.** Render a map only when the cluster is actually geocoded — a map with
40 % missing pins is worse than no map.

```html
<div class="ta-map">
  <p class="ta-map-note">แผนที่จะแสดงเมื่อมีพิกัดครบ — ตอนนี้ดูที่อยู่และย่านแทน</p>
</div>
```

**Skeleton:** `<div class="ta-skel ta-skel-text"></div>`, or `<div class="ta-skel ta-r-3-2"></div>`.

---

## 12. The icon sprite

Owned monoline set: **1.5 px stroke at 24 px, round caps and joins, `stroke:currentColor`,
`fill:none`**, sizes 16/20/24 only. Paste this block **once** per page, as the first element in
`<body>`. Use with `<svg class="ta-ic" aria-hidden="true"><use href="#i-search"></use></svg>`
and add `.ta-ic-20` or `.ta-ic-16` for the smaller sizes.

Only `.i-chevron` and `.i-arrow` mirror under `dir="rtl"` — put that class on the `<svg>`.

```html
<svg class="ta-sprite" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg">
<defs>
<g id="ta-i" fill="none" stroke="currentColor" stroke-width="1.5"
   stroke-linecap="round" stroke-linejoin="round"></g>
</defs>

<symbol id="i-search" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="10.75" cy="10.75" r="6.75"/><path d="M15.6 15.6 20.5 20.5"/>
</symbol>

<symbol id="i-bookmark" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M6.25 4.5h11.5a.75.75 0 0 1 .75.75v14.4l-6.5-4.1-6.5 4.1V5.25a.75.75 0 0 1 .75-.75Z"/>
</symbol>

<symbol id="i-map-pin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 21c4.2-4.2 6.5-7.4 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 13.6 7.8 16.8 12 21Z"/>
  <circle cx="12" cy="10.3" r="2.4"/>
</symbol>

<symbol id="i-calendar" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/>
  <path d="M8 3v4M16 3v4M3.5 10h17"/>
</symbol>

<symbol id="i-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m9.25 5 7 7-7 7"/>
</symbol>

<symbol id="i-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 12h15.5M13.5 6l6 6-6 6"/>
</symbol>

<symbol id="i-globe" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17"/>
  <path d="M12 3.5c2.3 2.4 3.5 5.3 3.5 8.5s-1.2 6.1-3.5 8.5c-2.3-2.4-3.5-5.3-3.5-8.5S9.7 5.9 12 3.5Z"/>
</symbol>

<symbol id="i-menu" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 7h16M4 12h16M4 17h16"/>
</symbol>

<symbol id="i-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m6 6 12 12M18 6 6 18"/>
</symbol>

<symbol id="i-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 4.75v14.5M4.75 12h14.5"/>
</symbol>

<symbol id="i-check" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m4.75 12.5 4.75 4.75L19.25 6.75"/>
</symbol>

<symbol id="i-star" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="m12 3.75 2.62 5.31 5.86.85-4.24 4.13 1 5.84L12 17.13l-5.24 2.75 1-5.84-4.24-4.13 5.86-.85Z"/>
</symbol>

<symbol id="i-clock" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="8.5"/><path d="M12 7.25V12l3.25 2"/>
</symbol>

<symbol id="i-filter" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M4 7h16M7 12h10M10 17h4"/>
</symbol>

<symbol id="i-share" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="17.5" cy="6" r="2.75"/><circle cx="6.5" cy="12" r="2.75"/><circle cx="17.5" cy="18" r="2.75"/>
  <path d="m9 10.7 6-3.4M9 13.3l6 3.4"/>
</symbol>

<symbol id="i-download" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 3.75v11M7.75 10.5 12 14.75l4.25-4.25M4.5 19.5h15"/>
</symbol>

<symbol id="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <circle cx="12" cy="12" r="4"/>
  <path d="M12 2.5v2.2M12 19.3v2.2M4.28 4.28l1.56 1.56M18.16 18.16l1.56 1.56M2.5 12h2.2M19.3 12h2.2M4.28 19.72l1.56-1.56M18.16 5.84l1.56-1.56"/>
</symbol>

<symbol id="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 14.4A8.5 8.5 0 0 1 9.6 4a8.5 8.5 0 1 0 10.4 10.4Z"/>
</symbol>
</svg>
```

---

## 13. Everything `shell.js` listens for

One document-level listener, delegated. **No inline `onclick` anywhere, ever** — that is what
fixes INP and what moves the site toward a strict `script-src` CSP (the audit found 7,299 inline
handlers blocking it).

| attribute | on | what it does |
|---|---|---|
| `data-save` | button | toggles the save, flips `aria-pressed`, updates the badge, fires the toast |
| `data-id` / `data-poi-id` | with `data-save` | the stable id. `{s:\|a:\|e:\|m:}<slug>` |
| `data-kind` `data-name` `data-url` `data-img` `data-province` `data-score` `data-price-from` `data-lat` `data-lng` | with `data-save` | the saved record's fields |
| `data-trip-href` | with `data-save` / `data-add-day` | where the toast's link points (default `/trip`) |
| `data-sheet="<id>"` | a / button | opens that `<dialog>`; on an `<a>` it upgrades, so no-JS still navigates |
| `data-sheet-close` | button | closes the enclosing dialog |
| `data-no-light-dismiss` | dialog | disables backdrop-click close |
| `data-add-day="<dayId>"` | button | adds the POI to that day |
| `data-add-day="inbox"` | button | saves to the trip inbox without scheduling |
| `data-dur` `data-source` `data-list` | with `data-add-day` | duration in minutes, provenance, target list |
| `data-move="up\|down"` + `data-item` | button | reorder inside the day |
| `data-move="day"` + `data-item` + `data-to-day` + `data-to-index` | button | move across days |
| `data-move="remove"` + `data-item` | button | returns the item to saves — it never deletes |
| `data-palette="a\|b\|c"` inside `[data-palette-group]` | button | live palette switch (launcher page only) |
| `data-theme-set="light\|dark\|system\|cycle"` | button | theme; `[data-theme-label]` inside it gets the state word |
| `data-rail-toggle` | button | expands/collapses the Trip Rail, persists the preference |
| `data-install` | button, `hidden` | unhidden only when `beforeinstallprompt` actually fires |
| `data-vt-hero` | a | names that card's `<img>` for the hero view-transition handoff |
| `data-autohide` | `.ta-cta` | hide on scroll-down, reveal on scroll-up, always visible past 60 % |
| `.ta-badge`, `[data-trip-count]` | any | receives the running count and a `data-count` attribute |
| `[data-trip-count-label]` | any | receives the full sentence, e.g. `ในทริปของคุณ 6 รายการ` |
| `.ta-topbar` | header | condensing bar; the IO fallback is installed automatically |

### `window.TA`

```js
TA.saves.list() / has(id) / get(id) / add(item) / remove(id) / toggle(item) / count() / clear() / on(fn)
TA.save(poiId, opts) · TA.unsave(poiId) · TA.has(poiId)

TA.trip.get() / count() / hasPoi(poiId)
TA.trip.addDay(label, zone) / removeDay(dayId)
TA.trip.addToDay(poiId, dayId, opts) / addToList(poiId, listId, note)
TA.trip.move(itemId, dayId, index) / reorder(dayId, from, to) / nudge(itemId, 'up'|'down')
TA.trip.remove(itemId)        // returns the item to saves — never deletes
TA.trip.drop(poiId)           // hard delete, explicit user action only
TA.trip.legs(dayId)           // DERIVED at render, never stored
TA.trip.export() / import(json) / reset() / on(fn)

TA.poi.put(item) / putAll(list) / get(id) / all()
TA.theme.get() / resolved() / set(v) / cycle() / apply()
TA.toast(msg, { ms, href, linkText })
TA.nav.syncBadge() / syncSaves(root) / syncCurrent()
TA.sheet.open(dlg, opener, { modal }) / close(dlg) / toggle(dlg) / current() / isOpen(dlg)
TA.segmentThai(str) -> string[]        // Thai word segmentation
TA.segmentQuery(str) -> string          // segmented OR raw, for search
TA.on(event, fn)   // 'change' | 'saves' | 'trip' | 'theme' | 'palette' | 'render' | 'installable' | 'storage-error'
```

Storage keys: `ta.saves.v3` · `ta.trip.v1` · `ta.theme` · `ta.rail`.
`shell.js` is the **only** writer. Every write is wrapped in try/catch with an honest inline
message on the private-browsing quota failure, and every write is deferred while
`document.prerendering` is true, or the Trip badge double-counts on activation.

Seed the POI cache from your page's real content JSON so names, images and legs resolve:

```js
TA.poi.putAll([
  { id:'s:rayavadee-krabi', name:'Rayavadee', url:'/review-rayavadee-krabi',
    img:'images/hotels/krabi-rayavadee-1.jpg', kind:'stay', province:'krabi',
    lat:8.0104, lng:98.8375 }
]);
```

If a POI has no coordinates, `TA.trip.legs()` returns `{ method:'unknown' }` and you must
render `ยังไม่ทราบระยะทาง` — not a guessed number.

---

## 14. Palette comparison (launcher page only)

`tokens.css` carries dormant Option B and Option C blocks behind `:root[data-palette="b"|"c"]`.
Option A is the default and has no attribute. Use this on `/_proto/index.html` so the owner
decides by looking:

```html
<div class="ta-chip-row" data-palette-group role="group" aria-label="ชุดสี">
  <button class="ta-fac" type="button" data-palette="a" aria-pressed="true">A · Andaman Deck</button>
  <button class="ta-fac" type="button" data-palette="b" aria-pressed="false">B · Monsoon Ink</button>
  <button class="ta-fac" type="button" data-palette="c" aria-pressed="false">C · Night Market</button>
</div>
```

Do **not** put this control on any content prototype page. It is a decision aid, and the whole
section gets deleted from `tokens.css` before the Phase 2 rollout.

---

## 15. Before you hand a page back

- [ ] `<meta name="robots" content="noindex, nofollow">` present.
- [ ] Not linked from any live page; not added to `gen-sitemap.mjs`.
- [ ] At 375 px: `document.documentElement.scrollWidth === innerWidth`, and every nav control's
      `getBoundingClientRect().right <= 375`.
- [ ] `[...document.querySelectorAll('a,button,input,summary,[role=button]')]
      .filter(e => { const r = e.getBoundingClientRect(); return r.width && r.height < 44; })`
      returns `[]`.
- [ ] `ก๊วยเตี๋ยว เพื่อ ปิ๊ ญ์` renders unclipped inside every line-clamp.
- [ ] `dir="rtl"` mirrors, including prose.
- [ ] With the OS reduced-motion flag set, nothing animates and no scroll timeline runs.
- [ ] Zero physical CSS properties in any page-level `<style>`; zero inline `on*` handlers.
- [ ] Every price, score and photo traced back to a real file in `astro/src/content/**` or
      `_internal/province-data*/`.
- [ ] Nothing on the page manufactures urgency, scarcity, a countdown, a discount, a viewer
      count or a freshness date that is not real.

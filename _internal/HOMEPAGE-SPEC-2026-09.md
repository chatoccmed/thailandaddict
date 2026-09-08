I have verified every load-bearing claim. Writing the decision and merged spec.

# JUDGMENT

I fact-checked all three against the repo before scoring. Scores out of 10.

| | ①"answer in place" | ②"homepage IS the board" | ③"two-tap starter + deck" |
|---|---|---|---|
| 1. First-timer wants it | 8 | **5** | 8 |
| 2. Survives as SEO landing | 9 | 7 | **10** |
| 3. Moves to bookings, no dark pattern | 7 | **8** | 6 |
| 4. Static + localStorage, no server | **6** | 7 | **9** |
| 5. Beautiful / app-like | 7 | **9** | 7 |

**Decisive facts I verified (they overturn parts of all three):**

- **The current homepage has `h1:1, h2:0, h3:0`, 105 anchors, and all 77 provinces live inside `PROV=[…]` in JavaScript — zero crawlable province links.** Concept ③ is right and this reframes the brief: a server-rendered planner homepage is a large SEO *upgrade*. There is no content-vs-app tension to split the difference on.
- **70 destinations have a complete 1-day + 2d1n + 3d2n itinerary set; 77 have a 3d2n.** Concept ①'s "the plan already exists as an article" is real. Verified `krabi-3d2n-itinerary.json` block shape: `{kind:'day', label, title, items:[{time, activity, note}]}` — its quoted rows are verbatim correct.
- **`astro/public/data/home-index.json` is literally `generatedFor: "homepage rails"`** — 109 keys, `see` = structured POIs with real photos + ratings, but **`stay` = roundup links and `eat` = article links, not item lists.** All three concepts misread this. Individual hotels must come from `roundups/top10-hotels-<prov>.json`.
- **64 destinations have BOTH a plan and full see/stay/eat inventory** (59 direct + 5 slug aliases: `korat→nakhon-ratchasima`, `ubon→`, `udon→`, `nakhon→`, `prachuap→`). No concept caught the aliases.
- **Restaurants: 1,100 blocks, 20 with a real `img` (1.8 %), 299 on `_lib/` stock** — but 99.8 % have hours, 99.2 % geo, 89 % ratings. ③'s typographic eat tiles are correct, now with a number. Attractions: 669/1,090 with images, **0 stock**.
- **`ratingSrc` is per-row and varies (Wongnai 633 / Google 346).** `วัดถ้ำเสือ` is **Wongnai 4.3 · 42**, not Google. Rayavadee is **Agoda 9.4 · 599 · ฿16,000**, not Booking. ② got both wrong; ③ got both right.
- **The storage key is `ta.trip.v1`** (`ta.trip.v3` is read-tolerant legacy). All three said v3. Page code must never touch the key.
- **`TA.trip` has `addDay/addToDay/reset/import/legs/hasPoi` — there is no `materialise()`.** The one-tap board must be composed from these primitives.
- **`_proto/trip.html` reads no URL params.** ②'s and ③'s `GET /trip?p=&d=` handoff is broken today; ③ admitted it.
- `images/_cards/` = 66 files, 1.8 MB, **not** in `.assetsignore` (so bundled). All 14 activity-guide slugs exist. `_internal/homepage-i18n/build.mjs` = **127 anchors**, confirmed. `/saved` and `/how-we-rank` **do not exist** — ③ linked both.

**Decision.** Build **③'s skeleton** (planner box → deck of real places → crawlable regions; pure static), carrying **①'s retrieval substrate** (the answer is a real published itinerary; the plan deck is built from real `day` blocks; the destination sheet is *cloned from* the crawlable region DOM rather than authored twice), and **②'s board fidelity** (kit `.ta-day`/`.ta-poi`/`.ta-leg` so the deck and `/trip` are visibly one object), **②'s single best insight — browsing never writes storage** — and **②'s "กำลังเพิ่มเข้า: วันที่ N"** strip.

Rejected outright: ①'s `/go/plan` Worker route (violates "no server"; replaced by a build-time slug map inlined in the page + static per-destination JSON), and ②'s seeded stranger's-trip fold (a Krabi board is confidently irrelevant to a Chiang Mai searcher).

---

# MERGED SPECIFICATION — planner-first homepage

Target file `astro/public/_proto/home.html` (replaces the Explore prototype). `<meta name="robots" content="noindex,nofollow">`, kit `<head>` block verbatim, sprite first in `<body>`.

## 1. Module order

**Mobile (< 1024 px). Source order = visual order. Budget ≤ 4,200 px; estimate ≈ 3,850 px.**

| # | module | notes |
|---|---|---|
| 1 | `.ta-topbar` | brand · spacer · `ไทย` globe. 56 px, condenses on scroll |
| 2 | `<h1>` + lead `<p>` | LCP is text. **No hero image on this page** |
| 3 | **`.ta-planslot`** | reserved `min-block-size:290px`. Planner form **or** resume card — same box, zero CLS |
| 4 | **`.ta-planchips`** | 6 real published plans, one tap each. Scroll rail |
| 5 | **`.ta-deck`** | h2 + 6-province tablist + 3 shelves per panel. **All 6 panels in the DOM, 5 `hidden`** |
| 6 | `.ta-plandock` | 0 px until the first save; then inline (not floating) |
| 7 | `.ta-pills` | 14 activity guides |
| 8 | `.ta-answer` | h2 + ~70 words, `SpeakableSpecification` target |
| 9 | `.ta-guides` | 8 itinerary cards, each with `ใช้แผนนี้` |
| 10 | `.ta-regions` | 6 `<details>`, **89 destination links**, region intros |
| 11 | `.ta-stats` | static numbers, **no count-up** |
| 12 | `.ta-editor` | Doctor Chat from `astro/src/data/editorial.json` |
| 13 | newsletter | inline, existing `/api/email`, **never a modal** |
| 14 | footer | |
| 15 | `.ta-tabbar` | fixed. `--cta-h:0`, no `.ta-cta`, no FAB — one fixed element at the bottom edge |

**Desktop (≥ 1024 px).** Identical DOM and source order; grid only. `body { padding-inline-end: var(--rail-w-collapsed) }`.

- **Fold = two columns**, `grid-template-columns: minmax(0,1.3fr) minmax(380px,1fr)`. Left: h1 + lead + planner laid out as one 56 px row (select · day chips · button). Right: **module 5 hoisted** — the deck sits beside the question. On submit the plan deck renders **in the right column** and the deck drops to its normal flow position, now province-scoped. The answer appears beside the question with no scroll and no jump; it costs one grid rule.
- Modules 7–13 full width below. Deck shelves become `.ta-grid` 4-up instead of scroll rails; guides 4-up; regions 3×2 with `<details open>`.
- `.ta-rail` (Trip Rail) at the inline-end, **layout-participating, not an overlay** — 56 px collapsed / 320 px expanded, state in `localStorage['ta.rail']`. Deck cards drag onto it; `⋮ → ย้ายไปวันที่…` ships first (WCAG 2.5.7).

**RTL.** Logical properties only. Only `.i-chevron` / `.i-arrow` mirror. Every `฿` figure, score and Latin brand name inside Thai/RTL prose wrapped in `<bdi>` or `.ta-iso`.

## 2. First screen, 375 × 812

Usable: 812 − 56 tabbar − 34 safe-area = **722 px**, of which the topbar takes 56.

| y (px) | h | element |
|---|---|---|
| 0–56 | 56 | `.ta-topbar` — `#i-map-pin` + "Thailandaddict" · spacer · `.ta-icon-btn` globe "ไทย" |
| 56–148 | 92 | **`<h1>`** `--step-4`, 2 lines, `line-height:1.5` + `padding-block` |
| 148–206 | 58 | lead `<p>`, 2 lines, `--text-muted` |
| 206–496 | **290** | **`.ta-planslot`** — `--surface-2`, `--r-lg`, 1 px `--border`, `shadow-1`. Inside: eyebrow 18 · `ไปไหน` label 22 + `<select>` 56 · `กี่วัน` label 22 + 4 radio chips 44 · submit 48 · `.ta-fine` 18 · padding 28 · gaps 34 |
| 496–552 | 56 | **`.ta-planchips`** — 6 real itinerary links, 44 px chips, partial 4th visible |
| 552–586 | 34 | `<h2>` deck heading |
| 586–642 | 56 | `.ta-tablist` — 6 province tabs, partial 5th visible |
| 642–722 | 80 | **top 80 px of the first ที่พัก card's 3:2 `<picture>`** (`Rayavadee`, 292 px wide → 195 tall) |
| 722–812 | 90 | `.ta-tabbar` + safe area, Trip badge showing `0` from first paint |

**Proof both asks are met above the fold.** Planner entry: the whole `.ta-planslot` (290 px) plus its submit. Real content: six named real published plans (`กระบี่ 3 วัน`, `เชียงใหม่ 3 วัน`…) at 496–552, the six real province tabs at 586–642, and the leading edge of a real reviewed hotel's photo at 642–722. Fold weight ≈ 24 KB HTML (brotli) + `shell.css` + `shell.js` (hashed, site-shared) + two Sarabun woff2 subsets ≈ 45 KB + one 560 px webp ≈ 23 KB → **cold ≈ 145 KB, warm ≈ 40 KB**, against a 500 KB budget and today's 1,758 KB.

## 3. Planner entry flow

**Controls — two required inputs, one button.** No dates, no pax, no budget, no interests. `startDate` is nullable and first-class (§6.1.2); demanding dates before first value is the highest-cost mistake in this category.

- **`ไปไหน`** — real `<select name="d">`, 56 px, six `<optgroup>` by region, **77 options = every destination with a `3d2n` itinerary**, so *every option works at the default duration*. Each option carries `data-p1` / `data-p2` / `data-p3` with only the tiers that exist on disk. With JS, tapping it opens `<dialog class="ta-sheet" id="taDest">`: search `<input>` filtered through `TA.segmentQuery()` (so `เชียงใหม่` and `ชม.` both hit), then **ยอดนิยม** (8 chips, no scroll: กระบี่ · เชียงใหม่ · กรุงเทพ · ภูเก็ต · เกาะสมุย · ปาย · เขาใหญ่ · หัวหิน), then **ตามภาค**. **The sheet list is not authored twice — `shell.js` clones it from module 10's region block.** One link set, two surfaces. That projection is what lets this page be an app and a landing page with no trade.
- **`กี่วัน`** — 4 `<input type="radio" name="n">` as `.ta-fac` chips: `1 วัน` · `2 วัน 1 คืน` · **`3 วัน 2 คืน` (checked)** · `4 วัน+`. 3 วัน 2 คืน is the modal Thai domestic trip and the richest tier (77 articles). Selecting a tier the destination lacks does not silently lie: `.ta-flag-unknown` appears and the button relabels (see copy §7).
- **Submit** — 48 px, full width, `.ta-btn .ta-btn-primary`.

**Taps to a useful plan.** 1 tap = a `.ta-planchips` link → a complete published itinerary. 3 taps = field → กระบี่ (in ยอดนิยม, duration already set) → submit → deck renders in place. 4 taps = `เปิดในหน้าทริป` → editable board.

**Three tiers of the same answer.**

- **Tier 0 · no JavaScript.** The `<form method="get" action="/destinations">` navigates to `/destinations`, a real page. It does **not** fake param handling. Underneath, permanently in the DOM: `.ta-planchips` (6 real plans), `.ta-guides` (8 real plans), `.ta-regions` (89 destination links). **The core content and the browse path are fully intact with JS off.** No Worker route, no redirect map.
- **Tier 1 · JS, in place.** `preventDefault()`. Fetch `/data/plan/<dest>.json` — **static files generated in prebuild** by a new `_internal/gen-plan-json.mjs` from the itinerary article's `day` blocks + `top10-hotels-<prov>.json`; 64 files for destinations with both plan and inventory, ~8–15 KB each. The slot expands downward into `.ta-plan-deck` in ~150 ms, built from kit markup verbatim — `.ta-day` / `.ta-day-head` / `.ta-day-list` / `.ta-poi` / `.ta-leg` / `.ta-leg-method` — so the deck and `/trip` are visibly the same object. Rows are the article's real `{time, activity}`; the `note` prose is **not** copied (that keeps the source article worth clicking). One stay row per night from the verified roundup, with a named OTA link (`cid=1965862`, `rel="sponsored noopener nofollow"`, `.no-prerender`). `history.replaceState('/?d=krabi&n=3')` — **tier-3 session state per §5.9: never emitted as an `<a href>`, never in the sitemap, `<link rel="canonical" href="https://thailandaddict.com/">` unconditional.**
- **Failure mode is the working link.** Button reads `กำลังจัดแผน…` with `aria-busy`. On fetch failure or >1.2 s, **navigate to the real itinerary article** from the option's `data-p3`. The enhancement never renders an error.

**Handoff to `/_proto/trip` and `TA.trip`.** `เปิดในหน้าทริป` runs, in order — **page code never touches `localStorage`; `shell.js` is the only writer**:

```
1. TA.poi.putAll(rows)                      // ids, names, imgs, lat/lng — so labels and legs resolve
2. if (TA.trip.count() > 0) → open #taTripConflict sheet, wait for choice   // never a silent overwrite
3. TA.trip.reset()                          // only on "สร้างทริปใหม่"
4. TA.trip.setTitle('กระบี่ 3 วัน')
5. per day:  var d = TA.trip.addDay('วันที่ '+n, zone)
6. per row:  TA.trip.addToDay(poiId, d.id, { kind, durMin, source:'guide' })
7. location.href = '/trip'
```

Ids follow §6.1.1: `s:<review-slug>` · `a:<article-slug>--<rank>` · `e:<article-slug>--<rank>`. **Legs are never written** — `/trip` derives them with `TA.trip.legs(dayId)`; a POI without coordinates renders `ยังไม่ทราบระยะทาง`, never a guessed number. *Build note: confirm the exact `opts` keys accepted by `addToDay` in `shell.js:~408` before wiring `durMin`/`source`.*

**Invariant, non-negotiable: browsing never writes storage.** Changing destination, switching tabs or opening the deck mutates in-memory state only. The trip is written **only** on an explicit ownership action — a 🔖 tap, `ใช้แผนนี้`, or `เปิดในหน้าทริป`. Otherwise a returning visitor's real 7-day trip would be clobbered by idly poking the demo.

## 4. The eat / see / stay showcase

`<h2>` + `role="tablist"` of **6 province tabs**, six `role="tabpanel"` sections **all in the DOM with the `hidden` attribute, never JS-fetched** — content not in the initial HTML is invisible to answer engines, and these panels carry a third of the page's links.

Six panels chosen by what is on disk, not fame: **กระบี่ (default) · เชียงใหม่ · ภูเก็ต · กรุงเทพ · อยุธยา · เชียงราย.** Verified `see≥4 + stay + eat` for all except Bangkok, whose panel pools from its ย่าน keys (`chidlom`, `ari`, `charoen-krung`, `sukhumvit`…) with the ย่าน as each card's eyebrow — better labelling, not worse. พัทยา and เกาะสมุย are **excluded**: neither has `top10-attractions-*` or `top10-popular-restaurants-*`. I will not fake a shelf.

**Three shelves per panel, 4 items each = 12 cards × 6 panels = 72 cards.** Each shelf is a `.ta-chip-scroll` at 78 % card width on mobile (partial next card = the scroll affordance), `.ta-grid` 4-up on desktop, each ending in a real `ดูทั้งหมด →`.

- **ที่พัก — photo cards** from `roundups/top10-hotels-<prov>.json` (100 % have a hero image). Krabi, verified: **Rayavadee** `Agoda 9.4 · 599 รีวิว` · `จาก ฿16,000/คืน · ตรวจสอบ ก.ค. 2026` → `/review-rayavadee-krabi`; **Panan Krabi Resort** `Agoda 9.1 · 614 รีวิว` · `฿2,800`; **The Tubkaak Krabi Boutique Resort** `Agoda 9.1 · 186` · `฿7,500`; **Sand Sea Resort** `Agoda 9.1 · 411` · `฿2,600`. Chiang Mai: **137 Pillars House**, **Akyra Manor**, **U Nimman**, **Anantara Chiang Mai** (`Trip.com` scores — name the source per row). Images from R2: `https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/images/hotels/…`.
- **ที่เที่ยว — photo cards** from `home-index.json` `see[]` (669/1,090 photographed, **zero stock**). Krabi: `ลานปูดำ Google 4.5 · 3,033` · `เขาขนาบน้ำ Google 4.5 · 621` · **`วัดถ้ำเสือ Wongnai 4.3 · 42`** · `หาดไร่เลย์ Google 4.5` (no count — render the score alone, never invent one). Chiang Mai: `วัดพระธาตุดอยสุเทพ Google 4.7 · 11,745` · `ประตูท่าแพ 4.3 · 14,639` · `วันนิมมาน 4.5 · 12,559` · `ถนนคนเดินวันอาทิตย์ 4.4 · 843`. Each carries real `hours` and `fee` from the source article. If a province has < 3 real photos the **whole** shelf degrades to `.ta-poi` rows — never a checkerboard.
- **ที่กิน — typographic tiles, deliberately not photos.** Measured: 20/1,100 restaurant blocks have a real image (1.8 %); 299 sit on `_lib/` stock. A stock noodle photo above `ทิพย์สมัย ผัดไทยประตูผี` is a small lie, and this site's entire position is that it does not tell them. Tile: `--sand-100` ground, hairline border, 3 px `--editorial` inline-start rule, name at `--step-2`, then the dense line the data actually supports (99.8 % hours, 99.2 % geo, 89 % ratings). Krabi, verified: **โกตุง (Kotung)** `Google 4.5 · 861 รีวิว` · `฿120–250/จาน` · `11:00–22:00 ทุกวัน` · `เมืองกระบี่`; **ร้านอาหารเรือนไม้ (Ruenmai)** `Google 4.7 · 1,692` · `฿200–400/คน`; **Lae Lay Grill** `Google 4.4 · 1,619` · `฿250–500/คน` + `.ta-flag-warn` **`ปิดวันพุธ`**; **ร้านน้องโจ๊ก** `Google 4.5 · 1,572`. Below the tiles, a `.ta-chip-row` of 3 real eat-guide links from `home-index` `eat[]` (`/krabi-food-guide`, `/krabi-cafe-guide`, `/krabi-local-breakfast`).

**Never a composite average across sources.** `Agoda 9.1` and `Google 4.5` are shown separately, each naming its source. Missing hours render `.ta-flag-unknown` `ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป`, not hidden.

**The add-to-plan affordance — one mechanic, day-scoped.** Directly above the shelves sits a single strip: **`กำลังเพิ่มเข้า: วันที่ 1`** (a `.ta-tablist` of `วันที่ 1 · 2 · 3 · บันทึกไว้`, present only once a trip has days; otherwise it reads `กำลังเพิ่มเข้า: ที่บันทึกไว้`). Every card's control is therefore the kit's `.ta-save` carrying `data-add-day="d1"` and the full payload:

```html
<button class="ta-save" type="button" aria-pressed="false" data-save
        data-add-day="d1"
        data-id="s:rayavadee-krabi" data-poi-id="s:rayavadee-krabi"
        data-kind="stay" data-name="Rayavadee" data-url="/review-rayavadee-krabi"
        data-img="images/hotels/krabi-rayavadee-1.jpg" data-province="krabi"
        data-lat="8.0104" data-lng="98.8375"
        data-score="9.4" data-price-from="16000" data-trip-href="/trip">
  <span aria-hidden="true">🔖</span>
  <span class="ta-save-off">เพิ่มเข้าวันที่ 1</span>
  <span class="ta-save-on">บันทึกแล้ว</span>
</button>
```

On tap: `aria-pressed` flips optimistically, the control fills `--trip` teal (teal-as-fill means "in your trip" and is forbidden as a fill anywhere else on the site), the tab-bar badge and rail badge increment, and `TA.toast()` fires naming the item and the running count with a link to `/trip`. On the **first** save only, `.ta-plandock` un-hides inline beneath the deck. The `.ta-planslot` at the top does **not** swap mid-scroll — mutating the top of a page someone is reading is a reflow, not a delight; it swaps on the next load. Card foot also carries `อ่านรีวิวเต็ม →`; tapping image or title navigates with `data-vt-hero` handing the `<img>` to the destination hero.

Selecting a province tab moves `aria-selected`, un-hides the panel, updates the hash (`#deck-krabi`, back-restorable) **and syncs the planner `<select>`** — the one place the two halves of the page are wired together.

## 5. Empty state and returning visitor

Resolved by a ~200-byte parser-blocking read in `<head>` that checks only the *length* of `ta.trip.v1` and the count in `ta.saves.v3` (no parse) and sets `:root[data-trip="has"|"saves"|"none"]`. CSS does the rest inside the reserved 290 px box: no flash, no shift. If storage throws (private mode, blocked site data) the page renders the first-time layout — the correct default. All writes are deferred while `document.prerendering` is true, or the badge double-counts on activation.

**State C — first-timer (no state).** The planner form, exactly as specified. Never an empty app screen: six real one-tap plans sit directly beneath it and 72 real places beneath those.

**State B — saves but no days.** The box becomes: eyebrow `ทริปของคุณ`, `บันทึกไว้ 6 ที่ ใน กระบี่ · ยังไม่ได้จัดเป็นวัน`, three 56 px thumbnails, primary **`จัดเป็นวัน ๆ ให้เลย`** (runs the same materialiser, using the saved items' provinces to preselect the destination), quiet `เปิดแผน →`. This is the highest-value returning path on the site and it is one tap.

**State A — a real trip exists.** eyebrow `ทริปของคุณ` · `<h2>กระบี่ 3 วัน</h2>` · `12 จุด · 3 วัน · แก้ล่าสุด 2 วันก่อน` · three thumbnails + a `+9` tile · **`เปิดแผน`** (primary) + `เริ่มทริปใหม่` (quiet) + `ซ่อนไว้ก่อน` (session-dismissible via `sessionStorage`, never permanent) · `.ta-fine` `เก็บไว้ในเบราว์เซอร์นี้เท่านั้น — ไม่มีใครเห็น และเราไม่ได้เก็บไว้ที่เซิร์ฟเวอร์`. Below it a collapsed one-row `＋ วางแผนที่ใหม่` that expands back with the previous destination pre-filled — a second trip is a real thing.

The deck **pre-selects the trip's province** if it is one of the six; if not (say น่าน) the deck keeps its default and the resume card carries `ดูที่พัก ที่กิน ที่เที่ยว ใน น่าน →` to `/city-nan`. No empty custom panel, no fake shelf. `TA.nav.syncSaves(root)` flips every already-saved card to teal on load, so a returning visitor sees their own trip lit up among the unsaved cards.

**Out-of-province saves are never silently inserted.** They land in a visible tray `บันทึกไว้ แต่ไม่ได้อยู่ในแผนนี้ (2)` with `เพิ่มจังหวัดนี้เข้าทริป` — the fix for the Krabi-day-in-a-Chiang-Mai-trip bug, which the homepage is where it gets born.

**Honest failure named on the page:** in private browsing or on a new device, storage is empty and the visitor lands in State C. There is no account. Recovery is the QR handoff and JSON export at `/trip`, both linked, never gated.

## 6. The SEO answer

Measured baseline of the page being replaced: **`h1:1, h2:0, h3:0`, 105 anchors, 77 provinces trapped in a JS array = 0 crawlable province links**, ~3,554 characters of visible text, JSON-LD `WebSite` + `Organization` only. The honest framing is not "avoid regressing" — it is that this is a large upgrade.

**Headings — `h1:1, h2:9, h3:32, h4:72`.**
- `h1` × 1, keyword-bearing and the LCP element.
- `h2` × 9: deck · pills · answer · guides · regions · stats · editorial · newsletter · plandock (`ในทริปของคุณ`, hidden until first save).
- `h3` × 32: 6 panels × 3 shelf headings (`พักที่ไหนดีในกระบี่` / `กินอะไรดีในกระบี่` / `เที่ยวไหนดีในกระบี่` — every one a real Thai search query) + 8 guide titles + 6 region names.
- `h4` × 72: card titles. **One deliberate, flagged deviation from PROTO-KIT §7:** `.ta-card-title` is an `<h4>` *inside the deck* (where an `<h3>` shelf heading is the parent section's heading) and stays an `<h3>` everywhere else. The class is what is styled; the level is a document-outline concern the kit cannot know. Confirm before build.

**Links — ~215 unique internal URLs across ~250 `<a href>` elements, up from 105 with zero province links.** 89 destination links (77 provinces + 12 sub-destinations) as real anchors inside six `<details>` — **DOM-present, therefore crawlable and AI-readable whether or not the element is open** — plus 6 region hubs; ~60 unique from the deck (24 hotel reviews + 6 attraction articles + 6 restaurant articles + 6 hotel roundups + 18 eat guides); 14 activity guides; 8 itinerary articles; 6 plan chips; `/destinations`, `/country-thailand`, `/trip`, `/search`, `/near-me`; ~25 footer. Clean URLs throughout, no `.html`. **`/saved` and `/how-we-rank` are not linked — they do not exist yet.** `?d=&n=` is produced only by `replaceState` and never emitted as an anchor.

**Body text — ~1,100–1,300 Thai words.** The 70-word `.ta-answer`; a 35-word intro per deck panel (6 × 35); **the six region intros reused verbatim from `gen-hubs.mjs`'s existing `REGION[r].intro` strings — zero new content work**; 8 guide card subs; plus ~72 entity-dense meta lines carrying names, areas, opening hours, closed days, price bands and scores with their sources named. Dense, checkable, extractable.

**Where I hedge, honestly:** 60 of 72 deck cards are in `hidden` panels. That is the standard tabbed pattern and the panels are DOM-present and never fetched, but I will not claim hidden content carries full weight. **That is exactly why the 89 destination anchors, the region intros, the pills, the guides and the answer block sit in the always-visible flow.** If the tabs were discounted to zero the page would still ship 9 `h2`, ~155 unique links and ~950 words — still several times the incumbent.

**JSON-LD:** `WebSite` + `SearchAction` (pointing at the real `/search?q=`) · `Organization` · `ItemList` over the default (Krabi) deck panel with `position` + `name` + `url` · a second `ItemList` over the 8 ready-made plans · `FAQPage` with 3 real Q&A (`เที่ยวไทย 3 วันไปไหนดี` / `เที่ยวไทยเดือนไหนดี` / `จองที่พักเว็บไหนถูกกว่ากัน` — answered honestly: *เราเทียบ Agoda / Booking / Trip.com บนทุกรีวิว ราคาต่างกันบ่อย เช็กทั้งสามก่อนกด*) · `Person` for Doctor Chat from `astro/src/data/editorial.json`, gated so an empty name falls back to `Organization` · `SpeakableSpecification` on `.ta-answer`. **No `TouristTrip`** — the static HTML does not render a trip, and asserting one would be dishonest.

**Core Web Vitals:** LCP is `<h1>` text with no image dependency; no Leaflet (it stays on `/trip`); no count-up (a trust-thesis site must not animate through wrong numbers); every image carries `width`/`height`; the planslot's state swap happens inside a height-reserved box, so CLS is 0.

**Blocking dependency, not a follow-up.** `_internal/homepage-i18n/build.mjs` localises by find-and-replace over **127 exact HTML substring anchors**, most requiring an exactly-once match. This design changes essentially every one. **Rewrite that generator to a keyed-string model before this homepage ships**, or 8 locale twins hard-fail or, worse, silently mis-translate. Also required in prebuild: `_internal/gen-plan-json.mjs` (64 static plan files) and `_internal/gen-card-images.mjs` (`images/_cards/` holds only the 66 files the old prototype needed; it is in the bundle, not `.assetsignore`).

## 7. Copy — Thai, every string

**Head / hero**
- `<title>` `วางแผนเที่ยวไทย 2026 — ที่พัก ที่กิน ที่เที่ยว จากรีวิวที่เราเขียนเอง | ThailandAddict`
- `h1` **วางแผนเที่ยวไทย จากที่พัก ที่กิน ที่เที่ยว ที่เรารีวิวเอง**
- lead **เลือกจุดหมายกับจำนวนวัน แล้วกดดูแผน — หรือเลื่อนดูข้างล่าง กด 🔖 เก็บที่ที่ชอบไว้ก่อน แล้วค่อยจัดเป็นวัน ๆ ทีหลัง**

**Planner (`.ta-planslot`, State C)**
- eyebrow **จัดทริปเอง ใน 2 แตะ** · label **ไปไหน** · placeholder **เลือกจุดหมาย** · label **กี่วัน**
- chips **1 วัน** · **2 วัน 1 คืน** · **3 วัน 2 คืน** (default) · **4 วัน+**
- submit **ดูแผนเลย** → after a destination is chosen: **ดูแผนกระบี่ 3 วัน**
- fine **แผนมาจากคู่มือที่เราเขียนเอง ไม่ใช่ AI แต่งขึ้น — ทุกที่ในแผนมีรีวิวเต็มให้อ่าน · ทริปเก็บไว้ในเบราว์เซอร์นี้เท่านั้น ไม่ต้องสมัครสมาชิก**
- missing tier **จุดหมายนี้เรามีแผน 1 วัน กับ 3 วัน 2 คืน — ยังไม่มีแบบ 2 วัน 1 คืน** → button **ดูแผน 3 วัน แล้วเพิ่มวันเอง**
- no-JS escape **หรือดูจุดหมายทั้งหมด →**

**Destination sheet** — title **เลือกจุดหมาย** · search placeholder **พิมพ์ชื่อจังหวัดหรือเกาะ** · **ยอดนิยม** · **ตามภาค** · close **ปิด**

**Plan chips** — eyebrow **แผนยอดนิยม แตะเดียวได้เลย**; `กระบี่ 3 วัน` · `เชียงใหม่ 3 วัน` · `กรุงเทพ 2 วัน` · `ภูเก็ต 3 วัน` · `ปาย 3 วัน` · `อยุธยา 2 วัน`

**Plan deck (after submit)** — loading **กำลังจัดแผน…** · header **กระบี่ · 3 วัน 2 คืน** · **เริ่มใหม่** · day **วันที่ 1 — อ่าวนาง สู่ เรลเลย์–ถ้ำพระนาง** · roll **5 จุด · 15.3 กม. · เดินทางรวม ~27 นาที** · leg **~12 นาที · 1.4 กม. · รถ** + method **ประมาณ (เส้นตรง)** · no coords **ยังไม่ทราบระยะทาง** · provenance **เรียบเรียงจากคู่มือ "แผนเที่ยวกระบี่ 3 วัน 2 คืน" — อ่านฉบับเต็ม →** · buttons **เปิดในหน้าทริป** / **อ่านคู่มือฉบับเต็ม**

**Conflict sheet** — **มีทริปอยู่แล้ว: กระบี่ 3 วัน** · **เพิ่มเข้าทริปเดิม** · **สร้างทริปใหม่ (เก็บทริปเดิมไว้ในที่บันทึก)** · **ยกเลิก**

**Deck** — `h2` **เลือกจุดหมาย แล้วดูที่พัก ที่กิน ที่เที่ยว** · tail **ดูทั้ง 77 จังหวัด →** · tabs **กระบี่ · เชียงใหม่ · ภูเก็ต · กรุงเทพ · อยุธยา · เชียงราย** · strip **กำลังเพิ่มเข้า: วันที่ 1** / **กำลังเพิ่มเข้า: ที่บันทึกไว้** · shelves **พักที่ไหนดีในกระบี่** / **กินอะไรดีในกระบี่** / **เที่ยวไหนดีในกระบี่** · tails **ดูที่พักกระบี่ทั้งหมด →** / **ดูร้านอาหารกระบี่ทั้งหมด →** / **ดูที่เที่ยวกระบี่ทั้งหมด →** · card foot **อ่านรีวิวเต็ม →** · save **🔖 เพิ่มเข้าวันที่ 1** / **บันทึกแล้ว** · price **จาก ฿2,800 / คืน** + **ตรวจสอบ ก.ค. 2026** · flags **ปิดวันพุธ** / **ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป** · inventory line **กระบี่: ที่พักที่เรารีวิวเอง 66 แห่ง** (real count only)

**Plan dock / toast** — **ในทริปของคุณ 3 ที่** · **เปิดแผน** · toast **เพิ่ม "ร้านอาหารเรือนไม้" แล้ว · ในทริปของคุณ 3 ที่**

**Returning** — **ทริปของคุณ** · **กระบี่ 3 วัน** · **12 จุด · 3 วัน · แก้ล่าสุด 2 วันก่อน** · **เปิดแผน** · **เริ่มทริปใหม่** · **ซ่อนไว้ก่อน** · **＋ วางแผนที่ใหม่** · **บันทึกไว้ 6 ที่ ใน กระบี่ · ยังไม่ได้จัดเป็นวัน** · **จัดเป็นวัน ๆ ให้เลย** · **บันทึกไว้ แต่ไม่ได้อยู่ในแผนนี้ (2)** · **เพิ่มจังหวัดนี้เข้าทริป** · **เก็บไว้ในเบราว์เซอร์นี้เท่านั้น — ไม่มีใครเห็น และเราไม่ได้เก็บไว้ที่เซิร์ฟเวอร์**

**Remaining sections** — pills `h2` **เลือกตามสิ่งที่อยากทำ**: หาดสวย · เกาะเงียบ · คาเฟ่ · จุดชมวิว · เมืองเก่า · วัด · น้ำตก · ดำน้ำ · ดำน้ำตื้น · ร้านมิชลิน · บาร์ 50 Best · เที่ยวกับเด็ก · หาดสำหรับครอบครัว · ที่สุดของไทย 2026 — all 14 verified on disk.
answer `h2` **เที่ยวไทยครั้งแรก เริ่มยังไงดี** · guides `h2` **แผนพร้อมใช้ — ก๊อปไปแก้ต่อได้**, buttons **อ่านแผนเต็ม** / **ใช้แผนนี้** · regions `h2` **เลือกตามภาค — 77 จังหวัด**, summaries **ภาคเหนือ · ภาคอีสาน · ภาคกลาง · ภาคตะวันออก · ภาคตะวันตก · ภาคใต้**, tail **ดูจุดหมายทั้งหมด →** · stats `h2` **เว็บนี้มีอะไรบ้าง**: **รีวิวที่พัก 2,401 แห่ง** · **ไกด์จัดอันดับ 397 ชุด** · **บทความ 4,447 เรื่อง** · **แผนรายวัน 258 แผน** · **77 จังหวัด · 9 ภาษา** (all verified, static, no count-up) · editorial `h2` **ใครเขียนเว็บนี้** · newsletter `h2` **รับไกด์ใหม่ทางอีเมล**, button **สมัครรับข่าว** · skip link **ข้ามไปเนื้อหาหลัก**

**Forbidden and linted in all 9 languages** (`_internal/lint-dark-patterns.mjs`): `แผนของคุณกำลังจะหมดอายุ` · `ราคาอาจเปลี่ยน` · `อย่าให้แผนหาย` · `เหลืออีก 63 จังหวัด` · `N คนบันทึกที่นี่` · any countdown, scarcity, discount, viewer count or fabricated freshness date. Every returning-visitor string is a neutral statement of state.

## 8. New page-scoped classes

The existing prototype already defines 29 homepage-only `.ta-*` classes in a 7 KB page `<style>`, so this is the sanctioned pattern. **Six new, all homepage-scoped, all named in the existing family:** `.ta-planslot` · `.ta-planchips` · `.ta-plan-deck` · `.ta-deck` · `.ta-eat-tile` · `.ta-plandock`. Everything else is kit-verbatim. Four new delegated `shell.js` hooks: `data-plan-submit`, `data-plan-dest`, `data-plan-nights`, `data-plan-adopt` — **no inline handlers.**

## 9. The three risks I am accepting, stated plainly

1. **Organic search lands people on `/city-krabi` and reviews, not on `/`.** A planner-first fold optimises for the smallest of the three intents that reach the homepage. The returning-visitor collapse and the fact that the fold costs only 290 px are the mitigation, not a refutation. Settle it with GA4 landing-page data before Phase 7.
2. **"ไปไหน" is the hard question and this design treats it as the easy one.** *"ไปทะเลสัก 3 วัน งบไม่เกินห้าพัน"* has no answer in a 77-item `<select>`; the popular chips and the 14 activity pills only partly cover it. An intent-first entry (ทะเล / ภูเขา / กับเด็ก / งบ → shortlist) is the right v2 and is deliberately not in v1 because a third field measurably suppresses submits.
3. **The eat shelf has no photographs and "กิน" is a third of the promise.** 1.8 % of restaurant blocks have a real image. The typographic tile is the honest treatment, not a fix; the fix is a photo backfill of ~1,080 blocks, which is a content programme. A homepage sold on beauty is one-third un-beautiful on delivery, and the owner should hear that now rather than discover it in the prototype.
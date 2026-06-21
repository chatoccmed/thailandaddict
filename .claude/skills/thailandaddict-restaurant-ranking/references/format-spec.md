# Format spec — eat-ranking restaurant article (v3)

Exact structure of `top10-popular-restaurants-<city>.json`. Source of truth = `astro/src/content.config.ts` (validation) + `astro/src/layouts/ArticleLayout.astro` (render, `type === 'eat-ranking'`). Concrete examples = the Chiang Mai & Bangkok gold references.

## 1. Article-level fields (top of the JSON object)
| Field | Notes |
|---|---|
| `slug` | `top10-popular-restaurants-<city>` (= filename without `.json`) |
| `type` | `"eat-ranking"` (selects the restaurant render path) |
| `cluster` | `<city>` slug (verify checks `cluster === city`) |
| `title` / `metaDesc` / `keywords` | SEO. title ≤ ~60 visible chars + brand suffix `| ThailandAddict`; metaDesc names the headline restaurants |
| `ogTitle` / `ogDesc` | social |
| `image` / `heroImg` | hero = rank-1 restaurant's main photo (`/images/food/<city>/<slug>.jpg`) |
| `crumbCity` / `crumbCityHref` | breadcrumb → `city-<city>.html` |
| `regionLabel` / `regionHref` | e.g. `ภาคกลาง` → `region-central.html` |
| `eyebrow` | `คัดจากรีวิวจริง · อัปเดต 2026` |
| `h1` | `10 ร้านอาหารยอดนิยม<br>ใน <span class="hi">{display}</span>` — `display` = short province name (กรุงเทพฯ, not "จังหวัดกรุงเทพมหานคร"); NO the word "จังหวัด" in the hi span |
| `heroEmoji` | 🍜 |
| `intro` | 1 paragraph, friend-tone, sets the "คัดจากรีวิวจริง" honesty frame |
| `chips` | 3–4 hook chips (emoji + short fact) |
| `readTime` / `publishedDate` / `modifiedDate` | freshness line renders from these |
| `blocks` | ordered array — see §2 |
| `faq` | ≥5 `{q,a}` (FAQ JSON-LD) |
| `related` | `[{href,label}]` "อ่านต่อ" (mix city + hotel roundups) |
| `rail` | sticky right-rail hotel cards — see §3 |

## 2. Blocks (ordered)
Canonical order: `p` (honesty disclaimer) → 5× `restaurant` → `staycta` → 5× `restaurant` → `foodexp` → `localtips` → `tip` → `cta`.

### `restaurant` (the core card; ×10)
Required: `kind:"restaurant"`, `rank` (1–10), `name`, `descHtml` (≥200 Thai words, multiple `<p>`).
Strongly expected: `area`, `cuisine`, `signature`, `priceRange`, `img`, `alt`, `credit`, `creditHref`, `gallery` (exactly 3 × `{src,alt,credit,creditHref}` → 4 photos total with main), `mustOrder[]`, `tags[]`, `mapHref` (Google Maps search URL), `stayHref` (→ a real hotel roundup, resolved by zone via stayMap), `stayLabel`.
v3 ranking/UX: `rating` (number), `ratingCount` (number — omit if no real count), `ratingSrc` ("Google"), `bestFor` (one short line), `zone` (neighbourhood — powers the zone filter + map grouping), `foodType` (powers the type filter).
Global-tourist: `hours`, `priceUsd`, `spice`, `halal` (bool), `veg` (bool), `englishMenu` (bool), `lat`, `lng` (map pin).

### `staycta` (mid-article hotel-booking module, after restaurant #5)
`{kind:"staycta", title, text?, img?, links:[{href,label}], ctaLabel, ctaHref}` — `links[].href` MUST be real roundups; `ctaHref` = Agoda city link (`agoda.com/th-th/city/<city>-th.html?cid=1965862`).

### `foodexp` (Klook/GetYourGuide food-tour & cooking-class module)
`{kind:"foodexp", title, text?, items:[{title,text,href,tag?}]}` — uses `klook()` (aid=121442) + `gyg()` (search `getyourguide.com/s/?q=<city>`) helpers. Renders in the sticky rail under the hotels. (`experiences` block = same shape, used by the parallel city workstream.)

### `localtips` (know-before-you-go — "รู้ก่อนไปกิน")
`{kind:"localtips", title, items:[{icon,title,text}]}` — 4–6 cards (cash-only, queue/timing, spice, halal/veg availability, etc.).

### `p` / `tip` / `cta`
`p` = `{kind:"p",html}` (opening honesty disclaimer). `tip` = `{kind:"tip",title?,html}`. `cta` = `{kind:"cta",text,href,label?}` (closing → hotels).

## 3. `rail` (sticky right column)
`rail: [{title, href, note?, img?}]` — **3–4 cards minimum** (a 1-card rail looks empty — owner). Mix the city's hotel roundup(s) + single-hotel reviews (`review-*-<city>.html`) so every card has an `img` (hotel hero, served from R2). The layout pins the rail via `position:sticky;top:80px` on the grid item (`.rrail`) with `.rgrid{align-items:start}`. **CRITICAL: `overflow-x:clip` must be on `html`, NOT `body`** — `body{overflow-x:clip}` is a full-page-height ancestor that captures the sticky element so it never pins to the viewport (the rail "doesn't follow on scroll"). Verified fix: move clip to `html`. The `foodexp` module renders below the hotel cards in the same rail.

## 4. `args` contract (input to the engine)
```js
{
  prov: "กรุงเทพมหานคร",          // full province (Plan/Frame prose)
  city: "bangkok",                // slug (filenames, image dir, cluster)
  slug: "top10-popular-restaurants-bangkok",
  display: "กรุงเทพฯ",            // optional short name for h1 hi-span (default = prov)
  hi: "กรุงเทพฯ",                 // optional highlight word
  region: { label:"ภาคกลาง", href:"region-central.html" },
  stayDefault: { href:"top10-hotels-<city>.html", label:"ที่พักทำเลดีใน…" },
  stayMap: [ { match:["นิมมาน","เมืองเก่า"], href:"top10-…-<city>.html", label:"…" } ], // zone→roundup for per-card stayHref
  stayCta: { links:[{href,label}], ctaLabel:"…", ctaHref:"agoda…cid=1965862" },
  rail: [ {href,img,name,loc,price} ],   // see §3 — REAL roundups + heroImgs
  related: [ {href,label} ]               // optional
}
```
All `href`s must resolve to files in `astro/src/content/roundups/` (verify enforces). The engine string-parses `args` (see SKILL gotcha #1) and reads `A.x`.

## 5. Rendered design features (ArticleLayout, eat-ranking)
- Immersive hero (rank-1 photo full-bleed) · sticky quick-nav (1–10) · freshness line ("🔄 ตรวจสอบล่าสุด …").
- Per card: rank tile · name · area · **rating line** (`⭐ 4.4 · 3,665 รีวิว (Google)`; count omitted if absent) · **best-for badge** · info badges (hours/USD/spice/halal/veg/English-menu) · tags · **gallery thumbnails** (click-swap main) · zone · mustOrder · map + stay buttons.
- **Multi-axis filter bar**: ประเภท (foodType) · ย่าน (zone) · ราคา (priceRange) · diet toggles (veg/halal) — client JS, AND-combine. Diet toggles only appear if any restaurant has the flag.
- **Leaflet/OpenStreetMap map** (CDN, no key) with 10 pins, zone grouping, nearest-distance-from-hotel popups (Haversine from lat/lng). Runtime marker CSS needs `:global()` (Astro scopes `<style>`).
- **Sticky right rail** (hotels + foodexp) · mid-article `staycta` · **localtips** box · closing `cta`.
- **Copyright/takedown notice** at the bottom (renders from layout strings → `contact.html`).
- **JSON-LD**: ItemList + Restaurant + AggregateRating (only restaurants with a real `ratingCount`) + FAQ + BreadcrumbList.

## 6. Content standards (brand LOCKED)
- 10 real, review-backed restaurants · each `descHtml` ≥200 Thai words (verify: ≥700 Thai chars) across several `<p>`.
- Friend-tone (v2-clean). Ban slang `อ่ะ/ปะ/แหละ/ล่ะ`; ban AI words `ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`.
- Honesty: "คัดจากเสียงรีวิวจริง" framing; never claim first-person dining; no fabricated ratings/photos.
- Every image credited; takedown box present. Per-card + mid-article + rail all route to hotel affiliate roundups (the monetization spine).

## 7. Verify checklist (`verify-resto.mjs <city>` — errors=0 to ship)
10 restaurants · each desc ≥700 Thai chars · every `img` + `gallery` file on disk >15KB · `img` has `credit` · `stayHref`/`staycta`/`rail` resolve to real roundups · article has title/metaDesc/keywords/h1/intro/image/heroImg/crumb · `cluster===city` · `type==='eat-ranking'` · ban-word lint = 0. Warns (OK to ship): missing `ratingCount`/`zone`/`foodType`/`bestFor`, slang `แหละ`, faq<5, rail<3.

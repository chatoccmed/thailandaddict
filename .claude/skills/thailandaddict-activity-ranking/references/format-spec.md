# Format spec — activity-ranking article

Source of truth: `astro/src/content.config.ts` (validation) + `astro/src/layouts/ArticleLayout.astro` (render). Concrete example = the Chiang Mai gold reference `astro/src/content/articles/top10-activities-chiang-mai.json`.

The page reuses the **eat-ranking render engine**: rich cards activate whenever `restaurant` blocks exist; `type:"activity-ranking"` sets `isActivity` (labels → "กิจกรรม", per-item schema → `TouristAttraction`, save chip → `data-type="activity"`).

## 1. Article-level fields
| Field | Notes |
|---|---|
| `slug` | `top10-activities-<city>` (= filename) |
| `type` | `"activity-ranking"` |
| `cluster` | `<city>` slug (must match the province) |
| `title` / `metaDesc` / `ogTitle` / `ogDesc` | SEO. title e.g. `10 กิจกรรมน่าทำใน<จังหวัด> — คัดจากรีวิวจริง … | ThailandAddict` |
| `image` / `heroImg` | = card-1's `img` (a credited CC photo). |
| `heroCredit` / `heroCreditHref` | hero attribution. |
| `crumbCity` / `crumbCityHref` | breadcrumb → `city-<city>.html` |
| `regionLabel` / `regionHref` | e.g. `ภาคเหนือ` → `region-north.html` |
| `eyebrow` | `คัดจากรีวิวจริง · อัปเดต 2026` |
| `h1` | `10 กิจกรรมน่าทำ<br>ใน <span class="hi"><city></span>` |
| `heroEmoji` | `🎟️` |
| `intro` | 1 paragraph, friend-tone, "คัดจากรีวิวจริง" frame |
| `chips` | 4 hook chips (emoji + short category) |
| `readTime` / `publishedDate` / `modifiedDate` | freshness line |
| `blocks` | ordered — see §2 |
| `faq` | ≥5 `{q,a}` (FAQ JSON-LD) |
| `related` | `[{href,title}]` (city hub + a hotel roundup) |
| `rail` | 3-4 `{title,href,note?,img}` REAL hotel roundups; `img` = R2 hotel hero (e.g. `images/hotels/<city>-<hotel>-1.jpg`). |

## 2. Blocks (ordered)
`p` (storytelling lead, 2 `<p>`) → 10× `restaurant` (the activity cards, rank 1-10) → `staycta` (hotel module) → `experiences` (Klook activities module) → `localtips` (4 know-before-you-go) → `tip` → `cta`.

### `restaurant` block as an ACTIVITY card (×10)
Required: `kind:"restaurant"`, `rank` (1-10), `name` (the bookable product, Thai), `descHtml` (≥200 Thai words / 700+ chars, multiple `<p>`).
Card fields:
- `area` (short location line), `zone` (powers zone filter/grouping), `foodType` (the **category** — repurposed: ปางช้าง / ทัวร์ธรรมชาติ / คุกกิ้งคลาส / ทัวร์ครึ่งวัน / ผจญภัย-ซิปไลน์ / ผจญภัย-ล่องแก่ง / ตั๋วเข้าชม / เวิร์กช็อป-กีฬา).
- `rating` (number, from a real platform) + `ratingSrc` (e.g. `"TripAdvisor"`, `"GetYourGuide"`, `"Klook"`). **Omit both if no real rating found** (do not invent). Leave `ratingCount` unset (no AggregateRating emitted without a real count — correct).
- `bestFor` (one short Thai line), `duration` (e.g. `ครึ่งวัน ~4–5 ชม.`), `priceRange` (THB of the PRODUCT, e.g. `~฿1,200–1,800 / คน`).
- `tags` (3 short Thai tags).
- **Images (CC only):** `img` (main thumburl) + `alt` + `credit` (`ภาพ: <artist> · <license>`) + `creditHref` (Commons file page); `gallery` = 2-3 × `{src,alt,credit,creditHref}` (→ 3-4 photos total, click-swap thumbs). NEVER Klook photos.
- `mapHref` = `https://www.google.com/maps/search/?api=1&query=<name>`.
- **`pros`** (3-4) / **`cons`** (3) — review summary, rendered full-width below the card as ✅ จุดเด่นจากรีวิว / ⚠️ ข้อสังเกต. From real reviews; include genuine downsides.
- **`tipHtml`** — `<b>เคล็ดลับ:</b> …` rendered as a yellow box above pros/cons.
- **Booking:** `bookHref` (Klook deep link + `aid=121442`), `bookProvider` (`"Klook"`), optional `bookLabel`. Renders an orange "🎟️ จองบน Klook" button.
- **Hotel cross-sell:** `stayHref` (a REAL hotel roundup on disk) + `stayLabel`.
- Food-only fields (cuisine, mustOrder, spice, halal, veg, englishMenu, signature) — leave unset for activities.

### `staycta` / `experiences` / `localtips` / `tip` / `cta`
- `staycta`: `{title,text?,links:[{href,label}],ctaLabel,ctaHref}` — links = real roundups; ctaHref = Agoda city link `agoda.com/th-th/city/<city>-th.html?cid=1965862`.
- `experiences`: `{title,text?,items:[{label,note?,href,provider,emoji}],ctaLabel,ctaHref}` — Klook deep links +aid (the bookable-activity module; renders in the sticky rail under hotels).
- `localtips`: `{title,items:[{icon,title,text}]}` — 4 cards (haze for the North, cool weather on peaks, book ahead, transport).

## 3. Rendered design (ArticleLayout, isActivity)
Immersive hero (card-1 photo) · sticky quick-nav (1-10) · per card: rank tile · name · `⭐ rating (src)` · best-for badge · tags · photo + 3-thumb gallery (click-swap, zoom) · duration + price · **🎟️ จองบน Klook** + 🏨 hotel + 📍 map buttons · full-width จุดเด่น/ข้อสังเกต + 💡 เคล็ดลับ. Sticky hotel rail + Klook `experiences` · localtips · JSON-LD: Article + ItemList + **TouristAttraction** (per card) + FAQPage + BreadcrumbList. Filter bar (ประเภท/ย่าน) appears when ≥2 zones/categories.

## 4. Honesty + image rules (LOCKED)
- Real ratings only (with source); real pros/cons; no first-person; banned AI words (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน); banned slang (อ่ะ/ปะ/แหละ/ล่ะ).
- Each card = a bookable PRODUCT (tour/ticket/class), not a place.
- CC images only (Klook blocks fetch + copyright); credit every image; prefer location-specific, generic-relevant fallback allowed with credit + honest alt.

## 5. Merge gotcha
Subagent JSON returns HTML entities in `descHtml`/`tipHtml`/`mapHref`/`bookHref`. Recursively un-escape before writing: `&lt;`→`<`, `&gt;`→`>`, `&quot;`→`"`, `&#39;`→`'`, then `&amp;`→`&`.

## 6. Verify checklist (errors → fix before ship)
10 `restaurant` cards · each desc ≥700 Thai chars · each has `img` + ≥2 gallery (CC, credited) · `pros`+`cons` present · `bookHref` has `aid=121442` · `stayHref`/`rail` resolve to real roundups on disk · `type==="activity-ranking"` · `cluster===city` · no `&lt;`/`&amp;` left in HTML fields · ban-word lint = 0 · per-item schema = TouristAttraction.

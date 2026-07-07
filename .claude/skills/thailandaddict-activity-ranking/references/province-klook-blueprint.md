# Per-province Klook System — the master template (แม่แบบ Klook ต่อจังหวัด)

The authoritative checklist for the Klook activity/ticket engine. For each province you build a **content cluster** (not a SKU dump). Everything monetises via **Klook activity deep links (`aid=121442`)** + **hotel cross-sell** (Agoda `cid=1965862` / Booking / Trip `Allianceid=6861268&SID=312919111`).

**Proven on 2 provinces:** Chiang Mai (pilot/gold) ✅ + Phuket ✅ — full A1+A2+B+C cluster live. Replicate this exact shape per province.

Status legend: ✅ built · 🟡 partial · ⬜ not built.

---

## The 4 content deliverables per province

### A1. Roundup (flagship) — `type:"activity-ranking"`
- Slug `top10-activities-<city>` · **10 bookable products** · the anchor entry hub. **Build this FIRST.**
- Built by the `thailandaddict-activity-ranking` skill (parallel-agent pipeline). See that SKILL.md + `format-spec.md`.
- Blocks: `p` intro → 10 `restaurant` cards → `staycta` (hotel) → `experiences` (Klook) → `localtips` → `tip` → `cta`; + `faq` (≥5) + `related` + `rail` (3 REAL hotel roundups/reviews w/ R2 imgs).

### A2. Comparison / decision articles — `type:"activity-compare"`
The highest-intent SEO pieces ("which X should I pick"). **1 article = many Klook links.** Pick the set that fits the province's real offering. Target **4-6 compares per tourist province**.

| Article (slug pattern) | When to build | Klook angle |
|---|---|---|
| `<city>-island-tours-compared` / `<city>-island-hopping` ⭐ | islands (Phuket, Krabi, Samui, Lipe, Tao, Trat) | link each boat/island tour |
| `<city>-elephant-sanctuaries` — "เปรียบเทียบ N ปางช้าง + จริยธรรมช้าง" ⭐ | provinces w/ elephant camps (CM, Phuket, Krabi, Pattaya, Kanchanaburi) | link each sanctuary product |
| `<city>-cooking-classes` — "N คุกกิ้งคลาส คุ้มสุด" | any food-tourism province | link each class |
| `<city>-diving-snorkeling` / `<city>-day-tours-guide` | dive/day-trip provinces (Similan, Phi Phi, Doi Inthanon) | link tour variants |
| `getting-around-<city>` / `<city>-getting-around` — "Grab vs เช่ารถ vs มอไซค์ vs สองแถว" | **every province** (transport = huge search) | Klook transfers/car-rental where sold; transport cards carry **NO rating** |
| `<city>-<attraction>-worth-it` — "บัตร/โชว์ <X> คุ้มไหม" | ticketed attractions/shows (FantaSea, Night Safari, aquariums, theme parks) | link the ticket |

- Render: ArticleLayout (`isActivity` auto-on for `type` starting "activity"). Blocks = `p` intro → `table` (comparison) → `restaurant` cards (each option, pros/cons + bookHref) → **`experiences` (Klook) → `staycta` (hotel)** → `tip` → `cta`; + `faq` + `related` + `rail`.
- ⚠️ **Every compare MUST include the `experiences` + `staycta` selling blocks** (the transport/worth-it ones too) — otherwise the page has no monetization. Inject from the cluster's A1 roundup blocks for consistency.

### B. Activity hub (auto-generated) — `gen-hubs.mjs` → `activities-<city>.html`
- Lists the roundup + all compares + hero pages, with a **role filter** (จัดอันดับ/เปรียบเทียบ/รายกิจกรรม).
- **Generated automatically** by `activityHub()` in `_internal/gen-hubs.mjs` for any cluster that has `activity*` articles — no manual file. Just run `node _internal/gen-hubs.mjs`.
- Layout (proven): **hero with bg image** (top article's heroImg + teal→coral overlay) → filter bar → **card grid** (16:10 image, role tag, blurb, meta: #items + read-time) → **2 selling bands**: 🎟️ Klook (orange, big button) + 🏨 hotels (3 real hotel mini-cards from `REVS[slug]` + "see all").

### C. Hero per-product pages — `type:"activity"` (SELECTIVE, never auto)
- Only for products that are **famous + real search volume + we add value**: e.g. `elephant-nature-park-<city>`, `phi-phi-island-tour-<city>`, a signature dive/show.
- Single-product deep page. Blocks: `p` → ONE rich `restaurant` card (gallery + quick-facts + ≥3-para review summary w/ pros/cons + bookHref) → `localtips` (4) → `experiences` (3 Klook) → `cta`; + `faq` + `related` + `rail`. Schema `TouristAttraction` (Review/AggregateRating ONLY with a real cited count).
- Target **1-3 hero pages per flagship province.** Never auto-generate the catalogue (scaled-content risk).

---

## Integration & UI patterns (proven — match exactly)

### City page (`city-<city>.html`) — "ทำอะไรดีใน<จังหวัด>" section (in `gen-hubs.mjs` provinceHub)
- Lists the **real activity articles as cards** (`dcardA`, sorted rank → compare → hero), max 6, via `actSection`.
- ONE centered primary pill **"ดูคู่มือกิจกรรมทั้งหมดใน<จังหวัด> (N) →"** → the activity hub.
- Then the **Klook booking banner** (`.klook`, orange brand, big button w/ `klook` wordmark badge) → `klook.com/th/search/?query=<NAME>&aid=121442`.
- Shows automatically for any cluster with `activity*` articles. (Falls back to `actCallout` if cards can't render.)

### Activity card big Klook button (ArticleLayout `.resto-book`)
- Below each card's pros/cons: a **full-width Klook button** (orange `#ff5b00` gradient, white `klook` wordmark badge, "จองกิจกรรมนี้บน Klook" + sub "เทียบราคา · ยืนยันที่นั่งทันที") + a "ดูที่พักใกล้ ๆ" button. Rendered when `bookHref` present (activities only). The small top-right book button was removed.

### Booking-site buttons (brand-accurate — site-wide, `gen-hubs.mjs` `aff` + roundup `btn-*`)
- **Agoda** `#FF2938` (white circle mark "a") · **Booking.com** `#003580` (white square "B.") · **Trip.com** `#287DFA` (white square "t"). Use these exact colors + `bk-mark`/`bkm` badges everywhere — never uniform navy.

### Readability (LOCKED)
- Highlight cards (`.hlc` "ที่ต้องไปให้ครบ"): **white bg + dark text** (`#475569`) + a **brand-color left accent bar** (teal/coral/mango cycling via nth-child). Never white text on light gradient (fails contrast).

---

## 🎟️ The per-province Klook checklist (do every province)
1. **Attribution:** confirm `aid=121442` tracks (owner's affiliate dashboard, one-time) — test 1 booking shows in reports.
2. **Survey Klook** for the province: which categories/products exist + are popular → decides the A2 compare set.
3. **Real data per product:** rating + source (Klook/TripAdvisor/GYG), price range (THB), real pros/cons. **Never invent.** Strip `rating`/`ratingSrc` if not a real number in (0,5]; transport cards carry no rating.
4. **Deep links:** every card → Klook **product URL + `?aid=121442`** (pull real product URL from dashboard; search-link `klook.com/th/search/?query=…&aid=121442` is the fallback until upgraded).
5. **Images:** Wikimedia **CC only** (Klook photos off-limits, 403 + copyright). 2-3 credited per card (`credit` "ภาพ: <artist> · <license>" + `creditHref` file page). Generic-but-relevant CC OK if labelled "(ภาพประกอบ)" in alt; never falsely claim the exact venue. **Verify every image URL returns 200** before build (throttle the check — Wikimedia 429s on parallel HEADs; retry with backoff).
6. **Hotel cross-sell:** every page → a real hotel roundup (rail + per-card `stayHref` "ที่พักทำเลดีใน<จังหวัด>" + `staycta`). `rail` = 3 real hotel roundups/reviews with R2 imgs that exist on disk.
7. **Internal linking:** city page → activity hub → roundup/compare/hero → hotel roundups (closed loop).
8. **Refresh:** show price ranges + "ตรวจล่าสุดบน Klook"; re-check flagship provinces each season.

---

## Build order per province
1. **A1 roundup** (anchor, via activity-ranking skill) → 2. **A2 compares** (4-6 highest-intent; inject selling blocks) → 3. **C hero** (1-2 famous) → 4. **regen** `node _internal/gen-hubs.mjs` (auto-builds B hub + city-page section) → 5. clean build + verify → 6. deploy → 7. upgrade Klook deep links from dashboard.

## Build / verify / deploy commands
```
# (Bash) Node at ~/nodejs
export PATH="$HOME/nodejs:$PATH"
node _internal/gen-hubs.mjs                       # regen hubs (B hub + city pages); auto-builds activities-<city>.html
rm -rf astro/node_modules/.astro && cd astro && npm run build   # CLEAN build (stale cache silently skips new articles)
npx wrangler whoami                               # MUST be chatmaliwan@gmail.com / 46cdce4b (not chatoccmed → wrangler logout)
npx wrangler deploy                               # reads astro/dist; KV TRIPS binding must attach (no "KV not found")
curl https://thailandaddict.com/top10-activities-<city>   # confirm live 200
```
Verify before deploy: every article JSON `JSON.parse` OK · no banned words · all image URLs 200 · ratings cite real sources · `bookHref` has `aid=121442` · big Klook button (`bk-klook`) + selling blocks present · activity hub lists all articles.

## Province rollout order (tourist-first)
Chiang Mai (pilot) ✅ → Phuket ✅ → **Krabi** (next) → Bangkok → Pattaya/Chonburi → Koh Samui → Chiang Rai → Kanchanaburi → Ayutthaya → Pai → Hua Hin → Koh Lipe/Phi Phi … then the rest. Do the ~15-20 tourist provinces first (high search + sellable activities + hotel roundups exist for the rail).

---

## Status per province
### Chiang Mai (pilot/gold) ✅
- A1 `top10-activities-chiang-mai` ✅ · A2 ✅ (`chiang-mai-elephant-sanctuaries`, `chiang-mai-cooking-classes`, `chiang-mai-doi-inthanon-tour-guide`, `chiang-mai-getting-around`, `chiang-mai-night-safari-worth-it`) · C ✅ (`elephant-nature-park-chiang-mai`) · B hub ✅ · city-page section ✅.
### Phuket ✅
- A1 `top10-activities-phuket` ✅ · A2 ✅ (`phuket-island-tours-compared`, `phuket-elephant-sanctuaries`, `phuket-cooking-classes`, `getting-around-phuket`, `phuket-fantasea-worth-it`) · C ✅ (`phi-phi-island-tour-phuket`) · B hub ✅ · city-page section ✅.
### All provinces
- Klook deep links = search-link fallback (⬜ upgrade to product URLs via dashboard when owner provides).

## Anti-patterns
- ❌ Reviewing a PLACE instead of a bookable product · ❌ inventing ratings/counts · ❌ lifting Klook photos · ❌ compare article without `experiences`+`staycta` selling blocks · ❌ white text on light gradient · ❌ skipping clean build (→404) · ❌ deploying from chatoccmed · ❌ overwriting the Chiang Mai/Phuket gold references.

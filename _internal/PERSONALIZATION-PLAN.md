# PERSONALIZATION & DEEP-TARGETING PLAN — thailandaddict.com

Homepage upgrade: search + trip planner + personalized Top-10 rails (hotels/attractions/food) + persona-based deep targeting. Static Astro on Cloudflare, **no login** — all personalization is client-side (`localStorage`), privacy-first.

Owner brief (2026-06-28): homepage must have (1) unified search ที่เที่ยว/ที่กิน/ที่พัก, (2) Trip Planner, (3) provinces, (4) Top-10 hotels by province, (5) Top-10 attractions by province, (6) Top-10 food by province — items #4–6 personalized by the visitor's history/interest, random fallback if none. (7) deep-targeting by persona.

---

## 1. PERSONA TAXONOMY (research-backed — TAT 2569 quality segments + Thairath 13 สาย + global segments)

Two tiers. **Tier-1 = travel-party / constraint** (primary "เที่ยวแบบไหน" filter — re-ranks ALL dimensions). **Tier-2 = interest / vibe** (multi-select facets, expandable).

### Tier-1 — เที่ยวแบบไหน (who / how you travel) — primary filter
| key | label | core need (drives attributes) |
|---|---|---|
| `solo` | เที่ยวคนเดียว | ปลอดภัยเดี่ยว · เดินทางสาธารณะง่าย · โฮสเทล/เจอเพื่อน |
| `couple` | คู่รัก / ฮันนีมูน | โรแมนติก · วิวพระอาทิตย์ตก · ส่วนตัว · ดินเนอร์ |
| `family-kids` | ครอบครัวมีเด็ก | สนามเด็กเล่น · ปลอดภัย · รถเข็นเด็ก · ใช้เวลาไม่นาน |
| `family-senior` | ครอบครัวผู้สูงอายุ | ทางราบ/ลิฟต์ · เดินน้อย · ที่นั่งพัก · ใกล้ที่จอด · รถเข็นได้ |
| `friends` | กลุ่มเพื่อน | กิจกรรมกลุ่ม · ราคาหารกันได้ · ที่เที่ยวกลางคืน |
| `budget` | เที่ยวประหยัด / แบ็คแพ็ค | ฟรี/ถูก · ของกินถูก · ที่พักงบน้อย · ขนส่งสาธารณะ |
| `workation` | ไปทำงาน / นักดิจิทัล | wifi+ปลั๊ก · คาเฟ่นั่งนาน · coworking · พักรายเดือน (DTV visa boom) |
| `luxury` | หรู / พรีเมียม | 5 ดาว · บริการเฉพาะตัว · ไฟน์ไดนิ่ง · สปา (TAT high-value) |

### Tier-2 — สไตล์ / ความสนใจ (what you're into) — facets, expandable
`mu` สายมู/ทำบุญ · `cafe` คาเฟ่/ถ่ายรูป · `nature` ธรรมชาติ/ผจญภัย · `culture` วัฒนธรรม/ประวัติศาสตร์ · `wellness` สุขภาพ/สปา/เวลเนส · `foodie` สายกิน · `sea` ทะเล/เกาะ · `festival` เทศกาล/คอนเสิร์ต/วิ่ง · `halal` ฮาลาล/มุสลิม-friendly · `lgbtq` LGBTQ+-friendly · `eco` สายเขียว/รักษ์โลก · `medical` การแพทย์/พักฟื้น

> **Market tie-in:** `halal` (ตลาด GCC/มาเลย์/อินโดฯ + i18n ar), `lgbtq` (ไทยเป็น top inclusive destination 2025), `wellness`/`medical` (ไทยผู้นำโลก, 61 รพ. JCI), `workation` (DTV visa) — เป็นทั้ง persona และตลาดภาษา ([[attraction-rollout-status]] i18n 9 ภาษา). Sources: TAT 2569 (6 กลุ่มศักยภาพสูง: Medical&Wellness, Luxury, Incentive, Sports, Sustainable, Gastronomy), Thairath "13 สายนักท่องเที่ยวไทย", TGM/Panorama 2025.

---

## 2. CONTENT ATTRIBUTE MATRIX (the "deep" data aggregators don't structure)

Add to schema per card/item: `personas[]` (Tier-1 scores), `vibes[]` (Tier-2), `attributes[]` (concrete facts below).

| attribute | applies | persona it serves |
|---|---|---|
| `free` / `cheap` | all | budget, friends |
| `flat-access` `lift` `short-walk` `seating` `near-parking` `wheelchair` | see, stay | family-senior |
| `playground` `kid-safe` `stroller` `short-visit` `clean-toilet` | see, eat | family-kids |
| `sunset` `romantic` `private` `fine-dining` | see, eat, stay | couple, luxury |
| `solo-safe` `social-hostel` `transit-easy` | all | solo, budget |
| `wifi-plug` `cafe-laptop` `coworking` `monthly-stay` | eat, stay | workation |
| `halal` `veg` `vegan` | eat | halal, eco |
| `nightlife` `group-activity` | see | friends |
| `spa` `onsen` `detox` | see, stay | wellness, medical |

**Tagging method (Phase 2):** one-time LLM agent pass over all content; score personas/vibes/attributes from price, activity type, physical difficulty, facilities. Attraction cards ALREADY carry `bestFor` + `tags` → seed from those first (free signal).

---

## 3. DATA SOURCES (what exists today)

- **Search** → `astro/public/search-index.json` (6,326 rows = `[title, href, dim, province]`; dims: see 1058, eat 1112, stay 2245, plan 1086, guide 455, rank 272, city 98). Ready for the 3-tab search now.
- **Attractions Top-10 (see)** → `articles/top10-attractions-<city>.json` (96). Cards have rank/name/area/libImg/rating/ratingCount/bestFor/tags. CLEANEST source.
- **Hotels Top-10 (stay)** → `roundups/` collection (272 themed roundups, `entries[]`, `heroImg`/`image`; province from slug suffix). Individual reviews in `reviews/` (2,212).
- **Food (eat)** → 1,112 eat articles (guide-style, not strictly ranked). Phase 1 food rail = featured eat articles per province from search-index; Phase 2 = derive ranked top-eats.

---

## 4. HOMEPAGE IA (keep current Vibrant Island Pop design)

1. Hero + unified search (3 tabs: ที่เที่ยว/ที่กิน/ที่พัก) + persona quick-pick chips (Tier-1)
2. Trip Planner entry ("วางแผนทริปใน 3 นาที" → province + days + persona → day-by-day from tagged items; build on existing `/trip` + KV `TRIPS`)
3. Top-10 โรงแรม — personalized rail
4. Top-10 ที่เที่ยว — personalized rail
5. Top-10 ที่กิน — personalized rail
6. Browse by province (map/grid) + Browse by persona ("เที่ยวแบบไหน" → persona hubs)
7. Editorial / seasonal

### Personalization logic (client-side, no PII)
`localStorage` keys: `ta_persona` (chosen Tier-1), `ta_seen` (`[{slug,province,dim,ts}]`, logged on every article view), `ta_fav`.
Rail province selection: **history (most-viewed provinces) → else chosen persona's featured province → else random featured (deterministic per day, no layout shift)**. Persona/vibe chips filter+re-rank rails instantly from tags in `home-index.json`.

---

## 5. PERSONA HUB PAGES = SEO MOAT (Phase 3)

Generate `/family-<province>`, `/honeymoon-<province>`, `/solo-<province>`, `/workation-<province>`, `/halal-<province>` … capturing high-intent low-competition Thai long-tail ("ที่เที่ยวเด็กเชียงใหม่", "คาเฟ่นั่งทำงานอารีย์"). Matrix 77 provinces × ~8 personas × 3 dims — generate only where tagged content supports. Add season layer (persona × province × ฤดู/เทศกาล) for unique depth.

---

## 6. PHASING

- **Phase 1** (uses existing data, no design change): `home-index.json` generator → personalized Top-10 rails (random fallback) + 3-tab search + Trip Planner entry. Build into a preview page first, then wire to live `index.html`.
- **Phase 2**: LLM tagging pass (personas/vibes/attributes) → persona/vibe filter chips on rails + roundup pages.
- **Phase 3**: persona hub pages (SEO) + persona-aware planner + seasonal layer.

## 7. FILES (to build)
- `_internal/gen-home-index.mjs` → `astro/public/data/home-index.json` (per-province × dim top items + seed tags). [Phase 1 — STARTED]
- homepage modules (search tabs, rails, planner CTA, persona chips) — preview first.
- `_internal/gen-persona-hubs.mjs` (Phase 3).

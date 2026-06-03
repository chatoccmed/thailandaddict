---
name: tourlogy-city-roundup-checklist
description: Master checklist + prioritization framework for hotel-roundup articles every city on Tourlogy/Wherebest should have. Use when planning hotel roundup pages for any city — new city expansion (Tokyo, Paris, Seoul, NYC), filling gaps in an existing city, or auditing whether a city's accommodation cluster is complete. Provides the 26 article types, city-tier × article-tier build matrix, per-city signature mapping pattern, keyword/cannibalization/refresh best practices, and ROI validation. Wherebest is a global travel site — this skill assumes a worldwide audience, not a single-country market. Pair with `tourlogy-city-content` skill (which covers content-cluster model, hotel selection method, ranking, writing style). Detailed standards are in `references/` (writing-standards · verification · image-sourcing · eeat-standards · seo-aeo) — read them when needed. TRIGGER on phrases like: "เขียนรีวิวอันดับโรงแรมตาม skill", "ทำ roundup โรงแรม [เมือง]", "เขียนบทความจัดอันดับโรงแรม [เมือง]", "เพิ่ม roundup ที่ขาดของ [เมือง]", "วางแผน hotel roundup", "ขยาย hotel cluster", "audit [เมือง] hotel coverage", "เริ่มเมืองใหม่ [city]", "[city] · ทำ roundup ที่ขาด", "write hotel ranking articles per skill", "build hotel roundups for [city]". Owner may abbreviate to "ทำตาม skill โรงแรม" — still trigger.
---

# Tourlogy — City Hotel-Roundup Checklist & Prioritization Framework

The owner's canonical list of hotel-roundup article types every city should aim for, plus the framework for deciding **which to build, in what order, for which cities**. Wherebest targets a global traveller audience; everything here is language-agnostic.

This SKILL.md is the **overview + navigation hub**. Detailed standards live in `references/` files — read them when you need depth.

## วิธีเรียกใช้ Skill นี้ (Invocation Patterns)

### Auto-trigger — พิมพ์คำเหล่านี้ skill จะทำงานเอง

**คำสั่งหลัก (สั้น · ใช้ได้เลย):**
- `เขียนรีวิวอันดับโรงแรมตาม skill ที่กำหนดไว้`
- `ทำตาม skill โรงแรม` — สั้นที่สุด · skill จะถาม "เมืองไหน" ก่อนถ้ายังไม่ระบุ
- `[เมือง] · ทำ roundup ที่ขาด` — เช่น `Tokyo · ทำ roundup ที่ขาด`
- `เขียนบทความจัดอันดับโรงแรม[เมือง]ตามแผน`

**คำสั่งระบุงาน:**
- `วางแผน hotel roundups สำหรับ [เมือง]` — planning only, ไม่ dispatch agents ทันที
- `ขยาย hotel cluster ของ [เมือง]` — gap-fill
- `เริ่มเมืองใหม่ [เมือง]` — greenfield
- `audit [เมือง] hotel coverage` — ตรวจว่าขาด roundup อะไร
- `[เมือง] Tier อะไร · ควรมีกี่ roundup` — สอบถาม priority อย่างเดียว

**Combo (full auto · skill + agents + commit):**
- `ทำ [เมือง] Phase B: roundup ที่ขาดทั้งหมดตาม priority framework`

### Explicit invoke

- `/skill tourlogy-city-roundup-checklist [เมือง]`
- `ใช้ skill tourlogy-city-roundup-checklist กับ [เมือง]`

### Workflow when triggered

1. **Read this skill** (overview · 26 categories · framework)
2. **Read relevant references/** files based on what you'll do (almost always: writing-standards · verification · image-sourcing for any build task)
3. **Score the target city** ตาม Build Prioritization Framework Step 1 (ใช้ OTA hotel supply ไม่ใช่ Wherebest review count) → ได้ Tier S/A/B/C
4. **Inventory check** ปัจจุบันมี roundup อะไรอยู่แล้ว: `ls astro/src/content/roundups/ | grep -i [city]`
5. **Apply Build Matrix** (Framework Step 3) → list roundups ที่ควรทำ
6. **Identify gap** = ควรทำ minus มีอยู่แล้ว
7. **Per missing roundup — quick OTA scan** to confirm ≥5 (Top 5) or ≥10 (Top 10) hotels at score 8.0+ that fit. Most pass for Tier S/A cities.
8. **Filter ด้วย Decision Question** (5 yes/no) → คัดเฉพาะ GO
9. **Confirm with owner** ถ้างานใหญ่ (≥5 roundups) — แสดงแผนก่อน dispatch
10. **Dispatch agents** ผ่าน `tourlogy-roundup-builder` (1 agent ต่อ roundup, parallel). Each agent does its own OTA research + applies all standards in `references/`. Existing review pages are linked when they happen to exist.
11. **Quality audit** ด้วย `tourlogy-quality-auditor` — checks all standards in references/
12. **Commit + push** เป็น batch · รายงานสรุป

**Note:** Wherebest review pages are a *separate, parallel workstream* (`tourlogy-hotel-reviewer`). Roundups ship and earn affiliate revenue immediately; reviews deepen SEO over time.

---

## 🔑 CRITICAL — Research-driven selection (read first)

**Hotel selection for every roundup is researched FRESH from Booking / Agoda / Trip.com — not pulled from our existing review inventory.**

```
For each planned roundup:
  → search OTAs for the topic
  → pull candidate pool (15–30 hotels with most guest reviews)
  → apply 8.0+ score cutoff
  → rank by merit (score · reviews · standout · brand)
  → write the roundup with affiliate CTAs per hotel
  → IF we have a Wherebest review page, add "อ่านรีวิวฉบับเต็ม" button
  → IF not, OTA CTAs alone are enough — roundup ships
```

**Implications:**
- **Review inventory does NOT cap roundups.** A city with 0 reviews can get 26 roundups — every card researches its own data.
- **Review pages are SEO/trust enhancement, not prerequisite.**
- **OTA candidate pool is the actual cap.** Tokyo "Top 10 luxury" has 50+ qualifiers; Lukang "Top 10 luxury" has 0.
- **Affiliate revenue captured at click-time regardless of review status.**

All scoring, GO/SKIP checks, and tier thresholds below refer to **OTA candidate pools**.

---

## 📋 Mandatory Standards (ทุก roundup ต้องผ่านครบ · v2 updated 28 พ.ค. 2026)

ทุก roundup ต้องผ่าน 5 มาตรฐานก่อน publish · รายละเอียดเต็มใน `references/` files:

| Standard | What (v2 changes flagged) | Detail file |
|---|---|---|
| **1. Writing** | 4 rules: friend-tone · scene-led titles · per-context unique descriptions · anti-AI human voice. **v2:** word limit 80-150/hotel · honesty rule (no fake "I went") · transliteration ban (use English "Luxury" not "ลักชัวรี่") · 1 tip max (no Pro-tip lists) · 1 cite per hotel (no credential stacking) | [`references/writing-standards.md`](./references/writing-standards.md) |
| **2. Hotel Verification** | 8-step per-hotel checklist + per-category criteria + audit trail JSON + 8 hard exclusion rules. **v2:** verification trail kept internal in JSON only · not displayed in box on page | [`references/verification.md`](./references/verification.md) |
| **3. Image Sourcing** | Trip.com first → official hotel site fallback · self-host · 5-step verify · no Wikipedia/stock for cards | [`references/image-sourcing.md`](./references/image-sourcing.md) |
| **4. EEAT Signals** | Doctor Chat byline + Person JSON-LD. **v2:** editorial intro framing (NO "ผมไป" fabrication) · removed "How we picked / Affiliate disclosure" prominent box · soft closing heading ("เลือก X ยังไงให้ตรงกับตัวเอง?" not "Doctor Chat แนะนำ") | [`references/eeat-standards.md`](./references/eeat-standards.md) |
| **5. SEO + AEO Structure** | P4 Direct-Answer block · Q-form headers · FAQ schema · entity richness · llms.txt. **v2:** comparison table BOTTOM only (removed top placement) · REMOVED "Head-to-head insights / comparison sentences" section | [`references/seo-aeo.md`](./references/seo-aeo.md) |

**🎯 Reference for tone (must match):** `https://wherebest.com/top10-hotels-taipei` — นี่คือมาตรฐาน tone ที่เว็บใช้ · ทุก v2 roundup ต้อง feel เหมือนนี้

**Auditor enforcement:** `tourlogy-quality-auditor` agent reads all 5 reference files and checks every roundup against them. Failures = rewrite required before publish.

---

## The 26 roundup article types

### A. Anchor + transit + landmark (1–5)
1. **Top 10 popular hotels in [city]** — anchor, every city
2. **Top 10 hotels near main train/HSR station** — luggage-convenience
3. **Top 10 hotels near airport** — pre-flight, layovers
4. **Top 10 hotels near main shopping district** — city-specific (Ginza · Myeongdong · Soho)
5. **Top 10 hotels near [city's signature landmark]** — Eiffel · Taipei 101 · Kiyomizu-dera

### B. Audience / traveller-type (6–11)
6. **Top 10 hotels for couples** — romantic / honeymoon
7. **Top 10 hotels for family 3–4** — family room capacity
8. **Top 10 hotels for family with young kids** — baby cot, kids' pool (distinct from #7)
9. **Top 10 budget hotels** — backpacker / hostel
10. **Top 10 hotels for solo travellers** — single rooms · social spaces · safety
11. **Top 10 hotels for women travelling solo** — well-lit area · 24hr reception · female-only floors

### C. Purpose / tier / signature (12–14)
12. **Top 10 hotels for business travellers** — work desk · fast Wi-Fi · meeting rooms
13. **Top 10 luxury hotels** — 5★ tier (Aman · Ritz · Bulgari · Four Seasons)
14. **Top 10 signature hotels** — city DNA (Mt Fuji view · in-room onsen · ryokan · overwater bungalow · ski-in/out)

### D. Accessibility / niche audience (15–16)
15. **Top 5 accessible hotels** — wheelchair · roll-in shower (Top 5 because inventory rarer)
16. **Top 10 hotels for older travellers** — elevator · ground floor · near hospital · gentle walks

### E. Design / freshness / authority (17–19)
17. **Top 10 design hotels** — boutique · architect-named · Wallpaper-style
18. **Top 10 newly opened hotels** — past 12–18 months (REQUIRES quarterly refresh)
19. **Top 10 highest-rated hotels (cross-platform)** — TripAdvisor + Booking + Agoda consensus

### F. Long-tail / niche expansion (20)
20. **At least 3–5 long-tail / niche articles per city** — research-driven (e.g. "hotels near Universal Studios" · "hotels with Disney shuttle" · "hotels open during typhoon season")

### G. Modern stay-types (21–25)
21. **Top 10 long-stay / workation hotels** — monthly rate · kitchenette · workspace
22. **Top 10 pet-friendly hotels** — explicit pet policy · weight limits · pet menu
23. **Top 10 Muslim-friendly / Halal hotels** — qibla · prayer room · halal breakfast
24. **Top 5–10 ryokan / B&B / local homestay** — for cultural cities (distinct from #17)
25. **Top 10 hotels with breakfast included** — high-intent value query

### H. Decision / comparison content (26)
26. **Comparison & decision articles** — top-of-funnel research queries:
    - "[City] luxury vs design hotels — which to pick?"
    - "[City] downtown vs near-airport — pros and cons"
    - "[City] first-time visitor — one pick"
    - "[Hotel A] vs [Hotel B] — head-to-head"

---

## Scaling rules — adjust top-N by city size

| City size | Recommendation |
|---|---|
| Major global capital (>5,000 OTA hotels: Tokyo, Bangkok, Paris, NYC) | All **26 articles** at Top 10 each |
| Mid-size (1,000–5,000 OTA hotels: Kyoto, Sapporo, Edinburgh, Porto) | **12–18 articles** most relevant; Top 10 where pool allows, Top 7 elsewhere |
| Small city (300–1,000 OTA hotels: Lukang, Penghu, Bruges, Reykjavik centre) | **5–9 articles** most relevant; Top 5–7; skip thin-inventory categories |
| Niche (<300 OTA hotels: Orchid Island, Faroe Islands, remote villages) | **Anchor + 2–3 DNA-relevant** only (e.g. diving B&B, beachfront, lighthouse stay) |

**Hard rule:** every category needs ≥ N hotels in OTA pool to be a credible Top-N. Don't fake a Top 10 from 6 weak candidates — make it Top 6 honestly, or skip.

---

## Per-city Signature mapping pattern (#14 guide)

Article #14 demands a city-specific DNA. Don't let agent guess — explicitly map each city's signature before writing:

| Question | Output → article angle |
|---|---|
| What ONE view/scene is THE city's iconic photograph? | Hotels framing that view (Mt Fuji · Eiffel · Burj Khalifa · Sydney Opera) |
| What ONE accommodation TYPE is the city famous for? | Build around it (ryokan · machiya · castle · trulli · cave-house · overwater) |
| What ONE in-room amenity is uniquely possible here? | Hotels offering it (onsen · plunge pool · stargazing dome · ski locker · butler) |
| What ONE local experience does only an on-site stay unlock? | Hotels providing it (private temple visit · early Vatican entry · safari at dawn) |

### Example signature mapping (current project cities)

| City | Signature |
|---|---|
| **Tokyo** | View of Tokyo Skytree at night / Park Hyatt skyline-bar suites |
| **Kyoto** | Ryokan with private onsen + kaiseki dinner; or machiya townhouse stay |
| **Osaka** | Dotonbori canal-view room; Universal Studios partner hotels |
| **Sapporo** | Onsen-in-room with snow view; Susukino entertainment-district stays |
| **Nagoya** | Hotels with Nagoya Castle view; airport-adjacent transit hubs |
| **Fukuoka** | Hakata Yatai-street-view rooms; Hawks Town integrated resort |
| **Okinawa** | Beachfront villa with private pool; Ryukyu-style heritage stays |
| **Taipei** | Hotels with Taipei 101 fireworks view (NYE-specific too); Beitou onsen rooms |
| **Hakone** (future) | Mt Fuji view + private rotenburo; ryokan with kaiseki |

**For any new city**: spend 15 min on `tourlogy-quality-auditor` recon to identify the signature before dispatching `tourlogy-roundup-builder` for #14.

---

## Build Prioritization Framework

The full skill list (26 articles) × every city (50+) is impossible all at once. Use this 4-layer framework.

### Step 1 — Score the city (City Tier S/A/B/C)

| Factor | Weight | Scoring |
|---|---|---|
| **OTA hotel supply** (Booking + Agoda + Trip count for the city) | 25 pts | >5,000 = 25 · 1,000–5,000 = 20 · 300–1,000 = 12 · 50–300 = 6 · <50 = 2 |
| **Tourist traffic (global)** | 25 pts | Top (Tokyo/Paris/NYC) = 25 · Mid (Sapporo/Porto) = 15 · Niche = 5 |
| **Search volume "[city] hotel"** | 20 pts | >100K/mo = 20 · 10K–100K = 12 · 1K–10K = 6 · <1K = 2 |
| **Owner strategic priority** | 15 pts | Current focus = 15 · Next pipeline = 10 · Other = 5 |
| **Affiliate $ per click potential** | 15 pts | Luxury-heavy = 15 · Mid = 10 · Budget-heavy = 5 |

| City Tier | Score | Articles target | Articles count |
|---|---|---|---|
| **S** | 85–100 | All 26 articles | ~26+ |
| **A** | 65–84 | Tier 1+2+3 | 13–18 |
| **B** | 45–64 | Tier 1+2 | 7–9 |
| **C** | 25–44 | Tier 1 only | 4–6 |

### Step 2 — Group articles into 4 tiers

Thresholds refer to **OTA candidate pool per category**.

**Article Tier 1 — Always build (4 anchors):**
- #1 Popular · #2 Near station OR #3 Near airport (dominant transit) · #9 Budget · #14 Signature

**Article Tier 2 — Build if OTA pool has mid-tier supply (+5 → 9 total):**
- #5 Near landmark · #6 Couples · #7 Family 3–4 OR #8 Family-kids · #13 Luxury · #25 Breakfast

**Article Tier 3 — Build if OTA pool deep (+8 → 17 total):**
- #4 Near shopping · #10 Solo · #12 Business · #17 Design · #18 Newly opened · #19 Cross-platform highest · #21 Long-stay · #22 Pet-friendly

**Article Tier 4 — Reserve for City Tier S only (+9 → 26+ total):**
- #11 Women solo · #15 Accessibility · #16 Older travellers · #20 Long-tail × 3–5 · #23 Halal · #24 Ryokan/B&B (promote to Tier 2 for cultural cities) · #26 Decision × 2–3

### Step 3 — Apply Build Matrix

```
                       City S    City A    City B    City C
Article Tier 1     →  ✅ build  ✅ build  ✅ build  ✅ build
Article Tier 2     →  ✅ build  ✅ build  ✅ build  ❌ skip
Article Tier 3     →  ✅ build  ✅ build  ❌ skip   ❌ skip
Article Tier 4     →  ✅ build  ❌ skip   ❌ skip   ❌ skip
```

### Step 4 — ROI validation after 3 months

```
ROI = (Monthly Traffic × CTR × Booking Conv × Avg Commission) / Build Hours
```

Track per-roundup in analytics:
- **Top 20%** by ROI → double down · expand similar · link aggressively
- **Bottom 20%** → kill or rewrite radically
- **Mid 60%** → leave · refresh on cadence

---

## Best Practices (avoid common failure modes)

### B1. Keyword validation BEFORE building

For every planned roundup, check search volume (Ahrefs / SEMrush / Google Keyword Planner) for the primary query in target languages. If combined SV <100/month and no growth trend, **skip or merge**.

### B2. Cannibalization avoidance

Two roundups in same city must not target same primary keyword. Risk pairs to watch:

| Pair | Mitigation |
|---|---|
| #2 Near station + #5 Near landmark | If landmark IS station (Tokyo Station, Shibuya), skip one |
| #4 Near shopping + #5 Near landmark | Frame #4 by use case ("for shopping trips") vs #5 ("for sightseeing") |
| #6 Couples + #14 Signature romantic | #6 = "couples on a budget too" vs #14 = "iconic romantic experience" |
| #9 Budget + #10 Solo | #10 = "single rooms / safe solo + workspace" |
| #13 Luxury + #17 Design + #14 Signature | Pick primary intent: luxury (price) vs design (aesthetic) vs signature (experience) |
| #7 Family 3-4 + #8 Family-kids | #7 = "teenagers, larger rooms" vs #8 = "babies/toddlers, baby gear" |

**Rule:** before publishing X, search for hotels also fitting Y. If overlap >60%, redesign or kill one.

### B3. Title diversity formula

Avoid template trap "Top 10 [type] hotels in [city]" — see [`references/writing-standards.md`](./references/writing-standards.md) Rule 2 for full pattern library.

### B4. Refresh cadence (under-rated · kills SEO if ignored)

| Article type | Refresh every | Effort |
|---|---|---|
| #18 Newly opened | Quarterly | 30 min |
| #1 Popular + #19 Highest-rated | 6 months | 1 hr (re-score · re-rank) |
| #2/#3/#4/#5 Location-based | Annually | 30 min |
| #6–#12 Audience-based | Annually | 30 min |
| #13–#17 Tier/style | 18 months | 1 hr |
| #21–#25 Modern stay-types | Annually | 30 min |
| #15 Accessibility | Annually | 30 min |
| #26 Decision | When source pages change | varies |

Annual refresh cost per City Tier S: ~15–20 hours. **If you don't refresh:** Google decays freshness signal → ranking drops → traffic decline.

### B5. Source-of-truth pattern

Each hotel = ONE canonical JSON file with current data. Roundups reference by ID, don't copy data. When hotel updates, change one file, all roundups update.

### B6. Cross-platform proof

Don't use TripAdvisor alone. Use TripAdvisor + Booking + Agoda + Trip consensus. Quote cross-platform proof in title: "8,000+ reviews averaging 9.4 across Booking + Agoda + Trip".

---

## Decision question: GO or SKIP a planned roundup?

Answer 5 yes/no. Build only if ≥4 yes:

1. Does **OTA search (Booking + Agoda + Trip)** for this topic in this city return ≥5 hotels with score ≥8.0 that genuinely fit?
2. Combined search volume ≥100/month in target languages?
3. Low cannibalization risk vs existing roundups?
4. Build effort ≤2 hours (with agent team)?
5. Searcher has booking intent (not just research)?

If 2–3 yes → consider merging with related roundup.
If ≤2 yes → skip.

The ≥5-hotel check is against **OTA pool**, not Wherebest's review inventory. For major cities, almost every category passes.

---

## Anti-patterns to avoid

- ❌ "Build all 26 for every city equally" — wastes resource on Tier C cities
- ❌ "Build whatever I think of next" — no ranking, low-ROI articles
- ❌ "Skip refresh — once it's live we're done" — Google freshness decays
- ❌ "#18 Newly opened, build once and forget" — within 12 months says "newly opened (from a year ago)"
- ❌ "Trust TripAdvisor #1 alone" — platform bias; cross-validate
- ❌ "Don't track per-roundup analytics" — can't kill underperformers
- ❌ "Brand-tone localisation for Thai market only" — Wherebest is global; design multi-language from start
- ❌ "We can't build that roundup, we haven't reviewed those hotels yet" — wrong mental model. Roundup research is OTA-driven; review pages are parallel workstream.
- ❌ "Quick-pick from Booking top 10 without per-hotel verification" — verification is non-negotiable (see [`references/verification.md`](./references/verification.md)). Bad recommendation = real harm to real traveller = trust collapse.

---

## Integration with other skills & resources

This skill is the **what + when + how-much**. For the **how to actually write each**:

- **Hotel selection methodology** (research → score-cutoff → mix → rank-by-merit): `tourlogy-city-content` skill Part 2
- **Pricing method**: `tourlogy-city-content` skill Part 3
- **Image / link handling deep dive**: `tourlogy-city-content` skill Part 4
- **Title writing (scene-led)**: `tourlogy-city-content` skill Part 6
- **Tone patterns full library**: `_internal/WRITING-STYLE.md`
- **Image sourcing deep workflow + scripts**: `_internal/HOTEL-IMAGE-POLICY.md`
- **Agent workflow** (spawn reviewer → roundup-builder → quality-auditor): `tourlogy-city-content` skill Part 7

## Quick audit: what does a city already have?

```bash
ls astro/src/content/roundups/ | grep -i "{city-slug}"
ls astro/public/ | grep -E "^(top|{city-slug}|{city-slug}-)"
```

Compare existing vs the 26-item checklist + apply the build matrix. The gap (filtered by city tier) is your prioritised work order.

---

## References — deep standards (read when needed)

| File | Read when |
|---|---|
| [`references/writing-standards.md`](./references/writing-standards.md) | Writing any roundup content (R1 friend-tone · R2 titles · R3 unique descriptions · R4 anti-AI markers/tells · auditor checks) |
| [`references/verification.md`](./references/verification.md) | Selecting hotels for any roundup (8-step checklist · per-category criteria · audit trail · hard exclusions) |
| [`references/image-sourcing.md`](./references/image-sourcing.md) | Sourcing images for hotels (Trip first → official fallback · 5-step verify · file organization) |
| [`references/eeat-standards.md`](./references/eeat-standards.md) | Adding author byline · trust markers · Person schema · Doctor Chat voice intro/closing |
| [`references/seo-aeo.md`](./references/seo-aeo.md) | Structuring article for Featured Snippet + AI engines (P2 comparison table · P4 direct-answer block · FAQ schema · llms.txt · schema markup) |

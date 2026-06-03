---
name: tourlogy-city-content
description: Use when creating or planning travel content for any city on the Tourlogy website (tourlogy.com) — building a city's full article cluster, producing hotel reviews or "Top N" accommodation roundups, or adding food / attraction / activity / airline content for a city. Covers the city content-cluster model (what every city needs and why), the hotel selection & ranking methodology, the room-pricing method, review-writing standards, and the file/structure conventions.
---

# Tourlogy — City Content & Hotel Review Skill

The repeatable method for building world-class travel content for any city on Tourlogy. Goal: a site genuinely useful to travellers that ranks well and earns affiliate revenue.

## Part 1 — The City Content Cluster model

Treat **1 city = 1 content cluster**: a city hub page surrounded by dozens of child pages covering every traveller search-intent, all cross-linked. A complete city ≈ **120–200 pages**. Dimensions a city must cover:

1. **Accommodation** (core revenue) — roundups by area, by star tier, by traveller type, and by special intent (near a landmark, near the airport, hot-spring, etc.); + individual hotel reviews; + a daily house/villa-rental roundup; + 2–3 Airbnb roundups.
2. **Food** — night markets, must-eat dishes, cuisine roundups, cafés, street-food guides.
3. **Attractions & day trips** — individual attraction deep-dives + day-trip guides.
4. **Itineraries** — 1 / 2 / 3 / 4 / 5-day plans, budget breakdown.
5. **Practical** — airport transfer, city transit, neighbourhood guides, best time to visit, first-timer guide.
6. **Traveller segments & seasonal** — family / couples / solo / budget / luxury; seasonal pages.
7. **Activities / tours / tickets** — curated products from Klook / KKday / Trip (one review per meaningful product; a comparison review when 3+ similar products exist). Curate the ~30–40 products travellers actually search/buy — do NOT make a page for every SKU.
8. **Airlines serving the city** — individual airline reviews + a comparison.

Why: covering every dimension and interlinking it builds topical authority for Google and multiplies affiliate entry points. Each child page must link up to the city hub and sideways to related pages (hotels ↔ food ↔ attractions).

## Part 2 — Hotel selection methodology (any "Top N" accommodation roundup)

1. Research the most-reviewed hotels on Booking / Agoda / Trip.com — build a candidate pool of the 15–30 hotels with the most guest reviews (for a themed roundup, scope the pool to the theme, e.g. hotels around a station).
2. Drop any hotel scoring below 8.0.
3. Use star tier to ensure a good MIX — roughly 5★ ×2, 4★ ×3, 3★ ×3–4, below-3★ ×1–2 (flex to what the city actually has).
4. **Rank by merit, not strict star order** — score + review volume + standout factors. A heavily-reviewed lower-star hotel can outrank a higher-star one (e.g. a 3★ with 10,000 reviews beats a 5★ with 4,000).
5. Bonus consideration elevates a genuinely outstanding hotel (best onsen in the city, closest to the station, etc.).

## Part 3 — Room-pricing method

Prices change constantly — never quote a single point-in-time peak price.
- Find the STANDARD room price; don't take the price from one search (it may land on a holiday/peak).
- If no reliable current price, check prices across several months / historical to get the standard room's min–max range.
- Present the LOWEST price as "from approx. NT$X" AND state the range, e.g. "from NT$2,400 · typically NT$2,400–4,200 by season".

## Part 4 — Review production standards

- Research, select and write straight through — no approval gate; point-in-time review data is accepted.
- Review body (description, pros/cons, guest quotes): summarise from real guest reviews on Booking/Agoda/Trip plus hotel facts — per the site's editorial policy ("compiled from real guest reviews", never claim the team stayed there).
- Images (self-hosted, never hotlink a CDN): source the real photo from Trip.com first; else Agoda or Booking; else the hotel's own website/online channels. Download into `astro/public/images/hotels/`.
- Booking links: find the direct hotel-detail URL on each of Agoda/Booking/Trip, add affiliate IDs, verify the link lands on the actual hotel page.
- Language: produce Thai and English together, in parallel, item by item.
- Titles: every title must earn the click — see Part 6.

## Part 5 — File & structure conventions

- Hotel review = a JSON file in `astro/src/content/reviews/` (Thai) + `astro/src/content/reviews-en/` (English); schema in `astro/src/content.config.ts`; rendered by `astro/src/layouts/ReviewLayout.astro`.
- Roundup ("Top N") = a JSON file in `astro/src/content/roundups/` + `roundups-en/`; rendered by `RoundupLayout.astro`.
- One hotel is reviewed ONCE even if it appears in several roundups — every roundup links to the same review page.
- One-off pages (food / attractions / itineraries / practical) = HTML in `astro/public/` (Thai) + `astro/public/en/` (English). EN pages use root-absolute `/images/...` paths and carry the 5-language nav switcher.
- Every page: clean URL (no .html), full SEO meta + JSON-LD per `CLAUDE.md`, interlinked into the city cluster.
- Affiliate IDs: Agoda `cid=1965862` · Trip.com `Allianceid=6861268&SID=312384787` · Klook `aid=121442` · Booking — none yet.
- Build test only works outside Google Drive (use `C:\Users\MacbookPro\tl-astro-build`); deploy by `git push` (Cloudflare auto-builds).
- After finishing work, update the relevant `_internal/` checklist (e.g. `TAIPEI-CONTENT-PLAN.md`).

## Part 6 — Title craft (every title must earn the click)

A title is a promise + a hook. Flat titles ("โรงแรมไทเปยอดนิยม 2026 — 10 อันดับ") kill traffic. Every title — roundup, individual-review h1, food/attraction article — must do at least TWO of:
- **Paint a scene / sensory hook** — let the reader picture the experience.
- **Promise a clear benefit / outcome** — what they get out of reading.
- **Be specific** — a number, a place, a concrete detail.
- **Spark curiosity** — a question, a mild tension ("นอนที่ไหนดี?").
- **Have voice** — warm and confident, like a friend who has been there; words like ฟิน · ตัวจริง · ห้ามพลาด · บอกต่อ · คุ้มสุด · ลงตัว · เดินปุ๊บถึงปั๊บ.

Avoid: the bare pattern "[หมวด] + เมือง + ปี", the word "ยอดนิยม" standing alone, and listicle clichés with no hook.

Before → after:
- ❌ "โรงแรมไทเปยอดนิยม 2026 — 10 อันดับที่นักท่องเที่ยวจองมากที่สุด"
  ✅ "นอนที่ไหนดีในไทเป? 10 โรงแรมที่รีวิวจริงนับหมื่นบอกต่อ — อัปเดต 2026"
- ❌ "8 โรงแรมน้ำพุร้อนเป่ยโถวที่ดีที่สุด"
  ✅ "แช่น้ำแร่อุ่นๆ ในห้องส่วนตัว — 8 ออนเซนโฮเทลเป่ยโถวที่ฟินที่สุด"
- ❌ "โรงแรมใกล้สถานีไทเปหลัก — เดินทางสะดวก"
  ✅ "ลากกระเป๋าออกจากสถานี เดินไม่ถึง 5 นาทีก็ถึงห้อง — 10 โรงแรมรอบไทเปหลัก"
- ❌ "ตลาดกลางคืนไทเป — คู่มือฉบับสมบูรณ์"
  ✅ "ตามกลิ่นไปกินทั้งคืน — คู่มือไนต์มาร์เก็ตไทเปฉบับนักกินตัวจริง"

The English title is crafted natively in the same spirit — not a literal translation of the Thai.

## Workflow for a new roundup

1. Select hotels (Part 2). 2. Per hotel: research data/reviews/price/images/links (Parts 3–4), write TH+EN review JSON. 3. Build the roundup JSON (TH+EN), rank by merit. 4. Build-test, push, verify live, report links.

## Part 7 — The agent team (parallelise production, keep quality high)

Five specialist agents in `.claude/agents/` build the cluster — spawn them in parallel; the orchestrator (main session) does the build/git/deploy and never delegates that.
- **tourlogy-hotel-reviewer** — one hotel → its TH+EN review JSON (research, image, links).
- **tourlogy-roundup-builder** — assembles a "Top N" roundup JSON (TH+EN) from already-reviewed hotels; ranks by merit, builds the compare table + FAQ.
- **tourlogy-attraction-writer** — attraction deep-dives, attractions roundups, day trips, itineraries → TH+EN HTML pages.
- **tourlogy-food-writer** — night markets, must-eat dishes, cuisine roundups, cafés → TH+EN HTML pages.
- **tourlogy-quality-auditor** — audits a finished page against the SEO + content standards before deploy; fixes clear-cut issues, flags the rest.

Roundup flow with the team: spawn N `tourlogy-hotel-reviewer` agents (one per hotel, parallel) → `tourlogy-roundup-builder` assembles the roundup → `tourlogy-quality-auditor` audits each page → orchestrator build-tests, pushes, verifies live. If a custom agent type is not registered in the session, fall back to a `general-purpose` agent with that agent file's spec pasted inline.

**Model policy (cost/quality balance):** all five agents run on **Sonnet** — the research-and-write-to-template work is near-identical quality on Sonnet. When spawning a `general-purpose` fallback subagent, always pass the Agent tool's `model: "sonnet"` parameter. Reserve **Opus** for the orchestrator only (the layer that does hotel selection, merit-ranking, cross-agent dedup checks, the 8.0 cutoff, build/deploy). A 200K context window is ample for the orchestrator — the architecture keeps its working set small (subagents hold the heavy content; the plan/dashboard/CLAUDE.md are external memory on disk). The quality-auditor pass is what guards quality, not the orchestrator's model size.

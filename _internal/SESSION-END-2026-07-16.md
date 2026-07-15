# Session record — 2026-07-16 · Island/beach new-zone build-out

**Theme:** filled the biggest "famous zone with ~zero reviews" gaps by running a repeatable Workflow pipeline. **5 zones shipped LIVE + verified this session; a 6th (Khao Sok) in progress.** All committed + pushed to `origin/main` and deployed to production (manual `wrangler deploy`).

## Zones shipped (all LIVE + verified: reviews TH+EN [200], hero photos [200] on R2, roundup TH+EN [200], hub-linked, cid=1965862 present)

| Zone | Province / hub | New reviews | Roundup | Commit | Deploy Version |
|---|---|---|---|---|---|
| **Railay Beach** | Krabi / city-krabi | 8 | `top8-railay-hotels-krabi` | `2c811972c` | `0635183b` |
| **Koh Phi Phi Don** | Krabi / city-krabi | 8 | `top8-phi-phi-hotels-krabi` | `43c5f2fc9` | `90a9f9b5` |
| **Koh Lanta** | Krabi / city-krabi | 8 | `top9-koh-lanta-hotels-krabi` (+Avani+ existing) | `dfe8df4ef` | `d2576081` |
| **Koh Tao** | Surat Thani / city-surat-thani | 8 | `top8-koh-tao-hotels-surat-thani` | `e59b07d7f` | `c1b06d16` |
| **Koh Yao (Noi+Yai)** | Phang Nga / city-phang-nga | 6 | `top10-koh-yao-hotels-phang-nga` (+4 existing) | `c6c7708c7` | `239b4811` |

**Totals: 38 new hotel reviews (TH+EN = 76 files) + 5 roundups (TH+EN = 10 files) + ~152 real photos (self-hosted, resized+webp, uploaded to R2).** Railay & Phi Phi were the earlier part of the session; Lanta/Koh Tao/Koh Yao were built on the user's "ทำต่อ / ทำมาเรื่อยๆทั้งหมด" directive to run the autonomous backlog.

Spot-check any live: e.g. https://thailandaddict.com/review-rayavadee-krabi · /top8-phi-phi-hotels-krabi · /review-pimalai-resort-spa-koh-lanta-krabi · /review-jamahkiri-dive-resort-spa-koh-tao-surat-thani · /top10-koh-yao-hotels-phang-nga (+ `/en/` twins).

## The reusable pipeline (per zone)

Scripts live in `_internal/wf/<zone>/` (railay, phiphi, lanta, kohtao, kohyao). Each zone = ~7 Workflow runs:
1. **Discover** — 3 lens agents (tier/beach) enumerate real open hotels → synthesis dedups + verifies open-status → 10-12 candidates; editor picks the final set.
2. **Research** — 1 agent/hotel → verified `research.json` (zone/star/Booking+Agoda+Trip scores/price/rooms/highlights/cons/booking-URLs/photoSourceUrl).
3. **Write** (parallel) — 1 agent/hotel writes a 78-field schema-valid TH review (≥2000 chars) from research + a same-province template.
4. **Photos** (parallel) — 1 agent/hotel finds 4 direct image URLs (official site / Trip.com CDN) → curl (bash, browser UA) → `sharp` resize ≤1600 q82 + webp → `public/images/hotels/` → **upload to R2** (`node _internal/upload-r2-api.mjs`).
5. **Affiliate + heroCredit** — deterministic: `append-affiliate.mjs` stamps cid/Allianceid; heroCredit set from the real photo source.
6. **EN twins** — translate reviews + roundup; Thai-leak gate.
7. **Roundup** — add slugs to `_internal/wf/extract-roundup-pools.mjs` → generate → `postprocess-roundups.mjs` (enforce verified pool data) → EN roundup → `postprocess-roundups-en.mjs`.
Then: **build** (`cd astro && rm -rf dist .astro node_modules/.vite node_modules/.astro && npm run build`) → verify `dist/review-*.html` render → `wrangler deploy` → verify live → commit + push.

## Quality discipline applied every zone (honesty > hype)
- **Verified each pick before writing** — caught & fixed: Phi Phi Holiday Resort peak-price (฿8,900→฿3,000) + Holiday-Inn rebrand identity; The Houben promo-floor price (฿2,500→฿3,900); Jamahkiri location (→Shark Bay).
- **Swapped un-bookable picks** — Crystal Dive (Koh Tao) is a dive-school selling rooms direct-only (no OTA listing = no affiliate link/score) → swapped to Sensi Paradise mid-pipeline.
- **Real photos, real credit** — official sites where possible; Trip.com fallback for Cloudflare/ISP-DNS-blocked sites (Six Senses, Ban's, Koh Tao Heights, Thiwson); credited the actual source (e.g. "ภาพ: Booking.com" for Chintakiri's bstatic images, not "official site").
- **Honest score-ranking** — roundups rank by real guest score with best-for signposting; budget bungalows honestly top luxury flagships where guests rate them higher (Phi Phi Paradise Pearl #1; Koh Tao boutiques over Ban's; Six Senses #5 not #1). Vision-QA'd risky heroes.

## Gotchas learned (also in [[new-zone-reviews-pipeline]] + [[deploy-pipeline]] memory)
1. **Clear build caches from `astro/`, NOT repo root** — `.astro`/`node_modules`/`dist` live under `astro/`. A root-level `rm` no-ops → stale content cache → new review/roundup pages DON'T render (hub still links them, so the hub looks fine but pages 404). Cost one wasted 13-min build on Phi Phi. Always verify `dist/review-<newslug>.html` exists post-build.
2. **Upload photos to R2 BEFORE deploy** — hotel images render via the R2 public domain (`pub-65cf98…r2.dev`), not same-origin; a photo only in `public/` 404s. (Bit the Railay first pass; also flushed a ~1,700-image backlog incl. earlier kid photos.)
3. **Verify OTA data + price + identity per pick** — research agents grab peak/promo price outliers and mislabel rebrands; a candidate can be entirely un-bookable (dive-school). Swap early.
4. **Trip.com fallback for blocked official sites** — curl the Trip hotel-detail page (browser UA) → extract `ak-d.tripcdn.com/images/<id>_W_1280_853_R5_Q70.jpg`. Strip WordPress `-WIDTHxHEIGHT` suffix for full-res.
5. **Gap analysis: confirm cluster + real island, not filename substring** — "yao" matched Phayao province + Yaowarat(BKK) + Haad Yao(Phangan), falsely inflating Koh Yao's count 4→26.

## In progress / next
- **Khao Sok** (Surat Thani, 2 reviews + 0 roundups) — 6th zone, discovery running. Cheow Lan Lake floating raft houses + Khlong Sok jungle lodges. Note: many lake rafts sell tour-package-only (no OTA) — discovery flags `otaBookable`; fold the 2 existing (500 Rai, Khao Sok Rafthouse) into the roundup.
- **Famous islands now mostly done.** Koh Phangan (18 rev, 2 roundups), Koh Samet (50 rev, 2 roundups), Samui (8 roundups), Koh Chang (5) all well-covered — no action needed.
- **Other autonomous backlog** (from the earlier audit, if continuing past islands): roundup Phase 3c (thin pools) + deferred Surat Thani/Phang Nga roundups; Michelin W3 booking/budget guides + W4 Nov-2026 refresh; 5 remaining kid-attraction photos (post-mourning, via venue FB).
- **Owner-blocked** (cannot do autonomously): GA4 Measurement ID, Search Console sitemap submit, sameAs social URLs.

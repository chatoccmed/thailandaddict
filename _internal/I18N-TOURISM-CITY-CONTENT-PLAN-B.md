# Plan B — Deep tourism-city content in all 9 languages (PLAN ONLY, not started)

> Owner-requested plan (2026-07-10). Goal: make the 30 curated tourism cities a *complete* multilingual
> experience — not just the hub summary + hotel reviews (already 9-lang), but the deep content a foreign
> tourist actually reads: what to see, what to eat, how to plan. **This is a planning document — do NOT
> execute without owner go.** Pairs with `I18N-AND-TOURISM-CITY-PLAN.md` (the original locked policy).

## 1. Goal
Translate the deep content of the 30 tourism cities (attractions / food / eat-rankings / itineraries / prep)
from TH+EN into the 7 remaining Tier-1 languages (zh · ru · ko · ja · hi · he · ar), passing the same QA bar
as the hotel-review waves (0 broken on adversarial sampling).

## 2. Scope (verified 2026-07-10)
**1,483 tourism-city articles** (of 3,999 total). Every one already has a TH source + EN twin.

| type | count | tourist value |
|---|---|---|
| itinerary | 369 | high (multi-day plans) |
| attraction | 360 | **highest** (what to see) |
| food | 285 | high (what to eat) |
| eat-ranking | 230 | high (top-10 restaurants) |
| prep | 231 | medium (planning/how-to) |
| guide | 8 | low |

Per city: bangkok 211 (max) … koh-larn 18 (min). Full list derivable from the CITIES const + slug/cluster match
(see the analysis one-liner in this session's transcript, or re-run it — always re-derive from disk).

**Total work = 1,483 × 7 = ~10,381 files** (minus ~12/lang flagship itineraries already done = **~10,300 to translate**).
For scale: this is ~5× the entire hotel-review effort (Wave 1 ru/ko/ja + Wave 2 hi/he/ar ≈ 2,200 files).

## 3. Prerequisites — ALL READY (no infra blocker)
- `articles-{zh,ru,ko,ja,hi,he,ar}` content collections are defined in `content.config.ts` ✅
- `/{lang}/[slug].astro` routes already `getCollection('articlesXx')` and render via ArticleLayout for all 7 langs ✅
- Existing translated articles: zh 17, ru/ko/ja/hi/he/ar 12 each (the flagship itinerary pillars) — resume-aware tooling must SKIP these ✅
- RTL for he/ar handled at layout level (`isRtl`) ✅

## 4. Pipeline — reuse the proven hotel-review machinery
Same shape as Wave 1/2, adapted for the article schema:
1. **Translate** — Workflow, Sonnet, batched (~3 articles/agent), pipelined; resume-aware (compute pending from disk, skip existing). Hit session limits → `resumeFromRunId`.
2. **Validate structural** — extend `validate-hub-twin.mjs` to a `articles` collection mode (key/array parity vs EN source, DO-NOT-TOUCH fields byte-identical, no-raw-Thai leak [esp. hi], target-script present). Calibrate against a human-accepted locale before trusting.
3. **Systemic mechanical fixes** — re-run the detectors: schemaDesc/meta English-left, any breadcrumb/label fields left English (article analog of parent*), literal `<script>`-breaking pseudo-tags, Thai-script leak (hi). Mechanical where deterministic.
4. **Opus fluency-fix pass** — `wf-fluency-fix` adapted for articles + all 7 langs (incl. Thai-leak + RTL checklist already in wave2 variant). ~23% touch rate expected.
5. **Adversarial sample** — native-reader "refute publish-ready" per language; require **0 broken** before shipping. Sample size scales with volume (≥20/language/phase).
6. **Commit + deploy** — manual pipeline (`deploy-batch.sh`, already patched for near-me-index).

## 5. New tooling to build (the only real net-new work)
- **Article FIELD_RULES** — the article schema is richer than reviews. Block kinds (`content.config` articleBlock):
  `h2, p, image, list, table, heatmap, tip, localtips, ranked, cards, day, cta, restaurant, staycta, foodexp, experiences, embed`.
  Must enumerate per-block which text is translatable vs which fields are DO-NOT-TOUCH (slugs, URLs, img paths, coords,
  ratings, hex, dates, affiliate links, hotel/restaurant proper names). This is the ~1-day judgment step (write it once as a spec, like `en-twin-spec.md`).
- **`validate-hub-twin.mjs` articles mode** — add `articles` as a valid collection; reuse the walker.
- **article-aware fluency prompt** — variant of `wf-fluency-fix-wave2.mjs` with article block context.

## 6. Recommended phasing (by tourist value, not by language)
Ship value early; don't block on the whole 10k.
- **Phase B1 — "what to see & eat"** (highest intent): attraction (360) + food (285) + eat-ranking (230) = 875 articles × 7 = ~6,125 files. Do languages in the Wave order (zh/ru/ko/ja first — larger audiences, non-RTL — then hi, then he/ar RTL last).
- **Phase B2 — "how to plan"**: itinerary (369) + prep (231) = 600 × 7 = ~4,200 files.
- Within each phase: pipeline per city so a city goes fully multilingual before the next (lets us ship city-by-city and measure).
- Alternative axis if the owner prefers: by CITY (bangkok first — 211 articles — as a complete pilot, then scale). Pick one axis and hold it.

## 7. Two-machine division
- Disjoint by **output directory** (as with the hub/content split now in effect).
- Option 1 (by language): machine A does zh/ru/ko/ja, machine B does hi/he/ar. Clean — never same `articles-<lang>/` dir.
- Option 2 (by content-type): A does attraction+food+eat-ranking, B does itinerary+prep — but BOTH touch every `articles-<lang>/` dir → file-level (not dir-level) disjoint, riskier for rebases. **Prefer Option 1 (language split).**
- Rule unchanged: `git fetch && rebase` before every push; only one machine runs `wrangler deploy` at a time, from latest merged main.

## 8. Effort / cost reality
- ~10,300 files. At the observed Wave-2 rate (~sonnet, ~14 concurrency, rate-limited) this is **multiple days of wall-clock across many session-limit windows**, plus a large opus fluency spend.
- Session limit resets every ~5h; expect ~10–20 resume cycles total. Fully autonomous-resumable (all workflows use `resumeFromRunId`).
- Token cost is large but bounded; QA (opus fluency + sampling) is the expensive part — sample, don't exhaustively re-read.

## 9. Risks & gotchas
- **Article schema breadth** — more block kinds than reviews; the FIELD_RULES spec must be right or the fluency pass churns. Calibrate the validator against a known-good locale first (2 false positives bit me on reviews: qiPriceUnit, mapAddr).
- **Thai-script leak (hi)** — the hi translator leaks Thai place-name fragments (บางแสน/โคราช); validator's no-raw-Thai check gates it; fluency checklist already covers it.
- **RTL (he/ar)** — translate text only; layout handles dir=rtl; do NOT add manual bidi marks.
- **eat-ranking articles emit Restaurant JSON-LD** — keep structured-data fields byte-identical to EN.
- **Don't touch hub/gen-hubs/public HTML** — that's the other machine's lane.
- **Deploy build is ~13 min + 8GB heap**; adding ~10k pages grows dist — watch for OOM (build already uses `--max-old-space-size=8192`).

## 10. Definition of done (per phase, per language)
- validate-hub-twin (articles) → 0 fail on `--all`
- systemic scan → 0 English-left / 0 Thai-leak / 0 pseudo-tags
- adversarial sample (≥20/lang) → 0 broken, minor-only residual
- committed, and the language's pages return 200 in prod with correct lang/hreflang after deploy

## Status: PLAN ONLY — awaiting owner go on scope, phasing axis, and machine split.

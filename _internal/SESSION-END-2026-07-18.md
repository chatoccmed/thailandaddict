# Session record — 2026-07-18 · Big merge + site-wide dead-link audit + premium design

**Theme:** reconciled two 3-week-divergent branches, then ran a full-site link/quality audit and fixed ~85,000 dead links across every layer. All committed + pushed to `origin/main` and deployed to production (manual `wrangler deploy`). Multi-machine: another session shipped Chonburi/Phuket Klook activity content in parallel — no conflicts (interleaved cleanly).

## What shipped (all LIVE + verified on production via workers.dev, cache-busted)

| Work | Result | Deploy version |
|---|---|---|
| **Merge origin/main** (243 vs 37 commits, 643 conflicts) | reconciled — reviews 2,401 · roundups 397 · articles 4,407 · 9-lang hub + 7-lang content, both kept | (merge commit 367cf8939) |
| Merge regressions (verify pass) | fabricated "verified date" on 4,678 reviews, i18n keys lost on ~4,000 articles, 794 broken footer links, premium.css inert | (3b2e764d5) |
| Banned AI words | 10 → **0** site-wide | 4c6f19b1 |
| i18n delta | 496 hub strings × 7 langs → **99.87%** coverage | 4c6f19b1 |
| tourist-cities broken links | 91 vs/best-of pages → destinations | 62e73b16 |
| **Site-wide dead-link audit** | **84,907 real dead → 0** | f728ae77 → a7a6bbf5 |
| Premium design restore + push | proto3 (silently un-deployed by another machine) restored + surgical premium finish | ffd4e9b0b, deployed earlier |

## The dead-link audit (the big one)

Ran `_internal/wf/audit-site.mjs` (scans every dist HTML). Started at 90,859 flagged; fixed by layer:
1. **audit tool blindspot** — `/go/b` + `/api/*` are worker.js routes, not files → taught `isValidInternal` (−38,627 phantom).
2. **hub layer** — localized pages (activities-*/area-*/region-* × 7 langs) had bare relative links (`href="near-me"` → `/zh/near-me` 404). Fixed `localize.mjs rewriteUrls` to route bare links /<loc>/ (twin exists) else /en/ (−45,000).
3. **content layer** — `ArticleLayout/ReviewLayout/RoundupLayout` `link()` blindly prepended the locale prefix → 404 on cross-links. New `localizedSlugSet()` in `lib/locales.ts` + **3-way routing** (in-locale twin → /<loc>/, EN page → /en/, root-only like /trip → /). Also: raw `<a href>` baked into translated prose (bypasses link()) rewritten in content-<loc> JSON (1,015 links); structured card hrefs (it.href/c.href/cta) wrapped through link().

**Finished to ZERO** — the residual (EN root-only /trip, /en/en/ double-prefix, staycta/foodexp CTAs, localize /en/-rewrite, 4 stale content refs) was all closed in follow-up passes. Site-wide real dead internal links: **0**.

## Commits this session (chatoccmed, 2026-07-18)
`367cf8939` merge · `3b2e764d5` merge-regression fixes · `4dcff898d` banned words · `767b78680` i18n delta · `11a45bd6a` tourist-cities · `6890c5eba` hub bare-links · `0c8e89b69` content link() · `cfcd9dce3` content 3-way+prose+card · plus cache/design/doc commits.

## Key lessons (also in memory)
- **Multi-machine:** fetch+merge before starting, push right after; Drive+OneDrive lock files during big git ops (retry 2-3×); another session's deploy can silently overwrite yours (deploys run from local dist, last-wins — re-check production, don't trust "LIVE" claims).
- **Build OOM = disk, not RAM:** keep C: > ~12-13GB; concurrent builds clobber dist (empty output).
- **Astro scopes `<style>` by attribute** → a layout's `.x{}` beats a plain stylesheet's `.x` — premium.css was inert; `.x.x` or the render-time fix wins.
- **Audit metric traps:** `localize.mjs` prints per-occurrence misses not unique; audit-site counts worker routes + JS template literals as dead — filter before believing the number.

## Continued run — honesty + revenue leaks (same day, after the audit hit zero)

| Work | Result | Deploy |
|---|---|---|
| **Map placeholder** — one stand-in map image reused as `mapImg` on 60 hotels (717 files with twins) | **717 → 0.** `mapImg` now optional; those 60 have real lat/lng, so the address links to the true coordinates instead of showing a map that isn't the hotel. The 2,341 reviews with a real map image are untouched (6,490 pages still render the thumb). 3 hotels also had the placeholder as heroSub1/2 in the 7 localized copies only — resynced from TH. | `3c816c7f` |
| **OTA links earning nothing** — 78 Trip.com + 4 Agoda | **82 → 0.** Root cause: partner ids lived *only* inside the urls stored in booking fields, so any url arriving via another field (`heroSub2Href`, the hero photo's `rel="sponsored"` click target) went out bare. New `astro/src/lib/affiliate.ts` stamps ids at render time via `goB()` in all 3 layouts → bare OTA urls are monetized by construction. | `b18491f7` |
| **CJ id baked into HTML** — all 9 homepages carried a hardcoded CJ link with the legacy ad `17289009` | **9 → 0.** Now `/go/b?u=…&sid=home`, so the id lives only in worker.js as CLAUDE.md locks it. Verified live: `/go/b` 302s to `…click-101809619-17293139`. | `b18491f7` |
| **Audit false positives** | Hrefs and img srcs that inline JS assembles at runtime (`'<a href="' + it.href`) were counted as broken files — 5,952 phantom dead links + 11 phantom missing images every run, filtered by hand each time. `audit-site.mjs` skips them now, so the printed numbers are readable as-is. | — |

| **Images with no alt at all** — 181 across the site | **181 → 0.** `ReviewLayout` read alt out of `galleryAlts` by index, so a review whose array was shorter than its image count rendered `<img>` with the attribute dropped entirely (62 reviews × locales). Falls back to the hotel name, already localized per collection. `resto-mainimg` likewise. | `f1888253` |
| **Unlabelled gallery buttons** — 3,610 content photos with `alt=""` | **3,610 → 0.** The venue gallery thumbs are `<button><img alt=""></button>`; the img alt is what gives the button its accessible name, so screen readers read a row of anonymous "button"s. Now named after the venue and numbered. | `f1888253` |
| **Alt that said nothing** — 398 images whose alt was only "(ภาพประกอบ)" / "(illustrative photo)" | **398 → 0.** `realAlt()` treats a bare marker as absent so the venue-name fallback wins; the marker appended to a real description is untouched. | `dca8b82f` |

**Deliberately left as `alt=""`:** 972 hub card photos. Each sits inside an `<a>` whose visible title already names the link — filling the alt would make a screen reader announce it twice. Verified 0 of them sit outside a labelled card. An alt audit that flags these is wrong, not the markup.

**Audit now reads clean end to end:** 19,125 pages · 0 dead links · agoda 0 missing-cid · trip 0 bad · booking 0 plain · klook 0 bad · 0 missing images. Only remaining flag is 2 orphans (`font-compare` = dev page, `my-list` = app page) — both intentional.

**Rules this added (also in CLAUDE.md):**
- A new review with no real per-hotel map image → **omit `mapImg` entirely**; never borrow another hotel's map. Omitting it yields the real-coordinates link automatically.
- Partner ids belong in `lib/affiliate.ts`, never pasted into content urls. Never embed a CJ link in HTML.

## Next (see ACTIVE-WORK-CLAIMS.md)
Dead links are at **0** — nothing left there. To keep them there: add any new root-only page to `ROOT_ONLY_SLUGS` (lib/locales.ts), and re-run `node _internal/wf/audit-site.mjs` after touching a layout's `link()` or `localize.mjs` (filter JS template literals out of the count before reading it).

Remaining backlog is all **owner-gated** — everything that could be fixed without a decision has been:
- **real bylines** — needs the actual author names/credentials
- **real GA4 id** — still a placeholder; needs the property id
- **de-cliché "ลงตัว"** (1,436×, 39% of reviews) — a correct Thai word, not a banned one, but it reads as a template crutch. Rewriting is a taste call.
- **cornerstone / pillar content** — a content strategy decision, not a defect
- **real per-hotel map images** for the 60 hotels that now show a coordinates link — would need a static-map API key or sourced images

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

## Next (see ACTIVE-WORK-CLAIMS.md)
Dead links are at **0** — nothing left there. To keep them there: add any new root-only page to `ROOT_ONLY_SLUGS` (lib/locales.ts), and re-run `node _internal/wf/audit-site.mjs` after touching a layout's `link()` or `localize.mjs` (filter JS template literals out of the count before reading it).

Remaining backlog is all owner-gated: real bylines, real GA4 id, the map-placeholder image reused across 717 reviews, whether to de-cliché "ลงตัว" (1,436×, a legitimate Thai word — not a banned one), and cornerstone/pillar content.

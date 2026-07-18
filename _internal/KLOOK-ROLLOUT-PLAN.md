# Klook data rollout — plan + work log

**Goal (owner, 2026-07-18):** every Thailand Klook product/service is reviewed in a *friend-telling-a-friend* voice from real reviews — NOT copied — then grouped and ranked per province. Comprehensive coverage + monetization, without scaled-content risk.

## The model (agreed — SEO-safe)
"ทำทุกรายการ" = **every product is a reviewed CARD** inside a province+category roundup/compare (friend-tone + real rating + pros/cons from real reviews + Klook deep link). Mega-products (100k+ reviews, real "review X" demand) also get a selective standalone hero page. NOT one thin page per SKU — that is Google "scaled content abuse" and risks the whole domain. See CLAUDE.md tone + honesty rules.

- **A1 roundup** per province (the anchor). **A2 compares** per category. **C heroes** selective. Rankings ARE the "จัดอันดับ".
- Data + rating source: **Klook via the in-app Browser pane** — see memory `klook-browser-data-source`. WebFetch 403s; a real browser loads it. Extract facts (name/rating/reviews/price/URL) via `javascript_tool`; write original Thai copy. Never copy Klook prose. Images = Wikimedia Commons API (never Klook photos).
- **Deep link** = `klook.com/th/activity/<id-slug>/?aid=121442` (task #2).

## Reusable tooling (in `_internal/wf/`)
- `klook-upgrade.mjs <province> <map.json> [--write]` — patch bookHref (+ optional rating) on an A1's cards, TH + EN twin, matched by a TH-name regex; validates aid + rating range. `map.json` = `[{re, slug, rating?, ratingSrc?}]`.
- `klook-harvest-img.mjs <out.json>` — pull + HTTP-200-verify CC images per subject from the Wikimedia Commons API (real license/author). Spot-check the titles — the API returns occasional bad matches.
- Card-copy research: a Workflow of one agent per product (see the chonburi build) → assemble → un-escape entities → ban-word/slang lint → verify images 200.

## ⚠️ Iron rule: verify every deep link by hand
Klook search "top result" is often wrong. Real misses caught: FantaSea → Mahanakhon Skywalk (Bangkok!) then Carnival Magic; Chinatown food → a tuk-tuk tour. A wrong deep link sends a real buyer to the wrong product. **Match the slug to the card before linking; if unsure, keep the search link.** Expect ~7-8/10 per tourist province; the rest stay on honest search links.

## Progress
### New activity clusters (task #4 — owner: build separate cluster per empty city, honest Top-N)
- ✅ **chonburi** A1 (TH+EN) — honest 8 cards, evidence-based, Commons images. B hub + city section live.
- ⬜ hat-yai, koh-kood, koh-larn, koh-mak — tiny islands overlap parent (Trat/Pattaya) clusters; build honest small Top-N, do not pad.

### Klook data upgrade (task #2 — real ratings + product deep links on existing 84 A1s)
| province | deep links | ratings | commit |
|---|---|---|---|
| chonburi | 2/8 (Klook-thin, non-tourist) | +zoo 4.6 | 6e59c464a |
| phuket | 8/10 | (already had) | a87ce0411 |
| bangkok | 7/10 | +2 new, refresh Safari 4.1→4.6 | d502545b8 |
| krabi | 10/10 (first full house) | +Rok-Haa 4.8 | 9b6a5aaa0 |

**Next queue (tourist-first):** samui · pattaya · chiang-mai · ayutthaya · kanchanaburi · chiang-rai · huahin · koh-lipe · koh-phangan · … then mass provinces (few Klook matches — mostly stay on search links).

### 🚀 Deploys
- **2026-07-18 11:26** — version `648b3412`, account chatmaliwan/46cdce4b. Shipped chonburi/phuket/bangkok upgrades + all committed work. Verified live: `activity/14913?aid=121442` renders on thailandaddict.com, /go/b worker redirect = 302, KV TRIPS attached. Krabi committed after this deploy → ships on the next one.
- **Deploy under a concurrent session:** it also builds/deploys. Wait for `astro/dist` to go quiet (`find dist -newermt '-25 seconds'` = 0) before `npx wrangler deploy` from repo root, or you ship a half-written dist. Both sessions' committed content ships together. Images serve from R2 (IMG_BASE), so a sparse local `dist/images` is normal and harmless.

### Also done this session (activity category)
- 84 hero pages: all now carry the mid-article hotel `staycta` (was missing on 29). commit 9cfa300ba.
- 3 EN twins restored to the activity hub (type parity) + monetization parity. commits 3d8221425, 1bbc81066.
- `build-test.sh` serialised behind a lock (two sessions share the machine). commit f0e685fd1.

## Machine reality (see memory `build-oom-disk-trap`)
Disk ~9GB free, commit limit tight. Builds pass at >9GB commit headroom; below that they OOM/ENOSPC and read like a code failure but are not. `(Get-CimInstance Win32_OperatingSystem).FreeVirtualMemory/1MB` must be > 9 before a build. Two sessions push to origin constantly — commit specific paths (never `git add -A`), fetch+merge before big work (memory `multi-machine-git-workflow`).

## Deploy (owner: deploy periodically)
Account MUST be `chatmaliwan@gmail.com` / `46cdce4b` (memory `cloudflare-deploy-account`). `cd astro && npm run build` (prebuild regenerates public/ hubs) → `npx wrangler deploy` (reads astro/dist; KV TRIPS must attach). Deep-link/rating edits are data-only on already-valid cards, so they ship whenever the next build+deploy runs.

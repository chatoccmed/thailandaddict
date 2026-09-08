# HANDOFF — Andaman Deck redesign · 2026-09-08

Session paused for credits. Everything below is committed. Resume at **"NEXT STEP"**.

## Where things stand

**Phase 1 prototype is LIVE and verified:** https://thailandaddict.com/_proto/ (Worker version `98da90f3`)
17 pages TH+EN, launcher with an A/B/C palette switcher, installable PWA, service worker scoped to `/_proto/` only, `noindex` on two layers. The live site is unaffected — verified 13 endpoints at 200 and `_proto` appears 0 times in the sitemap.

**Owner decisions already made (do not re-ask):**
1. Design direction **A "Andaman Deck"**, with Night Market values as its dark theme.
2. Build a **full trip planner inside thailandaddict** — the old "planner lives on Velalist" rule is reversed.
3. **Homepage must open at the Travel planner** while still showcasing eat / see / stay, app-like. This overrides blueprint §5.1.

**`origin/main` now matches production.** Before this session, the live site was running an AVAIL fix that was never committed, and 2,343 zh/ru/ko translations existed only on one disk. Both are now in git.

## NEXT STEP — finish the planner-first homepage

`astro/public/_proto/home.html` (294 KB) and `en/home.html` (248 KB) were **written but never verified**. The build agent finished; the two verification passes never ran. Treat them as a draft.

To resume:
1. Read the judge's merged spec — it is the build contract, and it fact-checked the concepts hard. Recover it from the workflow journal:
   `.claude/projects/C--Users-Imac-Thailandaddict/50035162-e3be-44bd-9472-3ebb30e17404/subagents/workflows/wf_06e52eca-17d/journal.jsonl` (last `{"type":"result"}` line before the stop).
2. Run the two verification passes that never ran:
   - **Gates**: at 375x812 `scrollWidth === innerWidth`; every interactive control >= 44px; nothing covers the planner control or any add-to-plan button; reduced-motion kills all animation; **first-view weight under 500 KB** — the HTML alone is 294 KB, so measure encoded bytes over CDP, not Resource Timing.
   - **Truth/SEO**: every place, score, price and photo must exist in `astro/src/content` or `_internal/province-data`; every `images/{hotels,cm,food,gallery}` URL must use the R2 base or it 404s in production; no internal link may end in `.html`; one h1; JSON-LD parses; count real internal province links.
3. Then build + deploy (recipe below) and commit.

`_internal/shell/build/` (`gen-proto-home.mjs`, `home.page.css`, `home.page.js`, `sprite.svg`) is the generator the build agent left behind — read it before hand-editing the HTML, or edits will be overwritten on regeneration.

## Build + deploy recipe (learned the hard way this session)

```bash
export PATH="$HOME/nodejs:$PATH"
cd astro && node --max-old-space-size=12288 node_modules/astro/astro.js build   # ~21 min, 17,187 pages
cd .. && npx wrangler deploy
```

- **Close every subagent, preview server and browser tab first.** The box has 7.9 GB RAM; V8 reserves ~9.2 GB for a 12288 heap and the build fails if commit is short. Three builds were lost to this. Lower heaps do not help — 6144 and 7168 both exhaust the JS heap for real.
- **A failed build wipes `astro/dist/`**, leaving nothing to deploy. Production is unaffected (it is served by the deployed Worker), but there is no fallback.
- Deploy runs as Cloudflare account `chatmaliwan@gmail.com` via `CLOUDFLARE_API_TOKEN`. GitHub is `chatoccmed` — different systems, deliberately unconnected, deploy is manual only.

## Traps that will bite again

- **File budget: 19,656 / 20,000.** Only 344 spare. Cloudflare silently drops files past the limit — this site has shipped with missing content that way before. Add a build assertion and move `images/heroes` + `images/cities` to R2 **before the next content push**.
- **`.assetsignore` excludes `images/{hotels,cm,food,gallery}`** from the bundle. Any new page must reference them as `https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/images/...`. They render fine locally and 404 in production, so local testing will not catch it.
- **The site serves clean URLs.** Internal links ending in `.html` take a 307 and defeat prerender. Do not strip `.html` from affiliate deep links — `agoda.com/rayavadee-hotel/hotel/krabi-th.html?cid=` is legitimately a `.html` URL.
- **`img.thailandaddict.com` does not exist.** Fonts are self-hosted at `/fonts/` (6 woff2, 80 KB).
- **The baht sign is `U+0E3F`, inside the Thai block.** Blueprint §3.5 claims it is `U+20BF`; that is the Bitcoin sign. Corrected in `shell.css`.
- One malformed JSON file blocks the entire site build. `articles-ko/michelin-baan-pee-lek.json` had unescaped quotes; a scan of ~14,000 files found only that one.

## Known gaps in the shipped prototype

- `dark-rtl.html` proves layout mirroring but contains **no Hebrew text and no `<bdi>`** — bidi is still unproven. Numbers, ฿ and Latin brand names inside RTL prose have not been tested.
- The focus ring keeps brand `#06B6D4` at ~2:1 on paper, below the 3:1 non-text floor. Deliberate, pending an owner decision.
- The 9.4 score on the review page sits at y=979, just past the 1.1-viewport line. Design judgment, not a bug.
- `/_proto/trip` reads no URL params, so a `?p=&d=` handoff from the homepage does not work yet.

## Still owed from blueprint §4.0

`compat.css`, the 9 locale webmanifests, and the `/sw.js: no-cache` header rule — needed only when the shell rolls out past `/_proto/` (Phase 2).

## Reading order for whoever picks this up

1. `_internal/REDESIGN-BLUEPRINT-2026-09.md` — the master spec (§2 palette, §3 design system, §4 app shell, §5 pages, §6 planner, §8 phases)
2. `_internal/shell/PROTO-KIT.md` — the markup contract; copy it verbatim, do not invent class names
3. Memory: `redesign-2026-09-plan`, `design-direction-andaman-deck`, `velalist-trip-handoff`

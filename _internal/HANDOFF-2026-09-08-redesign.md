# HANDOFF — Andaman Deck redesign

Last updated 2026-09-09. Everything described here is committed and deployed.

## Where things stand

**Phase 1 prototype is LIVE and verified:** https://thailandaddict.com/_proto/ (Worker version `a39d0689`)

17 pages TH+EN, a launcher with an A/B/C palette switcher, an installable PWA, a service worker scoped to `/_proto/` only, and `noindex` on two layers. The live site is unaffected — 13 endpoints verified at 200, and `_proto` appears 0 times in the sitemap.

**The homepage is now planner-first and shipped.** On a first visit at 375x812, without scrolling, the visitor sees: the compact planner (destination preselected, button reading the real destination and duration), the disclosure that plans come from our own guides rather than AI, then a real photograph, a real place name, and its real score and price. The eat/see/stay rail starts 60px above the fold.

**Owner decisions already made (do not re-ask):**
1. Design direction **A "Andaman Deck"**, with Night Market values as its dark theme.
2. Build a **full trip planner inside thailandaddict** — the old "planner lives on Velalist" rule is reversed.
3. **The homepage opens at the Travel planner** while still showcasing eat / see / stay. This overrides blueprint section 5.1.

**`origin/main` matches production.** Before this work, the live site was running an AVAIL fix that was never committed, and 2,343 zh/ru/ko translations existed only on one disk.

## Measured state of the homepage

| | before | after |
|---|---|---|
| first real photograph | y=1134 | **y=429** |
| planner slot height | 418px | 233px |
| first-view weight | 651 KB | **383 KB br (TH) / 371 KB (EN)** |
| full-scroll photo payload | 13.18 MB | 1.78 MB |
| crawlable province links | **0** (all 77 lived in a JS array) | **89** |
| heading outline | h1:1 h2:0 h3:0 | h1:1 h2:12 h3:35 h4:73, no skips |
| page height | 12,010px | 8,018px |
| JSON-LD | — | 7 blocks, all parse |

Works fully with JavaScript disabled. CLS 0 in all three planner states. 244 controls, none under 44px.

## ⚠️ THE BINDING CONSTRAINT: this machine can no longer build the full content set

> **SUPERSEDED 2026-09-09.** Content collections were retired and the routes now read one JSON
> file from disk per page (`astro/src/lib/content-fs.ts`). The full corpus — all 19,530 files,
> the 2,343 zh/ru/ko translations included — now builds on this box, and the build heap is
> pinned DOWN to 4096 MB so a regression fails loudly instead of eating the machine. Diagnosis
> and fix: `_internal/BUILD-ROOTCAUSE-2026-09.md`. **Do not hold files back by commit any more.**
> The section below is kept as the record of what the failure looked like.

The site builds at **17,187 pages only when the 2,343 zh/ru/ko Plan-B translations are held OUT of the content directory.** With them in, the build fails every time on this 8 GB box. Same command, same heap, same free memory — the only variable is those 2,343 files.

It surfaces as three different-looking failures, which is why it is easy to misdiagnose as a memory-tuning problem:

- heap `12288` — the OS refuses the ~9.2 GB reservation when commit is short
- heap `6144` or `7168` — genuine `FATAL ERROR: Reached heap limit`, so *lower* heaps are not the answer either
- with the translations present — `EPERM: rename data-store.json.tmp` (the content store had grown to **464 MB**, its temp to **504 MB**), and separately a plain 1.39 GB allocation failure

**To build, hold them back by commit, build, then restore.** The file list comes from the commit that added them:

```bash
git diff-tree --no-commit-id --name-only -r 7fe61924c -- astro/src/content/articles-ko astro/src/content/articles-ru astro/src/content/articles-zh
```

Move those files aside, build, then move them back. If `EPERM` appears, delete `astro/node_modules/.astro` (about 924 MB) and rebuild.

**Consequence worth escalating:** the zh/ru/ko Plan-B backlog — 874 zh and 874 ru marked DONE+VALIDATED in memory — has **no path to production from this box**. Fix one of: stop loading the whole content store in memory (Astro 5 keeps `data-store.json` resident), or build on a machine with more than 8 GB RAM. Moving images to R2 helps the deploy file ceiling, not this. Decide before queueing more translation work behind it.

## Build + deploy recipe

```bash
export PATH="$HOME/nodejs:$PATH"
cd /c/Users/Imac/Thailandaddict/thailandaddict
npm run deploy      # = npm run build → npm run verify → npx wrangler deploy
```

**`npm run deploy` is the only path to production. Never `npx wrangler deploy` on its own** —
that skips both gates, and Cloudflare will happily accept a partial dist and put it live over a
complete one. In June 2026 a green build with zero content pages deployed successfully.

The three root scripts:

| script | what it does |
|---|---|
| `npm run build` | `cd astro && npm run build` — prebuild (validate-content → gen-shell → gen-hubs → …) then `astro build` at a deliberate 4096 MB heap |
| `npm run verify` | `_internal/qa/check-page-coverage.mjs astro/dist` (the FLOOR: every content JSON produced a page over 2,048 bytes, every directory produced at least one, every `public/*.html` snapshot survived) then `_internal/qa/check-file-count.mjs astro/dist` (the CEILING: deployable files under Cloudflare's cap) |
| `npm run deploy` | build → verify → `npx wrangler deploy`, stopping at the first red gate |

`wrangler` is pinned as a root devDependency (`^4.34.0`, lockfile 4.130.0) so `npx` takes the
local copy rather than whatever the registry serves that day; ≥ 4.34.0 is also the floor for
Cloudflare's 100,000-file static-asset limit. A fresh clone needs `npm install` at the root
first, or `npx` will fetch an unpinned version.

`_internal/deploy.ps1` (non-interactive, reads `CLOUDFLARE_API_TOKEN`, no OAuth prompt) runs the
same `npm run verify` before uploading, so it is gated identically.

About 17 minutes for the build, about 20 for the deploy. Notes:

- The build heap is 4096 MB and no longer needs a quiet machine. Do not raise it: it is set below
  what O(corpus) behaviour would need, so a regression fails in seconds instead of over an hour.
- **A failed build wipes `astro/dist/`**, leaving nothing to deploy. Production is unaffected — it is served by the already-deployed Worker — but there is no local fallback.
- Capture the real exit code explicitly. A trailing command in the same shell line masks the build's own status, which produced two false "exit 0" reports.
- Deploy runs as Cloudflare account `chatmaliwan@gmail.com` via `CLOUDFLARE_API_TOKEN`. GitHub is `chatoccmed` — different systems, deliberately unconnected. Deploy is manual only; CI auto-deploy has been off since June because it once shipped a partial `dist`. If CI is ever re-enabled, `npm run verify` goes between its build and deploy steps — that partial dist is exactly what the page-coverage gate now catches.

## Traps that will bite again

- **File budget: 19,801 / 20,000 — 199 spare.** Cloudflare silently drops files past the limit; this site has shipped with missing content that way before. The homepage's card derivatives alone cost 145 files. Add a build assertion and move `images/heroes` (218) and `images/cities` (81) to R2 before the next content push.
- **`.assetsignore` excludes `images/{hotels,cm,food,gallery}`** from the bundle. Any new page must reference them on the R2 base `https://pub-65cf98dcb15e4c06a7a465ec411b870a.r2.dev/images/...`. They render perfectly on this machine and 404 in production, so local testing will never catch it.
- **The site serves clean URLs.** Internal links ending in `.html` take a 307 and defeat prerender. Do not strip `.html` from affiliate deep links — `agoda.com/rayavadee-hotel/hotel/krabi-th.html?cid=` is legitimately a `.html` URL.
- **`img.thailandaddict.com` does not exist** and never did. Fonts are self-hosted at `/fonts/` (6 woff2, 80 KB).
- **The baht sign is `U+0E3F`,** inside the Thai block. Blueprint section 3.5 claims `U+20BF`; that is the Bitcoin sign. Corrected in `shell.css`.
- **One malformed JSON file blocks the entire site build.** `articles-ko/michelin-baan-pee-lek.json` had unescaped quotes; a scan of ~14,000 files found only that one.
- **Cascade layers beat `!important`.** Shell's `[hidden]{display:none!important}` sits in an earlier layer than page CSS, so among `!important` declarations the earlier layer wins and no page rule can reveal a `hidden` element. Adding `!important` does not help. This silently rendered the returning-visitor card as a blank 290px box.
- **Generated output.** `astro/public/_proto/home.html` is produced by `_internal/shell/build/gen-proto-home.mjs`. Edit the generator, never the HTML.

## Known gaps

- **The first screen's photo+name+score holds in the fresh state only.** With a saved trip the resume card is taller and pushes the score under the tab bar. Still a large gain — the first photo used to be at y=1134 in every state — but it is a first-visit claim, not a universal one.
- **The resume card loads full-size R2 originals (1920x1080) into 62px thumbnails.** The card-derivative pipeline does not cover it. Wasteful on a returning visitor; invisible in the first-view weight measurement.
- `dark-rtl.html` proves layout mirroring but contains **no Hebrew text and no `<bdi>`** — bidi is still unproven. Numbers, ฿ and Latin brand names inside RTL prose have not been tested.
- The focus ring keeps brand `#06B6D4` at ~2:1 on paper, below the 3:1 non-text floor. Deliberate, pending an owner decision.
- `/_proto/trip` reads no URL params, so a `?p=&d=` handoff from the homepage does not work yet.
- Desktop right column holds the plan and the showcase; verify it once more at 1440 before rollout.

## Still owed from blueprint section 4.0

`compat.css`, the 9 locale webmanifests, and the `/sw.js: no-cache` header rule — needed only when the shell rolls out past `/_proto/` (Phase 2).

## Reading order for whoever picks this up

1. `_internal/REDESIGN-BLUEPRINT-2026-09.md` — the master spec (section 2 palette, 3 design system, 4 app shell, 5 pages, 6 planner, 8 phases)
2. `_internal/HOMEPAGE-SPEC-2026-09.md` — the planner-first homepage contract, with the fact-check that overturned the SEO assumption
3. `_internal/shell/PROTO-KIT.md` — the markup contract; copy it verbatim, do not invent class names
4. Memory: `redesign-2026-09-plan`, `design-direction-andaman-deck`, `velalist-trip-handoff`

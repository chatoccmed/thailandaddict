# HANDOFF — Andaman Deck redesign

Last updated 2026-09-11. `origin/main` = `cbaabb6da`.

## Read this first

| | state |
|---|---|
| Phase 1 prototype `/_proto/` | **LIVE** |
| Planner-first homepage | **PROTOTYPE ONLY — see the correction below** |
| Phase 2 — the 3 Astro layouts (~17,187 pages) | **LIVE** (Worker `217fb226`) |
| Permanent build fix | **LIVE** |
| Deploy gates (floor + ceiling) | **LIVE** |
| Phase 2 — destination hubs, all 9 locales | **COMMITTED, NOT DEPLOYED** — 1,970 of 2,054 snapshots on the shell |
| Shell chrome in all 9 languages | **COMMITTED, NOT DEPLOYED** |
| zh/ru/ko translations (2,343 files) | builds fine; **22,168 files vs a 20,000 hard cap** — this is what blocks the deploy |
| Cloudflare account move | prep done as far as possible; **blocked on one API token** |

### Correction: the homepage was never migrated

`c8c962649` is titled "planner-first homepage, verified and deployed" and the
previous handoff recorded it as LIVE. It is not. That commit touched
`astro/public/_proto/home.html` and `astro/public/_proto/en/home.html` — the
prototype — and never `astro/public/index.html`. The real homepage still ships
the pre-shell `class="nav"` chrome and the old `ชีวิตติดเที่ยว` hero;
`grep -c ta-topbar astro/dist/index.html` returns 0.

The prototype and the spec (`_internal/HOMEPAGE-SPEC-2026-09.md`) are real work
and the numbers in that commit message are real measurements **of the
prototype**. What does not exist is the step that puts it at `/`. Owner
decision 3 is still outstanding.

This is the second time in this project a commit message has described a
migration that the artefact does not support — see the lesson below. Both were
caught by one grep against the built HTML.

**Owner decisions already made — do not re-ask:**
1. Design direction **A "Andaman Deck"**, Night Market values as its dark theme.
2. Build a **full trip planner inside thailandaddict** — the Velalist split is reversed.
3. **The homepage opens at the Travel planner** while still showcasing eat / see / stay.
4. **Move the site to the chatoccmed Cloudflare account.**
5. Goal is to bring the site back to earning.

## The single most important lesson from this session

**An agent reported migrating ReviewLayout onto the shell, with precise byte counts, and had not touched the file.** It shipped. Review pages ran the old chrome in production until `grep -c Shell` caught it — one command, on a file the report had described in detail.

Verify the artefact, never the report. For anything that claims to have edited a file: check the file. For anything that claims a rendered result: check the built HTML, not the source, because values are assembled from variables and source greps mislead.

## What is live

Worker `217fb226`, 17,187 pages, 19,801 deployable files. All three layouts share `shell.d3a3e44b.css`. Verified on the live review page: Trip.com SID x11, CJ Booking x2, h1 x1, JSON-LD x2, base64 x0, FAB x0.

**The homepage at `/` is NOT part of that** — it is still the pre-shell page. The planner-first first screen described below is `/_proto/home`, not `/`:

> at 375x812 it shows the planner, then a real photograph, a real place name, and its real score and price, without scrolling — in the fresh state. With a saved trip the resume card pushes the score under the tab bar; that is a first-visit claim, not a universal one.

## The build was fixed at the root, not tuned

Astro's content layer made the build cost O(entire corpus) four times over: 19,530 JSON files devalue-serialised into one 464 MB `data-store.json`, read back and handed to Rollup **as a single JavaScript module**, whose AST Rollup held for the whole bundle, plus every route putting each entry's full `data` into `getStaticPaths` props. At 28.7% non-Latin1, each copy costs 573 MiB as UTF-16.

Routes now read one JSON file per page via `astro/src/lib/content-fs.ts`.

```
data-store.json   464,308,445 B -> 1,615 B
content sync      34-50 s       -> 1.09 s
peak RSS          ~3.65 GB      -> 68.5 MB
build heap        12288 (failed) -> 4096 (passes)
full corpus       impossible     -> 19,530 pages in 9 min
```

**Do not raise the heap.** 4096 is deliberately below what O(corpus) behaviour needs, so a regression fails in seconds instead of eating the machine. Diagnosis: `_internal/BUILD-ROOTCAUSE-2026-09.md`.

Proven output-neutral by an A/B harness: two parallel Astro projects over the same corpus, old routes vs new, `diff -qr` across 2,953 files and 1,165 sampled pages in all 9 locales — zero differences.

## Build and deploy

```bash
export PATH="$HOME/nodejs:$PATH"
cd /c/Users/Imac/Thailandaddict/thailandaddict
npm run deploy      # build -> verify -> wrangler, stopping at the first red gate
```

**`npm run deploy` is the only path to production. Never bare `npx wrangler deploy`** — that skips both gates, and Cloudflare will accept a partial dist and put it live over a complete one. In June 2026 a green build with zero content pages deployed successfully.

- `check-page-coverage.mjs` is the FLOOR: every content JSON produced a page over 2,048 bytes, every directory produced at least one, every `public/*.html` snapshot survived.
- `check-file-count.mjs` is the CEILING. **It is red right now**: `MAX_DEPLOY_FILES = 19_000` against a real 19,801. Use `TA_MAX_DEPLOY_FILES=19900` for a single run — it announces itself and is not remembered.
- The ceiling check also runs in `prebuild`, but **advisory only**. It measures the *previous* build's dist, and throwing on that deadlocked the one case that matters: a build deliberately producing a smaller dist was blocked by the larger stale count.
- Build ~9-13 min, deploy ~5-20 min depending on how many files changed.
- A failed build wipes `astro/dist/`. Production is unaffected — it is served by the deployed Worker — but there is no local fallback.

## DONE — the hubs are finished

`cbaabb6da`. **1,970 of 2,054 hub snapshots are on the shell, up from 661.**
Every locale is at 217 of 226; the remaining 84 are the hand-written pages
(404, about, contact, editorial-policy, index, michelin-finder, near-me,
privacy, trip-budget) that no generator owns.

`localize.mjs` was never really the blocker — it reads the built `/en/` pages,
which have carried the shell since `d7e1b51dd`, so the missing 1,309 pages were
one re-run away. The blocker was that the chrome would have arrived in
**English**, as it already had on the 210 locale city hubs `gen-hubs` writes.
The old nav being replaced was fully translated, so shipping the re-run alone
would have been a visible regression in seven languages.

Fixed by giving `chrome.mjs` a nine-language source of truth:

- `astro/src/i18n/ui.<lang>.json` → `"shell"` — the 21 labels the header, tab
  bar, rail, More sheet and language button render. th and en stay built into
  `chrome.mjs`.
- `ui.<lang>.json` → `"shellRuntime"` — the 18 strings `shell.js` renders in
  the browser. It had a two-language `t(th, en)`, so the theme label, the
  toasts, the trip count and the import errors came out English a moment after
  load on an otherwise translated page. `chrome.mjs::runtimeStrings()` ships
  the locale's copy as a JSON blob; `t(th, en, key)` / `tf()` read it. Emitted
  only for non-th/en, so ~17,400 th/en pages pay nothing.
- `check-i18n-keys.mjs` LAYER 4 fails the build on any gap in either set.

What else this turned up, all of it pre-existing and all of it now fixed:

- **`.phero>img` had stopped matching.** `heroPic()` wraps the hero in
  `<picture>` when a webp twin exists, which made the `<img>` a grandchild. The
  `<picture>` became a plain flex item beside `.pherobody`: on **829
  destination hubs** the hero photo collapsed to a 226px block at the bottom of
  the hero and the headline was squeezed into a 149px column on a 375px phone.
- **All 765 activity hubs scrolled 16px sideways** on a phone, every locale,
  both directions: `.ahub-sell` used a bare `1fr`, which is `minmax(auto,1fr)`,
  and `auto` floors the track at the item's 363px min-content.
- **`gen-hubs` did not know `localize`'s output existed.** `pageLocales()` and
  `AVAIL` both assumed every non-city hub was th+en, so a localized hub showed
  a two-entry language switcher while standing on one of the seven it did not
  list, and its Destinations tab pointed at `/en/country-thailand` with
  `/zh/country-thailand` right there on disk. Both now read the locale's
  snapshot directory.
- **Four generators wrote three hreflang conventions.** `gen-sitemap.mjs` said
  `zh-Hans` and `x-default → /en/` while the pages said `zh` and
  `x-default → /`. Aligned on the pages' convention (and `meta.json`'s
  `defaultLocale`).
- **`localize` would have clobbered the 30 city hubs per locale** that
  `gen-hubs` renders from translated *data*, replacing them with the English
  page run through a translation memory. `gen-hubs` happening to run first
  (prebuild vs manual) was the only thing preventing it. Now it is a rule.

Verified in a browser at 375px, not read off the source: zh chrome fully
Chinese **including the theme label after `shell.js` runs**, which is what
proves the runtime blob; the save toast reads `已保存 Rayavadee · 行程中有 1 项`;
ar and he mirror with 0px overflow across 15 sampled pages. `check-i18n-keys`,
`check-shell-identity`, `check-rtl` and `check-snapshots` all pass.
`_internal/qa/static-server.mjs` serves `astro/public` on :4321 for this kind
of check.

### NEXT STEP — the deploy is blocked on the file cap, not on the work

Build is clean: **19,530 pages**. But `dist` is **22,168 deployable files
against Cloudflare's 20,000 hard cap** on the Free plan. The 2,343 restored
translations are what crosses it. Two ways out, and it is the owner's call:

1. **The account move** (chatoccmed is Paid, cap 100,000) — blocked on one API
   token, below.
2. **Pull the 2,343 translations back out**, deploy the hub work at ~19,825
   files with `TA_MAX_DEPLOY_FILES=19900`, and restore them after the move.
   The owner explicitly asked for them to go back in, so do not do this without
   asking.

After that, in order: the homepage (see the correction at the top), then the
9 hand-written pages per locale, then Phase 3.

## Blocked on the owner: one API token

The account move cannot proceed without it. The current token reaches only account A and **cannot read DNS records or rules/lists** (verified).

Create at **My Profile → API Tokens → Create Token → Custom token**:

| scope | permission |
|---|---|
| Account | Workers Scripts · Edit |
| Account | Workers KV Storage · Edit |
| Account | Account Rulesets · Edit |
| Account | Account Filter Lists · Edit |
| Zone | Zone · Edit |
| Zone | DNS · Edit |
| Zone | SSL and Certificates · Edit |
| Zone | Workers Routes · Edit |

**Account Resources: include BOTH accounts.** Zone Resources: all zones from both.

The two account-level scopes are needed because Bulk Redirects do not travel with a zone — see below.

## The account move

Runbook: `_internal/CF-ZONE-MOVE-RUNBOOK.md`. Baseline captured in `_internal/migration/`.

- A = `chatmaliwan@gmail.com` `46cdce4b7061ce5424b187cf9353ba92` — Workers **FREE**, 20,000-file cap. Holds only this site.
- B = `chatoccmed@gmail.com` `2dd73a8e73f3df114fe87b1c159a2bfd` — Workers **PAID**, 100,000-file cap. 12 domains, 11 Workers. Already a Super Administrator of A, invite accepted.
- Zone `b280683b7ebdcd6e5bb51c4a3dc570d7`, registrar **name.com**, NS `aisha`/`greg.ns.cloudflare.com`.

**R2 does not move.** No `r2_buckets` binding, no `r2.dev` reference in `worker.js`, and pages point browsers straight at the public bucket URL. The bucket stays on account A and keeps serving. That removes the re-upload, the URL rewrite across 569 content files, the `~/.r2-uploaded.txt` trap that would have uploaded zero files while printing success, and the full rebuild — five of the six risks in the original analysis.

**Expected downtime 0-60 seconds, not hours.** Cloudflare's authoritative DNS is one anycast cluster keyed by zone name, so a resolver still holding the old delegation gets the new account's records the instant the zone activates; the 48-hour `.com` NS TTL is not an outage window.

**One variable decides everything: a valid TLS certificate must exist on account B before you touch name.com.** `_headers` ships `max-age=31536000`, so during a TLS gap returning visitors hard-fail with `ERR_SSL_VERSION_OR_CIPHER_MISMATCH` and cannot click through. **Do not reduce HSTS** — the site is not on the preload list, so lowering it reaches only visitors who return before the cutover, and it costs a deploy on an account with 199 files of headroom. Pre-issue the certificate instead.

Things this session found that the runbook did not know:

- **The site reaches the Worker through Worker Custom Domains, not zone routes.** Zone routes returns 0; `thailandaddict.com` and `www.thailandaddict.com` are both bound to service `thailandaddict`. Create custom domains on B, not routes, or the site simply will not respond.
- **HSTS comes from `_headers`, not the zone** (zone `security_header` is `enabled:false, max_age:0`), so it travels with the deploy.
- A second Worker, `ta-preview-glossy`, last modified 2026-07-04, needs a keep-or-drop decision.
- Zone settings to match on B: `ssl=full`, `automatic_https_rewrites=on`, `brotli=on`, `http3=on`, `security_level=medium`, `challenge_ttl=1800`, `always_use_https=off`, `min_tls_version=1.0`.

**DNS records that must survive**, or something breaks silently:

| record | if lost |
|---|---|
| `MX 10 mail.thailandaddict.com` -> 147.50.255.17 | domain email dies |
| `TXT google-site-verification=RKQnFealCiw74qJ8HFWpNlgVNp18v02d2ba7C7UKpKs` | Search Console un-verifies, history lost |
| `TXT v=spf1 a mx ip4:147.50.255.17 …` | outbound mail lands in spam |
| `mail` / `ftp` A records | hostatom services die |

**Search Console IS set up** — a Domain property verified by that DNS TXT. An earlier note in this file claimed otherwise because only a meta tag was checked.

**Bulk Redirects are account-level and do not move with the zone.** 472 legacy WordPress 301s live in `/accounts/{id}/rules/lists`. Skip re-creating them on B and every old indexed URL 404s — `/home/` already does. `setup-redirects-api.mjs` now accepts `CF_ACCOUNT_ID` so it can target B while `R2_ACCOUNT_ID` keeps pointing at A for the image uploader.

## Traps that will bite again

- **File budget 19,801 / 20,000.** Cloudflare silently drops files past the cap; this site has shipped with missing content that way. Moving `images/heroes` (218), `images/cities` (81) and `images/_cards` (211) to R2 frees ~510. The account move makes it moot by raising the cap to 100,000.
- **`.assetsignore` excludes `images/{hotels,cm,food,gallery}`.** New pages must reference them on the R2 base or they 404 in production while rendering perfectly here.
- **Clean URLs.** Internal links must not end in `.html`. Do not strip `.html` from affiliate deep links — `agoda.com/rayavadee-hotel/hotel/krabi-th.html?cid=` is legitimately one.
- **`@layer` loses to unlayered CSS.** `review.css` carried an unlayered `header{}` rule that overrode the shell's topbar on ~11,500 already-shipped pages. Removed. `[hidden]{display:none!important}` in an earlier layer also beats page-layer `!important` — that rendered the returning-visitor card as a blank 290px box.
- **`gen-new-locale-routes.mjs` regenerates the seven locale routes from a template** and will silently revert route-level fixes on its next run.
- **The baht sign is `U+0E3F`**, inside the Thai block. `U+20BF` is the Bitcoin sign.
- **`img.thailandaddict.com` does not exist.** Fonts are self-hosted at `/fonts/`.
- One malformed JSON file blocks the entire build; a scan of ~14,000 files found exactly one.

## Known gaps

- Homepage: the photo+name+score above the fold holds in the fresh state only; the resume card loads full-size R2 originals into 62px thumbnails.
- `dark-rtl.html` proves mirroring but contains no Hebrew and no `<bdi>` — bidi is still unproven.
- The focus ring keeps brand `#06B6D4` at ~2:1 on paper, below the 3:1 non-text floor. Deliberate, pending a decision.
- `/_proto/trip` reads no URL params, so a `?p=&d=` handoff does not work yet.
- `check-rtl.mjs` scans an explicit filename list, so the content-hashed `hub.<hash>.css` is not covered; it carries 15 pre-existing physical-direction declarations.
- ~~Shell tab-bar labels fall back to English in some locales.~~ Fixed in `cbaabb6da` — all nine locales supply a complete label set and `check-i18n-keys` layer 4 now fails the build on a gap.
- Activity hubs still have **zero save buttons** — `data-save` count is 0 on `activities-*` in every locale, including EN. The city hubs have 7,639. The activity cards are `<a>` elements, the same restructuring problem the city hubs' `<a>`-based cards have.
- The stat number on a city hub (`฿270–7,500`) wraps to three lines in a 152px card at 30px type. Cosmetic, all nine locales, pre-existing.
- Dangling references to the deleted `astro/src/content.config.ts` remain in `CLAUDE.md` and 14 prompt strings under `_internal/wf/`. They should point at `astro/src/lib/schemas.mjs`.

## Reading order

1. `_internal/REDESIGN-BLUEPRINT-2026-09.md` — the master spec
2. `_internal/BUILD-ROOTCAUSE-2026-09.md` — why the build failed and how it was fixed
3. `_internal/CF-ZONE-MOVE-RUNBOOK.md` — the account move
4. `_internal/HOMEPAGE-SPEC-2026-09.md` — the planner-first homepage contract
5. `_internal/shell/PROTO-KIT.md` — the markup contract; copy it verbatim
6. Memory: `redesign-2026-09-plan`, `design-direction-andaman-deck`, `cloudflare-accounts`, `velalist-trip-handoff`

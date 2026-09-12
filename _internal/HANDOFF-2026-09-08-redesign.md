# HANDOFF — Andaman Deck redesign

Last updated 2026-09-12. `origin/main` = `cf700ea49`.

**🚀 DEPLOYED 2026-09-12 — Worker version `b0bf2fc8`** (b0bf2fc8-42f5-4c88-a404-2d10e00ff29d),
17,146 pages, 19,784 deployable files. Everything below that said COMMITTED, NOT
DEPLOYED is now live and verified against production.

## Read this first

| | state |
|---|---|
| Phase 1 prototype `/_proto/` | **LIVE** |
| Planner-first homepage, th + en | **LIVE** at `/` and `/en/` |
| Planner-first homepage, the other 7 locales | **deliberately not done — see below** |
| Phase 2 — the 3 Astro layouts | **LIVE** |
| Permanent build fix | **LIVE** |
| Deploy gates (floor + ceiling) | **LIVE** |
| Phase 2 — destination hubs, all 9 locales | **LIVE** — 1,970 of 2,054 snapshots on the shell |
| Shell chrome in all 9 languages | **LIVE** |
| zh/ru/ko Plan-B article translations | **PARKED** to fit the cap — 2,384 files, restore command in `5aa03c966` |
| Cloudflare account move | prep done as far as possible; **blocked on one API token** |

### The homepage: what happened, and what it took

`c8c962649` was titled "planner-first homepage, verified and deployed". It wrote
`astro/public/_proto/home.html` and `_proto/en/home.html` — the prototype — and
never touched `astro/public/index.html`. The homepage a reader actually got
stayed the pre-shell `class="nav"` page. The second time in this project a
commit message has described a migration the artefact does not support; both
were caught by one grep against the built HTML.

Fixed in `285f09451`. Measured, same file before and after:

| | old `/` | new `/` |
|---|---|---|
| links | 105 | **427** |
| unique internal destinations | 11 | **194** |
| h2 / h3 | 0 / 0 | **17 / 36** |
| province hub links | 14 | **89** |
| Agoda (cid) · Booking (/go/b) · Trip (SID) | 4 · 1 · 0 | **12 · 11 · 11** |
| save buttons | 0 | **80** |
| JSON-LD blocks | 2 | **7** |

The root cause of the false claim was that `gen-proto-home.mjs` was a manual
step. **It is in `astro/prebuild.mjs` now**, after gen-hubs and before
gen-sitemap, and two gates would now catch a repeat:

- `check-page-coverage` asserted only that `dist/index.html` EXISTS — which the
  old homepage also satisfied. It now asserts the homepage is on the shell,
  carries a GA4 id, is not `noindex`, and clears a 20,000 B floor. Proven by
  putting the old homepage back into `dist`: exit 1, naming the missing
  `.ta-topbar`.
- `check-snapshots` named `gen-home.mjs` as the homepage's generator. That one
  only ever injected numbers between markers the new page does not have, so
  editing the real generator could never mark the homepage stale.

The prototype also had to be de-prototyped: `noindex`, a canonical and a WebPage
JSON-LD pointing at `/_proto/home.html`, a `/_proto/`-scoped webmanifest, no
hreflang, no GA4, and 86 bare relative hrefs (`href="home"`, `href="krabi"`).
And it hand-wrote its own chrome — a sixth copy, already drifted — which is now
`chrome.mjs`, making the homepage the fourth consumer.

**A regression worth knowing about, found by audit and fixed:** the swap
orphaned **12 live, sitemap-listed pages** that the old homepage linked and the
new one did not — the whole `michelin-*` cluster (5), the three `*-attractions`
guides, `chiang-mai-food-guide`, `top10-hotels-chonburi`, and the two cornerstone
pieces written specifically to be promoted from the homepage,
`where-to-go-thailand` and `thailand-10-day-itinerary`. All re-linked in the
`PILLS` table. Replacing a homepage is not a licence to orphan a content pillar
in the same commit — check this every time.

### Why the other seven locales' homepages did NOT move

Running `localize.mjs` over the new EN homepage gives **40.4% coverage**. Not
because the dictionaries are thin: 513 of its 683 unique strings are not UI copy
at all — they are opening hours, admission prices and review counts read out of
content data (`"08:00–16:00 (closed 3rd Wed–Thu of the month)"`, `"฿200 for
foreigners · free for Thais"`). No translation memory should hold those.

Measured before deciding: patch `T.zh` and `L.zh` into `gen-proto-home.mjs` and
`build('zh')` succeeds — and renders **0 of 11 plans and 0 of 8 guide cards**,
because the itinerary articles do not exist in zh. A 60%-English homepage is
worse than the fully-translated old one those readers have now.

So `localize.mjs` skips `index.html` and says which generator owns it, and
`_internal/homepage-i18n/build.mjs` (the old 127-anchor find-and-replace
localizer, which hard-fails on the new page) carries a header saying why it is
superseded. The real fix is a `T` copy table for the seven plus locale
itinerary content — that is a content job, not a markup one.

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

Worker `b0bf2fc8`, 17,146 pages, 19,784 deployable files, deployed 2026-09-12.
All three layouts, the hubs and the homepage share `shell.d3a3e44b.css` and
`shell.544635d9.js`.

Verified against production after the deploy, not against `dist`:

- `/` and `/en/` — planner-first, `.ta-topbar` + `.ta-tabbar`, GA4 present, not
  `noindex`, canonical correct, 434 crawlable links, 80 save buttons. h1 =
  "วางแผนเที่ยวไทย จากที่พัก ที่กิน ที่เที่ยว ที่เรารีวิวเอง".
- `/zh/activities-bangkok` — shell, tab bar 探索 / 目的地 / 搜索 / 行程, runtime
  strings blob present.
- `/ar/city-krabi` and `/he/activities-krabi` — shell, `dir="rtl"`, tabs
  استكشف / الوجهات / بحث / الخطة and גלו / יעדים / חיפוש / תוכנית.
- `/zh/` — still the OLD homepage, which is the intended state (see above).
- Parked articles: `/zh/krabi-seafood` 404s, `/en/krabi-seafood` 200s, and the
  hubs no longer link to the parked ones — **238 in-locale links sampled across
  ru/ko/ja/ar/he/hi hubs, 0 dead.**

At 375x812 the first screen is: h1 at y=76, the planner at 151, the submit
button at 287, and a real reviewed hotel's photograph at 429 — Rayavadee, 9.4
Agoda, 599 reviews, from ฿16,000. At 1280 the fold is two columns and the
photograph sits beside the planner. Both fresh-state claims; with a saved trip
the resume card takes that slot.

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

### The file cap, and what it cost to get under it

The owner chose option 2 on 2026-09-12: park the translations, ship the shell.

`5aa03c966` removed `articles-zh` (890), `articles-ru` (886) and `articles-ko`
(608) — 2,384 Plan-B city-guide translations. 22,168 → **19,784** deployable,
216 below the hard cap; 19,530 → 17,146 pages. `cf700ea49` raised
`MAX_DEPLOY_FILES` 19,000 → 19,800 in its own commit, as that gate asks.

**Every `reviews-<loc>` and `roundups-<loc>` stayed** — the booking funnel is
live in all seven locales. Cutting all 5,040 locale content files would have
reached 17,128 and taken the funnel with it, 2,656 files further than needed.

Restore, once the account move lifts the cap to 100,000:

```bash
git checkout 4a4397f08 -- astro/src/content/articles-zh \
                          astro/src/content/articles-ru \
                          astro/src/content/articles-ko
node _internal/gen-hubs.mjs
node _internal/i18n/localize.mjs zh ru ko ja hi he ar
node _internal/gen-hubs.mjs
node _internal/gen-sitemap.mjs
```

then put `MAX_DEPLOY_FILES` back to 19,000 so the countdown is visible again.
**16 files of headroom is all that is left** — the next ~16 pages turn the gate
red, which is what it is for.

### NEXT STEP

1. **The account move.** It is now the only thing standing between the parked
   translations and readers, and it is still blocked on one API token (below).
2. The seven locale homepages — a `T` copy table plus locale itinerary content
   (see above). Content work, not markup.
3. The 9 hand-written pages per locale, then Phase 3.

Three things an audit turned up that are real, verified, and NOT done, each
needing an owner decision rather than a patch:

- **`astro/public/data/home-index.json` is 1.06 MB that nothing reads.** Not the
  old homepage, not the new one, not `astro/src`, not `worker.js`. Written every
  build by `gen-home-index.mjs`. Deleting it is −1 MB and −1 file against the
  20,000 cap, but it is a delete, so ask first.
- **Only the default Krabi tab panel gets `ItemList` schema.** The other five
  province panels are in the DOM with ~60 more cards and no structured data —
  about 5/6 of the deck's schema value is unclaimed.
- **The homepage renders zero server-rendered affiliate anchors.** All 12 Agoda,
  11 Booking and 11 Trip URLs live in the `TA_HOME` blob and become clickable
  only once the planner renders a plan. The old page had two, both pointing at
  OTA homepages rather than a hotel — the weakest possible click, and the same
  kind the hub migration deliberately removed. Deliberate, but say it out loud:
  a visitor with JS off can browse and read, and books from a review page.

Referenced but absent: `90a3a3c64` points at `C:\Users\Imac\Thailandaddict\CLAUDE.md`
for machine-local traps. That file does not exist on this machine.

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

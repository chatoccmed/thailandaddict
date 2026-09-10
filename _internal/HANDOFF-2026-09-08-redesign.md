# HANDOFF — Andaman Deck redesign

Last updated 2026-09-10. Paused at the owner's request. `origin/main` = `d7e1b51dd`.

## Read this first

| | state |
|---|---|
| Phase 1 prototype `/_proto/` | **LIVE** |
| Planner-first homepage | **LIVE** |
| Phase 2 — the 3 Astro layouts (~17,187 pages) | **LIVE** (Worker `217fb226`) |
| Permanent build fix | **LIVE** |
| Deploy gates (floor + ceiling) | **LIVE** |
| Phase 2 — destination hubs | **COMMITTED, NOT DEPLOYED** — 570 of ~1,613 pages done |
| zh/ru/ko translations (2,343 files) | builds fine now; blocked by the 20,000-file account cap |
| Cloudflare account move | prep done as far as possible; **blocked on one API token** |

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

The homepage first screen at 375x812 shows the planner, then a real photograph, a real place name, and its real score and price, without scrolling — in the fresh state. With a saved trip the resume card pushes the score under the tab bar; that is a first-visit claim, not a universal one.

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

## NEXT STEP — finish the hubs

`d7e1b51dd` migrated the hubs `gen-hubs.mjs` writes. **570 pages are on the shell; 1,043 are not.** The rest are produced by `_internal/i18n/localize.mjs` from the EN pages.

Deploying as-is would leave TH/EN hubs on the new chrome and seven locales' hubs on the old one. **Finish `localize.mjs` first.** It injects its own RTL shims for `.mm` / `.nav-mid .drop` and builds its own `.lsw-item` language switcher — all three are pre-shell constructs that need removing, not porting. `check-snapshots.mjs` fails naming exactly the affected files, which is correct and is your worklist.

What the hub migration already bought, measured on generated HTML:

- the 644 files gen-hubs writes: **75.1 MB -> 45.9 MB** (-27.87 MB, -38.9%)
- **7,639 save buttons across 454 pages** — the hubs previously had none at all, on the site's primary SEO landing template
- honest price bands: `city-krabi` advertised **"จาก ฿150"** from a single hostel dorm bed against real prices spanning 150 to 22,000; it now reads **"฿420–6,000 /คืน"**
- **9,628 dead `#stay/#see/#eat` anchors -> 0**, now targeting the real `#p-*` ids, working with scripting off
- the mobile hamburger sat at `left=457` on a 375px viewport — unreachable; the shell tab bar replaces it

Left undone inside the hubs, deliberately: save buttons are only on the two `<div>`-based hotel-card builders (`ep-card`, `dcard`, `hcc` and the activity cards are `<a>` elements and cannot nest a `<button>` without restructuring); the hub hero is squeezed at 375px (pre-existing, blueprint 5.2.1); `cardPic()`/srcset, the real ARIA tablist, the decision router and the faceted filter are Phase 3.

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
- Shell tab-bar labels fall back to English in some locales.
- Dangling references to the deleted `astro/src/content.config.ts` remain in `CLAUDE.md` and 14 prompt strings under `_internal/wf/`. They should point at `astro/src/lib/schemas.mjs`.

## Reading order

1. `_internal/REDESIGN-BLUEPRINT-2026-09.md` — the master spec
2. `_internal/BUILD-ROOTCAUSE-2026-09.md` — why the build failed and how it was fixed
3. `_internal/CF-ZONE-MOVE-RUNBOOK.md` — the account move
4. `_internal/HOMEPAGE-SPEC-2026-09.md` — the planner-first homepage contract
5. `_internal/shell/PROTO-KIT.md` — the markup contract; copy it verbatim
6. Memory: `redesign-2026-09-plan`, `design-direction-andaman-deck`, `cloudflare-accounts`, `velalist-trip-handoff`

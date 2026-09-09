# Build failure on thailandaddict.com — root cause, one fix, and the gate that makes it shippable

**Verification date:** 2026-09-09 · Repo `C:/Users/Imac/Thailandaddict/thailandaddict` · HEAD `622f79bc2` on `redesign/andaman-deck`, tree clean · `origin/main` = `c8c962649` (contains `7fe61924c`, the zh/ru/ko commit).
Everything below is tagged **[M]** measured by me this session, **[S]** read in installed source, **[I]** inferred, or **[U]** unverified. No full build was run; `astro/dist` was empty (0 files) throughout, consistent with a build in progress.

---

## 1. Root cause

**Astro's content layer makes this build cost O(entire corpus), not O(one page) — and it does so four times over, for a site that uses none of the content layer's features.** Concretely: 19,530 JSON files (577,550,026 B / 550.8 MiB **[M]**) are serialized by `devalue` into a single 464,308,445-byte `data-store.json` **[M]**, that file is read back and handed to Rollup **as one JavaScript module** — `dataToEsm(JSON.parse(jsonData), {compact:true})` in `astro/node_modules/astro/dist/content/vite-plugin-content-virtual-mod.js` **[S]** — Rollup lexes, parses, scope-analyses and holds an AST for it for the whole bundle, and then all nine `[slug].astro` routes put every entry's **full `data` object into `getStaticPaths` props** **[S, read]**, materialising the corpus a third time. The store is 28.72 % non-Latin1 **[M]**, so V8 holds each copy as a two-byte string: **573.3 MiB per copy** **[M]**. Peak demand is therefore several gigabytes of *live, uncompactable* objects on a machine with 8,068 MiB of RAM and ~9.5 GB of free commit. The three "different" failures are one shortage with different referees: at `--max-old-space-size=12288` V8's brake is set above anything the machine can supply, so Windows refuses a `VirtualAlloc(MEM_COMMIT)` first and node dies in the allocator reporting a raw request size (the byte-identical 1.27 GB); at 6144/7168 V8's brake is below the build's genuine peak, so V8 refuses first and prints `Reached heap limit`; and the EPERM is `#writeFileAtomic` (`mutable-data-store.js`: read old file back into a string, compare, write `.tmp`, `fs.rename`) **[S]** losing a size-scaled race on a half-gigabyte temp file. The 2,343 zh/ru/ko files are not special — they are 8.2 % of the corpus, which is the width of the ledge. **The site is not short of memory; it is spending it about 40× over.** Measured floor for the same work: reading, parsing and discarding all 19,530 files one at a time costs **57 MB peak RSS in 6.9 s under a 1 GB heap cap** **[M]**.

---

## 2. Corrections to the three reports

| Claim | Verdict |
|---|---|
| Reports 1 & 2: *"V8 reserves a ~9.2 GB cage at startup; the OS refuses the reservation before a single file is read."* | **WRONG [M].** I probed node v24.16.0 at `--max-old-space-size` 2048 / 6144 / 7168 / 12288: `heap_size_limit` = flag + 192 MB every time, while `total_heap_size` was a constant **6 MB** and startup RSS a constant **37 MB** at all four settings. There is no up-front reservation. Report 3's mechanism is the correct one — V8 grows old-space lazily via committed pages, Windows charges each against the commit limit, and the flag only decides who says "no" first. |
| Report 1: *store is 324,398,582 chars; ~1.65× headroom to `MAX_STRING_LENGTH`.* | **WRONG [M].** Streamed the real file: **300,598,857 UTF-16 code units**, 86,346,217 non-Latin1 (28.72 %), against `MAX_STRING_LENGTH` = 536,870,888 → **56.0 % used, 1.79× headroom.** Reports 2 and 3 are correct. |
| Report 1: *"the deploy would fail even if the build succeeded"* (22,144 files vs 20,000). | **Arithmetic right, conclusion incomplete [M].** 20,000 is the **Workers *Free*-plan** static-asset cap; **Paid is 100,000** per Worker version, needs Wrangler ≥ 4.34.0. So this is a $5/month problem, not a wall — see §4. Which plan this account is on is **[U]** and must be checked. |
| Report 3: *"the content was unchanged, the write was skipped — and Astro paid the entire 3.4 GB to find that out."* | **Overstated [S].** `writeToDisk()` returns immediately when `#dirty` is false. The 3.4 GB is only paid on a dirty store — which a build always produces, so the cost is real, but the framing "Astro serializes an unchanged store" is not what the code does. |
| Reports 1 & 2 on Rollup's multiplier: 5.84× vs ~21×. | **Both are extrapolations from small fixtures [I], and they disagree by ~4×.** Neither number should be quoted as fact. They agree on direction and on the term being dominant; that is all that survives. Report 1's memory table rows 1/7/8 are extrapolated, rows 2–6 are arithmetic — as it says. |
| Report 3: *the June CI failure was not an OOM.* | **Correct, and I can add the mechanism [S].** An OOM exits non-zero, and the deploy step's `if:` has no `always()`, so it would be skipped. What *does* produce a green build with zero pages: `getCollection()` on a missing/empty collection **`console.warn`s and returns `[]`** (`dist/content/runtime.js`) — it does not throw. Empty array → `getStaticPaths` returns `[]` → zero pages → exit 0 → only `public/` survives into `dist`. **Exactly the reported symptom.** The site's own code widens this: `src/pages/zh/[slug].astro` wraps `getCollection` in `try {} catch {}`, and `src/lib/locales.ts` does the same. Content *was* tracked at that commit — 11,231 files under `astro/src/content` at `daf112768` **[M]** — so "CI checked out no content" is refuted. The specific trigger is still unknown and does not matter; the mechanism does. |
| Report 2: the verified `external-data-store` Vite plugin. | **Not reproduced by me [U].** Their end-to-end evidence (chunk 2,292 → 319 chars, marker absent, Thai/CJK pages byte-correct) is specific and plausible, and the plugin-ordering claim matches `create-vite.js` merging user plugins after Astro's. Treat as promising, not proven. |
| Report 3: *"session tooling holds 7,877 MB of commit; 23 Claude processes = 4,855 MB."* | **Not reproduced by me [U]**, but consistent with the observed 10.9 → 9.3 GB drift. |
| Collection count. | 27 directories under `astro/src/content` **[M]** (Report 3 said 28). Immaterial. |

Everything else in the three reports that I checked held up: the `dataToEsm` load hook **[S]**, `#writeFileAtomic` **[S]**, `toString() = devalue.stringify` **[S]**, `globalDataStore.set()` never called in `dist` so `import("astro:data-layer-content")` is the only path **[S]**, `getCollection` having **no cache** on the content-layer branch and running `updateImageReferencesInData` (a `neotraverse` copy) per entry per call **[S]**, `extraLocalesFor` in `locales.ts` not being memoized — 3 calls × 7 collections × 9 routes = **189 whole-collection loads per build, to read `.data.slug`** **[S]**, and the per-collection byte inventory.

**One new measurement that makes the fix cheap:** across all 19,530 files, `slug` **equals the filename stem in every single case** — 0 exceptions, 0 duplicate slugs within a collection **[M]**. And `src/` contains **zero** uses of `astro:assets`, `render()`, or `entry.body` **[M]** — so `updateImageReferencesInData` is pure overhead, and the layouts' only tie to the content layer is two `CollectionEntry<>` *type* imports.

---

## 3. The wrong fixes, and why

- **More heap tuning (any value).** Ruled out by measurement, not opinion: the live set exceeds 3.6 GB even in the configuration that *succeeds*. 6144 and 7168 are below the real demand; 12288 is above what the machine can commit. The flag only selects the error message.
- **A bigger pagefile.** Widens a window that keeps closing. Only 8.07 GB is real RAM; a multi-gigabyte live heap under a moving collector touches pages essentially at random, so the extra would be served at 4 KB granularity from disk. It also does nothing about a corpus that grows weekly.
- **Rebooting / closing tooling before each build.** Real (≈7.9 GB of commit back **[U]**) and worth doing today — but it is a ritual, not a fix, and it is defeated by the next 8 % of content.
- **Deleting or slimming content fields.** Report 1 audited this honestly and the answer is no: unreferenced fields total **1.70 MiB** against a multi-GB peak, cross-locale duplication is **already deduped by devalue** (only 6.16 MiB is shared), and shortening the 20 hottest property names buys ~47 MB. Rounding error.
- **Moving the zh/ru/ko files out before each build.** This is not a workaround for the deploy — **it is the thing preventing it.** Each "successful" build is a deliberate partial deploy, and `gen-sitemap` / `gen-search-index` / `gen-hubs` regenerate from the trimmed corpus too, so the sitemap and search index ship missing those locales as well.
- **Sharded local builds.** `content-layer.js` syncs every collection regardless of routes and the virtual module inlines the whole store into every bundle **[S]** — each shard pays the full peak. Worse, each shard's `prebuild` would rewrite the single global `sitemap.xml` / search index / hubs from a partial corpus, last shard wins: a green build with a broken site. That is the June failure, rebuilt on purpose.
- **Moving the build to GitHub Actions as *the* fix.** A 16 GB public-repo runner is 1.7× the current envelope on a corpus that grows weekly, and the `MAX_STRING_LENGTH` wall lands at 1.79× **[M]** — at which point the build is impossible on *any* machine at *any* heap size. CI buys roughly one doubling and then dies permanently. It is also the system that already shipped a partial dist. Do it later if you want it, on top of the fix; do not do it *instead*.
- **Upgrading to Astro 7** (which replaces `dataToEsm` with `JSON.parse("…")`). A two-major upgrade across 13k pages to make one term cheaper while leaving the architecture O(corpus). Not worth the blast radius.

---

## 4. The second wall — measure it before you celebrate the first

Fixing the build alone does not ship the articles. Measured deploy accounting:

- `astro/public`: 19,363 files, of which 17,275 are images **[M]**.
- `.assetsignore` excludes `images/{hotels,cm,food,gallery}` = 11,652 + 3,268 + 1,829 + 1 = **16,750** **[M]** → 525 images remain deployable; `public` contributes **2,613** deployable files.
- Pages are 1:1 with content files: 19,530 − 2,343 = **17,187**, exactly the page count of the succeeding build. 2,613 + 17,187 + 1 ≈ **19,801** — the number `prebuild.mjs` and `check-file-count.mjs` already document **[M, arithmetic closes]**.
- **With the translations in: 19,530 pages + 2,613 = 22,144 deployable files.**

Cloudflare Workers static assets: **Free = 20,000 files per Worker version, Paid = 100,000**, 25 MiB per file, Wrangler ≥ 4.34.0 required for the higher limit ([platform limits](https://developers.cloudflare.com/workers/platform/limits/), [changelog 2025-09-02](https://developers.cloudflare.com/changelog/post/2025-09-02-increased-static-asset-limits/)).

So: **on the Free plan these translations cannot ship by any amount of asset trimming.** Moving the last 525 images (heroes/cities/_cards/flags/team) to R2 leaves 21,619 — still 1,619 over. On Paid, 22,144 is 22 % of the cap and the problem disappears for years.

**Action, before anything else, because it is 60 seconds and it gates everything:** open the Cloudflare dashboard → Workers & Pages → Plans, and confirm the account is on **Workers Paid ($5/month)**. If it is Free, upgrade. There is no engineering alternative worth $5/month here (serving locale HTML from R2 through `worker.js` would work and is strictly a worse use of a week).

---

## 5. The fix: take the corpus out of the build graph

**Retire Astro's content collections for this site and read the JSON from disk at render time.** This is one fix with two mandatory parts — the build part and the deploy gate — not a menu. Peak memory becomes O(paths list) + O(one page), i.e. the 57 MB baseline plus one entry, on any machine, permanently. It also deletes the `data-store.json` file, the devalue write path, the Rollup AST term, the EPERM race and the `MAX_STRING_LENGTH` cliff in one move.

### 5.1 Prepare the baseline (do this first, it is the proof)

```bash
# 1. Snapshot a known-good dist from the CURRENT configuration.
#    (zh/ru/ko must be moved out for this build to succeed — that is the point.)
mkdir -p C:/Users/Imac/ta-holdout
mv astro/src/content/articles-zh astro/src/content/articles-ru astro/src/content/articles-ko C:/Users/Imac/ta-holdout/
cd astro && npm run build && cd ..
robocopy astro\dist astro\dist-baseline /E /NFL /NDL /NJH /NJS
mv C:/Users/Imac/ta-holdout/* astro/src/content/    # put them straight back
```
Reboot first if free commit is below ~10 GB. `astro/dist-baseline` must be gitignored (`dist/` already is; add `dist-baseline/`).

### 5.2 New file — `astro/src/lib/content-fs.ts`

```ts
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../content');

// VERIFIED 2026-09-09 across all 19,530 files: slug === filename stem, 0 exceptions,
// 0 duplicate slugs within a collection. Do not add an index; it is not needed.
const _slugs: Record<string, string[]> = {};
export function slugsOf(dir: string): string[] {
  if (_slugs[dir]) return _slugs[dir];
  let out: string[] = [];
  try {
    out = fs.readdirSync(path.join(ROOT, dir))
             .filter(f => f.endsWith('.json'))
             .map(f => f.slice(0, -5));
  } catch { out = []; }
  return (_slugs[dir] = out);
}

export function readEntry(dir: string, slug: string): any {
  return JSON.parse(fs.readFileSync(path.join(ROOT, dir, `${slug}.json`), 'utf8'));
}
```
Directory names are used directly (`'articles-zh'`, not `'articlesZh'`).

### 5.3 Rewrite the nine routes — `astro/src/pages/[slug].astro` and `astro/src/pages/{en,zh,ru,ko,ja,hi,he,ar}/[slug].astro`

The load-bearing change is that **`props` must no longer carry `data`**:

```astro
---
import { slugsOf, readEntry } from '../../lib/content-fs';
import { extraLocalesBySlug, extraReviewLocalesBySlug, extraRoundupLocalesBySlug } from '../../lib/locales';

export async function getStaticPaths() {
  const extra = await extraLocalesBySlug();
  const extraRv = await extraReviewLocalesBySlug();
  const extraRd = await extraRoundupLocalesBySlug();
  return [
    ...slugsOf('reviews-zh').map(slug => ({ params: { slug },
      props: { kind: 'review', dir: 'reviews-zh', availableLocales: ['th','en', ...(extraRv[slug]||[])] } })),
    ...slugsOf('roundups-zh').map(slug => ({ params: { slug },
      props: { kind: 'roundup', dir: 'roundups-zh', availableLocales: ['th','en', ...(extraRd[slug]||[])] } })),
    ...slugsOf('articles-zh').map(slug => ({ params: { slug },
      props: { kind: 'article', dir: 'articles-zh', availableLocales: ['th','en', ...(extra[slug]||[])] } })),
  ];
}

const { kind, dir, availableLocales } = Astro.props;
const data = readEntry(dir, Astro.params.slug!);   // one entry live at a time
---
```
Layout invocations below the fence do not change.

### 5.4 `astro/src/lib/locales.ts`

Replace all `getCollection(col)` with `slugsOf(dir)` (it only ever reads `.data.slug`), and **memoize** the three `extraLocales*` maps in module scope — today they are recomputed 27 times per build. `localizedSlugSet` is already memoized; keep its `readdirSync` over `public/<loc>`.

### 5.5 Layouts

Only two lines change, in `ReviewLayout.astro` and `RoundupLayout.astro`: drop `import type { CollectionEntry } from 'astro:content'` and type the prop locally (`data: any`, matching `ArticleLayout.astro`, or a hand-written interface). **No render logic changes.** Confirmed safe: no `astro:assets`, no `render()`, no `entry.body` anywhere in `src/` **[M]**.

### 5.6 Keep the validation you are deleting

Move the zod schemas out of `astro/src/content.config.ts` (415 lines) into `astro/src/lib/schemas.mjs` as plain zod — `zod@3.25.76` is already resolvable from `astro/` **[M]** — and add `_internal/qa/validate-content.mjs`, called from `astro/prebuild.mjs` alongside the existing gates: walk each content dir, `safeParse` every file, throw on the first failure naming the file and the zod path. Then delete `content.config.ts`; `data-store.json` stops existing.
**Gotcha to expect:** `z.object` strips unknown keys, so today's store holds a stripped shape. Reading raw JSON un-strips it. This can only *add* fields no layout reads (e.g. `typeFull`, populated in 6,641 entries and referenced nowhere), so output should be unchanged — and §5.8's diff proves it rather than assuming it.

### 5.7 Build script — `astro/package.json`

```json
"build": "node --max-old-space-size=4096 node_modules/astro/astro.js build"
```
Deliberately low. If O(corpus) behaviour ever comes back, this fails loudly and immediately instead of quietly eating the machine. Do not restore 12288.

### 5.8 Verify — byte-for-byte, not by eye

```bash
cd astro && npm run build && cd ..
diff -qr astro/dist-baseline astro/dist | grep -v '^Only in astro/dist:' | head -50
```
The only permitted differences are `Only in astro/dist:` lines — the 2,343 newly-present zh/ru/ko pages plus their sitemap/search-index/hub entries. **Any "differ" line on a page that exists in both trees is a regression: stop and fix it.** A clean diff is the whole proof.

---

## 6. The gate — this matters more than the build step

A partial deploy is worse than no deploy, and the mechanism that allows one is still live in the source: `getCollection` **warns and returns `[]`** rather than throwing, and the locale routes swallow errors in `try {} catch {}` **[S]**. Nothing between "zero pages" and `wrangler deploy` currently counts pages. `check-file-count.mjs` enforces a **maximum**; the missing half is a **minimum**.

**Add `_internal/qa/check-page-coverage.mjs`** — same house style as `check-file-count.mjs` (exported `assertPageCoverage(distDir)`, CLI entry, exit 1 with a remediation message):

1. For each of the 27 dirs under `astro/src/content`, list `*.json` → the expected slug set.
2. Map dir → output path: `reviews|roundups|articles` → `dist/<slug>.html`; `<kind>-<loc>` → `dist/<loc>/<slug>.html`.
3. Assert every expected file **exists and is larger than 2,048 bytes** — a stub page is as bad as a missing one.
4. Assert every content dir holding ≥1 JSON produced ≥1 page. This is the specific check that catches the June failure class.
5. Assert every `astro/public/<loc>/*.html` snapshot and `dist/index.html` survived into `dist`.
6. Print the first 20 missing paths and the per-directory expected/found table. Exit 1.

**Wire it into the only path to production.** Repo-root `package.json`:
```json
"scripts": {
  "build":  "cd astro && npm run build",
  "verify": "node _internal/qa/check-page-coverage.mjs astro/dist && node _internal/qa/check-file-count.mjs astro/dist",
  "deploy": "npm run build && npm run verify && npx wrangler@4.103.0 deploy"
}
```
From now on the deploy command is `npm run deploy`. Never `npx wrangler deploy` on its own.
After confirming Workers Paid, raise `MAX_DEPLOY_FILES` in `check-file-count.mjs` from 19,000 and `CLOUDFLARE_HARD_CAP` from 20,000 to the Paid values — **in its own commit that says the plan changed**, as that file's own comment demands. Pin wrangler (≥ 4.34.0) as a root devDependency so the version is not whatever `npx` resolves to that day.

If GitHub Actions is re-enabled later: keep `workflow_dispatch`-only until several manual runs produce a `dist` that diffs clean against a local one; switch `npm install` → `npm ci` (`astro/package-lock.json` is tracked **[M]**); add the same `verify` step between build and deploy; set the runner heap to ~10240 so V8 brakes before the Linux OOM killer; and confirm Cloudflare's own git build integration is disconnected so only one system deploys. But CI is optional after this fix, and it should not be the fix.

---

## 7. Fallback for today, on this machine

If the refactor takes a week, this ships the translations *this week* — in roughly an hour, in one file:

1. **Reboot, then build before opening anything else.** Report 3's census attributes ~7.9 GB of committed memory to the session's own tooling **[U]**; a cold boot buys back more headroom than any flag ever has.
2. **Add Report 2's `external-data-store` integration** to `astro.config.mjs` (currently 8 lines, no `integrations` array — add one). Inside `astro:build:setup`, `vite.plugins.unshift()` a plugin that resolves `astro:data-layer-content` to a module whose body is `export default JSON.parse(readFileSync(<storeFile>, 'utf-8'))`. `ImmutableDataStore.fromModule()` `devalue.unflatten`s the flat array either way **[S]**, so nothing downstream changes. This removes the single largest term — the Rollup AST — without touching content or pages.
   **Check two things before trusting it:** the emitted `chunks/_astro_data-layer-content_*.mjs` must be a few hundred bytes rather than hundreds of megabytes, and spot-check one Thai and one Chinese page in `dist` for correct rendered text.
3. Run `npm run verify` (§6) before deploying. Build it in one step, gate it in another.
4. **Delete this plugin when §5 lands.** It depends on 5.18.2's plugin-ordering internals, it leaves the 3 GB devalue write path and the 1.79× `MAX_STRING_LENGTH` cliff untouched, and it will break silently on an Astro upgrade.

None of this ships anything if the account is on Workers Free. Check the plan first (§4).

---

## 8. Cost, and what breaks if this is not done

**Effort.** Baseline snapshot ≈ 1 build. The refactor: 9 route files (mechanical, ~15 lines each), one new 25-line lib, `locales.ts`, moving 415 lines of zod into a standalone validator, deleting `content.config.ts`, and one dist diff — **1–2 focused days**. The coverage gate: **~2 hours**, and it is the half you must not skip. Fallback path: **~1 hour**.

**Money.** $0 for the build fix. **$5/month for Workers Paid** if the account is on Free — which raises the static-asset cap from 20,000 to 100,000 and is the only thing that makes 22,144 files deployable at all. No CI spend, no hardware required. (The 2 × 16 GB SO-DIMM upgrade Report 3 costed at ~$60 is a real option for the machine generally, but on an iMac19,2 it needs a technician and it does not fix an O(corpus) build — it just moves the cliff.)

**What breaks if it is not done.**
- **874 zh + 874 ru + 596 ko finished articles — 2,343 files, 639,183 lines, committed and already on `origin/main` [M] — cannot be published.** They are finished work sitting behind a build.
- Every build stays a coin flip whose odds worsen within a single working session (free commit drifts down as tooling accumulates) and worsen permanently as the corpus grows.
- Every "successful" build is a partial one: the sitemap, search index and hub snapshots are regenerated from a corpus with three locales cut out.
- At **1.79× the current store size** the build fails with `Invalid string length` on **any** machine at **any** heap setting **[M]** — a 16 GB CI runner does not save you, because that wall is not made of memory.
- And the coverage gate is not optional even if you never fix the memory: the code path that shipped a partial dist in June — `getCollection` warning instead of throwing, wrapped in the site's own `try {} catch {}` — is unchanged and can fire again the next time a directory is renamed.

**Sources:** [Cloudflare Workers platform limits](https://developers.cloudflare.com/workers/platform/limits/) · [Increased static asset limits for Workers](https://developers.cloudflare.com/changelog/post/2025-09-02-increased-static-asset-limits/) · [Workers static assets billing and limitations](https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/)
# ThailandAddict Redesign — Master Blueprint
**Version 1.0 · 2026-09-08 · This is the spec the build follows.**
Repo root: `C:\Users\Imac\Thailandaddict\thailandaddict`
All paths below are relative to that root unless given absolutely.

---

# PART 0 — THE DECISION IN ONE PAGE

Three blueprints arrived at three different theses. All three are partly right, and the correct answer is a specific merge, not a vote:

- **Blueprint 3 is right about the mechanism.** The site's real disease is that it ships **five headers, three token vocabularies and zero shared stylesheets** (`find astro/public -name "*.css"` returns nothing). Nothing else is achievable until one generated, content-hashed shell artifact is consumed by all four renderers. Its unique catch — that `_headers` `/*.js → immutable` would freeze `sw.js` for a year — is the kind of mistake that costs a month.
- **Blueprint 2 is right about the diagnosis.** The four production overlays (`proto.css → proto2 → proto3 → premium.css`) each explicitly promised *not* to touch nav, layout, spacing or images — and **every confirmed critical defect lives in exactly those layers**. That is why a fifth overlay cannot work, and it is the sentence to show the owner.
- **Blueprint 1 is right about the product.** Given owner decision #1, the planner is the point. Its data model (POI index, stable IDs, **legs derived at render and never stored**) is the only one of the three that survives contact with a map, a reorder and a shared trip. It is also the only one with a measurement plan and kill-conditions.

**The merge:** build the shell as a generated artifact (3), ship the palette first through a compat alias shim so 474 hub pages change look with zero markup edits (2), and make the planner a first-class rail/tab on top of a properly modelled POI index (1).

**Sequencing, decided:**
0. Reconcile with `origin/main` + ship ~10 one-line revenue/accessibility fixes that need no design approval (~2 days).
1. Seven high-fidelity clickable prototype pages on the live domain, `noindex`, installable — **owner approval gate**.
2. Shell + tokens site-wide (one hashed CSS/JS, one nav, one footer).
3. Structure fixes (mobile nav, responsive images, tabs, headings, hreflang, RTL).
4. POI index + save v3 + Trip rail/tab.
5. The planner.
6. Guide→Trip on 397 roundups (highest revenue-per-engineering-day item in the plan).
7. Search, then shell polish / PWA, then i18n reconciliation.

---

# PART 1 — HONEST VERDICT ON EACH BLUEPRINT

## Blueprint 1 — Planner-First

**What it gets right**
- The strategic read is correct and matches the owner's decision: 4,949 verified places + 3,511 ranked picks + 4,596 authored `day` blocks is a planning database wearing a magazine costume.
- **The best data model of the three.** `ta.trip.v3` with `poiId` references, a separate `saves[]` inbox, and — critically — *travel legs derived at render, never stored*. That single decision eliminates an entire class of staleness bugs that both other blueprints leave open.
- The POI index design (per-province shards ~20–120 KB, plus a ~200 KB `poi-lite.json`, plus an EN name overlay reusing TH geometry) is the right shape for a static site with a 20k-file ceiling.
- One store module (`ta-store.js`) as the *only* writer, killing the four-writers/two-identity-keys bug outright. Correct and necessary.
- Only blueprint with a measurement plan, per-placement `cjSid` shipped *before* CTAs move, and explicit kill-conditions.
- Correctly defers Pagefind on file-count grounds (see FC-3 — it is even more right than it claims).
- Its risk register is the best of the three; risks #1–#3 (tx() English keys, homepage 127 anchors, Astro scoped CSS vs `set:html`) are the three traps most likely to silently destroy a redesign here.

**What it gets wrong or under-specifies**
- **Design directions are thin.** Option B is dismissed in two lines and Option C is folded into dark mode. The owner explicitly asked for three genuine directions; this does not deliver them.
- **STRR = 25% at 90 days is not a credible target.** No baseline exists, and this site's traffic is dominated by single-shot organic and AI-answer arrivals. Keep the metric; delete the number until four weeks of baseline exist.
- Proposes swapping Sarabun → IBM Plex Sans Thai Looped, then in its own risk #7 concedes "most of the win is in the metrics, not the face." That concession is correct; the swap should not survive it.
- Puts the mobile sticky CTA *above* the tab bar on review pages. On a 375×812 screen that is ~130 px of fixed chrome before safe-area, on the page that makes the money. Blueprint 2's answer is better.
- Some phase estimates (Phase 3: full planner + map + `/saved` + `/t/:id` upgrade + exports in 10–14 days) are optimistic by roughly 2×.

**Verdict: adopt its planner, its store, its POI index, its measurement discipline and its risk register. Replace its design-direction section and its bottom-edge decision.**

---

## Blueprint 2 — Editorial-Premium First

**What it gets right**
- **The single sharpest insight in the whole set:** the additive-overlay contract is *why* the site still fails. Quoting `proto3.css`'s own header ("ไม่แตะ: หัวข้อ section, nav, ระยะห่าง, โครงหน้า, รูป hero") against the defect list is the argument that justifies a structural redesign rather than proto4.
- **The best delivery mechanism:** `ta.css` + a `compat.css` alias block (`--bl: var(--teal-700)` …) so the new palette, type and elevation reach **all ~18,000 pages in one commit with zero markup changes**, then each layout is de-shimmed independently. This de-risks the whole programme and makes an A/B of the palette alone possible.
- **The best bottom-edge decision:** on review pages, suppress the tab bar entirely and let `.rvbar` own the bottom, absorbing Save as its secondary. Four fixed elements already fight for that corner; adding a fifth is not an option, and this simultaneously fixes the untappable Trip.com card and puts Save next to Book, where the decision happens.
- The most complete design-system section: full ramps, role reassignment (teal = only UI primary, coral = editorial only, mango = rarity only), verified contrast, a P3 enhancement layer, and three *named* directions with honest rejection reasons.
- `/how-we-rank` as a public honesty commitment is a real, cheap, uncopyable moat and the natural home for the site's existing cons discipline.
- Correct on eat-first planner sequencing: restaurants are 95.3% geocoded *today*, hotels are 15.7%.

**What it gets wrong**
- **`ta.v1.css` manual version bumping is a foot-gun.** `_headers` serves `/*.css` immutable for a year; a human who forgets to bump ships nothing. Content-hashing costs ~20 lines and removes the failure mode entirely. Reject.
- **It underweights the planner**, calling it "a supporting tool." That directly contradicts owner decision #1, which is now the site's product thesis.
- **The heaviest font plan:** IBM Plex Sans Thai Looped + Anuphan + Fraunces + IBM Plex Sans across a Thai-mobile audience. Three families is a real LCP cost on the exact pages that matter.
- The "121 commits behind" figure is unverifiable from the dossier (see FC-1), and several claims about what `premium.css` already ships cannot be checked because those files are not in the local tree (FC-2).

**Verdict: adopt its palette work, its compat-shim migration strategy, its review-page bottom-edge rule, and `/how-we-rank`. Reject the manual `v1` filename and the three-family font plan.**

---

## Blueprint 3 — Shell-First

**What it gets right**
- **The cleanest build mechanism:** `_internal/gen-shell.mjs` runs first in `astro/prebuild.mjs` and emits `css/shell.<hash>.css`, `js/shell.<hash>.js`, nine manifests, `sw.js`, `offline.html` and `astro/src/data/shell-manifest.json`, which both `gen-hubs.mjs` and a new `Shell.astro` read. One import path, four renderers, ~18,000 pages.
- **The `sw.js` immutable-cache catch is unique and critical.** `_headers` line 48 `/*.js → max-age=31536000, immutable` matches `/sw.js`. Nobody else spotted it. A service worker pinned for 12 months is unrecoverable.
- **The bottom-edge contract** (`--floor`, `--cta-h`, a single declared z-index budget 0/100/500/600/700/900/1000) is the cleanest published solution to the five-fixed-element pile-up.
- The build-time RTL lint (fail on any physical property in `shell.css`) makes RTL correct by construction instead of by remembering.
- **The Pagefind Thai-segmentation catch is the sharpest technical finding in the whole set:** Pagefind segments Thai *content* at index time (v1.4.0) but its automatic query chopping shipped for **CJK only** (v1.5.0). Thai is not in that list, so a perfectly good Thai query silently returns zero results. That defect applies to the *existing* index too.
- The Phase-0 quick-wins commit (10 verified one-to-ten-line fixes, zero design dependency, deployable in a day) is the best sequencing idea in the set.
- The file-count assertion inside `prebuild.mjs` is the right place for the guard.

**What it gets wrong**
- **The Pagefind recommendation is fatal as specified.** Pagefind emits roughly one fragment file per indexed page. At 18,095 built pages that is ~18,000 files against **1,564 of headroom**. It would silently truncate the deploy — the exact incident `DEPLOY-RUNBOOK.md` Phase R documents. Keep its Thai shim; drop its Pagefind plan.
- The planner section is good but softer than Blueprint 1's: it stores per-item fields without Blueprint 1's explicit "legs are derived, never stored" invariant or its orphan-preserving migration.
- ~34 working days for shell + structure + planner + data + i18n is optimistic; treat it as ~45–55 with the prototype phase and QA included.
- Claims `viewport-fit=cover` is missing "in all four renderers" and that `gen-hubs.mjs:611` emits the "W" favicon — neither is verified in the dossier (FC-11, FC-12).

**Verdict: adopt its shell generator, its `_headers` fixes, its bottom-edge contract, its RTL lint, its quick-wins commit, its file-count gate and its Thai segmentation shim. Reject Pagefind-now.**

---

# PART 2 — FACT-CHECK AGAINST THE DOSSIER

## Confirmed by the audit (build on these without re-checking)

| Claim | Status | Evidence |
|---|---|---|
| Five nav implementations, three class contracts | ✅ | `gen-hubs.mjs:514` `.nav-mid/.nav-r`; layouts `.nmid/.nr`; `index.html:325`; `about.html:158`; `near-me.html:71` |
| One palette, two token vocabularies (same hexes) | ✅ | `gen-hubs.mjs:315` `--bl/--or/--go` vs layouts `--teal/--coral/--mango` |
| ~14.5 MB duplicated hub CSS | ✅ | 30,562 B × 474, md5 `b6ae5a7440d22acdfa3d18a1bb2430fc` on every page in every locale |
| ~10.3 MB duplicated base64 flags on 279 pages | ✅ | 36,930 B/page; the SVGs already exist at `astro/public/images/flags/*.svg` |
| 113,205 B = 49% of the 230,707 B Astro bundle is triplicated flag base64 | ✅ | `dist/_astro/_slug_.m2U8Ihv8.css` |
| Hub mobile nav is off-screen and unscrollable | ✅ | `.hb` left=457 on a 375 px viewport, `scrollWidth`=375 |
| `.ta-tripfab` (z 9000) blocks Trip.com on mobile reviews | ✅ | hit-test: Trip.com centre → `A.ta-tripfab` |
| USD/EUR/CNY unclickable on desktop reviews | ✅ | `cv-bar` z 120 under `.rvbar` z 900; `currency.js:64` lifts only ≤760 px |
| `#stay/#see/#eat` anchors dead sitewide | ✅ | ids are `p-stay` etc. (`gen-hubs.mjs:812,901`); links at `:547`, `homepage-i18n/build.mjs:45,52` |
| `Math.min(...prices)` → "฿150" on a ฿13,900 page | ✅ | `gen-hubs.mjs:773` |
| Count-up stats show wrong values for ~3 s | ✅ | measured 10→15→77; "1.6 คะแนนเฉลี่ย" → 3.8 |
| `tx(th,en)` keys on the literal English string, silent English fallback | ✅ | `gen-hubs.mjs:150-166`, 398 call sites, 2,716 translated strings |
| `homepage-i18n/build.mjs` = 127 exact-substring anchors, **not in prebuild**, already stale | ✅ | localized homepages show `2,200+` vs `/en/` `2,400+` |
| `astro/src/i18n/*.json` is dead code (522 strings, 0 importers) | ✅ | one commit `4798bf916`; `meta.json` is the only `dir`/`fontFamily` declaration and is never read |
| Astro scoped CSS cannot reach `set:html` (137 calls) | ✅ | ArticleLayout's 8 RTL rules compile to `p[data-astro-cid-…]` and never touch prose |
| ArticleLayout hreflang is asymmetric | ✅ | `:256-265` hard-codes th + optional en + only the current locale |
| Review pages: h1:1, h2:2, h3:0 | ✅ | built page count |
| Review sidebar "map" is a hotel photo with map alt text | ✅ | `mapImg` prefixes `images/hotels` 1833 / `images/gallery` 568, zero map tiles |
| `.pw-btn` is `<button data-href>`, not an anchor | ✅ | `ReviewLayout.astro:1170` + `:1346` |
| Roundup `.mbar` → `agoda.com/?cid=1965862` homepage | ✅ | `RoundupLayout.astro:1128` |
| Agoda on review pages carries only `rel="noopener"`; `us.trip.com` vs `www.trip.com` split | ✅ | live rel audit |
| Roundup EEAT fields 0/397 (~200 lines of dark layout) | ✅ | methodologyHtml, sourcesAndCitations, author, compareTopRows, lastVerifiedHtml, personaClosing |
| 3,511 roundup entries at ~100 % density; all resolve to real reviews; 2,361 distinct = 98.3 % of corpus | ✅ | |
| Geo: hotels 377/2401, attractions 288/1083, restaurants 2876/3018, articles 0/4039, michelin 0/485 | ✅ | |
| `near-me-index.json` already holds 2,095 geo places | ✅ | |
| Prices are display strings everywhere; naive parse yields max 20,003,000 | ✅ | |
| `mergeTags()` discards 2,621 of 3,291 hand-written review tags | ✅ | `_internal/lib/place-tags.mjs`, 86-term vocab |
| webp manifest 628 entries vs 14,342 referenced images; `images/cm` 0 % covered | ✅ | 2,382 `.webp` exist on disk but are unregistered |
| Only 18 distinct `_lib/` stock images = 1.8 % of 34,290 refs | ✅ | photography is genuinely per-entity |
| 22 dead image refs, 464 unreferenced files, 1 broken ko JSON | ✅ | |
| `dist` 35,186 files − 16,750 ignored = **18,436 uploaded / 20,000** | ✅ | `.assetsignore` comment is stale by ~6,800 |
| `_headers` `/*.css` and `/*.js` immutable 1 yr; `currency.js`/`sortable.min.js` unhashed | ✅ | |
| Build ≈18 min, heap 12288 on an 8.5 GB box; `build-test.sh` uses 8192 and copies only `astro/src` | ✅ | so it exercises neither the generators nor the 502 public snapshots |
| `/api/plan` 14,257 ms live; Krabi day inside a Chiang Mai trip; article titles scheduled as activities | ✅ | verified end-to-end |
| `ITIN_SCHEMA` defined, never passed to `env.AI.run` | ✅ | `worker.js:294-330` |
| `collabAction()` is an unguarded RMW; KV allows 1 write/sec/key | ✅ | votes silently lost |
| `/t/:id` `afterEdit()` → `persistTrip()` overwrites the visitor's own plan | ✅ | `trip.html:579-581`, no shared-mode guard |
| `/api/suggest` consumes `RL_WRITE` | ✅ | shared with trip saves/votes/email |
| Search: 3.4 MiB index, 6,968 rows, linear scan, no Thai segmentation, 225→100 truncation, CM hub ranks #8 | ✅ | |
| `.ta-tripfab` ships `display:none` until first save | ✅ | `ReviewLayout.astro:1376` |

## Corrections and cautions

**FC-1 — "121 commits behind" / "~6 weeks behind" is unverifiable; the *direction* is confirmed.**
Two independent audit lenses disagree in a way that proves production is ahead: the code audit found **no** `astro/public/**/*.css` at all, while the live audit found `/css/proto3.css`, `/css/premium.css`, `/js/proto3-motion.js`, `/js/premium-motion.js` loading in production. GA4 confirms it too: local `Analytics.astro` holds `G-XXXXXXXXXX`, production fires `G-JDXCTEMMFB`. **Do not trust either number. Step zero of Phase 0 is `git fetch && git rev-list --left-right --count HEAD...origin/main` and reading the result yourself.**

**FC-2 — Blueprint 2's claims about what `premium.css` already ships cannot be verified.** `@view-transition{navigation:auto}`, a brand focus ring, a reading-progress bar and a reduced-motion kill switch are all plausible, but those files are absent from the tree the dossier inspected. Read them after reconciling. If they exist, Phase 6 shrinks; if they don't, nothing else changes.

**FC-3 — Pagefind is worse than Blueprint 1 said and unshippable as Blueprint 3 specified.** Pagefind emits approximately one fragment file per indexed page. At 18,095 built pages that is ~18,000 new files against 1,564 of headroom — a >10× overshoot, not a marginal one. **Decision: fix the existing index now; revisit Pagefind only when it can be served from R2 behind a Worker route (`/pf/*`), where file count is unbounded.** Keep Blueprint 3's Thai segmentation shim regardless — it fixes today's index.

**FC-4 — the `CAP` claim needs one nuance.** `worker.js:5 CAP = {see:8, eat:5, stay:4}` is applied globally **for `see` and `eat` only**. Hotels already take top-3 *per province* at `worker.js:236-240`, and **`CAP.stay` is dead code — never read.** All three blueprints imply stay is globally capped. Fix the spec, not the belief: the ceiling is on attractions and restaurants.

**FC-5 — the save button is on ~16,400 pages, not 6,981, and on ZERO hub pages.** The 🔖 lives in the three Astro layouts (16,372 layout-rendered pages across 9 locales); `dist` root's 6,981 files are just the TH subset. More importantly, **`gen-hubs.mjs` emits no save affordance at all** — so the 474–476 destination hubs, the primary SEO landing template, are the one page class where a visitor cannot save anything. None of the three blueprints flagged this. It goes in the shell.

**FC-6 — `sortable.min.js` is not unreferenced.** `trip.html:15` loads it. Blueprint 1's "referenced by nothing else" is true only of hub pages; deleting it is correct **only after** `trip.html` is retired, which is what Blueprint 1 sequences anyway. Keep the ordering explicit.

**FC-7 — `viewport-fit=cover` is unverified.** The dossier confirms only that `env(safe-area-inset-bottom)` is honoured by `.rvbar`; it never inspects the viewport meta. Blueprint 3's "missing in all four renderers" is a plausible inference, not a finding. Check it in Phase 0; the fix is one attribute either way, and **do not copy Agoda's `maximum-scale=1,user-scalable=no` or Klook's `user-scalable=no`** — that fails WCAG 1.4.4 on a site serving Thai, Arabic and Hebrew readers.

**FC-8 — the "W" favicon is confirmed only in `ReviewLayout.astro:790`.** The dossier describes gen-hubs' favicon as "inline-SVG" without naming the glyph. Check both.

**FC-9 — the `isEn ?` / `isTh ?` bypass count is internally inconsistent in the audit.** The headline says "~34 UI strings"; its own per-file counts sum to 57 (`isEn ?`: Review 13, Roundup 21; `isTh ?`: Article 15, Review 5, Roundup 3). Budget for ~57.

**FC-10 — page-count figures disagree slightly across audit lenses.** Content JSON across 27 collections = 18,714; the i18n lens quotes 16,372 Astro pages but its own breakdown sums to 18,714; `dist` holds 18,095 HTML. Use **≈18,100 built HTML pages from ≈18,700 content files**, and treat 474 vs 476 hub snapshots as "≈476". None of this changes a decision.

**FC-11 — STRR 25 % is not a defensible target.** Instrument it, publish the baseline after 28 days, then set the number. Everything else in Blueprint 1's gauge table (affiliate CTR must-not-fall with a −5 % / 7-day rollback trigger; ≥20 % of affiliate clicks from trip surfaces by day 90; hub LCP p75 < 2.0 s) is sound and adopted as-is.

**FC-12 — Blueprint 1's "1,095 itinerary articles contain 4,596 `day` blocks" conflates two facts.** There are 1,095 `type:'itinerary'` articles and 4,596 `day` blocks corpus-wide; the blocks are not necessarily all inside itinerary articles. The Guide→Trip clone must read blocks, not article type.

---

# PART 3 — THE MASTER BLUEPRINT

## 1. North star and positioning

> **ThailandAddict is the only Thailand guide where a human has actually checked the thing — and where reading it produces a trip you can carry.** A traveller lands from Google or an AI answer on one hotel review in July, saves six places across three sessions without ever making an account, and in October opens that trip on their phone in Krabi — offline, in Thai, with the hotel already booked through our link. Every design decision is scored against one question: *does this make our judgement more legible, faster to reach, or more checkable?* An AI can invent a plausible Krabi itinerary in four seconds; it cannot tell you that this specific beachfront pool is the only one in Ao Nang under ฿3,000, because a named doctor checked. The redesign's job is to stop 13,000 fact-checked pages behaving like articles that rank, and start them behaving like inventory that plans.

**Positioning against the field:** we will never beat an OTA on inventory or an AI planner on speed. We beat both on *verified, dated, Thailand-specific operational truth* — cons on every single review (Booking cannot ship that), per-source score attribution, honest "from" prices with a check date, per-coast seasonality (the Andaman and the Gulf run opposite monsoons), and a planner that only ever schedules places we have written about.

---

## 2. Three design directions

The owner chooses one. All three are complete and shippable. Every value below is authored in OKLCH with the verified in-gamut sRGB hex given; components consume only the functional aliases, so switching direction is a ~30-line token diff, not a redesign.

---

### OPTION A — **ANDAMAN DECK** ★ RECOMMENDED
*A modernised evolution of the existing teal / coral / mango brand.*

**Mood.** Warm unbleached paper, deep Andaman water, terracotta rules, one marigold badge. Reads as a well-made travel tool with a magazine inside it — a premium instrument, not a coupon aggregator. Keeps every hue the brand already owns; corrects the three things that date it.

**The honest diagnosis this fixes.** The current triad is `#06B6D4` / `#FB7185` / `#FBBF24` = **Tailwind cyan-500 + rose-400 + amber-400, untouched**. Measured: `oklch(71.5% .126 215)` / `oklch(71.9% .169 13)` / `oklch(83.7% .164 84)`. All three sit within 12 points of lightness at chroma .126–.169. That is not a hierarchy, it is a colour wheel: nothing can be *the* accent, and none of the three can carry white text at 4.5:1. There is no neutral ramp at all, which is why every surface in the codebase is `#fff` or `#f1fbfd`. In travel specifically, cyan + coral + yellow at that saturation is the visual signature of deal aggregators — which fights both the editorial position and the honesty guardrail.

But the **hue positions are right for Thailand**: ~200° is Andaman water, ~30° is sunset and temple lacquer, ~80° is marigold and monk saffron. So: no rebrand. Three corrections — drop lightness so each colour can carry white text; cut chroma 35–45 % on anything used as a surface; rotate coral 13° → 31° (bubblegum → terracotta) and mango 84° → 78° (traffic-yellow → marigold). Then reassign roles so the palette has a hierarchy for the first time.

```css
/* ANDAMAN — the only UI primary, and the "in your trip" colour */
--teal-050:oklch(97% .012 200);  /* #ECF8F8 */
--teal-100:oklch(93% .028 200);  /* #D3EEEF */
--teal-200:oklch(87% .048 200);  /* #B0DEE1 */
--teal-300:oklch(78% .070 200);  /* #80C5C9  ← dark-mode accent */
--teal-400:oklch(68% .088 201);  /* #4BA9AF */
--teal-500:oklch(60% .092 202);  /* #279098 */
--teal-600:oklch(52% .085 203);  /* #10777F  white text 5.29:1 */
--teal-700:oklch(44% .073 204);  /* #075E65  white text 7.51:1 · on paper 7.19:1 */
--teal-800:oklch(35% .058 206);  /* #044349 */
--teal-900:oklch(27% .045 208);  /* #022C32 */

/* TERRACOTTA — editorial accent ONLY. Never a button. */
--coral-100:oklch(93% .035 38);  /* #FEE1D7 */
--coral-200:oklch(88% .060 36);  /* #FCCABD */
--coral-300:oklch(79% .100 35);  /* #F3A38F  ← dark-mode accent */
--coral-400:oklch(72% .130 33);  /* #EA846E */
--coral-500:oklch(66% .148 31);  /* #DE6B58 */
--coral-600:oklch(58% .145 30);  /* #C15344 */
--coral-700:oklch(49% .125 29);  /* #9B3F35  on paper 6.37:1 */
--coral-800:oklch(39% .100 28);  /* #712C25 */

/* MARIGOLD — rarity only (Michelin 🏅, 50 Best, one "best value" per list). ~1% of pixels. */
--mango-100:oklch(94% .045 88);  /* #F8EACA */
--mango-200:oklch(90% .075 86);  /* #F4DBA5 */
--mango-300:oklch(86% .115 82);  /* #F7CA75  ← dark-mode badge */
--mango-400:oklch(80% .150 78);  /* #F2B036  ink on it = 9.55:1 */
--mango-500:oklch(74% .150 72);  /* #E49921 */
--mango-600:oklch(66% .135 68);  /* #C8801F */
--mango-700:oklch(55% .115 64);  /* #9F6118  on paper 4.79:1 */

/* WARM SAND — the family the current palette lacks entirely. Does most of the work. */
--paper:oklch(98.5% .004 90);    /* #FBFAF7  ← page ground, NOT #fff */
--sand-100:#F5F3EF; --sand-200:#ECE9E4; --sand-300:#DEDAD3;
--sand-400:#C1BDB7; --sand-500:#9D9791;
--sand-600:oklch(55% .013 66);   /* #77706A  4.67:1 on paper */
--sand-700:#564E48; --sand-800:#3A312A; --sand-900:#261D17;
--ink:oklch(20% .018 56);        /* #1C140E  17.4:1 on paper */

/* NIGHT — hue-tinted, never #000 */
--night-950:oklch(17% .014 215); /* #081113 */
--night-900:#0F1A1D; --night-850:#172427; --night-800:#213133;

/* BRAND SIGNAL — the original hex, alive in exactly three places */
--brand-signal:#06B6D4;          /* logo mark · focus ring · active-tab indicator */
```

**Role allocation — this is the actual fix.**
- **Teal is the only UI primary.** Links, primary buttons, focus, active nav, active tab, progress — *and* the "in your trip" colour (see §3).
- **Coral is editorial-only.** Eyebrows, pull-quote rules, category tags, card-hover underline, the "ทำไมเราเลือกที่นี่" left rule. **Never a button.** This single reassignment removes the coupon-site read.
- **Mango is rarity.** Michelin, 50 Best, awards, one "best value" marker per list. Target ~1 % of pixels.
- **Pixel budget: 60 paper / 30 ink+sand / 9 teal / 1 coral+mango.**

**Why it wins:** total brand continuity across ~11,400 live affiliate links and 13k indexed pages; hues that are genuinely defensible for Thailand; the only direction with an unambiguous primary that can mean *actionable*; and it satisfies the owner's explicit ask without being a straw man. Migration is a token remap, not a redesign.

---

### OPTION B — **MONSOON INK**
*Near-monochrome newsprint. Monocle / Cereal territory.*

**Mood.** Heavy unbleached paper, warm black ink, one oxblood accent, zero radius on content, rules instead of shadows, all-serif display. The highest ceiling of the three and genuinely distinctive — it would look like nothing else in Thai travel.

```css
--paper:#F7F5F0; --surface-2:#FFFFFF; --surface-3:#EFEBE3;
--ink:#17150F; --ink-2:#3A362C; --muted:#6E695C;
--border:#DAD4C7; --border-strong:#BDB5A4;

/* OXBLOOD — the only accent */
--ox-100:#F3DEDB; --ox-300:#D9A29B; --ox-500:#A8433A;
--ox-600:#8C2F2A; --ox-700:#6E231F; --ox-800:#4C1714;

/* two functional-only hues, never decorative */
--moss-500:#4F6B4A; --moss-600:#3E5639; --moss-700:#2F4230;   /* ok / open */
--ochre-500:#A8781F; --ochre-600:#8A6018;                      /* check / warn */

/* dark */
--n-950:#14130F; --n-900:#1C1A16; --n-850:#24211B; --n-800:#2E2A22;
--dk-text:#EDE9DF; --dk-muted:#B7B0A0; --dk-accent:#D9A29B;

--r-0:0; --r-xs:0; --r-sm:2px; --r-md:2px; --r-lg:2px; --r-full:9999px;
--elev-0:none; --elev-1:none; --elev-2:0 1px 0 var(--border); --elev-3:0 16px 48px rgb(23 21 15/.16);
```

**Why we reject it.** It discards all brand recognition on a site with ~11,400 live affiliate links and 13k indexed URLs. It flattens food and beach photography, which is 90 % of the imagery and 100 % of the highest-revenue clusters. And a planner needs at least four distinguishable semantic states — *in your trip*, *check this*, *closed*, *we don't know* — which a near-monochrome must invent from tints, reading as noise on a day board. **Borrow its type discipline and its whitespace, not its palette.**

---

### OPTION C — **NIGHT MARKET**
*Dark-first, hue-tinted, app-native.*

**Mood.** A night ground with lit accents; feels like a native app rather than a website. Photography glows against it.

```css
--ground:#081113; --s2:#0F1A1D; --s3:#172427; --s4:#213133;
--text:#ECE9E4;      /* 15.8:1 */
--text-muted:#C1BDB7;/* 10.2:1 */
--border:#213133; --border-strong:#2C3E41;
--accent:#80C5C9;    /* teal-300, 9.77:1 */
--accent-fg:#022C32;
--editorial:#F3A38F; /* coral-300, 9.50:1 */
--highlight:#F7CA75; /* mango-300, 12.42:1 */
--flag-ok:#80C5C9; --flag-warn:#F7CA75; --flag-stop:#F3A38F; --flag-unknown:#9D9791;
/* light counterpart uses Option A's paper ramp with the same 300-step accents */
--elev-1:0 1px 0 rgb(255 255 255/.06);
--elev-2:0 1px 0 rgb(255 255 255/.08);
--elev-3:0 16px 48px rgb(0 0 0/.5);
img:not(.no-dim){ filter:brightness(.92) contrast(1.02); }
```

**Why we reject it as the primary direction.** 13,000 photo-led content pages read muddy dark-first, and a Thai reader on a bright phone outdoors is a real and common case. **But do not throw it away: these are exactly Option A's dark-theme values.** Authoring them now costs ~40 extra token lines; retrofitting dark mode across ~18,000 pre-rendered pages later costs a full rebuild.

---

### RECOMMENDATION

**Ship Option A — Andaman Deck, with Option C's values as its dark theme.**

Five reasons, in order of weight:
1. It is the only option that preserves brand recognition across ~11,400 affiliate links, 13k indexed URLs and an established teal identity.
2. Deepened teal (`#075E65`) carries white text at 7.51:1 — `#06B6D4` cannot carry it at all. That is the difference between a palette and a UI system.
3. A planner-first product needs one unambiguous primary meaning *actionable*, plus a warm neutral ramp for everything else. A and only A provides both.
4. The three hues are genuinely right for the subject matter, and the warm paper ground flatters food and beach photography where white and near-black both fail.
5. It satisfies the owner's explicit ask on the merits rather than as a compromise, and it is the cheapest to ship: a token remap plus a compat alias block, landing on ~18,000 pages in one commit.

---

## 3. Design system — Andaman Deck (full)

Source of truth: **`_internal/shell/tokens.css`**, compiled by `_internal/gen-shell.mjs` into `astro/public/css/shell.<contenthash>.css`, consumed by `_internal/gen-hubs.mjs`, `astro/src/components/Shell.astro` (all three layouts) and the ~24 hand-written pages. One file, one cache entry, one place to change the whole site.

> **Content-hash, not `v1`.** `astro/public/_headers` serves `/*.css` and `/*.js` as `max-age=31536000, immutable`. An unhashed name ships nothing to a returning visitor — the trap `/js/currency.js` and `/js/sortable.min.js` are already in. Hashing removes the human step.

### 3.1 Cascade layers

```css
@layer tokens, shell, page, util;
```
Page CSS can never accidentally out-specify the shell.

### 3.2 Functional aliases (components consume ONLY these)

```css
@layer tokens{
:root{
  color-scheme: light dark;

  --surface:var(--paper); --surface-2:#FFFFFF; --surface-3:var(--sand-100);
  --surface-chrome:color-mix(in oklab, var(--paper) 84%, transparent);
  --text:var(--ink); --text-muted:var(--sand-600); --text-invert:#FFFFFF;
  --border:var(--sand-300); --border-strong:var(--sand-400);
  --accent:var(--teal-700); --accent-hover:var(--teal-800);
  --accent-quiet:var(--teal-050); --accent-fg:#FFFFFF;
  --editorial:var(--coral-700); --highlight:var(--mango-400);
  --focus:var(--brand-signal);

  /* PLANNER SEMANTICS — teal means "in your trip", everywhere, and nothing else uses it as a fill */
  --trip:var(--teal-700); --trip-fg:#FFFFFF;
  --trip-soft:var(--teal-050); --trip-line:var(--teal-200);
  --flag-ok:var(--teal-600);      /* open · fits */
  --flag-warn:var(--mango-600);   /* check hours · tight timing */
  --flag-stop:var(--coral-700);   /* closed that weekday */
  --flag-unknown:var(--sand-600); /* we don't know — and we say so */
}}
```

**The single most important rule in the system: teal-700 as a fill means "in your trip."** Every filled 🔖, every saved marker, every map pin already in a day, every "in trip" chip, the rail, the Trip tab's active state. Nothing else on the site may use it as a fill. The user learns the colour in one tap and reads their whole trip at a glance thereafter.

### 3.3 Spacing, radius, elevation, motion, geometry

```css
/* SPACE — strict 4px base. No value off the ramp, ever. */
--sp-1:.25rem; --sp-2:.5rem; --sp-3:.75rem; --sp-4:1rem; --sp-5:1.5rem;
--sp-6:2rem;  --sp-7:3rem;  --sp-8:4rem;  --sp-9:6rem;  --sp-10:8rem;

/* RADIUS — split language: content near-square, controls fully round.
   Never exceed 12px on a content surface. */
--r-xs:2px; --r-sm:4px; --r-md:8px; --r-lg:12px; --r-full:9999px;

/* ELEVATION — hairline + tonal tint first. Shadows tinted with the ink hue, never neutral black.
   Content cards get --elev-0. Shadows are for things that genuinely float. */
--elev-0:none;
--elev-1:0 1px 2px rgb(28 20 14/.04), 0 2px 8px rgb(28 20 14/.06);
--elev-2:0 1px 2px rgb(28 20 14/.06), 0 4px 16px rgb(28 20 14/.08);
--elev-3:0 16px 48px rgb(28 20 14/.14);   /* modals only, one per screen */

/* MOTION — 4 easings, 4 durations. Never write a raw curve again. */
--ease-ui:cubic-bezier(.2,0,0,1);
--ease-enter:cubic-bezier(.16,1,.3,1);
--ease-sheet:cubic-bezier(.32,.72,0,1);
--ease-inout:cubic-bezier(.4,0,.2,1);
--dur-1:120ms; --dur-2:200ms; --dur-3:320ms; --dur-4:600ms;

/* SHELL GEOMETRY — the bottom-edge contract (§4.3) */
--safe-b:env(safe-area-inset-bottom,0px);
--safe-t:env(safe-area-inset-top,0px);
--topbar-h:56px; --tabbar-h:56px;
--floor:calc(var(--tabbar-h) + var(--safe-b));
--cta-h:0px;                  /* review pages set 64px on <body> */
--rail-w:320px; --rail-w-collapsed:56px;
```

### 3.4 P3 enhancement and dark theme

```css
@media (color-gamut:p3){
  :root{ --teal-500:oklch(60% .118 202); --coral-500:oklch(66% .19 31); --mango-400:oklch(80% .19 78); }
}

/* Three blocks so an explicit user choice always wins in both directions. */
@media (prefers-color-scheme:dark){ :root:not([data-theme="light"]){ /* dark tokens */ } }
:root[data-theme="dark"]{
  --surface:var(--night-950); --surface-2:var(--night-900); --surface-3:var(--night-850);
  --surface-chrome:color-mix(in oklab, var(--night-950) 84%, transparent);
  --text:#ECE9E4; --text-muted:#C1BDB7;
  --border:var(--night-800); --border-strong:#2C3E41;
  --accent:var(--teal-300); --accent-fg:var(--night-950); --accent-quiet:var(--night-850);
  --editorial:var(--coral-300); --highlight:var(--mango-300);
  --trip:var(--teal-300); --trip-fg:var(--night-950);
  --trip-soft:var(--night-850); --trip-line:#1B3A3E;
  --elev-1:0 1px 0 rgb(255 255 255/.06);
  --elev-2:0 1px 0 rgb(255 255 255/.08);
  --elev-3:0 16px 48px rgb(0 0 0/.5);
}
:root[data-theme="dark"] img:not(.no-dim){ filter:brightness(.92) contrast(1.02); }
```
In dark mode elevation is **lightness**, not shadow — shadows are invisible on a dark ground. Accents are **re-picked at the 300 step**; reusing `teal-700` on night is the classic failure.

**Verified contrast (measured):** ink/paper 17.4:1 · white/teal-700 7.51:1 · white/teal-600 5.29:1 · teal-700/paper 7.19:1 · coral-700/paper 6.37:1 · mango-700/paper 4.79:1 · sand-600/paper 4.67:1 · ink/mango-400 9.55:1. Dark: teal-300 9.77:1 · coral-300 9.50:1 · mango-300 12.42:1 · sand-200 15.77:1.

### 3.5 Typography — **keep Sarabun**

**Current state:** four families / nineteen weights (`Noto Sans Thai` 300–700, `Sarabun` 300–700, `Fraunces` opsz 400/500, `Outfit` 400–900) loaded **render-blocking** from `fonts.googleapis.com` on all ~476 hub pages (`gen-hubs.mjs:511-512`), and on the layouts via `media="print" onload="this.media='all'"` — which is worse, because it deliberately pushes font CSS off the critical path so the swap lands *after* LCP. Every page visibly reflows.

**Decision: two families, four self-hosted subset woff2 files on R2, two preloaded.** Blueprints 1 and 2 both proposed replacing Sarabun with IBM Plex Sans Thai Looped, and Blueprint 1 then conceded in its own risk register that "most of the win is in the metrics, not the face." That concession decides it. Swapping the Thai body face changes line counts, above-the-fold content and possibly LCP on ~13,000 long-form Thai pages, for a benefit that the leading/`font-size-adjust`/`word-break` rules deliver on their own.

| Role | Family | Weights | Subsets |
|---|---|---|---|
| Body + UI, both scripts | **Sarabun** (SIL OFL, looped) | 400, 600 | Thai `U+0E01-0E5B, U+200B, U+25CC` · Latin |
| Display + numerals + eyebrows (Latin) | **Outfit** (SIL OFL) | 500, 800 | Latin only |

Dropped entirely: **Fraunces** and **Noto Sans Thai** (Noto stays as a `local()` fallback). Net: 19 weights on a third-party origin → 4 files on our own R2, ~120 KB, `immutable` for a year, both `preconnect`s to Google removed.

```css
@font-face{font-family:'Sarabun';font-weight:400;font-style:normal;font-display:swap;
  src:url('https://img.thailandaddict.com/fonts/sarabun-400-thai.woff2') format('woff2');
  unicode-range:U+0E01-0E5B,U+200B,U+25CC;}
@font-face{font-family:'Sarabun';font-weight:400;font-style:normal;font-display:swap;
  src:url('https://img.thailandaddict.com/fonts/sarabun-400-latin.woff2') format('woff2');
  unicode-range:U+0000-00FF,U+0131,U+2000-206F,U+20AC,U+20BF;}
/* U+20BF = ฿ — MUST live in the Latin subset or every price on the site
   triggers a Thai-block download for en/ru/ko/ja/he/ar/hi readers. */
/* …600 pair, Outfit 500/800 pair… */

/* Metric-matched fallback kills swap CLS */
@font-face{font-family:'Sarabun-fb';src:local('Tahoma');
  size-adjust:106%;ascent-override:98%;descent-override:26%;line-gap-override:0%;}
```

**Fluid scale — `clamp()` on `vi` (RTL-safe), one ramp, no breakpoint jumps:**
```css
--step--2:clamp(.75rem,.729rem + .104vi,.8125rem);    /* 12→13 */
--step--1:clamp(.875rem,.854rem + .104vi,.9375rem);   /* 14→15 */
--step-0 :clamp(1rem,.958rem + .208vi,1.125rem);      /* 16→18 */
--step-1 :clamp(1.2rem,1.131rem + .343vi,1.406rem);
--step-2 :clamp(1.44rem,1.334rem + .53vi,1.758rem);
--step-3 :clamp(1.728rem,1.572rem + .782vi,2.197rem);
--step-4 :clamp(2.074rem,1.85rem + 1.12vi,2.746rem);  /* review/roundup h1 CAP */
--step-5 :clamp(2.488rem,2.173rem + 1.575vi,3.433rem);
--step-6 :clamp(2.986rem,2.551rem + 2.177vi,4.292rem);/* hub hero + tentpoles only */
```
Line-height is **never global** — paired per step and split by script.

**The dual-script block — the highest craft-per-byte change available, and no competitor in this market does it:**
```css
:lang(th){
  font-family:'Sarabun','Sarabun-fb','Noto Sans Thai',ui-sans-serif,system-ui,sans-serif;
  font-size:1.0625em;            /* Thai renders ~6% smaller at equal px */
  line-height:1.85;              /* body — never below 1.75 */
  letter-spacing:normal;         /* NEVER track Thai: browsers gap every cluster
                                    and detach tone marks (W3C flags it as a defect) */
  word-break:auto-phrase;        /* BudouX phrase segmentation, Chromium */
  line-break:normal;
  max-inline-size:62ch;
}
:lang(th) h1,:lang(th) h2,:lang(th) h3{ line-height:1.32; padding-block-start:.06em; }
:lang(en),:lang(ru),:lang(ko),:lang(ja){ line-height:1.6; max-inline-size:68ch; }
:lang(en) h1,:lang(en) h2{ letter-spacing:-.02em; }   /* negative tracking: Latin only */
.eyebrow{ font-family:'Outfit'; font-size:var(--step--1); font-weight:500;
          text-transform:uppercase; letter-spacing:.16em; color:var(--editorial); }
:lang(th) .eyebrow{ text-transform:none; letter-spacing:normal; font-weight:600; }
/* Every -webkit-line-clamp in the codebase currently shears tall Thai clusters (ปิ๊ ญ์).
   One rule fixes all of them. */
[class*="clamp"],.line-clamp,.card-title{ padding-block:.12em; }
h1,h2,h3{ text-wrap:balance; } p{ text-wrap:pretty; }
```

### 3.6 Images, motion guards, focus, targets

```css
/* Four ratios, never deviate: 3/2 cards · 16/9 wide hero · 4/5 mobile hero · 1/1 avatars.
   Always aspect-ratio + width/height + object-fit:cover. */

/* Scrim: eased multi-stop in oklab, ink-tinted, capped at 55% of the image.
   linear-gradient(to top,#000c,transparent) bands visibly — never use it. */
.ta-scrim::after{content:'';position:absolute;inset-inline:0;bottom:0;block-size:55%;
  background-image:linear-gradient(to top in oklab,
    rgb(28 20 14/.72) 0%, rgb(28 20 14/.58) 18%,
    rgb(28 20 14/.28) 42%, rgb(28 20 14/.08) 68%, transparent 100%);}

/* Hover scales the <img> inside an overflow:hidden wrapper, never the card. 1.04 ceiling. */

/* Reduced motion — note animation-timeline:auto. `animation:none` alone does NOT stop a
   compositor-driven scroll animation, and the off switch silently fails. */
@media (prefers-reduced-motion:reduce){
  *,*::before,*::after{
    animation-duration:.01ms!important; animation-iteration-count:1!important;
    animation-timeline:auto!important; transition-duration:.01ms!important;
    scroll-behavior:auto!important; }
  ::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}
}

:where(a,button,input,select,summary,[tabindex]):focus-visible{
  outline:2px solid var(--focus); outline-offset:2px; border-radius:var(--r-sm); }

/* 44px working floor (WCAG 2.2 AA is 24; Apple 44pt; Android 48dp).
   min-block-size + padding, NEVER fixed height — fixed height clips Thai and Arabic labels. */
.ta-tab,.ta-chip,.ta-btn,.ta-save,.ta-fac{ min-block-size:44px; min-inline-size:44px;
  display:inline-flex; align-items:center; }
.ta-icon-btn{position:relative}
.ta-icon-btn::after{content:'';position:absolute;inset:-10px}  /* hit area, no layout change */
```

**Icons:** one owned monoline set, 1.5 px stroke at 24 px (scaled proportionally, never 1px@16 + 2px@24), round caps, `stroke:currentColor; fill:none`, shipped as one inline `<symbol>` sprite in the shell partial, sizes 16/20/24 only. **No emoji in interface chrome** — the live audit found the flag switcher degrading to bare letters ("TH ที่สุดของไทย 2026") on platforms without regional-indicator glyphs, and the flag links carry no text, only `aria-label`. Emoji stay where the brand uses them deliberately: the 🔖 save label, the 🏅 badge, and inside prose.

---

## 4. The app shell

### 4.0 One artifact, four consumers

```
_internal/shell/tokens.css      ← §3
_internal/shell/shell.css       ← topbar, tabbar, rail, sheet, cta, toast, card, skeleton
_internal/shell/compat.css      ← old-token alias shim (2 releases, then deleted)
_internal/shell/shell.js        ← TA.saves · TA.nav · TA.theme · install · prerender guard
_internal/shell/sheet.js        ← one sheet controller (CloseWatcher → Navigation API → popstate)
_internal/shell/th-segment.js   ← Intl.Segmenter Thai shim (~15 lines)
_internal/lib/chrome.mjs        ← header(ctx) tabbar(ctx) rail(ctx) footer(ctx) sheetHost()
_internal/gen-shell.mjs         ← concatenates, minifies, content-hashes, writes:

→ astro/public/css/shell.<hash>.css        (~26 KB raw / ~7 KB br)
→ astro/public/js/shell.<hash>.js          (~9 KB raw / ~3.4 KB br)
→ astro/public/manifest.<lang>.webmanifest ×9
→ astro/public/sw.js                       (stable URL — see 4.0.1)
→ astro/public/sw-kill.js + astro/public/sw-kill.txt
→ astro/public/offline.html
→ astro/src/data/shell-manifest.json       { css, js, v }
```

`gen-shell.mjs` runs **first** in `astro/prebuild.mjs`, before `gen-hubs.mjs` (which must read the hashed filenames). `astro/src/components/Shell.astro` (~40 lines) reads the same manifest and emits the `<head>` block plus the shell partial for the three layouts. **`_internal/lib/chrome.mjs` and `Shell.astro` emit byte-identical markup consuming the same stylesheet.**

That one consolidation removes: ~14.5 MB of duplicated hub CSS, ~10.3 MB of base64 flags on 279 pages, 113,205 B (49 %) from the Astro bundle, the dead `lbTH`/`lbEN` builders (`gen-hubs.mjs:519-520`), ~21 lines of orphaned `.langsel` CSS in `index.html`, and the triplicated `.ta-tripfab` block.

**4.0.1 — two `_headers` rules that must land in the same commit as the shell:**
```
/sw.js
  Cache-Control: no-cache
  Service-Worker-Allowed: /
/manifest.*.webmanifest
  Cache-Control: public, max-age=3600
  Content-Type: application/manifest+json; charset=utf-8
/_proto/*
  X-Robots-Tag: noindex, nofollow
```
Without the first, `/*.js → immutable` freezes the service worker for twelve months. Add a build assertion that fails if `dist/sw.js` exists without that rule.

**4.0.2 — file-count gate in `astro/prebuild.mjs`:**
```js
const n = countFiles('dist') - countIgnored();
if (n > 19_000) throw new Error(`assets ${n} > 19000 budget — move images/heroes+cities to R2`);
```
Current: 18,436 / 20,000. Shell adds ~115 (2 hashed assets, 9 manifests, sw + kill + offline, ~10 icons, ~91 POI shards) → ~18,551, leaving ~1,449. Escape valve when needed: move `images/heroes/` (218) and `images/cities/` (81) to R2, same pattern as `images/hotels/`.

### 4.1 Mobile navigation (< 1024 px) — bottom tab bar

```html
<nav class="ta-tabbar" aria-label="หลัก">
  <a class="ta-tab" href="/"                       data-tab="explore"><svg/><span>สำรวจ</span></a>
  <a class="ta-tab" href="/country-thailand.html"  data-tab="places"><svg/><span>จุดหมาย</span></a>
  <a class="ta-tab" href="/search" data-sheet="taSearch" data-tab="search"><svg/><span>ค้นหา</span></a>
  <a class="ta-tab" href="/trip"                   data-tab="trip">
     <span class="ta-tab-ic"><svg/><b class="ta-badge">0</b></span><span>ทริป</span></a>
  <button class="ta-tab" type="button" popovertarget="taMore" data-tab="more"><svg/><span>เมนู</span></button>
</nav>
```
```css
.ta-tabbar{
  position:fixed; inset-inline:0; bottom:0; z-index:70;
  display:grid; grid-auto-flow:column; grid-auto-columns:1fr;
  block-size:var(--tabbar-h);
  padding-bottom:var(--safe-b); box-sizing:content-box;   /* safe-area ADDS, never eats */
  background:var(--surface-chrome);
  -webkit-backdrop-filter:blur(14px) saturate(1.3); backdrop-filter:blur(14px) saturate(1.3);
  border-block-start:1px solid var(--border);
  contain:layout paint;
  view-transition-name:ta-tabbar;      /* ← persists across navigation */
}
.ta-tab[aria-current="page"]{ color:var(--accent); }
.ta-tab[aria-current="page"]::before{ content:''; position:absolute; inset-block-start:0;
  inline-size:22px; block-size:2px; background:var(--brand-signal); }  /* original hex lives here */
body{ padding-block-end:calc(var(--floor) + var(--cta-h) + var(--sp-4)); }
:root{ scroll-padding-block:calc(var(--topbar-h) + 12px) calc(var(--floor) + var(--cta-h) + 12px); }
@media(min-width:1024px){ .ta-tabbar{display:none} }
```

Six decisions worth defending:
1. **Every destination is a real `<a href>`.** Traveloka ships `div[tabindex="0"]`, which removes the links from the crawl graph, breaks middle-click and screen-reader semantics, and **defeats Speculation Rules entirely** (document rules match anchors).
2. **Search is an anchor that JS upgrades into a sheet.** No JS → it navigates to the real `/search`. Progressive enhancement, not a JS dependency.
3. **More is `<button popovertarget>`** — declarative popover, top layer + light dismiss + Esc for free, zero JS. It is an action, not a destination.
4. **The Trip badge is always present, showing `0`.** This replaces `.ta-tripfab`, which ships `display:none` until the first save — the affordance for saving currently does not exist until you have already saved.
5. **No language switcher in the bar.** It lives in More, so one component serves all 9 locales unchanged.
6. `aria-current="page"` is set **at build time** by each renderer (gen-hubs knows the slug, the layouts know `kind`) — never by JS, so it is correct on the prerendered paint.

### 4.2 Desktop (≥ 1024 px) — same shell, horizontal, plus the Trip Rail

The tab bar hides; the topbar grows `.ta-nav-desk` carrying the same five destinations plus the two existing dropdowns. **One markup source, one active-state contract**, so the five-nav divergence cannot re-form.

**Condensing topbar — compositor-driven, never animate `height` or `top`:**
```css
@supports (animation-timeline: scroll()){
  @property --topbar-pad{syntax:'<length>';inherits:true;initial-value:14px}
  .ta-topbar{ animation:ta-condense linear both;
              animation-timeline:scroll(root block); animation-range:0 180px; }
  @keyframes ta-condense{ to{ --topbar-pad:6px; background:var(--surface-chrome);
                              box-shadow:0 1px 0 var(--border); } }
}
/* Firefox still flags scroll-driven animations → zero-height sentinel + IntersectionObserver
   toggling .is-condensed, transitioning the same properties. Mandatory, not optional. */
.ta-topbar{ view-transition-name:ta-topbar; }
```
Also fix the 2 px seam: `.tabwrap` is `position:sticky; top:64px` while `.nav` is `height:66px`. Both become `var(--topbar-h)`.

**The Trip Rail (desktop only):**
```css
.ta-rail{
  position:fixed; inset-block:var(--topbar-h) 0; inset-inline-end:0;
  inline-size:var(--rail-w-collapsed); z-index:30;
  background:var(--surface-2); border-inline-start:1px solid var(--border);
  box-shadow:var(--elev-2);
  transition:inline-size var(--dur-3) var(--ease-ui);
  view-transition-name:ta-rail;          /* ← does not repaint on navigation */
}
.ta-rail[data-open]{ inline-size:var(--rail-w); }
@media(min-width:1024px){ body{ padding-inline-end:var(--rail-w-collapsed); } }
@media(max-width:1023px){ .ta-rail{ display:none; } }   /* mobile uses the sheet */
```
- **Collapsed (56 px, default):** vertical 🔖 glyph + count badge in `--trip`.
- **Expanded (320 px):** trip title, day tabs (`วันที่ 1 · 2 · 3 · บันทึกไว้`), item list, per-day travel roll-up, and a drop target. Dragging a review card onto it adds to the selected day; `⋮ → ย้ายไปวันที่…` does the same without dragging (WCAG 2.5.7).
- Preference in `localStorage['ta.rail']`; forced open on `/trip` and `/saved`.

**Critically, both the rail and the tab bar are layout-participating** (`padding-inline-end` / `padding-block-end` on `body`), not overlays. That structurally eliminates the collision class the FAB is in today.

### 4.3 The bottom-edge contract — and the review-page exception

Today five fixed elements fight for the bottom of the viewport: `.rvbar` (z 900), `.ta-tripfab` (z 9000, **blocks Trip.com**), `#cv-bar` (z 120, **covered by `.rvbar` on desktop**), `.mbar`, `.ta-plantoast` (bottom:84px hard-coded).

```css
:root{ --z-base:0; --z-sticky:100; --z-tabbar:70; --z-cta:60;
       --z-toast:80; --z-header:700; --z-popover:900; }
/* <dialog> sheets live in the browser top layer — no z-index, ever. */
.ta-cta   { position:fixed; inset-inline:0; bottom:var(--floor);                z-index:var(--z-cta) }
.ta-tabbar{ position:fixed; inset-inline:0; bottom:0;                            z-index:var(--z-tabbar) }
.ta-toast { position:fixed; bottom:calc(var(--floor) + var(--cta-h) + 12px);     z-index:var(--z-toast) }
```

**Review-page exception (this is the decisive call, and it fixes two critical revenue bugs at once):**
```css
.rl-page .ta-tabbar{ display:none }      /* tab bar suppressed */
.rl-page .ta-tripfab{ display:none }     /* FAB deleted; Save merges INTO .ta-cta */
.rl-page body{ padding-block-end:calc(var(--cta-h) + var(--safe-b) + var(--sp-4)) }
```
On review pages `.ta-cta` (the rebuilt `.rvbar`) owns the bottom edge and absorbs Save as its secondary action. This:
- restores **Trip.com**, currently untappable for any user who has saved anything — one third of "compare 3 sites";
- removes the corner pile-up entirely;
- puts Save adjacent to Book, which is where the decision actually happens;
- avoids stacking two fixed bars (~130 px before safe-area) on a 375×812 screen.

`#cv-bar` (currency) **moves into the More popover** — a display preference does not belong floating over content on 13,000 pages — which fixes the unclickable USD/EUR/CNY buttons by deletion rather than by z-index arithmetic. Rename `currency.js` → hashed `shell.<hash>.js` inclusion, or the fix never reaches a returning visitor.

**Prerequisite (verify in Phase 0, FC-7):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
Without `viewport-fit=cover`, every `env(safe-area-inset-*)` is 0. **Do not** add `maximum-scale=1` or `user-scalable=no`.

### 4.4 Page transitions — instant first, animated second

Order matters: a view transition on a slow page silently dies at Chrome's 4-second render deadline.

**(a) Speculation Rules** — the highest ROI-per-line item available, and absent from Klook, Agoda, Booking and Traveloka:
```html
<script type="speculationrules">
{"prerender":[{"where":{"and":[
    {"href_matches":"/*"},
    {"not":{"href_matches":"/api/*"}},
    {"not":{"href_matches":"/go/*"}},
    {"not":{"href_matches":"/_proto/*"}},
    {"not":{"selector_matches":".no-prerender, a[target=_blank], a[rel~=sponsored], a[rel~=nofollow]"}}
  ]},"eagerness":"moderate"}],
 "prefetch":[{"where":{"href_matches":"/*"},"eagerness":"conservative"}]}
</script>
```
`moderate` (200 ms hover / pointerdown), **never `immediate`** — on an 18k-page site that burns a Thai traveller's mobile data. Chrome caps non-immediate speculation at 2 prerenders FIFO, so it cannot run away. HTML is already served `max-age=3600, stale-while-revalidate=86400`, so speculated documents come from the edge cache.

**Two mandatory guards, both shipped in Phase 0 before the rules go live:**
```js
(function init(){
  if (document.prerendering){ document.addEventListener('prerenderingchange', init, {once:true}); return; }
  const nav = performance.getEntriesByType('navigation')[0];
  gtag('config', GA_ID, { anonymize_ip:true, prerendered: !!(nav && nav.activationStart > 0) });
})();
```
and the same guard around the Trip badge and any `localStorage` write, or the badge double-counts on activation. The `prerendered` dimension is also how the navigation gauge is measured.

**(b) Cross-document View Transitions:**
```css
@view-transition{ navigation:auto; types:slide; }
::view-transition-old(ta-hero),::view-transition-new(ta-hero){ object-fit:cover; overflow:hidden; }
/* the object-fit line is mandatory or images with different ratios stretch like taffy */
html:active-view-transition-type(forwards) ::view-transition-old(root){ animation-name:ta-out-start }
```
Direction types set in `shell.js` via `pageswap` (outgoing) and `pagereveal` (incoming — **must be in a parser-blocking `<script>` in `<head>`** or it fires too late). The hero handoff names only the clicked card:
```js
addEventListener('pageswap', e => {
  const a = e.activation?.entry && document.activeElement?.closest('a[data-vt-hero]');
  if (a) a.querySelector('img')?.style.setProperty('view-transition-name','ta-hero');
});
```
Persistent chrome comes from `view-transition-name` on `ta-topbar`, `ta-tabbar`, `ta-rail`, `ta-cta`. **Astro's `ClientRouter` is explicitly rejected** — it converts every navigation to client routing, re-initialises scripts on each one, collides with the thousands of inline handlers, and buys ~10 % more than the at-rule gives free. Firefox sees today's behaviour.

### 4.5 Sheets and close requests

Ship the **two-stop** version first (closed → 90 dvh): `<dialog>` + `@starting-style` + `transition-behavior: allow-discrete`, fully Baseline, gets top layer, `::backdrop`, focus trap and Esc for free.
```css
.ta-sheet{ position:fixed; inset:auto 0 0 0; margin:0; inline-size:100%;
  max-block-size:min(90svh, 90dvh - env(keyboard-inset-height,0px));
  border:0; border-start-start-radius:var(--r-lg); border-start-end-radius:var(--r-lg);
  background:var(--surface-2); overscroll-behavior:contain; box-shadow:var(--elev-3);
  translate:0 100dvh;
  transition:translate var(--dur-3) var(--ease-sheet),
             overlay var(--dur-3) allow-discrete, display var(--dur-3) allow-discrete; }
.ta-sheet[open]{ translate:0 0 }
@starting-style{ .ta-sheet[open]{ translate:0 100dvh } }
@media(min-width:1024px){ .ta-sheet{ inset:50% auto auto 50%; translate:-50% -50%;
  inline-size:min(680px,92vw); border-radius:var(--r-lg) } }
```
Multi-snap (peek 15 / mid 55 / full 92 dvh via `scroll-snap-type:y mandatory` + 1 px anchors — the 1 px height is required for Safari) is deferred to the planner map only, where it earns its cross-browser tax.

**Close requests** (`_internal/shell/sheet.js`, ~60 lines): `CloseWatcher` → `navigation.intercept` → `history.pushState`/`popstate`. On Android an open filter sheet must swallow the back gesture, not navigate away. Filter and day state **also live in the query string** (`?zone=railay&budget=mid`), so back/forward restores it and the state is shareable — while staying crawl-neutral, because filter links are never emitted as crawlable `<a>` (§5.9).

`overscroll-behavior: contain` on every sheet, rail and scroll pane. **Never `overscroll-behavior: none` globally** — removing the platform bounce makes the page feel stiff and dead. **No custom pull-to-refresh** — it cannot be reliably suppressed on iOS (Chrome iOS is WKWebView and ignores root `overscroll-behavior`) and re-implements a browser affordance for content that changes weekly.

### 4.6 Search entry point

- **Mobile:** the `ค้นหา` tab is a real `<a href="/search">` that JS upgrades into `taSearch`, a full-screen sheet with its own history entry, keyboard raised, visible Cancel.
- **Desktop:** an input in the topbar; zero-query panel shows recent searches from `localStorage` plus 6 curated destinations.
- **Always:** a real `<form action="/search" method="get">` with `name="q"` (today's homepage input has neither), so Enter and no-JS both work.
- Full ARIA combobox (`role=combobox` + `aria-expanded` + `aria-controls` + `aria-activedescendant`; panel `role=listbox` with `role=group` per entity type), 200 ms debounce, arrow keys traversing group boundaries.

### 4.7 Save and wishlist entry point

- 🔖 button with a **word**, never a bare icon, on every review, roundup entry, restaurant block — **and, new, on every hub card**, which today has no save affordance at all (FC-5).
- Toast naming the item + running count + one link onward; `aria-live="polite"`; ~3.5 s auto-dismiss.
- **Trip tab (mobile) / Trip Rail (desktop) with an always-present count badge**, replacing the `display:none` FAB.
- One writer only: `TA.save()` in `shell.js` / `ta-store.js` (§6.1.3). Every button emits `data-poi-id` at build time (~30 bytes); all listeners are **delegated** — one `addEventListener` on the document instead of per-element inline handlers, which simultaneously fixes INP and moves the site toward a strict `script-src` CSP.

### 4.8 Language switcher

The flag bar is the direct cause of the mobile overflow: nine 30×30 px links, 8 px apart, all under the 44 px floor, degrading to bare letters where regional-indicator glyphs are unsupported.

```html
<button class="lang-trigger" popovertarget="ta-lang" aria-label="ภาษา / Language">
  <svg/><span>ไทย</span></button>
<div id="ta-lang" popover class="lang-menu">
  <a href="/city-krabi.html"    hreflang="th" aria-current="true">ไทย</a>
  <a href="/en/city-krabi.html" hreflang="en">English</a>
  …generated from pageLocales(slug) / availableLocales…
</div>
```
```css
.lang-trigger{ anchor-name:--lang; min-block-size:44px; border-radius:var(--r-full) }
.lang-menu{ position:fixed; position-anchor:--lang;
  position-area:block-end span-inline-start;                 /* logical → he/ar mirror free */
  position-try-fallbacks:flip-block,flip-inline;
  border:1px solid var(--border); border-radius:var(--r-md); box-shadow:var(--elev-2);
  padding:var(--sp-2); min-inline-size:180px;
  opacity:0; translate:0 -6px;
  transition:opacity var(--dur-2), translate var(--dur-2),
             overlay var(--dur-2) allow-discrete, display var(--dur-2) allow-discrete; }
.lang-menu:popover-open{ opacity:1; translate:0 0 }
@starting-style{ .lang-menu:popover-open{ opacity:0; translate:0 -6px } }
.lang-menu a{ display:flex; align-items:center; min-block-size:44px; padding-inline:var(--sp-3) }
.lang-menu a[aria-current]{ background:var(--accent-quiet); color:var(--accent); font-weight:600 }
```
Wins: `popover` gives top-layer promotion (escapes the `overflow:hidden` that clips the flag bar today), light dismiss and Esc for free, zero JS. **Language *names* replace flags**, fixing both the emoji-fallback defect and the 30 px targets. **The 36,930-byte base64 flag stylesheet on 279 pages is deleted outright.** Availability-driven listing is preserved (`pageLocales()` / `lib/locales.ts` already do this correctly — do not regress it).

### 4.9 RTL — from one rule to correct by construction

Today: `dir="rtl"` is emitted correctly, and a Hebrew review page in `dist` contains **one** `rtl` occurrence — the `<html>` attribute. `review.css` and `roundup.css` contain zero. ArticleLayout's 8 real rules are Astro-scoped and provably never reach `set:html` prose.

**Rules for `shell.css`:**
- `margin-inline` / `padding-inline` / `inset-inline` / `border-inline-start` / `text-align:start|end` / `float:inline-end` **only**. Zero physical properties — enforced by a lint in `gen-shell.mjs` that fails the build.
- Flex and Grid already flip under `dir=rtl` — **do not** add `row-reverse` overrides; that double-flips.
- Mirror only direction-dependent glyphs: `[dir=rtl] .i-chevron,[dir=rtl] .i-arrow{scale:-1 1}`. Never clocks, checks, logos, play buttons or photographs.
- **Bidi isolation is required and currently missing:** every `฿` figure and Latin brand name inside Arabic/Hebrew prose gets `<bdi>` or `unicode-bidi:isolate`, or the currency symbol and digits visibly reorder. Same defect class as the wave-2 ฿→"บาท" leak.
- `dir`/`lang`/`fontFamily` come from `astro/src/i18n/meta.json` — the currently-dead file that is the **only** place they are declared, while four renderers each privately redeclare `new Set(['he','ar'])`. `gen-shell.mjs` becomes its first real consumer.

### 4.10 PWA and offline

**Manifest** (9 generated, one per locale; `he`/`ar` get `"dir":"rtl"`):
```json
{ "id":"/?src=pwa","name":"ThailandAddict — รีวิวที่พัก ที่กิน ที่เที่ยว ทั่วไทย",
  "short_name":"ThailandAddict","lang":"th","dir":"ltr",
  "start_url":"/?src=pwa","scope":"/","display":"standalone",
  "display_override":["standalone","minimal-ui"],
  "theme_color":"#FBFAF7","background_color":"#FBFAF7","orientation":"portrait-primary",
  "categories":["travel","lifestyle"],
  "icons":[{"src":"/icons/icon-192.png","sizes":"192x192","type":"image/png"},
           {"src":"/icons/icon-512.png","sizes":"512x512","type":"image/png"},
           {"src":"/icons/maskable-512.png","sizes":"512x512","type":"image/png","purpose":"maskable"}],
  "shortcuts":[{"name":"ทริปของฉัน","url":"/trip"},{"name":"ค้นหา","url":"/search"},
               {"name":"ใกล้ฉัน","url":"/near-me.html"}] }
```
Plus `apple-touch-icon` (absent today) and a dark `theme-color` variant (currently `#06B6D4` hard-coded in all four renderers). Fix the favicon while here — `ReviewLayout.astro:790` still emits a **"W"** glyph from the wherebest era.

**Install:** capture `beforeinstallprompt`, surface it as **one quiet row inside the More popover**. On iOS, a once-per-user dismissible hint with the real share glyph, gated on iOS && `!standalone`. **Never an interstitial** — Traveloka's full-viewport app modal is a Google intrusive-interstitial penalty for a site whose entire acquisition is organic.

**Service worker — deliberately narrow, and engineered to be reversible.**
Scope is `/trip`, `/t/*`, `/saved`, the shell assets and fonts, `/data/poi/<province>.json` for provinces in the user's trip, the HTML of pages the user actually saved (CacheFirst, capped at 60), and `/offline.html`. It **never** intercepts the other ~18,000 navigations.
- **NetworkFirst for HTML with a 3 s timeout** — never serve stale HTML by default across 18k pages.
- `navigationPreload.enable()` behind a feature check (recovers 50–200 ms of SW boot).
- Image cache capped at 400 entries — a traveller browsing 300 hotels must not fill their device.
- `/api/*` never touched.
- Cache names versioned atomically from `shell-manifest.v`, so a mismatched CSS/JS pair is impossible.
- **Kill switch, two layers, shipped day one:** `activate` polls `/sw-kill.txt`; if it returns `kill`, the worker deletes every cache, unregisters itself and renavigates clients. Plus `sw-kill.js` as a one-file swap. **Rehearse the kill switch on staging before the 5 % rollout step.**
- Rollout: `/_proto/` → 5 % via a hashed-cookie gate → 100 %, 48 h soak at each step.

**"บันทึกไว้ใช้ออฟไลน์"** on the Trip tab: one button that precaches every saved review page + that province's POI shard + hero images, showing a real byte count before you tap. That is the app-defining feature, and no OTA has it.

**No push notifications.** Not now, not later.

---

## 5. Page-by-page module blueprints

Notation: **[LIVE]** = renderable from data on disk today, zero content work. **[BACKFILL: x]** = needs the item sized in §7.

### 5.1 Homepage — `astro/public/index.html` (+ 8 locale twins)

Today: 1,758 KB / 16 requests, **1,526 KB of it eight unoptimised destination JPEGs** (chiang-rai 286 KB, prachuap 255 KB, surat-thani 224 KB), 134 `<img>` of which 0 are webp and 0 carry `width`/`height`, 6,835 px desktop / **9,889 px mobile**, all 77 provinces dumped inline as identical 📍 cards with Bangkok weighted the same as อำนาจเจริญ, and stat counters animating through wrong numbers for 3+ seconds.

> **⚠ Hard constraint:** `_internal/homepage-i18n/build.mjs` localises by find-and-replace over **127 exact HTML substring anchors**, most requiring an exactly-once match. **Fix the generator before the homepage** (Phase 4b), or every markup change hard-fails or silently mis-translates 7 locales.

**Module order (max 4,200 px mobile):**
1. **`.ta-hero-search`** [LIVE] — one 56 px input, `--r-full`, real form. On mobile it is the *only* thing above the fold besides the wordmark. **No hero image behind it** — a 286 KB photo to decorate a search box is an app-shell failure, and it makes LCP text.
2. **`.ta-pills`** [LIVE] — horizontally scrollable category rail, ~10 items, **each a real `<a>` to the page that actually exists**: `best-beaches-thailand.html`, `best-quiet-islands-thailand.html`, `best-cafe-hopping-thailand.html`, `best-viewpoints-mountains-thailand.html`, `best-historic-old-towns-thailand.html`, plus the 8 activity guides, michelin, bars, kids, diving. 2 px ink underline for active, never a filled pill. **This single fix converts the site's most prominent browse affordance from a lie into the real thing** — today 🏖️ ชายหาด points at `city-krabi.html#see`, an id that does not exist.
3. **`.ta-resume`** [LIVE] — *the planner-first move.* Rendered client-side from `ta.trip.v3` + `ta.recent`, shown only when there is real state: "คุณบันทึกไว้ 6 ที่ ใน กระบี่ · เปิดแผน →" with 3 thumbnails and a quiet "เริ่มแผนใหม่". Session-dismissible. **Forbidden copy:** "แผนของคุณกำลังจะหมดอายุ", "ราคาอาจเปลี่ยน", "อย่าให้แผนหาย" — all loss-framed, all breach the guardrail. The honest form is a neutral statement of state.
4. **`.ta-guides` rail** [LIVE] — 8 clonable guides (roundups + itinerary articles) with a "3 วัน" chip. The highest-value new homepage module: it converts a browser into a trip owner in one tap.
5. **`.ta-rail` × 3** [LIVE] — Michelin / 50 Best · trending destinations · latest guides. 78 % card width on mobile (the partial next card is the strongest scroll affordance), `<picture>` + `srcset`, each ending in "ดูทั้งหมด →".
6. **`.ta-regions`** — 77 provinces collapse to **6 region cards**, each opening a `<details>` (DOM-present, so crawlable and AI-readable) listing its provinces, plus "ดูทั้ง 77 จังหวัด →". Removes ~5,000 px of scroll and ~1.3 MB.
7. **`.ta-stats`** [LIVE] — **static numbers, no count-up.** A first-time visitor forming a trust judgement should not read "1.6 คะแนนเฉลี่ย" for three seconds on a site whose thesis is trust.
8. Editorial rail (Doctor Chat byline + avatar) · inline newsletter (existing `/api/email`, never a modal) · footer.

**Leaflet is removed from the homepage** — it lazy-loads ~200 KB + a WebGL/tile context for a decorative view. It moves to the planner and to zone roundups, where geography is the actual decision, and there it sits behind a static preview + "แสดงแผนที่" button.

### 5.2 Destination hub — `_internal/gen-hubs.mjs::provinceHub` (388 pages)

The worst page on the site and the biggest available win: 23,470 px tall, 2,841 DOM nodes, 578 links, 186 images with **zero `srcset`**, five pseudo-tabs that are `<div>` with no `href`/`role`/keyboard/URL state, 95 hotels in one unfilterable list, and **no mobile navigation at all**.

1. **`.ta-hero-dest`** [LIVE] — `heroPic()` `<picture>`, 16/9 desktop, 4/5 mobile, eased oklab scrim. **Collapses to one column below 900 px** (today the desktop 2-column hero survives at 375 px and squeezes the h1 into a 113 px gutter). Kicker + h1 + 3-chip fact row: `ช่วงที่ดีที่สุด · สนามบินใกล้สุด · งบต่อวันโดยประมาณ` [BACKFILL: seasonality].
2. **`.ta-answer`** [LIVE] — the existing derived answer block, 40–80 words, promoted above the fold, `SpeakableSpecification` already points at `.qa-body`.
3. **`.ta-router`** — **new, and the hub's real job.** 6 tap targets ≥88 px (2×3 at 390 px): `พักที่ไหน · เที่ยวอะไร · กินที่ไหน · กี่วันดี · ไปยังไง · ไปเดือนไหน`. Real `<a href="#p-stay">` anchors to sections **on this page**, not a new nav layer — and this is where the site-wide dead-anchor bug gets fixed.
4. **`.ta-kpi`** [LIVE] — final values on first paint. **Two honesty fixes:** label the scale (`"3.8 / 5"`), and replace the raw `Math.min(...prices)` at `gen-hubs.mjs:773` — which prints "฿150 ราคาเริ่มต้น" on a page whose top hotel is ฿13,900 — with a p10–p90 band: `"฿550–3,500 · ต่อคืน · ตรวจสอบ ก.ค. 2026"`.
5. **`เริ่มแผน N วันใน <จังหวัด>`** [LIVE] — primary CTA, materialises a trip from the province's top-ranked picks.
6. **`.ta-tabs`** [LIVE] — real ARIA tablist: `role="tablist"`, `<a href="#p-stay" role="tab" aria-selected id="tab-stay" aria-controls="p-stay">`, roving tabindex + arrow keys, **hash-synced** so a tab is deep-linkable and back-restorable. **All five panels stay in the DOM** (`hidden`, never JS-fetched) — content not in the initial HTML is invisible to AI crawlers and effectively does not exist in 2026.
7. **Stay panel gets the faceted filter** [LIVE] — the axis-derivation logic already exists at `RoundupLayout.astro:534-541`; lift it into `chrome.mjs` and feed it the hub's hotel pool. Facets: price band, star tier, zone, traveller type, score threshold. Apply button carries the **live count** ("แสดง 41 ที่พัก"); zero-count options **disabled and greyed, never hidden**; an applied-filter chip row above the grid; state in the query string.
8. **`.ta-season`** [BACKFILL: seasonality] — 12 month cells × 3 states, **each cell carrying a state word** (colour is never the only channel), plus a bold verdict sentence and festival collisions. **Must be per-coast:** the Andaman peaks Nov–Mar and the Gulf is offset ~6 months, so a national strip publishes confidently wrong advice for Samui/Phangan/Tao half the year. **Gate rendering on the destination having verified month data; render nothing otherwise.**
9. **`.ta-map-lite`** [BACKFILL: coords] — static preview + "แสดงแผนที่" swapping in MapLibre. **Renders only when ≥60 % of that cluster's POIs are geocoded**; otherwise the tab is not emitted. A map with 40 % missing pins is worse than no map.
10. Neighbourhoods [LIVE] · editorial interleave at grid positions 3 and 12 with the Doctor Chat byline [LIVE] · FAQ [LIVE] · neighbouring provinces [LIVE].

**The one helper that fixes the whole image problem.** `heroPic()` at `gen-hubs.mjs:195-198` is the only `<picture>`/`srcset` emitter and is hero-only. Card images are bare `<img>` at **eight** call sites (`:223, :635, :685, :700, :728, :788, :887, :918`):
```js
const cardPic = (src, alt, sizes = '(max-width:700px) 50vw, 360px', cls = '') => {
  const u = w => `${cdnImg(src, w)} ${w}w`;
  return `<picture><source type="image/avif" srcset="${[400,800,1200].map(u).join(', ')}" sizes="${sizes}">
  <img src="${cdnImg(src,800)}" srcset="${[400,800,1200].map(u).join(', ')}" sizes="${sizes}"
   alt="${esc(alt)}" width="800" height="533" loading="lazy" decoding="async" class="${cls}"></picture>`;
};
```
Swapping it into those eight sites cuts card image bytes by roughly an order of magnitude across every hub page in one commit. Also **delete `onerror="this.style.opacity=0"`** — it silently zeroes broken images into invisible holes, and those 7,299 handlers are the documented blocker for a strict `script-src` CSP. Replace with a delegated `error` listener rendering a `--sand-200` placeholder carrying the POI name.

### 5.3 Hotel review — `astro/src/layouts/ReviewLayout.astro` (~7,200 pages)

Already the best template on the site (19 requests, 58 KB, TTFB 266 ms, real webp). Heading structure is the weak point: a built page emits **h1:1, h2:2, h3:0**.

1. **Decision hero** [LIVE] — `minmax(0,1.55fr) / minmax(320px,1fr)` above 900 px; single column below with the image first at 4/3. Left: `<picture>` 3/2, `fetchpriority="high"`, **preload fixed to resolve to the same URL the markup selects** (today `ArticleLayout.astro:254` and `RoundupLayout.astro:586` preload the `.jpg` while `<picture>` picks the `.webp` — every article and roundup hero is fetched twice). Right, in fixed order: eyebrow (category · district) → `h1` at `--step-4` → **one-sentence verdict** (promote `_derivedQA`, already 100 % populated) → score chip **with its source named** → `จาก ฿13,900 / คืน · ตรวจสอบ ก.ค. 2026` → **two buttons: `เช็คราคา` (primary) and `🔖 เพิ่มเข้าทริป` (secondary)**. Must fit within 1.1 viewports at 375×812.
2. **Heading semantics** [LIVE] — promote every `div.sec-label` / `div.side-title` to real `<h2>`/`<h3>`. **The strings already exist in the `S` table; this is a tag swap** that gives 7,200 pages an outline, a TOC and section anchors for answer engines.
3. **At-a-glance `<dl>`** [LIVE] — canonical 8-field order from `info[]` (ประเภท 2,399 · Wi-Fi 2,321 · Check-in 2,266 · ห้อง 1,897 · อาหารเช้า 1,858 · สระ 1,803 · จอดรถ 1,794) + `qiCol5*`. **Fields with no verified value are omitted, never rendered as "–".** `id="at-a-glance"` — the cleanest retrieval chunk on the page.
4. **Pros / cons, moved above the prose** [LIVE] — `prPros`/`prCons` are 100 % populated and currently buried. `cons` is the single most valuable thing on the page and the one thing an OTA structurally cannot publish. Lint rule: fail any review whose cons are empty or contain a disguised compliment.
5. **Add-to-trip split control** [LIVE] — primary tap saves to the trip inbox (zero decision); chevron opens `เพิ่มใน วันที่ 1 / 2 / 3`. State reflects membership: filled + `--trip` when already in the trip.
6. **Gallery** [LIVE] — 5-cell mosaic + `<dialog>` lightbox lifted from `ArticleLayout.astro:986` (Review has none today), counted overflow ("+18 รูป"), swipe, `n / N`, focus return, **history-guarded so Back closes it**.
7. Body with interleaved photos [LIVE].
8. **Score block** [LIVE] — headline score → scale → **source badge + read date** ("Booking.com · 1,204 รีวิว · อ่านเมื่อ ส.ค. 2026") → 6 sub-score bars with the numeric value always present (`role="img"` + `aria-label`) → a `Booking 8.9 · Agoda 8.7` mini-table. **Never average across sources into an invented composite** — checkability is the whole advantage over an OTA.
9. **Price widget** [LIVE] — `<button data-href>` **replaced with real `<a rel="sponsored noopener nofollow" class="no-prerender">`**. Today's buttons are invisible to crawlers, un-middle-clickable, dead with JS off and carry no `rel`, on the primary in-body conversion module of 2,401 pages.
10. **Location card** [BACKFILL: coords] — the current `mapImg` is a **hotel photo with alt text "แผนที่บริเวณโรงแรม"**, an honesty and accessibility defect on 2,401 pages. Until coords exist, render address + district and no map. With coords: static map → live map on tap, plus a three-column `กิน / เที่ยว / พัก` nearby grid with walking minutes, scoped to the same district/cluster key (never the parent province, which causes cross-cluster cannibalisation).
11. Reading spine — desktop sticky rail scrollspy (`rootMargin:'-45% 0px -50% 0px'`), mobile a **non-sticky** in-body `<details>` (a sticky in-body TOC competes with global nav), 2 px progress bar in `--accent`.
12. **`.ta-cta`** [LIVE] — replaces `.rvbar`, owns the bottom edge, tab bar suppressed, FAB deleted, Save merged in. Hidden on scroll-down, revealed on scroll-up, always visible past 60 % depth. Name + from-price + **one primary button naming the real OTA** ("เช็กราคาบน Agoda →", not "Book now"). Gated on `hasRealOTA` so a Facebook-only rural stay never shows a fake booking bar.
13. **`rel` hygiene** [LIVE] — one `otaLink()` helper normalising `rel="sponsored noopener nofollow"` everywhere (Agoda on review pages currently carries only `noopener`) and fixing `us.trip.com` → `www.trip.com` on Thai pages.
14. FAQ [LIVE] · Related [LIVE] · Footer.

### 5.4 Roundup — `astro/src/layouts/RoundupLayout.astro` (~1,004 pages)

**The flagship page type.** 3,511 entries, every one resolving to a real review, with `score`, `stars`, `revCount`, `priceBig`, `addr`, `tags`, `pros`, `cons` at ~100 % density.

1. Hero [LIVE] — **converted from a CSS `background-image` to a `<picture>`**, so it joins the webp pipeline, gets `srcset` and alt text, and can be correctly preloaded. Same fix for `ArticleLayout`'s `.rhero`.
2. Byline strip [LIVE] — Doctor Chat + ✓ ตรวจสอบข้อมูลแล้ว + dates.
3. Answer block [LIVE].
4. **`เริ่มแผนจากไกด์นี้` — the single highest-leverage new module on the site.** One layout edit ships a clonable itinerary to all 397 roundups (+ EN twins) with **zero content work**. Duration selector `1 วัน / 3 วัน / 5 วัน`; tiers are strict subsets so the ranking is authored once. Full spec in §6.3.
5. **Comparison table** [LIVE] — generated from `data.toc` + `entries[]`: `อันดับ · เหมาะกับ · จาก ฿ · คะแนน (แหล่ง) · โซน · จอง`. Real `<table>` with `<caption>` and `<th scope=col>`, sticky header inside an `overflow-x:auto` wrapper, first column `position:sticky; inset-inline-start:0` on mobile with an edge fade. Every price cell carries `ตรวจสอบ <เดือน ปี>`. **The block most likely to be lifted whole into an AI answer.**
6. **"เหมาะกับ" badges** [LIVE] — one per entry, from a finite set, each awarded on a stated criterion: budget = below the pool's 25th percentile; luxury = above the 75th; top-rated = highest `score`; most-reviewed = highest `revCount`; best location = `mrtTag` present. **Cap at one badge per entry; entries with no defensible badge get none.** Slug prefixes only cover 78/397, so slug alone is insufficient.
7. **Sticky pick-nav** [LIVE] — desktop rail with scrollspy + progress track; mobile a 44 px strip showing `3 / 12 · Rayavadee` opening a full sheet. **Not a floating CTA** — a permanently floating affiliate button on comparison content signals "this page exists to sell", which is exactly the perception this site's trust position cannot afford.
8. Faceted filter [LIVE] — upgraded with live count, per-option counts, zero-count disabled-not-hidden, Clear-all, chip row.
9. **Pick cards** [LIVE] — rank badge, `เหมาะกับ` tag, image, 4-chip meta row, **`ทำไมเราเลือกที่นี่`** (40–70 words, `--editorial` 3 px left rule, tinted ground — the Speakable target and the AI-extractable unit), story, pros/cons, `bookButtons()`, `🔖 เพิ่มเข้าทริป`, and a mandatory `อ่านรีวิวเต็ม →`. **Gate the derived fallback on a real differentiator** (a sub-score > 9, an award, a verified price band); a fallback that says "a great choice in Krabi" is worse than nothing.
10. **`เพิ่มทั้งหมด (10)`** bulk save [LIVE].
11. **`.mbar` repointed** [LIVE] — `RoundupLayout.astro:1128` currently sends readers to `https://www.agoda.com/?cid=1965862`, a bare homepage with no destination and no dates. **Highest-value single-line revenue fix in the audit.** Repoint to a dated zone search or pick #1's own hotel URL.
12. **JSON-LD upgrade** [LIVE] — the `ItemList` currently emits `{position,url,name}` only, while the page displays score, stars, review count, price and address for every hotel. Emit full `Hotel` items with `aggregateRating` (third-party sourced, visibly attributed), `priceRange` and `address`. **Highest-value structured-data change available, zero content work.**
13. **Sort ≠ filter** [LIVE] — separate control, label shows current state ("เรียงตาม: อันดับของเรา"), 4 options max, default named honestly (never "Recommended") and linked to `/how-we-rank`.

The six schema-declared but 0/397 "Wave 2026+" fields (~200 lines of already-written layout) stay dark until §7 item 11 lights them up. **Do not delete them.**

### 5.5 Article — `astro/src/layouts/ArticleLayout.astro` (~10,510 pages)

The largest page class and the richest structured data on the site: **3,018 restaurant blocks at 95.3 % coords, 97.9 % hours, 99.1 % price, 100 % tags.**

- **hreflang fixed** [LIVE] — `:256-265` hard-codes th + optional en + only the current locale via eight separate `{lang === 'zh' && …}` lines, **ignoring the `availableLocales` prop it already receives**. A `/ru/` article never points at its existing `/zh/` or `/ko/` twin. Replace with the `{LOCS.map(...)}` pattern Review and Roundup already use correctly. **10 lines; repairs the cluster across 890 zh + 886 ru + 608 ko twins.**
- **A visible byline** [LIVE] — articles currently render **no byline at all**; the Person schema exists for machines only on 8,078 TH+EN pages.
- **Restaurant blocks become first-class POIs** [LIVE] — split add-to-trip control, an `openNow` badge derived from `hours`, dietary chips, price. Already routable, no backfill.
- **Itinerary articles become trip templates** [LIVE] — 4,596 `day` blocks of `{time, activity, note}`. A `เริ่มแผนจากไกด์นี้` CTA clones the day structure directly. **Honest caveat:** `activity` is free text, not a POI reference, so v1 clones produce `kind:'note'` items — a real day skeleton with real times, already better than a blank canvas. Phase 6b adds a name→`poiId` resolver.
- **Three eager iframes** at `:852-862` (Maps 420 px, FB 420 px, IG 480 px) get the **`data-src` facade the same file already implements 60 lines earlier** at `:796-798`. `loading="lazy"` defers the *fetch*, not the *execution*. Self-host Leaflet (currently `unpkg.com`, a fourth-party origin and a supply-chain dependency).
- **RTL** — delete the 8 scoped `html[dir=rtl]` rules; logical properties in `shell.css` reach `set:html` prose, which the scoped rules provably never did.
- Editorial interleave at grid positions 3 and 12, visually distinct with byline + avatar, **never styled to mimic a bookable listing**.
- `related` is `{href,title}` only (vs Review's `{href,img,name,loc,price}`) — render as a clean text-link grid with `--font-accent` eyebrows rather than faking cards.

### 5.6 Search — `astro/public/search.html` + `_internal/gen-search-index.mjs`

Today: 6,968 rows, **3.4 MiB downloaded whole**, linear `indexOf` scan per keystroke, **no Thai word segmentation**, a 4-bucket comparator, 7 aliases, hard truncation at 100 of 225 results with no pagination, and the Chiang Mai hub ranking **8th** for "เชียงใหม่".

**Decision: fix the existing index. Do NOT ship Pagefind yet** (FC-3).

1. **Thai segmentation, both sides — the highest-leverage line in this section.** `_internal/shell/th-segment.js`:
```js
export const segTh = q => {
  if (!/[฀-๿]/.test(q) || typeof Intl.Segmenter !== 'function') return q;
  const s = [...new Intl.Segmenter('th',{granularity:'word'}).segment(q)]
    .filter(x => x.isWordLike).map(x => x.segment).join(' ');
  return s ? `${s} ${q}` : q;   // OR with the raw query — ICU mis-splits proper nouns
};
```
Applied at **index time and query time**, OR-ed with the raw query so proper nouns survive mis-segmentation. Ship a **40-query Thai regression fixture** in `_internal/qa/th-search-fixture.json` (`ที่พักติดทะเล`, `ร้านอาหารเชียงใหม่`, `ทะเลหมอก`, `ที่พักเขาใหญ่วิวดี`) asserting `>0 hits`, so a future change cannot silently regress it.
2. **Inverted index at generate time** (token → row ids) instead of a linear scan, plus `lat`/`lng` on every geocoded row so one file drives search, "near me" and map clustering.
3. **Entity-grouped typeahead** — จุดหมาย / ที่พัก / ร้านอาหาร / ไกด์ / จัดอันดับ, 3–5 per group, subtitle = parent geography ("ไร่เลย์ · กระบี่").
4. **`🔖` on every result row** — search becomes a trip-building surface.
5. **Real pagination** — `<a href="?q=…&page=2">` underneath a Load-more button. Googlebot does not scroll and does not click.
6. **Zero-result recovery** — restate the query, "หมายถึง กระบี่?" from a ~500-entry Fuse.js place-name list covering Thai *and* Latin transliteration (transliteration variance is a bigger miss source here than typos), name the binding facet, offer to relax exactly it, show 6 popular items, keep the input focused and populated.
7. **Ranking fix** — pin exact-title matches to the top of their group and boost `cat === 'city'`.
8. **Fix the locale bug** — `commonJs():558` builds `idxUrl` as `(LOC==='en'?'/en/':'/')+'search-index.json'`, so the seven wave-2 locales fetch the **Thai** index.

### 5.7 Saved — new `/saved` (replaces `my-list.html`)

Segmented control: `บันทึกไว้ (N)` / `แผนรายวัน`. **One screen, not two routes**, both counts always visible.

- Colour-coded lists seeded from the existing `type` field (`เที่ยว` / `กิน` / `ที่พัก` maps 1:1 to `see|eat|stay`), rename, reorder, per-list map colour.
- **Map** [BACKFILL: coords] — saved places as pins; scheduled ones in `--trip`, unscheduled in translucent `--sand-400`, so the user literally sees what is still loose.
- Estimated total from parsed price bands: `"ทริปนี้ประมาณ ฿12,000–16,000 ต่อคน (ประมาณ · ไม่รวมตั๋วเครื่องบิน)"` — far more compelling on first render than an empty budget screen.
- **Export / Import JSON ships *before* anything that encourages large lists.** A user who loses a 40-item list to a cleared cache with no backup path experiences that as a betrayal — and it removes the strongest argument for building accounts.
- **77-province map shaded by where you have saved** — the only sanctioned gamification. `"เก็บไว้แล้ว 14 จังหวัด"`. **Never** `"เหลืออีก 63 จังหวัด"`, which is loss-framed.
- A permanent plain-language line: *"รายการนี้เก็บไว้ในเบราว์เซอร์นี้เท่านั้น — ไม่มีใครเห็น และเราไม่ได้เก็บไว้ที่เซิร์ฟเวอร์จนกว่าคุณจะกดแชร์"*.
- **No public save counts, ever.** "N คนบันทึกที่นี่" is manufactured social proof and a direct guardrail breach; add the pattern to `lint-dark-patterns.mjs` in all 9 languages.

### 5.8 Planner — `/trip`

Full spec in §6.

### 5.9 Facet URL policy (applies to hub, roundup, search)

Three route classes, because canonical and noindex do **not** reclaim crawl budget — Google must fetch the URL to see either signal, so the control is **exposure**, not annotation.

| Tier | Example | Crawlable | Sitemap |
|---|---|---|---|
| 1 · Category | `/city-krabi.html` | ✅ | ✅ |
| 2 · Approved facet landing | `/top10-family-hotels-krabi.html` | ✅ | ✅ |
| 3 · Session state | `?zone=railay&budget=mid` | ❌ never emitted as `<a>` | ❌ |

The **397 roundups already ARE tier 2** — statically built, internally linked, demand-validated. Mine the facets users actually apply to nominate the next batch, checking each candidate's pool for overlap first (cross-cluster cannibalisation is a known live issue: surat-thani/Samui, mae-hong-son/Pai).

---

## 6. The trip planner — full specification

The planner is not a page. It is **a data model that content pages write into**, **a rail/tab that is always visible**, and **a board at `/trip` for editing**. `astro/public/trip.html` (949 lines, 586 of them imperative JS around one `window._trip` global that `innerHTML=''`s the document on every edit, with Sortable instances created and never destroyed and item identity a volatile `_uidN` counter) is **replaced, not extended**. The Worker's planning core is **kept and hardened**.

### 6.1 Data model

#### 6.1.1 The POI index — built, never authored

**New: `_internal/gen-poi.mjs`**, running in `astro/prebuild.mjs` immediately after `gen-feeds.mjs`. It joins the three feeds with the coordinate sidecars and emits:
- `astro/public/data/poi/<province>.json` — 89 files, one per cluster (~20–120 KB each)
- `astro/public/data/poi-lite.json` — one ~200 KB file `{id,name,province,zone,kind,lat,lng}` for search, map clustering and near-me
- `astro/public/data/poi-names-en.json` — English name overlay keyed by the same ids, so EN reuses TH geometry

```json
{
  "v": 1, "province": "krabi", "provinceTh": "กระบี่", "generated": "2026-09-08",
  "items": [
    {
      "id": "s:rayavadee-krabi",
      "kind": "stay",
      "name": "Rayavadee", "nameEn": "Rayavadee",
      "url": "/review-rayavadee-krabi", "urlEn": "/en/review-rayavadee-krabi",
      "img": "images/hotels/krabi-rayavadee-1.jpg",
      "province": "krabi", "zone": "railay", "district": null,
      "lat": 8.0104, "lng": 98.8375, "geoSrc": "sidecar",
      "score": 9.4, "scoreSrc": "booking", "ratingCount": 1204,
      "price": { "min": 13900, "max": 13900, "cur": "THB", "unit": "night",
                 "band": 4, "checkedAt": "2026-07" },
      "hours": null, "closedDays": [], "needsBooking": true,
      "durMin": 0, "bestTimeOfDay": null,
      "tags": ["luxury","beachfront","romantic","pool"],
      "book": {
        "agoda":   "https://www.agoda.com/…?cid=1965862",
        "booking": "/go/b?u=…&sid=th-rev-krabi-rayavadee",
        "trip":    "https://www.trip.com/…?Allianceid=6861268&SID=312919111"
      },
      "verifiedAt": "2026-05"
    }
  ]
}
```

**Stable id scheme** — `{kind-prefix}:{slug}`. `s:` stay (from `reviews/review-<slug>.json`), `a:` attraction (from the article slug), `e:` eat (from a `restaurant` block: `e:<article-slug>--<rank>`), `m:` michelin. Ids are derived deterministically from filenames that already exist, so nothing needs a new content field and ids survive rebuilds.

**Price parsing is pure derivation, zero content edits** — `"฿1,500"` → `{min:1500,max:1500}`; `"฿2,000-3,000"` → `{min:2000,max:3000}`; band = quartile of the province pool. Must handle the range case or a naive digit-strip yields a max of 20,003,000. This alone unlocks price filters, price sort, budget totals and honest zone bands — all currently impossible because every price on the site is a display string.

**`kind:'guide'` is excluded from the planner pool entirely.** That one filter is what structurally prevents `"ที่เที่ยวเชียงใหม่ ที่ต้องไปสักครั้ง"` from being scheduled as a 2-hour activity.

#### 6.1.2 The trip — `localStorage['ta.trip.v3']`

```json
{
  "v": 3, "id": "local", "rev": 17,
  "title": "กระบี่ 4 วัน", "startDate": null,
  "pax": { "adults": 2, "kids": 0 }, "currency": "THB",
  "prefs": { "provinces": ["krabi"], "days": 4, "pace": "สมดุล",
             "interests": ["beach","food"], "transport": "รถสาธารณะ",
             "kids": false, "elderly": false, "lang": "th" },
  "lists": [
    { "id": "inbox", "name": "ที่บันทึกไว้", "color": "sand" },
    { "id": "eat",   "name": "อยากกิน",     "color": "coral" },
    { "id": "stay",  "name": "ที่พัก",       "color": "mango" }
  ],
  "saves": [
    { "poiId": "e:krabi-seafood--3", "listId": "eat", "note": "",
      "savedAt": "2026-09-08T04:11:00Z" }
  ],
  "days": [
    {
      "id": "d1", "date": null, "label": "วันที่ 1", "zone": "railay",
      "stayPoiId": "s:rayavadee-krabi", "note": "",
      "items": [
        { "id": "i1", "poiId": "a:tham-phra-nang-beach", "kind": "see",
          "start": null, "durMin": 90, "pinned": false,
          "cost": null, "source": "guide", "note": "" }
      ]
    }
  ],
  "unscheduled": [],
  "_orphans": [],
  "budgetCap": null, "updatedAt": "2026-09-08T04:11:00Z"
}
```

**Three invariants that decide the architecture:**
1. **Travel legs are DERIVED at render from consecutive items and never stored.** A reorder is a splice plus a re-render; nothing can go stale. This is the single most important modelling decision in the document — the current model stores a *display document* rather than data, which is why reordering is destructive and identity (`_uid`, a volatile counter) does not survive a render.
2. **`startDate` is nullable and first-class.** Days are labelled `วันที่ 1` until a date is set; feasibility degrades to `ยังไม่ระบุวันที่` rather than blocking. Demanding exact dates before a user can save anything is the single highest-cost mistake available in this category — inspiration precedes dates.
3. **Items carry `poiId`, not names.** Names, prices, images and booking links are re-hydrated from the POI index at render, exactly as `worker.js` already does server-side.

**Migration from `ta_wishlist`** — read-tolerant, write-current. `ta-store.js` reads the v1 bare array on first load, matches each item's `slug`/`url` against `poi-lite.json`, produces `saves[]` with real `poiId`s, and keeps unmatched entries in `_orphans` with their original fields. **Nothing is ever silently lost, and v1 is never destroyed, only superseded.**

#### 6.1.3 One store, one writer

**New: `astro/public/js/ta-store.js`** (bundled into the hashed `shell.<hash>.js`) — the *only* module allowed to touch trip storage:
`TA.save(poiId, opts)` · `TA.unsave(poiId)` · `TA.has(poiId)` · `TA.addToDay(poiId, dayId)` · `TA.move(itemId, dayId, index)` · `TA.remove(itemId)` (→ returns the item to `saves`, never deletes) · `TA.trip()` · `TA.on('change', fn)` · `TA.export()` / `TA.import(json)`.

This kills the current four-writers / two-identity-keys bug outright: `ReviewLayout.astro:1360`, `RoundupLayout.astro:1172`, `ArticleLayout.astro:1022` and `trip.html:368` all become thin callers. Every read and write is wrapped in `try/catch` with an **honest inline message** on the private-browsing quota failure, never a silent no-op.

### 6.2 Screens and flow

**S0 — Save (every content page, including hubs).** 🔖 → optimistic flip to "บันทึกแล้ว ✓" → toast naming the item, the running count and a link → Trip badge increments. No login, no modal, no navigation.

**S1 — Trip tab, empty state. Three chips, never a blank canvas.**
`จากที่บันทึกไว้ (6)` · `เริ่มจากไกด์` · `เริ่มเอง`. First chip pre-selected when saves exist, so the fastest path is literally one tap. Three optional inputs (จังหวัด/โซน · กี่วัน · จังหวะเที่ยว); **dates optional and skippable**. A sample trip is viewable without committing.

**S2 — The board.**
```
┌──────────────────────────────────┐   Segmented control, NOT two routes:
│  [ บันทึกไว้ 12 ] [ แผนรายวัน ] │   both counts always visible
├──────────────────────────────────┤
│  วันที่ 1 · ไร่เลย์               │   day header: 5 จุด · 41 กม. ·
│  🏨 Rayavadee                     │   เดินทางรวม ~2 ชม. · ประมาณ ฿4,200
│  ─ ~12 นาที · 1.4 กม. 🚶 ─       │   ← DERIVED connector row, tappable to
│  🏖️ หาดพระนาง        ⋮           │      switch mode for this leg only
│  ─ ~25 นาที · 8.4 กม. 🚗 ─       │
│  🍽️ The Grotto        ⋮           │
│  ＋ เพิ่มที่นี่                   │
└──────────────────────────────────┘
```
- **Desktop:** list left (40 %) / map right (60 %), map never scrolls away. Hovering a row enlarges its pin; clicking a pin scrolls and flashes the row; day chips filter markers; marker colour = day index; unscheduled saves render as translucent grey pins.
- **Mobile:** full-bleed map behind a **non-modal** bottom sheet at peek (~15 %: `วันที่ 2 · 5 จุด · 12 กม.`) / mid (~55 %, default) / full (~92 %). An explicit `แผนที่ | รายการ` toggle gives a **non-gestural** route between states.
- **Item card:** thumbnail, name, kind glyph, duration, cost field, `⋮` menu (`ย้ายไปวันที่… · เลื่อนขึ้น/ลง · ปักหมุดเวลา… · สลับกับที่คล้ายกัน · เอาออก`).

**S3 — Reordering. Ship Move-to first, drag second.** Drag-only reordering excludes speech-control, switch and low-dexterity users outright, and on a narrow phone a menu is genuinely faster than dragging across a 7-day board. Drag handle ≥44 px on desktop and long-press on touch, added afterwards. Written with `addEventListener` delegation on the day container — which moves toward strict `script-src`, not away.

**S4 — Optimise-day: invoked, previewed, undoable.** Per-day button, **never automatic**. A sheet asks start/end (defaults to that day's hotel), warns that `pinned` items stay anchored, then shows the proposed order as a **diff** with before/after totals (`2ชม.10 → 1ชม.20`). Apply and ยกเลิก are both one tap. With ≤8 stops, 2-opt over the haversine matrix runs in <5 ms client-side — no API, no paid tier. **The objective is weighted by `bestTimeOfDay`** (temples early, rooftops late) or a shorter route puts a sunset viewpoint at 10 am.

**S5 — Feasibility, only where the data is fresh.** A strip under each day header, recomputed on every mutation against that day's weekday. Where `hours`/`closedDays` exist: `ปิดวันจันทร์` (`--flag-stop`), `เปิด 10:00 · คุณวางไว้ 08:30` (`--flag-warn`), `ต้องจองล่วงหน้า`. Where they do not: **`ยังไม่ยืนยันเวลาเปิด — เช็กก่อนไป`** (`--flag-unknown`), **shown rather than hidden**. Visible ambiguity beats invisible error, and stale hours are worse than none — every record carries `verifiedAt` and degrades to the unknown state after 12 months. Restaurants qualify today (97.9 % hours); attractions need backfill. Plus a Thai public-holiday layer (Songkran, royal days, Loy Krathong, vegetarian festival) as a national crowd/closure overlay — a genuinely Thailand-specific feature no global tool has.

**S6 — Travel legs, honest by construction.**
- **Stage 1 (ships immediately, zero API cost):** haversine × a Thailand-calibrated factor per zone (Bangkok traffic ≠ Krabi road), rendered as a **band** and labelled with its method: `~20–30 นาที · ประมาณ (เส้นตรง)`.
- **Stage 2:** `GET /api/route`, an OSRM/matrix proxy keyed on rounded coordinate pairs and cached in KV forever — Thailand POI pairs repeat massively across users, so hit rate is very high and marginal cost approaches zero.
An unlabelled "25 min" that is really 55 min in Bangkok traffic destroys trust in the entire plan faster than no number.

**S7 — Budget as a derived view, not a second store.** Every item takes an optional `{amount, currency, per}` plus a `paid` flag. Day headers show subtotals; the trip header shows total / per-person / delta vs cap. Grouped by ที่พัก / กิน / เที่ยว / เดินทาง. The unlock: `pmin` in the POI index gives a **default estimate with zero user input** — "ทริปนี้ประมาณ ฿12,000–16,000 ต่อคน" on first render. Always a *range*, always labelled ประมาณ, flights excluded unless entered.

### 6.3 Guide → Trip — the flagship flow

`RoundupLayout.astro` derives at build time, from data already present:
```js
const guidePlan = {
  slug: data.slug,
  zone: data.breadcrumb?.[2]?.name ?? null,
  picks: data.entries.map((e, i) => ({
    rank:  e.rank ?? i + 1,
    poiId: 's:' + e.reviewUrl.replace(/\.html$/,'').replace(/^\/?review-/,''),
    name:  e.name,
    price: parsePrice(e.priceBig),
    tier:  i < 3 ? 1 : i < 6 ? 2 : 3
  }))
};
```
Tier 1 = 1-day, tiers 1+2 = 3-day, all = 5-day — **strict subsets**, so the ranking is authored once and serves every trip length (Rick Steves' additive-day structure, the most durable itinerary IA ever published). Because roundups are mostly stays, the client materialiser fills each day from the POI index in the same **zone** using a template of **2 see + 1 eat + 1 optional**, ordered by `bestTimeOfDay` then geography — never five restaurants in a row, never a day that zigzags across the province. Every item carries `source:'guide'` and a badge linking back to the review.

**Zero content work. One layout edit. 397 roundups × 2 languages.** `reviewUrl` resolves for 3,511/3,511 entries covering 98.3 % of the review corpus, so nothing dangles. **This is the highest revenue-per-engineering-day item in the plan — ship it before search.**

### 6.4 AI — demoted to a polish button, and hardened

The deterministic arranger is the front door and it is instant. The arrange-only contract in `worker.js` is **correct and worth defending**: the model emits only pool ids, `resolve()` (`:339`) drops anything invented, every displayed fact is copied from the server-side pool record, `ensureSavedIncluded` (`:377`) guarantees a saved item is never dropped, `ensureHotelPerNight` (`:359`) guarantees a province-correct bookable hotel per night, and `fallback()` (`:394`) is a deterministic chunker so the planner never fails to produce something. **Keep all of it.** Seven fixes:

**① Per-province caps — the actual quality ceiling.**
```js
// worker.js:5 TODAY — global for see/eat; hotels already do top-3 per province at :236-240;
// CAP.stay is dead code, never read.
const CAP = { see: 8, eat: 5, stay: 4 };
// A 10-day, 3-province trip is arranged from at most 8 attractions site-wide.
const CAP = { seePerProvincePerDay: 3, eatPerProvincePerDay: 2, stayPerProvince: 3,
              se
```js
const CAP = { seePerProvincePerDay: 3, eatPerProvincePerDay: 2, stayPerProvince: 3,
              seeMax: 60, eatMax: 40 };
```
Delete the dead `CAP.stay`. This, not the model, is why plans repeat.

**② Province lock — fixes the verified Krabi-day-in-a-Chiang-Mai-trip bug.** The live test is unambiguous: chips verified as exactly `["เชียงใหม่"]`, days=3, and the returned plan put **all of Day 1 in Krabi** because one saved Rayavadee item silently overrode the selection — then bridged it with `"🧭 กระบี่ → เชียงใหม่ · 🚌 รถทัวร์ / รถตู้ / รถไฟ"`, presenting ~1,200 km as a day-to-day hop. Fix by rule: **user-selected provinces are the authoritative scope.** Saved items outside it go to a visible tray — `"บันทึกไว้ แต่ไม่ได้อยู่ในทริปนี้ (2)"` with a one-tap `เพิ่มจังหวัดนี้เข้าทริป` — never silently inserted. The user sees exactly what was excluded and why.

**③ POI-only pool.** Build candidates from the POI index (`s:` / `a:` / `e:` / `m:`), never from content slugs. Reject any candidate whose url matches `/^\/?(top10-|best-|.*-ที่ไหนดี)/`. `kind:'guide'` lives in `guides.json` and carries no `poiId`, so scheduling an article title as a 2-hour activity becomes structurally impossible.

**④ Two-phase response.** `/api/plan` returned **200 after 14,257 ms** behind an unlabelled spinner, and the page did not scroll to the result. Split it: flush the retrieval JSON immediately so cards paint in ~100 ms (they are true, verified data), then stream the prose overlay. Add an `AbortController`, a visible Cancel, a button label change during the call, and `scrollIntoView` on completion. Perceived latency is set by time-to-first-visible-content, not completion. Keep the deterministic layer non-streamed; stream only the narration.

**⑤ Geo sanity gate.** After `resolve()`, reject any day whose maximum inter-item haversine exceeds 60 km (25 km on a walking-pace day) and re-cluster deterministically by `zone`. Return `groundedCount / totalCount` and refuse to render below a threshold.

**⑥ Thin pools: say so.** `"เรามีรีวิวในจังหวัดนี้ 6 ที่"` beats padding with filler. And **surface the grounding visibly** — `"ทุกที่ในแผนนี้มาจากรีวิวที่เราเขียนเอง"` with links back to the reviews. Against every AI planner in the market, that is the differentiator, and it is true here in a way it is not for them.

**⑦ Housekeeping.** Cache retrieval in KV per `(province, days, prefs)` so repeat requests skip the model entirely. Give `/api/suggest` its own `RL_READ` binding in `wrangler.jsonc` — today it is a read consuming the `RL_WRITE` bucket (40/60 s) shared with trip saves, votes and email, so an indecisive user toggling province chips can exhaust the budget that also gates sharing their own trip. And **either wire `ITIN_SCHEMA` (`worker.js:294-330`) into `env.AI.run` or delete it** — a contract that lives only as prose inside a Thai prompt is not a contract.

Model stays `@cf/meta/llama-3.3-70b-instruct-fp8-fast` for now; the bottleneck was never the model.

### 6.5 Storage, sharing, transfer

**Client-authoritative.** `localStorage` is the source of truth; the server is for sharing and cached routing only. **No login, ever, to reach first value.**

**Cross-device without accounts — the QR handoff.** This solves ~80 % of the real reason people are told to create an account ("I researched on my laptop, I want it on my phone in Bangkok"):
```
POST /api/xfer → KV key "xfer:<12-hex>", expirationTtl 900, single-use, self-destructs on first read
Trip tab → "เปิดบนมือถือ" → QR rendered client-side (no CDN, no image request that leaks the code)
```
Rate-limited by the existing `RL_WRITE` binding. Ship this **instead of** accounts.

**Share — keep every existing defence.** `POST /api/trips` (`worker.js:499`): 12-hex ids derived from `crypto.randomUUID` (**never** swap for a counter/base62 scheme — that makes ids enumerable), 200 KB payload cap, 1-year TTL, `safeUrl()` rejecting protocol-relative URLs and any quote/angle/backtick/whitespace/backslash, and `sanitizeItin`/`sanitizePicks` applied **at write** so a poisoned record can never be re-served. Additions:
- an `editToken` stored beside the record; `PUT` guarded by `If-Match: rev`
- **fix the data-loss bug:** on `/t/:id`, `afterEdit()` → `persistTrip()` writes the *friend's* trip into the visitor's own `localStorage` and never reaches KV either. Guard `persistTrip()` on `!window.__TRIP_ID__` and offer `"ทำสำเนาเป็นทริปของฉัน"` instead.
- **fix the KV vote race:** `collabAction()` (`worker.js:516`) is an unguarded read-modify-write and KV allows one write per second per key, so two votes in the same second silently lose one. Move counters to per-voter subkeys `trip:<id>:v:<uuid>`, aggregated on read.
- KV is eventually consistent: after `POST`, render from the client's in-memory payload rather than an immediate re-read, or the sender 404s on their own fresh link.
- `/t/:id` stays `noindex`, read-only, with 👍 vote and 💬 suggest, no accounts. Suggestion text is untrusted user input rendering on a public page — same sanitiser, capped length.

**Share targets: LINE first, then copy-link, then Facebook. Email last.** In Thailand a group trip is organised by forwarding a link into a LINE chat. **Verify the OG card in LINE's in-app webview specifically** — it is a common source of font-loading and sticky-header bugs.

**Accounts: not yet.** Free email from Workers ended with MailChannels' 2024-08-31 EOL, so magic links mean a recurring Resend / Cloudflare Email cost, a PII store, a deliverability dependency and an "I never got the email" support burden — for a benefit the QR handoff already delivers. Revisit only on a measured signal: repeat visitors with non-empty baskets, or actual "I lost my list" contacts. Note also that `/api/email` currently stores addresses with **no confirmation and no consent record** — treat that list as re-permission-required, not as a list, and add `confirmed:false` + a tokenized confirm link + a consent timestamp before ever mailing it.

### 6.6 Export and offline — all free, never gated

Paywalling offline or print is the single most-cited betrayal in Wanderlog and Layla reviews. Everything below ships free, in one `ใช้งานจริง` menu.

1. **Google Maps per day, chunked** — `https://www.google.com/maps/dir/?api=1&origin=…&destination=…&waypoints=A|B|C&travelmode=driving`, **≤3 waypoints on a mobile UA, ≤9 desktop, ≤2,048 chars**, so a 7-stop day becomes two labelled links rather than one silently-broken URL.
2. **`.ics`** — keep the existing generator (`trip.html:532-563`), add hotel-night events, and stop inventing a 9 am + 2 h grid once `start` exists.
3. **`@media print`** — a genuinely good A4 page: one day per page, map thumbnail, addresses in Thai **and** English, phone numbers, no chrome. **This is the PDF; no email gate.** For a Thai audience, print-to-PDF-to-LINE is a real end state.
4. **Copy-as-text** for LINE.
5. **Canvas share image** — keep the existing 1080×1350 generator with `navigator.share({files})`.
6. **`บันทึกไว้ใช้ออฟไลน์`** — §4.10.

---

## 7. Data backfill — sized

| # | Backfill | Volume | Method | Effort | Unblocks |
|---|---|---|---|---|---|
| 1 | **Hotel coordinates** | **2,024** (377/2,401 have them) | Geocode `streetAddress` + `addressLocality` (**both 100 % populated**) → **`_internal/hotel-coords.json` sidecar keyed by slug**; Thailand-bbox validated (reuse the validator in `gen-near-me.mjs`); reject anything >60 km from its `province-coords.json` centroid; low-confidence queued for manual review | ~2,024 requests ≈ 35 min at 1 rps + **1.5 d QA** | Map, near-me, legs, day clustering, optimise-day, static map thumbs |
| 2 | **Attraction coordinates** | **795** (288/1,083) | Extend `_internal/place-coords.json` 288 → 1,083, same pipeline, keyed by canonical URL. Expect ~70 % auto | **1 d + 1 d manual** | Attraction pins, mixed-day routing |
| 3 | **Michelin coordinates** | **485** (0 today; pins currently sit on ~77 province centroids) | Same, keyed by name + province | **0.5 d** | A real Michelin map |
| 4 | **Numeric prices** | 0 content edits | Parse `qiPrice` (2,395/2,401 clean) + `priceBig` (3,510/3,511 clean) in `gen-poi.mjs`. **Must handle ranges** | **~2 h / ~60 lines** | Price filter, price sort, budget totals, zone bands |
| 5 | **Tag recovery** | 0 content edits | Extend `TAG_VOCAB` in `_internal/lib/place-tags.mjs` by ~40 terms | **~1 h** | **Recovers 2,621 of 3,291 hand-written review tags** currently discarded — free-parking 112, business 62, sukhumvit 62, value 59, medical-tourism 49, long-stay 49, mrt-access 39, rooftop-pool 36. **Cheapest large win available.** |
| 6 | **`durMin` / `bestTimeOfDay`** | derived | Type heuristic (temple 60 · museum 90 · market 90 · waterfall 120 · beach 150), labelled `โดยประมาณ` | **~1 h** | Day pacing, over-pack warning, optimise-day weighting |
| 7 | **Seasonality** | **89 provinces × 12 months** | Structure the existing prose `bestTime` (89/89 populated) into `{month:'go'\|'mixed'\|'avoid', note}`. **Per-coast, not national** | **~2–4 h editorial** | `.ta-season`, hub fact chips, "when to go" answer target. **Best ROI-per-hour in this document.** |
| 8 | **Island clusters** | ~9 clusters ≈ 50–60 reviews + ~40 articles | Re-tag koh-tao (8), koh-lanta (9), phi-phi (7), railay (7), koh-yao (6), koh-sichang (5), koh-samet, koh-phayam, koh-mook — today they exist only as slug substrings under a parent province. One `content.config.ts` enum edit + re-tag | **~0.5–1 d** | Island destinations become addressable at all |
| 9 | **Bangkok districts** | 418 reviews | Sidecar from `_internal/neighborhood-data/` (447 hotels already mapped across 8 cities) + address matching | **~1 d, ~80 % auto** | District filters on 32 existing hubs; zone-correct Bangkok day clustering |
| 10 | **Attraction hours + fee** | 1,083 (hours in prose on 879, fee on 921, structured 0) | Extraction pass, LLM-assisted with a human gate → `_internal/attraction-facts.json` with `verifiedAt`; degrade to "โปรดเช็กก่อนไป" past 12 months | **~3–5 d** | Hard feasibility flags on `see` items, "open now" |
| 11 | **Roundup EEAT fields** | 397 rows | `methodologyHtml` + `lastVerifiedHtml` templated from the existing `_internal/wf/` verified-data tooling, then per-cluster edit | **~1 d** | Lights up ~200 lines of already-written layout; feeds `/how-we-rank` |
| 12 | **webp conversion** | 13,714 of 14,342 referenced images unconverted | `sharp` batch → R2 → regenerate `webp-manifest.json` (628 → ~14,000). **`images/cm` (3,268 attraction photos) has zero coverage today**, and 2,382 `.webp` already exist on disk vs 628 manifest rows — some conversion is done but unregistered | **~4–6 h machine, staged** | Image weight everywhere |
| 13 | **Hygiene** | 22 dead images + 1 broken JSON + 464 unreferenced files | All dead refs are `images/hotels/*-1.jpg`; `articles-ko/michelin-baan-pee-lek.json` is a SyntaxError at line 29 col 784 and fails the ko collection parse | **~1 h** | Broken heroes, ko build |
| 14 | **Restaurant photos** | ~1,400 blocks | Only 45 of 3,018 have a real `img`; 1,445 carry `libImg` of which 327 resolve to one of just 18 `_lib/` stock files, which `realLib()` correctly blanks. Use the proven venue-FB / Wikimedia-CC workflow | **ongoing, not blocking** | Image-led restaurant cards |

**Items 4, 5, 6 and 7 cost under a day combined and unblock price filtering, faceting, pacing and the seasonality strip. Do them in Phase 4 regardless of everything else.**

**Sidecars, not inline fields — deliberately.** Writing coordinates into 2,024 review JSONs means touching 2,024 files *and* their EN twins (4,048 diffs), bloating a 509 MB corpus and risking the twin-parity gates. A sidecar keyed by slug is one file, joined at build in `gen-poi.mjs`, re-runnable, and reviewable as a single diff.

**Never pin a guess.** Any geocode outside the Thailand bbox, beyond 60 km of its province centroid, or below the confidence threshold is **dropped**. Store `via` and `q` (as `place-coords.json` already does) so any pin is traceable. Hand-verify a 50-item sample. **Ship attractions before hotels** — attractions are the fuzzier set, so failures surface while the sample is small. A map with wrong pins is worse than a map with fewer, and unlike a wrong price it is not obviously wrong to the reader.

---

## 8. Implementation plan

Total ≈ **45–55 working days** for Phases 0–7, with the owner seeing something installable on their phone on **day ~7** and nothing touching the 18,000 pages until they approve.

### Phase 0 — Reconcile + quick wins · ~2 days · no design dependency

**0.1 Step zero, before any code.**
```bash
git fetch origin
git rev-list --left-right --count HEAD...origin/main
git log --oneline HEAD..origin/main | head -60
git status                                     # a dirty tree was reported: gen-hubs.mjs + ~200 snapshots
```
Production serves `/css/proto3.css`, `/css/premium.css`, `/js/proto3-motion.js`, `/js/premium-motion.js`; **none exist in this checkout**, and `Analytics.astro` holds `G-XXXXXXXXXX` while production fires `G-JDXCTEMMFB`. **Building on this tree would silently delete the live design layer and every line number in this document would be wrong.** Read `proto3.css` and `premium.css` headers after pulling (FC-2) — if `premium.css` already ships `@view-transition`, a focus ring and a reduced-motion block, Phase 6 shrinks.

**0.2 Fix the two freshness leaks.**
- Add `_internal/homepage-i18n/build.mjs` to the `astro/prebuild.mjs` import list. It is absent today, which is why the 7 localised homepages are already stale in production (`2,200+` reviews vs `/en/`'s `2,400+`).
- Rewrite `_internal/build-test.sh`: copy `_internal/` and `astro/public/` in so `prebuild` actually runs the generators and the 502 snapshots, and raise `NODE_OPTIONS` from `8192` to `12288` to match production. **Until then, treat a green build-test as evidence of nothing about hubs.**

**0.3 The quick-wins commit** — 12 verified fixes, each one to ten lines, zero design dependency, deployable in a day:

| Fix | File · line | Impact |
|---|---|---|
| `viewport-fit=cover` (verify first, FC-7) | 4 renderers | Unblocks every `env(safe-area-inset-*)` site-wide |
| FAB no longer blocks Trip.com | `ReviewLayout.astro:1378` + 2 duplicates | **Recovers ⅓ of "compare 3 sites" on mobile** |
| Currency bar clears `.rvbar` on desktop | `astro/public/js/currency.js:64` → rename `currency.v2.js` | USD/EUR/CNY clickable again on every price page |
| `#stay/#see/#eat` → `#p-stay/#p-see/#p-eat` | `gen-hubs.mjs:547,812,901`; `homepage-i18n/build.mjs:45,52` | Repairs every jump link on ~500 pages |
| Hero chips → real category pages | `gen-hubs.mjs` + `index.html` ×9 | The site's most prominent browse affordance stops lying |
| `.mbar` off the Agoda homepage | `RoundupLayout.astro:1128` | **Highest-value one-line revenue fix in the audit** |
| Agoda `rel="sponsored noopener nofollow"` + `us.trip.com` → `www.trip.com` | `ReviewLayout.astro:901` | Link hygiene + prerender exclusion |
| `sw.js` / manifest / `_proto` cache rules | `astro/public/_headers` | Prevents freezing the SW for a year |
| Article hreflang → `LOCS.map()` | `ArticleLayout.astro:256-265` | Fixes ~2,400 broken twin clusters |
| `document.prerendering` guard on GA4 + badge + `localStorage` | `Analytics.astro`, `gen-hubs.mjs:17` | **Prerequisite for Phase 5** |
| `/api/suggest` → own `RL_READ` binding | `wrangler.jsonc`, `worker.js:23` | Stops suggest exhausting the share budget |
| `articles-ko/michelin-baan-pee-lek.json` + 22 dead image refs | content | ko build + broken heroes |

**0.4 Ship per-placement affiliate sub-ids BEFORE any CTA moves.** Extend `cjSid` (`ReviewLayout.astro:64-66`) from a page id to `{lang}-{type}-{cluster}-{slug}-{placement}`, add Booking `label=` inside the destination URL *before* `encodeURIComponent`, and add the `placement` segment at every call site (sticky bar, price widget, image CTA, inline rows, roundup card). Extend `_internal/qa/check-booking-cj.mjs` to assert `cid=1965862` presence, a well-formed sub-id and correct `rel` on every outbound anchor. **Then measure two weeks of baseline before Phase 3 touches a CTA.** Without placement data you cannot tell a design regression from seasonality.

**Verification:** `git status` clean · `bash _internal/build-test.sh` green (`lint-dark-patterns` exit 3, `check-booking-cj` exit 4) · hit-test script returns the intended element for `.rvbar` cards, currency buttons and tabs · CJ dashboard shows the new sub-id format within 48 h.

---

### Phase 1 — Prototypes · ~5–7 days · **OWNER APPROVAL GATE**

You cannot judge an app shell from a screenshot — standalone display mode, safe-area insets, view transitions and tab-bar persistence only exist on a real phone at a real URL. **The prototypes ship as real files on the real domain.**

```
astro/public/_proto/index.html      ← launcher + QR + "Add to Home Screen" walkthrough + palette A/B/C toggle
astro/public/_proto/home.html       ← Explore: search hero, pill rail, resume card, guide rail, region cards
astro/public/_proto/krabi.html      ← Hub: collapsing hero, decision router, real ARIA tabs, filter sheet w/ live count, honest price band
astro/public/_proto/review.html     ← Rayavadee: verdict hero, at-a-glance <dl>, split add-to-day, .ta-cta owning the bottom edge
astro/public/_proto/roundup.html    ← Ao Nang: comparison table, "ทำไมเราเลือกที่นี่", เริ่มแผนจากไกด์นี้ (1/3/5 วัน)
astro/public/_proto/trip.html       ← Board + map + sheet + rail, Move-to menu, derived legs, optimise diff
astro/public/_proto/saved.html      ← Saves/day segmented control, export/import, province map
astro/public/_proto/dark-rtl.html   ← the same five in dark, plus an he RTL frame
astro/public/css/shell.<hash>.css   ← THE token + layout layer (production artifact, not a mockup)
astro/public/js/shell.<hash>.js     ← tabbar, sheets, condense, save, store
```

Rules: **real content** (copy the actual JSON for Rayavadee and `top10-ao-nang-beach-hotels-krabi` so the owner judges *design*, not new copy), real R2 images, real Agoda/CJ links, `<meta name="robots" content="noindex">` + the `_headers` `X-Robots-Tag` rule, unlinked from the site, excluded from `gen-sitemap.mjs` and from the speculation rules. **Ship each page in TH and EN**, plus the he RTL frame — RTL must be proven at prototype stage or it will be retrofitted forever, exactly as it was the first time.

**Ship a working manifest and a service worker scoped to `/_proto/` only**, so the owner can genuinely install one and put it in airplane mode. That is the demo.

Nine files against 1,564 of headroom; deletable in one commit.

**Acceptance gates — measured, not eyeballed. All must pass on all prototype pages:**

| # | Gate | Test |
|---|---|---|
| 1 | Mobile nav exists | at `vw=375`, every nav control's `getBoundingClientRect().right ≤ 375` and `document.documentElement.scrollWidth === innerWidth` |
| 2 | Nothing important is covered | `['.ta-cta .ota','.cv-btn','.ta-tab'].flatMap(...)` → `document.elementFromPoint(cx,cy)` resolves to the intended element |
| 3 | 44 px floor | `[...document.querySelectorAll('a,button,input,summary,[role=button]')].filter(e=>{const r=e.getBoundingClientRect();return r.width && r.height<44})` returns `[]` |
| 4 | Verdict above the fold | at 375×812 the review CTA is reachable within 1.1 viewports |
| 5 | Thai renders correctly | `ก๊วยเตี๋ยว เพื่อ ปิ๊ ญ์` unclipped inside every `line-clamp`; tone-mark GPOS survives the woff2 subset |
| 6 | RTL | `dir="rtl"` renders mirrored **including prose** — this is the `set:html` proof |
| 7 | Weight | prototype homepage < 500 KB first view (from 1,758 KB) |
| 8 | Reduced motion | with the OS flag set, nothing animates and no scroll timeline runs |
| 9 | Installable + offline | Chrome Android fires `beforeinstallprompt`; after install, airplane mode shows the shell + saved reviews + the trip board |
| 10 | Contrast | token linter passes AA on every alias pair in light and dark |

**Deliverable to the owner: one URL, `/_proto/`, on their phone**, plus a palette comparison showing A / B / C on the same review card so the colour decision is made by looking, not by reading hexes.

**Three decisions required in writing before Phase 2 starts:**
1. Palette: **A (Andaman Deck)** / B (Monsoon Ink) / C (Night Market)
2. Tab set and labels (5 slots)
3. Go / no-go on rolling the service worker beyond `/_proto/`

Cost of being wrong here: nine files. Cost of being wrong in Phase 2: ~18,000 pages.

---

### Phase 2 — Shell package + token layer, site-wide · ~8–10 days

**2.1 Build `_internal/gen-shell.mjs`** (new) — concatenates `tokens.css + shell.css + compat.css`, minifies, content-hashes, writes the artifacts in §4.0 plus `astro/src/data/shell-manifest.json`. Insert it **first** in `astro/prebuild.mjs`. It **fails the build** on any physical CSS property (`left:`/`right:`/`margin-left`/`text-align:left`) in `shell.css` — RTL correctness by construction.

**2.2 `astro/src/components/Shell.astro`** (new, ~40 lines) + **`_internal/lib/chrome.mjs`** (new) — one header, one tab bar, one rail, one footer, one icon sprite, emitting byte-identical markup from both renderers.

**2.3 Wire the four renderers.**

| File | Edit | Removes |
|---|---|---|
| `_internal/gen-hubs.mjs:616` `page()` | replace the 30,595-byte `CSS` const with `<link rel="stylesheet" href={shellCss}>` | **~14.5 MB** |
| `_internal/gen-hubs.mjs:516` | replace base64 `_flagcss` with `url(/images/flags/<l>.svg)` — the files already exist | **~10.3 MB from 279 pages** |
| `_internal/gen-hubs.mjs:511` | delete `FONTS`; self-hosted `@font-face` moves into `shell.css` | render-blocking Google Fonts on ~476 pages |
| `_internal/gen-hubs.mjs:514,544` | `navHtml()` / `footerHtml()` → `chrome.mjs` | five navs → one |
| `ArticleLayout.astro:239`, `ReviewLayout.astro:794`, `RoundupLayout.astro:560` | adopt `<Shell/>`; **delete the triplicated 37,735-byte base64 flag block** | **113,205 B = 49 % of the Astro bundle** |
| all three layouts | delete the triplicated `.ta-tripfab` CSS | |
| `astro/public/*.html` × ~24 | swap `<head>` + nav + footer for the shell, delete the local `:root` | 13 more independent stylesheets |

**2.4 Fonts.** Subset Sarabun 400/600 and Outfit 500/800 with `pyftsubset`, upload the 4 `.woff2` to R2 under `/fonts/`, preload the two above-the-fold faces, drop both `fonts.googleapis.com` preconnects. **Verify Thai combining marks against a page containing `ที่ / เพื่อ / ก๊วยเตี๋ยว`** — a subset that drops GPOS mark-positioning tables breaks Thai silently.

**2.5 Palette via the compat shim** — this is what makes Phase 2 a *staged* migration rather than a big bang:
```css
@layer tokens{
:root{
  /* gen-hubs + review.css + roundup.css vocabulary */
  --bl:var(--accent); --bl-dk:var(--accent-hover); --bl-lt:var(--accent-quiet);
  --or:var(--editorial); --or-dk:var(--coral-800); --or-lt:var(--coral-100);
  --go:var(--highlight); --sub:var(--text-muted); --mut:var(--sand-500);
  --bdr:var(--border); --bg:var(--surface); --card:var(--surface-2);
  --r:var(--r-lg); --r2:var(--r-md); --sh:var(--elev-1); --sh2:var(--elev-2);
  /* ArticleLayout vocabulary */
  --teal:var(--accent); --teal-dk:var(--accent-hover);
  --coral:var(--editorial); --coral-dk:var(--coral-800);
  --mango:var(--highlight); --soft:var(--surface-3);
}}
```
**Every page changes colour, type and elevation in one commit with zero markup edits**, and each layout is de-shimmed independently afterwards. The shim is deleted at the end of Phase 3. It also makes an A/B of the palette alone possible, without confounding it with layout changes.

**2.6 The i18n rule for this phase, non-negotiable: do not change a single `tx()` string argument.** `gen-hubs.mjs:153` keys 2,716 translations on the literal English string and returns English on a miss, with no error and no lint. **Structure and CSS only.**

**New build gates**, all in the rewritten `build-test.sh`:
- `_internal/qa/check-i18n-keys.mjs` (exit 6) — fails if the regenerated `_strings.json` gains a key absent from any of the 7 dicts
- `_internal/qa/check-rtl.mjs` — greps the new stylesheets for physical properties and fails
- `_internal/qa/check-snapshots.mjs` — fails if any `astro/public/**/*.html` is older than its generator
- `_internal/qa/check-touch-targets.mjs` (exit 5) — renders 6 representative pages headless at 360/390/430, asserting the three acceptance gates from Phase 1
- file-count assertion in `prebuild.mjs` at 19,000

**Ship order:** layouts first (single hashed bundle, easiest rollback), then hubs, then the ~24 standalone pages. **Verify per *layout*, not per component** — build and eyeball `dist/review-*.html`, a roundup, an article and a hub before deploy, since baked HTML carries inline `style=` attributes the token file won't reach (39 in `ReviewLayout` alone). Clear caches from `astro/`, **not** the repo root.

**Measured payoff:** −14.5 MB duplicated hub CSS · −10.3 MB base64 flags · −113 KB (49 %) from the Astro bundle · five navs → one · **mobile navigation restored to 77 provinces × 9 locales** · fonts off a third-party origin.

---

### Phase 3 — Structure · ~10–12 days

| Fix | File · line | Reach |
|---|---|---|
| Bottom tab bar + desktop nav + `--floor` contract + z-index budget | `chrome.mjs` + `Shell.astro` | ~18,000 pages |
| Hub hero collapses at 900 px | `gen-hubs.mjs::provinceHub:757` | 388 |
| `cardPic()` into 8 call sites | `gen-hubs.mjs:223,635,685,700,728,788,887,918` | every card image site-wide |
| Real ARIA tablist + hash sync | `gen-hubs.mjs:798,834` | 388 |
| Honest price band replacing `Math.min` | `gen-hubs.mjs:773` | 388 |
| Decision router | `gen-hubs.mjs::provinceHub` | 388 |
| Faceted filter w/ live count on hubs | `chrome.mjs` ← lifted from `RoundupLayout:534-541` | 388 |
| Save button on hub cards **(FC-5)** | `gen-hubs.mjs` card builders | 388 |
| `div.sec-label` → `<h2>` | `ReviewLayout.astro:1013,1202` | 7,200 get an outline |
| At-a-glance `<dl>`, pros/cons above prose, split add-to-day | `ReviewLayout.astro` | 7,200 |
| `.pw-btn` → `<a rel="sponsored">` | `ReviewLayout.astro:1170` | crawlable + middle-clickable |
| `.rvbar` → `.ta-cta`, scroll-reveal, Save merged | `ReviewLayout.astro:1322` | fixes the corner pile-up |
| Roundup hero → `<picture>`; preload matches markup | `RoundupLayout.astro:586,758`; `ArticleLayout.astro:254,644` | no more double hero fetch |
| Comparison table + "เหมาะกับ" badges + `ทำไมเราเลือกที่นี่` | `RoundupLayout.astro` | **397 roundups, zero content edits** |
| Full `Hotel` `ItemList` schema | `RoundupLayout.astro:481-491` | 397 |
| Visible byline on articles | `ArticleLayout.astro` | 8,078 |
| Article iframe facade (`data-src`) + self-host Leaflet | `ArticleLayout.astro:672,852-862` | 477 resto pages |
| Logical properties; delete `html[dir=rtl]` overrides | `shell.css` + `ArticleLayout.astro:306-317` | he/ar finally work |
| Remove `onerror="this.style.opacity=0"` → delegated listener + placeholder | 14 literals in `gen-hubs.mjs` | −7,299 handlers, unblocks CSP |

**Verification:** the four acceptance-gate scripts · visual diff of 8 representative pages in th/en/he · affiliate CTR watched daily against the Phase-0 baseline with the −5 % / 7-day rollback trigger armed.

---

### Phase 4 — POI index + save v3 + Trip rail/tab · ~8–10 days

1. `_internal/gen-poi.mjs` after `gen-feeds.mjs`; backfills **#4 numeric prices, #5 tag recovery, #6 durations, #7 seasonality** (under two days combined).
2. `ta-store.js` live with the v1 → v3 migration and `_orphans`; delete the four divergent wishlist implementations; every 🔖 emits `data-poi-id`.
3. **Trip Rail (desktop) and Trip tab with an always-present badge ship on all ~18,000 pages.**
4. Export / Import JSON.
5. GA4 `save`, `add_to_day`, `affiliate_click{placement}`, `plan_generate`, `plan_save` events wired, all guarded by `document.prerendering`. **Instrument the STRR baseline in week 1 of this phase; publish the number after 28 days, then set the target** (FC-11).

**Parallel track, not blocking:** geocode backfills **#1 hotels, #2 attractions, #3 michelin** (~3–4 d).

---

### Phase 5 — The planner · ~12–15 days

New `/trip` (board + map + sheet; **MapLibre + a Protomaps `.pmtiles` extract on R2**, lazy-init behind a static preview so it costs nothing to users who never open it) · `/saved` · `/t/:id` upgraded (editToken, `If-Match: rev`, shared-mode `persistTrip` guard, per-voter vote subkeys) · export menu · derived haversine legs with honest bands · optimise-day with diff and undo · feasibility strip.

`worker.js`: the seven fixes in §6.4. Retire `astro/public/trip.html` and `my-list.html`; **then** delete `astro/public/js/sortable.min.js` (FC-6).

**Ship a Bangkok / Chiang Mai eat-first planner in week 1** — restaurants are 95.3 % geocoded with hours and dietary flags **today**; hotels are 15.7 %. A food-day planner with real coordinates, real hours and real travel-time chips is fully buildable now and is a better first release than a half-geocoded everything-planner.

---

### Phase 6 — Guide → Trip · ~5–7 days · **highest revenue-per-engineering-day**

`RoundupLayout` `guidePlan` derivation + CTA → **397 roundups × 2 languages, zero content work.** Then `ArticleLayout` for `type:'itinerary'` and any article carrying `day` blocks → ~1,095 more (note-items in 6a; the name→`poiId` resolver in 6b). **Canary to ~20 roundups for 14 days before all 397**, watching per-placement affiliate CTR.

---

### Phase 7 — Homepage generator, search, shell polish, i18n · ~10–12 days

**7a. Homepage generator (isolated, ~3 d).** Replace the 127 exact-substring anchors in `homepage-i18n/build.mjs` with `data-i18n="key"` attributes **before** redesigning the homepage, not after. Then one markup change is safe across all 9 locales.

**7b. Search (~4 d).** Thai `Intl.Segmenter` both sides + the 40-query regression fixture · inverted index with `lat`/`lng` · entity-grouped typeahead · pagination · zero-result recovery · `🔖` on every row · ranking fix · the wave-2 locale index bug.

**7c. Shell polish (~3 d).** `@view-transition` + shared hero naming · Speculation Rules · scroll-driven condensing header with the IO fallback · multi-snap sheets on the planner map · manifest + scoped SW + kill switch, staged `/_proto/` → 5 % → 100 %.

**7d. i18n reconciliation (~3 d, gated).** Only now do copy strings change. Mandatory workflow: edit `gen-hubs.mjs` → `node _internal/hub-i18n/extract-chrome.mjs` → diff the regenerated `_strings.json` against the 7 dicts → translate new/changed keys → regenerate → run the Thai-leak validators. Also: consolidate onto the dead-but-complete `astro/src/i18n/ui.<lang>.json` + `meta.json`; close the ~57 `isEn ?` / `isTh ?` bypasses (FC-9); generate the missing chrome pages for the 7 wave-2 locales (`/zh/about`, `/zh/search`, `/zh/country-thailand`, `/zh/destinations`, `/zh/404` all 404 today and fall back to the **Thai** 404); publish `/how-we-rank` and `/disclosure`, and move the affiliate disclosure from footer-only to one line above the first CTA.

---

### Propagation mechanics

| Change one file | Pages affected | Wall clock |
|---|---|---|
| `_internal/gen-hubs.mjs` | ~476 hub snapshots, 9 locales | **21 s** |
| `_internal/shell/*.css` → `shell.<hash>.css` | **all ~18,000 pages** | seconds |
| `_internal/lib/chrome.mjs` | **everything** | ~18 min |
| `ArticleLayout.astro` | 10,510 | ~18 min |
| `ReviewLayout.astro` | 7,200 | ~18 min |
| `RoundupLayout.astro` | 1,004 | ~18 min |
| `_internal/gen-poi.mjs` | 91 JSON shards | seconds |

**Deploy remains manual** (CI has been off since 2026-06-23 after it shipped a partial dist):
```
git pull                                   # origin moves under you
bash _internal/build-test.sh               # lint-dark-patterns(3) + check-booking-cj(4) + i18n(6) + touch(5) + filecount
node _internal/upload-r2-api.mjs …         # R2 BEFORE deploy (~/.r2-creds; ISP blocks the S3 endpoint)
cd astro && npm run build                  # ~18 min, --max-old-space-size=12288
# verify: dist/review-*.html · dist/*roundup* · public/city-*.html · public/he/city-*.html
npx wrangler deploy                        # from repo root
```

**File-count budget:** +2 hashed CSS/JS, +91 POI JSON, +9 manifests, +4 SW/offline/kill, +~10 icons, +2 search index, +9 proto (deleted after Phase 2) ≈ **+127**. Post-launch ~18,563 of 20,000. Update the stale `.assetsignore` comment in the same commit.

**Memory:** externalising 30,595 B × 476 pages plus 113 KB of base64 *reduces* Astro's per-page work, so the 12,288 MB heap on an 8.5 GB box gets slightly safer, not tighter. That is a design constraint, not a coincidence. Still run a full build after Phase 2.3 and watch RSS; if it regresses, shard `gen-hubs.mjs` by locale.

---

## 9. What we will NOT do, and why

1. **No SPA and no Astro `ClientRouter`.** `build.format:'file'`, flat `.html`, `trailingSlash:'never'` stay exactly as they are. `ClientRouter` re-initialises scripts on every navigation, collides with the ~7,300 inline handlers, and buys ~10 % more than one `@view-transition` at-rule gives for free.
2. **No proto4 overlay and no `!important` layer.** The additive contract is precisely why every critical defect survived four prototype stylesheets.
3. **No Pagefind until it can be served from R2.** ~18,000 fragment files against 1,564 of headroom would silently truncate the deploy — the exact failure `DEPLOY-RUNBOOK.md` Phase R documents.
4. **No accounts in v1.** The QR handoff covers ~80 % of the reason people are asked to register, at ~2 % of the cost, with no PII store and no email-deliverability dependency (MailChannels' free Workers path ended 2024-08-31).
5. **No real-time collaborative editing.** Vote-and-suggest on a read-only snapshot captures the group-planning value at a fraction of the complexity, and the endpoints already exist at `worker.js:516-542`.
6. **No agentic booking.** The site is an affiliate publisher; an agent that books breaks the `cid=1965862` attribution chain that funds it.
7. **No site-wide service worker.** Scope is `/trip`, `/t/*`, `/saved` and saved review HTML only. `_headers` already delivers what a content SW would, and Speculation Rules delivers the perceived speed.
8. **No dark patterns, ever** — no countdowns, scarcity counters, "N people viewing", fake anchor prices, streaks, expiry framing, public save counts, confirmshaming dismissals, exit-intent modals, or `new Date()` in a "last updated" string. `_internal/lint-dark-patterns.mjs` is extended to all 9 languages plus a new rule failing any price rendered without a date stamp. Note Spain's CNMC fined Booking.com €413 M partly over exactly these interface tactics and the EU Digital Fairness Act is aimed squarely at them — this is a scheduled liability, not merely a values choice.
9. **No copy rewording inside `tx()` until the gated Phase 7d.** Structure and CSS only, or 2,716 translated strings silently revert to English on 210 pages with no error.
10. **No per-locale page snapshots and no new per-page assets.** That is the change that blows the 20,000-file ceiling.
11. **No SEO regression.** All ~18,000 URLs, canonicals, hreflang clusters and JSON-LD survive or improve. The planner is additive chrome over the same static HTML. Tab panels stay in the DOM; content behind JS-fetched tabs is invisible to AI crawlers and effectively does not exist.
12. **No scope creep into a general-purpose planner.** Fixed scope: **Thailand, from our own reviewed places, arranged and exported.** No flights, no booking-inbox email parsing (it fails on Thai OTA mail and creates duplicates), no push notifications. If a feature does not make a saved trip more likely to be reopened or a booking link more likely to be tapped, it is out.
13. **No emoji as interface chrome**, no icon-only controls, no `user-scalable=no`, no custom pull-to-refresh, no full-page loaders or skeletons on already-static HTML (that invents latency that does not exist).
14. **No building on the stale local tree.**

---

## 10. Risks, ordered by how quietly they fail

**1 · Rewording English chrome silently un-translates 210 pages — highest.**
`gen-hubs.mjs:150-166` looks the literal English string up as a dictionary key and returns raw English on a miss. 398 call sites, 2,716 translated strings, no error, no lint, no build failure — and a redesign is a copy refresh by definition.
*Mitigation:* `check-i18n-keys.mjs` in Phase 2; freeze `tx()` English strings through Phase 6; all new strings use `t('key')` against `ui.<lang>.json`; deliberate rewords go through the extract-and-diff workflow in 7d.

**2 · The homepage generator hard-fails or mis-replaces on any markup change — highest.**
127 exact-substring anchors, most requiring an exactly-once match, and it is not in `prebuild.mjs`, so the 7 localised homepages are *already* stale.
*Mitigation:* add it to prebuild in Phase 0.2 so the drift stops today; replace the anchor mechanism with `data-i18n` in Phase 7a **before** redesigning the homepage.

**3 · New scoped CSS silently misses all body content.**
Astro scopes every `<style>` with `data-astro-cid-*`, and the layouts inject through **137 `set:html` calls** carrying no such attribute. This is why ArticleLayout's eight RTL rules — the only real RTL work on the site — never reach article prose.
*Mitigation:* all shell CSS is a plain external `<link>`, never a scoped `<style>`. Verify behaviourally in Phase 1 gate #6.

**4 · Local tree behind production.** *Mitigation:* Phase 0.1, and re-fetch before every phase, not once. This failure mode has already cost duplicated work at 1× scale; it is now at ~4×.

**5 · The 20,000-file ceiling — 1,564 of headroom, silent failure mode.** *Mitigation:* `prebuild.mjs` gate at 19,000; no per-locale snapshots; escape valve = move `images/heroes/` + `images/cities/` to R2.

**6 · Immutable caching hides the fix.** `/*.css` and `/*.js` are `max-age=31536000, immutable`, and `sw.js`, `currency.js`, `sortable.min.js` are unhashed. *Mitigation:* content-hash everything through `gen-shell.mjs`; the explicit `/sw.js no-cache` rule lands in the same commit as `sw.js`, with a build assertion.

**7 · Affiliate performance regression — revenue is the whole business.**
*Mitigation:* `bookButtons()` and `cjBooking()` untouched — every new surface calls them. **Per-placement sub-ids ship in Phase 0, two weeks before any CTA moves.** Kill-condition: any 7-day window −5 % vs the pre-launch 28-day mean → roll back the CTA layer, keep the shell. Phase 6 canaries to ~20 roundups for 14 days. Watch that date params are added *before* `encodeURIComponent` or they are stripped, and that `.ta-cta` never shrinks an OTA card below 44 px.

**8 · Thai typography change reflows ~13,000 pages.** *Mitigation:* **we keep Sarabun** — most of the win is in leading, `font-size-adjust`, `letter-spacing:normal` and `word-break:auto-phrase`, not the face. Metric-matched `size-adjust` fallback measured against the actual woff2 subset; validate on the longest TH reviews and the Michelin singles in Phase 1; verify tone-mark GPOS survives subsetting on `ที่ / เพื่อ / ก๊วยเตี๋ยว`.

**9 · A service worker serving stale HTML across ~18k pages — the most damaging reversible mistake available.** *Mitigation:* narrow scope by design; NetworkFirst nav with a 3 s timeout; cache names versioned atomically from `shell-manifest.v`; kill switch written **and rehearsed on staging** before the 5 % step; SW is Phase 7c, after everything else is stable. **If any doubt remains, ship the shell without it** — every other app-shell mechanic works fine and you lose only offline.

**10 · Geocode quality.** 2,024 hotels + 795 attractions + 485 Michelin from an automated pipeline will contain wrong pins, and a wrong pin corrupts routes, day clustering and near-me simultaneously — while looking plausible to the reader. *Mitigation:* bbox + centroid-distance validation, a confidence floor, drop rather than guess, `via`/`q` provenance stored, a hand-verified 50-item sample, attractions before hotels, and every map gated on ≥60 % coverage for that cluster.

**11 · localStorage-only trips lose data.** *Mitigation:* Export/Import JSON ships **before** anything that encourages large lists; QR transfer in Phase 5; a permanent plain-language line about where saves live. Honest framing only — *"saves live in this browser"*, never *"don't lose your plan"*.

**12 · Honesty drift in planner and CTA copy.** The sticky CTA, travel-time chips, budget estimates and the resume card are exactly where urgency copy creeps in. *Mitigation:* extend `lint-dark-patterns.mjs` across all 9 locales with scarcity/countdown/expiry/streak/save-count rules plus a price-without-date rule; always band travel times and name the method (keep `(เส้นตรง)`); always label budget as ประมาณ with flights excluded; publish `/how-we-rank` with an explicit "what we will never do" list, which turns the guardrail from a private rule into a public commitment a competitor cannot copy without giving up their scarcity counters.

**13 · `build-test.sh` passes while the redesign is broken.** It copies only `astro/src`, so `prebuild` no-ops and the generators, the 502 snapshots and the homepage i18n are never exercised; it also runs an 8192 MB heap against production's 12288. *Mitigation:* Phase 0.2. Until then, treat a green build-test as evidence of nothing about hubs.

**14 · 7,299 inline `onerror` handlers block strict CSP** — all from one image-fallback pattern at 14 literals in `gen-hubs.mjs`. They also make broken photos vanish silently rather than degrade. *Mitigation:* delegated `error` listener + `--sand-200` placeholder carrying the POI name. Once the count reaches zero, `script-src` can finally be tightened — a security win arriving as a side effect of the redesign.

**15 · Prerendering inflates GA4 and fires side effects early.** *Mitigation:* the `document.prerendering` guard is a **Phase 0** item, shipped before the speculation rules; verify the Trip badge does not double-count on a prerendered page.

**16 · Two design systems coexisting during rollout — certain, by design.** *Mitigation:* the compat shim means colour, type and elevation land everywhere in **one commit**, so the boundary users cross is structural (nav layout) rather than chromatic (a different-coloured site). Sequence renderers by traffic and keep the window under one week.

**17 · AI plan quality where the pool is thin.** *Mitigation:* detect thin pools and say so rather than padding; refuse below a `groundedCount` threshold; the deterministic arranger — not the model — is the front door, so an AI failure degrades to a working plan rather than to nothing.

**18 · Progressive-enhancement features assumed available.** None of cross-document View Transitions (no Firefox), Speculation Rules (Chromium only), scroll-driven animations (Firefox flagged), `::scroll-button()` (Chromium 135+) or `CloseWatcher` (Chromium only) is Baseline. *Mitigation:* each sits behind `@supports` or a feature check with a working fallback; content is fully reachable without any of them. `popover`, `<dialog>`, `@starting-style`, container queries, scroll-snap and `overscroll-behavior` **are** Baseline and are what the design actually depends on.

---

## 11. Appendix A — Numbers of record

Use these; do not re-derive.

| | |
|---|---|
| Content JSON, 27 collections | 18,714 files / 509 MB |
| Built HTML in `astro/dist` | 18,095 |
| Prebuilt snapshots in `astro/public` | 502 |
| Pages owned by `gen-hubs.mjs` | ≈476 (89 city + 33 area + 6 region + 4 misc) × th/en, + 30 × 7 locales |
| Reviews / roundups / articles (TH) | 2,401 / 397 / 4,039 — EN at exact 1:1 parity, 0 missing twins |
| Roundup entry cards | 3,511, all resolving to real reviews, 2,361 distinct = 98.3 % of corpus |
| Restaurant blocks | 3,018 in 477 articles · 95.3 % geo · 97.9 % hours · 99.1 % price · 100 % tags |
| `day` blocks | 4,596 |
| FAQ pairs authored | 35,661 (9,743 exposed in `faqs.json`) |
| Geo coverage | hotels 377/2,401 · attractions 288/1,083 · restaurants 2,876/3,018 · articles 0/4,039 · michelin 0/485 |
| `near-me-index.json` | 2,095 geo places already built |
| Images | 17,064 files / 2.7 GB · 14,342 distinct refs · 22 dead · 464 unreferenced · webp manifest 628 |
| Stock `_lib/` images | 18 distinct, 622 refs = 1.8 % of 34,290 |
| Search index | 3,568,408 B / 6,968 rows |
| Astro CSS bundle | 230,707 B raw / 71,494 gzip, 113,205 B (49 %) triplicated base64 flags |
| Hub inline CSS | 30,562 B/page × ≈476 ≈ 14.5 MB |
| Flag base64 | 36,930 B/page × 279 ≈ 10.3 MB |
| Deploy | 18,436 uploaded / 20,000 limit = **1,564 headroom** |
| Build | ≈18 min · heap 12,288 MB on 8.5 GB · prebuild hubs 21 s |
| Translated strings | hub 388 × 7 = 2,716 · layouts 513+576+324 = 1,413 · homepage ~151 × 7 · dead `src/i18n` 522 |
| `/api/plan` live | 200 in 14,257 ms |

## 12. Appendix B — Verify-before-building checklist

Run these in Phase 0 and record the answers; several claims in the source blueprints depend on them.

- [ ] `git rev-list --left-right --count HEAD...origin/main` — the real delta (FC-1)
- [ ] Read `astro/public/css/premium.css` and `proto3.css` headers — what already ships (FC-2)
- [ ] `grep -c 'viewport-fit' ` across `gen-hubs.mjs`, the three layouts, `index.html` (FC-7)
- [ ] Favicon glyph in `gen-hubs.mjs` `page()` — is it also a "W"? (FC-8)
- [ ] `grep -c 'isEn ?\|isTh ?'` per layout — confirm 57 vs 34 (FC-9)
- [ ] `find astro/dist -type f | wc -l` and the `.assetsignore` exclusion count — confirm 18,436
- [ ] `node -e` count of `data-astro-cid` on a `set:html` paragraph in `dist/he/*` — the RTL proof
- [ ] Confirm `CAP.stay` is unreferenced in `worker.js` (FC-4)
- [ ] Confirm `sortable.min.js` is referenced only by `trip.html:15` (FC-6)
- [ ] Confirm hub cards carry no save button (FC-5)

---

**Ship order, one line:** reconcile → quick wins → prototypes → **owner approves** → shell + tokens → structure → POI + save → planner → guide-to-trip → homepage generator + search + polish + i18n.
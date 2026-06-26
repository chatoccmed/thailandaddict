# DEVELOPMENT PLAN v2 — road to #1 Thailand travel site + #1 trip-planner

> Refresh of `DEVELOPMENT-PLAN.md` (v1, 2026-06-21). v1's **North-star, Moat, and Now/Next/Later still hold** — read it for those. This v2 is the *re-audit against the current repo* (2026-06-25), after 77-province resto + /trip planner + /feeds + wishlist shipped. Built from a fresh 6-lens expert panel (run `wf_7f27b29d-cb0`, 52 findings synthesized).

## Diagnosis (what changed since v1)
The site is **past "content farm."** Foundation is world-class: ~10.6k pages, all 77 provinces' eat-rankings, `/feeds/*.json` data product, `llms.txt` + AI-bot robots, sitemap `<lastmod>`, JSON-LD incl HowTo/TouristAttraction, quick-answer block exists, `/trip` AI planner MVP (save-to-plan loop + PDF + per-day Klook/Agoda), `my-list.html`, and the 🔖 save-to-plan UX.

**The gap to #1 is NOT more content. It is activation, measurement, and surfacing of what already exists.** Three levers dominate:
1. **Measure + monetize** — GA4 entirely absent (every `track()` call is a verified no-op); 4 highest-commission affiliates ship dead placeholders (`__GYG_PARTNER_ID__` in 6,512 files + Airalo/SafetyWing/12Go). Site is blind and earns ~0 on its highest-intent clicks.
2. **Surface the planner** — `/trip` has zero links from `index.html` nav/footer/hubs, is `noindex`, and the FAB is hidden until a wishlist item exists. Cold visitors + AI crawlers never reach the most differentiated asset.
3. **Win AI citations** — ~92% of corpus (2,102 reviews + 243 roundups at 0%) lacks the extractable quick-answer block; the persona/conversational queries AI gets most (LGBTQ+, solo-female, festivals, accessibility) have no real page.

## Bugs found (fix regardless of roadmap)
- **hreflang 404 (sitewide SEO risk):** `ArticleLayout` emits `hreflang=en href=/en/{slug}` unconditionally on all 3,586 articles, but 105 have no EN twin → points to 404s. Non-reciprocal hreflang makes Google drop the *whole* cluster. Fix: pass `hasEn` from `[slug].astro`, guard the line, add `x-default` (Review/Roundup already have it).
- **30 dead `related[]` hrefs** carry a trailing `.json` → 404 (e.g. `wat-muang-big-buddha.json`). Extend `fix-orphan-related.mjs` to strip `.json` + add a `lint-content` assertion.
- **ReviewLayout misleading live-clock** ("last checked now") — replace with static "reference price, checked {modifiedDate}" honesty stamp. (cf. honesty/EEAT lock.)
- **restaurants.json** has temple rows miscategorized as `foodType` — drop them.

## Progress — SHIPPED + LIVE (2026-06-25, 6 deploys)
- ✅ **GA4 scaffold** (`Analytics.astro` → 3 layouts + `gen-hubs.mjs` 77 hubs + `trip.html`). Gated by `GA_ID`; emits nothing until set → ships safe. **TO ACTIVATE: set real `G-XXXXXXXXXX` in those 3 spots, rebuild.**
- ✅ **Save-to-plan UX** — 🔖 + label + toast + live FAB (see `save-to-plan-ux` memory).
- ✅ **Wave-0 #3 surface /trip** — homepage nav + all 3 layouts (desktop+mobile) + noindex→canonical.
- ✅ **Wave-0 #5 hreflang 404** — guarded (105 twin-less TH articles) + x-default.
- ✅ **Wave-0 #6 currency** — on ReviewLayout + ArticleLayout (FAB-aware position).
- ✅ **Wave-0 #7 dead related** — 30 `.json`→`.html` (all 11,698 related hrefs resolve).
- ✅ **#2 Planner v2** — per-day full-route Maps link (`dayRouteLink`) + `.ics` export (`downloadICS`).
- ✅ **Wave-1 #8 quick-answer — FULL CORPUS** — 4,690 reviews+roundups (`gen-quickanswer.mjs`) **+ 6,558 articles** (attraction/itinerary/eat-ranking/food/prep/guide, `gen-quickanswer-articles.mjs`), TH+EN, from metaDesc. Now ~100% of the ~11k-page corpus has an answer-first block (and Speakable, gated on it). The audit's #1 AEO lever, fully applied.
- ✅ **Wave-1 #14 Speakable** — 3 layouts (cssSelector `.qa-body`, gated on quickAnswerHtml). *(faqs.json feed part still TODO)*
- ✅ **Wave-2 #18 ArticleLayout LCP preload** — hero `rel=preload fetchpriority=high` on ~7,170 pages. *(AVIF/WebP part still TODO)*

### Night run (2026-06-26) — all LIVE unless noted
- ✅ **#13 feeds-discovery** — restaurants 1180→830 (excluded 35 `top10-attractions-*` mistyped eat-ranking; source untouched); per-restaurant deep-cite `url #r{rank}`; `updated` date on every feed; **new `faqs.json`** (8.5k planning Q&A, lean); feeds linked from robots.txt + llms.txt.
- ✅ **#12 hub Place geo** — `GeoCoordinates` on all 77 city hubs from `province-coords.json` (extracted from gen-home PV). ⚠️ gen-hubs is NOT in prebuild → its output hubs must be COMMITTED (a `git checkout -- .` silently dropped geo once).
- ✅ **live-clock bug** — ReviewLayout static content-date stamp (removed the fake live "checked: <now>" clock + setInterval).
- ✅ **#20a Org `@id`** — Organization entity (`#org`, logo; no sameAs — no real socials) in index.html + publisher `@id`-ref in 3 layouts.
- ✅ **#15 content cluster (10 topics × TH+EN = 20 bilingual guides, all LIVE)** — festival-calendar, lgbtq (2025 marriage-equality), solo-female, accessibility, family, vegan/vegetarian (jay vs mangsawirat + fish-sauce caveat), digital-nomad (DTV visa), health/medical, halal, senior/older-traveler. Each: quickAnswer + AEO table + 5 FAQ; evergreen verified facts only; EN via verified subagent translation; reciprocal hreflang; surfaced as cards on plan-your-trip (TH+EN) + ItemList JSON-LD. (Comparison cluster #221 already existed — ~17 vs-guides.)
- ✅ **#9 best-time heatmap** — new `heatmap` block kind (ArticleLayout) + month×region climate grid in best-time-to-visit-thailand (TH+EN) + `/trip` CTA. LIVE.

## Still TODO
- **Owner-gated:** #1 GA4 ID · affiliate signups (GYG/12Go/Airalo/SafetyWing) · email endpoint (forms exist, wire to ESP)
- **Flagged for owner review (visual/infra/accuracy risk unattended):** #19 sticky CTA (FAB/currency collision) · #11 `/en/trip` (translation-heavy) · #18b AVIF/WebP `<picture>` (R2 re-upload) · #21 wishlist→planner pin (needs planner testing) · `top10-attractions-*` emit Restaurant JSON-LD for temples (fixing = retype = rendering change)
- ✅ **EN data feeds — DONE & LIVE (2026-06-26, deploy `b09a2f64`):** gen-feeds now emits hotels-en/attractions-en/guides-en/faqs-en (8,578 EN Q&A) with `/en/` URLs + `lang` field; index.json lists 9 feeds; llms.txt updated. No restaurants-en yet (only ~70 EN resto blocks migrated) — unlocks once the EN resto-ranking twins are translated.
- ✅ **112 EN eat-ranking twins — DONE & LIVE (2026-06-26, deploy `b02b46d9`):** all 76 `top10-popular-restaurants-*` + 36 `top10-attractions-*` translated to EN (reciprocal hreflang, facts byte-identical, zero Thai); unlocked the `restaurants-en` feed (850; 10 feeds total). Pipeline + validators reusable for the future i18n Tier-1 (zh/ru/…) expansion. Follow-up: refresh the 4 stale pre-existing gold resto twins.
- **Doable next (lower priority):** broader de-orphan (national-guides panel into country-thailand + map bangkok micro-areas) · #16 deep-link Klook/GYG (partly owner-gated) · refresh 4 stale gold resto EN twins · more niche guides (cooking classes, diving)
- **Note:** persona/national guides already surfaced as cards on plan-your-trip (TH+EN) via gen-hubs G.

---

## Wave 0 — unblock (this week). Mostly wiring; high ROI.
| # | Item | First step | ROI |
|---|---|---|---|
| 1 | GA4 sitewide *(scaffold done — needs ID)* | set `GA_ID` (3 spots), mark `plan_generated` a conversion in GA4 | I4/E1 |
| 2 | Activate dead affiliates | owner signs up GYG/12Go/Airalo/SafetyWing → repo-wide replace tokens across `articles` + `articles-en`, rebuild, assert grep=0 in dist, add pre-build guard | I5/E2 |
| 3 | Surface `/trip` | add "plan with AI" nav item + hero CTA in `index.html` (nav-mid ~L286), mirror into 3 layouts + footer; drop `noindex`; add SEO intro | I5/E2 |
| 4 | Wire email capture | `.nl-form` + `trip.html #pmGo` POST to one Cloudflare Worker→ESP (Brevo/Buttondown) with success/error states; add to ReviewLayout price widget | I5/E2 |
| 5 | Fix hreflang 404 bug | `hasEn` guard + `x-default` in ArticleLayout | I4/E2 |
| 6 | Currency on review + article | add `currency.js` to ReviewLayout + ArticleLayout; extend SEL to `.pw-price/.pw-opt-pr/.resto-price .pv/.rv-pf` | I4/E1 |
| 7 | Strip `.json` from 30 dead `related` hrefs | extend `fix-orphan-related.mjs` + lint assertion | I3/E1 |

## Wave 1 — planner + citations (2–4 wk). The #1-planner + AI-citation core.
| # | Item | First step | ROI |
|---|---|---|---|
| 8 | Quick-answer on 2,102 reviews + 243 roundups (0% today) | batch script injects leading 40–55w `quickAnswerHtml` from title + metaDesc + first FAQ | I5/E3 |
| 9 | Best-time heatmap → `/trip` | month×region rain/crowd/price cells in `best-time-to-visit-thailand.html`, "plan this month" → `/trip?month=` | I4/E3 |
| 10 | Day route map + `.ics` export in `/trip` | per-day `maps/dir/?api=1` waypoint link + VEVENT export in day-card footer (data in `ta_trip`) | I4/E2 |
| 11 | Ship `/en/trip` (TH-only today) | clone trip.html, translate UI via `ui.en.json`, route through worker; unlocks foreign-gated eSIM/insurance/car rows | I4/E3 |
| 12 | Enrich 77-hub Place schema | geo + Wikidata `sameAs` + `containsPlace` + `aggregateRating` in `gen-hubs.mjs` (REVS already computed) | I4/E3 |
| 13 | Feeds discoverable + deep-cite | feed URLs in sitemap.xml w/ lastmod, `updated` date per feed, link from robots, `url listUrl#r{rank}` per restaurant | I4/E2 |
| 14 | Speakable + `faqs.json` feed | WebPage+SpeakableSpecification (`.qa-body`,`.faq summary`) in 3 layouts; aggregate every page `faq[]` to `feeds/faqs.json` | I3/E2 |

## Wave 2 — depth + authority (1–2 mo). New audiences + revenue depth.
| # | Item | First step | ROI |
|---|---|---|---|
| 15 | Persona cluster | citation-ready TH+EN pages (quickAnswer + 5 FAQ): `lgbtq-thailand-guide`, `solo-female-travel-thailand`, `thailand-festival-calendar`, `accessible-travel-thailand`; wire festival dates into `/api/plan` | I5/E3 |
| 16 | Deep-link Klook/GYG to real products | per-item `activity` field (specific product URL) on ranked/attraction articles; fall back to search; seed top ~30 | I5/E4 |
| 17 | Flights affiliate module | WayAway/Trip.com Flights block in ArticleLayout (bangkok-to/getting-around) + a flights group in `trip.html` | I4/E3 |
| 18 | AVIF/WebP + ArticleLayout LCP | `optimize-images.mjs` emits avif/webp; `<picture>` in `asset()`; hero preload+fetchpriority + img width/height across 3 layouts | I4/E4 |
| 19 | Sticky booking CTA on itinerary/attraction/guide | slim sticky bar w/ Agoda/Klook from `crumbCity`, gated against resto rail | I4/E3 |
| 20 | Org entity + de-orphan hubs | `Organization @id #org` + `sameAs` referenced as publisher in 3 layouts; national-guides panel into `country-thailand.html`; map sukhumvit/silom/thonglo clusters to area-bangkok hubs | I3/E2 |
| 21 | Wishlist→planner pin + per-day reshuffle | 3-state pin per saved chip, `mustInclude` in prefs, client-side reshuffle (no AI call) | I3/E3 |

---

## Owner unblocks (gating)
1. **GA4 Measurement ID** (`G-XXXXXXXXXX`) + Search Console verify token
2. **Affiliate signups:** GetYourGuide (unlocks 6,512 files), 12Go, Airalo, SafetyWing — then provide the IDs
3. **Email platform** (Brevo/Buttondown/Mailchimp) + list endpoint
4. (later) translation budget for i18n Tier-1 zh/ru

## Raw
Full 6-lens audit + 52 findings: run `wf_7f27b29d-cb0` (resumed `wyqc97264`). Lenses: trip-planner, AEO/GEO, SEO/linking/CWV, UX/CRO, persona-content, monetization.

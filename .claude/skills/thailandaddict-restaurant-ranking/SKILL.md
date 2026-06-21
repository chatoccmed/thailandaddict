---
name: thailandaddict-restaurant-ranking
description: Build a "10 ร้านอาหารยอดนิยมในจังหวัด<X>" (Top-10 popular restaurants per province) eat-ranking article for Thailandaddict — the v3 monetized format proven on Chiang Mai (gold reference) and Bangkok. Covers the full pipeline: run the Workflow engine (research ratings/best-for/zone/foodType + fetch 4 credited photos/restaurant + write ≥200 Thai words each + local-tips), extract the returned article JSON, verify on disk, build, preview, and commit. Encodes the hotel-affiliate monetization model (per-card stayHref + mid-article staycta module + sticky hotel rail + Klook food-tour module), the any-source+credit+takedown image policy, the two critical engine gotchas (args arrive as a JSON string; the return is nested under .result as a JSON string), and the verify gate. Detailed block/field spec + design features in `references/format-spec.md`. TRIGGER on phrases like: "ทำ 10 ร้านอาหารยอดนิยม [จังหวัด]", "จัดอันดับร้านอาหาร [จังหวัด]", "เขียนบทความร้านอาหาร [จังหวัด]", "ทำหน้าร้านอาหาร [จังหวัด]", "สเกลร้านอาหาร [จังหวัด]", "ทำตาม skill ร้านอาหาร", "10 ร้านอาหาร [จังหวัด] ตาม skill", "build restaurant ranking [province]", "top 10 restaurants [province]".
---

# Thailandaddict — Restaurant Ranking (eat-ranking) Builder

The owner's canonical recipe for the **"10 ร้านอาหารยอดนิยมในจังหวัด&lt;X&gt;"** article type — a per-province Top-10 popular-restaurants page whose primary job is to **earn hotel-booking affiliate revenue** off food-search traffic (people search "ร้านอาหาร <จังหวัด>" far more than "โรงแรม <จังหวัด>"; we capture them and route to hotel roundups).

This SKILL.md is the **overview + build pipeline**. The exact block/field spec and rendered design features live in [`references/format-spec.md`](./references/format-spec.md) — read it before writing data by hand or changing the engine.

## 🥇 Gold references (match these — never overwrite)
- **Chiang Mai** — `astro/src/content/articles/top10-popular-restaurants-chiang-mai.json` (the v3 standard)
- **Bangkok** — `astro/src/content/articles/top10-popular-restaurants-bangkok.json` (first scaled province, engine-generated)
- Render: `astro/src/layouts/ArticleLayout.astro` (type `eat-ranking`) · Schema: `astro/src/content.config.ts`

## วิธีเรียกใช้ (Invocation)
Auto-trigger (พิมพ์ได้เลย — skill ถาม "จังหวัดไหน" ถ้าไม่ระบุ):
- `ทำ 10 ร้านอาหารยอดนิยม [จังหวัด]` · `จัดอันดับร้านอาหาร [จังหวัด] ตาม skill` · `ทำหน้าร้านอาหาร [จังหวัด]`
- `สเกลร้านอาหารต่อ [จังหวัด]` · `ทำตาม skill ร้านอาหาร`
Explicit: `/skill thailandaddict-restaurant-ranking [จังหวัด]`

---

## 🏗️ The engine (do NOT hand-write articles)
`_internal/wf/restaurants-roundup.js` is a **Workflow** script. 4 phases:
1. **Plan** — pick the 10 most-talked-about restaurants in the province (real, famous, review-backed).
2. **Write** (10 parallel agents) — per restaurant: research + write `descHtml` ≥200 Thai words; research Google `rating`/`ratingCount`/`ratingSrc`; set `bestFor`/`zone`/`foodType`/`mustOrder`/`priceRange`; global-tourist fields `hours`/`priceUsd`/`spice`/`halal`/`veg`/`englishMenu`; `lat`/`lng`; **fetch 4 credited photos** (main + `gallery[3]`), each with `credit`/`creditHref`.
3. **Frame** (1 agent) — province prose: `title`/`h1`/`intro`/`chips`/`faq`/`tip`/`cta` + `staycta` text + `foodexp` text + **localtips** (4–6 know-before-you-go cards).
4. **Assemble** (deterministic JS) — builds the full article object (restaurant + staycta + foodexp + localtips blocks + sticky `rail` from args + per-card `stayHref` via `stayMap`) and **returns it** for the main loop to write + verify.

### ⚠️ Two gotchas that WILL bite (both fixed in-engine, keep them)
1. **`args` arrives as a JSON string**, not an object. The engine does `const A = typeof args==='string'?JSON.parse(args):(args||{})` then reads `A.x`. If you ever read `args.x` directly it silently defaults to Chiang Mai → wrong province. (This caused a first run to overwrite CM with Bangkok junk.)
2. **The Workflow return is nested.** The task output file is `{summary,logs,result}` where `result` is itself a **JSON string**. Extract with `JSON.parse(r.result).article`, then write to disk yourself. The notification preview truncates — always read the full task output file.

---

## ▶️ Build pipeline (per province)
```
0. Sync:   git fetch origin && git rebase origin/main   (a parallel session edits the repo — always rebase)
1. Args:   hand-craft or `node _internal/wf/build-resto-args.mjs <city>` → {prov,city,slug,display?,hi?,region,
           stayDefault,stayMap,stayCta,rail,related}. rail/stayCta MUST point to REAL roundups on disk
           (ls astro/src/content/roundups/ | grep <city>). See references/format-spec.md §args.
2. Run:    Workflow scriptPath=_internal/wf/restaurants-roundup.js  args=<the object>   (ONE workflow at a time)
           — ~20-25 min, ~750K subagent tokens. Wait for the completion notification; do NOT launch a 2nd.
3. Extract: node -e 'r=JSON.parse(fs.readFileSync(TASKFILE)); res=JSON.parse(r.result);
           fs.writeFileSync("astro/src/content/articles/top10-popular-restaurants-<city>.json",
           JSON.stringify(res.article,null,2)+"\n")'
4. Verify: node _internal/wf/verify-resto.mjs <city>   → must be errors=0 (warns OK). Fixes:
             • BAN word (ระดับโลก/โดดเด่น/ตอบโจทย์/ครบครัน/สุดยอด/อันซีน) → replace
             • image missing on disk → re-fetch (curl official/FB/Wongnai/blog/CC, sharp-decode, >15KB)
             • desc <700 Thai chars → expand · link not a real roundup → fix stayMap/rail/stayCta
6. Build:  node audit (errors=0) → bash _internal/build-test.sh → "BUILD OK"
7. Preview: mkdir -p ~/ta-build-temp/dist/images/{food,hotels} && cp -r astro/public/images/food/. <dist>/images/food/
           → node _internal/preview-server.mjs ~/ta-build-temp/dist 4400
           → owner opens (must TYPE in browser): localhost:4400/top10-popular-restaurants-<city>.html
8. Commit: git add (engine if changed, article json, public/images/food/<city>/) →
           commit identity user.name=chatoccmed user.email=chatoccmed@users.noreply.github.com →
           rebase origin/main → push
```

### Preview screenshot gotcha
The Leaflet/OSM map keeps the network busy → the screenshot tool times out. Before screenshotting via the ssnap preview MCP: set `*{overflow-anchor:none}`, remove `.rmap-sec` **while scrolled to top** (removing it mid-scroll bounces scroll to the bottom), disable `scroll-behavior:smooth`, then capture. localhost links are NOT clickable in chat — tell the owner to type the URL in Chrome's address bar (only works on the build machine).

---

## 🖼️ Image policy (v4 — embed-first, copyright-safe · CURRENT)
> Supersedes the old "scrape any-source galleries + credit" policy (owner: copyright risk too high). Demo'd on Lampang.

Restaurant card media = a **tabbed embed** (`📷 Instagram · 📘 Facebook · 🗺️ แผนที่`) — NOT scraped per-restaurant gallery photos.
- **IG is the default tab** (most engaging), FB 2nd (iframe Page Plugin, `height=540` to fit the box), Map 3rd (Google Maps `?q=<name> <province>&output=embed`, lazy). Layout: `ArticleLayout.astro` embed-mode (triggers on `igPost||fbPage||libImg||!img`).
- **Show only WebFetch-VERIFIED social URLs.** Auto-research returns wrong-location / hallucinated URLs OFTEN (e.g. a Krabi branch's FB for the Lampang shop, a stranger's reel). Verify EACH: `https://www.instagram.com/p/<code>/embed/` exists + names this restaurant; FB page og:title = right business + province. Drop anything unverified. Honesty over coverage.
- **No verified IG/FB → reusable CC library.** `_internal/food-image-lib.json` (19 dishes, CC-licensed, on R2 at `/images/food/_lib/`) via `matchFoodImage(foodType,cuisine,signature,name)` in `_internal/wf/lib-match.mjs` → sets `libImg`/`libCredit`/`libCreditHref` (renders as a `🍜 รูป` tab). Rebuild/extend: `cd astro && node ../_internal/build-food-lib.mjs`.
- **Hero** = one CC dish/landmark image (Wikimedia, sized 1600w, served from R2), credited via `heroCredit`/`heroCreditHref`.
- Every image keeps `credit`+`creditHref`; takedown box still renders. **Never** scrape/store a restaurant's copyrighted photos or use Trip.com/wrong-restaurant images. `img` field is now optional (embed-mode cards have no hero photo).

## ✅ Quality gates (honesty-first — brand LOCKED)
- 10 restaurants, each `descHtml` ≥200 Thai words (verify checks ≥700 Thai chars), real & review-backed.
- Tone = friend-to-friend (v2-clean). **Ban slang** อ่ะ/ปะ/แหละ/ล่ะ and **AI words** ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน.
- **Honesty:** "คัดจากเสียงรีวิวจริง" — never claim we ate there. Ratings only with a real source; restaurants missing a real `ratingCount` show `⭐ x.x` without a count (do NOT invent a number).
- AggregateRating JSON-LD emitted only for restaurants with a real count.

## 📈 Scaling (when owner says go)
- **One workflow at a time** (avoids socket errors), commit + push each province, report per batch.
- Start with provinces that already have hotel roundups (the rail/staycta need real targets): Bangkok ✓, Chonburi/Pattaya, Krabi, Hua Hin, Phuket, Samui, Chiang Rai… `ls astro/src/content/roundups/ | grep <city>`.
- Owner's standing ROI lean: do the **~15-20 tourist provinces first** (high search + sellable hotels) before completing all 77.
- 75 provinces ≈ 25-30 h workflow + heavy tokens → multi-session. Never silently cap; report what's done/skipped.

## Anti-patterns
- ❌ Hand-writing the article JSON — use the engine (deterministic assemble prevents missing-field/slug-rename bugs).
- ❌ Reading `args.x` directly (it's a string) · ❌ using the truncated notification instead of the full task output file.
- ❌ Overwriting a gold reference (CM/Bangkok) · ❌ rail/staycta pointing to a roundup that doesn't exist on disk.
- ❌ Fabricated ratings/counts/photos · ❌ Trip.com/stock images · ❌ launching a 2nd workflow before the 1st returns.
- ❌ Skipping `git rebase origin/main` before push (parallel EN/other session is editing).

## Related files
- Engine: `_internal/wf/restaurants-roundup.js` · Verify: `_internal/wf/verify-resto.mjs` · Args helper: `_internal/wf/build-resto-args.mjs` (draft — labels need rework for bulk)
- Image library (v4): `_internal/food-image-lib.json` (manifest, 19 dishes) · `_internal/wf/lib-match.mjs` (matcher) · `_internal/build-food-lib.mjs` (builder) · images on R2 `/images/food/_lib/`
- Handoff/history: `_internal/RESTAURANT-REVIEW-HANDOFF.md` · Format spec: [`references/format-spec.md`](./references/format-spec.md)
- Affiliate IDs (CLAUDE.md): Agoda cid=1965862 · Trip Allianceid=6861268&SID=312919111 · Klook aid=121442 · GetYourGuide via `getyourguide.com/s/?q=<city>`

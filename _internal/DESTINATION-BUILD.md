# 🏝️ DESTINATION CLUSTER BUILD — 12 sub-destinations (handoff)

Build 12 popular sub-destinations (islands / tourism towns) to the gold standard, **scaled to size**.
Same pipeline as provinces (see `_internal/PROVINCE-PLAYBOOK.md`) but these are NOT provinces.
Site is LIVE: https://thailandaddict.chatmaliwan.workers.dev (auto-deploys on push to `main`).

## Order + depth (user-chosen: scale to size, build in this order)
1. ✅ koh-phangan (เกาะพะงัน) — DONE (12 reviews + 30 articles + images)
2. ✅ hat-yai (หาดใหญ่) — DONE (12 reviews + 37 articles + images)
3. ✅ samui (เกาะสมุย) — DONE (12 reviews + Top10 + 37 articles + images). NOTE: Surat Thani province cluster
   already has a few Koh Samui hotels (cluster=surat-thani, slug …-surat-thani) — those are legit surat-thani
   content, leave them; the samui cluster's own 12 reviews use slug review-…-samui.
4. ✅ pai (ปาย) — DONE (12 reviews + 30 articles + images). slug review-…-pai (mae-hong-son keeps its own pai-… articles)
5. ✅ pattaya (พัทยา) — DONE (12 reviews + 37 articles + images). slug review-…-pattaya (chonburi keeps its pattaya-… set)
6. ✅ huahin (หัวหิน) — DONE (12 reviews + 37 articles + images)
7. ✅ khao-yai (เขาใหญ่) — DONE (12 reviews + 37 articles + images). Used khaoyai- article prefix + review-…-khao-yai to dodge prachinburi/korat/nakhon-nayok khao-yai-… slugs
8. ✅ koh-chang (เกาะช้าง) — DONE (12 reviews + 26 articles + images). slug review-…-koh-chang (trat keeps koh-chang-… set)
9. ✅ koh-lipe (เกาะหลีเป๊ะ) — DONE (12 reviews + 22 articles + images). review-…-koh-lipe
10. ✅ koh-kood (เกาะกูด) — DONE (12 reviews + 20 articles + images). review-…-koh-kood (trat keeps koh-kood-… set)
11. ✅ koh-mak (เกาะหมาก) — DONE (12 reviews + 18 articles + images). review-…-koh-mak
12. ✅ koh-larn (เกาะล้าน) — DONE (12 reviews + 18 articles + images). review-…-koh-larn

**🎉 ALL 12 DESTINATIONS COMPLETE (2026-06-13).** Next phase (future): EN article translation pass · the i18n 9-language + tourism-city layer (see `_internal/I18N-AND-TOURISM-CITY-PLAN.md`).

## Infra ALREADY done (do NOT redo)
- `_internal/gen-hubs.mjs` has a `DESTINATIONS` list (all 12 slugs w/ thai name + parent region). It generates
  `city-<slug>.html` hubs WITHOUT inflating the "77 จังหวัด" count; destinations.html + search include them.
- `astro/src/content.config.ts` reviewSchema cluster enum already includes ALL 12 slugs
  (koh-phangan/samui/pai/pattaya/huahin pre-existed; hat-yai/khao-yai/koh-chang/koh-lipe/koh-kood/koh-mak/koh-larn added).
- Slugs use: koh-phangan, hat-yai, samui, pai, pattaya, **huahin** (no dash — matches existing enum), khao-yai,
  koh-chang, koh-lipe, koh-kood, koh-mak, koh-larn.
- Review-page image fix: `.heroimg`/`.gp` etc. now use a brand-gradient placeholder (committed) — missing
  hotel photos degrade gracefully (no black boxes).

## Per-destination pipeline (clone koh-phangan / samui workflow files)
1. Create `_internal/province-data/<slug>.json` (th, tagline, introHtml, bestTime, highlights[], foodScene[],
   attractions[{name,kind,blurb}], itineraryIdeas[], neighbors[] (must be existing province/dest slugs), heroEmoji).
   Research the real destination — accurate beaches/attractions/food.
2. Clone `_internal/wf/samui-{hotels,articles,images}.js` → `<slug>-{hotels,articles,images}.js`, adapt:
   cluster=<slug>, crumbCity=<th>, crumbCityHref=city-<slug>.html, parentHref=top10-hotels-<slug>.html,
   tailored hotel areas + article topic lists (FOOD/SEE/PLAN/PREP), scaled article count.
3. **Collision-check** every non-`<slug>`-prefixed article slug:
   `for s in <slugs>; do [ -e astro/src/content/articles/$s.json ] && echo COLLISION $s; done`
   If a slug exists in ANOTHER cluster, RENAME this destination's to a `<slug>-`prefixed variant in BOTH
   the articles AND images workflow files (e.g. hat-yai renamed khlong-hae-floating-market → hat-yai-khlong-hae-market).
4. Commit setup (province-data + 3 wf files + city-<slug>.html), then launch hotels+articles workflows.
5. On hotels done: verify on disk (`ls reviews/|grep -c <slug>`), check roundup entries resolve + 0 dangling,
   validate JSON parse; commit reviews+roundup+hotel images. ⚠️ planner sometimes writes DUPLICATE hotels
   (e.g. same hotel under two slugs / an off-spec `-songkhla` suffix). If review count > 12 and extras aren't in
   the roundup, `git rm` the stray dup review files (TH+EN) and commit.
6. On articles done: workflows report ok but FILES MAY BE MISSING — verify each slug on disk; re-generate any
   missing with a single Agent (cluster must = <slug>). Commit articles.
7. Run `<slug>-images.js`. Verify on disk (image workflows over-report; some hang for hours). If short + stale
   mtimes: TaskStop + recover missing slugs (small recover wf or 1 Agent each). Commit images.
8. Finalize: optimize (astro/_optimize.mjs sharp-via-buffer, then rm), `node _internal/lint-content.mjs <slug>`
   (fix banned words), `node _internal/set-hero.mjs`, `node _internal/gen-hubs.mjs`, `bash _internal/build-test.sh`
   (must end BUILD OK), then `git add -u` + `git add astro/public/city-<slug>.html` + commit finalize + push.

## ⚠️ KHAO-YAI NOTE (destination 7)
Many `khao-yai-*` article slugs ALREADY exist (built into the prachinburi / nakhon-nayok clusters:
khao-yai-national-park-guide, khao-yai-cafe-guide, khao-yai-2d1n-plan, khao-yai-winery-guide, etc.).
Before building the khao-yai cluster: list existing `khao-yai-*` + `pak-chong-*` articles, and either reuse
(reassign cluster) or use DISTINCT slugs for the new khao-yai cluster to avoid overwriting prachinburi's content.
Collision-check is mandatory here.

## Build env / gotchas (same as provinces)
- bash: `export PATH="$HOME/nodejs:$PATH"` first. Python unavailable.
- sharp needs a Buffer (UNKNOWN open on Windows) — use the astro/_optimize.mjs snippet, run `node astro/_optimize.mjs`, then delete.
- git commit in bash: `git -c user.name="chatoccmed" -c user.email="chatoccmed@users.noreply.github.com" commit -F - <<'EOF' … EOF`.
- finalize-guard blocks deletions — for intentional dup-removal, git rm + commit directly (verify exact files first).
- affiliate IDs: Agoda cid=1965862 · Trip Allianceid=6861268&SID=312919111 · Booking plain.
- Commit each phase IMMEDIATELY (don't leave large untracked windows).
- honesty + v2-clean Thai (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน).

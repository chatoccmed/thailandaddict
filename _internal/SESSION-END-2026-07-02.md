# SESSION HANDOFF — 2026-07-02 (Bangkok ย่าน megaproject: last 6 neighborhoods)

Autonomous run (Fable 5). Goal was "ทำงานทุกย่านให้เสร็จ" — finish all remaining Bangkok ย่าน. **5 of 6 are COMPLETE + committed locally; the 6th (saphan-taksin) is mid-build.** Nothing is pushed or deployed (see BLOCKERS).

## ✅ DONE + committed LOCALLY (5 full ย่าน — all 5 dims TH+EN, verify errors=0 / EN validate PASS)
| ย่าน | commit | notes |
|---|---|---|
| **kaset** (เกษตร-นวมินทร์) | 95b1417c8 + e65c01cea | cafes: swapped Davin/Found (bang-khen dups)→B-Story/Plantation |
| **chaeng-watthana** (แจ้งวัฒนะ) | 95b1417c8 | 9 hotels + top9/value-5; attr swapped nonthaburi-dup สวนสมเด็จ→Wat Lak Si |
| **ramkhamhaeng** (รามคำแหง-หัวหมาก) | 2a02386bd | 10 hotels (reuse the-quarter/regent-22/inter-place); attr swapped 2 cafe-dups→Wat Si Bun Rueang/Suan Piya Phirom |
| **bangkapi** (บางกะปิ) | 42200f396 | top8 (reuse Baron Residence/Zotel/Aunchaleena) + value-5 (@81/Grand Mandarin new); attr swapped วัดศรีบุญเรือง→Wat Bueng Thonglang; Sol Bar café de-politicized |
| **charoen-krung** (เจริญกรุง) | 47a9ed58b | top7 (hostels + reuse Loftel 22); restaurants swapped Sarnies→Charoen Wiang Pochana; dedup vs silom Prachak/Baan Phadthai |
+ infra commit 891ecde48 (reviewer/fix workflows), doc commit d4ac10f65.

## 🟡 saphan-taksin (สะพานตากสิน) — ย่าน #35 IN PROGRESS
- ✅ **7 hotel reviews TH+EN + images COMMITTED** (1ccd43fae): Centre Point Plus Silom(4★8.8)/Marriott Surawongse(5★9.1)/Furama Silom(4★8.1)/Jasaen(3★8.8)/Sathorn Terrace(3★7.8)/P&R Residence(3★7.6)/New Road GH(3★7.8) + REUSE Prince Theatre (review-prince-theatre-heritage-stay-bangkok, chinatown).
- ✅ **BOTH roundups DONE + COMMITTED (TH+EN):** `top8-hotels-saphan-taksin-bangkok` (d8dc94464 — ranked: Marriott Surawongse 5★9.1, Centre Point Plus Silom 4★8.8, Jasaen 3★8.8, Prince Theatre reuse 3★8.6, Furama Silom 4★8.1, New Road GH 3★7.8, Sathorn Terrace 3★7.8, P&R Residence 3★7.6) + `top5-love-hotels-saphan-taksin-bangkok` (16a48da9b — Jasaen, Prince Theatre, Sathorn Terrace, New Road GH, P&R Residence). top8 EN twin passed the raw-Thai check.
- ⏳ **TODO to finish saphan-taksin:** (1) — (roundups already done+committed); (2) run 3 eat-rankings (restaurants/cafes/attractions) via `_internal/wf/{restaurants,cafes,attractions}-roundup.js` with `city=saphan-taksin`, slug `top10-popular-restaurants-saphan-taksin` etc., prov="ย่านสะพานตากสิน (BTS สะพานตากสิน · ท่าเรือสาทร/Central Pier · โรบินสันบางรัก · สาทร) กรุงเทพฯ", stayDefault=top8-hotels-saphan-taksin-bangkok.html, rail=[top8 + Marriott Surawongse + Centre Point Plus Silom], **avoid** = ALL Bang Rak venues already used (see dedup below); (3) per eat-ranking: extract res.article → fix crumbCity="ย่านสะพานตากสิน"/crumbCityHref="area-bangkok-saphan-taksin.html" → finalize-resto + verify-resto (restaurants/cafes) → attractions need CC hero+no-social images (Wikimedia) → EN twin (direct agent) + resync-en-twin + validate-en-twin; (4) commit.
- **⚠️ saphan-taksin eat-ranking AVOID (it's the most-overlapping ย่าน — Bang Rak shared with charoen/silom/riverside/chinatown):**
  - restaurants: avoid charoen (Samlor/80/20/Jok Prince/Hanaya/Home Cuisine Islamic/เจริญเวียงโภชนา/กิมโป้/Small Dinner Club/มิสเตอร์โจ/DAG) + silom (Prachak/Baan Phadthai/Eat Me/Le Du/Somtum Der/Indian Hut/…) + riverside + chinatown lists. ✅ saphan GETS: ตลาดบางรัก street food (ข้าวมันไก่/ข้าวหน้าเป็ด/ส้มตำ), ครัวอัปษร, Ma! Bang Rak Bazaar, Silom Soi 20 muslim/indian. (Muslim Restaurant = CLOSED 2020, don't use.)
  - cafes: avoid charoen (Sarnies/Tangible/**a Coffee Roaster by li-bra-ry**/BLACKWOOD/madi/CARMINA/MaLet's/ENVIES/Eight O'Clock/VOID) + silom + riverside + chinatown cafes (incl La Cabra). ✅ saphan GETS: Blue Whale, pier/rooftop cafes near Central Pier, Robinson Bangrak dessert cafes, ฮารูณ community coffee.
  - attractions: avoid charoen (TCDC/Warehouse 30/street-art/ATT 19/So Heng Tai/Bangkokian Museum/O.P. Place/Haroon Mosque/P.Tendercool) + riverside (ICONSIAM/Wat Arun/Asiatique/…) + silom (Mahanakhon/Lumpini/…) + chinatown. ✅ saphan GETS (reserved): ท่าเรือสาทร/Central Pier, อาสนวิหารอัสสัมชัญ (Assumption Cathedral), โรบินสันบางรัก, ตลาดบางรัก, โบสถ์กาลหว่าร์ (Holy Rosary), จุดชมพระอาทิตย์ตกสะพานตากสิน. ⚠️ O.P. Place + Haroon Mosque were taken by charoen — do NOT reuse.

## 🚀 AFTER saphan-taksin: gen-hubs + deploy
1. **`node _internal/gen-hubs.mjs`** — regenerate the area-bangkok-*.html hubs so all 6 new ย่าน's roundups/eat-rankings surface (the hubs exist but were built before this content). Commit the regenerated area hubs (do NOT commit the 4 prebuild-regenerated files: index.html/en/index.html/sitemap.xml/search-index.json/en/search-index.json).
2. Deploy (see blockers).

## ⛔ SHIP BLOCKERS — all need the OWNER (nothing is live)
1. **git push origin main** — DENIED by the auto-mode classifier this session. Owner must authorize / run `git push origin main`, or add a Bash allow-rule. ~8 local commits ahead of origin.
2. **R2 image upload** — `~/.r2-creds` (R2_API_TOKEN) MISSING. ALL new hotel + attraction-CC images (this run) will 404 in prod until uploaded (`node _internal/upload-r2-api.mjs`). Set `R2_API_TOKEN=<token>` in `~/.r2-creds`.
3. **wrangler deploy** — `CLOUDFLARE_API_TOKEN` not set (registry empty). `setx CLOUDFLARE_API_TOKEN "<token>"` then `powershell -File _internal/deploy.ps1`.
4. Agent web-research classifier was INTERMITTENTLY unavailable late in the run (blocked WebFetch/curl inside agents → some reviews came back with missing/dup images, all caught + re-fetched). Verify it's healthy before building more.

## 📎 Key context (persisted)
- Reuse map + per-ย่าน dedup notes: `_internal/REMAINING-YAAN-PLANS.md`.
- Engine upgrade: all 3 eat-ranking engines (`_internal/wf/{restaurants,cafes,attractions}-roundup.js`) now take an `avoid` arg (hard cross-page dedup at Plan step).
- Memory `workflow-resume-needs-same-args`: resuming a hung eat-ranking Workflow MUST pass the same args or it re-runs with chiang-mai defaults (nearly overwrote a live page — caught).
- Pipeline per ย่าน: reviewers workflow → 2 roundup-builder agents → 3 eat-ranking engines → finalize/verify → attractions CC images → EN twins (resync+validate) → commit. Engines hang ~30-40% at Frame→Assemble → TaskStop + resume (with same args for eat-rankings; no args for reviewers).

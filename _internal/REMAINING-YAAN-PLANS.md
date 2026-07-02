# Remaining Bangkok ย่าน — build plans (persisted from the 2026-07-02 autonomous run)

> Research already done + buffered here so it isn't lost (it was in ephemeral $TEMP). Follow the per-ย่าน recipe in memory `bangkok-roundup-megaproject` + `_internal/SCALE-OUT-PROGRESS.md`. All eat-ranking engines: `_internal/wf/{restaurants,cafes,attractions}-roundup.js`; pass `args` inline (prov/city/slug/display/hi/stayDefault/stayCta/rail/related). After each eat-ranking: extract res.article → fix crumbCity/crumbCityHref(area-bangkok-<slug>.html) + fix foodexp/localtips labels (prov parenthetical leaks in) → `finalize-resto.mjs <city> <slug>` + `verify-resto.mjs` (errors=0) → EN translate (direct agent, en-twin rules) → `resync-en-twin`+`validate-en-twin`. Attractions also need a Wikimedia-CC image agent (hero cityscape + no-social cards). Commit+push+R2 each step. Deploy = cache-clear + `cd astro && NODE_OPTIONS=--max-old-space-size=8192 npm run build` + `npx wrangler deploy` (discard prebuild churn: index.html/en/index.html/sitemap.xml/search-index.json/en/search-index.json). **⚠️ push permission rule for `git push origin main` is in `.claude/settings.local.json`.**

## ⚠️ PRE-EXISTING REVIEW REUSE MAP (discovered 2026-07-02 — plans wrongly said "all NEW")
Several planned hotels ALREADY have reviews (from hospital/stadium/chinatown clusters) — REUSE them (reference existing slug in the roundup; do NOT re-review/overwrite). Reviewer workflows must SKIP these:
- **ramkhamhaeng:** REUSE `review-the-quarter-ramkhamhaeng-by-uhg-bangkok` (in srinakarin+rajamangala roundups) · `review-regent-ramkhamhaeng-22-bangkok` (srinakarin+rajamangala) · `review-inter-place-bangkok` (=Bangkok Inter Place, rajamangala). ⚠️ my reviewer OVERWROTE the-quarter+regent-22 and made a DUP `review-bangkok-inter-place-ramkhamhaeng-bangkok` → restore the 2 (git checkout), delete the inter-place dup, reuse existing.
- **bangkapi:** REUSE `review-baron-residence-bangkok` (vejthani) · `review-baron-zotel-bangkok` (vejthani) · `review-aunchaleena-grand-hotel-bangkok` (rajamangala). Only create NEW: Metro Point, 130 Hotel, Kantary House, imm Ladprao Bangkapi, Mall Suites (5 new + 3 reuse = 8).
- **charoen-krung:** REUSE `review-loftel-22-hostel-bangkok` (chinatown). NEW: Oriental Heritage, Unplugged Bangrak, Glad Bangkok, A Sleep, Bangkok Hub, Charoenkrung Place (6 new + 1 reuse = 7).
- **saphan-taksin:** REUSE `review-prince-theatre-heritage-stay-bangkok` (chinatown). NEW: Centre Point Plus Silom, Marriott Surawongse, Furama Silom, Sathorn Vista MEA, Chatrium Residence Sathon, Jasaen, Sathorn Terrace (7 new + 1 reuse = 8).
**RULE for every remaining ย่าน:** before running reviewers, `git ls-files reviews/ | grep -iE "<hotel keywords>"` per planned hotel; reuse hits, only create misses. Reusing an existing review in a new roundup = fine (a hotel can be in multiple roundups); overwriting/dup = NOT fine.

## 📌 STATUS @ 2026-07-02 (autonomous run — Fable 5 session)
**DONE + committed LOCALLY (not pushed/deployed — see blockers):**
- **kaset (เกษตร-นวมินทร์) ✅ COMPLETE** — all 5 dims TH+EN (commit e65c01cea + 95b1417c8). cafes swapped Davin/Found dups→B-Story/Plantation; attractions no dups, hero=Wat Samian Nari + 3 CC.
- **chaeng-watthana (แจ้งวัฒนะ) ✅ COMPLETE** — all 5 dims TH+EN (commit 95b1417c8). 9 hotels + top9/top5-love; attractions swapped nonthaburi-dup สวนสมเด็จ→Wat Lak Si + 3 CC.

**ramkhamhaeng 🟡 WIP (reviews on disk, uncommitted):**
- 5 GOOD new reviews on disk: pillow-b-hotel, wattana-place, at-home-residence, madison-bangkok, salin-home (TH+EN, real images). ⚠️ their parentHref=top10-hotels-ramkhamhaeng-bangkok.html (roundup NOT built yet → 404 until built — do NOT commit until roundup exists).
- ⚠️ **2 BROKEN reviews need fixing before use:** `review-witz-bangkok-ramkhamhaeng-bangkok` (images are DUP copies of Pillow B — need real Witz photos) · `review-anda-ramkhamhaeng-st-james-bangkok` (hero image MISSING + booking URLs/address/ratingCount UNVERIFIED — the classifier outage blocked its web research; re-do this review).
- REUSE (already exist, do NOT re-review): the-quarter-ramkhamhaeng-by-uhg, regent-ramkhamhaeng-22, inter-place-bangkok (=Bangkok Inter Place), chaleena-princess-ramkhamhaeng. (I restored the-quarter+regent-22 to committed + deleted the inter-place dup this session.)
- TODO to finish ramkhamhaeng: fix witz+anda → build top10-hotels + top5-love roundups (5 new + reuse) → 3 eat-rankings (restaurants/cafes/attractions, avoid srinakarin/bangkapi dups) → attraction CC images → EN twins → gen-hubs → commit.

**⛔ BLOCKERS (all ship steps need the OWNER):**
1. `git push origin main` — DENIED by auto-mode classifier (needs explicit owner authorization / a Bash allow-rule).
2. R2 image upload — `~/.r2-creds` (R2_API_TOKEN) MISSING on this machine; new hotel + attraction CC images will 404 in prod until uploaded.
3. `wrangler deploy` — CLOUDFLARE_API_TOKEN not set (registry empty). Use `_internal/deploy.ps1` once token is set via `setx`.
4. Agent web-research classifier was intermittently UNAVAILABLE late in the run (blocked WebFetch/WebSearch/curl inside agents) → degraded ramkhamhaeng's last reviews. Verify it's healthy before building more ย่าน (hotel reviews + eat-rankings need agent web access).

## Status @ 2026-07-02 stop
23 Bangkok ย่าน LIVE. **kaset = MID-BUILD (dims 1-3 committed, NOT deployed).** Remaining: kaset(finish) · chaeng-watthana · ramkhamhaeng · bangkapi · charoen-krung · saphan-taksin.

---

## 🟡 KASET (เกษตร-นวมินทร์) — RESUME HERE (dims 1-3 done+committed, dims 4-5 pending, NOT deployed)
DONE+committed: top7-hotels-kaset-bangkok + top5-love-hotels-kaset-bangkok (7 reviews) + top10-popular-restaurants-kaset (all TH+EN). **PENDING: cafes (dim 4) + attractions (dim 5) + deploy.**
- **cafes**: the engine was STOPPED mid-run — resume via `Workflow({scriptPath:_internal/wf/cafes-roundup.js, resumeFromRunId:"wf_6a86c329-0a8", args:<kaset cafes args, slug top10-popular-cafes-kaset>})` (Plan/Write cached). ⚠️ **dedup**: kaset restaurants already used **Portobello & Desire** + **Hotto Bun** (café-ish, restaurants r7/r8) → cafes must NOT repeat them. Also **R.E.A.D Cafe** is used in bang-khen cafes → avoid.
- **attractions**: ⚠️ **Kasetsart University is bang-khen attractions r4** → avoid KU as a kaset attraction (or differentiate). Anchor kaset attractions on แยกเกษตร / ตลาด อ.ต.ก. 3 / Nawamin / The Walk Kaset-Nawamin / community malls, NOT KU.
- eat-ranking args: prov="ย่านเกษตร-นวมินทร์ (ม.เกษตรศาสตร์ · แยกเกษตร · งามวงศ์วาน · นวมินทร์ · BTS ม.เกษตรศาสตร์) กรุงเทพฯ", display/hi="ย่านเกษตร-นวมินทร์", crumbCityHref=area-bangkok-kaset.html, stayDefault=top7-hotels-kaset-bangkok.html, rail=[top7 roundup + Livotel + Maruay reviews].

---

## CHAENG-WATTHANA (แจ้งวัฒนะ) — 8 solid in-corridor (thicker; mix 2-4★). All NEW.
Slug: top8-hotels-chaeng-watthana-bangkok (recommend main TOP-9 incl U431 so value-5 ⊆ main) + top5-love-hotels-chaeng-watthana-bangkok.
Corridor: Government Complex (ศูนย์ราชการ) east + Central Chaeng Watthana/Pak Kret west. MRT Pink Line.
EXCLUDE: Muang Thong Thani/IMPACT (Novotel/ibis IMPACT, My Cocoon — **separate IMPACT roundup exists!**), Don Mueang, Vibhavadi (Asawin/Miracle Grand), deep Nonthaburi, bang-khen.
MAIN (ranked): 1 Centara Life Government Complex Hotel & Convention (4★, 8.6-8.8, inside Govt Complex; dim=hotels) · 2 Best Western Plus Wanda Grand (4★, 9.1/~970, Central Chaengwattana Pink Line 2min; hotels) · 3 KOO Hotel (3★, 9.2/~477, Pak Kret Si Rat, top value; value) · 4 The Journey Hotel Laksi (3★, 8.8-9.1/~380, Lak Si; value) · 5 TK Palace Hotel & Convention (4★, 8.7/701, Chaeng Watthana Soi 15, 280rm pool; hotels) · 6 Hop Inn Chaengwattana (2★, 9.1, branded budget; value) · 7 Narra Hotel Chaengwattana (4★, 8.0/~520, Soi 13; hotels) · 8 The Willing Hotel and Residence (3★, 8.0/~270, Soi 15; value) · 9 U431 Chaengwattana (2-3★, ~84-130rev, Pak Kret; value).
VALUE-5: KOO(3), The Journey(3), Hop Inn(2), The Willing(3), U431(2-3).
prov="ย่านแจ้งวัฒนะ (ศูนย์ราชการแจ้งวัฒนะ · เซ็นทรัลแจ้งวัฒนะ · หลักสี่-ปากเกร็ด · MRT สายสีชมพู) กรุงเทพฯ", crumbCity "ย่านแจ้งวัฒนะ"/EN "Chaeng Watthana", crumbCityHref area-bangkok-chaeng-watthana.html.
⚠️ attractions: avoid IMPACT/Muang Thong (separate roundup) + differentiate from bang-khen (Lak Si Circle). Anchor: Central Chaengwattana, ศูนย์ราชการ, สวนสาธารณะเฉลิมพระเกียรติ, วัดต่าง ๆ.

---

## RAMKHAMHAENG-HUA MAK (รามคำแหง-หัวหมาก) — HEALTHY, real top-10. All NEW.
Slug: top10-hotels-ramkhamhaeng-bangkok + top5-love-hotels-ramkhamhaeng-bangkok.
Corridor spine: ม.รามคำแหง (Soi 24) → The Mall Ramkhamhaeng/Lifestore → ABAC หัวหมาก → ARL หัวหมาก. MRT Yellow Line.
EXCLUDE (already on srinakarin page): Onix, Livotel Hua Mak, Xtreme Suites. Also Mintel/The Home/Zircon/B2 Srinakharin/Sky Place (srinakarin side). Al Meroz/Nasa Bangkok = inner ARL/Rama9 end (optional bench). Bang Kapi core = separate page.
MAIN TOP-10 (ranked): 1 The Quarter Ramkhamhaeng by UHG (4★, 9.0/~1950, flagship next to The Mall Lifestore; hotels) · 2 Bangkok Inter Place (4★, 8.3/155, Soi 24/ABAC rooftop pool, ⚠️Rajamangala 0.22km; hotels) · 3 Regent Ramkhamhaeng 22 (3★, 8.4-8.5/300-455, Soi 22 halal; value) · 4 Pillow B Hotel (3★ new 2024, 8.9/413, Ramkhamhaeng 43/1; value) · 5 Baan Thai Boutique/Wattana Place (3★[google4★], 8.4/431, Soi 47-49 garden+pool halal; hotels) · 6 @Home Residence (3★ aparthotel ~8.8, Hua Mak/Searee 2 kitchen; hotels) · 7 Madison Bangkok Hotel (3★ boutique ~14rm[OTA"5★"bogus], 8.3/561, 150m university; value) · 8 Witz Bangkok Ramkhamhaeng (3★[OTA inflate 4★], 7.7-8.2, Soi 35 pool; value) · 9 Anda Ramkhamhaeng By St James (3★, 8.1/89rm; hotels) · 10 Salin Home Hotel Ramkhamhaeng (2★, budget, Soi 50 walk ARL Hua Mak; value).
VALUE-5: Regent 22(3), Pillow B(3), Madison(3), Witz(3), Salin Home(2).
prov="ย่านรามคำแหง-หัวหมาก (ม.รามคำแหง · เดอะมอลล์ รามคำแหง · ABAC หัวหมาก · MRT สายสีเหลือง รามคำแหง/หัวหมาก) กรุงเทพฯ", crumbCity "ย่านรามคำแหง-หัวหมาก"/EN "Ramkhamhaeng", crumbCityHref area-bangkok-ramkhamhaeng.html.
⚠️ attractions dedup: **srinakarin attractions r10 = ม.รามคำแหง (Ramkhamhaeng University)** + Rajamangala → avoid/differentiate. Anchor: The Mall Ramkhamhaeng/Lifestore, ABAC Hua Mak campus, หัวหมาก markets.

---

## BANGKAPI (บางกะปิ) — ✅ RESEARCHED 2026-07-02 (honest top-8; inventory medium-thick). All NEW.
Slug: top8-hotels-bangkapi-bangkok + top5-love-hotels-bangkapi-bangkok. Zone = บางกะปิ core (เดอะมอลล์บางกะปิ/แยกลำสาลี/คลองจั่น/ลาดพร้าว 117-144/เสรีไทย-NIDA/สัมมากร ราม 110). MRT Yellow Line (บางกะปิ/ลำสาลี).
MAIN TOP-8 (ranked): 1 Baron Residence Bangkok (4★, ~8.7/846, ลาดพร้าว130; hotels) · 2 Metro Point Bangkok Hotel (4★, ~8.1/1735; hotels) · 3 Baron Zotel Bangkok (4★, ~8.3/578, ลาดพร้าว117; hotels) · 4 130 Hotel & Residence Bangkok (4★, ~8.0/585; hotels) · 5 Kantary House Hotel & Serviced Apartments (4★, ~8.2/199, ราม 42 serviced; hotels) · 6 imm hotel Ladprao Bangkapi (3★, ~7.9/280; value) · 7 Aunchaleena Grand Hotel (3★, ~8.0/200; value) · 8 Mall Suites Hotel (3★, ~7.5/301, ติดเดอะมอลล์; value). +bench @81 Hotel (3★, value) · Grand Mandarin Latphrao130 (2★, value).
VALUE-5: Mall Suites, @81 Hotel, Grand Mandarin Latphrao130, imm hotel Ladprao Bangkapi, Aunchaleena Grand.
prov="ย่านบางกะปิ (เดอะมอลล์บางกะปิ · แยกลำสาลี · คลองจั่น · เสรีไทย-NIDA · MRT สายสีเหลือง บางกะปิ/ลำสาลี) กรุงเทพฯ", crumbCity "ย่านบางกะปิ"/EN "Bangkapi", crumbCityHref area-bangkok-bangkapi.html.
⛔ EXCLUDE (ramkhamhaeng/srinakarin): all ramkhamhaeng hotels + Onix/Livotel Hua Mak/Xtreme/The 9/Bay/B2 Srinakharin/Zircon/Alexander/We Hotel. attractions avoid ราชมังคลากีฬาสถาน + ม.รามคำแหง(หัวหมาก)/ABAC + CDC.
✅ attractions anchors: เดอะมอลล์ไลฟ์สโตร์บางกะปิ, MEGA HarborLand Aqua World, สวนพฤกษชาติคลองจั่น, สวนนวมินทร์ภิรมย์, แยกลำสาลี, โลตัสบางกะปิ, NIDA Museum, วัดเทพลีลา, ท่าเรือคลองแสนแสบ, ตลาดบางกะปิ, สัมมากร ราม110, แฮปปี้แลนด์. restaurants: เสรีทอง, ก๋วยเตี๋ยวตำลึงนายฮิม, เป็ด-หมวยสินธร, ม่านเมือง(Michelin Bib), NeNe/Lucky Suki, Yess by Chef Tum. cafes: Blanc, Brown Burgundy, De Whaeng Lumsalee, Khao Man Baan Nok, LOOP COFFEE, CAPULUS.BKK, Wela Roaster, คลัสเตอร์สัมมากร.

## CHAROEN-KRUNG (เจริญกรุง) — ✅ RESEARCHED 2026-07-02. ⚠️ hotels THIN → honest top-7 (mostly hostel/boutique); attractions/restaurants/cafes RICH (creative district = the star). All NEW.
Slug: top7-hotels-charoen-krung-bangkok + top5-love-hotels-charoen-krung-bangkok. Identity = **Charoen Krung Creative District (TCDC/Warehouse 30)**.
MAIN TOP-7 (ranked): 1 Oriental Heritage Residence (3★, ~8.9/1318 — the one strong-score anchor; hotels) · 2 Unplugged at Bangrak Design Hostel (3★, ~8.9/272, ซ.เจริญกรุง50 near Warehouse30/TCDC; value) · 3 Loftel 22 Hostel (2★, ~7.9/185; value) · 4 Glad Bangkok Hostel (3★; value) · 5 A Sleep Bangkok Charoenkrung (3★; value) · 6 Bangkok Hub Hostel OYO (2★; value) · 7 Charoenkrung Place (3★, ~6.1/23 low-score → tail or skip; value). ⚠️ do NOT force top-10 (would pull riverside towers).
VALUE-5: Unplugged Bangrak, Loftel 22, Glad Bangkok, A Sleep Charoenkrung, Bangkok Hub OYO.
prov="ย่านเจริญกรุง (Creative District · TCDC · Warehouse 30 · บางรัก) กรุงเทพฯ", crumbCity "ย่านเจริญกรุง"/EN "Charoen Krung", crumbCityHref area-bangkok-charoen-krung.html.
✅ attractions: TCDC(ไปรษณีย์กลาง), Warehouse 30, เจริญกรุง32 street art, O.P. Place, อัสสัมชัญ, So Heng Tai Mansion, ATT 19, พิพิธภัณฑ์ชาวบางกอก, มัสยิดฮารูณ, P.Tendercool. restaurants: ประจักษ์เป็ดย่าง(1909), Samlor(Bib), 80/20(1★), Baan Phadthai(Bib), เจริญแสงสีลม, โจ๊กปรินซ์(Bib), Home Cuisine Islamic, Sarnies. cafes: La Cabra, Blackwood, Tangible, Eight O'Clock, Carmina, MaLet's, Tanuki 261, Madi BKK. ⚠️ Muslim Restaurant = ปิดถาวร 2020 → ห้ามใช้ (ใช้ Home Cuisine Islamic).

## SAPHAN-TAKSIN (สะพานตากสิน) — ✅ RESEARCHED 2026-07-02 (honest top-8; ก้ำกึ่ง — best riverfront icons taken by riverside/silom). All NEW.
Slug: top8-hotels-saphan-taksin-bangkok + top5-love-hotels-saphan-taksin-bangkok. Identity = **BTS Saphan Taksin / ท่าเรือสาทร-Central Pier / Robinson Bangrak / Sathorn hotels**.
MAIN TOP-8 (ranked): 1 Centre Point Plus Hotel Silom (4★, ~8.7, บนโรบินสันบางรัก 120m to Sathorn Pier — flagship; hotels) · 2 Bangkok Marriott The Surawongse (5★, ~9.1; hotels) · 3 Furama Silom Bangkok (4★, ปลายสีลม 350m BTS; hotels) · 4 Sathorn Vista - Marriott Executive Apartments (4★ serviced; hotels) · 5 Chatrium Residence Sathon (4★ serviced, ≠ Chatrium Riverside; hotels) · 6 Jasaen Stylish Boutique (3★, ~8.8/2124; value) · 7 Prince Theatre Heritage Stay (3★, ~9.0, old-cinema boutique; value) · 8 Sathorn Terrace Apartment (3★, ~7.8/220; value). +bench P&R Residence, New Road Guest House (3★, value).
VALUE-5: Jasaen, Prince Theatre Heritage, P&R Residence, New Road Guest House, Sathorn Terrace.
prov="ย่านสะพานตากสิน (BTS สะพานตากสิน · ท่าเรือสาทร/Central Pier · โรบินสันบางรัก · สาทร) กรุงเทพฯ", crumbCity "ย่านสะพานตากสิน"/EN "Saphan Taksin", crumbCityHref area-bangkok-saphan-taksin.html.
✅ attractions: ท่าเรือสาทร/Central Pier, ตลาดบางรัก, Robinson บางรัก, Ma! Bang Rak Bazaar, Silom Soi 20 street food, โบสถ์กาลหว่าร์, จุดชมพระอาทิตย์ตกท่าสาทร. restaurants: Bang Rak market street food (ข้าวมันไก่/ข้าวหน้าเป็ด/ส้มตำตลาดบางรัก), เจริญเวียงโภชนา, ครัวอัปษร. cafes: Sarnies, A COFFEE ROASTER by li-bra-ry, Blue Whale, riverside/pier cafes.

## ⚠️ CHAROEN-KRUNG ↔ SAPHAN-TAKSIN SPLIT (same Bang Rak district — MUST assign each shared item to ONE page only)
They overlap heavily with each other AND riverside/silom. Build **charoen-krung FIRST** (creative-district identity), then saphan-taksin with charoen-krung's picks in the `avoid` arg. Shared-item assignment:
- **charoen-krung gets:** ประจักษ์เป็ดย่าง(Prachak), Home Cuisine Islamic, มัสยิดฮารูณ, O.P. Place, So Heng Tai, TCDC/Warehouse30/street-art (all creative-district).
- **saphan-taksin gets:** อัสสัมชัญ Cathedral, ท่าเรือสาทร/Central Pier, Robinson บางรัก, ตลาดบางรัก + its street food, โบสถ์กาลหว่าร์, Sarnies(cafe).
- Hotels do NOT overlap (charoen = hostels/Oriental Heritage; saphan = Sathorn hotels/Centre Point Plus) ✓.
- Both value-5 ⊆ their own main. Both honest ~7-8, do NOT pad.

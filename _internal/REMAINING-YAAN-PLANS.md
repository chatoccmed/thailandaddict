# Remaining Bangkok ย่าน — build plans (persisted from the 2026-07-02 autonomous run)

> Research already done + buffered here so it isn't lost (it was in ephemeral $TEMP). Follow the per-ย่าน recipe in memory `bangkok-roundup-megaproject` + `_internal/SCALE-OUT-PROGRESS.md`. All eat-ranking engines: `_internal/wf/{restaurants,cafes,attractions}-roundup.js`; pass `args` inline (prov/city/slug/display/hi/stayDefault/stayCta/rail/related). After each eat-ranking: extract res.article → fix crumbCity/crumbCityHref(area-bangkok-<slug>.html) + fix foodexp/localtips labels (prov parenthetical leaks in) → `finalize-resto.mjs <city> <slug>` + `verify-resto.mjs` (errors=0) → EN translate (direct agent, en-twin rules) → `resync-en-twin`+`validate-en-twin`. Attractions also need a Wikimedia-CC image agent (hero cityscape + no-social cards). Commit+push+R2 each step. Deploy = cache-clear + `cd astro && NODE_OPTIONS=--max-old-space-size=8192 npm run build` + `npx wrangler deploy` (discard prebuild churn: index.html/en/index.html/sitemap.xml/search-index.json/en/search-index.json). **⚠️ push permission rule for `git push origin main` is in `.claude/settings.local.json`.**

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

## BANGKAPI (บางกะปิ) — NOT researched yet
The Mall Bangkapi (major), Lam Sali, MRT Yellow Line, Ramkhamhaeng east. ⚠️ differentiate vs ramkhamhaeng (adjacent — decide split boundary). Do hotel research first.

## CHAROEN-KRUNG (เจริญกรุง) — NOT researched. ⚠️ heavy overlap with riverside + silom-sathorn (both LIVE) — must differentiate restaurants/cafes/attractions (Charoen Krung Creative District / TCDC / Talat Noi / Warehouse 30 / OP Place — riverside used ICONSIAM/Asiatique/Wat Arun; silom used Bang Rak). Do research first.

## SAPHAN-TAKSIN (สะพานตากสิน) — NOT researched. ⚠️ heavy overlap with riverside + silom-sathorn — differentiate (Sathorn pier / BTS Saphan Taksin / Robinson Bangrak / Shangri-La area). Do research first.

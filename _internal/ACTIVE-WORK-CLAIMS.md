# 🚦 ACTIVE WORK CLAIMS — กันงานซ้ำระหว่าง session/เพื่อนร่วมงาน

> เปิดไฟล์นี้ก่อนเริ่มงานใหญ่ทุกครั้ง · ถ้างานที่จะทำมีคน claim อยู่ (ยัง ACTIVE) → ไปทำอย่างอื่น
> claim = แก้ไฟล์นี้ + commit + push ทันที (ก่อนเริ่มจริง) เพื่อให้ rebase ของคนอื่นเห็น
> เสร็จแล้วเปลี่ยนสถานะเป็น ✅ DONE หรือลบรายการออก

---

## ⏸️ PAUSED (เตรียม deploy)
- **2026-06-20:** พักงานชั่วคราว — เตรียมย้ายขึ้นเว็บจริง (deploy) · ทุกอย่าง commit+push แล้ว (HEAD = `d4f91625`, sync กับ origin/main) · ไม่มีงาน claim ค้าง
- งานถัดไป (ยังไม่เริ่ม): i18n Tier-1 อีก 7 ภาษา (zh·ru·ko·ja·he·ar·hi) ยัง 0 หน้า — ดู `_internal/I18N-AND-TOURISM-CITY-PLAN.md`

## 🟢 ACTIVE
- **[2026-08-27 · Claude session · thailandaddict repo] ✅ DONE — quality-audit fixes: 5 duplicate hotel slugs + Asia's 50 Best Bars 2026 refresh.** From a fresh audit (freshness/dark-patterns/json-ld scan): (1) canonicalized the last 5 of 8 hotel-review pairs published under 2 slugs each (commit `5c83fd57a4`) — 3 pairs were already fixed by a prior session, none left. (2) 10 Bangkok bar profile pages + the `bars-50-best-bangkok` roundup (TH+EN) still cited 2024/2025 Asia's 50 Best Bars data — verified real 2026 results via WebSearch and corrected ranks/awards/roundup top-10 (commit `84e3bffad4`). Both deployed + pushed, live-spot-checked. See [[site-quality-audit-2026-07]] memory for full detail. **Still open, owner-authorized but not started: the "ลงตัว" cliché rewrite (1,436 instances / ~936 review files) — large taste-call content pass, not mechanical.** No claim held.
- **[2026-08-25 · Claude session · thailandaddict repo] ✅ DONE — ย่าน "Plan tab" itinerary content, all 33/33 areas.** Different from the older "ย่าน megaproject" below (which was hotels/5-dims and is already fully DONE) — this is the `area-bangkok-*.html` **Plan tab**, which every ย่าน had hardcoded as "กำลังจัดทำ" (coming soon) even after the 5-dims work finished. Added a real `<area>-half-day-plan.json` itinerary (TH+EN) per area, built entirely from venues already in each area's own `top10-attractions/cafes/restaurants` files (no new research, no fabrication — verified via spot-check against source files). Also fixed a real bug in `hoodHub()` (`_internal/gen-hubs.mjs`): the See/Eat/Plan tabs never called `artCards()`, so even the pre-existing food articles were orphaned from their own hub page. Fix is generic (`artCards(hood,[...])`), so it covers all 33 areas including ones not touched by this batch. Work spanned 2 machines ~2 weeks apart (commits `f1ed57487`+`4b49a5f12` did the first 20 + i18n; this session found the remaining 13 already-written-but-uncommitted in the working tree, re-verified, and shipped them — commit `2dbb049e5`). **Follow-up (same day, commit `d6c69fae9`):** the 13-area batch's new Plan-tab card titles weren't in the 7-language hub layer yet (zh/ru/ko/ja/hi/he/ar — a snapshot-of-EN translation, not live-synced) — translated the 13 new strings/language (99.6% of each page was already covered) and re-ran `localize.mjs` for all 33 areas × 7 langs. No claim held, nothing queued.
- **[2026-07-18 · Imac · autonomous run · รอบ 2] ✅ DONE — ปิดของที่ audit ค้าง: รูปแผนที่ปลอม 717→0 (deploy `3c816c7f`) · ลิงก์ OTA ไม่มี affiliate id 82→0 + CJ ad เก่าฝังในหน้าแรก 9→0 (deploy `b18491f7`) · audit อ่านตรงได้แล้วทุกบรรทัด (0 dead / 0 affiliate bad / 0 img missing). งานที่เหลือ = owner-gated ล้วน (byline, GA4 id, "ลงตัว", cornerstone, รูปแผนที่จริง) — ดู SESSION-END-2026-07-18.md. ไม่ถือ claim
- **[2026-07-18 · Imac · autonomous run] ✅ DONE — dead-link audit **84,907 → 0**, deployed a7a6bbf5. Closed every layer (audit worker-routes, hub localize, content link() 3-way + ROOT_ONLY, prose rewrite, structured card/CTA hrefs, 4 stale content refs). See CLAUDE.md + SESSION-END-2026-07-18.md. No claim held.

- **[2026-06-27 · Bangkok ย่าน megaproject — มี 2 loop วิ่งพร้อมกัน]**
    - **loop A (central core) ✅ COMPLETE = 14 ย่าน LIVE (2026-06-27):** sukhumvit · silom-sathorn · thong-lo · ari · khao-san · chinatown · samyan · siam-pratunam · chidlom · ratchathewi · rama9 · sai-tai · talat-phlu · **pinklao** (#14 last, Version pending) — all 5 dims × TH+EN. **STOPPED** — no clean ย่าน left for loop A (remaining = loop-B's east/north/SE or charoen-krung/saphan-taksin riverside+silom-overlaps; ratchada→rama9, ploenchit→chidlom, victory-monument→ratchathewi were folded). loop B owns north/east/SE (mochit/bangna/srinakarin/ladprao/bang-sue/bang-khen/kaset/chaeng-watthana) + Sukhumvit-east/riverside/phrom/on-nut.
    - **loop B (this session · Imac):** ✅ samyan + phrom-phong + riverside + on-nut + mochit-chatuchak + bangna + srinakarin (Version 5f237b4b) DONE+LIVE = **7 ย่าน (prior session)** · ถัดไป bang-sue/bang-khen/kaset/chaeng-watthana (loop B owns north/east/SE; loop A COMPLETE)
    - **[2026-07-01 · Imac · THIS session] ✅ DONE+LIVE = ladprao (ลาดพร้าว)** — all 5 dims × TH+EN deployed (Version a573ca1e), verified 200. central-ladprao FOLDED IN (skipped). Cross-dim dedup Slōlē→LIEBE. Also shipped the 23 top10-attractions EN twins (gap 0/96). See SCALE-OUT-PROGRESS.md #27.
    - **[2026-07-01 · Imac · THIS session] ✅ DONE+LIVE = bang-sue (บางซื่อ)** — all 5 dims × TH+EN deployed (Version 2b0b39b8), verified 200. Honest **top-6** hotels (thin transit district, owner-approved not-padded). 3 cross-ย่าน dedups vs mochit (Sanan→Pae Joke, Wachirabenchathat→Wat Matchantikaram) + dropped 2 problematic hotels (Dusita/Orange). See SCALE-OUT-PROGRESS.md #28.
    - **[2026-07-02 · autonomous run] ✅ DONE+LIVE = bang-khen (Version abbd6a08)** — honest top-5. See SCALE-OUT #29.
    - **[2026-07-02 · autonomous run · PAUSED by owner] 🟡 kaset (เกษตร-นวมินทร์) = MID-BUILD** — dims 1-3 (hotels top-7 + value-5 + restaurants) DONE+committed (HEAD f56ff2e5b), NOT deployed. **RESUME at dim 4 (cafes) — cafes engine stopped, resumeFromRunId wf_6a86c329-0a8.** Full resume + dedup notes + chaeng-watthana/ramkhamhaeng research plans in **`_internal/REMAINING-YAAN-PLANS.md`**.
    - **QUEUE (not started):** chaeng-watthana (research done, plan saved) · ramkhamhaeng (research done, plan saved — real top-10) · bangkapi · charoen-krung (⚠️vs riverside/silom) · saphan-taksin (⚠️vs riverside/silom). Owner "ทำให้ครบทุกย่าน" → honest smaller builds; resume anytime.
    - กติกา: เลี่ยงชนด้วย "ภูมิศาสตร์ย่าน" — อย่าทำย่านที่อีก loop ประกาศไว้ที่นี่ + commit/push บ่อย ๆ (race lesson)
- **[2026-06-24 · เครื่อง Imac]** ชุด **top10-attractions-<X>** (eat-ranking ที่เที่ยว/จังหวัด — คนละหมวดกับ ย่าน megaproject) · แผน: ครบ 77 จังหวัด
    - ✅ DONE+live: **ayutthaya** (`/top10-attractions-ayutthaya`)
    - 🟡 กำลังทำ: **chiang-mai** (engine รันอยู่)
  - หมายเหตุ: อีกเครื่องทำ restaurants (ล่าสุด bueng-kan) + แก้รูป sukhumvit attractions — แยกหมวดชัด ไม่ชน · มาตรฐานรูป: ทุกการ์ดรูปจริง (IG/FB embed หรือ CC Wikimedia) + hero CC จริง

---

## ✅ DONE — เว็บภาษาอังกฤษ (EN) ครบทั้งเว็บ (2026-06-20)
**สรุป: TH 5,472 หน้า · EN 5,471 หน้า (ต่างกัน 1 = `font-compare.html` หน้า dev เท่านั้น) · ภาษาอื่น 0 · ทุกหน้า EN ZERO Thai · build OK 10,736 pages**

- **EN content แปลครบ:** articles-en 3,214/3,214 · reviews-en 1,939/1,939 · roundups-en 215/215 — verify ZERO Thai + JSON valid + structure/array parity + /en/ links ถูกต้อง
  - workflows: `_internal/wf/translate-reviews-en.js` · `translate-roundups-en.js` · `translate-en.js` · cleanup `fix-en-thai.js` (กันไทยตกค้าง address/type/qiType/parentShort/label) · verifier `en-check-reviews.mjs`
- **EN hub pages ครบ (`/en/`):** homepage + 89 city hubs + 6 region + country-thailand + destinations + about/contact/editorial-policy/privacy/404
  - **engine = `_internal/gen-hubs.mjs` (locale-aware)** — generator ตัวเดียวออกทั้ง TH (`/`) และ EN (`/en/`) → โครงสร้าง/CSS/รูป เหมือนกัน by construction (TH output byte-identical ยกเว้นเพิ่ม hreflang + lang toggle ราย-หน้า) · รัน: `node _internal/gen-hubs.mjs` (ทั้ง 2 ภาษา) หรือ `node _internal/gen-hubs.mjs th|en`
  - curated data EN: `_internal/province-data-en/*.json` (89 ไฟล์ · workflow `translate-province-data-en.js`) — ใช้คู่กับ `province-data/` (TH)
  - static pages EN: workflow `translate-static-en.js`
  - hreflang th/en/x-default + canonical /en/ + ปุ่มสลับ TH⇄EN ครบทุกหน้า
- **⚠️ เวลา re-run gen-hubs ต้องมี `province-data-en/` ครบ 89** ไม่งั้น neighbor cards จะโชว์ไทย (fallback) · ถ้าเพิ่มจังหวัด/เมืองใหม่ → เพิ่ม EN name ใน `EN_NAME` map ใน gen-hubs.mjs ด้วย
- EN translation: **articles-en เดิม 3,213/3,213** (pushed bc88d028)

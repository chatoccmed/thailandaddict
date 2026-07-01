# 🚦 ACTIVE WORK CLAIMS — กันงานซ้ำระหว่าง session/เพื่อนร่วมงาน

> เปิดไฟล์นี้ก่อนเริ่มงานใหญ่ทุกครั้ง · ถ้างานที่จะทำมีคน claim อยู่ (ยัง ACTIVE) → ไปทำอย่างอื่น
> claim = แก้ไฟล์นี้ + commit + push ทันที (ก่อนเริ่มจริง) เพื่อให้ rebase ของคนอื่นเห็น
> เสร็จแล้วเปลี่ยนสถานะเป็น ✅ DONE หรือลบรายการออก

---

## ⏸️ PAUSED (เตรียม deploy)
- **2026-06-20:** พักงานชั่วคราว — เตรียมย้ายขึ้นเว็บจริง (deploy) · ทุกอย่าง commit+push แล้ว (HEAD = `d4f91625`, sync กับ origin/main) · ไม่มีงาน claim ค้าง
- งานถัดไป (ยังไม่เริ่ม): i18n Tier-1 อีก 7 ภาษา (zh·ru·ko·ja·he·ar·hi) ยัง 0 หน้า — ดู `_internal/I18N-AND-TOURISM-CITY-PLAN.md`

## 🟢 ACTIVE
- **[2026-06-27 · Bangkok ย่าน megaproject — มี 2 loop วิ่งพร้อมกัน]**
    - **loop A (central core) ✅ COMPLETE = 14 ย่าน LIVE (2026-06-27):** sukhumvit · silom-sathorn · thong-lo · ari · khao-san · chinatown · samyan · siam-pratunam · chidlom · ratchathewi · rama9 · sai-tai · talat-phlu · **pinklao** (#14 last, Version pending) — all 5 dims × TH+EN. **STOPPED** — no clean ย่าน left for loop A (remaining = loop-B's east/north/SE or charoen-krung/saphan-taksin riverside+silom-overlaps; ratchada→rama9, ploenchit→chidlom, victory-monument→ratchathewi were folded). loop B owns north/east/SE (mochit/bangna/srinakarin/ladprao/bang-sue/bang-khen/kaset/chaeng-watthana) + Sukhumvit-east/riverside/phrom/on-nut.
    - **loop B (this session · Imac):** ✅ samyan + phrom-phong + riverside + on-nut + mochit-chatuchak + bangna + srinakarin (Version 5f237b4b) DONE+LIVE = **7 ย่าน (prior session)** · ถัดไป bang-sue/bang-khen/kaset/chaeng-watthana (loop B owns north/east/SE; loop A COMPLETE)
    - **[2026-07-01 · Imac · THIS session] 🟢 CLAIM = ladprao (ลาดพร้าว)** — building all 5 dims now (Lat Phrao Rd corridor · โชคชัย 4 / MRT Lat Phrao–Phahon Yothin). ⚠️ Centara Grand Central Plaza Ladprao already used as mochit reuse — do NOT reuse; differentiate. **🔀 FOLD DECISION: central-ladprao (ห้าแยกลาดพร้าว) is FOLDED INTO ladprao — skip it** (its core node = Central Plaza Ladprao/Union Mall/Ha Yaek interchange overlaps ~100% with the already-built mochit-chatuchak ย่าน; both where-to-stay articles cite the same anchors). Same precedent as ratchada→rama9 / victory-monument→ratchathewi / ploenchit→chidlom. → after ladprao: bang-sue · bang-khen · kaset · chaeng-watthana · ramkhamhaeng · bangkapi · charoen-krung · saphan-taksin.
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

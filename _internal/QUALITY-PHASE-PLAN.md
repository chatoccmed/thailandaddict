# 🎯 QUALITY PHASE — handoff plan (fresh session, do tasks 1→4 in order, to completion)

> เว็บ deploy แล้ว (WordPress→Astro บน Cloudflare). เฟสนี้ = **ยกคุณภาพ** ไม่ใช่เพิ่มจำนวนหน้า
> ทำ **งาน 1 → 2 → 3 → 4 ตามลำดับ จนเสร็จแต่ละงาน** · ใช้ Opus · ห้ามถาม · หลังจบแต่ละงาน (หรือแต่ละ batch): `bash _internal/build-test.sh` ต้อง **BUILD OK** → `git fetch && git rebase origin/main` → push
> อ่านก่อนเริ่ม: `CLAUDE.md`, memory `monetization-phase-done.md`, ไฟล์นี้ทั้งไฟล์, `_internal/gen-stay-compare.mjs`, `_internal/gen-where-to-stay-auto.mjs`

---

## 🔧 Environment + protocol (LOCKED — ห้ามพลาด)
- เครื่อง `C:\Users\Imac\Thailandaddict` · **Node v24 ที่ `~/nodejs`** → bash ต้อง `export PATH="$HOME/nodejs:$PATH"` ก่อนรัน node ทุกครั้ง · **Python ใช้ไม่ได้** (ใช้ Node/PowerShell)
- git: branch `main` · **มี parallel session/เพื่อนร่วมงานทำงานในรีโปเดียวกัน** → `git fetch && git rebase origin/main` ก่อน push เสมอ · commit เป็นกลุ่มงาน · tree อาจมีไฟล์ใหม่จาก parallel (เช่น `gen-feeds.mjs`, trip-planner) — **อย่าไปแก้/revert ของคนอื่น**
- pre-push: `bash _internal/build-test.sh` → ต้องเห็น `BUILD OK` (build ใน temp `~/ta-build-temp`, heap 8GB, ข้าม public/ → ไม่มีรูปใน dist เป็นเรื่องปกติ)
- **กฎเนื้อหา (LOCKED):** โทน v2-clean เพื่อนเล่าให้เพื่อน · honest/EEAT ห้ามอวย · ห้ามคำ AI (TH: ตอบโจทย์/โดดเด่น/ครบครัน · EN: nestled/boasts/hidden gem/breathtaking เกร่อ)
- **EN ต้อง mirror TH เป๊ะ:** โครงสร้าง/คีย์/ลำดับ block เหมือนกัน · **ZERO Thai ใน EN** (ตรวจ `/[ก-฾เ-๛]/` · ยกเว้น ฿) — ก่อน push สแกนเสมอ
- **⛔ ห้ามแต่งข้อมูล/ราคา/สถานที่/ย่าน/URL** · ถ้าไม่ชัวร์ว่าย่าน/ที่เที่ยวมีจริง → **WebSearch ยืนยันก่อน** · ราคาให้ดึงจากข้อมูลจริงในรีโป (roundup) ไม่แต่งเลขเอง · affiliate ID ที่ยังไม่มี = ใช้ placeholder เดิม (`__GYG_PARTNER_ID__` ฯลฯ) ห้าม hardcode ปลอม
- design Direction-C เดิม (teal/coral/mango · Outfit/Sarabun) · 1 h1/หน้า · canonical/hreflang/schema มีใน layout แล้ว
- วันที่ปัจจุบัน = **2026-06-21** (ใช้กับ publishedDate/modifiedDate ที่อัปเดต)

## 🏗️ Architecture quick-ref (ปัจจุบัน)
- Astro static · content collections `articles/reviews/roundups` (+`-en`) = ไฟล์ JSON ต่อ entry · layout `ArticleLayout/ReviewLayout/RoundupLayout.astro` render ทั้ง TH (`/slug`) + EN (`/en/slug`)
- **บทความ = `ArticleLayout`** render จาก `blocks[]` (kinds: p/h2/list/table/tip/image/restaurant/staycta/foodexp/experiences/localtips/ranked/cards/day/cta) · localize chrome ผ่าน object `S` (มี `isEn` branch) — เพิ่ม key ใหม่ใส่ทั้ง 2 branch
- hub: `_internal/gen-hubs.mjs` (locale-aware · สร้าง city/region/country/destinations/plan/search) · รันเองแล้ว commit `astro/public/*.html`
- prebuild (`astro/prebuild.mjs`) รัน gen-home + gen-sitemap + gen-search-index + gen-feeds อัตโนมัติทุก build (Cloudflare)
- **where-to-stay generators (สำคัญกับงาน 1):**
  - `_internal/gen-stay-compare.mjs` = **21 เมืองเขียนมือ** (array `HOODS`) + **19 บทความเทียบเมือง** (array `COMPARE`) + helper `expCity`/`expCompare` (Klook block) · builder `neighborhoodArticle`/`comparisonArticle`
  - `_internal/gen-where-to-stay-auto.mjs` = **69 เมือง data-driven** (สร้างจาก roundup จริง) · มี set `HANDWRITTEN` = 20 city-slug ที่ข้าม (เพราะเขียนมือแล้ว)
  - รูปแบบ run: `node _internal/gen-stay-compare.mjs` → `node _internal/gen-where-to-stay-auto.mjs` → `node _internal/gen-hubs.mjs` → `node _internal/gen-search-index.mjs`
- ⚠️ R2: รูป content เสิร์ฟจาก R2 (`PUBLIC_IMG_BASE` / default `pub-…r2.dev`) · `astro/public/.assetsignore` ตัด `images/{hotels,cm,food,gallery}` ออก static — **อย่าไปยุ่ง** (เพื่อนร่วมงานคุม deploy/R2)
- ⚠️ Cloudflare ลิมิต **20,000 ไฟล์/deploy** → อย่าเพิ่มไฟล์ static จำนวนมากใน public/ (เนื้อหาใหม่เป็น content collection = หน้า ไม่ใช่ static file นับแยก ok)

---

## ✅ งาน 1 — อัปเกรด where-to-stay 69 เมือง data-driven → เขียนมือ (ย่านจริง)
**เป้า:** ยก where-to-stay ที่เป็น data-driven (ตารางโรงแรมล้วน) ให้เป็นแบบเขียนมือมีย่านจริง เหมือน 21 เมืองหลัก (ดูตัวอย่าง entry `sukhothai`, `nan`, `koh-chang`, `rayong` ใน `gen-stay-compare.mjs` `HOODS`)
**ทำไม:** หน้า data-driven ตื้น (แค่ลิสต์โรงแรม) · เขียนมือ = แนะนำ "ย่านไหนเหมาะใคร" จริง = คุณภาพ + AEO + conversion สูงกว่า

### กลไกอัปเกรด 1 เมือง
1. **WebSearch ยืนยันย่านพักจริง** ของเมืองนั้น (หาด/อำเภอ/ย่านที่นักท่องเที่ยวพักจริง) — ห้ามเดา/แต่ง
2. เพิ่ม entry ใน `HOODS` (`gen-stay-compare.mjs`) ก๊อปรูปทรงจาก entry เดิม: `{ city, th, en, hero, [cluster/hub/roundup/hubTh/hubEn ถ้าเป็น sub-area], quick:{th,en}, areas:[4-5×{a:{th,en},v:{th,en},n:{th,en}}], styles:{th:[],en:[]}, faq:[3×{q:{th,en},a:{th,en}}] }` · `hero` = `<slug>` (รูป heroes/<slug>.jpg ถ้ามี ไม่มี onerror ซ่อนเอง) · roundup default = `top10-hotels-<city>.html` (เช็กว่ามีจริงด้วย `ls astro/src/content/roundups/top10-hotels-<city>.json`)
3. เพิ่ม `<city>` ใน set `HANDWRITTEN` ของ `gen-where-to-stay-auto.mjs` (ให้ auto ข้าม ไม่ทับ)
4. (ถ้าเมืองนั้นอยู่ในบทความเทียบเมือง) เพิ่มใน set `NB` ของ `gen-stay-compare.mjs` ด้วย
5. รัน: `node _internal/gen-stay-compare.mjs` (ดู `enThaiLeaks:[] misaligned:[]`) → `node _internal/gen-where-to-stay-auto.mjs` → `node _internal/gen-hubs.mjs`
6. ทำเป็น **batch ~8-12 เมือง** แล้ว: `bash _internal/build-test.sh` → `node _internal/gen-search-index.mjs` → `git add -A` → commit → rebase → push

### ลำดับเมือง (ทำ Tier A ก่อน → B → C)
- **Tier A (ทำก่อน · ท่องเที่ยวสูง ย่านชัด):** `phang-nga`(เขาหลัก/เขาสก), `surat-thani`(เมือง/เขาสก/ท่าเรือ), `trang`(เมือง/หาดปากเมง/เกาะ), `nakhon-ratchasima`(โคราช), `udon-thani`, `khon-kaen`, `ubon-ratchathani`, `nong-khai`(ริมโขง), `lampang`(เมืองเก่า/ริมวัง), `mae-hong-son`(ปางอุ๋ง/หนองจองคำ), `loei`(เชียงคาน/ภูเรือ), `phetchaburi`(ชะอำ/แก่งกระจาน), `prachuap-khiri-khan`(ปราณบุรี/อ่าวมะนาว/บางสะพาน), `lopburi`(เมืองเก่า/ลิง), `buriram`(เมือง/สนาม/พนมรุ้ง)
- **Tier B:** `phitsanulok`, `nakhon-si-thammarat`, `satun`, `chumphon`, `chanthaburi`, `trat`, `chonburi`(บางแสน/ศรีราชา), `nakhon-pathom`, `ratchaburi`(ดำเนิน/สวนผึ้ง), `phrae`, `phayao`(กว๊าน), `sakon-nakhon`, `nakhon-phanom`(ริมโขง), `mukdahan`, `surin`, `sisaket`, `koh-larn`(หาดตาแหวน/แสม), `koh-mak`(อ่าวเก่า/อ่าวสวนใหญ่)
- **Tier C (ที่เหลือ ~36):** จังหวัดที่นักท่องเที่ยวพักแต่ "ในเมือง" อย่างเดียว ไม่มีย่านท่องเที่ยวชัด → **คงไว้เป็น data-driven** (ไม่ต้องเพิ่มใน HOODS) เว้นแต่ WebSearch แล้วเจอย่านจริง ≥3 ย่าน ค่อยอัปเกรด · **ห้ามแต่งย่านเพื่อให้ครบ**
**เกณฑ์ผ่านงาน 1:** ทุกเมือง Tier A+B มี HOODS entry เขียนมือ (หรือบันทึกเหตุผลว่าคงไว้ data-driven) · `gen-stay-compare` รายงาน `enThaiLeaks:[] misaligned:[]` · build OK · เปิด city hub เห็น callout "พักย่านไหน?" (มี `where-to-stay-<city>.html` 2 จุด)

---

## ✅ งาน 2 — ตรวจ/แก้ JSON-LD ทั้งเว็บ (ผ่าน Rich Results ไม่มี error)
**เป้า:** schema (Article/FAQPage/BreadcrumbList/ItemList/Restaurant/Hotel/AggregateRating/WebSite) ทุกหน้าถูกต้องตามเกณฑ์ Google → rich snippet + AEO
**ที่มา schema:** `ArticleLayout.astro` (jsonld graph), `ReviewLayout.astro`, `RoundupLayout.astro` (+ field `jsonLd` ใน roundup), `gen-hubs.mjs` (BreadcrumbList/ItemList/WebSite)

### ขั้นตอน
1. เขียน `_internal/audit-jsonld.mjs` ที่: build ก่อน (หรืออ่าน `~/ta-build-temp/dist` หลัง build-test) → ดึงทุก `<script type="application/ld+json">` จากตัวอย่างหน้าทุกชนิด (article แต่ละ type, review, roundup, city hub, region, country, plan, search, home) → `JSON.parse` (จับ parse error) → ตรวจ **required/recommended fields ต่อ type** ตามเกณฑ์ Google:
   - `Article`: headline, image (แนะนำ), datePublished/dateModified, author, publisher(+logo)
   - `BreadcrumbList`: itemListElement ครบ position/name/item, item เป็น absolute URL
   - `FAQPage`: mainEntity[].name + acceptedAnswer.text (ไม่ว่าง)
   - `Restaurant`/`Hotel`: name, address, image absolute · ถ้ามี `aggregateRating` ต้องมี ratingValue + reviewCount/ratingCount (ห้ามมี rating ปลอม/ลอย)
   - `ItemList`: itemListElement position ต่อเนื่อง
   - ทุก `image`/`item`/`url` = absolute (`https://thailandaddict.com/...` หรือ R2) ไม่ใช่ relative
2. รัน audit → ลิสต์ error → **แก้ที่ layout/generator** (ต้นทาง ไม่ใช่แก้ทีละไฟล์) → rebuild → audit ซ้ำจน **0 error**
3. ยืนยันเพิ่ม: เปิด Google Rich Results Test (https://search.google.com/test/rich-results) กับ 3-4 URL จริง (article/review/roundup/hub) — ถ้าทำผ่าน WebFetch ไม่ได้ ให้บันทึกว่าต้องให้เจ้าของเทสต์ + แนบ URL
**เกณฑ์ผ่านงาน 2:** `audit-jsonld.mjs` รายงาน 0 error ทุก type · ไม่มี relative URL ใน schema · ไม่มี aggregateRating ที่ไม่มี count · build OK · commit (เก็บ `audit-jsonld.mjs` ไว้ในรีโปด้วย)

---

## ✅ งาน 3 — Freshness pass (ของเก่า/ลิงก์เสีย/รูปเสีย + "อัปเดตล่าสุด")
**เป้า:** หาและแก้เนื้อหาที่อาจเก่า/พัง แล้วทำ "ความสด" ให้ชัด (ดี SEO + ความน่าเชื่อถือ)
**หมายเหตุ memory:** รูป "หาย" ส่วนใหญ่ = อ้าง reference ผิด ไม่ใช่ไฟล์หาย → remap/sync (สคริปต์ใน `_internal/` เช่น `canonicalize-img-refs.mjs`, `fix-*`) ไม่ใช่ไป fetch ใหม่

### ขั้นตอน
1. เขียน `_internal/audit-freshness.mjs` สแกน content collection ทั้งหมด รายงาน:
   - **ลิงก์ภายในเสีย:** ทุก href ใน blocks/related/staycta/cta/cards ที่ชี้ `*.html` ภายใน → เช็กว่ามี slug นั้นจริง (article/review/roundup) หรือเป็น hub ใน `astro/public/*.html` · ลิสต์ลิงก์ที่ไม่เจอเป้า
   - **รูปเสีย:** ทุก image/heroImg/img path → เช็กว่ามีใน `astro/public/images/**` (หรือเป็น path ที่ R2 มี) · ลิสต์ที่ไม่เจอ
   - **ปีเก่า:** หา hardcoded ปีเก่าใน title/h1/metaDesc (เช่น "2024", "2025" ที่ควรเป็น 2026) → ลิสต์
   - **modifiedDate หาย/เก่า:** article/review ที่ไม่มี modifiedDate หรือเก่ามาก → ลิสต์
2. แก้ตามลิสต์: ลิงก์เสีย→ชี้เป้าที่ถูก/ตัดออก · รูปเสีย→ใช้สคริปต์ remap เดิม · ปีเก่า→อัปเดตปี (เฉพาะที่เป็น "ปีปัจจุบัน" ไม่ใช่ปีอ้างอิงเหตุการณ์) · ตั้ง `modifiedDate: "2026-06-21"` ให้หน้าที่แก้
3. **เพิ่ม "อัปเดตล่าสุด/Last updated" ให้เห็นทุกบทความ:** ตอนนี้ `ArticleLayout` โชว์ modifiedDate เฉพาะ resto (`rfresh`) → เพิ่ม element เล็ก ๆ ใต้ hero/intro โชว์ `{S.updatedL} {fmtDate(data.modifiedDate)}` เมื่อมี modifiedDate (localize ผ่าน `S` + ใช้ `fmtDate` ที่มีแล้ว) — TH "อัปเดตล่าสุด" / EN "Updated"
4. **ห้ามแต่งราคาใหม่** — ถ้าเจอราคาที่น่าจะเก่า ให้คงสไตล์ "เริ่ม ฿X (เช็กราคาปัจจุบัน)" หรือ WebSearch ยืนยัน ไม่ใส่เลขมั่ว
**เกณฑ์ผ่านงาน 3:** `audit-freshness.mjs` = 0 ลิงก์เสีย, 0 รูปเสีย (หรือบันทึกที่แก้ไม่ได้พร้อมเหตุผล) · บทความมี "อัปเดตล่าสุด" แสดงผล · EN ยัง zero-Thai · build OK · commit (+ เก็บ audit script)

---

## ✅ งาน 4 — เพิ่มเนื้อหาเชิงลึกที่ยังขาด
**เป้า:** เติมหน้าที่คนค้นหา + interlink ให้แน่น (AEO + เวลาในเว็บ)
1. **Sub-area where-to-stay** (เหมือน `ao-nang` ที่อยู่ใต้ `krabi`): ย่าน/หาดดังที่คนหา "พักที่ไหนใน X" — เช่น `patong`(ใต้ phuket), `chaweng`(samui), `ao-nang` มีแล้ว, `railay`, `khao-lak`(phang-nga), `chiang-khan`(loei), `cha-am`(phetchaburi), `pranburi`(prachuap) · ใช้ override `cluster/hub/roundup/hubTh/hubEn` + ถ้ามี area-roundup จริง (เช่น `top9-white-sand-beach-hotels-koh-chang`, `top15-ao-nang-hotels-krabi`) ลิงก์อันนั้น · ทำเฉพาะที่มี roundup/hub รองรับจริง
2. **"best X for Y" (listicle AEO):** เช่น "เกาะไหนเหมาะดำน้ำ", "หาดไหนเหมาะครอบครัวภูเก็ต", "เที่ยวไทยหน้าฝนไปไหนดี", "เกาะเงียบ ๆ ฮันนีมูน" — ใช้ block `ranked`/`cards`/`table` + ลิงก์ไป city hub/where-to-stay จริง · ข้อมูลจาก content ที่มี ห้ามแต่ง
3. **เพิ่ม FAQ** ให้หน้าสำคัญที่ FAQ น้อย/ไม่มี (city hub-linked articles, guides) — คำถามจริงที่คนถาม + คำตอบกระชับ (FAQPage schema ทำงานอัตโนมัติ)
4. **Interlink แน่นขึ้น:** related[] ของหน้าที่ยังโดด, ลิงก์ contextual ในเนื้อหาไปหน้าที่เกี่ยวข้อง (where-to-stay ↔ city hub ↔ comparison ↔ guides ↔ transport)
- ทำเป็น generator ใหม่ (`gen-best-of.mjs` ฯลฯ) หรือต่อยอด generator เดิม · idempotent · TH+EN mirror · เพิ่ม slug ใหม่ใน gen-hubs/destinations ที่เหมาะ
**เกณฑ์ผ่านงาน 4:** หน้าใหม่ทั้งหมด TH↔EN aligned + EN zero-Thai + ลิงก์จริง · surface ได้ (hub/related/search) · build OK · commit

---

## ✅ Done criteria (ทั้งเฟส)
ทุกงาน: `bash _internal/build-test.sh` = **BUILD OK** · EN zero-Thai (สแกน `/[ก-฾เ-๛]/`) · 0 ลิงก์/รูปเสียที่เพิ่มใหม่ · ไม่แต่งข้อมูล · rebase origin/main → push · อัปเดต memory `monetization-phase-done.md` (หรือสร้าง memory ใหม่) สรุปสิ่งที่ทำ
**ตรวจ EN leak เร็ว ๆ:** `node -e "const fs=require('fs');let n=0;for(const f of fs.readdirSync('astro/src/content/articles-en')){const d=JSON.parse(fs.readFileSync('astro/src/content/articles-en/'+f));if(/[ก-฾เ-๛]/.test(JSON.stringify(d)))n++}console.log('EN thai leaks:',n)"`

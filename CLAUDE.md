# CLAUDE.md — thailandaddict.com

แบรนด์ **เที่ยวไทยเฉพาะทาง** (9 ภาษา ชั้น hub · 9 ภาษาบางส่วนชั้นเนื้อหา) บน Astro static → Cloudflare
Scaffold ยกสถาปัตยกรรมมาจาก wherebest (repo `tourlogy`) แล้ว rebrand

> อ่าน `thailandaddict-handoff.md` สำหรับบริบทและการตัดสินใจยุคแรกเริ่ม (เอกสารนี้เขียนตอน scaffold ยังว่างเปล่า — ดูสถานะปัจจุบันด้านล่างแทน)

---

## ⚠️ ทำงานหลายเครื่องพร้อมกัน — อ่านก่อนเริ่ม

repo นี้มีหลายเครื่อง/หลาย session push เข้า `origin/main` **ตลอดเวลา** เคยปล่อยให้แยกสายกัน 3 สัปดาห์ (2026-06-28 → 07-17) จนกลายเป็น 243 vs 37 commits, 643 conflicts และ**งานซ้ำที่ต้องทิ้ง 4 ก้อน** (แปล EN ชุดเดียวกัน 43 ไฟล์, ลบคำ AI ชุดเดียวกัน, i18n ชั้น hub คนละสถาปัตยกรรม, บั๊กอักษรไทยปนใน he/ar/hi ที่ต่างคนต่างเขียนสคริปต์แก้)
- **`git fetch origin && git merge origin/main` ทุกครั้งก่อนเริ่มงาน และ push ให้ไวที่สุดหลังงานเสร็จ**
- ก่อนจอง/เริ่มงานใหญ่ ดู `_internal/ACTIVE-WORK-CLAIMS.md`
- ⚠️ โฟลเดอร์นี้ถูก **OneDrive + Google Drive sync** ล็อกไฟล์ระหว่าง git operation ใหญ่ → `git merge/reset/checkout` อาจล้มกลางคันด้วย `Invalid argument`/`UNKNOWN` **ให้ย้ำคำสั่งเดิมซ้ำ 2-3 รอบ ผ่านเอง** (อย่าตกใจ ไม่ใช่ repo พัง — HEAD กับ git objects ปลอดภัยเสมอ)

## 📊 สถานะปัจจุบัน (อัปเดต 2026-07-17 หลัง merge ใหญ่ — นับจากไฟล์จริง ไม่ใช่ประมาณ)

**เนื้อหา:** รีวิวโรงแรม 2,401 (TH+EN ครบ) · roundup 397 (TH+EN ครบ) · บทความ 4,407 (TH+EN ครบ) — ครบ 77 จังหวัด + 33 ย่าน กทม. + เกาะ/โซน (เกาะเต่า/ลันตา/พีพี/ไร่เลย์/เกาะยาว/เขาสก) รวมคลัสเตอร์ Klook (กิจกรรม/ทัวร์จองได้)
**หน้า hub:** `city-*` 89 · `area-bangkok-*` 33 · `region-*` 6 · `activities-*` 84 · + destinations/near-me/michelin-finder/trip/search
**ภาษา — 2 ชั้น คนละกลไก (สำคัญ):**
- **ชั้น hub:** th 228 · en 225 · zh/ru/ko/ja/hi/he/ar ภาษาละ 223 หน้า
  - 30 หน้าเมืองหลัก = `gen-hubs.mjs` สร้างตรงจาก `_internal/province-data-<loc>/` (คำแปลอยู่ใน**ข้อมูล** → regenerate กี่ครั้งก็ไม่หาย)
  - อีก 193 หน้า = `_internal/i18n/localize.mjs` + `tm.<loc>.json` (22k คีย์/ภาษา) แปลง DOM ของหน้า EN (คำแปลผูกกับ**สตริง EN** → **EN เปลี่ยนเมื่อไหร่ coverage ร่วงเงียบๆ**)
- **ชั้นเนื้อหา:** zh 393 ไฟล์ · ru/ko/ja/hi/he/ar ภาษาละ 384 (รีวิว ~342 + roundup 30 + บทความ ~12) — route `pages/<loc>/[slug].astro` ครบ 7 ภาษา
**รวมทั้งเว็บ:** build ได้ **17,107 หน้า** · deploy จาก account `chatmaliwan` (ดู [[cloudflare-deploy-account]])
**212 posts เดิม:** ย้าย/ตัดสินใจแล้ว 195/209 (อีก 14 ตั้งใจข้าม — cache อยู่ที่ `_internal/migration/oldposts/`)

**งานถัดไปที่ยังไม่ทำ:**
- **🔴 content-layer localized articles ลิงก์เสีย ~2,361 จุด (58 บทความ × 7 ภาษา):** หน้า `pages/<loc>/[slug].astro` (reviews-<loc>/articles-<loc> ที่ origin localize) — `ArticleLayout.link()` เติม `${pfx}/` (เช่น `/ar/`) ให้ **ทุก** internal href แม้ target ไม่มีเวอร์ชันแปล → `/ar/getting-around-thailand` 404 (ของจริงอยู่ที่ /en/ + root). **fix ที่ถูกต้อง (ไม่ใช่ band-aid):** getStaticPaths ใน `pages/<loc>/[slug].astro` ทั้ง 7 ไฟล์ต้องสร้าง set ของ slug ที่มีเวอร์ชัน `<loc>` (จาก content collections + hub pages) แล้วส่งเป็น prop ให้ ArticleLayout → `link()` route ไป `/<loc>/` ถ้า target อยู่ใน set ไม่งั้น `/en/`. (band-aid = ส่ง /en/ หมด มี regression: hub cross-link ที่แปลได้กลายเป็น EN — เลี่ยง). ⚠️ เป็นระบบ i18n ชั้นเนื้อหาของ origin — ประสานก่อนแก้. **hub-layer เจอบั๊กเดียวกันแก้แล้ว** ใน `localize.mjs rewriteUrls` (2026-07-18, 45k ลิงก์) — ใช้เป็นแบบอ้างอิงได้
- **คำ "ลงตัว" 1,436 ครั้ง (39% ของรีวิว)** — คำไทยถูกต้อง ไม่ใช่คำต้องห้าม แต่กลายเป็น template crutch · จะ de-cliché ไหม = judgment call ของเจ้าของ (คำ AI ต้องห้ามจริง = 0 แล้ว)
- **รูปแผนที่ placeholder ตัวเดียวใช้ซ้ำ 717 รีวิว** (`images/gallery/220t180000014yxfw73B0.webp`) — ควรใส่รูปจริงรายโรงแรม
- Byline ผู้เขียนจริง, GA4 ID จริง (ยัง placeholder), cornerstone/pillar content
- ⚠️ **audit-site.mjs รู้จัก `/go/b` `/api/*` เป็น worker route แล้ว** (ไม่นับเป็น dead) — ถ้าเพิ่ม worker route ใหม่ อัปเดต isValidInternal ด้วย

---

## สถาปัตยกรรม
- **Astro static build** · `build: { format: 'file' }` · `trailingSlash: 'never'` → flat `.html`, clean URL
- **Content collections** (`astro/src/content.config.ts`):
  - `reviews` / `articles` / `roundups` (TH, source of truth)
  - `reviews-en` / `articles-en` / `roundups-en` (ใต้ `/en/`) ครบ 100% · และ `-zh/-ru/-ko/-ja/-hi/-he/-ar` (ใต้ `/<loc>/`) บางส่วน — ดูสถานะด้านบน
  - แต่ละ entry = ไฟล์ JSON 1 ไฟล์ ตาม schema → render ผ่าน `src/pages/[slug].astro` (TH) / `src/pages/en/[slug].astro` (EN) + Layout
- **Layouts**: `ReviewLayout.astro` (รีวิวโรงแรมเดี่ยว) · `RoundupLayout.astro` (Top N) · `ArticleLayout.astro` (บทความทุกประเภท รวม Klook activity cluster — reuse eat-ranking render engine เมื่อมี `restaurant` block)
- **public/** = static HTML hub pages (city/area/region/country/activities/index + ภาษาอื่นใน `public/<lang>/`) + assets (images, css, js) เสิร์ฟตรง ไม่ผ่าน Astro content collection
- **i18n hub layer**: `_internal/i18n/localize.mjs` เดิน DOM ของหน้า EN แล้วแทนที่ข้อความผ่าน translation-memory (`_internal/i18n/tm.<lang>.json`) — เขียนหน้าใหม่ที่ `astro/public/<lang>/`. `_internal/i18n/tm-tool.mjs` = chunk/merge tool สำหรับแปลทีละก้อน
- **Deploy**: Cloudflare อ่าน `astro/dist` (ดู `wrangler.jsonc`) · build = `cd astro && npm install && npm run build` (รัน `prebuild.mjs` ก่อนเสมอ = gen-hubs → gen-home → gen-sitemap → gen-search-index → gen-home-index → gen-feeds → gen-near-me · **`gen-hubs.mjs` อยู่ใน prebuild แล้ว** (รันเป็นตัวแรก) ไม่ต้องรันเองอีก)

## โครงไฟล์
```
astro/
  src/content.config.ts        schema (reviews/roundups/articles × TH+EN) · default addressCountry 'TH'
  src/content/{reviews,roundups,articles}/           *.json (TH, source)
  src/content/{reviews,roundups,articles}-en/         *.json (EN, ครบ 100%)
  src/content/{reviews,roundups,articles}-{zh,ru,ko,ja,hi,he,ar}/  *.json (บางส่วน — ชั้นเนื้อหา)
  src/layouts/{ReviewLayout,RoundupLayout,ArticleLayout}.astro
  src/styles/{review,roundup}.css
  src/pages/[slug].astro · src/pages/en/[slug].astro · src/pages/{zh,ru,ko,ja,hi,he,ar}/[slug].astro
  public/                      index.html, city-*.html, area-bangkok-*.html, region-*.html,
                                activities-*.html, sitemap.xml, robots.txt, images/
  public/<lang>/               zh, ru, ar, he, hi, ja, ko — hub-layer mirror (223 หน้า/ภาษา)
_internal/
  gen-hubs.mjs                 auto-gen hub pages (city/area/region/activities) — locale-aware
  gen-sitemap.mjs              sitemap.xml (ครบ 9 ภาษา + hreflang)
  i18n/                        localize.mjs, tm-tool.mjs, tm.<lang>.json, locales.mjs
  I18N-FULL-SITE-PLAN.md       แผน Phase 2 (แปลเนื้อหาเต็ม 7 ภาษาที่เหลือ)
  build-test.sh                validation build (temp dir นอก repo)
  wf/                          audit/validation scripts ต่างๆ
.claude/skills · .claude/agents
```

## Build / test (เครื่องนี้ C:\Users\Imac)
- **Node v24** อยู่ที่ `~/nodejs` — bash: `export PATH="$HOME/nodejs:$PATH"` ก่อน (PowerShell ไม่โหลด PATH นี้)
- **Python ใช้ไม่ได้** → ใช้ Node / PowerShell แทน
- clean build (กัน stale cache): `rm -rf astro/.astro astro/node_modules/.astro` ก่อนเสมอเวลา build ใหญ่
- production build script ตั้ง `--max-old-space-size=8192` ไว้แล้ว (`astro/package.json`) — ที่สเกลปัจจุบัน (~17,100 หน้า) ยังไม่ OOM แต่เคยเจอตอน ~13k+ หน้าถ้า Windows commit-memory ตึง (ดู memory `attraction-rollout-pipeline`)
- pre-push check: `bash _internal/build-test.sh` — รัน **dark-pattern lint** (ห้ามสร้างความเร่งรีบ/ของใกล้หมดปลอม) + **Booking→CJ revenue guard** (`_internal/qa/check-booking-cj.mjs` — พิสูจน์ว่า wrapper ทำงานจริง: ต้องเจอลิงก์ที่ wrap แล้ว ≥4,000 และลิงก์ booking.com ดิบ = 0) ทั้งคู่ต้องผ่านก่อน push

## มาตรฐานเนื้อหา (ยกจาก wherebest — LOCKED)
- **โทน v2-clean**: เพื่อนเล่าให้เพื่อน · ห้าม slang `อ่ะ/ปะ/แหละ/ล่ะ` · ห้ามคำ AI `ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`
- **Honesty / EEAT**: "เสียงจากรีวิวจริง" · ห้ามอ้างไปพักเอง · verify โรงแรมว่ามีจริงก่อนเขียน · ห้ามใส่วันที่ "ตรวจสอบแล้ว" ปลอม (ต้องมาจาก `modifiedDate`/`factCheckedDate` จริงเท่านั้น — ดูบทเรียนใน memory `site-quality-audit-2026-07`)
- **1 h1 ต่อหน้า** · canonical/og/hreflang · JSON-LD (มีใน layout แล้ว) · self-host รูป (R2 bucket, ดู `IMG_BASE` ใน layout)

## 🏷️ แบรนด์ / สโลแกน / ฟอนต์ (LOCKED — ใช้ทุกหน้า)
- **สโลแกน TH:** `Thailandaddict ชีวิตติดเที่ยว — ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย`
  - tagline = "ชีวิตติดเที่ยว" · descriptor = "ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย"
- **สโลแกน EN:** `Thailandaddict — Explore Thailand Like a Local`
- ใช้ใน: `<title>`/meta/og · hero (h1 = "ชีวิตติดเที่ยว") · footer (ft-tag = EN slogan, ft-desc = TH) ของทุกหน้า
- **ฟอนต์ไทย (LOCKED):** body = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Noto Sans Thai', 'Sarabun', sans-serif` · หัวข้อ Latin = Fraunces serif (Thai fallback → iOS/Noto sans) · UI/ตัวเลข = Outfit

## Affiliate IDs
- Agoda `cid=1965862` · Trip.com `Allianceid=6861268&SID=312919111` · Klook `aid=121442`
- **Booking.com** ผ่าน CJ (Commission Junction) — PID `101809619` + deep-link ad `17293139` — เส้นทาง `/go/b?u=<encoded booking url>&sid=<slug>` → worker.js 302 ไปยัง CJ tracking link (ดูรายละเอียดเต็มใน memory `booking-cj-affiliate`, ⚠️ อย่าใช้ PID `101763824` — เป็นของเว็บอื่น)
  - **LOCKED: id อยู่ใน `worker.js` ที่เดียวเท่านั้น** — ห้ามฝัง CJ link ตรงใน HTML/layout อีก (เคยมีแบบ `cjB()` + ad `17289009` ฝังใน 13k ไฟล์ · merge 2026-07-17 ถอดออกหมดแล้ว) เปลี่ยน CJ = แก้ worker 10 บรรทัด + deploy 30 วิ ไม่ต้อง rebuild 17k หน้า
  - ⚠️ ad `17289009` ที่เครื่องอื่นเคยใช้ ยังไม่ยืนยันว่าอันไหน track ถูก — **เช็ค CJ dashboard ว่า ad ไหนมี click จริง** ถ้าผิดแก้ที่ `CJ_BOOKING.adid` ใน worker.js จุดเดียว
- **GetYourGuide** — โค้ดมี placeholder `__GYG_PARTNER_ID__` ค้างอยู่ใน 6,538 ไฟล์ (owner ตัดสินใจแล้วว่ายังไม่รีบแก้ ณ 2026-07-11 — ไม่ต้องถามซ้ำ)

## Skills / Agents (`.claude/`)
- skills: `thailandaddict-activity-ranking` · `thailandaddict-klook-province` · `thailandaddict-restaurant-ranking` · `tourlogy-city-content` · `tourlogy-city-roundup-checklist`
- agents: roundup-builder · hotel-reviewer · food-writer · attraction-writer · quality-auditor (งานเขียน = Opus)

## 🎨 Design system — "Vibrant Island Pop" (Direction C · LOCKED)
เอกลักษณ์เฉพาะ thailandaddict (ฉีกจาก wherebest blue/orange · owner เลือก C) — ใช้**ทุกหน้า** ทั้ง hub + layout รีวิว/roundup/บทความ
- **Palette:** teal `#06B6D4` (+dk `#0891b2`) · coral `#FB7185` (+dk `#f43f5e`) · mango `#FBBF24` · ink `#0F172A` · sub `#64748b` · bg ขาว `#ffffff` · soft section `#f1fbfd` · border `#e6eef2`
- **Fonts:** Outfit 800/900 (display/หัวข้อ/ชื่อโรงแรม/rank/คะแนน — sans หนา ไม่ใช่ serif) · Sarabun (body ไทย) · Outfit (UI/ปุ่ม/label)
- **สไตล์:** สดใส มนโค้งใหญ่ (การ์ด 20–26px · ปุ่ม 12px · pill 999px) · เงาสีสด · gradient (hero teal→coral, ปุ่ม, score)
- **Booking buttons:** Agoda=coral gradient · Booking=teal · Trip=ink · rank tile=teal gradient · score=mango→amber gradient pill · rating bars=teal→coral
- **ต้นแบบ/design-system reference = `astro/public/index.html`** (`<style>` block + nav/footer chrome) — หน้า hub อื่นก๊อป block นี้ · layout รีวิว/roundup/บทความ ฝัง palette เดียวกันใน CSS + inline `<style>`
- favicon = teal `T` (`%2306B6D4`) · chrome ร่วม nav/footer เหมือนกันทุกหน้า
- (เคยลอง A "Modern Tropical Editorial" cream/teal/Fraunces — owner เลือก C แทน · ห้ามใช้ token A เดิม `#0E7C6B`/`#FF6B4A`/cream/Fraunces)

## 🌐 ภาษา (i18n) + เมืองท่องเที่ยว (LOCKED policy · แผนเต็ม = `_internal/I18N-AND-TOURISM-CITY-PLAN.md` + `_internal/I18N-FULL-SITE-PLAN.md`)
- **9 ภาษา:** th·en·zh·ru·ko·ja·he·ar·hi · ⚠️ he+ar = RTL (`dir="rtl"` — ทำถูกต้องแล้วในทุกหน้าที่ deploy)
- **ชั้น hub (226 หน้า: home + country + tourist-cities + 6 region + city-* 89 + area-bangkok-* 33 + activities-* 84 + misc):** ✅ ครบ 9 ภาษา 100% แล้ว (deploy แล้ว)
- **ชั้นบทความ/รีวิว/roundup (6,563 ไฟล์):** ยังมีแค่ TH+EN — Phase 2 ที่ยังไม่เริ่ม ต้องมี language-shard worker infra ก่อน (ทะลุ 20,000 ไฟล์/worker ถ้าทำเต็ม 1 ภาษาเพิ่ม)
- **กติกาทอง:** โครงสร้าง/เลย์เอาต์/ดีไซน์เหมือนกันทุกภาษา เปลี่ยนเฉพาะ "ข้อความที่แสดง" + ทิศอ่าน
- **เครื่องมือ:** `_internal/i18n/localize.mjs <lang...> <slugs...>` (build ต้อง regenerate ทุกภาษาที่ live พร้อมกันในคำสั่งเดียว เพื่อให้ hreflang อ้างอิงกันครบ) · `tm-tool.mjs split|merge|status <lang>` (chunk/merge translation memory) · **⚠️ ก่อนประกาศภาษาไหน "ครบ 100%" ต้อง `--collect` string สดใหม่เสมอ — coverage แอบร่วงเงียบๆ เมื่อเว็บโตขึ้น** (ดูบทเรียนเต็มใน memory `i18n-rollout-progress`)

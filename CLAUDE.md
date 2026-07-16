# CLAUDE.md — thailandaddict.com

แบรนด์ **เที่ยวไทยเฉพาะทาง** (9 ภาษา ชั้น hub · TH+EN ชั้นบทความ) บน Astro static → Cloudflare
Scaffold ยกสถาปัตยกรรมมาจาก wherebest (repo `tourlogy`) แล้ว rebrand

> อ่าน `thailandaddict-handoff.md` สำหรับบริบทและการตัดสินใจยุคแรกเริ่ม (เอกสารนี้เขียนตอน scaffold ยังว่างเปล่า — ดูสถานะปัจจุบันด้านล่างแทน)

---

## 📊 สถานะปัจจุบัน (อัปเดต 2026-07-11 — ใช้แทน "งานต่อไป" เดิมที่ล้าสมัยแล้ว)

**เนื้อหา:** รีวิวโรงแรม 2,212 หน้า (TH+EN ครบ) · hotel roundup 272 หน้า (TH+EN ครบ) · บทความ 4,079 หน้า (TH+EN ครบ 100%) — ครอบคลุมทั้ง 77 จังหวัด รวมคลัสเตอร์ Klook (กิจกรรม/ทัวร์จองได้) 357 บทความต่อภาษา
**หน้า hub:** `city-*.html` 89 หน้า (77 จังหวัด + 12 เมืองท่องเที่ยว/เกาะ) · `area-bangkok-*.html` 33 ย่าน กทม. · `region-*.html` 6 ภาค · `activities-*.html` 84 หน้า (auto-gen จาก Klook cluster)
**ภาษา (ชั้น hub 226 หน้า):** th/en/zh/ru/ar/he/hi/ja/ko ครบ 100% ทั้ง 9 ภาษา (223/226 หน้าต่อภาษา, deploy แล้ว) — **ชั้นบทความ/รีวิว/roundup ยังเป็น TH+EN เท่านั้น** (แปลอีก 7 ภาษาที่เหลือ = งานใหญ่ถัดไป ดู `_internal/I18N-FULL-SITE-PLAN.md`)
**รวมทั้งเว็บ:** ~15,100 หน้า live, deploy จาก account `chatmaliwan` (ดู [[cloudflare-deploy-account]])
**212 posts เดิม:** ย้าย/ตัดสินใจแล้ว 195/209 (อีก 14 ตั้งใจข้าม — cache อยู่ที่ `_internal/migration/oldposts/`, WP REST API เดิมปิดไปแล้ว)

**งานถัดไปที่ยังไม่ทำ** (ดู memory `site-quality-audit-2026-07` สำหรับรายละเอียดเต็ม 18 ข้อ):
- Phase 2 i18n: แปลเนื้อหาบทความ/รีวิว/roundup เป็น 7 ภาษาที่เหลือ (ตอนนี้มีแค่ TH/EN) — ต้องสร้าง language-shard workers ก่อนเพราะจะทะลุ 20,000 ไฟล์/worker
- ไม่มี cornerstone/pillar content (ไม่มีหน้า "เริ่มต้นเที่ยวไทย" หรือ decision tool)
- Byline ผู้เขียนจริง, GA4 ID จริง (ยังเป็น placeholder), alt text รูปหน้า "-compared" (~43% ว่าง)
- เส้นทางเดินทางระหว่างเมืองบางเส้นยังขาด (มีแค่ 11 เส้นทางทั้งเว็บ)

---

## สถาปัตยกรรม
- **Astro static build** · `build: { format: 'file' }` · `trailingSlash: 'never'` → flat `.html`, clean URL
- **Content collections** (`astro/src/content.config.ts`):
  - `reviews` / `articles` / `roundups` (TH, source of truth)
  - `reviews-en` / `articles-en` / `roundups-en` (เสิร์ฟใต้ `/en/`) — ครบ 100% กับ TH แล้ว
  - แต่ละ entry = ไฟล์ JSON 1 ไฟล์ ตาม schema → render ผ่าน `src/pages/[slug].astro` (TH) / `src/pages/en/[slug].astro` (EN) + Layout
- **Layouts**: `ReviewLayout.astro` (รีวิวโรงแรมเดี่ยว) · `RoundupLayout.astro` (Top N) · `ArticleLayout.astro` (บทความทุกประเภท รวม Klook activity cluster — reuse eat-ranking render engine เมื่อมี `restaurant` block)
- **public/** = static HTML hub pages (city/area/region/country/activities/index + ภาษาอื่นใน `public/<lang>/`) + assets (images, css, js) เสิร์ฟตรง ไม่ผ่าน Astro content collection
- **i18n hub layer**: `_internal/i18n/localize.mjs` เดิน DOM ของหน้า EN แล้วแทนที่ข้อความผ่าน translation-memory (`_internal/i18n/tm.<lang>.json`) — เขียนหน้าใหม่ที่ `astro/public/<lang>/`. `_internal/i18n/tm-tool.mjs` = chunk/merge tool สำหรับแปลทีละก้อน
- **Deploy**: Cloudflare อ่าน `astro/dist` (ดู `wrangler.jsonc`) · build = `cd astro && npm install && npm run build` (รัน `prebuild.mjs` ก่อนเสมอ — แต่รันแค่ `gen-home.mjs`/`gen-sitemap.mjs`/`gen-search-index.mjs`/`gen-home-index.mjs`/`gen-feeds.mjs` เท่านั้น · **`gen-hubs.mjs` ไม่ได้อยู่ใน prebuild ต้องรันเองก่อน build ทุกครั้งที่แก้ข้อมูลรีวิว/บทความที่กระทบหน้า hub** — `node _internal/gen-hubs.mjs`)

## โครงไฟล์
```
astro/
  src/content.config.ts        schema (reviews/roundups/articles × TH+EN) · default addressCountry 'TH'
  src/content/{reviews,roundups,articles}/           *.json (TH, source)
  src/content/{reviews,roundups,articles}-en/         *.json (EN, ครบ 100%)
  src/layouts/{ReviewLayout,RoundupLayout,ArticleLayout}.astro
  src/styles/{review,roundup}.css
  src/pages/[slug].astro · src/pages/en/[slug].astro
  public/                      index.html, city-*.html, area-bangkok-*.html, region-*.html,
                                activities-*.html, sitemap.xml, robots.txt, images/
  public/<lang>/               zh, ru, ar, he, hi, ja, ko — hub-layer mirror (226 หน้า/ภาษา)
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
- production build script ตั้ง `--max-old-space-size=8192` ไว้แล้ว (`astro/package.json`) — ที่สเกลปัจจุบัน (~15,100 หน้า) ยังไม่ OOM แต่เคยเจอตอน ~13k+ หน้าถ้า Windows commit-memory ตึง (ดู memory `attraction-rollout-pipeline`)
- pre-push check: `bash _internal/build-test.sh`

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

# 🌐 แผนภาษา (i18n) + การจัดหมวด "เมืองท่องเที่ยว" — thailandaddict.com

> บันทึกเป็นแนวทางการทำ (owner decision · 2026-06) · ใช้คู่กับ CLAUDE.md (ดีไซน์ Direction-C LOCKED) และ PROVINCE-PLAYBOOK
> สถานะ: **แผน (ยังไม่ลงมือ)** — สร้างเนื้อหา TH/EN ให้ครบก่อน แล้วค่อยทำชั้นภาษา

---

## 1) นโยบายภาษา (LOCKED)

แบ่งหน้าเว็บเป็น **2 ระดับภาษา (tiers)**:

### Tier-1 — 9 ภาษา (หน้าสำคัญ/มูลค่าสูง)
หน้าเหล่านี้รองรับ **9 ภาษา**: ไทย (th) · อังกฤษ (en) · จีน (zh) · รัสเซีย (ru) · เกาหลี (ko) · ญี่ปุ่น (ja) · ฮีบรู (he) · อาหรับ (ar) · ฮินดี (hi)
- **หน้าหลัก** (`index.html`)
- **หน้าจังหวัด (เฉพาะที่เป็น "เมืองท่องเที่ยว")** — ดูนิยามข้อ 2
- **หน้าเมืองท่องเที่ยว / ส่วน destination** (`destinations.html`, `city-<slug>.html` ของชุดเมืองท่องเที่ยว)
- ⚠️ **`he` (ฮีบรู) + `ar` (อาหรับ) = RTL** ต้อง `<html dir="rtl">` + mirror layout (ดูข้อ 4.4)

### Tier-2 — 2 ภาษา (ไทย + อังกฤษ เท่านั้น)
- **หน้าจังหวัดรอง** (จังหวัดทั่วไปที่ไม่ใช่เมืองท่องเที่ยว)
- **หน้าอื่น ๆ ทั้งหมด**: บทความ (articles), รีวิวโรงแรม (reviews), roundup, หน้า region, about/contact/policy ฯลฯ
- (สถานะปัจจุบัน: reviews/roundup มี TH+EN แล้ว · articles เป็น TH ก่อน รอแปล EN — ตามแผนเดิม)

**กติกาทอง:** โครงสร้างเว็บ/เลย์เอาต์/ดีไซน์ **เหมือนกันทุกภาษา** เปลี่ยนเฉพาะ "ข้อความที่แสดง" + ทิศอ่าน (LTR/RTL) เท่านั้น

---

## 2) นิยาม "เมืองท่องเที่ยว" (Tourism City) — แยกจากจังหวัดทั่วไป

ปัญหาเดิม: `country-thailand.html` ปนเมืองท่องเที่ยวดัง (ภูเก็ต/เชียงใหม่) กับจังหวัดที่คนไม่ได้ไปเที่ยวเป็นหลัก ในกริดเดียวกัน → ไม่สื่อลำดับความสำคัญ

**ทางออก: ตั้งชุด "เมืองท่องเที่ยว" (curated) แยกชัด** = หน้า Tier-1 (9 ภาษา) และได้ดีไซน์พรีเมียม
- ที่มา: `gen-hubs.mjs` มี 2 ลิสต์อยู่แล้ว → รวมเป็นชุดเดียว
  - `TOPDEST` (จังหวัดเมืองท่องเที่ยว: bangkok, chiang-mai, phuket, krabi, chiang-rai, chonburi, surat-thani, prachuap-khiri-khan, kanchanaburi, ayutthaya, rayong, trat, phang-nga, nan, mae-hong-son, sukhothai, nakhon-ratchasima, phetchabun)
  - `DESTINATIONS` (เกาะ/เมืองย่อย: koh-phangan, hat-yai, samui, pai, pattaya, huahin, khao-yai, koh-chang, koh-lipe, koh-kood, koh-mak, koh-larn)
- **เกณฑ์เข้าชุด** (ใช้คัดเพิ่ม/ลด): ดีมานด์ค้นหาสูง · มี inventory โรงแรม ≥ Top10 · มีแลนด์มาร์ก/ภาพจำ · เป็นปลายทางที่นทท.ต่างชาติไปจริง
- ตั้งค่าเดียว: `TOURISM_CITIES = [...slugs]` ใน gen-hubs → ใช้ทั้ง (ก) คัดหน้าเข้า Tier-1, (ข) เรนเดอร์การ์ดหมวดเมืองท่องเที่ยว, (ค) ตัดสินใจ hreflang 9 ภาษา

### ดีไซน์การนำเสนอ (Direction-C · โดดเด่น/สวยงาม)
- **หมวดแยกบนหน้าหลัก + หน้า `destinations.html` ใหม่** ชื่อ "เมืองท่องเที่ยวยอดนิยม / Top Destinations"
- การ์ดพรีเมียมขนาดใหญ่ (radius 24px) รูปเต็มใบ + gradient teal→coral ทับล่าง · ชื่อเมือง Outfit 800 · tagline สั้น · chip ประเภท (เกาะ/ภูเขา/วัฒนธรรม/เมือง)
- **badge "9 ภาษา / 9 languages"** หรือแถวธงเล็ก ๆ บนการ์ด → สื่อว่าเป็นหน้าระดับพรีเมียมที่แปลครบ (จุดขายต่างจังหวัดทั่วไป)
- **filter pills** จัดกลุ่มตามประสบการณ์: 🏝️ เกาะ-ทะเล · ⛰️ ภูเขา-ธรรมชาติ · 🛕 เมืองวัฒนธรรม · 🏙️ เมือง-กิน-ช้อป (slug-to-category map ใน gen-hubs)
- จังหวัดทั่วไป (Tier-2) อยู่กริดแยกด้านล่าง สไตล์ไดเรกทอรีกระชับ (การ์ดเล็ก/ list) — TH+EN
- mockup อ้างอิง: ดูที่นำเสนอในแชต (turn ที่ออกแบบ) → ถอดเป็น `<style>` block + การ์ด ใน gen-hubs

---

## 3) สถาปัตยกรรมการแปล — ภาพรวม

หลักการ: **เนื้อหา (data) แยกจากการนำเสนอ (template)** และ **สตริงแยกจากโครงสร้าง**
มี 2 ชนิดข้อความที่ต้องแปล:
1. **UI chrome** (เมนู/ฟุตเตอร์/ปุ่ม/หัวข้อ section/label) — จำกัด ~200-400 สตริง ใช้ทุกหน้า
2. **เนื้อหาเพจ** (tagline/intro/highlights/foodScene/attractions ของเมืองท่องเที่ยว) — ต่อเมือง

> Tier-1 ต้องแปลทั้ง (1)+(2) เป็น 9 ภาษา · Tier-2 ใช้ (1) TH/EN ที่มีอยู่ + เนื้อหาเดิม

### 3.1 URL / โครงสร้างไฟล์ (static, Cloudflare)
ใช้ **subpath ต่อภาษา** (ต่อยอดจากของเดิมที่เสิร์ฟ EN ใต้ `/en/`):
```
/                     th (default)          ← Tier-1 + Tier-2
/en/…                 en                    ← Tier-1 + Tier-2
/zh/…  /ru/…  /ko/…  /ja/…  /he/…  /ar/…  /hi/…   ← Tier-1 เท่านั้น
```
- Tier-1 page 1 หน้า → เรนเดอร์ 9 ไฟล์ (`city-phuket.html`, `en/city-phuket.html`, `zh/city-phuket.html`, …)
- Tier-2 page → เรนเดอร์ 2 ไฟล์ (root + `en/`) เท่านั้น — ภาษาอื่นไม่ต้องสร้าง (ประหยัด build)
- คงรูป flat `.html` + clean URL + `trailingSlash:'never'` ตามสถาปัตยกรรมเดิม

### 3.2 ที่เก็บคำแปล (translation store)
```
astro/src/i18n/
  ui.th.json  ui.en.json  ui.zh.json  …  ui.hi.json     # UI chrome (keyed: nav.home, footer.tagline, btn.book …)
  meta.json                                              # locales[], dir(rtl/ltr), font stack, label, flag
_internal/city-i18n/
  <slug>.th.json  <slug>.en.json  …  <slug>.hi.json      # เนื้อหาเมืองท่องเที่ยว (แปลจาก province-data/<slug>.json)
```
- `province-data/<slug>.json` (ไทย) = **source of truth** → แปลไป 8 ภาษา เก็บแยกไฟล์ (ไม่ทับต้นฉบับ)
- ฟิลด์ที่แปล: th, tagline, introHtml, bestTime, highlights[].blurb, foodScene[].note, attractions[].blurb, itineraryIdeas[]
- ค่าโครงสร้าง (slug, neighbors, kind, heroEmoji, รูป) **ไม่แปล** — ใช้ร่วมทุกภาษา → "เปลี่ยนเฉพาะภาษาที่แสดง"

### 3.3 gen-hubs / layout เป็น locale-aware
- `gen-hubs.mjs` รับ `LOCALES` → loop: สำหรับเมืองท่องเที่ยว เรนเดอร์ทั้ง 9 · จังหวัดทั่วไป + sub-page เรนเดอร์ th+en
- template ดึงสตริงจาก `ui.<lang>.json` (chrome) + `city-i18n/<slug>.<lang>.json` (เนื้อหา)
- **graceful fallback**: ถ้าคำแปลภาษาใดยังไม่มี → fallback `en` → `th` (ไม่ทำหน้าพัง) + ทำเครื่องหมาย `translationStatus`
- Astro `[slug].astro` (reviews/roundups) คงเดิม TH/EN

### 3.4 RTL (he + ar)
- `<html lang="ar" dir="rtl">` (กับ he) · ทุกหน้า Tier-1 ภาษานี้
- CSS: ใช้ **logical properties** (`margin-inline`, `padding-inline`, `inset-inline`, `text-align:start/end`) แทน left/right + เพิ่ม block `html[dir="rtl"] { … }` mirror เมนู/ลูกศร/breadcrumb/การ์ด
- ไอคอน/ลูกศรทิศทาง flip · ตัวเลข/ราคา/วันที่คงอ่าน LTR ในบริบท RTL ได้ (bidi)
- ทดสอบ: เมนู, hero, การ์ด, ปุ่มจอง, ฟุตเตอร์ ต้องไม่เพี้ยน

### 3.5 ฟอนต์ต่อสคริปต์ (self-host/subset)
| lang | script | ฟอนต์เสริม (นอกเหนือ stack เดิม) |
|------|--------|--------------------------------|
| th | Thai | (มีแล้ว) Noto Sans Thai / system |
| en | Latin | (มีแล้ว) |
| zh | Han | Noto Sans SC |
| ja | Kana/Han | Noto Sans JP |
| ko | Hangul | Noto Sans KR |
| ru | Cyrillic | (Latin stack รองรับ; เสริม Noto Sans) |
| he | Hebrew | Noto Sans Hebrew |
| ar | Arabic | Noto Sans Arabic / Cairo |
| hi | Devanagari | Noto Sans Devanagari |
- โหลดเฉพาะฟอนต์ของ locale นั้น (ต่อหน้า) — ไม่แบกทุกสคริปต์ทุกหน้า

### 3.6 SEO / hreflang
- ทุกหน้า Tier-1: emit `<link rel="alternate" hreflang="…">` ครบ 9 + `x-default` (→ en)
- Tier-2: hreflang th/en
- canonical ต่อ locale · sitemap แยก locale หรือรวมพร้อม hreflang · `og:locale` ต่อภาษา
- language switcher ใน nav: dropdown 9 ภาษา (เฉพาะหน้า Tier-1) · หน้า Tier-2 เป็น toggle TH/EN เท่านั้น

---

## 4) ลำดับงานที่แนะนำ (เมื่อพร้อมลงมือ)
1. สร้างเนื้อหา TH/EN ให้ครบก่อน (งานปัจจุบัน — 12 destinations + provinces)
2. ตั้ง `TOURISM_CITIES` + slug→category map + ดีไซน์การ์ดหมวด (ข้อ 2) → ใช้ TH/EN ก่อน
3. ทำ `ui.<lang>.json` ครบ 9 (UI chrome) — แปล/รีวิวทีละภาษา
4. ทำ `city-i18n/<slug>.<lang>.json` ของเมืองท่องเที่ยว (แปลจาก province-data) ทีละภาษา (TH=source)
5. ทำ gen-hubs/layout เป็น locale-aware + RTL CSS + ฟอนต์ + hreflang + language switcher
6. build-test ทุก locale · ตรวจ RTL ด้วยตา · push

## 5) ประมาณการขนาด build
- เมืองท่องเที่ยว ~30 + หน้าหลัก + หมวด ≈ 35 หน้า Tier-1 × 9 = ~315 หน้า localized
- Tier-2 (จังหวัดรอง + บทความ + รีวิว) TH+EN ตามเดิม
- รวมยังอยู่ในวิสัย static build (Cloudflare) — คุม heap 8GB เหมือนเดิม

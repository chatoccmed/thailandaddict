# DEVELOPMENT PLAN v4 — Revenue-First: full-site audit → affiliate monetization roadmap

> สร้าง 2026-07-05 จาก **full-site audit สด** (4 agent, grep/glob-grounded ทุกตัวเลข) ตามคำสั่งเจ้าของ: "ตรวจสอบงานในระบบทั้งหมด วิเคราะห์เว็บทั้งเว็บ วางแผนให้เป็นเว็บรีวิวที่เที่ยวไทยที่ดีที่สุดในโลก และสร้างรายได้จาก Affiliate (Agoda/Trip/Klook/etc.)"
> ต่อยอด v1 (north-star/moat) · v2 (activation gap) · v3 (competitive benchmark, AEO wedge) — **v4 นี้ = เจาะเฉพาะ "ปิดรอยรั่วรายได้" จริงในโค้ด ไม่ใช่ทฤษฎี**
> อ้างอิงคู่กับ `_internal/SESSION-END-2026-07-05.md` (QA + Booking→CJ ทำไปแล้วมหาศาล) — v4 นี้คือสิ่งที่เหลือ **หลัง** งานนั้น

## ✅ Tier 0 ที่ทำเสร็จแล้ว (คืน 2026-07-05→06 — owner สั่ง "ทำต่อเนื่องได้เลย ไปนอนก่อน")
- **0.1 Faceted filter (stars+budget) บน RoundupLayout** — พอร์ตจาก `.rfilter` pattern ของ eat-ranking มาใช้กับ 296 หน้า Top-N ที่พัก, derive จาก field ที่มีอยู่แล้ว (`stars`, `priceBig`) 0 ไฟล์คอนเทนต์ต้องแก้ · live
- **0.4 Decision-content เพิ่ม 3 คู่ TH+EN**: `ayutthaya-day-trip-or-overnight` (ปิด gap เดย์ทริป/ค้างคืน), `best-time-to-visit-phuket` (เรื่องฝนคนละฝั่งทะเล), `best-time-to-visit-chiang-mai` (เรื่องหน้าหมอกควัน PM2.5) — ทุกอันอ้างอิงข้อมูลที่ verify แล้วในเว็บ ไม่ใช่ค้นคว้าใหม่ · cross-link ครบ · live
- **bug ที่เจอระหว่างทาง**: roundupSchema มี `modifiedDate` field ซ้ำ 2 ที่ (ของเดิมที่มีอยู่แล้ว + ที่ผมเผลอเพิ่มซ้ำตอนแก้ freshness-date) → ลบตัวซ้ำแล้ว
- **Tier 2 image pipeline (ทำบางส่วนแบบระมัดระวัง — ไม่แตะทั้ง 14,170 ไฟล์รวดเดียวตอนไม่มีคนดูแล)**: วิเคราะห์ความถี่การอ้างอิงรูปทั้งเว็บ → เลือก 150 ไฟล์ที่ถูกอ้างอิงบ่อยสุด (รวม 7,531 ครั้ง) → แปลง webp (ลดขนาด 23%) → อัป R2 → เพิ่ม `astro/src/data/webp-manifest.json` + wire `<picture><source webp>` ครบทั้ง 3 layout แล้ว (RoundupLayout entry-card, ReviewLayout hero×3+gallery×2, ArticleLayout hero+resto-mainimg) verify ผ่านทุกจุด (0 regression สำหรับรูปนอก manifest)
  - **ข้อสังเกต**: 11 ไฟล์ `_lib/*.webp` (คอกอฟฟี่/ก๋วยเตี๋ยว ฯลฯ) ที่แปลงไปนั้น**ไม่ได้แสดงจริง** เพราะ ArticleLayout มี `realLib()` gate เดิมอยู่แล้ว (`s.indexOf('/_lib/')===-1 ? s : ''`) ที่ซ่อนแท็บรูปเมื่อ libImg เป็น path `_lib/` โดยตั้งใจ (ป้องกันโชว์รูปสต็อกทั่วไปเป็นรูปร้านจริง — ตรงกับหลักความซื่อสัตย์ของเว็บ) — ไม่ใช่บั๊ก แค่ทำให้ 11 ไฟล์นั้นไม่ได้ประโยชน์ด้าน perf เท่าที่ประเมินไว้แรก
  - **เหลือ**: แปลงรูปที่เหลืออีก ~14,000 ไฟล์ (ทำทีละล็อตในเซสชันถัดไป จะปลอดภัยกว่า — pattern/infra พร้อมแล้วครบ 3 layout)

---

## 0. สถานะเมื่อเริ่ม v4 (ยืนยันด้วย grep จริง ไม่ใช่สมมติ)

**เสร็จแล้ว/แข็งแรง (ยืนยันสด — ไม่ต้องแตะ):**
- EN/TH parity **สมบูรณ์ 100%** — articles 3,980=3,980 · reviews 2,296=2,296 · roundups 296=296 (รวม 13,144 ไฟล์ 0 gap)
- Booking.com → CJ **เสร็จสมบูรณ์** — 19,365 ลิงก์ CJ, 0 ดิบ, guard `check-booking-cj.mjs` ผ่าน 5/5
- หน้าแรก conversion path **ดีอยู่แล้ว** — ปุ่ม Agoda cid จริงใน sticky nav เห็นทันทีไม่ต้องเลื่อน
- `/trip` + 🔖 save-to-plan **ทำงานจริงจบ flow** (localStorage), ไม่ noindex, ลิงก์จาก nav แล้ว — ตรง scope ที่ตั้งใจ (จัดทริปเต็มอยู่ Velalist)
- ความสด (recency) **ดีมาก** — ไฟล์ที่มี modifiedDate 99% อายุ ≤5 สัปดาห์
- ความลึกเชิงโครงสร้าง **คงเส้นทุกจังหวัด** — จังหวัดเล็กได้ template ครบเหมือนจังหวัดใหญ่ (ไม่มีการตัดทอนตาม tier)
- **Wave 0/1/3 จาก v3 LIVE แล้วในเซสชันนี้**: answer-block+Speakable ~600 หน้า, บรรณาธิการ Doctor Chat (Person schema+byline+รูปจริง) 13k หน้า, dark-pattern guard ถาวร, tentpole Best of Thailand 2026 *(⚠️ audit agent 2 ตัวรายงานผิดว่ายังเป็น Organization — เป็นข้อมูลเก่า อย่าเชื่อ ให้เชื่อ production ที่ verify แล้ว)*

**รอยรั่วรายได้จริง (ยืนยันด้วย grep + Read ตรงจริง — ไม่ใช่แค่ agent claim):**
| จุด | ตัวเลขจริง | ผลกระทบ |
|---|---|---|
| GetYourGuide placeholder `__GYG_PARTNER_ID__` | **6,510 ไฟล์ / 6,548 จุด** (verify ตรงด้วย Node script) | รอยรั่วใหญ่ที่สุด — ~90% ของหน้ากิจกรรม/attraction ไม่ทำเงินเลย |
| GA4 ยัง `G-XXXXXXXXXX` | 3 จุด (Analytics.astro, gen-hubs.mjs, trip.html) — verify literal บรรทัดจริง | มองไม่เห็นว่าหน้าไหน convert — โค้ด event tracking พร้อมหมดแล้ว รอแค่ ID |
| Klook `search?query=` แทน deep-link | ~1,000 ไฟล์เหลือ (batch 1/3 เสร็จ = 11 สถานที่กรุงเทพ 56 CTA) | deep-link แปลง 3-5 เท่า — loop อัตโนมัติกำลังทำต่อ (batch 2-3) |
| Newsletter ฟอร์ม | โชว์ "ขอบคุณ!" แต่ `return false` — **ไม่เก็บอีเมลจริงเลย** (verify literal onsubmit) | ทุกคนที่กรอกคิดว่าสมัครสำเร็จ แต่ไม่มีอะไรถูกบันทึก |
| Faceted filter บนหน้า **roundup ที่พัก** (Top-N โรงแรม) | RoundupLayout ไม่มี `<select>`/facet เลย (verify กว้างแล้ว ไม่ใช่แค่หา "filter") | 296 หน้า Top-N ที่พักไม่มี filter งบ/ย่าน — *(หมายเหตุ: หน้า eat-ranking ใน ArticleLayout มี filter chip ระบบ `.rfilter` ทำงานจริงอยู่แล้ว แค่ยังไม่พอร์ตมาที่ RoundupLayout — งานเล็กกว่าที่คิดตอนแรก)* |
| รูปภาพ | webp 101 ไฟล์ (เฉพาะ batch มิชลิน) vs jpg/png **14,170 ไฟล์** · AVIF=0 · `<picture>`=0 | ต้นทุน Core Web Vitals/LCP จริงทั่วเว็บ |
| `modifiedDate` coverage | มีแค่ **21.5%** ของบทความ (856/3,980) | ที่เหลือส่งสัญญาณความสดให้ Google/AI ไม่ได้เลย |
| Decision-content ("vs"/"worth it"/"best time") | vs=18-19 ไฟล์, worth-it=0 หน้าเฉพาะ, best-time=1 หน้ารวมทั้งประเทศ | ⚠️ **แก้ไข**: agent เดิมบอกอยุธยาไม่มี vs-content เลย — **ผิด** มี `sukhothai-vs-ayutthaya.json` อยู่แล้ว (แค่ค้นหา pattern "ayutthaya-vs-*" เลยพลาดไฟล์ที่ชื่อขึ้นต้นจังหวัดอื่น) gap จริงคือไม่มี "worth it"/"day-trip vs overnight" style — **เติมแล้ว**: `ayutthaya-day-trip-or-overnight` (TH+EN) ระหว่าง audit นี้ |
| 12Go/Airalo/SafetyWing placeholder | 24+2+2 = 28 ไฟล์ | เล็ก แต่ free-win พ่วงไปกับ GYG |

**⚠️ แก้ไขจากรายงานตัวแรก — "sticky CTA หายจากหน้ารีวิว/roundup" ไม่จริง:** grep หาคำว่า "sticky" พลาดเพราะ CSS จริงใช้ `position:fixed` (คนละคำ) และอยู่ใน stylesheet แยก (review.css/roundup.css) ไม่ใช่ในไฟล์ .astro. ตรวจสอบซ้ำพบว่า **ReviewLayout มี `.rvbar`** (แถบจองลอย แสดงทั้งเดสก์ท็อป+มือถือ พร้อมการ์ด Agoda/Booking.com/Trip.com + ราคาจริงต่อโรงแรม) และ **RoundupLayout มี `.mbar`** (แถบมือถือ 2 ปุ่ม จอง+ดูรีวิว) **ทำงานสมบูรณ์อยู่แล้วทั้งคู่** ไม่ต้องแก้อะไร — ถอดออกจาก Tier 0

---

## 1. Roadmap — เรียงตาม **ทำได้เลยไหม × ผลกระทบรายได้**

### 🟢 Tier 0 — ทำได้ทันที ไม่ต้องรอใคร (โค้ด/เทมเพลตล้วน)
| # | งาน | ทำไมสำคัญ | ขนาด |
|---|---|---|---|
| 0.1 | **Sticky booking CTA บน ReviewLayout + RoundupLayout** | แก้บั๊ก "กลับด้าน" — จุดใกล้ปิดการขายที่สุดไม่มี CTA ติดจอ | เทมเพลต 2 ไฟล์ → 2,592 หน้า(รีวิว+roundup) |
| 0.2 | **wire `check-booking-cj.mjs` เข้า build-test.sh** | กัน regression อัตโนมัติ ตอนนี้ต้องรันมือ | 5 นาที |
| 0.3 | **Faceted filter บน roundup** (งบ/ย่าน) | จำลอง Michelin Finder ให้ 296 หน้า Top-N | ปานกลาง |
| 0.4 | **เติม decision-content**: อยุธยา vs-gap, "worth it" หน้าแรก ๆ, best-time รายจังหวัดหลัก | ตรง AI-citation/SEO thesis ของ v3 โดยตรง | เขียนคอนเทนต์ใหม่ |
| 0.5 | **Backfill `modifiedDate`** ให้ครบ (ตอนนี้ 21.5%) | ราคาถูก เพิ่มสัญญาณความสดให้ 78% ที่ขาด | สคริปต์ + ตรวจ |
| 0.6 | **ทำ newsletter ให้เก็บอีเมลจริง** (ขั้นต่ำ: Worker+KV เก็บไว้ก่อน ไม่ต้องรอ ESP) | ตอนนี้หลอกผู้ใช้ว่าสมัครสำเร็จ — ควรอย่างน้อยเก็บจริง | เล็ก-กลาง |
| 0.7 | **Klook batch 2-3** (ต่อจาก loop อัตโนมัติที่ทำ batch 1 แล้ว) | 3-5 เท่า conversion, ~1,000 ไฟล์เหลือ | ใหญ่ (ต่อเนื่อง) |

### 🟡 Tier 1 — รอเลข/สิทธิ์จาก owner (ถามครั้งเดียวคุ้มสุด)
| # | งาน | ผลกระทบ |
|---|---|---|
| 1.1 | **GetYourGuide partner ID** | ปลดล็อก 6,548 ไฟล์ — รอยรั่วใหญ่สุดของทั้งเว็บ |
| 1.2 | **GA4 measurement ID** | เปิดวัดผล 3 จุด — event tracking เขียนพร้อมหมดแล้ว |
| 1.3 | 12Go / Airalo / SafetyWing ID | เล็ก แต่ฟรีถ้าทำพร้อมกัน |
| 1.4 | Search Console verify | ให้ถูก crawl/cite จริง |
| 1.5 | เลือก ESP จริง (ถ้าจะอัปเกรดจาก stopgap ข้อ 0.6) | retention loop เต็มรูปแบบ |

### 🔵 Tier 2 — งานใหญ่ต่อเนื่อง (ทำได้เลยแต่ทยอย)
- Image pipeline: jpg/png 14,170 ไฟล์ → webp/AVIF + `<picture>` (เริ่มหน้า traffic สูงก่อน)
- ขยาย decision-content ให้ครบทุกคู่จังหวัดท่องเที่ยวหลัก (ไม่ใช่แค่ปิด gap อยุธยา)
- Klook ให้ครบ 100% ทุกจังหวัด (ต่อจาก 0.7)

---

## 1.5 แก้ไขระหว่างทำ audit นี้ (ไม่ต้องรอ Tier ไหนเลย — ทำเสร็จในตัว)
- **Best of Thailand 2026 tentpole มี 0 monetization field** (agent เจอ — ตรวจสอบตรงว่าจริง ไม่มี stayHref/staycta/klook/agodaUrl เลยสักจุด ทั้งที่เพิ่ง build วันเดียวกัน) → **เติมแล้ว**: `rail` (hotel roundup กรุงเทพ/ภูเก็ต/เชียงใหม่) + `staycta` block (ลิงก์ Agoda ทั่วไทย cid=1965862) ทั้ง TH+EN, ยัง build-test ไม่เสร็จตอนเขียนไฟล์นี้ — ดูสถานะ build ก่อน commit
- **2 data bug จากสุ่มตรวจ 213 hotel entries** — verify ด้วย WebSearch จริงแล้ว:
  - **(1) แก้แล้ว** — `top10-chao-lao-beach-hotels-chanthaburi.json` (TH+EN) Seashell Village Resort: `tripUrl` เคยซ้ำกับ `agodaUrl` (ปุ่ม "Trip.com" พาไป Agoda) → verify ยืนยัน Agoda+Booking ถูกต้องอยู่แล้ว แต่หา Trip.com hotel-detail เฉพาะไม่เจอจริง → เปลี่ยนเป็น city-search fallback (`city=36043&keyword=Seashell...`) ซึ่งเป็น pattern จริงที่ไฟล์เดียวกันใช้อยู่แล้วกับโรงแรมอื่น (ไม่ได้กุ URL ใหม่)
  - **(2) ยังไม่แก้ — ต้องตัดสินใจ template ก่อน** — `top10-hotels-kamphaeng-phet.json` Wanalee Resort: verify แล้วว่า**ไม่มีอยู่บน Agoda/Booking/Trip จริง** (รีสอร์ท 11 บังกะโล จองผ่านโทร/ไลน์เท่านั้น) — ปัญหาคือปุ่ม "Agoda/Booking.com/Trip.com" label ทั้ง 3 ปุ่ม hardcode ไว้ใน RoundupLayout ไม่ได้ผูกกับข้อมูลจริง จะแก้ให้ถูกต้อง (เช่น โชว์ "จองตรงกับรีสอร์ท" แทน) ต้องแก้ template ที่กระทบทุกโรงแรมอื่นด้วย — ควรสำรวจก่อนว่ามีโรงแรมแบบนี้ (ไม่มี OTA) กี่แห่งทั่วเว็บ แล้วค่อยตัดสินใจว่าจะทำ template variant ใหม่หรือไม่

## 2. ข้อแก้ไขข้อมูลเก่า (agent บางตัวรายงานผิดเพราะอ่าน doc เก่า)
- **EEAT/บรรณาธิการ**: 2 agent อ้างว่ายัง "Organization" ทั่วเว็บ — **ผิด**, Doctor Chat Person schema+byline+รูปจริง live แล้วตั้งแต่ deploy `6f9cc417` ก่อนหน้านี้ในวันเดียวกัน
- **Answer-block**: ทำไปแล้ว Wave 1★ (~600 หน้า derive จาก layout)
- **Tentpole**: Best of Thailand 2026 live แล้ว (deploy `7a1c77c6`)
- บทเรียน: เอกสาร plan (v3 ฯลฯ) นิ่ง แต่ production เปลี่ยนเร็วกว่า — **เชื่อของจริงบน production/ ตรวจ git log ก่อนเชื่อ doc เสมอ**

## 3. Housekeeping ที่พบระหว่าง audit
- 2 worktree ค้าง (`agent-a4884a55b9209cca3`, `agent-a91770859d1c57f5a`) มีไฟล์ EN twin ร่าง (loei, lamphun) ที่ **ต่างจากเวอร์ชันที่ deploy ไปแล้วจริง** (คนละดราฟต์คุณภาพใกล้กัน ไม่ใช่ dup) — ยังไม่ลบ ต้องถาม owner ก่อน (ตามกฎ ask-before-destructive)

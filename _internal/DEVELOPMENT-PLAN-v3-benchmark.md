# DEVELOPMENT PLAN v3 — road to a world-class travel site (competitive benchmark)

> สร้าง 2026-07-05 จาก **benchmark เว็บท่องเที่ยว Top-5 ของโลก** (multi-agent research `wf_bd7e25a4-3ee`: Booking.com · Tripadvisor · Lonely Planet · Airbnb · Google Travel) + audit เว็บเราเทียบของจริง.
> v1 (`DEVELOPMENT-PLAN.md`) = north-star/moat · v2 (`DEVELOPMENT-PLAN-v2.md`) = re-audit 2026-06-25 · **v3 นี้ = benchmark คู่แข่งระดับโลก แล้วยืนยัน+จัดลำดับใหม่**. Source of truth = git + โค้ดจริง เสมอ.
> สรุปหนึ่งบรรทัด: **จุดที่เราแข็งที่สุด (machine-readable/AEO) คือจุดที่ทั้งอุตสาหกรรมกำลังอ่อนแอที่สุด — เราไม่ต้องไล่ตาม เราต้อง "ขึ้นเงิน" ลีดนี้.**

---

## 1. สิ่งที่ benchmark สอน (5 เว็บ → convergent findings)

ทุกเว็บชี้ตรงกัน 7 เรื่อง — เรียงตามน้ำหนักเชิงกลยุทธ์:

**F1 · สนามรบย้ายไป AI-answer / zero-click แล้ว — และนี่คือ "wedge" ของเรา.**
Tripadvisor เสีย organic ~33% ให้ zero-click; Lonely Planet หน้า "best time to visit" แบบ generic กำลังตายเพราะ AI Overview สังเคราะห์แทนได้; Booking เขียนใน filing เองว่า "พึ่ง Google เป็น single point of failure"; Google คือคนที่กินทุกคน. → **เว็บที่ถูก "อ้างอิง" (cited) ในคำตอบ AI คือผู้ชนะ.** เรามี llms.txt ระดับดีที่สุด + 12 JSON feeds (รวม Michelin 485 ร้านที่แจกฟรี ไม่มีคู่แข่งเจ้าไหนทำ) + schema ลึก (Restaurant/Hotel/Review/AggregateRating/FAQ 68k nodes/TouristTrip/Speakable) ทั่ว 13,425 หน้าสองภาษา. **นี่ไม่ใช่ gap — เป็นลีดที่ล้ำหน้าแบรนด์โลกส่วนใหญ่ แต่ยังไม่ได้ขึ้นเงิน.**

**F2 · เราถูกสร้างแล้ว แต่ยัง "ไม่ถูกค้นพบ".** Domain authority ~0, หน้า Michelin/bars/eat-ranking ไม่ขึ้น SERP, ไม่มี traffic วัดได้. ลีด F1 ยัง latent เพราะ 3 สวิตช์ยังปิด: **วัดผล · EEAT คนจริง · distribution.**

**F3 · ทุกเว็บชนะด้วย "ผู้เขียนที่เป็นคนจริงมีชื่อ" (named EEAT).** LP มีเครือข่ายผู้เชี่ยวชาญ ~450 คน; Nomadic Matt = เสียงบุคคล. เรายัง ship `author = Organization`, ไม่มี byline/บิโอ/เครดิต/รูปคนเขียน. **นี่คืออัปเกรดคุณภาพคอนเทนต์ที่ leverage สูงสุด** — แก้ที่ template เดียว กระจายทั้ง 13,425 หน้า.

**F4 · ทุกเว็บ monetize "ที่จุดตัดสินใจ".** Booking gate ปุ่มจองไว้ตรงจุด, Tripadvisor ฝัง Viator ในหน้า, และแม้แต่ LP ยังยอมรับว่า affiliate คือ "ช่องทางที่ใช้ต่ำกว่าศักยภาพที่สุด". เราทำ per-card CTA แล้ว → ต่อยอดให้ครบทุก entity + ราคา all-in ซื่อสัตย์ + คอนเทนต์ "คุ้มไหม/X vs Y".

**F5 · Trust คือจุดที่คู่แข่งอ่อน — เราต้อง "นำ".** Booking โดนปรับ €413M ฐาน dark patterns ('เหลือห้องเดียว!'); Tripadvisor ยอมรับรีวิวปลอม ~8%; LP เคยฉาว "นักเขียนไม่เคยไปจริง". **เราชนะได้ด้วยความซื่อสัตย์ที่พิสูจน์ได้** — badge อันดับ, badge เรตแหล่งจริง (Agoda 9.1/Google 4.6/Wongnai), หน้า "จัดอันดับยังไง", วันที่ verify, บรรณาธิการมีชื่อ. **ห้ามลอก dark pattern ที่ทำให้ Booking โดนปรับ.**

**F6 · Retention loop หายไป.** การตัดสินใจจอง = หลาย session; ไม่มี email = visit เดียวจบทุกครั้ง. Booking ใช้ Genius (สถานะถาวร) ล็อกคน; เราใช้ 🔖 saved-list + newsletter เป็น analog เบา ๆ.

**F7 · Discovery UX + scale.** Booking = faceted filter ลึก; Airbnb = photography-first + category browse + design system; ทุกเจ้ามี **annual tentpole** (Best in Travel / Travelers' Choice) เพื่อ backlink+PR+refresh moat — ซึ่งเราพิสูจน์แล้วด้วยไลน์ Michelin 2026/2027.

## 2. จุดยืน (positioning — ยืนยันจาก audit)

> เราไม่ชนะ Booking ด้วยจำนวนห้อง, ไม่ชนะ Tripadvisor ด้วย UGC, ไม่ชนะ Lonely Planet ด้วยแบรนด์. **เราชนะด้วยการเป็น "แหล่งคำตอบเรื่องเมืองไทยที่ machine-readable + ซื่อสัตย์ + มีโครงสร้างลึกที่สุดในยุค AI-search"** — เว็บที่ ChatGPT/Perplexity/Gemini "อ้างอิง" เวลามีคนถามว่า "เที่ยว/กิน/พักที่ไหนในไทย". Wedge ที่ชนะได้ = "ไกด์เมืองไทยฉบับสมบูรณ์ที่สุด สองภาษา สร้างเพื่อทั้งคนและ answer-engine" โดยมี Michelin + 50 Best Bars เป็น hook อำนาจสูง.

## 3. Roadmap — จัดลำดับตาม ROI แล้ว sequencing สำคัญ

**หลักการ sequencing:** เปิดไฟก่อน (วัดผล) → สร้างฐานความน่าเชื่อ (EEAT+trust) → ขึ้นเงินลีด AI → แปลง+รั้งคน → ขยาย discovery. ทำสลับลำดับ = ตัดสินใจแบบตาบอด.

เกณฑ์: **I**mpact / **E**ffort / **$**revenue (1–5). 🔒 = ต้องรอ owner (ค่า/ตัวตน). ✅ = ทำได้เลยที่ template.

### Wave 0 — เปิดไฟ + ฐาน EEAT/Trust  *(quick wins, ปลดล็อกทุกอย่าง)*
| # | งาน | I/E/$ | สถานะ |
|---|-----|-------|-------|
| 0.1 | ใส่ GA4 ID จริง (3 จุด) + affiliate-click events | 5/1/4 | 🔒 รอ G- ID (task #5) |
| 0.2 | **บรรณาธิการมีชื่อจริง**: Person schema + `reviewedBy` + byline + หน้าบิโอ/เครดิต + รูป — แก้ template กระจาย 13,425 หน้า | 5/2/2 | 🔒 รอ owner ตัดสิน "ใครคือบรรณาธิการ" |
| 0.3 | บรรทัด "อัปเดตล่าสุด {dateModified}" + byline โผล่ให้คนเห็น (ข้อมูลมีใน schema แล้ว) | 4/1/1 | ✅ |
| 0.4 | Badge เรตจากแหล่งจริง (Agoda 9.1 / Google 4.6 / Wongnai) บนการ์ด — social proof ซื่อสัตย์ | 4/2/2 | ✅ (ต้องมีข้อมูลเรต) |
| 0.5 | Submit sitemap เข้า Google/Bing Search Console + internal-link/indexation pass | 5/2/3 | 🔒 ต้องเข้าถึง Search Console |

### Wave 1 — ขึ้นเงินลีด AI (AEO moat) *(wedge ของเรา)*
| # | งาน | I/E/$ | สถานะ |
|---|-----|-------|-------|
| 1.1 | **Answer block** นำทุกหน้ารีวิว/จัดอันดับ (พิก + อันดับ + เหตุผล 1 บรรทัด + ช่วงราคา) ให้ LLM ดึงไปอ้าง | 5/3/2 | ✅ (v2 พบ ~92% ยังไม่มี block นี้) |
| 1.2 | ต่อ schema: TouristTrip/TouristAttraction/LocalBusiness/Offer/Event/ItemList บน ranking, verify Review/AggregateRating/FAQ ครบ TH+EN | 4/3/1 | ✅ |
| 1.3 | Instrument เมตริกยุคใหม่: Search Console impressions/rich-result coverage/share-of-citation (ไม่ใช่แค่คลิก) | 4/2/2 | 🔒 หลัง 0.5 |
| 1.4 | **Backlink/PR จาก asset ที่เรามีเจ้าเดียว** — dataset Michelin 2026 JSON + feeds; pitch สื่ออาหาร/ท่องเที่ยวไทย + หน้าอ้างอิง | 5/3/3 | 🔒 ต้อง outreach (owner) |

### Wave 2 — แปลง + รั้งคน (monetize + retention)
| # | งาน | I/E/$ | สถานะ |
|---|-----|-------|-------|
| 2.1 | Affiliate CTA ที่จุดตัดสินใจ **ทุก entity**: per-card check-price + sticky rail + Klook/GYG module ทุกหน้า attraction+resto + reservation link | 4/3/5 | 🔒 รอ affiliate IDs (task #6) |
| 2.2 | Email capture (newsletter Michelin-updates/trip-tips) — owned channel, ดัน conversion หลาย session | 4/2/3 | 🔒 รอ ESP (task #7) |
| 2.3 | ราคา all-in ซื่อสัตย์ + คอนเทนต์ intent ที่ OTA ไม่ตอบ ("คุ้มไหม", "X vs Y", "ย่านไหนเหมาะครอบครัว") | 4/3/3 | ✅ |
| 2.4 | 🔖 saved-list loyalty loop (Genius analog เบา ๆ, ไม่ต้อง account/ส่วนลด) | 3/3/2 | ✅ (มี primitive แล้ว) |

### Wave 3 — Discovery UX + scale (จับความ polish ของยักษ์)
| # | งาน | I/E/$ | สถานะ |
|---|-----|-------|-------|
| 3.1 | Faceted filter บน roundup (งบ/ย่าน/ประเภททริป/อาหาร) — filter depth แบบ Booking | 4/4/3 | ✅ |
| 3.2 | Header search เด่นทุกหน้า (search.html มีแล้ว แต่ under-surfaced) | 3/2/2 | ✅ |
| 3.3 | Programmatic long-tail จาก feeds: '{อาหาร} ใกล้ {landmark}', '{ประเภทที่พัก} ใน {ย่าน}' TH+EN | 4/4/3 | ✅ |
| 3.4 | Category/inspiration browse layer (ริมทะเล/รูฟท็อป/วันฝนตก/Michelin/สตรีทฟู้ด) — จับ top-of-funnel | 3/3/2 | ✅ |
| 3.5 | Design system เล็กใน Astro (card/badge/price-row/gallery/sticky-CTA) — ให้ทีมเล็ก scale ได้สวยคงเส้น | 3/3/1 | ✅ |
| 3.6 | **Annual tentpole "Best of Thailand [ปี]"** สองภาษา + embeddable badge — backlink/PR/refresh moat | 4/3/3 | ✅ (พิสูจน์แล้วกับ Michelin) |
| 3.7 | UGC เบา ๆ: ส่งรูป/"เคยไปไหม" บนหน้าเรือธง — freshness ไม่มี liability รีวิวปลอม | 3/4/1 | ✅ |

## 4. ต้องการจาก owner (ปลดล็อก Wave 0–2)
1. **GA4 measurement ID (G-...)** → ใส่ 3 จุดทันที (0.1)
2. **"ใครคือบรรณาธิการ"** — ชื่อ/บิโอ/เครดิต/รูป สำหรับ Person schema + byline (0.2) — leverage สูงสุด
3. **Search Console access** (verify domain) → submit sitemap + วัด impression/citation (0.5, 1.3)
4. **Affiliate IDs** (GetYourGuide/12Go/Airalo/Klook) + **ESP** สำหรับ newsletter (2.1, 2.2)

## 5. ทำได้เลยทันที (ไม่รอ owner — เริ่มจากตรงนี้ได้)
0.3 วันที่อัปเดต+byline · 1.1 answer block · 1.2 ต่อ schema · 2.3 คอนเทนต์ "คุ้มไหม/vs" · 3.2 header search · 3.5 design system · 3.6 tentpole "Best of Thailand"

> อ้างอิงงานวิจัยดิบ: `tasks/wvr17xdcx.output` (6 agents, 248k tokens, 67 web fetch/search). รายงานภาพ = Artifact "world-class-roadmap".

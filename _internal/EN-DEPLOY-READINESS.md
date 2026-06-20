# 🚀 EN SITE — DEPLOY READINESS (พักงาน 2026-06-20)

> เว็บภาษาอังกฤษ (EN) **เสร็จครบทั้งเว็บ** พร้อมขึ้น production · ทุกอย่าง commit+push แล้ว (HEAD `d4f91625`)
> เอกสารนี้ = สิ่งที่ทีม deploy ต้องรู้ก่อนย้ายขึ้นเว็บจริง

## สถานะ
| | TH | EN | อื่น |
|---|--:|--:|--:|
| Content (articles+reviews+roundups) | 5,368 | 5,368 | 0 |
| Hub/static pages | 104 | 103 | 0 |
| **รวม** | **5,472** | **5,471** | **0** |

- ต่างกัน 1 หน้า = `font-compare.html` (หน้า dev เทียบฟอนต์ ไม่ใช่หน้าผู้ใช้ — ตั้งใจไม่ทำ EN)
- ทุกหน้า EN ผ่าน: **ZERO Thai** (ยกเว้น ฿) · JSON valid · structure/รูปเหมือน TH · canonical+hreflang /en/
- **build-test ล่าสุด: BUILD OK — 10,736 pages**

## โครงสร้าง URL (ยืนยันแล้วว่า build ออกถูก)
- TH: root — `/<slug>.html`, `/city-*.html`, `/country-thailand.html`, `/` (index)
- EN: ใต้ `/en/` — `/en/<slug>.html` (content via `astro/src/pages/en/[slug].astro`) + `/en/city-*.html`, `/en/country-thailand.html`, `/en/`, `/en/about.html` ฯลฯ (static hubs จาก `astro/public/en/`)
- `astro.config`: `format:'file'` + `trailingSlash:'never'` → flat `.html`, clean URL
- ลิงก์ภายในหน้า EN เป็น **relative** → resolve ใต้ `/en/` อัตโนมัติ (เช่น `city-chiang-mai.html` จาก `/en/` → `/en/city-chiang-mai.html`)

## Build & deploy (ไม่เปลี่ยนจากเดิม)
- Cloudflare อ่าน `astro/dist` · build = `cd astro && npm install && npm run build` (ตั้ง heap 8GB ใน package.json แล้ว)
- `astro/public/**` (รวม `public/en/**`) ถูก copy ตรงไป `dist/` ตอน build → EN hubs + รูป ไปกับ dist อัตโนมัติ
- **ไม่ต้องรัน gen-hubs ตอน deploy** — ไฟล์ hub HTML commit ไว้ใน repo แล้ว (เป็น source ของ `public/`)

## ✅ Pre-deploy checklist
- [ ] sitemap: ถ้ามี ต้องเพิ่ม URL `/en/*` (ตรวจว่า generator/Astro integration ครอบ /en/ ด้วย)
- [ ] `_redirects` / `_headers` ใน `public/`: ตรวจว่าไม่ block `/en/` · พิจารณา redirect ภาษา (Accept-Language) ถ้าต้องการ (optional)
- [ ] 404: EN มี `/en/404.html` แล้ว — ตรวจ Cloudflare ว่าเสิร์ฟ 404 ต่อ path /en/ ถูก (หรือใช้ root 404)
- [ ] robots.txt: อนุญาต /en/ ให้ index
- [ ] หลัง deploy: สุ่มเปิด `/en/`, `/en/city-chiang-mai.html`, `/en/review-*.html`, `/en/top10-hotels-*.html`, `/en/about.html` — เช็ก hreflang + ปุ่มสลับ TH⇄EN + รูปโหลด

## ⚠️ ถ้าจะแก้เนื้อหา/เพิ่มเมืองภายหลัง
- เพิ่ม/แก้ content: แก้ JSON ใน `articles-en/`, `reviews-en/`, `roundups-en/` (โครง/คีย์ตาม TH · ห้ามมีไทยใน field ที่ผู้ใช้เห็น)
- re-gen hubs: `node _internal/gen-hubs.mjs` — **ต้องมี `province-data-en/` ครบ 89** ไม่งั้น neighbor cards โชว์ไทย
- เพิ่มจังหวัด/เมืองใหม่: เพิ่มชื่อ EN ใน `EN_NAME` map (ใน `gen-hubs.mjs`) + สร้าง `province-data-en/<slug>.json`
- ตรวจ ZERO Thai ก่อน push เสมอ: `node -e '...regex /[ก-๛]/...'` (ยกเว้น ฿)

## งานถัดไป (ยังไม่เริ่ม)
- i18n Tier-1 อีก 7 ภาษา: zh · ru · ko · ja · he · ar · hi (he/ar = RTL) — ยัง 0 หน้า · แผน `_internal/I18N-AND-TOURISM-CITY-PLAN.md`

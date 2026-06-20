> 📋 **อัปเดต 2026-06-21:** มี gap-analysis ฉบับ verify จริงแล้วที่ `_internal/DEVELOPMENT-PLAN.md` (8-lens audit · 87 ช่องว่าง · roadmap Now/Next/Later) — ใช้อันนั้นเป็นแผนหลัก · ไฟล์นี้คือบริบทเดิม

# 💸 NEXT PHASE — Monetization & Essential Content (handoff for a fresh session)

> เว็บ EN เสร็จครบ + deploy-ready แล้ว (ดู `_internal/EN-DEPLOY-READINESS.md`). เฟสต่อไป = **ทำเงิน + อุดช่องว่างคอนเทนต์** เพื่อยกระดับเป็นเว็บท่องเที่ยวไทยระดับโลก
> อ่านไฟล์นี้ก่อนเริ่ม · ทำตามมาตรฐาน LOCKED ใน `CLAUDE.md` ทุกอย่าง

---

## ✅ ทำอะไรไปแล้ว (สถานะ ณ ส่งมอบ · HEAD ดูจาก git log)
- **EN ครบทั้งเว็บ:** articles-en 3,214 · reviews-en 1,939 · roundups-en 215 (ZERO Thai) + hub `/en/` (homepage·city·region·country·destinations·about/contact/policy/404)
- **หน้าแรก:** แผนที่ 77 จังหวัด (Leaflet + markercluster, region-coloured) + สถิติ auto จาก content (`_internal/gen-home.mjs` ผูก astro prebuild)
- **SEO:** sitemap.xml (TH+EN+hreflang) · per-page og:image (hub + บทความ) · canonical/hreflang ครบ · welcome AI bots ใน robots.txt
- **ความถูกต้องรูป:** แก้ root cause "306 รูปหาย" (= อ้าง reference ผิด ไม่ใช่ไฟล์หาย) · remap/sync/canonicalize · แก้ 9 โรงแรมรูปผิดตัว (fetch รูปจริง verified) → 54,007 image refs · 0 missing · EN↔TH parity perfect
- ทุกอย่าง commit + push · build OK (10,736 pages) · ดู memory `image-reference-not-missing-files`, `en-reviews-roundups-translation`

## 🏗️ Architecture quick-ref
- Astro static · content collections `articles/reviews/roundups` (+`-en`) = ไฟล์ JSON ต่อ entry · layouts `ArticleLayout/ReviewLayout/RoundupLayout.astro` render ทั้ง TH (`/slug`) + EN (`/en/slug`)
- **บทความ = `ArticleLayout`** render จาก `blocks[]` (flexible: p/h2/list/tip/image/restaurant/staycta/foodexp/cta…) — เพิ่ม block ใหม่ได้
- hub: `_internal/gen-hubs.mjs` (locale-aware) · build/deploy: `cd astro && npm install && npm run build` (Cloudflare อ่าน `astro/dist`) · pre-push: `bash _internal/build-test.sh` (ต้อง BUILD OK)
- Node v24 ที่ `~/nodejs` (bash: `export PATH="$HOME/nodejs:$PATH"` ก่อน) · Python ใช้ไม่ได้
- git: branch `main` · `git fetch && git rebase origin/main` ก่อน push เสมอ · commit เป็นกลุ่มงาน

## 💰 Affiliate IDs — สถานะ
| partner | ID | สถานะ |
|---|---|---|
| Agoda | `cid=1965862` | ✅ ใช้อยู่ (13k จุด) |
| Trip.com | `Allianceid=6861268&SID=312919111` | ✅ ใช้อยู่ (15k จุด) |
| **Klook** | `aid=121442` | ⚠️ **มี ID แล้วแต่ฝังแค่ ~5 จุด** — โอกาสใหญ่ |
| GetYourGuide | — | ❌ ต้องสมัคร partner (เจ้าของทำ) |
| 12Go Asia | — | ❌ ต้องสมัคร affiliate (เจ้าของทำ) |
| Airalo/Saily (eSIM) | — | ❌ ต้องสมัคร |
| SafetyWing/Heymondo (ประกัน) | — | ❌ ต้องสมัคร |

> **โครงรับ affiliate ใหม่:** ใช้ตัวแปร/placeholder `__GYG_PARTNER_ID__`, `__12GO_AID__`, `__AIRALO_REF__`, `__SAFETYWING_REF__` ในลิงก์ แล้ว find-replace ทีเดียวเมื่อเจ้าของให้ ID มา (อย่า hardcode มั่ว · อย่าแต่ง ID ปลอม)

---

## 🎯 4 งานเฟสนี้ (เรียงตาม ROI/เร็ว)

### งาน 0 (ทำก่อน): 🗺️ Visual Roadmap (phase / impact / effort / ROI)
สร้าง visual (ใช้ show_widget) สรุป roadmap ทั้ง 3 งานล่าง + กลุ่มงานอนาคต (neighborhood/comparison/site-search/eSIM/insurance/flights/display-ads/email) เป็นตาราง phase × impact × effort × revenue เพื่อให้เจ้าของตัดสินใจลำดับ · บันทึกสรุปเป็นข้อความด้วย

### งาน 1: 💸 ฝัง Klook / GetYourGuide ในบทความ "ที่เที่ยว" ที่มีอยู่ (เงินเร็วสุด — ใช้ของที่มี)
- เป้า: **บทความ type `attraction` (1,051) + `itinerary` (1,086) + `eat-ranking`/`food` (cooking class/food tour)** — ฝัง "experience/tour ที่จองได้"
- **Klook = ฝังได้เลย** (มี `aid=121442`) · GetYourGuide = ใส่ placeholder `__GYG_PARTNER_ID__` ไว้ก่อน
- วิธี: เพิ่ม block ใหม่ใน `ArticleLayout` เช่น `kind:'experiences'` (การ์ดทัวร์/กิจกรรม + ปุ่มจอง Klook/GYG) · ฝัง contextual (เช่น บทความ "เกาะพีพี" → ทัวร์เรือ Phi Phi บน Klook) · **ห้ามแต่ง URL ทัวร์มั่ว** — ลิงก์ search/หมวดที่ตรงจริง (`klook.com/...?aid=121442`) หรือกิจกรรมที่มีจริง
- ทำ TH + EN เหมือนกัน · honest (ไม่อวย) · build-test ก่อน push
- (ต่อยอด: roundup "10 ทัวร์/กิจกรรม <เมือง>" แบบเดียวกับ roundup โรงแรม)

### งาน 2: 📘 ชุดคู่มือ Essential (evergreen + AEO + affiliate ต่อหน้า)
สร้างบทความใหม่ (collection `articles` + `articles-en`) ~10-15 หน้า ตามมาตรฐานเขียน v2-clean / EN เนทีฟ zero-Thai:
- visa & entry (by nationality) · **eSIM/อินเทอร์เน็ตไทย** (→ Airalo/Saily placeholder) · **getting around Thailand** (→ 12Go) · best time to visit + อากาศรายเดือน · budget/ค่าใช้จ่ายต่อวัน · safety & scams · money/ATM/tipping · **ประกันเดินทาง** (→ SafetyWing) · packing · Thai phrases · etiquette/culture
- **AEO:** ขึ้นต้นด้วยคำตอบกระชับ 40-60 คำ · ตารางเปรียบเทียบ · FAQ schema (layout มี faq อยู่แล้ว) · "best X for Y"
- เพิ่ม hub/nav ให้เข้าถึง (อาจทำหมวด "Plan Your Trip" / "Thailand Travel Guide")

### งาน 3: 🚌 12Go Transport content (pain point #1 ของฝรั่ง)
- คู่มือเดินทาง: เมือง→เมือง (กรุงเทพ↔เชียงใหม่/ภูเก็ต/กระบี่…) · เรือไปเกาะ · รถไฟ/บัส/รถตู้ · สนามบิน→เมือง · BTS/MRT · Grab vs แท็กซี่ · เช่ามอเตอร์ไซค์
- ฝังปุ่มจอง **12Go** (placeholder `__12GO_AID__`) · AEO: "How to get from X to Y" = คำถามยอดฮิตที่ AI ถูกถาม
- เชื่อมโยง (interlink) กับ city hub + Essential getting-around

---

## 📏 กฎคุณภาพ (LOCKED — ห้ามพลาด)
- โทน v2-clean เพื่อนเล่าให้เพื่อน · honest/EEAT · ห้ามคำ AI clichés (TH: ตอบโจทย์/โดดเด่น/ครบครัน · EN: world-class/nestled/boasts/hidden gem/breathtaking เกร่อ)
- **EN ต้อง mirror TH เป๊ะ:** โครงสร้าง/คีย์/รูป/ลิงก์เหมือนกัน · ZERO Thai ใน EN (ยกเว้น ฿) · ตรวจ `/[ก-๛]/` ก่อน push
- ⛔ ห้ามแต่งข้อมูล/ราคา/สถานที่/URL affiliate มั่ว · ลิงก์ต้องไปที่จริง · ID ที่ยังไม่มี → placeholder
- design system Direction-C เดิม (teal/coral/mango · Outfit/Sarabun) · 1 h1/หน้า · schema/canonical/hreflang ครบ
- **เสมอ:** `bash _internal/build-test.sh` ต้อง BUILD OK → `git rebase origin/main` → push · ตรวจ 0 missing image, 0 Thai leak
- ใช้ workflow/parallel agents ได้ (มี pattern ใน `_internal/wf/`) สำหรับงาน batch เยอะ

## ⏭️ งานอนาคต (เฟสถัด ๆ — ใน Gap Analysis)
neighborhood "พักย่านไหน" · comparison ("Phuket vs Krabi") · site search + filter · trip-planner tool · flights (WayAway) · car rental (DiscoverCars) · display ads (Mediavine เมื่อทราฟฟิกถึง) · email funnel · 7 ภาษาที่เหลือ (zh/ru/ko/ja/he/ar/hi)

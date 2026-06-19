# 🚦 ACTIVE WORK CLAIMS — กันงานซ้ำระหว่าง session/เพื่อนร่วมงาน

> เปิดไฟล์นี้ก่อนเริ่มงานใหญ่ทุกครั้ง · ถ้างานที่จะทำมีคน claim อยู่ (ยัง ACTIVE) → ไปทำอย่างอื่น
> claim = แก้ไฟล์นี้ + commit + push ทันที (ก่อนเริ่มจริง) เพื่อให้ rebase ของคนอื่นเห็น
> เสร็จแล้วเปลี่ยนสถานะเป็น ✅ DONE หรือลบรายการออก

---

## 🟢 ACTIVE

### EN translation: reviews-en + roundups-en  — claimed 2026-06-19
- **Owner:** session 292fd849 (Opus · owner เครื่องหลัก)
- **Scope:** แปล `astro/src/content/reviews/*.json` → `reviews-en/` (ขาด 868 ไฟล์ · 38 clusters) + `roundups/*.json` → `roundups-en/` (ขาด 125 ไฟล์)
- **Files touched:** เฉพาะ `astro/src/content/reviews-en/*.json`, `astro/src/content/roundups-en/*.json`, `_internal/wf/translate-reviews-en.js`, `_internal/wf/translate-roundups-en.js`, `_internal/en-check-reviews.mjs`, `_internal/en-rev-missing.json`
- **⚠️ เพื่อนร่วมงาน:** อย่าแตะ `reviews-en/` หรือ `roundups-en/` จนกว่าจะ ✅ DONE · งาน QA TH reviews (`qa(phase-a)`) ทำต่อได้ตามปกติ (คนละไฟล์ — แก้ `reviews/` ไม่ใช่ `reviews-en/`)
- **Status:** กำลังแปลเป็น batch (Opus parallel) → verify ต่อ cluster → commit → push

---

## ✅ DONE
- EN translation: **articles-en ครบ 3,213/3,213** (pushed bc88d028) — บทความทั้งหมดแปลครบแล้ว

# 📋 สรุปโปรเจกต์ thailandaddict.com (handoff)

> สร้าง 3 มิ.ย. 2026 · ใช้ส่งต่อเปิดเซสชัน/โฟลเดอร์ใหม่ · วางไฟล์นี้ในโฟลเดอร์ repo ใหม่แล้วให้ Claude อ่านก่อนเริ่ม

## บริบท: portfolio 3 เว็บของ owner (คนไทย)
| เว็บ | stack | เนื้อหา | สถานะ |
|---|---|---|---|
| **wherebest.com** | Astro · TH+EN | ท่องเที่ยว+โรงแรม ทั่วโลก | flagship ปัจจุบัน ~4,800 หน้า · build หนัก |
| **topofhotel.com** | Astro · TH | รีวิวโรงแรมทั่วโลก | เก่ากว่า (2017) · 506+ บทความ · affiliate Agoda+Trip |
| **thailandaddict.com** | WordPress · TH | ท่องเที่ยวไทย | เก่าสุด · 212 posts · 2019-2020 outdated |

## 🎯 การตัดสินใจ (3 มิ.ย. 2026)
- **ไม่ยุบ thailandaddict** — แยกเป็น **แบรนด์เที่ยวไทยเฉพาะทาง** ใน **repo + โฟลเดอร์ใหม่** (เริ่มสดใหม่)
- เหตุผล: คนไทยทำแบรนด์เที่ยวไทย monetize ดีกว่า — **สปอนเซอร์ท้องถิ่น/ททท. + affiliate + ตัวตน/EEAT + topical authority + ตลาด EN ฝรั่งเที่ยวไทย**
- **ยกเลิก**แผนเดิมที่จะ migrate thailandaddict → wherebest (โมเดล WhereTaiwan 301) — ทำไปแล้วถอนแล้ว

## 📊 Inventory thailandaddict (ดึงจริงผ่าน WP REST API)
- **212 posts published** (~198 เนื้อหาไทยจริง + ~14 demo junk ปี 2016 ของธีม) · 48 pages · 173 categories · 4,784 tags · 25 products
- ชนิด: โรงแรม ~118 · ที่เที่ยว ~40 · อาหาร ~28 · กระจาย ~37 จังหวัด (เด่น: เชียงใหม่ 25 · ชลบุรี/พัทยา 24 · ตราด 11 · ระยอง/ประจวบ/จันทบุรี 10)
- จุดเด่น = **sub-destination ที่ wherebest ไม่มี**: เกาะช้าง/กูด/เสม็ด/ล้าน · เขาใหญ่/เขาค้อ · โรงแรมติด BTS/MRT
- ดึง inventory ใหม่: `curl "https://thailandaddict.com/wp-json/wp/v2/posts?per_page=100&page=N&_fields=id,slug,date,title,categories,link"` (3 หน้า) · header `X-WP-Total` = จำนวนจริง (sitemap นับเกิน = 300 เพราะรวม noindex)

## 🛠 แผน repo ใหม่ (ยังไม่เริ่ม)
1. สร้าง repo GitHub ใหม่ + clone **นอก Google Drive** (เช่น `C:\Users\Imac\thailandaddict`)
2. **Scaffold Astro stack จาก wherebest** (reuse layout/CSS/content-collection/build-test.sh/wrangler) → rebrand thailandaddict
3. ดึง 212 posts เป็น topic list → เขียนใหม่สไตล์ v2-clean (เอาแค่หัวข้อ · verify โรงแรมจริง · รูป Trip.com)
4. Cloudflare auto-deploy สูตรเดียวกับ wherebest: build `cd astro && npm install && npm run build` · output `astro/dist`

## 🔑 มาตรฐานที่ยกมาจาก wherebest (ใช้ซ้ำได้)
- **โทน v2-clean** (LOCKED): เพื่อนเล่าให้เพื่อน · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก · honesty "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง
- **affiliate:** Agoda `cid=1965862` · Trip.com `Allianceid=6861268&SID=312919111` · Klook `aid=121442`
- **SEO:** clean URL non-www · canonical/og/hreflang · JSON-LD · 1 h1 · self-host รูป
- **skills:** `tourlogy-city-content` · `tourlogy-city-roundup-checklist`
- **agents:** roundup-builder · hotel-reviewer · food-writer · attraction-writer (เขียน=Opus)

## ⚙️ Technical notes (เครื่องนี้ — C:\Users\Imac)
- **Node.js v24.16.0** ติดตั้งแล้ว `C:\Users\Imac\nodejs` (ใน PATH ถาวร) · npm 11.13.0
- **Python ใช้ไม่ได้** บนเครื่องนี้ → ใช้ **PowerShell** หรือ **Node** แทน
- build-test: build ใน temp dir นอก repo · ตั้ง `NODE_OPTIONS` heap ใหญ่ (เว็บโต >3000 หน้าเคย OOM)

## ✅ สถานะ wherebest repo (ปิดงานนี้แล้ว)
- ลบ artifact migration ทั้งหมด · เก็บหน้า **top5-luxury-5-star-hotels-chiang-mai** (TH+EN · live) เป็นเนื้อหา wherebest ถาวร (reuse รีวิวหรู CM 5 ตัว) — commit `b4d7e1d7`
- หน้านี้ยังไม่ wire เข้า city-chiang-mai (optional)
- 🔓 unresolved ระยะยาว: role-split 3 โดเมน + ไทยควรอยู่ wherebest หรือ thailandaddict (ต้องดู GSC traffic ก่อน) — บันทึกใน memory `domain-portfolio-strategy`

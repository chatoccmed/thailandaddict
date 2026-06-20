# 🍜 RESTAURANT-REVIEW (Top 10 ร้านอาหารต่อจังหวัด) — RESUME HANDOFF

> สรุปเพื่อขึ้นเซสชั่นใหม่ · อัปเดต 2026-06-20 · source of truth = git (อย่าเชื่อ doc ถ้าขัดของจริง)

## 🎯 งานนี้คืออะไร
content type ใหม่ตาม owner: **"10 ร้านอาหารยอดนิยมในจังหวัด<X>"** ทุกจังหวัด — รีวิว **≥200 คำ/ร้าน** (วิจัยจริงจาก Google/Wongnai/Facebook/YouTube), **รูปจริงของร้าน + เครดิตภาพ** (เว็บทางการ/เพจ FB/Wongnai/บล็อกอาหาร), **ลิงก์ไปหน้าโรงแรม** (รายได้หลัก = จองที่พัก). ใช้ articleSchema (type `eat-ranking`).

## ✅ สถานะ (2026-06-20): GOLD REFERENCE เชียงใหม่ "v3" สมบูรณ์ (committed `8b2075ee`, pushed) — รอ owner เคาะ "สเกลต่อ"
ไฟล์: `astro/src/content/articles/top10-popular-restaurants-chiang-mai.json` · 10 ร้านจริง ≥300 คำ · รูป 40 รูป (10×4) เครดิตครบ
**ฟีเจอร์ครบใน template (ฝังใน ArticleLayout + articleSchema, additive ไม่กระทบ 3,213 บทความเดิม):**
1. **คะแนน+จำนวนรีวิวจริง** ทุกร้าน (Google) → `rating/ratingCount/ratingSrc` + **AggregateRating JSON-LD** (ของจริง ไม่ปลอม)
2. **แกลเลอรี 4 รูป/ร้าน** (main + `gallery[3]`) กดสลับ thumbnail ได้ (JS in layout)
3. **ตัวกรอง 4 แกน** (client JS): ประเภท `foodType` / ย่าน `zone` / ราคา (derived จาก priceUsd) / 🥗veg+🕌halal toggle — AND-combine + นับผลสด + sync qnav (chip group conditional: โชว์เมื่อ data ≥2 ค่า)
4. **best-for** (`bestFor`) badge ต่อร้าน · **zone** tag
5. **แผนที่ Leaflet/OSM** + **ระยะร้านใกล้สุด** ใน popup (Haversine จาก lat/lng) · **ชั้นข้อมูลต่างชาติ** (hours/priceUsd/spice/halal/veg/englishMenu badges)
6. **กล่อง "รู้ก่อนไปกิน"** (`localtips` block: icon/title/text) · **บรรทัดความสด** (`🔄 ตรวจสอบล่าสุด <modifiedDate>`)
7. **sticky right rail** (เดสก์ท็อป ≥1025px): 🏨 hotel roundups + 🍢 foodexp (Klook) 2 ส่วน follow scroll, ไม่มี scrollbar · มือถือซ่อน rail → inline staycta/foodexp แทน
8. **foodexp** (Klook `aid=121442`) · **staycta** (Agoda) · **นโยบายลิขสิทธิ์+แจ้งลบ** ท้ายทุกบทความ (ลิงก์ contact.html, TH+EN)
- **⚠️ นโยบายรูป (owner เคาะ 2026-06-20):** ใช้รูป **ทุกแหล่ง + เครดิตทุกใบ + กล่องแจ้งลบ** (ลองนโยบาย "เฉพาะแหล่งทางการ" แล้ว — **ไม่เวิร์ก**: เพจ FB ร้านโพสต์อีเวนต์/โปรโมตไม่ใช่อาหาร, Google Maps ทำ Chrome extension ค้าง 300s, เว็บทางการมีแค่ ~2/10 ร้าน → รูปอาหารจริงอยู่บน Wongnai/รีวิว/บล็อก ใช้พร้อมเครดิต+แจ้งลบตามมาตรฐานเว็บท่องเที่ยว). engine RULES = "ทุกแหล่ง+เครดิต · ห้าม Trip.com/stock/รูปผิดร้าน"
- **⏸️ รอ owner เคาะ "สเกลต่อ"** — gold reference v3 สมบูรณ์ที่ `:4400` · **อย่าสเกลจนกว่า owner สั่ง**

## ⚙️ ก่อนสเกล: ต้อง WIRE ENGINE ให้ครบ v3 ก่อน (สำคัญ!)
engine `restaurants-roundup.js` ปัจจุบันมี: PLAN/WRITE(info fields:hours/priceUsd/spice/halal/veg/englishMenu/lat/lng)/FRAME(prose+foodTitle/foodText)/Assemble(restaurant+staycta+foodexp blocks, deterministic return). **ยังขาดสำหรับ v3:**
- WRITE_SCHEMA ยังไม่มี: `rating`/`ratingCount`/`ratingSrc` (วิจัย Google), `bestFor`, `zone`, `foodType` → ต้องเพิ่ม + ให้ write agent วิจัย
- ยังไม่ดึง **4 รูป/ร้าน** (ตอนนี้ดึง 1) + ยังไม่สร้าง `gallery` ใน restoBlock → ต้องเพิ่ม
- ยังไม่ใส่ **rail** (hotel roundups) ใน article + ยังไม่สร้าง **localtips** block → ต้องเพิ่ม (rail ใช้ heroImg ของ roundup จริง — main loop ส่ง list เข้า args)
- staycta/rail labels ยังดึงจาก h1 roundup (รก) → ให้ Frame agent เขียน label สั้นสวย (ดู `build-resto-args.mjs` draft + ปัญหาที่ note ไว้)
**แนะนำ:** wire engine ครบ → ทดสอบ Bangkok 1 จังหวัด (owner เลือกตอน lean, 7 roundup) → verify เทียบ CM → owner ดู → ค่อยสเกล 76 ที่เหลือ

## 🏗️ Infra (schema/layout — additive, ไม่กระทบ 3,213 บทความเดิม)
- `astro/src/content.config.ts` articleBlock เพิ่ม 3 ชนิด: **`image`** (รูป+เครดิต), **`restaurant`** (rich card: rank/name/area/cuisine/signature/priceRange/score/img/alt/credit/creditHref/descHtml/mustOrder/tags/mapHref/fbHref/**stayHref/stayLabel**), **`staycta`** (โมดูลจองที่พัก: title/text/img/links[]/ctaLabel/ctaHref)
- `astro/src/layouts/ArticleLayout.astro`: render ทั้ง 3 block + **immersive hero** (`isResto && heroImg` → full-bleed) + **sticky quick-nav** (`.qnav`) + CSS ทั้งหมด inline ใน `<style>` (เทียบ entry layout = `RoundupLayout.astro` บรรทัด ~477-533: `.entry-header`/`.entry-body`/`.entry-img-col`/`.entry-content-col`)
- **conversion → จองที่พัก:** ทุกการ์ดมีปุ่ม `stayHref`→roundup โรงแรมตามย่าน (นิมมาน→top10-nimman-budget-hotels-chiang-mai, เมืองเก่า→top10-boutique-, default→top10-popular-) + 1 โมดูล `staycta` กลางบทความ (หลังร้าน#5) ลิงก์ 4 roundup โรงแรม + ปุ่ม Agoda (`https://www.agoda.com/th-th/city/<city>-th.html?cid=1965862`) + end-cta→โรงแรม
- **engine สร้างจังหวัดใหม่ (REWRITTEN 2026-06-20):** `_internal/wf/restaurants-roundup.js` (Workflow) — 4 phase: Plan(10 ร้าน) → Write(10 agent ขนาน: วิจัย+เขียน≥200คำ+curl รูป+เครดิต+ส่ง priceRange/score/mustOrder/tags/hours/priceUsd/spice/halal/veg/englishMenu/**lat/lng**) → Frame(1 agent เขียน prose จังหวัด: title/h1/intro/chips/faq/tip/cta/staycta-text/foodexp-text) → **Assemble = deterministic JS** (สร้าง object เต็มเอง แล้ว `return` กลับมาให้ main loop เขียนไฟล์+verify ดิสก์ → เลี่ยง bug agent ลืม field/นับผิด/rename slug). **output blocks = restaurant + staycta + foodexp** (ไม่ใช่ h2+image+p เดิมแล้ว).
  - args contract: `{prov,city,slug,today, display?,hi? (สำหรับกรุงเทพ "กรุงเทพฯ"), region{label,href}, stayDefault{href,label}, stayMap[{match[],href,label}], stayCta{links[],ctaLabel,ctaHref}, related?}` · ดู defaults ในไฟล์
  - **⚠️ ENGINE ยังไม่ได้ wire `rail` + ยังไม่ได้ทำ label ของ staycta/rail ให้สวย** (ดู build-resto-args ด้านล่าง) — เลื่อนไว้จนกว่า owner อนุมัติ gold reference v2 แล้วค่อยทำ engine ให้ match
- **`_internal/wf/build-resto-args.mjs <city> [provTh] [regionKey]`** (DRAFT, untracked) — สร้าง args จาก roundup จริงบนดิสก์ (owner rule: ใช้เฉพาะที่มีจริง) · มี map จังหวัด→region/display · **ปัญหา: label ของ staycta/rail ดึงจาก h1 roundup ยาว/รก → ต้อง rework (ให้ Frame agent เขียน label สั้นสวย + เลือก rail cards + สร้าง stayMap) ก่อนสเกลจริง**

## ▶️ งานต่อไป (เริ่มเมื่อ owner สั่ง "สเกลต่อ")
0. **owner กำลังรีวิว gold reference v2 ที่ `:4400`** (dismissed คำถาม = wait). เมื่อ owner โอเค:
1. **WIRE ENGINE ให้ครบก่อนสเกล:** (a) ให้ Frame agent เขียน label สั้นสวยของ staycta links + เลือก/เขียน rail cards + สร้าง stayMap (area→roundup) จาก roundup list ที่ส่งเข้าไป · (b) build-resto-args ส่ง roundup list (slug+title+heroImg) เข้า args · (c) assembler ใส่ `rail` ใน object · (d) ทดสอบ 1 จังหวัดก่อน (Bangkok = owner เลือกตอน lean, 7 roundup) → verify เต็ม → owner ดู → ค่อยสเกลที่เหลือ
2. **สเกลทีละจังหวัด** (1 workflow/ครั้ง กัน socket error): `Workflow scriptPath restaurants-roundup.js args <จาก build-resto-args>` → verify: 10 ร้าน, ≥700 อักษรไทย/ร้าน, รูปจริง+เครดิต (sharp decode), lat/lng ≥3, stayHref/links resolve, keywords, lint=0 → build-test BUILD OK → copy public/images ไป dist + เช็ค preview → commit/push (pull --rebase ก่อน) → จังหวัดถัดไป
3. รูปร้านขาด→spawn image agent (เว็บทางการ/FB/Wongnai/บล็อก + เครดิต; **ห้าม Trip.com/stock/รูปผิดร้าน**) · sharp decode
4. เริ่มจากจังหวัดที่มี hotel roundup (Bangkok 7, Chonburi 14, Pattaya 10, Huahin 7, Prachuap 8, Krabi 4 ...) — `ls astro/src/content/roundups/|grep <city>`

## ⚠️ ข้อควรรู้ + บทเรียน (2026-06-20)
- ✅ ไฟล์ขยะ `_navfields.json` + `yenjit_page.html` = **ลบแล้ว** (owner อนุมัติ)
- **🐛 Astro scope `<style>` อัตโนมัติ** → element ที่สร้างตอน runtime (เช่นหมุด Leaflet `.rpin`, `.leaflet-popup-*`) **CSS ไม่ติด** ถ้าไม่ใช้ `:global(...)`. (bug นี้ทำหมุดแผนที่มองไม่เห็น เห็นแต่เลข — แก้แล้วด้วย :global) · ระวังทุกครั้งที่ style ของที่ JS สร้าง
- **🐛 astro dev OOM/ช้า/ค้างมากบนเว็บ 10k+ หน้า** — ใส่ `--max-old-space-size=8192` ใน `dev` script (package.json) แล้ว แต่ยัง boot ช้า ~3 นาที + ค้าง content-sync บ่อย (อย่า `rm -rf astro/.astro` ระหว่าง start → collections ว่าง). **ใช้ static preview แทน (instant, เสถียร):** `bash _internal/build-test.sh` → `node _internal/preview-server.mjs ~/ta-build-temp/dist 4400` (bg) → `:4400`. **ต้อง `cp -r astro/public/images/* ~/ta-build-temp/dist/images/`** ทุกครั้งหลัง build (build ข้าม public/ รูปเลยไม่มาเอง)
- **preview MCP `preview_screenshot` ค้าง (timeout)** เพราะรอ network-idle ของ OSM tiles/CDN → ใช้ **`preview_eval` ตรวจ computed style/DOM แทน** (เชื่อถือได้) · preview_start static-server แยกพอร์ต (เช่น 4401) แล้ว eval ได้
- **build gate:** `bash _internal/build-test.sh` ต้อง BUILD OK · keywords field required ใน article
- **มีอีก session ทำ EN translation ขนาน** — `git fetch && git rebase origin/main` ก่อน push ทุกครั้ง (clean: คนละไฟล์)
- **weekly usage limit** ชนเป็นระยะ → subagent/Workflow fail → รอ reset
- commit identity: `git -c user.name="chatoccmed" -c user.email="chatoccmed@users.noreply.github.com"`
- บริบทใหญ่: content migration **195/195 DONE** + QA phase 23/38 cluster (ดู `_internal/MASTER-HANDOFF.md`)
- ห้ามแก้ gen-hubs.mjs / public/index.html / CLAUDE.md · brand LOCKED = Vibrant Island Pop (teal #06B6D4 / coral #FB7185 / mango #FBBF24 + Outfit/Sarabun)

# 🍜 RESTAURANT-REVIEW (Top 10 ร้านอาหารต่อจังหวัด) — RESUME HANDOFF

> สรุปเพื่อขึ้นเซสชั่นใหม่ · อัปเดต 2026-06-20 · source of truth = git (อย่าเชื่อ doc ถ้าขัดของจริง)

## 🎯 งานนี้คืออะไร
content type ใหม่ตาม owner: **"10 ร้านอาหารยอดนิยมในจังหวัด<X>"** ทุกจังหวัด — รีวิว **≥200 คำ/ร้าน** (วิจัยจริงจาก Google/Wongnai/Facebook/YouTube), **รูปจริงของร้าน + เครดิตภาพ** (เว็บทางการ/เพจ FB/Wongnai/บล็อกอาหาร), **ลิงก์ไปหน้าโรงแรม** (รายได้หลัก = จองที่พัก). ใช้ articleSchema (type `eat-ranking`).

## ✅ สถานะ (2026-06-20): GOLD REFERENCE เชียงใหม่ "v2" — เพิ่ม 4 ฟีเจอร์ใหญ่ + sticky rail (committed `97714eed`, pushed)
ไฟล์: `astro/src/content/articles/top10-popular-restaurants-chiang-mai.json` · slug `top10-popular-restaurants-chiang-mai` · cluster chiang-mai
- 10 ร้านจริง · ทุกร้าน ≥300 คำ · รูป+เครดิตครบ 10/10 (`astro/public/images/food/chiang-mai/<slug>.jpg`)
- **owner สั่ง(2026-06-20) ให้ฝัง 4 อย่างใน template ก่อนสเกลทุกจังหวัด** แล้วทำ CM เป็น gold reference:
  1. **foodexp** — โมดูลฟู้ดทัวร์/คลาสทำอาหาร (Klook `aid=121442`, ลิงก์ search/<city>) = รายได้สายอาหารตรง ๆ (วางหลังร้าน#10 ก่อน tip)
  2. **ชั้นข้อมูลนักท่องเที่ยวต่างชาติ** (badges ต่อร้าน): hours/priceUsd/spice/halal/veg/englishMenu — honest (ไม่จริงไม่ใส่)
  3. **แผนที่ Leaflet/OSM** ปักหมุด 10 ร้าน (ต้องมี lat/lng ≥3 จุดถึงโชว์) หมุด → popup ลิงก์ที่พักย่านนั้น · อยู่ในคอลัมน์เนื้อหา
  4. **JSON-LD AEO** (bonus, owner ไม่ได้เลือกแต่ผมแถมเพราะคุ้ม) = ItemList + Restaurant + GeoCoordinates (ไม่มี rating ปลอม → EEAT ผ่าน)
- **+ sticky right rail (owner feedback รอบ 2)** — แถบการ์ดรีวิวโรงแรม (รูป+ชื่อ+โน้ต) ด้านขวา เลื่อนตาม (sticky top:80px) · **เดสก์ท็อปเท่านั้น ≥1025px, มือถือซ่อน** (ใช้ staycta/foodexp inline แทน) · field ใหม่ `rail` ใน articleSchema · CM ใช้ 5 roundup (heroImg)
- เลย์เอาต์เดิม (roundup-style entry: .resto-head → .resto-body 2 คอลัมน์) ยังอยู่ครบ แค่เสริมของใหม่
- **⏸️ PAUSED รอ owner (2026-06-20):** owner กำลังรีวิว gold reference v2 ที่ `:4400` เอง — **อย่าสเกลจนกว่า owner สั่ง** ("[User dismissed — wait for next instruction]")

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

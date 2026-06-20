# 🍜 RESTAURANT-REVIEW (Top 10 ร้านอาหารต่อจังหวัด) — RESUME HANDOFF

> สรุปเพื่อขึ้นเซสชั่นใหม่ · อัปเดต 2026-06-20 · source of truth = git (อย่าเชื่อ doc ถ้าขัดของจริง)

## 🎯 งานนี้คืออะไร
content type ใหม่ตาม owner: **"10 ร้านอาหารยอดนิยมในจังหวัด<X>"** ทุกจังหวัด — รีวิว **≥200 คำ/ร้าน** (วิจัยจริงจาก Google/Wongnai/Facebook/YouTube), **รูปจริงของร้าน + เครดิตภาพ** (เว็บทางการ/เพจ FB/Wongnai/บล็อกอาหาร), **ลิงก์ไปหน้าโรงแรม** (รายได้หลัก = จองที่พัก). ใช้ articleSchema (type `eat-ranking`).

## ✅ สถานะ: DEMO เชียงใหม่ เสร็จ + ผ่านการรีวีไซน์ 4 รอบ (committed)
ไฟล์: `astro/src/content/articles/top10-popular-restaurants-chiang-mai.json` · slug `top10-popular-restaurants-chiang-mai` · cluster chiang-mai
- 10 ร้านจริง (ข้าวซอยลุงประกิจ/เฮือนเพ็ญ/ขาหมูช้างเผือก/ข้าวซอยแม่สาย/ต๋องเต็มโต๊ะ/SP Chicken/ข้าวซอยแม่มณี/Ristr8to/ข้าวซอยลำดวนฟ้าฮ่าม/The Baristro) · ทุกร้าน ≥300 คำ · รูป+เครดิตครบ 10/10 (รูปอยู่ `astro/public/images/food/chiang-mai/<slug>.jpg`)
- **ประวัติ feedback owner:** (1) ธรรมดา→redesign editorial cards (2) รูปไม่ครบ+เพิ่มลิงก์โรงแรม→fix+conversion (3) ภาพ-เนื้อหาไม่สมดุล→**restructure เป็น roundup-style** (commit `9a5a09c0`)
- **เลย์เอาต์ล่าสุด (ที่ owner ต้องการ) = แบบ RoundupLayout entry:** `.resto-head`(rank+type+name+meta) → `.resto-body` 2 คอลัมน์ = ซ้าย `.resto-media`(รูป+เครดิต+ราคา+ปุ่ม 🏨ที่พัก/📍แผนที่/เพจ) | ขวา `.resto-content`(tags+signature+desc+mustOrder). ภาพไม่ใหญ่ล้น เนื้อหาเป็นหลัก = สมดุล

## 🏗️ Infra (schema/layout — additive, ไม่กระทบ 3,213 บทความเดิม)
- `astro/src/content.config.ts` articleBlock เพิ่ม 3 ชนิด: **`image`** (รูป+เครดิต), **`restaurant`** (rich card: rank/name/area/cuisine/signature/priceRange/score/img/alt/credit/creditHref/descHtml/mustOrder/tags/mapHref/fbHref/**stayHref/stayLabel**), **`staycta`** (โมดูลจองที่พัก: title/text/img/links[]/ctaLabel/ctaHref)
- `astro/src/layouts/ArticleLayout.astro`: render ทั้ง 3 block + **immersive hero** (`isResto && heroImg` → full-bleed) + **sticky quick-nav** (`.qnav`) + CSS ทั้งหมด inline ใน `<style>` (เทียบ entry layout = `RoundupLayout.astro` บรรทัด ~477-533: `.entry-header`/`.entry-body`/`.entry-img-col`/`.entry-content-col`)
- **conversion → จองที่พัก:** ทุกการ์ดมีปุ่ม `stayHref`→roundup โรงแรมตามย่าน (นิมมาน→top10-nimman-budget-hotels-chiang-mai, เมืองเก่า→top10-boutique-, default→top10-popular-) + 1 โมดูล `staycta` กลางบทความ (หลังร้าน#5) ลิงก์ 4 roundup โรงแรม + ปุ่ม Agoda (`https://www.agoda.com/th-th/city/<city>-th.html?cid=1965862`) + end-cta→โรงแรม
- **engine สร้างจังหวัดใหม่:** `_internal/wf/restaurants-roundup.js` (Workflow) — args `{prov,city,slug}` · 3 phase: Plan(เลือก 10 ร้านจริง+แหล่ง) → Write(10 agent: วิจัย+เขียน≥200คำ+curl รูปจริง+เครดิต) → Assemble(ประกอบ JSON). **หมายเหตุ: engine นี้ output แบบ h2+image+p เดิม — ต้องอัปเดต assembler ให้ output `restaurant` blocks (มี stayHref/stayLabel/staycta) ตามเลย์เอาต์ใหม่ ก่อนสเกล** (หรือ restructure ผลลัพธ์ทีหลังแบบที่ทำกับ CM demo)

## ▶️ งานต่อไป (เซสชั่นใหม่)
1. **preview:** `export PATH="$HOME/nodejs:$PATH"; npm --prefix astro run dev` (ready ~2 นาที) → `http://localhost:4321/top10-popular-restaurants-chiang-mai.html` · ตรวจว่า owner พอใจเลย์เอาต์ roundup-style
2. **ปรับ assembler ใน restaurants-roundup.js** ให้ output `restaurant`+`staycta` blocks + map ย่าน→roundup โรงแรมจริงของจังหวัดนั้น (ดู `ls astro/src/content/roundups/ | grep <city>` ก่อน — ใช้เฉพาะ slug ที่มีจริง)
3. **สเกลทุกจังหวัด** (owner: "ทำทุกจังหวัด") — clone engine ต่อจังหวัด, prefetch ไม่ต้อง (วิจัยสด), 1 workflow/ครั้ง, verify(≥200คำ/ร้าน + รูป+เครดิต + stayHref resolve + build OK) → commit. ดูจังหวัดที่มี hotel roundup แล้ว (ลิงก์ได้) ก่อน
4. รูปร้านขาด→spawn image agent (เว็บทางการ/FB/Wongnai/บล็อก + เครดิต; **ห้าม Trip.com/stock/รูปผิดร้าน**) · ตรวจ decode ได้ (sharp metadata)

## ⚠️ ข้อควรรู้
- **ไฟล์ขยะ untracked 2 อัน** ใน repo root: `_navfields.json`, `yenjit_page.html` (ไม่ทราบที่มา — เซสชั่นอื่น/ทดลอง) — owner ตรวจแล้วลบได้ (ผมไม่ลบเพราะไม่ได้สร้างเอง)
- **build gate:** `bash _internal/build-test.sh` ต้อง BUILD OK · keywords field required ใน article (ไม่งั้น build error)
- **มีอีก session ทำ EN translation ขนานอยู่** (reviews-en/roundups-en) — `git fetch && git rebase origin/main` ก่อนเริ่ม + เช็คไม่ชนกัน
- **weekly usage limit** ชนเป็นระยะ → subagent/Workflow fail → รอ reset
- บริบทใหญ่: content migration **195/195 DONE** + QA phase 23/38 cluster (ดู `_internal/MASTER-HANDOFF.md`)
- ห้ามแก้ gen-hubs.mjs / public/index.html / CLAUDE.md · brand LOCKED = Vibrant Island Pop (teal #06B6D4 / coral #FB7185 / mango #FBBF24 + Outfit/Sarabun)

# 🇬🇧 EN ARTICLE TRANSLATION — RESUME HANDOFF (สำหรับเซสชั่นใหม่)

> ค้างเพราะชน **weekly usage limit** (รีเซ็ต **19 มิ.ย. 2026, 05:00 น. เวลาไทย**)
> เหลือแปล **634 บทความ EN** (ณ 14 มิ.ย.) ใน 22 คลัสเตอร์ · resume รอบเดียวจบ
> สถาปัตยกรรม EN พร้อม 100% (articlesEn collection + route `/en/[slug]` + hreflang ใน layout) — แค่ใส่ไฟล์ลง `articles-en/`

## หลักการ (ทำไมแปลที่ JSON ไม่ใช่ HTML)
เว็บนี้เป็น **Astro** · ทุกบทความ render ผ่าน `ArticleLayout.astro` ตัวเดียว → แปลที่ไฟล์เนื้อหา `astro/src/content/articles/<slug>.json` (ไทย) → เขียน `astro/src/content/articles-en/<slug>.json` (อังกฤษ) แล้ว Astro generate หน้า `/en/<slug>` ให้เอง **โครงสร้าง HTML + รูป + เลย์เอาต์เหมือนหน้าไทย 100% โดยอัตโนมัติ**

## กฎคุณภาพ (LOCKED — owner กำหนด)
- **โทน:** เป็นกันเอง เหมือนเพื่อนเล่าให้เพื่อนฟัง สุภาพ เนทีฟ (ไม่ใช่แปลคำต่อคำเครื่อง · ไม่มีคำคลีเช่ Aon: world-class/nestled/boasts/hidden gem/must-visit เกร่อ)
- **โครงสร้าง+รูปเหมือนหน้าไทย:** คง key/บล็อก/ลำดับ/slug/type/cluster/crumbCityHref/heroImg/href ทุกอันเป๊ะ (layout เดียวกัน render → เหมือนโดยนิยาม)
- **⛔ ห้ามคิดสถานที่เอง:** แปลเฉพาะเนื้อหาที่อยู่ในไฟล์ไทยเท่านั้น ห้ามเพิ่ม/แต่งสถานที่/ร้าน/กิจกรรมที่ไม่มีในต้นฉบับ
- **⛔ ห้ามคิดตัวเลขเอง:** ราคา/ระยะทาง/เวลา/จำนวน คัดลอกจากไทยตรง ๆ ห้ามเปลี่ยน — แปลแค่ "หน่วย/คำ" (บาท→THB, /คืน→/night, นาที→min, กม.→km)
- โทน honesty/EEAT คงไว้ (เตือนอากาศ/ความปลอดภัย/ราคาผันผวน) เป็นอังกฤษ
- ชื่อเฉพาะไทยใช้ทับศัพท์อังกฤษที่ใช้จริง (เกาะล้าน→Koh Larn, หาดตาแหวน→Tawaen Beach) · ชื่อโรงแรม/แบรนด์คงเดิม

> กฎทั้งหมดนี้ฝังอยู่ใน `_internal/wf/translate-en.js` (RULES) แล้ว — ใช้ workflow นี้ได้เลย

## ขั้นตอน resume (รันหลัง 19 มิ.ย.)
ใช้ Opus (คุณภาพการเขียน) · bash: `export PATH="$HOME/nodejs:$PATH"` ก่อน

1. **อัปเดตโค้ดล่าสุด** (อีก session ยัง migrate เพิ่ม): `git fetch origin && git rebase origin/main`
2. **คำนวณบทความที่ขาดสด ๆ** (อย่าเชื่อไฟล์เก่า — อีก session อาจเพิ่มบทความไทยอีก):
   ```bash
   node -e 'const fs=require("fs");const A=fs.readdirSync("astro/src/content/articles").filter(f=>f.endsWith(".json")).map(f=>f.slice(0,-5));const E=new Set(fs.readdirSync("astro/src/content/articles-en").filter(f=>f.endsWith(".json")).map(f=>f.slice(0,-5)));const miss=A.filter(s=>!E.has(s));const by={};for(const s of miss){let c;try{c=require("./astro/src/content/articles/"+s+".json").cluster}catch{c="?"}(by[c]||=[]).push(s)}fs.writeFileSync("_internal/en-resume-missing.json",JSON.stringify(by));console.log("missing:",miss.length,"clusters:",Object.keys(by).length)'
   ```
3. **ยิง workflow แปล** (Workflow tool, scriptPath = `_internal/wf/translate-en.js`, args = `{"slugs":[...]}`) แบ่ง batch ~6 คลัสเตอร์/รอบ (~200 slug) รัน 2-3 batch ขนานได้
   - ดึง slug ต่อ batch: `node -e 'const m=require("./_internal/en-resume-missing.json");const cs=Object.keys(m).sort().slice(0,6);console.log(JSON.stringify(cs.flatMap(c=>m[c])))'`
   - ⚠️ args ส่งเป็น JSON object `{"slugs":[...]}` (workflow มี fallback parse string ให้แล้ว)
4. **verify ต่อคลัสเตอร์** (โครงสร้าง/slug/cluster/href/บล็อก/ไม่มีไทยตกค้างในไตเติล): `node _internal/en-check.mjs <cluster1> <cluster2> ...` → ต้อง `RESULT:OK`
   - (en-check ยกเว้น ฿ baht symbol แล้ว — ไม่ false positive)
5. **commit ต่อคลัสเตอร์** (เฉพาะไฟล์ articles-en ที่ verify ผ่าน) เช่น:
   ```bash
   git add astro/src/content/articles-en/<slug>.json ... 
   git -c user.name="chatoccmed" -c user.email="chatoccmed@users.noreply.github.com" commit -q -m "i18n EN: <cluster> — N articles translated"
   ```
6. **เมื่อครบทุกคลัสเตอร์:** `bash _internal/build-test.sh` (ต้อง BUILD OK) → `git fetch && git rebase origin/main` → `git push`
7. ตรวจปิดงาน: `node -e '...'` คำนวณ missing = 0 · ลบไฟล์ temp `_b*.json _en_*.json|txt` ถ้ามี

## 22 คลัสเตอร์ที่ขาด (ณ 14 มิ.ย. · ตัวเลขในวงเล็บ = จำนวนบทความ)
chiang-mai(6) phang-nga(30) phatthalung(37) phayao(37) phichit(4) phitsanulok(37) phrae(37) phuket(38) samut-prakan(1) samut-sakhon(37) samut-songkhram(37) saraburi(37) sisaket(1) songkhla(34) sukhothai(37) suphan-buri(37) tak(2) trang(37) trat(37) ubon-ratchathani(37) yala(37) yasothon(37)

## ⚠️ คนละ scope (อย่าสับสน)
- **งานนี้ = บทความ (articles) เท่านั้น** ใช้ articleSchema
- รีวิวโรงแรม (reviews) + roundup ที่ขาด EN (~845+121) = เนื้อหา migration ของ "อีก session" คนละ schema — **ไม่อยู่ใน handoff นี้** (ทำแยกภายหลังถ้า owner สั่ง)

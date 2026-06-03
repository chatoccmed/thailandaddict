# CLAUDE.md — thailandaddict.com

แบรนด์ **เที่ยวไทยเฉพาะทาง** (TH + EN) บน Astro static → Cloudflare
Scaffold ยกสถาปัตยกรรมมาจาก wherebest (repo `tourlogy`) แล้ว rebrand · เริ่มเนื้อหาสดใหม่

> อ่าน `thailandaddict-handoff.md` สำหรับบริบทเต็ม (portfolio 3 เว็บ, inventory 212 posts เดิม, การตัดสินใจ)

---

## สถาปัตยกรรม
- **Astro static build** · `build: { format: 'file' }` · `trailingSlash: 'never'` → flat `.html`, clean URL
- **Content collections** (`astro/src/content.config.ts`):
  - `reviews` (TH, root) · `roundups` (TH, root)
  - `reviews-en` · `roundups-en` (เสิร์ฟใต้ `/en/`)
  - แต่ละ entry = ไฟล์ JSON 1 ไฟล์ ตาม schema → render ผ่าน `[slug].astro` + Layout
- **Layouts**: `ReviewLayout.astro` (รีวิวโรงแรมเดี่ยว) · `RoundupLayout.astro` (Top N)
- **public/** = static HTML hub pages (city/country/index) + assets (images, css, js) เสิร์ฟตรง ไม่ผ่าน Astro
- **Deploy**: Cloudflare อ่าน `astro/dist` (ดู `wrangler.jsonc`) · build = `cd astro && npm install && npm run build`

## โครงไฟล์
```
astro/
  src/content.config.ts        schema (reviews/roundups + EN) · default addressCountry 'TH'
  src/content/{reviews,roundups,reviews-en,roundups-en}/   *.json (ตอนนี้ว่าง — .gitkeep)
  src/layouts/{ReviewLayout,RoundupLayout}.astro
  src/styles/{review,roundup}.css
  src/pages/[slug].astro · src/pages/en/[slug].astro
  public/                       index.html, robots.txt, _headers, _redirects, images/
_internal/
  build-test.sh                 validation build (temp dir นอก repo)
  templates/{review,roundup}.sample.json   แม่แบบ schema (Chiang Mai · จาก wherebest — ใช้ดูรูปทรง field)
.claude/skills · .claude/agents
```

## Build / test (เครื่องนี้ C:\Users\Imac)
- **Node v24** อยู่ที่ `~/nodejs` — bash: `export PATH="$HOME/nodejs:$PATH"` ก่อน (PowerShell ไม่โหลด PATH นี้)
- **Python ใช้ไม่ได้** → ใช้ Node / PowerShell แทน
- pre-push check: `bash _internal/build-test.sh` (build copy ใน `~/ta-build-temp` · heap 8GB กัน OOM · ข้าม public/ → ไม่มีรูปใน dist เป็นเรื่องปกติ)
- production build script ตั้ง `--max-old-space-size=8192` ไว้แล้ว (`astro/package.json`)

## มาตรฐานเนื้อหา (ยกจาก wherebest — LOCKED)
- **โทน v2-clean**: เพื่อนเล่าให้เพื่อน · ห้าม slang `อ่ะ/ปะ/แหละ/ล่ะ` · ห้ามคำ AI `ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก`
- **Honesty / EEAT**: "เสียงจากรีวิวจริง" · ห้ามอ้างไปพักเอง · verify โรงแรมว่ามีจริงก่อนเขียน
- **1 h1 ต่อหน้า** · canonical/og/hreflang · JSON-LD (มีใน layout แล้ว) · self-host รูป (รูปจาก Trip.com)

## Affiliate IDs
- Agoda `cid=1965862` · Trip.com `Allianceid=6861268&SID=312919111` · Klook `aid=121442`

## Skills / Agents (`.claude/`)
- skills: `tourlogy-city-content` · `tourlogy-city-roundup-checklist`
- agents: roundup-builder · hotel-reviewer · food-writer · attraction-writer · quality-auditor (งานเขียน = Opus)
- ⚠️ ยังชื่อ prefix `tourlogy-` — rename เป็น `thailandaddict-` ภายหลังได้ (ตอน reuse จริง)

## งานต่อไป (ดูแฮนด์ออฟ §แผน)
1. ✅ scaffold stack + rebrand (เสร็จ)
2. ✅ chrome/hub pages: `index.html`, `country-thailand.html`, about/contact/editorial-policy/privacy/404 (Thailand-scoped nav/footer · design system จาก wherebest) — nav/footer ของ layout resolve ครบแล้ว
3. ดึง 212 posts เดิม → topic list (WP REST: `thailandaddict.com/wp-json/wp/v2/posts?per_page=100&page=N`)
4. เขียนใหม่สไตล์ v2-clean ทีละหัวข้อ (verify โรงแรมจริง · รูป Trip.com) → ลง content collections
5. สร้าง `city-*.html` (25 จังหวัด) + `top10-hotels-*.html` — ตอนนี้เป็น future target ที่ index/country/footer ลิงก์ถึง (ยัง 404)
6. Cloudflare auto-deploy

> hub pages ใช้ design system แยกจาก review/roundup (inline CSS สไตล์ wherebest: Sarabun/Fraunces/Outfit · blue #4A90E2) · chrome ร่วม = nav/footer เดียวกันทุกหน้า · ไม่มี search infra (ลบออก) · local preview: `.claude/launch.json` (static-preview) → `_internal/preview-server.mjs`

## หมายเหตุ scaffold
- ลบ ad/monetization tag ของ wherebest (emrldco/Travelpayouts) ออกจาก layout แล้ว — ใส่ tag ของ thailandaddict เองภายหลัง
- nav/footer default ชี้ `country-thailand.html`, `🇹🇭 Thailand` — หน้า hub เหล่านี้ยังไม่มี (สร้างในขั้น 4) ลิงก์จะ 404 จนกว่าจะสร้าง

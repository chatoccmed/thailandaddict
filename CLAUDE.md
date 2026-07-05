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
- **ห้าม dark patterns (LOCKED · trust > tricks — Booking โดนปรับ €413M):** ห้ามสร้างความเร่งรีบ/ขาดแคลนปลอมบนของที่จองได้ ("เหลือห้องเดียว!", "only 1 left"), ห้าม fake live-viewer/booking count ("X คนกำลังดูห้องนี้", "จองแล้ว X ครั้งวันนี้"), ห้าม countdown timer โปร/ราคา, ห้าม fake discount (ขีดฆ่าราคาลวง), ห้าม fake freshness ("เช็กราคาล่าสุดเมื่อครู่"). **หมายเหตุ:** คำแนะนำจริงเช่น "ของหมดเร็ว ไปเช้า", "นับถอยหลังปีใหม่" (เทศกาล), "มา 8 คนจองวิลล่า" = ซื่อสัตย์ ใช้ได้. guard = `node _internal/lint-dark-patterns.mjs` (อยู่ใน build-test แล้ว)
- **1 h1 ต่อหน้า** · canonical/og/hreflang · JSON-LD (มีใน layout แล้ว) · self-host รูป (รูปจาก Trip.com)

## 🏷️ แบรนด์ / สโลแกน / ฟอนต์ (LOCKED — ใช้ทุกหน้า)
- **สโลแกน TH:** `Thailandaddict ชีวิตติดเที่ยว — ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย`
  - tagline = "ชีวิตติดเที่ยว" · descriptor = "ที่สุดของที่พัก ที่กิน ที่เที่ยว ทั่วไทย"
- **สโลแกน EN:** `Thailandaddict — Explore Thailand Like a Local`
- ใช้ใน: `<title>`/meta/og · hero (h1 = "ชีวิตติดเที่ยว") · footer (ft-tag = EN slogan, ft-desc = TH) ของทุกหน้า (homepage + city + reviews + roundups)
- **ฟอนต์ไทย (LOCKED):** body = `-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Noto Sans Thai', 'Sarabun', sans-serif` (ได้ฟอนต์ระบบ iOS จริงบน Apple, Noto Sans Thai บนเครื่องอื่น) · หัวข้อ Latin = Fraunces serif (Thai fallback → iOS/Noto sans) · UI/ตัวเลข = Outfit
- **ดีไซน์ใหม่ (homepage):** พอร์ตเลย์เอาต์ wherebest (repo `tourlogy`) → remap สีเป็น Direction-C (teal/coral/mango) + Fraunces · ต้นแบบ chrome/CSS ใหม่ = `astro/public/index.html` (เวอร์ชันนี้แทนของเดิม) · หน้าจังหวัด (`gen-hubs.mjs`) ต้องอัปเดตให้ใช้ chrome/CSS + 5 แท็บ + สโลแกน + ฟอนต์ชุดนี้

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

## 🎨 Design system — "Vibrant Island Pop" (Direction C · LOCKED)
เอกลักษณ์เฉพาะ thailandaddict (ฉีกจาก wherebest blue/orange · owner เลือก C) — ใช้**ทุกหน้า** ทั้ง hub + layout รีวิว/roundup
- **Palette:** teal `#06B6D4` (+dk `#0891b2`) · coral `#FB7185` (+dk `#f43f5e`) · mango `#FBBF24` · ink `#0F172A` · sub `#64748b` · bg ขาว `#ffffff` · soft section `#f1fbfd` · border `#e6eef2`
- **Fonts:** Outfit 800/900 (display/หัวข้อ/ชื่อโรงแรม/rank/คะแนน — sans หนา ไม่ใช่ serif) · Sarabun (body ไทย) · Outfit (UI/ปุ่ม/label)
- **สไตล์:** สดใส มนโค้งใหญ่ (การ์ด 20–26px · ปุ่ม 12px · pill 999px) · เงาสีสด · gradient (hero teal→coral, ปุ่ม, score)
- **Booking buttons:** Agoda=coral gradient · Booking=teal · Trip=ink · rank tile=teal gradient · score=mango→amber gradient pill · rating bars=teal→coral
- **ต้นแบบ/design-system reference = `astro/public/index.html`** (`<style>` block + nav/footer chrome) — หน้า hub อื่นก๊อป block นี้ · layout รีวิว/roundup ฝัง palette เดียวกันใน `review.css`/`roundup.css` + inline `<style>`
- favicon = teal `T` (`%2306B6D4`) · chrome ร่วม nav/footer เหมือนกันทุกหน้า · ไม่มี search infra
- (เคยลอง A "Modern Tropical Editorial" cream/teal/Fraunces — owner เลือก C แทน · ห้ามใช้ token A เดิม `#0E7C6B`/`#FF6B4A`/cream/Fraunces)
- **local preview:** `.claude/launch.json` → static-preview (public, :4399) + dist-preview (`~/ta-build-temp/dist`, :4400) → `_internal/preview-server.mjs` (รับ root/port ผ่าน argv)

## 🌐 ภาษา (i18n) + เมืองท่องเที่ยว (LOCKED policy · แผนเต็ม = `_internal/I18N-AND-TOURISM-CITY-PLAN.md`)
- **Tier-1 (9 ภาษา):** หน้าหลัก + หน้าจังหวัด/เมืองที่เป็น "เมืองท่องเที่ยว" + ส่วน destination → th·en·zh·ru·ko·ja·he·ar·hi · ⚠️ he+ar = RTL (`dir="rtl"` + mirror layout)
- **Tier-2 (ไทย+อังกฤษ):** จังหวัดรอง (จังหวัดทั่วไป) + ทุกหน้าอื่น (บทความ/รีวิว/roundup/region/policy)
- **กติกาทอง:** โครงสร้าง/เลย์เอาต์/ดีไซน์เหมือนกันทุกภาษา เปลี่ยนเฉพาะ "ข้อความที่แสดง" + ทิศอ่าน
- **เมืองท่องเที่ยว** = ชุด curated (TOPDEST + DESTINATIONS) แยกหมวดจากจังหวัดทั่วไป มีการ์ดพรีเมียม + badge "9 ภาษา" + filter ตามประเภท (เกาะ/ภูเขา/วัฒนธรรม/เมือง) — ดูแผน §2
- store: `astro/src/i18n/ui.<lang>.json` (chrome) + `_internal/city-i18n/<slug>.<lang>.json` (เนื้อหาเมือง · ไทย=source) · URL = subpath `/<lang>/…` · gen-hubs เป็น locale-aware · fallback en→th
- สถานะ: **แผน** — ทำเนื้อหา TH/EN ครบก่อน แล้วค่อยทำชั้นภาษา

## หมายเหตุ scaffold
- ลบ ad/monetization tag ของ wherebest (emrldco/Travelpayouts) ออกจาก layout แล้ว — ใส่ tag ของ thailandaddict เองภายหลัง
- nav/footer default ชี้ `country-thailand.html`, `🇹🇭 Thailand` — หน้า hub เหล่านี้ยังไม่มี (สร้างในขั้น 4) ลิงก์จะ 404 จนกว่าจะสร้าง

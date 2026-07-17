# SESSION HANDOFF — 2026-07-05 (mega-session: QA ทั้งเว็บ + Booking→CJ monetization)

> **เริ่มอ่านที่นี่** ถ้ามารับงานต่อ — ไฟล์นี้สรุปทุกอย่างที่ทำ + แนวทาง + งานถัดไป
> อ่านคู่กับ: `_internal/BOOKING-CJ-GUIDE.md` (LOCKED — สำคัญสุดเรื่องรายได้) · `_internal/SESSION-HANDOFF.md` (master track เดิม) · memory files ใน `~/.claude/projects/C--Users-Imac-Thailandaddict/memory/`

## ✅ สถานะปัจจุบัน (ทุกอย่าง LIVE แล้ว ไม่มีอะไรค้าง)
- **Production Version ล่าสุด: `62215f85`** (Cloudflare Worker `thailandaddict`) — deploy ครบทุกงานใน session นี้
- git: working tree สะอาด · sync origin/main เป๊ะ (HEAD = `488858f4a`)
- ไม่มีงานทำค้างครึ่ง ๆ — จบเป็นชิ้นทุกอัน

---

## 📦 งานที่เสร็จ + deploy ใน session นี้ (เรียงตามลำดับ)

### 1. Michelin surfacing (deploy `8fb9b7be`)
181 บทความ michelin-* audit (0 error) → map 56 ร้านเข้า 21 ย่านด้วย haversine ≤0.9km → เติม 112 การ์ด related บนหน้า restaurants eat-ranking (TH+EN) · เครื่องมือ: `_internal/audit-michelin.mjs`, `_internal/surface-michelin.mjs` (idempotent, `--apply`)

### 2. QA deep-audit ทั้งเว็บ — phase a/b/c (deploy `8fb9b7be`)
**รีวิวโรงแรมทั้ง 2,296 ใบ web-verify ครบ** (จริง/ยังเปิด/ข้อมูล/รูปถูกโรงแรม):
- phase-a: 15 ย่านท่องเที่ยว (436 รีวิว) — 6 fixes (Puri Pai ชื่อร้าน, Chatfah score เป่า 8→7.6, Chomna ราคา, Tonnam hero เสีย, Imperial ลิงก์ผิดโรงแรม, Jolly Frog FAQ เพี้ยน)
- phase-b: 51 จังหวัด long-tail (604 รีวิว) — ~13 fixes รวม **pattani ที่อยู่ผิดย่าน**, **koh-lipe geography กลับด้าน**, **satun+songkhla รูปผิดโรงแรม** (หารูปจริง 4 รูป)
- phase-c: 357 รีวิวย่านกรุงเทพ — 5 fixes (bed-by-sam-yan ลิงก์ Trip ผิดโรงแรม, the-quart ดาว/ห้อง, D&D hero 37MB→197KB, china-town + holiday-inn รูปผิด)
- **บันทึกถาวร: `_internal/qa/verdicts-*.json` + `qa-ledger.json` (status=checked) + `_internal/migration/_qadone.txt` — ไม่ต้องตรวจซ้ำ**
- pipeline: `gen-deep-audit.mjs <cluster>` → Workflow → เขียน verdicts → แก้ → `apply-verdicts.mjs` → `build-ledger.mjs` → commit

### 3. QA phase-d/e — roundups + articles (deploys `a0fdf981`, `7cb894c5`)
- **d**: 296 roundups cross-check กับรีวิว — sync score 32, รูป 6, ban-word 39, affiliate 4 · เครื่องมือ: `_internal/qa/audit-roundups.mjs` + `fix-roundups.mjs` (⚠️ affiliate ต้อง domain-aware)
- **e**: 3,979 articles — ban-word 2,145 (template `ระดับโลก` ใน `_internal/embed-experiences.mjs` แก้ที่ต้นทางด้วย), ลิงก์เสีย 14, แปล EN 60 ไฟล์ · เครื่องมือ: `_internal/qa/audit-articles.mjs` → **ตอนนี้ 0 issues**

### 4. Venue + attraction verify (deploys `5c92223a`, `79b603d1`)
- ร้านใน eat-ranking **1,686 ร้าน** (กทม. 658 + ตจว. 1,028) → ปิดถาวร 5 (กทม.ทั้งหมด) **สลับเป็นร้านเปิดจริงแล้ว** (TALES Khaosan, โคขุนโพนยางคำ นวมินทร์ 66, Methavalai Residence, เบียร์หิมะ, ปฐมเลิศรส)
- สถานที่ท่องเที่ยว **1,057 แห่ง** → 5 แห่งใส่โน้ตสถานะซื่อสัตย์ (บ้านเสานัก+เพลินวานปิดถาวร, ด่านปอยเปต/หาดเล็กปิดจากสถานการณ์ชายแดน 2568-69, เกาะกระดาดปิด) — **แก้คำอ้างเท็จ "reopened" ของเพลินวานด้วย**
- กฎ: สลับร้านปิด → ต้อง scrub ชื่อร้านเก่าออกจาก title/metaDesc/intro/tip/faq ด้วย

### 5. Data-validity + hero + schema (deploys `e20061cb`, `34bb4bf8`)
- `_internal/qa/audit-data-validity.mjs` (พิกัด/slug ซ้ำ/rating/วันที่/ลิงก์/affiliate) → แก้ลิงก์เสีย 8 + Allianceid 1 → **0 issues**
- hero รูปใหม่ 3 หน้า (สุวรรณภูมิ/พัทยา/บำรุงราษฎร์ — CC/PD, R2 แล้ว)
- แก้ schema: top10-attractions-* 109 หน้า เลิกปล่อย `Restaurant` JSON-LD ให้วัด → `TouristAttraction` (`isAttractionList` ใน ArticleLayout)

### 6. 💰 Booking.com → CJ (deploy `62215f85`) — **งานใหญ่สุด อ่าน `BOOKING-CJ-GUIDE.md` ก่อนแตะ**
- **ข้อเท็จจริง**: Booking ไทยจ่ายผ่าน CJ เท่านั้น (PID `101809619` · advertiser Booking.com APAC `7854081` · Ad ID `17289009`) — `?aid=1670294` เก่าตายแล้ว owner เคยส่งมา 2 รอบแล้วหายเพราะ pipeline strip
- **สถาปัตยกรรม**: content เก็บ URL สะอาด → ห่อตอน render (`cjBooking()` ใน ReviewLayout/RoundupLayout **ทุกปุ่ม** เพราะ URL booking.com แอบอยู่ในช่อง agodaUrl ได้ + `cjB()` ใน gen-hubs + `wrap-booking-cj.mjs` สำหรับ static hubs)
- **ฟอร์แมต**: `anrdoezrs.net/click-101809619-17289009?sid=<slug หน้า>&url=<encode>` — ตรวจเทียบกับ setup จริงของเว็บ TopOfHotel แล้ว
- **ผล**: 19,365 ลิงก์ CJ / 0 ดิบ ทั้ง 13,425 หน้า · verification 5/5 PASS · **redirect chain พิสูจน์ attribution จริง** (sid → clkid + cjevent ถึง Booking)
- **🛡️ GUARD บังคับก่อน deploy ทุกครั้ง: `node _internal/qa/check-booking-cj.mjs astro/dist`** — วันแรกก็จับ 10 ลิงก์หลุดแล้ว

---

## 🛠️ แนวทางการทำงาน (ที่เพื่อนต้องรู้)

### Deploy pipeline (จาก memory `deploy-pipeline` — push ไม่ทำให้ prod เปลี่ยน!)
```bash
export PATH="$HOME/nodejs:$PATH"                     # Node v24 (bash เท่านั้น)
bash _internal/build-test.sh                          # gate 1: BUILD OK (สร้างใน ~/ta-build-temp)
node _internal/qa/check-booking-cj.mjs ~/ta-build-temp/dist   # gate 2: Booking revenue guard
git push origin main                                  # (fetch+rebase ก่อนถ้า behind — ห้าม force)
rm -rf astro/.astro astro/node_modules/.astro astro/dist
cd astro && node --max-old-space-size=8192 node_modules/astro/astro.js build   # ~7-10 นาที
cd .. && node _internal/qa/check-booking-cj.mjs astro/dist    # guard ซ้ำบน dist จริง
npx wrangler deploy                                   # OAuth (chatmaliwan@gmail.com) — จาก root
# รูปใหม่ทุกรูปต้องขึ้น R2 ไม่งั้น 404:
npx wrangler r2 object put thailandaddict-images/images/<path> --file=astro/public/images/<path> --remote
```

### Audit suite (รันได้ทุกเมื่อ ทุกตัวต้อง 0)
```bash
node _internal/migration/audit-all.mjs        # โครงสร้าง roundups/reviews/articles
node _internal/qa/audit-data-validity.mjs     # พิกัด/ลิงก์/rating/slug/affiliate
node _internal/qa/audit-roundups.mjs          # roundup ↔ review sync
node _internal/qa/audit-articles.mjs          # ban-words/EN/ลิงก์/hero
node _internal/qa/check-booking-cj.mjs        # 💰 Booking revenue guard
```

### กฎเหล็ก / gotchas
- **ห้ามใส่ `aid=`/`label=` ใน booking.com URL ในเนื้อหา** — guard จะ fail (ดู BOOKING-CJ-GUIDE.md)
- ban-words ห้ามใช้: `ตอบโจทย์ โดดเด่น ครบครัน ระดับโลก สุดยอด อันซีน` (สลับ: ลงตัว/เป็นเอกลักษณ์/ครบ/ชั้นนำ/ยอดเยี่ยม/ที่หลายคนยังไม่รู้จัก)
- EN twin: ห้ามมีอักษรไทย (ยกเว้น ฿) + โครงสร้าง parity — `validate-en-twin.mjs` ใช้ได้เฉพาะ articles (reviews ต้องเช็คเอง)
- **working tree นี้ถูกใช้ร่วมกับ session อื่นได้** — ก่อน mass-edit ให้ `git status` + `git fetch` เช็คก่อนเสมอ (เคยโดน tree เปลี่ยนใต้มือกลางงาน)
- Workflow แขวน → TaskStop แล้ว resume ด้วย **args เดิมเป๊ะ** (memory `workflow-resume-needs-same-args`)
- affiliate fixer ต้อง **domain-aware**: cid เฉพาะ agoda.com, Allianceid เฉพาะ trip.com/traveloka — ช่อง agodaUrl อาจมี URL booking.com ปนได้!
- origin มี session อื่น push ตลอด (michelin/bars/EEAT) — fetch+rebase ก่อน push, ไฟล์ michelin-* คือ conflict surface บ่อยสุด

---

## ▶️ งานถัดไป (เรียงตามผลตอบแทน)

### 1. รอเลขจาก owner (พร้อมทำทันทีที่ได้ — แบบเดียวกับ Booking ที่เพิ่งเสร็จ)
- **GetYourGuide partner ID** → find-replace `__GYG_PARTNER_ID__` (6,510 ไฟล์) → rebuild+deploy → กิจกรรมทั้งเว็บเริ่มทำเงิน
- **GA4 ID** → ใส่ 3 จุด: `astro/src/components/Analytics.astro`, `gen-hubs.mjs` (GA_ID), `astro/public/trip.html` → analytics + funnel events ติด
- 12Go (`__12GO_AID__`) / Airalo (`__AIRALO_REF__`) / SafetyWing (`__SAFETYWING_REF__`) — เหมือนกัน
- (แนะนำ) owner สร้าง CJ text link ชื่อ "Hotels homepage" → เปลี่ยน `CJ_ADID` ใน 4 ไฟล์ (ReviewLayout/RoundupLayout/gen-hubs/wrap-booking-cj) เพื่อ report สวยขึ้น — ไม่บังคับ เงินเข้าเหมือนเดิม

### 2. Klook: search → deep activity links (ทำได้เลย ไม่ต้องรอใคร)
attraction 1,058 + eat-ranking หน้าหลัก ๆ ยังใช้ `klook.com/search/?query=` — deep link (`klook.com/activity/<id>`) convert ดีกว่า 3-5 เท่า · สูตรอยู่ที่ 17 activity guides ที่ทำไว้แล้ว: `WebSearch allowed_domains:["klook.com"]` หาสินค้าจริง → ใส่ `?aid=121442` · เริ่มจาก top-6 destination (bangkok/phuket/chiang-mai/krabi/samui/pattaya)

### 3. งานต้องเปิดเบราว์เซอร์ดู (ทำตอน owner ว่างมา verify)
sticky booking CTA บน itinerary/attraction · `/en/trip` · AVIF/WebP `<picture>` · wishlist→planner pin

### 4. เสริมความแข็งแรง (เมื่อว่าง)
- ต่อ guard `check-booking-cj.mjs` เข้า `build-test.sh` ให้รันอัตโนมัติ (ตอนนี้ต้องรันเอง)
- คิดต่อ: `/go/b` worker route แบบ TopOfHotel (แก้เลขไม่ต้อง rebuild) — เขียนไว้ใน BOOKING-CJ-GUIDE §ทางเลือกอนาคต

## 📍 เอกสาร/เครื่องมือทั้งหมดที่สร้างใน session นี้
`_internal/BOOKING-CJ-GUIDE.md` (LOCKED) · `_internal/qa/{check-booking-cj,wrap-booking-cj,audit-data-validity,audit-roundups,fix-roundups,audit-articles,audit-bangkok*,audit-michelin,surface-michelin}.mjs` · `_internal/qa/verdicts-*.json` (89 จังหวัด+bangkok) · `_internal/qa/{BANGKOK-AUDIT*,MICHELIN-AUDIT*,VENUE-VERIFY*,ATTRACTION-VERIFY*,PROVINCE-VENUE-MINORS*,MONETIZATION-ANALYSIS*,DATA-VALIDITY-AUDIT,ROUNDUP-AUDIT,ARTICLE-AUDIT}.{md,txt}` · `_internal/wf/{verify-eat-venues-*,verify-attractions,verify-booking-cj,fix-michelin-en,deep-audit-*}.js`

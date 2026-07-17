# SESSION-END 2026-07-07 — งาน A จบสมบูรณ์ + honesty + Near Me/AEO/webp + คาเฟ่ 77/77 + integrity audit

> ต่อจาก `SESSION-END-2026-07-05.md` · session เดียวยาว (2026-07-05 → 07-07) · **ทุกอย่าง deploy แล้ว** version ล่าสุด `0672af8c` · git = origin = prod ตรงกันหมด

---

## ✅ งานที่จบใน session นี้ (ตามลำดับ)

### 1. งาน A — Klook search→deep links: **จบทั้งเว็บ** (waves 1–15, ~1,050 หน้า)
- เครื่องมือ: `_internal/upgrade-klook-deeplinks.mjs` (CATALOG slug ที่ verify แล้ว + BATCHES ทุกจังหวัด)
- deploy ไป 6 รอบระหว่างทำ (e8a2aaeb → … → 785a44ef) — ไม่มีหน้าไหนเหลือ Klook search link ที่มีของขายจริง
- memory: `klook-deeplinks-top6-done`

### 2. งาน C — CJ guard ต่อเข้า build-test แล้ว
- `_internal/build-test.sh` รัน `node _internal/qa/check-booking-cj.mjs "$TMP/dist"` (ต้อง cd repo root ไม่งั้น pass ลวง) → exit 4 ถ้า fail

### 3. Honesty fixes
- ถอดคำสัญญา newsletter "ส่งทุกจันทร์" ที่ยังไม่มีระบบส่งจริง (`fce2f37dc`)
- ปุ่มจอง 134 จุด label ตามปลายทางจริง — โรงแรม non-OTA ได้ "จองผ่าน Facebook"/"จองกับที่พักโดยตรง" ไม่ fake OTA (`aa82ae9b4`) · logic = `bookButtons()` ใน ReviewLayout + RoundupLayout · memory: `booking-buttons-domain-aware`

### 4. งานใหญ่ 3 ชิ้น (owner สั่ง "1+2+3")
- **Near Me Now** (`bd4d66e65`): `/near-me` + `/en/near-me` — GPS + haversine, 1,802 จุด (stay 297 · eat 1,217 · see 288) จาก `_internal/gen-near-me.mjs` (ต่อเข้า prebuild แล้ว) → `near-me-index.json` · ลิงก์ "📍 ใกล้ฉัน" ใน nav ทุกหน้า (gen-hubs)
- **AEO** (`6c06cebbd`): IndexNow key + submit script (`_internal/submit-indexnow.mjs`) — **submit สำเร็จแล้ว 13,440 URLs (0 fail)** หลัง site verification ผ่าน · llms.txt เพิ่ม section Interactive tools
- **webp tier-2** (`2ca3e6da4` + `32105d330`): hero LCP 82 + top-referenced 200 รูป (-26%) · manifest = `astro/src/data/webp-manifest.json` (432 entries) · webp ต้องอยู่ทั้ง R2 และ commit

### 5. คาเฟ่สมบูรณ์ทั้งเว็บ (`329046d16`) — **77/77 จังหวัด + 12/12 เมืองท่องเที่ยว**
- หน้าใหม่ 2: `samut-sakhon-cafe-guide` + `koh-larn-cafe-guide` (TH+EN, 10 ร้าน verify จริง, hero CC lib)
- เติม 25 หน้าให้ครบ 10 ร้าน (+66 คาเฟ่ verify แล้ว) ด้วย `_internal/assemble-cafe-fill.mjs` — แก้ตัวเลขใน title/h1/metaDesc ให้ตรงจำนวนจริงด้วย
- **กบินทร์บุรียังมี 8 ร้าน — ตั้งใจ** (skeptic ตีตก 2 candidate; รอเจ้าของโทรเช็ค ดู `_internal/.cafe-fill-result.json`)
- EN twins: กวาด Thai leak 3 รอบ (tags 152 คำ / ชื่อร้าน latinize / ราคา 25 string) — ⚠️ **฿ (U+0E3F) อยู่ใน regex range [ก-๙]** อย่าใช้ตรวจ Thai โดยไม่ strip ฿ ก่อน

### 6. Site integrity audit ทั้งเว็บ (`5dfd1673e`)
- เครื่องมือใหม่: `_internal/qa/site-integrity-audit.mjs` (ลิงก์ภายใน / รูป / hreflang / JSON-LD / sitemap · `--r2` = HEAD check)
- แก้ลิงก์เสีย 125 จุด (7 root cause: michelin-michelin ซ้ำ, en/ prefix หลุด, slug remap, ฯลฯ)
- รูปเสียจริงทั้งเว็บ = 0 · JSON-LD invalid = 0 · hreflang เสีย = 0
- ⚠️ R2 HEAD เร็วเกิน = 429 rate-limit อ่านเป็น "เสีย" ลวง 9,659 รายการ — เช็คช้าๆ แล้วเหลือ 0 จริง → **flag เจ้าของ: ควรย้ายรูปไป custom domain**

### 7. Schema fixes (กัน build ล้ม — บทเรียนใหม่)
- `ac6cc58aa`: prev/next footer fields → optional + conditional render ใน ReviewLayout
- `2919cf121`: article `h2` block ใช้ `{text}` ไม่ใช่ `{html}` · review `parent*` 5 field เป็น REQUIRED — ลิงก์เสียให้ **repoint ไป roundup จริงที่มีโรงแรมนั้น** (grep roundups) ห้ามลบ block
- **กติกาใหม่:** แตะ content JSON แล้วรัน `cd astro && node --max-old-space-size=8192 node_modules/astro/astro.js sync` (~35 วิ) ก่อน build เต็ม · memory: `schema-gotchas-article-review`

### 8. Deploy สุดท้าย (ก้อนใหญ่ 6 commits)
- build-test PASS → push → clean prod build (13,158 หน้า Astro / 13,443 รวม static) → CJ guard บน dist จริง PASS (19,359 CJ links, 0 raw) → `npx wrangler deploy` → **version `0672af8c`**
- curl verify ครบ: หน้าคาเฟ่ใหม่ TH/EN 200 · near-me 200 · Taipei footer หาย · entaneer breadcrumb → wualai · michelin 200 · hero R2 200

### อื่นๆ ใน session
- วิเคราะห์กลยุทธ์ 20-ปี + slide deck (artifact) + เมนูงาน 38 ข้อให้เจ้าของเลือก
- `_internal/export-emails.mjs` — dump email จาก KV (namespace `fc95757f…`)

---

## 📋 งานถัดไป

### รอเจ้าของ (owner-gated — ทำไม่ได้จนกว่าจะได้ของ)
1. **งาน B**: สมัคร/ใส่ ID จริง — GYG · GA4 · 12Go · Airalo · SafetyWing (find-replace placeholder ดู memory `monetization-phase-done`) + Search Console + เลือก ESP + LINE OA
2. **R2 custom domain**: `pub-*.r2.dev` โดน 429 ตอนโหลดหนัก — ต้องตั้ง custom domain ใน Cloudflare dashboard แล้วเปลี่ยน IMG_BASE
3. **กบินทร์บุรี**: โทรเช็ค 2 คาเฟ่ candidate → ถ้าเปิดจริงค่อยเติมให้ครบ 10

### ทำต่อได้เลย (จากเมนู 38 ข้อ — ที่ยังไม่ได้ทำ)
- ดูรายการเต็มใน chat log / `SESSION-END-2026-07-05.md` §งานถัดไป — ก้อนที่เหลือหลักๆ: i18n Tier-1 9 ภาษา (แผน LOCKED ใน `I18N-AND-TOURISM-CITY-PLAN.md`), eat-ranking จังหวัดที่เหลือ (skill `thailandaddict-restaurant-ranking`), Bangkok roundup megaproject ต่อ (memory `bangkok-roundup-megaproject`)

### กติกาที่ต้องจำ (ย้ำ)
- push ≠ deploy · deploy = manual เท่านั้น: build-test → push → clean prod build → CJ guard → wrangler deploy → curl
- ห้ามรัน build 2 ตัวพร้อมกัน (`~/ta-build-temp` แชร์กัน) · build โดน kill = ไฟล์ lock EPERM ต้องรอ process ตายเอง
- แตะ content JSON → `astro sync` ก่อน build เต็ม
- ฿ อยู่ใน [ก-๙] · Python ใช้ไม่ได้ · Node อยู่ `~/nodejs` (bash: `export PATH="$HOME/nodejs:$PATH"`)

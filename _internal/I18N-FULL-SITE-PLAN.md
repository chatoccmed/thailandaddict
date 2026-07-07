# แผนแปลทั้งเว็บ 9 ภาษา — ทุกหน้า (FULL-SITE i18n)

> สถานะ: **แผน — รอ owner ยืนยันลำดับ** · เขียน 2026-07-06
> แทนที่ขอบเขตเดิม (Tier-1 = 39 หน้า) ตามคำสั่ง owner: *"ต้องการให้เว็บครอบคลุมทุกภาษาที่กำหนดในทุกหน้า"*
> แผนเดิม/นโยบายภาษา: `_internal/I18N-AND-TOURISM-CITY-PLAN.md` · เอนจิน: `_internal/i18n/`

---

## 1. เป้าหมาย

ทุกหน้า × 9 ภาษา: `th · en · zh · ru · ko · ja · he · ar · hi` (he/ar = RTL)

**ฐานหน้าไม่ซ้ำ (นับจริง 2026-07-06):**

| ชั้น | จำนวน | วิธีแปล |
|---|---|---|
| Hub/static (`astro/public/*.html`) | 226 หน้า | TM localizer (`localize.mjs`) — มีอยู่แล้ว ใช้ได้เลย |
| Content docs (reviews 2,212 + roundups 272 + articles 4,079) | 6,563 ไฟล์ JSON (260 MB) | แปล JSON ต่อไฟล์ (pipeline เดียวกับ Klook→EN ที่พิสูจน์แล้ว) |
| **รวมต่อภาษา** | **~6,789 หน้า** | |
| **รวมทั้งระบบ (9 ภาษา)** | **~61,000 หน้า** | |

**สถานะตอนนี้:** th เต็ม (ต้นฉบับ) · en เต็ม (ขาด 40 ไฟล์ `top10-attractions-*`) · zh/ru = 39 หน้า hub · ar = 4 หน้า (8%) · he/ko/ja/hi = TM บางส่วน ยังไม่มีหน้า live

---

## 2. ข้อจำกัดเชิงสถาปัตยกรรม (ตัวบล็อกจริง ต้องแก้ก่อนสเกล)

### 2.1 Cloudflare Workers จำกัด 20,000 ไฟล์/worker ⛔
ตอนนี้ deploy ~13,800 ไฟล์แล้ว เพิ่มอีกแค่ **1 ภาษาเต็ม (+~6,800)** ก็ทะลุเพดานทันที
**ทางแก้ (เลือกแล้ว): Language-shard Workers** — แยก worker ต่อภาษา + route ตาม path:
- `thailandaddict` (หลัก): th (root) + en + ชั้น hub ของทุกภาษา — เหมือนเดิม
- `thailandaddict-zh`: route `thailandaddict.com/zh/*` → เสิร์ฟหน้า zh ทั้งหมด
- `thailandaddict-ru`, `-ko`, `-ja`, `-he`, `-ar`, `-hi` แบบเดียวกัน
- แต่ละ worker มีงบ 20k ไฟล์ของตัวเอง · URL คนใช้ไม่เปลี่ยน (ยัง `/zh/...` เหมือนเดิม)
- deploy จากบัญชี chatmaliwan เท่านั้น (กติกาเดิม)

### 2.2 Astro build OOM ที่สเกลใหญ่ ⛔
13.6k หน้า กิน ~6.3GB native alloc แล้ว — build 61k หน้าในรอบเดียว = ตายแน่
**ทางแก้: build แยกต่อภาษา (env-gated routes)**
- เพิ่ม collections ต่อภาษาใน `content.config.ts` (`articles-zh`, `reviews-zh`, …)
- เพิ่ม route `src/pages/<lang>/[slug].astro` ต่อภาษา โดย `getStaticPaths()` เช็ค `process.env.BUILD_LOCALES` — ถ้าภาษานั้นไม่อยู่ในรอบ build ให้คืน `[]`
- รอบ build ต่อภาษา ≈ 6.8k หน้า ≈ ขนาดใกล้ build ปัจจุบันครึ่งเดียว → ปลอดภัย

### 2.3 วิดเจ็ตไทยฝังใน layout (ทุกภาษาโดนหมด)
"เก็บลงแผน / เก็บแล้ว / แผนของฉัน / ดูแผนเที่ยว" + aria-label lightbox ฝังฮาร์ดโค้ดใน `ArticleLayout.astro` — หน้า en ก็ยังโชว์ไทยอยู่ตอนนี้ **ต้องทำ layout เป็น locale-aware ก่อนปล่อยภาษาใหม่** (แก้ครั้งเดียว ได้ทุกภาษา — มี task chip ค้างอยู่แล้ว)

---

## 3. เฟสงาน

### Phase 0 — เคลียร์ฐาน + โครงสร้าง (งานสั้น ทำก่อน)
1. แปล 40 ไฟล์ `top10-attractions-*` ที่ค้าง → en ครบ 100% จริง (1 batch เดียว, pipeline Klook เดิม)
2. แก้วิดเจ็ต trip-planner ใน `ArticleLayout.astro` ให้ locale-aware (§2.3)
3. ตั้งโครง language-shard workers: `wrangler.jsonc` ต่อภาษา + route + สคริปต์ deploy (§2.1)
4. ตั้ง env-gated per-language build (§2.2)
5. Generalize validator (`validate-klook-en.mjs` → `validate-translation.mjs` รับ `<lang>` + Thai-leak + schema check)

### Phase 1 — ชั้น Hub ครบ 226 หน้า × 8 ภาษา (งานถูก เร็ว เห็นผลไว)
- `--collect` จากทั้ง 226 หน้า en (ไม่ใช่แค่ 39) → strings.json ใหม่ (คาด ~40–80k unique strings เพราะหน้า city/activities มี intro เฉพาะจังหวัด)
- zh/ru: แปลส่วนต่าง (TM เดิม 8.4k ใช้ต่อได้) → **zh/ru ครบ 226 หน้า**
- ko/ja/he/ar/hi: แปลเต็ม → **ทุกภาษามี hub ครบ** (แก้ปัญหา ar 4 หน้าค้างโดยอัตโนมัติ)
- RTL (he/ar): ตรวจ mirror layout จริงบนหน้า city ก่อนปล่อย
- deploy hub layer ได้เลยโดยไม่ต้องรอ content (ลิงก์จาก hub ไปบทความ fallback → en ไปก่อน)

### Phase 2 — Content เต็มภาษา: **zh ก่อน แล้ว ru**
- แปล 6,563 JSON docs → `*-zh` collections (batch ละ ~90 ไฟล์ ≈ 73 batches, validate ทุก batch)
- build shard + deploy `thailandaddict-zh` → **จีนครบทุกหน้าจริง**
- ทำซ้ำกับ ru

### Phase 3 — ko, ja
### Phase 4 — ar, he (RTL — บทความยาวต้องตรวจ mirror เพิ่ม)
### Phase 5 — hi

*(ลำดับภาษาอิงจำนวนนักท่องเที่ยวเข้าไทย: จีน > รัสเซีย(ยุโรปอันดับ1) > เกาหลี ≈ อินเดีย > ญี่ปุ่น > ตะวันออกกลาง/อิสราเอล — อินเดียส่วนใหญ่อ่านอังกฤษได้ จึงวาง hi ท้ายสุด · owner ปรับลำดับได้)*

### ระบบกันดริฟท์ (ถาวร ทุกเฟส)
บทเรียนจริง: เว็บโตแล้ว string ใหม่โผล่ → "100%" เก่าเน่าเงียบๆ (เคยเจอ +141 strings)
- ทุกครั้งก่อนประกาศครบ: `--collect` สด → diff → แปลส่วนต่างให้**ทุกภาษาที่ประกาศครบไปแล้ว** ไม่ใช่แค่ภาษาที่กำลังทำ
- เนื้อหาใหม่ทุกชิ้นหลังจากนี้ = ต้องแปล ×8 เป็นส่วนหนึ่งของ pipeline สร้างเนื้อหา ไม่ใช่งานตามหลัง

---

## 4. ประมาณการ (อิงตัวเลขจริงจากงาน Klook→EN)

ฐานอ้างอิง: 91 ไฟล์ ≈ 7.3M tokens ≈ 22 นาที → **~80k tokens/ไฟล์**

| งาน | ปริมาณ | ประมาณ tokens | wall-clock (ไม่รวมชนลิมิต) |
|---|---|---|---|
| Phase 0 (40 ไฟล์ + โครงสร้าง) | เล็ก | ~5M | 1–2 ชม. |
| Phase 1 hub ทุกภาษา | ~40–80k strings × 7 | ~40–80M | 1–2 วัน |
| Content **ต่อ 1 ภาษา** | 6,563 ไฟล์ ≈ 73 batches | **~500M** | ~30 ชม. รัน (จริง ~1 สัปดาห์/ภาษา เพราะ session limit) |
| Content × 7 ภาษา | ~510 batches | **~3.5B** | ~6–8 สัปดาห์ ทำต่อเนื่อง |

จุดที่กินงบ 90%+ = ชั้น content (Phase 2–5) — ถ้าอยากคุมงบ ตัดสินใจได้เป็นรายภาษา (เช่น zh/ru/ko/ja ทำ content เต็ม ส่วน he/ar/hi หยุดที่ hub layer ไปก่อน) แต่เป้าที่สั่งไว้ตอนนี้ = ทุกภาษาทุกหน้า

---

## 5. QA ต่อภาษา (gate ก่อน deploy ทุกครั้ง)
1. validator: ไฟล์ครบ · JSON valid · zero Thai-leak (ยกเว้น credit/URL) · schema ตรงต้นฉบับ
2. affiliate intact: Agoda `cid=1965862` · Klook `aid=121442` · Trip `Allianceid=6861268` · Booking `/go/b`
3. spot-check HTTP จริง ~15 URL/ภาษา + hreflang + canonical + `lang`/`dir`
4. RTL (he/ar): ตรวจ mirror + ฟอนต์ Noto ตระกูลถูกตัว
5. sitemap ต่อภาษา + ping search console

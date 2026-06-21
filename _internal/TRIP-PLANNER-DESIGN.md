# 🗺️ AI Trip Planner — Design Spec (v1)

> สถานะ: **ออกแบบ** (ยังไม่ build) · 2026-06-21 · ต่อยอดจาก wishlist (`ta_wishlist` localStorage) + `/feeds/*.json`
> เป้า: นักท่องเที่ยวกดบันทึก ที่เที่ยว/ที่กิน/ที่พัก → ตอบคำถามสั้น → AI จัดทริป day-by-day ละเอียด → ทุกอย่างลิงก์จอง (affiliate)

---

## 1. ทำไมฟีเจอร์นี้ (กลยุทธ์)
- เปลี่ยน wishlist (passive) → **funnel: intent → ทริป → การจอง** ทุกรายการในทริป = ลิงก์ affiliate (Agoda/Klook/12Go)
- **Moat**: ไม่มีเว็บท่องเที่ยวไทย static เจ้าไหนมี AI trip planner ที่ผูกกับ inventory จริง
- ใช้ `/feeds/*.json` ที่ทำไว้แล้วเป็น "candidate pool" → AI ใช้แต่ของจริงของเรา (honesty-locked, ไม่มั่ว)
- เก็บ email (save/share trip) = audience asset · ทริป URL แชร์ได้ = backlink + AEO

---

## 2. สถาปัตยกรรม (static site ทำได้จริง)
```
[Browser]
  localStorage ta_wishlist (typed: stay/eat/see)
  หน้า /trip  → ฟอร์มคำถาม + เรียก POST /api/plan
        │
        ▼
[Cloudflare Worker: /api/plan]   (เพิ่ม main script + route /api/*)
  1. รับ {saved[], prefs{}}
  2. โหลด candidate จาก /feeds/*.json → กรองตามจังหวัด → cap ต่อ type
  3. สร้าง prompt → เรียก AI (pluggable: Workers AI | Claude)
  4. validate JSON itinerary → คืน client
        │
        ▼
[Browser] render day-by-day + ปุ่มจอง + save/share/email
```
**ต้นทุน Worker:** หน้า .html = static asset เสิร์ฟตรง **ไม่นับเป็น Worker request (ฟรีเหมือนเดิม)** · นับเฉพาะตอนเรียก `/api/plan` (free 100k/วัน) → ต้นทุนคงที่ = 0 สำหรับ page views

### AI provider — pluggable (สลับได้ 1 ฟังก์ชัน)
```js
async function callAI(env, prompt) {
  // option A: Workers AI (ฟรี, ไม่ต้อง key)
  return env.AI.run('@cf/meta/llama-3.3-70b-instruct', { messages:[...], response_format:{type:'json_schema', json_schema: ITIN_SCHEMA} });
  // option B: Claude (คุณภาพสูงสุด) — สลับมาใช้ env.ANTHROPIC_KEY (Worker secret)
  // fetch('https://api.anthropic.com/v1/messages', { headers:{'x-api-key':env.ANTHROPIC_KEY,...}, body: tool-forced JSON })
}
```
- เริ่ม **Workers AI** (ฟรี+ไม่ต้อง key) เพื่อทดสอบ UX → สลับ Claude ทีหลังถ้าต้องการคุณภาพสูงสุด

### ต้นทุนเปรียบเทียบ (ประมาณ — เช็คล่าสุดตอนสมัคร)
| | Workers AI | Claude (Haiku) | Claude (Sonnet) |
|---|---|---|---|
| key | ไม่ต้อง | ต้อง | ต้อง |
| คุณภาพ | ดี (Llama 70B) | ดีมาก | ดีสุด |
| /ทริป | ~ฟรี (มี free tier/วัน) | ~$0.02 | ~$0.06 |
| 1,000 ทริป/เดือน | ~ฟรี–น้อยมาก | ~$20 | ~$60 |

> สมมติ 1 ทริป ≈ input 6k + output 3k tokens · 1 การจอง Agoda คอมมิชชัน > ค่าจัดทริปหลายพันครั้ง → ต้นทุน AI เล็กมากเทียบรายได้

---

## 3. Data model (localStorage)
ปัจจุบัน `ta_wishlist = [{slug,name,img,url}]` (โรงแรมอย่างเดียว)
**ใหม่:** เพิ่ม `type` + `city` + `province`
```json
[{ "slug":"...", "name":"...", "img":"...", "url":"...",
   "type":"stay|eat|see", "city":"chiang-mai", "province":"เชียงใหม่" }]
```
- migration: รายการเดิม (ไม่มี type) → ถือเป็น `stay`
- key เดิม `ta_wishlist` (backward-compatible)

---

## 4. Save buttons (ขยายจากของเดิม)
| หน้า | layout | type | มีปุ่มแล้ว? |
|---|---|---|---|
| รีวิวโรงแรม | ReviewLayout | stay | ✅ (เพิ่ม data-type/city) |
| ที่เที่ยว | ArticleLayout (type=attraction) | see | ➕ เพิ่ม |
| ร้านอาหาร (การ์ดใน eat-ranking) | RoundupLayout/restaurant block | eat | ➕ เพิ่ม ♡ ต่อการ์ด |
- ใช้ script localStorage toggle ตัวเดิม (shared) · ปุ่มส่ง `data-type` + `data-city`

---

## 5. หน้า "ทริปของฉัน" (/trip — พัฒนาจาก my-list.html)
**หลักการ UX (owner):** หน้ารีวิว/บทความ = **แค่กด Save** (ง่ายสุด) · คำถามทั้งหมดอยู่**เฉพาะหน้า /trip** ตอนจัดแผน

**ส่วนบน — ฟอร์มคำถามสั้น** (อยู่หน้า /trip เท่านั้น):
- 📍 จังหวัด (auto จาก saved + เพิ่มได้, multiselect)
- 📅 กี่วัน / กี่คืน
- 👥 กี่ท่าน + (มีเด็ก / ผู้สูงอายุ — optional)
- 🎚️ จังหวะ (pace): ชิล / สมดุล / อัดแน่น
- 🧭 **สไตล์/ความสนใจ (multi-select):** เที่ยวเมือง · ร้านอาหาร&คาเฟ่ · เก็บแลนด์มาร์ค · ธรรมชาติ *(ขยายได้: ทะเล/ช้อปปิ้ง/วัฒนธรรม/ไลฟ์กลางคืน)*
- 🚗 **การเดินทาง:** รถสาธารณะ · รถเช่า · ขับรถเที่ยวเอง
- 💰 งบ/วัน (optional) · 🛬 เริ่มจาก (optional)
- ปุ่ม **"ให้ AI จัดทริป"** → loading → itinerary

**ส่วนกลาง — ของที่บันทึก** จัดกลุ่ม 🏨 ที่พัก / 🍽 ที่กิน / 📍 ที่เที่ยว (การ์ด + ลบ + "ล็อก"=ห้ามตัด)

**ส่วนล่าง (หลังจัด) — itinerary** day-by-day (ดู §7)

---

## 6. /api/plan — prompt + candidate
- candidate: โหลด `/feeds/{attractions,restaurants,hotels}.json` → filter `province ∈ prefs.provinces` → cap (เช่น see 15, eat 10, stay 10 /จังหวัด)
- prompt (system): "คุณคือผู้วางแผนทริปไทย ใช้ **เฉพาะ** รายการที่ให้ (saved + candidate) ห้ามแต่งสถานที่ใหม่ · จัดตามภูมิศาสตร์ลดเวลาเดินทาง · **เน้น candidate ที่ตรง prefs.interests** (เที่ยวเมือง/ร้าน&คาเฟ่/แลนด์มาร์ค/ธรรมชาติ) · **วางแผนตาม prefs.transport** — รถสาธารณะ→วางรอบ BTS/MRT/เรือ/สองแถว + ข้ามจังหวัดแนะนำ 12Go; รถเช่า/ขับเอง→เส้นทางขับ+ที่ไกลขึ้นได้+เวลา parking+แนะนำรถเช่า+เตือน IDP · ประเมินเวลาเที่ยว/เดินทางตามภูมิศาสตร์ไทย + pace · เติมที่เที่ยว/ร้าน/โรงแรมจาก candidate ถ้าขาด · ถ้าโรงแรม < จำนวนคืน เลือกเพิ่ม (mark 'แนะนำ') · ตอบ JSON schema · ภาษา = prefs.lang"
- input: saved[], prefs{provinces,days,nights,pax,kids,pace,**interests[],transport**,budget,startFrom,lang}, candidates{see[],eat[],stay[]}
- บังคับ JSON ผ่าน response_format/tool

### Itinerary JSON schema
```json
{
  "title":"...", "summary":"...",
  "days":[{
    "day":1, "city":"เชียงใหม่",
    "items":[{ "time":"09:00", "kind":"see|eat|stay|travel",
      "name":"...", "slug":"...", "url":"...", "durationMin":120,
      "note":"...", "travelFromPrev":{"mode":"รถ","min":20,"note":"..."} }],
    "hotel":{"name":"...","slug":"...","url":"...","suggested":true}
  }],
  "addedSuggestions":[{"name","url","reason"}],
  "warnings":["จังหวัดไกลกัน อาจต้องตัดวัน..."]
}
```

---

## 7. Itinerary rendering (client)
- timeline ต่อวัน (เช้า/บ่าย/เย็น) แต่ละ item: ชื่อ (ลิงก์หน้าเรา) + เวลา + ระยะเวลา + note เดินทางระหว่างจุด
- โรงแรมต่อคืน (เด่น; ถ้า AI เลือกเพิ่ม → badge "แนะนำ")
- controls: เพิ่ม/ลบ item · "จัดใหม่" (regenerate) · ล็อกรายการ
- **ทุก item → ปุ่มจอง** (โรงแรม=Agoda, กิจกรรม=Klook, ข้ามจังหวัด=12Go, รถเช่า=partner)
- footer: **"สรุปการจอง"** · **"สร้าง infographic"** · "บันทึก/แชร์ลิงก์" (encode trip) · "ส่งเข้าอีเมล" (เก็บ email)

### 7b. "สรุปการจอง" (ไม่ใช่ checkout รวม)
> owner ตั้งข้อสังเกตถูก: รถเช่า/โรงแรม/ตั๋ว = คนละบริษัท → **รวม checkout เป็นปุ่มเดียวไม่ได้จริง**
แทนที่ด้วย **checklist รวมทุก item แยกตาม provider** (ผู้ใช้กดจองทีละเจ้า ง่ายและตรงไปตรงมา):
- 🏨 ที่พัก (N คืน) → ปุ่ม Agoda/Trip ต่อแห่ง
- 🎟️ กิจกรรม/ตั๋ว → ปุ่ม Klook/GYG ต่ออัน
- 🚐 เดินทางข้ามจังหวัด → 12Go · รถเช่า → partner
- ✅ checkbox ติ๊กว่าจองแล้ว (เก็บใน localStorage)

### 7c. Infographic สรุปทริป 1 หน้า (แชร์ได้ · มีโลโก้)
ปุ่ม **"สร้างภาพสรุปทริป"** → ภาพ 1 หน้า (1080×1350 IG-friendly):
- โลโก้ Thailandaddict (teal) + ชื่อทริป ("เชียงใหม่ 3 วัน 2 คืน") + จำนวนคน/สไตล์/การเดินทาง
- สรุปแต่ละวันแบบ timeline ย่อ (ไอคอน see/eat/stay + ชื่อย่อ)
- URL เว็บ + QR (optional)
- ดีไซน์แบรนด์: teal/coral/mango · Outfit · มนโค้ง
- **เทคนิค (client-side):** render infographic เป็น HTML/SVG ในหน้า → `html2canvas` (CDN allowlist: cdnjs/jsdelivr) หรือ Canvas API → export PNG → ปุ่ม "ดาวน์โหลด" + `navigator.share()` (มือถือ)
- **ผลพลอยได้:** แชร์โซเชียล = brand awareness + backlink ฟรี (โลโก้+URL ติดไปทุกภาพ)

---

## 8. เวลาเดินทาง (v1 vs v2)
- **v1:** AI ประเมินจากชื่อเมือง/ย่าน (รู้ภูมิศาสตร์ไทย เช่น กรุงเทพ→อยุธยา ~1.5ชม.) · จัดกลุ่มตามจังหวัด→sequence ในจังหวัด · ข้ามจังหวัด = note transport + ลิงก์ 12Go
- **v2:** เพิ่ม lat/lng ใน attractions/hotels (restaurant มี coords แล้ว) → คำนวณ haversine แม่น + แผนที่ + sequence อัตโนมัติ

---

## 9. Honesty / edge cases
- ใช้ **เฉพาะ content เรา** (saved + candidate) — ไม่แต่งสถานที่
- saved น้อย → เติมจาก candidate + บอกชัด
- โรงแรม < คืน → เลือกเพิ่ม (mark "แนะนำ")
- จังหวัดไกลเกินจำนวนวัน → warning + เสนอตัด

---

## 10. Phasing
**v1 MVP:** typed Save (3 layout, แค่กด ♡) → /trip + ฟอร์ม (วัน-คืน/คน/pace/**interests/transport**) → /api/plan (**Workers AI**, pluggable) → render day-by-day + เวลาเดินทาง + ปุ่มจองต่อ item + **"สรุปการจอง" checklist** + **infographic 1 หน้า (โลโก้+แชร์)** → deploy
**v2:** lat/lng + แผนที่ + เวลาแม่น · shareable trip URL · email capture · regenerate-section/ล็อก item · QR ใน infographic · สลับ Claude

---

## 11. ตัดสินใจแล้ว (owner · 2026-06-21)
1. ✅ AI = **Cloudflare Workers AI** ก่อน · pluggable สลับ Claude ทีหลัง 1 ฟังก์ชัน
2. ✅ **ไม่มี "จองทั้งทริป" รวม checkout** (คนละบริษัท) → "สรุปการจอง" checklist แยก provider
3. ✅ เพิ่ม **interests** (เที่ยวเมือง/ร้าน&คาเฟ่/แลนด์มาร์ค/ธรรมชาติ) + **transport** (รถสาธารณะ/รถเช่า/ขับเอง)
4. ✅ Save หน้ารีวิว = ง่ายสุด · คำถามอยู่หน้า /trip
5. ✅ มี **infographic สรุป 1 หน้า** + โลโก้ + แชร์
- เหลือ: URL = `/trip` (default) · **รอ go build v1**

---

## 12. Expert critique → v1 adjustments (2026-06-21 · 7 lenses, 63 recs)
> รายละเอียดเต็ม: `_internal/TRIP-PLANNER-CRITIQUE.md` · **ground จาก code จริง: feeds ไม่มีพิกัด/ไม่มี affiliate deep-link/ไม่มีเวลาเปิด-ปิด**

**Reframe ใหญ่:** v1 = **"trip briefing" (สรุปทริปที่เชื่อถือได้)** ไม่ใช่ schedule เป๊ะวินาที — เพราะไม่มีพิกัด การ fake "20 นาที" ผิดแล้วพังความเชื่อใจ (= พังการจอง) → ใช้ **ช่วงเวลา (range) + ลิงก์ Google Maps ต่อ leg + legend ความมั่นใจ** (saved / AI-suggested / ⚠️ยังไม่ verify)

**2 การตัดสินใจที่ gate ทุกอย่าง:**
1. **GA4 + UTM + custom events ก่อน launch** (form_start/plan_generated/booking_click[provider]/infographic_download/email) — ไม่มีก็วัดอะไรไม่ได้
2. **เก็บทริปเป็น server object ใน Workers KV ตั้งแต่ v1** (endpoint `/api/trips` → คืน tripId + shareUrl, TTL 30 วัน, link=สิทธิ์เข้าถึง) เก็บแค่ tripId ใน localStorage → **กันการ rewrite ตอนทำ app** (~6 ชม.ตอนนี้ vs เป็นสัปดาห์ทีหลัง) + เป็นฐานของ share/og:image/email/global

**ปรับตาม 5 มิติ:**
- **ง่าย:** empty-state + 3 quick-start template (ทำงานได้แม้ไม่ save อะไรเลย — อย่าบังคับ save ก่อน) · progressive disclosure (วัน→จังหวัด→style card รวม pace+interests→transport→optional) · loading UX จริง (skeleton+cycling) · itinerary mobile-first collapsible 48px
- **ได้ประโยชน์:** ทดสอบ Workers AI กับ 10 ทริปจริงก่อน — ถ้า <80% สลับ Claude Haiku (~$20/เดือน/1000 ทริป) · respect saved items (toggle ต้องมี/น่าสน/ตัด) · ถามเวลาเริ่มแต่ละวัน + late-arrival day 1 · validate province order
- **รายได้:** GA4 ก่อน · auto-insert SafetyWing (คอม 25-30%) + Airalo eSIM + Klook activities ต่อเมือง (10-15%) · เรียง booking checklist ตามค่าคอมมิชชัน · email capture จังหวะ intent สูง (หลัง render) · gate เฉพาะ provider ที่ signup แล้ว
- **app:** KV server-trips (ข้อ 2) · เก็บแค่ tripId · versioned ITINERARY_SCHEMA + validate ใน Worker · wrap localStorage ใน versioned accessor · logic อยู่ใน Worker/API (ไม่ฝังใน Astro page)
- **global:** **คนละ product/domain** — thailandaddict ผูกกับไทย (อย่า rebrand) · candidate-pool homegrown ไม่ scale global → ต้อง pluggable content provider (Booking/Google Places) + directions API จริง · sketch param `contentProvider='local'` ไว้ตอนนี้ build ทีหลังหลังไทยพิสูจน์ว่า funnel work

**ตัดออกจาก v1:** booking checkbox ปลอม (ติ๊กแล้วไม่เกิดอะไร) · per-item lock + regenerate-รายวัน (Llama ทำพัง) → เหลือ "จัด 1 ครั้ง" + "เริ่มใหม่" · server-side infographic (ใช้ html2canvas ฝั่ง client ไปก่อน) · Pro tier/PDF paywall (รอข้อมูล) · global rebrand · RTL

**Build sequence:** (1) pre-build gate: GA4+UTM live + owner signup affiliate + 10-trip AI test → เคาะ Workers AI/Haiku · (2) core: /api/trips บน KV + schema validate + timeout/fallback + travel-time ranges · (3) funnel: Save+toast+floating badge + /trip form progressive + empty-state + must-include · (4) output: mobile itinerary + legend/disclaimer + booking summary เรียงตามคอม + auto insurance/eSIM/activities + infographic (UTM/QR→tripId) + email · (5) วัดผล→v2: coords ตาม route ที่คลิกเยอะ, server infographic+og:image, edit/lock/regenerate, offline PDF (หลัง scrub data), แล้วค่อยพิจารณา Pro + global product

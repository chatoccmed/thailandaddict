# Image Sourcing Standards (mandatory · ทุกรูปต้องผ่าน)

**Why this matters:** F1 audit Taiwan ปลาย พ.ค. 2026 พบรูปผิดเมือง/ผิดประเทศ ~155 ใบ (Eiffel Tower แทน Taipei · Bali villa แทน Penghu · Mexico beach แทน Kenting) · Japan city-images audit พบ 15/21 = 71% wrong · Image fraud = trust collapse + Google penalty + อาจถูกฟ้องจากเจ้าของรูป

ทุกรูปในทุก roundup ต้องผ่าน **5-step verification + correct source tier** ก่อน commit

อ่านรายละเอียดเต็มที่ `_internal/HOTEL-IMAGE-POLICY.md` (228 บรรทัด · workflow + scripts + tier examples)

---

## A. หลักการ (Non-negotiable)

1. **Self-host เสมอ** — download → save to `astro/public/images/hotels/[city-slug]/` · ห้าม hotlink CDN ของ Booking/Agoda/Trip/Unsplash/Wikimedia
2. **รูปจริงของโรงแรม > stock** เสมอ · ถ้าหารูปจริงได้ ห้ามใช้ stock
3. **ถ้าใช้ stock** (เฉพาะ hero ของ landing page · ไม่ใช่ per-card) ต้อง disclose ชัดเจน
4. **License ต้องถูกต้อง** — Fair Use สำหรับ review (small size + back-link) · หรือ CC-BY/SA/PD สำหรับ landing hero
5. **ห้ามรูปผิดเมือง/ผิดประเทศ** เด็ดขาด · auditor zero tolerance

---

## B. Source Hierarchy — ลำดับการใช้ (Owner-mandated · strict)

**Owner direction (27 พ.ค. 2026):** รูป roundup card **ต้องเป็นรูปจริงของโรงแรมจาก Trip.com ก่อน** · ถ้าไม่มีให้ใช้รูปจากเว็บโรงแรมเองเท่านั้น · ห้ามใช้ Wikipedia / stock สำหรับ roundup card · เพื่อความถูกต้องสูงสุด (รูปแขกใช้ตัดสินใจจอง)

### Tier 1 — Trip.com Hotel Detail Page (default · ใช้เป็นหลักทุก roundup card)

Trip.com มีรูปจริงของโรงแรม upload โดยเจ้าของหรือถ่ายจริง · คุณภาพสูง · ใช้ pattern URL ที่ถูกได้รูป unwatermarked

**วิธีหา:**

```
# 1. ค้น Trip.com สำหรับโรงแรม
https://www.trip.com/hotels/list?city=228&keyword=Aman+Tokyo

# 2. คลิก hotel detail
https://www.trip.com/hotels/tokyo-hotel-detail-1234567/aman-tokyo

# 3. หา image ID จาก source HTML หรือ Network tab
# 4. ใช้ unwatermarked pattern (ค้นพบ 27 พ.ค. 2026)
https://ak-d.tripcdn.com/images/{id}_Z_1280_853_R50_Q90.jpg
```

**Image quantity:**
- รูปที่ 1 (`[slug].jpg`) = exterior หรือ hero shot (สำหรับ roundup card · review hero)
- รูปที่ 2-4 = room interior · lobby · amenity (สำหรับ review page gallery · roundup ใช้แค่รูปที่ 1)

**Image quality criteria:**
- Exterior ที่เห็น facade · ป้ายโรงแรม · landmark รอบ (ยืนยันตำแหน่งถูกเมือง)
- ≥1024px wide · ไม่ blur · ไม่ over-exposed
- ห้ามรูปที่มี watermark Trip.com / Booking / Agoda

### Tier 2 — Official Hotel Website (fallback เมื่อ Trip ไม่มี)

ถ้า Trip.com ไม่มีรูป (B&B เล็กๆ · property ใหม่ยังไม่ list):

1. Google "{hotel name} official website" · click first result
2. **Verify URL ตรง brand domain** (aman.com · ไม่ใช่ blog ใคร · ไม่ใช่ booking.com)
3. ดูหน้า homepage / gallery / rooms
4. ดาวน์โหลด og:image หรือรูปจาก gallery page
5. Fair use OK สำหรับ review purpose · size ≤1600px · back-link to hotel

### OTA fallbacks อื่น (เฉพาะกรณี Trip + Official ไม่ได้)

- **Cloudbeds direct booking page** (สำหรับ B&Bs เล็กที่ไม่ใช่ chain · bypass JS render):
  ```
  https://hotels.cloudbeds.com/reservation/[slug]
  ```
- **Booking.com hotel detail · เฉพาะ og:image** (มี watermark น้อยกว่า Agoda)

### ⚠️ ห้ามทำ

- ❌ ใช้ Wikipedia/Wikimedia สำหรับ roundup card (license ปลอดภัย · แต่ image อาจไม่ตรงปัจจุบัน · ใช้เฉพาะใน review hub page background ได้ ไม่ใช่ roundup card)
- ❌ ใช้ Stock photo สำหรับ roundup card · ทุกกรณี
- ❌ ใช้ generic Unsplash "luxury hotel room" สำหรับโรงแรมจริง · เป็นการหลอก
- ❌ ใช้ OTA search results page (ได้แต่ logo)

### ข้อยกเว้น stock acceptable

- รูป hero ของ roundup landing page (ภาพ skyline city) ใช้ Unsplash CC ได้ · เป็นรูป atmospheric ไม่ใช่ของโรงแรมใด
- รูป section divider (icon · texture) — ไม่ misleading

---

## C. 5-Step Per-Image Verification

ทุกรูปก่อนใส่ใน roundup ต้องผ่าน 5 ข้อ:

| Step | Check | วิธี | Pass criterion |
|---|---|---|---|
| 1 | **License** | ดูแหล่งที่มา · Commons license tag · Unsplash license · Trip fair use | Free Commercial · Fair Use review · CC license |
| 2 | **Self-host** | ไฟล์อยู่ใน `astro/public/images/hotels/` ของ repo | ไม่มี URL ภายนอกใน HTML/JSON |
| 3 | **Subject match** | Read tool ดูภาพ · เทียบ Google Maps Street View ของโรงแรมจริง | exterior match · ป้าย / facade ตรง |
| 4 | **City/region match** | ถ้าเป็น exterior · landmark รอบโรงแรมต้องเป็นเมืองนั้น | ห้าม Eiffel ในรูปไทเป · ห้าม Mt Fuji ใน Sapporo |
| 5 | **Size + quality** | File size · resolution · compression | 60-500KB · 1024-1600px wide · JPEG q82+ |

**Auditor enforcement:** `tourlogy-quality-auditor` ใช้ Read tool ดูภาพทุกใบ · ถ้าตก step 3 หรือ 4 = flag · ห้าม publish

---

## D. File Organization

```
astro/public/images/hotels/
├── tokyo/
│   ├── aman-tokyo.jpg          # primary (hero)
│   ├── aman-tokyo-2.jpg         # gallery #1
│   ├── aman-tokyo-3.jpg         # gallery #2
│   └── aman-tokyo-4.jpg         # gallery #3
├── osaka/
├── kyoto/
└── [city-slug]/
```

**Naming:**
- `[hotel-slug].jpg` = primary
- `[hotel-slug]-2.jpg` to `-4.jpg` = gallery
- Use lowercase · hyphens · ASCII only (no Thai/Japanese in filenames · breaks deploy)

**Roundup card image:** ใช้ primary `[hotel-slug].jpg` เพียงรูปเดียว · ไม่ embed gallery (เก็บไว้สำหรับ review page เต็ม)

---

## E. Hard Exclusion Rules — รูปต้องไม่ใส่เด็ดขาด

1. ❌ **Image of different city/country** (Eiffel for Taipei · Mt Fuji for Sapporo · Bali for Penghu)
2. ❌ **Image of different hotel** (Hilton-branded image used for Marriott property)
3. ❌ **Rendering / CGI** ที่ยังก่อสร้างไม่เสร็จ
4. ❌ **Watermarked image** (Booking.com logo · Trip.com watermark)
5. ❌ **Copyrighted image without proper license** (Getty · Shutterstock · ภาพข่าว)
6. ❌ **Stock image without disclosure** (ทุก stock ต้องมี alt + intro disclose)
7. ❌ **Image >500KB** หรือ resolution <1024px wide (UX + Core Web Vitals)
8. ❌ **HTML-disguised-as-JPG** files (404 pages saved as .jpg · ตรวจด้วย `file` command)

---

## F. Anti-pattern Catalog (จากประวัติพลาดของ Wherebest)

| Anti-pattern | ตัวอย่างจริง | ผลกระทบ |
|---|---|---|
| **False Wikipedia match** | "Tokyu Stay Sapporo" → Wikipedia rederected to "Hokkaido Nippon-Ham Fighters" · ใช้รูปทีมเบสบอล | F1 audit deleted · trust loss |
| **Wrong-city auto-fetch** | sapporo-1.jpg = Chureito Pagoda + Mt Fuji (จริงๆ ที่ Yamanashi) | Japan-cities audit · 15/21 wrong |
| **OTA placeholder swapping** | Sapporo agent ใช้รูป tokyo-sushi เป็น sapporo-kaisendon | Inline cleanup needed |
| **Stock without disclose** | "Aman Tokyo" header photo = generic luxury hotel from Unsplash · ไม่บอกว่า stock | Misleading · F1 audit flagged |
| **Renderings as real photos** | Hotel เปิดใหม่ใช้ architectural rendering · ลูกค้าถึงเจอตึกยังไม่เสร็จ | Refund + complaint |
| **HTML-as-JPG** | Wikimedia 404 error page saved with .jpg extension · 2KB · เปิดในเบราเซอร์เป็น HTML | Image broken · sitewide |
| **Watermarked images** | Booking.com logo มุมขวาล่างทุกรูป | Copyright violation · ลด trust |

---

## G. Verification Workflow

```
agent: tourlogy-roundup-builder picks 10 hotels for roundup
  ↓
For each hotel:
  1. Try Trip.com Hotel Detail (Tier 1) · unwatermarked pattern
  2. Try official hotel site (Tier 2) · og:image
  3. If neither: try Cloudbeds (Tier 3 fallback)
  4. If still nothing: flag the hotel · exclude from roundup OR mark "no image · ติดต่อโรงแรม"
  ↓
For each downloaded image:
  Run 5-step verification (license · self-host · subject match · city match · size)
  ↓
  If fail step 3-4 (subject/city mismatch) → discard · try next source
  If fail step 5 (size) → resize via PowerShell System.Drawing or sharp
  ↓
Save to astro/public/images/hotels/[city]/[slug].jpg
  ↓
Add `image_source` field in roundup JSON entry:
{
  "name": "Aman Tokyo",
  "image": "/images/hotels/tokyo/aman-tokyo.jpg",
  "image_source": {
    "tier": 1,
    "url": "https://ak-d.tripcdn.com/images/0223...jpg",
    "license": "Fair Use · review",
    "verified_date": "2026-05-27",
    "subject_match": "verified · matches official aman.com hero"
  }
}
  ↓
Auditor reviews · sample 30% of images with Read tool · spot-check city match
  ↓
If all pass → commit
```

---

## H. Stock Disclosure (เฉพาะ landing hero · ไม่ใช่ per-card)

ถ้าใช้ stock photo เป็น hero ของ roundup landing page (skyline city · atmospheric):

```html
<img src="/images/heroes/tokyo-skyline.jpg" 
     alt="Tokyo skyline at dusk · ภาพประกอบ atmosphere ของเมือง">
```

หรือถ้า really must use stock per-card (edge case · B&B ไม่มีรูปเลย):

```html
<aside class="stock-disclosure">
💡 รูปบางส่วนเป็นภาพประกอบสไตล์ · ดูภาพจริงของโรงแรมที่ลิงก์จองด้านล่าง
</aside>
```

**Default:** ไม่ใช่ stock per-card · ถ้าโรงแรมไม่มีรูป Tier 1+2 = exclude จาก roundup

---

## I. Quarterly Image Refresh

ทุก 3 เดือน · top 20% high-traffic roundups:
- Re-check ทุกรูปยัง accessible (self-host file มีอยู่จริง)
- หา upgrade รูปที่ดีกว่า (Trip ใหม่ · official ใหม่)
- Update `verified_date` ใน `image_source` field
- ตรวจรูป exterior ยังตรงหน้าตึก (ถ้า hotel ทำ renovation · facade เปลี่ยน)

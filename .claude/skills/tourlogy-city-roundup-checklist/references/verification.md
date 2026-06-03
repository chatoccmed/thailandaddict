# Hotel Verification Standards (mandatory · world-class)

**Why this matters:** Wherebest แนะนำโรงแรมให้คนตัดสินใจไปจองและพักจริง · ถ้าข้อมูลผิด คนเข้าพักอาจเสียเงิน เสียวันหยุด หรือบาดเจ็บ (แนะนำว่า accessible แต่ไม่มี ramp · แนะนำว่า halal แต่ไม่มี · แนะนำว่า near station แต่ไกล 2 กม.) · นี่คือมาตรฐานความรับผิดชอบที่ทุก roundup ต้องผ่านก่อน publish

## Master rule: Verify Before Publish

ทุกโรงแรมในทุก roundup ต้องผ่าน **8-step verification + per-category criteria + 8 hard exclusion rules** ก่อนใส่ในการ์ด · ห้ามใส่โรงแรมที่ verify ไม่ครบ แม้ score จะดูดี — ถ้าข้อสำคัญข้อใดข้อหนึ่งล้มเหลว = exclude

---

## A. Sources Hierarchy (ลำดับความน่าเชื่อถือ)

### Tier 1 — Authoritative (ใช้เป็นหลัก)
1. Official hotel website (facilities page · room types · pet policy · accessibility statement)
2. Brand HQ (marriott.com · ihg.com · hilton.com · hyatt.com · accor.com)
3. Tourism authority registry (Japan Halal Association · Japan Accessibility certification · UK Tourism Board)

### Tier 2 — Cross-validation (ตรวจซ้ำ)
4. Booking.com (score · review count · current availability · facilities tags)
5. Agoda (score · review count · facilities)
6. Trip.com (score · review count · facilities)
7. TripAdvisor (score · recent reviews · forum discussions · "Travellers' Choice" markers)

### Tier 3 — Corroboration (ยืนยัน)
8. Google Maps (verify location · walking time · Street View exterior)
9. Google Reviews (latest 50 reviews scan)
10. Wikipedia (for major hotels · ownership · history)
11. Recent travel blogs (within 12 months)

### Tier 4 — Red Flag Detection (เช็คเสีย)
12. Google News ("[hotel name] news" · last 6 months for scandals, closures, food poisoning, fires)
13. TripAdvisor "lowest" reviews (sort by recency · scan complaints from last 90 days)
14. Government health/safety register if available

---

## B. The 8-Step Per-Hotel Verification Checklist

ทุกโรงแรมต้องผ่าน 8 ข้อนี้ครบก่อนใส่ใน roundup · ตกข้อสีแดง 1 ข้อ = exclude · ตกข้อสีเหลือง 2+ = exclude

| # | Check | Source | Pass criterion | ระดับ |
|---|---|---|---|---|
| 1 | **Existence** — โรงแรมมีอยู่จริง ไม่ใช่ fabrication | Booking + Agoda + Trip อย่างน้อย 2 + official site | ชื่อตรง · address ตรง · operational status: open | 🔴 critical |
| 2 | **Operating status** — เปิดรับจองในอีก 6 เดือนข้างหน้า | Booking listing (search dates +6 months) | มี availability + ราคาแสดง | 🔴 critical |
| 3 | **Cross-platform score** — คะแนนเฉลี่ยมาตรฐาน | Booking + Agoda + Trip | ค่าเฉลี่ย ≥8.0 (general) หรือ ≥9.0 (luxury/signature) · ไม่มี platform ใดต่ำกว่า 7.0 | 🔴 critical |
| 4 | **Review volume** — มีคนพักจริงพอ | Total across 3 platforms | ≥100 reviews รวม (general) หรือ ≥500 (anchor #1 popular) | 🟡 important |
| 5 | **Review recency** — รีวิวสด ไม่ใช่ ghost | TripAdvisor + Booking sort by date | ≥50% reviews ภายใน 18 เดือนล่าสุด | 🟡 important |
| 6 | **Category fit** — ตรงเกณฑ์ roundup นี้จริงๆ | Official facilities + Booking tags + photos | ผ่าน category-specific criteria (Section C) | 🔴 critical |
| 7 | **Red flag scan** — ไม่มีปัญหา critical recent | Google News + TripAdvisor recent low reviews | ไม่มี: ปิดสาขา · ไฟไหม้ · food poisoning · safety order · construction หนัก ใน 6 เดือน | 🔴 critical |
| 8 | **Photo cross-check** — รูปจริง · ไม่ใช่ stock | Google Street View exterior + Booking gallery cross-reference | exterior match · facade ตรง · ไม่มี wrong-city like Mt Fuji-as-Sapporo | 🟡 important |

---

## C. Per-Category Specific Criteria

นอกจาก 8 ข้อหลัก แต่ละ category มี requirement เฉพาะ:

| Roundup | Specific verification |
|---|---|
| **#1 Popular** | ≥500 reviews · score ≥8.5 · top 30 on Booking by review-count for the city |
| **#2 Near station** | ≤500m straight-line OR ≤8 min walk (Google Maps verified) · ห้ามแค่ "near station" claim |
| **#3 Near airport** | ≤5km drive OR provides verified airport shuttle (check official page) |
| **#4 Near shopping** | ≤500m from main shopping street/mall (Google Maps · pin to specific landmark) |
| **#5 Near landmark** | ≤1km from named landmark (Google Maps verified · ไม่ใช่ "close to" claim) |
| **#6 Couples** | No "ห้ามเด็กต่ำกว่า X" rule UNLESS adults-only (mark explicitly) · มี romantic amenity (king bed default · jacuzzi/spa/view) |
| **#7 Family 3-4** | มี family room ≥30 sq.m · sleeps ≥4 confirmed · extra bed policy stated |
| **#8 Family with kids** | Confirmed: baby cot + crib + kids meal + stroller-friendly · Disney area = priority for Tokyo |
| **#9 Budget** | Price ≤country-specific budget threshold (Tokyo ¥10K · Bangkok ฿1.5K · Paris €120) · score ≥7.5 · 24hr reception |
| **#10 Solo** | Single room OR small double · 24hr reception · public transit access |
| **#11 Women solo** | Verified: 24hr reception · well-lit safe street (Street View at night) · ≤5 min walk from busy MRT/JR · female-only floor IF claimed must be on official site |
| **#12 Business** | Work desk + fast Wi-Fi (≥100 Mbps stated or guest reviews confirm) · meeting/conference facilities OR co-working space in building |
| **#13 Luxury** | Verified 5★ from official brand OR independent equivalent (Aman · Six Senses) · score ≥9.0 · price typically top 10% of city · concierge + 24hr room service |
| **#14 Signature** | Confirmed signature feature in official photos AND ≥3 recent guest reviews mention it (e.g. "Mt Fuji view from room" · "private onsen in suite") · ไม่ใช่ marketing claim ลอยๆ |
| **#15 Accessibility** | Specific accessible room category listed on Booking · roll-in shower confirmed via photo · barrier-free path from entrance verified |
| **#16 Older travellers** | Lift in all guest floors · ground floor option · near hospital (≤2km) preferred · gentle stair-free entrance |
| **#17 Design** | Architect named OR design award (Wallpaper · Dezeen · ArchDaily · Design Hotels member) OR distinct design DNA verifiable in 5+ photos |
| **#18 Newly opened** | Opening date verifiable on hotel official site OR brand press release · within last 12-18 months · ห้ามใส่ที่เปิดมา ≥2 years |
| **#19 Cross-platform highest** | TripAdvisor ≥9.0 + Booking ≥9.2 + Agoda ≥9.2 simultaneously · review counts ≥200 ทุก platform |
| **#20 Long-tail** | ผ่านเกณฑ์ของ niche นั้น (Disney = ≤2km Maihama · Onsen = บ่อจริงในตึก · Akihabara = ≤500m จาก Akihabara Station) |
| **#21 Long-stay** | Monthly rate published OR weekly rate available · kitchenette confirmed · washer in-unit OR on premises · workspace |
| **#22 Pet-friendly** | Pet policy on official site (NOT just "pet-friendly tag on Booking") · weight limit stated · extra fee stated · designated pet rooms |
| **#23 Halal** | Halal certified (preferred — list certificate) OR confirmed: qibla direction sign + prayer room/mat + halal breakfast + alcohol-free mini-bar · check Japan Halal Association list for Japan hotels |
| **#24 Ryokan / B&B** | Traditional ryokan with tatami + futon + onsen (not just "Japanese-style room" claim) · OR licensed B&B with owner-operated proof |
| **#25 Breakfast included** | Breakfast confirmed included in standard room rate (not just "available for fee") · check Booking rate plans |
| **#26 Decision content** | All facts cross-verified · prices accurate within 10% · subjective claims attributed ("guests on TripAdvisor say...") |

---

## D. Verification Audit Trail

ทุก hotel entry ใน roundup JSON ต้องมี `verification` field:

```json
{
  "name": "Aman Tokyo",
  "verification": {
    "verified_date": "2026-05-27",
    "verified_by": "tourlogy-roundup-builder agent",
    "sources_checked": [
      "https://www.aman.com/hotels/aman-tokyo",
      "https://www.booking.com/hotel/jp/aman-tokyo.html",
      "https://www.agoda.com/aman-tokyo",
      "https://www.trip.com/hotels/aman-tokyo",
      "https://www.tripadvisor.com/Hotel_Review-Aman_Tokyo"
    ],
    "scores": {
      "booking": 9.5,
      "agoda": 9.4,
      "trip": 9.6,
      "tripadvisor": 9.5
    },
    "review_counts": {
      "booking": 850,
      "agoda": 420,
      "trip": 380
    },
    "category_fit_evidence": "Booking lists 'Luxury Hotels' category · Aman brand · 5-star · price ¥150K+/night",
    "red_flag_scan": "Cleared (no news 6mo)",
    "notes": "All 8 verification steps passed"
  }
}
```

**ทำไมต้องเก็บ:** ถ้ามีปัญหาภายหลัง (guest ร้องเรียน) เปิด audit trail ดูได้ว่า verify จากที่ไหน เมื่อไหร่

---

## E. Hard Exclusion Rules (ห้ามใส่เด็ดขาด)

โรงแรมในกลุ่มนี้ **ห้าม** ใส่ใน roundup ไม่ว่ากรณีใด:

1. ❌ **Score <7.0 on any major platform** (Booking/Agoda/Trip) — แม้คะแนนเฉลี่ยจะดี
2. ❌ **<30 total reviews** — ข้อมูลไม่พอตัดสิน
3. ❌ **ไม่พบบน 2 ใน 3 OTAs** (Booking + Agoda + Trip) — สงสัยว่ามีจริงหรือไม่ (= New Alisan Hot Spring Motel pattern)
4. ❌ **News scandal/safety in last 6 months** (fire · health violation · serious crime in property)
5. ❌ **Permanently closed** หรือ **closed for renovation >6 months ahead**
6. ❌ **Address ไม่ match** ระหว่าง OTA listings (สงสัย fabrication)
7. ❌ **Photos รวมรูปจากเมือง/ประเทศอื่น** ใน gallery (= image fraud)
8. ❌ **Brand mismatch** — ใช้ชื่อแบรนด์ที่ไม่ได้เป็น franchise จริง (เช่น "Sotetsu Hotel Toraku Fukuoka" ที่ Sotetsu ไม่มี brand "Toraku")

---

## F. Verification Workflow

```
agent: tourlogy-roundup-builder receives task "build #13 luxury Tokyo"
  ↓
1. Search Booking/Agoda/Trip for "Tokyo luxury hotels" · pull top 30 by review-count
  ↓
2. For each candidate, run 8-step Verification Checklist (B)
  ↓
3. Apply category-specific criteria (C)
  ↓
4. Apply Hard Exclusion Rules (E) · drop fails
  ↓
5. From cleared pool, rank by merit (score · reviews · standout · brand)
  ↓
6. Pick top N (10 for anchor · 5 for niche)
  ↓
7. Write description per hotel WITH "verification" field populated (D)
  ↓
8. Write roundup JSON with all N + comparison table + FAQ
  ↓
quality auditor: tourlogy-quality-auditor reviews
  ↓
9. Spot-check 2-3 hotels: re-verify steps 1-6 independently
  ↓
10. Pass to orchestrator for commit
  ↓
orchestrator (optional): manual spot-check 1 hotel
  ↓
commit + push
```

---

## G. Quarterly Re-verification

ทุก 3 เดือน · top 20% high-traffic roundups (ตาม analytics):
- Re-run 8-step check ทุก hotel
- Update `verified_date` field
- Drop hotels ที่ตก criteria + replace with new candidate
- ถ้า roundup เปลี่ยน >30% ของ entries = mark "Major refresh" + ปรับ slug-date

---

## H. Owner / Reviewer Escalation Triggers

ถ้าพบสิ่งเหล่านี้ระหว่าง verification → **หยุด · escalate to owner ก่อนใส่ใน roundup:**

1. โรงแรมมีข้อมูล/รีวิวที่ขัดแย้งกันระหว่าง platforms มาก (Booking 9.4 · Agoda 6.8)
2. รีวิวล่าสุด 30 วันมีข้อร้องเรียนซ้ำเรื่องเดียวกัน ("ห้องสกปรก" 5+ คน)
3. address บน Booking vs Agoda ต่างกัน (อาจเป็นคนละโรงแรม)
4. ภาพถ่ายดูเหมือน rendering ไม่ใช่ photo จริง (ยังก่อสร้างไม่เสร็จ)
5. โรงแรมเป็น chain ใหม่ที่ไม่มี Wikipedia / brand HQ page

**Owner หรือ senior reviewer ตัดสินใจขั้นสุดท้าย**

---

## I. Trade-off: ความเร็ว vs ความถูกต้อง

**ไม่มี short-cut** — 8-step + per-category criteria เพิ่มเวลา ~10-15 นาที per hotel · 1 roundup = 5-10 hotels × 15 นาที = **~1.5-2.5 ชม. ต่อ roundup**

**ยอมรับ trade-off นี้** เพราะ:
- ข้อมูลผิด 1 ครั้ง เสีย trust กับผู้อ่านทั้งหมด · กู้คืนยาก
- คดี / ร้องเรียน / รีฟันด์ = cost สูงกว่าเวลา verify หลายเท่า
- Wherebest อยากเป็น **standard-setter ระดับโลก** ไม่ใช่ travel blog content-mill
- competitive moat: เว็บคู่แข่งส่วนใหญ่ scrape OTAs ไม่ verify · เราต่างที่จุดนี้

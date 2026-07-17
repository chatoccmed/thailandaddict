# 📕 แนวทางถาวร: Booking.com Affiliate ผ่าน CJ (LOCKED — 2026-07-05)

> เอกสารนี้คือแนวทางที่ owner อนุมัติ หลังตรวจสอบร่วมกับ setup ที่พิสูจน์รายได้จริงของเว็บ TopOfHotel
> **ห้ามย้อนกลับไปใช้ `?aid=` เด็ดขาด** — เคยทำหาย 2 รอบเพราะความเข้าใจผิดเรื่องนี้

## ข้อเท็จจริงหลัก
- Booking.com **ปิดรับ affiliate สมัครตรง**แล้ว — publisher ไทยต้องผ่าน **CJ (Commission Junction)** เท่านั้น
- คลิกจะนับคอมมิชชั่น **ก็ต่อเมื่อวิ่งผ่านโดเมน tracking ของ CJ** (`anrdoezrs.net` / `dpbolvw.net` / `jdoqocy.com` / `kqzyfj.com` — ใช้ตัวไหนก็ได้ เราใช้ anrdoezrs)
- พารามิเตอร์ `?aid=1670294` / `?aid=1184256` ที่อยู่ในโพสต์เก่า (`_internal/migration/oldposts/`) คือโปรแกรมเดิมที่**ตายแล้ว ไม่จ่ายเงิน** และถ้าติดอยู่ใน destination อาจแย่ง attribution กับ CJ — **ห้ามมีในเนื้อหา**

## ค่า LOCKED ของเรา
| ค่า | ตัวเลข | มาจากไหน |
|---|---|---|
| CJ Publisher/Website ID (PID) | `101809619` | บัญชี CJ ของเรา (ThailandAddict) |
| Advertiser | Booking.com APAC (CID `7854081`) | join แล้วใน CJ |
| Ad/Link ID ที่ใช้ | `17289009` | text link ถาวรในบัญชีเรา (**ห้ามใช้ `17289010`** — Getaway deals หมดอายุ 1 ต.ค. 2026) |

## ฟอร์แมตลิงก์ (click format — ที่ CJ แจกปัจจุบัน + พิสูจน์รายได้จริง)
```
https://www.anrdoezrs.net/click-101809619-17289009?sid=<slug ของหน้า>&url=<URL โรงแรม encode แล้ว>
```
- `sid` = slug ของหน้า (หน้า EN เติม `en-` นำหน้า, hub = ชื่อไฟล์, index = `home`) → ดูรายได้รายหน้าได้ที่ **CJ → Reports → Performance by SID**
- `url` = URL โรงแรม **ตรงตัว** ของเรา (`booking.com/hotel/th/x.html`) ผ่าน `encodeURIComponent` เสมอ
  - เราได้เปรียบเว็บอื่น: มี URL ตรง 10,003 ลิงก์ ไม่ต้องใช้ทริค `searchresults?ss=ชื่อ, เมือง` (ทริคนั้นไว้ใช้เฉพาะกรณีไม่รู้ URL)
- ❌ ฟอร์แมตเก่า `links/PID/type/dlg/...` — redirect ได้แต่ไม่มีหลักฐานการจ่ายเงิน guard จะ FAIL ถ้าเจอ

## สถาปัตยกรรม (แก้ที่เดียว)
```
content JSON (canonical ไม่มี aid) → ห่อตอน render → ผู้ใช้คลิกลิงก์ CJ → redirect เข้าหน้าโรงแรมตรงตัว
```
จุดที่ห่อ (ค่าคงที่ `CJ_PID` / `CJ_ADID` อยู่หัวไฟล์ทุกตัว — เปลี่ยนโปรแกรม/เลขเมื่อไหร่ แก้ 4 ไฟล์นี้แล้ว rebuild):
1. `astro/src/layouts/ReviewLayout.astro` — `cjBooking()` ห่อ**ทุกปุ่ม** (Agoda/Booking/Trip/hero) เพราะบางโรงแรม (เช่นไม่มีบน Agoda) เอา URL booking.com มาใส่ช่องอื่น — ฟังก์ชันแปลงเฉพาะ booking.com URL อื่นผ่านเฉย ๆ
2. `astro/src/layouts/RoundupLayout.astro` — `cjBooking()` เหมือนกัน
3. `_internal/gen-hubs.mjs` — `cjB()` ทุก emitter (hotelCards + affcards)
4. `_internal/qa/wrap-booking-cj.mjs` — post-process หน้า static ใน `astro/public` (idempotent, migrate ฟอร์แมตเก่าให้ด้วย)

## 🛡️ Guard — รันก่อน deploy ทุกครั้ง (กัน "รอบที่ 4")
```bash
node _internal/qa/check-booking-cj.mjs astro/dist     # หรือ ~/ta-build-temp/dist หลัง build-test
```
FAIL ทันทีถ้า: content มี aid=/label= · hub มีลิงก์ booking ดิบ · dist มี CTA ดิบหรือฟอร์แมต dlg ค้าง · ลิงก์ CJ < 4,000
(พิสูจน์ผลงานแล้ววันแรก: จับ 10 ลิงก์หลุดจากช่อง agodaUrl ที่แอบเก็บ URL booking.com)

## Do / Don't
- ✅ เนื้อหาใหม่ทุกชิ้น: เก็บ URL booking.com แบบ**สะอาด** (ไม่มี query) — ระบบห่อให้เองตอน build
- ✅ อยากเปลี่ยน Ad ID (เช่นสร้าง text link "Hotels homepage" ใหม่ใน CJ): แก้ `CJ_ADID` ใน 4 ไฟล์ข้างบน → build → deploy
- ❌ ห้ามใส่ `aid=` / `label=` ใน booking.com URL ในเนื้อหา (guard จะ fail)
- ❌ ห้ามลิงก์ booking.com ตรง ๆ ใน HTML/บทความ (ต้องผ่าน wrapper)
- ℹ️ Agoda (`cid=1965862`) / Trip (`Allianceid=6861268&SID=312919111`) / Klook (`aid=121442`) **ยังใช้ระบบเดิม ไม่เกี่ยวกับ CJ**

## ทางเลือกอนาคต (ยังไม่ทำ)
- `/go/b` route บน Cloudflare Worker แบบ TopOfHotel (แก้เลขโดยไม่ต้อง rebuild + ซ่อนเลขจาก HTML) — ทำได้ แต่แตะ worker ที่เสิร์ฟทั้งเว็บ ความเสี่ยงสูงกว่า ประโยชน์เพิ่มน้อยเพราะเรา rebuild เป็นประจำอยู่แล้ว

## ประวัติ (บทเรียน)
1-2 รอบแรก: owner ส่งรายละเอียด Booking → ลง `?aid=` ในเนื้อหา → pipeline regenerate ตัดทิ้งเงียบ ๆ / และต่อให้อยู่ก็ไม่จ่ายเพราะโปรแกรมตรงปิดแล้ว
รอบนี้ (ถาวร): เลขอยู่ใน **โค้ด layout ไม่ใช่เนื้อหา** + guard บังคับก่อน deploy + เอกสารนี้

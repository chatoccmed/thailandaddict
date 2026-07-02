export const meta = {
  name: 'bangkapi-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Bangkapi (บางกะปิ) — 8 NEW hotels in the Bangkapi core (The Mall Bangkapi / Lam Sali / Khlong Chan / Ladprao 117-144), MRT Yellow Line. Honest top-8; value-5 ⊆ main. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Bangkapi hotel' }],
}

// All NEW. Honest top-8 (Bangkapi core, distinct from ramkhamhaeng/hua-mak + srinakarin). value-5 subset.
const HOTELS = [
  { name: 'Baron Residence Bangkok (บารอน เรสซิเดนซ์)', slug: 'review-baron-residence-bangkapi-bangkok', star: 4, area: '777 ซ.ลาดพร้าว 130 (รามคำแหง 81) คลองจั่น บางกะปิ · เดิน ~10 นาทีถึงเดอะมอลล์บางกะปิ · ~1.2 กม. MRT สายสีเหลือง บางกะปิ · คะแนน ~8.7 รีวิว ~846', dim: 'hotels' },
  { name: 'Metro Point Bangkok Hotel (เมโทร พอยท์ กรุงเทพ)', slug: 'review-metro-point-bangkapi-bangkok', star: 4, area: '666 ซ.ลาดพร้าว 130 คลองจั่น บางกะปิ · ใกล้เดอะมอลล์บางกะปิ · 4★ คะแนน ~8.1 รีวิว ~1,735', dim: 'hotels' },
  { name: 'Baron Zotel Bangkok (บารอน โซเทล)', slug: 'review-baron-zotel-bangkapi-bangkok', star: 4, area: '77 ซ.ลาดพร้าว 117 คลองจั่น บางกะปิ · ~1.5 กม. เดอะมอลล์บางกะปิ ใกล้ตลาดคลองจั่น · คะแนน ~8.3 รีวิว ~578', dim: 'hotels' },
  { name: '130 Hotel & Residence Bangkok (130 โฮเทล แอนด์ เรสซิเดนซ์)', slug: 'review-130-hotel-residence-bangkapi-bangkok', star: 4, area: '25 ซ.ลาดพร้าว 130 คลองจั่น บางกะปิ · เดินถึงเดอะมอลล์+โลตัสบางกะปิ · ~1 กม. MRT บางกะปิ · คะแนน ~8.0 รีวิว ~585', dim: 'hotels' },
  { name: 'Kantary House Hotel & Serviced Apartments, Bangkok (แคนทารี เฮาส์)', slug: 'review-kantary-house-bangkapi-bangkok', star: 4, area: '14 ถ.รามคำแหง 42 บางกะปิ · เซอร์วิสอพาร์ตเมนต์ห้องกว้างพักยาว · ใกล้เดอะมอลล์บางกะปิฝั่งรามคำแหง · คะแนน ~8.2', dim: 'hotels' },
  { name: 'imm hotel Ladprao Bangkapi Bangkok (อิม โฮเทล ลาดพร้าว บางกะปิ)', slug: 'review-imm-hotel-ladprao-bangkapi-bangkok', star: 3, area: 'ซ.ลาดพร้าว 127 คลองจั่น บางกะปิ · เดินถึงเดอะมอลล์บางกะปิ ใกล้แยกลำสาลี MRT สายสีเหลือง · 3★ คะแนน ~7.9 รีวิว ~280', dim: 'value' },
  { name: 'Aunchaleena Grand Hotel (อัญชลีนา แกรนด์)', slug: 'review-aunchaleena-grand-bangkapi-bangkok', star: 3, area: '453 ซ.ลาดพร้าว 122 (รามคำแหง 65) พลับพลา ฝั่งเดอะมอลล์บางกะปิ · ~6 นาที(รถ)ถึงเดอะมอลล์ · 3★ คะแนน ~8.0', dim: 'value' },
  { name: 'Mall Suites Hotel (มอลล์ สวีท โฮเทล)', slug: 'review-mall-suites-bangkapi-bangkok', star: 3, area: '3530 ซ.ลาดพร้าว 144 คลองจั่น บางกะปิ · ติดเดอะมอลล์บางกะปิ (เดินถึง) · อพาร์ตเมนต์มีครัวเล็ก · 3★ คะแนน ~7.5 รีวิว ~301', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านบางกะปิ/คลองจั่น/เดอะมอลล์บางกะปิ/ลาดพร้าว 117-144
- ⚠️ ย่านนี้เป็นย่านห้าง+ที่อยู่อาศัย โรงแรม 3-4★ mid-range/serviced apartment เป็นหลัก · จุดขาย = "ใกล้เดอะมอลล์บางกะปิ + แยกลำสาลี MRT สายสีเหลือง + คลองจั่น + เข้าเมือง/สนามบินสุวรรณภูมิสะดวก" · เขียนตรงไปตรงมา
- ⛔ ห้ามหยิบโรงแรมที่เป็นของหน้า ramkhamhaeng-หัวหมาก (The Quarter, Bangkok Inter Place, Regent 22, Pillow B, Wattana Place, @Home, Madison, Witz, Anda, Salin Home, Zircon, Alexander, We Hotel) · srinakarin (Onix, Livotel Hua Mak, Xtreme, The 9, Bay, B2 Srinakharin) · ยึด "บางกะปิ core" เท่านั้น ไม่ใช่หัวหมาก/ABAC
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top8-hotels-bangkapi-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top8-hotels-bangkapi-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านบางกะปิ"(EN "Bangkapi") · crumbCityHref="area-bangkok-bangkapi.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): บางกะปิ = เดอะมอลล์ ไลฟ์สโตร์ บางกะปิ (ห้างใหญ่+HarborLand สวนน้ำ), แยกลำสาลี + MRT สายสีเหลือง, คลองจั่น-เสรีไทย (NIDA), เรือด่วนคลองแสนแสบเข้าเมือง, สัมมากร ราม 110 (คาเฟ่-ร้านอาหาร), ของกินตลาดบางกะปิ, ย่านคุ้มเงินตะวันออก — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · ถ้าโหลดรูปจริงไม่ได้ อย่าใช้รูปโรงแรมอื่นแทน — บอกใน note
- related: ลิงก์ไปรีวิวจริงย่านบางกะปิในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านบางกะปิ (ระดับดาวเดียวกัน) มาแทน + บอกใน return · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านบางกะปิ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-bangkapi-bangkok (โรงแรมราคาประหยัด 2-3★)':'top8-hotels-bangkapi-bangkok (8 โรงแรมยอดนิยมย่านบางกะปิ)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่าง
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

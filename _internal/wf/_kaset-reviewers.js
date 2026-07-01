export const meta = {
  name: 'kaset-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Kaset (เกษตร-นวมินทร์) — 7 NEW hotels around Kasetsart University (Livotel anchor + Maruay Garden + Metro Phahon 35 + Missoniya + P24 + Room@Vipa + Pannapat). University-town district, all 3★. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Kaset hotel' }],
}

// All NEW — no existing Kaset reviews. Honest top-7 (university-town, all 3★).
const HOTELS = [
  { name: 'Livotel Hotel @ Kaset Nawamin Bangkok (ไลโวเทล เกษตร-นวมินทร์)', slug: 'review-livotel-kaset-nawamin-bangkok', star: 3, area: '333 ซอยพหลโยธิน 34 เสนานิคม · ~900 ม. BTS ม.เกษตรศาสตร์ · ถ.เกษตร-นวมินทร์ · โรงแรมแองเคอร์ รีวิวเยอะสุดของย่าน ~1,440', dim: 'hotels' },
  { name: 'The Maruay Garden Hotel (มารวย การ์เด้น)', slug: 'review-maruay-garden-kaset-bangkok', star: 3, area: '1 ถ.พหลโยธิน เสนานิคม · ~450 ม. BTS ม.เกษตรศาสตร์ · โรงแรมใหญ่ 315 ห้อง มีสระว่ายน้ำ ใกล้แยกเกษตรสุด', dim: 'hotels' },
  { name: 'Metro Hotel Phahonyothin 35 (เมโทร โฮเทล พหลโยธิน 35)', slug: 'review-metro-hotel-phahon-35-bangkok', star: 3, area: 'ซอยพหลโยธิน 35 · ~300 ม. BTS รัชโยธิน · เดิน 5 นาทีถึง ม.เกษตร · คะแนนสูง ~9.0', dim: 'value' },
  { name: 'Missoniya Hotel (มิสโซนิญ่า)', slug: 'review-missoniya-kaset-bangkok', star: 3, area: '44/45 ถ.งามวงศ์วาน ลาดยาว จตุจักร · บูทีคสไตล์ญี่ปุ่น ใกล้ ม.เกษตร ประตูงามวงศ์วาน', dim: 'hotels' },
  { name: 'P24 at Kaset (พี24 แอท เกษตร)', slug: 'review-p24-at-kaset-bangkok', star: 3, area: 'ใกล้ ม.เกษตร · ใกล้ BTS พหลโยธิน 24 · อพาร์ตโฮเทล เดินถึงมหา’ลัย (Booking Guests’ Choice)', dim: 'value' },
  { name: 'Room@Vipa (รูม แอท วิภา)', slug: 'review-room-at-vipa-kaset-bangkok', star: 3, area: 'ฝั่งวิภาวดี-จตุจักร ใกล้ ม.เกษตร · โรงแรมเล็ก 33 ห้อง คุ้มเงิน · Trip 8.7', dim: 'value' },
  { name: 'Pannapat Place (ปัณณภัทร เพลส)', slug: 'review-pannapat-place-kaset-bangkok', star: 3, area: 'ซอยพหลโยธิน 35 ใกล้ ม.เกษตร · เซอร์วิสอพาร์ตเมนต์บัดเจ็ต', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านเกษตร/แยกเกษตร/งามวงศ์วาน/นวมินทร์/รัชโยธิน (รอบ ม.เกษตรศาสตร์)
- ⚠️ ย่านนี้เป็นย่านมหา’ลัย/ที่อยู่อาศัย โรงแรม 3★ บูทีค/อพาร์ตโฮเทลเป็นหลัก · เขียนตรงไปตรงมา จุดขายคือ "ใกล้ ม.เกษตร + BTS ม.เกษตรศาสตร์ เดินทางสะดวก คุ้มเงิน" · ห้ามหยิบโรงแรมฝั่งบางเขน (คนละย่าน) · ลาดพร้าว/เซ็นทรัลลาดพร้าว · จตุจักร/หมอชิต · นนทบุรี (Regent/iCheck งามวงศ์วานปลาย) · บึงกุ่ม
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top7-hotels-kaset-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top7-hotels-kaset-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านเกษตร-นวมินทร์"(EN "Kaset") · crumbCityHref="area-bangkok-kaset.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): เกษตร-นวมินทร์ = มหาวิทยาลัยเกษตรศาสตร์ บางเขน (มหา’ลัยใหญ่), BTS ม.เกษตรศาสตร์/รัชโยธิน (สายสีเขียว), แยกเกษตร, ถนนงามวงศ์วาน-ประตูงามวงศ์วาน, นวมินทร์-เลียบด่วน, ตลาด อ.ต.ก. 3/เกษตร, ของกินนักศึกษาราคาถูก, เดินทางเข้าเมือง/จตุจักรง่าย, ย่านคุ้มเงินโซนเหนือ — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · ถ้าโหลดรูปจริงไม่ได้ อย่าใช้รูปโรงแรมอื่นแทน — บอกใน note
- related: ลิงก์ไปรีวิวจริงย่านเกษตรในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านเกษตร (ระดับดาวเดียวกัน) มาแทน + บอกใน return · value-dim ต้อง 2-3★ จริง (Maruay ถ้าเจอว่าเป็น 4★ ให้คง hotels-dim ไม่ใส่ value)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านเกษตร-นวมินทร์ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-kaset-bangkok (โรงแรมราคาประหยัด 2-3★)':'top7-hotels-kaset-bangkok (7 โรงแรมยอดนิยมย่านเกษตร)'}"
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

export const meta = {
  name: 'bang-sue-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Bang Sue (บางซื่อ) — 8 NEW hotels near Bang Sue Grand Station / MRT Bang Sue-Tao Poon (all-new; no reuse exists). Bang Sue is a thin transit/residential district → honest top-8 (not padded to 10). Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Bang Sue hotel' }],
}

// All NEW — no existing Bang Sue reviews on the site. Honest top-8 (area genuinely thin).
const HOTELS = [
  { name: 'The State Apartment', slug: 'review-the-state-apartment-bang-sue-bangkok', star: 3, area: '~130 ม.จาก MRT เตาปูน · เดิน 15 นาทีถึงสถานีกลางบางซื่อ · เซอร์วิสอพาร์ตเมนต์ยอดนิยมสุดของย่าน', dim: 'value' },
  { name: 'Ziniza The Boutique Service Apartment', slug: 'review-ziniza-boutique-bang-sue-bangkok', star: 3, area: 'บางซื่อ (ฝั่งประชาชื่น) · ~400 ม. MRT เตาปูน · เซอร์วิสอพาร์ตเมนต์ 57 ห้อง เป็นมิตรมุสลิม', dim: 'hotels' },
  { name: 'Yeehaa Bangsue', slug: 'review-yeehaa-bangsue-bangkok', star: 3, area: 'ใกล้ MRT เตาปูน บางซื่อ · อพาร์ตโฮเทลบัดเจ็ต', dim: 'value' },
  { name: 'Matini Hostel Grandstation', slug: 'review-matini-hostel-grandstation-bangkok', star: 3, area: '~0.77 กม.จากสถานีกลางบางซื่อ · โฮสเทล/แคปซูลยอดนิยมมาก คะแนน ~9.1', dim: 'value' },
  { name: 'WE HOTEL RIVERFRONT', slug: 'review-we-hotel-riverfront-bangkok', star: 4, area: 'ริมแม่น้ำ บางโพ-บางซื่อ · ตัวเลือกระดับบนหนึ่งเดียวของย่าน (ไม่ติด MRT ต้องนั่งรถ/เรือ)', dim: 'hotels' },
  { name: 'Cattreya Place', slug: 'review-cattreya-place-bang-sue-bangkok', star: 3, area: 'บางซื่อ (ถ.ริมคลองประปาฝั่งขวา) · ~0.6 กม. MRT เตาปูน · เปิดใหม่ปี 2025 ห้องน้อย', dim: 'value' },
  { name: 'Dusita Residence', slug: 'review-dusita-residence-bang-sue-bangkok', star: 3, area: 'ซอยเงียบย่านบางซื่อ · ใกล้ MRT เตาปูน/บางโพ · เกสต์เฮาส์เล็กคะแนนสูง ~9.6', dim: 'hotels' },
  { name: 'Orange Lodge', slug: 'review-orange-lodge-bang-sue-bangkok', star: 2, area: 'เดิน ~5 นาทีจากบางซื่อ · ~600 ม.จากสถานีกลางบางซื่อ · ลอดจ์/โฮสเทลบัดเจ็ต', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านบางซื่อ/เตาปูน/ประชาชื่น/บางโพ
- ⚠️ ย่านนี้เป็นย่านสถานี+ที่อยู่อาศัย โรงแรมส่วนใหญ่เป็นอพาร์ตเมนต์/โฮสเทล/เกสต์เฮาส์บัดเจ็ต — เขียนตรงไปตรงมา จุดขายคือ "ใกล้สถานีกลางบางซื่อ/MRT เดินทางสะดวก คุ้มเงิน" ไม่ปั้นให้หรูเกินจริง · ห้ามหยิบโรงแรมฝั่งจตุจักร/หมอชิต core (Best Western Chatuchak/ตลาด JJ/อ.ต.ก. = ย่านหมอชิต) หรือ สะพานควาย/ประดิพัทธ์ (คนละย่าน)
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top8-hotels-bang-sue-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top8-hotels-bang-sue-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านบางซื่อ"(EN "Bang Sue") · crumbCityHref="area-bangkok-bang-sue.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): บางซื่อ = สถานีกลางกรุงเทพอภิวัฒน์ (สถานีกลางบางซื่อ — ฮับรถไฟใหญ่สุดของไทย/รถไฟฟ้าสายสีแดง+ทางไกล+รถไฟความเร็วสูงอนาคต), MRT บางซื่อ + เตาปูน (จุดตัดสีน้ำเงิน-ม่วง), ประตูสู่ภาคเหนือ/อีสาน, เดินทางเข้าเมือง-สนามบินสะดวก, ตลาดประชานิเวศน์/นนทบุรี ใกล้ ๆ, ย่านที่พักคุ้มเงินสำหรับนักเดินทางต่อรถไฟ — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ**
- related: ลิงก์ไปรีวิวจริงย่านบางซื่อในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านบางซื่อ/เตาปูน (ระดับดาวเดียวกัน) มาแทน + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริง (verify starRating)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านบางซื่อ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-bang-sue-bangkok (โรงแรมราคาประหยัด 2-3★)':'top8-hotels-bang-sue-bangkok (8 โรงแรมยอดนิยมย่านบางซื่อ)'}"
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

export const meta = {
  name: 'ladprao-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Lat Phrao (ลาดพร้าว) — 8 NEW hotels (The Quarter Ladprao / President Chokchai 4 / 48 Metro / Cha Cha Suite / Kiatthada / Fullrich / Grandview / T3) to pair with 2 existing Lat-Phrao-corridor reviews (Livotel Lat Phrao 4★, Synsiri Ladprao 130 3★) for a proper top-10. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Lat Phrao hotel' }],
}

// NEW (reuse not included: livotel-lat-phrao 4★~7.8 / synsiri-ladprao-130 3★8.3 — both at the NE tail, Soi Lat Phrao 130/Bang Kapi)
const HOTELS = [
  { name: 'The Quarter Ladprao by UHG', slug: 'review-the-quarter-ladprao-bangkok', star: 4, area: 'ซอยลาดพร้าว 4 · หัวถนนลาดพร้าว · ~50 ม.จาก MRT พหลโยธิน · ติด Union Mall / ห้าแยกลาดพร้าว · เพิ่งรีโนเวต', dim: 'hotels' },
  { name: 'The President Hotel at Chokchai 4', slug: 'review-the-president-chokchai-4-bangkok', star: 4, area: 'โชคชัย 4 ซอย 60 · โรงแรมใหญ่ มีสระว่ายน้ำ+บุฟเฟต์ · ย่านของกิน 24 ชม. โชคชัย 4', dim: 'hotels' },
  { name: '48 Metro Hotel', slug: 'review-48-metro-hotel-bangkok', star: 3, area: 'ซอยลาดพร้าว วังหิน 48 · ริมถนนลาดพร้าวช่วง NE · บัดเจ็ตคุ้ม คะแนนสูง ~8.4', dim: 'value' },
  { name: 'The Bangkok Cha Cha Suite (Collection O)', slug: 'review-bangkok-cha-cha-suite-bangkok', star: 3, area: 'โชคชัย 4 ซอย 27 ลาดพร้าว · โรงแรมบัดเจ็ตย่านโชคชัย 4', dim: 'value' },
  { name: 'Kiatthada Resort', slug: 'review-kiatthada-resort-bangkok', star: 3, area: 'ถนนสุคนธสวัสดิ์ ลาดพร้าว · รีสอร์ตในเมืองย่านลาดพร้าวตอนใน', dim: 'value' },
  { name: 'Fullrich Residence', slug: 'review-fullrich-residence-bangkok', star: 3, area: 'ซอยนาคนิวาส 21 / ลาดพร้าว 71 · เรสซิเดนซ์บัดเจ็ต ริวิวเยอะ', dim: 'value' },
  { name: 'Grandview Condominia (OYO)', slug: 'review-grandview-condominia-bangkok', star: 3, area: 'ลาดพร้าว ซอย 1 จอมพล · ~500 ม.จาก MRT พหลโยธิน ใกล้ Union Mall', dim: 'hotels' },
  { name: 'T3 Residence Ladprao', slug: 'review-t3-residence-ladprao-bangkok', star: 3, area: 'ลาดพร้าว (โชคชัย 4 / ต่อรัชดา) · เรสซิเดนซ์บัดเจ็ต', dim: 'hotels' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงบนถนนลาดพร้าว/โชคชัย 4/พหลโยธิน-ห้าแยกลาดพร้าว/บางกะปิ (ปลาย NE)
- ⚠️ ห้ามใช้ Centara Grand at Central Plaza Ladprao (ถูกใช้ในย่านหมอชิต-จตุจักรไปแล้ว) · ห้ามหยิบโรงแรมฝั่งรัชดา/ห้วยขวาง/พระราม 9 (คนละย่าน) หรือ จตุจักร/หมอชิต core (JJ Market/Or Tor Kor เป็นของหมอชิต) — โฟกัสเฉพาะ "คอร์ริดอร์ถนนลาดพร้าว" จริง ๆ
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top10-hotels-ladprao-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-ladprao-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านลาดพร้าว"(EN "Lat Phrao") · crumbCityHref="area-bangkok-ladprao.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): ลาดพร้าว = ห้าแยกลาดพร้าว/Union Mall + เซ็นทรัลพลาซา ลาดพร้าว (จุดเปลี่ยน MRT พหลโยธิน + BTS ห้าแยกลาดพร้าว = หัวคอร์ริดอร์), โชคชัย 4 (ของกินริมทาง 24 ชม. · ตลาด · ย่านคนอยู่จริง), ถนนลาดพร้าวเส้นยาวไป NE (ซอย 48/71/130 · The Mall Bangkapi ปลายทาง), MRT สายสีน้ำเงินต่อไปจตุจักร-รัชดา-เมืองชั้นในสะดวก, ย่านที่พักคุ้มเงินสำหรับคนงบประหยัด-กลาง — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว · โรงแรมบัดเจ็ตคะแนนไม่สูงมาก = เขียนตรงไปตรงมา (คุ้มเงิน/พื้นฐานสะอาด/ทำเล) อย่าปั้นเวอร์
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · โหลดผิด curl ทับชื่อเดิม
- related: ลิงก์ไปรีวิวจริงย่านลาดพร้าว (review-livotel-lat-phrao-bangkok, review-synsiri-ladprao-130-bangkok + hotel ใหม่ในชุดนี้) — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงบนถนนลาดพร้าว/โชคชัย 4 (ระดับดาวเดียวกัน) มาแทน + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริง (verify starRating)
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านลาดพร้าว กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-ladprao-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-ladprao-bangkok (10 โรงแรมยอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่าง
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
(reuse: review-livotel-lat-phrao-bangkok, review-synsiri-ladprao-130-bangkok)
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

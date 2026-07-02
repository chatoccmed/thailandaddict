export const meta = {
  name: 'ramkhamhaeng-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน Ramkhamhaeng-Hua Mak (รามคำแหง-หัวหมาก) — 10 NEW hotels along the Ramkhamhaeng Univ → The Mall → ABAC → ARL Hua Mak spine (MRT Yellow Line). Real top-10; value-5 ⊆ main. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Ramkhamhaeng hotel' }],
}

// All NEW. Real top-10 (healthy corridor). value-5 is a subset (dim=value).
const HOTELS = [
  { name: 'The Quarter Ramkhamhaeng by UHG (เดอะ ควอเตอร์ รามคำแหง)', slug: 'review-the-quarter-ramkhamhaeng-bangkok', star: 4, area: 'ติดเดอะมอลล์ ไลฟ์สโตร์ รามคำแหง · 4★ แฟลกชิปย่าน คะแนน ~9.0 รีวิว ~1,950', dim: 'hotels' },
  { name: 'Bangkok Inter Place (กรุงเทพ อินเตอร์ เพลส)', slug: 'review-bangkok-inter-place-ramkhamhaeng-bangkok', star: 4, area: 'รามคำแหง ซอย 24 ใกล้ ABAC · 4★ มีสระ rooftop คะแนน ~8.3 รีวิว ~155 (ใกล้ราชมังคลากีฬาสถาน)', dim: 'hotels' },
  { name: 'Regent Ramkhamhaeng 22 (รีเจนท์ รามคำแหง 22)', slug: 'review-regent-ramkhamhaeng-22-bangkok', star: 3, area: 'รามคำแหง ซอย 22 · 3★ ฮาลาล คะแนน ~8.4-8.5 รีวิว ~300-455 คุ้มเงิน', dim: 'value' },
  { name: 'Pillow B Hotel (พิลโลว์ บี โฮเทล)', slug: 'review-pillow-b-hotel-ramkhamhaeng-bangkok', star: 3, area: 'รามคำแหง 43/1 · 3★ เปิดใหม่ 2024 คะแนน ~8.9 รีวิว ~413', dim: 'value' },
  { name: 'Wattana Place / Baan Thai Boutique (วัฒนา เพลส)', slug: 'review-wattana-place-ramkhamhaeng-bangkok', star: 3, area: 'รามคำแหง ซอย 47-49 · 3★ มีสวน+สระ ฮาลาล คะแนน ~8.4 รีวิว ~431', dim: 'hotels' },
  { name: '@Home Residence Bangkok (แอทโฮม เรสซิเดนซ์)', slug: 'review-at-home-residence-ramkhamhaeng-bangkok', star: 3, area: 'หัวหมาก/เสรี 2 · 3★ อพาร์ตโฮเทลมีครัว คะแนน ~8.8', dim: 'hotels' },
  { name: 'Madison Bangkok Hotel (แมดิสัน แบงค็อก)', slug: 'review-madison-bangkok-ramkhamhaeng-bangkok', star: 3, area: 'รามคำแหง เดิน 150 ม. ถึงมหา’ลัย · 3★ บูทีกเล็ก ~14 ห้อง คะแนน ~8.3 รีวิว ~561', dim: 'value' },
  { name: 'Witz Bangkok Hotel Ramkhamhaeng (วิทซ์ แบงค็อก รามคำแหง)', slug: 'review-witz-bangkok-ramkhamhaeng-bangkok', star: 3, area: 'รามคำแหง ซอย 35 · 3★ มีสระ คะแนน ~7.7-8.2 คุ้มเงิน', dim: 'value' },
  { name: 'Anda Ramkhamhaeng By St James (อันดา รามคำแหง บาย เซนต์เจมส์)', slug: 'review-anda-ramkhamhaeng-st-james-bangkok', star: 3, area: 'รามคำแหง · 3★ ~89 ห้อง คะแนน ~8.1', dim: 'hotels' },
  { name: 'Salin Home Hotel Ramkhamhaeng (สลิลโฮม โฮเทล รามคำแหง)', slug: 'review-salin-home-ramkhamhaeng-bangkok', star: 2, area: 'รามคำแหง ซอย 50 เดินถึง ARL หัวหมาก · 2★ บัดเจ็ตคุ้มเงิน', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านรามคำแหง/หัวหมาก (ม.รามคำแหง · เดอะมอลล์รามคำแหง · ABAC หัวหมาก · ARL หัวหมาก)
- ⚠️ ย่านนี้เป็นย่านมหา’ลัย+ที่อยู่อาศัย โรงแรม 3-4★ บูทีค/อพาร์ตโฮเทล/ฮาลาลเป็นหลัก · จุดขาย = "ใกล้ ม.รามคำแหง/ABAC + เดอะมอลล์ ไลฟ์สโตร์รามคำแหง + MRT สายสีเหลือง + ARL หัวหมากเข้าเมือง/สนามบินสุวรรณภูมิ" · เขียนตรงไปตรงมา
- ⛔ ห้ามหยิบโรงแรมที่อยู่หน้าย่านศรีนครินทร์แล้ว (Onix, Livotel Hua Mak, Xtreme Suites, The 9 Residence, Bay Hotel, B2 ศรีนครินทร์, De Botan, The Park Nine, Dusit Princess, Lumen, Mintel, The Home, Zircon, Sky Place) · ห้ามโซนบางกะปิคอร์ (คนละหน้า) · Al Meroz/Nasa = ปลาย ARL/พระราม 9 (ข้าม)
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top10-hotels-ramkhamhaeng-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-ramkhamhaeng-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านรามคำแหง-หัวหมาก"(EN "Ramkhamhaeng") · crumbCityHref="area-bangkok-ramkhamhaeng.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): รามคำแหง-หัวหมาก = มหาวิทยาลัยรามคำแหง (มหา’ลัยเปิดใหญ่), ABAC หัวหมาก, เดอะมอลล์ รามคำแหง/ไลฟ์สโตร์, ราชมังคลากีฬาสถาน (สนามกีฬาใหญ่-คอนเสิร์ต), MRT สายสีเหลือง (ลาดพร้าว-สำโรง), Airport Rail Link หัวหมาก (เข้าเมือง/สุวรรณภูมิ), ของกินนักศึกษา/ตลาดหัวหมาก, ย่านฮาลาล/มุสลิม — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · ถ้าโหลดรูปจริงไม่ได้ อย่าใช้รูปโรงแรมอื่นแทน — บอกใน note
- related: ลิงก์ไปรีวิวจริงย่านรามคำแหงในชุดนี้เท่านั้น — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ/ยืนยันไม่ได้" ให้เลือกโรงแรมที่ป๊อป+จองได้จริงย่านรามคำแหง (ระดับดาวเดียวกัน) มาแทน + บอกใน return · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ย่านรามคำแหง-หัวหมาก กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-ramkhamhaeng-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-ramkhamhaeng-bangkok (10 โรงแรมยอดนิยมย่านรามคำแหง)'}"
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

export const meta = {
  name: 'srinakarin-reviewers',
  description: 'Fan out tourlogy-hotel-reviewer agents for ย่าน #26 Srinakarin — 5 NEW hotels (Dusit Princess/Park Nine/De Botan/Lumen/B2) to pair with 7 existing Srinakarin-zone reviews for a proper top-10. Returns compact per-hotel summary.',
  phases: [{ title: 'Review', detail: 'one hotel-reviewer agent per NEW Srinakarin hotel' }],
}

// NEW (reuse not included: onix 4★8.4 / the-9-residence 3★8.4 / sky-place 3★7.4 / the-xtreme-suites 3★7.6 / the-pool-resort 3★7.3 / bay-hotel-srinakarin 3★8.0 / livotel-hua-mak 4★7.9)
const HOTELS = [
  { name: 'Dusit Princess Srinakarin Bangkok', slug: 'review-dusit-princess-srinakarin-bangkok', star: 4, area: 'ถนนศรีนครินทร์ · ใกล้ซีคอนสแควร์ · สระว่ายน้ำ ใกล้สุวรรณภูมิ', dim: 'hotels' },
  { name: 'The Park Nine Hotel Srinakarin', slug: 'review-the-park-nine-srinakarin-bangkok', star: 4, area: 'ศรีนครินทร์ · ใกล้ซีคอน-พาราไดซ์พาร์ค · urban oasis สระว่ายน้ำ', dim: 'hotels' },
  { name: 'De Botan Srinakarin Hotel & Residence', slug: 'review-de-botan-srinakarin-bangkok', star: 3, area: 'ศรีนครินทร์ · เดิน/ขับ 5 นาทีถึงซีคอนสแควร์', dim: 'hotels' },
  { name: 'Lumen Bangkok Srinakarin Hotel', slug: 'review-lumen-srinakarin-bangkok', star: 3, area: 'ศรีนครินทร์ · ห่างซีคอนสแควร์ 0.6 กม.', dim: 'hotels' },
  { name: 'B2 Suan Luang Rama 9 Srinakarin Boutique & Budget Hotel', slug: 'review-b2-srinakarin-bangkok', star: 3, area: 'ศรีนครินทร์ ซอย 42 · สวนหลวง ร.9 · บัดเจ็ตเชนยอดนิยม', dim: 'value' },
]

const OVERRIDES = `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · verify โรงแรมมีจริง เปิดจริง ที่อยู่จริงย่านศรีนครินทร์/สวนหลวง/หัวหมาก/ประเวศ
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — output ตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) + astro/src/content/reviews-en/<slug>.json (อังกฤษ ZERO ไทย — romanize ชื่อ/ที่อยู่; ฿ ใช้ได้)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL (เก็บ URL จริงไว้ใน bookingBooking; agoda=bookingAgoda; trip=bookingTrip)
- breadcrumb/parent: parentHref="top10-hotels-srinakarin-bangkok.html" · parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-srinakarin-bangkok" (EN ใช้ /en/) · crumbCityName="ย่านศรีนครินทร์"(EN "Srinakarin") · crumbCityHref="area-bangkok-srinakarin.html" · countryHref="country-thailand.html" countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand") · addressCountry="TH"
- มุมขายของย่าน (ใช้แทน proximity hook): ศรีนครินทร์ = ซีคอนสแควร์ (ห้างยักษ์ + สวนน้ำ + ลานสเก็ต), Thanya Park, Paseo, พาราไดซ์พาร์ค, ตลาดนัดรถไฟศรีนครินทร์, สวนหลวง ร.9 (สวนใหญ่สุดในกรุงเทพฯ), บึงหนองบอน, หัวหมาก-รามคำแหง (ม.รามคำแหง/ราชมังคลา), ประตูสู่สุวรรณภูมิ + มอเตอร์เวย์, ย่านคนทำงาน-ครอบครัวชานเมืองตะวันออก — เขียนรีวิวให้สื่อเสน่ห์นี้
- ราคาบอก "เริ่มประมาณ" จากช่วงห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- รูป hero+แกลเลอรี: โหลดจริงไป astro/public/images/hotels/bangkok-<short>.jpg (≥3 รูป) · ⚠️ curl -o ตรงไปชื่อไฟล์ปลายทางเท่านั้น · **ห้าม rm/ลบไฟล์ใด ๆ** · โหลดผิด curl ทับชื่อเดิม
- related: ลิงก์ไปรีวิวจริงย่านศรีนครินทร์ (review-onix-hotel-bangkok, review-the-9-residence-hotel-bangkok, review-livotel-hotel-hua-mak-bangkok, review-bay-hotel-srinakarin-samut-prakan + hotel ใหม่ในชุดนี้) — ห้ามเดา/แต่งชื่อไฟล์รูป
- ⚠️ ก่อนบันทึก: ค้นคำต้องห้าม แก้ก่อนบันทึก · JSON ถูก escape (\\" · ห้าม " ลอย)
- ⚠️ ถ้าโรงแรมที่ระบุ "ไม่มีจริง/ปิด/หาไม่เจอ" ให้เลือกโรงแรมที่ป๊อปสุดในย่านศรีนครินทร์ (ระดับดาวเดียวกัน) มาแทน + บอกใน return ว่าใช้ตัวไหน · value-dim ต้อง 2-3★ จริง
`

const slugList = HOTELS.map(h => `${h.name} → ${h.slug} (${h.star}★, ${h.dim})`).join('\n')
const RET = { type:'object', additionalProperties:false, required:['slug','ok'], properties:{
  slug:{type:'string'}, ok:{type:'boolean'}, starRating:{type:'number'}, score:{type:'number'}, priceFrom:{type:'string'}, note:{type:'string'} } }

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" (ศรีนครินทร์ กรุงเทพฯ) · slug=${h.slug} · ~${h.star} ดาว · ย่าน ${h.area}
อยู่ในชุด roundup "${h.dim==='value'?'top5-love-hotels-srinakarin-bangkok (โรงแรมราคาประหยัด 2-3★)':'top10-hotels-srinakarin-bangkok (10 โรงแรมยอดนิยม)'}"
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วทำตามทุกขั้นตอน (วิจัยเว็บจริง → อ่าน schema → เขียน TH+EN → โหลดรูป) ครบทุก field — ยกเว้น override ด้านล่าง
${OVERRIDES}
โรงแรมใหม่อื่นในชุดนี้:
${slugList}
(reuse: review-onix-hotel-bangkok, review-the-9-residence-hotel-bangkok, review-sky-place-srinakarin-bangkok, review-the-xtreme-suites-bangkok, review-the-pool-resort-bangkok, review-bay-hotel-srinakarin-samut-prakan, review-livotel-hotel-hua-mak-bangkok)
เสร็จแล้วคืน { slug, ok, starRating, score, priceFrom, note } ตาม schema`,
    { label:`review:${h.slug}`, phase:'Review', agentType:'tourlogy-hotel-reviewer', schema: RET }
  ).then(r => r || ({ slug:h.slug, ok:false, note:'null return' })).catch(e => ({ slug:h.slug, ok:false, note:String(e).slice(0,80) }))
))

const ok = reviewed.filter(x => x && x.ok)
return { total: HOTELS.length, okCount: ok.length, results: reviewed.map(r => ({ slug:r.slug, ok:!!(r&&r.ok), star:r&&r.starRating, score:r&&r.score, price:r&&r.priceFrom, note:r&&r.note })), failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

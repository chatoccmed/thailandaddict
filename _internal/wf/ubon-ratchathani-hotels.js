export const meta = {
  name: 'ubon-ratchathani-hotels',
  description: 'Ubon Ratchathani (อุบลราชธานี) gold-template — hotel layer: 12 real hotels TH+EN reviews + Top 10 roundup',
  phases: [
    { title: 'Plan',    detail: 'pick 12 currently-operating Ubon hotels across tiers' },
    { title: 'Review',  detail: 'one hotel-reviewer agent per hotel → TH+EN review JSON' },
    { title: 'Roundup', detail: 'build Top 10 โรงแรมอุบลราชธานี roundup TH+EN' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-ubon-ratchathani.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-ubon-ratchathani" (EN /en/) · crumbCityName="อุบลราชธานี"/(EN "Ubon Ratchathani"), crumbCityHref="city-ubon-ratchathani.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- related/prev/next ลิงก์ไปรีวิวโรงแรมในชุดนี้ (slug ที่ planner กำหนด)
- รูป hero: พยายามโหลดจริงไป astro/public/images/hotels/ubon-ratchathani-<short>.jpg (curl -m 60 --connect-timeout 20) ถ้าโหลดไม่ได้ปล่อยว่าง (layout มี onerror)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- บันทึกเฉพาะ slug ของโรงแรมตัวเองเท่านั้น ห้ามเขียนทับไฟล์ของโรงแรมอื่น
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้เป็นคำธรรมชาติ (เหมาะ/ลงตัว/ครบ/เด่น/เด็ด) ก่อนบันทึก
`

phase('Plan')
const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['hotels'], properties:{ hotels:{ type:'array', minItems:12, maxItems:12, items:{ type:'object', additionalProperties:false, required:['name','slug','area','tier','starTier'], properties:{
  name:{type:'string'}, slug:{type:'string', description:'review-<hotel-kebab>-ubon-ratchathani (ต้องไม่ซ้ำกับตัวอื่น)'}, area:{type:'string'}, tier:{type:'string', enum:['luxury','boutique','midrange','budget','hostel']}, starTier:{type:'number'} } } } } }

const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/ที่พักในจังหวัดอุบลราชธานี ที่ "เปิดดำเนินการอยู่จริงตอนนี้" 12 แห่ง สำหรับชุดรีวิว + Top 10 ของ thailandaddict.com
คละระดับ: โรงแรม 5 ดาว/หรูในเมือง 2-3 · บูทีค/4 ดาว 3 · กลาง 3 · ประหยัด 2 · โฮสเทล 1 — กระจายย่าน (ใจกลางเมืองอุบล · ริมแม่น้ำมูล · ย่านทุ่งศรีเมือง · ใกล้สนามบินอุบล)
เลือกที่มีรีวิวจริงเยอะและจองได้จริง ห้ามที่ปิดถาวร/เปลี่ยนชื่อ (อุบลเป็นเมืองใหญ่มีโรงแรมเยอะ — เลือกที่เปิดทั้งปี)
**ต้องได้ 12 โรงแรมที่ slug ไม่ซ้ำกันเลย** — slug = review-<ชื่อโรงแรม-kebab>-ubon-ratchathani · ถ้าชื่อย่อแล้วเสี่ยงซ้ำ ให้เติมย่าน/จุดเด่นให้ต่างกัน · คืนผลตาม schema (12 รายการพอดี)`,
  { label:'plan:ubon-hotels', phase:'Plan', schema: PLAN_SCHEMA }
)

// de-dup safety: ensure unique slugs
const seen = new Set()
const hotels = plan.hotels.filter(h => { if(seen.has(h.slug)) return false; seen.add(h.slug); return true })
const slugList = hotels.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.starTier}★, ${h.area})`).join('\n')
log(`Planned ${hotels.length} unique hotels. Writing reviews…`)

phase('Review')
const reviewed = await parallel(hotels.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" อุบลราชธานี · slug=${h.slug} · ระดับ ${h.starTier} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมอุบลราชธานี" (top10-hotels-ubon-ratchathani)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม อย่ารอจนค้าง
เขียนไฟล์ที่ astro/src/content/reviews/${h.slug}.json และ reviews-en/${h.slug}.json เท่านั้น (ห้ามเขียนทับ slug อื่น)
${OVERRIDES}
โรงแรมอื่นในชุดนี้: \n${slugList}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
const okR = reviewed.filter(x=>x&&x.ok)
log(`Reviews written: ${okR.length}/${hotels.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup "Top 10 โรงแรมอุบลราชธานี": เขียน astro/src/content/roundups/top10-hotels-ubon-ratchathani.json (ไทย) + roundups-en/top10-hotels-ubon-ratchathani.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-ubon-ratchathani" · จัดอันดับจากรีวิวในชุด (อ่าน JSON ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-ubon-ratchathani)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด:\n${slugList}`,
  { label:'roundup:ubon', phase:'Roundup' }
)

return { hotels: hotels.length, reviewsOk: okR.length, failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

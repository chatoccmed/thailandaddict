export const meta = {
  name: 'chiang-rai-hotels',
  description: 'Chiang Rai gold-template — hotel layer: 12 real hotels TH+EN reviews + Top 10 roundup',
  phases: [
    { title: 'Plan',    detail: 'pick 12 currently-operating Chiang Rai hotels across tiers' },
    { title: 'Review',  detail: 'one hotel-reviewer agent per hotel → TH+EN review JSON' },
    { title: 'Roundup', detail: 'build Top 10 โรงแรมเชียงราย roundup TH+EN' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และใช้ไฟล์ตัวอย่างรูปแบบ: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-chiang-rai.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-chiang-rai" (EN /en/) · crumbCityName="เชียงราย"/(EN "Chiang Rai"), crumbCityHref="city-chiang-rai.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- related/prev/next ลิงก์ไปรีวิวโรงแรมเชียงรายตัวอื่นในชุดนี้
- รูป hero: พยายามโหลดจริงไป astro/public/images/hotels/chiang-rai-<short>.jpg (curl -m 60 --connect-timeout 20) ถ้าโหลดไม่ได้ปล่อยว่าง
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง
`

phase('Plan')
const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['hotels'], properties:{ hotels:{ type:'array', minItems:10, maxItems:12, items:{ type:'object', additionalProperties:false, required:['name','slug','area','tier','starTier'], properties:{
  name:{type:'string'}, slug:{type:'string', description:'review-<hotel-kebab>-chiang-rai'}, area:{type:'string'}, tier:{type:'string', enum:['luxury','boutique','midrange','budget','hostel']}, starTier:{type:'number'} } } } } }

const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/ที่พักในเชียงรายที่ "เปิดดำเนินการอยู่จริงตอนนี้" 12 แห่ง สำหรับชุดรีวิว + Top 10 ของ thailandaddict.com
คละระดับ: หรู 2 · บูทีค/4-5 ดาว 3 · กลาง 3 · ประหยัด 2 · โฮสเทล 2 — กระจายย่าน (ตัวเมืองเชียงราย/ริมแม่น้ำกก/รอบวัดร่องขุ่น/ดอยตุง-แม่ฟ้าหลวง/เชียงแสน-สามเหลี่ยมทองคำ ฯลฯ)
เลือกที่มีรีวิวจริงเยอะและจองได้จริง ห้ามที่ปิดถาวร/เปลี่ยนชื่อ
slug = review-<ชื่อโรงแรม-kebab>-chiang-rai · คืนผลตาม schema`,
  { label:'plan:chiang-rai-hotels', phase:'Plan', schema: PLAN_SCHEMA }
)

const hotels = plan.hotels
const slugList = hotels.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.starTier}★, ${h.area})`).join('\n')
log(`Planned ${hotels.length} hotels. Writing reviews…`)

phase('Review')
const reviewed = await parallel(hotels.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" เชียงราย · slug=${h.slug} · ระดับ ${h.starTier} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมเชียงราย" (top10-hotels-chiang-rai)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม อย่ารอจนค้าง
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
สร้าง roundup "Top 10 โรงแรมเชียงราย": เขียน astro/src/content/roundups/top10-hotels-chiang-rai.json (ไทย) + roundups-en/top10-hotels-chiang-rai.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-chiang-rai" · จัดอันดับจากรีวิวในชุด (อ่าน JSON ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-chiang-rai)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด:\n${slugList}`,
  { label:'roundup:chiang-rai', phase:'Roundup' }
)

return { hotels: hotels.length, reviewsOk: okR.length, failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

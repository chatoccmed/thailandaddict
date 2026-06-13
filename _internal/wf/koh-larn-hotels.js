export const meta = {
  name: 'koh-larn-hotels',
  description: 'Koh Larn (เกาะล้าน, ชลบุรี) destination — hotel layer: 12 real hotels TH+EN reviews + Top 10 roundup',
  phases: [
    { title: 'Plan',    detail: 'pick 12 currently-operating Koh Larn hotels/guesthouses across tiers' },
    { title: 'Review',  detail: 'one hotel-reviewer agent per hotel → TH+EN review JSON' },
    { title: 'Roundup', detail: 'build Top 10 ที่พักเกาะล้าน roundup TH+EN' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-koh-larn.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-koh-larn" (EN /en/) · crumbCityName="เกาะล้าน"/(EN "Koh Larn"), crumbCityHref="city-koh-larn.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- related/prev/next ลิงก์ไปรีวิวโรงแรมในชุดนี้ (slug ที่ planner กำหนด)
- รูป hero: หารูปจริงของโรงแรม (Booking/Agoda/Trip/Google) โหลดไป astro/public/images/hotels/koh-larn-<short>.jpg (curl -m 60 --connect-timeout 20) ครบ hero+gallery ถ้าโหลดไม่ได้ปล่อยว่าง (layout มี gradient placeholder)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว · เกาะล้านที่พักส่วนใหญ่เป็นเกสต์เฮาส์/รีสอร์ตเล็ก ราคาสวิงตามวันหยุด ใช้ราคาช่วงปกติ
- บันทึกเฉพาะ slug ของโรงแรมตัวเองเท่านั้น ห้ามเขียนทับไฟล์ของโรงแรมอื่น
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้เป็นคำธรรมชาติ (เหมาะ/ลงตัว/ครบ/เด่น/เด็ด) ก่อนบันทึก
`

const existingReviews = (args && args.existingReviews) ? args.existingReviews : []
let hotels, slugList, okR

if (existingReviews.length >= 10) {
  hotels = existingReviews.map(s => ({ slug: s, name: s }))
  slugList = existingReviews.join('\n')
  okR = existingReviews
  log(`Recovery mode: ${existingReviews.length} reviews already on disk → roundup only`)
} else {
  phase('Plan')
  const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['hotels'], properties:{ hotels:{ type:'array', minItems:12, maxItems:12, items:{ type:'object', additionalProperties:false, required:['name','slug','area','tier','starTier'], properties:{
    name:{type:'string'}, slug:{type:'string', description:'review-<hotel-kebab>-koh-larn (ต้องไม่ซ้ำกับตัวอื่น และต้องลงท้าย -koh-larn)'}, area:{type:'string'}, tier:{type:'string', enum:['luxury','boutique','midrange','budget','hostel']}, starTier:{type:'number'} } } } } }

  const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/รีสอร์ต/เกสต์เฮาส์บนเกาะล้าน (จ.ชลบุรี หน้าพัทยา) ที่ "เปิดดำเนินการอยู่จริงตอนนี้" 12 แห่ง สำหรับชุดรีวิว + Top 10 ของ thailandaddict.com
คละระดับ: รีสอร์ต/พูลวิลล่าดี 2-3 · บูทีค 2-3 · กลาง 3 · ประหยัด/เกสต์เฮาส์ 3 · โฮสเทล 1 — กระจายย่าน (หมู่บ้านหน้าบ้าน/ท่าเรือ · หาดตาแหวน · หาดแสม · หาดเทียน)
**ห้ามเลือกซ้ำชื่อโรงแรมเดียวกัน** เลือกที่มีรีวิวจริงและจองได้จริง ห้ามที่ปิดถาวร/เปลี่ยนชื่อ (เกาะล้านที่พักเล็ก ค้นให้ครบ 12 ที่มีจริง)
**ต้องได้ 12 ที่ slug ไม่ซ้ำกันเลย และเป็นคนละโรงแรมกันจริง ๆ** — slug = review-<ชื่อ-kebab>-koh-larn (ลงท้าย -koh-larn เสมอ) · คืนผลตาม schema (12 รายการพอดี)`,
    { label:'plan:koh-larn-hotels', phase:'Plan', schema: PLAN_SCHEMA }
  )

  const seen = new Set()
  hotels = plan.hotels.filter(h => { if(seen.has(h.slug)) return false; seen.add(h.slug); return true })
  slugList = hotels.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.starTier}★, ${h.area})`).join('\n')
  log(`Planned ${hotels.length} unique hotels. Writing reviews…`)

  phase('Review')
  const reviewed = await parallel(hotels.map(h => () =>
    agent(
`รีวิวที่พัก "${h.name}" เกาะล้าน ชลบุรี · slug=${h.slug} · ระดับ ${h.starTier} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 ที่พักเกาะล้าน" (top10-hotels-koh-larn)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม
⚠️ เขียนไฟล์ที่ slug=${h.slug} เป๊ะ ๆ เท่านั้น (astro/src/content/reviews/${h.slug}.json และ reviews-en/${h.slug}.json) ห้ามเติม/เปลี่ยน suffix ห้ามเขียนทับ slug อื่น
${OVERRIDES}
ที่พักอื่นในชุดนี้: \n${slugList}`,
      { label:`review:${h.slug}`, phase:'Review' }
    ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
  ))
  okR = reviewed.filter(x=>x&&x.ok).map(x=>x.slug)
  log(`Reviews written: ${okR.length}/${hotels.length}`)
}

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup "Top 10 ที่พักเกาะล้าน": เขียน astro/src/content/roundups/top10-hotels-koh-larn.json (ไทย) + roundups-en/top10-hotels-koh-larn.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-koh-larn" · จัดอันดับจากรีวิวในชุด (อ่าน JSON ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-koh-larn)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
ที่พักในชุด:\n${slugList}`,
  { label:'roundup:koh-larn', phase:'Roundup' }
)

return { hotels: hotels.length, reviewsOk: okR.length, roundup: 'top10-hotels-koh-larn' }

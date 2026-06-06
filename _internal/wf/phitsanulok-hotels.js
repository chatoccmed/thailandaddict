export const meta = {
  name: 'phitsanulok-hotels',
  description: 'Phitsanulok gold-template — hotel layer: pick 12 real hotels, write TH+EN reviews + Top 10 roundup',
  phases: [
    { title: 'Plan',    detail: 'pick 12 currently-operating Phitsanulok hotels across tiers' },
    { title: 'Review',  detail: 'one hotel-reviewer agent per hotel → TH+EN review JSON' },
    { title: 'Roundup', detail: 'build Top 10 โรงแรมพิษณุโลก roundup TH+EN' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และใช้ไฟล์ตัวอย่างรูปแบบ: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent ชี้ roundup: parentHref="top10-hotels-phitsanulok.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-phitsanulok" (EN ใช้ /en/) · crumbCityName="พิษณุโลก"/(EN "Phitsanulok"), crumbCityHref="city-phitsanulok.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- related/prev/next ลิงก์ไปรีวิวโรงแรมพิษณุโลกตัวอื่นในชุดนี้ (ใช้ slug ที่ planner กำหนด)
- รูป hero: พยายามโหลดจริงไป astro/public/images/hotels/phitsanulok-<short>.jpg ถ้าโหลดไม่ได้ปล่อยว่าง (layout มี onerror) อย่าใส่ลิงก์ที่ใช้ไม่ได้
- ราคาบอกเป็น "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- ⚠️ ก่อนบันทึกไฟล์รีวิว ค้นไฟล์ตัวเองว่ามีคำต้องห้ามไหม (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) ถ้ามีให้แก้ทุกจุดเป็นคำธรรมชาติ (เหมาะ/ลงตัว/ครบ/เด่น/เด็ด) ก่อนบันทึก
`

phase('Plan')
const PLAN_SCHEMA = { type:'object', additionalProperties:false, required:['hotels'], properties:{ hotels:{ type:'array', minItems:10, maxItems:12, items:{ type:'object', additionalProperties:false, required:['name','slug','area','tier','starTier'], properties:{
  name:{type:'string'}, slug:{type:'string', description:'review-<hotel-kebab>-phitsanulok'}, area:{type:'string'}, tier:{type:'string', enum:['luxury','boutique','midrange','budget','hostel']}, starTier:{type:'number'} } } } } }

const plan = await agent(
`ค้นเว็บ (Booking/Agoda/Trip.com) เลือกโรงแรม/ที่พักในจังหวัดพิษณุโลกที่ "เปิดดำเนินการอยู่จริงตอนนี้" 12 แห่ง สำหรับทำชุดรีวิว + จัดอันดับ Top 10 ของ thailandaddict.com
พิษณุโลกเป็นเมืองใหญ่ของเหนือตอนล่าง ที่พักส่วนใหญ่อยู่ในตัวเมือง (โรงแรมกลางเมือง/ริมแม่น้ำน่าน/ใกล้วัดใหญ่/ใกล้สถานีรถไฟ-สนามบิน) มีหลายระดับ
คละระดับให้สมจริง: หรู/4 ดาว 2 · บูทีค/3-4 ดาว 4 · กลาง 3 · ประหยัด/เกสต์เฮาส์ 2 · โฮสเทล 1 — กระจายทำเล (ใจกลางเมือง/ริมน้ำน่าน/ใกล้วัดใหญ่/ใกล้สถานี)
เลือกที่ที่มีรีวิวจริงเยอะและคนไทยรู้จัก/จองได้จริง ห้ามเลือกที่ปิดถาวรหรือเปลี่ยนชื่อ
ตั้ง slug = review-<ชื่อโรงแรม-kebab>-phitsanulok
คืนผลตาม schema (name, slug, area, tier, starTier)`,
  { label:'plan:plk-hotels', phase:'Plan', schema: PLAN_SCHEMA }
)

const hotels = plan.hotels
const slugList = hotels.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.starTier}★, ${h.area})`).join('\n')
log(`Planned ${hotels.length} hotels. Writing reviews…`)

phase('Review')
const reviewed = await parallel(hotels.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" พิษณุโลก · slug=${h.slug} · ระดับ ${h.starTier} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมพิษณุโลก" (top10-hotels-phitsanulok)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาทและทำตามทุกขั้นตอนในไฟล์นั้น (วิจัยเว็บ → อ่าน schema → เขียน TH+EN → รูป) ครบทุก field — ยกเว้นจุดที่ override ด้านล่างให้ยึดตาม override
${OVERRIDES}
โรงแรมอื่นในชุดนี้ (ใช้ทำ related/prev/next): \n${slugList}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
const okR = reviewed.filter(x=>x&&x.ok)
log(`Reviews written: ${okR.length}/${hotels.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วสวมบทบาทและทำตามทุกขั้นตอนในไฟล์นั้น — ยกเว้นจุด override ด้านล่าง
สร้างหน้า roundup "Top 10 โรงแรมพิษณุโลก" ของ thailandaddict.com
เขียน 2 ไฟล์: astro/src/content/roundups/top10-hotels-phitsanulok.json (ไทย) และ astro/src/content/roundups-en/top10-hotels-phitsanulok.json (อังกฤษ)
ดู schema ที่ astro/src/content.config.ts (roundupSchema) และรูปแบบจาก _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-phitsanulok" · จัดอันดับจากโรงแรมที่รีวิวไว้แล้วในชุดนี้ (อ่าน JSON ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-phitsanulok เพื่อดึงคะแนน/ราคา/ทำเล/ลิงก์จองมาใส่ entries)
แต่ละ entry: reviewUrl="<slug ของรีวิว>.html", agodaUrl/bookingUrl/tripUrl ตามที่รีวิวนั้นใช้, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด:\n${slugList}`,
  { label:'roundup:plk', phase:'Roundup' }
)

return { hotels: hotels.length, reviewsOk: okR.length, failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

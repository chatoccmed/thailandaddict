export const meta = {
  name: 'satun-hotels-recover',
  description: 'Recover 8 missing Satun hotel reviews (stalled workflow) + build Top 10 roundup to 12',
  phases: [
    { title: 'Review',  detail: 'write the 8 missing Satun hotel TH+EN reviews' },
    { title: 'Roundup', detail: 'build Top 10 โรงแรมสตูล roundup with all 12' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-satun.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-satun" (EN /en/) · crumbCityName="สตูล"/(EN "Satun"), crumbCityHref="city-satun.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- รูป hero: พยายามโหลดจริงไป astro/public/images/hotels/satun-<short>.jpg (curl -m 60 --connect-timeout 20) ถ้าโหลดไม่ได้ปล่อยว่าง (layout มี onerror)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้เป็นคำธรรมชาติ ก่อนบันทึก
- ต้องเขียนไฟล์จริงทั้ง TH+EN ให้ครบ ห้ามรายงานเสร็จโดยไม่เขียนไฟล์
`

const MISSING = [
  { name:'Bara Bara Budget Satun', slug:'review-bara-bara-budget-satun-satun', area:'ในเมืองสตูล/ปากบารา', tier:'budget', star:2 },
  { name:'Byte Hostel Satun', slug:'review-byte-hostel-satun', area:'ในเมืองสตูล', tier:'hostel', star:2 },
  { name:'Mountain Resort Koh Lipe', slug:'review-mountain-resort-koh-lipe-satun', area:'เกาะหลีเป๊ะ', tier:'midrange', star:3 },
  { name:'Pakarang Resort (ปะการังรีสอร์ท)', slug:'review-pakarang-resort-satun', area:'ปากบารา/ละงู', tier:'midrange', star:3 },
  { name:'Pinnacle Satun Wangmai Hotel', slug:'review-pinnacle-satun-wangmai-hotel-satun', area:'ในเมืองสตูล', tier:'boutique', star:4 },
  { name:'SeeSea Resort Koh Lipe', slug:'review-seesea-resort-satun', area:'เกาะหลีเป๊ะ หาดซันไรส์', tier:'midrange', star:3 },
  { name:'Sinkiat Buri Hotel', slug:'review-sinkiat-buri-hotel-satun', area:'ในเมืองสตูล', tier:'midrange', star:3 },
  { name:'Sinkiat Thani Hotel', slug:'review-sinkiat-thani-hotel-satun', area:'ในเมืองสตูล', tier:'midrange', star:3 },
]

const slugList = `Sita Beach Resort Koh Lipe → review-sita-beach-resort-koh-lipe-satun (เกาะหลีเป๊ะ)
Bundhaya Resort Koh Lipe → review-bundhaya-resort-koh-lipe-satun (เกาะหลีเป๊ะ)
Idyllic Concept Resort Koh Lipe → review-idyllic-concept-resort-satun (เกาะหลีเป๊ะ)
Serene Resort Koh Lipe → review-serene-resort-koh-lipe-satun (เกาะหลีเป๊ะ)
` + MISSING.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.star}★, ${h.area})`).join('\n')

phase('Review')
const reviewed = await parallel(MISSING.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" สตูล · slug=${h.slug} · ระดับ ${h.star} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมสตูล" (top10-hotels-satun)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม อย่ารอจนค้าง
${OVERRIDES}
โรงแรมอื่นในชุดนี้: \n${slugList}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
log(`Reviews recovered: ${reviewed.filter(x=>x&&x.ok).length}/${MISSING.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup "Top 10 โรงแรมสตูล" ให้ครบทั้ง 12 โรงแรม: เขียน astro/src/content/roundups/top10-hotels-satun.json (ไทย) + roundups-en/top10-hotels-satun.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-satun" · จัดอันดับจากรีวิวในชุด (อ่าน JSON ทุกไฟล์ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review- และลงท้าย -satun — มี 12 ไฟล์)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด (12):\n${slugList}`,
  { label:'roundup:satun', phase:'Roundup' }
)

return { recovered: reviewed.filter(x=>x&&x.ok).length }

export const meta = {
  name: 'samui-hotels-recover',
  description: 'Samui — add 4 more real hotels (to reach 12) + build Top 10 roundup from all samui reviews',
  phases: [
    { title: 'Review',  detail: 'write 4 more Koh Samui hotel reviews TH+EN' },
    { title: 'Roundup', detail: 'build Top 10 โรงแรมเกาะสมุย from all 12 reviews' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ตรงทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json + reviews-en/<slug>.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain
- breadcrumb/parent: parentHref="top10-hotels-samui.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-samui" (EN /en/) · crumbCityName="เกาะสมุย"/(EN "Koh Samui"), crumbCityHref="city-samui.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH" · cluster="samui"
- รูป hero: หารูปจริงของโรงแรม (Booking/Agoda/Trip/Google) โหลดไป astro/public/images/hotels/samui-<short>.jpg (curl -m 60 --connect-timeout 20) ถ้าไม่ได้ปล่อยว่าง (มี gradient placeholder)
- ⚠️ บันทึกที่ slug ที่กำหนดเป๊ะ ๆ เท่านั้น (ห้ามเติม -surat-thani หรือ suffix อื่น) · ห้ามเขียนทับ slug อื่น
- ⚠️ ก่อนบันทึก ค้นคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ถ้ามีแก้เป็นคำธรรมชาติก่อน
`

const HOTELS = [
  { name:'Chaweng Regent Beach Resort', slug:'review-chaweng-regent-beach-resort-samui', tier:'luxury', star:4, area:'หาดเฉวง Chaweng ติดหาด' },
  { name:'OZO Chaweng Samui', slug:'review-ozo-chaweng-samui', tier:'midrange', star:4, area:'หาดเฉวง Chaweng ใกล้หาด-ย่านกลางคืน' },
  { name:'Lamai Wanta Beach Resort', slug:'review-lamai-wanta-beach-resort-samui', tier:'midrange', star:3, area:'หาดละไม Lamai ติดหาด' },
  { name:'Lub d Koh Samui Chaweng Beach', slug:'review-lub-d-koh-samui-chaweng-samui', tier:'hostel', star:3, area:'หาดเฉวง Chaweng โฮสเทล/บูทีค' },
]
const EXISTING = ['review-banyan-tree-samui (Banyan Tree, luxury)','review-garrya-tongsai-bay-samui (Garrya Tongsai Bay, luxury)','review-greenlight-fishermans-village-resort-samui (boutique)','review-la-vida-samui','review-lipa-bay-resort-samui','review-maenam-resort-samui','review-sala-samui-chaweng-beach-resort-samui (luxury)','review-the-waterfront-boutique-hotel-samui (boutique)']
const fullSet = [...HOTELS.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.star}★, ${h.area})`), ...EXISTING].join('\n')

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" เกาะสมุย · slug=${h.slug} · ระดับ ${h.star} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมเกาะสมุย" (top10-hotels-samui)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บหาข้อมูลจริง → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override · ถ้า WebFetch ค้างให้ข้าม
เขียนไฟล์ astro/src/content/reviews/${h.slug}.json และ reviews-en/${h.slug}.json เท่านั้น (ยืนยัน ls -l ทั้ง 2 ไฟล์)
${OVERRIDES}
โรงแรมทั้งหมดในชุดนี้ (related/prev/next): \n${fullSet}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
log(`Reviews added: ${reviewed.filter(x=>x&&x.ok).length}/${HOTELS.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override
สร้าง roundup "Top 10 โรงแรมเกาะสมุย": เขียน astro/src/content/roundups/top10-hotels-samui.json + roundups-en/top10-hotels-samui.json
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-samui" · อ่าน JSON ทุกไฟล์ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-samui และ cluster=="samui" (มี 12 ไฟล์) เพื่อดึง score/stars/price/ทำเล/ลิงก์จองมาใส่ entries (จัด Top 10)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด:\n${fullSet}`,
  { label:'roundup:samui', phase:'Roundup' }
)

return { added: reviewed.filter(x=>x&&x.ok).length, roundup: 'top10-hotels-samui' }

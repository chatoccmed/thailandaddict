export const meta = {
  name: 'chaiyaphum-hotels-recover',
  description: 'Recover the 10 lost Chaiyaphum hotel reviews (reuse committed images) + rebuild Top 10 roundup',
  phases: [
    { title: 'Review',  detail: 'regenerate 10 missing hotel reviews TH+EN, reuse existing images' },
    { title: 'Roundup', detail: 'rebuild Top 10 โรงแรมชัยภูมิ roundup from all 12 reviews' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-chaiyaphum.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-chaiyaphum" (EN /en/) · crumbCityName="ชัยภูมิ"/(EN "Chaiyaphum"), crumbCityHref="city-chaiyaphum.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- related/prev/next ลิงก์ไปรีวิวโรงแรมในชุดนี้ (slug ที่กำหนด)
- ⚠️ รูป: ใช้รูปที่มีอยู่แล้วเท่านั้น — heroImg + gallery ตามที่กำหนดให้ในแต่ละโรงแรม **ห้ามดาวน์โหลดรูปใหม่ ห้ามใช้ curl ห้าม rm** (รูปอยู่ใน repo แล้ว)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- บันทึกเฉพาะ slug ของโรงแรมตัวเองเท่านั้น ห้ามเขียนทับไฟล์ของโรงแรมอื่น
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้เป็นคำธรรมชาติ (เหมาะ/ลงตัว/ครบ/เด่น/เด็ด) ก่อนบันทึก
`

// 10 hotels whose reviews were lost; images already committed in repo
const HOTELS = [
  { name:'โรงแรมเลิศนิมิตร (Lert Nimitra Hotel)', slug:'review-lert-nimitra-chaiyaphum', tier:'midrange', star:3, area:'ใจกลางเมืองชัยภูมิ ใกล้อนุสาวรีย์เจ้าพ่อพญาแล', hero:'images/hotels/chaiyaphum-lertnimitra-1.jpg', gallery:['images/hotels/chaiyaphum-lertnimitra-2.jpg','images/hotels/chaiyaphum-lertnimitra-3.jpg','images/hotels/chaiyaphum-lertnimitra-4.jpg'] },
  { name:'โรงแรมแกรนด์ พฤกษาสิริ (Grand Pruksasiri Hotel)', slug:'review-grand-pruksasiri-chaiyaphum', tier:'midrange', star:3, area:'ในเมืองชัยภูมิ', hero:'images/hotels/chaiyaphum-grandpruksasiri-1.jpg', gallery:['images/hotels/chaiyaphum-grandpruksasiri-1.jpg'] },
  { name:'โรงแรมรัตนสิริ (Ratanasiri Hotel)', slug:'review-ratanasiri-chaiyaphum', tier:'midrange', star:3, area:'ในเมืองชัยภูมิ', hero:'images/hotels/chaiyaphum-ratanasiri.jpg', gallery:['images/hotels/chaiyaphum-ratanasiri-2.jpg','images/hotels/chaiyaphum-ratanasiri-3.jpg'] },
  { name:'โรงแรมต้นคูณ (Tonkhoon Hotel)', slug:'review-tonkhoon-chaiyaphum', tier:'midrange', star:3, area:'ใกล้ตัวเมืองชัยภูมิ', hero:'images/hotels/chaiyaphum-tonkhoon.jpg', gallery:['images/hotels/chaiyaphum-tonkhoon-2.jpg','images/hotels/chaiyaphum-tonkhoon-3.jpg','images/hotels/chaiyaphum-tonkhoon-4.jpg'] },
  { name:'ฮ็อป อินน์ ชัยภูมิ (Hop Inn Chaiyaphum)', slug:'review-hop-inn-chaiyaphum', tier:'budget', star:2, area:'ในเมืองชัยภูมิ ใกล้แหล่งช้อปปิ้ง', hero:'images/hotels/chaiyaphum-hopinn.jpg', gallery:['images/hotels/chaiyaphum-hopinn-2.jpg','images/hotels/chaiyaphum-hopinn-3.jpg','images/hotels/chaiyaphum-hopinn-4.jpg'] },
  { name:'บ้านอิงนา รีสอร์ท (Baan Ing Na Resort)', slug:'review-baan-ing-na-chaiyaphum', tier:'boutique', star:3, area:'ชานเมืองชัยภูมิ บรรยากาศสวน', hero:'images/hotels/chaiyaphum-baan-ing-na-1.jpg', gallery:['images/hotels/chaiyaphum-baan-ing-na-2.jpg','images/hotels/chaiyaphum-baan-ing-na-3.jpg','images/hotels/chaiyaphum-baan-ing-na-4.jpg'] },
  { name:'ภูสวย รีสอร์ท (Phu Suay Resort)', slug:'review-phu-suay-chaiyaphum', tier:'boutique', star:3, area:'อำเภอเทพสถิต ใกล้ป่าหินงาม วิวภูเขา', hero:'images/hotels/chaiyaphum-phusuay.jpg', gallery:['images/hotels/chaiyaphum-phusuay-2.jpg','images/hotels/chaiyaphum-phusuay-3.jpg'] },
  { name:'ป่าดินหินงาม รีสอร์ท (Pa Din Hin Ngam Resort)', slug:'review-pa-din-hin-ngam-chaiyaphum', tier:'midrange', star:3, area:'อำเภอเทพสถิต ใกล้อุทยานป่าหินงาม-ทุ่งกระเจียว', hero:'images/hotels/chaiyaphum-padinhinngam-1.jpg', gallery:['images/hotels/chaiyaphum-padinhinngam-2.jpg','images/hotels/chaiyaphum-padinhinngam-3.jpg','images/hotels/chaiyaphum-padinhinngam-4.jpg'] },
  { name:'เทพสถิต รีสอร์ท (Thep Satit Resort)', slug:'review-thep-satit-chaiyaphum', tier:'budget', star:2, area:'อำเภอเทพสถิต ทางขึ้นป่าหินงาม', hero:'images/hotels/chaiyaphum-thepsatit-1.jpg', gallery:['images/hotels/chaiyaphum-thepsatit-2.jpg','images/hotels/chaiyaphum-thepsatit-3.jpg','images/hotels/chaiyaphum-thepsatit-4.jpg'] },
  { name:'คอนสาร โฮมสเตย์ (Khonsan Homestay)', slug:'review-khonsan-homestay-chaiyaphum', tier:'budget', star:2, area:'อำเภอคอนสาร ใกล้เขื่อนจุฬาภรณ์', hero:'images/hotels/chaiyaphum-khonsan-homestay.jpg', gallery:['images/hotels/chaiyaphum-khonsan-homestay-2.jpg','images/hotels/chaiyaphum-khonsan-homestay-3.jpg'] },
]

const EXISTING = ['review-park-villa-chaiyaphume-chaiyaphum (Park Villa)','review-siam-river-resort-chaiyaphum (Siam River Resort)']
const fullSet = [...HOTELS.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.star}★, ${h.area})`), ...EXISTING].join('\n')

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" จังหวัดชัยภูมิ · slug=${h.slug} · ระดับ ${h.star} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมชัยภูมิ" (top10-hotels-chaiyaphum)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บหาข้อมูลโรงแรมจริง → schema → เขียน TH+EN) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม อย่ารอจนค้าง
เขียนไฟล์ astro/src/content/reviews/${h.slug}.json และ reviews-en/${h.slug}.json เท่านั้น (ยืนยันด้วย ls -l ว่าเขียนจริงทั้ง 2 ไฟล์ก่อนจบงาน)
⚠️ รูปมีอยู่แล้ว ใช้ค่านี้เป๊ะ ห้ามดาวน์โหลด/curl/rm:
  heroImg = "${h.hero}"
  gallery = ${JSON.stringify(h.gallery)}
  image (og) = "${h.hero}"
${OVERRIDES}
โรงแรมทั้งหมดในชุดนี้ (ใช้ทำ related/prev/next): \n${fullSet}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
const okR = reviewed.filter(x=>x&&x.ok).map(x=>x.slug)
log(`Reviews regenerated: ${okR.length}/${HOTELS.length}`)

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup "Top 10 โรงแรมชัยภูมิ": เขียน astro/src/content/roundups/top10-hotels-chaiyaphum.json (ไทย) + roundups-en/top10-hotels-chaiyaphum.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-chaiyaphum" · จัดอันดับจากรีวิวในชุด — อ่าน JSON ทุกไฟล์ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review-...-chaiyaphum (มี 12 ไฟล์) เพื่อดึง score/stars/price/ทำเล/ลิงก์จองมาใส่ entries
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง · ห้ามดาวน์โหลดรูป/curl/rm
${OVERRIDES}
โรงแรมในชุด:\n${fullSet}`,
  { label:'roundup:chaiyaphum', phase:'Roundup' }
)

return { regenerated: okR.length, failed: reviewed.filter(x=>!x||!x.ok).map(x=>x&&x.slug), roundup: 'top10-hotels-chaiyaphum' }

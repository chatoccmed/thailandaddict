export const meta = {
  name: 'trang-hotels-recover',
  description: 'Recover the missing 12th Trang hotel review (Anantara Si Kao) + rebuild Top 10 roundup to 12',
  phases: [
    { title: 'Review',  detail: 'write the missing Anantara Si Kao Resort TH+EN review' },
    { title: 'Roundup', detail: 'rebuild Top 10 โรงแรมตรัง roundup with all 12' },
  ],
}

const OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com ไม่ใช่ tourlogy/wherebest):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema ที่ astro/src/content.config.ts (reviewSchema) และไฟล์ตัวอย่าง: _internal/templates/review.sample.json — output ต้องตรง schema ทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json (ไทย) และ astro/src/content/reviews-en/<slug>.json (อังกฤษ)
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain URL
- breadcrumb/parent: parentHref="top10-hotels-trang.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-trang" (EN /en/) · crumbCityName="ตรัง"/(EN "Trang"), crumbCityHref="city-trang.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- รูป hero: พยายามโหลดจริงไป astro/public/images/hotels/trang-anantara-si-kao.jpg (curl -m 60 --connect-timeout 20) ถ้าโหลดไม่ได้ปล่อยว่าง (layout มี onerror)
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง ไม่เอาราคาพีคจุดเดียว
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้เป็นคำธรรมชาติ (เหมาะ/ลงตัว/ครบ/เด่น/เด็ด) ก่อนบันทึก
`

const slugList = `A Local Something → review-a-local-something-trang (boutique, ในเมืองตรัง)
Anantara Si Kao Resort & Spa → review-anantara-si-kao-resort-spa-trang (luxury, สิเกา/หาดปากเมง)
Ban Aothong Hotel → review-ban-aothong-hotel-trang (midrange, ในเมืองตรัง)
BB Trang Hotel → review-bb-trang-hotel-trang (midrange, ในเมืองตรัง)
Chom Trang → review-chomtrang-trang (budget/boutique, ในเมืองตรัง)
Gin Gin Hotel Trang Old Town → review-gingin-hotel-trang-old-town-trang (boutique, เมืองเก่าตรัง)
Koh Mook Sivalai Beach Resort → review-koh-mook-sivalai-beach-resort-trang (boutique, เกาะมุก)
Kradan Beach Resort → review-kradan-beach-resort-trang (midrange, เกาะกระดาน)
Lamoon Boutique Trang → review-lamoon-boutique-trang-trang (boutique, ในเมืองตรัง)
Namthip Residence → review-namthip-residence-trang (budget, ในเมืองตรัง)
Pakmeng Resort → review-pakmeng-resort-trang (midrange, หาดปากเมง)
Thumrin Thana Hotel → review-thumrin-thana-hotel-trang (midrange, ในเมืองตรัง)`

phase('Review')
await agent(
`รีวิวโรงแรม "Anantara Si Kao Resort & Spa" (อนันตรา สิเกา รีสอร์ท แอนด์ สปา) ตรัง · slug=review-anantara-si-kao-resort-spa-trang · ระดับ 5 ดาว (luxury) · ย่าน สิเกา/หาดปากเมง ริมทะเลอันดามัน
อยู่ในชุด roundup "Top 10 โรงแรมตรัง" (top10-hotels-trang)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บ → schema → TH+EN → รูป) ครบทุก field — ยกเว้น override ด้านล่าง · ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติให้ข้าม อย่ารอจนค้าง
ต้องเขียนไฟล์จริง 2 ไฟล์ให้ครบ (TH + EN) ห้ามรายงานเสร็จโดยไม่เขียนไฟล์
${OVERRIDES}
โรงแรมอื่นในชุดนี้: \n${slugList}`,
  { label:'review:anantara-si-kao', phase:'Review' }
).then(()=>({ok:true})).catch(()=>({ok:false}))

phase('Roundup')
await agent(
`สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-roundup-builder.md ก่อน แล้วทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง/อัปเดต roundup "Top 10 โรงแรมตรัง" ให้ครบทั้ง 12 โรงแรม: เขียนทับ astro/src/content/roundups/top10-hotels-trang.json (ไทย) + roundups-en/top10-hotels-trang.json (อังกฤษ)
ดู schema (roundupSchema) + รูปแบบ _internal/templates/roundup.sample.json — ตรงทุก field
slug="top10-hotels-trang" · จัดอันดับจากรีวิวในชุด (อ่าน JSON ทุกไฟล์ใน astro/src/content/reviews/ ที่ slug ขึ้นต้น review- และลงท้าย -trang — มี 12 ไฟล์ รวม anantara-si-kao ที่เพิ่งเขียน)
แต่ละ entry: reviewUrl="<slug>.html", agodaUrl/bookingUrl/tripUrl ตามรีวิว, score/stars/price จริง
${OVERRIDES}
โรงแรมในชุด (12):\n${slugList}`,
  { label:'roundup:trang', phase:'Roundup' }
)

return { recovered: 'anantara-si-kao' }

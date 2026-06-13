export const meta = {
  name: 'port-pilot-cm-luxury',
  description: 'PILOT: port old post top5-luxary-5-stars-hotel-chiang-mai → rewritten roundup (>=200w/hotel) + 5 per-hotel reviews (>=2000w each, TH+EN)',
  phases: [
    { title: 'Reviews', detail: '5 per-hotel reviews >=2000 words each (TH+EN)' },
    { title: 'Roundup', detail: 'rewritten Top 5 luxury roundup >=200w/hotel' },
  ],
}

const CLUSTER = 'chiang-mai', TH = 'เชียงใหม่';
const HOTELS = [
  { name:'U Nimman Chiang Mai', slug:'review-u-nimman-chiang-mai', area:'นิมมานเหมินท์', tier:'luxury', star:5, price:'฿3,500' },
  { name:'Na Nirand Romantic Boutique Resort', slug:'review-na-nirand-chiang-mai', area:'ริมแม่น้ำปิง', tier:'luxury', star:5, price:'฿3,900' },
  { name:'Raya Heritage', slug:'review-raya-heritage-chiang-mai', area:'ริมแม่น้ำปิง ทางเหนือของเมือง', tier:'luxury', star:5, price:'฿9,800' },
  { name:'137 Pillars House', slug:'review-137-pillars-house-chiang-mai', area:'วัดเกต', tier:'luxury', star:5, price:'฿15,000' },
  { name:'Akyra Manor Chiang Mai', slug:'review-akyra-manor-chiang-mai', area:'นิมมานเหมินท์', tier:'luxury', star:5, price:'฿3,900' },
];
const sibs = HOTELS.map(h=>h.slug).join(', ');

const STYLE = `สไตล์การเขียน (สำคัญ — เลียนแบบ wherebest/thailandaddict v2-clean):
- โทน "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ ตรงไปตรงมา เป็นกันเอง อ่านลื่น ไม่ขายของเว่อร์ ไม่ใช่โบรชัวร์
- honesty: บอกทั้งข้อดี-ข้อสังเกต/ข้อจำกัดตามจริง อ้างอิง "เสียงจากรีวิวจริง" ไม่อ้างว่าไปพักเอง
- ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI: ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน
- ข้อมูลทันสมัย: ค้นเว็บยืนยันว่าโรงแรม "เปิดอยู่จริงตอนนี้" ราคา/ห้อง/สิ่งอำนวยความสะดวกอัปเดต · ถ้าปิดถาวรให้รายงานเพื่อหาตัวแทน (อย่าเขียนต่อ)`;

phase('Reviews')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(`เขียนรีวิวโรงแรมเชิงลึก "${h.name}" จังหวัด${TH} ลง thailandaddict.com — **ความยาวเนื้อหา (body) อย่างน้อย 2,000 คำภาษาไทย** (ละเอียดจริงจังแบบ https://www.wherebest.com/review-cho-hotel-taipei)
slug=${h.slug} · cluster=${CLUSTER} · ระดับ ${h.star}★ (${h.tier}) · ย่าน ${h.area} · ราคาเริ่ม ${h.price}

อ่านก่อน: .claude/agents/tourlogy-hotel-reviewer.md (วิธีรีวิว/EEAT) + astro/src/content.config.ts (reviewSchema) + _internal/templates/review.sample.json (รูปแบบ field) + ดูรีวิวเชียงใหม่ที่มีอยู่ 1 ไฟล์เป็นตัวอย่างโครง (ls astro/src/content/reviews/ | grep chiang-mai)

OUTPUT: เขียน 2 ไฟล์ตรง reviewSchema ทุก field — astro/src/content/reviews/${h.slug}.json (ไทย) + astro/src/content/reviews-en/${h.slug}.json (อังกฤษ)
- **body ต้องยาว ≥2,000 คำ (ไทย) / ≥1,800 words (EN)** แบ่งเป็นหลายหัวข้อย่อยใน body (kind p/quote): ภาพรวม-ใครเหมาะ, ทำเล+การเดินทาง, ประเภทห้อง+การตกแต่ง, สิ่งอำนวยความสะดวก/สระ/สปา, อาหาร-บาร์, บริการ, เสียงจากรีวิวจริง (ทั้งชม-ติ), เทียบราคา-ความคุ้ม, ข้อควรรู้ก่อนจอง, สรุป
- vิจัยเว็บจริง (Booking/Agoda/Trip/Tripadvisor/เว็บโรงแรม) อัปเดตข้อมูลปัจจุบัน · affiliate: Agoda ?cid=1965862 · Trip ?Allianceid=6861268&SID=312919111 · Booking plain · heroSub2Href ใช้ลิงก์ Trip/Agoda ที่มี ID
- breadcrumb: parentHref="top5-luxury-5-star-hotels-chiang-mai.html", crumbCityName="${TH}", crumbCityHref="city-${CLUSTER}.html", countryHref="country-thailand.html", addressCountry="TH"
- รูป hero: พยายาม curl -m 60 รูปจริงไป astro/public/images/hotels/${CLUSTER}-<short>.jpg (ถ้าไม่ได้ปล่อย heroImg path ไว้ layout มี onerror)
- related/prev/next ลิงก์ในชุดนี้: ${sibs}
${STYLE}
⚠️ ก่อนบันทึก: นับคำ body ให้ ≥2000 (ไทย) · ค้นคำต้องห้ามแล้วแก้ · ยืนยัน ls -l + JSON valid
return: จำนวนคำ body (ไทย/EN), ยืนยันเปิดอยู่จริง`,
    { label:`rev:${h.slug}`, phase:'Reviews' })
    .then(()=>({slug:h.slug,ok:true})).catch(()=>({slug:h.slug,ok:false}))
))
const okR = reviewed.filter(x=>x&&x.ok).length
log(`Reviews: ${okR}/5`)

phase('Roundup')
await agent(`เขียน roundup "5 โรงแรมสุดหรู 5 ดาว ใจกลางเชียงใหม่" (พอร์ตจากโพสต์เดิม top5-luxary-5-stars-hotel-chiang-mai เขียนใหม่สไตล์เรา)
อ่าน .claude/agents/tourlogy-roundup-builder.md + roundupSchema + _internal/templates/roundup.sample.json + ดู roundup เชียงใหม่ที่มีอยู่เป็นโครง
OUTPUT: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json (ไทย) + roundups-en/top5-luxury-5-star-hotels-chiang-mai.json (อังกฤษ) ตรง schema ทุก field
- entries 5 โรงแรม (อ่านจากไฟล์รีวิวที่เพิ่งสร้าง: ${HOTELS.map(h=>h.slug).join(', ')}) — **คำบรรยายแต่ละโรงแรมใน entry/storyHtml ≥200 คำ** สไตล์เพื่อนเล่า
- entries/toc/compareRows จำนวนเท่ากัน (5) เรียงตรงตำแหน่ง · rank/id(h1..h5)/toc.n 1..5 · reviewUrl=<slug>.html ตรงไฟล์รีวิว · score/price/agoda/booking/trip ตามรีวิว
- slug="top5-luxury-5-star-hotels-chiang-mai" · cluster เชียงใหม่ · เลขในชื่อ=5
${STYLE}
ยืนยัน JSON valid + entries.length===toc.length===compareRows.length===5`,
  { label:'roundup:cm-luxury', phase:'Roundup' })

return { reviews: okR, roundup: 'top5-luxury-5-star-hotels-chiang-mai' }

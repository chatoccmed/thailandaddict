export const meta = {
  name: 'kalasin-recover',
  description: 'Recover 7 swept Kalasin hotel reviews (reuse committed images, match roundup slugs) + 10 swept food articles',
  phases: [
    { title: 'Review',  detail: 'regenerate 7 missing hotel reviews TH+EN, reuse existing images' },
    { title: 'Food',    detail: 'regenerate 10 swept food articles' },
  ],
}

const RV_OVERRIDES = `
ส่วนสำคัญ (เว็บนี้ = thailandaddict.com):
- แบรนด์ = ThailandAddict · โทน v2-clean ไทย (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง
- ดู schema astro/src/content.config.ts (reviewSchema) + ตัวอย่าง _internal/templates/review.sample.json — ตรงทุก field
- เขียน 2 ไฟล์: astro/src/content/reviews/<slug>.json + reviews-en/<slug>.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking plain
- breadcrumb/parent: parentHref="top10-hotels-kalasin.html", parentCrumbUrl ไทย "https://thailandaddict.com/top10-hotels-kalasin" (EN /en/) · crumbCityName="กาฬสินธุ์"/(EN "Kalasin"), crumbCityHref="city-kalasin.html" · countryHref="country-thailand.html", countryLabel="🇹🇭 ไทย"(EN "🇹🇭 Thailand"), countryGuideLabel="คู่มือเที่ยวไทย"(EN "Thailand Guide") · addressCountry="TH"
- ⚠️ รูปมีอยู่แล้ว ใช้ค่าที่กำหนดเป๊ะ ห้ามดาวน์โหลด/curl/rm
- ราคา "เริ่มประมาณ" จากช่วงราคาห้องมาตรฐานจริง · บันทึกเฉพาะ slug ตัวเอง
- ⚠️ ก่อนบันทึก ค้นคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ถ้ามีแก้เป็นคำธรรมชาติก่อน
`

const HOTELS = [
  { name:'โรงแรมริมปาว (Rimpao Hotel)', slug:'review-rimpao-hotel-kalasin', tier:'midrange', star:3, area:'ใจกลางเมืองกาฬสินธุ์ โรงแรมหลักของเมือง', hero:'images/hotels/kalasin-rimpao-1.jpg', gallery:['images/hotels/kalasin-rimpao-2.jpg','images/hotels/kalasin-rimpao-3.jpg'] },
  { name:'โรงแรมฟาริซ่า การ์เด้น (Farisa Garden Hotel)', slug:'review-farisa-garden-hotel-kalasin', tier:'midrange', star:3, area:'ในเมืองกาฬสินธุ์', hero:'images/hotels/kalasin-farisa.jpg', gallery:['images/hotels/kalasin-farisa.jpg'] },
  { name:'ไดโน สตูดิโอ ลักชัวรี โฮมสเตย์ (Dino Studio Luxury Homestay)', slug:'review-dino-studio-luxury-homestay-kalasin', tier:'boutique', star:3, area:'อำเภอสหัสขันธ์ เมืองไดโนเสาร์ ใกล้พิพิธภัณฑ์สิรินธร', hero:'images/hotels/kalasin-dino-studio-1.jpg', gallery:['images/hotels/kalasin-dino-studio-2.jpg','images/hotels/kalasin-dino-studio-3.jpg','images/hotels/kalasin-dino-studio-4.jpg'] },
  { name:'สุขวัญ บูทีค โฮม (Sukwan Boutique Home)', slug:'review-sukwan-boutique-home-sahatsakhan-kalasin', tier:'boutique', star:3, area:'อำเภอสหัสขันธ์ ใกล้เมืองไดโนเสาร์', hero:'images/hotels/kalasin-sukwan-1.jpg', gallery:['images/hotels/kalasin-sukwan-2.jpg','images/hotels/kalasin-sukwan-3.jpg'] },
  { name:'ชฎา วิว รีสอร์ท (Chada View Resort)', slug:'review-chada-view-resort-kalasin', tier:'midrange', star:3, area:'ชานเมืองกาฬสินธุ์ ใกล้เขื่อนลำปาว', hero:'images/hotels/kalasin-chada-view-1.jpg', gallery:['images/hotels/kalasin-chada-view-1.jpg'] },
  { name:'ณภา การ์เด้น (Napa Garden)', slug:'review-napa-garden-kalasin', tier:'midrange', star:3, area:'ในเมืองกาฬสินธุ์ บรรยากาศสวน', hero:'images/hotels/kalasin-napagarden.jpg', gallery:['images/hotels/kalasin-napagarden-2.jpg'] },
  { name:'ลีลาวดี รีสอร์ท คำม่วง (Leelawadee Resort Kham Muang)', slug:'review-leelawadee-resort-kham-muang-kalasin', tier:'budget', star:2, area:'อำเภอคำม่วง ถิ่นผ้าไหมแพรวา', hero:'images/hotels/kalasin-leelawadee-kham-muang-1.jpg', gallery:['images/hotels/kalasin-leelawadee-kham-muang-2.jpg','images/hotels/kalasin-leelawadee-kham-muang-3.jpg','images/hotels/kalasin-leelawadee-kham-muang-4.jpg'] },
]
const EXISTING = ['review-bluetel-kalasin','review-idin-place-hotel-somdet-kalasin','review-phaiboonplace-hotel-kalasin','review-suphak-hotel-kalasin','review-tk-residence-kalasin']
const fullSet = [...HOTELS.map(h=>`${h.name} → ${h.slug} (${h.tier}, ${h.star}★, ${h.area})`), ...EXISTING.map(s=>s+' (มีแล้ว)')].join('\n')

phase('Review')
const reviewed = await parallel(HOTELS.map(h => () =>
  agent(
`รีวิวโรงแรม "${h.name}" จังหวัดกาฬสินธุ์ · slug=${h.slug} · ระดับ ${h.star} ดาว (${h.tier}) · ย่าน ${h.area}
อยู่ในชุด roundup "Top 10 โรงแรมกาฬสินธุ์" (top10-hotels-kalasin)
สำคัญ: อ่านไฟล์ .claude/agents/tourlogy-hotel-reviewer.md ก่อน แล้วสวมบทบาททำตามทุกขั้นตอน (วิจัยเว็บหาข้อมูลโรงแรมจริง → schema → เขียน TH+EN) ครบทุก field — ยกเว้น override · ถ้า WebFetch ค้างให้ข้าม
เขียนไฟล์ astro/src/content/reviews/${h.slug}.json และ reviews-en/${h.slug}.json เท่านั้น (ยืนยันด้วย ls -l ทั้ง 2 ไฟล์ก่อนจบ)
⚠️ รูปมีอยู่แล้ว ใช้ค่านี้เป๊ะ ห้ามดาวน์โหลด/curl/rm:
  heroImg = "${h.hero}"
  gallery = ${JSON.stringify(h.gallery)}
  image (og) = "${h.hero}"
${RV_OVERRIDES}
โรงแรมทั้งหมดในชุดนี้ (related/prev/next): \n${fullSet}`,
    { label:`review:${h.slug}`, phase:'Review' }
  ).then(()=>({slug:h.slug, ok:true})).catch(()=>({slug:h.slug, ok:false}))
))
log(`Reviews regenerated: ${reviewed.filter(x=>x&&x.ok).length}/${HOTELS.length}`)

phase('Food')
const FOOD = [
  ['kalasin-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานกาฬสินธุ์ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['kalasin-lampao-fish','eat-ranking','ร้านปลาน้ำจืดริมเขื่อนลำปาว ปลาเผา ต้มยำปลา ลาบปลา นั่งรับลมริมน้ำ ร้านเด็ด'],
  ['kalasin-cafe-guide','eat-ranking','คาเฟ่กาฬสินธุ์ ในเมือง นั่งชิล กาแฟดี ถ่ายรูป แวะพักระหว่างวัน'],
  ['kalasin-mookata','eat-ranking','หมูกระทะและจิ้มจุ่มกาฬสินธุ์ ร้านยอดนิยม คุ้มราคา มื้อเย็นครอบครัว'],
  ['kalasin-sai-krok-mam','food','ไส้กรอกอีสานและหม่ำกาฬสินธุ์ ของหมักย่างรสเปรี้ยว ของกินเล่นและของฝากประจำเมือง แหล่งซื้อ'],
  ['kalasin-phu-thai-food','food','อาหารผู้ไทกาฬสินธุ์ คำม่วง-กุฉินารายณ์ ต้มไก่ใส่ผัก ของหมักพื้นบ้าน รสเฉพาะถิ่น'],
  ['kalasin-street-food','food','สตรีทฟู้ดและตลาดเย็นกาฬสินธุ์ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['kalasin-local-breakfast','food','อาหารเช้าแบบคนกาฬสินธุ์ (ข้าวเหนียวหมูปิ้ง ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['kalasin-plara-jaewbong','food','ปลาร้าและแจ่วบองกาฬสินธุ์ เครื่องคู่ครัวอีสาน หาซื้อตลาดสด กินกับผักสด ของฝาก'],
  ['kalasin-souvenir-food','food','ของฝากกินได้กาฬสินธุ์ (ไส้กรอกอีสาน หม่ำ ปลาร้า แจ่วบอง ของหมักพื้นบ้าน แหล่งซื้อ)'],
]
const siblingList = 'kalasin-local-dessert, kalasin-attractions, kalasin-dinosaur-trail, lampao-dam, kalasin-1-day-itinerary, kalasin-travel-tips'
function aprompt(slug, type, focus){
  return `เขียนบทความท่องเที่ยวกาฬสินธุ์ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าเขียนจริงก่อนจบ)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่าง _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="kalasin", crumbCity="กาฬสินธุ์", crumbCityHref="city-kalasin.html"
วิธีเขียน:
- อ่าน .claude/agents/tourlogy-food-writer.md เป็นแนวมาตรฐานการเขียน/วิจัย/EEAT แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หาร้านที่เปิดจริงตอนนี้ ชื่อจริง ย่านจริง ราคาประมาณจริง · ถ้า WebFetch ค้างให้ข้าม
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); อื่น→h2/p/list/tip
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 (อย่างน้อย city-kalasin.html และ top10-hotels-kalasin.html + พี่น้อง 1 จาก: ${siblingList})
- heroEmoji เหมาะ ๆ
⚠️ ก่อนบันทึก ค้นคำต้องห้าม (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) ถ้ามีแก้เป็นคำธรรมชาติก่อน
เขียน JSON valid แล้ว return สรุปสั้น ๆ`
}
const af = await parallel(FOOD.map(([slug,type,focus]) => () =>
  agent(aprompt(slug,type,focus), { label:`Food:${slug}`, phase:'Food' }).then(()=>({slug,ok:true})).catch(()=>({slug,ok:false}))
))
log(`Food articles regenerated: ${af.filter(x=>x&&x.ok).length}/${FOOD.length}`)

return { reviews: reviewed.filter(x=>x&&x.ok).length, foodArticles: af.filter(x=>x&&x.ok).length }

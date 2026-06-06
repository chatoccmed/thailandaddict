export const meta = {
  name: 'satun-articles-recover',
  description: 'Recover the 29 missing Satun articles (See/Plan/Prep + 3 food) — articleSchema JSON, v2-clean Thai',
  phases: [
    { title: 'Food', detail: '3 remaining food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['satun-local-breakfast','food','อาหารเช้าแบบคนสตูล โรตี ข้าวยำ นาซิดาแฆ ตลาดเช้า'],
  ['satun-street-food','food','สตรีทฟู้ดและตลาดมุสลิมสตูล ของกินเดินชิม'],
  ['satun-dessert-cafe','eat-ranking','ของหวาน ขนมพื้นบ้าน คาเฟ่ขนม ในเมืองสตูล'],
]
const SEE = [
  ['satun-attractions','attraction','รวมที่เที่ยวสตูลที่ต้องไป คละเกาะ/ทะเล/ธรณี/เมือง (ภาพรวม + cards)'],
  ['koh-lipe','attraction','เกาะหลีเป๊ะ หาดซันไรส์ หาดพัทยา ดำน้ำดูปะการัง ถนนคนเดิน นอนค้าง การเดินทาง'],
  ['tarutao-national-park','attraction','อุทยานแห่งชาติตะรุเตา อ่าวพันเตมะละกา หาดทรายขาว เรือนจำเก่า การไป'],
  ['satun-unesco-geopark','attraction','อุทยานธรณีโลกสตูล ฟอสซิลทะเลโบราณ หินปูน ถ้ำ เรื่องเล่าทางธรณี'],
  ['la-stegodon-cave','attraction','ถ้ำเลสเตโกดอน พายเรือคายัคลอดถ้ำมืด ฟอสซิลช้างสเตโกดอน'],
  ['prasat-hin-phan-yot','attraction','ปราสาทหินพันยอด เกาะเขาใหญ่ ลากูนหินปูน จุดถ่ายรูปแปลกตา'],
  ['wang-sai-thong-waterfall','attraction','น้ำตกวังสายทอง ลานหินปูนหลายชั้น น้ำใสเย็น เล่นน้ำ'],
  ['kuden-mansion','attraction','คฤหาสน์กูเด็น พิพิธภัณฑสถานสตูล สถาปัตยกรรมยุโรปผสมมลายู'],
  ['mambang-mosque','attraction','มัสยิดกลางสตูล มำบัง สถาปัตยกรรม ศูนย์รวมจิตใจชาวมุสลิม'],
  ['koh-hin-ngam-koh-adang','attraction','เกาะหินงาม เกาะอาดัง-ราวี หินกลมสีดำ จุดชมวิว ในเขตตะรุเตา'],
  ['pak-bara-pier','attraction','ปากบารา ท่าเรือออกเกาะ หาด ตลาด ร้านอาหารทะเลริมท่า'],
  ['koh-khai-stone-arch','attraction','เกาะไข่ ซุ้มประตูหินกลางทะเล ดำน้ำตื้น แวะถ่ายรูประหว่างทัวร์เกาะ'],
]
const PLAN = [
  ['satun-1-day-itinerary','itinerary','แผนเที่ยวสตูล 1 วัน เมือง+น้ำตกวังสายทอง หรือ ปากบารา-ตะรุเตาวันเดียว ใช้ block day'],
  ['satun-2d1n-itinerary','itinerary','แผนสตูล 2 วัน 1 คืน ปากบารา-ตะรุเตา-เกาะหลีเป๊ะ ใช้ block day'],
  ['satun-3d2n-itinerary','itinerary','แผนสตูล 3 วัน 2 คืน หลีเป๊ะ+ธรณีโลก+เมือง ใช้ block day'],
  ['lipe-island-plan','itinerary','แผนสายเกาะ หลีเป๊ะ นอนค้าง ดำน้ำดูปะการัง ทัวร์เกาะรอบ ใช้ block day'],
  ['tarutao-pakbara-plan','itinerary','แผนตะรุเตา-ปากบารา วันเดียว เรือนจำเก่า อ่าวพันเตมะละกา ใช้ block day'],
  ['satun-geopark-nature-plan','itinerary','แผนสายธรรมชาติธรณีโลก ถ้ำเลสเตโกดอน-ปราสาทหินพันยอด-น้ำตกวังสายทอง ใช้ block day'],
  ['satun-city-culture-plan','itinerary','แผนสายเมืองและวัฒนธรรม คฤหาสน์กูเด็น-มัสยิดมำบัง-ตลาดมุสลิม ใช้ block day'],
  ['satun-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (หลีเป๊ะ ปราสาทหินพันยอด เกาะหินงาม คฤหาสน์กูเด็น) ใช้ block day'],
  ['satun-trang-plan','itinerary','แผนข้ามจังหวัด สตูล–ตรัง เลาะอันดามันเที่ยวเกาะและถ้ำ ใช้ block day'],
  ['satun-songkhla-plan','itinerary','แผนข้ามจังหวัด สตูล–สงขลา/หาดใหญ่ ข้ามเมืองชายแดนใต้ ใช้ block day'],
  ['satun-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หลีเป๊ะน้ำตื้น น้ำตกวังสายทอง ตะรุเตา) ใช้ block day'],
  ['satun-first-timer-guide','itinerary','มาสตูลครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['satun-travel-tips','prep','เตรียมตัวเที่ยวสตูล (ช่วงเวลาดีสุด หน้ามรสุมเกาะปิด งบ จองเรือ-ที่พักหลีเป๊ะ ข้อควรรู้เมืองมุสลิม)'],
  ['satun-getting-around','prep','การเดินทางในสตูล (สนามบินหาดใหญ่ รถตู้ ท่าเรือปากบารา ไปหลีเป๊ะ/ตะรุเตายังไง ระยะทางจากหาดใหญ่-ตรัง)'],
]

const siblingList = 'satun-seafood, satun-southern-food, satun-roti-cha-chak, satun-muslim-malay-food, satun-khao-yam, satun-khanom-jeen, satun-cafe-guide, lipe-food-walking-street, satun-local-breakfast, satun-street-food, satun-dessert-cafe, satun-attractions, koh-lipe, tarutao-national-park, satun-unesco-geopark, la-stegodon-cave, prasat-hin-phan-yot, wang-sai-thong-waterfall, kuden-mansion, mambang-mosque, koh-hin-ngam-koh-adang, pak-bara-pier, koh-khai-stone-arch, satun-1-day-itinerary, satun-2d1n-itinerary, satun-3d2n-itinerary, lipe-island-plan, tarutao-pakbara-plan, satun-geopark-nature-plan, satun-city-culture-plan, satun-photo-spots-plan, satun-trang-plan, satun-songkhla-plan, satun-family-plan, satun-first-timer-guide, satun-travel-tips, satun-getting-around'

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสตูล ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): ต้องเขียนไฟล์ JSON จริงด้วย Write ที่ astro/src/content/articles/${slug}.json — ห้ามรายงานว่าเสร็จโดยไม่ได้เขียนไฟล์
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="satun", crumbCity="สตูล", crumbCityHref="city-satun.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-satun.html และ top10-hotels-satun.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block`
}

let done = []
for (const group of [['Food',FOOD],['See',SEE],['Plan',PLAN],['Prep',PREP]]) {
  const [ph, list] = group
  const ref = ph==='Food' ? 'tourlogy-food-writer' : 'tourlogy-attraction-writer'
  log(`Phase ${ph}: ${list.length} articles`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,ref), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Articles written: ${ok}/${done.length}`)
return { total: done.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

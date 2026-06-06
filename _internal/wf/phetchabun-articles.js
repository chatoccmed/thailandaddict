export const meta = {
  name: 'phetchabun-articles',
  description: 'Phetchabun gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + culture + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phetchabun-food-guide','food','รวมของกินเพชรบูรณ์ที่ต้องลอง คละมะขามหวาน/ข้าวโพดหวาน/หมูย่างเขาค้อ/คาเฟ่ภูเขา (ภาพรวม + cards)'],
  ['khao-kho-cafe-guide','eat-ranking','จัดอันดับคาเฟ่วิวภูเขาเขาค้อ นั่งจิบกาแฟมองทะเลหมอก/ไร่ จุดแวะพักยอดฮิต'],
  ['phetchabun-tamarind-souvenir','eat-ranking','มะขามหวานเพชรบูรณ์และของแปรรูป (ฝักสด มะขามคลุก มะขามแก้ว) ของฝากซื้อที่ไหน'],
  ['khao-kho-grilled-pork','food','หมูย่างเขาค้อและข้าวโพดหวานริมทางขึ้นเขา ของกินคู่ทริปขึ้นเขาค้อ'],
  ['phu-thap-boek-hmong-food','food','อาหารม้งบนภูทับเบิก (ไก่ดำต้มยาจีน ผักสดจากไร่ ข้าวต้มร้อน) กินสู้อากาศหนาว'],
  ['phetchabun-isan-food','eat-ranking','ร้านอาหารอีสานเพชรบูรณ์ (ส้มตำ ไก่ย่าง ลาบ) รสจัดร้านที่คนพื้นที่ไป'],
  ['phetchabun-city-noodles','eat-ranking','ก๋วยเตี๋ยวและข้าวแกงในตัวเมืองเพชรบูรณ์ มื้อง่าย ๆ ราคาท้องถิ่น'],
  ['phetchabun-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างเพชรบูรณ์ มื้อเย็นอุ่น ๆ รับอากาศหนาว'],
  ['phetchabun-local-breakfast','food','อาหารเช้าแบบคนเพชรบูรณ์ (ตลาดเช้า ข้าวต้ม กาแฟ) ก่อนขึ้นเขาค้อ'],
]
const SEE = [
  ['phetchabun-attractions','attraction','รวมที่เที่ยวเพชรบูรณ์ที่ต้องไป คละธรรมชาติ/วัฒนธรรม/เมือง (ภาพรวม + cards)'],
  ['khao-kho-guide','attraction','เที่ยวเขาค้อครบ (จุดชมวิว ทะเลหมอก ไร่ คาเฟ่ ที่พัก การเดินทาง เส้นทางขับรถ)'],
  ['phu-thap-boek-guide','attraction','ภูทับเบิก จุดสูงสุดของจังหวัด ไร่กะหล่ำปลี ทะเลหมอก กางเต็นท์ การเดินทาง/ถนนชัน'],
  ['wat-pha-sorn-kaew','attraction','วัดพระธาตุผาซ่อนแก้ว บนเขาค้อ เจดีย์กระเบื้องถ้วยชามสีสด วิวภูเขา การเดินทาง'],
  ['si-thep-ancient-city','attraction','เมืองโบราณศรีเทพ มรดกโลก เขาคลังนอก ปรางค์ศรีเทพ คูเมือง ค่าเข้า การเที่ยว'],
  ['phu-hin-rong-kla','attraction','อุทยานแห่งชาติภูหินร่องกล้า ลานหินแตก ผาชูธง ประวัติศาสตร์ การเดินทาง'],
  ['khao-kho-viewpoints','attraction','จุดชมวิวและจุดชมทะเลหมอกบนเขาค้อ (จุดไหนเช้า/เย็นสวย) แวะถ่ายรูป'],
  ['khao-kho-flower-fields','attraction','ไร่ดอกไม้และทุ่งดอกไม้เขาค้อ (ไร่ B.N. สวนดอกไม้หน้าหนาว) จุดถ่ายรูป'],
  ['khao-kho-memorial','attraction','พระตำหนักเขาค้อและอนุสรณ์สถานผู้เสียสละ จุดชมวิว ประวัติศาสตร์สมัยสู้รบ'],
  ['phetchabun-waterfalls','attraction','น้ำตกรอบเพชรบูรณ์ (น้ำตกศรีดิษฐ์ น้ำตกธารทิพย์) ธรรมชาติแวะเล่นน้ำ'],
  ['mueang-rat-pho-khun-pha-mueang','attraction','อนุสรณ์สถานเมืองราด–พ่อขุนผาเมือง จุดรำลึกประวัติศาสตร์ระหว่างทางขึ้นเขา'],
  ['phetchabun-city-guide','attraction','ตัวเมืองเพชรบูรณ์ (หอนาฬิกา วัดในเมือง ตลาด) เดินเล่นก่อน/หลังขึ้นเขา'],
]
const PLAN = [
  ['phetchabun-1-day-itinerary','itinerary','แผนเที่ยวเพชรบูรณ์ 1 วัน เก็บไฮไลต์เขาค้อ–วัดผาซ่อนแก้ว ใช้ block day'],
  ['phetchabun-2d1n-itinerary','itinerary','แผนเพชรบูรณ์ 2 วัน 1 คืน เขาค้อ–วัดผาซ่อนแก้ว–คาเฟ่ ใช้ block day'],
  ['phetchabun-3d2n-itinerary','itinerary','แผนเพชรบูรณ์ 3 วัน 2 คืน เขาค้อ–ภูทับเบิก–ศรีเทพ ใช้ block day'],
  ['khao-kho-cafe-hopping-plan','itinerary','แผนสายคาเฟ่และจุดชมวิวบนเขาค้อ 1-2 วัน ใช้ block day'],
  ['phetchabun-sea-of-mist-plan','itinerary','แผนสายทะเลหมอก ภูทับเบิก–เขาค้อ ตื่นเช้าดูหมอก ใช้ block day'],
  ['phetchabun-history-si-thep-plan','itinerary','แผนสายประวัติศาสตร์ เมืองโบราณศรีเทพ มรดกโลก ใช้ block day'],
  ['phetchabun-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ทะเลหมอก ไร่ดอกไม้ วัดผาซ่อนแก้ว) ใช้ block day'],
  ['khao-kho-weekend-plan','itinerary','แผนเที่ยวเขาค้อสุดสัปดาห์จากกรุงเทพ ขับรถเสาร์-อาทิตย์ ใช้ block day'],
  ['phetchabun-phitsanulok-plan','itinerary','แผนข้ามจังหวัด เพชรบูรณ์–พิษณุโลก ภูหินร่องกล้า ใช้ block day'],
  ['phetchabun-loei-plan','itinerary','แผนข้ามจังหวัด เพชรบูรณ์–เลย เส้นทางภูเขาหน้าหนาว ใช้ block day'],
  ['phetchabun-lopburi-plan','itinerary','แผนข้ามจังหวัด เพชรบูรณ์–ลพบุรี ทางผ่านจากภาคกลาง ใช้ block day'],
  ['phetchabun-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก เขาค้อ ไร่ดอกไม้ คาเฟ่ ไม่ลุยมาก ใช้ block day'],
  ['phetchabun-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวเพชรบูรณ์–เขาค้อคุ้ม ใช้ block day'],
  ['phetchabun-first-timer-guide','itinerary','มาเพชรบูรณ์–เขาค้อครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phetchabun-travel-tips','prep','เตรียมตัวเที่ยวเพชรบูรณ์ (หน้าหนาวทะเลหมอก จองที่พักล่วงหน้า อากาศหนาวจัดบนภูทับเบิก เสื้อกันหนาว งบ)'],
  ['phetchabun-getting-around','prep','การเดินทางไป/ในเพชรบูรณ์ (รถทัวร์ ขับรถเอง ถนนขึ้นเขาค้อ–ภูทับเบิกชัน รถเก๋งขึ้นได้ไหม เช่ารถ)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเพชรบูรณ์ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phetchabun", crumbCity="เพชรบูรณ์", crumbCityHref="city-phetchabun.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phetchabun.html และ top10-hotels-phetchabun.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean (เช่น ตอบโจทย์→ตรงใจ/เหมาะ, โดดเด่น→เด่น, ระดับโลก→ที่คนทั่วโลกรู้จัก/ดังไปไกล, สุดยอด→เด็ด, อันซีน→มุมลับ/คนยังไปไม่ทั่ว) แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
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
log(`Articles written: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

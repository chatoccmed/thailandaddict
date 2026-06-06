export const meta = {
  name: 'nan-articles',
  description: 'Nan gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nan-food-guide','food','รวมของกินน่านต้องลอง ภาพรวมอาหารเหนือ/ข้าวซอย/คาเฟ่กาแฟดอย/มะไฟจีน (overview + cards)'],
  ['nan-northern-cuisine','eat-ranking','ร้านอาหารเหนือน่าน (ข้าวซอย น้ำเงี้ยว แกงฮังเล ลาบเหนือ ไส้อั่ว) ร้านที่คนเหนือไป'],
  ['nan-khao-soi','eat-ranking','จัดอันดับร้านข้าวซอยน่าน ร้านเก่าแก่ เส้นนุ่ม น้ำแกงเข้ม'],
  ['nan-cafe-guide','eat-ranking','จัดอันดับคาเฟ่น่านในเมืองเก่า กาแฟอราบิก้าดอย บรรยากาศถ่ายรูป'],
  ['pua-cafe-rice-fields','eat-ranking','คาเฟ่วิวนาขั้นบันไดอำเภอปัว นั่งจิบกาแฟชมทุ่งนา-ดอยภูคา'],
  ['nan-tai-lue-food','food','อาหารไทลื้อน่าน (แถบปัว ทุ่งช้าง) น้ำพริก เมนูผักพื้นถิ่นเฉพาะ'],
  ['nan-local-breakfast','food','อาหารเช้าแบบคนน่าน (กาดเช้า ข้าวแคบ ขนมเส้นน้ำเงี้ยว ข้าวเหนียวน้ำพริก กาแฟ)'],
  ['nan-souvenir-makfaichin','food','มะไฟจีน + ไส้อั่ว แคบหมู ของฝากน่าน (ผลสด/น้ำ/แปรรูป) ซื้อที่ไหน'],
  ['nan-street-night-market','food','ถนนคนเดินกาดข่วงเมืองน่าน ของกินพื้นเมือง ขันโต๊ก เดินกินยามเย็น'],
  ['nan-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างน่าน ร้านมื้อเย็น คุ้มราคา'],
  ['nan-dessert-cafe','eat-ranking','ของหวาน/ขนมพื้นเมือง/คาเฟ่ขนมน่าน (ข้าวควบ ข้าวแคบ มัทฉะ)'],
  ['nan-local-restaurants','eat-ranking','ร้านอาหารน่านร้านดัง บรรยากาศดี เหมาะมื้อพิเศษ'],
]
const SEE = [
  ['nan-attractions','attraction','รวมที่เที่ยวน่านที่ต้องไป คละวัด/ดอย/เมืองเก่า/ธรรมชาติ (ภาพรวม + cards)'],
  ['wat-phumin-guide','attraction','วัดภูมินทร์ (จิตรกรรมปู่ม่านย่าม่าน กระซิบรัก ทรงจตุรมุข เวลา การแต่งกาย)'],
  ['wat-phrathat-chae-haeng','attraction','วัดพระธาตุแช่แห้ง น่าน (พระธาตุประจำปีเถาะ เจดีย์ทอง การเดินทาง)'],
  ['nan-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติน่าน (งาช้างดำ คุ้มเก่า ซุ้มลีลาวดี จุดถ่ายรูป)'],
  ['doi-phu-kha-national-park','attraction','อุทยานดอยภูคา (ต้นชมพูภูคา ป่าดิบเขา จุดชมวิวทะเลหมอก เส้นทางปัว)'],
  ['doi-samer-dao-guide','attraction','ดอยเสมอดาว-ผาชู้ ศรีน่าน (กางเต็นท์ ทะเลหมอก พระอาทิตย์ขึ้นเหนือแม่น้ำน่าน)'],
  ['bo-kluea-guide','attraction','บ่อเกลือสินเธาว์ (หมู่บ้านต้มเกลือบนภูเขา วิถีโบราณ การเดินทาง)'],
  ['pua-tai-lue-guide','attraction','อำเภอปัว/วิถีไทลื้อ (วัดศรีมงคล ทุ่งนาขั้นบันได วัดไทลื้อ คาเฟ่วิวนา)'],
  ['road-1256-skyroad','attraction','ถนนลอยฟ้า 1256 ปัว-บ่อเกลือ (เส้นทางสันเขา จุดจอดถ่ายรูป ขับรถปลอดภัย)'],
  ['sao-din-na-noi','attraction','เสาดินนาน้อย-คอกเสือ (ภูมิประเทศดินกัดเซาะ เดินชม ถ่ายรูป การเดินทาง)'],
  ['nan-old-town-walk','attraction','เดินเที่ยวเมืองเก่าน่าน (วัดในเมือง กาดข่วง ถนนคาเฟ่ ปั่นจักรยาน)'],
  ['nan-viewpoints-mist','attraction','จุดชมวิวและทะเลหมอกน่าน (ดอยเสมอดาว ดอยภูคา จุดชมวิวรอบเมือง)'],
]
const PLAN = [
  ['nan-1-day-itinerary','itinerary','แผนเที่ยวน่าน 1 วัน วัดภูมินทร์–เมืองเก่า–กาดข่วง ใช้ block day'],
  ['nan-2d1n-itinerary','itinerary','แผนน่าน 2 วัน 1 คืน วัดและเมืองเก่า+คาเฟ่ ใช้ block day'],
  ['nan-3d2n-itinerary','itinerary','แผนน่าน 3 วัน 2 คืน เมือง+ปัว+ดอยภูคา/บ่อเกลือ ใช้ block day'],
  ['nan-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าน่าน ใช้ block day'],
  ['nan-nature-plan','itinerary','แผนสายธรรมชาติ ปัว–ดอยภูคา–บ่อเกลือ ใช้ block day'],
  ['nan-skyroad-1256-plan','itinerary','แผนขับรถถนนลอยฟ้า 1256 ปัว–บ่อเกลือ 3 วัน ใช้ block day'],
  ['nan-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (วัดภูมินทร์ ทุ่งนาปัว ทะเลหมอก ถนนลอยฟ้า) ใช้ block day'],
  ['nan-temples-culture-plan','itinerary','แผนสายวัด/วัฒนธรรมน่าน (ภูมินทร์ แช่แห้ง พิพิธภัณฑ์ ไทลื้อ) ใช้ block day'],
  ['nan-phayao-plan','itinerary','แผนข้ามจังหวัด น่าน–พะเยา เมืองเหนือเงียบ ๆ ใช้ block day'],
  ['nan-phrae-plan','itinerary','แผนข้ามจังหวัด น่าน–แพร่ ทริปเมืองเก่าเหนือตอนบน ใช้ block day'],
  ['nan-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (วัด คาเฟ่วิวนา บ่อเกลือ) ใช้ block day'],
  ['nan-first-timer-guide','itinerary','มาน่านครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nan-travel-tips','prep','เตรียมตัวเที่ยวน่าน (ช่วงเวลาดีสุด หนาว พ.ย.-ก.พ. เลี่ยงฝุ่นมี.ค.-เม.ย. งบ การแต่งตัว ซิม ขับรถบนดอย)'],
  ['nan-getting-around','prep','การเดินทางน่าน (สนามบินน่าน NNT รถจากกรุงเทพ/เชียงใหม่ เช่ารถ ปั่นจักรยานในเมือง ขึ้นดอย/ปัว/บ่อเกลือ)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวน่านลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nan", crumbCity="น่าน", crumbCityHref="city-nan.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-nan.html และ top10-hotels-nan.html + พี่น้อง 1 จาก: ${siblingList})
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้ให้หมดก่อนบันทึก
- heroEmoji ใส่ให้เหมาะ

เขียน JSON ให้ valid แล้ว return สรุปสั้น ๆ`
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

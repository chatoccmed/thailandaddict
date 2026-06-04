export const meta = {
  name: 'chiang-rai-articles',
  description: 'Chiang Rai gold template — 38 articles (food / attractions / itineraries / prep), fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['chiang-rai-food-guide','food','รวมของกินเชียงรายต้องลอง ภาพรวมอาหารเหนือ/กาแฟดอย/ชาติพันธุ์ (overview + cards)'],
  ['chiang-rai-northern-cuisine','eat-ranking','ร้านอาหารเหนือเชียงราย (ข้าวซอย น้ำเงี้ยว แกงฮังเล ไส้อั่ว) ร้านที่คนเหนือไป'],
  ['chiang-rai-khao-soi','eat-ranking','จัดอันดับร้านข้าวซอยเชียงราย ร้านเด็ดคนพื้นที่ไปจริง พร้อมย่าน/ราคา'],
  ['chiang-rai-cafe-guide','eat-ranking','จัดอันดับคาเฟ่เชียงราย ในเมือง + กาแฟดอย (ดอยช้าง ดอยตุง) บรรยากาศถ่ายรูป'],
  ['chiang-rai-tea-farm-cafe','eat-ranking','คาเฟ่/ร้านชาวิวไร่ชาเชียงราย (ฉุยฟง ดอยช้าง) จิบชาชมวิวเนินเขา'],
  ['chiang-rai-beef-noodles','eat-ranking','จัดอันดับก๋วยเตี๋ยวเนื้อเชียงราย ร้านเก่าแก่ น้ำซุปเข้ม'],
  ['chiang-rai-ethnic-food','food','อาหารชาติพันธุ์/อาข่าบนดอยเชียงราย เมนูพื้นถิ่นแปลกลิ้น หากินที่ไหน'],
  ['chiang-rai-local-breakfast','food','อาหารเช้าแบบคนเชียงราย (ข้าวซอย น้ำเงี้ยว กาแฟดอย กาดหลวงตลาดเช้า)'],
  ['chiang-rai-night-market-food','food','ถนนคนเดิน/กาดหลวงเชียงราย ของกินเดินชิม สตรีทฟู้ดเหนือ'],
  ['chiang-rai-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างเชียงราย คุ้มราคา'],
  ['chiang-rai-dessert-souvenir','food','ของหวาน/ขนมพื้นเมือง + ไส้อั่ว แคบหมู ของฝากเชียงราย ซื้อที่ไหน'],
  ['chiang-rai-local-restaurants','eat-ranking','ร้านอาหารเชียงรายร้านดัง บรรยากาศดี เหมาะมื้อพิเศษ'],
]
const SEE = [
  ['chiang-rai-attractions','attraction','รวมที่เที่ยวเชียงรายที่ต้องไป คละวัด/ดอย/ไร่ชา/ธรรมชาติ (ภาพรวม + cards)'],
  ['wat-rong-khun-guide','attraction','วัดร่องขุ่น (วัดขาว อ.เฉลิมชัย) ครบ (เวลา ค่าเข้า การแต่งกาย จุดถ่ายรูป การเดินทาง)'],
  ['wat-rong-suea-ten-guide','attraction','วัดร่องเสือเต้น (วิหารสีน้ำเงิน) เวลา ค่าเข้า จุดถ่ายรูป'],
  ['doi-tung-guide','attraction','ดอยตุง พระตำหนัก + สวนแม่ฟ้าหลวง (ดอกไม้ อากาศเย็น การเดินทาง ค่าเข้า)'],
  ['golden-triangle-guide','attraction','สามเหลี่ยมทองคำ (จุดชม 3 แผ่นดิน ล่องเรือโขง พิพิธภัณฑ์ฝิ่น เชียงแสน)'],
  ['phu-chi-fa-guide','attraction','ภูชี้ฟ้า จุดชมทะเลหมอก/พระอาทิตย์ขึ้น (ที่พัก ฤดู เดินขึ้นยอด การเดินทาง)'],
  ['choui-fong-tea-guide','attraction','ไร่ชาฉุยฟง (ไร่ชาขั้นบันได คาเฟ่ จุดถ่ายรูป เวลา การเดินทาง)'],
  ['wat-huay-pla-kang-guide','attraction','วัดห้วยปลากั้ง (เจดีย์ 9 ชั้นทรงจีน เจ้าแม่กวนอิม ขึ้นชมวิวเมือง)'],
  ['baan-dam-museum-guide','attraction','พิพิธภัณฑ์บ้านดำ (อ.ถวัลย์ ดัชนี) งานศิลป์ บ้านไม้สีดำ เวลา ค่าเข้า'],
  ['chiang-rai-clock-tower-city','attraction','หอนาฬิกาเฉลิมพระเกียรติ + เที่ยวในเมืองเชียงราย (โชว์ไฟ จุดเดินเล่น)'],
  ['doi-chang-coffee-hills','attraction','ดอยช้าง ไร่กาแฟ/ไร่ชาบนดอย (คาเฟ่วิว วิถีชุมชน การเดินทาง)'],
  ['mae-sai-border-guide','attraction','แม่สาย ชายแดนเหนือสุดของไทย (ด่าน ตลาดชายแดน ของฝาก)'],
]
const PLAN = [
  ['chiang-rai-1-day-itinerary','itinerary','แผนเที่ยวเชียงราย 1 วัน วัดร่องขุ่น–ร่องเสือเต้น–คาเฟ่ ใช้ block day'],
  ['chiang-rai-2d1n-itinerary','itinerary','แผนเชียงราย 2 วัน 1 คืน เที่ยววัดในเมือง+ไร่ชา ใช้ block day'],
  ['chiang-rai-3d2n-itinerary','itinerary','แผนเชียงราย 3 วัน 2 คืน วัด+ดอย+สามเหลี่ยมทองคำ ใช้ block day'],
  ['chiang-rai-cafe-tea-plan','itinerary','แผนสายคาเฟ่และไร่ชา ฉุยฟง–ดอยช้าง–คาเฟ่ในเมือง ใช้ block day'],
  ['chiang-rai-nature-plan','itinerary','แผนสายธรรมชาติ ภูชี้ฟ้า–ดอยตุง–สวนแม่ฟ้าหลวง ใช้ block day'],
  ['chiang-rai-temples-art-plan','itinerary','แผนสายวัด/ศิลปะ ร่องขุ่น–ร่องเสือเต้น–บ้านดำ–ห้วยปลากั้ง ใช้ block day'],
  ['chiang-rai-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (วัดสี ไร่ชา ทะเลหมอก) ใช้ block day'],
  ['chiang-rai-golden-triangle-plan','itinerary','แผนสามเหลี่ยมทองคำ–เชียงแสน–แม่สาย ชายแดนเหนือสุด ใช้ block day'],
  ['chiang-rai-chiang-mai-plan','itinerary','แผนข้ามจังหวัด เชียงราย–เชียงใหม่ ทริปเหนือ ใช้ block day'],
  ['chiang-rai-phayao-plan','itinerary','แผนข้ามจังหวัด เชียงราย–พะเยา กว๊านพะเยา ใช้ block day'],
  ['chiang-rai-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (วัดสวย ไร่ชา สวนดอกไม้) ใช้ block day'],
  ['chiang-rai-first-timer-guide','itinerary','มาเชียงรายครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chiang-rai-travel-tips','prep','เตรียมตัวเที่ยวเชียงราย (ช่วงเวลาดีสุด หนาว พ.ย.-ก.พ. เลี่ยงฝุ่นมี.ค.-เม.ย. งบ การแต่งตัว ซิม)'],
  ['chiang-rai-getting-around','prep','การเดินทางเชียงราย (สนามบิน CEI รถเช่า รถสองแถว/บัส ขึ้นภูชี้ฟ้า/ดอยตุงยังไง จากเชียงใหม่)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเชียงรายลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chiang-rai", crumbCity="เชียงราย", crumbCityHref="city-chiang-rai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-chiang-rai.html และ top10-hotels-chiang-rai.html + พี่น้อง 1 จาก: ${siblingList})
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

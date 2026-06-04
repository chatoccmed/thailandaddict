export const meta = {
  name: 'phang-nga-articles',
  description: 'Phang Nga gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phang-nga-food-guide','food','รวมของกินพังงาต้องลอง ภาพรวมซีฟู้ด/หมี่ฮกเกี้ยน/อาหารใต้ (overview + cards)'],
  ['phang-nga-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลอันดามันพังงา (ในเมือง/เขาหลัก) ซีฟู้ดสด'],
  ['phang-nga-hokkien-mee','eat-ranking','หมี่ฮกเกี้ยนและติ่มซำพังงา/ตะกั่วป่า รากชุมชนจีนยุคเหมืองแร่'],
  ['phang-nga-southern-food','eat-ranking','ร้านอาหารใต้รสจัดพังงา (แกงไตปลา คั่วกลิ้ง ผัดสะตอ แกงเหลือง)'],
  ['phang-nga-khanom-jeen','eat-ranking','ขนมจีนปักษ์ใต้พังงา มื้อเช้าผักเหนาะครบ ร้านเด็ด'],
  ['khao-lak-restaurants','eat-ranking','ร้านอาหาร/ซีฟู้ดเขาหลัก บรรยากาศริมทะเล มื้อเย็น'],
  ['takua-pa-old-town-food','food','ตลาดเช้าวันอาทิตย์ตะกั่วป่า + ของกินเมืองเก่า (เมี่ยง ขนมพื้นบ้าน จีน-ใต้)'],
  ['phang-nga-cafe-guide','eat-ranking','คาเฟ่พังงา เมืองเก่าตะกั่วป่า/ริมทะเลเขาหลัก กาแฟนั่งชิล'],
  ['koh-yao-food','food','อาหารทะเลเกาะยาวน้อย/ใหญ่ ร้านริมหาดทำแบบบ้าน ๆ วิวอ่าวพังงา'],
  ['phang-nga-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างพังงา-เขาหลัก คุ้มราคา'],
  ['phang-nga-local-breakfast','food','อาหารเช้าแบบคนพังงา (ติ่มซำ โกปี๊ ขนมจีน ตลาดเช้า)'],
  ['phang-nga-dessert-souvenir','food','ขนมพื้นบ้าน/ของหวาน/ของฝากพังงา ซื้อที่ไหน'],
]
const SEE = [
  ['phang-nga-attractions','attraction','รวมที่เที่ยวพังงาที่ต้องไป คละอ่าว/เกาะ/ดำน้ำ/เมืองเก่า (ภาพรวม + cards)'],
  ['phang-nga-bay-james-bond','attraction','อ่าวพังงา/เขาตะปู (เกาะเจมส์บอนด์) เขาพิงกัน ถ้ำลอด ล่องเรือ/คายัค ท่าเรือ'],
  ['similan-islands-guide','attraction','หมู่เกาะสิมิลัน (น้ำใส ปะการัง หินเรือใบเกาะ 8 เรือเร็วทับละมุ ฤดูเปิด-ปิด ค่าเข้า)'],
  ['surin-islands-guide','attraction','หมู่เกาะสุรินทร์ (ดำน้ำตื้น หมู่บ้านมอแกน นอนเต็นท์ การเดินทาง ฤดู)'],
  ['khao-lak-guide','attraction','เขาหลัก (หาดยาว รีสอร์ตริมทะเล อนุสรณ์สึนามิเรือ ต.๘๑๓ ฐานออกเรือสิมิลัน)'],
  ['koh-yao-noi-guide','attraction','เกาะยาวน้อย (หาดเงียบ นาข้าวริมเขา ปั่นจักรยาน ที่พัก การเดินทาง)'],
  ['koh-yao-yai-guide','attraction','เกาะยาวใหญ่ (เกาะวิถีชาวบ้าน หาดเงียบ รีสอร์ต การเดินทางจากภูเก็ต/กระบี่)'],
  ['takua-pa-old-town-guide','attraction','เมืองเก่าตะกั่วป่า (ตึกชิโน-โปรตุกีส ถนนสายเก่า ตลาดเช้าวันอาทิตย์)'],
  ['wat-tham-suwan-kuha','attraction','วัดถ้ำสุวรรณคูหา (วัดถ้ำ พระนอนในถ้ำ หินงอกหินย้อย ลิง การเดินทาง)'],
  ['phang-nga-waterfalls','attraction','น้ำตกและสระน้ำใสพังงา (น้ำตกสายรุ้ง สระมรกต ธารน้ำจืดร่มรื่น)'],
  ['samet-nangshe-viewpoint','attraction','จุดชมวิวเสม็ดนางชี (วิวอ่าวพังงาเขาหินปูน ทะเลหมอกเช้า แคมป์ การเดินทาง)'],
  ['phang-nga-sea-canoe','attraction','ทัวร์พายคายัค/ลอดถ้ำอ่าวพังงา (ถ้ำลอด เขาหมาจู ป่าโกงกาง จองทัวร์)'],
]
const PLAN = [
  ['phang-nga-1-day-itinerary','itinerary','แผนเที่ยวพังงา 1 วัน ล่องอ่าวพังงา–เขาตะปู ใช้ block day'],
  ['phang-nga-2d1n-itinerary','itinerary','แผนพังงา 2 วัน 1 คืน ล่องอ่าว–เขาตะปู–เมืองเก่า ใช้ block day'],
  ['phang-nga-3d2n-itinerary','itinerary','แผนพังงา 3 วัน 2 คืน อ่าว+เกาะนอก+เขาหลัก ใช้ block day'],
  ['phang-nga-diving-plan','itinerary','แผนสายดำน้ำ เขาหลัก–สิมิลัน–สุรินทร์ ใช้ block day'],
  ['koh-yao-island-plan','itinerary','แผนสายเกาะเงียบ เกาะยาวน้อย–เกาะยาวใหญ่ นอนยาว ๆ ใช้ block day'],
  ['takua-pa-khao-lak-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ตะกั่วป่า–เขาหลัก ใช้ block day'],
  ['phang-nga-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เสม็ดนางชี อ่าวพังงา เขาตะปู) ใช้ block day'],
  ['phang-nga-bay-canoe-plan','itinerary','แผนสายล่องอ่าวและพายคายัค ลอดถ้ำ ดูป่าโกงกาง ใช้ block day'],
  ['phang-nga-phuket-plan','itinerary','แผนข้ามจังหวัด พังงา–ภูเก็ต ล่องอ่าวและออกเกาะอันดามัน ใช้ block day'],
  ['phang-nga-krabi-plan','itinerary','แผนข้ามจังหวัด พังงา–กระบี่ เลาะหินปูนอันดามัน ใช้ block day'],
  ['phang-nga-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ล่องอ่าว เล่นน้ำหาด วัดถ้ำ) ใช้ block day'],
  ['phang-nga-first-timer-guide','itinerary','มาพังงาครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phang-nga-travel-tips','prep','เตรียมตัวเที่ยวพังงา (ช่วงเวลาดีสุด สิมิลัน/สุรินทร์เปิด พ.ย.-เม.ย. การจองเรือ งบ ซิม)'],
  ['phang-nga-getting-around','prep','การเดินทางพังงา (สนามบินภูเก็ต/กระบี่ ท่าเรือทับละมุ เรือไปเกาะยาว รถเช่า ระยะทาง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพังงาลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phang-nga", crumbCity="พังงา", crumbCityHref="city-phang-nga.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-phang-nga.html และ top10-hotels-phang-nga.html + พี่น้อง 1 จาก: ${siblingList})
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

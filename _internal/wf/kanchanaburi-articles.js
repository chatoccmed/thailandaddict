export const meta = {
  name: 'kanchanaburi-articles',
  description: 'Kanchanaburi gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['kanchanaburi-food-guide','food','รวมของกินกาญจนบุรีต้องลอง ภาพรวมปลาแม่น้ำ/ร้านริมน้ำ/อาหารมอญ (overview + cards)'],
  ['kanchanaburi-river-fish','eat-ranking','จัดอันดับร้านปลาแม่น้ำแคว (ปลาคัง ปลายี่สก ต้มยำ เผา ฉู่ฉี่) ร้านเด็ด'],
  ['kanchanaburi-riverside-restaurants','eat-ranking','ร้านอาหารริมแม่น้ำแคว/บนแพ บรรยากาศติดน้ำ มื้อพิเศษ'],
  ['kanchanaburi-isan-somtam','eat-ranking','ส้มตำ ไก่ย่าง ลาบ อีสานกาญจนบุรี ร้านริมทางไปน้ำตก'],
  ['kanchanaburi-cafe-guide','eat-ranking','จัดอันดับคาเฟ่กาญจนบุรี ริมแม่น้ำแคว/ริมเขา/ในเมือง กาแฟชมวิว'],
  ['kanchanaburi-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างกาญจนบุรี ร้านมื้อเย็น คุ้มราคา'],
  ['sangkhlaburi-mon-food','food','อาหารมอญสังขละบุรี (แกง ขนมจีนน้ำยา ของหวานมอญ) หากินที่ไหน'],
  ['kanchanaburi-street-food','food','ก๋วยเตี๋ยว/ของกินตลาดเมือง/ถนนคนเดินกาญจนบุรี เดินชิมริมแม่น้ำ'],
  ['kanchanaburi-dessert-souvenir','food','ทองม้วน ขนมโบราณ และของฝากกาญจนบุรี (ฟักทอง ข้าวโพด) ซื้อที่ไหน'],
  ['kanchanaburi-local-restaurants','eat-ranking','ร้านอาหารกาญจนบุรีร้านดังในเมือง บรรยากาศดี'],
  ['kanchanaburi-local-breakfast','food','อาหารเช้าแบบคนกาญจน์ (ตลาดเช้า ก๋วยเตี๋ยว กาแฟโบราณ)'],
  ['erawan-route-eats','food','ของกินระหว่างทางไปน้ำตกเอราวัณ/ไทรโยค ร้านแวะพักทางผ่าน'],
]
const SEE = [
  ['kanchanaburi-attractions','attraction','รวมที่เที่ยวกาญจนบุรีที่ต้องไป คละน้ำตก/ประวัติศาสตร์/แม่น้ำ (ภาพรวม + cards)'],
  ['bridge-river-kwai-guide','attraction','สะพานข้ามแม่น้ำแคว (ประวัติ เดินบนสะพาน ดูรถไฟ จุดถ่ายรูป งานสัปดาห์สะพาน)'],
  ['death-railway-tham-krasae','attraction','ทางรถไฟสายมรณะและถ้ำกระแซ (นั่งรถไฟ จุดชมวิวเลียบผา ตารางเดินรถ ประวัติ)'],
  ['erawan-waterfall-guide','attraction','น้ำตกเอราวัณ 7 ชั้น (เดินขึ้นเล่นน้ำ ค่าเข้า เวลา เตรียมตัว การเดินทาง)'],
  ['sai-yok-national-park','attraction','อุทยานไทรโยค (น้ำตกไทรโยคน้อย/ใหญ่ ถ้ำ ล่องแพ ที่พักริมน้ำ)'],
  ['srinakarin-dam-guide','attraction','เขื่อนศรีนครินทร์ (ทะเลสาบ จุดชมวิว ล่องเรือ น้ำตกห้วยแม่ขมิ้น ที่พักริมน้ำ)'],
  ['sangkhlaburi-mon-bridge','attraction','สังขละบุรี/สะพานมอญ (สะพานไม้อุตตมานุสรณ์ วัดวังก์วิเวการาม วิถีมอญ การเดินทาง)'],
  ['allied-war-cemetery-museum','attraction','สุสานทหารสัมพันธมิตรดอนรัก + พิพิธภัณฑ์สงคราม (เรื่องเล่าสายมรณะ เวลา)'],
  ['prasat-muang-sing','attraction','อุทยานประวัติศาสตร์ปราสาทเมืองสิงห์ (ปราสาทขอมริมแม่น้ำแควน้อย เวลา ค่าเข้า)'],
  ['kanchanaburi-raft-houses','attraction','แพริมแม่น้ำแคว นอนแพ/ล่องแก่ง (ประสบการณ์นอนแพ ช่วงเวลา ที่แนะนำ)'],
  ['hellfire-pass-guide','attraction','ช่องเขาขาด Hellfire Pass (พิพิธภัณฑ์ เส้นทางเดินรำลึก ประวัติ การเดินทาง)'],
  ['kanchanaburi-caves-hotsprings','attraction','ถ้ำและน้ำพุร้อนกาญจนบุรี (น้ำพุร้อนหินดาด ถ้ำละว้า/กระแซ) ธรรมชาติในป่า'],
]
const PLAN = [
  ['kanchanaburi-1-day-itinerary','itinerary','แผนเที่ยวกาญจนบุรี 1 วัน สะพาน–สายมรณะ–น้ำตก ใช้ block day'],
  ['kanchanaburi-2d1n-itinerary','itinerary','แผนกาญจน์ 2 วัน 1 คืน สะพาน–เอราวัณ–นอนแพ ใช้ block day'],
  ['kanchanaburi-3d2n-itinerary','itinerary','แผนกาญจน์ 3 วัน 2 คืน น้ำตก+ประวัติศาสตร์+แพ ใช้ block day'],
  ['kanchanaburi-nature-plan','itinerary','แผนสายธรรมชาติ เอราวัณ–ไทรโยค–เขื่อนศรีนครินทร์ ใช้ block day'],
  ['kanchanaburi-history-plan','itinerary','แผนสายประวัติศาสตร์ สะพาน–สุสาน–สายมรณะ–Hellfire Pass ใช้ block day'],
  ['sangkhlaburi-plan','itinerary','แผนสังขละบุรี สะพานมอญและวิถีมอญ 2 วัน ใช้ block day'],
  ['kanchanaburi-cafe-raft-plan','itinerary','แผนสายคาเฟ่และนอนแพริมแม่น้ำแคว ใช้ block day'],
  ['kanchanaburi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (สะพาน ถ้ำกระแซ เอราวัณ สะพานมอญ) ใช้ block day'],
  ['nakhon-pathom-kanchanaburi-day-trip','itinerary','แผนข้ามจังหวัด นครปฐม–กาญจนบุรี องค์พระ–สะพานข้ามแม่น้ำแคว ใช้ block day'],
  ['kanchanaburi-ratchaburi-plan','itinerary','แผนข้ามจังหวัด กาญจนบุรี–ราชบุรี ตลาด-ถ้ำ-คาเฟ่ ใช้ block day'],
  ['kanchanaburi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (น้ำตกเล่นน้ำ นอนแพ รถไฟ) ใช้ block day'],
  ['kanchanaburi-first-timer-guide','itinerary','มากาญจนบุรีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['kanchanaburi-travel-tips','prep','เตรียมตัวเที่ยวกาญจนบุรี (ช่วงเวลาดีสุด น้ำตกมีน้ำ หน้าฝน งบ การจองแพ ซิม)'],
  ['kanchanaburi-getting-around','prep','การเดินทางกาญจนบุรี (จากกรุงเทพ รถตู้ รถไฟสายน้ำตก รถเช่า ไปสังขละบุรี/น้ำตกยังไง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวกาญจนบุรีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="kanchanaburi", crumbCity="กาญจนบุรี", crumbCityHref="city-kanchanaburi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-kanchanaburi.html และ top10-hotels-kanchanaburi.html + พี่น้อง 1 จาก: ${siblingList})
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

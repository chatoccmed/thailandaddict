export const meta = {
  name: 'chonburi-articles',
  description: 'Chonburi gold template — 38 articles (food / attractions / itineraries / prep), fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['chonburi-food-guide','food','รวมของกินชลบุรีต้องลอง ภาพรวมซีฟู้ด/ของฝากหนองมน/อาหารญี่ปุ่นศรีราชา (overview + cards)'],
  ['chonburi-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลชลบุรี (บางแสน ศรีราชา พัทยา) ซีฟู้ดสดริมทะเล'],
  ['sriracha-japanese-food','eat-ranking','ร้านอาหารญี่ปุ่นแท้ย่านศรีราชา (ราเมง ซูชิ อิซากายะ) ชุมชนคนญี่ปุ่น'],
  ['nong-mon-market-guide','food','ตลาดหนองมน ของฝากชลบุรี (ข้าวหลาม ขนมจาก หอยจ๊อ กุนเชียง) ซื้ออะไรดี'],
  ['pattaya-restaurants','eat-ranking','จัดอันดับร้านอาหารพัทยา ร้านเด็ดที่คนไปจริง คละไทย/ซีฟู้ด'],
  ['chonburi-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ชลบุรี ริมทะเลบางแสน/ศรีราชา/พัทยา กาแฟวิวทะเล'],
  ['chonburi-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างชลบุรี-พัทยา คุ้มราคา'],
  ['pattaya-international-food','eat-ranking','อาหารนานาชาติในพัทยา (อินเดีย รัสเซีย ยุโรป) ร้านแท้ที่ไหน'],
  ['chonburi-street-food','food','สตรีทฟู้ดและก๋วยเตี๋ยวในเมืองชลบุรี/พัทยา ของกินข้างทาง'],
  ['bangsaen-beach-eats','food','ของกินริมหาดบางแสน (เก้าอี้ผ้าใบ ปูม้า หอย ส้มตำ) บรรยากาศชายหาด'],
  ['pattaya-beach-clubs','eat-ranking','บีชคลับ/รูฟท็อป/บาร์ริมทะเลพัทยา-จอมเทียน วิวพระอาทิตย์ตก'],
  ['chonburi-dessert-cafe','eat-ranking','ของหวาน/ขนมพื้นเมือง/คาเฟ่ขนมชลบุรี ร้านน่านั่ง'],
]
const SEE = [
  ['chonburi-attractions','attraction','รวมที่เที่ยวชลบุรีที่ต้องไป คละหาด/เกาะ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['pattaya-beach-guide','attraction','หาดพัทยา + วอล์กกิงสตรีท (หาด กิจกรรมทางน้ำ กลางคืน ที่จอด)'],
  ['bangsaen-beach-guide','attraction','หาดบางแสน (เก้าอี้ผ้าใบ ซีฟู้ด ถนนเลียบหาด ปั่นจักรยาน การเดินทาง)'],
  ['koh-larn-guide','attraction','เกาะล้าน (เรือจากพัทยา หาดตาแหวน หาดแสม น้ำใส ดำน้ำตื้น ราคา)'],
  ['sanctuary-of-truth-guide','attraction','ปราสาทสัจธรรม พัทยาเหนือ (ปราสาทไม้แกะสลักริมทะเล เวลา ค่าเข้า)'],
  ['nong-nooch-garden-guide','attraction','สวนนงนุชพัทยา (สวนจัดแต่ง โชว์วัฒนธรรม ไดโนเสาร์ เวลา ค่าเข้า)'],
  ['khao-chi-chan-guide','attraction','วัดเขาชีจรรย์ (พระพุทธรูปแกะสลักหน้าผา บางละมุง การเดินทาง)'],
  ['pattaya-viewpoint-guide','attraction','จุดชมวิวพัทยา เขาพระตำหนัก (ป้ายพัทยาซิตี้ มองอ่าวพัทยาทั้งอ่าว)'],
  ['khao-sam-muk-guide','attraction','เขาสามมุก บางแสน (ศาลเจ้าแม่เขาสามมุก ฝูงลิง จุดชมวิวหาด)'],
  ['sriracha-guide','attraction','ศรีราชา (เกาะลอย สวนสาธารณะริมน้ำ ชุมชนญี่ปุ่น ตลาด)'],
  ['pattaya-floating-market','attraction','ตลาดน้ำ 4 ภาคพัทยา (ของกิน ของที่ระลึก เรือพาย เวลา ค่าเข้า)'],
  ['sattahip-beaches-guide','attraction','หาดสัตหีบ (หาดนางรอง หาดน้ำใส บรรยากาศเงียบกว่าพัทยา การเดินทาง)'],
]
const PLAN = [
  ['chonburi-1-day-itinerary','itinerary','แผนเที่ยวชลบุรี 1 วัน บางแสน หรือ พัทยา ใช้ block day'],
  ['chonburi-2d1n-itinerary','itinerary','แผนชลบุรี 2 วัน 1 คืน บางแสน–พัทยา ใช้ block day'],
  ['chonburi-3d2n-itinerary','itinerary','แผนชลบุรี 3 วัน 2 คืน ทะเล+เกาะ+ที่เที่ยวพัทยา ใช้ block day'],
  ['chonburi-sea-island-plan','itinerary','แผนสายทะเลและเกาะ บางแสน–เกาะล้าน ใช้ block day'],
  ['chonburi-food-trip-plan','itinerary','แผนสายของกิน หนองมน–ซีฟู้ดริมหาด–คาเฟ่ ใช้ block day'],
  ['pattaya-sightseeing-plan','itinerary','แผนเที่ยวพัทยา หาด–ปราสาทสัจธรรม–สวนนงนุช ใช้ block day'],
  ['chonburi-cafe-plan','itinerary','แผนสายคาเฟ่ริมทะเล บางแสน–ศรีราชา–พัทยา ใช้ block day'],
  ['chonburi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ป้ายพัทยา ปราสาทสัจธรรม ทะเล) ใช้ block day'],
  ['bangkok-chonburi-day-trip','itinerary','แผนข้ามจังหวัด กรุงเทพ–ชลบุรี เที่ยวทะเลไป-กลับวันเดียว ใช้ block day'],
  ['chonburi-rayong-plan','itinerary','แผนข้ามจังหวัด ชลบุรี–ระยอง เลาะทะเลตะวันออก ใช้ block day'],
  ['chonburi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (สวนน้ำ ซาฟารี สวนนงนุช เกาะล้าน) ใช้ block day'],
  ['chonburi-first-timer-guide','itinerary','มาชลบุรี/พัทยาครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chonburi-travel-tips','prep','เตรียมตัวเที่ยวชลบุรี/พัทยา (ช่วงเวลาดีสุด เลี่ยงวันหยุดยาวรถติด งบ ความปลอดภัย ซิม)'],
  ['chonburi-getting-around','prep','การเดินทางชลบุรี (มอเตอร์เวย์จากกรุงเทพ รถตู้/บัส รถไฟ สองแถวพัทยา เรือไปเกาะล้าน)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวชลบุรี/พัทยาลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chonburi", crumbCity="ชลบุรี", crumbCityHref="city-chonburi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-chonburi.html และ top10-hotels-chonburi.html + พี่น้อง 1 จาก: ${siblingList})
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

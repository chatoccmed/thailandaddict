export const meta = {
  name: 'prachuap-khiri-khan-articles',
  description: 'Prachuap Khiri Khan gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['prachuap-food-guide','food','รวมของกินประจวบ/หัวหินต้องลอง ภาพรวมซีฟู้ด/ปลาทู/สับปะรด (overview + cards)'],
  ['hua-hin-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลหัวหิน/ประจวบ ซีฟู้ดสดริมทะเล'],
  ['prachuap-pla-tu','food','ปลาทูประจวบ (ทอด นึ่ง ต้มยำ) ร้านเด็ดและตลาดปลาทูสด/เค็ม'],
  ['hua-hin-night-market','food','ตลาดโต้รุ่งหัวหิน ของกินกลางคืน (ทะเลย่าง ผัดไทย ของหวาน) เดินกินยาว'],
  ['hua-hin-cafe-guide','eat-ranking','จัดอันดับคาเฟ่หัวหิน วิวทะเล/วิวเขา/ในสวน บรรยากาศนั่งชิล'],
  ['hua-hin-restaurants','eat-ranking','ร้านอาหารหัวหินร้านดัง บรรยากาศดี เหมาะมื้อพิเศษ'],
  ['prachuap-pineapple-souvenir','food','สับปะรดประจวบ + ของฝาก (ปลาหมึกแห้ง กะปิ น้ำปลา สับปะรดกวน) ซื้อที่ไหน'],
  ['hua-hin-beach-clubs','eat-ranking','บีชคลับ/ร้านริมหาดหัวหิน วิวทะเล มื้อเย็น/พระอาทิตย์ตก'],
  ['prachuap-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่าง/ซีฟู้ดบุฟเฟต์หัวหิน-ประจวบ คุ้มราคา'],
  ['hua-hin-dessert-cafe','eat-ranking','ของหวาน/ขนมหม้อแกง/น้ำตาลโตนด/คาเฟ่ขนมหัวหิน'],
  ['prachuap-town-food','food','ของกินในเมืองประจวบ (ก๋วยเตี๋ยว ข้าวแกง ของกินเช้า) ร้านคนพื้นที่'],
  ['hua-hin-local-breakfast','food','อาหารเช้าหัวหิน (โจ๊ก ติ่มซำ ตลาดเช้าฉัตรไชย กาแฟ)'],
]
const SEE = [
  ['prachuap-attractions','attraction','รวมที่เที่ยวประจวบ/หัวหินที่ต้องไป คละหาด/เขา/วัฒนธรรม (ภาพรวม + cards)'],
  ['hua-hin-beach-guide','attraction','หาดหัวหิน (เดินเล่น ขี่ม้า ร้านริมหาด เขาเต่า การเดินทาง)'],
  ['hua-hin-railway-station','attraction','สถานีรถไฟหัวหิน (พลับพลาพระมงกุฎเกล้าฯ ประวัติ จุดถ่ายรูป)'],
  ['khao-takiab-guide','attraction','เขาตะเกียบ หัวหิน (วัด ลิง จุดชมวิว การเดินขึ้น)'],
  ['khao-sam-roi-yot-guide','attraction','อุทยานเขาสามร้อยยอด (เขาแดง ทุ่งสามร้อยยอด ดูนก การเดินทาง ค่าเข้า)'],
  ['phraya-nakhon-cave-guide','attraction','ถ้ำพระยานคร (พลับพลาในถ้ำ เดินเขา/นั่งเรือ แสงลอดถ้ำ เวลาที่ดี)'],
  ['prachuap-saam-ao-guide','attraction','อ่าวประจวบสามอ่าว (เขาชนทะเล จุดชมวิว ตัวเมืองประจวบ)'],
  ['wat-khao-chong-krachok','attraction','วัดเขาช่องกระจก ประจวบ (บันไดขึ้นเขา ลิง เจดีย์ วิวสามอ่าว)'],
  ['ban-krut-bang-saphan-guide','attraction','บ้านกรูด–บางสะพาน (หาดเงียบ พระมหาธาตุเจดีย์ภักดีประกาศ เกาะทะลุ ดำน้ำ)'],
  ['rajabhakti-park-guide','attraction','อุทยานราชภักดิ์ หัวหิน (พระบรมราชานุสาวรีย์ 7 พระองค์ การแต่งกาย เวลา)'],
  ['hua-hin-art-markets','attraction','ตลาด/ไนท์หัวหิน (Cicada Market, Tamarind, ตลาดฉัตรไชย) ของกิน-งานคราฟต์'],
  ['hua-hin-vineyard-guide','attraction','ไร่องุ่นหัวหิน Monsoon Valley (ชิมไวน์ ปั่นจักรยาน วิวไร่ การเดินทาง)'],
]
const PLAN = [
  ['prachuap-1-day-itinerary','itinerary','แผนเที่ยวหัวหิน/ประจวบ 1 วัน หาด–เขาตะเกียบ–ตลาดโต้รุ่ง ใช้ block day'],
  ['prachuap-2d1n-itinerary','itinerary','แผนหัวหิน 2 วัน 1 คืน หาด–สถานีรถไฟ–เขาตะเกียบ–ตลาดโต้รุ่ง ใช้ block day'],
  ['prachuap-3d2n-itinerary','itinerary','แผนประจวบ 3 วัน 2 คืน หัวหิน–เขาสามร้อยยอด–เมืองประจวบ ใช้ block day'],
  ['hua-hin-cafe-beach-plan','itinerary','แผนสายคาเฟ่และหาดหัวหิน นั่งชิลริมทะเล ใช้ block day'],
  ['khao-sam-roi-yot-plan','itinerary','แผนสายธรรมชาติ เขาสามร้อยยอด–ถ้ำพระยานคร–สามอ่าว ใช้ block day'],
  ['hua-hin-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (สวนน้ำ ฟาร์มแกะ ไร่องุ่น) ใช้ block day'],
  ['prachuap-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (สถานีรถไฟ สามอ่าว ถ้ำพระยานคร) ใช้ block day'],
  ['ban-krut-bang-saphan-plan','itinerary','แผนใต้สุดของจังหวัด บ้านกรูด–บางสะพาน–เกาะทะลุ ใช้ block day'],
  ['hua-hin-phetchaburi-plan','itinerary','แผนข้ามจังหวัด ชะอำ–หัวหิน เลียบทะเล ใช้ block day'],
  ['prachuap-chumphon-plan','itinerary','แผนข้ามจังหวัด ประจวบ–ชุมพร ลงใต้เลาะทะเล ใช้ block day'],
  ['hua-hin-weekend-getaway','itinerary','แผนหนีกรุงเทพมาหัวหินสุดสัปดาห์ ขับรถสบาย ๆ ใช้ block day'],
  ['prachuap-first-timer-guide','itinerary','มาหัวหิน/ประจวบครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['prachuap-travel-tips','prep','เตรียมตัวเที่ยวประจวบ/หัวหิน (ช่วงเวลาดีสุด เลี่ยงวันหยุดยาว งบ การแต่งตัว ซิม ระวังลิงเขาตะเกียบ)'],
  ['prachuap-getting-around','prep','การเดินทางประจวบ/หัวหิน (รถไฟหัวหิน รถตู้/บัสจากกรุงเทพ รถเช่า สองแถว ระยะทางแต่ละอำเภอ)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวประจวบคีรีขันธ์/หัวหินลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="prachuap-khiri-khan", crumbCity="ประจวบคีรีขันธ์", crumbCityHref="city-prachuap-khiri-khan.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-prachuap-khiri-khan.html และ top10-hotels-prachuap-khiri-khan.html + พี่น้อง 1 จาก: ${siblingList})
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

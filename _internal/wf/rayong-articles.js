export const meta = {
  name: 'rayong-articles',
  description: 'Rayong gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['rayong-food-guide','food','รวมของกินระยองต้องลอง ภาพรวมซีฟู้ด/ของทะเลแห้งบ้านเพ/ผลไม้ (overview + cards)'],
  ['rayong-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลระยอง (หาดแม่รำพึง บ้านเพ) ซีฟู้ดสด ราคาจับต้องได้'],
  ['ban-phe-dried-seafood','food','ของทะเลแห้ง/กะปิ/น้ำปลาบ้านเพ ระยอง ของฝาก ซื้อที่ไหน'],
  ['koh-samet-restaurants','eat-ranking','ร้านอาหาร/ซีฟู้ดเกาะเสม็ด ริมหาด บรรยากาศดี'],
  ['rayong-noodles-local','food','ก๋วยเตี๋ยว/ขนมจีนน้ำยาปูเมืองระยอง ร้านเก่าแก่คนพื้นที่'],
  ['rayong-cafe-guide','eat-ranking','คาเฟ่ระยอง ย่านยมจินดา/ริมหาดแม่รำพึง กาแฟในตึกเก่า/วิวทะเล'],
  ['rayong-fruit-orchards','food','ทุเรียน เงาะ มังคุดระยอง (หน้าผลไม้ เม.ย.-มิ.ย. สวนบุฟเฟต์ผลไม้)'],
  ['mae-ramphueng-beach-eats','eat-ranking','ร้านซีฟู้ด/ของกินริมหาดแม่รำพึง มื้อเย็นวิวทะเล'],
  ['rayong-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างระยอง ร้านมื้อเย็น คุ้มราคา'],
  ['rayong-dessert-souvenir','food','กะละแม ข้าวหลาม ขนมพื้นบ้าน/ของฝากระยอง ซื้อที่ไหน'],
  ['rayong-local-breakfast','food','อาหารเช้าแบบคนระยอง (ตลาดเช้า ก๋วยเตี๋ยว กาแฟ ของกินเช้า)'],
  ['rayong-street-food','food','สตรีทฟู้ดและของกินในเมืองระยอง ของกินข้างทาง'],
]
const SEE = [
  ['rayong-attractions','attraction','รวมที่เที่ยวระยองที่ต้องไป คละเกาะ/หาด/เมืองเก่า/ป่าชายเลน (ภาพรวม + cards)'],
  ['koh-samet-guide','attraction','เกาะเสม็ด ครบ (หาดทรายแก้ว อ่าวพร้าว อ่าววงเดือน เรือจากบ้านเพ ค่าเข้าอุทยาน ที่พัก)'],
  ['mae-ramphueng-beach-guide','attraction','หาดแม่รำพึง (หาดทรายยาว ถนนเลียบหาด ร้านอาหาร พระอาทิตย์ การเดินทาง)'],
  ['ban-phe-guide','attraction','บ้านเพ (ท่าเรือไปเกาะเสม็ด ตลาดของฝาก ของทะเลแห้ง)'],
  ['yom-chinda-old-street','attraction','ถนนยมจินดา ย่านเมืองเก่าระยอง (ตึกไม้ บ้านขุนนาง คาเฟ่ ของกิน)'],
  ['tung-prong-thong','attraction','ทุ่งโปรงทอง ปากน้ำประแส (ป่าชายเลน สะพานไม้ จุดถ่ายรูป เวลาที่ดี)'],
  ['htms-prasae-warship','attraction','เรือรบหลวงประแส อนุสรณ์ปากน้ำประแส (ขึ้นชมเรือ วิวแม่น้ำ ประวัติ)'],
  ['sunthorn-phu-monument','attraction','อนุสาวรีย์สุนทรภู่ อ.แกลง (รูปปั้นพระอภัยมณี สวน เวลา)'],
  ['khao-laem-ya-national-park','attraction','อุทยานเขาแหลมหญ้า–หมู่เกาะเสม็ด (จุดชมวิว หาดเงียบ เส้นทางธรรมชาติ ค่าเข้า)'],
  ['rayong-aquarium','attraction','สถาบันวิทยาศาสตร์ทางทะเล/พิพิธภัณฑ์สัตว์น้ำระยอง (ที่เที่ยวในร่ม เด็ก เวลา ค่าเข้า)'],
  ['koh-samet-beaches','attraction','รวมหาดเกาะเสม็ด (ทรายแก้ว อ่าวพร้าว อ่าววงเดือน อ่าวเทียน) เลือกหาด'],
  ['paknam-prasae-community','attraction','ชุมชนปากน้ำประแส (สะพานประแสสิน วิถีประมง ของกินทะเล เดินเที่ยว)'],
]
const PLAN = [
  ['rayong-1-day-itinerary','itinerary','แผนเที่ยวระยอง 1 วัน บ้านเพ–แม่รำพึง หรือ เกาะเสม็ดวันเดียว ใช้ block day'],
  ['rayong-2d1n-itinerary','itinerary','แผนระยอง 2 วัน 1 คืน บ้านเพ–เกาะเสม็ด ใช้ block day'],
  ['rayong-3d2n-itinerary','itinerary','แผนระยอง 3 วัน 2 คืน ทะเล+เกาะ+เมืองเก่า ใช้ block day'],
  ['koh-samet-plan','itinerary','แผนเที่ยวเกาะเสม็ด หาด–ดำน้ำตื้น–รอบเกาะ ใช้ block day'],
  ['rayong-sea-beach-plan','itinerary','แผนสายทะเลและหาด แม่รำพึง–เกาะเสม็ด ใช้ block day'],
  ['rayong-food-trip-plan','itinerary','แผนสายของกิน บ้านเพ–ซีฟู้ด–ของทะเลแห้ง ใช้ block day'],
  ['rayong-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ยมจินดา–ปากน้ำประแส ใช้ block day'],
  ['rayong-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ทุ่งโปรงทอง เกาะเสม็ด เรือรบประแส) ใช้ block day'],
  ['rayong-fruit-orchard-plan','itinerary','แผนหน้าผลไม้ เที่ยวสวนทุเรียน–เงาะ–มังคุด ใช้ block day'],
  ['rayong-chanthaburi-eastern-plan','itinerary','แผนข้ามจังหวัด ชลบุรี–ระยอง–จันทบุรี เลาะทะเลตะวันออก ใช้ block day'],
  ['rayong-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (พิพิธภัณฑ์สัตว์น้ำ หาดน้ำตื้น เกาะเสม็ด) ใช้ block day'],
  ['rayong-first-timer-guide','itinerary','มาระยองครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['rayong-travel-tips','prep','เตรียมตัวเที่ยวระยอง (ช่วงเวลาดีสุด หน้าผลไม้ การจองเรือเกาะเสม็ด ค่าเข้าอุทยาน งบ ซิม)'],
  ['rayong-getting-around','prep','การเดินทางระยอง (จากกรุงเทพ รถตู้/บัส ท่าเรือบ้านเพ เรือไปเกาะเสม็ด รถในเกาะ รถเช่า)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวระยองลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="rayong", crumbCity="ระยอง", crumbCityHref="city-rayong.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-rayong.html และ top10-hotels-rayong.html + พี่น้อง 1 จาก: ${siblingList})
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

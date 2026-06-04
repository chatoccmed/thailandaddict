export const meta = {
  name: 'chiang-mai-articles',
  description: 'Chiang Mai gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + city + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['top-khao-soi-chiang-mai','eat-ranking','จัดอันดับร้านข้าวซอยเชียงใหม่ที่อร่อยและคนพื้นที่ไปจริง (ranked ร้านจริง พร้อมย่าน/ราคา/จุดเด่น)'],
  ['chiang-mai-cafe-guide','eat-ranking','จัดอันดับคาเฟ่เชียงใหม่ คละในเมือง/นิมมาน/กลางทุ่งแม่ริม กาแฟดอย บรรยากาศถ่ายรูป'],
  ['chiang-mai-northern-cuisine','eat-ranking','ร้านอาหารเหนือดั้งเดิม (น้ำพริกอ่อง/หนุ่ม แกงฮังเล ขันโตก ไส้อั่ว) ร้านที่คนเหนือไป'],
  ['chiang-mai-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างเชียงใหม่ ร้านยอดนิยม คุ้มราคา'],
  ['chiang-mai-street-food','food','สตรีทฟู้ดและตลาด (กาดหลวง ประตูเชียงใหม่ ถนนคนเดิน) ของกินเดินชิม'],
  ['chiang-mai-dessert-bakery','eat-ranking','ของหวาน เบเกอรี มัทฉะ ร้านขนมเชียงใหม่'],
  ['chiang-mai-coffee-roasters','eat-ranking','โรสเตอร์/ร้านกาแฟพิเศษ ใช้เมล็ดดอยรอบเชียงใหม่ (specialty coffee)'],
  ['chiang-mai-vegetarian-vegan','eat-ranking','ร้านมังสวิรัติ/วีแกน/สายเฮลตี้ในเชียงใหม่'],
  ['chiang-mai-riverside-restaurants','eat-ranking','ร้านอาหารริมแม่น้ำปิง บรรยากาศดี เหมาะมื้อพิเศษ'],
  ['chiang-mai-local-breakfast','food','อาหารเช้าแบบคนเชียงใหม่ (ข้าวซอย น้ำเงี้ยว ข้าวต้ม กาแฟโบราณ ตลาดเช้า)'],
  ['chiang-mai-fine-dining','eat-ranking','ร้านไฟน์ไดนิ่ง/มิชลินเชียงใหม่ มื้อพิเศษโอกาสสำคัญ'],
]
const SEE = [
  ['chiang-mai-attractions','attraction','รวมที่เที่ยวเชียงใหม่ที่ต้องไป คละธรรมชาติ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['doi-suthep-guide','attraction','วัดพระธาตุดอยสุเทพ ครบ (การเดินทาง เวลา ค่าเข้า จุดถ่ายรูป)'],
  ['doi-inthanon-guide','attraction','อุทยานดอยอินทนนท์ (ยอดดอย กิ่วแม่ปาน น้ำตก พระมหาธาตุ การเดินทาง)'],
  ['chiang-mai-old-city-temples','attraction','วัดในเมืองเก่า (เจดีย์หลวง พระสิงห์ เชียงมั่น) เดินเที่ยวคูเมือง'],
  ['nimman-area-guide','attraction','ย่านนิมมานเหมินท์ (คาเฟ่ ช้อป เมญ่า One Nimman) เที่ยวกลางเมืองใหม่'],
  ['mon-jam-mae-rim','attraction','ม่อนแจ่ม–แม่ริม (ทะเลหมอก ไร่ จุดกางเต็นท์ คาเฟ่วิว)'],
  ['chiang-mai-sunday-walking-street','attraction','ถนนคนเดินวันอาทิตย์ราชดำเนิน (ของกิน งานคราฟต์ เวลา จุดเริ่ม)'],
  ['chiang-mai-elephant-sanctuary','attraction','ปางช้างเชิงอนุรักษ์ (ethical elephant sanctuary) ที่แนะนำและข้อควรรู้'],
  ['chiang-mai-waterfalls-nature','attraction','น้ำตกและธรรมชาติรอบเชียงใหม่ (ห้วยแก้ว แม่สา น้ำพุร้อน เดินป่า)'],
  ['chiang-mai-viewpoints','attraction','จุดชมวิว/คาเฟ่วิวเชียงใหม่ ถ่ายรูปสวยลง social'],
  ['chiang-mai-night-markets','attraction','ตลาดกลางคืน/ไนท์บาซาร์ (ไนท์บาซาร์ ประตูท่าแพ จิงจ่าย) ช้อปกิน'],
  ['chiang-mai-craft-villages','attraction','หมู่บ้านหัตถกรรม (สันกำแพง บ่อสร้างร่ม เครื่องเงิน) งานคราฟต์'],
]
const PLAN = [
  ['chiang-mai-1-day-itinerary','itinerary','แผนเที่ยวเชียงใหม่ 1 วัน เช้าเย็น (เมืองเก่า–ดอยสุเทพ–นิมมาน) ใช้ block day'],
  ['chiang-mai-2d1n-itinerary','itinerary','แผนเชียงใหม่ 2 วัน 1 คืน เที่ยวครบเมือง+ดอย ใช้ block day'],
  ['chiang-mai-3d2n-itinerary','itinerary','แผนเชียงใหม่ 3 วัน 2 คืน เมือง+ธรรมชาติ+คาเฟ่ ใช้ block day'],
  ['chiang-mai-cafe-hopping-plan','itinerary','แผนสายคาเฟ่ ตะลุยร้านกาแฟ/ของกิน 1-2 วัน ใช้ block day'],
  ['chiang-mai-nature-doi-plan','itinerary','แผนสายธรรมชาติ ดอยอินทนนท์–ม่อนแจ่ม–น้ำตก ใช้ block day'],
  ['chiang-mai-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (คาเฟ่ มุมสวย วัด ดอย) ใช้ block day'],
  ['chiang-mai-temples-culture-plan','itinerary','แผนสายวัด/วัฒนธรรมล้านนา ใช้ block day'],
  ['chiang-mai-chiang-rai-4d3n','itinerary','แผนข้ามจังหวัด เชียงใหม่–เชียงราย 4 วัน 3 คืน ใช้ block day'],
  ['chiang-mai-pai-loop-plan','itinerary','แผนข้ามจังหวัด เชียงใหม่–ปาย–แม่ฮ่องสอน (ทางโค้ง) ใช้ block day'],
  ['chiang-mai-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ปางช้าง สวนสัตว์ คาเฟ่) ใช้ block day'],
  ['chiang-mai-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวเชียงใหม่คุ้ม ใช้ block day'],
  ['chiang-mai-first-timer-guide','itinerary','มาเชียงใหม่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chiang-mai-travel-tips','prep','เตรียมตัวเที่ยวเชียงใหม่ (ช่วงเวลาดีสุด เลี่ยงฝุ่นมีนา-เมษา งบ การแต่งตัว ซิม ของที่ควรเตรียม)'],
  ['chiang-mai-getting-around','prep','การเดินทางในเชียงใหม่ (รถแดง แกร็บ เช่ารถ/มอไซค์ สนามบิน) + ไปดอยยังไง'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเชียงใหม่ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chiang-mai", crumbCity="เชียงใหม่", crumbCityHref="city-chiang-mai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-chiang-mai.html และ top10-hotels-chiang-mai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

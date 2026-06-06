export const meta = {
  name: 'sukhothai-articles',
  description: 'Sukhothai gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['sukhothai-food-guide','food','รวมของกินสุโขทัยที่ต้องลอง คละก๋วยเตี๋ยวสุโขทัย/ข้าวเปิ๊บ/อาหารเหนือ/คาเฟ่ (ภาพรวม + cards)'],
  ['top-sukhothai-noodles','eat-ranking','จัดอันดับร้านก๋วยเตี๋ยวสุโขทัยเจ้าดังที่คนพื้นที่ไปจริง (ร้านจริง ย่าน/ราคา/จุดเด่น เส้นเล็กน้ำหวานนำ ถั่วฝักยาว)'],
  ['sukhothai-khao-poep','food','ข้าวเปิ๊บสุโขทัย–สวรรคโลก แผ่นแป้งนึ่งสอดไส้กินกับน้ำซุป กินที่ไหนอร่อย'],
  ['sukhothai-cafe-guide','eat-ranking','จัดอันดับคาเฟ่สุโขทัย รอบเมืองเก่าและในเมืองใหม่ นั่งพักหลังปั่นจักรยาน'],
  ['sukhothai-northern-food','eat-ranking','ร้านอาหารเหนือในสุโขทัย (ข้าวซอย น้ำเงี้ยว ไส้อั่ว น้ำพริกอ่อง) รสเหนือผสมกลาง'],
  ['sukhothai-morning-market-food','food','ตลาดเช้าและสตรีทฟู้ดสุโขทัย ข้าวแกง ขนมพื้นบ้าน ของกินเช้าราคาท้องถิ่น'],
  ['sukhothai-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างสุโขทัย ร้านยอดนิยมมื้อเย็น คุ้มราคา'],
  ['sukhothai-local-breakfast','food','อาหารเช้าแบบคนสุโขทัย (ก๋วยเตี๋ยว ข้าวต้ม กาแฟ ตลาดเช้า) ก่อนออกเที่ยวเมืองเก่า'],
  ['sukhothai-souvenir-sangkhalok','eat-ranking','ของฝากสุโขทัย เครื่องสังคโลก ขนมพื้นเมือง ของแห้ง ซื้อที่ไหน'],
]
const SEE = [
  ['sukhothai-attractions','attraction','รวมที่เที่ยวสุโขทัยที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['sukhothai-historical-park-guide','attraction','อุทยานประวัติศาสตร์สุโขทัยครบ (โซนใน-นอกกำแพง ค่าเข้า เวลา ปั่นจักรยาน จุดไฮไลต์)'],
  ['wat-mahathat-sukhothai','attraction','วัดมหาธาตุ ใจกลางเมืองเก่า เจดีย์ทรงพุ่มข้าวบิณฑ์ แถวพระพุทธรูป จุดถ่ายรูป'],
  ['wat-si-chum-guide','attraction','วัดศรีชุม พระอจนะองค์ใหญ่ในมณฑป มองผ่านช่องประตู การเดินทาง'],
  ['wat-sa-si-guide','attraction','วัดสระศรี เจดีย์ทรงลังกากลางสระน้ำ สะท้อนเงาน้ำเช้า-เย็น'],
  ['si-satchanalai-historical-park','attraction','อุทยานประวัติศาสตร์ศรีสัชนาลัย เมืองโบราณริมแม่น้ำยม ร่มรื่น คนน้อย วัดช้างล้อม'],
  ['ramkhamhaeng-national-park','attraction','อุทยานแห่งชาติรามคำแหง (เขาหลวง) เดินป่าขึ้นยอด ทะเลหมอก สำหรับสายเดินป่า'],
  ['sangkhalok-kilns-museum','attraction','เตาทุเรียงสังคโลกศรีสัชนาลัย + พิพิธภัณฑ์สังคโลก เรียนรู้เครื่องปั้นโบราณ'],
  ['sukhothai-old-city-cycling','attraction','ปั่นจักรยานชมเมืองเก่าสุโขทัย เส้นทางแนะนำ เช่าจักรยานที่ไหน ใช้เวลาเท่าไร'],
  ['sukhothai-loy-krathong-festival','attraction','งานลอยกระทงเผาเทียนเล่นไฟสุโขทัย ในเขตเมืองเก่า ช่วงจัดงาน บัตร จุดชม'],
  ['sukhothai-best-temples','attraction','วัดเด่นในอุทยานที่ไม่ควรพลาด (วัดสะพานหิน วัดช้างล้อม วัดเจดีย์เจ็ดแถว วัดเชตุพน)'],
  ['sukhothai-new-city-guide','attraction','ตัวเมืองสุโขทัยใหม่ริมแม่น้ำยม ร้านอาหาร ตลาด ที่พัก เดินเล่นยามเย็น'],
]
const PLAN = [
  ['sukhothai-1-day-itinerary','itinerary','แผนเที่ยวสุโขทัย 1 วัน เก็บไฮไลต์อุทยานเมืองเก่า ใช้ block day'],
  ['sukhothai-2d1n-itinerary','itinerary','แผนสุโขทัย 2 วัน 1 คืน เมืองเก่า+ศรีสัชนาลัย ใช้ block day'],
  ['sukhothai-3d2n-itinerary','itinerary','แผนสุโขทัย 3 วัน 2 คืน เมืองเก่า+ศรีสัชนาลัย+ธรรมชาติ ใช้ block day'],
  ['sukhothai-cycling-plan','itinerary','แผนสายปั่นจักรยานชมโบราณสถานสุโขทัย 1-2 วัน ใช้ block day'],
  ['sukhothai-nature-plan','itinerary','แผนสายธรรมชาติ เขาหลวง–รามคำแหง เดินป่า ใช้ block day'],
  ['sukhothai-culture-history-plan','itinerary','แผนสายประวัติศาสตร์/โบราณสถาน ตามรอยเมืองเก่า ใช้ block day'],
  ['sukhothai-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เจดีย์สะท้อนน้ำ พระอจนะ มุมสวย) ใช้ block day'],
  ['sukhothai-si-satchanalai-plan','itinerary','แผนสุโขทัย–ศรีสัชนาลัย ตามรอยเมืองโบราณ 2 วัน ใช้ block day'],
  ['sukhothai-lampang-plan','itinerary','แผนข้ามจังหวัด สุโขทัย–ลำปาง เมืองเก่า–รถม้า ใช้ block day'],
  ['sukhothai-phrae-plan','itinerary','แผนข้ามจังหวัด สุโขทัย–แพร่ เมืองเก่าล้านนา ใช้ block day'],
  ['sukhothai-tak-plan','itinerary','แผนข้ามจังหวัด สุโขทัย–ตาก (ออบหลวง/เขื่อนภูมิพล) ใช้ block day'],
  ['sukhothai-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก สุโขทัย ปั่นจักรยานสบาย ๆ ใช้ block day'],
  ['sukhothai-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวสุโขทัยคุ้ม ใช้ block day'],
  ['sukhothai-first-timer-guide','itinerary','มาสุโขทัยครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['sukhothai-travel-tips','prep','เตรียมตัวเที่ยวสุโขทัย (ช่วงเวลาดีสุด งานลอยกระทง อากาศ แต่งตัวเดินกลางแดด งบ ค่าเข้าอุทยาน)'],
  ['sukhothai-getting-around','prep','การเดินทางไป/ในสุโขทัย (สนามบินสุโขทัย Bangkok Airways รถทัวร์ สองแถวเมืองเก่า–เมืองใหม่ เช่าจักรยาน/มอไซค์)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสุโขทัยลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="sukhothai", crumbCity="สุโขทัย", crumbCityHref="city-sukhothai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-sukhothai.html และ top10-hotels-sukhothai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'ayutthaya-articles',
  description: 'Ayutthaya gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['ayutthaya-food-guide','food','รวมของกินอยุธยาต้องลอง ภาพรวมก๋วยเตี๋ยวเรือ/กุ้งแม่น้ำ/โรตีสายไหม (overview + cards)'],
  ['ayutthaya-boat-noodles','eat-ranking','จัดอันดับร้านก๋วยเตี๋ยวเรืออยุธยา ร้านเก่าแก่ที่คนไปจริง ชามเล็กรสเข้ม'],
  ['ayutthaya-river-prawn','eat-ranking','ร้านกุ้งแม่น้ำเผาอยุธยา ริมแม่น้ำ กุ้งตัวโตมันเยิ้ม'],
  ['roti-sai-mai-guide','food','โรตีสายไหมอยุธยา ของฝากคู่เมือง (เจ้าดัง วิธีกิน ซื้อที่ไหน)'],
  ['ayutthaya-thai-desserts','eat-ranking','ขนมหวานชาววัง/ขนมไทยอยุธยา (ทองหยิบ ทองหยอด ฝอยทอง) ร้านเด็ด'],
  ['ayutthaya-beef-noodles','eat-ranking','ก๋วยเตี๋ยวเนื้อ/เนื้อตุ๋นอยุธยา ร้านเก่าแก่ น้ำซุปหอมเครื่อง'],
  ['ayutthaya-cafe-guide','eat-ranking','จัดอันดับคาเฟ่อยุธยา ในเรือนเก่า/ริมน้ำ/เกาะเมือง นั่งพักหลังชมวัด'],
  ['ayutthaya-floating-market-food','food','ของกินตลาดน้ำอโยธยา + สตรีทฟู้ดรอบเมือง เดินชิม'],
  ['ayutthaya-riverside-restaurants','eat-ranking','ร้านอาหารริมแม่น้ำอยุธยา บรรยากาศดี มื้อพิเศษ'],
  ['ayutthaya-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างอยุธยา ร้านมื้อเย็น คุ้มราคา'],
  ['ayutthaya-local-breakfast','food','อาหารเช้าแบบคนอยุธยา (ก๋วยเตี๋ยว ตลาดเช้า กาแฟ ของกินเช้า)'],
  ['ayutthaya-street-food','food','สตรีทฟู้ดและของกินรอบเกาะเมืองอยุธยา ของทอด ขนม จานเดียว'],
]
const SEE = [
  ['ayutthaya-attractions','attraction','รวมที่เที่ยวอยุธยาที่ต้องไป คละวัด/วัง/ตลาดน้ำ/ล่องเรือ (ภาพรวม + cards)'],
  ['wat-mahathat-guide','attraction','วัดมหาธาตุ (เศียรพระในรากต้นโพธิ์ เวลา ค่าเข้า จุดถ่ายรูป มารยาท)'],
  ['wat-chaiwatthanaram-guide','attraction','วัดไชยวัฒนาราม (ปรางค์แบบขอม ริมเจ้าพระยา ช่วงเย็น/ไฟกลางคืน แต่งชุดไทย)'],
  ['wat-phra-si-sanphet-guide','attraction','วัดพระศรีสรรเพชญ์ (เจดีย์ลังกา 3 องค์ เขตวังหลวงเดิม เวลา ค่าเข้า)'],
  ['wat-yai-chai-mongkhon-guide','attraction','วัดใหญ่ชัยมงคล (เจดีย์ใหญ่ขึ้นชมวิว พระนอน พระห่มผ้าเหลือง)'],
  ['wat-lokayasutharam-guide','attraction','วัดโลกยสุธาราม (พระนอนกลางแจ้งองค์ใหญ่ มุมเงียบคนน้อย)'],
  ['wat-phutthaisawan-guide','attraction','วัดพุทไธศวรรย์ (พระปรางค์ใหญ่ ระเบียงคด ริมน้ำฝั่งใต้เกาะเมือง)'],
  ['bang-pa-in-palace-guide','attraction','พระราชวังบางปะอิน (พระที่นั่งกลางน้ำ สวน สถาปัตยกรรมผสม เวลา ค่าเข้า การแต่งกาย)'],
  ['ayothaya-floating-market','attraction','ตลาดน้ำอโยธยา (ของกิน ของฝาก การแสดงพื้นบ้าน เวลา ค่าเข้า)'],
  ['ayutthaya-river-cruise','attraction','ล่องเรือรอบเกาะเมืองอยุธยา (เจ้าพระยา-ป่าสัก ไหว้พระริมน้ำ ดินเนอร์ครูซ)'],
  ['ayutthaya-night-temples','attraction','ชมวัดอยุธยายามค่ำเปิดไฟ (ไชยวัฒนาราม พระศรีสรรเพชญ์ เวลาเปิดไฟ จุดถ่ายรูป)'],
  ['ayutthaya-bike-costume-guide','attraction','ปั่นจักรยานชมวัด + แต่งชุดไทยถ่ายรูปในเกาะเมือง (เช่าที่ไหน เส้นทาง มารยาท)'],
]
const PLAN = [
  ['ayutthaya-1-day-itinerary','itinerary','แผนเที่ยวอยุธยา 1 วัน วัดเด่นในเกาะเมือง+ของกิน ใช้ block day'],
  ['ayutthaya-2d1n-itinerary','itinerary','แผนอยุธยา 2 วัน 1 คืน เมืองเก่า+ตลาดน้ำ+ล่องเรือ ใช้ block day'],
  ['ayutthaya-3d2n-itinerary','itinerary','แผนอยุธยา 3 วัน 2 คืน วัด+วัง+คาเฟ่+บางปะอิน ใช้ block day'],
  ['ayutthaya-bike-temple-plan','itinerary','แผนปั่นจักรยานชมวัดในเกาะเมือง ใช้ block day'],
  ['ayutthaya-cafe-food-plan','itinerary','แผนสายคาเฟ่และของกินรอบเมืองอยุธยา ใช้ block day'],
  ['ayutthaya-river-temple-plan','itinerary','แผนล่องเรือไหว้พระริมน้ำอยุธยา ใช้ block day'],
  ['ayutthaya-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เศียรพระ ไชยวัฒนาราม ชุดไทย ไฟกลางคืน) ใช้ block day'],
  ['ayutthaya-temples-history-plan','itinerary','แผนสายวัด/ประวัติศาสตร์ครบเส้นทางหลัก ใช้ block day'],
  ['ayutthaya-bangkok-day-trip','itinerary','แผนข้ามจังหวัด อยุธยา–กรุงเทพ ไป-กลับนั่งรถไฟ 1 วัน ใช้ block day'],
  ['ayutthaya-ang-thong-plan','itinerary','แผนข้ามจังหวัด อยุธยา–อ่างทอง ตามรอยวัดและเมืองเก่า ใช้ block day'],
  ['ayutthaya-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ปางช้าง ตลาดน้ำ ล่องเรือ วัด) ใช้ block day'],
  ['ayutthaya-first-timer-guide','itinerary','มาอยุธยาครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['ayutthaya-travel-tips','prep','เตรียมตัวเที่ยวอยุธยา (ช่วงเวลาดีสุด การแต่งกายเข้าวัด ค่าเข้าโบราณสถาน เลี่ยงแดด งบ ซิม)'],
  ['ayutthaya-getting-around','prep','การเดินทางอยุธยา (รถไฟจากกรุงเทพ รถตู้ เช่าจักรยาน/มอไซค์ รถราง ตุ๊กตุ๊กเหมา)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพระนครศรีอยุธยาลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="ayutthaya", crumbCity="พระนครศรีอยุธยา", crumbCityHref="city-ayutthaya.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-ayutthaya.html และ top10-hotels-ayutthaya.html + พี่น้อง 1 จาก: ${siblingList})
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

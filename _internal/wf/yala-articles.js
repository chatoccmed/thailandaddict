export const meta = {
  name: 'yala-articles',
  description: 'Yala (ยะลา) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (Betong chicken, Hokkien, tilapia, chao kuai)' },
    { title: 'See', detail: '12 attraction articles (Aiyerweng sea of mist + Betong + Bang Lang dam)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['yala-betong-chicken','eat-ranking','ไก่เบตงยะลา ไก่พันธุ์พื้นเมืองเนื้อแน่นหนังกรอบ ต้ม นึ่ง ตุ๋น ร้านดังในเบตง ที่คนท้องถิ่นและนักท่องเที่ยวสั่ง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['betong-hokkien-food','eat-ranking','อาหารจีนฮกเกี้ยนเบตง เคาหยกหมูสามชั้นตุ๋นเผือก ผัดผักน้ำ เมนูจีนถิ่นในร้านเก่าแก่กลางเบตง ร้านเด็ด'],
  ['yala-cafe-guide','eat-ranking','คาเฟ่ยะลา-เบตง ในเมืองและบนเขา กาแฟดี วิวหมอก ขนมจีนถิ่น ถ่ายรูป'],
  ['betong-tilapia','food','ปลานิลสายน้ำไหลเบตง เลี้ยงในน้ำไหลเย็น เนื้อแน่นไม่มีกลิ่นดิน ทอดกรอบราดน้ำปลา นึ่งซีอิ๊ว ร้านขึ้นชื่อ'],
  ['yala-southern-food','eat-ranking','อาหารใต้รสจัดยะลา แกงไตปลา คั่วกลิ้ง แกงเหลือง ข้าวยำปักษ์ใต้ ร้านที่คนท้องถิ่นไป เมนูเด็ด'],
  ['betong-chao-kuai','food','เฉาก๊วยเบตง เนื้อเหนียวนุ่มขึ้นชื่อ ราดน้ำเชื่อมเย็น ของหวานประจำเมือง ร้านดัง ของฝาก'],
  ['yala-malay-food','food','อาหารมลายูยะลา นาซิดาแฆ ข้าวยำน้ำบูดู โรตี กินคู่น้ำชาชัก ร้านน้ำชาเปิดเช้า วิถีมุสลิม'],
  ['yala-pla-som','food','ปลาส้มและปลาแดดเดียวยะลา จากแถบเขื่อนบางลาง หมักรสเปรี้ยว ทอดกรอบกินกับข้าว น้ำพริก ของถิ่น ของฝาก'],
  ['yala-local-breakfast','food','อาหารเช้าแบบคนยะลา (นาซิดาแฆ ข้าวยำ โรตีชาชัก ติ่มซำเบตง กาแฟโบราณ ตลาดเช้า)'],
  ['yala-chinese-dessert','food','ขนมและของหวานจีนเบตง ฮูแซเปี๊ยะ ขนมพื้นบ้าน ของหวานกะทิมลายู ตามตลาดเช้าและร้านเก่า กินคู่กาแฟ'],
  ['yala-souvenir-food','food','ของฝากกินได้ยะลา-เบตง (เฉาก๊วยเบตง ปลาส้ม ฮูแซเปี๊ยะ ส้มโชกุน ของแปรรูป แหล่งซื้อ)'],
]
const SEE = [
  ['yala-attractions','attraction','รวมที่เที่ยวยะลาที่ต้องไป คละทะเลหมอกอัยเยอร์เวง/เมืองเบตง/เขื่อนบางลาง/อุโมงค์ปิยะมิต/ผังเมืองยะลา (ภาพรวม + cards)'],
  ['aiyerweng-skywalk','attraction','สกายวอล์กอัยเยอร์เวง ทางเดินกระจกยื่นเหนือหุบเขาเบตง ชมทะเลหมอกตอนเช้ารอบทิศ จุดชมวิวยอดนิยมที่สุดของยะลา เวลา/ค่าเข้า'],
  ['betong-town','attraction','เมืองเบตงและตู้ไปรษณีย์ใหญ่ ย่านกลางเมือง หอนาฬิกา สตรีทอาร์ต ตึกเก่าจีนฮกเกี้ยน บรรยากาศเมืองชายแดนในหุบเขา'],
  ['underground-tunnel-piyamit','attraction','อุโมงค์ปิยะมิต อุโมงค์ดินยาวในป่าเบตง เคยเป็นฐานหลบภัยเก่า เดินลอดชมทางคดเคี้ยว ประวัติศาสตร์ชายแดนใต้'],
  ['betong-hot-spring','attraction','บ่อน้ำพุร้อนเบตง บ่อน้ำร้อนธรรมชาติกลางป่า ร้อนพอต้มไข่ บ่อแช่เท้าแช่ตัวคลายเมื่อย จุดแวะพักระหว่างเที่ยวเบตง'],
  ['southernmost-thailand-betong','attraction','ป้ายใต้สุดสยามและสวนหมื่นบุปผาเบตง ป้ายชายแดนปลายแผ่นดินไทย สวนดอกไม้เมืองหนาวบนเขา อากาศเย็น จุดถ่ายรูป'],
  ['bang-lang-dam','attraction','เขื่อนบางลาง บันนังสตา เขื่อนใหญ่กลางป่า ทะเลสาบกว้างล้อมภูเขา นั่งเรือชมวิว แพริมน้ำ สันเขื่อนทอดยาว'],
  ['yala-city-plan','attraction','ผังเมืองยะลาวงกลมและศาลหลักเมือง เมืองที่จัดผังสวยที่สุดของไทย ถนนตัดตรงเรียงใยแมงมุมรอบศาลหลักเมือง เดินดูความเป็นระเบียบ'],
  ['wat-khuha-phimuk','attraction','วัดคูหาภิมุข (วัดถ้ำ) วัดในถ้ำใกล้เมืองยะลา พระนอนองค์ใหญ่ หินงอกหินย้อยในถ้ำ วัดเก่าแก่ จุดไหว้พระชมถ้ำ'],
  ['betong-street-art','attraction','สตรีทอาร์ตเบตง ภาพวาดตามกำแพงตึกเก่ากลางเมือง เล่าเรื่องวิถีจีน-มลายูและของเด่นเบตง จุดเดินถ่ายรูปในเมือง'],
  ['yala-betong-nature','attraction','ธรรมชาติเบตง-ยะลา ป่าเขาฮาลา-บาลา ทะเลหมอก น้ำตก ทะเลสาบเขื่อนบางลาง อากาศเย็นในหุบเขาชายแดนใต้'],
  ['yala-culture','attraction','วัฒนธรรมยะลา ผสมมลายูมุสลิม จีนฮกเกี้ยนเบตง และไทยพุทธในจังหวัดเดียว ภาษา อาหาร งานประเพณี'],
]
const PLAN = [
  ['yala-1-day-itinerary','itinerary','แผนเที่ยวเมืองยะลา 1 วัน ผังเมืองวงกลม-วัดคูหาภิมุข-ของกินถิ่น ใช้ block day'],
  ['yala-betong-2d1n-itinerary','itinerary','แผนยะลา-เบตง 2 วัน 1 คืน เมืองยะลา-ทะเลหมอกอัยเยอร์เวง-ตัวเมืองเบตง ใช้ block day'],
  ['yala-betong-3d2n-itinerary','itinerary','แผนยะลา-เบตง 3 วัน 2 คืน เมือง+หมอก+อุโมงค์+บ่อน้ำพุร้อน+เขื่อน ใช้ block day'],
  ['betong-mist-nature-plan','itinerary','แผนเบตงสายชมหมอกและธรรมชาติ สกายวอล์กอัยเยอร์เวง-บ่อน้ำพุร้อน-อุโมงค์ปิยะมิต ใช้ block day'],
  ['yala-dam-lake-plan','itinerary','แผนสายเขื่อนและทะเลสาบ เขื่อนบางลาง-นั่งเรือ-แพริมน้ำ ใช้ block day'],
  ['yala-food-plan','itinerary','แผนสายของกินถิ่น ไก่เบตง-เคาหยก-เฉาก๊วย-ร้านน้ำชาเช้า ใช้ block day'],
  ['betong-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ทะเลหมอกสกายวอล์ก ตู้ไปรษณีย์ใหญ่ สตรีทอาร์ต ป้ายใต้สุดสยาม) ใช้ block day'],
  ['yala-pattani-plan','itinerary','แผนข้ามจังหวัด ยะลา–ปัตตานี เลาะชายแดนใต้เที่ยวเมืองและวัฒนธรรมมลายู ใช้ block day'],
  ['yala-songkhla-plan','itinerary','แผนข้ามจังหวัด ยะลา–สงขลา ต่อทริปลงเมืองเก่าและหาดใหญ่กินของอร่อย ใช้ block day'],
  ['yala-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ทะเลหมอกสกายวอล์ก บ่อน้ำพุร้อน สวนหมื่นบุปผา คาเฟ่) ใช้ block day'],
  ['betong-first-timer-guide','itinerary','มาเบตงครั้งแรกต้องรู้อะไร เส้นทางขับขึ้นเบตง + แผนแนะนำ ใช้ block day/list'],
  ['yala-city-walk-plan','itinerary','แผนเดินเล่นเมืองยะลา ผังวงกลม-ศาลหลักเมือง-คาเฟ่-ตลาด ใช้ block day'],
]
const PREP = [
  ['yala-travel-tips','prep','เตรียมตัวเที่ยวยะลา-เบตง (ช่วงเวลาดีสุด พ.ย.-ก.พ.หมอกหนา การขับรถขึ้นเบตงทางโค้งเขา การแต่งกายเมืองมุสลิม งบ + แนะนำให้เช็กข่าวสารและประกาศด้านความปลอดภัย/สถานการณ์ชายแดนใต้ก่อนเดินทางจริงทุกครั้ง)'],
  ['yala-getting-around','prep','การเดินทางในยะลา-เบตง (รถไฟ/รถทัวร์กรุงเทพ-ยะลา สนามบินเบตง เช่ารถขับขึ้นเบตงทางโค้ง ระยะทางยะลา-เบตง-หาดใหญ่ จุดเติมน้ำมัน)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวยะลา/เบตง ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="yala", crumbCity="ยะลา", crumbCityHref="city-yala.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- ⚠️ ยะลาเป็นพื้นที่ชายแดนใต้ ให้เขียนแบบ honesty: แนะนำให้ผู้อ่านเช็กข่าวสาร/ประกาศด้านความปลอดภัยและสถานการณ์ล่าสุดก่อนเดินทางจริง (ใส่เป็น tip/หมายเหตุอย่างสุภาพตามบริบท ไม่ต้องตื่นตระหนก) · เบตงเป็นเมืองท่องเที่ยวที่คนไปเที่ยวเยอะ เน้นเส้นทางขับรถทางโค้งเขาและช่วงหมอก · เคารพวัฒนธรรมมุสลิม-มลายูและจีนฮกเกี้ยน
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-yala.html และ top10-hotels-yala.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

const existing = new Set(args && args.existingArticles ? args.existingArticles : [])

let done = []
for (const group of [['Food',FOOD],['See',SEE],['Plan',PLAN],['Prep',PREP]]) {
  const [ph, fullList] = group
  const list = fullList.filter(([slug]) => !existing.has(slug))
  const ref = ph==='Food' ? 'tourlogy-food-writer' : 'tourlogy-attraction-writer'
  if (!list.length) { log(`Phase ${ph}: all ${fullList.length} already exist — skip`); continue }
  log(`Phase ${ph}: ${list.length} articles (skipped ${fullList.length-list.length} existing)`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,ref), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Articles written: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

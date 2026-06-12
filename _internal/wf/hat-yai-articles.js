export const meta = {
  name: 'hat-yai-articles',
  description: 'Hat Yai (หาดใหญ่) destination — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (fried chicken, dim sum, chicken rice, southern)' },
    { title: 'See', detail: '12 attraction articles (cable car park, Kim Yong, Khlong Hae, Ton Nga Chang)' },
    { title: 'Plan', detail: '12 itineraries (food crawl, shopping, mu temples, Songkhla)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['hat-yai-fried-chicken','eat-ranking','จัดอันดับร้านไก่ทอดหาดใหญ่ หนังกรอบโรยหอมเจียว ที่คนท้องถิ่นและนักท่องเที่ยวไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['hat-yai-dim-sum','eat-ranking','ร้านติ่มซำหาดใหญ่ มื้อเช้าฮะเก๋า ขนมจีบ ซาลาเปา น้ำชาจีน ร้านดังเปิดเช้า คนต่อคิว'],
  ['hat-yai-chicken-rice','eat-ranking','ข้าวมันไก่และข้าวหมูแดงหาดใหญ่ ร้านเก่าแก่ มื้อกลางวันยอดนิยม ร้านเด็ด'],
  ['hat-yai-southern-food','eat-ranking','ร้านอาหารใต้รสจัดหาดใหญ่ แกงไตปลา คั่วกลิ้ง ข้าวยำ ที่คนท้องถิ่นไป เมนูเด็ด'],
  ['hat-yai-chinese-food','eat-ranking','ร้านอาหารจีนและโต๊ะจีนหาดใหญ่ เป็ดย่าง หมูกรอบ ซีฟู้ดสไตล์จีนใต้ ร้านเก่าแก่'],
  ['hat-yai-cafe-guide','eat-ranking','คาเฟ่หาดใหญ่ ในเมืองและย่านมหาวิทยาลัย กาแฟดี บรันช์ ถ่ายรูป นั่งทำงาน'],
  ['hat-yai-night-market-food','food','สตรีทฟู้ดและตลาดกลางคืนหาดใหญ่ กรีนเวย์ ลีการ์เดนส์ อาเซียนไนท์ ของย่าง ของทอด ขนม'],
  ['hat-yai-seafood','eat-ranking','ร้านซีฟู้ดหาดใหญ่ กุ้ง หอย ปู ปลา เผา นึ่ง ผัดผงกะหรี่ ต้มยำ ร้านเด็ด ราคาคุ้ม'],
  ['hat-yai-local-breakfast','food','อาหารเช้าแบบคนหาดใหญ่ (ติ่มซำ ข้าวมันไก่ โจ๊ก กาแฟโบราณ ตลาดเช้า)'],
  ['hat-yai-souvenir-food','food','ของฝากกินได้หาดใหญ่ (ปลาหมึกแห้ง ปลาหมึกปิ้ง ขนมเปี๊ยะ เม็ดมะม่วง ของนำเข้ากิมหยง แหล่งซื้อ)'],
  ['hat-yai-dessert-sweets','food','ของหวานและขนมหาดใหญ่ ขนมจีนใต้ เฉาก๊วย น้ำแข็งไส ของหวานกะทิ ร้านเด็ด'],
]
const SEE = [
  ['hat-yai-attractions','attraction','รวมที่เที่ยวหาดใหญ่ที่ต้องไป คละสวนสาธารณะเคเบิลคาร์/ตลาดกิมหยง/ตลาดน้ำคลองแห/วัดพระนอน/โตนงาช้าง (ภาพรวม + cards)'],
  ['hat-yai-municipal-park-cable-car','attraction','สวนสาธารณะหาดใหญ่และเคเบิลคาร์ ขึ้นเขาไหว้พระพุทธมงคลมหาราช ท้าวมหาพรหม เจ้าแม่กวนอิมองค์ใหญ่ ชมวิวเมือง เวลา/ค่าโดยสาร'],
  ['kim-yong-market','attraction','ตลาดกิมหยงและสันติสุขหาดใหญ่ ตลาดของกินของใช้นำเข้ากลางเมือง ขนม ปลาหมึก ของฝาก เทคนิคต่อรอง เวลาเปิด'],
  ['khlong-hae-floating-market','attraction','ตลาดน้ำคลองแหหาดใหญ่ ตลาดน้ำพายเรือขายอาหารใต้ริมคลอง เปิดศุกร์-อาทิตย์ ของกินถิ่น บรรยากาศ'],
  ['wat-hat-yai-nai','attraction','วัดหาดใหญ่ใน พระนอนองค์ใหญ่ยาวที่สุดแห่งหนึ่งของภาคใต้ จุดไหว้พระชมพุทธศิลป์ใกล้เมือง การเดินทาง'],
  ['ton-nga-chang-waterfall','attraction','น้ำตกโตนงาช้างหาดใหญ่ น้ำตกหลายชั้นในป่าเทือกเขาแก้ว น้ำใสเย็น เดินป่าสั้น เล่นน้ำ จุดธรรมชาติใกล้เมือง'],
  ['hat-yai-asean-night-bazaar','attraction','อาเซียนไนท์บาซาร์และกรีนเวย์หาดใหญ่ ตลาดกลางคืนย่านลีการ์เดนส์ สตรีทฟู้ด ของช้อป เปิดยาวจนดึก'],
  ['hat-yai-shopping-guide','attraction','ช้อปปิ้งหาดใหญ่ ห้างเซ็นทรัล ลีการ์เดนส์ ตลาดกิมหยง-สันติสุข ย่านนิพัทธ์อุทิศ ของน่าซื้อและของฝาก'],
  ['hat-yai-shrines-mu','attraction','สายมูหาดใหญ่ ศาลเจ้าแม่กวนอิม ท้าวมหาพรหม ศาลเจ้าจีนเก่า และวัดในเมือง เส้นทางขอพรของคนหาดใหญ่'],
  ['hat-yai-street-art-museums','attraction','สตรีทอาร์ตและพิพิธภัณฑ์ในเมืองหาดใหญ่ มิวเซียมภาพ 3 มิติ มุมถ่ายรูป เดินเล่นระหว่างวันก่อนกินก่อนช้อป'],
  ['songkhla-old-town-trip','attraction','เมืองเก่าสงขลาทริปจากหาดใหญ่ ตึกชิโน-โปรตุกีส ถนนนางงาม สตรีทอาร์ต ขับ 30 นาทีจากหาดใหญ่'],
  ['samila-beach-trip','attraction','หาดสมิหลาและนางเงือกทองสงขลา ทริปจากหาดใหญ่ หาดทราย รูปปั้นนางเงือก แมว-หนูเกาะหนู-เกาะแมว ชมพระอาทิตย์ตก'],
]
const PLAN = [
  ['hat-yai-1-day-itinerary','itinerary','แผนเที่ยวหาดใหญ่ 1 วัน สวนสาธารณะเคเบิลคาร์-กิมหยง-กินไก่ทอด ใช้ block day'],
  ['hat-yai-2d1n-itinerary','itinerary','แผนหาดใหญ่ 2 วัน 1 คืน กิน-ช้อป-สวนสาธารณะ-ตลาดน้ำคลองแห ใช้ block day'],
  ['hat-yai-3d2n-itinerary','itinerary','แผนหาดใหญ่ 3 วัน 2 คืน หาดใหญ่+สงขลาเมืองเก่า+โตนงาช้าง ใช้ block day'],
  ['hat-yai-food-crawl-plan','itinerary','แผนสายกินหาดใหญ่ ติ่มซำเช้า-ข้าวมันไก่-ไก่ทอด-ตลาดกลางคืน ใช้ block day'],
  ['hat-yai-shopping-plan','itinerary','แผนสายช้อปและของฝาก กิมหยง-สันติสุข-ห้าง-อาเซียนไนท์ ใช้ block day'],
  ['hat-yai-mu-temple-plan','itinerary','แผนสายมู เจ้าแม่กวนอิมสวนสาธารณะ-ศาลเจ้า-วัดพระนอน ขอพรหาดใหญ่ ใช้ block day'],
  ['hat-yai-songkhla-plan','itinerary','แผนหาดใหญ่-สงขลา เมืองเก่าชิโน-หาดสมิหลา-ย่านถนนนางงาม ใช้ block day'],
  ['hat-yai-nature-waterfall-plan','itinerary','แผนสายธรรมชาติ น้ำตกโตนงาช้าง-เขาคอหงส์ ทริปครึ่งวันจากเมือง ใช้ block day'],
  ['hat-yai-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เคเบิลคาร์ ตลาดน้ำ มิวเซียม 3 มิติ น้ำตก) ใช้ block day'],
  ['hat-yai-malaysia-shopper-plan','itinerary','แผนสำหรับนักช้อปข้ามแดน หาดใหญ่ฐานช้อป-กิน เส้นทางจากด่านสะเดา/ปาดังเบซาร์ ใช้ block day'],
  ['hat-yai-nightlife-plan','itinerary','แผนกลางคืนหาดใหญ่ ลีการ์เดนส์-กรีนเวย์-ย่านกินดื่ม (เที่ยวอย่างปลอดภัย) ใช้ block day'],
  ['hat-yai-first-timer-guide','itinerary','มาหาดใหญ่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['hat-yai-travel-tips','prep','เตรียมตัวเที่ยวหาดใหญ่ (ช่วงเวลาดีสุด เลี่ยงฝนพ.ย.-ธ.ค. ตลาดน้ำคลองแหเปิดศุกร์-อาทิตย์ การต่อรองตลาด เงินริงกิต งบ)'],
  ['hat-yai-getting-around','prep','การเดินทางไป-รอบหาดใหญ่ (สนามบินหาดใหญ่ รถไฟสายใต้ รถทัวร์/รถตู้ สองแถว แท็กซี่ ข้ามแดนสะเดา-ปาดังเบซาร์ ไปสงขลายังไง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวหาดใหญ่ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="hat-yai", crumbCity="หาดใหญ่", crumbCityHref="city-hat-yai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-hat-yai.html และ top10-hotels-hat-yai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

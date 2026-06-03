export const meta = {
  name: 'bangkok-articles',
  description: 'Bangkok gold template — food / attractions / itineraries / prep (38 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '12 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + city + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['bangkok-food-guide','food','รวมของกินกรุงเทพต้องลอง ภาพรวมย่านอาหาร/เมนูเด็ด (overview + cards) ลิงก์ไปบทความอาหารย่อย'],
  ['bangkok-street-food-yaowarat','eat-ranking','จัดอันดับสตรีทฟู้ดเยาวราช (ไชน่าทาวน์) ร้านจริงที่คนไปจริง พร้อมเมนู/ราคา/เวลาเปิด'],
  ['bangkok-cafe-guide','eat-ranking','จัดอันดับคาเฟ่กรุงเทพ คละเจริญกรุง/อารีย์/ทองหล่อ-เอกมัย ร้านกาแฟพิเศษ บรรยากาศ'],
  ['bangkok-boat-noodles','eat-ranking','จัดอันดับก๋วยเตี๋ยวเรือ/ก๋วยเตี๋ยวเด็ดในกรุงเทพ ร้านจริง รสเข้ม'],
  ['bangkok-michelin-fine-dining','eat-ranking','ร้านมิชลิน/ไฟน์ไดนิ่งกรุงเทพ มื้อพิเศษโอกาสสำคัญ (รวมร้าน street food มิชลินด้วย)'],
  ['bangkok-rooftop-bars','eat-ranking','จัดอันดับรูฟท็อปบาร์กรุงเทพ วิวแม่น้ำ/สกายไลน์ พร้อมโซน/ช่วงราคา/ดนตรี'],
  ['bangkok-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างกรุงเทพ ร้านยอดนิยม คุ้มราคา'],
  ['bangkok-khao-gaeng','food','ข้าวแกง/ข้าวราดแกงกรุงเทพ ร้านในตำนานและร้านเด็ดตามย่าน มื้อกลางวันคนทำงาน'],
  ['bangkok-dessert-bakery','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมกรุงเทพ ร้านดังถ่ายรูปสวย'],
  ['bangkok-seafood','eat-ranking','ร้านอาหารทะเล/ซีฟู้ดกรุงเทพ ตั้งแต่ร้านริมทางถึงร้านใหญ่'],
  ['bangkok-local-breakfast','food','อาหารเช้าแบบคนกรุงเทพ (โจ๊ก ข้าวต้ม ปาท่องโก๋ กาแฟโบราณ ติ่มซำ ตลาดเช้า)'],
  ['bangkok-night-market-food','food','ตลาดนัด/ตลาดกลางคืนกรุงเทพ ของกินเดินชิม (จ๊อดแฟร์ ตลาดนัดรถไฟ ฯลฯ)'],
]
const SEE = [
  ['bangkok-attractions','attraction','รวมที่เที่ยวกรุงเทพที่ต้องไป คละวัฒนธรรม/เมือง/ธรรมชาติ (ภาพรวม + cards)'],
  ['grand-palace-wat-phra-kaew-guide','attraction','พระบรมมหาราชวัง + วัดพระแก้ว ครบ (การเดินทาง เวลา ค่าเข้า การแต่งกาย จุดถ่ายรูป)'],
  ['wat-arun-guide','attraction','วัดอรุณราชวราราม (พระปรางค์ริมเจ้าพระยา การเดินทาง เวลา จุดถ่ายรูปข้ามฝั่ง)'],
  ['wat-pho-guide','attraction','วัดโพธิ์ (พระนอน นวดแผนไทย เวลา ค่าเข้า เดินต่อจากพระบรมมหาราชวัง)'],
  ['rattanakosin-old-town','attraction','เกาะรัตนโกสินทร์ เดินเที่ยวเมืองเก่าริมเจ้าพระยา (วัด ถนนข้าวสาร ป้อม พิพิธภัณฑ์)'],
  ['chatuchak-market-guide','attraction','ตลาดนัดจตุจักร เดินช้อปครบ (โซน เวลา การเดินทาง ของกิน ทริค)'],
  ['chao-phraya-river-guide','attraction','ล่องเรือเจ้าพระยา เรือด่วน/เรือข้ามฟาก/ดินเนอร์ครูซ ท่าเรือสำคัญ'],
  ['charoenkrung-talat-noi','attraction','เจริญกรุง–ตลาดน้อย ย่านคาเฟ่ แกลเลอรี สตรีทอาร์ต ตึกเก่า'],
  ['siam-ratchaprasong-shopping','attraction','สยาม–ราชประสงค์ ย่านห้างใหญ่ใจกลางเมือง สกายวอล์ก ศาลพระพรหมเอราวัณ'],
  ['lumpini-park-guide','attraction','สวนลุมพินี สวนกลางเมือง ลู่วิ่ง ทะเลสาบ พายเรือ ตัวเงินตัวทอง'],
  ['bang-krachao-guide','attraction','บางกระเจ้า ปอดสีเขียวริมเจ้าพระยา ปั่นจักรยาน ตลาดน้ำบางน้ำผึ้ง'],
  ['bangkok-floating-markets','attraction','ตลาดน้ำรอบกรุงเทพ (ตลิ่งชัน คลองลัดมะยม ฯลฯ) เที่ยวสายน้ำ'],
]
const PLAN = [
  ['bangkok-1-day-itinerary','itinerary','แผนเที่ยวกรุงเทพ 1 วัน เมืองเก่า–เยาวราช หรือ สยาม–รูฟท็อป ใช้ block day'],
  ['bangkok-2d1n-itinerary','itinerary','แผนกรุงเทพ 2 วัน 1 คืน วัดเก่า+ช้อปปิง+สตรีทฟู้ด ใช้ block day'],
  ['bangkok-3d2n-itinerary','itinerary','แผนกรุงเทพ 3 วัน 2 คืน เมืองเก่า+คาเฟ่+ตลาด+รูฟท็อป ใช้ block day'],
  ['bangkok-cafe-hopping-plan','itinerary','แผนสายคาเฟ่ ตะลุยร้านกาแฟเจริญกรุง/อารีย์/ทองหล่อ ใช้ block day'],
  ['bangkok-old-town-temples-plan','itinerary','แผนสายวัด/เมืองเก่า เกาะรัตนโกสินทร์ พระบรมมหาราชวัง–วัดโพธิ์–วัดอรุณ ใช้ block day'],
  ['bangkok-shopping-plan','itinerary','แผนสายช้อปปิง สยาม–ราชประสงค์–จตุจักร–ตลาดนัด ใช้ block day'],
  ['bangkok-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (วัด คาเฟ่ สตรีทอาร์ต รูฟท็อป) ใช้ block day'],
  ['bangkok-nature-green-plan','itinerary','แผนสายสีเขียว สวนลุม–บางกระเจ้า–ตลาดน้ำ ใช้ block day'],
  ['bangkok-ayutthaya-day-trip','itinerary','แผนข้ามจังหวัด กรุงเทพ–อยุธยา ไป-กลับ 1 วัน (รถไฟ/รถตู้/เรือ) ใช้ block day'],
  ['bangkok-samut-songkhram-plan','itinerary','แผนข้ามจังหวัด กรุงเทพ–สมุทรสงคราม อัมพวา ตลาดน้ำ–ตลาดร่มหุบ ใช้ block day'],
  ['bangkok-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ซาฟารี ซีไลฟ์ สวนสัตว์ พิพิธภัณฑ์เด็ก) ใช้ block day'],
  ['bangkok-first-timer-guide','itinerary','มากรุงเทพครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['bangkok-travel-tips','prep','เตรียมตัวเที่ยวกรุงเทพ (ช่วงเวลาดีสุด หน้าฝน/รถติด งบ การแต่งตัวเข้าวัด ซิม ความปลอดภัย/แท็กซี่)'],
  ['bangkok-getting-around','prep','การเดินทางในกรุงเทพ (BTS/MRT/ARL เรือเจ้าพระยา-คลองแสนแสบ แท็กซี่/แกร็บ ตุ๊กตุ๊ก สนามบิน BKK/DMK)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวกรุงเทพลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="bangkok", crumbCity="กรุงเทพ", crumbCityHref="city-bangkok.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-bangkok.html และ top10-hotels-bangkok.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

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

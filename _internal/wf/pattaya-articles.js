export const meta = {
  name: 'pattaya-articles',
  description: 'Pattaya (พัทยา) destination — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (seafood, cafe, rooftop, market, korean-japanese)' },
    { title: 'See', detail: '12 attraction articles (jomtien, sanctuary, nongnooch, khao chi chan)' },
    { title: 'Plan', detail: '12 itineraries (2D1N, 3D2N, bangkok, koh-larn, family)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['pattaya-food-guide','food','รวมของกินพัทยาที่ต้องลอง อาหารทะเล บุฟเฟต์ คาเฟ่ ตลาดกลางคืน (ภาพรวม + ย่าน/ราคา)'],
  ['pattaya-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลพัทยา-นาเกลือ กุ้ง หอย ปู ปลาสด ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['pattaya-cafe-guide','eat-ranking','คาเฟ่พัทยา-จอมเทียน-พระตำหนัก กาแฟดี วิวทะเล นั่งชิลถ่ายรูป'],
  ['pattaya-rooftop-bars','eat-ranking','รูฟท็อปบาร์พัทยา วิวอ่าวพัทยา-จอมเทียน นั่งดื่มชมพระอาทิตย์ตก (เที่ยวอย่างมีสติ)'],
  ['pattaya-night-market','food','ตลาดกลางคืนพัทยา เทพประสิทธิ์ ตลาดนัด สตรีทฟู้ด ของย่าง ของกินเล่น ราคาเป็นกันเอง'],
  ['pattaya-street-food','eat-ranking','สตรีทฟู้ดพัทยา ก๋วยเตี๋ยว ของย่าง ของทอด ในตรอกซอกซอยที่คนท้องถิ่นกิน'],
  ['pattaya-buffet-restaurants','eat-ranking','บุฟเฟต์พัทยา ซีฟู้ด ปิ้งย่าง โรงแรม ราคาคุ้ม ที่คนรีวิวจริง'],
  ['pattaya-vegan-healthy','eat-ranking','ร้านวีแกน/อาหารสุขภาพพัทยา สมูทตี้โบวล์ อาหารคลีน รองรับสายเวลเนส'],
  ['pattaya-korean-japanese-food','eat-ranking','ร้านอาหารเกาหลี-ญี่ปุ่นพัทยา ปิ้งย่าง ราเมน ซูชิ ระดับดีย่านเซ็นทรัล-จอมเทียน'],
  ['pattaya-local-thai-food','eat-ranking','ร้านอาหารไทยถิ่นพัทยา ตามสั่ง ข้าวแกง รสจัด ราคาคนท้องถิ่น'],
  ['pattaya-dessert-cafe','food','ของหวานและคาเฟ่ขนมพัทยา เบเกอรี ไอศกรีม ขนมไทย ร้านนั่งชิล'],
]
const SEE = [
  ['pattaya-attractions','attraction','รวมที่เที่ยวพัทยาที่ต้องไป ปราสาทสัจธรรม-สวนนงนุช-เขาชีจรรย์-เกาะล้าน-วอล์กกิ้งสตรีท (ภาพรวม + cards)'],
  ['pattaya-jomtien-beach','attraction','หาดจอมเทียนพัทยา หาดทรายยาวเงียบเป็นครอบครัว ร้านริมหาด กีฬาทางน้ำ ที่พักติดทะเล'],
  ['pattaya-sanctuary-of-truth','attraction','ปราสาทสัจธรรมพัทยา ปราสาทไม้แกะสลักทั้งหลังริมทะเลนาเกลือ งานไม้ฝีมือช่าง แลนด์มาร์กถ่ายรูป'],
  ['pattaya-nong-nooch-garden','attraction','สวนนงนุชพัทยา สวนพฤกษศาสตร์ใหญ่ จัดสวนหลายสไตล์ หุบเขาไดโนเสาร์ โชว์ช้าง-วัฒนธรรมไทย'],
  ['pattaya-khao-chi-chan','attraction','เขาชีจรรย์ พระพุทธรูปแกะสลักเลเซอร์บนหน้าผาหินขนาดใหญ่ จุดกราบไหว้และถ่ายรูป ทางพัทยา-สัตหีบ'],
  ['pattaya-big-buddha','attraction','พระใหญ่เขาพระตำหนักพัทยา ขึ้นกราบพระและชมวิวอ่าวพัทยา ใกล้จุดชมวิวพระตำหนัก'],
  ['pattaya-pratamnak-viewpoint','attraction','จุดชมวิวเขาพระตำหนักพัทยา มองเห็นอ่าวพัทยา-จอมเทียน-เกาะล้าน จุดถ่ายรูปเช็กอินยอดนิยม'],
  ['pattaya-walking-street','attraction','วอล์กกิ้งสตรีทพัทยา ถนนสายกลางคืนคึกคัก บาร์ ผับ ร้านอาหาร ไฟนีออน เที่ยวอย่างมีสติ ระวังของมีค่า'],
  ['pattaya-art-in-paradise','attraction','อาร์ตอินพาราไดซ์พัทยา พิพิธภัณฑ์ภาพวาดสามมิติ ถ่ายรูปสนุก เหมาะครอบครัวและวันฝนตก'],
  ['pattaya-tiffany-cabaret-show','attraction','โชว์คาบาเรต์พัทยา ทิฟฟานี-อัลคาซาร์ โชว์เต้นแสงสีระดับมืออาชีพ บันเทิงครอบครัวยามค่ำ'],
  ['pattaya-water-parks','attraction','สวนน้ำพัทยา การ์ตูนเน็ตเวิร์ก-รามายณะ-โฟรสต์ เครื่องเล่นทางน้ำ เหมาะครอบครัวและเด็ก'],
  ['pattaya-temples-culture','attraction','วัดและวัฒนธรรมพัทยา-สัตหีบ วัดญาณสังวราราม เขาชีจรรย์ พระใหญ่ เส้นทางไหว้พระชมพุทธศิลป์'],
]
const PLAN = [
  ['pattaya-1-day-itinerary','itinerary','แผนเที่ยวพัทยา 1 วัน ปราสาทสัจธรรม-พระตำหนัก-หาดจอมเทียน ใช้ block day'],
  ['pattaya-2d1n-itinerary','itinerary','แผนพัทยา 2 วัน 1 คืน หาด-ปราสาทสัจธรรม-วอล์กกิ้งสตรีท ใช้ block day'],
  ['pattaya-3d2n-itinerary','itinerary','แผนพัทยา 3 วัน 2 คืน ครบสวนนงนุช-เขาชีจรรย์-เกาะล้าน ใช้ block day'],
  ['pattaya-bangkok-plan','itinerary','แผนกรุงเทพ-พัทยา ไปเช้ากลับเย็น/ค้างคืน เที่ยวทะเลใกล้เมือง ใช้ block day'],
  ['pattaya-koh-larn-day-trip','itinerary','แผนพัทยา-เกาะล้าน นั่งเรือเที่ยวทะเลใสในวันเดียว หาดตาแหวน-แสม-นวล ใช้ block day'],
  ['pattaya-family-plan','itinerary','แผนพัทยาสายครอบครัว สวนน้ำ-สวนนงนุช-โชว์-หาด ใช้ block day'],
  ['pattaya-couple-plan','itinerary','แผนพัทยาสายคู่รัก รูฟท็อปบาร์-ดินเนอร์ริมทะเล-ชมพระอาทิตย์ตก ใช้ block day'],
  ['pattaya-nightlife-plan','itinerary','แผนกลางคืนพัทยา วอล์กกิ้งสตรีท บาร์ริมหาด (เที่ยวอย่างมีสติ ระวังของมีค่า) ใช้ block day'],
  ['pattaya-budget-plan','itinerary','แผนงบประหยัดพัทยา ของกินถูก หาดฟรี เที่ยวคุ้ม ใช้ block day'],
  ['pattaya-photo-spots-plan','itinerary','แผนสายถ่ายรูปพัทยา ปราสาทสัจธรรม-จุดชมวิวพระตำหนัก-อาร์ตอินพาราไดซ์ ใช้ block day'],
  ['pattaya-first-timer-guide','itinerary','มาพัทยาครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
  ['pattaya-rainy-day-plan','itinerary','แผนพัทยาวันฝนตก เที่ยวในร่ม ห้าง-อาร์ตอินพาราไดซ์-โชว์-สวนน้ำในร่ม ใช้ block day'],
]
const PREP = [
  ['pattaya-travel-tips','prep','เตรียมตัวเที่ยวพัทยา (ช่วงเวลาดีสุด พ.ย.-ก.พ. การจองไฮซีซั่น/วันหยุดยาว ความปลอดภัยกลางคืน ระวังของมีค่า งบ)'],
  ['pattaya-getting-around','prep','การเดินทางไป-รอบพัทยา (รถตู้/รถทัวร์จากกรุงเทพ สนามบินอู่ตะเภา รถสองแถวรอบเมือง เรือไปเกาะล้าน เช่ารถ/มอเตอร์ไซค์)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพัทยา (จ.ชลบุรี) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="pattaya", crumbCity="พัทยา", crumbCityHref="city-pattaya.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: พัทยามีย่านสถานบันเทิงกลางคืน เตือนเที่ยวอย่างมีสติและระวังของมีค่า · เรื่องเรือไปเกาะล้านเตือนเช็กสภาพอากาศ · ราคาห้อง/ทัวร์สวิงตามฤดู-วันหยุด บอกตรง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-pattaya.html และ top10-hotels-pattaya.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

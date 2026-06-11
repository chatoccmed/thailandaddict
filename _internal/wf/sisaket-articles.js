export const meta = {
  name: 'sisaket-articles',
  description: 'Sisaket (ศรีสะเกษ) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (volcanic durian + Khmer temples + border)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['sisaket-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานใต้ศรีสะเกษ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['sisaket-volcanic-durian','eat-ranking','ทุเรียนภูเขาไฟศรีสะเกษ สวนทุเรียนกันทรลักษ์-ขุนหาญ ชิมถึงสวน ช่วงเวลา ราคา จุดเด่นรสชาติ'],
  ['sisaket-khanom-jeen','eat-ranking','ขนมจีนประโดกและน้ำยาเครื่องแกงศรีสะเกษ ร้านเด็ด มื้อเช้ายอดฮิต ผักสดกองโต'],
  ['sisaket-mookata','eat-ranking','หมูกระทะและปิ้งย่างศรีสะเกษ ร้านยอดนิยม คุ้มราคา'],
  ['sisaket-cafe-guide','eat-ranking','คาเฟ่ศรีสะเกษ ในเมือง นั่งชิล กาแฟดี ถ่ายรูป'],
  ['sisaket-shallot-garlic','food','หอมแดงและกระเทียมศรีสะเกษ ของขึ้นชื่อ หอมเจียวกรอบ ของฝาก แหล่งซื้อ'],
  ['sisaket-street-food','food','สตรีทฟู้ดและตลาดเย็นศรีสะเกษ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['sisaket-local-breakfast','food','อาหารเช้าแบบคนศรีสะเกษ (ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['sisaket-jasmine-rice','food','ข้าวหอมมะลิทุ่งกุลาศรีสะเกษ ของฝากคุณภาพ แหล่งซื้อ จุดเด่นของข้าว'],
  ['sisaket-souvenir-food','food','ของฝากกินได้ศรีสะเกษ (ปลาส้ม แหนม หอมแดง ข้าวหอมมะลิ ทุเรียนกวน แหล่งซื้อ)'],
  ['sisaket-local-dessert','food','ของหวานและขนมพื้นถิ่นศรีสะเกษ ขนมอีสาน ทุเรียนแปรรูป ของกินเล่นตามตลาด'],
]
const SEE = [
  ['sisaket-attractions','attraction','รวมที่เที่ยวศรีสะเกษที่ต้องไป คละทุเรียนภูเขาไฟ/ปราสาทขอม/ผามออีแดง/วัด/ธรรมชาติ (ภาพรวม + cards)'],
  ['pha-mo-e-daeng','attraction','ผามออีแดง ผาหินริมชายแดนกันทรลักษ์ จุดชมวิวมองเห็นกัมพูชา ภาพสลักนูนต่ำโบราณ เส้นทางสู่เขาพระวิหาร'],
  ['khao-phra-wihan-national-park','attraction','อุทยานแห่งชาติเขาพระวิหาร น้ำตก สถูปคู่ เส้นทางเดินป่า ชายแดน — เช็กสถานการณ์ชายแดนก่อนไปจริง'],
  ['prasat-sa-kamphaeng-yai','attraction','ปราสาทสระกำแพงใหญ่ ปราสาทขอมที่สมบูรณ์ที่สุดของศรีสะเกษ อุทุมพรพิสัย ปรางค์อิฐ ทับหลังสลัก'],
  ['prasat-ban-prasat-sisaket','attraction','ปราสาทบ้านปราสาท ห้วยทับทัน ปราสาทขอมหินทรายขนาดเล็กกลางชุมชน ร่องรอยศิลปะขอม'],
  ['wat-lan-khuat','attraction','วัดล้านขวด (วัดป่ามหาเจดีย์แก้ว) ขุนหาญ ตกแต่งด้วยขวดแก้วเก่านับล้าน จุดถ่ายรูป'],
  ['wat-phra-that-rueang-rong','attraction','วัดพระธาตุเรืองรอง พระธาตุสถาปัตยกรรมผสมสี่เผ่า ลาว-เขมร-ส่วย-เยอ สะท้อนวิถีศรีสะเกษ'],
  ['volcanic-durian-orchard','attraction','สวนทุเรียนภูเขาไฟกันทรลักษ์-ขุนหาญ เปิดให้เข้าชิมถึงสวนหน้าผลไม้ ดูต้นทุเรียนบนดินภูเขาไฟ'],
  ['huai-nam-kham-island','attraction','เกาะกลางน้ำห้วยน้ำคำ สวนสาธารณะกลางเมือง ศาลหลักเมือง ที่พักผ่อนออกกำลังกาย'],
  ['sisaket-khmer-temple-trail','attraction','เส้นทางปราสาทขอมศรีสะเกษ สระกำแพงใหญ่-บ้านปราสาท เที่ยวประวัติศาสตร์อีสานใต้'],
  ['kantharalak-durian-route','attraction','เส้นทางกันทรลักษ์-ขุนหาญ สายทุเรียนภูเขาไฟและธรรมชาติชายแดน จุดแวะ สวน วิว'],
  ['sisaket-four-tribes-culture','attraction','วิถีสี่เผ่าศรีสะเกษ ลาว เขมร ส่วย เยอ วัฒนธรรม ภาษา อาหาร งานประเพณี'],
]
const PLAN = [
  ['sisaket-1-day-itinerary','itinerary','แผนเที่ยวศรีสะเกษ 1 วัน เมือง-วัดล้านขวด หรือ ปราสาทสระกำแพงใหญ่วันเดียว ใช้ block day'],
  ['sisaket-2d1n-itinerary','itinerary','แผนศรีสะเกษ 2 วัน 1 คืน เมือง-ปราสาทขอม-วัดสี่เผ่า ใช้ block day'],
  ['sisaket-3d2n-itinerary','itinerary','แผนศรีสะเกษ 3 วัน 2 คืน เมือง+ปราสาท+ผามออีแดง+ทุเรียน ใช้ block day'],
  ['sisaket-khmer-temple-plan','itinerary','แผนสายปราสาทขอม สระกำแพงใหญ่-บ้านปราสาท-วัด ใช้ block day'],
  ['sisaket-nature-plan','itinerary','แผนสายธรรมชาติ ผามออีแดง-เขาพระวิหาร (เช็กชายแดน) ใช้ block day'],
  ['sisaket-durian-season-plan','itinerary','แผนทริปกินทุเรียนภูเขาไฟหน้าผลไม้ มิ.ย.-ก.ค. สวนกันทรลักษ์-ขุนหาญ ใช้ block day'],
  ['sisaket-culture-plan','itinerary','แผนสายวัฒนธรรม ปราสาทขอม-วัดสี่เผ่า-วัดล้านขวด ใช้ block day'],
  ['sisaket-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (วัดล้านขวด ผามออีแดง ปราสาท สวนทุเรียน) ใช้ block day'],
  ['sisaket-ubon-plan','itinerary','แผนข้ามจังหวัด ศรีสะเกษ–อุบลราชธานี เส้นทางอีสานใต้ชายแดน ใช้ block day'],
  ['sisaket-surin-plan','itinerary','แผนข้ามจังหวัด ศรีสะเกษ–สุรินทร์ ตามรอยปราสาทขอม ใช้ block day'],
  ['sisaket-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (วัดล้านขวด ห้วยน้ำคำ สวนทุเรียน คาเฟ่) ใช้ block day'],
  ['sisaket-first-timer-guide','itinerary','มาศรีสะเกษครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['sisaket-travel-tips','prep','เตรียมตัวเที่ยวศรีสะเกษ (ช่วงเวลาดีสุด หน้าทุเรียนภูเขาไฟมิ.ย.-ก.ค. สถานการณ์ชายแดนเขาพระวิหาร อากาศ งบ การแต่งตัว)'],
  ['sisaket-getting-around','prep','การเดินทางในศรีสะเกษ (รถไฟสายอีสานใต้/บขส. เช่ารถ ไปกันทรลักษ์-ผามออีแดงยังไง ระยะทางจากกรุงเทพ-อุบล)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวศรีสะเกษ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="sisaket", crumbCity="ศรีสะเกษ", crumbCityHref="city-sisaket.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง · ถ้าพูดถึงชายแดนเขาพระวิหาร/ผามออีแดง ให้บอกตรงว่าควรเช็กสถานการณ์ก่อนไป
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-sisaket.html และ top10-hotels-sisaket.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

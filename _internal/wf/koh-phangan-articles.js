export const meta = {
  name: 'koh-phangan-articles',
  description: 'Koh Phangan (เกาะพะงัน) destination — food / attractions / itineraries / prep (30 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles (seafood, wellness/vegan, beach bars, market)' },
    { title: 'See', detail: '10 attraction articles (Haad Rin, Than Sadet, Bottle Beach, Koh Ma)' },
    { title: 'Plan', detail: '9 itineraries (full moon, wellness, quiet north, island hopping)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-phangan-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะพะงัน กุ้ง หอย ปู ปลาสดริมหาด ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['koh-phangan-cafe-guide','eat-ranking','คาเฟ่และบรันช์เกาะพะงัน ฝั่งศรีธนู-ท้องศาลา กาแฟดี วิวทะเล ถ่ายรูป'],
  ['koh-phangan-vegan-health','eat-ranking','ร้านวีแกน/อาหารสุขภาพเกาะพะงัน ย่านศรีธนูเวลเนส สมูทตี้โบวล์ อาหารคลีน ร้านเด็ด'],
  ['koh-phangan-beach-bars','food','บีชบาร์และบาร์ริมหาดเกาะพะงัน หาดริ้นและรอบเกาะ ดนตรีสด ค็อกเทล บรรยากาศปาร์ตี้ (ดื่มอย่างมีสติ)'],
  ['koh-phangan-thong-sala-market','food','ตลาดโต้รุ่งท้องศาลาเกาะพะงัน (Phantip Market) สตรีทฟู้ดไทย-ใต้ ของย่าง ของหวาน ราคาท้องถิ่น'],
  ['koh-phangan-southern-food','eat-ranking','ร้านอาหารใต้รสจัดเกาะพะงัน แกงไตปลา ผัดสะตอ ข้าวยำ ร้านท้องถิ่นที่คนเกาะไป'],
  ['koh-phangan-international-food','eat-ranking','ร้านอาหารต่างชาติเกาะพะงัน อิตาเลียน เม็กซิกัน อินเดีย เมดิเตอร์เรเนียน แถบหาดริ้น-ศรีธนู'],
  ['koh-phangan-coffee-roasters','food','ร้านกาแฟพิเศษและโรสเตอร์เกาะพะงัน specialty coffee นั่งทำงาน ชิลริมทะเล'],
  ['koh-phangan-local-dessert','food','ของหวานและผลไม้เกาะพะงัน มะพร้าวสด ขนมกะทิ ผลไม้ใต้ ของกินดับร้อนตามตลาดและริมทาง'],
]
const SEE = [
  ['koh-phangan-attractions','attraction','รวมที่เที่ยวเกาะพะงันที่ต้องไป คละหาดริ้น/ธารเสด็จ/หาดขวด/เกาะม้า/ศรีธนู (ภาพรวม + cards)'],
  ['haad-rin-beach','attraction','หาดริ้นเกาะพะงัน หาดคู่ฝั่งใต้ ศูนย์กลางที่พัก-ร้าน-บาร์ และจุดจัดปาร์ตี้ฟูลมูน หาดริ้นนอก/ใน การเดินทาง'],
  ['than-sadet-waterfall','attraction','น้ำตกธารเสด็จเกาะพะงัน อุทยานแห่งชาติธารเสด็จ-เกาะพะงัน อักษรพระปรมาภิไธยบนหิน เดินป่าสั้น เล่นน้ำตก'],
  ['bottle-beach-haad-khuat','attraction','หาดขวด (Bottle Beach) เกาะพะงัน หาดทรายขาวเงียบฝั่งเหนือ เข้าด้วยเรือ/เดินป่า น้ำใส คนน้อย'],
  ['koh-ma-mae-haad','attraction','เกาะม้า แม่หาด เกาะพะงัน สันทรายเชื่อมเกาะ จุดดำน้ำตื้นดูปะการังที่ดีที่สุดของเกาะ ช่วงน้ำลงเดินข้ามได้'],
  ['phaeng-waterfall-viewpoint','attraction','น้ำตกแพงและจุดชมวิวโดมศิลาเกาะพะงัน เส้นทางเดินขึ้นเขากลางเกาะ มองเห็นเกาะและทะเลรอบทิศ'],
  ['koh-phangan-west-beaches','attraction','หาดฝั่งตะวันตกเกาะพะงัน หาดยาว หาดสน ศรีธนู จุดชมพระอาทิตย์ตกและที่พักเงียบริมทะเล'],
  ['koh-phangan-snorkeling-diving','attraction','ดำน้ำเกาะพะงัน จุดดำน้ำตื้น-ลึกรอบเกาะ เกาะม้า แซลแบงก์ ทริปเรือ ฤดูที่น้ำใส'],
  ['koh-phangan-viewpoints','attraction','จุดชมวิวเกาะพะงัน โดมศิลา จุดชมวิวหาดริ้น และมุมถ่ายรูปทะเลรอบเกาะ'],
  ['koh-phangan-waterfalls','attraction','น้ำตกบนเกาะพะงัน ธารเสด็จ แพง พาราดาย เดินป่าสั้นเล่นน้ำคลายร้อนกลางเกาะ'],
]
const PLAN = [
  ['koh-phangan-full-moon-guide','itinerary','คู่มือปาร์ตี้ฟูลมูนเกาะพะงัน วันจัด การเตรียมตัว ที่พักหาดริ้น ความปลอดภัย ของที่ต้องระวัง ใช้ block list/day'],
  ['koh-phangan-3d2n-itinerary','itinerary','แผนเกาะพะงัน 3 วัน 2 คืน หาดริ้น-ธารเสด็จ-หาดเหนือ ใช้ block day'],
  ['koh-phangan-4d3n-itinerary','itinerary','แผนเกาะพะงัน 4 วัน 3 คืน ครบทั้งปาร์ตี้-เงียบ-ดำน้ำ-เวลเนส ใช้ block day'],
  ['koh-phangan-wellness-yoga-plan','itinerary','แผนสายเวลเนส โยคะศรีธนู-คาเฟ่สุขภาพ-สปา-ชมพระอาทิตย์ตก ใช้ block day'],
  ['koh-phangan-quiet-north-plan','itinerary','แผนสายเงียบ หาดขวด-เจ้าเภา-ดำน้ำเกาะม้า หนีความวุ่นวาย ใช้ block day'],
  ['koh-phangan-island-hopping-plan','itinerary','แผนเที่ยวเกาะ เกาะพะงัน-เกาะสมุย-เกาะเต่า เรือข้ามเกาะ ใช้ block day'],
  ['koh-phangan-couple-plan','itinerary','แผนคู่รัก/ฮันนีมูนเกาะพะงัน รีสอร์ตริมทะเล หาดเงียบ ดินเนอร์ ใช้ block day'],
  ['koh-phangan-budget-backpacker-plan','itinerary','แผนแบ็คแพ็ค/งบประหยัดเกาะพะงัน บังกะโลริมหาด ของกินถูก เที่ยวคุ้ม ใช้ block day'],
  ['koh-phangan-first-timer-guide','itinerary','มาเกาะพะงันครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-phangan-travel-tips','prep','เตรียมตัวเที่ยวเกาะพะงัน (ช่วงเวลาดีสุด ธ.ค.-เม.ย. เลี่ยงฝนต.ค.-พ.ย. คืนฟูลมูนเช็กวัน การจองล่วงหน้าช่วงปาร์ตี้ ความปลอดภัย งบ)'],
  ['koh-phangan-getting-around','prep','การเดินทางไป-รอบเกาะพะงัน (เรือเฟอร์รีจากสุราษฎร์ธานี/ดอนสัก/เกาะสมุย/เกาะเต่า เช่ามอเตอร์ไซค์บนเกาะ ถนนชันระวังขับ แท็กซี่เกาะ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะพะงัน ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-phangan", crumbCity="เกาะพะงัน", crumbCityHref="city-koh-phangan.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: เรื่องปาร์ตี้/บาร์/ฟูลมูน ให้เขียนแบบรับผิดชอบ — เตือนเรื่องดื่มอย่างมีสติ ดูแลของมีค่า ความปลอดภัยทางทะเล/ขับมอไซค์ทางชัน · ราคาห้องบนเกาะสวิงตามฤดูและคืนฟูลมูน บอกตรง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-phangan.html และ top10-hotels-koh-phangan.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

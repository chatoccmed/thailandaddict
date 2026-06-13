export const meta = {
  name: 'pai-articles',
  description: 'Pai (ปาย) destination — food / attractions / itineraries / prep (30 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '8 food articles (cafe, walking street, northern, yunnan, vegan, bars)' },
    { title: 'See', detail: '11 attraction articles (canyon, bridge, hot springs, waterfalls, viewpoints)' },
    { title: 'Plan', detail: '9 itineraries (2D1N, 3D2N, chiang-mai, loop, slow-life)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['pai-food-guide','food','รวมของกินปายที่ต้องลอง คาเฟ่ ถนนคนเดิน อาหารเหนือ อาหารยูนนาน (ภาพรวม + ย่าน/ราคา)'],
  ['pai-cafe-scene','eat-ranking','จัดอันดับคาเฟ่ปายวิวนาขั้นบันได-ภูเขา กาแฟสด นั่งชิลถ่ายรูป ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['pai-walking-street','food','ถนนคนเดินปายยามเย็น สตรีทฟู้ด ของย่าง ของหวาน เครื่องดื่ม และงานคราฟต์แฮนด์เมด'],
  ['pai-northern-food','eat-ranking','จัดอันดับร้านอาหารเหนือปาย ข้าวซอย น้ำเงี้ยว แกงฮังเล น้ำพริกหนุ่ม ร้านท้องถิ่นรสเหนือแท้'],
  ['pai-breakfast-brunch','eat-ranking','ร้านอาหารเช้า-บรันช์ปาย ไข่ กาแฟ ขนมปัง วิวนา เปิดเช้ารับสายถ่ายรูป'],
  ['pai-vegan-healthy','eat-ranking','ร้านวีแกน/อาหารสุขภาพปาย สมูทตี้โบวล์ อาหารคลีน รองรับสายเวลเนสที่พักยาว'],
  ['pai-bars-live-music','food','บาร์และร้านดนตรีสดปาย แนวเร้กเก้-โฟล์ก บรรยากาศกลางคืนสบาย ๆ (เที่ยวอย่างมีสติ)'],
  ['pai-local-restaurants','eat-ranking','ร้านอาหารท้องถิ่นปายราคาเป็นมิตร ตามสั่ง ก๋วยเตี๋ยว อาหารถิ่น ที่คนปายกินจริง'],
]
const SEE = [
  ['pai-attractions','attraction','รวมที่เที่ยวปายที่ต้องไป ปายแคนยอน-สะพานประวัติศาสตร์-ทะเลหมอก-น้ำพุร้อน-น้ำตก-สันติชล (ภาพรวม + cards)'],
  ['pai-canyon','attraction','ปายแคนยอน (กองแลน) หุบผาดินสันแคบ เดินเลาะชมวิวภูเขา จุดชมพระอาทิตย์ตกยอดนิยม ความปลอดภัยขอบดินร่วน'],
  ['pai-memorial-bridge','attraction','สะพานประวัติศาสตร์ปาย สะพานเหล็กข้ามแม่น้ำปายสมัยสงครามโลก แลนด์มาร์กถ่ายรูปก่อนเข้าเมือง'],
  ['pai-hot-springs','attraction','น้ำพุร้อนท่าปายและไทรงาม บ่อน้ำพุร้อนกลางป่าสน บ่อแช่และสปาน้ำแร่ ผ่อนคลายหลังเที่ยว'],
  ['pai-pam-bok-waterfall','attraction','น้ำตกปำบกปาย น้ำตกใกล้เมือง แอ่งน้ำใสเล่นน้ำได้ บรรยากาศร่มรื่นกลางป่า'],
  ['pai-mo-paeng-waterfall','attraction','น้ำตกหมอแปงปาย น้ำตกหลายชั้น มีสไลเดอร์หินธรรมชาติและแอ่งน้ำเล่น เหมาะคลายร้อน'],
  ['pai-land-split','attraction','แลนด์สปลิตปาย รอยแยกแผ่นดินที่กลายเป็นฟาร์มเกษตร เจ้าของให้ชิมผลผลิตฟรี บรรยากาศเรียบง่าย'],
  ['pai-yun-lai-viewpoint','attraction','จุดชมวิวหยุนไหลปาย ดูทะเลหมอกยามเช้าเหนือหมู่บ้านสันติชล จิบชาอุ่นรอแสงแรก'],
  ['pai-santichon-village','attraction','หมู่บ้านสันติชลปาย หมู่บ้านชาวจีนยูนนาน บ้านดินจีน ชิงช้าใหญ่ ร้านชาและอาหารยูนนาน วิวนาขั้นบันได'],
  ['pai-bamboo-bridge','attraction','สะพานไม้ไผ่บุญโขกู่โส่ปาย สะพานไม้ไผ่ทอดยาวกลางทุ่งนาสู่วัดบนเขา จุดถ่ายรูปสายธรรมชาติ'],
  ['pai-white-buddha','attraction','พระธาตุแม่เย็น (พระใหญ่ขาว) ปาย ขึ้นบันไดกราบพระและชมวิวเมืองปายทั้งหุบเขาแบบกว้าง'],
]
const PLAN = [
  ['pai-1-day-itinerary','itinerary','แผนเที่ยวปาย 1 วัน สะพานประวัติศาสตร์-ปายแคนยอน-ถนนคนเดิน ใช้ block day'],
  ['pai-2d1n-itinerary','itinerary','แผนปาย 2 วัน 1 คืน ทะเลหมอก-น้ำพุร้อน-คาเฟ่-ถนนคนเดิน ใช้ block day'],
  ['pai-3d2n-itinerary','itinerary','แผนปาย 3 วัน 2 คืน ครบน้ำตก-สันติชล-สะพานไม้ไผ่-พระใหญ่ ใช้ block day'],
  ['pai-chiang-mai-plan','itinerary','แผนเชียงใหม่-ปาย ขับรถ/นั่งรถตู้ 762 โค้ง เที่ยวสองที่ ใช้ block day'],
  ['pai-mae-hong-son-loop-plan','itinerary','แผนลูปแม่ฮ่องสอน เชียงใหม่-ปาย-ปางอุ๋ง-แม่ฮ่องสอน เส้นทางเหนือ ใช้ block day'],
  ['pai-slow-life-plan','itinerary','แผนปายสายสโลว์ไลฟ์ คาเฟ่-แช่น้ำพุร้อน-ดนตรีสด พักยาว ๆ ใช้ block day'],
  ['pai-photo-spots-plan','itinerary','แผนสายถ่ายรูปปาย ทะเลหมอก-สะพานประวัติศาสตร์-ปายแคนยอน-สันติชล ใช้ block day'],
  ['pai-budget-backpacker-plan','itinerary','แผนงบประหยัด/แบ็คแพ็คเกอร์ปาย โฮสเทล เช่ามอเตอร์ไซค์ ของกินถูก ใช้ block day'],
  ['pai-first-timer-guide','itinerary','มาปายครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['pai-travel-tips','prep','เตรียมตัวเที่ยวปาย (ช่วงเวลาดีสุด พ.ย.-ก.พ. หนาวทะเลหมอก เลี่ยงหมอกควัน มี.ค.-เม.ย. เตรียมเสื้อกันหนาว ยาแก้เมารถ 762 โค้ง งบ)'],
  ['pai-getting-around','prep','การเดินทางไป-รอบปาย (รถตู้จากเชียงใหม่ถนน 762 โค้ง เครื่องบินเล็ก เช่ามอเตอร์ไซค์/รถในเมือง ระยะทางจุดเที่ยว ถนนเขาคดเคี้ยว)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวปาย (อ.ปาย จ.แม่ฮ่องสอน) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="pai", crumbCity="ปาย", crumbCityHref="city-pai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: ถนนขึ้นปาย 762 โค้งเตือนคนเมารถ · ขับมอเตอร์ไซค์บนถนนเขาคดเคี้ยวระวัง · ทะเลหมอกขึ้นกับสภาพอากาศ บอกตรง · ช่วง มี.ค.-เม.ย. มีหมอกควันบอกตามจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-pai.html และ top10-hotels-pai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

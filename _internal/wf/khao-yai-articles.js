export const meta = {
  name: 'khao-yai-articles',
  description: 'Khao Yai (เขาใหญ่) destination — food / attractions / itineraries / prep (37 articles, khaoyai- slug prefix to avoid prachinburi/korat collisions, v2-clean Thai)',
  phases: [
    { title: 'Food', detail: '11 food articles (steak, winery dining, cafe, farm, italian)' },
    { title: 'See', detail: '13 attraction articles (national park, waterfalls, wineries, palio, farms)' },
    { title: 'Plan', detail: '11 itineraries (2D1N, 3D2N, bangkok, nature, cafe-winery)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['khaoyai-food-guide','food','รวมของกินเขาใหญ่ที่ต้องลอง สเต๊กฟาร์ม ร้านวิวไร่องุ่น คาเฟ่วิวเขา ของฝากนม (ภาพรวม + ย่าน/ราคา)'],
  ['khaoyai-steak-grill','eat-ranking','จัดอันดับร้านสเต๊ก/ฟาร์มกริลล์เขาใหญ่ เนื้อย่าง วัตถุดิบฟาร์มท้องถิ่น ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['khaoyai-cafe-tour','eat-ranking','คาเฟ่วิวภูเขาเขาใหญ่ ถนนธนะรัชต์-ปากช่อง กาแฟดี วิวเขา นั่งชิลถ่ายรูป'],
  ['khaoyai-winery-dining','eat-ranking','ร้านอาหารวิวไร่องุ่นเขาใหญ่ กรานมอนเต้-พีบีวัลเลย์ จับคู่ไวน์ บรรยากาศนั่งยาวชมภูเขา'],
  ['khaoyai-farm-cafe','food','ฟาร์มคาเฟ่และร้านนมสดเขาใหญ่ ไอศกรีมนม โยเกิร์ต ของหวานจากฟาร์มโคนม'],
  ['khaoyai-italian-european','eat-ranking','ร้านอาหารอิตาเลียน/ยุโรปเขาใหญ่ พิซซ่า พาสต้า ย่านปาลิโอและรีสอร์ต บรรยากาศยุโรป'],
  ['khaoyai-local-thai-food','eat-ranking','ร้านอาหารไทยถิ่นปากช่อง-เขาใหญ่ ตามสั่ง ก๋วยเตี๋ยว รสจัด ราคาคนท้องถิ่น'],
  ['khaoyai-night-market','food','ตลาดและของกินกลางคืนปากช่อง สตรีทฟู้ด ของย่าง ของกินเล่น ราคาเป็นกันเอง'],
  ['khaoyai-vegan-healthy','eat-ranking','ร้านวีแกน/อาหารสุขภาพเขาใหญ่ สมูทตี้โบวล์ อาหารคลีน ผักออร์แกนิกท้องถิ่น'],
  ['khaoyai-dessert-bakery','food','ของหวานและเบเกอรีเขาใหญ่ ขนมจากนมสด เค้ก ร้านนั่งชิลวิวเขา'],
  ['khaoyai-souvenir-food','food','ของฝากกินได้เขาใหญ่-ปากช่อง นมสด โยเกิร์ต ไวน์ ผลผลิตฟาร์ม แหล่งซื้อ'],
]
const SEE = [
  ['khaoyai-attractions','attraction','รวมที่เที่ยวเขาใหญ่ที่ต้องไป อุทยาน-น้ำตก-ไร่องุ่น-ปาลิโอ-ฟาร์มแกะ-คาเฟ่วิวเขา (ภาพรวม + cards)'],
  ['khaoyai-national-park','attraction','อุทยานแห่งชาติเขาใหญ่ มรดกโลก น้ำตก จุดส่องสัตว์ เดินป่า ทะเลหมอก ค่าเข้า เส้นทาง ถนนในอุทยานคดเคี้ยวขับช้า'],
  ['khaoyai-haew-narok-waterfall','attraction','น้ำตกเหวนรกเขาใหญ่ น้ำตกใหญ่ที่สุดในอุทยาน สูงหลายชั้น จุดชมวิวอลังการ ทางเดินชันระวังลื่น'],
  ['khaoyai-haew-suwat-waterfall','attraction','น้ำตกเหวสุวัตเขาใหญ่ น้ำตกขึ้นชื่อเข้าถึงง่าย ลานกว้างและแอ่งน้ำ จุดแวะถ่ายรูปในอุทยาน'],
  ['khaoyai-wineries','attraction','ไร่องุ่นเขาใหญ่ กรานมอนเต้-พีบีวัลเลย์ นั่งรถชมไร่ ชิมไวน์ ร้านอาหารวิวไร่ สายไวน์'],
  ['khaoyai-palio-village','attraction','ปาลิโอเขาใหญ่ หมู่บ้านธีมอิตาลี อาคารสีสันสวย ร้านกาแฟ ของกิน มุมถ่ายรูปริมถนนธนะรัชต์'],
  ['khaoyai-primo-piazza','attraction','พรีโมพิอาซซาเขาใหญ่ หมู่บ้านสไตล์อิตาลีพร้อมฟาร์มสัตว์เล็ก ให้อาหารม้าแกะ มุมถ่ายรูปยุโรป'],
  ['khaoyai-farm-chokchai','attraction','ฟาร์มโชคชัยเขาใหญ่ ทัวร์ฟาร์มปศุสัตว์ รีดนมวัว ขี่ม้า โชว์คาวบอย ร้านสเต๊กและไอศกรีมนมสด เหมาะครอบครัว'],
  ['khaoyai-sheep-land','attraction','ฟาร์มแกะเขาใหญ่ ทุ่งหญ้าฟาร์มแกะ ให้อาหารแกะ มุมถ่ายรูปธีมยุโรป เหมาะครอบครัวและสายถ่ายรูป'],
  ['khaoyai-the-bloom-garden','attraction','สวนดอกไม้เขาใหญ่ เดอะบลูม-สวนดอกไม้ตามฤดู ทุ่งดอกไม้ถ่ายรูป บรรยากาศเย็นสบาย'],
  ['khaoyai-scenical-world','attraction','ซีนิคอลเวิลด์เขาใหญ่ สวนน้ำและสกายวอล์ก จุดชมวิวภูเขา เครื่องเล่น เหมาะครอบครัว'],
  ['khaoyai-viewpoints','attraction','จุดชมวิวและทะเลหมอกเขาใหญ่ จุดชมวิวในและนอกอุทยาน มุมถ่ายรูปภูเขายามเช้า'],
  ['khaoyai-camping','attraction','แคมป์ปิ้งเขาใหญ่ ลานกางเต็นท์ผากล้วยไม้-ลำตะคอง รีสอร์ตเต็นท์ นอนกลางธรรมชาติ เตรียมตัวกันหนาว'],
]
const PLAN = [
  ['khaoyai-1-day-itinerary','itinerary','แผนเที่ยวเขาใหญ่ 1 วัน อุทยาน-น้ำตก-คาเฟ่วิวเขา ใช้ block day'],
  ['khaoyai-2d1n-itinerary','itinerary','แผนเขาใหญ่ 2 วัน 1 คืน อุทยาน-ไร่องุ่น-ปาลิโอ-คาเฟ่ ใช้ block day'],
  ['khaoyai-3d2n-itinerary','itinerary','แผนเขาใหญ่ 3 วัน 2 คืน ครบน้ำตก-ฟาร์มแกะ-ไวเนอรี-ฟาร์มโชคชัย ใช้ block day'],
  ['khaoyai-bangkok-plan','itinerary','แผนกรุงเทพ-เขาใหญ่ ขับรถหนีร้อนสุดสัปดาห์ ใช้ block day'],
  ['khaoyai-nature-trip','itinerary','แผนเขาใหญ่สายธรรมชาติ อุทยาน-น้ำตก-ส่องสัตว์-ทะเลหมอก ใช้ block day'],
  ['khaoyai-cafe-winery-tour','itinerary','แผนเขาใหญ่สายคาเฟ่-ไวน์ ไร่องุ่น-คาเฟ่วิวเขา-ปาลิโอ ใช้ block day'],
  ['khaoyai-family-plan','itinerary','แผนเขาใหญ่สายครอบครัว ฟาร์มโชคชัย-ฟาร์มแกะ-สวนน้ำ ใช้ block day'],
  ['khaoyai-couple-plan','itinerary','แผนเขาใหญ่สายคู่รัก ไร่องุ่น-รีสอร์ตวิวเขา-ดินเนอร์ ใช้ block day'],
  ['khaoyai-camping-plan','itinerary','แผนเขาใหญ่สายแคมป์ปิ้ง กางเต็นท์-ส่องสัตว์-ทะเลหมอกเช้า ใช้ block day'],
  ['khaoyai-photo-spots-plan','itinerary','แผนสายถ่ายรูปเขาใหญ่ ปาลิโอ-ไร่องุ่น-ฟาร์มแกะ-ทะเลหมอก ใช้ block day'],
  ['khaoyai-first-timer-guide','itinerary','มาเขาใหญ่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['khaoyai-travel-tips','prep','เตรียมตัวเที่ยวเขาใหญ่ (ช่วงเวลาดีสุด พ.ย.-ก.พ. หนาว การจองวันหยุดยาว ค่าเข้าอุทยาน ขับรถในอุทยานคดเคี้ยวระวังสัตว์ป่า งบ)'],
  ['khaoyai-getting-around','prep','การเดินทางไป-รอบเขาใหญ่ (ขับรถ/รถทัวร์จากกรุงเทพลงปากช่อง รถในอุทยาน เช่ารถจำเป็น ระยะทางจุดเที่ยวตามถนนธนะรัชต์)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเขาใหญ่ (อ.ปากช่อง จ.นครราชสีมา) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="khao-yai", crumbCity="เขาใหญ่", crumbCityHref="city-khao-yai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: ในอุทยานถนนคดเคี้ยวและมีสัตว์ป่าข้ามถนน เตือนขับช้า · ค่าเข้าอุทยานบอกตามจริง · วันหยุดยาวรถติด/ที่พักเต็มเร็วควรจองล่วงหน้า · น้ำตกหลังฝนทางลื่น
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-khao-yai.html และ top10-hotels-khao-yai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'koh-mak-articles',
  description: 'Koh Mak (เกาะหมาก) destination — food / attractions / itineraries / prep (18 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '5 food articles (seafood, beach bars, cafe, local)' },
    { title: 'See', detail: '7 attraction articles (beaches, snorkeling, cycling, koh kham)' },
    { title: 'Plan', detail: '4 itineraries (2D1N, 3D2N, couple, first-timer)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-mak-food-guide','food','รวมของกินเกาะหมากที่ต้องลอง อาหารทะเล ร้านริมหาด คาเฟ่ (ภาพรวม + ย่าน/ราคา)'],
  ['koh-mak-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะหมาก ตามหาดและรีสอร์ต กุ้ง หอย ปู ปลาสด ที่คนไปจริง (ย่าน/ราคา/เมนูเด็ด)'],
  ['koh-mak-beach-bars','eat-ranking','บาร์และร้านริมหาดเกาะหมาก หาดอ่าวเก๋า นั่งกินดื่มชมพระอาทิตย์ตก บรรยากาศเงียบ (เที่ยวอย่างมีสติ)'],
  ['koh-mak-cafe-guide','eat-ranking','คาเฟ่และของหวานเกาะหมาก กาแฟสด วิวทะเล แวะพักระหว่างปั่นจักรยาน'],
  ['koh-mak-local-food','food','ร้านอาหารถิ่นและตามสั่งเกาะหมาก ข้าวแกง ก๋วยเตี๋ยว รสจัด ราคาคนท้องถิ่น'],
]
const SEE = [
  ['koh-mak-attractions','attraction','รวมที่เที่ยวเกาะหมากที่ต้องไป สองหาด-ดำน้ำเกาะขาม-ปั่นจักรยาน-โลว์คาร์บอน (ภาพรวม + cards)'],
  ['koh-mak-ao-kao-beach','attraction','หาดอ่าวเก๋าเกาะหมาก หาดหลักฝั่งใต้ ทรายขาวน้ำตื้นใส รีสอร์ตและร้านริมทะเล พระอาทิตย์ตกสวย'],
  ['koh-mak-ao-suan-yai-beach','attraction','หาดอ่าวสวนใหญ่เกาะหมาก หาดยาวฝั่งเหนือเงียบเป็นส่วนตัว ทรายขาวน้ำใส ท่าเรือและรีสอร์ต'],
  ['koh-mak-snorkeling','attraction','ดำน้ำตื้นเกาะหมาก ต่อเรือไปเกาะขาม-เกาะรัง น้ำใสปะการังหน้าหาด โปรแกรมและราคา เช็กสภาพอากาศ'],
  ['koh-mak-cycling','attraction','ปั่นจักรยานรอบเกาะหมาก เกาะแบนปั่นผ่านสวนมะพร้าว-สวนยาง-หาด เส้นทางและจุดแวะ เสน่ห์ของเกาะ'],
  ['koh-mak-koh-kham','attraction','เกาะขามใกล้เกาะหมาก เกาะเล็กน้ำใสปะการังหน้าหาด ต่อเรือไปดำน้ำตื้นและเล่นน้ำในวันเดียว'],
  ['koh-mak-viewpoints','attraction','จุดชมวิวและพระอาทิตย์ตกเกาะหมาก หาดอ่าวเก๋าและมุมริมทะเลรอบเกาะ จุดถ่ายรูปทะเลสงบ'],
]
const PLAN = [
  ['koh-mak-2d1n-itinerary','itinerary','แผนเกาะหมาก 2 วัน 1 คืน หาดอ่าวเก๋า-ปั่นจักรยาน-ดำน้ำเกาะขาม ใช้ block day'],
  ['koh-mak-3d2n-itinerary','itinerary','แผนเกาะหมาก 3 วัน 2 คืน ครบสองหาด-ดำน้ำเกาะรอบ ๆ-ปั่นรอบเกาะ ใช้ block day'],
  ['koh-mak-couple-plan','itinerary','แผนเกาะหมากสายคู่รัก หาดเงียบ-ดินเนอร์ริมทะเล-พระอาทิตย์ตก ใช้ block day'],
  ['koh-mak-first-timer-guide','itinerary','มาเกาะหมากครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-mak-travel-tips','prep','เตรียมตัวเที่ยวเกาะหมาก (ช่วงเปิดเกาะ พ.ย.-เม.ย. เลี่ยงมรสุม พ.ค.-ต.ค. ที่พัก/เรือปิด ของบนเกาะแพง ร้าน/บริการจำกัด เตรียมเงินสด-ของจำเป็น เที่ยวโลว์คาร์บอนเก็บขยะกลับ งบ)'],
  ['koh-mak-getting-around','prep','การเดินทางไป-รอบเกาะหมาก (สปีดโบ๊ต/เฟอร์รีจากแหลมงอบ-ท่าเรือตราด ปั่นจักรยาน/เช่ามอเตอร์ไซค์บนเกาะ เกาะแบนเที่ยวง่าย ระยะทางจุดเที่ยว)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะหมาก (จ.ตราด) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-mak", crumbCity="เกาะหมาก", crumbCityHref="city-koh-mak.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: เกาะหมากเดินทางไกล ที่พัก/เรือปิดช่วงมรสุม พ.ค.-ต.ค. บอกตรง · ของบนเกาะราคาสูง ร้าน/บริการจำกัด เตรียมเงินสด · ดำน้ำเช็กสภาพอากาศ · เที่ยวแบบโลว์คาร์บอนเก็บขยะกลับ
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-mak.html และ top10-hotels-koh-mak.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

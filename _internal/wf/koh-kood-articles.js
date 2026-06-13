export const meta = {
  name: 'koh-kood-articles',
  description: 'Koh Kood (เกาะกูด) destination — food / attractions / itineraries / prep (20 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '5 food articles (seafood, beach bars, cafe, local)' },
    { title: 'See', detail: '9 attraction articles (waterfalls, beaches, makha tree, fishing village)' },
    { title: 'Plan', detail: '4 itineraries (2D1N, 3D2N, couple, first-timer)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-kood-food-guide','food','รวมของกินเกาะกูดที่ต้องลอง อาหารทะเล ร้านริมหาด คาเฟ่ (ภาพรวม + ย่าน/ราคา)'],
  ['koh-kood-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะกูด คลองเจ้า-อ่าวสลัด กุ้ง หอย ปู ปลาสด ที่คนไปจริง (ย่าน/ราคา/เมนูเด็ด)'],
  ['koh-kood-beach-bars','eat-ranking','บาร์และร้านริมหาดเกาะกูด อ่าวตะเภา-อ่าวพร้าว นั่งกินดื่มชมพระอาทิตย์ตก (เที่ยวอย่างมีสติ)'],
  ['koh-kood-cafe-guide','eat-ranking','คาเฟ่และของหวานเกาะกูด กาแฟสด วิวทะเล-ป่า นั่งพักระหว่างวัน'],
  ['koh-kood-local-food','food','ร้านอาหารถิ่นและตามสั่งเกาะกูด ข้าวแกง ก๋วยเตี๋ยว รสจัด ราคาคนท้องถิ่น'],
]
const SEE = [
  ['koh-kood-attractions','attraction','รวมที่เที่ยวเกาะกูดที่ต้องไป น้ำตก-หาด-ต้นมะค่ายักษ์-หมู่บ้านประมง-ดำน้ำ (ภาพรวม + cards)'],
  ['koh-kood-klong-chao-waterfall','attraction','น้ำตกคลองเจ้าเกาะกูด น้ำตกใหญ่ขึ้นชื่อที่สุด แอ่งน้ำกว้างเล่นน้ำได้ น้ำใสเย็นกลางป่า เคยเป็นที่เสด็จประพาส'],
  ['koh-kood-klong-yai-kee-waterfall','attraction','น้ำตกคลองยายกี่เกาะกูด น้ำตกหลายชั้นเงียบกว่าคลองเจ้า แอ่งน้ำใส ทางเดินป่าสั้น เหมาะสายธรรมชาติ'],
  ['koh-kood-ao-tapao-beach','attraction','หาดอ่าวตะเภาเกาะกูด หาดทรายขาวยาวน้ำใสฝั่งตะวันตก เงียบสงบ พระอาทิตย์ตกสวย รีสอร์ตและร้านริมทะเล'],
  ['koh-kood-ao-phrao-beach','attraction','หาดอ่าวพร้าวเกาะกูด หาดทรายขาวน้ำตื้นใสเหมาะเล่นน้ำ บรรยากาศสงบ จุดชมพระอาทิตย์ตก'],
  ['koh-kood-bang-bao-beach','attraction','หาดบางเบ้าเกาะกูด หาดและอ่าวเล็กเงียบสงบ น้ำใสเล่นน้ำได้ ที่พักริมทะเลเป็นส่วนตัว'],
  ['koh-kood-giant-makha-tree','attraction','ต้นมะค่ายักษ์เกาะกูด ต้นมะค่าโมงอายุหลายร้อยปีกลางป่า ลำต้นใหญ่หลายคนโอบ จุดแวะชมธรรมชาติถ่ายรูป'],
  ['koh-kood-fishing-villages','attraction','หมู่บ้านประมงเกาะกูด อ่าวสลัด-คลองเจ้า บ้านไม้ริมทะเล วิถีชาวเล ร้านอาหารทะเล ท่าเรือ บรรยากาศเรียบง่าย'],
  ['koh-kood-snorkeling','attraction','ดำน้ำตื้นเกาะกูด ต่อเรือไปเกาะรัง น้ำใสปะการังสมบูรณ์ โปรแกรมและราคา เช็กสภาพอากาศก่อนไป'],
]
const PLAN = [
  ['koh-kood-2d1n-itinerary','itinerary','แผนเกาะกูด 2 วัน 1 คืน น้ำตกคลองเจ้า-อ่าวตะเภา-อ่าวสลัด ใช้ block day'],
  ['koh-kood-3d2n-itinerary','itinerary','แผนเกาะกูด 3 วัน 2 คืน ครบน้ำตก-หาด-ดำน้ำเกาะรัง ใช้ block day'],
  ['koh-kood-couple-plan','itinerary','แผนเกาะกูดสายคู่รัก หาดเงียบ-ดินเนอร์ริมทะเล-พระอาทิตย์ตก ใช้ block day'],
  ['koh-kood-first-timer-guide','itinerary','มาเกาะกูดครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-kood-travel-tips','prep','เตรียมตัวเที่ยวเกาะกูด (ช่วงเปิดเกาะ พ.ย.-เม.ย. เลี่ยงมรสุม พ.ค.-ต.ค. ที่พัก/เรือปิด ของบนเกาะแพง สัญญาณ/ไฟจำกัด เช็กกับที่พัก งบ)'],
  ['koh-kood-getting-around','prep','การเดินทางไป-รอบเกาะกูด (สปีดโบ๊ต/เฟอร์รีจากแหลมศอก-แหลมสน ตราด เช่ามอเตอร์ไซค์/รถบนเกาะ ถนนบางช่วงแคบ ระยะทางจุดเที่ยว)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะกูด (จ.ตราด) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-kood", crumbCity="เกาะกูด", crumbCityHref="city-koh-kood.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: เกาะกูดเดินทางไกล ที่พัก/เรือปิดช่วงมรสุม พ.ค.-ต.ค. บอกตรง · ของบนเกาะราคาสูง สัญญาณ/ไฟบางจุดจำกัด · ดำน้ำเช็กสภาพอากาศ · ขับมอเตอร์ไซค์ถนนแคบระวัง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-kood.html และ top10-hotels-koh-kood.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'koh-larn-articles',
  description: 'Koh Larn (เกาะล้าน) destination — food / attractions / itineraries / prep (18 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '4 food articles (seafood, beach restaurants, cafe)' },
    { title: 'See', detail: '8 attraction articles (beaches, viewpoint, water sports, snorkeling)' },
    { title: 'Plan', detail: '4 itineraries (day trip, 2D1N, pattaya combo, first-timer)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-larn-food-guide','food','รวมของกินเกาะล้านที่ต้องลอง อาหารทะเลริมหาด ร้านหน้าบ้าน คาเฟ่ (ภาพรวม + ย่าน/ราคา)'],
  ['koh-larn-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะล้าน หาดตาแหวน-หน้าบ้าน กุ้ง หอย ปู ปลาสด ที่คนไปจริง (ย่าน/ราคา/เมนูเด็ด)'],
  ['koh-larn-beach-restaurants','eat-ranking','ร้านอาหารริมหาดเกาะล้าน ตาแหวน-แสม-เทียน นั่งกินเล่นน้ำ เตียงผ้าใบ บรรยากาศหาด'],
  ['koh-larn-cafe-guide','food','คาเฟ่และของกินเล่นเกาะล้าน ย่านหน้าบ้าน-หาดตาแหวน กาแฟ ของหวาน แวะระหว่างรอเรือ'],
]
const SEE = [
  ['koh-larn-attractions','attraction','รวมที่เที่ยวเกาะล้านที่ต้องไป หลายหาด-จุดชมวิว-ดำน้ำ-กีฬาทางน้ำ (ภาพรวม + cards)'],
  ['koh-larn-tawaen-beach','attraction','หาดตาแหวนเกาะล้าน หาดหลักคึกคักสุด ทรายขาวน้ำใส กีฬาทางน้ำครบ ร้านอาหารและเตียงผ้าใบ จุดเรือใหญ่จอด'],
  ['koh-larn-samae-beach','attraction','หาดแสมเกาะล้าน หาดทรายขาวน้ำใสเงียบเป็นธรรมชาติ เหมาะนอนชิลและดำน้ำตื้นดูปะการังหน้าหาด'],
  ['koh-larn-nual-beach','attraction','หาดนวล (Monkey Beach) เกาะล้าน หาดเล็กเงียบสงบน้ำใสมาก บรรยากาศส่วนตัว ร้านอาหารเล็ก ๆ ริมหาด'],
  ['koh-larn-tien-beach','attraction','หาดเทียนเกาะล้าน หาดอีกฝั่งสงบน้ำใส มีกีฬาทางน้ำและร้านริมหาด เหมาะเลี่ยงหาดตาแหวนที่คนเยอะ'],
  ['koh-larn-viewpoint','attraction','จุดชมวิวเกาะล้าน เนินเขากลางเกาะมองเห็นหาดและทะเลใสรอบเกาะ พร้อมป้ายเกาะล้าน มุมถ่ายรูปยอดนิยม'],
  ['koh-larn-water-sports','attraction','กีฬาทางน้ำเกาะล้าน พาราเซล บานาน่าโบ๊ต เจ็ตสกี ซีวอล์กเกอร์ ที่หาดตาแหวน ราคาและความปลอดภัย'],
  ['koh-larn-snorkeling','attraction','ดำน้ำตื้นเกาะล้าน หน้าหาดแสมและจุดรอบเกาะ ปะการังน้ำใสในวันอากาศดี อุปกรณ์และจุดแนะนำ'],
]
const PLAN = [
  ['koh-larn-day-trip-plan','itinerary','แผนเที่ยวเกาะล้านวันเดียวจากพัทยา หาดตาแหวน-ดำน้ำตื้น-กีฬาทางน้ำ ใช้ block day'],
  ['koh-larn-2d1n-itinerary','itinerary','แผนเกาะล้าน 2 วัน 1 คืน ค้างคืนเที่ยวหลายหาดแบบไม่รีบ ใช้ block day'],
  ['koh-larn-pattaya-plan','itinerary','แผนพัทยา-เกาะล้าน รวมเที่ยวเมืองพัทยาและข้ามเกาะทะเลใส ใช้ block day'],
  ['koh-larn-first-timer-guide','itinerary','มาเกาะล้านครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-larn-travel-tips','prep','เตรียมตัวเที่ยวเกาะล้าน (ช่วงเวลาดีสุด พ.ย.-เม.ย. วันหยุดคนเยอะเรือแน่นไปเช้า กีฬาทางน้ำเช็กราคา/ความปลอดภัย ทะเลบางวันขุ่น เก็บขยะกลับ งบ)'],
  ['koh-larn-getting-around','prep','การเดินทางไป-รอบเกาะล้าน (เรือโดยสาร/สปีดโบ๊ตจากท่าเรือแหลมบาลีฮายพัทยา รถสองแถว/เช่ามอเตอร์ไซค์บนเกาะ ระยะทางหาดต่าง ๆ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะล้าน (จ.ชลบุรี หน้าพัทยา) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-larn", crumbCity="เกาะล้าน", crumbCityHref="city-koh-larn.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: เกาะล้านวันหยุดคนเยอะเรือแน่นควรไปเช้า · กีฬาทางน้ำเช็กราคาและความปลอดภัยก่อนเล่น · ทะเลบางวันขุ่นตามสภาพอากาศ · ช่วยรักษาความสะอาดหาดเก็บขยะกลับ
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-larn.html และ top10-hotels-koh-larn.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

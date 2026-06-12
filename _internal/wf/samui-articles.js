export const meta = {
  name: 'samui-articles',
  description: 'Koh Samui (เกาะสมุย) destination — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (seafood, beach clubs, fisherman village, coconut)' },
    { title: 'See', detail: '12 attraction articles (Chaweng, Lamai, Big Buddha, Ang Thong)' },
    { title: 'Plan', detail: '12 itineraries (sea/island, family, honeymoon, beach hopping)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['samui-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะสมุย กุ้ง หอย ปู ปลาสดริมหาด ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['samui-beach-clubs','eat-ranking','บีชคลับและร้านริมหาดเกาะสมุย เฉวง-ละไม-บ่อผุด นั่งกินดื่มชมพระอาทิตย์ตก บรรยากาศดี'],
  ['samui-cafe-guide','eat-ranking','คาเฟ่และบรันช์เกาะสมุย บ่อผุด-เฉวง-ฟิชเชอร์แมนวิลเลจ กาแฟดี วิวทะเล ถ่ายรูป'],
  ['samui-southern-food','eat-ranking','ร้านอาหารใต้รสจัดเกาะสมุย แกงไตปลา คั่วกลิ้ง ข้าวยำ ที่คนท้องถิ่นไป เมนูเด็ด'],
  ['samui-night-market','food','ตลาดกลางคืนเกาะสมุย ละไมไนท์ เฉวง ฟิชเชอร์แมนวิลเลจวันศุกร์ สตรีทฟู้ด ของย่าง ของกินเล่น'],
  ['samui-international-food','eat-ranking','ร้านอาหารต่างชาติเกาะสมุย อิตาเลียน ฝรั่งเศส อินเดีย เมดิเตอร์เรเนียน แถบเฉวง-บ่อผุด'],
  ['samui-vegan-health','eat-ranking','ร้านวีแกน/อาหารสุขภาพเกาะสมุย สมูทตี้โบวล์ อาหารคลีน ดีท็อกซ์ ร้านเด็ดสายเวลเนส'],
  ['samui-fisherman-village-food','food','ร้านริมทะเลหมู่บ้านชาวประมงบ่อผุดเกาะสมุย อาหารทะเล คาเฟ่ บรรยากาศตึกไม้เก่าริมหาด'],
  ['samui-local-breakfast','food','อาหารเช้าแบบคนเกาะสมุย (ข้าวแกงใต้ โจ๊ก กาแฟโบราณ ของกินตลาดเช้า)'],
  ['samui-coconut-dessert','food','ของหวานมะพร้าวเกาะสมุย ไอศกรีมมะพร้าว ขนมมะพร้าว น้ำมะพร้าวสด ของหวานถิ่นเกาะมะพร้าว'],
  ['samui-souvenir-food','food','ของฝากกินได้เกาะสมุย (มะพร้าวแปรรูป ขนมพื้นบ้าน ปลาแห้ง ของทะเลแปรรูป แหล่งซื้อ)'],
]
const SEE = [
  ['samui-attractions','attraction','รวมที่เที่ยวเกาะสมุยที่ต้องไป คละหาดเฉวง-ละไม/พระใหญ่/หินตาหินยาย/บ่อผุด/อ่างทอง (ภาพรวม + cards)'],
  ['chaweng-beach','attraction','หาดเฉวงเกาะสมุย หาดทรายขาวยาวคึกคักที่สุด ศูนย์กลางที่พัก-ร้าน-บีชคลับ-กลางคืน กิจกรรมทางทะเล'],
  ['lamai-beach','attraction','หาดละไมเกาะสมุย หาดใหญ่อันดับสอง บรรยากาศเงียบเป็นครอบครัว ตลาดกลางคืนละไม หินตาหินยายใกล้ ๆ'],
  ['big-buddha-wat-phra-yai','attraction','พระใหญ่ วัดพระยายเกาะสมุย พระพุทธรูปองค์ใหญ่สีทองริมทะเลฝั่งบ่อผุด แลนด์มาร์ก ขึ้นไหว้พระชมวิว'],
  ['hin-ta-hin-yai','attraction','หินตาหินยายเกาะสมุย กลุ่มหินรูปทรงแปลกริมหาดละไม จุดถ่ายรูปขึ้นชื่อ ตำนานตายาย เดินริมโขดหิน'],
  ['wat-khunaram-mummified-monk','attraction','วัดคุณารามเกาะสมุย สรีระหลวงพ่อแดงในท่านั่งสมาธิไม่เน่าเปื่อย จุดกราบไหว้และเรียนรู้ความศรัทธา'],
  ['na-muang-waterfall','attraction','น้ำตกหน้าเมืองเกาะสมุย น้ำตกหลายชั้นกลางเกาะ น้ำใสเย็น จุดเล่นน้ำและกิจกรรม ATV/ขี่ช้างใกล้เคียง'],
  ['bophut-fishermans-village','attraction','หมู่บ้านชาวประมงบ่อผุดเกาะสมุย ย่านเมืองเก่าริมทะเล ตึกไม้เก่า คาเฟ่ ร้านอาหารริมหาด ตลาดเดินกินยามเย็น'],
  ['ang-thong-marine-park','attraction','อุทยานแห่งชาติหมู่เกาะอ่างทอง ต่อเรือจากเกาะสมุยไปดำน้ำ พายคายัค จุดชมวิวทะเลในเขียวมรกต ทริปทะเลสวยติดอันดับ'],
  ['samui-viewpoints','attraction','จุดชมวิวเกาะสมุย จุดชมวิวลาดเกาะ หินลาด เฉวงนอย และมุมถ่ายรูปทะเลรอบเกาะ'],
  ['samui-snorkeling-diving','attraction','ดำน้ำเกาะสมุย จุดดำน้ำตื้น-ลึก เกาะเต่า อ่างทอง ทริปเรือ ฤดูที่น้ำใส สำหรับมือใหม่และมือโปร'],
  ['samui-temples-culture','attraction','วัดและวัฒนธรรมเกาะสมุย พระใหญ่ วัดคุณาราม วัดแจ้ง เจดีย์แหลมสอ เส้นทางไหว้พระชมพุทธศิลป์'],
]
const PLAN = [
  ['samui-1-day-itinerary','itinerary','แผนเที่ยวเกาะสมุย 1 วัน พระใหญ่-หินตาหินยาย-หาดเฉวง ใช้ block day'],
  ['samui-3d2n-itinerary','itinerary','แผนเกาะสมุย 3 วัน 2 คืน หาด-พระใหญ่-อ่างทอง ใช้ block day'],
  ['samui-4d3n-itinerary','itinerary','แผนเกาะสมุย 4 วัน 3 คืน ครบหาด-ทะเล-วัฒนธรรม-เกาะข้าง ใช้ block day'],
  ['samui-sea-island-plan','itinerary','แผนสายทะเล อ่างทอง-ดำน้ำ-เกาะเต่า ต่อเรือจากสมุย ใช้ block day'],
  ['samui-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดละไม น้ำตก พระใหญ่ อควาเรียม) ใช้ block day'],
  ['samui-couple-honeymoon-plan','itinerary','แผนคู่รัก/ฮันนีมูนเกาะสมุย รีสอร์ตริมทะเล-ดินเนอร์-สปา-ชมพระอาทิตย์ตก ใช้ block day'],
  ['samui-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระใหญ่ หินตาหินยาย ฟิชเชอร์แมนวิลเลจ จุดชมวิว) ใช้ block day'],
  ['samui-koh-phangan-plan','itinerary','แผนข้ามเกาะ เกาะสมุย-เกาะพะงัน เรือข้ามเกาะเที่ยวสองเกาะ ใช้ block day'],
  ['samui-beach-hopping-plan','itinerary','แผนตะลุยหาดเกาะสมุย เฉวง-ละไม-บ่อผุด-เชิงมน-ท้องตะเคียน ใช้ block day'],
  ['samui-nightlife-plan','itinerary','แผนกลางคืนเกาะสมุย ย่านเฉวง บีชคลับ บาร์ริมหาด (เที่ยวอย่างมีสติ) ใช้ block day'],
  ['samui-budget-plan','itinerary','แผนงบประหยัดเกาะสมุย บังกะโลริมหาด ของกินถูก เที่ยวคุ้ม ใช้ block day'],
  ['samui-first-timer-guide','itinerary','มาเกาะสมุยครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['samui-travel-tips','prep','เตรียมตัวเที่ยวเกาะสมุย (ช่วงเวลาดีสุด ธ.ค.-ส.ค. เลี่ยงมรสุมต.ค.-ธ.ค. การจองล่วงหน้าไฮซีซั่น ทริปอ่างทองเช็กสภาพทะเล งบ)'],
  ['samui-getting-around','prep','การเดินทางไป-รอบเกาะสมุย (สนามบินสมุย เรือเฟอร์รีจากดอนสัก/สุราษฎร์ เช่ารถ/มอเตอร์ไซค์บนเกาะ สองแถว แท็กซี่ ถนนรอบเกาะ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะสมุย ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="samui", crumbCity="เกาะสมุย", crumbCityHref="city-samui.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: ราคาห้อง/ทัวร์บนเกาะสวิงตามฤดู บอกตรง · เรื่องทะเล/ดำน้ำเตือนเช็กสภาพอากาศและความปลอดภัย · ขับมอเตอร์ไซค์บนเกาะระวังถนนชัน
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-samui.html และ top10-hotels-samui.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

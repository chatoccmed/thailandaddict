export const meta = {
  name: 'koh-lipe-articles',
  description: 'Koh Lipe (เกาะหลีเป๊ะ) destination — food / attractions / itineraries / prep (22 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '5 food articles (seafood, walking street, beach bars, cafe)' },
    { title: 'See', detail: '9 attraction articles (beaches, snorkeling, adang, hin ngam, tarutao)' },
    { title: 'Plan', detail: '6 itineraries (2D1N, 3D2N, snorkeling, couple, family)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-lipe-food-guide','food','รวมของกินเกาะหลีเป๊ะที่ต้องลอง อาหารทะเล วอล์กกิ้งสตรีท บาร์ริมหาด (ภาพรวม + ย่าน/ราคา)'],
  ['koh-lipe-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะหลีเป๊ะ หาดพัทยา-วอล์กกิ้งสตรีท กุ้ง หอย ปู ปลาสด ที่คนไปจริง (ย่าน/ราคา/เมนูเด็ด)'],
  ['koh-lipe-walking-street-food','food','วอล์กกิ้งสตรีทเกาะหลีเป๊ะ ถนนคนเดินกลางเกาะ ร้านอาหาร บาร์ ของกินเล่น ยามค่ำ'],
  ['koh-lipe-beach-bars','eat-ranking','บาร์ริมหาดเกาะหลีเป๊ะ หาดพัทยา-ซันไรส์ นั่งดื่มชมพระอาทิตย์ตก ฟังดนตรี (เที่ยวอย่างมีสติ)'],
  ['koh-lipe-cafe-guide','eat-ranking','คาเฟ่และของหวานเกาะหลีเป๊ะ กาแฟสด สมูทตี้ วิวทะเล นั่งพักระหว่างวัน'],
]
const SEE = [
  ['koh-lipe-attractions','attraction','รวมที่เที่ยวเกาะหลีเป๊ะที่ต้องไป สามหาด-ดำน้ำตื้น-เกาะอาดัง-หินงาม (ภาพรวม + cards)'],
  ['koh-lipe-pattaya-beach','attraction','หาดพัทยาเกาะหลีเป๊ะ หาดหลักทรายขาวละเอียดน้ำใส จุดเรือสปีดโบ๊ตจอด ที่พัก-ร้านหนาแน่นสุด'],
  ['koh-lipe-sunrise-beach','attraction','หาดซันไรส์เกาะหลีเป๊ะ หาดฝั่งตะวันออกดูพระอาทิตย์ขึ้น ทรายขาวยาวน้ำใส เงียบ มองเห็นเกาะอาดัง'],
  ['koh-lipe-sunset-beach','attraction','หาดซันเซ็ตเกาะหลีเป๊ะ หาดเล็กฝั่งตะวันตกเงียบสงบ ดูพระอาทิตย์ตก เดินจากหาดพัทยาไม่ไกล'],
  ['koh-lipe-snorkeling','attraction','ดำน้ำตื้นเกาะหลีเป๊ะ ทริปเรือหางยาวหินงาม-จาบัง-เกาะยาง น้ำใสปะการังและฝูงปลา โปรแกรมและราคา'],
  ['koh-lipe-koh-adang','attraction','เกาะอาดัง จุดชมวิวผาชะโด เดินขึ้นมองเห็นหลีเป๊ะและทะเลใสทั้งอ่าว หาดเงียบและน้ำตก'],
  ['koh-lipe-hin-ngam-stone-beach','attraction','เกาะหินงามเกาะหลีเป๊ะ หาดหินกลมดำมันวาว ตำนานคำสาปห้ามเอาหินกลับ จุดถ่ายรูปในทริปดำน้ำ'],
  ['koh-lipe-diving','attraction','ดำน้ำลึกเกาะหลีเป๊ะ จุดดำน้ำในเขตตะรุเตา ปะการังและฝูงปลา ร้านดำน้ำ คอร์สมือใหม่-มือโปร'],
  ['koh-lipe-tarutao-park','attraction','อุทยานแห่งชาติตะรุเตา หมู่เกาะที่หลีเป๊ะอยู่ในเขต น้ำใสปะการังสมบูรณ์ ค่าเข้าอุทยาน ช่วยรักษาธรรมชาติ'],
]
const PLAN = [
  ['koh-lipe-2d1n-itinerary','itinerary','แผนเกาะหลีเป๊ะ 2 วัน 1 คืน หาดพัทยา-ดำน้ำตื้น-วอล์กกิ้งสตรีท ใช้ block day'],
  ['koh-lipe-3d2n-itinerary','itinerary','แผนเกาะหลีเป๊ะ 3 วัน 2 คืน ครบสามหาด-ดำน้ำเกาะรอบ ๆ-ผาชะโด ใช้ block day'],
  ['koh-lipe-snorkeling-day-trip-plan','itinerary','แผนทริปดำน้ำตื้นเต็มวันเกาะหลีเป๊ะ หินงาม-จาบัง-เกาะยาง-เกาะอาดัง ใช้ block day'],
  ['koh-lipe-couple-plan','itinerary','แผนเกาะหลีเป๊ะสายคู่รัก หาดเงียบ-ดินเนอร์ริมทะเล-ดำน้ำ-พระอาทิตย์ตก ใช้ block day'],
  ['koh-lipe-family-plan','itinerary','แผนเกาะหลีเป๊ะสายครอบครัว หาดตื้น-ดำน้ำตื้นปลอดภัย-เดินเล่นเกาะ ใช้ block day'],
  ['koh-lipe-first-timer-guide','itinerary','มาเกาะหลีเป๊ะครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-lipe-travel-tips','prep','เตรียมตัวเที่ยวเกาะหลีเป๊ะ (ช่วงเปิดเกาะ พ.ย.-เม.ย. เลี่ยงมรสุม พ.ค.-ต.ค. ที่พัก/เรือปิด ค่าเข้าอุทยานตะรุเตา ของบนเกาะแพง เก็บขยะกลับ ไม่แตะปะการัง งบ)'],
  ['koh-lipe-getting-around','prep','การเดินทางไป-รอบเกาะหลีเป๊ะ (สปีดโบ๊ตจากปากบารา สตูล/ตรัง/ลังกาวี เรือหางยาวรอบเกาะ เดินบนเกาะ ไม่มีรถ ท่าเรือลอยน้ำ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะหลีเป๊ะ (จ.สตูล) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-lipe", crumbCity="เกาะหลีเป๊ะ", crumbCityHref="city-koh-lipe.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: หลีเป๊ะเปิดเป็นฤดู มรสุม พ.ค.-ต.ค. ทะเลแรงที่พัก/เรือปิด บอกตรง · ดำน้ำเช็กสภาพอากาศและความปลอดภัย · ของบนเกาะราคาสูงกว่าฝั่ง · ย้ำไม่แตะ/เก็บปะการังและหิน เก็บขยะกลับ
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-lipe.html และ top10-hotels-koh-lipe.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

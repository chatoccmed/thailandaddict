export const meta = {
  name: 'huahin-articles',
  description: 'Hua Hin (หัวหิน) destination — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (seafood, cafe, night market, cicada, international)' },
    { title: 'See', detail: '13 attraction articles (beach, railway, khao takiab, vineyard, sam roi yot)' },
    { title: 'Plan', detail: '11 itineraries (2D1N, 3D2N, bangkok, sam roi yot, family)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['huahin-food-guide','food','รวมของกินหัวหินที่ต้องลอง อาหารทะเล ตลาดโต้รุ่ง คาเฟ่ ของฝาก (ภาพรวม + ย่าน/ราคา)'],
  ['huahin-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลหัวหิน กุ้ง หอย ปู ปลาสดริมทะเล-ท่าเทียบเรือ ที่คนไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['huahin-cafe-guide','eat-ranking','คาเฟ่หัวหิน วิวทะเล-ไร่องุ่น-วินเทจ กาแฟดี นั่งชิลถ่ายรูป'],
  ['huahin-night-market','food','ตลาดโต้รุ่งหัวหินยามเย็น อาหารทะเลเผา ของย่าง สตรีทฟู้ด ของกินเล่น คึกคักทุกคืน'],
  ['huahin-cicada-market','food','ตลาดซิเคด้าและตลาดนัดหัวหิน ของกินแนวคราฟต์ ดนตรีสด คาเฟ่ บรรยากาศชิลตอนค่ำ'],
  ['huahin-rooftop-bars','eat-ranking','รูฟท็อปบาร์หัวหิน วิวทะเลอ่าวหัวหิน นั่งดื่มชมพระอาทิตย์ตก (เที่ยวอย่างมีสติ)'],
  ['huahin-street-food','eat-ranking','สตรีทฟู้ดหัวหิน ก๋วยเตี๋ยว ของย่าง ข้าวแกง ในตลาดและตรอกซอยที่คนท้องถิ่นกิน'],
  ['huahin-vegan-healthy','eat-ranking','ร้านวีแกน/อาหารสุขภาพหัวหิน สมูทตี้โบวล์ อาหารคลีน รองรับสายเวลเนส'],
  ['huahin-international-food','eat-ranking','ร้านอาหารฝรั่ง/นานาชาติหัวหิน อิตาเลียน เยอรมัน เมดิเตอร์เรเนียน ย่านตลาดฉัตรไชย-ซอยหัวหิน'],
  ['huahin-local-thai-food','eat-ranking','ร้านอาหารไทยถิ่นหัวหิน ตามสั่ง ข้าวแกง รสจัด ราคาคนท้องถิ่น'],
  ['huahin-dessert-cafe','food','ของหวานและคาเฟ่ขนมหัวหิน เบเกอรี ไอศกรีม ขนมไทยเก่าแก่ ร้านนั่งชิล'],
]
const SEE = [
  ['huahin-attractions','attraction','รวมที่เที่ยวหัวหินที่ต้องไป หาด-สถานีรถไฟ-เขาตะเกียบ-ไร่องุ่น-เพลินวาน-เขาสามร้อยยอด (ภาพรวม + cards)'],
  ['huahin-beach','attraction','หาดหัวหิน หาดทรายยาวกลางเมือง เดินเล่นริมทะเล ขี่ม้าชายหาด ร้านริมหาด ที่พักติดทะเล'],
  ['huahin-railway-station','attraction','สถานีรถไฟหัวหิน สถานีไม้สีแดงเก่าแก่พร้อมพลับพลาพระมงกุฎเกล้า สถาปัตยกรรมคลาสสิก แลนด์มาร์กถ่ายรูป'],
  ['huahin-khao-takiab','attraction','เขาตะเกียบหัวหิน เขาเล็กริมทะเลปลายหาด วัดและพระบนยอด ขึ้นไหว้พระชมวิวและดูลิง ระวังลิงแย่งของ'],
  ['huahin-plearn-wan','attraction','เพลินวานหัวหิน หมู่บ้านวินเทจจำลองตลาดเก่า ร้านขนม ของเล่นย้อนยุค มุมถ่ายรูปเรโทร เหมาะครอบครัว'],
  ['huahin-santorini-park','attraction','ซานโตรินีพาร์ค สวนสนุกธีมเมืองกรีซ อาคารสีขาว-ฟ้า เครื่องเล่นและมุมถ่ายรูป ทางหัวหิน-ชะอำ เหมาะครอบครัว'],
  ['huahin-vana-nava-waterpark','attraction','สวนน้ำหัวหิน วานา นาวา-แบล็คเมาน์เทน เครื่องเล่นทางน้ำ สไลเดอร์ เหมาะครอบครัวและเด็ก'],
  ['huahin-swiss-sheep-farm','attraction','สวิสชีพฟาร์มหัวหิน ฟาร์มแกะธีมยุโรป ให้อาหารแกะ มุมถ่ายรูปน่ารัก เหมาะครอบครัวและคู่รัก'],
  ['huahin-monsoon-valley-vineyard','attraction','ไร่องุ่นมอนซูนวัลเลย์หัวหิน ไร่องุ่นและโรงผลิตไวน์ นั่งรถชมไร่ ชิมไวน์ วิวภูเขา สายธรรมชาติและคาเฟ่'],
  ['huahin-wat-huay-mongkol','attraction','วัดห้วยมงคลหัวหิน รูปหล่อหลวงปู่ทวดองค์ใหญ่ จุดกราบไหว้ขอพรยอดนิยม มีตลาดและลานกว้างรอบวัด'],
  ['huahin-khao-sam-roi-yot','attraction','อุทยานเขาสามร้อยยอด ถ้ำพระยานคร พระที่นั่งคูหาคฤหาสน์กลางถ้ำ จุดแสงลอดสวย ทุ่งน้ำ ขับจากหัวหินไปเที่ยว'],
  ['huahin-pa-la-u-waterfall','attraction','น้ำตกป่าละอูหัวหิน น้ำตกหลายชั้นในป่าแก่งกระจาน น้ำใสเย็น เดินป่าดูธรรมชาติ เหมาะสายธรรมชาติ'],
  ['huahin-viewpoint','attraction','จุดชมวิวหัวหิน เขาหินเหล็กไฟ มองเห็นเมืองหัวหินและทะเลอ่าวไทย จุดถ่ายรูปพระอาทิตย์ตก'],
]
const PLAN = [
  ['huahin-1-day-itinerary','itinerary','แผนเที่ยวหัวหิน 1 วัน สถานีรถไฟ-หาด-เขาตะเกียบ-ตลาดโต้รุ่ง ใช้ block day'],
  ['huahin-2d1n-itinerary','itinerary','แผนหัวหิน 2 วัน 1 คืน หาด-สถานีรถไฟ-ซิเคด้า-ไร่องุ่น ใช้ block day'],
  ['huahin-3d2n-itinerary','itinerary','แผนหัวหิน 3 วัน 2 คืน ครบเพลินวาน-ซานโตรินี-เขาสามร้อยยอด ใช้ block day'],
  ['huahin-bangkok-plan','itinerary','แผนกรุงเทพ-หัวหิน ขับรถพักผ่อนสุดสัปดาห์ริมทะเล ใช้ block day'],
  ['huahin-sam-roi-yot-plan','itinerary','แผนหัวหิน-เขาสามร้อยยอด ถ้ำพระยานคร-ทุ่งสามร้อยยอด เที่ยวธรรมชาติ ใช้ block day'],
  ['huahin-family-plan','itinerary','แผนหัวหินสายครอบครัว สวนน้ำ-ซานโตรินี-สวิสชีพฟาร์ม-หาด ใช้ block day'],
  ['huahin-couple-plan','itinerary','แผนหัวหินสายคู่รัก ไร่องุ่น-รูฟท็อป-ดินเนอร์ริมทะเล ใช้ block day'],
  ['huahin-cafe-tour-plan','itinerary','แผนหัวหินสายคาเฟ่ ไร่องุ่น-คาเฟ่ริมทะเล-เพลินวาน ใช้ block day'],
  ['huahin-budget-plan','itinerary','แผนงบประหยัดหัวหิน ของกินถูก หาดฟรี เที่ยวคุ้ม ใช้ block day'],
  ['huahin-photo-spots-plan','itinerary','แผนสายถ่ายรูปหัวหิน สถานีรถไฟ-ซานโตรินี-ไร่องุ่น-เขาตะเกียบ ใช้ block day'],
  ['huahin-first-timer-guide','itinerary','มาหัวหินครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['huahin-travel-tips','prep','เตรียมตัวเที่ยวหัวหิน (ช่วงเวลาดีสุด พ.ย.-ก.พ. การจองวันหยุดยาว ความปลอดภัยเล่นน้ำดูธงเตือน ระวังลิงเขาตะเกียบ งบ)'],
  ['huahin-getting-around','prep','การเดินทางไป-รอบหัวหิน (รถตู้/รถทัวร์/รถไฟจากกรุงเทพ สนามบินหัวหิน รถสองแถว/แท็กซี่ในเมือง เช่ารถ/มอเตอร์ไซค์ ระยะทางจุดเที่ยว)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวหัวหิน (จ.ประจวบคีรีขันธ์) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="huahin", crumbCity="หัวหิน", crumbCityHref="city-huahin.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: หาดหัวหินคลื่นลมแรงบางช่วง เตือนดูธงเตือนก่อนเล่นน้ำ · เขาตะเกียบระวังลิงแย่งของ · ราคาห้อง/ทัวร์สวิงตามฤดู-วันหยุดยาว บอกตรง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-huahin.html และ top10-hotels-huahin.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

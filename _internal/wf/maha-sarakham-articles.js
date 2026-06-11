export const meta = {
  name: 'maha-sarakham-articles',
  description: 'Maha Sarakham (มหาสารคาม) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Na Dun stupa + Khmer ku + university town)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['maha-sarakham-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานมหาสารคาม ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['maha-sarakham-university-food','eat-ranking','ของกินรอบมหาวิทยาลัยมหาสารคาม ย่านท่าขอนยาง ร้านข้าว ตามสั่ง ของกินเล่นราคานักศึกษา เปิดยาวถึงดึก'],
  ['maha-sarakham-cafe-guide','eat-ranking','คาเฟ่มหาสารคาม รอบมหาวิทยาลัยและในเมือง นั่งทำงาน กาแฟดี ถ่ายรูป'],
  ['maha-sarakham-mookata','eat-ranking','หมูกระทะและจิ้มจุ่มมหาสารคาม ร้านยอดนิยม คุ้มราคา มื้อเย็นนักศึกษา'],
  ['maha-sarakham-sai-krok-mam','food','ไส้กรอกอีสานและหม่ำมหาสารคาม ของหมักย่างรสเปรี้ยว ของกินเล่นและของฝากคู่เมือง แหล่งซื้อ'],
  ['maha-sarakham-kaeng-loeng-chan-food','food','ของกินริมแก่งเลิงจาน ก๋วยเตี๋ยว ของย่าง ของกินเล่น นั่งรับลมเย็นริมอ่างเก็บน้ำ'],
  ['maha-sarakham-street-food','food','สตรีทฟู้ดและตลาดโต้รุ่งมหาสารคาม ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['maha-sarakham-local-breakfast','food','อาหารเช้าแบบคนมหาสารคาม (ข้าวเหนียวหมูปิ้ง ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['maha-sarakham-plara-fermented','food','ปลาร้าและของหมักพื้นบ้านมหาสารคาม แจ่วบอง ของหมักรสจัด เครื่องคู่ครัวอีสาน หาซื้อตลาดสด'],
  ['maha-sarakham-souvenir-food','food','ของฝากกินได้มหาสารคาม (ไส้กรอกอีสาน หม่ำ ปลาร้า แจ่วบอง ของหมักพื้นบ้าน แหล่งซื้อ)'],
  ['maha-sarakham-local-dessert','food','ของหวานและขนมพื้นถิ่นมหาสารคาม ขนมอีสาน ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['maha-sarakham-attractions','attraction','รวมที่เที่ยวมหาสารคามที่ต้องไป คละพระธาตุนาดูน/กู่ขอม/แก่งเลิงจาน/บ้านหม้อ/เมืองนักศึกษา (ภาพรวม + cards)'],
  ['phra-that-na-dun','attraction','พระธาตุนาดูน พุทธมณฑลอีสาน อำเภอนาดูน ที่ค้นพบพระบรมสารีริกธาตุและโบราณวัตถุสมัยทวารวดี การเดินทาง'],
  ['ku-santarat','attraction','กู่สันตรัตน์ ปราสาทหินสมัยขอม อโรคยาศาลเก่าในอำเภอนาดูน ร่องรอยอารยธรรมขอม โครงสร้างศิลาแลง'],
  ['ku-ban-khwao','attraction','กู่บ้านเขวา กู่โบราณสมัยขอมในอำเภอเมืองมหาสารคาม เหมาะตามรอยปราสาทหินเก่าแก่ของอีสาน'],
  ['kaeng-loeng-chan','attraction','แก่งเลิงจาน อ่างเก็บน้ำใกล้เมือง ทางปั่นจักรยาน จุดนั่งชมวิวริมน้ำ ที่พักผ่อนของคนมหาสารคาม'],
  ['don-pu-ta-monkey','attraction','ดอนเจ้าปู่บ้านหนองคู ป่าดอนปู่ตาที่มีฝูงลิงอาศัย คนแวะให้อาหารลิงและเดินเล่นในร่มไม้'],
  ['ban-mo-pottery','attraction','หมู่บ้านปั้นหม้อบ้านหม้อ อำเภอเมือง หมู่บ้านเครื่องปั้นดินเผาเก่าแก่ ดูชาวบ้านปั้นหม้อดินด้วยมือ'],
  ['mahasarakham-university','attraction','มหาวิทยาลัยมหาสารคาม วิทยาเขตใหญ่ ย่านนักศึกษาคึกคักรอบรั้ว ร้านอาหาร คาเฟ่ บรรยากาศเมืองนักศึกษา'],
  ['wat-mahachai','attraction','วัดมหาชัยและพระอุรังคธาตุ วัดเก่าใจกลางเมือง เก็บคัมภีร์ใบลานและของโบราณ ที่ยึดเหนี่ยวจิตใจคนเมือง'],
  ['maha-sarakham-khmer-ku-trail','attraction','เส้นทางกู่ขอมมหาสารคาม กู่สันตรัตน์-กู่บ้านเขวา-พระธาตุนาดูน เที่ยวประวัติศาสตร์อีสานกลาง'],
  ['maha-sarakham-dvaravati-history','attraction','ร่องรอยทวารวดีมหาสารคาม ใบเสมาหิน พระพิมพ์ดินเผา โบราณวัตถุที่ขุดพบ พิพิธภัณฑ์และของเก่าเมือง'],
  ['maha-sarakham-nature','attraction','ธรรมชาติรอบมหาสารคาม แก่งเลิงจาน ดอนปู่ตา ป่าและอ่างเก็บน้ำใกล้เมือง พักผ่อนปั่นจักรยาน'],
]
const PLAN = [
  ['maha-sarakham-1-day-itinerary','itinerary','แผนเที่ยวมหาสารคาม 1 วัน เมือง-แก่งเลิงจาน หรือ พระธาตุนาดูนวันเดียว ใช้ block day'],
  ['maha-sarakham-2d1n-itinerary','itinerary','แผนมหาสารคาม 2 วัน 1 คืน เที่ยวเมือง-พระธาตุนาดูน-กู่ขอม ใช้ block day'],
  ['maha-sarakham-3d2n-itinerary','itinerary','แผนมหาสารคาม 3 วัน 2 คืน เมือง+พระธาตุ+กู่ขอม+แก่งเลิงจาน ใช้ block day'],
  ['maha-sarakham-cafe-student-plan','itinerary','แผนสายคาเฟ่และของกินย่านนักศึกษา ท่าขอนยาง-รอบมหาวิทยาลัย ใช้ block day'],
  ['maha-sarakham-archaeology-plan','itinerary','แผนสายโบราณคดี ตามรอยกู่ขอมและพระธาตุนาดูน ใช้ block day'],
  ['maha-sarakham-nature-plan','itinerary','แผนสายธรรมชาติ แก่งเลิงจาน-ดอนปู่ตา-บ้านหม้อ ใช้ block day'],
  ['maha-sarakham-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระธาตุนาดูน กู่ขอม แก่งเลิงจาน คาเฟ่) ใช้ block day'],
  ['maha-sarakham-khon-kaen-plan','itinerary','แผนข้ามจังหวัด มหาสารคาม–ขอนแก่น ทริปอีสานกลางสองเมือง ใช้ block day'],
  ['maha-sarakham-roi-et-plan','itinerary','แผนข้ามจังหวัด มหาสารคาม–ร้อยเอ็ด เที่ยวพระธาตุและเมืองอีสานใกล้กัน ใช้ block day'],
  ['maha-sarakham-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ดอนปู่ตาลิง แก่งเลิงจาน บ้านหม้อ คาเฟ่) ใช้ block day'],
  ['maha-sarakham-budget-plan','itinerary','แผนงบประหยัดแบบนักศึกษา เที่ยวมหาสารคามคุ้ม ของกินถูก ใช้ block day'],
  ['maha-sarakham-first-timer-guide','itinerary','มามหาสารคามครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['maha-sarakham-travel-tips','prep','เตรียมตัวเที่ยวมหาสารคาม (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ. ช่วงเปิดเทอมเมืองคึกคัก อากาศ งบ การแต่งตัว)'],
  ['maha-sarakham-getting-around','prep','การเดินทางในมหาสารคาม (บขส.จากกรุงเทพ-ขอนแก่น เช่ารถ ไปนาดูน-พระธาตุ-แก่งเลิงจานยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวมหาสารคาม ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="maha-sarakham", crumbCity="มหาสารคาม", crumbCityHref="city-maha-sarakham.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-maha-sarakham.html และ top10-hotels-maha-sarakham.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

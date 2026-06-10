export const meta = {
  name: 'khon-kaen-articles',
  description: 'Khon Kaen (ขอนแก่น) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (city + nature + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['khon-kaen-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานขอนแก่น ส้มตำ ลาบ ก้อย น้ำตก ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['khon-kaen-grilled-chicken-somtam','eat-ranking','ไก่ย่างและส้มตำริมบึงแก่นนคร ร้านเด็ด นั่งรับลมริมน้ำ'],
  ['khon-kaen-mookata-jimjum','eat-ranking','หมูกระทะและจิ้มจุ่มขอนแก่น ร้านยอดนิยม คุ้มราคา'],
  ['khon-kaen-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ขอนแก่น ในเมืองและรอบ ม.ขอนแก่น นั่งทำงาน ถ่ายรูป'],
  ['khao-niao-road-street-food','food','ถนนข้าวเหนียว ย่านกลางคืนขอนแก่น ของย่าง ของทอด ร้านนั่งดื่ม'],
  ['khon-kaen-local-breakfast','food','อาหารเช้าแบบคนขอนแก่น (ขนมจีนน้ำยา ก๋วยจั๊บญวน กาแฟ ตลาดเช้า)'],
  ['khon-kaen-noodle-shops','eat-ranking','ร้านก๋วยเตี๋ยวและก๋วยจั๊บญวนเส้นใหญ่เด็ด ๆ ในขอนแก่น'],
  ['khon-kaen-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองขอนแก่น'],
  ['khon-kaen-mum-sausage','food','หม่ำและไส้กรอกอีสานขอนแก่น ของหมักรสเปรี้ยว กินกับข้าวเหนียว ของฝาก'],
  ['khon-kaen-souvenir-food','food','ของฝากกินได้ขอนแก่น (หม่ำ ไส้กรอกอีสาน ของแห้ง แหล่งซื้อ)'],
  ['khon-kaen-night-market','food','ตลาดกลางคืนขอนแก่น (ตลาดต้นตาล ตลาดโต้รุ่ง) เดินกินของอีสาน'],
]
const SEE = [
  ['khon-kaen-attractions','attraction','รวมที่เที่ยวขอนแก่นที่ต้องไป คละเมือง/ธรรมชาติ/วัฒนธรรม (ภาพรวม + cards)'],
  ['bueng-kaen-nakhon','attraction','บึงแก่นนคร ทะเลสาบกลางเมือง ทางวิ่ง สวนริมน้ำ ร้านอาหารริมบึง'],
  ['phu-wiang-dinosaur-museum','attraction','พิพิธภัณฑ์ไดโนเสาร์ภูเวียง ฟอสซิลขุดจริง โครงกระดูก เส้นทางชม ค่าเข้า การเดินทาง'],
  ['wat-nong-waeng','attraction','วัดหนองแวง พระมหาธาตุแก่นนคร เจดีย์เก้าชั้นริมบึง ขึ้นชมวิวเมือง'],
  ['ubolratana-dam','attraction','เขื่อนอุบลรัตน์ อ่างเก็บน้ำกว้าง แพอาหารริมน้ำ จุดชมพระอาทิตย์ตก'],
  ['phu-kao-phu-phan-kham-national-park','attraction','อุทยานแห่งชาติภูเก้า-ภูพานคำ จุดชมวิวเหนือเขื่อน ลานหิน เส้นทางเดินป่า'],
  ['cobra-village-khok-sa-nga','attraction','หมู่บ้านงูจงอางบ้านโคกสง่า อำเภอน้ำพอง การแสดงงู เรื่องคนกับงู'],
  ['phra-that-kham-kaen','attraction','พระธาตุขามแก่น พระธาตุเก่าแก่คู่เมือง อำเภอน้ำพอง ที่มาของชื่อขอนแก่น'],
  ['khon-kaen-old-town','attraction','ศาลหลักเมืองและย่านเมืองเก่าขอนแก่น ตลาด ร้านเก่า เดินดูชีวิตคนเมือง'],
  ['khon-kaen-silk-village','attraction','หมู่บ้านผ้าไหมมัดหมี่ชนบทขอนแก่น ดูการทอ เลือกซื้อผ้าไหม งานไหม'],
  ['khon-kaen-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติขอนแก่น ใบเสมาทวารวดี โบราณวัตถุอีสาน'],
  ['wat-thung-setthi','attraction','วัดทุ่งเศรษฐี เจดีย์ขาวกลางทุ่ง จุดถ่ายรูปและไหว้พระแถบชานเมือง'],
]
const PLAN = [
  ['khon-kaen-1-day-itinerary','itinerary','แผนเที่ยวขอนแก่น 1 วัน เมือง+บึงแก่นนคร+วัดหนองแวง ใช้ block day'],
  ['khon-kaen-2d1n-itinerary','itinerary','แผนขอนแก่น 2 วัน 1 คืน เที่ยวเมือง-บึงแก่นนคร-ของกิน ใช้ block day'],
  ['khon-kaen-3d2n-itinerary','itinerary','แผนขอนแก่น 3 วัน 2 คืน เมือง+ภูเวียง+เขื่อนอุบลรัตน์ ใช้ block day'],
  ['khon-kaen-cafe-plan','itinerary','แผนสายคาเฟ่และของกินในเมืองขอนแก่น ใช้ block day'],
  ['khon-kaen-nature-plan','itinerary','แผนสายธรรมชาติ ภูเวียง-เขื่อนอุบลรัตน์-ภูพานคำ ใช้ block day'],
  ['khon-kaen-culture-silk-plan','itinerary','แผนสายวัฒนธรรม ผ้าไหมมัดหมี่-วัดหนองแวง-พระธาตุขามแก่น ใช้ block day'],
  ['khon-kaen-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ไดโนเสาร์ภูเวียง บึงแก่นนคร หมู่บ้านงู) ใช้ block day'],
  ['khon-kaen-udon-plan','itinerary','แผนข้ามจังหวัด ขอนแก่น–อุดรธานี ทริปอีสานตอนบนสองเมือง ใช้ block day'],
  ['khon-kaen-korat-plan','itinerary','แผนข้ามจังหวัด ขอนแก่น–นครราชสีมา เส้นถนนมิตรภาพสู่อีสาน ใช้ block day'],
  ['khon-kaen-chaiyaphum-plan','itinerary','แผนข้ามจังหวัด ขอนแก่น–ชัยภูมิ ทุ่งดอกกระเจียว-น้ำตก ใช้ block day'],
  ['khon-kaen-maha-sarakham-plan','itinerary','แผนข้ามจังหวัด ขอนแก่น–มหาสารคาม เมืองตักสิลา-พระธาตุนาดูน ใช้ block day'],
  ['khon-kaen-first-timer-guide','itinerary','มาขอนแก่นครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['khon-kaen-travel-tips','prep','เตรียมตัวเที่ยวขอนแก่น (ช่วงเวลาดีสุด งานไหม อากาศ งบ การแต่งตัว ของที่ควรเตรียม)'],
  ['khon-kaen-getting-around','prep','การเดินทางในขอนแก่น (สนามบินขอนแก่น/รถไฟ/บขส. เช่ารถ ถนนมิตรภาพ ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวขอนแก่น ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="khon-kaen", crumbCity="ขอนแก่น", crumbCityHref="city-khon-kaen.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-khon-kaen.html และ top10-hotels-khon-kaen.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean (เช่น ตอบโจทย์→ตรงใจ/เหมาะ, โดดเด่น→เด่น, ระดับโลก→ที่คนทั่วโลกรู้จัก, สุดยอด→เด็ด, อันซีน→มุมลับ/คนยังไปไม่ทั่ว) แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

let done = []
for (const group of [['Food',FOOD],['See',SEE],['Plan',PLAN],['Prep',PREP]]) {
  const [ph, list] = group
  const ref = ph==='Food' ? 'tourlogy-food-writer' : 'tourlogy-attraction-writer'
  log(`Phase ${ph}: ${list.length} articles`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,ref), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Articles written: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

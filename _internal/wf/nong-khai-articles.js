export const meta = {
  name: 'nong-khai-articles',
  description: 'Nong Khai (หนองคาย) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Mekong + culture + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nong-khai-vietnamese-food','eat-ranking','จัดอันดับร้านอาหารเวียดนามหนองคาย แหนมเนือง หมูยอ ปอเปี๊ยะสด ร้านที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['nong-khai-mekong-fish','eat-ranking','ร้านปลาแม่น้ำโขงริมโขงหนองคาย ปลาเผา ต้มยำ ลาบปลา ปลาคัง นั่งรับลมวิวลาว'],
  ['nong-khai-isan-food','eat-ranking','ร้านอาหารอีสานหนองคาย ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไป'],
  ['nong-khai-kuay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนและข้าวเปียกเส้นหนองคาย เส้นแป้งญวนนุ่ม น้ำซุปใส ร้านเช้าเด็ด'],
  ['nong-khai-riverside-cafe','eat-ranking','คาเฟ่ริมโขงหนองคาย วิวแม่น้ำฝั่งลาว นั่งจิบกาแฟเช้า-เย็น'],
  ['nong-khai-local-breakfast','food','อาหารเช้าแบบคนหนองคาย (ก๋วยจั๊บญวน ข้าวเปียกเส้น กาแฟ ตลาดเช้า)'],
  ['nong-khai-mookata','eat-ranking','หมูกระทะและปิ้งย่างหนองคาย ร้านยอดนิยม คุ้มราคา ย่านริมโขง'],
  ['nong-khai-walking-street-food','food','ถนนคนเดินริมโขงหนองคาย ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมพร้อมวิวแม่น้ำ'],
  ['nong-khai-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองหนองคาย'],
  ['nong-khai-souvenir-food','food','ของฝากกินได้หนองคาย (หมูยอ แหนม ไส้กรอกอีสาน ของแห้ง แหล่งซื้อ)'],
  ['tha-sadet-market-food','food','ของกินตลาดท่าเสด็จริมโขง ของกินลาว-เวียดนาม ของแห้ง เดินชิมและซื้อกลับ'],
]
const SEE = [
  ['nong-khai-attractions','attraction','รวมที่เที่ยวหนองคายที่ต้องไป คละริมโขง/วัฒนธรรม/ธรรมชาติ (ภาพรวม + cards)'],
  ['mekong-promenade-naga','attraction','ทางเดินริมโขงและลานพญานาคหนองคาย จุดถ่ายรูป นั่งรับลมเย็น มองฝั่งลาว ถนนคนเดิน'],
  ['sala-kaew-ku','attraction','ศาลาแก้วกู่ สวนรูปปั้นปูนขนาดใหญ่ พญานาคเจ็ดเศียร ปริศนาธรรม ปู่บุญเหลือ ค่าเข้า การเดินทาง'],
  ['wat-pho-chai','attraction','วัดโพธิ์ชัย หลวงพ่อพระใส พระคู่บ้านคู่เมืองหนองคาย กราบขอพร ประวัติ'],
  ['tha-sadet-market','attraction','ตลาดท่าเสด็จ ตลาดริมโขง ของฝากของกินจากลาว-เวียดนาม ผ้าทอ ของแห้ง'],
  ['thai-lao-friendship-bridge','attraction','สะพานมิตรภาพไทย-ลาว ข้ามแม่น้ำโขงไปเวียงจันทน์ ขั้นตอนข้ามแดน ไปเช้าเย็นกลับ'],
  ['naga-fireballs','attraction','บั้งไฟพญานาค ปรากฏการณ์ลูกไฟลอยจากลำโขงช่วงออกพรรษา จุดชมโพนพิสัย-รัตนวาปี ช่วงเวลา'],
  ['wat-pha-tak-suea','attraction','วัดผาตากเสื้อ สกายวอล์กพื้นกระจกเหนือหุบเขา วิวแม่น้ำโขงคดเคี้ยว การเดินทาง'],
  ['wat-hin-mak-peng','attraction','วัดหินหมากเป้ง สำนักปฏิบัติธรรมริมโขง ป่าและก้อนหินใหญ่ บรรยากาศสงบ'],
  ['phon-phisai','attraction','อำเภอโพนพิสัย เมืองริมโขงจุดชมบั้งไฟพญานาค กินปลาน้ำโขง เดินเล่นริมน้ำ'],
  ['phra-that-bang-phuan','attraction','พระธาตุบังพวน เจดีย์เก่าแก่และสัตตมหาสถาน โบราณสถานสำคัญของหนองคาย'],
  ['than-thong-waterfall','attraction','น้ำตกธารทอง อำเภอสังคม ลานหินริมน้ำตก เส้นทางริมโขงสังคมวิวสวย'],
]
const PLAN = [
  ['nong-khai-1-day-itinerary','itinerary','แผนเที่ยวหนองคาย 1 วัน ริมโขง-ศาลาแก้วกู่-วัดโพธิ์ชัย ใช้ block day'],
  ['nong-khai-2d1n-itinerary','itinerary','แผนหนองคาย 2 วัน 1 คืน ริมโขง-ศาลาแก้วกู่-ตลาดท่าเสด็จ ใช้ block day'],
  ['nong-khai-3d2n-itinerary','itinerary','แผนหนองคาย 3 วัน 2 คืน เมือง+วัดผาตากเสื้อ+สังคมริมโขง ใช้ block day'],
  ['nong-khai-riverside-plan','itinerary','แผนสายริมโขง ทางเดินริมน้ำ-ตลาดท่าเสด็จ-คาเฟ่วิวแม่น้ำ ใช้ block day'],
  ['nong-khai-nature-plan','itinerary','แผนสายธรรมชาติ วัดผาตากเสื้อ-วัดหินหมากเป้ง-สังคมริมโขง ใช้ block day'],
  ['nong-khai-temple-faith-plan','itinerary','แผนสายวัด-ศรัทธา วัดโพธิ์ชัย-ศาลาแก้วกู่-พระธาตุบังพวน ใช้ block day'],
  ['nong-khai-vientiane-crossing-plan','itinerary','แผนข้ามแดน ไปเวียงจันทน์แบบไปเช้าเย็นกลับ ผ่านสะพานมิตรภาพ ใช้ block day'],
  ['nong-khai-naga-fireballs-plan','itinerary','แผนทริปบั้งไฟพญานาคช่วงออกพรรษา โพนพิสัย-รัตนวาปี ใช้ block day'],
  ['nong-khai-udon-plan','itinerary','แผนข้ามจังหวัด หนองคาย–อุดรธานี เที่ยวเมืองและทะเลบัวแดง ใช้ block day'],
  ['nong-khai-bueng-kan-plan','itinerary','แผนข้ามจังหวัด หนองคาย–บึงกาฬ เส้นทางริมโขงและภูทอก ใช้ block day'],
  ['nong-khai-loei-plan','itinerary','แผนข้ามจังหวัด หนองคาย–เลย เส้นทางริมโขงเชียงคานและภูเขา ใช้ block day'],
  ['nong-khai-first-timer-guide','itinerary','มาหนองคายครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nong-khai-travel-tips','prep','เตรียมตัวเที่ยวหนองคาย (ช่วงเวลาดีสุด เทศกาลบั้งไฟพญานาคออกพรรษา อากาศ งบ การแต่งตัว ของที่ควรเตรียม)'],
  ['nong-khai-getting-around','prep','การเดินทางในหนองคาย (รถไฟหนองคาย/บขส. สนามบินอุดรใกล้สุด เช่ารถ ข้ามสะพานไปเวียงจันทน์ ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวหนองคาย ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nong-khai", crumbCity="หนองคาย", crumbCityHref="city-nong-khai.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nong-khai.html และ top10-hotels-nong-khai.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'udon-thani-articles',
  description: 'Udon Thani (อุดรธานี) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + culture + city)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['udon-vietnamese-food','eat-ranking','จัดอันดับร้านอาหารเวียดนามอุดรธานี แหนมเนือง ปอเปี๊ยะสด หมูยอ ร้านที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['udon-kuay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนอุดร เส้นแป้งญวนนุ่ม น้ำซุปใส ร้านดังที่คนต่อคิวมื้อเช้า'],
  ['udon-isan-food','eat-ranking','ร้านอาหารอีสานอุดร ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไป'],
  ['udon-cafe-guide','eat-ranking','จัดอันดับคาเฟ่อุดรธานี ในเมืองและชานเมือง นั่งทำงาน ถ่ายรูป'],
  ['udon-mookata','eat-ranking','หมูกระทะและปิ้งย่างอุดร ร้านยอดนิยม คุ้มราคา ย่านนักศึกษา'],
  ['udon-local-breakfast','food','อาหารเช้าแบบคนอุดร (ก๋วยจั๊บญวน ข้าวเปียกเส้น กาแฟ ตลาดเช้า)'],
  ['udon-nong-prajak-street-food','food','สตรีทฟู้ดรอบหนองประจักษ์และตลาดเย็นอุดร ของย่าง ของทอด ขนมหวาน'],
  ['udon-nong-han-fish','food','อาหารริมหนองหานกุมภวาปี ปลาน้ำจืด ปลาเผา ต้มยำ ผัดเผ็ด นั่งรับลม'],
  ['udon-dessert-cafe','eat-ranking','ของหวาน เบเกอรี ขนมเบื้องญวน คาเฟ่ขนมในเมืองอุดร'],
  ['udon-souvenir-food','food','ของฝากกินได้อุดร (แหนมเนือง หมูยอ ขนมเบื้องญวน แหล่งซื้อ)'],
  ['udon-night-market','food','ตลาดกลางคืนอุดร (UD Town ตลาดมุมเมือง) เดินกินของอีสาน-เวียดนาม'],
]
const SEE = [
  ['udon-attractions','attraction','รวมที่เที่ยวอุดรธานีที่ต้องไป คละธรรมชาติ/ประวัติศาสตร์/เมือง/ศรัทธา (ภาพรวม + cards)'],
  ['red-lotus-sea','attraction','ทะเลบัวแดง หนองหานกุมภวาปี หน้าหนาวบัวบานเต็มผิวน้ำ ล่องเรือเช้าตรู่ การเดินทาง ช่วงเวลา'],
  ['ban-chiang','attraction','แหล่งโบราณคดีบ้านเชียง มรดกโลก หลุมขุดค้น พิพิธภัณฑ์ ภาชนะดินเผาลายเขียนสี ค่าเข้า'],
  ['kham-chanot','attraction','คำชะโนด ป่ากลางน้ำ ตำนานพญานาคปู่ศรีสุทโธ การกราบไหว้ขอพร บรรยากาศ การเดินทาง'],
  ['nong-prajak-park','attraction','สวนสาธารณะหนองประจักษ์ ทางเดิน ลู่วิ่ง เป็ดเหลืองยักษ์ เรือปั่น ตลาดเย็นรอบบึง'],
  ['wat-pa-ban-tat','attraction','วัดป่าบ้านตาด หลวงตามหาบัว ป่าใหญ่กลางเมือง พิพิธภัณฑ์อัฐบริขาร แนวพระป่าอีสาน'],
  ['phu-foi-lom','attraction','ภูฝอยลม แหล่งท่องเที่ยวเชิงนิเวศบนเขา อากาศเย็น สวนพฤกษศาสตร์ น้ำตก กางเต็นท์หน้าหนาว'],
  ['phu-phra-bat-historical-park','attraction','อุทยานประวัติศาสตร์ภูพระบาท มรดกโลก หินทรายรูปแปลก เพิงหิน ภาพเขียนสี ตำนานนางอุสา'],
  ['than-ngam-waterfall','attraction','น้ำตกธารงาม วนอุทยานภูพระบาท ลานหิน ป่าเต็งรัง หน้าฝนน้ำแรง เดินเล่นรับธรรมชาติ'],
  ['chao-pu-ya-shrine','attraction','ศาลเจ้าปู่-ย่า อุดร ศาลเจ้าจีนริมหนองบัว มังกร-พญานาค สวนสวย จุดไหว้ขอพรกลางเมือง'],
  ['wat-pa-phu-kon','attraction','วัดป่าภูก้อน พระพุทธไสยาสน์หินอ่อนขาว บนเขาเขตป่านายูง สถาปัตยกรรมงาม วิวภูเขา'],
  ['udonthani-museum','attraction','พิพิธภัณฑ์เมืองอุดรธานี อาคารราชินูทิศเก่า ประวัติเมือง วิถีคนอุดร'],
]
const PLAN = [
  ['udon-1-day-itinerary','itinerary','แผนเที่ยวอุดร 1 วัน เมือง+หนองประจักษ์+ของกินเวียดนาม ใช้ block day'],
  ['udon-2d1n-itinerary','itinerary','แผนอุดร 2 วัน 1 คืน เมือง-หนองประจักษ์-บ้านเชียง ใช้ block day'],
  ['udon-3d2n-itinerary','itinerary','แผนอุดร 3 วัน 2 คืน เมือง+ทะเลบัวแดง+บ้านเชียง+คำชะโนด ใช้ block day'],
  ['udon-cafe-food-plan','itinerary','แผนสายกินและคาเฟ่อุดร อาหารเวียดนาม-คาเฟ่-ตลาดเย็น ใช้ block day'],
  ['udon-history-plan','itinerary','แผนสายประวัติศาสตร์ บ้านเชียง-ภูพระบาท มรดกโลกสองแห่ง ใช้ block day'],
  ['udon-nature-plan','itinerary','แผนสายธรรมชาติ ทะเลบัวแดง-ภูฝอยลม ใช้ block day'],
  ['udon-faith-plan','itinerary','แผนสายศรัทธา คำชะโนด-วัดป่าบ้านตาด-วัดป่าภูก้อน ใช้ block day'],
  ['udon-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หนองประจักษ์เป็ดเหลือง ทะเลบัวแดง บ้านเชียง) ใช้ block day'],
  ['udon-nong-khai-plan','itinerary','แผนข้ามจังหวัด อุดร–หนองคาย เที่ยวริมโขงและข้ามไปเวียงจันทน์ ใช้ block day'],
  ['udon-loei-plan','itinerary','แผนข้ามจังหวัด อุดร–เลย เส้นทางภูเขาและอากาศเย็น ใช้ block day'],
  ['udon-khon-kaen-plan','itinerary','แผนข้ามจังหวัด อุดร–ขอนแก่น ทริปอีสานตอนบนสองเมือง ใช้ block day'],
  ['udon-first-timer-guide','itinerary','มาอุดรครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['udon-travel-tips','prep','เตรียมตัวเที่ยวอุดรธานี (ช่วงเวลาดีสุด ฤดูทะเลบัวแดง อากาศ งบ การแต่งตัว ของที่ควรเตรียม)'],
  ['udon-getting-around','prep','การเดินทางในอุดรธานี (สนามบินอุดร/รถไฟ/บขส. เช่ารถ ไปทะเลบัวแดง/บ้านเชียง/คำชะโนด ข้ามไปลาว ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวอุดรธานี ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="udon-thani", crumbCity="อุดรธานี", crumbCityHref="city-udon-thani.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-udon-thani.html และ top10-hotels-udon-thani.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

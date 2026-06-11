export const meta = {
  name: 'kalasin-articles',
  description: 'Kalasin (กาฬสินธุ์) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (dinosaurs + Lampao + Phu Phan + Praewa silk)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['kalasin-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานกาฬสินธุ์ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['kalasin-lampao-fish','eat-ranking','ร้านปลาน้ำจืดริมเขื่อนลำปาว ปลาเผา ต้มยำปลา ลาบปลา นั่งรับลมริมน้ำ ร้านเด็ด'],
  ['kalasin-cafe-guide','eat-ranking','คาเฟ่กาฬสินธุ์ ในเมือง นั่งชิล กาแฟดี ถ่ายรูป แวะพักระหว่างวัน'],
  ['kalasin-mookata','eat-ranking','หมูกระทะและจิ้มจุ่มกาฬสินธุ์ ร้านยอดนิยม คุ้มราคา มื้อเย็นครอบครัว'],
  ['kalasin-sai-krok-mam','food','ไส้กรอกอีสานและหม่ำกาฬสินธุ์ ของหมักย่างรสเปรี้ยว ของกินเล่นและของฝากประจำเมือง แหล่งซื้อ'],
  ['kalasin-phu-thai-food','food','อาหารผู้ไทกาฬสินธุ์ คำม่วง-กุฉินารายณ์ ต้มไก่ใส่ผัก ของหมักพื้นบ้าน รสเฉพาะถิ่น'],
  ['kalasin-street-food','food','สตรีทฟู้ดและตลาดเย็นกาฬสินธุ์ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['kalasin-local-breakfast','food','อาหารเช้าแบบคนกาฬสินธุ์ (ข้าวเหนียวหมูปิ้ง ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['kalasin-plara-jaewbong','food','ปลาร้าและแจ่วบองกาฬสินธุ์ เครื่องคู่ครัวอีสาน หาซื้อตลาดสด กินกับผักสด ของฝาก'],
  ['kalasin-souvenir-food','food','ของฝากกินได้กาฬสินธุ์ (ไส้กรอกอีสาน หม่ำ ปลาร้า แจ่วบอง ของหมักพื้นบ้าน แหล่งซื้อ)'],
  ['kalasin-local-dessert','food','ของหวานและขนมพื้นถิ่นกาฬสินธุ์ ขนมอีสาน ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['kalasin-attractions','attraction','รวมที่เที่ยวกาฬสินธุ์ที่ต้องไป คละไดโนเสาร์ภูกุ้มข้าว/เขื่อนลำปาว/ภูพาน/ผ้าไหมแพรวา/ผู้ไท (ภาพรวม + cards)'],
  ['sirindhorn-museum','attraction','พิพิธภัณฑ์สิรินธร สหัสขันธ์ พิพิธภัณฑ์ไดโนเสาร์ จัดแสดงโครงกระดูกและฟอสซิลยุคดึกดำบรรพ์ การเดินทาง ค่าเข้า เวลา'],
  ['phu-kum-khao','attraction','หลุมขุดค้นภูกุ้มข้าว ฟอสซิลไดโนเสาร์ของจริงข้างพิพิธภัณฑ์สิรินธร เห็นกระดูกฝังในชั้นหินตามจุดที่ขุดพบ'],
  ['lampao-dam','attraction','เขื่อนลำปาว เขื่อนดินใกล้เมือง หาดดอกเกดเล่นน้ำหน้าร้อน ร้านปลาริมน้ำ จุดนั่งกินลม'],
  ['kaeng-ka-am-waterfall','attraction','น้ำตกแก้งกะอาม อำเภอนาคู น้ำตกลานหินกว้างบนภูพาน น้ำใส เล่นน้ำหน้าฝน การเดินทาง'],
  ['phu-sing-pha-sawoei','attraction','ภูสิงห์-ผาเสวย อำเภอสมเด็จ จุดชมวิวบนภูพาน ทิวเขาและทะเลหมอกหน้าหนาว จุดแวะเส้นทางขึ้นภูพาน'],
  ['phu-thai-khok-kong','attraction','หมู่บ้านวัฒนธรรมผู้ไทโคกโก่ง กุฉินารายณ์ วิถีผู้ไทดั้งเดิม การแสดง งานทอผ้า โฮมสเตย์'],
  ['praewa-silk-ban-phon','attraction','ศูนย์ผ้าไหมแพรวาบ้านโพน คำม่วง แหล่งทอผ้าไหมแพรวาด้วยมือ ดูขั้นตอนการทอ เลือกซื้อผ้าราชินีแห่งไหม'],
  ['phra-phrom-phumipalo','attraction','พระพรหมภูมิปาโลกลางน้ำ สหัสขันธ์ พระพุทธรูปองค์ใหญ่กลางอ่างเก็บน้ำ จุดถ่ายรูปคู่เมืองและที่เคารพ'],
  ['kalasin-phu-phan-nature','attraction','ธรรมชาติเทือกเขาภูพานกาฬสินธุ์ น้ำตก จุดชมวิว ผาเสวย แก้งกะอาม เส้นทางธรรมชาติหลายอำเภอ'],
  ['kalasin-dinosaur-trail','attraction','เส้นทางไดโนเสาร์กาฬสินธุ์ พิพิธภัณฑ์สิรินธร-ภูกุ้มข้าว-สหัสขันธ์ เที่ยวเมืองไดโนเสาร์ของอีสาน'],
  ['kalasin-phu-thai-culture','attraction','วัฒนธรรมผู้ไทกาฬสินธุ์ คำม่วง-กุฉินารายณ์ ภาษา การแต่งกาย ผ้าไหมแพรวา งานประเพณี'],
]
const PLAN = [
  ['kalasin-1-day-itinerary','itinerary','แผนเที่ยวกาฬสินธุ์ 1 วัน เมืองไดโนเสาร์-เขื่อนลำปาว หรือ พิพิธภัณฑ์สิรินธรวันเดียว ใช้ block day'],
  ['kalasin-2d1n-itinerary','itinerary','แผนกาฬสินธุ์ 2 วัน 1 คืน เมืองไดโนเสาร์-เขื่อนลำปาว-เมือง ใช้ block day'],
  ['kalasin-3d2n-itinerary','itinerary','แผนกาฬสินธุ์ 3 วัน 2 คืน ไดโนเสาร์+ภูพาน+ผ้าไหมแพรวา ใช้ block day'],
  ['kalasin-dinosaur-plan','itinerary','แผนสายไดโนเสาร์ พิพิธภัณฑ์สิรินธร-ภูกุ้มข้าว-พระพรหมภูมิปาโล ใช้ block day'],
  ['kalasin-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกแก้งกะอาม-ผาเสวย-ภูพาน ใช้ block day'],
  ['kalasin-praewa-culture-plan','itinerary','แผนสายผ้าไหมแพรวาและวัฒนธรรมผู้ไท บ้านโพน-โคกโก่ง-คำม่วง ใช้ block day'],
  ['kalasin-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ไดโนเสาร์ พระพรหมภูมิปาโลกลางน้ำ ผาเสวย เขื่อนลำปาว) ใช้ block day'],
  ['kalasin-khon-kaen-plan','itinerary','แผนข้ามจังหวัด กาฬสินธุ์–ขอนแก่น ทริปอีสานกลางสองเมือง ใช้ block day'],
  ['kalasin-sakon-nakhon-plan','itinerary','แผนข้ามจังหวัด กาฬสินธุ์–สกลนคร เที่ยวภูพานและถิ่นผู้ไท ใช้ block day'],
  ['kalasin-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (พิพิธภัณฑ์ไดโนเสาร์ เขื่อนลำปาว เล่นน้ำ คาเฟ่) ใช้ block day'],
  ['kalasin-lampao-chill-plan','itinerary','แผนชิลริมเขื่อนลำปาว นั่งกินปลา เล่นน้ำหาดดอกเกด พักผ่อน ใช้ block day'],
  ['kalasin-first-timer-guide','itinerary','มากาฬสินธุ์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['kalasin-travel-tips','prep','เตรียมตัวเที่ยวกาฬสินธุ์ (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ.ขึ้นภูพาน หน้าร้อนเล่นน้ำเขื่อน เวลาเปิดพิพิธภัณฑ์ งบ การแต่งตัว)'],
  ['kalasin-getting-around','prep','การเดินทางในกาฬสินธุ์ (บขส.จากกรุงเทพ-ขอนแก่น เช่ารถ ไปสหัสขันธ์-เขื่อนลำปาว-ภูพานยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวกาฬสินธุ์ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="kalasin", crumbCity="กาฬสินธุ์", crumbCityHref="city-kalasin.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-kalasin.html และ top10-hotels-kalasin.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

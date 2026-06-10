export const meta = {
  name: 'bueng-kan-articles',
  description: 'Bueng Kan (บึงกาฬ) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Mekong + rock mountains + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['bueng-kan-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานบึงกาฬ ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['bueng-kan-mekong-fish','eat-ranking','ร้านปลาแม่น้ำโขงริมโขงบึงกาฬ ปลาเผา ต้มยำ ลาบปลา ปลาคัง นั่งรับลมวิวลาว'],
  ['bueng-kan-vietnamese-food','eat-ranking','ร้านอาหารเวียดนามบึงกาฬ แหนมเนือง หมูยอ ข้าวเปียกเส้น ร้านที่คนท้องถิ่นไป'],
  ['bueng-kan-kuay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนบึงกาฬ เส้นแป้งญวนนุ่ม น้ำซุปใส ร้านเช้าเด็ด'],
  ['bueng-kan-cafe-guide','eat-ranking','คาเฟ่บึงกาฬ ในเมืองและคาเฟ่กลางสวนยาง/ริมโขง นั่งชิล ถ่ายรูป'],
  ['bueng-kan-local-breakfast','food','อาหารเช้าแบบคนบึงกาฬ (ก๋วยจั๊บญวน ข้าวเปียกเส้น กาแฟ ตลาดเช้า)'],
  ['bueng-kan-mookata','eat-ranking','หมูกระทะและปิ้งย่างบึงกาฬ ร้านยอดนิยม คุ้มราคา'],
  ['bueng-kan-riverside-food','food','ร้านอาหารริมโขงบึงกาฬ บรรยากาศนั่งรับลม วิวฝั่งลาว เมนูปลาและอีสาน'],
  ['bueng-kan-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองบึงกาฬ'],
  ['bueng-kan-souvenir-food','food','ของฝากกินได้บึงกาฬ (หมูยอ แหนม ของแห้งจากฝั่งลาว แหล่งซื้อ)'],
  ['bueng-kan-night-market','food','ตลาดเย็นและสตรีทฟู้ดบึงกาฬ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
]
const SEE = [
  ['bueng-kan-attractions','attraction','รวมที่เที่ยวบึงกาฬที่ต้องไป คละภูเขาหิน/ริมโขง/น้ำตก/ธรรมชาติ (ภาพรวม + cards)'],
  ['phu-thok','attraction','ภูทอก วัดเจติยาคีรีวิหาร สะพานและบันไดไม้ไต่เวียนรอบหน้าผาขึ้นยอด จุดชมวิว การเดินขึ้น'],
  ['three-whale-rock','attraction','หินสามวาฬ ภูสิงห์ ก้อนหินใหญ่รูปครอบครัววาฬ จุดชมพระอาทิตย์ขึ้น การขึ้นด้วยรถนำเที่ยว'],
  ['naka-cave','attraction','ถ้ำนาคา อุทยานแห่งชาติภูลังกา หินรูปเกล็ดพญานาค ตำนานนาค การลงทะเบียนและเดินขึ้น'],
  ['bueng-kan-mekong-promenade','attraction','ถนนเลียบแม่น้ำโขงในเมืองบึงกาฬ นั่งรับลม ปั่นจักรยาน ร้านอาหารริมน้ำ วิวฝั่งลาว'],
  ['bueng-khong-long','attraction','บึงโขงหลง ทะเลสาบน้ำจืดเขตห้ามล่าสัตว์ป่า ดูนกน้ำนกอพยพหน้าหนาว จุดชมวิวริมบึง'],
  ['chet-si-waterfall','attraction','น้ำตกเจ็ดสี เขตป่าภูวัว น้ำไหลผ่านหน้าผากว้างสะท้อนแสงหลายสี หน้าฝนน้ำแรง'],
  ['tham-phra-waterfall-phu-wua','attraction','น้ำตกถ้ำพระ ภูวัว น้ำตกใหญ่กลางป่า ต้องเดินป่าเข้าไป เส้นทางสายธรรมชาติ'],
  ['wat-ahong-silawat','attraction','วัดอาฮงศิลาวาส แก่งอาฮงจุดน้ำวนที่ว่าลึกที่สุดของแม่น้ำโขง ศาลพญานาค วิวแก่งหิน'],
  ['phu-langka','attraction','อุทยานแห่งชาติภูลังกา น้ำตกหลายชั้น จุดชมทะเลหมอกหน้าหนาว เดินป่ากางเต็นท์'],
  ['rubber-plantation-scenery','attraction','สวนยางพาราบึงกาฬ ทิวสวนยางเขียวสุดสายตา ขับรถชมวิว คาเฟ่กลางสวนยาง บรรยากาศต่างจากอีสานทั่วไป'],
  ['phu-wua-wildlife-sanctuary','attraction','เขตรักษาพันธุ์สัตว์ป่าภูวัว ป่าและน้ำตกหลายแห่ง เส้นทางเดินป่า ธรรมชาติของบึงกาฬ'],
]
const PLAN = [
  ['bueng-kan-1-day-itinerary','itinerary','แผนเที่ยวบึงกาฬ 1 วัน หินสามวาฬ-ริมโขง ใช้ block day'],
  ['bueng-kan-2d1n-itinerary','itinerary','แผนบึงกาฬ 2 วัน 1 คืน ภูทอก-หินสามวาฬ-ริมโขง ใช้ block day'],
  ['bueng-kan-3d2n-itinerary','itinerary','แผนบึงกาฬ 3 วัน 2 คืน ภูทอก+หินสามวาฬ+ถ้ำนาคา+ภูวัว ใช้ block day'],
  ['bueng-kan-nature-plan','itinerary','แผนสายธรรมชาติ ภูวัว-น้ำตกเจ็ดสี-บึงโขงหลง ใช้ block day'],
  ['bueng-kan-rock-mountain-plan','itinerary','แผนสายภูเขาหิน หินสามวาฬ-ภูสิงห์-ภูลังกา ใช้ block day'],
  ['bueng-kan-riverside-plan','itinerary','แผนสายริมโขง ถนนเลียบโขง-วัดอาฮงศิลาวาส-คาเฟ่กลางสวนยาง ใช้ block day'],
  ['bueng-kan-naka-cave-plan','itinerary','แผนทริปถ้ำนาคา-ภูลังกา ขั้นตอนลงทะเบียนและเดินขึ้น ใช้ block day'],
  ['bueng-kan-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (หินสามวาฬ ถ้ำนาคา ภูทอก สวนยาง) ใช้ block day'],
  ['bueng-kan-nong-khai-plan','itinerary','แผนข้ามจังหวัด บึงกาฬ–หนองคาย เส้นทางริมโขงและศาลาแก้วกู่ ใช้ block day'],
  ['bueng-kan-nakhon-phanom-plan','itinerary','แผนข้ามจังหวัด บึงกาฬ–นครพนม ไล่เลียบโขงไหว้พระธาตุพนม ใช้ block day'],
  ['bueng-kan-sakon-nakhon-plan','itinerary','แผนข้ามจังหวัด บึงกาฬ–สกลนคร วัดป่าและหนองหาร ใช้ block day'],
  ['bueng-kan-first-timer-guide','itinerary','มาบึงกาฬครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['bueng-kan-travel-tips','prep','เตรียมตัวเที่ยวบึงกาฬ (ช่วงเวลาดีสุด การขึ้นหินสามวาฬด้วยรถนำเที่ยว ลงทะเบียนถ้ำนาคา อากาศ งบ การแต่งตัว)'],
  ['bueng-kan-getting-around','prep','การเดินทางในบึงกาฬ (สนามบินใกล้สุด นครพนม/อุดร/สกลนคร เช่ารถ รถนำเที่ยวหินสามวาฬ ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวบึงกาฬ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="bueng-kan", crumbCity="บึงกาฬ", crumbCityHref="city-bueng-kan.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-bueng-kan.html และ top10-hotels-bueng-kan.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

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

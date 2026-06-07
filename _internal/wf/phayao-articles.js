export const meta = {
  name: 'phayao-articles',
  description: 'Phayao gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + culture + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phayao-food-guide','food','รวมของกินพะเยาที่ต้องลอง คละอาหารเหนือ/ปลากว๊าน/ขนมเส้นน้ำเงี้ยว/คาเฟ่ริมกว๊าน (ภาพรวม + cards)'],
  ['phayao-northern-cuisine','eat-ranking','ร้านอาหารเหนือพะเยา (ข้าวซอย น้ำเงี้ยว แกงฮังเล ไส้อั่ว น้ำพริกหนุ่ม) ร้านที่คนเหนือไป'],
  ['kwan-phayao-lakeside-cafe','eat-ranking','จัดอันดับคาเฟ่ริมกว๊านพะเยา วิวทะเลสาบ นั่งจิบกาแฟดูพระอาทิตย์ตก'],
  ['kwan-phayao-freshwater-fish','food','ร้านปลาน้ำจืดจากกว๊านพะเยา (ปลาเผา ปลาทอด ต้มยำปลาสด) ร้านริมน้ำ'],
  ['phayao-khanom-jeen-nam-ngiao','food','ขนมเส้นน้ำเงี้ยวพะเยา เมนูเช้าคนพะเยา น้ำซุปมะเขือเทศดอกงิ้ว ร้านเด็ด'],
  ['phayao-tai-lue-food','food','อาหารไทลื้อเชียงคำ เมนูพื้นถิ่นและน้ำพริกเฉพาะถิ่น ร้านในชุมชน'],
  ['phayao-sai-ua-khaep-mu','food','ไส้อั่วและแคบหมูพะเยา ของฝาก/กับข้าวคู่เมืองเหนือ ร้านดัง'],
  ['phayao-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างพะเยา มื้อเย็นยอดนิยม คุ้มราคา'],
  ['phayao-local-breakfast','food','อาหารเช้าแบบคนพะเยา (ขนมเส้น ข้าวซอย กาแฟ ตลาดเช้า) ก่อนเที่ยวกว๊าน'],
]
const SEE = [
  ['phayao-attractions','attraction','รวมที่เที่ยวพะเยาที่ต้องไป คละธรรมชาติ/วัฒนธรรม/เมือง (ภาพรวม + cards)'],
  ['kwan-phayao','attraction','กว๊านพะเยา ทะเลสาบน้ำจืดกลางเมือง จุดชมพระอาทิตย์ตก ปั่นจักรยานเลียบน้ำ ล่องเรือ'],
  ['wat-tilok-aram','attraction','วัดติโลกอาราม วัดกลางน้ำในกว๊าน ลงเรือไหว้พระกลางทะเลสาบ การเดินทาง'],
  ['wat-sri-khom-kham','attraction','วัดศรีโคมคำ พระเจ้าตนหลวง พระพุทธรูปองค์ใหญ่ริมกว๊าน วัดคู่เมือง'],
  ['wat-analayo','attraction','วัดอนาลโยทิพยาราม บนดอยบุษราคัม จุดชมวิวกว๊านพะเยาและตัวเมืองมุมสูง'],
  ['doi-phu-langka','attraction','ดอยภูลังกา อำเภอปง จุดชมทะเลหมอก กางเต็นท์ค้างคืน พระอาทิตย์ขึ้น การเดินทาง'],
  ['phu-sang-national-park','attraction','อุทยานแห่งชาติภูซาง น้ำตกน้ำอุ่นธรรมชาติ ป่าเขียว เดินป่า แช่น้ำ'],
  ['wat-nantaram','attraction','วัดนันตาราม เชียงคำ วิหารไม้สักทรงไทใหญ่ งานไม้แกะสลักเก่าทั้งหลัง'],
  ['phayao-old-town','attraction','หอวัฒนธรรมนิทัศน์และเมืองเก่าพะเยา ริมกว๊าน เดินเล่น คาเฟ่ เรื่องราวประวัติเมือง'],
  ['chiang-kham-tai-lue-village','attraction','เชียงคำ ชุมชนไทลื้อ วิถีพื้นถิ่น ผ้าทอ วัดไทลื้อ บรรยากาศหมู่บ้าน'],
  ['phayao-sunset-cycling','attraction','ปั่นจักรยานเลียบกว๊านพะเยายามเย็น เส้นทาง จุดชมพระอาทิตย์ตก เช่าจักรยาน'],
  ['phayao-best-temples','attraction','วัดเด่นพะเยา (วัดลี วัดพระธาตุจอมทอง วัดป่าแดงบุญนาค) เส้นทางไหว้พระ'],
]
const PLAN = [
  ['phayao-1-day-itinerary','itinerary','แผนเที่ยวพะเยา 1 วัน กว๊าน–วัดติโลกอาราม–วัดศรีโคมคำ–คาเฟ่ ใช้ block day'],
  ['phayao-2d1n-itinerary','itinerary','แผนพะเยา 2 วัน 1 คืน กว๊าน–วัดในเมือง–วัดอนาลโย ใช้ block day'],
  ['phayao-3d2n-itinerary','itinerary','แผนพะเยา 3 วัน 2 คืน เมือง–ภูลังกา–ภูซาง–เชียงคำ ใช้ block day'],
  ['phayao-cafe-lakeside-plan','itinerary','แผนสายคาเฟ่ริมกว๊านพะเยา ใช้ block day'],
  ['phayao-nature-plan','itinerary','แผนสายธรรมชาติ ดอยภูลังกา–ภูซาง–น้ำตก ใช้ block day'],
  ['phayao-culture-temples-plan','itinerary','แผนสายวัด/วัฒนธรรม ติโลกอาราม–ศรีโคมคำ–นันตาราม ใช้ block day'],
  ['phayao-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระอาทิตย์ตกกว๊าน วัดกลางน้ำ ทะเลหมอกภูลังกา) ใช้ block day'],
  ['phayao-sunset-plan','itinerary','แผนสายชมพระอาทิตย์ตกริมกว๊านพะเยา + ถนนคนเดิน ใช้ block day'],
  ['phayao-chiang-rai-plan','itinerary','แผนข้ามจังหวัด พะเยา–เชียงราย ทริปเหนือสุด ใช้ block day'],
  ['phayao-lampang-plan','itinerary','แผนข้ามจังหวัด พะเยา–ลำปาง เมืองเหนือ ใช้ block day'],
  ['phayao-nan-plan','itinerary','แผนข้ามจังหวัด พะเยา–น่าน เส้นทางเมืองเหนือเงียบ ๆ ใช้ block day'],
  ['phayao-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก พะเยา กว๊าน ล่องเรือ วัด ใช้ block day'],
  ['phayao-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวพะเยาคุ้ม ใช้ block day'],
  ['phayao-first-timer-guide','itinerary','มาพะเยาครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phayao-travel-tips','prep','เตรียมตัวเที่ยวพะเยา (ช่วงเวลาดีสุด อากาศหนาว เรือวัดติโลกอาราม ภูลังกาหน้าหนาว งบ ของฝาก)'],
  ['phayao-getting-around','prep','การเดินทางไป/ในพะเยา (จากกรุงเทพ/เชียงราย รถทัวร์ ขับรถเอง รถในเมือง ปั่นจักรยานเลียบกว๊าน)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพะเยาลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phayao", crumbCity="พะเยา", crumbCityHref="city-phayao.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phayao.html และ top10-hotels-phayao.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean (เช่น ตอบโจทย์→ตรงใจ/เหมาะ, โดดเด่น→เด่น, ระดับโลก→ที่คนทั่วโลกรู้จัก/ดังไปไกล, สุดยอด→เด็ด, อันซีน→มุมลับ/คนยังไปไม่ทั่ว) แล้วค่อยบันทึก

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

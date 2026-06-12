export const meta = {
  name: 'phatthalung-articles',
  description: 'Phatthalung (พัทลุง) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Thale Noi + Khao Ok Thalu + Lampam + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phatthalung-southern-food','eat-ranking','จัดอันดับร้านอาหารใต้พัทลุง ข้าวแกงปักษ์ใต้ แกงเหลือง ผัดเผ็ด ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['phatthalung-khao-yam','eat-ranking','ข้าวยำปักษ์ใต้พัทลุง ข้าวคลุกน้ำบูดูผักสมุนไพร ร้านเด็ด มื้อเช้าเบา ๆ ของคนพัทลุง แหล่งกิน'],
  ['phatthalung-cafe-guide','eat-ranking','คาเฟ่พัทลุง วิวนาข้าว-เขาอกทะลุ ในเมืองและริมทุ่ง กาแฟสด ขนมพื้นบ้าน ถ่ายรูป'],
  ['phatthalung-kaeng-tai-pla','eat-ranking','แกงไตปลาและคั่วกลิ้งพัทลุง อาหารใต้รสจัด ร้านเด็ด กินกับข้าวสวยและผักเหนาะ'],
  ['phatthalung-khanom-jeen','eat-ranking','ขนมจีนน้ำยาปักษ์ใต้พัทลุง เส้นสดน้ำยารสจัด ผักเหนาะไม่อั้น ร้านดังเปิดเช้า คนต่อคิว'],
  ['phatthalung-lake-seafood','food','อาหารทะเลสาบและปลาดุกร้าพัทลุง ร้านริมหาดลำปำ ปลาน้ำกร่อย กุ้งสด ปลาดุกร้าทอด นั่งกินริมทะเลสาบ'],
  ['phatthalung-sangyod-rice','food','ข้าวสังข์หยดพัทลุง ข้าวพันธุ์พื้นเมืองสีแดง GI ประจำจังหวัด หุงหอมนุ่ม ของฝาก แหล่งซื้อ'],
  ['phatthalung-roti-cha-chak','food','โรตีและชาชักแบบใต้พัทลุง ร้านน้ำชาเปิดเช้าถึงดึก โรตีกรอบนอกนุ่มใน ชาชักร้อน มื้อเช้า/ของว่าง'],
  ['phatthalung-local-breakfast','food','อาหารเช้าแบบคนพัทลุง (ข้าวยำ ขนมจีน โรตีชาชัก ข้าวแกงใต้ กาแฟ ตลาดเช้า)'],
  ['phatthalung-souvenir-food','food','ของฝากกินได้พัทลุง (ข้าวสังข์หยด ปลาดุกร้า ขนมพื้นบ้าน ของแปรรูปจากข้าว แหล่งซื้อ)'],
  ['phatthalung-local-dessert','food','ของหวานและขนมพื้นถิ่นพัทลุง ขนมใต้ ขนมจากข้าวสังข์หยด ของกินเล่นตามตลาด'],
]
const SEE = [
  ['phatthalung-attractions','attraction','รวมที่เที่ยวพัทลุงที่ต้องไป คละทะเลน้อยบัวแดง/เขาอกทะลุ/หาดลำปำ/เขาปู่เขาย่า/วัฒนธรรมหนังตะลุง (ภาพรวม + cards)'],
  ['thale-noi','attraction','อุทยานนกน้ำทะเลน้อย ลงเรือชมบัวแดงบานเช้า ฝูงนกน้ำ ควายน้ำกลางทะเลสาบ พื้นที่ชุ่มน้ำขึ้นชื่อ เวลา/ค่าเรือ'],
  ['khao-ok-thalu','attraction','เขาอกทะลุ ภูเขากลางเมืองรูทะลุยอดเขา สัญลักษณ์จังหวัด เดินบันไดชมวิวเมืองและทุ่งนา ฝูงลิงตีนเขา'],
  ['lampam-beach','attraction','หาดลำปำ ชายหาดริมทะเลสาบสงขลา นั่งกินลม อาหารทะเลริมน้ำ ชมพระอาทิตย์ตก สะพานและศาลาริมเล'],
  ['khao-pu-khao-ya','attraction','วนอุทยานเขาปู่-เขาย่า ป่าเขาบรรทัด ถ้ำ น้ำตก เส้นทางเดินป่าสั้น อากาศเย็น เล่นน้ำดูธรรมชาติ'],
  ['phairo-waterfall','attraction','น้ำตกไพรวัลย์ น้ำตกหลายชั้นในป่าเขาบรรทัด น้ำใสเย็น เดินสั้นเข้าไปเล่นน้ำ พักกินข้าวริมน้ำตก'],
  ['wang-chao-mueang-phatthalung','attraction','วังเจ้าเมืองพัทลุง บ้านเรือนไม้เก่าของเจ้าเมืองในอดีต สถาปัตยกรรมและข้าวของสมัยเก่า แหล่งเรียนรู้ประวัติเมือง'],
  ['wat-khian-bang-kaeo','attraction','วัดเขียนบางแก้ว วัดเก่าแก่คู่เมืองพัทลุง พระธาตุเจดีย์โบราณ พิพิธภัณฑ์วัตถุท้องถิ่น ศูนย์กลางความศรัทธา'],
  ['ekkachai-bridge','attraction','สะพานเอกชัย สะพานยาวข้ามทะเลน้อย ขับรถ/ปั่นจักรยานชมวิวทะเลสาบและทุ่งบัว จุดแวะถ่ายรูปยอดนิยม'],
  ['nang-talung-manora','attraction','หนังตะลุงและมโนราห์พัทลุง ถิ่นกำเนิดศิลปะพื้นบ้านภาคใต้ บ้านครูหนังตะลุง คณะมโนราห์ การแกะตัวหนังและการรำ'],
  ['phatthalung-old-town','attraction','เมืองเก่าพัทลุง ตลาดและบ้านไม้เก่าในตัวเมือง เดินเล่นชมตึกแถว ร้านของกินพื้นถิ่น กลิ่นอายเมืองโบราณ'],
  ['phatthalung-rice-fields-buffalo','attraction','นาข้าวและวิถีควายริมเลพัทลุง ทุ่งนาเขียวรอบเมือง ควายน้ำริมทะเลสาบ นาข้าวสังข์หยด จุดถ่ายรูปวิถีชาวบ้าน'],
]
const PLAN = [
  ['phatthalung-1-day-itinerary','itinerary','แผนเที่ยวพัทลุง 1 วัน ทะเลน้อย-เขาอกทะลุ-หาดลำปำ วันเดียว ใช้ block day'],
  ['phatthalung-2d1n-itinerary','itinerary','แผนพัทลุง 2 วัน 1 คืน ทะเลน้อย-เขาอกทะลุ-เมืองเก่า-หาดลำปำ ใช้ block day'],
  ['phatthalung-3d2n-itinerary','itinerary','แผนพัทลุง 3 วัน 2 คืน ทะเลน้อย+เขาปู่เขาย่า+น้ำตก+วัฒนธรรม ใช้ block day'],
  ['phatthalung-nature-plan','itinerary','แผนสายธรรมชาติ ทะเลน้อย-เขาปู่เขาย่า-น้ำตกไพรวัลย์ ใช้ block day'],
  ['phatthalung-cafe-rice-field-plan','itinerary','แผนสายคาเฟ่และนาข้าว คาเฟ่วิวนา-เมืองเก่า-ข้าวสังข์หยด ใช้ block day'],
  ['phatthalung-culture-plan','itinerary','แผนสายวัฒนธรรม วังเจ้าเมือง-วัดเขียนบางแก้ว-หนังตะลุงมโนราห์ ใช้ block day'],
  ['phatthalung-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (บัวแดงทะเลน้อย เขาอกทะลุ สะพานเอกชัย นาข้าว) ใช้ block day'],
  ['phatthalung-songkhla-plan','itinerary','แผนข้ามจังหวัด พัทลุง–สงขลา เลาะทะเลสาบสงขลาเที่ยวสองเมือง ใช้ block day'],
  ['phatthalung-trang-plan','itinerary','แผนข้ามจังหวัด พัทลุง–ตรัง ลุยเขาบรรทัดต่อเที่ยวทะเลฝั่งอันดามัน ใช้ block day'],
  ['phatthalung-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ทะเลน้อยนั่งเรือ เขาอกทะลุดูลิง หาดลำปำ คาเฟ่) ใช้ block day'],
  ['phatthalung-thale-noi-sunrise-plan','itinerary','แผนทริปทะเลน้อยเช้าชมบัวแดงบาน ลงเรือดูนกน้ำควายน้ำ ช่วงเวลาที่ดีที่สุด ใช้ block day'],
  ['phatthalung-first-timer-guide','itinerary','มาพัทลุงครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phatthalung-travel-tips','prep','เตรียมตัวเที่ยวพัทลุง (ช่วงเวลาดีสุด ธ.ค.-เม.ย.ฟ้าเปิดบัวแดงสวย เลี่ยงฝนต.ค.-ธ.ค. เวลานั่งเรือทะเลน้อย งบ การแต่งตัว)'],
  ['phatthalung-getting-around','prep','การเดินทางในพัทลุง (รถไฟสายใต้/รถทัวร์กรุงเทพ-พัทลุง เช่ารถ ไปทะเลน้อย-เขาปู่เขาย่า-หาดลำปำยังไง ระยะทางจากหาดใหญ่-ตรัง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพัทลุง ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phatthalung", crumbCity="พัทลุง", crumbCityHref="city-phatthalung.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phatthalung.html และ top10-hotels-phatthalung.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

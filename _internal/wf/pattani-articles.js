export const meta = {
  name: 'pattani-articles',
  description: 'Pattani (ปัตตานี) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (Malay-southern: khao yam, nasi dagae, kai kolae, budu)' },
    { title: 'See', detail: '12 attraction articles (Krue Se + old town + shrine + beaches)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['pattani-southern-malay-food','eat-ranking','จัดอันดับร้านอาหารใต้ผสมมลายูปัตตานี แกงไตปลา คั่วกลิ้ง ผัดสะตอ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['pattani-khao-yam','eat-ranking','ข้าวยำปักษ์ใต้ปัตตานี ข้าวคลุกน้ำบูดูผักสมุนไพร ร้านเด็ด มื้อเช้าของคนปัตตานี แหล่งกิน'],
  ['nasi-dagae','eat-ranking','นาซิดาแฆปัตตานี ข้าวมันกะทิราดแกงปลา/แกงไก่แบบมลายู ร้านดังตามตลาดและร้านน้ำชา มื้อเช้าด่วน'],
  ['pattani-kai-kolae','food','ข้าวเหนียวไก่กอและปัตตานี ไก่ย่างราดกะทิเครื่องเทศมลายู ของกินถิ่นชายแดนใต้ ร้านเด็ด แหล่งกิน'],
  ['pattani-cafe-guide','eat-ranking','คาเฟ่ปัตตานี ย่านเมืองเก่าและในเมือง ตึกชิโน กาแฟดี ขนมพื้นบ้าน ถ่ายรูป'],
  ['pattani-seafood','eat-ranking','อาหารทะเลอ่าวไทยปัตตานี กุ้ง หอย ปู ปลาสดจากเรือ ร้านซีฟู้ด เผา นึ่ง ผัดผงกะหรี่ ต้มยำ ร้านเด็ด'],
  ['pattani-roti-tea','food','โรตีและน้ำชาร้านมุสลิมปัตตานี โรตีกรอบนอกนุ่มใน ชาชัก กาแฟโบราณ ร้านเปิดเช้าถึงดึก วิถีนั่งร้านน้ำชา'],
  ['pattani-budu','food','บูดูและน้ำพริกปลาปัตตานี น้ำปลาหมักเอกลักษณ์ชายแดนใต้ น้ำพริกบูดูกินกับผักสด ปลาทอด รสถิ่น ของฝาก'],
  ['pattani-malay-dessert','food','ขนมพื้นบ้านมลายูปัตตานี อาเก๊าะ ปูตูกือเดง ขนมกะทิหลากสี ตามตลาดเช้า กินคู่ชาร้อน'],
  ['pattani-local-breakfast','food','อาหารเช้าแบบคนปัตตานี (ข้าวยำ นาซิดาแฆ โรตีชาชัก ข้าวเหนียวไก่กอและ ตลาดเช้า)'],
  ['pattani-souvenir-food','food','ของฝากกินได้ปัตตานี (บูดู ขนมมลายู ของแปรรูปอาหารทะเล ข้าวเกรียบปลา แหล่งซื้อ)'],
]
const SEE = [
  ['pattani-attractions','attraction','รวมที่เที่ยวปัตตานีที่ต้องไป คละมัสยิดกรือเซะ/เมืองเก่าอาเนาะรู/ศาลเจ้าเล่งจูเกียง/หาดตะโละกาโปร์/น้ำตกทรายขาว (ภาพรวม + cards)'],
  ['krue-se-mosque','attraction','มัสยิดกรือเซะ ซากมัสยิดอิฐเก่าแก่สร้างค้างไม่เสร็จ โบราณสถานคู่เมืองปัตตานี ตำนานเจ้าแม่ลิ้มกอเหนี่ยว สถาปัตยกรรม การเดินทาง'],
  ['pattani-central-mosque','attraction','มัสยิดกลางปัตตานี มัสยิดประจำจังหวัดหลังใหญ่ใจกลางเมือง โดมและหออะซานสง่างาม ศูนย์รวมจิตใจชาวมุสลิม แลนด์มาร์ก'],
  ['anoru-old-town','attraction','ย่านเมืองเก่าอาเนาะรู ถนนเมืองเก่าตึกชิโน-โปรตุกีสและบ้านไม้โบราณ เดินชมตึกเก่า ร้านกาแฟ บรรยากาศเมืองท่าเดิม'],
  ['leng-chu-kiang-shrine','attraction','ศาลเจ้าเล่งจูเกียง ศาลเจ้าจีนเก่าแก่ของเจ้าแม่ลิ้มกอเหนี่ยว ที่เคารพของคนเชื้อสายจีน ประเพณีแห่เจ้าและลุยไฟตรุษจีน'],
  ['talo-kapo-beach','attraction','หาดตะโละกาโปร์ หาดทรายยาวริมอ่าวไทย หมู่บ้านประมง เรือกอและทาสีสด จุดชมวิวทะเลและวิถีชาวเล'],
  ['laem-tachi','attraction','แหลมตาชี สันทรายยื่นในทะเลปากแม่น้ำปัตตานี หาดเงียบ ป่าชายเลน วิถีประมงพื้นบ้าน วิวทะเลสองฝั่ง การเดินทางต้องนั่งเรือ'],
  ['sai-khao-waterfall','attraction','อุทยานแห่งชาติน้ำตกทรายขาว โคกโพธิ์ น้ำตกหลายชั้น น้ำใสเย็น เดินป่าสั้น เล่นน้ำ วัดทรายขาวใกล้ ๆ จุดธรรมชาติยอดนิยม'],
  ['ao-manao-skywalk','attraction','สกายวอล์กอ่าวมะนาว ทางเดินชมวิวยื่นเหนือทะเลและป่าชายเลน มองเห็นหาดและเรือประมง เดินเล่นรับลมทะเลใกล้เมือง'],
  ['kolae-boats','attraction','เรือกอและและวิถีประมงปัตตานี เรือทาสีลวดลายสดใสตามชายฝั่ง งานช่างและวัฒนธรรมมลายู หมู่บ้านประมงริมทะเล'],
  ['pattani-culture','attraction','วัฒนธรรมมลายูปัตตานี วิถีมุสลิม ภาษา การแต่งกาย งานประเพณี อาหาร เมืองที่ผสมมลายู-จีน-ไทย'],
  ['pattani-beaches-nature','attraction','ชายหาดและธรรมชาติปัตตานี หาดตะโละกาโปร์ แหลมตาชี อ่าวมะนาว น้ำตกทรายขาว ทะเลและป่าชายเลนในจังหวัด'],
]
const PLAN = [
  ['pattani-1-day-itinerary','itinerary','แผนเที่ยวปัตตานี 1 วัน เมืองเก่าอาเนาะรู-มัสยิดกรือเซะ-หาดตะโละกาโปร์ วันเดียว ใช้ block day'],
  ['pattani-2d1n-itinerary','itinerary','แผนปัตตานี 2 วัน 1 คืน เมืองเก่า-มัสยิด-ศาลเจ้า-หาด ใช้ block day'],
  ['pattani-3d2n-itinerary','itinerary','แผนปัตตานี 3 วัน 2 คืน เมืองเก่า+วัฒนธรรม+น้ำตกทรายขาว+แหลมตาชี ใช้ block day'],
  ['pattani-old-town-culture-plan','itinerary','แผนสายเมืองเก่าและวัฒนธรรม ตึกชิโน-ศาลเจ้าเล่งจูเกียง-มัสยิดกลาง ใช้ block day'],
  ['pattani-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกทรายขาว-แหลมตาชี-อ่าวมะนาว ใช้ block day'],
  ['pattani-food-plan','itinerary','แผนสายของกินถิ่น ข้าวยำ-นาซิดาแฆ-ร้านน้ำชาเช้า-ไก่กอและ ใช้ block day'],
  ['pattani-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (มัสยิดกรือเซะ ตึกชิโน เรือกอและ สกายวอล์กอ่าวมะนาว) ใช้ block day'],
  ['pattani-yala-plan','itinerary','แผนข้ามจังหวัด ปัตตานี–ยะลา เลาะชายแดนใต้เที่ยวเมืองและวัฒนธรรมมลายู ใช้ block day'],
  ['pattani-narathiwat-plan','itinerary','แผนข้ามจังหวัด ปัตตานี–นราธิวาส เลียบชายฝั่งอ่าวไทยชิมอาหารใต้ผสมมลายู ใช้ block day'],
  ['pattani-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดตะโละกาโปร์ น้ำตกทรายขาว สกายวอล์ก คาเฟ่) ใช้ block day'],
  ['pattani-mosque-heritage-plan','itinerary','แผนสายมัสยิดและมรดกเมือง กรือเซะ-มัสยิดกลาง-เมืองเก่า ใช้ block day'],
  ['pattani-first-timer-guide','itinerary','มาปัตตานีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['pattani-travel-tips','prep','เตรียมตัวเที่ยวปัตตานี (ช่วงเวลาดีสุด ก.พ.-พ.ค.ฟ้าเปิด เลี่ยงมรสุมพ.ย.-ม.ค. การแต่งกายให้เหมาะกับเมืองมุสลิม งบ + แนะนำให้เช็กข่าวสารและประกาศด้านความปลอดภัย/สถานการณ์ชายแดนใต้ก่อนเดินทางจริงทุกครั้ง)'],
  ['pattani-getting-around','prep','การเดินทางในปัตตานี (รถไฟ/รถทัวร์กรุงเทพ-ปัตตานี สนามบินหาดใหญ่ เช่ารถ ไปกรือเซะ-น้ำตกทรายขาว-แหลมตาชียังไง ระยะทางจากหาดใหญ่-ยะลา-นราธิวาส)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวปัตตานี ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="pattani", crumbCity="ปัตตานี", crumbCityHref="city-pattani.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- ⚠️ ปัตตานีเป็นพื้นที่ชายแดนใต้ ให้เขียนแบบ honesty: แนะนำให้ผู้อ่านเช็กข่าวสาร/ประกาศด้านความปลอดภัยและสถานการณ์ล่าสุดก่อนเดินทางจริง (ใส่เป็น tip/หมายเหตุอย่างสุภาพตามบริบท ไม่ต้องตื่นตระหนก) · เคารพวัฒนธรรมมุสลิม-มลายู แต่งกายและพฤติกรรมให้เหมาะสม
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-pattani.html และ top10-hotels-pattani.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

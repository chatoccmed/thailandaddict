export const meta = {
  name: 'narathiwat-articles',
  description: 'Narathiwat (นราธิวาส) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles (Malay-southern: khao yam, nasi dagae, kai kolae, budu)' },
    { title: 'See', detail: '12 attraction articles (Taksin palace + 300yr mosque + Toh Daeng swamp + beaches)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['narathiwat-southern-malay-food','eat-ranking','จัดอันดับร้านอาหารใต้ผสมมลายูนราธิวาส แกงไตปลา คั่วกลิ้ง ผัดสะตอ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['narathiwat-khao-yam','eat-ranking','ข้าวยำปักษ์ใต้นราธิวาส ข้าวคลุกน้ำบูดูผักสมุนไพร ร้านเด็ด มื้อเช้าของคนนรา แหล่งกิน'],
  ['narathiwat-nasi-dagae','eat-ranking','นาซิดาแฆนราธิวาส ข้าวหุงกะทิราดแกงปลา/แกงไก่แบบมลายู ร้านดังตามตลาดและร้านน้ำชา มื้อเช้าด่วน'],
  ['narathiwat-kai-kolae','food','ข้าวเหนียวไก่กอและนราธิวาส ไก่ย่างราดกะทิเครื่องเทศมลายู ของกินถิ่นชายแดนใต้ ร้านเด็ด แหล่งกิน'],
  ['narathiwat-cafe-guide','eat-ranking','คาเฟ่นราธิวาส ในเมืองและริมทะเล กาแฟดี ขนมพื้นบ้าน ตึกเก่า ถ่ายรูป'],
  ['narathiwat-seafood','eat-ranking','อาหารทะเลอ่าวไทยนราธิวาส กุ้ง หอย ปู ปลาสดจากเรือ ร้านซีฟู้ด เผา นึ่ง ผัดผงกะหรี่ ต้มยำ ร้านเด็ด'],
  ['narathiwat-roti-tea','food','โรตีและน้ำชาร้านมุสลิมนราธิวาส โรตีกรอบนอกนุ่มใน ชาชัก กาแฟโบราณ ร้านเปิดเช้าถึงดึก วิถีนั่งร้านน้ำชา'],
  ['narathiwat-budu','food','บูดูและน้ำพริกปลานราธิวาส น้ำปลาหมักเอกลักษณ์ชายแดนใต้ น้ำพริกบูดูกินกับผักสด ปลาทอด รสถิ่น ของฝาก'],
  ['narathiwat-malay-dessert','food','ขนมพื้นบ้านมลายูนราธิวาส อาเก๊าะ ปูตูกือเดง ขนมกะทิหลากสี ตามตลาดเช้าและตลาดน้ำยะกัง กินคู่ชาร้อน'],
  ['narathiwat-local-breakfast','food','อาหารเช้าแบบคนนราธิวาส (ข้าวยำ นาซิดาแฆ โรตีชาชัก ข้าวเหนียวไก่กอและ ตลาดเช้า)'],
  ['narathiwat-souvenir-food','food','ของฝากกินได้นราธิวาส (บูดู ขนมมลายู ของแปรรูปอาหารทะเล ลองกองตันหยงมัส แหล่งซื้อ)'],
]
const SEE = [
  ['narathiwat-attractions','attraction','รวมที่เที่ยวนราธิวาสที่ต้องไป คละพระตำหนักทักษิณ/หาดนราทัศน์/มัสยิด300ปี/ป่าพรุโต๊ะแดง/สุไหงโก-ลก (ภาพรวม + cards)'],
  ['taksin-ratchaniwet-palace','attraction','พระตำหนักทักษิณราชนิเวศน์ พระตำหนักบนเขาตันหยงริมทะเล สวนพรรณไม้ จุดชมวิวอ่าวไทย เปิดให้เข้าชมบางช่วง การเดินทาง'],
  ['narathat-beach','attraction','หาดนราทัศน์ หาดทรายยาวกลางเมืองใกล้ปากแม่น้ำบางนรา เรือกอและ หมู่บ้านประมง จุดชมวิวทะเลและวิถีชาวเล'],
  ['wadi-al-husen-mosque','attraction','มัสยิดวาดีอัลฮูเซ็น (มัสยิด 300 ปี) ลุโบะสาวอ มัสยิดไม้เก่าผสมศิลปะไทย-จีน-มลายู หลังคาจั่วซ้อนชั้น โบราณสถานคู่เมือง'],
  ['toh-daeng-peat-swamp','attraction','ป่าพรุโต๊ะแดง ป่าพรุผืนใหญ่สมบูรณ์ของภาคใต้ ทางเดินไม้ลัดเลาะกลางป่า พรรณไม้พรุ ต้นไม้ใหญ่ นกหายาก ศึกษาธรรมชาติ'],
  ['sungai-kolok-border','attraction','เมืองและด่านสุไหงโก-ลก เมืองชายแดนติดมาเลเซีย ตลาดและการค้าข้ามแดน ประตูสู่กลันตัน ของกินสองวัฒนธรรม'],
  ['budo-sungai-padi-pacho-waterfall','attraction','อุทยานแห่งชาติบูโด-สุไหงปาดี น้ำตกปาโจหลายชั้น ป่าดิบชื้นเทือกเขาบูโด น้ำใสเย็น เดินป่าสั้น เล่นน้ำ'],
  ['ao-manao-khao-tanyong','attraction','หาดอ่าวมะนาว เขาตันหยง หาดทรายเงียบในอุทยานแห่งชาติอ่าวมะนาว-เขาตันหยง ทิวสน จุดกางเต็นท์ริมทะเล วิวอ่าวไทย'],
  ['yakang-market','attraction','ตลาดน้ำยะกัง ย่านชุมชนเก่ากลางเมืองนราธิวาส ตลาดของกินถิ่นและขนมพื้นบ้านมลายู ข้าวยำ โรตี ขนมหวาน วิถีกินอยู่'],
  ['narathiwat-kolae-boats','attraction','เรือกอและและวิถีประมงนราธิวาส เรือทาสีลวดลายสดใสตามชายฝั่ง งานช่างและวัฒนธรรมมลายู หมู่บ้านประมงริมทะเล'],
  ['narathiwat-malay-culture','attraction','วัฒนธรรมมลายูนราธิวาส วิถีมุสลิม ภาษายาวี การแต่งกาย งานประเพณี อาหาร เมืองชายแดนใต้สุดของไทย'],
  ['narathiwat-beaches-nature','attraction','ชายหาดและธรรมชาตินราธิวาส หาดนราทัศน์ อ่าวมะนาว ป่าพรุโต๊ะแดง น้ำตกปาโจ ทะเลและป่าพรุในจังหวัด'],
]
const PLAN = [
  ['narathiwat-1-day-itinerary','itinerary','แผนเที่ยวนราธิวาส 1 วัน พระตำหนักทักษิณ-หาดนราทัศน์-ตลาดน้ำยะกัง วันเดียว ใช้ block day'],
  ['narathiwat-2d1n-itinerary','itinerary','แผนนราธิวาส 2 วัน 1 คืน พระตำหนักทักษิณ-หาดนราทัศน์-มัสยิด 300 ปี ใช้ block day'],
  ['narathiwat-3d2n-itinerary','itinerary','แผนนราธิวาส 3 วัน 2 คืน เมือง+ป่าพรุโต๊ะแดง+น้ำตกปาโจ+ชายแดน ใช้ block day'],
  ['narathiwat-nature-plan','itinerary','แผนสายธรรมชาติ ป่าพรุโต๊ะแดง-น้ำตกปาโจ-อ่าวมะนาว ใช้ block day'],
  ['narathiwat-food-plan','itinerary','แผนสายของกินถิ่น ข้าวยำ-นาซิดาแฆ-ร้านน้ำชาเช้า-ตลาดน้ำยะกัง ใช้ block day'],
  ['narathiwat-border-plan','itinerary','แผนสายชายแดน เมืองสุไหงโก-ลก-ตลาดข้ามแดน-ของกินสองวัฒนธรรม ใช้ block day'],
  ['narathiwat-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (มัสยิด 300 ปี เรือกอและหาดนราทัศน์ ป่าพรุ พระตำหนัก) ใช้ block day'],
  ['narathiwat-pattani-plan','itinerary','แผนข้ามจังหวัด นราธิวาส–ปัตตานี เลียบชายฝั่งอ่าวไทยชิมอาหารใต้ผสมมลายู ใช้ block day'],
  ['narathiwat-yala-plan','itinerary','แผนข้ามจังหวัด นราธิวาส–ยะลา เลาะชายแดนใต้เที่ยวเมืองและวัฒนธรรมมลายู ใช้ block day'],
  ['narathiwat-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดนราทัศน์ ป่าพรุทางเดินไม้ อ่าวมะนาว คาเฟ่) ใช้ block day'],
  ['narathiwat-culture-mosque-plan','itinerary','แผนสายมัสยิดและวัฒนธรรม มัสยิด 300 ปี-พระตำหนัก-ตลาดน้ำยะกัง ใช้ block day'],
  ['narathiwat-first-timer-guide','itinerary','มานราธิวาสครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['narathiwat-travel-tips','prep','เตรียมตัวเที่ยวนราธิวาส (ช่วงเวลาดีสุด ก.พ.-พ.ค.ฟ้าเปิด เลี่ยงมรสุมพ.ย.-ม.ค. การแต่งกายเมืองมุสลิม งบ + แนะนำให้เช็กข่าวสารและประกาศด้านความปลอดภัย/สถานการณ์ชายแดนใต้ก่อนเดินทางจริงทุกครั้ง)'],
  ['narathiwat-getting-around','prep','การเดินทางในนราธิวาส (เครื่องบินลงสนามบินนราธิวาส รถไฟ/รถทัวร์ถึงสุไหงโก-ลก เช่ารถ ไปป่าพรุโต๊ะแดง-มัสยิด 300 ปี-อ่าวมะนาวยังไง การข้ามด่านสุไหงโก-ลก)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวนราธิวาส ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="narathiwat", crumbCity="นราธิวาส", crumbCityHref="city-narathiwat.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- ⚠️ นราธิวาสเป็นพื้นที่ชายแดนใต้ ให้เขียนแบบ honesty: แนะนำให้ผู้อ่านเช็กข่าวสาร/ประกาศด้านความปลอดภัยและสถานการณ์ล่าสุดก่อนเดินทางจริง (ใส่เป็น tip/หมายเหตุอย่างสุภาพตามบริบท ไม่ต้องตื่นตระหนก) · เคารพวัฒนธรรมมุสลิม-มลายู แต่งกายและพฤติกรรมให้เหมาะสม
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-narathiwat.html และ top10-hotels-narathiwat.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

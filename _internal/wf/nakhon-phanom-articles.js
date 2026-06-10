export const meta = {
  name: 'nakhon-phanom-articles',
  description: 'Nakhon Phanom (นครพนม) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Mekong + stupas + Vietnamese heritage)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nakhon-phanom-vietnamese-food','eat-ranking','จัดอันดับร้านอาหารเวียดนามนครพนม แหนมเนือง หมูยอ ปอเปี๊ยะสด ข้าวเปียกเส้น ร้านที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['nakhon-phanom-isan-food','eat-ranking','ร้านอาหารอีสานนครพนม ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไป'],
  ['nakhon-phanom-mekong-fish','eat-ranking','ร้านปลาแม่น้ำโขงริมโขงนครพนม ปลาเผา ต้มยำ ลาบปลา ปลาคัง วิวภูเขาลาว'],
  ['nakhon-phanom-kuay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนนครพนม เส้นแป้งญวนนุ่ม น้ำซุปใส หมูยอ ร้านเช้าเด็ด'],
  ['nakhon-phanom-riverside-cafe','eat-ranking','คาเฟ่ริมโขงนครพนม วิวแม่น้ำและภูเขาลาว นั่งดูพระอาทิตย์ขึ้น'],
  ['nakhon-phanom-local-breakfast','food','อาหารเช้าแบบคนนครพนม (ก๋วยจั๊บญวน ข้าวเปียกเส้น กาแฟ ตลาดเช้า)'],
  ['nakhon-phanom-mookata','eat-ranking','หมูกระทะและปิ้งย่างนครพนม ร้านยอดนิยม คุ้มราคา'],
  ['nakhon-phanom-walking-street-food','food','ตลาดและถนนริมโขงนครพนมยามค่ำ ของย่าง ของทอด ขนมพื้นถิ่น วิวแม่น้ำ'],
  ['nakhon-phanom-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองนครพนม'],
  ['nakhon-phanom-souvenir-food','food','ของฝากกินได้นครพนม (หมูยอ แหนม ไส้กรอกอีสาน แหล่งซื้อ)'],
  ['nakhon-phanom-night-market','food','ตลาดเย็นและสตรีทฟู้ดนครพนม เดินกินของอีสาน-เวียดนามยามค่ำ'],
]
const SEE = [
  ['nakhon-phanom-attractions','attraction','รวมที่เที่ยวนครพนมที่ต้องไป คละริมโขง/พระธาตุ/ชุมชนเวียดนาม (ภาพรวม + cards)'],
  ['phra-that-phanom','attraction','พระธาตุพนม พระธาตุคู่ลุ่มน้ำโขง อำเภอธาตุพนม องค์สีขาวยอดทอง การกราบขอพร ประวัติ การเดินทาง'],
  ['nakhon-phanom-mekong-promenade','attraction','ถนนริมโขงนครพนม (สุนทรวิจิตร) วิวภูเขาลาว จุดดูพระอาทิตย์ขึ้น นั่งรับลมเย็น'],
  ['phaya-sri-sattanakharat','attraction','ลานพญาศรีสัตตนาคราช องค์พญานาคทองเหลืองริมโขงกลางเมือง จุดสักการะและถ่ายรูปยามเย็น'],
  ['ho-chi-minh-village','attraction','หมู่บ้านมิตรภาพไทย-เวียดนาม บ้านนาจอก บ้านที่ลุงโฮจิมินห์เคยพำนัก เรื่องราวไทย-เวียดนาม'],
  ['vietnam-clock-tower','attraction','หอนาฬิกาเวียดนามอนุสรณ์ จุดสังเกตคู่เมืองนครพนม จุดถ่ายรูปกลางเมือง'],
  ['phra-that-renu-nakhon','attraction','พระธาตุเรณูนคร พระธาตุประจำวันจันทร์ ชุมชนผู้ไทยเรณู การรำผู้ไทย'],
  ['phra-that-tha-uthen','attraction','พระธาตุท่าอุเทน พระธาตุริมโขงทรงเพรียว พระธาตุประจำวันศุกร์ เส้นริมโขง'],
  ['thai-lao-friendship-bridge-3','attraction','สะพานมิตรภาพไทย-ลาว แห่งที่ 3 ข้ามไปเมืองท่าแขก เส้นทางต่อไปเวียดนามผ่านลาว'],
  ['nakhon-phanom-fire-boat-festival','attraction','งานไหลเรือไฟนครพนม ประเพณีออกพรรษาริมโขง เรือไฟประดับลอยกลางลำน้ำยามค่ำ ช่วงเวลา'],
  ['nakhon-phanom-birthday-stupas','attraction','พระธาตุประจำวันเกิดนครพนม 7 องค์ พระธาตุพนม-เรณู-ท่าอุเทน-ประสิทธิ์ ไหว้ตามรอยวันเกิด'],
  ['renu-nakhon-phu-tai','attraction','ชุมชนผู้ไทยเรณูนคร วัฒนธรรมผู้ไทย การรำผู้ไทย ผ้าทอ ตลาดของพื้นถิ่น'],
]
const PLAN = [
  ['nakhon-phanom-1-day-itinerary','itinerary','แผนเที่ยวนครพนม 1 วัน ริมโขง-พญาศรีสัตตนาคราช-พระธาตุพนม ใช้ block day'],
  ['nakhon-phanom-2d1n-itinerary','itinerary','แผนนครพนม 2 วัน 1 คืน ริมโขง-พระธาตุพนม-ชุมชนเวียดนาม ใช้ block day'],
  ['nakhon-phanom-3d2n-itinerary','itinerary','แผนนครพนม 3 วัน 2 คืน เมือง+พระธาตุพนม+เรณู+ท่าอุเทน ใช้ block day'],
  ['nakhon-phanom-stupa-pilgrimage-plan','itinerary','แผนสายไหว้พระธาตุ พระธาตุพนม-เรณูนคร-ท่าอุเทน ตามรอยพระธาตุประจำวันเกิด ใช้ block day'],
  ['nakhon-phanom-riverside-plan','itinerary','แผนสายริมโขง พระอาทิตย์ขึ้น-พญาศรีสัตตนาคราช-คาเฟ่วิวแม่น้ำ ใช้ block day'],
  ['nakhon-phanom-vietnamese-food-plan','itinerary','แผนสายของกินเวียดนาม แหนมเนือง-ก๋วยจั๊บญวน-หมูยอ + บ้านลุงโฮ ใช้ block day'],
  ['nakhon-phanom-sunrise-plan','itinerary','แผนตื่นเช้าดูพระอาทิตย์ขึ้นริมโขงวิวภูเขาลาว + เที่ยวเมือง ใช้ block day'],
  ['nakhon-phanom-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พญานาค หอนาฬิกา พระธาตุพนม ริมโขง) ใช้ block day'],
  ['nakhon-phanom-mukdahan-plan','itinerary','แผนข้ามจังหวัด นครพนม–มุกดาหาร เส้นทางริมโขงสองเมืองชายแดน ใช้ block day'],
  ['nakhon-phanom-sakon-nakhon-plan','itinerary','แผนข้ามจังหวัด นครพนม–สกลนคร เที่ยววัดและธรรมชาติ ใช้ block day'],
  ['nakhon-phanom-bueng-kan-plan','itinerary','แผนข้ามจังหวัด นครพนม–บึงกาฬ ไล่เลียบโขงขึ้นเหนือ ใช้ block day'],
  ['nakhon-phanom-first-timer-guide','itinerary','มานครพนมครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nakhon-phanom-travel-tips','prep','เตรียมตัวเที่ยวนครพนม (ช่วงเวลาดีสุด ดูพระอาทิตย์ขึ้น งานไหลเรือไฟออกพรรษา อากาศ งบ การแต่งตัว)'],
  ['nakhon-phanom-getting-around','prep','การเดินทางในนครพนม (สนามบินนครพนม/บขส. เช่ารถ ไปพระธาตุพนม-เรณู ข้ามสะพานไปลาว ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวนครพนม ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nakhon-phanom", crumbCity="นครพนม", crumbCityHref="city-nakhon-phanom.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nakhon-phanom.html และ top10-hotels-nakhon-phanom.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

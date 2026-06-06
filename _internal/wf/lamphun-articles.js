export const meta = {
  name: 'lamphun-articles',
  description: 'Lamphun gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['lamphun-food-guide','food','รวมของกินลำพูนที่ต้องลอง คละอาหารเหนือ/ขนมจีนน้ำเงี้ยว/ลำไย/คาเฟ่เมืองเก่า (ภาพรวม + cards)'],
  ['lamphun-northern-cuisine','eat-ranking','ร้านอาหารเหนือลำพูน (ข้าวซอย น้ำเงี้ยว ไส้อั่ว แกงฮังเล น้ำพริกหนุ่ม) ร้านเก่าในเมือง'],
  ['lamphun-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ลำพูน ในเมืองเก่าและริมทุ่งนา กาแฟดอย บรรยากาศเงียบ'],
  ['lamphun-longan-products','eat-ranking','ลำไยลำพูนและของแปรรูป (ลำไยสด ลำไยอบแห้ง น้ำลำไย ไอศกรีมลำไย) ของฝากซื้อที่ไหน'],
  ['lamphun-khanom-jeen-nam-ngiao','food','ขนมจีนน้ำเงี้ยวลำพูน เมนูเช้าคนเหนือ กินกับผักสดและแคบหมู ร้านเด็ด'],
  ['lamphun-old-noodles','eat-ranking','ก๋วยเตี๋ยวลำพูนร้านเก่าแก่ในตัวเมือง รสแบบบ้าน ๆ ที่คนท้องถิ่นกิน'],
  ['lamphun-morning-market-food','food','ตลาดเช้าเมืองลำพูน ของกินสด อาหารปรุงสำเร็จแบบเหนือ ผลไม้ตามฤดู'],
  ['lamphun-local-snacks','food','ของกินเล่นและสำรับเหนือลำพูน (ไส้อั่ว แคบหมู น้ำพริกหนุ่ม) ซื้อที่ตลาด/ร้านของฝาก'],
  ['lamphun-local-breakfast','food','อาหารเช้าแบบคนลำพูน (ข้าวซอย ขนมจีน กาแฟ ตลาดเช้า) ก่อนไหว้พระเดินเมืองเก่า'],
]
const SEE = [
  ['lamphun-attractions','attraction','รวมที่เที่ยวลำพูนที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['wat-phra-that-hariphunchai','attraction','วัดพระธาตุหริภุญชัย วัดสำคัญที่สุดของลำพูน พระธาตุทรงระฆังสีทอง ซุ้มประตูเก่า การไหว้พระ'],
  ['wat-chamthewi-ku-kut','attraction','วัดจามเทวี (วัดกู่กุด) เจดีย์ทรงสี่เหลี่ยมแบบหริภุญชัย สถาปัตยกรรมหาดูยาก'],
  ['hariphunchai-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติ หริภุญไชย โบราณวัตถุสมัยหริภุญชัย-ล้านนา เล่าเรื่องเมืองเก่า'],
  ['chamthewi-monument','attraction','อนุสาวรีย์พระนางจามเทวี ผู้สร้างเมืองหริภุญชัย จุดสักการะกลางเมือง ประวัติ'],
  ['ku-chang-ku-ma','attraction','กู่ช้าง–กู่ม้า โบราณสถานสุสานช้าง-ม้าศึกคู่บารมีพระนางจามเทวี'],
  ['nong-chang-khuen-weaving-village','attraction','หมู่บ้านทอผ้าหนองช้างคืน–เวียงยอง ผ้าไหมยกดอก ผ้าฝ้าย ดูการทอ ซื้อผ้าจากชุมชน'],
  ['doi-khun-tan-national-park','attraction','อุทยานแห่งชาติดอยขุนตาล อุโมงค์รถไฟขุนตานยาวที่สุดในไทย เดินป่า กางเต็นท์'],
  ['lamphun-old-town-walk','attraction','เดินเมืองเก่าหริภุญชัย กำแพงเมือง คูน้ำสมัยพระนางจามเทวี วัดเก่า บรรยากาศเงียบ'],
  ['pa-sang-old-town','attraction','บ้านป่าซาง ตึกแถวไม้โบราณ ร้านผ้าฝ้าย บรรยากาศเมืองเล็กแบบเก่า'],
  ['lamphun-longan-orchards','attraction','สวนลำไยและทุ่งนาชานเมืองลำพูน ขับรถเที่ยวเล่นเงียบ ๆ หน้าผลไม้สิงหาคม'],
  ['lamphun-best-temples','attraction','วัดเด่นลำพูนที่ไม่ควรพลาด (วัดมหาวัน วัดพระยืน วัดสันป่ายางหลวง) เส้นทางไหว้พระ'],
]
const PLAN = [
  ['lamphun-1-day-itinerary','itinerary','แผนเที่ยวลำพูน 1 วัน ไหว้พระธาตุหริภุญชัย–เดินเมืองเก่า–คาเฟ่ ใช้ block day'],
  ['lamphun-2d1n-itinerary','itinerary','แผนลำพูน 2 วัน 1 คืน วัดเก่า–หมู่บ้านทอผ้า–ทุ่งนา ใช้ block day'],
  ['lamphun-3d2n-itinerary','itinerary','แผนลำพูน 3 วัน 2 คืน เมืองเก่า–ดอยขุนตาล–ป่าซาง ใช้ block day'],
  ['lamphun-cafe-rice-field-plan','itinerary','แผนสายคาเฟ่และทุ่งนาลำพูน นั่งชิลริมนา ใช้ block day'],
  ['lamphun-weaving-souvenir-plan','itinerary','แผนสายผ้าทอและของฝากลำไย หนองช้างคืน–ป่าซาง ใช้ block day'],
  ['lamphun-culture-temples-plan','itinerary','แผนสายวัด/ประวัติศาสตร์หริภุญชัย หริภุญชัย–จามเทวี–พิพิธภัณฑ์ ใช้ block day'],
  ['lamphun-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เมืองเก่า เจดีย์ ทุ่งนา คาเฟ่) ใช้ block day'],
  ['lamphun-doi-khun-tan-plan','itinerary','แผนสายธรรมชาติ ดอยขุนตาล เดินป่า อุโมงค์รถไฟ ใช้ block day'],
  ['chiang-mai-lamphun-day-trip','itinerary','แผนข้ามจังหวัด เชียงใหม่–ลำพูน ไปเช้าเย็นกลับ ใช้ block day'],
  ['lamphun-lampang-plan','itinerary','แผนข้ามจังหวัด ลำพูน–ลำปาง เที่ยวเมืองเก่าสองเมือง ใช้ block day'],
  ['lamphun-tak-plan','itinerary','แผนข้ามจังหวัด ลำพูน–ตาก ต่อเส้นทางตะวันตก ใช้ block day'],
  ['lamphun-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก ลำพูน ไหว้พระ ทุ่งนา ผ้าทอ ใช้ block day'],
  ['lamphun-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวลำพูนคุ้ม ใช้ block day'],
  ['lamphun-first-timer-guide','itinerary','มาลำพูนครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['lamphun-travel-tips','prep','เตรียมตัวเที่ยวลำพูน (ช่วงเวลาดีสุด ลำไยหน้าสิงหาคม อากาศหนาว ไปเช้าเย็นกลับจากเชียงใหม่ งบ ของฝาก)'],
  ['lamphun-getting-around','prep','การเดินทางไป/ในลำพูน (จากเชียงใหม่ครึ่งชั่วโมง รถไฟสถานีลำพูน รถสองแถว ขับรถเอง ปั่นจักรยานในเมืองเก่า)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวลำพูนลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="lamphun", crumbCity="ลำพูน", crumbCityHref="city-lamphun.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-lamphun.html และ top10-hotels-lamphun.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'nakhon-si-thammarat-articles',
  description: 'Nakhon Si Thammarat (เมืองคอน) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + city + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nakhon-khanom-jeen','eat-ranking','ขนมจีนเมืองคอน ร้านเด็ด น้ำยา แกงไตปลา ผักเหนาะ ที่คนนครต่อคิวเช้า'],
  ['nakhon-southern-curry-rice','eat-ranking','ข้าวแกงปักษ์ใต้เมืองคอน ร้านเรียงถาด แกงไตปลา แกงเหลือง คั่วกลิ้ง'],
  ['nakhon-southern-dishes','eat-ranking','อาหารใต้รสจัดเมืองคอน แกงไตปลา คั่วกลิ้ง ผัดเผ็ด ร้านดังที่คนพื้นที่ไป'],
  ['nakhon-cafe-guide','eat-ranking','คาเฟ่เมืองคอน ตึกเก่าเมืองเก่า และคาเฟ่วิวเขา บรรยากาศถ่ายรูป'],
  ['khanom-seafood-restaurants','eat-ranking','ร้านอาหารทะเลขนอม-ปากพนัง ปลา หมึก ปูม้าสด ริมทะเลอ่าวไทย'],
  ['nakhon-roti-cha-chak','food','โรตีและชาชักแบบใต้เมืองคอน มื้อเช้าและของว่างร้านน้ำชา'],
  ['nakhon-street-food','food','สตรีทฟู้ดและตลาดเมืองคอน ของกินเดินชิมย่านเมืองเก่า'],
  ['nakhon-souvenir-food','food','ของฝากกินได้เมืองคอน ขนมลา กะปิปากพนัง แหล่งซื้อ'],
  ['nakhon-local-breakfast','food','อาหารเช้าแบบคนคอน ขนมจีน โรตีชาชัก ติ่มซำ ตลาดเช้า'],
  ['nakhon-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนม ขนมพื้นบ้านใต้ ในเมืองคอน'],
  ['khiriwong-fruit-cafe','eat-ranking','ของกินคีรีวง มังคุด ผลไม้ถิ่น คาเฟ่ริมน้ำเชิงเขาหลวง'],
]
const SEE = [
  ['nakhon-si-thammarat-attractions','attraction','รวมที่เที่ยวนครศรีธรรมราชที่ต้องไป คละธรรมชาติ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['wat-phra-mahathat-woramahawihan','attraction','วัดพระมหาธาตุวรมหาวิหาร พระบรมธาตุเจดีย์ ประวัติ การไหว้ขอพร โบราณวัตถุ จุดถ่ายรูป'],
  ['wat-chedi-ai-khai','attraction','ไอ้ไข่ วัดเจดีย์ สิชล การขอพร แก้บน การเดินทาง ของไหว้ ช่วงเวลาคนเยอะ'],
  ['khanom-pink-dolphins','attraction','ขนอม ดูโลมาสีชมพู ลงเรือ เขาพลายดำ หาดเงียบ เกาะนุ้ยนอก'],
  ['ban-khiriwong','attraction','บ้านคีรีวง หมู่บ้านเชิงเขาหลวง อากาศดี ลำธารใส มังคุด เดินเล่นริมน้ำ'],
  ['krung-ching-waterfall','attraction','น้ำตกกรุงชิง เขาหลวง ชั้นหนานวลแก้ว เดินป่าระยะสั้น เล่นน้ำ'],
  ['nakhon-old-town-cultural-street','attraction','ถนนสายวัฒนธรรมเมืองคอน ศาลหลักเมือง กำแพงเมืองเก่า เครื่องถม ของกิน'],
  ['suchart-shadow-puppet-house','attraction','บ้านหนังตะลุงสุชาติ ดูแกะตัวหนัง การเล่น ศิลปะพื้นบ้านใต้'],
  ['laem-talumphuk-pak-phanang','attraction','แหลมตะลุมพุก ปากพนัง หาดทรายยาว ชุมชนประมง ตลาดอาหารทะเล วิถีชายเล'],
  ['khao-luang-national-park','attraction','อุทยานแห่งชาติเขาหลวง เดินป่า น้ำตก ยอดเขาหลวง ธรรมชาติฝั่งตะวันตก'],
  ['phrom-lok-waterfall','attraction','น้ำตกพรหมโลก พรหมคีรี ชั้นน้ำตกสวย เล่นน้ำ ใกล้เมือง'],
  ['nakhon-beaches-sichon-thasala','attraction','หาดทะเลนคร สิชล ขนอม ท่าศาลา หินงาม จุดพักริมทะเลอ่าวไทย'],
]
const PLAN = [
  ['nakhon-1-day-itinerary','itinerary','แผนเที่ยวนครศรีธรรมราช 1 วัน พระธาตุ+เมืองเก่า+ข้าวแกงใต้ หรือ ไอ้ไข่วันเดียว ใช้ block day'],
  ['nakhon-2d1n-itinerary','itinerary','แผนนครศรีธรรมราช 2 วัน 1 คืน พระธาตุ-ไอ้ไข่-ข้าวแกงใต้ ใช้ block day'],
  ['nakhon-3d2n-itinerary','itinerary','แผนนครศรีธรรมราช 3 วัน 2 คืน เมือง+ไอ้ไข่+คีรีวง/ขนอม ใช้ block day'],
  ['nakhon-ai-khai-pilgrimage-plan','itinerary','แผนสายมูเตลู ไหว้พระธาตุ-ไอ้ไข่วัดเจดีย์-ศาลหลักเมือง ใช้ block day'],
  ['nakhon-khiriwong-nature-plan','itinerary','แผนสายธรรมชาติ คีรีวง-น้ำตกกรุงชิง-เขาหลวง ใช้ block day'],
  ['nakhon-khanom-sea-plan','itinerary','แผนสายทะเล ขนอม ดูโลมาสีชมพู เขาพลายดำ หาด ใช้ block day'],
  ['nakhon-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่า ถนนวัฒนธรรม คาเฟ่ตึกเก่า ใช้ block day'],
  ['nakhon-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระธาตุ คีรีวง ขนอม คาเฟ่ตึกเก่า) ใช้ block day'],
  ['nakhon-surat-thani-plan','itinerary','แผนข้ามจังหวัด นครศรีธรรมราช–สุราษฎร์ธานี ไหว้ไอ้ไข่ต่อเขื่อนเชี่ยวหลาน ใช้ block day'],
  ['nakhon-krabi-plan','itinerary','แผนข้ามจังหวัด นครศรีธรรมราช–กระบี่ เมืองคอนต่อทะเลอันดามัน ใช้ block day'],
  ['nakhon-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ขนอมดูโลมา คีรีวง พระธาตุ คาเฟ่) ใช้ block day'],
  ['nakhon-first-timer-guide','itinerary','มานครศรีธรรมราชครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nakhon-travel-tips','prep','เตรียมตัวเที่ยวนครศรีธรรมราช (ช่วงเวลาดีสุด เลี่ยงหน้าฝน งบ การแต่งตัวไหว้พระ ของที่ควรเตรียม ขึ้นเขาหลวง)'],
  ['nakhon-getting-around','prep','การเดินทางในนครศรีธรรมราช (เครื่องบิน/รถไฟ/บขส. เช่ารถ ไปไอ้ไข่/ขนอม/คีรีวงยังไง ระยะทางจากกรุงเทพ-สุราษฎร์)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวนครศรีธรรมราช (เมืองคอน) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nakhon-si-thammarat", crumbCity="นครศรีธรรมราช", crumbCityHref="city-nakhon-si-thammarat.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nakhon-si-thammarat.html และ top10-hotels-nakhon-si-thammarat.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

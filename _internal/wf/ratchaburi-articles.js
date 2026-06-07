export const meta = {
  name: 'ratchaburi-articles',
  description: 'Ratchaburi gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['ratchaburi-food-guide','food','รวมของกินราชบุรีที่ต้องลอง คละก๋วยเตี๋ยวเรือ/ตลาดน้ำดำเนิน/ไทยทรงดำ/คาเฟ่เมืองเก่า (ภาพรวม + cards)'],
  ['damnoen-saduak-boat-noodles','eat-ranking','จัดอันดับร้านก๋วยเตี๋ยวเรือดำเนินสะดวก น้ำตกเข้มข้น ร้านเก่าริมคลอง'],
  ['ratchaburi-old-town-cafe','eat-ranking','จัดอันดับคาเฟ่ราชบุรี เมืองเก่าริมแม่กลอง/ในโรงโอ่ง นั่งจิบกาแฟดูบรรยากาศเมืองโอ่ง'],
  ['thai-song-dam-food','food','อาหารไทยทรงดำราชบุรี (แกงหน่อส้ม ข้าวหลามไทยทรงดำ จิ้มแจ่วรสจัด) อาหารพื้นถิ่นหากินยาก'],
  ['damnoen-fruit-orchards-food','food','ผลไม้สวนดำเนินสะดวก (องุ่น ชมพู่ มะพร้าวน้ำหอม ฝรั่ง) ซื้อสดจากสวนริมคลอง'],
  ['ratchaburi-coconut-sweets','food','ขนมหวานน้ำตาลมะพร้าวดำเนิน (ทองหยอด ขนมหม้อแกง ข้าวเหนียวมูน) ของหวานพื้นถิ่น'],
  ['suan-phueng-riverside-restaurants','eat-ranking','ร้านอาหารและคาเฟ่ริมธารสวนผึ้ง ปลาเผา ส้มตำ บรรยากาศเย็นใต้ร่มไม้'],
  ['ratchaburi-souvenir','eat-ranking','ของฝากเมืองโอ่งราชบุรี (เครื่องปั้นดินเผา กุนเชียง ผลไม้แปรรูป ผ้าทอคูบัว) ซื้อที่ไหน'],
  ['ratchaburi-local-breakfast','food','อาหารเช้าแบบคนราชบุรี (ก๋วยเตี๋ยวเรือ ข้าวแกง กาแฟโบราณ ตลาดเช้า) ก่อนเที่ยวเมือง'],
]
const SEE = [
  ['ratchaburi-attractions','attraction','รวมที่เที่ยวราชบุรีที่ต้องไป คละเมือง/วัฒนธรรม/ธรรมชาติ (ภาพรวม + cards)'],
  ['damnoen-saduak-floating-market','attraction','ตลาดน้ำดำเนินสะดวก แม่ค้าพายเรือขายของกิน/ผลไม้ คึกคักเช้า การเดินทาง เวลาที่ควรไป'],
  ['dragon-jar-pottery','attraction','โรงโอ่งมังกรราชบุรี ดูการปั้นโอ่งดินเผาเคลือบลายมังกร ซื้อเครื่องปั้น คาเฟ่ในโรงโอ่ง'],
  ['suan-phueng','attraction','อำเภอสวนผึ้ง เทือกเขาตะนาวศรี อากาศเย็น ทุ่งหญ้า ธารน้ำ ฟาร์มแกะ รีสอร์ต การเดินทาง'],
  ['tham-khao-ngu','attraction','ถ้ำเขางู เขาหินปูนใกล้เมือง ถ้ำพระพุทธรูปสลักผนังเก่า เดินขึ้นชมถ้ำและวิวเมือง'],
  ['khao-kaen-chan','attraction','เขาแก่นจันทน์ พระพุทธรูปองค์ใหญ่บนเขา จุดชมวิวมองลงเมืองราชบุรี การขึ้น'],
  ['ratchaburi-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติ ราชบุรี ในอาคารศาลากลางเก่าริมแม่กลอง โบราณวัตถุเมืองคูบัว'],
  ['ban-khu-bua-weaving','attraction','บ้านคูบัว ชุมชนไทยวน ทอผ้าตีนจกลายโบราณ ศูนย์ทอผ้า ซากเมืองโบราณคูบัว'],
  ['nine-falls-bo-khlueng-hot-spring','attraction','น้ำตกเก้าโจนและธารน้ำร้อนบ่อคลึง สวนผึ้ง–บ้านคา เทือกเขาตะนาวศรี เด่นหน้าฝน'],
  ['ratchaburi-old-town-walk','attraction','เดินเมืองเก่าริมแม่น้ำแม่กลอง ตลาดเก่า ตึกแถว วัดริมน้ำ คาเฟ่ บรรยากาศเมืองโอ่ง'],
  ['suan-phueng-sheep-farms','attraction','ฟาร์มแกะและจุดถ่ายรูปสวนผึ้ง (The Scenery/Swiss Sheep Farm) กิจกรรมครอบครัว ค่าเข้า'],
  ['ratchaburi-best-temples','attraction','วัดเด่นราชบุรี (วัดมหาธาตุวรวิหาร วัดหนองหอย เขาวงพระจันทร์) เส้นทางไหว้พระ'],
]
const PLAN = [
  ['ratchaburi-1-day-itinerary','itinerary','แผนเที่ยวราชบุรี 1 วัน ตลาดน้ำดำเนิน–โรงโอ่ง–เมืองเก่า ใช้ block day'],
  ['ratchaburi-2d1n-itinerary','itinerary','แผนราชบุรี 2 วัน 1 คืน เมืองโอ่ง–ดำเนินสะดวก–สวนผึ้ง ใช้ block day'],
  ['ratchaburi-3d2n-itinerary','itinerary','แผนราชบุรี 3 วัน 2 คืน เมือง–ดำเนิน–สวนผึ้งธรรมชาติ ใช้ block day'],
  ['ratchaburi-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าริมแม่กลอง/โรงโอ่ง ใช้ block day'],
  ['suan-phueng-nature-plan','itinerary','แผนสายธรรมชาติ สวนผึ้ง–น้ำตก–บ่อน้ำร้อน–ฟาร์มแกะ ใช้ block day'],
  ['ratchaburi-culture-plan','itinerary','แผนสายวัฒนธรรม โรงโอ่ง–คูบัว–พิพิธภัณฑ์–ผ้าตีนจก ใช้ block day'],
  ['ratchaburi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ตลาดน้ำ โอ่งมังกร ฟาร์มแกะ เขาแก่นจันทน์) ใช้ block day'],
  ['damnoen-floating-market-plan','itinerary','แผนเที่ยวตลาดน้ำดำเนินสะดวกเช้าตรู่ + รอบ ๆ ดำเนิน ใช้ block day'],
  ['ratchaburi-samut-songkhram-plan','itinerary','แผนข้ามจังหวัด ราชบุรี–สมุทรสงคราม ดำเนินสะดวกต่ออัมพวา ใช้ block day'],
  ['ratchaburi-phetchaburi-plan','itinerary','แผนข้ามจังหวัด ราชบุรี–เพชรบุรี เมืองเก่าฝั่งตะวันตก ใช้ block day'],
  ['ratchaburi-kanchanaburi-plan','itinerary','แผนข้ามจังหวัด ราชบุรี–กาญจนบุรี ธรรมชาติฝั่งตะวันตก ใช้ block day'],
  ['ratchaburi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก ราชบุรี ฟาร์มแกะ ตลาดน้ำ สวนผึ้ง ใช้ block day'],
  ['ratchaburi-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวราชบุรีคุ้ม ใช้ block day'],
  ['ratchaburi-first-timer-guide','itinerary','มาราชบุรีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['ratchaburi-travel-tips','prep','เตรียมตัวเที่ยวราชบุรี (ตลาดน้ำไปเช้า สวนผึ้งหน้าหนาว น้ำตกหน้าฝน อากาศ งบ ของฝากเมืองโอ่ง)'],
  ['ratchaburi-getting-around','prep','การเดินทางไป/ในราชบุรี (จากกรุงเทพ รถตู้ ขับรถเอง ไปดำเนินสะดวก–สวนผึ้ง รถในเมือง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวราชบุรีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="ratchaburi", crumbCity="ราชบุรี", crumbCityHref="city-ratchaburi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-ratchaburi.html และ top10-hotels-ratchaburi.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

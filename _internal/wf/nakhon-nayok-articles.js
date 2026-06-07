export const meta = {
  name: 'nakhon-nayok-articles',
  description: 'Nakhon Nayok gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + culture + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nakhon-nayok-food-guide','food','รวมของกินนครนายกที่ต้องลอง คละส้มตำ/อาหารริมน้ำตก/มะยงชิด/คาเฟ่วิวเขา (ภาพรวม + cards)'],
  ['nakhon-nayok-somtam','eat-ranking','จัดอันดับร้านส้มตำนครนายกเจ้าดัง รสจัด หลายสูตร กินคู่ไก่ย่าง ตามเส้นทางขึ้นน้ำตก'],
  ['waterfall-riverside-restaurants','eat-ranking','จัดอันดับร้านอาหารริมน้ำตก/ลำธาร (นางรอง สาริกา) ปลาเผา กุ้ง ต้มยำ นั่งเท้าแช่น้ำ'],
  ['nakhon-nayok-cafe-guide','eat-ranking','จัดอันดับคาเฟ่วิวภูเขา/ท้องนาเชิงเขาใหญ่ฝั่งนครนายก นั่งจิบกาแฟรับลมเย็น'],
  ['nakhon-nayok-marian-plum-fruit','food','มะยงชิดและมะปรางหวานนครนายก ผลไม้พื้นเมือง หน้ามี.ค.–เม.ย. ซื้อจากสวน'],
  ['nakhon-nayok-banana-souvenir','food','กล้วยไข่นครนายกและของฝาก (กล้วยฉาบ กล้วยตาก) ซื้อที่ไหน'],
  ['nakhon-nayok-isan-food','eat-ranking','ร้านอาหารอีสานนครนายก (ส้มตำ ลาบ ไก่ย่าง) รสจัดร้านที่คนพื้นที่ไป'],
  ['nakhon-nayok-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างนครนายก มื้อเย็นยอดนิยม กลุ่มมากางเต็นท์ คุ้มราคา'],
  ['nakhon-nayok-local-breakfast','food','อาหารเช้าแบบคนนครนายก (ก๋วยเตี๋ยว ข้าวต้ม กาแฟ ตลาดเช้า) ก่อนขึ้นน้ำตก'],
]
const SEE = [
  ['nakhon-nayok-attractions','attraction','รวมที่เที่ยวนครนายกที่ต้องไป คละธรรมชาติ/วัฒนธรรม/เมือง (ภาพรวม + cards)'],
  ['nang-rong-waterfall','attraction','น้ำตกนางรอง น้ำตกเชิงเขาใหญ่ยอดนิยม แอ่งเล่นน้ำ ร้านอาหารริมน้ำ ค่าเข้า การเดินทาง'],
  ['sarika-waterfall','attraction','น้ำตกสาริกา น้ำตกสายสูงไหลเป็นชั้น เดินขึ้นชม นั่งกินข้าวริมลำธาร ช่วงน้ำเยอะ'],
  ['khun-dan-prakan-chon-dam','attraction','เขื่อนขุนด่านปราการชล เขื่อนคอนกรีตบดอัดยาว จุดชมวิวอ่างเก็บน้ำ ขับรถขึ้นถ่ายรูป'],
  ['wang-takrai','attraction','วังตะไคร้ สวนป่าริมลำธารร่มรื่น เล่นน้ำตื้น กางเต็นท์ มาเป็นครอบครัว'],
  ['ganesha-park-nakhon-nayok','attraction','อุทยานพระพิฆเนศ องค์ใหญ่ปางนอนเสวยสุข จุดสักการะขอพร ถ่ายรูป การเดินทาง'],
  ['nakhon-nayok-rafting','attraction','ล่องแก่งแม่น้ำนครนายก กิจกรรมผจญภัยหน้าฝน เรือยาง ห่วงยาง จุดให้บริการ ความปลอดภัย'],
  ['wat-khao-nang-buat','attraction','วัดเขานางบวช วัดบนเนินเขา วิวเมืองและท้องทุ่ง เดินขึ้นไหว้พระชมวิว'],
  ['khao-yai-nakhon-nayok-side','attraction','เชิงเขาใหญ่ฝั่งนครนายก เส้นทางรีสอร์ท คาเฟ่วิวเขา จุดกางเต็นท์ หนีกรุงเทพรับอากาศเย็น'],
  ['nakhon-nayok-camping','attraction','จุดกางเต็นท์นครนายก ริมน้ำ/เชิงเขา ลานกางเต็นท์แนะนำ สิ่งอำนวยความสะดวก ช่วงเวลา'],
  ['nakhon-nayok-adventure-activities','attraction','กิจกรรมผจญภัยนครนายก (ซิปไลน์ โรยตัว ATV พาราไกลดิง สนามยิงปืน) ที่ไหนมีบ้าง'],
  ['nakhon-nayok-city-market','attraction','ตลาดและย่านเมืองนครนายก ของกินท้องถิ่น เดินชิมก่อน/หลังขึ้นน้ำตก'],
]
const PLAN = [
  ['nakhon-nayok-1-day-itinerary','itinerary','แผนเที่ยวนครนายก 1 วัน น้ำตกนางรอง–เขื่อนขุนด่าน–คาเฟ่ ใช้ block day'],
  ['nakhon-nayok-2d1n-itinerary','itinerary','แผนนครนายก 2 วัน 1 คืน น้ำตก–เขื่อน–กางเต็นท์ ใช้ block day'],
  ['nakhon-nayok-3d2n-itinerary','itinerary','แผนนครนายก 3 วัน 2 คืน น้ำตก–ผจญภัย–เชิงเขาใหญ่ ใช้ block day'],
  ['nakhon-nayok-waterfall-plan','itinerary','แผนสายน้ำตก นางรอง–สาริกา–วังตะไคร้ เล่นน้ำคลายร้อน ใช้ block day'],
  ['nakhon-nayok-adventure-rafting-plan','itinerary','แผนสายผจญภัย ล่องแก่งและกิจกรรมริมน้ำนครนายก ใช้ block day'],
  ['nakhon-nayok-cafe-mountain-plan','itinerary','แผนสายคาเฟ่และวิวภูเขาเชิงเขาใหญ่ ใช้ block day'],
  ['nakhon-nayok-camping-plan','itinerary','แผนกางเต็นท์นครนายก ริมน้ำ/เชิงเขา รับอากาศเย็น ใช้ block day'],
  ['bangkok-nakhon-nayok-day-trip','itinerary','แผนเดย์ทริปจากกรุงเทพ เล่นน้ำตกคลายร้อนนครนายก ไปเช้าเย็นกลับ ใช้ block day'],
  ['nakhon-nayok-khao-yai-plan','itinerary','แผนข้ามจังหวัด นครนายก–นครราชสีมา ต่อขึ้นเขาใหญ่ ใช้ block day'],
  ['nakhon-nayok-prachinburi-plan','itinerary','แผนข้ามจังหวัด นครนายก–ปราจีนบุรี ธรรมชาติฝั่งตะวันออก ใช้ block day'],
  ['nakhon-nayok-saraburi-plan','itinerary','แผนข้ามจังหวัด นครนายก–สระบุรี น้ำตก–ทุ่งทานตะวัน ใช้ block day'],
  ['nakhon-nayok-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก นครนายก น้ำตก วังตะไคร้ พระพิฆเนศ ใช้ block day'],
  ['nakhon-nayok-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวนครนายกคุ้ม ใช้ block day'],
  ['nakhon-nayok-first-timer-guide','itinerary','มานครนายกครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nakhon-nayok-travel-tips','prep','เตรียมตัวเที่ยวนครนายก (หน้าฝนน้ำตกน้ำเยอะมิ.ย.–ต.ค. หน้าหนาวกางเต็นท์ มะยงชิดมี.ค.–เม.ย. ความปลอดภัยล่องแก่ง งบ)'],
  ['nakhon-nayok-getting-around','prep','การเดินทางไป/ในนครนายก (จากกรุงเทพ รถตู้รังสิต–องครักษ์ ขับรถเอง ไปน้ำตก–เขื่อน–เชิงเขาใหญ่ รถในพื้นที่)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวนครนายกลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nakhon-nayok", crumbCity="นครนายก", crumbCityHref="city-nakhon-nayok.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nakhon-nayok.html และ top10-hotels-nakhon-nayok.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

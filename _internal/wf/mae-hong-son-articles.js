export const meta = {
  name: 'mae-hong-son-articles',
  description: 'Mae Hong Son gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '10 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + city + culture)' },
    { title: 'Plan', detail: '13 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['mae-hong-son-food-guide','food','รวมของกินแม่ฮ่องสอนที่ต้องลอง คละอาหารเหนือ/ไทใหญ่/ยูนนาน/คาเฟ่ (ภาพรวม + cards)'],
  ['top-khao-soi-nam-ngiao-mae-hong-son','eat-ranking','จัดอันดับร้านข้าวซอย–น้ำเงี้ยวแม่ฮ่องสอนที่คนพื้นที่ไปจริง (ร้านจริง ย่าน/ราคา/จุดเด่น)'],
  ['mae-hong-son-tai-yai-cuisine','eat-ranking','ร้านอาหารไทใหญ่ดั้งเดิม (ถั่วเน่า น้ำพริกอ่องไต ฮังเลไต ข้าวเส้นน้ำเงี้ยว) ร้านที่คนไตไป'],
  ['pai-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ปาย ริมน้ำ/ในสวน/วิวเขา กาแฟดอย บรรยากาศถ่ายรูป'],
  ['ban-rak-thai-yunnan-food','eat-ranking','อาหารยูนนานบ้านรักไทย (หมูพันปี ขาหมูหมั่นโถว ไก่ตุ๋นยาจีน) ร้านในหมู่บ้านริมชายแดน'],
  ['ja-bo-noodles-viewpoint','food','ก๋วยเตี๋ยวบ้านจ่าโบ่ วิวหน้าผาปางมะผ้า ของกินที่คนขับรถผ่านต้องแวะ'],
  ['mae-hong-son-morning-market-food','food','ตลาดเช้าแม่ฮ่องสอน (ขนมจีนน้ำเงี้ยว ข้าวเส้น ขนมพื้นเมืองไต) ของกินเช้า'],
  ['pai-walking-street-food','food','ถนนคนเดินปายตอนเย็น ของกินเดินชิม สตรีทฟู้ด ของหวาน'],
  ['mae-hong-son-local-breakfast','food','อาหารเช้าแบบคนแม่ฮ่องสอน (ข้าวซอย น้ำเงี้ยว ข้าวเส้น กาแฟ ตลาดเช้าสายหยุด)'],
  ['mae-hong-son-souvenir-food','eat-ranking','ของฝากของกินแม่ฮ่องสอน (ถั่วเน่าแผ่น ของแห้งพื้นเมือง ชาบ้านรักไทย) ซื้อที่ไหน'],
]
const SEE = [
  ['mae-hong-son-attractions','attraction','รวมที่เที่ยวแม่ฮ่องสอนที่ต้องไป คละธรรมชาติ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['pai-guide','attraction','เที่ยวปายครบ (ถนนคนเดิน สะพานประวัติศาสตร์ คาเฟ่ จุดชมวิว การเดินทาง)'],
  ['pang-ung-guide','attraction','ปางอุ๋ง อ่างเก็บน้ำกลางป่าสน หมอกเช้า ที่พัก/กางเต็นท์ การเดินทาง'],
  ['bua-tong-fields-khun-yuam','attraction','ทุ่งบัวตองดอยแม่อูคอ ขุนยวม ช่วงบาน (พฤศจิกายน) การเดินทาง จุดถ่ายรูป'],
  ['tham-lod-cave-guide','attraction','ถ้ำลอด ปางมะผ้า นั่งแพไม้ไผ่ หินงอกหินย้อย โลงไม้โบราณ การเที่ยว'],
  ['ban-rak-thai-guide','attraction','บ้านรักไทย หมู่บ้านจีนยูนนาน ไร่ชา บ้านดิน ที่พัก การเดินทางริมชายแดน'],
  ['wat-chong-kham-chong-klang','attraction','วัดจองคำ–วัดจองกลาง ริมหนองจองคำ วัดไทใหญ่กลางเมือง สะท้อนน้ำตอนเย็น'],
  ['phra-that-doi-kong-mu','attraction','พระธาตุดอยกองมู จุดชมวิวเมืองแม่ฮ่องสอนทั้งหุบ การเดินทางขึ้นดอย'],
  ['ban-ja-bo-guide','attraction','บ้านจ่าโบ่ หมู่บ้านปกาเกอะญอบนสันเขา ปางมะผ้า ทะเลหมอก ร้านก๋วยเตี๋ยววิวหน้าผา'],
  ['pai-canyon-viewpoints','attraction','ปายแคนยอนและจุดชมวิวรอบปาย (กองแลน ชมพระอาทิตย์ตก) จุดถ่ายรูป'],
  ['mae-hong-son-waterfalls-hot-springs','attraction','น้ำตกและน้ำพุร้อนรอบแม่ฮ่องสอน–ปาย (น้ำพุร้อนเมืองแปง น้ำตก) ธรรมชาติ'],
  ['mae-hong-son-sea-of-mist','attraction','จุดชมทะเลหมอกแม่ฮ่องสอน (ดอยกองมู ปางอุ๋ง บ้านจ่าโบ่ กิ่วลม) เช้ามืดดูหมอก'],
]
const PLAN = [
  ['mae-hong-son-1-day-itinerary','itinerary','แผนเที่ยวแม่ฮ่องสอน 1 วัน ในตัวเมือง (หนองจองคำ–ดอยกองมู–วัดไทใหญ่) ใช้ block day'],
  ['mae-hong-son-2d1n-itinerary','itinerary','แผนแม่ฮ่องสอน 2 วัน 1 คืน ปาย–ปางมะผ้า–ถ้ำลอด ใช้ block day'],
  ['mae-hong-son-3d2n-itinerary','itinerary','แผนแม่ฮ่องสอน 3 วัน 2 คืน ปาย–ตัวเมือง–ปางอุ๋ง ใช้ block day'],
  ['pai-cafe-hopping-plan','itinerary','แผนสายคาเฟ่ปาย ตะลุยร้านกาแฟ/ของกิน 1-2 วัน ใช้ block day'],
  ['mae-hong-son-nature-plan','itinerary','แผนสายธรรมชาติ ปางอุ๋ง–ทุ่งบัวตอง–ทะเลหมอก ใช้ block day'],
  ['mae-hong-son-tai-yai-culture-plan','itinerary','แผนสายวัฒนธรรมไทใหญ่–บ้านรักไทย วัด ตลาดเช้า ใช้ block day'],
  ['mae-hong-son-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ทะเลหมอก คาเฟ่ วัด ปายแคนยอน) ใช้ block day'],
  ['chiang-mai-mae-hong-son-loop','itinerary','แผนข้ามจังหวัด เชียงใหม่–ปาย–แม่ฮ่องสอน วนลูป 4 วัน (ทางโค้ง) ใช้ block day'],
  ['mae-hong-son-chiang-rai-plan','itinerary','แผนข้ามจังหวัด แม่ฮ่องสอน–เชียงราย ต่อเที่ยวเหนือสุด ใช้ block day'],
  ['mae-hong-son-lamphun-plan','itinerary','แผนข้ามจังหวัด แม่ฮ่องสอน–ลำพูน ผ่านเชียงใหม่ ใช้ block day'],
  ['mae-hong-son-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ถ้ำลอด ปางอุ๋ง คาเฟ่ ไม่ลุยมาก) ใช้ block day'],
  ['mae-hong-son-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวแม่ฮ่องสอน–ปายคุ้ม ใช้ block day'],
  ['mae-hong-son-first-timer-guide','itinerary','มาแม่ฮ่องสอนครั้งแรกต้องรู้อะไร + แผนแนะนำ (ทางโค้ง เมารถ ช่วงเวลา) ใช้ block day/list'],
]
const PREP = [
  ['mae-hong-son-travel-tips','prep','เตรียมตัวเที่ยวแม่ฮ่องสอน (ช่วงเวลาดีสุด เลี่ยงฝุ่นควันมีนา-เมษา อากาศหนาว เมารถทางโค้ง งบ ของที่ควรเตรียม)'],
  ['mae-hong-son-getting-around','prep','การเดินทางไป/ในแม่ฮ่องสอน (ทางโค้ง 1864 โค้ง เครื่องบิน รถตู้จากเชียงใหม่ เช่ารถ/มอไซค์ ปาย–ปางมะผ้า)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวแม่ฮ่องสอนลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="mae-hong-son", crumbCity="แม่ฮ่องสอน", crumbCityHref="city-mae-hong-son.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-mae-hong-son.html และ top10-hotels-mae-hong-son.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

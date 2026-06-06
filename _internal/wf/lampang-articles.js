export const meta = {
  name: 'lampang-articles',
  description: 'Lampang gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['lampang-food-guide','food','รวมของกินลำปางที่ต้องลอง คละอาหารเหนือ/ก๋วยเตี๋ยวเกี้ยวห้อยขา/ข้าวแต๋น/คาเฟ่ตึกเก่า (ภาพรวม + cards)'],
  ['lampang-northern-cuisine','eat-ranking','ร้านอาหารเหนือลำปาง (ข้าวซอย น้ำเงี้ยว แกงฮังเล ไส้อั่ว น้ำพริกอ่อง) ร้านที่คนเหนือไป'],
  ['lampang-old-town-cafe','eat-ranking','จัดอันดับคาเฟ่ในตึกเก่า/บ้านไม้ย่านเมืองเก่าลำปาง นั่งจิบกาแฟบรรยากาศย้อนยุค'],
  ['kuaytiao-koei-hoi-kha','food','ก๋วยเตี๋ยวเกี้ยวห้อยขาริมน้ำวัง ร้านเก่าคู่เมืองลำปาง นั่งห้อยขากิน'],
  ['lampang-khao-tan-souvenir','eat-ranking','ข้าวแต๋นน้ำแตงโมและของฝากลำปาง (ข้าวแต๋น แคบหมู ของแห้ง) ซื้อที่ไหน'],
  ['lampang-khanom-jeen-nam-ngiao','food','ขนมจีนน้ำเงี้ยว/ขนมเส้นลำปาง รสเหนือ กินกับผักและแคบหมู ร้านเช้า/ตลาด'],
  ['lampang-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างลำปาง ร้านยอดนิยมมื้อเย็น คุ้มราคา'],
  ['lampang-morning-market-food','food','ตลาดเช้าและสตรีทฟู้ดลำปาง ข้าวแกง ขนมพื้นเมือง ของกินเช้าราคาท้องถิ่น'],
  ['lampang-local-breakfast','food','อาหารเช้าแบบคนลำปาง (ข้าวซอย ขนมจีน กาแฟโบราณ ตลาดเช้า) ก่อนเที่ยวเมืองเก่า'],
]
const SEE = [
  ['lampang-attractions','attraction','รวมที่เที่ยวลำปางที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['wat-phra-that-lampang-luang','attraction','วัดพระธาตุลำปางหลวง วัดไม้โบราณ เจดีย์ทอง จุดดูเงาพระธาตุหัวกลับ การเดินทาง'],
  ['kad-kong-ta','attraction','กาดกองต้า ถนนคนเดินเมืองเก่าริมน้ำวัง ตึกเก่าจีน-พม่า ของกิน เปิดเสาร์อาทิตย์'],
  ['wat-phra-kaew-don-tao','attraction','วัดพระแก้วดอนเต้าสุชาดาราม วัดเก่ากลางเมือง เจดีย์ทอง วิหารศิลปะพม่า'],
  ['wat-chaloem-phra-kiat-doi-phra-bat','attraction','วัดเฉลิมพระเกียรติพระจอมเกล้าฯ เจดีย์ขาวเรียงบนยอดเขาหินปูนแจ้ห่ม วิว การขึ้น'],
  ['thai-elephant-conservation-center','attraction','ศูนย์อนุรักษ์ช้างไทย ห้างฉัตร โรงพยาบาลช้าง การแสดง รอบ ค่าเข้า'],
  ['chae-son-national-park','attraction','อุทยานแห่งชาติแจ้ซ้อน บ่อน้ำพุร้อน ต้มไข่ออนเซน น้ำตก แช่น้ำร้อน ที่พัก'],
  ['baan-sao-nak','attraction','บ้านเสานัก บ้านไม้สักเก่าเสาร้อยต้น สถาปัตยกรรมล้านนา-พม่า เปิดให้เข้าชม'],
  ['lampang-horse-carriage','attraction','รถม้าลำปาง เมืองเดียวในไทยที่ยังมีรถม้า เส้นทางนั่งชมเมือง ราคา จุดขึ้น'],
  ['dhanabadee-chicken-bowl','attraction','ชามตราไก่ลำปาง พิพิธภัณฑ์ธนบดี ดูการปั้น เลือกซื้อชามลายไก่'],
  ['lampang-old-town-walk','attraction','เดินเมืองเก่าลำปาง ถนนสายวัฒนธรรม บ้านไม้ ร้านรุ่นใหม่ในตึกเก่า จุดถ่ายรูป'],
  ['lampang-best-temples','attraction','วัดเด่นลำปางที่ไม่ควรพลาด (วัดปงสนุก วัดศรีชุม วัดไหล่หินหลวง) เส้นทางไหว้พระ'],
]
const PLAN = [
  ['lampang-1-day-itinerary','itinerary','แผนเที่ยวลำปาง 1 วัน เมืองเก่า–วัดพระธาตุลำปางหลวง–คาเฟ่ ใช้ block day'],
  ['lampang-2d1n-itinerary','itinerary','แผนลำปาง 2 วัน 1 คืน เมืองเก่า–วัด–กาดกองต้า ใช้ block day'],
  ['lampang-3d2n-itinerary','itinerary','แผนลำปาง 3 วัน 2 คืน เมือง–แจ้ซ้อน–ศูนย์ช้าง ใช้ block day'],
  ['lampang-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และตึกเก่าเมืองลำปาง ใช้ block day'],
  ['lampang-nature-chae-son-plan','itinerary','แผนสายธรรมชาติ แจ้ซ้อน–น้ำพุร้อน–น้ำตก ใช้ block day'],
  ['lampang-culture-temples-plan','itinerary','แผนสายวัด/วัฒนธรรมล้านนา ลำปางหลวง–พระแก้วดอนเต้า ใช้ block day'],
  ['lampang-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (รถม้า ตึกเก่า เจดีย์ขาวบนเขา) ใช้ block day'],
  ['lampang-horse-carriage-temple-plan','itinerary','แผนนั่งรถม้าชมเมืองและไหว้พระลำปาง ใช้ block day'],
  ['lampang-chiang-mai-plan','itinerary','แผนข้ามจังหวัด ลำปาง–เชียงใหม่ ทริปเหนือ ใช้ block day'],
  ['lampang-lamphun-plan','itinerary','แผนข้ามจังหวัด ลำปาง–ลำพูน เมืองเก่าล้านนา ใช้ block day'],
  ['lampang-phrae-plan','itinerary','แผนข้ามจังหวัด ลำปาง–แพร่ เมืองเก่า–บ้านไม้สัก ใช้ block day'],
  ['lampang-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก ลำปาง ศูนย์ช้าง รถม้า แจ้ซ้อน ใช้ block day'],
  ['lampang-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวลำปางคุ้ม ใช้ block day'],
  ['lampang-first-timer-guide','itinerary','มาลำปางครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['lampang-travel-tips','prep','เตรียมตัวเที่ยวลำปาง (ช่วงเวลาดีสุด อากาศหนาว กาดกองต้าเปิดเสาร์อาทิตย์ งบ ของฝาก)'],
  ['lampang-getting-around','prep','การเดินทางไป/ในลำปาง (รถไฟสถานีลำปาง รถทัวร์ ขับรถเอง รถม้า รถสองแถว ไปแจ้ซ้อน/ศูนย์ช้าง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวลำปางลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="lampang", crumbCity="ลำปาง", crumbCityHref="city-lampang.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-lampang.html และ top10-hotels-lampang.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

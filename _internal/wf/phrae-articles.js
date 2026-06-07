export const meta = {
  name: 'phrae-articles',
  description: 'Phrae gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phrae-food-guide','food','รวมของกินแพร่ที่ต้องลอง คละอาหารเหนือ/ขนมเส้นน้ำเงี้ยว/ข้าวแคบ/คาเฟ่เมืองเก่า (ภาพรวม + cards)'],
  ['phrae-northern-cuisine','eat-ranking','ร้านอาหารเหนือแพร่ (ข้าวซอย น้ำเงี้ยว แกงฮังเล ไส้อั่ว น้ำพริกหนุ่ม) ร้านที่คนเหนือไป'],
  ['phrae-old-town-cafe','eat-ranking','จัดอันดับคาเฟ่ในเมืองเก่าแพร่ บ้านไม้/เรือนเก่า นั่งจิบกาแฟบรรยากาศเงียบ'],
  ['phrae-khanom-jeen-nam-ngiao','food','ขนมเส้นน้ำใส่–น้ำเงี้ยวแพร่ เมนูเช้าคนแพร่ กินกับผักและแคบหมู ร้านเด็ด'],
  ['phrae-khao-khaep-souvenir','food','ข้าวแคบ–ข้าวควบแพร่ แผ่นแป้งย่างไฟกรอบ ของกินเล่นพื้นถิ่น ของฝากซื้อที่ไหน'],
  ['phrae-sai-ua-khaep-mu','food','ไส้อั่วและแคบหมูแพร่ กับข้าว/ของฝากคู่เมืองเหนือ ร้านดังในเมือง'],
  ['phrae-city-noodles','eat-ranking','ก๋วยเตี๋ยวเมืองแพร่ (ก๋วยเตี๋ยวรสจัดถั่วป่นมะนาวแบบสุโขทัย + ก๋วยเตี๋ยวเหนือ) ร้านเก่า'],
  ['phrae-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างแพร่ มื้อเย็นยอดนิยม คุ้มราคา'],
  ['phrae-local-breakfast','food','อาหารเช้าแบบคนแพร่ (ขนมเส้น ข้าวซอย กาแฟ ตลาดเช้า/กาด) ก่อนเดินเมืองเก่า'],
]
const SEE = [
  ['phrae-attractions','attraction','รวมที่เที่ยวแพร่ที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['wat-phra-that-cho-hae','attraction','วัดพระธาตุช่อแฮ พระธาตุคู่เมืองบนเนินเขา พระธาตุประจำปีขาล การไหว้พระ การเดินทาง'],
  ['khum-chao-luang-phrae','attraction','คุ้มเจ้าหลวงเมืองแพร่ บ้านไม้สักทรงยุโรปผสมล้านนา สถาปัตยกรรมเจ้าหลวงองค์สุดท้าย'],
  ['ban-wongburi','attraction','บ้านวงศ์บุรี เรือนไม้สักสีชมพูทรงขนมปังขิง ลวดลายฉลุละเอียด เปิดให้เข้าชม'],
  ['ban-prathapjai','attraction','บ้านประทับใจ (บ้านเสาร้อยต้น) บ้านไม้สักเสาทั้งต้นนับร้อยต้น โชว์ความงามไม้สักเมืองแพร่'],
  ['phae-mueang-phi','attraction','แพะเมืองผี ดินและหินถูกกัดเซาะเป็นเสา/หน้าผารูปแปลกตา เดินชมธรรมชาติ ค่าเข้า'],
  ['phrae-old-town-walk','attraction','เดินเมืองเก่าแพร่–ประตูชัย คูเมือง บ้านไม้สัก วัดเก่า คาเฟ่เล็ก ๆ บรรยากาศเงียบ'],
  ['wat-chom-sawan','attraction','วัดจอมสวรรค์ วัดศิลปะไทใหญ่สร้างด้วยไม้ทั้งหลัง งานไม้ฉลุ ของเก่า'],
  ['wiang-kosai-mae-koeng-waterfall','attraction','อุทยานแห่งชาติเวียงโกศัย น้ำตกแม่เกิ๋ง ป่าเขียว น้ำตกใส เดินป่า แช่น้ำ'],
  ['ban-thung-hong-indigo','attraction','บ้านทุ่งโฮ้ง แหล่งผ้าหม้อห้อมย้อมคราม ดูการย้อม ซื้อเสื้อผ้าหม้อห้อม'],
  ['phrae-teak-houses','attraction','บ้านไม้สักเมืองแพร่ รวมเรือนไม้สักเก่างาม (คุ้มวิชัยราชา บ้านขุนนางเก่า) เส้นทางชมสถาปัตยกรรม'],
  ['phrae-best-temples','attraction','วัดเด่นแพร่ (วัดพระบาทมิ่งเมือง วัดสระบ่อแก้ว วัดพงษ์สุนันท์) เส้นทางไหว้พระในเมือง'],
]
const PLAN = [
  ['phrae-1-day-itinerary','itinerary','แผนเที่ยวแพร่ 1 วัน เมืองเก่า–คุ้มเจ้าหลวง–พระธาตุช่อแฮ ใช้ block day'],
  ['phrae-2d1n-itinerary','itinerary','แผนแพร่ 2 วัน 1 คืน เมืองเก่า–บ้านไม้สัก–ช่อแฮ ใช้ block day'],
  ['phrae-3d2n-itinerary','itinerary','แผนแพร่ 3 วัน 2 คืน เมือง–แพะเมืองผี–เวียงโกศัย ใช้ block day'],
  ['phrae-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าแพร่ ใช้ block day'],
  ['phrae-teak-indigo-plan','itinerary','แผนสายบ้านไม้สักและผ้าหม้อห้อม ทุ่งโฮ้ง–คุ้มเจ้าหลวง–บ้านวงศ์บุรี ใช้ block day'],
  ['phrae-culture-temples-plan','itinerary','แผนสายวัด/วัฒนธรรม ช่อแฮ–จอมสวรรค์–วัดในเมือง ใช้ block day'],
  ['phrae-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (บ้านไม้สักสีชมพู แพะเมืองผี คาเฟ่เมืองเก่า) ใช้ block day'],
  ['phrae-nature-plan','itinerary','แผนสายธรรมชาติ แพะเมืองผี–เวียงโกศัย–น้ำตก ใช้ block day'],
  ['phrae-nan-plan','itinerary','แผนข้ามจังหวัด แพร่–น่าน ทริปเมืองเหนือเงียบ ๆ ใช้ block day'],
  ['phrae-lampang-plan','itinerary','แผนข้ามจังหวัด แพร่–ลำปาง เส้นทางเมืองไม้สักและรถม้า ใช้ block day'],
  ['phrae-phayao-plan','itinerary','แผนข้ามจังหวัด แพร่–พะเยา กว๊านพะเยา ใช้ block day'],
  ['phrae-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก แพร่ บ้านไม้สัก แพะเมืองผี ช่อแฮ ใช้ block day'],
  ['phrae-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวแพร่คุ้ม ใช้ block day'],
  ['phrae-first-timer-guide','itinerary','มาแพร่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phrae-travel-tips','prep','เตรียมตัวเที่ยวแพร่ (ช่วงเวลาดีสุด อากาศหนาว เดินเมืองเก่า ของฝากผ้าหม้อห้อม–ไม้สัก งบ)'],
  ['phrae-getting-around','prep','การเดินทางไป/ในแพร่ (จากกรุงเทพ รถทัวร์ สนามบินแพร่ ขับรถเอง รถในเมือง ปั่นจักรยานเมืองเก่า)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวแพร่ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phrae", crumbCity="แพร่", crumbCityHref="city-phrae.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phrae.html และ top10-hotels-phrae.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

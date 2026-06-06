export const meta = {
  name: 'phitsanulok-articles',
  description: 'Phitsanulok gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phitsanulok-food-guide','food','รวมของกินพิษณุโลกที่ต้องลอง คละก๋วยเตี๋ยวห้อยขา/ผักบุ้งลอยฟ้า/กล้วยตาก/คาเฟ่ (ภาพรวม + cards)'],
  ['kuaytiao-hoi-kha-phitsanulok','food','ก๋วยเตี๋ยวห้อยขาริมแม่น้ำน่าน นั่งห้อยขากินริมตลิ่งหน้าวัดใหญ่ ร้านดัง'],
  ['phak-bung-loi-fa','food','ผักบุ้งลอยฟ้าพิษณุโลก ผัดไฟแดงโชว์โยนกระทะ ร้านริมน้ำน่าน กินที่ไหน'],
  ['phitsanulok-cafe-guide','eat-ranking','จัดอันดับคาเฟ่พิษณุโลก ในเมืองและแถวมหาวิทยาลัย นั่งพักจิบกาแฟ'],
  ['phitsanulok-banana-souvenir','eat-ranking','กล้วยตากบางกระทุ่มและของฝากพิษณุโลก ตากแดดหวานหนึบ ซื้อที่ไหน'],
  ['phitsanulok-northern-food','eat-ranking','ร้านอาหารเหนือพิษณุโลก (ข้าวซอย น้ำเงี้ยว ไส้อั่ว แคบหมู) รสเหนือตอนล่างผสมกลาง'],
  ['phitsanulok-riverside-night-market','food','ตลาดเย็นและถนนคนเดินริมแม่น้ำน่าน ของกินเล่น ขนม อาหารพื้นถิ่น รับลมเย็น'],
  ['phitsanulok-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างพิษณุโลก ร้านยอดนิยมมื้อเย็น คุ้มราคา'],
  ['phitsanulok-local-breakfast','food','อาหารเช้าแบบคนพิษณุโลก (ก๋วยเตี๋ยว ข้าวต้ม กาแฟ ตลาดเช้า) ก่อนไหว้พระเที่ยวเมือง'],
]
const SEE = [
  ['phitsanulok-attractions','attraction','รวมที่เที่ยวพิษณุโลกที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['wat-yai-phra-buddha-chinnarat','attraction','วัดพระศรีรัตนมหาธาตุ (วัดใหญ่) พระพุทธชินราช พระพุทธรูปงดงามคู่เมือง การไหว้พระ เวลา'],
  ['phitsanulok-nan-riverside','attraction','ริมแม่น้ำน่าน–ถนนคนเดินพิษณุโลก ทางเดินริมน้ำ ตลาดเย็น สะพาน เดินเล่นรับลม'],
  ['phu-hin-rong-kla-phitsanulok','attraction','อุทยานแห่งชาติภูหินร่องกล้า (ฝั่งนครไทย) ลานหินแตก ผาชูธง ดอกนางพญาเสือโคร่ง การเดินทาง'],
  ['thung-salaeng-luang','attraction','อุทยานแห่งชาติทุ่งแสลงหลวง ทุ่งหญ้าสะวันนา ป่าสน กางเต็นท์รับลมหนาว ดอกไม้ป่า'],
  ['kaeng-sopha-waterfall','attraction','น้ำตกแก่งโสภา อำเภอวังทอง น้ำตกใหญ่หลายชั้น น้ำแรงหน้าฝน จุดแวะระหว่างทางขึ้นเขา'],
  ['chan-palace','attraction','พระราชวังจันทน์ โบราณสถานที่ประสูติสมเด็จพระนเรศวร ริมแม่น้ำน่านในเมือง'],
  ['sergeant-major-thawee-folk-museum','attraction','พิพิธภัณฑ์พื้นบ้านจ่าทวี เก็บเครื่องใช้พื้นบ้าน วิถีชีวิตคนเหนือตอนล่างในอดีต'],
  ['khao-samo-khaeng','attraction','เขาสมอแคลง เขาเตี้ยใกล้เมือง วัดและจุดชมวิวมองเมืองพิษณุโลก แวะไหว้พระถ่ายรูป'],
  ['nakhon-thai-mountains','attraction','อำเภอนครไทย ภูเขา ทุ่งดอกไม้ ดอกนางพญาเสือโคร่งหน้าหนาว เส้นทางต่อภูหินร่องกล้า'],
  ['phitsanulok-city-temples','attraction','วัดเด่นในเมืองพิษณุโลก (วัดนางพญา วัดราชบูรณะ) เส้นทางไหว้พระในตัวเมือง'],
  ['wat-chula-mani','attraction','วัดจุฬามณี วัดเก่าแก่ริมแม่น้ำน่าน ปรางค์ขอม ประวัติศาสตร์เมืองพิษณุโลก'],
]
const PLAN = [
  ['phitsanulok-1-day-itinerary','itinerary','แผนเที่ยวพิษณุโลก 1 วัน ไหว้พระพุทธชินราช–ริมน้ำน่าน–คาเฟ่ ใช้ block day'],
  ['phitsanulok-2d1n-itinerary','itinerary','แผนพิษณุโลก 2 วัน 1 คืน ในเมือง–วัดใหญ่–ตลาดเย็น ใช้ block day'],
  ['phitsanulok-3d2n-itinerary','itinerary','แผนพิษณุโลก 3 วัน 2 คืน เมือง–ภูหินร่องกล้า–ทุ่งแสลงหลวง ใช้ block day'],
  ['phitsanulok-cafe-riverside-plan','itinerary','แผนสายคาเฟ่และเดินเล่นริมน้ำน่าน ใช้ block day'],
  ['phitsanulok-nature-mountains-plan','itinerary','แผนสายธรรมชาติ ภูหินร่องกล้า–ทุ่งแสลงหลวง–น้ำตก ใช้ block day'],
  ['phitsanulok-culture-temples-plan','itinerary','แผนสายวัด/ประวัติศาสตร์ วัดใหญ่–พระราชวังจันทน์–พิพิธภัณฑ์ ใช้ block day'],
  ['phitsanulok-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระพุทธชินราช ริมน้ำน่าน ภูเขา) ใช้ block day'],
  ['phitsanulok-merit-temple-plan','itinerary','แผนสายไหว้พระทำบุญพิษณุโลก วัดใหญ่–วัดจุฬามณี–วัดนางพญา ใช้ block day'],
  ['phitsanulok-sukhothai-plan','itinerary','แผนข้ามจังหวัด พิษณุโลก–สุโขทัย ทริปเมืองเก่าและไหว้พระ ใช้ block day'],
  ['phitsanulok-phetchabun-plan','itinerary','แผนข้ามจังหวัด พิษณุโลก–เพชรบูรณ์ ภูหินร่องกล้าต่อเขาค้อ–ภูทับเบิก ใช้ block day'],
  ['phitsanulok-uttaradit-plan','itinerary','แผนข้ามจังหวัด พิษณุโลก–อุตรดิตถ์ ต่อเส้นทางเหนือตอนล่าง ใช้ block day'],
  ['phitsanulok-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก พิษณุโลก ไหว้พระ ริมน้ำ พิพิธภัณฑ์ ใช้ block day'],
  ['phitsanulok-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวพิษณุโลกคุ้ม ใช้ block day'],
  ['phitsanulok-first-timer-guide','itinerary','มาพิษณุโลกครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phitsanulok-travel-tips','prep','เตรียมตัวเที่ยวพิษณุโลก (ช่วงเวลาดีสุด ดอกนางพญาเสือโคร่งหน้าหนาว แต่งตัวไหว้พระ งบ ของฝากกล้วยตาก)'],
  ['phitsanulok-getting-around','prep','การเดินทางไป/ในพิษณุโลก (สนามบินพิษณุโลก รถไฟ รถทัวร์ ขับรถเอง ไปนครไทย–ภูหินร่องกล้า รถในเมือง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวพิษณุโลกลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phitsanulok", crumbCity="พิษณุโลก", crumbCityHref="city-phitsanulok.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phitsanulok.html และ top10-hotels-phitsanulok.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

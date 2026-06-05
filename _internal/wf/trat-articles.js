export const meta = {
  name: 'trat-articles',
  description: 'Trat gold template — 38 articles, fresh v2-clean Thai',
  phases: [
    { title: 'Food', detail: '12 food articles' },
    { title: 'See', detail: '12 attraction articles' },
    { title: 'Plan', detail: '12 itineraries' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['trat-food-guide','food','รวมของกินตราดต้องลอง ภาพรวมซีฟู้ด/กะปิคลองใหญ่/ผลไม้ (overview + cards)'],
  ['trat-seafood','eat-ranking','จัดอันดับร้านอาหารทะเล/ซีฟู้ดตราด (ในเมือง/บนเกาะ/ริมฝั่ง) ของสดจากเรือ'],
  ['trat-kapi-dried-seafood','food','กะปิคลองใหญ่และของทะเลแห้งตราด (น้ำปลา ปลาหมึกแห้ง กุ้งแห้ง) ของฝาก'],
  ['koh-chang-restaurants','eat-ranking','ร้านอาหาร/ซีฟู้ดเกาะช้าง ริมหาด บรรยากาศดี'],
  ['trat-cafe-guide','eat-ranking','คาเฟ่ตราด เมืองเก่าริมคลองบางพระ/บนเกาะ กาแฟวิวทะเล'],
  ['trat-town-food','food','ก๋วยเตี๋ยว/ข้าวแกง/ของกินในเมืองตราด ร้านคนพื้นที่ก่อนออกเกาะ'],
  ['trat-fruit-orchards','food','ทุเรียน เงาะ มังคุดตราด (หน้าผลไม้ เม.ย.-มิ.ย. สวนผลไม้ ซื้อที่ไหน)'],
  ['koh-kood-restaurants','eat-ranking','ร้านอาหารเกาะกูด ซีฟู้ด/ร้านรีสอร์ต บนเกาะเงียบ'],
  ['trat-beach-bbq-seafood','eat-ranking','อาหารทะเลปิ้งย่างริมหาดตราด/เกาะ กุ้งเผา ปลาหมึกย่าง มื้อเย็นริมทะเล'],
  ['trat-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างตราด ร้านมื้อเย็น คุ้มราคา'],
  ['trat-local-breakfast','food','อาหารเช้าแบบคนตราด (ตลาดเช้า ก๋วยเตี๋ยว กาแฟ ของกินเช้า)'],
  ['trat-dessert-souvenir','food','ขนมพื้นถิ่น/ตังเมกรอบ/ของฝากแปรรูปตราด ซื้อที่ไหน'],
]
const SEE = [
  ['trat-attractions','attraction','รวมที่เที่ยวตราดที่ต้องไป คละเกาะ/น้ำตก/เมืองเก่า/ชายแดน (ภาพรวม + cards)'],
  ['koh-chang-guide','attraction','เกาะช้าง ครบ (หาดทรายขาว/ไก่แบ้ น้ำตก เที่ยวรอบเกาะ การข้ามเรือ ที่พัก)'],
  ['koh-kood-guide','attraction','เกาะกูด (น้ำใส หาดเงียบ น้ำตกคลองเจ้า สะพานไม้ตะเคียนทอง การเดินทาง)'],
  ['koh-mak-guide','attraction','เกาะหมาก (เกาะเล็กปั่นจักรยาน น้ำใส หาดเงียบ การเดินทาง ที่พัก)'],
  ['klong-plu-waterfall','attraction','น้ำตกคลองพลู เกาะช้าง (เดินป่า เล่นน้ำ แอ่งน้ำใส การเดินทาง)'],
  ['trat-old-town-bang-phra','attraction','ย่านเมืองเก่าริมคลองบางพระ ตราด (บ้านไม้ ศาลเจ้า คาเฟ่ ของกิน)'],
  ['wat-buppharam-trat','attraction','วัดบุปผาราม วัดเก่าแก่ที่สุดของตราด (พิพิธภัณฑ์ สถาปัตยกรรมไม้)'],
  ['ban-hat-lek-border','attraction','ตลาดชายแดนบ้านหาดเล็ก ใต้สุดของไทย (ด่านไทย-กัมพูชา ตลาด ของกิน)'],
  ['koh-chang-naval-memorial','attraction','อนุสรณ์สถานยุทธนาวีเกาะช้าง แหลมงอบ (พิพิธภัณฑ์ ประวัติศาสตร์ริมทะเล)'],
  ['koh-chang-beaches','attraction','รวมหาดเกาะช้าง (หาดทรายขาว ไก่แบ้ คลองพร้าว หาดทรายแดง) เลือกหาด'],
  ['koh-kood-waterfalls-beaches','attraction','น้ำตกและหาดเกาะกูด (น้ำตกคลองเจ้า/ห้วยแร่ หาดคลองเจ้า อ่าวตาเขน)'],
  ['trat-snorkeling-islands','attraction','ดำน้ำตื้นเกาะรอบตราด (เกาะรัง เกาะกระดาด เกาะหมาก จุดดำน้ำน้ำใส)'],
]
const PLAN = [
  ['trat-1-day-itinerary','itinerary','แผนเที่ยวตราด 1 วัน เมืองเก่า/แหลมงอบ หรือ เกาะช้างวันเดียว ใช้ block day'],
  ['trat-2d1n-itinerary','itinerary','แผนตราด 2 วัน 1 คืน แหลมงอบ–เกาะช้าง ใช้ block day'],
  ['trat-3d2n-itinerary','itinerary','แผนตราด 3 วัน 2 คืน เกาะช้าง+น้ำตก+หาด ใช้ block day'],
  ['koh-chang-plan','itinerary','แผนเที่ยวเกาะช้าง หาด–น้ำตก–รอบเกาะ ใช้ block day'],
  ['koh-kood-koh-mak-plan','itinerary','แผนสายเกาะเงียบ เกาะกูด–เกาะหมาก นอนยาว ๆ ใช้ block day'],
  ['trat-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกและหาดเกาะช้าง ใช้ block day'],
  ['trat-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ริมคลองบางพระ ใช้ block day'],
  ['trat-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เกาะ หาด น้ำตก สะพานไม้เกาะกูด) ใช้ block day'],
  ['chanthaburi-trat-plan','itinerary','แผนข้ามจังหวัด จันทบุรี–ตราด เลาะทะเลตะวันออกสุดเขตแดน ใช้ block day'],
  ['trat-food-souvenir-plan','itinerary','แผนสายของกิน ซีฟู้ด–กะปิคลองใหญ่–ผลไม้ ใช้ block day'],
  ['trat-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดน้ำตื้น น้ำตก เกาะหมาก) ใช้ block day'],
  ['trat-first-timer-guide','itinerary','มาตราดครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['trat-travel-tips','prep','เตรียมตัวเที่ยวตราด (ช่วงเวลาดีสุด เกาะปิดหน้าฝน มิ.ย.-ก.ย. การจองเรือ งบ ซิม)'],
  ['trat-getting-around','prep','การเดินทางตราด (จากกรุงเทพ รถตู้/บัส สนามบินตราด ท่าเรือแหลมงอบ/อ่าวธรรมชาติ เรือไปเกาะ)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวตราดลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json (block: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="trat", crumbCity="ตราด", crumbCityHref="city-trat.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่เปิดอยู่จริงตอนนี้ — ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: ranking/อาหาร→"ranked" (ร้านจริง 8-12 พร้อม meta/price/tags); itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-trat.html และ top10-hotels-trat.html + พี่น้อง 1 จาก: ${siblingList})
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้ให้หมดก่อนบันทึก
- heroEmoji ใส่ให้เหมาะ

เขียน JSON ให้ valid แล้ว return สรุปสั้น ๆ`
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

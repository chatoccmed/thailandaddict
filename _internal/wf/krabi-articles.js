export const meta = {
  name: 'krabi-articles',
  description: 'Krabi gold template — food / attractions / itineraries / prep (38 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '12 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (beaches + islands + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['krabi-food-guide','food','รวมของกินกระบี่ต้องลอง ภาพรวมอาหารทะเล/ใต้/ขนมจีน (overview + cards) ลิงก์ไปบทความอาหารย่อย'],
  ['krabi-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลอันดามันกระบี่ ซีฟู้ดสด ในเมือง/ริมอ่าวนาง'],
  ['krabi-southern-food','eat-ranking','ร้านอาหารใต้รสจัดกระบี่ (แกงไตปลา คั่วกลิ้ง ผัดสะตอ แกงเหลือง)'],
  ['krabi-khanom-jeen','eat-ranking','จัดอันดับร้านขนมจีนน้ำยาปักษ์ใต้กระบี่ มื้อเช้าผักเหนาะครบ'],
  ['krabi-roti-tea','food','โรตี/ชาชักร้านมุสลิมกระบี่ ของกินเล่นเช้าถึงดึก'],
  ['krabi-cafe-guide','eat-ranking','จัดอันดับคาเฟ่กระบี่ ริมเขาหินปูน/ในเมือง/อ่าวนาง กาแฟท้องถิ่น'],
  ['krabi-aonang-dining','eat-ranking','ร้านอาหาร/บีชบาร์ริมอ่าวนาง มื้อเย็นวิวทะเล'],
  ['krabi-local-breakfast','food','อาหารเช้าแบบคนกระบี่ (ขนมจีน ข้าวยำ ติ่มซำ กาแฟโบราณ ตลาดเช้า)'],
  ['krabi-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่าง/ซีฟู้ดบุฟเฟต์กระบี่ คุ้มราคา'],
  ['krabi-khao-gaeng-tai','eat-ranking','ข้าวแกงใต้/ข้าวมันแกงไก่กระบี่ มื้อกลางวันเร็ว ๆ ร้านเด็ด'],
  ['krabi-street-food-markets','food','สตรีทฟู้ดและตลาดกระบี่ (ตลาดเช้า ถนนคนเดิน) เดินชิม'],
  ['krabi-dessert-cafe','eat-ranking','ของหวาน/ขนมพื้นบ้าน/คาเฟ่ขนมกระบี่ ร้านน่านั่ง'],
]
const SEE = [
  ['krabi-attractions','attraction','รวมที่เที่ยวกระบี่ที่ต้องไป คละหาด/เกาะ/ธรรมชาติ/วัฒนธรรม (ภาพรวม + cards)'],
  ['ao-nang-beach-guide','attraction','หาดอ่าวนาง ศูนย์กลางเที่ยวกระบี่ (หาด ที่พัก ท่าเรือ ร้านอาหาร พระอาทิตย์ตก)'],
  ['railay-beach-guide','attraction','เรลเลย์และถ้ำพระนาง (เรือหางยาว หาดทรายขาว ปีนผา ถ้ำพระนาง)'],
  ['four-islands-tour','attraction','ทัวร์สี่เกาะและทะเลแหวก (เกาะปอดะ เกาะไก่ ถ้ำพระนาง สันทรายเชื่อมเกาะ)'],
  ['krabi-phi-phi-tour','attraction','ทัวร์เกาะพีพีจากกระบี่ (อ่าวมาหยา อ่าวปิเละ ดำน้ำ ราคา ท่าเรือ)'],
  ['koh-lanta-guide','attraction','เกาะลันตา (หาดยาว เมืองเก่าลันตา วิถีชาวเล บรรยากาศเงียบ พักหลายคืน)'],
  ['wat-tham-suea-guide','attraction','วัดถ้ำเสือ (บันไดพันขั้น ไหว้พระบนยอดเขา วิวเขาหินปูน การเดินทาง)'],
  ['emerald-pool-hot-spring','attraction','สระมรกตและน้ำตกร้อนคลองท่อม (แช่น้ำธรรมชาติ เขาพนมเบญจา การเดินทาง)'],
  ['khao-khanab-nam','attraction','เขาขนาบน้ำ สัญลักษณ์เมืองกระบี่ (พายคายัค ป่าโกงกาง เรือชมเขา)'],
  ['krabi-rock-climbing','attraction','ปีนผาหินปูนเรลเลย์/ต้นไทร (คอร์สมือใหม่ จุดปีน ราคา ฤดูที่เหมาะ)'],
  ['krabi-town-guide','attraction','เมืองกระบี่ ถนนคนเดิน ตลาด และจุดเช็คอินในเมือง'],
  ['krabi-island-snorkel-tours','attraction','ทัวร์เกาะและดำน้ำตื้นกระบี่ (เกาะห้อง เกาะปอดะ จุดดำน้ำน้ำใส)'],
]
const PLAN = [
  ['krabi-1-day-itinerary','itinerary','แผนเที่ยวกระบี่ 1 วัน อ่าวนาง–เรลเลย์ หรือ สายธรรมชาติ ใช้ block day'],
  ['krabi-2d1n-itinerary','itinerary','แผนกระบี่ 2 วัน 1 คืน อ่าวนาง–เรลเลย์–ทัวร์สี่เกาะ ใช้ block day'],
  ['krabi-3d2n-itinerary','itinerary','แผนกระบี่ 3 วัน 2 คืน ทะเล+เกาะ+ธรรมชาติ ใช้ block day'],
  ['krabi-nature-plan','itinerary','แผนสายธรรมชาติ สระมรกต–น้ำตกร้อน–วัดถ้ำเสือ ใช้ block day'],
  ['krabi-island-plan','itinerary','แผนสายเกาะ เกาะพีพี–เกาะลันตา นอนค้างบนเกาะ ใช้ block day'],
  ['krabi-aonang-railay-plan','itinerary','แผนสายทะเล อ่าวนาง–เรลเลย์–สี่เกาะ ใช้ block day'],
  ['krabi-cafe-town-plan','itinerary','แผนสายคาเฟ่และเมือง ถนนคนเดิน–เขาขนาบน้ำ ใช้ block day'],
  ['krabi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เรลเลย์ ทะเลแหวก วัดถ้ำเสือ คาเฟ่) ใช้ block day'],
  ['krabi-phuket-plan','itinerary','แผนข้ามจังหวัด กระบี่–ภูเก็ต เลาะอันดามันสองเมืองทะเล ใช้ block day'],
  ['krabi-trang-plan','itinerary','แผนข้ามจังหวัด กระบี่–ตรัง ลุยเกาะและถ้ำมรกต ใช้ block day'],
  ['krabi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดน้ำตื้น เรือ สระมรกต) ใช้ block day'],
  ['krabi-first-timer-guide','itinerary','มากระบี่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['krabi-travel-tips','prep','เตรียมตัวเที่ยวกระบี่ (ช่วงเวลาดีสุด เลี่ยงมรสุม พ.ค.-ต.ค. ทะเลปิดบางเกาะ งบ ความปลอดภัยทางน้ำ ซิม)'],
  ['krabi-getting-around','prep','การเดินทางในกระบี่ (สนามบิน KBV รถสองแถว แกร็บ เช่ารถ เรือหางยาว/เรือสปีดโบ๊ทไปเกาะ จากสนามบินเข้าอ่าวนาง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวกระบี่ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="krabi", crumbCity="กระบี่", crumbCityHref="city-krabi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-krabi.html และ top10-hotels-krabi.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

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

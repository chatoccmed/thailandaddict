export const meta = {
  name: 'songkhla-articles',
  description: 'Songkhla (สงขลา/หาดใหญ่) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (old town + sea + Hat Yai)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['hatyai-dim-sum','eat-ranking','ติ่มซำหาดใหญ่ ร้านเช้า ขนมจีบ ฮะเก๋า ซาลาเปา ที่คนหาดใหญ่ต่อคิว'],
  ['songkhla-seafood','eat-ranking','อาหารทะเลสงขลา หาดสมิหลา-เกาะยอ กุ้ง หอย ปู ปลาสด ริมเล'],
  ['songkhla-southern-food','eat-ranking','อาหารใต้รสจัดสงขลา แกงไตปลา คั่วกลิ้ง แกงเหลือง ร้านที่คนพื้นที่ไป'],
  ['hatyai-fried-chicken','food','ไก่ทอดหาดใหญ่ ร้านดัง หมักเครื่องทอดกรอบ หอมเจียว ของฝาก'],
  ['songkhla-tao-kua','food','เต้าคั่วสงขลา ของกินเฉพาะถิ่น ข้าวเกรียบ เต้าหู้ทอด ราดน้ำตาลโตนด'],
  ['songkhla-old-town-cafe','eat-ranking','คาเฟ่และกาแฟโบราณเมืองเก่าสงขลา ตึกเก่า ถนนนางงาม'],
  ['songkhla-khao-stew','food','ข้าวสตูสงขลา เนื้อตุ๋นน้ำใส มื้อเช้าดั้งเดิมร้านเก่า'],
  ['hatyai-night-market-food','food','ตลาดกลางคืนและตลาดกิมหยงหาดใหญ่ สตรีทฟู้ด ของกินเล่น ของฝาก'],
  ['songkhla-local-breakfast','food','อาหารเช้าแบบคนสงขลา ติ่มซำ ข้าวสตู กาแฟโบราณ'],
  ['songkhla-souvenir-food','food','ของฝากกินได้สงขลา-หาดใหญ่ ไก่ทอด เต้าคั่ว ขนมพื้นถิ่น แหล่งซื้อ'],
  ['songkhla-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนม ในสงขลา-หาดใหญ่'],
]
const SEE = [
  ['songkhla-attractions','attraction','รวมที่เที่ยวสงขลาที่ต้องไป คละเมืองเก่า/ทะเล/หาดใหญ่ (ภาพรวม + cards)'],
  ['samila-beach','attraction','หาดสมิหลา นางเงือกทอง เกาะหนูเกาะแมว ทิวสน จุดดูพระอาทิตย์ตก'],
  ['songkhla-old-town-nang-ngam','attraction','ย่านเมืองเก่าสงขลา ถนนนครนอก นครใน นางงาม ตึกชิโน สตรีทอาร์ต คาเฟ่'],
  ['khao-tang-kuan','attraction','เขาตังกวน เจดีย์เก่า บันไดนาค จุดชมวิวเมือง-ทะเลสาบ-อ่าวไทย'],
  ['koh-yor-tinsulanon-bridge','attraction','เกาะยอ สะพานติณสูลานนท์ ปลากระพงกระชัง ผ้าทอเกาะยอ ร้านริมเล'],
  ['songkhla-lake','attraction','ทะเลสาบสงขลา ทะเลสาบน้ำกร่อยใหญ่สุดของไทย วิถีริมเล จุดชมวิว'],
  ['hatyai-city-kimyong-market','attraction','หาดใหญ่ ตลาดกิมหยง ช้อปปิ้ง ห้าง ของฝากนำเข้า เมืองการค้า'],
  ['ton-nga-chang-waterfall','attraction','น้ำตกโตนงาช้าง หลายชั้น น้ำใสเย็น เดินป่าสั้น เล่นน้ำ ใกล้หาดใหญ่'],
  ['songkhla-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติสงขลา อาคารจีนเก่า โบราณวัตถุ ประวัติเมือง'],
  ['khlong-hae-floating-market','attraction','ตลาดน้ำคลองแห หาดใหญ่ ของกินใต้ เรือขายอาหาร เปิดศุกร์-เสาร์-อาทิตย์'],
  ['hatyai-municipal-park-cable-car','attraction','สวนสาธารณะหาดใหญ่ เคเบิลคาร์ พระพุทธมงคลมหาราช เจ้าแม่กวนอิม จุดชมวิว'],
  ['wat-khao-rup-chang','attraction','วัดเขารูปช้าง เจดีย์เขาน้อย จุดชมวิวเมืองสงขลา ไหว้พระ'],
]
const PLAN = [
  ['songkhla-1-day-itinerary','itinerary','แผนเที่ยวสงขลา 1 วัน เมืองเก่า+หาดสมิหลา+เขาตังกวน หรือ หาดใหญ่วันเดียว ใช้ block day'],
  ['songkhla-2d1n-itinerary','itinerary','แผนสงขลา 2 วัน 1 คืน เมืองเก่า-หาดสมิหลา-เขาตังกวน ใช้ block day'],
  ['songkhla-3d2n-itinerary','itinerary','แผนสงขลา 3 วัน 2 คืน สงขลาเมืองเก่า+เกาะยอ+หาดใหญ่ ใช้ block day'],
  ['songkhla-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ถนนนางงาม สตรีทอาร์ต กาแฟโบราณ ใช้ block day'],
  ['hatyai-food-shopping-plan','itinerary','แผนสายกินและช้อปหาดใหญ่ ติ่มซำ ตลาดกิมหยง ตลาดกลางคืน ใช้ block day'],
  ['songkhla-sea-lake-plan','itinerary','แผนสายทะเลและทะเลสาบ หาดสมิหลา-เกาะยอ-สะพานติณ ใช้ block day'],
  ['songkhla-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (นางเงือก สตรีทอาร์ต เขาตังกวน เคเบิลคาร์หาดใหญ่) ใช้ block day'],
  ['songkhla-culture-temple-plan','itinerary','แผนสายวัฒนธรรม เขาตังกวน-พิพิธภัณฑ์-วัดเขารูปช้าง ใช้ block day'],
  ['songkhla-phatthalung-plan','itinerary','แผนข้ามจังหวัด สงขลา–พัทลุง เลาะทะเลสาบสงขลาเที่ยวสองเมือง ใช้ block day'],
  ['songkhla-satun-plan','itinerary','แผนข้ามจังหวัด หาดใหญ่–สตูล ลงใต้สุดต่อทะเลอันดามันหลีเป๊ะ ใช้ block day'],
  ['songkhla-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดสมิหลา เคเบิลคาร์หาดใหญ่ เกาะยอ น้ำตกโตนงาช้าง) ใช้ block day'],
  ['songkhla-first-timer-guide','itinerary','มาสงขลา/หาดใหญ่ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['songkhla-travel-tips','prep','เตรียมตัวเที่ยวสงขลา-หาดใหญ่ (ช่วงเวลาดีสุด หน้าฝน งบ การแต่งตัว ข้อควรรู้เมืองพหุวัฒนธรรม ของที่ควรเตรียม)'],
  ['songkhla-getting-around','prep','การเดินทางในสงขลา-หาดใหญ่ (สนามบินหาดใหญ่ รถไฟ รถตู้ สงขลา-หาดใหญ่ 30 กม. เช่ารถ ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสงขลา (สงขลา/หาดใหญ่) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="songkhla", crumbCity="สงขลา", crumbCityHref="city-songkhla.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-songkhla.html และ top10-hotels-songkhla.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

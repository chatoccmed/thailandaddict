export const meta = {
  name: 'trang-articles',
  description: 'Trang (ตรัง) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (islands + city + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['trang-moo-yang','eat-ranking','หมูย่างเมืองตรัง ร้านเช้า หนังกรอบ ที่คนตรังกินจริง พร้อมย่าน/ราคา'],
  ['trang-dim-sum-tea-house','eat-ranking','ติ่มซำและร้านน้ำชาตรัง เปิดเช้ามืด ซาลาเปา ฮะเก๋า กาแฟโบราณ'],
  ['trang-seafood','eat-ranking','ร้านอาหารทะเลอันดามันตรัง กันตัง-สิเกา กุ้ง หอย ปู ปลาสด'],
  ['trang-southern-food','eat-ranking','อาหารใต้รสจัดตรัง แกงไตปลา คั่วกลิ้ง ผัดสะตอ ร้านที่คนพื้นที่ไป'],
  ['trang-khanom-jeen','eat-ranking','ขนมจีนน้ำยาปักษ์ใต้ตรัง ผักเหนาะสารพัด ร้านเด็ด'],
  ['trang-cafe-guide','eat-ranking','คาเฟ่ตรัง ตึกเก่าเมืองเก่า กาแฟโบราณและคาเฟ่รุ่นใหม่ บรรยากาศถ่ายรูป'],
  ['trang-cake','food','เค้กเมืองตรัง ของฝากเค้กรูเนื้อนุ่มกลิ่นเนย ร้านดังในเมือง'],
  ['trang-street-food','food','สตรีทฟู้ดและตลาดเช้าตรัง ของกินเดินชิมย่านเมือง'],
  ['trang-local-breakfast','food','อาหารเช้าแบบคนตรัง หมูย่าง ติ่มซำ กาแฟโบราณ ตลาดเช้า'],
  ['trang-souvenir-food','food','ของฝากกินได้ตรัง เค้กเมืองตรัง หมูย่าง ขนมพื้นถิ่น แหล่งซื้อ'],
  ['trang-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนม ในเมืองตรัง'],
]
const SEE = [
  ['trang-attractions','attraction','รวมที่เที่ยวตรังที่ต้องไป คละเกาะ/ทะเล/เมือง/ธรรมชาติ (ภาพรวม + cards)'],
  ['emerald-cave-koh-mook','attraction','ถ้ำมรกต เกาะมุก ว่ายลอดถ้ำมืดเข้าหาดลับ น้ำเขียวมรกต การไป ทัวร์ ช่วงเวลา'],
  ['koh-kradan','attraction','เกาะกระดาน หาดทรายขาว น้ำใส ดำน้ำตื้น นอนค้าง การเดินทาง'],
  ['koh-cheuk','attraction','เกาะเชือก จุดดำน้ำตื้นดูปะการังอ่อนหลากสี ทัวร์เกาะ'],
  ['koh-libong-dugong','attraction','เกาะลิบง ส่องพะยูน หญ้าทะเล วิถีชาวประมง เที่ยวเกาะแบบธรรมชาติ'],
  ['le-khao-kop-cave','attraction','ถ้ำเลเขากอบ ล่องเรือลอดถ้ำหินงอกหินย้อย นอนราบลอดช่องแคบ'],
  ['trang-old-town-kantang','attraction','เมืองเก่าตรัง ตึกชิโน-โปรตุกีส สถานีรถไฟกันตัง ปลายทางรถไฟสายใต้'],
  ['pak-meng-chang-lang-beach','attraction','หาดปากเมง-ฉางหลาง หาดยาวเลียบทะเล จุดออกเรือ ดูพระอาทิตย์ตก'],
  ['banthat-mountains-waterfalls','attraction','น้ำตกเทือกเขาบรรทัดตรัง เล่นน้ำ เดินป่าสั้น คลายร้อน'],
  ['koh-sukorn','attraction','เกาะสุกร แตงโม หาดเงียบ ปั่นจักรยานรอบเกาะ วิถีชาวบ้าน'],
  ['chao-mai-national-park','attraction','อุทยานแห่งชาติหาดเจ้าไหม หาดยงหลิง ถ้ำ เขา ทะเล ครบในที่เดียว'],
  ['trang-island-hopping','attraction','ทัวร์เกาะตรัง 4 เกาะ เกาะมุก-กระดาน-เชือก-ม้า โปรแกรม ราคา ท่าเรือ'],
]
const PLAN = [
  ['trang-1-day-itinerary','itinerary','แผนเที่ยวตรัง 1 วัน เมืองเก่า+หมูย่าง+ถ้ำเลเขากอบ หรือ ทัวร์เกาะวันเดียว ใช้ block day'],
  ['trang-2d1n-itinerary','itinerary','แผนตรัง 2 วัน 1 คืน เมืองเก่า-หมูย่าง-ทัวร์ถ้ำมรกต ใช้ block day'],
  ['trang-3d2n-itinerary','itinerary','แผนตรัง 3 วัน 2 คืน เมือง+ทัวร์เกาะ+นอนค้างเกาะ ใช้ block day'],
  ['trang-island-hopping-plan','itinerary','แผนสายเกาะ เกาะมุก-กระดาน-เชือก นอนค้างเกาะ ใช้ block day'],
  ['trang-food-plan','itinerary','แผนสายกิน หมูย่างเช้า-ติ่มซำร้านน้ำชา-เค้กเมืองตรัง ใช้ block day'],
  ['trang-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกเทือกเขาบรรทัด-หาดปากเมง-เกาะลิบงส่องพะยูน ใช้ block day'],
  ['trang-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ถนนกันตัง ตึกเก่า คาเฟ่ ใช้ block day'],
  ['trang-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ถ้ำมรกต เกาะกระดาน เมืองเก่า สถานีรถไฟกันตัง) ใช้ block day'],
  ['trang-krabi-plan','itinerary','แผนข้ามจังหวัด ตรัง–กระบี่ เลาะอันดามันเที่ยวถ้ำและเกาะ ใช้ block day'],
  ['trang-nakhon-si-thammarat-plan','itinerary','แผนข้ามจังหวัด ตรัง–นครศรีธรรมราช ข้ามเขาเที่ยวทะเลกับเมืองวัด ใช้ block day'],
  ['trang-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ทัวร์เกาะน้ำตื้น หาดปากเมง ถ้ำเลเขากอบ) ใช้ block day'],
  ['trang-first-timer-guide','itinerary','มาตรังครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['trang-travel-tips','prep','เตรียมตัวเที่ยวตรัง (ช่วงเวลาดีสุด หน้ามรสุมเรือออกเกาะ งบ จองทัวร์เกาะ ของที่ควรเตรียม)'],
  ['trang-getting-around','prep','การเดินทางในตรัง (เครื่องบิน/รถไฟสายใต้/บขส. เช่ารถ ท่าเรือออกเกาะ ระยะทางจากกระบี่-หาดใหญ่)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวตรัง ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="trang", crumbCity="ตรัง", crumbCityHref="city-trang.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-trang.html และ top10-hotels-trang.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

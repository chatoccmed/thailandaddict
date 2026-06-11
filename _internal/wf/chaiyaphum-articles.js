export const meta = {
  name: 'chaiyaphum-articles',
  description: 'Chaiyaphum (ชัยภูมิ) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (krachiao fields + mo hin khao + waterfalls + silk)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['chaiyaphum-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานชัยภูมิ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['chaiyaphum-cafe-guide','eat-ranking','คาเฟ่ชัยภูมิ ในเมือง นั่งชิล กาแฟดี ถ่ายรูป แวะก่อนขึ้นภู/เที่ยวน้ำตก'],
  ['chaiyaphum-mookata','eat-ranking','หมูกระทะและปิ้งย่างชัยภูมิ ร้านยอดนิยม คุ้มราคา มื้อเย็นนัดกันเป็นกลุ่ม'],
  ['chaiyaphum-noodles','eat-ranking','หมี่ผัด/หมี่โคราชและก๋วยเตี๋ยวชัยภูมิ ร้านเด็ด ราคาท้องถิ่น หากินง่ายในเมือง'],
  ['chaiyaphum-riverside-fish','eat-ranking','ร้านปลาเผา/อาหารริมน้ำชัยภูมิ แถวเขื่อนและอ่างเก็บน้ำ ปลานึ่ง ต้มยำปลา นั่งรับลม'],
  ['chaiyaphum-street-food','food','สตรีทฟู้ดและตลาดเย็นชัยภูมิ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['chaiyaphum-local-breakfast','food','อาหารเช้าแบบคนชัยภูมิ (ข้าวต้ม โจ๊ก กาแฟโบราณ ของกินตลาดเช้า)'],
  ['chaiyaphum-khao-mao','food','ข้าวเม่าและขนมพื้นถิ่นชัยภูมิ ข้าวเม่าคลุกมะพร้าว ของกินเล่นและของฝากแบบบ้าน ๆ'],
  ['chaiyaphum-forest-veggies','food','ของป่าและผักพื้นบ้านชัยภูมิ หน้าฝนมีเห็ด หน่อไม้ ผักพื้นบ้าน ตามอำเภอติดภู เอาไปแกง/จิ้มน้ำพริก'],
  ['chaiyaphum-souvenir-food','food','ของฝากกินได้ชัยภูมิ (ข้าวเม่า ของป่าแปรรูป ขนมพื้นถิ่น หม่ำ แหนม แหล่งซื้อ)'],
  ['chaiyaphum-local-dessert','food','ของหวานและขนมพื้นถิ่นชัยภูมิ ขนมอีสาน ของกินเล่นตามตลาด ราคาไม่แพง'],
]
const SEE = [
  ['chaiyaphum-attractions','attraction','รวมที่เที่ยวชัยภูมิที่ต้องไป คละทุ่งดอกกระเจียว/มอหินขาว/น้ำตกตาดโตน/ไทรทอง/ผ้าไหมบ้านเขว้า (ภาพรวม + cards)'],
  ['pa-hin-ngam-national-park','attraction','อุทยานแห่งชาติป่าหินงาม เทพสถิต ลานหินงามรูปทรงแปลกตา จุดชมวิวสุดแผ่นดิน และทุ่งดอกกระเจียว การเดินทาง'],
  ['krachiao-flower-fields','attraction','ทุ่งดอกกระเจียวชัยภูมิ บานหน้าฝน มิ.ย.-ส.ค. ป่าหินงาม-ไทรทอง ช่วงเวลาที่บานสวย จุดถ่ายรูป ค่าเข้า'],
  ['mo-hin-khao','attraction','มอหินขาว อุทยานภูแลนคา กลุ่มเสาหินทรายตั้งเรียงกลางทุ่ง สโตนเฮนจ์เมืองไทย เดินชมและถ่ายรูปได้รอบ'],
  ['tat-ton-national-park','attraction','อุทยานแห่งชาติตาดโตน น้ำตกตาดโตนลานหินกว้างใกล้เมือง หน้าฝนน้ำเยอะ จุดเล่นน้ำและปิกนิกยอดนิยม'],
  ['sai-thong-national-park','attraction','อุทยานแห่งชาติไทรทอง ผาแดง ผาเอียง ผาหำหด จุดชมวิวทิวเขากว้างไกล และทุ่งดอกกระเจียวหน้าฝน'],
  ['chao-pho-phaya-lae-monument','attraction','อนุสาวรีย์เจ้าพ่อพญาแล ผู้ก่อตั้งเมืองชัยภูมิ ศูนย์รวมใจคนเมือง งานบวงสรวงประจำปี'],
  ['ban-khwao-silk','attraction','บ้านเขว้า แหล่งทอผ้าไหมเก่าแก่ของชัยภูมิ ผ้าไหมมัดหมี่ลายพื้นเมือง เดินชมการทอ เลือกซื้อถึงหมู่บ้าน'],
  ['prang-ku-chaiyaphum','attraction','ปรางค์กู่ชัยภูมิ โบราณสถานขอมใกล้เมือง เคยเป็นอโรคยาศาลสมัยพระเจ้าชัยวรมันที่ 7 ร่องรอยศิลาแลง'],
  ['chulabhorn-dam','attraction','เขื่อนจุฬาภรณ์ คอนสาร เขื่อนบนภูเขา อากาศเย็นสบาย จุดชมวิวอ่างเก็บน้ำและที่พักท่ามกลางทิวเขา'],
  ['chaiyaphum-waterfalls','attraction','น้ำตกรอบชัยภูมิ ตาดโตน ตาดฟ้า เทพประทาน น้ำตกในอุทยานต่าง ๆ หน้าฝนน้ำเยอะ จุดเล่นน้ำ'],
  ['chaiyaphum-viewpoints','attraction','จุดชมวิวและหน้าผาชัยภูมิ สุดแผ่นดินป่าหินงาม ผาแดง ผาเอียง ถ่ายรูปวิวทิวเขา'],
]
const PLAN = [
  ['chaiyaphum-1-day-itinerary','itinerary','แผนเที่ยวชัยภูมิ 1 วัน เมือง-น้ำตกตาดโตน หรือ มอหินขาววันเดียว ใช้ block day'],
  ['chaiyaphum-2d1n-itinerary','itinerary','แผนชัยภูมิ 2 วัน 1 คืน เที่ยวเมือง-น้ำตกตาดโตน-มอหินขาว ใช้ block day'],
  ['chaiyaphum-3d2n-itinerary','itinerary','แผนชัยภูมิ 3 วัน 2 คืน เมือง+ป่าหินงาม+ไทรทอง+ผ้าไหม ใช้ block day'],
  ['chaiyaphum-krachiao-season-plan','itinerary','แผนทริปดอกกระเจียวบานหน้าฝน มิ.ย.-ส.ค. ป่าหินงาม-ไทรทอง-มอหินขาว ใช้ block day'],
  ['chaiyaphum-nature-plan','itinerary','แผนสายธรรมชาติ ป่าหินงาม-ไทรทอง-มอหินขาว-น้ำตก ใช้ block day'],
  ['chaiyaphum-culture-plan','itinerary','แผนสายวัฒนธรรม ผ้าไหมบ้านเขว้า-ปรางค์กู่-อนุสาวรีย์เจ้าพ่อพญาแล ใช้ block day'],
  ['chaiyaphum-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (มอหินขาว สุดแผ่นดิน ทุ่งกระเจียว ผาแดง) ใช้ block day'],
  ['chaiyaphum-nakhon-ratchasima-plan','itinerary','แผนข้ามจังหวัด ชัยภูมิ–นครราชสีมา ทริปธรรมชาติและของกินอีสาน ใช้ block day'],
  ['chaiyaphum-phetchabun-plan','itinerary','แผนข้ามจังหวัด ชัยภูมิ–เพชรบูรณ์ เส้นทางภูเขาและน้ำตก ใช้ block day'],
  ['chaiyaphum-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (น้ำตกตาดโตน มอหินขาว คาเฟ่ อนุสาวรีย์) ใช้ block day'],
  ['chaiyaphum-waterfall-cool-plan','itinerary','แผนสายน้ำตก-อากาศเย็น ตาดโตน-เขื่อนจุฬาภรณ์-คอนสาร หน้าฝน/หน้าหนาว ใช้ block day'],
  ['chaiyaphum-first-timer-guide','itinerary','มาชัยภูมิครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chaiyaphum-travel-tips','prep','เตรียมตัวเที่ยวชัยภูมิ (ช่วงเวลาดีสุด หน้าดอกกระเจียวมิ.ย.-ส.ค. หน้าหนาวชมวิวพ.ย.-ม.ค. อากาศ งบ การแต่งตัวขึ้นภู ของที่ควรเตรียม)'],
  ['chaiyaphum-getting-around','prep','การเดินทางในชัยภูมิ (บขส.จากกรุงเทพ-โคราช เช่ารถ ไปป่าหินงาม-เทพสถิต-มอหินขาวยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวชัยภูมิ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chaiyaphum", crumbCity="ชัยภูมิ", crumbCityHref="city-chaiyaphum.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง · ทุ่งดอกกระเจียวบอกตรงว่าบานเฉพาะหน้าฝน มิ.ย.-ส.ค. เท่านั้น เช็กช่วงบานก่อนไป
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-chaiyaphum.html และ top10-hotels-chaiyaphum.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

const existing = new Set(args && args.existingArticles ? args.existingArticles : [])

let done = []
for (const group of [['Food',FOOD],['See',SEE],['Plan',PLAN],['Prep',PREP]]) {
  const [ph, fullList] = group
  const list = fullList.filter(([slug]) => !existing.has(slug))
  const ref = ph==='Food' ? 'tourlogy-food-writer' : 'tourlogy-attraction-writer'
  if (!list.length) { log(`Phase ${ph}: all ${fullList.length} already exist — skip`); continue }
  log(`Phase ${ph}: ${list.length} articles (skipped ${fullList.length-list.length} existing)`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,ref), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Articles written: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

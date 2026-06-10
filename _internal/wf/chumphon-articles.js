export const meta = {
  name: 'chumphon-articles',
  description: 'Chumphon (ชุมพร) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (sea + islands + city + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['chumphon-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลชุมพรที่สดและคนพื้นที่ไปจริง (ร้านริมหาดทรายรี/ปากน้ำ พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['chumphon-southern-food','eat-ranking','ร้านอาหารใต้ชุมพร แกงไตปลา แกงเหลือง คั่วกลิ้ง ผัดเผ็ด ร้านที่คนท้องถิ่นไป'],
  ['chumphon-khanom-jeen','eat-ranking','จัดอันดับร้านขนมจีนน้ำยาปักษ์ใต้ชุมพร น้ำยา/น้ำพริก/แกง ผักเหนาะ ร้านเด็ด'],
  ['chumphon-robusta-coffee','eat-ranking','คาเฟ่และไร่กาแฟโรบัสต้าชุมพร ที่คั่วเมล็ดถิ่น ชิมโรบัสต้าแท้'],
  ['chumphon-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ในเมืองชุมพร บรรยากาศนั่งชิล ถ่ายรูป กาแฟดี'],
  ['chumphon-local-breakfast','food','อาหารเช้าแบบคนชุมพร (ขนมจีน ติ่มซำ กาแฟโบราณ ตลาดเช้า)'],
  ['chumphon-street-food','food','สตรีทฟู้ดและตลาดชุมพร (ตลาดเย็น ของกินเดินชิม ของทะเลย่าง)'],
  ['chumphon-pla-tu','food','ปลาทูชุมพร แหล่งปลาทูสด เมนูปลาทูทอด/นึ่ง/ต้มส้ม และที่ซื้อกลับ'],
  ['chumphon-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองชุมพร'],
  ['chumphon-souvenir-food','food','ของฝากกินได้ชุมพร (กล้วยเล็บมือนางตากแห้ง ปลาหมึกแห้ง กะปิ น้ำพริก แหล่งซื้อ)'],
  ['chumphon-fruit-durian','food','ทุเรียน มังคุด และผลไม้ชุมพรตามฤดู แผงผลไม้ริมทาง สวนผลไม้'],
]
const SEE = [
  ['chumphon-attractions','attraction','รวมที่เที่ยวชุมพรที่ต้องไป คละทะเล/เกาะ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['sai-ree-beach','attraction','หาดทรายรี หาดหลักของชุมพร เดินเล่นริมทะเล ร้านอาหารริมหาด ศาลกรมหลวงปลายหาด'],
  ['kromluang-chumphon-shrine','attraction','ศาลกรมหลวงชุมพร (เสด็จเตี่ย) + เรือรบหลวงชุมพรจำลอง ริมหาดทรายรี ไหว้ขอพร'],
  ['chumphon-islands-diving','attraction','หมู่เกาะชุมพร (เกาะง่าม เกาะลังกาจิว เกาะมัตตรา) ลงเรือดำน้ำดูปะการัง ตกปลา'],
  ['mu-ko-chumphon-national-park','attraction','อุทยานแห่งชาติหมู่เกาะชุมพร ทะเลใส จุดดำน้ำตื้นดำน้ำลึก การเดินทาง ค่าเข้า'],
  ['pak-nam-chumphon','attraction','ปากน้ำชุมพร ย่านท่าเรือไปเกาะเต่า ตลาดและร้านอาหารทะเลริมน้ำ ชุมชนประมง'],
  ['thung-wua-laen-beach','attraction','หาดทุ่งวัวแล่น หาดทรายขาวยาว น้ำใส กิจกรรมทางน้ำ ร้านริมหาด'],
  ['arunothai-beach','attraction','หาดอรุโณทัยและหาดเงียบทางตอนเหนือ ปะทิว น้ำใส คนไม่เยอะ'],
  ['pathio-tree-tunnel','attraction','อุโมงค์ต้นไม้ปะทิว ถนนเลียบทะเลที่ต้นไม้โค้งเป็นอุโมงค์ จุดถ่ายรูป'],
  ['khao-dinso-viewpoint','attraction','เขาดินสอ จุดชมวิวริมทะเลปะทิว มองอ่าวและหาดยาว แวะถ่ายรูป'],
  ['wat-khao-chedi','attraction','วัดเขาเจดีย์ เดินขึ้นไหว้พระ จุดชมวิวเมืองกับทะเลกว้าง'],
  ['chumphon-robusta-farm','attraction','ไร่กาแฟโรบัสต้าชุมพร เที่ยวชมไร่ ดูการคั่ว ชิมกาแฟถิ่น'],
]
const PLAN = [
  ['chumphon-1-day-itinerary','itinerary','แผนเที่ยวชุมพร 1 วัน หาดทรายรี–ศาลเสด็จเตี่ย–อาหารทะเล ใช้ block day'],
  ['chumphon-2d1n-itinerary','itinerary','แผนชุมพร 2 วัน 1 คืน เมือง+หาด+หมู่เกาะ ใช้ block day'],
  ['chumphon-3d2n-itinerary','itinerary','แผนชุมพร 3 วัน 2 คืน หาด+ดำน้ำหมู่เกาะ+คาเฟ่กาแฟ ใช้ block day'],
  ['chumphon-beach-island-plan','itinerary','แผนสายทะเล ดำน้ำหมู่เกาะชุมพร+หาดทุ่งวัวแล่น ใช้ block day'],
  ['chumphon-cafe-coffee-plan','itinerary','แผนสายคาเฟ่ ไร่กาแฟโรบัสต้า–คาเฟ่ในเมือง ใช้ block day'],
  ['chumphon-koh-tao-gateway-plan','itinerary','แผนทางผ่านลงเกาะเต่า–เกาะพะงัน นอนชุมพรหนึ่งคืนก่อนลงเรือ ใช้ block day'],
  ['chumphon-ranong-plan','itinerary','แผนข้ามจังหวัด ชุมพร–ระนอง บ่อน้ำร้อนและทะเลฝั่งอันดามัน ใช้ block day'],
  ['chumphon-prachuap-coastal-plan','itinerary','แผนข้ามจังหวัด ชุมพร–ประจวบคีรีขันธ์ ขับรถเลียบทะเลปะทิว–บางสะพาน ใช้ block day'],
  ['chumphon-surat-plan','itinerary','แผนข้ามจังหวัด ชุมพร–สุราษฎร์ธานี ต่อเกาะสมุย/เขื่อนเชี่ยวหลาน ใช้ block day'],
  ['chumphon-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (อุโมงค์ต้นไม้ หาด เรือรบหลวง เขาดินสอ) ใช้ block day'],
  ['chumphon-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดทุ่งวัวแล่น เกาะ คาเฟ่) ใช้ block day'],
  ['chumphon-first-timer-guide','itinerary','มาชุมพรครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chumphon-travel-tips','prep','เตรียมตัวเที่ยวชุมพร (ช่วงเวลาดีสุด ทะเลเรียบ อากาศ งบ การลงเรือดำน้ำ การแต่งตัว ของที่ควรเตรียม)'],
  ['chumphon-getting-around','prep','การเดินทางในชุมพร (รถไฟ/บขส./สนามบินชุมพร เช่ารถ ท่าเรือไปเกาะเต่า–พะงัน–สมุย ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวชุมพร ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chumphon", crumbCity="ชุมพร", crumbCityHref="city-chumphon.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-chumphon.html และ top10-hotels-chumphon.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

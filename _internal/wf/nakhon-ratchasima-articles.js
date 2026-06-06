export const meta = {
  name: 'nakhon-ratchasima-articles',
  description: 'Nakhon Ratchasima (โคราช) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + city + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['top-pad-mee-korat','eat-ranking','จัดอันดับร้านผัดหมี่โคราชที่อร่อยและคนพื้นที่ไปจริง (ranked ร้านจริง พร้อมย่าน/ราคา/จุดเด่น)'],
  ['korat-isan-food','eat-ranking','ร้านอาหารอีสานโคราช ส้มตำ ลาบ น้ำตก ไก่ย่าง ร้านที่คนท้องถิ่นไป'],
  ['khao-yai-cafe-guide','eat-ranking','จัดอันดับคาเฟ่เขาใหญ่-ปากช่อง วิวภูเขา/ไร่องุ่น บรรยากาศถ่ายรูป'],
  ['khao-yai-winery-guide','eat-ranking','ไร่ไวน์/โรงบ่มไวน์เขาใหญ่-ปากช่อง ชิมไวน์ ร้านอาหารวิวไร่'],
  ['korat-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างโคราช ร้านยอดนิยม คุ้มราคา'],
  ['korat-street-food','food','สตรีทฟู้ดและตลาดโคราช (ตลาดเซฟวัน ย่าโม ประตูชุมพล) ของกินเดินชิม'],
  ['korat-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองโคราช'],
  ['korat-local-breakfast','food','อาหารเช้าแบบคนโคราช (ผัดหมี่ ข้าวต้ม กาแฟโบราณ ตลาดเช้า)'],
  ['korat-noodle-shops','eat-ranking','ร้านก๋วยเตี๋ยว/หมี่ตะคุเด็ด ๆ ในโคราช'],
  ['korat-souvenir-food','food','ของฝากกินได้โคราช (หมี่ตะคุ หมูยอ กุนเชียง แหล่งซื้อ)'],
  ['khao-yai-restaurant-view','eat-ranking','ร้านอาหารวิวเขาใหญ่-ปากช่อง บรรยากาศดี เหมาะมื้อพิเศษ'],
]
const SEE = [
  ['korat-attractions','attraction','รวมที่เที่ยวโคราชที่ต้องไป คละธรรมชาติ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['khao-yai-national-park-guide','attraction','อุทยานแห่งชาติเขาใหญ่ ครบ (น้ำตกเหวสุวัต จุดชมวิว ส่องสัตว์ การเดินทาง ค่าเข้า)'],
  ['phimai-historical-park','attraction','ปราสาทหินพิมาย (ประวัติ ลวดลาย เวลา ค่าเข้า จุดถ่ายรูป) + พิพิธภัณฑ์พิมาย'],
  ['thao-suranari-monument','attraction','อนุสาวรีย์ย่าโม + ประตูชุมพล กลางเมืองโคราช ของกินรอบลาน'],
  ['pak-chong-khao-yai-farms','attraction','ฟาร์ม/ไร่ปากช่อง-เขาใหญ่ (ฟาร์มโชคชัย ฟาร์มแกะ ไร่องุ่น) เที่ยวถ่ายรูป'],
  ['khao-yai-waterfalls','attraction','น้ำตกเขาใหญ่ (เหวสุวัต เหวนรก ผากล้วยไม้) เดินป่าเล่นน้ำ'],
  ['petrified-wood-museum','attraction','พิพิธภัณฑ์ไม้กลายเป็นหินโคราช ฟอสซิลล้านปี ช้างโบราณ'],
  ['wat-ban-rai-korat','attraction','วัดบ้านไร่ (หลวงพ่อคูณ) วิหารเทพวิทยาคม ด่านขุนทด'],
  ['lam-takhong-dam','attraction','เขื่อนลำตะคอง กังหันลม จุดชมวิว บรรยากาศรับลม'],
  ['khao-yai-viewpoints-camping','attraction','จุดชมวิว/ทะเลหมอก/ลานกางเต็นท์เขาใหญ่'],
  ['korat-old-town-walk','attraction','เดินเมืองเก่าโคราช (กำแพงเมือง วัด ย่าน ของกิน)'],
  ['pak-thong-chai-silk','attraction','ปักธงชัย แหล่งผ้าไหม หมู่บ้านทอผ้า งานหัตถกรรม'],
]
const PLAN = [
  ['korat-1-day-itinerary','itinerary','แผนเที่ยวโคราช 1 วัน เมือง+ย่าโม+พิมาย หรือ เขาใหญ่วันเดียว ใช้ block day'],
  ['korat-2d1n-itinerary','itinerary','แผนโคราช 2 วัน 1 คืน เมือง-พิมาย ใช้ block day'],
  ['korat-3d2n-itinerary','itinerary','แผนโคราช 3 วัน 2 คืน เมือง+เขาใหญ่+พิมาย ใช้ block day'],
  ['khao-yai-2d1n-plan','itinerary','แผนเขาใหญ่ 2 วัน 1 คืน อุทยาน+คาเฟ่+ไร่ไวน์ ใช้ block day'],
  ['khao-yai-cafe-winery-plan','itinerary','แผนสายคาเฟ่และไร่ไวน์ปากช่อง-เขาใหญ่ ใช้ block day'],
  ['khao-yai-nature-plan','itinerary','แผนสายธรรมชาติ เขาใหญ่ น้ำตก ส่องสัตว์ ใช้ block day'],
  ['korat-culture-plan','itinerary','แผนสายวัฒนธรรม ปราสาทหินพิมาย-ผ้าไหมปักธงชัย ใช้ block day'],
  ['korat-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ไร่องุ่น ฟาร์มแกะ ปราสาทหิน คาเฟ่เขา) ใช้ block day'],
  ['korat-buriram-temple-plan','itinerary','แผนข้ามจังหวัด โคราช–บุรีรัมย์ ทริปปราสาทขอมอีสานใต้ ใช้ block day'],
  ['korat-khao-yai-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (ฟาร์มโชคชัย เขาใหญ่ คาเฟ่) ใช้ block day'],
  ['bangkok-khao-yai-weekend','itinerary','แผนข้ามจังหวัด กรุงเทพ–เขาใหญ่ เสาร์อาทิตย์ ขับรถไปกลับ ใช้ block day'],
  ['korat-first-timer-guide','itinerary','มาโคราชครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['korat-travel-tips','prep','เตรียมตัวเที่ยวโคราช-เขาใหญ่ (ช่วงเวลาดีสุด อากาศ งบ จองอุทยาน การแต่งตัว ของที่ควรเตรียม)'],
  ['korat-getting-around','prep','การเดินทางในโคราช-เขาใหญ่ (รถไฟ/บขส. เช่ารถ ขึ้นเขาใหญ่ยังไง ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวนครราชสีมา (โคราช) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nakhon-ratchasima", crumbCity="นครราชสีมา", crumbCityHref="city-nakhon-ratchasima.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nakhon-ratchasima.html และ top10-hotels-nakhon-ratchasima.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

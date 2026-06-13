export const meta = {
  name: 'koh-chang-articles',
  description: 'Koh Chang (เกาะช้าง) destination — food / attractions / itineraries / prep (26 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '7 food articles (seafood, beach bars, bang bao, cafe)' },
    { title: 'See', detail: '10 attraction articles (beaches, waterfalls, snorkeling, viewpoints)' },
    { title: 'Plan', detail: '7 itineraries (2D1N, 3D2N, island hopping, family)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['koh-chang-food-guide','food','รวมของกินเกาะช้างที่ต้องลอง อาหารทะเลบางเบ้า บาร์ริมหาด คาเฟ่ (ภาพรวม + ย่าน/ราคา)'],
  ['koh-chang-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลเกาะช้าง บางเบ้า-หาดทรายขาว กุ้ง หอย ปู ปลาสดริมทะเล ที่คนไปจริง (ย่าน/ราคา/เมนูเด็ด)'],
  ['koh-chang-beach-bars','eat-ranking','บาร์และร้านริมหาดเกาะช้าง หาดทรายขาว-ไก่แบ้-โลนลีบีช นั่งกินดื่มชมพระอาทิตย์ตก (เที่ยวอย่างมีสติ)'],
  ['koh-chang-cafe-guide','eat-ranking','คาเฟ่เกาะช้าง ริมทะเล-กลางสวน กาแฟดี วิวทะเล นั่งชิลถ่ายรูป'],
  ['koh-chang-bang-bao-food','food','ร้านอาหารทะเลหมู่บ้านประมงบางเบ้า บ้านยื่นลงทะเล อาหารทะเลสด บรรยากาศริมทะเลตอนเย็น'],
  ['koh-chang-night-market','food','ตลาดเย็นและสตรีทฟู้ดเกาะช้าง หาดทรายขาว ของย่าง ของกินเล่น ผลไม้ตามฤดู ราคาเป็นกันเอง'],
  ['koh-chang-local-thai-food','eat-ranking','ร้านอาหารไทยถิ่นเกาะช้าง ตามสั่ง ก๋วยเตี๋ยว ข้าวแกง รสจัด ราคาคนท้องถิ่น'],
]
const SEE = [
  ['koh-chang-attractions','attraction','รวมที่เที่ยวเกาะช้างที่ต้องไป หาด-น้ำตก-บางเบ้า-ดำน้ำเกาะรอบ ๆ (ภาพรวม + cards)'],
  ['koh-chang-white-sand-beach','attraction','หาดทรายขาวเกาะช้าง หาดหลักคึกคักสุด ทรายขาวน้ำใส ที่พัก-ร้าน-บาร์ริมหาด กิจกรรมทางน้ำ'],
  ['koh-chang-klong-prao-beach','attraction','หาดคลองพร้าวเกาะช้าง หาดยาวเงียบเป็นครอบครัว รีสอร์ตติดทะเล จุดชมพระอาทิตย์ตก'],
  ['koh-chang-kai-bae-beach','attraction','หาดไก่แบ้เกาะช้าง พระอาทิตย์ตกสวย เกาะเล็กหน้าหาดเดินไปได้ตอนน้ำลด จุดชมวิวไก่แบ้ใกล้กัน'],
  ['koh-chang-lonely-beach','attraction','หาดทรายยาว (โลนลีบีช) เกาะช้าง หาดสายแบ็คแพ็คเกอร์ บรรยากาศชิล กลางคืนคึกคักสบาย ๆ'],
  ['koh-chang-bang-bao-village','attraction','หมู่บ้านประมงบางเบ้าเกาะช้าง บ้านยื่นลงทะเล ย่านร้านอาหารทะเล คาเฟ่ จุดลงเรือดำน้ำ บรรยากาศริมทะเล'],
  ['koh-chang-klong-plu-waterfall','attraction','น้ำตกคลองพลูเกาะช้าง น้ำตกใหญ่ที่สุดของเกาะ แอ่งน้ำเล่นได้ ทางเดินป่าสั้น น้ำใสเย็น'],
  ['koh-chang-than-mayom-waterfall','attraction','น้ำตกธารมะยมเกาะช้าง น้ำตกหลายชั้นฝั่งตะวันออก เส้นทางเดินป่าและศาลาชมวิว เคยเป็นที่เสด็จประพาส'],
  ['koh-chang-snorkeling-islands','attraction','ดำน้ำเกาะรอบเกาะช้าง เกาะรัง-เกาะหวาย-เกาะขาม ต่อเรือจากบางเบ้า น้ำใสมีปะการัง ทริปทะเลไม่ควรพลาด'],
  ['koh-chang-viewpoints','attraction','จุดชมวิวเกาะช้าง จุดชมวิวไก่แบ้ จุดชมวิวรอบเกาะ มุมถ่ายรูปทะเลและพระอาทิตย์ตก'],
]
const PLAN = [
  ['koh-chang-2d1n-itinerary','itinerary','แผนเกาะช้าง 2 วัน 1 คืน หาดทรายขาว-บางเบ้า-น้ำตกคลองพลู ใช้ block day'],
  ['koh-chang-3d2n-itinerary','itinerary','แผนเกาะช้าง 3 วัน 2 คืน ครบหาด-น้ำตก-ดำน้ำเกาะรอบ ๆ ใช้ block day'],
  ['koh-chang-island-hopping-plan','itinerary','แผนข้ามเกาะตราด เกาะช้าง-เกาะหมาก-เกาะกูด ต่อเรือเที่ยวหลายเกาะ ใช้ block day'],
  ['koh-chang-bangkok-plan','itinerary','แผนกรุงเทพ-เกาะช้าง รถ+เรือเฟอร์รีจากแหลมงอบตราด ใช้ block day'],
  ['koh-chang-family-plan','itinerary','แผนเกาะช้างสายครอบครัว หาดเงียบ-น้ำตก-ดำน้ำตื้น ใช้ block day'],
  ['koh-chang-couple-plan','itinerary','แผนเกาะช้างสายคู่รัก หาดเงียบ-ดินเนอร์ริมทะเล-ดำน้ำ-พระอาทิตย์ตก ใช้ block day'],
  ['koh-chang-first-timer-guide','itinerary','มาเกาะช้างครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['koh-chang-travel-tips','prep','เตรียมตัวเที่ยวเกาะช้าง (ช่วงเวลาดีสุด พ.ย.-เม.ย. ทะเลใส เลี่ยงมรสุม พ.ค.-ต.ค. เรือเกาะรอบ ๆ อาจงด ถนนรอบเกาะชันระวังขับ งบ)'],
  ['koh-chang-getting-around','prep','การเดินทางไป-รอบเกาะช้าง (รถ+เรือเฟอร์รีจากแหลมงอบ/อ่าวธรรมชาติ ตราด รถสองแถวรอบเกาะ เช่ามอเตอร์ไซค์ ถนนชันโค้งหักศอก)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเกาะช้าง (จ.ตราด) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="koh-chang", crumbCity="เกาะช้าง", crumbCityHref="city-koh-chang.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- ⚠️ honesty: ถนนรอบเกาะช้างชันและโค้งหักศอก เตือนขับรถ/มอเตอร์ไซค์ระวัง · เรือดำน้ำเกาะรอบ ๆ เช็กสภาพอากาศ ช่วงมรสุมงด · ที่พักบางแห่งปิดโลว์ซีซั่น บอกตรง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-koh-chang.html และ top10-hotels-koh-chang.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

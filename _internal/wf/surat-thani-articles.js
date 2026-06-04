export const meta = {
  name: 'surat-thani-articles',
  description: 'Surat Thani gold template — food / attractions / itineraries / prep (38 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '12 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (lake + islands + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['surat-thani-food-guide','food','รวมของกินสุราษฎร์ธานีต้องลอง ภาพรวมอาหารทะเล/ใต้/ไข่เค็มไชยา (overview + cards) ลิงก์บทความย่อย'],
  ['surat-thani-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลอ่าวไทยสุราษฎร์ธานี ซีฟู้ดสด ในเมือง/ดอนสัก'],
  ['surat-thani-oyster','eat-ranking','หอยนางรมกาญจนดิษฐ์/ดอนสัก ร้านเด็ด กินสด/ชุบแป้งทอด'],
  ['surat-thani-southern-food','eat-ranking','ร้านอาหารใต้รสจัดสุราษฎร์ (แกงไตปลา คั่วกลิ้ง ผัดสะตอ แกงเหลือง)'],
  ['surat-thani-khanom-jeen','eat-ranking','จัดอันดับร้านขนมจีนน้ำยาปักษ์ใต้สุราษฎร์ ผักเหนาะครบ'],
  ['chaiya-salted-egg-souvenirs','food','ไข่เค็มไชยา เงาะโรงเรียนนาสาร และของฝากเมืองสุราษฎร์ ซื้อที่ไหน'],
  ['surat-thani-cafe-guide','eat-ranking','จัดอันดับคาเฟ่สุราษฎร์ธานี ในเมือง/ริมแม่น้ำตาปี กาแฟสด บรรยากาศ'],
  ['surat-thani-riverside-dining','eat-ranking','ร้านอาหารริมแม่น้ำตาปี บรรยากาศดี มื้อเย็นวิวแม่น้ำ'],
  ['surat-thani-local-breakfast','food','อาหารเช้าแบบคนสุราษฎร์ (ขนมจีน ข้าวยำ ติ่มซำ กาแฟโบราณ ตลาดเช้า)'],
  ['surat-thani-night-market','food','ตลาดกลางคืน/ตลาดริมน้ำสุราษฎร์ ของกินเดินชิม (ตลาดศาลเจ้า ฯลฯ)'],
  ['samui-food-guide','eat-ranking','กินอะไรดีบนเกาะสมุย ร้านอาหาร/ซีฟู้ด/คาเฟ่เด็ดในเกาะ'],
  ['surat-thani-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่าง/ซีฟู้ดบุฟเฟต์สุราษฎร์ คุ้มราคา'],
]
const SEE = [
  ['surat-thani-attractions','attraction','รวมที่เที่ยวสุราษฎร์ธานีที่ต้องไป คละเขื่อน/เกาะ/วัฒนธรรม (ภาพรวม + cards)'],
  ['cheow-lan-lake-guide','attraction','เขื่อนเชี่ยวหลาน กุ้ยหลินเมืองไทย (นอนแพ พายเรือ ล่องเรือ การจอง การเดินทาง)'],
  ['khao-sok-national-park','attraction','อุทยานเขาสก ป่าฝนเก่าแก่ (เดินป่า ถ้ำ ลำธาร ที่พัก ฤดูที่เหมาะ)'],
  ['phra-borommathat-chaiya','attraction','พระบรมธาตุไชยา เจดีย์ศรีวิชัย (ประวัติ การไหว้พระ การเดินทาง)'],
  ['suan-mokkh-guide','attraction','สวนโมกขพลาราม สวนป่าปฏิบัติธรรมท่านพุทธทาส (โรงมหรสพทางวิญญาณ ปริศนาธรรม)'],
  ['koh-samui-guide','attraction','เกาะสมุย ครบ (เฉวง ละไม หาดเด่น เที่ยวรอบเกาะ การเดินทางไปเกาะ)'],
  ['koh-phangan-guide','attraction','เกาะพะงัน (หาดริ้น ฟูลมูนปาร์ตี้ หาดเงียบ จุดดำน้ำ การเดินทาง)'],
  ['koh-tao-guide','attraction','เกาะเต่า สวรรค์นักดำน้ำ (ดำน้ำ คอร์สดำน้ำ อ่าวโตนด หินวง การเดินทาง)'],
  ['tapi-river-city-guide','attraction','แม่น้ำตาปีและเมืองสุราษฎร์ (ตลาดริมน้ำ ศาลหลักเมือง จุดเดินเล่นเย็น)'],
  ['khao-sok-waterfalls-caves','attraction','น้ำตกและถ้ำเขตเขาสก (ถ้ำน้ำลอด ลำธารใส เส้นทางเดินป่า)'],
  ['donsak-pier-guide','attraction','ท่าเรือดอนสัก ออกเกาะสมุย-พะงัน (เฟอร์รี/เรือเร็ว ตารางเรือ ร้านอาหาร)'],
  ['ban-don-bay-guide','attraction','อ่าวบ้านดอนและเกาะใกล้เมือง (แหล่งเลี้ยงหอย วิถีประมง ออกเรือ)'],
]
const PLAN = [
  ['surat-thani-1-day-itinerary','itinerary','แผนเที่ยวสุราษฎร์ธานี 1 วัน เมือง–ไชยา หรือ เขาสก ใช้ block day'],
  ['surat-thani-2d1n-itinerary','itinerary','แผนสุราษฎร์ 2 วัน 1 คืน เขื่อนเชี่ยวหลาน–นอนแพเขาสก ใช้ block day'],
  ['surat-thani-3d2n-itinerary','itinerary','แผนสุราษฎร์ 3 วัน 2 คืน เขาสก+ไชยา+เมือง ใช้ block day'],
  ['khao-sok-cheow-lan-plan','itinerary','แผนสายธรรมชาติ เขาสก–เชี่ยวหลาน–น้ำตก–พายเรือคายัค ใช้ block day'],
  ['chaiya-temple-plan','itinerary','แผนสายไหว้พระและเมืองเก่า ไชยา–พระบรมธาตุ–สวนโมกข์ ใช้ block day'],
  ['samui-island-plan','itinerary','แผนออกเกาะสมุย/พะงัน จากสุราษฎร์ ต่อเรือ นอนเกาะ ใช้ block day'],
  ['surat-thani-cafe-city-plan','itinerary','แผนสายคาเฟ่และเมือง ริมแม่น้ำตาปี ตลาด ใช้ block day'],
  ['surat-thani-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เชี่ยวหลาน เขาสก ไชยา) ใช้ block day'],
  ['surat-nakhon-si-plan','itinerary','แผนข้ามจังหวัด สุราษฎร์–นครศรีธรรมราช ไหว้พระธาตุสองเมืองใต้ ใช้ block day'],
  ['surat-chumphon-plan','itinerary','แผนข้ามจังหวัด สุราษฎร์–ชุมพร เลาะอ่าวไทยกินอาหารทะเล ใช้ block day'],
  ['surat-thani-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เขาสกล่องเรือ สวนผลไม้ หาด) ใช้ block day'],
  ['surat-thani-first-timer-guide','itinerary','มาสุราษฎร์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['surat-thani-travel-tips','prep','เตรียมตัวเที่ยวสุราษฎร์ธานี (ช่วงเวลาดีสุด เลี่ยงฝน ต.ค.-ธ.ค. การจองแพเชี่ยวหลาน งบ ซิม)'],
  ['surat-thani-getting-around','prep','การเดินทางสุราษฎร์ธานี (สนามบิน URT รถไฟ รถตู้ ท่าเรือดอนสัก/ราชา/ซีทราน เฟอร์รีไปเกาะ เข้าเขาสกยังไง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสุราษฎร์ธานีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="surat-thani", crumbCity="สุราษฎร์ธานี", crumbCityHref="city-surat-thani.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-surat-thani.html และ top10-hotels-surat-thani.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

export const meta = {
  name: 'phetchaburi-articles',
  description: 'Phetchaburi gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phetchaburi-food-guide','food','รวมของกินเพชรบุรีที่ต้องลอง คละขนมหวานเมืองเพชร/ข้าวแช่/อาหารทะเลชะอำ/คาเฟ่เมืองเก่า (ภาพรวม + cards)'],
  ['phetchaburi-thai-desserts','eat-ranking','จัดอันดับร้านขนมหวานเมืองเพชร (หม้อแกง ทองหยิบ ทองหยอด ฝอยทอง ข้าวเหนียวตัด) เจ้าดังแถวเขาวัง'],
  ['phetchaburi-khao-chae','food','ข้าวแช่เมืองเพชร น้ำลอยดอกไม้ เครื่องเคียงลูกกะปิ พริกหยวกสอดไส้ กินที่ไหน ฤดูไหน'],
  ['cha-am-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลชะอำ–บ้านแหลม กุ้งเผา ปูผัดผงกะหรี่ ปลาสด ร้านริมหาด'],
  ['phetchaburi-old-town-cafe','eat-ranking','คาเฟ่ในเมืองเก่าริมแม่น้ำเพชร เรือนไม้/ตึกแถว นั่งจิบกาแฟดูบรรยากาศเมือง'],
  ['phetchaburi-old-town-eats','food','ก๋วยเตี๋ยวและข้าวแกงในเมืองเก่าเพชรบุรี ร้านเก่าแก่ริมแม่น้ำเพชร เดินกินเช้า'],
  ['ban-laem-seafood-souvenir','eat-ranking','ของฝากบ้านแหลม ปลาทูอ่าวไทย ปลาเค็ม ปลาทูนึ่ง กะปิ ของทะเลตากแห้ง ซื้อที่ไหน'],
  ['phetchaburi-tanod-palm-sugar','food','น้ำตาลโตนดสดเมืองเพชร ตาลลอนกะทิ ขนมตาล ของหวานริมทางตามฤดู'],
  ['phetchaburi-local-breakfast','food','อาหารเช้าแบบคนเมืองเพชร (ขนมจีนทอดมัน ข้าวแกง กาแฟ ตลาดเช้า) ก่อนเที่ยววัด'],
]
const SEE = [
  ['phetchaburi-attractions','attraction','รวมที่เที่ยวเพชรบุรีที่ต้องไป คละวัฒนธรรม/ธรรมชาติ/เมือง (ภาพรวม + cards)'],
  ['phra-nakhon-khiri-khao-wang','attraction','พระนครคีรี (เขาวัง) พระราชวังบนยอดเขา รถราง พระที่นั่ง เจดีย์ หอดูดาว วิวเมือง ค่าเข้า'],
  ['wat-yai-suwannaram','attraction','วัดใหญ่สุวรรณาราม ศาลาการเปรียญไม้สัก บานประตูแกะสลัก จิตรกรรมฝาผนัง ฝีมือช่างเมืองเพชร'],
  ['wat-mahathat-phetchaburi','attraction','วัดมหาธาตุวรวิหาร พระปรางค์ห้ายอดสีขาว งานปูนปั้น ศูนย์กลางเมืองเพชร'],
  ['tham-khao-luang-phetchaburi','attraction','ถ้ำเขาหลวง ถ้ำหินปูนใกล้เขาวัง แสงลอดเพดานถ้ำต้องพระพุทธรูป การเที่ยว'],
  ['cha-am-beach-guide','attraction','หาดชะอำ หาดทรายยาวริมอ่าวไทย เล่นน้ำ ขี่ม้า ร้านอาหารทะเล กิจกรรมริมหาด'],
  ['kaeng-krachan-national-park','attraction','อุทยานแห่งชาติแก่งกระจาน อ่างเก็บน้ำ น้ำตก ดูนกดูสัตว์ป่า เส้นทางเที่ยว ค่าเข้า'],
  ['phanoen-thung-guide','attraction','พะเนินทุ่ง จุดชมทะเลหมอกในแก่งกระจาน จองคิวรถ ช่วงเวลา จุดชมวิว/ดูนก'],
  ['laem-phak-bia','attraction','แหลมผักเบี้ย ป่าชายเลน นาเกลือ สะพานไม้ดูนกชายเลน โครงการศึกษาธรรมชาติ'],
  ['ram-ratchaniwet-ban-puen-palace','attraction','พระรามราชนิเวศน์ (วังบ้านปืน) พระราชวังก่ออิฐสไตล์ยุโรปริมแม่น้ำเพชร สถาปัตยกรรม สวน'],
  ['phetchaburi-craft-temples','attraction','วัดช่างฝีมือเมืองเพชร (วัดเกาะแก้วสุทธาราม ปูนปั้น จิตรกรรม) เส้นทางไหว้พระชมงานช่าง'],
  ['phetchaburi-old-town-walk','attraction','เดินเมืองเก่าริมแม่น้ำเพชร ตลาด สะพาน เรือนไม้ คาเฟ่ บรรยากาศเมืองเก่า'],
]
const PLAN = [
  ['phetchaburi-1-day-itinerary','itinerary','แผนเที่ยวเพชรบุรี 1 วัน เขาวัง–วัดช่างเมืองเพชร–ขนมหวาน ใช้ block day'],
  ['phetchaburi-2d1n-itinerary','itinerary','แผนเพชรบุรี 2 วัน 1 คืน เมืองเก่า–เขาวัง–ชะอำ ใช้ block day'],
  ['phetchaburi-3d2n-itinerary','itinerary','แผนเพชรบุรี 3 วัน 2 คืน เมืองเก่า–ชะอำ–แก่งกระจาน ใช้ block day'],
  ['phetchaburi-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าริมแม่น้ำเพชร ใช้ block day'],
  ['kaeng-krachan-nature-plan','itinerary','แผนสายธรรมชาติ แก่งกระจาน–พะเนินทุ่ง–แหลมผักเบี้ย ใช้ block day'],
  ['phetchaburi-culture-temples-plan','itinerary','แผนสายวัด/ช่างเมืองเพชร เขาวัง–วัดใหญ่–วัดมหาธาตุ ใช้ block day'],
  ['phetchaburi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เขาวัง วังบ้านปืน เมืองเก่า ชะอำ) ใช้ block day'],
  ['cha-am-beach-weekend-plan','itinerary','แผนเที่ยวชะอำสุดสัปดาห์จากกรุงเทพ ทะเล–อาหารทะเล–พักผ่อน ใช้ block day'],
  ['phetchaburi-prachuap-plan','itinerary','แผนข้ามจังหวัด เพชรบุรี–ประจวบคีรีขันธ์ ชะอำต่อหัวหิน ใช้ block day'],
  ['phetchaburi-ratchaburi-plan','itinerary','แผนข้ามจังหวัด เพชรบุรี–ราชบุรี เมืองเก่า–ตลาดน้ำ ใช้ block day'],
  ['phetchaburi-samut-songkhram-plan','itinerary','แผนข้ามจังหวัด เพชรบุรี–สมุทรสงคราม อัมพวา ตลาดน้ำ ใช้ block day'],
  ['phetchaburi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก เพชรบุรี ชะอำ เขาวัง รถราง ใช้ block day'],
  ['phetchaburi-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวเพชรบุรีคุ้ม ใช้ block day'],
  ['phetchaburi-first-timer-guide','itinerary','มาเพชรบุรีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phetchaburi-travel-tips','prep','เตรียมตัวเที่ยวเพชรบุรี (ช่วงเวลาดีสุด ข้าวแช่หน้าร้อน พะเนินทุ่งหน้าหนาว จองรถขึ้นพะเนินทุ่ง งบ ของฝาก)'],
  ['phetchaburi-getting-around','prep','การเดินทางไป/ในเพชรบุรี (จากกรุงเทพ รถตู้ รถไฟ ขับรถเอง ไปชะอำ–แก่งกระจาน รถสองแถวในเมือง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเพชรบุรีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phetchaburi", crumbCity="เพชรบุรี", crumbCityHref="city-phetchaburi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phetchaburi.html และ top10-hotels-phetchaburi.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

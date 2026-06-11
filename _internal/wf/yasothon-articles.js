export const meta = {
  name: 'yasothon-articles',
  description: 'Yasothon (ยโสธร) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Bang Fai + Kong Khao Noi stupa + old town)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['yasothon-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานยโสธร ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['pla-som-mahachanachai','eat-ranking','ปลาส้มมหาชนะชัยยโสธร ของหมักขึ้นชื่อ เนื้อปลาหมักเปรี้ยวกลมกล่อม ร้านเด็ด ทอดกินกับข้าว ของฝาก แหล่งซื้อ'],
  ['yasothon-cafe-guide','eat-ranking','คาเฟ่ยโสธร ย่านเมืองเก่าบ้านสิงห์ท่าและในเมือง นั่งชิลในตึกเก่า กาแฟดี ถ่ายรูป'],
  ['yasothon-mookata','eat-ranking','หมูกระทะยโสธร ร้านยอดนิยมในเมือง คุ้มราคา มื้อเย็น'],
  ['luk-niang','food','ลูกเนียงยโสธร ผลไม้พื้นบ้านรสมันเฝื่อน กินกับน้ำพริก/ลาบ หาซื้อตามตลาดสด ของกินพื้นถิ่นอีสาน'],
  ['yasothon-jasmine-rice','food','ข้าวหอมมะลิทุ่งกุลายโสธร ข้าวคุณภาพหุงหอมนุ่ม แหล่งซื้อ ของฝากขึ้นชื่อ'],
  ['yasothon-street-food','food','สตรีทฟู้ดและตลาดเย็นยโสธร ของกินเล่นอีสาน ของย่าง ของทอด เดินชิมยามค่ำ'],
  ['yasothon-local-breakfast','food','อาหารเช้าแบบคนยโสธร (ข้าวจี่ ข้าวเหนียวปิ้งทาไข่ ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['yasothon-forest-mushroom','food','เห็ดป่าและผักพื้นบ้านยโสธร หน้าฝนมีเห็ดและผักจากทุ่งนาออกตลาด เอาไปแกง/ต้มยำแบบอีสาน'],
  ['yasothon-souvenir-food','food','ของฝากกินได้ยโสธร (ปลาส้มมหาชนะชัย ข้าวหอมมะลิทุ่งกุลา ลูกเนียง ของหมักพื้นบ้าน แหล่งซื้อ)'],
  ['yasothon-local-dessert','food','ของหวานและขนมพื้นถิ่นยโสธร ขนมอีสาน ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['yasothon-attractions','attraction','รวมที่เที่ยวยโสธรที่ต้องไป คละงานบุญบั้งไฟ/พระธาตุก่องข้าวน้อย/บ้านสิงห์ท่า/ภูถ้ำพระ/หมอนขิด (ภาพรวม + cards)'],
  ['phra-that-kong-khao-noi','attraction','พระธาตุก่องข้าวน้อย เจดีย์เก่าทรงสอบกลางทุ่งนา ตำนานลูกฆ่าแม่เพราะหิวข้าว จุดไหว้พระและถ่ายรูป การเดินทาง'],
  ['ban-singha-tha','attraction','ย่านเมืองเก่าบ้านสิงห์ท่า ถนนสายเก่ากลางเมือง ตึกแถวจีน-ฝรั่งอายุร้อยปี เดินชมสถาปัตยกรรม คาเฟ่ในตึกเดิม'],
  ['wat-maha-that-yasothon','attraction','วัดมหาธาตุยโสธร วัดเก่ากลางเมือง พระธาตุยโสธร หอไตรกลางน้ำเก่าแก่ วัดสำคัญคู่จังหวัด'],
  ['phaya-thaen-park','attraction','สวนสาธารณะพญาแถน สวนริมบึงกลางเมือง ลานจัดงานบุญบั้งไฟ พิพิธภัณฑ์บั้งไฟ ที่พักผ่อนของคนเมือง'],
  ['wat-phra-phutthabat-yasothon','attraction','วัดพระพุทธบาทยโสธร รอยพระพุทธบาทจำลองและพระพุทธรูปเก่า บรรยากาศเงียบสงบนอกเมือง'],
  ['phu-tham-phra','attraction','ภูถ้ำพระ เลิงนกทา ภูเขาหินทราย มีถ้ำ น้ำตกตามฤดู เส้นทางเดินป่าชมธรรมชาติแบบเงียบ การเดินทาง'],
  ['ban-na-samai-mon-khit','attraction','บ้านนาสะไมย์ แหล่งหมอนขิด หมู่บ้านหัตถกรรมทำหมอนขิดและผ้าทอพื้นเมือง ดูการทำ เลือกซื้อของฝากถึงแหล่ง'],
  ['bun-bang-fai-festival','attraction','งานบุญบั้งไฟยโสธร งานคู่เมืองเดือนพฤษภาคม ขบวนแห่บั้งไฟลวดลายสวย การจุดบั้งไฟขึ้นฟ้าแข่งกัน'],
  ['yasothon-mud-dyed-cloth','attraction','ผ้าหมักโคลนยโสธร ผ้าฝ้ายย้อมสีธรรมชาติจากโคลน งานหัตถกรรมพื้นถิ่น แหล่งทอ เลือกซื้อเป็นของฝาก'],
  ['yasothon-rice-fields-nature','attraction','ทุ่งนาและวิถีเกษตรยโสธร นาข้าวกว้างในเขตทุ่งกุลา ต้นหนาวทุ่งเขียวขจี วิถีชนบทอีสาน จุดถ่ายรูป'],
  ['yasothon-temples-culture','attraction','วัดและวัฒนธรรมยโสธร วัดมหาธาตุ วัดพระพุทธบาท พระธาตุก่องข้าวน้อย เส้นทางไหว้พระและวัฒนธรรมอีสาน'],
]
const PLAN = [
  ['yasothon-1-day-itinerary','itinerary','แผนเที่ยวยโสธร 1 วัน เมือง-พระธาตุก่องข้าวน้อย-บ้านสิงห์ท่า วันเดียว ใช้ block day'],
  ['yasothon-2d1n-itinerary','itinerary','แผนยโสธร 2 วัน 1 คืน เที่ยวเมือง-พระธาตุก่องข้าวน้อย-เมืองเก่า ใช้ block day'],
  ['yasothon-3d2n-itinerary','itinerary','แผนยโสธร 3 วัน 2 คืน เมือง+เมืองเก่า+ภูถ้ำพระ+หมอนขิด ใช้ block day'],
  ['yasothon-old-town-cafe-plan','itinerary','แผนสายเมืองเก่า เดินบ้านสิงห์ท่า-คาเฟ่ในตึกเก่า-วัดมหาธาตุ ใช้ block day'],
  ['yasothon-bang-fai-plan','itinerary','แผนทริปงานบุญบั้งไฟเดือนพฤษภาคม เที่ยวงานคู่เมืองยโสธร ใช้ block day'],
  ['yasothon-nature-plan','itinerary','แผนสายธรรมชาติ ภูถ้ำพระ-ทุ่งนาอีสาน ใช้ block day'],
  ['yasothon-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (บ้านสิงห์ท่า พระธาตุก่องข้าวน้อย ทุ่งนา บั้งไฟ) ใช้ block day'],
  ['yasothon-ubon-plan','itinerary','แผนข้ามจังหวัด ยโสธร–อุบลราชธานี เส้นทางอีสานใต้ ใช้ block day'],
  ['yasothon-roi-et-plan','itinerary','แผนข้ามจังหวัด ยโสธร–ร้อยเอ็ด ตามรอยทุ่งกุลาและของกินพื้นถิ่น ใช้ block day'],
  ['yasothon-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (สวนพญาแถน พระธาตุก่องข้าวน้อย บ้านสิงห์ท่า คาเฟ่) ใช้ block day'],
  ['yasothon-culture-craft-plan','itinerary','แผนสายวัฒนธรรม/หัตถกรรม หมอนขิดบ้านนาสะไมย์-ผ้าหมักโคลน-วัด ใช้ block day'],
  ['yasothon-first-timer-guide','itinerary','มายโสธรครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['yasothon-travel-tips','prep','เตรียมตัวเที่ยวยโสธร (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ. งานบุญบั้งไฟพฤษภาคม อากาศ งบ การแต่งตัว)'],
  ['yasothon-getting-around','prep','การเดินทางในยโสธร (บขส.จากกรุงเทพ-อุบล เช่ารถ ไปเลิงนกทา-ภูถ้ำพระ-มหาชนะชัยยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวยโสธร ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="yasothon", crumbCity="ยโสธร", crumbCityHref="city-yasothon.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-yasothon.html และ top10-hotels-yasothon.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

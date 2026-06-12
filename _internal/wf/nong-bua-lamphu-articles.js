export const meta = {
  name: 'nong-bua-lamphu-articles',
  description: 'Nong Bua Lamphu (หนองบัวลำภู) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Tham Klong Phen + Phu Phan Kham + Ubolratana)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['nong-bua-lamphu-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานหนองบัวลำภู ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['nong-bua-lamphu-riverside-fish','eat-ranking','ร้านปลาเผาและอาหารริมน้ำหนองบัวลำภู แถบอ่างเก็บน้ำอุบลรัตน์-ภูพานคำ ปลาเผา ปลานึ่ง ต้มยำปลา นั่งรับลมริมน้ำ'],
  ['nong-bua-lamphu-cafe-guide','eat-ranking','คาเฟ่หนองบัวลำภู ในเมือง นั่งชิล กาแฟดี ถ่ายรูป แวะพักก่อนเที่ยววัด/ขึ้นภู'],
  ['nong-bua-lamphu-mookata','eat-ranking','หมูกระทะหนองบัวลำภู ร้านยอดนิยมในเมือง คุ้มราคา มื้อเย็นนัดกันเป็นกลุ่ม'],
  ['nong-bua-lamphu-noodles','eat-ranking','ข้าวเปียกเส้นและก๋วยจั๊บญวนหนองบัวลำภู มื้อเช้าน้ำซุปร้อน ๆ แบบติดอุดร ร้านเด็ด ราคาท้องถิ่น'],
  ['nong-bua-lamphu-khao-jee','food','ข้าวจี่และขนมพื้นถิ่นหนองบัวลำภู ข้าวจี่ทาไข่ ข้าวต้มมัด ของกินเล่นและของฝากตามตลาดเช้า'],
  ['nong-bua-lamphu-street-food','food','สตรีทฟู้ดและตลาดเย็นหนองบัวลำภู ของย่าง ของทอด ขนมหวาน เดินชิมยามค่ำ ราคาเป็นกันเอง'],
  ['nong-bua-lamphu-local-breakfast','food','อาหารเช้าแบบคนหนองบัวลำภู (ข้าวเปียกเส้น ข้าวจี่ ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['nong-bua-lamphu-forest-veggies','food','ของป่าและผักพื้นบ้านหนองบัวลำภู หน้าฝนมีเห็ด หน่อไม้ ผักพื้นบ้านตามอำเภอติดภู เอาไปแกง/จิ้มน้ำพริก'],
  ['nong-bua-lamphu-souvenir-food','food','ของฝากกินได้หนองบัวลำภู (ปลาส้ม ของหมักพื้นบ้าน ข้าวจี่ ของป่าแปรรูป แหล่งซื้อ)'],
  ['nong-bua-lamphu-local-dessert','food','ของหวานและขนมพื้นถิ่นหนองบัวลำภู ขนมอีสาน ข้าวต้มมัด ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['nong-bua-lamphu-attractions','attraction','รวมที่เที่ยวหนองบัวลำภูที่ต้องไป คละวัดถ้ำกลองเพล/ภูเก้า-ภูพานคำ/อ่างเก็บน้ำอุบลรัตน์/ศาลสมเด็จพระนเรศวร (ภาพรวม + cards)'],
  ['wat-tham-klong-phen','attraction','วัดถ้ำกลองเพล วัดป่าในซอกเขาที่หลวงปู่ขาว อนาลโย เคยจำพรรษา ถ้ำหินใหญ่ พิพิธภัณฑ์อัฐบริขาร ร่มรื่น การเดินทาง'],
  ['phu-kao-phu-phan-kham-park','attraction','อุทยานแห่งชาติภูเก้า-ภูพานคำ หินรูปทรงแปลกตา ภาพเขียนสีก่อนประวัติศาสตร์ จุดชมวิวอ่างเก็บน้ำ เดินป่ากางเต็นท์'],
  ['ubolratana-phu-phan-kham','attraction','อ่างเก็บน้ำเขื่อนอุบลรัตน์ ฝั่งภูพานคำ ผืนน้ำกว้างเลียบแนวภู จุดชมวิว ร้านอาหารริมน้ำ วิวเขาสะท้อนน้ำ'],
  ['san-somdet-phra-naresuan','attraction','ศาลสมเด็จพระนเรศวรมหาราช ศูนย์รวมใจคนหนองบัวลำภู ตั้งคู่หนองบัวกลางเมือง งานบวงสรวงประจำปี'],
  ['nong-bua-lake','attraction','หนองบัว หนองน้ำใหญ่ใจกลางเมืองที่จังหวัดได้ชื่อมา ทางเดินริมน้ำ ออกกำลัง นั่งเล่นยามเย็น'],
  ['thao-to-waterfall','attraction','น้ำตกเฒ่าโต้ น้ำตกใกล้เมือง หน้าฝนน้ำไหลผ่านลานหิน จุดเล่นน้ำและปิกนิกวันหยุดของคนในจังหวัด'],
  ['luang-pu-khao-museum','attraction','พิพิธภัณฑ์หลวงปู่ขาว อนาลโย ในวัดถ้ำกลองเพล เก็บอัฐบริขารและเรื่องราวพระสายป่าที่คนเคารพนับถือ'],
  ['phu-pha-ya-rock-art','attraction','ภูผายา แหล่งภาพเขียนสีก่อนประวัติศาสตร์ในเขตภูเก้า ภาพคนและสัตว์อายุหลายพันปี วิวทุ่งกว้างเบื้องล่าง'],
  ['nong-bua-lamphu-weaving','attraction','ผ้าทอและผ้าหมักโคลนหนองบัวลำภู ผ้าฝ้ายย้อมสีธรรมชาติ งานมือพื้นถิ่น แหล่งทอ เลือกซื้อของฝาก'],
  ['nong-bua-lamphu-temples-culture','attraction','วัดและวัฒนธรรมหนองบัวลำภู วัดถ้ำกลองเพล ศาลสมเด็จพระนเรศวร เส้นทางไหว้พระและวัฒนธรรมอีสาน'],
  ['nong-bua-lamphu-nature','attraction','ธรรมชาติหนองบัวลำภู ภูเก้า-ภูพานคำ อ่างเก็บน้ำอุบลรัตน์ น้ำตกเฒ่าโต้ ภูและผืนน้ำในจังหวัด'],
]
const PLAN = [
  ['nong-bua-lamphu-1-day-itinerary','itinerary','แผนเที่ยวหนองบัวลำภู 1 วัน เมือง-วัดถ้ำกลองเพล หรือ ภูพานคำวันเดียว ใช้ block day'],
  ['nong-bua-lamphu-2d1n-itinerary','itinerary','แผนหนองบัวลำภู 2 วัน 1 คืน เที่ยวเมือง-วัดถ้ำกลองเพล-อ่างเก็บน้ำ ใช้ block day'],
  ['nong-bua-lamphu-3d2n-itinerary','itinerary','แผนหนองบัวลำภู 3 วัน 2 คืน เมือง+วัด+ภูเก้า-ภูพานคำ+อ่างเก็บน้ำ ใช้ block day'],
  ['nong-bua-lamphu-temple-plan','itinerary','แผนสายวัด วัดถ้ำกลองเพล-พิพิธภัณฑ์หลวงปู่ขาว-ศาลสมเด็จพระนเรศวร ใช้ block day'],
  ['nong-bua-lamphu-nature-plan','itinerary','แผนสายธรรมชาติ ภูเก้า-ภูพานคำ-อ่างเก็บน้ำอุบลรัตน์-ภาพเขียนสี ใช้ block day'],
  ['nong-bua-lamphu-lake-chill-plan','itinerary','แผนชิลริมอ่างเก็บน้ำอุบลรัตน์ฝั่งภูพานคำ นั่งกินปลา ชมวิว พักผ่อน ใช้ block day'],
  ['nong-bua-lamphu-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ภูพานคำ อ่างเก็บน้ำ ภาพเขียนสีภูผายา หนองบัว) ใช้ block day'],
  ['nong-bua-lamphu-udon-plan','itinerary','แผนข้ามจังหวัด หนองบัวลำภู–อุดรธานี ทริปของกินและเที่ยวเมือง ใช้ block day'],
  ['nong-bua-lamphu-loei-plan','itinerary','แผนข้ามจังหวัด หนองบัวลำภู–เลย เส้นทางภูเขาและอากาศเย็น ใช้ block day'],
  ['nong-bua-lamphu-khon-kaen-plan','itinerary','แผนข้ามจังหวัด หนองบัวลำภู–ขอนแก่น ทริปเขื่อนอุบลรัตน์และอาหารอีสาน ใช้ block day'],
  ['nong-bua-lamphu-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (วัดถ้ำกลองเพล อ่างเก็บน้ำ น้ำตกเฒ่าโต้ คาเฟ่) ใช้ block day'],
  ['nong-bua-lamphu-first-timer-guide','itinerary','มาหนองบัวลำภูครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['nong-bua-lamphu-travel-tips','prep','เตรียมตัวเที่ยวหนองบัวลำภู (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ.ขึ้นภูชมวิว หน้าฝนน้ำตกสวย อากาศ งบ การแต่งตัว)'],
  ['nong-bua-lamphu-getting-around','prep','การเดินทางในหนองบัวลำภู (บขส.จากกรุงเทพ-อุดร เช่ารถ ใกล้อุดร-เลย-ขอนแก่น ไปถ้ำกลองเพล-ภูพานคำยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวหนองบัวลำภู ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="nong-bua-lamphu", crumbCity="หนองบัวลำภู", crumbCityHref="city-nong-bua-lamphu.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน) · หนองบัวลำภูเป็นเมืองเล็ก ถ้าข้อมูลร้าน/ที่เที่ยวมีน้อย ให้เขียนเท่าที่มีจริงอย่างซื่อสัตย์ ไม่แต่งเติมเกินจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริงเท่าที่มี 6-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-nong-bua-lamphu.html และ top10-hotels-nong-bua-lamphu.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

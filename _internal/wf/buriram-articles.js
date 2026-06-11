export const meta = {
  name: 'buriram-articles',
  description: 'Buriram (บุรีรัมย์) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Khmer temples + stadium + volcanoes)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['buriram-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานบุรีรัมย์ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['prakhon-chai-kung-jom','eat-ranking','กุ้งจ่อมประโคนชัย ของขึ้นชื่อบุรีรัมย์ ร้านเด็ด กินกับผักสดหมูสามชั้น แหล่งซื้อ'],
  ['buriram-mookata','eat-ranking','หมูกระทะและปิ้งย่างบุรีรัมย์ ร้านยอดนิยม คุ้มราคา โดยเฉพาะวันแข่งบอล'],
  ['buriram-cafe-guide','eat-ranking','คาเฟ่บุรีรัมย์ ในเมืองและรอบช้างอารีนา นั่งชิล กาแฟดี ถ่ายรูป'],
  ['buriram-noodle-shops','eat-ranking','ร้านก๋วยเตี๋ยวและเส้นผัดบุรีรัมย์ เจ้าเก่าในเมือง ราคาเป็นกันเอง'],
  ['buriram-street-food','food','สตรีทฟู้ดและตลาดเย็นบุรีรัมย์ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['buriram-local-breakfast','food','อาหารเช้าแบบคนบุรีรัมย์ (ข้าวต้ม โจ๊ก กาแฟ ตลาดเช้า)'],
  ['buriram-local-dessert','food','ของหวานและขนมพื้นถิ่นบุรีรัมย์ ข้าวเม่า ขนมอีสาน ของกินเล่น'],
  ['prakhon-chai-khanom-jeen','food','ขนมจีนประโคนชัย น้ำยาน้ำพริกแบบอีสานใต้ เส้นนุ่ม ผักเหนาะเต็มจาน'],
  ['buriram-souvenir-food','food','ของฝากกินได้บุรีรัมย์ (กุ้งจ่อม ข้าวเม่า ของแห้งอีสาน แหล่งซื้อ)'],
  ['buriram-stadium-eats','eat-ranking','ร้านอาหารรอบสนามช้างอารีนา กินก่อน-หลังดูบอล ร้านเด็ดใกล้สนาม'],
]
const SEE = [
  ['buriram-attractions','attraction','รวมที่เที่ยวบุรีรัมย์ที่ต้องไป คละปราสาทขอม/สนามกีฬา/ภูเขาไฟ/ธรรมชาติ (ภาพรวม + cards)'],
  ['phanom-rung-historical-park','attraction','อุทยานประวัติศาสตร์พนมรุ้ง ปราสาทหินขอมบนปากปล่องภูเขาไฟ ทางเดินนาคราช ลวดลาย ค่าเข้า เวลา จุดถ่ายรูป'],
  ['prasat-muang-tam','attraction','ปราสาทเมืองต่ำ ปราสาทขอมพื้นราบ สระน้ำรูปตัวแอลและนาคล้อมรอบ เที่ยวต่อจากพนมรุ้ง'],
  ['chang-arena-buriram','attraction','ช้างอารีนา สนามเหย้าบุรีรัมย์ ยูไนเต็ด บรรยากาศวันแข่ง การซื้อตั๋ว ของที่ระลึกทีม'],
  ['chang-international-circuit','attraction','สนามช้าง อินเตอร์เนชั่นแนล เซอร์กิต สนามแข่งรถมาตรฐาน อีเวนต์มอเตอร์สปอร์ต การเข้าชม'],
  ['khao-kradong-volcano','attraction','วนอุทยานเขากระโดง ภูเขาไฟดับใจกลางเมือง บันไดพญานาค พระสุภัทรบพิตร ปากปล่องภูเขาไฟ วิวเมือง'],
  ['play-la-ploen-buriram','attraction','เพลาเพลิน แหล่งเรียนรู้และสวนดอกไม้ใหญ่แถวนางรอง โซนไม้ดอกตามฤดู กิจกรรมทั้งวัน'],
  ['huai-chorakhe-mak-reservoir','attraction','อ่างเก็บน้ำห้วยจระเข้มาก พื้นที่ชุ่มน้ำใกล้เมือง ดูนก บัวแดงยามเช้า บรรยากาศเงียบสงบ'],
  ['wat-khao-angkhan','attraction','วัดเขาอังคาร วัดบนภูเขาไฟเก่า โบสถ์ลวดลายวิจิตร จุดชมวิวทุ่งกว้าง'],
  ['phanom-rung-sun-alignment','attraction','ปรากฏการณ์พระอาทิตย์ลอด 15 ช่องประตูพนมรุ้ง ช่วงเวลาเกิด การเตรียมตัวไปชม'],
  ['buriram-old-town-walk','attraction','เดินเมืองบุรีรัมย์ ย่านเก่า วัด ตลาด ของกิน รอบเมืองและสถานีรถไฟ'],
  ['buriram-volcano-trail','attraction','เส้นทางภูเขาไฟบุรีรัมย์ เขากระโดง-เขาอังคาร-พนมรุ้ง เที่ยวร่องรอยภูเขาไฟเก่าในวันเดียว'],
]
const PLAN = [
  ['buriram-1-day-itinerary','itinerary','แผนเที่ยวบุรีรัมย์ 1 วัน เมือง-เขากระโดง หรือ พนมรุ้ง-เมืองต่ำวันเดียว ใช้ block day'],
  ['buriram-2d1n-itinerary','itinerary','แผนบุรีรัมย์ 2 วัน 1 คืน เมือง-พนมรุ้ง-เมืองต่ำ ใช้ block day'],
  ['buriram-3d2n-itinerary','itinerary','แผนบุรีรัมย์ 3 วัน 2 คืน เมือง+ปราสาท+กีฬา+ธรรมชาติ ใช้ block day'],
  ['buriram-temple-circuit-plan','itinerary','แผนสายปราสาทขอม พนมรุ้ง-เมืองต่ำ-เขาอังคาร ใช้ block day'],
  ['buriram-football-weekend-plan','itinerary','แผนสายกีฬา ดูบอลช้างอารีนา-เดินเมือง-คาเฟ่ ใช้ block day'],
  ['buriram-nature-plan','itinerary','แผนสายธรรมชาติ ภูเขาไฟเขากระโดง-บึงบัวแดงห้วยจระเข้มาก-เพลาเพลิน ใช้ block day'],
  ['buriram-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พนมรุ้ง เมืองต่ำ เขาอังคาร บัวแดง คาเฟ่) ใช้ block day'],
  ['buriram-korat-temple-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–นครราชสีมา ทริปปราสาทขอมอีสานใต้ ใช้ block day'],
  ['buriram-surin-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–สุรินทร์ ปราสาทและหมู่บ้านช้าง ใช้ block day'],
  ['buriram-khon-kaen-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–ขอนแก่น เที่ยวอีสานสองเมือง ใช้ block day'],
  ['buriram-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เพลาเพลิน เขากระโดง สนามกีฬา คาเฟ่) ใช้ block day'],
  ['buriram-first-timer-guide','itinerary','มาบุรีรัมย์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['buriram-travel-tips','prep','เตรียมตัวเที่ยวบุรีรัมย์ (ช่วงเวลาดีสุด ปรากฏการณ์แสงลอดพนมรุ้ง วันแข่งบอล/แข่งรถ อากาศ งบ การแต่งตัว)'],
  ['buriram-getting-around','prep','การเดินทางในบุรีรัมย์ (รถไฟ/สนามบินบุรีรัมย์/บขส. เช่ารถ ไปพนมรุ้ง-เมืองต่ำยังไง ระยะทางจากกรุงเทพ-โคราช)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวบุรีรัมย์ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="buriram", crumbCity="บุรีรัมย์", crumbCityHref="city-buriram.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-buriram.html และ top10-hotels-buriram.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

// slug-uniqueness guard: skip articles whose JSON already exists on disk
// (workflow scripts have no fs access — existing slugs are injected via args)
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

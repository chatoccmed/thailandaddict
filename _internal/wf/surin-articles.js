export const meta = {
  name: 'surin-articles',
  description: 'Surin (สุรินทร์) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (elephants + Khmer temples + silk)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['surin-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานใต้สุรินทร์ ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['surin-khanom-jeen-nam-ya','eat-ranking','ขนมจีนน้ำยาป่าสุรินทร์ ร้านเด็ดในเมือง น้ำยาเครื่องแกงเข้มข้น ผักสดกองโต'],
  ['surin-mookata','eat-ranking','หมูกระทะและปิ้งย่างสุรินทร์ ร้านยอดนิยม คุ้มราคา'],
  ['surin-cafe-guide','eat-ranking','คาเฟ่สุรินทร์ ในเมือง นั่งชิล กาแฟดี ถ่ายรูป'],
  ['surin-guay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนสุรินทร์ เส้นใหญ่นุ่มน้ำซุปใส อิทธิพลอาหารเวียดนาม ร้านเก่าในเมือง'],
  ['surin-street-food','food','สตรีทฟู้ดและตลาดเย็นริมทางรถไฟสุรินทร์ ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['surin-local-breakfast','food','อาหารเช้าแบบคนสุรินทร์ (ข้าวต้ม โจ๊ก กาแฟ ตลาดเช้า)'],
  ['surin-jasmine-rice','food','ข้าวหอมมะลิทุ่งกุลาร้องไห้สุรินทร์ ของฝากขึ้นชื่อ แหล่งซื้อ จุดเด่นของข้าว'],
  ['surin-garlic-souvenir','food','กระเทียมสุรินทร์ กลีบเล็กกลิ่นแรง ของฝากและกระเทียมโทนดอง แหล่งซื้อ'],
  ['surin-souvenir-food','food','ของฝากกินได้สุรินทร์ (ปลาส้ม แหนม กระเทียม ข้าวหอมมะลิ แหล่งซื้อ)'],
  ['surin-local-dessert','food','ของหวานและขนมพื้นถิ่นสุรินทร์ ขนมอีสาน ของกินเล่นตามตลาด'],
]
const SEE = [
  ['surin-attractions','attraction','รวมที่เที่ยวสุรินทร์ที่ต้องไป คละช้าง/ปราสาทขอม/ผ้าไหม/ธรรมชาติ/ชายแดน (ภาพรวม + cards)'],
  ['ban-ta-klang-elephant-village','attraction','หมู่บ้านช้างบ้านตากลาง ศูนย์คชศึกษา วิถีชาวกูยเลี้ยงช้าง พิพิธภัณฑ์ช้าง ให้อาหารช้าง'],
  ['surin-elephant-festival','attraction','งานแสดงช้างสุรินทร์ กลางเดือนพฤศจิกายน ช้างหลายร้อยเชือก ประวัติงาน การไปชม'],
  ['prasat-sikhoraphum','attraction','ปราสาทศีขรภูมิ ปราสาทขอมปรางค์อิฐห้าองค์ ทับหลังนางอัปสรสลักละเอียด ค่าเข้า เวลา'],
  ['prasat-ta-muen-thom','attraction','ปราสาทตาเมือนธม กลุ่มปราสาทขอมหินทรายริมชายแดนพนมดงรัก เส้นทางโบราณสู่กัมพูชา'],
  ['ban-tha-sawang-silk','attraction','หมู่บ้านทอผ้าไหมบ้านท่าสว่าง ผ้าไหมยกทองลายโบราณ ชมการทอกี่มือ เลือกซื้อผ้า'],
  ['phanom-sawai-forest-park','attraction','วนอุทยานพนมสวาย ภูเขาเตี้ยใกล้เมือง พระพุทธรูปองค์ใหญ่ จุดชมวิว ที่พักผ่อน'],
  ['huai-saneng-reservoir','attraction','อ่างเก็บน้ำห้วยเสนง อ่างกว้างใกล้เมือง ถนนเลียบสันเขื่อน ปั่นจักรยาน นั่งรับลมเย็น'],
  ['chong-chom-border-market','attraction','ตลาดชายแดนช่องจอม อำเภอกาบเชิง จุดผ่านแดนไทย-กัมพูชา เดินซื้อของสองฝั่ง'],
  ['phaya-surin-monument','attraction','อนุสาวรีย์พระยาสุรินทร์ภักดี เจ้าเมืองคนแรก รูปช้างประกอบ แลนด์มาร์กกลางเมือง'],
  ['surin-silk-villages','attraction','รวมหมู่บ้านทอผ้าไหมสุรินทร์ ลายโบราณ การย้อมสีธรรมชาติ เลือกซื้อผ้าจากมือคนทอ'],
  ['surin-khmer-temple-trail','attraction','เส้นทางปราสาทขอมสุรินทร์ ศีขรภูมิ-ตาเมือนธม-ปราสาทชายแดน เที่ยวประวัติศาสตร์อีสานใต้'],
]
const PLAN = [
  ['surin-1-day-itinerary','itinerary','แผนเที่ยวสุรินทร์ 1 วัน เมือง-หมู่บ้านช้าง หรือ ปราสาทศีขรภูมิวันเดียว ใช้ block day'],
  ['surin-2d1n-itinerary','itinerary','แผนสุรินทร์ 2 วัน 1 คืน เมือง-หมู่บ้านช้าง-ปราสาท ใช้ block day'],
  ['surin-3d2n-itinerary','itinerary','แผนสุรินทร์ 3 วัน 2 คืน เมือง+ช้าง+ปราสาท+ผ้าไหม ใช้ block day'],
  ['surin-elephant-culture-plan','itinerary','แผนสายช้างและวัฒนธรรม บ้านตากลาง-ศูนย์คชศึกษา-เมือง ใช้ block day'],
  ['surin-khmer-temple-plan','itinerary','แผนสายปราสาทขอม ศีขรภูมิ-ตาเมือนธม-ชายแดน ใช้ block day'],
  ['surin-silk-craft-plan','itinerary','แผนสายผ้าไหม บ้านท่าสว่าง-หมู่บ้านทอผ้า-ช้อปผ้าไหม ใช้ block day'],
  ['surin-nature-plan','itinerary','แผนสายธรรมชาติ พนมสวาย-ห้วยเสนง ใช้ block day'],
  ['surin-elephant-festival-plan','itinerary','แผนทริปงานแสดงช้างสุรินทร์เดือนพฤศจิกายน การวางแผน ที่พัก ที่จอด ใช้ block day'],
  ['surin-buriram-temple-plan','itinerary','แผนข้ามจังหวัด สุรินทร์–บุรีรัมย์ เส้นทางปราสาทขอมอีสานใต้ ใช้ block day'],
  ['surin-sisaket-plan','itinerary','แผนข้ามจังหวัด สุรินทร์–ศรีสะเกษ ปราสาทและผามออีแดง ใช้ block day'],
  ['surin-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (หมู่บ้านช้าง ปราสาทศีขรภูมิ ผ้าไหม ห้วยเสนง) ใช้ block day'],
  ['surin-first-timer-guide','itinerary','มาสุรินทร์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['surin-travel-tips','prep','เตรียมตัวเที่ยวสุรินทร์ (ช่วงเวลาดีสุด งานแสดงช้างพฤศจิกายน การไปหมู่บ้านช้าง ชายแดนช่องจอม อากาศ งบ การแต่งตัว)'],
  ['surin-getting-around','prep','การเดินทางในสุรินทร์ (รถไฟสายอีสานใต้/บขส. เช่ารถ ไปบ้านตากลาง-ปราสาทยังไง ระยะทางจากกรุงเทพ-บุรีรัมย์)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสุรินทร์ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="surin", crumbCity="สุรินทร์", crumbCityHref="city-surin.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-surin.html และ top10-hotels-surin.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

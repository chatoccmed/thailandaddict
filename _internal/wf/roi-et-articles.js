export const meta = {
  name: 'roi-et-articles',
  description: 'Roi Et (ร้อยเอ็ด) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Ho Wot tower + Bueng Phlan Chai + chedi + Thung Kula)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['roi-et-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานร้อยเอ็ด ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['roi-et-jasmine-rice','food','ข้าวหอมมะลิทุ่งกุลาร้อยเอ็ด ข้าวคุณภาพชื่อดัง หุงหอมนุ่ม แหล่งซื้อ ของฝากขึ้นชื่อ'],
  ['roi-et-cafe-guide','eat-ranking','คาเฟ่ร้อยเอ็ด ในเมืองรอบบึงพลาญชัย นั่งชิล กาแฟดี ถ่ายรูป'],
  ['roi-et-mookata','eat-ranking','หมูกระทะร้อยเอ็ด ร้านยอดนิยมรอบบึงพลาญชัยและในเมือง คุ้มราคา มื้อเย็น'],
  ['roi-et-khao-jee','food','ข้าวจี่และข้าวเหนียวร้อยเอ็ด ข้าวจี่ทาไข่ปิ้งไฟหอม ของกินเล่นยามเช้าตามตลาดนัด'],
  ['roi-et-koi-pla','eat-ranking','ก้อยปลาและปลาน้ำจืดร้อยเอ็ด ลาบปลา ต้มยำปลา เมนูพื้นถิ่นตามร้านอาหารอีสาน ร้านเด็ด'],
  ['roi-et-street-food','food','สตรีทฟู้ดและตลาดเย็นร้อยเอ็ด ของกินเล่นอีสาน ของย่าง ของทอด เดินชิมยามค่ำ'],
  ['roi-et-local-breakfast','food','อาหารเช้าแบบคนร้อยเอ็ด (ข้าวจี่ ข้าวเหนียวหมูปิ้ง ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['roi-et-forest-mushroom','food','เห็ดป่าและผักพื้นบ้านร้อยเอ็ด หน้าฝนมีเห็ดและผักจากทุ่งนาออกตลาด เอาไปแกง/ต้มแบบอีสาน'],
  ['roi-et-souvenir-food','food','ของฝากกินได้ร้อยเอ็ด (ข้าวหอมมะลิทุ่งกุลา ของหมักพื้นบ้าน ปลาส้ม แหนม แหล่งซื้อ)'],
  ['roi-et-local-dessert','food','ของหวานและขนมพื้นถิ่นร้อยเอ็ด ขนมอีสาน ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['roi-et-attractions','attraction','รวมที่เที่ยวร้อยเอ็ดที่ต้องไป คละหอโหวด101/บึงพลาญชัย/พระมหาเจดีย์ชัยมงคล/ทุ่งกุลา/บึงเกลือ (ภาพรวม + cards)'],
  ['ho-wot-101','attraction','หอโหวด 101 หอชมเมืองสูงรูปโหวดริมบึงพลาญชัย ขึ้นลิฟต์ชมวิวเมืองรอบทิศ พื้นกระจกใส เวลา ค่าเข้า'],
  ['bueng-phlan-chai','attraction','บึงพลาญชัย สวนสาธารณะกลางน้ำใจกลางเมือง สัญลักษณ์ร้อยเอ็ด เกาะกลางบึง ศาลเจ้าพ่อหลักเมือง ทางเดินรอบบึง'],
  ['phra-maha-chedi-chai-mongkhon','attraction','พระมหาเจดีย์ชัยมงคล หนองพอก เจดีย์องค์ใหญ่สีขาวทองบนเขา ศิลปะภายใน จุดชมวิวภูเขียว การเดินทาง'],
  ['wat-burapha-phiram','attraction','วัดบูรพาภิราม พระพุทธรัตนมงคลมหามุนี พระพุทธรูปยืนองค์สูงมากกลางเมือง วัดสำคัญคู่จังหวัด'],
  ['roi-et-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติ ร้อยเอ็ด รวมประวัติศาสตร์ ศิลปะ ผ้าทอพื้นเมือง เหมาะแวะทำความรู้จักจังหวัด'],
  ['ku-ka-sing','attraction','กู่กาสิงห์ เกษตรวิสัย ปราสาทหินขอมในเขตทุ่งกุลา ร่องรอยอารยธรรมเก่า สถาปัตยกรรมหินทรายโบราณ'],
  ['bueng-kluea','attraction','บึงเกลือ ทะเลอีสาน เสลภูมิ บึงน้ำกว้างมีหาดทรายริมน้ำ นั่งเล่นพักผ่อน เล่นน้ำ ร้านอาหารริมบึง'],
  ['thung-kula-rong-hai','attraction','ทุ่งกุลาร้องไห้ ที่ราบนากว้างแหล่งข้าวหอมมะลิชื่อดัง ต้นหนาวทุ่งเขียวขจี วิถีชนบทอีสาน จุดถ่ายรูป'],
  ['bun-phawet-festival','attraction','งานบุญผะเหวดร้อยเอ็ด งานบุญใหญ่ประจำจังหวัดเดือนมีนาคม ขบวนแห่ผะเหวดสันดร เทศน์มหาชาติ ผ้าผะเหวด'],
  ['roi-et-city-temples','attraction','วัดในเมืองร้อยเอ็ด วัดบูรพาภิราม วัดกลางมิ่งเมือง วัดสำคัญรอบบึงพลาญชัย เดินไหว้พระในเมือง'],
  ['roi-et-nature','attraction','ธรรมชาติร้อยเอ็ด บึงเกลือ ทุ่งกุลาร้องไห้ บึงพลาญชัย แหล่งน้ำและทุ่งนากว้างในจังหวัด'],
]
const PLAN = [
  ['roi-et-1-day-itinerary','itinerary','แผนเที่ยวร้อยเอ็ด 1 วัน เมือง-หอโหวด-บึงพลาญชัย วันเดียว ใช้ block day'],
  ['roi-et-2d1n-itinerary','itinerary','แผนร้อยเอ็ด 2 วัน 1 คืน เที่ยวเมือง-หอโหวด-พระมหาเจดีย์ชัยมงคล ใช้ block day'],
  ['roi-et-3d2n-itinerary','itinerary','แผนร้อยเอ็ด 3 วัน 2 คืน เมือง+เจดีย์+บึงเกลือ+ทุ่งกุลา ใช้ block day'],
  ['roi-et-temple-merit-plan','itinerary','แผนสายไหว้พระ พระมหาเจดีย์ชัยมงคล-วัดบูรพาภิราม-วัดในเมือง ใช้ block day'],
  ['roi-et-nature-plan','itinerary','แผนสายธรรมชาติ บึงเกลือ-ทุ่งกุลาร้องไห้ ใช้ block day'],
  ['roi-et-city-walk-plan','itinerary','แผนเดินเล่นในเมือง บึงพลาญชัย-หอโหวด-คาเฟ่-ตลาดเย็น ใช้ block day'],
  ['roi-et-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (หอโหวด101 พระมหาเจดีย์ ทุ่งกุลา บึงเกลือ) ใช้ block day'],
  ['roi-et-khon-kaen-plan','itinerary','แผนข้ามจังหวัด ร้อยเอ็ด–ขอนแก่น เส้นทางเมืองหลักอีสานกลาง ใช้ block day'],
  ['roi-et-maha-sarakham-plan','itinerary','แผนข้ามจังหวัด ร้อยเอ็ด–มหาสารคาม ตามรอยข้าวหอมมะลิและวัฒนธรรมอีสาน ใช้ block day'],
  ['roi-et-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หอโหวด บึงพลาญชัย บึงเกลือเล่นน้ำ คาเฟ่) ใช้ block day'],
  ['roi-et-bun-phawet-plan','itinerary','แผนทริปงานบุญผะเหวดเดือนมีนาคม เที่ยวงานบุญใหญ่ร้อยเอ็ด ใช้ block day'],
  ['roi-et-first-timer-guide','itinerary','มาร้อยเอ็ดครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['roi-et-travel-tips','prep','เตรียมตัวเที่ยวร้อยเอ็ด (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ. งานบุญผะเหวดมีนาคม อากาศ งบ การแต่งตัว)'],
  ['roi-et-getting-around','prep','การเดินทางในร้อยเอ็ด (บขส.จากกรุงเทพ-ขอนแก่น สนามบินร้อยเอ็ด เช่ารถ ไปหนองพอก-บึงเกลือยังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวร้อยเอ็ด ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="roi-et", crumbCity="ร้อยเอ็ด", crumbCityHref="city-roi-et.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-roi-et.html และ top10-hotels-roi-et.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

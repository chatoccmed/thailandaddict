export const meta = {
  name: 'amnat-charoen-articles',
  description: 'Amnat Charoen (อำนาจเจริญ) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Phra Mongkhon Ming Muang + Phu Sing + weaving)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['amnat-charoen-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานอำนาจเจริญ ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['amnat-charoen-river-fish','eat-ranking','ร้านปลาแม่น้ำและปลาเผาอำนาจเจริญ ปลาเผาเกลือ ลาบปลา ต้มยำปลา กินกับข้าวเหนียว ร้านเด็ด'],
  ['amnat-charoen-cafe-guide','eat-ranking','คาเฟ่อำนาจเจริญ ในเมืองเล็ก ๆ นั่งชิล กาแฟดี ถ่ายรูป แวะพักระหว่างเที่ยว'],
  ['amnat-charoen-mookata','eat-ranking','หมูกระทะอำนาจเจริญ ร้านยอดนิยมในเมือง คุ้มราคา มื้อเย็น'],
  ['amnat-charoen-fermented','food','ของหมักพื้นบ้านอำนาจเจริญ ปลาส้ม ปลาร้า แหนม หมักเองตามบ้าน เครื่องคู่ครัวอีสาน ของฝาก'],
  ['amnat-charoen-khao-jee','food','ข้าวจี่และข้าวเหนียวปิ้งอำนาจเจริญ ทาไข่ปิ้งไฟหอม ของกินเล่นยามเช้าตามตลาดนัดและริมทาง'],
  ['amnat-charoen-street-food','food','สตรีทฟู้ดและตลาดเย็นอำนาจเจริญ ของกินเล่นอีสาน ของย่าง ของทอด เดินชิมยามค่ำ'],
  ['amnat-charoen-local-breakfast','food','อาหารเช้าแบบคนอำนาจเจริญ (ข้าวจี่ ข้าวเหนียวหมูปิ้ง ขนมจีน ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['amnat-charoen-forest-mushroom','food','เห็ดป่าและผักพื้นบ้านอำนาจเจริญ หน้าฝนมีเห็ดและผักจากทุ่งนาออกตลาด เอาไปแกง/ต้มแบบอีสาน'],
  ['amnat-charoen-souvenir-food','food','ของฝากกินได้อำนาจเจริญ (ปลาส้ม ปลาร้า ของหมักพื้นบ้าน ข้าวหอมมะลิ แหล่งซื้อ)'],
  ['amnat-charoen-local-dessert','food','ของหวานและขนมพื้นถิ่นอำนาจเจริญ ขนมอีสาน ข้าวเหนียว ของกินเล่นตามตลาด'],
]
const SEE = [
  ['amnat-charoen-attractions','attraction','รวมที่เที่ยวอำนาจเจริญที่ต้องไป คละพระมงคลมิ่งเมือง/วัดถ้ำแสงเพชร/ภูสิงห์/เขื่อนลำเซบาย/ผ้าทอ (ภาพรวม + cards)'],
  ['phra-mongkhon-ming-muang','attraction','พุทธอุทยานพระมงคลมิ่งเมือง พระพุทธรูปองค์ใหญ่ประจำจังหวัด กลางลานหินทราย จุดไหว้พระและชมวิวเมือง การเดินทาง'],
  ['wat-tham-saeng-phet','attraction','วัดถ้ำแสงเพชร (วัดศิริมงคล) วัดป่าบนเขาหินทราย มีถ้ำ พระพุทธรูปในซอกหิน บรรยากาศร่มรื่นเงียบสงบ'],
  ['phu-sing-phu-pha-phueng','attraction','วนอุทยานภูสิงห์-ภูผาผึ้ง ชานุมาน ภูเขาหินทราย ลานหิน ถ้ำ จุดชมวิวมองไปทางแม่น้ำโขง เดินเล่นชมธรรมชาติ'],
  ['lam-sebai-dam','attraction','เขื่อนลำเซบาย อ่างเก็บน้ำกว้างวิวน้ำและทิวเขา จุดพักผ่อน ตกปลา ชมวิวยามเย็นของคนพื้นที่'],
  ['wat-phra-lao-thep-nimit','attraction','วัดพระเหลาเทพนิมิต พนา วัดเก่า พระเหลาเทพนิมิตพระพุทธรูปเก่าแก่ที่ชาวบ้านนับถือ วัดสำคัญคู่จังหวัด'],
  ['khao-dan-phra-bat-na-maet','attraction','เขาดานพระบาทนาแมต ลานหินทรายกว้างรอบองค์พระมงคลมิ่งเมือง กลุ่มหิน จุดชมวิวเมือง เดินเล่นยามเย็น'],
  ['amnat-charoen-weaving-village','attraction','หมู่บ้านทอผ้าพื้นเมืองอำนาจเจริญ ทอผ้าฝ้ายและผ้าขิดลายพื้นถิ่นด้วยมือ ดูการทอ เลือกซื้อของฝากถึงแหล่ง'],
  ['amnat-charoen-old-town','attraction','ตัวเมืองอำนาจเจริญ เมืองเล็กเงียบ ตลาด ร้านอาหารอีสาน คาเฟ่ จุดแวะพักระหว่างทางอุบล-มุกดาหาร'],
  ['amnat-charoen-temples-culture','attraction','วัดและวัฒนธรรมอำนาจเจริญ พระมงคลมิ่งเมือง วัดถ้ำแสงเพชร วัดพระเหลาเทพนิมิต เส้นทางไหว้พระอีสาน'],
  ['amnat-charoen-nature','attraction','ธรรมชาติอำนาจเจริญ ภูสิงห์-ภูผาผึ้ง เขื่อนลำเซบาย ลานหินและทิวเขา แหล่งพักผ่อนในจังหวัด'],
  ['amnat-charoen-rice-fields','attraction','ทุ่งนาและวิถีเกษตรอำนาจเจริญ นาข้าวกว้างรอบเมือง ปลายฝนต้นหนาวทุ่งเขียวขจี วิถีชนบทอีสาน จุดถ่ายรูป'],
]
const PLAN = [
  ['amnat-charoen-1-day-itinerary','itinerary','แผนเที่ยวอำนาจเจริญ 1 วัน เมือง-ไหว้พระมงคลมิ่งเมือง-ลานหิน วันเดียว ใช้ block day'],
  ['amnat-charoen-2d1n-itinerary','itinerary','แผนอำนาจเจริญ 2 วัน 1 คืน เที่ยวเมือง-พระมงคลมิ่งเมือง-วัดถ้ำแสงเพชร ใช้ block day'],
  ['amnat-charoen-3d2n-itinerary','itinerary','แผนอำนาจเจริญ 3 วัน 2 คืน เมือง+ภูสิงห์+เขื่อนลำเซบาย+ผ้าทอ ใช้ block day'],
  ['amnat-charoen-temple-merit-plan','itinerary','แผนสายไหว้พระ พระมงคลมิ่งเมือง-วัดถ้ำแสงเพชร-วัดพระเหลาเทพนิมิต ใช้ block day'],
  ['amnat-charoen-nature-plan','itinerary','แผนสายธรรมชาติ ภูสิงห์-ภูผาผึ้ง-เขื่อนลำเซบาย ใช้ block day'],
  ['amnat-charoen-craft-plan','itinerary','แผนสายผ้าทอและของฝาก หมู่บ้านทอผ้า-ผ้าขิด-ตลาดในเมือง ใช้ block day'],
  ['amnat-charoen-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (พระมงคลมิ่งเมือง ลานหินนาแมต ภูสิงห์ ทุ่งนา) ใช้ block day'],
  ['amnat-charoen-ubon-plan','itinerary','แผนข้ามจังหวัด อำนาจเจริญ–อุบลราชธานี เส้นทางอีสานใต้ ใช้ block day'],
  ['amnat-charoen-mukdahan-plan','itinerary','แผนข้ามจังหวัด อำนาจเจริญ–มุกดาหาร เลียบเส้นทางสู่แม่น้ำโขง ใช้ block day'],
  ['amnat-charoen-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (พุทธอุทยาน เขื่อนลำเซบาย ลานหิน คาเฟ่) ใช้ block day'],
  ['amnat-charoen-stopover-plan','itinerary','แผนจุดแวะระหว่างทางอุบล-มุกดาหาร แวะอำนาจเจริญครึ่งวัน ไหว้พระ-กินข้าว ใช้ block day'],
  ['amnat-charoen-first-timer-guide','itinerary','มาอำนาจเจริญครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['amnat-charoen-travel-tips','prep','เตรียมตัวเที่ยวอำนาจเจริญ (ช่วงเวลาดีสุด หน้าหนาวพ.ย.-ก.พ. เมืองเล็กเที่ยวง่าย อากาศ งบ การแต่งตัว)'],
  ['amnat-charoen-getting-around','prep','การเดินทางในอำนาจเจริญ (บขส.จากกรุงเทพ-อุบล เช่ารถ อยู่บนเส้นอุบล-มุกดาหาร ไปชานุมาน-พนายังไง ระยะทาง)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวอำนาจเจริญ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="amnat-charoen", crumbCity="อำนาจเจริญ", crumbCityHref="city-amnat-charoen.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน) · อำนาจเจริญเป็นเมืองเล็ก ถ้าข้อมูลร้าน/ที่เที่ยวมีน้อย ให้เขียนเท่าที่มีจริงอย่างซื่อสัตย์ ไม่แต่งเติมเกินจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริงเท่าที่มี 6-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-amnat-charoen.html และ top10-hotels-amnat-charoen.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

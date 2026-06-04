export const meta = {
  name: 'phuket-articles',
  description: 'Phuket gold template — food / attractions / itineraries / prep (38 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '12 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (beaches + island + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['phuket-food-guide','food','รวมของกินภูเก็ตต้องลอง ภาพรวมเมนูฮกเกี้ยน/ใต้/ทะเล (overview + cards) ลิงก์ไปบทความอาหารย่อย'],
  ['phuket-hokkien-mee','eat-ranking','จัดอันดับร้านหมี่ฮกเกี้ยนภูเก็ต ร้านเก่าแก่ที่คนพื้นที่ไปจริง พร้อมย่าน/ราคา'],
  ['phuket-old-town-cafe','eat-ranking','จัดอันดับคาเฟ่ย่านเมืองเก่าภูเก็ต ตึกชิโน-โปรตุกีส กาแฟ บรรยากาศถ่ายรูป'],
  ['phuket-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลอันดามันภูเก็ต ซีฟู้ดสด ริมหาด/ในเมือง'],
  ['phuket-southern-food','eat-ranking','ร้านอาหารใต้รสจัดภูเก็ต (แกงไตปลา คั่วกลิ้ง ผัดสะตอ แกงเหลือง)'],
  ['phuket-dim-sum-breakfast','eat-ranking','ติ่มซำและกาแฟโบราณมื้อเช้าภูเก็ต ร้านชุมชนจีนเก่า'],
  ['phuket-roti-tea','food','โรตี/ชาชักร้านมุสลิมภูเก็ต ของกินเล่นยอดนิยมเช้าถึงดึก'],
  ['phuket-michelin-fine-dining','eat-ranking','ร้านมิชลิน/ไฟน์ไดนิ่งภูเก็ต มื้อพิเศษโอกาสสำคัญ'],
  ['phuket-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่าง/ซีฟู้ดบุฟเฟต์ภูเก็ต คุ้มราคา'],
  ['phuket-local-sweets','eat-ranking','โอต๊าวและขนมพื้นเมือง/ของหวานภูเก็ต ร้านเด็ดในเมืองเก่า'],
  ['phuket-street-food-markets','food','สตรีทฟู้ดและตลาดภูเก็ต (ถนนคนเดินหลาดใหญ่ ตลาดในเมือง) เดินชิม'],
  ['phuket-beach-bars-dining','eat-ranking','ร้านอาหาร/บีชคลับ/บาร์ริมหาดภูเก็ต บรรยากาศดี มื้อเย็นวิวทะเล'],
]
const SEE = [
  ['phuket-attractions','attraction','รวมที่เที่ยวภูเก็ตที่ต้องไป คละหาด/เกาะ/เมืองเก่า/วัฒนธรรม (ภาพรวม + cards)'],
  ['phuket-old-town-guide','attraction','ย่านเมืองเก่าภูเก็ต ชิโน-โปรตุกีส (ถนนถลาง ดีบุก ซอยรมณีย์) เดินถ่ายรูป คาเฟ่'],
  ['patong-beach-guide','attraction','หาดป่าตอง (หาด ถนนบางลา กลางคืน กิจกรรมทางน้ำ ที่พัก)'],
  ['kata-karon-beach-guide','attraction','หาดกะตะและหาดกะรน (เล่นน้ำ เซิร์ฟ จุดชมวิวกะรน บรรยากาศ)'],
  ['big-buddha-phuket-guide','attraction','พระใหญ่เขานาคเกิด (การเดินทาง เวลา การแต่งกาย วิวรอบเกาะ)'],
  ['promthep-cape-guide','attraction','แหลมพรหมเทพ จุดชมพระอาทิตย์ตก (เวลา ที่จอด มุมถ่ายรูป)'],
  ['wat-chalong-guide','attraction','วัดฉลอง วัดคู่เมืองภูเก็ต (หลวงพ่อแช่ม พระมหาธาตุเจดีย์ การเดินทาง)'],
  ['phi-phi-island-tour','attraction','ทัวร์เกาะพีพีจากภูเก็ต (อ่าวมาหยา ดำน้ำ ราคา ท่าเรือ จองทัวร์)'],
  ['phang-nga-bay-tour','attraction','ทัวร์อ่าวพังงาจากภูเก็ต (เขาตะปู เกาะปันหยี พายคายัคลอดถ้ำ)'],
  ['phuket-beaches-guide','attraction','รวมหาดภูเก็ต (ในหาน ไม้ขาว สุรินทร์ กมลา หาดเงียบ) เลือกหาดให้เหมาะ'],
  ['phuket-viewpoints','attraction','จุดชมวิวภูเก็ต (กะรนวิวพอยต์ วินด์มิลล์ สามอ่าว) ถ่ายรูปสวย'],
  ['phuket-island-hopping-guide','attraction','เที่ยวเกาะรอบภูเก็ต (เกาะเฮ เกาะไม้ท่อน เกาะราชา) ดำน้ำดูปะการัง'],
]
const PLAN = [
  ['phuket-1-day-itinerary','itinerary','แผนเที่ยวภูเก็ต 1 วัน เมืองเก่า–หาด–แหลมพรหมเทพ ใช้ block day'],
  ['phuket-2d1n-itinerary','itinerary','แผนภูเก็ต 2 วัน 1 คืน เมืองเก่า–ป่าตอง–แหลมพรหมเทพ ใช้ block day'],
  ['phuket-3d2n-itinerary','itinerary','แผนภูเก็ต 3 วัน 2 คืน เมือง+หาด+ทัวร์เกาะ ใช้ block day'],
  ['phuket-old-town-cafe-plan','itinerary','แผนสายคาเฟ่และเมืองเก่า ชิโน-โปรตุกีส ใช้ block day'],
  ['phuket-beach-plan','itinerary','แผนสายหาด กะตะ–กะรน–พระใหญ่–แหลมพรหมเทพ ใช้ block day'],
  ['phuket-island-hopping-plan','itinerary','แผนสายเกาะ เกาะพีพีและอ่าวพังงา ทัวร์เรือ ใช้ block day'],
  ['phuket-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เมืองเก่า หาด จุดชมวิว พระใหญ่) ใช้ block day'],
  ['phuket-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (อควาเรียม สวนน้ำ หาดน้ำตื้น โชว์) ใช้ block day'],
  ['phuket-krabi-plan','itinerary','แผนข้ามจังหวัด ภูเก็ต–กระบี่ เลาะอันดามันสองเมืองทะเล ใช้ block day'],
  ['phuket-phang-nga-plan','itinerary','แผนข้ามจังหวัด ภูเก็ต–พังงา เขาหลัก/อ่าวพังงา ใช้ block day'],
  ['phuket-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวภูเก็ตคุ้ม ใช้ block day'],
  ['phuket-first-timer-guide','itinerary','มาภูเก็ตครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['phuket-travel-tips','prep','เตรียมตัวเที่ยวภูเก็ต (ช่วงเวลาดีสุด เลี่ยงมรสุม พ.ค.-ต.ค. ธงแดงคลื่นลม งบ ความปลอดภัยทางน้ำ ซิม)'],
  ['phuket-getting-around','prep','การเดินทางในภูเก็ต (สนามบิน HKT รถแดง แกร็บ เช่ารถ/มอไซค์ เรือไปเกาะ จากสนามบินเข้าเมือง/หาด)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวภูเก็ตลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="phuket", crumbCity="ภูเก็ต", crumbCityHref="city-phuket.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-phuket.html และ top10-hotels-phuket.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

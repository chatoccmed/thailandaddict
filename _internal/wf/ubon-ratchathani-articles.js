export const meta = {
  name: 'ubon-ratchathani-articles',
  description: 'Ubon Ratchathani (อุบลราชธานี) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Mekong nature + culture + city)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['ubon-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานอุบล ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['ubon-vietnamese-food','eat-ranking','ร้านอาหารเวียดนามอุบล เฝอ แหนมเนือง ปอเปี๊ยะสด ข้าวเปียกเส้น ร้านที่คนท้องถิ่นไป'],
  ['ubon-kuay-jab-yuan','eat-ranking','ก๋วยจั๊บญวนอุบล เส้นแบบเวียดนาม น้ำซุปใส หมูและกระเทียมเจียว ร้านเช้าเด็ด'],
  ['ubon-mooyor','food','หมูยอและกุนเชียงอุบล ของฝากอิทธิพลเวียดนาม เนื้อแน่น กินกับข้าวเหนียว แหล่งซื้อ'],
  ['ubon-cafe-guide','eat-ranking','จัดอันดับคาเฟ่อุบล ในเมืองและย่านเก่า นั่งทำงาน ถ่ายรูป กาแฟดี'],
  ['ubon-local-breakfast','food','อาหารเช้าแบบคนอุบล (ก๋วยจั๊บญวน ข้าวจี่ ขนมจีน กาแฟ ตลาดเช้า)'],
  ['ubon-khanom-jeen','eat-ranking','ขนมจีนเส้นสดน้ำยาอุบล เครื่องแกงเข้มข้น ผักพื้นบ้าน ร้านตลาดเช้าเด็ด'],
  ['ubon-night-market','food','ตลาดกลางคืนและสตรีทฟู้ดอุบล ของย่าง ของทอด ของอีสาน เดินชิมยามค่ำ'],
  ['ubon-mookata','eat-ranking','หมูกระทะและปิ้งย่างอุบล ร้านยอดนิยม คุ้มราคา'],
  ['ubon-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองอุบล'],
  ['ubon-souvenir-food','food','ของฝากกินได้อุบล (หมูยอ กุนเชียง ของแห้ง แหล่งซื้อ)'],
]
const SEE = [
  ['ubon-attractions','attraction','รวมที่เที่ยวอุบลที่ต้องไป คละธรรมชาติริมโขง/วัฒนธรรม/เมือง (ภาพรวม + cards)'],
  ['pha-taem-national-park','attraction','อุทยานแห่งชาติผาแต้ม หน้าผาริมโขง ภาพเขียนสีก่อนประวัติศาสตร์ จุดชมวิวโขง ค่าเข้า การเดินทาง'],
  ['sam-phan-bok','attraction','สามพันโบก แก่งหินกลางลำโขง แอ่งหินนับพันหน้าแล้ง แกรนด์แคนยอนเมืองไทย ช่วงเวลา'],
  ['ubon-candle-festival','attraction','งานแห่เทียนพรรษาอุบล กลางเดือนกรกฎาคม ขบวนเทียนแกะสลักวิจิตร ทุ่งศรีเมือง ประวัติ'],
  ['pha-chana-dai','attraction','ผาชะนะได จุดชมพระอาทิตย์ขึ้นแห่งแรกของไทย ในเขตผาแต้ม การขึ้นไปชมแสงแรก'],
  ['wat-sirindhorn-phu-prao','attraction','วัดสิรินธรวรารามภูพร้าว (วัดเรืองแสง) ต้นกัลปพฤกษ์เรืองแสงยามค่ำ การเดินทาง ช่วงเวลาชม'],
  ['wat-thung-si-mueang','attraction','วัดทุ่งศรีเมือง หอไตรกลางน้ำ จิตรกรรมฝาผนังเก่า วัดเก่ากลางเมืองอุบล'],
  ['thung-si-mueang-park','attraction','ทุ่งศรีเมือง สวนสาธารณะกลางเมือง ลานงานแห่เทียน ศาลหลักเมือง ที่พักผ่อนคนอุบล'],
  ['saeng-chan-waterfall','attraction','น้ำตกแสงจันทร์ (น้ำตกลงรู) น้ำไหลลอดรูหิน เขตผาแต้ม สวยช่วงฝนถึงต้นหนาว'],
  ['sao-chaliang','attraction','เสาเฉลียง เสาหินรูปดอกเห็ดจากการกัดเซาะ ใกล้ผาแต้ม จุดแวะถ่ายรูป'],
  ['ubon-national-museum','attraction','พิพิธภัณฑสถานแห่งชาติ อุบลราชธานี อาคารเก่า โบราณวัตถุ ประวัติศาสตร์อีสานใต้'],
  ['kaeng-saphue','attraction','แก่งสะพือ พิบูลมังสาหาร แก่งหินกลางแม่น้ำมูล น้ำเชี่ยวหน้าแล้ง ตลาดและของกินริมแก่ง'],
]
const PLAN = [
  ['ubon-1-day-itinerary','itinerary','แผนเที่ยวอุบล 1 วัน เมือง+วัดทุ่งศรีเมือง+ของกิน ใช้ block day'],
  ['ubon-2d1n-itinerary','itinerary','แผนอุบล 2 วัน 1 คืน เมือง-วัดเรืองแสง ใช้ block day'],
  ['ubon-3d2n-itinerary','itinerary','แผนอุบล 3 วัน 2 คืน เมือง+ผาแต้ม+สามพันโบก ใช้ block day'],
  ['ubon-nature-plan','itinerary','แผนสายธรรมชาติริมโขง ผาแต้ม-สามพันโบก-น้ำตกแสงจันทร์ ใช้ block day'],
  ['ubon-cafe-food-plan','itinerary','แผนสายคาเฟ่และของกินในเมืองอุบล ใช้ block day'],
  ['ubon-temple-plan','itinerary','แผนสายวัด วัดเรืองแสงภูพร้าว-วัดทุ่งศรีเมือง ใช้ block day'],
  ['ubon-candle-festival-plan','itinerary','แผนทริปงานแห่เทียนพรรษาอุบล กลางเดือนกรกฎาคม ใช้ block day'],
  ['ubon-sunrise-pha-chana-dai-plan','itinerary','แผนตื่นเช้าดูพระอาทิตย์ขึ้นแห่งแรกที่ผาชะนะได + เที่ยวผาแต้ม ใช้ block day'],
  ['ubon-sisaket-plan','itinerary','แผนข้ามจังหวัด อุบล–ศรีสะเกษ เส้นทางอีสานใต้ริมชายแดน ใช้ block day'],
  ['ubon-yasothon-plan','itinerary','แผนข้ามจังหวัด อุบล–ยโสธร เมืองบั้งไฟและของกินอีสาน ใช้ block day'],
  ['ubon-amnat-charoen-plan','itinerary','แผนข้ามจังหวัด อุบล–อำนาจเจริญ พระมงคลมิ่งเมืองและวัด ใช้ block day'],
  ['ubon-first-timer-guide','itinerary','มาอุบลครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['ubon-travel-tips','prep','เตรียมตัวเที่ยวอุบล (ช่วงเวลาดีสุด ฤดูสามพันโบก งานแห่งเทียน อากาศ งบ การแต่งตัว ของที่ควรเตรียม)'],
  ['ubon-getting-around','prep','การเดินทางในอุบล (สนามบินอุบล/รถไฟ/บขส. เช่ารถ ไปผาแต้ม-สามพันโบก-วัดเรืองแสง ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวอุบลราชธานี ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="ubon-ratchathani", crumbCity="อุบลราชธานี", crumbCityHref="city-ubon-ratchathani.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-ubon-ratchathani.html และ top10-hotels-ubon-ratchathani.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean (เช่น ตอบโจทย์→ตรงใจ/เหมาะ, โดดเด่น→เด่น, ระดับโลก→ที่คนทั่วโลกรู้จัก, สุดยอด→เด็ด, อันซีน→มุมลับ/คนยังไปไม่ทั่ว) แล้วค่อยบันทึก

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

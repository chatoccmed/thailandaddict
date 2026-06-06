export const meta = {
  name: 'loei-articles',
  description: 'Loei (เลย) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (nature + city + culture)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['loei-isan-food','eat-ranking','ร้านอาหารอีสานเลย ส้มตำ ลาบ ก้อย ซุปหน่อไม้ ไก่ย่าง ร้านที่คนท้องถิ่นไปจริง'],
  ['chiang-khan-cafe-guide','eat-ranking','จัดอันดับคาเฟ่เชียงคานริมโขง บ้านไม้เก่า วิวแม่น้ำ บรรยากาศถ่ายรูป'],
  ['chiang-khan-khai-kratha-breakfast','eat-ranking','ไข่กระทะเชียงคาน มื้อเช้าริมชายโขง ร้านเด็ดที่คนไปตักบาตรแวะกิน'],
  ['loei-mookata-buffet','eat-ranking','หมูกระทะ/บุฟเฟต์ปิ้งย่างเลย-ภูเรือ ร้านยอดนิยม กินอุ่นรับอากาศหนาว'],
  ['loei-mekong-fish-restaurants','eat-ranking','ร้านปลาแม่น้ำโขงเชียงคาน-แก่งคุดคู้ ปลาเผา ต้มยำ นั่งริมโขง'],
  ['chiang-khan-street-food','food','สตรีทฟู้ดถนนคนเดินเชียงคาน ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามเย็น'],
  ['loei-souvenir-food','food','ของฝากกินได้เลย มะพร้าวแก้วเชียงคาน-แก่งคุดคู้ แหล่งซื้อ'],
  ['loei-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนม ในเมืองเลยและภูเรือ'],
  ['loei-noodle-shops','eat-ranking','ร้านก๋วยเตี๋ยว/เส้นเด็ด ๆ ในเมืองเลยและเชียงคาน'],
  ['loei-local-breakfast','food','อาหารเช้าแบบคนเลย ตลาดเช้า ข้าวเหนียว กาแฟโบราณ'],
  ['phu-ruea-restaurant-view','eat-ranking','ร้านอาหารวิวภูเรือ-เขา บรรยากาศหนาว เหมาะมื้อพิเศษ'],
]
const SEE = [
  ['loei-attractions','attraction','รวมที่เที่ยวเลยที่ต้องไป คละธรรมชาติ/เมือง/วัฒนธรรม (ภาพรวม + cards)'],
  ['phu-kradueng-national-park-guide','attraction','อุทยานแห่งชาติภูกระดึง ครบ (เดินขึ้นหลังแป ทุ่งหญ้า น้ำตก ผานกแอ่น ลานกางเต็นท์ ค่าเข้า ลูกหาบ)'],
  ['chiang-khan-walking-street','attraction','เชียงคาน ถนนคนเดินบ้านไม้ริมโขง ตักบาตรข้าวเหนียว คาเฟ่ ที่พัก'],
  ['phu-ruea-national-park','attraction','อุทยานแห่งชาติภูเรือ ทะเลหมอก แม่คะนิ้ง จุดชมพระอาทิตย์ขึ้น หน้าหนาว'],
  ['phra-that-si-song-rak','attraction','พระธาตุศรีสองรัก ด่านซ้าย ประวัติ ความเชื่อ งานสมโภช จุดถ่ายรูป'],
  ['kaeng-khut-khu','attraction','แก่งคุดคู้ แก่งหินกลางโขงใกล้เชียงคาน ร้านอาหารริมโขง ของฝากมะพร้าวแก้ว'],
  ['phu-thok-chiang-khan','attraction','ภูทอก จุดชมทะเลหมอกใกล้เชียงคาน ขึ้นรถสองแถว วิวโขงยามเช้า'],
  ['wat-neramit-wipassana','attraction','วัดเนรมิตวิปัสสนา ด่านซ้าย โบสถ์ศิลาแลงสีส้ม งานปูนปั้น จิตรกรรม'],
  ['suan-hin-pha-ngam','attraction','สวนหินผางาม คุนหมิงเมืองเลย ป่าหินปูนรูปทรงแปลกตา เดินลัดเลาะซอกหิน'],
  ['phi-ta-khon-festival','attraction','งานผีตาโขน ด่านซ้าย ประเพณีหน้ากากผีเฉพาะถิ่น ช่วงจัดงาน การเดินทาง'],
  ['chiang-khan-skywalk','attraction','สกายวอล์คเชียงคาน ภูคกงิ้ว จุดชมแม่น้ำโขงบรรจบเหือง ทางกระจกใส'],
  ['phu-pa-po-loei','attraction','ภูป่าเปาะ ฟูจิเมืองเลย หนองหิน วิวภูเขาเรียงตัว จุดถ่ายรูปฮิต'],
]
const PLAN = [
  ['loei-1-day-itinerary','itinerary','แผนเที่ยวเลย 1 วัน เชียงคาน+แก่งคุดคู้ หรือ เมือง+ภูเรือ ใช้ block day'],
  ['loei-2d1n-itinerary','itinerary','แผนเลย 2 วัน 1 คืน เชียงคาน-ภูทอก-แก่งคุดคู้ ใช้ block day'],
  ['loei-3d2n-itinerary','itinerary','แผนเลย 3 วัน 2 คืน ภูกระดึง+เชียงคาน ใช้ block day'],
  ['chiang-khan-2d1n-plan','itinerary','แผนเชียงคาน 2 วัน 1 คืน ถนนคนเดิน ตักบาตร ภูทอก คาเฟ่ ใช้ block day'],
  ['phu-kradueng-trek-plan','itinerary','แผนเดินขึ้นภูกระดึง 2 วัน 1 คืน เตรียมตัว เส้นทาง ลูกหาบ ลานกางเต็นท์ ใช้ block day'],
  ['phu-ruea-phu-thok-nature-plan','itinerary','แผนสายธรรมชาติทะเลหมอก ภูเรือ-ภูทอก หน้าหนาว ใช้ block day'],
  ['chiang-khan-cafe-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าเชียงคาน ถ่ายรูป ริมโขง ใช้ block day'],
  ['loei-dan-sai-culture-plan','itinerary','แผนสายวัฒนธรรม ด่านซ้าย ผีตาโขน-พระธาตุศรีสองรัก-วัดเนรมิต ใช้ block day'],
  ['loei-phetchabun-mountain-plan','itinerary','แผนข้ามจังหวัด เลย–เพชรบูรณ์ เส้นทางภูเขาหน้าหนาว เขาค้อ-ภูเรือ ใช้ block day'],
  ['loei-udon-thani-mekong-plan','itinerary','แผนข้ามจังหวัด เลย–อุดรธานี เชียงคานริมโขงต่ออุดร ใช้ block day'],
  ['loei-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก เชียงคาน คาเฟ่ แก่งคุดคู้ สวนหินผางาม ใช้ block day'],
  ['loei-first-timer-guide','itinerary','มาเลยครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['loei-travel-tips','prep','เตรียมตัวเที่ยวเลย (ช่วงเวลาดีสุด อากาศหนาว งบ จองอุทยานภูกระดึง/ภูเรือ การแต่งตัวกันหนาว ของที่ควรเตรียม)'],
  ['loei-getting-around','prep','การเดินทางในเลย (รถทัวร์/บขส. เครื่องบินเลย เช่ารถ ขึ้นภูกระดึง/ภูเรือยังไง ระยะทางจากกรุงเทพ-อุดร)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวเลย ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="loei", crumbCity="เลย", crumbCityHref="city-loei.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-loei.html และ top10-hotels-loei.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

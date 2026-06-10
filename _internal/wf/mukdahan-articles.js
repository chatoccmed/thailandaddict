export const meta = {
  name: 'mukdahan-articles',
  description: 'Mukdahan (มุกดาหาร) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Mekong + rock park + border + Phu Tai)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['mukdahan-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานมุกดาหาร ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['mukdahan-mekong-fish','eat-ranking','ร้านปลาแม่น้ำโขงริมโขงมุกดาหาร ปลาเผา ต้มยำ ลาบปลา ปลาคัง วิวฝั่งลาว'],
  ['mukdahan-phu-tai-food','eat-ranking','อาหารผู้ไทยมุกดาหาร แกงหน่อไม้ ปลาแดกบอง ของหมักรสจัด แถบหนองสูง'],
  ['mukdahan-vietnamese-food','eat-ranking','ร้านอาหารเวียดนามมุกดาหาร แหนมเนือง หมูยอ ปอเปี๊ยะสด ร้านที่คนท้องถิ่นไป'],
  ['mukdahan-cafe-guide','eat-ranking','คาเฟ่มุกดาหาร ในเมืองและคาเฟ่วิวริมโขง/วิวเมือง นั่งชิล ถ่ายรูป'],
  ['mukdahan-local-breakfast','food','อาหารเช้าแบบคนมุกดาหาร (ข้าวเปียกเส้น ก๋วยจั๊บญวน กาแฟ ตลาดเช้า)'],
  ['mukdahan-mookata','eat-ranking','หมูกระทะและปิ้งย่างมุกดาหาร ร้านยอดนิยม คุ้มราคา'],
  ['mukdahan-indochina-market-food','food','ของกินตลาดอินโดจีนมุกดาหาร ของกินลาว-เวียดนามปนพื้นถิ่น ของย่าง ของทอด ขนม'],
  ['mukdahan-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองมุกดาหาร'],
  ['mukdahan-souvenir-food','food','ของฝากกินได้มุกดาหาร (หมูยอ แหนม ไส้กรอกอีสาน แหล่งซื้อตลาดอินโดจีน)'],
  ['mukdahan-night-market','food','ตลาดเย็นและสตรีทฟู้ดมุกดาหาร เดินกินของอีสาน-เวียดนามยามค่ำ'],
]
const SEE = [
  ['mukdahan-attractions','attraction','รวมที่เที่ยวมุกดาหารที่ต้องไป คละริมโขง/ภูเขาหิน/ข้ามแดน/ผู้ไทย (ภาพรวม + cards)'],
  ['ho-kaeo-mukdahan','attraction','หอแก้วมุกดาหาร หอชมวิวสูงกลางเมือง มองเห็นเมือง-แม่น้ำโขง-ฝั่งลาวรอบทิศ การขึ้นชม'],
  ['indochina-market','attraction','ตลาดอินโดจีนมุกดาหาร ตลาดริมโขง ของจากลาว-เวียดนาม ของฝากพื้นถิ่น เดินซื้อของ'],
  ['phu-pha-thoep-national-park','attraction','อุทยานแห่งชาติภูผาเทิบ ลานหินกลุ่มหินรูปแปลก จุดชมพระอาทิตย์ตก เส้นทางเดินชม ค่าเข้า'],
  ['wat-phu-manorom','attraction','วัดภูมโนรมย์ พญานาคองค์ใหญ่ จุดชมวิวเมืองและโค้งแม่น้ำโขง ไหว้พระถ่ายรูป'],
  ['thai-lao-friendship-bridge-2','attraction','สะพานมิตรภาพไทย-ลาว แห่งที่ 2 ข้ามไปสะหวันนะเขต จุดข้ามแดน เส้นทางต่อเวียดนาม'],
  ['kaeng-kabao','attraction','แก่งกะเบา อำเภอหว้านใหญ่ แก่งหินริมโขง ร้านอาหารริมน้ำ กินปลาแม่น้ำโขงรับลม'],
  ['nong-sung-phu-tai','attraction','อำเภอหนองสูง ถิ่นผู้ไทย ภาษา การแต่งกาย งานทอผ้า อาหารพื้นถิ่น วิถีชุมชน'],
  ['mukdahan-mekong-promenade','attraction','ถนนริมโขงมุกดาหาร นั่งรับลมเย็น วิวฝั่งสะหวันนะเขต ร้านอาหารและคาเฟ่ริมน้ำ'],
  ['wat-si-mongkhon-tai','attraction','วัดศรีมงคลใต้ พระเจ้าใหญ่แก้วมุกดาหาร พระคู่เมือง วัดเก่ากลางเมือง'],
  ['wat-roi-phra-phutthabat-phu-manorom','attraction','วัดรอยพระพุทธบาทภูมโนรมย์ รอยพระพุทธบาทและองค์พระบนภู วิวเมืองและแม่น้ำโขง'],
  ['savannakhet-day-trip','attraction','ข้ามไปสะหวันนะเขต ลาว แบบไปเช้าเย็นกลับ ขั้นตอนข้ามแดน ตลาดและเมืองลาวฝั่งตรงข้าม'],
]
const PLAN = [
  ['mukdahan-1-day-itinerary','itinerary','แผนเที่ยวมุกดาหาร 1 วัน หอแก้ว-ตลาดอินโดจีน-ภูมโนรมย์ ใช้ block day'],
  ['mukdahan-2d1n-itinerary','itinerary','แผนมุกดาหาร 2 วัน 1 คืน ริมโขง-หอแก้ว-ตลาดอินโดจีน-ภูมโนรมย์ ใช้ block day'],
  ['mukdahan-3d2n-itinerary','itinerary','แผนมุกดาหาร 3 วัน 2 คืน เมือง+ภูผาเทิบ+แก่งกะเบา+ข้ามแดน ใช้ block day'],
  ['mukdahan-nature-plan','itinerary','แผนสายธรรมชาติ ภูผาเทิบ-แก่งกะเบา-วิวริมโขง ใช้ block day'],
  ['mukdahan-riverside-plan','itinerary','แผนสายริมโขง หอแก้ว-ตลาดอินโดจีน-ภูมโนรมย์-คาเฟ่ริมน้ำ ใช้ block day'],
  ['mukdahan-savannakhet-crossing-plan','itinerary','แผนสายข้ามแดน เดินตลาดอินโดจีนแล้วข้ามสะพาน 2 ไปสะหวันนะเขต ใช้ block day'],
  ['mukdahan-phu-tai-culture-plan','itinerary','แผนสายวัฒนธรรมผู้ไทย หนองสูง-งานทอผ้า-อาหารพื้นถิ่น ใช้ block day'],
  ['mukdahan-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (หอแก้ว ภูผาเทิบ พญานาคภูมโนรมย์ ริมโขง) ใช้ block day'],
  ['mukdahan-nakhon-phanom-plan','itinerary','แผนข้ามจังหวัด มุกดาหาร–นครพนม เส้นทางริมโขงสองเมืองชายแดน ใช้ block day'],
  ['mukdahan-yasothon-plan','itinerary','แผนข้ามจังหวัด มุกดาหาร–ยโสธร เที่ยวเมืองอีสานและบั้งไฟ ใช้ block day'],
  ['mukdahan-kalasin-plan','itinerary','แผนข้ามจังหวัด มุกดาหาร–กาฬสินธุ์ ไดโนเสาร์สหัสขันธ์ ใช้ block day'],
  ['mukdahan-first-timer-guide','itinerary','มามุกดาหารครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['mukdahan-travel-tips','prep','เตรียมตัวเที่ยวมุกดาหาร (ช่วงเวลาดีสุด การขึ้นภูผาเทิบ การข้ามแดนสะหวันนะเขต อากาศ งบ การแต่งตัว)'],
  ['mukdahan-getting-around','prep','การเดินทางในมุกดาหาร (สนามบินใกล้สุด นครพนม/อุบล/สกลนคร เช่ารถ ข้ามสะพานมิตรภาพ 2 ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวมุกดาหาร ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="mukdahan", crumbCity="มุกดาหาร", crumbCityHref="city-mukdahan.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-mukdahan.html และ top10-hotels-mukdahan.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

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

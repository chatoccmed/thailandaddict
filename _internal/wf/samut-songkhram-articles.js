export const meta = {
  name: 'samut-songkhram-articles',
  description: 'Samut Songkhram gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['samut-songkhram-food-guide','food','รวมของกินสมุทรสงคราม (แม่กลอง) ที่ต้องลอง คละหอยหลอด/ปลาทู/ตลาดน้ำอัมพวา/คาเฟ่ริมคลอง (ภาพรวม + cards)'],
  ['don-hoi-lot-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลดอนหอยหลอด หอยหลอดผัดฉ่า กุ้งเผา ปูปลาสด ริมหาด'],
  ['amphawa-floating-market-food','food','ของกินตลาดน้ำอัมพวา (ก๋วยเตี๋ยวเรือ หอยทอด กุ้งเผา ของย่างจากเรือ) เดินชิมริมคลองตอนเย็น'],
  ['mae-klong-mackerel','food','ปลาทูแม่กลอง หน้างอคอหัก ตัวสั้นอวบ นึ่งเข่ง ทอดกินกับน้ำพริกกะปิ ร้านเด็ด'],
  ['amphawa-riverside-cafe','eat-ranking','จัดอันดับคาเฟ่ริมคลอง/ริมแม่น้ำแม่กลองแถวอัมพวา เรือนไม้ นั่งจิบกาแฟดูเรือผ่าน'],
  ['mae-klong-coconut-sugar-sweets','food','น้ำตาลมะพร้าวแม่กลองและขนมหวาน (ทองหยอด ข้าวเหนียวมูน ขนมน้ำตาลปึก) ดูเตาเคี่ยว'],
  ['mae-klong-pomelo-lychee','food','ส้มโอขาวใหญ่และลิ้นจี่ค่อมแม่กลอง ผลไม้สวนน้ำกร่อย ออกตามฤดู ซื้อจากสวนริมทาง'],
  ['samut-songkhram-souvenir','eat-ranking','ของฝากแม่กลอง (ปลาทู น้ำตาลมะพร้าว กะปิ ส้มโอ ขนมพื้นบ้าน) ซื้อที่ไหน'],
  ['mae-klong-market-eats','food','ก๋วยเตี๋ยวและของกินตลาดแม่กลอง/ตลาดร่มหุบ เดินกินระหว่างรอรถไฟ'],
]
const SEE = [
  ['samut-songkhram-attractions','attraction','รวมที่เที่ยวสมุทรสงครามที่ต้องไป คละเมือง/วัฒนธรรม/ธรรมชาติ (ภาพรวม + cards)'],
  ['maeklong-railway-market','attraction','ตลาดร่มหุบ (ตลาดแม่กลอง) ตลาดคร่อมรางรถไฟ แม่ค้าหุบร่มเก็บของ ตารางรถไฟ จุดถ่ายรูป'],
  ['amphawa-floating-market','attraction','ตลาดน้ำอัมพวา ริมคลอง คึกคักเย็นศุกร์–อาทิตย์ ของกินจากเรือ ท่าลงเรือดูหิ่งห้อย'],
  ['king-rama-2-memorial-park','attraction','อุทยานพระบรมราชานุสรณ์ ร.2 ถิ่นกำเนิดรัชกาลที่ 2 ริมคลองอัมพวา เรือนไทย สวนพรรณไม้'],
  ['wat-bang-kung','attraction','ค่ายบางกุ้ง โบสถ์ปรกโพธิ์ โบสถ์เก่าที่รากต้นโพธิ์โอบทั้งหลัง ประวัติสมัยกรุงธนบุรี'],
  ['don-hoi-lot','attraction','ดอนหอยหลอด สันดอนเลนปากแม่น้ำแม่กลอง งมหอยหลอดตอนน้ำลง ร้านอาหารทะเลริมหาด ช่วงน้ำลง'],
  ['amphawa-firefly-boat','attraction','ล่องเรือดูหิ่งห้อยอัมพวา ตอนค่ำตามคลอง ต้นลำพัง เด่นหน้าฝน ราคา จุดลงเรือ'],
  ['tha-kha-floating-market','attraction','ตลาดน้ำท่าคา ตลาดน้ำชาวบ้านดั้งเดิม เปิดเฉพาะบางวัน เรือพายขายผลไม้สวน บรรยากาศเงียบ'],
  ['mae-klong-coconut-sugar-farm','attraction','สวนมะพร้าวและเตาตาลแม่กลอง ดูการเคี่ยวน้ำตาลมะพร้าวสด ชิม ซื้อ บรรยากาศชนบทริมคลอง'],
  ['wat-bang-khae-noi','attraction','วัดบางแคน้อย โบสถ์ไม้สักแกะสลักทั้งหลัง ริมแม่น้ำแม่กลอง งานช่างฝีมือ'],
  ['mae-klong-riverside-temples','attraction','วัดริมแม่น้ำแม่กลอง (วัดภุมรินทร์ วัดจุฬามณี วัดบางกะพ้อม) เส้นทางไหว้พระทางเรือ/รถ'],
  ['mae-klong-salt-fields','attraction','นาเกลือสมุทรสงคราม ริมทะเลอ่าวไทย วิถีทำนาเกลือ จุดถ่ายรูปพระอาทิตย์ตก'],
]
const PLAN = [
  ['samut-songkhram-1-day-itinerary','itinerary','แผนเที่ยวสมุทรสงคราม 1 วัน ตลาดร่มหุบ–ตลาดน้ำอัมพวา–ดูหิ่งห้อย ใช้ block day'],
  ['samut-songkhram-2d1n-itinerary','itinerary','แผนสมุทรสงคราม 2 วัน 1 คืน อัมพวา–ดูหิ่งห้อย–ตักบาตรเช้า ใช้ block day'],
  ['samut-songkhram-3d2n-itinerary','itinerary','แผนสมุทรสงคราม 3 วัน 2 คืน อัมพวา–ดอนหอยหลอด–วัดริมน้ำ ใช้ block day'],
  ['amphawa-cafe-plan','itinerary','แผนสายคาเฟ่ริมคลองอัมพวา–แม่กลอง ใช้ block day'],
  ['samut-songkhram-nature-plan','itinerary','แผนสายธรรมชาติ ดอนหอยหลอด–ล่องเรือดูหิ่งห้อย–สวนมะพร้าว ใช้ block day'],
  ['samut-songkhram-culture-plan','itinerary','แผนสายวัฒนธรรม อุทยาน ร.2–ค่ายบางกุ้ง–วัดริมน้ำ ใช้ block day'],
  ['samut-songkhram-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ตลาดร่มหุบ โบสถ์ปรกโพธิ์ นาเกลือ คาเฟ่ริมคลอง) ใช้ block day'],
  ['amphawa-weekend-plan','itinerary','แผนเที่ยวอัมพวาสุดสัปดาห์จากกรุงเทพ ตลาดน้ำ–หิ่งห้อย–โฮมสเตย์ ใช้ block day'],
  ['samut-songkhram-ratchaburi-plan','itinerary','แผนข้ามจังหวัด สมุทรสงคราม–ราชบุรี อัมพวาต่อดำเนินสะดวก ใช้ block day'],
  ['samut-songkhram-phetchaburi-plan','itinerary','แผนข้ามจังหวัด สมุทรสงคราม–เพชรบุรี ตลาดน้ำกับเมืองเก่า ใช้ block day'],
  ['samut-songkhram-samut-sakhon-plan','itinerary','แผนข้ามจังหวัด สมุทรสงคราม–สมุทรสาคร เลาะทะเลอ่าวไทย ใช้ block day'],
  ['samut-songkhram-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก สมุทรสงคราม ตลาดน้ำ ดอนหอยหลอด หิ่งห้อย ใช้ block day'],
  ['samut-songkhram-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวสมุทรสงครามคุ้ม ใช้ block day'],
  ['samut-songkhram-first-timer-guide','itinerary','มาสมุทรสงคราม (แม่กลอง) ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['samut-songkhram-travel-tips','prep','เตรียมตัวเที่ยวสมุทรสงคราม (อัมพวาเปิดศุกร์–อาทิตย์ หิ่งห้อยหน้าฝน เช็คน้ำขึ้นน้ำลงดอนหอยหลอด ตารางรถไฟตลาดร่มหุบ งบ)'],
  ['samut-songkhram-getting-around','prep','การเดินทางไป/ในสมุทรสงคราม (จากกรุงเทพ รถตู้ รถไฟแม่กลอง(วงเวียนใหญ่–มหาชัย–แม่กลอง) ขับรถเอง เรือ รถในพื้นที่)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสมุทรสงคราม (แม่กลอง/อัมพวา) ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="samut-songkhram", crumbCity="สมุทรสงคราม", crumbCityHref="city-samut-songkhram.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-samut-songkhram.html และ top10-hotels-samut-songkhram.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean (เช่น ตอบโจทย์→ตรงใจ/เหมาะ, โดดเด่น→เด่น, ระดับโลก→ที่คนทั่วโลกรู้จัก/ดังไปไกล, สุดยอด→เด็ด, อันซีน→มุมลับ/คนยังไปไม่ทั่ว) แล้วค่อยบันทึก

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

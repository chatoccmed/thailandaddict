export const meta = {
  name: 'chanthaburi-articles',
  description: 'Chanthaburi gold template — food / attractions / itineraries / prep (37 articles, fresh v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '9 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (culture + nature + city)' },
    { title: 'Plan', detail: '14 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['chanthaburi-food-guide','food','รวมของกินจันทบุรีที่ต้องลอง คละก๋วยเตี๋ยวเส้นจันท์/อาหารทะเล/ทุเรียน/ขนมริมน้ำ (ภาพรวม + cards)'],
  ['sen-chan-pad-poo','eat-ranking','จัดอันดับร้านก๋วยเตี๋ยวเส้นจันท์–ผัดปูเส้นจันท์ของเมืองจันท์ ร้านดัง ย่าน/ราคา'],
  ['chanthaburi-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลจันทบุรี (เจ้าหลาว แหลมสิงห์ ปากน้ำแขมหนู) ปู กุ้ง หอยนางรม ปลาสด'],
  ['chanthaburi-durian-fruit','food','ทุเรียนและผลไม้สวนเมืองจันท์ (หมอนทอง พวงมณี เงาะ มังคุด) หน้าผลไม้ ซื้อที่ไหน เข้าสวน'],
  ['riverside-community-snacks','food','ขนมและของกินริมน้ำจันทบูร (ขนมควยลิง ขนมไข่ ข้าวเกรียบยาหน้า) เดินกินตามร้านเก่า'],
  ['chanthaburi-local-dishes','eat-ranking','อาหารพื้นถิ่นเมืองจันท์ (หมูเลียง น้ำพริกระกำ เมนูใส่ระกำ) ร้านที่หากินยาก'],
  ['chanthaburi-old-town-cafe','eat-ranking','จัดอันดับคาเฟ่ย่านเมืองเก่า/ริมน้ำจันทบูร บ้านไม้เก่า กาแฟวิวแม่น้ำ'],
  ['chanthaburi-pepper-souvenir','eat-ranking','พริกไทยจันทบุรีและของฝาก (พริกไทยสด พริกไทยอ่อน ของแปรรูป เส้นจันท์แห้ง) ซื้อที่ไหน'],
  ['chanthaburi-local-breakfast','food','อาหารเช้าแบบคนจันท์ (ก๋วยเตี๋ยว ข้าวแกง กาแฟ ตลาดเช้า) ก่อนเดินเที่ยวเมือง'],
]
const SEE = [
  ['chanthaburi-attractions','attraction','รวมที่เที่ยวจันทบุรีที่ต้องไป คละเมือง/วัฒนธรรม/ธรรมชาติ/ทะเล (ภาพรวม + cards)'],
  ['chanthaburi-riverside-community','attraction','ชุมชนริมน้ำจันทบูร บ้านไม้เก่าริมแม่น้ำ ร้านกาแฟ ของกินพื้นถิ่น เดินเที่ยวทั้งวัน'],
  ['cathedral-immaculate-conception','attraction','อาสนวิหารพระนางมารีอาปฏิสนธินิรมล โบสถ์ทรงโกธิคริมแม่น้ำ องค์แม่พระประดับพลอย กระจกสี'],
  ['chanthaburi-gem-market','attraction','ตลาดพลอยจันทบุรี ย่านค้าพลอยกลางเมือง คึกคักสุดสัปดาห์ ดูการเจียระไน ซื้อขายพลอย'],
  ['khao-khitchakut','attraction','เขาคิชฌกูฏ เดินขึ้นไหว้รอยพระพุทธบาท หินลูกพระบาท เปิดเฉพาะหน้าหนาว ม.ค.–มี.ค. การเตรียมตัว'],
  ['nam-tok-phlio','attraction','น้ำตกพลิ้ว อุทยานแห่งชาติ ฝูงปลาพลวงในแอ่งน้ำใส เดินเข้าไม่ไกล เล่นน้ำ ค่าเข้า'],
  ['chao-lao-laem-sing-beach','attraction','หาดเจ้าหลาว–แหลมสิงห์ ชายทะเลตะวันออก หาดทราย ร้านซีฟู้ดริมทะเล เล่นน้ำ'],
  ['khuk-khi-kai-tuek-daeng','attraction','คุกขี้ไก่และตึกแดง แหลมสิงห์ อาคารเก่าสมัยฝรั่งเศส ประวัติศาสตร์เมืองจันท์ริมทะเล'],
  ['king-taksin-shipyard','attraction','อู่ต่อเรือพระเจ้าตากสิน แหล่งประวัติศาสตร์ที่ต่อเรือสมัยพระเจ้าตากสิน แหล่งเรียนรู้'],
  ['chanthaburi-fruit-orchards','attraction','สวนผลไม้เมืองจันท์ เข้าสวนกินทุเรียนบุฟเฟต์ เงาะ มังคุด หน้าผลไม้ สวนแนะนำ'],
  ['tung-prong-thong','attraction','ทุ่งโปรงทอง ปากน้ำแขมหนู สะพานไม้เดินชมป่าชายเลน จุดชมวิวพระอาทิตย์ตก'],
  ['wat-khao-sukim','attraction','วัดเขาสุกิม วัดบนเขา พิพิธภัณฑ์ วิวเมืองจันท์ การเดินทาง'],
]
const PLAN = [
  ['chanthaburi-1-day-itinerary','itinerary','แผนเที่ยวจันทบุรี 1 วัน ชุมชนริมน้ำ–อาสนวิหาร–ตลาดพลอย ใช้ block day'],
  ['chanthaburi-2d1n-itinerary','itinerary','แผนจันทบุรี 2 วัน 1 คืน เมือง–น้ำตกพลิ้ว–ทะเล ใช้ block day'],
  ['chanthaburi-3d2n-itinerary','itinerary','แผนจันทบุรี 3 วัน 2 คืน เมือง–ธรรมชาติ–ทะเล ใช้ block day'],
  ['chanthaburi-cafe-old-town-plan','itinerary','แผนสายคาเฟ่และเมืองเก่าริมน้ำจันทบูร ใช้ block day'],
  ['chanthaburi-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกพลิ้ว–เขาคิชฌกูฏ–ทุ่งโปรงทอง ใช้ block day'],
  ['chanthaburi-beach-plan','itinerary','แผนสายทะเล เจ้าหลาว–แหลมสิงห์–อ่าวคุ้งกระเบน ใช้ block day'],
  ['chanthaburi-fruit-season-plan','itinerary','แผนหน้าผลไม้ ตระเวนกินทุเรียนถึงสวนเมืองจันท์ ใช้ block day'],
  ['chanthaburi-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ชุมชนริมน้ำ อาสนวิหาร ทุ่งโปรงทอง) ใช้ block day'],
  ['chanthaburi-trat-plan','itinerary','แผนข้ามจังหวัด จันทบุรี–ตราด เลาะทะเลตะวันออก ใช้ block day'],
  ['chanthaburi-rayong-plan','itinerary','แผนข้ามจังหวัด จันทบุรี–ระยอง ทะเลตะวันออก ใช้ block day'],
  ['chanthaburi-chonburi-plan','itinerary','แผนข้ามจังหวัด จันทบุรี–ชลบุรี เลาะทะเลตะวันออกจากกรุงเทพ ใช้ block day'],
  ['chanthaburi-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก จันทบุรี น้ำตก ทะเล สวนผลไม้ ใช้ block day'],
  ['chanthaburi-budget-plan','itinerary','แผนงบประหยัด/แบ็คแพ็ค เที่ยวจันทบุรีคุ้ม ใช้ block day'],
  ['chanthaburi-first-timer-guide','itinerary','มาจันทบุรีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['chanthaburi-travel-tips','prep','เตรียมตัวเที่ยวจันทบุรี (หน้าผลไม้เม.ย.–มิ.ย. เขาคิชฌกูฏเปิดหน้าหนาวม.ค.–มี.ค. จองที่พักล่วงหน้า งบ ของฝาก)'],
  ['chanthaburi-getting-around','prep','การเดินทางไป/ในจันทบุรี (จากกรุงเทพ รถทัวร์ ขับรถเอง ไปทะเลเจ้าหลาว–น้ำตกพลิ้ว–เขาคิชฌกูฏ รถในเมือง)'],
]

const ALL = [...FOOD.map(a=>[...a,'Food','tourlogy-food-writer']), ...SEE.map(a=>[...a,'See','tourlogy-attraction-writer']),
  ...PLAN.map(a=>[...a,'Plan','tourlogy-attraction-writer']), ...PREP.map(a=>[...a,'Prep','tourlogy-attraction-writer'])]

const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวจันทบุรีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="chanthaburi", crumbCity="จันทบุรี", crumbCityHref="city-chanthaburi.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-chanthaburi.html และ top10-hotels-chanthaburi.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

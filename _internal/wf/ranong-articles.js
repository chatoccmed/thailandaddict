export const meta = {
  name: 'ranong-articles',
  description: 'Ranong (ระนอง) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (hot springs + islands + old town + nature)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['ranong-seafood','eat-ranking','จัดอันดับร้านอาหารทะเลระนองที่สดและคนพื้นที่ไปจริง (ร้านในเมือง/ปากน้ำ พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['ranong-oysters','eat-ranking','หอยนางรมระนองตัวโตจากปากแม่น้ำกระบุรี ร้านที่กินสด/ทอด เด็ด ๆ'],
  ['ranong-southern-food','eat-ranking','ร้านอาหารใต้ระนอง ขนมจีนน้ำยา แกงไตปลา แกงเหลือง ร้านที่คนท้องถิ่นไป'],
  ['ranong-dim-sum','eat-ranking','จัดอันดับร้านติ่มซำระนอง ซาลาเปา ขนมจีบ มื้อเช้าแบบจีนฮกเกี้ยน'],
  ['ranong-cafe-guide','eat-ranking','คาเฟ่และกาแฟโบราณระนอง บรรยากาศตึกเก่า นั่งชิล'],
  ['ranong-local-breakfast','food','อาหารเช้าแบบคนระนอง (ติ่มซำ โกปี๊ ขนมจีน ตลาดเช้า)'],
  ['ranong-street-food','food','สตรีทฟู้ดและตลาดระนอง ของกินเดินชิม ของทะเลย่าง'],
  ['ranong-burmese-food','food','อาหารพม่าและของชายแดนเกาะสองในเมืองระนอง ของทอด ของหมัก เครื่องเทศ'],
  ['ranong-cashew-nuts','food','เม็ดมะม่วงหิมพานต์ระนอง อบเกลือ/อบน้ำผึ้ง/คั่ว แหล่งซื้อของฝาก'],
  ['ranong-souvenir-food','food','ของฝากกินได้ระนอง (เม็ดมะม่วงหิมพานต์ อาหารทะเลแปรรูป กะปิ แหล่งซื้อ)'],
  ['ranong-fish-market-food','eat-ranking','ตลาดอาหารทะเลสะพานปลาปากน้ำระนอง ซื้อสดให้ร้านทำ ราคาไม่แพง'],
]
const SEE = [
  ['ranong-attractions','attraction','รวมที่เที่ยวระนองที่ต้องไป คละน้ำร้อน/เกาะ/เมืองเก่า/ธรรมชาติ (ภาพรวม + cards)'],
  ['raksawarin-hot-springs','attraction','บ่อน้ำร้อนรักษะวาริน บ่อน้ำพุร้อนธรรมชาติกลางเมือง แช่เท้า อาบน้ำแร่ การเดินทาง'],
  ['koh-phayam','attraction','เกาะพะยาม อ่าวใหญ่-อ่าวเขาควาย น้ำใส ไม่มีรถยนต์ การลงเรือ ที่พัก'],
  ['koh-chang-ranong','attraction','เกาะช้างระนอง เกาะเงียบเรียบง่าย หาดสงบ ที่พักบ้าน ๆ การเดินทาง'],
  ['ngao-waterfall','attraction','น้ำตกหงาว น้ำตกใหญ่ที่เห็นจากริมถนน เล่นน้ำ ร่มรื่น ใกล้เมือง'],
  ['ranong-old-town','attraction','เมืองเก่าระนอง ตึกแถวและคฤหาสน์จีนฮกเกี้ยน ยุคเหมืองแร่ดีบุก เดินถ่ายรูป'],
  ['ranong-governor-mansion','attraction','จวนเจ้าเมืองระนอง ตระกูลคอซู่เจียง สถาปัตยกรรมเก่า เรื่องเหมืองแร่'],
  ['rattanarangsan-palace','attraction','พระราชวังรัตนรังสรรค์ (จำลอง) เรือนไม้กลางเมือง ชมสถาปัตยกรรมไม้'],
  ['phukao-ya-grass-hill','attraction','ภูเขาหญ้า เนินเขาหญ้าโล่งที่เปลี่ยนสีตามฤดู จุดถ่ายรูปและเดินเล่น'],
  ['khao-fachi-viewpoint','attraction','เขาฝาชี จุดชมวิวปากแม่น้ำกระบุรีและฝั่งพม่า เหมาะช่วงเช้า'],
  ['pak-nam-ranong-border','attraction','ปากน้ำระนอง สะพานปลา และชายแดนเกาะสองพม่า นั่งเรือข้ามไปเดินตลาด'],
  ['ranong-mineral-spa','attraction','สปาและจุดอาบน้ำแร่ระนอง รีสอร์ตน้ำแร่ บ่อแช่ ผ่อนคลาย'],
]
const PLAN = [
  ['ranong-1-day-itinerary','itinerary','แผนเที่ยวระนอง 1 วัน บ่อน้ำร้อน–เมืองเก่า–ปากน้ำ ใช้ block day'],
  ['ranong-2d1n-itinerary','itinerary','แผนระนอง 2 วัน 1 คืน เมือง+น้ำร้อน+ปากน้ำ ใช้ block day'],
  ['ranong-3d2n-itinerary','itinerary','แผนระนอง 3 วัน 2 คืน เมือง+เกาะพะยาม+น้ำตก ใช้ block day'],
  ['koh-phayam-island-plan','itinerary','แผนสายเกาะ เกาะพะยาม–เกาะช้างระนอง นอนยาว ๆ ใช้ block day'],
  ['ranong-hot-spring-relax-plan','itinerary','แผนแช่น้ำร้อนและกินอาหารทะเล 1 วันแบบชิล ใช้ block day'],
  ['ranong-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกหงาว–ภูเขาหญ้า–เขาฝาชี ใช้ block day'],
  ['ranong-old-town-plan','itinerary','แผนสายเมืองเก่า ตึกจีน–จวนเจ้าเมือง–คาเฟ่ ใช้ block day'],
  ['ranong-chumphon-plan','itinerary','แผนข้ามจังหวัด ระนอง–ชุมพร ข้ามคาบสมุทรอันดามันสู่อ่าวไทย ใช้ block day'],
  ['ranong-phang-nga-plan','itinerary','แผนข้ามจังหวัด ระนอง–พังงา เลาะอันดามันลงใต้ ใช้ block day'],
  ['ranong-surat-plan','itinerary','แผนข้ามจังหวัด ระนอง–สุราษฎร์ธานี ข้ามไปอ่าวไทย ใช้ block day'],
  ['ranong-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ภูเขาหญ้า เกาะพะยาม ตึกเก่า บ่อน้ำร้อน) ใช้ block day'],
  ['ranong-first-timer-guide','itinerary','มาระนองครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['ranong-travel-tips','prep','เตรียมตัวเที่ยวระนอง (เมืองฝนแปดแดดสี่ ช่วงเวลาดีสุด การออกเกาะพะยาม การแช่น้ำร้อน งบ การแต่งตัว)'],
  ['ranong-getting-around','prep','การเดินทางในระนอง (สนามบินระนอง/บขส. เช่ารถ ท่าเรือไปเกาะพะยาม–เกาะช้าง ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวระนอง ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="ranong", crumbCity="ระนอง", crumbCityHref="city-ranong.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-ranong.html และ top10-hotels-ranong.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
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

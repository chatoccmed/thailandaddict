export const meta = {
  name: 'rayong-articles-recover',
  description: 'Recover 24 missing Rayong articles (See + Plan + Prep)',
  phases: [ { title: 'Recover', detail: '24 missing articles' } ],
}

const MISSING = [
  ['mae-ramphueng-beach-guide','attraction','หาดแม่รำพึง (หาดทรายยาว ถนนเลียบหาด ร้านอาหาร พระอาทิตย์ การเดินทาง)'],
  ['ban-phe-guide','attraction','บ้านเพ (ท่าเรือไปเกาะเสม็ด ตลาดของฝาก ของทะเลแห้ง)'],
  ['yom-chinda-old-street','attraction','ถนนยมจินดา ย่านเมืองเก่าระยอง (ตึกไม้ บ้านขุนนาง คาเฟ่ ของกิน)'],
  ['tung-prong-thong','attraction','ทุ่งโปรงทอง ปากน้ำประแส (ป่าชายเลน สะพานไม้ จุดถ่ายรูป เวลาที่ดี)'],
  ['htms-prasae-warship','attraction','เรือรบหลวงประแส อนุสรณ์ปากน้ำประแส (ขึ้นชมเรือ วิวแม่น้ำ ประวัติ)'],
  ['sunthorn-phu-monument','attraction','อนุสาวรีย์สุนทรภู่ อ.แกลง (รูปปั้นพระอภัยมณี สวน เวลา)'],
  ['khao-laem-ya-national-park','attraction','อุทยานเขาแหลมหญ้า–หมู่เกาะเสม็ด (จุดชมวิว หาดเงียบ เส้นทางธรรมชาติ ค่าเข้า)'],
  ['rayong-aquarium','attraction','สถาบันวิทยาศาสตร์ทางทะเล/พิพิธภัณฑ์สัตว์น้ำระยอง (ที่เที่ยวในร่ม เด็ก เวลา ค่าเข้า)'],
  ['koh-samet-beaches','attraction','รวมหาดเกาะเสม็ด (ทรายแก้ว อ่าวพร้าว อ่าววงเดือน อ่าวเทียน) เลือกหาด'],
  ['paknam-prasae-community','attraction','ชุมชนปากน้ำประแส (สะพานประแสสิน วิถีประมง ของกินทะเล เดินเที่ยว)'],
  ['rayong-1-day-itinerary','itinerary','แผนเที่ยวระยอง 1 วัน บ้านเพ–แม่รำพึง หรือ เกาะเสม็ดวันเดียว ใช้ block day'],
  ['rayong-2d1n-itinerary','itinerary','แผนระยอง 2 วัน 1 คืน บ้านเพ–เกาะเสม็ด ใช้ block day'],
  ['rayong-3d2n-itinerary','itinerary','แผนระยอง 3 วัน 2 คืน ทะเล+เกาะ+เมืองเก่า ใช้ block day'],
  ['koh-samet-plan','itinerary','แผนเที่ยวเกาะเสม็ด หาด–ดำน้ำตื้น–รอบเกาะ ใช้ block day'],
  ['rayong-sea-beach-plan','itinerary','แผนสายทะเลและหาด แม่รำพึง–เกาะเสม็ด ใช้ block day'],
  ['rayong-food-trip-plan','itinerary','แผนสายของกิน บ้านเพ–ซีฟู้ด–ของทะเลแห้ง ใช้ block day'],
  ['rayong-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ยมจินดา–ปากน้ำประแส ใช้ block day'],
  ['rayong-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ทุ่งโปรงทอง เกาะเสม็ด เรือรบประแส) ใช้ block day'],
  ['rayong-fruit-orchard-plan','itinerary','แผนหน้าผลไม้ เที่ยวสวนทุเรียน–เงาะ–มังคุด ใช้ block day'],
  ['rayong-chanthaburi-eastern-plan','itinerary','แผนข้ามจังหวัด ชลบุรี–ระยอง–จันทบุรี เลาะทะเลตะวันออก ใช้ block day'],
  ['rayong-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (พิพิธภัณฑ์สัตว์น้ำ หาดน้ำตื้น เกาะเสม็ด) ใช้ block day'],
  ['rayong-first-timer-guide','itinerary','มาระยองครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
  ['rayong-travel-tips','prep','เตรียมตัวเที่ยวระยอง (ช่วงเวลาดีสุด หน้าผลไม้ การจองเรือเกาะเสม็ด ค่าเข้าอุทยาน งบ ซิม)'],
  ['rayong-getting-around','prep','การเดินทางระยอง (จากกรุงเทพ รถตู้/บัส ท่าเรือบ้านเพ เรือไปเกาะเสม็ด รถในเกาะ รถเช่า)'],
]
const siblingList = 'rayong-attractions, koh-samet-guide, rayong-seafood, rayong-food-guide, rayong-cafe-guide, rayong-2d1n-itinerary'

function prompt(slug, type, focus){
  const ref = type==='prep' || type==='itinerary' || type==='attraction' ? 'tourlogy-attraction-writer' : 'tourlogy-food-writer'
  return `เขียนบทความท่องเที่ยวระยองลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json
ค่าบังคับ: slug="${slug}", type="${type}", cluster="rayong", crumbCity="ระยอง", crumbCityHref="city-rayong.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง — ถ้า WebFetch ค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง ใช้ความรู้ที่เชื่อถือได้แทน
- โทน v2-clean: ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- block ตามชนิด: itinerary→"day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); attraction→h2/p/list/tip/cards; prep→h2/p/list/tip
- ต้องมี chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-rayong.html, top10-hotels-rayong.html + พี่น้อง 1 จาก: ${siblingList})
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้ให้หมด
- heroEmoji เหมาะสม · เขียน JSON valid · ต้อง Write ไฟล์จริงก่อนจบ`
}

const res = await parallel(MISSING.map(([slug,type,focus]) => () =>
  agent(prompt(slug,type,focus), { label:`recover:${slug}`, phase:'Recover' })
    .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered: ${ok}/${MISSING.length}`)
return { total: MISSING.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

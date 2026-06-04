export const meta = {
  name: 'surat-thani-articles-recover',
  description: 'Recover the 6 Surat Thani articles the first articles run left missing (Plan + Prep)',
  phases: [ { title: 'Recover', detail: '6 missing articles' } ],
}

const MISSING = [
  ['surat-nakhon-si-plan','itinerary','แผนข้ามจังหวัด สุราษฎร์–นครศรีธรรมราช ไหว้พระธาตุสองเมืองใต้ ใช้ block day'],
  ['surat-chumphon-plan','itinerary','แผนข้ามจังหวัด สุราษฎร์–ชุมพร เลาะอ่าวไทยกินอาหารทะเล ใช้ block day'],
  ['surat-thani-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เขาสกล่องเรือ สวนผลไม้ หาด) ใช้ block day'],
  ['surat-thani-first-timer-guide','itinerary','มาสุราษฎร์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
  ['surat-thani-travel-tips','prep','เตรียมตัวเที่ยวสุราษฎร์ธานี (ช่วงเวลาดีสุด เลี่ยงฝน ต.ค.-ธ.ค. การจองแพเชี่ยวหลาน งบ ซิม)'],
  ['surat-thani-getting-around','prep','การเดินทางสุราษฎร์ธานี (สนามบิน URT รถไฟ รถตู้ ท่าเรือดอนสัก/ราชา/ซีทราน เฟอร์รีไปเกาะ เข้าเขาสกยังไง)'],
]

const siblingList = 'surat-thani-food-guide, surat-thani-seafood, surat-thani-attractions, cheow-lan-lake-guide, khao-sok-national-park, koh-samui-guide, surat-thani-1-day-itinerary, surat-thani-2d1n-itinerary, surat-thani-3d2n-itinerary, khao-sok-cheow-lan-plan, chaiya-temple-plan, samui-island-plan'

function prompt(slug, type, focus){
  return `เขียนบทความท่องเที่ยวสุราษฎร์ธานีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json
ค่าบังคับ: slug="${slug}", type="${type}", cluster="surat-thani", crumbCity="สุราษฎร์ธานี", crumbCityHref="city-surat-thani.html"

วิธีเขียน:
- อ่าน .claude/agents/tourlogy-attraction-writer.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) หา สถานที่/ร้าน ที่เปิดอยู่จริงตอนนี้ — **ถ้า WebFetch ค้างหรือช้าผิดปกติ ให้ข้ามแหล่งนั้น อย่ารอจนค้าง** ใช้ข้อมูลเท่าที่หาได้ + ความรู้ทั่วไปที่เชื่อถือได้
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; prep→h2/p/list/tip
- ต้องมี: chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-surat-thani.html และ top10-hotels-surat-thani.html + พี่น้อง 1 จาก: ${siblingList})
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้ให้หมดก่อนบันทึก
- heroEmoji ใส่ให้เหมาะ

เขียน JSON ให้ valid แล้ว return สรุปสั้น ๆ`
}

const res = await parallel(MISSING.map(([slug,type,focus]) => () =>
  agent(prompt(slug,type,focus), { label:`recover:${slug}`, phase:'Recover' })
    .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered: ${ok}/${MISSING.length}`)
return { total: MISSING.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

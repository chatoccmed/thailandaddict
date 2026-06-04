export const meta = {
  name: 'kanchanaburi-articles-recover',
  description: 'Recover 7 missing Kanchanaburi Plan-phase articles',
  phases: [ { title: 'Recover', detail: '7 missing itineraries' } ],
}

const MISSING = [
  ['sangkhlaburi-plan','แผนสังขละบุรี สะพานมอญและวิถีมอญ 2 วัน ใช้ block day'],
  ['kanchanaburi-cafe-raft-plan','แผนสายคาเฟ่และนอนแพริมแม่น้ำแคว ใช้ block day'],
  ['kanchanaburi-photo-spots-plan','แผนสายถ่ายรูปลง social (สะพาน ถ้ำกระแซ เอราวัณ สะพานมอญ) ใช้ block day'],
  ['nakhon-pathom-kanchanaburi-day-trip','แผนข้ามจังหวัด นครปฐม–กาญจนบุรี องค์พระ–สะพานข้ามแม่น้ำแคว ใช้ block day'],
  ['kanchanaburi-ratchaburi-plan','แผนข้ามจังหวัด กาญจนบุรี–ราชบุรี ตลาด-ถ้ำ-คาเฟ่ ใช้ block day'],
  ['kanchanaburi-family-plan','แผนเที่ยวครอบครัว/มีเด็ก (น้ำตกเล่นน้ำ นอนแพ รถไฟ) ใช้ block day'],
  ['kanchanaburi-first-timer-guide','มากาญจนบุรีครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const siblingList = 'kanchanaburi-attractions, bridge-river-kwai-guide, erawan-waterfall-guide, kanchanaburi-2d1n-itinerary, kanchanaburi-nature-plan, kanchanaburi-history-plan, kanchanaburi-food-guide'

function prompt(slug, focus){
  return `เขียนบทความท่องเที่ยวกาญจนบุรีลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json
ค่าบังคับ: slug="${slug}", type="itinerary", cluster="kanchanaburi", crumbCity="กาญจนบุรี", crumbCityHref="city-kanchanaburi.html"

วิธีเขียน:
- อ่าน .claude/agents/tourlogy-attraction-writer.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง — ถ้า WebFetch ค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง ใช้ความรู้ที่เชื่อถือได้แทน
- โทน v2-clean: ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- itinerary→ใช้ "day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน)
- ต้องมี chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-kanchanaburi.html, top10-hotels-kanchanaburi.html + พี่น้อง 1 จาก: ${siblingList})
- ⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำ ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน ไหม ถ้ามีแก้ให้หมด
- heroEmoji เหมาะสม · เขียน JSON valid · ต้อง Write ไฟล์จริงก่อนจบ`
}

const res = await parallel(MISSING.map(([slug,focus]) => () =>
  agent(prompt(slug,focus), { label:`recover:${slug}`, phase:'Recover' })
    .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered: ${ok}/${MISSING.length}`)
return { total: MISSING.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

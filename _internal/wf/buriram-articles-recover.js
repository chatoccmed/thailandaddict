export const meta = {
  name: 'buriram-articles-recover',
  description: 'Recover the 7 missing Buriram articles (Plan tail + Prep) after the main workflow hung',
  phases: [
    { title: 'Plan', detail: 'cross-province + family + first-timer itineraries' },
    { title: 'Prep', detail: 'travel-tips + getting-around' },
  ],
}

const PLAN = [
  ['buriram-korat-temple-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–นครราชสีมา ทริปปราสาทขอมอีสานใต้ ใช้ block day'],
  ['buriram-surin-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–สุรินทร์ ปราสาทและหมู่บ้านช้าง ใช้ block day'],
  ['buriram-khon-kaen-plan','itinerary','แผนข้ามจังหวัด บุรีรัมย์–ขอนแก่น เที่ยวอีสานสองเมือง ใช้ block day'],
  ['buriram-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เพลาเพลิน เขากระโดง สนามกีฬา คาเฟ่) ใช้ block day'],
  ['buriram-first-timer-guide','itinerary','มาบุรีรัมย์ครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['buriram-travel-tips','prep','เตรียมตัวเที่ยวบุรีรัมย์ (ช่วงเวลาดีสุด ปรากฏการณ์แสงลอดพนมรุ้ง วันแข่งบอล/แข่งรถ อากาศ งบ การแต่งตัว)'],
  ['buriram-getting-around','prep','การเดินทางในบุรีรัมย์ (รถไฟ/สนามบินบุรีรัมย์/บขส. เช่ารถ ไปพนมรุ้ง-เมืองต่ำยังไง ระยะทางจากกรุงเทพ-โคราช)'],
]

const SIBLINGS = 'buriram-isan-food, prakhon-chai-kung-jom, buriram-mookata, buriram-cafe-guide, buriram-attractions, phanom-rung-historical-park, prasat-muang-tam, chang-arena-buriram, chang-international-circuit, khao-kradong-volcano, buriram-1-day-itinerary, buriram-2d1n-itinerary, buriram-3d2n-itinerary, buriram-temple-circuit-plan, buriram-football-weekend-plan, buriram-nature-plan, buriram-photo-spots-plan'

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวบุรีรัมย์ ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="buriram", crumbCity="บุรีรัมย์", crumbCityHref="city-buriram.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง (WebSearch/WebFetch) — ⚠️ ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน) · ทำงานให้เสร็จไว
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- itinerary→ใช้ block "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; prep→h2/p/list/tip
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ · chips 2-3, faq 3-5 (q/a จริง), related 2-3 (อย่างน้อย city-buriram.html และ top10-hotels-buriram.html + พี่น้อง 1 จาก: ${SIBLINGS})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึก ค้นไฟล์ตัวเองว่ามีคำต้องห้าม: ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน — ถ้ามีแก้เป็นคำธรรมชาติแบบ v2-clean ก่อนบันทึก
เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ`
}

let done = []
for (const [ph, list] of [['Plan',PLAN],['Prep',PREP]]) {
  log(`Phase ${ph}: ${list.length} articles`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,'tourlogy-attraction-writer'), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Recovered articles: ${ok}/${done.length}`)
return { ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

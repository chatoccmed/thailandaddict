export const meta = {
  name: 'trat-articles-recover',
  description: 'Recover 12 missing Trat Plan+Prep articles',
  phases: [ { title: 'Recover', detail: '12 missing articles' } ],
}

const MISSING = [
  ['trat-3d2n-itinerary','itinerary','แผนตราด 3 วัน 2 คืน เกาะช้าง+น้ำตก+หาด ใช้ block day'],
  ['koh-chang-plan','itinerary','แผนเที่ยวเกาะช้าง หาด–น้ำตก–รอบเกาะ ใช้ block day'],
  ['koh-kood-koh-mak-plan','itinerary','แผนสายเกาะเงียบ เกาะกูด–เกาะหมาก นอนยาว ๆ ใช้ block day'],
  ['trat-nature-plan','itinerary','แผนสายธรรมชาติ น้ำตกและหาดเกาะช้าง ใช้ block day'],
  ['trat-old-town-cafe-plan','itinerary','แผนสายเมืองเก่าและคาเฟ่ ริมคลองบางพระ ใช้ block day'],
  ['trat-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (เกาะ หาด น้ำตก สะพานไม้เกาะกูด) ใช้ block day'],
  ['chanthaburi-trat-plan','itinerary','แผนข้ามจังหวัด จันทบุรี–ตราด เลาะทะเลตะวันออกสุดเขตแดน ใช้ block day'],
  ['trat-food-souvenir-plan','itinerary','แผนสายของกิน ซีฟู้ด–กะปิคลองใหญ่–ผลไม้ ใช้ block day'],
  ['trat-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (หาดน้ำตื้น น้ำตก เกาะหมาก) ใช้ block day'],
  ['trat-first-timer-guide','itinerary','มาตราดครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
  ['trat-travel-tips','prep','เตรียมตัวเที่ยวตราด (ช่วงเวลาดีสุด เกาะปิดหน้าฝน มิ.ย.-ก.ย. การจองเรือ งบ ซิม)'],
  ['trat-getting-around','prep','การเดินทางตราด (จากกรุงเทพ รถตู้/บัส สนามบินตราด ท่าเรือแหลมงอบ/อ่าวธรรมชาติ เรือไปเกาะ)'],
]
const siblingList = 'trat-attractions, koh-chang-guide, koh-kood-guide, trat-seafood, trat-food-guide, trat-2d1n-itinerary, trat-cafe-guide'

function prompt(slug, type, focus){
  return `เขียนบทความท่องเที่ยวตราดลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างเป๊ะที่ _internal/templates/article.sample.json
ค่าบังคับ: slug="${slug}", type="${type}", cluster="trat", crumbCity="ตราด", crumbCityHref="city-trat.html"

วิธีเขียน:
- อ่าน .claude/agents/tourlogy-attraction-writer.md เป็นแนวมาตรฐาน แต่ OUTPUT เป็น articleSchema JSON ของเรา
- วิจัยเว็บจริง — ถ้า WebFetch ค้าง/ช้าผิดปกติ ให้ข้ามทันที อย่ารอจนค้าง ใช้ความรู้ที่เชื่อถือได้แทน
- โทน v2-clean: ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- itinerary→ใช้ "day" (label "วันที่ 1", time–activity–note อย่างน้อย 2-3 วัน); prep→h2/p/list/tip
- ต้องมี chips 2-3, faq 3-5, related 2-3 (อย่างน้อย city-trat.html, top10-hotels-trat.html + พี่น้อง 1 จาก: ${siblingList})
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

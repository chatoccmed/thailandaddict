export const meta = {
  name: 'khon-kaen-articles-recover',
  description: 'Recover 3 Khon Kaen food articles the first articles workflow reported ok but did not write to disk',
  phases: [
    { title: 'Food', detail: '3 missing eat-ranking food articles' },
  ],
}

const FOOD = [
  ['khon-kaen-cafe-guide','eat-ranking','จัดอันดับคาเฟ่ขอนแก่น ในเมืองและรอบ ม.ขอนแก่น นั่งทำงาน ถ่ายรูป'],
  ['khon-kaen-noodle-shops','eat-ranking','ร้านก๋วยเตี๋ยวและก๋วยจั๊บญวนเส้นใหญ่เด็ด ๆ ในขอนแก่น'],
  ['khon-kaen-dessert-cafe','eat-ranking','ของหวาน เบเกอรี คาเฟ่ขนมในเมืองขอนแก่น'],
]

const ALL = FOOD
const siblingList = 'khon-kaen-isan-food, khon-kaen-grilled-chicken-somtam, khon-kaen-mookata-jimjum, khao-niao-road-street-food, khon-kaen-local-breakfast, khon-kaen-mum-sausage, khon-kaen-souvenir-food, khon-kaen-night-market, bueng-kaen-nakhon, wat-nong-waeng'

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวขอนแก่น ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ตรวจให้แน่ใจว่าเขียนไฟล์สำเร็จจริง — ls -l ยืนยันก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="khon-kaen", crumbCity="ขอนแก่น", crumbCityHref="city-khon-kaen.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง**
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- eat-ranking → ใช้ block "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags)
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-khon-kaen.html และ top10-hotels-khon-kaen.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked items + ยืนยัน path ไฟล์`
}

log(`Recover Food: ${FOOD.length} articles`)
const res = await parallel(FOOD.map(([slug,type,focus]) => () =>
  agent(prompt(slug,type,focus,'tourlogy-food-writer'), { label:`Food:${slug}`, phase: 'Food' })
    .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
))
const ok = res.filter(x=>x&&x.ok).length
log(`Recovered: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: res.filter(x=>!x||!x.ok).map(x=>x&&x.slug) }

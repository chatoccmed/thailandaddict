export const meta = {
  name: 'sa-kaeo-articles',
  description: 'Sa Kaeo (สระแก้ว) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (Rong Kluea market + Khmer temples + Pang Sida + Lalu)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['sa-kaeo-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานสระแก้ว ส้มตำ ลาบ ก้อย ไก่ย่าง ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['aranyaprathet-street-food','eat-ranking','ของกินอรัญประเทศและริมตลาดโรงเกลือ ก๋วยเตี๋ยว ข้าวแกง ของกินข้างทาง แวะชิมระหว่างเดินช้อปชายแดน'],
  ['sa-kaeo-cafe-guide','eat-ranking','คาเฟ่สระแก้ว ในเมืองและอรัญประเทศ นั่งชิล กาแฟดี ถ่ายรูป แวะพักระหว่างเที่ยว'],
  ['sa-kaeo-mookata','eat-ranking','หมูกระทะสระแก้ว ร้านยอดนิยมในเมือง คุ้มราคา มื้อเย็นนัดกันเป็นกลุ่ม'],
  ['sa-kaeo-cambodian-food','food','อาหารชายแดนสไตล์กัมพูชาสระแก้ว ก๋วยเตี๋ยวน้ำใส ขนมและของกินที่ได้อิทธิพลจากฝั่งปอยเปต'],
  ['wang-nam-yen-melon','food','เมล่อนและผลไม้วังน้ำเย็นสระแก้ว สวนเมล่อนให้แวะซื้อสด ของแปรรูปเป็นของฝาก ช่วงเวลา ราคา'],
  ['sa-kaeo-street-food','food','สตรีทฟู้ดและตลาดเย็นสระแก้ว ของกินเล่นอีสาน ของย่าง ของทอด เดินชิมยามค่ำ'],
  ['sa-kaeo-local-breakfast','food','อาหารเช้าแบบคนสระแก้ว (ข้าวเหนียวหมูปิ้ง ก๋วยเตี๋ยว ข้าวต้ม กาแฟ ตลาดเช้า)'],
  ['sa-kaeo-freshwater-fish','eat-ranking','ปลาน้ำจืดและกุ้งฝอยสระแก้ว แถบอ่างเก็บน้ำและลำคลอง ต้ม ทอด ยำ ตามร้านอาหารพื้นถิ่น ร้านเด็ด'],
  ['sa-kaeo-souvenir-food','food','ของฝากกินได้สระแก้ว (เมล่อนวังน้ำเย็น ของแปรรูป ของหมักพื้นบ้าน แหล่งซื้อ)'],
  ['sa-kaeo-local-dessert','food','ของหวานและขนมพื้นถิ่นสระแก้ว ขนมอีสาน ขนมสไตล์เขมร ของกินเล่นตามตลาด'],
]
const SEE = [
  ['sa-kaeo-attractions','attraction','รวมที่เที่ยวสระแก้วที่ต้องไป คละตลาดโรงเกลือ/ปราสาทสด๊กก๊อกธม/เขาฉกรรจ์/ปางสีดา/ละลุ (ภาพรวม + cards)'],
  ['rong-kluea-market','attraction','ตลาดโรงเกลือ อรัญประเทศ ตลาดชายแดนขนาดใหญ่ติดด่านคลองลึก เสื้อผ้ามือสอง กระเป๋า ของราคาถูก เวลา การต่อรอง'],
  ['sdok-kok-thom','attraction','ปราสาทสด๊กก๊อกธม ปราสาทหินขอมหลังใหญ่ที่สุดในภาคตะวันออก บูรณะสวยงาม ศูนย์ข้อมูลอารยธรรมขอม การเดินทาง'],
  ['prasat-khao-noi-si-chomphu','attraction','ปราสาทเขาน้อยสีชมพู ปราสาทขอมเก่าบนเนินเขาอรัญประเทศ ขึ้นบันไดชมโบราณสถานและวิวรอบ ๆ'],
  ['pang-sida-national-park','attraction','อุทยานแห่งชาติปางสีดา ผืนป่ามรดกโลกดงพญาเย็น-เขาใหญ่ น้ำตกปางสีดา น้ำตกผาตะเคียน ฤดูผีเสื้อต้นหน้าฝน'],
  ['khao-chakan','attraction','เขาฉกรรจ์ ภูเขาหินปูนมีถ้ำ วัด และฝูงค้างคาวนับล้านบินออกตอนเย็น จุดชมธรรมชาติใกล้ตัวเมือง'],
  ['lalu','attraction','ละลุ ตาพระยา ภูมิประเทศดินถูกกัดเซาะเป็นแท่งและหน้าผาคล้ายแพะเมืองผี นั่งรถอีแต๋นชม ช่วงเวลาที่เหมาะ'],
  ['ta-phraya-national-park','attraction','อุทยานแห่งชาติตาพระยา ผืนป่าแนวเทือกเขาบรรทัดติดชายแดน จุดชมวิว ธรรมชาติเงียบ รอยต่อปราสาทขอม'],
  ['khlong-luek-poipet-border','attraction','ด่านชายแดนคลองลึก-ปอยเปต จุดข้ามแดนไทย-กัมพูชาติดตลาดโรงเกลือ ทางผ่านไปเสียมเรียบ-นครวัด ข้อควรรู้'],
  ['sa-kaeo-sa-khwan','attraction','สระแก้ว-สระขวัญ สระน้ำโบราณคู่เมืองที่มาของชื่อจังหวัด ในตัวเมือง จุดเล่าประวัติและพักผ่อนของคนท้องถิ่น'],
  ['sa-kaeo-khmer-temple-trail','attraction','เส้นทางปราสาทขอมสระแก้ว สด๊กก๊อกธม-เขาน้อยสีชมพู เที่ยวประวัติศาสตร์อารยธรรมขอมภาคตะวันออก'],
  ['sa-kaeo-nature','attraction','ธรรมชาติสระแก้ว ปางสีดา เขาฉกรรจ์ ละลุ ตาพระยา ป่าเขาน้ำตกและภูมิประเทศแปลกตาในจังหวัด'],
]
const PLAN = [
  ['sa-kaeo-1-day-itinerary','itinerary','แผนเที่ยวสระแก้ว 1 วัน ตลาดโรงเกลือ-ปราสาทสด๊กก๊อกธม วันเดียว ใช้ block day'],
  ['sa-kaeo-2d1n-itinerary','itinerary','แผนสระแก้ว 2 วัน 1 คืน ตลาดโรงเกลือ-ปราสาทขอม-เขาฉกรรจ์ ใช้ block day'],
  ['sa-kaeo-3d2n-itinerary','itinerary','แผนสระแก้ว 3 วัน 2 คืน ช้อปชายแดน+ปราสาท+ปางสีดา+ละลุ ใช้ block day'],
  ['sa-kaeo-border-shopping-plan','itinerary','แผนสายช้อปชายแดน เดินตลาดโรงเกลือ-ด่านคลองลึก เทคนิคต่อรองและของน่าซื้อ ใช้ block day'],
  ['sa-kaeo-nature-plan','itinerary','แผนสายธรรมชาติ ปางสีดา-เขาฉกรรจ์-ละลุ ใช้ block day'],
  ['sa-kaeo-khmer-history-plan','itinerary','แผนสายประวัติศาสตร์ ตามรอยปราสาทขอม สด๊กก๊อกธม-เขาน้อยสีชมพู ใช้ block day'],
  ['sa-kaeo-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (ละลุ ปราสาทขอม ปางสีดา ตลาดโรงเกลือ) ใช้ block day'],
  ['sa-kaeo-prachinburi-plan','itinerary','แผนข้ามจังหวัด สระแก้ว–ปราจีนบุรี เลาะตะวันออกเที่ยวป่าและปราสาท ใช้ block day'],
  ['bangkok-sa-kaeo-siem-reap','itinerary','แผนกรุงเทพ-สระแก้ว แวะเที่ยวก่อนข้ามแดนไปเสียมเรียบ-นครวัด ใช้ block day'],
  ['sa-kaeo-family-plan','itinerary','แผนเที่ยวครอบครัว/มีเด็ก (เขาฉกรรจ์ดูค้างคาว ปางสีดาน้ำตก สวนเมล่อน คาเฟ่) ใช้ block day'],
  ['sa-kaeo-pang-sida-butterfly-plan','itinerary','แผนทริปฤดูผีเสื้อปางสีดา ต้นหน้าฝน มิ.ย.-ก.ค. น้ำตกและผีเสื้อ ใช้ block day'],
  ['sa-kaeo-first-timer-guide','itinerary','มาสระแก้วครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['sa-kaeo-travel-tips','prep','เตรียมตัวเที่ยวสระแก้ว (ช่วงเวลาดีสุด หน้าหนาวเดินตลาด-เที่ยวปราสาท หน้าฝนน้ำตกปางสีดาสวย ฤดูผีเสื้อ การข้ามแดน งบ การแต่งตัว)'],
  ['sa-kaeo-getting-around','prep','การเดินทางในสระแก้ว (รถทัวร์/รถไฟกรุงเทพ-อรัญประเทศ เช่ารถ ไปปางสีดา-ละลุ-ตาพระยายังไง ระยะทาง การข้ามด่านคลองลึก)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสระแก้ว ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="sa-kaeo", crumbCity="สระแก้ว", crumbCityHref="city-sa-kaeo.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน) · เรื่องการข้ามแดน/ชายแดนให้บอกตรงว่าควรเช็กสถานการณ์และเอกสารก่อนไปจริง
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-sa-kaeo.html และ top10-hotels-sa-kaeo.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

const existing = new Set(args && args.existingArticles ? args.existingArticles : [])

let done = []
for (const group of [['Food',FOOD],['See',SEE],['Plan',PLAN],['Prep',PREP]]) {
  const [ph, fullList] = group
  const list = fullList.filter(([slug]) => !existing.has(slug))
  const ref = ph==='Food' ? 'tourlogy-food-writer' : 'tourlogy-attraction-writer'
  if (!list.length) { log(`Phase ${ph}: all ${fullList.length} already exist — skip`); continue }
  log(`Phase ${ph}: ${list.length} articles (skipped ${fullList.length-list.length} existing)`)
  const res = await parallel(list.map(([slug,type,focus]) => () =>
    agent(prompt(slug,type,focus,ref), { label:`${ph}:${slug}`, phase: ph })
      .then(()=>({slug, ok:true})).catch(()=>({slug, ok:false}))
  ))
  done.push(...res.filter(Boolean))
}
const ok = done.filter(x=>x.ok).length
log(`Articles written: ${ok}/${ALL.length}`)
return { total: ALL.length, ok, failed: done.filter(x=>!x.ok).map(x=>x.slug) }

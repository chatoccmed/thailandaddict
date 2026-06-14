export const meta = {
  name: 'port-cm-articles',
  description: 'Port 6 genuinely-new CM food/travel old posts → new article-schema pages (the other 10 redirect to existing articles)',
  phases: [ { title: 'Write', detail: '6 new CM articles (food/attraction), hero image each' } ],
}

const TH = 'เชียงใหม่', CITY = 'chiang-mai';
const STYLE = `สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกตามจริง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · ข้อมูลอัปเดตปัจจุบัน (ค้นเว็บยืนยันร้าน/สถานที่เปิดจริง ปิดแล้วหาตัวแทนจริง)`;

// 6 new articles: genuinely-new topics not covered by the existing 39 CM articles.
const ART = [
  { slug:'chiang-mai-khao-soi', old:'top-10-khao-soi-at-chiang-mai', type:'food', writer:'food',
    title:'10 ร้านข้าวซอยเด็ดในเชียงใหม่', focus:'ร้านข้าวซอยในตำนาน+ร้านใหม่ ทั้งในเมืองและรอบเมือง · ราคา/เวลาเปิด/เมนูเด่น' },
  { slug:'chiang-mai-out-of-town-dining', old:'top-ten-restaurant-coffee-shop', type:'food', writer:'food',
    title:'10 ร้านอาหารนอกเมืองเชียงใหม่ วิวดี บรรยากาศดี', focus:'ร้านอาหาร/คาเฟ่นอกเมือง (แม่ริม สันกำแพง หางดง ดอยสะเก็ด) วิวภูเขา/นา/น้ำ' },
  { slug:'chiang-mai-doi-angkhang-road-trip', old:'chiang-mai-road-trip-doi-angkhang', type:'itinerary', writer:'attraction',
    title:'ขับรถเที่ยวดอยอ่างขาง เส้นทางเชียงใหม่–ดอยอ่างขาง', focus:'road trip ดอยอ่างขาง: เส้นทาง จุดแวะ ที่เที่ยว ที่พัก ข้อควรระวังเส้นทางเขา ฤดูที่เหมาะ' },
  { slug:'chiang-mai-new-attractions', old:'top10-new-opening-travel-place-in-chiang-mai', type:'attraction', writer:'attraction',
    title:'10 ที่เที่ยวเปิดใหม่ในเชียงใหม่ เที่ยวไม่ซ้ำใคร', focus:'สถานที่เที่ยว/คาเฟ่/แลนด์มาร์กเปิดใหม่ที่ยังเปิดจริงปัจจุบัน' },
  { slug:'chiang-mai-kid-attractions', old:'top10-kid-travel-place-chiang-mai', type:'attraction', writer:'attraction',
    title:'10 ที่เที่ยวสำหรับเด็กในเชียงใหม่ ครอบครัวไปได้', focus:'ที่เที่ยวเด็ก/ครอบครัว: ฟาร์มสัตว์ พิพิธภัณฑ์ สวนสนุก แหล่งเรียนรู้' },
  { slug:'chiang-mai-ev-road-trip', old:'ev-road-trip-bangkok-to-chiang-mai', type:'guide', writer:'attraction',
    title:'EV Road Trip กรุงเทพ–เชียงใหม่ จุดชาร์จ เส้นทาง', focus:'ขับ EV กรุงเทพ→เชียงใหม่: เส้นทาง จุดชาร์จจริงระหว่างทาง เวลา ระยะ การวางแผนชาร์จ ที่แวะ' },
];

phase('Write')
const written = await parallel(ART.map(A => () =>
  agent(`เขียนบทความใหม่สไตล์เรา "${A.title}" จังหวัด${TH} (พอร์ตจากโพสต์เดิม ${A.old} เขียนใหม่ทั้งหมด ไม่ลอก)
อ่านก่อน: _internal/migration/oldposts/${A.old}.txt (วัตถุดิบเดิม — ดึงชื่อร้าน/สถานที่มาตั้งต้น แล้วค้นเว็บอัปเดต) + .claude/agents/tourlogy-${A.writer}-writer.md + articleSchema ใน astro/src/content.config.ts + ดูบทความ CM ที่มีอยู่เป็นโครง (เช่น astro/src/content/articles/chiang-mai-street-food.json หรือ chiang-mai-attractions.json)
โฟกัส: ${A.focus}
OUTPUT: astro/src/content/articles/${A.slug}.json (ไทยอย่างเดียว — EN ทีหลัง) ครบ articleSchema ทุก field
- slug="${A.slug}" · type="${A.type}" · cluster="${CITY}" · crumbCity="${TH}" · crumbCityHref="city-${CITY}.html" · regionLabel/regionHref ภาคเหนือ
- blocks: ≥12 บล็อก ผสม h2/p/ranked/tip/cards/day/cta · ต้องมี ranked list รายการจริง (ชื่อ/blurb/meta/price/tags) · faq ≥5 · related ≥4 ลิงก์ไปบทความ/รีวิว CM ที่มีอยู่จริง (ตรวจไฟล์ก่อนลิงก์ใน astro/src/content/articles|reviews|roundups)
- **dedup:** อย่าซ้ำเนื้อหากับบทความ CM เดิม — เสริม/ลิงก์หากันแทน (เช่น khao-soi อย่าเขียนทับ chiang-mai-northern-cuisine/food-guide แต่ลิงก์ถึง)
- รูป hero: curl -m 60 -A "Mozilla/5.0" รูปจริงไป astro/public/images/cm/${A.slug}.jpg (Bash dangerouslyDisableSandbox:true) แล้ว node _internal/optimize-images.mjs astro/public/images/cm/${A.slug}.jpg · ตั้ง heroImg="/images/cm/${A.slug}.jpg"
${STYLE}
⚠️ ก่อนเสร็จ: node -e ตรวจ JSON.parse ได้ + ค้นคำต้องห้าม=0 + related/ลิงก์ทั้งหมดชี้ไฟล์ที่มีจริง · return: ok + จำนวน blocks`,
    { label:`art:${A.slug}`, phase:'Write' })
    .then(()=>({slug:A.slug,ok:true})).catch(e=>({slug:A.slug,ok:false,e:String(e).slice(0,80)}))
))
log(`Articles written: ${written.filter(x=>x&&x.ok).length}/${ART.length}`)
return { written: written.filter(x=>x&&x.ok).map(x=>x.slug), failed: written.filter(x=>x&&!x.ok) }

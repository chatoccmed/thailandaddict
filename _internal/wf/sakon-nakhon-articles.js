export const meta = {
  name: 'sakon-nakhon-articles',
  description: 'Sakon Nakhon (สกลนคร) gold template — food / attractions / itineraries / prep (37 articles, v2-clean Thai, articleSchema JSON)',
  phases: [
    { title: 'Food', detail: '11 food articles incl. ranked-by-cuisine' },
    { title: 'See', detail: '12 attraction articles (temple + lake + indigo + Phu Phan)' },
    { title: 'Plan', detail: '12 itineraries (in-province + cross-province + themed)' },
    { title: 'Prep', detail: '2 preparation guides' },
  ],
}

const FOOD = [
  ['sakon-nakhon-isan-food','eat-ranking','จัดอันดับร้านอาหารอีสานสกลนคร ส้มตำ ลาบ ก้อย ไก่ย่าง ซุปหน่อไม้ ที่คนท้องถิ่นไปจริง (พร้อมย่าน/ราคา/เมนูเด็ด)'],
  ['phon-yang-kham-beef','eat-ranking','เนื้อโคขุนโพนยางคำสกลนคร ร้านสเต๊ก ปิ้งย่าง จิ้มจุ่ม เนื้อนุ่มมันจากสหกรณ์'],
  ['nong-han-freshwater-fish','eat-ranking','ร้านปลาน้ำจืดหนองหารสกลนคร ปลาเผา ต้มยำ ลาบปลา นั่งรับลมริมทะเลสาบ'],
  ['sakon-nakhon-vietnamese-food','eat-ranking','ร้านอาหารเวียดนามสกลนคร แหนมเนือง หมูยอ ข้าวเปียกเส้น ร้านที่คนท้องถิ่นไป'],
  ['sakon-nakhon-cafe-guide','eat-ranking','คาเฟ่สกลนคร ในเมืองและริมหนองหาร นั่งชิล ถ่ายรูป กาแฟดี'],
  ['sakon-nakhon-local-breakfast','food','อาหารเช้าแบบคนสกล (ข้าวปุ้น ข้าวเปียกเส้น กาแฟ ตลาดเช้า)'],
  ['sakon-nakhon-mookata','eat-ranking','หมูกระทะและปิ้งย่างสกลนคร ร้านยอดนิยม คุ้มราคา'],
  ['sakon-nakhon-street-food','food','สตรีทฟู้ดและถนนคนเดินสกลนคร ของย่าง ของทอด ขนมพื้นถิ่น เดินชิมยามค่ำ'],
  ['sakon-nakhon-local-dessert','food','ของหวานและขนมพื้นถิ่นสกล ข้าวปุ้น ขนมจีนน้ำยาป่า ขนมอีสาน'],
  ['sakon-nakhon-souvenir-food','food','ของฝากกินได้สกลนคร (หมูยอ แหนม เนื้อแดดเดียวโคขุน แหล่งซื้อ)'],
  ['sakon-nakhon-night-market','food','ตลาดเย็นและตลาดในเมืองสกลนคร เดินกินของอีสาน-เวียดนามยามค่ำ'],
]
const SEE = [
  ['sakon-nakhon-attractions','attraction','รวมที่เที่ยวสกลนครที่ต้องไป คละพระธาตุ/หนองหาร/ผ้าคราม/ภูพาน/พระป่า (ภาพรวม + cards)'],
  ['wat-phra-that-choeng-chum','attraction','วัดพระธาตุเชิงชุมวรวิหาร พระธาตุคู่เมือง เจดีย์สี่เหลี่ยมสีขาว การกราบไหว้ ประวัติ'],
  ['nong-han-lake','attraction','หนองหารและสวนเฉลิมพระเกียรติ ทะเลสาบน้ำจืดติดเมือง เดินเล่น ปั่นจักรยาน นั่งรับลมเย็น'],
  ['phu-phan-national-park','attraction','อุทยานแห่งชาติภูพาน น้ำตก ถ้ำ จุดชมวิว อากาศเย็นหน้าหนาว ขับรถเที่ยว'],
  ['ajahn-mun-museum','attraction','พิพิธภัณฑ์อาจารย์มั่น ภูริทัตโต วัดป่าสุทธาวาส อัฐิและอัฐบริขารหลวงปู่มั่น พระป่าสายอีสาน'],
  ['phu-phan-rajanivet-palace','attraction','พระตำหนักภูพานราชนิเวศน์ สวนดอกไม้และป่าร่มรื่น อากาศเย็น เปิดให้เข้าชมเมื่อไม่แปรพระราชฐาน'],
  ['ban-tha-wat-indigo','attraction','บ้านท่าวัดและชุมชนย้อมคราม ดูขั้นตอนหมักครามและทอผ้า เลือกซื้อผ้าครามจากมือคนทำ'],
  ['kham-hom-waterfall','attraction','น้ำตกคำหอม เขตภูพานใกล้เมือง หน้าฝนน้ำไหลแรงเป็นชั้น ร่มรื่น เล่นน้ำพักธรรมชาติ'],
  ['wat-tham-pha-daen','attraction','วัดถ้ำผาแด่น วัดบนภูเขา งานแกะสลักหินผาพุทธประวัติและวิถีอีสาน จุดชมวิวเมืองกว้าง'],
  ['sakon-indigo-craft','attraction','ผ้าครามย้อมมือสกลนคร งานคราฟต์ขึ้นชื่อ สีครามจากหม้อหมักธรรมชาติ แหล่งซื้อและเรียนรู้'],
  ['sakon-wax-castle-festival','attraction','งานแห่ปราสาทผึ้งสกลนคร ประเพณีออกพรรษา ปราสาทขี้ผึ้งวิจิตรและแข่งเรือยาวหนองหาร'],
  ['wat-pa-udom-somphon','attraction','วัดป่าอุดมสมพร พรรณานิคม หลวงปู่ฝั้น อาจาโร เจดีย์พิพิธภัณฑ์ พระป่าสายกรรมฐาน'],
]
const PLAN = [
  ['sakon-nakhon-1-day-itinerary','itinerary','แผนเที่ยวสกลนคร 1 วัน พระธาตุเชิงชุม-หนองหาร-เมือง ใช้ block day'],
  ['sakon-nakhon-2d1n-itinerary','itinerary','แผนสกลนคร 2 วัน 1 คืน เมือง-พระธาตุเชิงชุม-หนองหาร-ผ้าคราม ใช้ block day'],
  ['sakon-nakhon-3d2n-itinerary','itinerary','แผนสกลนคร 3 วัน 2 คืน เมือง+ภูพาน+ผ้าคราม+พระป่า ใช้ block day'],
  ['sakon-indigo-craft-plan','itinerary','แผนสายผ้าคราม ตระเวนชุมชนย้อมครามและช้อปผ้า ใช้ block day'],
  ['sakon-nakhon-nature-plan','itinerary','แผนสายธรรมชาติ ภูพาน-น้ำตกคำหอม-วัดถ้ำผาแด่น ใช้ block day'],
  ['sakon-forest-temple-plan','itinerary','แผนสายพระป่า วัดป่าสุทธาวาส-พิพิธภัณฑ์หลวงปู่มั่น-วัดป่าอุดมสมพร ใช้ block day'],
  ['sakon-lake-city-plan','itinerary','แผนสายเมือง-ทะเลสาบ หนองหาร-พระธาตุเชิงชุม-คาเฟ่ริมน้ำ ใช้ block day'],
  ['sakon-nakhon-photo-spots-plan','itinerary','แผนสายถ่ายรูปลง social (วัดถ้ำผาแด่น หนองหาร ผ้าคราม พระธาตุ) ใช้ block day'],
  ['sakon-nakhon-phanom-plan','itinerary','แผนข้ามจังหวัด สกลนคร–นครพนม เส้นทางพระธาตุและริมโขง ใช้ block day'],
  ['sakon-udon-plan','itinerary','แผนข้ามจังหวัด สกลนคร–อุดรธานี เที่ยวอีสานตอนบนสองเมือง ใช้ block day'],
  ['sakon-kalasin-plan','itinerary','แผนข้ามจังหวัด สกลนคร–กาฬสินธุ์ ไดโนเสาร์สหัสขันธ์ ใช้ block day'],
  ['sakon-nakhon-first-timer-guide','itinerary','มาสกลนครครั้งแรกต้องรู้อะไร + แผนแนะนำ ใช้ block day/list'],
]
const PREP = [
  ['sakon-nakhon-travel-tips','prep','เตรียมตัวเที่ยวสกลนคร (ช่วงเวลาดีสุด งานแห่ปราสาทผึ้งออกพรรษา การเที่ยวภูพาน ผ้าคราม อากาศ งบ การแต่งตัว)'],
  ['sakon-nakhon-getting-around','prep','การเดินทางในสกลนคร (สนามบินสกลนคร/บขส. เช่ารถ ขึ้นภูพาน ไปชุมชนย้อมคราม ระยะทางจากกรุงเทพ)'],
]

const ALL = [...FOOD, ...SEE, ...PLAN, ...PREP]
const siblingList = ALL.map(a=>a[0]).join(', ')

function prompt(slug, type, focus, ref){
  return `เขียนบทความท่องเที่ยวสกลนคร ลง thailandaddict.com — หัวข้อ: ${focus}

OUTPUT (บังคับ): เขียนไฟล์ JSON เดียวด้วย Write ที่ astro/src/content/articles/${slug}.json (ยืนยันด้วย ls -l ว่าไฟล์ถูกเขียนจริงก่อนจบงาน)
ต้องตรง schema "articleSchema" ใน astro/src/content.config.ts — ดูตัวอย่างรูปแบบเป๊ะที่ _internal/templates/article.sample.json (ศึกษา block ทุกชนิด: h2/p/list/tip/ranked/cards/day/cta)
ค่าบังคับ: slug="${slug}", type="${type}", cluster="sakon-nakhon", crumbCity="สกลนคร", crumbCityHref="city-sakon-nakhon.html"

วิธีเขียน:
- อ่าน .claude/agents/${ref}.md เป็นแนวมาตรฐาน "การเขียน/วิจัย/EEAT" แต่ OUTPUT ต้องเป็น articleSchema JSON ของเรา (ไม่ใช่ฟอร์แมตเดิมในไฟล์นั้น)
- วิจัยเว็บจริง (WebSearch/WebFetch) หา ร้าน/สถานที่ ที่ "เปิดอยู่จริงตอนนี้" — ใส่ชื่อจริง ย่านจริง ราคาโดยประมาณจริง · **ถ้า WebFetch หน้าไหนค้าง/ช้าผิดปกติ ให้ข้ามหน้านั้นทันที อย่ารอจนค้าง** (ใช้ผลที่หาได้ + ความรู้ที่เชื่อถือได้แทน)
- โทน v2-clean: เพื่อนเล่าให้เพื่อน ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty บอกตรง
- เลือก block ให้เหมาะชนิด: ranking/อาหาร→ใช้ "ranked" (ร้านจริง 8-12 อันดับ พร้อม meta/price/tags); itinerary→ใช้ "day" (label เช่น "วันที่ 1", time–activity–note) อย่างน้อย 2-3 วันตามหัวข้อ; attraction→h2/p/list/tip/cards
- ความยาวดี เนื้อแน่น มี h2 หลายหัวข้อ
- ต้องมี: chips 2-3, faq 3-5 (q/a จริง), related 2-3 ลิงก์ (อย่างน้อย city-sakon-nakhon.html และ top10-hotels-sakon-nakhon.html + บทความพี่น้อง 1 จากรายการนี้: ${siblingList})
- heroEmoji ใส่ให้เหมาะ

⚠️ ก่อนบันทึกไฟล์ ให้ค้นข้อความทั้งไฟล์ของตัวเองว่ามีคำต้องห้ามไหม: ตอบโจทย์ / โดดเด่น / ครบครัน / ระดับโลก / สุดยอด / อันซีน — ถ้ามี ต้องแก้ทุกจุดให้เป็นคำธรรมชาติแบบ v2-clean แล้วค่อยบันทึก

เขียน JSON ให้ valid (escape ดี) แล้ว return สรุปสั้น ๆ ว่าเขียนกี่ block / กี่ ranked|day items`
}

// slug-uniqueness guard: skip articles whose JSON already exists on disk
// (workflow scripts have no fs access — existing slugs are injected via args)
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

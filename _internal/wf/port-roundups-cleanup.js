export const meta = {
  name: 'port-roundups-cleanup',
  description: 'Finish CM roundup batch: build 4 missing roundups from existing reviews, fix 3 roundups (bans/short entries), top-up 3 short reviews',
  phases: [
    { title: 'Build', detail: 'build 4 missing roundups from existing review files' },
    { title: 'FixRound', detail: 'fix bans + expand short entries in 3 roundups' },
    { title: 'TopupRev', detail: 'extend 3 short reviews to >=2000w' },
  ],
}

const TH = 'เชียงใหม่', CITY = 'chiang-mai';
const STYLE = `สไตล์ thailandaddict v2-clean "เพื่อนเล่าให้เพื่อนฟัง" จริงใจ บอกข้อดี-ข้อสังเกตตามจริง อ้าง "เสียงจากรีวิวจริง" ไม่อ้างไปพักเอง · ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน`;
const GOLD = `ดูเทมเพลตทอง: astro/src/content/roundups/top5-luxury-5-star-hotels-chiang-mai.json (roundup ที่อนุมัติแล้ว) + roundupSchema (astro/src/content.config.ts) + .claude/agents/tourlogy-roundup-builder.md`;

// 4 missing roundups → review slugs (all files exist on disk), in rank order from old post.
const BUILD = [
  { slug:'top10-luxury-hotels-chiang-mai', old:'top-ten-hotels-chiang-mai', title:'10 โรงแรมสุดหรู ในจังหวัดเชียงใหม่', n:10,
    revs:['review-rachamankha-chiang-mai','review-na-nirand-chiang-mai','review-chala-number6-chiang-mai','review-ping-nakara-chiang-mai','review-le-meridien-chiang-mai','review-shangri-la-chiang-mai','review-stay-with-nimman-chiang-mai','review-rati-lanna-chiang-mai','review-art-mai-gallery-nimman-chiang-mai','review-siripanna-villa-chiang-mai'] },
  { slug:'top10-nimman-budget-hotels-chiang-mai', old:'topten-chiang-mai-hotels', title:'10 โรงแรมราคาดีย่านนิมมานเหมินท์ เชียงใหม่', n:10,
    revs:['review-u-nimman-chiang-mai-chiang-mai','review-sanae-hotel-nimman-chiang-mai','review-bed-nimman-chiang-mai','review-buri-siri-boutique-hotel-chiang-mai','review-hotel-yayee-chiang-mai','review-room-no-7-chiang-mai','review-mayflower-grande-hotel-chiang-mai','review-the-craft-nimman-chiang-mai','review-bedgasm-poshtel-x-cafe-nimman-chiang-mai','review-bed-addict-hostel-x-cafe-chiang-mai'] },
  { slug:'top10-nature-view-hotels-chiang-mai', old:'topten-hotels-chiang-mai', title:'10 โรงแรมใกล้ชิดธรรมชาติ ทำเลสวย เชียงใหม่', n:10,
    revs:['review-horizon-village-resort-chiang-mai','review-proud-phu-fah-hip-green-resort-chiang-mai','review-at-nata-chiangmai-chic-jungle-chiang-mai','review-mae-sa-valley-garden-resort-chiang-mai','review-hmong-hilltribe-lodge-chiang-mai','review-jirung-health-village-chiang-mai','review-lanna-dusita-riverside-boutique-resort-chiang-mai','review-cross-chiang-mai-riverside-chiang-mai','review-veranda-high-resort-chiang-mai-mgallery-chiang-mai','review-kaomai-lanna-resort-chiang-mai'] },
  { slug:'top10-boutique-hotels-chiang-mai', old:'tipten-chiang-mai-boutique-hotels', title:'10 โรงแรมบูติกสุดชิค เชียงใหม่', n:10,
    revs:['review-the-core-chiang-mai-hotel-chiang-mai','review-live-n-leaf-lifestyle-homestay-and-cafe-chiang-mai','review-busara-chiangmai-hotel-chiang-mai','review-sri-chiang-yeun-house-chiang-mai','review-wua-lai-boutique-hotel-chiang-mai','review-baan-boo-loo-village-chiang-mai','review-haikin-ryokan-chiang-mai','review-yellow-pillow-village-chiang-mai','review-si-phum-heritage-boutique-bed-breakfast-chiang-mai','review-old-city-wall-inn-chiang-mai'] },
];

// 3 existing roundups needing fixes
const FIXROUND = [
  { slug:'top5-popular-hotels-chiang-mai', why:'มีคำต้องห้าม (ตอบโจทย์/โดดเด่น) — ค้นทุก field แล้วเขียนใหม่ให้เป็นธรรมชาติ ลบคำต้องห้ามทั้งหมด · เช็ก storyHtml แต่ละ entry ยังต้อง ≥200 คำ' },
  { slug:'top10-popular-hotels-chiang-mai', why:'storyHtml หลาย entry สั้นกว่า 200 คำ (≈800 อักษรไทย) — ขยายทุก entry ให้ ≥220 คำ สไตล์เพื่อนเล่า อิงข้อมูลจากไฟล์รีวิวของโรงแรมนั้น และลบคำต้องห้ามถ้ามี' },
  { slug:'top10-wualai-walking-street-hotels-chiang-mai', why:'storyHtml ทุก entry สั้น (~130 คำ) — ขยายทุก entry ให้ ≥220 คำ สไตล์เพื่อนเล่า อิงไฟล์รีวิวของโรงแรมนั้น และลบคำต้องห้ามถ้ามี' },
];

// 3 short reviews to extend to >=2000w (>=6800 thai chars in body)
const TOPUP = ['review-ping-nakara-chiang-mai','review-rati-lanna-chiang-mai','review-the-core-chiang-mai-hotel-chiang-mai'];

phase('Build')
const built = await parallel(BUILD.map(B => () =>
  agent(`สร้าง roundup ใหม่ "${B.title}" (พอร์ตจากโพสต์เดิม ${B.old}) — ไฟล์รีวิวทุกโรงแรมเขียนเสร็จแล้วบนดิสก์
อ่านบริบทลำดับ/จำนวนจาก _internal/migration/oldposts/${B.old}.txt + ${GOLD}
OUTPUT: astro/src/content/roundups/${B.slug}.json (ไทยอย่างเดียว) ครบ roundupSchema ทุก field · slug="${B.slug}"
- โรงแรม ${B.n} แห่งเรียงตามลำดับนี้ (อ่านไฟล์รีวิวแต่ละไฟล์เพื่อดึง score/price/ห้อง/agoda/booking/trip/heroImg/ทำเล มาให้ตรง):
${B.revs.map((r,i)=>`  ${i+1}. astro/src/content/reviews/${r}.json → reviewUrl="${r}.html"`).join('\n')}
- **entries / toc / compareRows ต้องมี ${B.n} รายการเท่ากัน เรียงตรงตำแหน่ง** · id=h1..h${B.n} · rank/toc.n=1..${B.n} ต่อเนื่อง
- **storyHtml แต่ละ entry ≥220 คำไทย (≥900 อักษรไทย)** สไตล์เพื่อนเล่า บอกข้อดี-ข้อสังเกตจริงจากไฟล์รีวิว · img = heroImg ของไฟล์รีวิวนั้น · score/priceBig/rooms/agodaUrl/bookingUrl/tripUrl = ตามไฟล์รีวิว
- เลขในชื่อ/heroStats = ${B.n} · breadcrumb→city-${CITY}.html · introHtml/mrtHtml/advice/faq ครบแบบเทมเพลตทอง
${STYLE}
⚠️ ก่อนเสร็จ: node -e ตรวจ JSON.parse ได้ + entries.length===toc.length===compareRows.length===${B.n} + ค้นคำต้องห้าม=0 · return: ok`,
    { label:`build:${B.slug}`, phase:'Build' })
    .then(()=>({slug:B.slug,ok:true})).catch(e=>({slug:B.slug,ok:false,e:String(e).slice(0,80)}))
))
log(`Built ${built.filter(x=>x&&x.ok).length}/${BUILD.length} roundups`)

phase('FixRound')
const fixed = await parallel(FIXROUND.map(F => () =>
  agent(`แก้ roundup ที่มีอยู่: astro/src/content/roundups/${F.slug}.json
ปัญหา: ${F.why}
อ่านไฟล์ปัจจุบัน + ${GOLD} · แก้เฉพาะที่จำเป็น คงโครง entries/toc/compareRows เดิม (จำนวนเท่าเดิม เรียงเดิม) · ข้อมูลโรงแรมอิงไฟล์ astro/src/content/reviews/<reviewUrl ที่อยู่ใน entry นั้น>
${STYLE}
⚠️ ก่อนเสร็จ: JSON.parse ได้ + entries.length===toc.length===compareRows.length + ทุก storyHtml ≥900 อักษรไทย + คำต้องห้าม=0 · return: ok`,
    { label:`fix:${F.slug}`, phase:'FixRound' })
    .then(()=>({slug:F.slug,ok:true})).catch(e=>({slug:F.slug,ok:false,e:String(e).slice(0,80)}))
))
log(`Fixed ${fixed.filter(x=>x&&x.ok).length}/${FIXROUND.length} roundups`)

phase('TopupRev')
const topped = await parallel(TOPUP.map(slug => () =>
  agent(`ขยายเนื้อหารีวิว astro/src/content/reviews/${slug}.json ให้ body ยาวขึ้นถึงมาตรฐาน
ตอนนี้ body สั้นกว่ามาตรฐาน — ต้องขยายให้ **รวม body ≥ 6,800 อักษรไทย (≈2,000 คำ)** โดยเพิ่มหัวข้อย่อย/รายละเอียดจากการค้นเว็บจริง (ทำเล-เดินทาง, ห้อง, สิ่งอำนวยฯ, อาหาร, บริการ, เสียงรีวิวจริงชม-ติ, เทียบราคา-ความคุ้ม, ข้อควรรู้ก่อนจอง, สรุป)
คงทุก field เดิมของ schema ไว้ · เพิ่มเฉพาะ body blocks (kind p/quote) · อ่าน reviewSchema + .claude/agents/tourlogy-hotel-reviewer.md
${STYLE}
⚠️ ก่อนเสร็จ: JSON.parse ได้ + นับอักษรไทยใน body ≥6800 + คำต้องห้าม=0 · return: ok + thaiChars`,
    { label:`topup:${slug}`, phase:'TopupRev' })
    .then(()=>({slug,ok:true})).catch(e=>({slug,ok:false,e:String(e).slice(0,80)}))
))
log(`Topped up ${topped.filter(x=>x&&x.ok).length}/${TOPUP.length} reviews`)

return { built: built.filter(x=>x&&x.ok).map(x=>x.slug), buildFail: built.filter(x=>x&&!x.ok),
  fixed: fixed.filter(x=>x&&x.ok).map(x=>x.slug), fixFail: fixed.filter(x=>x&&!x.ok),
  topped: topped.filter(x=>x&&x.ok).map(x=>x.slug), topFail: topped.filter(x=>x&&!x.ok) }

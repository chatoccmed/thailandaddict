export const meta = {
  name: 'phase2-audience-roundups',
  description: 'Phase-2 from the roundup audit: the "audience" (couples/honeymoon | family) roundup each S-tier city still lacks — phuket/samui/krabi honeymoon, chiang-mai couples, huahin/pattaya family. Assembled from each cluster\'s existing review pool (0 new reviews/images; reuses on-R2 heroImgs). Honest Top-N if fewer than 10 genuine fits.',
  phases: [{ title: 'Audience', detail: 'one roundup-builder per city, picks audience-fit hotels from its pool' }],
}

// [slug, cluster, TH hub, TH city, EN city, segment, TH label, criterion]
const JOBS = [
  ['top10-honeymoon-hotels-phuket', 'phuket', 'city-phuket.html', 'ภูเก็ต', 'Phuket', 'honeymoon',
   'โรงแรมฮันนีมูนภูเก็ต', 'โรแมนติกสำหรับคู่รัก/ฮันนีมูน — พูลวิลลา/สระส่วนตัว วิวทะเลหรือซันเซ็ต บรรยากาศเงียบสงบเป็นส่วนตัว สปาคู่ เหมาะฉลองครบรอบ/แต่งงาน คะแนน ≥8.5'],
  ['top10-honeymoon-hotels-samui', 'samui', 'city-samui.html', 'เกาะสมุย', 'Koh Samui', 'honeymoon',
   'โรงแรมฮันนีมูนเกาะสมุย', 'โรแมนติกสำหรับคู่รัก/ฮันนีมูน — พูลวิลลาริมหาด วิวทะเล บรรยากาศส่วนตัว สปา เหมาะฉลองครบรอบ/แต่งงาน คะแนน ≥8.5'],
  ['top10-honeymoon-hotels-krabi', 'krabi', 'city-krabi.html', 'กระบี่', 'Krabi', 'honeymoon',
   'โรงแรมฮันนีมูนกระบี่', 'โรแมนติกสำหรับคู่รัก/ฮันนีมูน — รีสอร์ตริมหาด/หน้าผา (ไร่เลย์/อ่าวนาง/คลองม่วง) พูลวิลลา วิวทะเล ส่วนตัว คะแนน ≥8.5'],
  ['top10-couples-hotels-chiang-mai', 'chiang-mai', 'city-chiang-mai.html', 'เชียงใหม่', 'Chiang Mai', 'couples',
   'โรงแรมสำหรับคู่รักเชียงใหม่', 'โรแมนติกสำหรับคู่รัก — บูทีค/ดีไซน์ บรรยากาศอบอุ่น วิวดอย/สวน สปาคู่ ทำเลเมืองเก่า/ริมปิง เหมาะทริปคู่รัก คะแนน ≥8.5'],
  ['top10-family-hotels-huahin', 'huahin', 'city-huahin.html', 'หัวหิน', 'Hua Hin', 'family',
   'โรงแรมสำหรับครอบครัวหัวหิน', 'เหมาะครอบครัว/มากับเด็ก — ห้องแฟมิลี่/คอนเนกติ้ง สระเด็ก/สวนน้ำ ติดหาด กิจกรรมเด็ก ใกล้ที่เที่ยวครอบครัว คะแนน ≥8.5'],
  ['top10-family-hotels-pattaya', 'pattaya', 'city-pattaya.html', 'พัทยา', 'Pattaya', 'family',
   'โรงแรมสำหรับครอบครัวพัทยา', 'เหมาะครอบครัว/มากับเด็ก — ห้องแฟมิลี่ สระเด็ก/สวนน้ำ ใกล้ที่เที่ยวครอบครัว (สวนน้ำ/สถานที่เด็ก) ติดหาด คะแนน ≥8.5'],
]

const OVR = (thCity, enCity, hub, seg) => `
ส่วนสำคัญ (เว็บ = thailandaddict.com):
- แบรนด์ ThailandAddict · โทน v2-clean (ห้าม slang อ่ะ/ปะ/แหละ/ล่ะ · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน) · honesty "เสียงจากรีวิวจริง" ห้ามอ้างไปพักเอง · ห้าม dark patterns (ห้ามความเร่งรีบ/ขาดแคลนปลอม)
- schema: astro/src/content.config.ts (roundupSchema) · แบบอย่าง: astro/src/content/roundups/top10-luxury-hotels-phuket.json + top10-jomtien-beach-hotels-pattaya.json
- affiliate: Agoda ?cid=1965862 · Trip.com ?Allianceid=6861268&SID=312919111 · Booking = URL ปกติ
- crumbCityName="${thCity}"(EN "${enCity}"), crumbCityHref="${hub}" · countryHref="country-thailand.html" · addressCountry="TH"
- img จาก heroImg ของรีวิว (มีบนดิสก์+R2 แล้ว) · ห้ามสร้าง/ลบไฟล์รูป · ห้ามอ้างรูป/รีวิวที่ไม่มีจริง
- ⚠️ ข้อเท็จจริงต้องถูกต้อง: อย่ากล่าวอ้างรางวัล (มิชลิน/50 Best) หรือปีที่เปิด ถ้าไม่มั่นใจ — ตัดออกดีกว่าเสี่ยงผิด
- นี่คือ segment "${seg}" — คัดเฉพาะโรงแรมที่ "เหมาะกับกลุ่มนี้จริง" ตามเกณฑ์ ถ้าเข้าเกณฑ์ไม่ถึง 10 ให้ทำ Top N ตามจริง ห้ามปั้นให้ครบ 10`

phase('Audience')
const results = await parallel(JOBS.map(([slug, cluster, hub, thCity, enCity, seg, thLabel, crit]) => () =>
  agent(
`สำคัญ: อ่าน .claude/agents/tourlogy-roundup-builder.md ก่อน ทำตามทุกขั้นตอน — ยกเว้น override ด้านล่าง
สร้าง roundup "${thLabel}" (segment: ${seg}) — เขียน astro/src/content/roundups/${slug}.json (ไทย) + astro/src/content/roundups-en/${slug}.json (อังกฤษ)
⚠️ ไม่ต้องเขียนรีวิวใหม่ — ประกอบจากรีวิวที่มีอยู่แล้วใน cluster "${cluster}":
  รัน: ls astro/src/content/reviews/ แล้วอ่านไฟล์ที่ field cluster="${cluster}" (หรือลงท้าย -${cluster}.json)
  อ่าน JSON แต่ละไฟล์ คัดเฉพาะที่เข้าเกณฑ์กลุ่มนี้จริง: ${crit}
  ประเมินจากเนื้อรีวิว (ห้อง/สิ่งอำนวยความสะดวก/บรรยากาศ/ทำเล) ว่าเหมาะ ${seg} จริงไหม — เลือกที่ดีที่สุด จัดอันดับตามความเหมาะกับกลุ่มนี้ + คะแนน
  ถ้าเข้าเกณฑ์ < 10 → ทำ Top N ตามจริง (เช่น Top 7/Top 8) อย่าใส่ตัวที่ไม่เหมาะให้ครบ 10
  ดึงคะแนน/ราคา/ทำเล/ลิงก์จอง/img (จาก heroImg) จากรีวิว · reviewUrl="<slug>.html" (EN ใช้ /en/ ตาม template)
slug="${slug}" (คงชื่อ slug นี้เป๊ะ ๆ ทั้ง TH+EN) · breadcrumb: หน้าแรก → ประเทศไทย → ${thCity} (${hub}) → หน้านี้
intro เล่าว่าทำไม${thCity}เหมาะกับกลุ่ม ${seg} และวิธีเลือกที่พักให้เหมาะ
${OVR(thCity, enCity, hub, seg)}`,
    { label: `aud:${slug.slice(0, 28)}`, phase: 'Audience' }
  ).then(() => ({ slug, ok: true })).catch(() => ({ slug, ok: false }))
))
log('Audience complete: ' + results.filter(Boolean).map(r => `${r.slug.replace('top10-','').replace('-hotels','')}:${r.ok ? 'ok' : 'FAIL'}`).join(' · '))
return { jobs: results.filter(Boolean) }

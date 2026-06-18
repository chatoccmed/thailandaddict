export const meta = {
  name: 'fetch-tak-imgs',
  description: 'Fetch real hotel photos for 3 Mae Sot hotels whose review heroImg+gallery files are missing. Sources: Tripadvisor / Ostrovok CDN (NOT Trip.com, NOT Agoda). Saves to expected paths + optimizes. Leaves missing (onerror fallback) if no authentic photo found — never fakes.',
  phases: [{ title: 'Fetch', detail: 'one agent per hotel: find real photos, curl to paths, optimize' }],
}

const HOTELS = [
  { name: 'Phetcharat Grand Hotel Maesot', base: 'tak-phetcharat-grand-mae-sot' },
  { name: 'Irawadee Resort (Mae Sot)', base: 'tak-irawadee' },
  { name: 'T.House Maesot (Mae Sot)', base: 'tak-thouse-mae-sot' },
];

const VERDICT = { type:'object', additionalProperties:false, required:['base','got'], properties:{
  base:{type:'string'}, got:{type:'number',description:'จำนวนรูปจริงที่ดึงได้ (0-4)'},
  source:{type:'string'}, note:{type:'string'} } };

phase('Fetch')
const res = await parallel(HOTELS.map(h => () => {
  const paths = [`astro/public/images/hotels/${h.base}.jpg`, `astro/public/images/hotels/${h.base}-2.jpg`, `astro/public/images/hotels/${h.base}-3.jpg`, `astro/public/images/hotels/${h.base}-4.jpg`];
  return agent(`ดึงรูปจริงของโรงแรม "${h.name}" จังหวัดตาก (อ.แม่สอด) — รูปถ่ายโรงแรมจริงเท่านั้น
แหล่ง: Tripadvisor (media-cdn.tripadvisor.com) หรือ Ostrovok (cdn.worldota.net) — **ห้าม Trip.com, ห้าม Agoda (บล็อก), ห้ามรูป stock/ไม่เกี่ยว**
ขั้นตอน: web-search หา media gallery ของโรงแรมนี้ → เอา URL รูปจริง 4 รูป (หน้าตึก/ห้อง/สระ/บรรยากาศ) → curl -m 60 -A "Mozilla/5.0" ลงไฟล์ตามนี้:
  ${paths.map((p,i)=>`  รูป${i+1}: ${p}`).join('\n')}
จากนั้น: node _internal/optimize-images.mjs ${paths.join(' ')}  (เฉพาะไฟล์ที่ดึงได้)
สำคัญ: ถ้าหารูปจริงไม่ได้ครบ ดึงเท่าที่ได้จริง — **อย่าใส่รูปปลอม/ไม่เกี่ยว** (รูปที่ขาดจะ fallback onerror เอง) · ตรวจว่าไฟล์ไม่ใช่ HTML error page (ขนาด >10KB, เป็น jp/png จริง)
return: base="${h.base}", got=<จำนวนรูปจริงที่ดึงสำเร็จ>, source, note`,
    { label:`img:${h.base}`, phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({base:h.base, got:0, note:'err '+String(e)}));
}))
return { fetched: res }

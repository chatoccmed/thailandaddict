export const meta = {
  name: 'fetch-krabi-imgs',
  description: 'Fetch real hotel photos for 3 Krabi hotels whose review heroImg+gallery (base-1..4) are missing. Sources: Tripadvisor / Ostrovok CDN (NOT Trip.com, NOT Agoda). Saves + optimizes. Leaves missing (onerror fallback) if no authentic photo — never fakes.',
  phases: [{ title: 'Fetch', detail: 'one agent per hotel: find real photos, curl to base-1..4, optimize' }],
}

const HOTELS = [
  { name: 'Nap Krabi Hotel (อ.เมืองกระบี่)', base: 'krabi-nap' },
  { name: 'Palm Driving Range & Resort (กระบี่)', base: 'krabi-palm' },
  { name: 'The Moment Hostel (กระบี่)', base: 'krabi-moment' },
];

const VERDICT = { type:'object', additionalProperties:false, required:['base','got'], properties:{
  base:{type:'string'}, got:{type:'number',description:'จำนวนรูปจริงที่ดึงได้ (0-4)'},
  source:{type:'string'}, note:{type:'string'} } };

phase('Fetch')
const res = await parallel(HOTELS.map(h => () => {
  const paths = [1,2,3,4].map(i => `astro/public/images/hotels/${h.base}-${i}.jpg`);
  return agent(`ดึงรูปจริงของโรงแรม "${h.name}" จังหวัดกระบี่ — รูปถ่ายโรงแรมจริงเท่านั้น
แหล่ง: Tripadvisor (media-cdn/dynamic-media-cdn.tripadvisor.com) หรือ Ostrovok (cdn.worldota.net) — **ห้าม Trip.com, ห้าม Agoda (บล็อก), ห้ามรูป stock/ไม่เกี่ยว**
ขั้นตอน: web-search หา media gallery ของโรงแรมนี้ → URL รูปจริง 4 รูป (หน้าตึก/ห้อง/สระ/บรรยากาศ) → curl -m 60 -A "Mozilla/5.0" ลงไฟล์ (รูปแรก = hero):
  ${paths.map((p,i)=>`  รูป${i+1}: ${p}`).join('\n')}
จากนั้น: node _internal/optimize-images.mjs ${paths.join(' ')}  (เฉพาะไฟล์ที่ดึงได้)
สำคัญ: หารูปจริงไม่ครบ ดึงเท่าที่ได้จริง — **อย่าใส่รูปปลอม/ไม่เกี่ยว** (รูปขาด fallback onerror เอง) · ตรวจไฟล์เป็น JPEG จริง (>10KB) ไม่ใช่ HTML error page
return: base="${h.base}", got=<จำนวนรูปจริง>, source, note`,
    { label:`img:${h.base}`, phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({base:h.base, got:0, note:'err '+String(e)}));
}))
return { fetched: res }

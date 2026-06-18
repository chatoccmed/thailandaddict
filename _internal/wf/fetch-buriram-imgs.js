export const meta = {
  name: 'fetch-buriram-imgs',
  description: 'Fetch real photos for 2 Buriram hotels (Grand Garden Home Resort, Ray Hotel) missing heroImg+gallery base-1..4. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda. Optimize. Never fake.',
  phases: [{ title: 'Fetch', detail: 'one agent per hotel: find real photos, curl base-1..4, optimize' }],
}

const HOTELS = [
  { name: 'Grand Garden Home Resort, บุรีรัมย์', base: 'buriram-grandgarden' },
  { name: 'Ray Hotel Buriram (เรย์ โฮเทล บุรีรัมย์)', base: 'buriram-ray' },
];
const VERDICT = { type:'object', additionalProperties:false, required:['base','got'], properties:{
  base:{type:'string'}, got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };

phase('Fetch')
const res = await parallel(HOTELS.map(h => () => {
  const paths = [1,2,3,4].map(i => `astro/public/images/hotels/${h.base}-${i}.jpg`);
  return agent(`ดึงรูปจริงของ "${h.name}" — รูปถ่ายโรงแรมจริงเท่านั้น
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บทางการ — **ห้าม Trip.com, Agoda, stock/ไม่เกี่ยว**
web-search หา gallery → URL จริง 4 รูป (หน้าตึก/ห้อง/สระ/บรรยากาศ) → curl -m 60 -A "Mozilla/5.0" (รูปแรก=hero):
${paths.map((p,i)=>`  รูป${i+1}: ${p}`).join('\n')}
แล้ว node _internal/optimize-images.mjs ${paths.join(' ')} (เฉพาะที่ดึงได้)
หาไม่ครบ→ดึงเท่าที่ได้จริง อย่าใส่รูปปลอม (ขาด→onerror) · ตรวจ JPEG จริง >10KB ไม่ใช่ HTML
return: base="${h.base}", got=<n>, source, note`,
    { label:`img:${h.base}`, phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({base:h.base, got:0, note:'err '+String(e)}));
}))
return { fetched: res }

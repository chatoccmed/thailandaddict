export const meta = {
  name: 'fetch-chachoengsao-imgs',
  description: 'Fetch real photos for The Chill Classic House (Chachoengsao) — missing base-1..4. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda. Optimize. Never fake.',
  phases: [{ title: 'Fetch', detail: '1 agent: find real photos, curl base-1..4, optimize' }],
}
const HOTELS = [ { name: 'The Chill Classic House, ฉะเชิงเทรา', base: 'chachoengsao-chillclassic' } ];
const VERDICT = { type:'object', additionalProperties:false, required:['base','got'], properties:{
  base:{type:'string'}, got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
phase('Fetch')
const res = await parallel(HOTELS.map(h => () => {
  const paths = [1,2,3,4].map(i => `astro/public/images/hotels/${h.base}-${i}.jpg`);
  return agent(`ดึงรูปจริงของ "${h.name}" — รูปถ่ายที่พักจริงเท่านั้น
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ/เพจทางการ — **ห้าม Trip.com, Agoda, stock/ไม่เกี่ยว**
web-search หา gallery → URL จริง 4 รูป → curl -m 60 -A "Mozilla/5.0" (รูปแรก=hero):
${paths.map((p,i)=>`  รูป${i+1}: ${p}`).join('\n')}
แล้ว node _internal/optimize-images.mjs ${paths.join(' ')} (เฉพาะที่ดึงได้)
หาไม่ครบ→ดึงเท่าที่ได้จริง อย่าใส่รูปปลอม (ขาด→onerror) · ตรวจ JPEG จริง >10KB ไม่ใช่ HTML
return: base="${h.base}", got=<n>, source, note`,
    { label:`img:${h.base}`, phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({base:h.base, got:0, note:'err '+String(e)}));
}))
return { fetched: res }

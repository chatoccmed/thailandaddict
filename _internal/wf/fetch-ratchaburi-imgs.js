export const meta = {
  name: 'fetch-ratchaburi-imgs',
  description: 'Fetch real photos for Space 59 Hotel (Ratchaburi) — missing hero ratchaburi-space59.jpg + gallery -2/-3/-4. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda. Optimize. Never fake.',
  phases: [{ title: 'Fetch', detail: '1 agent: find real photos, curl exact paths, optimize' }],
}

const HOTELS = [
  { name: 'Space 59 Hotel, ราชบุรี (อ.เมืองราชบุรี)', paths: [
    'astro/public/images/hotels/ratchaburi-space59.jpg',
    'astro/public/images/hotels/ratchaburi-space59-2.jpg',
    'astro/public/images/hotels/ratchaburi-space59-3.jpg',
    'astro/public/images/hotels/ratchaburi-space59-4.jpg' ] },
];
const VERDICT = { type:'object', additionalProperties:false, required:['got'], properties:{
  got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };

phase('Fetch')
const res = await parallel(HOTELS.map(h => () =>
  agent(`ดึงรูปจริงของ "${h.name}" — รูปถ่ายโรงแรมจริงเท่านั้น
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บทางการ — **ห้าม Trip.com, Agoda, stock/ไม่เกี่ยว**
web-search หา gallery → URL จริง 4 รูป (หน้าตึก/ห้อง/สระ/บรรยากาศ) → curl -m 60 -A "Mozilla/5.0" (รูปแรก=hero):
${h.paths.map((p,i)=>`  รูป${i+1}: ${p}`).join('\n')}
แล้ว node _internal/optimize-images.mjs ${h.paths.join(' ')} (เฉพาะที่ดึงได้)
หาไม่ครบ→ดึงเท่าที่ได้จริง อย่าใส่รูปปลอม (ขาด→onerror) · ตรวจ JPEG จริง >10KB ไม่ใช่ HTML
return: got=<n>, source, note`,
    { label:'img:ratchaburi-space59', phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({got:0, note:'err '+String(e)}))
))
return { fetched: res }

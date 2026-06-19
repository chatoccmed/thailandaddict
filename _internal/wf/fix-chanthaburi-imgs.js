export const meta = {
  name: 'fix-chanthaburi-imgs',
  description: 'QA fix (chanthaburi): blues-river-resort + chaolao-tosang-beach-hotel heroes are ThailandAddict "T" logo placeholders (never got real images). Re-fetch real resort photos. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never logo/stock.',
  phases: [{ title: 'Fetch', detail: 're-fetch real photos for 2 hotels' }],
}
const VERDICT = { type:'object', additionalProperties:false, required:['slug','got'], properties:{ slug:{type:'string'}, got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
const HOTELS = [
  { name:'Blues River Resort (จันทบุรี, oxbow ริมแม่น้ำจันทบุรี — เว็บ bluesriverresort.com)', base:'chanthaburi-bluesriver' },
  { name:'Chaolao Tosang Beach Hotel (หาดเจ้าหลาว ท่าใหม่ จันทบุรี)', base:'chanthaburi-tosang' },
];
phase('Fetch')
const res = await parallel(HOTELS.map(h => () => {
  const paths = [1,2,3,4].map(i => `astro/public/images/hotels/${h.base}-${i}.jpg`);
  return agent(`ดึงรูป **โรงแรมจริง** "${h.name}" — รูปเดิม (${h.base}-1..4.jpg) เป็นโลโก้ตัว 'T' placeholder ของ ThailandAddict (ไฟล์เล็ก) ไม่ใช่รูปโรงแรม เขียนทับด้วยรูปอาคาร/ห้อง/สระ/หาด/ริมน้ำจริง
แหล่ง: เว็บทางการ/Tripadvisor (dynamic-media-cdn.tripadvisor.com)/Ostrovok (cdn.worldota.net) — ห้าม Trip.com/Agoda/โลโก้/stock
web-search ยืนยันโรงแรมจริง → ดึง 4 รูป → curl -m 60 -A "Mozilla/5.0" เขียนทับ:
${paths.map((p,i)=>'  '+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${paths.join(' ')} · ตรวจด้วยตา = ตัวรีสอร์ตจริง (ไม่ใช่โลโก้!) · JPEG จริง >10KB · หาไม่ได้จริงๆ return got=0
return: slug="review-${h.base.replace('chanthaburi-','').replace('bluesriver','blues-river-resort').replace('tosang','chaolao-tosang-beach-hotel')}-chanthaburi", got, source, note`,
    { label:'img:'+h.base, phase:'Fetch', schema:VERDICT })
    .then(v=>v).catch(e=>({slug:h.base, got:0, note:String(e)}));
}))
return { fixes: res }

export const meta = {
  name: 'fix-elixir-img',
  description: 'QA fix: re-fetch REAL photos for GLOW Elixir Koh Yao Yai (Phang Nga) — current hero is a generic beach+longtail-boat shot, not the resort. Get actual resort/rooms/pool. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never generic-stock.',
  phases: [{ title: 'Fetch', detail: 're-fetch correct resort photos' }],
}
const PATHS = [1,2,3,4].map(i => `astro/public/images/hotels/phang-nga-elixir-${i}.jpg`);
const VERDICT = { type:'object', additionalProperties:false, required:['got'], properties:{ got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
phase('Fetch')
const r = await agent(`ดึงรูป **รีสอร์ตจริง** "GLOW Elixir Koh Yao Yai" (เกาะยาวใหญ่ จ.พังงา) — รูปเดิม (phang-nga-elixir-1.jpg) เป็นภาพหาด+เรือหางยาวทั่วไป ไม่เห็นตัวรีสอร์ต ต้องเขียนทับด้วยรูปตัวรีสอร์ต/ห้องพัก/สระ/วิลล่าจริงของที่นี่
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ-เพจทางการ — **ห้าม Trip.com, Agoda, ห้ามภาพหาด/ทะเล generic-stock ที่ไม่เห็นโรงแรม**
web-search "GLOW Elixir Koh Yao Yai resort" → ยืนยันรีสอร์ตจริงบนเกาะยาวใหญ่ → ดึง 4 รูปที่เห็นตัวรีสอร์ต (อาคาร/วิลล่า/ห้อง/สระ/ร้านอาหาร) → curl -m 60 -A "Mozilla/5.0" เขียนทับ (รูปแรก=hero):
${PATHS.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${PATHS.join(' ')}
ต้องเห็นตัวรีสอร์ตจริง (ไม่ใช่หาด generic!) · ตรวจด้วยตา · JPEG จริง >10KB · หาไม่ได้จริงๆ return got=0
return: got=<จำนวนรูปจริง>, source, note`,
  { label:'img:elixir', phase:'Fetch', schema:VERDICT }).catch(e=>({got:0,note:'err '+String(e)}));
return { fixed: r }

export const meta = {
  name: 'fix-onebudget-img',
  description: 'QA fix: re-fetch REAL photos for One Budget Hotel Tak Maesot — current images are a Burmese temple (wrong, deep-audit flagged). Get the actual hotel building/rooms. Tripadvisor/Ostrovok/official, NOT Trip.com/Agoda, never fake.',
  phases: [{ title: 'Fetch', detail: 're-fetch correct hotel photos' }],
}
const PATHS = ['astro/public/images/hotels/tak-one-budget-mae-sot.jpg','astro/public/images/hotels/tak-one-budget-mae-sot-2.jpg','astro/public/images/hotels/tak-one-budget-mae-sot-3.jpg','astro/public/images/hotels/tak-one-budget-mae-sot-4.jpg'];
const VERDICT = { type:'object', additionalProperties:false, required:['got'], properties:{ got:{type:'number'}, source:{type:'string'}, note:{type:'string'} } };
phase('Fetch')
const r = await agent(`ดึงรูป **โรงแรมจริง** "One Budget Hotel Tak Maesot" (อ.แม่สอด จ.ตาก) — รูปเดิมผิด (เป็นรูปวัด/เจดีย์พม่า ไม่ใช่โรงแรม) ต้องเขียนทับด้วย**รูปตัวอาคาร/ห้องพัก/ล็อบบี้ของโรงแรมนี้จริงๆ**
แหล่ง: Tripadvisor (dynamic-media-cdn.tripadvisor.com) / Ostrovok (cdn.worldota.net) / เว็บ-เพจทางการ — **ห้าม Trip.com, Agoda, ห้ามรูปวัด/สถานที่ท่องเที่ยว/stock**
web-search "One Budget Hotel Mae Sot" หา gallery จริง → ยืนยันเป็นโรงแรมงบประหยัดในแม่สอด → ดึง 4 รูป (หน้าตึก/ห้องพัก/ล็อบบี้/บรรยากาศโรงแรม) → curl -m 60 -A "Mozilla/5.0" เขียนทับ (รูปแรก=hero):
${PATHS.map((p,i)=>'  รูป'+(i+1)+': '+p).join('\n')}
แล้ว node _internal/optimize-images.mjs ${PATHS.join(' ')}
สำคัญ: ต้องเป็นรูปโรงแรมจริงเท่านั้น (ไม่ใช่วัด!) · ตรวจด้วยตา · JPEG จริง >10KB · หาไม่ได้จริงๆ ให้ลบไฟล์รูปวัดที่ผิดออก (rm) แล้ว return got=0 (ปล่อย onerror ดีกว่าใส่รูปวัดผิด)
return: got=<จำนวนรูปโรงแรมจริง>, source, note`,
  { label:'img:one-budget', phase:'Fetch', schema:VERDICT }).catch(e=>({got:0,note:'err '+String(e)}));
return { fixed: r }

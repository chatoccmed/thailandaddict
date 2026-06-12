export const meta = {
  name: 'hotel-img-gaps-recover',
  description: 'Recover missing hotel review photos (23 hotels, 80 files) to their exact expected filenames',
  phases: [ { title: 'Recover', detail: 'one agent per hotel → download real photos to exact paths' } ],
}

// gaps list embedded below (from _internal/wf/_hotel-img-gaps.json snapshot)
const GAPS = [
 {slug:"review-baan-premsiri-amnat-charoen",name:"Baan Premsiri Hotel",cluster:"amnat-charoen",need:["images/hotels/amnat-charoen-baan-premsiri-2.jpg","images/hotels/amnat-charoen-baan-premsiri-3.jpg","images/hotels/amnat-charoen-baan-premsiri-4.jpg"]},
 {slug:"review-ban-chahomm-guesthouse-betong-yala",name:"Ban Chahomm Guesthouse Betong",cluster:"yala",need:["images/hotels/yala-banchahomm-1.jpg","images/hotels/yala-banchahomm-2.jpg","images/hotels/yala-banchahomm-3.jpg","images/hotels/yala-banchahomm-4.jpg"]},
 {slug:"review-bluetel-kalasin",name:"Bluetel Kalasin",cluster:"kalasin",need:["images/hotels/kalasin-bluetel.jpg","images/hotels/kalasin-bluetel-2.jpg","images/hotels/kalasin-bluetel-3.jpg","images/hotels/kalasin-bluetel-4.jpg"]},
 {slug:"review-bm-pattani-apartment-pattani",name:"BM Pattani Apartment",cluster:"pattani",need:["images/hotels/pattani-bm-2.jpg","images/hotels/pattani-bm-3.jpg","images/hotels/pattani-bm-4.jpg"]},
 {slug:"review-bunraksa-resort-kamphaeng-phet",name:"Bunraksa Resort",cluster:"kamphaeng-phet",need:["images/hotels/kamphaeng-phet-bunraksa-3.jpg","images/hotels/kamphaeng-phet-bunraksa-4.jpg"]},
 {slug:"review-grace-hostel-khon-kaen",name:"Grace Hostel Khon Kaen",cluster:"khon-kaen",need:["images/hotels/khon-kaen-grace-1.jpg","images/hotels/khon-kaen-grace-2.jpg","images/hotels/khon-kaen-grace-3.jpg","images/hotels/khon-kaen-grace-4.jpg"]},
 {slug:"review-hr-resort-bueng-khong-long-bueng-kan",name:"HR Resort Bueng Khong Long",cluster:"bueng-kan",need:["images/hotels/bueng-kan-hrresort-2.jpg","images/hotels/bueng-kan-hrresort-3.jpg","images/hotels/bueng-kan-hrresort-4.jpg"]},
 {slug:"review-kanya-place-maha-sarakham",name:"Kanya Place Maha Sarakham",cluster:"maha-sarakham",need:["images/hotels/maha-sarakham-kanya-1.jpg","images/hotels/maha-sarakham-kanya-2.jpg","images/hotels/maha-sarakham-kanya-3.jpg","images/hotels/maha-sarakham-kanya-4.jpg"]},
 {slug:"review-natcha-place-thammasat-rangsit-pathum-thani",name:"ณัชชา เพลส ธรรมศาสตร์ รังสิต (Natcha Place)",cluster:"pathum-thani",need:["images/hotels/pathum-thani-natcha-place.jpg"]},
 {slug:"review-november-garden-pool-villa-chai-nat",name:"November Garden Pool Villa Chainat",cluster:"chai-nat",need:["images/hotels/chai-nat-november-garden-1.jpg","images/hotels/chai-nat-november-garden-2.jpg","images/hotels/chai-nat-november-garden-3.jpg","images/hotels/chai-nat-november-garden-4.jpg"]},
 {slug:"review-penpit-hotel-amnat-charoen",name:"Penpit Hotel",cluster:"amnat-charoen",need:["images/hotels/amnat-charoen-penpit.jpg","images/hotels/amnat-charoen-penpit-2.jpg","images/hotels/amnat-charoen-penpit-3.jpg","images/hotels/amnat-charoen-penpit-4.jpg"]},
 {slug:"review-pornsiri-hotel-sisaket",name:"Pornsiri Hotel Sisaket",cluster:"sisaket",need:["images/hotels/sisaket-pornsiri-1.jpg","images/hotels/sisaket-pornsiri-2.jpg","images/hotels/sisaket-pornsiri-3.jpg","images/hotels/sisaket-pornsiri-4.jpg"]},
 {slug:"review-pp-nongkhai-resort-near-bridge-nong-khai",name:"PP Nongkhai Resort",cluster:"nong-khai",need:["images/hotels/nong-khai-ppresort-1.jpg","images/hotels/nong-khai-ppresort-2.jpg","images/hotels/nong-khai-ppresort-3.jpg","images/hotels/nong-khai-ppresort-4.jpg"]},
 {slug:"review-river-city-hotel-pattani",name:"River City Hotel Pattani",cluster:"pattani",need:["images/hotels/pattani-river-city.jpg","images/hotels/pattani-river-city-2.jpg","images/hotels/pattani-river-city-3.jpg","images/hotels/pattani-river-city-4.jpg"]},
 {slug:"review-royal-mekong-nongkhai-hotel-nong-khai",name:"Royal Mekong Nongkhai Hotel",cluster:"nong-khai",need:["images/hotels/nong-khai-royalmekong-2.jpg","images/hotels/nong-khai-royalmekong-3.jpg","images/hotels/nong-khai-royalmekong-4.jpg"]},
 {slug:"review-silayok-grand-hotel-tak",name:"Silayok Grand Hotel Tak",cluster:"tak",need:["images/hotels/tak-silayok-2.jpg","images/hotels/tak-silayok-3.jpg","images/hotels/tak-silayok-4.jpg"]},
 {slug:"review-suanphai-resort-chai-nat",name:"Suanphai Resort Chainat",cluster:"chai-nat",need:["images/hotels/chai-nat-suanphai.jpg","images/hotels/chai-nat-suanphai-2.jpg","images/hotels/chai-nat-suanphai-3.jpg","images/hotels/chai-nat-suanphai-4.jpg"]},
 {slug:"review-suphak-hotel-kalasin",name:"Suphak Hotel Kalasin",cluster:"kalasin",need:["images/hotels/kalasin-supak-1.jpg","images/hotels/kalasin-supak-2.jpg","images/hotels/kalasin-supak-3.jpg","images/hotels/kalasin-supak-4.jpg"]},
 {slug:"review-the-bed-boutique-house-ratchaburi",name:"The Bed Boutique House Ratchaburi",cluster:"ratchaburi",need:["images/hotels/ratchaburi-thebed.jpg","images/hotels/ratchaburi-thebed-2.jpg","images/hotels/ratchaburi-thebed-3.jpg","images/hotels/ratchaburi-thebed-4.jpg"]},
 {slug:"review-the-one-hotel-bueng-kan",name:"The One Hotel Bueng Kan",cluster:"bueng-kan",need:["images/hotels/bueng-kan-theone-2.jpg","images/hotels/bueng-kan-theone-3.jpg","images/hotels/bueng-kan-theone-4.jpg"]},
 {slug:"review-thee-lor-su-riverside-resort-tak",name:"Thee Lor Su Riverside Resort (Umphang, Tak)",cluster:"tak",need:["images/hotels/tak-thee-lor-su-2.jpg","images/hotels/tak-thee-lor-su-3.jpg","images/hotels/tak-thee-lor-su-4.jpg"]},
 {slug:"review-tk-residence-kalasin",name:"TK Residence Kalasin",cluster:"kalasin",need:["images/hotels/kalasin-tk-residence.jpg","images/hotels/kalasin-tk-residence-2.jpg","images/hotels/kalasin-tk-residence-3.jpg","images/hotels/kalasin-tk-residence-4.jpg"]},
 {slug:"review-tokyo-hotel-thung-si-muang-ubon-ratchathani",name:"Tokyo Hotel Ubon Ratchathani",cluster:"ubon-ratchathani",need:["images/hotels/ubon-ratchathani-tokyo-1.jpg","images/hotels/ubon-ratchathani-tokyo-2.jpg","images/hotels/ubon-ratchathani-tokyo-3.jpg","images/hotels/ubon-ratchathani-tokyo-4.jpg"]},
]

phase('Recover')
const res = await parallel(GAPS.map(h => () =>
  agent(`หารูปจริงของโรงแรม/ที่พัก "${h.name}" จังหวัด ${h.cluster} (ประเทศไทย) แล้วดาวน์โหลดมาเก็บไว้ที่ thailandaddict.com

ต้องการรูป ${h.need.length} ไฟล์ — บันทึกที่ path เป๊ะ ๆ ตามนี้ (อย่าเปลี่ยนชื่อ):
${h.need.map((p,i)=>`  ${i+1}. astro/public/${p}`).join('\n')}
ไฟล์แรก = รูป hero หลัก (ภายนอก/อาคาร/ล็อบบี้สวย ๆ) · ที่เหลือ = รูปห้องพัก/สิ่งอำนวยความสะดวก/บรรยากาศ

วิธีหา (เรียงตามลำดับ):
1. ค้น Google/Booking/Agoda/Trip.com/Google Maps ชื่อโรงแรมนี้ในจังหวัด ${h.cluster} → เปิดหน้าโรงแรม → หา URL รูปจริง (รูปโปรไฟล์/แกลเลอรีของโรงแรม) — โรงแรมจริงรูปจาก booking site ใช้ self-host ได้ตามแนวทางเว็บ
2. ดาวน์โหลดด้วย Bash เสมอใส่ timeout: **curl -m 60 --connect-timeout 20 -L -A "Mozilla/5.0" -o "astro/public/<path>" "<imgurl>"**
3. ตรวจไฟล์ > 15KB จริง (ls -l) ถ้าเล็ก/พังลองรูปอื่นของโรงแรมเดิม
4. ถ้าหารูปโรงแรมนี้ตรง ๆ ไม่ได้จริง ๆ (โรงแรมเล็ก/เกสต์เฮาส์ไม่มีรูปออนไลน์) → หาเฉพาะไฟล์แรก (hero) เป็นรูป **อาคารโรงแรม/ห้องพัก/ทำเลย่านนั้นในจังหวัด ${h.cluster}** จาก Unsplash/Pexels (รูปโรงแรม/ห้องพักทั่วไปที่ดูสมจริง) แล้วที่เหลือปล่อยไว้ (เว็บมี gradient placeholder รองรับแล้ว) · รายงาน SKIPPED ไฟล์ที่หาไม่ได้

⚠️ ห้ามใช้ rm/ลบไฟล์ใด ๆ · curl -o ตรงไป path ปลายทางเท่านั้น · ห้ามสร้าง temp/test file
รายงานสั้น ๆ: ได้กี่ไฟล์ จากแหล่งไหน, ไฟล์ไหน SKIPPED`,
    { label:`img:${h.slug}`, phase:'Recover' }).then(()=>({slug:h.slug,ok:true})).catch(()=>({slug:h.slug,ok:false}))
))
log(`Recover agents done: ${res.filter(x=>x&&x.ok).length}/${GAPS.length}`)
return { hotels: GAPS.length, agentsOk: res.filter(x=>x&&x.ok).length }

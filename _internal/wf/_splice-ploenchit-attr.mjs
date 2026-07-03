import fs from 'fs';
const P = 'astro/src/content/articles/top10-attractions-ploenchit.json';
const a = JSON.parse(fs.readFileSync(P, 'utf8'));
const S = 'top5-hotels-ploenchit-bangkok.html';
const SL = 'ที่พักทำเลดีย่านเพลินจิต-วิทยุ';
const mh = (n, ar) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(n + ' ' + ar)}`;

const akaraDesc =
`<p>ถ้าคุณยืนอยู่บนชั้น 58 ของ One City Centre แล้วมองลงไปผ่านพื้นกระจกเงา จะรู้สึกว่ากรุงเทพฯ ลอยอยู่ใต้เท้า นั่นคือ <strong>Bangkok Reflection</strong> หนึ่งในไฮไลต์ของ Akara Sky Hanuman — ประสบการณ์บนฟ้าที่ผสมมุมมองเมือง 360 องศาเข้ากับศิลปะอิมเมอร์ซีฟ วัฒนธรรมไทย และบาร์ระฟ้าในที่เดียว ตัวอาคารเชื่อมตรงกับ BTS เพลินจิต เดินแค่ราว 100 เมตรก็ถึง ไม่ต้องง้อรถ</p>` +
`<p>ภายในแบ่งเป็น 10 โซนใน 3 ชั้น โซนที่คนพูดถึงมากสุดคือ <strong>Bangkok Reflection</strong> ชั้น 58 หอสังเกตการณ์สองชั้นปูพื้นกระจกเงา จนขอบฟ้ากับพื้นกลายเป็นภาพสะท้อนซ้อนกัน ถัดมามีห้อง <strong>Virtual Sky Lantern</strong> ที่โปรเจกต์ภาพโคมลอยดิจิทัลลอยขึ้นฟ้าคล้ายยี่เป็ง ส่วนชั้น 61 เป็นดาดฟ้าเปิดโล่ง มี Sky Night Market สตรีตฟู้ดความสูง และ Hanuman Sky Bar พร้อมดีเจและโชว์วัฒนธรรมทุกคืน</p>` +
`<p>รอบกลางวัน (11.00–15.30 น.) เหมาะกับคนอยากชมวิวกว้างและถ่ายรูปแบบไม่แออัด บัตรเริ่มราว 890 บาท รวมเครื่องดื่ม Signature 1 แก้ว ส่วน Sunset Pass ราว 1,500 บาท ดูได้ทั้งแสงทองและไฟเมืองในทริปเดียว ควรจองบัตรออนไลน์ล่วงหน้าเพราะแต่ละรอบมี time slot กำหนด แต่เข้าแล้วไม่จำกัดเวลาในรอบนั้น</p>` +
`<p>ทำเลอยู่ที่ 548 One City Centre ถนนเพลินจิต ปทุมวัน ลงจาก BTS เพลินจิตแล้วเดิน skywalk เข้าตึกได้เลย ไม่เกิน 3 นาที เหมาะกับคู่รัก กลุ่มเพื่อน และคนที่อยากเห็นกรุงเทพฯ ในมุมที่ไม่เคยเห็น</p>`;

const oneBkkDesc =
`<p>ไม่กี่ก้าวจาก BTS เพลินจิต มีพื้นที่สาธารณะที่หลายคนยังไม่รู้จักดีพอ — ลาน <strong>Public Art Collection</strong> ของ One Bangkok บนถนนวิทยุ คอมเพล็กซ์มิกซ์ยูสที่ใหญ่ที่สุดในไทย เปิดให้ทุกคนเดินชมงานศิลปะระดับโลกได้ฟรี ไม่มีค่าเข้า ไม่ต้องจอง</p>` +
`<p>ไฮไลต์คือ <strong>S-Curve</strong> ของ Anish Kapoor ประติมากรรมสแตนเลสขัดเงาผิวโค้งที่สะท้อนภาพคนดู ท้องฟ้า และอาคารรอบข้างในมุมบิดเบี้ยวน่าทึ่ง ถัดไปคือ <strong>It Is, It Isn't</strong> ของ Tony Cragg สูง 7.8 เมตรที่เปลี่ยนรูปตามมุมมอง รวมถึง <strong>Fly</strong> ประติมากรรมสำริดขนาดใหญ่ที่สุดของ Alex Face ศิลปินสตรีตอาร์ตไทย และ <strong>Zero</strong> ของ Elmgreen &amp; Dragset ทั้งหมดตั้งกระจายตลอดเส้นทางศิลปะยาวกว่า 2 กิโลเมตร</p>` +
`<p>นอกจากงานกลางแจ้ง ยังมี <strong>The Wireless House</strong> อาคารปี ค.ศ. 1914 ที่เล่าประวัติสถานีวิทยุโทรเลขแห่งแรกของไทย เดินเข้าชมได้ฟรี มีแอป Audio Guide ให้สแกน QR ฟังคำอธิบายทั้งไทยและอังกฤษ บรรยากาศรอบคอมเพล็กซ์เปิดโล่ง ร่มรื่น เดินสบายทั้งเช้าและเย็น</p>` +
`<p>ที่ตั้งอยู่ถนนวิทยุ ลุมพินี ปทุมวัน ทางง่ายสุดคือ MRT ลงสถานีลุมพินีแล้วเดินเข้าโครงการ หรือขึ้น BTS เพลินจิตแล้วต่อ shuttle ฟรีทุก 15 นาทีจาก Mahatun Plaza เหมาะกับคนชอบศิลปะ นักถ่ายรูป ครอบครัว หรือใครที่อยากเดินพักแดดในย่านที่เงียบกว่าสุขุมวิท</p>`;

const cards = {
  8: { kind:'restaurant', rank:8, name:'Akara Sky Hanuman — Bangkok Reflection', area:'One City Centre ถนนเพลินจิต ปทุมวัน กรุงเทพฯ',
    cuisine:'จุดชมวิว/แลนด์มาร์ก', signature:'จุดชมวิว 360° + ศิลปะอิมเมอร์ซีฟ พื้นกระจกเงา Bangkok Reflection ชั้น 58–61', priceRange:'890–1,500 บาท',
    fbPage:'https://www.facebook.com/akaraskyhanuman.bangkok/', descHtml:akaraDesc,
    mustOrder:['Bangkok Reflection พื้นกระจกเงา ชั้น 58','Virtual Sky Lantern ห้องโคมลอยดิจิทัล','ดาดฟ้าชั้น 61 วิว 360°','Sunset Pass ดูแสงทอง+ไฟเมือง'],
    tags:['จุดชมวิว','รูฟท็อป','ถ่ายรูป'], mapHref:mh('Akara Sky Hanuman One City Centre','เพลินจิต'), stayHref:S, stayLabel:SL,
    bestFor:'คู่รัก กลุ่มเพื่อน สายถ่ายรูป', zone:'เพลินจิต-วิทยุ', foodType:'แลนด์มาร์ก',
    hours:'ทุกวัน 11:00–02:00 (last entry 01:00)', priceUsd:'$25–42', lat:13.7440, lng:100.5489 },
  10: { kind:'restaurant', rank:10, name:'One Bangkok — ลานศิลปะสาธารณะ Wireless Road', area:'ถนนวิทยุ ลุมพินี ปทุมวัน กรุงเทพฯ',
    cuisine:'ลานศิลปะสาธารณะ/แลนด์มาร์ก', signature:'ลานเดินศิลปะกลางแจ้ง 2 กม. ผลงาน Anish Kapoor · Alex Face · The Wireless House 1914 ชมฟรี', priceRange:'ฟรี',
    fbPage:'https://www.facebook.com/onebangkokth/', descHtml:oneBkkDesc,
    mustOrder:['S-Curve ของ Anish Kapoor','Fly ประติมากรรมสำริดของ Alex Face','The Wireless House อาคารมรดกปี 1914','Audio Guide ฟรีผ่านแอป One Bangkok'],
    tags:['ศิลปะสาธารณะ','ฟรี','เดินเล่น'], mapHref:mh('One Bangkok Wireless Road','ลุมพินี'), stayHref:S, stayLabel:SL,
    bestFor:'คนชอบศิลปะ นักถ่ายรูป ครอบครัว', zone:'เพลินจิต-วิทยุ', foodType:'ลานศิลปะ',
    hours:'พื้นที่กลางแจ้งตลอด 24 ชม. · ร้านค้า 10:00–22:00', priceUsd:'$0', lat:13.7219, lng:100.5468 },
};
let done = [];
for (const b of a.blocks) { if (b.kind === 'restaurant' && cards[b.rank]) { done.push(`${b.rank}:"${b.name.slice(0,18)}"→"${cards[b.rank].name.slice(0,18)}"`); Object.assign(b, {}); } }
a.blocks = a.blocks.map(b => (b.kind === 'restaurant' && cards[b.rank]) ? cards[b.rank] : b);
fs.writeFileSync(P, JSON.stringify(a, null, 2) + '\n');
JSON.parse(fs.readFileSync(P, 'utf8'));
console.log('spliced ploenchit attr:', done.join(' · '));

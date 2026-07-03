import fs from 'fs';
const P = 'astro/src/content/articles/top10-popular-cafes-saphan-taksin.json';
const a = JSON.parse(fs.readFileSync(P, 'utf8'));

const descHtml =
`<p>SWERB Specialty คือร้านกาแฟสเปเชียลตี้ในซอยนางลิ้นจี่ 4 ย่านสาทร ที่ตั้งอยู่ในบ้านเก่าสามชั้นพร้อมชั้นใต้ดิน ก่อนจะเข้าประตูคุณจะเจอกับผนังเขียวชอุ่มจากเถาวัลย์และต้นไม้ที่ขึ้นปกคลุมทั่วหน้าร้าน สร้างบรรยากาศที่รู้สึกเหมือนเดินเข้าสวนเล็ก ๆ ใจกลางเมือง เจ้าของร้านเป็นอดีต motion designer ที่ใช้ชีวิตอยู่ซานฟรานซิสโกกว่าสิบปี กลับมาเปิดร้านนี้ในช่วงโควิด และนำความรู้สึกของ “กาแฟประจำวัน” แบบอเมริกันตะวันตกมาใส่ในร้าน ทำให้ SWERB มีเสน่ห์เฉพาะตัวที่หาจากร้านทั่วไปยาก</p>` +
`<p>เมนูเด่นของร้านคือ Coldpresso — กาแฟสกัดเย็นแบบใช้แรงดันแทนความร้อน ซึ่งให้รสชาติที่สะอาดและซับซ้อนกว่า Cold Brew ทั่วไป นอกจากนี้ยังมี Americano และ Latte จากเมล็ดกาแฟที่เปลี่ยนใหม่ทุกสัปดาห์ตามฤดูกาล บางอาทิตย์เป็น Single Origin จากดอยไทย บางอาทิตย์เป็นเมล็ด Micro Lot จากต่างประเทศ เจ้าของจะแนะนำเมล็ดตามรสที่คุณชอบ ถ้าบอกว่าชอบกลิ่นช็อกโกแลตหรือผลไม้ก็จะได้แก้วที่โดนใจ สำหรับคนไม่ดื่มกาแฟ ยังมี Chai Latte ชงแบบมีฟองนมด้านบน รสอบเชยนำแต่ไม่เผ็ดร้อน และชาร้อนเสิร์ฟในกา</p>` +
`<p>ขนมโฮมเมดในร้านทำสดทุกวัน มีสโคนกับแยม เบเกิลกับทรัฟเฟิลมาโย และโดนัทที่คนรีวิวใน Wongnai พูดถึงบ่อย ราคากาแฟ House Blend อยู่ราว ฿80–100 ต่อแก้ว ถ้าเลือก Single Origin หรือเมล็ดพิเศษจะขึ้นไปถึงราว ฿150–250 โดยรวมค่าใช้จ่ายต่อคนอยู่ในโซนหลักร้อยถึงสี่ร้อยบาท ซึ่งหลายรีวิวบอกว่า “คุ้มกับคุณภาพที่ได้”</p>` +
`<p>ตัวร้านมีหลายโซน ชั้น 1 คือ Coffee Bar หลัก ชั้น 2 เป็นมุมขายของคัดสรร ชั้น 3 เป็นพื้นที่ Co-Working ให้เช่า (ใช้จัดโยคะหรือ wine tasting ก็มี) และชั้นใต้ดินเป็นห้องดูหนัง สายทำงานนั่งได้ทั้งวัน ร้านเปิดอังคาร–ศุกร์ 8:30–17:00 น. เสาร์–อาทิตย์ 9:30–17:00 น. ปิดจันทร์ (ยกเว้นวันหยุดนักขัตฤกษ์) มีที่จอดรถประมาณ 4–5 คัน เป็นร้านที่เป็นมิตรกับสัตว์เลี้ยง เดินทางสะดวกจาก BTS ช่องนนทรี หรือ MRT ลุมพินี แล้วต่อ Grab อีกนิด</p>`;

const name = 'SWERB Specialty';
const area = 'สาทร–นางลิ้นจี่ กรุงเทพฯ';
const block = {
  kind: 'restaurant', rank: 10, name,
  area, cuisine: 'คาเฟ่ / กาแฟ specialty',
  signature: 'Coldpresso กาแฟสกัดเย็นด้วยแรงดัน · เมล็ดหมุนเวียนรายสัปดาห์',
  priceRange: '฿80–250/แก้ว',
  igPost: 'C9wGgkuPa4m',
  fbPage: 'https://www.facebook.com/swerbcoffee/',
  descHtml,
  mustOrder: ['Coldpresso', 'Americano (House Blend หมุนเวียน)', 'Chai Latte', 'สโคนโฮมเมด'],
  tags: ['specialty coffee', 'Coldpresso', 'บ้านเก่า', 'pet-friendly'],
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + area)}`,
  stayHref: 'top8-hotels-saphan-taksin-bangkok.html',
  stayLabel: 'ที่พักทำเลดีย่านสะพานตากสิน-บางรัก',
  bestFor: 'คอกาแฟจริงจัง · สายนั่งทำงานทั้งวัน · ชอบตามเมล็ดพิเศษ',
  zone: 'สาทร', foodType: 'คาเฟ่',
  rating: 4.4, ratingCount: 27, ratingSrc: 'Wongnai',
  hours: 'อ–ศ 8:30–17:00 · ส–อา 9:30–17:00 · ปิดจันทร์',
  priceUsd: '$3–7', englishMenu: false, lat: 13.7229, lng: 100.5251,
};

const idx = a.blocks.findIndex(b => b.kind === 'restaurant' && b.rank === 10);
if (idx < 0) { console.error('no rank-10 block'); process.exit(1); }
const old = a.blocks[idx].name;
a.blocks[idx] = block;
fs.writeFileSync(P, JSON.stringify(a, null, 2) + '\n');
JSON.parse(fs.readFileSync(P, 'utf8'));
const tl = (descHtml.replace(/<[^>]+>/g, '').match(/[฀-๿]/g) || []).length;
console.log(`spliced cafe rank-10: "${old}" -> "${name}" · descHtml Thai chars=${tl} · JSON valid`);

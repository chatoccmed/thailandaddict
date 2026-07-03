import fs from 'fs';
const P = 'astro/src/content/articles/top10-popular-restaurants-victory-monument.json';
const a = JSON.parse(fs.readFileSync(P, 'utf8'));

const descHtml =
`<p>ถ้าขึ้นลงอนุสาวรีย์ชัยสมรภูมิบ่อย แล้วยังไม่เคยแวะร้านนี้ถือว่าพลาด ส้มตำออนซอนเดตั้งอยู่ชั้น 1 อาคารวิคตอรี่คอร์นเนอร์ ฝั่งติดถนนพญาไท ลงบันไดทางออก 4 ของ BTS อนุสาวรีย์ชัยฯ ก็ถึงเลย สะดวกมากสำหรับผู้ป่วยหรือญาติที่นั่งรถไฟฟ้ามาจากโรงพยาบาลราชวิถี โรงพยาบาลเด็ก หรือพระมงกุฎเกล้าในย่านเดียวกัน แวะกินมื้อกลางวันหรือมื้อเย็นได้ก่อนขึ้นรถกลับต่างจังหวัด</p>` +
`<p>จุดเด่นของร้านคือเมนูส้มตำที่มีมากกว่า 20 แบบ ตั้งแต่ <strong>ตำถาดระเบิด</strong> ที่รวมวัตถุดิบเกือบทั้งครัวไว้จานเดียว ไปจนถึง <strong>ตำข้าวโพดไข่เค็ม</strong> รสหวานนัวปนเค็ม <strong>ตำลาวมะกอก</strong> รสเปรี้ยวหอม และ <strong>ตำหลวงพระบาง</strong> สไตล์ลาวกลมกล่อม แจ้งระดับความเผ็ดได้ตั้งแต่ไม่เผ็ดจนถึงเผ็ดจัด นอกจากตำยังมี <strong>ไก่ย่างอบโอ่ง</strong> ผิวกรอบเนื้อนุ่มกลิ่นควันหอม <strong>ลาบหมู</strong> รสจัดเครื่องแน่น และซั่วข้าวปุ้นกากหมูที่หากินยากในกรุงเทพฯ ราคาเฉลี่ย 100–200 บาทต่อคน อิ่มไม่หนักกระเป๋า</p>` +
`<p>บรรยากาศร้านมีแอร์ นั่งสบาย รองรับกลุ่มใหญ่ได้ ตกแต่งอบอุ่นด้วยโคมสานและกล่องเมนูสีสด รีวิวใน Wongnai และ Lemon8 ชมว่าบริการไว สะอาด และรสชาติสม่ำเสมอทุกครั้งที่มา เหมาะกับมื้อที่อยากอิ่มเร็ว รสแซ่บ ราคาไม่แพง คนต่างจังหวัดสายอีสานที่มากรุงเทพฯ ด้วยธุระโรงพยาบาลจะคุ้นเคยกับเมนูทันที</p>` +
`<p>ร้านเปิดทุกวัน 11:30–22:00 น. รับเดลิเวอรีผ่าน Grab, Shopee Food และ LINE MAN จอดรถได้ที่อาคารวิคตอรี่คอร์นเนอร์ หรือนั่ง BTS ลงทางออก 4 มาตรง ๆ ข้อควรรู้ก่อนไป: ส้มตำที่นี่เผ็ดจริงตามที่ร้านบอก ถ้าไม่ชินให้แจ้งลดพริกไว้ก่อน และช่วงพักเที่ยง 12:00–13:30 น. คนจะเยอะที่สุด</p>`;

const name = 'ส้มตำออนซอนเด (Somtum Onsunday)';
const area = 'วิคตอรี่คอร์นเนอร์ ชั้น 1 ถ.พญาไท อนุสาวรีย์ชัยฯ กรุงเทพฯ';
const block = {
  kind: 'restaurant', rank: 10, name,
  area, cuisine: 'อาหารอีสาน',
  signature: 'ตำถาดระเบิด · ตำข้าวโพดไข่เค็ม · ไก่ย่างอบโอ่ง',
  priceRange: '฿45–250/คน',
  fbPage: 'https://www.facebook.com/somtumonsunday/',
  descHtml,
  mustOrder: ['ตำถาดระเบิด', 'ตำข้าวโพดไข่เค็ม', 'ไก่ย่างอบโอ่ง', 'ลาบหมู'],
  tags: ['อีสาน', 'ส้มตำ', 'ใกล้ BTS', 'ราคาประหยัด'],
  mapHref: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + area)}`,
  stayHref: 'top10-hotels-victory-monument-bangkok.html',
  stayLabel: 'ที่พักทำเลดีย่านอนุสาวรีย์ชัยฯ ใกล้โรงพยาบาล',
  bestFor: 'ญาติผู้ป่วย-คนต่างจังหวัดสายอีสาน · มื้อด่วนใกล้ BTS',
  zone: 'อนุสาวรีย์ชัยฯ', foodType: 'อาหารอีสาน/ส้มตำ',
  rating: 4.2, ratingCount: 24, ratingSrc: 'Wongnai',
  hours: 'ทุกวัน 11:30–22:00',
  priceUsd: '$3–7', spice: 'เผ็ดจัด (ปรับได้)', lat: 13.7637272, lng: 100.5380041,
};

const idx = a.blocks.findIndex(b => b.kind === 'restaurant' && b.rank === 10);
if (idx < 0) { console.error('no rank-10'); process.exit(1); }
const old = a.blocks[idx].name;
a.blocks[idx] = block;
fs.writeFileSync(P, JSON.stringify(a, null, 2) + '\n');
JSON.parse(fs.readFileSync(P, 'utf8'));
const tl = (descHtml.replace(/<[^>]+>/g, '').match(/[฀-๿]/g) || []).length;
console.log(`spliced victory r10: "${old}" -> "${name}" · Thai chars=${tl} · valid`);

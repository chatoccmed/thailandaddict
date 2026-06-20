// งาน 3 — 12Go transport route guides ("How to get from X to Y").
// AEO-first (the question foreigners ask AI most), unified TH/EN spec → aligned blocks,
// EN native zero-Thai. Durations are well-known approximations; cost shown as relative
// tiers (฿/฿฿/฿฿฿) — NOT fabricated prices. Booking via 12Go placeholder __12GO_AID__
// (homepage affiliate landing — no fabricated route URLs). Writes articles{,-en}.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const DATE = '2026-06-20';
const CRUMB_HREF = 'plan-your-trip.html';
const GO12 = 'https://12go.asia/en?z=__12GO_AID__';
const cta12 = (routeTh, routeEn) => ({
  th: { text: `เช็กตารางเวลาและราคาล่าสุด แล้วจองตั๋ว${routeTh}ออนไลน์ในที่เดียว`, label: '🚌 เช็กตาราง & จองตั๋วบน 12Go →', href: GO12 },
  en: { text: `Check live schedules and prices, then book ${routeEn} tickets in one place`, label: '🚌 Check times & book on 12Go →', href: GO12 },
});

// sibling routes for cross-linking
const SROUTE = {
  'bangkok-to-chiang-mai': { th: '🚆 กรุงเทพ → เชียงใหม่', en: '🚆 Bangkok → Chiang Mai' },
  'bangkok-to-phuket': { th: '✈️ กรุงเทพ → ภูเก็ต', en: '✈️ Bangkok → Phuket' },
  'bangkok-to-krabi': { th: '✈️ กรุงเทพ → กระบี่', en: '✈️ Bangkok → Krabi' },
  'bangkok-to-pattaya': { th: '🚐 กรุงเทพ → พัทยา', en: '🚐 Bangkok → Pattaya' },
  'bangkok-to-ayutthaya': { th: '🚆 กรุงเทพ → อยุธยา', en: '🚆 Bangkok → Ayutthaya' },
  'bangkok-to-koh-samui': { th: '🏝️ กรุงเทพ → เกาะสมุย', en: '🏝️ Bangkok → Koh Samui' },
  'phuket-to-phi-phi': { th: '⛴️ ภูเก็ต → เกาะพีพี', en: '⛴️ Phuket → Phi Phi' },
  'krabi-to-phuket': { th: '🚐 กระบี่ → ภูเก็ต', en: '🚐 Krabi → Phuket' },
  'surat-thani-to-koh-samui': { th: '⛴️ สุราษฎร์ → เกาะสมุย/พะงัน/เต่า', en: '⛴️ Surat Thani → Samui/Phangan/Tao' },
  'suvarnabhumi-airport-to-bangkok': { th: '✈️ สนามบินสุวรรณภูมิ → ในเมือง', en: '✈️ Suvarnabhumi → city' },
  'bangkok-bts-mrt-guide': { th: '🚇 BTS & MRT กรุงเทพ', en: '🚇 Bangkok BTS & MRT' },
  'chiang-mai-to-pai': { th: '🚐 เชียงใหม่ → ปาย', en: '🚐 Chiang Mai → Pai' },
};
const RORDER = Object.keys(SROUTE);

const ROUTES = [
{
  slug:'bangkok-to-chiang-mai', emoji:'🚆', hero:'chiang-mai',
  subTh:'เครื่องบิน รถไฟกลางคืน รถบัส', subEn:'flights, overnight train, buses',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เร็วและคุ้มสุดคือเครื่องบิน ใช้เวลาบินราว 1 ชั่วโมง 15 นาที และถ้าจองล่วงหน้าราคามักไม่แพง ถ้าชอบบรรยากาศและประหยัดค่าที่พักหนึ่งคืน รถไฟตู้นอนกลางคืนคือตัวเลือกคลาสสิก ใช้เวลาราว 11–13 ชั่วโมง ส่วนรถบัสถูกสุดแต่ใช้เวลาราว 9–10 ชั่วโมง',
    en:'<strong>Short answer:</strong> Flying is fastest and best value — about 1 hour 15 minutes, and cheap if booked ahead. For atmosphere (and to save a night’s accommodation) the overnight sleeper train is the classic choice at around 11–13 hours. Buses are cheapest but take about 9–10 hours.' },
  options:[
    { mode:{th:'เครื่องบิน',en:'Flight'}, dur:{th:'~1 ชม. 15 นาที',en:'~1h 15m'}, cost:'฿–฿฿', note:{th:'เร็วสุด จองล่วงหน้าคุ้ม',en:'Fastest; cheap if booked early'} },
    { mode:{th:'รถไฟตู้นอน',en:'Sleeper train'}, dur:{th:'~11–13 ชม.',en:'~11–13h'}, cost:'฿', note:{th:'นอนไปตื่นถึง วิวสวย จองตู้นอนล่วงหน้า',en:'Sleep on board, scenic; book berths ahead'} },
    { mode:{th:'รถบัส',en:'Bus / coach'}, dur:{th:'~9–10 ชม.',en:'~9–10h'}, cost:'฿', note:{th:'ถูกสุด ออกจากหมอชิต',en:'Cheapest; departs from Mochit'} },
  ],
  choose:{ th:'ถ้าเวลามีค่า บินคือคำตอบ ราคาเครื่องบินจองล่วงหน้ามักพอ ๆ กับรถไฟตู้นอนชั้นดี แต่ประหยัดเวลาทั้งวัน ถ้าอยากได้ประสบการณ์รถไฟไทยและไม่รีบ เลือกตู้นอนกลางคืนขบวนที่ออกหัวค่ำ จะตื่นมาถึงเชียงใหม่ตอนเช้าพอดี',
    en:'If time matters, fly — booked ahead, airfares are often similar to a good sleeper berth but save you a whole day. If you want the Thai-train experience and are not in a hurry, take an early-evening sleeper and wake up in Chiang Mai in the morning.' },
  faq:[
    { q:{th:'กรุงเทพไปเชียงใหม่ใช้เวลานานแค่ไหน?',en:'How long does Bangkok to Chiang Mai take?'},
      a:{th:'เครื่องบินราว 1 ชั่วโมง 15 นาที รถไฟตู้นอนราว 11–13 ชั่วโมง และรถบัสราว 9–10 ชั่วโมง บินเร็วสุดเมื่อรวมเวลาเดินทางทั้งหมด',
        en:'About 1 hour 15 minutes by plane, 11–13 hours by sleeper train, and 9–10 hours by bus. Flying is fastest once you count total travel time.'} },
    { q:{th:'รถไฟตู้นอนไปเชียงใหม่ควรจองล่วงหน้าไหม?',en:'Should I book the sleeper train in advance?'},
      a:{th:'ควรจองล่วงหน้า โดยเฉพาะตู้นอนชั้นล่างและช่วงไฮซีซั่นหรือวันหยุดยาว ที่นั่งเต็มเร็ว จองออนไลน์ล่วงหน้าได้',
        en:'Yes, especially lower sleeper berths and during high season or long weekends — they sell out fast. You can book online in advance.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-chiang-mai.html','เชียงใหม่','Chiang Mai']],
},
{
  slug:'bangkok-to-phuket', emoji:'✈️', hero:'phuket',
  subTh:'เครื่องบิน รถบัส เวลา ราคา', subEn:'flights, buses, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> วิธีที่ดีที่สุดคือบินตรง ใช้เวลาราว 1 ชั่วโมง 25 นาที มีเที่ยวบินถี่ทั้งวันและราคาถูกถ้าจองล่วงหน้า ไม่มีรถไฟตรงถึงภูเก็ต ทางเลือกประหยัดคือรถบัสจากกรุงเทพซึ่งใช้เวลาราว 12–13 ชั่วโมง',
    en:'<strong>Short answer:</strong> The best way is a direct flight — about 1 hour 25 minutes, with frequent departures all day and cheap fares if booked ahead. There is no direct train to Phuket; the budget option is a long-haul bus from Bangkok, around 12–13 hours.' },
  options:[
    { mode:{th:'เครื่องบิน',en:'Flight'}, dur:{th:'~1 ชม. 25 นาที',en:'~1h 25m'}, cost:'฿–฿฿', note:{th:'เที่ยวบินถี่ คุ้มสุดเมื่อรวมเวลา',en:'Frequent; best value overall'} },
    { mode:{th:'รถบัส',en:'Bus / coach'}, dur:{th:'~12–13 ชม.',en:'~12–13h'}, cost:'฿', note:{th:'ถูกสุด มีรถนอน VIP กลางคืน',en:'Cheapest; overnight VIP coaches'} },
    { mode:{th:'รถไฟ + รถบัส',en:'Train + bus'}, dur:{th:'~15+ ชม.',en:'~15h+'}, cost:'฿', note:{th:'นั่งรถไฟถึงสุราษฎร์ฯ แล้วต่อรถ',en:'Train to Surat Thani, then a bus'} },
  ],
  choose:{ th:'สำหรับเส้นนี้บินคุ้มที่สุดเกือบทุกกรณี เพราะราคาตั๋วโลว์คอสต์มักพอ ๆ กับค่ารถบัส VIP แต่ประหยัดเวลาเป็นสิบชั่วโมง เลือกรถบัสเฉพาะถ้าชอบเดินทางทางบกหรืออยากแวะเมืองระหว่างทาง',
    en:'For this route, flying wins in almost every case — budget airfares are often similar to a VIP coach but save you ten-plus hours. Choose the bus only if you prefer overland travel or want to stop along the way.' },
  faq:[
    { q:{th:'มีรถไฟจากกรุงเทพไปภูเก็ตไหม?',en:'Is there a train from Bangkok to Phuket?'},
      a:{th:'ไม่มีรถไฟตรงถึงภูเก็ตเพราะไม่มีรางถึงเกาะ ทางรถไฟไปได้ไกลสุดถึงสุราษฎร์ธานีหรือตรัง แล้วต้องต่อรถบัสหรือรถตู้เข้าภูเก็ต',
        en:'There is no direct train to Phuket as the rail line does not reach the island. Trains go as far as Surat Thani or Trang, then you transfer by bus or minivan into Phuket.'} },
    { q:{th:'บินกรุงเทพไปภูเก็ตนานแค่ไหน?',en:'How long is the flight from Bangkok to Phuket?'},
      a:{th:'บินตรงราว 1 ชั่วโมง 25 นาที มีหลายสายการบินและเที่ยวบินถี่ตลอดวัน จองล่วงหน้าได้ราคาดี',
        en:'A direct flight is about 1 hour 25 minutes, with several airlines and frequent departures throughout the day. Book ahead for the best fares.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-phuket.html','ภูเก็ต','Phuket']],
},
{
  slug:'bangkok-to-krabi', emoji:'✈️', hero:'krabi',
  subTh:'เครื่องบิน รถบัส เวลา ราคา', subEn:'flights, buses, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> บินตรงเร็วและคุ้มสุด ใช้เวลาราว 1 ชั่วโมง 25 นาที ลงที่สนามบินกระบี่แล้วต่อรถเข้าเมืองหรืออ่าวนาง ทางเลือกประหยัดคือรถบัสจากกรุงเทพราว 12 ชั่วโมง',
    en:'<strong>Short answer:</strong> A direct flight is fastest and best value — about 1 hour 25 minutes into Krabi Airport, then a transfer to town or Ao Nang. The budget option is a bus from Bangkok, around 12 hours.' },
  options:[
    { mode:{th:'เครื่องบิน',en:'Flight'}, dur:{th:'~1 ชม. 25 นาที',en:'~1h 25m'}, cost:'฿–฿฿', note:{th:'ลงสนามบินกระบี่ ต่อรถเข้าอ่าวนาง',en:'Lands at Krabi Airport; transfer to Ao Nang'} },
    { mode:{th:'รถบัส',en:'Bus / coach'}, dur:{th:'~12 ชม.',en:'~12h'}, cost:'฿', note:{th:'รถนอนกลางคืนจากสายใต้',en:'Overnight coaches from the Southern terminal'} },
    { mode:{th:'บินลงภูเก็ต + รถ',en:'Fly to Phuket + road'}, dur:{th:'~1.5 ชม.บิน + ~3 ชม.รถ',en:'~1.5h fly + ~3h road'}, cost:'฿฿', note:{th:'ตัวเลือกถ้าตั๋วภูเก็ตถูกกว่า',en:'Useful if Phuket fares are cheaper'} },
  ],
  choose:{ th:'บินตรงลงกระบี่สะดวกสุดถ้าราคาตั๋วโอเค ถ้าหาตั๋วกระบี่แพง ลองบินลงภูเก็ตแล้วนั่งรถต่อราว 3 ชั่วโมงก็เป็นทางเลือกที่หลายคนใช้ ส่วนรถบัสเหมาะสายประหยัดที่ไม่ซีเรียสเรื่องเวลา',
    en:'A direct flight to Krabi is easiest if fares are reasonable. If Krabi tickets are pricey, flying into Phuket and taking a roughly 3-hour road transfer is a common alternative. The bus suits budget travelers who are not in a rush.' },
  faq:[
    { q:{th:'สนามบินกระบี่เข้าเมืองหรืออ่าวนางยังไง?',en:'How do I get from Krabi Airport to town or Ao Nang?'},
      a:{th:'มีรถตู้ รถบัสสนามบิน แท็กซี่ และ Grab ให้เลือก อ่าวนางอยู่ห่างจากสนามบินราว 30–40 นาที จองรถรับส่งล่วงหน้าได้ถ้ามากันหลายคน',
        en:'There are minivans, an airport bus, taxis and Grab. Ao Nang is about 30–40 minutes from the airport. You can pre-book a transfer if traveling as a group.'} },
    { q:{th:'กระบี่กับภูเก็ตบินลงที่ไหนดีกว่า?',en:'Should I fly into Krabi or Phuket?'},
      a:{th:'ขึ้นกับว่าจะพักไหนและราคาตั๋ว ถ้าเที่ยวฝั่งกระบี่-อ่าวนาง-เกาะพีพีบินลงกระบี่สะดวกกว่า แต่บางครั้งตั๋วภูเก็ตถูกกว่าและบินถี่กว่า แล้วค่อยต่อรถ',
        en:'It depends on where you stay and on fares. For Krabi, Ao Nang and Phi Phi, flying into Krabi is more convenient, but Phuket sometimes has cheaper, more frequent flights with a road transfer afterward.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-krabi.html','กระบี่','Krabi']],
},
{
  slug:'bangkok-to-pattaya', emoji:'🚐', hero:'chonburi',
  subTh:'รถตู้ รถบัส แท็กซี่ เวลา ราคา', subEn:'minivans, buses, taxis, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> พัทยาอยู่ใกล้กรุงเทพ ขับรถราว 1 ชั่วโมงครึ่งถึง 2 ชั่วโมง วิธีที่ง่ายสุดคือรถตู้หรือรถบัสจากสถานีเอกมัยหรือหมอชิต หรือเหมาแท็กซี่/Grab ถ้ามากันหลายคน ไม่จำเป็นต้องบินเพราะใกล้',
    en:'<strong>Short answer:</strong> Pattaya is close to Bangkok — about 1.5 to 2 hours by road. The easiest options are a minivan or bus from Ekkamai or Mochit, or a taxi/Grab if you are a group. No need to fly; it is too close.' },
  options:[
    { mode:{th:'รถบัส',en:'Bus / coach'}, dur:{th:'~2 ชม.',en:'~2h'}, cost:'฿', note:{th:'ออกจากเอกมัย/หมอชิต ถี่ทั้งวัน',en:'From Ekkamai/Mochit; frequent all day'} },
    { mode:{th:'รถตู้',en:'Minivan'}, dur:{th:'~1.5–2 ชม.',en:'~1.5–2h'}, cost:'฿', note:{th:'เร็วกว่านิด ออกเมื่อเต็มคัน',en:'A bit faster; leaves when full'} },
    { mode:{th:'แท็กซี่/Grab',en:'Taxi / Grab'}, dur:{th:'~1.5–2 ชม.',en:'~1.5–2h'}, cost:'฿฿–฿฿฿', note:{th:'ส่งถึงโรงแรม คุ้มถ้าหารกัน',en:'Door-to-door; good value split between a group'} },
  ],
  choose:{ th:'ถ้ามากันสองสามคนและมีสัมภาระ เหมาแท็กซี่หรือ Grab สะดวกสุดเพราะส่งถึงโรงแรมเลย ถ้ามาคนเดียวหรืองบจำกัด รถบัสจากเอกมัยสบายและตรงเวลา ส่วนรถตู้เร็วแต่บางทีต้องรอเต็มคัน',
    en:'If you are a couple or small group with luggage, a taxi or Grab is easiest — straight to your hotel. Solo or on a budget, the bus from Ekkamai is comfortable and reliable. Minivans are quick but sometimes wait to fill up.' },
  faq:[
    { q:{th:'กรุงเทพไปพัทยาใช้เวลานานแค่ไหน?',en:'How long is Bangkok to Pattaya?'},
      a:{th:'ราว 1 ชั่วโมงครึ่งถึง 2 ชั่วโมงโดยรถ ขึ้นกับสภาพจราจรช่วงออกจากกรุงเทพ ช่วงเย็นวันศุกร์รถมักติดกว่าปกติ',
        en:'About 1.5 to 2 hours by road, depending on traffic leaving Bangkok. Friday evenings are usually busier than normal.'} },
    { q:{th:'มีรถจากสนามบินสุวรรณภูมิตรงไปพัทยาไหม?',en:'Is there transport straight from Suvarnabhumi Airport to Pattaya?'},
      a:{th:'มี มีรถบัสสายสนามบิน–พัทยา และบริการรถรับส่ง/แท็กซี่จากสนามบินสุวรรณภูมิตรงไปพัทยา ไม่ต้องเข้าเมืองกรุงเทพก่อน',
        en:'Yes — there is an airport–Pattaya bus, plus transfer and taxi services straight from Suvarnabhumi to Pattaya, so you do not need to go into Bangkok first.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-pattaya.html','พัทยา','Pattaya']],
},
{
  slug:'bangkok-to-ayutthaya', emoji:'🚆', hero:'ayutthaya',
  subTh:'รถไฟ รถตู้ ทัวร์ เวลา ราคา', subEn:'train, minivan, tours, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> อยุธยาเที่ยวเดย์ทริปจากกรุงเทพได้สบาย วิธีคลาสสิกและถูกสุดคือนั่งรถไฟจากสถานีกรุงเทพ (หัวลำโพง/กรุงเทพอภิวัฒน์) ใช้เวลาราว 1.5–2 ชั่วโมง ส่วนรถตู้จากหมอชิตเร็วราว 1–1.5 ชั่วโมง หรือจะลงเรือล่องแม่น้ำแบบทัวร์ก็ได้',
    en:'<strong>Short answer:</strong> Ayutthaya is an easy day trip from Bangkok. The classic, cheapest way is the train from a Bangkok station — about 1.5–2 hours. A minivan from Mochit is quicker at around 1–1.5 hours, or you can take a river cruise tour.' },
  options:[
    { mode:{th:'รถไฟ',en:'Train'}, dur:{th:'~1.5–2 ชม.',en:'~1.5–2h'}, cost:'฿', note:{th:'ถูกมาก บรรยากาศดี ไม่ต้องจองก็ได้',en:'Very cheap, atmospheric; no booking needed'} },
    { mode:{th:'รถตู้',en:'Minivan'}, dur:{th:'~1–1.5 ชม.',en:'~1–1.5h'}, cost:'฿', note:{th:'เร็วสุด ออกจากหมอชิต',en:'Fastest; departs from Mochit'} },
    { mode:{th:'ทัวร์/ล่องเรือ',en:'Tour / river cruise'}, dur:{th:'เต็มวัน',en:'Full day'}, cost:'฿฿–฿฿฿', note:{th:'รวมไกด์ + วัด + อาหาร',en:'Includes guide, temples and meals'} },
  ],
  choose:{ th:'อยากประหยัดและได้ฟีลคนท้องถิ่น นั่งรถไฟชั้น 3 ราคาหลักสิบบาทก็ถึงแล้ว ถึงอยุธยาเช่าจักรยานหรือมอเตอร์ไซค์ปั่นชมวัดได้ ถ้าอยากสบายมีคนดูแลครบ จองทัวร์เต็มวันหรือทัวร์ล่องเรือกลับกรุงเทพก็คุ้ม',
    en:'To save money and travel like a local, a third-class train ticket costs just a few baht. In Ayutthaya, rent a bicycle or motorbike to tour the temples. For a hassle-free day with everything arranged, a full-day tour or a river-cruise-back option is worth it.' },
  faq:[
    { q:{th:'อยุธยาเที่ยวเดย์ทริปจากกรุงเทพได้ไหม?',en:'Can I do Ayutthaya as a day trip from Bangkok?'},
      a:{th:'ได้สบาย ระยะทางใกล้และเดินทางง่าย ออกเช้ากลับเย็นเที่ยววัดหลักได้ครบ แนะนำเช่าจักรยานหรือมอเตอร์ไซค์ในเมืองเพื่อชมโบราณสถานที่กระจายอยู่',
        en:'Easily — it is close and simple to reach. Leave in the morning and return in the evening to cover the main temples. Renting a bicycle or motorbike in town helps you see the spread-out ruins.'} },
    { q:{th:'นั่งรถไฟไปอยุธยาต้องจองล่วงหน้าไหม?',en:'Do I need to book the train to Ayutthaya?'},
      a:{th:'รถไฟชั้นธรรมดาส่วนใหญ่ซื้อตั๋วหน้าสถานีได้เลยไม่ต้องจอง ขบวนถี่ตลอดวัน ถ้าอยากชัวร์เรื่องเวลาเที่ยวกลับ เช็กตารางก่อน',
        en:'Most ordinary trains can be bought at the station without booking, and they run frequently. If you want to be sure of your return time, check the timetable first.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-ayutthaya.html','อยุธยา','Ayutthaya']],
},
{
  slug:'bangkok-to-koh-samui', emoji:'🏝️', hero:'samui',
  subTh:'เครื่องบิน รถบัส+เรือ เวลา ราคา', subEn:'flights, bus + ferry, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เร็วสุดคือบินตรงเข้าสนามบินเกาะสมุย ใช้เวลาบินราว 1 ชั่วโมง 10 นาที แต่ตั๋วมักแพงกว่าที่อื่น ทางประหยัดคือบินหรือนั่งรถ/รถไฟไปสุราษฎร์ธานีแล้วต่อเรือเฟอร์รี่ข้ามไปสมุย รวมแล้วใช้เวลาหลายชั่วโมงถึงข้ามคืน',
    en:'<strong>Short answer:</strong> Fastest is a direct flight into Koh Samui Airport — about 1 hour 10 minutes, though fares tend to be higher. The budget route is to reach Surat Thani by plane, train or bus, then take a ferry across to Samui, which together takes several hours to overnight.' },
  options:[
    { mode:{th:'บินตรงเข้าสมุย',en:'Direct flight to Samui'}, dur:{th:'~1 ชม. 10 นาที',en:'~1h 10m'}, cost:'฿฿–฿฿฿', note:{th:'สะดวกสุด แต่ตั๋วแพงกว่า',en:'Most convenient; pricier fares'} },
    { mode:{th:'บินสุราษฎร์ฯ + เรือ',en:'Fly Surat Thani + ferry'}, dur:{th:'~1.5 ชม.บิน + ต่อเรือ',en:'~1.5h fly + ferry'}, cost:'฿฿', note:{th:'ประหยัดกว่าบินตรง',en:'Cheaper than flying direct'} },
    { mode:{th:'รถบัส/รถไฟ + เรือ',en:'Bus/train + ferry'}, dur:{th:'~12–15 ชม.',en:'~12–15h'}, cost:'฿', note:{th:'ตั๋วร่วมรถ+เรือข้ามคืน',en:'Combined overnight bus/train + ferry tickets'} },
  ],
  choose:{ th:'งบไม่จำกัดและอยากถึงเร็ว บินตรงเข้าสมุยคุ้มเวลาสุด ถ้าอยากประหยัด บินเข้าสุราษฎร์ธานี (ตั๋วถูกและบินถี่) แล้วต่อเรือเฟอร์รี่ เป็นสูตรยอดนิยม ส่วนตั๋วร่วมรถบัส+เรือข้ามคืนถูกสุดแต่เหนื่อยกว่า',
    en:'If budget is no issue and you want to arrive fast, the direct flight to Samui saves the most time. To save money, fly into Surat Thani (cheaper, frequent flights) then take the ferry — a popular combo. Combined overnight bus-and-ferry tickets are cheapest but more tiring.' },
  faq:[
    { q:{th:'ไปเกาะสมุยวิธีไหนถูกที่สุด?',en:'What is the cheapest way to Koh Samui?'},
      a:{th:'ถูกสุดมักเป็นตั๋วร่วมรถบัสหรือรถไฟกลางคืนจากกรุงเทพไปสุราษฎร์ธานีแล้วต่อเรือเฟอร์รี่ ใช้เวลานานกว่าแต่ประหยัดทั้งค่าเดินทางและค่าที่พักหนึ่งคืน',
        en:'Usually a combined overnight bus or train from Bangkok to Surat Thani plus a ferry. It takes longer but saves on both fare and a night’s accommodation.'} },
    { q:{th:'บินตรงเข้าสมุยกับบินสุราษฎร์ฯ ต่างกันยังไง?',en:'Direct Samui flight vs flying to Surat Thani?'},
      a:{th:'บินตรงเข้าสมุยสะดวกสุดแต่ตั๋วแพงกว่าเพราะสนามบินเอกชน ส่วนบินเข้าสุราษฎร์ธานีตั๋วถูกและบินถี่ แต่ต้องต่อรถและเรือเฟอร์รี่อีกทอด',
        en:'Flying direct to Samui is most convenient but pricier (a private airport). Flying to Surat Thani is cheaper and more frequent, but adds a road transfer and a ferry crossing.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok'],['city-samui.html','เกาะสมุย','Koh Samui'],['city-surat-thani.html','สุราษฎร์ธานี','Surat Thani']],
},
{
  slug:'phuket-to-phi-phi', emoji:'⛴️', hero:'phuket',
  subTh:'เรือเฟอร์รี่ สปีดโบ๊ท ท่าเรือ เวลา', subEn:'ferries, speedboats, piers, time',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> จากภูเก็ตไปเกาะพีพีนั่งเรือจากท่าเรือรัษฎาเป็นหลัก เรือเฟอร์รี่ใช้เวลาราว 2 ชั่วโมง ส่วนสปีดโบ๊ทเร็วกว่าราว 1 ชั่วโมงแต่กระแทกคลื่นมากกว่า ถ้าจะไปเช้า-เย็นกลับนิยมจองเป็นเดย์ทริปที่รวมรับส่งโรงแรม',
    en:'<strong>Short answer:</strong> From Phuket to Phi Phi you take a boat mainly from Rassada Pier. The ferry takes about 2 hours; a speedboat is faster at around 1 hour but bumpier. For a day visit, most people book a day tour that includes hotel pickup.' },
  options:[
    { mode:{th:'เรือเฟอร์รี่',en:'Ferry'}, dur:{th:'~2 ชม.',en:'~2h'}, cost:'฿฿', note:{th:'นิ่งสบาย เหมาะคนเมาเรือ/ค้างคืน',en:'Smoother; good for sea-sickness or staying over'} },
    { mode:{th:'สปีดโบ๊ท',en:'Speedboat'}, dur:{th:'~1 ชม.',en:'~1h'}, cost:'฿฿', note:{th:'เร็วกว่า แต่คลื่นแรงกว่า',en:'Faster but bumpier'} },
    { mode:{th:'เดย์ทริป (รวมรับส่ง)',en:'Day tour (with transfer)'}, dur:{th:'เต็มวัน',en:'Full day'}, cost:'฿฿–฿฿฿', note:{th:'รวมรับส่งโรงแรม + จุดดำน้ำ',en:'Includes hotel pickup + snorkel stops'} },
  ],
  choose:{ th:'ถ้าจะไปนอนค้างที่พีพีดอน เลือกเรือเฟอร์รี่จะนิ่งสบายและขนสัมภาระง่าย ถ้าอยากไปเช้า-เย็นกลับและวนหลายจุด เลือกเดย์ทริปสปีดโบ๊ทที่รวมรับส่งโรงแรมและอุปกรณ์ดำน้ำจะคุ้มและไม่ต้องจัดการเอง',
    en:'If you are staying overnight on Phi Phi Don, the ferry is smoother and easier with luggage. For a day visit hitting several spots, a speedboat day tour with hotel pickup and snorkel gear is good value and saves you arranging anything yourself.' },
  faq:[
    { q:{th:'เรือจากภูเก็ตไปเกาะพีพีใช้เวลานานแค่ไหน?',en:'How long is the boat from Phuket to Phi Phi?'},
      a:{th:'เรือเฟอร์รี่ราว 2 ชั่วโมง สปีดโบ๊ทราว 1 ชั่วโมง ส่วนใหญ่ออกจากท่าเรือรัษฎาทางตะวันออกของเกาะภูเก็ต',
        en:'About 2 hours by ferry and around 1 hour by speedboat, mostly departing from Rassada Pier on the east side of Phuket.'} },
    { q:{th:'ควรไปเกาะพีพีแบบไปเช้า-เย็นกลับหรือค้างคืน?',en:'Should I visit Phi Phi as a day trip or stay overnight?'},
      a:{th:'ไปเช้า-เย็นกลับเหมาะถ้าเวลาน้อยและอยากเก็บไฮไลต์อย่างอ่าวมาหยากับปิเละ ส่วนค้างคืนบนพีพีดอนเหมาะคนอยากเที่ยวชิล ๆ ดูพระอาทิตย์ขึ้น-ตกและเลี่ยงฝูงทัวร์ตอนกลางวัน',
        en:'A day trip suits short schedules and ticking off highlights like Maya Bay and Pileh Lagoon. Staying overnight on Phi Phi Don suits a slower pace, sunrise and sunset, and escaping the midday tour crowds.'} },
  ],
  relCities:[['city-phuket.html','ภูเก็ต','Phuket'],['city-krabi.html','กระบี่','Krabi']],
},
{
  slug:'krabi-to-phuket', emoji:'🚐', hero:'phuket',
  subTh:'รถตู้ รถบัส เรือ เวลา ราคา', subEn:'minivans, buses, ferry, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> กระบี่กับภูเก็ตอยู่ฝั่งอันดามันเหมือนกัน เดินทางทางบกราว 3–4 ชั่วโมงด้วยรถตู้หรือรถบัส มีรถออกถี่ทั้งวัน ในช่วงไฮซีซั่นยังมีเรือเฟอร์รี่เชื่อมสองฝั่งผ่านเกาะพีพีให้เลือกด้วย',
    en:'<strong>Short answer:</strong> Krabi and Phuket are both on the Andaman coast, about 3–4 hours apart overland by minivan or bus, with frequent departures. In high season there are also ferries linking the two via Phi Phi.' },
  options:[
    { mode:{th:'รถตู้',en:'Minivan'}, dur:{th:'~3–3.5 ชม.',en:'~3–3.5h'}, cost:'฿', note:{th:'เร็วและถี่สุด รับส่งหลายจุด',en:'Fastest and most frequent; multiple pickups'} },
    { mode:{th:'รถบัส',en:'Bus / coach'}, dur:{th:'~3.5–4 ชม.',en:'~3.5–4h'}, cost:'฿', note:{th:'นั่งสบายกว่ารถตู้',en:'Roomier than a minivan'} },
    { mode:{th:'เรือเฟอร์รี่ (ไฮซีซั่น)',en:'Ferry (high season)'}, dur:{th:'ครึ่งวัน ผ่านพีพี',en:'Half day via Phi Phi'}, cost:'฿฿', note:{th:'ได้เที่ยวเกาะระหว่างทาง',en:'Island scenery en route'} },
  ],
  choose:{ th:'อยากถึงเร็วและประหยัด เลือกรถตู้หรือรถบัส มีรถรับส่งถึงโรงแรมในหลายเส้นทาง ถ้ามีเวลาและอยากเปลี่ยนบรรยากาศ ลองเรือเฟอร์รี่ผ่านเกาะพีพีในช่วงไฮซีซั่น จะได้เที่ยวเกาะไปในตัว',
    en:'To arrive fast and cheap, take a minivan or bus, many with hotel pickup. If you have time and want a change of scene, the high-season ferry via Phi Phi lets you sightsee along the way.' },
  faq:[
    { q:{th:'กระบี่ไปภูเก็ตใช้เวลานานแค่ไหน?',en:'How long is Krabi to Phuket?'},
      a:{th:'ทางบกราว 3–4 ชั่วโมงด้วยรถตู้หรือรถบัส ขึ้นกับจุดรับส่งและจราจร ส่วนเรือเฟอร์รี่ผ่านพีพีใช้เวลานานกว่าแต่ได้วิว',
        en:'About 3–4 hours overland by minivan or bus, depending on pickups and traffic. The ferry via Phi Phi takes longer but comes with the views.'} },
    { q:{th:'มีเรือตรงจากกระบี่ไปภูเก็ตไหม?',en:'Is there a direct ferry from Krabi to Phuket?'},
      a:{th:'ส่วนใหญ่เป็นเรือที่แวะหรือเปลี่ยนลำที่เกาะพีพี และมักวิ่งเฉพาะช่วงไฮซีซั่นที่ทะเลสงบ นอกฤดูควรใช้ทางบกซึ่งวิ่งทั้งปี',
        en:'Most ferries stop or change at Phi Phi and typically run only in high season when the sea is calm. Off-season, use the overland route, which runs year-round.'} },
  ],
  relCities:[['city-krabi.html','กระบี่','Krabi'],['city-phuket.html','ภูเก็ต','Phuket']],
},
{
  slug:'surat-thani-to-koh-samui', emoji:'⛴️', hero:'koh-phangan',
  subTh:'เรือเฟอร์รี่ ท่าดอนสัก สมุย พะงัน เต่า', subEn:'ferries, Donsak pier, Samui, Phangan, Tao',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> สุราษฎร์ธานีเป็นประตูสู่หมู่เกาะอ่าวไทย จากตัวเมืองหรือสนามบินต่อรถไปท่าเรือ (ส่วนใหญ่ท่าดอนสัก) แล้วนั่งเรือเฟอร์รี่ไปเกาะสมุยราว 1.5 ชั่วโมง ต่อไปเกาะพะงันและเกาะเต่าได้จากท่าเดียวกัน นิยมซื้อตั๋วร่วมรถ+เรือ',
    en:'<strong>Short answer:</strong> Surat Thani is the gateway to the Gulf islands. From the town or airport, transfer to a pier (usually Donsak), then ferry to Koh Samui in about 1.5 hours; Koh Phangan and Koh Tao continue from the same hub. Combined bus-and-ferry tickets are popular.' },
  options:[
    { mode:{th:'รถ + เรือไปสมุย',en:'Coach + ferry to Samui'}, dur:{th:'~2.5–3 ชม. รวม',en:'~2.5–3h total'}, cost:'฿–฿฿', note:{th:'ตั๋วร่วมจากเมือง/สนามบิน',en:'Combined ticket from town/airport'} },
    { mode:{th:'เรือไปเกาะพะงัน',en:'Ferry to Koh Phangan'}, dur:{th:'~2.5–3.5 ชม. รวม',en:'~2.5–3.5h total'}, cost:'฿฿', note:{th:'ต่อจากดอนสัก/ผ่านสมุย',en:'From Donsak / via Samui'} },
    { mode:{th:'เรือไปเกาะเต่า',en:'Ferry to Koh Tao'}, dur:{th:'~3–4 ชม. รวม',en:'~3–4h total'}, cost:'฿฿', note:{th:'ไกลสุดในสามเกาะ',en:'Farthest of the three islands'} },
  ],
  choose:{ th:'ง่ายสุดคือซื้อตั๋วร่วมรถบัส+เรือตั้งแต่ตัวเมืองหรือสนามบินสุราษฎร์ธานี จะมีรถมารับไปท่าเรือและต่อเรือให้ครบ ไม่ต้องจัดการเอง เช็กรอบเรือสุดท้ายของวันให้ดีถ้ามาถึงสุราษฎร์ฯ ตอนเย็น',
    en:'The easiest option is a combined bus-and-ferry ticket bought in Surat Thani town or at the airport — a coach takes you to the pier and the ferry is included. Check the last ferry of the day if you arrive in Surat Thani in the evening.' },
  faq:[
    { q:{th:'จากสนามบินสุราษฎร์ธานีไปเกาะสมุยยังไง?',en:'How do I get from Surat Thani Airport to Koh Samui?'},
      a:{th:'ซื้อตั๋วร่วมรถ+เรือได้ที่สนามบิน จะมีรถพาไปท่าเรือดอนสักแล้วต่อเรือเฟอร์รี่ข้ามไปสมุย รวมเวลาเดินทางราว 2.5–3 ชั่วโมง',
        en:'Buy a combined coach-and-ferry ticket at the airport; a bus takes you to Donsak pier and the ferry crosses to Samui, around 2.5–3 hours in total.'} },
    { q:{th:'เกาะสมุย พะงัน เต่า ไปต่อกันได้ไหม?',en:'Can I island-hop between Samui, Phangan and Tao?'},
      a:{th:'ได้ มีเรือเชื่อมระหว่างสามเกาะนี้ทุกวัน เกาะสมุยอยู่ใกล้สุด ต่อด้วยพะงัน และเต่าไกลสุด วางแผนเรียงเกาะตามระยะจะประหยัดเวลา',
        en:'Yes — daily boats connect all three. Samui is closest, then Phangan, with Tao farthest out. Ordering the islands by distance saves time.'} },
  ],
  relCities:[['city-surat-thani.html','สุราษฎร์ธานี','Surat Thani'],['city-samui.html','เกาะสมุย','Koh Samui'],['city-koh-phangan.html','เกาะพะงัน','Koh Phangan']],
},
{
  slug:'suvarnabhumi-airport-to-bangkok', emoji:'✈️', hero:'bangkok',
  subTh:'รถไฟฟ้าแอร์พอร์ต แท็กซี่ Grab บัส', subEn:'Airport Rail Link, taxi, Grab, bus',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> จากสนามบินสุวรรณภูมิเข้าเมืองกรุงเทพ วิธีถูกและเลี่ยงรถติดที่สุดคือรถไฟฟ้าแอร์พอร์ตเรลลิงก์ ถึงพญาไทราว 30 นาที แล้วต่อ BTS/MRT ส่วนแท็กซี่มิเตอร์หรือ Grab สะดวกถ้ามีสัมภาระเยอะ ใช้เวลาราว 30–60 นาทีแล้วแต่จราจร',
    en:'<strong>Short answer:</strong> From Suvarnabhumi into Bangkok, the cheapest, traffic-proof option is the Airport Rail Link — about 30 minutes to Phaya Thai, then connect to the BTS/MRT. A metered taxi or Grab is convenient with lots of luggage, taking around 30–60 minutes depending on traffic.' },
  options:[
    { mode:{th:'แอร์พอร์ตเรลลิงก์',en:'Airport Rail Link'}, dur:{th:'~30 นาที ถึงพญาไท',en:'~30 min to Phaya Thai'}, cost:'฿', note:{th:'ถูกสุด เลี่ยงรถติด ต่อ BTS/MRT',en:'Cheapest, beats traffic; connects to BTS/MRT'} },
    { mode:{th:'แท็กซี่มิเตอร์',en:'Metered taxi'}, dur:{th:'~30–60 นาที',en:'~30–60 min'}, cost:'฿฿', note:{th:'คิวแท็กซี่ชั้น 1 ขอให้กดมิเตอร์',en:'Use the official taxi queue; ask for the meter'} },
    { mode:{th:'Grab/รถรับส่ง',en:'Grab / private transfer'}, dur:{th:'~30–60 นาที',en:'~30–60 min'}, cost:'฿฿–฿฿฿', note:{th:'เห็นราคาก่อน ส่งถึงโรงแรม',en:'Price upfront; door-to-door'} },
  ],
  choose:{ th:'มาคนเดียวหรือสัมภาระน้อยและที่พักใกล้แนวรถไฟฟ้า แอร์พอร์ตเรลลิงก์ประหยัดและไว ถ้ามากันหลายคน มีกระเป๋าเยอะ หรือถึงดึก แท็กซี่มิเตอร์จากคิวชั้น 1 หรือ Grab สบายกว่า อย่าใช้แท็กซี่ที่มาตื๊อในอาคาร',
    en:'Solo or light on luggage with a hotel near the rail lines? The Airport Rail Link is cheap and fast. Traveling as a group, with lots of bags, or arriving late? A metered taxi from the official queue or a Grab is easier. Avoid touts inside the terminal.' },
  faq:[
    { q:{th:'จากสุวรรณภูมิเข้าเมืองถูกสุดยังไง?',en:'What is the cheapest way from Suvarnabhumi into the city?'},
      a:{th:'รถไฟฟ้าแอร์พอร์ตเรลลิงก์ถูกที่สุดและเลี่ยงรถติดได้ ถึงสถานีพญาไทราว 30 นาที แล้วต่อ BTS หรือ MRT ไปยังย่านที่พัก',
        en:'The Airport Rail Link is cheapest and avoids traffic — about 30 minutes to Phaya Thai, then transfer to the BTS or MRT toward your accommodation.'} },
    { q:{th:'ดอนเมืองกับสุวรรณภูมิคนละสนามบินใช่ไหม?',en:'Are Don Muang and Suvarnabhumi different airports?'},
      a:{th:'ใช่ กรุงเทพมีสองสนามบิน สุวรรณภูมิ (BKK) และดอนเมือง (DMK) อยู่คนละฝั่งเมือง ถ้าต้องต่อเครื่องระหว่างสองที่ เผื่อเวลาเดินทางข้ามเมืองหลายชั่วโมง',
        en:'Yes. Bangkok has two airports — Suvarnabhumi (BKK) and Don Muang (DMK) — on opposite sides of the city. If you connect between them, allow several hours for the cross-town transfer.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok']],
},
{
  slug:'bangkok-bts-mrt-guide', emoji:'🚇', hero:'bangkok',
  subTh:'รถไฟฟ้า บัตรโดยสาร เส้นทาง วิธีใช้', subEn:'skytrain, metro, fares, how to ride',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> วิธีเที่ยวกรุงเทพที่เลี่ยงรถติดได้ดีสุดคือรถไฟฟ้า มีสองระบบหลักคือ BTS (รถไฟฟ้าลอยฟ้า สายสุขุมวิทกับสีลม) และ MRT (ใต้ดิน สายสีน้ำเงินและสีม่วง) ซื้อตั๋วเที่ยวเดียวที่ตู้ได้ หรือใช้บัตรเติมเงิน วิ่งราว 6 โมงเช้าถึงเที่ยงคืน',
    en:'<strong>Short answer:</strong> The best way to get around Bangkok without traffic is the rail network. There are two main systems — the BTS Skytrain (Sukhumvit and Silom lines) and the MRT metro (Blue and Purple lines). Buy single-trip tickets at machines or use a stored-value card; they run from about 6am to midnight.' },
  options:[
    { mode:{th:'BTS สุขุมวิท',en:'BTS Sukhumvit line'}, dur:{th:'ทุก 2–5 นาที',en:'Every 2–5 min'}, cost:'฿', note:{th:'สยาม อโศก ทองหล่อ จตุจักร',en:'Siam, Asok, Thong Lo, Chatuchak'} },
    { mode:{th:'BTS สีลม',en:'BTS Silom line'}, dur:{th:'ทุก 2–5 นาที',en:'Every 2–5 min'}, cost:'฿', note:{th:'สีลม สาทร สะพานตากสิน (ต่อเรือ)',en:'Silom, Sathorn, Saphan Taksin (river boats)'} },
    { mode:{th:'MRT สายสีน้ำเงิน',en:'MRT Blue line'}, dur:{th:'ทุก 5–7 นาที',en:'Every 5–7 min'}, cost:'฿', note:{th:'หัวลำโพง เยาวราช จตุจักร วงกลม',en:'Hua Lamphong, Chinatown, Chatuchak loop'} },
    { mode:{th:'เรือด่วนเจ้าพระยา',en:'Chao Phraya boats'}, dur:{th:'ตามรอบเรือ',en:'By boat schedule'}, cost:'฿', note:{th:'ต่อจาก BTS ตากสิน ไปวัดริมน้ำ',en:'Connects at BTS Taksin to riverside temples'} },
  ],
  choose:{ th:'วางแผนที่พักให้ใกล้สถานี BTS หรือ MRT แล้วชีวิตเที่ยวกรุงเทพจะง่ายขึ้นมาก ถ้าใช้รถไฟฟ้าหลายเที่ยวต่อวัน ซื้อบัตรเติมเงิน (เช่น บัตรแรบบิทของ BTS) จะสะดวกกว่าซื้อตั๋วทีละเที่ยว ส่วนการไปวัดพระแก้ว–วัดโพธิ์ ให้ลง BTS สะพานตากสินแล้วต่อเรือด่วนเจ้าพระยา',
    en:'Pick accommodation near a BTS or MRT station and getting around Bangkok becomes far easier. If you ride several times a day, a stored-value card (such as the BTS Rabbit card) beats buying single tickets each time. For the Grand Palace and Wat Pho, ride to BTS Saphan Taksin and switch to a Chao Phraya express boat.' },
  cta:{ th:{ text:'อยากพักติดรถไฟฟ้าเที่ยวง่าย? ดูโรงแรมทำเลดีใกล้ BTS/MRT ในกรุงเทพ', label:'🏨 ดูที่พักใกล้รถไฟฟ้า กรุงเทพ →', href:'city-bangkok.html#stay' },
    en:{ text:'Want to stay right by the train for easy days out? See well-located hotels near the BTS/MRT in Bangkok', label:'🏨 See stays near the train in Bangkok →', href:'city-bangkok.html#stay' } },
  faq:[
    { q:{th:'BTS กับ MRT ต่างกันยังไง?',en:'What is the difference between the BTS and MRT?'},
      a:{th:'BTS คือรถไฟฟ้าลอยฟ้า ส่วน MRT คือรถไฟฟ้าใต้ดิน เป็นคนละระบบและคนละบัตร แต่มีสถานีเชื่อมต่อกันหลายจุด เช่น อโศก/สุขุมวิท และสยามเป็นชุมทางหลักของ BTS',
        en:'The BTS is the elevated Skytrain and the MRT is the underground metro — separate systems with separate cards, but they interchange at several points such as Asok/Sukhumvit, and Siam is the main BTS hub.'} },
    { q:{th:'ต้องซื้อบัตรพิเศษเพื่อขึ้นรถไฟฟ้าไหม?',en:'Do I need a special card to ride?'},
      a:{th:'ไม่จำเป็น ซื้อตั๋วเที่ยวเดียวที่ตู้หรือเคาน์เตอร์ในสถานีได้เลย แต่ถ้าใช้บ่อยบัตรเติมเงินจะสะดวกกว่าและไม่ต้องต่อคิวซื้อตั๋วทุกครั้ง',
        en:'Not necessarily — buy single-trip tickets at machines or counters in each station. If you ride often, a stored-value card is more convenient and saves queuing each time.'} },
  ],
  relCities:[['city-bangkok.html','กรุงเทพ','Bangkok']],
},
{
  slug:'chiang-mai-to-pai', emoji:'🚐', hero:'pai',
  subTh:'รถตู้ ทางโค้ง 762 โค้ง เวลา ราคา', subEn:'minivans, the 762 curves, time & cost',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> จากเชียงใหม่ไปปายนิยมนั่งรถตู้ ใช้เวลาราว 3–4 ชั่วโมงผ่านทางเขา 762 โค้ง รถออกถี่จากสถานีอาเขต ใครเมารถง่ายควรเตรียมยาและนั่งหน้า ๆ ส่วนสายลุยเช่ามอเตอร์ไซค์หรือขับรถเองได้แต่ทางคดเคี้ยว',
    en:'<strong>Short answer:</strong> From Chiang Mai to Pai, most people take a minivan — about 3–4 hours over a mountain road of 762 curves, with frequent departures from Arcade bus station. If you get carsick, bring medicine and sit near the front. Adventurous travelers rent a motorbike or self-drive, but the road is very winding.' },
  options:[
    { mode:{th:'รถตู้',en:'Minivan'}, dur:{th:'~3–4 ชม.',en:'~3–4h'}, cost:'฿', note:{th:'ถี่สุด ออกจากอาเขต',en:'Most frequent; from Arcade station'} },
    { mode:{th:'เช่ารถ/มอเตอร์ไซค์',en:'Self-drive / motorbike'}, dur:{th:'~3.5–4 ชม.',en:'~3.5–4h'}, cost:'฿฿', note:{th:'อิสระแต่ทางโค้งเยอะ ต้องขับเป็น',en:'Freedom but very winding; ride only if able'} },
    { mode:{th:'รถรับส่งส่วนตัว',en:'Private transfer'}, dur:{th:'~3 ชม.',en:'~3h'}, cost:'฿฿฿', note:{th:'ส่งถึงที่พัก แวะจุดชมวิวได้',en:'Door-to-door; can stop at viewpoints'} },
  ],
  choose:{ th:'รถตู้คุ้มสุดและสะดวกสำหรับคนส่วนใหญ่ จองล่วงหน้าช่วงไฮซีซั่นเพราะที่นั่งเต็มเร็ว ถ้าเมารถง่ายกินยาก่อนออกราว 30 นาทีและเลือกที่นั่งด้านหน้า สายชอบอิสระและขับเป็นจริงค่อยเช่ามอเตอร์ไซค์ เพราะ 762 โค้งไม่ใช่เส้นสำหรับมือใหม่',
    en:'The minivan is best value and convenient for most. Book ahead in high season as seats fill fast. If you get carsick, take medicine about 30 minutes before and sit at the front. Only rent a motorbike if you genuinely know how — the 762 curves are not a route for beginners.' },
  faq:[
    { q:{th:'เชียงใหม่ไปปายนั่งรถตู้นานแค่ไหน?',en:'How long is the minivan from Chiang Mai to Pai?'},
      a:{th:'ราว 3–4 ชั่วโมงผ่านทางเขาที่มีถึง 762 โค้ง รถออกถี่จากสถานีอาเขต ควรจองล่วงหน้าในช่วงไฮซีซั่น',
        en:'About 3–4 hours over a mountain road with 762 curves. Minivans depart frequently from Arcade station; book ahead in high season.'} },
    { q:{th:'เมารถบนทางไปปายทำยังไงดี?',en:'How do I cope with carsickness on the road to Pai?'},
      a:{th:'กินยาแก้เมารถก่อนออกราว 30 นาที เลือกที่นั่งด้านหน้า มองออกไปไกล ๆ และจิบน้ำ ทางมีโค้งต่อเนื่องจึงควรเตรียมตัวแม้ปกติไม่ค่อยเมารถ',
        en:'Take motion-sickness medicine about 30 minutes before, sit near the front, look at the far horizon and sip water. The road curves constantly, so prepare even if you do not usually get carsick.'} },
  ],
  relCities:[['city-chiang-mai.html','เชียงใหม่','Chiang Mai'],['city-pai.html','ปาย','Pai']],
},
];

// ---- builder ----
function relatedFor(route) {
  const i = RORDER.indexOf(route.slug);
  const sib = RORDER[(i + 1) % RORDER.length];
  return {
    th: [
      { href: CRUMB_HREF, title: '🧭 ศูนย์รวมคู่มือเตรียมตัวเที่ยวไทย' },
      { href: 'getting-around-thailand.html', title: '🚌 คู่มือการเดินทางทั่วไทย' },
      ...route.relCities.map((c) => ({ href: c[0], title: `🗺️ เที่ยว${c[1]}` })),
      { href: `${sib}.html`, title: SROUTE[sib].th },
    ],
    en: [
      { href: CRUMB_HREF, title: '🧭 Plan Your Trip hub' },
      { href: 'getting-around-thailand.html', title: '🚌 Getting around Thailand' },
      ...route.relCities.map((c) => ({ href: c[0], title: `🗺️ Explore ${c[2]}` })),
      { href: `${sib}.html`, title: SROUTE[sib].en },
    ],
  };
}
function buildArticle(route, loc) {
  const fromTo = loc === 'en' ? `${route.relCities[0][2]} to ${route.relCities[route.relCities.length - 1][2] || route.relCities[0][2]}` : '';
  const cta = route.cta || cta12(
    route.slug === 'bangkok-bts-mrt-guide' ? 'รถไฟฟ้ากรุงเทพ' : 'เส้นทางนี้',
    'this route');
  const isMetro = route.slug === 'bangkok-bts-mrt-guide';
  const title = loc === 'en'
    ? (isMetro ? `Bangkok BTS & MRT Guide 2026 — Lines, Fares & How to Ride | ThailandAddict`
        : `How to Get from ${route.relCities[0][2]} to ${route.relCities[route.relCities.length - 1][2]} 2026 — ${route.subEn} | ThailandAddict`)
    : (isMetro ? `รถไฟฟ้า BTS & MRT กรุงเทพ 2026 — เส้นทาง บัตรโดยสาร วิธีใช้ | ThailandAddict`
        : `${route.relCities[0][1]}ไป${route.relCities[route.relCities.length - 1][1]} ไปยังไงดี 2026 — ${route.subTh} | ThailandAddict`);
  const h1 = loc === 'en'
    ? (isMetro ? `Bangkok BTS & MRT<br>rider’s guide` : `How to get from<br>${route.relCities[0][2]} to ${route.relCities[route.relCities.length - 1][2]}`)
    : (isMetro ? `รถไฟฟ้า BTS & MRT<br>กรุงเทพ` : `${route.relCities[0][1]} ไป ${route.relCities[route.relCities.length - 1][1]}<br>ไปยังไงดี`);
  const metaDesc = loc === 'en'
    ? (isMetro ? `How to ride Bangkok’s BTS Skytrain and MRT metro — the lines, where they go, fares and tickets, plus how to connect to the Chao Phraya river boats.`
        : `The best ways to travel from ${route.relCities[0][2]} to ${route.relCities[route.relCities.length - 1][2]} — ${route.subEn}, how long each takes, what it costs and which to choose, with live booking on 12Go.`)
    : (isMetro ? `วิธีใช้รถไฟฟ้า BTS และ MRT ในกรุงเทพ เส้นทางสายต่าง ๆ ค่าโดยสาร การซื้อตั๋ว และการต่อเรือด่วนเจ้าพระยา เที่ยวกรุงเทพแบบเลี่ยงรถติด`
        : `${route.relCities[0][1]}ไป${route.relCities[route.relCities.length - 1][1]}ไปยังไงดี เทียบ${route.subTh} ใช้เวลาเท่าไหร่ ราคาประมาณไหน และเลือกแบบไหนดี พร้อมจองตั๋วบน 12Go`);
  const eyebrow = loc === 'en' ? 'Getting around' : 'การเดินทาง';
  const intro = loc === 'en'
    ? (isMetro ? `Bangkok’s traffic is legendary, but its rail network makes the city easy to explore. Here is how the BTS and MRT work, where they go, and how to ride them like a local.`
        : `One of the most-asked questions for this trip: how do you actually get from ${route.relCities[0][2]} to ${route.relCities[route.relCities.length - 1][2]}? Here are your options compared, with the honest pick for most travelers.`)
    : (isMetro ? `รถติดเป็นเรื่องคู่กรุงเทพ แต่รถไฟฟ้าทำให้เที่ยวเมืองนี้ง่ายขึ้นเยอะ บทความนี้สรุปว่า BTS กับ MRT มีสายอะไรบ้าง ไปไหนได้ และใช้ยังไงให้คล่องเหมือนคนกรุง`
        : `หนึ่งในคำถามที่คนถามบ่อยสุดของทริปนี้คือ ${route.relCities[0][1]}ไป${route.relCities[route.relCities.length - 1][1]} ไปยังไงดี บทความนี้เทียบทุกตัวเลือกให้ พร้อมคำแนะนำตรง ๆ ว่าส่วนใหญ่ควรเลือกแบบไหน`);
  const chips = loc === 'en'
    ? [`${route.options[0].dur.en} ${route.options[0].mode.en.toLowerCase()}`, 'Compare every option', 'Book online ahead']
    : [`${route.options[0].mode.th} ${route.options[0].dur.th}`, 'เทียบทุกตัวเลือก', 'จองล่วงหน้าได้'];

  const blocks = [
    { kind: 'p', html: route.quick[loc] },
    { kind: 'h2', text: loc === 'en' ? 'Your travel options' : 'ตัวเลือกการเดินทาง', id: 'options' },
    { kind: 'table',
      caption: loc === 'en' ? 'Options compared (฿ = relative cost; check live fares to confirm)' : 'เทียบตัวเลือก (฿ = ระดับราคาคร่าว ๆ · เช็กราคาจริงอีกที)',
      headers: loc === 'en' ? ['Mode', 'Duration', 'Cost', 'Notes'] : ['วิธี', 'เวลา', 'ราคา', 'หมายเหตุ'],
      rows: route.options.map((o) => [o.mode[loc], o.dur[loc], o.cost, o.note[loc]]) },
    { kind: 'h2', text: loc === 'en' ? 'Which should you choose?' : 'เลือกแบบไหนดี', id: 'choose' },
    { kind: 'p', html: route.choose[loc] },
    { kind: 'cta', text: cta[loc].text, href: cta[loc].href, label: cta[loc].label },
  ];
  const rel = relatedFor(route)[loc];
  return {
    slug: route.slug, type: 'prep', cluster: 'thailand',
    title, metaDesc, keywords: undefined,
    ogTitle: title.split(' | ')[0], ogDesc: metaDesc,
    image: `/images/heroes/${route.hero}.jpg`,
    crumbCity: loc === 'en' ? 'Getting Around' : 'การเดินทาง', crumbCityHref: CRUMB_HREF,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow, h1, heroEmoji: route.emoji, heroImg: `/images/heroes/${route.hero}.jpg`,
    intro, chips, readTime: loc === 'en' ? '5 min read' : '5 นาที',
    publishedDate: DATE, modifiedDate: DATE,
    blocks,
    faq: route.faq.map((f) => ({ q: f.q[loc], a: f.a[loc] })),
    related: rel,
  };
}

let n = 0; const leaks = [];
for (const route of ROUTES) {
  const th = buildArticle(route, 'th');
  const en = buildArticle(route, 'en');
  // drop undefined keys (keywords) so TH/EN key sets match exactly
  for (const o of [th, en]) Object.keys(o).forEach((k) => o[k] === undefined && delete o[k]);
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) throw new Error('block mismatch ' + route.slug);
  if (/[ก-฾เ-๛]/.test(JSON.stringify(en))) leaks.push(route.slug);
  fs.writeFileSync(path.join(A_TH, route.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, route.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
  n++;
}
console.log(JSON.stringify({ written: n, slugs: ROUTES.map((r) => r.slug), enThaiLeaks: leaks }, null, 2));

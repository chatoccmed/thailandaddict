// "Best X for Y" AEO listicles — ranked destination guides that answer real search/voice queries
// (best islands for snorkeling, family beaches, cool-season mountains, honeymoon escapes, nightlife,
// rainy-season trips). Each item links to a REAL city hub + its where-to-stay guide — nothing
// fabricated, all destinations already covered on the site. Writes articles{,-en}; surfaced on the
// destinations hub (gen-hubs BESTOF) + search index. Run: node _internal/gen-best-of.mjs
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const PUB = path.join(ROOT, 'astro/public');
const DATE = '2026-06-21';
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);

const LISTS = [
{ slug: 'best-islands-snorkeling-thailand', hero: 'koh-lipe', emoji: '🤿',
  th: { eyebrow: 'เกาะ & ดำน้ำ', h1: 'เกาะไหนน้ำใส<br>ดำน้ำสวยที่สุด', title: 'เกาะไหนน้ำใสดำน้ำตื้นสวยที่สุดในไทย 2026 — 6 เกาะที่เลือกได้เลย | ThailandAddict',
    metaDesc: 'อยากดำน้ำตื้นน้ำใส ๆ ในไทยไปเกาะไหนดี? รวม 6 เกาะ/จุดน้ำใสที่สุด เหลีเป๊ะ ตรัง สิมิลัน เกาะกูด เกาะหมาก เกาะเต่า พร้อมที่พักแต่ละที่',
    intro: 'รวมเกาะและจุดดำน้ำตื้น-ลึกที่น้ำใสที่สุดในไทย เลือกตามฝั่งทะเลและสไตล์ พร้อมลิงก์ที่พักของแต่ละที่',
    quick: '<strong>คำตอบสั้น ๆ:</strong> ฝั่งอันดามันน้ำใสสุดคือ <strong>เกาะหลีเป๊ะ</strong> และหมู่เกาะ <strong>สิมิลัน</strong> (ออกจากเขาหลัก) ส่วน <strong>ตรัง</strong> (เกาะกระดาน-เกาะไหง) น้ำใสและมีถ้ำมรกต ฝั่งตะวันออก <strong>เกาะกูด-เกาะหมาก</strong> น้ำนิ่งใส ส่วนสายดำน้ำลึก <strong>เกาะเต่า</strong> (ออกจากชุมพร) คือเมกกะของนักดำน้ำ' },
  en: { eyebrow: 'Islands & snorkeling', h1: 'Clearest water,<br>best snorkeling islands', title: 'Best Islands for Snorkeling & Clear Water in Thailand 2026 — 6 Picks | ThailandAddict',
    metaDesc: 'Where to snorkel in clear water in Thailand? Six of the clearest islands and dive spots — Koh Lipe, Trang, the Similans, Koh Kood, Koh Mak and Koh Tao — with where to stay at each.',
    intro: 'The clearest-water islands and snorkel/dive spots in Thailand, sorted by coast and style, each with a link to where to stay.',
    quick: '<strong>Short answer:</strong> On the Andaman side the clearest water is at <strong>Koh Lipe</strong> and the <strong>Similan Islands</strong> (from Khao Lak), while <strong>Trang</strong> (Koh Kradan/Koh Ngai) has clear water and the Emerald Cave. On the east, <strong>Koh Kood and Koh Mak</strong> have calm, clear water; for serious diving, <strong>Koh Tao</strong> (from Chumphon) is the mecca.' },
  items: [
    { name: { th: 'เกาะหลีเป๊ะ (สตูล)', en: 'Koh Lipe (Satun)' }, href: 'city-koh-lipe.html', stayHref: 'where-to-stay-koh-lipe.html',
      blurb: { th: 'น้ำใสสุดของอันดามันใต้ หาดทรายขาวละเอียด ดำน้ำตื้นรอบเกาะได้เลย มีวอล์กกิงสตรีทและรีสอร์ตครบ', en: 'The clearest water in the lower Andaman, with fine white sand and snorkeling right off the island, plus a walking street and resorts.' },
      tags: { th: ['น้ำใสสุด', 'ดำน้ำตื้นรอบเกาะ'], en: ['Clearest water', 'Snorkel off the beach'] } },
    { name: { th: 'หมู่เกาะสิมิลัน (เขาหลัก/พังงา)', en: 'Similan Islands (Khao Lak)' }, href: 'city-phang-nga.html', stayHref: 'where-to-stay-khao-lak.html',
      blurb: { th: 'จุดดำน้ำระดับโลก น้ำใสมาก ปะการังสมบูรณ์ ออกเรือจากเขาหลัก เปิดราวกลาง ต.ค.–กลาง พ.ค. (ปิดหน้ามรสุม)', en: 'A world-class dive area with very clear water and healthy reefs, reached by boat from Khao Lak; open roughly mid-Oct to mid-May (closed in the monsoon).' },
      tags: { th: ['ดำน้ำลึก', 'ปะการังสมบูรณ์'], en: ['Scuba', 'Healthy reefs'] } },
    { name: { th: 'เกาะตรัง (เกาะกระดาน-เกาะไหง)', en: 'Trang Islands (Kradan/Ngai)' }, href: 'city-trang.html', stayHref: 'where-to-stay-trang.html',
      blurb: { th: 'หาดทรายขาวน้ำใส ดำน้ำตื้นสวย และมีถ้ำมรกตที่ต้องว่ายลอดเข้าไป เงียบกว่าเกาะดัง ๆ', en: 'White sand, clear water and lovely snorkeling, plus the Emerald Cave you swim into — quieter than the famous islands.' },
      tags: { th: ['ถ้ำมรกต', 'เงียบ'], en: ['Emerald Cave', 'Quiet'] } },
    { name: { th: 'เกาะกูด (ตราด)', en: 'Koh Kood (Trat)' }, href: 'city-koh-kood.html', stayHref: 'where-to-stay-koh-kood.html',
      blurb: { th: 'เกาะใหญ่ฝั่งตะวันออก น้ำใสนิ่ง ป่าเขียว น้ำตก เหมาะดำน้ำตื้นชิล ๆ และพักผ่อนเงียบ ๆ', en: 'A large east-coast island with calm, clear water, green jungle and waterfalls — great for easy snorkeling and a quiet stay.' },
      tags: { th: ['น้ำนิ่งใส', 'เงียบ-ธรรมชาติ'], en: ['Calm clear water', 'Quiet nature'] } },
    { name: { th: 'เกาะหมาก (ตราด)', en: 'Koh Mak (Trat)' }, href: 'city-koh-mak.html', stayHref: 'where-to-stay-koh-mak.html',
      blurb: { th: 'เกาะเล็กแบนปั่นจักรยานได้ น้ำใสนิ่ง หาดเงียบ ดำน้ำตื้นหน้าหาดและรอบเกาะใกล้ ๆ', en: 'A small, flat, cycle-friendly island with calm clear water and quiet beaches — snorkel off the sand and around nearby islets.' },
      tags: { th: ['น้ำนิ่ง', 'ปั่นจักรยาน'], en: ['Calm water', 'Cycling'] } },
    { name: { th: 'เกาะเต่า (ผ่านชุมพร)', en: 'Koh Tao (via Chumphon)' }, href: 'city-chumphon.html', stayHref: 'where-to-stay-chumphon.html',
      blurb: { th: 'เมกกะของนักดำน้ำลึก คอร์สดำน้ำราคาถูกและจุดดำน้ำเยอะ ออกเรือจากชุมพรสะดวกสุด', en: 'A diving mecca with cheap courses and many dive sites; the easiest gateway is by boat from Chumphon.' },
      tags: { th: ['คอร์สดำน้ำถูก', 'จุดดำน้ำเยอะ'], en: ['Cheap dive courses', 'Many sites'] } },
  ],
  faq: [
    { q: { th: 'ดำน้ำตื้นน้ำใสสุดในไทยไปเกาะไหน?', en: 'Which Thai island has the clearest water for snorkeling?' },
      a: { th: 'เกาะหลีเป๊ะ (สตูล) และหมู่เกาะสิมิลัน (ออกจากเขาหลัก) ขึ้นชื่อว่าน้ำใสที่สุด ส่วนเกาะกระดาน-เกาะไหงของตรังก็น้ำใสและคนน้อยกว่า ทั้งหมดสวยสุดช่วงไฮซีซั่นอันดามัน (พ.ย.–เม.ย.)', en: 'Koh Lipe (Satun) and the Similan Islands (from Khao Lak) are known for the clearest water, while Trang’s Koh Kradan and Koh Ngai are clear and less crowded. All are best in the Andaman high season (Nov–Apr).' } },
    { q: { th: 'หน้าฝนยังดำน้ำได้ไหม?', en: 'Can I snorkel in the rainy season?' },
      a: { th: 'ฝั่งอันดามัน (หลีเป๊ะ สิมิลัน ตรัง) คลื่นแรงและบางจุดปิดช่วง พ.ค.–ต.ค. แต่ฝั่งอ่าวไทยและตะวันออก (เกาะเต่า เกาะกูด เกาะหมาก) ยังเที่ยวได้ช่วงนั้น เพราะมรสุมคนละจังหวะ ควรเช็กสภาพอากาศก่อน', en: 'The Andaman side (Lipe, Similan, Trang) gets rough and some spots close from May–Oct, but the Gulf and east (Koh Tao, Koh Kood, Koh Mak) are still good then, as the monsoons run on different schedules — check the forecast first.' } },
    { q: { th: 'พาเด็กไปดำน้ำตื้นเกาะไหนดี?', en: 'Which island is best for snorkeling with kids?' },
      a: { th: 'เกาะกูดและเกาะหมากน้ำนิ่งใสและหาดเงียบ เหมาะพาเด็กดำน้ำตื้นหน้าหาด ส่วนหลีเป๊ะน้ำใสมากแต่บางจุดมีเรือเยอะ ควรเลือกหาดที่คลื่นเบาและใส่เสื้อชูชีพให้เด็กเสมอ', en: 'Koh Kood and Koh Mak have calm, clear water and quiet beaches, ideal for snorkeling with children off the sand. Koh Lipe is very clear but busy with boats in places — pick a calm beach and always put a life vest on kids.' } },
  ],
},
{ slug: 'best-family-beaches-thailand', hero: 'huahin', emoji: '👨‍👩‍👧',
  th: { eyebrow: 'ทะเล & ครอบครัว', h1: 'ทะเลไหนเหมาะ<br>พาครอบครัวเที่ยว', title: 'ทะเลไหนเหมาะครอบครัวที่สุดในไทย 2026 — 6 ที่หาดเงียบ ปลอดภัย | ThailandAddict',
    metaDesc: 'พาครอบครัวเที่ยวทะเลไปไหนดี? รวม 6 ที่หาดยาว คลื่นเบา ปลอดภัย เหมาะเด็ก หัวหิน ชะอำ เขาหลัก อ่าวนาง สมุย เกาะเสม็ด พร้อมที่พัก',
    intro: 'รวมจุดหมายทะเลที่เหมาะพาครอบครัว — หาดเงียบ คลื่นเบา ปลอดภัย และมีรีสอร์ตเหมาะเด็ก พร้อมลิงก์ที่พัก',
    quick: '<strong>คำตอบสั้น ๆ:</strong> ใกล้กรุงเทพและสะดวกสุดคือ <strong>หัวหิน-ชะอำ</strong> (หาดยาว เมืองปลอดภัย) สายอันดามันเลือก <strong>เขาหลัก</strong> (คลื่นเบา รีสอร์ตเด็ก) หรือ <strong>อ่าวนาง</strong> (ออกทัวร์เกาะง่าย) สายเกาะใกล้กรุงเลือก <strong>เกาะเสม็ด (ระยอง)</strong> ส่วนสมุยเลือกโซนเงียบอย่างแม่น้ำ-เชิงมน' },
  en: { eyebrow: 'Beaches & family', h1: 'Best beaches<br>for families', title: 'Best Family Beaches in Thailand 2026 — 6 Calm, Safe Picks | ThailandAddict',
    metaDesc: 'Where to take the family to the beach in Thailand? Six calm, safe, kid-friendly spots — Hua Hin, Cha-am, Khao Lak, Ao Nang, Samui and Koh Samet — with where to stay.',
    intro: 'The best beach destinations for families — calm, gentle, safe and with kid-friendly resorts, each with where to stay.',
    quick: '<strong>Short answer:</strong> Closest to Bangkok and easiest are <strong>Hua Hin–Cha-am</strong> (long beaches, safe towns); on the Andaman pick <strong>Khao Lak</strong> (gentle surf, family resorts) or <strong>Ao Nang</strong> (easy island tours); for an island near Bangkok choose <strong>Koh Samet (Rayong)</strong>; on Samui, pick a quiet zone like Maenam or Choeng Mon.' },
  items: [
    { name: { th: 'หัวหิน', en: 'Hua Hin' }, href: 'city-huahin.html', stayHref: 'where-to-stay-huahin.html',
      blurb: { th: 'เมืองชายทะเลปลอดภัยใกล้กรุงเทพ หาดยาว สวนน้ำ ตลาด และรีสอร์ตครอบครัวเยอะ เที่ยวได้ทั้งปี', en: 'A safe seaside town near Bangkok with long beaches, water parks, markets and lots of family resorts — good year-round.' },
      tags: { th: ['ใกล้กรุงเทพ', 'สวนน้ำ-ตลาด'], en: ['Near Bangkok', 'Water parks & markets'] } },
    { name: { th: 'ชะอำ (เพชรบุรี)', en: 'Cha-am (Phetchaburi)' }, href: 'where-to-stay-cha-am.html', stayHref: 'where-to-stay-cha-am.html',
      blurb: { th: 'เมืองตากอากาศครอบครัวไทย หาดยาวคลื่นเบา ร้านอาหารทะเลริมหาด ราคาย่อมเยากว่าหัวหิน', en: 'A Thai family beach town with a long, gentle beach, seafront seafood and better value than Hua Hin.' },
      tags: { th: ['คลื่นเบา', 'ราคาดี'], en: ['Gentle surf', 'Good value'] } },
    { name: { th: 'เขาหลัก (พังงา)', en: 'Khao Lak (Phang Nga)' }, href: 'where-to-stay-khao-lak.html', stayHref: 'where-to-stay-khao-lak.html',
      blurb: { th: 'หาดยาวเงียบ คลื่นไม่แรงในไฮซีซั่น รีสอร์ตหลายแห่งมีสระและกิจกรรมเด็ก เหมาะพักยาว', en: 'Long, quiet beaches with gentle high-season surf and many resorts with pools and kids’ activities — good for a longer stay.' },
      tags: { th: ['หาดเงียบ', 'รีสอร์ตเด็ก'], en: ['Quiet beach', 'Family resorts'] } },
    { name: { th: 'อ่าวนาง (กระบี่)', en: 'Ao Nang (Krabi)' }, href: 'where-to-stay-ao-nang.html', stayHref: 'where-to-stay-ao-nang.html',
      blurb: { th: 'ศูนย์กลางที่พักกระบี่ เดินถึงหาดและร้าน ออกทัวร์ 4 เกาะแบบครึ่งวันได้ เหมาะครอบครัวที่อยากเที่ยวเกาะ', en: 'Krabi’s accommodation hub — walk to the beach and restaurants and take half-day 4-Islands tours, good for families who want island trips.' },
      tags: { th: ['ทัวร์เกาะง่าย', 'เดินถึงทุกอย่าง'], en: ['Easy island tours', 'Walkable'] } },
    { name: { th: 'เกาะสมุย (แม่น้ำ/เชิงมน)', en: 'Koh Samui (Maenam/Choeng Mon)' }, href: 'where-to-stay-samui.html', stayHref: 'where-to-stay-samui.html',
      blurb: { th: 'เลือกหาดเงียบอย่างแม่น้ำหรือเชิงมน น้ำตื้นนิ่ง เหมาะเด็กเล็ก มีรีสอร์ตครอบครัวและสนามบินบนเกาะ', en: 'Choose a calm beach like Maenam or Choeng Mon — shallow, still water for young children, with family resorts and an island airport.' },
      tags: { th: ['น้ำตื้นนิ่ง', 'บินตรง'], en: ['Calm shallows', 'Island airport'] } },
    { name: { th: 'เกาะเสม็ด (ระยอง)', en: 'Koh Samet (Rayong)' }, href: 'city-rayong.html', stayHref: 'where-to-stay-rayong.html',
      blurb: { th: 'เกาะทะเลใกล้กรุงเทพสุด หาดทรายขาวน้ำใส ต่อเรือจากบ้านเพสั้น ๆ เหมาะหนีกรุงสุดสัปดาห์กับครอบครัว', en: 'The closest island beach to Bangkok, with white sand and clear water, a short ferry from Ban Phe — great for a family weekend escape.' },
      tags: { th: ['ใกล้กรุงเทพ', 'เรือสั้น'], en: ['Near Bangkok', 'Short ferry'] } },
  ],
  faq: [
    { q: { th: 'พาเด็กเล็กเที่ยวทะเลที่ไหนปลอดภัยสุด?', en: 'Where is safest for a beach trip with young kids?' },
      a: { th: 'หัวหินและชะอำเป็นเมืองชายทะเลที่ปลอดภัยและสะดวกสุดสำหรับครอบครัว หาดยาวคลื่นเบา มีโรงพยาบาล ร้านค้า และสวนน้ำ ใกล้กรุงเทพขับรถถึงง่าย', en: 'Hua Hin and Cha-am are the safest, most convenient seaside towns for families — long, gentle beaches with hospitals, shops and water parks, and an easy drive from Bangkok.' } },
    { q: { th: 'ทะเลใกล้กรุงเทพไปเช้า-เย็นกลับได้ไหม?', en: 'Is there a beach near Bangkok for a day trip?' },
      a: { th: 'บางแสน (ชลบุรี) และหัวหินไปเช้า-เย็นกลับได้ ส่วนเกาะเสม็ดควรค้าง 1 คืนเพราะต้องต่อเรือ ทุกที่ห่างกรุงเทพราว 1.5–3 ชั่วโมง', en: 'Bang Saen (Chonburi) and Hua Hin work as day trips, while Koh Samet is better with one overnight as it needs a ferry; all are about 1.5–3 hours from Bangkok.' } },
    { q: { th: 'ไปทะเลครอบครัวหน้าไหนดี?', en: 'What season is best for a family beach trip?' },
      a: { th: 'อ่าวไทย (หัวหิน ชะอำ สมุย เสม็ด) สวยช่วง ก.พ.–มิ.ย. ส่วนอันดามัน (เขาหลัก อ่าวนาง) สวยสุด พ.ย.–เม.ย. หลีกเลี่ยงช่วงมรสุมของแต่ละฝั่งที่คลื่นแรง', en: 'The Gulf (Hua Hin, Cha-am, Samui, Samet) is lovely Feb–Jun, while the Andaman (Khao Lak, Ao Nang) is best Nov–Apr; avoid each coast’s monsoon months when the surf is rough.' } },
  ],
},
{ slug: 'best-cool-season-mountains-thailand', hero: 'pai', emoji: '🏔️',
  th: { eyebrow: 'ภูเขา & หน้าหนาว', h1: 'เที่ยวหน้าหนาว<br>ภูเขาไหนดี', title: 'เที่ยวหน้าหนาวภูเขาไหนดีในไทย 2026 — 6 ที่อากาศเย็น ทะเลหมอก | ThailandAddict',
    metaDesc: 'หน้าหนาวอยากไปภูเขาอากาศเย็น ทะเลหมอก ไปไหนดี? รวม 6 ที่ ปาย น่าน แม่ฮ่องสอน เชียงคาน เขาค้อ เชียงราย พร้อมที่พัก',
    intro: 'รวมจุดหมายภูเขาที่อากาศเย็นและทะเลหมอกสวยช่วงหน้าหนาว เลือกตามภาคและสไตล์ พร้อมลิงก์ที่พัก',
    quick: '<strong>คำตอบสั้น ๆ:</strong> สายเหนือเลือก <strong>ปาย</strong> (หมอก-วิวง่าย) <strong>แม่ฮ่องสอน</strong> (ปางอุ๋ง) หรือ <strong>น่าน</strong> (ดอยภูคา-ปัว) สายอีสานบนเลือก <strong>เชียงคาน (เลย)</strong> ริมโขง ส่วนภาคกลางตอนบน <strong>เขาค้อ (เพชรบูรณ์)</strong> ทะเลหมอกใกล้กรุงเทพสุด' },
  en: { eyebrow: 'Mountains & cool season', h1: 'Cool-season<br>mountain escapes', title: 'Best Cool-Season Mountain Trips in Thailand 2026 — 6 Misty Picks | ThailandAddict',
    metaDesc: 'Where to go for cool air and a sea of mist in Thailand’s cool season? Six picks — Pai, Nan, Mae Hong Son, Chiang Khan, Khao Kho and Chiang Rai — with where to stay.',
    intro: 'The best mountain destinations for cool air and morning mist in the cool season, sorted by region and style, each with where to stay.',
    quick: '<strong>Short answer:</strong> In the north choose <strong>Pai</strong> (easy mist and views), <strong>Mae Hong Son</strong> (Pang Ung) or <strong>Nan</strong> (Doi Phu Kha/Pua); in the upper Isan, <strong>Chiang Khan (Loei)</strong> on the Mekong; and for the sea of mist closest to Bangkok, <strong>Khao Kho (Phetchabun)</strong>.' },
  items: [
    { name: { th: 'ปาย (แม่ฮ่องสอน)', en: 'Pai (Mae Hong Son)' }, href: 'city-pai.html', stayHref: 'where-to-stay-pai.html',
      blurb: { th: 'เมืองเล็กในหุบเขา อากาศเย็น ทะเลหมอกดูง่าย คาเฟ่ชิล ๆ และถนนคนเดินกลางคืน เหมาะมาครั้งแรกสายภูเขา', en: 'A small town in a valley — cool air, easy-to-see mist, laid-back cafés and a night walking street, perfect for a first mountain trip.' },
      tags: { th: ['ทะเลหมอกง่าย', 'คาเฟ่'], en: ['Easy mist', 'Cafés'] } },
    { name: { th: 'แม่ฮ่องสอน', en: 'Mae Hong Son' }, href: 'city-mae-hong-son.html', stayHref: 'where-to-stay-mae-hong-son.html',
      blurb: { th: 'เมืองหุบเขาหมอกหนา ปางอุ๋งและบ้านรักไทยวิวทะเลสาบหมอกยามเช้า เหมาะสายขับรถลูป 1,864 โค้ง', en: 'A misty valley town — Pang Ung and Ban Rak Thai offer dawn mist over the lake, and it anchors the 1,864-curve loop drive.' },
      tags: { th: ['ปางอุ๋ง', 'ลูปแม่ฮ่องสอน'], en: ['Pang Ung', 'The MHS loop'] } },
    { name: { th: 'น่าน', en: 'Nan' }, href: 'city-nan.html', stayHref: 'where-to-stay-nan.html',
      blurb: { th: 'เมืองเก่าเงียบ ๆ + ภูเขา ขึ้นปัว-ดอยภูคาชมวิวนาขั้นบันไดและทะเลหมอก คาเฟ่วิวเขาสวย', en: 'A quiet old town plus mountains — head to Pua and Doi Phu Kha for terraced fields, mist and scenic mountain cafés.' },
      tags: { th: ['ดอยภูคา', 'นาขั้นบันได'], en: ['Doi Phu Kha', 'Terraced fields'] } },
    { name: { th: 'เชียงคาน (เลย)', en: 'Chiang Khan (Loei)' }, href: 'where-to-stay-chiang-khan.html', stayHref: 'where-to-stay-chiang-khan.html',
      blurb: { th: 'เมืองริมโขงบ้านไม้เก่า อากาศเย็น ตักบาตรข้าวเหนียวเช้า ทะเลหมอกที่ภูทอก หน้าหนาวคนเยอะจองล่วงหน้า', en: 'A Mekong town of old wooden houses — cool air, dawn sticky-rice alms and mist at Phu Thok; it is busy in winter, so book ahead.' },
      tags: { th: ['ริมโขง', 'ตักบาตรเช้า'], en: ['Mekong town', 'Dawn alms'] } },
    { name: { th: 'เขาค้อ (เพชรบูรณ์)', en: 'Khao Kho (Phetchabun)' }, href: 'where-to-stay-phetchabun.html', stayHref: 'where-to-stay-phetchabun.html',
      blurb: { th: '“สวิตเซอร์แลนด์เมืองไทย” ทะเลหมอกใกล้กรุงเทพสุด รีสอร์ตวิวเขาเยอะ ขับรถถึงง่าย เหมาะสุดสัปดาห์', en: 'The “Switzerland of Thailand” — the sea of mist closest to Bangkok, with many hill-view resorts and an easy drive, great for a weekend.' },
      tags: { th: ['ใกล้กรุงเทพ', 'รีสอร์ตวิวเขา'], en: ['Near Bangkok', 'Hill-view resorts'] } },
    { name: { th: 'เชียงราย', en: 'Chiang Rai' }, href: 'city-chiang-rai.html', stayHref: 'where-to-stay-chiang-rai.html',
      blurb: { th: 'เหนือสุด อากาศเย็น ไร่ชา ดอยตุง ดอยช้าง วัดสวย และทะเลหมอกที่ภูชี้ฟ้า เที่ยวได้หลายวัน', en: 'The far north — cool air, tea plantations, Doi Tung and Doi Chang, beautiful temples and the mist at Phu Chi Fa, good for several days.' },
      tags: { th: ['ไร่ชา', 'ภูชี้ฟ้า'], en: ['Tea farms', 'Phu Chi Fa'] } },
  ],
  faq: [
    { q: { th: 'หน้าหนาวไทยภูเขาที่ไหนหนาวสุด?', en: 'Where is coldest in Thailand’s cool season?' },
      a: { th: 'ยอดเขาสูงอย่างภูทับเบิก (เพชรบูรณ์) ดอยอินทนนท์ (เชียงใหม่) และดอยสูงในเชียงราย-แม่ฮ่องสอน หนาวสุด บางวันใกล้ 0 องศา ช่วงหนาวจัดคือ ธ.ค.–ม.ค. ควรเตรียมเสื้อกันหนาว', en: 'High summits like Phu Thap Boek (Phetchabun), Doi Inthanon (Chiang Mai) and the high peaks of Chiang Rai/Mae Hong Son are coldest, sometimes near 0°C; the deepest cold is Dec–Jan, so pack warm layers.' } },
    { q: { th: 'ไปดูทะเลหมอกควรไปเดือนไหน?', en: 'When should I go to see the sea of mist?' },
      a: { th: 'พ.ย.–ก.พ. คือช่วงทะเลหมอกหนาและอากาศเย็นสุด ควรตื่นเช้ามืดไปจุดชมวิวก่อนพระอาทิตย์ขึ้น วันหยุดยาวคนเยอะและที่พักเต็มเร็ว ควรจองล่วงหน้า', en: 'Nov–Feb has the thickest mist and coolest air; head to the viewpoint before sunrise. Long weekends are crowded and rooms sell out fast, so book ahead.' } },
    { q: { th: 'ไม่มีรถเที่ยวภูเขาได้ไหม?', en: 'Can I visit the mountains without a car?' },
      a: { th: 'ปายและเชียงคานเที่ยวได้สบายแบบไม่มีรถ เพราะตัวเมืองเดินได้และมีรถเช่า/ทัวร์ ส่วนน่าน เขาค้อ และแม่ฮ่องสอนตอนนอกเมืองควรมีรถหรือเช่ามอเตอร์ไซค์เพราะที่เที่ยวกระจาย', en: 'Pai and Chiang Khan are easy without a car — the towns are walkable with rentals and tours — while the outskirts of Nan, Khao Kho and Mae Hong Son really need a car or motorbike, as the sights are spread out.' } },
  ],
},
{ slug: 'best-honeymoon-escapes-thailand', hero: 'koh-kood', emoji: '💛',
  th: { eyebrow: 'ฮันนีมูน & เงียบ', h1: 'ฮันนีมูนเงียบ ๆ<br>ไปที่ไหนดี', title: 'ฮันนีมูนเงียบ ๆ ในไทยไปไหนดี 2026 — 6 ที่โรแมนติก น้ำใส | ThailandAddict',
    metaDesc: 'ฮันนีมูนหรือทริปคู่รักอยากได้ที่เงียบ ๆ โรแมนติก ไปไหนดี? รวม 6 ที่ เกาะกูด เกาะหมาก เขาหลัก ไร่เลย์ สมุย หลีเป๊ะ พร้อมที่พัก',
    intro: 'รวมจุดหมายเงียบ ๆ โรแมนติก เหมาะฮันนีมูนและทริปคู่รัก หาดสวย น้ำใส รีสอร์ตเป็นส่วนตัว พร้อมลิงก์ที่พัก',
    quick: '<strong>คำตอบสั้น ๆ:</strong> สายเกาะเงียบน้ำใสเลือก <strong>เกาะกูด</strong> หรือ <strong>เกาะหมาก</strong> (ตราด) สายหรู-เงียบเลือก <strong>เขาหลัก (คึกคัก)</strong> สายวิวหน้าผาดราม่าเลือก <strong>ไร่เลย์/หาดพระนาง</strong> สายเกาะใต้น้ำใสเลือก <strong>หลีเป๊ะ</strong> ส่วนสมุยเลือกอ่าวเงียบอย่างเฉวงน้อย' },
  en: { eyebrow: 'Honeymoon & quiet', h1: 'Quiet honeymoon<br>escapes', title: 'Best Quiet Honeymoon Escapes in Thailand 2026 — 6 Romantic Picks | ThailandAddict',
    metaDesc: 'Looking for a quiet, romantic honeymoon spot in Thailand? Six picks — Koh Kood, Koh Mak, Khao Lak, Railay, Samui and Koh Lipe — with where to stay.',
    intro: 'Quiet, romantic destinations for honeymoons and couples — lovely beaches, clear water and private resorts, each with where to stay.',
    quick: '<strong>Short answer:</strong> For quiet, clear-water islands choose <strong>Koh Kood</strong> or <strong>Koh Mak</strong> (Trat); for quiet luxury, <strong>Khao Lak (Khuk Khak)</strong>; for dramatic cliff scenery, <strong>Railay/Phra Nang</strong>; for a clear-water southern island, <strong>Koh Lipe</strong>; on Samui, a quiet cove like Chaweng Noi.' },
  items: [
    { name: { th: 'เกาะกูด (ตราด)', en: 'Koh Kood (Trat)' }, href: 'city-koh-kood.html', stayHref: 'where-to-stay-koh-kood.html',
      blurb: { th: 'น้ำใสนิ่ง ป่าเขียว หาดเงียบ รีสอร์ตวิวพระอาทิตย์ตก ไม่มีไนต์ไลฟ์ เหมาะพักผ่อนสองคนจริง ๆ', en: 'Calm clear water, green jungle, quiet beaches and sunset-view resorts with no nightlife — a true two-person retreat.' },
      tags: { th: ['น้ำใส', 'ไม่มีไนต์ไลฟ์'], en: ['Clear water', 'No nightlife'] } },
    { name: { th: 'เกาะหมาก (ตราด)', en: 'Koh Mak (Trat)' }, href: 'city-koh-mak.html', stayHref: 'where-to-stay-koh-mak.html',
      blurb: { th: 'เกาะเล็กเงียบ ปั่นจักรยานเที่ยวด้วยกัน น้ำนิ่งใส พระอาทิตย์ตกสวย เจ้าของรีสอร์ตเป็นกันเอง', en: 'A small, quiet island to cycle together, with calm clear water, lovely sunsets and friendly resort owners.' },
      tags: { th: ['เงียบ', 'พระอาทิตย์ตก'], en: ['Quiet', 'Sunsets'] } },
    { name: { th: 'เขาหลัก (พังงา)', en: 'Khao Lak (Phang Nga)' }, href: 'where-to-stay-khao-lak.html', stayHref: 'where-to-stay-khao-lak.html',
      blurb: { th: 'โซนคึกคัก-บางสักทางเหนือเงียบและรีสอร์ตหรู หาดยาวเป็นส่วนตัว ใกล้สิมิลัน เหมาะคู่รักสายชิล', en: 'The Khuk Khak/Bang Sak stretch to the north is quiet with upscale resorts, private long beaches and the Similans nearby — great for laid-back couples.' },
      tags: { th: ['หรู-เงียบ', 'ใกล้สิมิลัน'], en: ['Quiet luxury', 'Near the Similans'] } },
    { name: { th: 'ไร่เลย์ / หาดพระนาง (กระบี่)', en: 'Railay / Phra Nang (Krabi)' }, href: 'where-to-stay-railay.html', stayHref: 'where-to-stay-railay.html',
      blurb: { th: 'หน้าผาหินปูนดราม่า เข้าได้ด้วยเรือเท่านั้น หาดพระนางสวยมาก บรรยากาศโรแมนติกและเป็นส่วนตัว', en: 'Dramatic limestone cliffs reached only by boat, with the stunning Phra Nang beach — romantic and private.' },
      tags: { th: ['วิวหน้าผา', 'เข้าด้วยเรือ'], en: ['Cliff views', 'Boat-access'] } },
    { name: { th: 'เกาะสมุย (เฉวงน้อย/บ่อผุด)', en: 'Koh Samui (Chaweng Noi/Bophut)' }, href: 'where-to-stay-samui.html', stayHref: 'where-to-stay-chaweng.html',
      blurb: { th: 'เลือกอ่าวเงียบอย่างเฉวงน้อยหรือบ่อผุด รีสอร์ตหรู ดินเนอร์ริมหาด และบินตรงถึงเกาะ สะดวกสำหรับคู่รัก', en: 'Pick a quiet cove like Chaweng Noi or Bophut — luxury resorts, beachfront dinners and direct flights to the island, convenient for couples.' },
      tags: { th: ['รีสอร์ตหรู', 'บินตรง'], en: ['Luxury resorts', 'Direct flights'] } },
    { name: { th: 'เกาะหลีเป๊ะ (สตูล)', en: 'Koh Lipe (Satun)' }, href: 'city-koh-lipe.html', stayHref: 'where-to-stay-koh-lipe.html',
      blurb: { th: 'น้ำใสที่สุดของอันดามันใต้ หาดทรายขาว พระอาทิตย์ตกสวย รีสอร์ตติดหาดให้เลือก เหมาะคู่รักสายทะเล', en: 'The clearest water in the lower Andaman, white sand and fine sunsets, with beachfront resorts — ideal for sea-loving couples.' },
      tags: { th: ['น้ำใสสุด', 'พระอาทิตย์ตก'], en: ['Clearest water', 'Sunsets'] } },
  ],
  faq: [
    { q: { th: 'ฮันนีมูนอยากได้เกาะเงียบที่สุดไปไหน?', en: 'Which island is quietest for a honeymoon?' },
      a: { th: 'เกาะกูดและเกาะหมาก (ตราด) เงียบและเป็นส่วนตัวที่สุด ไม่มีไนต์ไลฟ์ น้ำใสนิ่ง เหมาะพักผ่อนสองคน ส่วนถ้าอยากได้น้ำใสสุดเลือกหลีเป๊ะแต่จะคึกคักกว่าเล็กน้อย', en: 'Koh Kood and Koh Mak (Trat) are the quietest and most private, with no nightlife and calm clear water — ideal for two. For the clearest water, Koh Lipe is a touch livelier but stunning.' } },
    { q: { th: 'ฮันนีมูนไทยไปหน้าไหนดี?', en: 'What is the best season for a Thailand honeymoon?' },
      a: { th: 'อันดามัน (เขาหลัก ไร่เลย์ หลีเป๊ะ) สวยสุด พ.ย.–เม.ย. ส่วนฝั่งตะวันออก (เกาะกูด เกาะหมาก) และอ่าวไทย (สมุย) เลี่ยงช่วงมรสุมของแต่ละฝั่ง โดยรวมเดือน ม.ค.–มี.ค. อากาศดีเกือบทุกที่', en: 'The Andaman (Khao Lak, Railay, Lipe) is best Nov–Apr, while the east (Koh Kood, Koh Mak) and the Gulf (Samui) avoid their own monsoon months; overall, Jan–Mar is good almost everywhere.' } },
    { q: { th: 'ฮันนีมูนงบไม่สูงไปเกาะไหนได้บ้าง?', en: 'Any budget-friendly honeymoon islands?' },
      a: { th: 'เกาะหมากและเกาะกูดมีรีสอร์ตหลายระดับ เลือกบังกะโลริมหาดราคาเบาได้ ส่วนหลีเป๊ะนอกไฮซีซั่นราคาลดเยอะ จองล่วงหน้าและเลี่ยงวันหยุดยาวจะได้ราคาดีกว่า', en: 'Koh Mak and Koh Kood have resorts at a range of prices, including affordable beachfront bungalows, and Koh Lipe drops a lot outside high season — book ahead and avoid long weekends for better rates.' } },
  ],
},
{ slug: 'best-nightlife-thailand', hero: 'koh-phangan', emoji: '🎉',
  th: { eyebrow: 'ไนต์ไลฟ์ & ปาร์ตี้', h1: 'สายปาร์ตี้<br>ไปเที่ยวไหนดี', title: 'เที่ยวกลางคืน-ปาร์ตี้ที่ไหนดีในไทย 2026 — 5 ที่ไนต์ไลฟ์เด็ด | ThailandAddict',
    metaDesc: 'สายปาร์ตี้-ไนต์ไลฟ์ในไทยไปไหนดี? รวม 5 ที่ เกาะพะงัน (ฟูลมูน) ภูเก็ตป่าตอง พัทยา เกาะสมุยเฉวง และกรุงเทพ พร้อมที่พัก',
    intro: 'รวมจุดหมายไนต์ไลฟ์-ปาร์ตี้ที่ดังที่สุดในไทย เลือกตามสไตล์ ตั้งแต่ฟูลมูนถึงรูฟท็อปบาร์ พร้อมลิงก์ที่พัก',
    quick: '<strong>คำตอบสั้น ๆ:</strong> สายปาร์ตี้ทะเลเลือก <strong>เกาะพะงัน</strong> (ฟูลมูนปาร์ตี้) สายหาด+ไนต์ไลฟ์เลือก <strong>ภูเก็ต (ป่าตอง/บางลา)</strong> หรือ <strong>พัทยา (วอล์กกิงสตรีท)</strong> สายบีชคลับเลือก <strong>เกาะสมุย (เฉวง)</strong> ส่วนสายรูฟท็อป-คลับเลือก <strong>กรุงเทพ</strong> (สุขุมวิท/สีลม)' },
  en: { eyebrow: 'Nightlife & parties', h1: 'Where to party<br>in Thailand', title: 'Best Nightlife & Party Spots in Thailand 2026 — 5 Picks | ThailandAddict',
    metaDesc: 'Where is the best nightlife in Thailand? Five picks — Koh Phangan (Full Moon), Phuket Patong, Pattaya, Koh Samui Chaweng and Bangkok — with where to stay.',
    intro: 'Thailand’s biggest nightlife and party destinations, from Full Moon beaches to rooftop bars, sorted by style, each with where to stay.',
    quick: '<strong>Short answer:</strong> For a beach party choose <strong>Koh Phangan</strong> (the Full Moon Party); for beach plus nightlife, <strong>Phuket (Patong/Bangla)</strong> or <strong>Pattaya (Walking Street)</strong>; for beach clubs, <strong>Koh Samui (Chaweng)</strong>; for rooftops and clubs, <strong>Bangkok</strong> (Sukhumvit/Silom).' },
  items: [
    { name: { th: 'เกาะพะงัน', en: 'Koh Phangan' }, href: 'city-koh-phangan.html', stayHref: 'where-to-stay-koh-phangan.html',
      blurb: { th: 'บ้านเกิดฟูลมูนปาร์ตี้ที่หาดริ้น คืนปาร์ตี้คนทั่วโลกมารวมตัว มีฮาล์ฟมูนและจังเกิลปาร์ตี้ด้วย', en: 'Home of the Full Moon Party at Haad Rin, where a global crowd gathers on party nights, plus Half Moon and jungle parties.' },
      tags: { th: ['ฟูลมูนปาร์ตี้', 'หาดริ้น'], en: ['Full Moon Party', 'Haad Rin'] } },
    { name: { th: 'ภูเก็ต (ป่าตอง)', en: 'Phuket (Patong)' }, href: 'where-to-stay-patong.html', stayHref: 'where-to-stay-patong.html',
      blurb: { th: 'ถนนบางลาคือศูนย์กลางไนต์ไลฟ์ภูเก็ต บาร์ คลับ และโชว์ครบ ติดหาดป่าตอง เดินถึงทุกอย่าง', en: 'Bangla Road is Phuket’s nightlife hub — bars, clubs and shows, right by Patong beach and all within walking distance.' },
      tags: { th: ['ถนนบางลา', 'ติดหาด'], en: ['Bangla Road', 'On the beach'] } },
    { name: { th: 'พัทยา', en: 'Pattaya' }, href: 'city-pattaya.html', stayHref: 'where-to-stay-pattaya.html',
      blurb: { th: 'วอล์กกิงสตรีทไนต์ไลฟ์แน่น ใกล้กรุงเทพสุด มีทั้งบาร์ คลับ บีชคลับ และโชว์ เที่ยวกลางคืนได้ทั้งปี', en: 'Walking Street packs the nightlife and it is closest to Bangkok, with bars, clubs, beach clubs and shows — a year-round night out.' },
      tags: { th: ['วอล์กกิงสตรีท', 'ใกล้กรุงเทพ'], en: ['Walking Street', 'Near Bangkok'] } },
    { name: { th: 'เกาะสมุย (เฉวง)', en: 'Koh Samui (Chaweng)' }, href: 'where-to-stay-chaweng.html', stayHref: 'where-to-stay-chaweng.html',
      blurb: { th: 'หาดเฉวงมีบีชคลับ บาร์ และคลับริมหาด บรรยากาศหรูกว่าฟูลมูน เหมาะสายปาร์ตี้ที่อยากได้หาดสวยด้วย', en: 'Chaweng has beach clubs, bars and seaside clubs with a more upscale feel than the Full Moon scene — for partygoers who also want a nice beach.' },
      tags: { th: ['บีชคลับ', 'หาดสวย'], en: ['Beach clubs', 'Nice beach'] } },
    { name: { th: 'กรุงเทพ', en: 'Bangkok' }, href: 'city-bangkok.html', stayHref: 'where-to-stay-bangkok.html',
      blurb: { th: 'รูฟท็อปบาร์วิวเมือง คลับระดับโลก และไนต์ไลฟ์สุขุมวิท-สีลม-ทองหล่อ ครบทุกแนวในเมืองเดียว', en: 'Rooftop bars with city views, world-class clubs and the Sukhumvit–Silom–Thong Lo scene — every style in one city.' },
      tags: { th: ['รูฟท็อปบาร์', 'คลับ'], en: ['Rooftop bars', 'Clubs'] } },
  ],
  faq: [
    { q: { th: 'ฟูลมูนปาร์ตี้จัดที่ไหน เมื่อไหร่?', en: 'Where and when is the Full Moon Party?' },
      a: { th: 'จัดที่หาดริ้น เกาะพะงัน คืนวันเพ็ญ (พระจันทร์เต็มดวง) ทุกเดือน บางเดือนเลื่อนเลี่ยงวันพระ ที่พักเต็มเร็วและราคาขึ้นช่วงปาร์ตี้ ควรจองล่วงหน้านาน ๆ', en: 'It is held at Haad Rin on Koh Phangan on the full-moon night each month (occasionally shifted around Buddhist holy days); rooms fill fast and prices rise on party nights, so book well ahead.' } },
    { q: { th: 'สายปาร์ตี้แต่ก็อยากได้หาดสวยไปไหนดี?', en: 'Where can I party but still have a nice beach?' },
      a: { th: 'เกาะสมุย (เฉวง) และภูเก็ต (ป่าตอง) มีทั้งไนต์ไลฟ์และหาดสวยในที่เดียว ส่วนเกาะพะงันนอกคืนฟูลมูนก็มีหาดเงียบสวยทางเหนือให้พักผ่อน', en: 'Koh Samui (Chaweng) and Phuket (Patong) combine nightlife with a good beach in one place, while Koh Phangan outside Full Moon nights has quiet, pretty beaches in the north for relaxing.' } },
    { q: { th: 'เที่ยวกลางคืนใกล้กรุงเทพไปไหนดี?', en: 'Where is good nightlife near Bangkok?' },
      a: { th: 'พัทยาใกล้สุด ขับรถราว 2 ชั่วโมง มีวอล์กกิงสตรีทและบีชคลับครบ ส่วนในกรุงเทพเองมีรูฟท็อปบาร์และคลับระดับโลกย่านสุขุมวิท-สีลม เที่ยวได้ทุกคืน', en: 'Pattaya is closest, about a two-hour drive, with Walking Street and beach clubs, while Bangkok itself has rooftop bars and world-class clubs around Sukhumvit–Silom every night.' } },
  ],
},
{ slug: 'best-rainy-season-thailand', hero: 'chiang-mai', emoji: '🌧️',
  th: { eyebrow: 'หน้าฝน & เที่ยวไหนดี', h1: 'หน้าฝน<br>เที่ยวไหนดี', title: 'หน้าฝนเที่ยวไหนดีในไทย 2026 — 6 ที่เขียวสวย คนน้อย | ThailandAddict',
    metaDesc: 'หน้าฝน (พ.ค.–ต.ค.) เที่ยวไทยที่ไหนดี? รวม 6 ที่เขียวสวย น้ำตกเต็ม คนน้อย เชียงใหม่ น่าน เขาใหญ่ กาญจนบุรี อีสาน พร้อมที่พัก',
    intro: 'หน้าฝนไม่ใช่หมดสนุก — รวมจุดหมายที่เขียวสวย น้ำตกเต็ม คนน้อยและราคาดีช่วงหน้าฝน พร้อมลิงก์ที่พัก',
    quick: '<strong>คำตอบสั้น ๆ:</strong> หน้าฝน (พ.ค.–ต.ค.) ฝั่งอันดามันคลื่นแรง แต่ <strong>ภาคเหนือ-อีสาน-ภาคกลาง</strong> ยังเที่ยวได้ดี ฝนมักตกบ่าย-เย็น เช้าฟ้าเปิด เขียวสวยและคนน้อย เลือก <strong>เชียงใหม่ น่าน เขาใหญ่ กาญจนบุรี</strong> หรืออีสานอย่าง <strong>เลย-อุบลฯ</strong> น้ำตกเต็มสวยช่วงนี้พอดี' },
  en: { eyebrow: 'Rainy season & where to go', h1: 'Where to go<br>in the rainy season', title: 'Where to Go in Thailand’s Rainy Season 2026 — 6 Green, Quiet Picks | ThailandAddict',
    metaDesc: 'Where to travel in Thailand in the rainy season (May–Oct)? Six green, less-crowded picks — Chiang Mai, Nan, Khao Yai, Kanchanaburi and Isan — with where to stay.',
    intro: 'The rainy season is not a write-off — destinations that are green, with full waterfalls, fewer crowds and lower prices, each with where to stay.',
    quick: '<strong>Short answer:</strong> In the rainy season (May–Oct) the Andaman coast is rough, but the <strong>north, Isan and central regions</strong> are still good — rain tends to fall in the afternoon and evening with clear mornings, everything is green and crowds are thin. Choose <strong>Chiang Mai, Nan, Khao Yai, Kanchanaburi</strong> or Isan spots like <strong>Loei/Ubon</strong>, where the waterfalls are full at this time.' },
  items: [
    { name: { th: 'เชียงใหม่', en: 'Chiang Mai' }, href: 'city-chiang-mai.html', stayHref: 'where-to-stay-chiang-mai.html',
      blurb: { th: 'หน้าฝนภาคเหนือเขียวสวย ฝนมักตกบ่าย-เย็น เช้าเที่ยววัด-คาเฟ่ได้ น้ำตกและดอยเขียวชอุ่ม ราคาที่พักถูกลง', en: 'The north turns lush in the rains; showers usually fall in the afternoon, leaving mornings for temples and cafés, with green hills and waterfalls and lower room prices.' },
      tags: { th: ['เขียวสวย', 'ราคาดี'], en: ['Lush green', 'Lower prices'] } },
    { name: { th: 'น่าน', en: 'Nan' }, href: 'city-nan.html', stayHref: 'where-to-stay-nan.html',
      blurb: { th: 'นาขั้นบันไดที่ปัวเขียวสุดช่วงหน้าฝน เมืองเงียบ คนน้อย คาเฟ่วิวนา เหมาะสายชิลถ่ายรูปธรรมชาติ', en: 'The terraced fields at Pua are greenest in the rains; the town is quiet with few crowds and field-view cafés — great for slow, scenic photography.' },
      tags: { th: ['นาเขียว', 'คนน้อย'], en: ['Green fields', 'Few crowds'] } },
    { name: { th: 'เขาใหญ่', en: 'Khao Yai' }, href: 'city-khao-yai.html', stayHref: 'where-to-stay-khao-yai.html',
      blurb: { th: 'หน้าฝนป่าเขียว น้ำตกเต็ม (เหวสุวัต) สัตว์ป่าออกหากินง่าย อากาศเย็นสบาย ใกล้กรุงเทพขับรถถึงง่าย', en: 'In the rains the forest is green, waterfalls like Haew Suwat are full, wildlife is easier to spot and the air is cool — an easy drive from Bangkok.' },
      tags: { th: ['น้ำตกเต็ม', 'ใกล้กรุงเทพ'], en: ['Full waterfalls', 'Near Bangkok'] } },
    { name: { th: 'กาญจนบุรี', en: 'Kanchanaburi' }, href: 'city-kanchanaburi.html', stayHref: 'where-to-stay-kanchanaburi.html',
      blurb: { th: 'น้ำตกเอราวัณและแม่น้ำสวยสุดหน้าฝน แพริมน้ำเขียวชอุ่ม สังขละบุรีหมอกลง เหมาะสายธรรมชาติ-แพ', en: 'The Erawan waterfalls and rivers are at their best in the rains, with green riverside rafts and misty Sangkhlaburi — great for nature and raft stays.' },
      tags: { th: ['น้ำตกเอราวัณ', 'แพริมน้ำ'], en: ['Erawan Falls', 'River rafts'] } },
    { name: { th: 'เลย (ภูเรือ/เชียงคาน)', en: 'Loei (Phu Ruea/Chiang Khan)' }, href: 'city-loei.html', stayHref: 'where-to-stay-loei.html',
      blurb: { th: 'ภูเขาอีสานบนเขียวสวย น้ำตกเต็ม อากาศเย็นสบายกว่าที่ราบ ริมโขงเชียงคานบรรยากาศดี คนน้อยกว่าหน้าหนาว', en: 'The upper-Isan mountains are green with full waterfalls and cooler air than the lowlands, and Chiang Khan’s riverside is pleasant — quieter than in winter.' },
      tags: { th: ['ภูเขาเขียว', 'คนน้อย'], en: ['Green mountains', 'Fewer crowds'] } },
    { name: { th: 'อุบลราชธานี', en: 'Ubon Ratchathani' }, href: 'city-ubon-ratchathani.html', stayHref: 'where-to-stay-ubon-ratchathani.html',
      blurb: { th: 'อีสานใต้หน้าฝนเขียวสวย แม่น้ำโขงเต็ม สามพันโบกจมน้ำ (เห็นชัดหน้าแล้ง) แต่ผาแต้มและน้ำตกเต็มสวย คนน้อย', en: 'The lower Isan is green in the rains and the Mekong is full; Sam Phan Bok is submerged (best seen in the dry season), but Pha Taem and the waterfalls are full and crowds are thin.' },
      tags: { th: ['ริมโขงเต็ม', 'คนน้อย'], en: ['Full Mekong', 'Few crowds'] } },
  ],
  faq: [
    { q: { th: 'หน้าฝนไทยเที่ยวทะเลได้ไหม?', en: 'Can I still do a beach trip in the rainy season?' },
      a: { th: 'ฝั่งอันดามัน (ภูเก็ต กระบี่ หลีเป๊ะ) คลื่นแรงและฝนเยอะ พ.ค.–ต.ค. แต่ฝั่งอ่าวไทย (สมุย พะงัน หัวหิน) ยังพอเที่ยวได้ช่วงนั้นเพราะมรสุมคนละจังหวะ (อ่าวไทยฝนหนัก ต.ค.–ธ.ค.) ควรเช็กพยากรณ์ก่อน', en: 'The Andaman (Phuket, Krabi, Lipe) is rough and wet May–Oct, but the Gulf (Samui, Phangan, Hua Hin) is still workable then, as the monsoons differ (the Gulf’s heaviest rain is Oct–Dec) — check the forecast first.' } },
    { q: { th: 'หน้าฝนเที่ยวคุ้มไหม?', en: 'Is the rainy season worth traveling in?' },
      a: { th: 'คุ้มถ้าเลือกที่ถูก หน้าฝนภาคเหนือ-อีสาน-ภาคกลางเขียวสวย น้ำตกเต็ม คนน้อย และที่พักถูกลง ฝนมักตกบ่าย-เย็นไม่ทั้งวัน วางแผนเที่ยวเช้า-เผื่อร่มไว้ก็เที่ยวสนุก', en: 'It is, if you pick the right place — the north, Isan and central regions are lush, the waterfalls are full, crowds are thin and rooms are cheaper. Rain usually falls in the afternoon, not all day, so plan mornings out and carry an umbrella.' } },
    { q: { th: 'หน้าฝนดูน้ำตกที่ไหนสวย?', en: 'Where are the best waterfalls in the rainy season?' },
      a: { th: 'น้ำตกเต็มและสวยสุดช่วงหน้าฝน-ปลายฝน เช่น เอราวัณ (กาญจนบุรี) เหวสุวัต (เขาใหญ่) ทีลอซู (อุ้มผาง/ตาก) และน้ำตกในเลย-เพชรบูรณ์ ควรระวังทางลื่นและกระแสน้ำแรง', en: 'Waterfalls are fullest in and just after the rains — Erawan (Kanchanaburi), Haew Suwat (Khao Yai), Thi Lo Su (Umphang/Tak) and the falls of Loei/Phetchabun; mind slippery paths and strong currents.' } },
  ],
},
];

// ---------- builder ----------
function buildArticle(L, loc) {
  const en = loc === 'en';
  const t = en ? L.en : L.th;
  const stayLabel = en ? '🏨 Where to stay' : '🏨 พักย่านไหน';
  const ranked = {
    kind: 'ranked',
    items: L.items.map((it, i) => ({
      rank: i + 1, name: it.name[loc], href: it.href, blurb: it.blurb[loc],
      ...(it.stayHref ? { meta: `<a href="${it.stayHref}">${stayLabel}</a>` } : {}),
      tags: (it.tags && it.tags[loc]) || [],
    })),
  };
  const blocks = [
    { kind: 'p', html: t.quick },
    { kind: 'h2', text: en ? 'The picks, ranked' : 'จัดอันดับให้เลือก', id: 'picks' },
    ranked,
    { kind: 'cta', text: en ? 'Not sure yet? Compare destinations and build your trip in the Plan hub.' : 'ยังเลือกไม่ได้? เทียบจุดหมายและวางแผนต่อในศูนย์รวมคู่มือเที่ยว', href: 'plan-your-trip.html', label: en ? '🧭 Plan your trip' : '🧭 วางแผนเที่ยว' },
  ];
  // related: each item's city/area + plan hub + destinations
  const seen = new Set();
  const rel = [];
  for (const it of L.items) { if (!seen.has(it.href)) { seen.add(it.href); rel.push({ href: it.href, title: it.name[loc] }); } }
  rel.push({ href: 'destinations.html', title: en ? '🗺️ All top destinations' : '🗺️ เมืองท่องเที่ยวทั้งหมด' });
  rel.push({ href: 'plan-your-trip.html', title: en ? '🧭 Plan Your Trip hub' : '🧭 ศูนย์รวมคู่มือเตรียมตัว' });
  return {
    slug: L.slug, type: 'guide', cluster: 'thailand',
    title: t.title, metaDesc: t.metaDesc, ogTitle: t.title.split(' | ')[0], ogDesc: t.intro,
    image: `/images/heroes/${L.hero}.jpg`, heroImg: `/images/heroes/${L.hero}.jpg`,
    crumbCity: en ? 'Top destinations' : 'เมืองท่องเที่ยว', crumbCityHref: 'destinations.html',
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: t.eyebrow, h1: t.h1, heroEmoji: L.emoji, intro: t.intro,
    chips: en ? ['Ranked', 'Real destinations', 'Where to stay'] : ['จัดอันดับ', 'ที่จริงทั้งหมด', 'พร้อมที่พัก'],
    readTime: en ? '5 min read' : '5 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: L.faq.map((f) => ({ q: f.q[loc], a: f.a[loc] })),
    related: rel.slice(0, 8),
  };
}

// ---------- write ----------
let n = 0; const leaks = [], misaligned = [];
// validate all link targets exist (city/where-to-stay slug or a hub) before writing
const slugSet = new Set(fs.readdirSync(A_TH).filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5)));
const hubSet = new Set(fs.readdirSync(PUB).filter((f) => f.endsWith('.html')).map((f) => f.slice(0, -5)));
const valid = (href) => { const b = href.replace(/\.html$/, ''); return slugSet.has(b) || hubSet.has(b); };
const badLinks = [];
for (const L of LISTS) for (const it of L.items) { for (const h of [it.href, it.stayHref].filter(Boolean)) if (!valid(h)) badLinks.push(`${L.slug}:${h}`); }
if (badLinks.length) { console.error('ABORT — broken target links:', badLinks); process.exit(1); }

for (const L of LISTS) {
  const th = buildArticle(L, 'th'), en = buildArticle(L, 'en');
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) { misaligned.push(L.slug); continue; }
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) { misaligned.push(L.slug + ':keys'); continue; }
  if (hasThai(JSON.stringify(en))) { leaks.push(L.slug); continue; }
  fs.writeFileSync(path.join(A_TH, L.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, L.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
  n++;
}
console.log(JSON.stringify({ written: n, slugs: LISTS.map((l) => l.slug), enThaiLeaks: leaks, misaligned }, null, 2));

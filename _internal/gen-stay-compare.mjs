// Money-making content: "where to stay in X" (neighborhood) + "X vs Y" (comparison) guides.
// Drives the LIVE hotel affiliates (Agoda/Trip via roundup links). Unified TH/EN → aligned blocks,
// EN native zero-Thai, AEO (40-60w answer + comparison table + FAQ). Real neighborhoods + real
// roundup/hub links only (verified to exist). Writes articles{,-en}.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const A_TH = path.join(ROOT, 'astro/src/content/articles');
const A_EN = path.join(ROOT, 'astro/src/content/articles-en');
const DATE = '2026-06-20';
const AGODA = 'https://www.agoda.com/?cid=1965862';

// cities that get a where-to-stay guide (used to guard cross-links)
const NB = new Set(['bangkok','chiang-mai','phuket','krabi','pattaya','samui','huahin','koh-phangan']);

// ---------- NEIGHBORHOOD ("where to stay in X") ----------
const HOODS = [
{ city:'bangkok', th:'กรุงเทพ', en:'Bangkok', hero:'bangkok',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> มากรุงเทพครั้งแรกและอยากเดินทางสะดวกสุด พักย่าน <strong>สุขุมวิท</strong> (อโศก-นานา-ทองหล่อ) หรือ <strong>สีลม-สาทร</strong> เพราะติดรถไฟฟ้า BTS/MRT ไปไหนก็ง่าย สายไนต์ไลฟ์ก็สองย่านนี้ สายวัด-ของเก่าเลือกย่านเมืองเก่า (รัตนโกสินทร์/ข้าวสาร) สายวิวแม่น้ำเลือกริมเจ้าพระยา',
    en:'<strong>Short answer:</strong> For a first visit with the easiest transport, stay in <strong>Sukhumvit</strong> (Asok–Nana–Thong Lo) or <strong>Silom–Sathorn</strong> — both sit on the BTS/MRT so everything is easy, and both are the nightlife hubs. For temples and old-world charm pick the Old City (Rattanakosin/Khao San); for river views pick the Chao Phraya riverside.' },
  areas:[
    { a:{th:'สุขุมวิท (อโศก-ทองหล่อ)',en:'Sukhumvit (Asok–Thong Lo)'}, v:{th:'กิน-ดื่ม ไนต์ไลฟ์ ติด BTS',en:'Dining, nightlife, on the BTS'}, n:{th:'สะดวกสุดสำหรับนักท่องเที่ยวครั้งแรก',en:'Easiest base for first-timers'} },
    { a:{th:'สีลม & สาทร',en:'Silom & Sathorn'}, v:{th:'ย่านธุรกิจ ไนต์ไลฟ์ ติด BTS/MRT',en:'Business, nightlife, BTS/MRT'}, n:{th:'กลางคืนคึกคัก ใกล้สวนลุม',en:'Lively after dark; near Lumphini Park'} },
    { a:{th:'ริมแม่น้ำเจ้าพระยา',en:'Chao Phraya riverside'}, v:{th:'โรงแรมหรู วิวแม่น้ำ',en:'Luxury hotels, river views'}, n:{th:'สวยแต่ต่อเรือ/รถเข้าเมือง',en:'Beautiful but needs a boat/ride into town'} },
    { a:{th:'เมืองเก่า (รัตนโกสินทร์/ข้าวสาร)',en:'Old City (Rattanakosin/Khao San)'}, v:{th:'วัด ของเก่า แบ็คแพ็คเกอร์',en:'Temples, heritage, backpackers'}, n:{th:'ใกล้วัดพระแก้ว แต่ไม่ติดรถไฟฟ้า',en:'By the Grand Palace; no BTS nearby'} },
    { a:{th:'สยาม & ประตูน้ำ',en:'Siam & Pratunam'}, v:{th:'ช้อปปิ้ง ห้างใหญ่ ใจกลางเมือง',en:'Shopping malls, central'}, n:{th:'เหมาะสายช้อป ติด BTS',en:'Best for shoppers; on the BTS'} },
  ],
  styles:{ th:[
    '<strong>มาครั้งแรก/เที่ยวสะดวก</strong> → สุขุมวิท หรือ สีลม',
    '<strong>สายไนต์ไลฟ์</strong> → สุขุมวิท (นานา/ทองหล่อ) หรือ สีลม',
    '<strong>สายวัด-ของเก่า</strong> → เมืองเก่า รัตนโกสินทร์',
    '<strong>สายช้อปปิ้ง</strong> → สยาม/ประตูน้ำ',
    '<strong>สายหรู-วิวแม่น้ำ</strong> → ริมเจ้าพระยา',
  ], en:[
    '<strong>First time / easy transport</strong> → Sukhumvit or Silom',
    '<strong>Nightlife</strong> → Sukhumvit (Nana/Thong Lo) or Silom',
    '<strong>Temples & heritage</strong> → Old City (Rattanakosin)',
    '<strong>Shopping</strong> → Siam/Pratunam',
    '<strong>Luxury & river views</strong> → Chao Phraya riverside',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในกรุงเทพสำหรับครั้งแรก?',en:'Where should I stay in Bangkok for a first visit?'},
      a:{th:'สุขุมวิท (อโศก-นานา) หรือสีลม เพราะติดรถไฟฟ้า BTS/MRT ไปเที่ยวจุดต่าง ๆ สะดวกสุด มีร้านอาหารและไนต์ไลฟ์ครบในย่านเดียว',
        en:'Sukhumvit (Asok–Nana) or Silom — both are on the BTS/MRT for the easiest access to sights, with plenty of restaurants and nightlife in one area.'} },
    { q:{th:'อยากพักใกล้วัดพระแก้ว-ข้าวสารควรพักย่านไหน?',en:'Where to stay near the Grand Palace and Khao San?'},
      a:{th:'ย่านเมืองเก่า รัตนโกสินทร์ และถนนข้าวสาร อยู่ใกล้วัดพระแก้ว วัดโพธิ์ และวัดอรุณ แต่ย่านนี้ไม่ติดรถไฟฟ้า ต้องใช้เรือด่วนเจ้าพระยาหรือแท็กซี่',
        en:'The Old City around Rattanakosin and Khao San Road is close to the Grand Palace, Wat Pho and Wat Arun, but it is not on the BTS — use the Chao Phraya express boat or a taxi.'} },
    { q:{th:'พักริมแม่น้ำเจ้าพระยาคุ้มไหม?',en:'Is staying by the Chao Phraya river worth it?'},
      a:{th:'คุ้มถ้าชอบวิวแม่น้ำและโรงแรมหรู หลายแห่งมีเรือรับส่งไป BTS สะพานตากสิน แต่ถ้าเน้นเดินเที่ยวเองสะดวก ย่านติดรถไฟฟ้าจะคล่องกว่า',
        en:'Worth it if you love river views and upscale hotels; many run shuttle boats to BTS Saphan Taksin. But for self-guided sightseeing, a station-side neighborhood is more convenient.'} },
  ] },
{ city:'chiang-mai', th:'เชียงใหม่', en:'Chiang Mai', hero:'chiang-mai',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> มาเชียงใหม่ครั้งแรกพัก <strong>เมืองเก่า</strong> (ในคูเมือง) เดินเที่ยววัดและถนนคนเดินได้สบาย สายคาเฟ่-ฮิป-วัยรุ่นเลือก <strong>นิมมานเหมินท์</strong> สายชิล-หรูเลือกริมแม่น้ำปิง ส่วนใกล้ตลาดและสนามบินเลือกย่านไนต์บาซาร์/ช้างคลาน',
    en:'<strong>Short answer:</strong> For a first visit stay in the <strong>Old City</strong> (inside the moat) to walk to temples and the walking streets. For cafés and a hip, younger vibe choose <strong>Nimmanhaemin</strong>; for a calm, upscale feel pick the Ping riverside; for markets and the airport, the Night Bazaar/Chang Khlan area.' },
  areas:[
    { a:{th:'เมืองเก่า (ในคูเมือง)',en:'Old City (inside the moat)'}, v:{th:'วัด ถนนคนเดิน เดินเที่ยว',en:'Temples, walking streets, strolling'}, n:{th:'เหมาะครั้งแรก เดินถึงทุกอย่าง',en:'Best for first-timers; walk everywhere'} },
    { a:{th:'นิมมานเหมินท์',en:'Nimmanhaemin'}, v:{th:'คาเฟ่ ฮิป ร้านอาหาร วัยรุ่น',en:'Cafés, hip, dining, younger crowd'}, n:{th:'ใกล้ มช. ดิจิทัลโนแมดเยอะ',en:'Near the university; digital-nomad favorite'} },
    { a:{th:'ริมแม่น้ำปิง',en:'Ping riverside'}, v:{th:'ชิล หรู วิวแม่น้ำ',en:'Calm, upscale, river views'}, n:{th:'บรรยากาศดี เงียบกว่าในเมือง',en:'Lovely atmosphere, quieter than the center'} },
    { a:{th:'ไนต์บาซาร์ / ช้างคลาน',en:'Night Bazaar / Chang Khlan'}, v:{th:'ตลาดกลางคืน ช้อปปิ้ง สะดวก',en:'Night market, shopping, convenient'}, n:{th:'คึกคักตอนค่ำ ใกล้แม่น้ำ',en:'Lively at night; near the river'} },
  ],
  styles:{ th:[
    '<strong>มาครั้งแรก/เดินเที่ยววัด</strong> → เมืองเก่า',
    '<strong>สายคาเฟ่-ฮิป/ทำงานไปเที่ยวไป</strong> → นิมมาน',
    '<strong>สายชิล-หรู</strong> → ริมแม่น้ำปิง',
    '<strong>สายตลาด-ช้อป</strong> → ไนต์บาซาร์/ช้างคลาน',
  ], en:[
    '<strong>First time / temple walking</strong> → Old City',
    '<strong>Cafés & hip / work-and-travel</strong> → Nimman',
    '<strong>Calm & upscale</strong> → Ping riverside',
    '<strong>Markets & shopping</strong> → Night Bazaar/Chang Khlan',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในเชียงใหม่สำหรับครั้งแรก?',en:'Where should I stay in Chiang Mai for a first visit?'},
      a:{th:'เมืองเก่าในคูเมืองดีสุดสำหรับครั้งแรก เพราะเดินถึงวัดสำคัญและถนนคนเดินวันอาทิตย์ได้ บรรยากาศคลาสสิกและที่พักมีให้เลือกทุกงบ',
        en:'The Old City inside the moat is best for a first visit — you can walk to the major temples and the Sunday Walking Street, with a classic feel and rooms for every budget.'} },
    { q:{th:'นิมมานเหมาะกับใคร?',en:'Who is Nimman best for?'},
      a:{th:'เหมาะสายคาเฟ่ ร้านอาหารฮิป ช้อปปิ้งโมเดิร์น และคนทำงานไปเที่ยวไป (ดิจิทัลโนแมด) อยู่ใกล้มหาวิทยาลัยเชียงใหม่ บรรยากาศวัยรุ่นและคึกคัก',
        en:'It suits café-hoppers, hip restaurants, modern shopping and digital nomads. It is near Chiang Mai University with a young, lively vibe.'} },
    { q:{th:'อยากเงียบ ๆ ชิล ๆ พักไหนดี?',en:'Where to stay for a quiet, relaxed feel?'},
      a:{th:'ริมแม่น้ำปิงเงียบและบรรยากาศดี มีโรงแรมบูติกและรีสอร์ตวิวแม่น้ำ ห่างความวุ่นวายในเมืองนิดหน่อยแต่ยังเข้าเมืองง่าย',
        en:'The Ping riverside is quiet and atmospheric, with boutique hotels and river-view resorts — a little away from the bustle but still easy to reach the center.'} },
  ] },
{ city:'phuket', th:'ภูเก็ต', en:'Phuket', hero:'phuket',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> สายปาร์ตี้-หาดคึกคักพัก <strong>ป่าตอง</strong> สายครอบครัว-หาดชิลเลือก <strong>กะตะ/กะรน</strong> สายหรู-เงียบเลือก <strong>บางเทา/ลากูน่า</strong> สายวัฒนธรรม-คาเฟ่เลือก <strong>เมืองเก่าภูเก็ต</strong> เลือกตามว่าชอบหาดแบบไหนและอยากคึกคักหรือสงบ',
    en:'<strong>Short answer:</strong> For parties and a buzzing beach stay in <strong>Patong</strong>; for families and relaxed sand choose <strong>Kata/Karon</strong>; for luxury and quiet pick <strong>Bang Tao/Laguna</strong>; for culture and cafés choose <strong>Phuket Old Town</strong>. Pick by the kind of beach you want and whether you want lively or calm.' },
  areas:[
    { a:{th:'ป่าตอง',en:'Patong'}, v:{th:'ไนต์ไลฟ์ หาดคึกคัก ช้อป',en:'Nightlife, busy beach, shopping'}, n:{th:'คึกคักสุด เหมาะสายปาร์ตี้',en:'The liveliest; best for partygoers'} },
    { a:{th:'กะตะ & กะรน',en:'Kata & Karon'}, v:{th:'หาดสวยกว่า ชิล ครอบครัว',en:'Nicer beaches, relaxed, family'}, n:{th:'เงียบกว่าป่าตอง แต่ยังมีร้าน',en:'Quieter than Patong but still has dining'} },
    { a:{th:'บางเทา / ลากูน่า',en:'Bang Tao / Laguna'}, v:{th:'รีสอร์ตหรู บีชคลับ เงียบ',en:'Luxury resorts, beach clubs, quiet'}, n:{th:'เหมาะฮันนีมูน/หรู',en:'Great for honeymoons / luxury'} },
    { a:{th:'เมืองเก่าภูเก็ต',en:'Phuket Old Town'}, v:{th:'ตึกชิโน คาเฟ่ วัฒนธรรม',en:'Sino architecture, cafés, culture'}, n:{th:'ไม่ติดหาด แต่มีเสน่ห์',en:'Not on the beach but full of charm'} },
    { a:{th:'ราไวย์ & ในหาน',en:'Rawai & Nai Harn'}, v:{th:'ใต้สุด ท้องถิ่น เงียบ',en:'Far south, local, quiet'}, n:{th:'เหมาะอยู่ยาว สายชิล',en:'Good for long, slow stays'} },
  ],
  styles:{ th:[
    '<strong>สายปาร์ตี้/ไนต์ไลฟ์</strong> → ป่าตอง',
    '<strong>ครอบครัว/หาดชิล</strong> → กะตะ-กะรน หรือ กมลา',
    '<strong>หรู-ฮันนีมูน</strong> → บางเทา/ลากูน่า',
    '<strong>วัฒนธรรม-คาเฟ่</strong> → เมืองเก่าภูเก็ต',
    '<strong>อยู่ยาว/ท้องถิ่น</strong> → ราไวย์-ในหาน',
  ], en:[
    '<strong>Parties / nightlife</strong> → Patong',
    '<strong>Family / relaxed beach</strong> → Kata–Karon or Kamala',
    '<strong>Luxury / honeymoon</strong> → Bang Tao/Laguna',
    '<strong>Culture / cafés</strong> → Phuket Old Town',
    '<strong>Long stays / local</strong> → Rawai–Nai Harn',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในภูเก็ตสำหรับครั้งแรก?',en:'Where should I stay in Phuket for a first visit?'},
      a:{th:'ถ้าชอบหาดคึกคักและไนต์ไลฟ์เลือกป่าตอง ถ้าอยากได้หาดสวยและบรรยากาศชิลกว่าเลือกกะตะหรือกะรน ทั้งสามย่านมีที่พักทุกงบและเดินทางไปทัวร์เกาะสะดวก',
        en:'For a lively beach and nightlife pick Patong; for nicer beaches and a calmer feel choose Kata or Karon. All three have rooms for every budget and easy access to island tours.'} },
    { q:{th:'ภูเก็ตหาดไหนเหมาะครอบครัว?',en:'Which Phuket beach is best for families?'},
      a:{th:'กะตะ กะรน และกมลาเหมาะครอบครัวเพราะหาดเงียบกว่า น้ำไม่แรงในหน้าไฮซีซั่น และมีรีสอร์ตที่เหมาะกับเด็ก ส่วนป่าตองคึกคักและเหมาะวัยรุ่นมากกว่า',
        en:'Kata, Karon and Kamala suit families — calmer beaches, gentler water in high season, and family-friendly resorts. Patong is busier and better for a younger crowd.'} },
    { q:{th:'อยากพักหรูเงียบ ๆ ในภูเก็ตควรไปย่านไหน?',en:'Where to stay for quiet luxury in Phuket?'},
      a:{th:'บางเทาและลากูน่าทางเหนือของเกาะมีรีสอร์ตหรู บีชคลับ และสนามกอล์ฟ บรรยากาศเงียบเป็นส่วนตัว เหมาะฮันนีมูนหรือคนที่อยากพักผ่อนจริงจัง',
        en:'Bang Tao and Laguna in the north have luxury resorts, beach clubs and golf, with a quiet, private feel — ideal for honeymoons or a serious rest.'} },
  ] },
{ city:'krabi', th:'กระบี่', en:'Krabi', hero:'krabi',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> ส่วนใหญ่พัก <strong>อ่าวนาง</strong> เพราะเป็นศูนย์กลางที่พัก ร้านอาหาร และเรือออกทัวร์เกาะ สายธรรมชาติ-เงียบ-ไม่มีรถเลือก <strong>ไร่เลย์</strong> (เข้าถึงด้วยเรือเท่านั้น) สายประหยัด-ท้องถิ่น-เดินทางต่อสะดวกเลือก <strong>ตัวเมืองกระบี่</strong>',
    en:'<strong>Short answer:</strong> Most people stay in <strong>Ao Nang</strong> — the hub for hotels, dining and island-tour boats. For nature, quiet and no cars choose <strong>Railay</strong> (reachable only by boat); for budget, local life and onward transport pick <strong>Krabi Town</strong>.' },
  areas:[
    { a:{th:'อ่าวนาง',en:'Ao Nang'}, v:{th:'หาดหลัก ร้านอาหาร เรือทัวร์',en:'Main beach, dining, tour boats'}, n:{th:'สะดวกสุด เหมาะครั้งแรก',en:'Most convenient; best for first-timers'} },
    { a:{th:'ไร่เลย์',en:'Railay'}, v:{th:'หน้าผา ปีนผา เงียบ ไม่มีรถ',en:'Cliffs, climbing, quiet, no cars'}, n:{th:'เข้าได้ด้วยเรือเท่านั้น สวยมาก',en:'Boat-access only; stunning scenery'} },
    { a:{th:'ตัวเมืองกระบี่',en:'Krabi Town'}, v:{th:'ท้องถิ่น ถูก ขนส่งสะดวก',en:'Local, cheap, transport hub'}, n:{th:'ไม่ติดหาด แต่ต่อรถ-เรือง่าย',en:'Not on a beach but easy onward travel'} },
  ],
  styles:{ th:[
    '<strong>มาครั้งแรก/เที่ยวเกาะสะดวก</strong> → อ่าวนาง',
    '<strong>ธรรมชาติ-เงียบ-ปีนผา</strong> → ไร่เลย์',
    '<strong>ประหยัด-ท้องถิ่น</strong> → ตัวเมืองกระบี่',
    '<strong>อยากได้เกาะจริง ๆ</strong> → ต่อเรือไปเกาะลันตา/พีพี',
  ], en:[
    '<strong>First time / easy island trips</strong> → Ao Nang',
    '<strong>Nature, quiet, climbing</strong> → Railay',
    '<strong>Budget / local</strong> → Krabi Town',
    '<strong>A true island feel</strong> → ferry on to Koh Lanta/Phi Phi',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในกระบี่สำหรับครั้งแรก?',en:'Where should I stay in Krabi for a first visit?'},
      a:{th:'อ่าวนางดีสุดสำหรับครั้งแรก เป็นศูนย์กลางที่พักทุกงบ ร้านอาหาร และท่าเรือออกทัวร์ 4 เกาะกับเกาะพีพี เดินเล่นริมหาดได้และเดินทางสะดวก',
        en:'Ao Nang is best for a first visit — the hub for hotels of all budgets, restaurants and boats to the 4 Islands and Phi Phi, with a walkable beachfront and easy transport.'} },
    { q:{th:'ไร่เลย์เหมาะกับใคร?',en:'Who is Railay best for?'},
      a:{th:'เหมาะคนรักธรรมชาติ ปีนผา และอยากได้บรรยากาศเงียบสงบไม่มีรถ ไร่เลย์เข้าได้ด้วยเรือหางยาวจากอ่าวนางเท่านั้น วิวหน้าผาหินปูนสวยมาก',
        en:'It suits nature lovers, rock climbers and anyone wanting a quiet, car-free vibe. Railay is reachable only by longtail boat from Ao Nang, with gorgeous limestone-cliff scenery.'} },
    { q:{th:'อยากประหยัดพักไหนดีในกระบี่?',en:'Where is the cheapest area to stay in Krabi?'},
      a:{th:'ตัวเมืองกระบี่ที่พักถูกกว่าและเป็นย่านท้องถิ่น มีตลาดกลางคืนและขนส่งต่อไปที่อื่นสะดวก แต่ไม่ติดหาด ต้องนั่งรถไปอ่าวนางราว 20–30 นาที',
        en:'Krabi Town has cheaper, more local accommodation with a night market and good onward transport, but it is not on a beach — Ao Nang is a 20–30 minute ride away.'} },
  ] },
{ city:'pattaya', th:'พัทยา', en:'Pattaya', hero:'chonburi',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> สายไนต์ไลฟ์-อยากอยู่กลางความคึกคักพัก <strong>พัทยากลาง</strong> สายครอบครัว-หาดยาวเงียบกว่าเลือก <strong>จอมเทียน</strong> สายเงียบ-ท้องถิ่นเลือก <strong>นาเกลือ</strong> ส่วน <strong>พระตำหนัก</strong> อยู่กึ่งกลาง เงียบกว่าแต่ยังเข้าเมืองง่าย',
    en:'<strong>Short answer:</strong> For nightlife and being in the thick of it stay in <strong>Central Pattaya</strong>; for families and a longer, quieter beach choose <strong>Jomtien</strong>; for quiet and local life pick <strong>Naklua</strong>; <strong>Pratumnak</strong> sits in between — calmer but still close to town.' },
  areas:[
    { a:{th:'พัทยากลาง',en:'Central Pattaya'}, v:{th:'ไนต์ไลฟ์ ช้อป ใจกลาง',en:'Nightlife, shopping, central'}, n:{th:'คึกคักสุด สะดวกทุกอย่าง',en:'Liveliest; everything close'} },
    { a:{th:'จอมเทียน',en:'Jomtien'}, v:{th:'หาดยาว ครอบครัว เงียบกว่า',en:'Long beach, family, quieter'}, n:{th:'เหมาะครอบครัว/อยู่ยาว',en:'Good for families / longer stays'} },
    { a:{th:'นาเกลือ',en:'Naklua'}, v:{th:'ท้องถิ่น เงียบ อาหารทะเล',en:'Local, quiet, seafood'}, n:{th:'เหมาะคนชอบสงบ ใกล้เมือง',en:'Calm, yet close to town'} },
    { a:{th:'พระตำหนัก',en:'Pratumnak'}, v:{th:'กึ่งกลาง เงียบ อัปสเกล',en:'In-between, quiet, upscale'}, n:{th:'หาดเล็กเงียบ ใกล้ทั้งสองฝั่ง',en:'Small quiet coves; near both ends'} },
  ],
  styles:{ th:[
    '<strong>สายไนต์ไลฟ์/ช้อป</strong> → พัทยากลาง',
    '<strong>ครอบครัว/หาดยาว</strong> → จอมเทียน',
    '<strong>เงียบ-ท้องถิ่น</strong> → นาเกลือ',
    '<strong>เงียบแต่ใกล้เมือง</strong> → พระตำหนัก',
  ], en:[
    '<strong>Nightlife / shopping</strong> → Central Pattaya',
    '<strong>Family / long beach</strong> → Jomtien',
    '<strong>Quiet & local</strong> → Naklua',
    '<strong>Quiet but near town</strong> → Pratumnak',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในพัทยาสำหรับครอบครัว?',en:'Where should families stay in Pattaya?'},
      a:{th:'จอมเทียนเหมาะครอบครัวสุด หาดยาวกว่าและเงียบกว่าพัทยากลาง มีคอนโด-รีสอร์ตที่เหมาะเด็กและสวนน้ำใกล้ ๆ ส่วนพัทยากลางคึกคักและเน้นไนต์ไลฟ์มากกว่า',
        en:'Jomtien is best for families — a longer, quieter beach than Central, with family-friendly condos and resorts and water parks nearby. Central Pattaya is busier and more nightlife-focused.'} },
    { q:{th:'อยากอยู่กลางความคึกคักพักไหนดี?',en:'Where to stay to be in the action?'},
      a:{th:'พัทยากลางอยู่ใจกลางทุกอย่าง ทั้งวอล์กกิงสตรีท ห้าง ร้านอาหาร และชายหาด เดินถึงไนต์ไลฟ์ได้ เหมาะคนเที่ยวกลางคืนและไม่อยากเดินทางไกล',
        en:'Central Pattaya puts you in the middle of everything — Walking Street, malls, restaurants and the beach — within walking distance of the nightlife, ideal for night owls who do not want to travel far.'} },
    { q:{th:'อยากเงียบ ๆ ในพัทยาควรพักไหน?',en:'Where is quiet in Pattaya?'},
      a:{th:'นาเกลือทางเหนือเงียบและเป็นย่านท้องถิ่นที่ขึ้นชื่อเรื่องอาหารทะเล ส่วนพระตำหนักมีหาดเล็กเงียบและบรรยากาศอัปสเกล ทั้งสองที่ยังเข้าเมืองได้ง่าย',
        en:'Naklua to the north is quiet and a local area known for seafood, while Pratumnak has small calm coves and an upscale feel — both still within easy reach of town.'} },
  ] },
{ city:'samui', th:'เกาะสมุย', en:'Koh Samui', hero:'samui',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> มาสมุยครั้งแรกและอยากได้ทั้งหาดและความสะดวกพัก <strong>เฉวง</strong> (หาดหลัก ร้านเยอะ ไนต์ไลฟ์) สายชิลกว่าแต่ยังมีร้านเลือก <strong>ละไม</strong> สายครอบครัว-เงียบเลือก <strong>แม่น้ำ/เชิงมน</strong> สายคาเฟ่-ดินเนอร์มีเสน่ห์เลือก <strong>บ่อผุด (หมู่บ้านชาวประมง)</strong>',
    en:'<strong>Short answer:</strong> For a first visit with beach plus convenience stay in <strong>Chaweng</strong> (the main beach, lots of dining and nightlife); for a calmer feel that still has restaurants choose <strong>Lamai</strong>; for families and quiet pick <strong>Maenam/Choeng Mon</strong>; for cafés and charming dinners choose <strong>Bophut (Fisherman’s Village)</strong>.' },
  areas:[
    { a:{th:'หาดเฉวง',en:'Chaweng'}, v:{th:'หาดหลัก ไนต์ไลฟ์ ร้านเยอะ',en:'Main beach, nightlife, dining'}, n:{th:'สะดวกสุด เหมาะครั้งแรก',en:'Most convenient; best first base'} },
    { a:{th:'หาดละไม',en:'Lamai'}, v:{th:'ชิลกว่า แต่ยังมีร้าน',en:'Calmer but still lively enough'}, n:{th:'คุ้มกว่าเฉวงนิดหน่อย',en:'Slightly better value than Chaweng'} },
    { a:{th:'บ่อผุด (หมู่บ้านชาวประมง)',en:'Bophut (Fisherman’s Village)'}, v:{th:'คาเฟ่ ดินเนอร์ มีเสน่ห์',en:'Cafés, dining, charm'}, n:{th:'น่ารัก เหมาะคู่รัก',en:'Charming; great for couples'} },
    { a:{th:'แม่น้ำ & เชิงมน',en:'Maenam & Choeng Mon'}, v:{th:'เงียบ ครอบครัว ราคาดี',en:'Quiet, family, good value'}, n:{th:'เหมาะพักผ่อนจริงจัง',en:'Best for a real rest'} },
  ],
  styles:{ th:[
    '<strong>มาครั้งแรก/หาด+ไนต์ไลฟ์</strong> → เฉวง',
    '<strong>ชิลแต่ยังมีร้าน</strong> → ละไม',
    '<strong>คาเฟ่-ดินเนอร์-คู่รัก</strong> → บ่อผุด',
    '<strong>ครอบครัว-เงียบ-ราคาดี</strong> → แม่น้ำ/เชิงมน',
  ], en:[
    '<strong>First time / beach + nightlife</strong> → Chaweng',
    '<strong>Calmer but still lively</strong> → Lamai',
    '<strong>Cafés, dining, couples</strong> → Bophut',
    '<strong>Family, quiet, value</strong> → Maenam/Choeng Mon',
  ] },
  faq:[
    { q:{th:'พักหาดไหนดีในเกาะสมุยสำหรับครั้งแรก?',en:'Which Koh Samui beach is best for a first visit?'},
      a:{th:'หาดเฉวงดีสุดสำหรับครั้งแรก เป็นหาดหลักที่มีที่พักทุกงบ ร้านอาหาร ช้อปปิ้ง และไนต์ไลฟ์ครบ เดินทางไปจุดอื่นบนเกาะก็สะดวก',
        en:'Chaweng is best for a first visit — the main beach with rooms for every budget, restaurants, shopping and nightlife, and easy access to the rest of the island.'} },
    { q:{th:'สมุยหาดไหนเหมาะครอบครัวและเงียบ?',en:'Which Samui beach is quiet and family-friendly?'},
      a:{th:'แม่น้ำและเชิงมนเงียบและเหมาะครอบครัว น้ำตื้นนิ่งกว่าเฉวงและราคาที่พักมักดีกว่า ส่วนบ่อผุดน่ารักเหมาะคู่รักและสายคาเฟ่',
        en:'Maenam and Choeng Mon are quiet and family-friendly, with calmer shallow water than Chaweng and often better room prices. Bophut is charming for couples and café lovers.'} },
    { q:{th:'ละไมกับเฉวงต่างกันยังไง?',en:'What is the difference between Lamai and Chaweng?'},
      a:{th:'เฉวงคึกคักและร้านเยอะกว่า ไนต์ไลฟ์จัดกว่า ส่วนละไมชิลกว่า หาดสวยและมักคุ้มราคากว่าเล็กน้อย แต่ยังมีร้านอาหารและบาร์พอสมควร',
        en:'Chaweng is busier with more dining and stronger nightlife, while Lamai is calmer with a lovely beach and slightly better value, yet still has plenty of restaurants and bars.'} },
  ] },
{ city:'huahin', th:'หัวหิน', en:'Hua Hin', hero:'huahin',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> มาหัวหินครั้งแรกพัก <strong>ตัวเมืองหัวหิน</strong> ใกล้ตลาดโต้รุ่ง สถานีรถไฟ และหาด เดินเที่ยวสะดวกสุด สายเงียบ-หาดยาวเลือก <strong>เขาตะเกียบ</strong> ทางใต้ สายรีสอร์ตหรู-เงียบเลือกโซน <strong>หัวหินเหนือ/ชะอำ</strong> ที่มีรีสอร์ตติดหาดเยอะ',
    en:'<strong>Short answer:</strong> For a first visit stay in <strong>Hua Hin town</strong> — near the night market, the train station and the beach, and the easiest to explore on foot. For a quieter, longer beach pick <strong>Khao Takiab</strong> to the south; for quiet luxury resorts choose the <strong>North Hua Hin/Cha-am</strong> stretch with many beachfront resorts.' },
  areas:[
    { a:{th:'ตัวเมืองหัวหิน',en:'Hua Hin town'}, v:{th:'ตลาดโต้รุ่ง หาด รถไฟ เดินสะดวก',en:'Night market, beach, train, walkable'}, n:{th:'เหมาะครั้งแรก ครบในที่เดียว',en:'Best for first-timers; all-in-one'} },
    { a:{th:'เขาตะเกียบ',en:'Khao Takiab'}, v:{th:'หาดยาว เงียบกว่า ครอบครัว',en:'Long beach, quieter, family'}, n:{th:'ห่างเมืองนิด แต่สงบ',en:'A bit out of town but peaceful'} },
    { a:{th:'หัวหินเหนือ / ชะอำ',en:'North Hua Hin / Cha-am'}, v:{th:'รีสอร์ตหรู ติดหาด เงียบ',en:'Luxury resorts, beachfront, quiet'}, n:{th:'เหมาะพักผ่อน ขับรถเข้าเมือง',en:'Best for resort rest; drive into town'} },
  ],
  styles:{ th:[
    '<strong>มาครั้งแรก/เดินเที่ยว-ตลาด</strong> → ตัวเมืองหัวหิน',
    '<strong>ครอบครัว/หาดยาวเงียบ</strong> → เขาตะเกียบ',
    '<strong>รีสอร์ตหรู-พักผ่อน</strong> → หัวหินเหนือ/ชะอำ',
  ], en:[
    '<strong>First time / walking & markets</strong> → Hua Hin town',
    '<strong>Family / quiet long beach</strong> → Khao Takiab',
    '<strong>Luxury resort rest</strong> → North Hua Hin/Cha-am',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในหัวหินสำหรับครั้งแรก?',en:'Where should I stay in Hua Hin for a first visit?'},
      a:{th:'ตัวเมืองหัวหินดีสุดสำหรับครั้งแรก อยู่ใกล้ตลาดโต้รุ่ง สถานีรถไฟเก่า และหาด เดินเที่ยวกินของได้สะดวก มีที่พักทุกงบ',
        en:'Hua Hin town is best for a first visit — near the night market, the historic train station and the beach, easy to explore and eat on foot, with rooms for every budget.'} },
    { q:{th:'อยากพักรีสอร์ตหรูเงียบ ๆ ในหัวหินไปโซนไหน?',en:'Where are the quiet luxury resorts in Hua Hin?'},
      a:{th:'โซนหัวหินเหนือต่อเนื่องถึงชะอำมีรีสอร์ตหรูติดหาดเยอะ เงียบและเป็นส่วนตัว เหมาะพักผ่อนเต็มที่ แต่ควรมีรถหรือใช้แท็กซี่เข้าตัวเมือง',
        en:'The North Hua Hin stretch up to Cha-am has many beachfront luxury resorts — quiet and private, ideal for a full rest, though you will want a car or taxi to reach town.'} },
    { q:{th:'หัวหินเหมาะครอบครัวไหม?',en:'Is Hua Hin good for families?'},
      a:{th:'เหมาะมาก หัวหินเป็นเมืองชายทะเลที่ปลอดภัยและสงบ มีหาดยาว สวนน้ำ และตลาดให้เดิน เขาตะเกียบเหมาะครอบครัวเพราะหาดยาวเงียบและที่พักหลายแบบ',
        en:'Very much so. Hua Hin is a safe, calm seaside town with long beaches, water parks and markets. Khao Takiab suits families with its long, quiet beach and varied accommodation.'} },
  ] },
{ city:'koh-phangan', th:'เกาะพะงัน', en:'Koh Phangan', hero:'koh-phangan',
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> สายปาร์ตี้-ฟูลมูนพัก <strong>หาดริ้น</strong> สายเงียบ-หาดสวยที่สุดเลือก <strong>ท้องนายปาน</strong> ทางเหนือ สายโยคะ-สุขภาพ-วีแกนเลือก <strong>ศรีธนู</strong> ส่วนสายสะดวก-ใกล้ท่าเรือเลือก <strong>ท้องศาลา</strong> (เมืองหลักของเกาะ)',
    en:'<strong>Short answer:</strong> For parties and the Full Moon scene stay at <strong>Haad Rin</strong>; for quiet and the prettiest beaches choose <strong>Thong Nai Pan</strong> in the north; for yoga, wellness and vegan life pick <strong>Srithanu</strong>; for convenience near the pier stay in <strong>Thong Sala</strong> (the island’s main town).' },
  areas:[
    { a:{th:'หาดริ้น',en:'Haad Rin'}, v:{th:'ฟูลมูนปาร์ตี้ ไนต์ไลฟ์',en:'Full Moon Party, nightlife'}, n:{th:'คึกคักสุด คืนปาร์ตี้คนแน่น',en:'Liveliest; packed on party nights'} },
    { a:{th:'ท้องนายปาน',en:'Thong Nai Pan'}, v:{th:'หาดสวยสุด เงียบ รีสอร์ตดี',en:'Best beaches, quiet, nice resorts'}, n:{th:'ทางเหนือ เหมาะพักผ่อน',en:'Far north; ideal for relaxing'} },
    { a:{th:'ศรีธนู',en:'Srithanu'}, v:{th:'โยคะ สุขภาพ วีแกน บรรยากาศฮิปปี้',en:'Yoga, wellness, vegan, bohemian'}, n:{th:'เหมาะสายสุขภาพ-รีทรีต',en:'Best for wellness retreats'} },
    { a:{th:'ท้องศาลา',en:'Thong Sala'}, v:{th:'เมืองหลัก ท่าเรือ ตลาด สะดวก',en:'Main town, pier, markets, convenient'}, n:{th:'ใกล้ทุกอย่าง ไม่ติดหาดสวยสุด',en:'Central; not the prettiest beach'} },
  ],
  styles:{ th:[
    '<strong>สายปาร์ตี้/ฟูลมูน</strong> → หาดริ้น',
    '<strong>หาดสวย-เงียบ-พักผ่อน</strong> → ท้องนายปาน',
    '<strong>โยคะ-สุขภาพ-วีแกน</strong> → ศรีธนู',
    '<strong>สะดวก-ใกล้ท่าเรือ</strong> → ท้องศาลา',
  ], en:[
    '<strong>Parties / Full Moon</strong> → Haad Rin',
    '<strong>Pretty beaches, quiet, rest</strong> → Thong Nai Pan',
    '<strong>Yoga / wellness / vegan</strong> → Srithanu',
    '<strong>Convenient / near the pier</strong> → Thong Sala',
  ] },
  faq:[
    { q:{th:'พักย่านไหนดีในเกาะพะงันถ้าไม่ได้มาปาร์ตี้?',en:'Where to stay on Koh Phangan if not here to party?'},
      a:{th:'ท้องนายปานทางเหนือมีหาดสวยที่สุดและเงียบสงบ เหมาะพักผ่อน ส่วนศรีธนูเหมาะสายโยคะและสุขภาพ ทั้งสองที่ห่างจากความวุ่นวายของหาดริ้น',
        en:'Thong Nai Pan in the north has the prettiest, quietest beaches and is ideal for relaxing, while Srithanu suits yoga and wellness travelers — both are well away from the Haad Rin party scene.'} },
    { q:{th:'อยากมาฟูลมูนปาร์ตี้ควรพักไหน?',en:'Where should I stay for the Full Moon Party?'},
      a:{th:'หาดริ้นคือที่จัดฟูลมูนปาร์ตี้ พักแถวนี้สะดวกเดินกลับที่พักได้ แต่คืนปาร์ตี้คนแน่นและที่พักเต็มเร็ว ควรจองล่วงหน้านาน ๆ',
        en:'Haad Rin is where the Full Moon Party happens, so staying nearby lets you walk back to your room. On party nights it is crowded and rooms sell out, so book well ahead.'} },
    { q:{th:'พักท้องศาลาดีไหม?',en:'Is Thong Sala a good place to stay?'},
      a:{th:'ดีถ้าเน้นความสะดวก ท้องศาลาเป็นเมืองหลักและท่าเรือ มีตลาด ร้านค้า และรถต่อไปหาดอื่นง่าย แต่หาดตรงนี้ไม่สวยเท่าทางเหนือ',
        en:'Good for convenience — Thong Sala is the main town and ferry pier with markets, shops and easy transport to other beaches, though the beach here is not as nice as those in the north.'} },
  ] },
];

// ---------- COMPARISON ("X vs Y") ----------
const COMPARE = [
{ slug:'phuket-vs-krabi', hero:'krabi',
  a:{slug:'phuket',th:'ภูเก็ต',en:'Phuket'}, b:{slug:'krabi',th:'กระบี่',en:'Krabi'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>ภูเก็ต</strong> ถ้าอยากได้ไนต์ไลฟ์ ช้อปปิ้ง ร้านอาหารหลากหลาย เที่ยวบินตรงเยอะ และที่พักทุกระดับ เลือก <strong>กระบี่</strong> ถ้าชอบธรรมชาติ หน้าผาหินปูน หาดเงียบกว่า และบรรยากาศชิล ทั้งสองอยู่ฝั่งอันดามันและนั่งรถถึงกันราว 3 ชั่วโมง ไปเที่ยวทั้งคู่ในทริปเดียวได้',
    en:'<strong>Short answer:</strong> Choose <strong>Phuket</strong> for nightlife, shopping, varied dining, plenty of direct flights and hotels at every level. Choose <strong>Krabi</strong> for nature, limestone cliffs, quieter beaches and a laid-back feel. Both are on the Andaman coast and about 3 hours apart by road, so you can easily do both in one trip.' },
  factors:[
    { f:{th:'บรรยากาศ',en:'Vibe'}, a:{th:'คึกคัก เมืองท่องเที่ยวครบ',en:'Lively, full resort town'}, b:{th:'ชิล ธรรมชาติ',en:'Laid-back, nature'} },
    { f:{th:'ไนต์ไลฟ์',en:'Nightlife'}, a:{th:'จัดเต็ม (ป่าตอง)',en:'Big (Patong)'}, b:{th:'เบากว่า (อ่าวนาง)',en:'Lighter (Ao Nang)'} },
    { f:{th:'หาด/วิว',en:'Beaches/scenery'}, a:{th:'หาดเยอะ หลายสไตล์',en:'Many varied beaches'}, b:{th:'หน้าผาหินปูน ไร่เลย์',en:'Limestone cliffs, Railay'} },
    { f:{th:'ครอบครัว',en:'Families'}, a:{th:'ดี (กะตะ/กมลา)',en:'Good (Kata/Kamala)'}, b:{th:'ดี (อ่าวนาง)',en:'Good (Ao Nang)'} },
    { f:{th:'เดินทางไป',en:'Getting there'}, a:{th:'บินตรงเยอะสุด',en:'Most direct flights'}, b:{th:'บินตรงได้ หรือผ่านภูเก็ต',en:'Direct flights or via Phuket'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ครั้งแรก สายครบรส',en:'First-timers, all-rounders'}, b:{th:'สายธรรมชาติ คู่รัก',en:'Nature lovers, couples'} },
  ],
  choose:{ th:[
    '<strong>เลือกภูเก็ต ถ้า</strong> อยากได้ไนต์ไลฟ์ ช้อปปิ้ง ร้านอาหารหลากหลาย และเที่ยวบินตรงสะดวก',
    '<strong>เลือกกระบี่ ถ้า</strong> ชอบธรรมชาติ หน้าผา หาดเงียบ และบรรยากาศผ่อนคลาย',
    '<strong>มาทั้งคู่ได้</strong> นั่งรถถึงกันราว 3 ชั่วโมง หรือไปเที่ยวเกาะพีพีที่อยู่กึ่งกลาง',
  ], en:[
    '<strong>Pick Phuket if</strong> you want nightlife, shopping, varied dining and convenient direct flights',
    '<strong>Pick Krabi if</strong> you love nature, cliffs, quieter beaches and a relaxed mood',
    '<strong>Do both</strong> — they are ~3 hours apart by road, or meet in the middle at Phi Phi',
  ] },
  faq:[
    { q:{th:'ภูเก็ตหรือกระบี่ดีกว่ากัน?',en:'Phuket or Krabi — which is better?'},
      a:{th:'ขึ้นกับสไตล์ ภูเก็ตครบรสกว่าทั้งไนต์ไลฟ์ ช้อปปิ้ง และร้านอาหาร เหมาะครั้งแรก ส่วนกระบี่ธรรมชาติสวยกว่าและเงียบกว่า เหมาะคนรักธรรมชาติและคู่รัก',
        en:'It depends on your style. Phuket is more all-round with nightlife, shopping and dining, great for a first trip, while Krabi has more dramatic nature and is quieter — ideal for nature lovers and couples.'} },
    { q:{th:'ไปภูเก็ตและกระบี่ในทริปเดียวได้ไหม?',en:'Can I visit both Phuket and Krabi in one trip?'},
      a:{th:'ได้สบาย ทั้งสองอยู่ฝั่งอันดามัน นั่งรถตู้หรือรถบัสถึงกันราว 3–4 ชั่วโมง หรือไปเจอกันที่เกาะพีพีซึ่งอยู่กึ่งกลาง หลายคนแบ่งพักคนละ 2–3 คืน',
        en:'Easily. Both are on the Andaman coast, about 3–4 hours apart by minivan or bus, or you can meet in the middle at Phi Phi. Many travelers split 2–3 nights in each.'} },
    { q:{th:'ที่ไหนเหมาะครอบครัวมากกว่า?',en:'Which is more family-friendly?'},
      a:{th:'ทั้งคู่เหมาะครอบครัว ภูเก็ตเลือกกะตะ-กะรน-กมลาที่หาดเงียบ ส่วนกระบี่อ่าวนางสะดวกและเดินเล่นริมหาดได้ กระบี่อาจรู้สึกผ่อนคลายและไม่วุ่นวายเท่าป่าตอง',
        en:'Both work for families. In Phuket choose calmer Kata–Karon–Kamala; in Krabi, Ao Nang is convenient with a walkable beachfront. Krabi can feel more relaxed and less hectic than Patong.'} },
  ] },
{ slug:'koh-samui-vs-koh-phangan', hero:'koh-phangan',
  a:{slug:'samui',th:'เกาะสมุย',en:'Koh Samui'}, b:{slug:'koh-phangan',th:'เกาะพะงัน',en:'Koh Phangan'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>เกาะสมุย</strong> ถ้าอยากได้เกาะที่สิ่งอำนวยความสะดวกครบ มีสนามบิน รีสอร์ตหรู ร้านอาหารเยอะ เลือก <strong>เกาะพะงัน</strong> ถ้าชอบบรรยากาศชิลกว่า ราคาถูกกว่า หาดสวยเงียบทางเหนือ หรือมาฟูลมูนปาร์ตี้ สองเกาะอยู่ใกล้กัน นั่งเรือต่อกันราว 30 นาที',
    en:'<strong>Short answer:</strong> Choose <strong>Koh Samui</strong> for a fully developed island with an airport, luxury resorts and lots of dining. Choose <strong>Koh Phangan</strong> for a more laid-back, cheaper vibe, quiet pretty beaches in the north, or the Full Moon Party. The two are close — about a 30-minute boat ride apart.' },
  factors:[
    { f:{th:'บรรยากาศ',en:'Vibe'}, a:{th:'ครบครัน รีสอร์ตหรู',en:'Developed, luxury resorts'}, b:{th:'ชิล อิสระ บางส่วนปาร์ตี้',en:'Laid-back, free-spirited, partly party'} },
    { f:{th:'สนามบิน',en:'Airport'}, a:{th:'มี (บินตรงได้)',en:'Yes (direct flights)'}, b:{th:'ไม่มี (ต่อเรือจากสมุย/สุราษฎร์)',en:'No (ferry from Samui/Surat)'} },
    { f:{th:'ราคา',en:'Prices'}, a:{th:'สูงกว่า',en:'Higher'}, b:{th:'ถูกกว่า',en:'Cheaper'} },
    { f:{th:'หาด',en:'Beaches'}, a:{th:'เฉวง/ละไม ครบ',en:'Chaweng/Lamai, full service'}, b:{th:'ท้องนายปาน เงียบสวย',en:'Thong Nai Pan, quiet & pretty'} },
    { f:{th:'ปาร์ตี้',en:'Party scene'}, a:{th:'มีบ้าง',en:'Some'}, b:{th:'ฟูลมูนปาร์ตี้ (หาดริ้น)',en:'Full Moon Party (Haad Rin)'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ครอบครัว สายสะดวก',en:'Families, convenience'}, b:{th:'แบ็คแพ็ค โยคะ ปาร์ตี้',en:'Backpackers, yoga, parties'} },
  ],
  choose:{ th:[
    '<strong>เลือกเกาะสมุย ถ้า</strong> อยากสะดวก บินตรงได้ รีสอร์ตหรู และร้านอาหารเยอะ เหมาะครอบครัว',
    '<strong>เลือกเกาะพะงัน ถ้า</strong> อยากชิล ราคาถูกกว่า หาดเงียบสวย หรือมาฟูลมูนปาร์ตี้',
    '<strong>มาทั้งคู่ได้</strong> นั่งเรือต่อกันราว 30 นาที หลายคนบินลงสมุยแล้วต่อเรือไปพะงัน',
  ], en:[
    '<strong>Pick Koh Samui if</strong> you want convenience, direct flights, luxury resorts and lots of dining — great for families',
    '<strong>Pick Koh Phangan if</strong> you want a laid-back, cheaper feel, quiet pretty beaches, or the Full Moon Party',
    '<strong>Do both</strong> — about a 30-minute boat apart; many fly into Samui then ferry to Phangan',
  ] },
  faq:[
    { q:{th:'เกาะสมุยหรือเกาะพะงันดีกว่า?',en:'Koh Samui or Koh Phangan — which is better?'},
      a:{th:'สมุยสะดวกและครบครันกว่า มีสนามบินและรีสอร์ตหรู เหมาะครอบครัวและคนอยากสบาย ส่วนพะงันชิลกว่า ถูกกว่า และมีหาดเงียบสวยกับฟูลมูนปาร์ตี้ เหมาะแบ็คแพ็คและสายชิล',
        en:'Samui is more convenient and developed, with an airport and luxury resorts — good for families and comfort seekers. Phangan is more laid-back and cheaper, with quiet pretty beaches and the Full Moon Party, suiting backpackers and chilled travelers.'} },
    { q:{th:'ไปเกาะพะงันต้องผ่านเกาะสมุยไหม?',en:'Do I have to go through Koh Samui to reach Koh Phangan?'},
      a:{th:'ไม่จำเป็นแต่สะดวก พะงันไม่มีสนามบิน หลายคนบินลงสมุยแล้วต่อเรือราว 30 นาที หรือนั่งเรือจากท่าสุราษฎร์ธานี (ดอนสัก) ตรงไปพะงันก็ได้',
        en:'Not necessarily, but it is convenient. Phangan has no airport, so many fly into Samui and take a ~30-minute ferry, or take a ferry from Surat Thani (Donsak) straight to Phangan.'} },
    { q:{th:'อยากเที่ยวเงียบ ๆ เลือกเกาะไหน?',en:'Which island is better for a quiet trip?'},
      a:{th:'เกาะพะงันทางเหนือ เช่น ท้องนายปาน เงียบและหาดสวยมาก เหมาะพักผ่อน ส่วนสมุยถ้าอยากเงียบให้เลือกแม่น้ำหรือเชิงมน แทนที่จะเป็นเฉวง',
        en:'The north of Koh Phangan, such as Thong Nai Pan, is quiet with beautiful beaches, ideal for relaxing. On Samui, choose Maenam or Choeng Mon instead of Chaweng for a quieter stay.'} },
  ] },
{ slug:'phuket-vs-koh-samui', hero:'samui',
  a:{slug:'phuket',th:'ภูเก็ต',en:'Phuket'}, b:{slug:'samui',th:'เกาะสมุย',en:'Koh Samui'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>ภูเก็ต</strong> (ฝั่งอันดามัน) ถ้าอยากได้ตัวเลือกเยอะสุด ทั้งหาด ไนต์ไลฟ์ ทัวร์เกาะ และเที่ยวบินตรง เลือก <strong>เกาะสมุย</strong> (อ่าวไทย) ถ้าอยากได้บรรยากาศเกาะที่ชิลและกะทัดรัดกว่า จุดต่างสำคัญคือฤดูฝนคนละช่วง ภูเก็ตฝนราว พ.ค.–ต.ค. ส่วนสมุยฝนปลายปี',
    en:'<strong>Short answer:</strong> Choose <strong>Phuket</strong> (Andaman) for the widest choice — beaches, nightlife, island tours and direct flights. Choose <strong>Koh Samui</strong> (Gulf) for a more compact, laid-back island feel. A key difference is the rainy timing: Phuket is wettest around May–Oct, while Samui’s rain comes late in the year.' },
  factors:[
    { f:{th:'ทะเลฝั่ง',en:'Coast'}, a:{th:'อันดามัน',en:'Andaman'}, b:{th:'อ่าวไทย',en:'Gulf'} },
    { f:{th:'ขนาด/ตัวเลือก',en:'Size/choice'}, a:{th:'ใหญ่ ตัวเลือกเยอะสุด',en:'Big, the most options'}, b:{th:'เล็กกว่า กะทัดรัด',en:'Smaller, more compact'} },
    { f:{th:'ฝนตกหนักช่วง',en:'Wettest months'}, a:{th:'พ.ค.–ต.ค.',en:'May–Oct'}, b:{th:'ต.ค.–ธ.ค.',en:'Oct–Dec'} },
    { f:{th:'ทัวร์เกาะ',en:'Island tours'}, a:{th:'พีพี เจมส์บอนด์ สิมิลัน',en:'Phi Phi, James Bond, Similan'}, b:{th:'อ่างทอง เต่า พะงัน',en:'Angthong, Tao, Phangan'} },
    { f:{th:'ไนต์ไลฟ์',en:'Nightlife'}, a:{th:'จัดเต็ม',en:'Big'}, b:{th:'มี แต่เบากว่า',en:'Present but lighter'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'อยากได้ทุกอย่าง',en:'Want it all'}, b:{th:'เกาะชิล กะทัดรัด',en:'Compact, chilled island'} },
  ],
  choose:{ th:[
    '<strong>เลือกภูเก็ต ถ้า</strong> อยากได้ตัวเลือกเยอะสุด ไนต์ไลฟ์จัด และทัวร์เกาะดัง ๆ อย่างพีพี',
    '<strong>เลือกเกาะสมุย ถ้า</strong> อยากได้เกาะที่ชิลและกะทัดรัด ใกล้พะงัน-เต่า',
    '<strong>ดูฤดูฝนด้วย</strong> ถ้ามาช่วง พ.ค.–ต.ค. สมุยฝั่งอ่าวไทยมักอากาศดีกว่าภูเก็ต',
  ], en:[
    '<strong>Pick Phuket if</strong> you want the most options, big nightlife and famous island tours like Phi Phi',
    '<strong>Pick Koh Samui if</strong> you want a compact, chilled island near Phangan and Tao',
    '<strong>Check the season</strong> — from May–Oct, Gulf-side Samui often has better weather than Phuket',
  ] },
  faq:[
    { q:{th:'ภูเก็ตหรือเกาะสมุยดีกว่า?',en:'Phuket or Koh Samui — which is better?'},
      a:{th:'ภูเก็ตใหญ่กว่าและตัวเลือกเยอะกว่าทั้งหาด ไนต์ไลฟ์ และทัวร์เกาะ เหมาะคนอยากได้ทุกอย่าง ส่วนสมุยเล็กและชิลกว่า เหมาะคนอยากได้บรรยากาศเกาะกะทัดรัดและต่อไปพะงัน-เต่าง่าย',
        en:'Phuket is bigger with more options — beaches, nightlife and island tours — for those who want it all. Samui is smaller and more laid-back, ideal if you want a compact island feel with easy hops to Phangan and Tao.'} },
    { q:{th:'มาช่วงหน้าฝนควรไปภูเก็ตหรือสมุย?',en:'In the rainy season, Phuket or Samui?'},
      a:{th:'สองเกาะอยู่คนละฝั่งทะเลและฝนคนละช่วง ภูเก็ต (อันดามัน) ฝนชุกราว พ.ค.–ต.ค. ส่วนสมุย (อ่าวไทย) ฝนหนักปลายปีราว ต.ค.–ธ.ค. ถ้ามาหน้าฝนของฝั่งหนึ่ง อีกฝั่งมักดีกว่า',
        en:'They sit on opposite coasts with different rainy timing: Phuket (Andaman) is wettest around May–Oct, while Samui (Gulf) is wettest late in the year, around Oct–Dec. If one is in its rainy season, the other is usually better.'} },
    { q:{th:'เดินทางไปไหนง่ายกว่ากัน?',en:'Which is easier to reach?'},
      a:{th:'ทั้งคู่มีสนามบินและบินตรงจากกรุงเทพได้ ภูเก็ตเที่ยวบินถี่และตั๋วมักถูกกว่า ส่วนสมุยสะดวกแต่ตั๋วบินตรงมักแพงกว่า หรือบินลงสุราษฎร์ฯ แล้วต่อเรือเพื่อประหยัด',
        en:'Both have airports with direct flights from Bangkok. Phuket has more frequent, usually cheaper flights, while Samui is convenient but direct fares tend to be higher — or fly to Surat Thani and ferry across to save.'} },
  ] },
{ slug:'chiang-mai-vs-chiang-rai', hero:'chiang-rai',
  a:{slug:'chiang-mai',th:'เชียงใหม่',en:'Chiang Mai'}, b:{slug:'chiang-rai',th:'เชียงราย',en:'Chiang Rai'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>เชียงใหม่</strong> ถ้าอยากได้เมืองที่ครบทั้งวัด คาเฟ่ ร้านอาหาร ไนต์ไลฟ์ และที่พักทุกงบ เหมาะมาครั้งแรกและอยู่ยาว เลือก <strong>เชียงราย</strong> ถ้าอยากได้เมืองที่เงียบกว่า ศิลปะวัดสวย (วัดร่องขุ่น) ธรรมชาติดอยและไร่ชา หลายคนใช้เชียงใหม่เป็นฐานแล้วไปเชียงรายแบบค้างคืน',
    en:'<strong>Short answer:</strong> Choose <strong>Chiang Mai</strong> for a complete city — temples, cafés, dining, nightlife and rooms for every budget, great for a first visit and long stays. Choose <strong>Chiang Rai</strong> for a quieter town, striking art temples (the White Temple), mountains and tea plantations. Many base in Chiang Mai and visit Chiang Rai overnight.' },
  factors:[
    { f:{th:'ขนาดเมือง',en:'City size'}, a:{th:'ใหญ่ ครบครัน',en:'Big, full-service'}, b:{th:'เล็ก เงียบกว่า',en:'Small, quieter'} },
    { f:{th:'ไฮไลต์',en:'Highlights'}, a:{th:'วัด นิมมาน ดอยสุเทพ',en:'Temples, Nimman, Doi Suthep'}, b:{th:'วัดร่องขุ่น ดอย ไร่ชา',en:'White Temple, mountains, tea'} },
    { f:{th:'คาเฟ่/อาหาร',en:'Cafés/food'}, a:{th:'เยอะมาก',en:'Huge variety'}, b:{th:'มี แต่น้อยกว่า',en:'Good but fewer'} },
    { f:{th:'ไนต์ไลฟ์',en:'Nightlife'}, a:{th:'คึกคัก',en:'Lively'}, b:{th:'เงียบ',en:'Quiet'} },
    { f:{th:'เดินทาง',en:'Access'}, a:{th:'บินตรงเยอะ',en:'Many direct flights'}, b:{th:'บินได้ หรือรถ 3 ชม.จากเชียงใหม่',en:'Flights, or 3h drive from CM'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ครั้งแรก อยู่ยาว',en:'First time, long stays'}, b:{th:'สายเงียบ ศิลปะ ธรรมชาติ',en:'Quiet, art, nature'} },
  ],
  choose:{ th:[
    '<strong>เลือกเชียงใหม่ ถ้า</strong> อยากได้เมืองครบรส คาเฟ่เยอะ ไนต์ไลฟ์ และที่พักทุกงบ',
    '<strong>เลือกเชียงราย ถ้า</strong> อยากได้เมืองเงียบ วัดศิลปะสวย และธรรมชาติดอย-ไร่ชา',
    '<strong>มาทั้งคู่ได้</strong> ใช้เชียงใหม่เป็นฐาน แล้วไปเชียงรายค้างคืน 1–2 คืน (รถ ~3 ชม.)',
  ], en:[
    '<strong>Pick Chiang Mai if</strong> you want a complete city with lots of cafés, nightlife and rooms for every budget',
    '<strong>Pick Chiang Rai if</strong> you want a quieter town, striking art temples and mountain/tea scenery',
    '<strong>Do both</strong> — base in Chiang Mai and add 1–2 nights in Chiang Rai (~3h drive)',
  ] },
  faq:[
    { q:{th:'เชียงใหม่หรือเชียงรายดีกว่า?',en:'Chiang Mai or Chiang Rai — which is better?'},
      a:{th:'เชียงใหม่ครบรสกว่า เหมาะครั้งแรกและอยู่ยาว มีคาเฟ่ ร้านอาหาร และไนต์ไลฟ์เยอะ ส่วนเชียงรายเงียบกว่าและมีวัดศิลปะสวยกับธรรมชาติดอย เหมาะคนอยากผ่อนคลายและชอบงานศิลป์',
        en:'Chiang Mai is more all-round, ideal for a first visit and long stays, with lots of cafés, dining and nightlife. Chiang Rai is quieter, with striking art temples and mountain nature — good for relaxing and art lovers.'} },
    { q:{th:'ไปเชียงรายจากเชียงใหม่ยังไง?',en:'How do I get to Chiang Rai from Chiang Mai?'},
      a:{th:'นั่งรถบัสหรือรถตู้ราว 3–4 ชั่วโมง มีรถออกถี่ทั้งวัน หรือเช่ารถขับเองแวะจุดต่าง ๆ ระหว่างทางได้ หลายคนไปเชียงรายแบบค้าง 1–2 คืนแล้วกลับ',
        en:'Take a bus or minivan, about 3–4 hours with frequent departures, or self-drive and stop along the way. Many visit Chiang Rai for 1–2 nights and return.'} },
    { q:{th:'มีเวลาน้อยควรไปที่ไหน?',en:'With limited time, which should I pick?'},
      a:{th:'ถ้ามีเวลาน้อยเลือกเชียงใหม่เพราะครบและเดินทางสะดวกกว่า แล้วถ้าเหลือวันค่อยไปเชียงรายแบบเดย์ทริปยาวหรือค้างคืนเพื่อดูวัดร่องขุ่นและวัดสีน้ำเงิน',
        en:'With limited time pick Chiang Mai — it is more complete and easier to reach — then, if you have a spare day, add Chiang Rai as a long day trip or overnight to see the White and Blue Temples.'} },
  ] },
{ slug:'bangkok-vs-chiang-mai', hero:'chiang-mai',
  a:{slug:'bangkok',th:'กรุงเทพ',en:'Bangkok'}, b:{slug:'chiang-mai',th:'เชียงใหม่',en:'Chiang Mai'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>กรุงเทพ</strong> ถ้าอยากได้เมืองใหญ่ที่มีทุกอย่าง วัดอลังการ ช้อปปิ้ง ไนต์ไลฟ์ อาหารระดับโลก และเป็นประตูสู่ที่อื่น เลือก <strong>เชียงใหม่</strong> ถ้าอยากได้เมืองเหนือที่ชิลกว่า อากาศเย็นกว่า คาเฟ่ ธรรมชาติดอย และค่าครองชีพถูกกว่า ส่วนใหญ่มาทริปแรกควรไปทั้งคู่',
    en:'<strong>Short answer:</strong> Choose <strong>Bangkok</strong> for a megacity with everything — grand temples, shopping, nightlife, world-class food and a gateway to everywhere else. Choose <strong>Chiang Mai</strong> for a calmer northern city with cooler weather, cafés, mountain nature and lower costs. Most first-timers should do both.' },
  factors:[
    { f:{th:'ประเภท',en:'Type'}, a:{th:'เมืองหลวงใหญ่',en:'Huge capital'}, b:{th:'เมืองเหนือ ชิล',en:'Calm northern city'} },
    { f:{th:'อากาศ',en:'Weather'}, a:{th:'ร้อนชื้น',en:'Hot, humid'}, b:{th:'เย็นกว่า (โดยเฉพาะหนาว)',en:'Cooler (esp. cool season)'} },
    { f:{th:'ไฮไลต์',en:'Highlights'}, a:{th:'วัดพระแก้ว ตลาด ช้อป',en:'Grand Palace, markets, malls'}, b:{th:'วัด ดอยสุเทพ คาเฟ่ ช้าง',en:'Temples, Doi Suthep, cafés, elephants'} },
    { f:{th:'ค่าครองชีพ',en:'Cost'}, a:{th:'สูงกว่า',en:'Higher'}, b:{th:'ถูกกว่า',en:'Cheaper'} },
    { f:{th:'จังหวะชีวิต',en:'Pace'}, a:{th:'เร็ว คึกคัก',en:'Fast, buzzing'}, b:{th:'ช้า ผ่อนคลาย',en:'Slow, relaxed'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'เมือง ช้อป ไนต์ไลฟ์',en:'City, shopping, nightlife'}, b:{th:'ธรรมชาติ คาเฟ่ อยู่ยาว',en:'Nature, cafés, long stays'} },
  ],
  choose:{ th:[
    '<strong>เลือกกรุงเทพ ถ้า</strong> ชอบเมืองใหญ่ ช้อปปิ้ง ไนต์ไลฟ์ และอาหารหลากหลายระดับโลก',
    '<strong>เลือกเชียงใหม่ ถ้า</strong> ชอบบรรยากาศชิล อากาศเย็น คาเฟ่ ธรรมชาติ และค่าครองชีพถูก',
    '<strong>มาทั้งคู่ได้ง่าย</strong> บินต่อ ~1 ชม. 15 นาที หรือนั่งรถไฟตู้นอนกลางคืน',
  ], en:[
    '<strong>Pick Bangkok if</strong> you love a big city, shopping, nightlife and varied world-class food',
    '<strong>Pick Chiang Mai if</strong> you prefer a relaxed vibe, cooler air, cafés, nature and lower costs',
    '<strong>Do both easily</strong> — a ~1h 15m flight apart, or an overnight sleeper train',
  ] },
  faq:[
    { q:{th:'กรุงเทพหรือเชียงใหม่ดีกว่า?',en:'Bangkok or Chiang Mai — which is better?'},
      a:{th:'คนละสไตล์ กรุงเทพเป็นเมืองใหญ่ที่มีทุกอย่างและคึกคัก ส่วนเชียงใหม่ชิลกว่า อากาศเย็นกว่า และค่าครองชีพถูกกว่า ถ้ามาทริปแรกแนะนำไปทั้งคู่เพราะเดินทางต่อกันง่าย',
        en:'They are different. Bangkok is a big, buzzing city with everything; Chiang Mai is calmer, cooler and cheaper. For a first trip, doing both is recommended since they connect easily.'} },
    { q:{th:'ควรอยู่กรุงเทพหรือเชียงใหม่กี่วัน?',en:'How many days for Bangkok vs Chiang Mai?'},
      a:{th:'ทริปแรกหลายคนให้กรุงเทพ 3–4 วันสำหรับวัด ตลาด และช้อปปิ้ง และเชียงใหม่ 3–4 วันสำหรับวัด คาเฟ่ ธรรมชาติ และวันไปปายหรือเชียงราย ปรับตามความชอบได้',
        en:'On a first trip many give Bangkok 3–4 days for temples, markets and shopping, and Chiang Mai 3–4 days for temples, cafés, nature and a day to Pai or Chiang Rai — adjust to taste.'} },
    { q:{th:'เชียงใหม่ค่าครองชีพถูกกว่ากรุงเทพจริงไหม?',en:'Is Chiang Mai really cheaper than Bangkok?'},
      a:{th:'โดยรวมถูกกว่า ทั้งที่พัก อาหาร และค่าเดินทางในเมืองมักประหยัดกว่ากรุงเทพ จึงเป็นเมืองยอดนิยมของคนอยู่ยาวและดิจิทัลโนแมด',
        en:'Generally yes — accommodation, food and local transport are usually cheaper than Bangkok, which is why it is popular with long-stay travelers and digital nomads.'} },
  ] },
{ slug:'pattaya-vs-hua-hin', hero:'huahin',
  a:{slug:'pattaya',th:'พัทยา',en:'Pattaya'}, b:{slug:'huahin',th:'หัวหิน',en:'Hua Hin'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> ทั้งคู่เป็นเมืองทะเลใกล้กรุงเทพ (ขับรถ ~2 ชม.) เลือก <strong>พัทยา</strong> ถ้าอยากได้ไนต์ไลฟ์จัดเต็ม กิจกรรมเยอะ และเกาะล้านใกล้ ๆ เลือก <strong>หัวหิน</strong> ถ้าอยากได้เมืองทะเลที่เงียบและเป็นครอบครัวมากกว่า ตลาดน่าเดิน และรีสอร์ตชิล ๆ',
    en:'<strong>Short answer:</strong> Both are beach towns near Bangkok (~2h drive). Choose <strong>Pattaya</strong> for big nightlife, lots of activities and nearby Koh Larn island. Choose <strong>Hua Hin</strong> for a quieter, more family-oriented seaside town with nice markets and relaxed resorts.' },
  factors:[
    { f:{th:'บรรยากาศ',en:'Vibe'}, a:{th:'คึกคัก ไนต์ไลฟ์จัด',en:'Buzzing, big nightlife'}, b:{th:'เงียบ ครอบครัว',en:'Quiet, family'} },
    { f:{th:'หาด',en:'Beach'}, a:{th:'ในเมืองธรรมดา เกาะล้านสวยกว่า',en:'City beach so-so; Koh Larn nicer'}, b:{th:'หาดยาวสะอาดกว่า',en:'Longer, cleaner beach'} },
    { f:{th:'กิจกรรม',en:'Activities'}, a:{th:'เยอะมาก สวนสนุก โชว์',en:'Tons — parks, shows'}, b:{th:'ตลาด ไร่องุ่น สวนน้ำ',en:'Markets, vineyard, water parks'} },
    { f:{th:'ครอบครัว',en:'Families'}, a:{th:'ได้ (จอมเทียน)',en:'OK (Jomtien)'}, b:{th:'ดีมาก',en:'Very good'} },
    { f:{th:'จากกรุงเทพ',en:'From Bangkok'}, a:{th:'~2 ชม.',en:'~2h'}, b:{th:'~2.5–3 ชม.',en:'~2.5–3h'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ไนต์ไลฟ์ กิจกรรม',en:'Nightlife, activities'}, b:{th:'ครอบครัว พักผ่อน',en:'Families, relaxing'} },
  ],
  choose:{ th:[
    '<strong>เลือกพัทยา ถ้า</strong> อยากได้ไนต์ไลฟ์ กิจกรรมเยอะ และเที่ยวเกาะล้าน',
    '<strong>เลือกหัวหิน ถ้า</strong> อยากได้เมืองทะเลเงียบ ครอบครัว ตลาดน่าเดิน และรีสอร์ตชิล',
    '<strong>ทั้งคู่ใกล้กรุงเทพ</strong> ไปได้ทั้งเดย์ทริปและค้างคืน เหมาะหนีกรุงสุดสัปดาห์',
  ], en:[
    '<strong>Pick Pattaya if</strong> you want nightlife, lots of activities and a trip to Koh Larn',
    '<strong>Pick Hua Hin if</strong> you want a quiet, family seaside town with nice markets and relaxed resorts',
    '<strong>Both are close to Bangkok</strong> — good for a day trip or a weekend escape',
  ] },
  faq:[
    { q:{th:'พัทยาหรือหัวหินดีกว่า?',en:'Pattaya or Hua Hin — which is better?'},
      a:{th:'พัทยาคึกคักและไนต์ไลฟ์จัดกว่า มีกิจกรรมและโชว์เยอะ ส่วนหัวหินเงียบและเหมาะครอบครัวมากกว่า หาดสะอาดกว่าและมีตลาดน่าเดิน เลือกตามว่าชอบคึกคักหรือสงบ',
        en:'Pattaya is busier with bigger nightlife, activities and shows, while Hua Hin is quieter and more family-friendly with a cleaner beach and nice markets — pick by whether you want lively or calm.'} },
    { q:{th:'ที่ไหนเหมาะครอบครัวมากกว่า?',en:'Which is more family-friendly?'},
      a:{th:'หัวหินเหมาะครอบครัวมากกว่าโดยรวม เพราะเงียบ ปลอดภัย หาดยาวและมีสวนน้ำ ส่วนพัทยาถ้ามากับครอบครัวให้เลือกพักฝั่งจอมเทียนที่เงียบกว่าพัทยากลาง',
        en:'Hua Hin is generally more family-friendly — calm, safe, with a long beach and water parks. In Pattaya, families should stay on the quieter Jomtien side rather than Central.'} },
    { q:{th:'จากกรุงเทพไปที่ไหนใกล้กว่า?',en:'Which is closer to Bangkok?'},
      a:{th:'พัทยาใกล้กว่าเล็กน้อย ขับรถราว 2 ชั่วโมง ส่วนหัวหินราว 2.5–3 ชั่วโมง ทั้งคู่มีรถตู้และรถบัสตรงจากกรุงเทพ และมีบริการรับส่งจากสนามบินสุวรรณภูมิ',
        en:'Pattaya is slightly closer at about 2 hours; Hua Hin is around 2.5–3 hours. Both have direct minivans and buses from Bangkok, plus transfer services from Suvarnabhumi Airport.'} },
  ] },
{ slug:'krabi-vs-koh-samui', hero:'krabi',
  a:{slug:'krabi',th:'กระบี่',en:'Krabi'}, b:{slug:'samui',th:'เกาะสมุย',en:'Koh Samui'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>กระบี่</strong> (ฝั่งอันดามัน) ถ้าอยากได้หน้าผาหินปูน ทัวร์ 4 เกาะ-พีพี และฐานเที่ยวที่ต่อไปเกาะอื่นได้หลากหลาย เลือก <strong>เกาะสมุย</strong> (อ่าวไทย) ถ้าอยากได้บรรยากาศเกาะแท้ ๆ รีสอร์ตติดหาด และบินตรงลงเกาะได้เลย จุดต่างใหญ่คือฤดูฝนคนละช่วง',
    en:'<strong>Short answer:</strong> Choose <strong>Krabi</strong> (Andaman) for limestone cliffs, 4-Islands and Phi Phi tours, and a base with many onward island options. Choose <strong>Koh Samui</strong> (Gulf) for a true island feel, beachfront resorts and a direct flight onto the island. The big difference is that their rainy seasons fall at different times.' },
  factors:[
    { f:{th:'ประเภท',en:'Type'}, a:{th:'แผ่นดินใหญ่+เกาะรอบ',en:'Mainland + nearby islands'}, b:{th:'เกาะแท้',en:'A true island'} },
    { f:{th:'ทะเลฝั่ง',en:'Coast'}, a:{th:'อันดามัน',en:'Andaman'}, b:{th:'อ่าวไทย',en:'Gulf'} },
    { f:{th:'วิวเด่น',en:'Signature scenery'}, a:{th:'หน้าผาหินปูน ไร่เลย์',en:'Limestone cliffs, Railay'}, b:{th:'หาดมะพร้าว รีสอร์ต',en:'Palm beaches, resorts'} },
    { f:{th:'บินตรง',en:'Direct flights'}, a:{th:'มี (สนามบินกระบี่)',en:'Yes (Krabi Airport)'}, b:{th:'มี (แต่ตั๋วแพงกว่า)',en:'Yes (pricier fares)'} },
    { f:{th:'ฝนหนักช่วง',en:'Wettest months'}, a:{th:'พ.ค.–ต.ค.',en:'May–Oct'}, b:{th:'ต.ค.–ธ.ค.',en:'Oct–Dec'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ทัวร์เกาะ ปีนผา ธรรมชาติ',en:'Island tours, climbing, nature'}, b:{th:'รีสอร์ตติดหาด ชิล',en:'Beachfront resort chilling'} },
  ],
  choose:{ th:[
    '<strong>เลือกกระบี่ ถ้า</strong> ชอบหน้าผา ทัวร์เกาะหลากหลาย และอยากใช้เป็นฐานต่อไปเกาะอื่น',
    '<strong>เลือกเกาะสมุย ถ้า</strong> อยากได้เกาะแท้ ๆ รีสอร์ตติดหาด และต่อไปพะงัน-เต่าง่าย',
    '<strong>ดูฤดูฝน</strong> ช่วง พ.ค.–ต.ค. สมุยฝั่งอ่าวไทยมักอากาศดีกว่ากระบี่',
  ], en:[
    '<strong>Pick Krabi if</strong> you love cliffs, varied island tours and a base for hopping onward',
    '<strong>Pick Koh Samui if</strong> you want a true island, beachfront resorts and easy hops to Phangan/Tao',
    '<strong>Check the season</strong> — May–Oct, Gulf-side Samui often beats Krabi for weather',
  ] },
  faq:[
    { q:{th:'กระบี่หรือเกาะสมุยดีกว่า?',en:'Krabi or Koh Samui — which is better?'},
      a:{th:'กระบี่เด่นเรื่องหน้าผาหินปูนและทัวร์เกาะหลากหลาย เหมาะสายธรรมชาติและผจญภัย ส่วนสมุยเป็นเกาะแท้ ๆ ที่มีรีสอร์ตติดหาดและบรรยากาศชิล เหมาะคนอยากพักผ่อนบนเกาะจริงจัง',
        en:'Krabi stands out for limestone cliffs and varied island tours, great for nature and adventure, while Samui is a true island with beachfront resorts and a relaxed mood, ideal for a proper island getaway.'} },
    { q:{th:'มาช่วงไหนควรเลือกที่ไหน?',en:'Which to choose by season?'},
      a:{th:'สองที่อยู่คนละฝั่งทะเล กระบี่ (อันดามัน) ฝนชุกราว พ.ค.–ต.ค. ส่วนสมุย (อ่าวไทย) ฝนหนักปลายปี ถ้ามาหน้าฝนของฝั่งหนึ่ง เลือกอีกฝั่งจะได้อากาศดีกว่า',
        en:'They are on opposite coasts: Krabi (Andaman) is wettest around May–Oct, while Samui (Gulf) is wettest late in the year. If one is in its rainy season, choose the other for better weather.'} },
    { q:{th:'ไปทั้งกระบี่และสมุยในทริปเดียวคุ้มไหม?',en:'Is combining Krabi and Samui worth it?'},
      a:{th:'ทำได้แต่อยู่คนละฝั่งทะเล ต้องนั่งรถข้ามคาบสมุทรหรือบินต่อ เหมาะถ้ามีเวลาหลายวัน ถ้าเวลาน้อยเลือกอย่างใดอย่างหนึ่งให้เต็มที่จะคุ้มกว่า',
        en:'It is possible but they are on opposite coasts, needing a cross-peninsula drive or a connecting flight — worthwhile with several days. With limited time, focusing on one is better value.'} },
  ] },
{ slug:'phuket-vs-pattaya', hero:'phuket',
  a:{slug:'phuket',th:'ภูเก็ต',en:'Phuket'}, b:{slug:'pattaya',th:'พัทยา',en:'Pattaya'},
  quick:{ th:'<strong>คำตอบสั้น ๆ:</strong> เลือก <strong>ภูเก็ต</strong> ถ้าอยากได้หาดและทะเลที่สวยกว่า ทัวร์เกาะระดับโลกอย่างพีพี-สิมิลัน และที่พักหรูริมทะเล (ต้องบินลงใต้) เลือก <strong>พัทยา</strong> ถ้าอยากได้ที่เที่ยวทะเลใกล้กรุงเทพ (ขับรถ ~2 ชม.) ราคาประหยัดกว่า ไนต์ไลฟ์จัด และกิจกรรมเยอะ',
    en:'<strong>Short answer:</strong> Choose <strong>Phuket</strong> for better beaches and sea, world-class island tours like Phi Phi and Similan, and beachfront luxury (but you fly south). Choose <strong>Pattaya</strong> for a beach trip close to Bangkok (~2h drive), cheaper prices, big nightlife and lots of activities.' },
  factors:[
    { f:{th:'หาด/ทะเล',en:'Beaches/sea'}, a:{th:'สวยกว่ามาก',en:'Much nicer'}, b:{th:'ธรรมดา (เกาะล้านดีกว่า)',en:'So-so (Koh Larn better)'} },
    { f:{th:'ทัวร์เกาะ',en:'Island tours'}, a:{th:'พีพี สิมิลัน เจมส์บอนด์',en:'Phi Phi, Similan, James Bond'}, b:{th:'เกาะล้าน เกาะสีชัง',en:'Koh Larn, Koh Sichang'} },
    { f:{th:'จากกรุงเทพ',en:'From Bangkok'}, a:{th:'ต้องบิน ~1.5 ชม.',en:'Fly ~1.5h'}, b:{th:'ขับรถ ~2 ชม.',en:'Drive ~2h'} },
    { f:{th:'ราคา',en:'Prices'}, a:{th:'สูงกว่า',en:'Higher'}, b:{th:'ประหยัดกว่า',en:'Cheaper'} },
    { f:{th:'ไนต์ไลฟ์',en:'Nightlife'}, a:{th:'จัด (ป่าตอง)',en:'Big (Patong)'}, b:{th:'จัดมาก',en:'Very big'} },
    { f:{th:'เหมาะกับ',en:'Best for'}, a:{th:'ทะเลสวย ทัวร์เกาะ',en:'Nice sea, island tours'}, b:{th:'หนีกรุงไว ๆ ประหยัด',en:'Quick, cheap escape from BKK'} },
  ],
  choose:{ th:[
    '<strong>เลือกภูเก็ต ถ้า</strong> อยากได้ทะเลสวย ทัวร์เกาะระดับโลก และที่พักริมหาดหลากหลาย',
    '<strong>เลือกพัทยา ถ้า</strong> อยากเที่ยวทะเลใกล้กรุงเทพ ประหยัดกว่า ไนต์ไลฟ์จัด และกิจกรรมเยอะ',
    '<strong>ดูเวลาเดินทาง</strong> ภูเก็ตต้องบิน ส่วนพัทยาขับรถจากกรุงเทพได้ เหมาะทริปสั้น',
  ], en:[
    '<strong>Pick Phuket if</strong> you want nicer sea, world-class island tours and varied beachfront stays',
    '<strong>Pick Pattaya if</strong> you want a beach trip close to Bangkok, cheaper, with big nightlife and activities',
    '<strong>Mind the travel</strong> — Phuket needs a flight; Pattaya is a drive from Bangkok, great for short trips',
  ] },
  faq:[
    { q:{th:'ภูเก็ตหรือพัทยาดีกว่า?',en:'Phuket or Pattaya — which is better?'},
      a:{th:'ภูเก็ตทะเลสวยกว่ามากและมีทัวร์เกาะระดับโลก เหมาะคนอยากได้ทะเลจริงจัง ส่วนพัทยาใกล้กรุงเทพ ประหยัดกว่า และไนต์ไลฟ์จัด เหมาะทริปสั้นหรือหนีกรุงสุดสัปดาห์',
        en:'Phuket has far nicer sea and world-class island tours for a real beach holiday, while Pattaya is close to Bangkok, cheaper and big on nightlife — ideal for a short trip or weekend escape.'} },
    { q:{th:'อยากได้หาดสวยควรไปไหน?',en:'Where should I go for nice beaches?'},
      a:{th:'ภูเก็ตชนะเรื่องหาดและน้ำทะเล โดยเฉพาะหาดทางใต้-ตะวันตกและทัวร์เกาะพีพี-สิมิลัน ส่วนพัทยาหาดในเมืองธรรมดา ถ้าจะเล่นน้ำสวยต้องนั่งเรือไปเกาะล้าน',
        en:'Phuket wins on beaches and sea, especially the west/south coast and Phi Phi/Similan tours. Pattaya’s city beach is average — for nicer water you take a boat to Koh Larn.'} },
    { q:{th:'ทริปสั้นจากกรุงเทพควรไปไหน?',en:'For a short trip from Bangkok, which is better?'},
      a:{th:'พัทยาเหมาะกว่าสำหรับทริปสั้น เพราะขับรถจากกรุงเทพแค่ราว 2 ชั่วโมง ไม่ต้องบิน ส่วนภูเก็ตต้องบินลงใต้ จึงเหมาะทริปที่มีเวลาหลายวันมากกว่า',
        en:'Pattaya suits short trips better — just a ~2-hour drive from Bangkok with no flight needed — while Phuket requires flying south, so it is better when you have several days.'} },
  ] },
];

// ---------- builders ----------
const hasThai = (s) => /[ก-฾เ-๛]/.test(s);
function neighborhoodArticle(H, loc) {
  const cityName = loc === 'en' ? H.en : H.th;
  const slug = `where-to-stay-${H.city}`;
  const roundup = `top10-hotels-${H.city}.html`;
  const title = loc === 'en'
    ? `Where to Stay in ${H.en} 2026 — Best Areas & Neighborhoods by Travel Style | ThailandAddict`
    : `พักย่านไหนดีใน${H.th} 2026 — ย่านที่พักยอดนิยม เลือกตามสไตล์เที่ยว | ThailandAddict`;
  const blocks = [
    { kind: 'p', html: H.quick[loc] },
    { kind: 'h2', text: loc === 'en' ? `Top areas to stay in ${H.en}` : `ย่านพักยอดนิยมใน${H.th}`, id: 'areas' },
    { kind: 'table',
      caption: loc === 'en' ? `${H.en} neighborhoods compared` : `เทียบย่านที่พักใน${H.th}`,
      headers: loc === 'en' ? ['Area', 'Vibe', 'Good to know'] : ['ย่าน', 'สไตล์', 'น่ารู้'],
      rows: H.areas.map((x) => [x.a[loc], x.v[loc], x.n[loc]]) },
    { kind: 'h2', text: loc === 'en' ? 'Pick your area by travel style' : 'เลือกย่านตามสไตล์เที่ยว', id: 'style' },
    { kind: 'list', items: H.styles[loc] },
    { kind: 'staycta',
      title: loc === 'en' ? `Found your area? Compare ${H.en} hotels` : `รู้แล้วว่าจะพักย่านไหน? เทียบราคาโรงแรม${H.th}`,
      text: loc === 'en'
        ? `See our ranked ${H.en} hotels with prices compared across Agoda, Booking and Trip.com, then book the area that fits your style.`
        : `ดูรีวิวโรงแรม${H.th}จัดอันดับ เทียบราคา Agoda · Booking · Trip.com แล้วจองย่านที่ใช่กับสไตล์คุณ`,
      links: [
        { label: loc === 'en' ? `🏨 Top hotels in ${H.en}` : `🏨 Top โรงแรม${H.th}`, href: roundup, note: loc === 'en' ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา' },
        { label: loc === 'en' ? `🗺️ ${H.en} travel guide` : `🗺️ คู่มือเที่ยว${H.th}`, href: `city-${H.city}.html`, note: loc === 'en' ? 'Stays, food, things to do' : 'ที่พัก ที่กิน ที่เที่ยว' },
      ],
      ctaLabel: loc === 'en' ? 'Search hotels on Agoda' : 'ค้นหาโรงแรมบน Agoda', ctaHref: AGODA },
  ];
  const rel = loc === 'en'
    ? [{ href: `city-${H.city}.html`, title: `🗺️ Explore ${H.en}` }, { href: roundup, title: `🏨 Top hotels in ${H.en}` },
       { href: 'getting-around-thailand.html', title: '🚌 Getting around Thailand' }, { href: 'plan-your-trip.html', title: '🧭 Plan Your Trip hub' }]
    : [{ href: `city-${H.city}.html`, title: `🗺️ เที่ยว${H.th}` }, { href: roundup, title: `🏨 Top โรงแรม${H.th}` },
       { href: 'getting-around-thailand.html', title: '🚌 คู่มือการเดินทางทั่วไทย' }, { href: 'plan-your-trip.html', title: '🧭 ศูนย์รวมคู่มือเตรียมตัว' }];
  return {
    slug, type: 'prep', cluster: H.city,
    title, metaDesc: loc === 'en'
      ? `Where to stay in ${H.en}: the best areas and neighborhoods compared by travel style — first-timers, nightlife, families, quiet and budget — with the right hotels for each.`
      : `พักย่านไหนดีใน${H.th} รวมย่านที่พักยอดนิยมเทียบกันตามสไตล์ ทั้งมาครั้งแรก ไนต์ไลฟ์ ครอบครัว เงียบสงบ และประหยัด พร้อมโรงแรมที่เหมาะกับแต่ละย่าน`,
    ogTitle: title.split(' | ')[0], ogDesc: loc === 'en' ? `The best areas to stay in ${H.en}, by travel style.` : `ย่านที่พักที่ใช่ใน${H.th} เลือกตามสไตล์เที่ยว`,
    image: `/images/heroes/${H.hero}.jpg`,
    crumbCity: cityName, crumbCityHref: `city-${H.city}.html`,
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: loc === 'en' ? `Where to stay · ${H.en}` : `พักย่านไหน · ${H.th}`,
    h1: loc === 'en' ? `Where to stay in<br>${H.en}` : `พักย่านไหนดี<br>ใน${H.th}`,
    heroEmoji: '🏨', heroImg: `/images/heroes/${H.hero}.jpg`,
    intro: loc === 'en'
      ? `Choosing the right area matters more than the hotel itself in ${H.en}. Here are the main neighborhoods, who each suits, and where to book for your travel style.`
      : `ใน${H.th} การเลือก "ย่าน" ที่พักสำคัญกว่าตัวโรงแรมเสียอีก บทความนี้สรุปย่านหลัก ๆ ว่าเหมาะกับใคร และควรจองที่ไหนตามสไตล์การเที่ยวของคุณ`,
    chips: loc === 'en' ? ['First-timers', 'Nightlife', 'Family & quiet'] : ['มาครั้งแรก', 'ไนต์ไลฟ์', 'ครอบครัว & เงียบ'],
    readTime: loc === 'en' ? '6 min read' : '6 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: H.faq.map((f) => ({ q: f.q[loc], a: f.a[loc] })), related: rel,
  };
}

function comparisonArticle(C, loc) {
  const A = loc === 'en' ? C.a.en : C.a.th, B = loc === 'en' ? C.b.en : C.b.th;
  const title = loc === 'en'
    ? `${C.a.en} vs ${C.b.en} 2026 — Which to Choose? Honest Comparison | ThailandAddict`
    : `${C.a.th} vs ${C.b.th} 2026 — เลือกที่ไหนดี? เทียบให้ตรง ๆ | ThailandAddict`;
  const wtsA = NB.has(C.a.slug) ? `where-to-stay-${C.a.slug}.html` : `city-${C.a.slug}.html`;
  const wtsB = NB.has(C.b.slug) ? `where-to-stay-${C.b.slug}.html` : `city-${C.b.slug}.html`;
  const blocks = [
    { kind: 'p', html: C.quick[loc] },
    { kind: 'h2', text: loc === 'en' ? `${C.a.en} vs ${C.b.en} at a glance` : `เทียบเร็ว ${C.a.th} vs ${C.b.th}`, id: 'compare' },
    { kind: 'table',
      caption: loc === 'en' ? `${C.a.en} vs ${C.b.en}` : `${C.a.th} vs ${C.b.th}`,
      headers: loc === 'en' ? ['Factor', C.a.en, C.b.en] : ['หัวข้อ', C.a.th, C.b.th],
      rows: C.factors.map((x) => [x.f[loc], x.a[loc], x.b[loc]]) },
    { kind: 'h2', text: loc === 'en' ? 'Which should you choose?' : 'เลือกแบบไหนดี', id: 'choose' },
    { kind: 'list', items: C.choose[loc] },
    { kind: 'cards', items: [
      { name: loc === 'en' ? `🗺️ Explore ${C.a.en}` : `🗺️ เที่ยว${C.a.th}`, blurb: loc === 'en' ? 'Full travel guide' : 'คู่มือเที่ยวฉบับเต็ม', href: `city-${C.a.slug}.html` },
      { name: loc === 'en' ? `🗺️ Explore ${C.b.en}` : `🗺️ เที่ยว${C.b.th}`, blurb: loc === 'en' ? 'Full travel guide' : 'คู่มือเที่ยวฉบับเต็ม', href: `city-${C.b.slug}.html` },
      { name: loc === 'en' ? `🏨 ${C.a.en} hotels` : `🏨 โรงแรม${C.a.th}`, blurb: loc === 'en' ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา', href: `top10-hotels-${C.a.slug}.html` },
      { name: loc === 'en' ? `🏨 ${C.b.en} hotels` : `🏨 โรงแรม${C.b.th}`, blurb: loc === 'en' ? 'Ranked + price compare' : 'จัดอันดับ + เทียบราคา', href: `top10-hotels-${C.b.slug}.html` },
    ] },
  ];
  const sib = COMPARE[(COMPARE.indexOf(C) + 1) % COMPARE.length];
  const rel = loc === 'en'
    ? [{ href: wtsA, title: `🏨 Where to stay in ${C.a.en}` }, { href: wtsB, title: `🏨 Where to stay in ${C.b.en}` },
       { href: 'getting-around-thailand.html', title: '🚌 Getting around Thailand' }, { href: `${sib.slug}.html`, title: `⚖️ ${sib.a.en} vs ${sib.b.en}` }]
    : [{ href: wtsA, title: `🏨 พักย่านไหนใน${C.a.th}` }, { href: wtsB, title: `🏨 พักย่านไหนใน${C.b.th}` },
       { href: 'getting-around-thailand.html', title: '🚌 คู่มือการเดินทางทั่วไทย' }, { href: `${sib.slug}.html`, title: `⚖️ ${sib.a.th} vs ${sib.b.th}` }];
  return {
    slug: C.slug, type: 'prep', cluster: 'thailand',
    title, metaDesc: loc === 'en'
      ? `${C.a.en} vs ${C.b.en}: an honest comparison of vibe, beaches, nightlife, families, cost and getting there — plus which to choose and whether to do both.`
      : `${C.a.th} vs ${C.b.th} เทียบตรง ๆ ทั้งบรรยากาศ หาด ไนต์ไลฟ์ ครอบครัว ราคา และการเดินทาง พร้อมสรุปว่าควรเลือกที่ไหน และไปทั้งคู่ได้ไหม`,
    ogTitle: title.split(' | ')[0], ogDesc: loc === 'en' ? `${C.a.en} vs ${C.b.en} — which is right for your trip?` : `${C.a.th} vs ${C.b.th} — ที่ไหนเหมาะกับทริปคุณ?`,
    image: `/images/heroes/${C.hero}.jpg`,
    crumbCity: loc === 'en' ? 'Compare destinations' : 'เทียบจุดหมาย', crumbCityHref: 'destinations.html',
    regionLabel: '🇹🇭 Thailand', regionHref: 'country-thailand.html',
    eyebrow: loc === 'en' ? 'Compare destinations' : 'เทียบจุดหมาย',
    h1: loc === 'en' ? `${C.a.en} vs ${C.b.en}<br>which to choose?` : `${C.a.th} vs ${C.b.th}<br>เลือกที่ไหนดี?`,
    heroEmoji: '⚖️', heroImg: `/images/heroes/${C.hero}.jpg`,
    intro: loc === 'en'
      ? `Torn between ${C.a.en} and ${C.b.en}? Here is an honest, side-by-side comparison so you can pick the one that fits your trip — or fit both in.`
      : `เลือกไม่ถูกระหว่าง${C.a.th}กับ${C.b.th}? บทความนี้เทียบให้ตรง ๆ แบบเคียงข้างกัน เพื่อช่วยให้เลือกที่ที่ใช่กับทริปคุณ หรือจัดให้ครบทั้งคู่`,
    chips: loc === 'en' ? ['Honest comparison', 'Pick by style', 'Or do both'] : ['เทียบตรง ๆ', 'เลือกตามสไตล์', 'หรือไปทั้งคู่'],
    readTime: loc === 'en' ? '6 min read' : '6 นาที',
    publishedDate: DATE, modifiedDate: DATE, blocks,
    faq: C.faq.map((f) => ({ q: f.q[loc], a: f.a[loc] })), related: rel,
  };
}

// ---------- write ----------
let nN = 0, nC = 0; const leaks = [], misaligned = [];
function emit(th, en, kind) {
  if (th.blocks.map((b) => b.kind).join() !== en.blocks.map((b) => b.kind).join()) misaligned.push(th.slug);
  if (Object.keys(th).sort().join() !== Object.keys(en).sort().join()) misaligned.push(th.slug + ':keys');
  if (hasThai(JSON.stringify(en))) leaks.push(th.slug);
  fs.writeFileSync(path.join(A_TH, th.slug + '.json'), JSON.stringify(th, null, 2) + '\n');
  fs.writeFileSync(path.join(A_EN, en.slug + '.json'), JSON.stringify(en, null, 2) + '\n');
}
for (const H of HOODS) { emit(neighborhoodArticle(H, 'th'), neighborhoodArticle(H, 'en'), 'nb'); nN++; }
for (const C of COMPARE) { emit(comparisonArticle(C, 'th'), comparisonArticle(C, 'en'), 'cmp'); nC++; }
console.log(JSON.stringify({ neighborhoods: nN, comparisons: nC,
  nbSlugs: HOODS.map((h) => `where-to-stay-${h.city}`), cmpSlugs: COMPARE.map((c) => c.slug),
  enThaiLeaks: leaks, misaligned }, null, 2));

#!/usr/bin/env node
// Upgrade Klook search links → deep activity links in attraction pages (experiences block).
// Usage: node _internal/upgrade-klook-deeplinks.mjs <batch> [--apply]
//   dry-run by default: prints per-item before/after, writes nothing.
// Rules (LOCKED per session 2026-07-05):
//   - only replace Klook items whose href is a /search/ link AND we have a real matching product
//   - never touch GetYourGuide items or ctaHref (the "see all" search CTA stays)
//   - deep link = https://www.klook.com/en-US/activity/<slug>/?aid=121442
//   - TH + EN twin edited together, same item indexes (structure parity)
//   - slugs must be verified real (live on our activity guides, or web-verified on klook.com)
import fs from 'node:fs';
import path from 'node:path';

const AID = 'aid=121442';
const deep = (slug) => `https://www.klook.com/en-US/activity/${slug}/?${AID}`;

// ---- verified activity catalog (slug → true source) ----
// in-repo = already live on our 17 activity guides; websearch = verified via klook.com search 2026-07-05
const CATALOG = {
  'temple-trio':      '115263-bangkok-iconic-temple-tour-wat-arun-wat-pho-wat-traimit',
  'walking-palace':   '154921-bangkok-highlight-grand-palace-wat-pho-wat-arun-walking-tour',
  'white-orchid':     '10538-chao-phraya-white-orchid-river-cruise-bangkok',
  'palace-ticket':    '129462-skip-the-line-grand-palace-and-emerald-buddha-ticket-in-bangkok',
  'night-tuktuk':     '146197-bangkok-night-tour-temples-markets-local-food-by-tuk-tuk',
  'floating-day':     '3020-floating-markets-day-tour-bangkok',
  'damnoen-maeklong': '127327-damnoen-saduak-floating-market-maeklong-railway-market',
  'amphawa-firefly':  '6960-maeklong-train-market-and-amphawa-floating-night-market-with-firefly-viewing-Bangkok',
  'dinner-cruise':    '151208-bangkok-chao-phraya-dinner-cruise',
  'princess-cruise':  '375-chao-phraya-princess-cruise-bangkok',
  'michelin-tuktuk':  '145210-bangkok-michelin-street-food-tuk-tuk-night-tour',
  'midnight-food':    '9647-best-eats-midnight-food-tour-tuk-tuk-bangkok',
  'chatuchak-tour':   '36237-chatuchak-weekend-market-half-day-tour-bangkok', // websearch-verified
  'sea-life':         '357-sea-life-bangkok-ocean-world-bangkok',
  'mahanakhon':       '16870-king-power-mahanakhon-skywalk-ticket-bangkok',
  'landmarks-day':    '3021-bangkok-must-visit-landmarks-day-tour',
  // phuket
  'bigbuddha-chalong': '99149-phuket-thailand-big-buddha-wat-chalong-town-guided-tour',
  'jamesbond-longtail':'3435-james-bond-island-phang-nga-bay-long-tail-boat-tour-phuket',
  'jamesbond-bigboat': '3227-james-bond-day-tour-big-boat-longtail-speedboat',
  'khai-phiphi-bond':  '3250-khai-islands-phi-phi-james-bond-phuket-speedboat',
  'phiphi-snorkel':    '6556-phi-phi-island-snorkeling-day-trip-phuket',
  'similan-snorkel':   '14828-similan-islands-snorkeling-tour-phuket',
  'similan-khaolak':   '78693-similan-island-day-trip-phuket-khaolak-round-transfer',
  'phuket-elephant':   '28486-phuket-elephant-sanctuary-experience',
  'simon-cabaret':     '292-simon-cabaret-show-phuket',
  'fantasea':          '294-phuket-fantasea-phuket',
  // chiang-mai
  'doisuthep-tour':    '2272-doi-suthep-chiang-mai-temples-private-tour',
  'doiinthanon-tour':  '17443-doi-inthanon-park-tour-chiang-mai',
  'elephant-jungle':   '3631-elephant-jungle-sanctuary-chiang-mai',
  'kanta-elephant':    '78900-half-day-kanta-elephant-sanctuary-mae-taeng-chiang-mai-join-tour',
  'kerchor-elephant':  '15060-chiang-mai-kerchor-elephant-eco-park-tour-chiang-mai',
  'gibbon-zipline':    '580-flight-of-the-gibbon-chiang-mai',
  // krabi
  '4islands-day':      '1433-4-islands-day-tour-krabi',
  '4islands-longtail': '77380-join-4-islands-snorkeling-tour-longtail-boat-krabi',
  'phiphi-4islands':   '27749-phi-phi-4-islands-tour-krabi',
  'emerald-tigercave': '129794-krabi-emerald-pool-hot-waterfall-tiger-cave-temple',
  'railay-climbing':   '91658-1-day-join-rock-climbing-courses-railay-krabi', // websearch-verified
  // samui
  'angthong-319':      '319-angthong-national-park-koh-samui',
  'angthong-4614':     '4614-ang-thong-national-marine-park-samui-island-tour-koh-samui',
  'kohtao-nangyuan':   '321-koh-tao-koh-nangyuan-by-speed-boat-koh-samui',
  'kohtao-phangan':    '73970-koh-tao-koh-nangyuan-koh-pha-ngan-from-samui',
  // pattaya
  'sanctuary-truth':   '1109-the-sanctuary-of-truth-pattaya',
  'nong-nooch':        '335-nong-nooch-tropical-garden-pattaya',
  'kohlarn-combo':     '46233-koh-larn-sanctuary-truth-pattaya-viewpoint-day-tour',
  'tiffany-show':      '336-tiffanys-show-pattaya',              // websearch-verified
  'ramayana-park':     '2322-ramayana-water-park-pattaya',       // websearch-verified
  'art-in-paradise':   '337-art-in-paradise-pattaya',            // websearch-verified
  // wave 2 (2026-07-06): chiang-rai / surat-thani / kanchanaburi / ayutthaya / khao-yai / hua-hin
  'cr-3temples':       '73501-chiangrai-white-blue-black-temple-series-fullday-tour-from-chiangmai',
  'cheowlan-day':      '82133-join-day-tour-longtail-boat-on-cheow-lan-khao-sok-suratthani', // websearch-verified
  'padi-open-water':   '95113-padi-open-water-diver-koh-tao-padi-5-star-idc-resort',
  'padi-discover':     '95146-padi-discover-scuba-diving-koh-tao-padi-5-star-cdc',
  'erawan-kwai':       '66922-erawan-waterfall-riverkwai-bridge-fullday',                    // websearch-verified
  'death-railway':     '13209-kanchanaburi-full-day-tour-by-ak-travel-kanchanaburi',         // websearch-verified
  'ayutthaya-fullday': '66903-ayutthaya-historical-park-fullday-tour',                       // websearch-verified
  'ayutthaya-temples': '33742-ayuthaya-must-visit-temples-tour-bangkok',                     // websearch-verified
  'khaoyai-fullday':   '78546-khao-yai-national-park-tour-from-bangkok-full-day-tour',       // websearch-verified
  'vana-nava':         '3871-vana-nava-waterpark-hua-hin',                                   // websearch-verified
  'santorini-water':   '4209-santorini-park-waterventures-day-pass-hua-hin',                 // websearch-verified
  'huahin-zipline':    '44174-zipline-experience-hua-hin',
  // wave 3 (2026-07-06): sukhothai (rest reuse existing keys)
  'sukhothai-cycling': '42956-cycling-sukhothai-historical-park-half-day-tour',              // websearch-verified
  'sukhothai-sunset':  '44549-sunset-cycling-tour-sukhothai',                                // websearch-verified
  // wave 4 (2026-07-06): pai + koh chang
  'pai-day-join':      '178066-pai-one-day-tour',                                            // websearch-verified
  'pai-day-private':   '73843-pai-highlights-private-day-tour-from-chiang-mai',              // websearch-verified
  'kohchang-speed':    '5920-speedboat-snorkeling-tour-koh-chang',                           // websearch-verified
  'kohchang-kontiki':  '5958-kon-tiki-snorkeling-cruise-koh-chang',                          // websearch-verified
  // wave 5 (2026-07-06): eat-ranking foodexp blocks
  'arun-cooking':      '117838-arun-thai-cooking-class-with-market-tour-tuk-tuk',
  'cm-streetfood':     '93022-chiang-mai-evening-street-food-walking-private-tour',          // websearch-verified
  'akha-cooking':      '10239-thai-akha-kitchen-cooking-class-local-market-tour-chiang-mai',
  'phuket-streetfood': '80104-join-phuket-old-town-street-food-walking-tour-phuket',         // websearch-verified
  'phuket-michelin':   '31293-phuket-michelin-guide-food-tour-old-town',                     // websearch-verified
  // wave 10 (2026-07-06): rayong (koh samet) + ratchaburi (damnoen)
  'kohsamet-day':      '150194-koh-samet-island-day-tour-from-bangkok-pattaya',              // websearch-verified
  'kohsamet-9island':  '138440-koh-samet-exclusive-9-island-snorkeling-trip',               // websearch-verified
  'damnoen-ratchaburi':'98608-floating-market-ratchaburi-landmark-private-one-day-tour-bangkok', // websearch-verified
  // wave 11 (2026-07-06): satun / udon-thani / nong-khai / loei / trang
  'lipe-catamaran':    '70212-koh-lipe-join-day-boat-tour-sailing-catamaran-satun',         // websearch-verified
  'lipe-islandhop':    '57734-koh-lipe-join-island-hopping-tour-longtail-boat',             // websearch-verified
  'udon-classic':      '123869-udon-thani-nong-khai-classic-tour-temple-in-heaven-shuttle', // websearch-verified
  'udon-temples':      '44636-private-day-tour-temples-udon-thani',                         // websearch-verified
  'loei-chiangkhan':   '130662-loei-private-tour-chiang-khan-walking-street-more-by-ckrm-travel', // websearch-verified
  'loei-phukradueng':  '44997-3D2N-Phu-Kradung-Tour',                                       // websearch-verified
  'trang-emerald':     '82446-join-snorkel-tour-4-islands-emerald-cave-lanta-krabi',        // websearch-verified (departs Koh Lanta)
  // wave 12 (2026-07-06): buriram
  'buriram-khmer':     '61985-buriram-ban-khok-mueang-community-tracing-khmer-civilization-tour', // websearch-verified
};

// ---- per-file mapping: item index → replacement ----
// item = { i, key(catalog), emoji, th:[label,note], en:[label,note] }
const BATCHES = {
  bangkok: {
    'wat-arun-guide': [
      { i: 0, key: 'temple-trio', emoji: '🛕', th: ['ทัวร์ 3 วัดดัง: วัดอรุณ วัดโพธิ์ วัดไตรมิตร', 'ไกด์พาชม จบในครึ่งวัน'], en: ['Iconic temple tour: Wat Arun, Wat Pho & Wat Traimit', 'Guided, done in half a day'] },
      { i: 1, key: 'walking-palace', emoji: '🚶', th: ['วอล์กกิงทัวร์วัง-วัดโพธิ์-วัดอรุณ', 'เดินเก็บไฮไลต์เกาะรัตนโกสินทร์กับไกด์'], en: ['Grand Palace, Wat Pho & Wat Arun walking tour', 'Rattanakosin highlights on foot with a guide'] },
      { i: 2, key: 'white-orchid', emoji: '🚢', th: ['ล่องเรือเจ้าพระยา White Orchid', 'ผ่านวัดอรุณยามค่ำ เห็นพระปรางค์เปิดไฟ'], en: ['White Orchid Chao Phraya cruise', 'Glides past Wat Arun lit up at night'] },
    ],
    'wat-pho-guide': [
      { i: 0, key: 'temple-trio', emoji: '🛕', th: ['ทัวร์ 3 วัดดัง: วัดอรุณ วัดโพธิ์ วัดไตรมิตร', 'ไกด์พาชม จบในครึ่งวัน'], en: ['Iconic temple tour: Wat Arun, Wat Pho & Wat Traimit', 'Guided, done in half a day'] },
      { i: 1, key: 'walking-palace', emoji: '🚶', th: ['วอล์กกิงทัวร์วัง-วัดโพธิ์-วัดอรุณ', 'เดินเก็บไฮไลต์เกาะรัตนโกสินทร์กับไกด์'], en: ['Grand Palace, Wat Pho & Wat Arun walking tour', 'Rattanakosin highlights on foot with a guide'] },
      { i: 2, key: 'palace-ticket', emoji: '🎟️', th: ['ตั๋วพระบรมมหาราชวัง + วัดพระแก้ว (ไม่ต้องต่อคิว)', 'อยู่ข้างวัดโพธิ์ เดินถึงกัน'], en: ['Grand Palace & Emerald Buddha skip-the-line ticket', 'Right next door to Wat Pho'] },
    ],
    'grand-palace-wat-phra-kaew-guide': [
      { i: 0, key: 'palace-ticket', emoji: '🎟️', th: ['ตั๋วพระบรมมหาราชวัง + วัดพระแก้ว (ไม่ต้องต่อคิว)', 'จองล่วงหน้า เข้าประตูได้เลย'], en: ['Grand Palace & Emerald Buddha skip-the-line ticket', 'Book ahead, walk straight in'] },
      { i: 1, key: 'walking-palace', emoji: '🚶', th: ['วอล์กกิงทัวร์วัง-วัดโพธิ์-วัดอรุณ', 'เดินเก็บไฮไลต์เกาะรัตนโกสินทร์กับไกด์'], en: ['Grand Palace, Wat Pho & Wat Arun walking tour', 'Rattanakosin highlights on foot with a guide'] },
      { i: 2, key: 'temple-trio', emoji: '🛕', th: ['ทัวร์ 3 วัดดัง: วัดอรุณ วัดโพธิ์ วัดไตรมิตร', 'ต่อจากวังได้ในทริปเดียว'], en: ['Iconic temple tour: Wat Arun, Wat Pho & Wat Traimit', 'Pairs well with the palace in one trip'] },
    ],
    'rattanakosin-old-town': [
      { i: 0, key: 'walking-palace', emoji: '🚶', th: ['วอล์กกิงทัวร์วัง-วัดโพธิ์-วัดอรุณ', 'เดินเก็บไฮไลต์เกาะรัตนโกสินทร์กับไกด์'], en: ['Grand Palace, Wat Pho & Wat Arun walking tour', 'Rattanakosin highlights on foot with a guide'] },
      { i: 1, key: 'temple-trio', emoji: '🛕', th: ['ทัวร์ 3 วัดดัง: วัดอรุณ วัดโพธิ์ วัดไตรมิตร', 'ไกด์พาชม จบในครึ่งวัน'], en: ['Iconic temple tour: Wat Arun, Wat Pho & Wat Traimit', 'Guided, done in half a day'] },
      { i: 2, key: 'night-tuktuk', emoji: '🛺', th: ['ทัวร์ตุ๊กตุ๊กยามค่ำ วัด-ตลาด-ของกิน', 'เที่ยวเมืองเก่าตอนกลางคืน'], en: ['Night tuk-tuk tour: temples, markets & food', 'The old town after dark'] },
    ],
    'bangkok-floating-markets': [
      { i: 0, key: 'floating-day', emoji: '🛶', th: ['เดย์ทัวร์ตลาดน้ำจากกรุงเทพ', 'มีรถรับส่ง ไปเช้ากลับบ่าย'], en: ['Floating markets day tour from Bangkok', 'Hotel pickup, back by afternoon'] },
      { i: 1, key: 'damnoen-maeklong', emoji: '🚂', th: ['ดำเนินสะดวก + ตลาดร่มหุบแม่กลอง', 'สองตลาดดังจบในทริปเดียว'], en: ['Damnoen Saduak + Maeklong Railway Market', 'Two famous markets in one trip'] },
      { i: 2, key: 'amphawa-firefly', emoji: '✨', th: ['แม่กลอง + อัมพวา ล่องเรือดูหิ่งห้อย', 'ตลาดน้ำยามเย็น ปิดท้ายด้วยหิ่งห้อย'], en: ['Maeklong + Amphawa with firefly cruise', 'Evening floating market, firefly boat to finish'] },
    ],
    'chao-phraya-river-guide': [
      { i: 0, key: 'dinner-cruise', emoji: '🚢', th: ['ดินเนอร์ครูซแม่น้ำเจ้าพระยา', 'กินข้าวบนเรือ ชมวัดอรุณยามค่ำ'], en: ['Chao Phraya dinner cruise', 'Dinner on deck, Wat Arun views at night'] },
      { i: 1, key: 'white-orchid', emoji: '🌸', th: ['เรือ White Orchid River Cruise', 'ครูซรอบค่ำเจ้าประจำของแม่น้ำ'], en: ['White Orchid River Cruise', 'A long-running evening cruise'] },
      { i: 2, key: 'princess-cruise', emoji: '🛳️', th: ['เรือ Chao Phraya Princess', 'อีกหนึ่งเรือดินเนอร์ที่คนจองเยอะ'], en: ['Chao Phraya Princess dinner boat', 'Another crowd favourite dinner boat'] },
    ],
    'charoenkrung-talat-noi': [
      { i: 0, key: 'michelin-tuktuk', emoji: '🛺', th: ['ทัวร์ตุ๊กตุ๊กชิมร้านมิชลินยามค่ำ', 'วนย่านเมืองเก่า-เจริญกรุง'], en: ['Michelin street-food tuk-tuk night tour', 'Loops the old town & Charoenkrung'] },
      { i: 1, key: 'midnight-food', emoji: '🍜', th: ['ฟู้ดทัวร์รอบดึกด้วยตุ๊กตุ๊ก', 'ชิมของกินเด็ดหลังพระอาทิตย์ตก'], en: ['Midnight food tour by tuk-tuk', 'Late-night eats after sundown'] },
    ],
    'chatuchak-market-guide': [
      { i: 0, key: 'chatuchak-tour', emoji: '🛍️', th: ['ทัวร์ตลาดนัดจตุจักรครึ่งวัน', 'ไกด์พาเดินโซนเด็ด ไม่หลงใน 15,000 ร้าน'], en: ['Chatuchak weekend market half-day tour', 'A guide steers you through 15,000 stalls'] },
    ],
    'siam-ratchaprasong-shopping': [
      { i: 0, key: 'sea-life', emoji: '🐠', th: ['SEA LIFE Bangkok Ocean World', 'อควาเรียมชั้นใต้ดินสยามพารากอน'], en: ['SEA LIFE Bangkok Ocean World', 'The aquarium under Siam Paragon'] },
    ],
    'bangkok-attractions': [
      { i: 0, key: 'palace-ticket', emoji: '🎟️', th: ['ตั๋วพระบรมมหาราชวัง + วัดพระแก้ว (ไม่ต้องต่อคิว)', 'จุดที่คนไปเยอะที่สุด จองก่อนไม่เสียเวลา'], en: ['Grand Palace & Emerald Buddha skip-the-line ticket', 'The busiest sight — book ahead'] },
      { i: 1, key: 'mahanakhon', emoji: '🌆', th: ['Mahanakhon SkyWalk', 'จุดชมวิวสูงสุดของไทย ชั้น 74 + พื้นกระจกชั้น 78'], en: ['Mahanakhon SkyWalk', "Thailand's highest deck, glass floor on 78"] },
      { i: 2, key: 'sea-life', emoji: '🐠', th: ['SEA LIFE Bangkok Ocean World', 'อควาเรียมกลางเมือง เหมาะวันฝนตก'], en: ['SEA LIFE Bangkok Ocean World', 'City-centre aquarium, great on rainy days'] },
    ],
    'tours-activities-bangkok': [
      { i: 0, key: 'landmarks-day', emoji: '🏛️', th: ['เดย์ทัวร์แลนด์มาร์กกรุงเทพ', 'เก็บจุดหลักครบในวันเดียว'], en: ['Bangkok must-visit landmarks day tour', 'The big sights in one day'] },
      { i: 1, key: 'palace-ticket', emoji: '🎟️', th: ['ตั๋วพระบรมมหาราชวัง + วัดพระแก้ว (ไม่ต้องต่อคิว)', 'จองล่วงหน้า เข้าประตูได้เลย'], en: ['Grand Palace & Emerald Buddha skip-the-line ticket', 'Book ahead, walk straight in'] },
      { i: 2, key: 'floating-day', emoji: '🛶', th: ['เดย์ทัวร์ตลาดน้ำจากกรุงเทพ', 'มีรถรับส่ง ไปเช้ากลับบ่าย'], en: ['Floating markets day tour from Bangkok', 'Hotel pickup, back by afternoon'] },
    ],
    // lumpini-park-guide: no matching Klook product — keep search links (intentionally absent)
  },
  phuket: {
    'big-buddha-phuket-guide': [
      { i: 0, key: 'bigbuddha-chalong', emoji: '🙏', th: ['ทัวร์พระใหญ่ + วัดฉลอง + เมืองเก่า', 'ไกด์พาชม 3 จุดหลักในครึ่งวัน'], en: ['Big Buddha, Wat Chalong & town guided tour', 'Three main sights in half a day'] },
    ],
    'wat-chalong-guide': [
      { i: 0, key: 'bigbuddha-chalong', emoji: '🙏', th: ['ทัวร์วัดฉลอง + พระใหญ่ + เมืองเก่า', 'ไกด์พาชม 3 จุดหลักในครึ่งวัน'], en: ['Wat Chalong, Big Buddha & town guided tour', 'Three main sights in half a day'] },
    ],
    'phang-nga-bay-tour': [
      { i: 0, key: 'jamesbond-longtail', emoji: '🛶', th: ['เกาะเจมส์บอนด์ด้วยเรือหางยาว', 'ล่องอ่าวพังงาแบบดั้งเดิม พายแคนูถ้ำลอด'], en: ['James Bond Island by longtail boat', 'Classic Phang Nga Bay route with canoeing'] },
      { i: 1, key: 'jamesbond-bigboat', emoji: '🚤', th: ['เดย์ทัวร์เจมส์บอนด์ เรือใหญ่ + สปีดโบ๊ต', 'ทางเลือกนั่งสบาย คลื่นน้อย'], en: ['James Bond day tour: big boat + speedboat', 'The comfier, calmer ride'] },
      { i: 2, key: 'khai-phiphi-bond', emoji: '🏝️', th: ['เกาะไข่ + พีพี + เจมส์บอนด์ (สปีดโบ๊ต)', 'เก็บหลายเกาะในวันเดียว'], en: ['Khai Islands + Phi Phi + James Bond speedboat', 'Several islands in one day'] },
    ],
    'phi-phi-island-tour': [
      { i: 0, key: 'phiphi-snorkel', emoji: '🤿', th: ['เดย์ทริปดำน้ำตื้นเกาะพีพี', 'ออกจากภูเก็ต รวมอ่าวมาหยา-เกาะไม้ไผ่'], en: ['Phi Phi snorkeling day trip', 'From Phuket, covers Maya Bay & Bamboo Island'] },
      { i: 1, key: 'khai-phiphi-bond', emoji: '🏝️', th: ['เกาะไข่ + พีพี + เจมส์บอนด์ (สปีดโบ๊ต)', 'เก็บหลายเกาะในวันเดียว'], en: ['Khai Islands + Phi Phi + James Bond speedboat', 'Several islands in one day'] },
    ],
    'phuket-island-hopping-guide': [
      { i: 0, key: 'khai-phiphi-bond', emoji: '🏝️', th: ['เกาะไข่ + พีพี + เจมส์บอนด์ (สปีดโบ๊ต)', 'ฮอปปิ้งหลายเกาะในวันเดียว'], en: ['Khai Islands + Phi Phi + James Bond speedboat', 'Multi-island hop in one day'] },
      { i: 1, key: 'phiphi-snorkel', emoji: '🤿', th: ['เดย์ทริปดำน้ำตื้นเกาะพีพี', 'รวมอ่าวมาหยา-เกาะไม้ไผ่'], en: ['Phi Phi snorkeling day trip', 'Covers Maya Bay & Bamboo Island'] },
      { i: 2, key: 'similan-snorkel', emoji: '🐠', th: ['ทัวร์ดำน้ำตื้นหมู่เกาะสิมิลัน', 'น้ำใสอันดับต้นของไทย (เปิดตามฤดูกาล)'], en: ['Similan Islands snorkeling tour', 'Some of the clearest water in Thailand (seasonal)'] },
    ],
    'phuket-old-town-guide': [
      { i: 0, key: 'bigbuddha-chalong', emoji: '🏛️', th: ['ทัวร์เมืองเก่า + พระใหญ่ + วัดฉลอง', 'ไกด์พาเดินย่านชิโนโปรตุกีสด้วย'], en: ['Old town, Big Buddha & Wat Chalong tour', 'Includes the Sino-Portuguese quarter'] },
    ],
    'patong-beach-guide': [
      { i: 0, key: 'simon-cabaret', emoji: '🎭', th: ['โชว์ Simon Cabaret ป่าตอง', 'คาบาเรต์เจ้าดังใกล้หาดป่าตอง'], en: ['Simon Cabaret show, Patong', 'The famous cabaret near Patong beach'] },
    ],
    'phuket-attractions': [
      { i: 0, key: 'bigbuddha-chalong', emoji: '🙏', th: ['ทัวร์พระใหญ่ + วัดฉลอง + เมืองเก่า', 'ไกด์พาชม 3 จุดหลักในครึ่งวัน'], en: ['Big Buddha, Wat Chalong & town guided tour', 'Three main sights in half a day'] },
      { i: 1, key: 'fantasea', emoji: '🎪', th: ['Phuket FantaSea', 'ธีมพาร์ค + โชว์ใหญ่ภาคค่ำ'], en: ['Phuket FantaSea', 'Theme park with a big evening show'] },
      { i: 2, key: 'phuket-elephant', emoji: '🐘', th: ['Phuket Elephant Sanctuary', 'ดูช้างแบบมีจริยธรรม ไม่มีขี่ช้าง'], en: ['Phuket Elephant Sanctuary', 'Ethical visit — no riding'] },
    ],
    'tours-activities-phuket': [
      { i: 0, key: 'jamesbond-longtail', emoji: '🛶', th: ['เกาะเจมส์บอนด์ด้วยเรือหางยาว', 'ทัวร์อ่าวพังงาที่คนจองเยอะ'], en: ['James Bond Island by longtail boat', 'A Phang Nga Bay favourite'] },
      { i: 1, key: 'phiphi-snorkel', emoji: '🤿', th: ['เดย์ทริปดำน้ำตื้นเกาะพีพี', 'รวมอ่าวมาหยา-เกาะไม้ไผ่'], en: ['Phi Phi snorkeling day trip', 'Covers Maya Bay & Bamboo Island'] },
      { i: 2, key: 'phuket-elephant', emoji: '🐘', th: ['Phuket Elephant Sanctuary', 'ดูช้างแบบมีจริยธรรม ไม่มีขี่ช้าง'], en: ['Phuket Elephant Sanctuary', 'Ethical visit — no riding'] },
    ],
    // kata-karon-beach-guide / phuket-beaches-guide / phuket-viewpoints / promthep-cape-guide:
    // no matching Klook product — keep search links (intentionally absent)
  },
  'chiang-mai': {
    'doi-suthep-guide': [
      { i: 0, key: 'doisuthep-tour', emoji: '⛰️', th: ['ทัวร์วัดพระธาตุดอยสุเทพ (ไพรเวท)', 'มีรถรับส่ง ไม่ต้องเหมารถแดงเอง'], en: ['Doi Suthep temple private tour', 'With transfer — no songthaew haggling'] },
    ],
    'doi-inthanon-guide': [
      { i: 0, key: 'doiinthanon-tour', emoji: '🏔️', th: ['เดย์ทัวร์อุทยานดอยอินทนนท์', 'จุดหลักของอุทยานจบในวันเดียว'], en: ['Doi Inthanon National Park day tour', 'The park highlights in one day'] },
    ],
    'chiang-mai-elephant-sanctuary': [
      { i: 0, key: 'elephant-jungle', emoji: '🐘', th: ['Elephant Jungle Sanctuary', 'ให้อาหาร-อาบน้ำช้าง ไม่มีขี่ช้าง'], en: ['Elephant Jungle Sanctuary', 'Feed & bathe, no riding'] },
      { i: 1, key: 'kanta-elephant', emoji: '🐘', th: ['Kanta Elephant Sanctuary (ครึ่งวัน)', 'ที่แม่แตง เหมาะคนเวลาน้อย'], en: ['Kanta Elephant Sanctuary (half day)', 'In Mae Taeng — good on a tight schedule'] },
      { i: 2, key: 'kerchor-elephant', emoji: '🌿', th: ['Kerchor Elephant Eco Park', 'อีกหนึ่งปางช้างแนวอนุรักษ์'], en: ['Kerchor Elephant Eco Park', 'Another conservation-minded camp'] },
    ],
    'chiang-mai-waterfalls-nature': [
      { i: 0, key: 'doiinthanon-tour', emoji: '🏔️', th: ['เดย์ทัวร์อุทยานดอยอินทนนท์', 'เส้นทางธรรมชาติ-น้ำตกของอุทยาน'], en: ['Doi Inthanon National Park day tour', 'Nature trails & waterfalls in the park'] },
    ],
    'chiang-mai-attractions': [
      { i: 0, key: 'doisuthep-tour', emoji: '⛰️', th: ['ทัวร์วัดพระธาตุดอยสุเทพ (ไพรเวท)', 'จุดที่ควรไปให้ได้ของเชียงใหม่'], en: ['Doi Suthep temple private tour', "Chiang Mai's essential sight"] },
      { i: 1, key: 'elephant-jungle', emoji: '🐘', th: ['Elephant Jungle Sanctuary', 'ให้อาหาร-อาบน้ำช้าง ไม่มีขี่ช้าง'], en: ['Elephant Jungle Sanctuary', 'Feed & bathe, no riding'] },
      { i: 2, key: 'doiinthanon-tour', emoji: '🏔️', th: ['เดย์ทัวร์อุทยานดอยอินทนนท์', 'หลังคาเมืองไทยจบในวันเดียว'], en: ['Doi Inthanon National Park day tour', "Thailand's rooftop in one day"] },
    ],
    'tours-activities-chiang-mai': [
      { i: 0, key: 'doiinthanon-tour', emoji: '🏔️', th: ['เดย์ทัวร์อุทยานดอยอินทนนท์', 'จุดหลักของอุทยานจบในวันเดียว'], en: ['Doi Inthanon National Park day tour', 'The park highlights in one day'] },
      { i: 1, key: 'gibbon-zipline', emoji: '🌲', th: ['Flight of the Gibbon ซิปไลน์', 'ซิปไลน์ในป่าแม่กำปอง'], en: ['Flight of the Gibbon zipline', 'Ziplines in the Mae Kampong forest'] },
      { i: 2, key: 'elephant-jungle', emoji: '🐘', th: ['Elephant Jungle Sanctuary', 'ให้อาหาร-อาบน้ำช้าง ไม่มีขี่ช้าง'], en: ['Elephant Jungle Sanctuary', 'Feed & bathe, no riding'] },
    ],
    // old-city-temples / night-markets / sunday-walking-street / nimman / mon-jam / craft-villages /
    // new-attractions / kid-attractions / viewpoints: no product that matches the page's specific place — keep search
  },
  krabi: {
    'four-islands-tour': [
      { i: 0, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ กระบี่', 'เกาะปอดะ-ไก่-ทับ-หาดถ้ำพระนาง'], en: ['Krabi 4 Islands day tour', 'Poda, Chicken, Tup & Phra Nang beach'] },
      { i: 1, key: '4islands-longtail', emoji: '🛶', th: ['ทัวร์ 4 เกาะ เรือหางยาว (จอยทัวร์)', 'สายดำน้ำตื้น ราคาเบากว่า'], en: ['4 Islands join tour by longtail boat', 'Snorkel-focused, easier on the budget'] },
      { i: 2, key: 'phiphi-4islands', emoji: '🚤', th: ['พีพี + 4 เกาะ ในทริปเดียว', 'วันเดียวเก็บทั้งสองไฮไลต์'], en: ['Phi Phi + 4 Islands combo', 'Both highlights in a single day'] },
    ],
    'krabi-island-snorkel-tours': [
      { i: 0, key: '4islands-longtail', emoji: '🛶', th: ['ทัวร์ 4 เกาะ เรือหางยาว (จอยทัวร์)', 'สายดำน้ำตื้น ราคาเบากว่า'], en: ['4 Islands join tour by longtail boat', 'Snorkel-focused, easier on the budget'] },
      { i: 1, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ กระบี่', 'เกาะปอดะ-ไก่-ทับ-หาดถ้ำพระนาง'], en: ['Krabi 4 Islands day tour', 'Poda, Chicken, Tup & Phra Nang beach'] },
      { i: 2, key: 'phiphi-4islands', emoji: '🚤', th: ['พีพี + 4 เกาะ ในทริปเดียว', 'วันเดียวเก็บทั้งสองไฮไลต์'], en: ['Phi Phi + 4 Islands combo', 'Both highlights in a single day'] },
    ],
    'krabi-phi-phi-tour': [
      { i: 0, key: 'phiphi-4islands', emoji: '🚤', th: ['ทัวร์พีพี + 4 เกาะ จากกระบี่', 'ออกจากกระบี่ เก็บอ่าวมาหยาด้วย'], en: ['Phi Phi + 4 Islands from Krabi', 'Departs Krabi, includes Maya Bay'] },
    ],
    'emerald-pool-hot-spring': [
      { i: 0, key: 'emerald-tigercave', emoji: '💧', th: ['สระมรกต + น้ำตกร้อน + วัดถ้ำเสือ', 'สามจุดดังฝั่งบกจบในวันเดียว'], en: ['Emerald Pool, Hot Spring & Tiger Cave Temple', 'The three inland sights in one day'] },
    ],
    'wat-tham-suea-guide': [
      { i: 0, key: 'emerald-tigercave', emoji: '🛕', th: ['วัดถ้ำเสือ + สระมรกต + น้ำตกร้อน', 'สามจุดดังฝั่งบกจบในวันเดียว'], en: ['Tiger Cave Temple, Emerald Pool & Hot Spring', 'The three inland sights in one day'] },
    ],
    'railay-beach-guide': [
      { i: 0, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ (แวะหาดถ้ำพระนาง)', 'รวมหาดดังของฝั่งไร่เลย์'], en: ['4 Islands day tour (stops at Phra Nang)', "Includes Railay's famous beach"] },
      { i: 1, key: 'railay-climbing', emoji: '🧗', th: ['คอร์สปีนผาไร่เลย์ 1 วัน', 'หน้าผาหินปูนระดับตำนาน มีครูดูแล'], en: ['Railay rock climbing 1-day course', 'Legendary limestone, instructor-led'] },
    ],
    'krabi-rock-climbing': [
      { i: 0, key: 'railay-climbing', emoji: '🧗', th: ['คอร์สปีนผาไร่เลย์ 1 วัน', 'มีครูดูแล อุปกรณ์ครบ รับส่งถึงที่พัก'], en: ['Railay rock climbing 1-day course', 'Instructor, gear & hotel transfer included'] },
    ],
    'ao-nang-beach-guide': [
      { i: 0, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ (ออกเรือจากอ่าวนาง)', 'ทริปทะเลที่คนจองเยอะที่สุดของกระบี่'], en: ['4 Islands day tour (departs Ao Nang)', "Krabi's most-booked boat trip"] },
    ],
    'krabi-attractions': [
      { i: 0, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ กระบี่', 'เกาะปอดะ-ไก่-ทับ-หาดถ้ำพระนาง'], en: ['Krabi 4 Islands day tour', 'Poda, Chicken, Tup & Phra Nang beach'] },
      { i: 1, key: 'emerald-tigercave', emoji: '💧', th: ['สระมรกต + น้ำตกร้อน + วัดถ้ำเสือ', 'สามจุดดังฝั่งบกจบในวันเดียว'], en: ['Emerald Pool, Hot Spring & Tiger Cave Temple', 'The three inland sights in one day'] },
      { i: 2, key: 'phiphi-4islands', emoji: '🚤', th: ['พีพี + 4 เกาะ ในทริปเดียว', 'วันเดียวเก็บทั้งสองไฮไลต์'], en: ['Phi Phi + 4 Islands combo', 'Both highlights in a single day'] },
    ],
    'tours-activities-krabi': [
      { i: 0, key: '4islands-day', emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ กระบี่', 'เกาะปอดะ-ไก่-ทับ-หาดถ้ำพระนาง'], en: ['Krabi 4 Islands day tour', 'Poda, Chicken, Tup & Phra Nang beach'] },
      { i: 1, key: 'emerald-tigercave', emoji: '💧', th: ['สระมรกต + น้ำตกร้อน + วัดถ้ำเสือ', 'สามจุดดังฝั่งบกจบในวันเดียว'], en: ['Emerald Pool, Hot Spring & Tiger Cave Temple', 'The three inland sights in one day'] },
      { i: 2, key: 'railay-climbing', emoji: '🧗', th: ['คอร์สปีนผาไร่เลย์ 1 วัน', 'มีครูดูแล อุปกรณ์ครบ'], en: ['Railay rock climbing 1-day course', 'Instructor-led with full gear'] },
    ],
    // koh-lanta-guide / khao-khanab-nam / krabi-town-guide: no matching product — keep search
  },
  samui: {
    'ang-thong-marine-park': [
      { i: 0, key: 'angthong-319', emoji: '🏝️', th: ['เดย์ทัวร์อุทยานหมู่เกาะอ่างทอง', 'เรือใหญ่ พายคายัค ชมทะเลใน'], en: ['Ang Thong Marine Park day tour', 'Big boat, kayaking & the Emerald Lagoon'] },
      { i: 1, key: 'angthong-4614', emoji: '🚤', th: ['อ่างทองด้วยสปีดโบ๊ต', 'เวลาบนเกาะเยอะกว่า เดินทางไว'], en: ['Ang Thong by speedboat', 'Faster ride, more time on the islands'] },
    ],
    'samui-snorkeling-diving': [
      { i: 0, key: 'kohtao-nangyuan', emoji: '🤿', th: ['เกาะเต่า-เกาะนางยวน สปีดโบ๊ต', 'จุดดำน้ำตื้นดังที่สุดใกล้สมุย'], en: ['Koh Tao & Koh Nangyuan by speedboat', 'The best-known snorkel spots near Samui'] },
      { i: 1, key: 'kohtao-phangan', emoji: '🐠', th: ['เกาะเต่า + นางยวน + พะงัน', 'สามเกาะในทริปเดียว'], en: ['Koh Tao, Nangyuan & Pha-ngan combo', 'Three islands in one trip'] },
    ],
    'samui-attractions': [
      { i: 0, key: 'angthong-319', emoji: '🏝️', th: ['เดย์ทัวร์อุทยานหมู่เกาะอ่างทอง', 'ทริปที่คนจองเยอะที่สุดจากสมุย'], en: ['Ang Thong Marine Park day tour', 'The most-booked trip from Samui'] },
      { i: 1, key: 'kohtao-nangyuan', emoji: '🤿', th: ['เกาะเต่า-เกาะนางยวน สปีดโบ๊ต', 'จุดดำน้ำตื้นดังที่สุดใกล้สมุย'], en: ['Koh Tao & Koh Nangyuan by speedboat', 'The best-known snorkel spots near Samui'] },
    ],
    'tours-activities-samui': [
      { i: 0, key: 'angthong-4614', emoji: '🏝️', th: ['อ่างทองด้วยสปีดโบ๊ต', 'อุทยานทางทะเลจบในวันเดียว'], en: ['Ang Thong by speedboat', 'The marine park in one day'] },
      { i: 1, key: 'kohtao-phangan', emoji: '🐠', th: ['เกาะเต่า + นางยวน + พะงัน', 'สามเกาะในทริปเดียว'], en: ['Koh Tao, Nangyuan & Pha-ngan combo', 'Three islands in one trip'] },
    ],
    // big-buddha-wat-phra-yai / chaweng / lamai / bophut / hin-ta-hin-yai / na-muang-waterfall /
    // samui-temples-culture / samui-viewpoints / wat-khunaram: no matching product — keep search
  },
  pattaya: {
    'pattaya-sanctuary-of-truth': [
      { i: 0, key: 'sanctuary-truth', emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'จองล่วงหน้า เข้าชมงานไม้ริมทะเล'], en: ['Sanctuary of Truth ticket', 'Book ahead for the seaside wood temple'] },
      { i: 1, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'เก็บไฮไลต์พัทยาในวันเดียว'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Pattaya highlights in one day'] },
    ],
    'pattaya-nong-nooch-garden': [
      { i: 0, key: 'nong-nooch', emoji: '🌴', th: ['ตั๋วสวนนงนุช', 'สวนพฤกษศาสตร์ + โชว์วัฒนธรรม-ช้าง'], en: ['Nong Nooch Garden ticket', 'Botanical park with cultural & elephant shows'] },
    ],
    'pattaya-tiffany-cabaret-show': [
      { i: 0, key: 'tiffany-show', emoji: '🎭', th: ["ตั๋วโชว์ Tiffany's พัทยา", 'คาบาเรต์เจ้าดังที่เปิดมานานที่สุด'], en: ["Tiffany's Show ticket, Pattaya", 'The longest-running cabaret in town'] },
    ],
    'pattaya-water-parks': [
      { i: 0, key: 'ramayana-park', emoji: '💦', th: ['ตั๋ว Ramayana Water Park', 'สวนน้ำใหญ่ที่สุดของไทย สไลเดอร์ 21 ตัว'], en: ['Ramayana Water Park ticket', "Thailand's biggest water park, 21 slides"] },
    ],
    'pattaya-art-in-paradise': [
      { i: 0, key: 'art-in-paradise', emoji: '🎨', th: ['ตั๋ว Art in Paradise พัทยา', 'มิวเซียมภาพ 3D ถ่ายรูปสนุกวันฝนตก'], en: ['Art in Paradise Pattaya ticket', '3D trick-art museum, great on rainy days'] },
    ],
    'pattaya-pratamnak-viewpoint': [
      { i: 0, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'มีแวะจุดชมวิวพัทยาด้วย'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Includes the Pattaya viewpoint stop'] },
    ],
    'pattaya-attractions': [
      { i: 0, key: 'sanctuary-truth', emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'แลนด์มาร์กงานไม้ริมทะเล'], en: ['Sanctuary of Truth ticket', 'The seaside wood-carved landmark'] },
      { i: 1, key: 'nong-nooch', emoji: '🌴', th: ['ตั๋วสวนนงนุช', 'สวนพฤกษศาสตร์ + โชว์วัฒนธรรม-ช้าง'], en: ['Nong Nooch Garden ticket', 'Botanical park with cultural & elephant shows'] },
      { i: 2, key: 'tiffany-show', emoji: '🎭', th: ["ตั๋วโชว์ Tiffany's พัทยา", 'คาบาเรต์เจ้าดังที่เปิดมานานที่สุด'], en: ["Tiffany's Show ticket, Pattaya", 'The longest-running cabaret in town'] },
    ],
    'tours-activities-pattaya': [
      { i: 0, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'เก็บไฮไลต์พัทยาในวันเดียว'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Pattaya highlights in one day'] },
      { i: 1, key: 'sanctuary-truth', emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'จองล่วงหน้า เข้าชมงานไม้ริมทะเล'], en: ['Sanctuary of Truth ticket', 'Book ahead for the seaside wood temple'] },
      { i: 2, key: 'ramayana-park', emoji: '💦', th: ['ตั๋ว Ramayana Water Park', 'สวนน้ำใหญ่ที่สุดของไทย สไลเดอร์ 21 ตัว'], en: ['Ramayana Water Park ticket', "Thailand's biggest water park, 21 slides"] },
    ],
    // pattaya-big-buddha / khao-chi-chan / jomtien-beach / walking-street / temples-culture: no matching product — keep search
  },
  wave2a: { // samut-songkhram + chiang-rai + surat-thani
    'maeklong-railway-market': [
      { i: 0, key: 'damnoen-maeklong', emoji: '🚂', th: ['ดำเนินสะดวก + ตลาดร่มหุบแม่กลอง', 'สองตลาดดังจบในทริปเดียว (จากกรุงเทพ)'], en: ['Damnoen Saduak + Maeklong Railway Market', 'Two famous markets in one trip (from Bangkok)'] },
      { i: 1, key: 'amphawa-firefly', emoji: '✨', th: ['แม่กลอง + อัมพวา ล่องเรือดูหิ่งห้อย', 'ต่อด้วยตลาดน้ำยามเย็น'], en: ['Maeklong + Amphawa with firefly cruise', 'Follow up with the evening floating market'] },
    ],
    'amphawa-floating-market': [
      { i: 0, key: 'amphawa-firefly', emoji: '✨', th: ['ทัวร์อัมพวา + แม่กลอง + ล่องเรือหิ่งห้อย', 'ไปเย็นกลับดึกจากกรุงเทพ'], en: ['Amphawa + Maeklong with firefly cruise', 'Evening trip from Bangkok'] },
    ],
    'amphawa-firefly-boat': [
      { i: 0, key: 'amphawa-firefly', emoji: '✨', th: ['ทัวร์อัมพวา + ล่องเรือหิ่งห้อย', 'รวมตลาดร่มหุบแม่กลองด้วย'], en: ['Amphawa firefly cruise tour', 'Includes the Maeklong railway market'] },
    ],
    'samut-songkhram-attractions': [
      { i: 0, key: 'damnoen-maeklong', emoji: '🚂', th: ['ดำเนินสะดวก + ตลาดร่มหุบแม่กลอง', 'สองตลาดดังจบในทริปเดียว'], en: ['Damnoen Saduak + Maeklong Railway Market', 'Two famous markets in one trip'] },
      { i: 1, key: 'amphawa-firefly', emoji: '✨', th: ['อัมพวา + ล่องเรือดูหิ่งห้อย', 'ตลาดน้ำยามเย็น ปิดท้ายด้วยหิ่งห้อย'], en: ['Amphawa + firefly boat ride', 'Evening market, firefly cruise to finish'] },
    ],
    'wat-rong-khun-guide': [
      { i: 0, key: 'cr-3temples', emoji: '🤍', th: ['ทัวร์วัดร่องขุ่น-ร่องเสือเต้น-บ้านดำ', 'ไปเช้าเย็นกลับจากเชียงใหม่ ครบสามจุดดัง'], en: ['White, Blue & Black temple day tour', 'From Chiang Mai — all three icons in a day'] },
    ],
    'wat-rong-suea-ten-guide': [
      { i: 0, key: 'cr-3temples', emoji: '💙', th: ['ทัวร์วัดร่องเสือเต้น-ร่องขุ่น-บ้านดำ', 'ไปเช้าเย็นกลับจากเชียงใหม่ ครบสามจุดดัง'], en: ['Blue, White & Black temple day tour', 'From Chiang Mai — all three icons in a day'] },
    ],
    'baan-dam-museum-guide': [
      { i: 0, key: 'cr-3temples', emoji: '🖤', th: ['ทัวร์บ้านดำ-วัดร่องขุ่น-ร่องเสือเต้น', 'ไปเช้าเย็นกลับจากเชียงใหม่ ครบสามจุดดัง'], en: ['Black House, White & Blue temple day tour', 'From Chiang Mai — all three icons in a day'] },
    ],
    'chiang-rai-attractions': [
      { i: 0, key: 'cr-3temples', emoji: '🛕', th: ['ทัวร์วัดร่องขุ่น-ร่องเสือเต้น-บ้านดำ', 'สามจุดที่คนไปเยอะที่สุดของเชียงราย'], en: ['White, Blue & Black temple day tour', "Chiang Rai's three most-visited sights"] },
    ],
    'khao-sok-national-park': [
      { i: 0, key: 'cheowlan-day', emoji: '🛶', th: ['เดย์ทัวร์เขื่อนเชี่ยวหลาน เรือหางยาว', 'ล่องทะเลสาบ เข้าถ้ำ กินข้าวแพกลางน้ำ'], en: ['Cheow Lan Lake day tour by longtail', 'Lake cruise, cave & floating-raft lunch'] },
    ],
    'cheow-lan-lake-guide': [
      { i: 0, key: 'cheowlan-day', emoji: '🛶', th: ['เดย์ทัวร์เขื่อนเชี่ยวหลาน เรือหางยาว', 'ล่องทะเลสาบ เข้าถ้ำ กินข้าวแพกลางน้ำ'], en: ['Cheow Lan Lake day tour by longtail', 'Lake cruise, cave & floating-raft lunch'] },
    ],
    'khao-sok-waterfalls-caves': [
      { i: 0, key: 'cheowlan-day', emoji: '🛶', th: ['เดย์ทัวร์เชี่ยวหลาน (มีเข้าถ้ำ)', 'ล่องเรือหางยาว + เดินป่าเข้าถ้ำ'], en: ['Cheow Lan day tour (with cave visit)', 'Longtail cruise + jungle walk to a cave'] },
    ],
    'koh-tao-guide': [
      { i: 0, key: 'kohtao-nangyuan', emoji: '🤿', th: ['เดย์ทริปเกาะเต่า-นางยวน (จากสมุย)', 'สปีดโบ๊ต ดำน้ำตื้นจุดดัง'], en: ['Koh Tao & Nangyuan day trip (from Samui)', 'Speedboat with top snorkel stops'] },
      { i: 1, key: 'padi-discover', emoji: '🐠', th: ['ลองดำน้ำลึกครั้งแรก (PADI Discover)', 'ที่เกาะเต่า มีครูประกบ'], en: ['First-time scuba (PADI Discover)', 'On Koh Tao with an instructor'] },
      { i: 2, key: 'padi-open-water', emoji: '📜', th: ['คอร์ส PADI Open Water เกาะเต่า', 'เรียนจบได้ใบดำน้ำจริง'], en: ['PADI Open Water course, Koh Tao', 'Finish with a real dive licence'] },
    ],
    'koh-phangan-guide': [
      { i: 0, key: 'kohtao-phangan', emoji: '🏝️', th: ['ทัวร์เกาะเต่า + นางยวน + พะงัน', 'สามเกาะในทริปเดียวจากสมุย'], en: ['Koh Tao, Nangyuan & Pha-ngan combo', 'Three islands in one trip from Samui'] },
    ],
    'koh-samui-guide': [
      { i: 0, key: 'angthong-319', emoji: '🏝️', th: ['เดย์ทัวร์อุทยานหมู่เกาะอ่างทอง', 'ทริปที่คนจองเยอะที่สุดจากสมุย'], en: ['Ang Thong Marine Park day tour', 'The most-booked trip from Samui'] },
      { i: 1, key: 'kohtao-nangyuan', emoji: '🤿', th: ['เดย์ทริปเกาะเต่า-นางยวน', 'สปีดโบ๊ต ดำน้ำตื้นจุดดัง'], en: ['Koh Tao & Nangyuan day trip', 'Speedboat with top snorkel stops'] },
    ],
    // tha-kha-floating-market / don-hoi-lot / mae-klong-* / wat-* / golden-triangle / doi-tung / phu-chi-fa /
    // mae-sai / choui-fong / doi-chang / clock-tower / wat-huay-pla-kang / donsak / chaiya / suan-mokkh etc.:
    // no matching product — keep search
  },
  wave2b: { // kanchanaburi + ayutthaya + khao-yai + hua-hin
    'erawan-waterfall-guide': [
      { i: 0, key: 'erawan-kwai', emoji: '💦', th: ['เดย์ทัวร์น้ำตกเอราวัณ + สะพานข้ามแม่น้ำแคว', 'ไปเช้าเย็นกลับจากกรุงเทพ'], en: ['Erawan Waterfall + River Kwai Bridge day tour', 'Out and back from Bangkok'] },
    ],
    'bridge-river-kwai-guide': [
      { i: 0, key: 'death-railway', emoji: '🚂', th: ['เดย์ทัวร์ทางรถไฟสายมรณะ + สะพานแคว', 'รวมนั่งรถไฟช่วงถ้ำกระแซ'], en: ['Death Railway + River Kwai Bridge day tour', 'Includes the Tham Krasae train ride'] },
      { i: 1, key: 'erawan-kwai', emoji: '💦', th: ['เอราวัณ + สะพานแคว ในวันเดียว', 'สายธรรมชาติ+ประวัติศาสตร์'], en: ['Erawan + River Kwai in one day', 'Nature and history combined'] },
    ],
    'death-railway-tham-krasae': [
      { i: 0, key: 'death-railway', emoji: '🚂', th: ['เดย์ทัวร์ทางรถไฟสายมรณะ + สะพานแคว', 'รวมนั่งรถไฟช่วงถ้ำกระแซ'], en: ['Death Railway + River Kwai Bridge day tour', 'Includes the Tham Krasae train ride'] },
    ],
    'kanchanaburi-attractions': [
      { i: 0, key: 'erawan-kwai', emoji: '💦', th: ['เดย์ทัวร์น้ำตกเอราวัณ + สะพานแคว', 'สองไฮไลต์ของจังหวัดในวันเดียว'], en: ['Erawan Waterfall + River Kwai day tour', 'The two big highlights in one day'] },
      { i: 1, key: 'death-railway', emoji: '🚂', th: ['เดย์ทัวร์ทางรถไฟสายมรณะ', 'สายประวัติศาสตร์ รวมนั่งรถไฟ'], en: ['Death Railway full-day tour', 'History-focused, includes the train ride'] },
    ],
    'ayutthaya-attractions': [
      { i: 0, key: 'ayutthaya-fullday', emoji: '🏛️', th: ['เดย์ทัวร์อุทยานประวัติศาสตร์อยุธยา', 'เต็มวันจากกรุงเทพ'], en: ['Ayutthaya Historical Park full-day tour', 'Full day from Bangkok'] },
      { i: 1, key: 'ayutthaya-temples', emoji: '🛕', th: ['ทัวร์วัดดังอยุธยาในวันเดียว', 'รวมเศียรพระในรากไม้วัดมหาธาตุ'], en: ['Ayutthaya must-visit temples day tour', 'Includes the Buddha head at Wat Mahathat'] },
    ],
    'wat-mahathat-guide': [
      { i: 0, key: 'ayutthaya-temples', emoji: '🛕', th: ['ทัวร์วัดดังอยุธยา (รวมวัดมหาธาตุ)', 'จุดถ่ายรูปเศียรพระในรากไม้'], en: ['Ayutthaya temples tour (incl. Wat Mahathat)', 'Home of the Buddha head in tree roots'] },
    ],
    'wat-phra-si-sanphet-guide': [
      { i: 0, key: 'ayutthaya-fullday', emoji: '🏛️', th: ['เดย์ทัวร์อุทยานประวัติศาสตร์อยุธยา', 'วัดพระศรีสรรเพชญ์อยู่ใจกลางอุทยาน'], en: ['Ayutthaya Historical Park full-day tour', 'Wat Phra Si Sanphet sits at its heart'] },
    ],
    'khaoyai-national-park': [
      { i: 0, key: 'khaoyai-fullday', emoji: '🌳', th: ['เดย์ทัวร์อุทยานแห่งชาติเขาใหญ่', 'เดินเทรล ส่องสัตว์ จากกรุงเทพ'], en: ['Khao Yai National Park full-day tour', 'Trails & wildlife, from Bangkok'] },
    ],
    'khaoyai-attractions': [
      { i: 0, key: 'khaoyai-fullday', emoji: '🌳', th: ['เดย์ทัวร์อุทยานแห่งชาติเขาใหญ่', 'เดินเทรล ส่องสัตว์ จากกรุงเทพ'], en: ['Khao Yai National Park full-day tour', 'Trails & wildlife, from Bangkok'] },
    ],
    'huahin-vana-nava-waterpark': [
      { i: 0, key: 'vana-nava', emoji: '💦', th: ['ตั๋ว Vana Nava Water Jungle', 'จองล่วงหน้า เข้าได้เลย'], en: ['Vana Nava Water Jungle ticket', 'Book ahead, walk straight in'] },
    ],
    'huahin-santorini-park': [
      { i: 0, key: 'santorini-water', emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures', 'โซนสวนน้ำของสวนสนุกธีมกรีซ'], en: ['Santorini Park Waterventures pass', 'The water-park zone of the Greek-themed park'] },
    ],
    'tours-activities-hua-hin': [
      { i: 0, key: 'huahin-zipline', emoji: '🌲', th: ['ซิปไลน์หัวหิน', 'กิจกรรมโหนสลิงในป่าใกล้เมือง'], en: ['Hua Hin zipline experience', 'Forest ziplines close to town'] },
      { i: 1, key: 'vana-nava', emoji: '💦', th: ['ตั๋ว Vana Nava Water Jungle', 'สวนน้ำใหญ่กลางหัวหิน'], en: ['Vana Nava Water Jungle ticket', "Hua Hin's big water park"] },
      { i: 2, key: 'santorini-water', emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures', 'สวนน้ำธีมกรีซที่ชะอำ'], en: ['Santorini Park Waterventures pass', 'Greek-themed water park in Cha-am'] },
    ],
    'huahin-attractions': [
      { i: 0, key: 'vana-nava', emoji: '💦', th: ['ตั๋ว Vana Nava Water Jungle', 'สวนน้ำใหญ่กลางหัวหิน'], en: ['Vana Nava Water Jungle ticket', "Hua Hin's big water park"] },
      { i: 1, key: 'santorini-water', emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures', 'สวนน้ำธีมกรีซที่ชะอำ'], en: ['Santorini Park Waterventures pass', 'Greek-themed water park in Cha-am'] },
      { i: 2, key: 'huahin-zipline', emoji: '🌲', th: ['ซิปไลน์หัวหิน', 'กิจกรรมโหนสลิงในป่าใกล้เมือง'], en: ['Hua Hin zipline experience', 'Forest ziplines close to town'] },
    ],
    // hellfire-pass / sai-yok / sangkhlaburi / srinakarin / prasat-muang-sing / raft-houses / caves-hotsprings /
    // ayutthaya wat pages we can't confirm on itineraries / bang-pa-in / river-cruise / night-temples / bike /
    // khaoyai waterfalls/farms/wineries/palio / huahin beaches/station/plearn-wan/sheep-farm/khao-takiab etc.:
    // no verified matching product — keep search
  },
  wave3: { // chonburi + nakhon-ratchasima + prachuap + phang-nga + phetchaburi + sukhothai (province twins reuse verified slugs)
    'sanctuary-of-truth-guide': [
      { i: 0, key: 'sanctuary-truth', emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'จองล่วงหน้า เข้าชมงานไม้ริมทะเล'], en: ['Sanctuary of Truth ticket', 'Book ahead for the seaside wood temple'] },
      { i: 1, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'เก็บไฮไลต์พัทยาในวันเดียว'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Pattaya highlights in one day'] },
    ],
    'nong-nooch-garden-guide': [
      { i: 0, key: 'nong-nooch', emoji: '🌴', th: ['ตั๋วสวนนงนุช', 'สวนพฤกษศาสตร์ + โชว์วัฒนธรรม-ช้าง'], en: ['Nong Nooch Garden ticket', 'Botanical park with cultural & elephant shows'] },
    ],
    'koh-larn-guide': [
      { i: 0, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'รวมเรือไป-กลับเกาะล้าน'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Boat to Koh Larn included'] },
    ],
    'pattaya-viewpoint-guide': [
      { i: 0, key: 'kohlarn-combo', emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'มีแวะจุดชมวิวพัทยาด้วย'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Includes the Pattaya viewpoint stop'] },
    ],
    'chonburi-attractions': [
      { i: 0, key: 'sanctuary-truth', emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'แลนด์มาร์กงานไม้ริมทะเลพัทยา'], en: ['Sanctuary of Truth ticket', "Pattaya's wood-carved seaside landmark"] },
      { i: 1, key: 'nong-nooch', emoji: '🌴', th: ['ตั๋วสวนนงนุช', 'สวนพฤกษศาสตร์ + โชว์วัฒนธรรม-ช้าง'], en: ['Nong Nooch Garden ticket', 'Botanical park with cultural & elephant shows'] },
    ],
    'khao-yai-national-park-guide': [
      { i: 0, key: 'khaoyai-fullday', emoji: '🌳', th: ['เดย์ทัวร์อุทยานแห่งชาติเขาใหญ่', 'เดินเทรล ส่องสัตว์ จากกรุงเทพ'], en: ['Khao Yai National Park full-day tour', 'Trails & wildlife, from Bangkok'] },
    ],
    'korat-attractions': [
      { i: 0, key: 'khaoyai-fullday', emoji: '🌳', th: ['เดย์ทัวร์อุทยานแห่งชาติเขาใหญ่', 'ไฮไลต์ธรรมชาติของโคราช'], en: ['Khao Yai National Park full-day tour', "Korat's headline nature trip"] },
    ],
    'prachuap-attractions': [
      { i: 0, key: 'vana-nava', emoji: '💦', th: ['ตั๋ว Vana Nava Water Jungle หัวหิน', 'สวนน้ำใหญ่ของจังหวัด'], en: ['Vana Nava Water Jungle ticket, Hua Hin', "The province's big water park"] },
      { i: 1, key: 'huahin-zipline', emoji: '🌲', th: ['ซิปไลน์หัวหิน', 'กิจกรรมโหนสลิงในป่าใกล้เมือง'], en: ['Hua Hin zipline experience', 'Forest ziplines close to town'] },
    ],
    'similan-islands-guide': [
      { i: 0, key: 'similan-snorkel', emoji: '🐠', th: ['ทัวร์ดำน้ำตื้นหมู่เกาะสิมิลัน', 'ออกจากภูเก็ต (เปิดตามฤดูกาล)'], en: ['Similan Islands snorkeling tour', 'From Phuket (seasonal opening)'] },
      { i: 1, key: 'similan-khaolak', emoji: '🚤', th: ['สิมิลันเดย์ทริป รับส่งภูเก็ต/เขาหลัก', 'จุดขึ้นเรืออยู่ฝั่งเขาหลัก'], en: ['Similan day trip, Phuket/Khao Lak transfer', 'Boats depart from the Khao Lak side'] },
    ],
    'khao-lak-guide': [
      { i: 0, key: 'similan-khaolak', emoji: '🐠', th: ['เดย์ทริปสิมิลันจากเขาหลัก', 'จุดขึ้นเรือหลักไปสิมิลัน'], en: ['Similan day trip from Khao Lak', 'The main jump-off point for the Similans'] },
    ],
    'phang-nga-bay-james-bond': [
      { i: 0, key: 'jamesbond-longtail', emoji: '🛶', th: ['เกาะเจมส์บอนด์ด้วยเรือหางยาว', 'ล่องอ่าวพังงาแบบดั้งเดิม พายแคนูถ้ำลอด'], en: ['James Bond Island by longtail boat', 'Classic Phang Nga Bay route with canoeing'] },
      { i: 1, key: 'jamesbond-bigboat', emoji: '🚤', th: ['เดย์ทัวร์เจมส์บอนด์ เรือใหญ่ + สปีดโบ๊ต', 'ทางเลือกนั่งสบาย คลื่นน้อย'], en: ['James Bond day tour: big boat + speedboat', 'The comfier, calmer ride'] },
    ],
    'phang-nga-sea-canoe': [
      { i: 0, key: 'jamesbond-longtail', emoji: '🛶', th: ['ทัวร์อ่าวพังงา + พายแคนูถ้ำลอด', 'รวมพายแคนูชมถ้ำ-ลากูน'], en: ['Phang Nga Bay tour with sea canoeing', 'Canoe through caves & lagoons included'] },
    ],
    'phang-nga-attractions': [
      { i: 0, key: 'jamesbond-longtail', emoji: '🛶', th: ['เกาะเจมส์บอนด์ด้วยเรือหางยาว', 'ไฮไลต์อ่าวพังงา'], en: ['James Bond Island by longtail boat', 'The Phang Nga Bay highlight'] },
      { i: 1, key: 'similan-snorkel', emoji: '🐠', th: ['ทัวร์ดำน้ำตื้นหมู่เกาะสิมิลัน', 'ทะเลใสอันดับต้นของไทย (ตามฤดูกาล)'], en: ['Similan Islands snorkeling tour', 'Some of the clearest sea in Thailand (seasonal)'] },
    ],
    'cha-am-beach-guide': [
      { i: 0, key: 'santorini-water', emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures', 'สวนน้ำธีมกรีซของชะอำ'], en: ['Santorini Park Waterventures pass', "Cha-am's Greek-themed water park"] },
    ],
    'phetchaburi-attractions': [
      { i: 0, key: 'santorini-water', emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures (ชะอำ)', 'สวนน้ำธีมกรีซในจังหวัด'], en: ['Santorini Park Waterventures (Cha-am)', "The province's Greek-themed water park"] },
    ],
    'sukhothai-historical-park-guide': [
      { i: 0, key: 'sukhothai-cycling', emoji: '🚲', th: ['ปั่นจักรยานชมอุทยานประวัติศาสตร์', 'ครึ่งวัน มีไกด์นำ'], en: ['Sukhothai Historical Park cycling tour', 'Half day with a guide'] },
      { i: 1, key: 'sukhothai-sunset', emoji: '🌅', th: ['ปั่นชมพระอาทิตย์ตกที่สุโขทัย', 'รอบเย็น แสงสวยสุดของอุทยาน'], en: ['Sukhothai sunset cycling tour', "Evening ride in the park's best light"] },
    ],
    'sukhothai-old-city-cycling': [
      { i: 0, key: 'sukhothai-cycling', emoji: '🚲', th: ['ปั่นจักรยานชมอุทยานประวัติศาสตร์', 'ครึ่งวัน มีไกด์นำ'], en: ['Sukhothai Historical Park cycling tour', 'Half day with a guide'] },
      { i: 1, key: 'sukhothai-sunset', emoji: '🌅', th: ['ปั่นชมพระอาทิตย์ตกที่สุโขทัย', 'รอบเย็น แสงสวยสุดของอุทยาน'], en: ['Sukhothai sunset cycling tour', "Evening ride in the park's best light"] },
    ],
    'sukhothai-attractions': [
      { i: 0, key: 'sukhothai-cycling', emoji: '🚲', th: ['ปั่นจักรยานชมอุทยานประวัติศาสตร์', 'วิธีเที่ยวอุทยานที่คนนิยมสุด'], en: ['Sukhothai Historical Park cycling tour', 'The classic way to see the park'] },
    ],
    // bangsaen/sriracha/sattahip/khao-chi-chan/khao-sam-muk/pattaya-beach/floating-market · korat phimai/old-town/
    // dam/silk/petrified-wood/thao-suranari/wat-ban-rai · prachuap hua-hin twins/sam-roi-yot/phraya-nakhon/rajabhakti ·
    // phang-nga koh-yao/surin/takua-pa/wat-tham/samet-nangshe/waterfalls · phetchaburi palaces/caves/temples/kaeng-krachan ·
    // sukhothai si-satchanalai/wat pages/loy-krathong/kilns · rayong/satun ทั้งจังหวัด: no verified product — keep search
  },
  wave4: { // mae-hong-son (pai) + trat (koh chang)
    'pai-guide': [
      { i: 0, key: 'pai-day-join', emoji: '⛰️', th: ['เดย์ทัวร์ปายจากเชียงใหม่ (จอยทัวร์)', 'ปายแคนยอน สะพานประวัติศาสตร์ หมู่บ้านสันติชล'], en: ['Pai day tour from Chiang Mai (join)', 'Pai Canyon, Memorial Bridge & Santichon'] },
      { i: 1, key: 'pai-day-private', emoji: '🚐', th: ['เดย์ทัวร์ปาย รถส่วนตัว', 'จัดจังหวะเองได้ เหมาะมากันเป็นกลุ่ม'], en: ['Pai private day tour', 'Your own pace — good for groups'] },
    ],
    'pai-canyon-viewpoints': [
      { i: 0, key: 'pai-day-join', emoji: '⛰️', th: ['เดย์ทัวร์ปาย (รวมปายแคนยอน)', 'ไปเช้าเย็นกลับจากเชียงใหม่'], en: ['Pai day tour (includes Pai Canyon)', 'Out and back from Chiang Mai'] },
    ],
    'mae-hong-son-attractions': [
      { i: 0, key: 'pai-day-join', emoji: '⛰️', th: ['เดย์ทัวร์ปายจากเชียงใหม่', 'จุดเริ่มยอดนิยมของจังหวัด'], en: ['Pai day tour from Chiang Mai', "The province's most popular springboard"] },
    ],
    'koh-chang-guide': [
      { i: 0, key: 'kohchang-speed', emoji: '🚤', th: ['ทัวร์ดำน้ำตื้น 4-5 เกาะ สปีดโบ๊ต', 'รอบอุทยานทางทะเลเกาะช้าง'], en: ['4-5 island snorkel tour by speedboat', 'Around the Koh Chang marine park'] },
      { i: 1, key: 'kohchang-kontiki', emoji: '⛵', th: ['Kon Tiki ครูซดำน้ำตื้น', 'เรือใหญ่นั่งสบาย มีบุฟเฟต์กลางวัน'], en: ['Kon Tiki snorkeling cruise', 'Comfy big boat with lunch buffet'] },
    ],
    'trat-snorkeling-islands': [
      { i: 0, key: 'kohchang-speed', emoji: '🚤', th: ['ทัวร์ดำน้ำตื้น 4-5 เกาะ สปีดโบ๊ต', 'เกาะหวาย เกาะเหลายา เกาะรัง'], en: ['4-5 island snorkel tour by speedboat', 'Koh Wai, Koh Laoya & Koh Rang'] },
      { i: 1, key: 'kohchang-kontiki', emoji: '⛵', th: ['Kon Tiki ครูซดำน้ำตื้น', 'เรือใหญ่นั่งสบาย มีบุฟเฟต์กลางวัน'], en: ['Kon Tiki snorkeling cruise', 'Comfy big boat with lunch buffet'] },
    ],
    'trat-attractions': [
      { i: 0, key: 'kohchang-speed', emoji: '🚤', th: ['ทัวร์ดำน้ำตื้นรอบเกาะช้าง', 'กิจกรรมทะเลหลักของจังหวัด'], en: ['Koh Chang snorkel tour', "The province's main sea outing"] },
    ],
    // ban-rak-thai/ban-ja-bo/pang-ung/tham-lod/bua-tong/sea-of-mist/doi-kong-mu/wat pages · koh-kood/koh-mak/
    // klong-plu/naval-memorial/old-town/wat-buppharam/hat-lek: no verified product — keep search
  },
};

// ---- wave 5: eat-ranking foodexp blocks (uniform slots per cluster → build programmatically) ----
// slots: [0] food tour · [1] cooking class · [2] night market food · [3] GYG (untouched)
const mk = (files, items) => Object.fromEntries(files.map(f => [f, items]));
const BKK_FOOD = [
  { i: 0, key: 'michelin-tuktuk', emoji: '🛺', th: ['ทัวร์ตุ๊กตุ๊กชิมร้านมิชลินยามค่ำ', 'มีคนท้องถิ่นพาตะลุยหลายร้าน'], en: ['Michelin street-food tuk-tuk night tour', 'A local steers you through the best stops'] },
  { i: 1, key: 'arun-cooking', emoji: '👩‍🍳', th: ['คลาสทำอาหารไทย + เดินตลาดสด', 'นั่งตุ๊กตุ๊กไปตลาด แล้วลงมือทำเอง'], en: ['Thai cooking class with market tour', 'Tuk-tuk to the market, then cook it yourself'] },
  { i: 2, key: 'midnight-food', emoji: '🌃', th: ['ฟู้ดทัวร์รอบดึกด้วยตุ๊กตุ๊ก', 'ชิมของกินเด็ดหลังพระอาทิตย์ตก'], en: ['Midnight food tour by tuk-tuk', 'Late-night eats after sundown'] },
];
const CM_FOOD = [
  { i: 0, key: 'cm-streetfood', emoji: '🍜', th: ['ทัวร์สตรีทฟู้ดยามเย็นเชียงใหม่', 'เดินชิมย่านประตูเชียงใหม่กับไกด์'], en: ['Chiang Mai evening street-food walk', 'Graze the Chiang Mai Gate stalls with a guide'] },
  { i: 1, key: 'akha-cooking', emoji: '👩‍🍳', th: ['คลาสทำอาหาร Thai Akha + เดินตลาดสด', 'อาหารไทย-อาข่า เริ่มจากตลาดท้องถิ่น'], en: ['Thai Akha cooking class with market tour', 'Thai-Akha dishes, starts at a local market'] },
];
const PKT_FOOD = [
  { i: 0, key: 'phuket-streetfood', emoji: '🍜', th: ['ทัวร์สตรีทฟู้ดเมืองเก่าภูเก็ต', 'เดินชิมร้านดั้งเดิมกับคนท้องถิ่น'], en: ['Phuket old town street-food walk', 'Heritage eats with a local guide'] },
];
BATCHES.wave5 = {
  ...mk(['bangkok-boat-noodles','bangkok-cafe-guide','bangkok-dessert-bakery','bangkok-mookata-buffet','bangkok-rooftop-bars','bangkok-seafood','bangkok-street-food-yaowarat','top10-popular-restaurants-bangkok'], BKK_FOOD),
  ...mk(['chiang-mai-cafe-guide','chiang-mai-coffee-roasters','chiang-mai-dessert-bakery','chiang-mai-fine-dining','chiang-mai-mookata-buffet','chiang-mai-northern-cuisine','chiang-mai-riverside-restaurants','chiang-mai-vegetarian-vegan','top-khao-soi-chiang-mai','top10-popular-restaurants-chiang-mai'], CM_FOOD),
  ...mk(['phuket-beach-bars-dining','phuket-dim-sum-breakfast','phuket-hokkien-mee','phuket-local-sweets','phuket-mookata-buffet','phuket-old-town-cafe','phuket-seafood','phuket-southern-food'], PKT_FOOD),
  'phuket-michelin-fine-dining': [
    { i: 0, key: 'phuket-michelin', emoji: '⭐', th: ['ฟู้ดทัวร์ตามรอยมิชลินไกด์ + เมืองเก่า', 'ชิมโอ้เอ๋ว หมี่ฮกเกี้ยน ร้านในไกด์'], en: ['Michelin Guide food tour + old town', 'Oh-aew, Hokkien mee & guide-listed stops'] },
  ],
  'top10-attractions-chiang-mai': [
    { i: 1, key: 'doisuthep-tour', emoji: '⛰️', th: ['ทัวร์วัดพระธาตุดอยสุเทพ (ไพรเวท)', 'จุดที่ควรไปให้ได้ของเชียงใหม่'], en: ['Doi Suthep temple private tour', "Chiang Mai's essential sight"] },
  ],
  'top10-attractions-phuket': [
    { i: 1, key: 'bigbuddha-chalong', emoji: '🙏', th: ['ทัวร์พระใหญ่ + วัดฉลอง + เมืองเก่า', 'ไกด์พาชม 3 จุดหลักในครึ่งวัน'], en: ['Big Buddha, Wat Chalong & town guided tour', 'Three main sights in half a day'] },
  ],
};

// ---- wave 6: food-type pages with the same foodexp block ----
BATCHES.wave6 = {
  ...mk(['bangkok-food-guide','bangkok-khao-gaeng','bangkok-local-breakfast','bangkok-night-market-food'], BKK_FOOD),
  ...mk(['chiang-mai-food-guide','chiang-mai-khao-soi','chiang-mai-local-breakfast','chiang-mai-out-of-town-dining','chiang-mai-street-food'], CM_FOOD),
  ...mk(['phuket-food-guide','phuket-roti-tea','phuket-street-food-markets'], PKT_FOOD),
};

// ---- wave 7: itinerary pages (experiences block, big-3 cities) ----
// reusable slot-item defs (no index) → S() assigns i=0,1,2 in order
const S = (...arr) => arr.map((it, i) => ({ i, ...it }));
const IT = {
  landmarks:   { key: 'landmarks-day',    emoji: '🏛️', th: ['เดย์ทัวร์แลนด์มาร์กกรุงเทพ', 'เก็บจุดหลักครบในวันเดียว'], en: ['Bangkok must-visit landmarks day tour', 'The big sights in one day'] },
  palace:      { key: 'palace-ticket',    emoji: '🎟️', th: ['ตั๋วพระบรมมหาราชวัง + วัดพระแก้ว (ไม่ต้องต่อคิว)', 'จองล่วงหน้า เข้าประตูได้เลย'], en: ['Grand Palace & Emerald Buddha skip-the-line ticket', 'Book ahead, walk straight in'] },
  floating:    { key: 'floating-day',     emoji: '🛶', th: ['เดย์ทัวร์ตลาดน้ำจากกรุงเทพ', 'มีรถรับส่ง ไปเช้ากลับบ่าย'], en: ['Floating markets day tour from Bangkok', 'Hotel pickup, back by afternoon'] },
  templeTrio:  { key: 'temple-trio',      emoji: '🛕', th: ['ทัวร์ 3 วัดดัง: วัดอรุณ วัดโพธิ์ วัดไตรมิตร', 'ไกด์พาชม จบในครึ่งวัน'], en: ['Iconic temple tour: Wat Arun, Wat Pho & Wat Traimit', 'Guided, done in half a day'] },
  nightTukTuk: { key: 'night-tuktuk',     emoji: '🛺', th: ['ทัวร์ตุ๊กตุ๊กยามค่ำ วัด-ตลาด-ของกิน', 'เที่ยวเมืองเก่าตอนกลางคืน'], en: ['Night tuk-tuk tour: temples, markets & food', 'The old town after dark'] },
  ayutthaya:   { key: 'ayutthaya-fullday', emoji: '🏯', th: ['เดย์ทัวร์อยุธยาจากกรุงเทพ', 'อุทยานประวัติศาสตร์ UNESCO เต็มวัน'], en: ['Ayutthaya day tour from Bangkok', 'Full day at the UNESCO historical park'] },
  damnoen:     { key: 'damnoen-maeklong', emoji: '🚂', th: ['ดำเนินสะดวก + ตลาดร่มหุบแม่กลอง', 'สองตลาดดังจบในทริปเดียว'], en: ['Damnoen Saduak + Maeklong Railway Market', 'Two famous markets in one trip'] },
  doiSuthep:   { key: 'doisuthep-tour',   emoji: '⛰️', th: ['ทัวร์วัดพระธาตุดอยสุเทพ (ไพรเวท)', 'จุดที่ควรไปให้ได้ของเชียงใหม่'], en: ['Doi Suthep temple private tour', "Chiang Mai's essential sight"] },
  elephantCM:  { key: 'elephant-jungle', emoji: '🐘', th: ['Elephant Jungle Sanctuary', 'ให้อาหาร-อาบน้ำช้าง ไม่มีขี่ช้าง'], en: ['Elephant Jungle Sanctuary', 'Feed & bathe, no riding'] },
  doiInthanon: { key: 'doiinthanon-tour', emoji: '🏔️', th: ['เดย์ทัวร์อุทยานดอยอินทนนท์', 'หลังคาเมืองไทยจบในวันเดียว'], en: ['Doi Inthanon National Park day tour', "Thailand's rooftop in one day"] },
  cr3:         { key: 'cr-3temples',      emoji: '🛕', th: ['ทัวร์วัดร่องขุ่น-ร่องเสือเต้น-บ้านดำ', 'เดย์ทริปเชียงรายจากเชียงใหม่'], en: ['White, Blue & Black temple day tour', 'Chiang Rai day trip from Chiang Mai'] },
  pai:         { key: 'pai-day-join',     emoji: '🌄', th: ['เดย์ทัวร์ปายจากเชียงใหม่', 'ปายแคนยอน สะพานประวัติศาสตร์'], en: ['Pai day tour from Chiang Mai', 'Pai Canyon & Memorial Bridge'] },
  bigBuddha:   { key: 'bigbuddha-chalong', emoji: '🙏', th: ['ทัวร์พระใหญ่ + วัดฉลอง + เมืองเก่า', 'ไกด์พาชม 3 จุดหลักในครึ่งวัน'], en: ['Big Buddha, Wat Chalong & town guided tour', 'Three main sights in half a day'] },
  phiphiSnork: { key: 'phiphi-snorkel',   emoji: '🤿', th: ['เดย์ทริปดำน้ำตื้นเกาะพีพี', 'รวมอ่าวมาหยา-เกาะไม้ไผ่'], en: ['Phi Phi snorkeling day trip', 'Covers Maya Bay & Bamboo Island'] },
  jamesBond:   { key: 'jamesbond-longtail', emoji: '🛶', th: ['เกาะเจมส์บอนด์ด้วยเรือหางยาว', 'ล่องอ่าวพังงาแบบดั้งเดิม'], en: ['James Bond Island by longtail boat', 'Classic Phang Nga Bay route'] },
  jamesBondBig:{ key: 'jamesbond-bigboat', emoji: '🚤', th: ['เจมส์บอนด์ เรือใหญ่ + สปีดโบ๊ต', 'นั่งสบาย คลื่นน้อย'], en: ['James Bond big boat + speedboat', 'Comfier, calmer ride'] },
  khai:        { key: 'khai-phiphi-bond', emoji: '🏝️', th: ['เกาะไข่ + พีพี + เจมส์บอนด์ (สปีดโบ๊ต)', 'ฮอปปิ้งหลายเกาะในวันเดียว'], en: ['Khai Islands + Phi Phi + James Bond speedboat', 'Multi-island hop in one day'] },
  similan:     { key: 'similan-snorkel',  emoji: '🐠', th: ['ทัวร์ดำน้ำตื้นหมู่เกาะสิมิลัน', 'น้ำใสอันดับต้นของไทย (ตามฤดูกาล)'], en: ['Similan Islands snorkeling tour', 'Some of the clearest water in Thailand (seasonal)'] },
  phiphi4is:   { key: 'phiphi-4islands',  emoji: '🚤', th: ['พีพี + 4 เกาะ กระบี่ ในทริปเดียว', 'ต่อเที่ยวฝั่งกระบี่ได้เลย'], en: ['Phi Phi + Krabi 4 Islands combo', 'Pairs with the Krabi side'] },
  // krabi
  fourIslands: { key: '4islands-day',     emoji: '🏝️', th: ['เดย์ทัวร์ 4 เกาะ กระบี่', 'เกาะปอดะ-ไก่-ทับ-หาดถ้ำพระนาง'], en: ['Krabi 4 Islands day tour', 'Poda, Chicken, Tup & Phra Nang beach'] },
  fourIsLong:  { key: '4islands-longtail', emoji: '🛶', th: ['ทัวร์ 4 เกาะ เรือหางยาว (จอยทัวร์)', 'สายดำน้ำตื้น ราคาเบากว่า'], en: ['4 Islands join tour by longtail boat', 'Snorkel-focused, easier on the budget'] },
  emeraldTiger:{ key: 'emerald-tigercave', emoji: '💧', th: ['สระมรกต + น้ำตกร้อน + วัดถ้ำเสือ', 'สามจุดดังฝั่งบกจบในวันเดียว'], en: ['Emerald Pool, Hot Spring & Tiger Cave Temple', 'The three inland sights in one day'] },
  railayClimb: { key: 'railay-climbing', emoji: '🧗', th: ['คอร์สปีนผาไร่เลย์ 1 วัน', 'มีครูดูแล อุปกรณ์ครบ'], en: ['Railay rock climbing 1-day course', 'Instructor-led with full gear'] },
  // samui
  angThong:    { key: 'angthong-319',     emoji: '🏝️', th: ['เดย์ทัวร์อุทยานหมู่เกาะอ่างทอง', 'ทริปที่คนจองเยอะที่สุดจากสมุย'], en: ['Ang Thong Marine Park day tour', 'The most-booked trip from Samui'] },
  kohTao:      { key: 'kohtao-nangyuan',  emoji: '🤿', th: ['เกาะเต่า-เกาะนางยวน สปีดโบ๊ต', 'จุดดำน้ำตื้นดังที่สุดใกล้สมุย'], en: ['Koh Tao & Koh Nangyuan by speedboat', 'The best-known snorkel spots near Samui'] },
  kohTaoPha:   { key: 'kohtao-phangan',   emoji: '🐠', th: ['เกาะเต่า + นางยวน + พะงัน', 'สามเกาะในทริปเดียว'], en: ['Koh Tao, Nangyuan & Pha-ngan combo', 'Three islands in one trip'] },
  // pattaya
  sanctuary:   { key: 'sanctuary-truth',  emoji: '🏛️', th: ['ตั๋วปราสาทสัจธรรม', 'แลนด์มาร์กงานไม้ริมทะเล'], en: ['Sanctuary of Truth ticket', 'The seaside wood-carved landmark'] },
  nongNooch:   { key: 'nong-nooch',       emoji: '🌴', th: ['ตั๋วสวนนงนุช', 'สวนพฤกษศาสตร์ + โชว์วัฒนธรรม-ช้าง'], en: ['Nong Nooch Garden ticket', 'Botanical park with cultural & elephant shows'] },
  kohLarn:     { key: 'kohlarn-combo',    emoji: '🚤', th: ['เดย์ทัวร์เกาะล้าน + สัจธรรม + จุดชมวิว', 'เก็บไฮไลต์พัทยาในวันเดียว'], en: ['Koh Larn + Sanctuary + viewpoint day tour', 'Pattaya highlights in one day'] },
  artParadise: { key: 'art-in-paradise',  emoji: '🎨', th: ['ตั๋ว Art in Paradise พัทยา', 'มิวเซียมภาพ 3D ถ่ายรูปสนุกวันฝนตก'], en: ['Art in Paradise Pattaya ticket', '3D trick-art museum, great on rainy days'] },
  tiffany:     { key: 'tiffany-show',     emoji: '🎭', th: ["ตั๋วโชว์ Tiffany's พัทยา", 'คาบาเรต์เจ้าดังที่เปิดมานานที่สุด'], en: ["Tiffany's Show ticket, Pattaya", 'The longest-running cabaret in town'] },
  ramayana:    { key: 'ramayana-park',    emoji: '💦', th: ['ตั๋ว Ramayana Water Park', 'สวนน้ำใหญ่ที่สุดของไทย สไลเดอร์ 21 ตัว'], en: ['Ramayana Water Park ticket', "Thailand's biggest water park, 21 slides"] },
  // wave 9 secondary clusters
  vanaNava:    { key: 'vana-nava',        emoji: '💦', th: ['ตั๋ว Vana Nava Water Jungle หัวหิน', 'สวนน้ำใหญ่ของเมือง'], en: ['Vana Nava Water Jungle ticket, Hua Hin', "Hua Hin's big water park"] },
  santorini:   { key: 'santorini-water',  emoji: '🎡', th: ['ตั๋ว Santorini Park Waterventures', 'สวนน้ำธีมกรีซที่ชะอำ'], en: ['Santorini Park Waterventures pass', 'Greek-themed water park in Cha-am'] },
  huahinZip:   { key: 'huahin-zipline',   emoji: '🌲', th: ['ซิปไลน์หัวหิน', 'โหนสลิงในป่าใกล้เมือง'], en: ['Hua Hin zipline experience', 'Forest ziplines close to town'] },
  erawanKwai:  { key: 'erawan-kwai',      emoji: '💦', th: ['เดย์ทัวร์น้ำตกเอราวัณ + สะพานแคว', 'ไปเช้าเย็นกลับจากกรุงเทพ'], en: ['Erawan Waterfall + River Kwai day tour', 'Out and back from Bangkok'] },
  deathRail:   { key: 'death-railway',    emoji: '🚂', th: ['เดย์ทัวร์ทางรถไฟสายมรณะ + สะพานแคว', 'รวมนั่งรถไฟช่วงถ้ำกระแซ'], en: ['Death Railway + River Kwai Bridge day tour', 'Includes the Tham Krasae train ride'] },
  ayutTemples: { key: 'ayutthaya-temples', emoji: '🛕', th: ['ทัวร์วัดดังอยุธยาในวันเดียว', 'รวมเศียรพระในรากไม้วัดมหาธาตุ'], en: ['Ayutthaya must-visit temples day tour', 'Includes the Buddha head at Wat Mahathat'] },
  sukhCyc:     { key: 'sukhothai-cycling', emoji: '🚲', th: ['ปั่นจักรยานชมอุทยานประวัติศาสตร์', 'ครึ่งวัน มีไกด์นำ'], en: ['Sukhothai Historical Park cycling tour', 'Half day with a guide'] },
  sukhSun:     { key: 'sukhothai-sunset', emoji: '🌅', th: ['ปั่นชมพระอาทิตย์ตกที่สุโขทัย', 'รอบเย็น แสงสวยสุดของอุทยาน'], en: ['Sukhothai sunset cycling tour', "Evening ride in the park's best light"] },
  khaoyaiFull: { key: 'khaoyai-fullday',  emoji: '🌳', th: ['เดย์ทัวร์อุทยานแห่งชาติเขาใหญ่', 'เดินเทรล ส่องสัตว์ จากกรุงเทพ'], en: ['Khao Yai National Park full-day tour', 'Trails & wildlife, from Bangkok'] },
  kohChangSp:  { key: 'kohchang-speed',   emoji: '🚤', th: ['ทัวร์ดำน้ำตื้น 4-5 เกาะ สปีดโบ๊ต', 'รอบอุทยานทางทะเลเกาะช้าง'], en: ['4-5 island snorkel tour by speedboat', 'Around the Koh Chang marine park'] },
  kohChangKon: { key: 'kohchang-kontiki', emoji: '⛵', th: ['Kon Tiki ครูซดำน้ำตื้น', 'เรือใหญ่นั่งสบาย มีบุฟเฟต์กลางวัน'], en: ['Kon Tiki snorkeling cruise', 'Comfy big boat with lunch buffet'] },
  paiPrivate:  { key: 'pai-day-private',  emoji: '🚐', th: ['เดย์ทัวร์ปาย รถส่วนตัว', 'จัดจังหวะเองได้ เหมาะมากันเป็นกลุ่ม'], en: ['Pai private day tour', 'Your own pace — good for groups'] },
  cheowlan:    { key: 'cheowlan-day',     emoji: '🛶', th: ['เดย์ทัวร์เขื่อนเชี่ยวหลาน เรือหางยาว', 'ล่องทะเลสาบ เข้าถ้ำ กินข้าวแพกลางน้ำ'], en: ['Cheow Lan Lake day tour by longtail', 'Lake cruise, cave & floating-raft lunch'] },
  amphawaFire: { key: 'amphawa-firefly', emoji: '✨', th: ['อัมพวา + ล่องเรือดูหิ่งห้อย', 'ตลาดน้ำยามเย็น ปิดท้ายด้วยหิ่งห้อย'], en: ['Amphawa + firefly boat ride', 'Evening market, firefly cruise to finish'] },
  // wave 10
  kohSametDay: { key: 'kohsamet-day',     emoji: '🏖️', th: ['เดย์ทัวร์เกาะเสม็ด', 'เรือไป-กลับ + เที่ยวหาดทรายขาว'], en: ['Koh Samet island day tour', 'Round-trip boat + white-sand beaches'] },
  kohSamet9:   { key: 'kohsamet-9island', emoji: '🤿', th: ['ทัวร์ 9 เกาะรอบเสม็ด ดำน้ำตื้น', 'สปีดโบ๊ตเก็บหลายเกาะในวันเดียว'], en: ['Koh Samet 9-island snorkeling trip', 'Speedboat, several islands in a day'] },
  damnoenRat:  { key: 'damnoen-ratchaburi', emoji: '🛶', th: ['ตลาดน้ำดำเนินสะดวก + แลนด์มาร์กราชบุรี', 'เดย์ทัวร์ส่วนตัวจากกรุงเทพ'], en: ['Damnoen Saduak + Ratchaburi landmarks', 'Private day tour from Bangkok'] },
  // wave 11
  lipeHop:     { key: 'lipe-islandhop',   emoji: '🏝️', th: ['ทัวร์ฮอปปิ้งเกาะลีเป (เรือหางยาว)', 'ดำน้ำตื้นรอบเกาะน้ำใส'], en: ['Koh Lipe island hopping (longtail)', 'Snorkel the clear-water islands'] },
  lipeCat:     { key: 'lipe-catamaran',   emoji: '⛵', th: ['ทัวร์เกาะลีเป เรือใบคาตามารัน', 'ชม-ดำน้ำ เกาะหินงาม อาดัง ราวี'], en: ['Koh Lipe by sailing catamaran', 'Snorkel Hin Ngam, Adang & Rawi'] },
  udonClassic: { key: 'udon-classic',     emoji: '🛕', th: ['ทัวร์อุดร-หนองคาย + วัดผาตากเสื้อ', 'ไฮไลต์สองจังหวัดในวันเดียว'], en: ['Udon–Nong Khai classic tour + sky temple', 'Two-province highlights in a day'] },
  udonTemples: { key: 'udon-temples',     emoji: '🙏', th: ['เดย์ทัวร์วัดดังอุดรธานี (ส่วนตัว)', 'ไกด์พาไหว้พระจุดหลัก'], en: ['Udon Thani temples private day tour', 'Guided temple highlights'] },
  loeiCK:      { key: 'loei-chiangkhan',  emoji: '🏞️', th: ['ทัวร์เชียงคาน ถนนคนเดิน + ริมโขง', 'ไกด์ท้องถิ่นพาเที่ยว'], en: ['Chiang Khan tour: walking street & Mekong', 'With a local guide'] },
  loeiPK:      { key: 'loei-phukradueng', emoji: '⛰️', th: ['ทัวร์ภูกระดึง 3 วัน 2 คืน', 'เดินขึ้นหลังแป ชมพระอาทิตย์'], en: ['Phu Kradueng 3D2N tour', 'Hike the plateau, catch the sunrise'] },
  trangEmerald:{ key: 'trang-emerald',    emoji: '🤿', th: ['ทัวร์ถ้ำมรกต + 4 เกาะ ตรัง', 'ออกจากเกาะลันตา ว่ายเข้าถ้ำมรกต'], en: ['Emerald Cave + 4 Trang islands tour', 'Departs Koh Lanta, swim into the cave'] },
  // wave 12
  buriramKhmer:{ key: 'buriram-khmer',    emoji: '🛕', th: ['ทัวร์อารยธรรมขอมบุรีรัมย์ (2 วัน 1 คืน)', 'พนมรุ้ง เมืองต่ำ บ้านโคกเมือง'], en: ['Buriram Khmer civilization tour (2D1N)', 'Phanom Rung, Muang Tam & Ban Khok Mueang'] },
};
const BKK_ITIN = S(IT.landmarks, IT.palace, IT.floating);
const CM_ITIN  = S(IT.doiSuthep, IT.elephantCM, IT.doiInthanon);
const PKT_ITIN = S(IT.bigBuddha, IT.phiphiSnork, IT.jamesBond);
BATCHES.wave7 = {
  // bangkok (defaults + themed)
  ...mk(['bangkok-1-day-itinerary','bangkok-2d1n-itinerary','bangkok-3d2n-itinerary','bangkok-cafe-hopping-plan','bangkok-family-plan','bangkok-first-timer-guide','bangkok-nature-green-plan','bangkok-photo-spots-plan','bangkok-shopping-plan'], BKK_ITIN),
  'bangkok-old-town-temples-plan': S(IT.templeTrio, IT.palace, IT.nightTukTuk),
  'bangkok-ayutthaya-day-trip':    S(IT.landmarks, IT.palace, IT.ayutthaya),
  'bangkok-samut-songkhram-plan':  S(IT.landmarks, IT.palace, IT.damnoen),
  // chiang-mai (defaults + themed)
  ...mk(['chiang-mai-1-day-itinerary','chiang-mai-2d1n-itinerary','chiang-mai-3d2n-itinerary','chiang-mai-budget-plan','chiang-mai-cafe-hopping-plan','chiang-mai-family-plan','chiang-mai-first-timer-guide','chiang-mai-photo-spots-plan','chiang-mai-temples-culture-plan'], CM_ITIN),
  'chiang-mai-chiang-rai-4d3n':      S(IT.doiSuthep, IT.elephantCM, IT.cr3),
  'chiang-mai-doi-angkhang-road-trip': S(IT.doiInthanon, IT.doiSuthep, IT.elephantCM),
  'chiang-mai-nature-doi-plan':      S(IT.doiInthanon, IT.doiSuthep, IT.elephantCM),
  'chiang-mai-pai-loop-plan':        S(IT.doiSuthep, IT.elephantCM, IT.pai),
  // phuket (defaults + themed)
  ...mk(['phuket-1-day-itinerary','phuket-2d1n-itinerary','phuket-3d2n-itinerary','phuket-beach-plan','phuket-budget-plan','phuket-family-plan','phuket-first-timer-guide','phuket-old-town-cafe-plan','phuket-photo-spots-plan'], PKT_ITIN),
  'phuket-island-hopping-plan': S(IT.khai, IT.phiphiSnork, IT.similan),
  'phuket-krabi-plan':          S(IT.bigBuddha, IT.phiphiSnork, IT.phiphi4is),
  'phuket-phang-nga-plan':      S(IT.jamesBond, IT.jamesBondBig, IT.bigBuddha),
};

// ---- wave 8: itinerary pages for krabi / samui / pattaya ----
const KRABI_ITIN = S(IT.fourIslands, IT.emeraldTiger, IT.phiphi4is);
const SAMUI_ITIN = S(IT.angThong, IT.kohTao, IT.kohTaoPha);
const PATTAYA_ITIN = S(IT.sanctuary, IT.nongNooch, IT.kohLarn);
BATCHES.wave8 = {
  // krabi
  ...mk(['krabi-1-day-itinerary','krabi-2d1n-itinerary','krabi-3d2n-itinerary','krabi-cafe-town-plan','krabi-family-plan','krabi-first-timer-guide','krabi-nature-plan','krabi-photo-spots-plan','krabi-phuket-plan','krabi-trang-plan'], KRABI_ITIN),
  'krabi-island-plan':       S(IT.fourIslands, IT.fourIsLong, IT.phiphi4is),
  'krabi-aonang-railay-plan': S(IT.fourIslands, IT.railayClimb, IT.emeraldTiger),
  // samui
  ...mk(['samui-1-day-itinerary','samui-3d2n-itinerary','samui-4d3n-itinerary','samui-beach-hopping-plan','samui-budget-plan','samui-couple-honeymoon-plan','samui-family-plan','samui-first-timer-guide','samui-koh-phangan-plan','samui-nightlife-plan','samui-photo-spots-plan','samui-sea-island-plan'], SAMUI_ITIN),
  // pattaya
  ...mk(['pattaya-1-day-itinerary','pattaya-2d1n-itinerary','pattaya-3d2n-itinerary','pattaya-bangkok-plan','pattaya-budget-plan','pattaya-couple-plan','pattaya-first-timer-guide','pattaya-photo-spots-plan'], PATTAYA_ITIN),
  'pattaya-koh-larn-day-trip': S(IT.kohLarn, IT.sanctuary, IT.nongNooch),
  'pattaya-family-plan':       S(IT.nongNooch, IT.ramayana, IT.artParadise),
  'pattaya-nightlife-plan':    S(IT.tiffany, IT.sanctuary, IT.kohLarn),
  'pattaya-rainy-day-plan':    S(IT.artParadise, IT.tiffany, IT.nongNooch),
};

// ---- wave 9: itinerary pages for secondary clusters (auto-discovered per cluster) ----
// applies the SAME signature triple to every itinerary page in the cluster; partial
// (1-2 item) triples leave the remaining slots on search links.
const ARTDIR = path.join(import.meta.dirname, '..', 'astro/src/content/articles');
const itinFiles = (cluster) => fs.readdirSync(ARTDIR)
  .filter(f => f.endsWith('.json'))
  .filter(f => { const j = JSON.parse(fs.readFileSync(path.join(ARTDIR, f), 'utf8')); return j.type === 'itinerary' && j.cluster === cluster; })
  .map(f => f.replace('.json', ''));
const clusterItin = (cluster, items) => mk(itinFiles(cluster), items);
BATCHES.wave9 = {
  ...clusterItin('huahin',              S(IT.vanaNava, IT.santorini, IT.huahinZip)),
  ...clusterItin('prachuap-khiri-khan', S(IT.vanaNava)),
  ...clusterItin('chonburi',            S(IT.sanctuary, IT.nongNooch, IT.kohLarn)),
  ...clusterItin('phang-nga',           S(IT.jamesBond, IT.jamesBondBig, IT.similan)),
  ...clusterItin('ayutthaya',           S(IT.ayutthaya, IT.ayutTemples)),
  ...clusterItin('kanchanaburi',        S(IT.erawanKwai, IT.deathRail)),
  ...clusterItin('sukhothai',           S(IT.sukhCyc, IT.sukhSun)),
  ...clusterItin('trat',                S(IT.kohChangSp, IT.kohChangKon)),
  ...clusterItin('mae-hong-son',        S(IT.pai, IT.paiPrivate)),
  ...clusterItin('samut-songkhram',     S(IT.damnoen, IT.amphawaFire)),
  ...clusterItin('chiang-rai',          S(IT.cr3)),
  ...clusterItin('khao-yai',            S(IT.khaoyaiFull)),
  ...clusterItin('nakhon-ratchasima',   S(IT.khaoyaiFull)),
  ...clusterItin('surat-thani',         S(IT.cheowlan, IT.kohTao, IT.angThong)),
};

// ---- wave 10: rayong (koh samet) + ratchaburi (damnoen) — attractions + itineraries ----
BATCHES.wave10 = {
  ...clusterItin('rayong', S(IT.kohSametDay, IT.kohSamet9)),
  'koh-samet-guide':    S(IT.kohSametDay, IT.kohSamet9),
  'koh-samet-beaches':  S(IT.kohSametDay, IT.kohSamet9),
  'rayong-attractions': S(IT.kohSametDay, IT.kohSamet9),
  ...clusterItin('ratchaburi', S(IT.damnoenRat, IT.damnoen)),
  'damnoen-saduak-floating-market': S(IT.damnoenRat, IT.damnoen),
  'ratchaburi-attractions':         S(IT.damnoenRat, IT.damnoen),
};

// ---- wave 11: satun / udon-thani / nong-khai / loei / trang (attractions + itineraries) ----
BATCHES.wave11 = {
  // satun — Koh Lipe
  'koh-lipe':                S(IT.lipeHop, IT.lipeCat),
  'koh-hin-ngam-koh-adang':  S(IT.lipeCat, IT.lipeHop),
  'satun-attractions':       S(IT.lipeHop, IT.lipeCat),
  'tarutao-national-park':   S(IT.lipeCat, IT.lipeHop),
  ...clusterItin('satun', S(IT.lipeHop, IT.lipeCat)),
  // udon-thani
  'udon-attractions':        S(IT.udonClassic, IT.udonTemples),
  ...clusterItin('udon-thani', S(IT.udonClassic, IT.udonTemples)),
  // nong-khai (Udon–Nong Khai classic tour includes the "temple in heaven" = Wat Pha Tak Suea)
  'nong-khai-attractions':   S(IT.udonClassic),
  'wat-pha-tak-suea':        S(IT.udonClassic),
  ...clusterItin('nong-khai', S(IT.udonClassic)),
  // loei
  'loei-attractions':            S(IT.loeiCK),
  'chiang-khan-walking-street':  S(IT.loeiCK),
  'chiang-khan-skywalk':         S(IT.loeiCK),
  'phu-thok-chiang-khan':        S(IT.loeiCK),
  'kaeng-khut-khu':              S(IT.loeiCK),
  'phu-kradueng-national-park-guide': S(IT.loeiPK),
  ...clusterItin('loei', S(IT.loeiCK, IT.loeiPK)),
  // trang — Emerald Cave / islands (tour departs Koh Lanta, visits Trang islands)
  'emerald-cave-koh-mook':   S(IT.trangEmerald),
  'koh-kradan':              S(IT.trangEmerald),
  'koh-cheuk':               S(IT.trangEmerald),
  'trang-island-hopping':    S(IT.trangEmerald),
  'trang-attractions':       S(IT.trangEmerald),
  ...clusterItin('trang', S(IT.trangEmerald)),
};

// ---- wave 12: buriram (Khmer heritage) ----
BATCHES.wave12 = {
  'phanom-rung-historical-park': S(IT.buriramKhmer),
  'phanom-rung-sun-alignment':   S(IT.buriramKhmer),
  'prasat-muang-tam':            S(IT.buriramKhmer),
  'buriram-attractions':         S(IT.buriramKhmer),
  ...clusterItin('buriram', S(IT.buriramKhmer)),
};

const batchName = process.argv[2];
const apply = process.argv.includes('--apply');
const batch = BATCHES[batchName];
if (!batch) { console.error('unknown batch:', batchName, '— available:', Object.keys(BATCHES).join(', ')); process.exit(1); }

const ROOT = path.join(import.meta.dirname, '..');
let edits = 0, files = 0, problems = 0;

for (const [name, items] of Object.entries(batch)) {
  for (const lang of ['th', 'en']) {
    const p = path.join(ROOT, 'astro/src/content', lang === 'th' ? 'articles' : 'articles-en', name + '.json');
    if (!fs.existsSync(p)) { console.error('✗ MISSING FILE', p); problems++; continue; }
    const raw = fs.readFileSync(p, 'utf8');
    const j = JSON.parse(raw);
    const b = (j.blocks || []).find(x => x.kind === 'experiences' || x.kind === 'foodexp');
    if (!b) { console.error('✗ NO experiences/foodexp block', name, lang); problems++; continue; }
    let touched = false;
    for (const it of items) {
      const item = b.items[it.i];
      if (!item) { console.error(`✗ ${name} [${lang}] item ${it.i} missing`); problems++; continue; }
      if (item.provider !== 'Klook') { console.error(`✗ ${name} [${lang}] item ${it.i} is ${item.provider}, not Klook — skip`); problems++; continue; }
      if (!item.href.includes('/search/')) { console.log(`• ${name} [${lang}] item ${it.i} already deep-linked — skip`); continue; }
      const slug = CATALOG[it.key];
      if (!slug) { console.error(`✗ unknown catalog key ${it.key}`); problems++; continue; }
      const [label, note] = lang === 'th' ? it.th : it.en;
      console.log(`${name} [${lang}] item ${it.i}:`);
      console.log(`   - ${item.label} | ${decodeURIComponent(item.href).slice(0, 90)}`);
      console.log(`   + ${label} | ${deep(slug).slice(0, 90)}`);
      if (apply) {
        item.emoji = it.emoji; item.label = label; item.note = note; item.href = deep(slug);
      }
      touched = true; edits++;
    }
    if (apply && touched) {
      const out = JSON.stringify(j, null, 2) + (raw.endsWith('\n') ? '\n' : '');
      fs.writeFileSync(p, out);
      files++;
    }
  }
}
console.log(`\n${apply ? 'APPLIED' : 'DRY-RUN'}: ${edits} item edits · ${files} files written · problems: ${problems}`);
if (problems) process.exit(1);

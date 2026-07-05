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
    const b = (j.blocks || []).find(x => x.kind === 'experiences');
    if (!b) { console.error('✗ NO experiences block', name, lang); problems++; continue; }
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

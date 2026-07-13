export const meta = {
  name: 'kids-attractions',
  description: 'Write TH+EN attraction articles for 27 famous ethical kid/family attractions across Thailand (water parks, aquariums, open zoos, dinosaur museums, theme/edu parks) so the kids guides can link real, articled places. Region-hero fallback images. One writer per attraction; TH/EN block structure kept identical (gated after).',
  phases: [{ title: 'Write', detail: 'one attraction writer per place' }],
}

// list inlined (workflow scripts have no fs); each agent gets its assignment directly
const LIST = [
  ['chiang-mai-night-safari','chiang-mai','เชียงใหม่ไนต์ซาฟารี','Chiang Mai Night Safari','drive-through night zoo + tram safari; ethical open enclosures'],
  ['grand-canyon-water-park-chiang-mai','chiang-mai','แกรนด์แคนยอน วอเตอร์พาร์ค เชียงใหม่','Grand Canyon Water Park Chiang Mai','cliff-jump quarry + aqua park, Hang Dong'],
  ['pongyang-jungle-coaster-chiang-mai','chiang-mai','ปางยาง จังเกิ้ล โคสเตอร์ & ซิปไลน์','Pongyang Jungle Coaster & Zipline','jungle roller-coaster + zipline + cafe, Mae Rim'],
  ['singha-park-chiang-rai','chiang-rai','สิงห์ปาร์ค เชียงราย','Singha Park Chiang Rai','tea-estate, giraffe/zebra meadow, cycling, balloons'],
  ['art-in-paradise-chiang-mai','chiang-mai','อาร์ตอินพาราไดซ์ เชียงใหม่','Art in Paradise Chiang Mai','3D illusion art museum, indoor rainy-day'],
  ['phu-wiang-dinosaur-museum-khon-kaen','khon-kaen','พิพิธภัณฑ์ไดโนเสาร์ภูเวียง ขอนแก่น','Phu Wiang Dinosaur Museum','real dinosaur fossils, first Thai dino site'],
  ['korat-zoo-nakhon-ratchasima','nakhon-ratchasima','สวนสัตว์นครราชสีมา (โคราชซู)','Nakhon Ratchasima Zoo (Korat Zoo)','large ethical open zoo + safari tram'],
  ['nong-khai-aquarium','nong-khai','สถานแสดงพันธุ์สัตว์น้ำหนองคาย','Nong Khai Aquarium','Mekong-fish aquarium, tunnel tank'],
  ['khon-kaen-science-park','khon-kaen','อุทยานวิทยาศาสตร์ขอนแก่น','Khon Kaen Science Park','hands-on science for kids'],
  ['safari-world-bangkok','bangkok','ซาฟารีเวิลด์ กรุงเทพ','Safari World Bangkok','drive-through safari + marine park, Ramindra'],
  ['sea-life-bangkok-ocean-world','bangkok','ซีไลฟ์ แบงคอก โอเชียนเวิลด์','SEA LIFE Bangkok Ocean World','aquarium under Siam Paragon, ocean tunnel'],
  ['kidzania-bangkok','bangkok','คิดส์ซาเนีย กรุงเทพ','KidZania Bangkok','role-play city for kids, Siam Paragon'],
  ['ancient-city-muang-boran-samut-prakan','samut-prakan','เมืองโบราณ สมุทรปราการ','Ancient City (Muang Boran)','open-air Thailand-in-miniature, cycling'],
  ['siam-amazing-park-bangkok','bangkok','สยาม อะเมซิ่ง พาร์ค','Siam Amazing Park','theme park + water park, Min Buri'],
  ['cartoon-network-amazone-pattaya','chonburi','การ์ตูนเน็ตเวิร์ค อเมโซน พัทยา','Cartoon Network Amazone Waterpark','cartoon-themed water park, Pattaya'],
  ['ramayana-water-park-pattaya','chonburi','รามายณะ วอเตอร์พาร์ค พัทยา','Ramayana Water Park','one of Asia’s biggest water parks, Pattaya'],
  ['nong-nooch-tropical-garden-pattaya','chonburi','สวนนงนุช พัทยา','Nong Nooch Tropical Garden','botanical garden + dinosaur valley (focus garden/dino, not animal shows)'],
  ['khao-kheow-open-zoo-chonburi','chonburi','สวนสัตว์เปิดเขาเขียว','Khao Kheow Open Zoo','large ethical open zoo, feed animals, night tour'],
  ['columbia-pictures-aquaverse-pattaya','chonburi','โคลัมเบีย พิคเจอร์ส อควาเวิร์ส','Columbia Pictures Aquaverse','movie-themed water park, Pattaya'],
  ['vana-nava-water-jungle-hua-hin','prachuap-khiri-khan','วานา นาวา วอเตอร์จังเกิ้ล หัวหิน','Vana Nava Water Jungle Hua Hin','largest water park in the area, Hua Hin'],
  ['black-mountain-water-park-hua-hin','prachuap-khiri-khan','แบล็คเมาน์เทน วอเตอร์พาร์ค หัวหิน','Black Mountain Water Park','water park with wave pool + lazy river, Hua Hin'],
  ['mallika-city-1905-kanchanaburi','kanchanaburi','มัลลิกา ร.ศ.124 กาญจนบุรี','Mallika City R.E.124','living-history old-Siam village, costumes'],
  ['phuket-aquarium','phuket','สถานแสดงพันธุ์สัตว์น้ำภูเก็ต','Phuket Aquarium','aquarium at Cape Panwa, ocean tunnel'],
  ['andamanda-phuket','phuket','อันดามันดา ภูเก็ต','Andamanda Phuket','large themed water park, Kathu'],
  ['blue-tree-phuket','phuket','บลูทรี ภูเก็ต','Blue Tree Phuket','lagoon water park + cliff jump'],
  ['splash-jungle-water-park-phuket','phuket','สแปลช จังเกิ้ล วอเตอร์พาร์ค ภูเก็ต','Splash Jungle Water Park','water park near the airport, Mai Khao'],
  ['songkhla-aquarium','songkhla','สถานแสดงพันธุ์สัตว์น้ำสงขลา','Songkhla Aquarium','aquarium in Songkhla, ocean tunnel'],
]

const SPEC = `เขียนไฟล์ 2 ไฟล์: astro/src/content/articles/<slug>.json (ไทย) + astro/src/content/articles-en/<slug>.json (อังกฤษ)
อ่านแบบอย่างโครง schema จาก astro/src/content/articles/aiyerweng-skywalk.json ก่อน (type=attraction) แล้วทำตามคีย์เดียวกัน
ฟิลด์: slug,type:"attraction",cluster:"<cluster>",title,metaDesc,ogTitle,ogDesc,crumbCity(ชื่อจังหวัด),crumbCityHref:"city-<cluster>.html",eyebrow,h1,heroEmoji,heroImg:"/images/heroes/<hero>.jpg",intro,chips(3-4 แท็กสั้น),readTime,blocks,faq(3-4),related,quickAnswerHtml
⚠️ blocks: ให้ใช้โครงเรียบง่าย+เหมือนกันเป๊ะทั้ง TH/EN (kind เรียงเหมือนกัน): [p, h2, p, list, tip, h2, list, tip, cta]
  - p=เกริ่นว่าที่นี่คืออะไร ทำไมเด็ก/ครอบครัวชอบ · h2 "ไฮไลต์สำหรับเด็ก" + list เครื่องเล่น/โซน/สัตว์/จุดเด่น · tip เคล็ดลับพาเด็ก (ช่วงเวลา/ของเตรียม)
  - h2 "ข้อมูลก่อนไป" + list (เวลาเปิด-ปิด · ค่าเข้าโดยประมาณ · การเดินทาง · เหมาะเด็กวัยไหน) · tip ความปลอดภัย/ความคุ้ม · cta ปิดท้าย
related: [{label,href:"city-<cluster>.html"},{label,href:"top10-hotels-<cluster>.html"}] (ทั้งคู่มีจริง)
⚠️ ต้อง WebSearch เช็กก่อนเขียน: ที่นี่มีจริง+ยังเปิด, เวลา/ค่าเข้าคร่าวๆ, และประเด็น "จริยธรรมสัตว์" — ถ้ามีโชว์สัตว์/ที่ถกเถียง ให้เขียนตามจริงแบบเป็นกลาง เน้นประสบการณ์เด็ก ไม่เชียร์เกินจริง ไม่แนะนำขี่ช้าง/โชว์เสือ
กติกา: โทน v2-clean · ห้ามคำ AI ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก/สุดยอด/อันซีน · honesty · ห้าม dark patterns · EN ห้ามมีอักษรไทยหลุด (ยกเว้น ฿)`

phase('Write')
const results = await parallel(LIST.map(([slug, cluster, th, en, note]) => () =>
  agent(
`คุณคือนักเขียนบทความที่เที่ยว ThailandAddict (TH+EN) เขียนบทความ "ที่เที่ยวเด็ก/ครอบครัว": ${th} (${en}) — ${note}
cluster="${cluster}" · hero="${cluster}" · slug="${slug}"
${SPEC}
เขียนไฟล์ให้ครบทั้ง 2 ภาษา แล้วตอบสั้น ๆ ว่าเช็กอะไรมาบ้าง (เปิดอยู่ไหม/ค่าเข้า/ประเด็นจริยธรรม)`,
    { label: `kid:${slug.slice(0, 26)}`, phase: 'Write' }
  ).then(() => ({ slug, ok: true })).catch(e => ({ slug, ok: false, err: String(e) }))
))
log('Kid attractions: ' + results.filter(Boolean).filter(r => r.ok).length + '/' + LIST.length + ' written · fails: ' + (results.filter(Boolean).filter(r => !r.ok).map(r => r.slug).join(', ') || 'none'))
return { jobs: results.filter(Boolean) }

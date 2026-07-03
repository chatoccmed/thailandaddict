import fs from 'fs';
const B = '/images/food/saphan-taksin/';
const HERO = {
  file: 'saphan-taksin-hero.jpg',
  th: 'ภาพ: อาสนวิหารอัสสัมชัญ อาคารอิฐแดงย่านบางรัก · Philip Nalangan / Wikimedia (CC BY 4.0)',
  en: 'Photo: Assumption Cathedral, the red-brick landmark of Bang Rak · Philip Nalangan / Wikimedia (CC BY 4.0)',
  href: 'https://commons.wikimedia.org/wiki/File:Assumption_Cathedral_Bangkok_Thailand3.jpg',
};
// keyed by rank (no-social cards)
const IMG = {
  2: { file: 'sathorn-central-pier-riverview.jpg',
    th: 'ภาพ: ท่าเรือสาทร (Central Pier) ริมแม่น้ำเจ้าพระยา · David McKelvey / Wikimedia (CC BY 2.0)',
    en: 'Photo: Sathorn (Central) Pier on the Chao Phraya River · David McKelvey / Wikimedia (CC BY 2.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Sathorn_Pier,_Chao_Phraya_River,_Bangkok_(6906973408).jpg' },
  4: { file: 'holy-rosary-church.jpg',
    th: 'ภาพ: โบสถ์กาลหว่าร์ (Holy Rosary Church) ตลาดน้อย · Supanut Arunoprayote / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: Holy Rosary Church (Wat Kalawar), Talat Noi · Supanut Arunoprayote / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Holy_Rosary_Church_-_Day.jpg' },
  5: { file: 'old-customs-house.jpg',
    th: 'ภาพ: อาคารศุลกสถาน (Old Customs House) เจริญกรุง บางรัก · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    en: 'Photo: The Old Customs House, Charoen Krung, Bang Rak · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Old_Customs_House,_Bang_Rak_(I).jpg' },
  6: { file: 'east-asiatic-french-embassy.jpg',
    th: 'ภาพ: อาคารอีสต์เอเชียทีค ริมแม่น้ำเจ้าพระยา บางรัก · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    en: 'Photo: The East Asiatic Company Building on the Bang Rak riverfront · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:East_Asiatic_Building_07.23.jpg' },
  7: { file: 'authors-lounge-mandarin-oriental.jpg',
    th: "ภาพ: Authors' Lounge โรงแรมแมนดาริน โอเรียนเต็ล กรุงเทพฯ · Chainwit. / Wikimedia (CC BY-SA 4.0)",
    en: "Photo: The Authors' Lounge at the Mandarin Oriental Bangkok · Chainwit. / Wikimedia (CC BY-SA 4.0)",
    href: "https://commons.wikimedia.org/wiki/File:The_Authors%27_Lounge,_Mandarin_Oriental_Bangkok_(Feb_2022)_-_img_01.jpg" },
  9: { file: 'san-chao-rong-kueak.jpg',
    th: 'ภาพ: ศาลเจ้าโรงเกือก (San Chao Rong Kueak) ตลาดน้อย · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    en: 'Photo: Rong Kuak Shrine (San Chao Rong Kueak), Talat Noi · Supanut Arunoprayote / Wikimedia (CC BY 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Rong_Kuak_Shrine_06.23.jpg' },
};

for (const [path, isEn] of [
  ['astro/src/content/articles/top10-attractions-saphan-taksin.json', false],
  ['astro/src/content/articles-en/top10-attractions-saphan-taksin.json', true],
]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found)'); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file;
  a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) {
    if (b.kind === 'restaurant' && IMG[b.rank]) {
      b.libImg = B + IMG[b.rank].file;
      b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th;
      b.libCreditHref = IMG[b.rank].href;
      n++;
    }
  }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged');
}

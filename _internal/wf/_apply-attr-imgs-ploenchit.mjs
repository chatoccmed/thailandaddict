import fs from 'fs';
const B = '/images/food/ploenchit/';
const HERO = { file: 'ploenchit-hero.jpg',
  th: 'ภาพ: บ้านปาร์คนายเลิศ เรือนไม้สักกับสกายไลน์เพลินจิต · Chainwit. / Wikimedia (CC BY-SA 4.0)',
  en: 'Photo: Nai Lert Park Heritage Home teak house against the Ploenchit skyline · Chainwit. / Wikimedia (CC BY-SA 4.0)',
  href: 'https://commons.wikimedia.org/wiki/File:Nai_Lert_Park_Heritage_Home_-_skyline_and_cafe.jpg' };
const IMG = {
  2: { file: 'chao-mae-tuptim-shrine.jpg',
    th: 'ภาพ: ศาลเจ้าแม่ทับทิม (ศาลปลัดขิก) หลังสวิสโซเทลนายเลิศพาร์ค · Ddalbiez / Wikimedia (CC BY-SA 3.0)',
    en: 'Photo: Chao Mae Tuptim phallic shrine behind Swissotel Nai Lert Park · Ddalbiez / Wikimedia (CC BY-SA 3.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Chao_Mae_Tuptim-003.jpg' },
  5: { file: 'wireless-road-embassy-walk.jpg',
    th: 'ภาพ: ถนนวิทยุ ย่านสถานทูต · Sry85 / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: Wireless Road (Thanon Witthayu) embassy district streetscape · Sry85 / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Thanon_Witthayu_2018-9-23.jpg' },
  9: { file: 'ruamrudee-little-india.jpg',
    th: 'ภาพ: โบสถ์พระมหาไถ่ ซอยร่วมฤดี ย่านลิตเติลอินเดีย · Iloilo Wanderer / Wikimedia (CC BY-SA 4.0)',
    en: 'Photo: Holy Redeemer Church on Soi Ruamrudee, the Little India area · Iloilo Wanderer / Wikimedia (CC BY-SA 4.0)',
    href: 'https://commons.wikimedia.org/wiki/File:Holy_Redeemer_Church_Bangkok.JPG' },
};
for (const [path, isEn] of [
  ['astro/src/content/articles/top10-attractions-ploenchit.json', false],
  ['astro/src/content/articles-en/top10-attractions-ploenchit.json', true],
]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (not found)'); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file;
  a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) {
    if (b.kind === 'restaurant' && IMG[b.rank]) {
      b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++;
    }
  }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero + ' + n + ' cards');
}

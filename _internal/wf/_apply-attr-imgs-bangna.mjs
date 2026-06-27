import fs from 'fs';
const B = '/images/food/bangna/';
const HERO = { file: 'bangna-hero.jpg', th: 'ภาพแทนย่าน: สะพานภูมิพล (สะพานวงแหวนอุตสาหกรรม) ข้ามแม่น้ำเจ้าพระยายามพระอาทิตย์ตก รอยต่อบางนา-สมุทรปราการ · Mike Behnken / Wikimedia (CC BY 2.0)', en: 'Representative: Bhumibol Bridge (Industrial Ring Road Bridge) over the Chao Phraya at sunset, on the Bang Na/Samut Prakan edge · Mike Behnken / Wikimedia (CC BY 2.0)', href: 'https://commons.wikimedia.org/wiki/File:Bhumibol_Bridge_Sunset_-_Bangkok_(5020676079).jpg' };
const IMG = {};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-bangna.json', false], ['astro/src/content/articles-en/top10-attractions-bangna.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged');
}

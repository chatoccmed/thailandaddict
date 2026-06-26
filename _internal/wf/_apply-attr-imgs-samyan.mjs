import fs from 'fs';
const B = '/images/food/samyan/';
const HERO = { file: 'samyan-hero.jpg', th: 'ภาพ: อาคารจามจุรีสแควร์ (แลนด์มาร์กหัวมุมสามย่าน) · Kosin Tara / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Chamchuri Square tower (Sam Yan landmark) · Kosin Tara / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:CHAMCHURI_SQUARE.jpg' };
const IMG = {
  10: { file: 'brahma-shrine.jpg', th: 'ภาพแทน: เทวรูปพระพรหมสี่หน้า (ศาลท้าวมหาพรหม เอราวัณ) · Kosin Tara / Wikimedia (CC BY-SA 4.0)', en: 'Representative: Four-faced Brahma statue (Erawan Shrine) · Kosin Tara / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Lord_Brahma_Shrine_of_Erawan_Hotel_(11).jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-samyan.json', false], ['astro/src/content/articles-en/top10-attractions-samyan.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 10)');
}

import fs from 'fs';
const B = '/images/food/ratchathewi/';
const HERO = { file: 'ratchathewi-hero.jpg', th: 'ภาพ: เส้นขอบฟ้าใบหยกทาวเวอร์ 2 ย่านประตูน้ำ-ราชเทวี · Paolobon140 / Wikimedia (CC0)', en: 'Photo: Baiyoke Tower II skyline (Pratunam-Ratchathewi) · Paolobon140 / Wikimedia (CC0)', href: 'https://commons.wikimedia.org/wiki/File:The_Baiyoke_Tower_II_in_Bangkok,_Thailand.jpg' };
const IMG = {
  1: { file: 'victory-monument.jpg', th: 'ภาพ: อนุสาวรีย์ชัยสมรภูมิ · Adam Carr / Wikimedia (Public Domain)', en: 'Photo: Victory Monument · Adam Carr / Wikimedia (Public Domain)', href: 'https://commons.wikimedia.org/wiki/File:Victory_Monument,_Bangkok.JPG' },
  6: { file: 'baiyoke-sky.jpg', th: 'ภาพ: ใบหยกสกาย · Khaosaming / Wikimedia (CC BY-SA 3.0)', en: 'Photo: Baiyoke Sky · Khaosaming / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:Baiyoke_Tower_II_Bangkok_Thailand.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-ratchathewi.json', false], ['astro/src/content/articles-en/top10-attractions-ratchathewi.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 1/6)');
}

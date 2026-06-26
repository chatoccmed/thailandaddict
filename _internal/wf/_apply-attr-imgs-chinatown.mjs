import fs from 'fs';
const B = '/images/food/chinatown/';
const HERO = { file: 'chinatown-hero.jpg', th: 'ภาพ: ซุ้มประตูเฉลิมพระเกียรติ (ประตูไชน่าทาวน์ เยาวราช) · Photogoddle / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Chinatown Gate (Odeon Circle, Yaowarat) · Photogoddle / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Chinatown_Gate,_Bangkok.jpg' };
const IMG = {
  3: { file: 'yaowarat-road-night.jpg', th: 'ภาพ: ถนนเยาวราชยามค่ำคืน (ไฟนีออน-แสงไฟรถ) · yeowatzup / Wikimedia (CC BY 2.0)', en: 'Photo: Yaowarat Road at night (neon & light trails) · yeowatzup / Wikimedia (CC BY 2.0)', href: 'https://commons.wikimedia.org/wiki/File:Thanon_Yaowarat,_Bangkok,_Thailand_(4245968169).jpg' },
  6: { file: 'sampheng-market.jpg', th: 'ภาพแทน: ตรอกตลาดสำเพ็ง (ย่านการค้าไชน่าทาวน์) · Vyacheslav Argenberg / Wikimedia (CC BY 4.0)', en: 'Representative: Sampeng Lane market (Chinatown) · Vyacheslav Argenberg / Wikimedia (CC BY 4.0)', href: "https://commons.wikimedia.org/wiki/File:Sampeng_Lane,_Bangkok's_Chinatown,_Bangkok,_Thailand.jpg" },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-chinatown.json', false], ['astro/src/content/articles-en/top10-attractions-chinatown.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 3/6)');
}

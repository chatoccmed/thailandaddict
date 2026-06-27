import fs from 'fs';
const B = '/images/food/pinklao/';
const HERO = { file: 'pinklao-hero.jpg', th: 'ภาพ: เรือพระที่นั่งสุพรรณหงส์ (พิพิธภัณฑสถานแห่งชาติ เรือพระราชพิธี บางกอกน้อย) · S.narongphan / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Royal Barge Suphannahong (Royal Barges National Museum, Bangkok Noi) · S.narongphan / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Royal_Barge_Suphannahong.jpg' };
const IMG = {
  8: { file: 'wat-amarintharam.jpg', th: 'ภาพ: วัดอมรินทรารามวรวิหาร (บางกอกน้อย) · กสิณธร ราชโอรส / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Wat Amarintharam Worawihan (Bangkok Noi) · Kasindhon Rajoros / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:(2023)_%E0%B8%A7%E0%B8%B1%E0%B8%94%E0%B8%AD%E0%B8%A1%E0%B8%A3%E0%B8%B4%E0%B8%99%E0%B8%97%E0%B8%A3%E0%B8%B2%E0%B8%A3%E0%B8%B2%E0%B8%A1%E0%B8%A7%E0%B8%A3%E0%B8%A7%E0%B8%B4%E0%B8%AB%E0%B8%B2%E0%B8%A3_%E0%B9%80%E0%B8%82%E0%B8%95%E0%B8%9A%E0%B8%B2%E0%B8%87%E0%B8%81%E0%B8%AD%E0%B8%81%E0%B8%99%E0%B9%89%E0%B8%AD%E0%B8%A2_%E0%B8%81%E0%B8%A3%E0%B8%B8%E0%B8%87%E0%B9%80%E0%B8%97%E0%B8%9E%E0%B8%A1%E0%B8%AB%E0%B8%B2%E0%B8%99%E0%B8%84%E0%B8%A3_(1).jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-pinklao.json', false], ['astro/src/content/articles-en/top10-attractions-pinklao.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 8)');
}

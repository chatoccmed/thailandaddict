import fs from 'fs';
const B = '/images/food/silom-sathorn/';
const HERO = { file: 'silom-cityscape.jpg', th: 'ภาพ: ตึก King Power Mahanakhon (ย่านสีลม-สาทร) · Bienvenue en Thaïlande / Wikimedia (CC0)', en: 'Photo: King Power Mahanakhon (Silom-Sathorn) · Bienvenue en Thaïlande / Wikimedia (CC0)', href: 'https://commons.wikimedia.org/wiki/File:King_Power_MahaNakhon_et_autres_immeubles.jpg' };
const IMG = {
  2: { file: 'lumpini-park.jpg', th: 'ภาพ: สวนลุมพินี (วิวทะเลสาบ-เส้นขอบฟ้าสีลม-สาทร) · Jarcje / Wikimedia (CC BY-SA 3.0)', en: 'Photo: Lumpini Park (lake & Silom-Sathorn skyline) · Jarcje / Wikimedia (CC BY-SA 3.0)', href: 'https://commons.wikimedia.org/wiki/File:Lumpini_Park,_Bangkok,_Thailand_Silom-Sathorn_CBD.JPG' },
  10: { file: 'mr-kukrit-home.jpg', th: 'ภาพ: บ้าน ม.ร.ว.คึกฤทธิ์ ปราโมช · Johan Fantenberg / Wikimedia (CC BY-SA 2.0)', en: "Photo: M.R. Kukrit's Heritage Home · Johan Fantenberg / Wikimedia (CC BY-SA 2.0)", href: 'https://commons.wikimedia.org/wiki/File:M.R._Kukrit%E2%80%99s_Heritage_Home_(6980958709).jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-silom-sathorn.json', false], ['astro/src/content/articles-en/top10-attractions-silom-sathorn.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (ranks 2/10)');
}

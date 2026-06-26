import fs from 'fs';
const B = '/images/food/phrom-phong/';
const HERO = { file: 'phrom-phong-hero.jpg', th: 'ภาพ: เส้นขอบฟ้ากรุงเทพฯ มองจาก EmQuartier ย่านพร้อมพงษ์ · Slyronit / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Bangkok skyline from EmQuartier, Phrom Phong · Slyronit / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Bangkok_Skyline_from_Emquartier,_Phrom_Phong.jpg' };
const IMG = {
  4: { file: 'benjasiri-park.jpg', th: 'ภาพ: สวนเบญจสิริยามเย็น · Sry85 / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Benjasiri Park at evening · Sry85 / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Benjasiri_park_at_evening.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-phrom-phong.json', false], ['astro/src/content/articles-en/top10-attractions-phrom-phong.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 4)');
}

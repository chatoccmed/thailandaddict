import fs from 'fs';
const B = '/images/food/thong-lo/';
const HERO = { file: 'thong-lo-cityscape.jpg', th: 'ภาพ: รถไฟฟ้า BTS เหนือถนนสุขุมวิท (ย่านทองหล่อ-เอกมัย) · calflier001 (Stephen Mason) / Wikimedia (CC BY-SA 2.0)', en: 'Photo: BTS Skytrain over Sukhumvit Road (Thong Lo–Ekkamai) · calflier001 (Stephen Mason) / Wikimedia (CC BY-SA 2.0)', href: 'https://commons.wikimedia.org/wiki/File:SUKHUMVIT_SKYTRAIN_BANGKOK_THAILAND_JAN_2012_(7017074673).jpg' };
const IMG = {
  10: { file: 'sukhumvit-street-food.jpg', th: 'ภาพ: แผงสตรีทฟู้ดริมถนนสุขุมวิท (ภาพแทนบรรยากาศ ไม่ใช่ซอย 38 โดยตรง) · ProtoplasmaKid / Wikimedia (CC BY-SA 4.0)', en: 'Photo: Street-food stalls along Sukhumvit Road (representative stand-in, not Soi 38 itself) · ProtoplasmaKid / Wikimedia (CC BY-SA 4.0)', href: 'https://commons.wikimedia.org/wiki/File:Puestos_de_venta_en_Sukhumvit_Road_1.jpg' },
};
for (const [path, isEn] of [['astro/src/content/articles/top10-attractions-thong-lo.json', false], ['astro/src/content/articles-en/top10-attractions-thong-lo.json', true]]) {
  if (!fs.existsSync(path)) { console.log((isEn ? 'EN' : 'TH') + ': SKIP (file not found) ' + path); continue; }
  const a = JSON.parse(fs.readFileSync(path, 'utf8'));
  a.image = B + HERO.file; a.heroImg = B + HERO.file; a.heroCredit = isEn ? HERO.en : HERO.th; a.heroCreditHref = HERO.href;
  let n = 0;
  for (const b of a.blocks) { if (b.kind === 'restaurant' && IMG[b.rank]) { b.libImg = B + IMG[b.rank].file; b.libCredit = isEn ? IMG[b.rank].en : IMG[b.rank].th; b.libCreditHref = IMG[b.rank].href; n++; } }
  fs.writeFileSync(path, JSON.stringify(a, null, 2) + '\n');
  JSON.parse(fs.readFileSync(path, 'utf8'));
  console.log((isEn ? 'EN' : 'TH') + ': hero=' + HERO.file + ' + ' + n + ' cards imaged (rank 10)');
}

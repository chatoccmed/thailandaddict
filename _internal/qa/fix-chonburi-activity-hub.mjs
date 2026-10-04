/* activities-chonburi was snapshotted in all seven locales after the
   translation memory was built, so four reader-visible nodes stayed English:
   a card excerpt and three chrome lines. Every other activity hub per locale
   measures at 0–2 English words (brand names); this one carried 12.

   Whole-node replacement of the exact English, the province named with the
   canonical form from _internal/homepage-i18n/<lang>.json ({CB}), and the same
   pairs written into tm.<lang>.json so the next localize.mjs run keeps them.
   One-off; idempotent (a second run finds no English node). */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const APPLY = !process.argv.includes('--dry');
const FILE = 'activities-chonburi.html';

const EN = {
  intro: 'Say Chonburi and many people think of Pattaya first, but the Chonburi-town side itself — Bang Saen, Si Racha, Koh Sichang, Ang Sila, all t…',
  acts: 'See all activities in Chonburi →',
  where: '🏨 Where to stay in Chonburi',
  stays: 'See all stays in Chonburi →',
};
const TR = {
  zh: {
    intro: '一提到{CB}，很多人首先想到芭堤雅，但{CB}市区这一侧本身——邦盛、是拉差、西昌岛、安诗拉，全都…',
    acts: '查看{CB}的全部活动 →', where: '🏨 {CB}住哪里', stays: '查看{CB}的全部住宿 →',
  },
  ru: {
    intro: 'Скажи «{CB}» — и многие сразу вспомнят Паттайю, но сама городская сторона {CB} — Бангсэн, Сирача, остров Сичанг, Ангсила — всё это…',
    acts: 'Все активности в {CB} →', where: '🏨 Где остановиться в {CB}', stays: 'Все отели в {CB} →',
  },
  ko: {
    intro: '{CB}라고 하면 많은 사람이 파타야부터 떠올리지만, {CB} 시내 쪽 자체도 — 방생, 시라차, 꼬시창, 앙실라까지 모두…',
    acts: '{CB}의 모든 액티비티 보기 →', where: '🏨 {CB}에서 묵을 곳', stays: '{CB}의 모든 숙소 보기 →',
  },
  ja: {
    intro: '{CB}と聞くと多くの人がまずパタヤを思い浮かべますが、{CB}の市街側そのもの——バンセーン、シーラーチャー、シーチャン島、アーンシラー——はどれも…',
    acts: '{CB}のアクティビティをすべて見る →', where: '🏨 {CB}でどこに泊まる？', stays: '{CB}の宿をすべて見る →',
  },
  hi: {
    intro: '{CB} का नाम सुनते ही ज़्यादातर लोग पहले पटाया के बारे में सोचते हैं, लेकिन {CB} शहर वाला हिस्सा भी — बांग सेन, सी राचा, को सीचांग, आंग सिला — सब…',
    acts: '{CB} की सभी गतिविधियाँ देखें →', where: '🏨 {CB} में कहाँ ठहरें', stays: '{CB} में ठहरने के सभी विकल्प देखें →',
  },
  he: {
    intro: 'כשאומרים {CB} רבים חושבים קודם על פטאיה, אבל צד העיר {CB} עצמו — באנג סאן, סי ראצ\'ה, קו סיצ\'אנג, אנג סילה — כולם…',
    acts: 'לכל הפעילויות ב{CB} →', where: '🏨 איפה ללון ב{CB}', stays: 'לכל מקומות הלינה ב{CB} →',
  },
  ar: {
    intro: 'عند ذكر {CB} يفكر كثيرون في باتايا أولًا، لكن جانب مدينة {CB} نفسه — بانغ سان وسي راتشا وجزيرة كو سيتشانغ وأنغ سيلا — كلها…',
    acts: 'عرض كل الأنشطة في {CB} →', where: '🏨 أين تقيم في {CB}', stays: 'عرض كل أماكن الإقامة في {CB} →',
  },
};

const save = (p, text) => {
  fs.writeFileSync(p + '.tmp', text, 'utf8');
  if (fs.readFileSync(p + '.tmp', 'utf8') !== text) { console.error('readback mismatch: ' + p); process.exit(1); }
  fs.renameSync(p + '.tmp', p);
};

for (const [lang, t] of Object.entries(TR)) {
  const cb = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8')).prov.chonburi.n;
  const p = path.join(ROOT, 'astro/public', lang, FILE);
  let html = fs.readFileSync(p, 'utf8');
  const tmPath = path.join(ROOT, '_internal/i18n', 'tm.' + lang + '.json');
  const tm = JSON.parse(fs.readFileSync(tmPath, 'utf8'));
  let hits = 0;
  for (const k of Object.keys(EN)) {
    const to = t[k].split('{CB}').join(cb);
    const from = '>' + EN[k] + '<';
    const n = html.split(from).length - 1;
    if (n) { html = html.split(from).join('>' + to + '<'); hits += n; }
    tm[EN[k]] = to;
  }
  console.log(`  ${lang}  ${cb}  ·  ${hits} node(s)` + (APPLY ? '' : ' (dry)'));
  if (APPLY) { if (hits) save(p, html); save(tmPath, JSON.stringify(tm, null, 2) + '\n'); }
}

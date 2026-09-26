/* The 21 season strings sync-season-cards.mjs cannot resolve, because neither
   map has ever held them.

   Three are month ranges. The other eighteen are the seasonal-haze notice on
   the northern hubs — "Chiang Mai is in the North — Feb–Apr can bring seasonal
   haze (high PM2.5). Check air quality before you go…" — which gen-hubs builds
   by interpolating the province name into the sentence. That makes a separate
   dictionary key per province, which is why a flat EN→translation map never
   caught it and why it has been English in all seven locales: a health notice,
   on eighteen pages a locale, for readers who cannot read the Thai one.

   The English strings are read from the English hubs rather than rebuilt here,
   so the keys match gen-hubs byte for byte. The province name inside each one
   is replaced with the name that locale already uses for it.

   Usage: node _internal/qa/translate-season-leftovers.mjs [--apply] */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '../..');
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];
const APPLY = process.argv.includes('--apply');

const MONTHS = {
  'Nov–Feb': { zh: '11月–2月', ru: 'Ноя–фев', ko: '11월–2월', ja: '11月〜2月', hi: 'नवंबर–फ़रवरी', he: 'נוב׳–פבר׳', ar: 'نوفمبر–فبراير' },
  'Mar–May': { zh: '3月–5月', ru: 'Мар–май', ko: '3월–5월', ja: '3月〜5月', hi: 'मार्च–मई', he: 'מרץ–מאי', ar: 'مارس–مايو' },
  'Jun–Oct': { zh: '6月–10月', ru: 'Июн–окт', ko: '6월–10월', ja: '6月〜10月', hi: 'जून–अक्टूबर', he: 'יוני–אוק׳', ar: 'يونيو–أكتوبر' },
};

/* {n} is the province, in the reader's language. Korean avoids the topic
   particle because the right one depends on the last letter of the name. */
const HAZE = {
  zh: '{n}位于泰国北部——2月至4月可能出现季节性烟霾（PM2.5 偏高）。出行前请查看空气质量，并减少高强度的户外活动。',
  ru: '{n} находится на севере — с февраля по апрель возможен сезонный смог (высокий PM2.5). Проверь качество воздуха перед поездкой и не перегружай себя активностями на улице.',
  ko: '{n} — 태국 북부 지역입니다. 2~4월에는 계절성 연무(높은 PM2.5)가 생길 수 있어요. 떠나기 전에 대기질을 확인하고 격한 야외 활동은 줄이세요.',
  ja: '{n}は北部にあり、2〜4月は季節的な煙霧（PM2.5が高め）が出ることがあります。出発前に大気の状態を確認し、激しい屋外活動は控えめにしてください。',
  hi: '{n} उत्तरी थाईलैंड में है — फ़रवरी से अप्रैल तक मौसमी धुंध (ज़्यादा PM2.5) हो सकती है। जाने से पहले हवा की गुणवत्ता देख लें और ज़्यादा मेहनत वाली बाहरी गतिविधियाँ कम रखें।',
  he: '{n} נמצאת בצפון — בין פברואר לאפריל עלול להיות ערפיח עונתי (PM2.5 גבוה). בדקו את איכות האוויר לפני הנסיעה והפחיתו פעילות גופנית מאומצת בחוץ.',
  ar: 'تقع {n} في الشمال — وقد يظهر ضباب دخاني موسمي بين فبراير وأبريل (ارتفاع PM2.5). تحقّق من جودة الهواء قبل السفر وخفّف من الأنشطة الخارجية الشاقة.',
};

/* Pai is a district, so it is not in the 77-province name file. */
const PAI = { zh: '拜县', ru: 'Пай', ko: '빠이', ja: 'パーイ', hi: 'पाई', he: 'פאי', ar: 'باي' };

/* the exact English sentences, straight off the English hubs */
const WARN = /<div class="seas-warn">⚠️ ([^<]*)<\/div>/g;
const EN_DIR = path.join(ROOT, 'astro/public/en');
const hazeByProvince = new Map();   /* slug → the English sentence */
for (const f of fs.readdirSync(EN_DIR).filter((x) => x.startsWith('city-') && x.endsWith('.html'))) {
  const src = fs.readFileSync(path.join(EN_DIR, f), 'utf8');
  for (const m of src.matchAll(WARN)) {
    if (!/ is in the North — /.test(m[1])) continue;
    hazeByProvince.set(f.replace(/^city-|\.html$/g, ''), m[1]);
  }
}
console.log(`${hazeByProvince.size} northern hubs carry the haze notice: ${[...hazeByProvince.keys()].join(' ')}\n`);
if (!hazeByProvince.size) { console.error('no haze notices found — has the markup changed?'); process.exit(1); }

const save = (p, text) => {
  fs.writeFileSync(p + '.tmp', text, 'utf8');
  if (fs.readFileSync(p + '.tmp', 'utf8') !== text) { console.error('readback mismatch: ' + p); process.exit(1); }
  fs.renameSync(p + '.tmp', p);
};

for (const lang of LANGS) {
  const dictPath = path.join(ROOT, '_internal/hub-i18n', lang + '.json');
  const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));
  const places = JSON.parse(fs.readFileSync(path.join(ROOT, '_internal/homepage-i18n', lang + '.json'), 'utf8'));
  const prov = places.prov || {};

  let added = 0, noName = [];
  for (const [en, byLang] of Object.entries(MONTHS)) { if (dict[en] === undefined) { dict[en] = byLang[lang]; added++; } }
  for (const [slug, en] of hazeByProvince) {
    const name = (prov[slug] && prov[slug].n) || (slug === 'pai' ? PAI[lang] : '');
    if (!name) { noName.push(slug); continue; }
    const value = HAZE[lang].replace('{n}', name);
    /* Two keys, because two callers look this sentence up with different text
       in front of it. gen-hubs interpolates the name BEFORE calling tx(), and
       on a Chinese page that name is already 清迈 — so the key it searches for
       is "清迈 is in the North — …", and an entry filed under the English name
       never matches. The localize.mjs snapshots walked the English DOM and do
       carry "Chiang Mai is in the North — …". Both are real lookups. */
    for (const key of [en, en.replace(/^.*? is in the North — /, name + ' is in the North — ')]) {
      if (dict[key] === undefined) { dict[key] = value; added++; }
    }
  }
  if (APPLY && added) save(dictPath, JSON.stringify(dict, null, 2) + '\n');
  console.log(`  ${lang}  +${added} key(s)` + (noName.length ? `  · no localised name for: ${noName.join(' ')}` : '')
    + (APPLY ? '' : '  (dry run)'));
}

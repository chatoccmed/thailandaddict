export const meta = {
  name: 'translate-home-names-7lang',
  description: 'Fill destNames, regionName, regionIntro, editorRole and editorBio in the 7 locale homepage copy tables',
  phases: [{ title: 'Fill' }],
};

/* Four things still read English on a locale homepage, each because there was
   nowhere for a translation to live until now:
     · 12 tourism destinations — homepage-i18n has all 77 provinces and none of
       these, and they are the deck tabs and the planner's own dropdown
     · the six regions, name and intro sentence
     · the editor's job title and bio — ~40 words of English sat under a
       Japanese heading
   The keys now exist in en.json and th.json. This fills them. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Simplified Hanzi', notes: 'Use the place names Chinese travellers actually use (苏梅岛, 拜县, 芭提雅, 华欣…), not ad-hoc transliterations.' },
  ru: { name: 'Russian', script: 'Cyrillic', notes: 'Use the established Russian forms (Самуи, Пай, Паттайя, Хуахин, Ко Чанг…).' },
  ko: { name: 'Korean', script: 'Hangul', notes: 'Use the forms Korean travel sites use (코사무이, 빠이, 파타야, 후아힌…).' },
  ja: { name: 'Japanese', script: 'Katakana for place names', notes: 'Use the standard Japanese forms (サムイ島, パーイ, パタヤ, ホアヒン, カオヤイ…).' },
  hi: { name: 'Hindi', script: 'Devanagari', notes: 'Transliterate place names into Devanagari as Indian travel sites do.' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', notes: 'Use the Hebrew forms Israeli travel sites use. Do not add RTL/LRM marks.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', notes: 'Modern Standard Arabic. Do not add RTL/LRM marks.' },
};

function prompt(lang) {
  const L = LANG_META[lang];
  const f = `${ROOT}\\_internal\\shell\\build\\home-copy\\${lang}.json`;
  return `Add five missing entries to the ThailandAddict homepage copy table for **${L.name} (${lang})**.

Read the English contract: ${ROOT}\\_internal\\shell\\build\\home-copy\\en.json
Read the Thai original:    ${ROOT}\\_internal\\shell\\build\\home-copy\\th.json
Read and EDIT in place:    ${f}

You personally do this with Read + Edit/Write. Do NOT delegate or spawn sub-agents.

ADD exactly these five keys to ${lang}.json, matching en.json's shapes key for key:

1. "destNames" — an object of 12 slugs to place names. These are real, well-known
   destinations, so use the form travellers in your language actually use, not a
   letter-by-letter transliteration. ${L.notes}
   Slugs, with the English name: koh-phangan (Koh Phangan), hat-yai (Hat Yai),
   samui (Koh Samui), pai (Pai), pattaya (Pattaya), huahin (Hua Hin),
   khao-yai (Khao Yai), koh-chang (Koh Chang), koh-lipe (Koh Lipe),
   koh-kood (Koh Kood), koh-mak (Koh Mak), koh-larn (Koh Larn).
   Cross-check against ${ROOT}\\_internal\\homepage-i18n\\${lang}.json — its "prov"
   object holds 77 province names already translated into your language. Match
   that file's conventions exactly, so the deck and the footer never disagree
   about how a place is spelled.

2. "regionName" — the six regions keyed n, ne, c, e, w, s. English uses
   "Northern Thailand", "Isan (Northeast)", "Central Thailand", "Eastern Thailand",
   "Western Thailand", "Southern Thailand". The same file's "regions" object has
   short forms already translated — stay consistent with them.

3. "regionIntro" — the six one-sentence region descriptions, same keys. These are
   in en.json. Keep them one sentence, evocative but concrete, and keep every
   fact. Do not add urgency, superlatives the English does not have, or a
   disclaimer.

4. "editorRole" — the site editor's job title. English: "Editor-in-Chief & Founder".

5. "editorBio" — his biography, in en.json under editorBio. He is a real person:
   a doctor who has travelled widely and founded this site. Translate it as a
   short professional bio. Keep every claim exactly as the English makes it —
   invent no credentials, no country count, no specialism.

RULES
  · Change nothing else in the file. Every existing key keeps its current value.
  · The result must be valid JSON with the same key set as en.json.
  · Natural ${L.name} (${L.script}) — how a native travel editor writes, not a
    machine.
  · Brand names stay Latin: Thailandaddict, Agoda, Booking.com, Trip.com.

Return one line: {"lang":"${lang}","added":5}.`;
}

phase('Fill');
const out = await parallel(LANGS.map((lang) => () =>
  agent(prompt(lang), { label: `names:${lang}`, phase: 'Fill', effort: 'high' })
    .then(() => ({ lang, ok: true }))
    .catch((e) => ({ lang, ok: false, err: String(e).slice(0, 120) }))
));
return { langs: LANGS.length, ok: out.filter((r) => r && r.ok).length, failed: out.filter((r) => !r || !r.ok).map((r) => r && r.lang) };

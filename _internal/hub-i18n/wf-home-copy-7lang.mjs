export const meta = {
  name: 'translate-home-copy-7lang',
  description: 'Translate the 116-key planner-first homepage copy table into the 7 remaining Tier-1 languages',
  phases: [
    { title: 'Translate', detail: 'one agent per language, whole copy table' },
    { title: 'Review', detail: 'a second native-register pass over the long-form entries' },
  ],
};

/* _internal/shell/build/home-copy/en.json is the contract. Seven more files
   beside it, same keys, same shapes, and the homepage exists in nine languages.

   The page already speaks all nine everywhere else — chrome, footer, language
   menu and the 30 city hubs come from chrome.mjs and ui.<lang>.json — so these
   translations have an established voice to match, not to invent. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Simplified Hanzi', register: 'Ctrip / Mafengwo', notes: 'Mainland Chinese travel-product register. Simplified characters only.' },
  ru: { name: 'Russian', script: 'Cyrillic', register: 'a Russian travel service', notes: 'Informal "ты" register, matching the rest of the site. Transliterate Thai place names phonetically.' },
  ko: { name: 'Korean', script: 'Hangul', register: 'Yanolja / Klook Korean', notes: 'Natural Korean travel-product register, 해요체 for UI copy.' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', register: 'a Japanese travel site', notes: 'Katakana for Thai place names. Warm and direct, not stiff keigo.' },
  hi: { name: 'Hindi', script: 'Devanagari', register: 'MakeMyTrip / Goibibo', notes: 'Natural Hindi in Devanagari. No stray Thai-script fragments.' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', register: 'a modern Israeli travel site', notes: 'Modern Hebrew. The page renders dir="rtl" — do NOT add RTL/LRM marks and do NOT reverse arrows or punctuation by hand.' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', register: 'a modern Arabic travel site', notes: 'Modern Standard Arabic. The page renders dir="rtl" — do NOT add RTL/LRM marks and do NOT reverse arrows or punctuation by hand.' },
};

const SPEC = `
THE FILE
  Read  ${ROOT}\\_internal\\shell\\build\\home-copy\\en.json   (the contract)
  Also read ${ROOT}\\_internal\\shell\\build\\home-copy\\th.json — the Thai original.
  Where English and Thai differ in tone, the Thai is the house voice; English is
  a translation of it. Match the Thai's directness, not English politeness.

STRUCTURE — non-negotiable
  · Exactly the same keys as en.json. No additions, no omissions, no renames.
  · tier, tierShort, tierSr are objects keyed '1-day','2d1n','3d2n','4plus' —
    keep those keys verbatim, translate only the values.
  · tierSr values are screen-reader suffixes appended to tierShort (en: ", 1 night").
    Keep them as suffixes that read correctly after the short label, and keep the
    empty strings empty.
  · faq is an array of exactly 3 two-element arrays: [question, answer].
  · Output must be valid JSON that parses.

PLACEHOLDERS — these are code, not words
  {p} = a destination name · {n} = a number · {d} = a number or a date.
  Every placeholder in a value must appear in your translation, spelled exactly,
  unchanged. You may move it to wherever the sentence needs it — that is the
  point of translating rather than substituting — but never translate, duplicate
  or drop one. Keys carrying placeholders: showLabel, shStay, shEat, shSee,
  tlStay, tlEat, tlSee, updated, inventory, regionCount, regionCountTowns.

KEEP VERBATIM
  · Every emoji (🔖, ＋ …) and every arrow (→) exactly where it is.
  · newsPh — it is the literal example address you@example.com.
  · Brand names: Thailandaddict, Agoda, Booking.com, Trip.com, Google.
  · Every number, price, duration, month name and distance in answerP and faq —
    these are facts about Thailand, not phrasing. "1 hour 20 minute flight" stays
    1 hour 20 minutes. "November to April" stays November to April.
  · footTag is the site's tagline. ${ROOT}\\astro\\src\\i18n\\ui.<lang>.json already
    holds it under footer.tagline in your language — read that file and REUSE the
    existing wording rather than inventing a second one.

REGISTER
  This is interface copy for a travel planner, not prose. Short, concrete,
  confident. Buttons read like buttons. Headings read like headings.
  Never write a disclaimer the English does not have — no "we did not visit",
  no "collected from reviews", no hedging. The site's rule is confident and
  honest, never self-undermining.
  Never add urgency or scarcity — no "hurry", no "limited", no countdowns.
  Do not claim the site compares prices FOR the reader; it links out so the
  reader can compare. "fine" and "statsNote" in particular are honesty notes:
  keep them honest and keep them modest.

ZERO TOLERANCE
  · No English words left in prose, except the brand names listed above.
  · No Thai script anywhere.
  · No machine-translation artefacts — read your own output as a native speaker
    would and fix anything that reads like a machine wrote it.`;

function translatePrompt(lang) {
  const L = LANG_META[lang];
  const dst = `${ROOT}\\_internal\\shell\\build\\home-copy\\${lang}.json`;
  return `Translate the ThailandAddict homepage copy table into **${L.name} (${lang})**.

Write the result to: ${dst}

You personally do this with Read + Write. Do NOT delegate or spawn sub-agents.
${SPEC}

LANGUAGE
  Target: ${L.name}, ${L.script}.
  Register: the way ${L.register} writes its own interface.
  ${L.notes}

Write the file now, then verify it parses as JSON and has exactly the same key
set as en.json. Return one line: {"lang":"${lang}","keys":<number of top-level keys>}.`;
}

function reviewPrompt(lang) {
  const L = LANG_META[lang];
  const f = `${ROOT}\\_internal\\shell\\build\\home-copy\\${lang}.json`;
  return `You are a native ${L.name} travel-content editor reviewing interface copy
for thailandaddict.com before it ships to readers.

Read ${f} and the English contract ${ROOT}\\_internal\\shell\\build\\home-copy\\en.json.

Fix, in place with Edit or Write, anything that a native reader would notice:
  · phrasing that reads like machine translation
  · a heading or button that is too long for a button, or too vague to act on
  · register slips — over-formal, over-casual, or inconsistent between entries
  · the long entries especially: h1, lead, answerP, the three faq answers,
    newsLead, statsNote, fine, localOnly
  · any English or Thai fragment left behind
  · any {p} {n} {d} placeholder that was translated, duplicated or dropped
  · any number, month or duration that drifted from the English

Do NOT restructure the file, rename keys, or change anything that is already
good. If a value is correct, leave it exactly as it is.

Return one line of JSON: {"lang":"${lang}","changed":<how many values you edited>,"notes":"<one sentence>"}.`;
}

phase('Translate');
const out = await pipeline(
  LANGS,
  (lang) => agent(translatePrompt(lang), { label: `copy:${lang}`, phase: 'Translate', effort: 'high' })
    .then(() => lang).catch(() => null),
  (lang) => (lang
    ? agent(reviewPrompt(lang), { label: `review:${lang}`, phase: 'Review', effort: 'high' })
        .then((r) => ({ lang, reviewed: true, r: String(r).slice(0, 200) }))
        .catch(() => ({ lang, reviewed: false }))
    : Promise.resolve(null))
);

const done = out.filter(Boolean);
return { langs: LANGS.length, produced: done.length, detail: done };

export const meta = {
  name: 'translate-home-runtime-7lang',
  description: 'Fill rt (30 browser-rendered strings) and pills (26 activity labels) in the 7 locale homepage copy tables',
  phases: [{ title: 'Fill' }],
};

/* Two blocks were still a th/en ternary inside the generator:

   · "rt" — the strings the plan preview writes in the BROWSER. Everything a
     reader sees after they press the button lives here: "Building the plan…",
     "Day 1", "Keep this", "%n stops · guide times %a–%b". In seven languages
     the page was translated up to the moment it became useful, and English
     from there on.
   · "pills" — the 26 activity chips under "Browse by what you want to do".

   Both now live in the copy table. This fills them. */

const ROOT = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict';
const LANGS = ['zh', 'ru', 'ko', 'ja', 'hi', 'he', 'ar'];

const LANG_META = {
  zh: { name: 'Chinese (Simplified)', script: 'Simplified Hanzi', register: 'Ctrip / Mafengwo' },
  ru: { name: 'Russian', script: 'Cyrillic', register: 'a Russian travel service, informal "ты"' },
  ko: { name: 'Korean', script: 'Hangul', register: 'Yanolja / Klook Korean, 해요체' },
  ja: { name: 'Japanese', script: 'mixed kanji/kana', register: 'a Japanese travel site, warm and direct' },
  hi: { name: 'Hindi', script: 'Devanagari', register: 'MakeMyTrip / Goibibo' },
  he: { name: 'Hebrew', script: 'Hebrew (RTL)', register: 'a modern Israeli travel site' },
  ar: { name: 'Arabic', script: 'Arabic (RTL)', register: 'a modern Arabic travel site' },
};

function prompt(lang) {
  const L = LANG_META[lang];
  const f = `${ROOT}\\_internal\\shell\\build\\home-copy\\${lang}.json`;
  return `Add two missing blocks to the ThailandAddict homepage copy table for **${L.name} (${lang})**.

Read the English contract: ${ROOT}\\_internal\\shell\\build\\home-copy\\en.json
Read the Thai original:    ${ROOT}\\_internal\\shell\\build\\home-copy\\th.json
Read and EDIT in place:    ${f}

You personally do this with Read + Edit/Write. Do NOT delegate or spawn sub-agents.

ADD exactly two keys, matching en.json's shapes key for key:

1. "rt" — 30 strings the trip planner renders in the reader's browser, AFTER
   they pick a destination and press the button. This is the part of the page
   that does the work, so it has to read like a product someone shipped in your
   language, not like a translated label.

   🚨 THE %-TOKENS ARE CODE. Each one is replaced with a value at runtime:
        %n a count · %p a place · %d days · %a and %b clock times · %g a gap
        %s a guide title · %e a date · %t a trip name or tier · %h a tier list
   Every token in an English value MUST appear in your translation, spelled
   exactly, and you may move it to wherever your grammar needs it. Never
   translate a token, never drop one, never invent one. Some values also carry
   an arrow → — keep it.

   Notes on the trickier ones:
     · "hr" and "min" are appended to a number (" hr" → " 時間"), so keep any
       leading space your language needs and keep them SHORT.
     · "ago0"/"ago1"/"agoN" are "today" / "yesterday" / "%n days ago".
     · "saveOff" is the button before saving, "saveOn" after — they must be
       clearly different at a glance.
     · "legMethod" says the gap between stops is a clock gap from the guide,
       NOT a travel time. Keep that distinction; it is an honesty note.
     · "missTier" tells the reader we have a plan, but not in the length they
       asked for. Keep it plain and non-apologetic.

2. "pills" — 26 activity chips, keyed by slug, under "Browse by what you want to
   do". They sit in small chips, so keep them SHORT — match the English length,
   two or three words at most. Three are proper names and stay recognisable:
   michelin-guide-thailand-2026, bars-50-best-bangkok, best-of-thailand-2026.

RULES
  · Change nothing else in the file. Every existing key keeps its current value.
  · Valid JSON, same key set as en.json.
  · Natural ${L.name} (${L.script}) — how ${L.register} writes its own interface.
  · No urgency, no scarcity, no disclaimer the English does not have.
  · Brand names stay Latin: Thailandaddict, Agoda, Booking.com, Trip.com, Michelin.

Write it, then verify the file parses and that every %-token in en.json's rt
appears in yours. Return one line: {"lang":"${lang}","rt":30,"pills":26}.`;
}

phase('Fill');
const out = await parallel(LANGS.map((lang) => () =>
  agent(prompt(lang), { label: `runtime:${lang}`, phase: 'Fill', effort: 'high' })
    .then(() => ({ lang, ok: true })).catch((e) => ({ lang, ok: false, err: String(e).slice(0, 120) }))
));
return { langs: LANGS.length, ok: out.filter((r) => r && r.ok).length, failed: out.filter((r) => !r || !r.ok).map((r) => r && r.lang) };

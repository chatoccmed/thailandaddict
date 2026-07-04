export const meta = {
  name: 'fix-article-en-thai-leaks',
  description: 'Translate untranslated Thai dish/food blurbs in 33 article EN twins to natural English (zero raw-Thai). Mostly michelin group-hubs.',
  phases: [{ title: 'Translate', detail: '33 EN files, 1 agent each' }],
}
const FILES = ["michelin-ayutthaya","michelin-bib-gourmand-thailand","michelin-chiang-mai","michelin-chinese-thai-food","michelin-chon-buri","michelin-cuisines-ranked","michelin-desserts-snacks-thailand","michelin-fine-dining-thailand","michelin-isan-food","michelin-khon-kaen","michelin-nakhon-pathom","michelin-nakhon-ratchasima","michelin-nonthaburi","michelin-noodles-thailand","michelin-northern-thai-food","michelin-pathum-thani","michelin-phang-nga","michelin-phuket","michelin-provinces-ranked","michelin-seafood-thailand","michelin-southern-thai-food","michelin-starred-thailand","michelin-street-food-thailand","michelin-surat-thani","michelin-thai-cuisine","michelin-thailand-2027-what-to-expect","michelin-thailand-by-budget","michelin-thailand-how-to-book","michelin-ubon-ratchathani","michelin-udon-thani","michelin-yaowarat-chinatown-crawl","top10-popular-restaurants-chiang-mai","vegan-vegetarian-thailand"];
const S = { type: 'object', additionalProperties: false, required: ['file', 'fixed', 'remainingThai'], properties: {
  file: { type: 'string' }, fixed: { type: 'boolean' }, remainingThai: { type: 'number' }, note: { type: 'string' } } };

phase('Translate')
const PROMPT = (f) => [
  `Fix the ENGLISH twin of an article for thailandaddict.com — it contains untranslated Thai strings that must become natural English.`,
  `FILE TO EDIT: astro/src/content/articles-en/${f}.json`,
  `TH REFERENCE (read only, do NOT edit): astro/src/content/articles/${f}.json`,
  ``,
  `TASK: find EVERY string containing Thai characters in the EN file and translate it to natural English IN PLACE.`,
  `These are mostly dish names / food descriptions (e.g. in blocks[].items[].blurb): "ไข่เจียวปู" -> "Crab omelette", "แกงเขียวหวานลูกชิ้นปลากราย" -> "Green curry with fish-ball (pla krai)", "ก๋วยเตี๋ยวเรือ" -> "Boat noodles".`,
  `For proper restaurant / place names, ROMANIZE fully (e.g. "เจ๊ไฝ" -> "Jay Fai", "เยาวราช" -> "Yaowarat"). The EN file must end with ZERO Thai characters (the baht symbol U+0E3F is allowed).`,
  ``,
  `RULES: keep JSON valid; keep ALL keys and array lengths identical to the current EN file; keep every non-Thai field unchanged; keep the keywords field; match the concise factual tone of the rest of the EN file; do NOT add or drop items; do NOT touch the TH file.`,
  `VERIFY before returning: re-read the EN file, JSON.parse it, and count remaining Thai characters (regex /[ก-๛]/, i.e. Thai block excluding the baht symbol) — the count must be 0.`,
  ``,
  `Return: {file:"${f}", fixed:true if you edited it, remainingThai:<Thai-char count after your edit>, note:<short>}`,
].join('\n');

const res = await parallel(FILES.map(f => () =>
  agent(PROMPT(f), { label: 'en:' + f, phase: 'Translate', schema: S })
    .catch(e => ({ file: f, fixed: false, remainingThai: -1, note: 'err ' + String(e) }))
))
return { results: res }

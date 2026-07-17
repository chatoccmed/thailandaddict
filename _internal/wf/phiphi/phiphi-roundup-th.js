export const meta = {
  name: 'phiphi-roundup-th',
  description: 'Generate the Koh Phi Phi hotel roundup (TH) grounded in the 8 verified Phi Phi reviews',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top8-railay-hotels-krabi.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

phase('Generate')
const s = {
  slug: 'top8-phi-phi-hotels-krabi', cityTH: 'กระบี่', cityHub: 'city-krabi.html', zoneTH: 'เกาะพีพี (Koh Phi Phi Don)', n: 8,
  angle: 'โรงแรมเกาะพีพี กระบี่ ครบทุกงบและทุกโซนของเกาะ — ตั้งแต่รีสอร์ตหรูริมอ่าวเงียบอย่าง SAii ที่อ่าวโละบาเกา ไปจนถึงบังกะโลไม้ริมหาดคุ้มราคาที่หาดยาว/โละมูดี ทั้งเกาะไม่มีรถยนต์ เข้าถึงด้วยเรือเท่านั้น จุดเด่นคือดำน้ำดูปะการัง เที่ยวอ่าวมาหยา/เกาะพีพีเล และวิวหน้าผาหินปูน — เรียงอันดับ "ตามคะแนนรีวิวจริงของผู้เข้าพัก" ซึ่งบนพีพี ที่พักที่คนรักที่สุดมักเป็นบังกะโลริมหาดชิลๆ ที่เข้ากับจังหวะเกาะ มากกว่ารีสอร์ตใหญ่ที่ราคาสูงกว่า',
  transport: 'เกาะพีพีไม่มีถนน/รถยนต์ เข้าได้ด้วยเรือเฟอร์รี่จากภูเก็ต กระบี่ หรืออ่าวนาง (~1.5-2 ชม.) มาลงที่ท่าเรือต้นไทร (Tonsai Pier) จากนั้นต่อเรือหางยาว/เรือรีสอร์ตไปยังหาดของคุณ · โซนต้นไทร-โละดาลัม = หมู่บ้านหลัก เดินเที่ยว ร้านอาหาร ชีวิตกลางคืนคึกคัก · แหลมตง โละบาเกา หาดยาว โละมูดี = เงียบสงบ ต้องต่อเรือ เหมาะพักผ่อน/ฮันนีมูน · หาดยาวเดินเลียบชายฝั่งไปต้นไทรได้ตอนน้ำลง',
}
const out = await agent(
  `You are an expert Thai hotel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY hotel sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly — it is a proven Krabi/island roundup): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} hotels, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 of the source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool hotel (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}→{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first) — Paradise Pearl and Viking (both 8.9 beachfront/nature bungalows) genuinely top the list. FRAME THIS HONESTLY: make the intro + #1/#2 storyHtml explain that these are the highest guest-satisfaction, best-value island stays; and clearly signpost SAii Phi Phi Island Village as THE top LUXURY pick (5★, afor honeymooners), Phi Phi Holiday Resort as the best FAMILY pick, Phi Phi Island Cabana as the best LOCATION (2-min from Tonsai Pier, famous pool view) despite its lower guest score. Each entry's storyHtml must state who it is best for + honest drawbacks. Cabana (6.7) and Bayview (7.0): frame honestly as location/value picks with basic rooms, not overhyped. toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include เกาะพีพี + กระบี่ + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 hotel's img.
4. breadcrumb: ThailandAddict → 🇹🇭 ไทย (country-thailand.html) → กระบี่ (city-krabi.html) → this roundup. navReviewHref=${s.slug}.html.
5. faq 4-5 (how to get to Phi Phi / boat access, which beach to pick — party village vs quiet, luxury vs budget, best time to go, is Phi Phi worth staying overnight), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง"/"ไม่ได้ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
  { label: `gen:${s.slug}`, phase: 'Generate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { out }

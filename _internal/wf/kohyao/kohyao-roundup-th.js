export const meta = {
  name: 'kohyao-roundup-th',
  description: 'Generate the Koh Yao hotel roundup (TH, top 10) grounded in the verified Koh Yao reviews',
  phases: [{ title: 'Generate' }],
}
const REPO = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict'
const TEMPLATE = REPO + '\\astro\\src\\content\\roundups\\top9-koh-lanta-hotels-krabi.json'
const POOLDIR = REPO + '\\_internal\\wf\\roundup-pools'
const OUTDIR = REPO + '\\astro\\src\\content\\roundups'
const REVDIR = REPO + '\\astro\\src\\content\\reviews'

phase('Generate')
const s = {
  slug: 'top10-koh-yao-hotels-phang-nga', cityTH: 'พังงา', cityHub: 'city-phang-nga.html', zoneTH: 'เกาะยาว (Koh Yao Noi & Yai)', n: 10,
  angle: 'โรงแรมเกาะยาว พังงา — เกาะยาวน้อยและเกาะยาวใหญ่ คู่เกาะเงียบสงบกลางอ่าวพังงา ระหว่างภูเก็ตกับกระบี่ ที่ยังคงวิถีชุมชนประมงมุสลิมแท้ๆ ไม่มีชีวิตกลางคืนวุ่นวาย เหมาะพักผ่อน ฮันนีมูน และหนีความพลุกพล่าน · ตั้งแต่รีสอร์ตหรูระดับตำนานอย่าง Six Senses และ Treehouse Villas (ผู้ใหญ่เท่านั้น) ไปจนถึงบังกะโลไม้ริมหาดคุ้มราคา — เรียงอันดับตามคะแนนรีวิวจริงของผู้เข้าพัก',
  transport: 'เกาะยาวเข้าถึงด้วยเรือเท่านั้น — นั่งเรือหางยาว/สปีดโบ๊ทจากท่าเรือบางโรง (ภูเก็ต) หรือท่าเรือทับละมุ/อ่าวนาง (กระบี่) ~30-45 นาที มาลงที่ท่าเรือของแต่ละเกาะ แล้วต่อรถ/มอเตอร์ไซค์ · รีสอร์ตหรูมักมีเรือรับส่งส่วนตัว · เกาะยาวน้อย = เล็กกว่า มีบูทีค/รีสอร์ตหรูเยอะ (Six Senses, Treehouse) · เกาะยาวใหญ่ = ใหญ่กว่า เงียบกว่า มีรีสอร์ตครอบครัว (Anantara, Santhiya) · ทั้งสองเกาะเป็นชุมชนมุสลิม บางที่ไม่เสิร์ฟแอลกอฮอล์ · หาดฝั่งอ่าวพังงาตื้น น้ำลงเห็นหาดโคลน/หญ้าทะเลบางช่วง (ปกติของแถบนี้)',
}
const out = await agent(
  `You are an expert Thai hotel-roundup writer for thailandaddict.com. Produce ONE complete, schema-valid Thai roundup JSON.

STEP 1 — Read (your ONLY hotel sources; do NOT invent):
  • FORMAT TEMPLATE (mirror EVERY key exactly — a proven island roundup): ${TEMPLATE}
  • YOUR VERIFIED POOL (${s.n} hotels, pre-sorted by guest score): ${POOLDIR}\\${s.slug}.json
Optionally read 2-3 source reviews in ${REVDIR}\\<reviewSlug>.json for authentic detail.

STEP 2 — Write finished JSON to: ${OUTDIR}\\${s.slug}.json

IDENTITY: slug=${s.slug} · เมือง ${s.cityTH} · city hub href ${s.cityHub} · ย่าน ${s.zoneTH} · จำนวน ${s.n} · มุม: ${s.angle} · การเดินทาง(mrtHtml): ${s.transport}

REQUIREMENTS:
1. Every top-level key the template has + quickAnswerHtml. entries[]: one per pool hotel (all ${s.n}), COPY VERBATIM from pool: name, score, stars, img, agodaUrl, bookingUrl, tripUrl, reviewUrl, priceBig. Map pool rooms {name,price,full}→{type,price}. Set id/rank/rankColor/type/revCount/mrtTag/priceSub/tags/addr/storyHtml(70-110 words)/tipHtml/pros(3-4)/cons(2-3)/dividerText.
2. RANKING: order entries by the pool's guest-score order (highest first). FRAME HONESTLY with clear BEST-FOR + WHICH-ISLAND signposting: note whether each is on เกาะยาวน้อย (Yao Noi) or เกาะยาวใหญ่ (Yao Yai). Six Senses = ultra-luxury flagship / bucket-list; Treehouse Villas = adults-only honeymoon eco-luxury; Anantara + Santhiya = big-brand family luxury (Yao Yai); Koyao Bay Pavilions + Cape Kudu + Koyao Island Resort = boutique Yao Noi; Koh Yao Yai Village = family value (Yao Yai); Elixir = value Yao Yai; Thiwson = best-beach value cottages (Yao Yai). Each storyHtml states who it's best for + honest drawbacks (boat access, quiet/no-nightlife, low-tide beaches, remote, some no-alcohol). toc[] + compareRows[] SAME order as entries.
3. title/meta: natural Thai, include เกาะยาว + พังงา + "เทียบราคา 3 เว็บ" + "อัปเดต 2026" + "ที่เรารีวิวไว้แล้ว". heroImg+image = #1 hotel's img.
4. breadcrumb: ThailandAddict → 🇹🇭 ไทย (country-thailand.html) → พังงา (city-phang-nga.html) → this roundup. navReviewHref=${s.slug}.html.
5. faq 4-5 (how to get to Koh Yao / boat from Phuket vs Krabi, Yao Noi vs Yao Yai which to pick, is it too quiet / good for honeymoon, best time, alcohol/culture note), advice 3-4, quickAnswerHtml 40-60 words.
Tone v2-clean เพื่อนเล่าให้เพื่อน; avoid AI clichés (ตอบโจทย์/โดดเด่น/ครบครัน/ระดับโลก); no dark patterns; honesty "เสียงจากรีวิวจริง", never "ไปพักเอง".

Write the file. Return {"slug":"${s.slug}","entryCount":N,"top1":"<name>"}.`,
  { label: `gen:${s.slug}`, phase: 'Generate', effort: 'high' }
).catch(e => ({ err: String(e) }))
return { out }

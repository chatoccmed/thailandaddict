export const meta = {
  name: 'verify-booking-cj',
  description: 'Adversarial verification of the Booking→CJ monetization wiring: dist sweep, SID correctness, schema canonicality, live redirects, EN twins.',
  phases: [{ title: 'Verify', detail: '5 independent verifiers' }],
}
const S = { type: 'object', additionalProperties: false, required: ['pass', 'findings'], properties: {
  pass: { type: 'boolean' }, findings: { type: 'array', items: { type: 'string' } } } };

const COMMON = `Repo: C:/Users/Imac/Thailandaddict. Built dist: astro/dist (13k+ pages). CJ wiring spec:
- Every rendered Booking.com CTA (href or data-href) must be the CJ click-format deep link:
  https://www.anrdoezrs.net/click-101809619-17289009?sid=<SID>&url=<URL-ENCODED canonical booking.com url>
- SID = the page's slug; EN pages (under /en/) use "en-" + slug; static hubs use the hub filename (index → "home")
- NO legacy dlg-format links (anrdoezrs.net/links/101809619/type/dlg/) may remain anywhere
- Content JSON (astro/src/content) booking.com URLs must be CANONICAL (no aid=, no label=)
- JSON-LD / schema in rendered pages must NOT contain anrdoezrs (schema stays canonical — only CTAs are wrapped)
You are an ADVERSARIAL verifier: actively try to find violations. Use Grep/Bash (node at ~/nodejs, export PATH="$HOME/nodejs:$PATH"). Return pass=false with concrete findings (file + evidence) if ANY violation found; pass=true with what you checked otherwise. VERIFY ONLY — edit nothing.`;

phase('Verify')
const res = await parallel([
  () => agent(COMMON + `\n\nTASK 1 — dist raw-CTA sweep: search ALL of astro/dist (TH + en/) for any href="https://www.booking.com or data-href="https://www.booking.com that escaped wrapping. Also count anrdoezrs links (expect >4000). Also assert zero __BOOKING_AID__ and zero aid=1670294 anywhere in dist.`,
    { label: 'verify:dist-sweep', phase: 'Verify', schema: S }),
  () => agent(COMMON + `\n\nTASK 2 — SID correctness sampling: pick 10 random review pages, 5 roundup pages, 5 hub pages from astro/dist (mix TH and en/). For each, extract the CJ link(s) and assert the /sid/<SID>/ segment equals the page slug (en- prefixed for en/ pages; hubs use filename; index uses "home"). Report any mismatch with file + actual SID.`,
    { label: 'verify:sid', phase: 'Verify', schema: S }),
  () => agent(COMMON + `\n\nTASK 3 — schema canonicality: in 10 sampled dist review/roundup pages, extract the <script type="application/ld+json"> blocks and assert none contain anrdoezrs.net (schema must not carry affiliate redirects). Also assert the visible Agoda (cid=1965862) and Trip (Allianceid=6861268) links are untouched on those pages.`,
    { label: 'verify:schema', phase: 'Verify', schema: S }),
  () => agent(COMMON + `\n\nTASK 4 — live redirect verification: curl (browser User-Agent, -L --max-redirs 8) 4 CJ links taken from DIFFERENT real dist pages (a TH review, an EN review, a roundup, a hub). Assert each final url_effective is the exact booking.com destination embedded in the link. Report final URLs.`,
    { label: 'verify:redirect', phase: 'Verify', schema: S }),
  () => agent(COMMON + `\n\nTASK 5 — content + generator invariants: (a) grep astro/src/content for booking.com URLs with aid= or label= (must be 0); (b) confirm _internal/gen-hubs.mjs emits cjB( on all booking.com hrefs (no raw booking.com href template strings left); (c) run node _internal/qa/check-booking-cj.mjs astro/dist and report its output verbatim.`,
    { label: 'verify:invariants', phase: 'Verify', schema: S }),
])
return { results: res }

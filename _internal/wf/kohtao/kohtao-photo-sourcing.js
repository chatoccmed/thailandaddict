export const meta = {
  name: 'kohtao-photo-sourcing',
  description: 'Find 4 directly-downloadable real photos per Koh Tao hotel (hero + 3 gallery) from official sites / Trip.com',
  phases: [{ title: 'Sources' }],
}
const RESEARCH = 'C:\\Users\\Imac\\Thailandaddict\\thailandaddict\\_internal\\wf\\kohtao\\research.json'
const SCHEMA = {
  type: 'object', additionalProperties: false,
  required: ['slug', 'found', 'images', 'credit', 'sourceUrl', 'notes'],
  properties: {
    slug: { type: 'string' },
    found: { type: 'boolean' },
    images: {
      type: 'array', description: 'up to 4 DIRECT image-file URLs (.jpg/.jpeg/.png/.webp) of THIS hotel — hero/exterior/beach, a room, the pool, a view. Real photos actually seen in a fetched page.',
      items: { type: 'object', additionalProperties: false, required: ['url', 'kind'], properties: { url: { type: 'string' }, kind: { type: 'string', description: 'hero|room|pool|view|beach|other' } } },
    },
    credit: { type: 'string', description: 'Thai credit e.g. "ภาพ: เว็บไซต์ทางการ <hotel>" or "ภาพ: Trip.com"' },
    sourceUrl: { type: 'string' },
    notes: { type: 'string' },
  },
}
const SLUGS = ['review-jamahkiri-dive-resort-spa-koh-tao-surat-thani','review-haadtien-beach-resort-koh-tao-surat-thani','review-koh-tao-heights-pool-villas-surat-thani','review-bans-diving-resort-koh-tao-surat-thani','review-sensi-paradise-beach-resort-koh-tao-surat-thani','review-chintakiri-resort-koh-tao-surat-thani','review-sairee-cottage-resort-koh-tao-surat-thani','review-mountain-reef-beach-resort-koh-tao-surat-thani']

phase('Sources')
const results = await parallel(SLUGS.map(slug => () =>
  agent(
    `Find up to 4 directly-downloadable REAL photos of a specific Koh Tao hotel, for a Thai travel-site review.

Open ${RESEARCH}, find the object whose slug === "${slug}" — use its name + photoSourceUrl. Then use WebFetch on that hotel's OFFICIAL website and/or its Trip.com hotel page to find real photos OF THAT HOTEL (exterior/beach, a room, the pool, a view).

Return up to 4 DIRECT image-file URLs (.jpg/.jpeg/.png/.webp) that you actually saw in a fetched page — do NOT invent URLs. Prefer the hotel's OWN official website images (creditable), then Trip.com. AVOID: third-party review blogs (oyster.com, tripadvisor, agoda/booking listing thumbnails), stock sites, and any facebook/fbcdn/scontent URL. If a page lazy-loads images (only base64/placeholder in HTML) or blocks fetching, say so in notes and return whatever real direct URLs you could confirm (found=false if none). Give a Thai credit line. Return via StructuredOutput.`,
    { label: `pic:${slug.replace(/^review-/, '').slice(0, 20)}`, phase: 'Sources', schema: SCHEMA, effort: 'high' }
  ).catch(e => ({ slug, found: false, images: [], credit: '', sourceUrl: '', notes: 'err ' + String(e).slice(0, 80) }))
))
const withImgs = results.filter(Boolean).filter(r => r.images && r.images.length)
return { total: SLUGS.length, withImages: withImgs.length, results: results.filter(Boolean) }

export const meta = {
  name: 'verify-resto-prov',
  description: 'Adversarially verify each restaurant in a province: real, currently open, correctly located, plausible rating, matching IG/FB embed.',
  phases: [{ title: 'Verify', detail: 'one skeptic agent per restaurant — web-verify existence/open/location/rating/social' }],
}

const VERDICT = {
  type: 'object', additionalProperties: false,
  required: ['rank','name','exists','operating','locationOk','ratingAssessment','socialMatch','confidence','redFlags','evidence'],
  properties: {
    rank: { type: 'number' },
    name: { type: 'string' },
    exists: { type: 'string', enum: ['yes','no','unsure'] },
    operating: { type: 'string', enum: ['open','closed','unsure'] },
    locationOk: { type: 'string', enum: ['yes','no','unsure'] },
    ratingAssessment: { type: 'string', enum: ['plausible','off','unverifiable'] },
    socialMatch: { type: 'string', enum: ['match','mismatch','na','unsure'] },
    confidence: { type: 'string', enum: ['high','medium','low'] },
    redFlags: { type: 'array', items: { type: 'string' } },
    evidence: { type: 'string' },
  },
}

const A = (typeof args === 'string') ? JSON.parse(args) : args
const PROV = A.prov
const REST = A.rests
phase('Verify')

const verdicts = await parallel(REST.map(r => () => {
  const social = r.igPost || r.fbPage
    ? `does the IG post (instagram.com/p/${r.igPost||'-'}) / FB page (${r.fbPage||'-'}) actually belong to THIS restaurant in this province?`
    : 'no social provided → socialMatch = na'
  const prompt = `You are a SKEPTICAL fact-checker for a Thai travel site. Independently verify this restaurant listing for จังหวัด ${PROV}, Thailand, using WebSearch + WebFetch (Google Maps, Wongnai, Facebook, recent blogs/YouTube). DEFAULT TO FLAGGING when you cannot confirm — do not give benefit of the doubt.

Published data:
- name: ${r.name}
- area: ${r.area}
- zone: ${r.zone}
- cuisine/foodType: ${r.cuisine} / ${r.foodType}
- our rating: ${r.rating == null ? '(none shown)' : r.rating + ' (' + r.ratingSrc + (r.ratingCount ? ', count ' + r.ratingCount : ', NO count') + ')'}
- IG shortcode: ${r.igPost || '(none)'}  · FB page: ${r.fbPage || '(none)'}
- must-order: ${(r.mustOrder || []).join(', ')}

Determine:
1. exists — is this a real restaurant findable online?
2. operating — is it CURRENTLY open (look for "permanently closed", reviews/posts dated 2024-2026)? closed = critical.
3. locationOk — is it actually in the stated area/zone of this province?
4. ratingAssessment — ${r.rating == null ? "we show NO rating for this one; set 'plausible' if that's reasonable (e.g. a chain), 'off' only if you find it's clearly misrepresented." : 'is rating ' + r.rating + (r.ratingCount ? '/' + r.ratingCount + ' reviews' : '') + " plausibly real (within ~0.5 of what you find)? 'off' if our number looks fabricated/wrong, 'unverifiable' if you truly cannot find any rating."}
5. socialMatch — ${social}
List concrete redFlags (closed / wrong location / rating off / social mismatch / not found / fabricated dishes). evidence = 1-3 sentences citing what you found (source + date). Use 'unsure' honestly when evidence is thin. Return the structured verdict.`
  return agent(prompt, { label: `vrf:${r.name.slice(0,14)}`, phase: 'Verify', schema: VERDICT, agentType: 'general-purpose' })
}))

return { prov: PROV, verdicts: verdicts.filter(Boolean) }

export const meta = {
  name: 'factcheck-klook',
  description: 'Fact-check flagged claims + stamp factCheckedDate across all Klook activity articles, one agent per cluster',
  phases: [{ title: 'Fact-check', detail: 'verify claims, fix issues, stamp date — one agent per cluster' }],
}

const ART = 'C:\\Users\\Imac\\Thailandaddict\\astro\\src\\content\\articles\\'
const clusters = (typeof args === 'string') ? JSON.parse(args) : args // [{cluster, files:[slug,...], claims:[{file, claim}]}]

phase('Fact-check')
const results = await pipeline(
  clusters,
  (c) => {
    const fileList = c.files.map(s => `${ART}${s}.json`).join('\n')
    const claimLines = c.claims.length
      ? c.claims.map(cl => `- in ${cl.file}: the phrase "${cl.claim}"`).join('\n')
      : '(none flagged — no superlative claims detected in this cluster, but still verify ratings + stamp the date)'
    const prompt = `You are fact-checking published Thai travel content for thailandaddict.com (cluster: "${c.cluster}"). Use WebSearch to verify claims — do not guess.

FILES TO AUDIT (read every one, full path):
${fileList}

FLAGGED SUPERLATIVE/UNIQUENESS CLAIMS TO VERIFY (these phrases appeared in the files above — find them, check the surrounding sentence, and confirm via web search whether the underlying factual claim is TRUE, EXAGGERATED, or UNVERIFIABLE):
${claimLines}

INSTRUCTIONS:
1. For each flagged claim: read the sentence it appears in. Web-search to verify. If the claim is accurate, leave it. If it is exaggerated, wrong, or you cannot verify it, EDIT the file to correct or soften the wording (e.g. scope it correctly — "ใหญ่ที่สุดในภาคใต้" instead of an unverifiable "ใหญ่ที่สุดในไทย" — or remove the superlative and state the fact plainly). NEVER write the exact phrase "ที่สุดในโลก" even if literally true (site style rule — rephrase as "ในไทย" or similar scoped claim).
2. While you have each file open, also spot-check every numeric "rating" field: confirm it has a "ratingSrc" naming a real platform. If two DIFFERENT cards in the SAME file (or across this cluster's files) share the IDENTICAL rating value AND identical ratingSrc string for what are clearly two different named places, that is a "borrowed rating" bug — delete the rating+ratingSrc from the less-central/secondary card.
3. Do a final check for the site's banned words anywhere in the files: ตอบโจทย์, โดดเด่น, ครบครัน, ระดับโลก, สุดยอด, อันซีน — rephrase if found (do not just delete, keep the sentence coherent).
4. After all edits (or if no edits were needed), add or update a top-level JSON field "factCheckedDate": "2026-07-03" on EVERY file listed above — do this even for files with zero issues, since reading+verifying it today is what this field records. Re-read each file you touched and JSON.parse to confirm it is still valid JSON.

Final message: one line per file — filename, what was corrected (or "no correction needed — verified accurate"), and confirmation factCheckedDate was written.`
    return agent(prompt, { label: `factcheck:${c.cluster}` })
  }
)

const summary = clusters.map((c, i) => ({ cluster: c.cluster, files: c.files.length, claims: c.claims.length, report: results[i] }))
return { clustersProcessed: summary.length, totalFiles: summary.reduce((a, s) => a + s.files, 0), summary }

// prompts/coverLetterPrompt.js
//
// DAY 7: Production prompt for cover letter generation. Grounded only in real
// resume content; tailored to the JD when present, generic when not.

function buildCoverLetterPrompt(resumeText, jdText) {
  const hasJD = typeof jdText === "string" && jdText.trim().length > 0;

  const rules = `
Write a professional cover letter based ONLY on the resume content below. Follow these rules:
1. Use only real facts, projects, and skills that actually appear in the resume. Never invent achievements, metrics, or experience.
2. Reference at least 1-2 specific, concrete items from the resume (a real project name, a real skill, a real accomplishment) — do not write something generic that could apply to anyone.
3. Keep it to 3-4 paragraphs: an opening hook, 1-2 body paragraphs connecting the candidate's real background to the role, and a closing paragraph.
4. Professional but warm tone — not stiff, not overly casual.
5. ${hasJD ? 'Address it to "Hiring Manager" and tailor the content specifically to the job description below — reference the role and connect the resume\'s real experience to what the JD is asking for.' : 'No job description was provided, so write a strong general-purpose cover letter addressed to "Hiring Manager" that highlights the candidate\'s real strengths for roles in their apparent field.'}
6. Output ONLY the cover letter text itself. No subject line, no explanation, no markdown formatting, no placeholder brackets like "[Company Name]" unless truly necessary — if the company name is unknown, phrase around it naturally (e.g., "your team" instead of "[Company Name]").`.trim();

  const jdSection = hasJD
    ? `\n\nJOB DESCRIPTION:\n"""\n${jdText.trim()}\n"""`
    : "";

  return `You are a professional career writing assistant helping a final-year student write a cover letter for a job application.

${rules}

RESUME:
"""
${resumeText.trim()}
"""${jdSection}`;
}

module.exports = buildCoverLetterPrompt;
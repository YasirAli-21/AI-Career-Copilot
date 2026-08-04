# AI Career Copilot — Future Scope

How this specific product could evolve, grounded in the v1.0.0 architecture and the features explicitly deferred in the original PRD (Section 6).

---

## 3 Months: Depth Over Breadth

Focus: make the existing core loop excellent before adding surface area.

- **User accounts + saved history** — the PRD's first deferred feature. Track resume score improvement over multiple analyses. Requires: a lightweight database (Supabase's free tier fits the existing free-tools constraint), auth (Supabase Auth or Clerk's free tier), and a schema migration from the current stateless `AnalysisReport` shape to a persisted version.
- **Multi-resume comparison** — let a user analyze two resume versions side-by-side and see the score delta. Natural extension once accounts exist to store history against.
- **Resume templates/export** — beyond a plain-text report download, offer a formatted PDF export of the *resume itself* (not just the analysis) incorporating the AI's suggested rewrites, using a library like `pdf-lib` or `react-pdf`.
- **Expanded file format support** — plain `.txt` upload, Google Docs link import.
- **Rate limiting** — currently an accepted risk per `API.md` since there's no auth to key it against; becomes necessary once real traffic exists. Vercel's Edge Config or a simple IP-based limiter would suffice at this scale.

## 6 Months: The Two Deferred Features Students Actually Ask For

- **Interview practice / mock interviews** — the PRD's second deferred feature, and the most natural product extension: the resume analysis already extracts a candidate's real skills and projects, which is exactly the context needed to generate realistic, personalized interview questions ("Tell me about your YSENTRY project" rather than generic questions).
- **LinkedIn profile optimization** — reuses ~70% of the existing analysis engine (same AI provider, similar prompt structure, same "ground truth only" guardrail), but needs a new input format (LinkedIn profile URL or pasted profile text) and a new schema.
- **Basic analytics dashboard** (if accounts exist by now) — aggregate, anonymized insights like "most common missing skill this month" — useful both as a user-facing feature and as validation data for what the product should prioritize next.

## 12 Months: Platform Maturity

- **Portfolio/GitHub analysis** — the PRD's third deferred feature. For technical roles specifically, a GitHub profile often matters as much as a resume. Would require a GitHub API integration and a genuinely different analysis prompt (code quality signals, README quality, commit consistency) rather than resume-analysis logic reused.
- **Multi-language support** — Gemini already supports this natively; the main work is UI internationalization, not AI capability.
- **Career path recommendations** — using the aggregate skill-gap data from thousands of analyses (if the product has real traction by this point) to suggest realistic next-role paths based on a user's current resume, not just fixes to the current one.
- **B2B angle** — university career centers as a distribution channel; would need a lightweight admin view for staff to see aggregate (anonymized) student resume trends, which is a genuinely different product surface from the current single-user flow.

## What Stays Explicitly Out of Scope (even at 12 months)

Per the original PRD's discipline: full resume *rewriting* (as opposed to bullet-level suggestions) stays excluded even long-term — it's a meaningfully higher hallucination-risk feature, and the product's core value proposition (honest diagnosis, not ghostwriting) would be diluted by offering it. This boundary should be revisited only with a much more sophisticated fact-verification layer than a schema-validated JSON prompt.

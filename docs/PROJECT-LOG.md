# AI Career Copilot — Project Log

Running log of daily progress across the 10-day capstone.

---

## Day 1 — Requirements (Discovery)
**Date:** July 27, 2026

- Interviewed and validated the project idea: AI Career Copilot narrowed to a single core feature — the AI Resume Analyzer — with a cover letter generator as the one bonus feature.
- Locked target user: final-year students writing their first resume.
- Locked scope: stateless, no accounts, PDF/DOCX/paste input, section-by-section report, optional JD-targeted matching.
- Explicitly excluded: interview prep, LinkedIn optimization, portfolio analysis, accounts, full resume rewriting.
- **Deliverables:** PRD, Implementation Blueprint (Days 2–10), Pitch Deck.

## Day 2 — Design
**Date:** July 28, 2026

- Created dedicated GitHub repository: `AI-Career-Copilot`, cloned locally, connected via Git.
- Finalized tech stack: HTML/CSS/vanilla JS frontend, Vercel Serverless Functions backend, Claude API, `pdf-parse` + `mammoth` for file parsing, Vercel hosting. No database, no auth (stateless, per PRD).
- Designed full system architecture: 3 serverless functions (`extract`, `analyze`, `cover-letter`), request lifecycle, AI interaction model.
- Designed the complete data schema (`AnalysisReport`, `CoverLetterResult`) — validated against every PRD requirement.
- Designed all 3 API endpoints in full detail: requests, responses, validation, error cases.
- Designed the complete user flow and low-fidelity wireframes for all 6 screens.
- Finalized project folder structure, matched to Vercel conventions.
- Confirmed Day 3 readiness: on track, no scope creep, no simplification needed.
- **Deliverables:** ARCHITECTURE.md, SCHEMA.md, API.md, UI-WIREFRAMES.md, PROJECT-STRUCTURE.md. Implementation Blueprint updated with finalized stack.

---

## Day 3 — Setup
**Date:** July 30, 2026

- Installed and confirmed dev environment: Node.js v24.18.0, npm 11.16.0, Vercel CLI 58.1.0.
- Installed dependencies: `@anthropic-ai/sdk`, `pdf-parse`, `mammoth`.
- Created and secured `.env` (confirmed gitignored via `git check-ignore`).
- Built full project scaffold matching `docs/PROJECT-STRUCTURE.md`: `api/`, `prompts/`, `public/`, `design/`.
- Built working Hello World frontend (`index.html`, `style.css`, `app.js`) with a Test Connection button.
- Built `api/analyze.js` stub, plus placeholder stubs for `api/extract.js` and `api/cover-letter.js`.
- Linked local project to Vercel (`yasir-ali1/ai-career-copilot`); GitHub auto-deploy deliberately deferred to Day 9.
- **Issue found:** Anthropic account has no API credit — real Claude calls fail with a billing error, not a code error.
- **Resolution:** switched `api/analyze.js` to mock mode to unblock today's verification. Real API call must be restored before Day 5 (tracked in Implementation Blueprint + `DAY3-SUMMARY.md`).
- Confirmed full pipeline working end-to-end (mock mode): Browser → Vercel Function → Browser.
- **Deliverables:** SETUP.md, ENVIRONMENT.md, DAY3-SUMMARY.md, foundation code files. Implementation Blueprint updated with the credit blocker and a Day 5 pre-flight check.

---

## Day 4 — Implementation: Resume Input & Parsing
*(To be filled in at end of Day 4)*

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
*(To be filled in at end of Day 3)*

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
**Date:** July 31, 2026

- Installed `formidable` for multipart file upload handling.
- Implemented real `api/extract.js`: PDF extraction (`pdf-parse` v2 class-based API), DOCX extraction (`mammoth`), text normalization, validation, and graceful error handling.
- Rebuilt frontend with tabbed Upload/Paste interface, drag-and-drop, client-side validation, and JD textarea.
- Debugged and fixed three dependency version mismatches (`formidable`, `pdf-parse` both had newer major-version APIs than expected).
- Verified working: real PDF upload extraction (4,613 characters from Yasir's actual CV) and paste-text extraction.
- **Known gaps flagged for later:** DOCX extraction untested (no sample file available), bad-file-type rejection untested (OS file picker filters non-PDF/DOCX by default). Both tracked for verification before Day 8.
- **Deliverables:** DAY4-SUMMARY.md. No blueprint changes required — Day 4 was implemented exactly as scoped.

---

## Day 5 — Implementation: AI Analysis Engine
**Date:** August 1, 2026

- **Major decision:** switched AI provider from Anthropic Claude to Google Gemini (`gemini-flash-lite-latest`), since Claude's API has no free tier and paid tools were ruled out. Architecture, schema, and API contracts unchanged — only the SDK call itself differs. Full rationale in `docs/DAY5-SUMMARY.md`.
- Built production `prompts/analysisPrompt.js`: strict JSON output instructions matching `docs/SCHEMA.md`, guardrails against invented resume content, conditional JD-matching logic.
- Built real `api/analyze.js`: Gemini API call with JSON response mode, retry-on-malformed-JSON logic, full server-side validation/backfill of the schema.
- Verified with real test calls (Node.js test scripts, since PowerShell's `curl` alias mangled the request — documented for future reference): both no-JD and with-JD paths returned complete, accurate, well-grounded reports.
- Updated `docs/ENVIRONMENT.md` and `docs/ARCHITECTURE.md` to reflect the Gemini switch. Updated Implementation Blueprint banner.
- **Known gap flagged:** malformed-JSON retry path exists in code but wasn't organically triggered during testing (both calls succeeded on first try) — tracked for Day 8.
- **Deliverables:** DAY5-SUMMARY.md, updated ENVIRONMENT.md/ARCHITECTURE.md, updated Implementation Blueprint.

---

## Day 6 — Full MVP + Early Deployment
**Date:** August 1, 2026

- **Schedule note:** at the person's request, deployment (originally Day 9) happened today alongside the report UI, producing a shareable live demo ahead of schedule. Day 9 is now a hardening pass, not the first deployment.
- Built the complete report UI: score header, six section cards (status badges, issues, missing skills, weak-bullet before/after), conditional JD-match card.
- Wired the full flow end-to-end: upload/paste → extract (if file) → analyze → report. Added Start Over and Download Report (plain-text export).
- Added the required footer: "Built with Claude as part of the AB Talks 60-Day Claude AI Challenge."
- Debugged three separate copy-paste content-swap issues during implementation (files receiving each other's content) — resolved by verifying file contents directly via `findstr` after every paste, rather than trusting the editor UI.
- **Deployed to production on Vercel** (`vercel --prod`), added `GEMINI_API_KEY` to Vercel's environment variables.
- **Found and fixed a real production-only bug:** `pdf-parse` v2 crashed on Vercel's Linux servers (missing native `@napi-rs/canvas` dependency, browser-only APIs). Fixed by pinning to `pdf-parse@1.1.1`, the simpler function-based version with no rendering dependencies. Verified locally, then redeployed and reverified live.
- **Confirmed full MVP working on the live production URL**, including footer visibility: https://ai-career-copilot-lime-xi.vercel.app
- **Deliverables:** DAY6-SUMMARY.md, updated Implementation Blueprint (MVP status + Day 9 scope change), updated ENVIRONMENT.md.

---

## Day 7 — Cover Letter Generator (Bonus) & UX Polish
**Date:** August 1, 2026

- Built and shipped the cover letter generator: `prompts/coverLetterPrompt.js`, `api/cover-letter.js` (reusing the Gemini setup from Day 5/6), and full UI (Generate button, cover letter screen, Copy/Download, JD-tailored badge).
- Verified cover letter working locally, then confirmed working live in production for the first time.
- Conducted a senior-level UX/accessibility review pass: fixed a real keyboard-accessibility bug (upload dropzone was mouse-only), added `aria-live` regions across all dynamic screens, added a proportional conic-gradient score ring, added a mobile responsive breakpoint, added subtle screen-transition and button micro-interactions, and added `prefers-reduced-motion` support.
- Redeployed to production and re-verified the full flow (including cover letter) live.
- **Deliverables:** DAY7-SUMMARY.md, updated Implementation Blueprint.
- **Every planned v1.0 feature is now built, deployed, and verified live.**

---

## Day 8 — Testing
*(To be filled in at end of Day 8 — starting checklist: DOCX extraction untested, malformed-JSON retry path untested, drag-and-drop bad-file-type rejection untested)*

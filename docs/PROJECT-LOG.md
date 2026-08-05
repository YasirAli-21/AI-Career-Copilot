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

## Day 8 — Testing, Debugging & Production Optimization
**Date:** August 2, 2026

- Conducted a structured senior review (Security / Reliability / Code Quality) before writing any code. Found 6 real issues.
- **Fixed:** added prompt-injection guardrails to both AI prompts; added `vercel.json` with security headers, static asset caching, and explicit 30s function timeout; added `lib/withTimeout.js` wrapping both AI calls with a 25s timeout for graceful failure; added `lib/config.js` removing a duplicated `MODEL_NAME` string; added missing meta description + favicon.
- Ran a full testing pass: short/empty input rejection ✅, non-resume gibberish handling ✅ (AI correctly flagged it, no crash), drag-and-drop bad file type rejection ✅ (**closes a Day-4 gap**), mobile viewport ✅, console clean (zero errors/warnings) ✅, **DOCX extraction with a real file ✅ (closes a Day-4 gap)**.
- One item (malformed-JSON retry path) remains code-reviewed but not organically observed — documented as low-risk given zero AI JSON failures across all real testing to date.
- Redeployed to production and re-verified the full flow live, including console-clean confirmation on the live site.
- **Deliverables:** DAY8-SUMMARY.md, updated Implementation Blueprint, updated ENVIRONMENT.md.
- **Reviewer's verdict: approved for public release.**

---

## Day 9 — Launch & Production Readiness
**Date:** August 4, 2026

- Conducted a full Release Readiness Review: deployment, environment variables, docs, metadata, error pages, repo organization.
- **Fixed:** created the missing `.env.example` (never actually existed despite being referenced since Day 3); corrected `package.json` license mismatch (ISC → MIT) and removed the unused `@anthropic-ai/sdk` dependency; fully rewrote `README.md` from GitHub's placeholder to real project documentation; added Open Graph/Twitter Card social sharing metadata; added a custom styled 404 page.
- Resolved a `vercel dev` self-upgrade failure (Windows file lock), updated Vercel CLI to latest.
- Verified live in production: full flow, custom 404 page, footer, and social link preview (tested via LinkedIn post draft).
- **Process note:** two file-creation steps today initially failed silently and required disk-level verification (`dir`/`findstr`) to catch — reinforces the standing practice of never assuming a step succeeded without direct confirmation.
- **Security incident:** the real Gemini API key was accidentally pasted into `.env.example` instead of a placeholder. GitHub's push protection blocked the push before it reached the public repo. Response: revoked the exposed key, generated a new one, updated it in `.env` and Vercel's production environment variables, amended the git commit so the exposed key never entered repo history, redeployed and verified the new key works. Full incident details in `docs/DAY9-SUMMARY.md`.
- **Deliverables:** DAY9-SUMMARY.md, updated Implementation Blueprint, rewritten README.md.
- **Every item on the release-readiness checklist is complete.**

---

## Day 10 — Final Review, Portfolio & Graduation
**Date:** August 4, 2026

- Conducted a four-perspective senior review (Engineer, PM, UX Designer, Recruiter) of the live product.
- Generated portfolio materials: project descriptions (short/medium/long), resume bullet points, interview talking points, and a demo script.
- Created `future-scope.md` (3/6/12-month roadmap), `challenge-retrospective.md` (full factual Day 1-10 build history), `30-day-growth-plan.md` (one-milestone-per-day extension roadmap), and `daily-build-prompt.md` (reusable prompt template).
- Added 4 real screenshots to `docs/screenshots/` and embedded them in a rewritten README (worked through a folder-naming/typo saga — `Screenshorts` → `screenshorts` → `screenshots` — resolved via `git rm --cached` + clean re-add).
- Set GitHub repo metadata: description, website link, 10 topic tags.
- **Published the formal v1.0.0 GitHub release**, tagged and documented.
- **The AI Career Copilot capstone is complete: 10 days, requirements to a versioned public v1.0.0 release.**

---

**Capstone complete.**

# AI Career Copilot — 30-Day Growth Plan

A realistic, one-milestone-per-day roadmap taking v1.0.0 from a stateless MVP toward the 3-6 month vision in `future-scope.md`. Each day builds directly on the previous day's work — no day requires re-architecting what came before. Stack stays consistent with v1.0.0: Vercel, free-tier services only, vanilla JS frontend, Node serverless backend.

---

## Week 1 (Days 1-7): Accounts & Persistence Foundation

| Day | Milestone |
|---|---|
| 1 | Create a free Supabase project. Design the database schema: `users`, `resumes`, `analyses` tables, matching the existing `AnalysisReport` JSON shape from `docs/SCHEMA.md` as a JSONB column rather than redesigning it. |
| 2 | Implement Supabase Auth (magic-link email, no passwords to manage). Build sign-up/login UI screens matching the existing dark/teal design system. |
| 3 | Add session handling to the frontend; gate the existing analyze flow behind "must be logged in" (with a clear "continue as guest" fallback to preserve the stateless option). |
| 4 | On successful analysis, persist the report to the `analyses` table linked to the logged-in user. Stateless/guest mode still works exactly as v1.0.0 — persistence is additive, not required. |
| 5 | Build a "My Reports" history page: list past analyses by date, with the overall score visible at a glance. |
| 6 | Make history entries clickable — clicking an old report re-renders it using the existing `renderReport()` function, reading from the database instead of calling `/api/analyze` again. |
| 7 | Full regression test (does the original stateless flow still work?), deploy, update `docs/PROJECT-LOG.md` with a "Week 1" entry. |

## Week 2 (Days 8-14): Multi-Resume Comparison, Rate Limiting, Export

| Day | Milestone |
|---|---|
| 8 | Extend the `resumes` table to support multiple saved resumes per user (not just per-analysis snapshots). |
| 9 | Build a comparison UI: select two past analyses, display their `overall_score` and per-section scores side-by-side. |
| 10 | Add basic rate limiting on `/api/analyze` and `/api/cover-letter` (IP-based for guests, user-ID-based for logged-in users) using Vercel Edge Config or a simple in-memory/Upstash Redis free-tier counter. |
| 11 | Add PDF export of the *resume itself* (not just the analysis report) incorporating the AI's suggested rewrites, using `pdf-lib`. |
| 12 | Add plain `.txt` file upload support to the existing upload flow (trivial extension of the current PDF/DOCX branch in `api/extract.js`). |
| 13 | Polish the comparison UI — handle edge cases (comparing a report to itself, comparing reports with/without JD data). |
| 14 | Full regression test, deploy, update `docs/PROJECT-LOG.md`. |

## Week 3 (Days 15-21): Interview Practice (Accelerated from the 6-Month Plan)

| Day | Milestone |
|---|---|
| 15 | Design the interview-question generation prompt and JSON schema, reusing the same resume-grounding guardrails from `prompts/analysisPrompt.js` (never invent, only reference real resume content). |
| 16 | Build `/api/interview-questions`, following the exact same pattern as `api/analyze.js` (timeout wrapper, schema validation, Gemini call). |
| 17 | Build the interview practice UI: question display, text-area for the user's answer, "Next Question" flow. |
| 18 | Add AI feedback on the user's typed answer — grounded in whether it aligns with claims made in their actual resume. |
| 19 | Package into a full mock-interview session (5 questions, generated from the resume, sequential flow). |
| 20 | Polish loading/error states to match the existing design system exactly — no new component patterns invented where existing ones fit. |
| 21 | Full regression test, deploy, update `docs/PROJECT-LOG.md`. |

## Week 4 (Days 22-30): LinkedIn Optimization + Platform Hardening

| Day | Milestone |
|---|---|
| 22 | Design the LinkedIn analysis schema (headline, About section, experience descriptions) — a sibling to `AnalysisReport`, not a redesign of it. |
| 23 | Add a LinkedIn text-paste input screen, reusing the existing paste-tab UI pattern from the resume flow. |
| 24 | Build `/api/linkedin-analyze` following the established endpoint pattern. |
| 25 | Build the LinkedIn report UI by reusing `reportCard.js`'s rendering pattern rather than writing new components from scratch. |
| 26 | Add a basic anonymized analytics view: aggregate "most common missing skills this month" across all analyses — useful both as a feature and as internal product validation data. |
| 27 | Full accessibility + mobile audit across every feature added this month (keyboard nav, `aria-live`, responsive breakpoints — matching the Day 7 standard set in v1.0.0). |
| 28 | Security review pass on every new endpoint added this month: auth checks, rate limits, prompt-injection guardrails — matching the Day 8 standard set in v1.0.0. |
| 29 | Update all documentation: README, PRD (v2), architecture diagrams, reflecting the now-significantly-larger product surface. |
| 30 | Final full regression test across the entire app (original + all 29 days of additions), tag and release **v1.1.0** (or v2.0.0, if the scope feels large enough to warrant it), write a 30-day retrospective. |

---

## Ground Rules for This Roadmap

- **No day requires touching more than one feature area.** If a day's milestone feels like it's ballooning, cut it — this mirrors the scope discipline that made the original 10-day capstone work.
- **Every new endpoint follows the existing pattern**: timeout wrapper, schema validation, consistent error shape (`{ error: "..." }`), just like `api/analyze.js`.
- **Guest/stateless mode never breaks.** Accounts are additive throughout — v1.0.0's core promise (upload, analyze, leave, no data required) stays intact for anyone who wants it.
- **Free tools only, same as v1.0.0** — Supabase free tier, Vercel free tier, Gemini free tier. If any day's milestone would require a paid service, that's a signal to find a free alternative or defer the feature, not to quietly introduce a cost.

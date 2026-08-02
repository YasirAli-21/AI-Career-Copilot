# AI Career Copilot — Implementation Blueprint (Day 2 → Day 10)

**Project:** AI Career Copilot — Resume Intelligence Platform (v1.0)
**Owner:** Yasir | ABTalks 60-Day Claude AI Mastery Challenge — Capstone
**Time budget:** ~1–2 focused hours/day
**Status:** Days 1-7 complete (Requirements, Design, Setup, Resume Input, AI Analysis Engine, Report UI, Cover Letter + UX Polish). **Full v1.0 feature set is live and deployed.** This document is the single source of truth for Days 8–10.

> **Day 7 update — Cover letter shipped, UX/accessibility polish pass done:** The bonus cover letter feature is live and verified in production. A senior-level UX review pass fixed a real keyboard-accessibility bug (upload dropzone was mouse-only), added aria-live regions, a proportional score ring, mobile responsive breakpoints, and respect for `prefers-reduced-motion`. Full details in `docs/DAY7-SUMMARY.md`. **Every planned v1.0 feature is now built and live** — Day 8 is a genuine stress-test of a complete product, not a partial one.

> **Day 6 update — MVP complete and deployed early:** At the person's request, deployment (originally Day 9) happened today alongside the report UI. The full flow (upload/paste → analyze → report) is live at the production URL, verified working end-to-end including a real production-only bug fix (see `docs/DAY6-SUMMARY.md`). **Day 9 is now a hardening/verification pass on the existing live app, not the first deployment.** Day 7 (Cover Letter) and Day 8 (Testing) proceed as originally scheduled.

> **Day 5 update — AI provider switched to Gemini:** Anthropic's Claude API has no free tier, and paid tools were ruled out. The project now uses **Google's Gemini API** (`gemini-flash-lite-latest`, free tier, no credit card) instead of Claude for all AI calls. `GEMINI_API_KEY` replaces `ANTHROPIC_API_KEY` in `.env`. The architecture, JSON schema, and API contracts are all unchanged — only the SDK call in `api/analyze.js` (and, on Day 7, `api/cover-letter.js`) differs. Full rationale in `docs/DAY5-SUMMARY.md`. **The MOCK MODE blocker from Day 3 is now resolved** — real AI calls are live and verified working.

> **Day 3 update — Foundation built:** Full project scaffold running locally via `vercel dev`.

> **How to use this document:** Each day begins as a fresh AI conversation. Paste that day's full section into the new chat as context, along with any files/screenshots requested in "Handoff notes." The AI should be able to start building immediately — no re-planning, no re-litigating scope. Scope is locked per the PRD: core = AI Resume Analyzer, bonus = Cover Letter Generator, both stateless, no accounts.

---

## Locked Product Scope (do not re-negotiate)

- **Core:** Upload/paste resume (PDF, DOCX, or text) → optional JD paste → detailed section-by-section analysis report (ATS score, weaknesses, missing skills, JD-match %, example rewritten bullets).
- **Bonus (cut first if time runs short):** Auto-generated cover letter from the same resume + JD data.
- **Explicitly excluded:** accounts/history, interview prep, LinkedIn optimization, portfolio analysis, full resume rewrite, multi-resume comparison.
- **Success on Day 10:** live public URL, reliable on real resumes, polished enough to share on LinkedIn.

---

## Day-by-Day Map

| Day | SDLC Phase | Focus |
|---|---|---|
| 2 | Design | Architecture, tech stack, UX flow, AI prompt/output schema |
| 3 | Setup | Project scaffolding, environment, API key, base skeleton |
| 4 | Implementation | Resume input & parsing (PDF/DOCX/text extraction) |
| 5 | Implementation | AI analysis engine (core prompt + report generation) |
| 6 | Implementation | Report UI + JD-match logic |
| 7 | Implementation | Cover letter generator (bonus) + rewritten bullets polish |
| 8 | Testing | Real-resume testing, edge cases, error handling |
| 9 | Deployment | Ship to a live public URL, smoke test in production |
| 10 | Maintenance | Final polish, docs, LinkedIn-ready packaging, launch |

---

## Day 2 — Design

### 🎯 Objective
Turn the locked PRD into a concrete technical design: pick the tech stack, define the UX flow/wireframes, and design the exact AI prompt + output schema the whole product will be built around.

### 📖 What I'll learn
How to design an AI product backward from its output schema, and how to pick a stack that matches a 1–2 hr/day solo timeline rather than an "ideal" one.

### 🛠 Features to build
No code yet — this is a design-only day. Deliverable is a written design spec.

### 📝 Step-by-step implementation plan
1. **Choose the tech stack**, optimizing for: fast to build alone, comfortable stack for Yasir (has used single-file HTML/JS + Claude API extensively), minimal moving parts, easy free/simple deployment. Recommended default unless the AI has a strong reason to deviate: a single-page frontend (HTML/CSS/vanilla JS or React via CDN, matching Yasir's established pattern) + a small serverless backend function (or lightweight Node server) that calls the Claude API server-side (never expose the API key client-side) + PDF/DOCX parsing library on the backend.
2. **Define the AI output schema first, in JSON**, before anything else. Example shape to refine:
   ```json
   {
     "overall_score": 0-100,
     "sections": {
       "contact_info": {"score": 0-100, "status": "good|needs_work|missing", "issues": ["..."]},
       "summary": {"score": 0-100, "status": "...", "issues": ["..."]},
       "education": {"score": 0-100, "status": "...", "issues": ["..."]},
       "experience_projects": {"score": 0-100, "status": "...", "issues": ["..."], "weak_bullets": [{"original": "...", "rewritten": "..."}]},
       "skills": {"score": 0-100, "status": "...", "missing_skills": ["..."]},
       "ats_formatting": {"score": 0-100, "status": "...", "issues": ["..."]}
     },
     "jd_match": {"available": true, "match_percent": 0-100, "top_gaps": ["..."]},
     "summary_feedback": "2-3 sentence encouraging overview"
   }
   ```
3. **Draft the core analysis prompt** that instructs Claude to: only use content present in the resume (never invent achievements/metrics), be specific and encouraging, return strictly valid JSON matching the schema above, and adapt `jd_match` behavior based on whether a JD was provided.
4. **Sketch the UX flow** (paper/notes app is fine, no design tool needed): Landing/upload screen → loading state → report screen (score header + expandable section cards) → optional "Generate Cover Letter" button → cover letter screen.
5. **Decide the visual direction**: reuse Yasir's established dark/premium SaaS aesthetic (dark background, teal/violet accent, clean sans-serif) for brand consistency with his other builds.
6. **Write down the deployment target** for Day 9 (e.g., a static host + serverless function platform), so Day 3 setup matches it.

### 📂 Files and folders to create or modify
- `/design/output-schema.json` — the finalized JSON schema
- `/design/prompt-draft.md` — the draft analysis prompt
- `/design/ux-flow.md` — written flow + screen list

### 🔗 APIs, libraries, services, or tools to integrate
- Claude API (model to be confirmed at build time — check current available models rather than assuming)
- A PDF text-extraction library and a DOCX text-extraction library (confirm exact package names during Day 3 setup)

### 🧪 Testing tasks
None — design day. Sanity-check the schema by manually "filling it in" using Yasir's own real resume as a thought experiment.

### 🐞 Common issues and debugging tips
- Don't over-design the UI today — a rough flow is enough; visual polish happens progressively during Implementation days.
- Resist the urge to pick a trendy but unfamiliar framework — optimize for what Yasir can move fastest in.

### ✅ End-of-day checklist
- [ ] Tech stack chosen and written down
- [ ] Output JSON schema finalized
- [ ] Draft analysis prompt written
- [ ] UX flow sketched (screens + transitions)
- [ ] Deployment target identified

### 📸 Expected project state and screenshots to capture
No app yet — capture/save the three design docs (schema, prompt draft, UX flow notes).

### ➡️ Handoff notes for Day 3
Bring: the chosen tech stack, the finalized JSON schema, and the draft prompt. Day 3 will scaffold the actual project structure around these decisions.

---

## Day 3 — Setup

### 🎯 Objective
Get a working, empty-but-running project skeleton deployed to the chosen stack, with the Claude API wired up end-to-end on a "hello world" request.

### 📖 What I'll learn
How to structure a small AI-powered web app project and safely call an LLM API from a backend without exposing keys.

### 🛠 Features to build
- Empty project scaffold (frontend shell + backend endpoint)
- One working test call: frontend sends a sample string → backend calls Claude API → returns raw response → frontend displays it

### 📝 Step-by-step implementation plan
1. Repo already created and cloned (Day 2): `AI-Career-Copilot` on GitHub, connected locally. Confirm folder scaffold from `docs/PROJECT-STRUCTURE.md` exists (`api/`, `prompts/`, `public/`, `public/components/`, `design/`, `docs/`).
2. Run `npm init -y`, then install dependencies: `@anthropic-ai/sdk`, `pdf-parse`, `mammoth`.
3. Install the Vercel CLI (`npm i -g vercel`) for local dev that mirrors production serverless behavior.
4. Build the frontend shell in `public/index.html`: a placeholder upload area and a "Test Connection" button, per the Screen 1 wireframe in `docs/UI-WIREFRAMES.md`.
5. Implement `api/analyze.js` as a minimal stub for today: it should currently just send a hardcoded test string to the Claude API and return the raw response (full analysis logic comes Day 5) — this proves the pipeline end-to-end.
6. Store the Claude API key in `.env` locally (gitignored) and add it to Vercel's Environment Variables dashboard for production. Never hardcode it, never send it to the frontend.
7. Wire the frontend "Test Connection" button to call `/api/analyze` (via `vercel dev` locally) and display the raw AI response on screen.
8. Commit and push to GitHub so Vercel's auto-deploy (connected Day 9) has something real to build from.
9. Confirm the local dev server (`vercel dev`) runs and the end-to-end call succeeds.

### 📂 Files and folders to create or modify
Per `docs/PROJECT-STRUCTURE.md`: `public/index.html`, `public/style.css`, `public/app.js`, `api/analyze.js` (stub), `.env` (gitignored), `.env.example`, `package.json`.

### 🔗 APIs, libraries, services, or tools to integrate
- Claude API via `@anthropic-ai/sdk` — confirm current recommended model string at build time rather than assuming
- `pdf-parse` and `mammoth` (installed today, used starting Day 4)
- Vercel CLI for local development

### 🧪 Testing tasks
- [ ] Backend starts without errors
- [ ] Frontend loads in browser without console errors
- [ ] Test Connection button successfully returns a real Claude response end-to-end
- [ ] API key confirmed NOT visible in browser dev tools / network tab

### 🐞 Common issues and debugging tips
- If the API key appears in frontend network requests, the call is happening client-side — move it to the backend immediately.
- CORS errors usually mean the backend route isn't returning the right headers for local dev — check the framework's docs for the exact fix.
- If the API call fails silently, log the raw error object, not just `error.message`.

### ✅ End-of-day checklist
- [ ] Project scaffold created and running locally
- [ ] End-to-end test call to Claude API succeeds
- [ ] API key secured server-side only
- [ ] Code pushed to a GitHub repo

### 📸 Expected project state and screenshots to capture
Screenshot of the running local app showing a real Claude API response displayed on screen after clicking "Test Connection."

### ➡️ Handoff notes for Day 4
Bring: confirmation the end-to-end API call works, the repo link, and which exact PDF/DOCX libraries got installed successfully. Day 4 builds real file input on top of this skeleton.

---

## Day 4 — Implementation: Resume Input & Parsing

### 🎯 Objective
Let a user upload a PDF or DOCX resume, or paste resume text directly, and reliably extract clean plain text from it.

### 📖 What I'll learn
Practical file handling in a web app, and the real-world messiness of extracting text from PDFs/DOCX files.

### 🛠 Features to build
- File upload control (PDF/DOCX) with client-side validation (file type, size limit e.g. 5MB)
- "Or paste your resume text" textarea as an alternative input
- Backend text-extraction logic for both PDF and DOCX
- Basic loading state while extraction happens

### 📝 Step-by-step implementation plan
1. Build the upload UI: drag-and-drop or file-picker button, plus a visible "or paste text instead" toggle/textarea.
2. Add client-side validation: reject non-PDF/DOCX files and files over the size limit with a clear inline message.
3. On upload, send the file to a backend endpoint (e.g. `/api/extract`).
4. Implement PDF text extraction using the chosen library; implement DOCX extraction using the chosen library.
5. Normalize extracted text (strip excess whitespace, fix obviously broken line breaks) before it's used anywhere else.
6. If extraction returns near-empty or garbled text (common with scanned/image-based PDFs), show a clear error asking the user to paste text instead — do not let it silently proceed.
7. Confirm the paste-text path and the file-upload path both converge to the same plain-text variable used later by the analysis engine.
8. Add the optional job description textarea to the same screen (simple text input, no parsing needed).

### 📂 Files and folders to create or modify
- `/frontend/app.js` — upload handling, validation, JD textarea
- `/backend/api/extract.js` — PDF/DOCX text extraction endpoint
- `/frontend/index.html` — upload + paste + JD UI elements

### 🔗 APIs, libraries, services, or tools to integrate
- PDF parsing library and DOCX parsing library selected on Day 3

### 🧪 Testing tasks
- [ ] Upload a real, text-based PDF resume → correct text extracted
- [ ] Upload a real DOCX resume → correct text extracted
- [ ] Paste resume text directly → works identically to file upload
- [ ] Upload a scanned/image PDF → clear graceful error, no crash
- [ ] Upload an oversized file → rejected with clear message
- [ ] Upload a non-resume file (e.g. random PDF) → doesn't crash (full "is this a resume" validation can wait until Day 5's AI step)

### 🐞 Common issues and debugging tips
- PDF text extraction can scramble column-based/table-based resume layouts — note this as a known limitation, don't try to solve perfectly today.
- DOCX extraction libraries sometimes include hidden formatting artifacts — strip these during normalization.
- Large files can time out on serverless functions — confirm the platform's timeout limit and keep the size cap comfortably under it.

### ✅ End-of-day checklist
- [ ] PDF upload → text extraction works on at least 2 real resumes
- [ ] DOCX upload → text extraction works on at least 1 real resume
- [ ] Paste-text path works
- [ ] JD textarea present and captured
- [ ] Bad-file edge cases handled without crashing

### 📸 Expected project state and screenshots to capture
Screenshot of the upload screen, and a screenshot showing extracted raw text (e.g., in console or a temporary debug view) from a real resume.

### ➡️ Handoff notes for Day 5
Bring: confirmation of which file types were successfully tested, and the exact shape of the plain-text variable being passed forward. Day 5 turns this text into the actual AI analysis report using the Day 2 schema.

---

## Day 5 — Implementation: AI Analysis Engine

### 🎯 Objective
Send the extracted resume (and optional JD) to Claude and reliably get back a structured, accurate analysis report matching the Day 2 JSON schema.

### 📖 What I'll learn
Practical prompt engineering for structured JSON output, and how to make LLM output reliable enough to build a UI on top of.

### 🛠 Features to build
- Backend `/api/analyze` endpoint: takes resume text (+ optional JD text) → returns the structured JSON report
- Finalized, tested analysis prompt
- JSON parsing/validation of the AI response with a retry-on-malformed-output safeguard

### 📝 Step-by-step implementation plan
1. Finalize the Day 2 draft prompt into production form. Explicitly instruct Claude to: use only content present in the resume, never invent metrics/achievements, be specific (cite the actual weak line, not generic advice), stay encouraging in tone, and output **strictly valid JSON only** matching the agreed schema, with no prose before/after.
2. Implement conditional prompt logic: if a JD is present, include it and instruct Claude to populate `jd_match`; if absent, instruct Claude to omit/null that section and focus purely on general ATS-friendliness.
3. Call the Claude API from `/api/analyze` with the finalized prompt, passing in the resume text (+ JD if present).
4. Parse the returned text as JSON. If parsing fails (the model added stray text), attempt one automatic retry with a stricter "JSON only" reminder before surfacing an error.
5. Validate the parsed JSON has all expected top-level keys before returning it to the frontend; fill any genuinely missing keys with safe defaults rather than breaking the UI.
6. Test the endpoint directly (e.g., via a simple test script or API client) with 2–3 real resumes before touching the UI.
7. Tune the prompt based on real output quality — check that weak-bullet rewrites sound natural and don't fabricate details.

### 📂 Files and folders to create or modify
- `/backend/api/analyze.js` — core analysis logic
- `/backend/prompts/analysisPrompt.js` (or `.md`) — the finalized prompt, kept separate from routing logic for easy iteration

### 🔗 APIs, libraries, services, or tools to integrate
- Claude API (confirm current recommended model at build time for best quality/cost balance)

### 🧪 Testing tasks
- [ ] Call the endpoint with a strong resume → sensible high scores, few issues
- [ ] Call it with a weak/thin resume (e.g. Yasir's own early draft, if available) → catches real, specific weaknesses
- [ ] Call it with a JD provided → `jd_match` populates correctly with a sensible percentage and gaps
- [ ] Call it without a JD → `jd_match` gracefully omitted/null, no broken UI later
- [ ] Confirm rewritten bullets don't invent facts not present in the original

### 🐞 Common issues and debugging tips
- If the model wraps JSON in markdown code fences, strip ```json fences before parsing.
- If scores feel inconsistent across similar resumes, tighten the prompt with explicit scoring criteria per section rather than leaving it fully open-ended.
- Keep prompt and parsing logic in separate files so prompt tuning doesn't risk breaking request handling.

### ✅ End-of-day checklist
- [ ] `/api/analyze` reliably returns valid JSON matching the schema
- [ ] Tested against at least 3 different real resumes
- [ ] JD-present and JD-absent paths both verified
- [ ] Malformed-output retry logic in place

### 📸 Expected project state and screenshots to capture
Screenshot of raw JSON output from `/api/analyze` for a real resume test case.

### ➡️ Handoff notes for Day 6
Bring: a sample of confirmed-working JSON output, and any prompt adjustments made. Day 6 builds the actual report UI on top of this exact JSON shape — the schema should be considered locked going into Day 6.

---

## Day 6 — Implementation: Report UI & JD-Match Display

### 🎯 Objective
Turn the JSON analysis report into a polished, easy-to-read visual report the student actually wants to look at and share.

### 📖 What I'll learn
How to translate structured AI output into a clear, well-designed UI, and how to handle conditional UI states (JD provided vs. not).

### 🛠 Features to build
- Report screen: overall score header, per-section breakdown cards, weak-bullet rewrite display, missing-skills list
- Conditional JD-match card (only rendered when `jd_match.available` is true)
- Loading state while `/api/analyze` runs
- Basic "download report" action (e.g. export as text/PDF/print-friendly view)

### 📝 Step-by-step implementation plan
1. Build the overall score header: large score number/visual (e.g. progress ring or bar) + one-line encouraging summary from `summary_feedback`.
2. Build a reusable "section card" component: section name, score/status badge (color-coded: good/needs work/missing), and a list of issues.
3. Render all six sections from the schema using that reusable card.
4. Inside the Experience/Projects card, render `weak_bullets` as before/after pairs (original vs. rewritten), visually distinct (e.g. strikethrough-style original, highlighted rewrite).
5. Inside the Skills card, render `missing_skills` as a clear tag list.
6. Conditionally render the JD-match card only when JD was submitted and `jd_match.available` is true; show match percentage prominently plus `top_gaps` as a short list.
7. Wire the full flow: upload/paste (Day 4) → loading spinner → call `/api/analyze` (Day 5) → render report (today).
8. Add a "Download Report" button that exports the visible report (simplest reliable option: browser print-to-PDF or a formatted text export).
9. Apply the Day 2 visual direction (dark/premium aesthetic) consistently across the whole flow, not just the report screen.

### 📂 Files and folders to create or modify
- `/frontend/components/ReportCard.js` (or equivalent)
- `/frontend/components/ScoreHeader.js`
- `/frontend/app.js` — wire full upload → analyze → report flow
- `/frontend/style.css` — report screen styling

### 🔗 APIs, libraries, services, or tools to integrate
- None new — this is pure frontend work consuming the Day 5 API

### 🧪 Testing tasks
- [ ] Full flow works end-to-end: upload real resume → see complete report
- [ ] Report renders correctly with JD provided
- [ ] Report renders correctly with no JD provided (JD card correctly hidden, no layout gap/bug)
- [ ] Weak-bullet before/after pairs display clearly and readably
- [ ] Download/export produces a usable, readable output
- [ ] Report is legible and polished on both desktop and mobile widths

### 🐞 Common issues and debugging tips
- If the JD card leaves an empty gap when hidden, check it's conditionally removed from the DOM, not just visually hidden.
- Long resume text or many issues can overflow cards — set sensible max-heights/scroll or truncation rules.
- Test print-to-PDF export early; browser print stylesheets often need separate CSS rules from the on-screen view.

### ✅ End-of-day checklist
- [ ] Full upload → analyze → report flow works end-to-end
- [ ] All six section cards render correctly
- [ ] JD-match card conditionally works
- [ ] Report is downloadable/exportable
- [ ] Visual design matches the intended dark/premium aesthetic

### 📸 Expected project state and screenshots to capture
Full-page screenshot of a completed report for a real resume (with JD provided), and one without JD provided, to document both states.

### ➡️ Handoff notes for Day 7
Bring: screenshots of the working report screen and confirmation the flow is stable. Day 7 adds the cover letter bonus feature on top of this same working pipeline — do not restructure the analyzer to add it; extend it.

---

## Day 7 — Implementation: Cover Letter Generator (Bonus)

### 🎯 Objective
Add the cover letter bonus feature, reusing the same resume/JD data already captured, without disrupting the working analyzer flow.

### 📖 What I'll learn
How to extend an existing AI pipeline with a second capability cleanly, and how to prompt for natural, non-generic cover letter writing.

### 🛠 Features to build
- "Generate Cover Letter" action available after a report is produced
- Backend `/api/cover-letter` endpoint using the same resume text (+ optional JD)
- Cover letter display screen/section with copy/download action

### 📝 Step-by-step implementation plan
1. **Time-check first:** if Days 4–6 ran significantly over budget, treat this entire day as optional and instead use the time to harden the analyzer (skip to Day 8 testing tasks). This feature is explicitly the first thing to cut.
2. Add a "Generate Cover Letter" button to the report screen, using the resume text and JD already in memory from the current session (no re-upload).
3. Write a focused cover letter prompt: professional but not generic/template-sounding, grounded only in real resume content, tailored to the JD when present, addressed generically when not (e.g. "Hiring Manager").
4. Implement `/api/cover-letter`, calling Claude with this prompt and the existing resume/JD text.
5. Display the returned cover letter in a clean, readable text block with a "Copy" and "Download" action.
6. Test with and without a JD provided.

### 📂 Files and folders to create or modify
- `/backend/api/cover-letter.js`
- `/backend/prompts/coverLetterPrompt.js`
- `/frontend/components/CoverLetter.js`

### 🔗 APIs, libraries, services, or tools to integrate
- Claude API (same integration pattern as Day 5, new endpoint)

### 🧪 Testing tasks
- [ ] Cover letter generates correctly using an already-analyzed resume
- [ ] Works with JD provided (tailored to role)
- [ ] Works without JD provided (generic but still resume-grounded)
- [ ] Copy and download actions both work
- [ ] Cover letter reads naturally, not templated/robotic

### 🐞 Common issues and debugging tips
- If the cover letter sounds generic, the prompt likely isn't pulling in enough specific resume detail — explicitly instruct it to reference 1–2 concrete resume items.
- Keep this endpoint fully independent of `/api/analyze` so a bug here can never break the core analyzer.

### ✅ End-of-day checklist
- [ ] Cover letter feature works end-to-end (or explicitly deferred, per the time-check in step 1)
- [ ] Core analyzer flow confirmed still fully working and untouched by this addition

### 📸 Expected project state and screenshots to capture
Screenshot of a generated cover letter for a real resume + JD pair (or, if deferred, a note confirming the decision and why).

### ➡️ Handoff notes for Day 8
Bring: current feature-complete state of the app (with or without cover letter), and a list of anything still feeling fragile. Day 8 is dedicated entirely to breaking and fixing the app.

---

## Day 8 — Testing

### 🎯 Objective
Deliberately stress-test the whole app with real and edge-case inputs, and fix everything that breaks before deployment.

### 📖 What I'll learn
How to think like a QA tester against your own product, and why error handling is a core feature, not an afterthought.

### 🛠 Features to build
No new features — this day is fixes only, prioritized by severity (crashes > wrong output > cosmetic issues).

### 📝 Step-by-step implementation plan
1. Re-test the full flow end-to-end with 3–5 real, varied resumes (different formats, lengths, experience levels — including Yasir's own resume).
2. Test every edge case explicitly:
   - Empty file upload / no input submitted
   - Extremely short resume (a few lines)
   - Extremely long resume (multiple pages)
   - Non-English or mixed-language content
   - Non-resume document uploaded by mistake
   - JD pasted but resume missing, and vice versa
   - Very long JD text
   - Slow/failed network request to the AI API (simulate if possible)
3. For every failure found, add a clear, user-friendly error message — never a raw crash, blank screen, or console-only error.
4. Check loading states appear correctly during every AI call (no frozen UI with no feedback).
5. Test on both desktop and mobile browser widths.
6. Do a final visual pass: consistent spacing, no overflow/cut-off text, consistent color usage across screens.
7. Ask at least one other person (classmate/friend) to try it cold, with zero guidance, and watch where they get confused or stuck.

### 📂 Files and folders to create or modify
- Fixes across existing files as issues are found — no new files expected unless a shared error-handling utility is needed (e.g. `/frontend/utils/errorMessages.js`)

### 🔗 APIs, libraries, services, or tools to integrate
None new.

### 🧪 Testing tasks
(This entire day is the testing task list — see step 2 above.)

### 🐞 Common issues and debugging tips
- If real-world resumes still extract poorly, don't chase perfect parsing — ensure the paste-text fallback is prominently offered as the reliable alternative.
- If the AI occasionally returns malformed JSON under real load, confirm the Day 5 retry logic is actually triggering — log when it does.
- Watch for rate limits if testing rapidly and repeatedly — space out test calls if needed.

### ✅ End-of-day checklist
- [ ] All edge cases in step 2 tested and handled gracefully
- [ ] No raw crashes or blank-screen failures anywhere in the flow
- [ ] At least one outside person has tested it and given feedback
- [ ] Mobile and desktop both checked
- [ ] Final visual consistency pass complete

### 📸 Expected project state and screenshots to capture
Screenshots of at least 2 handled error states (e.g. bad file upload, empty input) showing the friendly error messages.

### ➡️ Handoff notes for Day 9
Bring: confirmation the app is stable across the tested scenarios, and a short list of any known, accepted limitations (e.g. "scanned PDFs not supported — use paste instead"). Day 9 deploys this exact tested state — no new features get added during deployment.

---

## Day 9 — Deployment

### 🎯 Objective
~~Deploy the tested v1.0 to a live, public URL~~ **Superseded by Day 6:** the app was already deployed and verified live on Day 6, ahead of schedule, at the person's request. Today's objective instead becomes: re-verify the live production app against everything built in Days 7-8 (cover letter, testing fixes), confirm no regressions, and harden anything found. If Days 7-8 added real code changes, redeploy (`vercel --prod`) and re-run the production verification checklist from `docs/DAY6-SUMMARY.md`.

### 📖 What I'll learn
End-to-end deployment of a full-stack AI web app, including securely managing secrets in a production environment.

### 🛠 Features to build
No new features — deployment and production configuration only.

### 📝 Step-by-step implementation plan
1. Confirm the deployment target decided on Day 2 is still appropriate; if not, choose the simplest reliable option compatible with the chosen stack.
2. Push the final, tested code to the connected GitHub repository.
3. Configure the production environment variables (Claude API key) securely on the hosting platform — never commit them to the repo.
4. Deploy the frontend and backend (or the combined app, depending on architecture).
5. Once live, re-run a subset of Day 8's test cases directly against the production URL (not localhost) — full flow, at least one edge case, mobile check.
6. Check production logs/error reporting for anything that didn't show up locally (e.g. cold-start timeouts, missing env vars).
7. Set a custom, clean project name for the live URL if the platform allows it.
8. Confirm the API key still isn't exposed anywhere in production (check network tab again, in production this time).

### 📂 Files and folders to create or modify
- Deployment/platform configuration file(s) specific to the chosen host (exact file depends on Day 2's stack choice)
- `README.md` updated with the live URL and basic run instructions

### 🔗 APIs, libraries, services, or tools to integrate
- The chosen hosting/deployment platform (no paid tiers unless explicitly requested)

### 🧪 Testing tasks
- [ ] Full flow works on the live production URL, not just localhost
- [ ] At least one edge case re-verified in production
- [ ] Mobile check on the live URL
- [ ] API key confirmed not exposed in production network requests
- [ ] Cold start / first-load performance is acceptable (not a multi-minute wait)

### 🐞 Common issues and debugging tips
- Environment variables set locally do NOT automatically carry over to the host — they must be set again in the platform's dashboard/settings.
- If it works locally but fails in production, check build logs first — most failures are missing env vars or a build-step mismatch.
- Serverless functions may have shorter timeouts in production than local dev — if large resumes time out, confirm the file-size cap from Day 4 is actually enforced.

### ✅ End-of-day checklist
- [ ] App is live at a public URL
- [ ] Full flow verified working in production
- [ ] Secrets confirmed secure in production
- [ ] README updated with live link

### 📸 Expected project state and screenshots to capture
Screenshot of the live app running at its public URL (browser address bar visible), showing a completed report.

### ➡️ Handoff notes for Day 10
Bring: the live URL, confirmation production testing passed, and this document's full history. Day 10 is polish, documentation, and launch packaging — not new features.

---

## Day 10 — Maintenance & Launch

### 🎯 Objective
Final polish pass, documentation, and packaging the finished product for public sharing (LinkedIn, resume, portfolio) as the capstone's closing deliverable.

### 📖 What I'll learn
How to close out a shipped product professionally — documentation, public presentation, and defining what comes next.

### 🛠 Features to build
No new features. Polish, documentation, and packaging only. Any new feature idea today gets written down for future scope, not built.

### 📝 Step-by-step implementation plan
1. Do one final walkthrough of the live app as a brand-new user would experience it, fixing only small, safe cosmetic issues (spacing, wording, minor color contrast).
2. Finalize `README.md`: project description, live link, screenshots, tech stack used, and instructions to run locally.
3. Write a short "Future Scope" note in the README referencing the excluded features from the PRD (interview prep, LinkedIn optimization, accounts) as the natural v2 roadmap.
4. Prepare 2–4 clean screenshots of the app (landing screen, a full report, and the cover letter) for use in the LinkedIn launch post and portfolio.
5. Draft a short LinkedIn launch post: what the product does, who it's for, what was learned, and the live link — consistent with the ABTalks challenge documentation style already established.
6. Add the live project to the personal portfolio site alongside existing projects (NutriScope, YSENTRY, etc.), following the same presentation pattern already used there.
7. Do a final sanity check: reload the live URL fresh (e.g. incognito window) and run through the core flow one last time end-to-end.

### 📂 Files and folders to create or modify
- `README.md` (final version)
- `/docs/screenshots/` (for portfolio + LinkedIn use)

### 🔗 APIs, libraries, services, or tools to integrate
None new.

### 🧪 Testing tasks
- [ ] Fresh incognito-window run-through of the full live flow, start to finish
- [ ] All links in README and LinkedIn post work correctly

### 🐞 Common issues and debugging tips
- Resist last-minute feature additions today — anything new risks destabilizing a tested, deployed app with no time left to re-test.
- If a "quick fix" touches backend logic, re-run the relevant Day 8 test cases before considering it done.

### ✅ End-of-day checklist
- [ ] Final walkthrough complete, no known broken states
- [ ] README finalized with live link and screenshots
- [ ] Future Scope section written
- [ ] LinkedIn launch post drafted
- [ ] Portfolio updated with the new project
- [ ] v1.0 confirmed live, stable, and shareable

### 📸 Expected project state and screenshots to capture
Final set of polished screenshots for LinkedIn/portfolio use, and a screenshot of the finished README.

### ➡️ Project closure
This closes the 10-day capstone. v1.0 is live, tested, documented, and shareable. Any new feature ideas captured along the way become the seed list for a future v2 planning session.

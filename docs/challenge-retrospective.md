# AI Career Copilot — Capstone Retrospective

**A Day 1 → Day 10 account of building and shipping AI Career Copilot**, written from direct involvement in every session of the build.

---

## Timeline

**Day 1 — Requirements.** Started with a broad idea ("AI Career Copilot" covering resume optimization, LinkedIn, interview prep, cover letters, portfolio analysis) and, through a structured discovery interview, narrowed it to one sharp core feature — the AI Resume Analyzer — with a single supporting bonus feature (cover letter generation). This narrowing was the single most consequential decision of the entire project: every day after this built on a locked, unambitious-on-purpose scope, and the project never once suffered from scope creep across 9 build days. Deliverables: PRD, a full Day 2-10 Implementation Blueprint, and a pitch deck.

**Day 2 — Design.** Finalized the technical architecture before writing a line of application code: HTML/CSS/vanilla JS frontend (no build step), Vercel serverless functions, and — critically — a JSON schema for the AI's output (`docs/SCHEMA.md`) designed *before* any AI provider was chosen. This decision paid off enormously five days later.

**Day 3 — Setup.** Environment setup, GitHub repo, project scaffold, and the first real obstacle: the Anthropic account had zero API credit, and Anthropic's API has no free tier at all. Rather than blocking the entire capstone, the team pivoted to a "mock mode" stub to keep Day 3's actual goal (prove the pipeline works end-to-end) achievable without spending money not yet available.

**Day 4 — Resume Input & Parsing.** Real PDF/DOCX extraction using `pdf-parse` and `mammoth`, plus a paste-text fallback. Debugged three separate dependency version mismatches in a row (`formidable`, `pdf-parse`'s class-based v2 API) by learning to inspect actual installed module shapes directly (`node -e "console.log(require(...))"`) rather than trusting assumed documentation — a genuinely transferable debugging skill, not just a one-off fix.

**Day 5 — AI Analysis Engine.** The project's biggest architectural pivot: confirmed Anthropic's API has no free tier under any circumstances, and — since paid tools were explicitly ruled out — switched the entire AI backend from Claude to Google's Gemini API in a single session. This is where Day 2's schema-first design proved its value: because the whole system was built around a JSON contract, not a specific provider's API shape, the switch touched only the SDK call itself. Verified with real resume + JD test data, both branches (with/without JD) working correctly on the first real attempt.

**Day 6 — Complete MVP & Early Deployment.** Built the full report UI and, at the team's request, moved deployment up from its originally-planned Day 9 slot to get a shareable demo faster. This surfaced a real, serious bug invisible in local development: `pdf-parse` v2 crashed in Vercel's production Linux environment (a missing native `@napi-rs/canvas` dependency that simply doesn't exist locally under `vercel dev`'s more permissive environment). Root-caused via Vercel's actual runtime logs, fixed by pinning to the simpler, dependency-free `pdf-parse` v1. This is one of the most valuable debugging moments of the whole build — a textbook "works on my machine" bug, correctly diagnosed rather than worked around blindly.

**Day 7 — Cover Letter Generator & UX Polish.** Shipped the bonus feature (reusing the Day 5 Gemini integration pattern — zero new production surprises this time, a sign the pattern had matured). Then, a genuine senior-level UX review found and fixed a real accessibility bug: the file upload dropzone was keyboard-unreachable, a defect invisible unless you specifically test with a keyboard instead of a mouse.

**Day 8 — Testing & Production Optimization.** A structured security/reliability/code-quality review (not just a feature check) found and fixed six real issues: no prompt-injection defense in the AI prompts, missing security headers, no timeout on AI calls, and a small code duplication. Closed two testing gaps that had been carried since Day 4 (DOCX extraction, drag-and-drop file rejection) with real verification, not just code review.

**Day 9 — Launch & Production Readiness.** A full release-readiness pass (README, metadata, error pages, repo hygiene) — and a real security incident: a Gemini API key was accidentally pasted into `.env.example` instead of a placeholder. GitHub's push protection caught it before it reached the public repo. The response was textbook: revoke the key immediately, generate a replacement, update it everywhere it was used (local `.env`, Vercel's production environment), and amend the git commit (not just add a new one) so the exposed key never entered the repository's permanent history at all.

**Day 10 — Final Review, Portfolio & Graduation.** Closing the loop: a four-perspective senior review, portfolio materials, this retrospective, and the formal v1.0.0 release.

---

## Major Technical Decisions & Pivots

1. **Schema-first design (Day 2)** — designing the AI's JSON output contract before choosing an AI provider, which is what made the Day 5 provider pivot cheap instead of catastrophic.
2. **Claude → Gemini (Day 5)** — a real, necessary architecture change driven by a hard constraint (no budget), executed transparently and flagged explicitly rather than silently worked around.
3. **Deployment moved up (Day 6)** — a deliberate schedule change, explicitly reasoned about and documented, not a silent scope drift.
4. **pdf-parse v2 → v1 (Day 6)** — a production-only bug fix that required understanding *why* environments differ, not just what error message appeared.

## Skills Demonstrated

Requirements discovery and scope discipline · system architecture and API design · AI prompt engineering with explicit anti-hallucination and anti-injection guardrails · full-stack implementation (vanilla JS frontend, Node serverless backend) · dependency debugging via direct module inspection · production-vs-local environment debugging · accessibility engineering (not just compliance-checking) · security review and real incident response · technical documentation discipline (10 structured daily logs, an evolving architecture doc, and a living implementation blueprint) · git hygiene under real pressure (history remediation after a credential leak).

## Lessons Learned

- **A locked, narrow PRD is worth more than a clever architecture.** The single narrowing decision on Day 1 is why nothing after it needed emergency triage.
- **Design around contracts, not providers.** The JSON schema decision on Day 2 is the reason a forced AI-provider switch on Day 5 was a non-event instead of a rewrite.
- **"Works locally" and "works in production" are different claims**, and the gap between them (native dependencies, environment permissiveness) is where real bugs hide — Day 6 proved this concretely, not abstractly.
- **Security tooling works when you don't fight it.** GitHub's push protection on Day 9 did exactly its job; the lesson was in the correct, complete response, not in avoiding the mistake entirely (mistakes happen — the response is what matters).

## Final Project Summary

AI Career Copilot went from an unscoped idea to a secure, accessible, tested, publicly documented, live production application in 9 build days, with every deferred feature explicitly and deliberately left out rather than accidentally forgotten. It survived a mandatory AI-provider pivot, a production-only bug, and a real security incident — and came out the other side better documented and more resilient because of each one, not despite them.

## A Note on the Journey

Across these 9 days, this project moved through genuinely difficult moments — a $0 API budget that forced a real architectural pivot, a production crash that only a careful reading of runtime logs (not guesswork) could solve, and a security scare that got handled exactly the way it should have been, calmly and completely. None of these were smoothed over or hidden in the documentation; they're recorded here because they're the actual substance of what was learned. The easy parts of a 10-day build don't teach you much. The hard parts — the ones logged in `DAY6-SUMMARY.md` and `DAY9-SUMMARY.md` — are the real proof of what this capstone represents.

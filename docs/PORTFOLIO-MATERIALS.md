# AI Career Copilot — Portfolio Materials

Ready-to-use copy for your resume, LinkedIn, GitHub profile, and interviews.

---

## Project Descriptions

### Short (LinkedIn headline / GitHub bio, ~140 chars)
AI Career Copilot — an AI resume analyzer that gives students honest, detailed feedback: ATS scoring, missing skills, and a tailored cover letter.

### Medium (portfolio site card, ~50 words)
AI Career Copilot is a full-stack AI product that analyzes resumes section-by-section, scores ATS-friendliness, detects missing skills, rewrites weak bullet points, and generates tailored cover letters. Built solo in 9 days — from requirements through a hardened, security-reviewed, publicly deployed v1.0.0.

### Long (README / case study intro, ~120 words)
AI Career Copilot is a resume intelligence platform built for final-year students writing their first professional resume. It combines a Google Gemini-powered analysis engine with a fully accessible, responsive frontend to deliver a detailed diagnostic report: per-section ATS scoring, missing-skills detection, before/after bullet-point rewrites grounded strictly in the candidate's real experience, job-description match scoring, and an AI-generated tailored cover letter — all with zero accounts, zero data storage, and a genuinely free tech stack. Built solo across a 9-day sprint following a full SDLC (requirements → design → implementation → security review → production hardening → public launch), including a mid-project pivot from a paid AI provider to a free one, a real production bug diagnosed and fixed, and a security incident handled correctly using GitHub's push protection.

---

## Resume Bullet Points

Pick 2-4 depending on the role and space available:

- Designed and shipped a full-stack AI web application (AI Career Copilot) solo across a 9-day sprint, following a complete SDLC from requirements gathering through public production deployment
- Built a structured AI analysis pipeline using Google Gemini's API with strict JSON-schema validation, retry logic, and timeout handling, achieving reliable structured output across all tested cases
- Diagnosed and resolved a production-only serverless deployment failure by isolating a native-dependency incompatibility (pdf-parse's rendering engine) invisible in local development, then re-architected the fix and verified it live
- Executed a live architecture pivot — migrating the AI provider from Anthropic Claude to Google Gemini mid-project — in under a day with zero downtime, enabled by schema-first API design that decoupled the AI provider from application logic
- Implemented and verified WCAG-aligned accessibility improvements (keyboard navigation, ARIA live regions, reduced-motion support), catching and fixing a real keyboard-accessibility defect in a custom file-upload component
- Conducted a self-directed security review that identified and mitigated a prompt-injection vulnerability in an LLM-facing application, and correctly responded to a real API-key exposure incident using git history remediation and credential rotation
- Documented the full build process across 9 structured daily technical logs, including architecture decisions, API specifications, and a comprehensive project retrospective

---

## Interview Talking Points

**"Tell me about a project you're proud of."**
Lead with AI Career Copilot. Frame it as: solo full-stack AI product, real users get real value (resume feedback), built with genuine engineering discipline (SDLC, documentation, testing) rather than "vibe coded." Mention it's live and you can share the link on the spot.

**"Tell me about a time you debugged something difficult."**
The `pdf-parse` production crash (Day 6). Walk through: worked perfectly locally, crashed only in production, the actual debugging process (reading Vercel's runtime logs, not just guessing), root-causing it to a native dependency (`@napi-rs/canvas`) that doesn't exist in the serverless environment, and the fix (pinning to a simpler, dependency-free major version). This is a strong answer because it shows you understand *why* local-vs-production environments differ, not just that they can.

**"Tell me about a time you had to change direction mid-project."**
The Claude→Gemini pivot (Day 5). You discovered Anthropic's API had no free tier, and rather than either quietly paying for it or blocking the project, you flagged the conflict explicitly, evaluated real alternatives, and executed the switch in under a day. Emphasize: it worked cleanly because you'd designed around a JSON schema contract, not a specific AI provider's API shape — a genuine lesson in decoupling.

**"How do you handle security in your projects?"**
Two real examples: (1) proactively added prompt-injection guardrails to your AI prompts during a self-directed security review, before anyone found the issue for you; (2) when a real API key was accidentally committed, GitHub's push protection caught it, and you executed the correct incident response — revoke, rotate, verify no history leak, redeploy — rather than panicking or ignoring it.

**"What would you do differently / what's next?"**
Reference `future-scope.md` and `30-day-growth-plan.md` — you have a concrete, reasoned answer instead of "I don't know," which signals product thinking beyond just shipping code.

---

## Demo Script (for a live walkthrough, ~90 seconds)

> "This is AI Career Copilot — I built it as a 9-day solo capstone. The problem: most students write their first resume with zero feedback before it hits an ATS system or a recruiter's inbox.
>
> [Upload a resume] I'll upload a real resume here — it extracts the text server-side using pdf-parse.
>
> [Click Analyze] This calls Gemini with a strict JSON schema — you can see it's scoring six sections independently: contact info, summary, education, experience, skills, and ATS formatting.
>
> [Scroll to weak bullets] Here's something I'm proud of — it rewrites weak bullet points, but only using facts already in the resume. I added an explicit guardrail against the AI inventing achievements, which matters a lot for something giving career advice.
>
> [Click Generate Cover Letter] And it reuses the same resume data to generate a tailored cover letter — no re-upload needed.
>
> The whole thing is stateless — no accounts, no database — deployed on Vercel's free tier, running on Gemini's free tier. I documented the entire 9-day build process, including a production bug I found and fixed, and a security incident I handled when an API key almost got committed. It's live right now if you want to try it."

---

## Suggested GitHub Topics

Add these under your repo's **About** section (gear icon) → Topics:

```
ai
resume-builder
gemini-api
vercel
serverless
javascript
career-tools
ats
resume-analyzer
nodejs
```

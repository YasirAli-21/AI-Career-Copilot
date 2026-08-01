# Day 5 Summary — AI Analysis Engine

**Date:** August 1, 2026
**Status:** ✅ Core AI feature complete and verified

## Major Decision: Switched AI Provider from Claude to Gemini

Day 3 flagged that the Anthropic account had no API credit. Going into Day 5, it was confirmed **Anthropic's API has no free tier at all** — a small payment is unavoidable to use Claude programmatically. Since paid tools were explicitly off the table, the project switched its AI provider from Anthropic Claude to **Google's Gemini API**, which has a genuinely free tier (no credit card required).

**What changed:**
- `ANTHROPIC_API_KEY` → `GEMINI_API_KEY` in `.env`
- `@anthropic-ai/sdk` → `@google/generative-ai` (new dependency; old one left installed but unused, safe to remove later)
- Model: `gemini-flash-lite-latest` (free-tier alias, auto-tracks the newest stable Flash-Lite model)

**What did NOT change:** the entire architecture, the JSON schema (`docs/SCHEMA.md`), the API contract (`docs/API.md`), and the prompt's rules and guardrails. The switch only touched the AI SDK call itself — proof that designing around a clear JSON schema (Day 2) paid off, since the provider became a swappable implementation detail rather than something baked throughout the codebase.

**Docs updated today:** `docs/ENVIRONMENT.md`, `docs/ARCHITECTURE.md`.

## What Was Built Today

- `prompts/analysisPrompt.js` — production prompt generating the exact `AnalysisReport` JSON shape, with explicit guardrails: use only real resume content, never invent achievements, stay encouraging, JD-matching conditional on whether a JD was submitted.
- `api/analyze.js` — real implementation:
  - Calls Gemini with `responseMimeType: "application/json"` for reliable structured output
  - Retries once with a stricter reminder if the first response fails to parse
  - Validates and backfills every section of the schema server-side, so a partial/malformed AI response can never break the frontend
  - Forces `jd_match.available` based on whether a JD was actually submitted, regardless of what the AI returns — keeps the contract unambiguous

## Verified Working

| Test | Result |
|---|---|
| Real resume, no JD | ✅ Full valid report — all 6 sections, sensible scores, grounded weak-bullet rewrites (no invented facts) |
| Real resume + real JD | ✅ `jd_match.available: true`, 55% match score, gaps correctly identified FastAPI/Docker/AWS/GCP from the JD text |
| Malformed-JSON retry logic | Present in code; not forced-tested today (both live calls returned valid JSON on the first try) |

## Known Gap — Track for Day 8

The retry-on-malformed-JSON path (`api/analyze.js`) has not been forced to trigger — both real test calls succeeded on the first attempt. The logic exists and follows the documented design, but hasn't been observed running. Worth a deliberate stress test during Day 8 (Testing) if time allows.

## Ready for Day 6?

**Yes.** The AI engine returns exactly the JSON shape the Day 6 report UI is designed to consume — no schema surprises, no blocking issues.

# AI Career Copilot — Environment Reference

## Environment Variables

| Variable | Required | Where it's set | Purpose |
|---|---|---|---|
| `GEMINI_API_KEY` | Yes | Local: `.env` (gitignored). Production: Vercel Dashboard → Project Settings → Environment Variables | Authenticates all Gemini API calls from `api/analyze.js`, `api/cover-letter.js`. Free tier, no credit card required. Never exposed to the browser — read only inside serverless functions. |

**Day 5 change:** originally scoped as `ANTHROPIC_API_KEY` (Claude API). Switched to Google's Gemini API (`gemini-flash-lite-latest`) on Day 5 because Anthropic's API has no free tier and this project needed a genuinely free option. See `docs/DAY5-SUMMARY.md` for full rationale. All prompts and JSON schema logic are provider-agnostic and required no architectural changes — only the SDK/API call itself changed.

No other environment variables are needed for v1.0 (no database URL, no auth secrets — the product is stateless per the PRD).

## Local Development Tools

| Tool | Version confirmed | Purpose |
|---|---|---|
| Node.js | v24.18.0 | JavaScript runtime |
| npm | 11.16.0 | Package manager |
| Vercel CLI | 58.1.0 | Local dev server that mirrors production serverless behavior (`vercel dev`) |
| Git | (pre-existing) | Version control |

## npm Dependencies (`package.json`)

| Package | Purpose | Used starting |
|---|---|---|
| `@google/generative-ai` | Official Gemini API client | Day 5 |
| `pdf-parse` | PDF → plain text extraction. **Pinned to v1.1.1** (Day 6) after v2 crashed in production — see `docs/DAY6-SUMMARY.md` | Day 4, fixed Day 6 |
| `mammoth` | DOCX → plain text extraction | Day 4 |
| `formidable` | Multipart file upload parsing | Day 4 |
| `@anthropic-ai/sdk` | No longer used as of Day 5 — safe to remove in a future cleanup pass | Day 3 only |

## Configuration Files

| File | Purpose | Committed to Git? |
|---|---|---|
| `.env` | Real local secrets (API key) | ❌ No — gitignored |
| `.env.example` | Template showing required variables, no real values | ✅ Yes |
| `.gitignore` | Excludes `node_modules/`, `.env`, `.vercel/` from version control | ✅ Yes |
| `package.json` | Dependency list + project metadata | ✅ Yes |
| `package-lock.json` | Exact dependency version lockfile | ✅ Yes |
| `vercel.json` | **Added Day 8.** Security headers, static asset caching, explicit 30s function timeout | ✅ Yes |
| `lib/config.js` | **Added Day 8.** Shared `MODEL_NAME` + `AI_CALL_TIMEOUT_MS`, removes prior duplication | ✅ Yes |
| `lib/withTimeout.js` | **Added Day 8.** Wraps AI calls with a timeout for graceful failure | ✅ Yes |

## Hosting Environment (Day 9)

- **Platform:** Vercel (free tier)
- **Deployment trigger:** auto-deploy on push to `main` (connected Day 9)
- **Runtime:** Node.js serverless functions, auto-detected from the `api/` folder — no custom server config required for v1.0


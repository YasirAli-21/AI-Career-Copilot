# AI Career Copilot — Environment Reference

## Environment Variables

| Variable | Required | Where it's set | Purpose |
|---|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Local: `.env` (gitignored). Production: Vercel Dashboard → Project Settings → Environment Variables | Authenticates all Claude API calls from `api/analyze.js`, `api/cover-letter.js`. Never exposed to the browser — read only inside serverless functions. |

No other environment variables are needed for v1.0 (no database URL, no auth secrets — the product is stateless per the PRD).

## Local Development Tools

| Tool | Version confirmed today | Purpose |
|---|---|---|
| Node.js | v24.18.0 | JavaScript runtime |
| npm | 11.16.0 | Package manager |
| Vercel CLI | 58.1.0 | Local dev server that mirrors production serverless behavior (`vercel dev`) |
| Git | (pre-existing) | Version control |

## npm Dependencies (`package.json`)

| Package | Purpose | Used starting |
|---|---|---|
| `@anthropic-ai/sdk` | Official Claude API client | Day 3 (stub), full use Day 5/7 |
| `pdf-parse` | PDF → plain text extraction | Day 4 |
| `mammoth` | DOCX → plain text extraction | Day 4 |

## Configuration Files

| File | Purpose | Committed to Git? |
|---|---|---|
| `.env` | Real local secrets (API key) | ❌ No — gitignored |
| `.env.example` | Template showing required variables, no real values | ✅ Yes |
| `.gitignore` | Excludes `node_modules/`, `.env`, `.vercel/` from version control | ✅ Yes |
| `package.json` | Dependency list + project metadata | ✅ Yes |
| `package-lock.json` | Exact dependency version lockfile | ✅ Yes |

## Hosting Environment (Day 9)

- **Platform:** Vercel (free tier)
- **Deployment trigger:** auto-deploy on push to `main` (connected Day 9)
- **Runtime:** Node.js serverless functions, auto-detected from the `api/` folder — no custom server config required for v1.0

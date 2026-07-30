# AI Career Copilot — Setup Guide

Follow this to get the project running from a completely fresh clone.

## Prerequisites
- **Node.js** (v18+; this project was set up with v24.18.0) — https://nodejs.org, LTS version
- **npm** (comes bundled with Node.js)
- **Git** (for cloning/version control)
- A **Claude API key** from https://console.anthropic.com → API Keys → Create Key

## 1. Clone the repository
```
git clone https://github.com/YasirAli-21/AI-Career-Copilot.git
cd AI-Career-Copilot
```

## 2. Install dependencies
```
npm install
```
This installs everything listed in `package.json`:
- `@anthropic-ai/sdk` — Claude API client
- `pdf-parse` — PDF text extraction (used starting Day 4)
- `mammoth` — DOCX text extraction (used starting Day 4)

## 3. Install the Vercel CLI (global, one-time)
```
npm install -g vercel
```
Verify with:
```
vercel --version
```

## 4. Set up environment variables
1. Copy the template: `cp .env.example .env` (or manually create `.env` and copy the contents of `.env.example`)
2. Open `.env` and paste your real Claude API key:
   ```
   ANTHROPIC_API_KEY=sk-ant-your-real-key-here
   ```
3. **Never commit `.env`.** It's already listed in `.gitignore` — verify with `git check-ignore -v .env` before your first commit.

## 5. Run the project locally
```
vercel dev
```
This starts a local server that behaves like production — it serves `public/` as static files and runs everything in `api/` as serverless functions.

Open the URL it prints (typically `http://localhost:3000`) in your browser.

## 6. Verify it's working
1. You should see the "AI Career Copilot" landing page with a **Test Connection** button.
2. Click it.
3. You should see a green success message showing a raw JSON response from Claude, confirming: browser → Vercel function → Claude API → back to browser, all working.

If you see a red error message instead, see the Troubleshooting section in `DAY3-SUMMARY.md`.

## Production Environment Variables
When deploying to Vercel (Day 9), the same `ANTHROPIC_API_KEY` must be added again in the Vercel dashboard under Project Settings → Environment Variables — local `.env` values are never automatically synced to production.

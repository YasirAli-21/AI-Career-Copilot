# AI Career Copilot — Project Structure

**Status:** Finalized Day 2 | Matches Vercel's convention for static + serverless-function projects

## Folder Tree

```
AI-Career-Copilot/
├── api/                          # Vercel serverless functions (backend) — auto-routed to /api/*
│   ├── extract.js                # POST /api/extract   — Day 4
│   ├── analyze.js                # POST /api/analyze    — Day 5
│   └── cover-letter.js           # POST /api/cover-letter — Day 7
│
├── prompts/                      # AI prompts, kept separate from routing logic
│   ├── analysisPrompt.js         # Core analysis prompt — Day 5
│   └── coverLetterPrompt.js      # Cover letter prompt — Day 7
│
├── public/                       # Static frontend — served directly by Vercel
│   ├── index.html                # Single-page shell — Day 3/6
│   ├── style.css                 # All styling — Day 6
│   ├── app.js                    # Upload, validation, screen state, API calls — Day 3/4/6/7
│   └── components/               # Small reusable render functions (not a framework — plain JS)
│       ├── reportCard.js         # Section card renderer — Day 6
│       └── scoreHeader.js        # Overall score display — Day 6
│
├── design/                       # Day 2 design artifacts — reference only, not shipped code
│   ├── output-schema.json        # Canonical AnalysisReport shape (mirrors SCHEMA.md)
│   └── ux-flow.md                # Original Day 2 flow notes
│
├── docs/                         # All capstone documentation, dated by day
│   ├── PRD.md                    # Day 1
│   ├── IMPLEMENTATION-BLUEPRINT.md   # Day 1 (updated Day 2)
│   ├── ARCHITECTURE.md           # Day 2
│   ├── SCHEMA.md                 # Day 2
│   ├── API.md                    # Day 2
│   ├── UI-WIREFRAMES.md          # Day 2
│   ├── PROJECT-STRUCTURE.md      # Day 2 (this file)
│   └── PROJECT-LOG.md            # Running daily log, updated every day
│
├── .env                          # Local-only secrets (CLAUDE_API_KEY) — gitignored, never committed
├── .env.example                  # Template showing required env vars, safe to commit
├── .gitignore                    # Excludes node_modules, .env, .vercel
├── vercel.json                   # Vercel config (only if needed — added Day 3/9 if defaults aren't sufficient)
├── package.json                  # Dependencies: pdf-parse, mammoth, @anthropic-ai/sdk
├── README.md                     # Project overview, live link (added Day 10), run instructions
└── LICENSE                       # MIT (already created)
```

## Folder Responsibilities

| Folder/File | Responsibility | Grows during |
|---|---|---|
| `/api` | All backend logic. Every file here is a Vercel serverless function, auto-mapped to a URL route by filename. No file in here should ever return HTML — JSON responses only, per `API.md`. | Days 4, 5, 7 |
| `/prompts` | Isolates AI prompt text from request-handling code, so prompt tuning (Day 5, Day 7) never risks breaking parsing/validation logic. | Days 5, 7 |
| `/public` | Everything the browser downloads directly. No build step — plain HTML/CSS/JS, matching the finalized stack. | Days 3, 4, 6, 7 |
| `/public/components` | Small, focused render functions (not React components — just organized plain-JS functions) to keep `app.js` from becoming one giant file as the report UI grows. | Day 6 |
| `/design` | Frozen Day 2 reference artifacts. Not imported by any running code — exists so future days can check "does this still match the original design?" | Day 2 (frozen after) |
| `/docs` | All markdown deliverables from every day, kept in the repo (not just downloaded locally) so the project is self-documenting for anyone who opens the GitHub repo. | Every day |
| `.env` / `.env.example` | Keeps the Claude API key out of source control while documenting exactly what env vars a fresh clone needs. | Day 3 |

## Why This Structure

- **Matches Vercel's zero-config convention** (`/api` for functions, everything else served as static) — no custom server config needed, which keeps Day 9 deployment simple.
- **Mirrors the three-endpoint architecture exactly** — anyone (including a fresh AI conversation on any future day) can look at `/api` and immediately see the three features from the PRD.
- **Separates "shipped code" from "process artifacts"** (`/design`, `/docs`) — the running app never depends on files meant purely for documentation, so cleaning up for launch (Day 10) never risks breaking functionality.
- **No framework-driven structure** (no `/src`, `/components` in the React sense, no build config) — consistent with the deliberately simple, no-build-step frontend decision.

## Files to Create Today (Day 2 scaffolding — structure only, no logic yet)

```
mkdir api prompts public public/components design docs
touch api/extract.js api/analyze.js api/cover-letter.js
touch prompts/analysisPrompt.js prompts/coverLetterPrompt.js
touch public/index.html public/style.css public/app.js
touch public/components/reportCard.js public/components/scoreHeader.js
touch design/output-schema.json design/ux-flow.md
touch .env.example
```

(Exact terminal commands for you to run are provided in the End-of-Day section of today's session.)

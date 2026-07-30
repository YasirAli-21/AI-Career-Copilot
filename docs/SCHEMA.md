# AI Career Copilot — Data Schema

**Status:** Finalized Day 2

## Why there are no database tables here

The PRD (Section 5.3, locked Day 1) requires v1.0 to be **fully stateless**: no accounts, no saved history, every session is upload → analyze → review → leave. There is deliberately **no database** in this architecture (see ARCHITECTURE.md §6).

What this document defines instead: the **exact JSON data contracts** that flow between the frontend and the three serverless functions. These contracts serve the same role a database schema normally would — they are the single source of truth every implementation day builds against, and they're validated below against every relevant PRD user story.

---

## 1. Resume Analysis Report — `AnalysisReport`

This is the object returned by `POST /api/analyze` and consumed directly by the Day 6 report UI.

```json
{
  "overall_score": 78,
  "summary_feedback": "Solid foundation with clear project experience. A few quick fixes to your Skills and Formatting sections would meaningfully raise this score.",
  "sections": {
    "contact_info": {
      "score": 100,
      "status": "good",
      "issues": []
    },
    "summary": {
      "score": 60,
      "status": "needs_work",
      "issues": [
        "No summary/objective section found — recruiters skim this first"
      ]
    },
    "education": {
      "score": 90,
      "status": "good",
      "issues": []
    },
    "experience_projects": {
      "score": 65,
      "status": "needs_work",
      "issues": [
        "Bullet points describe responsibilities, not outcomes"
      ],
      "weak_bullets": [
        {
          "original": "Worked on a machine learning project for resume screening",
          "rewritten": "Built an NLP-based resume screening system using Python and scikit-learn, automating candidate shortlisting"
        }
      ]
    },
    "skills": {
      "score": 55,
      "status": "needs_work",
      "missing_skills": ["Git", "REST APIs", "SQL"]
    },
    "ats_formatting": {
      "score": 85,
      "status": "good",
      "issues": ["Uses a two-column layout, which some ATS parsers misread"]
    }
  },
  "jd_match": {
    "available": true,
    "match_percent": 72,
    "top_gaps": [
      "Job description emphasizes 'cloud deployment' — not mentioned in resume",
      "Requires 'FastAPI' experience — not present"
    ]
  }
}
```

### Field notes
| Field | Type | Notes |
|---|---|---|
| `overall_score` | integer 0–100 | Weighted average across sections (weighting defined in the analysis prompt, Day 5) |
| `summary_feedback` | string | 2–3 sentences, always encouraging per PRD tone requirement |
| `sections.*.score` | integer 0–100 | Per-section score |
| `sections.*.status` | enum: `"good"` \| `"needs_work"` \| `"missing"` | Drives the color-coded badge in the UI (Day 6) |
| `sections.*.issues` | string[] | Can be empty array; never null |
| `experience_projects.weak_bullets` | array of `{original, rewritten}` | Only the weakest lines, not every bullet (PRD: "example rewritten bullets," not full rewrite) |
| `skills.missing_skills` | string[] | Empty array if none detected |
| `jd_match.available` | boolean | `false` when no JD was submitted — UI (Day 6) conditionally hides the whole card when this is `false` |
| `jd_match.match_percent` | integer 0–100 or `null` | `null` when `available` is `false` |
| `jd_match.top_gaps` | string[] or `null` | `null` when `available` is `false` |

### Validation rules (enforced server-side in `/api/analyze`, Day 5)
- All six section keys must always be present, even if the AI response omits one — missing keys are backfilled with a safe default (`score: 0, status: "missing", issues: ["Could not analyze this section"]`) rather than breaking the response.
- `overall_score` and every `sections.*.score` must be clamped to the 0–100 range before returning to the client.
- If `jdText` was not submitted, `jd_match.available` is forced to `false` server-side regardless of what the AI returns, so the frontend contract is never ambiguous.

---

## 2. Cover Letter Response — `CoverLetterResult`

Returned by `POST /api/cover-letter`.

```json
{
  "cover_letter": "Dear Hiring Manager,\n\nI am writing to apply for the...",
  "jd_used": true
}
```

| Field | Type | Notes |
|---|---|---|
| `cover_letter` | string | Plain text, paragraph breaks as `\n\n` |
| `jd_used` | boolean | Lets the UI show "Tailored to this role" vs. a generic-letter label |

---

## 3. Request Payloads (Client → Server)

### `POST /api/extract`
```json
{ "file": "<multipart file upload: PDF or DOCX>" }
```

### `POST /api/analyze`
```json
{
  "resumeText": "string, required, min 50 characters",
  "jdText": "string, optional"
}
```

### `POST /api/cover-letter`
```json
{
  "resumeText": "string, required",
  "jdText": "string, optional"
}
```

Full validation rules for each are detailed in `API.md`.

---

## 4. User Story Validation

Every relevant PRD user story checked against this schema:

| PRD Requirement (Section 5) | Covered By |
|---|---|
| Section-by-section breakdown report | `sections` object — one key per required section |
| Overall ATS-friendliness score + per-section score | `overall_score` + `sections.*.score` |
| Weakness detection with explanations | `sections.*.issues` |
| Missing-skills detection | `sections.skills.missing_skills` |
| JD-match percentage + top gaps (when JD provided) | `jd_match.match_percent` + `jd_match.top_gaps` |
| Graceful fallback to general analysis when no JD | `jd_match.available: false`, forced server-side |
| Example rewritten bullets for weak lines | `sections.experience_projects.weak_bullets` |
| Encouraging tone in all AI output | `summary_feedback`, enforced via prompt (Day 5) |
| Cover letter reusing same resume/JD data | `CoverLetterResult`, same request shape as `/api/analyze` |
| No accounts / no persistence | No `userId`, no timestamps, no storage layer anywhere in this schema |

Every locked v1.0 requirement has a corresponding field. No schema field exists that isn't traceable to a PRD requirement — this keeps Day 5–6 implementation from silently growing scope.

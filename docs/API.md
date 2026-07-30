# AI Career Copilot — API Design

**Status:** Finalized Day 2 | No implementation yet — this is the contract Day 4/5/7 build against.

**Base URL (local):** `http://localhost:3000/api`
**Base URL (production):** `https://<project-name>.vercel.app/api`
**Authentication:** None on any endpoint (stateless, no accounts per PRD)
**Content-Type:** `application/json` unless noted otherwise

---

## 1. `POST /api/extract`

**Purpose:** Extract plain text from an uploaded PDF or DOCX resume file. Used only on the file-upload path — the paste-text path skips this endpoint entirely (Day 4).

### Request
- **Content-Type:** `multipart/form-data`
- **Body:**
  | Field | Type | Required | Constraints |
  |---|---|---|---|
  | `file` | File | Yes | `.pdf` or `.docx` only; max 5MB |

### Response — `200 OK`
```json
{
  "text": "extracted plain text of the resume...",
  "charCount": 2140
}
```

### Response — Error cases
| Status | Body | Trigger |
|---|---|---|
| `400` | `{ "error": "No file provided" }` | Empty request |
| `400` | `{ "error": "Unsupported file type. Please upload a PDF or DOCX file." }` | Wrong file extension/MIME type |
| `413` | `{ "error": "File too large. Maximum size is 5MB." }` | File exceeds size cap |
| `422` | `{ "error": "Could not extract readable text. This may be a scanned or image-based file — try pasting your resume text instead." }` | Extraction succeeds but returns near-empty/garbled text (e.g. scanned PDF) |
| `500` | `{ "error": "Something went wrong while processing your file. Please try again." }` | Unexpected parser failure |

### Validation
- File extension AND MIME type both checked (not just one).
- Size checked before attempting parsing.
- Extracted text length checked post-parse — under ~50 characters is treated as a failed extraction (422), not a false "success."

### Authentication
None.

---

## 2. `POST /api/analyze`

**Purpose:** Core resume analysis engine. Sends resume text (+ optional job description) to Claude and returns the structured `AnalysisReport` defined in `SCHEMA.md`. This is the product's core feature (Day 5).

### Request
```json
{
  "resumeText": "string, required",
  "jdText": "string, optional"
}
```

| Field | Type | Required | Constraints |
|---|---|---|---|
| `resumeText` | string | Yes | Min 50 characters, max ~15,000 characters (~3,000 words) |
| `jdText` | string | No | Max ~5,000 characters |

### Response — `200 OK`
Returns an `AnalysisReport` object exactly as defined in `SCHEMA.md` §1.

### Response — Error cases
| Status | Body | Trigger |
|---|---|---|
| `400` | `{ "error": "Resume text is required and must be at least 50 characters." }` | Missing or too-short `resumeText` |
| `400` | `{ "error": "Resume text is too long. Please shorten it to under 15,000 characters." }` | Oversized payload |
| `502` | `{ "error": "Our AI service is temporarily unavailable. Please try again in a moment." }` | Claude API call fails (network, rate limit, downstream error) |
| `500` | `{ "error": "We couldn't generate a valid report. Please try again." }` | AI response fails JSON parsing even after one retry |

### Validation
- `resumeText` length-checked server-side before any AI call (protects API quota from junk requests).
- AI JSON output validated against the expected schema keys (§4 of `SCHEMA.md`) before being returned — missing keys backfilled, never passed through broken.
- One automatic retry with a stricter "JSON only" prompt reminder if the first parse fails.

### Authentication
None.

---

## 3. `POST /api/cover-letter`

**Purpose:** Generate a tailored cover letter from the same resume/JD data already captured in the current session (Day 7, bonus feature — first cut if time runs short per blueprint).

### Request
```json
{
  "resumeText": "string, required",
  "jdText": "string, optional"
}
```
Same shape and constraints as `/api/analyze` — deliberately identical so the frontend can reuse the exact same in-memory data without re-collecting it.

### Response — `200 OK`
Returns a `CoverLetterResult` object exactly as defined in `SCHEMA.md` §2.

### Response — Error cases
| Status | Body | Trigger |
|---|---|---|
| `400` | `{ "error": "Resume text is required and must be at least 50 characters." }` | Missing/too-short `resumeText` |
| `502` | `{ "error": "Our AI service is temporarily unavailable. Please try again in a moment." }` | Claude API call fails |
| `500` | `{ "error": "We couldn't generate a cover letter. Please try again." }` | Unexpected failure |

### Validation
Same `resumeText` length rule as `/api/analyze`. No JSON-schema validation needed on the response (plain text field), but empty/near-empty AI responses are treated as a `500`.

### Authentication
None.

---

## 4. Cross-Cutting Rules (all endpoints)

- **No API key ever appears in any request from the client.** The Claude API key lives only in Vercel's server-side environment variables, read inside the serverless functions.
- **CORS:** not required in production since frontend and API share the same Vercel domain; enabled only for `localhost` during local development (Day 3 setup).
- **Rate limiting:** not implemented in v1.0 (no accounts to key it against) — accepted risk for a capstone-scale project, noted here so it isn't silently forgotten if traffic ever becomes a real concern.
- **Error response shape is always identical**: `{ "error": "human-readable message" }` — the frontend (Day 6/8) can rely on one consistent error-handling code path across all three endpoints.
- **No endpoint reads or writes any persistent storage.** Every request is fully self-contained, matching the stateless architecture in `ARCHITECTURE.md`.

# Day 4 Summary — Resume Input & Parsing

**Date:** July 31, 2026
**Status:** ✅ Core feature complete and verified, with two flagged follow-ups (see below)

## What Was Built Today

- Installed `formidable` (multipart file upload parsing).
- Implemented real logic in `api/extract.js`:
  - PDF text extraction using `pdf-parse` (v2, class-based API — `new PDFParse({ data }).getText()`)
  - DOCX text extraction using `mammoth`
  - Text normalization (whitespace/line-break cleanup)
  - File type validation (PDF/DOCX only), 5MB size cap, near-empty-extraction detection (422 error pointing to paste fallback)
- Rebuilt the frontend (`index.html`, `style.css`, `app.js`):
  - Tabbed Upload File / Paste Text interface
  - Drag-and-drop + click-to-browse upload
  - Client-side file type and size validation
  - Optional job description textarea (captured, not yet used — Day 5/6)
  - Result preview showing extracted text + character count

## Issues Encountered & Resolved

Three dependency version mismatches were found and fixed during implementation — all root-caused by installed package versions being newer than expected:

1. `formidable` — v3+ exports `{ IncomingForm }`, not a plain function. Fixed.
2. `pdf-parse` — v2 uses a class-based API (`new PDFParse({ data }).getText()`), not the old `pdfParse(buffer)` function signature. Fixed after inspecting the actual module shape directly via `node -e`.
3. An earlier stale `vercel dev` process cycling through ports 3000-3003 caused confusion during debugging — resolved by killing stale terminals and restarting cleanly.

**Lesson for future days:** when a library throws "X is not a function," inspect the actual installed module directly (`node -e "console.log(require('package'))"`) rather than assuming the documented/remembered API — installed versions can differ from what's expected.

## Verified Working

| Test | Result |
|---|---|
| Upload real PDF resume → extract | ✅ 4,613 characters extracted correctly from a real CV |
| Paste resume text → extract | ✅ Works instantly, no network call |
| Extracted text is clean and readable | ✅ Confirmed by visual inspection |

## ⚠️ Known Gaps — Track Before Day 8 (Testing)

1. **DOCX extraction untested** — code is implemented per spec (`mammoth`), but no real `.docx` file was available today to verify against. Must be tested with a real DOCX resume before Day 8.
2. **Client-side bad-file-type rejection untested** — the file `accept=".pdf,.docx"` attribute means the OS file picker naturally hides other file types, so drag-and-drop is needed to properly test rejecting e.g. a `.jpg`. Logic is written and reviewed but not visually confirmed.

Neither gap blocks Day 5 — both are isolated to the upload path and don't affect the paste-text path or the upcoming analysis engine.

## Ready for Day 5?

**Yes**, with one important pre-flight reminder carried over from Day 3: the Claude API is still in **MOCK MODE** (`USE_MOCK = true` in `api/analyze.js`) due to the account credit balance. This must be resolved before Day 5's real analysis logic can be verified.

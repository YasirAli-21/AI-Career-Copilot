// lib/config.js
//
// DAY 8: Shared configuration, eliminating the duplicated MODEL_NAME string
// that previously existed identically in both api/analyze.js and
// api/cover-letter.js.

module.exports = {
  MODEL_NAME: "gemini-flash-lite-latest",
  AI_CALL_TIMEOUT_MS: 25000, // fails gracefully before Vercel's function timeout hits
};

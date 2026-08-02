// api/cover-letter.js
//
// DAY 7: Real cover letter generation using the Gemini API.
// DAY 8: Uses shared lib/config.js (removes duplicated MODEL_NAME), wraps the
// AI call with a timeout so a hung request fails with a clear error.

const { GoogleGenerativeAI } = require("@google/generative-ai");
const buildCoverLetterPrompt = require("../prompts/coverLetterPrompt");
const { MODEL_NAME, AI_CALL_TIMEOUT_MS } = require("../lib/config");
const withTimeout = require("../lib/withTimeout");

const MAX_RESUME_LENGTH = 15000;
const MAX_JD_LENGTH = 5000;
const MIN_RESUME_LENGTH = 50;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server misconfiguration: GEMINI_API_KEY is not set.",
    });
  }

  const { resumeText, jdText } = req.body || {};

  if (typeof resumeText !== "string" || resumeText.trim().length < MIN_RESUME_LENGTH) {
    return res.status(400).json({
      error: `Resume text is required and must be at least ${MIN_RESUME_LENGTH} characters.`,
    });
  }
  if (resumeText.length > MAX_RESUME_LENGTH) {
    return res.status(400).json({
      error: "Resume text is too long. Please shorten it to under 15,000 characters.",
    });
  }
  if (typeof jdText === "string" && jdText.length > MAX_JD_LENGTH) {
    return res.status(400).json({
      error: "Job description is too long. Please shorten it to under 5,000 characters.",
    });
  }

  const jdProvided = typeof jdText === "string" && jdText.trim().length > 0;
  const prompt = buildCoverLetterPrompt(resumeText, jdProvided ? jdText : null);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });

  try {
    const result = await withTimeout(
      model.generateContent(prompt),
      AI_CALL_TIMEOUT_MS,
      "The AI service took too long to respond. Please try again."
    );
    const letterText = result.response.text().trim();

    if (!letterText || letterText.length < 50) {
      return res.status(500).json({
        error: "We couldn't generate a cover letter. Please try again.",
      });
    }

    return res.status(200).json({
      cover_letter: letterText,
      jd_used: jdProvided,
    });
  } catch (err) {
    console.error("Gemini cover letter call failed:", err);

    if (err.message && err.message.includes("took too long")) {
      return res.status(504).json({
        error: err.message,
      });
    }

    return res.status(502).json({
      error: "Our AI service is temporarily unavailable. Please try again in a moment.",
      details: err.message,
    });
  }
};

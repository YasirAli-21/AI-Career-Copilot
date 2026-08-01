// api/analyze.js
//
// DAY 5: Real resume analysis engine using the Google Gemini API (free tier).
// Sends resume text (+ optional JD) to Gemini, parses the structured JSON
// response, retries once on malformed output, and validates/backfills the
// schema before returning it to the client. See docs/API.md and docs/SCHEMA.md.

const { GoogleGenerativeAI } = require("@google/generative-ai");
const buildAnalysisPrompt = require("../prompts/analysisPrompt");

const MODEL_NAME = "gemini-flash-lite-latest"; // free-tier alias, auto-tracks newest stable Flash-Lite
const MAX_RESUME_LENGTH = 15000;
const MAX_JD_LENGTH = 5000;
const MIN_RESUME_LENGTH = 50;

const SECTION_KEYS = [
  "contact_info",
  "summary",
  "education",
  "experience_projects",
  "skills",
  "ats_formatting",
];

function clampScore(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return 0;
  return Math.max(0, Math.min(100, Math.round(num)));
}

function safeDefaultSection(key) {
  const base = { score: 0, status: "missing", issues: ["Could not analyze this section"] };
  if (key === "experience_projects") base.weak_bullets = [];
  if (key === "skills") {
    delete base.issues;
    base.missing_skills = [];
  }
  return base;
}

// Validates and backfills a parsed AI response into a guaranteed-complete AnalysisReport.
function validateAndFillReport(parsed, jdProvided) {
  const report = {
    overall_score: clampScore(parsed.overall_score),
    summary_feedback:
      typeof parsed.summary_feedback === "string" && parsed.summary_feedback.trim()
        ? parsed.summary_feedback.trim()
        : "Analysis complete. Review the sections below for detailed feedback.",
    sections: {},
    jd_match: {
      available: false,
      match_percent: null,
      top_gaps: null,
    },
  };

  const incomingSections = parsed.sections && typeof parsed.sections === "object" ? parsed.sections : {};

  for (const key of SECTION_KEYS) {
    const incoming = incomingSections[key];
    if (!incoming || typeof incoming !== "object") {
      report.sections[key] = safeDefaultSection(key);
      continue;
    }

    const section = {
      score: clampScore(incoming.score),
      status: ["good", "needs_work", "missing"].includes(incoming.status) ? incoming.status : "needs_work",
    };

    if (key === "skills") {
      section.missing_skills = Array.isArray(incoming.missing_skills) ? incoming.missing_skills : [];
    } else {
      section.issues = Array.isArray(incoming.issues) ? incoming.issues : [];
    }

    if (key === "experience_projects") {
      section.weak_bullets = Array.isArray(incoming.weak_bullets)
        ? incoming.weak_bullets
            .filter((b) => b && typeof b.original === "string" && typeof b.rewritten === "string")
            .slice(0, 6)
        : [];
    }

    report.sections[key] = section;
  }

  // jd_match is always forced server-side based on whether a JD was actually submitted,
  // regardless of what the AI returned — keeps the contract unambiguous for the frontend.
  if (jdProvided && parsed.jd_match && parsed.jd_match.available) {
    report.jd_match = {
      available: true,
      match_percent: clampScore(parsed.jd_match.match_percent),
      top_gaps: Array.isArray(parsed.jd_match.top_gaps) ? parsed.jd_match.top_gaps : [],
    };
  }

  return report;
}

function extractJSON(rawText) {
  // Strip markdown code fences if the model added them despite instructions.
  let cleaned = rawText.trim();
  cleaned = cleaned.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "");
  return JSON.parse(cleaned.trim());
}

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
  const prompt = buildAnalysisPrompt(resumeText, jdProvided ? jdText : null);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: { responseMimeType: "application/json" },
  });

  async function callGemini() {
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  try {
    let rawText = await callGemini();
    let parsed;

    try {
      parsed = extractJSON(rawText);
    } catch (firstParseErr) {
      console.warn("First JSON parse failed, retrying with stricter reminder...");
      const retryPrompt = prompt + "\n\nIMPORTANT: Your last response was not valid JSON. Return ONLY the JSON object, nothing else.";
      const retryResult = await model.generateContent(retryPrompt);
      rawText = retryResult.response.text();
      parsed = extractJSON(rawText); // if this throws too, it's caught below
    }

    const report = validateAndFillReport(parsed, jdProvided);
    return res.status(200).json(report);
  } catch (err) {
    console.error("Gemini analysis call failed:", err);

    if (err instanceof SyntaxError) {
      return res.status(500).json({
        error: "We couldn't generate a valid report. Please try again.",
      });
    }

    return res.status(502).json({
      error: "Our AI service is temporarily unavailable. Please try again in a moment.",
      details: err.message,
    });
  }
};
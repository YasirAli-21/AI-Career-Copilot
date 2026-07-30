// api/analyze.js
//
// DAY 3 STATUS: Connection-test STUB, running in MOCK MODE.
//
// Why mock mode: real Claude API calls require a funded Anthropic account balance,
// which isn't set up yet. This mock proves the full wiring (Browser -> Vercel Function
// -> back to Browser) works correctly, without spending anything.
//
// IMPORTANT: Before Day 5, this must be switched back to a real Claude API call
// (see the commented-out REAL VERSION below) once API credits are available.
// The real analysis logic (prompt, full JSON schema, validation) is built Day 5 either way.

const USE_MOCK = true; // <-- flip to false once API credits are available and real key is confirmed working

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  if (USE_MOCK) {
    // Simulate a small network delay so the frontend's loading state is visible/testable.
    await new Promise((resolve) => setTimeout(resolve, 600));

    return res.status(200).json({
      ok: true,
      raw: JSON.stringify({
        status: "connected (MOCK MODE — no real Claude API call made)",
        message:
          "Frontend <-> Vercel function wiring confirmed working. Switch USE_MOCK to false in api/analyze.js once Claude API credits are available.",
      }),
    });
  }

  // ---------------- REAL VERSION (enable once credits are available) ----------------
  const Anthropic = require("@anthropic-ai/sdk");
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "Server misconfiguration: ANTHROPIC_API_KEY is not set.",
    });
  }

  try {
    const anthropic = new Anthropic({ apiKey });
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5-20250929", // Confirm this is still the current recommended model before Day 5 real usage.
      max_tokens: 200,
      messages: [
        {
          role: "user",
          content:
            "Reply with exactly this JSON and nothing else: {\"status\": \"connected\", \"message\": \"AI Career Copilot backend is talking to Claude successfully.\"}",
        },
      ],
    });

    const textBlock = response.content.find((block) => block.type === "text");

    return res.status(200).json({
      ok: true,
      raw: textBlock ? textBlock.text : null,
    });
  } catch (err) {
    console.error("Claude API test call failed:", err);
    return res.status(502).json({
      error: "Could not reach the Claude API. Check your API key and network connection.",
      details: err.message,
    });
  }
};
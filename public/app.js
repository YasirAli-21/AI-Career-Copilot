// public/app.js
//
// DAY 3 STATUS: Only the "Test Connection" wiring exists today.
// Upload handling, validation, and screen-state management are built starting Day 4/6.
// See docs/UI-WIREFRAMES.md for the full planned user flow.

const btn = document.getElementById("test-connection-btn");
const resultBox = document.getElementById("result-box");

btn.addEventListener("click", async () => {
  btn.disabled = true;
  btn.textContent = "Testing...";
  resultBox.hidden = false;
  resultBox.classList.remove("error");
  resultBox.textContent = "Calling /api/analyze ...";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}), // empty body — today's stub ignores input entirely
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unknown error");
    }

    resultBox.textContent = `✅ Connected successfully.\n\nRaw Claude response:\n${data.raw}`;
  } catch (err) {
    resultBox.classList.add("error");
    resultBox.textContent = `❌ Connection failed: ${err.message}`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Test Connection";
  }
});

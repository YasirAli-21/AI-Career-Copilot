// public/components/scoreHeader.js
// Renders the overall score (as a proportional ring) + summary feedback.

export function renderScoreHeader(report) {
  const wrap = document.createElement("div");
  wrap.className = "score-header";

  const score = Math.max(0, Math.min(100, report.overall_score));
  const ringColor = score >= 75 ? "#14b8a6" : score >= 50 ? "#fbbf24" : "#f87171";

  const scoreBlock = document.createElement("div");
  scoreBlock.className = "score-block";

  const ring = document.createElement("div");
  ring.className = "score-ring";
  ring.style.background = `conic-gradient(${ringColor} ${score * 3.6}deg, #1e293b 0deg)`;
  ring.setAttribute("role", "img");
  ring.setAttribute("aria-label", `Overall resume score: ${score} out of 100`);

  const ringInner = document.createElement("div");
  ringInner.className = "score-ring-inner";
  ringInner.textContent = score;
  ring.appendChild(ringInner);

  const label = document.createElement("div");
  label.className = "score-label";
  label.textContent = "Overall Score";

  scoreBlock.appendChild(ring);
  scoreBlock.appendChild(label);

  const feedback = document.createElement("p");
  feedback.className = "score-feedback";
  feedback.textContent = report.summary_feedback;

  wrap.appendChild(scoreBlock);
  wrap.appendChild(feedback);
  return wrap;
}

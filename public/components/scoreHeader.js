// public/components/scoreHeader.js
// Renders the overall score + summary feedback at the top of the report.

export function renderScoreHeader(report) {
  const wrap = document.createElement("div");
  wrap.className = "score-header";

  const ring = document.createElement("div");
  ring.className = "score-ring";
  ring.textContent = report.overall_score;

  const label = document.createElement("div");
  label.className = "score-label";
  label.textContent = "Overall Score";

  const scoreBlock = document.createElement("div");
  scoreBlock.className = "score-block";
  scoreBlock.appendChild(ring);
  scoreBlock.appendChild(label);

  const feedback = document.createElement("p");
  feedback.className = "score-feedback";
  feedback.textContent = report.summary_feedback;

  wrap.appendChild(scoreBlock);
  wrap.appendChild(feedback);
  return wrap;
}
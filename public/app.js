// public/app.js
//
// DAY 6: Full flow wiring. Upload/Paste -> /api/analyze -> Report screen.
// Uses ES modules to import the report card renderers.

import { renderScoreHeader } from "./components/scoreHeader.js";
import { renderSectionCard, renderJDMatchCard } from "./components/reportCard.js";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// --- Screens ---
const inputScreen = document.getElementById("input-screen");
const loadingScreen = document.getElementById("loading-screen");
const reportScreen = document.getElementById("report-screen");
const errorScreen = document.getElementById("error-screen");

// --- Input screen elements ---
const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const fileInput = document.getElementById("file-input");
const dropzone = document.getElementById("dropzone");
const dropzoneLabel = document.getElementById("dropzone-label");
const pasteTextarea = document.getElementById("paste-textarea");
const jdTextarea = document.getElementById("jd-textarea");
const analyzeBtn = document.getElementById("analyze-btn");
const inputStatus = document.getElementById("input-status");

// --- Report screen elements ---
const scoreHeaderMount = document.getElementById("score-header-mount");
const reportCardsMount = document.getElementById("report-cards-mount");
const startOverBtn = document.getElementById("start-over-btn");
const downloadBtn = document.getElementById("download-btn");

// --- Error screen elements ---
const errorMessageEl = document.getElementById("error-message");
const errorRetryBtn = document.getElementById("error-retry-btn");

let activeTab = "upload-tab";
let selectedFile = null;
let lastReport = null;

const SECTION_ORDER = [
  "contact_info",
  "summary",
  "education",
  "experience_projects",
  "skills",
  "ats_formatting",
];

// ---------- Screen switching ----------
function showScreen(name) {
  inputScreen.hidden = name !== "input";
  loadingScreen.hidden = name !== "loading";
  reportScreen.hidden = name !== "report";
  errorScreen.hidden = name !== "error";
}

// ---------- Tabs ----------
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
    activeTab = btn.dataset.tab;
    clearStatus();
  });
});

// ---------- File selection ----------
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) handleFileSelected(fileInput.files[0]);
});

dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});
dropzone.addEventListener("dragleave", () => dropzone.classList.remove("dragover"));
dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) handleFileSelected(e.dataTransfer.files[0]);
});

function handleFileSelected(file) {
  clearStatus();
  const name = file.name.toLowerCase();
  const isPdf = name.endsWith(".pdf");
  const isDocx = name.endsWith(".docx");

  if (!isPdf && !isDocx) {
    showStatus("Unsupported file type. Please choose a PDF or DOCX file.", true);
    selectedFile = null;
    return;
  }
  if (file.size > MAX_FILE_SIZE) {
    showStatus("File too large. Maximum size is 5MB.", true);
    selectedFile = null;
    return;
  }
  selectedFile = file;
  dropzoneLabel.textContent = `Selected: ${file.name}`;
}

function showStatus(message, isError) {
  inputStatus.hidden = false;
  inputStatus.textContent = message;
  inputStatus.classList.toggle("error", !!isError);
}
function clearStatus() {
  inputStatus.hidden = true;
  inputStatus.textContent = "";
  inputStatus.classList.remove("error");
}

// ---------- Analyze flow ----------
analyzeBtn.addEventListener("click", async () => {
  clearStatus();

  let resumeText = null;

  if (activeTab === "paste-tab") {
    const text = pasteTextarea.value.trim();
    if (text.length < 50) {
      showStatus("Please paste at least 50 characters of resume text.", true);
      return;
    }
    resumeText = text;
  } else {
    if (!selectedFile) {
      showStatus("Please choose a PDF or DOCX file first.", true);
      return;
    }
    showScreen("loading");
    document.getElementById("loading-message").textContent = "Extracting text from your resume...";
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      const extractRes = await fetch("/api/extract", { method: "POST", body: formData });
      const extractData = await extractRes.json();
      if (!extractRes.ok) throw new Error(extractData.error || "Extraction failed.");
      resumeText = extractData.text;
    } catch (err) {
      showError(err.message);
      return;
    }
  }

  const jdText = jdTextarea.value.trim();

  showScreen("loading");
  document.getElementById("loading-message").textContent =
    "Reading through your resume section by section...";

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeText, jdText: jdText || undefined }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Analysis failed.");

    lastReport = data;
    renderReport(data);
    showScreen("report");
  } catch (err) {
    showError(err.message);
  }
});

function showError(message) {
  errorMessageEl.textContent = message;
  showScreen("error");
}

errorRetryBtn.addEventListener("click", () => {
  showScreen("input");
});

startOverBtn.addEventListener("click", () => {
  selectedFile = null;
  lastReport = null;
  fileInput.value = "";
  pasteTextarea.value = "";
  jdTextarea.value = "";
  dropzoneLabel.innerHTML = "Drag &amp; drop your resume (PDF or DOCX)<br />or click to browse";
  clearStatus();
  showScreen("input");
});

// ---------- Report rendering ----------
function renderReport(report) {
  scoreHeaderMount.innerHTML = "";
  scoreHeaderMount.appendChild(renderScoreHeader(report));

  reportCardsMount.innerHTML = "";
  SECTION_ORDER.forEach((key) => {
    const section = report.sections[key];
    if (section) {
      reportCardsMount.appendChild(renderSectionCard(key, section));
    }
  });

  const jdCard = renderJDMatchCard(report.jd_match);
  if (jdCard) {
    reportCardsMount.appendChild(jdCard);
  }
}

// ---------- Download report ----------
downloadBtn.addEventListener("click", () => {
  if (!lastReport) return;
  const text = buildPlainTextReport(lastReport);
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "resume-analysis-report.txt";
  a.click();
  URL.revokeObjectURL(url);
});

function buildPlainTextReport(report) {
  const lines = [];
  lines.push("AI CAREER COPILOT — RESUME ANALYSIS REPORT");
  lines.push("=".repeat(45));
  lines.push(`Overall Score: ${report.overall_score}/100`);
  lines.push("");
  lines.push(report.summary_feedback);
  lines.push("");

  SECTION_ORDER.forEach((key) => {
    const section = report.sections[key];
    if (!section) return;
    lines.push("-".repeat(45));
    lines.push(`${key.toUpperCase()} — ${section.status} (${section.score}/100)`);
    if (Array.isArray(section.issues)) {
      section.issues.forEach((issue) => lines.push(`  • ${issue}`));
    }
    if (Array.isArray(section.missing_skills) && section.missing_skills.length > 0) {
      lines.push(`  Missing skills: ${section.missing_skills.join(", ")}`);
    }
    if (Array.isArray(section.weak_bullets)) {
      section.weak_bullets.forEach((b) => {
        lines.push(`  Original:  ${b.original}`);
        lines.push(`  Rewritten: ${b.rewritten}`);
      });
    }
    lines.push("");
  });

  if (report.jd_match && report.jd_match.available) {
    lines.push("-".repeat(45));
    lines.push(`JOB MATCH — ${report.jd_match.match_percent}%`);
    (report.jd_match.top_gaps || []).forEach((gap) => lines.push(`  • ${gap}`));
  }

  return lines.join("\n");
}

// Init
showScreen("input");
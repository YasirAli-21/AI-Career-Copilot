// public/app.js
//
// DAY 4: Upload/paste input, client-side validation, calls /api/extract.
// JD text is captured but not sent anywhere yet — that happens Day 5/6.

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const tabButtons = document.querySelectorAll(".tab-btn");
const tabPanels = document.querySelectorAll(".tab-panel");
const fileInput = document.getElementById("file-input");
const dropzone = document.getElementById("dropzone");
const dropzoneLabel = document.getElementById("dropzone-label");
const pasteTextarea = document.getElementById("paste-textarea");
const jdTextarea = document.getElementById("jd-textarea");
const extractBtn = document.getElementById("extract-btn");
const extractStatus = document.getElementById("extract-status");
const resultBox = document.getElementById("result-box");

let activeTab = "upload-tab";
let selectedFile = null;

// --- Tab switching ---
tabButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    tabButtons.forEach((b) => b.classList.remove("active"));
    tabPanels.forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    const target = document.getElementById(btn.dataset.tab);
    target.classList.add("active");
    activeTab = btn.dataset.tab;
    clearStatus();
  });
});

// --- File selection (click) ---
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    handleFileSelected(fileInput.files[0]);
  }
});

// --- Drag and drop ---
dropzone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropzone.classList.add("dragover");
});

dropzone.addEventListener("dragleave", () => {
  dropzone.classList.remove("dragover");
});

dropzone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropzone.classList.remove("dragover");
  if (e.dataTransfer.files.length > 0) {
    handleFileSelected(e.dataTransfer.files[0]);
  }
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
  extractStatus.hidden = false;
  extractStatus.textContent = message;
  extractStatus.classList.toggle("error", !!isError);
}

function clearStatus() {
  extractStatus.hidden = true;
  extractStatus.textContent = "";
  extractStatus.classList.remove("error");
}

function showResult(text, isError) {
  resultBox.hidden = false;
  resultBox.classList.toggle("error", !!isError);
  resultBox.textContent = text;
}

// --- Extract button ---
extractBtn.addEventListener("click", async () => {
  clearStatus();
  resultBox.hidden = true;

  if (activeTab === "paste-tab") {
    const text = pasteTextarea.value.trim();
    if (text.length < 50) {
      showStatus("Please paste at least 50 characters of resume text.", true);
      return;
    }
    // Paste path skips /api/extract entirely (per docs/ARCHITECTURE.md)
    showResult(
      `✅ Using pasted text (${text.length} characters).\n\nPreview:\n${text.slice(0, 500)}${text.length > 500 ? "..." : ""}`
    );
    logJdCapture();
    return;
  }

  // Upload path
  if (!selectedFile) {
    showStatus("Please choose a PDF or DOCX file first.", true);
    return;
  }

  extractBtn.disabled = true;
  extractBtn.textContent = "Extracting...";

  try {
    const formData = new FormData();
    formData.append("file", selectedFile);

    const response = await fetch("/api/extract", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Extraction failed.");
    }

    showResult(
      `✅ Extracted ${data.charCount} characters.\n\nPreview:\n${data.text.slice(0, 500)}${data.text.length > 500 ? "..." : ""}`
    );
    logJdCapture();
  } catch (err) {
    showResult(`❌ ${err.message}`, true);
  } finally {
    extractBtn.disabled = false;
    extractBtn.textContent = "Extract Resume Text";
  }
});

function logJdCapture() {
  const jd = jdTextarea.value.trim();
  console.log(
    jd
      ? `JD captured (${jd.length} characters) — will be used starting Day 5/6.`
      : "No JD provided — general analysis will be used (Day 5/6)."
  );
}
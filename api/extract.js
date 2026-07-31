// api/extract.js
//
// DAY 4: Real implementation. Extracts plain text from an uploaded PDF or DOCX
// resume file using pdf-parse (v2, class-based API) and mammoth.
// See docs/API.md for the full spec.

const { IncomingForm } = require("formidable");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const mammoth = require("mammoth");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB, per docs/API.md
const MIN_TEXT_LENGTH = 50; // below this, treat extraction as failed (e.g. scanned PDF)

function normalizeText(raw) {
  return raw
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const form = new IncomingForm({
    maxFileSize: MAX_FILE_SIZE,
    keepExtensions: true,
  });

  let fields, files;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });
  } catch (err) {
    if (err.message && err.message.toLowerCase().includes("maxfilesize")) {
      return res.status(413).json({
        error: "File too large. Maximum size is 5MB.",
      });
    }
    console.error("Form parsing failed:", err);
    return res.status(400).json({
      error: "Something went wrong while processing your file. Please try again.",
    });
  }

  const uploaded = files.file;
  const file = Array.isArray(uploaded) ? uploaded[0] : uploaded;

  if (!file) {
    return res.status(400).json({ error: "No file provided" });
  }

  const originalName = (file.originalFilename || "").toLowerCase();
  const isPdf = originalName.endsWith(".pdf");
  const isDocx = originalName.endsWith(".docx");

  if (!isPdf && !isDocx) {
    return res.status(400).json({
      error: "Unsupported file type. Please upload a PDF or DOCX file.",
    });
  }

  let parser;
  try {
    const buffer = fs.readFileSync(file.filepath);
    let extractedText = "";

    if (isPdf) {
      parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      extractedText = result.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    const cleaned = normalizeText(extractedText);

    if (cleaned.length < MIN_TEXT_LENGTH) {
      return res.status(422).json({
        error:
          "Could not extract readable text. This may be a scanned or image-based file — try pasting your resume text instead.",
      });
    }

    return res.status(200).json({
      text: cleaned,
      charCount: cleaned.length,
    });
  } catch (err) {
    console.error("Text extraction failed:", err);
    return res.status(500).json({
      error: "Something went wrong while processing your file. Please try again.",
    });
  } finally {
    if (parser) {
      try {
        await parser.destroy();
      } catch (_) {
        /* ignore cleanup errors */
      }
    }
    if (file && file.filepath) {
      fs.unlink(file.filepath, () => {});
    }
  }
};
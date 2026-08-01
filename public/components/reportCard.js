// public/components/reportCard.js
// Renders one section card (Contact Info, Summary, Education, Experience/Projects,
// Skills, ATS Formatting) from the AnalysisReport, per docs/SCHEMA.md.

const SECTION_LABELS = {
  contact_info: "Contact Info",
  summary: "Summary",
  education: "Education",
  experience_projects: "Experience / Projects",
  skills: "Skills",
  ats_formatting: "ATS Formatting",
};

const STATUS_LABELS = {
  good: "Good",
  needs_work: "Needs Work",
  missing: "Missing",
};

export function renderSectionCard(key, section) {
  const card = document.createElement("div");
  card.className = "report-card";

  const header = document.createElement("div");
  header.className = "report-card-header";

  const title = document.createElement("span");
  title.className = "report-card-title";
  title.textContent = SECTION_LABELS[key] || key;

  const badge = document.createElement("span");
  badge.className = `status-badge status-${section.status}`;
  badge.textContent = STATUS_LABELS[section.status] || section.status;

  header.appendChild(title);
  header.appendChild(badge);
  card.appendChild(header);

  // issues (all sections except skills)
  if (Array.isArray(section.issues) && section.issues.length > 0) {
    const list = document.createElement("ul");
    list.className = "issue-list";
    section.issues.forEach((issue) => {
      const li = document.createElement("li");
      li.textContent = issue;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  // missing_skills (skills section only)
  if (Array.isArray(section.missing_skills) && section.missing_skills.length > 0) {
    const tagWrap = document.createElement("div");
    tagWrap.className = "skill-tags";
    const tagLabel = document.createElement("span");
    tagLabel.className = "skill-tags-label";
    tagLabel.textContent = "Missing skills: ";
    tagWrap.appendChild(tagLabel);
    section.missing_skills.forEach((skill) => {
      const tag = document.createElement("span");
      tag.className = "skill-tag";
      tag.textContent = skill;
      tagWrap.appendChild(tag);
    });
    card.appendChild(tagWrap);
  }

  // weak_bullets (experience_projects only)
  if (Array.isArray(section.weak_bullets) && section.weak_bullets.length > 0) {
    section.weak_bullets.forEach((bullet) => {
      const bulletBox = document.createElement("div");
      bulletBox.className = "bullet-rewrite";

      const original = document.createElement("p");
      original.className = "bullet-original";
      original.innerHTML = `<strong>Original:</strong> ${escapeHTML(bullet.original)}`;

      const rewritten = document.createElement("p");
      rewritten.className = "bullet-rewritten";
      rewritten.innerHTML = `<strong>Rewritten:</strong> ${escapeHTML(bullet.rewritten)}`;

      bulletBox.appendChild(original);
      bulletBox.appendChild(rewritten);
      card.appendChild(bulletBox);
    });
  }

  if (
    (!section.issues || section.issues.length === 0) &&
    (!section.missing_skills || section.missing_skills.length === 0) &&
    (!section.weak_bullets || section.weak_bullets.length === 0)
  ) {
    const noIssues = document.createElement("p");
    noIssues.className = "no-issues";
    noIssues.textContent = "No issues found.";
    card.appendChild(noIssues);
  }

  return card;
}

export function renderJDMatchCard(jdMatch) {
  if (!jdMatch || !jdMatch.available) return null;

  const card = document.createElement("div");
  card.className = "report-card jd-match-card";

  const header = document.createElement("div");
  header.className = "report-card-header";
  const title = document.createElement("span");
  title.className = "report-card-title";
  title.textContent = "Job Match";
  const percent = document.createElement("span");
  percent.className = "jd-match-percent";
  percent.textContent = `${jdMatch.match_percent}% Match`;
  header.appendChild(title);
  header.appendChild(percent);
  card.appendChild(header);

  if (Array.isArray(jdMatch.top_gaps) && jdMatch.top_gaps.length > 0) {
    const list = document.createElement("ul");
    list.className = "issue-list";
    jdMatch.top_gaps.forEach((gap) => {
      const li = document.createElement("li");
      li.textContent = gap;
      list.appendChild(li);
    });
    card.appendChild(list);
  }

  return card;
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
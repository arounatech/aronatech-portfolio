/**
 * generateResumePDF.js
 * Generates a clean, US-standard one-page resume PDF using jsPDF.
 * Pulls all data from PORTFOLIO constants. No photo — ATS-friendly.
 */
import { jsPDF } from "jspdf";
import PORTFOLIO from "../config/constants";

/* ── colour palette (RGB arrays) ──────────────────────────── */
const ACCENT = [108, 99, 255];
const DARK = [30, 30, 50];
const MID = [110, 110, 135];
const BODY = [50, 50, 65];
const SECTION_BG = [245, 245, 252];
const DIVIDER = [200, 200, 218];
const WHITE = [255, 255, 255];

/* ── layout constants (US Letter = 215.9 × 279.4 mm) ─────── */
const MARGIN_L = 16;
const MARGIN_R = 16;
let PAGE_W = 215.9;
const CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R;

/* ── helpers ──────────────────────────────────────────────── */
function sectionHeading(doc, text, y) {
  // Highlighted background bar behind section title
  doc.setFillColor(...SECTION_BG);
  doc.roundedRect(MARGIN_L, y - 4.2, CONTENT_W, 7, 1.5, 1.5, "F");

  // Accent left bar
  doc.setFillColor(...ACCENT);
  doc.roundedRect(MARGIN_L, y - 4.2, 2, 7, 1, 1, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10.5);
  doc.setTextColor(...ACCENT);
  doc.text(text.toUpperCase(), MARGIN_L + 5, y);
  return y + 7;
}

function bodyText(doc, text, x, y, maxW, opts = {}) {
  doc.setFont("helvetica", opts.bold ? "bold" : "normal");
  doc.setFontSize(opts.size || 9);
  doc.setTextColor(...(opts.color || BODY));
  const lines = doc.splitTextToSize(text, maxW);
  doc.text(lines, x, y);
  return y + lines.length * (opts.lineHeight || 3.5);
}

function bullet(doc, text, x, y, maxW) {
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.setTextColor(...ACCENT);
  doc.text("\u2022", x, y);
  doc.setTextColor(...BODY);
  const lines = doc.splitTextToSize(text, maxW - 5);
  doc.text(lines, x + 5, y);
  return y + lines.length * 3.4 + 0.8;
}

/* ── main generator ───────────────────────────────────────── */
export default async function generateResumePDF() {
  const { personal, skillGroups, projects, about } = PORTFOLIO;

  const doc = new jsPDF({ unit: "mm", format: "letter" });
  PAGE_W = doc.internal.pageSize.getWidth();
  const PAGE_H = doc.internal.pageSize.getHeight();
  const usableW = PAGE_W - MARGIN_L - MARGIN_R;

  /* ── header ───────────────────────────────────────────── */
  // Dark header band
  doc.setFillColor(...DARK);
  doc.rect(0, 0, PAGE_W, 37, "F");

  // Accent strip at very top
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, PAGE_W, 2, "F");

  // Name
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...WHITE);
  doc.text(personal.name, PAGE_W / 2, 14, { align: "center" });

  // Role
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...ACCENT);
  doc.text(personal.role, PAGE_W / 2, 21, { align: "center" });

  // Contact details — two short centered lines (ASCII-safe for PDF fonts)
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 220);

  const safeLocation = "Hamidiye, 34408 Kagithane / Istanbul";
  const row1 = personal.email + "   |   " + safeLocation;
  const row2 = "github.com/arounatech   |   linkedin.com/in/aronatech";

  doc.text(row1, PAGE_W / 2, 28, { align: "center" });
  doc.text(row2, PAGE_W / 2, 32.5, { align: "center" });

  let y = 42;

  /* ── Professional Summary ─────────────────────────────── */
  y = sectionHeading(doc, "Professional Summary", y);
  y = bodyText(doc, about.narrative, MARGIN_L, y, usableW, { size: 9 });
  y += 4;

  /* ── Technical Skills ─────────────────────────────────── */
  y = sectionHeading(doc, "Technical Skills", y);

  const colW = usableW / 2 - 1;
  let leftY = y;
  let rightY = y;

  skillGroups.forEach((group, gi) => {
    const isLeft = gi % 2 === 0;
    const colX = isLeft ? MARGIN_L : MARGIN_L + colW + 2;
    let cY = isLeft ? leftY : rightY;

    // Group title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(...DARK);
    doc.text(group.group, colX, cY);
    cY += 3.5;

    // Skills list
    const skillStr = group.skills.map((s) => s.name).join(", ");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...BODY);
    const lines = doc.splitTextToSize(skillStr, colW - 2);
    doc.text(lines, colX, cY);
    cY += lines.length * 3 + 2.5;

    if (isLeft) leftY = cY;
    else rightY = cY;
  });

  y = Math.max(leftY, rightY) + 2;

  /* ── Key Projects ─────────────────────────────────────── */
  y = sectionHeading(doc, "Key Projects", y);

  projects.forEach((project) => {
    if (y > PAGE_H - 30) {
      doc.addPage();
      y = 20;
    }

    // Project name + year on same line
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(...DARK);
    doc.text(project.name, MARGIN_L, y);

    if (project.year) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...MID);
      doc.text(String(project.year), PAGE_W - MARGIN_R, y, { align: "right" });
    }
    y += 3.5;

    // Tech stack
    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text((project.stack || []).join("  \u00B7  "), MARGIN_L, y);
    y += 3.5;

    // Description as bullet
    y = bullet(doc, project.description, MARGIN_L, y, usableW);
    y += 1.5;
  });

  /* ── Key Achievements ─────────────────────────────────── */
  if (y > PAGE_H - 40) {
    doc.addPage();
    y = 20;
  }
  y = sectionHeading(doc, "Key Achievements", y);
  about.highlights.forEach((item) => {
    if (y > PAGE_H - 15) {
      doc.addPage();
      y = 20;
    }
    y = bullet(doc, item, MARGIN_L, y, usableW);
  });

  /* ── Footer ───────────────────────────────────────────── */
  // Thin accent line above footer
  doc.setDrawColor(...ACCENT);
  doc.setLineWidth(0.3);
  doc.line(MARGIN_L, PAGE_H - 12, PAGE_W - MARGIN_R, PAGE_H - 12);

  doc.setFontSize(7);
  doc.setTextColor(...MID);
  doc.text(
    `Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    PAGE_W / 2,
    PAGE_H - 8,
    { align: "center" },
  );

  /* ── Save ─────────────────────────────────────────────── */
  doc.save(`${personal.name.replace(/\s+/g, "_")}_Resume.pdf`);
}

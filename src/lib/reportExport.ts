import type { ReportDocumentData } from "@/components/ReportDocument";

/** Stable canonical string used for hashing — order matters and must not change. */
export function canonicalReportPayload(r: ReportDocumentData): string {
  return [
    r.id,
    r.teacher_name ?? "",
    r.student_name,
    r.subject,
    r.class_date,
    r.class_time,
    String(r.class_length_minutes),
    r.classes_completed === null || r.classes_completed === undefined
      ? ""
      : String(r.classes_completed),
    r.topics_covered,
    r.report_text,
    r.created_at,
  ].join("\u241F"); // unit separator
}

export async function reportChecksum(r: ReportDocumentData): Promise<string> {
  const data = new TextEncoder().encode(canonicalReportPayload(r));
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function safeFileName(r: ReportDocumentData): string {
  const safeStudent = r.student_name.replace(/[^a-z0-9가-힣]+/gi, "_");
  return `IBCircle_Report_${safeStudent}_${r.class_date}`;
}

function formatDateLong(d: string) {
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  return new Date(y, m - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Self-contained, print-ready HTML export of a single report. Uses inline CSS
 * (no Tailwind CDN) so the file renders identically offline and prints crisply.
 */
export function buildReportHtml(
  r: ReportDocumentData,
  checksum: string,
): string {
  const exportedAt = new Date().toLocaleString();
  const submittedAt = new Date(r.created_at).toLocaleString();

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>IBCircle Report — ${escapeHtml(r.student_name)} — ${escapeHtml(r.class_date)}</title>
<style>
  @page { size: Letter; margin: 0; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: #eef0f5;
    font-family: 'Times New Roman', 'Noto Serif KR', Georgia, serif;
    color: #0f172a;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .toolbar {
    text-align: center;
    padding: 16px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .toolbar button {
    padding: 10px 18px;
    cursor: pointer;
    border: 1px solid #0f1f3d;
    background: #0f1f3d;
    color: #fff;
    border-radius: 4px;
    font-size: 14px;
  }
  .doc {
    width: 8.5in;
    min-height: 11in;
    padding: 0.85in 0.9in;
    margin: 24px auto;
    background: #fff;
    box-shadow: 0 12px 40px rgba(15,31,61,0.18);
    line-height: 1.6;
  }
  .header {
    display: flex; align-items: flex-end; justify-content: space-between;
    padding-bottom: 20px; margin-bottom: 32px;
    border-bottom: 2px solid #0f1f3d;
  }
  .brand { font-size: 30px; font-weight: 700; color: #0f1f3d; font-family: Georgia, 'Times New Roman', serif; letter-spacing: -0.5px; }
  .kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 0.2em; color: #64748b; margin-top: 4px; }
  .meta-right { text-align: right; font-size: 11px; color: #64748b; }
  h1.subject { font-size: 22px; color: #0f1f3d; margin: 0 0 4px; font-weight: 600; }
  .lead { font-size: 14px; color: #475569; margin: 0 0 32px; }
  .meta-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 16px 32px;
    background: #f5f7fb; border: 1px solid #e5e9f2; border-radius: 6px;
    padding: 20px; margin-bottom: 32px;
  }
  .meta-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.18em; color: #64748b; margin-bottom: 4px; }
  .meta-value { font-size: 14px; font-weight: 500; color: #0f172a; }
  .section { margin-bottom: 32px; }
  .section-head { display: flex; align-items: baseline; gap: 12px; margin-bottom: 12px; }
  .section-title { font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.16em; color: #0f1f3d; margin: 0; }
  .section-sub { font-size: 12px; color: #64748b; }
  .section-body { padding-left: 16px; border-left: 3px solid #0f1f3d; }
  .section-body p { margin: 0; font-size: 15px; white-space: pre-wrap; line-height: 1.7; }
  .footer {
    margin-top: 48px; padding-top: 20px;
    border-top: 1px solid #e5e9f2;
    font-size: 11px; color: #64748b;
  }
  .footer-row { display: flex; justify-content: space-between; gap: 16px; margin-bottom: 6px; }
  .footer-label { color: #94a3b8; text-transform: uppercase; letter-spacing: 0.12em; font-size: 10px; }
  .checksum { font-family: 'SF Mono', Menlo, Consolas, monospace; word-break: break-all; font-size: 10px; color: #475569; }
  @media print {
    body { background: #fff; }
    .doc { box-shadow: none !important; margin: 0 auto !important; }
    .toolbar { display: none !important; }
  }
</style>
</head>
<body>
<div class="toolbar">
  <button onclick="window.print()">Print / Save as PDF</button>
</div>
<article class="doc">
  <header class="header">
    <div>
      <div class="brand">IBCircle</div>
      <div class="kicker">Class Report · 수업 리포트</div>
    </div>
    <div class="meta-right">
      <div>Confidential</div>
      <div>Exported ${escapeHtml(exportedAt)}</div>
    </div>
  </header>

  <h1 class="subject">${escapeHtml(r.subject)}</h1>
  <p class="lead">
    Prepared for <strong>${escapeHtml(r.student_name)}</strong>
    ${r.teacher_name ? ` · Instructor <strong>${escapeHtml(r.teacher_name)}</strong>` : ""}
  </p>

  <section class="meta-grid">
    <div><div class="meta-label">Class date</div><div class="meta-value">${escapeHtml(formatDateLong(r.class_date))}</div></div>
    <div><div class="meta-label">Class time</div><div class="meta-value">${escapeHtml(r.class_time.slice(0, 5))}</div></div>
    <div><div class="meta-label">Duration</div><div class="meta-value">${r.class_length_minutes} minutes</div></div>
    <div><div class="meta-label">Classes completed</div><div class="meta-value">${
      r.classes_completed !== null && r.classes_completed !== undefined ? `#${r.classes_completed}` : "—"
    }</div></div>
    <div><div class="meta-label">Subject</div><div class="meta-value">${escapeHtml(r.subject)}</div></div>
    <div><div class="meta-label">Submitted</div><div class="meta-value">${escapeHtml(submittedAt)}</div></div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2 class="section-title">Topics Covered</h2>
      <span class="section-sub">학습 내용</span>
    </div>
    <div class="section-body"><p>${escapeHtml(r.topics_covered)}</p></div>
  </section>

  <section class="section">
    <div class="section-head">
      <h2 class="section-title">Instructor's Report</h2>
      <span class="section-sub">강사 리포트</span>
    </div>
    <div class="section-body"><p>${escapeHtml(r.report_text)}</p></div>
  </section>

  <footer class="footer">
    <div class="footer-row"><span class="footer-label">Report ID</span><span>${escapeHtml(r.id)}</span></div>
    <div class="footer-row"><span class="footer-label">SHA-256</span></div>
    <div class="checksum">${escapeHtml(checksum)}</div>
  </footer>
</article>
</body>
</html>`;
}

function triggerDownload(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export async function downloadReportHtml(r: ReportDocumentData): Promise<void> {
  const checksum = await reportChecksum(r);
  const html = buildReportHtml(r, checksum);
  triggerDownload(`${safeFileName(r)}.html`, new Blob([html], { type: "text/html;charset=utf-8" }));
}

/** Sequentially export multiple reports, with a small delay so browsers don't suppress downloads. */
export async function downloadReportsHtmlBulk(
  reports: ReportDocumentData[],
  onProgress?: (done: number, total: number) => void,
): Promise<void> {
  for (let i = 0; i < reports.length; i++) {
    await downloadReportHtml(reports[i]);
    onProgress?.(i + 1, reports.length);
    // Stagger to keep browsers from blocking subsequent downloads
    await new Promise((res) => setTimeout(res, 350));
  }
}

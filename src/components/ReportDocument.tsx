import { memo, useEffect, useState } from "react";
import { reportChecksum } from "@/lib/reportExport";

export interface ReportDocumentData {
  id: string;
  teacher_name: string | null;
  student_name: string;
  subject: string;
  topics_covered: string;
  class_date: string;
  class_time: string;
  class_length_minutes: number;
  classes_completed: number | null;
  report_text: string;
  created_at: string;
}

interface Props {
  report: ReportDocumentData;
}

function formatDateLong(d: string) {
  // d is YYYY-MM-DD
  const [y, m, day] = d.split("-").map(Number);
  if (!y || !m || !day) return d;
  const date = new Date(y, m - 1, day);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Default planned program length, in minutes. 12 hours = 720 minutes. */
export const PLANNED_TOTAL_MINUTES = 12 * 60;

export function formatTotalClassTime(lengthMinutes: number, classes: number): string {
  const total = Math.max(0, Math.round(lengthMinutes * classes));
  return formatMinutes(total);
}

export function formatMinutes(total: number): string {
  const t = Math.max(0, Math.round(total));
  if (t === 0) return "0 minutes";
  const hours = Math.floor(t / 60);
  const minutes = t % 60;
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} h (${t} min)`;
  return `${hours} h ${minutes} min (${t} min)`;
}

export interface ProgressSnapshot {
  completedMinutes: number;
  remainingMinutes: number;
  plannedMinutes: number;
  classesCompleted: number;
  plannedClasses: number;
  classesRemaining: number;
  percent: number; // 0–100
}

export function computeProgress(
  classLengthMinutes: number,
  classesCompleted: number | null,
  plannedTotalMinutes: number = PLANNED_TOTAL_MINUTES,
): ProgressSnapshot | null {
  if (!classLengthMinutes || classLengthMinutes <= 0) return null;
  const done = Math.max(0, classesCompleted ?? 0);
  const completedMinutes = done * classLengthMinutes;
  const plannedClasses = Math.max(1, Math.round(plannedTotalMinutes / classLengthMinutes));
  const cappedDone = Math.min(done, plannedClasses);
  const remainingMinutes = Math.max(0, plannedTotalMinutes - completedMinutes);
  const percent = Math.min(100, Math.round((completedMinutes / plannedTotalMinutes) * 100));
  return {
    completedMinutes,
    remainingMinutes,
    plannedMinutes: plannedTotalMinutes,
    classesCompleted: done,
    plannedClasses,
    classesRemaining: Math.max(0, plannedClasses - cappedDone),
    percent,
  };
}

const ReportDocument = memo(({ report }: Props) => {
  const r = report;
  const [checksum, setChecksum] = useState<string>("");
  const exportedAt = new Date().toLocaleString();
  const submittedAt = new Date(r.created_at).toLocaleString();
  const progress = computeProgress(r.class_length_minutes, r.classes_completed);

  useEffect(() => {
    let cancelled = false;
    reportChecksum(r).then((h) => {
      if (!cancelled) setChecksum(h);
    });
    return () => {
      cancelled = true;
    };
  }, [r]);

  return (
    <article
      id="report-document"
      className="report-document bg-white text-slate-900 mx-auto shadow-2xl"
      style={{
        width: "100%",
        maxWidth: "8.5in",
        minHeight: "11in",
        padding: "0.85in 0.9in",
        fontFamily:
          "'Times New Roman', 'Noto Serif KR', Georgia, serif",
        lineHeight: 1.6,
      }}
    >
      {/* Letterhead */}
      <header
        className="flex items-end justify-between pb-5 mb-8"
        style={{ borderBottom: "2px solid #0f1f3d" }}
      >
        <div>
          <div
            className="text-3xl font-bold tracking-tight"
            style={{ color: "#0f1f3d", fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            IBCircle
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 mt-1">
            Class Report · 수업 리포트
          </div>
        </div>
        <div className="text-right text-xs text-slate-500">
          <div>Confidential</div>
          <div>Generated {new Date().toLocaleDateString()}</div>
        </div>
      </header>

      <h1
        className="text-2xl font-semibold mb-1"
        style={{ color: "#0f1f3d" }}
      >
        {r.subject}
      </h1>
      <p className="text-sm text-slate-600 mb-8">
        Prepared for <strong className="text-slate-900">{r.student_name}</strong>
        {r.teacher_name ? (
          <> · Instructor <strong className="text-slate-900">{r.teacher_name}</strong></>
        ) : null}
      </p>

      {/* Meta grid */}
      <section
        className="grid grid-cols-2 gap-x-8 gap-y-4 p-5 mb-8"
        style={{ background: "#f5f7fb", border: "1px solid #e5e9f2", borderRadius: 6 }}
      >
        <Meta label="Class date" value={formatDateLong(r.class_date)} />
        <Meta label="Class time" value={r.class_time.slice(0, 5)} />
        <Meta label="Duration" value={`${r.class_length_minutes} minutes`} />
        <Meta
          label="Classes completed"
          value={
            r.classes_completed !== null && r.classes_completed !== undefined
              ? `#${r.classes_completed}`
              : "—"
          }
        />
        <Meta label="Subject" value={r.subject} />
        {r.classes_completed !== null && r.classes_completed !== undefined && r.classes_completed > 0 ? (
          <Meta
            label="Total class time"
            value={formatTotalClassTime(r.class_length_minutes, r.classes_completed)}
          />
        ) : (
          <Meta
            label="Submitted"
            value={new Date(r.created_at).toLocaleString()}
          />
        )}
      </section>

      {progress && (
        <section
          className="mb-8 p-5"
          style={{ background: "#fff", border: "1px solid #e5e9f2", borderRadius: 6 }}
        >
          <div className="flex items-baseline justify-between gap-3 mb-3">
            <h2
              className="text-base font-semibold uppercase tracking-[0.16em]"
              style={{ color: "#0f1f3d" }}
            >
              Program Progress
            </h2>
            <span className="text-xs text-slate-500">진도 현황 · 12h 목표</span>
          </div>

          <div className="flex items-end justify-between gap-4 mb-2">
            <div className="text-sm text-slate-700">
              <strong className="text-slate-900">{formatMinutes(progress.completedMinutes)}</strong>{" "}
              completed of <strong className="text-slate-900">{formatMinutes(progress.plannedMinutes)}</strong>
            </div>
            <div className="text-sm font-medium" style={{ color: "#0f1f3d" }}>
              {progress.percent}%
            </div>
          </div>

          <div
            className="w-full overflow-hidden"
            style={{ height: 10, background: "#e5e9f2", borderRadius: 999 }}
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              style={{
                width: `${progress.percent}%`,
                height: "100%",
                background: "#0f1f3d",
                borderRadius: 999,
                transition: "width 400ms ease",
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Classes completed
              </div>
              <div className="font-medium text-slate-900">
                {progress.classesCompleted} / {progress.plannedClasses}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Classes remaining
              </div>
              <div className="font-medium text-slate-900">
                {progress.classesRemaining}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
                Time remaining
              </div>
              <div className="font-medium text-slate-900">
                {formatMinutes(progress.remainingMinutes)}
              </div>
            </div>
          </div>
        </section>
      )}

      <Section title="Topics Covered" subtitle="학습 내용">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {r.topics_covered}
        </p>
      </Section>

      <Section title="Instructor's Report" subtitle="강사 리포트">
        <p className="whitespace-pre-wrap text-[15px] leading-relaxed">
          {r.report_text}
        </p>
      </Section>

      <footer
        className="mt-12 pt-5 text-xs text-slate-500 space-y-1"
        style={{ borderTop: "1px solid #e5e9f2" }}
      >
        <FooterRow label="Report ID" value={r.id} mono />
      </footer>
    </article>
  );
});

const FooterRow = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
  <div className="flex justify-between gap-4">
    <span className="text-[10px] uppercase tracking-[0.12em] text-slate-400">{label}</span>
    <span className={mono ? "font-mono text-[11px] text-slate-700" : "text-[11px] text-slate-700"}>{value}</span>
  </div>
);

const Meta = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.18em] text-slate-500 mb-1">
      {label}
    </div>
    <div className="text-sm font-medium text-slate-900">{value}</div>
  </div>
);

const Section = ({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) => (
  <section className="mb-8">
    <div className="flex items-baseline gap-3 mb-3">
      <h2
        className="text-base font-semibold uppercase tracking-[0.16em]"
        style={{ color: "#0f1f3d" }}
      >
        {title}
      </h2>
      {subtitle && (
        <span className="text-xs text-slate-500">{subtitle}</span>
      )}
    </div>
    <div
      className="pl-4"
      style={{ borderLeft: "3px solid #0f1f3d" }}
    >
      {children}
    </div>
  </section>
);

ReportDocument.displayName = "ReportDocument";
export default ReportDocument;

// Local-only draft storage for teacher report form. Drafts live in this browser.

export interface FormState {
  teacher_name: string;
  student_name: string;
  subject: string;
  class_date: string;
  class_time: string;
  class_length_minutes: string;
  classes_completed: string;
  topics_covered: string;
  report_text: string;
}

export const initialFormState: FormState = {
  teacher_name: "",
  student_name: "",
  subject: "",
  class_date: "",
  class_time: "",
  class_length_minutes: "60",
  classes_completed: "",
  topics_covered: "",
  report_text: "",
};

export interface Draft {
  id: string;
  label: string;
  form: FormState;
  savedAt: number;
}

const KEY = "teacherReportDrafts:v2";

function readAll(): Draft[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((d) => d && typeof d.id === "string" && d.form);
  } catch {
    return [];
  }
}

function writeAll(drafts: Draft[]) {
  localStorage.setItem(KEY, JSON.stringify(drafts));
}

export function listDrafts(): Draft[] {
  return readAll().sort((a, b) => b.savedAt - a.savedAt);
}

export function getDraft(id: string): Draft | null {
  return readAll().find((d) => d.id === id) ?? null;
}

export function saveDraft(input: { id: string | null; form: FormState; label: string }): Draft {
  const all = readAll();
  const id = input.id ?? (typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `d_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  const draft: Draft = { id, label: input.label, form: input.form, savedAt: Date.now() };
  const idx = all.findIndex((d) => d.id === id);
  if (idx >= 0) all[idx] = draft;
  else all.push(draft);
  writeAll(all);
  return draft;
}

export function deleteDraft(id: string): void {
  writeAll(readAll().filter((d) => d.id !== id));
}

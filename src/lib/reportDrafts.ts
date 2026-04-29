// Database-backed draft storage for teacher report form.
// Drafts live in the teacher_report_drafts table and are accessed via the
// verify-admin-passcode edge function (admin or owner token required).

import { supabase } from "@/integrations/supabase/client";

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

interface DbDraftRow {
  id: string;
  teacher_name: string | null;
  student_name: string | null;
  subject: string | null;
  class_date: string | null;
  class_time: string | null;
  class_length_minutes: number | null;
  classes_completed: number | null;
  topics_covered: string | null;
  report_text: string | null;
  label: string | null;
  updated_at: string;
  created_at: string;
}

function getToken(): string | null {
  // Prefer admin (teacher) token; fall back to owner token if present.
  for (const key of ["adminToken", "ownerToken"]) {
    const raw = sessionStorage.getItem(key);
    if (!raw) continue;
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.token && parsed?.expiresAt && Date.now() < parsed.expiresAt) {
        return parsed.token as string;
      }
    } catch {
      // ignore
    }
  }
  return null;
}

function rowToDraft(row: DbDraftRow): Draft {
  const form: FormState = {
    teacher_name: row.teacher_name ?? "",
    student_name: row.student_name ?? "",
    subject: row.subject ?? "",
    class_date: row.class_date ?? "",
    // class_time may come back as HH:MM:SS — trim seconds for <input type="time">
    class_time: row.class_time ? row.class_time.slice(0, 5) : "",
    class_length_minutes:
      row.class_length_minutes !== null && row.class_length_minutes !== undefined
        ? String(row.class_length_minutes)
        : "60",
    classes_completed:
      row.classes_completed !== null && row.classes_completed !== undefined
        ? String(row.classes_completed)
        : "",
    topics_covered: row.topics_covered ?? "",
    report_text: row.report_text ?? "",
  };
  return {
    id: row.id,
    label: row.label?.trim() || row.student_name || "Untitled draft",
    form,
    savedAt: new Date(row.updated_at).getTime(),
  };
}

function formToDraftPayload(form: FormState, label: string, id?: string | null) {
  const completedRaw = form.classes_completed.trim();
  const lengthRaw = form.class_length_minutes.trim();
  return {
    id: id ?? null,
    teacher_name: form.teacher_name.trim() || null,
    student_name: form.student_name.trim() || null,
    subject: form.subject.trim() || null,
    class_date: form.class_date || null,
    class_time: form.class_time || null,
    class_length_minutes: lengthRaw === "" ? null : Number(lengthRaw),
    classes_completed: completedRaw === "" ? null : Number(completedRaw),
    topics_covered: form.topics_covered.trim() || null,
    report_text: form.report_text.trim() || null,
    label,
  };
}

export async function listDrafts(): Promise<Draft[]> {
  const token = getToken();
  if (!token) return [];
  const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
    body: { action: "list-drafts", token },
  });
  if (error || !data?.drafts) return [];
  return (data.drafts as DbDraftRow[]).map(rowToDraft);
}

export async function getDraft(id: string): Promise<Draft | null> {
  const token = getToken();
  if (!token) return null;
  const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
    body: { action: "get-draft", token, draftId: id },
  });
  if (error || !data?.draft) return null;
  return rowToDraft(data.draft as DbDraftRow);
}

export async function saveDraft(input: {
  id: string | null;
  form: FormState;
  label: string;
}): Promise<Draft> {
  const token = getToken();
  if (!token) throw new Error("Not authenticated");
  const payload = formToDraftPayload(input.form, input.label, input.id);
  const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
    body: { action: "upsert-draft", token, draft: payload },
  });
  if (error || !data?.draft) throw new Error("Failed to save draft");
  return rowToDraft(data.draft as DbDraftRow);
}

export async function deleteDraft(id: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  await supabase.functions.invoke("verify-admin-passcode", {
    body: { action: "delete-draft", token, draftId: id },
  });
}

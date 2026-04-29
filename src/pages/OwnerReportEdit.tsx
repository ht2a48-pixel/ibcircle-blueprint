import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Save } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface FormState {
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

const empty: FormState = {
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

const OwnerReportEdit = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(empty);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem("ownerToken");
    if (!raw) {
      navigate("/admin/owner");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.token || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem("ownerToken");
        navigate("/admin/owner");
        return;
      }
      setToken(parsed.token);
    } catch {
      sessionStorage.removeItem("ownerToken");
      navigate("/admin/owner");
    }
  }, [navigate]);

  useEffect(() => {
    if (!token || !id) return;
    (async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
          body: { action: "list-teacher-reports", token },
        });
        if (error || !data?.reports) {
          toast.error("Failed to load report");
          setLoading(false);
          return;
        }
        const found = (data.reports as Array<Record<string, unknown>>).find((r) => r.id === id);
        if (!found) {
          toast.error("Report not found");
          navigate("/admin/logs");
          return;
        }
        setForm({
          teacher_name: (found.teacher_name as string) ?? "",
          student_name: (found.student_name as string) ?? "",
          subject: (found.subject as string) ?? "",
          class_date: (found.class_date as string) ?? "",
          class_time: typeof found.class_time === "string" ? (found.class_time as string).slice(0, 5) : "",
          class_length_minutes: String((found.class_length_minutes as number) ?? "60"),
          classes_completed:
            found.classes_completed !== null && found.classes_completed !== undefined
              ? String(found.classes_completed)
              : "",
          topics_covered: (found.topics_covered as string) ?? "",
          report_text: (found.report_text as string) ?? "",
        });
      } catch (e) {
        console.error(e);
        toast.error("Error loading report");
      }
      setLoading(false);
    })();
  }, [token, id, navigate]);

  const update = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !id) return;

    const lengthNum = Number(form.class_length_minutes);
    const completedRaw = form.classes_completed.trim();
    const completedNum = completedRaw === "" ? null : Number(completedRaw);
    if (!form.student_name.trim() || !form.subject.trim() || !form.topics_covered.trim() ||
        !form.report_text.trim() || !form.class_date || !form.class_time ||
        !Number.isFinite(lengthNum) || lengthNum <= 0 || lengthNum > 600 ||
        (completedNum !== null && (!Number.isFinite(completedNum) || completedNum < 0 || completedNum > 10000))) {
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: {
          action: "update-teacher-report",
          token,
          reportId: id,
          report: {
            teacher_name: form.teacher_name.trim() || null,
            student_name: form.student_name.trim(),
            subject: form.subject.trim(),
            class_date: form.class_date,
            class_time: form.class_time,
            class_length_minutes: lengthNum,
            classes_completed: completedNum,
            topics_covered: form.topics_covered.trim(),
            report_text: form.report_text.trim(),
          },
        },
      });
      if (error || !data?.success) {
        toast.error("Failed to save changes");
        setSaving(false);
        return;
      }
      toast.success("Report updated");
      navigate(`/admin/logs/${id}`);
    } catch (err) {
      console.error(err);
      toast.error("Update error");
    }
    setSaving(false);
  }, [form, id, token, navigate]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate(`/admin/logs/${id}`)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Edit Submitted Report</CardTitle>
            <CardDescription>
              Owner-only. Changes are written directly to the report record.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-muted-foreground">Loading…</p>
            ) : (
              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="teacher_name">Teacher name</Label>
                    <Input id="teacher_name" value={form.teacher_name} onChange={update("teacher_name")} maxLength={100} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="student_name">Student name *</Label>
                    <Input id="student_name" required value={form.student_name} onChange={update("student_name")} maxLength={200} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject *</Label>
                  <Input id="subject" required value={form.subject} onChange={update("subject")} maxLength={100} />
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="class_date">Class date *</Label>
                    <Input id="class_date" type="date" required value={form.class_date} onChange={update("class_date")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class_time">Class time *</Label>
                    <Input id="class_time" type="time" required value={form.class_time} onChange={update("class_time")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="class_length_minutes">Length (minutes) *</Label>
                    <Input
                      id="class_length_minutes"
                      type="number"
                      min={1}
                      max={600}
                      required
                      value={form.class_length_minutes}
                      onChange={update("class_length_minutes")}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="classes_completed">Classes completed</Label>
                  <Input
                    id="classes_completed"
                    type="number"
                    min={0}
                    max={10000}
                    value={form.classes_completed}
                    onChange={update("classes_completed")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="topics_covered">Topics covered *</Label>
                  <Textarea
                    id="topics_covered"
                    required
                    rows={3}
                    value={form.topics_covered}
                    onChange={update("topics_covered")}
                    maxLength={2000}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="report_text">Report *</Label>
                  <Textarea
                    id="report_text"
                    required
                    rows={10}
                    value={form.report_text}
                    onChange={update("report_text")}
                    maxLength={10000}
                  />
                </div>

                <Button type="submit" disabled={saving} className="w-full">
                  <Save className="w-4 h-4 mr-2" />
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

OwnerReportEdit.displayName = "OwnerReportEdit";
export default OwnerReportEdit;

import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, Send } from "lucide-react";
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

const initial: FormState = {
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

const TeacherReportForm = memo(() => {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(initial);
  const [submitting, setSubmitting] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem("adminToken");
    if (!raw) {
      navigate("/admin");
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      if (!parsed.token || !parsed.expiresAt || Date.now() > parsed.expiresAt) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin");
        return;
      }
      setToken(parsed.token);
    } catch {
      sessionStorage.removeItem("adminToken");
      navigate("/admin");
    }
  }, [navigate]);

  const update = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

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

    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: {
          action: "submit-teacher-report",
          token,
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
        toast.error("Failed to submit report. Please try again.");
        setSubmitting(false);
        return;
      }

      toast.success("Report submitted successfully");
      setForm(initial);
    } catch (err) {
      console.error(err);
      toast.error("Submission error");
    }
    setSubmitting(false);
  }, [form, token]);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" size="sm" className="mb-4" onClick={() => navigate("/admin/hub")}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Write a Class Report</CardTitle>
            <CardDescription>
              All fields marked with * are required. Your submission will be saved and visible to the owner only.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="teacher_name">Teacher name (optional)</Label>
                  <Input id="teacher_name" value={form.teacher_name} onChange={update("teacher_name")} maxLength={100} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student_name">Student name *</Label>
                  <Input id="student_name" required value={form.student_name} onChange={update("student_name")} maxLength={200} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input id="subject" required placeholder="e.g. IB Economics HL" value={form.subject} onChange={update("subject")} maxLength={100} />
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
                <Label htmlFor="classes_completed">Classes completed so far</Label>
                <Input
                  id="classes_completed"
                  type="number"
                  min={0}
                  max={10000}
                  placeholder="e.g. 12"
                  value={form.classes_completed}
                  onChange={update("classes_completed")}
                />
                <p className="text-xs text-muted-foreground">
                  Total number of classes the student has completed up to and including this one.
                </p>
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
                  placeholder="e.g. Elasticity of demand, real-world examples, IA structure"
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
                  placeholder="Write your qualitative observations and feedback here. (No number grades — focus on understanding, engagement, next steps.)"
                />
                <p className="text-xs text-muted-foreground">
                  Tip: avoid numeric grades. Focus on what the student understood, struggled with, and what to do next.
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={submitting}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Submitting..." : "Submit report"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

TeacherReportForm.displayName = "TeacherReportForm";
export default TeacherReportForm;

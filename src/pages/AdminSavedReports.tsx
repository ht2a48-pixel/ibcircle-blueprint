import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, RefreshCw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface SavedReport {
  id: string;
  teacher_name: string | null;
  student_name: string;
  subject: string;
  class_date: string; // YYYY-MM-DD
  class_time: string; // HH:MM:SS
  class_length_minutes: number;
  classes_completed: number | null;
  created_at: string;
}

interface DraftSchedule {
  class_date: string;
  class_time: string; // HH:MM
  class_length_minutes: string;
}

const AdminSavedReports = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState<string>("");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [drafts, setDrafts] = useState<Record<string, DraftSchedule>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  // Auth gate
  useEffect(() => {
    const raw = sessionStorage.getItem("adminToken");
    if (!raw) {
      navigate("/admin");
      return;
    }
    try {
      const { token: t, expiresAt } = JSON.parse(raw);
      if (!t || !expiresAt || Date.now() > expiresAt) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin");
        return;
      }
      setToken(t);
    } catch {
      sessionStorage.removeItem("adminToken");
      navigate("/admin");
    }
  }, [navigate]);

  const loadReports = useCallback(async (t: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "list-teacher-reports-admin", token: t },
      });
      if (error || !data?.reports) {
        toast.error("Failed to load reports");
        setReports([]);
        return;
      }
      const list: SavedReport[] = data.reports;
      setReports(list);
      const next: Record<string, DraftSchedule> = {};
      for (const r of list) {
        next[r.id] = {
          class_date: r.class_date,
          class_time: (r.class_time || "").slice(0, 5),
          class_length_minutes: String(r.class_length_minutes ?? ""),
        };
      }
      setDrafts(next);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) loadReports(token);
  }, [token, loadReports]);

  const updateDraft = (id: string, patch: Partial<DraftSchedule>) => {
    setDrafts((d) => ({ ...d, [id]: { ...d[id], ...patch } }));
  };

  const isDirty = useCallback(
    (r: SavedReport) => {
      const d = drafts[r.id];
      if (!d) return false;
      return (
        d.class_date !== r.class_date ||
        d.class_time !== (r.class_time || "").slice(0, 5) ||
        Number(d.class_length_minutes) !== r.class_length_minutes
      );
    },
    [drafts],
  );

  const handleSave = async (r: SavedReport) => {
    const d = drafts[r.id];
    if (!d) return;
    const len = Number(d.class_length_minutes);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(d.class_date)) {
      toast.error("Invalid date");
      return;
    }
    if (!/^\d{2}:\d{2}$/.test(d.class_time)) {
      toast.error("Invalid time");
      return;
    }
    if (!Number.isFinite(len) || len <= 0 || len > 600) {
      toast.error("Length must be 1–600 minutes");
      return;
    }
    setSavingId(r.id);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: {
          action: "update-teacher-report-schedule",
          token,
          reportId: r.id,
          updates: {
            class_date: d.class_date,
            class_time: d.class_time,
            class_length_minutes: len,
          },
        },
      });
      if (error || !data?.success) {
        toast.error(data?.error || "Failed to save");
        return;
      }
      toast.success("Report updated");
      setReports((rs) =>
        rs.map((x) =>
          x.id === r.id
            ? { ...x, class_date: d.class_date, class_time: d.class_time, class_length_minutes: len }
            : x,
        ),
      );
    } finally {
      setSavingId(null);
    }
  };

  const sorted = useMemo(
    () =>
      [...reports].sort((a, b) =>
        a.class_date < b.class_date ? 1 : a.class_date > b.class_date ? -1 : 0,
      ),
    [reports],
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Saved Reports</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Adjust the class date, time, or length on a previously submitted report.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadReports(token)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/hub")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Loading reports…
          </div>
        ) : sorted.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No reports saved yet.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sorted.map((r) => {
              const d = drafts[r.id];
              const dirty = isDirty(r);
              return (
                <Card key={r.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <CardTitle className="text-base">
                        {r.student_name} · <span className="text-muted-foreground font-normal">{r.subject}</span>
                      </CardTitle>
                      <div className="text-xs text-muted-foreground">
                        {r.teacher_name ? `Instructor: ${r.teacher_name} · ` : ""}
                        Submitted {new Date(r.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-4 items-end">
                      <div className="space-y-1.5">
                        <Label htmlFor={`date-${r.id}`}>Class date</Label>
                        <Input
                          id={`date-${r.id}`}
                          type="date"
                          value={d?.class_date ?? ""}
                          onChange={(e) => updateDraft(r.id, { class_date: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`time-${r.id}`}>Class time</Label>
                        <Input
                          id={`time-${r.id}`}
                          type="time"
                          value={d?.class_time ?? ""}
                          onChange={(e) => updateDraft(r.id, { class_time: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor={`len-${r.id}`}>Length (min)</Label>
                        <Input
                          id={`len-${r.id}`}
                          type="number"
                          min={1}
                          max={600}
                          value={d?.class_length_minutes ?? ""}
                          onChange={(e) =>
                            updateDraft(r.id, { class_length_minutes: e.target.value })
                          }
                        />
                      </div>
                      <Button
                        onClick={() => handleSave(r)}
                        disabled={!dirty || savingId === r.id}
                        className="w-full"
                      >
                        {savingId === r.id ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSavedReports;

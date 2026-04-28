import { useEffect, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, LogOut, RefreshCw, Inbox } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeacherReport {
  id: string;
  teacher_name: string | null;
  student_name: string;
  subject: string;
  topics_covered: string;
  class_date: string;
  class_time: string;
  class_length_minutes: number;
  report_text: string;
  created_at: string;
}

const OwnerLogs = memo(() => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<TeacherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

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

  const load = async (t: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "list-teacher-reports", token: t },
      });
      if (error || !data?.reports) {
        toast.error("Failed to load reports");
        setLoading(false);
        return;
      }
      setReports(data.reports as TeacherReport[]);
    } catch (err) {
      console.error(err);
      toast.error("Error loading reports");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token) load(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const logout = () => {
    sessionStorage.removeItem("ownerToken");
    navigate("/admin/owner");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Teacher Reports Log</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => token && load(token)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          {reports.length} report{reports.length === 1 ? "" : "s"} total. Showing the most recent 500.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : reports.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center text-center">
              <Inbox className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No teacher reports submitted yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reports.map((r) => (
              <Card key={r.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        {r.student_name} · <span className="text-muted-foreground font-normal">{r.subject}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {r.class_date} at {r.class_time.slice(0, 5)} · {r.class_length_minutes} min
                        {r.teacher_name ? ` · Teacher: ${r.teacher_name}` : ""}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      Submitted {new Date(r.created_at).toLocaleString()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Topics covered</p>
                    <p className="text-sm whitespace-pre-wrap">{r.topics_covered}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Report</p>
                    <p className="text-sm whitespace-pre-wrap">{r.report_text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});

OwnerLogs.displayName = "OwnerLogs";
export default OwnerLogs;

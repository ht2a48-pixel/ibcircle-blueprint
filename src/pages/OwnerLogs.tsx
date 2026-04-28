import { useEffect, useMemo, useState, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft,
  LogOut,
  RefreshCw,
  Inbox,
  ChevronLeft,
  ChevronRight,
  Download,
  Trash2,
  CalendarDays,
  List as ListIcon,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface TeacherReport {
  id: string;
  teacher_name: string | null;
  student_name: string;
  subject: string;
  topics_covered: string;
  class_date: string; // YYYY-MM-DD
  class_time: string;
  class_length_minutes: number;
  classes_completed: number | null;
  report_text: string;
  created_at: string;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function ymd(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

const OwnerLogs = memo(() => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<TeacherReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [cursor, setCursor] = useState<Date>(() => {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<TeacherReport | null>(null);

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

  // Reports grouped by class_date
  const byDate = useMemo(() => {
    const map = new Map<string, TeacherReport[]>();
    for (const r of reports) {
      const key = r.class_date;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [reports]);

  // Calendar grid construction
  const calendarCells = useMemo(() => {
    const year = cursor.getFullYear();
    const month = cursor.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: Array<{ date: Date | null; key: string }> = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ date: null, key: `b-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      cells.push({ date, key: ymd(date) });
    }
    while (cells.length % 7 !== 0) cells.push({ date: null, key: `a-${cells.length}` });
    return cells;
  }, [cursor]);

  const goPrevMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
  const goNextMonth = () => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
  const goToday = () => {
    const d = new Date();
    setCursor(new Date(d.getFullYear(), d.getMonth(), 1));
    setSelectedDate(ymd(d));
  };

  const reportsForSelectedDate = selectedDate ? byDate.get(selectedDate) ?? [] : [];

  const openReportPage = (r: TeacherReport) => {
    navigate(`/admin/logs/${r.id}`);
  };

  const deleteReport = async (r: TeacherReport) => {
    if (!token) return;
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "delete-teacher-report", token, reportId: r.id },
      });
      if (error || !data?.success) {
        toast.error("Failed to delete");
        return;
      }
      toast.success("Report deleted");
      setReports((prev) => prev.filter((x) => x.id !== r.id));
      setConfirmDelete(null);
      
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Home
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Teacher Reports Log</h1>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={view === "calendar" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("calendar")}
            >
              <CalendarDays className="w-4 h-4 mr-2" /> Calendar
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setView("list")}
            >
              <ListIcon className="w-4 h-4 mr-2" /> List
            </Button>
            <Button variant="outline" size="sm" onClick={() => token && load(token)} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          {reports.length} report{reports.length === 1 ? "" : "s"} total.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : view === "calendar" ? (
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={goPrevMonth} aria-label="Previous month">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <CardTitle className="text-xl min-w-[200px] text-center">
                    {MONTH_NAMES[cursor.getMonth()]} {cursor.getFullYear()}
                  </CardTitle>
                  <Button variant="outline" size="icon" onClick={goNextMonth} aria-label="Next month">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <Button variant="ghost" size="sm" onClick={goToday}>Today</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-1 mb-2 text-xs font-semibold uppercase text-muted-foreground text-center">
                {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((d) => (
                  <div key={d} className="py-1">{d}</div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell) => {
                  if (!cell.date) {
                    return <div key={cell.key} className="aspect-square rounded-md bg-muted/30" />;
                  }
                  const key = ymd(cell.date);
                  const dayReports = byDate.get(key) ?? [];
                  const isToday = key === ymd(new Date());
                  const isSelected = key === selectedDate;
                  const hasReports = dayReports.length > 0;
                  return (
                    <button
                      key={cell.key}
                      onClick={() => setSelectedDate(key)}
                      className={`aspect-square rounded-md border p-1 md:p-2 text-left transition-colors flex flex-col overflow-hidden ${
                        isSelected
                          ? "border-primary bg-primary/10"
                          : hasReports
                          ? "border-primary/40 bg-primary/5 hover:bg-primary/10"
                          : "border-border hover:bg-muted/50"
                      }`}
                    >
                      <div className={`text-xs md:text-sm font-medium ${isToday ? "text-primary" : ""}`}>
                        {cell.date.getDate()}
                      </div>
                      <div className="flex-1 mt-1 space-y-0.5 overflow-hidden">
                        {dayReports.slice(0, 2).map((r) => (
                          <div
                            key={r.id}
                            className="text-[10px] md:text-xs truncate bg-primary text-primary-foreground rounded px-1"
                            title={`${r.student_name} · ${r.subject}`}
                          >
                            {r.student_name}
                          </div>
                        ))}
                        {dayReports.length > 2 && (
                          <div className="text-[10px] text-muted-foreground">
                            +{dayReports.length - 2} more
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedDate && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-sm font-semibold mb-3">
                    Reports on {selectedDate}
                  </h3>
                  {reportsForSelectedDate.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No reports for this date.</p>
                  ) : (
                    <div className="space-y-2">
                      {reportsForSelectedDate.map((r) => (
                        <div
                          key={r.id}
                          className="flex items-center justify-between gap-2 p-3 rounded-md border hover:bg-muted/40 cursor-pointer"
                          onClick={() => openReportPage(r)}
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium truncate">
                              {r.student_name} <span className="text-muted-foreground font-normal">· {r.subject}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {r.class_time.slice(0, 5)} · {r.class_length_minutes} min
                              {r.teacher_name ? ` · ${r.teacher_name}` : ""}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); openReportPage(r); }}
                              aria-label="Open"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => { e.stopPropagation(); setConfirmDelete(r); }}
                              aria-label="Delete"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
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
              <Card key={r.id} className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => openReportPage(r)}>
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">
                        {r.student_name} · <span className="text-muted-foreground font-normal">{r.subject}</span>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {r.class_date} at {r.class_time.slice(0, 5)} · {r.class_length_minutes} min
                        {r.classes_completed !== null && r.classes_completed !== undefined ? ` · Class #${r.classes_completed}` : ""}
                        {r.teacher_name ? ` · Teacher: ${r.teacher_name}` : ""}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <Badge variant="secondary" className="text-xs">
                        Submitted {new Date(r.created_at).toLocaleString()}
                      </Badge>
                      <Button variant="ghost" size="icon" onClick={() => openReportPage(r)} aria-label="Open">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(r)} aria-label="Delete">
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Topics covered</p>
                    <p className="text-sm whitespace-pre-wrap line-clamp-2">{r.topics_covered}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Report</p>
                    <p className="text-sm whitespace-pre-wrap line-clamp-3">{r.report_text}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>


      {/* Delete confirmation */}
      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this report?</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmDelete && (
                <>
                  This will permanently delete the report for{" "}
                  <strong>{confirmDelete.student_name}</strong> on {confirmDelete.class_date}.
                  This action cannot be undone.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && deleteReport(confirmDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
});

OwnerLogs.displayName = "OwnerLogs";
export default OwnerLogs;

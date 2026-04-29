import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, FilePen, Trash2, Plus, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { listDrafts, deleteDraft, type Draft } from "@/lib/reportDrafts";

const AdminSavedReports = () => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);

  // Auth gate
  useEffect(() => {
    const raw = sessionStorage.getItem("adminToken");
    if (!raw) {
      navigate("/admin");
      return;
    }
    try {
      const { token, expiresAt } = JSON.parse(raw);
      if (!token || !expiresAt || Date.now() > expiresAt) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin");
      }
    } catch {
      sessionStorage.removeItem("adminToken");
      navigate("/admin");
    }
  }, [navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listDrafts();
      setDrafts(list);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    await deleteDraft(id);
    await refresh();
    toast.success("Draft deleted");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8 gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Saved Drafts</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Unfinished reports shared across teachers. Resume to continue editing or submit.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button size="sm" onClick={() => navigate("/admin/write")}>
              <Plus className="w-4 h-4 mr-2" /> New report
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/hub")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Button>
          </div>
        </div>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No drafts saved. Start a new report and click "Save draft" to keep your work.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle className="text-base">{d.label || "Untitled draft"}</CardTitle>
                    <div className="text-xs text-muted-foreground">
                      Saved {new Date(d.savedAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" })}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="text-sm text-muted-foreground line-clamp-2 max-w-xl">
                      {d.form.report_text?.trim() || d.form.topics_covered?.trim() || "—"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => navigate(`/admin/write?draft=${encodeURIComponent(d.id)}`)}
                      >
                        <FilePen className="w-4 h-4 mr-2" /> Resume
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(d.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSavedReports;

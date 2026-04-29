import { useEffect, useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ArrowLeft, FilePen, Trash2, RefreshCw, LogOut, Inbox } from "lucide-react";
import { toast } from "sonner";
import { listDrafts, deleteDraft, type Draft } from "@/lib/reportDrafts";

const OwnerDrafts = memo(() => {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState<Draft | null>(null);

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
      }
    } catch {
      sessionStorage.removeItem("ownerToken");
      navigate("/admin/owner");
    }
  }, [navigate]);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const list = await listDrafts();
      setDrafts(list);
    } catch {
      toast.error("Failed to load drafts");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const handleDelete = async (d: Draft) => {
    try {
      await deleteDraft(d.id);
      setDrafts((prev) => prev.filter((x) => x.id !== d.id));
      toast.success("Draft deleted");
    } catch {
      toast.error("Failed to delete draft");
    }
    setConfirmDelete(null);
  };

  const logout = () => {
    sessionStorage.removeItem("ownerToken");
    navigate("/admin/owner");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate("/admin/logs")}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Submitted reports
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold">Saved Drafts (all teachers)</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={refresh} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} /> Refresh
            </Button>
            <Button variant="ghost" size="sm" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">
          {drafts.length} draft{drafts.length === 1 ? "" : "s"} in progress.
        </p>

        {loading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : drafts.length === 0 ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center text-center">
              <Inbox className="w-10 h-10 text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No drafts in progress.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {drafts.map((d) => (
              <Card key={d.id}>
                <CardHeader className="pb-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <CardTitle className="text-base">
                      {d.label || "Untitled draft"}
                      {d.form.teacher_name ? (
                        <span className="text-muted-foreground font-normal text-sm"> · {d.form.teacher_name}</span>
                      ) : null}
                    </CardTitle>
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
                        <FilePen className="w-4 h-4 mr-2" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setConfirmDelete(d)}
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

      <AlertDialog open={!!confirmDelete} onOpenChange={(o) => !o && setConfirmDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this draft?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the draft. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => confirmDelete && handleDelete(confirmDelete)}
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

OwnerDrafts.displayName = "OwnerDrafts";
export default OwnerDrafts;

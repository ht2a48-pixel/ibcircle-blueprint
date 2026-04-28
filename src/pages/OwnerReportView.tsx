import { useEffect, useState, memo, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Download, Printer, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import ReportDocument, { ReportDocumentData } from "@/components/ReportDocument";

const OwnerReportView = memo(() => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [token, setToken] = useState<string | null>(null);
  const [report, setReport] = useState<ReportDocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);

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
        const found = (data.reports as ReportDocumentData[]).find((r) => r.id === id);
        if (!found) {
          toast.error("Report not found");
          navigate("/admin/logs");
          return;
        }
        setReport(found);
      } catch (e) {
        console.error(e);
        toast.error("Error loading report");
      }
      setLoading(false);
    })();
  }, [token, id, navigate]);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  const handleDownloadHtml = useCallback(() => {
    if (!report) return;
    const node = document.getElementById("report-document");
    if (!node) return;
    const safeName = report.student_name.replace(/[^a-z0-9가-힣]+/gi, "_");
    const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>IBCircle Report — ${report.student_name} — ${report.class_date}</title>
<script src="https://cdn.tailwindcss.com"></script>
<style>
  @page { size: Letter; margin: 0; }
  body { margin: 0; background: #eef0f5; font-family: 'Times New Roman', 'Noto Serif KR', Georgia, serif; }
  .report-document { background: #fff; margin: 24px auto; }
  @media print {
    body { background: #fff; }
    .report-document { box-shadow: none !important; margin: 0 auto; }
    .no-print { display: none !important; }
  }
</style>
</head>
<body>
<div class="no-print" style="text-align:center; padding:16px;">
  <button onclick="window.print()" style="padding:8px 16px; font-family:system-ui; cursor:pointer; border:1px solid #0f1f3d; background:#0f1f3d; color:#fff; border-radius:4px;">
    Print / Save as PDF
  </button>
</div>
${node.outerHTML}
</body>
</html>`;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `IBCircle_Report_${safeName}_${report.class_date}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    toast.success("Report downloaded. Open it and use Print → Save as PDF for highest quality.");
  }, [report]);

  const handleDelete = useCallback(async () => {
    if (!report || !token) return;
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "delete-teacher-report", token, reportId: report.id },
      });
      if (error || !data?.success) {
        toast.error("Failed to delete");
        return;
      }
      toast.success("Report deleted");
      navigate("/admin/logs");
    } catch (e) {
      console.error(e);
      toast.error("Failed to delete");
    }
  }, [report, token, navigate]);

  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      <div className="no-print sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-5xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-2">
          <Button variant="ghost" size="sm" onClick={() => navigate("/admin/logs")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to logs
          </Button>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} disabled={!report}>
              <Printer className="w-4 h-4 mr-2" /> Print / Save PDF
            </Button>
            <Button size="sm" onClick={handleDownloadHtml} disabled={!report}>
              <Download className="w-4 h-4 mr-2" /> Download
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setConfirmDelete(true)}
              disabled={!report}
            >
              <Trash2 className="w-4 h-4 mr-2" /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 print:p-0">
        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : report ? (
          <ReportDocument report={report} />
        ) : (
          <p className="text-center text-muted-foreground">Report not found.</p>
        )}
      </div>

      <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this report?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the report
              {report ? (
                <> for <strong>{report.student_name}</strong> on {report.class_date}.</>
              ) : "."}{" "}
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
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

OwnerReportView.displayName = "OwnerReportView";
export default OwnerReportView;

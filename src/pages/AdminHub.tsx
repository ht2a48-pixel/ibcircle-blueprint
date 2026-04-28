import { useEffect, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, PencilLine, LogOut, Home, Shield } from "lucide-react";

const AdminHub = memo(() => {
  const navigate = useNavigate();

  useEffect(() => {
    const raw = sessionStorage.getItem("adminToken");
    if (!raw) {
      navigate("/admin");
      return;
    }
    try {
      const { expiresAt } = JSON.parse(raw);
      if (!expiresAt || Date.now() > expiresAt) {
        sessionStorage.removeItem("adminToken");
        navigate("/admin");
      }
    } catch {
      sessionStorage.removeItem("adminToken");
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminToken");
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground text-sm mt-1">Choose an action below</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => navigate("/")}>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/admin/write")}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <PencilLine className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Write Class Report</CardTitle>
              <CardDescription>
                Submit a report for a completed class. Includes class date, time, length, subject, topics covered, and your write-up.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Open form</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/admin/reports")}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Customize Sample Report</CardTitle>
              <CardDescription>
                Edit and export the sample marketing report (PDF, JPG, HTML).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Open editor</Button>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => navigate("/admin/owner")}>
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Owner Access</CardTitle>
              <CardDescription>
                Restricted area. Requires the owner passcode to view all submitted teacher reports.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Enter passcode</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
});

AdminHub.displayName = "AdminHub";
export default AdminHub;

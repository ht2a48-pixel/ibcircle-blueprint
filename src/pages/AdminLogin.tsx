import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminLogin = () => {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Prefetch next-step admin route chunks in the background while the user
  // types their passcode, so navigation after submit is instant.
  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void) => number;
    };
    const schedule = w.requestIdleCallback ?? ((cb: () => void) => w.setTimeout(cb, 200));
    schedule(() => {
      void import("./AdminHub");
      void import("./TeacherReportForm");
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate passcode on the server
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "verify-passcode", passcode },
      });

      if (error) {
        console.error("Error calling verify-admin-passcode:", error);
        toast.error("서버 오류가 발생했습니다");
        setIsLoading(false);
        return;
      }

      if (data?.success && data?.token && data?.expiresAt) {
        // Store token with expiration for client-side validation
        const tokenData = JSON.stringify({
          token: data.token,
          expiresAt: data.expiresAt,
        });
        sessionStorage.setItem("adminToken", tokenData);
        toast.success("Access granted");
        navigate("/admin/hub");
      } else {
        toast.error("Invalid passcode");
      }
    } catch (err) {
      console.error("Error during authentication:", err);
      toast.error("인증 중 오류가 발생했습니다");
    }

    setIsLoading(false);
  }, [navigate, passcode]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>
            Enter the passcode to access the report customization panel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter passcode"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="text-center text-lg tracking-widest"
                maxLength={50}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading || !passcode}>
              {isLoading ? "Verifying..." : "Access Reports"}
            </Button>
          </form>
          <Button
            variant="ghost"
            className="w-full mt-4"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;

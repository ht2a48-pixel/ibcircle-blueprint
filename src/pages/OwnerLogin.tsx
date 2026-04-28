import { useState, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const OwnerLogin = memo(() => {
  const [passcode, setPasscode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin-passcode", {
        body: { action: "verify-owner-passcode", passcode },
      });

      if (error || !data?.success || !data?.token) {
        toast.error("Invalid passcode");
        setIsLoading(false);
        return;
      }

      sessionStorage.setItem("ownerToken", JSON.stringify({ token: data.token, expiresAt: data.expiresAt }));
      toast.success("Owner access granted");
      navigate("/admin/logs");
    } catch (err) {
      console.error(err);
      toast.error("Authentication error");
    }
    setIsLoading(false);
  }, [navigate, passcode]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Owner Access</CardTitle>
          <CardDescription>Enter the owner passcode to view all submitted teacher reports</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="Enter owner passcode"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="text-center text-lg tracking-widest"
              maxLength={50}
            />
            <Button type="submit" className="w-full" disabled={isLoading || !passcode}>
              {isLoading ? "Verifying..." : "View Reports Log"}
            </Button>
          </form>
          <Button variant="ghost" className="w-full mt-4" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
          </Button>
        </CardContent>
      </Card>
    </div>
  );
});

OwnerLogin.displayName = "OwnerLogin";
export default OwnerLogin;

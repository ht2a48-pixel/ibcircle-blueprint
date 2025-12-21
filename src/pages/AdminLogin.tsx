import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ADMIN_PASSCODE = "040707";

const AdminLogin = () => {
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === ADMIN_PASSCODE) {
      sessionStorage.setItem("admin_authenticated", "true");
      navigate("/admin/reports");
    } else {
      setError(true);
      toast({
        title: "잘못된 비밀번호",
        description: "비밀번호를 다시 확인해주세요.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">관리자 로그인</h1>
            <p className="text-muted-foreground mt-2">비밀번호를 입력하세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="password"
              placeholder="비밀번호"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError(false);
              }}
              className={error ? "border-destructive" : ""}
              autoFocus
            />
            <Button type="submit" className="w-full">
              로그인
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, Mail, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email({ message: "올바른 이메일을 입력하세요" }),
  password: z.string().min(6, { message: "비밀번호는 최소 6자 이상이어야 합니다" }),
});

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAdmin, isLoading, signIn, signUp } = useAdminAuth();

  // Redirect if already authenticated as admin
  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate("/admin/reports");
    }
  }, [user, isAdmin, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate input
    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        if (err.path[0] === "email") fieldErrors.email = err.message;
        if (err.path[0] === "password") fieldErrors.password = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const { error } = await signUp(email, password);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "이미 등록된 계정",
              description: "이 이메일로 이미 계정이 있습니다. 로그인해주세요.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "회원가입 실패",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "회원가입 완료",
            description: "계정이 생성되었습니다. 관리자 권한 부여를 요청해주세요.",
          });
          setIsSignUp(false);
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "로그인 실패",
            description: "이메일 또는 비밀번호를 확인해주세요.",
            variant: "destructive",
          });
        }
        // Navigation will happen automatically via useEffect when isAdmin becomes true
      }
    } catch (error) {
      toast({
        title: "오류 발생",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Show message if logged in but not admin
  if (user && !isAdmin && !isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">접근 권한 없음</h1>
            <p className="text-muted-foreground mb-6">
              이 페이지에 접근할 권한이 없습니다. 관리자에게 문의하세요.
            </p>
            <Button
              variant="outline"
              onClick={async () => {
                const { signOut } = await import("@/hooks/useAdminAuth").then(m => ({ signOut: m.useAdminAuth }));
                await supabase.auth.signOut();
                navigate("/");
              }}
            >
              홈으로 돌아가기
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              {isSignUp ? "관리자 회원가입" : "관리자 로그인"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isSignUp ? "새 계정을 만드세요" : "이메일과 비밀번호를 입력하세요"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="email"
                  placeholder="이메일"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors(prev => ({ ...prev, email: undefined }));
                  }}
                  className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="password"
                  placeholder="비밀번호"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors(prev => ({ ...prev, password: undefined }));
                  }}
                  className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
              </div>
              {errors.password && (
                <p className="text-sm text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : null}
              {isSignUp ? "회원가입" : "로그인"}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrors({});
              }}
              className="text-sm text-primary hover:underline"
            >
              {isSignUp ? "이미 계정이 있으신가요? 로그인" : "계정이 없으신가요? 회원가입"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Import supabase for signOut in the non-admin case
import { supabase } from "@/integrations/supabase/client";

export default AdminLogin;

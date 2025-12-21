import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Download, Plus, Trash2 } from "lucide-react";

interface Subject {
  name: string;
  teacher: string;
  level: string;
  grade: string;
  trend: string;
  comment: string;
}

interface ReportData {
  studentName: string;
  grade: string;
  date: string;
  overallSummary: string;
  subjects: Subject[];
  goals: string[];
  parentNotes: string;
}

const AdminReports = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData>({
    studentName: "",
    grade: "",
    date: new Date().toISOString().split("T")[0],
    overallSummary: "",
    subjects: [
      { name: "", teacher: "", level: "", grade: "", trend: "↑", comment: "" },
    ],
    goals: [""],
    parentNotes: "",
  });

  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("admin_authenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("admin_authenticated");
    navigate("/admin");
  };

  const addSubject = () => {
    setReportData((prev) => ({
      ...prev,
      subjects: [
        ...prev.subjects,
        { name: "", teacher: "", level: "", grade: "", trend: "↑", comment: "" },
      ],
    }));
  };

  const removeSubject = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      subjects: prev.subjects.filter((_, i) => i !== index),
    }));
  };

  const updateSubject = (index: number, field: keyof Subject, value: string) => {
    setReportData((prev) => ({
      ...prev,
      subjects: prev.subjects.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addGoal = () => {
    setReportData((prev) => ({
      ...prev,
      goals: [...prev.goals, ""],
    }));
  };

  const removeGoal = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      goals: prev.goals.filter((_, i) => i !== index),
    }));
  };

  const updateGoal = (index: number, value: string) => {
    setReportData((prev) => ({
      ...prev,
      goals: prev.goals.map((g, i) => (i === index ? value : g)),
    }));
  };

  const generatePDF = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IBCircle Progress Report - ${reportData.studentName}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; padding: 20px; }
    .report { max-width: 800px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); color: white; padding: 32px; text-align: center; }
    .header h1 { font-size: 28px; margin-bottom: 8px; }
    .header p { opacity: 0.8; }
    .student-info { display: flex; justify-content: space-between; padding: 24px 32px; background: #f8f9fa; border-bottom: 1px solid #e9ecef; }
    .student-info div { text-align: center; }
    .student-info label { font-size: 12px; color: #6c757d; display: block; margin-bottom: 4px; }
    .student-info span { font-size: 18px; font-weight: 600; color: #1a1a2e; }
    .section { padding: 24px 32px; }
    .section-title { font-size: 18px; font-weight: 600; color: #1a1a2e; margin-bottom: 16px; padding-bottom: 8px; border-bottom: 2px solid #667eea; }
    .summary { background: #f8f9fa; padding: 16px; border-radius: 8px; line-height: 1.6; }
    .subject-card { background: #f8f9fa; border-radius: 12px; padding: 20px; margin-bottom: 16px; }
    .subject-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .subject-name { font-size: 18px; font-weight: 600; color: #1a1a2e; }
    .subject-meta { display: flex; gap: 16px; font-size: 14px; color: #6c757d; }
    .grade-badge { display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 8px 16px; border-radius: 20px; font-weight: 600; }
    .subject-comment { margin-top: 12px; padding-top: 12px; border-top: 1px solid #e9ecef; line-height: 1.6; }
    .goals-list { list-style: none; }
    .goals-list li { padding: 12px 16px; background: #f8f9fa; border-radius: 8px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
    .goals-list li::before { content: "🎯"; }
    .parent-notes { background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%); padding: 20px; border-radius: 12px; border-left: 4px solid #667eea; }
    .footer { text-align: center; padding: 24px; background: #f8f9fa; color: #6c757d; font-size: 14px; }
    @media print { body { padding: 0; background: white; } .report { box-shadow: none; } }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <h1>📊 IBCircle Progress Report</h1>
      <p>학생 성장 리포트</p>
    </div>
    
    <div class="student-info">
      <div><label>학생 이름</label><span>${reportData.studentName || "-"}</span></div>
      <div><label>학년</label><span>${reportData.grade || "-"}</span></div>
      <div><label>작성일</label><span>${reportData.date || "-"}</span></div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📝 전체 요약</h2>
      <div class="summary">${reportData.overallSummary || "요약 내용이 없습니다."}</div>
    </div>
    
    <div class="section">
      <h2 class="section-title">📚 과목별 성적</h2>
      ${reportData.subjects
        .filter((s) => s.name)
        .map(
          (subject) => `
        <div class="subject-card">
          <div class="subject-header">
            <div>
              <div class="subject-name">${subject.name}</div>
              <div class="subject-meta">
                <span>👨‍🏫 ${subject.teacher || "-"}</span>
                <span>📊 ${subject.level || "-"}</span>
              </div>
            </div>
            <div class="grade-badge">
              <span>${subject.grade || "-"}</span>
              <span>${subject.trend}</span>
            </div>
          </div>
          ${subject.comment ? `<div class="subject-comment">${subject.comment}</div>` : ""}
        </div>
      `
        )
        .join("")}
    </div>
    
    ${
      reportData.goals.filter((g) => g).length > 0
        ? `
    <div class="section">
      <h2 class="section-title">🎯 다음 분기 목표</h2>
      <ul class="goals-list">
        ${reportData.goals
          .filter((g) => g)
          .map((goal) => `<li>${goal}</li>`)
          .join("")}
      </ul>
    </div>
    `
        : ""
    }
    
    ${
      reportData.parentNotes
        ? `
    <div class="section">
      <h2 class="section-title">💬 학부모님께</h2>
      <div class="parent-notes">${reportData.parentNotes}</div>
    </div>
    `
        : ""
    }
    
    <div class="footer">
      <p>IBCircle Education | Excellence in IB Education</p>
    </div>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">리포트 생성기</h1>
          <div className="flex gap-2">
            <Button onClick={generatePDF} className="gap-2">
              <Download className="w-4 h-4" />
              PDF 생성
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Student Info */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">학생 정보</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">학생 이름</label>
              <Input
                value={reportData.studentName}
                onChange={(e) => setReportData((p) => ({ ...p, studentName: e.target.value }))}
                placeholder="홍길동"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">학년</label>
              <Input
                value={reportData.grade}
                onChange={(e) => setReportData((p) => ({ ...p, grade: e.target.value }))}
                placeholder="11학년"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">작성일</label>
              <Input
                type="date"
                value={reportData.date}
                onChange={(e) => setReportData((p) => ({ ...p, date: e.target.value }))}
              />
            </div>
          </div>
        </section>

        {/* Overall Summary */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">전체 요약</h2>
          <Textarea
            value={reportData.overallSummary}
            onChange={(e) => setReportData((p) => ({ ...p, overallSummary: e.target.value }))}
            placeholder="학생의 전반적인 학업 성취도와 발전 상황을 요약해주세요..."
            rows={4}
          />
        </section>

        {/* Subjects */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">과목별 성적</h2>
            <Button variant="outline" size="sm" onClick={addSubject} className="gap-1">
              <Plus className="w-4 h-4" />
              과목 추가
            </Button>
          </div>
          <div className="space-y-4">
            {reportData.subjects.map((subject, index) => (
              <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 flex-1">
                    <Input
                      value={subject.name}
                      onChange={(e) => updateSubject(index, "name", e.target.value)}
                      placeholder="과목명"
                    />
                    <Input
                      value={subject.teacher}
                      onChange={(e) => updateSubject(index, "teacher", e.target.value)}
                      placeholder="담당 선생님"
                    />
                    <Input
                      value={subject.level}
                      onChange={(e) => updateSubject(index, "level", e.target.value)}
                      placeholder="레벨 (HL/SL)"
                    />
                    <div className="flex gap-2">
                      <Input
                        value={subject.grade}
                        onChange={(e) => updateSubject(index, "grade", e.target.value)}
                        placeholder="점수"
                        className="flex-1"
                      />
                      <select
                        value={subject.trend}
                        onChange={(e) => updateSubject(index, "trend", e.target.value)}
                        className="px-3 rounded-md border border-input bg-background"
                      >
                        <option value="↑">↑</option>
                        <option value="→">→</option>
                        <option value="↓">↓</option>
                      </select>
                    </div>
                  </div>
                  {reportData.subjects.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSubject(index)}
                      className="ml-2 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <Textarea
                  value={subject.comment}
                  onChange={(e) => updateSubject(index, "comment", e.target.value)}
                  placeholder="과목별 코멘트..."
                  rows={2}
                />
              </div>
            ))}
          </div>
        </section>

        {/* Goals */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">다음 분기 목표</h2>
            <Button variant="outline" size="sm" onClick={addGoal} className="gap-1">
              <Plus className="w-4 h-4" />
              목표 추가
            </Button>
          </div>
          <div className="space-y-2">
            {reportData.goals.map((goal, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={goal}
                  onChange={(e) => updateGoal(index, e.target.value)}
                  placeholder={`목표 ${index + 1}`}
                />
                {reportData.goals.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeGoal(index)}
                    className="text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Parent Notes */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">학부모님께</h2>
          <Textarea
            value={reportData.parentNotes}
            onChange={(e) => setReportData((p) => ({ ...p, parentNotes: e.target.value }))}
            placeholder="학부모님께 전달할 메시지를 작성해주세요..."
            rows={4}
          />
        </section>
      </main>
    </div>
  );
};

export default AdminReports;

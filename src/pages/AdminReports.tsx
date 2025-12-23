import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LogOut, Download, Plus, Trash2, Printer } from "lucide-react";

interface SkillScore {
  label: string;
  score: string;
}

interface RiskFlag {
  text: string;
  level: "high" | "medium";
}

interface Recommendation {
  text: string;
}

interface Priority {
  label: string;
  text: string;
}

interface ReportData {
  subjectTitle: string;
  sessionNumber: string;
  summary: string;
  challengeContent: string;
  evaluationText: string;
  skillScores: SkillScore[];
  riskFlags: RiskFlag[];
  recommendations: Recommendation[];
  priorities: Priority[];
}

const AdminReports = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<ReportData>({
    subjectTitle: "IB Economics HL 수업 리포트",
    sessionNumber: "24",
    summary: "",
    challengeContent: "",
    evaluationText: "",
    skillScores: [
      { label: "개념 이해", score: "92" },
      { label: "그래프 분석", score: "88" },
      { label: "에세이 구조", score: "85" },
      { label: "비판적 사고", score: "90" },
    ],
    riskFlags: [
      { text: "", level: "high" },
    ],
    recommendations: [
      { text: "" },
    ],
    priorities: [
      { label: "Priority 1", text: "" },
      { label: "Priority 2", text: "" },
      { label: "Priority 3", text: "" },
    ],
  });

  // Check if user is authenticated via passcode
  useEffect(() => {
    const isAuthenticated = sessionStorage.getItem("adminAuthenticated");
    if (!isAuthenticated) {
      navigate("/admin");
    }
  }, [navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuthenticated");
    navigate("/admin");
  };

  const updateSkillScore = (index: number, field: keyof SkillScore, value: string) => {
    setReportData((prev) => ({
      ...prev,
      skillScores: prev.skillScores.map((s, i) =>
        i === index ? { ...s, [field]: value } : s
      ),
    }));
  };

  const addRiskFlag = () => {
    setReportData((prev) => ({
      ...prev,
      riskFlags: [...prev.riskFlags, { text: "", level: "medium" }],
    }));
  };

  const removeRiskFlag = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      riskFlags: prev.riskFlags.filter((_, i) => i !== index),
    }));
  };

  const updateRiskFlag = (index: number, field: keyof RiskFlag, value: string) => {
    setReportData((prev) => ({
      ...prev,
      riskFlags: prev.riskFlags.map((r, i) =>
        i === index ? { ...r, [field]: value } : r
      ),
    }));
  };

  const addRecommendation = () => {
    setReportData((prev) => ({
      ...prev,
      recommendations: [...prev.recommendations, { text: "" }],
    }));
  };

  const removeRecommendation = (index: number) => {
    setReportData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.filter((_, i) => i !== index),
    }));
  };

  const updateRecommendation = (index: number, value: string) => {
    setReportData((prev) => ({
      ...prev,
      recommendations: prev.recommendations.map((r, i) =>
        i === index ? { text: value } : r
      ),
    }));
  };

  const updatePriority = (index: number, value: string) => {
    setReportData((prev) => ({
      ...prev,
      priorities: prev.priorities.map((p, i) =>
        i === index ? { ...p, text: value } : p
      ),
    }));
  };

  // HTML escape function to prevent XSS
  const escapeHtml = (text: string): string => {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  };

  const generateReportHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IBCircle Progress Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; padding: 20px; color: #1a1a1a; line-height: 1.6; }
    .report { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e5e5e5; }
    
    /* Header - matches SampleReport primary style */
    .header { background: #1a1a2e; color: white; padding: 24px 32px; }
    .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .header-left { }
    .header-subtitle { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; margin-bottom: 4px; }
    .header-title { font-size: 20px; font-weight: 500; }
    .session-badge { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; }
    
    /* Content */
    .content { padding: 32px 40px; }
    
    /* Section styling */
    .section { margin-bottom: 32px; }
    .section-title { font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .section-title svg { width: 16px; height: 16px; }
    
    /* Summary */
    .summary-text { font-size: 14px; line-height: 1.8; color: #1a1a1a; }
    .summary-text p { margin-bottom: 16px; }
    .summary-text p:last-child { margin-bottom: 0; }
    
    /* Challenge box */
    .challenge-box { background: #f8f9fa; padding: 24px; border-radius: 8px; border: 1px solid #e5e5e5; }
    .challenge-box .section-title { margin-bottom: 12px; }
    .challenge-text { font-size: 14px; line-height: 1.8; }
    
    /* Evaluation */
    .evaluation-text { font-size: 14px; line-height: 1.8; margin-bottom: 24px; }
    .skill-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .skill-item { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
    .skill-score { font-size: 24px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
    .skill-label { font-size: 11px; color: #6b7280; }
    
    /* Risk flags box */
    .risk-box { background: #fef2f2; padding: 24px; border-radius: 8px; border: 1px solid #fecaca; }
    .risk-box .section-title { color: #dc2626; }
    .risk-list { list-style: none; }
    .risk-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; }
    .risk-item:last-child { margin-bottom: 0; }
    .risk-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
    .risk-dot.high { background: #dc2626; }
    .risk-dot.medium { background: #f59e0b; }
    
    /* Recommendations box */
    .rec-box { background: #eff6ff; padding: 24px; border-radius: 8px; border: 1px solid #bfdbfe; }
    .rec-box .section-title { color: #2563eb; }
    .rec-list { list-style: none; }
    .rec-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; }
    .rec-item:last-child { margin-bottom: 0; }
    .rec-dot { width: 6px; height: 6px; border-radius: 50%; background: #2563eb; margin-top: 8px; flex-shrink: 0; }
    
    /* Priorities box */
    .priorities-box { background: #fef3c7; padding: 24px; border-radius: 8px; border: 1px solid #fde68a; }
    .priorities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .priority-item { padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e5e5; }
    .priority-label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
    .priority-text { font-size: 13px; font-weight: 500; color: #1a1a1a; }
    
    /* Footer */
    .footer { padding: 16px 32px; background: #f8f9fa; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
    
    @media print { 
      body { padding: 0; background: white; } 
      .report { box-shadow: none; border: none; }
    }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <div class="header-content">
        <div class="header-left">
          <div class="header-subtitle">IBCircle Progress Report</div>
          <div class="header-title">${escapeHtml(reportData.subjectTitle)}</div>
        </div>
        <div class="session-badge">
          <span>📄</span>
          <span>Session #${escapeHtml(reportData.sessionNumber)}</span>
        </div>
      </div>
    </div>
    
    <div class="content">
      <!-- Summary Section -->
      <div class="section">
        <div class="section-title">
          <span>📈</span> 수업 요약
        </div>
        <div class="summary-text">
          ${reportData.summary.split('\n').map(p => `<p>${escapeHtml(p)}</p>`).join('')}
        </div>
      </div>
      
      <!-- Challenge Section -->
      ${reportData.challengeContent ? `
      <div class="section">
        <div class="challenge-box">
          <div class="section-title">
            <span>🎯</span> 심화 학습
          </div>
          <div class="challenge-text">${escapeHtml(reportData.challengeContent)}</div>
        </div>
      </div>
      ` : ''}
      
      <!-- Evaluation Section -->
      <div class="section">
        <div class="section-title">
          <span>✓</span> 학습 평가
        </div>
        <div class="evaluation-text">${escapeHtml(reportData.evaluationText)}</div>
        <div class="skill-grid">
          ${reportData.skillScores.map(skill => `
            <div class="skill-item">
              <div class="skill-score">${escapeHtml(skill.score)}</div>
              <div class="skill-label">${escapeHtml(skill.label)}</div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <!-- Risk Flags -->
      ${reportData.riskFlags.filter(r => r.text).length > 0 ? `
      <div class="section">
        <div class="risk-box">
          <div class="section-title">
            <span>⚠️</span> Academic Risk Flags
          </div>
          <ul class="risk-list">
            ${reportData.riskFlags.filter(r => r.text).map(risk => `
              <li class="risk-item">
                <span class="risk-dot ${escapeHtml(risk.level)}"></span>
                <span>${escapeHtml(risk.text)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Recommendations -->
      ${reportData.recommendations.filter(r => r.text).length > 0 ? `
      <div class="section">
        <div class="rec-box">
          <div class="section-title">
            <span>💡</span> Strategic Recommendations
          </div>
          <ul class="rec-list">
            ${reportData.recommendations.filter(r => r.text).map(rec => `
              <li class="rec-item">
                <span class="rec-dot"></span>
                <span>${escapeHtml(rec.text)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      </div>
      ` : ''}
      
      <!-- Priorities -->
      ${reportData.priorities.filter(p => p.text).length > 0 ? `
      <div class="section">
        <div class="priorities-box">
          <div class="section-title">
            <span>→</span> Next Step Priorities
          </div>
          <div class="priorities-grid">
            ${reportData.priorities.filter(p => p.text).map(priority => `
              <div class="priority-item">
                <div class="priority-label">${escapeHtml(priority.label)}</div>
                <div class="priority-text">${escapeHtml(priority.text)}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      ` : ''}
    </div>
    
    <div class="footer">
      <span>IBCircle · Premium IB Education</span>
      <span>Confidential Student Report</span>
    </div>
  </div>
</body>
</html>`;
  };

  const downloadReport = () => {
    const html = generateReportHTML();
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `IBCircle_Report_Session${reportData.sessionNumber}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const printReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    const html = generateReportHTML() + `<script>window.onload = () => window.print();</script>`;
    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-foreground">리포트 생성기</h1>
          <div className="flex gap-2">
            <Button onClick={downloadReport} className="gap-2">
              <Download className="w-4 h-4" />
              다운로드
            </Button>
            <Button onClick={printReport} variant="secondary" className="gap-2">
              <Printer className="w-4 h-4" />
              인쇄
            </Button>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="w-4 h-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Report Header Info */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">리포트 헤더</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">과목 제목</label>
              <Input
                value={reportData.subjectTitle}
                onChange={(e) => setReportData((p) => ({ ...p, subjectTitle: e.target.value }))}
                placeholder="IB Economics HL 수업 리포트"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">세션 번호</label>
              <Input
                value={reportData.sessionNumber}
                onChange={(e) => setReportData((p) => ({ ...p, sessionNumber: e.target.value }))}
                placeholder="24"
              />
            </div>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">수업 요약</h2>
          <Textarea
            value={reportData.summary}
            onChange={(e) => setReportData((p) => ({ ...p, summary: e.target.value }))}
            placeholder="오늘 수업에서 다룬 내용을 상세히 작성해주세요. 여러 문단으로 나누어 작성할 수 있습니다."
            rows={6}
          />
        </section>

        {/* Challenge Content */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">심화 학습</h2>
          <Textarea
            value={reportData.challengeContent}
            onChange={(e) => setReportData((p) => ({ ...p, challengeContent: e.target.value }))}
            placeholder="심화 학습 내용을 작성해주세요 (선택사항)"
            rows={3}
          />
        </section>

        {/* Evaluation */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">학습 평가</h2>
          <Textarea
            value={reportData.evaluationText}
            onChange={(e) => setReportData((p) => ({ ...p, evaluationText: e.target.value }))}
            placeholder="학생의 학습 태도와 성취도에 대한 평가를 작성해주세요."
            rows={3}
            className="mb-4"
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {reportData.skillScores.map((skill, index) => (
              <div key={index} className="space-y-2">
                <Input
                  value={skill.label}
                  onChange={(e) => updateSkillScore(index, "label", e.target.value)}
                  placeholder="스킬명"
                />
                <Input
                  value={skill.score}
                  onChange={(e) => updateSkillScore(index, "score", e.target.value)}
                  placeholder="점수"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Risk Flags */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Academic Risk Flags</h2>
            <Button onClick={addRiskFlag} variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> 추가
            </Button>
          </div>
          <div className="space-y-3">
            {reportData.riskFlags.map((risk, index) => (
              <div key={index} className="flex gap-2 items-center">
                <select
                  value={risk.level}
                  onChange={(e) => updateRiskFlag(index, "level", e.target.value)}
                  className="border border-border rounded-md px-2 py-2 text-sm bg-background"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                </select>
                <Input
                  value={risk.text}
                  onChange={(e) => updateRiskFlag(index, "text", e.target.value)}
                  placeholder="리스크 내용을 입력하세요"
                  className="flex-1"
                />
                <Button
                  onClick={() => removeRiskFlag(index)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Recommendations */}
        <section className="bg-card border border-border rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Strategic Recommendations</h2>
            <Button onClick={addRecommendation} variant="outline" size="sm" className="gap-1">
              <Plus className="w-4 h-4" /> 추가
            </Button>
          </div>
          <div className="space-y-3">
            {reportData.recommendations.map((rec, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  value={rec.text}
                  onChange={(e) => updateRecommendation(index, e.target.value)}
                  placeholder="추천 내용을 입력하세요"
                  className="flex-1"
                />
                <Button
                  onClick={() => removeRecommendation(index)}
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </section>

        {/* Priorities */}
        <section className="bg-card border border-border rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4">Next Step Priorities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {reportData.priorities.map((priority, index) => (
              <div key={index}>
                <label className="text-sm text-muted-foreground mb-1 block">{priority.label}</label>
                <Input
                  value={priority.text}
                  onChange={(e) => updatePriority(index, e.target.value)}
                  placeholder="우선순위 내용"
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminReports;

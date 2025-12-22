import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, CheckCircle, AlertTriangle, Lightbulb, ArrowRight, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

const SampleReport = () => {
  const downloadReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>IBCircle Progress Report - Sample</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5; padding: 20px; color: #1a1a1a; line-height: 1.6; }
    .report { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); border: 1px solid #e5e5e5; }
    .header { background: #1a1a2e; color: white; padding: 24px 32px; }
    .header-content { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    .header-subtitle { font-size: 11px; font-weight: 500; letter-spacing: 0.15em; text-transform: uppercase; opacity: 0.7; margin-bottom: 4px; }
    .header-title { font-size: 20px; font-weight: 500; }
    .session-badge { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 4px; font-size: 14px; font-weight: 500; }
    .content { padding: 32px 40px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 12px; font-weight: 500; letter-spacing: 0.1em; text-transform: uppercase; color: #6b7280; margin-bottom: 16px; display: flex; align-items: center; gap: 8px; }
    .summary-text { font-size: 14px; line-height: 1.8; color: #1a1a1a; }
    .summary-text p { margin-bottom: 16px; }
    .summary-text p:last-child { margin-bottom: 0; }
    .challenge-box { background: #f8f9fa; padding: 24px; border-radius: 8px; border: 1px solid #e5e5e5; }
    .challenge-box .section-title { margin-bottom: 12px; }
    .challenge-text { font-size: 14px; line-height: 1.8; }
    .evaluation-text { font-size: 14px; line-height: 1.8; margin-bottom: 24px; }
    .skill-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
    .skill-item { text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
    .skill-score { font-size: 24px; font-weight: 500; color: #1a1a1a; margin-bottom: 4px; }
    .skill-label { font-size: 11px; color: #6b7280; }
    .risk-box { background: #fef2f2; padding: 24px; border-radius: 8px; border: 1px solid #fecaca; }
    .risk-box .section-title { color: #dc2626; }
    .risk-list { list-style: none; }
    .risk-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; }
    .risk-item:last-child { margin-bottom: 0; }
    .risk-dot { width: 6px; height: 6px; border-radius: 50%; margin-top: 8px; flex-shrink: 0; }
    .risk-dot.high { background: #dc2626; }
    .risk-dot.medium { background: #f59e0b; }
    .rec-box { background: #eff6ff; padding: 24px; border-radius: 8px; border: 1px solid #bfdbfe; }
    .rec-box .section-title { color: #2563eb; }
    .rec-list { list-style: none; }
    .rec-item { display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 14px; }
    .rec-item:last-child { margin-bottom: 0; }
    .rec-dot { width: 6px; height: 6px; border-radius: 50%; background: #2563eb; margin-top: 8px; flex-shrink: 0; }
    .priorities-box { background: #fef3c7; padding: 24px; border-radius: 8px; border: 1px solid #fde68a; }
    .priorities-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
    .priority-item { padding: 16px; background: white; border-radius: 8px; border: 1px solid #e5e5e5; }
    .priority-label { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
    .priority-text { font-size: 13px; font-weight: 500; color: #1a1a1a; }
    .footer { padding: 16px 32px; background: #f8f9fa; border-top: 1px solid #e5e5e5; display: flex; justify-content: space-between; font-size: 11px; color: #6b7280; }
    @media print { body { padding: 0; background: white; } .report { box-shadow: none; border: none; } }
  </style>
</head>
<body>
  <div class="report">
    <div class="header">
      <div class="header-content">
        <div>
          <div class="header-subtitle">IBCircle Progress Report</div>
          <div class="header-title">IB Economics HL 수업 리포트</div>
        </div>
        <div class="session-badge">
          <span>📄</span>
          <span>Session #24</span>
        </div>
      </div>
    </div>
    <div class="content">
      <div class="section">
        <div class="section-title"><span>📈</span> 수업 요약</div>
        <div class="summary-text">
          <p>오늘 수업에서는 그동안 진행해온 거시경제학(Macroeconomics) 전 범위를 마무리하며, 공급측면 정책(Supply-side policies)까지의 핵심 개념을 체계적으로 정리했습니다. 단순 개념 암기가 아닌, 그래프 해석과 인과 관계 분석을 중심으로 IB 평가 기준에 맞춘 학습을 진행했습니다.</p>
          <p>특히 학생들이 가장 어려워하는 개념 중 하나인 <strong>디플레이션(deflation)</strong>을 심층적으로 다루었습니다. 디플레이션이 발생하는 구조를 수요·공급 모형을 통해 단계적으로 분석하고, 실질 부채 부담 증가, 소비 및 투자 위축 등 경제 전반에 미치는 영향을 논리적으로 정리했습니다.</p>
          <p>이후 IB Economics Paper 1, Part A 유형의 서술형 문제를 활용하여, 핵심 개념을 평가 기준에 맞게 구조화하여 답안을 작성하는 연습을 진행했습니다.</p>
        </div>
      </div>
      <div class="section">
        <div class="challenge-box">
          <div class="section-title"><span>🎯</span> 심화 학습</div>
          <div class="challenge-text">또한 난이도가 높은 Paper 1, Part B 수준의 '인플레이션과 실업 비교·분석' 문제에 도전했습니다. 단기와 장기의 차이, 상충 관계(trade-off), 정책적 시사점까지 포함하는 고급 분석이 요구되는 문항이었으며, 전반적으로 논리성과 균형 잡힌 서술이 잘 이루어졌습니다.</div>
        </div>
      </div>
      <div class="section">
        <div class="section-title"><span>✓</span> 학습 평가</div>
        <div class="evaluation-text">학생은 경제 개념을 단순히 외우는 수준을 넘어, "왜 그런 결과가 나타나는지"를 이해하려는 태도가 매우 우수합니다. 특히 거시 파트 후반부의 복잡한 그래프 분석과 에세이 구조를 빠르게 습득한 점이 인상적이었습니다.</div>
        <div class="skill-grid">
          <div class="skill-item"><div class="skill-score">92</div><div class="skill-label">개념 이해</div></div>
          <div class="skill-item"><div class="skill-score">88</div><div class="skill-label">그래프 분석</div></div>
          <div class="skill-item"><div class="skill-score">85</div><div class="skill-label">에세이 구조</div></div>
          <div class="skill-item"><div class="skill-score">90</div><div class="skill-label">비판적 사고</div></div>
        </div>
      </div>
      <div class="section">
        <div class="risk-box">
          <div class="section-title"><span>⚠️</span> Academic Risk Flags</div>
          <ul class="risk-list">
            <li class="risk-item"><span class="risk-dot high"></span><span>Paper 2 Data Response 문항에서 계산 실수가 간헐적으로 발생 — 시간 배분 및 검토 루틴 개선 필요</span></li>
            <li class="risk-item"><span class="risk-dot medium"></span><span>국제 경제(International Economics) 파트 그래프 해석력 보완 권장</span></li>
          </ul>
        </div>
      </div>
      <div class="section">
        <div class="rec-box">
          <div class="section-title"><span>💡</span> Strategic Recommendations</div>
          <ul class="rec-list">
            <li class="rec-item"><span class="rec-dot"></span><span>Paper 1 Part B 에세이 연습 시, 서론에서 정의와 논점을 명확히 제시하는 연습 강화</span></li>
            <li class="rec-item"><span class="rec-dot"></span><span>IA(Internal Assessment) 주제 선정을 위해 실제 경제 뉴스 기사 스크랩 시작 권장</span></li>
            <li class="rec-item"><span class="rec-dot"></span><span>시험 직전 2주간 과거 기출문제 집중 풀이 예정 — 오답 정리 노트 병행</span></li>
          </ul>
        </div>
      </div>
      <div class="section">
        <div class="priorities-box">
          <div class="section-title"><span>→</span> Next Step Priorities</div>
          <div class="priorities-grid">
            <div class="priority-item"><div class="priority-label">Priority 1</div><div class="priority-text">Paper 1 & 2 문제 풀이 심화 훈련</div></div>
            <div class="priority-item"><div class="priority-label">Priority 2</div><div class="priority-text">IA 주제 브레인스토밍 및 1차 선정</div></div>
            <div class="priority-item"><div class="priority-label">Priority 3</div><div class="priority-text">국제 경제 그래프 집중 복습</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>IBCircle · Premium IB Education</span>
      <span>Confidential Student Report</span>
    </div>
  </div>
  <script>window.onload = () => window.print();</script>
</body>
</html>`;

    printWindow.document.write(html);
    printWindow.document.close();
  };

  return (
    <section className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4 md:px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 md:mb-12"
        >
          <p className="section-title text-xs md:text-sm">Progress Report System Preview</p>
          <h2 className="section-heading text-xl md:text-3xl">학습 리포트 미리보기</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm md:text-base">
            매 수업 후 학부모님께 전달되는 상세 리포트 예시입니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          {/* Report Card Container with scrollable area */}
          <div className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Report Header - Fixed */}
            <div className="bg-primary text-primary-foreground px-4 md:px-6 py-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="text-[10px] md:text-xs font-medium tracking-[0.12em] uppercase opacity-70 mb-0.5">
                    IBCircle Progress Report
                  </div>
                  <h3 className="text-base md:text-lg font-medium">IB Economics HL 수업 리포트</h3>
                </div>
                <div className="flex items-center gap-1.5 bg-primary-foreground/10 px-3 py-1.5 rounded text-xs md:text-sm">
                  <FileText className="w-3 h-3 md:w-4 md:h-4" />
                  <span className="font-medium">Session #24</span>
                </div>
              </div>
            </div>

            {/* Scrollable Report Content */}
            <div className="h-[400px] md:h-[450px] overflow-y-auto scrollbar-thin">
              <div className="p-4 md:p-6 space-y-6">
                {/* Summary Section */}
                <div>
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="w-3.5 h-3.5" />
                    수업 요약
                  </h4>
                  <div className="text-sm text-foreground leading-relaxed space-y-3">
                    <p>
                      오늘 수업에서는 그동안 진행해온 거시경제학(Macroeconomics) 전 범위를 마무리하며, 
                      공급측면 정책(Supply-side policies)까지의 핵심 개념을 체계적으로 정리했습니다.
                    </p>
                    <p>
                      특히 학생들이 가장 어려워하는 개념 중 하나인 <strong>디플레이션(deflation)</strong>을 
                      심층적으로 다루었습니다.
                    </p>
                  </div>
                </div>

                {/* Challenge Section */}
                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-2 flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" />
                    심화 학습
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed">
                    난이도가 높은 Paper 1, Part B 수준의 '인플레이션과 실업 비교·분석' 문제에 도전했습니다.
                  </p>
                </div>

                {/* Evaluation Section */}
                <div>
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    학습 평가
                  </h4>
                  <p className="text-sm text-foreground leading-relaxed mb-4">
                    학생은 경제 개념을 단순히 외우는 수준을 넘어, "왜 그런 결과가 나타나는지"를 이해하려는 태도가 매우 우수합니다.
                  </p>
                  
                  {/* Skill indicators - 2x2 grid for mobile */}
                  <div className="grid grid-cols-2 gap-2 md:gap-3">
                    {[
                      { label: '개념 이해', score: 92 },
                      { label: '그래프 분석', score: 88 },
                      { label: '에세이 구조', score: 85 },
                      { label: '비판적 사고', score: 90 },
                    ].map((skill) => (
                      <div key={skill.label} className="text-center p-3 bg-secondary/30 rounded-lg">
                        <div className="text-lg md:text-xl font-medium text-foreground mb-0.5">{skill.score}</div>
                        <div className="text-[10px] md:text-xs text-muted-foreground">{skill.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Academic Risk Flags */}
                <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-destructive mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    Academic Risk Flags
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-1.5 flex-shrink-0" />
                      <span>Paper 2 Data Response 문항에서 계산 실수 발생</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-warm mt-1.5 flex-shrink-0" />
                      <span>국제 경제 파트 그래프 해석력 보완 권장</span>
                    </li>
                  </ul>
                </div>

                {/* Strategic Recommendations */}
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-primary mb-3 flex items-center gap-2">
                    <Lightbulb className="w-3.5 h-3.5" />
                    Strategic Recommendations
                  </h4>
                  <ul className="space-y-2 text-sm text-foreground">
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>Paper 1 Part B 에세이 서론 연습 강화</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>IA 주제 선정을 위한 뉴스 스크랩 시작</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
                      <span>과거 기출문제 집중 풀이 예정</span>
                    </li>
                  </ul>
                </div>

                {/* Next Steps Section */}
                <div className="p-4 bg-accent/30 rounded-lg border border-accent/50">
                  <h4 className="text-xs font-medium tracking-[0.1em] uppercase text-foreground mb-3 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5" />
                    Next Step Priorities
                  </h4>
                  <div className="space-y-2">
                    {[
                      { num: 1, text: 'Paper 1 & 2 문제 풀이 심화 훈련' },
                      { num: 2, text: 'IA 주제 브레인스토밍 및 1차 선정' },
                      { num: 3, text: '국제 경제 그래프 집중 복습' },
                    ].map((priority) => (
                      <div key={priority.num} className="p-3 bg-background rounded-lg border border-border">
                        <div className="text-[10px] text-muted-foreground mb-0.5">Priority {priority.num}</div>
                        <p className="text-xs md:text-sm font-medium text-foreground">{priority.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Scroll indicator */}
            <div className="px-4 py-2 bg-secondary/50 border-t border-border text-center">
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">↓ 스크롤하여 전체 리포트 보기</span>
            </div>

            {/* Report Footer */}
            <div className="px-4 md:px-6 py-3 bg-secondary/30 border-t border-border">
              <div className="flex items-center justify-between text-[10px] md:text-xs text-muted-foreground">
                <span>IBCircle · Premium IB Education</span>
                <span>Confidential Student Report</span>
              </div>
            </div>

            {/* Download Button */}
            <div className="px-4 md:px-6 py-4 bg-background border-t border-border">
              <Button onClick={downloadReport} size="sm" className="w-full gap-2 text-sm">
                <Download className="w-3.5 h-3.5" />
                샘플 리포트 다운로드
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleReport;
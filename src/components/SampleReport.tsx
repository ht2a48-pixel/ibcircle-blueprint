import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, CheckCircle, AlertTriangle, Lightbulb, ArrowRight, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SampleReport = () => {
  const reportRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    if (!reportRef.current) return;
    
    setIsGenerating(true);
    toast({
      title: "PDF 생성 중...",
      description: "잠시만 기다려주세요.",
    });

    try {
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      const element = reportRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 0;

      // Handle multi-page if content is too long
      const pageHeight = pdfHeight;
      const contentHeight = (imgHeight * ratio);
      let heightLeft = contentHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - contentHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', imgX, position, imgWidth * ratio, imgHeight * ratio);
        heightLeft -= pageHeight;
      }

      pdf.save('IBCircle_Progress_Report.pdf');

      toast({
        title: "PDF 다운로드 완료",
        description: "IBCircle Progress Report가 저장되었습니다.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF 생성 실패",
        description: "다시 시도해주세요.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-title">Progress Report System Preview</p>
          <h2 className="section-heading">학습 리포트 미리보기</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            매 수업 후 학부모님께 전달되는 상세 리포트 예시입니다
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Download Button */}
          <div className="flex justify-end mb-4">
            <button
              onClick={handleDownloadPDF}
              disabled={isGenerating}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  생성 중...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  PDF 다운로드
                </>
              )}
            </button>
          </div>

          {/* Report Card */}
          <div ref={reportRef} className="bg-background border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Report Header */}
            <div className="bg-primary text-primary-foreground px-8 py-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="text-xs font-medium tracking-[0.15em] uppercase opacity-70 mb-1">
                    IBCircle Progress Report
                  </div>
                  <h3 className="text-xl font-medium">IB Economics HL 수업 리포트</h3>
                </div>
                <div className="flex items-center gap-2 bg-primary-foreground/10 px-4 py-2 rounded">
                  <FileText className="w-4 h-4" />
                  <span className="text-sm font-medium">Session #24</span>
                </div>
              </div>
            </div>

            {/* Report Content */}
            <div className="p-8 md:p-10">
              {/* Summary Section */}
              <div className="mb-10">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  수업 요약
                </h4>
                <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
                  <p className="mb-4">
                    오늘 수업에서는 그동안 진행해온 거시경제학(Macroeconomics) 전 범위를 마무리하며, 
                    공급측면 정책(Supply-side policies)까지의 핵심 개념을 체계적으로 정리했습니다. 
                    단순 개념 암기가 아닌, 그래프 해석과 인과 관계 분석을 중심으로 IB 평가 기준에 맞춘 학습을 진행했습니다.
                  </p>
                  <p className="mb-4">
                    특히 학생들이 가장 어려워하는 개념 중 하나인 <strong>디플레이션(deflation)</strong>을 
                    심층적으로 다루었습니다. 디플레이션이 발생하는 구조를 수요·공급 모형을 통해 단계적으로 분석하고, 
                    실질 부채 부담 증가, 소비 및 투자 위축 등 경제 전반에 미치는 영향을 논리적으로 정리했습니다.
                  </p>
                  <p>
                    이후 IB Economics Paper 1, Part A 유형의 서술형 문제를 활용하여, 
                    핵심 개념을 평가 기준에 맞게 구조화하여 답안을 작성하는 연습을 진행했습니다.
                  </p>
                </div>
              </div>

              {/* Challenge Section */}
              <div className="mb-10 p-6 bg-secondary/50 rounded-lg border border-border">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <Target className="w-4 h-4" />
                  심화 학습
                </h4>
                <p className="text-foreground leading-relaxed">
                  또한 난이도가 높은 Paper 1, Part B 수준의 '인플레이션과 실업 비교·분석' 문제에 도전했습니다. 
                  단기와 장기의 차이, 상충 관계(trade-off), 정책적 시사점까지 포함하는 고급 분석이 요구되는 문항이었으며, 
                  전반적으로 논리성과 균형 잡힌 서술이 잘 이루어졌습니다.
                </p>
              </div>

              {/* Evaluation Section */}
              <div className="mb-10">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-muted-foreground mb-4 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  학습 평가
                </h4>
                <p className="text-foreground leading-relaxed mb-6">
                  학생은 경제 개념을 단순히 외우는 수준을 넘어, "왜 그런 결과가 나타나는지"를 이해하려는 태도가 매우 우수합니다. 
                  특히 거시 파트 후반부의 복잡한 그래프 분석과 에세이 구조를 빠르게 습득한 점이 인상적이었습니다.
                </p>
                
                {/* Skill indicators */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: '개념 이해', score: 92 },
                    { label: '그래프 분석', score: 88 },
                    { label: '에세이 구조', score: 85 },
                    { label: '비판적 사고', score: 90 },
                  ].map((skill) => (
                    <div key={skill.label} className="text-center p-4 bg-secondary/30 rounded-lg">
                      <div className="text-2xl font-medium text-foreground mb-1">{skill.score}</div>
                      <div className="text-xs text-muted-foreground">{skill.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Academic Risk Flags */}
              <div className="mb-10 p-6 bg-destructive/5 rounded-lg border border-destructive/20">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-destructive mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Academic Risk Flags
                </h4>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-destructive mt-2 flex-shrink-0" />
                    <span>Paper 2 Data Response 문항에서 계산 실수가 간헐적으로 발생 — 시간 배분 및 검토 루틴 개선 필요</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-warm mt-2 flex-shrink-0" />
                    <span>국제 경제(International Economics) 파트 그래프 해석력 보완 권장</span>
                  </li>
                </ul>
              </div>

              {/* Strategic Recommendations */}
              <div className="mb-10 p-6 bg-primary/5 rounded-lg border border-primary/20">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-primary mb-4 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Strategic Recommendations
                </h4>
                <ul className="space-y-3 text-foreground">
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>Paper 1 Part B 에세이 연습 시, 서론에서 정의와 논점을 명확히 제시하는 연습 강화</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>IA(Internal Assessment) 주제 선정을 위해 실제 경제 뉴스 기사 스크랩 시작 권장</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span>시험 직전 2주간 과거 기출문제 집중 풀이 예정 — 오답 정리 노트 병행</span>
                  </li>
                </ul>
              </div>

              {/* Next Steps Section */}
              <div className="p-6 bg-accent/30 rounded-lg border border-accent/50">
                <h4 className="text-sm font-medium tracking-[0.1em] uppercase text-foreground mb-4 flex items-center gap-2">
                  <ArrowRight className="w-4 h-4" />
                  Next Step Priorities
                </h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Priority 1</div>
                    <p className="text-sm font-medium text-foreground">Paper 1 & 2 문제 풀이 심화 훈련</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Priority 2</div>
                    <p className="text-sm font-medium text-foreground">IA 주제 브레인스토밍 및 1차 선정</p>
                  </div>
                  <div className="p-4 bg-background rounded-lg border border-border">
                    <div className="text-xs text-muted-foreground mb-1">Priority 3</div>
                    <p className="text-sm font-medium text-foreground">국제 경제 그래프 집중 복습</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Footer */}
            <div className="px-8 py-4 bg-secondary/30 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>IBCircle · Premium IB Education</span>
                <span>Confidential Student Report</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleReport;
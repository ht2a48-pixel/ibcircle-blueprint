import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Download, Printer } from 'lucide-react';
import ReportDocument, { ReportDocumentData } from '@/components/ReportDocument';
import { downloadReportHtml } from '@/lib/reportExport';
import { toast } from 'sonner';

const SAMPLE_REPORT: ReportDocumentData = {
  id: 'sample-0000-0000-0000-000000000001',
  teacher_name: 'Daniel Park',
  student_name: 'Student A',
  subject: 'IB Economics HL',
  class_date: '2026-04-22',
  class_time: '17:00',
  class_length_minutes: 90,
  classes_completed: 24,
  topics_covered:
    '거시경제학 마무리 — 공급측면 정책(Supply-side policies), 디플레이션의 구조와 영향, ' +
    '인플레이션과 실업의 상충 관계(Phillips Curve). Paper 1 Part A 서술 연습 및 Part B ' +
    '비교·분석 문제 도전.',
  report_text:
    '오늘 수업에서는 그동안 진행해온 거시경제학(Macroeconomics) 전 범위를 마무리하며, ' +
    '공급측면 정책(Supply-side policies)까지의 핵심 개념을 체계적으로 정리했습니다. 단순 개념 ' +
    '암기가 아닌, 그래프 해석과 인과 관계 분석을 중심으로 IB 평가 기준에 맞춘 학습을 진행했습니다.\n\n' +
    '특히 학생들이 가장 어려워하는 개념 중 하나인 디플레이션(deflation)을 심층적으로 다루었습니다. ' +
    '디플레이션이 발생하는 구조를 수요·공급 모형을 통해 단계적으로 분석하고, 실질 부채 부담 증가, ' +
    '소비 및 투자 위축 등 경제 전반에 미치는 영향을 논리적으로 정리했습니다.\n\n' +
    '이후 IB Economics Paper 1, Part A 유형의 서술형 문제를 활용하여, 핵심 개념을 평가 기준에 맞게 ' +
    '구조화하여 답안을 작성하는 연습을 진행했습니다. 학생은 정의 → 이론 → 실제 사례 → 평가 순서로 ' +
    '논리를 전개하는 흐름을 안정적으로 구사하기 시작했습니다.\n\n' +
    '심화 과제로는 Paper 1, Part B 수준의 "인플레이션과 실업 비교·분석" 문제에 도전했습니다. ' +
    '단기와 장기의 차이, 상충 관계(trade-off), 정책적 시사점까지 포함하는 고급 분석이 요구되는 문항이었으며, ' +
    '전반적으로 논리성과 균형 잡힌 서술이 잘 이루어졌습니다.\n\n' +
    '다음 수업에서는 Paper 2 Data Response 문항에서 간헐적으로 발생하는 계산 실수를 줄이기 위해 ' +
    '시간 배분과 검토 루틴을 점검하고, 국제 경제(International Economics) 파트의 그래프 해석 ' +
    '연습을 보강할 예정입니다. IA(Internal Assessment) 주제 선정을 위해 실제 경제 뉴스 기사 ' +
    '스크랩도 함께 시작하기로 했습니다.',
  created_at: '2026-04-22T18:35:00.000Z',
};

const SampleReport = () => {
  const handleDownload = async () => {
    try {
      await downloadReportHtml(SAMPLE_REPORT);
      toast.success('샘플 리포트를 다운로드했습니다. 파일을 열고 인쇄 → PDF로 저장하세요.');
    } catch (e) {
      console.error(e);
      toast.error('다운로드에 실패했습니다.');
    }
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
            매 수업 후 학부모님께 전달되는 실제 리포트 양식 예시입니다.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          {/* Scaled preview of the real report document */}
          <div className="rounded-lg border border-border bg-muted/30 p-3 md:p-6 shadow-sm overflow-hidden">
            <div className="max-h-[520px] md:max-h-[640px] overflow-y-auto overscroll-contain rounded-md bg-white">
              <div className="origin-top mx-auto" style={{ transform: 'scale(0.78)', transformOrigin: 'top center', width: '128%', marginLeft: '-14%' }}>
                <ReportDocument report={SAMPLE_REPORT} />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <Button onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              샘플 다운로드
            </Button>
            <Button variant="outline" onClick={handleDownload}>
              <Printer className="w-4 h-4 mr-2" />
              인쇄용 PDF
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default SampleReport;

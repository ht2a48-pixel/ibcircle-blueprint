import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

const faqItems: FAQItem[] = [
  {
    question: "IBCircle의 수업은 어떻게 진행되나요?",
    answer: "IBCircle의 수업은 1:1 또는 1:2 소수 정예로 진행됩니다. 12시간 단위로 계약하며, 체험 수업 후 학생의 목표와 일정에 맞춰 유연하게 조율됩니다. 1:2 수업의 경우 반드시 지인 간 구성으로만 진행됩니다."
  },
  {
    question: "어떤 과목을 가르치나요?",
    answer: "IB Diploma Programme의 모든 주요 과목을 지원합니다. Group 1-6 과목은 물론, Extended Essay (EE), Theory of Knowledge (TOK), 그리고 각 과목별 Internal Assessment (IA)까지 전략적으로 지도합니다."
  },
  {
    question: "강사진은 어떤 분들인가요?",
    answer: "모든 강사진은 전 세계 유수 명문대에 재학 중이거나 졸업한 최상위권 출신입니다. 3년 이상의 IB 강의 경험을 보유하고 있으며, 직접 IB Diploma를 이수한 경험을 바탕으로 실질적인 전략을 제공합니다."
  },
  {
    question: "온라인 수업도 가능한가요?",
    answer: "네, 가능합니다. IBCircle은 전 세계 11개국에서 온 학생들을 지도하고 있으며, 온라인과 오프라인 수업 모두 동일한 품질로 제공됩니다."
  },
  {
    question: "입시 컨설팅은 어떻게 진행되나요?",
    answer: "입시 컨설팅은 학생의 목표 대학과 전형에 맞춰 맞춤형으로 진행됩니다. 글로벌 명문대 지원(미국, 영국, 아시아), 에세이 전략, 활동 설계, 인터뷰 준비부터 국내 특별전형(3특/12특) 지원 자격 분석 및 전체 일정 관리까지 포함됩니다."
  },
  {
    question: "학부모에게는 어떤 피드백이 제공되나요?",
    answer: "매 수업 후 상세한 리포트가 제공됩니다. 학습 성과 분석, 전략적 개선 방안, 다음 단계 로드맵을 포함한 체계적인 보고서를 통해 학생의 진행 상황을 투명하게 공유합니다."
  },
  {
    question: "IB 점수 목표는 어떻게 설정하나요?",
    answer: "학생의 현재 수준과 목표 대학에 맞춰 현실적이면서도 도전적인 점수 목표를 함께 설정합니다. IBCircle 졸업생의 평균 IB 점수는 38.2점으로, 체계적인 전략을 통해 높은 성과를 달성하고 있습니다."
  },
  {
    question: "무료 상담은 어떻게 신청하나요?",
    answer: "카카오톡(ID: academythe) 또는 이메일(ht2a4.8@gmail.com)로 연락 주시면 됩니다. 평일 09:00-22:00, 주말 10:00-18:00에 상담이 가능합니다. 상담을 통해 학생의 현재 상황과 목표를 파악한 후 맞춤형 학습 계획을 제안해 드립니다."
  },
];

const FAQ = () => {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-title">Frequently Asked Questions</p>
          <h2 className="section-heading">자주 묻는 질문</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="max-w-3xl mx-auto"
        >
          <Accordion type="single" collapsible className="space-y-3">
            {faqItems.map((item, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-secondary/30 border border-border px-6 data-[state=open]:bg-secondary/50 transition-colors"
              >
                <AccordionTrigger className="text-left text-foreground font-medium py-5 hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

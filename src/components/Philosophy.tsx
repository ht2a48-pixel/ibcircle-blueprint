import { motion } from 'framer-motion';
import { BarChart3, Lightbulb, Map } from 'lucide-react';

const Philosophy = () => {
  const reportCards = [
    {
      icon: BarChart3,
      title: '학습 성과 분석',
      description: '데이터 기반 학업 성취도 추적',
    },
    {
      icon: Lightbulb,
      title: '전략적 개선 방안',
      description: '맞춤형 학습 전략 제안',
    },
    {
      icon: Map,
      title: '다음 단계 로드맵',
      description: '명확한 목표와 실행 계획',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-title">OUR PHILOSOPHY</p>
            <h2 className="section-heading mb-6">투명한 소통</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              IBCircle은 교육자, 학부모, 학생 간의 투명하고 구조화된 
              커뮤니케이션을 핵심 가치로 삼습니다.
            </p>

            <p className="text-muted-foreground italic border-l-2 border-primary pl-4">
              모든 수업은 기록되고, 모든 성장은 추적됩니다.
            </p>
          </motion.div>

          {/* Right content - Report cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            {reportCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                className="bg-background border border-border p-6 flex items-start gap-5"
              >
                <div className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0">
                  <card.icon size={24} className="text-foreground" />
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{card.title}</h4>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default Philosophy;

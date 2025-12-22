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
    <section className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full border border-primary/30"
      />
      
      <div className="container mx-auto px-6 lg:px-12 relative">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="section-title"
            >
              OUR PHILOSOPHY
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="section-heading mb-6"
            >
              투명한 소통
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              IBCircle은 교육자, 학부모, 학생 간의 투명하고 구조화된 
              커뮤니케이션을 핵심 가치로 삼습니다.
            </motion.p>

            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-muted-foreground italic border-l-2 border-primary pl-4"
            >
              모든 수업은 기록되고, 모든 성장은 추적됩니다.
            </motion.p>
          </motion.div>

          {/* Right content - Report cards */}
          <div className="space-y-4">
            {reportCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                whileInView={{ opacity: 1, x: 0, scale: 1 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                whileHover={{ x: 10, transition: { duration: 0.2 } }}
                className="bg-background border border-border p-6 flex items-start gap-5 cursor-default"
              >
                <motion.div 
                  initial={{ scale: 0.5, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                  className="w-12 h-12 bg-secondary flex items-center justify-center flex-shrink-0"
                >
                  <card.icon size={24} className="text-foreground" />
                </motion.div>
                <div>
                  <h4 className="font-medium text-foreground mb-1">{card.title}</h4>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

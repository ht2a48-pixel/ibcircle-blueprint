import { motion } from 'framer-motion';
import { Users, Calendar, UserCheck } from 'lucide-react';

const Programs = () => {
  const features = [
    {
      icon: Users,
      title: '운영 방식',
      description: '1:1 또는 1:2 소수 정예, 12시간 단위 계약',
    },
    {
      icon: Calendar,
      title: '수업 일정',
      description: '체험 수업 후 목표 기반 유연 조율',
    },
    {
      icon: UserCheck,
      title: '1:2 수업',
      description: '반드시 지인 간 구성',
    },
  ];

  return (
    <section id="programs" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="section-title">Personalized IB Coaching</p>
            <h2 className="section-heading mb-4">
              1:1 및 1:2 맞춤 수업
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              IBCircle의 수업은 학생 개개인의 학습 스타일과 일정에 맞춰 설계된
              개인 맞춤형 IB 전문 프로그램입니다.
            </p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="flex items-start gap-4"
                >
                  <div className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                    <feature.icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 text-muted-foreground italic border-l-2 border-primary pl-4"
            >
              단순한 강의가 아닌, 전략적으로 설계된 학업 파트너십입니다.
            </motion.p>
          </motion.div>

          {/* Right content - IB Programme info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-background border border-border p-8 md:p-10"
          >
            <p className="section-title">IB Diploma Programme</p>
            <h3 className="text-xl font-medium text-foreground mb-6">
              IB 커리큘럼 개요
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              IB Diploma Programme은 6개 과목과 Extended Essay (EE), 
              Theory of Knowledge (TOK)로 구성됩니다.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              IBCircle은 과목별 전문 강사진을 통해 EE, TOK, IA까지 
              전략적으로 지도합니다.
            </p>

            {/* Subject groups */}
            <div className="grid grid-cols-2 gap-4">
              {[
                'Studies in Language',
                'Language Acquisition',
                'Individuals & Societies',
                'Sciences',
                'Mathematics',
                'The Arts',
              ].map((subject, index) => (
                <div
                  key={subject}
                  className="px-4 py-3 bg-secondary text-sm font-medium text-secondary-foreground"
                >
                  Group {index + 1}: {subject}
                </div>
              ))}
            </div>

            {/* Core elements */}
            <div className="mt-6 flex gap-4">
              {['Extended Essay', 'TOK', 'CAS'].map((core) => (
                <div
                  key={core}
                  className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium"
                >
                  {core}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Programs;

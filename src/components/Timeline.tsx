import { motion } from 'framer-motion';

interface TimelineItem {
  grade: string;
  period: string;
  title: string;
  description: string;
  type: 'academic' | 'test' | 'application';
}

const timelineData: TimelineItem[] = [
  {
    grade: 'Grade 10',
    period: '2학기',
    title: 'IB 과목 선택',
    description: '적성과 진학 목표에 맞는 과목 조합 결정',
    type: 'academic',
  },
  {
    grade: 'Grade 11',
    period: '시작',
    title: 'IB 시작',
    description: 'IB Diploma Programme 본격 시작',
    type: 'academic',
  },
  {
    grade: 'Grade 11',
    period: '겨울방학',
    title: 'TOEFL 마무리',
    description: '영어 공인 성적 확보',
    type: 'test',
  },
  {
    grade: 'Grade 11',
    period: '2학기',
    title: 'IA/EE/TOK 시작',
    description: '핵심 과제물 착수 및 전략 수립',
    type: 'academic',
  },
  {
    grade: 'Grade 12',
    period: '시작 전',
    title: 'SAT 마무리',
    description: '필요시 SAT 성적 확보',
    type: 'test',
  },
  {
    grade: 'Grade 12',
    period: '1학기',
    title: 'IA/EE/TOK 완료',
    description: '대부분의 과제물 마무리',
    type: 'academic',
  },
  {
    grade: 'Grade 12',
    period: '2학기',
    title: '최종 시험 준비',
    description: 'IB Final Exam 집중 대비',
    type: 'application',
  },
];

const Timeline = () => {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'bg-primary';
      case 'test':
        return 'bg-warm';
      case 'application':
        return 'bg-success';
      default:
        return 'bg-muted';
    }
  };

  return (
    <section id="insights" className="py-24 md:py-32 bg-background overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-title">Student Strategy Timeline</p>
          <h2 className="section-heading">IB 및 입시 전략 타임라인</h2>
        </motion.div>

        {/* Horizontal scrollable timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute top-16 left-0 right-0 h-px bg-border hidden md:block" />

          {/* Timeline items */}
          <div className="grid md:grid-cols-7 gap-6">
            {timelineData.map((item, index) => (
              <motion.div
                key={`${item.grade}-${item.period}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="relative"
              >
                {/* Dot on timeline */}
                <div className="hidden md:block absolute top-[60px] left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className={`w-4 h-4 rounded-full ${getTypeColor(item.type)} border-4 border-background`} />
                </div>

                {/* Card */}
                <div className="md:pt-24">
                  <div className="bg-secondary/50 border border-border p-5 h-full hover:bg-secondary transition-colors duration-300">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs font-medium text-muted-foreground">
                        {item.grade}
                      </span>
                      <span className="text-xs text-muted-foreground">•</span>
                      <span className="text-xs text-muted-foreground">
                        {item.period}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mb-2 text-sm">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex justify-center gap-8 mt-12"
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-sm text-muted-foreground">Academic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warm rounded-full" />
            <span className="text-sm text-muted-foreground">Test</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-success rounded-full" />
            <span className="text-sm text-muted-foreground">Exam</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Timeline;

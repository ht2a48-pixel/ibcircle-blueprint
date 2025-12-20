import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TimelineItem {
  grade: string;
  period: string;
  title: string;
  titleEn: string;
  description: string;
  type: 'academic' | 'test' | 'application';
  icon: string;
}

const timelineData: TimelineItem[] = [
  {
    grade: 'Grade 10',
    period: '2학기',
    title: 'IB 과목 선택',
    titleEn: 'Course Selection',
    description: '적성과 진학 목표에 맞는 과목 조합 결정. HL/SL 구성 전략 수립.',
    type: 'academic',
    icon: '📚',
  },
  {
    grade: 'Grade 11',
    period: '시작',
    title: 'IB 시작',
    titleEn: 'IB Begins',
    description: 'IB Diploma Programme 본격 시작. 기초 개념 학습 및 학습 루틴 형성.',
    type: 'academic',
    icon: '🎓',
  },
  {
    grade: 'Grade 11',
    period: '겨울방학',
    title: 'TOEFL 마무리',
    titleEn: 'TOEFL Complete',
    description: '영어 공인 성적 확보. 목표 점수 달성 후 IB에 집중.',
    type: 'test',
    icon: '📝',
  },
  {
    grade: 'Grade 11',
    period: '2학기',
    title: 'IA/EE/TOK 시작',
    titleEn: 'Core Components',
    description: '핵심 과제물 착수 및 전략 수립. 주제 선정 및 초안 작성 시작.',
    type: 'academic',
    icon: '✍️',
  },
  {
    grade: 'Grade 12',
    period: '시작 전',
    title: 'SAT 마무리',
    titleEn: 'SAT Complete',
    description: '필요시 SAT 성적 확보. 미국 대학 지원자 필수.',
    type: 'test',
    icon: '📊',
  },
  {
    grade: 'Grade 12',
    period: '1학기',
    title: 'IA/EE/TOK 완료',
    titleEn: 'Finalize Components',
    description: '대부분의 과제물 마무리. 최종 제출 전 검토 및 수정.',
    type: 'academic',
    icon: '✅',
  },
  {
    grade: 'Grade 12',
    period: '2학기',
    title: '최종 시험 준비',
    titleEn: 'Final Exam Prep',
    description: 'IB Final Exam 집중 대비. 전 과목 리뷰 및 모의시험.',
    type: 'application',
    icon: '🎯',
  },
];

const Timeline = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'academic':
        return 'border-primary bg-primary/5';
      case 'test':
        return 'border-warm bg-warm/5';
      case 'application':
        return 'border-success bg-success/5';
      default:
        return 'border-muted bg-muted/5';
    }
  };

  const getTypeDot = (type: string) => {
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
    <section id="insights" className="py-24 md:py-32 bg-secondary/20 overflow-hidden">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-title">Student Strategy Timeline</p>
          <h2 className="section-heading">IB 및 입시 전략 타임라인</h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Grade 10부터 12까지의 체계적인 로드맵. 좌우로 스크롤하여 전체 일정을 확인하세요.
          </p>
        </motion.div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={() => scroll('left')}
            className="p-3 bg-background border border-border rounded-full hover:bg-secondary transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-3 bg-background border border-border rounded-full hover:bg-secondary transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Scrollable timeline */}
        <div className="relative">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-secondary/20 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-secondary/20 to-transparent z-10 pointer-events-none" />

          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-8 scroll-smooth hide-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {timelineData.map((item, index) => (
              <motion.div
                key={`${item.grade}-${item.period}`}
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex-shrink-0 w-[320px] md:w-[380px]"
              >
                {/* Timeline connector */}
                <div className="flex items-center mb-6">
                  <div className={`w-4 h-4 rounded-full ${getTypeDot(item.type)} border-4 border-background shadow-md`} />
                  {index < timelineData.length - 1 && (
                    <div className="flex-1 h-0.5 bg-border ml-2" />
                  )}
                </div>

                {/* Card */}
                <div className={`h-full border-2 ${getTypeColor(item.type)} p-6 rounded-lg hover:shadow-lg transition-all duration-300 bg-background`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                          {item.grade}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {item.period}
                        </span>
                      </div>
                      <h4 className="text-lg font-medium text-foreground">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.titleEn}
                      </p>
                    </div>
                    <span className="text-3xl">{item.icon}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
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
          className="flex justify-center gap-8 mt-8"
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

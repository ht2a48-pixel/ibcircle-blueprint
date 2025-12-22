import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Calendar, UserCheck, ChevronDown, X } from 'lucide-react';

interface SubjectGroup {
  id: number;
  name: string;
  subjects: string[];
}

interface CoreElement {
  name: string;
  description: string;
}

const subjectGroups: SubjectGroup[] = [
  {
    id: 1,
    name: 'Studies in Language',
    subjects: ['Language A: Literature', 'Language A: Language and Literature', 'Literature and Performance'],
  },
  {
    id: 2,
    name: 'Language Acquisition',
    subjects: ['Language Ab initio', 'Language B', 'Classical Languages'],
  },
  {
    id: 3,
    name: 'Individuals & Societies',
    subjects: ['Business Management', 'Economics', 'Geography', 'History', 'Philosophy', 'Psychology', 'Digital Society', 'Global Politics', 'Social and Cultural Anthropology', 'World Religions'],
  },
  {
    id: 4,
    name: 'Sciences',
    subjects: ['Biology', 'Chemistry', 'Physics', 'Computer Science', 'Design Technology', 'Sports, Exercise and Health Science', 'Environmental Systems and Societies (ESS)'],
  },
  {
    id: 5,
    name: 'Mathematics',
    subjects: ['Mathematics: Analysis and Approaches', 'Mathematics: Applications and Interpretation'],
  },
  {
    id: 6,
    name: 'The Arts',
    subjects: ['Dance', 'Film', 'Music', 'Theatre', 'Visual Arts'],
  },
];

const coreElements: CoreElement[] = [
  {
    name: 'Extended Essay',
    description: 'Extended Essay(EE)는 학생이 직접 선택한 주제에 대해 독립적으로 연구하고 작성하는 4,000자 분량의 심층 논문입니다. 연구 기술, 학문적 글쓰기 능력, 비판적 사고력을 개발하며, 대학 수준의 학술 연구를 경험할 수 있는 기회를 제공합니다.',
  },
  {
    name: 'TOK',
    description: 'Theory of Knowledge(TOK)는 지식의 본질에 대해 탐구하는 과목입니다. "우리는 무엇을 알 수 있는가?", "우리는 어떻게 아는가?"와 같은 질문을 통해 다양한 지식 영역 간의 연결고리를 탐색하고, 비판적 사고와 메타인지 능력을 개발합니다.',
  },
  {
    name: 'CAS',
    description: 'Creativity, Activity, Service(CAS)는 학생들이 학업 외 활동에 참여하도록 장려하는 프로그램입니다. 창의성(예술, 창작 활동), 활동(신체 활동, 스포츠), 봉사(지역사회 기여)의 세 영역에서 균형 잡힌 경험을 통해 전인적 성장을 도모합니다.',
  },
];

const Programs = () => {
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null);
  const [expandedCore, setExpandedCore] = useState<string | null>(null);

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
    <section id="programs" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
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
              Personalized IB Coaching
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="section-heading mb-4"
            >
              1:1 및 1:2 맞춤 수업
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-lg text-muted-foreground leading-relaxed mb-8"
            >
              IBCircle의 수업은 학생 개개인의 학습 스타일과 일정에 맞춰 설계된
              개인 맞춤형 IB 전문 프로그램입니다.
            </motion.p>

            {/* Features */}
            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.15 }}
                  className="flex items-start gap-4 group"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 transition-transform"
                  >
                    <feature.icon size={20} />
                  </motion.div>
                  <div>
                    <h4 className="font-medium text-foreground mb-1">{feature.title}</h4>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.9 }}
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

            {/* Subject groups - Clickable */}
            <div className="grid grid-cols-1 gap-3 mb-6">
              {subjectGroups.map((group) => (
                <div key={group.id}>
                  <button
                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                    className={`w-full px-4 py-3 text-left text-sm font-medium transition-all duration-200 flex items-center justify-between ${
                      expandedGroup === group.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-secondary-foreground hover:bg-accent'
                    }`}
                  >
                    <span>Group {group.id}: {group.name}</span>
                    <ChevronDown 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        expandedGroup === group.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <AnimatePresence>
                    {expandedGroup === group.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 py-3 bg-secondary/50 border-x border-b border-border">
                          <div className="flex flex-wrap gap-2">
                            {group.subjects.map((subject) => (
                              <span
                                key={subject}
                                className="px-3 py-1.5 bg-background text-xs text-foreground rounded-full border border-border"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* Core elements - Clickable */}
            <div className="flex flex-wrap gap-3">
              {coreElements.map((core) => (
                <button
                  key={core.name}
                  onClick={() => setExpandedCore(expandedCore === core.name ? null : core.name)}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    expandedCore === core.name
                      ? 'bg-warm text-foreground'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {core.name}
                </button>
              ))}
            </div>

            {/* Core element description modal */}
            <AnimatePresence>
              {expandedCore && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="mt-4 p-5 bg-warm/10 border border-warm/30 rounded-lg relative"
                >
                  <button
                    onClick={() => setExpandedCore(null)}
                    className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <h4 className="font-medium text-foreground mb-2">{expandedCore}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed pr-6">
                    {coreElements.find(c => c.name === expandedCore)?.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Programs;

import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/30 to-background" />
      
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl md:text-4xl lg:text-5xl font-medium leading-tight text-foreground mb-8 text-balance"
          >
            전 세계 유수 명문대에 재학 혹은 졸업한
            <br className="hidden md:block" />
            최상위권 출신 강사진이 설립한
            <br className="hidden md:block" />
            <span className="text-navy-muted">프리미엄 IB 교육 및 입시 컨설팅 그룹</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-12 max-w-3xl mx-auto"
          >
            3년 이상의 강의 경험과 입시 전략 노하우를 바탕으로
            <br className="hidden md:block" />
            학생 개개인의 성공적인 대학 진학을 위한 맞춤형 솔루션을 제공합니다.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <a href="#contact" className="btn-primary">
              무료 상담 받기
            </a>
            <a href="#programs" className="btn-secondary">
              프로그램 알아보기
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <div className="w-px h-16 bg-gradient-to-b from-border to-transparent" />
      </motion.div>
    </section>
  );
};

export default Hero;

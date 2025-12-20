import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated geometric shapes background */}
      <div className="absolute inset-0">
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-secondary/40 via-background to-secondary/20" />
        
        {/* Large circle - top right */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full border border-border/30"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute -top-24 -right-24 w-[400px] h-[400px] rounded-full border border-border/20"
        />
        
        {/* Diagonal lines - left side */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.3, x: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="absolute top-1/4 left-0 w-64 h-px bg-gradient-to-r from-primary/20 to-transparent"
        />
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 0.2, x: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="absolute top-1/3 left-0 w-48 h-px bg-gradient-to-r from-primary/15 to-transparent"
        />
        
        {/* Floating square - left */}
        <motion.div
          initial={{ opacity: 0, rotate: 45 }}
          animate={{ opacity: 1, rotate: 45 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="absolute top-1/2 left-12 w-12 h-12 border border-border/30 hidden lg:block"
        />
        
        {/* Dotted pattern - bottom left */}
        <div className="absolute bottom-24 left-24 grid grid-cols-4 gap-3 opacity-20 hidden lg:grid">
          {[...Array(16)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.8 + i * 0.05 }}
              className="w-1.5 h-1.5 bg-primary rounded-full"
            />
          ))}
        </div>
        
        {/* Large arc - right side */}
        <motion.svg
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 hidden lg:block"
          viewBox="0 0 200 200"
        >
          <path
            d="M 200 0 A 200 200 0 0 0 200 200"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="0.5"
          />
        </motion.svg>
        
        {/* Floating circles - scattered */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute top-32 right-1/4 w-4 h-4 rounded-full border border-warm/50"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-1/3 right-32 w-6 h-6 rounded-full border border-primary/30"
        />
        
        {/* Gradient orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute -bottom-48 left-1/3 w-[600px] h-[600px] bg-gradient-radial from-primary to-transparent rounded-full blur-3xl"
        />
      </div>
      
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
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-16 bg-gradient-to-b from-primary/40 to-transparent"
        />
      </motion.div>
    </section>
  );
};

export default Hero;

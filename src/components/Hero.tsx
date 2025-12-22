import { motion } from 'framer-motion';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-secondary/10" />
      
      {/* Decorative vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute left-[10%] top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent origin-top hidden lg:block"
      />
      
      {/* Decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-primary/20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.05 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left side - Main content */}
          <div className="lg:col-span-7 lg:pl-16">
            {/* Eyebrow text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-8"
            >
              <span className="w-12 h-px bg-primary" />
              <span className="text-sm tracking-[0.2em] text-muted-foreground uppercase">Premium IB Education</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-3xl md:text-4xl lg:text-[2.75rem] font-medium leading-[1.3] text-foreground mb-6"
            >
              전 세계 유수 명문대에 재학 혹은 졸업한
              <br className="hidden md:block" />
              <span className="text-navy-muted">최상위권 출신 강사진</span>이 설립한
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-xl md:text-2xl font-light text-foreground/80 mb-10"
            >
              프리미엄 IB 교육 및 입시 컨설팅 그룹
            </motion.p>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="w-24 h-px bg-gradient-to-r from-primary to-transparent mb-10 origin-left"
            />

            {/* Subheadline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="text-base md:text-lg text-muted-foreground leading-relaxed max-w-xl mb-12"
            >
              3년 이상의 강의 경험과 입시 전략 노하우를 바탕으로
              <br className="hidden md:block" />
              학생 개개인의 성공적인 대학 진학을 위한 맞춤형 솔루션을 제공합니다.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="flex flex-col sm:flex-row items-start gap-4"
            >
              <a href="#contact" className="btn-primary">
                무료 상담 받기
              </a>
              <a href="#programs" className="btn-secondary">
                프로그램 알아보기
              </a>
            </motion.div>
          </div>

          {/* Right side - Decorative element */}
          <div className="lg:col-span-5 hidden lg:flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              {/* Abstract decorative shape */}
              <div className="relative w-80 h-80">
                {/* Outer ring */}
                <motion.div
                  initial={{ rotate: 0 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0 rounded-full border border-border/40"
                />
                
                {/* Middle ring with dots */}
                <div className="absolute inset-8 rounded-full border border-border/30">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
                  <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 rounded-full bg-primary/40" />
                </div>
                
                {/* Inner circle with gradient */}
                <div className="absolute inset-16 rounded-full bg-gradient-to-br from-secondary/50 to-transparent" />
                
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-5xl font-light text-primary/80">IB</span>
                  <span className="text-xs tracking-[0.3em] text-muted-foreground mt-2">CIRCLE</span>
                </div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ y: [-5, 5, -5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-4 -right-4 w-8 h-8 rounded-full border border-warm/30"
                />
                <motion.div
                  animate={{ y: [5, -5, 5] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full border border-primary/30"
                />
              </div>
            </motion.div>
          </div>
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

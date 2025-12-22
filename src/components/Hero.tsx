import { motion } from 'framer-motion';

const Hero = () => {
  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.8,
        ease: "easeOut" as const
      }
    })
  };

  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 md:pt-20 md:pb-0 overflow-hidden">
      {/* Animated gradient background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-gradient-to-br from-secondary/30 via-background to-secondary/10" 
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              y: [-20, -200],
              x: [0, (i % 2 === 0 ? 30 : -30)]
            }}
            transition={{ 
              duration: 8 + i * 2,
              repeat: Infinity,
              delay: i * 1.5,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 rounded-full bg-primary/40"
            style={{ 
              left: `${15 + i * 15}%`,
              bottom: '10%'
            }}
          />
        ))}
      </div>
      
      {/* Decorative vertical line */}
      <motion.div
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
        className="absolute left-[8%] top-1/4 bottom-1/4 w-px bg-gradient-to-b from-transparent via-border to-transparent origin-top hidden lg:block"
      />
      
      {/* Decorative circles */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 0.08, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full border border-primary/20"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.04 }}
        transition={{ duration: 2, delay: 0.8 }}
        className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full bg-primary/30 blur-3xl"
      />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
          {/* Left side - Main content */}
          <div className="lg:col-span-7 lg:pl-16">
            {/* Eyebrow text */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-3 mb-6 md:mb-8"
            >
              <motion.span 
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-8 md:w-12 h-px bg-primary origin-left" 
              />
              <span className="text-xs md:text-sm tracking-[0.15em] md:tracking-[0.2em] text-muted-foreground uppercase">Premium IB Education</span>
            </motion.div>

            {/* Main Headline - restructured for better word grouping */}
            <div className="mb-6 md:mb-8">
              <motion.p
                custom={1}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-xl md:text-2xl lg:text-[1.75rem] text-muted-foreground leading-relaxed mb-3"
              >
                전 세계 유수 명문대에
              </motion.p>
              <motion.h1
                custom={2}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-snug mb-2"
              >
                재학 혹은 졸업한 <span className="text-navy-muted">최상위권 출신 강사진</span>이
              </motion.h1>
              <motion.h1
                custom={3}
                initial="hidden"
                animate="visible"
                variants={textVariants}
                className="text-2xl md:text-3xl lg:text-4xl font-medium text-foreground leading-snug"
              >
                설립한 교육 그룹
              </motion.h1>
            </div>

            {/* Subtitle */}
            <motion.p
              custom={4}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-lg md:text-xl lg:text-2xl font-light text-primary/90 mb-8 md:mb-10"
            >
              프리미엄 IB 교육 및 입시 컨설팅
            </motion.p>

            {/* Decorative divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="w-16 md:w-24 h-px bg-gradient-to-r from-primary to-transparent mb-8 md:mb-10 origin-left"
            />

            {/* Subheadline */}
            <motion.p
              custom={5}
              initial="hidden"
              animate="visible"
              variants={textVariants}
              className="text-sm md:text-base lg:text-lg text-muted-foreground leading-relaxed max-w-xl mb-10 md:mb-12"
            >
              3년 이상의 강의 경험과 입시 전략 노하우를 바탕으로
              <br className="hidden sm:block" />
              학생 개개인의 성공적인 대학 진학을 위한
              <br className="hidden sm:block" />
              맞춤형 솔루션을 제공합니다.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="flex flex-col sm:flex-row items-start gap-3 md:gap-4"
            >
              <motion.a 
                href="#contact" 
                className="btn-primary w-full sm:w-auto text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                무료 상담 받기
              </motion.a>
              <motion.a 
                href="#programs" 
                className="btn-secondary w-full sm:w-auto text-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                프로그램 알아보기
              </motion.a>
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
              <div className="relative w-72 h-72 xl:w-80 xl:h-80">
                {/* Outer ring with pulse */}
                <motion.div
                  animate={{ 
                    rotate: 360,
                    scale: [1, 1.02, 1]
                  }}
                  transition={{ 
                    rotate: { duration: 60, repeat: Infinity, ease: "linear" },
                    scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
                  }}
                  className="absolute inset-0 rounded-full border border-border/40"
                />
                
                {/* Secondary rotating ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-4 rounded-full border border-dashed border-border/20"
                />
                
                {/* Middle ring with animated dots */}
                <div className="absolute inset-8 rounded-full border border-border/30">
                  {[0, 90, 180, 270].map((rotation, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
                      className="absolute w-2 h-2 rounded-full bg-primary/40"
                      style={{
                        top: rotation === 0 ? '-4px' : rotation === 180 ? 'auto' : '50%',
                        bottom: rotation === 180 ? '-4px' : 'auto',
                        left: rotation === 270 ? '-4px' : rotation === 90 ? 'auto' : '50%',
                        right: rotation === 90 ? '-4px' : 'auto',
                        transform: (rotation === 0 || rotation === 180) ? 'translateX(-50%)' : 'translateY(-50%)'
                      }}
                    />
                  ))}
                </div>
                
                {/* Inner circle with gradient */}
                <motion.div 
                  animate={{ opacity: [0.5, 0.7, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-16 rounded-full bg-gradient-to-br from-secondary/60 to-transparent" 
                />
                
                {/* Center text with subtle animation */}
                <motion.div 
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center"
                >
                  <span className="text-5xl xl:text-6xl font-light text-primary/80">IB</span>
                  <span className="text-xs tracking-[0.3em] text-muted-foreground mt-2">CIRCLE</span>
                </motion.div>
                
                {/* Floating elements */}
                <motion.div
                  animate={{ 
                    y: [-8, 8, -8],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
                    rotate: { duration: 8, repeat: Infinity, ease: "linear" }
                  }}
                  className="absolute -top-6 -right-6 w-10 h-10 rounded-full border border-warm/30"
                />
                <motion.div
                  animate={{ 
                    y: [8, -8, 8],
                    x: [-4, 4, -4]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-4 -left-4 w-6 h-6 rounded-full border border-primary/40"
                />
                <motion.div
                  animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute top-1/4 -right-8 w-3 h-3 rounded-full bg-primary/30"
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
        transition={{ duration: 1, delay: 1.4 }}
        className="absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="flex flex-col items-center gap-2"
        >
          <span className="text-[10px] tracking-widest text-muted-foreground uppercase">Scroll</span>
          <div className="w-px h-12 md:h-16 bg-gradient-to-b from-primary/40 to-transparent" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

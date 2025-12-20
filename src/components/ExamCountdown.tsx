import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimeLeft {
  days: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  remainingHours: number;
  remainingMinutes: number;
  remainingSeconds: number;
  weeks: number;
  percentElapsed: number;
}

// Animated number with rolling effect
const RollingNumber = ({ value, className }: { value: string; className?: string }) => {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {value.split('').map((digit, index) => (
        <AnimatePresence mode="popLayout" key={index}>
          <motion.span
            key={`${index}-${digit}`}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      ))}
    </span>
  );
};

const ExamCountdown = () => {
  // Get next IB exam date (April 24 each year)
  const getNextExamDate = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const examThisYear = new Date(`${currentYear}-04-24T09:00:00`);
    
    // If this year's exam has passed, target next year
    if (now > examThisYear) {
      return new Date(`${currentYear + 1}-04-24T09:00:00`);
    }
    return examThisYear;
  };
  
  const examDate = getNextExamDate();
  const examYear = examDate.getFullYear();

  const calculateTimeLeft = (targetDate: Date): TimeLeft => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();
    
    // Calculate preparation window (assuming 1 year prep)
    const prepWindowStart = new Date(targetDate);
    prepWindowStart.setFullYear(prepWindowStart.getFullYear() - 1);
    const totalPrepTime = targetDate.getTime() - prepWindowStart.getTime();
    const elapsedPrepTime = now.getTime() - prepWindowStart.getTime();
    const percentElapsed = Math.min(100, Math.max(0, (elapsedPrepTime / totalPrepTime) * 100));

    if (difference > 0) {
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const totalHours = Math.floor(difference / (1000 * 60 * 60));
      const totalMinutes = Math.floor(difference / (1000 * 60));
      const totalSeconds = Math.floor(difference / 1000);
      const remainingHours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const remainingMinutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const remainingSeconds = Math.floor((difference % (1000 * 60)) / 1000);
      const weeks = Math.floor(days / 7);

      return { days, totalHours, totalMinutes, totalSeconds, remainingHours, remainingMinutes, remainingSeconds, weeks, percentElapsed };
    }

    return { days: 0, totalHours: 0, totalMinutes: 0, totalSeconds: 0, remainingHours: 0, remainingMinutes: 0, remainingSeconds: 0, weeks: 0, percentElapsed: 100 };
  };

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft(examDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(examDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="section-title">IB Exam Countdown</p>
          <h2 className="section-heading">{examYear} IB 시험까지</h2>
        </motion.div>

        {/* Main countdown card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          <div className="bg-primary text-primary-foreground p-10 md:p-14 rounded-lg">
            <div className="text-xs font-medium tracking-[0.25em] uppercase mb-8 opacity-70 text-center">
              APRIL {examYear} IB EXAMINATION
            </div>
            
            {/* Main countdown display */}
            <div className="flex flex-col items-center justify-center gap-8 mb-10">
              {/* Days */}
              <div className="text-center">
                <div className="text-6xl md:text-8xl font-medium tracking-tight tabular-nums">
                  D–<RollingNumber value={String(timeLeft.days)} />
                </div>
                <div className="text-xs uppercase tracking-[0.2em] mt-2 opacity-60">Days Remaining</div>
              </div>
              
              {/* Time - Hours : Minutes : Seconds */}
              <div className="text-center">
                <div className="text-5xl md:text-7xl font-light tracking-tight tabular-nums flex items-center justify-center gap-2">
                  <div className="flex flex-col items-center">
                    <RollingNumber value={String(timeLeft.totalHours).padStart(4, '0')} />
                    <span className="text-xs uppercase tracking-[0.15em] mt-1 opacity-50">Hours</span>
                  </div>
                  <span className="opacity-40 text-4xl md:text-5xl">:</span>
                  <div className="flex flex-col items-center">
                    <RollingNumber value={formatTime(timeLeft.remainingMinutes)} />
                    <span className="text-xs uppercase tracking-[0.15em] mt-1 opacity-50">Min</span>
                  </div>
                  <span className="opacity-40 text-4xl md:text-5xl">:</span>
                  <div className="flex flex-col items-center">
                    <RollingNumber value={formatTime(timeLeft.remainingSeconds)} />
                    <span className="text-xs uppercase tracking-[0.15em] mt-1 opacity-50">Sec</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${timeLeft.percentElapsed}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="h-full bg-warm rounded-full"
                />
              </div>
              <div className="flex justify-between mt-2 text-xs opacity-60">
                <span>Preparation Started</span>
                <span>{timeLeft.percentElapsed.toFixed(1)}% Complete</span>
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/10">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-medium tabular-nums">
                  {timeLeft.days}
                </div>
                <div className="text-xs mt-1 opacity-60 uppercase tracking-wider">
                  Days
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-medium tabular-nums">
                  {timeLeft.weeks}
                </div>
                <div className="text-xs mt-1 opacity-60 uppercase tracking-wider">
                  Weeks
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-medium tabular-nums">
                  {timeLeft.percentElapsed.toFixed(0)}%
                </div>
                <div className="text-xs mt-1 opacity-60 uppercase tracking-wider">
                  Elapsed
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ExamCountdown;
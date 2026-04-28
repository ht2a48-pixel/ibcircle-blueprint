import { useState, useEffect, memo } from 'react';
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

// Memoized digit component to prevent unnecessary re-renders
const Digit = memo(({ value }: { value: string }) => (
  <AnimatePresence mode="popLayout">
    <motion.span
      key={value}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 20, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="inline-block"
    >
      {value}
    </motion.span>
  </AnimatePresence>
));
Digit.displayName = 'Digit';

// Optimized rolling number - only re-renders digits that change
const RollingNumber = memo(({ value, className }: { value: string; className?: string }) => {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {value.split('').map((digit, index) => (
        <Digit key={`${index}-${digit}`} value={digit} />
      ))}
    </span>
  );
});
RollingNumber.displayName = 'RollingNumber';

const EXAM_START_MONTH = 3; // April (0-indexed)
const EXAM_START_DAY = 24;
const EXAM_END_MONTH = 4; // May
const EXAM_END_DAY = 20;

const ExamCountdown = ({ compact = false, targetYear }: { compact?: boolean; targetYear?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get exam date for specific year or next upcoming exam
  const getExamDate = () => {
    if (targetYear) {
      return new Date(targetYear, EXAM_START_MONTH, EXAM_START_DAY, 9, 0, 0);
    }
    const now = new Date();
    const currentYear = now.getFullYear();
    const examThisYear = new Date(currentYear, EXAM_START_MONTH, EXAM_START_DAY, 9, 0, 0);

    // If this year's exam has passed, target next year
    if (now > examThisYear) {
      return new Date(currentYear + 1, EXAM_START_MONTH, EXAM_START_DAY, 9, 0, 0);
    }
    return examThisYear;
  };

  const examDate = getExamDate();
  const examYear = examDate.getFullYear();
  const examEndDate = new Date(examYear, EXAM_END_MONTH, EXAM_END_DAY, 23, 59, 59);

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
  const formatLargeNumber = (num: number) => num.toLocaleString();

  // Compact version for embedding in other sections
  if (compact) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 1 }}
        className="mt-8 bg-primary text-primary-foreground cursor-pointer overflow-hidden"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Main compact view */}
        <div className="p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-center sm:text-left">
              <p className="text-[10px] uppercase tracking-[0.2em] opacity-60 mb-1">
                {examYear} IB Exam Countdown
              </p>
              <div className="text-2xl md:text-3xl font-medium tabular-nums">
                D–<RollingNumber value={String(timeLeft.days)} />
              </div>
            </div>
            
            {/* Total time display - showing full hours:min:sec */}
            <div className="flex items-center gap-2 text-xl md:text-2xl font-light tabular-nums">
              <div className="flex flex-col items-center">
                <RollingNumber value={String(timeLeft.totalHours).padStart(4, '0')} />
                <span className="text-[9px] uppercase tracking-wider opacity-50">Hours</span>
              </div>
              <span className="opacity-40">:</span>
              <div className="flex flex-col items-center">
                <RollingNumber value={formatTime(timeLeft.remainingMinutes)} />
                <span className="text-[9px] uppercase tracking-wider opacity-50">Min</span>
              </div>
              <span className="opacity-40">:</span>
              <div className="flex flex-col items-center">
                <RollingNumber value={formatTime(timeLeft.remainingSeconds)} />
                <span className="text-[9px] uppercase tracking-wider opacity-50">Sec</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4 text-sm">
              <div className="text-center">
                <div className="font-medium">{timeLeft.weeks}</div>
                <div className="text-[9px] uppercase tracking-wider opacity-60">Weeks</div>
              </div>
              <div className="w-px h-8 bg-primary-foreground/20" />
              <div className="text-center">
                <div className="font-medium">{timeLeft.percentElapsed.toFixed(0)}%</div>
                <div className="text-[9px] uppercase tracking-wider opacity-60">Elapsed</div>
              </div>
              
              {/* Expand indicator */}
              <motion.div 
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="ml-2 opacity-50"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Expanded details */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
                {/* Divider */}
                <div className="h-px bg-primary-foreground/10 mb-4" />
                
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-primary-foreground/10 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${timeLeft.percentElapsed}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-warm rounded-full"
                    />
                  </div>
                  <div className="flex justify-between mt-2 text-[10px] opacity-60">
                    <span>Preparation Started</span>
                    <span>{timeLeft.percentElapsed.toFixed(1)}% Complete</span>
                  </div>
                </div>
                
                {/* Detailed metrics */}
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-lg md:text-xl font-medium tabular-nums">
                      {formatLargeNumber(timeLeft.totalHours)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60">Total Hours</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-medium tabular-nums">
                      {formatLargeNumber(timeLeft.totalMinutes)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60">Total Minutes</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-medium tabular-nums">
                      {formatLargeNumber(timeLeft.totalSeconds)}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60">Total Seconds</div>
                  </div>
                  <div>
                    <div className="text-lg md:text-xl font-medium tabular-nums">
                      {timeLeft.weeks}
                    </div>
                    <div className="text-[9px] uppercase tracking-wider opacity-60">Weeks Left</div>
                  </div>
                </div>
                
                {/* Exam date reminder */}
                <div className="mt-4 text-center text-[10px] uppercase tracking-[0.15em] opacity-50">
                  April 24, {examYear} · IB Diploma Examination
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // Full version (original)
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
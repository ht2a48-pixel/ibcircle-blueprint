import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  weeks: number;
  percentElapsed: number;
}

const ExamCountdown = () => {
  // May 2025 IB exams start around May 1st
  const mayExamDate = new Date('2025-05-01T09:00:00');
  // November 2025 IB exams start around November 1st
  const novExamDate = new Date('2025-11-01T09:00:00');

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
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      const weeks = Math.floor(days / 7);

      return { days, hours, minutes, seconds, weeks, percentElapsed };
    }

    return { days: 0, hours: 0, minutes: 0, seconds: 0, weeks: 0, percentElapsed: 100 };
  };

  const [mayTimeLeft, setMayTimeLeft] = useState<TimeLeft>(calculateTimeLeft(mayExamDate));
  const [novTimeLeft, setNovTimeLeft] = useState<TimeLeft>(calculateTimeLeft(novExamDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setMayTimeLeft(calculateTimeLeft(mayExamDate));
      setNovTimeLeft(calculateTimeLeft(novExamDate));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (num: number) => String(num).padStart(2, '0');

  const ExamCard = ({ 
    title, 
    timeLeft, 
    isPrimary = false 
  }: { 
    title: string; 
    timeLeft: TimeLeft; 
    isPrimary?: boolean;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className={`p-8 md:p-10 ${
        isPrimary 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-secondary border border-border'
      }`}
    >
      <div className="text-xs font-medium tracking-[0.2em] uppercase mb-6 opacity-70">
        {title}
      </div>
      
      {/* Main countdown */}
      <div className="flex items-baseline gap-2 mb-6">
        <span className={`text-5xl md:text-6xl font-medium tracking-tight ${
          isPrimary ? 'text-primary-foreground' : 'text-foreground'
        }`}>
          D–{timeLeft.days}
        </span>
        <span className={`text-2xl md:text-3xl font-light tracking-tight ${
          isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'
        }`}>
          {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-current/10">
        <div>
          <div className={`text-2xl font-medium ${
            isPrimary ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {timeLeft.days}
          </div>
          <div className={`text-xs mt-1 ${
            isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
          }`}>
            Days
          </div>
        </div>
        <div>
          <div className={`text-2xl font-medium ${
            isPrimary ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {timeLeft.weeks}
          </div>
          <div className={`text-xs mt-1 ${
            isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
          }`}>
            Weeks
          </div>
        </div>
        <div>
          <div className={`text-2xl font-medium ${
            isPrimary ? 'text-primary-foreground' : 'text-foreground'
          }`}>
            {timeLeft.percentElapsed.toFixed(0)}%
          </div>
          <div className={`text-xs mt-1 ${
            isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'
          }`}>
            Elapsed
          </div>
        </div>
      </div>
    </motion.div>
  );

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
          <p className="section-title">IB Exam Readiness Tracker</p>
          <h2 className="section-heading">시험까지 남은 시간</h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <ExamCard title="MAY IB EXAM" timeLeft={mayTimeLeft} isPrimary />
          <ExamCard title="NOVEMBER IB EXAM" timeLeft={novTimeLeft} />
        </div>
      </div>
    </section>
  );
};

export default ExamCountdown;

import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import WorldMap from './WorldMap';

interface Metric {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

const metrics: Metric[] = [
  { value: 223, label: '졸업생', suffix: '+' },
  { value: 38.2, label: '평균 IB 점수', decimals: 1 },
  { value: 11, label: '국가 진학', suffix: '' },
];

const AnimatedNumber = ({ 
  value, 
  decimals = 0, 
  suffix = '' 
}: { 
  value: number; 
  decimals?: number; 
  suffix?: string;
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const progress = currentStep / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOut);

      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {decimals > 0 ? displayValue.toFixed(decimals) : Math.floor(displayValue)}
      {suffix}
    </span>
  );
};

const Metrics = () => {
  return (
    <section id="results" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '50px 50px'
        }}
      />
      
      <div className="container mx-auto px-6 lg:px-12 relative">
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.15, ease: "easeOut" }}
              className="text-center"
            >
              <motion.div 
                initial={{ scale: 0.5 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.15 }}
                className="metric-value"
              >
                <AnimatedNumber 
                  value={metric.value} 
                  decimals={metric.decimals} 
                  suffix={metric.suffix} 
                />
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.4 + index * 0.15 }}
                className="metric-label"
              >
                {metric.label}
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* World Map */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
        >
          <WorldMap />
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-muted-foreground mt-12 text-lg"
        >
          성과는 주장하지 않습니다. 데이터로 증명합니다.
        </motion.p>
      </div>
    </section>
  );
};

export default Metrics;

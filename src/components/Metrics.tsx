import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface Metric {
  value: number;
  suffix?: string;
  label: string;
  decimals?: number;
}

const metrics: Metric[] = [
  { value: 223, label: '졸업생', suffix: '' },
  { value: 38.2, label: '평균 IB 점수', decimals: 1 },
  { value: 11, label: '국가 진학', suffix: '' },
];

// Countries where students are located with approximate coordinates for the map
const studentCountries = [
  { name: 'South Korea', x: 76, y: 38 },
  { name: 'Japan', x: 82, y: 36 },
  { name: 'China', x: 68, y: 35 },
  { name: 'Hong Kong', x: 72, y: 43 },
  { name: 'India', x: 55, y: 45 },
  { name: 'Vietnam', x: 68, y: 48 },
  { name: 'Indonesia', x: 70, y: 60 },
  { name: 'Russia', x: 60, y: 22 },
  { name: 'Poland', x: 38, y: 28 },
  { name: 'Brazil', x: 25, y: 62 },
  { name: 'USA', x: 18, y: 38 },
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
    <section id="results" className="py-24 md:py-32 bg-secondary/30">
      <div className="container mx-auto px-6 lg:px-12">
        {/* Metrics Grid */}
        <div className="grid md:grid-cols-3 gap-8 md:gap-12 mb-20">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="text-center"
            >
              <div className="metric-value">
                <AnimatedNumber 
                  value={metric.value} 
                  decimals={metric.decimals} 
                  suffix={metric.suffix} 
                />
              </div>
              <div className="metric-label">{metric.label}</div>
            </motion.div>
          ))}
        </div>

        {/* World Map with Thermal Dots */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Simple world map representation */}
          <div className="relative w-full aspect-[2/1] bg-muted/30 rounded-lg overflow-hidden">
            {/* World map outline - simplified SVG */}
            <svg
              viewBox="0 0 100 50"
              className="absolute inset-0 w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Simplified continents */}
              <path
                d="M5 25 Q10 20, 15 22 Q20 18, 28 25 Q30 30, 25 35 Q20 38, 15 35 Q8 32, 5 25"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
              />
              <path
                d="M30 18 Q35 15, 42 18 Q48 20, 45 28 Q42 32, 38 30 Q34 28, 30 22 Z"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
              />
              <path
                d="M55 20 Q65 18, 75 22 Q85 25, 82 35 Q78 42, 70 40 Q60 38, 55 30 Z"
                fill="none"
                stroke="hsl(var(--border))"
                strokeWidth="0.3"
              />
            </svg>

            {/* Thermal dots for each country */}
            {studentCountries.map((country, index) => (
              <motion.div
                key={country.name}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
                className="absolute group cursor-pointer"
                style={{
                  left: `${country.x}%`,
                  top: `${country.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                {/* Outer glow */}
                <div className="absolute w-12 h-12 -left-6 -top-6 bg-warm/20 rounded-full animate-thermal-pulse" />
                <div className="absolute w-8 h-8 -left-4 -top-4 bg-warm/40 rounded-full animate-thermal-pulse" style={{ animationDelay: '0.5s' }} />
                {/* Center dot */}
                <div className="relative w-3 h-3 bg-warm rounded-full shadow-lg" />
                
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  {country.name}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Supporting copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
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

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Country {
  name: string;
  x: number;
  y: number;
  students: number;
}

const studentCountries: Country[] = [
  { name: 'South Korea', x: 76, y: 38, students: 85 },
  { name: 'Japan', x: 82, y: 36, students: 28 },
  { name: 'China', x: 68, y: 35, students: 32 },
  { name: 'Hong Kong', x: 72, y: 43, students: 18 },
  { name: 'India', x: 55, y: 48, students: 12 },
  { name: 'Vietnam', x: 68, y: 50, students: 8 },
  { name: 'Indonesia', x: 70, y: 62, students: 10 },
  { name: 'Russia', x: 60, y: 22, students: 5 },
  { name: 'Poland', x: 38, y: 28, students: 4 },
  { name: 'Brazil', x: 25, y: 62, students: 6 },
  { name: 'USA', x: 18, y: 38, students: 15 },
];

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative w-full max-w-5xl mx-auto"
    >
      <div className="relative w-full aspect-[2/1] bg-gradient-to-b from-secondary/20 to-secondary/40 rounded-lg overflow-hidden border border-border/50">
        {/* Elegant world map SVG */}
        <svg
          ref={svgRef}
          viewBox="0 0 1000 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* World map paths - simplified elegant continents */}
          <defs>
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--muted))" stopOpacity="0.4" />
              <stop offset="100%" stopColor="hsl(var(--muted))" stopOpacity="0.2" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* North America */}
          <path
            d="M50 100 Q80 80, 120 90 Q160 85, 200 100 Q240 95, 280 110 
               L290 150 Q285 180, 270 200 Q260 220, 240 240 
               L200 260 Q160 270, 130 260 Q100 250, 80 230 
               Q60 200, 55 170 Q50 140, 50 100"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* South America */}
          <path
            d="M180 280 Q200 275, 220 290 Q250 300, 270 330 
               Q280 360, 275 400 Q265 430, 245 450 
               Q225 460, 200 455 Q175 445, 165 420 
               Q155 390, 160 350 Q165 310, 180 280"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Europe */}
          <path
            d="M380 100 Q420 90, 460 100 Q500 95, 530 110 
               L540 140 Q535 160, 520 175 Q505 190, 480 195 
               Q450 200, 420 195 Q390 185, 375 165 Q365 145, 370 120 Z"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Africa */}
          <path
            d="M400 200 Q440 195, 480 210 Q520 220, 550 250 
               Q570 290, 560 340 Q550 380, 520 410 
               Q490 435, 450 440 Q410 435, 385 410 
               Q365 380, 370 340 Q375 290, 390 250 Q395 225, 400 200"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Asia */}
          <path
            d="M550 80 Q600 70, 660 80 Q720 75, 780 90 Q840 85, 890 100 
               L910 140 Q920 180, 910 220 Q895 260, 860 290 
               Q820 320, 760 330 Q700 335, 640 320 
               Q590 305, 560 270 Q540 235, 545 190 Q545 140, 550 80"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />
          
          {/* Australia */}
          <path
            d="M720 360 Q760 350, 800 360 Q840 355, 870 375 
               L880 410 Q875 440, 850 455 Q820 465, 780 460 
               Q745 455, 720 430 Q705 405, 710 380 Q715 365, 720 360"
            fill="url(#landGradient)"
            stroke="hsl(var(--border))"
            strokeWidth="0.5"
          />

          {/* Grid lines for elegant effect */}
          {[...Array(9)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i + 1) * 50}
              x2="1000"
              y2={(i + 1) * 50}
              stroke="hsl(var(--border))"
              strokeWidth="0.2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          ))}
          {[...Array(19)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(i + 1) * 50}
              y1="0"
              x2={(i + 1) * 50}
              y2="500"
              stroke="hsl(var(--border))"
              strokeWidth="0.2"
              strokeDasharray="5,5"
              opacity="0.3"
            />
          ))}
        </svg>

        {/* Thermal dots for each country */}
        {studentCountries.map((country, index) => (
          <motion.div
            key={country.name}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
            className="absolute cursor-pointer"
            style={{
              left: `${country.x}%`,
              top: `${country.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredCountry(country)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            {/* Outer glow rings */}
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute w-16 h-16 -left-8 -top-8 bg-warm/20 rounded-full" 
            />
            <motion.div 
              animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.2, 0.5] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute w-10 h-10 -left-5 -top-5 bg-warm/40 rounded-full" 
            />
            {/* Center dot */}
            <div className="relative w-4 h-4 bg-warm rounded-full shadow-lg border-2 border-background transition-transform duration-200 hover:scale-150" />
            
            {/* Tooltip */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: hoveredCountry?.name === country.name ? 1 : 0, y: hoveredCountry?.name === country.name ? 0 : 5 }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-foreground text-background text-xs font-medium rounded shadow-lg whitespace-nowrap pointer-events-none z-20"
            >
              <div className="font-semibold">{country.name}</div>
              <div className="text-muted-foreground text-[10px]">{country.students} students</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
            </motion.div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-4 py-2 rounded border border-border/50">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-3 h-3 bg-warm rounded-full" />
            <span>Student Location</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;

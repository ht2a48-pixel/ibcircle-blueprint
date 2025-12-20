import { useState } from 'react';
import { motion } from 'framer-motion';

interface Country {
  name: string;
  x: number;
  y: number;
  students: number;
  intensity: number; // 0-1 for heatmap
}

const studentCountries: Country[] = [
  { name: 'South Korea', x: 76, y: 38, students: 85, intensity: 1.0 },
  { name: 'Japan', x: 82, y: 36, students: 28, intensity: 0.7 },
  { name: 'China', x: 68, y: 35, students: 32, intensity: 0.75 },
  { name: 'Hong Kong', x: 72, y: 43, students: 18, intensity: 0.5 },
  { name: 'India', x: 55, y: 48, students: 12, intensity: 0.4 },
  { name: 'Vietnam', x: 68, y: 50, students: 8, intensity: 0.3 },
  { name: 'Indonesia', x: 70, y: 62, students: 10, intensity: 0.35 },
  { name: 'Russia', x: 60, y: 22, students: 5, intensity: 0.2 },
  { name: 'Poland', x: 38, y: 28, students: 4, intensity: 0.15 },
  { name: 'Brazil', x: 25, y: 62, students: 6, intensity: 0.25 },
  { name: 'USA', x: 18, y: 38, students: 15, intensity: 0.45 },
];

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      <div className="relative w-full aspect-[2.5/1] overflow-hidden rounded-lg">
        {/* Large elegant gray world map SVG */}
        <svg
          viewBox="0 0 1200 500"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Grayscale land gradient */}
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 14% 85%)" />
              <stop offset="100%" stopColor="hsl(220 14% 80%)" />
            </linearGradient>
            
            {/* Heatmap radial gradients for each intensity */}
            <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 91% 60%)" stopOpacity="0.8" />
              <stop offset="40%" stopColor="hsl(25 85% 55%)" stopOpacity="0.5" />
              <stop offset="70%" stopColor="hsl(15 80% 50%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(5 70% 45%)" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="heatMedium" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 80% 60%)" stopOpacity="0.6" />
              <stop offset="50%" stopColor="hsl(30 70% 55%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(25 60% 50%)" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 60% 65%)" stopOpacity="0.4" />
              <stop offset="60%" stopColor="hsl(35 50% 60%)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(35 40% 55%)" stopOpacity="0" />
            </radialGradient>

            {/* Glow filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            
            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="8" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="1200" height="500" fill="hsl(220 14% 96%)" />

          {/* Detailed World Map - Continents */}
          {/* North America */}
          <path
            d="M120 80 L180 60 L240 55 L300 60 L340 80 L360 100 L380 140 
               L370 180 L350 210 L320 240 L290 260 L260 270 L230 265 
               L200 255 L170 240 L150 210 L140 180 L130 150 L120 120 Z
               M200 270 L220 280 L240 300 L250 330 L245 350 L230 365 
               L210 370 L195 360 L190 340 L195 310 L200 290 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* South America */}
          <path
            d="M250 290 L280 285 L310 300 L330 330 L340 370 L335 410 
               L320 440 L295 460 L265 465 L240 455 L225 430 L220 400 
               L225 360 L235 330 L245 300 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Europe */}
          <path
            d="M460 70 L500 60 L540 65 L580 75 L610 90 L620 115 
               L615 140 L600 160 L575 175 L545 180 L515 175 L485 165 
               L465 150 L455 130 L455 105 L460 80 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Africa */}
          <path
            d="M490 185 L530 180 L570 190 L605 210 L630 245 L645 290 
               L650 340 L640 385 L615 420 L580 445 L540 455 L500 450 
               L470 430 L450 395 L445 350 L455 300 L470 255 L480 215 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Asia (larger detailed shape) */}
          <path
            d="M620 50 L680 40 L750 45 L820 55 L890 50 L960 60 L1020 75 
               L1060 95 L1080 130 L1085 170 L1075 210 L1050 250 L1010 280 
               L960 300 L910 310 L860 305 L810 295 L760 280 L720 260 
               L690 235 L665 200 L650 165 L640 125 L630 90 L620 60 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Southeast Asia / Indonesia */}
          <path
            d="M820 310 L850 305 L880 315 L910 325 L890 345 L860 355 
               L830 350 L810 335 L815 320 Z
               M840 360 L870 358 L895 370 L880 385 L850 382 L835 370 Z
               M900 365 L930 360 L955 375 L945 395 L915 390 L895 380 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Australia */}
          <path
            d="M900 380 L950 370 L1000 375 L1050 390 L1080 420 
               L1085 460 L1070 490 L1040 505 L995 510 L950 500 
               L915 480 L895 450 L890 415 L895 390 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Japan */}
          <path
            d="M1000 140 L1015 135 L1025 145 L1030 165 L1025 185 
               L1015 195 L1005 190 L1000 175 L998 155 Z
               M1010 200 L1020 198 L1028 210 L1022 225 L1010 220 L1005 210 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />
          
          {/* Korean Peninsula */}
          <path
            d="M970 155 L980 150 L988 160 L990 180 L985 200 
               L975 210 L965 205 L962 185 L965 165 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />

          {/* UK / Ireland */}
          <path
            d="M445 95 L455 90 L465 95 L468 110 L462 125 L450 128 L442 118 L443 105 Z
               M435 100 L442 98 L445 108 L440 115 L432 112 L433 104 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 75%)"
            strokeWidth="0.5"
          />

          {/* Subtle grid lines for elegant effect */}
          {[...Array(5)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i + 1) * 100}
              x2="1200"
              y2={(i + 1) * 100}
              stroke="hsl(220 13% 88%)"
              strokeWidth="0.3"
              strokeDasharray="4,8"
              opacity="0.4"
            />
          ))}
          {[...Array(11)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(i + 1) * 100}
              y1="0"
              x2={(i + 1) * 100}
              y2="500"
              stroke="hsl(220 13% 88%)"
              strokeWidth="0.3"
              strokeDasharray="4,8"
              opacity="0.4"
            />
          ))}

          {/* Heatmap overlay circles */}
          {studentCountries.map((country, index) => {
            const size = 60 + country.intensity * 100;
            const gradientId = country.intensity > 0.6 ? 'heatHigh' : country.intensity > 0.3 ? 'heatMedium' : 'heatLow';
            return (
              <motion.ellipse
                key={`heat-${country.name}`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                cx={country.x * 12}
                cy={country.y * 5}
                rx={size}
                ry={size * 0.8}
                fill={`url(#${gradientId})`}
                filter="url(#softGlow)"
              />
            );
          })}
        </svg>

        {/* Glowing points overlay */}
        {studentCountries.map((country, index) => (
          <motion.div
            key={country.name}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.08 }}
            className="absolute cursor-pointer"
            style={{
              left: `${country.x}%`,
              top: `${country.y}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onMouseEnter={() => setHoveredCountry(country)}
            onMouseLeave={() => setHoveredCountry(null)}
          >
            {/* Outer animated glow rings */}
            <motion.div 
              animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0.1, 0.4] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full bg-warm"
              style={{
                width: 24 + country.intensity * 24,
                height: 24 + country.intensity * 24,
                left: -(12 + country.intensity * 12),
                top: -(12 + country.intensity * 12),
              }}
            />
            <motion.div 
              animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.2, 0.6] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute rounded-full bg-warm"
              style={{
                width: 16 + country.intensity * 16,
                height: 16 + country.intensity * 16,
                left: -(8 + country.intensity * 8),
                top: -(8 + country.intensity * 8),
              }}
            />
            
            {/* Center glowing dot */}
            <div 
              className="relative rounded-full shadow-lg border-2 border-background transition-transform duration-200 hover:scale-150"
              style={{
                width: 8 + country.intensity * 8,
                height: 8 + country.intensity * 8,
                background: `linear-gradient(135deg, hsl(35 91% 65%), hsl(25 85% 50%))`,
                boxShadow: '0 0 20px hsl(35 91% 60% / 0.6)',
              }}
            />
            
            {/* Tooltip */}
            <motion.div 
              initial={{ opacity: 0, y: 5 }}
              animate={{ 
                opacity: hoveredCountry?.name === country.name ? 1 : 0, 
                y: hoveredCountry?.name === country.name ? 0 : 5 
              }}
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-2.5 bg-foreground text-background text-xs font-medium rounded-lg shadow-xl whitespace-nowrap pointer-events-none z-20"
            >
              <div className="font-semibold text-sm">{country.name}</div>
              <div className="text-background/70 text-[11px] mt-0.5">{country.students} students</div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-foreground" />
            </motion.div>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-background/90 backdrop-blur-sm px-5 py-3 rounded-lg border border-border shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warm shadow-sm" style={{ boxShadow: '0 0 8px hsl(35 91% 60% / 0.5)' }} />
              <span className="text-xs text-muted-foreground font-medium">Student Location</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-2 rounded-full bg-gradient-to-r from-warm/30 via-warm/60 to-warm" />
              <span className="text-xs text-muted-foreground">Concentration</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;
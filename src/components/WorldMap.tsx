import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import worldMapImage from '@/assets/world-map.png';

interface Location {
  id: string;
  name: string;
  students: number;
  x: number; // percentage from left
  y: number; // percentage from top
  region: string;
}

// Student origin locations with coordinates (percentage-based for responsiveness)
const locations: Location[] = [
  // Korea
  { id: 'seoul', name: 'Seoul, South Korea', students: 85, x: 83.5, y: 35, region: 'Asia' },
  { id: 'busan', name: 'Busan, South Korea', students: 12, x: 84.5, y: 37, region: 'Asia' },
  // Japan
  { id: 'tokyo', name: 'Tokyo, Japan', students: 28, x: 88, y: 34, region: 'Asia' },
  { id: 'osaka', name: 'Osaka, Japan', students: 8, x: 86.5, y: 36, region: 'Asia' },
  // China
  { id: 'beijing', name: 'Beijing, China', students: 18, x: 78, y: 31, region: 'Asia' },
  { id: 'shanghai', name: 'Shanghai, China', students: 22, x: 80, y: 38, region: 'Asia' },
  { id: 'shenzhen', name: 'Shenzhen, China', students: 10, x: 77.5, y: 44, region: 'Asia' },
  // Hong Kong & Taiwan
  { id: 'hongkong', name: 'Hong Kong', students: 18, x: 78.5, y: 44, region: 'Asia' },
  { id: 'taipei', name: 'Taipei, Taiwan', students: 7, x: 81, y: 42, region: 'Asia' },
  // Southeast Asia
  { id: 'singapore', name: 'Singapore', students: 14, x: 75, y: 58, region: 'Asia' },
  { id: 'hanoi', name: 'Hanoi, Vietnam', students: 8, x: 74, y: 45, region: 'Asia' },
  { id: 'bangkok', name: 'Bangkok, Thailand', students: 6, x: 72, y: 50, region: 'Asia' },
  { id: 'jakarta', name: 'Jakarta, Indonesia', students: 10, x: 74.5, y: 63, region: 'Asia' },
  // India
  { id: 'mumbai', name: 'Mumbai, India', students: 8, x: 63, y: 48, region: 'Asia' },
  { id: 'delhi', name: 'New Delhi, India', students: 4, x: 64, y: 40, region: 'Asia' },
  // USA
  { id: 'newyork', name: 'New York, USA', students: 8, x: 26, y: 32, region: 'Americas' },
  { id: 'losangeles', name: 'Los Angeles, USA', students: 5, x: 14, y: 36, region: 'Americas' },
  { id: 'sanfrancisco', name: 'San Francisco, USA', students: 4, x: 12, y: 32, region: 'Americas' },
  // Canada
  { id: 'toronto', name: 'Toronto, Canada', students: 6, x: 24, y: 28, region: 'Americas' },
  { id: 'vancouver', name: 'Vancouver, Canada', students: 4, x: 12, y: 25, region: 'Americas' },
  // UK & Europe
  { id: 'london', name: 'London, UK', students: 5, x: 47.5, y: 25, region: 'Europe' },
  { id: 'paris', name: 'Paris, France', students: 3, x: 48.5, y: 28, region: 'Europe' },
  { id: 'berlin', name: 'Berlin, Germany', students: 4, x: 51, y: 24, region: 'Europe' },
  // Australia
  { id: 'sydney', name: 'Sydney, Australia', students: 4, x: 90, y: 72, region: 'Oceania' },
  { id: 'melbourne', name: 'Melbourne, Australia', students: 3, x: 88, y: 75, region: 'Oceania' },
];

// Calculate region totals
const regionTotals = locations.reduce((acc, loc) => {
  acc[loc.region] = (acc[loc.region] || 0) + loc.students;
  return acc;
}, {} as Record<string, number>);

const totalStudents = locations.reduce((sum, loc) => sum + loc.students, 0);

const WorldMap = () => {
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const filteredLocations = selectedRegion 
    ? locations.filter(loc => loc.region === selectedRegion)
    : locations;

  const getPinSize = (students: number) => {
    if (students >= 50) return 'lg';
    if (students >= 20) return 'md';
    if (students >= 10) return 'sm';
    return 'xs';
  };

  const pinSizeClasses = {
    lg: 'w-8 h-8',
    md: 'w-6 h-6',
    sm: 'w-4 h-4',
    xs: 'w-3 h-3',
  };

  const pulseSizeClasses = {
    lg: 'w-16 h-16',
    md: 'w-12 h-12',
    sm: 'w-8 h-8',
    xs: 'w-6 h-6',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      {/* Region Filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <button
          onClick={() => setSelectedRegion(null)}
          className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
            selectedRegion === null
              ? 'bg-primary text-primary-foreground'
              : 'bg-secondary text-secondary-foreground hover:bg-accent'
          }`}
        >
          All Regions
        </button>
        {Object.entries(regionTotals).map(([region, count]) => (
          <button
            key={region}
            onClick={() => setSelectedRegion(region)}
            className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-full ${
              selectedRegion === region
                ? 'bg-primary text-primary-foreground'
                : 'bg-secondary text-secondary-foreground hover:bg-accent'
            }`}
          >
            {region} <span className="opacity-70">({count})</span>
          </button>
        ))}
      </div>

      {/* Map Container */}
      <div className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-border shadow-xl">
        {/* World Map Image */}
        <img 
          src={worldMapImage} 
          alt="World Map" 
          className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20" />

        {/* Location Pins */}
        <AnimatePresence>
          {filteredLocations.map((location, index) => {
            const size = getPinSize(location.students);
            const isHovered = hoveredLocation?.id === location.id;

            return (
              <motion.div
                key={location.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ 
                  duration: 0.5, 
                  delay: index * 0.03,
                  type: 'spring',
                  stiffness: 200
                }}
                className="absolute cursor-pointer"
                style={{ 
                  left: `${location.x}%`, 
                  top: `${location.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                onMouseEnter={() => setHoveredLocation(location)}
                onMouseLeave={() => setHoveredLocation(null)}
              >
                {/* Pulse Animation */}
                <motion.div
                  className={`absolute ${pulseSizeClasses[size]} rounded-full bg-primary/30`}
                  style={{ 
                    left: '50%', 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                  animate={{
                    scale: [1, 1.5, 1],
                    opacity: [0.4, 0, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: index * 0.1,
                  }}
                />

                {/* Second Pulse Layer */}
                <motion.div
                  className={`absolute ${pulseSizeClasses[size]} rounded-full bg-primary/20`}
                  style={{ 
                    left: '50%', 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)' 
                  }}
                  animate={{
                    scale: [1, 2, 1],
                    opacity: [0.3, 0, 0.3],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.1 + 0.5,
                  }}
                />

                {/* Pin Marker */}
                <motion.div
                  className={`relative ${pinSizeClasses[size]} rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center z-10`}
                  whileHover={{ scale: 1.3 }}
                  animate={isHovered ? { scale: 1.3 } : { scale: 1 }}
                >
                  {size === 'lg' && (
                    <span className="text-[10px] font-bold text-primary-foreground">
                      {location.students}
                    </span>
                  )}
                </motion.div>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-4 py-2 bg-foreground text-background rounded-lg shadow-xl whitespace-nowrap z-50"
                    >
                      <div className="font-semibold text-sm">{location.name}</div>
                      <div className="text-background/70 text-xs mt-0.5">
                        {location.students} students
                      </div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Connection Lines (animated) */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Curved connection lines between major hubs */}
          {filteredLocations.filter(l => l.students >= 20).map((loc, i) => (
            <motion.path
              key={`line-${loc.id}`}
              d={`M ${loc.x}% ${loc.y}% Q 50% ${30 + i * 5}% 50% 50%`}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 2, delay: i * 0.2 }}
            />
          ))}
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm px-5 py-3 rounded-xl border border-border shadow-lg">
          <div className="text-xs font-semibold text-foreground mb-2">Student Distribution</div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">50+</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">20-49</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">10-19</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">&lt;10</span>
            </div>
          </div>
        </div>

        {/* Total Students Badge */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-5 py-3 rounded-xl shadow-lg"
        >
          <div className="text-2xl font-bold">{totalStudents}</div>
          <div className="text-xs opacity-80">Total Students</div>
        </motion.div>
      </div>

      {/* Region Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {Object.entries(regionTotals).map(([region, count], index) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            className="bg-secondary/50 rounded-xl p-4 text-center border border-border"
          >
            <div className="text-2xl font-bold text-primary">{count}</div>
            <div className="text-sm text-muted-foreground">{region}</div>
            <div className="mt-2 w-full bg-border rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(count / totalStudents) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {Math.round((count / totalStudents) * 100)}%
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WorldMap;

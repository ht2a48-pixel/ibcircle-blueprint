import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import worldMapImage from '@/assets/world-map.png';

interface Country {
  id: string;
  name: string;
  students: number;
  x: number;
  y: number;
  region: string;
}

// Region center coordinates for zoom focus
const regionCenters: Record<string, { x: number; y: number; scale: number }> = {
  Asia: { x: 75, y: 48, scale: 1.8 },
  Americas: { x: 25, y: 50, scale: 1.6 },
  Europe: { x: 49, y: 30, scale: 2.2 },
  Oceania: { x: 85, y: 72, scale: 2 },
};

// Student distribution by country (Total: 223 students)
const countries: Country[] = [
  // Asia (50% = 112 students)
  { id: 'KR', name: 'South Korea', students: 45, x: 79.5, y: 38, region: 'Asia' },
  { id: 'JP', name: 'Japan', students: 18, x: 83, y: 36, region: 'Asia' },
  { id: 'CN', name: 'China', students: 22, x: 72, y: 38, region: 'Asia' },
  { id: 'HK', name: 'Hong Kong', students: 10, x: 74.5, y: 45, region: 'Asia' },
  { id: 'TW', name: 'Taiwan', students: 5, x: 77, y: 44, region: 'Asia' },
  { id: 'SG', name: 'Singapore', students: 6, x: 72, y: 57, region: 'Asia' },
  { id: 'VN', name: 'Vietnam', students: 3, x: 73, y: 48, region: 'Asia' },
  { id: 'TH', name: 'Thailand', students: 2, x: 70, y: 50, region: 'Asia' },
  { id: 'ID', name: 'Indonesia', students: 1, x: 75, y: 60, region: 'Asia' },
  // Americas (40% = 89 students)
  { id: 'US', name: 'United States', students: 35, x: 21, y: 38, region: 'Americas' },
  { id: 'CA', name: 'Canada', students: 18, x: 20, y: 30, region: 'Americas' },
  { id: 'BR', name: 'Brazil', students: 22, x: 32, y: 62, region: 'Americas' },
  { id: 'CL', name: 'Chile', students: 8, x: 26, y: 75, region: 'Americas' },
  { id: 'MX', name: 'Mexico', students: 6, x: 17, y: 45, region: 'Americas' },
  // Europe (5% = 11 students)
  { id: 'GB', name: 'United Kingdom', students: 4, x: 48, y: 28, region: 'Europe' },
  { id: 'DE', name: 'Germany', students: 3, x: 51, y: 29, region: 'Europe' },
  { id: 'FR', name: 'France', students: 2, x: 49, y: 32, region: 'Europe' },
  { id: 'ES', name: 'Spain', students: 2, x: 47, y: 35, region: 'Europe' },
  // Oceania (5% = 11 students)
  { id: 'AU', name: 'Australia', students: 8, x: 82, y: 70, region: 'Oceania' },
  { id: 'NZ', name: 'New Zealand', students: 3, x: 89, y: 78, region: 'Oceania' },
];

// Calculate region totals
const regionTotals = countries.reduce((acc, country) => {
  acc[country.region] = (acc[country.region] || 0) + country.students;
  return acc;
}, {} as Record<string, number>);

const totalStudents = 223;

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [initialPinchDistance, setInitialPinchDistance] = useState(0);
  const [initialPinchScale, setInitialPinchScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCountries = selectedRegion 
    ? countries.filter(c => c.region === selectedRegion)
    : countries;

  const getPinSize = (students: number) => {
    if (students >= 50) return 'lg';
    if (students >= 20) return 'md';
    if (students >= 10) return 'sm';
    return 'xs';
  };

  const pinSizeClasses: Record<string, string> = {
    lg: 'w-6 h-6 md:w-8 md:h-8',
    md: 'w-5 h-5 md:w-6 md:h-6',
    sm: 'w-3 h-3 md:w-4 md:h-4',
    xs: 'w-2.5 h-2.5 md:w-3 md:h-3',
  };

  const pulseSizeClasses: Record<string, string> = {
    lg: 'w-12 h-12 md:w-16 md:h-16',
    md: 'w-10 h-10 md:w-12 md:h-12',
    sm: 'w-6 h-6 md:w-8 md:h-8',
    xs: 'w-5 h-5 md:w-6 md:h-6',
  };

  // Calculate distance between two touch points
  const getTouchDistance = (touches: React.TouchList) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  // Get center point between two touches
  const getTouchCenter = (touches: React.TouchList) => {
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2,
    };
  };

  // Calculate position offset for region focus
  const calculateRegionOffset = useCallback((region: string | null) => {
    if (!region || !containerRef.current) {
      return { x: 0, y: 0, scale: 1 };
    }
    
    const center = regionCenters[region];
    if (!center) return { x: 0, y: 0, scale: 1 };
    
    const containerWidth = containerRef.current.offsetWidth;
    const containerHeight = containerRef.current.offsetHeight;
    
    // Calculate offset to center the region
    const offsetX = (50 - center.x) * (containerWidth / 100) * center.scale;
    const offsetY = (50 - center.y) * (containerHeight / 100) * center.scale;
    
    return { x: offsetX, y: offsetY, scale: center.scale };
  }, []);

  // Handle region selection with zoom
  const handleRegionSelect = useCallback((region: string | null) => {
    setSelectedRegion(region);
    
    if (region) {
      const offset = calculateRegionOffset(region);
      setScale(offset.scale);
      setPosition({ x: offset.x, y: offset.y });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [calculateRegionOffset]);

  // Mobile touch/drag handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      // Pinch zoom start
      setIsPinching(true);
      setIsDragging(false);
      const distance = getTouchDistance(e.touches);
      setInitialPinchDistance(distance);
      setInitialPinchScale(scale);
    } else if (e.touches.length === 1 && !isPinching) {
      // Single finger drag
      setIsDragging(true);
      setDragStart({ 
        x: e.touches[0].clientX - position.x, 
        y: e.touches[0].clientY - position.y 
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      // Pinch zoom
      const currentDistance = getTouchDistance(e.touches);
      const scaleChange = currentDistance / initialPinchDistance;
      const newScale = Math.max(1, Math.min(4, initialPinchScale * scaleChange));
      
      setScale(newScale);
      
      // Adjust position to zoom towards pinch center
      if (newScale === 1) {
        setPosition({ x: 0, y: 0 });
      } else {
        const containerWidth = containerRef.current?.offsetWidth || 0;
        const containerHeight = containerRef.current?.offsetHeight || 0;
        const maxOffsetX = containerWidth * (newScale - 1) / 2;
        const maxOffsetY = containerHeight * (newScale - 1) / 2;
        setPosition({
          x: Math.max(-maxOffsetX, Math.min(maxOffsetX, position.x)),
          y: Math.max(-maxOffsetY, Math.min(maxOffsetY, position.y)),
        });
      }
    } else if (e.touches.length === 1 && isDragging && scale > 1) {
      // Single finger pan when zoomed in
      const newX = e.touches[0].clientX - dragStart.x;
      const newY = e.touches[0].clientY - dragStart.y;
      const containerWidth = containerRef.current?.offsetWidth || 0;
      const containerHeight = containerRef.current?.offsetHeight || 0;
      const maxOffsetX = containerWidth * (scale - 1) / 2;
      const maxOffsetY = containerHeight * (scale - 1) / 2;
      setPosition({
        x: Math.max(-maxOffsetX, Math.min(maxOffsetX, newX)),
        y: Math.max(-maxOffsetY, Math.min(maxOffsetY, newY)),
      });
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (e.touches.length < 2) {
      setIsPinching(false);
    }
    if (e.touches.length === 0) {
      setIsDragging(false);
    }
  };

  const handleZoomIn = () => {
    const newScale = Math.min(4, scale + 0.5);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(1, scale - 0.5);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setSelectedRegion(null);
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
          onClick={() => handleRegionSelect(null)}
          className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all duration-300 rounded-full ${
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
            onClick={() => handleRegionSelect(region)}
            className={`px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium transition-all duration-300 rounded-full ${
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
      <div 
        ref={containerRef}
        className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-border shadow-xl touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Zoomable/Pannable Container */}
        <motion.div
          className="absolute inset-0 w-full h-full origin-center"
          animate={{
            scale: scale,
            x: position.x,
            y: position.y,
          }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 30,
            duration: isDragging ? 0 : 0.5 
          }}
        >
          {/* World Map Image */}
          <img 
            src={worldMapImage} 
            alt="World Map" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale select-none pointer-events-none"
            draggable={false}
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />

          {/* Country Pins - These move with the map */}
          <AnimatePresence>
            {filteredCountries.map((country, index) => {
              const size = getPinSize(country.students);
              const isHovered = hoveredCountry?.id === country.id;

              return (
                <motion.div
                  key={country.id}
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
                    left: `${country.x}%`, 
                    top: `${country.y}%`,
                    transform: 'translate(-50%, -50%)'
                  }}
                  onMouseEnter={() => setHoveredCountry(country)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onTouchStart={(e) => {
                    e.stopPropagation();
                    setHoveredCountry(country);
                  }}
                  onTouchEnd={(e) => {
                    e.stopPropagation();
                    setTimeout(() => setHoveredCountry(null), 2000);
                  }}
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
                    {(size === 'lg' || size === 'md') && (
                      <span className="text-[8px] md:text-[10px] font-bold text-primary-foreground">
                        {country.students}
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
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 md:px-4 md:py-2 bg-foreground text-background rounded-lg shadow-xl whitespace-nowrap z-50"
                        style={{ transform: `translate(-50%, 0) scale(${1 / scale})` }}
                      >
                        <div className="font-semibold text-xs md:text-sm">{country.name}</div>
                        <div className="text-background/70 text-[10px] md:text-xs mt-0.5">
                          {country.students} students
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
            {filteredCountries.filter(c => c.students >= 20).map((country, i) => (
              <motion.path
                key={`line-${country.id}`}
                d={`M ${country.x}% ${country.y}% Q 50% ${30 + i * 5}% 50% 50%`}
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
        </motion.div>

        {/* Mobile Zoom Controls - Fixed position */}
        {isMobile && (
          <div className="absolute bottom-4 left-4 flex flex-col gap-2 z-20">
            <button
              onClick={handleZoomIn}
              className="w-10 h-10 bg-background/95 backdrop-blur-sm rounded-full border border-border shadow-lg flex items-center justify-center text-foreground font-bold text-lg active:scale-95 transition-transform"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              onClick={handleZoomOut}
              className="w-10 h-10 bg-background/95 backdrop-blur-sm rounded-full border border-border shadow-lg flex items-center justify-center text-foreground font-bold text-lg active:scale-95 transition-transform"
              aria-label="Zoom out"
            >
              −
            </button>
            {(scale > 1 || selectedRegion) && (
              <button
                onClick={handleReset}
                className="w-10 h-10 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center text-xs font-medium active:scale-95 transition-transform"
                aria-label="Reset view"
              >
                Reset
              </button>
            )}
          </div>
        )}

        {/* Legend - Fixed position */}
        <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-2 md:px-5 md:py-3 rounded-xl border border-border shadow-lg z-20">
          <div className="text-[10px] md:text-xs font-semibold text-foreground mb-1.5 md:mb-2">Student Distribution</div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary" />
              <span className="text-[9px] md:text-[11px] text-muted-foreground">50+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-primary" />
              <span className="text-[9px] md:text-[11px] text-muted-foreground">20-49</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span className="text-[9px] md:text-[11px] text-muted-foreground">10-19</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">&lt;10</span>
            </div>
          </div>
        </div>

        {/* Total Students Badge - Fixed position */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-2 md:px-5 md:py-3 rounded-xl shadow-lg z-20"
        >
          <div className="text-lg md:text-2xl font-bold">{totalStudents}</div>
          <div className="text-[10px] md:text-xs opacity-80">Total Students</div>
        </motion.div>

        {/* Zoom indicator */}
        {scale > 1 && (
          <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm px-3 py-1.5 rounded-full border border-border shadow-lg z-20">
            <span className="text-xs font-medium text-foreground">{Math.round(scale * 100)}%</span>
          </div>
        )}
      </div>

      {/* Region Statistics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4"
      >
        {Object.entries(regionTotals).map(([region, count], index) => (
          <motion.div
            key={region}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
            onClick={() => handleRegionSelect(region === selectedRegion ? null : region)}
            className={`bg-secondary/50 rounded-xl p-3 md:p-4 text-center border cursor-pointer transition-all duration-300 ${
              selectedRegion === region 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-border hover:border-primary/50'
            }`}
          >
            <div className="text-xl md:text-2xl font-bold text-primary">{count}</div>
            <div className="text-xs md:text-sm text-muted-foreground">{region}</div>
            <div className="mt-2 w-full bg-border rounded-full h-1 md:h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${(count / totalStudents) * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                className="h-full bg-primary rounded-full"
              />
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
              {Math.round((count / totalStudents) * 100)}%
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default WorldMap;
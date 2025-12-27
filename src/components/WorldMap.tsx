import { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion } from 'framer-motion';
import worldMapImage from '@/assets/world-map.png';

interface Country {
  id: string;
  name: string;
  students: number;
  x: number;
  y: number;
  region: string;
}

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

// Memoized pin component for better performance
const CountryPin = memo(({ 
  country, 
  isHovered, 
  onHover, 
  onLeave 
}: { 
  country: Country; 
  isHovered: boolean; 
  onHover: () => void; 
  onLeave: () => void;
}) => {
  const getPinSize = (students: number) => {
    if (students >= 50) return 'lg';
    if (students >= 20) return 'md';
    if (students >= 10) return 'sm';
    return 'xs';
  };

  const pinSizeClasses: Record<string, string> = {
    lg: 'w-5 h-5 md:w-8 md:h-8',
    md: 'w-4 h-4 md:w-6 md:h-6',
    sm: 'w-3 h-3 md:w-4 md:h-4',
    xs: 'w-2 h-2 md:w-3 md:h-3',
  };

  const size = getPinSize(country.students);

  return (
    <div
      className="absolute gpu-accelerated"
      style={{ 
        left: `${country.x}%`, 
        top: `${country.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={(e) => {
        e.stopPropagation();
        onHover();
      }}
      onTouchEnd={(e) => {
        e.stopPropagation();
        setTimeout(onLeave, 2000);
      }}
    >
      {/* Pin Marker */}
      <div
        className={`relative ${pinSizeClasses[size]} rounded-full bg-primary border-2 border-white shadow-lg flex items-center justify-center z-10 transition-transform duration-150 ${isHovered ? 'scale-125' : 'scale-100'}`}
      >
        {(size === 'lg' || size === 'md') && (
          <span className="text-[8px] md:text-[10px] font-bold text-primary-foreground">
            {country.students}
          </span>
        )}
      </div>

      {/* Tooltip - Only render when hovered */}
      {isHovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-foreground text-background rounded-lg shadow-xl whitespace-nowrap z-50">
          <div className="font-semibold text-xs">{country.name}</div>
          <div className="text-background/70 text-[10px]">{country.students} students</div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
});

CountryPin.displayName = 'CountryPin';

// Mobile region card component
const RegionCard = memo(({ 
  region, 
  count, 
  isSelected, 
  onSelect 
}: { 
  region: string; 
  count: number; 
  isSelected: boolean;
  onSelect: () => void;
}) => {
  const percentage = Math.round((count / totalStudents) * 100);
  
  return (
    <button
      onClick={onSelect}
      className={`flex-shrink-0 w-28 p-3 rounded-xl border text-center transition-all duration-200 touch-target ${
        isSelected 
          ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
          : 'border-border bg-secondary/50 active:scale-95'
      }`}
    >
      <div className="text-xl font-bold text-primary">{count}</div>
      <div className="text-xs text-muted-foreground">{region}</div>
      <div className="mt-2 w-full bg-border rounded-full h-1 overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-[10px] text-muted-foreground mt-1">{percentage}%</div>
    </button>
  );
});

RegionCard.displayName = 'RegionCard';

const WorldMap = memo(() => {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredCountries = selectedRegion 
    ? countries.filter(c => c.region === selectedRegion)
    : countries;

  const handleRegionSelect = useCallback((region: string | null) => {
    setSelectedRegion(region);
  }, []);

  return (
    <div className="relative w-full">
      {/* Mobile: Horizontal scrollable region cards */}
      {isMobile ? (
        <div className="mb-4 -mx-6 px-6 overflow-x-auto hide-scrollbar scroll-smooth-mobile">
          <div className="flex gap-3 pb-2" style={{ minWidth: 'max-content' }}>
            <button
              onClick={() => handleRegionSelect(null)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${
                selectedRegion === null
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground active:scale-95'
              }`}
            >
              All ({totalStudents})
            </button>
            {Object.entries(regionTotals).map(([region, count]) => (
              <button
                key={region}
                onClick={() => handleRegionSelect(region === selectedRegion ? null : region)}
                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 touch-target ${
                  selectedRegion === region
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground active:scale-95'
                }`}
              >
                {region} ({count})
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* Desktop: Original filter buttons */
        <div className="flex flex-wrap justify-center gap-2 mb-6">
          <button
            onClick={() => handleRegionSelect(null)}
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
              onClick={() => handleRegionSelect(region === selectedRegion ? null : region)}
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
      )}

      {/* Map Container - Simplified for mobile */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-[2/1] overflow-hidden rounded-xl md:rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200 border border-border shadow-lg md:shadow-xl gpu-accelerated"
      >
        {/* Static Map - No zoom/pan on mobile for performance */}
        <div className="absolute inset-0 w-full h-full">
          {/* World Map Image */}
          <img 
            src={worldMapImage} 
            alt="World Map" 
            className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale select-none pointer-events-none"
            draggable={false}
            loading="lazy"
          />

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/20 pointer-events-none" />

          {/* Country Pins - Simplified rendering */}
          {filteredCountries.map((country) => (
            <CountryPin
              key={country.id}
              country={country}
              isHovered={hoveredCountry?.id === country.id}
              onHover={() => setHoveredCountry(country)}
              onLeave={() => setHoveredCountry(null)}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 bg-background/95 backdrop-blur-sm px-2.5 py-1.5 md:px-5 md:py-3 rounded-lg md:rounded-xl border border-border shadow-lg z-20">
          <div className="text-[9px] md:text-xs font-semibold text-foreground mb-1">Student Distribution</div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-primary" />
              <span className="text-[8px] md:text-[11px] text-muted-foreground">50+</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-primary" />
              <span className="text-[8px] md:text-[11px] text-muted-foreground">20+</span>
            </div>
            <div className="hidden md:flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[11px] text-muted-foreground">&lt;20</span>
            </div>
          </div>
        </div>

        {/* Total Students Badge */}
        <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-primary text-primary-foreground px-3 py-1.5 md:px-5 md:py-3 rounded-lg md:rounded-xl shadow-lg z-20">
          <div className="text-lg md:text-2xl font-bold">{totalStudents}</div>
          <div className="text-[9px] md:text-xs opacity-80">Total Students</div>
        </div>
      </div>

      {/* Region Statistics - Grid for all devices */}
      <div className="mt-6 md:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {Object.entries(regionTotals).map(([region, count]) => (
          <button
            key={region}
            onClick={() => handleRegionSelect(region === selectedRegion ? null : region)}
            className={`bg-secondary/50 rounded-lg md:rounded-xl p-3 md:p-4 text-center border transition-all duration-200 ${
              selectedRegion === region 
                ? 'border-primary ring-2 ring-primary/20' 
                : 'border-border active:scale-95 md:hover:border-primary/50'
            }`}
          >
            <div className="text-xl md:text-2xl font-bold text-primary">{count}</div>
            <div className="text-xs md:text-sm text-muted-foreground">{region}</div>
            <div className="mt-2 w-full bg-border rounded-full h-1 md:h-1.5 overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${Math.round((count / totalStudents) * 100)}%` }}
              />
            </div>
            <div className="text-[10px] md:text-xs text-muted-foreground mt-1">
              {Math.round((count / totalStudents) * 100)}%
            </div>
          </button>
        ))}
      </div>
    </div>
  );
});

WorldMap.displayName = 'WorldMap';

export default WorldMap;
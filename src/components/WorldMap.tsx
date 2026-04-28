import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import worldMapImage from '@/assets/world-map.png';

interface Country {
  id: string;
  name: string;
  students: number;
  // x,y are percentages on the visible (object-cover, aspect-2/1) map frame
  x: number;
  y: number;
  region: string;
}

// Student distribution by country (Total: 223 students)
// Coordinates calibrated against the equirectangular world-map.png asset.
const countries: Country[] = [
  // Asia (50% = 112 students)
  { id: 'KR', name: 'South Korea', students: 45, x: 84.0, y: 38.0, region: 'Asia' },
  { id: 'JP', name: 'Japan', students: 18, x: 87.5, y: 39.0, region: 'Asia' },
  { id: 'CN', name: 'China', students: 22, x: 78.5, y: 40.0, region: 'Asia' },
  { id: 'HK', name: 'Hong Kong', students: 10, x: 81.0, y: 47.5, region: 'Asia' },
  { id: 'TW', name: 'Taiwan', students: 5, x: 83.5, y: 47.5, region: 'Asia' },
  { id: 'SG', name: 'Singapore', students: 6, x: 78.5, y: 56.5, region: 'Asia' },
  { id: 'VN', name: 'Vietnam', students: 3, x: 79.5, y: 51.0, region: 'Asia' },
  { id: 'TH', name: 'Thailand', students: 2, x: 77.0, y: 52.0, region: 'Asia' },
  { id: 'ID', name: 'Indonesia', students: 1, x: 81.5, y: 60.0, region: 'Asia' },
  // Americas (40% = 89 students)
  { id: 'US', name: 'United States', students: 35, x: 24.0, y: 39.0, region: 'Americas' },
  { id: 'CA', name: 'Canada', students: 18, x: 23.0, y: 28.0, region: 'Americas' },
  { id: 'BR', name: 'Brazil', students: 22, x: 34.0, y: 63.0, region: 'Americas' },
  { id: 'CL', name: 'Chile', students: 8, x: 30.0, y: 75.0, region: 'Americas' },
  { id: 'MX', name: 'Mexico', students: 6, x: 19.5, y: 49.0, region: 'Americas' },
  // Europe (5% = 11 students)
  { id: 'GB', name: 'United Kingdom', students: 4, x: 49.5, y: 31.0, region: 'Europe' },
  { id: 'DE', name: 'Germany', students: 3, x: 52.5, y: 33.0, region: 'Europe' },
  { id: 'FR', name: 'France', students: 2, x: 50.0, y: 35.5, region: 'Europe' },
  { id: 'ES', name: 'Spain', students: 2, x: 47.5, y: 38.0, region: 'Europe' },
  // Oceania (5% = 11 students)
  { id: 'AU', name: 'Australia', students: 8, x: 86.0, y: 71.0, region: 'Oceania' },
  { id: 'NZ', name: 'New Zealand', students: 3, x: 93.5, y: 78.0, region: 'Oceania' },
];

const totalStudents = 223;

// Region order is fixed (no Object.entries shuffling)
const REGION_ORDER = ['Asia', 'Americas', 'Europe', 'Oceania'] as const;
type Region = typeof REGION_ORDER[number];

const regionTotals: Record<Region, number> = countries.reduce(
  (acc, c) => {
    acc[c.region as Region] = (acc[c.region as Region] || 0) + c.students;
    return acc;
  },
  { Asia: 0, Americas: 0, Europe: 0, Oceania: 0 } as Record<Region, number>,
);

// ---------- Pin ----------
const CountryPin = memo(({
  country,
  isHovered,
  isDimmed,
  onHover,
  onLeave,
}: {
  country: Country;
  isHovered: boolean;
  isDimmed: boolean;
  onHover: () => void;
  onLeave: () => void;
}) => {
  const sizeKey = country.students >= 30 ? 'lg' : country.students >= 15 ? 'md' : country.students >= 5 ? 'sm' : 'xs';
  const sizeClasses: Record<string, string> = {
    lg: 'w-6 h-6 md:w-8 md:h-8 text-[10px] md:text-[11px]',
    md: 'w-5 h-5 md:w-6 md:h-6 text-[9px] md:text-[10px]',
    sm: 'w-3.5 h-3.5 md:w-4 md:h-4',
    xs: 'w-2.5 h-2.5 md:w-3 md:h-3',
  };
  const showNumber = sizeKey === 'lg' || sizeKey === 'md';

  // Shared easing for every animated property on the pin
  const EASE = 'cubic-bezier(0.22, 1, 0.36, 1)';
  const haloSize = sizeClasses[sizeKey].split(' ').slice(0, 4).join(' ');

  return (
    <div
      className="absolute"
      style={{
        left: `${country.x}%`,
        top: `${country.y}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: isHovered ? 30 : isDimmed ? 5 : 10,
        willChange: 'transform, opacity',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onTouchStart={(e) => { e.stopPropagation(); onHover(); }}
      onTouchEnd={(e) => { e.stopPropagation(); setTimeout(onLeave, 1800); }}
    >
      {/* Idle pulsing halo — fades out on hover or when dimmed */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full bg-primary/25 ${haloSize} ${
          !isHovered && !isDimmed ? 'animate-[ping_2.4s_cubic-bezier(0,0,0.2,1)_infinite]' : ''
        }`}
        style={{
          opacity: isHovered || isDimmed ? 0 : 1,
          transition: `opacity 320ms ${EASE}`,
        }}
      />

      {/* Hover halo — expands smoothly outward on hover */}
      <span
        aria-hidden
        className={`absolute inset-0 rounded-full bg-primary/30 ${haloSize}`}
        style={{
          transform: isHovered ? 'scale(2.2)' : 'scale(1)',
          opacity: isHovered ? 0 : 0.6,
          transition: `transform 420ms ${EASE}, opacity 420ms ${EASE}`,
          transformOrigin: 'center',
        }}
      />

      {/* Pin */}
      <button
        type="button"
        aria-label={`${country.name}, ${country.students} students`}
        className={`relative ${sizeClasses[sizeKey]} rounded-full bg-primary text-primary-foreground border-2 border-white flex items-center justify-center font-semibold`}
        style={{
          opacity: isDimmed ? 0.2 : 1,
          transform: isHovered ? 'scale(1.28)' : 'scale(1)',
          boxShadow: isHovered
            ? '0 6px 18px rgba(15, 23, 42, 0.35)'
            : '0 2px 8px rgba(15, 23, 42, 0.25)',
          transition: `transform 280ms ${EASE}, opacity 320ms ${EASE}, box-shadow 280ms ${EASE}`,
          transformOrigin: 'center',
          willChange: 'transform, opacity',
        }}
      >
        {showNumber && <span className="leading-none tabular-nums">{country.students}</span>}
      </button>

      {/* Tooltip — same easing & duration as pin */}
      <div
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap rounded-md bg-foreground/95 backdrop-blur px-2.5 py-1.5 shadow-xl"
        style={{
          zIndex: 40,
          opacity: isHovered ? 1 : 0,
          transform: `translate(-50%, ${isHovered ? '0px' : '6px'}) scale(${isHovered ? 1 : 0.96})`,
          transition: `opacity 220ms ${EASE}, transform 280ms ${EASE}`,
          transformOrigin: 'center bottom',
          willChange: 'transform, opacity',
        }}
      >
        <div className="text-[11px] font-semibold text-background tracking-tight">{country.name}</div>
        <div className="text-[10px] text-background/70 tabular-nums">{country.students} students</div>
        <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[5px] border-transparent border-t-foreground/95" />
      </div>
    </div>
  );
});
CountryPin.displayName = 'CountryPin';

// ---------- Region pill (filter) ----------
const RegionPill = memo(({
  label,
  count,
  selected,
  onClick,
}: {
  label: string;
  count: number;
  selected: boolean;
  onClick: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`group relative inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs md:text-sm font-medium transition-all duration-200 ease-out ${
      selected
        ? 'border-primary bg-primary text-primary-foreground shadow-sm'
        : 'border-border bg-background text-foreground/80 hover:border-primary/40 hover:text-foreground'
    }`}
  >
    <span>{label}</span>
    <span className={`tabular-nums text-[11px] ${selected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
      {count}
    </span>
  </button>
));
RegionPill.displayName = 'RegionPill';

// ---------- Main ----------
const WorldMap = memo(() => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSelect = useCallback((r: Region | null) => {
    setSelectedRegion((cur) => (cur === r ? null : r));
  }, []);

  const visibleCount = useMemo(
    () => (selectedRegion ? regionTotals[selectedRegion] : totalStudents),
    [selectedRegion],
  );

  return (
    <div className="relative w-full">
      {/* Filter bar */}
      <div className="mb-5 flex flex-wrap items-center justify-center gap-2">
        <RegionPill
          label="All Regions"
          count={totalStudents}
          selected={selectedRegion === null}
          onClick={() => setSelectedRegion(null)}
        />
        {REGION_ORDER.map((region) => (
          <RegionPill
            key={region}
            label={region}
            count={regionTotals[region]}
            selected={selectedRegion === region}
            onClick={() => handleSelect(region)}
          />
        ))}
      </div>

      {/* Map */}
      <div
        ref={containerRef}
        className="relative w-full aspect-[2/1] overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-b from-slate-50 to-slate-100 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.15)]"
      >
        <img
          src={worldMapImage}
          alt="World map showing student distribution"
          className="absolute inset-0 h-full w-full select-none object-cover opacity-90 grayscale [filter:grayscale(100%)_contrast(0.95)] pointer-events-none"
          draggable={false}
          loading="lazy"
        />
        {/* Subtle vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(15,23,42,0.06)_100%)]" />

        {/* Pins */}
        {countries.map((c) => {
          const dimmed = selectedRegion !== null && c.region !== selectedRegion;
          return (
            <CountryPin
              key={c.id}
              country={c}
              isHovered={hoveredId === c.id}
              isDimmed={dimmed}
              onHover={() => setHoveredId(c.id)}
              onLeave={() => setHoveredId((cur) => (cur === c.id ? null : cur))}
            />
          );
        })}

        {/* Total badge */}
        <div className="absolute left-3 top-3 md:left-5 md:top-5 rounded-xl bg-background/90 backdrop-blur-md border border-border/60 px-3 py-2 md:px-4 md:py-2.5 shadow-sm">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xl md:text-2xl font-bold tabular-nums text-foreground tracking-tight">
              {visibleCount}
            </span>
            <span className="text-[10px] md:text-xs uppercase tracking-wider text-muted-foreground">
              {selectedRegion ?? 'Students'}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-3 right-3 md:bottom-4 md:right-4 rounded-xl bg-background/90 backdrop-blur-md border border-border/60 px-3 py-2 md:px-4 md:py-2.5 shadow-sm">
          <div className="mb-1.5 text-[9px] md:text-[10px] uppercase tracking-wider text-muted-foreground">
            Pin scale
          </div>
          <div className="flex items-center gap-2.5 md:gap-3">
            <span className="flex items-center gap-1.5">
              <span className="block w-1.5 h-1.5 rounded-full bg-primary" />
              <span className="text-[10px] md:text-[11px] text-foreground/70 tabular-nums">1+</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="block w-2.5 h-2.5 rounded-full bg-primary" />
              <span className="text-[10px] md:text-[11px] text-foreground/70 tabular-nums">5+</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="block w-3.5 h-3.5 rounded-full bg-primary" />
              <span className="text-[10px] md:text-[11px] text-foreground/70 tabular-nums">15+</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="block w-4 h-4 rounded-full bg-primary" />
              <span className="text-[10px] md:text-[11px] text-foreground/70 tabular-nums">30+</span>
            </span>
          </div>
        </div>
      </div>

      {/* Region stats grid */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {REGION_ORDER.map((region) => {
          const count = regionTotals[region];
          const pct = Math.round((count / totalStudents) * 100);
          const isSelected = selectedRegion === region;
          return (
            <button
              key={region}
              type="button"
              onClick={() => handleSelect(region)}
              className={`group rounded-xl border bg-background p-4 text-left transition-all duration-200 ease-out ${
                isSelected
                  ? 'border-primary shadow-[0_4px_16px_-6px_hsl(var(--primary)/0.35)]'
                  : 'border-border/60 hover:border-primary/40 hover:shadow-sm'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{region}</span>
                <span className="text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
              </div>
              <div className="mt-1 text-2xl md:text-3xl font-bold tabular-nums text-foreground tracking-tight">
                {count}
              </div>
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-border/70">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
});

WorldMap.displayName = 'WorldMap';

export default WorldMap;

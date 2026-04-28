import { memo, useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface Country {
  name: string;
  students: number;
}

interface RegionData {
  region: string;
  countries: Country[];
}

const REGIONS: RegionData[] = [
  {
    region: 'Asia',
    countries: [
      { name: '대한민국 (South Korea)', students: 45 },
      { name: '중국 (China)', students: 22 },
      { name: '일본 (Japan)', students: 18 },
      { name: '홍콩 (Hong Kong)', students: 10 },
      { name: '싱가포르 (Singapore)', students: 6 },
      { name: '대만 (Taiwan)', students: 5 },
      { name: '베트남 (Vietnam)', students: 3 },
      { name: '태국 (Thailand)', students: 2 },
      { name: '인도네시아 (Indonesia)', students: 1 },
    ],
  },
  {
    region: 'Americas',
    countries: [
      { name: '미국 (United States)', students: 35 },
      { name: '브라질 (Brazil)', students: 22 },
      { name: '캐나다 (Canada)', students: 18 },
      { name: '칠레 (Chile)', students: 8 },
      { name: '멕시코 (Mexico)', students: 6 },
    ],
  },
  {
    region: 'Europe',
    countries: [
      { name: '영국 (United Kingdom)', students: 8 },
      { name: '독일 (Germany)', students: 6 },
      { name: '프랑스 (France)', students: 4 },
      { name: '스페인 (Spain)', students: 4 },
    ],
  },
  {
    region: 'Oceania',
    countries: [
      { name: '호주 (Australia)', students: 8 },
      { name: '뉴질랜드 (New Zealand)', students: 3 },
    ],
  },
];

const TOTAL = REGIONS.reduce(
  (s, r) => s + r.countries.reduce((cs, c) => cs + c.students, 0),
  0,
);

const RegionCard = memo(({ data, expanded, onToggle }: {
  data: RegionData;
  expanded: boolean;
  onToggle: () => void;
}) => {
  const total = data.countries.reduce((s, c) => s + c.students, 0);
  const pct = Math.round((total / TOTAL) * 100);

  return (
    <div
      className={`bg-background overflow-hidden transition-colors duration-200 ${
        expanded ? 'ring-1 ring-primary/70 relative z-10' : ''
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={expanded}
        className="w-full px-6 py-5 text-left"
      >
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
                {data.region}
              </span>
              <span className="text-xs font-medium tabular-nums tracking-wide text-muted-foreground">
                {pct.toString().padStart(2, '0')}%
              </span>
            </div>
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-4xl font-medium tabular-nums text-foreground tracking-tight leading-none">
                {total.toString().padStart(2, '0')}
              </span>
              <span className="text-xs tracking-wide text-muted-foreground">
                Students · {data.countries.length.toString().padStart(2, '0')} Countries
              </span>
            </div>
            <div className="mt-5 h-px w-full overflow-hidden bg-border">
              <div
                className="h-full bg-primary transition-[width] duration-700 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
          <ChevronDown
            className={`h-4 w-4 text-muted-foreground shrink-0 mt-1 transition-transform duration-300 ${
              expanded ? 'rotate-180 text-primary' : ''
            }`}
            strokeWidth={1.5}
          />
        </div>
      </button>

      {/* Smooth expand using grid trick — no layout thrash */}
      <div
        className="grid transition-[grid-template-rows] duration-300 ease-out"
        style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 pt-2 border-t border-border">
            <ul className="divide-y divide-border">
              {data.countries.map((c) => {
                const cpct = Math.round((c.students / total) * 100);
                return (
                  <li key={c.name} className="flex items-center justify-between gap-6 py-3">
                    <span className="text-sm text-foreground tracking-tight truncate">{c.name}</span>
                    <span className="flex items-center gap-4 shrink-0">
                      <span className="hidden sm:block w-28 h-px bg-border overflow-hidden">
                        <span
                          className="block h-full bg-primary"
                          style={{ width: `${cpct}%` }}
                        />
                      </span>
                      <span className="text-sm font-medium tabular-nums text-foreground w-8 text-right">
                        {c.students.toString().padStart(2, '0')}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
});
RegionCard.displayName = 'RegionCard';

const RegionBreakdown = memo(() => {
  const [expanded, setExpanded] = useState<string | null>('Asia');

  return (
    <div className="w-full">
      <div className="mb-10 pb-6 border-b border-border">
        <div className="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground">
          Student Distribution
        </div>
        <div className="mt-3 flex items-baseline gap-3 flex-wrap">
          <span className="text-5xl md:text-6xl font-medium tabular-nums text-foreground tracking-tight leading-none">
            {TOTAL}
          </span>
          <span className="text-sm tracking-wide text-muted-foreground">
            총 졸업생 · 4개 대륙 · 20개 국가
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border border border-border">
        {REGIONS.map((r) => (
          <RegionCard
            key={r.region}
            data={r}
            expanded={expanded === r.region}
            onToggle={() => setExpanded((cur) => (cur === r.region ? null : r.region))}
          />
        ))}
      </div>
    </div>
  );
});
RegionBreakdown.displayName = 'RegionBreakdown';

export default RegionBreakdown;

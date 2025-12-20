import { useState } from 'react';
import { motion } from 'framer-motion';

interface Country {
  id: string;
  name: string;
  students: number;
  path: string;
}

// Actual world map country paths with student data
const countries: Country[] = [
  {
    id: 'KR',
    name: 'South Korea',
    students: 85,
    path: 'M1273,228 L1278,225 L1283,227 L1286,232 L1285,238 L1281,243 L1276,244 L1271,241 L1269,235 L1271,230 Z'
  },
  {
    id: 'JP',
    name: 'Japan',
    students: 28,
    path: 'M1295,215 L1302,210 L1310,212 L1316,218 L1318,226 L1315,235 L1308,242 L1298,245 L1290,241 L1286,233 L1288,223 Z M1285,250 L1292,248 L1298,252 L1300,260 L1295,268 L1287,270 L1280,265 L1279,257 L1282,252 Z'
  },
  {
    id: 'CN',
    name: 'China',
    students: 32,
    path: 'M1150,180 L1190,175 L1230,180 L1260,195 L1275,215 L1270,245 L1250,270 L1215,285 L1175,290 L1140,280 L1115,260 L1105,235 L1110,205 L1130,185 Z'
  },
  {
    id: 'HK',
    name: 'Hong Kong',
    students: 18,
    path: 'M1238,295 L1245,293 L1250,297 L1252,304 L1248,310 L1241,312 L1235,308 L1234,301 L1237,296 Z'
  },
  {
    id: 'IN',
    name: 'India',
    students: 12,
    path: 'M1100,270 L1130,265 L1155,275 L1170,295 L1175,320 L1165,350 L1145,375 L1115,390 L1085,385 L1060,365 L1055,335 L1065,305 L1085,280 Z'
  },
  {
    id: 'VN',
    name: 'Vietnam',
    students: 8,
    path: 'M1215,310 L1225,305 L1232,312 L1235,325 L1230,340 L1220,352 L1208,355 L1200,348 L1202,332 L1210,318 Z'
  },
  {
    id: 'ID',
    name: 'Indonesia',
    students: 10,
    path: 'M1180,380 L1210,375 L1240,382 L1265,395 L1280,415 L1275,440 L1255,460 L1225,470 L1195,465 L1170,450 L1160,425 L1168,400 Z M1145,395 L1165,390 L1180,400 L1185,418 L1175,435 L1158,442 L1142,435 L1138,418 L1145,402 Z'
  },
  {
    id: 'RU',
    name: 'Russia',
    students: 5,
    path: 'M900,80 L1000,70 L1100,75 L1200,85 L1280,100 L1340,125 L1370,160 L1375,200 L1355,235 L1315,260 L1260,275 L1200,280 L1140,275 L1085,260 L1040,235 L1010,200 L1000,160 L1010,120 L940,115 L895,105 Z'
  },
  {
    id: 'PL',
    name: 'Poland',
    students: 4,
    path: 'M580,155 L600,150 L620,155 L635,168 L638,185 L628,200 L610,208 L590,205 L575,192 L572,175 L578,160 Z'
  },
  {
    id: 'BR',
    name: 'Brazil',
    students: 6,
    path: 'M340,350 L390,340 L440,355 L480,385 L505,425 L510,475 L495,520 L460,555 L415,575 L365,580 L320,565 L285,535 L270,490 L275,445 L295,400 L320,365 Z'
  },
  {
    id: 'US',
    name: 'USA',
    students: 15,
    path: 'M120,160 L200,145 L280,150 L350,165 L400,190 L430,225 L440,270 L425,315 L390,350 L340,375 L285,385 L230,380 L180,360 L140,330 L115,290 L105,245 L110,200 Z'
  },
  {
    id: 'SG',
    name: 'Singapore',
    students: 14,
    path: 'M1192,365 L1200,362 L1208,367 L1210,376 L1205,383 L1196,385 L1188,380 L1186,372 L1190,366 Z'
  },
  {
    id: 'TW',
    name: 'Taiwan',
    students: 7,
    path: 'M1260,280 L1270,276 L1278,282 L1280,292 L1275,302 L1266,306 L1257,301 L1255,291 L1259,282 Z'
  },
];

// Other countries for the map background (no student data)
const backgroundCountries = [
  // North America
  { id: 'CA', path: 'M100,60 L180,50 L260,55 L340,70 L400,95 L440,130 L450,170 L435,200 L400,220 L350,230 L295,225 L245,210 L200,185 L165,155 L140,120 L115,90 Z' },
  { id: 'MX', path: 'M170,300 L220,290 L265,305 L300,335 L315,375 L305,415 L280,445 L245,460 L210,455 L185,435 L175,400 L175,365 L170,330 Z' },
  // South America
  { id: 'AR', path: 'M320,520 L355,510 L385,530 L400,565 L395,605 L375,640 L345,665 L310,670 L280,655 L265,620 L270,580 L290,545 Z' },
  { id: 'CL', path: 'M285,480 L300,475 L315,490 L320,520 L310,555 L295,590 L275,620 L255,635 L240,620 L245,580 L260,540 L275,500 Z' },
  // Europe
  { id: 'GB', path: 'M510,140 L525,135 L540,142 L545,158 L538,175 L522,182 L508,176 L502,160 L506,145 Z' },
  { id: 'FR', path: 'M520,175 L550,168 L575,180 L590,202 L585,228 L565,248 L535,255 L510,245 L498,220 L505,195 Z' },
  { id: 'DE', path: 'M560,145 L585,138 L608,150 L618,172 L612,195 L592,212 L568,215 L550,200 L548,175 L555,155 Z' },
  { id: 'ES', path: 'M480,210 L515,205 L545,220 L555,245 L545,272 L520,290 L488,292 L465,275 L462,248 L472,225 Z' },
  { id: 'IT', path: 'M570,210 L590,205 L608,220 L615,245 L605,275 L585,300 L560,310 L542,298 L540,268 L550,240 L565,218 Z' },
  // Africa
  { id: 'EG', path: 'M615,275 L650,268 L680,285 L695,315 L688,345 L665,368 L635,375 L608,360 L600,330 L608,300 Z' },
  { id: 'NG', path: 'M555,360 L590,352 L620,368 L635,398 L625,432 L598,455 L565,462 L538,445 L530,412 L540,380 Z' },
  { id: 'ZA', path: 'M600,480 L640,470 L675,490 L695,525 L688,565 L660,595 L620,608 L585,598 L565,565 L572,525 Z' },
  // Middle East
  { id: 'SA', path: 'M680,290 L720,282 L755,302 L775,335 L768,372 L742,400 L705,412 L672,398 L658,362 L665,322 Z' },
  { id: 'AE', path: 'M745,325 L765,320 L782,332 L788,350 L780,368 L762,378 L745,372 L738,352 L742,335 Z' },
  // Other Asia
  { id: 'TH', path: 'M1175,305 L1195,298 L1210,312 L1215,335 L1205,358 L1185,372 L1162,368 L1152,345 L1158,322 L1170,308 Z' },
  { id: 'MY', path: 'M1185,360 L1210,355 L1232,368 L1240,390 L1230,415 L1208,432 L1182,428 L1168,405 L1175,380 Z' },
  { id: 'PH', path: 'M1268,335 L1285,330 L1298,345 L1302,368 L1292,392 L1275,405 L1255,400 L1248,375 L1255,352 Z' },
  // Oceania
  { id: 'AU', path: 'M1180,450 L1250,440 L1320,460 L1375,500 L1400,555 L1395,620 L1360,680 L1305,720 L1240,735 L1180,720 L1135,680 L1115,625 L1125,565 L1155,505 Z' },
  { id: 'NZ', path: 'M1395,620 L1415,615 L1432,630 L1438,655 L1428,680 L1410,695 L1388,690 L1378,668 L1382,642 Z M1405,695 L1425,690 L1440,708 L1442,732 L1428,752 L1408,758 L1392,745 L1390,720 L1400,700 Z' },
];

const WorldMap = () => {
  const [hoveredCountry, setHoveredCountry] = useState<Country | null>(null);

  const getIntensityColor = (students: number) => {
    const maxStudents = 85;
    const intensity = students / maxStudents;
    if (intensity > 0.6) return 'hsl(25 85% 50%)';
    if (intensity > 0.3) return 'hsl(35 80% 55%)';
    return 'hsl(40 70% 60%)';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1 }}
      className="relative w-full"
    >
      <div className="relative w-full aspect-[2/1] overflow-hidden rounded-lg bg-gradient-to-b from-secondary/20 to-secondary/40">
        <svg
          viewBox="0 0 1500 700"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 14% 92%)" />
              <stop offset="100%" stopColor="hsl(220 14% 88%)" />
            </linearGradient>
            
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 14% 82%)" />
              <stop offset="100%" stopColor="hsl(220 14% 78%)" />
            </linearGradient>

            {/* Glow filter for highlighted countries */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur"/>
              <feComposite in="SourceGraphic" in2="blur" operator="over"/>
            </filter>

            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.2"/>
            </filter>
          </defs>

          {/* Ocean background */}
          <rect width="1500" height="700" fill="url(#bgGradient)" />

          {/* Grid lines for elegant effect */}
          {[...Array(7)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i + 1) * 100}
              x2="1500"
              y2={(i + 1) * 100}
              stroke="hsl(220 13% 85%)"
              strokeWidth="0.5"
              strokeDasharray="8,16"
              opacity="0.4"
            />
          ))}
          {[...Array(15)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(i + 1) * 100}
              y1="0"
              x2={(i + 1) * 100}
              y2="700"
              stroke="hsl(220 13% 85%)"
              strokeWidth="0.5"
              strokeDasharray="8,16"
              opacity="0.4"
            />
          ))}

          {/* Background countries (no student data) */}
          {backgroundCountries.map((country) => (
            <path
              key={country.id}
              d={country.path}
              fill="url(#landGradient)"
              stroke="hsl(220 13% 72%)"
              strokeWidth="0.8"
              className="transition-all duration-300"
            />
          ))}

          {/* Countries with student data */}
          {countries.map((country) => (
            <motion.path
              key={country.id}
              d={country.path}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              fill={getIntensityColor(country.students)}
              stroke="hsl(25 70% 40%)"
              strokeWidth="1"
              filter={hoveredCountry?.id === country.id ? "url(#glow)" : "url(#shadow)"}
              className="cursor-pointer transition-all duration-300"
              style={{
                transform: hoveredCountry?.id === country.id ? 'scale(1.02)' : 'scale(1)',
                transformOrigin: 'center',
              }}
              onMouseEnter={() => setHoveredCountry(country)}
              onMouseLeave={() => setHoveredCountry(null)}
            />
          ))}

          {/* Student count labels on countries */}
          {countries.map((country) => {
            // Calculate center of path (simplified)
            const pathMatch = country.path.match(/M(\d+),(\d+)/);
            if (!pathMatch) return null;
            const x = parseInt(pathMatch[1]) + 15;
            const y = parseInt(pathMatch[2]) + 20;
            
            return (
              <motion.g
                key={`label-${country.id}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <circle
                  cx={x}
                  cy={y}
                  r={Math.max(12, Math.sqrt(country.students) * 3)}
                  fill="hsl(25 85% 45%)"
                  stroke="white"
                  strokeWidth="2"
                  className="drop-shadow-lg"
                />
                <text
                  x={x}
                  y={y + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="white"
                  fontSize={country.students > 50 ? "11" : "9"}
                  fontWeight="600"
                >
                  {country.students}
                </text>
              </motion.g>
            );
          })}
        </svg>

        {/* Tooltip */}
        {hoveredCountry && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-6 left-1/2 -translate-x-1/2 px-5 py-3 bg-foreground text-background rounded-lg shadow-xl z-20"
          >
            <div className="font-semibold text-base">{hoveredCountry.name}</div>
            <div className="text-background/70 text-sm mt-0.5">{hoveredCountry.students} students</div>
          </motion.div>
        )}

        {/* Legend */}
        <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-sm px-5 py-3 rounded-lg border border-border shadow-md">
          <div className="text-xs font-medium text-foreground mb-2">Student Distribution</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(25 85% 50%)' }} />
              <span className="text-xs text-muted-foreground">50+</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(35 80% 55%)' }} />
              <span className="text-xs text-muted-foreground">20-50</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: 'hsl(40 70% 60%)' }} />
              <span className="text-xs text-muted-foreground">1-20</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;

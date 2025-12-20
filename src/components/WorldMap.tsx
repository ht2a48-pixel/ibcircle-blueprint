import { useState } from 'react';
import { motion } from 'framer-motion';

interface Country {
  name: string;
  x: number;
  y: number;
  students: number;
  intensity: number;
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
      <div className="relative w-full aspect-[2/1] overflow-hidden rounded-lg">
        {/* Real detailed world map SVG */}
        <svg
          viewBox="0 0 2000 1000"
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(220 14% 82%)" />
              <stop offset="100%" stopColor="hsl(220 14% 78%)" />
            </linearGradient>
            
            <radialGradient id="heatHigh" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 91% 60%)" stopOpacity="0.9" />
              <stop offset="30%" stopColor="hsl(25 85% 55%)" stopOpacity="0.6" />
              <stop offset="60%" stopColor="hsl(15 80% 50%)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="hsl(5 70% 45%)" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="heatMedium" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 80% 60%)" stopOpacity="0.7" />
              <stop offset="50%" stopColor="hsl(30 70% 55%)" stopOpacity="0.35" />
              <stop offset="100%" stopColor="hsl(25 60% 50%)" stopOpacity="0" />
            </radialGradient>
            
            <radialGradient id="heatLow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="hsl(35 60% 65%)" stopOpacity="0.5" />
              <stop offset="60%" stopColor="hsl(35 50% 60%)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="hsl(35 40% 55%)" stopOpacity="0" />
            </radialGradient>

            <filter id="softGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="12" result="blur"/>
              <feMerge>
                <feMergeNode in="blur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background */}
          <rect width="2000" height="1000" fill="hsl(220 14% 96%)" />

          {/* Detailed World Map Paths */}
          {/* North America */}
          <path
            d="M158 190 L175 184 L192 179 L213 175 L237 172 L265 170 L294 169 L323 170 L350 173 L375 178 L397 186 L416 197 L432 212 L445 230 L453 251 L457 274 L455 298 L448 321 L435 342 L417 361 L394 377 L367 389 L337 397 L305 401 L273 400 L242 394 L214 383 L190 367 L171 347 L158 323 L151 297 L150 270 L153 244 L158 219 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Canada detail */}
          <path
            d="M220 120 L260 115 L300 112 L340 115 L380 122 L415 133 L445 150 L468 172 L475 195 L470 218 L455 235 L432 245 L405 248 L375 245 L345 238 L318 228 L295 215 L275 198 L260 178 L248 158 L238 138 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Alaska */}
          <path
            d="M95 145 L120 138 L145 135 L165 140 L178 152 L182 170 L175 188 L160 200 L140 205 L118 200 L100 188 L92 170 L93 155 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Mexico & Central America */}
          <path
            d="M210 395 L245 392 L275 398 L300 412 L318 432 L328 458 L330 485 L322 510 L305 530 L282 545 L255 555 L228 558 L205 552 L188 538 L180 518 L182 495 L192 472 L205 450 L210 425 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* South America */}
          <path
            d="M340 545 L380 535 L420 540 L455 558 L482 585 L500 620 L508 660 L505 705 L492 750 L468 790 L435 825 L395 855 L350 875 L305 880 L268 870 L242 848 L228 818 L225 782 L235 745 L255 708 L280 672 L305 640 L325 608 L335 575 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* South America detail (Argentina/Chile) */}
          <path
            d="M305 820 L325 815 L345 825 L358 848 L362 875 L355 905 L338 932 L312 955 L282 965 L255 958 L238 938 L232 912 L240 885 L258 858 L280 838 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Europe */}
          <path
            d="M875 180 L910 172 L945 168 L980 170 L1012 178 L1040 192 L1062 212 L1075 238 L1078 268 L1072 298 L1058 325 L1035 348 L1005 365 L970 375 L932 378 L895 373 L862 360 L835 340 L818 315 L808 285 L808 255 L818 225 L838 200 L860 182 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Scandinavia */}
          <path
            d="M920 95 L945 88 L972 85 L998 90 L1020 102 L1035 120 L1042 142 L1040 165 L1030 185 L1012 200 L988 210 L962 215 L935 212 L912 202 L895 185 L885 162 L885 138 L895 115 L910 98 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* UK & Ireland */}
          <path
            d="M845 195 L862 188 L878 192 L888 205 L890 222 L882 238 L868 248 L850 250 L835 242 L828 225 L830 208 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          <path
            d="M815 210 L828 205 L838 212 L840 225 L832 238 L818 242 L805 235 L802 220 L808 210 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Africa */}
          <path
            d="M895 390 L945 378 L998 385 L1048 405 L1090 438 L1122 482 L1142 535 L1150 595 L1145 658 L1128 718 L1098 772 L1058 818 L1008 855 L952 880 L892 892 L832 888 L778 868 L735 835 L708 792 L695 742 L698 688 L715 635 L745 585 L785 542 L832 505 L875 475 L895 445 L895 415 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Madagascar */}
          <path
            d="M1165 695 L1180 688 L1195 695 L1205 715 L1208 740 L1202 765 L1188 785 L1168 795 L1150 788 L1142 768 L1145 745 L1155 720 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Middle East */}
          <path
            d="M1080 340 L1120 335 L1158 345 L1190 368 L1212 400 L1222 438 L1218 478 L1200 512 L1172 538 L1135 555 L1095 558 L1058 548 L1028 525 L1010 495 L1008 458 L1022 422 L1048 392 L1080 365 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Russia/Central Asia */}
          <path
            d="M1050 95 L1150 85 L1250 80 L1350 82 L1445 92 L1535 110 L1615 138 L1685 175 L1738 220 L1775 272 L1792 328 L1790 385 L1770 438 L1735 485 L1688 522 L1632 548 L1570 562 L1505 565 L1440 558 L1378 542 L1320 518 L1268 488 L1225 452 L1192 412 L1170 368 L1158 322 L1155 275 L1162 230 L1178 188 L1202 152 L1235 122 L1275 100 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* India */}
          <path
            d="M1235 420 L1275 412 L1315 418 L1350 438 L1378 468 L1395 505 L1400 548 L1392 592 L1372 630 L1342 662 L1305 685 L1262 698 L1220 700 L1182 688 L1152 665 L1135 632 L1132 595 L1145 558 L1172 525 L1205 498 L1230 470 L1240 445 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Sri Lanka */}
          <path
            d="M1295 698 L1308 695 L1318 705 L1322 720 L1315 735 L1302 742 L1288 738 L1282 722 L1285 708 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Southeast Asia */}
          <path
            d="M1420 520 L1455 512 L1490 518 L1520 535 L1542 560 L1555 592 L1558 628 L1550 662 L1532 692 L1505 715 L1472 730 L1435 735 L1400 728 L1370 710 L1350 685 L1342 652 L1348 618 L1368 588 L1395 562 L1420 542 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Vietnam */}
          <path
            d="M1480 490 L1495 485 L1510 495 L1518 515 L1520 540 L1515 568 L1502 592 L1485 608 L1465 615 L1448 605 L1442 585 L1448 560 L1462 535 L1475 510 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* China */}
          <path
            d="M1350 280 L1420 268 L1490 272 L1555 290 L1612 322 L1658 365 L1690 418 L1705 475 L1702 532 L1682 585 L1648 628 L1602 662 L1548 685 L1490 695 L1432 692 L1378 678 L1332 652 L1295 618 L1272 575 L1262 528 L1268 480 L1288 435 L1318 395 L1355 362 L1385 335 L1380 305 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Korea */}
          <path
            d="M1620 340 L1638 335 L1655 345 L1665 365 L1668 390 L1662 415 L1648 438 L1628 452 L1608 455 L1592 445 L1582 425 L1582 400 L1592 375 L1608 355 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Japan */}
          <path
            d="M1710 305 L1728 298 L1745 305 L1758 322 L1765 345 L1762 372 L1750 398 L1730 418 L1705 428 L1682 425 L1665 412 L1658 390 L1662 365 L1678 342 L1698 320 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Japan (Hokkaido) */}
          <path
            d="M1728 275 L1742 270 L1755 278 L1762 295 L1758 315 L1745 328 L1728 332 L1712 325 L1705 308 L1712 290 L1722 278 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Taiwan */}
          <path
            d="M1618 485 L1632 480 L1645 490 L1650 508 L1645 528 L1632 542 L1615 545 L1602 535 L1598 515 L1605 498 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Philippines */}
          <path
            d="M1595 545 L1612 538 L1628 548 L1638 570 L1640 598 L1632 625 L1615 648 L1592 660 L1570 655 L1558 635 L1558 608 L1568 580 L1585 558 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Indonesia */}
          <path
            d="M1420 665 L1470 658 L1520 668 L1565 692 L1600 728 L1622 772 L1628 820 L1618 865 L1592 905 L1555 938 L1508 958 L1458 965 L1408 955 L1365 932 L1332 898 L1315 858 L1318 815 L1338 775 L1372 740 L1412 712 L1420 688 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Sumatra */}
          <path
            d="M1372 645 L1395 638 L1418 648 L1432 672 L1435 702 L1425 732 L1405 755 L1378 765 L1352 758 L1338 735 L1338 705 L1350 678 L1365 658 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Borneo */}
          <path
            d="M1468 628 L1498 622 L1528 632 L1552 655 L1565 688 L1565 725 L1552 758 L1528 782 L1498 792 L1468 788 L1445 772 L1432 745 L1432 712 L1445 680 L1462 652 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Australia */}
          <path
            d="M1545 755 L1620 740 L1698 752 L1768 782 L1828 828 L1872 888 L1895 958 L1895 1032 L1872 1102 L1828 1162 L1768 1208 L1698 1238 L1620 1248 L1545 1238 L1478 1210 L1422 1168 L1382 1112 L1362 1048 L1365 982 L1388 920 L1428 865 L1482 820 L1540 788 L1552 768 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* Tasmania */}
          <path
            d="M1612 985 L1632 980 L1652 990 L1665 1010 L1665 1035 L1652 1055 L1632 1065 L1608 1062 L1592 1045 L1592 1022 L1602 1000 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          {/* New Zealand */}
          <path
            d="M1878 918 L1895 912 L1912 922 L1922 945 L1922 972 L1912 998 L1895 1015 L1872 1022 L1852 1012 L1845 988 L1852 962 L1868 938 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />
          <path
            d="M1852 1035 L1872 1028 L1892 1042 L1902 1068 L1898 1098 L1882 1122 L1858 1135 L1832 1130 L1818 1108 L1818 1080 L1832 1055 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Greenland */}
          <path
            d="M550 55 L605 45 L662 50 L712 68 L752 98 L778 138 L788 182 L782 228 L762 268 L728 302 L688 325 L642 338 L595 340 L550 328 L512 305 L485 272 L472 232 L478 190 L498 152 L528 120 L558 95 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Iceland */}
          <path
            d="M762 142 L782 135 L802 142 L815 158 L818 180 L808 200 L792 212 L770 215 L752 205 L745 185 L750 165 L758 150 Z"
            fill="url(#landGradient)"
            stroke="hsl(220 13% 70%)"
            strokeWidth="0.8"
          />

          {/* Subtle grid lines */}
          {[...Array(9)].map((_, i) => (
            <line
              key={`h-${i}`}
              x1="0"
              y1={(i + 1) * 100}
              x2="2000"
              y2={(i + 1) * 100}
              stroke="hsl(220 13% 88%)"
              strokeWidth="0.4"
              strokeDasharray="6,12"
              opacity="0.3"
            />
          ))}
          {[...Array(19)].map((_, i) => (
            <line
              key={`v-${i}`}
              x1={(i + 1) * 100}
              y1="0"
              x2={(i + 1) * 100}
              y2="1000"
              stroke="hsl(220 13% 88%)"
              strokeWidth="0.4"
              strokeDasharray="6,12"
              opacity="0.3"
            />
          ))}

          {/* Heatmap overlay circles */}
          {studentCountries.map((country, index) => {
            const size = 80 + country.intensity * 140;
            const gradientId = country.intensity > 0.6 ? 'heatHigh' : country.intensity > 0.3 ? 'heatMedium' : 'heatLow';
            return (
              <motion.ellipse
                key={`heat-${country.name}`}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 + index * 0.05 }}
                cx={country.x * 20}
                cy={country.y * 10}
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
              animate={{ scale: [1, 2, 1], opacity: [0.5, 0.1, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute rounded-full bg-warm"
              style={{
                width: 28 + country.intensity * 28,
                height: 28 + country.intensity * 28,
                left: -(14 + country.intensity * 14),
                top: -(14 + country.intensity * 14),
              }}
            />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0.2, 0.7] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              className="absolute rounded-full bg-warm"
              style={{
                width: 18 + country.intensity * 18,
                height: 18 + country.intensity * 18,
                left: -(9 + country.intensity * 9),
                top: -(9 + country.intensity * 9),
              }}
            />
            
            {/* Center glowing dot */}
            <div 
              className="relative rounded-full shadow-lg border-2 border-background transition-transform duration-200 hover:scale-150"
              style={{
                width: 10 + country.intensity * 10,
                height: 10 + country.intensity * 10,
                background: `linear-gradient(135deg, hsl(35 91% 65%), hsl(25 85% 50%))`,
                boxShadow: '0 0 24px hsl(35 91% 60% / 0.7)',
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
        <div className="absolute bottom-6 right-6 bg-background/95 backdrop-blur-sm px-5 py-3 rounded-lg border border-border shadow-md">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-warm shadow-sm" style={{ boxShadow: '0 0 8px hsl(35 91% 60% / 0.5)' }} />
              <span className="text-xs text-muted-foreground font-medium">Student Location</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-1.5">
              <div className="w-10 h-2.5 rounded-full bg-gradient-to-r from-warm/30 via-warm/60 to-warm" />
              <span className="text-xs text-muted-foreground">Concentration</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default WorldMap;
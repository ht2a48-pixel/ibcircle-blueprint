import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import universityLogosGrid from '@/assets/university-logos-grid.png';

interface University {
  name: string;
  shortName: string;
  country: string;
  // Position in the logo grid (row, col) - 0-indexed
  logoPosition: { row: number; col: number };
}

const universities: University[] = [
  // USA - Ivy League & Top Schools (Row 0-1)
  { name: 'Columbia University', shortName: 'Columbia', country: 'USA', logoPosition: { row: 0, col: 0 } },
  { name: 'University of Pennsylvania', shortName: 'UPenn', country: 'USA', logoPosition: { row: 0, col: 1 } },
  { name: 'Cornell University', shortName: 'Cornell', country: 'USA', logoPosition: { row: 0, col: 2 } },
  { name: 'University of Chicago', shortName: 'UChicago', country: 'USA', logoPosition: { row: 0, col: 3 } },
  { name: 'Northwestern University', shortName: 'Northwestern', country: 'USA', logoPosition: { row: 0, col: 4 } },
  { name: 'Johns Hopkins University', shortName: 'Johns Hopkins', country: 'USA', logoPosition: { row: 0, col: 5 } },
  { name: 'Georgetown University', shortName: 'Georgetown', country: 'USA', logoPosition: { row: 0, col: 6 } },
  { name: 'Vanderbilt University', shortName: 'Vanderbilt', country: 'USA', logoPosition: { row: 0, col: 7 } },
  { name: 'Carnegie Mellon University', shortName: 'CMU', country: 'USA', logoPosition: { row: 1, col: 0 } },
  { name: 'Emory University', shortName: 'Emory', country: 'USA', logoPosition: { row: 1, col: 1 } },
  { name: 'University of Southern California', shortName: 'USC', country: 'USA', logoPosition: { row: 1, col: 2 } },
  { name: 'New York University', shortName: 'NYU', country: 'USA', logoPosition: { row: 1, col: 3 } },
  { name: 'Georgia Institute of Technology', shortName: 'Georgia Tech', country: 'USA', logoPosition: { row: 1, col: 4 } },
  { name: 'University of Michigan', shortName: 'UMich', country: 'USA', logoPosition: { row: 1, col: 5 } },
  { name: 'UC Berkeley', shortName: 'Berkeley', country: 'USA', logoPosition: { row: 1, col: 6 } },
  { name: 'UCLA', shortName: 'UCLA', country: 'USA', logoPosition: { row: 1, col: 7 } },
  { name: 'UC San Diego', shortName: 'UCSD', country: 'USA', logoPosition: { row: 2, col: 0 } },
  { name: 'Northeastern University', shortName: 'Northeastern', country: 'USA', logoPosition: { row: 2, col: 1 } },
  // UK (Row 2)
  { name: 'University of Oxford', shortName: 'Oxford', country: 'UK', logoPosition: { row: 2, col: 2 } },
  { name: 'Imperial College London', shortName: 'Imperial', country: 'UK', logoPosition: { row: 2, col: 3 } },
  { name: 'University of Cambridge', shortName: 'Cambridge', country: 'UK', logoPosition: { row: 2, col: 4 } },
  { name: 'London School of Economics', shortName: 'LSE', country: 'UK', logoPosition: { row: 2, col: 5 } },
  { name: 'University College London', shortName: 'UCL', country: 'UK', logoPosition: { row: 2, col: 6 } },
  // Canada (Row 2-3)
  { name: 'University of Toronto', shortName: 'UofT', country: 'Canada', logoPosition: { row: 2, col: 7 } },
  { name: 'McGill University', shortName: 'McGill', country: 'Canada', logoPosition: { row: 3, col: 0 } },
  { name: 'University of British Columbia', shortName: 'UBC', country: 'Canada', logoPosition: { row: 3, col: 1 } },
  // Japan (Row 3)
  { name: 'University of Tokyo', shortName: 'UTokyo', country: 'Japan', logoPosition: { row: 3, col: 2 } },
  { name: 'Waseda University', shortName: 'Waseda', country: 'Japan', logoPosition: { row: 3, col: 3 } },
  { name: 'Keio University', shortName: 'Keio', country: 'Japan', logoPosition: { row: 3, col: 4 } },
  // Hong Kong (Row 3)
  { name: 'University of Hong Kong', shortName: 'HKU', country: 'Hong Kong', logoPosition: { row: 3, col: 5 } },
  { name: 'HKUST', shortName: 'HKUST', country: 'Hong Kong', logoPosition: { row: 3, col: 6 } },
  { name: 'Chinese University of Hong Kong', shortName: 'CUHK', country: 'Hong Kong', logoPosition: { row: 3, col: 7 } },
  // Singapore (Row 4)
  { name: 'National University of Singapore', shortName: 'NUS', country: 'Singapore', logoPosition: { row: 4, col: 0 } },
  { name: 'Nanyang Technological University', shortName: 'NTU', country: 'Singapore', logoPosition: { row: 4, col: 1 } },
  // Korea (Row 4)
  { name: 'Seoul National University', shortName: 'SNU', country: 'Korea', logoPosition: { row: 4, col: 2 } },
  { name: 'Korea University', shortName: 'Korea U', country: 'Korea', logoPosition: { row: 4, col: 3 } },
  { name: 'Yonsei University', shortName: 'Yonsei', country: 'Korea', logoPosition: { row: 4, col: 4 } },
  { name: 'Sungkyunkwan University', shortName: 'SKKU', country: 'Korea', logoPosition: { row: 4, col: 5 } },
  { name: 'KAIST', shortName: 'KAIST', country: 'Korea', logoPosition: { row: 4, col: 6 } },
];

const countries = ['All', 'USA', 'UK', 'Canada', 'Japan', 'Hong Kong', 'Singapore', 'Korea'];

// Logo grid dimensions
const GRID_COLS = 8;
const GRID_ROWS = 5;
const LOGO_SIZE = 128; // Size of each logo in the sprite

const UniversityWall = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');
  const scrollRef = useRef<HTMLDivElement>(null);

  const filteredUniversities = selectedCountry === 'All'
    ? universities
    : universities.filter(u => u.country === selectedCountry);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const getLogoStyle = (position: { row: number; col: number }) => {
    // Calculate position in the sprite sheet
    const x = (position.col / GRID_COLS) * 100;
    const y = (position.row / GRID_ROWS) * 100;
    
    return {
      backgroundImage: `url(${universityLogosGrid})`,
      backgroundSize: `${GRID_COLS * 100}% ${GRID_ROWS * 100}%`,
      backgroundPosition: `${x}% ${y}%`,
    };
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="section-title">Global Admissions Footprint</p>
          <h2 className="section-heading">전 세계 합격 현황</h2>
        </motion.div>

        {/* Country Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-5 py-2 text-sm font-medium transition-all duration-300 rounded-sm ${
                selectedCountry === country
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {country}
            </button>
          ))}
        </motion.div>

        {/* Horizontal Scrollable University Cards */}
        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition-colors -translate-x-4"
          >
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-lg flex items-center justify-center hover:bg-secondary transition-colors translate-x-4"
          >
            <ChevronRight className="w-5 h-5 text-foreground" />
          </button>

          {/* Scrollable Container */}
          <div
            ref={scrollRef}
            className="overflow-x-auto hide-scrollbar py-4"
          >
            <motion.div
              layout
              className="flex gap-5 px-4"
              style={{ minWidth: 'max-content' }}
            >
              <AnimatePresence mode="popLayout">
                {filteredUniversities.map((university, index) => (
                  <motion.div
                    key={university.name}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.02 }}
                    className="group relative flex-shrink-0"
                  >
                    <div className="w-36 h-44 bg-gradient-to-b from-background to-secondary/30 border border-border p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary/40 hover:shadow-lg cursor-pointer rounded-lg">
                      {/* University Logo from Sprite */}
                      <div 
                        className="w-16 h-16 mb-3 rounded-full bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                        style={getLogoStyle(university.logoPosition)}
                      />
                      <span className="text-xs font-semibold text-foreground line-clamp-1">
                        {university.shortName}
                      </span>
                      <span className="text-[10px] text-muted-foreground mt-1">
                        {university.country}
                      </span>
                    </div>
                    
                    {/* Hover tooltip with full name */}
                    <div className="absolute -top-14 left-1/2 -translate-x-1/2 px-4 py-2 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 shadow-xl">
                      {university.name}
                      <div className="text-[10px] text-background/60 mt-0.5">IBCircle Student Acceptance</div>
                      <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none" />
        </div>

        {/* University count */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-muted-foreground mt-8 text-sm"
        >
          {filteredUniversities.length}개 대학 합격
        </motion.p>
      </div>
    </section>
  );
};

export default UniversityWall;
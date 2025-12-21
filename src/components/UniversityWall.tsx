import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import all university logos
import columbiaLogo from '@/assets/logos/columbia.png';
import upennLogo from '@/assets/logos/upenn.png';
import cornellLogo from '@/assets/logos/cornell.png';
import uchicagoLogo from '@/assets/logos/uchicago.png';
import northwesternLogo from '@/assets/logos/northwestern.png';
import johnshopkinsLogo from '@/assets/logos/johnshopkins.png';
import cmuLogo from '@/assets/logos/cmu.png';
import nyuLogo from '@/assets/logos/nyu.png';
import umichLogo from '@/assets/logos/umich.png';
import berkeleyLogo from '@/assets/logos/berkeley.png';
import uclaLogo from '@/assets/logos/ucla.png';
import ucsdLogo from '@/assets/logos/ucsd.png';
import oxfordLogo from '@/assets/logos/oxford.png';
import cambridgeLogo from '@/assets/logos/cambridge.png';
import lseLogo from '@/assets/logos/lse.png';
import utorontoLogo from '@/assets/logos/utoronto.png';
import mcgillLogo from '@/assets/logos/mcgill.png';
import utokyoLogo from '@/assets/logos/utokyo.png';
import hkuLogo from '@/assets/logos/hku.png';
import nusLogo from '@/assets/logos/nus.png';
import ntuLogo from '@/assets/logos/ntu.png';
import snuLogo from '@/assets/logos/snu.png';
import kaistLogo from '@/assets/logos/kaist.png';

interface University {
  name: string;
  shortName: string;
  country: string;
  logo?: string;
}

const universities: University[] = [
  // USA
  { name: 'Columbia University', shortName: 'Columbia', country: 'USA', logo: columbiaLogo },
  { name: 'University of Pennsylvania', shortName: 'UPenn', country: 'USA', logo: upennLogo },
  { name: 'Cornell University', shortName: 'Cornell', country: 'USA', logo: cornellLogo },
  { name: 'University of Chicago', shortName: 'UChicago', country: 'USA', logo: uchicagoLogo },
  { name: 'Northwestern University', shortName: 'Northwestern', country: 'USA', logo: northwesternLogo },
  { name: 'Johns Hopkins University', shortName: 'Johns Hopkins', country: 'USA', logo: johnshopkinsLogo },
  { name: 'Georgetown University', shortName: 'Georgetown', country: 'USA' },
  { name: 'Vanderbilt University', shortName: 'Vanderbilt', country: 'USA' },
  { name: 'Carnegie Mellon University', shortName: 'CMU', country: 'USA', logo: cmuLogo },
  { name: 'New York University', shortName: 'NYU', country: 'USA', logo: nyuLogo },
  { name: 'Emory University', shortName: 'Emory', country: 'USA' },
  { name: 'University of Southern California', shortName: 'USC', country: 'USA' },
  { name: 'Georgia Tech', shortName: 'Georgia Tech', country: 'USA' },
  { name: 'University of Michigan', shortName: 'UMich', country: 'USA', logo: umichLogo },
  { name: 'UC Berkeley', shortName: 'Berkeley', country: 'USA', logo: berkeleyLogo },
  { name: 'UCLA', shortName: 'UCLA', country: 'USA', logo: uclaLogo },
  { name: 'UC San Diego', shortName: 'UCSD', country: 'USA', logo: ucsdLogo },
  { name: 'Northeastern University', shortName: 'Northeastern', country: 'USA' },
  // UK
  { name: 'University of Oxford', shortName: 'Oxford', country: 'UK', logo: oxfordLogo },
  { name: 'University of Cambridge', shortName: 'Cambridge', country: 'UK', logo: cambridgeLogo },
  { name: 'Imperial College London', shortName: 'Imperial', country: 'UK' },
  { name: 'University College London', shortName: 'UCL', country: 'UK' },
  { name: 'London School of Economics', shortName: 'LSE', country: 'UK', logo: lseLogo },
  // Canada
  { name: 'University of Toronto', shortName: 'UofT', country: 'Canada', logo: utorontoLogo },
  { name: 'McGill University', shortName: 'McGill', country: 'Canada', logo: mcgillLogo },
  { name: 'University of British Columbia', shortName: 'UBC', country: 'Canada' },
  // Japan
  { name: 'University of Tokyo', shortName: 'UTokyo', country: 'Japan', logo: utokyoLogo },
  { name: 'Waseda University', shortName: 'Waseda', country: 'Japan' },
  { name: 'Keio University', shortName: 'Keio', country: 'Japan' },
  // Hong Kong
  { name: 'University of Hong Kong', shortName: 'HKU', country: 'Hong Kong', logo: hkuLogo },
  { name: 'HKUST', shortName: 'HKUST', country: 'Hong Kong' },
  { name: 'Chinese University of Hong Kong', shortName: 'CUHK', country: 'Hong Kong' },
  // Singapore
  { name: 'National University of Singapore', shortName: 'NUS', country: 'Singapore', logo: nusLogo },
  { name: 'Nanyang Technological University', shortName: 'NTU', country: 'Singapore', logo: ntuLogo },
  // Korea
  { name: 'Seoul National University', shortName: 'SNU', country: 'Korea', logo: snuLogo },
  { name: 'KAIST', shortName: 'KAIST', country: 'Korea', logo: kaistLogo },
  { name: 'Yonsei University', shortName: 'Yonsei', country: 'Korea' },
  { name: 'Korea University', shortName: 'Korea U', country: 'Korea' },
  { name: 'Sungkyunkwan University', shortName: 'SKKU', country: 'Korea' },
];

const countries = ['All', 'USA', 'UK', 'Canada', 'Japan', 'Hong Kong', 'Singapore', 'Korea'];

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
                    <div className="w-40 h-48 bg-white border border-border p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary/40 hover:shadow-xl cursor-pointer rounded-lg">
                      {/* University Logo or Name Fallback */}
                      <div className="w-20 h-20 mb-3 flex items-center justify-center">
                        {university.logo ? (
                          <img 
                            src={university.logo} 
                            alt={`${university.name} logo`}
                            className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <span className="text-lg font-bold text-primary text-center leading-tight">
                            {university.shortName}
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-foreground line-clamp-2 text-center leading-tight">
                        {university.name}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-1">
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
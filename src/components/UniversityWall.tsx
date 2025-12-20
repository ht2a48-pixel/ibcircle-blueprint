import { useState } from 'react';
import { motion } from 'framer-motion';

interface University {
  name: string;
  country: string;
  flag: string;
}

const universities: University[] = [
  // USA
  { name: 'Columbia University', country: 'USA', flag: '🇺🇸' },
  { name: 'University of Pennsylvania', country: 'USA', flag: '🇺🇸' },
  { name: 'Cornell University', country: 'USA', flag: '🇺🇸' },
  { name: 'University of Chicago', country: 'USA', flag: '🇺🇸' },
  { name: 'Northwestern University', country: 'USA', flag: '🇺🇸' },
  { name: 'Johns Hopkins University', country: 'USA', flag: '🇺🇸' },
  { name: 'Georgetown University', country: 'USA', flag: '🇺🇸' },
  { name: 'Vanderbilt University', country: 'USA', flag: '🇺🇸' },
  { name: 'Carnegie Mellon University', country: 'USA', flag: '🇺🇸' },
  { name: 'Emory University', country: 'USA', flag: '🇺🇸' },
  { name: 'University of Southern California', country: 'USA', flag: '🇺🇸' },
  { name: 'New York University', country: 'USA', flag: '🇺🇸' },
  { name: 'Georgia Institute of Technology', country: 'USA', flag: '🇺🇸' },
  { name: 'University of Michigan', country: 'USA', flag: '🇺🇸' },
  { name: 'UC Berkeley', country: 'USA', flag: '🇺🇸' },
  { name: 'UCLA', country: 'USA', flag: '🇺🇸' },
  { name: 'UC San Diego', country: 'USA', flag: '🇺🇸' },
  { name: 'Northeastern University', country: 'USA', flag: '🇺🇸' },
  // UK
  { name: 'University of Oxford', country: 'UK', flag: '🇬🇧' },
  { name: 'Imperial College London', country: 'UK', flag: '🇬🇧' },
  // Canada
  { name: 'University of Toronto', country: 'Canada', flag: '🇨🇦' },
  // Japan
  { name: 'University of Tokyo', country: 'Japan', flag: '🇯🇵' },
  { name: 'Waseda University', country: 'Japan', flag: '🇯🇵' },
  // Hong Kong
  { name: 'University of Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { name: 'HKUST', country: 'Hong Kong', flag: '🇭🇰' },
  // Singapore
  { name: 'National University of Singapore', country: 'Singapore', flag: '🇸🇬' },
  { name: 'Nanyang Technological University', country: 'Singapore', flag: '🇸🇬' },
  // Korea
  { name: 'Seoul National University', country: 'Korea', flag: '🇰🇷' },
  { name: 'Korea University', country: 'Korea', flag: '🇰🇷' },
  { name: 'Yonsei University', country: 'Korea', flag: '🇰🇷' },
  { name: 'Sungkyunkwan University', country: 'Korea', flag: '🇰🇷' },
];

const countries = ['All', 'USA', 'UK', 'Canada', 'Japan', 'Hong Kong', 'Singapore', 'Korea'];

const UniversityWall = () => {
  const [selectedCountry, setSelectedCountry] = useState('All');

  const filteredUniversities = selectedCountry === 'All'
    ? universities
    : universities.filter(u => u.country === selectedCountry);

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
          <p className="section-title">Global University Acceptances</p>
          <h2 className="section-heading">전 세계 명문대 합격 현황</h2>
        </motion.div>

        {/* Country Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {countries.map((country) => (
            <button
              key={country}
              onClick={() => setSelectedCountry(country)}
              className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                selectedCountry === country
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-accent'
              }`}
            >
              {country}
            </button>
          ))}
        </motion.div>

        {/* University Grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          {filteredUniversities.map((university, index) => (
            <motion.div
              key={university.name}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.02 }}
              className="group relative"
            >
              <div className="aspect-square bg-secondary/50 border border-border p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-secondary hover:shadow-card cursor-pointer">
                <span className="text-2xl mb-2 grayscale group-hover:grayscale-0 transition-all duration-300">
                  {university.flag}
                </span>
                <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-2">
                  {university.name}
                </span>
              </div>
              
              {/* Hover tooltip */}
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                IBCircle Student Acceptance
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityWall;

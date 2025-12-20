import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface University {
  name: string;
  country: string;
  flag: string;
  logo: string;
}

const universities: University[] = [
  // USA
  { name: 'Columbia University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Columbia_coat_of_arms_no_crest.svg/800px-Columbia_coat_of_arms_no_crest.svg.png' },
  { name: 'University of Pennsylvania', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/UPenn_shield_with_banner.svg/800px-UPenn_shield_with_banner.svg.png' },
  { name: 'Cornell University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Cornell_University_seal.svg/800px-Cornell_University_seal.svg.png' },
  { name: 'University of Chicago', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/University_of_Chicago_Coat_of_arms.svg/800px-University_of_Chicago_Coat_of_arms.svg.png' },
  { name: 'Northwestern University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Northwestern_University_seal.svg/800px-Northwestern_University_seal.svg.png' },
  { name: 'Johns Hopkins University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Formal_Seal_of_Johns_Hopkins_University.svg/800px-Formal_Seal_of_Johns_Hopkins_University.svg.png' },
  { name: 'Georgetown University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Georgetown_University_Seal.svg/800px-Georgetown_University_Seal.svg.png' },
  { name: 'Vanderbilt University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/Vanderbilt_University_seal.svg/800px-Vanderbilt_University_seal.svg.png' },
  { name: 'Carnegie Mellon University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Carnegie_Mellon_wordmark.svg/800px-Carnegie_Mellon_wordmark.svg.png' },
  { name: 'Emory University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Emory_University_Seal.svg/800px-Emory_University_Seal.svg.png' },
  { name: 'University of Southern California', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Seal_of_the_University_of_Southern_California.svg/800px-Seal_of_the_University_of_Southern_California.svg.png' },
  { name: 'New York University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/New_York_University_Seal.svg/800px-New_York_University_Seal.svg.png' },
  { name: 'Georgia Institute of Technology', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Georgia_Tech_seal.svg/800px-Georgia_Tech_seal.svg.png' },
  { name: 'University of Michigan', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Seal_of_the_University_of_Michigan.svg/800px-Seal_of_the_University_of_Michigan.svg.png' },
  { name: 'UC Berkeley', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Seal_of_University_of_California%2C_Berkeley.svg/800px-Seal_of_University_of_California%2C_Berkeley.svg.png' },
  { name: 'UCLA', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/The_University_of_California_UCLA.svg/800px-The_University_of_California_UCLA.svg.png' },
  { name: 'UC San Diego', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Seal_of_the_University_of_California%2C_San_Diego.svg/800px-Seal_of_the_University_of_California%2C_San_Diego.svg.png' },
  { name: 'Northeastern University', country: 'USA', flag: '🇺🇸', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Northeastern_University_seal.svg/800px-Northeastern_University_seal.svg.png' },
  // UK
  { name: 'University of Oxford', country: 'UK', flag: '🇬🇧', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/ff/Oxford-University-Circlet.svg/800px-Oxford-University-Circlet.svg.png' },
  { name: 'Imperial College London', country: 'UK', flag: '🇬🇧', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Imperial_College_London_crest.svg/800px-Imperial_College_London_crest.svg.png' },
  // Canada
  { name: 'University of Toronto', country: 'Canada', flag: '🇨🇦', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Utoronto_coa.svg/800px-Utoronto_coa.svg.png' },
  // Japan
  { name: 'University of Tokyo', country: 'Japan', flag: '🇯🇵', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/University_of_Tokyo_seal.svg/800px-University_of_Tokyo_seal.svg.png' },
  { name: 'Waseda University', country: 'Japan', flag: '🇯🇵', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/Waseda_University_Logo.svg/800px-Waseda_University_Logo.svg.png' },
  // Hong Kong
  { name: 'University of Hong Kong', country: 'Hong Kong', flag: '🇭🇰', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/University_of_Hong_Kong_Coat_of_Arms.svg/800px-University_of_Hong_Kong_Coat_of_Arms.svg.png' },
  { name: 'HKUST', country: 'Hong Kong', flag: '🇭🇰', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f9/HKUST_Logo.svg/800px-HKUST_Logo.svg.png' },
  // Singapore
  { name: 'National University of Singapore', country: 'Singapore', flag: '🇸🇬', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b1/National_University_of_Singapore_coat_of_arms.svg/800px-National_University_of_Singapore_coat_of_arms.svg.png' },
  { name: 'Nanyang Technological University', country: 'Singapore', flag: '🇸🇬', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/04/Nanyang_Technological_University_seal.svg/800px-Nanyang_Technological_University_seal.svg.png' },
  // Korea
  { name: 'Seoul National University', country: 'Korea', flag: '🇰🇷', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/Seoul_National_University_emblem.svg/800px-Seoul_National_University_emblem.svg.png' },
  { name: 'Korea University', country: 'Korea', flag: '🇰🇷', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Korea_University_Global_Symbol.svg/800px-Korea_University_Global_Symbol.svg.png' },
  { name: 'Yonsei University', country: 'Korea', flag: '🇰🇷', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Yonsei_University_Seal.svg/800px-Yonsei_University_Seal.svg.png' },
  { name: 'Sungkyunkwan University', country: 'Korea', flag: '🇰🇷', logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6e/Sungkyunkwan_University_seal.svg/800px-Sungkyunkwan_University_seal.svg.png' },
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

        {/* University Grid with Logos */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredUniversities.map((university) => (
              <motion.div
                key={university.name}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="group relative"
              >
                <div className="aspect-square bg-secondary/50 border border-border p-4 flex flex-col items-center justify-center text-center transition-all duration-300 hover:bg-secondary hover:shadow-lg cursor-pointer">
                  {/* University Logo */}
                  <div className="w-16 h-16 mb-3 flex items-center justify-center">
                    <img
                      src={university.logo}
                      alt={`${university.name} logo`}
                      className="w-full h-full object-contain grayscale group-hover:grayscale-0 transition-all duration-300"
                      onError={(e) => {
                        // Fallback to flag if logo fails to load
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                    <span className="text-3xl hidden">{university.flag}</span>
                  </div>
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
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};

export default UniversityWall;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, CalendarHeart, Shirt, Mic2, MapPin, BedDouble } from 'lucide-react';

const sections = [
  { id: 'hero', label: 'Home', icon: Home },
  { id: 'timeline', label: 'Events', icon: CalendarHeart },
  { id: 'wardrobe', label: 'Wardrobe', icon: Shirt },
  { id: 'signup', label: 'Perform', icon: Mic2 },
  { id: 'venue', label: 'Venue', icon: MapPin },
  { id: 'rooms', label: 'Rooms', icon: BedDouble },
];

const PageNavigator = () => {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      let currentSection = sections[0].id;
      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          currentSection = section.id;
        }
      }
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const NavContent = ({ isMobile }) => (
    <ul className={`flex ${isMobile ? 'flex-row' : 'flex-col'} items-center gap-1 md:gap-2`}>
      {sections.map((section) => {
        const Icon = section.icon;
        const isActive = activeSection === section.id;
        
        return (
          <li key={section.id}>
            <button
              onClick={() => scrollToSection(section.id)}
              className={`relative flex items-center justify-center p-2.5 md:p-3 rounded-full transition-all duration-300 group
                ${isActive ? 'text-maroon-950' : 'text-gold-500 hover:text-gold-300 hover:bg-gold-500/10'}`}
              aria-label={section.label}
              title={isMobile ? undefined : section.label}
            >
              {isActive && (
                <motion.div
                  layoutId={isMobile ? "activeNavMobile" : "activeNavDesktop"}
                  className="absolute inset-0 bg-gold-500 rounded-full shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon className={`w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
              
              {!isMobile && (
                <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-maroon-950 text-gold-500 text-[10px] uppercase tracking-widest rounded border border-gold-500/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
                  {section.label}
                </span>
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );

  return (
    <>
      {/* Mobile Wrapper */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center pointer-events-none z-50 md:hidden">
        <motion.div 
          className="p-2 rounded-full bg-maroon-950/80 backdrop-blur-md border border-gold-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pointer-events-auto max-w-[95vw] overflow-x-auto hide-scrollbar"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <NavContent isMobile={true} />
        </motion.div>
      </div>

      {/* Desktop Wrapper */}
      <div className="fixed right-6 inset-y-0 flex-col justify-center pointer-events-none z-50 hidden md:flex">
        <motion.div 
          className="p-2 rounded-full bg-maroon-950/80 backdrop-blur-md border border-gold-500/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] pointer-events-auto"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          <NavContent isMobile={false} />
        </motion.div>
      </div>
    </>
  );
};

export default PageNavigator;

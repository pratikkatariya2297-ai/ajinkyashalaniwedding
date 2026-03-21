import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import { getBackgroundMusic } from '../utils/audio';
import ClickSparkles from './ui/ClickSparkles';

const Loader = ({ onComplete }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [progress, setProgress] = useState(0);
  const duration = 8000; // Engaging 8-second load

  const messages = [
    "Preparing the celebrations 🌺",
    "Arranging the fresh flowers 🌸",
    "Lighting the golden lamps 🪔",
    "Tuning the instruments 🎶",
    "Rolling the red carpet ✨",
  ];
  const messageIndex = Math.min(Math.floor((progress / 100) * messages.length), messages.length - 1);
  const currentMessage = messages[messageIndex];

  useEffect(() => {
    if (!hasStarted) return; // Wait for user interaction to satisfy browser autoplay policies

    // Music will comfortably play because of the 'Open Invitation' user click
    const audio = getBackgroundMusic();
    if (audio) {
      audio.play().catch(e => console.log('Autoplay blocked on mount:', e));
    }

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(Math.floor(currentProgress));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete(); // Triggers transition to RSVP after tiny delay
        }, 500);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [hasStarted, onComplete]);

  // Generate deterministic embers once so they don't jump during progress re-renders
  const embers = React.useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      width: Math.random() * 4 + 2 + 'px',
      height: Math.random() * 4 + 2 + 'px',
      left: Math.random() * 100 + '%',
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      drift: (Math.random() - 0.5) * 150,
      maxOpacity: Math.random() * 0.5 + 0.3
    }));
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-[#2a0815] via-maroon-950 to-black overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.5, delay: 0.2 } }}
    >
      {/* Floating Ambient Embers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {embers.map((ember) => (
          <motion.div
            key={ember.id}
            className="absolute rounded-full bg-gold-400 blur-[1px]"
            initial={{
              width: ember.width,
              height: ember.height,
              left: ember.left,
              top: '110%',
              opacity: 0,
            }}
            animate={{
              y: '-120vh',
              x: ember.drift,
              opacity: [0, ember.maxOpacity, 0]
            }}
            transition={{
              duration: ember.duration,
              repeat: Infinity,
              delay: ember.delay,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Cinematic Breathing Orbs */}
      <motion.div 
        className="absolute top-1/4 -left-1/4 md:left-0 w-[400px] h-[400px] bg-gold-500/10 rounded-full blur-[100px] pointer-events-none"
        animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.7, 0.3], x: [0, 50, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-1/4 -right-1/4 md:right-0 w-[500px] h-[500px] bg-maroon-600/20 rounded-full blur-[150px] pointer-events-none"
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.6, 0.2], x: [0, -50, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute inset-0 bg-jaali opacity-[0.03] pointer-events-none mix-blend-overlay" />

      {/* Content */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full"
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8 } }}
      >
        <div className="mb-14 relative w-48 h-48 flex items-center justify-center">
          <motion.div 
            className="w-full h-full p-4 flex items-center justify-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            <img src={logo} alt="Logo" className="w-full h-full object-contain opacity-90" />
          </motion.div>
          {/* Subtle elegant ring instead of shiny spinning one */}
          <motion.div 
            className="absolute -inset-2 border-[1px] border-gold-500/30 rounded-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.8 }}
          />
        </div>
        
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-serif text-gold-500 mb-2 tracking-wide font-bold drop-shadow-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 2 }}
        >
          Ajinkya <span className="text-cream-50 mx-4 text-4xl font-light">&</span> Shalini
        </motion.h1>

        <motion.p
          className="font-sanskrit text-gold-500 text-base md:text-xl tracking-widest mb-16 opacity-90 drop-shadow-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 3 }}
        >
          ॥ शुभ विवाह ॥
        </motion.p>
        
        {!hasStarted ? (
          <motion.div 
            className="flex flex-col items-center w-full mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <motion.p
              className="font-sans text-gold-500/80 tracking-[0.3em] uppercase text-[10px] md:text-sm mb-6 text-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
            >
              You are affectionately invited
            </motion.p>
            
            <ClickSparkles color="#FFD700">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setHasStarted(true)}
                className="relative group overflow-hidden px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 bg-[length:200%_auto] rounded-full text-maroon-950 font-sans font-extrabold uppercase tracking-[0.2em] md:tracking-[0.3em] shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_50px_rgba(212,175,55,0.8)] border-[2px] md:border-[3px] border-gold-400 transition-all duration-500 animate-shimmer"
              >
                <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
                <span className="relative z-10 flex items-center justify-center gap-3 text-xs md:text-base">
                  <span>Touch to Unseal</span>
                  <span className="text-lg md:text-xl animate-bounce">🎵</span>
                </span>
              </motion.button>
            </ClickSparkles>

            <motion.div
              className="mt-8 opacity-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <svg className="w-5 h-5 md:w-6 md:h-6 text-gold-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div 
            className="flex flex-col items-center w-full max-w-sm mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <div className="h-6 mb-3">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                  className="text-gold-500/80 font-sans text-xs md:text-sm tracking-widest font-semibold uppercase"
                >
                  {currentMessage}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="text-cream-50 font-serif text-3xl font-bold tracking-[0.2em] mb-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {progress}%
            </div>
            
            <div className="w-full h-3 rounded-full relative overflow-hidden bg-maroon-900 border border-gold-500/50 shadow-inner">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-500 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default Loader;

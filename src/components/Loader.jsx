import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Loader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const duration = 8000;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const currentProgress = Math.min((elapsedTime / duration) * 100, 100);
      setProgress(Math.floor(currentProgress));
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <motion.div 
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-maroon-950 overflow-hidden bg-jaali"
      exit={{ opacity: 0, transition: { duration: 1.5, delay: 1 } }}
    >
      {/* Royal Split Doors - Deep Maroon */}
      <motion.div
        className="absolute top-0 bottom-0 left-0 w-1/2 bg-maroon-900 border-r-4 border-gold-500 z-10 shadow-[10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-end"
        exit={{ x: '-100%', transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.2 } }}
      >
        <div className="w-1 h-full bg-gradient-to-b from-transparent via-gold-400 to-transparent absolute right-2 opacity-80" />
      </motion.div>
      <motion.div
        className="absolute top-0 bottom-0 right-0 w-1/2 bg-maroon-900 border-l-4 border-gold-500 z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.8)] flex items-center justify-start"
        exit={{ x: '100%', transition: { duration: 1.5, ease: [0.77, 0, 0.175, 1], delay: 0.2 } }}
      >
        <div className="w-1 h-full bg-gradient-to-b from-transparent via-gold-400 to-transparent absolute left-2 opacity-80" />
      </motion.div>

      {/* Content */}
      <motion.div 
        className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full"
        exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.8 } }}
      >
        <div className="mb-14 relative w-40 h-40 flex items-center justify-center drop-shadow-[0_0_15px_rgba(212,175,55,0.6)]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-gold-500 overflow-visible">
            {/* Outer large lotus petals */}
            <motion.path 
              d="M50 85 C20 70 0 30 25 15 C40 0 50 20 50 30 C50 20 60 0 75 15 C100 30 80 70 50 85 Z" 
              fill="none" stroke="currentColor" strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeInOut" }}
            />
            {/* Inner small lotus petals */}
            <motion.path 
              d="M50 80 C35 60 25 40 35 25 C45 15 50 30 50 40 C50 30 55 15 65 25 C75 40 65 60 50 80 Z" 
              fill="none" stroke="currentColor" strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 4, ease: "easeInOut", delay: 1 }}
            />
            <motion.circle 
              cx="50" cy="50" r="4" fill="currentColor"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 4 }}
            />
          </svg>
          <motion.div 
            className="absolute -inset-4 border-[2px] border-gold-500 rounded-full border-dashed"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
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
        
        <motion.div 
          className="flex flex-col items-center w-full max-w-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
        >
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
      </motion.div>
    </motion.div>
  );
};

export default Loader;

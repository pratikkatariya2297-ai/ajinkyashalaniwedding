import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Loader from '../components/Loader';
import Hero from '../components/Hero';
import Timeline from '../components/Timeline';
import Venue from '../components/Venue';
import MusicToggle from '../components/MusicToggle';
import Wardrobe from '../components/Wardrobe';
import LeadCatcher from '../components/LeadCatcher';
import PerformanceSignup from '../components/PerformanceSignup';
import { storage } from '../utils/storage';

const Home = () => {
  const [accessGranted, setAccessGranted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    storage.incrementPageView();
  }, []);

  return (
    <div className="bg-paper text-maroon-900 font-sans selection:bg-gold-500/40 selection:text-maroon-950 overflow-x-hidden min-h-screen">
      
      {!accessGranted && <LeadCatcher onAccessGranted={() => setAccessGranted(true)} />}

      <AnimatePresence mode="wait">
        {(loading && accessGranted) && (
          <Loader key="loader" onComplete={() => setLoading(false)} />
        )}
      </AnimatePresence>

      <div 
        className="w-full hide-scrollbar transition-opacity duration-1000"
        style={{ 
          opacity: (!loading && accessGranted) ? 1 : 0, 
          pointerEvents: (!loading && accessGranted) ? 'auto' : 'none',
          display: accessGranted ? 'block' : 'none'
        }}
      >
        <MusicToggle />
        <Hero />
        <Wardrobe />
        <Timeline />
        <Venue />
        <PerformanceSignup />
        
        <footer className="bg-maroon-950 py-16 text-center border-t-8 border-gold-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-jaali opacity-30 pointer-events-none mix-blend-color-burn" />
          <div className="relative z-10 flex flex-col items-center gap-4">
            <p className="font-serif text-gold-500 text-3xl md:text-4xl mb-2 font-bold drop-shadow-sm">Ajinkya & Shalini</p>
            <div className="w-16 h-[2px] bg-gold-500/50 mx-auto" />
            <p className="font-sans text-cream-100/70 text-xs tracking-[0.3em] uppercase font-bold">All rights reserved by Ivory Tech Solutions</p>
            <a
              href="/admin"
              className="mt-4 px-5 py-2 border border-gold-500/30 text-gold-500/50 hover:text-gold-400 hover:border-gold-400 rounded-full text-[10px] tracking-[0.25em] uppercase font-sans font-bold transition-all duration-300 hover:bg-gold-500/10"
            >
              Admin
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Home;

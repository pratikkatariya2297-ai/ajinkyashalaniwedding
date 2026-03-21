import React, { useState, useEffect, lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import Loader from './components/Loader';
import Hero from './components/Hero';
import Timeline from './components/Timeline';
import Venue from './components/Venue';
import Wardrobe from './components/Wardrobe';
import PerformanceSignup from './components/PerformanceSignup';
import LeadCatcher from './components/LeadCatcher';
import MusicToggle from './components/MusicToggle';
import { storage } from './utils/storage';
import logo from './assets/logo.png';

const Butterfly = lazy(() => import('./components/Butterfly'));

const App = () => {
  const [step, setStep] = useState('loader'); // 'loader' | 'catcher' | 'site'

  useEffect(() => {
    storage.incrementPageView();
  }, []);

  return (
    <div className="bg-paper text-maroon-900 font-sans selection:bg-gold-500/40 selection:text-maroon-950 overflow-x-hidden min-h-screen">
      
      {step === 'loader' && (
        <Loader onComplete={() => setStep('catcher')} />
      )}

      {step === 'catcher' && (
        <LeadCatcher onAccessGranted={() => setStep('site')} />
      )}

      {step === 'site' && (
        <>
            <Suspense fallback={null}>
              {/* Single butterfly — natural, gentle floating */}
              <Butterfly mode="fly" path="floatPath1" duration="45s" delay="3s" colorHue="0deg" scale={1.0} />
            </Suspense>

            <Hero />
            <Timeline />
            <Wardrobe />
            <PerformanceSignup />
            <Venue />
            
            <MusicToggle />

            {/* Footer */}
            <footer className="py-16 bg-black text-center border-t-4 border-gold-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-jaali opacity-10 pointer-events-none" />
              <div className="w-24 h-24 mx-auto mb-4 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                <img src={logo} alt="Logo" className="w-full h-full object-contain" />
              </div>
              <p className="text-gold-500 font-serif text-2xl font-bold mb-4 tracking-widest">Ajinkya & Shalini</p>
              <div className="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent w-32 mx-auto mb-6" />
              
              <div className="flex flex-col items-center gap-3">
                <p className="text-gold-500/50 text-xs tracking-[4px] uppercase font-medium">Built with Love & Tradition</p>
                
                <a 
                  href="https://wa.me/91848404888?text=Hi!%20I%20want%20to%20create%20a%20wedding%20info%20landing%20page"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cream-50/70 text-[10px] uppercase tracking-widest hover:text-gold-500 transition-colors duration-300 mt-4 border border-gold-500/20 px-4 py-2 rounded-full hover:border-gold-500/80 bg-maroon-950/30"
                >
                  Crafted by Ivory Tech Solutions | WhatsApp: 84840 4888
                </a>

                <button 
                  onClick={() => alert("Admin Portal Restricted.") /* Replace with actual admin route later if needed */}
                  className="text-maroon-900/30 text-[8px] uppercase tracking-widest hover:text-maroon-900/80 transition-colors mt-8"
                >
                  Admin Login
                </button>
              </div>
            </footer>

        </>
      )}
    </div>
  );
};

export default App;

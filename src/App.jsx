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
            <footer className="py-24 bg-black text-center border-t-8 border-gold-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-jaali opacity-20 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center gap-6">
                <div className="w-20 h-20 mx-auto bg-gold-500/10 p-4 rounded-full border border-gold-500/20 backdrop-blur-sm shadow-[0_0_30px_rgba(212,175,55,0.1)]">
                  <img src={logo} alt="Logo" className="w-full h-full object-contain grayscale opacity-60" />
                </div>
                
                <h3 className="text-gold-500 font-serif text-3xl md:text-4xl font-bold tracking-widest drop-shadow-md">Ajinkya & Shalini</h3>
                
                <div className="h-[2px] bg-gradient-to-r from-transparent via-gold-500 to-transparent w-48 mx-auto" />
                
                <div className="space-y-4">
                  <p className="text-gold-400 font-sans text-sm md:text-base tracking-[0.2em] font-bold uppercase opacity-90">
                    All rights reserved by Ivory Tech Solutions
                  </p>
                  
                  <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-8">
                    <a 
                      href="https://wa.me/91848404888?text=Hi!%20I%20want%20to%20create%20a%20wedding%20info%20landing%20page"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-maroon-900/40 border border-gold-500/30 text-gold-400 text-xs uppercase font-bold tracking-widest rounded-full hover:bg-gold-500 hover:text-maroon-950 transition-all duration-300 backdrop-blur-sm"
                    >
                      Crafted by Ivory Tech Solutions
                    </a>

                    <a 
                      href="/admin"
                      className="px-6 py-2.5 bg-gold-500/10 border border-gold-500/50 text-gold-500 text-xs uppercase font-bold tracking-widest rounded-full hover:bg-gold-500 hover:text-maroon-950 transition-all duration-300"
                    >
                      Admin Portal
                    </a>
                  </div>
                </div>
              </div>
            </footer>

        </>
      )}
    </div>
  );
};

export default App;

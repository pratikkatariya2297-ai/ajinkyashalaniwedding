import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../utils/storage';

const LeadCatcher = ({ onAccessGranted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '' });

  useEffect(() => {
    if (sessionStorage.getItem('guest_access')) {
      onAccessGranted();
    } else {
      setIsOpen(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    storage.saveLead(formData);
    sessionStorage.setItem('guest_access', 'true');
    setIsOpen(false);
    setTimeout(onAccessGranted, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-maroon-950/80 backdrop-blur-md bg-jaali"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          {/* Ornate Wedding Card Envelope Style */}
          <motion.div 
            className="bg-cream-50 text-maroon-900 w-full max-w-md p-10 md:p-14 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[4px] border-gold-500 rounded-lg bg-paper"
            initial={{ scale: 0.95, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Inner elaborate border */}
            <div className="absolute inset-2 border-[1px] border-maroon-900/30 rounded-md pointer-events-none" />
            <div className="absolute inset-3 border-[2px] border-gold-500/20 rounded-sm pointer-events-none" />
            
            <div className="w-20 h-20 mx-auto mb-6 flex items-center justify-center border-2 border-gold-500 rounded-full bg-maroon-900 shadow-lg">
              <svg viewBox="0 0 24 24" className="w-12 h-12 text-gold-500" fill="currentColor">
                {/* Traditional Ganesha Silhouette or Elephant */}
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v4h-2zm0 6h2v2h-2z" />
              </svg>
            </div>

            <h2 className="text-4xl font-serif text-maroon-950 mb-3 tracking-wide drop-shadow-sm font-bold">Padharo</h2>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-8 h-[2px] bg-gold-500" />
              <div className="w-2 h-2 rotate-45 bg-maroon-900" />
              <div className="w-8 h-[2px] bg-gold-500" />
            </div>
            
            <p className="text-maroon-900/80 font-serif text-sm italic mb-8 leading-relaxed font-semibold">
              Kindly honor us with your name <br/> to open the wedding scroll.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6 text-left relative z-10">
              <div className="relative group">
                <input 
                  type="text" 
                  required 
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your Respected Name" 
                  className="w-full bg-cream-100 border-b-2 border-maroon-800/40 py-3 px-4 focus:outline-none focus:border-maroon-900 font-serif text-maroon-950 text-xl font-medium transition-colors placeholder-maroon-900/40 rounded-t-sm"
                />
              </div>
              <div className="relative group">
                <input 
                  type="tel" 
                  required 
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Contact Number" 
                  className="w-full bg-cream-100 border-b-2 border-maroon-800/40 py-3 px-4 focus:outline-none focus:border-maroon-900 font-sans text-maroon-950 text-lg tracking-wider font-semibold transition-colors placeholder-maroon-900/40 rounded-t-sm"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-maroon-900 text-gold-500 font-sans uppercase tracking-[0.3em] font-medium py-4 mt-8 border-2 border-gold-500 hover:bg-gold-500 hover:text-maroon-950 transition-all shadow-md active:scale-95"
              >
                Open Invitation
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCatcher;

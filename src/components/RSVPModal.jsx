import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { storage } from '../utils/storage';

const RSVPModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', email: '', attending: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('submitting');
    storage.saveRSVP(formData);
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <>
      <div className="bg-maroon-950 py-24 flex flex-col items-center w-full border-t-8 border-gold-500 relative shadow-[0_-10px_30px_rgba(0,0,0,0.5)] z-20">
        <div className="absolute inset-0 bg-jaali opacity-30 pointer-events-none mix-blend-color-burn" />
        <p className="font-sanskrit text-gold-500 mb-6 tracking-widest text-xl font-bold relative z-10 drop-shadow-sm">॥ आमंत्रण ॥</p>
        <motion.button 
          onClick={() => setIsOpen(true)}
          className="relative group z-10 px-16 py-6 bg-cream-50 border-4 border-gold-500 text-maroon-950 font-sans uppercase tracking-[0.35em] font-bold text-lg hover:bg-gold-500 hover:text-maroon-950 transition-all duration-500 overflow-hidden rounded-sm shadow-[0_10px_20px_rgba(0,0,0,0.5)] hover:-translate-y-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="absolute inset-1 border border-maroon-900/20 group-hover:border-maroon-900/50 transition-colors duration-500 z-10" />
          <span className="relative z-20">RSVP Now</span>
        </motion.button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-maroon-950/90 backdrop-blur-md bg-jaali"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
          >
            {/* Royal physical card style modal */}
            <motion.div 
              className="bg-cream-50 text-maroon-900 w-full max-w-lg p-10 md:p-14 relative shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-[4px] border-gold-500 rounded-lg bg-paper"
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
            >
              <div className="absolute inset-2 border-[1px] border-maroon-900/30 rounded-md pointer-events-none" />
              <div className="absolute inset-3 border-[2px] border-gold-500/20 rounded-sm pointer-events-none" />
              
              <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-maroon-900/40 hover:text-maroon-900 transition-colors z-20"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <div className="text-center mb-10 relative z-10 mt-4">
                <p className="font-sanskrit text-maroon-900/80 mb-2 tracking-widest text-sm font-bold">॥ स्वागत ॥</p>
                <h3 className="font-serif text-4xl text-maroon-950 mb-4 font-bold">Your Presence</h3>
                <div className="w-20 h-[2px] bg-gold-500 mx-auto mb-4" />
                <p className="font-sans text-maroon-900/60 text-xs tracking-widest uppercase font-bold">Respond by March 26, 2026</p>
              </div>

              {status === 'success' ? (
                <motion.div className="text-center py-12 relative z-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <div className="w-24 h-24 bg-maroon-900 border-2 border-gold-500 rounded-full flex items-center justify-center mx-auto mb-8 text-gold-500 shadow-xl">
                    <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="font-serif text-4xl text-maroon-950 mb-4 font-bold">Dhanyawad!</p>
                  <p className="font-sans text-maroon-900/80 tracking-wider font-semibold">Your response has been graciously received.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
                  <div className="relative group">
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Your Respected Name" 
                      className="w-full bg-cream-100 border-b-2 border-maroon-900/20 py-3 px-4 focus:outline-none focus:border-maroon-900 font-serif text-maroon-950 text-xl placeholder-maroon-900/30 transition-colors font-semibold"
                    />
                  </div>
                  <div className="relative group">
                    <input 
                      type="email" name="email" required value={formData.email} onChange={handleChange}
                      placeholder="Email Address" 
                      className="w-full bg-cream-100 border-b-2 border-maroon-900/20 py-3 px-4 focus:outline-none focus:border-maroon-900 font-sans text-maroon-900 text-lg tracking-wider placeholder-maroon-900/30 transition-colors font-medium"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                    <label className="flex items-center justify-center gap-3 p-4 border-2 border-maroon-900/20 cursor-pointer hover:bg-maroon-900/5 transition-colors bg-cream-100">
                      <input type="radio" name="attending" required value="yes" onChange={handleChange} className="text-maroon-900 focus:ring-maroon-900 accent-maroon-900 w-4 h-4" />
                      <span className="font-sans text-xs tracking-widest uppercase text-maroon-950 font-bold flex-1">Joyfully Accept</span>
                    </label>
                    <label className="flex items-center justify-center gap-3 p-4 border-2 border-maroon-900/20 cursor-pointer hover:bg-maroon-900/5 transition-colors bg-cream-100">
                      <input type="radio" name="attending" required value="no" onChange={handleChange} className="text-maroon-900 focus:ring-maroon-900 accent-maroon-900 w-4 h-4" />
                      <span className="font-sans text-xs tracking-widest uppercase text-maroon-950 font-bold flex-1">Regretfully Decline</span>
                    </label>
                  </div>
                  <button 
                    type="submit" disabled={status === 'submitting'}
                    className="w-full bg-maroon-900 text-gold-500 font-sans uppercase tracking-[0.3em] font-bold py-5 mt-8 hover:bg-gold-500 hover:text-maroon-950 border-2 border-gold-500 transition-all shadow-[0_5px_15px_rgba(122,16,46,0.5)] disabled:opacity-50 active:scale-95"
                  >
                    {status === 'submitting' ? 'Sending...' : 'Seal RSVP'}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RSVPModal;

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClickSparkles from './ui/ClickSparkles';
import { storage } from '../utils/storage';
import { getBackgroundMusic } from '../utils/audio';
import { updatePresenceName } from '../firebase';

const LeadCatcher = ({ onAccessGranted }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState('idle');
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', attending: '', guests: 'just_me' });

  useEffect(() => {
    if (sessionStorage.getItem('guest_access')) {
      const savedName = sessionStorage.getItem('guest_name');
      if (savedName) updatePresenceName(savedName);
      onAccessGranted();
    } else {
      setIsOpen(true);
    }
  }, []);

  const fetchMetadata = async () => {
    let ip = 'Unknown', loc = 'Unknown';
    const ua = navigator.userAgent;
    let browser = 'Unknown';
    if (ua.includes('Firefox')) browser = 'Firefox';
    else if (ua.includes('SamsungBrowser')) browser = 'Samsung Internet';
    else if (ua.includes('Opera') || ua.includes('OPR')) browser = 'Opera';
    else if (ua.includes('Trident')) browser = 'Internet Explorer';
    else if (ua.includes('Edge')) browser = 'Edge';
    else if (ua.includes('Chrome')) browser = 'Chrome';
    else if (ua.includes('Safari')) browser = 'Safari';
    
    const device = /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua) ? 'Mobile' : 'Desktop';
    
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        ip = data.ip || 'Unknown';
        loc = `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`.replace(/^, | ,|, $/g, '');
      }
    } catch(err) { console.warn('IP fetch failed', err); }

    return { ip, loc, browser, device };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Safety check in case they bypass loader somehow
    const bgAudio = getBackgroundMusic();
    if (bgAudio && bgAudio.paused) {
      bgAudio.play().catch(err => console.log('Audio autoplay blocked', err));
    }

    if (!formData.attending) {
      alert('Padharo Sa! Please let us know if you are attending.');
      return;
    }

    setStatus('submitting');
    
    const metadata = await fetchMetadata();
    const finalData = { ...formData, ...metadata };
    
    await storage.saveRSVP(finalData);
    await storage.saveLead(finalData);
    
    updatePresenceName(formData.name);
    
    sessionStorage.setItem('guest_access', 'true');
    sessionStorage.setItem('guest_name', formData.name);

    setStatus('success');
    
    setTimeout(() => {
      setIsOpen(false);
      // Reset zoom/scroll after form submission
      window.scrollTo(0, 0);
      setTimeout(onAccessGranted, 500);
    }, 1500);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-[200] flex items-center justify-center p-2 md:p-4 bg-maroon-950/80 backdrop-blur-xl bg-jaali"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.8 }}
        >
          {/* Royal physical card style modal with engaging interactions */}
          <motion.div 
            className="bg-cream-50 text-maroon-900 w-[98%] max-w-lg p-6 md:p-8 relative shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_80px_rgba(212,175,55,0.15)] border-[3px] border-gold-500 rounded-xl bg-paper overflow-hidden group max-h-[90vh] overflow-y-auto hide-scrollbar"
            initial={{ scale: 0.9, y: 50, rotateX: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, rotateX: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 50, opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Glowing inner border effect */}
            <div className="absolute inset-1 border-[1px] border-gold-500/20 rounded-lg pointer-events-none group-hover:border-gold-500 transition-colors duration-1000 group-hover:bg-gold-500/5" />
            <div className="absolute inset-2 border-[2px] border-maroon-900/30 border-dashed rounded-md pointer-events-none" />

            <div className="text-center mb-3 relative z-10 mt-0">
              <p className="font-sanskrit text-gold-500 mb-1 tracking-widest text-sm md:text-base font-bold">॥ स्वागत ॥</p>
              <h3 className="font-serif text-3xl md:text-4xl text-maroon-950 mb-1 font-bold drop-shadow-sm">Padharo Sa</h3>
              <div className="w-16 h-[2px] bg-gold-500 mx-auto mb-2" />
              <p className="text-transparent bg-clip-text bg-gradient-to-r from-maroon-900 via-gold-500 to-maroon-900 bg-[length:200%_auto] animate-shimmer font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold">We eagerly await your presence</p>
            </div>

            {status === 'success' ? (
              <motion.div className="text-center py-6 relative z-10" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <div className="w-16 h-16 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-4 text-maroon-950 shadow-[0_0_30px_rgba(212,175,55,0.8)] animate-pulse">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="font-serif text-3xl text-maroon-950 mb-2 font-bold">Dhanyawad!</p>
                <p className="font-sans text-maroon-900/80 tracking-wide font-semibold text-sm md:text-base">Your response has been graciously received.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative group/input">
                    <input 
                      type="text" name="name" required value={formData.name} onChange={handleChange}
                      placeholder="Your Name *" 
                      className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-3 px-3 focus:outline-none focus:border-gold-500 focus:bg-white font-serif text-maroon-950 text-base md:text-lg placeholder-maroon-900/40 transition-all font-semibold rounded-t-sm shadow-sm"
                    />
                  </div>
                  
                  <div className="relative group/input">
                    <input 
                      type="tel" name="phone" required value={formData.phone} onChange={handleChange}
                      placeholder="Phone *" 
                      className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-3 px-3 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-base md:text-lg tracking-wider placeholder-maroon-900/40 transition-all font-semibold rounded-t-sm shadow-sm"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="relative group/input">
                    <input 
                      type="email" name="email" value={formData.email} onChange={handleChange}
                      placeholder="Email (Optional)" 
                      className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-3 px-3 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-base md:text-base tracking-widest placeholder-maroon-900/40 transition-all font-medium rounded-t-sm shadow-sm h-full"
                    />
                  </div>
                  <div className="relative group/input">
                    <select
                      name="guests" value={formData.guests} onChange={handleChange}
                      className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-3 px-3 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-base md:text-base tracking-wider font-semibold rounded-t-sm shadow-sm h-full appearance-none"
                    >
                      <option value="just_me">Just Me</option>
                      <option value="+1">+1 Guest</option>
                      <option value="+2">+2 Guests</option>
                      <option value="family">With Family</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <label className={`flex flex-col items-center justify-center p-3 py-4 border-[2px] rounded-lg cursor-pointer transition-all duration-300 text-center shadow-sm hover:shadow-md gap-1 ${formData.attending === 'yes' ? 'bg-gradient-to-br from-gold-400 to-gold-500 border-gold-600 text-maroon-950 scale-[1.02]' : 'bg-cream-100 border-maroon-900/10 text-maroon-900/60 hover:border-gold-400 hover:bg-white'}`}>
                    <input type="radio" name="attending" value="yes" onChange={handleChange} className="hidden" />
                    <span className="text-3xl md:text-4xl mb-1">🌺</span>
                    <span className={`font-serif text-[11px] md:text-sm font-bold leading-tight uppercase tracking-wider`}>We'd be<br/>Delighted!</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-3 py-4 border-[2px] rounded-lg cursor-pointer transition-all duration-300 text-center shadow-sm hover:shadow-md gap-1 ${formData.attending === 'no' ? 'bg-maroon-900 border-maroon-950 text-gold-500 scale-[1.02]' : 'bg-cream-100 border-maroon-900/10 text-maroon-900/60 hover:border-maroon-900/40 hover:bg-white'}`}>
                    <input type="radio" name="attending" value="no" onChange={handleChange} className="hidden" />
                    <span className="text-3xl md:text-4xl mb-1">🕊️</span>
                    <span className={`font-serif text-[11px] md:text-sm font-bold leading-tight uppercase tracking-wider`}>Celebrating<br/>from afar</span>
                  </label>
                </div>
                
                <div className="flex justify-center mt-4 pb-1">
                  <ClickSparkles color="#FFD700">
                    <motion.button 
                      type="submit" disabled={status === 'submitting'}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="px-10 md:px-14 relative overflow-hidden group/btn bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 bg-[length:200%_auto] animate-shimmer text-maroon-950 font-sans uppercase tracking-[0.2em] font-extrabold py-4 border-2 border-gold-400 rounded-full transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 text-[11px] md:text-sm"
                    >
                      <span className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
                      <span className="relative z-10">{status === 'submitting' ? 'Opening...' : 'Complete & Enter'}</span>
                    </motion.button>
                  </ClickSparkles>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LeadCatcher;

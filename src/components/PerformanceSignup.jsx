import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ClickSparkles from './ui/ClickSparkles';
import { storage } from '../utils/storage';

const PerformanceSignup = () => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', event: '', act: '', duration: '', message: '' });
  const [status, setStatus] = useState('idle'); // idle | submitting | done | error
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handles = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.act) return;
    setStatus('submitting');
    try {
      await storage.savePerformance(form);
      setStatus('done');
      setTimeout(() => { setOpen(false); setStatus('idle'); setForm({ name: '', contact: '', event: '', act: '', duration: '', message: '' }); }, 2500);
    } catch {
      setStatus('error');
    }
  };

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const floatingNotes = React.useMemo(() => {
    const notes = ['🎵', '🎶', '🎺', '🎸', '🥁', '🎷', '🎤', '🎹', '✨', '💃'];
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      note: notes[Math.floor(Math.random() * notes.length)],
      left: `${Math.random() * 100}%`,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * 5,
      size: 1.5 + Math.random() * 2.5,
      drift: (Math.random() - 0.5) * 200,
    }));
  }, []);

  return (
    <>
      {/* Trigger Banner Section */}
      <section 
        className="py-20 md:py-32 relative overflow-hidden border-y-8 border-gold-500 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] z-10 my-20 group"
        onMouseMove={handleMouseMove}
      >
        {/* Deep Engaging Moving Background */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-maroon-950 via-gray-900 to-[#1a050d] -z-10"
          animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
        />
        <div className="absolute inset-0 bg-jaali bg-maroon-900/40 mix-blend-color-burn pointer-events-none -z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-transparent to-maroon-950 pointer-events-none -z-10" />
        
        {/* Interactive Spotlight */}
        <div 
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          style={{
            background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.15), transparent 40%)`
          }}
        />

        {/* Floating Musical Notes */}
        {floatingNotes.map(n => (
          <motion.div
            key={n.id}
            className="absolute z-0 pointer-events-none opacity-20 text-gold-500 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)]"
            style={{ left: n.left, fontSize: `${n.size}rem`, bottom: '-10%' }}
            animate={{
              y: ['0vh', '-150vh'],
              x: n.drift,
              rotate: [0, 360],
              opacity: [0, 0.6, 0]
            }}
            transition={{
              duration: n.duration,
              delay: n.delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          >
            {n.note}
          </motion.div>
        ))}

        <motion.div
          className="relative z-10 text-center px-4 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-[2px] w-12 bg-gold-500" />
            <span className="text-gold-400 font-sanskrit text-sm md:text-base tracking-[0.3em] font-bold">॥ उत्सव प्रदर्शन ॥</span>
            <div className="h-[2px] w-12 bg-gold-500" />
          </div>
          
          <h2 className="text-3xl md:text-5xl font-serif text-cream-50 font-bold mb-6 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            Stage is Yours!
          </h2>
          <p className="text-cream-100 font-sans mb-10 leading-relaxed max-w-lg mx-auto text-sm md:text-base opacity-80 border-x-2 border-gold-500/20 px-6">
            We would love to have you light up our celebrations with your dance, song, or skit. Register your special performance for the lovely couple!
          </p>

          <ClickSparkles color="#FFD700">
            <motion.button
              onClick={() => setOpen(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden inline-flex items-center justify-center gap-3 px-8 md:px-12 py-5 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 bg-[length:200%_auto] animate-shimmer text-maroon-950 font-bold uppercase tracking-[0.2em] border-2 border-gold-300 shadow-[0_0_40px_rgba(212,175,55,0.6)] rounded-full text-xs md:text-sm group"
            >
              <span className="absolute inset-0 bg-white/30 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
              <span className="relative z-10 text-xl md:text-2xl drop-shadow-md group-hover:animate-bounce">💃</span>
              <span className="relative z-10 transition-transform group-hover:scale-105">Register My Act</span>
              <span className="relative z-10 text-xl md:text-2xl drop-shadow-md group-hover:animate-bounce">🎵</span>
            </motion.button>
          </ClickSparkles>
        </motion.div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-maroon-950/80 backdrop-blur-xl bg-jaali"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
          >
            <motion.div
              className="bg-cream-50 text-maroon-900 w-[95%] max-w-lg p-5 md:p-8 relative shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_80px_rgba(212,175,55,0.15)] border-[3px] border-gold-500 rounded-xl bg-paper overflow-hidden group/modal max-h-[90vh] overflow-y-auto hide-scrollbar"
              initial={{ scale: 0.9, y: 50, rotateX: 10 }}
              animate={{ scale: 1, y: 0, rotateX: 0 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Glowing inner border effect */}
              <div className="absolute inset-1 border-[1px] border-gold-500/20 rounded-lg pointer-events-none group-hover/modal:border-gold-500 transition-colors duration-1000 group-hover/modal:bg-gold-500/5" />
              <div className="absolute inset-2 border-[2px] border-maroon-900/30 border-dashed rounded-md pointer-events-none" />

              <button 
                onClick={() => setOpen(false)} 
                className="absolute top-3 right-3 text-maroon-900/40 hover:text-gold-500 transition-all duration-300 z-20 hover:rotate-90 hover:scale-125"
              >
                <svg className="w-5 h-5 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Header */}
              <div className="text-center mb-4 relative z-10 mt-0">
                <p className="font-sanskrit text-gold-500 mb-1 tracking-widest text-sm font-bold">॥ संगीत उत्सव ॥</p>
                <h2 className="text-3xl md:text-4xl font-serif text-maroon-950 mb-2 font-bold drop-shadow-sm">Register Act</h2>
                <div className="w-16 h-[2px] bg-gold-500 mx-auto mb-2" />
                <p className="text-maroon-900/60 font-sans text-xs md:text-sm tracking-wide">Tell us about your performance!</p>
              </div>

              {status === 'done' ? (
                <motion.div className="text-center py-4 relative z-10" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="w-12 h-12 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center mx-auto mb-3 text-maroon-950 shadow-[0_0_30px_rgba(212,175,55,0.8)] animate-pulse">
                    <span className="text-2xl">🌸</span>
                  </div>
                  <h3 className="text-xl font-serif text-maroon-900 font-bold mb-1">Registered!</h3>
                  <p className="text-maroon-900/80 font-sans tracking-wide font-semibold text-xs md:text-sm">We'll be in touch about your slot.</p>
                </motion.div>
              ) : (
                <form onSubmit={submit} className="space-y-2 relative z-10">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group/input">
                      <input
                        value={form.name} onChange={handles('name')} required
                        placeholder="Your Name *"
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-serif text-maroon-950 text-xs md:text-base placeholder-maroon-900/40 transition-all font-semibold rounded-t-sm shadow-sm"
                      />
                    </div>
                    <div className="relative group/input">
                      <input
                        value={form.contact} onChange={handles('contact')}
                        placeholder="Phone/WA *"
                        required
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-xs md:text-base tracking-wider placeholder-maroon-900/40 transition-all font-semibold rounded-t-sm shadow-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group/input">
                      <select
                        value={form.event} onChange={handles('event')} required
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-xs md:text-sm font-semibold transition-all rounded-t-sm shadow-sm"
                      >
                        <option value="">Event? *</option>
                        <option value="Haldi">💛 Haldi</option>
                        <option value="Mehendi">🌿 Mehendi</option>
                        <option value="Sangeet">🎶 Sangeet</option>
                        <option value="Reception">💫 Reception</option>
                        <option value="Other">✨ Other</option>
                      </select>
                    </div>
                    <div className="relative group/input">
                      <select
                        value={form.act} onChange={handles('act')} required
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-xs md:text-sm font-semibold transition-all rounded-t-sm shadow-sm"
                      >
                        <option value="">Type? *</option>
                        <option value="Solo Dance">💃 Solo</option>
                        <option value="Group Dance">👯 Group</option>
                        <option value="Song / Singing">🎤 Song</option>
                        <option value="Skit / Comedy">🎭 Skit</option>
                        <option value="Couple Dance">💑 Couple</option>
                        <option value="Other">✨ Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative group/input">
                      <select
                        value={form.duration} onChange={handles('duration')}
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-[10px] md:text-sm font-semibold transition-all rounded-t-sm shadow-sm"
                      >
                        <option value="">Duration</option>
                        <option value="2-3 mins">2–3 min</option>
                        <option value="3-5 mins">3–5 min</option>
                        <option value="5-7 mins">5–7 min</option>
                        <option value="7+ mins">7+ min</option>
                      </select>
                    </div>
                    
                    <div className="relative group/input">
                      <input
                        value={form.message} onChange={handles('message')}
                        placeholder="Song Title"
                        className="w-full bg-cream-100/50 border-b-2 border-maroon-900/20 py-2 px-2 focus:outline-none focus:border-gold-500 focus:bg-white font-sans text-maroon-900 text-xs md:text-sm font-medium transition-all rounded-t-sm shadow-sm h-full"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <p className="text-red-600 text-[10px] md:text-xs font-sans font-bold text-center">Something went wrong. Please try again.</p>
                  )}

                  <div className="flex justify-center mt-4">
                    <ClickSparkles color="#FFD700">
                      <motion.button 
                        type="submit" disabled={status === 'submitting'}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="relative overflow-hidden group/btn bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 bg-[length:200%_auto] animate-shimmer text-maroon-950 font-sans uppercase tracking-[0.2em] font-extrabold py-4 px-10 border-2 border-gold-400 rounded-full transition-all shadow-[0_0_15px_rgba(212,175,55,0.4)] disabled:opacity-50 text-xs md:text-sm flex items-center justify-center gap-2"
                      >
                        <span className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out rounded-full" />
                        <span className="relative z-10 mt-[1px]">{status === 'submitting' ? 'Submitting...' : 'Register Performance'}</span>
                        {status !== 'submitting' && <span className="relative z-10">✨</span>}
                      </motion.button>
                    </ClickSparkles>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PerformanceSignup;

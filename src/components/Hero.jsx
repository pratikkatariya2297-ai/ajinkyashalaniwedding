import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-04-26T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-maroon-950 border-b-8 border-gold-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10">
      {/* Background Image - Vibrant Rajasthani Mandap/Palace Theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] hover:scale-105"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&q=80&w=2000")' }}
      >
        <div className="absolute inset-0 bg-maroon-900/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-900/30 to-maroon-950/80" />
        <div className="absolute inset-0 bg-jaali opacity-30 mix-blend-color-burn" />
      </div>

      {/* Heavy Ornate Gold Frame */}
      <div className="absolute inset-4 md:inset-8 border-[2px] border-gold-500/50 pointer-events-none rounded-t-[10rem] shadow-[inset_0_0_80px_rgba(122,16,46,0.6)]">
        <div className="absolute inset-2 border-[1px] border-gold-500/30 rounded-t-[10rem]" />
        
        {/* Corner Decals */}
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-[3px] border-b-[3px] border-gold-500" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-[3px] border-b-[3px] border-gold-500" />
      </div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center mt-16 w-full max-w-5xl">
        
        <motion.div 
          className="text-gold-400 font-sanskrit text-lg md:text-2xl leading-relaxed mb-8 tracking-widest px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        >
          मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः।<br/>
          मंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः॥
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, width: 0 }}
          whileInView={{ opacity: 1, width: 'auto' }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-12 h-[1px] bg-gold-500" />
          <p className="text-cream-50 font-sans tracking-[0.4em] uppercase text-xs md:text-sm font-semibold">
            Save The Date
          </p>
          <div className="w-12 h-[1px] bg-gold-500" />
        </motion.div>
        
        <motion.h1 
          className="text-6xl md:text-8xl lg:text-9xl font-serif text-cream-50 mb-4 leading-none tracking-tight drop-shadow-[0_5px_15px_rgba(0,0,0,0.6)] font-bold"
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8 }}
        >
          Ajinkya <br className="md:hidden" />
          <span className="text-gold-500 text-4xl md:text-6xl mx-6 align-middle inline-block animate-[pulse_3s_ease-in-out_infinite] drop-shadow-[0_0_15px_rgba(212,175,55,0.8)]">♥</span> <br className="md:hidden" />
          Shalini
        </motion.h1>

        <motion.p 
          className="text-gold-400 font-serif text-3xl md:text-4xl font-bold italic mb-16 drop-shadow-md"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          26th April, 2026
        </motion.p>

        {/* Hero Countdown - Vibrant Solid Blocks */}
        <motion.div 
          className="flex gap-4 md:gap-10 justify-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center group">
              <div className="relative w-20 h-24 md:w-24 md:h-28 flex items-center justify-center mb-4 transition-transform duration-500 group-hover:-translate-y-2 bg-maroon-950 border-2 border-gold-500 rounded-t-full shadow-[0_10px_20px_rgba(0,0,0,0.6)]">
                <div className="absolute inset-1 border border-gold-500/30 rounded-t-full" />
                
                <span className="relative z-10 text-4xl md:text-5xl font-serif text-cream-50 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-cream-100 font-bold text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans">
                {unit}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator with Royal Motif */}
      <motion.div 
        className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="text-gold-500 font-bold text-[10px] tracking-widest uppercase mb-1">Begin</span>
        <motion.div 
          className="w-[2px] h-16 bg-gradient-to-b from-gold-500 to-transparent relative"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 bg-gold-500 shadow-[0_0_10px_rgba(212,175,55,1)]" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

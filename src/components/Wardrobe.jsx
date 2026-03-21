import React from 'react';
import { motion } from 'framer-motion';

const Wardrobe = () => {
  const events = [
    { title: "Haldi & Mehendi", dresscode: "Vibrant Yellows, Greens & Florals", icon: "🥻" },
    { title: "Sangeet", dresscode: "Indo-Western Glamour & Pastels", icon: "💃" },
    { title: "Wedding Pheras", dresscode: "Traditional Marwari / Royal Regalia", icon: "👑" }
  ];

  return (
    <section className="py-32 relative overflow-hidden text-cream-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20 border-b-8 border-gold-500">
      {/* Moving Background */}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-maroon-950 via-maroon-900 to-[#1a050d]"
        animate={{ backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <div className="absolute inset-0 bg-jaali opacity-20 pointer-events-none mix-blend-color-burn" />
      
      {/* Floating Sparkles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-gold-400 blur-[2px]"
            style={{
              width: Math.random() * 6 + 2 + 'px',
              height: Math.random() * 6 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 50 - 25, 0],
              opacity: [0.1, 0.4, 0.1]
            }}
            transition={{ duration: 8 + Math.random() * 10, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-sanskrit text-gold-500 mb-3 tracking-widest text-xl font-bold">॥ परिधान ॥</p>
          <h2 className="text-5xl md:text-7xl font-serif text-gold-500 font-bold mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Wardrobe</h2>
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-20 h-[2px] bg-gold-500" />
            <div className="w-4 h-4 rotate-45 border-2 border-gold-500 flex items-center justify-center bg-maroon-900">
              <div className="w-1.5 h-1.5 bg-gold-500" />
            </div>
            <div className="w-20 h-[2px] bg-gold-500" />
          </div>
          <p className="text-cream-100 font-sans font-medium text-lg max-w-xl mx-auto tracking-wide leading-relaxed">
            Grace the occasions in your finest traditional attire to complement our royal Marwari celebrations.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-14 px-4">
          {events.map((event, index) => (
              <motion.div 
              key={index}
              className="relative bg-cream-50 p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-3 hover:shadow-[0_0_40px_rgba(212,175,55,0.6)] transition-all duration-700 rounded-t-[8rem] group border-[3px] border-gold-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Inner Arch border */}
              <div className="absolute inset-2 border-[1px] border-maroon-900/30 rounded-t-[7.5rem] pointer-events-none group-hover:border-gold-500 group-hover:bg-gold-500/5 transition-colors duration-500" />

              <div className="w-20 h-20 mx-auto mb-8 border-2 border-gold-500 flex items-center justify-center rotate-45 bg-maroon-900 group-hover:bg-gold-500 transition-colors duration-700 shadow-xl">
                <span className="text-4xl -rotate-45 block group-hover:scale-125 transition-transform duration-500">
                  {event.icon}
                </span>
              </div>
              
              <h3 className="text-3xl font-serif text-maroon-950 font-bold mb-5 tracking-wide">{event.title}</h3>
              <div className="w-12 h-[2px] bg-gold-500 mx-auto mb-5" />
              <p className="text-maroon-900 font-sans text-sm tracking-[0.15em] uppercase leading-relaxed font-bold">
                {event.dresscode}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Wardrobe;

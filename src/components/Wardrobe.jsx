import React from 'react';
import { motion } from 'framer-motion';

const Wardrobe = () => {
  const events = [
    { title: "Haldi & Mehendi", dresscode: "Vibrant Yellows, Greens & Florals" },
    { title: "Sangeet", dresscode: "Indo-Western Glamour & Pastels" },
    { title: "Wedding Pheras", dresscode: "Traditional Marwari / Royal Regalia" }
  ];

  return (
    <section className="py-32 bg-maroon-950 relative border-b-8 border-gold-500 overflow-hidden text-cream-50 shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-20">
      <div className="absolute inset-0 bg-jaali-maroon opacity-50 pointer-events-none mix-blend-color-burn" />
      
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
              className="relative bg-cream-50 p-10 text-center shadow-[0_20px_40px_rgba(0,0,0,0.8)] hover:-translate-y-3 transition-transform duration-700 rounded-t-[8rem] group border-[3px] border-gold-500"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {/* Inner Arch border */}
              <div className="absolute inset-2 border-[1px] border-maroon-900/30 rounded-t-[7.5rem] pointer-events-none" />

              <div className="w-20 h-20 mx-auto mb-8 border-2 border-gold-500 flex items-center justify-center rotate-45 bg-maroon-900 group-hover:bg-gold-500 transition-colors duration-700 shadow-xl">
                <div className="w-10 h-10 border-2 border-gold-500/50 group-hover:border-maroon-950/50" />
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

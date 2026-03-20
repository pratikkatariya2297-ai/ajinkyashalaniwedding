import React from 'react';
import { motion } from 'framer-motion';

const Venue = () => {
  return (
    <section className="py-32 bg-cream-50 text-maroon-950 relative overflow-hidden bg-paper">
      <div className="container mx-auto px-4 max-w-6xl relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-center">
          
          <motion.div 
            className="flex-1 flex flex-col justify-center text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <p className="font-sanskrit text-maroon-800 mb-3 tracking-widest text-xl font-bold">॥ शुभ स्थल ॥</p>
            <h2 className="text-5xl md:text-7xl font-serif text-maroon-950 mb-6 font-bold">The Venue</h2>
            
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-10">
              <div className="w-20 h-[2px] bg-gold-500" />
              <div className="w-3 h-3 rotate-45 bg-maroon-900" />
            </div>
            
            <h3 className="text-4xl font-serif text-maroon-900 mb-6 font-bold tracking-wide">Ajinkya Tara Resort</h3>
            
            <p className="text-maroon-900/80 font-sans font-medium leading-relaxed mb-10 text-lg mx-auto lg:mx-0 max-w-md">
              Near Namdev Baug, Indian Grape Research Center, <br />
              Pune–Solapur Road, Hadapsar, <br />
              Pune – 411028.
            </p>

            <a 
              href="https://share.google/7CvusHgvRr4Cgerc7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-4 px-10 py-5 bg-maroon-900 text-gold-500 font-sans uppercase tracking-[0.2em] font-bold hover:bg-gold-500 hover:text-maroon-950 transition-all duration-300 w-fit mx-auto lg:mx-0 shadow-xl border-2 border-gold-500 active:scale-95 group"
            >
              Get Directions
              <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </a>
          </motion.div>

          {/* Map Side */}
          <motion.div 
            className="flex-1 w-full aspect-square relative rounded-t-[12rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border-[8px] border-gold-500 bg-maroon-950 p-2"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="w-full h-full rounded-t-[11.5rem] overflow-hidden relative border-2 border-gold-500/50">
              <iframe 
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15132.89!2d73.92!3d18.52!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTjCsDMxJzEyLjAiTiA3M8KwNTUnMTIuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen="" 
                loading="lazy"
                className="opacity-90 mix-blend-multiply contrast-125"
              ></iframe>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Venue;

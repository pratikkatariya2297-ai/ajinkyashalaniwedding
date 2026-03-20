import React from 'react';
import { motion } from 'framer-motion';

const events = [
  {
    title: "Mehendi Ceremony",
    date: "24 April 2026",
    time: "Evening",
    description: "Join us for an evening of colors, music, and beautiful henna patterns."
  },
  {
    title: "Kumkum Ceremony",
    date: "25 April 2026",
    time: "10:00 AM",
    description: "A traditional start to the wedding festivities."
  },
  {
    title: "Haldi Ceremony",
    date: "25 April 2026",
    time: "2:00 PM",
    description: "Blessing the couple with the holy turmeric paste."
  },
  {
    title: "Sangeet",
    date: "25 April 2026",
    time: "7:00 PM",
    description: "A night of music, dance, and joyous celebrations."
  },
  {
    title: "Engagement (Sagai)",
    date: "25 April 2026",
    time: "8:00 PM",
    description: "Exchanging of rings and taking the first step towards forever."
  },
  {
    title: "Wedding Rituals (Pheras)",
    date: "26 April 2026",
    time: "9:00 AM",
    description: "The sacred vows and seven steps around the holy fire."
  },
  {
    title: "Wedding Ceremony",
    date: "26 April 2026",
    time: "6:15 PM",
    description: "The grand reception and evening celebrations with friends and family."
  }
];

const TimelineCard = ({ event, index }) => {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={`relative flex items-center justify-between md:justify-normal w-full mb-16 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Royal Motif Center Dot */}
      <div className="absolute left-0 md:left-1/2 w-10 h-10 z-10 md:-translate-x-1/2 mt-1 md:mt-0 flex items-center justify-center bg-cream-50 border-2 border-gold-500 rounded-full shadow-lg">
        <div className="w-5 h-5 bg-maroon-900 rounded-full flex items-center justify-center">
          <div className="w-2 h-2 bg-gold-500 rotate-45" />
        </div>
      </div>

      {/* Empty space for desktop alignment */}
      <div className="hidden md:block w-5/12" />

      {/* Card Content - Ivory Paper Style */}
      <div className="w-full pl-12 md:pl-0 md:w-5/12">
        <div className={`relative p-8 bg-cream-50 shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-2 border-gold-500 rounded-sm hover:-translate-y-1 transition-transform duration-500 group ${isEven ? 'md:mr-10 md:text-right' : 'md:ml-10'}`}>
          
          <div className="absolute inset-1.5 border border-gold-500/30 border-dashed pointer-events-none" />

          <h3 className="text-3xl font-serif text-maroon-950 font-bold mb-3 relative z-10">{event.title}</h3>
          
          <div className={`flex flex-col md:flex-row gap-2 md:gap-4 mb-5 text-maroon-900 font-sans text-xs tracking-[0.2em] font-bold uppercase relative z-10 ${isEven ? 'md:justify-end' : ''}`}>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-500 inline-block" />
              {event.date}
            </span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-500 inline-block" />
              {event.time}
            </span>
          </div>

          <p className="text-maroon-900/80 font-sans font-medium leading-relaxed relative z-10 text-[15px]">
            {event.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  return (
    <section className="py-32 bg-paper relative z-0 border-b-8 border-gold-500">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        <motion.div 
          className="text-center mb-24"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-sanskrit text-maroon-900 mb-3 tracking-widest text-xl font-bold">॥ उत्सव ॥</p>
          <h2 className="text-5xl md:text-7xl font-serif text-maroon-950 font-bold mb-8">Festivities</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-[2px] bg-gold-500" />
            <div className="w-4 h-4 rotate-45 bg-maroon-900" />
            <div className="w-16 h-[2px] bg-gold-500" />
          </div>
        </motion.div>

        <div className="relative">
          {/* Main vertical heavy gold line */}
          <div className="absolute left-5 md:left-1/2 top-0 bottom-0 w-[4px] bg-gold-500 md:-translate-x-1/2 rounded-full shadow-[0_0_10px_rgba(212,175,55,0.4)]" />
          
          <div className="flex flex-col">
            {events.map((event, index) => (
              <TimelineCard key={index} event={event} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Timeline;

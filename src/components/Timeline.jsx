import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlobalFestiveElements from './GlobalFestiveElements';

// Build a Google Calendar URL
const toGoogleCalUrl = (event) => {
  // Parse date + time e.g. "24 April 2026" + "Evening" -> fallback to midnight
  const months = { January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11 };
  const parts = event.date.split(' ');
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  const timeStr = event.time;
  let hour = 0, minute = 0;
  if (timeStr && timeStr.includes(':')) {
    const [h, mPart] = timeStr.split(':');
    hour = parseInt(h, 10);
    minute = parseInt(mPart, 10);
    if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
  } else if (timeStr.toLowerCase() === 'evening') {
    hour = 18;
  }
  const pad = n => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month+1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  // +2 hours end
  let endHour = hour + 2;
  const dtEnd = `${year}${pad(month+1)}${pad(day)}T${pad(endHour)}${pad(minute)}00`;
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: `${event.title} – Ajinkya & Shalini Wedding`,
    dates: `${dtStart}/${dtEnd}`,
    details: event.description,
    location: 'Ajinkya Tara Resort, Near Namdev Baug, Pune–Solapur Road, Hadapsar, Pune 411028',
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};

// Build and trigger an .ics download for Apple Calendar
const downloadICS = (event) => {
  const months = { January:0,February:1,March:2,April:3,May:4,June:5,July:6,August:7,September:8,October:9,November:10,December:11 };
  const parts = event.date.split(' ');
  const day = parseInt(parts[0], 10);
  const month = months[parts[1]];
  const year = parseInt(parts[2], 10);
  const timeStr = event.time;
  let hour = 0, minute = 0;
  if (timeStr && timeStr.includes(':')) {
    const [h, mPart] = timeStr.split(':');
    hour = parseInt(h, 10);
    minute = parseInt(mPart, 10);
    if (timeStr.toLowerCase().includes('pm') && hour !== 12) hour += 12;
    if (timeStr.toLowerCase().includes('am') && hour === 12) hour = 0;
  } else if (timeStr.toLowerCase() === 'evening') {
    hour = 18;
  }
  const pad = n => String(n).padStart(2, '0');
  const dtStart = `${year}${pad(month+1)}${pad(day)}T${pad(hour)}${pad(minute)}00`;
  const dtEnd = `${year}${pad(month+1)}${pad(day)}T${pad(hour+2)}${pad(minute)}00`;
  const now = new Date().toISOString().replace(/[-:]/g,'').split('.')[0] + 'Z';
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Ivory Tech Solutions//Wedding//EN',
    'BEGIN:VEVENT',
    `UID:${event.title.replace(/\s/g,'-')}-ajinkya-shalini@ivorytech`,
    `DTSTAMP:${now}`,
    `DTSTART;TZID=Asia/Kolkata:${dtStart}`,
    `DTEND;TZID=Asia/Kolkata:${dtEnd}`,
    `SUMMARY:${event.title} – Ajinkya & Shalini Wedding`,
    `DESCRIPTION:${event.description}`,
    'LOCATION:Ajinkya Tara Resort, Near Namdev Baug, Pune–Solapur Road, Hadapsar, Pune 411028',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');
  const blob = new Blob([ics], { type: 'text/calendar' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${event.title.replace(/\s/g,'-')}-AjinkyaShaliniWedding.ics`;
  a.click();
  URL.revokeObjectURL(url);
};

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

  const CardContent = () => (
    <div className="relative p-6 lg:p-8 bg-cream-50 shadow-[0_15px_30px_rgba(0,0,0,0.15)] border-2 border-gold-500 rounded-tl-[3rem] rounded-br-[3rem] rounded-tr-md rounded-bl-md hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] transition-all duration-500 group cursor-pointer">
      <div className="absolute inset-1.5 border border-gold-500/30 border-dashed rounded-tl-[2.5rem] rounded-br-[2.5rem] rounded-tr-sm rounded-bl-sm pointer-events-none group-hover:border-gold-500 group-hover:bg-gold-500/5 transition-colors duration-500" />
      <h3 className={`text-2xl lg:text-3xl font-serif text-maroon-950 font-bold mb-3 relative z-10 ${isEven ? 'md:text-right' : ''}`}>{event.title}</h3>
      <div className={`flex flex-col md:flex-row gap-2 md:gap-4 mb-4 text-maroon-900 font-sans text-xs tracking-[0.2em] font-bold uppercase relative z-10 ${isEven ? 'md:justify-end' : ''}`}>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-500 inline-block" />
          {event.date}
        </span>
        <span className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-500 inline-block" />
          {event.time}
        </span>
      </div>
      <p className={`text-maroon-900/80 font-sans font-medium leading-relaxed relative z-10 text-[15px] ${isEven ? 'md:text-right' : ''}`}>
        {event.description}
      </p>
      {/* Calendar Buttons */}
      <div className={`flex flex-wrap gap-2 mt-4 relative z-10 ${isEven ? 'md:justify-end' : ''}`}>
        <button
          onClick={() => downloadICS(event)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-maroon-900/20 bg-maroon-50/60 text-maroon-800 text-[10px] font-bold tracking-wider uppercase hover:border-gold-500 hover:bg-gold-50 hover:text-maroon-950 transition-all duration-200 shadow-sm"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"/></svg>
          Apple Calendar
        </button>
        <a
          href={toGoogleCalUrl(event)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-maroon-900/20 bg-maroon-50/60 text-maroon-800 text-[10px] font-bold tracking-wider uppercase hover:border-gold-500 hover:bg-gold-50 hover:text-maroon-950 transition-all duration-200 shadow-sm"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13z"/></svg>
          Google Calendar
        </a>
      </div>
    </div>
  );

  return (
    <motion.div
      className="relative flex items-start w-full mb-20 md:mb-24 last:mb-0"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, delay: index * 0.1 }}
    >
      {/* Mobile layout: dot on left, card occupies rest */}
      <div className="flex md:hidden items-start w-full gap-8 pl-4">
        {/* Dot column */}
        <div className="mt-6 flex-shrink-0 w-10 h-10 flex items-center justify-center bg-cream-50 border-2 border-gold-500 rounded-full shadow-lg z-10">
          <div className="w-5 h-5 bg-maroon-900 rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-gold-500 rotate-45" />
          </div>
        </div>
        {/* Card */}
        <div className="flex-1"><CardContent /></div>
      </div>

      {/* Desktop layout: true 3-column approach */}
      <div className="hidden md:flex items-start w-full">
        {/* Left card (even indexes go here) */}
        <div className="w-[46%] flex justify-end">
          {isEven && <div className="w-full pr-2"><CardContent /></div>}
        </div>

        {/* Center dot — always in its own column */}
        <div className="w-[8%] flex justify-center pt-8 flex-shrink-0">
          <div className="w-10 h-10 flex items-center justify-center bg-cream-50 border-2 border-gold-500 rounded-full shadow-lg z-10">
            <div className="w-5 h-5 bg-maroon-900 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-gold-500 rotate-45" />
            </div>
          </div>
        </div>

        {/* Right card (odd indexes go here) */}
        <div className="w-[46%] flex justify-start">
          {!isEven && <div className="w-full pl-2"><CardContent /></div>}
        </div>
      </div>
    </motion.div>
  );
};

const Timeline = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <section 
      className="py-32 bg-maroon-950 relative overflow-hidden z-0 border-b-8 border-gold-500 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] group"
      onMouseMove={handleMouseMove}
    >
      <GlobalFestiveElements />
      
      <div className="absolute inset-0 bg-jaali bg-maroon-900/40 mix-blend-color-burn pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-transparent to-maroon-950 pointer-events-none" />
      
      {/* Interactive Spotlight */}
      <div 
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(212,175,55,0.15), transparent 40%)`
        }}
      />

      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        
        <motion.div 
          className="text-center mb-24 relative z-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <p className="font-sanskrit text-gold-400 mb-3 tracking-widest text-xl font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">॥ उत्सव ॥</p>
          <h2 className="text-5xl md:text-7xl font-serif text-cream-50 font-bold mb-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Festivities</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="w-16 h-[2px] bg-gold-500" />
            <div className="w-4 h-4 rotate-45 bg-gold-400 shadow-[0_0_10px_rgba(212,175,55,0.8)]" />
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

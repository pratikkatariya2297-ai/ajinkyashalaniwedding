import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';
import ClickSparkles from './ui/ClickSparkles';
import { handleSmartCalendarClick } from '../utils/calendar';

const PETAL_COLORS = [
  '#d3112d',
  '#e61932',
  '#c20a2e',
  '#e62020',
  '#de0f4f',
  '#bc0836',
];

function generatePetals(count) {
  return Array.from({ length: 80 }, (_, i) => ({
    id: `${count}-${i}`,
    startX: Math.random() * 100,
    driftX: (Math.random() - 0.5) * 250,
    duration: 5.0 + Math.random() * 4,
    delay: Math.random() * 1.5,
    size: 20 + Math.random() * 25,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    startRotation: Math.random() * 360,
    endRotation: (Math.random() > 0.5 ? 1 : -1) * (300 + Math.random() * 400),
    borderRadius: `${50 + Math.random() * 10}% ${5 + Math.random() * 20}% ${45 + Math.random() * 10}% ${5 + Math.random() * 20}%`,
  }));
}

const Hero = ({ onRsvpClick }) => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [roseTrigger, setRoseTrigger] = useState(0);
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const targetDate = new Date('2026-12-29T00:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      } else {
        clearInterval(interval);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogoTap = () => {
    // Both flowers and RSVP
    setRoseTrigger(prev => {
      const next = prev + 1;
      setPetals(generatePetals(next));
      return next;
    });
    if (onRsvpClick) onRsvpClick();
  };

  const onCalendarClick = (e) => {
    e.preventDefault();
    handleSmartCalendarClick({
      title: 'Ajinkya & Shalini Wedding 💍',
      date: '29 December 2026',
      time: '06:15 PM',
      description: 'Join us to celebrate the wedding of Ajinkya & Shalini! 🌸'
    });
  };

  return (
    <section id="hero" className="relative w-full min-h-[100dvh] pt-20 pb-48 md:pb-32 flex flex-col items-center justify-center bg-maroon-950 border-b-8 border-gold-500 shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-10 overflow-hidden">

      {/* Rose Petals — rendered at fixed position to overlay everything */}
      {petals.map(p => (
        <div
          key={p.id}
          className="rose-petal"
          style={{
            left: `${p.startX}vw`,
            top: 0,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            boxShadow: `0 2px 6px ${p.color}55`,
            animation: `roseFall ${p.duration}s linear ${p.delay}s both`,
          }}
        />
      ))}

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url("/premium_vidhi_mandap.png")' }}
      >
        <div className="absolute inset-0 bg-maroon-900/50 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-maroon-950 via-maroon-900/30 to-maroon-950/80" />
        <div className="absolute inset-0 bg-jaali opacity-30 mix-blend-color-burn" />
      </div>

      {/* Ornate Gold Frame */}
      <div className="absolute inset-4 md:inset-8 border-[2px] border-gold-500/50 pointer-events-none rounded-t-[10rem] shadow-[inset_0_0_80px_rgba(122,16,46,0.6)]">
        <div className="absolute inset-2 border-[1px] border-gold-500/30 rounded-t-[10rem]" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-l-[3px] border-b-[3px] border-gold-500" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-r-[3px] border-b-[3px] border-gold-500" />
      </div>

      <div className="relative z-10 text-center px-4 flex flex-col items-center w-full max-w-5xl">

        {/* Sanskrit Blessing */}
        <motion.div
          className="text-gold-400 font-sanskrit text-base md:text-xl leading-relaxed mb-4 tracking-widest px-4 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-bold"
          initial={{ opacity: 0, filter: 'blur(10px)' }}
          whileInView={{ opacity: 1, filter: 'blur(0px)' }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
        >
          मंगलम् भगवान विष्णुः, मंगलम् गरुड़ध्वजः।<br/>
          मंगलम् पुण्डरीकाक्षः, मंगलाय तनो हरिः॥
        </motion.div>

        {/* Save the Date */}
        <motion.div
          className="flex items-center gap-4 mb-2"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          <div className="w-12 h-[1px] bg-gold-500" />
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-cream-50 via-gold-400 to-cream-50 bg-[length:200%_auto] animate-shimmer font-sans tracking-[0.4em] uppercase text-xs md:text-sm font-semibold">Save The Date</p>
          <div className="w-12 h-[1px] bg-gold-500" />
        </motion.div>

        {/* Logo — tap to shower roses */}
        <motion.div
          className="relative mb-6 cursor-pointer active:scale-95 transition-transform select-none group/logo"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8 }}
          onClick={handleLogoTap}
        >
          <div className="h-40 md:h-56 lg:h-64 aspect-square mx-auto relative">
            <img
              src={logo}
              alt="Ajinkya & Shalini"
              className="w-full h-full object-contain filter drop-shadow-[0_10px_40px_rgba(212,175,55,0.7)] group-hover/logo:drop-shadow-[0_15px_60px_rgba(212,175,55,0.9)] transition-all duration-700"
            />
          </div>
          {/* TAP TO BLESS — highlighted interactive button */}
          <div className="mt-6 flex flex-col items-center" style={{ position: 'relative' }}>

            {/* Orbiting sparkle dots */}
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 8, height: 8,
                  borderRadius: '50%',
                  background: i % 2 === 0 ? '#D4AF37' : '#f9a8d4',
                  boxShadow: i % 2 === 0 ? '0 0 8px #D4AF37' : '0 0 8px #f9a8d4',
                  top: '50%', left: '50%',
                }}
                animate={{
                  x: [0, Math.cos((deg * Math.PI) / 180) * 72, 0],
                  y: [0, Math.sin((deg * Math.PI) / 180) * 72, 0],
                  opacity: [0.4, 1, 0.4],
                  scale: [0.6, 1.2, 0.6],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  delay: i * 0.4,
                  ease: 'easeInOut',
                }}
              />
            ))}

            {/* Outer pulse rings */}
            {[1, 2, 3].map(ring => (
              <motion.div
                key={ring}
                style={{
                  position: 'absolute',
                  borderRadius: '9999px',
                  border: '1.5px solid rgba(212,175,55,0.5)',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'none',
                }}
                animate={{
                  width: ['60px', '120px'],
                  height: ['32px', '80px'],
                  opacity: [0.7, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: ring * 0.55,
                  ease: 'easeOut',
                }}
              />
            ))}

            {/* Bouncing hand emoji above */}
            <motion.div
              style={{ fontSize: 22, marginBottom: 4, filter: 'drop-shadow(0 0 8px rgba(212,175,55,0.9))' }}
              animate={{ y: [0, -8, 0], rotate: [0, 15, -10, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            >
              🙏
            </motion.div>

            {/* Main glowing pill button */}
            <motion.span
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 28px',
                borderRadius: 9999,
                fontFamily: 'serif',
                fontSize: '0.95rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
                fontWeight: 800,
                color: '#7a1028',
                background: 'linear-gradient(135deg, #fde68a, #D4AF37, #fde68a)',
                backgroundSize: '200% auto',
                boxShadow: '0 0 24px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4), 0 4px 20px rgba(0,0,0,0.5)',
                border: '2px solid rgba(255,255,255,0.4)',
                cursor: 'pointer',
                userSelect: 'none',
                overflow: 'hidden',
              }}
              animate={{
                backgroundPosition: ['0% center', '200% center'],
                boxShadow: [
                  '0 0 24px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)',
                  '0 0 40px rgba(212,175,55,1), 0 0 90px rgba(212,175,55,0.7)',
                  '0 0 24px rgba(212,175,55,0.8), 0 0 60px rgba(212,175,55,0.4)',
                ],
              }}
              transition={{
                backgroundPosition: { duration: 2, repeat: Infinity, ease: 'linear' },
                boxShadow: { duration: 1.8, repeat: Infinity, ease: 'easeInOut' },
              }}
              whileTap={{ scale: 0.92 }}
              whileHover={{ scale: 1.08 }}
            >
              {/* shimmer sweep */}
              <motion.div
                style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.5) 50%, transparent 60%)',
                  borderRadius: 9999,
                }}
                animate={{ x: ['-200%', '200%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
              />
              ✦ Tap to Bless ✦
            </motion.span>

            {/* Pulsing underline glow */}
            <motion.div
              style={{
                width: 80, height: 2, borderRadius: 9999, marginTop: 8,
                background: 'linear-gradient(90deg, transparent, #D4AF37, transparent)',
              }}
              animate={{ opacity: [0.4, 1, 0.4], scaleX: [0.6, 1.2, 0.6] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>

        {/* Countdown — directly below logo */}
        <motion.div
          className="flex gap-4 md:gap-10 justify-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          {Object.entries(timeLeft).map(([unit, value]) => (
            <div key={unit} className="flex flex-col items-center group">
              <div className="relative w-16 md:w-24 flex items-center justify-center mb-3 transition-transform duration-500 group-hover:-translate-y-2 bg-maroon-950 border-2 border-gold-500 rounded-t-full shadow-[0_15px_25px_rgba(0,0,0,0.7)]" style={{ height: '5rem' }}>
                <div className="absolute inset-1 border border-gold-500/30 rounded-t-full" />
                <span className="relative z-10 text-3xl md:text-5xl font-serif text-cream-50 font-bold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                  {value.toString().padStart(2, '0')}
                </span>
              </div>
              <span className="text-cream-100 font-extrabold text-[10px] md:text-xs tracking-[0.25em] uppercase font-sans drop-shadow-md">{unit}</span>
            </div>
          ))}
        </motion.div>

        {/* Date + Add to Calendar */}
        <motion.div
          className="flex flex-col items-center gap-4 mb-12 md:mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 via-cream-50 to-gold-400 bg-[length:200%_auto] animate-shimmer font-serif text-3xl md:text-5xl font-bold italic drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)] mb-2">
            29th December, 2026
          </p>

          {/* Add to Calendar button */}
          <ClickSparkles color="#FFD700">
            <button
              onClick={onCalendarClick}
              className="inline-flex items-center gap-4 px-10 py-4 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-600 bg-[length:200%_auto] animate-shimmer text-maroon-950 font-sans text-xs md:text-base tracking-[0.25em] uppercase font-extrabold rounded-full shadow-[0_0_30px_rgba(212,175,55,0.7)] hover:shadow-[0_0_60px_rgba(212,175,55,1)] hover:scale-110 border-2 border-gold-300 transition-all duration-300 active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 skew-x-12" />
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 transition-transform group-hover:scale-125" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Add to Calendar</span>
            </button>
          </ClickSparkles>
        </motion.div>

      </div>

      {/* Scroll indicator - Moved down slightly to avoid overlap */}
      <motion.div
        className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 3, duration: 1 }}
      >
        <span className="text-gold-500 font-extrabold text-[12px] md:text-sm tracking-[0.3em] uppercase mb-1 drop-shadow-[0_0_10px_rgba(212,175,55,0.8)] animate-pulse">Begin</span>
        <motion.div
          className="w-[3px] h-20 bg-gradient-to-b from-gold-500 to-transparent relative shadow-[0_0_15px_rgba(212,175,55,1)]"
          animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rotate-45 bg-gold-500 shadow-[0_0_20px_rgba(212,175,55,1)] animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;

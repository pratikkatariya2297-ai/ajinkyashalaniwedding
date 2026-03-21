import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const GlobalFestiveElements = () => {
  const elements = useMemo(() => {
    // 50 Unique, unrepeated Indian wedding motifs and symbols
    const signs = [
      '🪔', '🥥', '🐘', '🏵️', '🌹', '🌺', '🌸', '📿', '💍', '🥁', 
      '🎺', '💃', '🕉️', '🥭', '🌿', '🔥', '👑', '🙏', '✨', '🐪',
      '💖', '💝', '🦚', '🌼', '🌻', '💐', '🥂', '🍾', '🎉', '🎊',
      '📸', '🎵', '🎶', '👯', '🤵', '👰', '👗', '🧥', '🥻', '🍉',
      '🍯', '🍛', '🍲', '🍷', '🌙', '☀️', '⭐', '🌟', '💫', '🎇'
    ];
    
    // Map exactly one of each symbol so they never repeat!
    return signs.map((sign, i) => ({
      id: i,
      sign,
      left: `${(i / signs.length) * 100}%`, // Evenly distribute horizontally
      duration: 15 + Math.random() * 20, // Varied falling speed
      delay: Math.random() * 15, // Staggered entry
      size: 1.2 + Math.random() * 2, // Varied sizes for rich depth
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden mix-blend-screen opacity-90">
      {elements.map(el => (
        <motion.div
           key={el.id}
           className="absolute drop-shadow-[0_0_15px_rgba(212,175,55,1)]"
           style={{ left: el.left, fontSize: `${el.size}rem` }}
           animate={{
             top: ['-10%', '110%'], // Falls strictly within the container bounds
             rotate: [0, 360],
             opacity: [0, 0.8, 0] // High visibility fade
           }}
           transition={{
             duration: el.duration, // Restored normal duration
             delay: el.delay,
             repeat: Infinity,
             ease: 'linear'
           }}
        >
          {el.sign}
        </motion.div>
      ))}
    </div>
  );
};

export default GlobalFestiveElements;

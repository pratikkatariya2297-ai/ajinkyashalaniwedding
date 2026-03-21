import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const ClickSparkles = ({ children, color = '#FFD700' }) => {
  const [sparkles, setSparkles] = useState([]);

  const handleClick = useCallback((e) => {
    // Generate an ID for this burst
    const id = Date.now();
    const x = e.clientX;
    const y = e.clientY;

    // Create 16 gorgeous magical sparks
    const newSparkles = Array.from({ length: 16 }).map((_, i) => ({
      id: `${id}-${i}`,
      x,
      y,
      angle: (i / 16) * Math.PI * 2 + (Math.random() * 0.2), // slight random trajectory
      velocity: 60 + Math.random() * 120, // Explosive outward speed
      size: 4 + Math.random() * 6 // Varying particle sizes
    }));

    setSparkles(prev => [...prev, ...newSparkles]);

    // Cleanup the DOM after animation completes
    setTimeout(() => {
      setSparkles(prev => prev.filter(s => !s.id.startsWith(id.toString())));
    }, 1500);
  }, []);

  return (
    <>
      <div 
        onClickCapture={handleClick} 
        className="inline-block"
      >
        {children}
      </div>
      
      {/* Fixed positioning guarantees the sparks align perfectly with clientX/clientY globally */}
      {sparkles.map(sparkle => (
        <motion.div
          key={sparkle.id}
          initial={{ 
            x: sparkle.x, 
            y: sparkle.y, 
            scale: 0, 
            opacity: 1 
          }}
          animate={{ 
            x: sparkle.x + Math.cos(sparkle.angle) * sparkle.velocity, 
            y: sparkle.y + Math.sin(sparkle.angle) * sparkle.velocity,
            scale: [0, 1.5, 0], // Pop in and shrink out smoothly
            opacity: [1, 1, 0],
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.8 + Math.random() * 0.4, ease: "easeOut" }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: sparkle.size,
            height: sparkle.size,
            clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)', // Star shape!
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}, 0 0 20px ${color}`,
            pointerEvents: 'none',
            zIndex: 99999
          }}
        />
      ))}
    </>
  );
};

export default ClickSparkles;

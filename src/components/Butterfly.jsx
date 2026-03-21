import React from 'react';

const Butterfly = ({ delay = '0s', duration = '20s', colorHue = '0deg', scale = 1, path = 'floatPath1', mode = 'fly', top = '20%', left = '20%' }) => {
  const isHanging = mode === 'hanging';
  
  return (
    <div 
      className="fixed z-[9998] pointer-events-none opacity-90"
      style={{
        animation: isHanging 
          ? `animate-hanging-drift 20s ease-in-out infinite` 
          : `${path} ${duration} linear infinite`,
        animationDelay: delay,
        transform: `scale(${scale})`,
        left: isHanging ? left : 0,
        top: isHanging ? top : 0
      }}
    >
      <div className="animate-butterfly-bob">
        <div 
          className="flex perspective-[500px] transform-style-3d"
          style={{ 
            fontSize: `${1.6 * scale}rem`, 
            filter: `drop-shadow(0 10px 15px rgba(0,0,0,0.2)) hue-rotate(${colorHue})` 
          }}
        >
          <div className="animate-butterfly-flutter origin-center">🦋</div>
        </div>
      </div>
    </div>
  );
};

export default Butterfly;

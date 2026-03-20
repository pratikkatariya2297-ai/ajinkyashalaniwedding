import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music, VolumeX } from 'lucide-react';

const MusicToggle = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  // Using an audio placeholder URL - user can replace this with actual flute/sitar music later
  const audioRef = useRef(null);

  useEffect(() => {
    // Create new audio instance
    // Note: We're using a royalty-free calming instrumental loop as a placeholder
    audioRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/26/audio_d0c6ff1bc9.mp3?filename=indian-flute-114420.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const toggleMusic = () => {
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(e => console.log("Audio playback failed:", e));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <motion.button
      onClick={toggleMusic}
      className="fixed bottom-6 lg:bottom-12 right-6 lg:right-12 z-50 w-12 h-12 md:w-14 md:h-14 bg-emerald-900 border border-gold-500 rounded-full flex items-center justify-center text-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.3)] hover:scale-110 hover:bg-gold-500 hover:text-emerald-900 transition-all duration-300"
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 9 }} // Delay to appear after loader finishes
      aria-label="Toggle Background Music"
    >
      {isPlaying ? (
        <Music className="w-5 h-5 md:w-6 md:h-6 animate-pulse" />
      ) : (
        <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
      )}
      
      {/* Decorative spinning ring when playing */}
      {isPlaying && (
        <motion.div 
          className="absolute inset-0 rounded-full border border-gold-500 border-t-transparent"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      )}
    </motion.button>
  );
};

export default MusicToggle;

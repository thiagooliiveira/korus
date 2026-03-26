import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Plane } from 'lucide-react';

interface Props {
  destination: {
    id: string;
    name: string;
  };
  onComplete: () => void;
}

const CITY_PULSES: Record<string, { name: string; x: number; y: number }[]> = {
  usa: [
    { name: 'New York', x: 25, y: 35 },
    { name: 'Miami', x: 28, y: 55 },
    { name: 'Orlando', x: 27, y: 52 },
    { name: 'Los Angeles', x: 10, y: 45 },
  ],
  canada: [
    { name: 'Toronto', x: 25, y: 30 },
    { name: 'Vancouver', x: 10, y: 25 },
    { name: 'Montreal', x: 28, y: 28 },
  ],
  australia: [
    { name: 'Sydney', x: 85, y: 80 },
    { name: 'Melbourne', x: 82, y: 85 },
    { name: 'Brisbane', x: 88, y: 75 },
  ],
};

export const DestinationMapIntro: React.FC<Props> = ({ destination, onComplete }) => {
  const [showCities, setShowCities] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCities(true), 1000);
    const endTimer = setTimeout(onComplete, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  const cities = CITY_PULSES[destination.id] || [];

  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center z-50 overflow-hidden">
      {/* Background World Map (Stylized SVG) */}
      <motion.div 
        initial={{ scale: 1, opacity: 0 }}
        animate={{ scale: 1.5, opacity: 0.3 }}
        transition={{ duration: 5, ease: "easeOut" }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <svg viewBox="0 0 1000 500" className="w-full h-full text-zinc-800 fill-current opacity-20">
          <path d="M150,150 Q200,100 250,150 T350,150 T450,150 T550,150 T650,150 T750,150 T850,150" stroke="currentColor" strokeWidth="1" fill="none" />
          {/* Simple stylized world map path */}
          <path d="M200,100 L250,80 L300,100 L350,120 L300,150 L250,180 L200,150 Z" /> {/* Americas approx */}
          <path d="M500,100 L550,80 L600,100 L650,120 L600,150 L550,180 L500,150 Z" /> {/* Eurasia approx */}
          <path d="M800,350 L850,330 L900,350 L950,370 L900,400 L850,430 L800,400 Z" /> {/* Oceania approx */}
        </svg>
      </motion.div>

      {/* Connection Lines (Visual Effect) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2, ease: "easeInOut" }}
          d="M 100 400 Q 500 100 900 400"
          stroke="url(#lineGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="10 5"
        />
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00ff88" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
        </defs>
      </svg>

      {/* Destination Focus */}
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="mb-8"
        >
          <div className="w-32 h-32 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto relative">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 rounded-full bg-emerald-500/10"
            />
            <MapPin size={48} className="text-emerald-400" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-5xl font-black tracking-tighter text-white mb-4"
        >
          Destino: <span className="brand-text-gradient">{destination.name}</span>
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex items-center justify-center gap-2 text-zinc-500 font-bold uppercase tracking-widest text-xs"
        >
          <Plane size={14} className="animate-pulse" />
          Mapeando Oportunidades
        </motion.div>

        {/* Pulsing Cities */}
        <AnimatePresence>
          {showCities && cities.map((city, i) => (
            <motion.div
              key={city.name}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ delay: i * 0.2 }}
              className="absolute"
              style={{ left: `${city.x}%`, top: `${city.y}%` }}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-4 h-4 bg-emerald-500 rounded-full animate-ping opacity-75" />
                <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                <span className="absolute top-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-black text-white/60 uppercase tracking-tighter">
                  {city.name}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,255,136,0.02)_50%)] bg-[length:100%_4px]" />
    </div>
  );
};

'use client';

import { motion } from 'framer-motion';
import { Sparkles, Leaf } from 'lucide-react';

export function BookShowcase() {
  return (
    <div className="relative w-full max-w-[480px] h-[420px] mx-auto flex items-center justify-center select-none">
      {/* Glow Backdrop */}
      <div className="absolute w-72 h-72 rounded-full bg-brand-accent/15 blur-3xl -z-10 pointer-events-none" />

      {/* Hover container fanning trigger */}
      <motion.div 
        className="relative w-full h-full flex items-center justify-center cursor-pointer"
        whileHover="hover"
        initial="initial"
      >
        {/* Floating gold particles on hover */}
        <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-brand-accent/30"
              style={{
                top: `${40 + (i * 10)}%`,
                left: `${30 + (i * 8)}%`,
              }}
              variants={{
                initial: { opacity: 0, y: 0, scale: 0 },
                hover: {
                  opacity: [0, 0.7, 0],
                  y: -120 - (i * 20),
                  x: (i % 2 === 0 ? 30 : -30) + (i * 5),
                  scale: [0, 1.2, 0.5],
                  transition: {
                    duration: 2.5 + (i * 0.3),
                    repeat: Infinity,
                    delay: i * 0.15,
                  }
                }
              }}
            >
              <Leaf className="w-5 h-5 fill-current" />
            </motion.div>
          ))}
        </div>

        {/* --- BOOK 1: MONSOON MEMOIRS (Left, Green) --- */}
        <motion.div
          className="absolute w-[200px] h-[280px] rounded-r-lg shadow-xl origin-bottom-left"
          variants={{
            initial: { rotate: -8, x: -35, zIndex: 10, scale: 0.95 },
            hover: { 
              rotate: -20, 
              x: -95, 
              y: -10,
              zIndex: 10, 
              scale: 0.98,
              boxShadow: '0 25px 50px -12px rgba(26, 60, 46, 0.3)'
            }
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          {/* Cover structure */}
          <div className="w-full h-full rounded-r-lg bg-[#112a1e] border-l-[6px] border-brand-accent/40 p-5 flex flex-col justify-between text-text-inverse relative overflow-hidden">
            {/* Fine border line */}
            <div className="absolute inset-2 border border-brand-accent/20 rounded-r-sm pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[10px] tracking-widest text-brand-accent/80 font-semibold uppercase block mb-1">
                Poetry Collection
              </span>
              <h4 className="font-display text-heading-md font-bold leading-tight mt-1 text-[#f9f5ef]">
                Monsoon<br />Memoirs
              </h4>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-[#f9f5ef]/10 pt-3">
              <span className="text-[10px] text-[#f9f5ef]/70 tracking-wider">Rajesh Nair</span>
              <Sparkles className="w-3.5 h-3.5 text-brand-accent" />
            </div>

            {/* Vintage aesthetic wash */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/5 pointer-events-none" />
          </div>
        </motion.div>

        {/* --- BOOK 2: FEARS THAT RHYME (Right, Gold Cream) --- */}
        <motion.div
          className="absolute w-[200px] h-[280px] rounded-r-lg shadow-xl origin-bottom-right"
          variants={{
            initial: { rotate: 8, x: 35, zIndex: 10, scale: 0.95 },
            hover: { 
              rotate: 20, 
              x: 95, 
              y: -10,
              zIndex: 10, 
              scale: 0.98,
              boxShadow: '0 25px 50px -12px rgba(201, 168, 76, 0.25)'
            }
          }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        >
          {/* Cover structure */}
          <div className="w-full h-full rounded-r-lg bg-[#f0e8d5] border-l-[6px] border-[#c4b189] p-5 flex flex-col justify-between text-[#2d220a] relative overflow-hidden">
            {/* Fine border line */}
            <div className="absolute inset-2 border border-[#bfa268]/20 rounded-r-sm pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[10px] tracking-widest text-[#8c6d2c] font-semibold uppercase block mb-1">
                Emily Dickinson Award
              </span>
              <h4 className="font-display text-heading-md font-bold leading-tight mt-1 text-[#2d220a]">
                Fears That<br />Rhyme
              </h4>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-[#2d220a]/10 pt-3">
              <span className="text-[10px] text-[#2d220a]/80 tracking-wider">Julie Dunic</span>
              <Leaf className="w-3.5 h-3.5 text-[#8c6d2c]" />
            </div>

            {/* Vintage paper texture wash */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/5 via-transparent to-white/10 pointer-events-none" />
          </div>
        </motion.div>

        {/* --- BOOK 3: PETRICHOR (Center, Burgundy Red) --- */}
        <motion.div
          className="absolute w-[210px] h-[290px] rounded-r-lg shadow-2xl z-20"
          variants={{
            initial: { rotate: 0, x: 0, y: 0, scale: 1 },
            hover: { 
              y: -25, 
              scale: 1.04,
              boxShadow: '0 30px 60px -15px rgba(0, 0, 0, 0.4)'
            }
          }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        >
          {/* Cover structure */}
          <div className="w-full h-full rounded-r-lg bg-[#4a1c1d] border-l-[6px] border-[#c9a84c] p-6 flex flex-col justify-between text-[#f9f5ef] relative overflow-hidden">
            {/* Delicate gold geometric outline */}
            <div className="absolute inset-2.5 border border-[#c9a84c]/30 rounded-r-sm pointer-events-none" />
            
            <div className="relative z-10">
              <span className="text-[9px] tracking-widest text-[#c9a84c] font-semibold uppercase block mb-1">
                Bestselling Poetry
              </span>
              <h4 className="font-display text-display-sm font-bold leading-tight mt-1 text-[#f9f5ef] tracking-wide">
                Petrichor
              </h4>
            </div>

            {/* Abstract line art drawing of a leaf/cloud */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10 scale-90 pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none" stroke="#c9a84c" strokeWidth="1.5">
                <path d="M50 10 C65 25, 80 40, 80 60 C80 75, 65 90, 50 90 C35 90, 20 75, 20 60 C20 40, 35 25, 50 10 Z" />
                <path d="M50 10 L50 90" strokeDasharray="3 3" />
                <path d="M50 30 C58 35, 68 40, 75 45" />
                <path d="M50 45 C42 50, 32 55, 25 60" />
                <path d="M50 60 C58 65, 68 70, 75 75" />
              </svg>
            </div>
            
            <div className="relative z-10 flex items-center justify-between border-t border-[#f9f5ef]/10 pt-3">
              <span className="text-[10px] text-[#f9f5ef]/70 tracking-wider">Onkar Kulkarni</span>
              <span className="w-2 h-2 rounded-full bg-[#c9a84c]" />
            </div>

            {/* Subtle highlight sheen */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/35 via-transparent to-white/10 pointer-events-none" />
          </div>
        </motion.div>

        {/* Tactile Book Edges/Pages shadow effect underneath */}
        <div className="absolute w-[204px] h-[8px] bg-black/30 blur-[2px] rounded-full bottom-[-10px] left-[50%] -translate-x-[50%] -z-10 pointer-events-none" />
      </motion.div>
    </div>
  );
}

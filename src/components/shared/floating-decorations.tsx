'use client';

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';
import { Leaf, BookOpen, PenTool, Sparkles, Feather } from 'lucide-react';

export function FloatingDecorations() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring physics for parallax lag
  const springConfig = { damping: 50, stiffness: 100 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map screen coordinates to -1 to 1 range
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouseX.set(x);
      mouseY.set(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Map mouse movement to different offsets to create layers (depth)
  const x1 = useTransform(smoothX, [-1, 1], [-25, 25]);
  const y1 = useTransform(smoothY, [-1, 1], [-25, 25]);

  const x2 = useTransform(smoothX, [-1, 1], [40, -40]);
  const y2 = useTransform(smoothY, [-1, 1], [30, -30]);

  const x3 = useTransform(smoothX, [-1, 1], [-15, 15]);
  const y3 = useTransform(smoothY, [-1, 1], [35, -35]);

  const x4 = useTransform(smoothX, [-1, 1], [20, -20]);
  const y4 = useTransform(smoothY, [-1, 1], [-20, 20]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
      {/* Element 1: Leaf outline top right */}
      <motion.div
        className="absolute top-[12%] right-[8%] opacity-[0.08] dark:opacity-[0.05]"
        style={{ x: x1, y: y1 }}
        animate={{ rotate: [0, 8, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Leaf className="w-20 h-20 text-brand-primary" strokeWidth={0.6} />
      </motion.div>

      {/* Element 2: Circle guide top left */}
      <motion.div
        className="absolute top-[18%] left-[6%] opacity-[0.08] dark:opacity-[0.05]"
        style={{ x: x2, y: y2 }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="w-28 h-28 rounded-full border border-brand-accent" />
      </motion.div>

      {/* Element 3: Book silhouette middle right */}
      <motion.div
        className="absolute top-[48%] right-[5%] opacity-[0.08] dark:opacity-[0.04]"
        style={{ x: x3, y: y3 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      >
        <BookOpen className="w-24 h-24 text-brand-primary" strokeWidth={0.5} />
      </motion.div>

      {/* Element 4: Quill Pen outline bottom left */}
      <motion.div
        className="absolute bottom-[15%] left-[8%] opacity-[0.08] dark:opacity-[0.04]"
        style={{ x: x4, y: y4 }}
        animate={{ rotate: [0, 10, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      >
        <Feather className="w-16 h-16 text-brand-primary" strokeWidth={0.6} />
      </motion.div>

      {/* Element 5: Small Sparkles middle left */}
      <motion.div
        className="absolute top-[40%] left-[18%] opacity-[0.07] dark:opacity-[0.04]"
        style={{ x: x1, y: y4 }}
        animate={{ scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Sparkles className="w-10 h-10 text-brand-accent" />
      </motion.div>

      {/* Element 6: Mini leaf bottom right */}
      <motion.div
        className="absolute bottom-[22%] right-[15%] opacity-[0.06] dark:opacity-[0.03]"
        style={{ x: x2, y: y3 }}
        animate={{ rotate: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      >
        <Leaf className="w-12 h-12 text-brand-accent" strokeWidth={0.8} />
      </motion.div>

      {/* Element 7: Concentric circle design bottom center */}
      <motion.div
        className="absolute bottom-[5%] left-[45%] opacity-[0.05] dark:opacity-[0.03]"
        style={{ x: x3, y: y1 }}
      >
        <div className="w-40 h-40 rounded-full border border-dashed border-brand-primary/40 flex items-center justify-center">
          <div className="w-32 h-32 rounded-full border border-brand-primary/20" />
        </div>
      </motion.div>
    </div>
  );
}

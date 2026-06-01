'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  /** Target number to count up to */
  value: number;
  /** Text appended after the number (e.g. '+') */
  suffix?: string;
  /** Text prepended before the number (e.g. '₹') */
  prefix?: string;
  /** Animation duration in milliseconds */
  duration?: number;
  className?: string;
}

/**
 * Format a number using the Indian numbering system.
 * e.g. 1234567 → "12,34,567"
 */
function formatIndian(n: number): string {
  const str = Math.floor(n).toString();
  if (str.length <= 3) return str;

  const last3 = str.slice(-3);
  const rest = str.slice(0, -3);

  // Insert commas every 2 digits in the remaining part
  const withCommas = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
  return `${withCommas},${last3}`;
}

export function AnimatedCounter({
  value,
  suffix = '',
  prefix = '',
  duration = 2000,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  const animate = useCallback(() => {
    if (hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();

    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out cubic for a decelerating feel
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.floor(eased * value));

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        setDisplay(value);
      }
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  useEffect(() => {
    if (inView) animate();
  }, [inView, animate]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {prefix}
      {formatIndian(display)}
      {suffix}
    </span>
  );
}

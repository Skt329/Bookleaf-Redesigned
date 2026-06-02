'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VideoReviewPlayerProps {
  videoId: string;
  title?: string;
  gradient?: string;
}

export function VideoReviewPlayer({
  videoId,
  title = 'Author Review Video',
  gradient = 'from-brand-primary to-brand-primary-light',
}: VideoReviewPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (isPlaying) {
    return (
      <div className="aspect-video w-full h-[220px] md:h-[260px] lg:h-[300px]">
        <iframe
          className="w-full h-full border-none"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => setIsPlaying(true)}
      className={cn(
        'h-56 md:h-64 flex items-center justify-center relative cursor-pointer group bg-gradient-to-br transition-all duration-300',
        gradient,
      )}
      role="button"
      tabIndex={0}
      aria-label={`Play video: ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          setIsPlaying(true);
        }
      }}
    >
      <div className="w-16 h-16 rounded-full bg-surface-card/20 backdrop-blur-sm flex items-center justify-center border-2 border-text-inverse/30 group-hover:scale-110 transition-transform duration-200">
        <Play className="w-6 h-6 text-text-inverse ml-0.5" fill="currentColor" />
      </div>
    </div>
  );
}

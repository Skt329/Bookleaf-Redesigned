'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';
import { getGenreGradient } from '@/lib/genre-gradients';
import { GENRES } from '@/constants';

const EASE = [0.25, 0.4, 0, 1] as [number, number, number, number];

interface BookCardProps {
  bookId: string;
  title: string;
  author: string;
  genre: string;
  mrp: number | null;
  coverImageUrl: string | null;
  index?: number;
}

export function BookCard({
  bookId,
  title,
  author,
  genre,
  mrp,
  coverImageUrl,
  index = 0,
}: BookCardProps) {
  const genreLabel =
    GENRES.find((g) => g.value === genre)?.label ?? genre;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: EASE }}
    >
      <Link
        href={`/bookstore/${bookId}`}
        className="group block card overflow-hidden no-underline transition-transform duration-300 hover:-translate-y-1"
      >
        {/* Cover */}
        <div
          className="relative aspect-[3/4] flex items-center justify-center overflow-hidden"
          style={{
            background: coverImageUrl
              ? undefined
              : getGenreGradient(genre),
          }}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt={`Cover of ${title}`}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <BookOpen
              className="size-16 text-text-inverse/20"
              strokeWidth={1}
            />
          )}

          {/* Genre badge */}
          <span
            className={cn(
              'badge absolute left-3 top-3',
              'bg-surface-card/90 text-text-primary backdrop-blur-sm text-caption',
            )}
          >
            {genreLabel}
          </span>
        </div>

        {/* Details */}
        <div className="p-4">
          <h3 className="font-display text-body-lg text-text-primary line-clamp-2 leading-snug">
            {title}
          </h3>
          <p className="mt-1 text-body-sm text-text-muted font-body truncate">
            by {author}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <span className="font-display text-heading-sm text-brand-accent font-bold">
              {mrp ? formatCurrency(mrp) : 'Price TBD'}
            </span>
            <span
              className={cn(
                'text-caption text-brand-primary font-medium font-body',
                'opacity-0 translate-x-2 transition-all duration-300',
                'group-hover:opacity-100 group-hover:translate-x-0',
              )}
            >
              View Details →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CheckCircle2, Clock, PenLine, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

interface PoemStatus {
  dayNumber: number;
  isDraft: boolean;
  title?: string;
}

interface ProgressTimelineProps {
  totalDays: number;
  todayDayNumber: number;
  poems: PoemStatus[];
  streak: number;
}

export function ProgressTimeline({
  totalDays,
  todayDayNumber,
  poems,
  streak,
}: ProgressTimelineProps) {
  const completedCount = poems.filter((p) => !p.isDraft).length;
  const progressPercent = Math.round((completedCount / totalDays) * 100);

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-heading-sm text-text-primary">
            Challenge Progress
          </h2>
          <p className="mt-0.5 text-body-sm text-text-muted">
            {completedCount} of {totalDays} poems saved
          </p>
        </div>
        <div className="flex items-center gap-4">
          {streak > 0 && (
            <div className="flex items-center gap-1.5 rounded-full bg-status-warning/10 px-3 py-1.5">
              <Flame className="size-4 text-status-warning" />
              <span className="text-body-sm font-semibold text-status-warning">
                {streak} day streak
              </span>
            </div>
          )}
          <div className="text-right">
            <span className="text-heading-md font-bold text-brand-accent">
              {progressPercent}%
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="h-3 w-full overflow-hidden rounded-full bg-surface-muted">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary via-brand-accent to-brand-accent"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />
        </div>
      </div>

      {/* Day Nodes */}
      <div className="flex items-center justify-between gap-0.5 overflow-x-auto pb-2 scrollbar-thin">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const poem = poems.find((p) => p.dayNumber === day);
          const isSaved = !!poem && !poem.isDraft;
          const isDraft = poem?.isDraft;
          const isToday = day === todayDayNumber;
          const isPast = day < todayDayNumber;
          const isFuture = day > todayDayNumber;
          const isMissed = isPast && !poem;

          return (
            <Link
              key={day}
              href={`/challenge/poems?day=${day}`}
              className="group flex flex-col items-center gap-1.5"
              title={
                poem
                  ? `Day ${day}: ${poem.title ?? (isSaved ? 'Saved' : 'Draft')}`
                  : `Day ${day}${isMissed ? ' (Missed)' : ''}`
              }
            >
              {/* Node */}
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-full border-2 text-caption font-bold transition-all duration-200',
                  // Saved
                  isSaved &&
                    'border-status-success bg-status-success text-white shadow-sm',
                  // Draft
                  isDraft &&
                    'border-status-warning bg-status-warning/20 text-status-warning',
                  // Today — not started
                  isToday &&
                    !poem &&
                    'border-brand-accent bg-brand-accent/10 text-brand-accent ring-2 ring-brand-accent/30 ring-offset-1 ring-offset-surface-card',
                  // Missed
                  isMissed &&
                    'border-status-danger/40 bg-status-danger/5 text-status-danger/60',
                  // Future
                  isFuture &&
                    'border-border bg-surface-muted text-text-muted/50',
                  // Hover
                  'group-hover:scale-110',
                )}
              >
                {isSaved ? (
                  <CheckCircle2 className="size-3.5" />
                ) : isDraft ? (
                  <Clock className="size-3" />
                ) : isToday && !poem ? (
                  <PenLine className="size-3" />
                ) : (
                  <span className="text-[10px]">{day}</span>
                )}
              </div>

              {/* Day label — show every 7th day, today, and day 1 */}
              {(day === 1 ||
                day === totalDays ||
                day % 7 === 0 ||
                isToday) && (
                <span
                  className={cn(
                    'text-[9px] font-medium',
                    isToday ? 'text-brand-accent' : 'text-text-muted',
                  )}
                >
                  {isToday ? 'Today' : `D${day}`}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import { ProgressTimeline } from './progress-timeline';
import {
  Sparkles,
  PenLine,
  CalendarDays,
  Flame,
  Clock,
  ArrowRight,
  BookOpen,
} from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Dashboard — #TheWriteAngle',
  description:
    'Track your 21-day writing challenge progress, poems, and streak.',
};

// Rotating motivational prompts
const PROMPTS = [
  'Write about a memory that shaped who you are today.',
  'Describe the view from a window you love.',
  'Write a letter to your past self.',
  'Capture a moment of silence in words.',
  'Describe the taste of your favorite childhood food.',
  'Write about someone who believed in you.',
  'Paint a rainy evening with your words.',
  "Describe a place you've never been but dream of visiting.",
  'Write about finding beauty in something ordinary.',
  'Capture the feeling of a new beginning.',
  "Write about a conversation you wish you'd had.",
  'Describe the sound of your city at midnight.',
  'Write about the space between two heartbeats.',
  'Capture the feeling of reading your favorite book.',
  'Write about what home means to you.',
  'Describe a color without naming it.',
  'Write about a journey that changed your perspective.',
  'Capture the smell of a season changing.',
  'Write about courage in a quiet form.',
  'Describe the feeling of creating something from nothing.',
  'Write about the last page of a chapter closing.',
];

export default async function ChallengeDashboardPage() {
  const session = await auth();
  const userId = session!.user.id;

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { userId, paymentStatus: 'PAID' },
    include: {
      challenge: { select: { durationDays: true, title: true } },
      dailyPoems: { orderBy: { dayNumber: 'asc' } },
    },
  });

  if (!registration) return null;

  const totalDays = registration.challenge.durationDays;
  const startDate = registration.personalStartDate ?? registration.registeredAt;

  // Calculate today's day number
  const msSinceStart = Date.now() - new Date(startDate).getTime();
  const daysSinceStart = Math.ceil(msSinceStart / (1000 * 60 * 60 * 24));
  const todayDayNumber = Math.min(totalDays, Math.max(1, daysSinceStart));

  const daysRemaining = Math.max(0, totalDays - todayDayNumber);
  const savedPoems = registration.dailyPoems.filter((p) => !p.isDraft);
  const poemsSaved = savedPoems.length;

  // FIXED streak calculation: count consecutive days backward from today
  // Only consider poems with dayNumber <= todayDayNumber
  let streak = 0;
  for (let day = todayDayNumber; day >= 1; day--) {
    const hasPoemForDay = registration.dailyPoems.some(
      (p) => p.dayNumber === day,
    );
    if (hasPoemForDay) {
      streak++;
    } else {
      break;
    }
  }

  const isCompleted = todayDayNumber >= totalDays && poemsSaved >= totalDays;
  const todayPrompt = PROMPTS[(todayDayNumber - 1) % PROMPTS.length];
  const todayPoem = registration.dailyPoems.find(
    (p) => p.dayNumber === todayDayNumber,
  );

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <Sparkles className="size-7 text-brand-accent" />
            <h1 className="font-display text-display-sm text-text-primary">
              #TheWriteAngle
            </h1>
          </div>
          <p className="mt-1 text-body-md text-text-secondary">
            {isCompleted
              ? 'Challenge complete — your book is ready to compile!'
              : `Day ${todayDayNumber} of ${totalDays} — Keep writing!`}
          </p>
        </div>

        {/* Quick actions */}
        <Link
          href={`/challenge/poems?day=${todayDayNumber}`}
          className="hidden items-center gap-2 rounded-xl bg-brand-accent px-5 py-2.5 font-body text-body-md font-semibold text-brand-dark shadow-gold transition-all hover:bg-brand-accent-hover hover:shadow-lg sm:inline-flex"
          id="dashboard-write-today"
        >
          <PenLine className="size-4" />
          Write Today
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Poems Saved',
            value: `${poemsSaved}/${totalDays}`,
            icon: PenLine,
            color: 'text-brand-accent',
            bg: 'bg-brand-accent/10',
          },
          {
            label: 'Days Left',
            value: daysRemaining.toString(),
            icon: CalendarDays,
            color: 'text-status-info',
            bg: 'bg-status-info/10',
          },
          {
            label: 'Current Streak',
            value: `${streak} day${streak !== 1 ? 's' : ''}`,
            icon: Flame,
            color: 'text-status-warning',
            bg: 'bg-status-warning/10',
          },
          {
            label: 'Drafts',
            value: registration.dailyPoems
              .filter((p) => p.isDraft)
              .length.toString(),
            icon: Clock,
            color: 'text-text-muted',
            bg: 'bg-surface-muted',
          },
        ].map((card) => (
          <div key={card.label} className="card flex items-center gap-3 p-4">
            <div
              className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-xl',
                card.bg,
              )}
            >
              <card.icon className={cn('size-5', card.color)} />
            </div>
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                {card.label}
              </p>
              <p className="text-heading-md font-bold text-text-primary">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Timeline */}
      <ProgressTimeline
        totalDays={totalDays}
        todayDayNumber={todayDayNumber}
        poems={registration.dailyPoems.map((p) => ({
          dayNumber: p.dayNumber,
          isDraft: p.isDraft,
          title: p.title,
        }))}
        streak={streak}
      />

      {/* Today's Writing Section */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Writing Prompt */}
        <div className="card-accent p-6">
          <div className="mb-3 flex items-center gap-2">
            <Sparkles className="size-5 text-brand-accent" />
            <h3 className="font-display text-heading-sm text-text-primary">
              Today&apos;s Prompt
            </h3>
          </div>
          <p className="mb-5 text-body-md italic leading-relaxed text-text-secondary">
            &ldquo;{todayPrompt}&rdquo;
          </p>
          <Link
            href={`/challenge/poems?day=${todayDayNumber}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-4 py-2 text-body-sm font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover"
            id="dashboard-start-writing"
          >
            <PenLine className="size-4" />
            {todayPoem ? 'Continue Writing' : 'Start Writing'}
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="card p-6">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-heading-sm text-text-primary">
              Recent Poems
            </h3>
            <Link
              href="/challenge/progress"
              className="flex items-center gap-1 text-body-sm font-medium text-brand-accent hover:text-brand-accent-hover"
            >
              View All <ArrowRight className="size-3.5" />
            </Link>
          </div>
          <div className="space-y-2">
            {registration.dailyPoems
              .slice(-4)
              .reverse()
              .map((poem) => (
                <Link
                  key={poem.id}
                  href={`/challenge/poems?day=${poem.dayNumber}`}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5 transition-colors hover:bg-surface-muted"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-md bg-brand-accent/10 text-caption font-bold text-brand-accent">
                      {poem.dayNumber}
                    </span>
                    <span className="text-body-sm font-medium text-text-primary">
                      {poem.title}
                    </span>
                  </div>
                  <span className="text-caption text-text-muted">
                    {poem.wordCount} words
                  </span>
                </Link>
              ))}
            {registration.dailyPoems.length === 0 && (
              <p className="py-4 text-center text-body-sm text-text-muted">
                No poems yet — start writing!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Book compilation CTA — show when challenge is complete */}
      {isCompleted && (
        <div className="card overflow-hidden">
          <div className="flex items-center gap-6 bg-gradient-to-r from-brand-primary to-brand-accent p-8">
            <BookOpen className="size-12 shrink-0 text-white" />
            <div className="flex-1">
              <h3 className="font-display text-heading-lg text-white">
                Your Book is Ready!
              </h3>
              <p className="mt-1 text-body-md text-white/80">
                All {totalDays} poems are saved. Design your cover and compile
                your book.
              </p>
            </div>
            <Link
              href="/challenge/book"
              className="shrink-0 rounded-xl bg-white px-6 py-3 font-body text-body-md font-bold text-brand-primary shadow-lg transition-all hover:bg-brand-cream hover:shadow-xl"
              id="dashboard-compile-book"
            >
              Compile Book →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

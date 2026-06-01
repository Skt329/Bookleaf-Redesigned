import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  PenLine,
  CalendarDays,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Challenge Dashboard',
  description:
    'Track your 21-day writing challenge progress, poems, and streak.',
};

export default async function ChallengeDashboardPage() {
  const session = await auth();
  // Layout already guarantees session + paid registration
  const userId = session!.user.id;

  // Fetch the user's PAID registration with poems
  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { userId, paymentStatus: 'PAID' },
    include: {
      challenge: { select: { durationDays: true, title: true } },
      dailyPoems: { orderBy: { dayNumber: 'asc' } },
    },
  });

  // Should never happen (layout gates this), but guard anyway
  if (!registration) return null;

  const totalDays = registration.challenge.durationDays;
  const startDate = registration.personalStartDate ?? registration.registeredAt;

  // Calculate today's day number from the individual's personal start date
  const daysSinceStart = Math.ceil(
    (Date.now() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24),
  );
  const todayDayNumber = Math.min(totalDays, Math.max(1, daysSinceStart));

  const daysRemaining = Math.max(0, totalDays - todayDayNumber);
  const poemsWritten = registration.dailyPoems.filter(
    (p) => !p.isDraft,
  ).length;

  // Calculate streak (consecutive submitted days counting backwards from latest)
  let streak = 0;
  const submitted = registration.dailyPoems
    .filter((p) => !p.isDraft)
    .sort((a, b) => b.dayNumber - a.dayNumber);
  for (let i = 0; i < submitted.length; i++) {
    const expectedDay = todayDayNumber - i;
    if (submitted[i].dayNumber === expectedDay) {
      streak++;
    } else {
      break;
    }
  }

  const isCompleted = todayDayNumber > totalDays;

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <div className="flex items-center gap-3">
          <Sparkles className="size-8 text-brand-accent" />
          <h1 className="font-display text-display-sm text-text-primary">
            #TheWriteAngle
          </h1>
        </div>
        <p className="mt-1 text-body-md text-text-secondary">
          {isCompleted
            ? 'Challenge complete! Your book is being prepared for publishing.'
            : `Day ${todayDayNumber} of ${totalDays} — Keep the momentum going!`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: 'Poems Written',
            value: `${poemsWritten}/${totalDays}`,
            icon: PenLine,
            bgClass: 'bg-brand-accent/10',
            iconClass: 'text-brand-accent',
          },
          {
            label: 'Days Remaining',
            value: daysRemaining.toString(),
            icon: CalendarDays,
            bgClass: 'bg-status-info/10',
            iconClass: 'text-status-info',
          },
          {
            label: 'Current Streak',
            value: `${streak} day${streak !== 1 ? 's' : ''}`,
            icon: Flame,
            bgClass: 'bg-status-warning/10',
            iconClass: 'text-status-warning',
          },
          {
            label: 'Completion',
            value: `${Math.round((poemsWritten / totalDays) * 100)}%`,
            icon: CheckCircle2,
            bgClass: 'bg-status-success/10',
            iconClass: 'text-status-success',
          },
        ].map((card) => (
          <div key={card.label} className="card flex items-start gap-4 p-5">
            <div
              className={cn(
                'flex size-12 shrink-0 items-center justify-center rounded-xl',
                card.bgClass,
              )}
            >
              <card.icon className={cn('size-6', card.iconClass)} />
            </div>
            <div>
              <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                {card.label}
              </p>
              <p className="mt-1 text-heading-md font-semibold text-text-primary">
                {card.value}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 21-Day Grid */}
      <div className="card p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-heading-sm text-text-primary">
            {totalDays}-Day Poem Grid
          </h2>
          <Link
            href="/challenge/poems"
            className="flex items-center gap-1 text-body-sm font-medium text-brand-accent transition-colors hover:text-brand-accent-hover"
          >
            View All <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: totalDays }, (_, i) => {
            const day = i + 1;
            const poem = registration.dailyPoems.find(
              (p) => p.dayNumber === day,
            );
            const isSubmitted = poem && !poem.isDraft;
            const isDraft = poem?.isDraft;
            const isToday = day === todayDayNumber && !isCompleted;

            return (
              <Link
                key={day}
                href={`/challenge/poems?day=${day}`}
                className={cn(
                  'flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-all duration-200 hover:shadow-sm',
                  isSubmitted &&
                    'border-status-success bg-status-success/10 text-status-success',
                  isDraft &&
                    !isSubmitted &&
                    'border-status-warning bg-status-warning/10 text-status-warning',
                  !poem &&
                    isToday &&
                    'border-brand-accent border-2 bg-brand-accent/5 text-brand-accent',
                  !poem &&
                    !isToday &&
                    day < todayDayNumber &&
                    'border-status-error/30 bg-status-error/5 text-status-error',
                  !poem &&
                    !isToday &&
                    day > todayDayNumber &&
                    'border-border bg-surface-muted text-text-muted',
                )}
                id={`challenge-day-${day}`}
              >
                <span className="text-caption font-medium">Day</span>
                <span className="text-body-md font-bold">{day}</span>
                {isSubmitted && <CheckCircle2 className="mt-0.5 size-3.5" />}
                {isDraft && !isSubmitted && (
                  <Clock className="mt-0.5 size-3.5" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick link to today's poem */}
      {!isCompleted && (
        <div className="card-accent flex items-center justify-between p-6">
          <div>
            <h3 className="font-display text-heading-sm text-text-primary">
              Today&apos;s Poem — Day {todayDayNumber}
            </h3>
            <p className="mt-1 text-body-sm text-text-secondary">
              {registration.dailyPoems.find(
                (p) => p.dayNumber === todayDayNumber,
              )
                ? 'Continue editing your poem'
                : 'Start writing your poem for today'}
            </p>
          </div>
          <Link
            href={`/challenge/poems?day=${todayDayNumber}`}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 font-body text-body-md font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-gold"
            id="challenge-write-today"
          >
            <PenLine className="size-4" />
            Write Now
          </Link>
        </div>
      )}
    </div>
  );
}

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency, cn } from '@/lib/utils';
import {
  Sparkles,
  PenLine,
  CalendarDays,
  Flame,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { AuthorJoinChallengeCard } from './author-join-challenge-card';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Writing Challenge',
  description:
    'Join #TheWriteAngle 21-day writing challenge from your Author Portal.',
};

export default async function AuthorChallengePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const userId = session.user.id;

  // Fetch active challenge
  const challenge = await prisma.writingChallenge.findFirst({
    where: { status: 'ACTIVE' },
  });

  // Find registration
  const registration = challenge
    ? await prisma.writingChallengeRegistration.findFirst({
        where: { challengeId: challenge.id, userId },
        include: { dailyPoems: { orderBy: { dayNumber: 'asc' } } },
      })
    : null;

  const isPaid = registration?.paymentStatus === 'PAID';

  const poemsWritten =
    registration?.dailyPoems.filter((p) => !p.isDraft).length ?? 0;
  const totalDays = 21;

  const daysRemaining = registration?.personalEndDate
    ? Math.max(
        0,
        Math.ceil(
          (new Date(registration.personalEndDate).getTime() - Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : 0;

  const todayDayNumber = registration?.personalStartDate
    ? Math.min(
        totalDays,
        Math.max(
          1,
          Math.ceil(
            (Date.now() - new Date(registration.personalStartDate).getTime()) /
              (1000 * 60 * 60 * 24),
          ),
        ),
      )
    : 1;

  // Calculate streak
  let streak = 0;
  if (registration?.dailyPoems) {
    const submitted = registration.dailyPoems
      .filter((p) => !p.isDraft)
      .sort((a, b) => b.dayNumber - a.dayNumber);
    for (const poem of submitted) {
      streak++;
      const expectedDay = poemsWritten - streak + 1;
      if (poem.dayNumber !== expectedDay) {
        streak--;
        break;
      }
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <Sparkles className="size-8 text-brand-accent" />
          <h1 className="font-display text-display-sm text-text-primary">
            #TheWriteAngle Challenge
          </h1>
        </div>
        <p className="mt-1 text-body-md text-text-secondary">
          {isPaid
            ? `Day ${todayDayNumber} of ${totalDays} — Keep writing!`
            : 'Join the 21-day writing challenge from your Author Portal.'}
        </p>
      </div>

      {/* Not registered */}
      {(!registration || registration.paymentStatus === 'PENDING') &&
        challenge && (
          <AuthorJoinChallengeCard
            challengeId={challenge.id}
            title={challenge.title}
            price={challenge.price}
            originalPrice={challenge.originalPrice}
            hasPendingRegistration={registration?.paymentStatus === 'PENDING'}
          />
        )}

      {!challenge && (
        <div className="card p-8 text-center">
          <Sparkles className="mx-auto size-12 text-brand-accent/30" />
          <h2 className="mt-4 font-display text-heading-md text-text-primary">
            No Active Challenge
          </h2>
          <p className="mt-2 text-body-md text-text-secondary">
            There&apos;s no writing challenge running right now.
          </p>
        </div>
      )}

      {/* Active challenge — paid */}
      {isPaid && registration && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: 'Poems Written',
                value: poemsWritten.toString(),
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
            <h2 className="mb-5 font-display text-heading-sm text-text-primary">
              21-Day Poem Grid
            </h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: totalDays }, (_, i) => {
                const day = i + 1;
                const poem = registration.dailyPoems.find(
                  (p) => p.dayNumber === day,
                );
                const isSubmitted = poem && !poem.isDraft;
                const isDraft = poem?.isDraft;
                const isToday = day === todayDayNumber;

                return (
                  <div
                    key={day}
                    className={cn(
                      'flex aspect-square flex-col items-center justify-center rounded-lg border text-center transition-all duration-200',
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
                        'border-status-danger/30 bg-status-danger/5 text-status-danger',
                      !poem &&
                        !isToday &&
                        day > todayDayNumber &&
                        'border-border-muted bg-surface-muted text-text-muted',
                    )}
                    id={`author-challenge-day-${day}`}
                  >
                    <span className="text-caption font-medium">Day</span>
                    <span className="text-body-md font-bold">{day}</span>
                    {isSubmitted && (
                      <CheckCircle2 className="mt-0.5 size-3.5" />
                    )}
                    {isDraft && !isSubmitted && (
                      <Clock className="mt-0.5 size-3.5" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today's poem */}
          <div className="card-accent flex items-center justify-between p-6">
            <div>
              <h3 className="font-display text-heading-sm text-text-primary">
                Today&apos;s Poem — Day {todayDayNumber}
              </h3>
              <p className="mt-1 text-body-sm text-text-secondary">
                Write from your Author Portal
              </p>
            </div>
            <Link
              href={`/challenge/poems?day=${todayDayNumber}`}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-accent px-5 py-2.5 font-body text-body-md font-semibold text-brand-dark transition-all hover:bg-brand-accent-hover hover:shadow-gold"
              id="author-challenge-write-today"
            >
              <PenLine className="size-4" />
              Write Now
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

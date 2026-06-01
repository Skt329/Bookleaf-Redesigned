import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { cn } from '@/lib/utils';
import {
  TrendingUp,
  PenLine,
  Flame,
  FileText,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
} from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Progress — #TheWriteAngle Challenge',
  description:
    'View your writing challenge progress, stats, and daily submissions.',
};

export default async function ProgressPage() {
  const session = await auth();
  if (!session?.user) redirect('/challenge/login');

  const registration = await prisma.writingChallengeRegistration.findFirst({
    where: { userId: session.user.id, paymentStatus: 'PAID' },
    include: {
      challenge: { select: { durationDays: true, title: true } },
      dailyPoems: { orderBy: { dayNumber: 'asc' } },
    },
  });

  if (!registration) redirect('/writing-challenge');

  const totalDays = registration.challenge.durationDays;
  const startDate = registration.personalStartDate ?? registration.registeredAt;
  const msSinceStart = Date.now() - new Date(startDate).getTime();
  const daysSinceStart = Math.ceil(msSinceStart / (1000 * 60 * 60 * 24));
  const todayDayNumber = Math.min(totalDays, Math.max(1, daysSinceStart));

  const allPoems = registration.dailyPoems;
  const savedPoems = allPoems.filter((p) => !p.isDraft);
  const drafts = allPoems.filter((p) => p.isDraft);
  const totalWords = allPoems.reduce((sum, p) => sum + p.wordCount, 0);
  const avgWords = savedPoems.length > 0 ? Math.round(totalWords / savedPoems.length) : 0;

  // FIXED streak: count consecutive days backward from todayDayNumber
  let streak = 0;
  for (let day = todayDayNumber; day >= 1; day--) {
    if (allPoems.some((p) => p.dayNumber === day)) {
      streak++;
    } else {
      break;
    }
  }

  // Best streak
  let bestStreak = 0;
  let currentRun = 0;
  for (let day = 1; day <= todayDayNumber; day++) {
    if (allPoems.some((p) => p.dayNumber === day)) {
      currentRun++;
      bestStreak = Math.max(bestStreak, currentRun);
    } else {
      currentRun = 0;
    }
  }

  const completionPercent = Math.round((savedPoems.length / totalDays) * 100);
  const daysRemaining = Math.max(0, totalDays - todayDayNumber);
  const isCompleted = todayDayNumber >= totalDays && savedPoems.length >= totalDays;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3">
          <TrendingUp className="size-7 text-brand-accent" />
          <h1 className="font-display text-display-sm text-text-primary">
            My Progress
          </h1>
        </div>
        <p className="mt-1 text-body-md text-text-secondary">
          {isCompleted
            ? 'Challenge complete — all poems saved!'
            : `Day ${todayDayNumber} of ${totalDays} — ${daysRemaining} days remaining`}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          {
            label: 'Poems Saved',
            value: savedPoems.length.toString(),
            sub: `of ${totalDays}`,
            icon: CheckCircle2,
            color: 'text-status-success',
            bg: 'bg-status-success/10',
          },
          {
            label: 'Drafts',
            value: drafts.length.toString(),
            sub: 'in progress',
            icon: Clock,
            color: 'text-status-warning',
            bg: 'bg-status-warning/10',
          },
          {
            label: 'Total Words',
            value: totalWords.toLocaleString(),
            sub: `avg ${avgWords}/poem`,
            icon: FileText,
            color: 'text-status-info',
            bg: 'bg-status-info/10',
          },
          {
            label: 'Best Streak',
            value: `${bestStreak} day${bestStreak !== 1 ? 's' : ''}`,
            sub: `current: ${streak}`,
            icon: Flame,
            color: 'text-brand-accent',
            bg: 'bg-brand-accent/10',
          },
        ].map((stat) => (
          <div key={stat.label} className="card p-5">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-lg',
                  stat.bg,
                )}
              >
                <stat.icon className={cn('size-5', stat.color)} />
              </div>
              <div>
                <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
                  {stat.label}
                </p>
                <p className="text-heading-md font-semibold text-text-primary">
                  {stat.value}
                </p>
                <p className="text-caption text-text-muted">{stat.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="card p-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-heading-sm text-text-primary">
            Overall Completion
          </h2>
          <span className="text-heading-md font-bold text-brand-accent">
            {completionPercent}%
          </span>
        </div>
        <div className="h-4 w-full overflow-hidden rounded-full bg-surface-muted">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-accent transition-all duration-1000"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
        <p className="mt-2 text-caption text-text-muted">
          {savedPoems.length} of {totalDays} poems saved
        </p>
      </div>

      {/* Daily log */}
      <div className="card p-6">
        <h2 className="mb-4 font-display text-heading-sm text-text-primary">
          Daily Log
        </h2>
        <div className="space-y-1.5">
          {Array.from({ length: Math.min(totalDays, todayDayNumber) }, (_, i) => {
            const day = i + 1;
            const poem = allPoems.find((p) => p.dayNumber === day);
            const isSaved = poem && !poem.isDraft;
            const isDraft = poem?.isDraft;

            return (
              <Link
                key={day}
                href={`/challenge/poems?day=${day}`}
                className={cn(
                  'flex items-center justify-between rounded-lg border px-4 py-3 transition-colors hover:shadow-sm',
                  isSaved && 'border-status-success/30 bg-status-success/5 hover:bg-status-success/10',
                  isDraft && !isSaved && 'border-status-warning/30 bg-status-warning/5 hover:bg-status-warning/10',
                  !poem && 'border-border bg-surface-muted/50 hover:bg-surface-muted',
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      'flex size-8 items-center justify-center rounded-lg text-body-sm font-bold',
                      isSaved && 'bg-status-success/10 text-status-success',
                      isDraft && !isSaved && 'bg-status-warning/10 text-status-warning',
                      !poem && 'bg-surface-muted text-text-muted',
                    )}
                  >
                    {day}
                  </span>
                  <div>
                    <p className="text-body-sm font-medium text-text-primary">
                      {poem ? poem.title : `Day ${day}`}
                    </p>
                    <p className="text-caption text-text-muted">
                      {isSaved && `${poem.wordCount} words · Saved`}
                      {isDraft && !isSaved && `${poem!.wordCount} words · Draft`}
                      {!poem && 'Not started'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isSaved && <CheckCircle2 className="size-5 text-status-success" />}
                  {isDraft && !isSaved && <Clock className="size-5 text-status-warning" />}
                  {!poem && <PenLine className="size-5 text-text-muted/40" />}
                  <ArrowRight className="size-4 text-text-muted/40" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Completion badge */}
      {isCompleted && (
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-r from-brand-primary to-brand-accent p-8 text-center">
            <Award className="mx-auto size-16 text-white" />
            <h2 className="mt-4 font-display text-heading-lg text-white">
              Challenge Complete!
            </h2>
            <p className="mx-auto mt-2 max-w-md text-body-md text-white/80">
              Congratulations! You&apos;ve written a poem every day for{' '}
              {totalDays} days. Compile your book and get published!
            </p>
            <Link
              href="/challenge/book"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-body text-body-md font-bold text-brand-primary shadow-lg transition-all hover:bg-brand-cream hover:shadow-xl"
            >
              Compile My Book <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

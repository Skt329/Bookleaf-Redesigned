import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { formatCurrency, cn } from '@/lib/utils';
import { ChallengeParticipantTable } from './participant-table';

interface PageProps {
  params: Promise<{ challengeId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { challengeId } = await params;
  const challenge = await prisma.writingChallenge.findUnique({
    where: { id: challengeId },
    select: { title: true },
  });
  return { title: challenge ? `${challenge.title} — BookLeaf Admin` : 'Challenge — BookLeaf Admin' };
}

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-status-success/10 text-status-success',
  PAUSED: 'bg-surface-muted text-text-muted',
};

export default async function ChallengeDetailPage({ params }: PageProps) {
  const { challengeId } = await params;

  const challenge = await prisma.writingChallenge.findUnique({
    where: { id: challengeId },
    include: {
      registrations: {
        include: {
          user: { select: { name: true, email: true } },
          dailyPoems: { select: { id: true, isDraft: true } },
        },
      },
    },
  });

  if (!challenge) notFound();

  const booksReadyCount = challenge.registrations.filter(
    (r) => r.completedChallenge && !r.bookPublished
  ).length;

  const participants = challenge.registrations.map((r) => ({
    id: r.id,
    name: r.user.name || 'Unknown',
    email: r.user.email,
    paymentStatus: r.paymentStatus,
    poemsWritten: r.dailyPoems.filter((p) => !p.isDraft).length,
    completedChallenge: r.completedChallenge,
    bookPublished: r.bookPublished,
  }));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <p className="text-caption font-semibold uppercase tracking-wider text-text-muted">
          Challenge
        </p>
        <h1 className="mt-1 font-display text-display-sm text-text-primary">
          {challenge.title}
        </h1>
      </div>

      {/* Info cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <InfoCard label="Status">
          <span
            className={cn(
              'badge text-xs',
              statusColors[challenge.status] || 'bg-surface-muted text-text-muted'
            )}
          >
            {challenge.status.replace(/_/g, ' ')}
          </span>
        </InfoCard>
        <InfoCard label="Price" value={formatCurrency(challenge.price)} />
        <InfoCard label="Registrations" value={String(challenge.registrations.length)} />
      </div>

      {/* Participant table (client component for actions) */}
      <ChallengeParticipantTable
        challengeId={challengeId}
        participants={participants}
        booksReadyCount={booksReadyCount}
      />
    </div>
  );
}

function InfoCard({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="card px-4 py-3">
      <p className="text-caption font-semibold uppercase tracking-wider text-text-muted">
        {label}
      </p>
      {children ?? (
        <p className="mt-1 text-body-sm font-semibold text-text-primary">
          {value}
        </p>
      )}
    </div>
  );
}

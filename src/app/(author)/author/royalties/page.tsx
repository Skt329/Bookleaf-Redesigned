import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatCurrency } from '@/lib/utils';
import { ROYALTY_POLICY } from '@/constants';
import { RoyaltyTabs } from './royalty-tabs';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Royalties',
  description: 'View your royalty earnings, payouts, and pending amounts.',
};

export default async function RoyaltiesPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const author = await prisma.author.findFirst({
    where: { userId: session.user.id },
    include: {
      royaltyRecords: {
        include: { book: { select: { title: true } } },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  if (!author) redirect('/author/dashboard');

  const records = author.royaltyRecords.map((r) => ({
    id: r.id,
    bookTitle: r.book.title,
    quarter: r.quarter,
    copiesSold: r.copiesSoldThisQuarter,
    grossRoyalty: r.grossRoyalty,
    paid: r.royaltyPaid,
    pending: r.royaltyPending,
    status: r.payoutStatus,
  }));

  const summary = {
    totalEarned: author.totalRoyaltyEarned,
    totalPaid: author.totalRoyaltyPaid,
    totalPending: author.totalRoyaltyEarned - author.totalRoyaltyPaid,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          Royalties
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          Track your earnings and payout status.
        </p>
      </div>

      {/* Policy Info */}
      <div className="card-accent p-5">
        <h3 className="mb-2 text-body-md font-semibold text-text-primary">
          Royalty Policy
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div>
            <p className="text-caption text-text-muted">Author Split</p>
            <p className="text-body-md font-semibold text-brand-accent">
              {ROYALTY_POLICY.splitPercentage}%
            </p>
          </div>
          <div>
            <p className="text-caption text-text-muted">Payout Cycle</p>
            <p className="text-body-md font-semibold capitalize text-text-primary">
              {ROYALTY_POLICY.payoutCycle}
            </p>
          </div>
          <div>
            <p className="text-caption text-text-muted">Payout Window</p>
            <p className="text-body-md font-semibold text-text-primary">
              {ROYALTY_POLICY.payoutWindow} days
            </p>
          </div>
          <div>
            <p className="text-caption text-text-muted">Min. Threshold</p>
            <p className="text-body-md font-semibold text-text-primary">
              {formatCurrency(ROYALTY_POLICY.minimumThreshold)}
            </p>
          </div>
        </div>
      </div>

      <RoyaltyTabs records={records} summary={summary} />
    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatCurrency, cn } from '@/lib/utils';
import { EmptyState } from '@/components/shared';
import { Trophy } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Manage Challenges — BookLeaf Admin',
};

const statusColors: Record<string, string> = {
  ACTIVE: 'bg-status-success/10 text-status-success',
  PAUSED: 'bg-surface-muted text-text-muted',
};

export default async function AdminChallengesPage() {
  const challenges = await prisma.writingChallenge.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      registrations: {
        select: {
          id: true,
          paymentStatus: true,
          completedChallenge: true,
          bookPublished: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">
          Writing Challenges
        </h1>
        <p className="mt-1 text-body-md text-text-secondary">
          {challenges.length} challenge{challenges.length !== 1 ? 's' : ''}
        </p>
      </div>

      {challenges.length === 0 ? (
        <EmptyState
          icon={Trophy}
          title="No Challenges"
          description="No writing challenges have been created yet."
        />
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border bg-surface-muted">
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Title
                  </th>
                  <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                    Status
                  </th>

                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                    Registrations
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">
                    Paid
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted lg:table-cell">
                    Completed
                  </th>
                  <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted xl:table-cell">
                    Books Ready
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {challenges.map((c) => {
                  const totalRegs = c.registrations.length;
                  const paid = c.registrations.filter(
                    (r) => r.paymentStatus === 'PAID'
                  ).length;
                  const completed = c.registrations.filter(
                    (r) => r.completedChallenge
                  ).length;
                  const booksReady = c.registrations.filter(
                    (r) => r.completedChallenge && !r.bookPublished
                  ).length;

                  return (
                    <tr
                      key={c.id}
                      className="transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-5 py-4">
                        <Link
                          href={`/admin/challenges/${c.id}`}
                          className="text-body-sm font-semibold text-text-primary hover:text-brand-primary transition-colors"
                        >
                          {c.title}
                        </Link>
                        <p className="text-caption text-text-muted">
                          {formatCurrency(c.price)}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'badge text-xs',
                            statusColors[c.status] ||
                              'bg-surface-muted text-text-muted'
                          )}
                        >
                          {c.status.replace(/_/g, ' ')}
                        </span>
                      </td>

                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                        {totalRegs}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary lg:table-cell">
                        {paid}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary lg:table-cell">
                        {completed}
                      </td>
                      <td className="hidden px-5 py-4 xl:table-cell">
                        {booksReady > 0 ? (
                          <span className="badge text-xs bg-brand-accent/10 text-brand-accent">
                            {booksReady} ready
                          </span>
                        ) : (
                          <span className="text-body-sm text-text-muted">
                            0
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

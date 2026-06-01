'use client';

import { useState } from 'react';
import { formatCurrency, cn } from '@/lib/utils';

interface RoyaltyRecord {
  id: string;
  bookTitle: string;
  quarter: string;
  copiesSold: number;
  grossRoyalty: number;
  paid: number;
  pending: number;
  status: string;
}

interface RoyaltyTabsProps {
  records: RoyaltyRecord[];
  summary: {
    totalEarned: number;
    totalPaid: number;
    totalPending: number;
  };
}

const statusColors: Record<string, string> = {
  PAID: 'bg-status-success/10 text-status-success',
  PENDING: 'bg-status-warning/10 text-status-warning',
  OVERDUE: 'bg-status-danger/10 text-status-danger',
};

export function RoyaltyTabs({ records, summary }: RoyaltyTabsProps) {
  const [activeTab, setActiveTab] = useState<'books' | 'summary'>('books');

  return (
    <div>
      {/* Tab buttons */}
      <div className="flex w-fit gap-1 rounded-lg bg-surface-muted p-1">
        {(['books', 'summary'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'rounded-md px-4 py-2 text-body-sm font-medium transition-all',
              activeTab === tab
                ? 'bg-surface-card text-text-primary shadow-sm'
                : 'text-text-muted hover:text-text-secondary',
            )}
          >
            {tab === 'books' ? 'By Book' : 'Summary'}
          </button>
        ))}
      </div>

      {/* By Book Tab */}
      {activeTab === 'books' && (
        <div className="card mt-4 overflow-hidden">
          {records.length === 0 ? (
            <p className="p-8 text-center text-body-md text-text-muted">
              No royalty records found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border bg-surface-muted">
                    <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                      Book
                    </th>
                    <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                      Quarter
                    </th>
                    <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted sm:table-cell">
                      Copies
                    </th>
                    <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                      Gross
                    </th>
                    <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                      Paid
                    </th>
                    <th className="hidden px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted md:table-cell">
                      Pending
                    </th>
                    <th className="px-5 py-3.5 text-caption font-semibold uppercase tracking-wider text-text-muted">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-muted">
                  {records.map((r) => (
                    <tr
                      key={r.id}
                      className="transition-colors hover:bg-surface-muted/50"
                    >
                      <td className="px-5 py-4 text-body-sm font-medium text-text-primary">
                        {r.bookTitle}
                      </td>
                      <td className="px-5 py-4 text-body-sm text-text-secondary">
                        {r.quarter}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-text-secondary sm:table-cell">
                        {r.copiesSold}
                      </td>
                      <td className="px-5 py-4 text-body-sm font-medium text-text-primary">
                        {formatCurrency(r.grossRoyalty)}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-status-success md:table-cell">
                        {formatCurrency(r.paid)}
                      </td>
                      <td className="hidden px-5 py-4 text-body-sm text-status-warning md:table-cell">
                        {formatCurrency(r.pending)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={cn(
                            'badge',
                            statusColors[r.status] ??
                              'bg-surface-muted text-text-muted',
                          )}
                        >
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Summary Tab */}
      {activeTab === 'summary' && (
        <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="card p-6 text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
              Total Earned
            </p>
            <p className="mt-2 text-display-sm font-semibold text-status-success">
              {formatCurrency(summary.totalEarned)}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
              Total Paid
            </p>
            <p className="mt-2 text-display-sm font-semibold text-brand-primary">
              {formatCurrency(summary.totalPaid)}
            </p>
          </div>
          <div className="card p-6 text-center">
            <p className="text-caption font-medium uppercase tracking-wider text-text-muted">
              Total Pending
            </p>
            <p className="mt-2 text-display-sm font-semibold text-status-warning">
              {formatCurrency(summary.totalPending)}
            </p>
            {summary.totalPending > 0 && (
              <p className="mt-1 text-caption text-text-muted">
                Payouts processed quarterly
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

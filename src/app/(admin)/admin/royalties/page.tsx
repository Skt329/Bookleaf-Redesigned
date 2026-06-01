import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { formatCurrency, cn } from '@/lib/utils';
import { Wallet, TrendingUp, Clock, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = { title: 'Royalties — BookLeaf Admin' };

export default async function AdminRoyaltiesPage() {
  const records = await prisma.royaltyRecord.findMany({
    orderBy: [{ quarter: 'desc' }, { createdAt: 'desc' }],
    include: {
      book: { select: { title: true, bookId: true } },
      author: { include: { user: { select: { name: true } } } },
    },
  });

  const totalEarned = records.reduce((s, r) => s + r.grossRoyalty, 0);
  const totalPaid = records.reduce((s, r) => s + r.royaltyPaid, 0);
  const totalPending = records.reduce((s, r) => s + r.royaltyPending, 0);

  // Group by quarter
  const quarters = new Map<string, typeof records>();
  for (const r of records) {
    const list = quarters.get(r.quarter) || [];
    list.push(r);
    quarters.set(r.quarter, list);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-display-sm text-text-primary">Royalties</h1>
        <p className="mt-1 text-body-md text-text-secondary">Platform-wide royalty overview and payouts</p>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-text-muted text-body-sm"><Wallet className="size-4" /> Total Earned</div>
          <p className="mt-2 font-display text-heading-md text-text-primary">{formatCurrency(totalEarned)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-status-success text-body-sm"><CheckCircle2 className="size-4" /> Paid Out</div>
          <p className="mt-2 font-display text-heading-md text-status-success">{formatCurrency(totalPaid)}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-status-warning text-body-sm"><Clock className="size-4" /> Pending</div>
          <p className="mt-2 font-display text-heading-md text-status-warning">{formatCurrency(totalPending)}</p>
        </div>
      </div>

      {/* By quarter */}
      {Array.from(quarters.entries()).map(([quarter, recs]) => (
        <div key={quarter} className="card overflow-hidden">
          <div className="px-5 py-3.5 border-b border-border bg-surface-muted flex items-center justify-between">
            <h2 className="font-display text-heading-sm text-text-primary">{quarter}</h2>
            <span className="text-body-sm text-text-muted">
              {recs.length} record{recs.length !== 1 ? 's' : ''} · {formatCurrency(recs.reduce((s, r) => s + r.grossRoyalty, 0))}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Book</th>
                  <th className="hidden px-5 py-3 text-caption font-semibold uppercase text-text-muted sm:table-cell">Author</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Copies</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Gross</th>
                  <th className="hidden px-5 py-3 text-caption font-semibold uppercase text-text-muted md:table-cell">Paid</th>
                  <th className="px-5 py-3 text-caption font-semibold uppercase text-text-muted">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted">
                {recs.map((r) => (
                  <tr key={r.id} className="hover:bg-surface-muted/50 transition-colors">
                    <td className="px-5 py-3 text-body-sm font-semibold text-text-primary">{r.book.title}</td>
                    <td className="hidden px-5 py-3 text-body-sm text-text-secondary sm:table-cell">{r.author.user.name}</td>
                    <td className="px-5 py-3 text-body-sm text-text-secondary">{r.copiesSoldThisQuarter}</td>
                    <td className="px-5 py-3 text-body-sm text-text-primary font-medium">{formatCurrency(r.grossRoyalty)}</td>
                    <td className="hidden px-5 py-3 text-body-sm text-text-secondary md:table-cell">{formatCurrency(r.royaltyPaid)}</td>
                    <td className="px-5 py-3">
                      <span className={cn('badge text-xs',
                        r.payoutStatus === 'PAID' ? 'bg-status-success/10 text-status-success' :
                        r.payoutStatus === 'OVERDUE' ? 'bg-status-danger/10 text-status-danger' :
                        'bg-status-warning/10 text-status-warning'
                      )}>
                        {r.payoutStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {records.length === 0 && (
        <div className="card p-10 text-center">
          <Wallet className="size-10 text-text-muted mx-auto mb-3" />
          <p className="text-body-md text-text-muted">No royalty records yet</p>
        </div>
      )}
    </div>
  );
}
